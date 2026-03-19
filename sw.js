const CACHE_NAME = 'flora-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/js/data.js',
  '/js/state.js',
  '/js/ui.js',
  '/js/map.js',
  '/js/planter.js',
  '/js/gene.js',
  '/js/market.js',
  '/js/app.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
