// Imported by the generated service worker.
// Only handles SKIP_WAITING messages — no forced page reload on activate.
self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
