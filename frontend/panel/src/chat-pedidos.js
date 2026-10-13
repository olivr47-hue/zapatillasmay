// ═══ Conversaciones: pedidos de la persona que escribe ══════════════════════════════════
// Si la clienta pregunta por su pedido, aquí se ve sin salir del chat: estatus, guía, artículos y un botón que deja el aviso ya escrito en la caja
// de mensaje (no lo envía solo). Los pedidos se encuentran por el teléfono del chat, ya sea el que guarda el pedido o el de la ficha del cliente.
const API = '/api'
const esc = (v) => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

const ESTATUS = {
  borrador: ['Borrador', '#64748b', '#f1f5f9'],
  checkout_iniciado: ['Sin terminar el pago', '#92400e', '#fef3c7'],
  pendiente_pago: ['Pendiente de pago', '#92400e', '#fef3c7'],
  apartado: ['Apartado', '#92400e', '#fef3c7'],
  confirmado: ['Confirmado', '#1d4ed8', '#dbeafe'],
  pagado: ['Pagado', '#1d4ed8', '#dbeafe'],
  por_enviar: ['Por enviar', '#1d4ed8', '#dbeafe'],
  enviado: ['Enviado', '#166534', '#dcfce7'],
  entregado: ['Entregado', '#166534', '#dcfce7'],
  cancelado: ['Cancelado', '#991b1b', '#fee2e2'],
}
const estatus = (s) => ESTATUS[s] || [String(s || '—'), '#475569', '#f1f5f9']
const fecha = (iso) => {
  try { return new Date(iso).toLocaleDateString('es-MX', { timeZone: 'America/Mexico_City', day: '2-digit', month: 'short' }) } catch (e) { return '' }
}
const folio = (p) => String(p.id || '').slice(0, 8)
const origen = (p) => p.ml_order_id ? 'Mercado Libre' : p.walmart_order_id ? 'Walmart' : p.shein_order_id ? 'SHEIN' : p.amazon_order_id ? 'Amazon' : ''
const articulos = (p) => (p.articulos || []).map(a => `${a.cantidad > 1 ? a.cantidad + '× ' : ''}${a.nombre}${a.color ? ' ' + a.color : ''}${a.talla ? ' T' + a.talla : ''}`)

let CACHE = {}   // tel -> pedidos (lo último que se cargó, para el botón de «usar en respuesta»)

// Aviso listo para mandar, según cómo va el pedido
function textoAviso(p) {
  const f = folio(p)
  const guia = p.numero_guia ? `${p.paqueteria ? 'por ' + p.paqueteria + ', ' : ''}guía ${p.numero_guia}` : ''
  switch (p.status) {
    case 'enviado':
      return p.numero_guia
        ? `Hola 😊 tu pedido #${f} ya fue enviado ${guia}.${p.tracking_url ? ' Puedes rastrearlo aquí: ' + p.tracking_url : ''}`
        : `Hola 😊 tu pedido #${f} ya fue enviado. En cuanto tengamos tu número de guía te lo compartimos.`
    case 'entregado':
      return `Hola 😊 tu pedido #${f} aparece como entregado${p.numero_guia ? ' (' + guia + ')' : ''}. Si no lo has recibido, avísanos para revisarlo.`
    case 'confirmado': case 'pagado': case 'por_enviar':
      return `Hola 😊 tu pedido #${f} está confirmado y lo estamos preparando para enviarlo. Te avisamos con tu guía en cuanto salga.`
    case 'pendiente_pago': case 'checkout_iniciado': case 'apartado':
      return `Hola 😊 tu pedido #${f} está apartado, pero todavía no vemos el pago. ¿Te ayudamos a completarlo?`
    case 'cancelado':
      return `Hola 😊 tu pedido #${f} aparece como cancelado. Si quieres retomarlo, con gusto te ayudamos.`
    default:
      return `Hola 😊 estamos revisando tu pedido #${f}, en un momento te confirmamos.`
  }
}

function cerrar() { document.getElementById('wa-ped-modal')?.remove() }

