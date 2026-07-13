// ─────────────────────────────────────────────────────────────
//  Portal de cliente mayoreo — integrado en el panel
//  Se carga cuando el login detecta un cliente (tipo = zapateria)
// ─────────────────────────────────────────────────────────────

const PC_API        = '/api'
const PC_SESION_KEY = 'pc_sesion'
const PC_CARRITO_KEY = 'pc_carrito'
// Marca el pedido-borrador que respalda el carrito activo en el servidor, para
// distinguirlo de un pedido real sin importar su status (incluso ya cancelado).
const PC_BORRADOR_MARCA = '[carrito-respaldo]'
const TALLAS_ORDEN  = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Unica']

const money = (n) => '$' + Math.round(parseFloat(n) || 0).toLocaleString('es-MX')
const esc   = (s) => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')
// Calcula precio mayoreo con fallback a precio_menudeo - descuento
const precioM3 = (p) => parseFloat(p.precio_mayoreo3) || Math.max(0, parseFloat(p.precio_menudeo || 0) - 30)
const precioM6 = (p) => parseFloat(p.precio_mayoreo6) || Math.max(0, parseFloat(p.precio_menudeo || 0) - 70)
const precioCorrida = (p) => parseFloat(p.precio_corrida) || Math.max(0, parseFloat(p.precio_menudeo || 0) - 100)

// ── Estado global ────────────────────────────────────────────
const pc = {
  sesion:   null,
  tab:      'inicio',
  productos: [],
  variantes: [],
  inventario: [],
  carrito:  [],
  pedidos:  [],
  referido: null,
  clienteData: null,
  filtroCat: '',
  busqueda: '',
  filtroTallas: [],
  filtroColores: [],
  filtrosExpandido: false,
  datosCargados: false,
  borradores: [],
  _borradorServerId: null, // id del pedido status=borrador que respalda el carrito activo en el servidor
}

function pcAuthHeaders() {
  const token = localStorage.getItem('erp_token')
  return token
    ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    : { 'Content-Type': 'application/json' }
}

// ── Entry point ──────────────────────────────────────────────
export function renderPortalCliente(sesionData) {
  pc.sesion = sesionData
  try { pc.carrito = JSON.parse(localStorage.getItem(PC_CARRITO_KEY) || '[]') } catch { pc.carrito = [] }
  try { pc.borradores = JSON.parse(localStorage.getItem('pc_borradores') || '[]') } catch { pc.borradores = [] }
  try {
    renderPC()
  } catch(err) {
    const app = document.querySelector('#app')
    const errDiv = document.createElement('div')
    errDiv.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#dc2626;color:white;padding:16px;z-index:9999;font-family:monospace;font-size:13px'
    errDiv.textContent = 'renderPC ERROR: ' + (err?.message || String(err))
    document.body.appendChild(errDiv)
    return
  }
  cargarDatosPC()
  _pcInitPush()
}

// ── Notificaciones push (avisos de pedido/promos, como WhatsApp) ──────
function _pcUrlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const output = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; ++i) output[i] = raw.charCodeAt(i)
  return output
}

async function _pcSuscribirPush() {
  try {
    const reg = await navigator.serviceWorker.register('/sw-push.js')
    const permiso = await Notification.requestPermission()
    if (permiso !== 'granted') return
    const res = await fetch(`${PC_API}/push/public-key`)
    const { publicKey, configurado } = await res.json()
    if (!configurado) return
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: _pcUrlBase64ToUint8Array(publicKey),
    })
    await fetch(`${PC_API}/push/suscribir`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: sub.toJSON(), sitio: 'portal',
        cliente_id: pc.sesion?.cliente_id || null, user_agent: navigator.userAgent,
      }),
    })
  } catch (e) { /* silencioso */ }
}

function _pcInitPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
  if (Notification.permission === 'granted') { _pcSuscribirPush(); return }
  if (Notification.permission === 'denied') return
  try { if (localStorage.getItem('pc_push_dismissed')) return } catch (e) {}
  if (document.getElementById('pc-push-banner')) return
  setTimeout(() => {
    const el = document.createElement('div')
    el.id = 'pc-push-banner'
    el.style.cssText = 'position:fixed;bottom:16px;left:16px;right:16px;max-width:380px;margin:0 auto;background:#161625;border:1px solid #2a2a40;color:#e2e2f0;border-radius:14px;padding:14px 16px;box-shadow:0 8px 24px rgba(0,0,0,0.4);z-index:9999;display:flex;align-items:center;gap:12px'
    el.innerHTML = `
      <span style="font-size:1.6rem;flex-shrink:0">🔔</span>
      <div style="flex:1;min-width:0">
        <p style="margin:0 0 2px;font-size:0.85rem;font-weight:700">Activa avisos</p>
        <p style="margin:0;font-size:0.78rem;color:#8a8aa8">Te avisamos de tu pedido y promociones.</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0">
        <button id="pc-push-si" style="background:#E91E8C;color:#fff;border:none;border-radius:8px;padding:6px 12px;font-size:0.78rem;font-weight:700;cursor:pointer">Activar</button>
        <button id="pc-push-no" style="background:transparent;color:#8a8aa8;border:none;font-size:0.72rem;cursor:pointer;padding:2px">No, gracias</button>
      </div>`
    document.body.appendChild(el)
    document.getElementById('pc-push-si').onclick = () => { el.remove(); _pcSuscribirPush() }
    document.getElementById('pc-push-no').onclick = () => { el.remove(); try { localStorage.setItem('pc_push_dismissed', '1') } catch (e) {} }
  }, 6000)
}

// ── Render principal ─────────────────────────────────────────
function renderPC() {
  const app = document.querySelector('#app')
  app.innerHTML = `
  <div id="pc-root" style="display:flex;min-height:100vh;width:100%;background:#0f0f1c;font-family:'DM Sans',sans-serif;color:#e2e2f0">

    <!-- Sidebar -->
    <aside id="pc-sidebar" style="width:220px;flex-shrink:0;background:#0c0c17;border-right:1px solid #1e1e30;display:flex;flex-direction:column;padding:0;transition:width 0.2s">
      <!-- Logo -->
      <div style="padding:24px 20px 20px;border-bottom:1px solid #1e1e30">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
          <span style="width:8px;height:8px;border-radius:50%;background:#E91E8C;flex-shrink:0"></span>
          <span style="font-size:0.65rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#E91E8C">Zapatillas May</span>
        </div>
        <p style="font-size:0.75rem;font-weight:600;color:#a0a0c0;margin:0">Portal Mayoreo <span style="font-size:0.6rem;color:#3a3a5c">v5</span></p>
        <p style="font-size:0.72rem;color:#5a5a7a;margin:2px 0 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(pc.sesion?.nombre || '')}</p>
      </div>

      <!-- Nav -->
      <nav style="flex:1;padding:12px 10px;display:flex;flex-direction:column;gap:2px" id="pc-nav">
        ${pcNavItem('inicio',   '🏠', 'Mi resumen')}
        ${pcNavItem('catalogo', '👟', 'Productos')}
        ${pcNavItem('catalogos','📥', 'Catálogos')}
        ${pcNavItem('carrito',  '🛒', 'Carrito')}
        ${pcNavItem('pedidos',  '📦', 'Mis pedidos')}
        ${pcNavItem('sugerencias','💡', 'Sugerencias')}
        ${pcNavItem('cuenta',   '👤', 'Mi cuenta')}
      </nav>

      <!-- Cerrar sesión -->
      <div style="padding:12px 10px;border-top:1px solid #1e1e30">
        <button onclick="pcCerrarSesion()" style="width:100%;padding:8px 12px;background:transparent;border:1px solid #2a2a40;border-radius:8px;color:#5a5a7a;font-family:inherit;font-size:0.78rem;cursor:pointer;text-align:left;transition:all 0.15s"
          onmouseover="this.style.borderColor='#E91E8C';this.style.color='#E91E8C'" onmouseout="this.style.borderColor='#2a2a40';this.style.color='#5a5a7a'">
          ← Cerrar sesión
        </button>
      </div>
    </aside>

    <!-- Contenido principal -->
    <main id="pc-main" style="flex:1;overflow-y:auto;min-width:0">
      <!-- Topbar móvil -->
      <div id="pc-topbar" style="display:none;align-items:center;justify-content:space-between;padding:14px 16px;background:#0c0c17;border-bottom:1px solid #1e1e30;position:sticky;top:0;z-index:50">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="width:7px;height:7px;border-radius:50%;background:#E91E8C"></span>
          <span style="font-size:0.7rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#E91E8C">Portal Mayoreo</span>
        </div>
        <button onclick="pcToggleSidebar()" style="background:none;border:none;color:#a0a0c0;cursor:pointer;padding:4px">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>

      <!-- Área de contenido -->
      <div id="pc-content" style="padding:28px 32px;max-width:1200px">
        <div style="text-align:center;padding:60px;color:#3a3a5c">
          <div style="width:32px;height:32px;border:3px solid #E91E8C;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 16px"></div>
          Cargando...
        </div>
      </div>
    </main>
  </div>

  <style>
    @keyframes spin { to { transform: rotate(360deg) } }
    @media (max-width: 768px) {
      #pc-sidebar { position:fixed;left:0;top:0;bottom:0;z-index:200;transform:translateX(-100%);transition:transform 0.25s; }
      #pc-sidebar.open { transform:translateX(0); }
      #pc-topbar { display:flex!important; }
      #pc-content { padding:20px 16px!important; }
      .pc-prod-grid { grid-template-columns:repeat(2,1fr)!important; gap:10px!important; }
    }
    .pc-prod-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:14px; }
    .pc-nav-item { display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;cursor:pointer;
      font-size:0.83rem;font-weight:500;color:#6a6a8a;border:none;background:none;
      font-family:inherit;width:100%;text-align:left;transition:all 0.15s; }
    .pc-nav-item:hover { background:#161625;color:#c0c0e0; }
    .pc-nav-item.activo { background:rgba(233,30,140,0.12);color:#E91E8C; }
    .pc-kpi { background:#161625;border:1px solid #1e1e30;border-radius:12px;padding:20px;min-width:0; }
    .pc-kpi-val { font-size:1.6rem;font-weight:800;color:#e2e2f0;margin:4px 0 2px;letter-spacing:-0.02em; }
    .pc-kpi-lbl { font-size:0.7rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#5a5a7a; }
    .pc-kpi-sub { font-size:0.75rem;color:#5a5a7a; }
    .pc-card { background:#161625;border:1px solid #1e1e30;border-radius:12px;padding:20px; }
    .pc-prod-card { background:#161625;border:1px solid #1e1e30;border-radius:10px;overflow:hidden;cursor:pointer;transition:border-color 0.15s; }
    .pc-prod-card:hover { border-color:#E91E8C; }
    .pc-badge { display:inline-block;padding:3px 8px;border-radius:100px;font-size:0.65rem;font-weight:700; }
    .pc-btn { padding:10px 20px;border:none;border-radius:8px;font-family:inherit;font-size:0.83rem;font-weight:600;cursor:pointer;transition:all 0.15s; }
    .pc-btn-primary { background:#E91E8C;color:white; }
    .pc-btn-primary:hover { background:#d01a7e; }
    .pc-btn-secondary { background:#1e1e30;color:#a0a0c0;border:1px solid #2a2a40; }
    .pc-btn-secondary:hover { border-color:#E91E8C;color:#E91E8C; }
    .pc-input { width:100%;padding:10px 14px;background:#0f0f1c;border:1.5px solid #1e1e30;border-radius:8px;
      color:#e2e2f0;font-family:inherit;font-size:0.85rem;outline:none;box-sizing:border-box;transition:border-color 0.15s; }
    .pc-input:focus { border-color:#E91E8C; }
    .pc-status-chip { display:inline-block;padding:3px 10px;border-radius:100px;font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em; }
  </style>`

  // Registrar globales
  window.pcIrA = pcIrA
  window.pcCerrarSesion = pcCerrarSesion
  window.pcToggleSidebar = pcToggleSidebar
  window.pcQuitarDelCarrito = pcQuitarDelCarrito
  window.pcGuardarBorrador = pcGuardarBorrador
  window.pcCargarBorrador = pcCargarBorrador
  window.pcBorrarBorrador = pcBorrarBorrador
  window.pcHacerPedido = pcHacerPedido
  window.pcFiltrarCat = (c) => { pc.filtroCat = c; renderCatalogo() }
  window.pcToggleFiltroTalla = (t) => {
    const i = pc.filtroTallas.indexOf(t)
    if (i === -1) pc.filtroTallas.push(t); else pc.filtroTallas.splice(i, 1)
    renderCatalogo()
  }
  window.pcToggleFiltroColor = (c) => {
    const i = pc.filtroColores.indexOf(c)
    if (i === -1) pc.filtroColores.push(c); else pc.filtroColores.splice(i, 1)
    renderCatalogo()
  }
  window.pcLimpiarFiltrosTC = () => { pc.filtroTallas = []; pc.filtroColores = []; renderCatalogo() }
  window.pcToggleFiltrosPanel = () => { pc.filtrosExpandido = !pc.filtrosExpandido; renderCatalogo() }
  window.pcBuscar = (q) => { pc.busqueda = q; renderCatalogo() }
  window.pcVaciarCarrito = () => { pc.carrito = []; pcGuardarCarrito(); renderCarrito() }

  // Reemplazar spinner de inmediato
  const _initContent = document.getElementById('pc-content')
  if (_initContent) {
    try { renderInicio(_initContent) } catch(e) {
      console.error('[pc] renderInicio init error', e)
      _initContent.innerHTML = `<div style="padding:40px;text-align:center;color:#ef4444">Error al inicializar: ${e.message}</div>`
    }
  }
}

function pcNavItem(tab, icon, label) {
  return `<button class="pc-nav-item${pc.tab === tab ? ' activo' : ''}" onclick="pcIrA('${tab}')">${icon} ${label}</button>`
}

function pcIrA(tab, _fromBack) {
  if (!_fromBack && pc.tab && pc.tab !== tab && window._zmPushBack) {
    const prevTab = pc.tab
    window._zmPushBack(() => pcIrA(prevTab, true))
  }
  pc.tab = tab
  // Actualizar nav items
  document.querySelectorAll('.pc-nav-item').forEach(el => {
    const t = el.getAttribute('onclick')?.match(/'(\w+)'/)?.[1]
    el.classList.toggle('activo', t === tab)
  })
  const content = document.getElementById('pc-content')
  if (!content) return
  try {
    switch (tab) {
      case 'inicio':   renderInicio(content); break
      case 'catalogo': renderCatalogo(content); break
      case 'catalogos': renderCatalogosDescarga(content); break
      case 'carrito':  renderCarrito(content); break
      case 'pedidos':  renderMisPedidos(content); break
      case 'sugerencias': renderSugerencias(content); break
      case 'cuenta':   renderMiCuenta(content); break
    }
  } catch(e) {
    console.error('[portal] renderTab error', tab, e)
    content.innerHTML = `<div style="padding:40px;color:#ef4444;text-align:center">Error al cargar sección. <button onclick="pcIrA('${tab}')" style="color:#E91E8C;background:none;border:none;cursor:pointer;text-decoration:underline">Reintentar</button></div>`
  }
  // Cerrar sidebar en móvil
  document.getElementById('pc-sidebar')?.classList.remove('open')
}

function pcToggleSidebar(_fromBack) {
  const sidebar = document.getElementById('pc-sidebar')
  const isOpen = sidebar?.classList.toggle('open')
  if (isOpen && !_fromBack && window._zmPushBack) {
    window._zmPushBack(() => pcToggleSidebar(true))
  }
}

