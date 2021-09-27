importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js"
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
    url.origin === "https://kit.fontawesome.com" ||
    url.origin === "https://d3e54v103j8qbb.cloudfront.net" ||
    url.origin === "https://fonts.googleapis.com" ||
    url.origin === "https://fonts.gstatic.com",
  new workbox.strategies.CacheFirst()
);

addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    console.debug("Got 'SKIP_WAITING'");
    self.skipWaiting();
  }
});

self.__WB_DISABLE_DEV_LOGS = true;

// ran everytime the service worker is started
// even if it has already been installed.
init().catch(console.error);

async function init() {
  await cacheServicesPages();
}

async function getServices() {
  const baseURL = "https://muni-portal-backend.openup.org.za";
  const searchParams = new URLSearchParams([
    ["type", "core.ServicePage"],
    ["fields", "*"],
    ["limit", "100"],
  ]);
  const response = await fetch(
    `${baseURL}/api/wagtail/v2/pages/?${searchParams.toString()}`
  );

  const data = await response.json();
  return data;
}

async function cacheServicesPages() {
  const fetchOptions = {
    method: "GET",
    cahce: "no-cache",
    credentials: "omit",
  };
  const services = await getServices();
  const urls = services.items.map((service) => service.meta.slug);

  urls.forEach(async (url) => {
    try {
      const response = await fetch(`/services/${url}/`, fetchOptions);
      if (response && response.ok) {
        console.log(`successfully fetched: ${`/services/${url}`}`);
      }
    } catch (error) {
      console.error(error);
    }
  });
}
