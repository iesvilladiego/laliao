// Service Worker para LaLiao V2
// Cachea los recursos principales para funcionamiento offline

const CACHE_NAME = 'laliao-v2-v10';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.svg',
  './favicon.svg',
  './favicon-32.png',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

// Instalación: precachear assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
      .catch((err) => console.log('SW install error:', err))
  );
});

// Activación: limpiar cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: estrategia cache-first para assets locales, network-first para Firebase
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // No interceptar peticiones a Firebase ni CDNs
  if (url.hostname.includes('firebaseio.com') ||
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('gstatic.com') ||
      url.hostname.includes('jsdelivr.net')) {
    return;
  }

  // Solo interceptar GET
  if (event.request.method !== 'GET') return;

  // Cache-first para assets locales
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => {
          // Fallback: si no hay red ni caché, servir el index.html para SPA
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return cached;
        });
      })
    );
  }
});

// Permitir que el SW tome control inmediatamente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
