// ═══ Conexiones: capturar desde el panel las claves de las integraciones ═════════════════════════════════════════════
// Antes solo se podían poner como variables en Railway. Aquí las captura el administrador; se guardan cifradas y se aplican al momento.
// Los secretos nunca se muestran completos: solo "••••" y los últimos 4 caracteres.
const API = '/api'
const esc = (v) => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const ETQ = { completo: ['#e8f5e9', '#2e7d32', 'Conectado'], parcial: ['#fff4e5', '#b26a00', 'Incompleto'], sin_configurar: ['#f1f5f9', '#64748b', 'Sin configurar'] }
let _con = [], _abierta = null

async function api(ruta, op = {}) {
  const r = await fetch(API + ruta, { method: op.method || 'GET', headers: op.json !== undefined ? { 'Content-Type': 'application/json' } : undefined, body: op.json !== undefined ? JSON.stringify(op.json) : undefined })
  const d = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(d.error || d.detail || 'Error')
  return d
}

window.cargarConexiones = async function () {
  const content = document.getElementById('content')
  content.innerHTML = `<div style="margin-bottom:1rem"><p style="font-size:0.7rem;font-weight:700;letter-spacing:0.1em;color:#E91E8C;text-transform:uppercase;margin:0 0 3px">Integraciones</p>
    <h2 style="font-size:1.3rem;font-weight:800;margin:0">🔌 Conexiones</h2>
    <p style="font-size:0.78rem;color:#64748b;margin:4px 0 0;max-width:760px">Aquí pones las claves de tus integraciones (MercadoPago, MercadoLibre, Amazon, WhatsApp…) sin tocar Railway. Se guardan <b>cifradas</b> y se aplican al momento.
    Una clave capturada aquí <b>manda</b> sobre la de Railway; si la quitas, se vuelve a usar la de Railway. Los secretos nunca se muestran completos.</p></div>
    <div id="con-sync"></div>
    <div id="con-cuerpo"><p style="color:#888">Cargando…</p></div>`
  api('/sync-estado').then(d => pintarSync(d.tareas || [])).catch(() => {})
  try { const d = await api('/config/integraciones'); _con = d.integraciones; window._conCifrado = d.cifrado; pintar() } catch (e) { document.getElementById('con-cuerpo').innerHTML = `<p style="color:#dc2626">No se pudo cargar: ${esc(e.message)}</p>` }
}

// Estado de las tareas automáticas de cada canal (ventas, stock, entregas…): cuándo corrieron y si fallaron
const CANAL_NOMBRE = { ml: 'MercadoLibre', shein: 'SHEIN', walmart: 'Walmart', amazon: 'Amazon', tiktok: 'TikTok Shop' }
const TAREA_NOMBRE = { ventas: 'Ventas y pedidos', stock: 'Existencias', existencias: 'Existencias', entregas: 'Envíos y entregas', devoluciones: 'Devoluciones', revision: 'Revisión de productos', inventario: 'Existencias' }
function hace(iso) {
  if (!iso) return 'aún no'
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  return m < 1 ? 'hace un momento' : m < 60 ? `hace ${m} min` : m < 1440 ? `hace ${Math.round(m / 60)} h` : `hace ${Math.round(m / 1440)} d`
}
function pintarSync(tareas) {
  const el = document.getElementById('con-sync'); if (!el) return
  if (!tareas.length) { el.innerHTML = `<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:10px 14px;margin-bottom:12px;font-size:0.78rem;color:#64748b">🔄 Sincronizaciones automáticas: todavía no hay datos (se llenan en la primera vuelta de cada tarea, unos minutos después de reiniciar el servidor).</div>`; return }
  const mal = tareas.filter(t => t.salud !== 'ok')
  const color = { ok: ['#e8f5e9', '#2e7d32', '● Bien'], atrasada: ['#fff4e5', '#b26a00', '● Atrasada'], con_error: ['#fdecea', '#b3261e', '● Con error'] }
  el.innerHTML = `<div style="background:#fff;border:1px solid ${mal.length ? '#f5c2c0' : '#eee'};border-radius:14px;padding:14px;margin-bottom:14px">
    <b style="font-size:0.92rem">🔄 Sincronizaciones automáticas</b>
    <span style="font-size:0.76rem;margin-left:8px;color:${mal.length ? '#b3261e' : '#2e7d32'}">${mal.length ? `${mal.length} con problema` : 'todas bien'}</span>
    <div style="margin-top:10px;display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:8px">${tareas.map(t => {
      const c = color[t.salud] || color.ok
      return `<div style="border:1px solid #f1f5f9;border-radius:10px;padding:8px 10px;font-size:0.76rem">
        <div style="display:flex;justify-content:space-between;gap:6px"><b>${esc(CANAL_NOMBRE[t.canal] || t.canal)} · ${esc(TAREA_NOMBRE[t.tarea] || t.tarea)}</b><span style="background:${c[0]};color:${c[1]};font-weight:700;border-radius:100px;padding:1px 8px;white-space:nowrap">${c[2]}</span></div>
        <div style="color:#64748b;margin-top:3px">Última vuelta ${hace(t.ultima)} · última vez bien ${hace(t.ultimo_ok)}</div>
        ${t.ultimo_error ? `<div style="color:#b3261e;margin-top:3px;word-break:break-word">${esc(t.ultimo_error.slice(0, 160))}</div>` : ''}</div>`
    }).join('')}</div></div>`
}

