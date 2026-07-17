// ============================================================
//  Portal de cliente mayoreo — PROTOTIPO AISLADO (no producción)
//  Reusa los endpoints de lectura existentes vía proxy /api.
//  No modifica nada del panel ni del backend.
// ============================================================

const API = '/api'
const SESION_KEY = 'portal_sesion'
const CARRITO_KEY = 'portal_carrito'
const TALLAS_ORDEN = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Unica']

const app = document.getElementById('app')
const state = {
  sesion: null,        // { nombre, cliente_id, tipo, token }
  data: null,          // { productos, variantes, inventario }
  carrito: [],
  tab: localStorage.getItem('pc_active_tab') || 'tienda',
  filtroCat: '',
  busqueda: '',
  modoCompartir: false,
  compartirSeleccion: [],
}

const num = (v) => parseFloat(v) || 0
const money = (n) => '$' + Math.round(n).toLocaleString('es-MX')
const esc = (s) => String(s ?? '').replace(/"/g, '&quot;').replace(/</g, '&lt;')

// Solo permite URLs http(s); bloquea javascript:, data:, etc. Devuelve '' si no es segura.
const urlSegura = (u) => {
  try {
    const url = new URL(String(u ?? ''), window.location.origin)
    return (url.protocol === 'http:' || url.protocol === 'https:') ? url.href : ''
  } catch { return '' }
}

// Encabezados con el JWT de cliente para los endpoints /portal/* protegidos
function authHeaders() {
  const t = state.sesion?.token
  return t ? { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + t }
           : { 'Content-Type': 'application/json' }
}
// Si un endpoint protegido responde 401, la sesión expiró → cerrar
function manejar401(res) { if (res && res.status === 401) { salir(); return true } return false }

// ---------- arranque ----------
function init() {
  try { state.sesion = JSON.parse(localStorage.getItem(SESION_KEY) || 'null') } catch { state.sesion = null }
  try { state.carrito = JSON.parse(localStorage.getItem(CARRITO_KEY) || '[]') } catch { state.carrito = [] }
  if (state.sesion?.cliente_id) entrar()
  else renderLogin()
}

// ============================================================
//  LOGIN
// ============================================================
let _loginMetodo = 'telefono'   // 'telefono' | 'correo'
let _loginPaso = 'pedir'        // 'pedir' | 'codigo'
let _otpInfo = {}
function renderLogin() {
  const esTel = _loginMetodo === 'telefono'
  const cuerpo = _loginPaso === 'codigo' ? `
    <p style="text-align:center;font-size:.85rem;color:#c8a8de;margin:0 0 16px">
      Te enviamos un código por <b>${esc(_otpInfo.canal || (esTel ? 'WhatsApp' : 'correo'))}</b> a <b>${esc(_otpInfo.destino || '')}</b>
      ${_otpInfo.enviado === false ? '<br><span style="color:#ffb4b4">(no pudimos enviarlo; revisa el dato o pídelo de nuevo)</span>' : ''}
    </p>
    <div class="field">
      <label>Código</label>
      <input id="l-codigo" type="text" inputmode="numeric" maxlength="6" placeholder="6 dígitos" autocomplete="one-time-code">
    </div>
    <button class="btn-primary" id="l-verify">Entrar</button>
    <p style="text-align:center;margin-top:12px;font-size:.78rem">
      <a href="#" id="l-resend" style="color:#c8a8de">Reenviar código</a>
      &nbsp;·&nbsp;
      <a href="#" id="l-back" style="color:#c8a8de">Cambiar ${esTel ? 'teléfono' : 'correo'}</a>
    </p>` : `
    <div class="field">
      <label>${esTel ? 'Teléfono' : 'Correo'}</label>
      <input id="l-dato" type="${esTel ? 'tel' : 'email'}" inputmode="${esTel ? 'numeric' : 'email'}" placeholder="${esTel ? '10 dígitos' : 'tu@correo.com'}" autocomplete="${esTel ? 'tel' : 'email'}">
    </div>
    <button class="btn-primary" id="l-send">Enviarme un código</button>`

  app.innerHTML = `
    <div class="login-wrap">
      <div class="login-card">
        <div class="login-brand">
          <div><span class="dot"></span><span class="kicker">Zapatillas May</span></div>
          <h1>Portal Mayoreo</h1>
          <p>Entra con tu teléfono o correo — te mandamos un código</p>
        </div>

        ${_loginPaso === 'pedir' ? `
        <div class="login-tabs">
          <button class="${esTel ? 'on' : ''}" onclick="window.__loginMetodo('telefono')">📱 Teléfono</button>
          <button class="${!esTel ? 'on' : ''}" onclick="window.__loginMetodo('correo')">✉️ Correo</button>
        </div>` : ''}

        ${cuerpo}

        <div class="or-sep"><span>o</span></div>
        <div id="g-login-btn" style="display:flex;justify-content:center;min-height:44px"></div>

        <p class="login-error" id="l-err"></p>
        <p style="text-align:center;margin-top:18px">
          <a href="#" id="l-demo" style="color:#c8a8de;font-size:.8rem;text-decoration:underline">Ver demo con datos reales (solo revisión)</a>
        </p>
      </div>
    </div>`

  if (_loginPaso === 'pedir') {
    const s = document.getElementById('l-send'); if (s) s.onclick = solicitarCodigo
    const d = document.getElementById('l-dato'); if (d) d.addEventListener('keydown', e => { if (e.key === 'Enter') solicitarCodigo() })
  } else {
    const v = document.getElementById('l-verify'); if (v) v.onclick = verificarCodigo
    const c = document.getElementById('l-codigo'); if (c) c.addEventListener('keydown', e => { if (e.key === 'Enter') verificarCodigo() })
    document.getElementById('l-resend').onclick = (e) => { e.preventDefault(); solicitarCodigo() }
    document.getElementById('l-back').onclick = (e) => { e.preventDefault(); _loginPaso = 'pedir'; renderLogin() }
  }
  document.getElementById('l-demo').onclick = (e) => { e.preventDefault(); demoLogin() }
  initGoogle()
}

window.__loginMetodo = (m) => { _loginMetodo = m; _loginPaso = 'pedir'; renderLogin() }

// --- Google Sign-In (igual que el sitio web): GIS + /auth/google ---
async function initGoogle() {
  try {
    if (!window._seoConfig) {
      window._seoConfig = await fetch(API + '/seo/config').then(r => r.json()).catch(() => ({}))
    }
    const clientId = window._seoConfig?.google_client_id
    if (!clientId) return
    await cargarGsi()
    if (typeof google === 'undefined') return
    google.accounts.id.initialize({ client_id: clientId, callback: handleGoogle, auto_select: false })
    const btn = document.getElementById('g-login-btn')
    if (btn) google.accounts.id.renderButton(btn, { theme: 'outline', size: 'large', width: 300, locale: 'es_MX', text: 'continue_with' })
  } catch {}
}
function cargarGsi() {
  return new Promise((res) => {
    if (window.google?.accounts?.id) return res()
    const s = document.createElement('script')
    s.src = 'https://accounts.google.com/gsi/client'; s.async = true; s.defer = true
    s.onload = res; s.onerror = res
    document.head.appendChild(s)
  })
}
async function handleGoogle(resp) {
  const idToken = resp?.credential
  if (!idToken) return loginError('Error al conectar con Google')
  try {
    const res = await fetch(API + '/portal/login/google', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_token: idToken })
    })
    const d = await res.json()
    if (!res.ok || !d.token) return loginError(d.error || 'No se pudo entrar con Google')
    guardarSesion(d)
  } catch { loginError('Error conectando con Google') }
}

function loginError(msg) {
  const el = document.getElementById('l-err')
  if (el) { el.textContent = msg; el.style.display = 'block' }
}

function guardarSesion(d) {
  // d = { token, cliente:{id,nombre,tipo,...}, demo? }
  state.sesion = { nombre: d.cliente.nombre, cliente_id: d.cliente.id, tipo: d.cliente.tipo, token: d.token, demo: !!d.demo }
  localStorage.setItem(SESION_KEY, JSON.stringify(state.sesion))
  entrar()
}

async function solicitarCodigo() {
  loginError('')
  const valor = (document.getElementById('l-dato').value || '').trim()
  if (!valor) return loginError(_loginMetodo === 'telefono' ? 'Escribe tu teléfono' : 'Escribe tu correo')
  const btn = document.getElementById('l-send'); btn.disabled = true; btn.textContent = 'Enviando...'
  try {
    const res = await fetch(API + '/portal/otp/solicitar', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ metodo: _loginMetodo, valor })
    })
    const d = await res.json()
    if (!res.ok) { loginError(d.error || 'No se pudo enviar el código'); btn.disabled = false; btn.textContent = 'Enviarme un código'; return }
    _otpInfo = { valor, destino: d.destino, canal: d.canal, enviado: d.enviado }
    _loginPaso = 'codigo'; renderLogin()
  } catch {
    loginError('Error conectando con el servidor'); btn.disabled = false; btn.textContent = 'Enviarme un código'
  }
}

async function verificarCodigo() {
  loginError('')
  const codigo = (document.getElementById('l-codigo').value || '').replace(/\D/g, '')
  if (codigo.length < 4) return loginError('Escribe el código que te enviamos')
  const btn = document.getElementById('l-verify'); btn.disabled = true; btn.textContent = 'Entrando...'
  try {
    const res = await fetch(API + '/portal/otp/verificar', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ metodo: _loginMetodo, valor: _otpInfo.valor, codigo })
    })
    const d = await res.json()
    if (!res.ok || !d.token) { loginError(d.error || 'Código incorrecto'); btn.disabled = false; btn.textContent = 'Entrar'; return }
    guardarSesion(d)
  } catch {
    loginError('Error conectando con el servidor'); btn.disabled = false; btn.textContent = 'Entrar'
  }
}

