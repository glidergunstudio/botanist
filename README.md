# 🌿 Flora — 植物学者のガーデン

GPS連動の植物採集・育成ゲームのプロトタイプです。

## ゲームサイクル

1. **地図**で種の出現を確認
2. **現地に移動**して種を拾う（スキルレベルで鑑定度が変わる）
3. **プランター**に植えて、温度・水分・pH・肥料・日照を管理
4. 植物が**成熟・結実**したら収穫
5. **交配室**で2つの植物を交配し新種を生成
6. 初発見の植物には**名前をつけられる**
7. 余った種は**市場**で売買

## ファイル構成

```
botanist/
├── index.html       メイン画面
├── style.css        スタイル
├── manifest.json    PWA設定
├── js/
│   ├── data.js      植物データベース・ヘルパー関数
│   ├── state.js     ゲーム状態管理
│   ├── ui.js        共通UI（モーダル・通知・種袋）
│   ├── map.js       地図・GPS・種の出現
│   ├── planter.js   プランター・生育管理
│   ├── gene.js      遺伝子・交配室
│   ├── market.js    市場
│   └── app.js       エントリーポイント
```

## 技術スタック

- HTML / CSS / Vanilla JS
- [Leaflet.js](https://leafletjs.com/) + OpenStreetMap（地図）
- PWA対応（manifest.json）
- Firebase（予定）

## 今後の実装予定

- [ ] Firebase Auth（ログイン）
- [ ] Firestore（マルチプレイヤー・市場）
- [ ] リアルGPS連動
- [ ] Service Worker（オフライン対応）
- [ ] スキルレベルアップシステム