function pintar() {
  const c = document.getElementById('con-cuerpo'); if (!c) return
  const aviso = window._conCifrado === false ? '<div style="background:#fdecea;border:1px solid #f5c2c0;border-radius:10px;padding:10px 14px;margin-bottom:10px;font-size:0.8rem;color:#b3261e">Este servidor no puede cifrar claves, así que no se pueden guardar desde aquí.</div>' : ''
  c.innerHTML = aviso + `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px;align-items:start">${_con.map(g => {
    const t = ETQ[g.estado]; const ab = _abierta === g.id
    return `<div style="background:#fff;border:1px solid ${ab ? '#E91E8C' : '#eee'};border-radius:14px;padding:14px;${ab ? 'grid-column:1/-1' : ''}">
      <div style="display:flex;align-items:center;gap:10px;cursor:pointer" onclick="conAbrir('${g.id}')">
        <span style="font-size:1.5rem">${g.icono}</span>
        <div style="flex:1;min-width:0"><b style="font-size:0.92rem">${esc(g.nombre)}</b><br><span style="font-size:0.74rem;color:#64748b">${esc(g.descripcion)}</span></div>
        <span style="background:${t[0]};color:${t[1]};font-size:0.68rem;font-weight:700;padding:2px 9px;border-radius:100px;white-space:nowrap">${t[2]} ${g.configurados}/${g.total}</span></div>
      ${ab ? cuerpo(g) : ''}</div>`
  }).join('')}</div>`
}

let _pinInfo = null

// Bloque propio de Pinterest: dirección de redirección para registrar en Pinterest Developers + botón «Conectar Pinterest»
function pinBloque() {
  const i = _pinInfo
  if (!i) return '<p style="font-size:0.78rem;color:#94a3b8;margin:0 0 12px">Cargando datos de Pinterest…</p>'
  const listo = i.tiene_app_id && i.tiene_secreto
  const fecha = i.token_vence ? new Date(i.token_vence * 1000).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' }) : ''
  return `<div style="background:#fff5f9;border:1px solid #f9c6dc;border-radius:12px;padding:12px 14px;margin-bottom:14px">
    <p style="margin:0 0 8px;font-weight:700;font-size:0.86rem">📌 Conectar tu cuenta de Pinterest para publicar pines</p>
    <ol style="margin:0 0 10px 18px;padding:0;font-size:0.78rem;color:#475569;line-height:1.6">
      <li>En <b>Pinterest Developers → tu app → Configurar → URI de redireccionamiento</b>, agrega esta dirección:
        <div style="display:flex;gap:6px;align-items:center;margin:4px 0"><code id="pin-redirect" style="background:#fff;border:1px solid #e2e8f0;border-radius:6px;padding:4px 8px;font-size:0.72rem;word-break:break-all">${esc(i.redirect_uri)}</code>
        <button class="btn btn-secondary" style="font-size:0.7rem;padding:3px 8px" onclick="navigator.clipboard.writeText(document.getElementById('pin-redirect').innerText).then(()=>alert('Copiada'))">Copiar</button></div></li>
      <li>Guarda abajo el <b>ID de la app</b> ${i.tiene_app_id ? '✅' : '❌'} y la <b>clave secreta</b> ${i.tiene_secreto ? '✅' : '❌'}.</li>
      <li>Presiona <b>Conectar Pinterest</b>, entra con la cuenta de empresa y acepta los permisos (ver tableros, ver y crear pines).</li>
    </ol>
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
      <button class="btn btn-primary" style="font-size:0.8rem" ${listo ? '' : 'disabled title="Falta guardar el ID y la clave secreta"'} onclick="conPinterestConectar()">📌 ${i.conectado_con_boton ? 'Reconectar' : 'Conectar'} Pinterest</button>
      <span style="font-size:0.74rem;color:${i.conectado_con_boton ? '#2e7d32' : '#64748b'}">${i.conectado_con_boton ? '✅ Conectada' + (fecha ? ' · el acceso se renueva solo (vence ' + fecha + ')' : '') : 'Aún no conectada con el botón'}</span>
      ${i.sandbox ? '<span style="font-size:0.72rem;background:#fff4e5;color:#b26a00;border-radius:100px;padding:2px 9px;font-weight:700">Modo de pruebas</span>' : ''}</div></div>`
}