// Demo: pide al backend un token de cliente real (solo si PORTAL_DEMO=1 en el server)
async function demoLogin() {
  loginError('')
  try {
    const res = await fetch(API + '/portal/demo-login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
    const d = await res.json()
    if (!res.ok || !d.token) return loginError(d.error === 'Demo deshabilitado' ? 'Demo deshabilitado en el servidor (activa PORTAL_DEMO=1).' : (d.error || 'No se pudo cargar el demo'))
    guardarSesion(d)
  } catch { loginError('Error cargando demo') }
}

function salir() {
  localStorage.removeItem(SESION_KEY)
  state.sesion = null
  renderLogin()
}

// ============================================================
//  CARGA DE DATOS + SHELL
// ============================================================
async function entrar() {
  app.innerHTML = `<div class="spinner">Cargando catálogo…</div>`
  try {
    const [productos, variantes, inventario, pedidos] = await Promise.all([
      fetch(API + '/productos/').then(r => r.json()),
      fetch(API + '/variantes/').then(r => r.json()),
      fetch(API + '/inventario/').then(r => r.json()).catch(() => []),
      fetch(API + '/portal/pedidos', { headers: authHeaders() }).then(r => r.ok ? r.json() : []).catch(() => []),
    ])
    // Stock total por variante (sumado entre sucursales)
    const stockPorVar = {}
    ;(Array.isArray(inventario) ? inventario : []).forEach(i => {
      stockPorVar[i.variante_id] = (stockPorVar[i.variante_id] || 0) + (i.cantidad || 0)
    })
    state.data = {
      // Modelos de uso interno (lotes "OFERTA250", "OFERTA200", etc.) no se ofrecen
      // a clientes mayoristas, aunque existan en el ERP para otros canales.
      productos: (Array.isArray(productos) ? productos : [])
        .filter(p => p.activo && !/^oferta/i.test(p.nombre || '') && !/^oferta/i.test(p.sku_interno || ''))
        .map(p => normalizarProducto(p)),
      variantes: Array.isArray(variantes) ? variantes : [],
      stockPorVar,
    }
    try { await restaurarCarritoDeServidor(pedidos) } catch(e) {}
    renderShell()
    try {
      const activeProdId = localStorage.getItem('pc_active_product_id')
      if (activeProdId) {
        abrirProducto(activeProdId)
      }
    } catch {}
  } catch (e) {
    app.innerHTML = `<div class="empty"><div class="ic">😕</div><p>No se pudo cargar. Reintenta.</p>
      <button class="btn-primary" style="max-width:200px;margin:12px auto" onclick="location.reload()">Reintentar</button></div>`
  }
}

function normalizarProducto(p) {
  const menudeo = num(p.precio_menudeo)
  return {
    ...p,
    precio_menudeo: menudeo,
    precio_mayoreo3: num(p.precio_mayoreo3) || (menudeo - 30),
    precio_mayoreo6: num(p.precio_mayoreo6) || (menudeo - 70),
    precio_corrida: num(p.precio_corrida) || (menudeo - 100),
  }
}

function renderShell() {
  app.innerHTML = `
    <div class="shell">
      <div class="topbar">
        <div onclick="window.__nav('inicio')" style="cursor:pointer">
          <div class="title">Zapatillas <span>May</span></div>
          <div class="sub" id="tb-sub"></div>
        </div>
        <button class="tb-cuenta" onclick="window.__nav('cuenta')" title="Mi cuenta">👤</button>
      </div>
      <div class="page" id="page"></div>
    </div>
    ${renderBottomNav()}
    <div id="toast" class="toast"></div>`
  navTo(state.tab || 'tienda')
}

function renderBottomNav() {
  const tabs = [
    { id: 'inicio', ic: '🏠', label: 'Inicio' },
    { id: 'tienda', ic: '👠', label: 'Tienda' },
    { id: 'catalogos', ic: '📖', label: 'Catálogos' },
    { id: 'carrito', ic: '🛒', label: 'Carrito' },
    { id: 'pedidos', ic: '🛍️', label: 'Pedidos' },
    { id: 'maya', ic: '💬', label: 'Maya' },
  ]
  const pares = totalPares()
  return `<div class="bottomnav">${tabs.map(t => `
    <button data-tab="${t.id}" class="${state.tab === t.id ? 'active' : ''}" onclick="window.__nav('${t.id}')">
      <span class="ic">${t.ic}${t.id === 'carrito' && pares ? `<span class="badge">${pares}</span>` : ''}</span>
      <span>${t.label}</span>
    </button>`).join('')}</div>`
}

window.__nav = navTo
function navTo(tab, _fromBack) {
  if (!_fromBack && state.tab && state.tab !== tab && window._zmPushBack) {
    const prevTab = state.tab
    window._zmPushBack(() => navTo(prevTab, true))
  }
  state.tab = tab
  try { localStorage.setItem('pc_active_tab', tab) } catch {}
  // refrescar nav (badge/active)
  const oldNav = document.querySelector('.bottomnav')
  if (oldNav) oldNav.outerHTML = renderBottomNav()
  const sub = document.getElementById('tb-sub')
  if (sub) sub.textContent = state.sesion?.nombre ? `Hola, ${state.sesion.nombre.split(' ')[0]}` : ''

  if (tab === 'carrito') {
    iniciarPollCarrito()
  } else {
    detenerPollCarrito()
  }

  if (tab === 'inicio') renderInicio()
  else if (tab === 'tienda') renderCatalogo()
  else if (tab === 'catalogos') renderCatalogos()
  else if (tab === 'carrito') renderCarrito()
  else if (tab === 'pedidos') renderPedidos()
  else if (tab === 'maya') renderMaya()
  else if (tab === 'cuenta') renderCuenta()
}

const page = () => document.getElementById('page')

// ============================================================
//  INICIO
// ============================================================
async function renderInicio() {
  const pares = totalPares()
  const total = totalCarrito()
  page().innerHTML = `
    ${state.sesion?.demo ? `<div class="row" style="background:#fff7ed;border-color:#fed7aa;color:#9a3412;font-size:.8rem">⚠️ Modo demo: viendo datos reales de <b>${esc(state.sesion.nombre)}</b> solo para revisión.</div>` : ''}
    <div class="row">
      <p class="section-title">Tu carrito</p>
      ${pares ? `<p style="font-size:1.5rem;font-weight:800;color:var(--pink);margin:0">${money(total)} <small class="muted" style="font-size:.8rem;font-weight:600">· ${pares} pares</small></p>
        <button class="btn-primary" style="margin-top:10px" onclick="window.__nav('carrito')">Ver carrito</button>`
        : `<p class="muted" style="margin:0">Tu carrito está vacío.</p>
        <button class="btn-primary" style="margin-top:10px" onclick="window.__nav('tienda')">Empezar a pedir</button>`}
    </div>
    <div class="row">
      <p class="section-title">Tus precios</p>
      <p class="muted" style="font-size:.85rem;margin:0">Eres cliente <b>${esc(state.sesion?.tipo || 'mayoreo')}</b>. En el catálogo ves el precio por par, y baja automático al llegar a 3+, 6+ o corrida completa.</p>
    </div>
    <div class="row" onclick="window.__nav('pedidos')" style="cursor:pointer">
      <p class="section-title">Mis pedidos</p>
      <p class="muted" style="font-size:.85rem;margin:0">Consulta el estatus y el rastreo de tus envíos →</p>
    </div>`
}

// ============================================================
//  CATÁLOGO
// ============================================================
function renderCatalogo() {
  const cats = [...new Set(state.data.productos.map(p => p.categoria).filter(Boolean))]
  page().innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;width:100%">
      <h2 style="font-size:1.3rem;font-weight:800;margin:0;color:inherit">Productos</h2>
      <button onclick="pcToggleModoCompartir()" style="padding:6px 12px;border-radius:100px;border:1px solid ${state.modoCompartir ? '#25D366' : '#d1d5db'};background:${state.modoCompartir ? '#25D366' : '#f3f4f6'};color:${state.modoCompartir ? 'white' : '#374151'};font-weight:700;font-size:0.75rem;cursor:pointer;display:flex;align-items:center;gap:4px">📲 ${state.modoCompartir ? 'Listo' : 'Compartir fotos (sin precios)'}</button>
    </div>
    <input class="search" id="cat-search" placeholder="🔍 Buscar modelo o SKU…" value="${esc(state.busqueda)}">
    <div class="chips" style="margin-bottom:12px;display:flex;align-items:center;flex-wrap:wrap;gap:6px">
      <button class="${!state.filtroCat ? 'active' : ''}" onclick="window.__filtro('')">Todos</button>
      ${cats.map(c => `<button class="${state.filtroCat === c ? 'active' : ''}" onclick="window.__filtro('${c}')">${c[0].toUpperCase() + c.slice(1)}</button>`).join('')}
    </div>
    <div class="grid" id="cat-grid"></div>
    
    ${(() => {
      if (state.modoCompartir) {
        if (state.compartirSeleccion.length === 0) return ''
        return `
        <div id="pc-bulk-share-bar" style="position:fixed;bottom:80px;left:50%;transform:translateX(-50%);z-index:900;background:white;border:2px solid #25D366;border-radius:18px;padding:12px 20px;display:flex;align-items:center;gap:16px;box-shadow:0 8px 32px rgba(0,0,0,0.15);width:90%;max-width:500px;color:#1f2937">
          <div style="flex:1;line-height:1.2">
            <p style="margin:0;font-size:0.75rem;color:#6b7280;font-weight:600">Compartir fotos</p>
            <p style="margin:0;font-size:1rem;font-weight:800;color:#111827">${state.compartirSeleccion.length} seleccionados</p>
            <p style="margin:2px 0 0;font-size:0.58rem;color:#10b981;font-weight:600">⚠️ Solo fotos de portada (sin precios)</p>
          </div>
          <div style="display:flex;gap:8px">
            <button onclick="pcCompartirVariosWhatsApp()" id="pc-bulk-share-btn" style="padding:10px 14px;font-size:0.8rem;background:#25D366;color:white;border:none;border-radius:8px;font-weight:700;display:flex;align-items:center;gap:6px;cursor:pointer">💬 Compartir</button>
            <button onclick="pcCancelarSeleccionCompartir()" style="padding:10px 14px;font-size:0.8rem;background:#f3f4f6;color:#4b5563;border:1px solid #d1d5db;border-radius:8px;font-weight:600;cursor:pointer">Cancelar</button>
          </div>
        </div>`
      }
      return ''
    })()}`
  document.getElementById('cat-search').addEventListener('input', (e) => { state.busqueda = e.target.value; pintarGrid() })
  pintarGrid()
}
window.__filtro = (c) => { state.filtroCat = c; renderCatalogo() }

function pintarGrid() {
  const q = state.busqueda.trim().toLowerCase()
  let lista = state.data.productos
  if (state.filtroCat) lista = lista.filter(p => p.categoria === state.filtroCat)
  if (q) lista = lista.filter(p => (p.nombre || '').toLowerCase().includes(q) || (p.sku_interno || '').toLowerCase().includes(q))
  const grid = document.getElementById('cat-grid')
  if (!grid) return
  if (!lista.length) { grid.innerHTML = `<p class="muted" style="grid-column:1/-1;text-align:center;padding:30px">Sin resultados</p>`; return }
  grid.innerHTML = lista.slice(0, 120).map(p => {
    const seleccionado = state.modoCompartir && state.compartirSeleccion.some(x => x.startsWith(p.id + '::'))
    const clickAction = state.modoCompartir 
      ? `pcToggleSeleccionCompartir('${p.id}')` 
      : `window.__abrir('${p.id}')`
    
    const vars = state.data.variantes.filter(v => v.producto_id === p.id)
    const coloresMap = {}
    vars.forEach(v => {
      if (v.color) coloresMap[v.color] = v.color_hex || '#888'
    })
    const coloresList = Object.entries(coloresMap)

    return `
      <div class="card" onclick="${clickAction}" style="position:relative;${seleccionado ? 'border: 2px solid #25D366; box-shadow: 0 0 0 1px #25D366;' : ''}">
        ${p.imagen_principal ? `<img class="thumb" src="${p.imagen_principal}" loading="lazy">` : `<div class="thumb"></div>`}
        
        ${state.modoCompartir ? `
          <div style="position:absolute;top:8px;left:8px;width:24px;height:24px;border-radius:50%;background:${seleccionado ? '#25D366' : 'rgba(0,0,0,0.5)'};border:2px solid white;display:flex;align-items:center;justify-content:center;z-index:10;color:white;font-weight:bold;font-size:0.8rem;box-shadow:0 2px 6px rgba(0,0,0,0.3)">
            ${seleccionado ? '✓' : ''}
          </div>
        ` : ''}
        
        <div class="body">
          <div class="name">${esc(p.nombre)}</div>
          <div class="sku">${esc(p.sku_interno || '')}</div>
          
          ${state.modoCompartir && coloresList.length > 0 ? `
            <div style="display:flex;gap:5px;margin:8px 0;flex-wrap:wrap" onclick="event.stopPropagation()">
              ${coloresList.map(([cn, hex]) => {
                const colorSel = state.compartirSeleccion.includes(p.id + '::' + cn)
                return `
                  <div title="${esc(cn)}" onclick="event.stopPropagation();pcToggleSeleccionColorCompartir('${p.id}','${esc(cn)}')"
                    style="width:20px;height:20px;border-radius:50%;background:${hex};border:2px solid ${colorSel ? '#25D366' : '#d1d5db'};cursor:pointer;flex-shrink:0;position:relative;display:flex;align-items:center;justify-content:center;transition:border-color 0.15s">
                    ${colorSel ? '<span style="color:#25D366;font-size:0.62rem;font-weight:900">✓</span>' : ''}
                  </div>`
              }).join('')}
            </div>
          ` : `
            <div class="price">${money(p.precio_menudeo)} <small>x par</small></div>
            <div class="tier-row">
              <span class="tier">3+ ${money(p.precio_mayoreo3)}</span>
              <span class="tier">6+ ${money(p.precio_mayoreo6)}</span>
              ${tieneCorridaDisponibleProducto(p.id) ? `<span class="tier corr">Corr ${money(p.precio_corrida)}</span>` : ''}
            </div>
          `}
        </div>
      </div>`
  }).join('')
}

window.pcToggleModoCompartir = () => {
  state.modoCompartir = !state.modoCompartir
  if (!state.modoCompartir) {
    state.compartirSeleccion = []
  }
  renderCatalogo()
}

window.pcToggleSeleccionCompartir = (prodId) => {
  const p = state.data.productos.find(x => x.id === prodId)
  if (!p) return
  const vars = state.data.variantes.filter(v => v.producto_id === prodId)
  const colores = [...new Set(vars.map(v => v.color).filter(Boolean))]
  
  if (colores.length > 0) {
    const algunColSel = colores.some(c => state.compartirSeleccion.includes(`${prodId}::${c}`))
    if (algunColSel) {
      colores.forEach(c => {
        const idx = state.compartirSeleccion.indexOf(`${prodId}::${c}`)
        if (idx > -1) state.compartirSeleccion.splice(idx, 1)
      })
    } else {
      colores.forEach(c => {
        const item = `${prodId}::${c}`
        if (!state.compartirSeleccion.includes(item)) {
          state.compartirSeleccion.push(item)
        }
      })
    }
  } else {
    const item = `${prodId}::default`
    const idx = state.compartirSeleccion.indexOf(item)
    if (idx > -1) {
      state.compartirSeleccion.splice(idx, 1)
    } else {
      state.compartirSeleccion.push(item)
    }
  }
  renderCatalogo()
}

window.pcToggleSeleccionColorCompartir = (prodId, color) => {
  const item = `${prodId}::${color}`
  const idx = state.compartirSeleccion.indexOf(item)
  if (idx > -1) {
    state.compartirSeleccion.splice(idx, 1)
  } else {
    state.compartirSeleccion.push(item)
  }
  renderCatalogo()
}

window.pcCancelarSeleccionCompartir = () => {
  state.modoCompartir = false
  state.compartirSeleccion = []
  renderCatalogo()
}

window.pcCompartirVariosWhatsApp = async () => {
  const btn = document.getElementById('pc-bulk-share-btn')
  if (!btn) return
  const origTxt = btn.innerHTML
  btn.innerHTML = '⏳ Procesando...'
  btn.disabled = true

  try {
    if (!state.compartirSeleccion.length) {
      alert('Selecciona al menos un producto.')
      return
    }

    const files = []
    const selecInfo = []
    
    for (const item of state.compartirSeleccion) {
      const [prodId, colorName] = item.split('::')
      const p = state.data.productos.find(x => x.id === prodId)
      if (!p) continue
      
      const vars = state.data.variantes.filter(v => v.producto_id === prodId)
      let fotoUrl = p.imagen_principal || vars[0]?.foto_url
      
      if (colorName !== 'default') {
        const vColor = vars.find(x => x.color === colorName)
        if (vColor?.foto_url) {
          fotoUrl = vColor.foto_url
        }
      }
      
      if (!fotoUrl) continue
      
      try {
        const res = await fetch(fotoUrl)
        const blob = await res.blob()
        const ext = fotoUrl.split('.').pop().split('?')[0] || 'jpg'
        const shortCode = p.nombre.split(' ')[0]
        const label = colorName !== 'default' ? `${shortCode}_${colorName}` : shortCode
        const filename = `Zapatillas_May_${label}_${p.sku_interno || p.id}.${ext}`
        files.push(new File([blob], filename, { type: blob.type }))
        
        selecInfo.push({
          nombre: p.nombre,
          sku: p.sku_interno || '',
          color: colorName !== 'default' ? colorName : ''
        })
      } catch (e) {
        console.error('No se pudo descargar imagen:', fotoUrl, e)
      }
    }

    let text = '*Modelos de Calzado* 👠✨\n\n'
    selecInfo.forEach((item, index) => {
      const shortName = item.nombre.split(' ')[0]
      const colorText = item.color ? ` - Color ${item.color}` : ''
      text += `*${index + 1}. Modelo ${shortName}* (${item.sku})${colorText}\n\n`
    })

    if (navigator.share && navigator.canShare && navigator.canShare({ files })) {
      await navigator.share({
        files,
        title: 'Modelos de Zapatillas May'
      })
    } else {
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`
      window.open(url, '_blank')
      
      alert('Tu navegador no permite compartir archivos directamente. Se abrirá WhatsApp con los detalles y se descargarán las imágenes seleccionadas a tu dispositivo para que las subas.')
      for (let i = 0; i < files.length; i++) {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(files[i])
        a.download = files[i].name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        await new Promise(r => setTimeout(r, 400))
      }
    }
  } catch (err) {
    alert('Error al compartir: ' + err.message)
  } finally {
    btn.innerHTML = origTxt
    btn.disabled = false
    window.pcCancelarSeleccionCompartir()
  }
}

