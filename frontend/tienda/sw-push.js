// Service Worker minimo para recibir notificaciones push en la tienda.
self.addEventListener('push', function (event) {
  let data = { title: 'Zapatillas May', body: 'Tienes una novedad', url: '/' }
  try { data = event.data.json() } catch (e) {}
  event.waitUntil(
    self.registration.showNotification(data.title || 'Zapatillas May', {
      body: data.body || '',
      // /favicon.png no existe en la tienda (la notificación salía sin ícono): se usa el mismo logo del manifest
      icon: 'https://res.cloudinary.com/dybdtehhs/image/upload/w_192,h_192,c_pad,b_white,f_png,q_auto/v1776836428/Proyecto_nuevo_wpdwus.png',
      data: { url: data.url || '/' },
    })
  )
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  // El link puede venir relativo ("/portal"): se resuelve contra este sitio. Antes se comparaba "/portal" con la URL completa
  // de la pestaña, nunca coincidía y siempre se abría una pestaña nueva. Un link a otro sitio se ignora (solo se abre este sitio).
  let destino = new URL('/', self.location.origin)
  try {
    const u = new URL((event.notification.data && event.notification.data.url) || '/', self.location.origin)
    if (u.origin === self.location.origin) destino = u
  } catch (e) {}
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (windowClients) {
      for (const client of windowClients) {
        if (client.url === destino.href && 'focus' in client) return client.focus()
      }
      if (clients.openWindow) return clients.openWindow(destino.href)
    })
  )
})
