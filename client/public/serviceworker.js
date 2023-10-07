const VERSION = 1;
const ASSETS_CACHE_PREFIX = "pwa-assets";
const ASSETS_CACHE_NAME = `${ASSETS_CACHE_PREFIX}-${VERSION}`;

const self = this;

// self.__WB__MANIFEST is to cache not only the html but also the js files or react app.
// https://create-react-app.dev/docs/making-a-progressive-web-app/
const ASSET_URLS = ["/", "index.html", "logo.png", "static"];

// Install SW
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(ASSETS_CACHE_NAME).then((cache) => {
      return cache.addAll(ASSET_URLS);
    })
  );
});

// Activate the SW
self.addEventListener("activate", function (event) {
  event.waitUntil(
    (async function () {
      const keys = await caches.keys();

      return Promise.all(
        keys.map((key) => {
          if (
            key.startsWith(ASSETS_CACHE_PREFIX) &&
            key !== ASSETS_CACHE_NAME
          ) {
            return caches.delete(key);
          }
        })
      );
    })()
  );
});

// Fetch
const updateCache = (request) => {
  caches
    .open(ASSETS_CACHE_NAME)
    .then((cache) =>
      fetch(request).then((response) => cache.put(request, response))
    );
};
const fetchFromNetwork = (request, timeout) => {
  return new Promise((fullfill, reject) => {
    const timeoutId = setTimeout(reject, timeout);
    fetch(request).then((response) => {
      clearTimeout(timeoutId);
      fullfill(response);
      updateCache(request);
    });
  });
};
const fetchFromCache = (request) =>
  caches.open(ASSETS_CACHE_NAME).then((cache) => cache.match(request));

// Listen for requests
self.addEventListener("fetch", (event) => {
  const path = new URL(event.request.url).pathname;
  if (path.includes("/images/")) {
    event.respondWith(
      fetchFromNetwork(event.request, 10000).catch(() =>
        fetchFromCache(event.request)
      )
    );
    event.waitUntil(updateCache(event.request));
  } else {
    // Cache only
    event.respondWith(
      caches.open(ASSETS_CACHE_NAME).then((cache) => cache.match(event.request)) 
    );
  }
});
