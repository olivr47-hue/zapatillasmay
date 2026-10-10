  const API = 'https://zapatillasmay-production.up.railway.app'
  // Redimensiona/optimiza imágenes de Cloudinary al vuelo (WebP/AVIF + ancho objetivo).
  // Evita servir el original 1536x2048 cuando se muestra a ~440px.
  function zmImg(url, w){
    if (!url || typeof url !== 'string') return url || ''
    if (url.indexOf('/image/upload/') === -1) return url      // no es Cloudinary
    if (url.indexOf('/upload/f_auto') !== -1 || url.indexOf(',f_auto') !== -1) return url // ya optimizada
    return url.replace('/image/upload/', `/image/upload/w_${w},f_auto,q_auto/`)
  }
  // "Nuevo" se calcula por fecha real de alta (últimos 30 días), no por la
  // bandera manual `nuevo` -- esa nunca se apagaba sola (productos de hace
  // meses se quedaban marcados) y tampoco se llenaba en todas las vías de
  // alta de producto (ej. import masivo), así que modelos genuinamente
  // recientes no aparecían. `created_at` sí lo pone siempre la base de datos.
  // Desde el panel (Productos > ✨ Novedades) se puede elegir por modelo: novedad = 'nuevo' | 'resurtido' (siempre salen),
  // 'no' (nunca salen) o vacío (automático: nuevo si tiene menos de 30 días).
  function esNuevo(p){
    if (!p) return false
    if (p.novedad === 'no') return false
    if (_novGrupos(p).length) return true
    if (p.novedad === 'nuevo' || p.novedad === 'resurtido') return true
    if (!p.created_at) return false
    return (Date.now() - new Date(p.created_at).getTime()) < 30*24*60*60*1000
  }
  // Colores marcados por modelo (novedad_colores = {"NEGRO":"resurtido","ROJO":"nuevo"}): solo llegó un color nuevo o solo se resurtió uno
  function _novGrupos(p){
    const mc = p && p.novedad_colores
    if (!mc || typeof mc !== 'object') return []
    const g = { nuevo: [], resurtido: [] }
    Object.keys(mc).forEach(c => { if (g[mc[c]]) g[mc[c]].push(c) })
    const out = []
    if (g.resurtido.length) out.push({ tipo: 'resurtido', colores: g.resurtido })
    if (g.nuevo.length) out.push({ tipo: 'nuevo', colores: g.nuevo })
    return out
  }
  function etiquetaNovedad(p){
    if (!esNuevo(p)) return ''
    const grupos = _novGrupos(p)
    if (grupos.length) {
      const nom = (c) => c.charAt(0).toUpperCase() + c.slice(1).toLowerCase()
      return grupos.map((g, i) => g.tipo === 'resurtido'
        ? `<span class="product-badge badge-new" style="background:#0B86C4;color:#fff${i ? ';top:calc(var(--bd-top,10px) + 28px)' : ''}">Resurtido · ${g.colores.map(nom).join(', ')}</span>`
        : `<span class="product-badge badge-new" style="${i ? 'top:calc(var(--bd-top,10px) + 28px)' : ''}">Nuevo color · ${g.colores.map(nom).join(', ')}</span>`).join('')
    }
    return p.novedad === 'resurtido'
      ? '<span class="product-badge badge-new" style="background:#0B86C4;color:#fff">Resurtido</span>'
      : '<span class="product-badge badge-new">Nuevo</span>'
  }
  let productos = []
  let variantes = []
  let inventario = []
  // Restaurar carrito desde sessionStorage (persiste entre navegaciones de la sesión)
  let carrito = (() => { try { return JSON.parse(localStorage.getItem('zm_carrito') || '[]') } catch(e) { return [] } })()
  let productoSeleccionado = null
  let colorSeleccionado = null
  let tallaSeleccionada = null
  let varianteSeleccionada = null

  const ICONOS_CATS = {
    tacones: '👡', sandalias: '🩴', botas: '🥾', botines: '👢',
    flats: '🩰', plataformas: '👠', tenis: '👟', nina: '🎀', accesorios: '👜'
  }
  // Manejar URLs directas
window.addEventListener('load', () => {
  // Ocultar hero inmediatamente en rutas de categoría/interna (antes de cualquier async)
  const _pathLoad = window.location.pathname
  const _catPathsLoad = ['/tacones','/sandalias','/botas','/botines','/flats','/plataformas','/tenis','/nina','/accesorios','/catalogo','/ofertas','/nosotros','/contacto','/mayoreo','/envios','/tabla-tallas','/como-comprar','/devoluciones','/privacidad','/terminos','/eliminacion-datos','/pedido-exitoso','/pedido-pendiente','/pedido-fallido']
  if (_catPathsLoad.includes(_pathLoad) || ['#catalogo', '#nuevos'].includes(window.location.hash)) {
    const _hLoad = document.getElementById('hero-section')
    if (_hLoad) _hLoad.style.setProperty('display','none','important')
  }
  document.getElementById('hero-section').classList.add('loaded')
  const path = window.location.pathname
  const hash = window.location.hash
  const params = new URLSearchParams(window.location.search)
  const pSlug = params.get('p')

  // Renderizar carrito restaurado desde sessionStorage
  recalcularCarrito()
  renderCarrito()

  // Redirigir a mi-cuenta si viene con ?login=1
  if (params.get('login') === '1') {
    const redir = params.get('redirect') || ''
    window.location.href = '/mi-cuenta' + (redir ? '?redirect=' + encodeURIComponent(redir) : '')
  }

  // Abrir carrito automáticamente si viene de "Ver carrito" en página de producto
  if (params.get('opencart') === '1') {
    history.replaceState(null, '', '/')
    setTimeout(() => abrirCarrito(), 300)
  }

  // ── Agregar al carrito desde página de producto (sin modal) ──
  if (params.get('addtocart') === '1' && !pSlug) {
    const _raw = sessionStorage.getItem('zm_addtocart')
    sessionStorage.removeItem('zm_addtocart')
    history.replaceState(null, '', '/')
    if (_raw) {
      ;(window._initPromise || Promise.resolve()).then(() => {
        try {
          const item = JSON.parse(_raw)
          const existente = carrito.find(i => i.variante_id && i.variante_id === item.variante_id)
          if (existente) { existente.cantidad++ }
          else { carrito.push(item) }
          // Pixels
          if (window.fbq) fbq('track', 'AddToCart', { content_ids: [item.sku_interno || item.producto_id], content_type: 'product', content_name: item.nombre, value: item.precio_unitario, currency: 'MXN' })
          if (window.ttq) ttq.track('AddToCart', { content_id: item.sku_interno || item.producto_id, content_type: 'product', content_name: item.nombre, value: item.precio_unitario, price: item.precio_unitario, currency: 'MXN' })
          recalcularCarrito()
          renderCarrito()
          mostrarToast('Producto agregado al carrito')
          setTimeout(() => abrirCarrito(), 200)
        } catch(e) {}
      })
    }
  }

  if (path === '/pedido-exitoso' || params.get('status') === 'approved') {
    const paymentId = params.get('payment_id')
    // Valor real guardado en checkout antes de ir a MercadoPago (merchant_order_id NO es el monto)
    let _valor = 0, _ids = []
    // localStorage (no sessionStorage) — sobrevive el redirect de MercadoPago en móvil
    try { _valor = parseFloat(localStorage.getItem('zm_purchase_value') || '0') } catch(e){}
    try { _ids = JSON.parse(localStorage.getItem('fbq_checkout_ids') || '[]') } catch(e){}
    window._pendingPurchase = { valor: _valor, ids: _ids, paymentId }
    _intentarPurchase()  // intenta ya (si los pixeles cargaron); si no, cargarConfigSEO reintenta
    // Vaciar carrito tras compra exitosa
    try { localStorage.removeItem('zm_carrito') } catch(e){}
    carrito = []
    try { recalcularCarrito(); renderCarrito() } catch(e){}
    // Marcar carrito abandonado como convertido si había uno registrado
    try {
      const emailGuardado = localStorage.getItem('zm_checkout_email')
      if (emailGuardado) {
        fetch(API + '/carrito-abandonado/guardar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailGuardado, items: [], total: 0, convertido: true })
        }).catch(()=>{})
        localStorage.removeItem('zm_checkout_email')
      }
    } catch(e){}
    // Limpiar claves de localStorage ya usadas
    try {
      localStorage.removeItem('zm_purchase_value')
      localStorage.removeItem('fbq_checkout_ids')
    } catch(e){}
    const _pedidoId = (() => { try { return localStorage.getItem('zm_checkout_pedido_id') || '' } catch(e) { return '' } })()
    setTimeout(() => mostrarPaginaExito(paymentId, _pedidoId), 500)

  } else if (path === '/pedido-pendiente' || params.get('status') === 'pending') {
    // SPEI u otro método pendiente — limpiar carrito y mostrar pantalla de espera
    try { localStorage.removeItem('zm_carrito') } catch(e){}
    // A5: limpiar claves de compra para no contaminar un Purchase futuro
    try { localStorage.removeItem('zm_purchase_value'); localStorage.removeItem('fbq_checkout_ids') } catch(e){}
    carrito = []
    try { recalcularCarrito(); renderCarrito() } catch(e){}
    const extRef = params.get('external_reference') || ''
    const pedidoShort = extRef ? extRef.substring(0, 8).toUpperCase() : ''
    setTimeout(() => mostrarPaginaPendiente(pedidoShort), 500)

  } else if (path === '/pedido-fallido' || params.get('status') === 'failure') {
    // Pago rechazado — limpiar claves de compra para evitar Purchase duplicado en reintento
    try { localStorage.removeItem('zm_purchase_value'); localStorage.removeItem('fbq_checkout_ids') } catch(e){}
    setTimeout(() => mostrarPaginaFallido(), 500)

  } else if (pSlug) {
    const colorParam = params.get('color')
    const tallaParam = params.get('talla')
    let _dest = '/producto/' + pSlug
    const _q = []
    if (colorParam) _q.push('color=' + encodeURIComponent(colorParam))
    if (tallaParam) _q.push('talla=' + encodeURIComponent(tallaParam))
    if (_q.length) _dest += '?' + _q.join('&')
    window.location.replace(_dest)
  } else if (path.startsWith('/producto/')) {
    window.location.replace(path + (window.location.search || ''))
    // ── Rutas limpias para páginas de información ──
  } else if (path === '/mayoreo' || path === '/precios-mayoreo') {
    ;(window._initPromise || Promise.resolve()).then(() => mostrarPagina('mayoreo'))
  } else if (path === '/envios') {
    ;(window._initPromise || Promise.resolve()).then(() => mostrarPagina('envios'))
  } else if (path === '/nosotros') {
    ;(window._initPromise || Promise.resolve()).then(() => mostrarPagina('nosotros'))
  } else if (path === '/contacto') {
    ;(window._initPromise || Promise.resolve()).then(() => mostrarPagina('contacto'))
  } else if (path === '/tabla-tallas') {
    ;(window._initPromise || Promise.resolve()).then(() => mostrarPagina('tabla-tallas'))
  } else if (path === '/como-comprar') {
    ;(window._initPromise || Promise.resolve()).then(() => mostrarPagina('como-comprar'))
  } else if (path === '/devoluciones' || path === '/politica-de-devoluciones') {
    ;(window._initPromise || Promise.resolve()).then(() => mostrarPagina('devoluciones'))
  } else if (path === '/privacidad') {
    ;(window._initPromise || Promise.resolve()).then(() => mostrarPagina('privacidad'))
  } else if (path === '/terminos') {
    ;(window._initPromise || Promise.resolve()).then(() => mostrarPagina('terminos'))
  } else if (path === '/eliminacion-datos') {
    ;(window._initPromise || Promise.resolve()).then(() => mostrarPagina('eliminacion-datos'))
  // ── Rutas limpias para categorías ──
  } else if (['/tacones','/sandalias','/botas','/botines','/flats','/plataformas','/tenis','/nina','/accesorios'].includes(path)) {
    const cat = path.slice(1)
    ;(window._initPromise || Promise.resolve()).then(() => filtrarCategoria(cat))
  } else if (path === '/ofertas') {
    ;(window._initPromise || Promise.resolve()).then(() => mostrarOfertas())
  } else if (hash === '#catalogo') {
    (window._initPromise || Promise.resolve()).then(() => mostrarCatalogo())
  } else if (hash === '#nuevos') {
    (window._initPromise || Promise.resolve()).then(() => mostrarNuevos())
  } else if (hash === '#privacidad') {
    (window._initPromise || Promise.resolve()).then(() => mostrarPagina('privacidad'))
  } else if (hash && hash.startsWith('#') && !hash.startsWith('#categoria/')) {
    const pageId = hash.slice(1)
    if (pageId) (window._initPromise || Promise.resolve()).then(() => { if (typeof PAGINAS !== 'undefined' && PAGINAS[pageId]) mostrarPagina(pageId) })
  } else if (hash.startsWith('#categoria/')) {
    const cat = hash.replace('#categoria/', '')
    ;(window._initPromise || Promise.resolve()).then(() => filtrarCategoria(cat))
  } else if (path === '/checkout') {
    const products = decodeURIComponent(params.get('products') || '')
    if (products) {
      setTimeout(() => {
        // Ocultar hero y mostrar solo productos
        const hero = document.getElementById('hero')
        const cats = document.querySelector('.section')
        const bannerMayoreo = document.querySelector('.banner-mayoreo')
        if (hero) hero.style.display = 'none'
        if (cats) cats.style.display = 'none'
        if (bannerMayoreo) bannerMayoreo.style.display = 'none'

        document.getElementById('productos-titulo').innerHTML = 'Completa tu <em>selección</em>'

        const entries = products.split(',')
        const prods = []
        // Parsear variant ID: formato {SKU}-{COLOR_NORM}-{TALLA}
        // talla = último segmento si es numérico; color_norm = penúltimo; sku = el resto
        function _parseVid(vid) {
          const parts = vid.trim().split('-')
          const isNumTalla = /^\d+(\.\d+)?$/.test(parts[parts.length - 1])
          const talla = isNumTalla ? parts[parts.length - 1] : ''
          const colorNorm = isNumTalla ? parts[parts.length - 2] : parts[parts.length - 1]
          const skuParts = isNumTalla ? parts.slice(0, parts.length - 2) : parts.slice(0, parts.length - 1)
          return { sku: skuParts.join('-'), color: colorNorm.replace(/_/g, ' '), talla }
        }
        entries.forEach(entry => {
          const [variantId] = entry.split(':')
          const { sku } = _parseVid(variantId)
          const prod = productos.find(p => p.sku_interno === sku || p.id === sku)
          if (prod && !prods.find(p => p.id === prod.id)) prods.push(prod)
        })

        renderProductos(prods)
        document.getElementById('productos-section').scrollIntoView({behavior:'smooth'})

        // Preseleccionar color y talla al abrir cada modal
        entries.forEach(entry => {
          const [variantId] = entry.split(':')
          const { sku, color, talla } = _parseVid(variantId)
          window['_colorPreselect_' + sku] = color
          if (talla) window['_tallaPreselect_' + sku] = talla
        })
      }, 2000)
    }
  }
})

  // Advanced Matching: datos del comprador (que el pixel encripta solo) para mejorar la coincidencia
  // ID anonimo persistente por navegador — se manda como external_id a Pinterest
  // para que pueda enlazar varios eventos del mismo visitante entre visitas.
  window._zmVisitorId = function() {
    try {
      let id = localStorage.getItem('zm_visitor_id')
      if (!id) {
        id = 'v_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2)
        localStorage.setItem('zm_visitor_id', id)
      }
      return id
    } catch(e) { return '' }
  }
  window._fbAM = function() {
    try {
      const d = JSON.parse(localStorage.getItem('zm_form_datos') || 'null') || {}
      const sub = JSON.parse(localStorage.getItem('zm_subscriber') || 'null') || {}
      const ckEmail = (localStorage.getItem('zm_checkout_email') || '').trim().toLowerCase()
      const am = {}
      const email = d.email || sub.email || ckEmail
      if (email)      am.em = String(email).trim().toLowerCase()
      if (d.telefono) am.ph = String(d.telefono).replace(/\D/g, '')
      const nombre = d.nombre || sub.nombre || ''
      if (nombre)     { const p = String(nombre).trim().split(/\s+/); if (p[0]) am.fn = p[0].toLowerCase(); if (p.length > 1) am.ln = p[p.length-1].toLowerCase() }
      if (d.ciudad)   am.ct = String(d.ciudad).toLowerCase().replace(/\s/g,'')
      if (d.estado)   am.st = String(d.estado).toLowerCase().replace(/\s/g,'')
      if (d.cp)       am.zp = String(d.cp).replace(/\D/g,'')
      return am
    } catch(e) { return {} }
  }

  function _cargarPixelesMarketing(config) {
    if (config.facebook_pixel_id && !window.fbq) {
      const s = document.createElement('script')
      s.textContent = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${config.facebook_pixel_id}', ${JSON.stringify(window._fbAM())});fbq('track','PageView');`
      document.head.appendChild(s)
    }
    if (config.tiktok_pixel_id && !window.ttq) {
      const s = document.createElement('script')
      s.textContent = `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${config.tiktok_pixel_id}');ttq.page();}(window,document,'ttq');`
      document.head.appendChild(s)
    }
    if (!window.pintrk) {
      const s = document.createElement('script')
      const _em = (localStorage.getItem('zm_checkout_email') || '').trim().toLowerCase()
      s.textContent = `!function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var n=window.pintrk;n.queue=[],n.version="3.0";var t=document.createElement("script");t.async=!0,t.src=e;var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");pintrk('load','2612943035007',${_em ? `{em:${JSON.stringify(_em)}}` : '{}'});pintrk('page');`
      document.head.appendChild(s)
    }
  }

  // Dispara el evento Purchase una sola vez, esperando a que los pixeles esten listos
  function _intentarPurchase() {
    const pp = window._pendingPurchase
    if (!pp) return
    if (pp.paymentId && localStorage.getItem('zm_last_purchase') === pp.paymentId) { window._pendingPurchase = null; return }
    const consent = localStorage.getItem('zm_consent') === 'accepted'
    // Si hay consentimiento pero los pixeles aun no cargan, esperar (cargarConfigSEO reintenta)
    if (consent && !window.fbq && !window.ttq) return
    if (pp.paymentId) localStorage.setItem('zm_last_purchase', pp.paymentId)
    if (window.fbq) fbq('track', 'Purchase', { value: pp.valor, currency: 'MXN', content_type: 'product', content_ids: pp.ids })
    if (window.ttq) ttq.track('CompletePayment', { value: pp.valor, currency: 'MXN', contents: (pp.ids||[]).map(id=>({content_id:id})) })
    if (typeof gtag === 'function') gtag('event', 'purchase', { transaction_id: pp.paymentId || String(Date.now()), currency: 'MXN', value: pp.valor })
    try { localStorage.removeItem('fbq_checkout_ids'); localStorage.removeItem('zm_purchase_value') } catch(e){}
    window._pendingPurchase = null
  }

  // Nivel superior (no anidado en cargarConfigSEO) para que también lo pueda
  // usar _zmAplicarOverridesEditables() cuando se re-aplica después de
  // renderCategorias() o en un resize (ver más abajo).
  function _zmCargarGoogleFont(nombre, pesos) {
    if (!nombre) return
    const id = 'zm-font-' + nombre.replace(/\s+/g, '-').toLowerCase()
    if (document.getElementById(id)) return
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(nombre)}:wght@${pesos}&display=swap`
    document.head.appendChild(link)
  }

  async function cargarConfigSEO() {
  try {
    const res = await fetch('https://zapatillasmay-production.up.railway.app/seo/config')
    const data = await res.json()
    const config = {}
    data.forEach(item => config[item.clave] = item.valor || '')

    // Meta tags
    const _esHome = window.location.pathname === '/'  // en las demás rutas el servidor ya manda su propio título/descripción
    if (_esHome && config.meta_titulo_home) document.title = config.meta_titulo_home
    if (_esHome && config.meta_descripcion_home) {
      let meta = document.querySelector('meta[name="description"]')
      if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta) }
      meta.content = config.meta_descripcion_home
    }

    // Google Search Console
    if (config.google_search_console) {
      const meta = document.createElement('meta')
      meta.name = 'google-site-verification'
      meta.content = config.google_search_console
      document.head.appendChild(meta)
    }

    // Google Tag Manager
    if (config.google_tag_manager && !window.__zmInterno) {
      const gtmScript = document.createElement('script')
      gtmScript.textContent = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${config.google_tag_manager}');`
      document.head.appendChild(gtmScript)
    }

    // Google Analytics ya se carga estáticamente en el <head> (G-QX8MK3D4RY)
    // No se vuelve a cargar aquí para evitar duplicar vistas.

    // Guardar config para uso posterior (si el usuario acepta cookies después)
    window._zmSeoConfig = config

    // Facebook Pixel y TikTok — solo si hay consentimiento
    if (localStorage.getItem('zm_consent') === 'accepted') {
      _cargarPixelesMarketing(config)
    } else if (!localStorage.getItem('zm_consent')) {
      // Primera visita — mostrar banner
      setTimeout(() => { const b = document.getElementById('cookie-banner'); if(b) b.style.display = 'flex' }, 800)
    }

    // En la pagina de exito: reintentar Purchase hasta que los pixeles esten listos
    if (window.location.pathname === '/pedido-exitoso' || new URLSearchParams(location.search).get('status') === 'approved') {
      let _ppTries = 0
      const _ppPoll = () => {
        if (window._pendingPurchase) _intentarPurchase()
        if (_ppTries++ < 20 && window._pendingPurchase !== null) setTimeout(_ppPoll, 400)
      }
      setTimeout(_ppPoll, 500)
    }

    // WhatsApp flotante
    if (config.whatsapp_flotante) {
      const waBtn = document.getElementById('whatsapp-flotante')
      if (waBtn) waBtn.href = `https://wa.me/${config.whatsapp_flotante}`
    }
    if (config.hero_imagen) {
  const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const heroWidth = screenWidth < 768 ? 700 : 1400;
  const heroUrl = config.hero_imagen.replace('/image/upload/', `/image/upload/w_${heroWidth},f_auto,q_auto/`)
  const bg = document.getElementById('hero-bg')
  if (bg) bg.style.backgroundImage = `url('${heroUrl}')`
  // Nuevo diseño hero: foto lifestyle en lado izquierdo desktop / fondo móvil
  document.documentElement.style.setProperty('--hero-lifestyle-url', `url('${heroUrl}')`)
}