// ============================================================
//  MODAL DE PRODUCTO (elegir color + tallas)
// ============================================================
let _modalSel = { productoId: null, color: null, modo: 'variado' }
let _corridaM = 1
window.__abrir = abrirProducto

// --- HELPERS DE CORRIDAS ---
function tieneCorridaDisponibleProducto(productoId) {
  const vars = state.data.variantes.filter(v => v.producto_id === productoId)
  const colores = [...new Set(vars.map(v => v.color).filter(Boolean))]
  if (!colores.length) return false
  return colores.some(color => esCorridaDisponible(productoId, color))
}

function esCorridaDisponible(productoId, color) {
  return maxCorridasDisponibles(productoId, color) >= 1
}

function maxCorridasDisponibles(productoId, color) {
  if (!color) return 0
  const vars = state.data.variantes.filter(v => v.producto_id === productoId && v.color === color)
  if (!vars.length) return 0

  const tieneMedios = vars.some(v => v.talla && (v.talla.includes('.5') || v.talla.includes('½') || v.talla.includes('/')))

  let maxM = 0
  for (let M = 1; M <= 6; M++) {
    if (tieneMedios) {
      // 1. Try 6 unique sizes with stock >= M
      const uniqueSizesWithStock = vars.filter(v => (state.data.stockPorVar[v.id] || 0) >= M)
      if (uniqueSizesWithStock.length >= 6) {
        maxM = M
        continue
      }
      // 2. Fallback: repeat up to 2*M times per size if we don't have 6 unique sizes
      let sumEffective = 0
      vars.forEach(v => {
        const stock = state.data.stockPorVar[v.id] || 0
        sumEffective += Math.min(stock, 2 * M)
      })
      if (sumEffective >= 6 * M) {
        maxM = M
      } else {
        break
      }
    } else {
      // For only integers: sum of Math.min(stock, 2 * M) must be >= 6 * M
      let sumEffective = 0
      vars.forEach(v => {
        const stock = state.data.stockPorVar[v.id] || 0
        sumEffective += Math.min(stock, 2 * M)
      })
      if (sumEffective >= 6 * M) {
        maxM = M
      } else {
        break
      }
    }
  }
  return maxM
}

function resolverItemsCorrida(productoId, color, M) {
  const vars = state.data.variantes
    .filter(v => v.producto_id === productoId && v.color === color)
    .sort((a, b) => TALLAS_ORDEN.indexOf(a.talla) - TALLAS_ORDEN.indexOf(b.talla))
    
  const tieneMedios = vars.some(v => v.talla && (v.talla.includes('.5') || v.talla.includes('½') || v.talla.includes('/')))
  const qtyMap = {}
  
  if (tieneMedios) {
    // 1. Check if we have 6 unique sizes with stock >= M
    const uniqueSizesWithStock = vars.filter(v => (state.data.stockPorVar[v.id] || 0) >= M)
    if (uniqueSizesWithStock.length >= 6) {
      // Pick first 6 unique sizes
      uniqueSizesWithStock.slice(0, 6).forEach(v => {
        qtyMap[v.id] = M
      })
      return qtyMap
    }
  }
  
  // Fallback (for half-sizes without 6 unique sizes, or for only integers):
  // Greedily fill up to 6 * M pairs, max 2 * M per size.
  let totalNeeded = 6 * M
  for (const v of vars) {
    const stock = state.data.stockPorVar[v.id] || 0
    const aTomar = Math.min(stock, 2 * M, totalNeeded)
    if (aTomar > 0) {
      qtyMap[v.id] = aTomar
      totalNeeded -= aTomar
    }
    if (totalNeeded <= 0) break
  }
  return qtyMap
}
function abrirProducto(productoId) {
  const p = state.data.productos.find(x => x.id === productoId)
  if (!p) return
  const vars = state.data.variantes.filter(v => v.producto_id === productoId)
  const colores = [...new Set(vars.map(v => v.color).filter(Boolean))]
  _modalSel = { productoId, color: colores[0] || null, modo: 'variado' }
  _corridaM = 1

  const ov = document.createElement('div')
  ov.className = 'modal-overlay'; ov.id = 'pmodal'
  ov.innerHTML = `
    <div class="modal">
      <div class="m-head">
        ${p.imagen_principal ? `<img id="pm-img" src="${p.imagen_principal}" onclick="window.abrirLightboxPC(this.src, null, '${esc(String(p.nombre || '').split(' ')[0])}')" style="cursor:zoom-in">` : ''}
        <div style="flex:1;min-width:0">
          <div style="font-weight:700;line-height:1.25">${esc(p.nombre)}</div>
          <div class="muted" style="font-size:.76rem">${esc(p.sku_interno || '')}</div>
          <div style="font-weight:800;color:var(--pink);margin-top:3px">${money(p.precio_menudeo)} <span class="muted" style="font-size:.7rem;font-weight:600">x par</span></div>
          <div class="tier-row" style="margin-top:5px">
            <span class="tier">3+ ${money(p.precio_mayoreo3)}</span>
            <span class="tier">6+ ${money(p.precio_mayoreo6)}</span>
            <span class="tier corr" id="pm-tier-corr">Corrida ${money(p.precio_corrida)}</span>
          </div>
        </div>
        <button onclick="history.back()" style="background:none;border:none;font-size:1.5rem;color:#aaa">✕</button>
      </div>
      <div class="m-scroll">
        <div class="mode-tabs" id="pm-mode">
          <button data-modo="variado" class="on" onclick="window.__modoModal('variado')">🧺 Surtido variado</button>
          <button data-modo="corrida" onclick="window.__modoModal('corrida')">📦 Corrida completa</button>
        </div>
        <p class="section-title">Color</p>
        <div class="swatches" id="pm-swatches">
          ${colores.map(c => {
            const vc = vars.filter(v => v.color === c)
            const foto = vc.map(v => v.foto_url).find(Boolean)
            const hex = vc[0]?.color_hex || '#999'
            return `<div class="swatch ${c === _modalSel.color ? 'active' : ''}" data-color="${esc(c)}" onclick="window.__pickColor('${esc(c)}')">
              ${foto ? `<img src="${foto}">` : `<div class="hex" style="background:${hex}"></div>`}
              <span>${esc(c)}</span>
            </div>`
          }).join('')}
        </div>
        <p class="section-title" id="pm-tallas-label">Tallas</p>
        <div class="tallas" id="pm-tallas"></div>
      </div>
      <div class="m-foot" id="pm-foot">
        <button class="btn-primary" onclick="history.back(); setTimeout(() => window.__nav('carrito'), 50)">Listo · ver carrito</button>
      </div>
    </div>`
  document.body.appendChild(ov)
  ov.addEventListener('click', e => { if (e.target === ov) history.back() })

  if (window._zmPushBack) {
    window._zmPushBack(() => {
      const m = document.getElementById('pmodal')
      if (m) m.remove()
      try { localStorage.removeItem('pc_active_product_id') } catch {}
    })
  }
  try { localStorage.setItem('pc_active_product_id', productoId) } catch {}

  if (_modalSel.color) {
    actualizarTabsModal()
    pintarTallas()
  }
}

