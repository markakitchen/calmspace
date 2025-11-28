// Bumped to v4 to force an immediate update for all users
const CACHE_NAME = 'calmspace-v4';
const urlsToCache = [
    '/',
    '/index.html',
    'https://cdn.tailwindcss.com',
];

// Install: Cache core assets immediately
self.addEventListener('install', event => {
  self.skipWaiting(); // Force this SW to become active immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate: Clean up old caches immediately
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of the page immediately
  );
});

// Fetch: NETWORK FIRST for HTML, CACHE FIRST for everything else
self.addEventListener('fetch', event => {
  // If it's a navigation request (loading the page), go to network first
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request);
        })
    );
  } else {
    // For images, scripts, CSS: Cache first, then network
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request);
        })
    );
  }
});