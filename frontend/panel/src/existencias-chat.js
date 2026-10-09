// ═══ Conversaciones: buscador de tallas y existencias ═══════════════════════════════════════════════════════════════════════════
// Antes se mandaban las fotos «a ciegas» y no se sabía si había el modelo o la talla. Aquí se busca un modelo, se filtra por la talla
// que pide la clienta y se ve, por color, qué tallas hay (con cuántas piezas). Desde la misma ventana se manda la foto con el precio
// del sitio y las tallas disponibles ya escritas, una por una o varias juntas.
const API = '/api'
const esc = (v) => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const norm = (v) => String(v == null ? '' : v).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const yo = () => (window._empleadoActual && window._empleadoActual.nombre) || 'Admin'

let E = null   // estado de la ventana abierta

// Precios públicos del sitio (igual que la tienda y que Maya): menudeo = precio de panel + $80 salvo ofertas; desde 3 pares −$60
const preciosWeb = (p) => {
  const pm = parseFloat(p.precio_menudeo) || 0
  if (!pm) return { menudeo: 0, p3: 0 }
  const m = p.es_oferta ? pm : Math.round(pm + 80)
  return { menudeo: m, p3: p.es_oferta ? m : m - 60 }
}
const miniatura = (u, w = 96) => (u && /\/image\/upload\//.test(u)) ? u.replace('/image/upload/', `/image/upload/w_${w},h_${w},c_fill,f_auto,q_auto/`) : u
// Para mandar por WhatsApp: siempre JPG y de tamaño razonable (WhatsApp no acepta webp en imágenes)
const paraWhatsApp = (u) => (u && /\/image\/upload\//.test(u)) ? u.replace('/image/upload/', '/image/upload/w_1200,c_limit,f_jpg,q_auto/') : u
const num = (t) => parseFloat(String(t).replace(',', '.')) || 0

function construirIndice() {
  const prods = (window._productosWA || []).filter(p => p.activo !== false)
  const porProd = new Map(prods.map(p => [p.id, p]))
  const stock = new Map()   // variante_id -> piezas (según la sucursal elegida)
  E.inv.forEach(r => {
    if (E.sucursal && r.sucursal_id !== E.sucursal) return
    stock.set(r.variante_id, (stock.get(r.variante_id) || 0) + (parseInt(r.cantidad) || 0))
  })
  const mapa = new Map()    // producto_id -> { p, colores: Map(color -> {...}) }
  E.vars.forEach(v => {
    const p = porProd.get(v.producto_id); if (!p || v.activa === false) return
    let m = mapa.get(p.id); if (!m) { m = { p, colores: new Map() }; mapa.set(p.id, m) }
    const nombreColor = v.color || 'Color único'
    let c = m.colores.get(nombreColor)
    if (!c) { c = { color: nombreColor, hex: v.color_hex || '', foto: '', tallas: [] }; m.colores.set(nombreColor, c) }
    if (!c.foto) c.foto = v.foto_url || (v.imagenes && v.imagenes[0]) || ''
    c.tallas.push({ talla: String(v.talla == null ? '' : v.talla), stock: stock.get(v.id) || 0 })
  })
  mapa.forEach(m => m.colores.forEach(c => {
    c.tallas.sort((a, b) => num(a.talla) - num(b.talla))
    c.total = c.tallas.reduce((s, t) => s + t.stock, 0)
    if (!c.foto) c.foto = m.p.imagen_principal || ''
  }))
  E.indice = [...mapa.values()]
  E.todasTallas = [...new Set(E.vars.map(v => String(v.talla == null ? '' : v.talla)).filter(Boolean))].sort((a, b) => num(a) - num(b))
  E.categorias = [...new Set(prods.map(p => p.categoria).filter(Boolean))].sort()
}

function filtrar() {
  const toks = norm(E.q).split(/\s+/).filter(Boolean)
  const out = []
  E.indice.forEach(m => {
    const p = m.p
    if (E.cat && p.categoria !== E.cat) return
    const base = norm(`${p.nombre} ${p.sku_interno || ''} ${p.categoria || ''} ${p.subcategoria || ''}`)
    const colores = [...m.colores.values()].filter(c => {
      if (toks.length && !toks.every(t => base.includes(t) || norm(c.color).includes(t))) return false
      if (E.tallasSel.size) return c.tallas.some(t => E.tallasSel.has(t.talla) && t.stock > 0)
      if (E.soloExist) return c.total > 0
      return true
    })
    if (colores.length) out.push({ p, colores })
  })
  return out
}

const chipTalla = (t, resaltar) => t.stock > 0
  ? `<span style="display:inline-flex;gap:2px;align-items:baseline;background:${resaltar ? '#dcfce7' : '#f0fdf4'};border:1px solid ${resaltar ? '#16a34a' : '#bbf7d0'};color:#166534;border-radius:7px;padding:2px 6px;font-size:0.74rem;font-weight:700">${esc(t.talla)}<small style="font-weight:600;color:#15803d">·${t.stock}</small></span>`
  : `<span style="display:inline-flex;background:#f8fafc;border:1px solid #e2e8f0;color:#b6bfcb;border-radius:7px;padding:2px 6px;font-size:0.74rem;text-decoration:line-through">${esc(t.talla)}</span>`

function textoCliente(p, c) {
  const disp = c.tallas.filter(t => t.stock > 0).map(t => t.talla)
  const pr = preciosWeb(p)
  let t = `${p.nombre}${c.color && c.color !== 'Color único' ? ' · ' + c.color : ''}`
  if (E.conPrecio && pr.menudeo) t += `\n$${pr.menudeo}` + (pr.p3 && pr.p3 < pr.menudeo ? ` · 3+ pares $${pr.p3} c/u` : '')
  t += disp.length ? `\nTallas disponibles: ${disp.join(', ')}` : '\nAgotado por ahora'
  return t
}

function pintar() {
  const cont = document.getElementById('ex-lista'); if (!cont) return
  const res = filtrar()
  const mostrar = res.slice(0, E.limite)
  const nSel = E.sel.size
  cont.innerHTML = res.length ? mostrar.map(({ p, colores }) => {
    const pr = preciosWeb(p)
    return `<div style="border:1px solid #eef0f3;border-radius:12px;padding:10px 12px;margin-bottom:10px;background:#fff">
      <div style="display:flex;justify-content:space-between;gap:8px;align-items:baseline;flex-flow:row wrap">
        <div style="font-size:0.88rem;font-weight:700;color:#0f172a;min-width:0">${esc(p.nombre)} <span style="font-weight:500;color:#94a3b8;font-size:0.72rem">${esc(p.sku_interno || '')}</span></div>
        ${pr.menudeo ? `<div style="font-size:0.78rem;color:#be185d;font-weight:700;white-space:nowrap">$${pr.menudeo}${pr.p3 && pr.p3 < pr.menudeo ? ` <span style="color:#94a3b8;font-weight:500">· 3+ $${pr.p3}</span>` : ''}${p.es_oferta ? ' <span style="background:#fef3c7;color:#92400e;border-radius:6px;padding:0 5px;font-size:0.68rem">oferta</span>' : ''}</div>` : ''}
      </div>
      ${colores.map(c => {
        const key = p.id + '|' + c.color, marcada = E.sel.has(key)
        const miniaturaUrl = miniatura(c.foto)
        return `<div data-k="${esc(key)}" class="ex-fila" style="padding:7px 0;border-top:1px solid #f4f5f7">
          <input type="checkbox" data-a="sel" ${marcada ? 'checked' : ''} ${c.foto ? '' : 'disabled title="Este color no tiene foto"'} style="width:17px;height:17px;accent-color:#E91E8C;flex-shrink:0">
          ${miniaturaUrl ? `<img src="${esc(miniaturaUrl)}" loading="lazy" alt="" data-a="ver" style="width:46px;height:46px;border-radius:9px;object-fit:cover;background:#f1f5f9;cursor:zoom-in;flex-shrink:0">` : '<div style="width:46px;height:46px;border-radius:9px;background:#f1f5f9;flex-shrink:0"></div>'}
          <div class="ex-info">
            <div style="font-size:0.8rem;font-weight:600;color:#334155;display:flex;align-items:center;gap:5px">${c.hex ? `<i style="width:11px;height:11px;border-radius:50%;background:${esc(c.hex)};border:1px solid #cbd5e1;display:inline-block"></i>` : ''}${esc(c.color)}<span style="font-weight:500;color:${c.total ? '#16a34a' : '#dc2626'};font-size:0.72rem">${c.total ? c.total + ' pz' : 'agotado'}</span></div>
            <div style="display:flex;flex-flow:row wrap;gap:4px;margin-top:4px">${c.tallas.map(t => chipTalla(t, E.tallasSel.has(t.talla))).join('')}</div>
          </div>
          <div class="ex-acc">
            <button type="button" data-a="foto" ${c.foto ? '' : 'disabled'} style="border:1px solid #f9a8d4;background:#fdf2f8;color:#be185d;border-radius:8px;padding:6px 10px;font-size:0.74rem;font-weight:700;cursor:pointer">📷 Enviar</button>
            <button type="button" data-a="texto" title="Solo avisar las tallas por texto, sin foto" style="border:1px solid #e2e8f0;background:#fff;color:#475569;border-radius:8px;padding:6px 9px;font-size:0.74rem;cursor:pointer">💬</button>
          </div>
        </div>`
      }).join('')}
    </div>`
  }).join('') + (res.length > mostrar.length ? `<button type="button" data-a="mas" style="width:100%;border:1px dashed #cbd5e1;background:#fff;border-radius:10px;padding:10px;font-size:0.82rem;color:#475569;cursor:pointer;margin-bottom:8px">Mostrar más (${res.length - mostrar.length} modelos)</button>` : '')
    : `<p style="text-align:center;color:#94a3b8;font-size:0.85rem;padding:2rem 1rem">${E.tallasSel.size ? 'Ningún modelo tiene esa talla ahora.' : 'Sin resultados. Prueba con otra palabra o quita filtros.'}</p>`
  const n = document.getElementById('ex-n'); if (n) n.textContent = `${res.length} modelo${res.length === 1 ? '' : 's'}`
  pintarPie()
}

function pintarPie() {
  const pie = document.getElementById('ex-pie'); if (!pie) return
  const n = E.sel.size
  pie.style.display = n ? 'flex' : 'none'
  pie.innerHTML = `<div style="font-size:0.8rem;font-weight:700;color:#0f172a">${n} foto${n === 1 ? '' : 's'} seleccionada${n === 1 ? '' : 's'}${n > 10 ? ' <span style="color:#dc2626;font-weight:600">(máx. 10)</span>' : ''}</div>
    ${n > 1 ? `<input id="ex-intro" value="${esc(E.intro)}" placeholder="Mensaje antes de las fotos" style="flex:1;min-width:140px;border:1px solid #e2e8f0;border-radius:8px;padding:7px 9px;font-size:0.8rem;outline:none">` : '<div style="flex:1"></div>'}
    <button type="button" data-a="limpiar" style="border:1px solid #e2e8f0;background:#fff;color:#64748b;border-radius:8px;padding:8px 10px;font-size:0.78rem;cursor:pointer">Quitar</button>
    <button type="button" data-a="enviar" ${n > 10 ? 'disabled' : ''} style="border:none;background:#E91E8C;color:#fff;border-radius:8px;padding:9px 14px;font-size:0.82rem;font-weight:700;cursor:pointer">Enviar ${n} foto${n === 1 ? '' : 's'}</button>`
}

function pintarFiltros() {
  const f = document.getElementById('ex-filtros'); if (!f) return
  const chip = (on) => `border:1px solid ${on ? '#E91E8C' : '#e2e8f0'};background:${on ? '#fdf2f8' : '#fff'};color:${on ? '#be185d' : '#475569'};border-radius:100px;padding:5px 11px;font-size:0.76rem;cursor:pointer;font-weight:${on ? 700 : 500};white-space:nowrap;flex-shrink:0`
  f.innerHTML = `
    <div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:6px;scrollbar-width:none">
      <button type="button" data-a="cat" data-v="" style="${chip(!E.cat)}">Todos</button>
      ${E.categorias.map(c => `<button type="button" data-a="cat" data-v="${esc(c)}" style="${chip(E.cat === c)}">${esc(c.charAt(0).toUpperCase() + c.slice(1))}</button>`).join('')}
    </div>
    <div style="font-size:0.7rem;font-weight:700;color:#64748b;margin:2px 0 4px">¿QUÉ TALLA PIDE?</div>
    <div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:6px;scrollbar-width:none">
      ${E.todasTallas.map(t => `<button type="button" data-a="talla" data-v="${esc(t)}" style="${chip(E.tallasSel.has(t))};min-width:38px">${esc(t)}</button>`).join('')}
      ${E.tallasSel.size ? `<button type="button" data-a="tallas0" style="${chip(false)};color:#b91c1c">✕ quitar</button>` : ''}
    </div>
    <div style="display:flex;gap:14px;flex-flow:row wrap;font-size:0.76rem;color:#475569;align-items:center">
      <label style="display:flex;gap:5px;align-items:center;cursor:pointer"><input type="checkbox" data-a="solo" ${E.soloExist ? 'checked' : ''} style="accent-color:#E91E8C"> Solo con existencia</label>
      <label style="display:flex;gap:5px;align-items:center;cursor:pointer"><input type="checkbox" data-a="precio" ${E.conPrecio ? 'checked' : ''} style="accent-color:#E91E8C"> Poner precio al enviar</label>
      <span id="ex-n" style="margin-left:auto;color:#94a3b8"></span>
    </div>`
}

async function cargarDatos() {
  const lista = document.getElementById('ex-lista')
  if (lista) lista.innerHTML = '<p style="text-align:center;color:#94a3b8;font-size:0.85rem;padding:2rem">Consultando existencias…</p>'
  try {
    const [vars, inv, sucs] = await Promise.all([
      fetch(API + '/variantes/').then(r => r.json()),
      fetch(API + '/inventario/?ligero=true&fresh=true').then(r => r.json()),
      E.sucursales.length ? Promise.resolve(E.sucursales) : fetch(API + '/sucursales/').then(r => r.json()).catch(() => []),
    ])
    E.vars = Array.isArray(vars) ? vars : []
    E.inv = Array.isArray(inv) ? inv : []
    E.sucursales = Array.isArray(sucs) ? sucs : []
    const sel = document.getElementById('ex-suc')
    if (sel) sel.innerHTML = '<option value="">Todas las sucursales</option>' + E.sucursales.map(s => `<option value="${esc(s.id)}" ${s.id === E.sucursal ? 'selected' : ''}>${esc(s.nombre)}</option>`).join('')
    const hora = document.getElementById('ex-hora'); if (hora) hora.textContent = 'Actualizado ' + new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    construirIndice(); pintarFiltros(); pintar()
  } catch (e) {
    if (lista) lista.innerHTML = `<p style="text-align:center;color:#b91c1c;font-size:0.85rem;padding:2rem">No se pudieron cargar las existencias: ${esc(e.message)}</p>`
  }
}

// Cierra la ventana (después de enviar fotos); el aviso «✓ enviada» queda a la vista porque no vive dentro de la ventana
function cerrarVentana() { document.getElementById('modal-exist')?.remove(); E = null }

function aviso(t, ok = true) {
  const d = document.createElement('div'); d.textContent = t
  d.style.cssText = `position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:${ok ? '#0f172a' : '#b91c1c'};color:#fff;padding:9px 16px;border-radius:100px;font-size:0.82rem;z-index:100100;max-width:90vw;text-align:center`
  document.body.appendChild(d); setTimeout(() => d.remove(), 2600)
}

async function post(ruta, cuerpo) {
  const r = await fetch(API + ruta, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo) })
  const d = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(d.error || ('Error ' + r.status))
  return d
}