function actualizarTabsModal() {
  const modeDiv = document.getElementById('pm-mode')
  if (!modeDiv) return
  const { productoId, color } = _modalSel
  const maxM = maxCorridasDisponibles(productoId, color)
  const disponible = maxM >= 1
  
  const tierCorr = document.getElementById('pm-tier-corr')
  if (tierCorr) {
    tierCorr.style.display = disponible ? '' : 'none'
  }
  
  if (!disponible) {
    if (_modalSel.modo === 'corrida') {
      _modalSel.modo = 'variado'
    }
    modeDiv.innerHTML = `
      <button data-modo="variado" class="on" onclick="window.__modoModal('variado')">🧺 Surtido variado</button>
    `
  } else {
    const modo = _modalSel.modo
    modeDiv.innerHTML = `
      <button data-modo="variado" class="${modo === 'variado' ? 'on' : ''}" onclick="window.__modoModal('variado')">🧺 Surtido variado</button>
      <button data-modo="corrida" class="${modo === 'corrida' ? 'on' : ''}" onclick="window.__modoModal('corrida')">📦 Corrida completa</button>
    `
  }
}

window.__pickColor = (color) => {
  _modalSel.color = color
  _corridaM = 1
  document.querySelectorAll('#pm-swatches .swatch').forEach(s => s.classList.toggle('active', s.dataset.color === color))
  const vc = state.data.variantes.filter(v => v.producto_id === _modalSel.productoId && v.color === color)
  const foto = vc.map(v => v.foto_url).find(Boolean)
  const img = document.getElementById('pm-img')
  if (img && foto) img.src = foto
  actualizarTabsModal()
  pintarTallas()
}

window.__modoModal = (m) => {
  _modalSel.modo = m
  _corridaM = 1
  document.querySelectorAll('#pm-mode button').forEach(b => b.classList.toggle('on', b.dataset.modo === m))
  pintarTallas()
}

function _varsColorOrden() {
  const { productoId, color } = _modalSel
  return state.data.variantes
    .filter(v => v.producto_id === productoId && v.color === color)
    .sort((a, b) => TALLAS_ORDEN.indexOf(a.talla) - TALLAS_ORDEN.indexOf(b.talla))
}

function pintarTallas() {
  const cont = document.getElementById('pm-tallas')
  if (!cont) return
  const { color, modo, productoId } = _modalSel
  const p = state.data.productos.find(x => x.id === productoId)
  const vars = _varsColorOrden()
  const label = document.getElementById('pm-tallas-label')

  if (modo === 'corrida') {
    const maxM = maxCorridasDisponibles(productoId, color)
    if (_corridaM > maxM) _corridaM = Math.max(1, maxM)
    
    if (label) label.textContent = `Corrida completa — ${color} · ${money(p.precio_corrida)} x par`
    
    cont.className = 'corrida-rows'
    cont.innerHTML = `
      <div class="crow" style="border-bottom: none; padding-bottom: 12px; margin-bottom: 12px;">
        <span class="ct" style="min-width: 140px; font-weight: 800; font-size: 1.1rem; color: var(--black);">Corridas</span>
        <span class="cs muted" style="font-size: .8rem;">Máx: ${maxM}</span>
        <div class="cstep">
          <button onclick="window.__changeCorridaM(-1)">−</button>
          <span>${_corridaM}</span>
          <button onclick="window.__changeCorridaM(1)">+</button>
        </div>
      </div>
      <div style="padding: 12px 16px; background: rgba(107,27,154,0.06); border-radius: 8px; color: var(--pink); font-weight: 600; font-size: 0.9rem; text-align: center;">
        Cada corrida incluye 6 pares (sugeridos según stock disponible).
      </div>
    `
  } else {
    if (label) label.textContent = 'Tallas — ' + color
    cont.className = 'tallas'
    cont.innerHTML = vars.map(v => {
      const stock = state.data.stockPorVar[v.id] || 0
      const enCarrito = state.carrito.find(i => i.variante_id === v.id && !i.es_corrida)?.cantidad || 0
      return `<button class="talla ${enCarrito ? 'on' : ''}" ${stock <= 0 ? 'disabled' : ''} onclick="window.__addTalla('${v.id}')">
        <span class="t">${v.talla}</span>
        <span class="s">${stock <= 0 ? 'Agotado' : 'Stock ' + stock}</span>
        ${enCarrito ? `<span class="q">${enCarrito}</span>` : ''}
      </button>`
    }).join('')
  }
  actualizarFooterModal()
}

function actualizarFooterModal() {
  const foot = document.getElementById('pm-foot')
  if (!foot) return
  if (_modalSel.modo === 'corrida') {
    foot.innerHTML = `
      <button class="btn-primary" onclick="window.__agregarCorrida()">Agregar ${_corridaM} ${_corridaM === 1 ? 'corrida' : 'corridas'} (${_corridaM * 6} pares)</button>
    `
  } else {
    foot.innerHTML = `<button class="btn-primary" onclick="document.getElementById('pmodal').remove();window.__nav('carrito')">Listo · ver carrito</button>`
  }
}

window.__changeCorridaM = (d) => {
  const { productoId, color } = _modalSel
  const maxM = maxCorridasDisponibles(productoId, color)
  _corridaM = Math.min(maxM, Math.max(1, _corridaM + d))
  pintarTallas()
}

window.__agregarCorrida = () => {
  const { productoId, color } = _modalSel
  const p = state.data.productos.find(x => x.id === productoId)
  const resolvedQty = resolverItemsCorrida(productoId, color, _corridaM)
  let added = 0
  
  Object.entries(resolvedQty).forEach(([varId, cant]) => {
    if (cant <= 0) return
    const v = state.data.variantes.find(x => x.id === varId)
    const ex = state.carrito.find(i => i.variante_id === varId && i.es_corrida)
    if (ex) ex.cantidad += cant
    else state.carrito.push({
      variante_id: varId, producto_id: p.id, nombre: p.nombre, color: v.color, talla: v.talla,
      cantidad: cant, es_corrida: true,
      precio_menudeo: p.precio_menudeo, precio_mayoreo3: p.precio_mayoreo3, precio_mayoreo6: p.precio_mayoreo6, precio_corrida: p.precio_corrida,
      imagen: v.foto_url || p.imagen_principal || null,
      sku: p.sku_interno || null,
    })
    added += cant
  })
  
  if (!added) { toast('Elige al menos una corrida'); return }
  _corridaM = 1
  guardarCarrito()
  const m = document.getElementById('pmodal');
  if (m) {
    history.back()
    setTimeout(() => navTo('carrito'), 50)
  } else {
    navTo('carrito')
  }
  toast('Corrida agregada · ' + added + ' pares')
}

window.__addTalla = (varianteId) => {
  const v = state.data.variantes.find(x => x.id === varianteId)
  const p = state.data.productos.find(x => x.id === v.producto_id)
  const stock = state.data.stockPorVar[varianteId] || 0
  const item = state.carrito.find(i => i.variante_id === varianteId && !i.es_corrida)
  const actual = item?.cantidad || 0
  if (actual >= stock) { toast('Sin más stock (' + stock + ')'); return }
  if (item) item.cantidad += 1
  else state.carrito.push({
    variante_id: varianteId, producto_id: p.id, nombre: p.nombre, color: v.color, talla: v.talla,
    cantidad: 1, es_corrida: false,
    precio_menudeo: p.precio_menudeo, precio_mayoreo3: p.precio_mayoreo3, precio_mayoreo6: p.precio_mayoreo6, precio_corrida: p.precio_corrida,
    imagen: v.foto_url || p.imagen_principal || null,
    sku: p.sku_interno || null,
  })
  guardarCarrito()
  pintarTallas()
  document.querySelector('.bottomnav').outerHTML = renderBottomNav()
  toast('Agregado · ' + totalPares() + ' pares')
}

// ============================================================
//  CARRITO + precios por escalón
// ============================================================
function totalPares() { return state.carrito.reduce((s, i) => s + i.cantidad, 0) }
function paresSueltos() { return state.carrito.filter(i => !i.es_corrida).reduce((s, i) => s + i.cantidad, 0) }
function precioItem(i, sueltos) {
  if (i.es_corrida) return i.precio_corrida
  if (sueltos >= 6) return i.precio_mayoreo6
  if (sueltos >= 3) return i.precio_mayoreo3
  return i.precio_menudeo
}
function totalCarrito() {
  const s = paresSueltos()
  return state.carrito.reduce((sum, i) => sum + i.cantidad * precioItem(i, s), 0)
}
const PC_BORRADOR_MARCA = '[carrito-respaldo]'
let _borradorServerId = null
let _syncTimer = null
let _carritoPollInterval = null
let _carritoPollFocusHandler = null

function detenerPollCarrito() {
  if (_carritoPollInterval) { clearInterval(_carritoPollInterval); _carritoPollInterval = null }
  if (_carritoPollFocusHandler) { window.removeEventListener('focus', _carritoPollFocusHandler); _carritoPollFocusHandler = null }
}

function iniciarPollCarrito() {
  detenerPollCarrito()
  const refrescar = () => refrescarCarritoSiCambio()
  _carritoPollInterval = setInterval(refrescar, 8000)
  _carritoPollFocusHandler = refrescar
  window.addEventListener('focus', _carritoPollFocusHandler)
}

