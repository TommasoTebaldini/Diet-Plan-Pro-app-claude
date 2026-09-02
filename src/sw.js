// Custom Service Worker for NutriPlan PWA
// Uses Workbox (via VitePWA injectManifest) + real Web Push support
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst, StaleWhileRevalidate, CacheFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

// ── Precaching ────────────────────────────────────────────────────────────────
// cleanupOutdatedCaches() is intentionally omitted: removing old cache entries
// during SW transition causes 404s on lazy-loaded chunks still referenced by
// open tabs. Old entries expire naturally via ExpirationPlugin.
precacheAndRoute(self.__WB_MANIFEST)

// ── SW lifecycle ──────────────────────────────────────────────────────────────
self.skipWaiting()
// event.waitUntil() extends the activate event's lifetime until
// clients.claim() resolves — without it the browser (notably iOS
// Safari/WKWebView, which this Capacitor-wrapped PWA runs under) can
// consider 'activate' finished before claim() completes, leaving already
// open tabs on the previous controller instead of the new worker.
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()))

// ── Runtime caching ───────────────────────────────────────────────────────────
// Cache key includes the Authorization header: Workbox's default key is the
// URL alone, so on a shared device Patient A's cached response (diet, food
// logs, other health data) would otherwise get served to Patient B if they
// log in on the same device and hit the same URL while offline/on a slow
// connection (NetworkFirst falls back to cache after networkTimeoutSeconds).
registerRoute(
  ({ url }) => url.hostname.includes('supabase.co'),
  new NetworkFirst({
    cacheName: 'supabase-cache',
    networkTimeoutSeconds: 10,
    plugins: [
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 }),
      {
        cacheKeyWillBeUsed: async ({ request }) => {
          const auth = (request.headers && request.headers.get('Authorization')) || 'anon'
          const url = new URL(request.url)
          url.searchParams.set('__sw_auth', auth.slice(-32))
          return url.href
        },
      },
    ],
  }),
)

registerRoute(
  ({ url }) => url.pathname.includes('all-foods'),
  new CacheFirst({
    cacheName: 'all-foods-cache',
    plugins: [new ExpirationPlugin({ maxEntries: 2, maxAgeSeconds: 60 * 60 * 24 * 30 })],
  }),
)

// /data/*.json (es. quiz-questions.json, ~1MB) vive in public/ ed è quindi
// sempre presente in dist/, ma il tipo .json non è tra i globPatterns
// dell'injectManifest (vite.config.js) e non aveva nessuna route di runtime
// caching qui: senza questa route, un utente che installa la PWA e la apre
// offline PRIMA di aver mai visitato /quiz o la daily-lesson card non ha
// alcuna cache a cui appoggiarsi e il fetch fallisce. CacheFirst perché è un
// question bank statico, non dati per-utente.
registerRoute(
  ({ url }) => url.pathname.startsWith('/data/') && url.pathname.endsWith('.json'),
  new CacheFirst({
    cacheName: 'static-data-cache',
    plugins: [new ExpirationPlugin({ maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 * 30 })],
  }),
)

registerRoute(
  ({ url }) => url.hostname === 'fonts.googleapis.com',
  new StaleWhileRevalidate({ cacheName: 'google-fonts-css' }),
)

registerRoute(
  ({ url }) => url.hostname === 'fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 })],
  }),
)

// ── Web Push ──────────────────────────────────────────────────────────────────
self.addEventListener('push', function (event) {
  if (!event.data) return
  let data = {}
  try { data = event.data.json() } catch {
    data = { title: 'NutriPlan', body: event.data.text() }
  }

  const title = data.title || 'NutriPlan'
  const options = {
    body: data.body || '',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'nutriplan-push',
    renotify: true,
    data: { url: data.url || '/' },
    actions: data.actions || [],
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  const url = event.notification.data?.url || '/'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if ('focus' in client) {
          if (client.navigate) client.navigate(url)
          return client.focus()
        }
      }
      if (clients.openWindow) return clients.openWindow(url)
    }),
  )
})
