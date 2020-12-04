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

let messageURL = "";

self.addEventListener("push", function (event) {
  const messageData = event.data.json();

  if (messageData.type !== "notification") {
    return;
  }

  const title = messageData.notification.title;
  const options = {
    body: messageData.notification.body,
    icon: "./cape-agulhas-logo-square.03316029.png",
  };

  messageURL = messageData.notification.url;
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(messageURL));
});

self.__WB_DISABLE_DEV_LOGS = true;
