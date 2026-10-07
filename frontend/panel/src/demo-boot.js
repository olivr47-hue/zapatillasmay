// ═══ MODO DEMO del panel ═════════════════════════════════════════════════════════════════════════════════════════════
// Se activa con  https://portal.zapatillasmay.mx/?demo=1  (queda activo en esa pestaña). Todo corre en el navegador:
//  · NO se conecta al servidor ni a la base de datos: las llamadas a /api las contesta `demo-api.js` con datos inventados.
//  · Lo que el visitante cambie vive solo en esa pestaña (se pierde al recargar). Nada se guarda ni se envía a nadie.
//  · El almacenamiento local va con otro prefijo, así que nunca toca la sesión real del negocio.
const _p = new URLSearchParams(location.search)
let _demo = false
try {
  if (_p.get('demo') === '1') sessionStorage.setItem('zm_demo', '1')
  if (_p.get('demo') === '0') sessionStorage.removeItem('zm_demo')
  _demo = sessionStorage.getItem('zm_demo') === '1'
} catch (e) { _demo = _p.get('demo') === '1' }

if (_demo) {
  window.__ZM_DEMO = true
  // 1) almacenamiento aparte (prefijo) para no mezclar con la sesión real
  const P = 'demo:'
  const S = Storage.prototype
  const g = S.getItem, s = S.setItem, r = S.removeItem
  S.getItem = function (k) { return this === localStorage ? g.call(this, P + k) : g.call(this, k) }
  S.setItem = function (k, v) { return this === localStorage ? s.call(this, P + k, v) : s.call(this, k, v) }
  S.removeItem = function (k) { return this === localStorage ? r.call(this, P + k) : r.call(this, k) }
  // 2) sesión de administrador ficticia
  const emp = { id: 'emp-1', nombre: 'Administrador (demo)', email: 'admin@demo.com', rol: 'admin', token: 'demo-token', permisos: {} }
  localStorage.setItem('erp_empleado', JSON.stringify(emp))
  localStorage.setItem('erp_token', 'demo-token')
  localStorage.setItem('zm_push_panel_dismissed', '1')
  localStorage.setItem('zm_install_dismissed', String(Date.now()))
  // 3) servidor falso
  // (sin await de nivel superior: el servidor falso se carga aparte y las llamadas esperan a que esté listo)
  window.__fetchReal = window.fetch.bind(window)
  const _listo = import('./demo-api.js')
  window.fetch = async (input, init) => (await _listo).responderDemo(input, init)
  // 4) sin analítica ni notificaciones reales
  window['ga-disable-G-QX8MK3D4RY'] = true
  window.__zmInterno = true
  // la demo no muestra Marketplace ni Renta del sistema (son del negocio, no del sistema que se renta)
  const est = document.createElement('style')
  est.textContent = '[data-modulo="marketplace"],[data-modulo="prospectos"],[data-modulo="editor-visual"]{display:none!important}'
  document.head.appendChild(est)
  // enlaces a los archivos reales del negocio (sitemap, feeds...) no se ofrecen en la demo
  const limpiarEnlaces = () => document.querySelectorAll('a[href*="zapatillasmay"]').forEach(a => { if (!a.closest('#zm-demo-banner')) { a.removeAttribute('href'); a.style.cursor = 'default' } })
  new MutationObserver(limpiarEnlaces).observe(document.documentElement, { childList: true, subtree: true })
  // 5) cinta superior
  const poner = () => {
    if (document.getElementById('zm-demo-banner')) return
    const b = document.createElement('div')
    b.id = 'zm-demo-banner'
    b.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:99990;background:#2A1A0E;color:#fff;font:600 13px DM Sans,sans-serif;padding:8px 14px;display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:wrap;text-align:center'
    b.innerHTML = '🧪 <span>Demo con datos inventados: puedes tocar todo, nada se guarda ni se envía.</span> <a href="https://zapatillasmay.mx/vender#sistema" style="color:#E91E8C;text-decoration:none;border:1px solid #E91E8C;border-radius:50px;padding:3px 12px">Quiero este sistema</a> <button id="zm-demo-reset" style="background:none;border:1px solid #888;color:#ddd;border-radius:50px;padding:3px 12px;cursor:pointer;font:inherit">Reiniciar demo</button>'
    document.body.appendChild(b)
    document.getElementById('zm-demo-reset').onclick = () => { try { sessionStorage.setItem('zm_demo', '1') } catch (e) {} ; location.href = location.pathname + '?demo=1' }
    document.body.style.paddingBottom = '44px'
  }
  if (document.body) poner(); else document.addEventListener('DOMContentLoaded', poner)
  setInterval(poner, 3000)
}
export default _demo