function abrir(tel) {
  cerrar()
  const lista = CACHE[tel] || []
  const tarjetas = lista.map((p, i) => {
    const [txt, col, bg] = estatus(p.status)
    const arts = articulos(p)
    const org = origen(p)
    const guia = p.numero_guia
      ? `<div style="font-size:0.78rem;color:#334155;margin-top:4px">🚚 ${esc(p.paqueteria || 'Guía')}: <b>${esc(p.numero_guia)}</b>${p.tracking_url ? ` · <a href="${esc(p.tracking_url)}" target="_blank" rel="noopener" style="color:#1d4ed8">rastrear</a>` : ''}</div>`
      : ''
    return `<div style="border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;margin-bottom:8px;background:#fff">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
        <div style="font-weight:700;font-size:0.85rem;color:#0f172a">#${esc(folio(p))} <span style="font-weight:500;color:#94a3b8;font-size:0.75rem">· ${esc(fecha(p.created_at))}${org ? ' · ' + esc(org) : ''}</span></div>
        <span style="background:${bg};color:${col};border-radius:100px;padding:2px 10px;font-size:0.72rem;font-weight:700;white-space:nowrap">${esc(txt)}</span>
      </div>
      ${arts.length ? `<div style="font-size:0.78rem;color:#475569;margin-top:6px;line-height:1.4">${arts.map(esc).join('<br>')}</div>` : ''}
      <div style="font-size:0.78rem;color:#334155;margin-top:4px">Total: <b>$${Number(p.total || 0).toLocaleString('es-MX')}</b>${p.forma_pago ? ' · ' + esc(String(p.forma_pago).replace(/_/g, ' ')) : ''}</div>
      ${guia}
      <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">
        <button type="button" data-ped-usar="${i}" style="border:1px solid #bbf7d0;background:#f0fdf4;color:#166534;border-radius:8px;padding:6px 10px;font-size:0.75rem;font-weight:600;cursor:pointer">💬 Poner aviso en el mensaje</button>
        <button type="button" data-ped-ver="${i}" style="border:1px solid #e2e8f0;background:#f8fafc;color:#334155;border-radius:8px;padding:6px 10px;font-size:0.75rem;font-weight:600;cursor:pointer">Ver pedido</button>
      </div>
    </div>`
  }).join('')
  const m = document.createElement('div')
  m.id = 'wa-ped-modal'
  m.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.45);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px'
  m.innerHTML = `<div style="background:#f8fafc;border-radius:16px;max-width:440px;width:100%;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 20px 50px rgba(0,0,0,0.25)">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px 8px">
        <div style="font-weight:800;color:#0f172a">Pedidos de esta persona</div>
        <button type="button" data-ped-cerrar style="border:none;background:none;font-size:1.3rem;line-height:1;cursor:pointer;color:#64748b">✕</button>
      </div>
      <div style="padding:4px 16px 16px;overflow-y:auto">${tarjetas || '<p style="color:#94a3b8;font-size:0.85rem">Sin pedidos.</p>'}</div>
    </div>`
  m.addEventListener('click', (e) => {
    if (e.target === m || e.target.closest('[data-ped-cerrar]')) return cerrar()
    const usar = e.target.closest('[data-ped-usar]')
    const ver = e.target.closest('[data-ped-ver]')
    if (usar) {
      const p = lista[+usar.dataset.pedUsar]
      const ta = document.getElementById('msg-input-' + tel)
      cerrar()
      if (ta && p) {
        ta.value = (ta.value ? ta.value.replace(/\s+$/, '') + '\n' : '') + textoAviso(p)
        ta.dispatchEvent(new Event('input', { bubbles: true }))
        ta.focus()
      }
    } else if (ver) {
      const p = lista[+ver.dataset.pedVer]
      cerrar()
      if (p && window.verPedido) window.verPedido(p.id)
    }
  })
  document.body.appendChild(m)
}

// Distintivo del encabezado del chat: «📦 2 pedidos · Enviado»
window.waCargarPedidos = async (tel) => {
  const el = document.getElementById('wa-ped-' + tel); if (!el) return
  try {
    const r = await fetch(API + '/chatbot/chats/' + encodeURIComponent(tel) + '/pedidos')
    if (!r.ok) { el.textContent = ''; return }
    const lista = await r.json()
    const el2 = document.getElementById('wa-ped-' + tel); if (!el2) return
    if (!Array.isArray(lista) || !lista.length) { el2.innerHTML = '<span style="font-size:0.72rem;color:#94a3b8">Sin pedidos</span>'; return }
    CACHE[tel] = lista
    const [txt, col, bg] = estatus(lista[0].status)
    el2.innerHTML = `<button type="button" title="Ver sus pedidos y su estatus" style="border:1px solid ${col}33;background:${bg};color:${col};border-radius:100px;padding:3px 10px;font-size:0.72rem;font-weight:700;cursor:pointer;white-space:nowrap">📦 ${lista.length} pedido${lista.length > 1 ? 's' : ''} · ${esc(txt)}</button>`
    el2.firstChild.onclick = () => abrir(tel)
  } catch (e) { el.textContent = '' }
}
