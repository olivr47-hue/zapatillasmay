// ─────────────────────────────────────────────────────────────
//  Portal de cliente mayoreo — integrado en el panel
//  Se carga cuando el login detecta un cliente (tipo = zapateria)
// ─────────────────────────────────────────────────────────────

const PC_API        = '/api'
const PC_SESION_KEY = 'pc_sesion'
const PC_CARRITO_KEY = 'pc_carrito'
const TALLAS_ORDEN  = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Unica']

const money = (n) => '$' + Math.round(parseFloat(n) || 0).toLocaleString('es-MX')
const esc   = (s) => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')

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
  borradores: [],
}

function pcAuthHeaders() {
  const token = sessionStorage.getItem('erp_token')
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
        ${pcNavItem('catalogo', '👟', 'Catálogo')}
        ${pcNavItem('carrito',  '🛒', 'Hacer pedido')}
        ${pcNavItem('pedidos',  '📦', 'Mis pedidos')}
        ${pcNavItem('referidos','🎁', 'Referidos')}
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
    }
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
  window.pcBuscar = (q) => { pc.busqueda = q; renderCatalogo() }

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

function pcIrA(tab) {
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
      case 'carrito':  renderCarrito(content); break
      case 'pedidos':  renderMisPedidos(content); break
      case 'referidos': renderReferidos(content); break
      case 'cuenta':   renderMiCuenta(content); break
    }
  } catch(e) {
    console.error('[portal] renderTab error', tab, e)
    content.innerHTML = `<div style="padding:40px;color:#ef4444;text-align:center">Error al cargar sección. <button onclick="pcIrA('${tab}')" style="color:#E91E8C;background:none;border:none;cursor:pointer;text-decoration:underline">Reintentar</button></div>`
  }
  // Cerrar sidebar en móvil
  document.getElementById('pc-sidebar')?.classList.remove('open')
}

function pcToggleSidebar() {
  document.getElementById('pc-sidebar')?.classList.toggle('open')
}

