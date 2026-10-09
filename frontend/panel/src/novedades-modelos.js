// ═══ Productos: elegir qué modelos salen en «Novedades» del sitio y con qué etiqueta ═══════════════════════════════
// Antes «Nuevos» se calculaba solo (modelos dados de alta en los últimos 30 días) y no se podía escoger. Ahora cada modelo puede estar en:
//   · Automático  → sale como «Nuevo» mientras tenga menos de 30 días de alta (como antes)
//   · ✨ Nuevo     → sale en Novedades con la etiqueta «Nuevo», sin importar cuándo se dio de alta
//   · 🔄 Resurtido → sale en Novedades con la etiqueta «Resurtido» (volvió a haber existencia)
//   · 🚫 Fuera     → no sale en Novedades aunque sea reciente
const API = '/api'
const esc = (v) => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const norm = (v) => String(v == null ? '' : v).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const mini = (u, w = 80) => (u && /\/image\/upload\//.test(u)) ? u.replace('/image/upload/', `/image/upload/w_${w},h_${w},c_fill,f_auto,q_auto/`) : u

let N = null   // estado de la ventana abierta

const diasAlta = (p) => p.created_at ? Math.floor((Date.now() - new Date(p.created_at).getTime()) / 86400000) : 9999
const enNovedades = (p) => p.novedad === 'no' ? false : (p.novedad === 'nuevo' || p.novedad === 'resurtido') ? true : diasAlta(p) < 30

function filaHTML(p) {
  const en = enNovedades(p)
  const sel = p.novedad || ''
  const d = diasAlta(p)
  return `<div class="nov-fila" data-id="${esc(p.id)}" style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #f1f5f9">
    ${p.imagen_principal ? `<img src="${esc(mini(p.imagen_principal))}" loading="lazy" style="width:44px;height:44px;object-fit:cover;border-radius:8px;flex-shrink:0;background:#f1f5f9">` : '<div style="width:44px;height:44px;border-radius:8px;background:#f1f5f9;flex-shrink:0"></div>'}
    <div style="flex:1;min-width:0">
      <div style="font-size:0.84rem;font-weight:600;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(p.nombre)}</div>
      <div style="font-size:0.7rem;color:#94a3b8">${esc(p.sku_interno || '')} · alta hace ${d >= 9999 ? '?' : d + ' día' + (d === 1 ? '' : 's')}
        · <span class="nov-estado" style="font-weight:700;color:${en ? '#15803d' : '#94a3b8'}">${en ? '✓ Sale en Novedades' : 'No sale'}</span></div>
    </div>
    <select class="form-input nov-sel" style="width:170px;font-size:0.78rem;flex-shrink:0" onchange="novCambiar('${esc(p.id)}', this)">
      <option value="" ${sel === '' ? 'selected' : ''}>Automático${d < 30 ? ' (Nuevo)' : ' (no sale)'}</option>
      <option value="nuevo" ${sel === 'nuevo' ? 'selected' : ''}>✨ Nuevo</option>
      <option value="resurtido" ${sel === 'resurtido' ? 'selected' : ''}>🔄 Resurtido</option>
      <option value="no" ${sel === 'no' ? 'selected' : ''}>🚫 Fuera de novedades</option>
    </select>
  </div>`
}

function pintarLista() {
  const cont = document.getElementById('nov-lista')
  if (!cont || !N) return
  const q = norm(document.getElementById('nov-buscar')?.value || '')
  const f = document.getElementById('nov-filtro')?.value || 'todos'
  let l = N.productos.filter(p => !q || norm(p.nombre).includes(q) || norm(p.sku_interno).includes(q))
  if (f === 'en') l = l.filter(enNovedades)
  else if (f === 'fuera') l = l.filter(p => !enNovedades(p))
  else if (f === 'manual') l = l.filter(p => p.novedad)
  cont.innerHTML = l.length ? l.slice(0, 300).map(filaHTML).join('') : '<p style="color:#94a3b8;font-size:0.82rem;padding:16px 0;text-align:center">No hay modelos con ese filtro.</p>'
  const tot = N.productos.filter(enNovedades).length
  const el = document.getElementById('nov-resumen')
  if (el) el.textContent = `${tot} modelo${tot === 1 ? '' : 's'} salen ahora en Novedades de ${N.productos.length}`
}

window.novCambiar = async (id, selectEl) => {
  const p = N && N.productos.find(x => x.id === id)
  if (!p) return
  const nuevo = selectEl.value || null
  const antes = p.novedad || null
  selectEl.disabled = true
  try {
    const r = await fetch(API + '/productos/' + id, { method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ novedad: nuevo, novedad_at: nuevo === 'nuevo' || nuevo === 'resurtido' ? new Date().toISOString() : null }) })
    const d = await r.json().catch(() => ({}))
    if (!r.ok || (d && d.error)) throw new Error((d && d.error) || ('Error ' + r.status))
    p.novedad = nuevo
    p.novedad_at = nuevo === 'nuevo' || nuevo === 'resurtido' ? new Date().toISOString() : null
    const fila = selectEl.closest('.nov-fila')
    const en = enNovedades(p)
    const st = fila && fila.querySelector('.nov-estado')
    if (st) { st.textContent = en ? '✓ Sale en Novedades' : 'No sale'; st.style.color = en ? '#15803d' : '#94a3b8' }
    const tot = N.productos.filter(enNovedades).length
    const el = document.getElementById('nov-resumen')
    if (el) el.textContent = `${tot} modelo${tot === 1 ? '' : 's'} salen ahora en Novedades de ${N.productos.length}`
  } catch (e) {
    alert('No se pudo guardar el cambio: ' + e.message)
    selectEl.value = antes || ''
  } finally { selectEl.disabled = false }
}