function datosFila(key) {
  const [pid, color] = [key.slice(0, key.indexOf('|')), key.slice(key.indexOf('|') + 1)]
  const m = E.indice.find(x => x.p.id === pid); if (!m) return null
  const c = m.colores.get(color); if (!c) return null
  return { p: m.p, c }
}

async function enviarFoto(key) {
  const f = datosFila(key); if (!f || !f.c.foto) return
  try {
    aviso('📤 Enviando foto…')
    await post(`/chatbot/chats/${encodeURIComponent(E.tel)}/imagen`, { imagen_url: paraWhatsApp(f.c.foto), caption: textoCliente(f.p, f.c), agente: yo() })
    aviso('✓ Foto enviada')
    const tel = E.tel
    cerrarVentana()
    if (window._refrescarChatAbierto) window._refrescarChatAbierto(tel, false)
  } catch (e) { aviso('No se pudo enviar: ' + e.message, false) }
}
async function enviarTexto(key) {
  const f = datosFila(key); if (!f) return
  const disp = f.c.tallas.filter(t => t.stock > 0).map(t => t.talla)
  const col = f.c.color && f.c.color !== 'Color único' ? ` en ${f.c.color}` : ''
  const msg = disp.length
    ? `Del modelo ${f.p.nombre}${col} tengo disponibles las tallas: ${disp.join(', ')} 👠`
    : `Del modelo ${f.p.nombre}${col} ya no tengo existencia por ahora. ¿Te muestro otros modelos parecidos? 👠`
  try {
    await post(`/chatbot/chats/${encodeURIComponent(E.tel)}/mensaje`, { mensaje: msg, agente: yo() })
    aviso('✓ Mensaje enviado')
    if (window._refrescarChatAbierto) window._refrescarChatAbierto(E.tel, false)
  } catch (e) { aviso('No se pudo enviar: ' + e.message, false) }
}
async function enviarSeleccion() {
  const claves = [...E.sel]; if (!claves.length || claves.length > 10) return
  const filas = claves.map(datosFila).filter(Boolean)
  if (!filas.length) return
  const btn = document.querySelector('#ex-pie [data-a="enviar"]'); if (btn) { btn.disabled = true; btn.textContent = 'Enviando…' }
  try {
    if (filas.length === 1) await post(`/chatbot/chats/${encodeURIComponent(E.tel)}/imagen`, { imagen_url: paraWhatsApp(filas[0].c.foto), caption: textoCliente(filas[0].p, filas[0].c), agente: yo() })
    else {
      E.intro = (document.getElementById('ex-intro')?.value || '').trim() || 'Mira estos modelos 👠'
      await post(`/chatbot/chats/${encodeURIComponent(E.tel)}/carrusel`, { cuerpo: E.intro, tarjetas: filas.map(f => ({ imagen_url: paraWhatsApp(f.c.foto), texto: textoCliente(f.p, f.c) })), agente: yo() })
    }
    aviso(`✓ ${filas.length} foto${filas.length === 1 ? '' : 's'} enviada${filas.length === 1 ? '' : 's'}`)
    const tel = E.tel
    cerrarVentana()
    if (window._refrescarChatAbierto) window._refrescarChatAbierto(tel, false)
  } catch (e) { aviso('No se pudo enviar: ' + e.message, false); pintarPie() }
}