// Textos del hero editables desde el panel (Portada del sitio) — se usa
// textContent, nunca innerHTML, para que el dueño no pueda meter HTML/scripts
// sin querer al escribir el texto en el panel.
if (config.hero_eyebrow) {
  const el = document.querySelector('.hero-eyebrow')
  if (el) el.textContent = config.hero_eyebrow
}
if (config.hero_titulo_linea1 || config.hero_titulo_destacado) {
  const el = document.querySelector('.hero-title')
  if (el) {
    const linea1 = config.hero_titulo_linea1 || 'Calzado de dama'
    const destacado = config.hero_titulo_destacado || 'León, Gto'
    el.textContent = ''
    const span = document.createElement('span')
    span.setAttribute('data-editable', 'hero_titulo_linea1')
    span.textContent = linea1
    el.appendChild(span)
    el.appendChild(document.createElement('br'))
    el.appendChild(document.createTextNode('desde '))
    const em = document.createElement('em')
    em.setAttribute('data-editable', 'hero_titulo_destacado')
    em.style.cssText = 'color:#a56780;text-shadow:var(--hero-shadow, 0 0 20px rgba(136, 77, 101, 0.6),0 2px 0px rgba(211, 183, 194, 0.8))'
    em.textContent = destacado
    el.appendChild(em)
  }
}
if (config.hero_subtitulo) {
  const el = document.querySelector('.hero-subtitle')
  if (el) el.textContent = config.hero_subtitulo
}
if (config.hero_boton1_texto) {
  const el = document.querySelector('.hero-cta .btn-primary')
  if (el) el.textContent = config.hero_boton1_texto
}
if (config.hero_boton2_texto) {
  const el = document.querySelector('.hero-cta .btn-outline')
  if (el) el.textContent = config.hero_boton2_texto
}
// Mas textos editables (Editor visual) -- mismo patron que el hero: solo
// textContent, nunca innerHTML, y solo si el usuario guardo un valor.
if (config.cats_titulo) {
  const el = document.querySelector('.section-cats-desktop .section-title')
  if (el) el.textContent = config.cats_titulo
}
if (config.testimonios_titulo) {
  const el = document.querySelector('#testimonios-section .section-title')
  if (el) el.textContent = config.testimonios_titulo
}
if (config.popup_titulo) {
  const el = document.querySelector('#zm-email-popup h3[data-editable="popup_titulo"]')
  if (el) el.textContent = config.popup_titulo
}
if (config.popup_subtitulo) {
  const el = document.querySelector('#zm-email-popup p[data-editable="popup_subtitulo"]')
  if (el) el.textContent = config.popup_subtitulo
}
if (config.popup_boton_texto) {
  const el = document.querySelector('#zm-email-popup button[data-editable="popup_boton_texto"]')
  if (el) el.textContent = config.popup_boton_texto
}
if (config.hero_360_badge) {
  const el = document.querySelector('.viewer-360-badge')
  if (el) el.textContent = config.hero_360_badge
}
if (config.hero_offer_texto) {
  const el = document.querySelector('.hero-offer')
  if (el) el.textContent = config.hero_offer_texto
}
// El banner que gira arriba de todo repite cada mensaje 2 veces en el HTML
// (para el efecto de scroll infinito) -- por eso querySelectorAll en vez de
// querySelector, así se actualizan las dos copias de cada mensaje.
;['promo_msg_1', 'promo_msg_2', 'promo_msg_3', 'promo_msg_4', 'promo_msg_5', 'promo_msg_6'].forEach((clave) => {
  if (!config[clave]) return
  document.querySelectorAll(`#promo-banner [data-editable="${clave}"]`).forEach(el => { el.textContent = config[clave] })
})

// Color de marca — un solo color base, las variantes (claro/oscuro/transparencias)
// se derivan aquí para que todo el sitio (botones, acentos, hero) cambie junto.
if (config.color_primario && /^#[0-9a-fA-F]{6}$/.test(config.color_primario)) {
  const hexToRgb = (hex) => ({ r: parseInt(hex.slice(1,3),16), g: parseInt(hex.slice(3,5),16), b: parseInt(hex.slice(5,7),16) })
  const mix = (c, target, amt) => ({
    r: Math.round(c.r + (target.r - c.r) * amt),
    g: Math.round(c.g + (target.g - c.g) * amt),
    b: Math.round(c.b + (target.b - c.b) * amt),
  })
  const toHex = (c) => '#' + [c.r,c.g,c.b].map(v => v.toString(16).padStart(2,'0')).join('')
  const base = hexToRgb(config.color_primario)
  const white = { r:255, g:255, b:255 }, black = { r:0, g:0, b:0 }
  const root = document.documentElement.style
  root.setProperty('--pink', config.color_primario)
  root.setProperty('--pink-soft', toHex(mix(base, white, 0.35)))
  root.setProperty('--pink-dark', toHex(mix(base, black, 0.12)))
  root.setProperty('--pink-light', `rgba(${base.r},${base.g},${base.b},0.09)`)
  root.setProperty('--pink-glow', `rgba(${base.r},${base.g},${base.b},0.28)`)
}

// Paleta ampliada -- fondo y texto principal. OJO: solo cambia lo que ya usa
// las variables --cream/--gray-100/--black/--gray-800 (la mayoria del sitio);
// algunos estilos puntuales tienen su color escrito directo (no via variable)
// y no se ven afectados -- retocar esos casos es trabajo aparte.
if (config.color_fondo && /^#[0-9a-fA-F]{6}$/.test(config.color_fondo)) {
  const hexToRgb2 = (hex) => ({ r: parseInt(hex.slice(1,3),16), g: parseInt(hex.slice(3,5),16), b: parseInt(hex.slice(5,7),16) })
  const mix2 = (c, target, amt) => ({
    r: Math.round(c.r + (target.r - c.r) * amt),
    g: Math.round(c.g + (target.g - c.g) * amt),
    b: Math.round(c.b + (target.b - c.b) * amt),
  })
  const toHex2 = (c) => '#' + [c.r,c.g,c.b].map(v => v.toString(16).padStart(2,'0')).join('')
  const baseF = hexToRgb2(config.color_fondo)
  const root2 = document.documentElement.style
  root2.setProperty('--cream', config.color_fondo)
  root2.setProperty('--gray-100', config.color_fondo)
  const fondoOscuro = toHex2(mix2(baseF, { r:0, g:0, b:0 }, 0.06))
  root2.setProperty('--cream-dark', fondoOscuro)
  root2.setProperty('--gray-200', fondoOscuro)
}
if (config.color_texto && /^#[0-9a-fA-F]{6}$/.test(config.color_texto)) {
  document.documentElement.style.setProperty('--black', config.color_texto)
  document.documentElement.style.setProperty('--gray-800', config.color_texto)
}

// Sombra del título destacado del hero (el nombre de la ciudad, ej. "León, Gto")
if (config.hero_titulo_sombra) {
  const _sombras = {
    ninguna: 'none',
    suave: '0 1px 8px rgba(136,77,101,0.35)',
    actual: '0 0 20px rgba(136,77,101,0.6), 0 2px 0px rgba(211,183,194,0.8)',
    fuerte: '0 0 30px rgba(136,77,101,0.9), 0 3px 3px rgba(211,183,194,1)',
  }
  document.documentElement.style.setProperty('--hero-shadow', _sombras[config.hero_titulo_sombra] || _sombras.actual)
}

// Tipografia — el dueño elige entre una lista corta de Google Fonts (ver
// FUENTES_DISPONIBLES en el panel) para titulos (--font-display) y texto
// (--font-body). Se carga el <link> de Google Fonts solo si hace falta
// (nunca la fuente default, que ya viene precargada en el <head>).
if (config.font_display && config.font_display !== 'Cormorant Garamond') {
  _zmCargarGoogleFont(config.font_display, '300;400;500;600;700')
  document.documentElement.style.setProperty('--font-display', `'${config.font_display}', 'Cormorant Fallback', Georgia, serif`)
}
if (config.font_body && config.font_body !== 'Outfit') {
  _zmCargarGoogleFont(config.font_body, '300;400;500;600;700')
  document.documentElement.style.setProperty('--font-body', `'${config.font_body}', 'Outfit Fallback', Arial, sans-serif`)
}

// Estilo de tarjetas de producto (que tan redondeadas se ven)
if (config.tarjeta_radio) {
  document.documentElement.style.setProperty('--card-radius', config.tarjeta_radio + 'px')
}

// Texto de las categorias (color y tamaño) -- las fotos/iconos por
// categoria se leen directo de config.categorias_estilo en renderCategorias()
if (config.cat_texto_color) {
  document.documentElement.style.setProperty('--cat-name-color', config.cat_texto_color)
}
if (config.cat_texto_tamano) {
  document.documentElement.style.setProperty('--cat-name-size', config.cat_texto_tamano + 'rem')
}

// Color/tamaño/posición personalizados por campo (puestos desde la barra de
// formato o los mangos de mover/redimensionar del Editor visual) -- genérico,
// no hace falta código nuevo por cada campo [data-editable] que se agregue a
// futuro. Ver _zmAplicarOverridesEditables() más abajo (se re-usa también
// después de renderCategorias() y en cada resize, para que la vista móvil
// use su propia posición si se guardó una).
_zmAplicarOverridesEditables()

// Scroll parallax manejado por el bloque 3D al final del body
if (config.favicon_url) {
  let favicon = document.querySelector('link[rel="icon"]')
  if (!favicon) {
    favicon = document.createElement('link')
    favicon.rel = 'icon'
    document.head.appendChild(favicon)
  }
  favicon.href = config.favicon_url
}

  } catch(e) {
    console.log('Config SEO no disponible')
  }
}

// Aplica color/tamaño/fuente/posición guardados a cualquier elemento
// editable ya presente en el DOM. Se llama al cargar la config, otra vez
// después de renderCategorias() (las tarjetas de categoría se crean después,
// vía JS) y en cada resize (para que un elemento con posición guardada solo
// para móvil ("{clave}_transform_movil") se vea bien tanto en el editor
// (cuando el panel cambia el ancho del iframe a "Móvil") como para una
// visitante real que gira su teléfono o cambia de pantalla.
// No pisa un campo que se está arrastrando/editando ahora mismo sin guardar
// (clase "zm-sin-guardar") para no perder la vista previa de un cambio
// pendiente.
function _zmAplicarOverridesEditables() {
  const config = window._zmSeoConfig || {}
  const esMovil = window.matchMedia('(max-width: 768px)').matches
  function transformDe(clave) {
    if (esMovil && config[clave + '_transform_movil']) return config[clave + '_transform_movil']
    return config[clave + '_transform']
  }
  function aplicarTransform(el, clave) {
    const t = transformDe(clave)
    if (!t) return
    const p = t.split(',').map(Number)
    el.style.transform = `translate(${p[0]||0}px, ${p[1]||0}px) scale(${p[2]||1})`
  }
  document.querySelectorAll('[data-editable]').forEach((el) => {
    if (el.classList.contains('zm-sin-guardar')) return
    const clave = el.getAttribute('data-editable')
    if (config[clave + '_color']) el.style.color = config[clave + '_color']
    if (config[clave + '_size']) el.style.fontSize = config[clave + '_size'] + 'em'
    if (config[clave + '_font']) {
      _zmCargarGoogleFont(config[clave + '_font'], '300;400;500;600;700')
      el.style.fontFamily = `'${config[clave + '_font']}'`
    }
    aplicarTransform(el, clave)
  })
  document.querySelectorAll('[data-editable-image], [data-editable-image-multi], [data-editable-move]').forEach((el) => {
    if (el.classList.contains('zm-sin-guardar')) return
    const clave = el.getAttribute('data-editable-image') || el.getAttribute('data-editable-image-multi') || el.getAttribute('data-editable-move')
    aplicarTransform(el, clave)
  })
}
let _zmResizeTimer = null
window.addEventListener('resize', () => {
  clearTimeout(_zmResizeTimer)
  _zmResizeTimer = setTimeout(_zmAplicarOverridesEditables, 200)
})

cargarConfigSEO()