async function refrescarCarritoSiCambio() {
  if (state.tab !== 'carrito' || !state.sesion?.cliente_id) { detenerPollCarrito(); return }
  const activo = document.activeElement
  if (activo && (activo.tagName === 'INPUT' || activo.tagName === 'TEXTAREA')) return
  try {
    const ped = await fetch(API + '/portal/pedidos', { headers: authHeaders() }).then(r => r.ok ? r.json() : null)
    const borrador = (Array.isArray(ped) ? ped : []).find(p => p.notes === PC_BORRADOR_MARCA)
    const itemsServidor = borrador?.pedido_items || []
    
    const antes = JSON.stringify(state.carrito.map(i => [i.variante_id, i.cantidad, i.precio_unitario || i.precio_menudeo || 0]))
    const despues = JSON.stringify(itemsServidor.map(i => [i.variante_id || i.variantes?.id, i.cantidad, i.precio_unitario]))
    if (antes === despues) return

    _borradorServerId = borrador?.id || null
    state.carrito = itemsServidor.map(i => {
      const v = i.variantes
      const p = state.data.productos.find(x => x.id === (v?.producto_id || i.producto_id))
      return {
        producto_id: v?.producto_id || i.producto_id,
        variante_id: v?.id || i.variante_id,
        nombre: v?.productos?.nombre || i.nombre || p?.nombre || 'Producto',
        color: v?.color || i.color,
        talla: v?.talla || i.talla,
        cantidad: i.cantidad,
        es_corrida: !!i.es_corrida,
        precio_menudeo: p?.precio_menudeo || 0,
        precio_mayoreo3: p?.precio_mayoreo3 || 0,
        precio_mayoreo6: p?.precio_mayoreo6 || 0,
        precio_corrida: p?.precio_corrida || 0,
        imagen: v?.foto_url || p?.imagen_principal || null,
        sku: p?.sku_interno || i.sku || null,
      }
    })
    guardarCarritoLocalOnly()
    if (state.tab === 'carrito') renderCarrito()
  } catch (e) {}
}

function guardarCarritoLocalOnly() {
  try {
    localStorage.setItem(CARRITO_KEY, JSON.stringify(state.carrito))
  } catch(e) {}
  const nav = document.querySelector('.bottomnav')
  if (nav) nav.outerHTML = renderBottomNav()
}

function guardarCarrito() {
  guardarCarritoLocalOnly()
  sincronizarCarritoServidorDebounced()
}

function sincronizarCarritoServidorDebounced() {
  clearTimeout(_syncTimer)
  _syncTimer = setTimeout(() => { sincronizarCarritoServidor().catch(() => {}) }, 1500)
}

