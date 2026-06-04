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
self.addEventListener('activate', () => self.clients.claim())

// ── Runtime caching ───────────────────────────────────────────────────────────
registerRoute(
  ({ url }) => url.hostname.includes('supabase.co'),
  new NetworkFirst({
    cacheName: 'supabase-cache',
    networkTimeoutSeconds: 5,
    plugins: [new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 })],
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
        if ('focus' in client) return client.focus()
      }
      if (clients.openWindow) return clients.openWindow(url)
    }),
  )
})
