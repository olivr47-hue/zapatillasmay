// zm-img: sirve y guarda en caché las fotos de Cloudinary (cuenta dybdtehhs) desde img.zapatillasmay.mx
// /image/upload/... -> https://res.cloudinary.com/dybdtehhs/image/upload/...
const ORIGEN = 'https://res.cloudinary.com/dybdtehhs'
const UN_ANIO = 31536000
const SIETE_DIAS = 604800

function formato(accept) {
  if (/image\/avif/i.test(accept)) return 'avif'
  if (/image\/webp/i.test(accept)) return 'webp'
  return 'otro'
}

// JPEG XL (image/jxl): con f_auto, Cloudinary lo manda a quien lo anuncia (p. ej. Safari). Como la clave de caché solo
// distinguía avif/webp/otro, una copia JXL quedaba guardada en el grupo «avif» y se servía a Chrome y otros navegadores
// que NO lo decodifican: la foto salía rota. Se quita de lo que se anuncia a Cloudinary y de la clave.
function sinJxl(accept) {
  return accept.split(',').filter(p => !/image\/jxl/i.test(p)).join(',')
}

function comunes(h) {
  h.set('Access-Control-Allow-Origin', '*')
  h.set('Timing-Allow-Origin', '*')
  h.set('Vary', 'Accept')
  return h
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    if (request.method === 'OPTIONS') {
      const h = comunes(new Headers())
      h.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
      h.set('Access-Control-Max-Age', '86400')
      return new Response(null, { status: 204, headers: h })
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Método no permitido', { status: 405, headers: { Allow: 'GET, HEAD, OPTIONS' } })
    }
    if (!url.pathname.startsWith('/image/upload/')) {
      return new Response('No encontrado', { status: 404, headers: { 'Cache-Control': 'no-store' } })
    }

    const accept = sinJxl(request.headers.get('Accept') || '')
    const claveUrl = new URL(url.toString())
    // _zf2 (antes _zf): clave nueva a propósito, para dejar atrás las copias JXL que ya estaban guardadas
    claveUrl.searchParams.set('_zf2', formato(accept))
    const clave = new Request(claveUrl.toString(), { method: 'GET' })
    const cache = caches.default

    let res = await cache.match(clave)
    let estado = 'HIT'
    if (!res) {
      estado = 'MISS'
      let up
      try {
        up = await fetch(ORIGEN + url.pathname + url.search, { headers: { Accept: accept, 'User-Agent': 'zm-img-worker' } })
      } catch (e) {
        return new Response('Origen no disponible', { status: 502, headers: comunes(new Headers({ 'Cache-Control': 'no-store', 'X-ZM-Cache': 'ERR' })) })
      }
      if (!up.ok) {
        const h = comunes(new Headers())
        h.set('Content-Type', up.headers.get('Content-Type') || 'text/plain')
        h.set('Cache-Control', 'no-store')
        h.set('X-ZM-Cache', 'ERR')
        return new Response(request.method === 'HEAD' ? null : up.body, { status: up.status, headers: h })
      }
      const versionada = /\/v\d{6,}\//.test(url.pathname)
      const h = new Headers()
      const tipo = up.headers.get('Content-Type')
      if (tipo) h.set('Content-Type', tipo)
      h.set('Cache-Control', 'public, max-age=' + (versionada ? UN_ANIO + ', immutable' : SIETE_DIAS))
      res = new Response(up.body, { status: 200, headers: h })
      ctx.waitUntil(cache.put(clave, res.clone()))
    }

    const salida = new Response(request.method === 'HEAD' ? null : res.body, { status: res.status, headers: new Headers(res.headers) })
    comunes(salida.headers)
    salida.headers.set('X-ZM-Cache', estado)
    return salida
  },
}
