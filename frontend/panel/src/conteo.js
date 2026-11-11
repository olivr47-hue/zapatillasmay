// ═══ Conteo físico de inventario (pensado para el celular) ═══════════════════════════════════════════════════════════════════
// Se cuenta POR MODELO: eliges el modelo y vas tocando cada talla que encuentras (estantería, amarres…): un toque = +1.
// Lo contado se guarda en el servidor (varias personas pueden ayudar o seguir después). Al terminar se revisa contra el ERP y se aplican los ajustes.
const API = '/api'
const esc = (v) => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const UBIC = { estanteria: 'Estantería', amarres: 'Amarres', otro: 'Otro' }
let cn = null   // conteo abierto: { id, data, color, ubic, historial }

async function api(ruta, op = {}) {
  const r = await fetch(API + ruta, { method: op.method || 'GET', headers: op.json !== undefined ? { 'Content-Type': 'application/json' } : undefined, body: op.json !== undefined ? JSON.stringify(op.json) : undefined })
  const d = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(d.error || d.detail || ('Error ' + r.status))
  return d
}

function css() {
  if (document.getElementById('cn-css')) return
  const s = document.createElement('style'); s.id = 'cn-css'
  s.textContent = `
  .cn-wrap,.cn-wrap *,.cn-pie,.cn-pie *{box-sizing:border-box}
  .cn-wrap{max-width:600px;width:100%;margin:0 auto;padding:8px 6px 110px;font-family:inherit;overflow-x:hidden}
  .cn-grid>*,.cn-kpis>*{min-width:0}
  .cn-h1{font-size:1.25rem;font-weight:800;margin:4px 0 2px} .cn-sub{font-size:.8rem;color:#888;margin:0 0 12px}
  .cn-busca{width:100%;padding:14px 14px;font-size:1.05rem;border:2px solid #e5e5e5;border-radius:14px;outline:none} .cn-busca:focus{border-color:#E91E8C}
  .cn-lista{margin-top:10px;display:flex;flex-direction:column;gap:8px}
  .cn-item{display:flex;align-items:center;gap:12px;padding:10px;border:1px solid #eee;border-radius:14px;background:#fff;cursor:pointer;-webkit-tap-highlight-color:transparent}
  .cn-item:active{background:#fff5f9}
  .cn-item img,.cn-item .cn-nofoto{width:52px;height:52px;border-radius:10px;object-fit:cover;background:#f3f3f3;flex-shrink:0}
  .cn-item b{font-size:.9rem;display:block;line-height:1.25} .cn-item small{color:#999;font-family:monospace;font-size:.72rem}
  .cn-pill{font-size:.68rem;background:#fff4e5;color:#b26a00;border-radius:99px;padding:2px 8px;font-weight:700;white-space:nowrap}
  .cn-top{position:sticky;top:0;z-index:5;background:#fff;padding:8px 2px 6px;border-bottom:1px solid #eee}
  .cn-bar1{display:flex;align-items:center;gap:10px}
  .cn-back{border:none;background:#f3f3f3;border-radius:12px;width:44px;height:44px;font-size:1.3rem;cursor:pointer}
  .cn-nombre{flex:1;min-width:0} .cn-nombre b{display:block;font-size:.95rem;line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap} .cn-nombre small{color:#999;font-family:monospace;font-size:.72rem}
  .cn-total{text-align:right} .cn-total b{font-size:1.5rem;color:#E91E8C;line-height:1} .cn-total small{display:block;font-size:.62rem;color:#888;text-transform:uppercase;letter-spacing:.04em}
  .cn-chips{display:flex;gap:8px;overflow-x:auto;padding:8px 2px 2px;scrollbar-width:none} .cn-chips::-webkit-scrollbar{display:none}
  .cn-chip{flex:0 0 auto;padding:10px 16px;border-radius:99px;border:2px solid #e5e5e5;background:#fff;font-weight:700;font-size:.9rem;cursor:pointer;-webkit-tap-highlight-color:transparent}
  .cn-chip.on{background:#111;color:#fff;border-color:#111} .cn-chip small{opacity:.7;font-weight:600;margin-left:4px}
  .cn-ub .cn-chip.on{background:#E91E8C;border-color:#E91E8C}
  .cn-eti{font-size:.7rem;color:#999;text-transform:uppercase;letter-spacing:.05em;margin:10px 2px 0}
  .cn-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:10px}
  @media(min-width:520px){.cn-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}
  .cn-cell{position:relative;border:2px solid #e5e5e5;border-radius:16px;background:#fafafa;min-height:104px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;user-select:none;-webkit-user-select:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent;transition:transform .06s}
  .cn-cell:active{transform:scale(.95);background:#ffe4f0}
  .cn-cell.on{background:#fff;border-color:#E91E8C}
  .cn-t{font-size:.85rem;color:#666;font-weight:700} .cn-n{font-size:2.3rem;font-weight:800;line-height:1.05;color:#111} .cn-cell:not(.on) .cn-n{color:#ccc}
  .cn-ds{font-size:.62rem;color:#999;margin-top:1px;min-height:12px}
  .cn-menos{position:absolute;top:4px;right:4px;width:34px;height:34px;border-radius:50%;border:none;background:#eee;color:#555;font-size:1.2rem;font-weight:800;cursor:pointer;line-height:1}
  .cn-pie{position:fixed;left:0;right:0;bottom:0;background:#fff;border-top:1px solid #eee;padding:10px 12px calc(10px + env(safe-area-inset-bottom));display:flex;gap:10px;z-index:20}
  .cn-btn{flex:1;padding:14px;border-radius:14px;border:none;font-weight:800;font-size:1rem;cursor:pointer;background:#f3f3f3;color:#333}
  .cn-btn.p{background:#E91E8C;color:#fff;flex:2} .cn-btn.n{background:#111;color:#fff} .cn-btn:disabled{opacity:.5}
  .cn-rev{width:100%;border-collapse:collapse;font-size:.9rem} .cn-rev th{font-size:.68rem;color:#888;text-transform:uppercase;text-align:center;padding:6px 2px;font-weight:700}
  .cn-rev td{padding:9px 2px;border-bottom:1px solid #f1f1f1;text-align:center} .cn-rev td:first-child{text-align:left;font-weight:700}
  .cn-dif{font-weight:800} .cn-dif.mas{color:#16a34a} .cn-dif.menos{color:#dc2626} .cn-dif.cero{color:#bbb}
  .cn-sin{color:#bbb;font-size:.75rem}
  .cn-card{background:#fff;border:1px solid #eee;border-radius:14px;padding:12px;margin-top:10px}
  .cn-kpis{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:10px}
  .cn-kpi{background:#fff;border:1px solid #eee;border-radius:12px;padding:10px;text-align:center} .cn-kpi b{font-size:1.4rem;display:block} .cn-kpi small{font-size:.62rem;color:#888;text-transform:uppercase}
  .cn-radio{display:flex;flex-direction:column;gap:8px;margin-top:8px} .cn-radio label{display:flex;gap:10px;align-items:flex-start;padding:10px;border:2px solid #e5e5e5;border-radius:12px;font-size:.88rem;cursor:pointer}
  .cn-radio input{margin-top:3px;width:18px;height:18px;accent-color:#E91E8C}
  .cn-toast{position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#111;color:#fff;padding:10px 16px;border-radius:99px;font-size:.85rem;z-index:50;max-width:90%}
  `
  document.head.appendChild(s)
}

