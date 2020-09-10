importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

console.log("my service worker");

workbox.precaching.precacheAndRoute([]);

addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log("Got 'SKIP_WAITING'");
    skipWaiting();
  }
});
