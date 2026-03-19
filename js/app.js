// ============================================================
// APP — エントリーポイント・タブ管理
// ============================================================

// ── タブ切り替え ─────────────────────────────────────────────

function showTab(tabName) {
  STATE.currentTab = tabName;

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  switch (tabName) {
    case 'map':     renderMap();     break;
    case 'planter': renderPlanter(); break;
    case 'gene':    renderGene();    break;
    case 'market':  renderMarket();  break;
  }

  // タブ切り替え時は右パネルをログに戻す
  STATE.selectedSeedId = null;
  renderLogPanel();
  renderSeedBag();
}

// タブボタンにイベント付与
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => showTab(btn.dataset.tab));
});

// ── 初期化 ───────────────────────────────────────────────────

function init() {
  // スターター種を3個付与
  [PLANT_DB[0], PLANT_DB[2], PLANT_DB[1]].forEach(plant => {
    addSeedToBag(plant);
  });

  updateStats();
  renderSeedBag();
  renderLogPanel();
  renderMap();

  addSeedToLog('🌿 ようこそ、植物学者さん。地図を見て種を探しましょう！');
  notify('Flora へようこそ', '地図をクリックして移動し、種を探しましょう 🌰');
}

init();
