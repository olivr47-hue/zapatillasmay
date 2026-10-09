// ═══ Campanita de avisos del panel ═════════════════════════════════════════════════════════════════════════
// Antes el panel avisaba con sonido o con una notificación del sistema, pero el aviso desaparecía y no había dónde verlo después
// («suena y no veo dónde»). Aquí queda la lista de los avisos de los últimos 3 días (mensajes de clientas, comprobantes, pedidos,
// alertas de conexiones...) con un número rojo de los que no has visto. Al tocar uno te lleva a la sección.
const API = '/api'
const esc = (v) => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
let AVISOS = []
const visto = () => { try { return localStorage.getItem('zm_avisos_visto') || '' } catch (e) { return '' } }
const marcarVisto = () => { try { localStorage.setItem('zm_avisos_visto', new Date().toISOString()) } catch (e) {} }
const nuevos = () => { const v = visto(); return AVISOS.filter(a => !v || a.created_at > v).length }

function hace(iso) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'ahora'
  if (s < 3600) return Math.floor(s / 60) + ' min'
  if (s < 86400) return Math.floor(s / 3600) + ' h'
  return Math.floor(s / 86400) + ' d'
}

function pintarBadge() {
  const b = document.getElementById('campana-badge')
  if (!b) return
  const n = nuevos()
  b.textContent = n > 9 ? '9+' : String(n)
  b.style.display = n ? 'flex' : 'none'
}

async function cargar() {
  if (!localStorage.getItem('erp_token') && !window._empleadoActual) return
  try {
    const r = await fetch(API + '/push/panel-recientes')
    if (!r.ok) return
    const l = await r.json()
    AVISOS = Array.isArray(l) ? l : []
    pintarBadge()
    if (document.getElementById('campana-lista')) pintarLista()
  } catch (e) {}
}

function pintarLista() {
  const el = document.getElementById('campana-lista')
  if (!el) return
  const v = visto()
  el.innerHTML = AVISOS.length ? AVISOS.map((a, i) => `
    <div onclick="campanaIr(${i})" style="display:flex;gap:10px;padding:10px 14px;border-bottom:1px solid #f1f5f9;cursor:pointer;${(!v || a.created_at > v) ? 'background:#fff7fb' : ''}">
      <div style="flex:1;min-width:0">
        <div style="font-size:0.8rem;font-weight:700;color:#0f172a">${esc(a.titulo)}</div>
        <div style="font-size:0.76rem;color:#475569;margin-top:1px;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">${esc(a.cuerpo)}</div>
      </div>
      <div style="font-size:0.68rem;color:#94a3b8;flex-shrink:0">${hace(a.created_at)}</div>
    </div>`).join('') : '<p style="padding:24px 14px;text-align:center;color:#94a3b8;font-size:0.8rem;margin:0">Sin avisos en los últimos 3 días.</p>'
}

window.campanaIr = (i) => {
  const a = AVISOS[i]
  document.getElementById('campana-panel')?.remove()
  if (!a) return
  try {
    const u = new URL(a.url || '/', location.origin)
    const mod = u.searchParams.get('modulo')
    if (mod && typeof window.navegarA === 'function') window.navegarA(mod)
  } catch (e) {}
}

window.campanaAbrir = async () => {
  const previo = document.getElementById('campana-panel')
  if (previo) { previo.remove(); return }
  const p = document.createElement('div')
  p.id = 'campana-panel'
  p.style.cssText = 'position:fixed;top:52px;right:12px;width:min(360px,calc(100vw - 24px));max-height:70vh;display:flex;flex-direction:column;background:#fff;border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,0.22);z-index:2000;overflow:hidden'
  p.innerHTML = `<div style="padding:12px 14px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center">
      <strong style="font-size:0.88rem;color:#0f172a">🔔 Avisos recientes</strong>
      <span style="font-size:0.68rem;color:#94a3b8">últimos 3 días</span></div>
    <div id="campana-lista" style="overflow:auto"><p style="padding:20px;text-align:center;color:#94a3b8;font-size:0.8rem;margin:0">Cargando…</p></div>`
  document.body.appendChild(p)
  setTimeout(() => document.addEventListener('click', function cerrar(e) {
    if (!document.getElementById('campana-panel')) return document.removeEventListener('click', cerrar)
    if (!e.target.closest('#campana-panel') && !e.target.closest('#btn-campana')) { document.getElementById('campana-panel')?.remove(); document.removeEventListener('click', cerrar) }
  }), 0)
  await cargar()
  pintarLista()
  marcarVisto()      // se marcan como vistos al abrir (el rosa de «nuevo» se queda en esta apertura)
  pintarBadge()
}

function asegurarBoton() {
  const cont = document.querySelector('.topbar-actions')
  if (!cont || document.getElementById('btn-campana')) return
  const b = document.createElement('button')
  b.id = 'btn-campana'
  b.title = 'Avisos recientes'
  b.onclick = (e) => { e.stopPropagation(); window.campanaAbrir() }
  b.style.cssText = 'position:relative;background:none;border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:3px 9px;font-size:0.95rem;color:#fff;cursor:pointer'
  b.innerHTML = '🔔<span id="campana-badge" style="display:none;position:absolute;top:-6px;right:-6px;min-width:16px;height:16px;padding:0 3px;border-radius:100px;background:#e91e8c;color:#fff;font-size:0.62rem;font-weight:700;align-items:center;justify-content:center">0</span>'
  cont.insertBefore(b, cont.firstChild)
  pintarBadge()
}

// El panel vuelve a dibujar la barra superior al cambiar de sección: se revisa seguido que el botón siga puesto
setInterval(asegurarBoton, 1500)
setInterval(cargar, 90 * 1000)
setTimeout(cargar, 4000)
// Al volver a la pestaña, se actualiza al instante
document.addEventListener('visibilitychange', () => { if (!document.hidden) cargar() })