// ── Carga inicial de datos ───────────────────────────────────
async function cargarDatosPC() {
  try {
    const [resProd, resVar, resInv, resPed, resRef, resCli] = await Promise.all([
      fetch(`${PC_API}/productos/`),
      fetch(`${PC_API}/variantes/?activa=eq.true`),
      fetch(`${PC_API}/inventario/`),
      pc.sesion?.cliente_id ? fetch(`${PC_API}/auth/pedidos/${pc.sesion.cliente_id}`) : Promise.resolve(null),
      pc.sesion?.cliente_id ? fetch(`${PC_API}/referidos/mi-codigo/${pc.sesion.cliente_id}`) : Promise.resolve(null),
      pc.sesion?.cliente_id ? fetch(`${PC_API}/clientes/${pc.sesion.cliente_id}`) : Promise.resolve(null),
    ])
    if (resProd.ok) { const todos = await resProd.json(); pc.productos = Array.isArray(todos) ? todos.filter(p => p.activo !== false) : [] }
    if (resVar.ok) { const d = await resVar.json(); pc.variantes = Array.isArray(d) ? d : [] }
    if (resInv.ok) { const d = await resInv.json(); pc.inventario = Array.isArray(d) ? d : [] }
    if (resPed?.ok) pc.pedidos = await resPed.json()
    if (resRef?.ok) pc.referido = await resRef.json()
    if (resCli?.ok) { const d = await resCli.json(); pc.clienteData = Array.isArray(d) ? d[0] : d }
  } catch(e) {
    console.error('[portal] cargarDatosPC error', e)
  }
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
  const credito = parseFloat(pc.referido?.credito_disponible || 0)
  const ultimosPedidos = [...pedidos].sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).slice(0,3)

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
        <p class="pc-kpi-sub">${credito > 0 ? 'se aplica en tu próximo pedido' : 'invita y gana $50'}</p>
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
        { icon:'🛒', label:'Hacer pedido', tab:'carrito' },
        { icon:'📦', label:'Mis pedidos',  tab:'pedidos' },
        { icon:'🎁', label:'Referidos',    tab:'referidos' },
      ].map(a => `
        <button onclick="pcIrA('${a.tab}')" class="pc-btn pc-btn-secondary" style="padding:14px;display:flex;flex-direction:column;align-items:center;gap:6px;border-radius:10px;font-size:0.82rem">
          <span style="font-size:1.5rem">${a.icon}</span>${a.label}
        </button>`).join('')}
    </div>

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
  let prods = pc.productos
  if (pc.filtroCat) prods = prods.filter(p => p.categoria === pc.filtroCat)
  if (pc.busqueda) {
    const q = pc.busqueda.toLowerCase()
    prods = prods.filter(p => p.nombre?.toLowerCase().includes(q) || p.sku_interno?.toLowerCase().includes(q))
  }

  el.innerHTML = `
    <div style="margin-bottom:24px">
      <h1 style="font-size:1.4rem;font-weight:800;color:#e2e2f0;margin:0 0 4px">Catálogo mayoreo</h1>
      <p style="font-size:0.83rem;color:#5a5a7a;margin:0">Precios para 3-5 pares y 6+ pares · ${pc.productos.length} modelos</p>
    </div>

    <!-- Buscador + filtros -->
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px">
      <input class="pc-input" style="max-width:260px" placeholder="🔍 Buscar modelo o SKU..."
        value="${esc(pc.busqueda)}" oninput="pcBuscar(this.value)">
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button onclick="pcFiltrarCat('')" class="pc-btn ${!pc.filtroCat ? 'pc-btn-primary' : 'pc-btn-secondary'}" style="padding:8px 14px;font-size:0.78rem">Todos</button>
        ${cats.map(c => `<button onclick="pcFiltrarCat('${esc(c)}')" class="pc-btn ${pc.filtroCat === c ? 'pc-btn-primary' : 'pc-btn-secondary'}" style="padding:8px 14px;font-size:0.78rem;text-transform:capitalize">${c}</button>`).join('')}
      </div>
    </div>

    <!-- Grid productos -->
    ${prods.length === 0 ? `<div style="text-align:center;padding:60px;color:#5a5a7a">Sin resultados para "${esc(pc.busqueda)}"</div>` : `
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px">
      ${prods.map(p => pcProductoCard(p)).join('')}
    </div>`}
  `
}

