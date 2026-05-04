/**
 * service-worker.js - PWA Offline Support
 * Membolehkan Coffee-Pay di-install dan diakses tanpa internet.
 */

const CACHE_NAME = 'coffee-pay-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './js/app.js',
  './user.json',
  './manifest.json',
  './assets/icon-192x192.png',
  './assets/icon-512x512.png'
];

// 1. Fasa Install: Simpan semua fail ke dalam cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Coffee-Pay: Fail berjaya di-cache!');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Fasa Activate: Padam cache lama jika ada kemaskini versi
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('🧹 Coffee-Pay: Memadam cache lama...');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. Fasa Fetch: Ambil fail dari cache jika offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Pulangkan dari cache jika ada, jika tidak, guna network
      return response || fetch(event.request);
    }).catch(() => {
      // Jika kedua-duanya gagal (offline & fail tiada dalam cache)
      console.log('⚠️ Coffee-Pay: Anda sedang offline.');
    })
  );
});
