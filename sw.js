// ==================== SERVICE WORKER - LAPORAN HARIAN PROYEK ====================
// Version: 1.0.0

const CACHE_NAME = 'laporan-proyek-v1.0.0';
const DYNAMIC_CACHE = 'laporan-proyek-dynamic-v1.0.0';

// Assets to cache during installation
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/js/html2canvas.min.js',
  '/manifest.json'
];

// ==================== INSTALL EVENT ====================
self.addEventListener('install', (event) => {
  console.log('🛠️ Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Service Worker: Installation completed');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker: Installation failed', error);
      })
  );
});

// ==================== ACTIVATE EVENT ====================
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches
            if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker: Activation completed');
        return self.clients.claim();
      })
      .catch((error) => {
        console.error('❌ Service Worker: Activation failed', error);
      })
  );
});

// ==================== FETCH EVENT ====================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip Chrome extensions
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // HTML pages - network first
  if (request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Static assets - cache first
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // Default strategy for other requests
  event.respondWith(networkFirstStrategy(request));
});

// ==================== CACHING STRATEGIES ====================

/**
 * Network First Strategy
 * Try network first, fallback to cache
 */
async function networkFirstStrategy(request) {
  try {
    // Try to fetch from network
    const networkResponse = await fetch(request);
    
    // If successful, update cache
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🌐 Network failed, trying cache...', error);
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return error response
    return new Response('Network error', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

/**
 * Cache First Strategy
 * Try cache first, fallback to network
 */
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // Try network if no cache
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('❌ Cache first strategy failed', error);
    
    // Return appropriate fallback based on request type
    return getFallbackResponse(request);
  }
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Check if request is for static asset
 */
function isStaticAsset(request) {
  const url = new URL(request.url);
  return (
    url.pathname.includes('.css') ||
    url.pathname.includes('.js') ||
    url.pathname.includes('.json') ||
    STATIC_ASSETS.includes(url.pathname)
  );
}

/**
 * Get appropriate fallback response
 */
async function getFallbackResponse(request) {
  if (request.destination === 'image') {
    return new Response(
      '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="16" fill="#666">Offline</text></svg>',
      {
        headers: {
          'Content-Type': 'image/svg+xml'
        }
      }
    );
  }
  
  return new Response('Offline', {
    status: 408,
    headers: { 'Content-Type': 'text/plain' }
  });
}

// ==================== MESSAGE HANDLING ====================
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({
        version: '1.0.0',
        cacheName: CACHE_NAME
      });
      break;
  }
});

// ==================== OFFLINE DETECTION ====================
function updateOnlineStatus() {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: 'NETWORK_STATUS',
        isOnline: navigator.onLine
      });
    });
  });
}

self.addEventListener('online', updateOnlineStatus);
self.addEventListener('offline', updateOnlineStatus);

console.log('🚀 Service Worker: Loaded successfully');