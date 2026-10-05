// Foto limpia: el dueño marca, por producto, cuál de sus fotos muestra el zapato claro (sin modelo). Se guarda en productos.foto_limpia
// y la usan el listado de la tienda, las tarjetas de las guías y el diseño «Solo la foto» de Publicaciones.
const API = '/api'
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const mini = (u) => (u && u.includes('res.cloudinary.com') && u.includes('/upload/')) ? u.replace('/upload/', '/upload/w_220,h_260,c_fill,g_auto,q_auto/') : u

const ST = { prods: [], galerias: {}, abierto: null, q: '', soloSin: false }

function css() {
  if (document.getElementById('fl-css')) return
  const s = document.createElement('style'); s.id = 'fl-css'
  s.textContent = `
  #fl-modal{position:fixed;inset:0;background:rgba(15,23,42,.55);z-index:9999;display:flex;align-items:flex-start;justify-content:center;padding:24px 12px;overflow:auto}
  #fl-caja{background:#fff;border-radius:16px;width:min(980px,100%);padding:18px 20px 24px;box-shadow:0 20px 60px rgba(0,0,0,.3)}
  .fl-fila{display:flex;gap:12px;align-items:center;padding:8px 6px;border-top:1px solid #f1f5f9;cursor:pointer}
  .fl-fila:hover{background:#faf5f7}
  .fl-fila img,.fl-sinf{width:54px;height:64px;border-radius:8px;object-fit:cover;background:#f1f5f9;flex:none}
  .fl-gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px;padding:8px 6px 14px 70px}
  .fl-ft{position:relative;border:2px solid #e2e8f0;border-radius:10px;overflow:hidden;cursor:pointer;background:#f8fafc}
  .fl-ft img{width:100%;aspect-ratio:3/4;object-fit:cover;display:block}
  .fl-ft.on{border-color:#16a34a;box-shadow:0 0 0 2px #bbf7d0}
  .fl-ft b{position:absolute;left:4px;top:4px;background:#16a34a;color:#fff;font-size:.62rem;padding:2px 6px;border-radius:999px}
  .fl-tag{font-size:.68rem;font-weight:700;border-radius:999px;padding:2px 8px}
  `
  document.head.appendChild(s)
}

const conLimpia = () => ST.prods.filter(p => p.foto_limpia).length

