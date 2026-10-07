// Carrito ÚNICO: productos del negocio + de tiendas aliadas (marketplace). Lo cargan el carrito, el pago y la ficha de marketplace.
// Reglas (el servidor las recalcula todas al cobrar; esto es solo para mostrarlas igual en pantalla):
//  · El descuento de 3+ pares es CRUZADO: cuentan todos los pares del carrito, de cualquier tienda (cada producto usa su propio precio de 3+ pares).
//  · El envío gratis se ACUMULA: cuenta el subtotal de todo el carrito (desde el monto de la configuración de envío, hoy $1,299).
//  · 3+ pares de 2 o más orígenes: el negocio recibe todo y envía un solo paquete (tarifa normal por pares). Si no, cada tienda envía lo suyo
//    (el negocio con su tarifa y cada tienda con el envío que puso).
(function () {
  var API = 'https://zapatillasmay-production.up.railway.app'
  window.zmEsMp = function (i) { return !!(i && i.mp) }
  window.zmCarritoTieneMp = function (c) { return (c || []).some(window.zmEsMp) }

  // Devuelve el envío con las reglas del marketplace, o null si el carrito no trae productos de tiendas aliadas (la página usa su cálculo de siempre).
  window.zmEnvioCarrito = function (carrito, pares, subtotal, cfg, calcPrecio) {
    var mp = (carrito || []).filter(window.zmEsMp)
    if (!mp.length) return null
    if (subtotal >= cfg.gratis_desde) return 0
    var neg = carrito.filter(function (i) { return !i.mp })
    var tier = function (p) { return p >= 3 ? cfg.tier3 : p >= 2 ? cfg.tier2 : cfg.tier1 }
    var vend = {}
    mp.forEach(function (i) { vend[i.vendedor_id] = Math.max(vend[i.vendedor_id] || 0, Number(i.envio_mp) || 0) })
    var origenes = Object.keys(vend).length + (neg.length ? 1 : 0)
    if (pares >= 3 && origenes >= 2) return tier(pares)
    var envio = 0
    if (neg.length) {
      var paresNeg = neg.reduce(function (s, i) { return s + i.cantidad }, 0)
      var subNeg = neg.reduce(function (s, i) { return s + calcPrecio(i, pares) * i.cantidad }, 0)
      envio += subNeg >= cfg.gratis_desde ? 0 : tier(paresNeg)
    }
    Object.keys(vend).forEach(function (v) { envio += vend[v] })
    return envio
  }

  // Texto que explica las reglas cruzadas (se muestra cuando el carrito trae productos de tiendas aliadas)
  window.zmNotaCruzada = function (cfg) {
    return '🤝 Tu carrito junta productos de tiendas aliadas: <b>los pares se suman para el descuento de 3+ pares</b> y <b>el total se suma para el envío gratis desde $' +
      Number(cfg.gratis_desde).toLocaleString('es-MX') + '</b>, sin importar de qué tienda sea cada uno. Con 3+ pares de varias tiendas, nosotros lo recibimos y te lo enviamos en un solo paquete.'
  }

  // Trae precios, envío y existencias actuales de los productos de tiendas aliadas del carrito (si algo ya no está, se quita).
  // Devuelve true si cambió algo del carrito guardado.
  window.zmRefrescarMp = async function () {
    try {
      var items = JSON.parse(localStorage.getItem('zm_carrito') || '[]')
      var slugs = {}
      items.forEach(function (i) { if (i.mp && i.mp_slug) slugs[i.mp_slug] = 1 })
      var lista = Object.keys(slugs)
      if (!lista.length) return false
      var det = {}
      await Promise.all(lista.map(async function (s) {
        try { var r = await fetch(API + '/marketplace/productos/' + encodeURIComponent(s)); det[s] = r.ok ? await r.json() : null } catch (e) { det[s] = undefined }
      }))
      var cambio = false, quitados = 0
      var nuevos = items.filter(function (i) {
        if (!i.mp) return true
        var d = det[i.mp_slug]
        if (d === undefined) return true            // sin red: se deja como está
        var v = d && (d.mp_variantes || []).find(function (x) { return x.id === i.variante_id })
        if (!d || !v) { quitados++; cambio = true; return false }
        var campos = { precio_menudeo: d.precio, precio_mayoreo3: d.precio_mayoreo3, precio_corrida: d.precio, es_oferta: false, envio_mp: d.envio, stock_mp: v.stock }
        Object.keys(campos).forEach(function (k) { if (i[k] !== campos[k]) { i[k] = campos[k]; cambio = true } })
        if (i.cantidad > v.stock) { i.cantidad = v.stock; cambio = true }
        return i.cantidad > 0
      })
      if (cambio) localStorage.setItem('zm_carrito', JSON.stringify(nuevos))
      window._mpQuitados = quitados
      return cambio
    } catch (e) { return false }
  }
})()