// ── Carga inicial de datos ───────────────────────────────────
async function cargarDatosPC() {
  // Auto-reparar sesiones viejas guardadas antes de vincular usuario↔cliente:
  // si no tenemos cliente_id pero sí el id del usuario, refrescarlo desde el backend.
  if (!pc.sesion?.cliente_id && pc.sesion?.id) {
    try {
      const res = await fetch(`${PC_API}/auth/perfil/${pc.sesion.id}`)
      if (res.ok) {
        const perfil = await res.json()
        if (perfil.cliente_id) {
          pc.sesion.cliente_id = perfil.cliente_id
          try { localStorage.setItem('pc_sesion', JSON.stringify(pc.sesion)) } catch {}
        }
      }
    } catch (e) {}
  }
  const cid = pc.sesion?.cliente_id
  // Cada fetch se resuelve de forma independiente: si una falla, no debe
  // tumbar a las demás (antes un error en cualquiera dejaba todo sin cargar,
  // incluida la sección de referidos, con el spinner pegado para siempre).
  const _safeFetch = async (url) => {
    try {
      const res = await fetch(url)
      if (!res.ok) return null
      return await res.json()
    } catch (e) {
      console.error('[portal] fetch error', url, e)
      return null
    }
  }

  const [prod, vari, inv, ped, cli] = await Promise.all([
    _safeFetch(`${PC_API}/productos/`),
    _safeFetch(`${PC_API}/variantes/?activa=eq.true`),
    _safeFetch(`${PC_API}/inventario/`),
    cid ? _safeFetch(`${PC_API}/auth/pedidos/${cid}`) : Promise.resolve(null),
    cid ? _safeFetch(`${PC_API}/clientes/${cid}`) : Promise.resolve(null),
  ])

  if (Array.isArray(prod)) pc.productos = prod.filter(p => p.activo !== false)
  if (Array.isArray(vari)) pc.variantes = vari
  if (Array.isArray(inv)) pc.inventario = inv
  if (cli) pc.clienteData = Array.isArray(cli) ? cli[0] : cli
  if (Array.isArray(ped)) {
    // El borrador que respalda el carrito activo no debe verse como "pedido" --
    // se usa aparte para restaurar el carrito, nunca en Mis pedidos / Inicio.
    try { await pcRestaurarCarritoDeServidor(ped) } catch {}
    pc.pedidos = ped.filter(p => p.notas !== PC_BORRADOR_MARCA)
  }

  pc.datosCargados = true
  // Re-renderizar la pestaña activa con datos
  pcIrA(pc.tab)
}

// ── INICIO ───────────────────────────────────────────────────
function renderInicio(el) {
  el = el || document.getElementById('pc-content')
  if (!el) return
  const pedidos = pc.pedidos || []
  const totalGastado = pedidos.reduce((s, p) => s + parseFloat(p.total || 0), 0)
  const pedidosActivos = pedidos.filter(p => !['entregado','cancelado'].includes(p.status)).length
  const credito = parseFloat(pc.clienteData?.credito_disponible || 0)
  const ultimosPedidos = [...pedidos].sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).slice(0,3)

  // Historial: gasto de los últimos 6 meses (pedidos no cancelados) y top 5 modelos.
  const pedidosValidos = pedidos.filter(p => p.status !== 'cancelado')
  const mesesLbl = []
  const mesesTotales = []
  const hoy = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1)
    mesesLbl.push(d.toLocaleDateString('es-MX', { month: 'short' }))
    const suma = pedidosValidos
      .filter(p => { const pd = new Date(p.created_at); return pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth() })
      .reduce((s, p) => s + parseFloat(p.total || 0), 0)
    mesesTotales.push(suma)
  }
  const conteoModelos = {}
  pedidosValidos.forEach(p => (p.pedido_items || []).forEach(i => {
    const nombre = i.variantes?.productos?.nombre || 'Producto'
    conteoModelos[nombre] = (conteoModelos[nombre] || 0) + (i.cantidad || 0)
  }))
  const topModelos = Object.entries(conteoModelos).sort((a,b) => b[1]-a[1]).slice(0,5)
  const hayHistorial = pedidosValidos.length > 0

  el.innerHTML = `
    <div style="margin-bottom:28px">
      <h1 style="font-size:1.5rem;font-weight:800;color:#e2e2f0;margin:0 0 4px;letter-spacing:-0.01em">
        Hola, ${esc(pc.sesion?.nombre?.split(' ')[0] || 'bienvenida')} 👋
      </h1>
      <p style="font-size:0.85rem;color:#5a5a7a;margin:0">Resumen de tu cuenta mayoreo</p>
    </div>

    <!-- KPIs -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;margin-bottom:28px">
      <div class="pc-kpi">
        <p class="pc-kpi-lbl">Total comprado</p>
        <p class="pc-kpi-val">${money(totalGastado)}</p>
        <p class="pc-kpi-sub">${pedidos.length} pedido${pedidos.length !== 1 ? 's' : ''}</p>
      </div>
      <div class="pc-kpi">
        <p class="pc-kpi-lbl">En proceso</p>
        <p class="pc-kpi-val">${pedidosActivos}</p>
        <p class="pc-kpi-sub">pedido${pedidosActivos !== 1 ? 's' : ''} activo${pedidosActivos !== 1 ? 's' : ''}</p>
      </div>
      <div class="pc-kpi" style="${credito > 0 ? 'border-color:rgba(233,30,140,0.3)' : ''}">
        <p class="pc-kpi-lbl">Crédito disponible</p>
        <p class="pc-kpi-val" style="${credito > 0 ? 'color:#E91E8C' : ''}">${money(credito)}</p>
        <p class="pc-kpi-sub">${credito > 0 ? 'se aplica en tu próximo pedido' : 'sin crédito pendiente'}</p>
      </div>
      <div class="pc-kpi" style="cursor:pointer" onclick="pcIrA('catalogo')">
        <p class="pc-kpi-lbl">Catálogo</p>
        <p class="pc-kpi-val">${pc.productos.length}</p>
        <p class="pc-kpi-sub" style="color:#E91E8C">Ver productos →</p>
      </div>
    </div>

    <!-- Accesos rápidos -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-bottom:28px">
      ${[
        { icon:'👟', label:'Ver catálogo', tab:'catalogo' },
        { icon:'🛒', label:'Carrito', tab:'carrito' },
        { icon:'📦', label:'Mis pedidos',  tab:'pedidos' },
        { icon:'💡', label:'Sugerencias',  tab:'sugerencias' },
      ].map(a => `
        <button onclick="pcIrA('${a.tab}')" class="pc-btn pc-btn-secondary" style="padding:14px;display:flex;flex-direction:column;align-items:center;gap:6px;border-radius:10px;font-size:0.82rem">
          <span style="font-size:1.5rem">${a.icon}</span>${a.label}
        </button>`).join('')}
    </div>

    <!-- Historial de compras -->
    ${hayHistorial ? `
    <div class="pc-card" style="margin-bottom:20px">
      <p style="font-weight:700;color:#e2e2f0;margin:0 0 16px">Tu historial de compras</p>
      <div style="display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:20px;align-items:start">
        <div>
          <p style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#5a5a7a;margin:0 0 10px">Gasto por mes</p>
          <div style="position:relative;height:160px"><canvas id="pc-chart-gasto"></canvas></div>
        </div>
        <div>
          <p style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#5a5a7a;margin:0 0 10px">Modelos más comprados</p>
          ${topModelos.length ? topModelos.map(([nombre, cant], i) => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;${i<topModelos.length-1?'border-bottom:1px solid #1e1e30':''}">
              <span style="font-size:0.8rem;color:#c0c0e0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:8px">${esc(nombre)}</span>
              <span style="font-size:0.8rem;font-weight:700;color:#E91E8C;flex-shrink:0">${cant} par${cant!==1?'es':''}</span>
            </div>`).join('') : `<p style="font-size:0.8rem;color:#5a5a7a">Sin datos aún</p>`}
        </div>
      </div>
    </div>` : ''}

    <!-- Últimos pedidos -->
    ${ultimosPedidos.length ? `
    <div class="pc-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <p style="font-weight:700;color:#e2e2f0;margin:0">Últimos pedidos</p>
        <button onclick="pcIrA('pedidos')" style="background:none;border:none;color:#E91E8C;font-size:0.78rem;cursor:pointer;font-family:inherit">Ver todos →</button>
      </div>
      ${ultimosPedidos.map(p => pcPedidoFila(p)).join('')}
    </div>` : `
    <div class="pc-card" style="text-align:center;padding:40px">
      <p style="font-size:2rem;margin:0 0 12px">🛍️</p>
      <p style="color:#a0a0c0;font-weight:600;margin:0 0 8px">Aún no tienes pedidos</p>
      <p style="color:#5a5a7a;font-size:0.83rem;margin:0 0 20px">Explora el catálogo y haz tu primer pedido mayoreo</p>
      <button onclick="pcIrA('catalogo')" class="pc-btn pc-btn-primary">Ver catálogo</button>
    </div>`}
  `

  if (hayHistorial) _pcRenderChartGasto(mesesLbl, mesesTotales)
}

function _pcRenderChartGasto(labels, totales) {
  const canvas = document.getElementById('pc-chart-gasto')
  if (!canvas || !window.Chart) return
  if (canvas._chartInstance) { try { canvas._chartInstance.destroy() } catch {} }
  canvas._chartInstance = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: totales,
        backgroundColor: 'rgba(233,30,140,0.55)',
        borderRadius: 4,
        maxBarThickness: 28,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => money(ctx.parsed.y) } } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#5a5a7a', font: { size: 11 } } },
        y: { grid: { color: '#1e1e30' }, ticks: { color: '#5a5a7a', font: { size: 10 }, callback: (v) => money(v) } },
      },
    },
  })
}

function pcPedidoFila(p) {
  const statusColors = {
    pendiente_pago:'#f59e0b', pagado:'#10b981', preparando:'#3b82f6',
    enviado:'#8b5cf6', entregado:'#10b981', cancelado:'#ef4444'
  }
  const color = statusColors[p.status] || '#6b7280'
  return `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid #1e1e30;gap:12px" onclick="pcIrA('pedidos')" style="cursor:pointer">
      <div style="min-width:0">
        <p style="font-size:0.78rem;font-family:monospace;color:#6a6a8a;margin:0 0 2px">#${(p.id||'').substring(0,8).toUpperCase()}</p>
        <p style="font-size:0.83rem;color:#a0a0c0;margin:0">${new Date(p.created_at).toLocaleDateString('es-MX')}</p>
      </div>
      <span class="pc-status-chip" style="background:${color}20;color:${color};white-space:nowrap">${p.status}</span>
      <p style="font-weight:700;color:#e2e2f0;margin:0;white-space:nowrap">${money(p.total)}</p>
    </div>`
}

// ── CATÁLOGO ─────────────────────────────────────────────────
function renderCatalogo(el) {
  el = el || document.getElementById('pc-content')
  if (!el) return
  const cats = [...new Set(pc.productos.map(p => p.categoria).filter(Boolean))]

  // Tallas y colores disponibles (derivados de las variantes activas)
  const varsActivas = pc.variantes.filter(v => v.activa !== false)
  const tallasDisponibles = TALLAS_ORDEN.filter(t => varsActivas.some(v => v.talla === t))
  const coloresMapa = {}
  varsActivas.forEach(v => {
    if (!v.color) return
    if (!coloresMapa[v.color]) coloresMapa[v.color] = v.color_hex || null
  })
  const coloresDisponibles = Object.entries(coloresMapa).sort((a, b) => a[0].localeCompare(b[0]))

  let prods = pc.productos
  if (pc.filtroCat) prods = prods.filter(p => p.categoria === pc.filtroCat)
  if (pc.busqueda) {
    const q = pc.busqueda.toLowerCase()
    prods = prods.filter(p => p.nombre?.toLowerCase().includes(q) || p.sku_interno?.toLowerCase().includes(q))
  }
  if (pc.filtroTallas.length) {
    prods = prods.filter(p => varsActivas.some(v => v.producto_id === p.id && pc.filtroTallas.includes(v.talla)))
  }
  if (pc.filtroColores.length) {
    prods = prods.filter(p => varsActivas.some(v => v.producto_id === p.id && pc.filtroColores.includes(v.color)))
  }

  const hayFiltrosActivos = pc.filtroTallas.length > 0 || pc.filtroColores.length > 0

  el.innerHTML = `
    <div style="margin-bottom:24px">
      <h1 style="font-size:1.4rem;font-weight:800;color:#e2e2f0;margin:0 0 4px">Productos</h1>
      <p style="font-size:0.83rem;color:#5a5a7a;margin:0">Precios para 3-5 pares y 6+ pares · ${prods.length} de ${pc.productos.length} modelos</p>
    </div>

    <!-- Buscador + categorías -->
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px">
      <input class="pc-input" style="max-width:260px" placeholder="🔍 Buscar modelo o SKU..."
        value="${esc(pc.busqueda)}" oninput="pcBuscar(this.value)">
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button onclick="pcFiltrarCat('')" class="pc-btn ${!pc.filtroCat ? 'pc-btn-primary' : 'pc-btn-secondary'}" style="padding:8px 14px;font-size:0.78rem">Todos</button>
        ${cats.map(c => `<button onclick="pcFiltrarCat('${esc(c)}')" class="pc-btn ${pc.filtroCat === c ? 'pc-btn-primary' : 'pc-btn-secondary'}" style="padding:8px 14px;font-size:0.78rem;text-transform:capitalize">${c}</button>`).join('')}
      </div>
    </div>

    <!-- Filtros: talla y color (colapsable) -->
    ${(tallasDisponibles.length || coloresDisponibles.length) ? `
    <div class="pc-card" style="margin-bottom:20px;padding:0;overflow:hidden">
      <button onclick="pcToggleFiltrosPanel()" style="width:100%;background:none;border:none;padding:14px 20px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;font-family:inherit">
        <span style="display:flex;align-items:center;gap:8px">
          <span style="font-size:0.85rem;font-weight:700;color:#e2e2f0">🎛️ Filtrar por talla o color</span>
          ${hayFiltrosActivos ? `<span style="background:#E91E8C;color:white;font-size:0.68rem;font-weight:700;border-radius:100px;padding:2px 8px">${pc.filtroTallas.length + pc.filtroColores.length}</span>` : ''}
        </span>
        <span style="color:#5a5a7a;font-size:0.75rem;display:flex;align-items:center;gap:10px">
          ${hayFiltrosActivos ? `<span onclick="event.stopPropagation();pcLimpiarFiltrosTC()" style="color:#E91E8C;font-weight:600;cursor:pointer">Limpiar</span>` : ''}
          <span style="transition:transform 0.2s;display:inline-block;transform:rotate(${pc.filtrosExpandido ? '180deg' : '0deg'})">▾</span>
        </span>
      </button>

      ${pc.filtrosExpandido ? `
      <div style="padding:4px 20px 18px;border-top:1px solid #1e1e30">
        ${tallasDisponibles.length ? `
        <div style="margin-top:14px;margin-bottom:${coloresDisponibles.length ? '14px' : '0'}">
          <p style="font-size:0.68rem;color:#5a5a7a;margin:0 0 8px">Talla</p>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            ${tallasDisponibles.map(t => {
              const sel = pc.filtroTallas.includes(t)
              return `<button onclick="pcToggleFiltroTalla('${esc(t)}')"
                style="min-width:40px;padding:6px 10px;border-radius:8px;border:1.5px solid ${sel ? '#E91E8C' : '#2a2a40'};background:${sel ? 'rgba(233,30,140,0.15)' : '#0f0f1c'};color:${sel ? '#E91E8C' : '#a0a0c0'};font-family:inherit;font-size:0.78rem;font-weight:700;cursor:pointer;transition:all 0.15s">${esc(t)}</button>`
            }).join('')}
          </div>
        </div>` : ''}

        ${coloresDisponibles.length ? `
        <div style="margin-top:${tallasDisponibles.length ? '0' : '14px'}">
          <p style="font-size:0.68rem;color:#5a5a7a;margin:0 0 8px">Color</p>
          <div style="display:flex;flex-wrap:wrap;gap:8px;max-height:160px;overflow-y:auto">
            ${coloresDisponibles.map(([color, hex]) => {
              const sel = pc.filtroColores.includes(color)
              return `<button onclick="pcToggleFiltroColor('${esc(color)}')" title="${esc(color)}"
                style="display:flex;align-items:center;gap:6px;padding:5px 10px 5px 6px;border-radius:100px;border:1.5px solid ${sel ? '#E91E8C' : '#2a2a40'};background:${sel ? 'rgba(233,30,140,0.1)' : '#0f0f1c'};cursor:pointer;font-family:inherit;transition:all 0.15s">
                <span style="width:16px;height:16px;border-radius:50%;background:${hex || '#888'};border:1px solid rgba(255,255,255,0.2);flex-shrink:0"></span>
                <span style="font-size:0.75rem;color:${sel ? '#E91E8C' : '#a0a0c0'};font-weight:${sel ? '700' : '500'};white-space:nowrap">${esc(color)}</span>
              </button>`
            }).join('')}
          </div>
        </div>` : ''}
      </div>` : ''}
    </div>` : ''}

    <!-- Grid productos -->
    ${prods.length === 0 ? `<div style="text-align:center;padding:60px;color:#5a5a7a">Sin resultados para "${esc(pc.busqueda)}"</div>` : `
    <div class="pc-prod-grid">
      ${prods.map(p => pcProductoCard(p)).join('')}
    </div>`}

    ${(() => {
      const totalPares = pc.carrito.reduce((s, i) => s + i.cantidad, 0)
      const totalMonto = pc.carrito.reduce((s, i) => s + i.precio_unitario * i.cantidad, 0)
      if (totalPares === 0) return ''
      return `
      <div onclick="pcIrA('carrito')"
        style="position:fixed;bottom:20px;right:20px;z-index:900;background:#161625;border:1.5px solid #E91E8C;border-radius:100px;padding:10px 18px 10px 12px;display:flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 6px 24px rgba(0,0,0,0.5);transition:transform 0.15s"
        onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'">
        <div style="position:relative;width:38px;height:38px;background:#E91E8C;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0">🛒
          <span style="position:absolute;top:-5px;right:-5px;background:white;color:#E91E8C;font-size:0.62rem;font-weight:800;min-width:18px;height:18px;border-radius:100px;display:flex;align-items:center;justify-content:center;padding:0 4px">${totalPares}</span>
        </div>
        <div style="line-height:1.2">
          <p style="margin:0;font-size:0.68rem;color:#8888aa;font-weight:600">${totalPares} par${totalPares !== 1 ? 'es' : ''} · Ver carrito</p>
          <p style="margin:0;font-size:0.95rem;font-weight:800;color:#E91E8C">${money(totalMonto)}</p>
        </div>
      </div>`
    })()}
  `
}

// ── CATÁLOGOS (descarga PDF por categoría) ────────────────────
const PC_CATEGORIAS_CATALOGO = [
  ['tacones',    '👠', 'Tacones'],
  ['sandalias',  '👡', 'Sandalias'],
  ['botas',      '🥾', 'Botas'],
  ['botines',    '👢', 'Botines'],
  ['flats',      '🥿', 'Flats'],
  ['plataformas','⬆️', 'Plataformas'],
  ['tenis',      '👟', 'Tenis'],
  ['nina',       '🎀', 'Niña'],
  ['accesorios', '👜', 'Accesorios'],
]

function renderCatalogosDescarga(el) {
  el = el || document.getElementById('pc-content')
  if (!el) return

  el.innerHTML = `
    <div style="margin-bottom:24px">
      <h1 style="font-size:1.4rem;font-weight:800;color:#e2e2f0;margin:0 0 4px">📥 Catálogos</h1>
      <p style="font-size:0.83rem;color:#5a5a7a;margin:0">Descarga un PDF con fotos de todos los modelos activos por categoría, listo para compartir con tus clientes.</p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px">
      ${PC_CATEGORIAS_CATALOGO.map(([id, icon, label]) => {
        const total = pc.productos.filter(p => p.categoria === id && p.activo !== false).length
        return `
        <div id="pc-cat-card-${id}" class="pc-card" style="text-align:center;padding:24px 16px;display:flex;flex-direction:column;align-items:center;gap:10px;transition:border-color 0.15s,transform 0.15s"
          onmouseover="this.style.borderColor='#E91E8C';this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='#1e1e30';this.style.transform='translateY(0)'">
          <div style="width:56px;height:56px;border-radius:50%;background:rgba(233,30,140,0.1);display:flex;align-items:center;justify-content:center;font-size:1.6rem">${icon}</div>
          <div>
            <p style="font-weight:700;color:#e2e2f0;margin:0 0 2px;font-size:0.92rem">${label}</p>
            <p style="font-size:0.72rem;color:#5a5a7a;margin:0">${total} modelo${total !== 1 ? 's' : ''}</p>
          </div>
          <button onclick="pcDescargarCatalogoPorCategoria('${id}','${icon} ${label}')" class="pc-btn pc-btn-primary" style="width:100%;padding:9px;font-size:0.8rem;margin-top:4px" ${total === 0 ? 'disabled style="opacity:0.4;cursor:not-allowed"' : ''}>
            Descargar PDF
          </button>
          <p class="pc-cat-msg" id="pc-cat-msg-${id}" style="font-size:0.7rem;color:#a0a0c0;margin:0;display:none;min-height:14px"></p>
        </div>`
      }).join('')}
    </div>
  `
}

function pcProductoCard(p) {
  const m3 = precioM3(p)
  const m6 = precioM6(p)
  const vars = pc.variantes.filter(v => v.producto_id === p.id)
  // Foto por color: primera foto_url encontrada por color
  const coloresMap = {}
  vars.forEach(v => {
    if (!coloresMap[v.color]) coloresMap[v.color] = { hex: v.color_hex, foto: v.foto_url }
    else if (!coloresMap[v.color].foto && v.foto_url) coloresMap[v.color].foto = v.foto_url
  })
  const coloresList = Object.entries(coloresMap) // [[color, {hex, foto}], ...]
  const imgPrincipal = p.imagen_principal || (coloresList[0]?.[1]?.foto) || ''
  const enCarrito = pc.carrito.filter(i => i.producto_id === p.id).reduce((s, i) => s + i.cantidad, 0)

  return `
    <div class="pc-prod-card" onclick="pcAbrirProducto('${p.id}')" style="display:flex;flex-direction:column">
      <div style="position:relative;aspect-ratio:3/4;overflow:hidden;background:#0c0c17">
        <img id="pc-card-img-${p.id}" src="${esc(imgPrincipal)}" alt="${esc(p.nombre)}" loading="lazy"
          style="width:100%;height:100%;object-fit:cover;transition:opacity 0.2s">
        ${p.es_oferta ? '<span style="position:absolute;top:8px;left:8px;background:#E91E8C;color:white;font-size:0.6rem;font-weight:700;padding:3px 7px;border-radius:100px">OFERTA</span>' : ''}
        ${p.nuevo ? '<span style="position:absolute;top:8px;right:8px;background:#10b981;color:white;font-size:0.6rem;font-weight:700;padding:3px 7px;border-radius:100px">NUEVO</span>' : ''}
        ${enCarrito > 0 ? `<span style="position:absolute;bottom:8px;right:8px;background:rgba(233,30,140,0.92);color:white;font-size:0.6rem;font-weight:700;padding:3px 8px;border-radius:100px">${enCarrito} par${enCarrito !== 1 ? 'es' : ''}</span>` : ''}
      </div>
      <!-- Swatches de color -->
      ${coloresList.length > 0 ? `
      <div style="display:flex;gap:5px;padding:8px 10px;background:#0c0c17;flex-wrap:wrap" onclick="event.stopPropagation()">
        ${coloresList.slice(0,8).map(([cn, cd]) => `
          <div title="${esc(cn)}" onclick="pcCardColor('${p.id}','${esc(cd.foto||imgPrincipal)}',this)"
            style="width:18px;height:18px;border-radius:50%;background:${cd.hex||'#888'};border:2px solid #2a2a40;cursor:pointer;flex-shrink:0;transition:border-color 0.15s"
            onmouseover="this.style.borderColor='#E91E8C'" onmouseout="if(!this.dataset.sel)this.style.borderColor='#2a2a40'">
          </div>`).join('')}
        ${coloresList.length > 8 ? `<span style="font-size:0.62rem;color:#5a5a7a;align-self:center">+${coloresList.length-8}</span>` : ''}
      </div>` : ''}
      <div style="padding:10px 12px;flex:1;display:flex;flex-direction:column">
        <p style="font-size:0.65rem;color:#5a5a7a;margin:0 0 2px;font-family:monospace">${esc(p.sku_interno||'')}</p>
        <p style="font-size:0.83rem;font-weight:600;color:#c0c0e0;margin:0 0 8px;line-height:1.3;flex:1">${esc(p.nombre)}</p>
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px">
          ${m3 ? `<span style="font-size:0.72rem;color:#a0a0c0">3-5: <strong style="color:#e2e2f0">${money(m3)}</strong></span>` : ''}
          ${m6 ? `<span style="font-size:0.72rem;color:#a0a0c0">6+: <strong style="color:#E91E8C">${money(m6)}</strong></span>` : ''}
        </div>
        <button onclick="event.stopPropagation();pcAbrirProducto('${p.id}')" class="pc-btn pc-btn-primary" style="width:100%;padding:7px;font-size:0.78rem">
          ${enCarrito > 0 ? `✓ ${enCarrito} par${enCarrito !== 1 ? 'es' : ''} · Editar` : '+ Seleccionar tallas'}
        </button>
      </div>
    </div>`
}

window.pcCardColor = function(prodId, fotoUrl, swatchEl) {
  const img = document.getElementById('pc-card-img-' + prodId)
  if (img && fotoUrl) {
    img.style.opacity = '0.5'
    img.src = fotoUrl
    img.onload = () => { img.style.opacity = '1' }
  }
  // Marcar swatch activo
  swatchEl.closest('[onclick*="stopPropagation"]')?.querySelectorAll('div[data-sel]').forEach(d => {
    delete d.dataset.sel; d.style.borderColor = '#2a2a40'
  })
  swatchEl.dataset.sel = '1'
  swatchEl.style.borderColor = '#E91E8C'
}

window.pcToggleCompartir = function(prodId) {
  const row = document.getElementById('pc-compartir-' + prodId)
  if (!row) return
  row.style.display = row.style.display === 'none' ? 'flex' : 'none'
}

window.pcCompartirProducto = function(prodId, medio) {
  const p = pc.productos.find(x => x.id === prodId)
  if (!p) return
  const link = `https://zapatillasmay.mx/producto/${encodeURIComponent(p.sku_interno || p.id)}`
  const mensaje = `¡Mira este modelo! ${p.nombre} 👠\n${link}`
  if (medio === 'whatsapp') {
    window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`, '_blank')
  } else if (medio === 'facebook') {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`, '_blank')
  } else if (medio === 'copiar') {
    navigator.clipboard?.writeText(link).then(() => pcMostrarExito('🔗 Link copiado')).catch(() => pcMostrarExito(link))
  }
}

