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
  tab: 'tienda',
  filtroCat: '',
  busqueda: '',
}

const num = (v) => parseFloat(v) || 0
const money = (n) => '$' + Math.round(n).toLocaleString('es-MX')
const esc = (s) => String(s ?? '').replace(/"/g, '&quot;').replace(/</g, '&lt;')

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
    const [productos, variantes, inventario] = await Promise.all([
      fetch(API + '/productos/').then(r => r.json()),
      fetch(API + '/variantes/').then(r => r.json()),
      fetch(API + '/inventario/').then(r => r.json()).catch(() => []),
    ])
    // Stock total por variante (sumado entre sucursales)
    const stockPorVar = {}
    ;(Array.isArray(inventario) ? inventario : []).forEach(i => {
      stockPorVar[i.variante_id] = (stockPorVar[i.variante_id] || 0) + (i.cantidad || 0)
    })
    state.data = {
      productos: (Array.isArray(productos) ? productos : []).filter(p => p.activo).map(p => normalizarProducto(p)),
      variantes: Array.isArray(variantes) ? variantes : [],
      stockPorVar,
    }
    renderShell()
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
function navTo(tab) {
  state.tab = tab
  // refrescar nav (badge/active)
  const oldNav = document.querySelector('.bottomnav')
  if (oldNav) oldNav.outerHTML = renderBottomNav()
  const sub = document.getElementById('tb-sub')
  if (sub) sub.textContent = state.sesion?.nombre ? `Hola, ${state.sesion.nombre.split(' ')[0]}` : ''
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
    <input class="search" id="cat-search" placeholder="🔍 Buscar modelo o SKU…" value="${esc(state.busqueda)}">
    <div class="chips">
      <button class="${!state.filtroCat ? 'active' : ''}" onclick="window.__filtro('')">Todos</button>
      ${cats.map(c => `<button class="${state.filtroCat === c ? 'active' : ''}" onclick="window.__filtro('${c}')">${c[0].toUpperCase() + c.slice(1)}</button>`).join('')}
    </div>
    <div class="grid" id="cat-grid"></div>`
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
  grid.innerHTML = lista.slice(0, 120).map(p => `
    <div class="card" onclick="window.__abrir('${p.id}')">
      ${p.imagen_principal ? `<img class="thumb" src="${p.imagen_principal}" loading="lazy">` : `<div class="thumb"></div>`}
      <div class="body">
        <div class="name">${esc(p.nombre)}</div>
        <div class="sku">${esc(p.sku_interno || '')}</div>
        <div class="price">${money(p.precio_menudeo)} <small>x par</small></div>
        <div class="tier-row">
          <span class="tier">3+ ${money(p.precio_mayoreo3)}</span>
          <span class="tier">6+ ${money(p.precio_mayoreo6)}</span>
          <span class="tier corr">Corr ${money(p.precio_corrida)}</span>
        </div>
      </div>
    </div>`).join('')
}

// ============================================================
//  MODAL DE PRODUCTO (elegir color + tallas)
// ============================================================
let _modalSel = { productoId: null, color: null, modo: 'variado' }
let _corridaQty = {}
window.__abrir = abrirProducto
function abrirProducto(productoId) {
  const p = state.data.productos.find(x => x.id === productoId)
  if (!p) return
  const vars = state.data.variantes.filter(v => v.producto_id === productoId)
  const colores = [...new Set(vars.map(v => v.color).filter(Boolean))]
  _modalSel = { productoId, color: colores[0] || null, modo: 'variado' }
  _corridaQty = {}

  const ov = document.createElement('div')
  ov.className = 'modal-overlay'; ov.id = 'pmodal'
  ov.innerHTML = `
    <div class="modal">
      <div class="m-head">
        ${p.imagen_principal ? `<img id="pm-img" src="${p.imagen_principal}">` : ''}
        <div style="flex:1;min-width:0">
          <div style="font-weight:700;line-height:1.25">${esc(p.nombre)}</div>
          <div class="muted" style="font-size:.76rem">${esc(p.sku_interno || '')}</div>
          <div style="font-weight:800;color:var(--pink);margin-top:3px">${money(p.precio_menudeo)} <span class="muted" style="font-size:.7rem;font-weight:600">x par</span></div>
          <div class="tier-row" style="margin-top:5px">
            <span class="tier">3+ ${money(p.precio_mayoreo3)}</span>
            <span class="tier">6+ ${money(p.precio_mayoreo6)}</span>
            <span class="tier corr">Corrida ${money(p.precio_corrida)}</span>
          </div>
        </div>
        <button onclick="document.getElementById('pmodal').remove()" style="background:none;border:none;font-size:1.5rem;color:#aaa">✕</button>
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
        <button class="btn-primary" onclick="document.getElementById('pmodal').remove();window.__nav('carrito')">Listo · ver carrito</button>
      </div>
    </div>`
  document.body.appendChild(ov)
  ov.addEventListener('click', e => { if (e.target === ov) ov.remove() })
  if (_modalSel.color) pintarTallas()
}

window.__pickColor = (color) => {
  _modalSel.color = color
  _corridaQty = {}
  document.querySelectorAll('#pm-swatches .swatch').forEach(s => s.classList.toggle('active', s.dataset.color === color))
  const vc = state.data.variantes.filter(v => v.producto_id === _modalSel.productoId && v.color === color)
  const foto = vc.map(v => v.foto_url).find(Boolean)
  const img = document.getElementById('pm-img')
  if (img && foto) img.src = foto
  pintarTallas()
}

window.__modoModal = (m) => {
  _modalSel.modo = m
  _corridaQty = {}
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
    if (label) label.textContent = `Corrida — ${color} · ${money(p.precio_corrida)} x par`
    cont.className = 'corrida-rows'
    cont.innerHTML = vars.map(v => {
      const stock = state.data.stockPorVar[v.id] || 0
      const q = _corridaQty[v.id] || 0
      return `<div class="crow ${stock <= 0 ? 'off' : ''}">
        <span class="ct">${v.talla}</span>
        <span class="cs muted">${stock <= 0 ? 'Agotado' : 'Stock ' + stock}</span>
        <div class="cstep">
          <button ${stock <= 0 ? 'disabled' : ''} onclick="window.__corridaQty('${v.id}',-1)">−</button>
          <span id="cq-${v.id}">${q}</span>
          <button ${stock <= 0 ? 'disabled' : ''} onclick="window.__corridaQty('${v.id}',1)">+</button>
        </div>
      </div>`
    }).join('')
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
    const n = Object.values(_corridaQty).reduce((s, x) => s + x, 0)
    foot.innerHTML = `
      <button class="btn-mini ghost" style="width:100%;padding:11px;margin-bottom:8px" onclick="window.__sugerirCorrida()">✨ Sugerir corrida (6 pares)</button>
      <button class="btn-primary" ${n ? '' : 'disabled'} onclick="window.__agregarCorrida()">${n ? 'Agregar corrida (' + n + ' pares)' : 'Elige las tallas de la corrida'}</button>`
  } else {
    foot.innerHTML = `<button class="btn-primary" onclick="document.getElementById('pmodal').remove();window.__nav('carrito')">Listo · ver carrito</button>`
  }
}

window.__corridaQty = (varId, d) => {
  const stock = state.data.stockPorVar[varId] || 0
  const val = Math.min(stock, Math.max(0, (_corridaQty[varId] || 0) + d))
  _corridaQty[varId] = val
  const el = document.getElementById('cq-' + varId); if (el) el.textContent = val
  actualizarFooterModal()
}

window.__sugerirCorrida = () => {
  _corridaQty = {}
  const conStock = _varsColorOrden().filter(v => (state.data.stockPorVar[v.id] || 0) > 0)
  conStock.slice(0, 6).forEach(v => { _corridaQty[v.id] = 1 })
  pintarTallas()
}

window.__agregarCorrida = () => {
  const { productoId } = _modalSel
  const p = state.data.productos.find(x => x.id === productoId)
  let added = 0
  Object.entries(_corridaQty).forEach(([varId, cant]) => {
    if (cant <= 0) return
    const v = state.data.variantes.find(x => x.id === varId)
    const ex = state.carrito.find(i => i.variante_id === varId && i.es_corrida)
    if (ex) ex.cantidad += cant
    else state.carrito.push({
      variante_id: varId, producto_id: p.id, nombre: p.nombre, color: v.color, talla: v.talla,
      cantidad: cant, es_corrida: true,
      precio_menudeo: p.precio_menudeo, precio_mayoreo3: p.precio_mayoreo3, precio_mayoreo6: p.precio_mayoreo6, precio_corrida: p.precio_corrida,
      imagen: v.foto_url || p.imagen_principal || null,
    })
    added += cant
  })
  if (!added) { toast('Elige al menos una talla'); return }
  _corridaQty = {}
  guardarCarrito()
  const nav = document.querySelector('.bottomnav'); if (nav) nav.outerHTML = renderBottomNav()
  const m = document.getElementById('pmodal'); if (m) m.remove()
  navTo('carrito')
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
function guardarCarrito() { try { localStorage.setItem(CARRITO_KEY, JSON.stringify(state.carrito)) } catch {} }

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
  page().innerHTML = `
    <p class="section-title">${totalPares()} pares · ${tierLabel()}</p>
    ${state.carrito.map((i, idx) => `
      <div class="row">
        <div class="r-top">
          ${i.imagen ? `<img src="${i.imagen}">` : `<div style="width:52px;height:52px;border-radius:9px;background:#f1f1f5;display:flex;align-items:center;justify-content:center">👠</div>`}
          <div style="flex:1;min-width:0">
            <div style="font-weight:600;font-size:.9rem">${esc(i.nombre)}</div>
            <div class="muted" style="font-size:.78rem">${esc(i.color)} · T${esc(i.talla)}${i.es_corrida ? ' · corrida' : ''}</div>
            <div style="font-weight:700;color:var(--pink);margin-top:3px">${money(precioItem(i, sueltos))} <span class="muted" style="font-size:.7rem;font-weight:600">x par</span></div>
          </div>
          <button onclick="window.__delItem(${idx})" style="background:none;border:none;color:#ccc;font-size:1.2rem">✕</button>
        </div>
        <div class="qty" style="margin-top:10px">
          <button onclick="window.__qty(${idx},-1)">−</button>
          <span style="font-weight:700;min-width:26px;text-align:center">${i.cantidad}</span>
          <button onclick="window.__qty(${idx},1)">+</button>
          <span style="margin-left:auto;font-weight:700">${money(i.cantidad * precioItem(i, sueltos))}</span>
        </div>
      </div>`).join('')}
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
        ${p.tracking_url ? `<a href="${esc(p.tracking_url)}" target="_blank" style="color:var(--pink);font-size:.8rem;font-weight:600;text-decoration:none">Rastrear envío →</a>` : ''}
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
  if (!cats.length) {
    page().innerHTML = `<div class="empty"><div class="ic">📖</div><p>No hay catálogos por ahora</p></div>`
    return
  }
  page().innerHTML = `
    <p class="section-title">Catálogos para descargar</p>
    <div class="cat-list">
      ${cats.map(c => `
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
        </div>`).join('')}
    </div>`
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

init()