// ── Editor visual (clic-para-editar) del panel ──────────────────────────────
// Se activa SOLO con ?zmEditor=1 en la URL — el panel abre el sitio así
// dentro de un iframe. Nunca se activa para un visitante normal. Los
// elementos marcados con [data-editable="clave"] se vuelven editables con un
// clic, pero SOLO mientras el panel tiene activado "Modo edición" (se manda
// por postMessage desde afuera) -- y los cambios quedan en memoria nada más;
// no se mandan a /seo/config hasta que el panel pide "guardar-cambios"
// explícitamente. Así nada cambia de verdad para un visitante real hasta que
// el dueño le da clic a Guardar.
;(function () {
  if (new URLSearchParams(location.search).get('zmEditor') !== '1') return
  const API_EDIT = 'https://zapatillasmay-production.up.railway.app'

  let modoEdicion = false
  let tokenEditor = ''  // JWT del panel, llega por postMessage (solo del padre, ver listener)
  const cambiosPendientes = {}
  const authEditor = (h) => Object.assign({}, h || {}, tokenEditor ? { Authorization: 'Bearer ' + tokenEditor } : {})

  function avisarPanel(msg) {
    try { if (window.parent) window.parent.postMessage(Object.assign({ origen: 'zm-editor' }, msg), '*') } catch(e) {}
  }

  function marcarPendiente(clave, valor) {
    cambiosPendientes[clave] = valor
    avisarPanel({ tipo: 'pendientes', total: Object.keys(cambiosPendientes).length })
  }

  // ── Barra flotante de formato (color + tamaño) para el texto que se está
  // editando ahora mismo. Los cambios se guardan como claves compañeras
  // ("{clave}_color", "{clave}_size") -- al cargar la página, cargarConfigSEO()
  // ya las aplica de forma genérica a cualquier [data-editable] que las tenga.
  const _ZM_FUENTES = ['Cormorant Garamond', 'Playfair Display', 'Marcellus', 'Cormorant', 'Libre Baskerville', 'Prata', 'DM Serif Display', 'Outfit', 'Poppins', 'Inter', 'Nunito Sans', 'Work Sans', 'Jost', 'Manrope']
  function _zmCargarFontEditor(nombre) {
    if (!nombre) return
    const id = 'zm-font-' + nombre.replace(/\s+/g, '-').toLowerCase()
    if (document.getElementById(id)) return
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(nombre)}:wght@300;400;500;600;700&display=swap`
    document.head.appendChild(link)
  }

  const barra = document.createElement('div')
  barra.id = 'zm-toolbar'
  barra.innerHTML = `
    <label>Color <input type="color" id="zm-tb-color"></label>
    <label>Tamaño
      <select id="zm-tb-size">
        <option value="">Normal</option>
        <option value="0.75">Pequeño</option>
        <option value="1.25">Grande</option>
        <option value="1.6">Muy grande</option>
        <option value="2">Enorme</option>
      </select>
    </label>
    <label>Fuente
      <select id="zm-tb-font">
        <option value="">Normal</option>
        ${_ZM_FUENTES.map(f => `<option value="${f}">${f}</option>`).join('')}
      </select>
    </label>
    <button type="button" id="zm-tb-reset" title="Quitar color, tamaño y fuente personalizados">↺ Restablecer</button>
  `
  document.body.appendChild(barra)
  let elActivo = null

  function posicionarBarra(el) {
    const r = el.getBoundingClientRect()
    barra.style.top = Math.max(8, r.top - 46 + window.scrollY) + 'px'
    barra.style.left = Math.min(Math.max(8, r.left + window.scrollX), window.innerWidth - 260) + 'px'
    barra.style.display = 'flex'
  }

  // Cualquier elemento seleccionable (texto, imagen, o una caja que solo se
  // puede mover/redimensionar) guarda su cambio bajo la clave de su propio
  // atributo -- así "iniciarArrastre" funciona igual sin importar cuál de
  // los tres tipos sea.
  function _zmClaveDe(el) {
    return el.getAttribute('data-editable') || el.getAttribute('data-editable-image') || el.getAttribute('data-editable-image-multi') || el.getAttribute('data-editable-move')
  }

  // Selecciona una caja (imagen o contenedor puro, sin texto que formatear)
  // para poder moverla/redimensionarla -- sin mostrar la barra de color/
  // tamaño/fuente, que solo tiene sentido para texto.
  function seleccionarParaMover(el) {
    elActivo = el
    barra.style.display = 'none'
    posicionarMangos(el)
  }

  function mostrarBarraPara(el) {
    elActivo = el
    const colorInput = document.getElementById('zm-tb-color')
    const sizeSelect = document.getElementById('zm-tb-size')
    const fontSelect = document.getElementById('zm-tb-font')
    const colorActual = el.style.color
    colorInput.value = colorActual && colorActual.startsWith('#') ? colorActual : '#000000'
    sizeSelect.value = el.dataset.zmSizeFactor || ''
    fontSelect.value = el.dataset.zmFont || ''
    posicionarBarra(el)
    posicionarMangos(el)
  }

  // ── Mangos de mover y redimensionar (arrastrar tipo Photoshop) ──────────
  // Un solo transform combinado (translate + scale) por campo, guardado como
  // "{clave}_transform" = "x,y,escala". No afecta el flujo del documento
  // (por eso mover un botón puede encimarlo con su vecino -- es el mismo
  // trade-off que cualquier herramienta de "mover libremente").
  const mangoMover = document.createElement('div')
  mangoMover.id = 'zm-handle-move'
  mangoMover.title = 'Arrastrar para mover'
  mangoMover.textContent = '✥'
  document.body.appendChild(mangoMover)

  const mangoResize = document.createElement('div')
  mangoResize.id = 'zm-handle-resize'
  mangoResize.title = 'Arrastrar para cambiar el tamaño'
  document.body.appendChild(mangoResize)

  function leerTransform(el) {
    const t = el.dataset.zmTransform
    if (!t) return { x: 0, y: 0, s: 1 }
    const p = t.split(',').map(Number)
    return { x: p[0] || 0, y: p[1] || 0, s: p[2] || 1 }
  }
  function aplicarTransform(el, t) {
    el.style.transform = `translate(${t.x}px, ${t.y}px) scale(${t.s})`
    el.dataset.zmTransform = `${t.x},${t.y},${t.s}`
  }
  function posicionarMangos(el) {
    const r = el.getBoundingClientRect()
    mangoMover.style.top = (r.top + window.scrollY - 12) + 'px'
    mangoMover.style.left = (r.left + window.scrollX - 12) + 'px'
    mangoMover.style.display = 'flex'
    mangoResize.style.top = (r.bottom + window.scrollY - 8) + 'px'
    mangoResize.style.left = (r.right + window.scrollX - 8) + 'px'
    mangoResize.style.display = 'block'
  }
  function ocultarMangos() {
    mangoMover.style.display = 'none'
    mangoResize.style.display = 'none'
  }
  function iniciarArrastre(handle, tipo) {
    handle.addEventListener('pointerdown', (ev) => {
      if (!elActivo) return
      ev.preventDefault()
      ev.stopPropagation()
      const el = elActivo
      const clave = _zmClaveDe(el)
      const t0 = leerTransform(el)
      const startX = ev.clientX, startY = ev.clientY
      const anchoInicial = el.getBoundingClientRect().width
      try { handle.setPointerCapture(ev.pointerId) } catch(e) {}

      function mover(ev2) {
        const dx = ev2.clientX - startX
        const dy = ev2.clientY - startY
        let nuevo
        if (tipo === 'mover') {
          nuevo = { x: t0.x + dx, y: t0.y + dy, s: t0.s }
        } else {
          const factor = Math.max(0.4, Math.min(3, 1 + dx / Math.max(40, anchoInicial)))
          nuevo = { x: t0.x, y: t0.y, s: Math.round(factor * 100) / 100 }
        }
        aplicarTransform(el, nuevo)
        posicionarMangos(el)
        posicionarBarra(el)
      }
      function soltar() {
        window.removeEventListener('pointermove', mover)
        window.removeEventListener('pointerup', soltar)
        // Si el panel tiene el iframe angosto (vista "Móvil"), la posición
        // se guarda aparte -- así no se pisa la posición de escritorio y
        // una visitante real ve la que le toca según su pantalla (ver
        // _zmAplicarOverridesEditables()).
        const sufijo = window.matchMedia('(max-width: 768px)').matches ? '_transform_movil' : '_transform'
        marcarPendiente(clave + sufijo, el.dataset.zmTransform)
        el.classList.add('zm-sin-guardar')
      }
      window.addEventListener('pointermove', mover)
      window.addEventListener('pointerup', soltar)
    })
  }
  iniciarArrastre(mangoMover, 'mover')
  iniciarArrastre(mangoResize, 'resize')

  function ocultarBarra() {
    barra.style.display = 'none'
    elActivo = null
    ocultarMangos()
  }

  document.getElementById('zm-tb-color').addEventListener('input', function() {
    if (!elActivo) return
    const clave = elActivo.getAttribute('data-editable')
    elActivo.style.color = this.value
    marcarPendiente(clave + '_color', this.value)
    elActivo.classList.add('zm-sin-guardar')
  })
  document.getElementById('zm-tb-size').addEventListener('change', function() {
    if (!elActivo) return
    const clave = elActivo.getAttribute('data-editable')
    if (this.value) {
      elActivo.style.fontSize = this.value + 'em'
      elActivo.dataset.zmSizeFactor = this.value
      marcarPendiente(clave + '_size', this.value)
    } else {
      elActivo.style.fontSize = ''
      delete elActivo.dataset.zmSizeFactor
      marcarPendiente(clave + '_size', '')
    }
    elActivo.classList.add('zm-sin-guardar')
  })
  document.getElementById('zm-tb-font').addEventListener('change', function() {
    if (!elActivo) return
    const clave = elActivo.getAttribute('data-editable')
    if (this.value) {
      _zmCargarFontEditor(this.value)
      elActivo.style.fontFamily = `'${this.value}'`
      elActivo.dataset.zmFont = this.value
      marcarPendiente(clave + '_font', this.value)
    } else {
      elActivo.style.fontFamily = ''
      delete elActivo.dataset.zmFont
      marcarPendiente(clave + '_font', '')
    }
    elActivo.classList.add('zm-sin-guardar')
  })
  document.getElementById('zm-tb-reset').addEventListener('click', function() {
    if (!elActivo) return
    const clave = elActivo.getAttribute('data-editable')
    elActivo.style.color = ''
    elActivo.style.fontSize = ''
    elActivo.style.fontFamily = ''
    elActivo.style.transform = ''
    delete elActivo.dataset.zmSizeFactor
    delete elActivo.dataset.zmFont
    delete elActivo.dataset.zmTransform
    document.getElementById('zm-tb-color').value = '#000000'
    document.getElementById('zm-tb-size').value = ''
    document.getElementById('zm-tb-font').value = ''
    marcarPendiente(clave + '_color', '')
    marcarPendiente(clave + '_size', '')
    marcarPendiente(clave + '_font', '')
    marcarPendiente(clave + '_transform', '')
    marcarPendiente(clave + '_transform_movil', '')
    elActivo.classList.add('zm-sin-guardar')
    posicionarMangos(elActivo)
  })

  document.addEventListener('click', (ev) => {
    if (!modoEdicion) return
    const el = ev.target.closest('[data-editable]')
    if (el) {
      ev.preventDefault()
      ev.stopPropagation()
      if (el.isContentEditable) return
      if (el.dataset.zmPrev === undefined) el.dataset.zmPrev = el.textContent
      el.setAttribute('contenteditable', 'true')
      el.classList.add('zm-editing')
      mostrarBarraPara(el)
      // Un tick de más: en algunos navegadores el foco no agarra si se pide
      // en el mismo ciclo en que se acaba de activar contenteditable.
      requestAnimationFrame(() => {
        el.focus()
        const rango = document.createRange()
        rango.selectNodeContents(el)
        const sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(rango)
      })
      return
    }
    // Imágenes editables: foto del hero (1 archivo), visor 360 (varias) y
    // fotos de categoría. El botón que se clickea (ej. los botones dedicados
    // del hero) puede no ser el elemento visual real -- por eso también se
    // selecciona el real para poder moverlo/redimensionarlo con los mismos
    // mangos, además de abrir el selector de archivo para cambiar la foto.
    const elImg = ev.target.closest('[data-editable-image], [data-editable-image-multi]')
    if (elImg) {
      ev.preventDefault()
      ev.stopPropagation()
      const multi = elImg.hasAttribute('data-editable-image-multi')
      const clave = elImg.getAttribute(multi ? 'data-editable-image-multi' : 'data-editable-image')
      // El botón que se clickeó puede ser un disparador dedicado (hero,
      // categorías) en vez del elemento visual real -- se busca la imagen
      // real que comparte la misma clave para mover/redimensionar esa,
      // no el botón. Genérico: sirve para cualquier campo nuevo sin tocar
      // este código, salvo hero/360 que no son <img> con ese atributo.
      const realTarget = clave === 'hero_imagen' ? document.getElementById('hero-bg')
                        : clave === 'hero_360_frames' ? document.getElementById('hero-shoe-img')
                        : document.querySelector(`img[data-editable-image="${clave}"]`) || elImg
      if (realTarget) seleccionarParaMover(realTarget)
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      if (multi) input.multiple = true
      input.onchange = () => _zmSubirImagenes(clave, elImg, Array.from(input.files || []), multi)
      input.click()
      return
    }
    // Cajas/contenedores que no tienen texto ni foto propia (ej. la tarjeta
    // completa de una categoría) -- solo se pueden mover/redimensionar.
    const elMove = ev.target.closest('[data-editable-move]')
    if (elMove) {
      ev.preventDefault()
      ev.stopPropagation()
      seleccionarParaMover(elMove)
      return
    }
    if (!ev.target.closest('#zm-toolbar') && !ev.target.closest('#zm-handle-move') && !ev.target.closest('#zm-handle-resize')) ocultarBarra()
  }, true)

  async function _zmSubirImagenes(clave, el, files, multi) {
    if (!files.length) return
    avisarPanel({ tipo: 'guardando' })
    try {
      const urls = []
      for (const file of files) {
        const formData = new FormData()
        formData.append('archivo', file)
        formData.append('carpeta', multi ? 'hero360' : 'hero')
        const res = await fetch(`${API_EDIT}/imagenes/subir`, { method: 'POST', headers: authEditor(), body: formData })
        const data = await res.json()
        if (data.url) urls.push(data.url)
      }
      if (!urls.length) { avisarPanel({ tipo: 'error' }); return }
      // El botón que se clickeó (el) es solo el disparador -- el elemento
      // visual real a actualizar puede ser otro (fondo del hero, o el
      // visor 360 completo, que además necesita reiniciar su rotación).
      if (multi) {
        marcarPendiente(clave, JSON.stringify(urls))
        if (typeof window._zm360SetFrames === 'function') window._zm360SetFrames(urls)
        const imgVisor = document.getElementById('hero-shoe-img')
        if (imgVisor) imgVisor.src = urls[0]
      } else if (clave === 'hero_imagen') {
        marcarPendiente(clave, urls[0])
        const bg = document.getElementById('hero-bg')
        if (bg) bg.style.backgroundImage = `url('${urls[0]}')`
      } else {
        marcarPendiente(clave, urls[0])
        if (el.tagName === 'IMG') el.src = urls[0]
        else el.style.backgroundImage = `url('${urls[0]}')`
      }
      el.classList.add('zm-sin-guardar')
      avisarPanel({ tipo: 'pendientes', total: Object.keys(cambiosPendientes).length })
    } catch (e) {
      avisarPanel({ tipo: 'error' })
    }
  }

  document.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Escape') return
    const el = ev.target.closest && ev.target.closest('[data-editable]')
    if (!el || !el.isContentEditable) return
    el.textContent = el.dataset.zmPrev
    el.blur()
  })

  document.addEventListener('focusout', (ev) => {
    const el = ev.target
    if (!el.hasAttribute || !el.hasAttribute('data-editable') || !el.isContentEditable) return
    el.removeAttribute('contenteditable')
    el.classList.remove('zm-editing')
    if (!ev.relatedTarget || !ev.relatedTarget.closest || !ev.relatedTarget.closest('#zm-toolbar')) ocultarBarra()
    const clave = el.getAttribute('data-editable')
    let valor = el.textContent.trim()
    const original = el.dataset.zmPrev
    if (!valor) { valor = original; el.textContent = valor }
    if (valor === original) {
      // Volvió al valor original -- ya no cuenta como pendiente (el texto,
      // no necesariamente color/tamaño si ya se tocaron aparte).
      delete cambiosPendientes[clave]
    } else {
      cambiosPendientes[clave] = valor
      el.classList.add('zm-sin-guardar')
    }
    // Si la misma clave se repite en más de un elemento (ej. el banner que
    // gira arriba, duplicado para el efecto de scroll infinito), se refleja
    // ahí también -- si no, la copia duplicada se quedaría con el texto
    // viejo hasta recargar la página.
    document.querySelectorAll(`[data-editable="${clave}"]`).forEach(sib => { if (sib !== el) sib.textContent = valor })
    avisarPanel({ tipo: 'pendientes', total: Object.keys(cambiosPendientes).length })
  })

  window.addEventListener('message', (ev) => {
    if (!ev.data || ev.data.origen !== 'zm-panel') return
    if (ev.source !== window.parent) return
    if (typeof ev.data.token === 'string') tokenEditor = ev.data.token
    if (ev.data.tipo === 'activar-edicion') {
      modoEdicion = true
      document.documentElement.classList.add('zm-modo-edicion')
    } else if (ev.data.tipo === 'desactivar-edicion') {
      modoEdicion = false
      document.documentElement.classList.remove('zm-modo-edicion')
      ocultarBarra()
    } else if (ev.data.tipo === 'guardar-cambios') {
      const claves = Object.keys(cambiosPendientes)
      if (!claves.length) { avisarPanel({ tipo: 'guardado' }); return }
      avisarPanel({ tipo: 'guardando' })
      fetch(`${API_EDIT}/seo/config`, {
        method: 'POST',
        headers: authEditor({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(cambiosPendientes)
      })
        .then(r => {
          if (!r.ok) throw new Error('HTTP ' + r.status)
          claves.forEach(clave => {
            delete cambiosPendientes[clave]
            const claveBase = clave.replace(/_(color|size|font|transform|transform_movil)$/, '')
            document.querySelectorAll(`[data-editable="${claveBase}"], [data-editable-image="${claveBase}"], [data-editable-image-multi="${claveBase}"], [data-editable-move="${claveBase}"]`).forEach(el => {
              if (el.hasAttribute('data-editable')) el.dataset.zmPrev = el.textContent
              el.classList.remove('zm-sin-guardar')
            })
          })
          avisarPanel({ tipo: 'guardado' })
        })
        .catch(() => avisarPanel({ tipo: 'error' }))
    }
  })

  const estilos = document.createElement('style')
  estilos.textContent = `
    html.zm-modo-edicion [data-editable] { outline: 2px dashed transparent; outline-offset: 3px; cursor: text; transition: outline-color .15s, background-color .15s; border-radius: 4px; }
    html.zm-modo-edicion [data-editable]:hover { outline-color: rgba(233,30,140,0.55); background: rgba(233,30,140,0.08); }
    [data-editable].zm-editing { outline: 2px solid #E91E8C !important; background: rgba(233,30,140,0.1) !important; }
    [data-editable].zm-sin-guardar:not(.zm-editing) { outline: 2px dashed #f59e0b !important; background: rgba(245,158,11,0.08) !important; }
    html.zm-modo-edicion [data-editable-image], html.zm-modo-edicion [data-editable-image-multi] { outline: 2px dashed transparent; cursor: pointer; transition: outline-color .15s; }
    html.zm-modo-edicion [data-editable-image]:hover, html.zm-modo-edicion [data-editable-image-multi]:hover { outline-color: rgba(233,30,140,0.7); }
    html.zm-modo-edicion [data-editable-move] { outline: 2px dashed transparent; cursor: move; transition: outline-color .15s; }
    html.zm-modo-edicion [data-editable-move]:hover { outline-color: rgba(59,130,246,0.7); }
    /* Slots vacíos del banner que gira (mensajes 5 y 6, opcionales) -- se
       ocultan para una visitante real, pero en modo edición se ven con un
       texto guía para poder agregar un mensaje nuevo ahí. */
    html.zm-modo-edicion #promo-banner span[data-editable]:empty { display: inline-block !important; }
    html.zm-modo-edicion #promo-banner span[data-editable]:empty::before { content: '+ Agregar mensaje'; opacity: .6; font-style: italic; }
    html.zm-modo-edicion .zm-btn-cambiar-foto { display: inline-flex !important; align-items: center; gap: 6px; background: #E91E8C; color: #fff; border: none; padding: 8px 14px; border-radius: 100px; font: 600 12.5px/1 -apple-system,sans-serif; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.3); }
    html.zm-modo-edicion .zm-btn-cambiar-foto:hover { background: #c9187a; }
    /* En móvil el banner+header+buscador fijos ocupan ~144px arriba y tapan
       estos botones si se quedan en su top original (pensado para desktop,
       donde no hay ese stack encima del hero). */
    @media (max-width: 768px) {
      html.zm-modo-edicion #zm-btn-cambiar-hero { top: 150px !important; font-size: 11.5px; padding: 7px 12px; }
      html.zm-modo-edicion #zm-btn-cambiar-360 { top: 192px !important; font-size: 11.5px; padding: 7px 12px; }
    }
    #zm-toolbar { display:none; position:fixed; z-index:99999; background:#1f2937; color:#fff; padding:8px 10px; border-radius:10px; gap:12px; align-items:center; font:13px/1.2 -apple-system,sans-serif; box-shadow:0 8px 24px rgba(0,0,0,0.35); }
    #zm-toolbar label { display:flex; align-items:center; gap:5px; white-space:nowrap; }
    #zm-toolbar select, #zm-toolbar button { font:inherit; border-radius:6px; border:1px solid #4b5563; background:#374151; color:#fff; padding:3px 6px; cursor:pointer; }
    #zm-toolbar input[type=color] { width:26px; height:26px; border:none; padding:0; background:none; cursor:pointer; }
    #zm-handle-move, #zm-handle-resize { display:none; position:fixed; z-index:99998; background:#E91E8C; border:2px solid #fff; box-shadow:0 2px 8px rgba(0,0,0,0.4); touch-action:none; }
    #zm-handle-move { width:24px; height:24px; border-radius:50%; align-items:center; justify-content:center; color:#fff; font-size:13px; cursor:move; }
    #zm-handle-resize { width:16px; height:16px; border-radius:4px; cursor:nwse-resize; }
  `
  document.head.appendChild(estilos)
  avisarPanel({ tipo: 'listo' })
})()

  // ── Caché local de productos (TTL: 5 minutos) ──────────────────────────────
  const CACHE_KEY = 'zm_catalog_v2'
  const CACHE_TTL = 10 * 60 * 1000 // 10 minutos en ms

  function _cacheSave(data, version) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), v: version, data }))
    } catch(e) {}
  }

  function _cacheLoad(serverVersion) {
    try {
      const raw = localStorage.getItem(CACHE_KEY)
      if (!raw) return null
      const { ts, v, data } = JSON.parse(raw)
      // Invalidar si el servidor tiene versión más nueva
      if (serverVersion && v && serverVersion > v) { localStorage.removeItem(CACHE_KEY); return null }
      if (Date.now() - ts > CACHE_TTL) { localStorage.removeItem(CACHE_KEY); return null }
      return data
    } catch(e) { return null }
  }

  window.zmRefreshCatalog = () => { localStorage.removeItem(CACHE_KEY); location.reload() }

  async function inicializar() {
    try {
      // Verificar versión del catálogo en el servidor
      let serverVersion = 0
      try {
        const vRes = await fetch(API + '/productos/catalog-version')
        const vData = await vRes.json()
        serverVersion = vData.v || 0
      } catch(e) {}

      // Intentar cargar desde caché (invalidando si hay versión nueva)
      const cached = _cacheLoad(serverVersion)
      if (cached) {
        productos = cached.productos
        variantes = cached.variantes
        inventario = cached.inventario
        // El stock cambia con cada venta y la versión del catálogo no: con la caché de 10 min se veían pares ya vendidos
        // como disponibles. El inventario es liviano (~90 KB comprimido), así que se pide siempre fresco.
        try {
          const rInvFresco = await fetch(API + '/inventario/slim')
          if (rInvFresco.ok) {
            const invFresco = await rInvFresco.json()
            if (Array.isArray(invFresco)) { inventario = invFresco; _cacheSave({ productos, variantes, inventario }, serverVersion) }
          }
        } catch(e) {}
      } else {
        const [resP, resV, resI] = await Promise.all([
          fetch(API + '/productos/'),
          fetch(API + '/variantes/?activa=eq.true'),
          fetch(API + '/inventario/slim')   // solo variante_id + cantidad (~50KB vs 3MB)
        ])
        productos = await resP.json()
        variantes = await resV.json()
        inventario = await resI.json()
        _cacheSave({ productos, variantes, inventario }, serverVersion)
      }
      // Estrellas de reseñas aprobadas por producto (si falla, las tarjetas simplemente no muestran estrellas)
      try { window._resenasResumen = await (await fetch(API + '/resenas/resumen')).json() } catch (e) { window._resenasResumen = {} }
      // inventario/slim solo tiene variante_id + cantidad, sin datos anidados
      // Ocultar del catálogo los modelos totalmente agotados (todas sus variantes en 0):
      // se seguían mostrando en listados/categorías/búsqueda aunque nadie pudiera comprarlos.
      // Un producto SIN variantes no se toca (no hay forma de saber su stock desde aquí).
      {
        const _invStockMap = {}
        inventario.forEach(i => { _invStockMap[i.variante_id] = (_invStockMap[i.variante_id] || 0) + (i.cantidad || 0) })
        const _idsConVariantes = new Set()
        const _idsConStock = new Set()
        variantes.forEach(v => {
          if (v.activa === false) return
          _idsConVariantes.add(v.producto_id)
          if ((_invStockMap[v.id] || 0) > 0) _idsConStock.add(v.producto_id)
        })
        productos = productos.filter(p => !_idsConVariantes.has(p.id) || _idsConStock.has(p.id))
      }
      // Ocultar del sitio los modelos de uso interno (lotes "OFERTA250", "OFERTA200", etc. --
      // existen en el ERP para otros canales pero no deben verse ni comprarse desde la tienda).
      productos = productos.filter(p => !/^oferta/i.test(p.nombre || '') && !/^oferta/i.test(p.sku_interno || ''))
      // Sin foto principal no se lista (la mayoría de los "Nuevos" eran modelos recién capturados sin foto y se veían rotos)
      // (si el modelo no tiene portada pero alguna variante sí tiene foto, esa se usa como portada)
      productos.forEach(p => {
        if ((p.imagen_principal || '').trim()) return
        const vf = variantes.find(v => v.producto_id === p.id && (v.foto_url || '').trim())
        if (vf) p.imagen_principal = vf.foto_url
      })
      productos = productos.filter(p => (p.imagen_principal || '').trim())
      // Marketplace: productos de otras tiendas, con «Vendido por X». precio_menudeo = precio − 80 porque el sitio suma $80 al mostrar.
      try {
        const _ctl = new AbortController(); const _to = setTimeout(() => _ctl.abort(), 2500)
        const _rm = await fetch(API + '/marketplace/productos?limite=200', { signal: _ctl.signal }); clearTimeout(_to)
        const _lm = _rm.ok ? await _rm.json() : []
        if (Array.isArray(_lm)) _lm.forEach(m => productos.push({
          id: 'mp-' + m.id, _mp: true, slug: m.slug, nombre: m.nombre, categoria: m.categoria || 'tacones', imagen_principal: m.imagen, sku_interno: '',
          precio_menudeo: Number(m.precio) - 80, es_oferta: false, activo: true, descripcion: '', marca: '', material: '', tallas_disponibles: m.tallas || [],
          _precioMp: Number(m.precio), _precioMp3: Number(m.precio_mayoreo3 || m.precio), _vendedorMp: m.vendedor
        }))
      } catch (e) { /* sin marketplace: el sitio funciona igual */ }
      _construirIndicesFiltro()
      renderCategorias()

      // Routing directo: restaurar la vista según la URL actual
      const _hash = window.location.hash
      const _path = window.location.pathname
      const _CATS_VALIDAS = ['tacones','sandalias','botas','botines','flats','plataformas','tenis','nina','accesorios']
      const _catLimpia = _path.slice(1)
      if (_path === '/catalogo' || _hash === '#catalogo') {
        mostrarCatalogo()
      } else if (_hash === '#nuevos') {
        mostrarNuevos()
      } else if (_CATS_VALIDAS.includes(_catLimpia)) {
        filtrarCategoria(_catLimpia)
      } else if (_path === '/ofertas') {
        mostrarOfertas()
      } else if (_hash.startsWith('#categoria/')) {
        filtrarCategoria(_hash.replace('#categoria/', ''))
      } else if (_path === '/tabla-tallas') {
        mostrarPagina('tabla-tallas')
      } else if (_hash && _hash.startsWith('#')) {
        const _pid = _hash.slice(1)
        if (_pid && typeof PAGINAS !== 'undefined' && PAGINAS[_pid]) mostrarPagina(_pid)
        else renderProductos(productos.filter(p => p.activo))
      } else {
        document.getElementById('productos-titulo').innerHTML = _tituloHome()
        renderProductos(productos.filter(p => p.activo))
      }
      // Al recargar una vista de lista (catálogo, categoría, ofertas...) el navegador restauraba el scroll de antes y el título de la lista
      // quedaba escondido detrás del buscador fijo. Se vuelve arriba, salvo que la persona ya haya empezado a moverse sola.
      if (_path !== '/' || _hash) {
        let _movio = false
        ;['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(ev => window.addEventListener(ev, () => { _movio = true }, { once: true, passive: true }))
        ;[0, 200, 600, 1400].forEach(ms => setTimeout(() => { if (!_movio && window.scrollY > 0) window.scrollTo(0, 0) }, ms))
      }
    } catch(e) {
      console.error('Error cargando datos:', e)
    }
  }

  function renderCategorias() {
  const cats = [...new Set(productos.map(p => p.categoria).filter(Boolean))]
  const grid = document.getElementById('cats-grid')
  if (!cats.length) { grid.innerHTML = '<p style="color:#aaa">No hay categorias</p>'; return }
  const IMG_CATS = {
    tacones:     'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80',
    sandalias:   'https://images.unsplash.com/photo-1630407332126-70ebb700976b?w=400&q=80',
    botas:       'https://images.unsplash.com/photo-1763661300203-aa3e2702f510?w=400&q=80',
    botines:     'https://images.unsplash.com/photo-1571489555750-c932b569ef5d?w=400&q=80',
    flats:       'https://images.unsplash.com/photo-1758542988664-49951c5b1999?w=400&q=80',
    plataformas: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=400&q=80',
    tenis:       'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80',
    nina:        'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&q=80',
    accesorios:  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80'
  }
  // Overrides desde el panel (SEO y Sitio -> Categorías): foto e icono por
  // categoría, guardados como JSON en configuracion_seo bajo "categorias_estilo".
  // También se puede editar cada tarjeta directo desde el Editor visual
  // (clic en la imagen/ícono/texto, o arrastrar la tarjeta completa) --
  // esos cambios quedan en claves sueltas "cat_{categoria}_..." que
  // _zmAplicarOverridesEditables() aplica genéricamente (color/tamaño/
  // fuente/posición) justo después de armar el HTML de abajo.
  let _catOverrides = {}
  try { _catOverrides = JSON.parse((window._zmSeoConfig && window._zmSeoConfig.categorias_estilo) || '{}') || {} } catch(e) {}
  const _cfgCat = window._zmSeoConfig || {}
  grid.innerHTML = cats.map(c => {
    const ov = _catOverrides[c] || {}
    // Foto de la categoría: la que se eligió en el panel; si no, un modelo REAL del catálogo (antes eran fotos de stock ajenas a la tienda)
    const _repr = (productos || []).find(p => p.activo && (p.categoria || '').toLowerCase() === c && (p.foto_limpia || p.imagen_principal))
    const imagen = ov.imagen || (_repr ? zmImg(_repr.foto_limpia || _repr.imagen_principal, 500) : '') || IMG_CATS[c] || ''
    const icono = _cfgCat['cat_' + c + '_icono'] || ov.icono || ICONOS_CATS[c] || '👠'
    const nombre = _cfgCat['cat_' + c + '_texto'] || (c.charAt(0).toUpperCase() + c.slice(1))
    return `
    <div class="cat-wrap" role="button" tabindex="0" onclick="filtrarCategoria('${c}')" onkeydown="if(event.key==='Enter'||event.key===' ') filtrarCategoria('${c}')">
      <div class="cat-card" data-editable-move="cat_${c}_caja">
        <img src="${imagen}" loading="lazy" decoding="async" data-editable-image="cat_${c}_imagen" alt="${c}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 0.5s">
        <div style="position:absolute;inset:0;background:linear-gradient(to top, rgba(90,30,45,0.75) 0%, rgba(180,100,100,0.15) 60%, transparent 100%)"></div>
        <button type="button" class="zm-btn-cambiar-foto zm-btn-cat-foto" data-editable-image="cat_${c}_imagen" title="Cambiar foto de ${c}" style="display:none;position:absolute;top:6px;right:6px;z-index:10;width:26px;height:26px;padding:0;border-radius:50%;font-size:12px;justify-content:center">📷</button>
        <div style="position:absolute;bottom:16px;left:16px;right:16px">
          <span data-editable="cat_${c}_icono" style="font-size:1.4rem;display:block;margin-bottom:4px">${icono}</span>
          <div class="cat-name" data-editable="cat_${c}_texto">${nombre}</div>
        </div>
      </div>
    </div>
  `}).join('')
  if (typeof _zmAplicarOverridesEditables === 'function') _zmAplicarOverridesEditables()
}

  // ── Scroll infinito ──────────────────────────────────────────────────────────
  const _BATCH = 20
  let _listaActual = []
  let _mostrados = 0
  let _scrollObs = null

  // Producto de OTRA tienda (marketplace): se ve como los demás pero enlaza a su propia página, con «Vendido por X»
  function _cardHTMLMarketplace(p) {
    const esc = (v) => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    return `
      <a class="product-card fade-in" href="/marketplace/${encodeURIComponent(p.slug)}">
        <div class="product-img-wrap">
          <img src="${zmImg(p.imagen_principal, 600)}" alt="${esc(p.nombre)} — Zapatillas May Marketplace" width="600" height="800" loading="lazy">
          <span class="product-badge badge-new" style="background:#2A1A0E;color:#fff">Marketplace</span>
          <div class="product-actions"><span class="btn-add-cart">Ver producto</span></div>
        </div>
        <p class="product-name">${esc(p.nombre)}</p>
        <div class="product-prices">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap"><span class="price-main">$${Number(p._precioMp).toLocaleString('es-MX')} MXN</span></div>
          ${p._precioMp3 < p._precioMp ? `<div class="price-mayoreo-hint" style="margin-top:2px">🛍️ 3+ pares: <strong>$${p._precioMp3.toLocaleString('es-MX')}</strong> c/u</div>` : ''}
          <div class="price-mayoreo-hint" style="margin-top:2px">Vendido por <strong>${esc(p._vendedorMp)}</strong></div>
        </div>
      </a>`
  }

  function _cardHTML(p) {
    if (p._mp) return _cardHTMLMarketplace(p)
    const varsProd = variantes.filter(v => v.producto_id === p.id)
    const colores = [...new Set(varsProd.map(v => v.color).filter(Boolean))]

    // Stock bajo (urgencia)
    const _stockTotal = varsProd.reduce((sum, v) => {
      const inv = inventario.find(i => i.variante_id === v.id)
      return sum + (inv ? (inv.cantidad || 0) : 0)
    }, 0)
    const _stockBajo = _stockTotal > 0 && _stockTotal <= 5

    // Precio mayoreo + ahorro
    // precio_menudeo en BD es el precio base; display menudeo = base+80
    // mayoreo 3+ = base (sin el +80), salvo que precio_mayoreo3 esté explícito
    const _precioMenu = p.precio_menudeo ? (p.es_oferta ? parseFloat(p.precio_menudeo) : parseFloat(p.precio_menudeo) + 80) : null
    // Descuento de 3+ pares: se queda visible en la tarjeta (el de 6+ ya solo
    // vive en panel/portal, aquí no se muestra).
    const _precioMay3 = (_precioMenu && !p.es_oferta) ? _precioMenu - 60 : null

    // Fotos para ir rotando sola en la tarjeta (ver observador más abajo):
    // primero los ángulos extra del color de portada, luego una foto de
    // cada OTRO color distinto -- así se ve variedad real (no solo ángulos
    // del mismo color) cuando el modelo viene en varios colores.
    const _vPortada = varsProd.find(v => (v.foto_url || '') === p.imagen_principal) || varsProd[0]
    let _fotosRot = []
    if (_vPortada && Array.isArray(_vPortada.imagenes) && _vPortada.imagenes.length) {
      _fotosRot.push(_vPortada.foto_url, ..._vPortada.imagenes)
    }
    const _coloresVistos = new Set(_vPortada && _vPortada.color ? [_vPortada.color] : [])
    varsProd.forEach(v => {
      if (v.color && v.foto_url && !_coloresVistos.has(v.color) && (!p._novCols || p._novCols.includes(String(v.color).trim()))) {
        _coloresVistos.add(v.color)
        _fotosRot.push(v.foto_url)
      }
    })
    _fotosRot = [...new Set([p.foto_limpia || p.imagen_principal, ..._fotosRot].filter(Boolean))].slice(0, 6)
    const _fotosAttr = _fotosRot.length > 1 ? ` data-fotos="${encodeURIComponent(JSON.stringify(_fotosRot))}"` : ''

    const _rs = (window._resenasResumen || {})[p.id]
    const _estrellasHTML = (_rs && _rs.n)
      ? `<div class="product-rating" style="display:flex;align-items:center;gap:4px;margin:2px 0 4px;font-size:0.74rem;color:#8B6A54"><span style="color:#f59e0b;letter-spacing:1px">${'★'.repeat(Math.round(_rs.p))}${'☆'.repeat(5 - Math.round(_rs.p))}</span><span>${_rs.p} (${_rs.n})</span></div>`
      : ''
    return `
      <a class="product-card fade-in" href="/producto/${p.slug||p.sku_interno||p.id}${p._novQuery || _queryFiltros()}">
        <div class="product-img-wrap"${_fotosAttr}>
          ${(p.foto_limpia || p.imagen_principal)
            ? `<img src="${zmImg((p.foto_limpia || p.imagen_principal), 600)}" srcset="${zmImg((p.foto_limpia || p.imagen_principal), 300)} 300w, ${zmImg((p.foto_limpia || p.imagen_principal), 400)} 400w, ${zmImg((p.foto_limpia || p.imagen_principal), 500)} 500w, ${zmImg((p.foto_limpia || p.imagen_principal), 600)} 600w" sizes="(max-width: 599px) 50vw, 300px" alt="${(p.nombre && p.nombre.split(' ').length > 2) ? `${p.nombre.trim()} — Zapatillas May` : `${p.nombre || 'Calzado'} ${p.categoria || ''} de moda — Zapatillas May`.replace(/\s+/g, ' ').trim()}" width="600" height="800" loading="lazy" style="transition:opacity .18s">`
            : `<div class="product-placeholder">👠</div>`}
          ${etiquetaNovedad(p)}
          ${p.es_oferta ? '<span class="product-badge badge-sale">Oferta</span>' : ''}
          ${_stockBajo ? `<span class="badge-stock">¡Últimos ${_stockTotal} pares!</span>` : ''}
        </div>
        <div class="product-colors">
          ${colores.slice(0,5).map(c => {
            const v = varsProd.find(v => v.color === c)
            return `<div class="color-dot" style="background:${v?v.color_hex:'#888'}" title="${c}"></div>`
          }).join('')}
          ${colores.length > 5 ? `<span style="font-size:0.7rem;color:#aaa;line-height:14px">+${colores.length-5}</span>` : ''}
        </div>
        <p class="product-name">${p.nombre}</p>
        ${_estrellasHTML}
        <div class="product-prices">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            ${_precioMenu ? `<span class="price-main">$${_precioMenu.toLocaleString('es-MX')} MXN</span>` : ''}
          </div>
          ${_precioMay3 ? `<div class="price-mayoreo-hint" style="margin-top:2px">🛍️ 3+ pares: <strong>$${_precioMay3.toLocaleString('es-MX')}</strong> c/u</div>` : ''}
        </div>
        <span class="btn-elegir-talla">Elegir talla</span>
      </a>`
  }

  // Rota sola la foto de cada tarjeta de producto mientras está visible en
  // pantalla (deja de rotar en cuanto sale del viewport, para no gastar
  // batería/datos en tarjetas que nadie está viendo). Un solo observer
  // compartido para todas las tarjetas, en vez de un timer por tarjeta.
  const _fotoRotObserver = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const wrap = entry.target
      if (entry.isIntersecting) {
        if (wrap._fotoRotTimer || wrap._fotoRotDelay) return
        let fotos = []
        try { fotos = JSON.parse(decodeURIComponent(wrap.dataset.fotos || '[]')) } catch(e) {}
        if (fotos.length < 2) return
        let idx = 0
        const rotar = () => {
          idx = (idx + 1) % fotos.length
          const img = wrap.querySelector('img')
          if (!img) return
          img.style.opacity = '0'
          setTimeout(() => {
            // El <img> trae srcset/sizes para elegir resolución -- si se
            // deja, el navegador ignora el src nuevo y regresa solo a la
            // imagen original del srcset (por eso "parpadeaba y volvía a
            // aparecer la misma"). Se quitan al rotar; ya no hacen falta,
            // la tarjeta se queda en un tamaño fijo de todos modos.
            img.removeAttribute('srcset')
            img.removeAttribute('sizes')
            img.src = zmImg(fotos[idx], 600)
            img.style.opacity = '1'
          }, 180)
        }
        // Arranque con retraso al azar -- si no, todas las tarjetas que
        // entran a pantalla juntas (ej. al cargar la página) cambian de
        // foto exactamente al mismo tiempo, se ve como que "parpadea toda
        // la pantalla". Con el retraso, cada una queda desfasada de las
        // demás, y como el intervalo después es igual para todas, el
        // desfase se mantiene sin necesidad de nada más.
        wrap._fotoRotDelay = setTimeout(() => {
          wrap._fotoRotDelay = null
          wrap._fotoRotTimer = setInterval(rotar, 2600)
        }, Math.random() * 2600)
      } else {
        if (wrap._fotoRotDelay) { clearTimeout(wrap._fotoRotDelay); wrap._fotoRotDelay = null }
        if (wrap._fotoRotTimer) { clearInterval(wrap._fotoRotTimer); wrap._fotoRotTimer = null }
      }
    })
  }, { threshold: 0.25 }) : null

  function _tituloHome() {
    const n = (productos || []).filter(p => p.activo).length
    return 'Nuestros <em>modelos</em>' + (n ? ' <small class="titulo-cuenta">' + n + ' disponibles</small>' : '')
  }

  function _agregarLote() {
    const grid = document.getElementById('products-grid')
    const lote = _listaActual.slice(_mostrados, _mostrados + _BATCH)
    lote.forEach((p, _i) => {
      const wrap = document.createElement('div')
      wrap.innerHTML = _cardHTML(p).trim()
      const card = wrap.firstChild
      grid.appendChild(card)
      // Banda «¿Vendes calzado?» en medio de la lista del home, tras la 12ª tarjeta (12 cierra fila en 2 y en 4 columnas); al fondo de 283 modelos nadie la veía
      if (_mostrados + _i === 11 && _listaActual.length >= 100 && !document.documentElement.classList.contains('ruta-categoria')) {
        const tpl = document.getElementById('tpl-banda-mayoreo')
        if (tpl && !document.getElementById('zm-banda-mayoreo')) grid.appendChild(tpl.content.cloneNode(true))
      }
      if (_fotoRotObserver) {
        const imgWrap = card.querySelector('.product-img-wrap[data-fotos]')
        if (imgWrap) _fotoRotObserver.observe(imgWrap)
      }
    })
    _mostrados += lote.length
    _actualizarSentinel()
  }

  function _actualizarSentinel() {
    const hay = _mostrados < _listaActual.length
    if (_scrollObs) { _scrollObs.disconnect(); _scrollObs = null }
    let s = document.getElementById('scroll-sentinel')
    if (!s) {
      s = document.createElement('div')
      s.id = 'scroll-sentinel'
      s.style.cssText = 'grid-column:1/-1;display:flex;justify-content:center;padding:32px 0 56px'
      document.getElementById('productos-section').appendChild(s)
    }
    s.style.display = hay ? '' : 'none'
    if (!hay) { s.innerHTML = ''; return }
    const restantes = _listaActual.length - _mostrados
    // Mucha gente creía que solo había los modelos que se ven: ahora se dice cuántos hay, el botón es grande y, además, al llegar
    // al final se cargan más modelos solos (sin tener que encontrar el botón).
    s.style.flexDirection = 'column'; s.style.alignItems = 'center'; s.style.gap = '12px'
    s.innerHTML = `<p class="ver-mas-progreso">Estás viendo <b>${_mostrados}</b> de <b>${_listaActual.length}</b> modelos</p><div class="ver-mas-barra"><span style="width:${Math.round(_mostrados / _listaActual.length * 100)}%"></span></div><button class="btn-ver-mas" onclick="_agregarLote()">Ver más modelos <span class="btn-ver-mas-count">${restantes} restantes</span></button>`
    if ('IntersectionObserver' in window) {
      _scrollObs = new IntersectionObserver((ents) => {
        if (ents[0].isIntersecting) { _scrollObs.disconnect(); _scrollObs = null; _agregarLote() }
      }, { rootMargin: '400px 0px' })
      _scrollObs.observe(s)
    }
  }

  function renderProductos(lista) {
    const grid = document.getElementById('products-grid')
    if (_scrollObs) { _scrollObs.disconnect(); _scrollObs = null }
    _listaActual = lista
    _mostrados = 0
    if (!lista.length) {
      grid.innerHTML = '<div class="empty"><div style="font-size:3rem">🔍</div><p>No se encontraron productos</p></div>'
      const s = document.getElementById('scroll-sentinel')
      if (s) s.style.display = 'none'
      return
    }
    grid.innerHTML = ''
    _agregarLote()
  }

  function abrirProducto(productoId) {
    const p = productos.find(prod => prod.id === productoId)
    if (!p) return
    window.history.pushState({}, '', '/producto/' + (p.slug || p.sku_interno || p.id))
    // GA4: view_item
    if (typeof gtag === 'function') gtag('event', 'view_item', {
      currency: 'MXN',
      value: p.es_oferta ? parseFloat(p.precio_menudeo) : (parseFloat(p.precio_menudeo) || 0) + 80,
      items: [{ item_id: p.sku_interno || p.id, item_name: p.nombre, item_category: p.categoria, price: p.es_oferta ? parseFloat(p.precio_menudeo) : (parseFloat(p.precio_menudeo) || 0) + 80 }]
    })
    // Preseleccionar color y talla si viene de Meta checkout
const colorPre = window['_colorPreselect_' + (p.sku_interno || p.id)]
const tallaPre = window['_tallaPreselect_' + (p.sku_interno || p.id)]
if (colorPre) {
  setTimeout(() => {
    const colorEl = document.getElementById('color-opt-' + colorPre.replace(/\s/g,'_'))
    if (colorEl) {
      colorEl.click()
      if (tallaPre) {
        setTimeout(() => {
          const tallaEl = document.getElementById('talla-opt-' + String(tallaPre).replace('.','_'))
          if (tallaEl && !tallaEl.classList.contains('agotada')) tallaEl.click()
        }, 400)
      }
    }
  }, 300)
}
    if (window.fbq) fbq('track', 'ViewContent', {
  content_ids: [p.sku_interno || p.id],
  content_type: 'product_group',
  content_name: p.nombre,
  content_category: p.categoria || '',
  value: p.es_oferta ? p.precio_menudeo : p.precio_menudeo + 80,
  currency: 'MXN'
})
if (window.ttq) ttq.track('ViewContent', {
  content_id: p.sku_interno || p.id,
  content_type: 'product',
  content_name: p.nombre,
  value: p.es_oferta ? p.precio_menudeo : p.precio_menudeo + 80,
  price: p.es_oferta ? p.precio_menudeo : p.precio_menudeo + 80,
  currency: 'MXN'
})
    productoSeleccionado = p
    window._videoUrl = p.video_url || null
    colorSeleccionado = null
    tallaSeleccionada = null
    varianteSeleccionada = null

    const varsProd = variantes.filter(v => v.producto_id === productoId)
    const colores = [...new Set(varsProd.map(v => v.color).filter(Boolean))]

    document.getElementById('modal-sku').textContent = p.sku_interno || ''
    document.getElementById('modal-name').textContent = p.nombre

    // Precio: oferta no suma +80, precio normal sí
    const _precioDisplay = p.es_oferta ? parseFloat(p.precio_menudeo) : (parseFloat(p.precio_menudeo) + 80)
    const _precioAntes   = p.es_oferta && p.precio_antes ? (parseFloat(p.precio_antes) + 80) : null
    const _priceEl = document.getElementById('modal-price')
    if (_precioAntes) {
      _priceEl.innerHTML =
        `<span style="text-decoration:line-through;color:#aaa;font-size:1rem;font-weight:400;margin-right:6px">$${_precioAntes} MXN</span>` +
        `<span style="color:#E91E8C">$${_precioDisplay} MXN</span>`
    } else {
      _priceEl.textContent = '$' + _precioDisplay + ' MXN'
    }

    // Mayoreo 3+: se queda en el sitio publico. El de 6+ ya solo vive en
    // panel/portal, por eso no se muestra aqui.
    const _mayoreoEl = document.getElementById('modal-mayoreo')
    if (p.es_oferta) {
      _mayoreoEl.innerHTML = ''
      _mayoreoEl.style.display = 'none'
    } else {
      _mayoreoEl.style.display = ''
      const _menuWeb = parseFloat(p.precio_menudeo) + 80
      const precioM3 = _menuWeb - 60
      const precioCorrida = p.precio_corrida || (p.precio_menudeo - 100)
      _mayoreoEl.innerHTML = `
        <p>Mayoreo 3+ pares: <strong>$${precioM3} MXN</strong> por par</p>
        ${p.corrida_activa ? `<p>Corrida completa: <strong>$${precioCorrida} MXN</strong> por par</p>` : ''}
      `
    }

    const imgWrap = document.getElementById('modal-img-wrap')
    // Color principal: el de la variante cuya foto es la portada; si no, el primer color
    let colorPrincipal = colores[0]
    if (p.imagen_principal && varsProd.length) {
      const vp = varsProd.find(v => v.foto_url === p.imagen_principal || (Array.isArray(v.imagenes) && v.imagenes.includes(p.imagen_principal)))
      if (vp && vp.color) colorPrincipal = vp.color
    }
    // Sin colores: mostrar imagen principal / placeholder.
    // Con colores: se preselecciona el color principal más abajo (seleccionarColor arma las fotos).
    if (colores.length === 0) {
      if (p.imagen_principal) {
        imgWrap.innerHTML = `<div style="padding:0 12px;box-sizing:border-box"><img src="${zmImg(p.imagen_principal, 800)}" alt="${p.nombre}" class="modal-foto-main modal-foto-clickeable" onclick="abrirLightbox([this.src],0)" role="button" tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' ') abrirLightbox([this.src],0)" width="400" height="400"></div>`
      } else {
        imgWrap.innerHTML = `<div class="modal-img-placeholder">👠</div>`
      }
      if (window._videoUrl) _adjuntarBotonVideo(imgWrap)
      const thumbRowInit = document.getElementById('modal-thumb-row')
      if (thumbRowInit) { thumbRowInit.style.display = 'none'; thumbRowInit.innerHTML = '' }
    }

    // Secciones de color y talla
    const seccionColor = document.getElementById('modal-colores')
    const seccionTalla = document.getElementById('modal-tallas')
    const labelColor = seccionColor ? seccionColor.previousElementSibling : null
    const labelTalla = seccionTalla ? seccionTalla.previousElementSibling : null

    if (colores.length === 0) {
      // Sin variantes: ocultar color/talla, botón deshabilitado con mensaje
      if (labelColor) labelColor.style.display = 'none'
      if (labelTalla) labelTalla.style.display = 'none'
      seccionColor.innerHTML = ''
      seccionTalla.innerHTML = ''
    } else {
      if (labelColor) labelColor.style.display = ''
      if (labelTalla) labelTalla.style.display = ''

      // Renderizar bolitas de colores
      seccionColor.innerHTML = colores.map(c => {
        const v = varsProd.find(v => v.color === c)
        return `<div class="color-opt" role="button" tabindex="0" onclick="seleccionarColor('${c.replace(/'/g,"\\'")}')" onkeydown="if(event.key==='Enter'||event.key===' ') seleccionarColor('${c.replace(/'/g,"\\'")}')" id="color-opt-${c.replace(/\s/g,'_').replace(/'/g,'')}">
          <div class="dot" style="background:${v?v.color_hex:'#888'}"></div>
          <span class="label">${c}</span>
        </div>`
      }).join('')

      // Preseleccionar el color principal (muestra sus fotos y tallas al abrir)
      seleccionarColor(colorPrincipal)
    }

    const btnCorrida = document.getElementById('btn-corrida')
    btnCorrida.style.display = p.corrida_activa ? 'block' : 'none'

    const btn = document.getElementById('btn-agregar')
    btn.disabled = true
    btn.textContent = colores.length === 0 ? 'Sin stock disponible' : 'Selecciona color y talla'

    document.getElementById('modal-overlay').classList.add('active')
    document.body.style.overflow = 'hidden'

    // Animación entrada modal
    requestAnimationFrame(function() {
      var imgWrapAnim  = document.getElementById('modal-img-wrap');
      var thumbRow     = document.getElementById('modal-thumb-row');
      var modalInfo    = document.querySelector('.modal-info');
      var infoChildren = modalInfo ? Array.from(modalInfo.children) : [];
      var modalActions = document.querySelector('.modal-actions');

      gsap.fromTo(imgWrapAnim,
        { opacity: 0, scale: 0.96, y: 14 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out', clearProps: 'transform' }
      );
      if (thumbRow && thumbRow.style.display !== 'none') {
        gsap.fromTo(thumbRow,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', delay: 0.1, clearProps: 'transform' }
        );
      }
      if (infoChildren.length) {
        gsap.fromTo(infoChildren,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.42, ease: 'power2.out', stagger: 0.07, delay: 0.08, clearProps: 'transform' }
        );
      }
      if (modalActions) {
        gsap.fromTo(modalActions,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', delay: 0.28, clearProps: 'transform' }
        );
      }
    });
    // Schema dinámico del producto
  const schemaAnterior = document.getElementById('schema-producto')
  if (schemaAnterior) schemaAnterior.remove()
  const schema = document.createElement('script')
  schema.type = 'application/ld+json'
  schema.id = 'schema-producto'
  schema.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": p.nombre,
    "description": p.descripcion || `${p.nombre} - Calzado de moda para dama. ${p.categoria || ''} disponible en Zapatillas May Leon Guanajuato.`,
    "sku": p.sku_interno || '',
    "brand": {
      "@type": "Brand",
      "name": p.marca || "Zapatillas May"
    },
    "category": p.categoria || "Calzado",
    "image": p.imagen_principal ? [p.imagen_principal] : [],
    "offers": {
      "@type": "Offer",
      "priceCurrency": "MXN",
      "price": p.es_oferta ? p.precio_menudeo : p.precio_menudeo + 80,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Zapatillas May"
      },
      "url": `https://zapatillasmay.mx/?producto=${p.id}`
    }
  })
  document.head.appendChild(schema)

  // Meta tags dinámicos
  document.title = `${p.nombre} | Zapatillas May`
  let metaDesc = document.querySelector('meta[name="description"]')
  if (!metaDesc) { metaDesc = document.createElement('meta'); metaDesc.name = 'description'; document.head.appendChild(metaDesc) }
  metaDesc.content = p.descripcion || `Compra ${p.nombre} en Zapatillas May. Calzado de moda para dama en Leon Guanajuato. Precio: $${p.es_oferta ? p.precio_menudeo : p.precio_menudeo + 80} MXN.`

  let ogTitle = document.querySelector('meta[property="og:title"]')
  if (!ogTitle) { ogTitle = document.createElement('meta'); ogTitle.setAttribute('property','og:title'); document.head.appendChild(ogTitle) }
  ogTitle.content = `${p.nombre} | Zapatillas May`

  let ogImage = document.querySelector('meta[property="og:image"]')
  if (!ogImage) { ogImage = document.createElement('meta'); ogImage.setAttribute('property','og:image'); document.head.appendChild(ogImage) }
  if (p.imagen_principal) ogImage.content = p.imagen_principal
  }

  function seleccionarColor(color) {
    colorSeleccionado = color
    tallaSeleccionada = null
    varianteSeleccionada = null

    document.querySelectorAll('.color-opt').forEach(el => el.classList.remove('active'))
    const colorEl = document.getElementById('color-opt-' + color.replace(/\s/g,'_'))
    if (colorEl) colorEl.classList.add('active')

    const varsProd = variantes.filter(v => v.producto_id === productoSeleccionado.id && v.color === color)
    const TALLAS_ORDEN = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Unica']
    varsProd.sort((a,b) => TALLAS_ORDEN.indexOf(a.talla) - TALLAS_ORDEN.indexOf(b.talla))

    // Recopilar todas las fotos de esta variante de color
    const fotos = []
    const v0 = varsProd[0]
    if (v0) {
      if (v0.foto_url) fotos.push(v0.foto_url)
      if (v0.imagenes && Array.isArray(v0.imagenes)) fotos.push(...v0.imagenes.filter(f => f && f !== v0.foto_url))
    }
    // Tambien imagen principal si no hay fotos
    if (!fotos.length && productoSeleccionado.imagen_principal) fotos.push(productoSeleccionado.imagen_principal)
    
    const imgWrap2 = document.getElementById('modal-img-wrap')
    window._fotosActuales = fotos
    window._fotoIdx = 0
    if (fotos.length > 0) {
      const renderFotos = () => {
        const idx = window._fotoIdx
        imgWrap2.innerHTML = `
          <div style="position:relative"
               ontouchstart="event.stopPropagation();window._swipeStartX=event.touches[0].clientX"
               ontouchend="event.stopPropagation();if(Math.abs(event.changedTouches[0].clientX-window._swipeStartX)>40)window.cambiarFoto(event.changedTouches[0].clientX<window._swipeStartX?1:-1)">
            <img src="${zmImg(fotos[idx], 800)}" alt="${color}"
              class="modal-foto-main modal-foto-clickeable"
              onclick="abrirLightbox(window._fotosActuales, ${idx})"
              role="button" tabindex="0"
              onkeydown="if(event.key==='Enter'||event.key===' ') abrirLightbox(window._fotosActuales, ${idx})"
              width="400" height="400">
            ${fotos.length > 1 ? `
              <button onclick="event.stopPropagation();window.cambiarFoto(-1)" aria-label="Foto anterior" style="position:absolute;left:18px;top:50%;transform:translateY(-50%);background:rgba(0,0,0,0.38);color:white;border:none;border-radius:50%;width:32px;height:32px;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center">‹</button>
              <button onclick="event.stopPropagation();window.cambiarFoto(1)" aria-label="Siguiente foto" style="position:absolute;right:18px;top:50%;transform:translateY(-50%);background:rgba(0,0,0,0.38);color:white;border:none;border-radius:50%;width:32px;height:32px;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center">›</button>
              <div style="position:absolute;bottom:6px;right:18px;background:rgba(0,0,0,0.45);color:white;font-size:0.68rem;padding:2px 7px;border-radius:10px">${idx+1}/${fotos.length}</div>
            ` : ''}
            ${window._videoUrl ? `<button onclick="event.stopPropagation();_mostrarVideoModal()" class="btn-ver-video">▶ Video</button>` : ''}
          </div>`
        const thumbRow = document.getElementById('modal-thumb-row')
        if (fotos.length > 1) {
          thumbRow.style.display = 'flex'
          thumbRow.innerHTML = fotos.map((f, i) => `
            <div role="button" tabindex="0" onclick="event.stopPropagation();window._fotoIdx=${i};window.cambiarFoto(0)" onkeydown="if(event.key==='Enter'||event.key===' '){event.stopPropagation();window._fotoIdx=${i};window.cambiarFoto(0)}"
              style="width:44px;height:44px;flex-shrink:0;border-radius:6px;overflow:hidden;cursor:pointer;border:2px solid ${i===idx?'#E91E8C':'#ddd'};transition:border 0.2s">
              <img src="${f}" alt="${color} — ${productoSeleccionado.nombre}" style="width:100%;height:100%;object-fit:cover">
            </div>`).join('')
        } else {
          thumbRow.style.display = 'none'
          thumbRow.innerHTML = ''
        }
      }
      window.cambiarFoto = (dir) => {
        if (dir === 0) { /* ya está seteado window._fotoIdx */ }
        else { window._fotoIdx = (window._fotoIdx + dir + window._fotosActuales.length) % window._fotosActuales.length }
        renderFotos()
      }
      renderFotos()
    }

    document.getElementById('modal-tallas').innerHTML = varsProd.map(v => {
      const inv = inventario.find(i => i.variante_id === v.id)
      const cantidad = inv ? inv.cantidad : 0
      const agotada = cantidad === 0
      return `<div class="talla-opt ${agotada?'agotada':''}" id="talla-opt-${v.talla.replace('.','_')}" role="button" tabindex="${agotada?'-1':'0'}" onclick="${!agotada?`seleccionarTalla('${v.id}','${v.talla}')`:''}" onkeydown="${!agotada?`if(event.key==='Enter'||event.key===' ') seleccionarTalla('${v.id}','${v.talla}')`:''}">${v.talla}</div>`
    }).join('')

    document.getElementById('btn-agregar').disabled = true
    document.getElementById('btn-agregar').textContent = 'Selecciona una talla'
  }

  function seleccionarTalla(varianteId, talla) {
    if (window.fbq) {
  const _sku = productoSeleccionado.sku_interno || productoSeleccionado.id
  const _cn = (colorSeleccionado||'').trim().replace(/\s/g,'_').replace(/\//g,'_').replace(/-/g,'_').replace(/_+/g,'_').replace(/^_|_$/g,'')
  const _t = (talla||'').trim()
  const _varId = _t ? `${_sku}-${_cn}-${_t}` : `${_sku}-${_cn}`
  fbq('track', 'CustomizeProduct', {
    content_ids: [_varId],
    content_type: 'product',
    color: colorSeleccionado,
    talla: talla
  })
}
    tallaSeleccionada = talla
    varianteSeleccionada = varianteId

    document.querySelectorAll('.talla-opt').forEach(el => el.classList.remove('active'))
    const tallaEl = document.getElementById('talla-opt-' + talla.replace('.','_'))
    if (tallaEl) tallaEl.classList.add('active')

    const btn = document.getElementById('btn-agregar')
    btn.disabled = false
    btn.textContent = '+ Agregar al carrito'
  }

  function agregarAlCarrito() {
    if (!varianteSeleccionada || !colorSeleccionado || !tallaSeleccionada) return
    const p = productoSeleccionado
    const existente = carrito.find(i => i.variante_id === varianteSeleccionada)
    if (existente) {
      existente.cantidad++
    } else {
      carrito.push({
        variante_id: varianteSeleccionada,
        producto_id: p.id,
        nombre: p.nombre,
        color: colorSeleccionado,
        talla: tallaSeleccionada,
        cantidad: 1,
        precio_menudeo: p.es_oferta ? parseFloat(p.precio_menudeo) : (parseFloat(p.precio_menudeo) || 0) + 80,
        // Descuento de mayoreo por 3+ pares: SI se queda en el sitio público.
        // El de 6+ ya solo vive en el panel y el portal de mayoristas.
        precio_mayoreo3: (p.es_oferta ? parseFloat(p.precio_menudeo) : (parseFloat(p.precio_menudeo) || 0) + 80) - 60,
        precio_corrida: parseFloat(p.precio_corrida) || (parseFloat(p.precio_menudeo) - 100),
        es_oferta: p.es_oferta || false,
        imagen: (() => {
          const varImg = variantes.find(v2 => v2.id === varianteSeleccionada)
          return varImg?.foto_url || (varImg?.imagenes && varImg.imagenes[0]) || p.imagen_principal || null
        })(),
        precio_unitario: p.es_oferta ? parseFloat(p.precio_menudeo) : (parseFloat(p.precio_menudeo) || 0) + 80
      })
    }
    if (window.fbq) {
  const _sku = p.sku_interno || p.id
  const _cn = (colorSeleccionado||'').trim().replace(/\s/g,'_').replace(/\//g,'_').replace(/-/g,'_').replace(/_+/g,'_').replace(/^_|_$/g,'')
  const _t = (tallaSeleccionada||'').trim()
  const _varId = _t ? `${_sku}-${_cn}-${_t}` : `${_sku}-${_cn}`
  const _precioPixel = p.es_oferta ? parseFloat(p.precio_menudeo) : (parseFloat(p.precio_menudeo) || 0) + 80
  fbq('track', 'AddToCart', {
    content_ids: [_varId],
    content_type: 'product',
    content_name: p.nombre,
    value: _precioPixel,
    currency: 'MXN'
  })
}
if (window.ttq) {
  const _precioTTQ = p.es_oferta ? parseFloat(p.precio_menudeo) : (parseFloat(p.precio_menudeo) || 0) + 80
  ttq.track('AddToCart', {
    content_id: p.sku_interno || p.id,
    content_type: 'product',
    content_name: p.nombre,
    value: _precioTTQ,
    price: _precioTTQ,
    currency: 'MXN'
  })
}
    // GA4: add_to_cart
    if (typeof gtag === 'function') gtag('event', 'add_to_cart', {
      currency: 'MXN',
      value: p.es_oferta ? parseFloat(p.precio_menudeo) : (parseFloat(p.precio_menudeo) || 0) + 80,
      items: [{ item_id: p.sku_interno || p.id, item_name: p.nombre, item_category: p.categoria, price: p.es_oferta ? parseFloat(p.precio_menudeo) : (parseFloat(p.precio_menudeo) || 0) + 80, quantity: 1 }]
    })
    // Pinterest CAPI: add_to_cart (server-side)
    try {
      const _pinterestPrice = p.es_oferta ? parseFloat(p.precio_menudeo) : (parseFloat(p.precio_menudeo) || 0) + 80
      fetch(API + '/pinterest/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name:       'add_to_cart',
          event_source_url: location.href,
          event_id:         'atc-' + (p.sku_interno || p.id) + '-' + Date.now(),
          value:            _pinterestPrice,
          currency:         'MXN',
          content_ids:      [p.sku_interno || p.id],
          content_name:     p.nombre,
          num_items:        1,
          external_id:      window._zmVisitorId ? window._zmVisitorId() : '',
        })
      }).catch(() => {})
    } catch(e) {}
    // Meta CAPI: AddToCart (server-side) — el backend extrae la IP real del request
    try {
      const _metaAtcPrice = p.es_oferta ? parseFloat(p.precio_menudeo) : (parseFloat(p.precio_menudeo) || 0) + 80
      const _metaAtcSku   = p.sku_interno || p.id
      const _metaAtcCn    = (colorSeleccionado||'').trim().replace(/\s/g,'_').replace(/\//g,'_').replace(/-/g,'_').replace(/_+/g,'_').replace(/^_|_$/g,'')
      const _metaAtcT     = (tallaSeleccionada||'').trim()
      const _metaAtcVarId = _metaAtcT ? `${_metaAtcSku}-${_metaAtcCn}-${_metaAtcT}` : `${_metaAtcSku}-${_metaAtcCn}`
      zmFetchEvento(API + '/pagos/meta/evento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name:         'AddToCart',
          event_source_url:   location.href,
          event_id:           'atc-meta-' + _metaAtcVarId + '-' + Date.now(),
          value:              _metaAtcPrice,
          currency:           'MXN',
          content_ids:        [_metaAtcVarId],
          content_name:       p.nombre,
          content_type:       'product',
          num_items:          1,
          fbc:    document.cookie.split(';').map(c=>c.trim()).find(c=>c.startsWith('_fbc='))?.split('=').slice(1).join('=') || '',
          fbp:    document.cookie.split(';').map(c=>c.trim()).find(c=>c.startsWith('_fbp='))?.split('=').slice(1).join('=') || '',
          fbclid: (()=>{ try { return new URLSearchParams(location.search).get('fbclid') || localStorage.getItem('zm_fbclid') || '' } catch(e){ return '' } })(),
          client_user_agent:  navigator.userAgent,
          email:    usuarioActual?.email || (()=>{try{const d=JSON.parse(localStorage.getItem('zm_form_datos')||'{}')||{};const s=JSON.parse(localStorage.getItem('zm_subscriber')||'{}')||{};return d.email||s.email||localStorage.getItem('zm_checkout_email')||''}catch(e){return ''}})() || '',
          telefono: usuarioActual?.telefono || (()=>{try{const d=JSON.parse(localStorage.getItem('zm_form_datos')||'{}')||{};return d.telefono||''}catch(e){return ''}})() || '',
          nombre:   usuarioActual?.nombre || (()=>{try{const d=JSON.parse(localStorage.getItem('zm_form_datos')||'{}')||{};const s=JSON.parse(localStorage.getItem('zm_subscriber')||'{}')||{};return d.nombre||s.nombre||''}catch(e){return ''}})() || '',
          cliente_id: usuarioActual?.cliente_id || '',
        })
      }).catch(() => {})
    } catch(e) {}
    cerrarModalBtn()
    recalcularCarrito()
    renderCarrito()
    mostrarToast('Producto agregado al carrito')
    setTimeout(() => abrirCarrito(), 300)
  }

  function agregarCorridaAlCarrito() {
    if (!colorSeleccionado) { mostrarToast('Selecciona un color primero'); return }
    const p = productoSeleccionado
    const varsProd = variantes.filter(v => v.producto_id === p.id && v.color === colorSeleccionado)
    
    // Obtener tallas disponibles en inventario
    const TALLAS_ORDEN = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27']
    const tallasDisp = varsProd
      .filter(v => { const inv = inventario.find(i => i.variante_id === v.id); return inv && inv.cantidad > 0 })
      .map(v => v.talla)
      .sort((a,b) => TALLAS_ORDEN.indexOf(a) - TALLAS_ORDEN.indexOf(b))

    // Verificar si tiene medios (tallas .5)
    const tieneMedias = tallasDisp.some(t => t.includes('.5'))

    // Validar condiciones de corrida
    let corridaValida = false
    let tallasCorrida = []

    if (tieneMedias) {
      // Con medios: del 23 al 26 (23,23.5,24,24.5,25,25.5,26) = 7 tallas
      // o del 23.5 al 26 (23.5,24,24.5,25,25.5,26) = 6 tallas
      // o del 23 al 25.5 (23,23.5,24,24.5,25,25.5) = 6 tallas
      const corrida23al26 = ['23','23.5','24','24.5','25','25.5','26']
      const corrida235al26 = ['23.5','24','24.5','25','25.5','26']
      const corrida23al255 = ['23','23.5','24','24.5','25','25.5']
      
      if (corrida23al26.every(t => tallasDisp.includes(t))) {
        corridaValida = true; tallasCorrida = corrida23al26
      } else if (corrida235al26.every(t => tallasDisp.includes(t))) {
        corridaValida = true; tallasCorrida = corrida235al26
      } else if (corrida23al255.every(t => tallasDisp.includes(t))) {
        corridaValida = true; tallasCorrida = corrida23al255
      }
    } else {
      // Sin medios: 23,24,24,25,25,26 = 6 tallas (dos 24 y dos 25)
      // Verificar que tenga al menos dos unidades de 24 y 25
      const check = (t) => {
        const v = varsProd.find(v2 => v2.talla === t)
        if (!v) return 0
        const inv = inventario.find(i => i.variante_id === v.id)
        return inv ? inv.cantidad : 0
      }
      if (tallasDisp.includes('23') && check('24') >= 2 && check('25') >= 2 && tallasDisp.includes('26')) {
        corridaValida = true; tallasCorrida = ['23','24','24','25','25','26']
      }
    }

    if (!corridaValida) {
      mostrarToast('No hay corrida completa disponible en este color')
      return
    }

    // Obtener imagen del color seleccionado
    const varColor = varsProd[0]
    const imgColor = varColor?.foto_url || varColor?.imagenes?.[0] || p.imagen_principal || null

    // Agrupar corrida como UN solo item en el carrito
    const idCorrida = p.id + '-' + colorSeleccionado + '-corrida'
    const existente = carrito.find(i => i.id_corrida === idCorrida)
    
    if (existente) {
      mostrarToast('Esta corrida ya está en el carrito')
    } else {
      carrito.push({
        id_corrida: idCorrida,
        variante_id: varColor?.id,
        producto_id: p.id,
        nombre: p.nombre,
        color: colorSeleccionado,
        talla: 'Corrida completa',
        tallas_corrida: tallasCorrida,
        cantidad: 1,
        precio_menudeo: (parseFloat(p.precio_menudeo)||0) + 80,
        precio_corrida: parseFloat(p.precio_corrida)||(parseFloat(p.precio_menudeo)-100),
        es_oferta: p.es_oferta||false,
        es_corrida: true,
        imagen: imgColor,
        precio_unitario: parseFloat(p.precio_corrida)||(parseFloat(p.precio_menudeo)-100)
      })
    }
    
    cerrarModalBtn()
    recalcularCarrito()
    renderCarrito()
    mostrarToast('Corrida agregada al carrito')
    setTimeout(() => abrirCarrito(), 300)
  }

  function guardarCarrito() {
    try { localStorage.setItem('zm_carrito', JSON.stringify(carrito)) } catch(e) {}
  }

  function recalcularCarrito() {
    // Contar pares: corrida cuenta como 6 pares por unidad
    const totalPares = carrito.reduce((s,i) => s + (i.es_corrida ? i.cantidad * 6 : i.cantidad), 0)
    const tieneCorrida = carrito.some(i => i.es_corrida)

    carrito.forEach(item => {
      // El descuento de 3+ pares SI se queda en el sitio público. El de 6+
      // pares ya solo vive en el panel y el portal de mayoristas -- en el
      // sitio, aunque haya 6+ pares, el precio no baja más allá de mayoreo3.
      if (item.es_corrida) {
        item.precio_unitario = item.precio_corrida
      } else if (item.es_oferta) {
        item.precio_unitario = item.precio_menudeo
      } else if (totalPares >= 3) {
        item.precio_unitario = item.precio_mayoreo3
      } else {
        item.precio_unitario = item.precio_menudeo
      }
    })

    // Corrida: precio_unitario es por par, cada corrida son 6 pares
    const total = carrito.reduce((s,i) => {
      const pares = i.es_corrida ? i.cantidad * 6 : i.cantidad
      return s + (pares * i.precio_unitario)
    }, 0)
    const tipoPrecio = tieneCorrida ? 'Corrida' : totalPares>=3 ? 'Mayoreo 3+' : 'Menudeo'

    const badge = document.getElementById('cart-count')
    badge.textContent = totalPares
    badge.style.display = totalPares > 0 ? 'flex' : 'none'
    // Badge del bottom-nav móvil
    const bnBadge = document.getElementById('bn-cart-count')
    if (bnBadge) { bnBadge.textContent = totalPares; bnBadge.style.display = totalPares > 0 ? 'flex' : 'none' }
    document.getElementById('cart-total').textContent = '$' + total.toFixed(2) + ' MXN'
    document.getElementById('cart-tipo-label').textContent = tipoPrecio
    document.getElementById('cart-pares-label').textContent = totalPares + ' ' + (totalPares===1?'par':'pares')
    guardarCarrito()
    actualizarIncentivosCarrito(totalPares, total)
  }

  function actualizarIncentivosCarrito(totalPares, subtotal) {
    const container = document.getElementById('cart-incentives')
    if (!container) return
    if (totalPares === 0) {
      container.style.display = 'none'
      return
    }
    container.style.display = 'block'

    // 1. Envío Gratis
    const gratisDesde = 1299
    const faltanEnvio = Math.max(0, gratisDesde - subtotal)
    const pctEnvio = Math.min(100, Math.round((subtotal / gratisDesde) * 100))

    let envioHTML = ''
    if (faltanEnvio > 0) {
      envioHTML = `
        <div style="margin-bottom:10px">
          <p style="font-size:0.75rem;color:#8B6A54;margin-bottom:5px;font-weight:600">
            🚚 Faltan <strong style="color:#b5687a">$${faltanEnvio.toFixed(0)} MXN</strong> para <strong>Envío Gratis</strong>
          </p>
          <div style="background:#FAF8F6;height:6px;border-radius:100px;overflow:hidden;border:1px solid rgba(200,150,122,0.12)">
            <div style="background:linear-gradient(135deg,#C8967A,#b5687a);width:${pctEnvio}%;height:100%;border-radius:100px;transition:width 0.3s ease"></div>
          </div>
        </div>
      `
    } else {
      envioHTML = `
        <div style="margin-bottom:10px">
          <p style="font-size:0.75rem;color:#22c55e;margin-bottom:5px;font-weight:700">
            🎉 ¡Envío gratis desbloqueado!
          </p>
          <div style="background:#FAF8F6;height:6px;border-radius:100px;overflow:hidden;border:1px solid rgba(200,150,122,0.12)">
            <div style="background:#22c55e;width:100%;height:100%;border-radius:100px;"></div>
          </div>
        </div>
      `
    }

    // 2. Mayoreo Alert (solo tramo 3+, el de 6+ ya no aplica en el sitio)
    let mayoreoHTML = ''
    if (totalPares === 1) {
      mayoreoHTML = `
        <div style="background:rgba(200,150,122,0.06);border:1px solid rgba(200,150,122,0.15);border-radius:10px;padding:8px 12px;font-size:0.72rem;color:#8B6A54;line-height:1.4">
          🎁 Agrega <strong style="color:#b5687a">2 pares más</strong> para activar el precio <strong>Mayoreo 3+</strong> y ahorrar $60 por par.
        </div>
      `
    } else if (totalPares === 2) {
      mayoreoHTML = `
        <div style="background:rgba(200,150,122,0.06);border:1px solid rgba(200,150,122,0.15);border-radius:10px;padding:8px 12px;font-size:0.72rem;color:#8B6A54;line-height:1.4">
          🎁 Agrega <strong style="color:#b5687a">1 par más</strong> para activar el precio <strong>Mayoreo 3+</strong> y ahorrar $60 por par.
        </div>
      `
    } else if (totalPares >= 3) {
      mayoreoHTML = `
        <div style="background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.15);border-radius:10px;padding:8px 12px;font-size:0.72rem;color:#166534;line-height:1.4;font-weight:600">
          ✨ ¡Precio <strong>Mayoreo 3+</strong> activado! Ahorras $60 por par.
        </div>
      `
    }

    container.innerHTML = envioHTML + mayoreoHTML
  }

  function renderCarrito() {
    const container = document.getElementById('cart-items')
    if (!carrito.length) {
      container.innerHTML = '<div class="empty"><div style="font-size:3rem">🛍️</div><p>Tu carrito esta vacio</p></div>'
      // Hide vaciar button
      const btnVaciar = document.getElementById('btn-vaciar-carrito')
      if (btnVaciar) btnVaciar.style.display = 'none'
      return
    }
    // Show vaciar button
    const btnVaciar = document.getElementById('btn-vaciar-carrito')
    if (btnVaciar) btnVaciar.style.display = 'block'

    container.innerHTML = carrito.map((item, idx) => { const hrefProducto = item.mp ? `/marketplace/${encodeURIComponent(item.mp_slug || '')}` : (item.producto_id ? `/producto/${item.producto_id}` : null); return `
      <div class="cart-item">
        ${item.imagen ? `<img class="cart-item-img" src="${zmImg(item.imagen, 120)}" alt="${item.nombre}" width="80" height="96"${hrefProducto ? ` onclick="location.href='${hrefProducto}'" style="cursor:pointer" title="Ver producto / agregar más pares"` : ''}>` : `<div class="cart-item-img" style="display:flex;align-items:center;justify-content:center;font-size:1.5rem${hrefProducto ? ';cursor:pointer' : ''}"${hrefProducto ? ` onclick="location.href='${hrefProducto}'" title="Ver producto / agregar más pares"` : ''}>👠</div>`}
        <div class="cart-item-info">
          <p class="cart-item-name">${item.nombre}</p>
          ${item.es_corrida
            ? `<p class="cart-item-detail">${item.color} · Corrida completa</p>`
            : `<p class="cart-item-detail">${item.color} · Talla ${item.talla}${item.mp ? ` · <span style="color:#A07860">Vendido por ${String(item.vendedor || 'tienda aliada').replace(/[<>&"]/g, '')}</span>` : ''}</p>`
          }
          <div class="cart-item-controls">
            <div style="display:flex;align-items:center;gap:6px">
              <div class="qty-controls">
                <button class="qty-btn" onclick="cambiarCantidadCarrito(${idx},-1)" aria-label="Disminuir cantidad">−</button>
                <span class="qty-num">${item.cantidad}</span>
                <button class="qty-btn" onclick="cambiarCantidadCarrito(${idx},1)" aria-label="Aumentar cantidad">+</button>
              </div>
              <button onclick="eliminarDelCarrito(${idx})" style="background:none;border:none;color:#ccc;cursor:pointer;font-size:1rem;padding:4px;line-height:1" title="Eliminar" aria-label="Eliminar del carrito">🗑</button>
            </div>
            <span class="item-price" style="${item.es_corrida?'color:#C8967A;font-weight:600':''}">$${(item.es_corrida ? item.cantidad*6*item.precio_unitario : item.cantidad*item.precio_unitario).toFixed(2)}</span>
          </div>
        </div>
      </div>
    ` }).join('')
  }

  function eliminarDelCarrito(idx) {
    carrito.splice(idx, 1)
    recalcularCarrito()
    renderCarrito()
  }

  function vaciarCarrito() {
    if (!confirm('¿Vaciar el carrito?')) return
    carrito = []
    recalcularCarrito()
    renderCarrito()
  }

  function cambiarCantidadCarrito(idx, delta) {
    const item = carrito[idx]
    
    if (delta > 0) {
      if (item.es_corrida) {
        // Para corridas: verificar stock suficiente para una corrida más
        const varsProd = variantes.filter(v => v.producto_id === item.producto_id && v.color === item.color)
        const nuevaCantidad = item.cantidad + 1
        // Cada talla necesita al menos nuevaCantidad unidades (simplificado)
        const stockOk = varsProd.length > 0 && varsProd.every(v => {
          const inv = inventario.find(i => i.variante_id === v.id)
          const stock = inv ? inv.cantidad : 0
          return stock >= nuevaCantidad
        })
        if (!stockOk) {
          mostrarToast('No hay stock suficiente para otra corrida')
          return
        }
      } else {
        // Para pares sueltos
        const inv = inventario.find(i => i.variante_id === item.variante_id)
        const stock = item.mp ? (Number(item.stock_mp) || 0) : (inv ? inv.cantidad : 0)
        if (item.cantidad + 1 > stock) {
          mostrarToast('No hay más stock disponible')
          return
        }
      }
    }

    const nuevaCantidad = item.cantidad + delta
    if (nuevaCantidad <= 0) {
      carrito.splice(idx, 1)
    } else {
      carrito[idx].cantidad = nuevaCantidad
    }
    recalcularCarrito()
    renderCarrito()
  }

  function abrirCarrito() {
    document.getElementById('cart-drawer').classList.add('open')
    document.getElementById('cart-overlay').classList.add('active')
    document.body.style.overflow = 'hidden'
  }

  function cerrarCarrito() {
    document.getElementById('cart-drawer').classList.remove('open')
    document.getElementById('cart-overlay').classList.remove('active')
    document.body.style.overflow = ''
  }

  function cerrarModal(event) {
    if (event.target === document.getElementById('modal-overlay')) cerrarModalBtn()
  }

  function cerrarModalBtn() {
    if (window.location.pathname !== '/') window.history.replaceState({}, '', '/')
    document.getElementById('modal-overlay').classList.remove('active')
    document.body.style.overflow = ''
  }

  window.addEventListener('popstate', function() {
    const overlay = document.getElementById('modal-overlay')
    if (overlay && overlay.classList.contains('active')) {
      overlay.classList.remove('active')
      document.body.style.overflow = ''
    }
  })

  function _getVideoEmbedHTML(url) {
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    if (ytMatch) return `<iframe src="https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0" frameborder="0" allow="autoplay;encrypted-media;fullscreen" allowfullscreen style="width:100%;height:100%;border:none;display:block"></iframe>`
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
    if (vimeoMatch) return `<iframe src="https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1" frameborder="0" allow="autoplay;fullscreen" allowfullscreen style="width:100%;height:100%;border:none;display:block"></iframe>`
    if (/\.(mp4|webm|mov)(\?|$)/i.test(url)) return `<video controls autoplay muted playsinline style="width:100%;height:100%;object-fit:contain;background:#000;display:block"><source src="${url}"></video>`
    return `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:12px;padding:20px"><span style="font-size:3rem">🎬</span><a href="${url}" target="_blank" rel="noopener" style="color:#E91E8C;font-size:0.88rem;text-align:center;word-break:break-all">Ver video →</a></div>`
  }

  function _adjuntarBotonVideo(imgWrap) {
    if (!window._videoUrl) return
    const btn = document.createElement('button')
    btn.className = 'btn-ver-video'
    btn.innerHTML = '▶ Video'
    btn.onclick = (e) => { e.stopPropagation(); _mostrarVideoModal() }
    imgWrap.appendChild(btn)
  }

  function _mostrarVideoModal() {
    const imgWrap = document.getElementById('modal-img-wrap')
    if (!window._videoUrl || !imgWrap) return
    imgWrap.innerHTML = `
      <div style="position:relative;width:100%;height:100%;background:#000;display:flex;flex-direction:column">
        <div style="flex:1;overflow:hidden">${_getVideoEmbedHTML(window._videoUrl)}</div>
        <button onclick="event.stopPropagation();_volverFotosModal()"
                style="position:absolute;top:8px;left:8px;background:rgba(255,255,255,0.15);backdrop-filter:blur(4px);color:white;border:1px solid rgba(255,255,255,0.3);border-radius:8px;padding:5px 12px;cursor:pointer;font-size:0.78rem;font-weight:600;z-index:5">
          ← Fotos
        </button>
      </div>`
  }

  function _volverFotosModal() {
    if (colorSeleccionado) {
      seleccionarColor(colorSeleccionado)
    } else if (productoSeleccionado) {
      const p = productoSeleccionado
      const imgWrap = document.getElementById('modal-img-wrap')
      const varsProd = variantes.filter(v => v.producto_id === p.id)
      const colores = [...new Set(varsProd.map(v => v.color).filter(Boolean))]
      const colorFotos = colores.map(c => {
        const v = varsProd.find(vv => vv.color === c)
        const foto = v ? (v.foto_url || (v.imagenes && v.imagenes[0]) || null) : null
        return { color: c, hex: v ? (v.color_hex || '#888') : '#888', foto }
      }).filter(cf => cf.foto)
      if (colorFotos.length > 1) {
        imgWrap.innerHTML = `<div class="color-foto-grid">${colorFotos.map(cf => `
          <div class="color-foto-card" role="button" tabindex="0" onclick="seleccionarColor('${cf.color.replace(/'/g,"\\'").replace(/"/g,'&quot;')}')" onkeydown="if(event.key==='Enter'||event.key===' ') seleccionarColor('${cf.color.replace(/'/g,"\\'").replace(/"/g,'&quot;')}')">
            <img src="${zmImg(cf.foto, 300)}" alt="${cf.color}" loading="lazy" width="150" height="150">
            <div class="color-foto-label"><span class="color-foto-dot" style="background:${cf.hex}"></span>${cf.color}</div>
          </div>`).join('')}</div>`
      } else if (p.imagen_principal) {
        imgWrap.innerHTML = `<div style="padding:12px 12px 0;box-sizing:border-box"><img src="${zmImg(p.imagen_principal, 800)}" alt="${p.nombre}" style="width:100%;max-height:clamp(220px,43vh,390px);height:auto;display:block;object-fit:contain;background:white;border-radius:8px;" class="modal-foto-clickeable" onclick="abrirLightbox([this.src],0)" role="button" tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' ') abrirLightbox([this.src],0)" width="400" height="400"></div>`
      } else {
        imgWrap.innerHTML = `<div class="modal-img-placeholder">👠</div>`
      }
      _adjuntarBotonVideo(imgWrap)
    }
  }

  // ── LIGHTBOX ──────────────────────────────────────────────
  let _lbFotos = [], _lbIdx = 0

  function abrirLightbox(fotos, idx) {
    _lbFotos = Array.isArray(fotos) ? fotos : [fotos]
    _lbIdx = idx || 0
    _renderLightbox()
    document.getElementById('lightbox-overlay').classList.add('active')
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', _lbKeyHandler)
  }

  function cerrarLightbox() {
    document.getElementById('lightbox-overlay').classList.remove('active')
    document.removeEventListener('keydown', _lbKeyHandler)
    // Restaurar el overflow del body sólo si el modal del producto también está cerrado
    if (!document.getElementById('modal-overlay').classList.contains('active')) {
      document.body.style.overflow = ''
    }
  }

  function lightboxNav(dir) {
    _lbIdx = (_lbIdx + dir + _lbFotos.length) % _lbFotos.length
    _renderLightbox()
  }

  function lightboxClickFondo(event) {
    if (event.target === document.getElementById('lightbox-overlay')) cerrarLightbox()
  }

  function _lbKeyHandler(e) {
    if (e.key === 'Escape') cerrarLightbox()
    if (e.key === 'ArrowLeft') lightboxNav(-1)
    if (e.key === 'ArrowRight') lightboxNav(1)
  }

  function _renderLightbox() {
    document.getElementById('lightbox-img').src = _lbFotos[_lbIdx]
    const prev = document.getElementById('lightbox-prev')
    const next = document.getElementById('lightbox-next')
    prev.style.display = _lbFotos.length > 1 ? 'flex' : 'none'
    next.style.display = _lbFotos.length > 1 ? 'flex' : 'none'
    const dots = document.getElementById('lightbox-dots')
    dots.innerHTML = _lbFotos.length > 1
      ? _lbFotos.map((_, i) => `<button class="lightbox-dot ${i===_lbIdx?'active':''}" onclick="event.stopPropagation();_lbIdx=${i};_renderLightbox()" aria-label="Ir a foto ${i + 1}"></button>`).join('')
      : ''
  }
  // Swipe táctil (mismo patrón que el lightbox del portal mayorista/POS)
  let _lbSwipeStartX = 0
  document.addEventListener('DOMContentLoaded', () => {
    const img = document.getElementById('lightbox-img')
    if (!img) return
    img.addEventListener('touchstart', e => { _lbSwipeStartX = e.touches[0].clientX }, { passive: true })
    img.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - _lbSwipeStartX
      if (Math.abs(dx) > 50) lightboxNav(dx < 0 ? 1 : -1)
    }, { passive: true })
  })
  // ─────────────────────────────────────────────────────────
  function mostrarPaginaExito(paymentId, pedidoId) {
  const hero = document.getElementById('hero-section')
  const bannerMayoreo = document.querySelector('.banner-mayoreo')
  if (hero) hero.style.display = 'none'
  document.querySelectorAll('.section').forEach(s => s.style.display = 'none')
  if (bannerMayoreo) bannerMayoreo.style.display = 'none'

  // Limpiar pedido_id guardado
  try { localStorage.removeItem('zm_checkout_pedido_id') } catch(e){}

  const numPedido = pedidoId ? pedidoId.toString().substring(0,8).toUpperCase() : (paymentId ? paymentId.toString().substring(0,8) : '')
  const numPedidoHTML = numPedido
    ? `<p style="font-size:0.72rem;color:#aaa;margin-bottom:22px;font-family:monospace;background:#f7f7f7;display:inline-block;padding:5px 14px;border-radius:100px">Pedido #${numPedido}</p>`
    : ''

  const pagina = document.getElementById('pagina-interna')
  const contenido = document.getElementById('pagina-contenido')
  contenido.innerHTML = `
    <div style="min-height:80vh;display:flex;align-items:center;justify-content:center;padding:40px 20px;background:linear-gradient(160deg,#f7ede4,#f2e4d8)">
      <div style="text-align:center;max-width:480px;background:white;border-radius:24px;padding:44px 32px;box-shadow:0 16px 48px rgba(90,40,10,0.12);border:1px solid rgba(200,150,122,0.15)">
        <div style="width:84px;height:84px;margin:0 auto 20px;border-radius:50%;background:linear-gradient(135deg,#C8967A,#b5687a);display:flex;align-items:center;justify-content:center;font-size:2.4rem;box-shadow:0 8px 24px rgba(200,150,122,0.4);animation:popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)">🎉</div>
        <p style="font-size:0.66rem;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#C8967A;margin-bottom:8px">Pedido confirmado</p>
        <h2 style="font-family:var(--font-display);font-size:2.4rem;font-weight:400;margin-bottom:10px;color:#2A1A0E;line-height:1.05">¡Gracias por tu <em style="font-style:italic;color:#b5687a">compra!</em></h2>
        ${numPedidoHTML}
        <p style="color:#5a4030;margin-bottom:6px;line-height:1.6;font-size:0.9rem">Tu pedido ha sido confirmado. Te contactaremos por WhatsApp con los detalles y el seguimiento.</p>
        <p style="font-size:0.8rem;color:#999;margin-bottom:0;line-height:1.5">📩 También recibirás un correo de confirmación con el resumen de tu pedido.</p>
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:24px">
          <a href="https://wa.me/5214792244560?text=${encodeURIComponent('¡Hola! Acabo de realizar mi pedido' + (numPedido ? ' #' + numPedido : '') + '. ¿Cuándo me lo envían?')}"
             target="_blank" rel="noopener"
             style="display:flex;align-items:center;justify-content:center;gap:8px;padding:14px;background:linear-gradient(135deg,#25D366,#128C7E);color:white;border-radius:100px;text-decoration:none;font-weight:700;font-size:0.9rem">
            💬 Seguimiento por WhatsApp
          </a>
          <a href="https://wa.me/5214792244560?text=${encodeURIComponent('¡Hola! Quiero dejar una reseña de mi compra' + (numPedido ? ' #' + numPedido : '') + ' 😊')}"
             target="_blank" rel="noopener"
             style="display:flex;align-items:center;justify-content:center;gap:8px;padding:13px;background:transparent;border:1.5px solid rgba(200,150,122,0.3);color:#8B6A54;border-radius:100px;text-decoration:none;font-weight:600;font-size:0.88rem">
            ⭐ Dejar una reseña
          </a>
          <button onclick="mostrarInicio();window.history.pushState({},'','/')"
                  style="padding:13px;background:transparent;border:none;font-family:var(--font-body);font-size:0.85rem;color:#C4A38A;cursor:pointer;text-decoration:underline">
            Seguir comprando
          </button>
        </div>
      </div>
    </div>
    <style>@keyframes popIn{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}</style>
  `
  pagina.style.display = 'block'
  carrito = []
  recalcularCarrito()
  renderCarrito()
}

  function mostrarPaginaPendiente(pedidoShort) {
    const hero = document.getElementById('hero-section')
    const bannerMayoreo = document.querySelector('.banner-mayoreo')
    if (hero) hero.style.display = 'none'
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none')
    if (bannerMayoreo) bannerMayoreo.style.display = 'none'

    const pagina = document.getElementById('pagina-interna')
    const contenido = document.getElementById('pagina-contenido')
    const numPedido = pedidoShort ? `<p style="font-size:0.78rem;color:#aaa;margin-bottom:24px;font-family:monospace">Pedido #${pedidoShort}</p>` : ''
    contenido.innerHTML = `
      <div style="min-height:80vh;display:flex;align-items:center;justify-content:center;padding:40px 20px;background:linear-gradient(160deg,#fffde7,#fff8e1)">
        <div style="text-align:center;max-width:480px;background:white;border-radius:24px;padding:48px 36px;box-shadow:0 16px 48px rgba(90,40,10,0.10);border:1px solid rgba(200,150,122,0.15)">
          <div style="width:84px;height:84px;margin:0 auto 24px;border-radius:50%;background:linear-gradient(135deg,#f9a825,#fb8c00);display:flex;align-items:center;justify-content:center;font-size:2.4rem;box-shadow:0 8px 24px rgba(249,168,37,0.35);animation:popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)">⏳</div>
          <p style="font-size:0.66rem;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#f9a825;margin-bottom:10px">Pago en proceso</p>
          <h2 style="font-family:var(--font-display);font-size:2.2rem;font-weight:400;margin-bottom:14px;color:#2A1A0E;line-height:1.1">¡Ya casi está <em style="font-style:italic;color:#fb8c00">listo!</em></h2>
          ${numPedido}
          <p style="color:#5a4030;margin-bottom:8px;line-height:1.6">Tu pago por SPEI está siendo procesado.</p>
          <p style="font-size:0.85rem;color:#888;margin-bottom:8px;line-height:1.6">
            ⏱️ La transferencia se acredita en <strong>15 minutos a 2 horas</strong> según tu banco.
          </p>
          <p style="font-size:0.85rem;color:#888;margin-bottom:28px;line-height:1.6">
            📩 Cuando se confirme recibirás un correo con el resumen de tu pedido.
          </p>
          <a href="https://wa.me/5214792244560?text=Hola%2C+realic%C3%A9+un+pago+por+SPEI+para+mi+pedido"
             style="display:block;text-align:center;background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;padding:14px;border-radius:100px;text-decoration:none;font-weight:700;font-size:0.9rem;margin-bottom:12px">
            💬 Confirmar por WhatsApp
          </a>
          <button onclick="mostrarInicio();window.history.pushState({},'','/')"
                  style="width:100%;padding:13px;background:transparent;border:1.5px solid rgba(200,150,122,0.3);border-radius:100px;font-family:var(--font-body);font-size:0.88rem;font-weight:600;color:#8B6A54;cursor:pointer">
            Seguir viendo modelos
          </button>
        </div>
      </div>
      <style>@keyframes popIn{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}</style>
    `
    pagina.style.display = 'block'
  }

  function mostrarPaginaFallido() {
    const hero = document.getElementById('hero-section')
    const bannerMayoreo = document.querySelector('.banner-mayoreo')
    if (hero) hero.style.display = 'none'
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none')
    if (bannerMayoreo) bannerMayoreo.style.display = 'none'

    const pagina = document.getElementById('pagina-interna')
    const contenido = document.getElementById('pagina-contenido')
    contenido.innerHTML = `
      <div style="min-height:80vh;display:flex;align-items:center;justify-content:center;padding:40px 20px;background:linear-gradient(160deg,#ffeef0,#fce4e4)">
        <div style="position:relative;text-align:center;max-width:480px;background:white;border-radius:24px;padding:48px 36px;box-shadow:0 16px 48px rgba(90,40,10,0.10);border:1px solid rgba(200,100,100,0.15)">
          <button onclick="window.location.href='/'" style="position:absolute;top:14px;right:18px;background:none;border:none;cursor:pointer;font-size:1.3rem;color:#bbb;line-height:1;padding:4px" aria-label="Cerrar"><span aria-hidden="true">✕</span></button>
          <div style="width:84px;height:84px;margin:0 auto 24px;border-radius:50%;background:linear-gradient(135deg,#ef5350,#c62828);display:flex;align-items:center;justify-content:center;font-size:2.4rem;box-shadow:0 8px 24px rgba(239,83,80,0.35);animation:popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)">😕</div>
          <p style="font-size:0.66rem;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#ef5350;margin-bottom:10px">Pago no completado</p>
          <h2 style="font-family:var(--font-display);font-size:2.2rem;font-weight:400;margin-bottom:14px;color:#2A1A0E;line-height:1.1">Algo salió <em style="font-style:italic;color:#c62828">mal</em></h2>
          <p style="color:#5a4030;margin-bottom:8px;line-height:1.6">Tu pago no pudo procesarse. Tu carrito sigue guardado.</p>
          <p style="font-size:0.85rem;color:#888;margin-bottom:28px;line-height:1.6">
            Puedes intentarlo de nuevo con otro método de pago o contactarnos.
          </p>
          <button onclick="window.location.href='/checkout'"
                  style="width:100%;padding:14px;background:linear-gradient(135deg,#C8967A,#b5687a);color:white;border:none;border-radius:100px;font-family:var(--font-body);font-size:0.9rem;font-weight:700;cursor:pointer;margin-bottom:12px">
            Intentar de nuevo
          </button>
          <a href="https://wa.me/5214792244560?text=Hola%2C+tuve+un+problema+con+mi+pago"
             style="display:block;text-align:center;background:transparent;border:1.5px solid rgba(200,150,122,0.3);color:#8B6A54;padding:13px;border-radius:100px;text-decoration:none;font-weight:600;font-size:0.88rem">
            💬 Ayuda por WhatsApp
          </a>
        </div>
      </div>
      <style>@keyframes popIn{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}</style>
    `
    pagina.style.display = 'block'
  }

  function mostrarToast(msg) {
    const t = document.getElementById('toast')
    t.textContent = msg
    t.classList.add('show')
    setTimeout(() => t.classList.remove('show'), 2500)
  }

  function _cerrarBusqueda() {
    ['search-results','mobile-search-results'].forEach(id => {
      const el = document.getElementById(id); if (el) el.classList.remove('show')
    })
    const si = document.getElementById('search-input'); if (si) si.value = ''
    const mi = document.getElementById('mobile-search-input'); if (mi) mi.value = ''
  }

  function buscarProductos(texto) {
    const containers = ['search-results','mobile-search-results']
      .map(id => document.getElementById(id)).filter(Boolean)
    if (!texto || texto.length < 2) { containers.forEach(c => c.classList.remove('show')); return }
    // Búsqueda tolerante: sin acentos ni mayúsculas, plurales («botines negros» → botin negro), también por COLOR y por talla.
    // Antes «tacón rojo», «botines negros» o «tenis blancos» no encontraban nada porque solo se buscaba en el nombre.
    const _n = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    const _tallaReg = /^(2[2-7](\.5)?)$/
    const _palabrasIgnoradas = ['talla', 'tallas', 'numero', 'num', 'para', 'de', 'del', 'la', 'el', 'en', 'dama', 'mujer']
    const _terminosTodos = _n(texto).split(/\s+/).filter(t => t)
    const _tallasPedidas = _terminosTodos.filter(t => _tallaReg.test(t))
    const terminos = _terminosTodos
      .filter(t => !_tallaReg.test(t) && !_palabrasIgnoradas.includes(t))
      .map(t => t.length > 3 ? t.replace(/(es|s)$/, '') : t)
    if (!window._busqColores) {
      window._busqColores = {}
      variantes.forEach(v => { if (v.color) window._busqColores[v.producto_id] = (window._busqColores[v.producto_id] || '') + ' ' + _n(v.color) })
    }
    if (_tallasPedidas.length && (!_idxTallas || !Object.keys(_idxTallas).length)) { try { _construirIndicesFiltro() } catch (e) {} }
    const coinciden = productos.filter(p => {
      if (!p.activo) return false
      const txt = _n(p.nombre + ' ' + (p.sku_interno || '') + ' ' + (p.categoria || '') + ' ' + (window._busqColores[p.id] || ''))
      if (!terminos.every(t => txt.includes(t))) return false
      return _tallasPedidas.every(t => _idxTallas && _idxTallas[p.id] && _idxTallas[p.id].has(t))
    })
    window._ultimaBusqueda = { texto: texto.trim(), lista: coinciden }
    const filtrados = coinciden.slice(0, 6)
    // Búsquedas para Google Analytics (también las que NO encuentran nada: son lo que la gente quiere y no hay).
    // Se registra al dejar de escribir; Meta y TikTok siguen recibiendo solo las búsquedas con resultados.
    clearTimeout(window._stGa)
    window._stGa = setTimeout(function() {
      try { if (window.gtag) gtag('event', 'view_search_results', { search_term: texto.trim().toLowerCase().slice(0, 80), results_count: coinciden.length }) } catch (e) {}
    }, 1200)
    if (!filtrados.length) {
      // Antes la lista simplemente se cerraba sin decir nada: la clienta se quedaba sin saber si escribió mal o no hay.
      const _esc = String(texto).trim().slice(0, 40).replace(/[<>&"]/g, '')
      const vacio = `<div style="padding:16px 18px;font-size:0.84rem;line-height:1.5;color:#5a4030">
        <p style="margin:0 0 6px;font-weight:700">No encontramos «${_esc}»</p>
        <p style="margin:0 0 10px;color:#8B6A54">Prueba con el tipo de zapato (tacón, bota, sandalia) o el color. Si buscas algo en especial, te ayudamos por WhatsApp.</p>
        <a href="https://wa.me/5214792244560?text=${encodeURIComponent('Hola, estoy buscando: ' + _esc)}" target="_blank" rel="noopener" style="display:inline-block;margin-right:10px;color:#128c7e;font-weight:700;text-decoration:none">💬 Pedirlo por WhatsApp</a>
        <a href="#" onclick="event.preventDefault();_cerrarBusqueda();mostrarTodos()" style="color:#b5687a;font-weight:700;text-decoration:none">Ver todo el catálogo →</a>
      </div>`
      containers.forEach(c => { c.innerHTML = vacio; c.classList.add('show') })
      return
    }
    const html = filtrados.map(p => `
      <a class="search-result-item" href="/producto/${p.slug||p.sku_interno||p.id}" onclick="document.querySelectorAll('.search-results').forEach(function(c){c.classList.remove('show')})">
        ${p.imagen_principal ? `<img class="search-result-img" src="${zmImg(p.imagen_principal, 96)}" alt="${(p.nombre && p.nombre.split(' ').length > 2) ? `${p.nombre.trim()} — Zapatillas May` : `${p.nombre || 'Calzado'} ${p.categoria || ''} — Zapatillas May`.replace(/\s+/g, ' ').trim()}" width="48" height="48">` : `<div class="search-result-img" style="display:flex;align-items:center;justify-content:center;font-size:1.2rem">👠</div>`}
        <div class="search-result-info">
          <p class="name">${p.nombre}</p>
          <p class="price">$${p.es_oferta ? p.precio_menudeo : p.precio_menudeo + 80} MXN</p>
        </div>
      </a>
    `).join('') + (coinciden.length > filtrados.length
      ? `<a href="#" onclick="event.preventDefault();verResultadosBusqueda()" style="display:block;padding:12px 18px;text-align:center;font-size:0.82rem;font-weight:700;color:#b5687a;text-decoration:none;border-top:1px solid rgba(200,150,122,0.2)">Ver los ${coinciden.length} resultados →</a>` : '')
    containers.forEach(c => { c.innerHTML = html; c.classList.add('show') })
    clearTimeout(window._st)
    window._st = setTimeout(function() {
      if (window.fbq) fbq('track', 'Search', {search_string: texto, content_category: 'calzado'})
      if (window.ttq) ttq.track('Search', {query: texto})
    }, 800)
  }

  function verResultadosBusqueda() {
    const b = window._ultimaBusqueda
    if (!b || !b.lista.length) return
    _cerrarBusqueda()
    mostrarConFiltros(b.lista, 'Resultados para <em>«' + String(b.texto).replace(/[<>&"]/g, '') + '»</em>', '', '/#buscar')
  }

  // Si la clienta filtró por UNA talla o UN color, la ficha se abre ya con eso elegido (antes tenía que volver a escogerlo).
  function _queryFiltros() {
    try {
      const q = []
      if (_filtros && _filtros.tallas && _filtros.tallas.length === 1) q.push('talla=' + encodeURIComponent(_filtros.tallas[0]))
      if (_filtros && _filtros.colores && _filtros.colores.length === 1) {
        const k = _filtros.colores[0]
        q.push('color=' + encodeURIComponent((_colorMeta[k] && _colorMeta[k].display) || k))
      }
      return q.length ? '?' + q.join('&') : ''
    } catch (e) { return '' }
  }

  function filtrarCategoria(categoria) {
    if (!productos || !productos.length) {
      mostrarToast('Cargando catálogo…')
      inicializar().then(() => filtrarCategoria(categoria))
      return
    }
    const label = (_CAT_LABELS[categoria] || (categoria.charAt(0).toUpperCase()+categoria.slice(1)))
    mostrarConFiltros(productos.filter(p => p.activo), label + ' <em>disponibles</em>', categoria, '/' + categoria)
  }

  function mostrarTodos() {
    mostrarConFiltros(productos.filter(p => p.activo), 'Todo el <em>catálogo</em>', '', '/#catalogo')
  }

  function mostrarOfertas() {
    mostrarConFiltros(productos.filter(p => p.es_oferta && p.activo), '<em>Ofertas</em> especiales', '', '/ofertas')
  }

  function mostrarInicio() {
  const pagina = document.getElementById('pagina-interna')
  const hero = document.getElementById('hero-section')
  const bannerMayoreo = document.querySelector('.banner-mayoreo')

  document.documentElement.classList.remove('ruta-interna', 'ruta-categoria')
  pagina.style.display = 'none'
  if (hero) hero.style.display = ''
  document.documentElement.classList.add('ruta-home')
  // Re-mostrar todas las secciones del home
  document.querySelectorAll('.section').forEach(s => s.style.display = '')
  if (bannerMayoreo) bannerMayoreo.style.display = ''

  document.getElementById('productos-titulo').innerHTML = _tituloHome()
  const _fb0 = document.getElementById('filtros-bar'); if (_fb0) _fb0.classList.remove('visible')
  // Restaurar strip mayoreo al volver al home
  const _strip = document.querySelector('.cro-trust-strip'); if (_strip) _strip.style.display = ''
  // Restaurar título SEO del home
  document.title = 'Calzado de Dama | Envíos a todo México | Zapatillas May León'
  const _md = document.querySelector('meta[name="description"]')
  if (_md) _md.setAttribute('content', 'Calzado femenino de moda hecho en León, Guanajuato. Tacones, sandalias, botas y botines. Envíos a todo México, cambios de talla fáciles.')
  renderProductos(productos.filter(p => p.activo))
  window.scrollTo({ top: 0, behavior: 'instant' })
  history.replaceState({}, '', '/')
}
function mostrarCatalogo() {
  mostrarConFiltros(productos.filter(p => p.activo), 'Todo el <em>catálogo</em>', '', '/#catalogo')
}

function mostrarNuevos() {
  document.documentElement.classList.remove('ruta-interna', 'ruta-home')
  const pagina = document.getElementById('pagina-interna')
  const hero = document.getElementById('hero-section')
  const productosSection = document.getElementById('productos-section')
  const cats = document.querySelector('.section')
  const bannerMayoreo = document.querySelector('.banner-mayoreo')

  pagina.style.display = 'none'
  if (hero) hero.style.setProperty('display','none','important')
  productosSection.style.display = ''
  if (cats) cats.style.display = 'none'
  if (bannerMayoreo) bannerMayoreo.style.display = 'none'

  // Los elegidos a mano van primero (el más reciente arriba), luego los nuevos automáticos
  const nuevos = productos.filter(p => p.activo && esNuevo(p)).sort((a, b) =>
    new Date(b.novedad_at || b.created_at || 0) - new Date(a.novedad_at || a.created_at || 0)).map(p => {
      // Si solo llegó/se resurtió un color, la tarjeta muestra la foto de ese color y el enlace abre ese color
      const grupos = _novGrupos(p)
      if (!grupos.length) return p
      const cols = grupos.reduce((a, g) => a.concat(g.colores), [])
      const v = variantes.find(x => x.producto_id === p.id && x.activa !== false && x.foto_url && String(x.color || '').trim() === cols[0])
      const copia = Object.assign({}, p)
      if (v) { copia.imagen_principal = v.foto_url; copia.foto_limpia = null }
      copia._novCols = cols   // en Novedades, la tarjeta solo rota entre las fotos de los colores marcados
      if (cols.length === 1) copia._novQuery = '?color=' + encodeURIComponent(cols[0])
      return copia
    })
  document.getElementById('productos-titulo').innerHTML = 'Nuevos <em>modelos</em>'
  const _fb = document.getElementById('filtros-bar'); if (_fb) _fb.classList.remove('visible')
  document.documentElement.classList.remove('ruta-categoria')
  renderProductos(nuevos)
  window.scrollTo({ top: 0, behavior: 'smooth' })
  history.replaceState({}, '', '/#nuevos')
}

// ════════════ SISTEMA DE FILTROS ════════════
const _ORDEN_TALLAS = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Unica','Única']
const _CAT_LABELS = {tacones:'Tacones',sandalias:'Sandalias',botas:'Botas',botines:'Botines',flats:'Flats',plataformas:'Plataformas',tenis:'Tenis',nina:'Niña',accesorios:'Accesorios'}
const _OCASION_LABELS = {casual:'Casual / Diario', formal:'Formal / Vestir', trabajo:'Trabajo / Oficina', fiesta:'Fiesta / Noche', urbano:'Urbano'}
const _RANGOS_PRECIO = [
  { label: 'Menos de $400', min: 0, max: 400 },
  { label: '$400 – $600', min: 400, max: 600 },
  { label: '$600 – $800', min: 600, max: 800 },
  { label: 'Más de $800', min: 800, max: Infinity },
]
let _filtroBase = []
let _filtros = { categoria: '', tallas: [], colores: [], precioRango: null, ocasion: [] }
let _idxTallas = {}, _idxColores = {}, _invMapF = {}, _colorMeta = {}

function _normColor(c){ return c.trim().toLowerCase().replace(/\s+/g,' ') }

function _construirIndicesFiltro() {
  _invMapF = {}
  inventario.forEach(i => { _invMapF[i.variante_id] = i.cantidad || 0 })
  _idxTallas = {}; _idxColores = {}; _colorMeta = {}
  variantes.forEach(v => {
    if (v.activa === false) return
    const pid = v.producto_id
    const stock = _invMapF[v.id] || 0
    if (v.talla && stock > 0) {
      if (!_idxTallas[pid]) _idxTallas[pid] = new Set()
      _idxTallas[pid].add(String(v.talla))
    }
    if (v.color) {
      const key = _normColor(v.color)
      if (!_idxColores[pid]) _idxColores[pid] = new Set()
      _idxColores[pid].add(key)
      if (!_colorMeta[key]) _colorMeta[key] = { display: v.color.trim(), hex: v.color_hex || '#ccc' }
    }
  })
}

function _precioDe(p) {
  return p.es_oferta ? parseFloat(p.precio_menudeo||0) : (parseFloat(p.precio_menudeo||0) + 80)
}

// Títulos SEO por categoría
const _SEO_TITLES = {
  tacones: 'Tacones y Zapatillas de Dama | Envíos a todo México | Zapatillas May',
  sandalias: 'Sandalias de Dama | Envíos a todo México | Zapatillas May León',
  botas: 'Botas de Mujer y Dama | Envíos a todo México | Zapatillas May',
  botines: 'Botines de Dama | Envíos a todo México | Zapatillas May León',
  flats: 'Flats de Dama | Envíos a todo México | Zapatillas May León',
  plataformas: 'Plataformas de Dama | Envíos a todo México | Zapatillas May León',
  tenis: 'Tenis de Dama | Envíos a todo México | Zapatillas May León',
  nina: 'Calzado para Niña | Envíos a todo México | Zapatillas May León',
  accesorios: 'Accesorios de Moda | Envíos a todo México | Zapatillas May León',
}
const _SEO_DESCRIPTIONS = {
  tacones:     'Tacones de moda para dama, directo de fábrica en León, Guanajuato. Nuevos modelos cada semana. Envíos a todo México, cambios de talla fáciles.',
  sandalias:   'Sandalias de moda para dama. Nuevos modelos cada semana. Directo del fabricante en León, Guanajuato. Envíos a todo México.',
  botas:       'Botas para dama directo de León, Guanajuato. Modelos actuales de temporada. Envíos a toda la República, cambios de talla fáciles.',
  botines:     'Botines de moda para dama, directo del fabricante en León, Guanajuato. Envíos a todo México, cambios de talla fáciles.',
  flats:       'Flats y zapatos bajos para dama. Nuevos estilos cada semana desde León, Guanajuato. Envíos a todo México.',
  plataformas: 'Plataformas de moda para dama, directo de fábrica en León, Guanajuato. Envíos a toda la República.',
  tenis:       'Tenis para dama desde León, Guanajuato. Modelos actuales de temporada. Envíos a todo México.',
  nina:        'Calzado para niña directo del fabricante en León, Guanajuato. Envíos a todo México.',
  accesorios:  'Accesorios de moda para dama. Bolsas, cinturones y más desde León, Guanajuato. Envíos a todo México.',
}

function mostrarConFiltros(baseLista, titulo, catPreset, urlPath) {
  document.documentElement.classList.remove('ruta-interna', 'ruta-home')
  document.documentElement.classList.add('ruta-categoria')
  const pagina = document.getElementById('pagina-interna'); if (pagina) pagina.style.display='none'
  const hero = document.getElementById('hero-section'); if (hero) hero.style.setProperty('display','none','important')
  const cats = document.querySelector('.section'); if (cats) cats.style.display='none'
  const banner = document.querySelector('.banner-mayoreo'); if (banner) banner.style.display='none'
  const strip = document.querySelector('.cro-trust-strip'); if (strip) strip.style.display='none'
  document.getElementById('productos-section').style.setProperty('display','block','important')
  _filtroBase = baseLista
  _filtros = { categoria: catPreset || '', tallas: [], colores: [], precioRango: null, ocasion: [] }
  document.getElementById('productos-titulo').innerHTML = titulo
  _construirChipsFiltro()
  document.getElementById('filtros-bar').classList.add('visible')
  const panel = document.getElementById('filtros-panel'); if (panel) panel.classList.remove('open')
  aplicarFiltros()
  window.scrollTo(0, 0); document.documentElement.scrollTop = 0; document.body.scrollTop = 0
  requestAnimationFrame(function(){ window.scrollTo(0, 0); document.documentElement.scrollTop = 0; document.body.scrollTop = 0 })
  if (urlPath) history.pushState({}, '', urlPath)

  // ── SEO dinámico por categoría ──────────────────────────────────────────
  const _cat = catPreset?.toLowerCase() || ''
  const _setOg = (title, desc, url) => {
    let og = document.querySelector('meta[property="og:title"]'); if (og) og.content = title
    let ogd = document.querySelector('meta[property="og:description"]'); if (ogd) ogd.content = desc
    let ogu = document.querySelector('meta[property="og:url"]'); if (ogu) ogu.content = url
  }
  if (_SEO_TITLES[_cat]) {
    document.title = _SEO_TITLES[_cat]
    let _metaDesc = document.querySelector('meta[name="description"]')
    if (_metaDesc) _metaDesc.setAttribute('content', _SEO_DESCRIPTIONS[_cat] || '')
    _setOg(_SEO_TITLES[_cat], _SEO_DESCRIPTIONS[_cat] || '', `https://zapatillasmay.mx/${_cat}`)
  } else if (urlPath === '/ofertas') {
    const _t = 'Ofertas de Calzado para Dama | Zapatillas May — León, Guanajuato'
    const _d = 'Zapatos de moda para dama en oferta. Directo del fabricante en León, Guanajuato. Envíos a todo México.'
    document.title = _t
    let _metaDesc = document.querySelector('meta[name="description"]')
    if (_metaDesc) _metaDesc.setAttribute('content', _d)
    _setOg(_t, _d, 'https://zapatillasmay.mx/ofertas')
  } else if (urlPath === '/#catalogo') {
    const _t = 'Catálogo Completo de Calzado para Dama | Zapatillas May — León, Gto.'
    const _d = 'Todo el catálogo de calzado femenino de moda. Directo del fabricante en León, Guanajuato. Envíos a todo México.'
    document.title = _t
    let _metaDesc = document.querySelector('meta[name="description"]')
    if (_metaDesc) _metaDesc.setAttribute('content', _d)
    _setOg(_t, _d, 'https://zapatillasmay.mx/')
  } else {
    const _t = 'Calzado de Dama | Envíos a todo México | Zapatillas May León'
    const _d = 'Calzado de moda para dama. Tacones, sandalias, botas y botines. Hecho en León, Guanajuato.'
    document.title = _t
    _setOg(_t, _d, 'https://zapatillasmay.mx/')
  }
}

function _construirChipsFiltro() {
  // Categorías presentes en la base (sin pre-filtrar por categoría)
  const baseCats = _filtros.categoria ? productos.filter(p=>p.activo) : _filtroBase
  const catsPresentes = [...new Set(baseCats.map(p=>p.categoria).filter(Boolean))]
  const fcCat = document.getElementById('fc-categoria')
  if (fcCat) {
    fcCat.innerHTML = catsPresentes.map(c =>
      `<div class="filtro-chip ${_filtros.categoria===c?'active':''}" role="button" tabindex="0" onclick="_toggleCat('${c}')" onkeydown="if(event.key==='Enter'||event.key===' ') _toggleCat('${c}')">${_CAT_LABELS[c]||c}</div>`
    ).join('')
    document.getElementById('fg-categoria').style.display = catsPresentes.length > 1 ? '' : 'none'
  }
  // Ocasión presente en la base (campo directo del producto, no requiere índice de variantes)
  const ocasionSet = new Set()
  _filtroBase.forEach(p => { (p.ocasion || []).forEach(o => ocasionSet.add(o)) })
  const fcOcasion = document.getElementById('fc-ocasion')
  if (fcOcasion) {
    fcOcasion.innerHTML = [...ocasionSet].map(o =>
      `<div class="filtro-chip ${_filtros.ocasion.includes(o)?'active':''}" role="button" tabindex="0" onclick="_toggleOcasion('${o}')" onkeydown="if(event.key==='Enter'||event.key===' ') _toggleOcasion('${o}')">${_OCASION_LABELS[o]||o}</div>`
    ).join('')
    const fgOcasion = document.getElementById('fg-ocasion')
    if (fgOcasion) fgOcasion.style.display = ocasionSet.size ? '' : 'none'
  }
  // Tallas presentes en la base
  const tallasSet = new Set()
  _filtroBase.forEach(p => { if(_idxTallas[p.id]) _idxTallas[p.id].forEach(t => tallasSet.add(t)) })
  const tallas = [...tallasSet].sort((a,b)=>{
    const ia=_ORDEN_TALLAS.indexOf(a), ib=_ORDEN_TALLAS.indexOf(b)
    return (ia<0?99:ia)-(ib<0?99:ib)
  })
  const fcTalla = document.getElementById('fc-talla')
  fcTalla.innerHTML = tallas.map(t =>
    `<div class="filtro-chip ${_filtros.tallas.includes(t)?'active':''}" role="button" tabindex="0" onclick="_toggleTalla('${t}')" onkeydown="if(event.key==='Enter'||event.key===' ') _toggleTalla('${t}')">${t}</div>`
  ).join('')
  document.getElementById('fg-talla').style.display = tallas.length ? '' : 'none'
  // Colores presentes (deduplicados case-insensitive)
  const keysSet = new Set()
  _filtroBase.forEach(p => { const cs=_idxColores[p.id]; if(cs) cs.forEach(k=>keysSet.add(k)) })
  const colores = [...keysSet].sort((a,b)=> _colorMeta[a].display.localeCompare(_colorMeta[b].display))
  const fcColor = document.getElementById('fc-color')
  fcColor.innerHTML = colores.map(k => {
    const m = _colorMeta[k]
    return `<div class="filtro-chip ${_filtros.colores.includes(k)?'active':''}" role="button" tabindex="0" onclick="_toggleColor(this.dataset.c)" onkeydown="if(event.key==='Enter'||event.key===' ') _toggleColor(this.dataset.c)" data-c="${k.replace(/"/g,'&quot;')}"><span class="chip-dot" style="background:${m.hex}"></span>${m.display}</div>`
  }).join('')
  document.getElementById('fg-color').style.display = colores.length ? '' : 'none'
  // Precio
  document.getElementById('fc-precio').innerHTML = _RANGOS_PRECIO.map((r,i) =>
    `<div class="filtro-chip ${_filtros.precioRango===i?'active':''}" role="button" tabindex="0" onclick="_togglePrecio(${i})" onkeydown="if(event.key==='Enter'||event.key===' ') _togglePrecio(${i})">${r.label}</div>`
  ).join('')
}

function _toggleCat(c){ _filtros.categoria = _filtros.categoria===c?'':c; _construirChipsFiltro(); aplicarFiltros() }
function _toggleOcasion(o){ const i=_filtros.ocasion.indexOf(o); if(i<0)_filtros.ocasion.push(o); else _filtros.ocasion.splice(i,1); _construirChipsFiltro(); aplicarFiltros() }
function _toggleTalla(t){ const i=_filtros.tallas.indexOf(t); if(i<0)_filtros.tallas.push(t); else _filtros.tallas.splice(i,1); _construirChipsFiltro(); aplicarFiltros() }
function _toggleColor(c){ const i=_filtros.colores.indexOf(c); if(i<0)_filtros.colores.push(c); else _filtros.colores.splice(i,1); _construirChipsFiltro(); aplicarFiltros() }
function _togglePrecio(i){ _filtros.precioRango = _filtros.precioRango===i?null:i; _construirChipsFiltro(); aplicarFiltros() }

function _actualizarContador(){
  const n = _filtros.tallas.length + _filtros.colores.length + _filtros.ocasion.length + (_filtros.categoria?1:0) + (_filtros.precioRango!==null?1:0)
  const badge = document.getElementById('fb-count')
  if (!badge) return
  if (n>0){ badge.style.display=''; badge.textContent=n } else badge.style.display='none'
}

function aplicarFiltros() {
  let lista = _filtroBase.slice()
  if (_filtros.categoria) lista = lista.filter(p => p.categoria === _filtros.categoria)
  if (_filtros.ocasion.length) lista = lista.filter(p => (p.ocasion || []).some(o => _filtros.ocasion.includes(o)))
  if (_filtros.tallas.length) lista = lista.filter(p => { const ts=_idxTallas[p.id]; return ts && _filtros.tallas.some(t=>ts.has(t)) })
  if (_filtros.colores.length) lista = lista.filter(p => { const cs=_idxColores[p.id]; return cs && _filtros.colores.some(c=>cs.has(c)) })
  if (_filtros.precioRango!==null){ const r=_RANGOS_PRECIO[_filtros.precioRango]; lista = lista.filter(p=>{const pr=_precioDe(p); return pr>=r.min && pr<r.max}) }
  const ordenEl = document.getElementById('filtros-orden')
  const orden = ordenEl ? ordenEl.value : 'relevancia'
  if (orden==='precio-asc') lista.sort((a,b)=>_precioDe(a)-_precioDe(b))
  else if (orden==='precio-desc') lista.sort((a,b)=>_precioDe(b)-_precioDe(a))
  else if (orden==='nuevos') lista.sort((a,b)=>new Date(b.created_at||0)-new Date(a.created_at||0))
  const resEl = document.getElementById('filtros-resultado')
  if (resEl) resEl.textContent = `${lista.length} ${lista.length===1?'modelo':'modelos'}`
  _actualizarContador()
  renderProductos(lista)
}

function toggleFiltros(){ const p=document.getElementById('filtros-panel'); if(p) p.classList.toggle('open') }
function limpiarFiltros(){ _filtros.tallas=[]; _filtros.colores=[]; _filtros.precioRango=null; _filtros.ocasion=[]; const o=document.getElementById('filtros-orden'); if(o)o.value='relevancia'; _construirChipsFiltro(); aplicarFiltros() }

  function scrollToProductos() {
    document.getElementById('productos-section').scrollIntoView({behavior:'smooth', block:'start'})
  }

  function irACheckout() {
    if (!carrito.length) { mostrarToast('Tu carrito esta vacio'); return }
    window.location.href = '/checkout'
  }

function toggleNavDD() {
  const dd = document.getElementById('nav-dd-cat');
  const btn = dd.querySelector('.nav-dd-btn');
  const isOpen = dd.classList.toggle('open');
  btn.setAttribute('aria-expanded', isOpen);
}
function cerrarNavDD() {
  const dd = document.getElementById('nav-dd-cat');
  if (dd) { dd.classList.remove('open'); dd.querySelector('.nav-dd-btn').setAttribute('aria-expanded','false'); }
}
document.addEventListener('click', function(e) {
  const dd = document.getElementById('nav-dd-cat');
  if (dd && !dd.contains(e.target)) cerrarNavDD();
});

function toggleMenu() {
  const menu = document.getElementById('mobile-menu')
  const panel = document.getElementById('mobile-menu-panel')
  const overlay = document.getElementById('mobile-menu-overlay')
  const iconMenu = document.getElementById('icon-menu')
  const iconClose = document.getElementById('icon-close')
  const banner = document.getElementById('promo-banner')
  if (banner) banner.style.zIndex = '1'
  
  if (menu.dataset.open === '1') {
    cerrarMenu()
    return
  }
  
  menu.style.display = 'block'
  menu.style.pointerEvents = 'auto'
  
  // Forzar reflow antes de animar
  panel.getBoundingClientRect()
  
  setTimeout(() => {
    panel.style.transform = 'translateX(0)'
    if (overlay) overlay.style.opacity = '1'
  }, 10)
  
  menu.dataset.open = '1'
  if (iconMenu) iconMenu.style.display = 'none'
  if (iconClose) iconClose.style.display = 'block'
  document.body.style.overflow = 'hidden'
}

function cerrarMenu() {
  const menu = document.getElementById('mobile-menu')
  const panel = document.getElementById('mobile-menu-panel')
  const overlay = document.getElementById('mobile-menu-overlay')
  const iconMenu = document.getElementById('icon-menu')
  const iconClose = document.getElementById('icon-close')
  const banner = document.getElementById('promo-banner')
  if (banner) banner.style.zIndex = '101'
  
  if (!menu) return
  panel.style.transform = 'translateX(100%)'
  if (overlay) overlay.style.opacity = '0'
  menu.dataset.open = '0'
  if (iconMenu) iconMenu.style.display = 'block'
  if (iconClose) iconClose.style.display = 'none'
  document.body.style.overflow = ''
  
  setTimeout(() => {
    menu.style.display = 'none'
    menu.style.pointerEvents = 'none'
  }, 300)
}
// ── Sesión de cliente (solo para colorear el btn-cuenta) ─────────
let usuarioActual = null
const _usuarioGuardado = localStorage.getItem('usuario')
if (_usuarioGuardado) { try { usuarioActual = JSON.parse(_usuarioGuardado) } catch(e) {} }

function actualizarBtnCuenta() {
  const btn = document.getElementById('btn-cuenta')
  if (!btn) return
  if (usuarioActual) { btn.style.color = 'var(--pink)'; btn.title = usuarioActual.nombre }
  else { btn.style.color = ''; btn.title = 'Mi cuenta' }
}
actualizarBtnCuenta()

// ── (Eliminado: modal auth — ahora en /mi-cuenta) ────────────────

// cerrarAuth eliminado

// (funciones de modal auth eliminadas — ahora en /mi-cuenta)


function navegarInicio() {
  mostrarInicio()
  setTimeout(() => {
    const el = document.getElementById('productos-section')
    if (el) {
      el.style.display = 'block'
      window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' })
    }
  }, 500)
}


// Auto-relleno de código de referido desde URL ?ref=XXXX
;(function() {
  const ref = new URLSearchParams(window.location.search).get('ref')
  if (ref) {
    localStorage.setItem('ref_pendiente', ref.toUpperCase())
    // Limpiar la URL sin recargar
    const url = new URL(window.location)
    url.searchParams.delete('ref')
    history.replaceState({}, '', url)
  }
})()

function _aplicarRefPendiente() {
  const ref = localStorage.getItem('ref_pendiente')
  const campo = document.getElementById('reg-referido')
  if (ref && campo && !campo.value) {
    campo.value = ref
    validarCodigoReferido(ref)
  }
}
  window._initPromise = inicializar()
  
