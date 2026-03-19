// ============================================================
// GENE — 遺伝子操作・交配室
// ============================================================

function renderGene() {
  const [s1, s2] = STATE.hybridSlots;
  const grown = STATE.planters.filter(p => p && p.stage >= 5);

  document.getElementById('mainContent').innerHTML = `
    <div class="gene-panel">
      <div class="gene-header">🧬 遺伝子操作・交配室</div>
      <div class="gene-sub">2つの植物の遺伝子を掛け合わせて新種を生み出します</div>

      <div class="gene-grid">
        <!-- 親株 A -->
        <div class="gene-card">
          <h4>親株 A</h4>
          ${s1 !== null ? renderParentCard(STATE.planters[s1], 0) : renderParentPicker(grown, 0, s2)}
        </div>

        <!-- 中央 -->
        <div class="cross-center">
          <div style="font-size:28px;color:var(--rare)">×</div>
          <button class="action-btn purple"
            ${s1 !== null && s2 !== null ? '' : 'disabled'}
            onclick="doHybrid()">交配！</button>
        </div>

        <!-- 親株 B -->
        <div class="gene-card">
          <h4>親株 B</h4>
          ${s2 !== null ? renderParentCard(STATE.planters[s2], 1) : renderParentPicker(grown, 1, s1)}
        </div>
      </div>

      <div id="hybridResult" class="gene-result">
        <div style="font-size:28px;opacity:.3">🧬</div>
        <div>2株を選んで交配ボタンを押してください</div>
      </div>
    </div>`;
}

function renderParentCard(p, slotIdx) {
  return `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
      <div style="font-size:24px">${p.plant.emoji}</div>
      <div>
        <div style="font-weight:700;font-size:13px">${p.plant.name}</div>
        <div style="font-size:10px;color:var(--text3);font-style:italic">${p.plant.sciName}</div>
      </div>
    </div>
    ${Object.entries(p.plant.genes).map(([k, v]) => `
      <div class="gene-trait">
        <span class="gene-key">${k}遺伝子</span>
        <span class="gene-allele">${v}</span>
      </div>`).join('')}
    <button class="action-btn" style="margin-top:8px;font-size:10px"
      onclick="clearHybridSlot(${slotIdx})">✕ 解除</button>`;
}

function renderParentPicker(grown, slotIdx, otherSlot) {
  const available = grown.filter((p, i) =>
    STATE.planters.indexOf(p) !== STATE.hybridSlots[otherSlot === 0 ? 1 : 0]
  );
  if (!available.length) {
    return `<div style="color:var(--text3);font-size:11px;font-style:italic">
      結実した植物がありません<br>プランターで育てましょう
    </div>`;
  }
  return `
    <div style="color:var(--text3);font-size:11px;margin-bottom:8px">結実した植物を選択：</div>
    ${grown.map(p => {
      const idx = STATE.planters.indexOf(p);
      if (idx === STATE.hybridSlots[slotIdx === 0 ? 1 : 0]) return '';
      return `<button class="action-btn" style="margin:2px;display:block;width:100%;text-align:left"
        onclick="setHybridSlot(${slotIdx},${idx})">
        ${p.plant.emoji} ${p.plant.name}（スロット${idx + 1}）
      </button>`;
    }).join('')}`;
}

function setHybridSlot(idx, planterIdx) {
  STATE.hybridSlots[idx] = planterIdx;
  renderGene();
}

function clearHybridSlot(idx) {
  STATE.hybridSlots[idx] = null;
  renderGene();
}

// ── 交配ロジック ─────────────────────────────────────────────

function doHybrid() {
  const [si1, si2] = STATE.hybridSlots;
  if (si1 === null || si2 === null) return;

  const p1 = STATE.planters[si1].plant;
  const p2 = STATE.planters[si2].plant;

  // メンデル型アレル交差
  const newGenes = {};
  Object.keys(p1.genes).forEach(k => {
    const alleles = (p1.genes[k] + p2.genes[k]).split('');
    const pick = () => alleles[rand(0, alleles.length - 1)];
    newGenes[k] = pick() + pick();
  });

  // 形質は親からランダム継承
  const newTraits = {};
  Object.keys(p1.traits).forEach(k => {
    newTraits[k] = Math.random() < 0.5 ? p1.traits[k] : p2.traits[k];
  });

  // 生育条件は平均
  const newCond = {};
  ['temp', 'ph', 'water', 'fert', 'light'].forEach(k => {
    const a = p1.conditions[k], b = p2.conditions[k];
    newCond[k] = [
      Math.round((a[0] + b[0]) / 2),
      Math.round((a[1] + b[1]) / 2),
    ];
  });

  // レアリティ（稀に向上）
  const rKeys = ['common', 'uncommon', 'rare', 'legendary'];
  const rIdx1 = rKeys.indexOf(p1.rarity);
  const rIdx2 = rKeys.indexOf(p2.rarity);
  const baseIdx = Math.round((rIdx1 + rIdx2) / 2);
  const newRarity = rKeys[Math.min(3, baseIdx + (Math.random() < 0.15 ? 1 : 0))];

  const hybridPlant = {
    id: 'hybrid_' + uuid(),
    name: `${p1.name}×${p2.name}`,
    sciName: `${p1.sciName.split(' ')[0]} × ${p2.sciName.split(' ')[0]}`,
    emoji: Math.random() < 0.5 ? p1.emoji : p2.emoji,
    rarity: newRarity,
    traits: newTraits,
    genes: newGenes,
    conditions: newCond,
    growthTicks: Math.round((p1.growthTicks + p2.growthTicks) / 2),
    seedCount: [1, rand(2, 5)],
    marketPrice: Math.round((p1.marketPrice + p2.marketPrice) / 2 * 1.5),
  };

  // 種袋に追加
  const newSeed = {
    id: uuid(),
    plant: hybridPlant,
    revealKey: 'full',
    label: hybridPlant.name,
  };
  STATE.seeds.push(newSeed);
  STATE.hybridSlots = [null, null];
  updateStats();
  renderSeedBag();
  addSeedToLog(`🧬 交配成功: ${hybridPlant.name}`);
  notify('交配成功！', `新種「${hybridPlant.name}」の種を入手`, 'rare');

  // 結果表示
  document.getElementById('hybridResult').className = 'gene-result ready';
  document.getElementById('hybridResult').innerHTML = `
    <div style="font-size:44px">${hybridPlant.emoji}</div>
    <h3>${hybridPlant.name}</h3>
    <div style="color:${RARITY[newRarity].color};font-size:11px;margin-bottom:6px">
      ${RARITY[newRarity].label}
    </div>
    <div style="font-size:11px;color:var(--text3)">種袋に追加されました。プランターに植えましょう！</div>`;
}
