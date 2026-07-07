// Service Worker minimo para recibir notificaciones push en el portal mayorista.
self.addEventListener('push', function (event) {
  let data = { title: 'Zapatillas May', body: 'Tienes una novedad', url: '/' }
  try { data = event.data.json() } catch (e) {}
  event.waitUntil(
    self.registration.showNotification(data.title || 'Zapatillas May', {
      body: data.body || '',
      // icon-192.png es más nítido que favicon.png (64px). Sin "badge": ese campo
      // necesita un PNG con canal alpha real para que el SO recorte la silueta;
      // como favicon.png tiene fondo blanco opaco (sin transparencia), Windows lo
      // pintaba como un cuadro blanco liso en vez del logo.
      icon: '/icons/icon-192.png',
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
