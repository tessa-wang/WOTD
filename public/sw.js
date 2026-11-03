// Service worker for Word of the Day.
// - App files (/_next/static, icons) are cached on the phone so the app opens quickly.
//   Their names change whenever the code changes, so a cached copy is never out of date.
// - Pages always come fresh from the server (they show today's words and who's logged in).
//   If there's no internet, a friendly offline page is shown instead of the browser's error.
// Bump VERSION to clear everything this file cached before.
const VERSION = 'v1';
const CACHE = `wotd-${VERSION}`;
const OFFLINE_URL = '/offline.html';
const PRECACHE = [OFFLINE_URL, '/icons/icon-192.png', '/icons/apple-touch-icon.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(names.filter((name) => name.startsWith('wotd-') && name !== CACHE).map((name) => caches.delete(name)));
      // Lets page requests start while the service worker wakes up, so it never slows them down.
      if (self.registration.navigationPreload) await self.registration.navigationPreload.enable();
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return; // posting a word etc. always goes straight to the server
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Opening a page: network first, offline page if that fails.
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          return (await event.preloadResponse) || (await fetch(request));
        } catch {
          return (await caches.match(OFFLINE_URL)) || Response.error();
        }
      })(),
    );
    return;
  }

  // App files: use the saved copy if there is one, otherwise download and save it.
  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/icons/')) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE);
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      })(),
    );
  }
  // Everything else (API calls, page data) goes to the network as normal.
});
