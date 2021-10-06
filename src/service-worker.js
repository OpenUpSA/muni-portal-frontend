importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js"
);
importScripts("https://pushpad.xyz/service-worker.js");

const VERSION = 1;

// https://developers.google.com/web/tools/workbox/modules/workbox-cli#injectmanifest
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

workbox.core.setCacheNameDetails({
  prefix: "mymuni",
  suffix: VERSION,
  precache: "install-time",
  runtime: "run-time",
});

// workbox
workbox.routing.registerRoute(
  ({ url }) => url.origin === "https://storage.googleapis.com",
  new workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
  new RegExp(".+/api/wagtail/v2/pages/.+"),
  new workbox.strategies.StaleWhileRevalidate()
);

// enable the ability to cache assets from third party
// external domains using a cache first strategy
workbox.routing.registerRoute(
  ({ url }) =>
    url.origin === "https://kit.fontawesome.com" ||
    url.origin === "https://d3e54v103j8qbb.cloudfront.net" ||
    url.origin === "https://fonts.googleapis.com" ||
    url.origin === "https://fonts.gstatic.com",
  new workbox.strategies.StaleWhileRevalidate()
);

addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    console.debug("Got 'SKIP_WAITING'");
    self.skipWaiting();
  }
});

self.__WB_DISABLE_DEV_LOGS = true;

const delay = (delayDuration) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("time elapsed");
    }, delayDuration);
  });
};

let backgroundCachingInProgress = false;

// ran everytime the service worker is started
// even if it has already been installed. For
// example, if the service worker was put to
// sleep and then woken up by the browser.
init().catch(console.error);

async function init() {
  await cacheServicesPages();
}

async function cacheServicesPages() {
  // if this process is already running,
  // just return.
  if (backgroundCachingInProgress) {
    return;
  }

  // we wait 3 seconds for initial page load
  // before we start background caching
  await delay(3000);
  backgroundCachingInProgress = true;

  const fetchOptions = {
    method: "GET",
    cahce: "no-cache",
    credentials: "omit",
  };
  const services = await getServices();
  const urls = services.items.map((service) => {
    return {
      detail: service.meta.detail_url,
      slug: service.meta.slug,
    };
  });

  const runtimeCache = await caches.open(workbox.core.cacheNames.runtime);

  urls.forEach(async (url) => {
    try {
      const searchParams = new URLSearchParams([
        ["type", "core.ServicePage"],
        ["fields", "*"],
        ["slug", url.slug],
      ]);
      const serviceUrl = `https://muni-portal-backend.openup.org.za/api/wagtail/v2/pages/?${searchParams.toString()}`;
      const htmlResponse = await fetch(`/services/${url.slug}/`, fetchOptions);
      if (htmlResponse && htmlResponse.ok) {
        await runtimeCache.put(`/services/${url.slug}/`, htmlResponse.clone());
      }

      const apiResponse = await fetch(serviceUrl, fetchOptions);
      if (apiResponse && apiResponse.ok) {
        await runtimeCache.put(serviceUrl, apiResponse.clone());
      }

      console.info(
        `successfully fetched and cached: ${`/services/${url.slug}`}`
      );
    } catch (error) {
      console.error(error);
    }
  });
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
