/* EcoLife service worker
   - pages, CSS and JS: network first (you always get the newest code when online), cached copy when offline
   - images and fonts: cache first (fast), filled in as you browse
   Change VERSION whenever you want every device to drop its old cache. */
const VERSION = 'ecolife-v1';
const CORE = [
  './', 'index.html', 'shop.html', 'product.html', 'cart.html', 'orders.html', 'contact.html', 'login.html', 'signup.html',
  'css/style.css', 'js/main.js', 'manifest.json',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

const putIfGood = (req, res) => {
  if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
  return res;
};

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === location.origin;
  const isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (!sameOrigin && !isFont) return;

  const isCode = sameOrigin && (req.mode === 'navigate' || /\.(html|css|js|json)$/.test(url.pathname) || url.pathname.endsWith('/'));
  if (isCode) {                                   // network first
    e.respondWith(
      fetch(req).then(res => putIfGood(req, res))
        .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('index.html')))
    );
    return;
  }
  e.respondWith(                                  // cache first (images, fonts, icons)
    caches.match(req).then(hit => hit || fetch(req).then(res => putIfGood(req, res)).catch(() => hit))
  );
});