// ── Modal de producto: port del POS (misma lógica, datos de pc.*) ──────────────
window.pcAbrirProducto = function(prodId) {
  if (window._zmPushBack) window._zmPushBack(() => document.getElementById('pc-modal')?.remove())
  const prev = document.getElementById('pc-modal')
  if (prev) prev.remove()

  const p = pc.productos.find(x => x.id === prodId)
  if (!p) return

  const varsProd = pc.variantes.filter(v => v.producto_id === prodId)
  const colores = [...new Set(varsProd.map(v => v.color).filter(Boolean))]

  const pMay3    = precioM3(p)
  const pMay6    = precioM6(p)
  const pCorr    = precioCorrida(p)
  const fmtP = n => '$' + Math.round(n).toLocaleString('es-MX')

  window._pcBuffer  = {}
  window._pcModo    = 'variado'
  window._pcColores = colores
  window._pcCorridaCantidades = {}

  const modal = document.createElement('div')
  modal.id = 'pc-modal'
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem'

  modal.innerHTML = `
    <div style="background:#161625;border:1px solid #2a2a40;border-radius:16px;max-width:640px;width:100%;height:90vh;display:flex;flex-direction:column;overflow:hidden">

      <!-- Header: foto + nombre + precios -->
      <div style="padding:1.25rem 1.5rem 0.85rem;border-bottom:1px solid #2a2a40;flex-shrink:0">
        <div style="display:flex;align-items:flex-start;gap:12px">
          <img id="pc-modal-img" src="${esc(p.imagen_principal||'')}" onclick="abrirLightboxPC(this.src)"
            style="width:64px;height:64px;object-fit:cover;border-radius:10px;flex-shrink:0;cursor:zoom-in;background:#0c0c17">
          <div style="flex:1;min-width:0">
            <p style="font-size:0.65rem;font-family:monospace;color:#5a5a7a;margin:0 0 2px">${esc(p.sku_interno||'')}</p>
            <p style="font-weight:700;font-size:0.95rem;line-height:1.25;color:#e2e2f0;margin:0">${esc(p.nombre)}</p>
            <p style="font-weight:800;color:#E91E8C;font-size:1.05rem;margin:4px 0 0">${fmtP(parseFloat(p.precio_menudeo)||0)} <span style="font-size:0.72rem;font-weight:600;color:#5a5a7a">menudeo</span></p>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;gap:6px;flex-shrink:0">
            <button onclick="document.getElementById('pc-modal').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:#5a5a7a;line-height:1">✕</button>
            <button onclick="pcToggleCompartir('${prodId}')" title="Compartir con tus clientes" style="background:none;border:none;font-size:1.1rem;cursor:pointer;color:#5a5a7a;line-height:1;padding:2px">↗️</button>
          </div>
        </div>
        <div id="pc-compartir-${prodId}" style="display:none;gap:8px;margin-top:8px;padding:8px 0 2px;border-top:1px solid #2a2a40">
          <button onclick="pcCompartirProducto('${prodId}','whatsapp')" style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;background:#25D366;color:white;border:none;border-radius:8px;padding:8px;font-size:0.78rem;font-weight:600;cursor:pointer;font-family:inherit">💬 WhatsApp</button>
          <button onclick="pcCompartirProducto('${prodId}','facebook')" style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;background:#1877F2;color:white;border:none;border-radius:8px;padding:8px;font-size:0.78rem;font-weight:600;cursor:pointer;font-family:inherit">👍 Facebook</button>
          <button onclick="pcCompartirProducto('${prodId}','copiar')" style="flex:0 0 auto;background:#0f0f1c;border:1px solid #2a2a40;color:#c0c0e0;border-radius:8px;padding:8px 12px;font-size:0.78rem;cursor:pointer;font-family:inherit">🔗</button>
        </div>
        <div style="display:flex;gap:6px;margin-top:10px">
          <div style="flex:1;background:#0f0f1c;border:1px solid #2a2a40;border-radius:9px;padding:6px 4px;text-align:center">
            <p style="font-size:0.6rem;color:#5a5a7a;font-weight:700;text-transform:uppercase;margin:0 0 2px">Variado 3-5</p>
            <p style="font-size:0.92rem;font-weight:800;color:#e2e2f0;margin:0">${fmtP(pMay3)}</p>
          </div>
          <div style="flex:1;background:#0f0f1c;border:1px solid #2a2a40;border-radius:9px;padding:6px 4px;text-align:center">
            <p style="font-size:0.6rem;color:#5a5a7a;font-weight:700;text-transform:uppercase;margin:0 0 2px">Variado 6+</p>
            <p style="font-size:0.92rem;font-weight:800;color:#E91E8C;margin:0">${fmtP(pMay6)}</p>
          </div>
          ${p.corrida_activa ? `
          <div style="flex:1;background:rgba(107,27,154,0.1);border:1px solid rgba(107,27,154,0.3);border-radius:9px;padding:6px 4px;text-align:center">
            <p style="font-size:0.6rem;color:#b39ddb;font-weight:700;text-transform:uppercase;margin:0 0 2px">Corrida c/u</p>
            <p style="font-size:0.92rem;font-weight:800;color:#b39ddb;margin:0">${fmtP(pCorr)}</p>
          </div>` : ''}
        </div>
        <!-- Strip de fotos por color -->
        <div id="pc-modal-foto-strip" style="display:none;gap:6px;flex-wrap:nowrap;overflow-x:auto;padding:8px 0 0;-webkit-overflow-scrolling:touch"></div>
      </div>

      <!-- Scroll area: tabs + colores + tallas -->
      <div id="pc-modal-scroll" style="flex:1;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch">

        ${p.corrida_activa ? `
        <div style="padding:12px 1.5rem 0">
          <div style="display:flex;gap:4px;background:#0c0c17;border-radius:12px;padding:4px">
            <button id="pc-modo-variado" onclick="pcCambiarModo('${prodId}','variado')"
              style="flex:1;padding:8px;border:none;border-radius:9px;cursor:pointer;font-family:inherit;font-size:0.82rem;font-weight:700;background:#E91E8C;color:white;transition:all 0.15s">
              🧺 Variado
            </button>
            <button id="pc-modo-corrida" onclick="pcCambiarModo('${prodId}','corrida')"
              style="flex:1;padding:8px;border:none;border-radius:9px;cursor:pointer;font-family:inherit;font-size:0.82rem;font-weight:700;background:transparent;color:#b39ddb;transition:all 0.15s">
              📦 Corrida
            </button>
          </div>
          <p id="pc-modo-hint" style="font-size:0.72rem;color:#5a5a7a;margin:6px 0 0;line-height:1.4">Elige tallas sueltas — precio ajusta según total de pares en tu pedido.</p>
        </div>` : ''}

        <!-- Selector de colores -->
        <div style="padding:1rem 1.5rem;border-bottom:1px solid #1e1e30">
          <p style="font-size:0.7rem;color:#5a5a7a;font-weight:700;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.08em">Selecciona color</p>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${colores.map(color => {
              const varsColor = varsProd.filter(v => v.color === color)
              const fotoColor = varsColor.map(x => x.foto_url).find(Boolean)
              const hex = varsColor[0]?.color_hex || '#888'
              const totalStock = varsColor.reduce((sum, v) => {
                return sum + pc.inventario.filter(i => i.variante_id === v.id).reduce((s, i) => s + (i.cantidad || 0), 0)
              }, 0)
              const swatch = fotoColor
                ? `<img src="${esc(fotoColor)}" style="width:46px;height:46px;object-fit:cover;border-radius:8px;border:1px solid #2a2a40">`
                : `<div style="width:46px;height:46px;border-radius:8px;background:${hex};border:1px solid #2a2a40"></div>`
              return `
                <div onclick="pcSeleccionarColor('${prodId}','${esc(color)}')"
                     id="pc-color-btn-${esc(color.replace(/\s/g,'_'))}"
                     style="display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;padding:6px;border-radius:10px;border:2px solid ${totalStock===0?'#1e1e30':'#2a2a40'};opacity:${totalStock===0?'0.4':'1'};width:74px;transition:border-color 0.15s">
                  ${swatch}
                  <span style="font-size:0.6rem;color:#8888aa;text-align:center;line-height:1.1;height:2.2em;overflow:hidden">${esc(color)}</span>
                  <span id="pc-color-badge-${esc(color.replace(/\s/g,'_'))}" style="font-size:0.6rem;color:#E91E8C;font-weight:700;display:none"></span>
                </div>`
            }).join('')}
          </div>
        </div>

        <!-- Panel de tallas (se rellena al seleccionar color) -->
        <div id="pc-tallas-panel" style="padding:1rem 1.5rem;border-bottom:1px solid #1e1e30">
          <p style="color:#5a5a7a;font-size:0.85rem">← Selecciona un color para ver las tallas</p>
        </div>

        ${(p.descripcion || p.material || p.forro || p.tipo_tacon || p.horma) ? `
        <div style="padding:1rem 1.5rem">
          ${p.descripcion ? `
          <p style="font-size:0.7rem;color:#5a5a7a;font-weight:700;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.08em">Descripción</p>
          <p style="font-size:0.85rem;color:#c0c0e0;line-height:1.6;margin:0 0 16px">${esc(p.descripcion)}</p>` : ''}
          ${(p.material || p.forro || p.tipo_tacon || p.horma) ? `
          <p style="font-size:0.7rem;color:#5a5a7a;font-weight:700;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.08em">Detalles del producto</p>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
            ${p.material ? `<div><p style="font-size:0.65rem;color:#5a5a7a;margin:0 0 2px;text-transform:uppercase">Material</p><p style="font-size:0.82rem;color:#e2e2f0;margin:0">${esc(p.material)}</p></div>` : ''}
            ${p.forro ? `<div><p style="font-size:0.65rem;color:#5a5a7a;margin:0 0 2px;text-transform:uppercase">Forro</p><p style="font-size:0.82rem;color:#e2e2f0;margin:0">${esc(p.forro)}</p></div>` : ''}
            ${p.tipo_tacon ? `<div><p style="font-size:0.65rem;color:#5a5a7a;margin:0 0 2px;text-transform:uppercase">Tipo de tacón</p><p style="font-size:0.82rem;color:#e2e2f0;margin:0">${esc(p.tipo_tacon)}</p></div>` : ''}
            ${p.horma ? `<div><p style="font-size:0.65rem;color:#5a5a7a;margin:0 0 2px;text-transform:uppercase">Horma</p><p style="font-size:0.82rem;color:#e2e2f0;margin:0">${esc(p.horma)}</p></div>` : ''}
          </div>` : ''}
        </div>` : ''}

      </div><!-- /scroll -->

      <!-- Resumen selección -->
      <div id="pc-modal-resumen" style="padding:0.75rem 1.5rem;border-bottom:1px solid #1e1e30;display:none;flex-shrink:0"></div>

      <!-- Footer: botón confirmar -->
      <div id="pc-modal-footer" style="padding:1rem 1.5rem;display:flex;flex-direction:column;gap:8px;flex-shrink:0;border-top:1px solid #2a2a40">
        <button onclick="pcConfirmarModal('${prodId}')" id="pc-btn-confirmar" disabled
          style="width:100%;padding:14px;background:#E91E8C;color:white;border:none;border-radius:10px;font-family:inherit;font-size:1rem;font-weight:700;cursor:pointer;opacity:0.5">
          Selecciona al menos una talla
        </button>
        <button onclick="pcIrA('carrito');document.getElementById('pc-modal').remove()"
          style="width:100%;padding:10px;background:transparent;color:#5a5a7a;border:1px solid #2a2a40;border-radius:10px;font-family:inherit;font-size:0.82rem;cursor:pointer">
          Ver pedido actual →
        </button>
      </div>
    </div>`

  document.body.appendChild(modal)
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove() })
  window._pcSeleccion = { prodId, color: null }

  // Auto-seleccionar primer color
  if (colores.length) pcSeleccionarColor(prodId, colores[0])
}

