const cacheName = 'files-2';

self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/icon/lighthouse-icon.png',
        '/icon/explore-36x36.png',
        '/js/index.js',
        '/manifest.webmanifest',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css',
        'https://code.jquery.com/jquery-3.5.1.slim.min.js',
      ]);
    })
  );
});

// basic example from https://adactio.com/journal/13540


addEventListener('fetch',  (event) => {
  console.log("fetch event", event.request.url);

  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        console.log("respondonding with", response);
        return response;
      } else {
        console.log("Fetching.");
        return fetch(event.request);
      }
    })
  );
});

self.addEventListener('activate', (e) => {
    console.log('[Service Worker] Activate');
});

self.addEventListener('notificationclick', function(e) {
  var notification = e.notification;
  var action = e.action;

  if (action === 'close') {
    notification.close();
  } else {
    console.log(`User selected notification action ${action}`, e);
    clients.openWindow('http://www.example.com');
    notification.close();
  }
});

self.addEventListener('push', function(e) {
  var options = {
    body: 'This notification was generated from a push!',
    icon: '/icon/lighthouse-icon-36x36.png',
    actions: [
      {
        action: 'explore',
        title: 'Explore this new world',
        icon: 'icon/explore-36x36.png'
      },
      {
        action: 'close',
        title: 'Close'
      },
    ]
  };
  e.waitUntil(
    self.registration.showNotification('Hello from the server!', options)
  );
});