async function sincronizarCarritoServidor() {
  if (!state.sesion?.cliente_id) return
  if (!state.carrito.length) {
    if (_borradorServerId) {
      const idViejo = _borradorServerId
      _borradorServerId = null
      fetch(`${API}/pedidos/${idViejo}/cancelar`, { method: 'POST', headers: authHeaders() }).catch(() => {})
    }
    return
  }
  let pedidoId = _borradorServerId
  if (!pedidoId) {
    try {
      const ped = await fetch(API + '/portal/pedidos', { headers: authHeaders() }).then(r => r.ok ? r.json() : [])
      const borrador = (Array.isArray(ped) ? ped : []).find(p => p.notas === PC_BORRADOR_MARCA)
      if (borrador) {
        pedidoId = borrador.id
        _borradorServerId = pedidoId
      }
    } catch(e) {}
  }
  
  if (!pedidoId) {
    const res = await fetch(`${API}/pedidos`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ cliente_id: state.sesion.cliente_id, status: 'borrador', canal: 'portal_mayoreo', total: 0, notas: PC_BORRADOR_MARCA })
    })
    if (!res.ok) return
    const d = await res.json()
    pedidoId = Array.isArray(d) ? d[0]?.id : d?.id
    if (!pedidoId) return
    _borradorServerId = pedidoId
  }
  
  try {
    const actuales = await fetch(`${API}/pedidos/${pedidoId}/items`, { headers: authHeaders() }).then(r => r.ok ? r.json() : [])
    for (const it of (Array.isArray(actuales) ? actuales : [])) {
      await fetch(`${API}/pedidos/${pedidoId}/items/${it.id}`, { method: 'DELETE', headers: authHeaders() }).catch(() => {})
    }
    for (const item of state.carrito) {
      const totalPares = state.carrito.reduce((s, i) => s + i.cantidad, 0)
      const p = state.data.productos.find(x => x.id === item.producto_id)
      let pu = item.precio_menudeo || 0
      if (p) {
        if (item.es_corrida) pu = p.precio_corrida
        else if (totalPares >= 6) pu = p.precio_mayoreo6
        else if (totalPares >= 3) pu = p.precio_mayoreo3
      }
      
      await fetch(`${API}/pedidos/${pedidoId}/items`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({
          variante_id: item.variante_id, cantidad: item.cantidad, precio_unitario: pu,
          subtotal: item.cantidad * pu, nombre: item.nombre, color: item.color,
          talla: item.talla, es_corrida: !!item.es_corrida,
        })
      }).catch(() => {})
    }
    const total = totalCarrito()
    await fetch(`${API}/pedidos/${pedidoId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ total })
    }).catch(() => {})
  } catch (e) {}
}

async function restaurarCarritoDeServidor(pedidosCrudos) {
  const borrador = (Array.isArray(pedidosCrudos) ? pedidosCrudos : [])
    .find(p => p.notas === PC_BORRADOR_MARCA)
  if (!borrador) return
  _borradorServerId = borrador.id
  const items = borrador.pedido_items || []
  if (!items.length) return
  
  const delServidor = []
  items.forEach(i => {
    const v = i.variantes
    if (!v || !v.id) return
    const p = state.data.productos.find(x => x.id === v.producto_id)
    delServidor.push({
      producto_id: v.producto_id,
      variante_id: v.id,
      nombre: v.productos?.nombre || i.nombre || p?.nombre || 'Producto',
      color: v.color || i.color,
      talla: v.talla || i.talla,
      cantidad: i.cantidad,
      es_corrida: !!i.es_corrida,
      precio_menudeo: p?.precio_menudeo || 0,
      precio_mayoreo3: p?.precio_mayoreo3 || 0,
      precio_mayoreo6: p?.precio_mayoreo6 || 0,
      precio_corrida: p?.precio_corrida || 0,
      imagen: v.foto_url || p?.imagen_principal || null,
      sku: p?.sku_interno || i.sku || null,
    })
  })
  if (!delServidor.length) return
  state.carrito = delServidor
  guardarCarritoLocalOnly()
}

function tierLabel() {
  const s = paresSueltos()
  if (state.carrito.every(i => i.es_corrida) && state.carrito.length) return 'Corrida'
  if (s >= 6) return 'Mayoreo 6+'
  if (s >= 3) return 'Mayoreo 3+'
  return 'Menudeo'
}

function renderCarrito() {
  if (!state.carrito.length) {
    page().innerHTML = `<div class="empty"><div class="ic">🛒</div><p>Tu carrito está vacío</p>
      <button class="btn-primary" style="max-width:220px;margin:14px auto 0" onclick="window.__nav('tienda')">Ver catálogo</button></div>`
    return
  }
  const sueltos = paresSueltos()
  const total = totalCarrito()

  // Group corridas by product_id and color
  const sueltosList = state.carrito.filter(i => !i.es_corrida)
  const corridasList = state.carrito.filter(i => i.es_corrida)
  
  const gruposCorrida = {}
  corridasList.forEach(i => {
    const key = `${i.producto_id}-${i.color}`
    if (!gruposCorrida[key]) {
      gruposCorrida[key] = {
        key,
        es_grupo_corrida: true,
        producto_id: i.producto_id,
        color: i.color,
        nombre: i.nombre,
        imagen: i.imagen,
        precio_corrida: i.precio_corrida,
        cantidad: 0,
        items: []
      }
    }
    gruposCorrida[key].cantidad += i.cantidad
    gruposCorrida[key].items.push(i)
  })
  
  const itemsParaRender = [
    ...sueltosList.map((i, idx) => ({ ...i, originalIdx: state.carrito.indexOf(i) })),
    ...Object.values(gruposCorrida)
  ]

  page().innerHTML = `
    <p class="section-title">${totalPares()} pares · ${tierLabel()}</p>
    ${itemsParaRender.map((i) => {
      if (i.es_grupo_corrida) {
        return `
          <div class="row">
            <div class="r-top">
              ${i.imagen ? `<img src="${i.imagen}">` : `<div style="width:52px;height:52px;border-radius:9px;background:#f1f1f5;display:flex;align-items:center;justify-content:center">👠</div>`}
              <div style="flex:1;min-width:0">
                <div style="font-weight:700;font-size:.95rem;color:var(--text)">${esc(String(i.nombre || '').split(' ')[0])}</div>
                <div class="muted" style="font-size:.78rem">${esc(i.color)} · Corrida</div>
                <div style="font-weight:700;color:var(--pink);margin-top:3px">${money(i.precio_corrida)} <span class="muted" style="font-size:.7rem;font-weight:600">x par</span></div>
              </div>
              <button onclick="window.__delGrupoCorrida('${i.producto_id}', '${esc(i.color)}')" style="background:none;border:none;color:#ccc;font-size:1.2rem">✕</button>
            </div>
            <div class="qty" style="margin-top:10px">
              <button onclick="window.__qtyGrupoCorrida('${i.producto_id}', '${esc(i.color)}', -1)">−</button>
              <span style="font-weight:700;min-width:26px;text-align:center">${i.cantidad}</span>
              <button onclick="window.__qtyGrupoCorrida('${i.producto_id}', '${esc(i.color)}', 1)">+</button>
              <span style="margin-left:auto;font-weight:700">${money(i.cantidad * i.precio_corrida)}</span>
            </div>
          </div>
        `
      } else {
        return `
          <div class="row">
            <div class="r-top">
              ${i.imagen ? `<img src="${i.imagen}">` : `<div style="width:52px;height:52px;border-radius:9px;background:#f1f1f5;display:flex;align-items:center;justify-content:center">👠</div>`}
              <div style="flex:1;min-width:0">
                <div style="font-weight:700;font-size:.95rem;color:var(--text)">${esc(String(i.nombre || '').split(' ')[0])}</div>
                <div class="muted" style="font-size:.78rem">${esc(i.color)} · T${esc(i.talla)}</div>
                <div style="font-weight:700;color:var(--pink);margin-top:3px">${money(precioItem(i, sueltos))} <span class="muted" style="font-size:.7rem;font-weight:600">x par</span></div>
              </div>
              <button onclick="window.__delItem(${i.originalIdx})" style="background:none;border:none;color:#ccc;font-size:1.2rem">✕</button>
            </div>
            <div class="qty" style="margin-top:10px">
              <button onclick="window.__qty(${i.originalIdx},-1)">−</button>
              <span style="font-weight:700;min-width:26px;text-align:center">${i.cantidad}</span>
              <button onclick="window.__qty(${i.originalIdx},1)">+</button>
              <span style="margin-left:auto;font-weight:700">${money(i.cantidad * precioItem(i, sueltos))}</span>
            </div>
          </div>
        `
      }
    }).join('')}
    <div style="height:120px"></div>
    <div class="sticky-total">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <span class="muted">Total (${totalPares()} pares)</span>
        <span style="font-size:1.4rem;font-weight:800;color:var(--pink)">${money(total)}</span>
      </div>
      <button class="btn-primary" onclick="window.__enviarPedido()">Enviar pedido</button>
    </div>`
}

window.__qty = (idx, d) => {
  const i = state.carrito[idx]; if (!i) return
  if (d > 0) {
    const stock = state.data.stockPorVar[i.variante_id] || 0
    const enCarrito = state.carrito.filter(x => x.variante_id === i.variante_id).reduce((s, x) => s + x.cantidad, 0)
    if (enCarrito >= stock) { toast('Sin más stock (' + stock + ')'); return }
  }
  i.cantidad = Math.max(1, i.cantidad + d)
  guardarCarrito(); renderCarrito()
  document.querySelector('.bottomnav').outerHTML = renderBottomNav()
}

window.__delItem = (idx) => {
  state.carrito.splice(idx, 1); guardarCarrito(); renderCarrito()
  document.querySelector('.bottomnav').outerHTML = renderBottomNav()
}

window.__qtyGrupoCorrida = (productoId, color, d) => {
  const items = state.carrito.filter(i => i.producto_id === productoId && i.color === color && i.es_corrida)
  const currentTotal = items.reduce((s, x) => s + x.cantidad, 0)
  const currentM = currentTotal / 6
  const newM = currentM + d
  
  if (newM <= 0) {
    window.__delGrupoCorrida(productoId, color)
    return
  }
  
  const maxM = maxCorridasDisponibles(productoId, color)
  if (newM > maxM) {
    toast(`Sin existencias para ${newM} corridas (máximo ${maxM})`)
    return
  }
  
  const newQtyMap = resolverItemsCorrida(productoId, color, newM)
  
  // Remove existing
  state.carrito = state.carrito.filter(i => !(i.producto_id === productoId && i.color === color && i.es_corrida))
  
  // Add new
  const p = state.data.productos.find(x => x.id === productoId)
  Object.entries(newQtyMap).forEach(([varId, cant]) => {
    if (cant <= 0) return
    const v = state.data.variantes.find(x => x.id === varId)
    state.carrito.push({
      variante_id: varId, producto_id: p.id, nombre: p.nombre, color: v.color, talla: v.talla,
      cantidad: cant, es_corrida: true,
      precio_menudeo: p.precio_menudeo, precio_mayoreo3: p.precio_mayoreo3, precio_mayoreo6: p.precio_mayoreo6, precio_corrida: p.precio_corrida,
      imagen: v.foto_url || p.imagen_principal || null,
    })
  })
  
  guardarCarrito()
  renderCarrito()
  const nav = document.querySelector('.bottomnav'); if (nav) nav.outerHTML = renderBottomNav()
}

window.__delGrupoCorrida = (productoId, color) => {
  state.carrito = state.carrito.filter(i => !(i.producto_id === productoId && i.color === color && i.es_corrida))
  guardarCarrito()
  renderCarrito()
  const nav = document.querySelector('.bottomnav'); if (nav) nav.outerHTML = renderBottomNav()
}

// Envía el carrito al backend seguro: el server usa el cliente_id del token y
// recalcula los precios (el cliente no puede manipularlos). Llega a "Carritos".
window.__enviarPedido = async () => {
  if (!state.carrito.length) return
  if (state.sesion?.demo) { toast('Modo demo: no se envía pedido real'); return }
  if (!confirm('¿Enviar este pedido al negocio? Te confirmarán existencia y total.')) return
  try {
    const res = await fetch(API + '/portal/carrito', {
      method: 'POST', headers: authHeaders(),
      body: JSON.stringify({ items: state.carrito.map(i => ({ variante_id: i.variante_id, cantidad: i.cantidad, es_corrida: !!i.es_corrida })) })
    })
    if (manejar401(res)) return
    const d = await res.json()
    if (!res.ok || !d.ok) throw new Error(d.error || '')
    state.carrito = []; guardarCarrito()
    toast(d.fusionado ? 'Se agregó a tu carrito anterior' : '¡Pedido enviado!')
    navTo('pedidos')
  } catch {
    alert('No se pudo enviar el pedido. Intenta de nuevo.')
  }
}

// ============================================================
//  MIS PEDIDOS + seguimiento
// ============================================================
async function renderPedidos() {
  page().innerHTML = `<div class="spinner">Cargando pedidos…</div>`
  let pedidos = []
  try {
    const res = await fetch(API + '/portal/pedidos', { headers: authHeaders() })
    if (manejar401(res)) return
    pedidos = await res.json()
  } catch {}
  pedidos = Array.isArray(pedidos) ? pedidos.filter(p => p.status !== 'borrador') : []
  if (!pedidos.length) {
    page().innerHTML = `<div class="empty"><div class="ic">🛍️</div><p>Aún no tienes pedidos confirmados</p></div>`
    return
  }
  page().innerHTML = pedidos.map(p => {
    const items = p.pedido_items || []
    const pares = items.reduce((s, i) => s + (i.cantidad || 0), 0)
    const fecha = p.created_at ? new Date(p.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) : ''
    return `<div class="row">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <div>
          <div style="font-weight:700">Pedido #${String(p.id).slice(-6)}</div>
          <div class="muted" style="font-size:.76rem">${fecha} · ${pares} pares</div>
        </div>
        ${badgeEstatus(p.status)}
      </div>
      <div style="font-weight:800;color:var(--pink);font-size:1.1rem">${money(num(p.total))}</div>
      ${items.slice(0, 4).map(it => `<div class="muted" style="font-size:.78rem;margin-top:4px">• ${esc(it.variantes?.productos?.nombre || it.nombre || 'Producto')} ${it.color ? '· ' + esc(it.color) : ''} T${esc(it.talla || '')} ×${it.cantidad}</div>`).join('')}
      ${items.length > 4 ? `<div class="muted" style="font-size:.76rem;margin-top:4px">+${items.length - 4} más…</div>` : ''}
      ${p.numero_guia ? `<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--line)">
        <div class="muted" style="font-size:.74rem">📦 ${esc(p.paqueteria || 'Envío')} · Guía ${esc(p.numero_guia)}</div>
        ${urlSegura(p.tracking_url) ? `<a href="${esc(urlSegura(p.tracking_url))}" target="_blank" rel="noopener noreferrer" style="color:var(--pink);font-size:.8rem;font-weight:600;text-decoration:none">Rastrear envío →</a>` : ''}
      </div>` : ''}
    </div>`
  }).join('')
}

function badgeEstatus(status) {
  const map = {
    borrador: ['#eef2ff', '#3730a3', 'Borrador'],
    pendiente_pago: ['#fffbeb', '#b45309', 'Por pagar'],
    confirmado: ['#ecfdf5', '#065f46', 'Confirmado'],
    pagado: ['#ecfdf5', '#065f46', 'Pagado'],
    enviado: ['#eff6ff', '#1d4ed8', 'Enviado'],
    entregado: ['#f0fdf4', '#15803d', 'Entregado'],
    cancelado: ['#fef2f2', '#991b1b', 'Cancelado'],
  }
  const [bg, col, txt] = map[status] || ['#f3f4f6', '#374151', status || '—']
  return `<span class="badge-status" style="background:${bg};color:${col}">${txt}</span>`
}

// ============================================================
//  CUENTA
// ============================================================
async function renderCuenta() {
  page().innerHTML = `<div class="spinner">Cargando…</div>`
  let cli = null
  try {
    const res = await fetch(API + '/portal/me', { headers: authHeaders() })
    if (manejar401(res)) return
    cli = await res.json()
  } catch {}
  cli = cli || { nombre: state.sesion.nombre, tipo: state.sesion.tipo }
  page().innerHTML = `
    <div class="row">
      <p class="section-title">Mis datos</p>
      <p style="font-weight:700;margin:0 0 2px">${esc(cli.nombre || '')}</p>
      <p class="muted" style="font-size:.84rem;margin:0">${esc(cli.telefono || 'Sin teléfono')}</p>
      <p class="muted" style="font-size:.84rem;margin:2px 0 0">${esc(cli.email || 'Sin correo')}</p>
      <p style="margin:10px 0 0"><span class="badge-status" style="background:#fce4f3;color:var(--pink)">Cliente ${esc(cli.tipo || 'mayoreo')}</span></p>
    </div>
    ${cli.direccion || cli.ciudad ? `<div class="row">
      <p class="section-title">Dirección</p>
      <p class="muted" style="font-size:.84rem;margin:0">${esc(cli.direccion || '')} ${esc(cli.ciudad || '')} ${esc(cli.estado || '')} ${esc(cli.codigo_postal || '')}</p>
    </div>` : ''}
    ${num(cli.limite_credito) || num(cli.credito_disponible) ? `<div class="row">
      <p class="section-title">Crédito</p>
      ${num(cli.limite_credito) ? `<p style="font-size:.86rem;margin:0">Límite: <b>${money(num(cli.limite_credito))}</b>${cli.dias_credito ? ' · ' + cli.dias_credito + ' días' : ''}</p>` : ''}
      ${num(cli.credito_disponible) ? `<p style="font-size:.86rem;margin:4px 0 0">Saldo a favor: <b>${money(num(cli.credito_disponible))}</b></p>` : ''}
    </div>` : ''}
    <button class="btn-primary" style="background:#fff;color:var(--pink);border:1.5px solid var(--pink);margin-top:6px" onclick="window.__salir()">Cerrar sesión</button>
    <p class="muted" style="text-align:center;font-size:.7rem;margin-top:16px">Portal mayoreo · prototipo</p>`
}
window.__salir = salir

// ============================================================
//  CATÁLOGOS (ver / descargar)
// ============================================================
async function renderCatalogos() {
  page().innerHTML = `<div class="spinner">Cargando catálogos…</div>`
  let cats = []
  try { cats = await fetch(API + '/catalogos/').then(r => r.json()) } catch {}
  cats = Array.isArray(cats) ? cats : []

  const categoriasMap = [
    ['tacones', '👠 Tacones'],
    ['sandalias', '👡 Sandalias'],
    ['flats', '🥿 Flats'],
    ['botas', '🥾 Botas'],
    ['botines', '👢 Botines'],
    ['plataformas', '⬆️ Plataformas'],
    ['tenis', '👟 Tenis'],
    ['nina', '🎀 Niña'],
    ['accesorios', '👜 Accesorios'],
  ]

  const catalogosHtml = cats.length ? cats.map(c => `
    <div class="cat-card">
      ${c.portada_url ? `<img src="${c.portada_url}" loading="lazy">` : `<div style="width:70px;height:90px;border-radius:9px;background:#f0f0f4"></div>`}
      <div class="info">
        <h3>${esc(c.nombre || 'Catálogo')}</h3>
        <div class="muted" style="font-size:.78rem">${esc(c.temporada || '')}</div>
        <div class="actions">
          <button class="btn-mini" onclick="window.__verCatalogo('${c.id}','${esc(c.nombre || '')}')">Ver</button>
          <button class="btn-mini ghost" onclick="window.__descargarCatalogo('${c.id}','${esc(c.nombre || '')}',this)">Descargar</button>
        </div>
      </div>
    </div>`).join('') : `<div class="empty"><div class="ic">📖</div><p>No hay catálogos generales por ahora</p></div>`;

  page().innerHTML = `
    <div class="catalogos-tabs">
      <button class="sub-tab active" id="btn-cat-general" onclick="window.__switchSubTab('general')">Catálogos Generales</button>
      <button class="sub-tab" id="btn-cat-categorias" onclick="window.__switchSubTab('categorias')">Descarga de catálogo de...</button>
    </div>
    
    <div id="catalogos-general-content" style="display:block;">
      <p class="section-title">Catálogos para descargar</p>
      <div class="cat-list">
        ${catalogosHtml}
      </div>
    </div>
    
    <div id="catalogos-categorias-content" style="display:none;">
      <p class="section-title">Generar catálogo PDF por categoría</p>
      <p class="muted" style="font-size:.8rem; line-height:1.4; margin-bottom:16px;">
        Selecciona una categoría para descargar un catálogo PDF de marca blanca (sin logotipos) con las fotos de portada de cada color y su código identificador (ej: EF1203 NEGRO). Ideal para compartir directamente con tus clientes.
      </p>
      <div class="category-grid" id="cat-pdf-btns">
        ${categoriasMap.map(([slug, label]) => `
          <button class="category-btn" data-categoria="${slug}" data-label="${label.replace(/^[^\s]+\s/, '')}" onclick="window.__descargarPdfCategorias(this)">
            <span class="icon">${label.split(' ')[0]}</span>
            <span class="label">${label.split(' ')[1]}</span>
          </button>
        `).join('')}
      </div>
      <div id="cat-pdf-msg" class="cat-pdf-msg" style="display:none;"></div>
    </div>`
}

window.__switchSubTab = (tab) => {
  const generalContent = document.getElementById('catalogos-general-content');
  const categoriasContent = document.getElementById('catalogos-categorias-content');
  const btnGeneral = document.getElementById('btn-cat-general');
  const btnCategorias = document.getElementById('btn-cat-categorias');
  
  if (tab === 'categorias') {
    if (generalContent) generalContent.style.display = 'none';
    if (categoriasContent) categoriasContent.style.display = 'block';
    if (btnGeneral) btnGeneral.classList.remove('active');
    if (btnCategorias) btnCategorias.classList.add('active');
  } else {
    if (generalContent) generalContent.style.display = 'block';
    if (categoriasContent) categoriasContent.style.display = 'none';
    if (btnGeneral) btnGeneral.classList.add('active');
    if (btnCategorias) btnCategorias.classList.remove('active');
  }
}

window.__descargarPdfCategorias = async (btn) => {
  const catSlug = btn.getAttribute('data-categoria');
  const catLabel = btn.getAttribute('data-label');
  const msgEl = document.getElementById('cat-pdf-msg');
  const btns = document.querySelectorAll('#cat-pdf-btns button');
  
  btns.forEach(b => b.disabled = true);
  if (msgEl) {
    msgEl.style.display = 'block';
    msgEl.textContent = `⏳ Cargando productos de ${catLabel}...`;
  }
  
  try {
    const prods = state.data.productos.filter(p => 
      p.categoria && String(p.categoria).trim().toLowerCase() === String(catSlug).trim().toLowerCase()
    );
    if (!prods.length) {
      if (msgEl) msgEl.textContent = `Sin productos activos en ${catLabel}`;
      setTimeout(() => { if (msgEl) msgEl.style.display = 'none'; }, 3000);
      btns.forEach(b => b.disabled = false);
      return;
    }
    
    const items = [];
    prods.forEach(p => {
      const productVars = state.data.variantes.filter(v => v.producto_id === p.id && v.activa !== false);
      const colorsSeen = new Set();
      
      productVars.forEach(v => {
        if (!v.color || colorsSeen.has(v.color.trim().toUpperCase())) return;
        colorsSeen.add(v.color.trim().toUpperCase());
        const imgUrl = v.foto_url || p.imagen_principal;
        if (imgUrl) {
          items.push({
            sku: p.sku_interno || 'S/K',
            color: v.color.trim().toUpperCase(),
            imgUrl: imgUrl
          });
        }
      });
      
      if (colorsSeen.size === 0 && p.imagen_principal) {
        items.push({
          sku: p.sku_interno || 'S/K',
          color: 'ÚNICO',
          imgUrl: p.imagen_principal
        });
      }
    });
    
    if (!items.length) {
      if (msgEl) msgEl.textContent = `Sin fotos disponibles para ${catLabel}`;
      setTimeout(() => { if (msgEl) msgEl.style.display = 'none'; }, 3000);
      btns.forEach(b => b.disabled = false);
      return;
    }
    
    if (msgEl) msgEl.textContent = `✏️ Generando catálogo PDF (${items.length} variantes)...`;
    
    if (!window.jspdf) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
    
    const { jsPDF } = window.jspdf;
    const cols = 2;
    const rows = 3;
    const itemsPerPage = cols * rows;
    const pageW = 1080;
    const pageH = 1440;
    
    const marginX = 40;
    const marginY = 80;
    const gapX = 24;
    const gapY = 32;
    
    const cellW = (pageW - marginX * 2 - gapX * (cols - 1)) / cols;
    const cellH = (pageH - marginY * 2 - gapY * (rows - 1)) / rows;
    const imgH = cellH - 50;
    
    const loadImage = (url) => new Promise(res => {
      if (!url) return res(null);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => res(img);
      img.onerror = () => res(null);
      img.src = url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now();
    });
    
    const drawCellImage = (ctx, img, x, y, w, h) => {
      ctx.save();
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(x, y, w, h);
      
      if (img) {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.clip();
        
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const cellRatio = w / h;
        
        let drawW, drawH, drawX, drawY;
        if (imgRatio > cellRatio) {
          drawH = h;
          drawW = h * imgRatio;
          drawY = y;
          drawX = x + (w - drawW) / 2;
        } else {
          drawW = w;
          drawH = w / imgRatio;
          drawX = x;
          drawY = y + (h - drawH) / 2;
        }
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      } else {
        ctx.fillStyle = '#F3F4F6';
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = '#9CA3AF';
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Sin imagen', x + w / 2, y + h / 2);
      }
      ctx.restore();
    };
    
    const pages = [];
    for (let i = 0; i < items.length; i += itemsPerPage) {
      pages.push(items.slice(i, i + itemsPerPage));
    }
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [pageW, pageH]
    });
    
    let isFirstPage = true;
    for (let pIdx = 0; pIdx < pages.length; pIdx++) {
      if (msgEl) msgEl.textContent = `✏️ Generando página ${pIdx + 1} de ${pages.length}...`;
      
      const pageItems = pages[pIdx];
      const canvas = document.createElement('canvas');
      canvas.width = pageW;
      canvas.height = pageH;
      const ctx = canvas.getContext('2d');
      
      ctx.fillStyle = '#FAFAF8';
      ctx.fillRect(0, 0, pageW, pageH);
      
      // White-label Header (No logo text, only generic catalog name)
      ctx.fillStyle = '#2A1A0E';
      ctx.font = '300 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '4px';
      ctx.fillText(`CATÁLOGO DE ${catLabel.toUpperCase()}`, pageW / 2, 38);
      ctx.letterSpacing = '0px';
      
      ctx.fillStyle = '#C8967A';
      ctx.fillRect(marginX, 48, pageW - marginX * 2, 1.5);
      
      for (let cellIdx = 0; cellIdx < pageItems.length; cellIdx++) {
        const item = pageItems[cellIdx];
        const colIdx = cellIdx % cols;
        const rowIdx = Math.floor(cellIdx / cols);
        
        const cellX = marginX + colIdx * (cellW + gapX);
        const cellY = marginY + rowIdx * (cellH + gapY);
        
        const img = await loadImage(item.imgUrl);
        drawCellImage(ctx, img, cellX, cellY, cellW, imgH);
        
        ctx.fillStyle = '#E8DDD5';
        ctx.fillRect(cellX, cellY + imgH, cellW, 1);
        
        ctx.fillStyle = '#2A1A0E';
        ctx.textAlign = 'center';
        ctx.font = '600 18px sans-serif';
        ctx.fillText(`${item.sku} ${item.color}`, cellX + cellW / 2, cellY + imgH + 28);
      }
      
      // White-label Footer (No brand name, no website url, only page number)
      ctx.fillStyle = '#C8967A';
      ctx.fillRect(marginX, pageH - 48, pageW - marginX * 2, 1);
      
      ctx.fillStyle = '#A07860';
      ctx.font = '300 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Página ${pIdx + 1} de ${pages.length}`, pageW / 2, pageH - 30);
      
      const imgData = canvas.toDataURL('image/jpeg', 0.90);
      if (!isFirstPage) {
        doc.addPage([pageW, pageH]);
      }
      doc.addImage(imgData, 'JPEG', 0, 0, pageW, pageH);
      isFirstPage = false;
    }
    
    const filename = `catalogo_${catSlug}_${new Date().toISOString().slice(0,10)}.pdf`;
    doc.save(filename);
    
    if (msgEl) {
      msgEl.textContent = `✅ ¡Catálogo descargado!`;
      setTimeout(() => { msgEl.style.display = 'none'; }, 4000);
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    if (msgEl) msgEl.textContent = `❌ Error al generar el PDF: ${error.message}`;
  } finally {
    btns.forEach(b => b.disabled = false);
  }
}

