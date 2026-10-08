// ═══ Dashboard: «Requiere tu atención hoy» ═══════════════════════════════════════════════════════════════════════════════════════
// Junta en un solo renglón lo que hay que atender (tareas, pedidos por enviar, pagos a proveedores, mensajes, solicitudes y correo),
// cada uno con su número y un clic que lleva directo a donde se resuelve. Antes había que entrar a cada sección para enterarse.
const API = '/api'
const dinero = (n) => '$' + Math.round(n).toLocaleString('es-MX')
const hoyISO = () => { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10) }
const get = async (ruta) => { const r = await fetch(API + ruta); if (!r.ok) throw new Error(String(r.status)); return r.json() }
const esAdmin = () => !window._empleadoActual || window._empleadoActual.rol === 'admin'

// Orden en el dashboard: arriba «atención hoy» (compacta); las tareas del equipo van justo debajo del bloque de bienvenida y cifras clave
window._ordenarTarjetasDash = () => {
  const cont = document.getElementById('dashboard-contenido'); if (!cont) return
  const a = document.getElementById('atencion-hoy-card'), t = document.getElementById('tareas-equipo-card')
  if (a && cont.firstElementChild !== a) cont.insertBefore(a, cont.firstChild)
  if (t) {
    const base = cont.querySelector(':scope > .dash-row-1') || [...cont.children].find(x => x !== a && x !== t)   // el bloque de bienvenida con las cifras clave
    if (base && base.nextElementSibling !== t) base.after(t)
  }
}