function pcProductoCard(p) {
  const m3 = parseFloat(p.precio_mayoreo3 || 0)
  const m6 = parseFloat(p.precio_mayoreo6 || 0)
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

// Abrir modal de producto — interfaz estilo POS: colores/chips/corrida
window.pcAbrirProducto = function(prodId) {
  const p = pc.productos.find(x => x.id === prodId)
  if (!p) return
  const m3 = parseFloat(p.precio_mayoreo3 || 0)
  const m6 = parseFloat(p.precio_mayoreo6 || 0)
  const img = p.imagen_principal || ''

  // Agrupar variantes por color
  const vars = pc.variantes.filter(v => v.producto_id === prodId)
  const colores = {}
  vars.forEach(v => {
    const c = v.color || '—'
    if (!colores[c]) colores[c] = { hex: v.color_hex, vars: [] }
    colores[c].vars.push(v)
  })
  Object.values(colores).forEach(c => {
    c.vars.sort((a, b) => TALLAS_ORDEN.indexOf(a.talla) - TALLAS_ORDEN.indexOf(b.talla))
  })

  const renderColorBlock = (colorName, colorData) => {
    // Foto representativa del color
    const fotoColor = colorData.vars.find(v => v.foto_url)?.foto_url || img
    const chips = colorData.vars.map(v => {
      const stock = pc.inventario.filter(i => i.variante_id === v.id).reduce((s, i) => s + (i.cantidad || 0), 0)
      const enCar = pc.carrito.filter(i => i.variante_id === v.id).reduce((s, i) => s + i.cantidad, 0)
      const agotado = stock <= 0
      return `
        <button onclick="pcChipClick('${prodId}','${v.id}','${esc(v.talla)}','${esc(colorName)}')"
          id="pc-chip-${v.id}"
          ${agotado ? 'disabled' : ''}
          style="position:relative;min-width:54px;padding:6px 10px;border:1.5px solid ${enCar > 0 ? '#E91E8C' : agotado ? '#1e1e30' : '#2a2a40'};border-radius:10px;background:${enCar > 0 ? 'rgba(233,30,140,0.12)' : '#0f0f1c'};font-family:inherit;cursor:${agotado ? 'not-allowed' : 'pointer'};opacity:${agotado ? 0.4 : 1};display:flex;flex-direction:column;align-items:center;gap:1px;transition:all 0.15s">
          <span style="font-size:0.88rem;font-weight:800;color:${agotado ? '#5a5a7a' : '#e2e2f0'}">T${esc(v.talla)}</span>
          <span style="font-size:0.58rem;font-weight:600;color:${agotado ? '#5a5a7a' : '#4ade80'}">${agotado ? 'agotado' : 'stock '+stock}</span>
          ${enCar > 0 ? `<span style="position:absolute;top:-7px;right:-7px;background:#E91E8C;color:#fff;border-radius:100px;min-width:18px;height:18px;font-size:0.62rem;display:flex;align-items:center;justify-content:center;font-weight:800">${enCar}</span>` : ''}
        </button>`
    }).join('')

    const puedeCorreda = p.corrida_activa && colorData.vars.some(v => {
      return pc.inventario.filter(i => i.variante_id === v.id).reduce((s, i) => s + (i.cantidad || 0), 0) > 0
    })

    return `
      <div style="margin-bottom:16px;padding:12px;background:#0f0f1c;border-radius:10px;border:1px solid #1e1e30">
        <!-- Header del color: foto miniatura + nombre + corrida -->
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;cursor:pointer" onclick="pcModalFoto('${esc(fotoColor)}')">
          ${fotoColor ? `<img src="${esc(fotoColor)}" style="width:42px;height:42px;object-fit:cover;border-radius:7px;flex-shrink:0;border:1.5px solid #2a2a40">` : colorData.hex ? `<span style="width:42px;height:42px;border-radius:7px;background:${colorData.hex};flex-shrink:0;border:1.5px solid #2a2a40;display:inline-block"></span>` : ''}
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:6px">
              ${colorData.hex ? `<span style="width:11px;height:11px;border-radius:50%;background:${colorData.hex};border:1px solid #2a2a40;flex-shrink:0"></span>` : ''}
              <span style="font-size:0.82rem;font-weight:700;color:#c0c0e0;text-transform:uppercase;letter-spacing:0.05em">${esc(colorName)}</span>
              <span style="font-size:0.62rem;color:#5a5a7a">👆 ver foto</span>
            </div>
          </div>
          ${puedeCorreda ? `<button onclick="event.stopPropagation();pcAgregarCorrida('${prodId}','${esc(colorName)}')" style="padding:4px 10px;background:rgba(107,27,154,0.15);border:1px solid rgba(107,27,154,0.4);border-radius:100px;color:#b39ddb;font-size:0.68rem;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap">📦 Corrida</button>` : ''}
        </div>
        <!-- Chips de talla -->
        <div style="display:flex;flex-wrap:wrap;gap:7px">${chips}</div>
      </div>`
  }

  const overlay = document.createElement('div')
  overlay.id = 'pc-modal'
  overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;padding:16px'
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove() }
  // Foto principal del modal: usa foto de la primera variante con foto, o imagen_principal
  const primeraFoto = Object.values(colores).find(c => c.vars.find(v => v.foto_url))?.vars.find(v => v.foto_url)?.foto_url || img

  overlay.innerHTML = `
    <div style="background:#161625;border:1px solid #2a2a40;border-radius:16px;max-width:560px;width:100%;max-height:92vh;overflow-y:auto;position:relative">
      <button onclick="document.getElementById('pc-modal').remove()" style="position:absolute;top:12px;right:12px;background:rgba(15,15,28,0.85);border:none;color:#a0a0c0;border-radius:50%;width:30px;height:30px;cursor:pointer;font-size:1rem;z-index:10">✕</button>

      <!-- Foto grande -->
      <div style="position:relative;aspect-ratio:4/3;overflow:hidden;background:#0c0c17;border-radius:16px 16px 0 0;cursor:zoom-in" onclick="abrirLightboxPC(document.getElementById('pc-modal-foto').src)">
        <img id="pc-modal-foto" src="${esc(primeraFoto)}" style="width:100%;height:100%;object-fit:cover;transition:opacity 0.2s">
        <div style="position:absolute;bottom:10px;right:10px;background:rgba(0,0,0,0.5);color:white;font-size:0.62rem;padding:3px 8px;border-radius:100px">🔍 toca para ampliar</div>
      </div>

      <!-- Info + colores + chips -->
      <div style="padding:18px 20px 20px">
        <div style="margin-bottom:16px">
          <p style="font-size:0.65rem;font-family:monospace;color:#5a5a7a;margin:0 0 2px">${esc(p.sku_interno||'')}</p>
          <p style="font-size:1rem;font-weight:700;color:#e2e2f0;margin:0 0 8px;line-height:1.3">${esc(p.nombre)}</p>
          <div style="display:flex;gap:16px;flex-wrap:wrap">
            ${m3 ? `<span style="font-size:0.75rem;color:#a0a0c0">3-5 pares: <strong style="color:#e2e2f0">${money(m3)}</strong> c/u</span>` : ''}
            ${m6 ? `<span style="font-size:0.75rem;color:#a0a0c0">6+ pares: <strong style="color:#E91E8C">${money(m6)}</strong> c/u</span>` : ''}
          </div>
        </div>

        ${Object.keys(colores).length === 0
          ? `<p style="color:#5a5a7a;text-align:center;padding:20px">Sin variantes disponibles</p>`
          : Object.entries(colores).map(([cn, cd]) => renderColorBlock(cn, cd)).join('')
        }

        <div id="pc-modal-resumen" style="margin-top:14px;padding:10px 14px;background:#0f0f1c;border-radius:10px;border:1px solid rgba(233,30,140,0.2);display:none">
          <p style="font-size:0.72rem;color:#a0a0c0;margin:0 0 2px">En tu pedido:</p>
          <p id="pc-modal-resumen-txt" style="font-size:0.9rem;font-weight:700;color:#E91E8C;margin:0"></p>
        </div>

        <div style="display:flex;gap:10px;margin-top:16px">
          <button onclick="pcIrA('carrito');document.getElementById('pc-modal').remove()" class="pc-btn pc-btn-primary" style="flex:1">Ver pedido →</button>
          <button onclick="document.getElementById('pc-modal').remove()" class="pc-btn pc-btn-secondary">Cerrar</button>
        </div>
      </div>
    </div>`

  document.body.appendChild(overlay)
  pcRefrescarResumenModal(prodId)
}