function toast(t) {
  const d = document.createElement('div'); d.className = 'cn-toast'; d.textContent = t
  document.body.appendChild(d); setTimeout(() => d.remove(), 2600)
}
const raiz = () => document.getElementById('cn-raiz')

window.cargarConteo = async function () {
  css()
  document.getElementById('content').innerHTML = '<div class="cn-wrap" id="cn-raiz"></div>'
  cn = null
  pantallaInicio()
}

// ── Pantalla 1: elegir el modelo ─────────────────────────────────────────────────────────────────────────────────────────────
async function pantallaInicio() {
  raiz().innerHTML = `<h2 class="cn-h1">📋 Conteo de inventario</h2>
    <p class="cn-sub">Elige el modelo y ve tocando cada talla que encuentres. Un toque = +1 par.</p>
    <input id="cn-q" class="cn-busca" type="search" inputmode="search" placeholder="Buscar modelo o SKU…" autocomplete="off">
    <div id="cn-res" class="cn-lista"><p class="cn-sub">Cargando…</p></div>`
  let t = null
  document.getElementById('cn-q').addEventListener('input', (e) => { clearTimeout(t); t = setTimeout(() => buscar(e.target.value), 280) })
  buscar('')
}

async function buscar(q) {
  const el = document.getElementById('cn-res'); if (!el) return
  try {
    const d = await api('/conteo/buscar?q=' + encodeURIComponent(q.trim()))
    const item = (p) => `<div class="cn-item" onclick="window._cnAbrir('${p.id}')">
      ${p.imagen_principal ? `<img src="${esc(p.imagen_principal)}" loading="lazy" alt="">` : '<div class="cn-nofoto"></div>'}
      <div style="flex:1;min-width:0"><b>${esc((p.nombre || '').slice(0, 60))}</b><small>${esc(p.sku_interno || '')}</small></div>
      ${p.conteo_id ? `<span class="cn-pill">En curso${p.conteo_por ? ' · ' + esc(p.conteo_por.split(' ')[0]) : ''}</span>` : ''}</div>`
    let html = ''
    if (q.trim().length >= 2) html += d.resultados.length ? d.resultados.map(item).join('') : '<p class="cn-sub">Sin resultados.</p>'
    if (d.en_curso.length) html += `<p class="cn-eti">Conteos en curso</p>` + d.en_curso.map(item).join('')
    el.innerHTML = html || '<p class="cn-sub">Escribe al menos 2 letras del nombre o el SKU.</p>'
  } catch (e) { el.innerHTML = `<p class="cn-sub" style="color:#dc2626">${esc(e.message)}</p>` }
}

