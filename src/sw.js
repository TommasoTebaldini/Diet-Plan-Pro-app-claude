import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'

// Activate immediately, don't wait for the old SW to stop
self.addEventListener('install', () => self.skipWaiting())

// On activation: take control, then force-navigate all open windows
// so that users with stale cached JS get fresh code automatically
self.addEventListener('activate', event => {
  event.waitUntil(
    self.clients.claim().then(async () => {
      try {
        const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
        await Promise.all(all.map(c => c.navigate(c.url).catch(() => {})))
      } catch (_) {}
    })
  )
})

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

// Supabase API calls: network-first, fall back to cache
self.addEventListener('fetch', event => {
  if (!event.request.url.includes('supabase.co')) return
  event.respondWith(
    fetch(event.request, { credentials: 'include' })
      .catch(() => caches.match(event.request))
  )
})
