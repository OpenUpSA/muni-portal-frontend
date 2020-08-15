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
        'https://code.jquery.com/jquery-3.5.1.slim.min.js',
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

self.addEventListener('notificationclick', function(e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;
  var action = e.action;

  if (action === 'close') {
    notification.close();
  } else {
    console.log("User selected notification action {action}");
    clients.openWindow('http://www.example.com');
    notification.close();
  }
});