window.novAplicarVarios = async (valor) => {
  // Aplica la misma etiqueta a todos los modelos que se ven con el filtro actual (por ejemplo, marcar como Resurtido los que busqué)
  const cont = document.getElementById('nov-lista')
  const ids = [...cont.querySelectorAll('.nov-fila')].map(f => f.dataset.id)
  if (!ids.length) return
  const etiqueta = valor === '' ? 'Automático' : valor === 'nuevo' ? 'Nuevo' : valor === 'resurtido' ? 'Resurtido' : 'Fuera de novedades'
  if (!confirm(`¿Poner «${etiqueta}» a los ${ids.length} modelos que se ven ahora en la lista?`)) return
  for (const id of ids) {
    const sel = cont.querySelector(`.nov-fila[data-id="${id}"] .nov-sel`)
    if (!sel) continue
    sel.value = valor
    await window.novCambiar(id, sel)
  }
}

window.abrirNovedadesModelos = async () => {
  document.getElementById('modal-novedades')?.remove()
  const m = document.createElement('div')
  m.id = 'modal-novedades'
  m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:14px'
  m.onclick = (e) => { if (e.target === m) m.remove() }
  m.innerHTML = `<div style="background:#fff;border-radius:16px;padding:20px;max-width:720px;width:100%;max-height:92vh;display:flex;flex-direction:column">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
      <h3 style="margin:0">✨ Novedades del sitio</h3>
      <button onclick="document.getElementById('modal-novedades').remove()" style="background:#f5f5f5;border:none;border-radius:50%;width:30px;height:30px;cursor:pointer">✕</button>
    </div>
    <p style="font-size:0.78rem;color:#64748b;margin:0 0 10px">Escoge qué modelos salen en <strong>Novedades</strong> y con qué etiqueta: <strong>Nuevo</strong> o <strong>Resurtido</strong>. En «Automático» sale como Nuevo solo si se dio de alta hace menos de 30 días. Los cambios se guardan al instante.</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:6px">
      <input id="nov-buscar" class="form-input" placeholder="Buscar modelo o SKU..." style="flex:1;min-width:160px" oninput="novFiltrar()">
      <select id="nov-filtro" class="form-input" style="width:190px" onchange="novFiltrar()">
        <option value="todos">Todos los modelos</option><option value="en">Salen en Novedades</option><option value="fuera">No salen</option><option value="manual">Elegidos por mí</option>
      </select>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:6px">
      <span id="nov-resumen" style="font-size:0.74rem;color:#15803d;font-weight:700;flex:1;min-width:160px"></span>
      <span style="font-size:0.7rem;color:#94a3b8">A los que se ven:</span>
      <button class="btn btn-secondary" style="font-size:0.7rem;padding:3px 8px" onclick="novAplicarVarios('resurtido')">🔄 Resurtido</button>
      <button class="btn btn-secondary" style="font-size:0.7rem;padding:3px 8px" onclick="novAplicarVarios('nuevo')">✨ Nuevo</button>
      <button class="btn btn-secondary" style="font-size:0.7rem;padding:3px 8px" onclick="novAplicarVarios('')">Automático</button>
    </div>
    <div id="nov-lista" style="overflow:auto;flex:1;min-height:200px"><p style="color:#94a3b8;font-size:0.82rem;padding:16px 0;text-align:center">Cargando modelos…</p></div>
  </div>`
  document.body.appendChild(m)
  try {
    const r = await fetch(API + '/productos/?activo=true')
    const l = await r.json()
    N = { productos: (Array.isArray(l) ? l : []).filter(p => p.activo !== false).sort((a, b) => (new Date(b.created_at) - new Date(a.created_at))) }
  } catch (e) { N = { productos: [] } }
  pintarLista()
}
window.novFiltrar = () => pintarLista()