// ── Helpers del modal de producto (port del POS) ──────────────────────────────

window.pcCambiarModo = (prodId, modo) => {
  window._pcModo = modo
  const tv = document.getElementById('pc-modo-variado')
  const tc = document.getElementById('pc-modo-corrida')
  if (tv) { tv.style.background = modo==='variado'?'#E91E8C':'transparent'; tv.style.color = modo==='variado'?'white':'#5a5a7a' }
  if (tc) { tc.style.background = modo==='corrida'?'#6a1b9a':'transparent'; tc.style.color = modo==='corrida'?'white':'#b39ddb' }
  const hint = document.getElementById('pc-modo-hint')
  if (hint) hint.textContent = modo === 'corrida'
    ? 'Corrida completa: varias tallas del mismo color a precio de corrida. Usa "Sugerir" para llenarla rápido.'
    : 'Elige tallas sueltas — precio ajusta según total de pares en tu pedido.'
  document.querySelectorAll('[id^="pc-color-badge-"]').forEach(b => { b.style.display = 'none' })

  const footer = document.getElementById('pc-modal-footer')
  const colorActivo = window._pcSeleccion?.color || (window._pcColores && window._pcColores[0])

  if (modo === 'corrida') {
    if (!window._pcCorridaCantidades) window._pcCorridaCantidades = {}
    if (footer) footer.innerHTML = `
      <button onclick="pcSugerirCorrida('${prodId}', window._pcSeleccion?.color)"
        style="width:100%;padding:12px;font-size:0.9rem;font-weight:700;cursor:pointer;background:rgba(107,27,154,0.15);color:#b39ddb;border:1.5px solid rgba(107,27,154,0.4);border-radius:10px;font-family:inherit">
        ✨ Sugerir corrida (6 pares)
      </button>
      <button onclick="pcConfirmarCorrida('${prodId}')" id="pc-btn-confirmar-corrida" disabled
        style="width:100%;padding:14px;background:#6a1b9a;color:white;border:none;border-radius:10px;font-family:inherit;font-size:1rem;font-weight:700;cursor:pointer;opacity:0.5">
        Agrega tallas a la corrida
      </button>`
    if (colorActivo) { _pcHighlightColor(colorActivo,'#6a1b9a','rgba(107,27,154,0.12)'); pcRenderCorridaTallas(prodId, colorActivo); window._pcSeleccion.color = colorActivo }
  } else {
    if (footer) footer.innerHTML = `
      <button onclick="pcConfirmarModal('${prodId}')" id="pc-btn-confirmar" disabled
        style="width:100%;padding:14px;background:#E91E8C;color:white;border:none;border-radius:10px;font-family:inherit;font-size:1rem;font-weight:700;cursor:pointer;opacity:0.5">
        Selecciona al menos una talla
      </button>`
    if (colorActivo) pcSeleccionarColor(prodId, colorActivo)
  }
}

function _pcHighlightColor(color, border, bg) {
  document.querySelectorAll('[id^="pc-color-btn-"]').forEach(el => { el.style.borderColor='#2a2a40'; el.style.background='transparent' })
  const el = document.getElementById('pc-color-btn-' + color.replace(/\s/g,'_'))
  if (el) { el.style.borderColor = border; el.style.background = bg }
}

