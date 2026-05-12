const CACHE_NAME = 'adventure-cache-v1';

const urlsToCache = [
  '/adventure/',
  '/adventure/index.html',
  '/adventure/manifest.json',
  '/adventure/icon-192.png',
  '/adventure/icon-512.png'
];

// INSTALACIÓN
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );

  self.skipWaiting();
});

// ACTIVACIÓN
self.addEventListener('activate', (event) => {
  console.log('Service Worker activado');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// FETCH
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
      .catch(() => {
        return caches.match('/adventure/index.html');
      })
  );
});