// Chip click: agrega 1 par o quita si ya hay en carrito
window.pcChipClick = function(prodId, varId, talla, color) {
  const p = pc.productos.find(x => x.id === prodId)
  if (!p) return
  const idx = pc.carrito.findIndex(i => i.variante_id === varId)
  if (idx >= 0) {
    pc.carrito.splice(idx, 1)
  } else {
    const totalPares = pc.carrito.reduce((s, i) => s + i.cantidad, 0) + 1
    const precio = totalPares >= 6 ? parseFloat(p.precio_mayoreo6 || p.precio_mayoreo3 || 0) : parseFloat(p.precio_mayoreo3 || 0)
    pc.carrito.push({ producto_id: prodId, variante_id: varId, nombre: p.nombre, sku: p.sku_interno, imagen: p.imagen_principal, talla, color, cantidad: 1, precio_unitario: precio })
  }
  pcGuardarCarrito()
  pcRefrescarChipModal(varId, prodId)
  pcRefrescarResumenModal(prodId)
  renderCatalogo() // actualiza badge "En pedido" en el grid
}

// Agregar corrida completa de un color
window.pcAgregarCorrida = function(prodId, color) {
  const p = pc.productos.find(x => x.id === prodId)
  if (!p) return
  const vars = pc.variantes.filter(v => v.producto_id === prodId && v.color === color)
  let agregados = 0
  vars.forEach(v => {
    const stock = pc.inventario.filter(i => i.variante_id === v.id).reduce((s, i) => s + (i.cantidad || 0), 0)
    if (stock <= 0) return
    const ya = pc.carrito.find(i => i.variante_id === v.id)
    if (!ya) {
      const precio = parseFloat(p.precio_corrida || p.precio_mayoreo3 || 0)
      pc.carrito.push({ producto_id: prodId, variante_id: v.id, nombre: p.nombre, sku: p.sku_interno, imagen: p.imagen_principal, talla: v.talla, color, cantidad: 1, precio_unitario: precio, es_corrida: true })
      agregados++
    }
  })
  if (agregados > 0) {
    pcGuardarCarrito()
    // Refrescar todos los chips de este producto
    pc.variantes.filter(v => v.producto_id === prodId).forEach(v => pcRefrescarChipModal(v.id, prodId))
    pcRefrescarResumenModal(prodId)
    renderCatalogo()
  }
}

