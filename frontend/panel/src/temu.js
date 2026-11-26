// ═══ TEMU (pantalla de la integración) ══════════════════════════════════════════════════════════════════════════════════
// Por ahora solo aparece en la DEMO (con datos inventados). Cuando la conexión real con la API de Temu esté lista, se muestra con datos de la tienda.
const API = '/api'
const COLOR = '#fb7701'
const esc = (v) => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const mxn = (n) => '$' + Number(n || 0).toLocaleString('es-MX', { maximumFractionDigits: 0 })
const card = (h) => `<div style="background:#fff;border:1px solid #eee;border-radius:14px;padding:1.3rem;box-shadow:0 1px 2px rgba(0,0,0,0.03);margin-bottom:1rem">${h}</div>`
const stat = (v, t, c = '#111', s = '') => `<div style="background:#fff;border:1px solid #eee;border-radius:14px;padding:1.1rem"><p style="font-size:1.5rem;font-weight:800;color:${c};margin:0">${v}</p><p style="font-size:0.72rem;color:#888;margin:2px 0 0;text-transform:uppercase;letter-spacing:0.04em">${t}</p>${s ? `<p style="font-size:0.72rem;color:#aaa;margin:3px 0 0">${s}</p>` : ''}</div>`
const badge = (t, c, bg) => `<span style="font-size:0.72rem;font-weight:700;padding:2px 9px;border-radius:100px;background:${bg};color:${c};white-space:nowrap">${esc(t)}</span>`
const EST = { 'Activo': ['#166534', '#dcfce7'], 'En revisión': ['#92400e', '#fef3c7'], 'Pausado': ['#555', '#eee'], 'Por enviar': ['#b45309', '#fef3c7'], 'Enviado': ['#1d4ed8', '#dbeafe'], 'Entregado': ['#166534', '#dcfce7'] }
const est = (t) => { const [c, bg] = EST[t] || ['#555', '#eee']; return badge(t, c, bg) }
const tabla = (cols, filas, vacio) => filas.length ? `<div style="overflow-x:auto;border:1px solid var(--border);border-radius:8px"><table style="width:100%;border-collapse:collapse"><thead><tr style="background:var(--bg-secondary)">${cols.map(c => `<th style="padding:0.45rem 0.6rem;font-size:0.75rem;text-align:${c.der ? 'right' : 'left'};color:#888;white-space:nowrap">${c.t}</th>`).join('')}</tr></thead><tbody>${filas.join('')}</tbody></table></div>` : `<p style="color:#aaa;font-size:0.85rem;margin:0">${vacio}</p>`
const td = (h, der = false, ex = '') => `<td style="padding:0.45rem 0.6rem;font-size:0.82rem;border-top:1px solid var(--border);${der ? 'text-align:right;' : ''}${ex}">${h}</td>`
const TABS = [{ id: 'resumen', t: 'Resumen' }, { id: 'productos', t: 'Productos' }, { id: 'pedidos', t: 'Pedidos' }, { id: 'existencias', t: 'Existencias' }]

async function get(ruta) {
  const r = await fetch(`${API}/temu${ruta}`)
  const d = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(d.error || d.detail || ('Error ' + r.status))
  return d
}

window.cargarTemu = async () => {
  const content = document.getElementById('content')
  content.innerHTML = `<div style="padding:1.5rem 2rem;max-width:1150px">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:0.15rem">
      <div style="width:32px;height:32px;border-radius:8px;background:${COLOR};display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;color:#fff;font-weight:800">T</div>
      <h2 style="margin:0;font-size:1.25rem">Temu</h2></div>
    <p style="color:#888;font-size:0.85rem;margin:2px 0 1.25rem 42px">Productos, pedidos y existencias de tu tienda en Temu México, conectados por su API.</p>
    <div id="tm-tabs" style="display:flex;gap:2px;flex-wrap:wrap;border-bottom:1px solid #e5e5e5;margin-bottom:1.5rem">${TABS.map(t => `<button data-tab="${t.id}" onclick="window._tmTab('${t.id}')" style="padding:0.7rem 1.1rem;border:none;background:transparent;cursor:pointer;font-size:0.86rem;border-bottom:2px solid transparent;color:#666;font-weight:600;font-family:inherit">${t.t}</button>`).join('')}</div>
    <div id="tm-body"></div></div>`
  window._tmTab(window._tmTabActivo || 'resumen')
}