window.pintarAtencionHoy = async function (contenedor) {
  if (!contenedor) return
  // el bloque de cifras se dibuja un poco después: se vuelve a ordenar cuando ya existe
  ;[1200, 3000, 6000].forEach(ms => setTimeout(() => window._ordenarTarjetasDash(), ms))
  let card = document.getElementById('atencion-hoy-card')
  if (!card) {
    card = document.createElement('div'); card.id = 'atencion-hoy-card'
    card.style.cssText = 'background:#fff;border-radius:12px;border:1px solid #eee;padding:1.1rem 1.25rem;margin-bottom:1.25rem'
    card.addEventListener('click', (e) => { const t = e.target.closest('[data-ir]'); if (t) ir(t.dataset.ir) })
    contenedor.insertBefore(card, contenedor.firstChild)
  }
  card.innerHTML = '<p style="margin:0;color:#94a3b8;font-size:0.85rem">Revisando qué necesita tu atención…</p>'
  window._ordenarTarjetasDash()
  const [tareas, enviar, cxp, solic, correo] = await Promise.allSettled([
    get('/chatbot/tareas-equipo'),
    get('/pedidos/por-enviar-resumen'),
    esAdmin() ? get('/finanzas/cuentas-por-pagar') : Promise.reject(),
    esAdmin() ? get('/pedidos/solicitudes-total') : Promise.reject(),
    esAdmin() ? get('/emails/buzon/no-leidos') : Promise.reject(),
  ])
  const ok = (r) => r.status === 'fulfilled' ? r.value : null
  const tiles = []
  const hoy = hoyISO()

  const T = ok(tareas)
  if (Array.isArray(T)) {
    const venc = T.filter(t => t.fecha_vence && t.fecha_vence < hoy).length, deHoy = T.filter(t => t.fecha_vence === hoy).length, sinResp = T.filter(t => !t.asignada_a).length
    tiles.push({ ir: 'tareas', icono: '✅', n: venc + deHoy, titulo: 'Tareas por atender', sub: venc || deHoy ? `${venc} vencida${venc === 1 ? '' : 's'} · ${deHoy} para hoy` : `${T.length} pendientes en total`, urgente: venc > 0, extra: sinResp ? `${sinResp} sin responsable` : '' })
  }
  const E = ok(enviar)
  if (Array.isArray(E)) tiles.push({ ir: 'pedidos', icono: '📦', n: E.length, titulo: 'Pedidos por enviar', sub: E.length ? `${dinero(E.reduce((s, p) => s + parseFloat(p.total || 0), 0))} ya pagados` : 'Nada por surtir', urgente: E.length > 0 })
  const C = ok(cxp)
  if (Array.isArray(C)) {
    const venc = C.filter(o => o.vencido), prox = C.filter(o => !o.vencido && o.dias_restantes <= 3)
    const saldo = (a) => a.reduce((s, o) => s + parseFloat(o.saldo_pendiente ?? o.total ?? 0), 0)
    tiles.push({ ir: 'cxp', icono: '📥', n: venc.length + prox.length, titulo: 'Pagos a proveedores', sub: venc.length || prox.length ? `${venc.length ? dinero(saldo(venc)) + ' vencido' : ''}${venc.length && prox.length ? ' · ' : ''}${prox.length ? prox.length + ' vence' + (prox.length === 1 ? '' : 'n') + ' en 3 días' : ''}` : `${C.length} notas, ninguna urgente`, urgente: venc.length > 0 })
  }
  if (typeof window._totalNoLeidos === 'number') tiles.push({ ir: 'conversaciones', icono: '💬', n: window._totalNoLeidos, titulo: 'Mensajes sin leer', sub: window._totalNoLeidos ? 'Clientas esperando respuesta' : 'Todo contestado', urgente: window._totalNoLeidos > 0 })
  const S = ok(solic)
  if (S && S.total != null) tiles.push({ ir: 'carritos', icono: '🛒', n: S.total, titulo: 'Solicitudes de carritos', sub: S.total ? 'Apartar o liberar productos' : 'Sin solicitudes', urgente: S.total > 0 })
  const M = ok(correo)
  if (M && M.count != null) tiles.push({ ir: 'correo', icono: '✉️', n: M.count, titulo: 'Correos sin leer', sub: M.count ? 'En el buzón' : 'Buzón al día', urgente: false })

  const pendientes = tiles.filter(t => t.n > 0).length
  card.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;flex-wrap:wrap;margin-bottom:10px">
      <h3 style="font-size:1rem;font-weight:700;margin:0">🔔 Requiere tu atención hoy</h3>
      <span style="font-size:0.76rem;color:${pendientes ? '#be185d' : '#16a34a'};font-weight:600">${pendientes ? `${pendientes} cosa${pendientes === 1 ? '' : 's'} por revisar` : 'Todo al día 🎉'}</span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px">
      ${tiles.map(t => `<button type="button" data-ir="${t.ir}" style="text-align:left;cursor:pointer;border:1px solid ${t.n > 0 && t.urgente ? '#fbcfe8' : '#e2e8f0'};background:${t.n > 0 && t.urgente ? '#fdf2f8' : '#f8fafc'};border-radius:10px;padding:10px 12px;font-family:inherit">
        <div style="display:flex;align-items:center;gap:8px"><span style="font-size:1.15rem">${t.icono}</span><span style="font-size:1.45rem;font-weight:800;color:${t.n > 0 ? (t.urgente ? '#be185d' : '#0f172a') : '#94a3b8'}">${t.n}</span></div>
        <div style="font-size:0.78rem;font-weight:700;color:#334155;margin-top:2px">${t.titulo}</div>
        <div style="font-size:0.7rem;color:#64748b;margin-top:1px">${t.sub}${t.extra ? ` · <b style="color:#b45309">${t.extra}</b>` : ''}</div></button>`).join('')}
    </div>`
}

function ir(destino) {
  if (destino === 'tareas') { document.getElementById('tareas-equipo-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return }
  if (destino === 'cxp') {
    window.navegarA('finanzas')
    let n = 0
    const t = setInterval(() => {
      n++
      const btn = [...document.querySelectorAll('#content button')].find(b => /Cuentas x pagar/i.test(b.textContent))
      if (btn || n > 25) { clearInterval(t); if (btn) btn.click() }
    }, 250)
    return
  }
  window.navegarA(destino)
}