window._cnAbrir = async (productoId) => {
  try {
    const ini = await api('/conteo/iniciar', { method: 'POST', json: { producto_id: productoId } })
    const data = await api('/conteo/' + ini.id)
    const colores = [...new Set(data.variantes.map(v => v.color))]
    cn = { id: ini.id, data, color: colores[0] || '', ubic: 'estanteria', historial: [] }
    pantallaConteo()
  } catch (e) { toast(e.message) }
}

// ── Pantalla 2: contar ───────────────────────────────────────────────────────────────────────────────────────────────────────
const colores = () => [...new Set(cn.data.variantes.map(v => v.color))]
const totalContado = () => cn.data.variantes.reduce((s, v) => s + v.total, 0)

function pantallaConteo() {
  const d = cn.data, cols = colores()
  raiz().innerHTML = `<div class="cn-top">
      <div class="cn-bar1"><button class="cn-back" onclick="window._cnSalir()" aria-label="Volver">←</button>
        <div class="cn-nombre"><b>${esc(d.producto.nombre || '')}</b><small>${esc(d.producto.sku_interno || '')}</small></div>
        <div class="cn-total"><b id="cn-tot">${totalContado()}</b><small>pares contados</small></div></div>
      <div class="cn-eti">¿Dónde estás contando?</div>
      <div class="cn-chips cn-ub" id="cn-ub"></div>
      ${cols.length > 1 ? '<div class="cn-eti">Color</div><div class="cn-chips" id="cn-col"></div>' : ''}</div>
    <div class="cn-grid" id="cn-grid"></div>
    <div class="cn-pie"><button class="cn-btn" onclick="window._cnDeshacer()">↶ Deshacer</button><button class="cn-btn p" onclick="window._cnRevisar()">Revisar y terminar →</button></div>`
  pintarChips(); pintarGrid()
}

function pintarChips() {
  const ub = document.getElementById('cn-ub'); if (!ub) return
  const porUb = (u) => cn.data.variantes.reduce((s, v) => s + (v.contado[u] || 0), 0)
  ub.innerHTML = Object.keys(UBIC).map(u => `<button class="cn-chip ${cn.ubic === u ? 'on' : ''}" onclick="window._cnUbic('${u}')">${UBIC[u]}<small>${porUb(u)}</small></button>`).join('')
  const co = document.getElementById('cn-col'); if (!co) return
  co.innerHTML = colores().map(c => {
    const n = cn.data.variantes.filter(v => v.color === c).reduce((s, v) => s + v.total, 0)
    return `<button class="cn-chip ${cn.color === c ? 'on' : ''}" onclick="window._cnColor(this)" data-c="${esc(c)}">${esc(c || 'Sin color')}<small>${n}</small></button>`
  }).join('')
}

function celdaHTML(v) {
  const desg = Object.entries(v.contado).filter(([, n]) => n > 0).map(([u, n]) => `${UBIC[u].charAt(0)}${n}`).join(' · ')
  return `<div class="cn-cell ${v.tocada ? 'on' : ''}" id="cn-c-${v.id}" onclick="window._cnSumar('${v.id}',1)">
    <button class="cn-menos" onclick="event.stopPropagation();window._cnSumar('${v.id}',-1)" aria-label="Restar uno">−</button>
    <span class="cn-t">T${esc(v.talla)}</span><span class="cn-n">${v.total}</span><span class="cn-ds">${esc(Object.keys(v.contado).filter(u => v.contado[u] > 0).length > 1 ? desg : '')}</span></div>`
}

function pintarGrid() {
  const g = document.getElementById('cn-grid'); if (!g) return
  g.innerHTML = cn.data.variantes.filter(v => v.color === cn.color).map(celdaHTML).join('')
}

