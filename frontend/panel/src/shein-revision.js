// ═══ SHEIN › Revisión: negociaciones de precio y productos rechazados ══════════════════════════
// SHEIN puede sugerir otro precio de costo al publicar y puede rechazar productos; desde aquí se ve todo junto y se actúa:
// aceptar el precio de SHEIN, ofrecer otro, abandonar, o volver a subir un rechazado como producto nuevo (máx. 2 reintentos por producto).
// SHEIN no permite eliminar por API un producto rechazado: «Ocultar» solo lo quita de esta lista.
const API = '/api'
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const money = (n) => (n == null ? '—' : '$' + Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
const ACC = '#f43f5e'

const CSS_ID = 'shein-rev-css'
function inyectarCss() {
  if (document.getElementById(CSS_ID)) return
  const st = document.createElement('style'); st.id = CSS_ID
  st.textContent = `
    #shein-rev .rv-fila{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}
    #shein-rev .rv-nombre{font-size:0.9rem;display:block}
    #shein-rev .rv-metricas{display:flex;gap:18px;flex-wrap:wrap;margin:8px 0;font-size:0.84rem}
    #shein-rev .rv-acciones{display:flex;flex-wrap:wrap;gap:4px}
    #shein-rev .rv-acciones button{margin:2px 4px 2px 0}
    @media (max-width: 640px){
      .mkt-page-wrap:has(#shein-tabs){padding:1rem 0.75rem !important}
      .mkt-page-wrap:has(#shein-tabs) > p{margin-left:0 !important}
      .content #shein-tabs{display:grid !important;grid-template-columns:1fr 1fr;gap:0 !important}
      .content #shein-tabs .shein-tab-btn{justify-content:center;white-space:nowrap;padding:0.7rem 0.4rem !important;font-size:0.84rem !important;border-bottom-width:2px}
      .shein-ventas-tabla{min-width:0 !important}
      .shein-ventas-tabla th,.shein-ventas-tabla td{padding:0.4rem 0.3rem !important}
      .shein-ventas-tabla td:first-child{font-size:0.66rem !important;word-break:break-all}
      #shein-rev .rv-barra{flex-direction:column;align-items:stretch !important;gap:8px}
      #shein-rev .rv-barra .rv-hace{display:flex;justify-content:space-between;align-items:center}
      #shein-rev .rv-fila{flex-direction:column;gap:4px}
      #shein-rev .rv-nombre{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
      #shein-rev .rv-intentos{text-align:left !important}
      #shein-rev .rv-metricas{display:grid;grid-template-columns:1fr 1fr;gap:10px 12px}
      #shein-rev .rv-acciones{flex-direction:column;gap:8px}
      #shein-rev .rv-acciones button{width:100%;min-height:44px;font-size:0.9rem !important;margin:0}
      #shein-rev .rv-resumen{display:flex;flex-wrap:wrap;gap:6px}
    }`
  document.head.appendChild(st)
}
inyectarCss()   // también aplica a las demás pestañas de SHEIN (encabezado y pestañas en celular)

async function pedir(ruta, opciones) {
  const r = await fetch(API + ruta, opciones)
  let j = null
  try { j = await r.json() } catch (e) {}
  if (!r.ok) throw new Error((j && (j.error || j.detail)) || ('Error ' + r.status))
  return j
}
const post = (ruta, cuerpo) => pedir(ruta, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo || {}) })

const btn = (txt, accion, extra = '', estilo = 'sec') => {
  const e = { pri: `background:${ACC};color:#fff;border:0`, ok: 'background:#16a34a;color:#fff;border:0', mal: 'background:#fff;color:#b91c1c;border:1px solid #fca5a5', sec: 'background:#fff;color:#334155;border:1px solid #cbd5e1' }[estilo]
  return `<button type="button" data-acc="${accion}" ${extra} style="cursor:pointer;${e};border-radius:8px;padding:6px 10px;font-weight:700;font-size:0.78rem;margin:2px 4px 2px 0">${txt}</button>`
}

