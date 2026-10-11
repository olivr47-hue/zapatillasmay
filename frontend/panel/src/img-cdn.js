// Fotos de Cloudinary para PANTALLA: optimizadas (WebP/AVIF + ancho) y servidas por img.zapatillasmay.mx (Cloudflare guarda cada foto
// y Cloudinary ya no gasta descarga). Las descargas, el compartir y los PDF siguen usando la foto ORIGINAL (se toman de los datos, no de lo que se ve).
// Si img.zapatillasmay.mx falla, la foto se vuelve a pedir a Cloudinary. Interruptor de emergencia: localStorage.zm_img = 'cloudinary'
// Debe coincidir con zmCdn()/zmImg() de la tienda (frontend/tienda) y con _cdn_img() de backend/routers/seo.py.
const CLD = 'https://res.cloudinary.com/dybdtehhs/image/upload/'
const CDN = 'https://img.zapatillasmay.mx/image/upload/'

export function zmCdn(u) {
  if (typeof u !== 'string' || u.indexOf(CLD) !== 0) return u
  try { if (localStorage.getItem('zm_img') === 'cloudinary') return u } catch (e) {}
  return CDN + u.slice(CLD.length)
}

export function zmImg(url, w) {
  if (!url || typeof url !== 'string') return url || ''
  if (url.indexOf('/image/upload/') === -1) return url                       // no es Cloudinary
  if (url.indexOf('/upload/f_auto') !== -1 || url.indexOf(',f_auto') !== -1) return zmCdn(url)   // ya optimizada
  return zmCdn(url.replace('/image/upload/', `/image/upload/w_${w},f_auto,q_auto/`))
}

if (typeof window !== 'undefined' && !window.__zmImgListo) {
  window.__zmImgListo = true
  window.pcImg = zmImg   // para los onclick="" del HTML generado
  window.addEventListener('error', function (e) {
    const t = e.target
    if (!t || t.tagName !== 'IMG') return
    const estado = t.getAttribute('data-zm-fb')
    if (estado === '2') return
    const src = t.getAttribute('src') || ''
    const srcset = t.getAttribute('srcset') || ''
    if (estado !== '1' && (src.indexOf(CDN) === 0 || srcset.indexOf(CDN) !== -1)) {
      t.setAttribute('data-zm-fb', '1')   // primera falla: se vuelve a pedir a Cloudinary
      const volver = v => v.split(CDN).join(CLD)
      if (srcset) t.setAttribute('srcset', volver(srcset))
      t.setAttribute('src', volver(src))
    } else if (estado === '1') {
      t.setAttribute('data-zm-fb', '2')   // también falló Cloudinary: ya no se insiste
    }
  }, true)
}