window._cnUbic = (u) => { cn.ubic = u; pintarChips() }
window._cnColor = (btn) => { cn.color = btn.dataset.c; pintarChips(); pintarGrid() }

function refrescarCelda(v) {
  const el = document.getElementById('cn-c-' + v.id); if (el) el.outerHTML = celdaHTML(v)
  const t = document.getElementById('cn-tot'); if (t) t.textContent = totalContado()
  pintarChips()
}

async function sumar(vid, delta, registrar) {
  const v = cn.data.variantes.find(x => x.id === vid); if (!v) return
  const ub = cn.ubic
  const antes = { ...v.contado }, antesTocada = v.tocada
  v.contado[ub] = Math.max(0, (v.contado[ub] || 0) + delta)
  v.total = Object.values(v.contado).reduce((s, n) => s + n, 0); v.tocada = true
  if (registrar) cn.historial.push({ vid, ub, delta })
  try { navigator.vibrate && navigator.vibrate(delta > 0 ? 10 : [6, 40, 6]) } catch (e) {}
  refrescarCelda(v)
  try {
    const r = await api(`/conteo/${cn.id}/sumar`, { method: 'POST', json: { variante_id: vid, ubicacion: ub, delta } })
    if (typeof r.cantidad === 'number' && v.contado[ub] !== r.cantidad) { v.contado[ub] = r.cantidad; v.total = Object.values(v.contado).reduce((s, n) => s + n, 0); refrescarCelda(v) }
  } catch (e) {
    v.contado = antes; v.tocada = antesTocada; v.total = Object.values(v.contado).reduce((s, n) => s + n, 0)
    if (registrar) cn.historial.pop()
    refrescarCelda(v); toast('No se guardó: ' + e.message)
  }
}
window._cnSumar = (vid, delta) => sumar(vid, delta, true)
window._cnDeshacer = () => {
  const h = cn.historial.pop(); if (!h) { toast('No hay nada que deshacer'); return }
  const u = cn.ubic; cn.ubic = h.ub; sumar(h.vid, -h.delta, false); cn.ubic = u
}
window._cnSalir = () => { if (!cn || confirm('Lo contado ya está guardado. ¿Volver a la lista de modelos?')) { cn = null; pantallaInicio() } }

// ── Pantalla 3: revisar contra el ERP y aplicar ─────────────────────────────────────────────────────────────────────────────
window._cnRevisar = async () => {
  try { cn.data = await api('/conteo/' + cn.id) } catch (e) { toast(e.message); return }   // trae también lo que contaron otras personas
  cn.sinContar = cn.sinContar || 'igual'; cn.soloDif = cn.soloDif !== false
  pantallaRevision()
}