window.pcSeleccionarColor = (prodId, color) => {
  if (window._pcModo === 'corrida') {
    window._pcSeleccion.color = color
    _pcHighlightColor(color, '#6a1b9a', 'rgba(107,27,154,0.12)')
    pcRenderCorridaTallas(prodId, color)
  } else {
    // Guardar buffer del color anterior
    if (window._pcSeleccion && window._pcSeleccion.color && window._pcSeleccion.color !== color) {
      pcGuardarBufferColor(prodId, window._pcSeleccion.color)
    }
    _pcHighlightColor(color, '#E91E8C', 'rgba(233,30,140,0.08)')
    window._pcSeleccion.color = color

    const varsProd = pc.variantes.filter(v => v.producto_id === prodId)
    const varsColor = varsProd.filter(v => v.color === color)
      .sort((a, b) => TALLAS_ORDEN.indexOf(a.talla) - TALLAS_ORDEN.indexOf(b.talla))

    // Cambiar foto principal y strip de miniaturas
    const todasFotos = []
    varsColor.forEach(v => {
      const imgs = Array.isArray(v.imagenes) && v.imagenes.length ? v.imagenes : (v.foto_url ? [v.foto_url] : [])
      imgs.forEach(u => { if (u && !todasFotos.includes(u)) todasFotos.push(u) })
    })
    const fotoColor = todasFotos[0] || null
    const modalImg = document.getElementById('pc-modal-img')
    if (modalImg && fotoColor) modalImg.src = fotoColor
    // Strip de miniaturas
    const strip = document.getElementById('pc-modal-foto-strip')
    if (strip) {
      if (todasFotos.length <= 1) {
        strip.style.display = 'none'
      } else {
        strip.style.display = 'flex'
        window._pcFotosColorActual = todasFotos
        strip.innerHTML = todasFotos.map((u, i) => `
          <img src="${esc(u)}" onclick="document.getElementById('pc-modal-img').src='${esc(u)}';document.querySelectorAll('#pc-modal-foto-strip img').forEach(el=>el.style.outline='none');this.style.outline='2px solid #E91E8C';abrirLightboxPC('${esc(u)}',window._pcFotosColorActual)"
            style="width:52px;height:52px;object-fit:cover;border-radius:8px;cursor:pointer;flex-shrink:0;outline:${i===0?'2px solid #E91E8C':'none'}">
        `).join('')
      }
    }

    const bufferColor = window._pcBuffer[color] || {}
    const panel = document.getElementById('pc-tallas-panel')
    if (panel) {
      panel.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
          <p style="font-size:0.75rem;color:#5a5a7a;font-weight:600;margin:0;text-transform:uppercase">Tallas — ${esc(color)}</p>
          <p style="font-size:0.7rem;color:#3a3a5c;margin:0">Toca para agregar</p>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:10px">
          ${varsColor.map(v => {
            const stock = pc.inventario.filter(i => i.variante_id === v.id).reduce((s, i) => s + (i.cantidad||0), 0)
            const qty = bufferColor[v.id] || 0
            return `
              <div style="position:relative">
                <button id="pc-chip-talla-${v.id}"
                  onclick="pcTallaTap('${v.id}','${prodId}','${esc(color)}',${stock})"
                  ${stock===0?'disabled':''}
                  style="width:100%;min-height:62px;border:2px solid ${qty>0?'#E91E8C':'#2a2a40'};background:${qty>0?'rgba(233,30,140,0.12)':'#0f0f1c'};border-radius:12px;cursor:${stock===0?'not-allowed':'pointer'};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-family:inherit;padding:8px 4px;${stock===0?'opacity:0.4':''}">
                  <span style="font-size:1rem;font-weight:800;color:${stock===0?'#3a3a5c':'#e2e2f0'}">${esc(v.talla)}</span>
                  <span style="font-size:0.62rem;color:${stock===0?'#3a3a5c':'#4ade80'}">${stock===0?'Agotado':'Stk '+stock}</span>
                  ${v.sku ? `<span style="font-size:0.55rem;color:#5a5a7a;font-family:monospace">${esc(v.sku)}</span>` : ''}
                </button>
                ${stock===0 ? `<button onclick="pcAvisameStock('${v.id}',this)" title="Avísame cuando haya stock" style="position:absolute;top:-7px;left:-7px;background:#161625;border:1.5px solid #2a2a40;color:#5a5a7a;border-radius:100px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:0.8rem;cursor:pointer;padding:0">🔔</button>` : ''}
                <span id="pc-chipbadge-${v.id}" style="position:absolute;top:-7px;right:-7px;background:#E91E8C;color:#fff;border-radius:100px;min-width:22px;height:22px;display:${qty>0?'flex':'none'};align-items:center;justify-content:center;font-size:0.75rem;font-weight:800;padding:0 5px;pointer-events:none">${qty}</span>
                <button id="pc-chipmenos-${v.id}"
                  onclick="pcTallaMenos('${v.id}','${prodId}','${esc(color)}')"
                  style="position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);background:#0f0f1c;border:1.5px solid #E91E8C;color:#E91E8C;border-radius:100px;width:26px;height:26px;display:${qty>0?'flex':'none'};align-items:center;justify-content:center;font-size:1.1rem;font-weight:800;cursor:pointer;line-height:1;touch-action:manipulation">−</button>
                <input type="hidden" id="pc-qty-modal-${v.id}" value="${qty}">
              </div>`
          }).join('')}
        </div>`
    }
  }
}

window.pcTallaTap = (varId, prodId, color, max) => {
  const input = document.getElementById('pc-qty-modal-' + varId)
  if (!input) return
  const nueva = Math.min(max, (parseInt(input.value)||0) + 1)
  input.value = nueva
  _pcPintarChipTalla(varId, nueva)
  pcActualizarBadgeColor(prodId, color)
}
window.pcAvisameStock = async (varId, btnEl) => {
  if (!pc.sesion?.cliente_id) return
  if (btnEl) { btnEl.disabled = true; btnEl.textContent = '⏳' }
  try {
    const res = await fetch(`${PC_API}/inventario/avisame`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ variante_id: varId, cliente_id: pc.sesion.cliente_id })
    })
    if (btnEl) {
      if (res.ok) { btnEl.textContent = '✅'; btnEl.title = 'Te avisaremos cuando haya stock' }
      else { btnEl.textContent = '🔔'; btnEl.disabled = false }
    }
  } catch (e) {
    if (btnEl) { btnEl.textContent = '🔔'; btnEl.disabled = false }
  }
}

window.pcTallaMenos = (varId, prodId, color) => {
  const input = document.getElementById('pc-qty-modal-' + varId)
  if (!input) return
  const nueva = Math.max(0, (parseInt(input.value)||0) - 1)
  input.value = nueva
  _pcPintarChipTalla(varId, nueva)
  pcActualizarBadgeColor(prodId, color)
}
function _pcPintarChipTalla(varId, val) {
  const chip = document.getElementById('pc-chip-talla-' + varId)
  if (chip) { chip.style.borderColor = val>0?'#E91E8C':'#2a2a40'; chip.style.background = val>0?'rgba(233,30,140,0.12)':'#0f0f1c' }
  const badge = document.getElementById('pc-chipbadge-' + varId)
  if (badge) { badge.textContent = val; badge.style.display = val>0?'flex':'none' }
  const menos = document.getElementById('pc-chipmenos-' + varId)
  if (menos) menos.style.display = val>0?'flex':'none'
}

function pcGuardarBufferColor(prodId, color) {
  const varsColor = pc.variantes.filter(v => v.producto_id === prodId && v.color === color)
  if (!window._pcBuffer[color]) window._pcBuffer[color] = {}
  varsColor.forEach(v => {
    const input = document.getElementById('pc-qty-modal-' + v.id)
    window._pcBuffer[color][v.id] = input ? parseInt(input.value)||0 : 0
  })
  pcActualizarBadgeColor(prodId, color)
}

function pcActualizarBadgeColor(prodId, color) {
  const varsColor = pc.variantes.filter(v => v.producto_id === prodId && v.color === color)
  let total = 0
  varsColor.forEach(v => {
    const input = document.getElementById('pc-qty-modal-' + v.id)
    total += input ? parseInt(input.value)||0 : 0
  })
  const badge = document.getElementById('pc-color-badge-' + color.replace(/\s/g,'_'))
  if (badge) {
    if (total > 0) { badge.textContent = total + ' par' + (total>1?'es':''); badge.style.display = 'block' }
    else badge.style.display = 'none'
  }
  pcActualizarResumenModal(prodId)
}

function pcActualizarResumenModal(prodId) {
  let totalPares = 0
  const lineas = []
  const varsProd = pc.variantes.filter(v => v.producto_id === prodId)

  Object.entries(window._pcBuffer).forEach(([color, cantidades]) => {
    Object.entries(cantidades).forEach(([varId, cant]) => {
      if (cant > 0) { const v = varsProd.find(v => v.id === varId); if (v) { lineas.push({color, talla:v.talla, cantidad:cant}); totalPares += cant } }
    })
  })
  const colorActual = window._pcSeleccion?.color
  if (colorActual && !window._pcBuffer[colorActual]) {
    varsProd.filter(v => v.color === colorActual).forEach(v => {
      const input = document.getElementById('pc-qty-modal-' + v.id)
      const cant = input ? parseInt(input.value)||0 : 0
      if (cant > 0) { lineas.push({color:colorActual, talla:v.talla, cantidad:cant}); totalPares += cant }
    })
  }

  const resumen = document.getElementById('pc-modal-resumen')
  const btn = document.getElementById('pc-btn-confirmar')
  if (totalPares > 0) {
    if (resumen) {
      resumen.style.display = 'block'
      resumen.innerHTML = `<p style="font-size:0.75rem;font-weight:700;color:#4ade80;margin-bottom:6px">🛒 ${totalPares} pares seleccionados</p>
        <div style="display:flex;flex-wrap:wrap;gap:5px">
          ${lineas.map(l=>`<span style="background:#0c0c17;border:1px solid #2a2a40;border-radius:100px;padding:2px 10px;font-size:0.78rem;color:#c0c0e0"><strong>${esc(l.color)}</strong> T${l.talla} ×${l.cantidad}</span>`).join('')}
        </div>`
    }
    if (btn) { btn.textContent = `✅ Agregar ${totalPares} pares al pedido`; btn.disabled = false; btn.style.opacity = '1' }
  } else {
    if (resumen) resumen.style.display = 'none'
    if (btn) { btn.textContent = 'Selecciona al menos una talla'; btn.disabled = true; btn.style.opacity = '0.5' }
  }
}

window.pcConfirmarModal = (prodId) => {
  const p = pc.productos.find(x => x.id === prodId)
  if (!p) return
  const varsProd = pc.variantes.filter(v => v.producto_id === prodId)

  if (window._pcSeleccion?.color) pcGuardarBufferColor(prodId, window._pcSeleccion.color)

  let agregados = 0
  Object.entries(window._pcBuffer).forEach(([color, cantidades]) => {
    Object.entries(cantidades).forEach(([varId, cantidad]) => {
      if (cantidad <= 0) return
      const v = varsProd.find(v => v.id === varId)
      const foto = v?.foto_url || p.imagen_principal || null
      const existente = pc.carrito.find(i => i.variante_id === varId && !i.es_corrida)
      if (existente) { existente.cantidad += cantidad }
      else {
        const totalDespues = pc.carrito.reduce((s,i)=>s+i.cantidad,0) + cantidad
        pc.carrito.push({ producto_id: prodId, variante_id: varId, nombre: p.nombre, sku: p.sku_interno, imagen: foto, talla: v?.talla||'', color, cantidad, precio_unitario: totalDespues >= 6 ? precioM6(p) : precioM3(p), es_corrida: false })
      }
      agregados++
    })
  })

  if (agregados === 0) { alert('Agrega al menos una talla'); return }
  document.getElementById('pc-modal').remove()
  window._pcBuffer = {}
  pcGuardarCarrito()
  renderCatalogo()
}

// ── Corrida mode ──────────────────────────────────────────────────────────────
window.pcRenderCorridaTallas = (prodId, color) => {
  const varsProd = pc.variantes.filter(v => v.producto_id === prodId && v.color === color)
    .sort((a,b) => TALLAS_ORDEN.indexOf(a.talla) - TALLAS_ORDEN.indexOf(b.talla))
  const panel = document.getElementById('pc-tallas-panel')
  if (!panel) return
  if (!window._pcCorridaCantidades) window._pcCorridaCantidades = {}

  panel.innerHTML = `
    <p style="font-size:0.75rem;color:#b39ddb;font-weight:700;margin-bottom:12px">📦 CORRIDA · ${esc(color)} — ajusta cantidades</p>
    <div style="display:flex;flex-direction:column;gap:8px">
      ${varsProd.map(v => {
        const stock = pc.inventario.filter(i => i.variante_id === v.id).reduce((s,i)=>s+(i.cantidad||0),0)
        const cantidad = window._pcCorridaCantidades[v.id] || 0
        return `
          <div style="display:flex;align-items:center;gap:10px;opacity:${stock===0?'0.4':'1'}">
            <span style="min-width:40px;font-size:0.9rem;font-weight:700;color:#e2e2f0">${esc(v.talla)}</span>
            <span style="font-size:0.72rem;color:#3a3a5c;min-width:54px">Stock: ${stock}</span>
            <div style="display:flex;align-items:center;gap:6px">
              <button ${stock===0?'disabled':''} onclick="pcCorridaQty('${v.id}',-1,${stock},'${prodId}')"
                style="background:#0f0f1c;border:1px solid #2a2a40;color:#c0c0e0;border-radius:8px;width:40px;height:40px;cursor:pointer;font-size:1.3rem;font-weight:700;touch-action:manipulation">−</button>
              <input type="number" min="0" max="${stock}" value="${cantidad}" id="pc-qty-corrida-${v.id}" ${stock===0?'disabled':''}
                style="width:56px;height:40px;text-align:center;border:2px solid ${cantidad>0?'#6a1b9a':'#2a2a40'};border-radius:8px;font-size:1rem;font-weight:700;background:#0f0f1c;color:#e2e2f0;font-family:inherit"
                oninput="window._pcCorridaCantidades['${v.id}']=Math.min(${stock},Math.max(0,parseInt(this.value)||0));this.value=window._pcCorridaCantidades['${v.id}'];this.style.borderColor=window._pcCorridaCantidades['${v.id}']>0?'#6a1b9a':'#2a2a40';pcActualizarBadgesCorrida('${prodId}')">
              <button ${stock===0?'disabled':''} onclick="pcCorridaQty('${v.id}',1,${stock},'${prodId}')"
                style="background:#0f0f1c;border:1px solid #2a2a40;color:#c0c0e0;border-radius:8px;width:40px;height:40px;cursor:pointer;font-size:1.3rem;font-weight:700;touch-action:manipulation">+</button>
            </div>
            ${stock===0?'<span style="font-size:0.7rem;color:#ef4444;background:rgba(239,68,68,0.1);padding:2px 8px;border-radius:100px">Agotado</span>':''}
          </div>`
      }).join('')}
    </div>`
  pcActualizarBadgesCorrida(prodId)
}

window.pcCorridaQty = (varId, delta, stock, prodId) => {
  const cur = window._pcCorridaCantidades[varId] || 0
  const val = Math.min(stock, Math.max(0, cur + delta))
  window._pcCorridaCantidades[varId] = val
  const input = document.getElementById('pc-qty-corrida-' + varId)
  if (input) { input.value = val; input.style.borderColor = val>0?'#6a1b9a':'#2a2a40' }
  pcActualizarBadgesCorrida(prodId)
}

window.pcActualizarBadgesCorrida = (prodId) => {
  let total = 0
  ;(window._pcColores || []).forEach(c => {
    const varsC = pc.variantes.filter(v => v.producto_id === prodId && v.color === c)
    let sum = 0
    varsC.forEach(v => { sum += window._pcCorridaCantidades[v.id] || 0 })
    total += sum
    const badge = document.getElementById('pc-color-badge-' + c.replace(/\s/g,'_'))
    if (badge) {
      if (sum > 0) { badge.textContent = sum + ' par' + (sum>1?'es':''); badge.style.color='#b39ddb'; badge.style.display='block' }
      else badge.style.display = 'none'
    }
  })
  const resumen = document.getElementById('pc-modal-resumen')
  const btn = document.getElementById('pc-btn-confirmar-corrida')
  if (total > 0) {
    if (resumen) {
      const lineas = []
      Object.entries(window._pcCorridaCantidades).forEach(([vid, cant]) => {
        if (cant > 0) { const v = pc.variantes.find(v => v.id === vid); if (v) lineas.push({color:v.color, talla:v.talla, cantidad:cant}) }
      })
      resumen.style.display = 'block'
      resumen.innerHTML = `<p style="font-size:0.75rem;font-weight:700;color:#b39ddb;margin-bottom:6px">📦 CORRIDA — ${total} pares</p>
        <div style="display:flex;flex-wrap:wrap;gap:5px">
          ${lineas.map(l=>`<span style="background:rgba(107,27,154,0.1);border:1px solid rgba(107,27,154,0.3);border-radius:100px;padding:2px 10px;font-size:0.78rem;color:#b39ddb">T${l.talla} ×${l.cantidad}</span>`).join('')}
        </div>`
    }
    if (btn) { btn.textContent = `✅ Agregar corrida (${total} pares)`; btn.disabled = false; btn.style.opacity = '1' }
  } else {
    if (resumen) resumen.style.display = 'none'
    if (btn) { btn.textContent = 'Agrega tallas a la corrida'; btn.disabled = true; btn.style.opacity = '0.5' }
  }
}

window.pcSugerirCorrida = (prodId, color) => {
  if (!color) { alert('Selecciona un color primero'); return }
  const varsProd = pc.variantes.filter(v => v.producto_id === prodId)
  const varsColor = varsProd.filter(v => v.color === color)
    .sort((a,b) => TALLAS_ORDEN.indexOf(a.talla) - TALLAS_ORDEN.indexOf(b.talla))

  const conStock = varsColor.filter(v => {
    return pc.inventario.filter(i => i.variante_id === v.id).reduce((s,i)=>s+(i.cantidad||0),0) > 0
  })

  const tieneMedias = conStock.some(v => v.talla.includes('.'))
  varsColor.forEach(v => { window._pcCorridaCantidades[v.id] = 0 })

  const tiene26 = conStock.some(v => v.talla === '26')
  const RANGOS = tieneMedias
    ? { con26:['26','25.5','25','24.5','24','23.5'], sin26:['25.5','25','24.5','24','23.5','23'] }
    : { con26:['26','25','24','23'],                  sin26:['25','24','23','22'] }
  const rangoDeseado = tiene26 ? RANGOS.con26 : RANGOS.sin26

  let seleccionadas = rangoDeseado.map(t => conStock.find(v => v.talla === t)).filter(Boolean)

  if (seleccionadas.length < 6) {
    const idsYa = new Set(seleccionadas.map(v => v.id))
    const rangoMinIdx = TALLAS_ORDEN.indexOf(rangoDeseado[rangoDeseado.length - 1])
    const extras = conStock
      .filter(v => !idsYa.has(v.id) && TALLAS_ORDEN.indexOf(v.talla) < rangoMinIdx)
      .sort((a,b) => TALLAS_ORDEN.indexOf(b.talla) - TALLAS_ORDEN.indexOf(a.talla))
    for (const v of extras) { if (seleccionadas.length >= 6) break; seleccionadas.push(v) }
  }

  if (!seleccionadas.length) seleccionadas = conStock.slice(0, tieneMedias ? 6 : 5)

  if (tieneMedias) {
    seleccionadas.slice(0,6).forEach(v => { window._pcCorridaCantidades[v.id] = 1 })
  } else {
    const tallas = seleccionadas.slice(0,5)
    if (tallas.length === 4) {
      tallas.forEach((v,i) => { window._pcCorridaCantidades[v.id] = (i===1||i===2)?2:1 })
    } else if (tallas.length === 5) {
      tallas.forEach((v,i) => { window._pcCorridaCantidades[v.id] = i===2?2:1 })
    } else {
      seleccionadas.slice(0,6).forEach(v => { window._pcCorridaCantidades[v.id] = Math.ceil(6/seleccionadas.length) })
    }
  }

  _pcHighlightColor(color, '#6a1b9a', 'rgba(107,27,154,0.12)')
  pcRenderCorridaTallas(prodId, color)
}

window.pcConfirmarCorrida = (prodId) => {
  const p = pc.productos.find(x => x.id === prodId)
  if (!p) return
  let agregados = 0
  const precio = precioCorrida(p)
  Object.entries(window._pcCorridaCantidades).forEach(([varId, cantidad]) => {
    if (cantidad <= 0) return
    const v = pc.variantes.find(v => v.id === varId)
    if (!v) return
    const foto = v.foto_url || p.imagen_principal || null
    const existente = pc.carrito.find(i => i.variante_id === varId && i.es_corrida)
    if (existente) { existente.cantidad += cantidad }
    else pc.carrito.push({ producto_id: prodId, variante_id: varId, nombre: p.nombre, sku: p.sku_interno, imagen: foto, talla: v.talla, color: v.color, cantidad, precio_unitario: precio, es_corrida: true })
    agregados++
  })
  if (agregados === 0) { alert('Agrega al menos una talla'); return }
  document.getElementById('pc-modal').remove()
  window._pcCorridaCantidades = {}
  pcGuardarCarrito()
  renderCatalogo()
}

window.abrirLightboxPC = function(src, fotos) {
  if (!src) return
  const prev = document.getElementById('pc-lightbox')
  if (prev) prev.remove()

  // Recopilar todas las fotos del strip si no se pasan explícitamente
  if (!fotos || !fotos.length) {
    const strip = document.getElementById('pc-modal-foto-strip')
    if (strip && strip.style.display !== 'none') {
      fotos = Array.from(strip.querySelectorAll('img')).map(i => i.src)
    }
    if (!fotos || !fotos.length) fotos = [src]
    if (!fotos.includes(src)) fotos = [src, ...fotos]
  }

  let idx = fotos.indexOf(src)
  if (idx < 0) idx = 0

  const lb = document.createElement('div')
  lb.id = 'pc-lightbox'
  lb.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:19999;display:flex;flex-direction:column;align-items:center;justify-content:center;touch-action:none'

  const render = () => {
    const total = fotos.length
    lb.innerHTML = `
      <button onclick="document.getElementById('pc-lightbox').remove()" style="position:absolute;top:16px;right:16px;background:rgba(255,255,255,0.1);border:none;color:white;font-size:1.4rem;width:44px;height:44px;border-radius:50%;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center">✕</button>
      ${total > 1 ? `<button id="lb-prev" onclick="lbNav(-1)" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.12);border:none;color:white;font-size:1.6rem;width:44px;height:44px;border-radius:50%;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center;opacity:${idx===0?0.3:1}">‹</button>` : ''}
      <img id="lb-img" src="${fotos[idx]}" style="max-width:92vw;max-height:82vh;object-fit:contain;border-radius:10px;box-shadow:0 8px 40px rgba(0,0,0,0.8);user-select:none;-webkit-user-drag:none">
      ${total > 1 ? `<button id="lb-next" onclick="lbNav(1)" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.12);border:none;color:white;font-size:1.6rem;width:44px;height:44px;border-radius:50%;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center;opacity:${idx===total-1?0.3:1}">›</button>` : ''}
      ${total > 1 ? `<div style="display:flex;gap:6px;margin-top:14px">${fotos.map((_,i)=>`<div onclick="lbGoto(${i})" style="width:${i===idx?'22px':'8px'};height:8px;border-radius:4px;background:${i===idx?'#E91E8C':'rgba(255,255,255,0.3)'};cursor:pointer;transition:all 0.2s"></div>`).join('')}</div>` : ''}
    `
  }

  window.lbNav = (dir) => {
    idx = Math.max(0, Math.min(fotos.length - 1, idx + dir))
    render()
    addSwipe()
  }
  window.lbGoto = (i) => { idx = i; render(); addSwipe() }

  const addSwipe = () => {
    const img = document.getElementById('lb-img')
    if (!img) return
    let startX = 0
    img.addEventListener('touchstart', e => { startX = e.touches[0].clientX }, { passive: true })
    img.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX
      if (Math.abs(dx) > 50) window.lbNav(dx < 0 ? 1 : -1)
    }, { passive: true })
  }

  lb.addEventListener('click', e => { if (e.target === lb) lb.remove() })

  const onKey = (e) => {
    if (e.key === 'ArrowRight') window.lbNav(1)
    else if (e.key === 'ArrowLeft') window.lbNav(-1)
    else if (e.key === 'Escape') { lb.remove(); document.removeEventListener('keydown', onKey) }
  }
  document.addEventListener('keydown', onKey)
  lb.addEventListener('remove', () => document.removeEventListener('keydown', onKey))

  render()
  document.body.appendChild(lb)
  addSwipe()
}


function pcGuardarCarrito() {
  try { localStorage.setItem(PC_CARRITO_KEY, JSON.stringify(pc.carrito)) } catch {}
  pcSincronizarCarritoServidorDebounced()
}

// ── Carrito persistente en servidor: el carrito activo se respalda como un
// pedido status=borrador (canal portal_mayoreo) ligado al cliente, para que no
// se pierda si cambia de dispositivo o borra el navegador. Se filtra de "Mis
// pedidos" (ver cargarDatosPC) para que no se confunda con un pedido real.
let _pcSyncTimer = null
function pcSincronizarCarritoServidorDebounced() {
  clearTimeout(_pcSyncTimer)
  _pcSyncTimer = setTimeout(() => { pcSincronizarCarritoServidor().catch(() => {}) }, 1500)
}

async function pcSincronizarCarritoServidor() {
  if (!pc.sesion?.cliente_id) return
  if (!pc.carrito.length) {
    // Carrito vacío: cancelar el borrador del servidor si había uno, para no
    // dejar un borrador viejo con items que ya no están.
    if (pc._borradorServerId) {
      const idViejo = pc._borradorServerId
      pc._borradorServerId = null
      fetch(`${PC_API}/pedidos/${idViejo}/cancelar`, { method: 'POST' }).catch(() => {})
    }
    return
  }
  let pedidoId = pc._borradorServerId
  if (!pedidoId) {
    const res = await fetch(`${PC_API}/pedidos`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cliente_id: pc.sesion.cliente_id, status: 'borrador', canal: 'portal_mayoreo', total: 0, notas: PC_BORRADOR_MARCA })
    })
    if (!res.ok) return
    const d = await res.json()
    pedidoId = Array.isArray(d) ? d[0]?.id : d?.id
    if (!pedidoId) return
    pc._borradorServerId = pedidoId
  }
  try {
    const actuales = await fetch(`${PC_API}/pedidos/${pedidoId}/items`).then(r => r.ok ? r.json() : [])
    for (const it of (Array.isArray(actuales) ? actuales : [])) {
      await fetch(`${PC_API}/pedidos/${pedidoId}/items/${it.id}`, { method: 'DELETE' }).catch(() => {})
    }
    for (const item of pc.carrito) {
      await fetch(`${PC_API}/pedidos/${pedidoId}/items`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variante_id: item.variante_id, cantidad: item.cantidad, precio_unitario: item.precio_unitario,
          subtotal: item.cantidad * item.precio_unitario, nombre: item.nombre, color: item.color,
          talla: item.talla, es_corrida: !!item.es_corrida,
        })
      }).catch(() => {})
    }
    const total = pc.carrito.reduce((s, i) => s + i.cantidad * i.precio_unitario, 0)
    await fetch(`${PC_API}/pedidos/${pedidoId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ total })
    }).catch(() => {})
  } catch (e) { /* silencioso -- el carrito local sigue funcionando aunque falle el respaldo */ }
}

