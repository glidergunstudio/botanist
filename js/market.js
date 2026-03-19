// ============================================================
// MARKET — 種の売買（非同期・シングルプレイ版）
// ============================================================

// ダミーの出品データ（将来Firestoreに置き換え）
const DUMMY_LISTINGS = [
  { id: 'm1', plant: PLANT_DB[0], price: 55,  qty: 3, seller: 'Hanako' },
  { id: 'm2', plant: PLANT_DB[3], price: 160, qty: 1, seller: 'Taro'   },
  { id: 'm3', plant: PLANT_DB[4], price: 340, qty: 2, seller: 'Kenji'  },
  { id: 'm4', plant: PLANT_DB[1], price: 100, qty: 5, seller: 'Yuki'   },
];

function renderMarket() {
  document.getElementById('mainContent').innerHTML = `
    <div class="market-panel">
      <div class="market-header">🏪 種の市場</div>
      <div class="market-sub">他のプレイヤーが出品した種を購入、または自分の種を出品できます</div>

      <div class="market-grid">
        <!-- 購入 -->
        <div>
          <div class="market-section-title">出品中の種</div>
          ${DUMMY_LISTINGS.map(l => `
            <div class="market-item">
              <div class="market-item-emoji">${l.plant.emoji}</div>
              <div class="market-item-info">
                <div class="market-item-name">${l.plant.name}</div>
                <div class="market-item-seller">${l.seller} · 残り${l.qty}個</div>
              </div>
              <div>
                <div class="market-item-price">${l.price}G</div>
                <button class="action-btn gold" style="margin-top:4px"
                  onclick="buyFromMarket('${l.id}')">購入</button>
              </div>
            </div>`).join('')}
        </div>

        <!-- 出品 -->
        <div>
          <div class="market-section-title">出品する</div>
          ${STATE.seeds.length === 0
            ? '<div style="color:var(--text3);font-size:12px;font-style:italic">出品できる種がありません</div>'
            : STATE.seeds.map(s => `
              <div class="market-item">
                <div class="market-item-emoji" style="font-size:22px">
                  ${s.revealKey === 'full' || s.revealKey === 'species' ? s.plant.emoji : '🌰'}
                </div>
                <div class="market-item-info">
                  <div class="market-item-name">${s.label}</div>
                  <div class="market-item-seller">${RARITY[s.plant.rarity].label}</div>
                </div>
                <button class="action-btn" onclick="openListModal('${s.id}')">出品</button>
              </div>`).join('')}
        </div>
      </div>
    </div>`;
}

function buyFromMarket(listingId) {
  const listing = DUMMY_LISTINGS.find(l => l.id === listingId);
  if (!listing) return;
  if (STATE.gold < listing.price) {
    notify('所持金不足', `${listing.price}G 必要です`, 'danger');
    return;
  }
  STATE.gold -= listing.price;
  addSeedToBag(listing.plant);
  updateStats();
  renderSeedBag();
  renderMarket();
  addSeedToLog(`🏪 ${listing.plant.name}の種を${listing.price}Gで購入`);
  notify('購入完了', `${listing.plant.name} (-${listing.price}G)`);
}

function openListModal(seedId) {
  const seed = STATE.seeds.find(s => s.id === seedId);
  if (!seed) return;
  const suggested = seed.plant.marketPrice;
  showModal(`
    <h2>🏪 出品する</h2>
    <p>「${seed.label}」を市場に出品します<br>
    <span style="font-size:11px;color:var(--text3)">※手数料10%が差し引かれます</span></p>
    <div style="font-size:12px;color:var(--text3);margin-bottom:6px">価格 (G)</div>
    <input type="number" id="priceInput" value="${suggested}" min="1"
      style="width:100%;background:var(--bg3);border:1px solid var(--border);
      border-radius:8px;padding:10px;font-family:inherit;font-size:16px;color:var(--text);outline:none">
    <div class="modal-btns">
      <button class="btn btn-secondary" onclick="closeModal()">キャンセル</button>
      <button class="btn btn-primary" onclick="confirmListing('${seedId}')">出品する</button>
    </div>`);
}

function confirmListing(seedId) {
  const seed = STATE.seeds.find(s => s.id === seedId);
  if (!seed) return;
  const price = parseInt(document.getElementById('priceInput').value) || 1;
  const earned = Math.round(price * 0.9);
  removeSeedFromBag(seedId);
  STATE.gold += earned;
  closeModal();
  updateStats();
  renderSeedBag();
  renderMarket();
  addSeedToLog(`🏪 ${seed.label}を${price}Gで出品 (+${earned}G 手数料後)`);
  notify('出品完了', `+${earned}G (手数料10%)`, 'gold');
}
