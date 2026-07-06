// Service Worker minimo para recibir notificaciones push en la tienda.
self.addEventListener('push', function (event) {
  let data = { title: 'Zapatillas May', body: 'Tienes una novedad', url: '/' }
  try { data = event.data.json() } catch (e) {}
  event.waitUntil(
    self.registration.showNotification(data.title || 'Zapatillas May', {
      body: data.body || '',
      icon: '/favicon.png',
      badge: '/favicon.png',
      data: { url: data.url || '/' },
    })
  )
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  const url = (event.notification.data && event.notification.data.url) || '/'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (windowClients) {
      for (const client of windowClients) {
        if (client.url === url && 'focus' in client) return client.focus()
      }
      if (clients.openWindow) return clients.openWindow(url)
    })
  )
})
