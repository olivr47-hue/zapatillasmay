// SEO por página (SEO y Sitio → subpestaña). Datos de /api/seo/auditoria: lee cada página del sitemap como la ve Google
// y los cruza con Search Console (clics, impresiones y posición de 28 días).
const API = '/api'
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const N = (n) => Number(n || 0).toLocaleString('es-MX')

const ST = { datos: null, filtro: { tipo: '', soloProblemas: false, q: '', orden: 'problemas' }, abierta: null, timer: null }

const CSS = `
  .sp-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:14px}
  .sp-kpi{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:12px 14px}
  .sp-kpi b{display:block;font-size:1.35rem;color:#1e293b}.sp-kpi span{font-size:0.72rem;color:#64748b}
  .sp-bar{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:12px;font-size:0.8rem}
  .sp-bar select,.sp-bar input[type=text]{border:1px solid #e2e8f0;border-radius:8px;padding:6px 9px;font-size:0.8rem;background:#fff}
  .sp-tabla{width:100%;border-collapse:collapse;font-size:0.78rem;background:#fff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden}
  .sp-tabla th{text-align:left;padding:8px 10px;background:#f8fafc;color:#64748b;font-weight:600;font-size:0.7rem;text-transform:uppercase;letter-spacing:.03em;white-space:nowrap}
  .sp-tabla td{padding:8px 10px;border-top:1px solid #f1f5f9;vertical-align:top}
  .sp-fila{cursor:pointer}.sp-fila:hover{background:#faf5f7}
  .sp-ruta{font-weight:600;color:#1e293b;word-break:break-all;max-width:260px}
  .sp-tag{display:inline-block;border-radius:999px;padding:2px 8px;font-size:0.68rem;font-weight:700}
  .sp-ok{background:#dcfce7;color:#166534}.sp-mal{background:#fee2e2;color:#991b1b}.sp-aviso{background:#fef3c7;color:#92400e}.sp-gris{background:#f1f5f9;color:#475569}
  .sp-det td{background:#fcfafb;padding:12px 16px}
  .sp-det p{margin:0 0 6px;line-height:1.45}.sp-det ul{margin:6px 0 0;padding-left:18px}
  .sp-scroll{overflow-x:auto}
`

function inyectarCSS() {
  if (document.getElementById('sp-css')) return
  const st = document.createElement('style'); st.id = 'sp-css'; st.textContent = CSS; document.head.appendChild(st)
}

const claseLen = (n, min, max) => !n ? 'sp-mal' : (n < min || n > max ? 'sp-aviso' : 'sp-ok')

function filtrar() {
  const f = ST.filtro
  let l = (ST.datos.paginas || []).filter(p => (!f.tipo || p.tipo === f.tipo) && (!f.soloProblemas || (p.problemas || []).length)
    && (!f.q || (p.ruta + ' ' + (p.titulo || '')).toLowerCase().includes(f.q.toLowerCase())))
  const v = {
    problemas: (p) => -(p.problemas || []).length,
    clics: (p) => -((p.gsc && p.gsc.clics) || 0),
    impresiones: (p) => -((p.gsc && p.gsc.impresiones) || 0),
    palabras: (p) => (p.palabras || 0),
    ruta: (p) => p.ruta,
  }[f.orden]
  return l.slice().sort((a, b) => (v(a) > v(b) ? 1 : v(a) < v(b) ? -1 : 0))
}

