const CACHE_NAME = 'tws-community-v4'; // Updated version for GitHub CSV migration
const urlsToCache = [
  '/',
  '/jobs',
  '/interview-questions',
  '/favicon.ico',
  '/favicon.svg',
  '/manifest.json',
  '/apple-touch-icon.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - network first for API/data, cache first for static assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Network first strategy for GitHub CSV data and API calls
  if (url.hostname === 'raw.githubusercontent.com' || 
      url.pathname.includes('/api/') ||
      url.pathname === '/interview-questions') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response before caching
          const responseToCache = response.clone();
          
          // Cache the response for offline use (with 1 hour expiry)
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        })
        .catch(() => {
          // If network fails, try cache (offline fallback)
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              console.log('Serving from cache (offline):', event.request.url);
              return cachedResponse;
            }
            // Return a custom offline page or error
            return new Response('Offline - Data not available', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain',
              }),
            });
          });
        })
    );
  } else {
    // Cache first strategy for static assets
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(event.request).then((response) => {
            // Clone the response before caching
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
            
            return response;
          });
        })
    );
  }
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Implement background sync logic
  console.log('Background sync triggered');
}
