const CACHE_NAME = "password-manager-cache-v1";
const urlsToCache = [
    "./LP.html",
    "./LP.css",
    "./LP_Main.js",
    "./manifest.json",
    "./icon-192x192.png",
    "./icon-512x512.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
