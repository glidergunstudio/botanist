// ============================================================
// PLANTER — 生育管理
// ============================================================

function renderPlanter() {
  document.getElementById('mainContent').innerHTML = `
    <div class="planter-grid">
      ${STATE.planters.map((p, i) => p ? renderFilledSlot(p, i) : renderEmptySlot(i)).join('')}
    </div>`;
}

// ── スロット描画 ─────────────────────────────────────────────

function renderEmptySlot(i) {
  return `
    <div class="planter-card empty" onclick="openPickSeedModal(${i})">
      <div style="font-size:28px;opacity:.25">🪴</div>
      <div style="font-size:12px">空のプランター ${i + 1}</div>
      <div style="font-size:10px;color:var(--text3)">クリックで種を植える</div>
    </div>`;
}

function renderFilledSlot(p, i) {
  const c = p.plant.conditions;
  const stages = GROWTH_STAGES.map((_, s) => s <= p.stage);
  const health = p.health > 70 ? 'good' : p.health > 40 ? 'warn' : 'bad';
  const healthLabel = p.health > 70 ? '良好' : p.health > 40 ? '注意' : '危険';
  const stageEmoji = p.stage >= 4 ? p.plant.emoji : p.stage >= 2 ? '🌿' : '🌱';

  return `
    <div class="planter-card">
      <div class="planter-header">
        <div class="plant-emoji">${stageEmoji}</div>
        <div class="plant-meta">
          <div class="plant-title">${p.plant.name}</div>
          <div class="plant-stage">${GROWTH_STAGES[p.stage]} · ${p.age}ターン経過</div>
        </div>
        <span class="health-indicator health-${health}">${healthLabel} ${Math.round(p.health)}%</span>
      </div>

      <div class="planter-body">
        ${[
          ['🌡️ 温度', 'temp', '℃', c.temp, 45],
          ['💧 水分', 'water', '%',  c.water, 100],
          ['🧪 pH',  'ph',   '',   c.ph,    14],
          ['🌿 肥料', 'fert', '%',  c.fert,  100],
          ['☀️ 日照', 'light','%',  c.light, 100],
        ].map(([label, key, unit, range, max]) => `
          <div class="param-row">
            <div class="param-label">${label}</div>
            <div class="param-bar-bg">
              <div class="param-bar ${paramHealthColor(p.params[key], range)}"
                   style="width:${p.params[key] / max * 100}%"></div>
            </div>
            <div class="param-val">${p.params[key]}${unit}</div>
          </div>`).join('')}

        <div class="growth-stages">
          ${stages.map(done => `<div class="growth-step ${done ? 'done' : ''}"></div>`).join('')}
        </div>
      </div>

      <div class="planter-footer">
        <button class="action-btn" onclick="adjustParam(${i},'water',+15)">💧 水やり</button>
        <button class="action-btn" onclick="adjustParam(${i},'fert',+20)">🌿 肥料</button>
        <button class="action-btn" onclick="openTempModal(${i})">🌡️ 温度</button>
        <button class="action-btn" onclick="adjustParam(${i},'light',+15)">☀️ 日照</button>
        ${p.stage >= 5
          ? `<button class="action-btn gold" onclick="harvest(${i})">🌸 収穫</button>`
          : ''}
      </div>
    </div>`;
}

// ── パラメータ調整 ───────────────────────────────────────────

function adjustParam(slot, key, delta) {
  const p = STATE.planters[slot];
  if (!p) return;
  const max = key === 'ph' ? 14 : 100;
  p.params[key] = clamp(p.params[key] + delta, 0, max);
  if (STATE.currentTab === 'planter') renderPlanter();
}

