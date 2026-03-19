// ============================================================
// PLANT DATABASE & CONSTANTS
// ============================================================

const PLANT_DB = [
  {
    id: 'rosa',
    name: 'バラ',
    sciName: 'Rosa canina',
    emoji: '🌹',
    rarity: 'common',
    traits: { color: '紅', size: '中型', fragrance: '強', petal: '重弁', season: '春夏' },
    genes: { C: 'Rr', S: 'Mm', F: 'Ff', P: 'Dd' },
    conditions: { temp: [18, 28], ph: [5.5, 7.0], water: [60, 80], fert: [40, 60], light: [70, 100] },
    growthTicks: 5,
    seedCount: [2, 5],
    marketPrice: 40,
  },
  {
    id: 'violette',
    name: 'スミレ',
    sciName: 'Viola odorata',
    emoji: '💜',
    rarity: 'uncommon',
    traits: { color: '紫', size: '小型', fragrance: '中', petal: '単弁', season: '春' },
    genes: { C: 'vv', S: 'ss', F: 'Ff', P: 'pp' },
    conditions: { temp: [10, 20], ph: [6.0, 7.5], water: [50, 70], fert: [20, 40], light: [40, 70] },
    growthTicks: 4,
    seedCount: [3, 7],
    marketPrice: 90,
  },
  {
    id: 'sunflower',
    name: 'ヒマワリ',
    sciName: 'Helianthus annuus',
    emoji: '🌻',
    rarity: 'common',
    traits: { color: '黄', size: '大型', fragrance: '無', petal: '舌状', season: '夏' },
    genes: { C: 'YY', S: 'LL', F: 'ff', P: 'Hh' },
    conditions: { temp: [22, 35], ph: [6.0, 7.5], water: [40, 60], fert: [50, 70], light: [80, 100] },
    growthTicks: 6,
    seedCount: [10, 20],
    marketPrice: 35,
  },
  {
    id: 'lily',
    name: 'ユリ',
    sciName: 'Lilium longiflorum',
    emoji: '🌷',
    rarity: 'uncommon',
    traits: { color: '白', size: '大型', fragrance: '強', petal: 'trumpet', season: '夏' },
    genes: { C: 'Ww', S: 'LL', F: 'FF', P: 'll' },
    conditions: { temp: [15, 25], ph: [6.0, 7.0], water: [55, 75], fert: [45, 65], light: [60, 90] },
    growthTicks: 8,
    seedCount: [1, 3],
    marketPrice: 160,
  },
  {
    id: 'cactus',
    name: 'サボテン',
    sciName: 'Cereus peruvianus',
    emoji: '🌵',
    rarity: 'rare',
    traits: { color: '緑', size: '中型', fragrance: '無', petal: '管状', season: '夏' },
    genes: { C: 'gg', S: 'Mm', F: 'ff', P: 'DD' },
    conditions: { temp: [25, 40], ph: [6.0, 8.0], water: [5, 25], fert: [5, 20], light: [90, 100] },
    growthTicks: 12,
    seedCount: [2, 6],
    marketPrice: 250,
  },
  {
    id: 'moss',
    name: 'コケ',
    sciName: 'Bryophyta sp.',
    emoji: '🌿',
    rarity: 'rare',
    traits: { color: '緑', size: '微小', fragrance: '土', petal: '無', season: '通年' },
    genes: { C: 'gg', S: 'mm', F: 'ff', P: 'bb' },
    conditions: { temp: [5, 20], ph: [4.5, 6.5], water: [70, 95], fert: [5, 20], light: [10, 40] },
    growthTicks: 10,
    seedCount: [0, 0],
    marketPrice: 300,
  },
];

const RARITY = {
  common:    { label: '普通',   color: '#888',                  weight: 60 },
  uncommon:  { label: '珍しい', color: 'var(--uncommon)',       weight: 30 },
  rare:      { label: 'レア',   color: 'var(--rare)',           weight: 9  },
  legendary: { label: '伝説',   color: 'var(--gold)',           weight: 1  },
};

const GROWTH_STAGES = ['種', '発芽', '生育中', '成熟前', '開花', '結実'];

const REVEAL_LEVEL = {
  1: 'shape',    // サイズ・色のみ
  2: 'genus',    // 属名
  3: 'species',  // 種名
  4: 'full',     // 遺伝子情報含む全情報
};

// ── Helpers ──────────────────────────────────────────────────

function rand(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

function uuid() {
  return Math.random().toString(36).slice(2, 9);
}

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

function weightedRandomPlant() {
  const roll = Math.random() * 100;
  let acc = 0;
  const rarityKeys = Object.keys(RARITY);
  for (const rk of rarityKeys) {
    acc += RARITY[rk].weight;
    if (roll < acc) {
      const pool = PLANT_DB.filter(p => p.rarity === rk);
      if (pool.length) return pool[rand(0, pool.length - 1)];
    }
  }
  return PLANT_DB[0];
}

function seedLabel(plant, revealKey) {
  if (revealKey === 'full' || revealKey === 'species') return plant.name;
  if (revealKey === 'genus') return plant.sciName.split(' ')[0] + '属の種';
  if (revealKey === 'shape') return plant.traits.size + 'の種';
  return '不明な種';
}

function paramHealthColor(val, range) {
  if (val < range[0] - 10 || val > range[1] + 10) return 'danger';
  if (val < range[0] || val > range[1]) return 'warn';
  return 'ok';
}
