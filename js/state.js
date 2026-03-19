// ============================================================
// GAME STATE
// ============================================================

const STATE = {
  skillLevel: 1,
  gold: 800,

  // 種袋
  seeds: [],

  // プランター（8スロット）
  planters: Array(8).fill(null),

  // 地図上の種マーカー
  mapSeeds: [],

  // 発見済みの新種 { plantId: { name, discoveredAt } }
  discoveries: {},

  // フィールドノート
  log: [],

  // UI状態
  currentTab: 'map',
  selectedSeedId: null,
  hybridSlots: [null, null],  // [planterIdx, planterIdx]

  // プランター成長タイマー { slotIdx: intervalId }
  growthTimers: {},
};

// ── State Mutations ──────────────────────────────────────────

function addSeedToLog(msg) {
  const time = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  STATE.log.unshift({ msg, time });
  if (STATE.log.length > 40) STATE.log.pop();
}

function addSeedToBag(plant) {
  const revealKey = REVEAL_LEVEL[STATE.skillLevel] || 'shape';
  const seed = {
    id: uuid(),
    plant,
    revealKey,
    label: seedLabel(plant, revealKey),
  };
  STATE.seeds.push(seed);
  return seed;
}

function removeSeedFromBag(seedId) {
  STATE.seeds = STATE.seeds.filter(s => s.id !== seedId);
}

function plantSeedToSlot(seedId, slot) {
  const seed = STATE.seeds.find(s => s.id === seedId);
  if (!seed || STATE.planters[slot] !== null) return false;

  STATE.planters[slot] = {
    id: uuid(),
    plant: seed.plant,
    slot,
    stage: 0,
    age: 0,
    params: { temp: 22, ph: 6.5, water: 60, fert: 40, light: 70 },
    health: 100,
    harvested: false,
  };

  removeSeedFromBag(seedId);
  return true;
}

function updateStats() {
  document.getElementById('skillLv').textContent = STATE.skillLevel;
  document.getElementById('seedCount').textContent = STATE.seeds.length;
  document.getElementById('planterCount').textContent = STATE.planters.filter(Boolean).length;
  document.getElementById('gold').textContent = STATE.gold;
}