function pintar(cont) {
  const d = ST.datos
  if (!d) return
  if (d.estado === 'trabajando' || (d.estado === 'sin_datos' && !(d.paginas || []).length)) {
    cont.innerHTML = `<div class="table-card" style="padding:2rem"><p style="margin:0 0 6px"><b>Revisando las páginas del sitio…</b></p>
      <p style="margin:0;font-size:0.8rem;color:var(--text-muted)">${N(d.hechas)} de ${N(d.total) || '…'} páginas. Tarda un par de minutos; puedes quedarte aquí.</p></div>`
    return
  }
  if (d.estado === 'error' && !(d.paginas || []).length) {
    cont.innerHTML = `<div class="table-card" style="padding:2rem;color:#b91c1c">No se pudo revisar el sitio: ${esc(d.error)}<br><button class="btn btn-primary" style="margin-top:10px" onclick="spRevisar(true)">Reintentar</button></div>`
    return
  }
  const pags = d.paginas || []
  const conProb = pags.filter(p => (p.problemas || []).length).length
  const sinDesc = pags.filter(p => p.estado_http === 200 && !p.descripcion_len).length
  const clics = pags.reduce((t, p) => t + ((p.gsc && p.gsc.clics) || 0), 0)
  const imp = pags.reduce((t, p) => t + ((p.gsc && p.gsc.impresiones) || 0), 0)
  const tipos = [...new Set(pags.map(p => p.tipo))]
  const f = ST.filtro
  const lista = filtrar()
  const hace = d.fin ? Math.max(1, Math.round((Date.now() / 1000 - d.fin) / 60)) : 0
  cont.innerHTML = `
    <div class="sp-kpis">
      <div class="sp-kpi"><b>${N(pags.length)}</b><span>páginas revisadas</span></div>
      <div class="sp-kpi"><b style="color:${conProb ? '#b45309' : '#166534'}">${N(conProb)}</b><span>con algo que mejorar</span></div>
      <div class="sp-kpi"><b>${N(sinDesc)}</b><span>sin descripción</span></div>
      <div class="sp-kpi"><b>${N(clics)}</b><span>clics desde Google (28 días)</span></div>
      <div class="sp-kpi"><b>${N(imp)}</b><span>veces que apareció en Google</span></div>
    </div>
    ${d.gsc_error ? `<p style="font-size:0.76rem;color:#92400e;background:#fef3c7;border-radius:8px;padding:8px 10px">No se pudieron traer los datos de Search Console (${esc(d.gsc_error)}); se muestra solo lo que tiene cada página.</p>` : ''}
    <div class="sp-bar">
      <select onchange="spFiltro('tipo',this.value)"><option value="">Todos los tipos</option>${tipos.map(t => `<option ${f.tipo === t ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select>
      <label><input type="checkbox" ${f.soloProblemas ? 'checked' : ''} onchange="spFiltro('soloProblemas',this.checked)"> Solo con problemas</label>
      <input type="text" placeholder="Buscar por dirección o título" value="${esc(f.q)}" oninput="spBuscar(this.value)" style="min-width:220px">
      <label>Ordenar por <select onchange="spFiltro('orden',this.value)">
        ${[['problemas', 'Más problemas'], ['clics', 'Más clics'], ['impresiones', 'Más apariciones'], ['palabras', 'Menos contenido'], ['ruta', 'Dirección']].map(([k, n]) => `<option value="${k}" ${f.orden === k ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
      <button class="btn" onclick="spRevisar(true)" style="margin-left:auto">🔄 Volver a revisar</button>
      <span style="color:var(--text-muted)">${hace ? `Revisado hace ${hace} min` : ''}</span>
    </div>
    <div class="sp-scroll"><table class="sp-tabla"><thead><tr>
      <th>Página</th><th>Tipo</th><th>Título</th><th>Descripción</th><th>H1</th><th>Palabras</th><th>Google (28 d)</th><th>Estado</th></tr></thead><tbody id="sp-cuerpo">
      ${lista.slice(0, 400).map((p, i) => fila(p, i)).join('') || '<tr><td colspan="8" style="padding:1.5rem;text-align:center;color:#64748b">Ninguna página coincide con el filtro.</td></tr>'}
    </tbody></table></div>
    ${lista.length > 400 ? `<p style="font-size:0.74rem;color:#64748b">Mostrando las primeras 400 de ${N(lista.length)}; usa los filtros o la búsqueda.</p>` : ''}`
}

function fila(p, i) {
  const pr = p.problemas || []
  const g = p.gsc
  const abierta = ST.abierta === p.url
  const ok = p.estado_http === 200
  const celdas = ok ? `
      <td><span class="sp-tag ${claseLen(p.titulo_len, 30, 65)}">${p.titulo_len}</span></td>
      <td><span class="sp-tag ${claseLen(p.descripcion_len, 90, 165)}">${p.descripcion_len}</span></td>
      <td><span class="sp-tag ${p.h1_n === 1 ? 'sp-ok' : 'sp-mal'}">${p.h1_n === 1 ? 'OK' : p.h1_n}</span></td>
      <td>${N(p.palabras)}</td>` : `<td colspan="4"><span class="sp-tag sp-mal">${p.estado_http || 'sin respuesta'}</span></td>`
  return `<tr class="sp-fila" onclick="spAbrir(${JSON.stringify(p.url).replace(/"/g, '&quot;')})">
      <td class="sp-ruta">${esc(p.ruta)}</td><td><span class="sp-tag sp-gris">${esc(p.tipo)}</span></td>${celdas}
      <td>${g ? `${N(g.clics)} clics · ${N(g.impresiones)} ap. · pos. ${g.posicion}` : '<span style="color:#94a3b8">sin datos</span>'}</td>
      <td>${pr.length ? `<span class="sp-tag ${pr.length > 2 ? 'sp-mal' : 'sp-aviso'}">${pr.length} por mejorar</span>` : '<span class="sp-tag sp-ok">Bien</span>'}</td></tr>
    ${abierta ? detalle(p) : ''}`
}

function detalle(p) {
  const pr = p.problemas || []
  return `<tr class="sp-det"><td colspan="8">
    <p><b>Título:</b> ${esc(p.titulo) || '<i>(vacío)</i>'}</p>
    <p><b>Descripción:</b> ${esc(p.descripcion) || '<i>(vacía)</i>'}</p>
    <p><b>H1:</b> ${esc(p.h1) || '<i>(no tiene)</i>'}</p>
    <p><b>Datos estructurados:</b> ${(p.datos_estructurados || []).map(esc).join(', ') || 'ninguno'} · <b>Imágenes:</b> ${p.imagenes} (${p.imagenes_sin_alt} sin texto alternativo) · <b>Enlaces internos:</b> ${p.enlaces_internos} · <b>Imagen al compartir:</b> ${p.og_image ? 'sí' : 'no'}</p>
    ${pr.length ? `<p><b>Por mejorar:</b></p><ul>${pr.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '<p style="color:#166534"><b>Sin problemas detectados.</b></p>'}
    <p style="margin-top:10px"><a href="${esc(p.url)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">Abrir la página ↗</a>
      &nbsp;·&nbsp; <button class="btn" onclick="event.stopPropagation();spIndexacion(${JSON.stringify(p.url).replace(/"/g, '&quot;')},this)">¿Está indexada en Google?</button>
      <span id="sp-idx" style="margin-left:8px;font-size:0.78rem"></span></p></td></tr>`
}

const contenedor = () => document.getElementById('seo-pane-paginas')

async function traer(refrescar) {
  const r = await fetch(`${API}/seo/auditoria${refrescar ? '?refrescar=true' : ''}`)
  if (!r.ok) throw new Error('HTTP ' + r.status)
  return r.json()
}

async function ciclo(refrescar) {
  const cont = contenedor()
  if (!cont) return
  clearTimeout(ST.timer)
  try {
    ST.datos = await traer(refrescar)
  } catch (e) {
    cont.innerHTML = `<div class="table-card" style="padding:2rem;color:#b91c1c">No se pudo cargar la auditoría (${esc(e.message)}). <button class="btn" onclick="spRevisar(false)">Reintentar</button></div>`
    return
  }
  pintar(cont)
  if (ST.datos.estado === 'trabajando' || ST.datos.estado === 'sin_datos') ST.timer = setTimeout(() => ciclo(false), 3000)
}

window.spRevisar = (refrescar) => { ST.abierta = null; ciclo(!!refrescar) }
window.spFiltro = (k, v) => { ST.filtro[k] = v; pintar(contenedor()) }
let _tb
window.spBuscar = (v) => {
  ST.filtro.q = v; clearTimeout(_tb)
  _tb = setTimeout(() => { pintar(contenedor()); const i = contenedor().querySelector('input[type=text]'); if (i) { i.focus(); i.setSelectionRange(v.length, v.length) } }, 250)
}
window.spAbrir = (url) => { ST.abierta = ST.abierta === url ? null : url; pintar(contenedor()) }
window.spIndexacion = async (url, btn) => {
  const out = document.getElementById('sp-idx'); btn.disabled = true; out.textContent = 'Consultando a Google…'
  try {
    const r = await (await fetch(`${API}/searchconsole/inspeccionar?url=${encodeURIComponent(url)}`)).json()
    if (r.error) out.textContent = 'No se pudo consultar: ' + r.error
    else out.innerHTML = `<b>${esc(r.veredicto === 'PASS' ? 'Indexada' : r.veredicto === 'NEUTRAL' ? 'No indexada (Google la conoce)' : r.veredicto || 'Sin dato')}</b> — ${esc(r.cobertura || '')}${r.ultimo_rastreo ? ' · último rastreo: ' + esc(String(r.ultimo_rastreo).slice(0, 10)) : ''}`
  } catch (e) { out.textContent = 'No se pudo consultar.' }
  btn.disabled = false
}

// Arma las subpestañas dentro de «SEO y Sitio»: lo que ya había queda en «Ajustes del sitio» y se suma «SEO por página».
window.seoMontarSubpestanas = (content) => {
  inyectarCSS()
  const ajustes = content.firstElementChild
  if (!ajustes) return
  ajustes.id = 'seo-pane-ajustes'
  const barra = document.createElement('div')
  barra.style.cssText = 'display:flex;gap:8px;margin-bottom:1rem;border-bottom:1px solid #e2e8f0;padding-bottom:10px'
  const pane = document.createElement('div'); pane.id = 'seo-pane-paginas'; pane.style.display = 'none'
  const btn = (id, txt) => `<button class="btn" data-sp="${id}" style="border-radius:999px;font-weight:600">${txt}</button>`
  barra.innerHTML = btn('ajustes', '⚙️ Ajustes del sitio') + btn('paginas', '📄 SEO por página')
  content.insertBefore(barra, ajustes); content.appendChild(pane)
  const activar = (id) => {
    ajustes.style.display = id === 'ajustes' ? '' : 'none'
    pane.style.display = id === 'paginas' ? '' : 'none'
    barra.querySelectorAll('button').forEach(b => { const on = b.dataset.sp === id; b.classList.toggle('btn-primary', on) })
    if (id === 'paginas' && !ST.datos) { pane.innerHTML = '<p style="padding:2rem;color:var(--text-muted)">Cargando...</p>'; ciclo(false) }
    else if (id === 'paginas') ciclo(false)
    else clearTimeout(ST.timer)
  }
  barra.querySelectorAll('button').forEach(b => b.onclick = () => activar(b.dataset.sp))
  activar('ajustes')
}
