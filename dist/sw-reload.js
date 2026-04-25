// Imported by the generated service worker.
// Handles SKIP_WAITING messages and forces all open windows to reload on activate.
self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

self.addEventListener('activate', function (event) {
  event.waitUntil(
    self.clients.claim().then(function () {
      return self.clients
        .matchAll({ type: 'window', includeUncontrolled: true })
        .then(function (clients) {
          return Promise.all(clients.map(function (client) {
            // postMessage works on all browsers including iOS Safari
            client.postMessage({ type: 'SW_RELOAD' })
            // navigate() forces a hard reload on Chrome/Firefox/Edge
            if (typeof client.navigate === 'function') {
              return client.navigate(client.url).catch(function () {})
            }
          }))
        })
    })
  )
})
