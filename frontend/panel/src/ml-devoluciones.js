// ═══ Devoluciones de Mercado Libre por confirmar ═══════════════════════════════════
// Cuando ML entrega en la dirección del negocio un par que el comprador devolvió, aparece aquí. Se revisa el par y se confirma con un
// clic: «Llegó bien» lo suma al inventario; «Llegó dañado / no llegó» no suma nada. Nunca se suma solo (un par dañado no es existencia).
const API = '/api'
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

async function pedir(ruta, opciones) {
  const r = await fetch(API + ruta, opciones)
  let j = null
  try { j = await r.json() } catch (e) {}
  if (!r.ok) throw new Error((j && (j.error || j.detail)) || ('Error ' + r.status))
  return j
}

function tarjeta(d) {
  const items = d.items || []
  const lista = items.length
    ? items.map(it => `<div style="display:flex;gap:10px;align-items:center;margin:6px 0">
        ${it.foto ? `<img src="${esc(it.foto)}" alt="" style="width:54px;height:54px;object-fit:cover;border-radius:8px;border:1px solid #eee">` : ''}
        <div style="font-size:0.85rem"><b>${esc(it.producto || 'Producto')}</b><br><span style="color:#64748b">${esc(it.color || '')}${it.talla ? ' · talla ' + esc(String(it.talla).replace('_', '.')) : ''} · ${esc(it.cantidad)} par${it.cantidad === 1 ? '' : 'es'}</span></div></div>`).join('')
    : '<p style="font-size:0.82rem;color:#b45309;margin:6px 0">No encontré el pedido de esta orden en el ERP: revisa el par y regístralo a mano en Inventario → Ajuste.</p>'
  const aviso = d.varios ? '<p style="font-size:0.78rem;color:#b45309;margin:4px 0">Esta orden tenía varios productos: se sumarán todos. Si solo regresó uno, usa «Llegó dañado» y ajusta a mano.</p>' : ''
  return `<div data-claim="${esc(d.claim_id)}" style="border:1px solid #e2e8f0;border-radius:12px;padding:12px 14px;margin-bottom:10px;background:#fff">
    <div style="font-size:0.74rem;color:#64748b">Orden ${esc(d.order_id)} · reclamo ${esc(d.claim_id)}</div>
    ${lista}${aviso}
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
      <button type="button" data-accion="confirmar" ${items.length ? '' : 'disabled'} style="cursor:pointer;border:0;background:#16a34a;color:#fff;border-radius:8px;padding:8px 12px;font-weight:700;font-size:0.82rem;${items.length ? '' : 'opacity:.45;cursor:not-allowed'}">✅ Llegó bien, sumar al inventario</button>
      <button type="button" data-accion="descartar" style="cursor:pointer;border:1px solid #fca5a5;background:#fff;color:#b91c1c;border-radius:8px;padding:8px 12px;font-weight:700;font-size:0.82rem">⚠️ Llegó dañado / no llegó</button>
    </div></div>`
}

window.abrirDevolucionesML = async function () {
  document.getElementById('modal-devml')?.remove()
  const m = document.createElement('div')
  m.id = 'modal-devml'
  m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px'
  m.innerHTML = `<div style="background:#f8fafc;border-radius:14px;max-width:560px;width:100%;max-height:86vh;overflow:auto;padding:18px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><h3 style="margin:0;font-size:1.05rem">↩️ Devoluciones de Mercado Libre</h3>
      <button type="button" data-cerrar style="border:0;background:none;font-size:1.4rem;cursor:pointer">×</button></div>
    <p style="font-size:0.8rem;color:#64748b;margin:0 0 10px">Pares que ya llegaron de regreso. Revísalos y confirma: solo los que llegan bien se suman al inventario.</p>
    <div id="devml-lista"><p style="color:#94a3b8;font-size:0.85rem">Cargando…</p></div>
    <div style="margin-top:8px;text-align:right"><button type="button" id="devml-revisar" style="cursor:pointer;border:1px solid #cbd5e1;background:#fff;border-radius:8px;padding:6px 10px;font-size:0.78rem">🔄 Revisar Mercado Libre ahora</button></div></div>`
  document.body.appendChild(m)
  const cerrar = () => { m.remove(); if (window.pintarAtencionHoy) { const c = document.getElementById('dashboard-contenido'); if (c) window.pintarAtencionHoy(c) } }
  const pintar = async () => {
    const cont = m.querySelector('#devml-lista')
    try {
      const d = await pedir('/ml/devoluciones')
      const l = d.por_confirmar || []
      cont.innerHTML = l.length ? l.map(tarjeta).join('')
        : `<p style="color:#16a34a;font-weight:600;font-size:0.9rem">Todo al día: no hay devoluciones por confirmar.</p>${d.en_camino ? `<p style="font-size:0.8rem;color:#64748b">${d.en_camino} devolución${d.en_camino === 1 ? '' : 'es'} en camino hacia ti.</p>` : ''}`
    } catch (e) { cont.innerHTML = `<p style="color:#b91c1c;font-size:0.85rem">No se pudo cargar: ${esc(e.message)}</p>` }
  }
  m.addEventListener('click', async (e) => {
    if (e.target === m || e.target.closest('[data-cerrar]')) { cerrar(); return }
    if (e.target.closest('#devml-revisar')) {
      const b = e.target.closest('#devml-revisar'); b.disabled = true; b.textContent = 'Revisando…'
      try { await pedir('/ml/devoluciones/sync', { method: 'POST' }) } catch (er) { alert('No se pudo revisar: ' + er.message) }
      b.disabled = false; b.textContent = '🔄 Revisar Mercado Libre ahora'; pintar(); return
    }
    const btn = e.target.closest('[data-accion]'); if (!btn || btn.disabled) return
    const card = btn.closest('[data-claim]'); const id = card.dataset.claim
    if (btn.dataset.accion === 'confirmar' && !confirm('¿El par llegó en buen estado? Se sumará 1 al inventario.')) return
    const nota = btn.dataset.accion === 'descartar' ? (prompt('¿Qué pasó? (opcional)') || '') : ''
    card.style.opacity = '.5'; card.querySelectorAll('button').forEach(x => x.disabled = true)
    try {
      await pedir(`/ml/devoluciones/${id}/${btn.dataset.accion}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nota }) })
      card.remove()
      if (!m.querySelector('[data-claim]')) pintar()
    } catch (er) { card.style.opacity = '1'; card.querySelectorAll('button').forEach(x => x.disabled = false); alert('No se pudo guardar: ' + er.message) }
  })
  pintar()
}