function verFoto(url) {
  const o = document.createElement('div')
  o.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:100200;display:flex;align-items:center;justify-content:center;padding:14px'
  o.innerHTML = `<img src="${esc(miniatura(url, 900))}" style="max-width:100%;max-height:100%;border-radius:12px">`
  o.onclick = () => o.remove()
  document.body.appendChild(o)
}

window.waExistencias = function (telefono) {
  document.getElementById('modal-exist')?.remove()
  if (!window._productosWA || !window._productosWA.length) { alert('Aún no cargan los productos. Espera un momento y vuelve a intentarlo.'); return }
  E = { tel: telefono, vars: [], inv: [], sucursales: E ? E.sucursales : [], sucursal: '', q: '', cat: '', tallasSel: new Set(), soloExist: true, conPrecio: true, sel: new Map(), intro: 'Mira estos modelos 👠', limite: 30, indice: [], todasTallas: [], categorias: [] }
  E.sel = new Set()
  const m = document.createElement('div'); m.id = 'modal-exist'
  m.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.55);z-index:10050;display:flex;align-items:flex-end;justify-content:center'
  m.innerHTML = `<style>
    #modal-exist .ex-fila{display:flex;gap:9px;align-items:center;flex-flow:row wrap}
    #modal-exist .ex-info{flex:1 1 0;min-width:120px}
    #modal-exist .ex-acc{display:flex;gap:6px;flex-shrink:0}
    @media (max-width:560px){ #modal-exist .ex-acc{flex:1 1 100%;justify-content:flex-end} }
  </style><div style="background:#f8fafc;width:min(780px,100%);height:min(94vh,900px);border-radius:18px 18px 0 0;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 -10px 40px rgba(0,0,0,0.25)">
    <div style="background:#fff;padding:12px 14px 8px;border-bottom:1px solid #eef0f3">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-flow:row wrap">
        <div style="font-size:1rem;font-weight:800;color:#0f172a;flex:1;min-width:150px">🔎 Tallas y existencias <span id="ex-hora" style="font-size:0.68rem;font-weight:500;color:#94a3b8;margin-left:4px"></span></div>
        <select id="ex-suc" style="border:1px solid #e2e8f0;border-radius:8px;padding:6px 8px;font-size:0.76rem;background:#fff;flex:0 1 190px;min-width:0"><option value="">Todas las sucursales</option></select>
        <button type="button" data-a="recargar" title="Volver a consultar existencias" style="border:1px solid #e2e8f0;background:#fff;border-radius:8px;padding:6px 9px;cursor:pointer;font-size:0.85rem">↻</button>
        <button type="button" data-a="cerrar" style="border:none;background:none;font-size:1.3rem;cursor:pointer;color:#64748b;padding:0 4px">✕</button>
      </div>
      <input id="ex-q" type="search" autocomplete="off" placeholder="Buscar modelo, color o clave (ej: bota negra, ML115)…" style="width:100%;box-sizing:border-box;border:1px solid #e2e8f0;border-radius:10px;padding:10px 12px;font-size:0.88rem;outline:none;margin-bottom:8px">
      <div id="ex-filtros"></div>
    </div>
    <div id="ex-lista" style="flex:1;overflow-y:auto;padding:10px 12px"></div>
    <div id="ex-pie" style="display:none;gap:8px;align-items:center;flex-flow:row wrap;background:#fff;border-top:1px solid #eef0f3;padding:10px 12px"></div>
  </div>`
  document.body.appendChild(m)
  const cerrar = cerrarVentana
  m.addEventListener('mousedown', (e) => { m._abajo = e.target === m })
  m.addEventListener('click', (e) => {
    if (e.target === m && m._abajo) return cerrar()
    const el = e.target.closest('[data-a]'); if (!el || !E) return
    const a = el.dataset.a, fila = el.closest('[data-k]'), key = fila && fila.dataset.k
    if (a === 'cerrar') return cerrar()
    if (a === 'recargar') return cargarDatos()
    if (a === 'cat') { E.cat = el.dataset.v; E.limite = 30; pintarFiltros(); return pintar() }
    if (a === 'talla') { const t = el.dataset.v; if (E.tallasSel.has(t)) E.tallasSel.delete(t); else E.tallasSel.add(t); E.limite = 30; pintarFiltros(); return pintar() }
    if (a === 'tallas0') { E.tallasSel.clear(); pintarFiltros(); return pintar() }
    if (a === 'mas') { E.limite += 30; return pintar() }
    if (a === 'foto') return enviarFoto(key)
    if (a === 'texto') return enviarTexto(key)
    if (a === 'ver') { const f = datosFila(key); if (f && f.c.foto) verFoto(f.c.foto); return }
    if (a === 'limpiar') { E.sel.clear(); return pintar() }
    if (a === 'enviar') return enviarSeleccion()
  })
  m.addEventListener('change', (e) => {
    const el = e.target; if (!E || !el.dataset) return
    if (el.dataset.a === 'solo') { E.soloExist = el.checked; E.limite = 30; return pintar() }
    if (el.dataset.a === 'precio') { E.conPrecio = el.checked; return }
    if (el.dataset.a === 'sel') { const key = el.closest('[data-k]').dataset.k; if (el.checked) E.sel.add(key); else E.sel.delete(key); return pintarPie() }
    if (el.id === 'ex-suc') { E.sucursal = el.value; construirIndice(); return pintar() }
  })
  let tmr = null
  m.querySelector('#ex-q').addEventListener('input', (e) => { clearTimeout(tmr); tmr = setTimeout(() => { E.q = e.target.value; E.limite = 30; pintar() }, 180) })
  cargarDatos().then(() => document.getElementById('ex-q')?.focus())
}
