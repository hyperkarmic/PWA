// Files to cache

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/index.js",
  "/style.css",
  "/serviceScript.js",
  "/manifest.webmanifest",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// Static Cache name

const CACHE_NAME = "static-cache";

// Data Cache name

const DATA_CACHE_NAME = "data-cache";

// On install
const onInstall = async (event) => {
  // Creates a cache with the CACHE_NAME
  const createCache = await caches.open(CACHE_NAME);
  // Then adds the FILES_TO_CACHE to the cache
  createCache.addAll(FILES_TO_CACHE);
  // Wait till createCache is made and then skip waiting
  event.waitUntil(createCache);
  self.skipWaiting();
};

// On active
const onActive = (event) => {
  // Get the cache keys then if the key in the array doesn't match the key then delete it
  const cacheUpdate = cache.keys().then((key) => {
    const promises = key.map((item) => {
      // if cache name doesn't match the CACHE_NAME or DATA_CACHE_NAME then delete them
      if (item !== CACHE_NAME && item !== DATA_CACHE_NAME) caches.delete(item);
    });
    // if the key matches then return it in a promise
    return Promise.all(promises);
  });
  // Wait until the cacheUpdate has finished
  event.waitUntil(cacheUpdate);
  self.clients.claim();
};

// On fetch of the cache
const onFetch = (event) => {
  // Cache on successful requests to the api routes
  if (event.request.url.includes("/api/")) {
    // Check if the data is on ther server or offline
    const checkIfCacheOrOnServer = caches
      // Then open the cache using the DATA_CACHE_NAME
      .open(DATA_CACHE_NAME)
      .then((cache) => {
        // Return the event request and then check if the response status is 200. If so
        // update the url and clone the response
        return fetch(event.request)
          .then((response) => {
            // If the response was good, clone it and store it in the cache.
            if (response.status === 200)
              cache.put(event.request.url, response.clone());
            return response;
          })
          .catch((err) => cache.match(event.request));
      })
      .catch((err) => console.log(err));
    // Respond with the cache
    event.respondWith(checkIfCacheOrOnServer);
    return;
  }
  // If request doesn't include /api/ then match the caches and then send response or fetch
  // from the event request
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
};

//Event listeners
self.addEventListener("install", onInstall);
self.addEventListener("active", onActive);
self.addEventListener("fetch", onFetch);