async function _paginasCatalogo(id) {
  const p = await fetch(API + '/catalogos/' + id + '/paginas').then(r => r.json()).catch(() => [])
  return Array.isArray(p) ? p : []
}

window.__verCatalogo = async (id, nombre) => {
  const pgs = await _paginasCatalogo(id)
  const ov = document.createElement('div'); ov.className = 'modal-overlay'; ov.id = 'catv'
  ov.innerHTML = `
    <div class="modal">
      <div class="m-head">
        <div style="flex:1"><div style="font-weight:700">${esc(nombre)}</div><div class="muted" style="font-size:.76rem">${pgs.length} páginas</div></div>
        <button onclick="document.getElementById('catv').remove()" style="background:none;border:none;font-size:1.5rem;color:#aaa">✕</button>
      </div>
      <div class="m-scroll"><div class="viewer-pages">${pgs.length ? pgs.map(p => `<img src="${p.imagen_url}" loading="lazy">`).join('') : '<p class="muted">Este catálogo no tiene páginas todavía.</p>'}</div></div>
      <div class="m-foot"><button class="btn-primary" onclick="window.__descargarCatalogo('${id}','${esc(nombre)}',this)">⬇ Descargar todas las páginas</button></div>
    </div>`
  document.body.appendChild(ov)
  ov.addEventListener('click', e => { if (e.target === ov) ov.remove() })
}

window.__descargarCatalogo = async (id, nombre, btn) => {
  const orig = btn ? btn.textContent : ''
  if (btn) { btn.disabled = true; btn.textContent = 'Descargando…' }
  try {
    const pgs = await _paginasCatalogo(id)
    if (!pgs.length) { toast('Este catálogo no tiene páginas'); if (btn) { btn.disabled = false; btn.textContent = orig } ; return }
    const base = (nombre || 'catalogo').replace(/[^\w]+/g, '_')
    let i = 0
    for (const p of pgs) {
      i++
      try {
        const r = await fetch(p.imagen_url)
        const blob = await r.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url; a.download = `${base}_${String(p.pagina_numero || i).padStart(2, '0')}.jpg`
        document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        await new Promise(res => setTimeout(res, 300))
      } catch { window.open(p.imagen_url, '_blank') }
    }
    toast('Descarga lista · ' + pgs.length + ' páginas')
  } catch { toast('No se pudo descargar') }
  if (btn) { btn.disabled = false; btn.textContent = orig }
}

// ============================================================
//  CONVERSACIONES — chat con Maya (POST /chatbot/mensaje)
// ============================================================
function renderMaya() {
  if (!state.mayaMsgs) state.mayaMsgs = []
  page().innerHTML = `
    <div class="chat-wrap">
      <div class="chat-msgs" id="maya-msgs">
        ${state.mayaMsgs.length ? state.mayaMsgs.map(burbujaMaya).join('')
          : `<div class="chat-intro">👋 ¡Hola! Soy <b>Maya</b>, tu asesora de Zapatillas&nbsp;May.<br>Pregúntame por modelos, precios de mayoreo, envíos o lo que necesites.</div>`}
      </div>
      <div class="chat-input">
        <input id="maya-in" placeholder="Escribe tu mensaje…" autocomplete="off">
        <button id="maya-send">➤</button>
      </div>
    </div>`
  document.getElementById('maya-send').onclick = window.__mayaSend
  document.getElementById('maya-in').addEventListener('keydown', e => { if (e.key === 'Enter') window.__mayaSend() })
  setTimeout(() => { const c = document.getElementById('maya-msgs'); if (c) c.scrollTop = c.scrollHeight }, 50)
}

