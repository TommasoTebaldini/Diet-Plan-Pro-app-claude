// Imported by the generated service worker.
// When a new SW activates, tells all open windows to reload via postMessage
// (works on all browsers including iOS Safari, unlike client.navigate()).
self.addEventListener('activate', function (event) {
  event.waitUntil(
    self.clients.claim().then(function () {
      return self.clients
        .matchAll({ type: 'window', includeUncontrolled: true })
        .then(function (clients) {
          clients.forEach(function (client) {
            client.postMessage({ type: 'SW_RELOAD' })
          })
        })
    })
  )
})
