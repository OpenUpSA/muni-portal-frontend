import {precacheAndRoute} from 'workbox-precaching';

console.log("my service worker");

precacheAndRoute([]);

addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log("Got 'SKIP_WAITING'");
    skipWaiting();
  }
});
