// Imported by the generated service worker.
// When a new SW activates, forces all open windows to reload.
// Uses client.navigate() for Chrome/Firefox/Edge and postMessage as iOS fallback.
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