function burbujaMaya(m) {
  if (m.typing) return `<div class="msg bot typing">Maya está escribiendo…</div>`
  const fotos = (m.fotos || []).map(u => `<img src="${esc(u)}" loading="lazy">`).join('')
  return `<div class="msg ${m.role === 'me' ? 'me' : 'bot'}">${esc(m.content)}${fotos}</div>`
}

function pintarMaya() {
  const c = document.getElementById('maya-msgs'); if (!c) return
  c.innerHTML = state.mayaMsgs.map(burbujaMaya).join('')
  c.scrollTop = c.scrollHeight
}

function limpiarMaya(s) {
  const fotos = []
  let t = String(s || '').replace(/ENVIAR_FOTO:\[?(\S+?)\]?(?=\s|$)/g, (m, u) => { fotos.push(u.replace(/[\[\]]/g, '')); return '' })
  t = t.replace(/BUSCAR_COLORES:\[?[A-Za-z0-9_\-]+\]?/g, '').replace(/\n{3,}/g, '\n\n').trim()
  return { texto: t || '👍', fotos }
}

window.__mayaSend = async () => {
  const inp = document.getElementById('maya-in'); if (!inp) return
  const txt = (inp.value || '').trim(); if (!txt) return
  inp.value = ''
  if (!state.mayaMsgs) state.mayaMsgs = []
  // historial ANTES de este mensaje (el endpoint agrega el mensaje actual)
  const historial = state.mayaMsgs.filter(m => !m.typing).map(m => ({ role: m.role === 'me' ? 'user' : 'assistant', content: m.content }))
  state.mayaMsgs.push({ role: 'me', content: txt })
  state.mayaMsgs.push({ role: 'bot', typing: true })
  pintarMaya()
  try {
    const r = await fetch(API + '/chatbot/mensaje', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje: txt, historial })
    })
    const d = await r.json()
    state.mayaMsgs.pop() // quitar "escribiendo…"
    const { texto, fotos } = limpiarMaya(d.respuesta)
    state.mayaMsgs.push({ role: 'bot', content: texto, fotos })
  } catch {
    state.mayaMsgs.pop()
    state.mayaMsgs.push({ role: 'bot', content: 'Ups, no me pude conectar. Intenta de nuevo en un momento.' })
  }
  pintarMaya()
}

// ---------- toast ----------
let _toastT = null
function toast(msg) {
  const t = document.getElementById('toast'); if (!t) return
  t.textContent = msg; t.classList.add('show')
  clearTimeout(_toastT); _toastT = setTimeout(() => t.classList.remove('show'), 1600)
}

window.abrirLightboxPC = function(src, fotos, sku) {
  if (!src) return
  const prev = document.getElementById('pc-lightbox')
  if (prev) prev.remove()

  if (!fotos || !fotos.length) {
    // Intentar recopilar fotos del swatch del modal actual
    const swatches = document.getElementById('pm-swatches')
    if (swatches) {
      fotos = Array.from(swatches.querySelectorAll('img')).map(i => i.src)
    }
    if (!fotos || !fotos.length) fotos = [src]
    if (!fotos.includes(src)) fotos = [src, ...fotos]
  }

  let idx = fotos.indexOf(src)
  if (idx < 0) idx = 0

  const lb = document.createElement('div')
  lb.id = 'pc-lightbox'
  lb.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:19999;display:flex;flex-direction:column;align-items:center;justify-content:center;touch-action:none;user-select:none'

  let scale = 1;
  let currentX = 0, currentY = 0;
  let startScale = 1;
  let initDistance = 0;

  const resetZoom = () => {
    scale = 1;
    currentX = 0;
    currentY = 0;
    const img = document.getElementById('lb-img')
    if (img) {
      img.style.transform = '';
      img.style.cursor = 'zoom-in';
    }
  }

  const render = () => {
    const total = fotos.length
    lb.innerHTML = `
      <button onclick="history.back()" style="position:absolute;top:16px;right:16px;background:rgba(255,255,255,0.1);border:none;color:white;font-size:1.4rem;width:44px;height:44px;border-radius:50%;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center">✕</button>
      <button onclick="pcCompartirImagenLB()" title="Compartir esta foto" style="position:absolute;top:16px;left:16px;background:rgba(255,255,255,0.15);border:none;color:white;width:44px;height:44px;border-radius:50%;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
      </button>
      <button onclick="pcDescargarImagenLB()" title="Descargar esta foto" style="position:absolute;top:16px;left:68px;background:rgba(255,255,255,0.15);border:none;color:white;width:44px;height:44px;border-radius:50%;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
      </button>
      ${total > 1 ? `<button id="lb-prev" onclick="lbNav(-1)" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.12);border:none;color:white;font-size:1.6rem;width:44px;height:44px;border-radius:50%;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center;opacity:${idx===0?0.3:1}">‹</button>` : ''}
      <img id="lb-img" src="${fotos[idx]}" style="max-width:92vw;max-height:82vh;object-fit:contain;border-radius:10px;box-shadow:0 8px 40px rgba(0,0,0,0.8);user-select:none;-webkit-user-drag:none;cursor:zoom-in;transition:transform 0.1s ease-out">
      ${total > 1 ? `<button id="lb-next" onclick="lbNav(1)" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.12);border:none;color:white;font-size:1.6rem;width:44px;height:44px;border-radius:50%;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center;opacity:${idx===total-1?0.3:1}">›</button>` : ''}
      ${total > 1 ? `<div style="display:flex;gap:6px;margin-top:14px;z-index:2">${fotos.map((_,i)=>`<div onclick="lbGoto(${i})" style="width:${i===idx?'22px':'8px'};height:8px;border-radius:4px;background:${i===idx?'#E91E8C':'rgba(255,255,255,0.3)'};cursor:pointer;transition:all 0.2s"></div>`).join('')}</div>` : ''}
    `
  }

  window.pcCompartirImagenLB = async () => {
    const url = fotos[idx]
    if (!url) return
    try {
      const resp = await fetch(url)
      const blob = await resp.blob()
      const ext = (blob.type.split('/')[1] || 'jpg').replace('jpeg', 'jpg')
      const file = new File([blob], `zapatillasmay-${Date.now()}.${ext}`, { type: blob.type })
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file] })
      } else if (navigator.share) {
        await navigator.share({ url })
      } else {
        window.pcDescargarImagenLB()
      }
    } catch (e) {
      if (e?.name !== 'AbortError') toast('No se pudo compartir la imagen')
    }
  }

  window.pcDescargarImagenLB = async () => {
    const url = fotos[idx]
    if (!url) return
    try {
      const resp = await fetch(url)
      const blob = await resp.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      const cleanSku = sku ? sku.replace(/[^A-Za-z0-9_-]/g, '') : ''
      a.download = cleanSku ? `Zapatillas_May_${cleanSku}.jpg` : `Zapatillas_May_${Date.now()}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(a.href)
      toast('Imagen descargada')
    } catch (e) {
      window.open(url, '_blank')
    }
  }

  window.lbNav = (dir) => {
    if (dir < 0 && idx === 0) return
    if (dir > 0 && idx === fotos.length - 1) return
    idx = Math.max(0, Math.min(fotos.length - 1, idx + dir))
    resetZoom()
    render()
    addGestures()
  }
  window.lbGoto = (i) => { idx = i; resetZoom(); render(); addGestures() }

  const addGestures = () => {
    const img = document.getElementById('lb-img')
    if (!img) return

    let isDragging = false
    let startX = 0, startY = 0
    let lastTap = 0

    img.addEventListener('touchstart', e => {
      if (e.touches.length === 1) {
        const currentTime = new Date().getTime()
        const tapLength = currentTime - lastTap
        if (tapLength < 300 && tapLength > 0) {
          if (scale > 1) {
            resetZoom()
          } else {
            scale = 2.5
            img.style.transform = `scale(${scale})`
            img.style.cursor = 'grab'
          }
          e.preventDefault()
          return
        }
        lastTap = currentTime

        if (scale > 1) {
          isDragging = true
          startX = e.touches[0].clientX - currentX
          startY = e.touches[0].clientY - currentY
        } else {
          startX = e.touches[0].clientX
        }
      } else if (e.touches.length === 2) {
        isDragging = false
        startScale = scale
        initDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
      }
    }, { passive: false })

    img.addEventListener('touchmove', e => {
      if (e.touches.length === 1 && scale > 1 && isDragging) {
        e.preventDefault()
        currentX = e.touches[0].clientX - startX
        currentY = e.touches[0].clientY - startY
        img.style.transform = `scale(${scale}) translate(${currentX / scale}px, ${currentY / scale}px)`
      } else if (e.touches.length === 2) {
        e.preventDefault()
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
        scale = Math.max(1, Math.min(4, startScale * (dist / initDistance)))
        if (scale <= 1) {
          resetZoom()
        } else {
          img.style.transform = `scale(${scale}) translate(${currentX / scale}px, ${currentY / scale}px)`
          img.style.cursor = 'grab'
        }
      }
    }, { passive: false })

    img.addEventListener('touchend', e => {
      if (isDragging) {
        isDragging = false
      } else if (scale === 1 && e.changedTouches.length === 1) {
        const dx = e.changedTouches[0].clientX - startX
        if (Math.abs(dx) > 50) window.lbNav(dx < 0 ? 1 : -1)
      }
    }, { passive: true })

    img.addEventListener('wheel', e => {
      e.preventDefault()
      const delta = e.deltaY * -0.005
      scale = Math.max(1, Math.min(4, scale + delta))
      if (scale <= 1) {
        resetZoom()
      } else {
        img.style.transform = `scale(${scale}) translate(${currentX / scale}px, ${currentY / scale}px)`
        img.style.cursor = 'grab'
      }
    }, { passive: false })

    let isMouseDown = false
    let mouseStartX = 0, mouseStartY = 0

    img.addEventListener('mousedown', e => {
      if (scale > 1) {
        isMouseDown = true
        mouseStartX = e.clientX - currentX
        mouseStartY = e.clientY - currentY
        img.style.cursor = 'grabbing'
      }
    })

    window.addEventListener('mousemove', e => {
      if (isMouseDown && scale > 1) {
        currentX = e.clientX - mouseStartX
        currentY = e.clientY - mouseStartY
        img.style.transform = `scale(${scale}) translate(${currentX / scale}px, ${currentY / scale}px)`
      }
    })

    window.addEventListener('mouseup', () => {
      if (isMouseDown) {
        isMouseDown = false
        if (img) img.style.cursor = 'grab'
      }
    })
  }

  lb.addEventListener('click', e => { if (e.target === lb) history.back() })

  const onKey = (e) => {
    if (e.key === 'ArrowRight') window.lbNav(1)
    else if (e.key === 'ArrowLeft') window.lbNav(-1)
    else if (e.key === 'Escape') { history.back() }
  }
  document.addEventListener('keydown', onKey)
  lb.addEventListener('remove', () => document.removeEventListener('keydown', onKey))

  render()
  document.body.appendChild(lb)
  addGestures()

  if (window._zmPushBack) {
    window._zmPushBack(() => {
      const el = document.getElementById('pc-lightbox')
      if (el) el.remove()
      document.removeEventListener('keydown', onKey)
    })
  }
}

// ---------- back-stack navigation ----------
window._zmNavStack = []
window._zmPushBack = (restoreFn) => {
  history.pushState({ zmNav: window._zmNavStack.length + 1 }, '')
  window._zmNavStack.push(restoreFn)
}
;(() => {
  window.addEventListener('popstate', () => {
    if (window._zmNavStack.length > 0) {
      const restoreFn = window._zmNavStack.pop()
      try { restoreFn() } catch (e) {}
    }
  })
})()

init()
