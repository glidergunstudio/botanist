// ============================================================
// SHARED UI
// ============================================================

// ── Modal ────────────────────────────────────────────────────

function showModal(html) {
  document.getElementById('modalContent').innerHTML = html;
  document.getElementById('modalBg').classList.add('open');
}

function closeModal() {
  document.getElementById('modalBg').classList.remove('open');
}

document.getElementById('modalBg').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});

// ── Notification ─────────────────────────────────────────────

function notify(title, body = '', type = '') {
  const el = document.createElement('div');
  el.className = `notif ${type}`;
  el.innerHTML = `<div class="notif-title">${title}</div><div class="notif-body">${body}</div>`;

  // Stack vertically
  const area = document.getElementById('notifArea');
  const offset = area.children.length * 72;
  el.style.top = (64 + offset) + 'px';
  area.appendChild(el);

  setTimeout(() => { el.style.opacity = '0'; }, 2600);
  setTimeout(() => { el.remove(); }, 3100);
}

// ── Seed Bag (Left Sidebar) ───────────────────────────────────

function renderSeedBag() {
  const el = document.getElementById('seedBag');
  if (!STATE.seeds.length) {
    el.innerHTML = '<div class="empty-hint">種袋は空です<br>地図で種を拾いましょう</div>';
    return;
  }
  el.innerHTML = STATE.seeds.map(s => {
    const rc = RARITY[s.plant.rarity];
    return `
      <div class="seed-item ${STATE.selectedSeedId === s.id ? 'selected' : ''}"
           onclick="selectSeed('${s.id}')">
        <div class="seed-dot" style="background:${rc.color}"></div>
        <div class="seed-info">
          <div class="seed-name">${s.label}</div>
          <div class="seed-sub">${
            s.revealKey === 'full' || s.revealKey === 'species'
              ? s.plant.sciName
              : s.revealKey === 'genus'
              ? s.plant.sciName.split(' ')[0] + '属'
              : '鑑定不明'
          }</div>
        </div>
        <span class="rarity-badge r-${s.plant.rarity}">${rc.label}</span>
      </div>`;
  }).join('');
}

function selectSeed(id) {
  STATE.selectedSeedId = id;
  renderSeedBag();
  const seed = STATE.seeds.find(s => s.id === id);
  if (seed) renderSeedDetail(seed);
}

// ── Right Panel ──────────────────────────────────────────────

function renderSeedDetail(seed) {
  const p = seed.plant;
  const rc = RARITY[p.rarity];
  const isFull = seed.revealKey === 'full' || seed.revealKey === 'species';
  const isGenus = seed.revealKey === 'genus';

  document.getElementById('rightPanel').innerHTML = `
    <div class="detail-panel">
      <div style="font-size:40px;margin-bottom:6px">${isFull ? p.emoji : '🌰'}</div>
      <h3>${seed.label}</h3>
      <div style="color:${rc.color};font-size:11px;font-weight:700;letter-spacing:1px;margin-bottom:2px">
        ${rc.label.toUpperCase()}
      </div>
      ${isFull ? `<div style="color:var(--text3);font-size:11px;font-style:italic">${p.sciName}</div>` : ''}

      <div class="detail-section">
        <h4>鑑定レベル</h4>
        <div class="identify-bar">
          ${['shape','genus','species','full'].map((lv, i) => {
            const filled = ['shape','genus','species','full'].indexOf(seed.revealKey) >= i;
            return `<div class="identify-seg" style="background:${filled ? 'var(--green)' : 'var(--bg3)'}"></div>`;
          }).join('')}
        </div>
        <div style="font-size:10px;color:var(--text3);margin-top:2px">
          スキルLv${STATE.skillLevel} — ${
            seed.revealKey === 'full' ? '完全判明' :
            seed.revealKey === 'species' ? '種名まで判明' :
            seed.revealKey === 'genus' ? '属名まで判明' : 'ほぼ不明'
          }
        </div>
      </div>

      ${isFull ? `
      <div class="detail-section">
        <h4>形質</h4>
        ${Object.values(p.traits).map(v => `<span class="trait-tag">${v}</span>`).join('')}
      </div>
      <div class="detail-section">
        <h4>最適生育条件</h4>
        ${[
          ['🌡️ 温度', p.conditions.temp, '℃'],
          ['💧 水分', p.conditions.water, '%'],
          ['🧪 pH',  p.conditions.ph,    ''],
          ['🌿 肥料', p.conditions.fert,  '%'],
          ['☀️ 日照', p.conditions.light, '%'],
        ].map(([l, r, u]) => `
          <div class="cond-row">
            <span class="cond-label">${l}</span>
            <span class="cond-val">${r[0]}${u} 〜 ${r[1]}${u}</span>
          </div>`).join('')}
      </div>` : `
      <div style="color:var(--text3);font-size:12px;margin-top:14px;font-style:italic">
        スキルを上げると<br>詳細情報が判明します
      </div>`}

      <div style="margin-top:16px;display:flex;gap:6px;flex-wrap:wrap">
        <button class="action-btn primary" onclick="openPlantModal('${seed.id}')">🪴 植える</button>
        <button class="action-btn" onclick="sellSeed('${seed.id}')">
          💰 売る (${Math.round(p.marketPrice * 0.6)}G)
        </button>
      </div>
    </div>`;
}