function filaNegociacion(n) {
  const gan = n.ganancia
  const colorGan = gan == null ? '#64748b' : (gan < 0 ? '#b91c1c' : (gan < 40 ? '#b45309' : '#166534'))
  const ultimo = (n.skus[0] || {}).ultimo
  return `<div data-orden="${esc(n.orden)}" data-sugerido="${esc(n.sugerido ?? '')}" data-ultimo="${esc(ultimo ?? '')}" style="border:1px solid #e2e8f0;border-radius:12px;padding:12px 14px;margin-bottom:10px;background:#fff">
    <div class="rv-fila">
      <div><b class="rv-nombre">${esc(n.producto || 'Producto')}</b><span style="font-size:0.76rem;color:#64748b">${esc(n.color || '')} · ${esc(n.sku_interno || '')} · tallas ${n.skus.map(s => esc((s.atributos || []).join(','))).join(', ')}</span></div>
      <div class="rv-intentos" style="text-align:right;font-size:0.78rem;color:#64748b">Intentos que te quedan: <b>${esc(n.intentos ?? '—')}</b></div>
    </div>
    <div class="rv-metricas">
      <div>Tu precio<br><b>${money(ultimo)}</b></div>
      <div>SHEIN sugiere<br><b>${money(n.sugerido)}</b></div>
      <div>Tu costo<br><b>${money(n.costo)}</b></div>
      <div>Ganancia por par<br><b style="color:${colorGan}">${gan == null ? '—' : money(gan)}</b></div>
    </div>
    <div class="rv-acciones">${btn('✅ Aceptar ' + money(n.sugerido), 'aceptar', '', 'ok')}${btn('💬 Ofrecer otro precio', 'recotizar')}${btn('✖ Rechazar y abandonar', 'abandonar', '', 'mal')}</div>
  </div>`
}

function filaRechazado(r) {
  const etiquetas = { precio: ['Precio', '#b45309', '#fef3c7'], infraccion: ['Infracción de marca', '#991b1b', '#fee2e2'], otro: ['Otro motivo', '#475569', '#e2e8f0'] }
  const [tx, c, bg] = etiquetas[r.tipo] || etiquetas.otro
  const motivo = (r.motivos || []).join(' · ').slice(0, 260)
  const resubido = r.reenviado_el ? `<span style="font-size:0.74rem;color:#166534;font-weight:700">↻ Reenviado el ${esc(r.reenviado_el)} (en revisión)</span>` : ''
  const puede = r.producto_id && r.tipo !== 'infraccion'
  return `<div data-skc="${esc(r.skc)}" data-pid="${esc(r.producto_id || '')}" data-precio="${esc(r.precio_actual ?? '')}" style="border:1px solid #e2e8f0;border-radius:12px;padding:12px 14px;margin-bottom:10px;background:#fff">
    <div class="rv-fila"><b class="rv-nombre">${esc(r.producto || r.sku_interno || r.spu)}</b>
      <span style="font-size:0.72rem;font-weight:700;padding:2px 9px;border-radius:100px;background:${bg};color:${c}">${tx}</span></div>
    <p style="font-size:0.78rem;color:#64748b;margin:6px 0">${esc(motivo)}</p>
    <div style="font-size:0.78rem;color:#475569;margin-bottom:4px">Precio con el que se subiría: <b>${money(r.precio_actual)}</b> · tu costo: <b>${money(r.costo)}</b> · reenvíos hechos: <b>${esc(r.reintentos)}</b> de 2 ${resubido ? ' · ' + resubido : ''}</div>
    <div class="rv-acciones">${puede ? btn('↻ Volver a subir', 'resubir', '', 'pri') : (r.tipo === 'infraccion' ? '<span style="font-size:0.76rem;color:#991b1b">No se reenvía solo: revisa primero las fotos con SHEIN.</span>' : '<span style="font-size:0.76rem;color:#b45309">No pude ligarlo con un producto del ERP.</span>')}${btn('Ocultar', 'ocultar')}</div>
  </div>`
}