window.pcModalFoto = function(src) {
  const el = document.getElementById('pc-modal-foto')
  if (!el || !src) return
  el.style.opacity = '0.5'
  el.src = src
  el.onload = () => { el.style.opacity = '1' }
}

function pcRefrescarChipModal(varId, prodId) {
  const chip = document.getElementById('pc-chip-' + varId)
  if (!chip) return
  const v = pc.variantes.find(x => x.id === varId)
  if (!v) return
  const stock = pc.inventario.filter(i => i.variante_id === varId).reduce((s, i) => s + (i.cantidad || 0), 0)
  const enCar = pc.carrito.filter(i => i.variante_id === varId).reduce((s, i) => s + i.cantidad, 0)
  const agotado = stock <= 0
  chip.style.borderColor = enCar > 0 ? '#E91E8C' : agotado ? '#1e1e30' : '#2a2a40'
  chip.style.background = enCar > 0 ? 'rgba(233,30,140,0.12)' : '#0f0f1c'
  // badge
  let badge = chip.querySelector('span[data-badge]')
  if (enCar > 0) {
    if (!badge) {
      badge = document.createElement('span')
      badge.setAttribute('data-badge','1')
      badge.style.cssText = 'position:absolute;top:-7px;right:-7px;background:#E91E8C;color:#fff;border-radius:100px;min-width:18px;height:18px;font-size:0.62rem;display:flex;align-items:center;justify-content:center;font-weight:800'
      chip.appendChild(badge)
    }
    badge.textContent = enCar
  } else if (badge) {
    badge.remove()
  }
}

function pcRefrescarResumenModal(prodId) {
  const resumen = document.getElementById('pc-modal-resumen')
  const txt = document.getElementById('pc-modal-resumen-txt')
  if (!resumen || !txt) return
  const items = pc.carrito.filter(i => i.producto_id === prodId)
  if (items.length === 0) { resumen.style.display = 'none'; return }
  const total = items.reduce((s, i) => s + i.cantidad, 0)
  txt.textContent = `${total} par${total !== 1 ? 'es' : ''} agregado${total !== 1 ? 's' : ''} · ${money(items.reduce((s, i) => s + i.precio_unitario * i.cantidad, 0))}`
  resumen.style.display = 'block'
}