function pantallaRevision() {
  const d = cn.data, vs = d.variantes
  const filas = vs.map(v => ({ ...v, nuevo: v.tocada ? v.total : (cn.sinContar === 'cero' ? 0 : null) }))
  const dif = (f) => f.nuevo == null ? null : f.nuevo - f.erp
  const cambian = filas.filter(f => dif(f) !== null && dif(f) !== 0)
  const mas = cambian.reduce((s, f) => s + (dif(f) > 0 ? dif(f) : 0), 0), menos = cambian.reduce((s, f) => s + (dif(f) < 0 ? -dif(f) : 0), 0)
  const sinTocar = vs.filter(v => !v.tocada).length
  const visibles = cn.soloDif ? filas.filter(f => dif(f) !== 0 && !(f.nuevo == null && !f.tocada && cn.sinContar === 'igual' && false)) : filas
  const porColor = {}
  visibles.forEach(f => (porColor[f.color] = porColor[f.color] || []).push(f))
  const fila = (f) => {
    const x = dif(f)
    const cont = f.tocada ? `${f.total}${Object.keys(f.contado).filter(u => f.contado[u] > 0).length > 1 ? `<br><span class="cn-sin">${Object.entries(f.contado).filter(([, n]) => n > 0).map(([u, n]) => UBIC[u].charAt(0) + n).join(' · ')}</span>` : ''}` : '<span class="cn-sin">sin contar</span>'
    return `<tr><td>T${esc(f.talla)}</td><td>${f.erp}</td><td>${cont}</td><td class="cn-dif ${x == null ? 'cero' : x > 0 ? 'mas' : x < 0 ? 'menos' : 'cero'}">${x == null ? '—' : (x > 0 ? '+' + x : x)}</td></tr>`
  }
  raiz().innerHTML = `<div class="cn-top"><div class="cn-bar1"><button class="cn-back" onclick="window._cnVolverContar()" aria-label="Volver">←</button>
      <div class="cn-nombre"><b>Revisar: ${esc(d.producto.nombre || '')}</b><small>${esc(d.producto.sku_interno || '')}</small></div></div></div>
    <div class="cn-kpis"><div class="cn-kpi"><b>${cambian.length}</b><small>Tallas cambian</small></div><div class="cn-kpi"><b style="color:#16a34a">+${mas}</b><small>Pares de más</small></div><div class="cn-kpi"><b style="color:#dc2626">−${menos}</b><small>Pares de menos</small></div></div>
    ${sinTocar ? `<div class="cn-card"><b style="font-size:.9rem">${sinTocar} talla(s) sin contar</b><div class="cn-radio">
      <label><input type="radio" name="cn-sc" value="igual" ${cn.sinContar === 'igual' ? 'checked' : ''} onchange="window._cnSinContar('igual')"><span><b>Dejarlas como están</b><br><small>Si no las tocaste, el ERP no cambia.</small></span></label>
      <label><input type="radio" name="cn-sc" value="cero" ${cn.sinContar === 'cero' ? 'checked' : ''} onchange="window._cnSinContar('cero')"><span><b>Ponerlas en 0</b><br><small>Si ya contaste TODO el modelo y no encontraste esas tallas.</small></span></label></div></div>` : ''}
    <div class="cn-chips"><button class="cn-chip ${cn.soloDif ? 'on' : ''}" onclick="window._cnSoloDif(true)">Solo diferencias</button><button class="cn-chip ${!cn.soloDif ? 'on' : ''}" onclick="window._cnSoloDif(false)">Todas las tallas</button></div>
    ${Object.keys(porColor).length ? Object.entries(porColor).map(([c, fs]) => `<div class="cn-card"><b>${esc(c || 'Sin color')}</b><table class="cn-rev"><thead><tr><th style="text-align:left">Talla</th><th>ERP</th><th>Contado</th><th>Dif.</th></tr></thead><tbody>${fs.map(fila).join('')}</tbody></table></div>`).join('')
      : '<div class="cn-card" style="text-align:center;color:#16a34a;font-weight:700">✅ Sin diferencias: el ERP coincide con lo que contaste.</div>'}
    <div class="cn-pie"><button class="cn-btn" onclick="window._cnCancelar()">Descartar</button><button class="cn-btn p" id="cn-ap" onclick="window._cnAplicar()" ${cambian.length ? '' : 'disabled'}>Aplicar ${cambian.length} ajuste(s)</button></div>`
  cn._cambian = cambian.length
}
window._cnVolverContar = () => pantallaConteo()
window._cnSinContar = (v) => { cn.sinContar = v; pantallaRevision() }
window._cnSoloDif = (v) => { cn.soloDif = v; pantallaRevision() }
window._cnCancelar = async () => {
  if (!confirm('¿Descartar este conteo? No se cambia el inventario.')) return
  try { await api(`/conteo/${cn.id}/cancelar`, { method: 'POST', json: {} }); toast('Conteo descartado'); cn = null; pantallaInicio() } catch (e) { toast(e.message) }
}
window._cnAplicar = async () => {
  const btn = document.getElementById('cn-ap')
  try {
    const vista = await api(`/conteo/${cn.id}/aplicar`, { method: 'POST', json: { sin_contar: cn.sinContar } })
    const r = vista.resumen
    if (!confirm(`Se cambiarán ${r.tallas_cambian} talla(s) del ERP: +${r.pares_mas} / −${r.pares_menos} pares.\n\nQueda registrado en el historial con tu nombre. ¿Aplicar?`)) return
    if (btn) { btn.disabled = true; btn.textContent = 'Aplicando…' }
    const hecho = await api(`/conteo/${cn.id}/aplicar`, { method: 'POST', json: { sin_contar: cn.sinContar, confirmar: true } })
    const h = hecho.resumen
    raiz().innerHTML = `<div class="cn-card" style="text-align:center;margin-top:30px"><div style="font-size:2.4rem">✅</div><h3 style="margin:6px 0">Inventario ajustado</h3>
      <p class="cn-sub">${h.aplicados} talla(s) actualizadas (+${h.pares_mas} / −${h.pares_menos} pares).${h.errores && h.errores.length ? `<br><span style="color:#dc2626">${h.errores.length} con error: ${esc(h.errores.slice(0, 3).join('; '))}</span>` : ''}</p>
      <button class="cn-btn p" style="width:100%;margin-top:12px" onclick="window.cargarConteo()">Contar otro modelo</button></div>`
    cn = null
  } catch (e) { toast(e.message); if (btn) { btn.disabled = false } }
}
