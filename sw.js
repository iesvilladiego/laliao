// Service Worker para LaLiao V2
// Cachea los recursos principales para funcionamiento offline

const CACHE_NAME = 'laliao-v2.30';
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
      // Las cachés se llaman 'laliao-v2.XX' (con punto): el patrón antiguo
      // 'laliao-v2-' nunca coincidía y las versiones viejas se acumulaban.
      // Como caches.match() busca en TODAS las cachés, el HTML obsoleto de
      // una versión anterior seguía sirviéndose aunque la app "se actualizara".
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME && key.startsWith('laliao-v'))
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch:
//  - Navegación (el HTML de la app): NETWORK-FIRST. Así el usuario recibe
//    siempre la última versión publicada en cuanto hay conexión; la caché
//    solo entra como respaldo sin red. Con el cache-first anterior, ver una
//    actualización exigía (a veces varias) recargas o limpiar datos.
//  - Resto de assets locales: cache-first, pero leyendo SOLO de la caché de
//    esta versión (no de cualquier caché antigua que quedara huérfana).
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

  // Aislamiento respecto al portal: solo interceptar peticiones dentro
  // de la carpeta de la app (el scope del SW). El portal
  // https://iesvilladiego.github.io vive en la raíz del dominio y sus
  // páginas/recursos jamás pasan por este SW, así que ambas PWA pueden
  // convivir e instalar por separado sin interferencia.
  const scopePath = new URL(self.registration.scope).pathname;
  if (!url.pathname.startsWith(scopePath)) return;

  if (url.origin !== self.location.origin) return;

  const isNavigation = event.request.mode === 'navigate' ||
    event.request.destination === 'document' ||
    url.pathname.endsWith('/index.html') ||
    url.pathname === scopePath;

  if (isNavigation) {
    event.respondWith(
      fetch(event.request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() =>
        caches.open(CACHE_NAME)
          .then((cache) => cache.match(event.request))
          .then((cached) => cached || caches.match('./index.html'))
      )
    );
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            cache.put(event.request, clone);
          }
          return response;
        });
      })
    )
  );
});

// Permitir que el SW tome control inmediato (lo pide el banner de actualización)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
