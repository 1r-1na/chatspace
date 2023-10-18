import { version, manifest } from "@parcel/service-worker";
const IMAGE_CACHE = "image-cache-v1";

// Install SW
async function install() {
  const cache = await caches.open(version);
  await cache.addAll(manifest);
}
addEventListener("install", (e) => e.waitUntil(install()));

// Activate SW
async function activate() {
  const keys = await caches.keys();
  await Promise.all(
    keys.map(
      (key) => (key !== version || key !== IMAGE_CACHE) && caches.delete(key)
    )
  );
}
addEventListener("activate", (e) => e.waitUntil(activate()));

// Listen for requests
const updateImageCache = (request, response) => {
  if (request.url.includes("/images/")) {
    caches.open(IMAGE_CACHE).then((cache) => cache.put(request, response));
  }
};

const networkFetch = (request) => {
  return new Promise((fullfill) => {
    fetch(request).then((response) => {
      fullfill(response);
      updateImageCache(request, response.clone());
    });
  });
};

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || networkFetch(event.request);
    })
  );
});
