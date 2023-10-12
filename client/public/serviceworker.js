import { manifest, version } from "@parcel/service-worker";

// Install SW
async function install() {
  const cache = await caches.open(version);
  await cache.addAll(manifest);
}
addEventListener('install', e => e.waitUntil(install()));

// Activate SW
async function activate() {
  const keys = await caches.keys();
  await Promise.all(
    keys.map(key => key !== version && caches.delete(key))
  );
}
addEventListener('activate', e => e.waitUntil(activate()));

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
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request)),
  );
});
// self.addEventListener("fetch", function (event) {
//   event.respondWith(
//     caches.match(event.request).then((cachedResponse) => {
//       const networkFetch = fetch(event.request).then((response) => {
//         caches.open(version).then((cache) => {
//           cache.put(event.request, response.clone());
//         });
//       });
//       return cachedResponse || networkFetch;
//     })
//   );
// });


// async function cacheOnly(request) {
//   const cachedResponse = await caches.match(request);
//   if (cachedResponse) {
//     console.log("Found response in cache:", cachedResponse);
//     return cachedResponse;
//   }
//   return Response.error();
// }

// self.addEventListener("fetch", (event) => {
//   if (
//     event.request.destination === "script" ||
//     event.request.destination === "style"
//   ) {
//     event.respondWith(cacheOnly(event.request));
//   }
// });