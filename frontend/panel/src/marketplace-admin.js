// ═══ Marketplace (lado del negocio) ═══════════════════════════════════════════════════════════════════════════
// Aprobar vendedores y productos, ver los pedidos de otras tiendas y liquidarles lo suyo. El negocio cobra todo con su MercadoPago y gana
// una comisión por par (por defecto $20; se cambia por vendedor). Todo vive en tablas mp_* y rutas /marketplace/admin/*.
const API = '/api'
const esc = (v) => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const $$ = (n) => '$' + Number(n || 0).toLocaleString('es-MX', { maximumFractionDigits: 2 })
const MP = { tab: 'resumen', filtroProd: 'pendiente', filtroPed: '', datos: {} }

async function mpApi(ruta, op = {}) {
  const r = await fetch(API + ruta, { method: op.method || 'GET', headers: op.json !== undefined ? { 'Content-Type': 'application/json' } : undefined, body: op.json !== undefined ? JSON.stringify(op.json) : undefined })
  const d = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(d.error || d.detail || 'Error')
  return d
}

const ETQ_V = { pendiente: ['#fff4e5', '#b26a00', 'Por aprobar'], activo: ['#e8f5e9', '#2e7d32', 'Activo'], suspendido: ['#fdecea', '#b3261e', 'Suspendido'] }
const ETQ_P = { borrador: ['#eee', '#555', 'Borrador'], pendiente: ['#fff4e5', '#b26a00', 'Por aprobar'], publicado: ['#e8f5e9', '#2e7d32', 'Publicado'], rechazado: ['#fdecea', '#b3261e', 'Rechazado'], pausado: ['#e8eaf6', '#3949ab', 'Pausado'] }
const ETQ_O = { pendiente_pago: ['#eee', '#555', 'Sin pagar'], pagado: ['#fff4e5', '#b26a00', 'Pagado'], recibido: ['#e3f2fd', '#1565c0', 'Recibido por ti'], enviado: ['#e3f2fd', '#1565c0', 'Enviado'], entregado: ['#e8f5e9', '#2e7d32', 'Entregado'], cancelado: ['#fdecea', '#b3261e', 'Cancelado'] }
const tag = (m, k) => { const t = m[k] || ['#eee', '#555', k]; return `<span style="background:${t[0]};color:${t[1]};font-size:0.7rem;font-weight:700;padding:2px 9px;border-radius:100px">${esc(t[2])}</span>` }

window.cargarMarketplace = async function () {
  const content = document.getElementById('content')
  content.innerHTML = `<div style="margin-bottom:1rem"><p style="font-size:0.7rem;font-weight:700;letter-spacing:0.1em;color:#E91E8C;text-transform:uppercase;margin:0 0 3px">Otros vendedores</p>
    <h2 style="font-size:1.3rem;font-weight:800;margin:0">🛍️ Marketplace</h2>
    <p style="font-size:0.78rem;color:#64748b;margin:4px 0 0">Aquí apruebas a quienes quieren vender en tu sitio y sus productos. Tú cobras todo y les liquidas lo suyo; tu comisión es por par.
    Su página para registrarse: <a href="https://zapatillasmay.mx/vender" target="_blank" rel="noopener">zapatillasmay.mx/vender</a></p></div>
    <div id="mp-tabs" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px"></div><div id="mp-cuerpo"><p style="color:#888">Cargando…</p></div>`
  mpPintarTabs()
  await window.mpTab(MP.tab)
}
function mpPintarTabs() {
  const tabs = [['resumen', 'Resumen'], ['vendedores', 'Vendedores'], ['productos', 'Productos'], ['pedidos', 'Pedidos'], ['pagos', 'Pagos a vendedores'], ['ajustes', 'Ajustes de precio']]
  document.getElementById('mp-tabs').innerHTML = tabs.map(([k, n]) => `<button class="btn ${MP.tab === k ? 'btn-primary' : 'btn-secondary'}" style="font-size:0.8rem;padding:6px 14px" onclick="mpTab('${k}')">${n}</button>`).join('')
}
window.mpTab = async (t) => {
  MP.tab = t; mpPintarTabs()
  const c = document.getElementById('mp-cuerpo'); if (!c) return
  c.innerHTML = '<p style="color:#888">Cargando…</p>'
  try {
    if (t === 'resumen') await mpResumen(c)
    else if (t === 'vendedores') await mpVendedores(c)
    else if (t === 'productos') await mpProductos(c)
    else if (t === 'pedidos') await mpPedidos(c)
    else if (t === 'pagos') await mpPagos(c)
    else await mpAjustes(c)
  } catch (e) { c.innerHTML = `<p style="color:#dc2626">No se pudo cargar: ${esc(e.message)}</p>` }
}