window._tmTab = async (tab) => {
  window._tmTabActivo = tab
  document.querySelectorAll('#tm-tabs button').forEach(b => { const on = b.dataset.tab === tab; b.style.borderBottom = on ? `2px solid ${COLOR}` : '2px solid transparent'; b.style.color = on ? COLOR : '#666' })
  const body = document.getElementById('tm-body'); if (!body) return
  body.innerHTML = '<p style="padding:2rem;color:#aaa;font-size:0.85rem">Cargando…</p>'
  try {
    if (tab === 'resumen') {
      const d = await get('/resumen'), p = d.productos || {}, pe = d.pedidos_30d || {}
      body.innerHTML = card(`<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px"><div style="display:flex;align-items:center;gap:12px">
          <div style="width:40px;height:40px;border-radius:10px;background:${COLOR};display:flex;align-items:center;justify-content:center;font-size:20px;color:#fff;font-weight:800">T</div>
          <div><h3 style="margin:0 0 2px;font-size:1.05rem">${esc(d.tienda)} ${badge('Conectada', '#166534', '#dcfce7')}</h3><p style="margin:0;font-size:0.8rem;color:#888">${esc(d.region)} · vendedor local · el acceso se renueva solo</p></div></div></div>`)
        + `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:12px;margin-bottom:1rem">
          ${stat(p.activos, 'Productos activos', '#166534', `de ${p.total} en la lista`)}${stat(p.revision, 'En revisión de Temu', '#92400e')}${stat(pe.n, 'Pedidos (30 días)', COLOR)}${stat(mxn(pe.total), 'Vendido (30 días)', '#166534')}${stat(d.ventas_hoy, 'Pedidos de hoy', '#111')}</div>`
        + card(`<h3 style="margin:0 0 0.6rem;font-size:1rem">Qué hace la conexión</h3><ul style="margin:0;padding-left:18px;font-size:0.84rem;color:#555;line-height:1.7">
          <li>Sube tus modelos a Temu con sus fotos, tallas y colores, y mantiene las <b>existencias al día</b> con tu inventario.</li>
          <li>Trae los pedidos de Temu a tu sección de <b>Pedidos</b> y descuenta el inventario.</li>
          <li>Te avisa en el celular cuando entra un pedido y cuando hay que mandar guía.</li></ul>`)
    } else if (tab === 'productos') {
      const d = await get('/productos')
      body.innerHTML = card(`<h3 style="margin:0 0 0.8rem;font-size:1rem">Productos en Temu (${d.productos.length})</h3>` + tabla([{ t: 'Producto' }, { t: 'Estado' }, { t: 'SKUs', der: true }, { t: 'Existencias', der: true }, { t: 'Precio', der: true }, { t: 'Vistas (30 d)', der: true }],
        d.productos.map(p => `<tr>${td(`<div style="display:flex;gap:10px;align-items:center">${p.imagen ? `<img src="${esc(p.imagen)}" style="width:40px;height:40px;object-fit:cover;border-radius:6px">` : ''}<div><b>${esc(p.titulo)}</b><br><span style="font-size:0.7rem;color:#aaa;font-family:monospace">${esc(p.sku)}</span></div></div>`)}${td(est(p.estado))}${td(p.skus, true)}${td(p.stock, true)}${td(mxn(p.precio), true)}${td(p.vistas, true)}</tr>`), 'Sin productos.'))
    } else if (tab === 'pedidos') {
      const d = await get('/pedidos')
      body.innerHTML = card(`<h3 style="margin:0 0 0.8rem;font-size:1rem">Pedidos de Temu (últimos 30 días)</h3>` + tabla([{ t: 'Pedido' }, { t: 'Estado' }, { t: 'Artículo' }, { t: 'Total', der: true }, { t: 'Paquetería' }, { t: 'Guía' }, { t: 'Fecha' }],
        d.pedidos.map(p => `<tr>${td(`<span style="font-family:monospace;font-size:0.74rem">${esc(p.id)}</span>`)}${td(est(p.estado))}${td(esc(p.articulo))}${td(mxn(p.total), true, 'font-weight:600')}${td(esc(p.paqueteria))}${td(p.guia ? `<span style="font-family:monospace;font-size:0.74rem">${esc(p.guia)}</span>` : '<span style="color:#aaa">—</span>')}${td(`<span style="color:#888">${new Date(p.creado).toLocaleDateString('es-MX')}</span>`)}</tr>`), 'Sin pedidos.'))
    } else {
      body.innerHTML = card(`<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px"><div style="max-width:640px"><h3 style="margin:0 0 3px;font-size:1rem">Existencias automáticas ${badge('Encendidas', '#166534', '#dcfce7')}</h3>
        <p style="margin:0;font-size:0.82rem;color:#888">Cada 30 minutos el sistema compara cada talla y color de Temu con tu inventario y manda solo las que cambiaron, para no vender de más.</p></div>
        <button onclick="alert('En la demo no se envía nada a Temu.')" style="padding:0.55rem 1rem;border:1px solid #ddd;background:#fff;border-radius:8px;cursor:pointer;font-family:inherit">Ver qué cambiaría</button></div>`)
        + card(`<p style="margin:0;font-size:0.84rem;color:#555">Última revisión: hace 12 minutos · 312 SKUs comparados · <b>2</b> cambiaron.</p>`)
    }
  } catch (e) { body.innerHTML = `<div style="padding:0.8rem 1rem;border-radius:10px;background:#fef2f2;color:#991b1b;font-size:0.84rem">${esc(e.message || e)}</div>` }
}
