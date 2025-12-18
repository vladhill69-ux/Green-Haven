// Basic Cache for Offline
const CACHE_NAME = 'plant-shop-v1';
const urlsToCache = ['index.html', 'shop.html', 'styles.css', 'script.js'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