function openTempModal(slot) {
  const p = STATE.planters[slot];
  showModal(`
    <h2>🌡️ 温度調整</h2>
    <p>プランター${slot + 1}の温度を設定します。<br>
    現在: <strong style="color:var(--green)">${p.params.temp}℃</strong><br>
    最適範囲: ${p.plant.conditions.temp[0]}〜${p.plant.conditions.temp[1]}℃</p>
    <input type="range" id="tempRange" min="0" max="45" value="${p.params.temp}"
      oninput="document.getElementById('tempDisp').textContent=this.value+'℃'"
      style="width:100%;accent-color:var(--green);margin:8px 0">
    <div id="tempDisp" style="text-align:center;color:var(--green);font-size:18px">${p.params.temp}℃</div>
    <div class="modal-btns">
      <button class="btn btn-secondary" onclick="closeModal()">キャンセル</button>
      <button class="btn btn-primary"
        onclick="applyTemp(${slot}, +document.getElementById('tempRange').value)">設定</button>
    </div>`);
}

function applyTemp(slot, val) {
  STATE.planters[slot].params.temp = val;
  closeModal();
  if (STATE.currentTab === 'planter') renderPlanter();
}

function openPHModal(slot) {
  const p = STATE.planters[slot];
  showModal(`
    <h2>🧪 pH調整</h2>
    <p>土壌酸度を設定します（${p.plant.conditions.ph[0]}〜${p.plant.conditions.ph[1]}が最適）</p>
    <input type="range" id="phRange" min="0" max="14" step="0.5" value="${p.params.ph}"
      oninput="document.getElementById('phDisp').textContent=this.value"
      style="width:100%;accent-color:var(--green);margin:8px 0">
    <div id="phDisp" style="text-align:center;color:var(--green);font-size:18px">${p.params.ph}</div>
    <div class="modal-btns">
      <button class="btn btn-secondary" onclick="closeModal()">キャンセル</button>
      <button class="btn btn-primary"
        onclick="applyPH(${slot}, +document.getElementById('phRange').value)">設定</button>
    </div>`);
}

function applyPH(slot, val) {
  STATE.planters[slot].params.ph = val;
  closeModal();
  if (STATE.currentTab === 'planter') renderPlanter();
}

// ── 種を選んで植えるモーダル ──────────────────────────────────

function openPickSeedModal(slot) {
  if (STATE.seeds.length === 0) {
    notify('種がありません', '地図で種を拾いましょう', 'danger');
    return;
  }
  showModal(`
    <h2>🪴 種を選んで植える</h2>
    <p>プランター${slot + 1}番に植える種を選択してください</p>
    <div style="max-height:220px;overflow-y:auto;margin-bottom:10px">
      ${STATE.seeds.map(s => `
        <div class="seed-item" style="border-radius:8px;margin-bottom:4px;cursor:pointer"
             onclick="doPlant('${s.id}',${slot});closeModal()">
          <div class="seed-dot" style="background:${RARITY[s.plant.rarity].color}"></div>
          <div class="seed-info">
            <div class="seed-name">${s.label}</div>
            <div class="seed-sub">${RARITY[s.plant.rarity].label}</div>
          </div>
        </div>`).join('')}
    </div>
    <button class="btn btn-secondary" onclick="closeModal()">キャンセル</button>`);
}

// ── 成長タイマー ─────────────────────────────────────────────

