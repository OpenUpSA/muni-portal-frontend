importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

workbox.precaching.precacheAndRoute([]);
workbox.routing.registerRoute(
  new RegExp(".+/api/wagtail/v2/pages/.*"),
  new workbox.strategies.NetworkFirst()
);

addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log("Got 'SKIP_WAITING'");
    skipWaiting();
  }
});
