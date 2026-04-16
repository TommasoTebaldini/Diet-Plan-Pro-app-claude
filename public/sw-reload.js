// Imported by the generated service worker.
// Forces all open windows to reload when a new SW activates,
// breaking the stale-cache cycle without requiring manual refresh.
self.addEventListener('activate', function (event) {
  event.waitUntil(
    self.clients.claim().then(function () {
      return self.clients
        .matchAll({ type: 'window', includeUncontrolled: true })
        .then(function (clients) {
          return Promise.all(
            clients.map(function (client) {
              return client.navigate(client.url).catch(function () {})
            })
          )
        })
    })
  )
})
