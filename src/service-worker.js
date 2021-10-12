importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js"
);
importScripts("https://pushpad.xyz/service-worker.js");

const VERSION = "1";

let isOnline = true;

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

addEventListener("message", async (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    console.debug("Got 'SKIP_WAITING'");
    self.skipWaiting();
  }

  if (event.data && event.data.type === "ONLINE_STATUS_UPDATE") {
    isOnline = event.data.payload.isOnline;
  }

  if (event.data && event.data.type === "START_BACKGROUND_CACHE") {
    console.debug("Got 'START_BACKGROUND_CACHE'");
    await backgroundCache(event.ports[0]);
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

async function backgroundCache(windowWorkerPort) {
  // if this process is already running,
  // or we are offline, just return.
  if (backgroundCachingInProgress) {
    return;
  }

  // we wait 3 seconds for initial page load
  // before we start background caching
  await delay(3000);

  if (isOnline) {
    const apiEndPointBase =
      "https://muni-portal-backend.openup.org.za/api/wagtail/v2/pages/";
    backgroundCachingInProgress = true;

    const services = await getServices();
    const servicesURLs = services.items.map((service) => {
      return {
        detail: service.meta.detail_url,
        slug: service.meta.slug,
      };
    });

    const runtimeCache = await caches.open(workbox.core.cacheNames.runtime);
    const myMuniLandingSearchParams = new URLSearchParams([
      ["type", "core.MyMuniPage"],
      ["fields", "*"],
    ]);
    const getPageByPathSearchParams = new URLSearchParams([
      ["html_path", "/my-municipality/important-contacts/"],
    ]);
    const myMuniLandingAPIEndpoint = `${apiEndPointBase}?${myMuniLandingSearchParams.toString()}`;
    const getPageByPathAPIEndpoint = `${apiEndPointBase}find?${getPageByPathSearchParams.toString()}`;

    await cacheAPIResponse(runtimeCache, myMuniLandingAPIEndpoint);
    await cacheAPIResponse(runtimeCache, getPageByPathAPIEndpoint);

    await cachePage(runtimeCache, "/my-municipality/");
    await cachePage(runtimeCache, "/my-municipality/important-contacts/");

    servicesURLs.forEach(async (url) => {
      try {
        const servicePageSearchParams = new URLSearchParams([
          ["type", "core.ServicePage"],
          ["fields", "*"],
          ["slug", url.slug],
        ]);
        const apiEndpoint = `${apiEndPointBase}?${servicePageSearchParams.toString()}`;

        await cacheAPIResponse(runtimeCache, apiEndpoint);
        await cachePage(runtimeCache, `/services/${url.slug}/`);
        backgroundCachingInProgress = false;
        windowWorkerPort.postMessage(
          "Cahced critical service and emergency contact details. You can now safely go offline."
        );
      } catch (error) {
        backgroundCachingInProgress = false;
        console.error(error);
      }
    });
  }
}

async function cacheAPIResponse(runtimeCache, apiEndpoint) {
  const fetchOptions = {
    method: "GET",
    cahce: "no-cache",
    credentials: "omit",
  };
  let cacheResponse;

  // we first test whether this is already in cache
  cacheResponse = await runtimeCache.match(apiEndpoint);
  if (cacheResponse) {
    console.debug(`API endpoint ${apiEndpoint} already cached.`);
    return;
  }

  console.debug(`API endpoint ${apiEndpoint} not cached. Caching...`);
  const apiResponse = await fetch(apiEndpoint, fetchOptions);
  if (apiResponse && apiResponse.ok) {
    await runtimeCache.put(apiEndpoint, apiResponse.clone());
    console.debug(`API endpoint ${apiEndpoint} stored in cache.`);
    return;
  }
}

async function cachePage(runtimeCache, pageURL) {
  const fetchOptions = {
    method: "GET",
    cahce: "no-cache",
    credentials: "omit",
  };
  let cacheResponse;

  // we first test whether this is already in cache
  cacheResponse = await runtimeCache.match(pageURL);
  if (cacheResponse) {
    console.debug(`Page ${pageURL} already cached.`);
    return;
  }

  console.debug(`Page ${pageURL} not cached. Caching...`);
  const pageResponse = await fetch(pageURL, fetchOptions);
  if (pageResponse && pageResponse.ok) {
    await runtimeCache.put(pageURL, pageResponse.clone());
    console.debug(`Page ${pageURL} stored in cache.`);
    return;
  }
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