// Restaura el carrito desde el borrador del servidor cuando el local está
// vacío (ej. sesión nueva en otro dispositivo). `pedidosCrudos` es la
// respuesta SIN filtrar de /auth/pedidos/{cliente_id} (incluye borradores).
async function pcRestaurarCarritoDeServidor(pedidosCrudos) {
  const borrador = (Array.isArray(pedidosCrudos) ? pedidosCrudos : [])
    .find(p => p.notas === PC_BORRADOR_MARCA)
  if (!borrador) return
  pc._borradorServerId = borrador.id
  if (pc.carrito.length) return // ya hay carrito local, no lo pisamos
  const items = borrador.pedido_items || []
  if (!items.length) return
  items.forEach(i => {
    const v = i.variantes
    if (!v || !v.id) return
    const prod = pc.productos.find(x => x.id === v.producto_id)
    pc.carrito.push({
      producto_id: v.producto_id, variante_id: v.id, nombre: v.productos?.nombre || i.nombre || 'Producto',
      sku: prod?.sku_interno || null, imagen: v.productos?.imagen_principal || null,
      talla: v.talla || i.talla, color: v.color || i.color, cantidad: i.cantidad,
      precio_unitario: i.precio_unitario || 0, es_corrida: !!i.es_corrida,
    })
  })
  try { localStorage.setItem(PC_CARRITO_KEY, JSON.stringify(pc.carrito)) } catch {}
}

// ── CARRITO / HACER PEDIDO ───────────────────────────────────
function renderCarrito(el) {
  el = el || document.getElementById('pc-content')
  if (!el) return
  // Recalcular precios desde datos vivos (corrige $0 de localStorage)
  if (pc.productos.length > 0) {
    const totalPares = pc.carrito.reduce((s, i) => s + i.cantidad, 0)
    pc.carrito.forEach(item => {
      const p = pc.productos.find(x => x.id === item.producto_id)
      if (!p) return
      if (item.es_corrida) {
        item.precio_unitario = precioCorrida(p)
      } else if (totalPares >= 6) {
        item.precio_unitario = precioM6(p)
      } else {
        item.precio_unitario = precioM3(p)
      }
    })
    pcGuardarCarrito()
  }
  const total = pc.carrito.reduce((s, i) => s + (i.precio_unitario * i.cantidad), 0)
  const totalPares = pc.carrito.reduce((s, i) => s + i.cantidad, 0)
  const credito = parseFloat(pc.clienteData?.credito_disponible || 0)

  if (pc.carrito.length === 0 && pc.borradores.length === 0) {
    el.innerHTML = `
      <div style="text-align:center;padding:60px 20px">
        <p style="font-size:3rem;margin:0 0 16px">🛒</p>
        <p style="font-size:1rem;font-weight:700;color:#a0a0c0;margin:0 0 8px">Tu pedido está vacío</p>
        <p style="color:#5a5a7a;font-size:0.83rem;margin:0 0 24px">Agrega productos desde el catálogo</p>
        <button onclick="pcIrA('catalogo')" class="pc-btn pc-btn-primary">Ver catálogo</button>
      </div>`
    return
  }

  el.innerHTML = `
    <div style="margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div>
        <h1 style="font-size:1.4rem;font-weight:800;color:#e2e2f0;margin:0 0 4px">Carrito</h1>
        <p style="font-size:0.83rem;color:#5a5a7a;margin:0">${totalPares} par${totalPares !== 1 ? 'es' : ''} · ${money(total)}</p>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${pc.carrito.length > 0 ? `
        <button onclick="pcGuardarBorrador()" class="pc-btn pc-btn-secondary" style="font-size:0.78rem">💾 Guardar borrador</button>
        <button onclick="pcIrA('catalogo')" class="pc-btn pc-btn-secondary" style="font-size:0.78rem">+ Agregar más</button>` : ''}
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr auto;gap:20px;align-items:start">

      <!-- Items del carrito -->
      <div>
        ${pc.carrito.length === 0 ? '' : (() => {
          const normales = pc.carrito.filter(i => !i.es_corrida)
          const corridas = pc.carrito.filter(i => i.es_corrida)
          // Agrupar corridas por producto+color
          const corridasAgrupadas = {}
          corridas.forEach(i => {
            const key = i.producto_id + '|' + i.color
            if (!corridasAgrupadas[key]) corridasAgrupadas[key] = { nombre: i.nombre, sku: i.sku, color: i.color, producto_id: i.producto_id, imagen: i.imagen || null, tallas: [], subtotal: 0, precio_unitario: i.precio_unitario }
            corridasAgrupadas[key].tallas.push({ talla: i.talla, cantidad: i.cantidad, variante_id: i.variante_id })
            corridasAgrupadas[key].subtotal += i.cantidad * i.precio_unitario
          })
          return `<div class="pc-card" style="margin-bottom:16px">
          ${normales.map((item) => {
            const idx = pc.carrito.indexOf(item)
            return `<div style="display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid #1e1e30">
              ${item.imagen ? `<img src="${esc(item.imagen)}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;background:#0c0c17;flex-shrink:0">` : '<div style="width:60px;height:60px;background:#0c0c17;border-radius:8px;flex-shrink:0"></div>'}
              <div style="flex:1;min-width:0">
                <p style="font-size:0.7rem;font-family:monospace;color:#5a5a7a;margin:0 0 2px">${esc(item.sku||'')}</p>
                <p style="font-size:0.88rem;font-weight:600;color:#c0c0e0;margin:0 0 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(item.nombre)}</p>
                <p style="font-size:0.78rem;color:#6a6a8a;margin:0">Talla ${esc(item.talla)} ${item.color ? '· '+esc(item.color) : ''} · ${item.cantidad} par${item.cantidad !== 1 ? 'es' : ''}</p>
              </div>
              <div style="text-align:right;flex-shrink:0">
                <p style="font-weight:700;color:#e2e2f0;margin:0 0 4px">${money(item.precio_unitario * item.cantidad)}</p>
                <p style="font-size:0.72rem;color:#5a5a7a;margin:0">${money(item.precio_unitario)} c/u</p>
                <button onclick="pcQuitarDelCarrito(${idx})" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:0.72rem;padding:2px 0;margin-top:4px">✕ quitar</button>
              </div>
            </div>`
          }).join('')}
          ${Object.entries(corridasAgrupadas).map(([key, corrida]) => `
          <div style="padding:12px 0;border-bottom:1px solid #1e1e30;background:rgba(107,27,154,0.06);border-radius:8px;padding:12px;margin-bottom:4px">
            <div style="display:flex;gap:10px;align-items:flex-start">
              ${corrida.imagen ? `<img src="${esc(corrida.imagen)}" style="width:52px;height:52px;object-fit:cover;border-radius:8px;background:#0c0c17;flex-shrink:0">` : '<div style="width:52px;height:52px;background:#0c0c17;border-radius:8px;flex-shrink:0"></div>'}
              <div style="flex:1;min-width:0">
                <div style="display:flex;justify-content:space-between;align-items:flex-start">
                  <div style="flex:1;min-width:0">
                    <p style="font-size:0.7rem;font-family:monospace;color:#5a5a7a;margin:0 0 2px">${esc(corrida.sku||'')}</p>
                    <p style="font-size:0.88rem;font-weight:700;color:#c0c0e0;margin:0 0 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(corrida.nombre)}</p>
                    <p style="font-size:0.75rem;color:#a855f7;font-weight:600;margin:0 0 6px">📦 Corrida · ${esc(corrida.color)}</p>
                    <div style="display:flex;flex-wrap:wrap;gap:4px">
                      ${corrida.tallas.map(t => `<span style="background:rgba(168,85,247,0.15);border:1px solid rgba(168,85,247,0.3);border-radius:100px;padding:2px 8px;font-size:0.7rem;color:#a855f7">T${esc(t.talla)} ×${t.cantidad}</span>`).join('')}
                    </div>
                  </div>
                  <button onclick="pcQuitarCorrida('${key}')" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:1rem;padding:0 4px;flex-shrink:0">✕</button>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
                  <span style="font-size:0.75rem;color:#6a6a8a">${corrida.tallas.reduce((s,t)=>s+t.cantidad,0)} pares · ${money(corrida.precio_unitario)} c/u</span>
                  <span style="font-weight:700;color:#a855f7">${money(corrida.subtotal)}</span>
                </div>
              </div>
            </div>
          </div>`).join('')}
        </div>`
        })()}

        <!-- Borradores guardados -->
        ${pc.borradores.length > 0 ? `
        <div class="pc-card">
          <p style="font-weight:700;color:#a0a0c0;margin:0 0 14px;font-size:0.88rem">📋 Borradores guardados</p>
          ${pc.borradores.map((b, idx) => `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #1e1e30;gap:12px">
              <div>
                <p style="font-size:0.83rem;font-weight:600;color:#c0c0e0;margin:0 0 2px">${esc(b.nombre)}</p>
                <p style="font-size:0.72rem;color:#5a5a7a;margin:0">${b.items?.length || 0} producto${(b.items?.length||0) !== 1 ? 's' : ''} · ${money(b.total)}</p>
              </div>
              <div style="display:flex;gap:6px">
                <button onclick="pcCargarBorrador(${idx})" class="pc-btn pc-btn-secondary" style="padding:6px 12px;font-size:0.75rem">Cargar</button>
                <button onclick="pcBorrarBorrador(${idx})" style="background:none;border:none;color:#5a5a7a;cursor:pointer;font-size:0.78rem">✕</button>
              </div>
            </div>`).join('')}
        </div>` : ''}
      </div>

      <!-- Resumen del pedido -->
      ${pc.carrito.length > 0 ? `
      <div class="pc-card" style="min-width:240px;position:sticky;top:20px">
        <p style="font-weight:700;color:#e2e2f0;margin:0 0 16px">Resumen</p>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <span style="color:#6a6a8a;font-size:0.83rem">${totalPares} pares</span>
          <span style="color:#e2e2f0;font-size:0.83rem">${money(total)}</span>
        </div>
        ${credito > 0 ? `
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <span style="color:#10b981;font-size:0.83rem">Crédito</span>
          <span style="color:#10b981;font-size:0.83rem">-${money(credito)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:16px;padding-top:8px;border-top:1px solid #1e1e30">
          <span style="font-weight:700;color:#e2e2f0">Total</span>
          <span style="font-weight:700;color:#E91E8C">${money(Math.max(0, total - credito))}</span>
        </div>` : `
        <div style="display:flex;justify-content:space-between;margin-bottom:16px;padding-top:8px;border-top:1px solid #1e1e30">
          <span style="font-weight:700;color:#e2e2f0">Total</span>
          <span style="font-weight:700;color:#E91E8C">${money(total)}</span>
        </div>`}
        ${(() => {
          const dir = (pc.clienteData?.direccion || '').trim()
          if (dir) {
            return `<div style="margin-bottom:12px;padding:10px 12px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);border-radius:8px">
              <p style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#10b981;margin:0 0 4px">📍 Se envía a</p>
              <p style="font-size:0.8rem;color:#c0c0e0;margin:0">${esc(dir)}${pc.clienteData?.codigo_postal ? ', CP '+esc(pc.clienteData.codigo_postal) : ''}${pc.clienteData?.ciudad ? ', '+esc(pc.clienteData.ciudad) : ''}</p>
              <button onclick="pcIrA('cuenta')" style="background:none;border:none;color:#5a5a7a;font-size:0.72rem;cursor:pointer;padding:4px 0 0;text-decoration:underline">Cambiar dirección</button>
            </div>`
          }
          return `<div style="margin-bottom:12px;padding:10px 12px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.25);border-radius:8px">
            <p style="font-size:0.8rem;color:#f87171;font-weight:600;margin:0 0 4px">⚠️ Falta tu dirección de envío</p>
            <button onclick="pcIrA('cuenta')" class="pc-btn pc-btn-secondary" style="font-size:0.78rem;padding:6px 12px">Agregar dirección</button>
          </div>`
        })()}
        <div style="margin-bottom:12px">
          <label style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#5a5a7a;display:block;margin-bottom:6px">Notas del pedido</label>
          <textarea id="pc-notas" class="pc-input" style="height:70px;resize:none" placeholder="Color específico, urgencia, instrucciones..."></textarea>
        </div>
        <button onclick="pcHacerPedido()" class="pc-btn pc-btn-primary" style="width:100%;margin-bottom:8px" ${(pc.clienteData?.direccion || '').trim() ? '' : 'disabled'}>
          Enviar pedido →
        </button>
        <button onclick="if(confirm('¿Vaciar el carrito?'))pcVaciarCarrito()" class="pc-btn pc-btn-secondary" style="width:100%;font-size:0.78rem">
          Vaciar carrito
        </button>
        <p id="pc-pedido-err" style="color:#ef4444;font-size:0.78rem;margin-top:8px;display:none"></p>
      </div>` : ''}
    </div>
  `
}

