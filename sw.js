/* Elimu AI service worker.
 *
 * Cache policy:
 * - Shell assets: cache-first, versioned.
 * - Curriculum catalog: stale-while-revalidate.
 * - Text packs: cache-first after explicit save.
 * - PDFs/audio: cache only after an explicit PIN_SOURCE message and only for
 *   same-origin/CORS-readable responses; cross-origin rights gateway belongs
 *   in production.
 */
const VERSION = '2026-08-13-1';
const SHELL_CACHE = `elimu-shell-${VERSION}`;
const CATALOG_CACHE = `elimu-catalog-${VERSION}`;
const TEXT_CACHE = `elimu-text-${VERSION}`;
const MEDIA_CACHE = `elimu-media-${VERSION}`;
const SHELL_ASSETS = [
  './elimu-ai.html',
  './offline-store.js',
  './curriculum-catalog.json'
];
const CACHE_NAMES = [SHELL_CACHE, CATALOG_CACHE, TEXT_CACHE, MEDIA_CACHE];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) => Promise.all(
        keys.filter((key) => key.startsWith('elimu-') && !CACHE_NAMES.includes(key))
          .map((key) => caches.delete(key))
      )),
      self.clients.claim()
    ])
  );
});

function isCatalogRequest(request) {
  return new URL(request.url).pathname.endsWith('/curriculum-catalog.json');
}

function isTextPackRequest(request) {
  return new URL(request.url).pathname.startsWith('/offline-text/');
}

function isAppShellRequest(request) {
  const url = new URL(request.url);
  return url.origin === self.location.origin && (
    url.pathname.endsWith('/elimu-ai.html') ||
    url.pathname.endsWith('/offline-store.js') ||
    url.pathname.endsWith('/sw.js')
  );
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok && response.type !== 'opaque') {
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Elimu AI is unavailable offline for this resource.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CATALOG_CACHE);
  const cached = await cache.match(request);
  const network = fetch(request).then(async (response) => {
    if (response.ok && response.type !== 'opaque') await cache.put(request, response.clone());
    return response;
  }).catch(() => null);
  return cached || network || new Response(JSON.stringify({ entries: [] }), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}

async function networkThenCache(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request, { credentials: 'same-origin' });
    // Do not persist opaque cross-origin responses. The production rights-aware
    // gateway must proxy approved files through the Elimu AI origin.
    if (response.ok && response.type !== 'opaque') await cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    return new Response('This source is not available offline yet.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  if (isCatalogRequest(request)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
  if (isTextPackRequest(request)) {
    event.respondWith(cacheFirst(request, TEXT_CACHE));
    return;
  }
  if (isAppShellRequest(request)) {
    event.respondWith(cacheFirst(request, SHELL_CACHE));
  }
});

self.addEventListener('message', (event) => {
  const message = event.data || {};
  if (message.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }
  if (message.type === 'CACHE_CATALOG' && message.payload) {
    event.waitUntil((async () => {
      const cache = await caches.open(CATALOG_CACHE);
      const request = new Request('./curriculum-catalog.json');
      await cache.put(request, new Response(JSON.stringify(message.payload), {
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      }));
    })());
    return;
  }
  if (message.type === 'CACHE_TEXT' && message.key && message.payload) {
    event.waitUntil((async () => {
      const cache = await caches.open(TEXT_CACHE);
      await cache.put(new Request(`/offline-text/${encodeURIComponent(message.key)}`), new Response(JSON.stringify(message.payload), {
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      }));
    })());
    return;
  }
  if (message.type === 'PIN_SOURCE' && message.metadata && message.metadata.url) {
    event.waitUntil(networkThenCache(new Request(message.metadata.url), MEDIA_CACHE));
    return;
  }
  if (message.type === 'REMOVE_SOURCE' && message.id) {
    event.waitUntil(caches.open(MEDIA_CACHE).then((cache) => cache.keys().then((requests) => Promise.all(
      requests.filter((request) => request.url.includes(message.id)).map((request) => cache.delete(request))
    ))));
    return;
  }
  if (message.type === 'CLEAR_MEDIA') {
    event.waitUntil(caches.delete(MEDIA_CACHE));
  }
});
