importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);
importScripts("https://pushpad.xyz/service-worker.js");

// https://developers.google.com/web/tools/workbox/modules/workbox-cli#injectmanifest
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

// workbox
workbox.routing.registerRoute(
  ({ url }) => url.origin === "https://storage.googleapis.com",
  new workbox.strategies.StaleWhileRevalidate()
);

workbox.routing.registerRoute(
  new RegExp(".+/api/wagtail/v2/pages/.*"),
  new workbox.strategies.NetworkFirst()
);

// enable the ability to cache assets from third party
// external domains using a cache first strategy
workbox.routing.registerRoute(
  ({ url }) =>
    url.origin === "https://ka-f.fontawesome.com" ||
    url.origin === "https://kit.fontawesome.com" ||
    url.origin === "https://d3e54v103j8qbb.cloudfront.net" ||
    url.origin === "https://fonts.googleapis.com" ||
    url.origin === "https://fonts.gstatic.com",
  new workbox.strategies.CacheFirst()
);

addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    console.log("Got 'SKIP_WAITING'");
    skipWaiting();
  }
});

self.__WB_DISABLE_DEV_LOGS = true;