function renderLogPanel() {
  document.getElementById('rightPanel').innerHTML = `
    <div class="detail-panel">
      <div class="section-title" style="margin:0 -14px;padding:12px 14px">フィールドノート</div>
      ${STATE.log.length === 0
        ? '<div class="empty-hint">まだ記録がありません</div>'
        : STATE.log.map(l => `
          <div class="log-item">
            <span class="log-time">${l.time}</span><br>${l.msg}
          </div>`).join('')}
    </div>`;
}

// ── Sell seed ────────────────────────────────────────────────

function sellSeed(seedId) {
  const seed = STATE.seeds.find(s => s.id === seedId);
  if (!seed) return;
  const price = Math.round(seed.plant.marketPrice * 0.6);
  removeSeedFromBag(seedId);
  STATE.gold += price;
  STATE.selectedSeedId = null;
  updateStats();
  renderSeedBag();
  renderLogPanel();
  addSeedToLog(`💰 ${seed.label}を${price}Gで売却`);
  notify('売却完了', `+${price}G`);
}

// ── Plant modal (from detail panel) ──────────────────────────

function openPlantModal(seedId) {
  const seed = STATE.seeds.find(s => s.id === seedId);
  if (!seed) return;
  const emptySlot = STATE.planters.findIndex(p => p === null);
  if (emptySlot === -1) {
    notify('プランターが満杯', '先に収穫してスロットを空けましょう', 'danger');
    return;
  }
  const isFull = seed.revealKey === 'full' || seed.revealKey === 'species';
  showModal(`
    <h2>🪴 植える</h2>
    <p>「${seed.label}」をプランター ${emptySlot + 1} 番に植えますか？</p>
    <div style="background:var(--bg3);border-radius:8px;padding:10px;font-size:12px;color:var(--text2);margin-bottom:4px">
      ${isFull
        ? `最適温度: ${seed.plant.conditions.temp[0]}〜${seed.plant.conditions.temp[1]}℃`
        : '種の詳細不明 — 育てながら観察しましょう'}
    </div>
    <div class="modal-btns">
      <button class="btn btn-secondary" onclick="closeModal()">キャンセル</button>
      <button class="btn btn-primary" onclick="doPlant('${seedId}', ${emptySlot})">植える</button>
    </div>`);
}

function doPlant(seedId, slot) {
  const seed = STATE.seeds.find(s => s.id === seedId);
  if (!seed) return;
  plantSeedToSlot(seedId, slot);
  closeModal();
  updateStats();
  renderSeedBag();
  renderLogPanel();
  addSeedToLog(`🪴 ${seed.label}をプランター${slot + 1}番に植えました`);
  notify('植付け完了', `プランター${slot + 1}番で育成開始`);
  startGrowth(slot);
  if (STATE.currentTab === 'planter') renderPlanter();
}
