// ═══ Tareas del equipo (dashboard) ═══════════════════════════════════════════════════════════════════════════════════════════════
// Tareas completas con instrucciones, pasos, responsable, fecha, prioridad y vínculo con el ERP (cliente, pedido, producto o chat),
// para que quien salga de vacaciones no deje pendientes sin explicar. Las tareas que se agregan desde una conversación caen aquí también.
const API = '/api'
const esc = (v) => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const hoyISO = () => { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10) }
const sumarDias = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10) }
const fechaCorta = (iso) => { if (!iso) return ''; const [y, m, d] = iso.slice(0, 10).split('-'); const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']; return `${+d} ${meses[+m - 1]}${y !== String(new Date().getFullYear()) ? ' ' + y : ''}` }
const VINC = { cliente: ['👤', 'Cliente'], pedido: ['🧾', 'Pedido'], producto: ['👟', 'Producto'], chat: ['💬', 'Conversación'] }
const PRIO = { alta: ['#fee2e2', '#b91c1c', 'Alta'], normal: ['#eef2ff', '#4338ca', 'Normal'], baja: ['#f1f5f9', '#64748b', 'Baja'] }

let _tareas = [], _empleados = [], _filtro = { quien: 'todas', hechas: false }, _abiertas = new Set(), _contenedor = null

async function api(ruta, op = {}) {
  const r = await fetch(API + ruta, { method: op.method || 'GET', headers: op.json !== undefined ? { 'Content-Type': 'application/json' } : undefined, body: op.json !== undefined ? JSON.stringify(op.json) : undefined })
  const d = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(d.error || d.detail || 'Error')
  return d
}
const yo = () => (window._empleadoActual && window._empleadoActual.nombre) || 'Admin'

async function cargarEmpleados() {
  if (_empleados.length) return
  try {
    const r = await fetch(API + '/empleados/'); const d = await r.json()
    if (Array.isArray(d)) _empleados = d.filter(e => e.activo !== false).map(e => e.nombre).filter(Boolean)
  } catch (e) { /* sin permiso: se usan los nombres que ya aparecen en las tareas */ }
}
const nombresEquipo = () => [...new Set([..._empleados, yo(), ..._tareas.map(t => t.asignada_a).filter(Boolean)])].sort((a, b) => a.localeCompare(b, 'es'))

// ───────── Tarjeta del dashboard ─────────
window.pintarTareasEquipo = async function (contenedor) {
  _contenedor = contenedor || _contenedor
  if (!_contenedor) return
  let card = document.getElementById('tareas-equipo-card')
  if (!card) {
    card = document.createElement('div'); card.id = 'tareas-equipo-card'
    card.style.cssText = 'background:#fff;border-radius:12px;border:1px solid #eee;padding:1.25rem;margin-top:1.5rem'
    card.addEventListener('click', onClick)
    card.addEventListener('change', onChange)
    _contenedor.appendChild(card)
  } else if (card.parentElement !== _contenedor) _contenedor.appendChild(card)
  card.innerHTML = '<p style="color:#94a3b8;font-size:0.85rem;margin:0">Cargando tareas…</p>'
  try {
    await cargarEmpleados()
    _tareas = await api('/chatbot/tareas-equipo?hechas=' + (_filtro.hechas ? 1 : 0))
    if (!Array.isArray(_tareas)) _tareas = []
    pintar()
  } catch (e) { card.innerHTML = `<p style="color:#b91c1c;font-size:0.85rem;margin:0">No se pudieron cargar las tareas: ${esc(e.message)}</p>` }
}
window.tareasRefrescar = () => window.pintarTareasEquipo()

function visibles() {
  return _tareas.filter(t => {
    if (!!t.completada !== _filtro.hechas) return false
    if (_filtro.quien === 'todas') return true
    if (_filtro.quien === 'mias') return t.asignada_a === yo()
    if (_filtro.quien === 'sin') return !t.asignada_a
    return t.asignada_a === _filtro.quien
  })
}

function pintar() {
  const card = document.getElementById('tareas-equipo-card'); if (!card) return
  const hoy = hoyISO(), lista = visibles()
  const vencidas = lista.filter(t => t.fecha_vence && t.fecha_vence < hoy)
  const deHoy = lista.filter(t => t.fecha_vence === hoy)
  const proximas = lista.filter(t => t.fecha_vence && t.fecha_vence > hoy)
  const sinFecha = lista.filter(t => !t.fecha_vence)
  const orden = { alta: 0, normal: 1, baja: 2 }
  const ord = (a) => a.sort((x, y) => (orden[x.prioridad] ?? 1) - (orden[y.prioridad] ?? 1) || String(x.fecha_vence || '9').localeCompare(String(y.fecha_vence || '9')))
  const grupo = (titulo, color, arr) => arr.length ? `<div style="margin-top:12px"><div style="font-size:0.72rem;font-weight:700;letter-spacing:0.05em;color:${color};text-transform:uppercase;margin-bottom:4px">${titulo} · ${arr.length}</div>${ord(arr).map(tarjeta).join('')}</div>` : ''
  const personas = nombresEquipo()
  card.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
      <h3 style="font-size:1rem;font-weight:700;margin:0">✅ Tareas del equipo</h3>
      <button data-act="nueva" style="background:#e91e8c;color:#fff;border:none;border-radius:8px;padding:7px 14px;font-size:0.82rem;font-weight:600;cursor:pointer">+ Nueva tarea</button>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;align-items:center">
      <select data-f="quien" style="border:1px solid #e2e8f0;border-radius:8px;padding:6px 8px;font-size:0.8rem;background:#fff">
        <option value="todas" ${_filtro.quien === 'todas' ? 'selected' : ''}>Todo el equipo</option>
        <option value="mias" ${_filtro.quien === 'mias' ? 'selected' : ''}>Mis tareas (${esc(yo())})</option>
        ${personas.filter(p => p !== yo()).map(p => `<option value="${esc(p)}" ${_filtro.quien === p ? 'selected' : ''}>${esc(p)}</option>`).join('')}
        <option value="sin" ${_filtro.quien === 'sin' ? 'selected' : ''}>Sin responsable</option>
      </select>
      <button data-act="vista" data-v="0" style="${chip(!_filtro.hechas)}">Pendientes</button>
      <button data-act="vista" data-v="1" style="${chip(_filtro.hechas)}">Hechas (14 días)</button>
      ${!_filtro.hechas ? `<span style="font-size:0.74rem;color:#64748b;margin-left:auto">${vencidas.length ? `<b style="color:#b91c1c">${vencidas.length} vencida${vencidas.length > 1 ? 's' : ''}</b> · ` : ''}${deHoy.length} para hoy · ${lista.length} en total</span>` : ''}
    </div>
    ${lista.length === 0 ? `<p style="color:#94a3b8;font-size:0.85rem;text-align:center;padding:1.2rem 0 0.4rem;margin:0">${_filtro.hechas ? 'Aún no hay tareas hechas en los últimos 14 días' : 'Sin tareas pendientes 🎉'}</p>` : ''}
    ${grupo('Vencidas', '#b91c1c', vencidas)}${grupo('Para hoy', '#e91e8c', deHoy)}${grupo('Próximas', '#475569', proximas)}${grupo('Sin fecha', '#94a3b8', sinFecha)}`
}
const chip = (on) => `border:1px solid ${on ? '#e91e8c' : '#e2e8f0'};background:${on ? '#fdf2f8' : '#fff'};color:${on ? '#be185d' : '#475569'};border-radius:100px;padding:5px 12px;font-size:0.78rem;cursor:pointer;font-weight:${on ? 700 : 500}`

function tarjeta(t) {
  const hoy = hoyISO(), abierta = _abiertas.has(t.id)
  const pasos = Array.isArray(t.pasos) ? t.pasos : [], hechos = pasos.filter(p => p.ok).length
  const [pbg, pfg, ptxt] = PRIO[t.prioridad] || PRIO.normal
  const vencida = t.fecha_vence && t.fecha_vence < hoy && !t.completada
  const vinc = t.vinculo_tipo && VINC[t.vinculo_tipo] ? t.vinculo_tipo : (t.telefono ? 'chat' : null)
  const vincTxt = t.vinculo_texto || (vinc === 'chat' ? (t.nombre_contacto || t.telefono) : '')
  const tieneDetalle = t.descripcion || pasos.length
  return `<div data-id="${esc(t.id)}" style="border:1px solid ${vencida ? '#fecaca' : '#f1f5f9'};border-left:4px solid ${t.prioridad === 'alta' ? '#ef4444' : t.prioridad === 'baja' ? '#cbd5e1' : '#818cf8'};border-radius:8px;padding:10px 12px;margin-bottom:8px;background:${t.completada ? '#fafafa' : '#fff'}">
    <div style="display:flex;gap:10px;align-items:flex-start">
      <input type="checkbox" data-act="hecha" ${t.completada ? 'checked' : ''} style="width:17px;height:17px;margin-top:2px;cursor:pointer;accent-color:#25D366;flex-shrink:0">
      <div style="flex:1;min-width:0">
        <div data-act="detalle" style="font-size:0.88rem;font-weight:600;cursor:pointer;${t.completada ? 'text-decoration:line-through;color:#94a3b8' : ''};word-break:break-word">${esc(t.titulo)}</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:5px;align-items:center;font-size:0.7rem">
          <span style="background:${pbg};color:${pfg};border-radius:100px;padding:2px 8px;font-weight:600">${ptxt}</span>
          ${t.asignada_a ? `<span style="background:#f1f5f9;color:#334155;border-radius:100px;padding:2px 8px">👤 ${esc(t.asignada_a)}</span>` : '<span style="color:#94a3b8">Sin responsable</span>'}
          ${t.fecha_vence ? `<span style="background:${vencida ? '#fee2e2' : '#f1f5f9'};color:${vencida ? '#b91c1c' : '#334155'};border-radius:100px;padding:2px 8px">📅 ${fechaCorta(t.fecha_vence)}</span>` : ''}
          ${pasos.length ? `<span style="background:#ecfdf5;color:#047857;border-radius:100px;padding:2px 8px">☑ ${hechos}/${pasos.length}</span>` : ''}
          ${vinc ? `<button data-act="abrir" style="background:#e0f2fe;color:#0369a1;border:none;border-radius:100px;padding:2px 10px;cursor:pointer;font-size:0.7rem;font-weight:600;max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${VINC[vinc][0]} ${esc(vincTxt || VINC[vinc][1])} →</button>` : ''}
        </div>
      </div>
      <div style="display:flex;gap:2px;flex-shrink:0">
        <button data-act="detalle" title="${abierta ? 'Ocultar' : 'Ver instrucciones'}" style="border:none;background:none;cursor:pointer;color:#64748b;font-size:0.8rem;padding:2px 5px">${abierta ? '▲' : (tieneDetalle ? '▼' : '')}</button>
        <button data-act="editar" title="Editar" style="border:none;background:none;cursor:pointer;color:#64748b;padding:2px 5px">✎</button>
        <button data-act="borrar" title="Eliminar" style="border:none;background:none;cursor:pointer;color:#94a3b8;padding:2px 5px">🗑</button>
      </div>
    </div>
    ${abierta ? `<div style="margin:10px 0 0 27px;font-size:0.82rem;color:#334155">
      ${t.descripcion ? `<div style="white-space:pre-wrap;word-break:break-word;background:#f8fafc;border-radius:8px;padding:8px 10px;line-height:1.45">${esc(t.descripcion)}</div>` : '<div style="color:#94a3b8">Sin instrucciones escritas.</div>'}
      ${pasos.length ? `<div style="margin-top:8px"><div style="font-size:0.72rem;font-weight:700;color:#64748b;margin-bottom:3px">PASOS</div>${pasos.map((p, i) => `<label style="display:flex;gap:8px;align-items:flex-start;padding:2px 0;cursor:pointer"><input type="checkbox" data-act="paso" data-i="${i}" ${p.ok ? 'checked' : ''} style="margin-top:3px;accent-color:#25D366"><span style="${p.ok ? 'text-decoration:line-through;color:#94a3b8' : ''}">${esc(p.t)}</span></label>`).join('')}</div>` : ''}
      <div style="margin-top:8px;font-size:0.7rem;color:#94a3b8">Creada por ${esc(t.agente || '—')} · ${esc((t.created_at || '').slice(0, 10))}${t.completada ? ` · Hecha por ${esc(t.completada_por || '—')}${t.completada_at ? ' el ' + esc(t.completada_at.slice(0, 10)) : ''}` : ''}</div>
    </div>` : ''}
  </div>`
}

// ───────── Acciones ─────────
async function onClick(ev) {
  const el = ev.target.closest('[data-act]'); if (!el) return
  const fila = el.closest('[data-id]'), id = fila && fila.dataset.id, t = _tareas.find(x => x.id === id)
  const act = el.dataset.act
  if (act === 'nueva') return window.tareaNueva()
  if (act === 'vista') { _filtro.hechas = el.dataset.v === '1'; return window.pintarTareasEquipo() }
  if (!t) return
  if (act === 'detalle') { if (_abiertas.has(id)) _abiertas.delete(id); else _abiertas.add(id); return pintar() }
  if (act === 'editar') return window.tareaNueva({ editar: t })
  if (act === 'abrir') return abrirVinculo(t)
  if (act === 'borrar') {
    if (!confirm('¿Eliminar la tarea «' + t.titulo + '»?')) return
    try { await api('/chatbot/tareas/' + encodeURIComponent(id), { method: 'DELETE' }); _tareas = _tareas.filter(x => x.id !== id); pintar() } catch (e) { alert('No se pudo eliminar: ' + e.message) }
  }
}
async function onChange(ev) {
  const el = ev.target
  if (el.dataset.f === 'quien') { _filtro.quien = el.value; return pintar() }
  const fila = el.closest('[data-id]'), id = fila && fila.dataset.id, t = _tareas.find(x => x.id === id)
  if (!t) return
  if (el.dataset.act === 'hecha') {
    try { await api('/chatbot/tareas/' + encodeURIComponent(id), { method: 'PATCH', json: { completada: el.checked, agente: yo() } }); window.pintarTareasEquipo() }
    catch (e) { el.checked = !el.checked; alert('No se pudo actualizar: ' + e.message) }
  }
  if (el.dataset.act === 'paso') {
    const pasos = (t.pasos || []).map(p => ({ ...p })); const i = +el.dataset.i
    if (!pasos[i]) return
    pasos[i].ok = el.checked
    try { await api('/chatbot/tareas/' + encodeURIComponent(id), { method: 'PATCH', json: { pasos, agente: yo() } }); t.pasos = pasos; pintar() }
    catch (e) { el.checked = !el.checked; alert('No se pudo guardar el paso: ' + e.message) }
  }
}
function abrirVinculo(t) {
  const tipo = t.vinculo_tipo || (t.telefono ? 'chat' : ''), vid = t.vinculo_id || t.telefono
  const ir = (modulo, fn, ms = 700) => { window.navegarA(modulo); setTimeout(fn, ms) }
  if (tipo === 'cliente') return window.verHistorialCliente(vid)
  if (tipo === 'pedido') return window.verPedido(vid)
  if (tipo === 'producto') return ir('productos', () => window.editarProducto(vid))
  if (tipo === 'chat') return ir('conversaciones', () => window.abrirChat(t.telefono || vid), 800)
}

// ───────── Formulario de tarea (nueva / editar) ─────────
// opciones: { editar: tarea } o valores iniciales { telefono, vinculo_tipo, vinculo_id, vinculo_texto, titulo, alGuardar }
window.tareaNueva = async function (op = {}) {
  await cargarEmpleados()
  const t = op.editar || {}
  const ini = { titulo: '', descripcion: '', prioridad: 'normal', asignada_a: '', fecha_vence: '', pasos: [], vinculo_tipo: '', vinculo_id: '', vinculo_texto: '', telefono: '', ...op, ...t }
  delete ini.editar; delete ini.alGuardar
  const pasos = (ini.pasos || []).map(p => ({ ...p }))
  document.getElementById('modal-tarea-eq')?.remove()
  const m = document.createElement('div'); m.id = 'modal-tarea-eq'
  m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:10000;display:flex;align-items:flex-start;justify-content:center;overflow-y:auto;padding:16px'
  const inp = 'border:1px solid #e2e8f0;border-radius:8px;padding:9px 11px;font-size:0.88rem;width:100%;box-sizing:border-box;font-family:inherit;outline:none'
  const lbl = 'display:block;font-size:0.76rem;font-weight:700;color:#475569;margin:12px 0 4px'
  m.innerHTML = `<div style="background:#fff;border-radius:16px;padding:22px;width:560px;max-width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.25);margin:auto">
    <h3 style="margin:0 0 2px;font-size:1.1rem">${op.editar ? 'Editar tarea' : 'Nueva tarea'}</h3>
    <p style="margin:0;font-size:0.76rem;color:#64748b">Escríbela como si quien la va a hacer no pudiera preguntarte nada: qué hacer, con quién, dónde y qué hacer si algo sale distinto.</p>
    <label style="${lbl}">¿Qué hay que hacer? *</label>
    <input id="te-titulo" style="${inp}" maxlength="150" placeholder="Ej: Dar seguimiento al pedido de Patricia Maldonado" value="${esc(ini.titulo)}">
    <label style="${lbl}">Instrucciones completas</label>
    <textarea id="te-desc" rows="5" style="${inp};resize:vertical" placeholder="Ej: 1) Revisar en Pedidos si ya pagó. 2) Si pagó, capturar la guía y mandarle el número por WhatsApp. 3) Si no ha pagado después del viernes, mandarle el recordatorio de pago.">${esc(ini.descripcion)}</textarea>
    <label style="${lbl}">Pasos (se van palomeando)</label>
    <div id="te-pasos"></div>
    <button type="button" id="te-addpaso" style="margin-top:4px;border:1px dashed #cbd5e1;background:#fff;border-radius:8px;padding:6px 12px;font-size:0.8rem;cursor:pointer;color:#475569">+ Agregar paso</button>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div><label style="${lbl}">Responsable</label>
        <select id="te-quien" style="${inp}"><option value="">Sin asignar</option>${nombresEquipo().map(n => `<option value="${esc(n)}" ${ini.asignada_a === n ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select></div>
      <div><label style="${lbl}">Prioridad</label>
        <select id="te-prio" style="${inp}">${Object.entries(PRIO).map(([k, v]) => `<option value="${k}" ${ini.prioridad === k ? 'selected' : ''}>${v[2]}</option>`).join('')}</select></div>
    </div>
    <label style="${lbl}">Fecha límite</label>
    <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
      <input id="te-fecha" type="date" style="${inp};width:auto" value="${esc(ini.fecha_vence || '')}">
      <button type="button" data-q="0" class="te-q" style="${chip(false)}">Hoy</button><button type="button" data-q="1" class="te-q" style="${chip(false)}">Mañana</button><button type="button" data-q="7" class="te-q" style="${chip(false)}">En 1 semana</button><button type="button" data-q="" class="te-q" style="${chip(false)}">Sin fecha</button>
    </div>
    <label style="${lbl}">Vincular con algo del sistema</label>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <select id="te-vtipo" style="${inp};width:auto"><option value="">Nada</option>${Object.entries(VINC).map(([k, v]) => `<option value="${k}" ${ini.vinculo_tipo === k ? 'selected' : ''}>${v[0]} ${v[1]}</option>`).join('')}</select>
      <input id="te-vbus" style="${inp};flex:1;min-width:160px" placeholder="Buscar por nombre, teléfono, SKU…" autocomplete="off">
    </div>
    <div id="te-vres" style="margin-top:4px"></div>
    <div id="te-vsel" style="margin-top:6px"></div>
    <div style="display:flex;gap:8px;margin-top:20px">
      <button type="button" id="te-cancel" style="flex:1;padding:11px;border:1px solid #e2e8f0;border-radius:8px;background:#fff;cursor:pointer;font-size:0.9rem;color:#64748b">Cancelar</button>
      <button type="button" id="te-guardar" style="flex:1;padding:11px;border:none;border-radius:8px;background:#E91E8C;color:#fff;cursor:pointer;font-size:0.9rem;font-weight:700">${op.editar ? 'Guardar cambios' : 'Crear tarea'}</button>
    </div></div>`
  document.body.appendChild(m)
  const $ = (s) => m.querySelector(s)
  let vinc = { tipo: ini.vinculo_tipo || '', id: ini.vinculo_id || '', texto: ini.vinculo_texto || '', telefono: ini.telefono || '' }

  const pintarPasos = () => {
    $('#te-pasos').innerHTML = pasos.map((p, i) => `<div style="display:flex;gap:6px;margin-bottom:5px"><input data-i="${i}" class="te-paso" style="${inp}" value="${esc(p.t)}" placeholder="Paso ${i + 1}"><button type="button" data-del="${i}" style="border:none;background:none;cursor:pointer;color:#94a3b8;font-size:1rem">✕</button></div>`).join('')
  }
  const pintarVsel = () => {
    $('#te-vsel').innerHTML = vinc.tipo && (vinc.id || vinc.telefono) ? `<span style="background:#e0f2fe;color:#0369a1;border-radius:100px;padding:4px 12px;font-size:0.8rem;font-weight:600">${VINC[vinc.tipo][0]} ${esc(vinc.texto || vinc.id)}</span> <button type="button" id="te-vquitar" style="border:none;background:none;cursor:pointer;color:#94a3b8;font-size:0.8rem">quitar</button>` : ''
    const q = $('#te-vquitar'); if (q) q.onclick = () => { vinc = { tipo: '', id: '', texto: '', telefono: '' }; $('#te-vtipo').value = ''; pintarVsel() }
  }
  pintarPasos(); pintarVsel()
  m.addEventListener('mousedown', (e) => { if (e.target === m) m._cerrarDown = true })
  m.addEventListener('click', (e) => { if (e.target === m && m._cerrarDown) m.remove(); m._cerrarDown = false })
  $('#te-cancel').onclick = () => m.remove()
  $('#te-addpaso').onclick = () => { pasos.push({ t: '', ok: false }); pintarPasos(); m.querySelectorAll('.te-paso')[pasos.length - 1]?.focus() }
  $('#te-pasos').addEventListener('input', (e) => { if (e.target.classList.contains('te-paso')) pasos[+e.target.dataset.i].t = e.target.value })
  $('#te-pasos').addEventListener('click', (e) => { const b = e.target.closest('[data-del]'); if (b) { pasos.splice(+b.dataset.del, 1); pintarPasos() } })
  m.querySelectorAll('.te-q').forEach(b => b.onclick = () => { $('#te-fecha').value = b.dataset.q === '' ? '' : sumarDias(+b.dataset.q) })
  $('#te-vtipo').onchange = () => { vinc = { tipo: $('#te-vtipo').value, id: '', texto: '', telefono: vinc.telefono }; $('#te-vres').innerHTML = ''; pintarVsel(); $('#te-vbus').focus() }
  let tmr = null
  $('#te-vbus').oninput = () => {
    clearTimeout(tmr)
    const tipo = $('#te-vtipo').value, q = $('#te-vbus').value.trim()
    if (!tipo || q.length < 2) { $('#te-vres').innerHTML = !tipo && q ? '<div style="font-size:0.76rem;color:#94a3b8">Elige primero qué quieres vincular.</div>' : ''; return }
    // Una conversación se busca por cliente (nombre o teléfono)
    const tipoBus = tipo === 'chat' ? 'cliente' : tipo
    tmr = setTimeout(async () => {
      try {
        const r = await api('/chatbot/tareas-buscar?tipo=' + tipoBus + '&q=' + encodeURIComponent(q))
        $('#te-vres').innerHTML = r.length ? r.map((x, i) => `<div data-i="${i}" style="padding:7px 10px;border:1px solid #f1f5f9;border-radius:8px;margin-bottom:3px;cursor:pointer;font-size:0.82rem">${esc(x.texto)}</div>`).join('') : '<div style="font-size:0.76rem;color:#94a3b8">Sin resultados</div>'
        $('#te-vres').onclick = (e) => {
          const d = e.target.closest('[data-i]'); if (!d) return
          const x = r[+d.dataset.i]
          if (tipo === 'chat') { if (!x.telefono) { alert('Ese cliente no tiene teléfono, no hay conversación a la que vincular.'); return } vinc = { tipo, id: x.telefono, texto: x.texto, telefono: x.telefono } }
          else vinc = { tipo, id: x.id, texto: x.texto, telefono: vinc.telefono }
          $('#te-vres').innerHTML = ''; $('#te-vbus').value = ''; pintarVsel()
        }
      } catch (e) { $('#te-vres').innerHTML = `<div style="font-size:0.76rem;color:#b91c1c">${esc(e.message)}</div>` }
    }, 300)
  }
  $('#te-guardar').onclick = async () => {
    const titulo = $('#te-titulo').value.trim()
    if (!titulo) { alert('Escribe qué hay que hacer.'); $('#te-titulo').focus(); return }
    const body = {
      titulo, descripcion: $('#te-desc').value.trim() || null, asignada_a: $('#te-quien').value || null, prioridad: $('#te-prio').value,
      fecha_vence: $('#te-fecha').value || null, pasos: pasos.filter(p => p.t.trim()),
      vinculo_tipo: vinc.tipo || null, vinculo_id: vinc.id || null, vinculo_texto: vinc.texto || null,
      telefono: vinc.telefono || null, agente: yo(),
    }
    const b = $('#te-guardar'); b.disabled = true; b.textContent = 'Guardando…'
    try {
      if (op.editar) await api('/chatbot/tareas/' + encodeURIComponent(op.editar.id), { method: 'PATCH', json: body })
      else await api('/chatbot/tareas', { method: 'POST', json: body })
      m.remove()
      if (document.getElementById('tareas-equipo-card')) window.pintarTareasEquipo()
      if (typeof op.alGuardar === 'function') op.alGuardar()
    } catch (e) { alert('No se pudo guardar la tarea: ' + e.message); b.disabled = false; b.textContent = op.editar ? 'Guardar cambios' : 'Crear tarea' }
  }
  setTimeout(() => $('#te-titulo').focus(), 50)
}
