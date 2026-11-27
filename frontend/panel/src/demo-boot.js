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
  est.textContent = '[data-modulo="marketplace"],[data-modulo="prospectos"],[data-modulo="editor-visual"]{display:none!important}#sidebar{padding-bottom:56px!important;box-sizing:border-box}#sidebar nav,#sidebar .sidebar-nav{padding-bottom:56px}'
  document.head.appendChild(est)
  // enlaces a los archivos reales del negocio (sitemap, feeds...) no se ofrecen en la demo
  const limpiarEnlaces = () => document.querySelectorAll('a[href*="zapatillasmay"]').forEach(a => { if (!a.closest('#zm-demo-banner')) { a.removeAttribute('href'); a.style.cursor = 'default' } })
  new MutationObserver(limpiarEnlaces).observe(document.documentElement, { childList: true, subtree: true })
  // 5) aviso de demo: sale al entrar, se puede cerrar con la X (queda cerrado mientras dure la pestaña) y deja una burbuja 🧪 para volver a abrirlo
  const _cerrado = () => { try { return sessionStorage.getItem('zm_demo_banner_cerrado') === '1' } catch (e) { return false } }
  const _estilo = document.createElement('style')
  _estilo.textContent = '@media (max-width:640px){#zm-demo-banner{padding:8px 38px 8px 12px!important;font-size:12px!important;gap:6px!important;justify-content:flex-start!important;text-align:left!important}#zm-demo-banner .zm-d-txt{flex:1 1 100%}}'
  document.head.appendChild(_estilo)
  const quitar = (id) => { const e = document.getElementById(id); if (e) e.remove() }
  const poner = () => {
    if (_cerrado()) {
      quitar('zm-demo-banner'); document.body.style.paddingBottom = ''
      if (!document.getElementById('zm-demo-chip')) {
        const c = document.createElement('button')
        c.id = 'zm-demo-chip'; c.title = 'Demo con datos inventados: tocar para ver el aviso'; c.textContent = '🧪'
        c.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:99990;width:38px;height:38px;border-radius:50%;border:none;background:#2A1A0E;color:#fff;font-size:18px;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.25)'
        c.onclick = () => { try { sessionStorage.removeItem('zm_demo_banner_cerrado') } catch (e) {} quitar('zm-demo-chip'); poner() }
        document.body.appendChild(c)
      }
      return
    }
    quitar('zm-demo-chip')
    if (document.getElementById('zm-demo-banner')) return
    const b = document.createElement('div')
    b.id = 'zm-demo-banner'
    b.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:99990;background:#2A1A0E;color:#fff;font:600 13px DM Sans,sans-serif;padding:8px 40px 8px 14px;display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:wrap;text-align:center'
    b.innerHTML = '🧪 <span class="zm-d-txt">Demo con datos inventados: puedes tocar todo, nada se guarda ni se envía.</span> <a href="https://zapatillasmay.mx/vender#sistema" style="color:#E91E8C;text-decoration:none;border:1px solid #E91E8C;border-radius:50px;padding:3px 12px">Quiero este sistema</a> <button id="zm-demo-reset" style="background:none;border:1px solid #888;color:#ddd;border-radius:50px;padding:3px 12px;cursor:pointer;font:inherit">Reiniciar demo</button><button id="zm-demo-x" title="Cerrar aviso" aria-label="Cerrar aviso" style="position:absolute;right:6px;top:50%;transform:translateY(-50%);width:30px;height:30px;border-radius:50%;border:none;background:rgba(255,255,255,.14);color:#fff;font-size:15px;cursor:pointer">✕</button>'
    document.body.appendChild(b)
    document.getElementById('zm-demo-reset').onclick = () => { try { sessionStorage.setItem('zm_demo', '1'); sessionStorage.removeItem('zm_demo_banner_cerrado') } catch (e) {} ; location.href = location.pathname + '?demo=1' }
    document.getElementById('zm-demo-x').onclick = () => { try { sessionStorage.setItem('zm_demo_banner_cerrado', '1') } catch (e) {} poner() }
    document.body.style.paddingBottom = b.offsetHeight + 'px'
  }
  if (document.body) poner(); else document.addEventListener('DOMContentLoaded', poner)
  setInterval(poner, 3000)
  setInterval(() => { const x = document.getElementById('tk-precios'); if (x && x.parentElement) { const c = x.closest('div[style*="border-radius:14px"]'); if (c) c.style.display = 'none' } }, 800)
}
export default _demo
