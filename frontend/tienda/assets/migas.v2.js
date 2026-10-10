/* Migas de pan visibles (Inicio › Catálogo › Tacones › Modelo) en la ficha, las listas y las páginas informativas.
   Se calcula solo a partir de la dirección y se vuelve a pintar cuando la tienda cambia de vista sin recargar. */
(function () {
  var CATS = { tacones: 'Tacones', sandalias: 'Sandalias', botas: 'Botas', botines: 'Botines', flats: 'Flats', plataformas: 'Plataformas', tenis: 'Tenis', nina: 'Niña', accesorios: 'Accesorios' }
  var PAGS = { nosotros: 'Nosotros', contacto: 'Contacto', envios: 'Envíos', 'tabla-tallas': 'Tabla de tallas', 'como-comprar': 'Cómo comprar',
    privacidad: 'Política de privacidad', 'politica-de-devoluciones': 'Política de devoluciones', devoluciones: 'Política de devoluciones',
    terminos: 'Términos y condiciones', 'eliminacion-datos': 'Eliminación de datos', guias: 'Guías de compra', mayoreo: 'Mayoreo', vender: 'Vende con nosotros' }

  function esc(t) { return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') }
  function tituloPagina() { return (document.title || '').split(/\s[|—–]\s/)[0].replace(/^Guía:?\s*/i, '').trim() }

  function categoriaProducto() {
    try {
      var l = document.querySelectorAll('script[type="application/ld+json"]')
      for (var i = 0; i < l.length; i++) {
        var j = JSON.parse(l[i].textContent), arr = j['@graph'] || [j]
        for (var k = 0; k < arr.length; k++) if (arr[k]['@type'] === 'Product' && arr[k].category) return String(arr[k].category).toLowerCase()
      }
    } catch (e) {}
    var el = document.querySelector('.product-cat')
    return el ? el.textContent.trim().toLowerCase() : ''
  }

  function camino() {
    var p = location.pathname.replace(/\/+$/, '') || '/', h = location.hash
    var inicio = ['Inicio', '/']
    if (p.indexOf('/producto/') === 0) {
      var h1 = document.querySelector('h1.product-name, h1'), nombre = h1 ? h1.textContent.trim() : ''
      var cat = categoriaProducto(), t = [inicio, ['Catálogo', '/#catalogo']]
      if (cat && CATS[cat]) t.push([CATS[cat], '/' + cat])
      else if (cat) t.push([cat.charAt(0).toUpperCase() + cat.slice(1), '/' + cat])
      if (nombre) t.push([nombre])
      return { t: t, donde: 'producto' }
    }
    var c = p.slice(1)
    if (p !== '/' && CATS[c]) return { t: [inicio, ['Catálogo', '/#catalogo'], [CATS[c]]], donde: 'lista' }
    if (p === '/ofertas') return { t: [inicio, ['Ofertas']], donde: 'lista' }
    if (p === '/' && h === '#catalogo') return { t: [inicio, ['Catálogo']], donde: 'lista' }
    if (p === '/' && h === '#nuevos') return { t: [inicio, ['Nuevos modelos']], donde: 'lista' }
    if (p === '/' && h.indexOf('#categoria/') === 0) { var cc = h.replace('#categoria/', ''); return { t: [inicio, ['Catálogo', '/#catalogo'], [CATS[cc] || cc]], donde: 'lista' } }
    if (PAGS[c]) return { t: [inicio, [PAGS[c]]], donde: 'pagina' }
    if (c.indexOf('guia-') === 0) return { t: [inicio, ['Guías de compra', '/guias'], [tituloPagina() || 'Guía']], donde: 'pagina' }
    return null
  }

  function destino(donde) {
    if (donde === 'producto') return document.getElementById('contenido-principal')
    if (donde === 'lista') return document.getElementById('productos-section')
    var s = document.getElementById('ssr-page-content')
    if (s && s.offsetParent !== null) return s
    var c = document.getElementById('pagina-contenido')
    return c && c.offsetParent !== null ? c : (s || c)
  }

  function pintar() {
    var viejo = document.getElementById('zm-migas')
    var r = camino()
    if (!r || r.t.length < 2) { if (viejo) viejo.remove(); return }
    var cont = destino(r.donde)
    if (!cont) { if (viejo) viejo.remove(); return }
    var html = r.t.map(function (x, i) {
      var ultimo = i === r.t.length - 1
      return ultimo || !x[1]
        ? '<span class="zm-migas-actual" aria-current="page">' + esc(x[0]) + '</span>'
        : '<a href="' + esc(x[1]) + '">' + esc(x[0]) + '</a><span class="zm-migas-sep" aria-hidden="true">›</span>'
    }).join('')
    if (!viejo) { viejo = document.createElement('nav'); viejo.id = 'zm-migas'; viejo.className = 'zm-migas'; viejo.setAttribute('aria-label', 'Migas de pan') }
    if (viejo.innerHTML !== html) viejo.innerHTML = html
    if (viejo.parentNode !== cont || cont.firstChild !== viejo) cont.insertBefore(viejo, cont.firstChild)
  }

  var st = document.createElement('style')
  st.textContent = '.zm-migas{display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding:22px 16px 6px;font-size:.78rem;line-height:1.3;color:#8a7868;font-family:inherit}' +
    '.zm-migas a{color:#8a7868;text-decoration:none;font-weight:500}.zm-migas a:hover{color:#B5687A;text-decoration:underline}' +
    '.zm-migas-sep{color:#c9b8aa}.zm-migas-actual{color:#2A1A0E;font-weight:700;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '@media(min-width:769px){.zm-migas{padding:14px 40px 6px;font-size:.82rem}}'
  document.head.appendChild(st)

  var t
  function pronto() { clearTimeout(t); t = setTimeout(pintar, 60) }
  ;['pushState', 'replaceState'].forEach(function (m) {
    var o = history[m]
    history[m] = function () { var r = o.apply(this, arguments); pronto(); return r }
  })
  window.addEventListener('popstate', pronto)
  window.addEventListener('hashchange', pronto)
  new MutationObserver(pronto).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  // la tienda arma la ficha y las listas de forma asíncrona: se vuelve a pintar mientras termina de cargar
  ;[300, 900, 1800, 3500].forEach(function (ms) { setTimeout(pintar, ms) })
  if (document.readyState !== 'loading') pintar(); else document.addEventListener('DOMContentLoaded', pintar)
})()
