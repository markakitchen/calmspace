const CACHE_NAME = 'calmspace-v1';
const urlsToCache = [
    '/',
    '/index.html',
    // The CDN link to Tailwind CSS
    'https://cdn.tailwindcss.com',
    // The CDN link to Firebase (only if not used via module imports)
    // Since Firebase is imported via module, we rely on the browser's cache for those.
];

// Install event: caches the necessary assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: serves assets from cache first, then falls back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // No cache match, fetch from network
        return fetch(event.request);
      })
  );
});

// Activate event: deletes old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});