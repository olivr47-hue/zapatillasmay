const CACHE = 'zm-v3'   // v3: vacía cachés viejas tras mover CSS/JS a /assets
const PRECACHE = ['/index.html', '/carrito.html', '/manifest.json']
const API_HOST = 'zapatillasmay-production.up.railway.app'

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url)
  // API y recursos externos: siempre red, sin caché
  if (url.hostname === API_HOST || url.hostname !== self.location.hostname) return
  if (e.request.method !== 'GET') return

  // Páginas HTML, scripts y estilos: network-first (siempre contenido fresco; la caché solo sirve sin conexión)
  if (['document', 'script', 'style'].includes(e.request.destination)) {
    e.respondWith(
      fetch(e.request)
        .then(r => { if (r.ok) { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)) } return r })
        .catch(() => caches.match(e.request))
    )
    return
  }

  // Recursos estáticos: cache-first
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached
      return fetch(e.request).then(r => {
        if (r.ok) caches.open(CACHE).then(c => c.put(e.request, r.clone()))
        return r
      })
    })
  )
})