window.pcDescargarCatalogoPorCategoria = async function(cat, label) {
  const msg = document.getElementById('pc-cat-msg-' + cat)
  const card = document.getElementById('pc-cat-card-' + cat)
  const btns = card ? card.querySelectorAll('button') : []
  btns.forEach(b => b.disabled = true)
  if (msg) { msg.style.display = 'block'; msg.textContent = `⏳ Cargando productos...` }

  try {
    const productos = pc.productos.filter(p => p.categoria === cat && p.activo !== false)
    const variantes = pc.variantes

    if (!productos.length) {
      if (msg) msg.textContent = `Sin productos activos en ${label}`
      setTimeout(() => { if (msg) msg.style.display = 'none' }, 3000)
      btns.forEach(b => b.disabled = false)
      return
    }

    // Extrae el código del modelo desde el nombre, ej. "Jv160 Flats con tacon..." → "JV160"
    const _codigoModelo = (nombre) => {
      const m = (nombre || '').trim().match(/^([A-Za-z]+\d+)/)
      return m ? m[1].toUpperCase() : (nombre || '').trim().split(/\s+/)[0]?.toUpperCase() || 'S/C'
    }

    const items = []
    productos.forEach(p => {
      const codigo = _codigoModelo(p.nombre)
      const productVars = variantes.filter(v => v.producto_id === p.id && v.activa !== false)
      const colorsSeen = new Set()

      productVars.forEach(v => {
        if (!v.color || colorsSeen.has(v.color.trim().toUpperCase())) return
        colorsSeen.add(v.color.trim().toUpperCase())
        const imgUrl = v.foto_url || p.imagen_principal
        if (imgUrl) items.push({ sku: codigo, color: v.color.trim().toUpperCase(), imgUrl })
      })

      if (colorsSeen.size === 0 && p.imagen_principal) {
        items.push({ sku: codigo, color: 'ÚNICO', imgUrl: p.imagen_principal })
      }
    })

    if (!items.length) {
      if (msg) msg.textContent = `Sin fotos disponibles para ${label}`
      setTimeout(() => { if (msg) msg.style.display = 'none' }, 3000)
      btns.forEach(b => b.disabled = false)
      return
    }

    if (msg) msg.textContent = `✏️ Generando catálogo PDF (${items.length} variantes)...`

    if (!window.jspdf) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script')
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
        s.onload = resolve; s.onerror = reject
        document.head.appendChild(s)
      })
    }
    const { jsPDF } = window.jspdf

    const cols = 2, rows = 3
    const itemsPerPage = cols * rows
    const pageW = 1080, pageH = 1440
    const marginX = 40, marginY = 80, gapX = 24, gapY = 32
    const cellW = (pageW - marginX * 2 - gapX * (cols - 1)) / cols
    const cellH = (pageH - marginY * 2 - gapY * (rows - 1)) / rows
    const imgH = cellH - 50

    const _cargarImg = url => new Promise(resolve => {
      if (!url) return resolve(null)
      const img = new Image(); img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = () => resolve(null)
      img.src = url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now()
    })

    const _drawContain = (ctx, img, x, y, w, h) => {
      ctx.save()
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(x, y, w, h)
      if (img) {
        ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip()
        const ir = img.naturalWidth / img.naturalHeight, cr = w / h
        let dx, dy, dw, dh
        if (ir > cr) { dw = w; dh = w / ir; dx = x; dy = y + (h - dh) / 2 }
        else          { dh = h; dw = h * ir; dy = y; dx = x + (w - dw) / 2 }
        ctx.drawImage(img, dx, dy, dw, dh)
      } else {
        ctx.fillStyle = '#F3F4F6'; ctx.fillRect(x, y, w, h)
        ctx.fillStyle = '#9CA3AF'; ctx.font = '20px sans-serif'; ctx.textAlign = 'center'
        ctx.fillText('Sin imagen', x + w / 2, y + h / 2)
      }
      ctx.restore()
    }

    const pages = []
    for (let i = 0; i < items.length; i += itemsPerPage) pages.push(items.slice(i, i + itemsPerPage))

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [pageW, pageH] })
    let primeraPagina = true
    const catLabelClean = label.replace(/^[^\s]+\s/, '').toUpperCase()

    for (let pIdx = 0; pIdx < pages.length; pIdx++) {
      if (msg) msg.textContent = `✏️ Generando página ${pIdx + 1} de ${pages.length}...`
      const pageItems = pages[pIdx]

      const canvas = document.createElement('canvas')
      canvas.width = pageW; canvas.height = pageH
      const ctx = canvas.getContext('2d')

      ctx.fillStyle = '#FAFAF8'; ctx.fillRect(0, 0, pageW, pageH)

      ctx.fillStyle = '#2A1A0E'
      ctx.font = '300 20px sans-serif'
      ctx.textAlign = 'center'
      ctx.letterSpacing = '4px'
      ctx.fillText(`CATÁLOGO DE ${catLabelClean}`, pageW / 2, 38)
      ctx.letterSpacing = '0px'

      ctx.fillStyle = '#C8967A'
      ctx.fillRect(marginX, 48, pageW - marginX * 2, 1.5)

      for (let cellIdx = 0; cellIdx < pageItems.length; cellIdx++) {
        const item = pageItems[cellIdx]
        const colIdx = cellIdx % cols
        const rowIdx = Math.floor(cellIdx / cols)
        const cellX = marginX + colIdx * (cellW + gapX)
        const cellY = marginY + rowIdx * (cellH + gapY)

        const img = await _cargarImg(item.imgUrl)
        _drawContain(ctx, img, cellX, cellY, cellW, imgH)

        ctx.fillStyle = '#E8DDD5'; ctx.fillRect(cellX, cellY + imgH, cellW, 1)

        ctx.fillStyle = '#2A1A0E'; ctx.textAlign = 'center'
        ctx.font = '600 18px sans-serif'
        ctx.fillText(`${item.sku} ${item.color}`, cellX + cellW / 2, cellY + imgH + 28)
      }

      ctx.fillStyle = '#C8967A'
      ctx.fillRect(marginX, pageH - 48, pageW - marginX * 2, 1)

      ctx.fillStyle = '#A07860'
      ctx.font = '300 14px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`Página ${pIdx + 1} de ${pages.length}`, pageW / 2, pageH - 30)

      const dataUrl = canvas.toDataURL('image/jpeg', 0.90)
      if (!primeraPagina) pdf.addPage([pageW, pageH])
      pdf.addImage(dataUrl, 'JPEG', 0, 0, pageW, pageH)
      primeraPagina = false
    }

    const nombreArchivo = `catalogo_${cat}_${new Date().toISOString().slice(0,10)}.pdf`
    pdf.save(nombreArchivo)
    if (msg) { msg.textContent = `✅ Descargado!`; setTimeout(() => { msg.style.display = 'none' }, 4000) }

  } catch(e) {
    console.error(e)
    if (msg) msg.textContent = 'Error generando el PDF: ' + e.message
  } finally {
    btns.forEach(b => b.disabled = false)
  }
}

window.pcQuitarDelCarrito = function(idx) {
  pc.carrito.splice(idx, 1)
  pcGuardarCarrito()
  renderCarrito()
}

window.pcQuitarCorrida = function(key) {
  const [productoId, color] = key.split('|')
  pc.carrito = pc.carrito.filter(i => !(i.es_corrida && i.producto_id === productoId && i.color === color))
  pcGuardarCarrito()
  renderCarrito()
}

window.pcGuardarBorrador = function() {
  const nombre = prompt('Nombre para este borrador (ej. "Pedido tacones julio"):')
  if (!nombre) return
  const total = pc.carrito.reduce((s, i) => s + (i.precio_unitario * i.cantidad), 0)
  pc.borradores.unshift({ nombre, items: [...pc.carrito], total, fecha: new Date().toISOString() })
  try { localStorage.setItem('pc_borradores', JSON.stringify(pc.borradores)) } catch {}
  renderCarrito()
}

window.pcCargarBorrador = function(idx) {
  if (!confirm('¿Cargar este borrador? Reemplazará el carrito actual.')) return
  pc.carrito = [...(pc.borradores[idx]?.items || [])]
  pcGuardarCarrito()
  renderCarrito()
}

window.pcBorrarBorrador = function(idx) {
  pc.borradores.splice(idx, 1)
  try { localStorage.setItem('pc_borradores', JSON.stringify(pc.borradores)) } catch {}
  renderCarrito()
}

