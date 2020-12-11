importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);

workbox.precaching.precacheAndRoute([]);
workbox.routing.registerRoute(
  new RegExp(".+/api/wagtail/v2/pages/.*"),
  new workbox.strategies.NetworkFirst()
);

addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    console.log("Got 'SKIP_WAITING'");
    skipWaiting();
  }
});


self.addEventListener("push", function (event) {
  const messageData = event.data.json();

  if (messageData.type !== "notification") {
    return;
  }

  const title = messageData.notification.title;
  const options = {
    body: messageData.notification.body,
    icon: "./cape-agulhas-logo-square.03316029.png",
    data: {url: messageData.notification.url},
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.matchAll({ type: 'window' }).then(clientsArr => {
    // If a Window tab matching the targeted URL already exists, focus that;
    const hadWindowToFocus = clientsArr.some(windowClient => {
      windowClient.url === event.notification.data.url ? (windowClient.focus(), true) : false;
    });
    // Otherwise, open a new tab to the applicable URL and focus it.
    if (!hadWindowToFocus)
      clients.openWindow(event.notification.data.url).then(windowClient => {
        windowClient ? windowClient.focus() : null;
      });
  }));
});

self.__WB_DISABLE_DEV_LOGS = true;
