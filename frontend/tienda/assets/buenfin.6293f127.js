/* Buen Fin: promocion con fechas y modelos que se administran desde el panel.
   Mientras esta activa, todos los pares de los modelos participantes se cobran al precio de 3+ pares desde el primer par. */
(function () {
  var API = 'https://zapatillasmay-production.up.railway.app'
  var KEY = 'zm_buenfin_v1'
  var estado = { activa: false, ids: [], inicio: '', fin: '', descuento: 100 }
  var ids = {}
  function aplicar(e) {
    estado = e || estado
    ids = {}
    ;(estado.ids || []).forEach(function (x) { ids[String(x)] = 1 })
    document.documentElement.classList.toggle('zm-buenfin', !!estado.activa)
  }
  try {
    var c = JSON.parse(sessionStorage.getItem(KEY) || 'null')
    if (c && Date.now() - c.t < 60000) aplicar(c.e)
  } catch (e) {}

  window.zmBuenFin = {
    activa: function () { return !!estado.activa },
    esModelo: function (id) { return !!(estado.activa && ids[String(id)]) },
    estado: function () { return estado },
    listo: null
  }
  /* Precio Buen Fin. TODA la tienda cobra el precio de 3+ pares (web - $60) desde el primer par mientras dura la promocion.
     Los modelos elegidos en el panel llevan ademas el descuento especial (estado.descuento, en pesos contra el precio web),
     sin bajar de su precio de corrida + $50. Los modelos que ya estan en oferta conservan su precio de oferta. */
  function calcular(web, corrida, elegido) {
    var general = web - 60
    if (!elegido) return general
    var d = parseFloat(estado.descuento) || 100
    var piso = (corrida > 0 ? corrida + 50 : 0)
    return Math.min(general, Math.max(web - d, piso))
  }
  /* Item del carrito: devuelve el precio por par o null si no aplica. */
  window.zmBuenFinPrecio = function (item) {
    if (!estado.activa || !item || item.es_oferta || item.es_corrida || item.mp) return null
    var web = parseFloat(item.precio_menudeo)
    if (!(web > 0)) return null
    var corr = parseFloat(item.precio_corrida) || 0
    return calcular(web, corr, !!ids[String(item.producto_id)])
  }
  /* Producto del catalogo (precio_menudeo = precio base del panel): {web, bf, especial} o null si no aplica. */
  window.zmBuenFinProducto = function (p) {
    if (!estado.activa || !p || p.es_oferta) return null
    var base = parseFloat(p.precio_menudeo)
    if (!(base > 0)) return null
    var web = base + 80
    var corr = parseFloat(p.precio_corrida) || (base - 100)
    var esp = !!ids[String(p.id)]
    return { web: web, bf: calcular(web, corr, esp), especial: esp }
  }

  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  function fechaTxt(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s || ''))
    return m ? (parseInt(m[3], 10) + ' de ' + MESES[parseInt(m[2], 10) - 1]) : ''
  }

  function popup() {
    if (!estado.activa || /^\/(checkout|success|pedido-)/.test(location.pathname)) return
    try { if (localStorage.getItem('zm_bf_popup') === estado.inicio) return } catch (e) {}
    if (document.getElementById('zm-bf-pop')) return
    var rango = fechaTxt(estado.inicio) && fechaTxt(estado.fin) ? 'Del ' + fechaTxt(estado.inicio) + ' al ' + fechaTxt(estado.fin) : 'Por tiempo limitado'
    var d = document.createElement('div')
    d.id = 'zm-bf-pop'
    d.setAttribute('role', 'dialog')
    d.setAttribute('aria-modal', 'true')
    d.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(42,26,14,0.55);display:flex;align-items:center;justify-content:center;padding:20px;font-family:Outfit,sans-serif'
    d.innerHTML = '<div style="background:#FBF7F3;max-width:420px;width:100%;border-radius:20px;padding:30px 26px 24px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.35);position:relative">' +
      '<button id="zm-bf-x" aria-label="Cerrar" style="position:absolute;top:10px;right:14px;background:none;border:none;font-size:1.5rem;line-height:1;color:#8B6A54;cursor:pointer">&times;</button>' +
      '<p style="margin:0 0 6px;font-size:0.72rem;letter-spacing:0.16em;text-transform:uppercase;color:#b5687a;font-weight:700">' + rango + '</p>' +
      '<h2 style="margin:0 0 10px;font-family:\'Cormorant Garamond\',serif;font-size:2.1rem;line-height:1.1;color:#2A1A0E;font-weight:600">Buen Fin <em style="color:#b5687a">Zapatillas May</em></h2>' +
      '<p style="margin:0 0 18px;font-size:0.95rem;line-height:1.5;color:#5a4030">Durante el Buen Fin, <b>todos los pares tienen precio especial desde el primer par</b>: no necesitas comprar 3. Además, <b>tenemos modelos con precios especiales</b> solo por el Buen Fin.</p>' +
      '<a href="/buen-fin" style="display:inline-block;background:#2A1A0E;color:#fff;text-decoration:none;padding:13px 28px;border-radius:100px;font-weight:600;font-size:0.88rem">Ver modelos con precios especiales</a>' +
      '<div><button id="zm-bf-c" style="margin-top:10px;background:none;border:none;color:#8B6A54;font-size:0.8rem;cursor:pointer;text-decoration:underline">Seguir viendo la tienda</button></div></div>'
    function cerrar() { try { localStorage.setItem('zm_bf_popup', estado.inicio) } catch (e) {} d.remove() }
    d.addEventListener('click', function (ev) { if (ev.target === d) cerrar() })
    document.body.appendChild(d)
    document.getElementById('zm-bf-x').onclick = cerrar
    document.getElementById('zm-bf-c').onclick = cerrar
  }

  var st = document.createElement('style')
  st.textContent = '.zm-bf-solo{display:none!important}html.zm-buenfin .zm-bf-solo{display:inline-flex!important}' +
    '.zm-bf-tag{display:inline-block;background:#b5687a;color:#fff;font-size:0.62rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;padding:3px 8px;border-radius:100px;margin-left:6px;vertical-align:middle}'
  document.head.appendChild(st)

  window.zmBuenFin.listo = fetch(API + '/buen-fin/estado').then(function (r) { return r.json() }).then(function (e) {
    var cambio = JSON.stringify(e) !== JSON.stringify(estado)
    aplicar(e)
    try { sessionStorage.setItem(KEY, JSON.stringify({ t: Date.now(), e: e })) } catch (x) {}
    if (cambio) { try { window.dispatchEvent(new Event('zm-buenfin')) } catch (x) {} }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', popup); else popup()
  }).catch(function () {})
})()