window.pcHacerPedido = async function() {
  const notas = document.getElementById('pc-notas')?.value?.trim() || ''
  const errEl = document.getElementById('pc-pedido-err')
  if (pc.carrito.length === 0) return
  if (!pc.sesion?.cliente_id) { if (errEl) { errEl.textContent = 'Sin sesión activa'; errEl.style.display = 'block' } return }
  const direccion = (pc.clienteData?.direccion || '').trim()
  if (!direccion) {
    if (errEl) { errEl.textContent = 'Agrega tu dirección de envío en Mi cuenta antes de enviar el pedido'; errEl.style.display = 'block' }
    return
  }
  const direccionEnvio = `${direccion}${pc.clienteData?.codigo_postal ? ', CP '+pc.clienteData.codigo_postal : ''}${pc.clienteData?.ciudad ? ', '+pc.clienteData.ciudad : ''}${pc.clienteData?.estado ? ', '+pc.clienteData.estado : ''}`

  const total = pc.carrito.reduce((s, i) => s + (i.precio_unitario * i.cantidad), 0)
  const descripcion = pc.carrito.map(i => `${i.sku} T${i.talla}${i.color ? ' '+i.color : ''} x${i.cantidad}`).join(', ')

  const btn = document.querySelector('[onclick="pcHacerPedido()"]')
  if (btn) { btn.textContent = 'Enviando...'; btn.disabled = true }

  try {
    const res = await fetch(`${PC_API}/pedidos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cliente_id: pc.sesion.cliente_id,
        total,
        status: 'pendiente_pago',
        canal: 'portal_mayoreo',
        descripcion,
        notas_cliente: notas,
        direccion_envio: direccionEnvio,
        items: pc.carrito.map(i => ({
          producto_id: i.producto_id,
          talla: i.talla,
          color: i.color,
          cantidad: i.cantidad,
          precio_unitario: i.precio_unitario,
        }))
      })
    })
    if (res.ok) {
      pc.carrito = []
      pcGuardarCarrito()
      // Recargar pedidos (filtrando el borrador que respaldaba el carrito)
      if (pc.sesion?.cliente_id) {
        const rp = await fetch(`${PC_API}/auth/pedidos/${pc.sesion.cliente_id}`)
        if (rp.ok) {
          const todos = await rp.json()
          pc.pedidos = Array.isArray(todos) ? todos.filter(p => p.notas !== PC_BORRADOR_MARCA) : todos
        }
      }
      pcMostrarExito('¡Pedido enviado! Te contactaremos para coordinar el pago y envío.')
      pcIrA('pedidos')
    } else {
      const d = await res.json()
      if (errEl) { errEl.textContent = d.error || 'Error al enviar el pedido'; errEl.style.display = 'block' }
      if (btn) { btn.textContent = 'Enviar pedido →'; btn.disabled = false }
    }
  } catch(e) {
    if (errEl) { errEl.textContent = 'Error conectando con el servidor'; errEl.style.display = 'block' }
    if (btn) { btn.textContent = 'Enviar pedido →'; btn.disabled = false }
  }
}

function pcMostrarExito(msg) {
  const toast = document.createElement('div')
  toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#10b981;color:white;padding:12px 24px;border-radius:10px;font-size:0.88rem;font-weight:600;z-index:99999;box-shadow:0 8px 24px rgba(0,0,0,0.3)'
  toast.textContent = msg
  document.body.appendChild(toast)
  setTimeout(() => toast.remove(), 4000)
}
window.pcMostrarExito = pcMostrarExito

window.pcInvitarWhatsapp = function(codigo, link, bono) {
  const nombre = (pc.sesion?.nombre || '').split(' ')[0] || 'Un cliente de Zapatillas May'
  const mensaje = `Hola! Te comparto mi código para el portal de mayoreo de Zapatillas May 👟\n\nCon él, tú y yo ganamos ${bono} de crédito en nuestro siguiente pedido.\n\n📌 Código: ${codigo}\n🔗 Regístrate aquí: ${link}`
  window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`, '_blank')
}

// ── MIS PEDIDOS ──────────────────────────────────────────────
function renderMisPedidos(el) {
  el = el || document.getElementById('pc-content')
  if (!el) return
  const pedidos = [...(pc.pedidos || [])].sort((a,b) => new Date(b.created_at) - new Date(a.created_at))

  el.innerHTML = `
    <div style="margin-bottom:24px">
      <h1 style="font-size:1.4rem;font-weight:800;color:#e2e2f0;margin:0 0 4px">Mis pedidos</h1>
      <p style="font-size:0.83rem;color:#5a5a7a;margin:0">${pedidos.length} pedido${pedidos.length !== 1 ? 's' : ''} en total</p>
    </div>

    ${pedidos.length === 0 ? `
    <div style="text-align:center;padding:60px;color:#5a5a7a">
      <p style="font-size:2rem;margin:0 0 12px">📦</p>
      <p style="color:#a0a0c0;font-weight:600;margin:0 0 8px">Sin pedidos aún</p>
      <button onclick="pcIrA('catalogo')" class="pc-btn pc-btn-primary" style="margin-top:16px">Ver catálogo</button>
    </div>` : pedidos.map(p => pcPedidoDetalle(p)).join('')}
  `
}

const STATUS_STEPS = ['pendiente_pago','pagado','preparando','enviado','entregado']
const STATUS_LABELS = { pendiente_pago:'Pendiente de pago', pagado:'Pago confirmado', preparando:'Preparando', enviado:'En camino', entregado:'Entregado', cancelado:'Cancelado' }
const STATUS_ICONS  = { pendiente_pago:'⏳', pagado:'✅', preparando:'📦', enviado:'🚚', entregado:'🎉', cancelado:'❌' }

function pcPedidoDetalle(p) {
  const statusColors = { pendiente_pago:'#f59e0b', pagado:'#10b981', preparando:'#3b82f6', enviado:'#8b5cf6', entregado:'#10b981', cancelado:'#ef4444' }
  const color = statusColors[p.status] || '#6b7280'
  const stepIdx = STATUS_STEPS.indexOf(p.status)
  const items = p.pedido_items || []

  return `
    <div class="pc-card" style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;margin-bottom:16px">
        <div>
          <p style="font-size:0.72rem;font-family:monospace;color:#5a5a7a;margin:0 0 2px">#${(p.id||'').substring(0,8).toUpperCase()}</p>
          <p style="font-size:0.83rem;color:#6a6a8a;margin:0">${new Date(p.created_at).toLocaleDateString('es-MX',{day:'2-digit',month:'long',year:'numeric'})}</p>
        </div>
        <div style="text-align:right">
          <span class="pc-status-chip" style="background:${color}20;color:${color}">${STATUS_ICONS[p.status]||''} ${STATUS_LABELS[p.status]||p.status}</span>
          <p style="font-size:1.1rem;font-weight:800;color:#e2e2f0;margin:6px 0 0">${money(p.total)}</p>
        </div>
      </div>

      <!-- Timeline -->
      ${p.status !== 'cancelado' ? `
      <div style="display:flex;align-items:center;margin-bottom:20px;overflow-x:auto;padding:4px 0">
        ${STATUS_STEPS.map((s, i) => {
          const done = i <= stepIdx
          const c = done ? '#E91E8C' : '#2a2a40'
          return `
            <div style="display:flex;align-items:center;flex-shrink:0">
              <div style="text-align:center;min-width:70px">
                <div style="width:28px;height:28px;border-radius:50%;background:${done ? 'rgba(233,30,140,0.15)' : '#0f0f1c'};border:2px solid ${c};display:flex;align-items:center;justify-content:center;margin:0 auto 5px;font-size:0.75rem">${done ? '✓' : ''}</div>
                <p style="font-size:0.6rem;color:${done ? '#E91E8C' : '#3a3a5c'};margin:0;white-space:nowrap">${STATUS_LABELS[s]||s}</p>
              </div>
              ${i < STATUS_STEPS.length - 1 ? `<div style="flex:1;height:2px;background:${i < stepIdx ? '#E91E8C' : '#1e1e30'};min-width:20px;margin:0 2px;margin-bottom:18px"></div>` : ''}
            </div>`
        }).join('')}
      </div>` : ''}

      <!-- Tracking -->
      ${p.numero_guia || p.tracking_url ? `
      <div style="background:rgba(139,92,246,0.08);border:1px solid rgba(139,92,246,0.2);border-radius:8px;padding:12px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
        <div>
          <p style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#8b5cf6;margin:0 0 2px">${p.paqueteria || 'Paquetería'}</p>
          <p style="font-size:0.85rem;font-family:monospace;color:#c0c0e0;margin:0">${p.numero_guia || ''}</p>
        </div>
        ${p.tracking_url ? `<a href="${esc(p.tracking_url)}" target="_blank" class="pc-btn pc-btn-primary" style="font-size:0.78rem;padding:8px 16px;text-decoration:none">🔍 Rastrear envío</a>` : ''}
      </div>` : ''}

      <!-- Items -->
      ${items.length > 0 ? `
      <div style="border-top:1px solid #1e1e30;padding-top:12px">
        ${items.map(i => `
          <div style="display:flex;align-items:center;gap:12px;padding:8px 0">
            ${i.variantes?.productos?.imagen_principal ? `<img src="${esc(i.variantes.productos.imagen_principal)}" style="width:44px;height:44px;object-fit:cover;border-radius:6px;background:#0c0c17;flex-shrink:0">` : ''}
            <div style="flex:1;min-width:0">
              <p style="font-size:0.83rem;font-weight:500;color:#c0c0e0;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(i.variantes?.productos?.nombre || 'Producto')}</p>
              <p style="font-size:0.72rem;color:#5a5a7a;margin:0">Talla ${esc(i.variantes?.talla||'')} · ${i.cantidad} par${i.cantidad !== 1 ? 'es' : ''}</p>
            </div>
            <p style="font-weight:700;color:#e2e2f0;margin:0;flex-shrink:0">${money((i.precio_unitario||0)*i.cantidad)}</p>
          </div>`).join('')}
      </div>` : ''}
      ${items.length > 0 ? `
      <button onclick="pcReordenar('${p.id}')" class="pc-btn pc-btn-secondary" style="width:100%;margin-top:14px;font-size:0.82rem">🔁 Pedir de nuevo</button>` : ''}
    </div>`
}

window.pcReordenar = function(pedidoId) {
  const p = (pc.pedidos || []).find(x => x.id === pedidoId)
  if (!p) return
  const items = p.pedido_items || []
  let agregados = 0
  const avisos = []
  items.forEach(i => {
    const v = i.variantes
    if (!v || !v.id) return
    const stockReal = pc.inventario.filter(x => x.variante_id === v.id).reduce((s,x) => s + (x.cantidad||0), 0)
    const nombreProd = v.productos?.nombre || 'Producto'
    const etiqueta = `${nombreProd} T${v.talla||''}`
    const cantidad = Math.min(i.cantidad, stockReal)
    if (cantidad <= 0) { avisos.push(`${etiqueta}: sin existencia`); return }
    if (cantidad < i.cantidad) avisos.push(`${etiqueta}: solo ${cantidad} de ${i.cantidad}`)
    const existente = pc.carrito.find(c => c.variante_id === v.id && !c.es_corrida)
    if (existente) {
      existente.cantidad += cantidad
    } else {
      const prod = pc.productos.find(x => x.id === v.producto_id)
      pc.carrito.push({
        producto_id: v.producto_id, variante_id: v.id, nombre: nombreProd,
        sku: prod?.sku_interno || null, imagen: v.productos?.imagen_principal || null,
        talla: v.talla, color: v.color, cantidad, precio_unitario: i.precio_unitario || 0, es_corrida: false,
      })
    }
    agregados++
  })
  pcGuardarCarrito()
  if (agregados === 0) {
    pcMostrarExito('Ninguno de esos productos tiene existencia ahora mismo 😔')
    return
  }
  pcMostrarExito(avisos.length ? `Agregado al carrito — revisa: ${avisos.join(', ')}` : '✅ Pedido agregado a tu carrito')
  pcIrA('carrito')
}

// ── SUGERENCIAS ──────────────────────────────────────────────
function renderSugerencias(el) {
  el = el || document.getElementById('pc-content')
  if (!el) return

  el.innerHTML = `
    <div style="margin-bottom:24px">
      <h1 style="font-size:1.4rem;font-weight:800;color:#e2e2f0;margin:0 0 4px">💡 Sugerencias</h1>
      <p style="font-size:0.83rem;color:#5a5a7a;margin:0">¿Te gustaría alguna función nueva, una mejora o tienes alguna recomendación? Cuéntanos.</p>
    </div>

    <div class="pc-card" style="margin-bottom:16px">
      <label style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#5a5a7a;display:block;margin-bottom:8px">Tipo</label>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px" id="pc-sug-tipos">
        ${[['sugerencia','💡 Sugerencia'],['funcion','✨ Función nueva'],['problema','⚠️ Problema/Error'],['otro','💬 Otro']].map(([v,l], i) => `
          <button type="button" data-tipo="${v}" onclick="pcSeleccionarTipoSugerencia('${v}')" class="pc-btn ${i===0?'pc-btn-primary':'pc-btn-secondary'}" style="padding:8px 14px;font-size:0.78rem">${l}</button>
        `).join('')}
      </div>
      <label style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#5a5a7a;display:block;margin-bottom:8px">Tu mensaje</label>
      <textarea id="pc-sug-mensaje" class="pc-input" style="height:120px;resize:none" placeholder="Escribe aquí tu idea, recomendación o lo que te gustaría que mejoráramos..."></textarea>
      <button onclick="pcEnviarSugerencia()" id="pc-sug-btn" class="pc-btn pc-btn-primary" style="width:100%;margin-top:14px">Enviar sugerencia</button>
      <p id="pc-sug-msg" style="font-size:0.78rem;margin-top:10px;display:none"></p>
    </div>
  `
  window._pcTipoSugerencia = 'sugerencia'
}

window.pcSeleccionarTipoSugerencia = function(tipo) {
  window._pcTipoSugerencia = tipo
  document.querySelectorAll('#pc-sug-tipos button').forEach(b => {
    const activo = b.dataset.tipo === tipo
    b.classList.toggle('pc-btn-primary', activo)
    b.classList.toggle('pc-btn-secondary', !activo)
  })
}

window.pcEnviarSugerencia = async function() {
  const mensaje = (document.getElementById('pc-sug-mensaje').value || '').trim()
  const msgEl = document.getElementById('pc-sug-msg')
  if (!mensaje) {
    msgEl.style.display = 'block'; msgEl.style.color = '#ef4444'; msgEl.textContent = 'Escribe tu mensaje antes de enviar.'
    return
  }
  const btn = document.getElementById('pc-sug-btn')
  btn.disabled = true; btn.textContent = 'Enviando...'
  try {
    const res = await fetch(`${PC_API}/sugerencias/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cliente_id: pc.sesion?.cliente_id || null,
        nombre_cliente: pc.sesion?.nombre || '',
        tipo: window._pcTipoSugerencia || 'sugerencia',
        mensaje
      })
    })
    if (res.ok) {
      document.getElementById('pc-sug-mensaje').value = ''
      msgEl.style.display = 'block'; msgEl.style.color = '#10b981'; msgEl.textContent = '¡Gracias! Ya recibimos tu mensaje.'
      pcMostrarExito('¡Sugerencia enviada!')
    } else {
      msgEl.style.display = 'block'; msgEl.style.color = '#ef4444'; msgEl.textContent = 'No se pudo enviar, intenta de nuevo.'
    }
  } catch (e) {
    msgEl.style.display = 'block'; msgEl.style.color = '#ef4444'; msgEl.textContent = 'Error de conexión.'
  } finally {
    btn.disabled = false; btn.textContent = 'Enviar sugerencia'
  }
}

// ── MI CUENTA ────────────────────────────────────────────────
function renderMiCuenta(el) {
  el = el || document.getElementById('pc-content')
  if (!el) return
  const c = pc.clienteData || {}
  const s = pc.sesion || {}

  el.innerHTML = `
    <div style="margin-bottom:24px">
      <h1 style="font-size:1.4rem;font-weight:800;color:#e2e2f0;margin:0 0 4px">Mi cuenta</h1>
      <p style="font-size:0.83rem;color:#5a5a7a;margin:0">${esc(s.email||'')}</p>
    </div>

    <div class="pc-card" style="margin-bottom:14px">
      <p style="font-weight:700;color:#e2e2f0;margin:0 0 16px">Datos de contacto</p>
      <div style="display:grid;gap:12px">
        <div>
          <label style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#5a5a7a;display:block;margin-bottom:5px">Nombre</label>
          <input id="mc-nombre" class="pc-input" value="${esc(s.nombre||c.nombre||'')}">
        </div>
        <div>
          <label style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#5a5a7a;display:block;margin-bottom:5px">Teléfono</label>
          <input id="mc-tel" class="pc-input" type="tel" value="${esc(c.telefono||'')}">
        </div>
        <div>
          <label style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#5a5a7a;display:block;margin-bottom:5px">Ciudad / Estado</label>
          <input id="mc-ciudad" class="pc-input" placeholder="ej. Guadalajara, Jalisco" value="${esc((c.ciudad||'') + (c.estado ? ', '+c.estado : ''))}">
        </div>
      </div>
      <button onclick="pcGuardarCuenta()" class="pc-btn pc-btn-primary" style="margin-top:16px">Guardar cambios</button>
      <p id="mc-msg" style="font-size:0.78rem;margin-top:8px;display:none"></p>
    </div>

    <div class="pc-card" style="margin-bottom:14px">
      <p style="font-weight:700;color:#e2e2f0;margin:0 0 4px">Dirección de envío</p>
      <p style="font-size:0.78rem;color:#5a5a7a;margin:0 0 16px">Se usa para armar tus pedidos del portal — sin esto el negocio no sabe a dónde enviar.</p>
      <div style="display:grid;gap:12px">
        <div>
          <label style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#5a5a7a;display:block;margin-bottom:5px">Calle, número y colonia</label>
          <textarea id="mc-direccion" class="pc-input" style="height:60px;resize:none" placeholder="Ej. Av. Hidalgo 123, Col. Centro">${esc(c.direccion||'')}</textarea>
        </div>
        <div>
          <label style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#5a5a7a;display:block;margin-bottom:5px">Código postal</label>
          <input id="mc-cp" class="pc-input" inputmode="numeric" maxlength="5" value="${esc(c.codigo_postal||'')}">
        </div>
      </div>
      <button onclick="pcGuardarDireccion()" class="pc-btn pc-btn-primary" style="margin-top:16px">Guardar dirección</button>
      <p id="mc-dir-msg" style="font-size:0.78rem;margin-top:8px;display:none"></p>
    </div>

    <div class="pc-card">
      <p style="font-weight:700;color:#e2e2f0;margin:0 0 16px">Cambiar contraseña</p>
      <div style="display:grid;gap:12px">
        <input type="password" id="mc-pass-actual" class="pc-input" placeholder="Contraseña actual">
        <input type="password" id="mc-pass-nueva" class="pc-input" placeholder="Nueva contraseña (mín. 6 caracteres)">
      </div>
      <button onclick="pcCambiarPass()" class="pc-btn pc-btn-secondary" style="margin-top:14px">Actualizar contraseña</button>
      <p id="mc-pass-msg" style="font-size:0.78rem;margin-top:8px;display:none"></p>
    </div>
  `
  window.pcGuardarCuenta = async function() {
    const msg = document.getElementById('mc-msg')
    const datos = { telefono: document.getElementById('mc-tel').value }
    const ciudadVal = document.getElementById('mc-ciudad').value.split(',')
    if (ciudadVal.length >= 2) { datos.ciudad = ciudadVal[0].trim(); datos.estado = ciudadVal.slice(1).join(',').trim() }
    try {
      const res = await fetch(`${PC_API}/clientes/${pc.sesion.cliente_id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(datos) })
      msg.textContent = res.ok ? '✅ Guardado correctamente' : '❌ Error al guardar'
      msg.style.color = res.ok ? '#10b981' : '#ef4444'
      if (res.ok) pc.clienteData = Object.assign(pc.clienteData || {}, datos)
    } catch { msg.textContent = 'Error de conexión'; msg.style.color = '#ef4444' }
    msg.style.display = 'block'
  }
  window.pcGuardarDireccion = async function() {
    const msg = document.getElementById('mc-dir-msg')
    const datos = {
      direccion: document.getElementById('mc-direccion').value.trim(),
      codigo_postal: document.getElementById('mc-cp').value.trim(),
    }
    try {
      const res = await fetch(`${PC_API}/clientes/${pc.sesion.cliente_id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(datos) })
      msg.textContent = res.ok ? '✅ Dirección guardada' : '❌ Error al guardar'
      msg.style.color = res.ok ? '#10b981' : '#ef4444'
      if (res.ok) pc.clienteData = Object.assign(pc.clienteData || {}, datos)
    } catch { msg.textContent = 'Error de conexión'; msg.style.color = '#ef4444' }
    msg.style.display = 'block'
  }
  window.pcCambiarPass = async function() {
    const msg = document.getElementById('mc-pass-msg')
    const actual = document.getElementById('mc-pass-actual').value
    const nueva = document.getElementById('mc-pass-nueva').value
    if (!actual || !nueva) { msg.textContent = 'Completa ambos campos'; msg.style.color = '#ef4444'; msg.style.display = 'block'; return }
    try {
      const res = await fetch(`${PC_API}/auth/cambiar-password`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ usuario_id: pc.sesion.id, password_actual: actual, password_nueva: nueva }) })
      const d = await res.json()
      msg.textContent = res.ok ? '✅ Contraseña actualizada' : '❌ ' + (d.error || 'Error')
      msg.style.color = res.ok ? '#10b981' : '#ef4444'
    } catch { msg.textContent = 'Error de conexión'; msg.style.color = '#ef4444' }
    msg.style.display = 'block'
  }
}

// ── CERRAR SESIÓN ────────────────────────────────────────────
function pcCerrarSesion() {
  if (!confirm('¿Cerrar sesión?')) return
  localStorage.removeItem('erp_empleado')
  localStorage.removeItem('erp_token')
  localStorage.removeItem('pc_sesion')
  localStorage.removeItem(PC_CARRITO_KEY)
  pc.sesion = null
  window.location.reload()
}