async function mpResumen(c) {
  const r = await mpApi('/marketplace/admin/resumen')
  const k = (n, l, ir) => `<div style="background:#fff;border:1px solid #eee;border-radius:12px;padding:1rem;text-align:center;${ir ? 'cursor:pointer' : ''}" ${ir ? `onclick="mpTab('${ir}')"` : ''}><p style="font-size:1.5rem;font-weight:700;color:#be185d;margin:0">${n}</p><p style="font-size:0.7rem;color:#888;text-transform:uppercase;letter-spacing:.5px;margin:2px 0 0">${l}</p></div>`
  c.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px">
    ${k(r.vendedores_pendientes, 'Vendedores por aprobar', 'vendedores')}${k(r.productos_por_aprobar, 'Productos por aprobar', 'productos')}
    ${k(r.vendedores_activos, 'Vendedores activos', 'vendedores')}${k(r.productos_publicados, 'Productos publicados', 'productos')}
    ${k(r.pedidos_por_enviar, 'Pedidos que envía la tienda', 'pedidos')}${k(r.pedidos_por_recibir || 0, 'Pedidos cruzados que TÚ recibes', 'pedidos')}
    ${k($$(r.ventas_total), 'Vendido en total', 'pedidos')}
    ${k($$(r.comision_total), 'Tu comisión ganada', null)}${k($$(r.por_liquidar), 'Por liquidar a vendedores', 'pagos')}</div>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:12px 16px;margin-top:14px;font-size:0.8rem;color:#166534;line-height:1.55">
      <b>Cómo funciona el precio:</b> la tienda pone lo que quiere <b>recibir</b> (menudeo y 3+ pares). Al público se le muestra ese precio <b>+ tu ganancia por par + la comisión de MercadoPago</b>, así que ella no paga comisión.
      Ajusta la comisión de MercadoPago en <b>Ajustes de precio</b>.<br>
      <b>Pedidos cruzados:</b> el carrito es uno solo; con 3+ pares de varios orígenes los recibes tú (las tiendas te los traen) y envías un solo paquete. El envío gratis (desde $1,299) y el descuento de 3+ pares se acumulan entre todos; si el envío sale gratis, su costo se reparte
      entre los participantes (a cada tienda se le descuenta su parte de lo que le toca).</div>`
}

async function mpVendedores(c) {
  const l = await mpApi('/marketplace/admin/vendedores'); MP.datos.vend = l
  const botonPrueba = `<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:10px;background:#faf5ff;border:1px solid #e9d5ff;border-radius:12px;padding:10px 14px">
    <button class="btn btn-primary" style="font-size:0.78rem;padding:6px 14px" onclick="mpTiendaPrueba()">👁 Ver el portal de vendedor (tienda de prueba)</button>
    <span style="font-size:0.76rem;color:#6b21a8">Abre el portal tal como lo ve una vendedora, con una tienda de prueba que nadie más ve. No necesitas registrarte. Para ver el de una vendedora real, usa el botón «Ver como vendedor» de su renglón.</span></div>`
  c.innerHTML = botonPrueba + (l.length ? `<div class="table-card"><table><thead><tr><th>Tienda</th><th>Contacto</th><th>Estado</th><th>Productos</th><th>Pedidos</th><th>Vendido</th><th>Tu ganancia</th><th>Acciones</th></tr></thead><tbody>
    ${l.map(v => `<tr><td><strong>${esc(v.nombre_tienda)}</strong><br><span style="font-size:0.72rem;color:#94a3b8">${esc(v.ciudad || '')} ${esc(v.estado_region || '')}</span></td>
      <td style="font-size:0.78rem">${esc(v.nombre_contacto || '')}<br>${esc(v.telefono || '')}<br>${esc(v.email)}</td><td>${tag(ETQ_V, v.estado)}</td>
      <td style="font-size:0.8rem">${v.publicados} publicados${v.por_aprobar ? `<br><span style="color:#b26a00">${v.por_aprobar} por aprobar</span>` : ''}<br><span style="color:#94a3b8">${v.productos} en total</span></td>
      <td>${v.pedidos}</td><td>${$$(v.ventas)}</td><td><b>${$$(v.comision_ganada)}</b><br><span style="font-size:0.7rem;color:#94a3b8">${$$(v.comision_por_par)} de ganancia por par</span></td>
      <td style="white-space:nowrap">${v.estado !== 'activo' ? `<button class="btn btn-primary" style="font-size:0.72rem;padding:3px 10px" onclick="mpVendEstado('${esc(v.id)}','activo')">${v.estado === 'pendiente' ? 'Aprobar' : 'Reactivar'}</button>` : `<button class="btn btn-secondary" style="font-size:0.72rem;padding:3px 10px;color:#b3261e" onclick="mpVendEstado('${esc(v.id)}','suspendido')">Suspender</button>`}
        <button class="btn btn-secondary" style="font-size:0.72rem;padding:3px 10px" onclick="mpVendAjustes('${esc(v.id)}')">Ajustes</button>
        <button class="btn btn-secondary" style="font-size:0.72rem;padding:3px 10px;color:#7c3aed;border-color:#c4b5fd" onclick="mpVerComo('${esc(v.id)}')" title="Abre el portal de vendedor de esta tienda, tal como lo ve ella">👁 Ver como vendedor</button></td></tr>`).join('')}</tbody></table></div>`
    : '<p style="color:#94a3b8;padding:1rem">Todavía no hay vendedores. Comparte zapatillasmay.mx/vender.</p>')
}
window.mpVendEstado = async (id, estado) => {
  if (!confirm(estado === 'activo' ? '¿Activar esta cuenta? Sus productos aprobados se podrán publicar y se le avisa por correo.' : '¿Suspender esta cuenta? Sus productos dejan de verse y no podrá entrar.')) return
  try { await mpApi('/marketplace/admin/vendedores/' + id, { method: 'PATCH', json: { estado } }); mpTab('vendedores') } catch (e) { alert(e.message) }
}
window.mpTiendaPrueba = async () => {
  const w = window.open('', '_blank')
  try {
    const d = await mpApi('/marketplace/admin/tienda-prueba', { method: 'POST' })
    if (w) w.location.href = d.url; else alert('Permite las ventanas emergentes para ver el portal.')
    mpTab('vendedores')
  } catch (e) { if (w) w.close(); alert(e.message) }
}
window.mpVerComo = async (id) => {
  const w = window.open('', '_blank')   // se abre antes del fetch para que el navegador no bloquee la ventana
  try {
    const d = await mpApi(`/marketplace/admin/vendedores/${id}/entrar`, { method: 'POST' })
    if (w) w.location.href = d.url; else alert('Permite las ventanas emergentes para ver el portal.')
  } catch (e) { if (w) w.close(); alert(e.message) }
}
window.mpVendAjustes = async (id) => {
  const v = (MP.datos.vend || []).find(x => x.id === id); if (!v) return
  const com = prompt(`Tu ganancia por par con ${v.nombre_tienda} (pesos). Se SUMA al precio que ve la clienta; la tienda no la paga:`, v.comision_por_par); if (com === null) return
  const nota = prompt('Nota interna (opcional):', v.notas_admin || ''); if (nota === null) return
  try { await mpApi('/marketplace/admin/vendedores/' + id, { method: 'PATCH', json: { comision_por_par: com, notas_admin: nota } }); mpTab('vendedores') } catch (e) { alert(e.message) }
}

async function mpProductos(c) {
  const l = await mpApi('/marketplace/admin/productos' + (MP.filtroProd ? '?estado=' + MP.filtroProd : '')); MP.datos.prod = l
  c.innerHTML = `<div style="display:flex;gap:8px;align-items:center;margin-bottom:10px;flex-wrap:wrap"><span style="font-size:0.8rem;color:#64748b">Ver:</span>
    ${['pendiente', 'publicado', 'rechazado', 'pausado', 'borrador', ''].map(e => `<button class="btn ${MP.filtroProd === e ? 'btn-primary' : 'btn-secondary'}" style="font-size:0.74rem;padding:4px 12px" onclick="MP_f('${e}')">${e ? ETQ_P[e][2] : 'Todos'}</button>`).join('')}</div>` +
    (l.length ? l.map(p => `<div style="display:flex;gap:12px;background:#fff;border:1px solid #eee;border-radius:12px;padding:10px;margin-bottom:8px;flex-wrap:wrap;align-items:center">
      <div style="display:flex;gap:4px">${(p.imagenes || []).slice(0, 3).map(u => `<a href="${esc(u)}" target="_blank" rel="noopener"><img src="${esc(u)}" style="width:74px;height:74px;object-fit:cover;border-radius:8px;background:#f1f5f9" loading="lazy"></a>`).join('') || '<span style="color:#cbd5e1">sin fotos</span>'}</div>
      <div style="flex:1;min-width:220px"><strong>${esc(p.nombre)}</strong> ${tag(ETQ_P, p.estado)}<br>
        <span style="font-size:0.78rem;color:#64748b">${esc((p.mp_vendedores || {}).nombre_tienda || '')} · recibe ${$$(p.precio)}${p.precio_mayoreo3 ? ' (3+ pares: ' + $$(p.precio_mayoreo3) + ')' : ''} · envío ${$$(p.envio)} · ${esc(p.categoria || '')} · ${esc(p.material || '')}</span><br>
        <span style="font-size:0.74rem;color:#94a3b8">Tallas: ${(p.mp_variantes || []).filter(v => v.stock > 0).map(v => esc(v.talla) + (v.color ? ' ' + esc(v.color) : '') + ' (' + v.stock + ')').join(', ') || 'sin existencias'}</span>
        ${p.descripcion ? `<br><span style="font-size:0.76rem;color:#475569">${esc(String(p.descripcion).slice(0, 220))}</span>` : ''}
        ${p.motivo_rechazo ? `<br><span style="font-size:0.76rem;color:#b3261e">Motivo: ${esc(p.motivo_rechazo)}</span>` : ''}</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${p.estado !== 'publicado' ? `<button class="btn btn-primary" style="font-size:0.74rem;padding:4px 12px" onclick="mpProdEstado('${esc(p.id)}','publicado')">Aprobar y publicar</button>` : `<button class="btn btn-secondary" style="font-size:0.74rem;padding:4px 12px" onclick="mpProdEstado('${esc(p.id)}','pausado')">Pausar</button>`}
        ${p.estado !== 'rechazado' ? `<button class="btn btn-secondary" style="font-size:0.74rem;padding:4px 12px;color:#b3261e" onclick="mpProdEstado('${esc(p.id)}','rechazado')">Pedir cambios</button>` : ''}</div></div>`).join('')
      : '<p style="color:#94a3b8;padding:1rem">No hay productos en este estado.</p>')
}
window.MP_f = (e) => { MP.filtroProd = e; mpTab('productos') }
window.mpProdEstado = async (id, estado) => {
  let motivo
  if (estado === 'rechazado') { motivo = prompt('¿Qué debe corregir el vendedor? (se lo mandamos por correo)'); if (!motivo) return }
  else if (!confirm(estado === 'publicado' ? '¿Publicar este producto en tu sitio?' : '¿Pausar este producto?')) return
  try { await mpApi('/marketplace/admin/productos/' + id, { method: 'PATCH', json: { estado, motivo_rechazo: motivo } }); mpTab('productos') } catch (e) { alert(e.message) }
}

async function mpPedidos(c) {
  const l = await mpApi('/marketplace/admin/pedidos' + (MP.filtroPed ? '?status=' + MP.filtroPed : '')); MP.datos.ped = l
  c.innerHTML = `<div style="display:flex;gap:8px;align-items:center;margin-bottom:10px;flex-wrap:wrap"><span style="font-size:0.8rem;color:#64748b">Ver:</span>
    ${['', 'pagado', 'recibido', 'enviado', 'entregado', 'cancelado', 'pendiente_pago'].map(e => `<button class="btn ${MP.filtroPed === e ? 'btn-primary' : 'btn-secondary'}" style="font-size:0.74rem;padding:4px 12px" onclick="MP_p('${e}')">${e ? ETQ_O[e][2] : 'Pagados y en curso'}</button>`).join('')}</div>` +
    (l.length ? `<div class="table-card"><table><thead><tr><th>Pedido</th><th>Tienda</th><th>Clienta</th><th>Productos</th><th>Total</th><th>Tu ganancia</th><th>Estado</th><th></th></tr></thead><tbody>
      ${l.map(p => `<tr><td><strong>#${esc(p.numero)}</strong><br><span style="font-size:0.7rem;color:#94a3b8">${new Date(p.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}</span></td>
        <td>${esc((p.mp_vendedores || {}).nombre_tienda || '')}</td><td style="font-size:0.78rem">${esc(p.cliente_nombre)}<br>${esc(p.cliente_telefono || '')}<br>${esc(p.ciudad || '')}</td>
        <td style="font-size:0.76rem">${(p.mp_pedido_items || []).map(i => `${i.cantidad}× ${esc(i.nombre)} T${esc(i.talla)}`).join('<br>')}</td>
        <td>${$$(p.total)}<br><span style="font-size:0.7rem;color:#94a3b8">al vendedor ${$$(p.neto_vendedor)}</span></td><td><b>${$$(p.comision)}</b>${Number(p.envio_negocio) ? `<br><span style="font-size:0.7rem;color:#64748b">+ envío ${$$(p.envio_negocio)} es tuyo</span>` : ''}</td>
        <td>${tag(ETQ_O, p.status)}${p.modo_envio === 'consolidado' ? '<br><span style="font-size:0.7rem;color:#7c3aed;font-weight:700">📦 Cruzado: lo recibes tú</span>' : ''}${p.pedido_negocio_id ? `<br><span style="font-size:0.7rem;color:#64748b">con tu pedido #${esc(String(p.pedido_negocio_id).slice(0, 8).toUpperCase())}</span>` : ''}${p.guia ? `<br><span style="font-size:0.7rem">${esc(p.paqueteria)} ${esc(p.guia)}</span>` : ''}${p.liquidacion_id ? '<br><span style="font-size:0.7rem;color:#2e7d32">liquidado</span>' : ''}</td>
        <td style="white-space:nowrap">${p.status === 'pagado' && p.modo_envio === 'consolidado' ? `<button class="btn btn-primary" style="font-size:0.72rem;padding:3px 10px" onclick="mpPedAccion('${esc(p.id)}','recibido')">Recibí los pares</button> ` : ''}${['enviado', 'recibido'].includes(p.status) ? `<button class="btn btn-secondary" style="font-size:0.72rem;padding:3px 10px" onclick="mpPedAccion('${esc(p.id)}','entregado')">Entregado</button>` : ''}
          ${['pagado', 'recibido', 'enviado'].includes(p.status) && !p.liquidacion_id ? `<button class="btn btn-secondary" style="font-size:0.72rem;padding:3px 10px;color:#b3261e" onclick="mpPedAccion('${esc(p.id)}','cancelar')">Cancelar</button>` : ''}</td></tr>`).join('')}</tbody></table></div>`
      : '<p style="color:#94a3b8;padding:1rem">No hay pedidos todavía.</p>')
}
window.MP_p = (e) => { MP.filtroPed = e; mpTab('pedidos') }
window.mpPedAccion = async (id, accion) => {
  if (accion === 'cancelar' && !confirm('¿Cancelar este pedido? Se regresan las existencias al vendedor. El reembolso a la clienta lo haces tú en MercadoPago.')) return
  try {
    const d = await mpApi(`/marketplace/admin/pedidos/${id}/${accion}`, { method: 'POST' })
    if (d.recordatorio) alert('Pedido cancelado. ' + d.recordatorio)
    mpTab('pedidos')
  } catch (e) { alert(e.message) }
}

async function mpPagos(c) {
  const l = await mpApi('/marketplace/admin/saldos'); MP.datos.saldos = l
  c.innerHTML = `<p style="font-size:0.8rem;color:#64748b;margin:0 0 10px">«Por pagar» = pedidos que el vendedor ya envió, o que tú recibiste hace 24 horas o más (pedidos cruzados: a las tiendas se les paga 24 horas después de que recibes sus pares), y todavía no le depositas. Al liquidar, haces el depósito a su cuenta y aquí lo registras: el sistema le avisa por correo.</p>` +
    (l.length ? `<div class="table-card"><table><thead><tr><th>Vendedor</th><th>Por pagar</th><th>Por enviar (aún no es tuyo)</th><th>Ya liquidado</th><th>Datos para depositar</th><th></th></tr></thead><tbody>
      ${l.map(v => `<tr><td><strong>${esc(v.nombre_tienda)}</strong></td><td><b style="color:#be185d">${$$(v.por_pagar)}</b><br><span style="font-size:0.7rem;color:#94a3b8">${v.pedidos_por_liquidar} pedido(s)</span></td><td>${$$(v.por_enviar)}</td><td>${$$(v.liquidado)}</td>
        <td style="font-size:0.76rem">${v.clabe ? `${esc(v.titular || '')}<br>${esc(v.banco || '')}<br><b>${esc(v.clabe)}</b>` : '<span style="color:#b26a00">Aún no capturó su CLABE</span>'}</td>
        <td>${v.por_pagar > 0 ? `<button class="btn btn-primary" style="font-size:0.74rem;padding:4px 12px" onclick="mpLiquidar('${esc(v.id)}','${esc(v.nombre_tienda).replace(/'/g, '')}',${v.por_pagar})">Liquidar ${$$(v.por_pagar)}</button>` : ''}</td></tr>`).join('')}</tbody></table></div>`
      : '<p style="color:#94a3b8;padding:1rem">Todavía no hay nada por liquidar.</p>')
}
window.mpLiquidar = async (id, nombre, monto) => {
  const ref = prompt(`Vas a registrar el depósito de ${$$(monto)} a ${nombre}.\nPrimero haz la transferencia. Escribe la referencia o clave de rastreo (opcional):`, ''); if (ref === null) return
  try { const d = await mpApi('/marketplace/admin/liquidar', { method: 'POST', json: { vendedor_id: id, referencia: ref } }); alert(`Registrado: ${$$(d.monto)} por ${d.pedidos} pedido(s).`); mpTab('pagos') } catch (e) { alert(e.message) }
}

async function mpAjustes(c) {
  const a = await mpApi('/marketplace/admin/ajustes'); MP.datos.aj = a
  c.innerHTML = `<div style="background:#fff;border:1px solid #eee;border-radius:12px;padding:1.1rem 1.25rem;max-width:620px">
    <p style="font-size:0.82rem;color:#475569;margin:0 0 10px;line-height:1.5">El precio al público de cada producto = <b>lo que quiere recibir la tienda + tu ganancia por par + la comisión de MercadoPago</b>. Pon aquí la comisión que te cobra MercadoPago a ti
    (revísala en tu cuenta de MercadoPago → Costos; cambia según el medio de pago). Si la subes, los precios del marketplace suben solos.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px">
      <label style="font-size:0.74rem;color:#64748b">Comisión de MercadoPago (%)<input class="form-input" id="mp-a-pct" type="number" step="0.01" value="${a.pct}"></label>
      <label style="font-size:0.74rem;color:#64748b">Cuota fija por pago ($)<input class="form-input" id="mp-a-fijo" type="number" step="0.01" value="${a.fijo}"></label>
      <label style="font-size:0.74rem;color:#64748b">IVA sobre la comisión (%)<input class="form-input" id="mp-a-iva" type="number" step="0.01" value="${a.iva}"></label></div>
    <p style="font-size:0.78rem;color:#475569;margin:12px 0 0">Ejemplo: una tienda que quiere recibir <b>$${a.ejemplo.neto}</b> → la clienta ve <b>${$$(a.ejemplo.precio_publico)}</b> (incluye tu ganancia de ${$$(a.ganancia_por_par)} por par y la comisión de MercadoPago).</p>
    <div style="margin-top:12px"><button class="btn btn-primary" onclick="mpGuardarAjustes()">Guardar</button></div>
    <p style="font-size:0.74rem;color:#94a3b8;margin:10px 0 0">Tu ganancia por par ($20 por defecto) se cambia por tienda en Vendedores → Ajustes.</p></div>`
}
window.mpGuardarAjustes = async () => {
  try {
    const v = (id) => document.getElementById(id).value
    await mpApi('/marketplace/admin/ajustes', { method: 'PATCH', json: { pct: v('mp-a-pct'), fijo: v('mp-a-fijo'), iva: v('mp-a-iva') } })
    alert('Guardado. Los precios del marketplace ya usan la nueva comisión.'); mpTab('ajustes')
  } catch (e) { alert(e.message) }
}

// número de pendientes en el menú (vendedores + productos por aprobar + pedidos por enviar)
async function mpBadge() {
  try {
    const r = await mpApi('/marketplace/admin/resumen')
    const n = (r.vendedores_pendientes || 0) + (r.productos_por_aprobar || 0)
    const b = document.getElementById('badge-marketplace')
    if (b) { b.textContent = n; b.style.display = n > 0 ? 'inline' : 'none' }
  } catch (e) {}
}
setTimeout(mpBadge, 3000)
if (window._mpBadgeInt) clearInterval(window._mpBadgeInt)
window._mpBadgeInt = setInterval(mpBadge, 120000)