function startGrowth(slot) {
  if (STATE.growthTimers[slot]) clearInterval(STATE.growthTimers[slot]);

  STATE.growthTimers[slot] = setInterval(() => {
    const p = STATE.planters[slot];
    if (!p || p.harvested) {
      clearInterval(STATE.growthTimers[slot]);
      delete STATE.growthTimers[slot];
      return;
    }

    p.age++;
    const c = p.plant.conditions;

    // 健康度ペナルティ計算
    let penalty = 0;
    if (p.params.temp  < c.temp[0]  - 5 || p.params.temp  > c.temp[1]  + 5) penalty += 3;
    if (p.params.water < c.water[0] - 10 || p.params.water > c.water[1] + 10) penalty += 2;
    if (p.params.ph    < c.ph[0]    - 1  || p.params.ph    > c.ph[1]    + 1)  penalty += 2;
    if (p.params.fert  < c.fert[0]  - 10) penalty += 1;
    if (p.params.light < c.light[0] - 10) penalty += 1;

    p.health = clamp(p.health - penalty + (penalty === 0 ? 0.5 : 0), 0, 100);

    // 自然減少
    p.params.water = clamp(p.params.water - rand(1, 3), 0, 100);
    p.params.fert  = clamp(p.params.fert  - rand(0, 2), 0, 100);

    // ステージ更新
    const stageThresholds = [0, 2, 5, 9, 13, 18];
    const newStage = stageThresholds.filter(t => p.age >= t).length - 1;
    if (newStage !== p.stage && newStage <= 5) {
      p.stage = newStage;
      addSeedToLog(`🌱 プランター${slot + 1}: ${GROWTH_STAGES[p.stage]}になりました`);
      if (p.stage === 5) {
        notify('🌸 結実！', `プランター${slot + 1}の${p.plant.name}が実りました`, 'gold');
        clearInterval(STATE.growthTimers[slot]);
      }
    }

    // 枯れた
    if (p.health <= 0) {
      addSeedToLog(`💀 プランター${slot + 1}の植物が枯れました`);
      notify('枯れました', `プランター${slot + 1}の植物が枯れました`, 'danger');
      STATE.planters[slot] = null;
      clearInterval(STATE.growthTimers[slot]);
      delete STATE.growthTimers[slot];
      updateStats();
    }

    if (STATE.currentTab === 'planter') renderPlanter();
    updateStats();
  }, 4000);
}

// ── 収穫 ────────────────────────────────────────────────────

function harvest(slot) {
  const p = STATE.planters[slot];
  if (!p || p.stage < 5) return;
  const seedNum = rand(p.plant.seedCount[0], p.plant.seedCount[1]);
  const isNewDiscovery = !STATE.discoveries[p.plant.id];

  if (isNewDiscovery) {
    showNamingModal(p.plant, slot, seedNum);
  } else {
    doHarvest(p.plant, slot, seedNum, null);
  }
}

function showNamingModal(plant, slot, seedNum) {
  showModal(`
    <h2 style="color:var(--gold)">🌟 新種発見！</h2>
    <div style="font-size:44px;text-align:center;margin:6px 0">${plant.emoji}</div>
    <p>この植物を<strong>あなたが初めて</strong>育て、実らせました！<br>
    名前をつける権利があります。</p>
    <input id="nameInput" placeholder="${plant.name}（デフォルト名）"
      style="width:100%;background:var(--bg3);border:1px solid var(--gold2);
      border-radius:8px;padding:10px;font-family:inherit;font-size:14px;color:var(--text);outline:none">
    <div class="modal-btns">
      <button class="btn btn-secondary"
        onclick="doHarvest(null,${slot},${seedNum},null);closeModal()">後で命名</button>
      <button class="btn btn-gold"
        onclick="doHarvestNamed(${slot},${seedNum})">命名して収穫</button>
    </div>`);
  window._harvestPlant = plant;
}

function doHarvestNamed(slot, seedNum) {
  const name = document.getElementById('nameInput').value.trim();
  doHarvest(window._harvestPlant, slot, seedNum, name || null);
  closeModal();
}

function doHarvest(plant, slot, seedNum, customName) {
  const p = plant || window._harvestPlant || STATE.planters[slot]?.plant;
  if (!p) return;

  if (customName) {
    STATE.discoveries[p.id] = { name: customName, discoveredAt: new Date().toISOString() };
    notify('命名しました！', `「${customName}」として図鑑に登録`, 'gold');
    addSeedToLog(`🌟「${customName}」として命名・登録されました`);
  } else {
    STATE.discoveries[p.id] = { name: p.name, discoveredAt: new Date().toISOString() };
  }

  // 種を追加
  for (let i = 0; i < seedNum; i++) addSeedToBag(p);

  STATE.planters[slot] = null;
  window._harvestPlant = null;
  updateStats();
  renderSeedBag();
  if (STATE.currentTab === 'planter') renderPlanter();
  addSeedToLog(`🌸 ${p.name}を収穫。種×${seedNum}を獲得`);
  notify('収穫完了！', `${p.name} 種×${seedNum}`, 'gold');
}