window._sheinRenderRevisionTab = async function (forzar = false) {
  const body = document.getElementById('shein-tab-body')
  if (!body) return
  inyectarCss()
  body.innerHTML = `<div style="padding:2rem;color:#94a3b8;font-size:0.85rem">Consultando a SHEIN${forzar ? '' : ''}… la primera vez puede tardar hasta un minuto.</div>`
  let d
  try { d = await pedir('/shein/revision' + (forzar ? '?forzar=true' : '')) } catch (e) { body.innerHTML = `<p style="color:#b91c1c;font-size:0.9rem">No se pudo consultar: ${esc(e.message)}</p>`; return }
  const pend = (d.negociaciones || []).filter(n => n.estado_num === 1)
  const rech = (d.rechazados || []).filter(r => !r.oculto)
  const resumen = Object.entries(d.por_estado || {}).map(([k, v]) => `<span style="font-size:0.78rem;background:#f1f5f9;border-radius:100px;padding:3px 10px;margin-right:6px"><b>${v}</b> ${esc(k)}</span>`).join('')
  const hace = d.calculado ? Math.max(0, Math.round((Date.now() / 1000 - d.calculado) / 60)) : 0
  body.innerHTML = `<div id="shein-rev">
    <div class="rv-barra" style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:12px">
      <div class="rv-resumen">${resumen || ''}</div>
      <div class="rv-hace"><span style="font-size:0.74rem;color:#94a3b8;margin-right:8px">Actualizado hace ${hace} min</span>${btn('🔄 Actualizar', 'actualizar')}</div></div>
    <h3 style="font-size:1rem;margin:14px 0 6px">💬 Negociaciones de precio por responder (${pend.length})</h3>
    <p style="font-size:0.78rem;color:#64748b;margin:0 0 8px">SHEIN sugiere un precio de costo menor. Si no contestas en ~14 días, el producto se rechaza solo.</p>
    ${pend.length ? pend.map(filaNegociacion).join('') : '<p style="font-size:0.85rem;color:#16a34a;font-weight:600">No hay negociaciones pendientes.</p>'}
    <h3 style="font-size:1rem;margin:20px 0 6px">⛔ Productos rechazados (${rech.length})</h3>
    <p style="font-size:0.78rem;color:#64748b;margin:0 0 8px">SHEIN no deja eliminarlos por API; «Volver a subir» los manda como producto nuevo, con los mismos datos (máx. 2 reenvíos por producto). «Ocultar» solo los quita de esta lista.</p>
    ${rech.length ? rech.map(filaRechazado).join('') : '<p style="font-size:0.85rem;color:#16a34a;font-weight:600">No hay productos rechazados.</p>'}
    ${(d.errores || []).length ? `<p style="font-size:0.74rem;color:#b45309">Aviso: SHEIN no respondió una parte de la consulta (${esc(JSON.stringify(d.errores[0]).slice(0, 160))}).</p>` : ''}
  </div>`
  body.querySelector('#shein-rev').addEventListener('click', async (e) => {
    const b = e.target.closest('[data-acc]'); if (!b || b.disabled) return
    const acc = b.dataset.acc
    const recargar = () => window._sheinRenderRevisionTab(true)
    try {
      if (acc === 'actualizar') { recargar(); return }
      const nCard = b.closest('[data-orden]')
      if (nCard) {
        const sn = nCard.dataset.orden
        if (acc === 'aceptar') {
          if (!confirm(`¿Aceptar el precio que sugiere SHEIN (${money(nCard.dataset.sugerido)}) para este producto? Se aplica a todas sus tallas.`)) return
          await post(`/shein/negociaciones/${encodeURIComponent(sn)}/accion`, { accion: 'aceptar' })
        } else if (acc === 'abandonar') {
          if (!confirm('¿Rechazar y abandonar? SHEIN rechaza el producto y no se publica. Después puedes volver a subirlo.')) return
          await post(`/shein/negociaciones/${encodeURIComponent(sn)}/accion`, { accion: 'abandonar' })
        } else if (acc === 'recotizar') {
          const p = prompt('¿Qué precio de costo quieres ofrecer (MXN) para todas las tallas?', nCard.dataset.ultimo || '')
          if (!p) return
          await post(`/shein/negociaciones/${encodeURIComponent(sn)}/accion`, { accion: 'recotizar', precio: parseFloat(p) })
        }
        b.textContent = 'Listo ✓'; setTimeout(recargar, 800); return
      }
      const rCard = b.closest('[data-skc]')
      if (rCard && acc === 'resubir') {
        const precio = prompt('Precio con el que se subirá (MXN). Déjalo así para usar el de siempre:', rCard.dataset.precio || '')
        if (precio === null) return
        if (!confirm('¿Volver a subir este producto a SHEIN? Se manda como producto nuevo y abre una nueva revisión de precio.')) return
        b.disabled = true; b.textContent = 'Subiendo…'
        await post('/shein/revision/volver-a-subir', { producto_id: rCard.dataset.pid, precio: parseFloat(precio) || undefined })
        b.textContent = 'Subido ✓'; setTimeout(recargar, 800); return
      }
      if (rCard && acc === 'ocultar') { await post('/shein/revision/ocultar', { skc: rCard.dataset.skc }); rCard.remove() }
    } catch (er) { alert('No se pudo completar: ' + er.message); if (b) { b.disabled = false } }
  })
}
