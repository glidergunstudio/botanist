// ============================================================
// MAP — Leaflet + 模擬GPS（デスクトッププロトタイプ）
// ============================================================

let leafletMap = null;
let playerMarker = null;
let seedMarkers = {};  // mapSeedId -> L.marker
let playerPos = { lat: 35.6812, lng: 139.7671 };  // 東京・初期位置

// ── 初期化 ──────────────────────────────────────────────────

function renderMap() {
  document.getElementById('mainContent').innerHTML = `
    <div class="map-wrapper">
      <div id="leafletMap"></div>
      <button class="map-overlay-btn" id="walkBtn" onclick="doWalk()">
        🚶 この周辺を散策する
      </button>
    </div>`;

  // Leafletマップ初期化（初回のみ）
  if (!leafletMap) {
    leafletMap = L.map('leafletMap', { zoomControl: true }).setView(
      [playerPos.lat, playerPos.lng], 16
    );
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(leafletMap);
  } else {
    leafletMap.invalidateSize();
  }

  // プレイヤーマーカー
  const playerIcon = L.divIcon({
    html: `<div style="
      width:16px;height:16px;background:var(--green, #7ab648);
      border-radius:50%;border:3px solid #0e1208;
      box-shadow:0 0 0 6px rgba(122,182,72,.3),0 0 20px rgba(122,182,72,.5);
      animation:pulse 2s infinite;
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    className: '',
  });

  if (playerMarker) {
    playerMarker.setLatLng([playerPos.lat, playerPos.lng]);
  } else {
    playerMarker = L.marker([playerPos.lat, playerPos.lng], { icon: playerIcon })
      .addTo(leafletMap)
      .bindTooltip('あなた', { permanent: false });
  }

  // 地図上の種を初期配置
  if (STATE.mapSeeds.length === 0) spawnMapSeeds(8);
  refreshSeedMarkers();

  // 地図クリックで移動（デスクトップ用）
  leafletMap.off('click');
  leafletMap.on('click', e => {
    movePlayerTo(e.latlng.lat, e.latlng.lng);
  });
}

// ── 種の出現 ────────────────────────────────────────────────

function spawnMapSeeds(count) {
  for (let i = 0; i < count; i++) {
    const plant = weightedRandomPlant();
    STATE.mapSeeds.push({
      id: uuid(),
      plant,
      lat: playerPos.lat + (Math.random() - 0.5) * 0.015,
      lng: playerPos.lng + (Math.random() - 0.5) * 0.020,
      collected: false,
    });
  }
}

function refreshSeedMarkers() {
  // 収集済みマーカーを削除
  Object.keys(seedMarkers).forEach(id => {
    const ms = STATE.mapSeeds.find(s => s.id === id);
    if (!ms || ms.collected) {
      seedMarkers[id]?.remove();
      delete seedMarkers[id];
    }
  });

  // 未収集の種にマーカーを追加
  STATE.mapSeeds.filter(s => !s.collected).forEach(ms => {
    if (seedMarkers[ms.id]) return;

    const isRare = ms.plant.rarity === 'rare' || ms.plant.rarity === 'legendary';
    const color  = isRare ? '#b06cd0' : '#c8a84b';

    const icon = L.divIcon({
      html: `<div style="
        width:12px;height:12px;
        background:${color};
        border-radius:50%;
        border:2px solid #0e1208;
        box-shadow:0 0 8px ${color}88;
        cursor:pointer;
      "></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6],
      className: '',
    });

    const marker = L.marker([ms.lat, ms.lng], { icon })
      .addTo(leafletMap)
      .bindPopup(buildSeedPopup(ms), { maxWidth: 200 });

    marker.on('click', () => marker.openPopup());
    seedMarkers[ms.id] = marker;
  });
}

function buildSeedPopup(ms) {
  const dist = getDistanceM(playerPos.lat, playerPos.lng, ms.lat, ms.lng);
  const inRange = dist < 100;
  return `
    <div class="popup-title">🌰 種を発見</div>
    <div class="popup-sub">${inRange ? '拾える距離です！' : `約${Math.round(dist)}m 先`}</div>
    <button class="popup-btn" ${inRange ? '' : 'disabled'}
      onclick="collectMapSeed('${ms.id}')">
      ${inRange ? '拾う' : 'もっと近づいてください'}
    </button>`;
}

// ── プレイヤー移動 ───────────────────────────────────────────

function movePlayerTo(lat, lng) {
  playerPos = { lat, lng };
  playerMarker.setLatLng([lat, lng]);
  leafletMap.panTo([lat, lng]);

  // ポップアップを更新（距離が変わるので）
  STATE.mapSeeds.filter(s => !s.collected).forEach(ms => {
    const m = seedMarkers[ms.id];
    if (m) m.setPopupContent(buildSeedPopup(ms));
  });

  // 範囲内の種を自動収集
  autoCollectNearby();
}

function doWalk() {
  // デスクトップ用：ランダムに近くへ移動
  const newLat = playerPos.lat + (Math.random() - 0.5) * 0.004;
  const newLng = playerPos.lng + (Math.random() - 0.5) * 0.006;
  movePlayerTo(newLat, newLng);

  // 種が少なくなったら補充
  const remaining = STATE.mapSeeds.filter(s => !s.collected).length;
  if (remaining < 4) spawnMapSeeds(4);
  refreshSeedMarkers();

  addSeedToLog('🚶 周辺を散策しました');
}

function autoCollectNearby() {
  let count = 0;
  STATE.mapSeeds.filter(s => !s.collected).forEach(ms => {
    const dist = getDistanceM(playerPos.lat, playerPos.lng, ms.lat, ms.lng);
    if (dist < 50) {
      collectMapSeed(ms.id);
      count++;
    }
  });
  if (count > 0) notify(`種を${count}個発見！`, '近くに種がありました 🌰');
}

function collectMapSeed(mapId) {
  const ms = STATE.mapSeeds.find(s => s.id === mapId);
  if (!ms || ms.collected) return;

  const dist = getDistanceM(playerPos.lat, playerPos.lng, ms.lat, ms.lng);
  if (dist > 100) {
    notify('遠すぎます', 'もっと近づいてから拾いましょう', 'danger');
    return;
  }

  ms.collected = true;
  seedMarkers[ms.id]?.remove();
  delete seedMarkers[ms.id];

  const seed = addSeedToBag(ms.plant);
  updateStats();
  renderSeedBag();

  const isNew = !STATE.discoveries[ms.plant.id];
  addSeedToLog(`🌰 ${seed.label}を拾いました`);
  notify(isNew ? '初めて見る種かも！' : '種を拾いました', seed.label, isNew ? 'gold' : '');

  // ポップアップを閉じる
  if (leafletMap) leafletMap.closePopup();
}

// ── 距離計算（Haversine） ─────────────────────────────────────

function getDistanceM(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
