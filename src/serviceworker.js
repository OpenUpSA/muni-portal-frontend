const cacheName = 'files-2';

self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.webmanifest',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css',
      ]);
    })
  );
});

// basic example from https://adactio.com/journal/13540


addEventListener('fetch',  (event) => {
  console.log(event.request.url);

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', (e) => {
    console.log('[Service Worker] Activate');
});
