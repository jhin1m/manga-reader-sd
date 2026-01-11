// Service Worker for Manga Reader
// Version: 1.0.1 - Fixed Response body lock issue

const CACHE_VERSION = 'v2';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;

// Debug mode (set to false in production)
const DEBUG = false;

// Max entries per cache (prevent unbounded growth)
const MAX_STATIC_ENTRIES = 100;
const MAX_API_ENTRIES = 50;

// URL patterns for caching
const STATIC_PATTERNS = [
  /\/_next\/static\/.*\.(js|css)$/,
  /\/_next\/static\/chunks\/.*/,
  /\/_next\/static\/css\/.*/,
  /\.woff2?(\?.*)?$/,
  /\.ttf(\?.*)?$/,
];

// Skip these patterns (images, etc)
const SKIP_PATTERNS = [
  /\.(png|jpg|jpeg|gif|webp|svg|ico)$/i,
  /\/api\/v1\/chapters/,      // Chapter data - per user request
  /\/api\/v1\/auth/,          // Auth endpoints
  /\/api\/v1\/user/,          // User data
  /\/api\/v1\/library/,       // Library data
  /\/api\/v1\/.*\/comments/,  // Comments
];

// API caching config
const API_CACHE_CONFIG = [
  {
    pattern: /\/api\/v1\/mangas$/,  // List endpoint
    ttl: 5 * 60 * 1000,              // 5 minutes
    name: 'manga-list',
  },
  {
    pattern: /\/api\/v1\/mangas\?/,  // List with params
    ttl: 5 * 60 * 1000,
    name: 'manga-list-params',
  },
  {
    pattern: /\/api\/v1\/mangas\/recent/,
    ttl: 2 * 60 * 1000,  // 2 minutes - updates frequently
    name: 'manga-recent',
  },
  {
    pattern: /\/api\/v1\/mangas\/hot/,
    ttl: 5 * 60 * 1000,
    name: 'manga-hot',
  },
  {
    pattern: /\/api\/v1\/mangas\/[a-z0-9-]+$/,  // Detail by slug
    ttl: 10 * 60 * 1000,  // 10 minutes
    name: 'manga-detail',
  },
  {
    pattern: /\/api\/v1\/genres$/,
    ttl: 30 * 60 * 1000,  // 30 minutes - rarely changes
    name: 'genres',
  },
];

// ============ LIFECYCLE EVENTS ============

self.addEventListener('install', (event) => {
  if (DEBUG) console.log('[SW] Install');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  if (DEBUG) console.log('[SW] Activate');
  event.waitUntil(
    Promise.all([
      // Clear old caches
      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== API_CACHE)
            .map((key) => {
              if (DEBUG) console.log('[SW] Deleting old cache:', key);
              return caches.delete(key);
            })
        )
      ),
      // Take control of all clients
      self.clients.claim(),
    ])
  );
});

// ============ FETCH HANDLER ============

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Skip non-http
  if (!url.protocol.startsWith('http')) return;

  // Skip patterns
  if (shouldSkip(url.pathname)) return;

  // Static assets: Cache-First
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // API: Network-First with TTL
  const apiConfig = getApiConfig(url.pathname);
  if (apiConfig) {
    event.respondWith(networkFirstWithTTL(request, API_CACHE, apiConfig.ttl));
    return;
  }
});

// ============ HELPER FUNCTIONS ============

function shouldSkip(pathname) {
  return SKIP_PATTERNS.some((p) => p.test(pathname));
}

function isStaticAsset(pathname) {
  return STATIC_PATTERNS.some((p) => p.test(pathname));
}

function getApiConfig(pathname) {
  return API_CACHE_CONFIG.find((c) => c.pattern.test(pathname));
}

// ============ CACHING STRATEGIES ============

/**
 * Cache-First Strategy
 * Best for static immutable assets
 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);

    if (response.ok && response.status === 200) {
      // Clone before caching
      const responseClone = response.clone();
      cache.put(request, responseClone);

      // Cleanup old entries
      trimCache(cacheName, MAX_STATIC_ENTRIES);
    }

    return response;
  } catch (error) {
    if (DEBUG) console.error('[SW] Fetch failed:', request.url);
    throw error;
  }
}

/**
 * Network-First with TTL Strategy
 * Best for API data that should be fresh but can fallback to cache
 */
async function networkFirstWithTTL(request, cacheName, ttl) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);

    if (response.ok && response.status === 200) {
      // Clone response before processing (prevent body lock)
      const responseToCache = response.clone();
      const responseToReturn = response.clone();

      // Add timestamp for TTL checking
      const responseWithTimestamp = await addTimestamp(responseToCache);
      cache.put(request, responseWithTimestamp);

      // Cleanup old entries
      trimCache(cacheName, MAX_API_ENTRIES);

      return responseToReturn;
    }

    return response;
  } catch (error) {
    // Network failed - try cache
    if (DEBUG) console.log('[SW] Network failed, checking cache:', request.url);

    const cached = await cache.match(request);

    if (cached) {
      // Only serve 200 OK responses from cache (prevent cache poisoning)
      if (cached.status !== 200) {
        throw new Error('Cached response not OK');
      }

      const cachedAt = cached.headers.get('x-sw-cached-at');
      const age = cachedAt ? Date.now() - parseInt(cachedAt, 10) : Infinity;

      if (age < ttl) {
        if (DEBUG) console.log('[SW] Serving stale cache (age:', Math.round(age / 1000), 's)');
        return cached;
      }

      if (DEBUG) console.log('[SW] Cache expired (age:', Math.round(age / 1000), 's)');
    }

    throw error;
  }
}

/**
 * Add timestamp header to response for TTL tracking
 */
async function addTimestamp(response) {
  const body = await response.blob();
  const headers = new Headers(response.headers);
  headers.set('x-sw-cached-at', Date.now().toString());

  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * Trim cache to max entries (LRU-style)
 */
async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxEntries) {
    const deleteCount = keys.length - maxEntries;
    if (DEBUG) console.log('[SW] Trimming cache:', cacheName, 'deleting', deleteCount, 'entries');

    // Delete oldest entries (first in array)
    for (let i = 0; i < deleteCount; i++) {
      await cache.delete(keys[i]);
    }
  }
}

// ============ MESSAGE HANDLER ============

self.addEventListener('message', (event) => {
  const message = typeof event.data === 'string' ? event.data : event.data?.type;

  if (message === 'SKIP_WAITING') {
    if (DEBUG) console.log('[SW] Skipping waiting - activating now');
    self.skipWaiting();
  }

  if (message === 'CLEAR_CACHE') {
    if (DEBUG) console.log('[SW] Clearing all caches');
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => caches.delete(key)))
    );
  }
});