window.abrirLightboxPC = function(src) {
  if (!src) return
  const prev = document.getElementById('pc-lightbox')
  if (prev) prev.remove()
  const lb = document.createElement('div')
  lb.id = 'pc-lightbox'
  lb.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:19999;display:flex;align-items:center;justify-content:center;cursor:zoom-out'
  lb.innerHTML = `
    <button onclick="document.getElementById('pc-lightbox').remove()" style="position:absolute;top:16px;right:16px;background:rgba(255,255,255,0.12);border:none;color:white;font-size:1.6rem;width:44px;height:44px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center">✕</button>
    <img src="${src}" style="max-width:92vw;max-height:88vh;object-fit:contain;border-radius:12px;box-shadow:0 8px 40px rgba(0,0,0,0.8)">
  `
  lb.addEventListener('click', e => { if (e.target === lb) lb.remove() })
  document.body.appendChild(lb)
}


function pcGuardarCarrito() {
  try { localStorage.setItem(PC_CARRITO_KEY, JSON.stringify(pc.carrito)) } catch {}
}

// ── CARRITO / HACER PEDIDO ───────────────────────────────────
function renderCarrito(el) {
  el = el || document.getElementById('pc-content')
  if (!el) return
  // Recalculate prices from live product data (fixes stale $0 from localStorage)
  if (pc.productos.length > 0) {
    const totalParesBefore = pc.carrito.reduce((s, i) => s + i.cantidad, 0)
    pc.carrito.forEach(item => {
      const p = pc.productos.find(x => x.id === item.producto_id)
      if (!p) return
      const m3 = parseFloat(p.precio_mayoreo3 || 0)
      const m6 = parseFloat(p.precio_mayoreo6 || 0)
      const corrida = parseFloat(p.precio_corrida || 0)
      if (item.es_corrida && corrida > 0) {
        item.precio_unitario = corrida
      } else if (totalParesBefore >= 6 && m6 > 0) {
        item.precio_unitario = m6
      } else if (m3 > 0) {
        item.precio_unitario = m3
      }
    })
    pcGuardarCarrito()
  }
  const total = pc.carrito.reduce((s, i) => s + (i.precio_unitario * i.cantidad), 0)
  const totalPares = pc.carrito.reduce((s, i) => s + i.cantidad, 0)
  const credito = parseFloat(pc.referido?.credito_disponible || 0)

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
        <h1 style="font-size:1.4rem;font-weight:800;color:#e2e2f0;margin:0 0 4px">Hacer pedido</h1>
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
        ${pc.carrito.length === 0 ? '' : `
        <div class="pc-card" style="margin-bottom:16px">
          ${pc.carrito.map((item, idx) => `
            <div style="display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid #1e1e30">
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
            </div>`).join('')}
        </div>`}

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
        <div style="margin-bottom:12px">
          <label style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#5a5a7a;display:block;margin-bottom:6px">Notas del pedido</label>
          <textarea id="pc-notas" class="pc-input" style="height:70px;resize:none" placeholder="Color específico, urgencia, instrucciones..."></textarea>
        </div>
        <button onclick="pcHacerPedido()" class="pc-btn pc-btn-primary" style="width:100%;margin-bottom:8px">
          Enviar pedido →
        </button>
        <button onclick="pc.carrito=[];pcGuardarCarrito();pcIrA('carrito')" class="pc-btn pc-btn-secondary" style="width:100%;font-size:0.78rem">
          Vaciar carrito
        </button>
        <p id="pc-pedido-err" style="color:#ef4444;font-size:0.78rem;margin-top:8px;display:none"></p>
      </div>` : ''}
    </div>
  `
}