function pintar() {
  const caja = document.getElementById('fl-caja'); if (!caja) return
  const q = ST.q.toLowerCase()
  const lista = ST.prods.filter(p => (!ST.soloSin || !p.foto_limpia) && (!q || ((p.nombre || '') + ' ' + (p.sku_interno || '')).toLowerCase().includes(q)))
  caja.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:6px">
      <h3 style="margin:0">📸 Fotos limpias del zapato</h3>
      <button class="btn btn-secondary" onclick="flCerrar()">Cerrar</button>
    </div>
    <p style="font-size:.8rem;color:#64748b;margin:0 0 10px;line-height:1.5">Elige, de cada producto, la foto donde se ve mejor el zapato solo (sin modelo ni fondo recargado). Se usa en el listado de la tienda, en las guías y en el diseño «Solo la foto» de Publicaciones. Si no eliges ninguna, se sigue usando la portada. <b>${conLimpia()} de ${ST.prods.length}</b> productos ya tienen foto limpia.</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:8px;font-size:.8rem">
      <input type="text" class="form-input" style="max-width:300px" placeholder="Buscar por nombre o modelo" value="${esc(ST.q)}" oninput="flBuscar(this.value)">
      <label><input type="checkbox" ${ST.soloSin ? 'checked' : ''} onchange="flSoloSin(this.checked)"> Solo los que faltan</label>
    </div>
    <div>${lista.slice(0, 120).map(fila).join('') || '<p style="padding:1rem;color:#64748b">Ningún producto coincide.</p>'}</div>
    ${lista.length > 120 ? `<p style="font-size:.74rem;color:#64748b">Mostrando 120 de ${lista.length}; usa la búsqueda.</p>` : ''}`
}

function fila(p) {
  const abierto = ST.abierto === p.id
  const foto = p.foto_limpia || p.imagen_principal
  return `<div class="fl-fila" onclick="flAbrir('${esc(p.id)}')">
      ${foto ? `<img src="${esc(mini(foto))}" loading="lazy" alt="">` : '<span class="fl-sinf"></span>'}
      <div style="flex:1;min-width:0"><div style="font-weight:600;font-size:.85rem;color:#1e293b">${esc(p.nombre)}</div>
        <div style="font-size:.72rem;color:#64748b">${esc(p.sku_interno || '')} · ${esc(p.categoria || '')}</div></div>
      <span class="fl-tag" style="${p.foto_limpia ? 'background:#dcfce7;color:#166534' : 'background:#f1f5f9;color:#475569'}">${p.foto_limpia ? 'Con foto limpia' : 'Usa la portada'}</span>
    </div>${abierto ? galeria(p) : ''}`
}

function galeria(p) {
  const g = ST.galerias[p.id]
  if (!g) return '<div class="fl-gal" style="color:#94a3b8;font-size:.8rem">Cargando fotos…</div>'
  if (!g.length) return '<div class="fl-gal" style="color:#94a3b8;font-size:.8rem">Este producto no tiene fotos.</div>'
  return `<div class="fl-gal">${g.map(u => `<div class="fl-ft ${u === p.foto_limpia ? 'on' : ''}" title="${u === p.foto_limpia ? 'Foto limpia actual' : 'Usar como foto limpia'}" onclick="flElegir('${esc(p.id)}', this.dataset.u)" data-u="${esc(u)}">
      ${u === p.foto_limpia ? '<b>LIMPIA</b>' : ''}<img src="${esc(mini(u))}" loading="lazy" alt=""></div>`).join('')}
    ${p.foto_limpia ? `<div style="grid-column:1/-1"><button class="btn btn-secondary" style="font-size:.74rem" onclick="flElegir('${esc(p.id)}', '')">Quitar (volver a usar la portada)</button></div>` : ''}</div>`
}

async function cargarGaleria(p) {
  const url = (x) => typeof x === 'string' ? x : (x && x.url) || ''
  let vars = []
  try { const r = await fetch(`${API}/variantes/producto/${encodeURIComponent(p.id)}`); vars = await r.json(); if (!Array.isArray(vars)) vars = [] } catch (e) { vars = [] }
  const vistos = new Set(), lista = []
  const add = (x) => { const u = url(x); if (u && !vistos.has(u)) { vistos.add(u); lista.push(u) } }
  add(p.imagen_principal)
  ;(Array.isArray(p.imagenes) ? p.imagenes : []).forEach(add)
  vars.forEach(v => { add(v.foto_url); (Array.isArray(v.imagenes) ? v.imagenes : []).forEach(add) })
  ST.galerias[p.id] = lista
}

window.flAbrir = async (id) => {
  ST.abierto = ST.abierto === id ? null : id
  pintar()
  const p = ST.prods.find(x => x.id === id)
  if (ST.abierto && p && !ST.galerias[id]) { await cargarGaleria(p); pintar() }
}
window.flElegir = async (id, u) => {
  const p = ST.prods.find(x => x.id === id); if (!p) return
  const antes = p.foto_limpia
  p.foto_limpia = u || null; pintar()
  try {
    const r = await fetch(`${API}/productos/${encodeURIComponent(id)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ foto_limpia: u || null }) })
    const d = await r.json().catch(() => ({}))
    if (!r.ok || d.error || d.detail) throw new Error(d.error || d.detail || 'HTTP ' + r.status)
    window.mostrarToastPanel && window.mostrarToastPanel(u ? '✅ Foto limpia guardada' : 'Se volverá a usar la portada')
  } catch (e) {
    p.foto_limpia = antes; pintar()
    alert('No se pudo guardar: ' + e.message)
  }
}
let _t
window.flBuscar = (v) => {
  ST.q = v; clearTimeout(_t)
  _t = setTimeout(() => { pintar(); const i = document.querySelector('#fl-caja input[type=text]'); if (i) { i.focus(); i.setSelectionRange(v.length, v.length) } }, 250)
}
window.flSoloSin = (v) => { ST.soloSin = v; pintar() }
window.flCerrar = () => { const m = document.getElementById('fl-modal'); if (m) m.remove() }

window.abrirFotosLimpias = async () => {
  css()
  window.flCerrar()
  const m = document.createElement('div'); m.id = 'fl-modal'
  m.innerHTML = '<div id="fl-caja"><p style="padding:2rem;color:#64748b">Cargando productos…</p></div>'
  m.addEventListener('click', (e) => { if (e.target === m) window.flCerrar() })
  document.body.appendChild(m)
  try {
    const r = await fetch(`${API}/productos/`)
    const d = await r.json()
    ST.prods = (Array.isArray(d) ? d : []).filter(p => p.activo && (p.imagen_principal || '').trim())
    ST.galerias = {}; ST.abierto = null
    pintar()
  } catch (e) {
    document.getElementById('fl-caja').innerHTML = '<p style="padding:2rem;color:#b91c1c">No se pudieron cargar los productos.</p>'
  }
}