window.conPinterestConectar = async () => {
  try {
    const d = await api('/redes/pinterest/autorizar')
    window.open(d.url, '_blank')
    alert('Se abrió Pinterest en otra pestaña. Acepta los permisos y, al terminar, regresa aquí y presiona «Probar conexión».')
  } catch (e) { alert(e.message) }
}

function cuerpo(g) {
  return `<div style="margin-top:12px;border-top:1px solid #f1f5f9;padding-top:12px">
    ${g.id === 'pinterest' ? pinBloque() : ''}
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px">${g.campos.map(f => {
      const json = f.clave.endsWith('_JSON')
      const origen = f.origen === 'panel' ? '<span style="color:#2e7d32">● desde el panel</span>' : f.origen === 'servidor' ? '<span style="color:#1565c0">● desde Railway</span>' : '<span style="color:#94a3b8">○ sin valor</span>'
      return `<div><label style="font-size:0.74rem;font-weight:600;color:#475569;display:block;margin-bottom:3px">${esc(f.etiqueta)} ${f.secreto ? '🔒' : ''}</label>
        ${json ? `<textarea id="con-${f.clave}" rows="3" class="form-input" placeholder="${f.configurado ? 'Hay un valor guardado. Pega uno nuevo para reemplazarlo.' : 'Pega aquí el contenido'}" style="font-family:monospace;font-size:0.72rem"></textarea>`
        : `<input id="con-${f.clave}" class="form-input" ${f.secreto ? 'type="password" autocomplete="new-password"' : 'type="text" autocomplete="off"'} placeholder="${f.configurado ? esc(f.secreto ? f.vista + ' (escribe para reemplazar)' : f.vista) : 'Sin valor'}" value="${f.secreto ? '' : esc(f.origen === 'panel' ? f.vista : '')}">`}
        <p style="font-size:0.68rem;color:#94a3b8;margin:3px 0 0">${origen}${f.ayuda ? ' · ' + esc(f.ayuda) : ''}</p>
        <div style="display:flex;gap:6px;margin-top:4px"><button class="btn btn-primary" style="font-size:0.7rem;padding:3px 10px" onclick="conGuardar('${f.clave}')">Guardar</button>
          ${f.origen === 'panel' ? `<button class="btn btn-secondary" style="font-size:0.7rem;padding:3px 10px" onclick="conQuitar('${f.clave}')" title="Deja de usar este valor y vuelve al de Railway">Quitar</button>` : ''}</div></div>`
    }).join('')}</div>
    <div style="display:flex;gap:8px;align-items:center;margin-top:14px;flex-wrap:wrap">
      ${g.probar ? `<button class="btn btn-secondary" style="font-size:0.78rem" onclick="conProbar('${g.id}')">🔎 Probar conexión</button>` : ''}
      <span id="con-res-${g.id}" style="font-size:0.78rem;color:#475569"></span></div></div>`
}

window.conAbrir = (id) => {
  _abierta = _abierta === id ? null : id
  pintar()
  if (_abierta === 'pinterest') api('/redes/pinterest/info').then(d => { _pinInfo = d; if (_abierta === 'pinterest') pintar() }).catch(() => {})
}

window.conGuardar = async (clave) => {
  const el = document.getElementById('con-' + clave); if (!el) return
  const valor = el.value.trim()
  if (!valor) { alert('Escribe un valor para guardar.'); return }
  try { await api('/config/integraciones/' + clave, { method: 'PUT', json: { valor } }); await recargar(); alert('Guardado y aplicado.') } catch (e) { alert(e.message) }
}
window.conQuitar = async (clave) => {
  if (!confirm('¿Quitar el valor guardado en el panel? Se volverá a usar el de Railway (si existe).')) return
  try { await api('/config/integraciones/' + clave, { method: 'DELETE' }); await recargar() } catch (e) { alert(e.message) }
}
async function recargar() {
  const d = await api('/config/integraciones'); _con = d.integraciones; pintar()
  if (_abierta === 'pinterest') api('/redes/pinterest/info').then(i => { _pinInfo = i; pintar() }).catch(() => {})
}

window.conProbar = async (id) => {
  const g = _con.find(x => x.id === id); const out = document.getElementById('con-res-' + id); if (!g || !out) return
  out.style.color = '#475569'; out.textContent = 'Probando…'
  try {
    const d = await api(g.probar)
    const ok = d && (d.ok === true || d.conectado === true || d.status === 'ok' || (d.ok == null && !d.error))
    out.style.color = ok ? '#2e7d32' : '#b26a00'
    out.textContent = ok ? '✅ Responde correctamente.' : '⚠ Respondió, pero con aviso: ' + String(d.mensaje || d.error || d.detalle || JSON.stringify(d)).slice(0, 160)
  } catch (e) { out.style.color = '#b3261e'; out.textContent = '❌ ' + e.message }
}