window.pcQuitarDelCarrito = function(idx) {
  pc.carrito.splice(idx, 1)
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
      // Recargar pedidos
      if (pc.sesion?.cliente_id) {
        const rp = await fetch(`${PC_API}/auth/pedidos/${pc.sesion.cliente_id}`)
        if (rp.ok) pc.pedidos = await rp.json()
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
    </div>`
}

// ── REFERIDOS ────────────────────────────────────────────────
function renderReferidos(el) {
  el = el || document.getElementById('pc-content')
  if (!el) return
  const r = pc.referido
  const credito = parseFloat(r?.credito_disponible || 0)
  const usos = r?.usos || 0

  el.innerHTML = `
    <div style="margin-bottom:24px">
      <h1 style="font-size:1.4rem;font-weight:800;color:#e2e2f0;margin:0 0 4px">🎁 Programa de referidos</h1>
      <p style="font-size:0.83rem;color:#5a5a7a;margin:0">Invita a otras zapaterías y gana $50 por cada una</p>
    </div>

    ${!r ? `<div class="pc-card" style="text-align:center;padding:40px;color:#5a5a7a">
      <div style="width:28px;height:28px;border:3px solid #E91E8C;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 16px"></div>
      Cargando...
    </div>` : `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;margin-bottom:24px">
      <div class="pc-kpi" style="${credito > 0 ? 'border-color:rgba(16,185,129,0.3)' : ''}">
        <p class="pc-kpi-lbl">Crédito disponible</p>
        <p class="pc-kpi-val" style="color:${credito > 0 ? '#10b981' : '#e2e2f0'}">${money(credito)}</p>
        <p class="pc-kpi-sub">${credito > 0 ? 'se aplica en tu próximo pedido' : 'sin crédito pendiente'}</p>
      </div>
      <div class="pc-kpi">
        <p class="pc-kpi-lbl">Referidos registrados</p>
        <p class="pc-kpi-val">${usos}</p>
        <p class="pc-kpi-sub">zapatería${usos !== 1 ? 's' : ''} invitada${usos !== 1 ? 's' : ''}</p>
      </div>
    </div>

    <div class="pc-card" style="margin-bottom:16px">
      <p style="font-weight:700;color:#e2e2f0;margin:0 0 16px">Tu código personal</p>
      <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
        <div style="background:#0f0f1c;border:1.5px solid #2a2a40;border-radius:10px;padding:14px 24px;flex:1;min-width:160px">
          <p style="font-size:2rem;font-weight:800;letter-spacing:6px;color:#E91E8C;margin:0;font-family:monospace">${esc(r.codigo||'—')}</p>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <button onclick="navigator.clipboard.writeText('${esc(r.codigo||'')}').then(()=>pcMostrarExito('¡Código copiado!'))" class="pc-btn pc-btn-primary">📋 Copiar código</button>
          ${r.link ? `<button onclick="navigator.clipboard.writeText('${esc(r.link)}').then(()=>pcMostrarExito('¡Enlace copiado!'))" class="pc-btn pc-btn-secondary">🔗 Copiar enlace</button>` : ''}
        </div>
      </div>
      ${r.link ? `<p style="font-size:0.72rem;color:#3a3a5c;margin:12px 0 0;word-break:break-all">${esc(r.link)}</p>` : ''}
    </div>

    <div class="pc-card">
      <p style="font-weight:700;color:#e2e2f0;margin:0 0 12px">¿Cómo funciona?</p>
      ${[
        ['1.','Comparte tu código o enlace con otra zapatería'],
        ['2.','Se registran con tu código en zapatillasmay.mx'],
        ['3.','Ambas reciben $50 de descuento en su siguiente pedido'],
        ['4.','Sin límite — cuantas más referidas, más crédito acumulado'],
      ].map(([n,t]) => `<div style="display:flex;gap:12px;padding:10px 0;border-bottom:1px solid #1e1e30">
        <span style="font-size:0.8rem;font-weight:800;color:#E91E8C;flex-shrink:0;min-width:20px">${n}</span>
        <span style="font-size:0.83rem;color:#a0a0c0">${t}</span>
      </div>`).join('')}
    </div>`}
  `
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
  sessionStorage.removeItem('erp_empleado')
  sessionStorage.removeItem('erp_token')
  localStorage.removeItem(PC_CARRITO_KEY)
  pc.sesion = null
  window.location.reload()
}
