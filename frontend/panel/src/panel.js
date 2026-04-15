const API = '/api'

const TALLAS = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Unica']

const COLORES_SUGERIDOS = [
  { nombre: 'Negro', hex: '#000000' },
  { nombre: 'Blanco', hex: '#FFFFFF' },
  { nombre: 'Hueso', hex: '#F5F0E8' },
  { nombre: 'Beige', hex: '#E8D5B0' },
  { nombre: 'Camel', hex: '#C19A6B' },
  { nombre: 'Miel', hex: '#B8860B' },
  { nombre: 'Cafe claro', hex: '#A0785A' },
  { nombre: 'Cafe medio', hex: '#7B4F2E' },
  { nombre: 'Cafe oscuro', hex: '#4A2C1A' },
  { nombre: 'Chocolate', hex: '#3B1F0E' },
  { nombre: 'Cognac', hex: '#8B4513' },
  { nombre: 'Taupe', hex: '#8B7D6B' },
  { nombre: 'Gris claro', hex: '#C0C0C0' },
  { nombre: 'Gris', hex: '#808080' },
  { nombre: 'Gris oscuro', hex: '#404040' },
  { nombre: 'Rojo', hex: '#CC0000' },
  { nombre: 'Vino', hex: '#722F37' },
  { nombre: 'Bordo', hex: '#800020' },
  { nombre: 'Rosa claro', hex: '#FFB6C1' },
  { nombre: 'Rosa', hex: '#FF69B4' },
  { nombre: 'Fusha', hex: '#E91E8C' },
  { nombre: 'Coral', hex: '#FF6B6B' },
  { nombre: 'Salmon', hex: '#FA8072' },
  { nombre: 'Naranja', hex: '#FF6600' },
  { nombre: 'Amarillo', hex: '#FFD700' },
  { nombre: 'Dorado', hex: '#C8A951' },
  { nombre: 'Plateado', hex: '#A8A8A8' },
  { nombre: 'Azul claro', hex: '#6CA0DC' },
  { nombre: 'Azul', hex: '#0000CC' },
  { nombre: 'Azul marino', hex: '#001F5B' },
  { nombre: 'Turquesa', hex: '#40E0D0' },
  { nombre: 'Verde', hex: '#006400' },
  { nombre: 'Verde menta', hex: '#98FF98' },
  { nombre: 'Morado', hex: '#800080' },
  { nombre: 'Lila', hex: '#C8A2C8' },
  { nombre: 'Multicolor', hex: '#FF69B4' },
]

const CATEGORIAS = [
  { value: 'tacones', label: 'Tacones', prefix: 'TAC' },
  { value: 'sandalias', label: 'Sandalias', prefix: 'SAN' },
  { value: 'botas', label: 'Botas', prefix: 'BOT' },
  { value: 'botines', label: 'Botines', prefix: 'BTN' },
  { value: 'flats', label: 'Flats', prefix: 'FLT' },
  { value: 'plataformas', label: 'Plataformas', prefix: 'PLT' },
  { value: 'tenis', label: 'Tenis', prefix: 'TEN' },
  { value: 'nina', label: 'Calzado de nina', prefix: 'NIN' },
  { value: 'accesorios', label: 'Accesorios', prefix: 'ACC' },
]

const modulos = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard', section: 'Principal' },
  { id: 'pos', icon: '🛒', label: 'Punto de venta', section: 'Principal' },
  { id: 'productos', icon: '👠', label: 'Productos', section: 'Catalogo' },
  { id: 'inventario', icon: '📦', label: 'Inventario', section: 'Catalogo' },
  { id: 'pedidos', icon: '🛍️', label: 'Pedidos', section: 'Ventas' },
  { id: 'clientes', icon: '👥', label: 'Clientes', section: 'Ventas' },
  { id: 'sucursales', icon: '🏪', label: 'Sucursales', section: 'Configuracion' },
  { id: 'historial', icon: '📋', label: 'Historial', section: 'Ventas' },
  { id: 'empleados', icon: '👤', label: 'Empleados', section: 'Configuracion' },
  { id: 'seo', icon: '🔍', label: 'SEO y Sitio', section: 'Configuracion' },
]

let moduloActivo = 'dashboard'
let varianteCount = 1

export function renderPanel() {
  document.querySelector('#app').innerHTML = `
    <div class="sidebar-overlay" id="sidebar-overlay" onclick="toggleSidebar()"></div>
    <div class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        <h2>Zapatillas <span>May</span></h2>
        <p>Panel de administracion</p>
      </div>
      <nav class="sidebar-nav">
        ${renderNav()}
      </nav>
    </div>
    <div class="main">
      <div class="topbar">
        <div style="display:flex;align-items:center;gap:1rem">
          <button class="hamburger" onclick="toggleSidebar()">☰</button>
          <h1 id="topbar-title">Dashboard</h1>
        </div>
        <div class="topbar-actions">
          <span style="font-size:0.8rem;color:#888">${window._empleadoActual ? window._empleadoActual.nombre : 'Leon, Gto.'}</span>
          <button onclick="cerrarSesionPanel()" style="background:none;border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:4px 10px;font-size:0.75rem;color:#8892a4;cursor:pointer;font-family:DM Sans,sans-serif">Salir</button>
        </div>
      </div>
      <div class="content" id="content">
        ${renderDashboard()}
      </div>
    </div>
  `

 window.toggleSidebar = () => {
  const sidebar = document.getElementById('sidebar')
  const overlay = document.getElementById('sidebar-overlay')
  const isOpen = sidebar.classList.toggle('open')
  overlay.classList.toggle('active', isOpen)
  // Bloquear scroll del body cuando sidebar está abierto
  document.body.style.overflow = isOpen ? 'hidden' : ''
}

  window.navegarA = (id) => {
    moduloActivo = id
    // Cerrar sidebar al navegar en móvil
    const sidebar = document.getElementById('sidebar')
    const overlay = document.getElementById('sidebar-overlay')
    if (sidebar.classList.contains('open')) {
      sidebar.classList.remove('open')
      overlay.classList.remove('active')
    }
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'))
    document.querySelector('[data-modulo="' + id + '"]').classList.add('active')
    document.getElementById('topbar-title').textContent = modulos.find(m => m.id === id).label
    cargarModulo(id)
  }
}

function renderNav() {
  const secciones = [...new Set(modulos.map(m => m.section))]
  return secciones.map(sec => `
    <div class="nav-section">${sec}</div>
    ${modulos.filter(m => m.section === sec).map(m => `
      <div class="nav-item ${m.id === moduloActivo ? 'active' : ''}"
           data-modulo="${m.id}"
           onclick="navegarA('${m.id}')">
        <span class="nav-icon">${m.icon}</span>
        ${m.label}
      </div>
    `).join('')}
  `).join('')
}

async function cargarModulo(id) {
  const content = document.getElementById('content')
  content.innerHTML = '<p style="padding:2rem;color:#888">Cargando...</p>'
  switch(id) {
    case 'dashboard': content.innerHTML = renderDashboardHTML(); setTimeout(() => cargarDashboard(), 100); break
    case 'productos': await cargarProductos(); break
    case 'clientes': await cargarClientes(); break
    case 'pedidos': await cargarPedidos(); break
    case 'sucursales': await cargarSucursales(); break
    case 'inventario': await cargarInventario(); break
    case 'pos': await cargarPOS(); break
    case 'historial': await cargarHistorial(); break
    case 'empleados': await cargarEmpleados(); break
    case 'seo': await cargarSEO(); break
  }
}

function renderDashboard() {
  setTimeout(() => cargarDashboard(), 800)
  return renderDashboardHTML()
}

function renderDashboardHTML() {
  return `
    <div id="dashboard-contenido">
      <div class="stats-grid" style="margin-bottom:1.5rem">
        ${['Ventas hoy','Pedidos hoy','Ventas 7 dias','Clientes nuevos','Stock bajo','Mejor dia','Top vendedor','Total clientes'].map(l => `
          <div class="stat-card">
            <div class="stat-label">${l}</div>
            <div class="stat-value" style="font-size:1.2rem;color:var(--text-muted)">...</div>
            <div class="stat-sub"></div>
          </div>
        `).join('')}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div class="chart-container"><p class="chart-title">Ventas por dia de la semana</p><canvas id="chart-dias" height="200"></canvas></div>
        <div class="chart-container"><p class="chart-title">Canal de ventas</p><canvas id="chart-canales" height="200"></canvas></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div class="chart-container"><p class="chart-title">Ventas por mes</p><canvas id="chart-meses" height="200"></canvas></div>
        <div class="chart-container"><p class="chart-title">Metodos de pago</p><canvas id="chart-pagos" height="200"></canvas></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div class="table-card" style="padding:1.5rem">
          <p style="font-weight:700;margin-bottom:1rem;font-size:0.78rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.8px">Top clientes (30 dias)</p>
          <div id="dash-top-clientes"><div style="color:var(--text-muted);font-size:0.85rem">Cargando...</div></div>
        </div>
        <div class="table-card" style="padding:1.5rem">
          <p style="font-weight:700;margin-bottom:1rem;font-size:0.78rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.8px">Ultimos pedidos</p>
          <div id="dash-ultimos-pedidos"><div style="color:var(--text-muted);font-size:0.85rem">Cargando...</div></div>
        </div>
      </div>
    </div>
  `
}

async function cargarProductos(categoriaFiltro) {
  const content = document.getElementById('content')
  try {
    const res = await fetch(API + '/productos/')
    const data = await res.json()
    const categorias = [...new Set(data.map(p => p.categoria).filter(Boolean))]
    const filtrados = categoriaFiltro ? data.filter(p => p.categoria === categoriaFiltro) : data
    content.innerHTML = `
      <div style="margin-bottom:1rem;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <button class="btn ${!categoriaFiltro ? 'btn-primary' : 'btn-secondary'}" onclick="cargarProductosFiltro(null)">Todos (${data.length})</button>
        ${categorias.map(c => `
          <button class="btn ${categoriaFiltro === c ? 'btn-primary' : 'btn-secondary'}" onclick="cargarProductosFiltro('${c}')">
            ${c.charAt(0).toUpperCase() + c.slice(1)} (${data.filter(p => p.categoria === c).length})
          </button>
        `).join('')}
      </div>
      <div class="table-card">
        <div class="table-header">
           <h3>${categoriaFiltro ? categoriaFiltro.charAt(0).toUpperCase() + categoriaFiltro.slice(1) : 'Todos los productos'} (${filtrados.length})</h3>
          <div style="display:flex;gap:8px;align-items:center">
            <input class="form-input" id="prod-buscar" placeholder="Buscar producto..." style="max-width:220px" oninput="filtrarProductos()">
            <button class="btn btn-primary" onclick="mostrarFormProducto()">+ Nuevo producto</button>
               </div>
           </div>
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>SKU</th>
              <th>Categoria</th>
              <th>Menudeo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${filtrados.length === 0
              ? '<tr><td colspan="6" style="text-align:center;color:#888;padding:2rem">No hay productos</td></tr>'
              : filtrados.map(p => `
                <tr>
                  <td style="display:flex;align-items:center;gap:10px">
                    ${p.imagen_principal
                      ? '<img src="' + p.imagen_principal + '" style="width:44px;height:44px;object-fit:cover;border-radius:6px;border:1px solid #eee;flex-shrink:0">'
                      : '<div style="width:44px;height:44px;background:#f5f5f5;border-radius:6px;flex-shrink:0;display:flex;align-items:center;justify-content:center;color:#ccc;font-size:1.2rem">?</div>'}
                    <strong>${p.nombre}</strong>
                  </td>
                  <td><small style="color:#888">${p.sku_interno || '—'}</small></td>
                  <td>${p.categoria || '—'}</td>
                  <td>$${p.precio_menudeo}</td>
                  <td><span class="badge ${p.activo ? 'badge-success' : 'badge-danger'}">${p.activo ? 'Activo' : 'Inactivo'}</span></td>
                  <td style="display:flex;gap:4px;flex-wrap:wrap">
                    <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="editarProducto('${p.id}')">Editar</button>
                    <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="duplicarProducto('${p.id}')">Duplicar</button>
                    <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem;color:${p.activo ? '#E91E8C' : 'green'}" onclick="toggleProducto('${p.id}', ${p.activo})">${p.activo ? 'Desactivar' : 'Activar'}</button>
                  </td>
                </tr>
              `).join('')}
          </tbody>
        </table>
      </div>
    `
  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error conectando con el servidor</p>'
  }
}

async function cargarClientes() {
  const content = document.getElementById('content')
  try {
    const res = await fetch(API + '/clientes/')
    const data = await res.json()
    content.innerHTML = `
      <div class="table-card">
        <div class="table-header">
          <h3>Clientes (${data.length})</h3>
          <button class="btn btn-primary" onclick="mostrarFormCliente()">+ Nuevo cliente</button>
        </div>
        <div style="padding:0 1.5rem 1rem;display:flex;gap:8px;flex-wrap:wrap">
          <input class="form-input" id="cli-buscar" placeholder="Buscar por nombre o telefono..." style="max-width:280px" oninput="filtrarClientes()">
          <select class="form-input" id="cli-tipo" style="max-width:150px" onchange="filtrarClientes()">
            <option value="">Todos los tipos</option>
            <option value="menudeo">Menudeo</option>
            <option value="mayoreo">Mayoreo</option>
            <option value="zapateria">Zapateria</option>
          </select>
        </div>
        <table id="cli-tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Telefono</th>
              <th>Tipo</th>
              <th>Credito</th>
              <th>Ciudad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="cli-tbody">
            ${data.length === 0
              ? '<tr><td colspan="6" style="text-align:center;color:#888;padding:2rem">No hay clientes registrados</td></tr>'
              : data.map(c => `
                <tr>
                  <td>
                    <strong>${c.nombre}</strong>
                    ${c.comentarios_internos ? '<br><small style="color:#E91E8C;font-size:0.72rem">­ƒôØ ' + c.comentarios_internos.substring(0, 40) + '...</small>' : ''}
                  </td>
                  <td>
                    ${c.telefono || '—'}
                    ${c.telefono ? '<br><a href="https://wa.me/' + (c.lada || '52') + c.telefono.replace(/\D/g,'') + '" target="_blank" style="font-size:0.72rem;color:#25D366;text-decoration:none">WhatsApp</a>' : ''}
                  </td>
                  <td><span class="badge ${c.tipo === 'mayoreo' ? 'badge-info' : c.tipo === 'zapateria' ? 'badge-warning' : 'badge-success'}">${c.tipo || 'menudeo'}</span></td>
                  <td>${c.limite_credito > 0 ? '$' + c.limite_credito + ' / ' + c.dias_credito + ' dias' : 'Sin credito'}</td>
                  <td>${c.ciudad || '—'}</td>
                  <td style="display:flex;gap:4px;flex-wrap:wrap">
                    <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="verCliente('${c.id}')">Ver</button>
                    <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="mostrarFormCliente('${c.id}')">Editar</button>
                    ${c.telefono ? '<a href="https://wa.me/' + (c.lada || '52') + c.telefono.replace(/\D/g,'') + '" target="_blank" class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem;background:#25D366;color:white;border-color:#25D366">WA</a>' : ''}
                  </td>
                </tr>
              `).join('')}
          </tbody>
        </table>
      </div>
    `
    window._clientesData = data
  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error conectando con el servidor</p>'
  }
}


async function cargarSucursales() {
  const content = document.getElementById('content')
  try {
    const res = await fetch(API + '/sucursales/')
    const data = await res.json()
    content.innerHTML = `
      <div class="table-card">
        <div class="table-header">
          <h3>Sucursales (${data.length})</h3>
          <button class="btn btn-primary">+ Nueva sucursal</button>
        </div>
        <table>
          <thead>
           <tr><th>Nombre</th><th>Tipo</th><th>Direccion</th><th>Telefono</th><th>Estado</th><th>Acciones</th></tr>          </thead>
          <tbody>
            ${data.map(s => `
              <tr>
                <td><strong>${s.nombre}</strong></td>
                <td>${s.tipo}</td>
                <td>${s.direccion || '—'}</td>
                <td>${s.telefono || '—'}</td>
                <td><span class="badge badge-success">Activa</span></td>
             <td>
              <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="mostrarFormSucursal('${s.id}')">Editar</button>
              </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `
  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error conectando con el servidor</p>'
  }
}

async function cargarInventario() {
  const content = document.getElementById('content')
  try {
    const resSucursales = await fetch(API + '/sucursales/')
    const sucursales = await resSucursales.json()
    const resProductos = await fetch(API + '/productos/')
    const productos = await resProductos.json()
    const resVariantes = await fetch(API + '/variantes/')
    const variantes = await resVariantes.json()
    const resInv = await fetch(API + '/inventario/')
    const inventario = await resInv.json()
    window._invData = { sucursales, productos, variantes, inventario }
    content.innerHTML = `
      <div style="margin-bottom:1.5rem;display:flex;gap:10px;flex-wrap:wrap;align-items:center">
        <input class="form-input" id="inv-buscar" placeholder="Buscar por nombre o SKU..." style="max-width:250px" oninput="renderInventario()">
        <select class="form-input" id="inv-categoria" style="max-width:150px" onchange="renderInventario()">
          <option value="">Todas las categorias</option>
          ${[...new Set(productos.map(p => p.categoria).filter(Boolean))].map(c => `<option value="${c}">${c.charAt(0).toUpperCase() + c.slice(1)}</option>`).join('')}
        </select>
        <select class="form-input" id="inv-talla" style="max-width:110px" onchange="renderInventario()">
          <option value="">Todas las tallas</option>
          ${TALLAS.map(t => `<option value="${t}">${t}</option>`).join('')}
        </select>
        <select class="form-input" id="inv-estado" style="max-width:140px" onchange="renderInventario()">
          <option value="">Todos los estados</option>
          <option value="disponible">Disponible</option>
          <option value="bajo">Stock bajo</option>
          <option value="agotado">Agotado</option>
        </select>
        <button class="btn btn-primary" onclick="mostrarFormInventario()">+ Agregar stock</button>
        <button class="btn btn-secondary" onclick="mostrarAlertas()" style="background:#fff8e1;border-color:#f57f17;color:#f57f17">Alertas</button>
        <button class="btn btn-secondary" onclick="mostrarInventarioMasivo()" style="background:#f3e5f5;border-color:#6a1b9a;color:#6a1b9a">📋 Inventario masivo</button>
        <button class="btn btn-secondary" onclick="mostrarEntrada()" style="background:#e8f5e9;border-color:#2e7d32;color:#2e7d32">+ Entrada</button>
        <button class="btn btn-secondary" onclick="mostrarSalida()" style="background:#ffebee;border-color:#c62828;color:#c62828">- Salida</button>
        <button class="btn btn-secondary" onclick="mostrarAjuste()" style="background:#e3f2fd;border-color:#1565c0;color:#1565c0">⚙ Ajuste</button>
        <button class="btn btn-secondary" onclick="mostrarCambio()" style="background:#f3e5f5;border-color:#6a1b9a;color:#6a1b9a">Cambio</button>
        <button class="btn btn-secondary" onclick="mostrarTraspaso()" style="background:#e8eaf6;border-color:#283593;color:#283593">⇄ Traspaso</button>
      </div>
      <div id="inv-contenido"></div>
    `
    renderInventario()
  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error conectando con el servidor</p>'
  }
}

window.renderInventario = () => {
  const { sucursales, productos, variantes, inventario } = window._invData
  const buscar = (document.getElementById('inv-buscar') ? document.getElementById('inv-buscar').value : '').toLowerCase()
  const categoriaFiltro = document.getElementById('inv-categoria') ? document.getElementById('inv-categoria').value : ''
  const tallaFiltro = document.getElementById('inv-talla') ? document.getElementById('inv-talla').value : ''
  const estadoFiltro = document.getElementById('inv-estado') ? document.getElementById('inv-estado').value : ''
  const TALLAS_ORDEN = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Unica']
  const productosFiltrados = productos.filter(p => {
    if (buscar && !p.nombre.toLowerCase().includes(buscar) && !(p.sku_interno || '').toLowerCase().includes(buscar)) return false
    if (categoriaFiltro && p.categoria !== categoriaFiltro) return false
    return true
  })
  const html = sucursales.map(suc => {
    const invSucursal = inventario.filter(i => i.sucursal_id === suc.id)
    const productosHtml = productosFiltrados.map(prod => {
      const variantesProd = variantes.filter(v => v.producto_id === prod.id)
      if (variantesProd.length === 0) return ''
      const colores = [...new Set(variantesProd.map(v => v.color).filter(Boolean))]
      const coloresHtml = colores.map(color => {
        const variantesColor = variantesProd
          .filter(v => v.color === color)
          .sort((a, b) => TALLAS_ORDEN.indexOf(a.talla) - TALLAS_ORDEN.indexOf(b.talla))
        if (tallaFiltro && !variantesColor.find(v => v.talla === tallaFiltro)) return ''
        const colorHex = variantesColor[0] ? variantesColor[0].color_hex : '#888'
        const tallasHtml = variantesColor.map(v => {
          const inv = invSucursal.find(i => i.variante_id === v.id)
          const cantidad = inv ? inv.cantidad : null
          const minimo = inv ? inv.stock_minimo : 3
          if (tallaFiltro && v.talla !== tallaFiltro) return ''
          if (estadoFiltro) {
            if (estadoFiltro === 'agotado' && cantidad !== 0) return ''
            if (estadoFiltro === 'bajo' && (cantidad === null || cantidad === 0 || cantidad > minimo)) return ''
            if (estadoFiltro === 'disponible' && (cantidad === null || cantidad === 0 || cantidad <= minimo)) return ''
          }
          let bg, colorTexto
          if (cantidad === null) { bg = '#f0f0f0'; colorTexto = '#aaa' }
          else if (cantidad === 0) { bg = '#ffebee'; colorTexto = '#c62828' }
          else if (cantidad <= minimo) { bg = '#fff8e1'; colorTexto = '#f57f17' }
          else { bg = '#e8f5e9'; colorTexto = '#2e7d32' }
          return `
            <div onclick="editarStock('${v.id}', '${suc.id}', ${cantidad !== null ? cantidad : 0}, ${minimo})"
                 title="Click para editar"
                 style="display:inline-flex;flex-direction:column;align-items:center;background:${bg};border-radius:8px;padding:6px 10px;cursor:pointer;min-width:52px;border:1px solid ${colorTexto}30"
                 onmouseover="this.style.transform='scale(1.05)'"
                 onmouseout="this.style.transform='scale(1)'">
              <span style="font-size:0.7rem;color:#666;font-weight:500">${v.talla}</span>
              <span style="font-size:1rem;font-weight:700;color:${colorTexto}">${cantidad !== null ? cantidad : '—'}</span>
            </div>
          `
        }).join('')
        if (!tallasHtml.trim()) return ''
        return `
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;flex-wrap:wrap">
            <div style="display:flex;align-items:center;gap:8px;min-width:140px">
              <div style="width:16px;height:16px;border-radius:50%;background:${colorHex};border:2px solid #ddd;flex-shrink:0"></div>
              <span style="font-size:0.85rem;font-weight:500;color:#444">${color}</span>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap">${tallasHtml}</div>
          </div>
        `
      }).join('')
      if (!coloresHtml.trim()) return ''
      return `
        <div style="background:white;border-radius:12px;padding:1.25rem;margin-bottom:1rem;border:1px solid #eee">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:8px">
            <div>
              <span style="font-weight:600;font-size:1rem;color:#1a1a1a">${prod.nombre}</span>
              <span style="margin-left:8px;font-size:0.75rem;color:#888;background:#f5f5f5;padding:2px 8px;border-radius:100px">${prod.sku_interno || '—'}</span>
              <span style="margin-left:6px;font-size:0.72rem;color:#E91E8C;background:#fce4f3;padding:2px 8px;border-radius:100px">${prod.categoria || ''}</span>
            </div>
          </div>
          ${coloresHtml}
        </div>
      `
    }).join('')
    if (!productosHtml.trim()) return ''
    return `
      <div style="margin-bottom:2rem">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:1rem">
          <div style="flex:1;height:2px;background:linear-gradient(90deg,#E91E8C,transparent)"></div>
          <h3 style="font-size:1rem;font-weight:700;color:#E91E8C;white-space:nowrap;padding:0 12px">${suc.nombre.toUpperCase()}</h3>
          <div style="flex:1;height:2px;background:linear-gradient(270deg,#E91E8C,transparent)"></div>
        </div>
        ${productosHtml}
      </div>
    `
  }).join('')
  const contenido = document.getElementById('inv-contenido')
  if (contenido) contenido.innerHTML = html || '<div style="text-align:center;padding:3rem;color:#888"><p>No hay inventario registrado</p></div>'
}

window.editarStock = async (variante_id, sucursal_id, cantidad, minimo) => {
  const nuevaCantidad = prompt('Nueva cantidad:', cantidad)
  if (nuevaCantidad === null) return
  const nuevoMinimo = prompt('Stock minimo de alerta:', minimo)
  if (nuevoMinimo === null) return
  try {
    const res = await fetch(API + '/inventario/actualizar', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ variante_id, sucursal_id, cantidad: parseInt(nuevaCantidad), stock_minimo: parseInt(nuevoMinimo) })
    })
    if (res.ok) {
      const resInv = await fetch(API + '/inventario/')
      window._invData.inventario = await resInv.json()
      renderInventario()
    }
  } catch(e) {
    alert('Error conectando con el servidor')
  }
}

window.mostrarFormInventario = async () => {
  const resSucursales = await fetch(API + '/sucursales/')
  const sucursales = await resSucursales.json()
  const resVariantes = await fetch(API + '/variantes/')
  const variantes = await resVariantes.json()
  window._variantesCache = variantes
  const content = document.getElementById('content')
  content.innerHTML = `
    <div class="table-card" style="padding:2rem;max-width:600px">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('inventario')">← Volver</button>
        <h3>Agregar stock</h3>
      </div>
      <div style="display:grid;gap:1rem">
        <div>
          <label class="form-label">Sucursal *</label>
          <select class="form-input" id="inv-sucursal" required>
            <option value="">Selecciona sucursal...</option>
            ${sucursales.map(s => `<option value="${s.id}">${s.nombre}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="form-label">Buscar producto (nombre, color o talla) *</label>
          <input class="form-input" id="inv-buscar-v" placeholder="Ej: sandalia negro 24" oninput="buscarVariante(this.value, 'inv-v')">
          <div id="inv-v-resultados" style="border:1px solid #ddd;border-radius:6px;max-height:200px;overflow-y:auto;display:none;background:white;margin-top:4px"></div>
          <input type="hidden" id="inv-v">
          <div id="inv-v-seleccionado" style="display:none;margin-top:8px;padding:8px 12px;background:#e8f5e9;border-radius:6px;font-size:0.85rem;color:#2e7d32"></div>
        </div>
        <div>
          <label class="form-label">Cantidad *</label>
          <input class="form-input" id="inv-cantidad" type="number" min="0" placeholder="0" required>
        </div>
        <div>
          <label class="form-label">Stock minimo (alerta)</label>
          <input class="form-input" id="inv-minimo" type="number" min="0" placeholder="3" value="3">
        </div>
      </div>
      <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('inventario')">Cancelar</button>
        <button class="btn btn-primary" onclick="guardarInventario()">Guardar stock</button>
      </div>
    </div>
  `
}

window.guardarInventario = async () => {
  const sucursal_id = document.getElementById('inv-sucursal').value
  const variante_id = document.getElementById('inv-v').value
  const cantidad = document.getElementById('inv-cantidad').value
  const stock_minimo = document.getElementById('inv-minimo').value || 3
  if (!sucursal_id || !variante_id || cantidad === '') {
    alert('Por favor completa todos los campos')
    return
  }
  try {
    const res = await fetch(API + '/inventario/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sucursal_id, variante_id, cantidad: parseInt(cantidad), stock_minimo: parseInt(stock_minimo) })
    })
    if (res.ok) {
      alert('Stock guardado correctamente')
      navegarA('inventario')
    } else {
      alert('Error al guardar stock')
    }
  } catch(e) {
    alert('Error conectando con el servidor')
  }
}

window.mostrarAlertas = async () => {
  const content = document.getElementById('content')
  content.innerHTML = '<p style="padding:2rem;color:#888">Cargando alertas...</p>'
  try {
    const res = await fetch(API + '/inventario/alertas')
    const data = await res.json()
    content.innerHTML = `
      <div style="margin-bottom:1rem;display:flex;align-items:center;gap:1rem">
        <button class="btn btn-secondary" onclick="navegarA('inventario')">← Volver</button>
        <h3 style="color:#f57f17">Productos con stock bajo o agotado (${data.length})</h3>
      </div>
      ${data.length === 0
        ? '<div class="table-card" style="padding:3rem;text-align:center;color:#888"><p>Todo el inventario esta en buen nivel</p></div>'
        : `<div class="table-card"><table>
          <thead><tr><th>Producto</th><th>Color</th><th>Talla</th><th>Sucursal</th><th>Cantidad</th><th>Minimo</th><th>Estado</th><th>Accion</th></tr></thead>
          <tbody>
            ${data.map(i => {
              const cantidad = i.cantidad || 0
              const minimo = i.stock_minimo || 3
              const agotado = cantidad === 0
              return `
                <tr style="background:${agotado ? '#fff5f5' : '#fffdf0'}">
                  <td><strong>${i.variantes && i.variantes.productos ? i.variantes.productos.nombre : '—'}</strong></td>
                  <td>${i.variantes ? i.variantes.color || '—' : '—'}</td>
                  <td>${i.variantes ? i.variantes.talla || '—' : '—'}</td>
                  <td>${i.sucursales ? i.sucursales.nombre || '—' : '—'}</td>
                  <td><strong style="color:${agotado ? '#c62828' : '#f57f17'}">${cantidad}</strong></td>
                  <td>${minimo}</td>
                  <td><span class="badge ${agotado ? 'badge-danger' : 'badge-warning'}">${agotado ? 'Agotado' : 'Stock bajo'}</span></td>
                  <td><button class="btn btn-primary" style="padding:4px 10px;font-size:0.75rem" onclick="editarStock('${i.variante_id}', '${i.sucursal_id}', ${cantidad}, ${minimo})">Reabastecer</button></td>
                </tr>
              `
            }).join('')}
          </tbody></table></div>`}
    `
  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error cargando alertas</p>'
  }
}

window.mostrarAjuste = async () => {
  const resSucursales = await fetch(API + '/sucursales/')
  const sucursales = await resSucursales.json()
  const resVariantes = await fetch(API + '/variantes/')
  const variantes = await resVariantes.json()
  window._variantesCache = variantes
  const content = document.getElementById('content')
  content.innerHTML = `
    <div class="table-card" style="padding:2rem;max-width:600px">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('inventario')">← Volver</button>
        <h3>Ajuste de inventario</h3>
      </div>
      <p style="font-size:0.85rem;color:#888;margin-bottom:1.5rem">Para corregir el inventario despues de un conteo fisico o para corregir errores.</p>
      <div style="display:grid;gap:1rem">
        <div>
          <label class="form-label">Sucursal *</label>
          <select class="form-input" id="aj-sucursal">
            ${sucursales.map(s => `<option value="${s.id}">${s.nombre}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="form-label">Buscar producto (nombre, color o talla) *</label>
          <input class="form-input" id="aj-buscar" placeholder="Ej: sandalia negro 24" oninput="buscarVariante(this.value, 'aj')">
          <div id="aj-resultados" style="border:1px solid #ddd;border-radius:6px;max-height:200px;overflow-y:auto;display:none;background:white;margin-top:4px"></div>
          <input type="hidden" id="aj">
          <div id="aj-seleccionado" style="display:none;margin-top:8px;padding:8px 12px;background:#e8f5e9;border-radius:6px;font-size:0.85rem;color:#2e7d32"></div>
        </div>
        <div>
          <label class="form-label">Cantidad correcta *</label>
          <input class="form-input" id="aj-cantidad" type="number" min="0" placeholder="Cuantos pares hay realmente">
        </div>
        <div>
          <label class="form-label">Motivo</label>
          <select class="form-input" id="aj-motivo">
            <option value="Conteo fisico">Conteo fisico</option>
            <option value="Correccion de error">Correccion de error</option>
            <option value="Merma">Merma o perdida</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
      </div>
      <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('inventario')">Cancelar</button>
        <button class="btn btn-primary" onclick="guardarAjuste()">Guardar ajuste</button>
      </div>
    </div>
  `
}

window.guardarAjuste = async () => {
  const variante_id = document.getElementById('aj').value
  const sucursal_id = document.getElementById('aj-sucursal').value
  const cantidad = document.getElementById('aj-cantidad').value
  const motivo = document.getElementById('aj-motivo').value
  if (!variante_id || !sucursal_id || cantidad === '') {
    alert('Por favor completa todos los campos')
    return
  }
  try {
    const res = await fetch(API + '/movimientos/ajuste', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ variante_id, sucursal_id, cantidad: parseInt(cantidad), motivo })
    })
    const data = await res.json()
    if (data.ok) {
      alert('Ajuste guardado. Anterior: ' + data.cantidad_anterior + ' pares ÔåÆ Nuevo: ' + data.cantidad_nueva + ' pares')
      navegarA('inventario')
    } else {
      alert('Error: ' + JSON.stringify(data))
    }
  } catch(e) {
    alert('Error conectando con el servidor')
  }
}

window.mostrarCambio = async () => {
  const resSucursales = await fetch(API + '/sucursales/')
  const sucursales = await resSucursales.json()
  const resVariantes = await fetch(API + '/variantes/')
  const variantes = await resVariantes.json()
  window._variantesCache = variantes
  const content = document.getElementById('content')
  content.innerHTML = `
    <div class="table-card" style="padding:2rem;max-width:700px">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('inventario')">← Volver</button>
        <h3>Cambio de producto</h3>
      </div>
      <p style="font-size:0.85rem;color:#888;margin-bottom:1.5rem">Cuando un cliente devuelve un producto y se lleva otro. El inventario se ajusta automaticamente.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem">
        <div style="background:#fff8e1;border-radius:8px;padding:1rem;border:1px solid #ffe082">
          <p style="font-weight:600;color:#f57f17;margin-bottom:0.5rem">Producto que REGRESA</p>
          <p style="font-size:0.75rem;color:#888;margin-bottom:0.75rem">El cliente devuelve este par</p>
          <input class="form-input" id="cam-buscar-origen" placeholder="Buscar..." oninput="buscarVariante(this.value, 'cam-origen')">
          <div id="cam-origen-resultados" style="border:1px solid #ddd;border-radius:6px;max-height:180px;overflow-y:auto;display:none;background:white;margin-top:4px"></div>
          <input type="hidden" id="cam-origen">
          <div id="cam-origen-seleccionado" style="display:none;margin-top:8px;padding:6px 10px;background:#fff8e1;border-radius:6px;font-size:0.8rem;color:#f57f17"></div>
        </div>
        <div style="background:#e8f5e9;border-radius:8px;padding:1rem;border:1px solid #a5d6a7">
          <p style="font-weight:600;color:#2e7d32;margin-bottom:0.5rem">Producto que SE LLEVA</p>
          <p style="font-size:0.75rem;color:#888;margin-bottom:0.75rem">El cliente se lleva este par</p>
          <input class="form-input" id="cam-buscar-destino" placeholder="Buscar..." oninput="buscarVariante(this.value, 'cam-destino')">
          <div id="cam-destino-resultados" style="border:1px solid #ddd;border-radius:6px;max-height:180px;overflow-y:auto;display:none;background:white;margin-top:4px"></div>
          <input type="hidden" id="cam-destino">
          <div id="cam-destino-seleccionado" style="display:none;margin-top:8px;padding:6px 10px;background:#e8f5e9;border-radius:6px;font-size:0.8rem;color:#2e7d32"></div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label">Sucursal *</label>
          <select class="form-input" id="cam-sucursal">
            ${sucursales.map(s => `<option value="${s.id}">${s.nombre}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="form-label">Motivo</label>
          <select class="form-input" id="cam-motivo">
            <option value="Talla incorrecta">Talla incorrecta</option>
            <option value="Cambio de modelo">Cambio de modelo</option>
            <option value="Cambio de color">Cambio de color</option>
            <option value="Defecto">Defecto en el producto</option>
            <option value="Preferencia del cliente">Preferencia del cliente</option>
          </select>
        </div>
      </div>
      <div style="display:flex;gap:1rem;justify-content:flex-end">
        <button class="btn btn-secondary" onclick="navegarA('inventario')">Cancelar</button>
        <button class="btn btn-primary" onclick="guardarCambio()">Registrar cambio</button>
      </div>
    </div>
  `
}

window.guardarCambio = async () => {
  const variante_origen_id = document.getElementById('cam-origen').value
  const variante_destino_id = document.getElementById('cam-destino').value
  const sucursal_id = document.getElementById('cam-sucursal').value
  const motivo = document.getElementById('cam-motivo').value
  if (!variante_origen_id || !variante_destino_id || !sucursal_id) {
    alert('Por favor selecciona ambos productos y la sucursal')
    return
  }
  if (variante_origen_id === variante_destino_id) {
    alert('El producto que regresa y el que se lleva deben ser diferentes')
    return
  }
  try {
    const res = await fetch(API + '/movimientos/cambio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ variante_origen_id, variante_destino_id, sucursal_id, motivo })
    })
    const data = await res.json()
    if (data.ok) {
      alert('Cambio registrado. El inventario se actualizo automaticamente.')
      navegarA('inventario')
    } else {
      alert('Error: ' + JSON.stringify(data))
    }
  } catch(e) {
    alert('Error conectando con el servidor')
  }
}

window.buscarVariante = (texto, prefijo) => {
  const variantes = window._variantesCache || []
  const resultadosDiv = document.getElementById(prefijo + '-resultados')
  if (!resultadosDiv) return
  if (!texto || texto.length < 2) {
    resultadosDiv.style.display = 'none'
    return
  }
  const terminos = texto.toLowerCase().split(' ').filter(t => t)
  const filtradas = variantes.filter(v => {
    const nombre = (v.productos ? v.productos.nombre || '' : '').toLowerCase()
    const color = (v.color || '').toLowerCase()
    const talla = (v.talla || '').toLowerCase()
    const sku = (v.sku || '').toLowerCase()
    const completo = nombre + ' ' + color + ' ' + talla + ' ' + sku
    return terminos.every(t => completo.includes(t))
  }).slice(0, 15)

  if (filtradas.length === 0) {
    resultadosDiv.innerHTML = '<div style="padding:10px 14px;color:#888;font-size:0.85rem">No se encontraron resultados</div>'
    resultadosDiv.style.display = 'block'
    return
  }

  const esPedido = prefijo === 'ped-prod'

  resultadosDiv.innerHTML = filtradas.map(v => {
    const nombreCompleto = (v.productos ? v.productos.nombre || '' : '') + ' - ' + v.color + ' - T' + v.talla
    const accion = esPedido
      ? `agregarItemPedido('${v.id}', '${nombreCompleto.replace(/'/g, '')}')`
      : `seleccionarVariante('${v.id}', '${nombreCompleto.replace(/'/g, '')}', '${prefijo}')`
    return `
      <div onclick="${accion}; document.getElementById('${prefijo}-resultados').style.display='none'; document.getElementById('${esPedido ? 'ped-buscar-prod' : prefijo + '-buscar'}') && (document.getElementById('${esPedido ? 'ped-buscar-prod' : prefijo + '-buscar'}').value='')"
           style="padding:10px 14px;cursor:pointer;border-bottom:1px solid #f5f5f5;font-size:0.85rem;display:flex;align-items:center;gap:8px"
           onmouseover="this.style.background='#f5f5f5'"
           onmouseout="this.style.background='white'">
        ${v.color_hex ? '<div style="width:12px;height:12px;border-radius:50%;background:' + v.color_hex + ';border:1px solid #ddd;flex-shrink:0"></div>' : ''}
        <div>
          <strong>${v.productos ? v.productos.nombre || '—' : '—'}</strong>
          <span style="color:#888"> · ${v.color} · Talla ${v.talla}</span>
          <span style="color:#ccc;font-size:0.75rem"> · ${v.sku || ''}</span>
        </div>
      </div>
    `
  }).join('')

  resultadosDiv.style.display = 'block'
}

window.seleccionarVariante = (id, texto, prefijo) => {
  const input = document.getElementById(prefijo)
  if (input) input.value = id
  const selDiv = document.getElementById(prefijo + '-seleccionado')
  if (selDiv) { selDiv.textContent = 'Ô£ô ' + texto; selDiv.style.display = 'block' }
  const resultadosDiv = document.getElementById(prefijo + '-resultados')
  if (resultadosDiv) resultadosDiv.style.display = 'none'
}

function renderVariante(i, datos) {
  const d = datos || {}
  return `
    <div class="variante-item" id="variante-${i}" style="background:#f9f9f9;border-radius:8px;padding:1rem;margin-bottom:1rem;border:1px solid #eee">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem">
        <p style="font-weight:500;color:#333;font-size:0.9rem">Color ${i + 1}</p>
        ${i > 0 ? '<button type="button" onclick="this.closest(\'.variante-item\').remove();actualizarTablaStock()" style="background:none;border:none;color:#E91E8C;cursor:pointer;font-size:0.85rem">Eliminar</button>' : ''}
      </div>
      <div style="margin-bottom:0.75rem">
        <label class="form-label">Paleta de colores</label>
        <div style="display:flex;flex-wrap:wrap;gap:5px">
          ${COLORES_SUGERIDOS.map(c => `
            <div onclick="seleccionarColor(${i}, '${c.hex}', '${c.nombre}')"
                 title="${c.nombre}"
                 style="width:24px;height:24px;background:${c.hex};border-radius:50%;cursor:pointer;border:2px solid #ddd;flex-shrink:0">
            </div>
          `).join('')}
        </div>
      </div>
      <div style="display:grid;grid-template-columns:auto 1fr;gap:1rem;align-items:end">
        <div style="display:flex;align-items:center;gap:8px">
          <input type="color" id="v${i}-hex" value="${d.color_hex || '#000000'}"
                 style="width:40px;height:36px;border:1px solid #ddd;border-radius:6px;cursor:pointer;padding:2px">
          <input class="form-input" id="v${i}-nombre" placeholder="Nombre del color" value="${d.color || ''}" style="width:160px" oninput="actualizarTablaStock()">
        </div>
        <div>
          <input type="file" id="v${i}-imgs" multiple accept="image/*" onchange="previsualizarImagenes(this, ${i})" style="display:none">
          <button type="button" class="btn btn-secondary" onclick="document.getElementById('v${i}-imgs').click()">+ Subir fotos</button>
          <p style="font-size:0.72rem;color:#888;margin-top:4px">Puedes seleccionar varias fotos a la vez</p>
          <div id="v${i}-preview" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
  ${d.foto_url ? `
    <div style="position:relative">
      <img src="${d.foto_url}" style="width:60px;height:60px;object-fit:cover;border-radius:6px;border:2px solid #E91E8C">
      <span style="position:absolute;top:-6px;left:-6px;background:#E91E8C;color:white;font-size:0.55rem;padding:1px 4px;border-radius:100px">PORTADA</span>
    </div>
  ` : ''}
</div>
        </div>
      </div>
    </div>
  `
}

window.mostrarFormProducto = (datos) => {
  if (!datos) window._coloresExistentes = null
  varianteCount = window._coloresExistentes && window._coloresExistentes.length > 0 
  ? window._coloresExistentes.length 
  : 1
  const d = datos || {}
  const content = document.getElementById('content')
  varianteCount = window._coloresExistentes && window._coloresExistentes.length > 0
  ? window._coloresExistentes.length
  : 1
if (!datos) window._coloresExistentes = null
  content.innerHTML = `
    <div class="table-card" style="padding:2rem">
      <h3 style="margin-bottom:1.5rem">${datos ? 'Editar producto' : 'Nuevo producto'}</h3>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label">Nombre del producto *</label>
          <input class="form-input" id="f-nombre" required placeholder="Ej: Sandalia de tacon Valentina" value="${d.nombre || ''}" oninput="actualizarSKU()">
        </div>
        <div>
          <label class="form-label">SKU interno <span style="color:#E91E8C;font-size:0.75rem">(auto-generado)</span></label>
          <div style="display:flex;gap:8px">
            <input class="form-input" id="f-sku" placeholder="Se genera automaticamente" value="${d.sku_interno || ''}">
            <button type="button" class="btn btn-secondary" onclick="regenerarSKU()" style="white-space:nowrap;padding:8px 12px">Regenerar</button>
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label">Marca (visible al cliente)</label>
          <input class="form-input" id="f-marca" placeholder="Ej: Zapatillas May" value="${d.marca || ''}">
        </div>
        <div>
          <label class="form-label">Proveedor (interno)</label>
          <input class="form-input" id="f-proveedor" placeholder="Nombre del proveedor" value="${d.proveedor || ''}" oninput="actualizarSKU()">
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label">Categoria *</label>
          <select class="form-input" id="f-categoria" required onchange="actualizarSKU()">
            <option value="">Selecciona...</option>
            ${CATEGORIAS.map(c => `<option value="${c.value}" ${d.categoria === c.value ? 'selected' : ''}>${c.label}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="form-label">Subcategoria</label>
          <input class="form-input" id="f-subcategoria" placeholder="Ej: Casual, Fiesta, Trabajo" value="${d.subcategoria || ''}">
        </div>
      </div>

      <div style="margin-bottom:1rem">
        <label class="form-label">Descripcion</label>
        <textarea class="form-input" id="f-descripcion" rows="3" placeholder="Describe el producto detalladamente para SEO...">${d.descripcion || ''}</textarea>
      </div>

      <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
        <p style="font-weight:600;margin-bottom:1rem;color:#333">Detalles tecnicos</p>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem">
          <div><label class="form-label">Material</label><input class="form-input" id="f-material" placeholder="Ej: Cuero sintetico" value="${d.material || ''}"></div>
          <div><label class="form-label">Material suela</label><input class="form-input" id="f-suela" placeholder="Ej: Hule" value="${d.material_suela || ''}"></div>
          <div><label class="form-label">Forro</label><input class="form-input" id="f-forro" placeholder="Ej: Textil" value="${d.forro || ''}"></div>
          <div>
            <label class="form-label">Horma</label>
            <select class="form-input" id="f-horma">
              <option value="">Selecciona...</option>
              <option value="normal" ${d.horma === 'normal' ? 'selected' : ''}>Normal</option>
              <option value="reducida" ${d.horma === 'reducida' ? 'selected' : ''}>Reducida</option>
              <option value="amplia" ${d.horma === 'amplia' ? 'selected' : ''}>Amplia</option>
            </select>
          </div>
          <div><label class="form-label">Altura tacon (cm)</label><input class="form-input" id="f-tacon" type="number" step="0.5" placeholder="Ej: 8.5" value="${d.altura_tacon || ''}"></div>
          <div>
            <label class="form-label">Tipo de tacon</label>
            <select class="form-input" id="f-tipotacon">
              <option value="">Selecciona...</option>
              <option value="aguja" ${d.tipo_tacon === 'aguja' ? 'selected' : ''}>Aguja</option>
              <option value="bloque" ${d.tipo_tacon === 'bloque' ? 'selected' : ''}>Bloque</option>
              <option value="cuna" ${d.tipo_tacon === 'cuna' ? 'selected' : ''}>Cuna</option>
              <option value="plataforma" ${d.tipo_tacon === 'plataforma' ? 'selected' : ''}>Plataforma</option>
              <option value="sin_tacon" ${d.tipo_tacon === 'sin_tacon' ? 'selected' : ''}>Sin tacon</option>
            </select>
          </div>
        </div>
      </div>

      <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
        <p style="font-weight:600;margin-bottom:1rem;color:#333">Precios</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
          <div>
            <label class="form-label">Costo (interno, no visible) *</label>
            <input class="form-input" id="f-costo" type="number" step="0.01" required placeholder="0.00" value="${d.costo || ''}">
          </div>
          <div>
            <label class="form-label">Precio menudeo (1 par) *</label>
            <input class="form-input" id="f-menudeo" type="number" step="0.01" required placeholder="0.00" value="${d.precio_menudeo || ''}">
          </div>
        </div>
        <div style="background:#f9f9f9;border-radius:8px;padding:1rem;border:1px solid #eee">
          <p style="font-size:0.85rem;font-weight:600;margin-bottom:0.75rem;color:#333">Precios mayoreo y corrida</p>
          <p style="font-size:0.75rem;color:#888;margin-bottom:1rem">Deja en blanco para calcular automatico. Si pones un valor ese tiene prioridad.</p>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1rem">
            <div>
              <label class="form-label">Mayoreo 3-5 pares variados</label>
              <p style="font-size:0.72rem;color:#888;margin-bottom:4px">Blanco = menudeo - $30</p>
              <input class="form-input" id="f-mayoreo3" type="number" step="0.01" placeholder="Automatico" value="${d.precio_mayoreo3 || ''}">
            </div>
            <div>
              <label class="form-label">Mayoreo 6+ pares variados</label>
              <p style="font-size:0.72rem;color:#888;margin-bottom:4px">Blanco = menudeo - $70</p>
              <input class="form-input" id="f-mayoreo6" type="number" step="0.01" placeholder="Automatico" value="${d.precio_mayoreo6 || ''}">
            </div>
            <div>
              <label class="form-label">Media corrida (6 mismo estilo)</label>
              <p style="font-size:0.72rem;color:#888;margin-bottom:4px">Blanco = menudeo - $110</p>
              <input class="form-input" id="f-corrida" type="number" step="0.01" placeholder="Automatico" value="${d.precio_corrida || ''}">
            </div>
          </div>
          <div style="display:flex;gap:2rem;flex-wrap:wrap;align-items:center">
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
              <input type="checkbox" id="f-corrida-activa" ${d.corrida_activa ? 'checked' : ''}>
              <span class="form-label" style="margin:0">Permite media corrida</span>
            </label>
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
              <input type="checkbox" id="f-oferta" ${d.es_oferta ? 'checked' : ''}>
              <span class="form-label" style="margin:0;color:#E91E8C">Es oferta (sin descuento adicional)</span>
            </label>
          </div>
          <div style="margin-top:1rem;display:flex;gap:2rem;align-items:center;flex-wrap:wrap">
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
              <input type="checkbox" id="f-descuento" onchange="toggleDescuento()" ${d.tiene_descuento ? 'checked' : ''}>
              <span class="form-label" style="margin:0">Tiene descuento</span>
            </label>
            <div id="descuento-pct" style="display:${d.tiene_descuento ? 'flex' : 'none'};align-items:center;gap:6px">
              <input class="form-input" id="f-pct" type="number" min="0" max="100" placeholder="%" style="width:70px" value="${d.porcentaje_descuento || ''}">
              <span class="form-label" style="margin:0">%</span>
            </div>
            <div>
              <label class="form-label">Precio antes (tachado)</label>
              <input class="form-input" id="f-antes" type="number" step="0.01" placeholder="0.00" value="${d.precio_antes || ''}" style="width:130px">
            </div>
          </div>
        </div>
      </div>

      <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
        <p style="font-weight:600;margin-bottom:0.5rem;color:#333">Colores e imagenes</p>
        <p style="font-size:0.8rem;color:#888;margin-bottom:1rem">Selecciona de la paleta o personaliza el color. Sube las fotos de cada color por separado.</p>
        ${d && d.foto_url ? `<img src="${d.foto_url}" style="width:60px;height:60px;object-fit:cover;border-radius:6px;border:1px solid #ddd;margin-top:8px">` : ''}
        <div id="variantes-container">
       ${window._coloresExistentes && window._coloresExistentes.length > 0
    ? window._coloresExistentes.map((c, i) => renderVariante(i, c)).join('')
    : renderVariante(0, null)}
      </div>
        <button type="button" class="btn btn-secondary" onclick="agregarVariante()">+ Agregar otro color</button>
      </div>

      <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
        <p style="font-weight:600;margin-bottom:1rem;color:#333">Tallas disponibles</p>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          ${TALLAS.map(t => `
            <label class="talla-label" style="display:flex;align-items:center;gap:4px;padding:6px 12px;border-radius:6px;cursor:pointer;border:2px solid ${d.tallas_disponibles && d.tallas_disponibles.includes(t) ? '#E91E8C' : 'transparent'};background:${d.tallas_disponibles && d.tallas_disponibles.includes(t) ? '#fce4f3' : '#f5f5f5'}">
              <input type="checkbox" value="${t}" style="display:none" onchange="toggleTalla(this)" ${d.tallas_disponibles && d.tallas_disponibles.includes(t) ? 'checked' : ''}>
              <span>${t}</span>
            </label>
          `).join('')}
        </div>
      </div>

      <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
        <p style="font-weight:600;margin-bottom:0.5rem;color:#333">Stock inicial</p>
        <p style="font-size:0.8rem;color:#888;margin-bottom:1rem">Captura cuantos pares tienes disponibles. Se asignaran a la sucursal seleccionada.</p>
        <div style="margin-bottom:1rem">
          <label class="form-label">Asignar a sucursal</label>
          <select class="form-input" id="f-sucursal-stock" style="max-width:280px">
            <option value="">Cargando sucursales...</option>
          </select>
        </div>
        <div id="stock-inicial-container">
          <p style="color:#888;font-size:0.85rem">Selecciona tallas y agrega colores para ver la tabla de stock inicial</p>
        </div>
      </div>

      <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
        <p style="font-weight:600;margin-bottom:1rem;color:#333">Logistica y SEO</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div>
            <label class="form-label">Peso en kilos (para envio)</label>
            <input class="form-input" id="f-peso" type="number" step="0.01" placeholder="Ej: 0.45" value="${d.peso_gramos ? (d.peso_gramos / 1000).toFixed(2) : ''}">
          </div>
          <div><label class="form-label">Slug URL (para SEO)</label><input class="form-input" id="f-slug" placeholder="Ej: sandalia-tacon-valentina" value="${d.slug || ''}"></div>
          <div><label class="form-label">Meta titulo (SEO)</label><input class="form-input" id="f-metatitulo" placeholder="Ej: Sandalia de tacon Valentina | Zapatillas May" value="${d.meta_titulo || ''}"></div>
          <div><label class="form-label">Meta descripcion (SEO)</label><input class="form-input" id="f-metadesc" placeholder="Descripcion para Google (max 160 caracteres)" value="${d.meta_descripcion || ''}"></div>
        </div>
      </div>

      <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1.5rem">
        <button type="button" class="btn btn-secondary" onclick="navegarA('productos')">Cancelar</button>
        <input type="hidden" id="f-producto-id" value="${d.id || ''}">
        <button type="button" class="btn btn-primary" id="btn-guardar" onclick="guardarProducto()">Guardar producto</button>
      </div>
    </div>
  `

  fetch(API + '/sucursales/').then(r => r.json()).then(sucursales => {
    const sel = document.getElementById('f-sucursal-stock')
    if (sel) sel.innerHTML = sucursales.map(s => `<option value="${s.id}">${s.nombre}</option>`).join('')
  })
}

window.actualizarSKU = async () => {
  const nombre = document.getElementById('f-nombre') ? document.getElementById('f-nombre').value : ''
  const categoria = document.getElementById('f-categoria') ? document.getElementById('f-categoria').value : ''
  const proveedor = document.getElementById('f-proveedor') ? document.getElementById('f-proveedor').value : ''
  const skuInput = document.getElementById('f-sku')
  if (skuInput && !skuInput.value && nombre && categoria && proveedor) {
    try {
      const res = await fetch(API + '/productos/siguiente-sku/' + categoria + '/' + encodeURIComponent(proveedor))
      const data = await res.json()
      skuInput.value = data.sku_base
    } catch(e) {}
  }
}

window.regenerarSKU = async () => {
  const categoria = document.getElementById('f-categoria') ? document.getElementById('f-categoria').value : ''
  const proveedor = document.getElementById('f-proveedor') ? document.getElementById('f-proveedor').value : ''
  if (categoria && proveedor) {
    try {
      const res = await fetch(API + '/productos/siguiente-sku/' + categoria + '/' + encodeURIComponent(proveedor))
      const data = await res.json()
      const skuInput = document.getElementById('f-sku')
      if (skuInput) skuInput.value = data.sku_base
    } catch(e) {}
  } else {
    alert('Selecciona categoria y escribe el proveedor primero')
  }
}

window.seleccionarColor = (idx, hex, nombre) => {
  const hexInput = document.getElementById('v' + idx + '-hex')
  const nombreInput = document.getElementById('v' + idx + '-nombre')
  if (hexInput) hexInput.value = hex
  if (nombreInput) nombreInput.value = nombre
  actualizarTablaStock()
}

window.agregarVariante = () => {
  const i = varianteCount++
  const container = document.getElementById('variantes-container')
  const div = document.createElement('div')
  div.innerHTML = renderVariante(i, null)
  container.appendChild(div.firstElementChild)
}

window.previsualizarImagenes = (input, idx) => {
  const preview = document.getElementById('v' + idx + '-preview')
  if (!preview) return
  
  // Mantener fotos existentes
  const existentes = preview.querySelectorAll('[data-existente]')
  const nuevas = []

  Array.from(input.files).forEach((file, fileIdx) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const div = document.createElement('div')
      div.style.cssText = 'position:relative;cursor:pointer'
      div.dataset.fileIdx = fileIdx
      div.innerHTML = `
        <img src="${e.target.result}" 
             style="width:60px;height:60px;object-fit:cover;border-radius:6px;border:2px solid #ddd"
             onclick="seleccionarPortada(${idx}, this)">
        <button onclick="this.parentElement.remove()" 
                style="position:absolute;top:-6px;right:-6px;background:#c62828;color:white;border:none;border-radius:50%;width:16px;height:16px;cursor:pointer;font-size:0.65rem;display:flex;align-items:center;justify-content:center">✕</button>
      `
      preview.appendChild(div)
      // Primera foto nueva es portada automáticamente si no hay portada
      if (preview.querySelectorAll('.portada-badge').length === 0) {
        seleccionarPortada(idx, div.querySelector('img'))
      }
    }
    reader.readAsDataURL(file)
  })
}

window.seleccionarPortada = (idx, imgEl) => {
  const preview = document.getElementById('v' + idx + '-preview')
  if (!preview) return
  // Quitar badge de todas
  preview.querySelectorAll('.portada-badge').forEach(b => b.remove())
  preview.querySelectorAll('img').forEach(img => img.style.border = '2px solid #ddd')
  // Marcar esta como portada
  imgEl.style.border = '2px solid #E91E8C'
  const badge = document.createElement('span')
  badge.className = 'portada-badge'
  badge.style.cssText = 'position:absolute;top:-6px;left:-6px;background:#E91E8C;color:white;font-size:0.55rem;padding:1px 4px;border-radius:100px;pointer-events:none'
  badge.textContent = 'PORTADA'
  imgEl.parentElement.appendChild(badge)
  // Guardar índice de portada
  imgEl.parentElement.dataset.esPortada = 'true'
  preview.querySelectorAll('[data-es-portada]').forEach(d => {
    if (d !== imgEl.parentElement) delete d.dataset.esPortada
  })
}

window.toggleDescuento = () => {
  const chk = document.getElementById('f-descuento')
  const pct = document.getElementById('descuento-pct')
  if (chk && pct) pct.style.display = chk.checked ? 'flex' : 'none'
}

window.toggleTalla = (input) => {
  const label = input.closest('.talla-label')
  if (input.checked) {
    label.style.borderColor = '#E91E8C'
    label.style.background = '#fce4f3'
  } else {
    label.style.borderColor = 'transparent'
    label.style.background = '#f5f5f5'
  }
  actualizarTablaStock()
}

window.actualizarTablaStock = () => {
  const TALLAS_ORDEN = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Unica']
  const tallas = [...document.querySelectorAll('.talla-label input:checked')]
    .map(i => i.value)
    .sort((a, b) => TALLAS_ORDEN.indexOf(a) - TALLAS_ORDEN.indexOf(b))
  const variantesEls = document.querySelectorAll('.variante-item')
  const colores = []
  variantesEls.forEach(v => {
    const id = v.id.replace('variante-', '')
    const nombre = document.getElementById('v' + id + '-nombre')
    const hex = document.getElementById('v' + id + '-hex')
    if (nombre && nombre.value) colores.push({ nombre: nombre.value, hex: hex ? hex.value : '#000', id })
  })
  const contenedor = document.getElementById('stock-inicial-container')
  if (!contenedor) return
  if (tallas.length === 0 || colores.length === 0) {
    contenedor.innerHTML = '<p style="color:#888;font-size:0.85rem">Selecciona tallas y agrega colores para ver la tabla de stock inicial</p>'
    return
  }
  contenedor.innerHTML = `
    <div style="overflow-x:auto">
      <table style="border-collapse:collapse;width:100%">
        <thead>
          <tr>
            <th style="padding:8px 12px;text-align:left;font-size:0.75rem;color:#888;border-bottom:1px solid #eee">Color</th>
            ${tallas.map(t => `<th style="padding:8px 12px;text-align:center;font-size:0.75rem;color:#888;border-bottom:1px solid #eee">${t}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${colores.map(c => `
            <tr>
              <td style="padding:8px 12px;border-bottom:1px solid #f5f5f5">
                <div style="display:flex;align-items:center;gap:8px">
                  <div style="width:14px;height:14px;border-radius:50%;background:${c.hex};border:1px solid #ddd;flex-shrink:0"></div>
                  <span style="font-size:0.85rem;font-weight:500">${c.nombre}</span>
                </div>
              </td>
              ${tallas.map(t => `
                <td style="padding:6px;border-bottom:1px solid #f5f5f5;text-align:center">
                  <input type="number" min="0" placeholder="0"
                         id="stock-ini-${c.id}-${t.replace('.','_')}"
                         style="width:55px;text-align:center;padding:5px;border:1px solid #ddd;border-radius:6px;font-size:0.85rem">
                </td>
              `).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

async function subirImagenesVariantes() {
  const variantes = document.querySelectorAll('.variante-item')
  const resultado = []
  const coloresExistentes = window._coloresExistentes || []

  for (const v of variantes) {
    const id = v.id.replace('variante-', '')
    const hex = document.getElementById('v' + id + '-hex')
    const nombre = document.getElementById('v' + id + '-nombre')
    const inputImgs = document.getElementById('v' + id + '-imgs')
    const preview = document.getElementById('v' + id + '-preview')

    if (!nombre || !nombre.value) continue

    const urls = []

    // Conservar fotos existentes
    const colorExistente = coloresExistentes.find(c => c.color === nombre.value)
    if (colorExistente && colorExistente.foto_url) {
      urls.push(colorExistente.foto_url)
    }

    // Subir fotos nuevas — portada primero
    if (inputImgs && inputImgs.files.length > 0) {
      const portadaDiv = preview ? preview.querySelector('[data-es-portada="true"]') : null
      const portadaFileIdx = portadaDiv ? parseInt(portadaDiv.dataset.fileIdx) : 0
      const files = Array.from(inputImgs.files)
      
      // Ordenar para que portada vaya primero
      const ordenados = [
        ...files.filter((_, i) => i === portadaFileIdx),
        ...files.filter((_, i) => i !== portadaFileIdx)
      ]

      for (const file of ordenados) {
        const formData = new FormData()
        formData.append('archivo', file)
        try {
          const res = await fetch(API + '/imagenes/subir', { method: 'POST', body: formData })
          const data = await res.json()
          if (data.url) urls.push(data.url)
        } catch(e) {}
      }
    }

    resultado.push({ 
      color: nombre.value, 
      color_hex: hex ? hex.value : '#000000', 
      imagenes: urls 
    })
  }
  return resultado
}

window.guardarProducto = async () => {
  // Leer ID del campo oculto
  const idOculto = document.getElementById('f-producto-id') ? document.getElementById('f-producto-id').value : ''
  if (idOculto) window._productoEditandoId = idOculto
  const nombre = document.getElementById('f-nombre') ? document.getElementById('f-nombre').value : ''
  const costo = document.getElementById('f-costo') ? document.getElementById('f-costo').value : ''
  const precio_menudeo = document.getElementById('f-menudeo') ? document.getElementById('f-menudeo').value : ''
  const categoria = document.getElementById('f-categoria') ? document.getElementById('f-categoria').value : ''

  if (!nombre || !costo || !precio_menudeo || !categoria) {
    alert('Por favor completa los campos obligatorios: Nombre, Categoria, Costo y Precio menudeo')
    return
  }

  const btn = document.getElementById('btn-guardar')
  if (btn) { btn.textContent = 'Guardando...'; btn.disabled = true }

  const tallas = [...document.querySelectorAll('.talla-label input:checked')].map(i => i.value)
  const variantesData = await subirImagenesVariantes()
  const pesoKilos = document.getElementById('f-peso') ? document.getElementById('f-peso').value : ''
  const pesoGramos = pesoKilos ? Math.round(parseFloat(pesoKilos) * 1000) : null

  const producto = {
    nombre,
    sku_interno: document.getElementById('f-sku') ? document.getElementById('f-sku').value || null : null,
    marca: document.getElementById('f-marca') ? document.getElementById('f-marca').value || null : null,
    proveedor: document.getElementById('f-proveedor') ? document.getElementById('f-proveedor').value || null : null,
    categoria,
    subcategoria: document.getElementById('f-subcategoria') ? document.getElementById('f-subcategoria').value || null : null,
    descripcion: document.getElementById('f-descripcion') ? document.getElementById('f-descripcion').value || null : null,
    material: document.getElementById('f-material') ? document.getElementById('f-material').value || null : null,
    material_suela: document.getElementById('f-suela') ? document.getElementById('f-suela').value || null : null,
    forro: document.getElementById('f-forro') ? document.getElementById('f-forro').value || null : null,
    horma: document.getElementById('f-horma') ? document.getElementById('f-horma').value || null : null,
    altura_tacon: document.getElementById('f-tacon') && document.getElementById('f-tacon').value ? parseFloat(document.getElementById('f-tacon').value) : null,
    tipo_tacon: document.getElementById('f-tipotacon') ? document.getElementById('f-tipotacon').value || null : null,
    costo: parseFloat(costo),
    precio_menudeo: parseFloat(precio_menudeo),
    precio_mayoreo3: document.getElementById('f-mayoreo3') && document.getElementById('f-mayoreo3').value ? parseFloat(document.getElementById('f-mayoreo3').value) : null,
    precio_mayoreo6: document.getElementById('f-mayoreo6') && document.getElementById('f-mayoreo6').value ? parseFloat(document.getElementById('f-mayoreo6').value) : null,
    precio_corrida: document.getElementById('f-corrida') && document.getElementById('f-corrida').value ? parseFloat(document.getElementById('f-corrida').value) : null,
    precio_antes: document.getElementById('f-antes') && document.getElementById('f-antes').value ? parseFloat(document.getElementById('f-antes').value) : null,
    tiene_descuento: document.getElementById('f-descuento') ? document.getElementById('f-descuento').checked : false,
    porcentaje_descuento: document.getElementById('f-pct') && document.getElementById('f-pct').value ? parseInt(document.getElementById('f-pct').value) : 0,
    corrida_activa: document.getElementById('f-corrida-activa') ? document.getElementById('f-corrida-activa').checked : false,
    es_oferta: document.getElementById('f-oferta') ? document.getElementById('f-oferta').checked : false,
    tallas_disponibles: tallas,
    peso_gramos: pesoGramos,
    slug: document.getElementById('f-slug') && document.getElementById('f-slug').value ? document.getElementById('f-slug').value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : null,
    meta_titulo: document.getElementById('f-metatitulo') ? document.getElementById('f-metatitulo').value || null : null,
    meta_descripcion: document.getElementById('f-metadesc') ? document.getElementById('f-metadesc').value || null : null,
    imagen_principal: variantesData.length > 0 && variantesData[0].imagenes.length > 0 ? variantesData[0].imagenes[0] : null,
    activo: true,
    nuevo: !window._productoEditandoId
  }

  try {
    console.log('Editando ID:', window._productoEditandoId)
    const method = window._productoEditandoId ? 'PATCH' : 'POST'
    const url = window._productoEditandoId ? API + '/productos/' + window._productoEditandoId : API + '/productos/'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto)
    })

    if (res.ok) {
      const prod = await res.json()
      const pid = window._productoEditandoId || (prod && prod.length > 0 ? prod[0].id : null)

      if (pid && variantesData.length > 0) {
  const tallasGuardar = tallas.length > 0 ? tallas : ['Unica']
  
  // Si estamos editando, obtener variantes existentes
  let varsExistentes = []
  if (window._productoEditandoId) {
    const resVars = await fetch(API + '/variantes/producto/' + pid)
    varsExistentes = await resVars.json()
  }

  for (const v of variantesData) {
    for (const talla of tallasGuardar) {
      // Buscar si ya existe esta variante
      const varExistente = varsExistentes.find(ve => ve.color === v.color && ve.talla === talla)
      
      if (varExistente) {
        // Actualizar solo si hay nueva foto
        const update = { color_hex: v.color_hex }
        if (v.imagenes.length > 0) update.foto_url = v.imagenes[0]
        await fetch(API + '/variantes/' + varExistente.id, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(update)
        })
      } else {
        // Crear nueva variante
        await fetch(API + '/variantes/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ producto_id: pid, color: v.color, color_hex: v.color_hex, talla, foto_url: v.imagenes[0] || null })
        })
      }
    }
  }
}

      const sucursalStock = document.getElementById('f-sucursal-stock') ? document.getElementById('f-sucursal-stock').value : ''
      if (sucursalStock && pid && variantesData.length > 0) {
        const varRes = await fetch(API + '/variantes/producto/' + pid)
        const varsGuardadas = await varRes.json()
        const tallasGuardar = tallas.length > 0 ? tallas : ['Unica']
        for (const v of variantesData) {
          for (const talla of tallasGuardar) {
            const tallaId = talla.replace('.', '_')
            const varIdx = variantesData.indexOf(v)
            const inputStock = document.getElementById('stock-ini-' + varIdx + '-' + tallaId)
            const cantidad = inputStock ? parseInt(inputStock.value) || 0 : 0
            if (cantidad > 0) {
              const varMatch = varsGuardadas.find(vr => vr.color === v.color && vr.talla === talla)
              if (varMatch) {
                await fetch(API + '/inventario/', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ variante_id: varMatch.id, sucursal_id: sucursalStock, cantidad, stock_minimo: 3 })
                })
              }
            }
          }
        }
      }

      alert('Producto guardado correctamente')
      window._productoEditandoId = null
      navegarA('productos')
    } else {
      const err = await res.text()
      alert('Error al guardar: ' + err)
      if (btn) { btn.textContent = 'Guardar producto'; btn.disabled = false }
    }
  } catch(e) {
    alert('Error conectando con el servidor')
    if (btn) { btn.textContent = 'Guardar producto'; btn.disabled = false }
  }
}

window.editarProducto = async (id) => {
  window._coloresExistentes = null
  window._productoEditandoId = null
  try {
    const [resProd, resVars] = await Promise.all([
      fetch(API + '/productos/' + id),
      fetch(API + '/variantes/producto/' + id)
    ])
    const data = await resProd.json()
    const variantes = await resVars.json()

    if (!data || data.length === 0) {
      alert('Producto no encontrado')
      return
    }

    // Solo colores de ESTE producto
    const coloresUnicos = []
    const vistos = new Set()
    variantes
      .filter(v => v.producto_id === id)  // filtro extra de seguridad
      .forEach(v => {
        if (!vistos.has(v.color)) {
          vistos.add(v.color)
          coloresUnicos.push({
            color: v.color,
            color_hex: v.color_hex,
            foto_url: v.foto_url
          })
        }
      })

    window._productoEditandoId = id
    window._coloresExistentes = coloresUnicos.length > 0 ? coloresUnicos : null
    mostrarFormProducto(data[0])
  } catch(e) {
    alert('Error cargando el producto')
  }
}

window.duplicarProducto = async (id) => {
  try {
    const res = await fetch(API + '/productos/' + id)
    const data = await res.json()
    if (data && data.length > 0) {
      const d = Object.assign({}, data[0])
      delete d.id
      delete d.created_at
      delete d.updated_at
      d.nombre = d.nombre + ' (copia)'
      d.slug = d.slug ? d.slug + '-copia' : null
      d.sku_interno = null
      window._productoEditandoId = null
      mostrarFormProducto(d)
    }
  } catch(e) {
    alert('Error duplicando el producto')
  }
}

window.cargarProductosFiltro = (categoria) => {
  cargarProductos(categoria)
}
window.filtrarProductos = () => {
  const buscar = document.getElementById('prod-buscar').value.toLowerCase()
  const filas = document.querySelectorAll('#content tbody tr')
  filas.forEach(fila => {
    const texto = fila.textContent.toLowerCase()
    fila.style.display = texto.includes(buscar) ? '' : 'none'
  })
}

window.toggleProducto = async (id, activo) => {
  const accion = activo ? 'desactivar' : 'activar'
  if (!confirm(activo ? 'Desactivar este producto?' : 'Activar este producto?')) return
  try {
    const res = await fetch(API + '/productos/' + id + '/' + accion, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    })
    if (res.ok) cargarProductos()
    else alert('Error al cambiar el estado')
  } catch(e) {
    alert('Error conectando con el servidor')
  }
}
window.filtrarClientes = () => {
  const buscar = document.getElementById('cli-buscar').value.toLowerCase()
  const tipo = document.getElementById('cli-tipo').value
  const data = window._clientesData || []
  const filtrados = data.filter(c => {
    if (buscar && !c.nombre.toLowerCase().includes(buscar) && !(c.telefono || '').includes(buscar)) return false
    if (tipo && c.tipo !== tipo) return false
    return true
  })
  const tbody = document.getElementById('cli-tbody')
  if (!tbody) return
  tbody.innerHTML = filtrados.length === 0
    ? '<tr><td colspan="6" style="text-align:center;color:#888;padding:2rem">No se encontraron clientes</td></tr>'
    : filtrados.map(c => `
      <tr>
        <td>
          <strong>${c.nombre}</strong>
          ${c.comentarios_internos ? '<br><small style="color:#E91E8C;font-size:0.72rem">­ƒôØ ' + c.comentarios_internos.substring(0, 40) + '...</small>' : ''}
        </td>
        <td>
          ${c.telefono || '—'}
          ${c.telefono ? '<br><a href="https://wa.me/' + (c.lada || '52') + c.telefono.replace(/\D/g,'') + '" target="_blank" style="font-size:0.72rem;color:#25D366;text-decoration:none">WhatsApp</a>' : ''}
        </td>
        <td><span class="badge ${c.tipo === 'mayoreo' ? 'badge-info' : c.tipo === 'zapateria' ? 'badge-warning' : 'badge-success'}">${c.tipo || 'menudeo'}</span></td>
        <td>${c.limite_credito > 0 ? '$' + c.limite_credito + ' / ' + c.dias_credito + ' dias' : 'Sin credito'}</td>
        <td>${c.ciudad || '—'}</td>
        <td style="display:flex;gap:4px;flex-wrap:wrap">
          <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="verCliente('${c.id}')">Ver</button>
          <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="mostrarFormCliente('${c.id}')">Editar</button>
          ${c.telefono ? '<a href="https://wa.me/' + (c.lada || '52') + c.telefono.replace(/\D/g,'') + '" target="_blank" class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem;background:#25D366;color:white;border-color:#25D366">WA</a>' : ''}
        </td>
      </tr>
    `).join('')
}

window.mostrarFormCliente = async (id) => {
  const content = document.getElementById('content')
  let d = {}
  if (id) {
    try {
      const res = await fetch(API + '/clientes/' + id)
      const data = await res.json()
      if (data && data.length > 0) d = data[0]
    } catch(e) {}
  }
  content.innerHTML = `
    <div class="table-card" style="padding:2rem">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('clientes')">← Volver</button>
        <h3>${id ? 'Editar cliente' : 'Nuevo cliente'}</h3>
${d.telefono ? '<a href="https://wa.me/' + (d.lada || '52') + d.telefono.replace(/\D/g,'') + '" target="_blank" class="btn btn-secondary" style="background:#25D366;color:white;border-color:#25D366;margin-left:auto">WhatsApp</a>' : ''}      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label">Nombre completo *</label>
          <input class="form-input" id="cli-nombre" placeholder="Nombre del cliente" value="${d.nombre || ''}">
        </div>
        <div>
          <label class="form-label">Telefono (WhatsApp)</label>
        <div style="display:flex;gap:8px">
        <select class="form-input" id="cli-lada" style="max-width:120px">
            <option value="52" ${(d.lada || '52') === '52' ? 'selected' : ''}>­🇲🇽 +52</option>
            <option value="1" ${d.lada === '1' ? 'selected' : ''}>­🇺🇸 +1</option>
            <option value="1" ${d.lada === '1CA' ? 'selected' : ''}>­🇨🇦 +1</option>
            <option value="34" ${d.lada === '34' ? 'selected' : ''}>🇪🇸 +34</option>
            <option value="57" ${d.lada === '57' ? 'selected' : ''}>­🇨🇴 +57</option>
            <option value="54" ${d.lada === '54' ? 'selected' : ''}>­🇦🇷 +54</option>
            </select>
            <input class="form-input" id="cli-telefono" placeholder="Ej: 4771234567" value="${d.telefono || ''}">
        </div>
          <label class="form-label">Email</label>
          <input class="form-input" id="cli-email" type="email" placeholder="correo@ejemplo.com" value="${d.email || ''}">
        </div>
        <div>
          <label class="form-label">Tipo de cliente *</label>
          <select class="form-input" id="cli-tipo">
            <option value="menudeo" ${d.tipo === 'menudeo' ? 'selected' : ''}>Menudeo</option>
            <option value="mayoreo" ${d.tipo === 'mayoreo' ? 'selected' : ''}>Mayoreo</option>
            <option value="zapateria" ${d.tipo === 'zapateria' ? 'selected' : ''}>Zapateria</option>
          </select>
        </div>
      </div>

      <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
        <p style="font-weight:600;margin-bottom:1rem;color:#333">Direccion de entrega</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div style="grid-column:1/-1">
            <label class="form-label">Calle y numero</label>
            <input class="form-input" id="cli-direccion" placeholder="Ej: Calle Juarez 123 Col. Centro" value="${d.direccion || ''}">
          </div>
          <div>
            <label class="form-label">Ciudad</label>
            <input class="form-input" id="cli-ciudad" placeholder="Ej: Leon" value="${d.ciudad || ''}">
          </div>
          <div>
            <label class="form-label">Estado</label>
            <input class="form-input" id="cli-estado" placeholder="Ej: Guanajuato" value="${d.estado || ''}">
          </div>
          <div>
            <label class="form-label">Codigo postal</label>
            <input class="form-input" id="cli-cp" placeholder="Ej: 37000" value="${d.codigo_postal || ''}">
          </div>
        </div>
      </div>

      <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
        <p style="font-weight:600;margin-bottom:1rem;color:#333">Credito</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div>
            <label class="form-label">Limite de credito ($)</label>
            <input class="form-input" id="cli-credito" type="number" step="0.01" placeholder="0.00" value="${d.limite_credito || '0'}">
          </div>
          <div>
            <label class="form-label">Dias de credito</label>
            <select class="form-input" id="cli-dias">
              <option value="0" ${d.dias_credito === 0 ? 'selected' : ''}>Sin credito</option>
              <option value="15" ${d.dias_credito === 15 ? 'selected' : ''}>15 dias</option>
              <option value="30" ${d.dias_credito === 30 ? 'selected' : ''}>30 dias</option>
              <option value="60" ${d.dias_credito === 60 ? 'selected' : ''}>60 dias</option>
            </select>
          </div>
        </div>
      </div>

      <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
        <p style="font-weight:600;margin-bottom:0.5rem;color:#333">Comentarios internos</p>
        <p style="font-size:0.8rem;color:#888;margin-bottom:0.75rem">Solo visibles para el equipo, el cliente no los ve.</p>
        <textarea class="form-input" id="cli-comentarios" rows="3" placeholder="Ej: Cliente puntual, prefiere envio por Fedex, no le gusta el color cafe...">${d.comentarios_internos || ''}</textarea>
      </div>

      <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('clientes')">Cancelar</button>
        <button class="btn btn-primary" id="btn-cli-guardar" onclick="guardarCliente('${id || ''}')">Guardar cliente</button>
      </div>
    </div>
  `
}

window.guardarCliente = async (id) => {
  const nombre = document.getElementById('cli-nombre').value
  if (!nombre) {
    alert('El nombre del cliente es obligatorio')
    return
  }
  const btn = document.getElementById('btn-cli-guardar')
  if (btn) { btn.textContent = 'Guardando...'; btn.disabled = true }

  const cliente = {
    nombre,
    telefono: document.getElementById('cli-telefono').value || null,
    email: document.getElementById('cli-email').value || null,
    tipo: document.getElementById('cli-tipo').value,
    direccion: document.getElementById('cli-direccion').value || null,
    lada: document.getElementById('cli-lada').value || '52',
    ciudad: document.getElementById('cli-ciudad').value || null,
    estado: document.getElementById('cli-estado').value || null,
    codigo_postal: document.getElementById('cli-cp').value || null,
    limite_credito: parseFloat(document.getElementById('cli-credito').value) || 0,
    dias_credito: parseInt(document.getElementById('cli-dias').value) || 0,
    comentarios_internos: document.getElementById('cli-comentarios').value || null,
    activo: true
  }

  try {
    const method = id ? 'PATCH' : 'POST'
    const url = id ? API + '/clientes/' + id : API + '/clientes/'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente)
    })
    if (res.ok) {
      alert('Cliente guardado correctamente')
      navegarA('clientes')
    } else {
      const err = await res.text()
      alert('Error al guardar: ' + err)
      if (btn) { btn.textContent = 'Guardar cliente'; btn.disabled = false }
    }
  } catch(e) {
    alert('Error conectando con el servidor')
    if (btn) { btn.textContent = 'Guardar cliente'; btn.disabled = false }
  }
}

window.verCliente = async (id) => {
  const content = document.getElementById('content')
  content.innerHTML = '<p style="padding:2rem;color:#888">Cargando...</p>'
  try {
    const res = await fetch(API + '/clientes/' + id)
    const data = await res.json()
    if (!data || data.length === 0) { alert('Cliente no encontrado'); return }
    const c = data[0]
    content.innerHTML = `
      <div class="table-card" style="padding:2rem">
        <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap">
          <button class="btn btn-secondary" onclick="navegarA('clientes')">← Volver</button>
          <h3 style="flex:1">${c.nombre}</h3>
          <button class="btn btn-secondary" onclick="editarCliente('${c.id}')">Editar</button>
          ${c.telefono ? '<a href="https://wa.me/' + (c.lada || '52') + c.telefono.replace(/\D/g,'') + '" target="_blank" class="btn btn-secondary" style="background:#25D366;color:white;border-color:#25D366">WhatsApp</a>' : ''}
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1.5rem;margin-bottom:1.5rem">
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.75rem;color:#888;margin-bottom:4px">Tipo</p>
            <span class="badge ${c.tipo === 'mayoreo' ? 'badge-info' : c.tipo === 'zapateria' ? 'badge-warning' : 'badge-success'}">${c.tipo || 'menudeo'}</span>
          </div>
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.75rem;color:#888;margin-bottom:4px">Telefono</p>
            <p style="font-weight:600">${c.telefono || '—'}</p>
          </div>
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.75rem;color:#888;margin-bottom:4px">Email</p>
            <p style="font-weight:600">${c.email || '—'}</p>
          </div>
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.75rem;color:#888;margin-bottom:4px">Direccion</p>
            <p style="font-weight:600">${c.direccion || '—'}</p>
            <p style="font-size:0.8rem;color:#888">${c.ciudad || ''} ${c.estado || ''} ${c.codigo_postal || ''}</p>
          </div>
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.75rem;color:#888;margin-bottom:4px">Credito</p>
            <p style="font-weight:600">${c.limite_credito > 0 ? '$' + c.limite_credito : 'Sin credito'}</p>
            <p style="font-size:0.8rem;color:#888">${c.dias_credito > 0 ? c.dias_credito + ' dias' : ''}</p>
          </div>
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.75rem;color:#888;margin-bottom:4px">Cliente desde</p>
            <p style="font-weight:600">${c.created_at ? new Date(c.created_at).toLocaleDateString('es-MX') : '—'}</p>
          </div>
        </div>

        ${c.comentarios_internos ? `
          <div style="background:#fff8e1;border-radius:8px;padding:1rem;margin-bottom:1.5rem;border:1px solid #ffe082">
            <p style="font-size:0.75rem;color:#f57f17;font-weight:600;margin-bottom:4px">Comentarios internos</p>
            <p style="color:#555">${c.comentarios_internos}</p>
          </div>
        ` : ''}

        <div style="display:flex;gap:1rem;flex-wrap:wrap">
          <button class="btn btn-primary" onclick="alert('Modulo de pedidos proximamente')">+ Nuevo pedido</button>
          <button class="btn btn-secondary" onclick="alert('Historial proximamente')">Ver historial</button>
        </div>
      </div>
    `
  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error cargando cliente</p>'
  }
}
window.editarCliente = (id) => {
  mostrarFormCliente(id)
}
window.mostrarEntrada = async () => {
  const resSucursales = await fetch(API + '/sucursales/')
  const sucursales = await resSucursales.json()
  const resVariantes = await fetch(API + '/variantes/')
  const variantes = await resVariantes.json()
  window._variantesCache = variantes
  const content = document.getElementById('content')
  content.innerHTML = `
    <div class="table-card" style="padding:2rem;max-width:600px">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('inventario')">← Volver</button>
        <h3 style="color:#2e7d32">+ Entrada de mercancia</h3>
      </div>
      <p style="font-size:0.85rem;color:#888;margin-bottom:1.5rem">Usa esto cuando llega mercancia nueva. Se suma al inventario actual.</p>
      <div style="display:grid;gap:1rem">
        <div>
          <label class="form-label">Sucursal *</label>
          <select class="form-input" id="ent-sucursal">
            ${sucursales.map(s => `<option value="${s.id}">${s.nombre}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="form-label">Buscar producto (nombre, color o talla) *</label>
          <input class="form-input" id="ent-buscar" placeholder="Ej: sandalia negro 24" oninput="buscarVariante(this.value, 'ent')">
          <div id="ent-resultados" style="border:1px solid #ddd;border-radius:6px;max-height:200px;overflow-y:auto;display:none;background:white;margin-top:4px"></div>
          <input type="hidden" id="ent">
          <div id="ent-seleccionado" style="display:none;margin-top:8px;padding:8px 12px;background:#e8f5e9;border-radius:6px;font-size:0.85rem;color:#2e7d32"></div>
        </div>
        <div>
          <label class="form-label">Cantidad que llego *</label>
          <input class="form-input" id="ent-cantidad" type="number" min="1" placeholder="Cuantos pares llegaron">
        </div>
        <div>
          <label class="form-label">Motivo</label>
          <select class="form-input" id="ent-motivo" onchange="toggleSucursalDestino('ent', this.value)">
                <option value="Compra a proveedor">Compra a proveedor</option>
                <option value="Devolucion de cliente">Devolucion de cliente</option>
                <option value="Otro">Otro</option>
       </select>
          <div id="ent-sucursal-destino-container" style="display:none;margin-top:1rem">
         <label class="form-label">Sucursal de origen (de donde viene)</label>
           <select class="form-input" id="ent-sucursal-destino">
         ${sucursales.map(s => `<option value="${s.id}">${s.nombre}</option>`).join('')}
         </select>
        </div>
        </div>
      </div>
      <div style="background:#e8f5e9;border-radius:8px;padding:1rem;margin-top:1rem;border:1px solid #a5d6a7">
        <p style="font-size:0.85rem;color:#2e7d32">El sistema sumara esta cantidad al inventario actual del producto seleccionado.</p>
      </div>
      <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('inventario')">Cancelar</button>
        <button class="btn btn-primary" style="background:#2e7d32;border-color:#2e7d32" onclick="guardarEntrada()">Guardar entrada</button>
      </div>
    </div>
  `
}

window.guardarEntrada = async () => {
  const variante_id = document.getElementById('ent').value
  const sucursal_id = document.getElementById('ent-sucursal').value
  const cantidad = document.getElementById('ent-cantidad').value
  const motivo = document.getElementById('ent-motivo').value
  if (!variante_id || !sucursal_id || !cantidad) {
    alert('Por favor completa todos los campos')
    return
  }
  try {
    const res = await fetch(API + '/movimientos/entrada', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ variante_id, sucursal_id, cantidad: parseInt(cantidad), motivo })
    })
    const data = await res.json()
    if (data.ok) {
      alert('Entrada guardada. Anterior: ' + data.cantidad_anterior + ' pares ÔåÆ Nuevo: ' + data.cantidad_nueva + ' pares')
      navegarA('inventario')
    } else {
      alert('Error: ' + JSON.stringify(data))
    }
  } catch(e) {
    alert('Error conectando con el servidor')
  }
}

window.mostrarSalida = async () => {
  const resSucursales = await fetch(API + '/sucursales/')
  const sucursales = await resSucursales.json()
  const resVariantes = await fetch(API + '/variantes/')
  const variantes = await resVariantes.json()
  window._variantesCache = variantes
  const content = document.getElementById('content')
  content.innerHTML = `
    <div class="table-card" style="padding:2rem;max-width:600px">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('inventario')">← Volver</button>
        <h3 style="color:#c62828">- Salida de inventario</h3>
      </div>
      <p style="font-size:0.85rem;color:#888;margin-bottom:1.5rem">Usa esto para registrar mermas, perdidas o errores. Se resta del inventario actual.</p>
      <div style="display:grid;gap:1rem">
        <div>
          <label class="form-label">Sucursal *</label>
          <select class="form-input" id="sal-sucursal">
            ${sucursales.map(s => `<option value="${s.id}">${s.nombre}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="form-label">Buscar producto (nombre, color o talla) *</label>
          <input class="form-input" id="sal-buscar" placeholder="Ej: sandalia negro 24" oninput="buscarVariante(this.value, 'sal')">
          <div id="sal-resultados" style="border:1px solid #ddd;border-radius:6px;max-height:200px;overflow-y:auto;display:none;background:white;margin-top:4px"></div>
          <input type="hidden" id="sal">
          <div id="sal-seleccionado" style="display:none;margin-top:8px;padding:8px 12px;background:#ffebee;border-radius:6px;font-size:0.85rem;color:#c62828"></div>
        </div>
        <div>
          <label class="form-label">Cantidad a restar *</label>
          <input class="form-input" id="sal-cantidad" type="number" min="1" placeholder="Cuantos pares salen">
        </div>
        <div>
          <label class="form-label">Motivo *</label>
          <select class="form-input" id="sal-motivo" onchange="toggleSucursalDestino('sal', this.value)">
            <option value="Merma">Merma o perdida</option>
             <option value="Producto danado">Producto danado</option>
          <option value="Robo">Robo</option>
          <option value="Correccion de error">Correccion de error</option>
          <option value="Otro">Otro</option>
        </select>
          <div id="sal-sucursal-destino-container" style="display:none;margin-top:1rem">
          <label class="form-label">Sucursal destino (a donde va)</label>
         <select class="form-input" id="sal-sucursal-destino">
       ${sucursales.map(s => `<option value="${s.id}">${s.nombre}</option>`).join('')}
          </select>
        </div>
        </div>
      </div>
      <div style="background:#ffebee;border-radius:8px;padding:1rem;margin-top:1rem;border:1px solid #ffcdd2">
        <p style="font-size:0.85rem;color:#c62828">El sistema restara esta cantidad del inventario actual. Esta accion queda registrada en el historial.</p>
      </div>
      <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('inventario')">Cancelar</button>
        <button class="btn btn-primary" style="background:#c62828;border-color:#c62828" onclick="guardarSalida()">Guardar salida</button>
      </div>
    </div>
  `
}

window.guardarSalida = async () => {
  const variante_id = document.getElementById('sal').value
  const sucursal_id = document.getElementById('sal-sucursal').value
  const cantidad = document.getElementById('sal-cantidad').value
  const motivo = document.getElementById('sal-motivo').value
  if (!variante_id || !sucursal_id || !cantidad) {
    alert('Por favor completa todos los campos')
    return
  }
  try {
    const res = await fetch(API + '/movimientos/entrada', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ variante_id, sucursal_id, cantidad: -parseInt(cantidad), motivo })
    })
    const data = await res.json()
    if (data.ok) {
      alert('Salida registrada. Anterior: ' + data.cantidad_anterior + ' pares ÔåÆ Nuevo: ' + data.cantidad_nueva + ' pares')
      navegarA('inventario')
    } else {
      alert('Error: ' + JSON.stringify(data))
    }
  } catch(e) {
    alert('Error conectando con el servidor')
  }
}
window.mostrarInventarioMasivo = async () => {
  const content = document.getElementById('content')
  content.innerHTML = '<p style="padding:2rem;color:#888">Cargando...</p>'

  try {
    const resSucursales = await fetch(API + '/sucursales/')
    const sucursales = await resSucursales.json()
    const resProductos = await fetch(API + '/productos/')
    const productos = await resProductos.json()
    const resVariantes = await fetch(API + '/variantes/')
    const variantes = await resVariantes.json()
    const resInv = await fetch(API + '/inventario/')
    const inventario = await resInv.json()

    const categorias = [...new Set(productos.map(p => p.categoria).filter(Boolean))]
    const TALLAS_ORDEN = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Unica']

    window._invMasivo = { sucursales, productos, variantes, inventario }

    content.innerHTML = `
      <div style="margin-bottom:1rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap">
        <button class="btn btn-secondary" onclick="navegarA('inventario')">← Volver</button>
        <h3>Inventario masivo</h3>
      </div>
      <div style="background:white;border-radius:12px;padding:1.5rem;border:1px solid #eee;margin-bottom:1rem">
        <div style="display:grid;grid-template-columns:1fr 1fr auto;gap:1rem;align-items:end">
          <div>
            <label class="form-label">Sucursal *</label>
            <select class="form-input" id="im-sucursal" onchange="renderTablasMasivo()">
              ${sucursales.map(s => `<option value="${s.id}">${s.nombre}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="form-label">Categoria</label>
            <select class="form-input" id="im-categoria" onchange="renderTablasMasivo()">
              <option value="">Todas las categorias</option>
              ${categorias.map(c => `<option value="${c}">${c.charAt(0).toUpperCase() + c.slice(1)}</option>`).join('')}
            </select>
          </div>
          <button class="btn btn-primary" onclick="guardarInventarioMasivo()" style="white-space:nowrap">Guardar todo</button>
        </div>
        <p style="font-size:0.8rem;color:#888;margin-top:0.75rem">Los campos muestran el inventario actual. Modifica solo lo que cambio y guarda al final.</p>
      </div>
      <div id="im-tablas"></div>
    `
    renderTablasMasivo()
  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error cargando inventario</p>'
  }
}

window.renderTablasMasivo = () => {
  const { productos, variantes, inventario } = window._invMasivo
  const sucursalId = document.getElementById('im-sucursal').value
  const categoriaFiltro = document.getElementById('im-categoria').value
  const TALLAS_ORDEN = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Unica']

  const productosFiltrados = productos.filter(p => {
    if (categoriaFiltro && p.categoria !== categoriaFiltro) return false
    return true
  })

  const invSucursal = inventario.filter(i => i.sucursal_id === sucursalId)

  const html = productosFiltrados.map(prod => {
    const variantesProd = variantes.filter(v => v.producto_id === prod.id)
    if (variantesProd.length === 0) return ''

    const colores = [...new Set(variantesProd.map(v => v.color).filter(Boolean))]

    const coloresHtml = colores.map(color => {
      const variantesColor = variantesProd
        .filter(v => v.color === color)
        .sort((a, b) => TALLAS_ORDEN.indexOf(a.talla) - TALLAS_ORDEN.indexOf(b.talla))

      const colorHex = variantesColor[0] ? variantesColor[0].color_hex : '#888'

      return `
        <div style="margin-bottom:1rem">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <div style="width:14px;height:14px;border-radius:50%;background:${colorHex};border:1px solid #ddd;flex-shrink:0"></div>
            <span style="font-size:0.85rem;font-weight:500;color:#444">${color}</span>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${variantesColor.map(v => {
              const inv = invSucursal.find(i => i.variante_id === v.id)
              const cantidad = inv ? inv.cantidad : 0
              const minimo = inv ? inv.stock_minimo : 3
              let borderColor = '#ddd'
              if (cantidad === 0) borderColor = '#ffcdd2'
              else if (cantidad <= minimo) borderColor = '#ffe082'
              else borderColor = '#a5d6a7'
              return `
                <div style="text-align:center">
                  <div style="font-size:0.72rem;color:#888;margin-bottom:4px;font-weight:500">${v.talla}</div>
                  <input type="number" min="0"
                         id="im-${v.id}"
                         value="${cantidad}"
                         data-variante="${v.id}"
                         data-anterior="${cantidad}"
                         style="width:58px;text-align:center;padding:6px 4px;border:2px solid ${borderColor};border-radius:8px;font-size:0.9rem;font-weight:600"
                         oninput="this.style.borderColor='#E91E8C'">
                </div>
              `
            }).join('')}
          </div>
        </div>
      `
    }).join('')

    return `
      <div style="background:white;border-radius:12px;padding:1.25rem;margin-bottom:1rem;border:1px solid #eee">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
          <div>
            <span style="font-weight:600;font-size:1rem">${prod.nombre}</span>
            <span style="margin-left:8px;font-size:0.75rem;color:#888;background:#f5f5f5;padding:2px 8px;border-radius:100px">${prod.sku_interno || '—'}</span>
          </div>
        </div>
        ${coloresHtml}
      </div>
    `
  }).join('')

  const tablas = document.getElementById('im-tablas')
  if (tablas) tablas.innerHTML = html || '<div style="padding:2rem;text-align:center;color:#888">No hay productos en esta categoria</div>'
}

window.guardarInventarioMasivo = async () => {
  const sucursalId = document.getElementById('im-sucursal').value
  const inputs = document.querySelectorAll('[data-variante]')
  
  let guardados = 0
  let errores = 0
  let sinCambios = 0

  const btn = document.querySelector('[onclick="guardarInventarioMasivo()"]')
  if (btn) { btn.textContent = 'Guardando...'; btn.disabled = true }

  for (const input of inputs) {
    const varianteId = input.dataset.variante
    const cantidadAnterior = parseInt(input.dataset.anterior) || 0
    const cantidadNueva = parseInt(input.value) || 0

    if (cantidadNueva === cantidadAnterior) { sinCambios++; continue }

    try {
      const res = await fetch(API + '/movimientos/ajuste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variante_id: varianteId,
          sucursal_id: sucursalId,
          cantidad: cantidadNueva,
          motivo: 'Inventario masivo'
        })
      })
      const data = await res.json()
      if (data.ok) {
        guardados++
        input.dataset.anterior = cantidadNueva
        input.style.borderColor = '#a5d6a7'
      } else {
        errores++
        input.style.borderColor = '#ffcdd2'
      }
    } catch(e) {
      errores++
    }
  }

  if (btn) { btn.textContent = 'Guardar todo'; btn.disabled = false }

  if (errores > 0) {
    alert(`Guardados: ${guardados}, Errores: ${errores}, Sin cambios: ${sinCambios}`)
  } else {
    alert(`Inventario actualizado. ${guardados} cambios guardados, ${sinCambios} sin cambios.`)
  }
}
window.mostrarFormSucursal = async (id) => {
  const content = document.getElementById('content')
  let d = {}
  if (id) {
    try {
      const res = await fetch(API + '/sucursales/')
      const data = await res.json()
      d = data.find(s => s.id === id) || {}
    } catch(e) {}
  }
  content.innerHTML = `
    <div class="table-card" style="padding:2rem;max-width:600px">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('sucursales')">← Volver</button>
        <h3>${id ? 'Editar sucursal' : 'Nueva sucursal'}</h3>
      </div>
      <div style="display:grid;gap:1rem">
        <div>
          <label class="form-label">Nombre *</label>
          <input class="form-input" id="suc-nombre" placeholder="Ej: Leon Matriz" value="${d.nombre || ''}">
        </div>
        <div>
          <label class="form-label">Tipo</label>
          <select class="form-input" id="suc-tipo">
            <option value="fisica" ${d.tipo === 'fisica' ? 'selected' : ''}>Fisica</option>
            <option value="online" ${d.tipo === 'online' ? 'selected' : ''}>Online</option>
            <option value="bodega" ${d.tipo === 'bodega' ? 'selected' : ''}>Bodega</option>
          </select>
        </div>
        <div>
          <label class="form-label">Direccion</label>
          <input class="form-input" id="suc-direccion" placeholder="Calle y numero" value="${d.direccion || ''}">
        </div>
        <div>
          <label class="form-label">Telefono</label>
          <input class="form-input" id="suc-telefono" placeholder="Ej: 4771234567" value="${d.telefono || ''}">
        </div>
      </div>
      <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('sucursales')">Cancelar</button>
        <button class="btn btn-primary" onclick="guardarSucursal('${id || ''}')">Guardar</button>
      </div>
    </div>
  `
}

window.guardarSucursal = async (id) => {
  const nombre = document.getElementById('suc-nombre').value
  if (!nombre) { alert('El nombre es obligatorio'); return }
  const sucursal = {
    nombre,
    tipo: document.getElementById('suc-tipo').value,
    direccion: document.getElementById('suc-direccion').value || null,
    telefono: document.getElementById('suc-telefono').value || null
  }
  try {
    const method = id ? 'PATCH' : 'POST'
    const url = id ? API + '/sucursales/' + id : API + '/sucursales/'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sucursal) })
    if (res.ok) { alert('Sucursal guardada'); navegarA('sucursales') }
    else alert('Error al guardar')
  } catch(e) {
    alert('Error conectando con el servidor')
  }
}
window.toggleSucursalDestino = (prefijo, motivo) => {
  const container = document.getElementById(prefijo + '-sucursal-destino-container')
  if (container) {
    container.style.display = motivo === 'Traspaso entre sucursales' ? 'block' : 'none'
  }
}
window.mostrarTraspaso = async () => {
  const resSucursales = await fetch(API + '/sucursales/')
  const sucursales = await resSucursales.json()
  const resVariantes = await fetch(API + '/variantes/')
  const variantes = await resVariantes.json()
  window._variantesCache = variantes

  const content = document.getElementById('content')
  content.innerHTML = `
    <div class="table-card" style="padding:2rem;max-width:600px">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('inventario')">← Volver</button>
        <h3 style="color:#283593">⇄ Traspaso entre sucursales</h3>
      </div>
      <p style="font-size:0.85rem;color:#888;margin-bottom:1.5rem">Mueve inventario de una sucursal a otra. Se resta de origen y se suma en destino.</p>
      <div style="display:grid;gap:1rem">
        <div>
          <label class="form-label">Buscar producto *</label>
          <input class="form-input" id="tra-buscar" placeholder="Ej: sandalia negro 24" oninput="buscarVariante(this.value, 'tra')">
          <div id="tra-resultados" style="border:1px solid #ddd;border-radius:6px;max-height:200px;overflow-y:auto;display:none;background:white;margin-top:4px"></div>
          <input type="hidden" id="tra">
          <div id="tra-seleccionado" style="display:none;margin-top:8px;padding:8px 12px;background:#e8eaf6;border-radius:6px;font-size:0.85rem;color:#283593"></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div style="background:#ffebee;border-radius:8px;padding:1rem;border:1px solid #ffcdd2">
            <label class="form-label" style="color:#c62828">Sucursal origen (sale de aqui)</label>
            <select class="form-input" id="tra-origen">
              ${sucursales.map(s => `<option value="${s.id}">${s.nombre}</option>`).join('')}
            </select>
          </div>
          <div style="background:#e8f5e9;border-radius:8px;padding:1rem;border:1px solid #a5d6a7">
            <label class="form-label" style="color:#2e7d32">Sucursal destino (llega aqui)</label>
            <select class="form-input" id="tra-destino">
              ${sucursales.map(s => `<option value="${s.id}">${s.nombre}</option>`).join('')}
            </select>
          </div>
        </div>
        <div>
          <label class="form-label">Cantidad a traspasar *</label>
          <input class="form-input" id="tra-cantidad" type="number" min="1" placeholder="Cuantos pares">
        </div>
      </div>
      <div style="background:#e8eaf6;border-radius:8px;padding:1rem;margin-top:1rem;border:1px solid #c5cae9">
        <p style="font-size:0.85rem;color:#283593">El sistema verifica que haya suficiente inventario en origen antes de mover.</p>
      </div>
      <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('inventario')">Cancelar</button>
        <button class="btn btn-primary" style="background:#283593;border-color:#283593" onclick="guardarTraspaso()">Confirmar traspaso</button>
      </div>
    </div>
  `
}

window.guardarTraspaso = async () => {
  const variante_id = document.getElementById('tra').value
  const sucursal_origen_id = document.getElementById('tra-origen').value
  const sucursal_destino_id = document.getElementById('tra-destino').value
  const cantidad = document.getElementById('tra-cantidad').value

  if (!variante_id || !sucursal_origen_id || !sucursal_destino_id || !cantidad) {
    alert('Por favor completa todos los campos')
    return
  }

  if (sucursal_origen_id === sucursal_destino_id) {
    alert('La sucursal origen y destino no pueden ser la misma')
    return
  }

  try {
    const res = await fetch(API + '/movimientos/traspaso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        variante_id,
        sucursal_origen_id,
        sucursal_destino_id,
        cantidad: parseInt(cantidad)
      })
    })
    const data = await res.json()
    if (data.ok) {
      alert('Traspaso realizado correctamente. Se movieron ' + data.cantidad_movida + ' pares.')
      navegarA('inventario')
    } else {
      alert('Error: ' + (data.error || JSON.stringify(data)))
    }
  } catch(e) {
    alert('Error conectando con el servidor')
  }
}
async function cargarPedidos() {
  const content = document.getElementById('content')
  try {
    const res = await fetch(API + '/pedidos/')
    const data = await res.json()
    content.innerHTML = `
      <div style="margin-bottom:1rem;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <button class="btn ${true ? 'btn-primary' : 'btn-secondary'}" onclick="cargarPedidosFiltro('')">Todos (${data.length})</button>
        <button class="btn btn-secondary" onclick="cargarPedidosFiltro('sucursal')">Sucursal</button>
        <button class="btn btn-secondary" onclick="cargarPedidosFiltro('whatsapp')">WhatsApp</button>
        <button class="btn btn-secondary" onclick="cargarPedidosFiltro('online')">Online</button>
        <button class="btn btn-secondary" style="background:#fff8e1;border-color:#f57f17;color:#f57f17" onclick="cargarPedidosFiltro('pendiente_pago')">Pendientes SPEI</button>
        <button class="btn btn-secondary" style="background:#e8f5e9;border-color:#2e7d32;color:#2e7d32" onclick="cargarPedidosFiltro('credito')">Creditos</button>
        <button class="btn btn-primary" style="margin-left:auto" onclick="mostrarFormPedido()">+ Nuevo pedido</button>
      </div>
      <div class="table-card">
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Canal</th>
              <th>Total</th>
              <th>Forma de pago</th>
              <th>Status</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${data.length === 0
              ? '<tr><td colspan="7" style="text-align:center;color:#888;padding:2rem">No hay pedidos</td></tr>'
              : data.map(p => {
                const statusColor = {
                  'borrador': 'badge-warning',
                  'pendiente_pago': 'badge-warning',
                  'confirmado': 'badge-success',
                  'cancelado': 'badge-danger',
                  'pagado': 'badge-success'
                }[p.status] || 'badge-warning'
                return `
                  <tr>
                    <td><strong>${p.clientes ? p.clientes.nombre : 'Sin cliente'}</strong></td>
                    <td>${p.canal || '—'}</td>
                    <td><strong>$${p.total || '0'}</strong></td>
                    <td>${p.forma_pago || '—'}</td>
                    <td><span class="badge ${statusColor}">${p.status || 'borrador'}</span></td>
                    <td>${p.created_at ? new Date(p.created_at).toLocaleDateString('es-MX') : '—'}</td>
                    <td>
                      <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="verPedido('${p.id}')">Ver</button>
                    </td>
                  </tr>
                `
              }).join('')}
          </tbody>
        </table>
      </div>
    `
    window._pedidosData = data
  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error conectando con el servidor</p>'
  }
}

window.cargarPedidosFiltro = async (filtro) => {
  const content = document.getElementById('content')
  try {
    const res = await fetch(API + '/pedidos/')
    const data = await res.json()
    let filtrados = data
    if (filtro === 'pendiente_pago') {
      filtrados = data.filter(p => p.status === 'pendiente_pago')
    } else if (filtro === 'credito') {
      filtrados = data.filter(p => p.forma_pago === 'credito')
    } else if (filtro) {
      filtrados = data.filter(p => p.canal === filtro)
    }
    await cargarPedidos()
  } catch(e) {}
}

window.mostrarFormPedido = async () => {
  const content = document.getElementById('content')
  content.innerHTML = '<p style="padding:2rem;color:#888">Cargando...</p>'

  try {
    const resClientes = await fetch(API + '/clientes/')
    const clientes = await resClientes.json()
    const resSucursales = await fetch(API + '/sucursales/')
    const sucursales = await resSucursales.json()
    const resProductos = await fetch(API + '/productos/')
    const productos = await resProductos.json()
    const resVariantes = await fetch(API + '/variantes/')
    const variantes = await resVariantes.json()
    window._variantesCache = variantes
    window._productosCache = productos
    window._pedidoItems = []

    content.innerHTML = `
      <div class="table-card" style="padding:2rem">
        <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
          <button class="btn btn-secondary" onclick="navegarA('pedidos')">← Volver</button>
          <h3>Nuevo pedido</h3>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem">
          <div>
            <label class="form-label">Cliente *</label>
            <select class="form-input" id="ped-cliente" onchange="actualizarTipoCliente()">
              <option value="">Selecciona cliente...</option>
              ${clientes.map(c => `<option value="${c.id}" data-tipo="${c.tipo}" data-telefono="${c.telefono || ''}">${c.nombre} (${c.tipo})</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="form-label">Canal *</label>
            <select class="form-input" id="ped-canal">
              <option value="sucursal">Sucursal</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="online">Online</option>
            </select>
          </div>
          <div>
            <label class="form-label">Sucursal *</label>
            <select class="form-input" id="ped-sucursal">
              ${sucursales.map(s => `<option value="${s.id}">${s.nombre}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="form-label">Forma de pago *</label>
            <select class="form-input" id="ped-pago" onchange="toggleComprobante()">
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="spei">SPEI / Transferencia</option>
              <option value="credito">Credito</option>
              <option value="mercadopago">Mercado Pago</option>
            </select>
          </div>
        </div>

        <div id="spei-info" style="display:none;background:#fff8e1;border-radius:8px;padding:1rem;margin-bottom:1rem;border:1px solid #ffe082">
          <p style="font-size:0.85rem;color:#f57f17;font-weight:600;margin-bottom:4px">Pago por SPEI</p>
          <p style="font-size:0.8rem;color:#888">El pedido quedara pendiente hasta que confirmes el comprobante manualmente. El inventario no se descuenta hasta confirmar.</p>
        </div>

        <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
          <p style="font-weight:600;margin-bottom:1rem;color:#333">Agregar productos</p>
          <div style="display:flex;gap:8px;margin-bottom:1rem">
            <input class="form-input" id="ped-buscar-prod" placeholder="Buscar producto por nombre, color o talla..." style="flex:1" oninput="buscarVariante(this.value, 'ped-prod')">
          </div>
          <div id="ped-prod-resultados" style="border:1px solid #ddd;border-radius:6px;max-height:200px;overflow-y:auto;display:none;background:white;margin-bottom:1rem"></div>
          <input type="hidden" id="ped-prod">
        </div>

        <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
          <p style="font-weight:600;margin-bottom:1rem;color:#333">Productos en el pedido</p>
          <div id="ped-items-lista">
            <p style="color:#888;font-size:0.85rem;text-align:center;padding:1rem">Agrega productos usando el buscador de arriba</p>
          </div>
          <div style="display:flex;justify-content:flex-end;margin-top:1rem;padding-top:1rem;border-top:1px solid #eee">
            <div style="text-align:right">
              <p style="font-size:0.85rem;color:#888">Total del pedido</p>
              <p style="font-size:1.5rem;font-weight:700;color:#E91E8C" id="ped-total">$0.00</p>
            </div>
          </div>
        </div>

        <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
          <label class="form-label">Comentarios internos</label>
          <textarea class="form-input" id="ped-comentarios" rows="2" placeholder="Notas internas del pedido..."></textarea>
        </div>

        <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1.5rem">
          <button class="btn btn-secondary" onclick="navegarA('pedidos')">Cancelar</button>
          <button class="btn btn-primary" id="btn-ped-guardar" onclick="guardarPedido()">Crear pedido</button>
        </div>
      </div>
    `

    document.getElementById('ped-prod-resultados').addEventListener('click', (e) => {
      const item = e.target.closest('[data-variante-id]')
      if (item) {
        const vid = item.dataset.varianteId
        const nombre = item.dataset.nombre
        agregarItemPedido(vid, nombre)
        document.getElementById('ped-prod-resultados').style.display = 'none'
        document.getElementById('ped-buscar-prod').value = ''
      }
    })

  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error cargando formulario de pedido</p>'
  }
}

window.toggleComprobante = () => {
  const pago = document.getElementById('ped-pago').value
  const speiInfo = document.getElementById('spei-info')
  if (speiInfo) speiInfo.style.display = pago === 'spei' ? 'block' : 'none'
}

window.actualizarTipoCliente = () => {
  const select = document.getElementById('ped-cliente')
  const option = select.options[select.selectedIndex]
  window.recalcularTotal()
}

window.agregarItemPedido = async (varianteId, nombre) => {
  const variantes = window._variantesCache || []
  const productos = window._productosCache || []
  const variante = variantes.find(v => v.id === varianteId)
  if (!variante) return

  const sucursalId = document.getElementById('ped-sucursal') ? document.getElementById('ped-sucursal').value : ''

  if (sucursalId) {
    try {
      const resInv = await fetch(API + '/inventario/sucursal/' + sucursalId)
      const inventario = await resInv.json()
      const invVariante = inventario.find(i => i.variante_id === varianteId)
      const existente = window._pedidoItems.find(i => i.variante_id === varianteId)
      console.log('Inventario:', inventario)
      console.log('Buscando variante:', varianteId)
      console.log('Encontrado:', invVariante)
      const cantidadEnCarrito = existente ? existente.cantidad : 0
      const cantidadDisponible = invVariante ? invVariante.cantidad : 0

      if (cantidadDisponible <= cantidadEnCarrito) {
        alert('No hay suficiente existencia de este producto. Disponible: ' + cantidadDisponible + ' pares')
        return
      }
    } catch(e) {
      console.error('Error verificando inventario', e)
    }
  }

  const existente = window._pedidoItems.find(i => i.variante_id === varianteId)
  if (existente) {
    existente.cantidad++
    window.recalcularTotal()
    renderItemsPedido()
    return
  }

  const producto = productos.find(p => p.id === variante.producto_id) || {}
  const precioBase = parseFloat(producto.precio_menudeo) || 0

  window._pedidoItems.push({
    variante_id: varianteId,
    nombre: (producto.nombre || '') + ' - ' + (variante.color || '') + ' - T' + (variante.talla || ''),
    cantidad: 1,
    precio_unitario: precioBase,
    precio_menudeo: precioBase,
    precio_mayoreo3: parseFloat(producto.precio_mayoreo3) || (precioBase - 30),
    precio_mayoreo6: parseFloat(producto.precio_mayoreo6) || (precioBase - 70),
    precio_corrida: parseFloat(producto.precio_corrida) || (precioBase - 110),
    es_oferta: producto.es_oferta || false,
    foto_url: variante.foto_url || producto.imagen_principal || null
  })

  window.recalcularTotal()
  renderItemsPedido()
}

window.renderItemsPedido = () => {
  const lista = document.getElementById('ped-items-lista')
  if (!lista) return

  if (window._pedidoItems.length === 0) {
    lista.innerHTML = '<p style="color:#888;font-size:0.85rem;text-align:center;padding:1rem">Agrega productos usando el buscador de arriba</p>'
    window.recalcularTotal()
    return
  }

  lista.innerHTML = window._pedidoItems.map((item, idx) => `
    <div style="display:flex;align-items:center;gap:12px;padding:12px;background:#f9f9f9;border-radius:8px;margin-bottom:8px;border:1px solid #eee">
      ${item.foto_url ? '<img src="' + item.foto_url + '" style="width:48px;height:48px;object-fit:cover;border-radius:6px;flex-shrink:0">' : '<div style="width:48px;height:48px;background:#eee;border-radius:6px;flex-shrink:0"></div>'}
      <div style="flex:1">
        <p style="font-weight:600;font-size:0.85rem;margin-bottom:4px">${item.nombre}</p>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          <div style="display:flex;align-items:center;gap:4px">
            <button onclick="cambiarCantidadItem(${idx}, -1)" style="background:#eee;border:none;border-radius:4px;width:24px;height:24px;cursor:pointer;font-size:1rem">−</button>
            <span style="font-weight:600;min-width:24px;text-align:center">${item.cantidad}</span>
            <button onclick="cambiarCantidadItem(${idx}, 1)" style="background:#eee;border:none;border-radius:4px;width:24px;height:24px;cursor:pointer;font-size:1rem">+</button>
          </div>
          <span style="color:#888;font-size:0.8rem">×$${item.precio_unitario}</span>
          <strong style="color:#E91E8C">= $${(item.cantidad * item.precio_unitario).toFixed(2)}</strong>
        </div>
      </div>
      <button onclick="eliminarItemPedido(${idx})" style="background:none;border:none;color:#E91E8C;cursor:pointer;font-size:1.2rem">✕</button>
    </div>
  `).join('')

  window.recalcularTotal()
}

window.cambiarCantidadItem = async (idx, delta) => {
  if (delta > 0) {
    const item = window._pedidoItems[idx]
    const sucursalId = document.getElementById('ped-sucursal') ? document.getElementById('ped-sucursal').value : ''
    if (sucursalId) {
      try {
        const resInv = await fetch(API + '/inventario/sucursal/' + sucursalId)
        const inventario = await resInv.json()
        const invVariante = inventario.find(i => i.variante_id === item.variante_id)
        const cantidadDisponible = invVariante ? invVariante.cantidad : 0
        if (item.cantidad >= cantidadDisponible) {
          alert('No hay mas existencia disponible. Maximo: ' + cantidadDisponible + ' pares')
          return
        }
      } catch(e) {}
    }
  }
  window._pedidoItems[idx].cantidad = Math.max(1, window._pedidoItems[idx].cantidad + delta)
  window.recalcularTotal()
  renderItemsPedido()
}

window.guardarPedido = async () => {
  const cliente_id = document.getElementById('ped-cliente').value
  const canal = document.getElementById('ped-canal').value
  const sucursal_id = document.getElementById('ped-sucursal').value
  const forma_pago = document.getElementById('ped-pago').value
  const comentarios = document.getElementById('ped-comentarios').value

  if (!cliente_id) { alert('Selecciona un cliente'); return }
  if (window._pedidoItems.length === 0) { alert('Agrega al menos un producto'); return }

  const btn = document.getElementById('btn-ped-guardar')
  if (btn) { btn.textContent = 'Guardando...'; btn.disabled = true }

  const total = window._pedidoItems.reduce((sum, i) => sum + (i.cantidad * i.precio_unitario), 0)
  const status = forma_pago === 'spei' ? 'pendiente_pago' : 'confirmado'

  try {
    const resPedido = await fetch(API + '/pedidos/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cliente_id,
        canal,
        sucursal_id,
        forma_pago,
        comentarios: comentarios || null,
        total,
        subtotal: total,
        status
      })
    })

    if (!resPedido.ok) {
      alert('Error creando pedido')
      if (btn) { btn.textContent = 'Crear pedido'; btn.disabled = false }
      return
    }

    const pedidoData = await resPedido.json()
    const pedidoId = pedidoData[0].id

    for (const item of window._pedidoItems) {
      await fetch(API + '/pedidos/' + pedidoId + '/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variante_id: item.variante_id,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          subtotal: item.cantidad * item.precio_unitario
        })
      })
    }

    if (forma_pago !== 'spei' && forma_pago !== 'mercadopago') {
      await fetch(API + '/pedidos/' + pedidoId + '/confirmar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forma_pago })
      })
    }

    alert('Pedido creado correctamente')
    window._pedidoItems = []
    verPedido(pedidoId)

  } catch(e) {
    alert('Error conectando con el servidor')
    if (btn) { btn.textContent = 'Crear pedido'; btn.disabled = false }
  }
}

window.verPedido = async (id) => {
  const content = document.getElementById('content')
  content.innerHTML = '<p style="padding:2rem;color:#888">Cargando pedido...</p>'
  try {
    const res = await fetch(API + '/pedidos/' + id)
    const data = await res.json()
    if (!data || data.length === 0) { alert('Pedido no encontrado'); return }
    const p = data[0]
    const items = p.pedido_items || []
    const cliente = p.clientes || {}

    const statusColor = {
      'borrador': '#f57f17',
      'pendiente_pago': '#f57f17',
      'confirmado': '#2e7d32',
      'pagado': '#2e7d32',
      'cancelado': '#c62828'
    }[p.status] || '#888'

    content.innerHTML = `
      <div class="table-card" style="padding:2rem">
        <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap">
          <button class="btn btn-secondary" onclick="navegarA('pedidos')">← Volver</button>
          <h3 style="flex:1">Pedido #${p.id.substring(0,8).toUpperCase()}</h3>
          <span class="badge" style="background:${statusColor}20;color:${statusColor};border:1px solid ${statusColor}40;padding:6px 12px">${p.status}</span>
          ${cliente.telefono ? '<a href="https://wa.me/52' + cliente.telefono.replace(/\D/g,'') + '?text=Hola%20' + encodeURIComponent(cliente.nombre) + '%2C%20tu%20pedido%20est├í%20listo" target="_blank" class="btn btn-secondary" style="background:#25D366;color:white;border-color:#25D366">WhatsApp</a>' : ''}
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1.5rem">
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.75rem;color:#888;margin-bottom:4px">Cliente</p>
            <p style="font-weight:600">${cliente.nombre || 'Mostrador'}</p>
            <p style="font-size:0.8rem;color:#888">${cliente.telefono || ''}</p>
          </div>
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.75rem;color:#888;margin-bottom:4px">Canal y pago</p>
            <p style="font-weight:600">${p.canal || '—'}</p>
            <p style="font-size:0.8rem;color:#888">${p.forma_pago || ''}</p>
          </div>
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.75rem;color:#888;margin-bottom:4px">Total</p>
            <p style="font-weight:700;font-size:1.2rem;color:#E91E8C">$${p.total || '0'}</p>
          </div>
        </div>

        <div style="margin-bottom:1.5rem">
          <p style="font-weight:600;margin-bottom:1rem;color:#333">Productos</p>
          ${items.map(item => {
            const variante = item.variantes || {}
            const producto = variante.productos || {}
            return `
              <div style="display:flex;align-items:center;gap:12px;padding:12px;background:#f9f9f9;border-radius:8px;margin-bottom:8px;border:1px solid #eee">
                ${producto.imagen_principal ? '<img src="' + producto.imagen_principal + '" style="width:48px;height:48px;object-fit:cover;border-radius:6px;flex-shrink:0">' : '<div style="width:48px;height:48px;background:#eee;border-radius:6px;flex-shrink:0"></div>'}
                <div style="flex:1">
                  <p style="font-weight:600;font-size:0.85rem">${producto.nombre || '—'} - ${variante.color || ''} - T${variante.talla || ''}</p>
                  <p style="font-size:0.8rem;color:#888">${item.cantidad} pares ×$${item.precio_unitario}</p>
                </div>
                <strong style="color:#E91E8C">$${item.subtotal}</strong>
              </div>
            `
          }).join('')}
        </div>

        ${p.status === 'pendiente_pago' ? `
          <div style="background:#fff8e1;border-radius:8px;padding:1rem;margin-bottom:1rem;border:1px solid #ffe082">
            <p style="font-weight:600;color:#f57f17;margin-bottom:0.5rem">Pendiente de pago SPEI</p>
            <p style="font-size:0.85rem;color:#888;margin-bottom:1rem">Cuando recibas el comprobante confirma el pago para descontar el inventario.</p>
            <button class="btn btn-primary" onclick="confirmarPagoSPEI('${p.id}')">Confirmar pago recibido</button>
          </div>
        ` : ''}

        ${p.comentarios ? `
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem;margin-bottom:1rem">
            <p style="font-size:0.75rem;color:#888;margin-bottom:4px">Comentarios internos</p>
            <p>${p.comentarios}</p>
          </div>
        ` : ''}

        <div style="display:flex;gap:1rem;flex-wrap:wrap">
          ${p.status !== 'cancelado' && p.status !== 'confirmado' && p.status !== 'pagado' ? '<button class="btn btn-primary" onclick="confirmarPedidoAdmin(\'' + p.id + '\')">Confirmar pedido</button>' : ''}
          <button class="btn btn-secondary" onclick="generarPDFPedido('${p.id}')">Generar PDF</button>
          <button class="btn btn-secondary" onclick="imprimirTicketPOS('${p.id}',${p.total},${p.pedido_items ? p.pedido_items.reduce((s,i)=>s+i.cantidad,0) : 0},'${p.forma_pago||'efectivo'}')">Reimprimir ticket</button>
               </div>
      </div>
    `
  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error cargando pedido</p>'
  }
}

window.confirmarPagoSPEI = async (id) => {
  if (!confirm('Confirmar que recibiste el pago por SPEI?')) return
  try {
    const res = await fetch(API + '/pedidos/' + id + '/confirmar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ forma_pago: 'spei' })
    })
    const data = await res.json()
    if (data.ok) {
      alert('Pago confirmado. Inventario actualizado.')
      verPedido(id)
    } else {
      alert('Error: ' + JSON.stringify(data))
    }
  } catch(e) {
    alert('Error conectando con el servidor')
  }
}

window.confirmarPedidoAdmin = async (id) => {
  if (!confirm('Confirmar este pedido? El inventario se descontara.')) return
  try {
    const res = await fetch(API + '/pedidos/' + id + '/confirmar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ forma_pago: 'efectivo' })
    })
    const data = await res.json()
    if (data.ok) {
      alert('Pedido confirmado correctamente.')
      verPedido(id)
    } else {
      alert('Error: ' + JSON.stringify(data))
    }
  } catch(e) {
    alert('Error conectando con el servidor')
  }
}
window.recalcularTotal = () => {
  const items = window._pedidoItems || []
  const totalPares = items.reduce((sum, i) => sum + i.cantidad, 0)

  items.forEach(item => {
    if (item.es_oferta) {
      item.precio_unitario = item.precio_menudeo
    } else if (totalPares >= 6) {
      item.precio_unitario = item.precio_mayoreo6 || (item.precio_menudeo - 70)
    } else if (totalPares >= 3) {
      item.precio_unitario = item.precio_mayoreo3 || (item.precio_menudeo - 30)
    } else {
      item.precio_unitario = item.precio_menudeo
    }
  })

  const total = items.reduce((sum, i) => sum + (i.cantidad * i.precio_unitario), 0)
  const totalEl = document.getElementById('ped-total')
  if (totalEl) totalEl.textContent = '$' + total.toFixed(2)
}
async function cargarPOS() {
  const content = document.getElementById('content')
  content.innerHTML = '<p style="padding:2rem;color:#888">Cargando punto de venta...</p>'

  try {
    const resProductos = await fetch(API + '/productos/')
    const productos = await resProductos.json()
    const resVariantes = await fetch(API + '/variantes/')
    const variantes = await resVariantes.json()
    const resSucursales = await fetch(API + '/sucursales/')
    const sucursales = await resSucursales.json()
    const resClientes = await fetch(API + '/clientes/')
    const clientes = await resClientes.json()
    const resInv = await fetch(API + '/inventario/')
    const inventario = await resInv.json()

    window._posData = { productos, variantes, sucursales, clientes, inventario }
    window._posCarrito = []
    window._posClienteId = null

    content.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 380px;gap:1rem;height:calc(100vh - 80px)">
        
        <div style="overflow-y:auto;padding-right:0.5rem">
          <div style="background:white;border-radius:12px;padding:1rem;margin-bottom:1rem;border:1px solid #eee;position:sticky;top:0;z-index:10">
            <div style="display:flex;gap:8px;align-items:center;margin-bottom:0.75rem">
              <input class="form-input" id="pos-buscar" placeholder="Buscar por nombre, SKU o modelo..." style="flex:1;font-size:1rem" oninput="buscarPOS(this.value)">
              <select class="form-input" id="pos-sucursal" style="max-width:200px" onchange="actualizarInventarioPOS()">
                ${sucursales.map(s => `<option value="${s.id}">${s.nombre}</option>`).join('')}
              </select>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap" id="pos-categorias">
              <button class="btn btn-primary" style="padding:4px 12px;font-size:0.8rem" onclick="filtrarPOS('')">Todos</button>
              ${[...new Set(productos.map(p => p.categoria).filter(Boolean))].map(c => `
                <button class="btn btn-secondary" style="padding:4px 12px;font-size:0.8rem" onclick="filtrarPOS('${c}')">${c.charAt(0).toUpperCase() + c.slice(1)}</button>
              `).join('')}
            </div>
          </div>
          <div id="pos-productos-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:1rem">
          </div>
        </div>

        <div style="background:white;border-radius:12px;border:1px solid #eee;display:flex;flex-direction:column;overflow:hidden">
          <div style="padding:1rem;border-bottom:1px solid #eee">
            <p style="font-weight:700;font-size:1rem;margin-bottom:0.5rem">Carrito</p>
           <input class="form-input" id="pos-cliente-buscar" placeholder="🔍 Buscar cliente..." style="font-size:0.85rem" oninput="buscarClientePOS(this.value)">
          <div id="pos-cliente-resultados" style="border:1px solid #ddd;border-radius:6px;max-height:180px;overflow-y:auto;display:none;background:white;margin-top:4px;z-index:50;position:relative"></div>
          <input type="hidden" id="pos-cliente">
         <div id="pos-cliente-seleccionado" style="display:none;margin-top:6px;padding:6px 10px;background:#e8f5e9;border-radius:6px;font-size:0.8rem;color:#2e7d32;cursor:pointer" onclick="limpiarClientePOS()">Sin cliente seleccionado — toca para cambiar</div>
          </div>
          
          <div id="pos-carrito-items" style="flex:1;overflow-y:auto;padding:0.75rem">
            <p style="color:#888;font-size:0.85rem;text-align:center;padding:2rem">El carrito esta vacio</p>
          </div>

          <div style="padding:1rem;border-top:1px solid #eee">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem">
              <span style="font-size:0.85rem;color:#888">Total pares: <strong id="pos-total-pares">0</strong></span>
              <span style="font-size:0.85rem;color:#888">Tipo: <strong id="pos-tipo-precio">Menudeo</strong></span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
              <span style="font-weight:600;font-size:1rem">Total:</span>
              <span style="font-weight:700;font-size:1.4rem;color:#E91E8C" id="pos-total">$0.00</span>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">
              <select class="form-input" id="pos-pago" style="background:white;color:#333;font-size:0.85rem;margin-bottom:8px">
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="spei">SPEI</option>
                <option value="credito">Credito</option>
              </select>
            </div>
            <div style="background:#fff8e1;border-radius:8px;padding:10px;margin-bottom:10px;border:1px solid #ffe082">
                   <p style="font-size:0.78rem;font-weight:700;color:#f57f17;margin-bottom:6px">Descuento general</p>
                           <div style="display:flex;align-items:center;gap:8px">
                               <span style="font-size:0.85rem;color:#f57f17;font-weight:600">$</span>
                       <input type="number" min="0" value="0" id="pos-descuento"
           style="width:80px;text-align:center;padding:6px;border:2px solid #f57f17;border-radius:8px;font-size:1rem;font-weight:700;color:#f57f17"
           oninput="aplicarDescuentoPOS(this.value)">
                          <span style="font-size:0.85rem;color:#f57f17;font-weight:600">de descuento por par</span>
                     </div>
                          <p id="pos-descuento-info" style="font-size:0.75rem;color:#888;margin-top:4px"></p>
                      </div>
                 <button class="btn btn-primary" style="width:100%;padding:12px;font-size:1rem;font-weight:600" onclick="cobrarPOS()">
               Cobrar
             </button>
            <button class="btn btn-secondary" style="width:100%;margin-top:6px;font-size:0.85rem" onclick="limpiarCarritoPOS()">
              Limpiar carrito
            </button>
          </div>
        </div>
      </div>
    `

    renderProductosPOS(productos)

  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error cargando punto de venta</p>'
  }
}
window.aplicarDescuentoPOS = (monto) => {
  const descuento = parseFloat(monto) || 0

  window._posCarrito.forEach(item => {
    const totalPares = window._posCarrito.reduce((sum, i) => sum + i.cantidad, 0)
    let precioBase

    if (!item.precio_base_original) {
      // Guardar precio base original la primera vez
      if (item.es_corrida) {
        precioBase = item.precio_corrida
      } else if (totalPares >= 6) {
        precioBase = item.precio_mayoreo6
      } else if (totalPares >= 3) {
        precioBase = item.precio_mayoreo3
      } else {
        precioBase = item.precio_menudeo
      }
      item.precio_base_original = precioBase
    }

    item.precio_unitario = Math.max(0, parseFloat((item.precio_base_original - descuento).toFixed(2)))
    item.precio_manual = descuento > 0
  })

  // Actualizar total
  const total = window._posCarrito.reduce((sum, i) => sum + (i.cantidad * i.precio_unitario), 0)
  const totalEl = document.getElementById('pos-total')
  if (totalEl) totalEl.textContent = '$' + total.toFixed(2)

  // Info
  const infoEl = document.getElementById('pos-descuento-info')
  if (infoEl) {
    const totalPares = window._posCarrito.reduce((sum, i) => sum + i.cantidad, 0)
    infoEl.textContent = descuento > 0
      ? `Ahorro total: $${(descuento * totalPares).toFixed(2)} en ${totalPares} pares`
      : ''
  }

  renderCarritoPOS()

  setTimeout(() => {
    const descEl = document.getElementById('pos-descuento')
    if (descEl) descEl.value = descuento
  }, 50)
}
window.buscarClientePOS = (texto) => {
  const clientes = window._posData ? window._posData.clientes : []
  const resultados = document.getElementById('pos-cliente-resultados')
  if (!resultados) return

  if (!texto || texto.length < 2) {
    resultados.style.display = 'none'
    return
  }

  const filtrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(texto.toLowerCase()) ||
    (c.telefono || '').includes(texto)
  ).slice(0, 8)

  if (filtrados.length === 0) {
    resultados.innerHTML = '<div style="padding:10px 14px;color:#888;font-size:0.85rem">No se encontraron clientes</div>'
    resultados.style.display = 'block'
    return
  }

  resultados.innerHTML = filtrados.map(c => `
    <div onclick="seleccionarClientePOS('${c.id}', '${c.nombre.replace(/'/g, '')}')"
         style="padding:10px 14px;cursor:pointer;border-bottom:1px solid #f5f5f5;font-size:0.85rem"
         onmouseover="this.style.background='#f5f5f5'"
         onmouseout="this.style.background='white'">
      <strong>${c.nombre}</strong>
      <span style="color:#888;font-size:0.75rem"> · ${c.tipo || 'menudeo'}</span>
      ${c.telefono ? '<br><span style="color:#888;font-size:0.72rem">' + c.telefono + '</span>' : ''}
    </div>
  `).join('')

  resultados.style.display = 'block'
}

window.seleccionarClientePOS = (id, nombre) => {
  document.getElementById('pos-cliente').value = id
  document.getElementById('pos-cliente-buscar').value = ''
  document.getElementById('pos-cliente-resultados').style.display = 'none'
  const sel = document.getElementById('pos-cliente-seleccionado')
  sel.textContent = '✔ ' + nombre + ' — toca para cambiar'
  sel.style.display = 'block'
}

window.limpiarClientePOS = () => {
  document.getElementById('pos-cliente').value = ''
  document.getElementById('pos-cliente-seleccionado').style.display = 'none'
  document.getElementById('pos-cliente-buscar').value = ''
  document.getElementById('pos-cliente-buscar').focus()
}

window.renderProductosPOS = (productos) => {
  const { variantes, inventario } = window._posData
  const sucursalId = document.getElementById('pos-sucursal') ? document.getElementById('pos-sucursal').value : ''
  const invSucursal = inventario.filter(i => i.sucursal_id === sucursalId)

  const grid = document.getElementById('pos-productos-grid')
  if (!grid) return

  grid.innerHTML = productos.map(p => {
    const varsProd = variantes.filter(v => v.producto_id === p.id)
    const colores = [...new Set(varsProd.map(v => v.color).filter(Boolean))]
    const totalStock = varsProd.reduce((sum, v) => {
      const inv = invSucursal.find(i => i.variante_id === v.id)
      return sum + (inv ? inv.cantidad : 0)
    }, 0)

    return `
      <div onclick="abrirProductoPOS('${p.id}')"
           style="background:white;border-radius:12px;border:1px solid #eee;cursor:pointer;overflow:hidden;transition:all 0.2s;${totalStock === 0 ? 'opacity:0.5' : ''}"
           onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'"
           onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='none'">
        <div style="position:relative">
          ${p.imagen_principal
            ? `<img src="${p.imagen_principal}" style="width:100%;height:160px;object-fit:cover">`
            : `<div style="width:100%;height:160px;background:linear-gradient(135deg,#f5f5f5,#eee);display:flex;align-items:center;justify-content:center;font-size:2rem">­👠</div>`}
          ${totalStock === 0 ? '<div style="position:absolute;top:8px;right:8px;background:#c62828;color:white;font-size:0.65rem;padding:2px 6px;border-radius:100px">Agotado</div>' : ''}
          ${p.es_oferta ? '<div style="position:absolute;top:8px;left:8px;background:#E91E8C;color:white;font-size:0.65rem;padding:2px 6px;border-radius:100px">Oferta</div>' : ''}
          ${p.nuevo ? '<div style="position:absolute;top:8px;left:8px;background:#2e7d32;color:white;font-size:0.65rem;padding:2px 6px;border-radius:100px">Nuevo</div>' : ''}
        </div>
        <div style="padding:0.75rem">
          <p style="font-weight:600;font-size:0.85rem;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.nombre}</p>
          <p style="font-size:0.72rem;color:#888;margin-bottom:6px">${p.sku_interno || ''}</p>
          <div style="display:flex;gap:4px;margin-bottom:6px;flex-wrap:wrap">
            ${colores.slice(0,5).map(c => {
              const v = varsProd.find(v => v.color === c)
              return `<div style="width:14px;height:14px;border-radius:50%;background:${v ? v.color_hex : '#888'};border:1px solid #ddd" title="${c}"></div>`
            }).join('')}
            ${colores.length > 5 ? `<span style="font-size:0.7rem;color:#888">+${colores.length-5}</span>` : ''}
          </div>
          <p style="font-weight:700;color:#E91E8C;font-size:0.9rem">$${p.precio_menudeo}</p>
        </div>
      </div>
    `
  }).join('')
}

window.buscarPOS = (texto) => {
  const { productos } = window._posData
  if (!texto) {
    renderProductosPOS(productos)
    return
  }
  const terminos = texto.toLowerCase().split(' ').filter(t => t)
  const filtrados = productos.filter(p => {
    const nombre = p.nombre.toLowerCase()
    const sku = (p.sku_interno || '').toLowerCase()
    const cat = (p.categoria || '').toLowerCase()
    const completo = nombre + ' ' + sku + ' ' + cat
    return terminos.every(t => completo.includes(t))
  })
  renderProductosPOS(filtrados)
}

window.filtrarPOS = (categoria) => {
  const { productos } = window._posData
  const filtrados = categoria ? productos.filter(p => p.categoria === categoria) : productos
  renderProductosPOS(filtrados)

  document.querySelectorAll('#pos-categorias button').forEach(btn => {
    btn.className = 'btn btn-secondary'
    btn.style.cssText = 'padding:4px 12px;font-size:0.8rem'
  })
  event.target.className = 'btn btn-primary'
  event.target.style.cssText = 'padding:4px 12px;font-size:0.8rem'
}

window.actualizarInventarioPOS = async () => {
  const sucursalId = document.getElementById('pos-sucursal').value
  try {
    const resInv = await fetch(API + '/inventario/sucursal/' + sucursalId)
    window._posData.inventario = await resInv.json()
    const { productos } = window._posData
    renderProductosPOS(productos)
  } catch(e) {}
}

window.abrirProductoPOS = (productoId) => {
  const { productos, variantes, inventario } = window._posData
  const producto = productos.find(p => p.id === productoId)
  if (!producto) return

  const sucursalId = document.getElementById('pos-sucursal') ? document.getElementById('pos-sucursal').value : ''
  const invSucursal = inventario.filter(i => i.sucursal_id === sucursalId)
  const varsProd = variantes.filter(v => v.producto_id === productoId)
  const colores = [...new Set(varsProd.map(v => v.color).filter(Boolean))]
  const TALLAS_ORDEN = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Unica']

  // Buffer temporal de cantidades seleccionadas
  window._posBuffer = {}

  const modal = document.createElement('div')
  modal.id = 'pos-modal'
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem'
  
  modal.innerHTML = `
    <div style="background:white;border-radius:16px;max-width:640px;width:100%;max-height:90vh;overflow-y:auto;display:flex;flex-direction:column">
      
      <div style="padding:1.25rem 1.5rem;border-bottom:1px solid #eee;display:flex;align-items:center;gap:12px">
        ${producto.imagen_principal ? `<img src="${producto.imagen_principal}" style="width:56px;height:56px;object-fit:cover;border-radius:8px;flex-shrink:0">` : ''}
        <div style="flex:1">
          <p style="font-weight:700;font-size:1rem">${producto.nombre}</p>
          <p style="font-size:0.8rem;color:#888">${producto.sku_interno || ''}</p>
          <p style="font-weight:700;color:#E91E8C">$${producto.precio_menudeo} menudeo</p>
        </div>
        <button onclick="document.getElementById('pos-modal').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:#888;flex-shrink:0">✕</button>
      </div>

      <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee">
        <p style="font-size:0.75rem;color:#888;font-weight:600;margin-bottom:8px">SELECCIONA COLOR</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${colores.map(color => {
            const v = varsProd.find(v => v.color === color)
            const totalStock = varsProd
              .filter(v => v.color === color)
              .reduce((sum, v) => {
                const inv = invSucursal.find(i => i.variante_id === v.id)
                return sum + (inv ? inv.cantidad : 0)
              }, 0)
            return `
              <div onclick="seleccionarColorModalPOS('${productoId}', '${color}')"
                   id="pos-color-btn-${color.replace(/\s/g,'_')}"
                   style="display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;padding:6px 10px;border-radius:8px;border:2px solid ${totalStock === 0 ? '#f5f5f5' : '#ddd'};opacity:${totalStock === 0 ? '0.4' : '1'}">
                <div style="width:24px;height:24px;border-radius:50%;background:${v ? v.color_hex : '#888'};border:2px solid #ddd"></div>
                <span style="font-size:0.65rem;color:#666;white-space:nowrap">${color}</span>
                <span id="pos-color-badge-${color.replace(/\s/g,'_')}" style="font-size:0.6rem;color:#2e7d32;font-weight:700;display:none">0 pares</span>
              </div>
            `
          }).join('')}
        </div>
      </div>

      <div id="pos-tallas-panel" style="padding:1rem 1.5rem;border-bottom:1px solid #eee;min-height:80px">
        <p style="color:#aaa;font-size:0.85rem">← Selecciona un color para ver las tallas</p>
      </div>

      <div id="pos-modal-resumen" style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:none">
      </div>

      <div style="padding:1rem 1.5rem;display:flex;flex-direction:column;gap:8px">
  ${producto.corrida_activa ? `
    <button onclick="mostrarCorridaModalPOS('${productoId}')"
            class="btn btn-secondary"
            style="width:100%;padding:10px;font-size:0.9rem;background:#f3e5f5;border-color:#6a1b9a;color:#6a1b9a">
      📦 Agregar corrida completa
    </button>
  ` : ''}
  <button onclick="confirmarModalPOS('${productoId}')"
          id="pos-btn-confirmar"
          class="btn btn-primary"
          style="width:100%;padding:12px;font-size:1rem"
          disabled>
    Selecciona al menos una talla
  </button>
</div>
  `

  document.body.appendChild(modal)
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove() })
  window._posSeleccion = { productoId, color: null }
}
window.mostrarCorridaModalPOS = (productoId) => {
  const { variantes, inventario } = window._posData
  const sucursalId = document.getElementById('pos-sucursal') ? document.getElementById('pos-sucursal').value : ''
  const invSucursal = inventario.filter(i => i.sucursal_id === sucursalId)
  const TALLAS_ORDEN = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Unica']
  const colores = [...new Set(variantes.filter(v => v.producto_id === productoId).map(v => v.color).filter(Boolean))]

  // Ocultar botón de corrida para que no se pueda volver a presionar
  const btnCorrida = document.querySelector(`button[onclick="mostrarCorridaModalPOS('${productoId}')"]`)
  if (btnCorrida) btnCorrida.style.display = 'none'

  // Resetear selección de color para que confirmar sepa que es corrida
  window._posSeleccion.color = null

  const panel = document.getElementById('pos-tallas-panel')
  if (!panel) return

  panel.innerHTML = `
  <p style="font-size:0.75rem;color:#6a1b9a;font-weight:700;margin-bottom:10px">📦 CORRIDA — edita cantidades por color y talla</p>
  ${colores.map(color => {
    const varsColor = variantes
      .filter(v => v.producto_id === productoId && v.color === color)
      .sort((a, b) => TALLAS_ORDEN.indexOf(a.talla) - TALLAS_ORDEN.indexOf(b.talla))
    return `
      <div style="margin-bottom:1.25rem">
        <p style="font-size:0.85rem;font-weight:700;color:#333;margin-bottom:8px">${color}</p>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${varsColor.map(v => {
            const inv = invSucursal.find(i => i.variante_id === v.id)
            const stock = inv ? inv.cantidad : 0
            return `
              <div style="display:flex;align-items:center;gap:10px;opacity:${stock === 0 ? '0.4' : '1'}">
                <span style="min-width:40px;font-size:0.9rem;font-weight:700;color:#333">${v.talla}</span>
                <span style="font-size:0.72rem;color:#aaa;min-width:50px">Stock: ${stock}</span>
                <div style="display:flex;align-items:center;gap:6px">
                  <button ${stock === 0 ? 'disabled' : ''}
                          onclick="const i=document.getElementById('qty-modal-${v.id}');i.value=Math.max(0,(parseInt(i.value)||0)-1)"
                          style="background:#f0f0f0;border:none;border-radius:8px;width:40px;height:40px;cursor:pointer;font-size:1.3rem;font-weight:700;touch-action:manipulation">−</button>
                  <input type="number" min="0" max="${stock}"
                         value="0"
                         id="qty-modal-${v.id}"
                         ${stock === 0 ? 'disabled' : ''}
                         style="width:56px;height:40px;text-align:center;padding:4px;border:2px solid #6a1b9a;border-radius:8px;font-size:1rem;font-weight:700"
                         oninput="this.value=Math.min(${stock},Math.max(0,parseInt(this.value)||0))">
                  <button ${stock === 0 ? 'disabled' : ''}
                          onclick="const i=document.getElementById('qty-modal-${v.id}');i.value=Math.min(${stock},(parseInt(i.value)||0)+1)"
                          style="background:#f0f0f0;border:none;border-radius:8px;width:40px;height:40px;cursor:pointer;font-size:1.3rem;font-weight:700;touch-action:manipulation">+</button>
                </div>
                ${stock === 0 ? '<span style="font-size:0.7rem;color:#c62828;background:#ffebee;padding:2px 8px;border-radius:100px">Agotado</span>' : ''}
              </div>
            `
          }).join('')}
        </div>
      </div>
    `
  }).join('')}
  <button onclick="confirmarModalPOS('${productoId}')"
          class="btn btn-primary"
          style="width:100%;padding:14px;font-size:1rem;margin-top:8px;background:#6a1b9a;border-color:#6a1b9a">
    ✅ Agregar corrida al carrito
  </button>
  `

  // Ocultar el botón de confirmar normal para que no haya confusión
  const btnConfirmar = document.getElementById('pos-btn-confirmar')
  if (btnConfirmar) btnConfirmar.style.display = 'none'
}

window.seleccionarColorModalPOS = (productoId, color) => {
  const { variantes, inventario } = window._posData
  const sucursalId = document.getElementById('pos-sucursal') ? document.getElementById('pos-sucursal').value : ''
  const invSucursal = inventario.filter(i => i.sucursal_id === sucursalId)
  const TALLAS_ORDEN = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Unica']

  // Guardar cantidades del color anterior antes de cambiar
  if (window._posSeleccion && window._posSeleccion.color) {
    guardarBufferColor(productoId, window._posSeleccion.color)
  }

  // Marcar color activo
  document.querySelectorAll('[id^="pos-color-btn-"]').forEach(el => {
    el.style.borderColor = '#ddd'
    el.style.background = 'transparent'
  })
  const colorEl = document.getElementById('pos-color-btn-' + color.replace(/\s/g,'_'))
  if (colorEl) { colorEl.style.borderColor = '#E91E8C'; colorEl.style.background = '#fce4f3' }

  window._posSeleccion.color = color

  const varsColor = variantes
    .filter(v => v.producto_id === productoId && v.color === color)
    .sort((a, b) => TALLAS_ORDEN.indexOf(a.talla) - TALLAS_ORDEN.indexOf(b.talla))

  // Recuperar cantidades guardadas del buffer
  const bufferColor = window._posBuffer[color] || {}

  const panel = document.getElementById('pos-tallas-panel')
  if (panel) {
    panel.innerHTML = `
      <p style="font-size:0.75rem;color:#888;font-weight:600;margin-bottom:10px">TALLAS — ${color}</p>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${varsColor.map(v => {
          const inv = invSucursal.find(i => i.variante_id === v.id)
          const stock = inv ? inv.cantidad : 0
          const cantidadGuardada = bufferColor[v.id] || 0
          return `
            <div style="display:flex;align-items:center;gap:10px;opacity:${stock === 0 ? '0.4' : '1'}">
              <span style="min-width:44px;font-size:0.9rem;font-weight:700;color:#333">${v.talla}</span>
              <span style="font-size:0.72rem;color:#aaa;min-width:60px">Stock: ${stock}</span>
              <div style="display:flex;align-items:center;gap:6px">
                <button onclick="cambiarCantidadTallaPOS('modal-${v.id}', -1, ${stock})"
                        ${stock === 0 ? 'disabled' : ''}
                        style="background:#f0f0f0;border:none;border-radius:6px;width:30px;height:30px;cursor:pointer;font-size:1.1rem;font-weight:600">−</button>
                <input type="number" min="0" max="${stock}"
                       value="${cantidadGuardada}"
                       id="qty-modal-${v.id}"
                       ${stock === 0 ? 'disabled' : ''}
                       style="width:50px;text-align:center;padding:5px;border:2px solid ${cantidadGuardada > 0 ? '#E91E8C' : '#ddd'};border-radius:8px;font-size:1rem;font-weight:700"
                       oninput="validarCantidadTalla('modal-${v.id}', ${stock}); actualizarBadgeColor('${productoId}', '${color}')">
                <button onclick="cambiarCantidadTallaPOS('modal-${v.id}', 1, ${stock})"
                        ${stock === 0 ? 'disabled' : ''}
                        style="background:#f0f0f0;border:none;border-radius:6px;width:30px;height:30px;cursor:pointer;font-size:1.1rem;font-weight:600">+</button>
              </div>
              ${stock === 0 ? '<span style="font-size:0.7rem;color:#c62828;background:#ffebee;padding:2px 8px;border-radius:100px">Agotado</span>' : ''}
            </div>
          `
        }).join('')}
      </div>
    `
  }
}

window.guardarBufferColor = (productoId, color) => {
  const { variantes } = window._posData
  const varsColor = variantes.filter(v => v.producto_id === productoId && v.color === color)

  if (!window._posBuffer[color]) window._posBuffer[color] = {}

  varsColor.forEach(v => {
    const input = document.getElementById('qty-modal-' + v.id)
    // Sobreescribir, no acumular
    window._posBuffer[color][v.id] = input ? parseInt(input.value) || 0 : 0
  })

  actualizarBadgeColor(productoId, color)
}

window.actualizarBadgeColor = (productoId, color) => {
  // Guardar buffer actual
  const { variantes } = window._posData
  const varsColor = variantes.filter(v => v.producto_id === productoId && v.color === color)
  
  let totalColor = 0
  varsColor.forEach(v => {
    const input = document.getElementById('qty-modal-' + v.id)
    totalColor += input ? parseInt(input.value) || 0 : 0
  })

  // Actualizar badge del color
  const badge = document.getElementById('pos-color-badge-' + color.replace(/\s/g,'_'))
  if (badge) {
    if (totalColor > 0) {
      badge.textContent = totalColor + ' par' + (totalColor > 1 ? 'es' : '')
      badge.style.display = 'block'
    } else {
      badge.style.display = 'none'
    }
  }

  // Actualizar resumen y botón
  actualizarResumenModalPOS(productoId)
}

window.actualizarResumenModalPOS = (productoId) => {
  const { variantes } = window._posData
  
  // Calcular total de todo el buffer + color actual
  let totalPares = 0
  const lineas = []

  // Del buffer guardado
  Object.entries(window._posBuffer).forEach(([color, cantidades]) => {
    Object.entries(cantidades).forEach(([varId, cant]) => {
      if (cant > 0) {
        const v = variantes.find(v => v.id === varId)
        if (v) { lineas.push({ color, talla: v.talla, cantidad: cant }); totalPares += cant }
      }
    })
  })

  // Del color actual en pantalla
  const colorActual = window._posSeleccion ? window._posSeleccion.color : null
  if (colorActual && !window._posBuffer[colorActual]) {
    const varsActual = variantes.filter(v => v.producto_id === productoId && v.color === colorActual)
    varsActual.forEach(v => {
      const input = document.getElementById('qty-modal-' + v.id)
      const cant = input ? parseInt(input.value) || 0 : 0
      if (cant > 0) { lineas.push({ color: colorActual, talla: v.talla, cantidad: cant }); totalPares += cant }
    })
  }

  const resumen = document.getElementById('pos-modal-resumen')
  const btnConfirmar = document.getElementById('pos-btn-confirmar')

  if (totalPares > 0) {
    if (resumen) {
      resumen.style.display = 'block'
      resumen.innerHTML = `
        <p style="font-size:0.75rem;font-weight:700;color:#2e7d32;margin-bottom:8px">🛒 RESUMEN — ${totalPares} pares</p>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${lineas.map(l => `
            <span style="background:#f5f5f5;border-radius:100px;padding:3px 10px;font-size:0.78rem">
              <strong>${l.color}</strong> T${l.talla} × ${l.cantidad}
            </span>
          `).join('')}
        </div>
      `
    }
    if (btnConfirmar) {
      btnConfirmar.textContent = `✅ Agregar ${totalPares} pares al carrito`
      btnConfirmar.disabled = false
    }
  } else {
    if (resumen) resumen.style.display = 'none'
    if (btnConfirmar) {
      btnConfirmar.textContent = 'Selecciona al menos una talla'
      btnConfirmar.disabled = true
    }
  }
}

window.confirmarModalPOS = (productoId) => {
  const esCorrida = window._posSeleccion && window._posSeleccion.color === null
  const { productos, variantes } = window._posData
  const producto = productos.find(p => p.id === productoId)
  if (!producto) return

  // Guardar lo que está visible en pantalla al buffer antes de confirmar
  if (window._posSeleccion && window._posSeleccion.color) {
    guardarBufferColor(productoId, window._posSeleccion.color)
  } else {
    // Es corrida — guardar todos los inputs visibles
    const todosLosInputs = document.querySelectorAll('[id^="qty-modal-"]')
    todosLosInputs.forEach(input => {
      const varId = input.id.replace('qty-modal-', '')
      const v = variantes.find(v => v.id === varId)
      if (!v) return
      const cantidad = parseInt(input.value) || 0
      if (!window._posBuffer[v.color]) window._posBuffer[v.color] = {}
      window._posBuffer[v.color][varId] = cantidad
    })
  }

  // Agregar al carrito SOLO del buffer (sin leer inputs de pantalla otra vez)
  let agregados = 0
  Object.entries(window._posBuffer).forEach(([color, cantidades]) => {
    Object.entries(cantidades).forEach(([varId, cantidad]) => {
      if (cantidad <= 0) return
      const v = variantes.find(v => v.id === varId)
      const existente = window._posCarrito.find(i => i.variante_id === varId)
      if (existente) {
        existente.cantidad += cantidad
      } else {
        window._posCarrito.push({
          variante_id: varId,
          producto_id: productoId,
          nombre: producto.nombre,
          color: v ? v.color : color,
          talla: v ? v.talla : '',
          cantidad,
          precio_menudeo: parseFloat(producto.precio_menudeo) || 0,
          precio_mayoreo3: parseFloat(producto.precio_mayoreo3) || (parseFloat(producto.precio_menudeo) - 30),
          precio_mayoreo6: parseFloat(producto.precio_mayoreo6) || (parseFloat(producto.precio_menudeo) - 70),
          precio_corrida: parseFloat(producto.precio_corrida) || (parseFloat(producto.precio_menudeo) - 110),
          es_oferta: producto.es_oferta || false,
          es_corrida: window._posSeleccion && !window._posSeleccion.color,
          precio_unitario: parseFloat(producto.precio_menudeo) || 0
        })
      }
      agregados++
    })
  })

  if (agregados === 0) {
    alert('Pon al menos 1 par en alguna talla')
    return
  }

  document.getElementById('pos-modal').remove()
  window._posBuffer = {}
  renderCarritoPOS()
}

window.seleccionarColorPOS = (productoId, color) => {
  const { variantes, inventario } = window._posData
  const sucursalId = document.getElementById('pos-sucursal') ? document.getElementById('pos-sucursal').value : ''
  const invSucursal = inventario.filter(i => i.sucursal_id === sucursalId)
  const TALLAS_ORDEN = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Unica']

  document.querySelectorAll('[id^="pos-color-"]').forEach(el => {
    el.style.borderColor = 'transparent'
    el.style.background = 'transparent'
  })
  const colorEl = document.getElementById('pos-color-' + color.replace(/\s/g,'_'))
  if (colorEl) { colorEl.style.borderColor = '#E91E8C'; colorEl.style.background = '#fce4f3' }

  window._posSeleccion.color = color
  window._posSeleccion.talla = null

  const varsColor = variantes
    .filter(v => v.producto_id === productoId && v.color === color)
    .sort((a, b) => TALLAS_ORDEN.indexOf(a.talla) - TALLAS_ORDEN.indexOf(b.talla))

  const imgColor = varsColor[0] ? varsColor[0].foto_url : null
  const modalImg = document.getElementById('pos-modal-img')
  if (modalImg && imgColor) modalImg.src = imgColor

  const container = document.getElementById('pos-tallas-container')
if (container) {
  container.innerHTML = `
    <p style="font-size:0.75rem;color:#888;margin-bottom:6px;font-weight:600">TALLAS Y CANTIDADES</p>
    <div style="display:flex;flex-direction:column;gap:6px">
      ${varsColor.map(v => {
        const inv = invSucursal.find(i => i.variante_id === v.id)
        const cantidad = inv ? inv.cantidad : 0
        const disponible = cantidad > 0
        return `
          <div style="display:flex;align-items:center;gap:8px;opacity:${disponible ? '1' : '0.4'}">
            <span style="min-width:40px;font-size:0.85rem;font-weight:600;color:#333">${v.talla}</span>
            <span style="font-size:0.72rem;color:#888;min-width:60px">Stock: ${cantidad}</span>
            <div style="display:flex;align-items:center;gap:4px">
              <button onclick="cambiarCantidadTallaPOS('${v.id}', -1, ${cantidad})" 
                      ${!disponible ? 'disabled' : ''}
                      style="background:#f0f0f0;border:none;border-radius:4px;width:26px;height:26px;cursor:pointer;font-size:1rem;${!disponible ? 'cursor:not-allowed' : ''}">−</button>
              <input type="number" min="0" max="${cantidad}" value="0"
                     id="qty-${v.id}"
                     ${!disponible ? 'disabled' : ''}
                     style="width:44px;text-align:center;padding:4px;border:1px solid #ddd;border-radius:6px;font-size:0.9rem;font-weight:600"
                     oninput="validarCantidadTalla('${v.id}', ${cantidad})">
              <button onclick="cambiarCantidadTallaPOS('${v.id}', 1, ${cantidad})"
                      ${!disponible ? 'disabled' : ''}
                      style="background:#f0f0f0;border:none;border-radius:4px;width:26px;height:26px;cursor:pointer;font-size:1rem;${!disponible ? 'cursor:not-allowed' : ''}">+</button>
            </div>
            ${!disponible ? '<span style="font-size:0.7rem;color:#c62828;background:#ffebee;padding:2px 6px;border-radius:100px">Agotado</span>' : ''}
          </div>
        `
      }).join('')}
    </div>
    <button onclick="agregarTallasPOS('${productoId}', '${color}')" 
            class="btn btn-primary" 
            style="width:100%;margin-top:12px;padding:10px">
      + Agregar al carrito
    </button>
  `
}

}
window.cambiarCantidadTallaPOS = (varianteId, delta, max) => {
  const input = document.getElementById('qty-' + varianteId)
  if (!input) return
  const nueva = Math.min(max, Math.max(0, (parseInt(input.value) || 0) + delta))
  input.value = nueva
  // Detectar productoId y color del contexto actual
  if (window._posSeleccion) {
    actualizarBadgeColor(window._posSeleccion.productoId, window._posSeleccion.color)
  }
}

window.agregarTallasPOS = (productoId, color) => {
  const { productos, variantes } = window._posData
  const producto = productos.find(p => p.id === productoId)
  if (!producto) return

  const varsColor = variantes.filter(v => v.producto_id === productoId && v.color === color)
  let agregados = 0

  varsColor.forEach(v => {
    const input = document.getElementById('qty-' + v.id)
    const cantidad = input ? parseInt(input.value) || 0 : 0
    if (cantidad <= 0) return

    const existente = window._posCarrito.find(i => i.variante_id === v.id)
    if (existente) {
      existente.cantidad += cantidad
    } else {
      window._posCarrito.push({
        variante_id: v.id,
        producto_id: productoId,
        nombre: producto.nombre,
        color,
        talla: v.talla,
        cantidad,
        precio_menudeo: parseFloat(producto.precio_menudeo) || 0,
        precio_mayoreo3: parseFloat(producto.precio_mayoreo3) || (parseFloat(producto.precio_menudeo) - 30),
        precio_mayoreo6: parseFloat(producto.precio_mayoreo6) || (parseFloat(producto.precio_menudeo) - 70),
        precio_corrida: parseFloat(producto.precio_corrida) || (parseFloat(producto.precio_menudeo) - 110),
        es_oferta: producto.es_oferta || false,
        precio_unitario: parseFloat(producto.precio_menudeo) || 0
      })
    }
    agregados++
  })

  if (agregados === 0) {
    alert('Pon al menos 1 par en alguna talla')
    return
  }

  // Mostrar confirmación sin cerrar modal
  const btn = document.querySelector(`button[onclick="agregarTallasPOS('${productoId}', '${color}')"]`)
  if (btn) {
    btn.textContent = '✅ Agregado — selecciona otro color o cierra'
    btn.style.background = '#2e7d32'
    btn.style.borderColor = '#2e7d32'
    btn.disabled = true
  }

  // Resetear cantidades
  varsColor.forEach(v => {
    const input = document.getElementById('qty-' + v.id)
    if (input) input.value = 0
  })

  // Actualizar resumen en modal
  actualizarResumenModal(productoId)
}
window.actualizarResumenModal = (productoId) => {
  const items = window._posCarrito.filter(i => i.producto_id === productoId)
  const total = items.reduce((sum, i) => sum + i.cantidad, 0)
  
  let resumen = document.getElementById('pos-modal-resumen')
  if (!resumen) {
    resumen = document.createElement('div')
    resumen.id = 'pos-modal-resumen'
    resumen.style.cssText = 'background:#e8f5e9;border-radius:8px;padding:0.75rem;margin-top:10px;border:1px solid #a5d6a7'
    const modalContenido = document.querySelector('#pos-modal > div > div:last-child')
    if (modalContenido) modalContenido.insertBefore(resumen, modalContenido.firstChild)
  }

  resumen.innerHTML = `
    <p style="font-size:0.78rem;font-weight:700;color:#2e7d32;margin-bottom:6px">🛒 En carrito — ${total} pares</p>
    ${items.map(i => `
      <div style="display:flex;justify-content:space-between;font-size:0.78rem;color:#333;margin-bottom:2px">
        <span>${i.color} · T${i.talla}</span>
        <strong>${i.cantidad} par${i.cantidad > 1 ? 'es' : ''}</strong>
      </div>
    `).join('')}
    <button onclick="document.getElementById('pos-modal').remove(); renderCarritoPOS()"
            class="btn btn-primary"
            style="width:100%;margin-top:10px;padding:10px;font-size:0.95rem">
      ✅ Listo — agregar al carrito
    </button>
  `
}

window.seleccionarTallaPOS = (varianteId, talla) => {
  window._posSeleccion.talla = talla
  window._posSeleccion.varianteId = varianteId

  document.querySelectorAll('[id^="pos-talla-"]').forEach(el => {
    el.style.borderColor = '#ddd'
    el.style.background = 'white'
    el.style.color = '#333'
  })
  const tallaEl = document.getElementById('pos-talla-' + talla.replace('.','_'))
  if (tallaEl) {
    tallaEl.style.borderColor = '#E91E8C'
    tallaEl.style.background = '#fce4f3'
    tallaEl.style.color = '#E91E8C'
  }

  const btn = document.getElementById('pos-btn-agregar')
  if (btn) { btn.textContent = '+ Agregar al carrito'; btn.disabled = false }
}

window.agregarAlCarritoPOS = (productoId) => {
  const { productos, variantes } = window._posData
  const { varianteId, color, talla } = window._posSeleccion
  if (!varianteId || !color || !talla) return

  const producto = productos.find(p => p.id === productoId)
  if (!producto) return

  const existente = window._posCarrito.find(i => i.variante_id === varianteId)
  if (existente) {
    existente.cantidad++
  } else {
    window._posCarrito.push({
      variante_id: varianteId,
      producto_id: productoId,
      nombre: producto.nombre,
      color,
      talla,
      cantidad: 1,
      precio_menudeo: parseFloat(producto.precio_menudeo) || 0,
      precio_mayoreo3: parseFloat(producto.precio_mayoreo3) || (parseFloat(producto.precio_menudeo) - 30),
      precio_mayoreo6: parseFloat(producto.precio_mayoreo6) || (parseFloat(producto.precio_menudeo) - 70),
      precio_corrida: parseFloat(producto.precio_corrida) || (parseFloat(producto.precio_menudeo) - 110),
      es_oferta: producto.es_oferta || false,
      precio_unitario: parseFloat(producto.precio_menudeo) || 0
    })
  }

  document.getElementById('pos-modal').remove()
  renderCarritoPOS()
}

window.agregarCorridaPOS = (productoId) => {
  const { productos, variantes, inventario } = window._posData
  const { color } = window._posSeleccion
  if (!color) { alert('Selecciona un color primero'); return }

  const producto = productos.find(p => p.id === productoId)
  const sucursalId = document.getElementById('pos-sucursal') ? document.getElementById('pos-sucursal').value : ''
  const invSucursal = inventario.filter(i => i.sucursal_id === sucursalId)
  const TALLAS_ORDEN = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Unica']

  const varsColor = variantes
    .filter(v => v.producto_id === productoId && v.color === color)
    .sort((a, b) => TALLAS_ORDEN.indexOf(a.talla) - TALLAS_ORDEN.indexOf(b.talla))

  // Mostrar modal editable de corrida
  const modal = document.getElementById('pos-modal')
  const contenido = modal.querySelector('div > div:last-child')
  
  const corridaHTML = `
    <div style="background:#f3e5f5;border-radius:8px;padding:1rem;margin-top:1rem;border:1px solid #ce93d8">
      <p style="font-weight:700;color:#6a1b9a;margin-bottom:0.75rem">✏️ Editar corrida — ${color}</p>
      <p style="font-size:0.75rem;color:#888;margin-bottom:0.75rem">Ajusta las cantidades por talla</p>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${varsColor.map(v => {
          const inv = invSucursal.find(i => i.variante_id === v.id)
          const stock = inv ? inv.cantidad : 0
          return `
            <div style="display:flex;align-items:center;gap:8px">
              <span style="min-width:40px;font-size:0.85rem;font-weight:600">${v.talla}</span>
              <span style="font-size:0.72rem;color:#888;min-width:55px">Stock: ${stock}</span>
              <div style="display:flex;align-items:center;gap:4px">
                <button onclick="cambiarCantidadTallaPOS('corrida-${v.id}', -1, ${stock})"
                        style="background:#f0f0f0;border:none;border-radius:4px;width:26px;height:26px;cursor:pointer">−</button>
                <input type="number" min="0" max="${stock}" value="${stock > 0 ? 1 : 0}"
                       id="qty-corrida-${v.id}"
                       style="width:44px;text-align:center;padding:4px;border:1px solid #ddd;border-radius:6px;font-size:0.9rem;font-weight:600"
                       oninput="validarCantidadTalla('corrida-${v.id}', ${stock})">
                <button onclick="cambiarCantidadTallaPOS('corrida-${v.id}', 1, ${stock})"
                        style="background:#f0f0f0;border:none;border-radius:4px;width:26px;height:26px;cursor:pointer">+</button>
              </div>
              ${stock === 0 ? '<span style="font-size:0.7rem;color:#c62828">Sin stock</span>' : ''}
            </div>
          `
        }).join('')}
      </div>
      <button onclick="confirmarCorridaPOS('${productoId}', '${color}')"
              class="btn btn-primary"
              style="width:100%;margin-top:12px;background:#6a1b9a;border-color:#6a1b9a">
        ✅ Confirmar corrida
      </button>
    </div>
  `

  if (contenido) contenido.insertAdjacentHTML('beforeend', corridaHTML)
}

window.confirmarCorridaPOS = (productoId, color) => {
  const { productos, variantes } = window._posData
  const producto = productos.find(p => p.id === productoId)
  const varsColor = variantes.filter(v => v.producto_id === productoId && v.color === color)

  let agregados = 0
  varsColor.forEach(v => {
    const input = document.getElementById('qty-corrida-' + v.id)
    const cantidad = input ? parseInt(input.value) || 0 : 0
    if (cantidad <= 0) return

    const existente = window._posCarrito.find(i => i.variante_id === v.id)
    if (existente) {
      existente.cantidad += cantidad
      existente.es_corrida = true
    } else {
      window._posCarrito.push({
        variante_id: v.id,
        producto_id: productoId,
        nombre: producto.nombre,
        color,
        talla: v.talla,
        cantidad,
        precio_menudeo: parseFloat(producto.precio_menudeo) || 0,
        precio_mayoreo3: parseFloat(producto.precio_mayoreo3) || (parseFloat(producto.precio_menudeo) - 30),
        precio_mayoreo6: parseFloat(producto.precio_mayoreo6) || (parseFloat(producto.precio_menudeo) - 70),
        precio_corrida: parseFloat(producto.precio_corrida) || (parseFloat(producto.precio_menudeo) - 110),
        es_oferta: producto.es_oferta || false,
        es_corrida: true,
        precio_unitario: parseFloat(producto.precio_menudeo) || 0
      })
    }
    agregados++
  })

  document.getElementById('pos-modal').remove()
  renderCarritoPOS()
}

window.renderCarritoPOS = () => {
  const items = window._posCarrito
  const container = document.getElementById('pos-carrito-items')
  if (!container) return

  const totalPares = items.reduce((sum, i) => sum + i.cantidad, 0)

  items.forEach(item => {
    if (item.precio_manual) return  // respetar precio editado manualmente
    if (item.es_oferta) {
      item.precio_unitario = item.precio_menudeo
    } else if (item.es_corrida) {
      item.precio_unitario = item.precio_corrida
    } else if (totalPares >= 6) {
      item.precio_unitario = item.precio_mayoreo6
    } else if (totalPares >= 3) {
      item.precio_unitario = item.precio_mayoreo3
    } else {
      item.precio_unitario = item.precio_menudeo
    }
  })

  // Calcular total DESPUÉS de actualizar precios
  const total = items.reduce((sum, i) => sum + (i.cantidad * i.precio_unitario), 0)
  const tipoPrecio = items.some(i => i.es_corrida) ? 'Corrida' : totalPares >= 6 ? 'Mayoreo 6+' : totalPares >= 3 ? 'Mayoreo 3+' : 'Menudeo'

  // Separar normales y corridas
  const itemsNormales = items.filter(i => !i.es_corrida)
  const itemsCorrida = items.filter(i => i.es_corrida)

  // Agrupar corridas por producto+color
  const corridasAgrupadas = {}
  itemsCorrida.forEach(i => {
    const key = i.producto_id + '|' + i.color
    if (!corridasAgrupadas[key]) {
      corridasAgrupadas[key] = {
        nombre: i.nombre,
        color: i.color,
        producto_id: i.producto_id,
        tallas: [],
        subtotal: 0
      }
    }
    corridasAgrupadas[key].tallas.push({ talla: i.talla, cantidad: i.cantidad, variante_id: i.variante_id })
    corridasAgrupadas[key].subtotal += i.cantidad * i.precio_unitario
  })

  if (items.length === 0) {
    container.innerHTML = '<p style="color:#888;font-size:0.85rem;text-align:center;padding:2rem">El carrito esta vacio</p>'
  } else {
    container.innerHTML = `
      ${itemsNormales.map((item) => `
  <div style="padding:10px;border-bottom:1px solid #f5f5f5">
    <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:6px">
      <div style="flex:1">
        <p style="font-size:0.9rem;font-weight:600">${item.nombre}</p>
        <p style="font-size:0.78rem;color:#888">${item.color} · T${item.talla}</p>
      </div>
      <button onclick="eliminarItemPOS(${items.indexOf(item)})" style="background:none;border:none;color:#ccc;cursor:pointer;font-size:1.2rem;padding:0 4px">✕</button>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center">
      <div style="display:flex;align-items:center;gap:8px">
        <button onclick="cambiarCantidadPOS(${items.indexOf(item)}, -1)" style="background:#f5f5f5;border:none;border-radius:8px;width:44px !important;height:44px !important;min-width:44px;min-height:44px;cursor:pointer;font-size:1.4rem;font-weight:700;touch-action:manipulation;display:flex;align-items:center;justify-content:center">−</button>
        <span style="font-size:1rem;font-weight:700;min-width:24px;text-align:center">${item.cantidad}</span>
        <button onclick="cambiarCantidadPOS(${items.indexOf(item)}, 1)" style="background:#f5f5f5;border:none;border-radius:8px;width:44px !important;height:44px !important;min-width:44px;min-height:44px;cursor:pointer;font-size:1.4rem;font-weight:700;touch-action:manipulation;display:flex;align-items:center;justify-content:center">+</button>
      </div>
      <div style="text-align:right">
        <div style="display:flex;align-items:center;gap:4px;justify-content:flex-end">
          <span style="font-size:0.72rem;color:#888">$</span>
          <input type="number" value="${item.precio_unitario}"
                 onchange="editarPrecioPOS(${items.indexOf(item)}, this.value)"
                 style="width:64px;text-align:center;border:1px solid #E91E8C;border-radius:6px;padding:3px 4px;font-size:0.9rem;font-weight:700;color:#E91E8C">
          <span style="font-size:0.72rem;color:#888">/par</span>
        </div>
        <p id="subtotal-item-${items.indexOf(item)}" style="font-size:0.95rem;font-weight:700;color:#E91E8C;margin-top:2px">$${(item.cantidad * item.precio_unitario).toFixed(2)}</p>
      </div>
    </div>
  </div>
`).join('')}

      ${Object.entries(corridasAgrupadas).map(([key, corrida]) => `
  <div style="padding:10px;border-bottom:1px solid #f5f5f5;background:#fdf4ff" data-corrida-key="${key}">
    <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:6px">
      <div style="flex:1">
        <p style="font-size:0.9rem;font-weight:700">${corrida.nombre}</p>
        <p style="font-size:0.78rem;color:#6a1b9a;font-weight:600">📦 Corrida · ${corrida.color}</p>
        <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">
          ${corrida.tallas.map(t => `
            <span style="background:#f3e5f5;border-radius:100px;padding:2px 8px;font-size:0.72rem;color:#6a1b9a">
              T${t.talla} ×${t.cantidad}
            </span>
          `).join('')}
        </div>
      </div>
      <button onclick="eliminarCorridaPOS('${key}')" style="background:none;border:none;color:#ccc;cursor:pointer;font-size:1.2rem;padding:0 4px">✕</button>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;flex-wrap:wrap;gap:8px">
      <button onclick="editarCorridaEnCarrito('${key}')"
              style="background:#f3e5f5;border:1px solid #ce93d8;border-radius:6px;padding:6px 12px;font-size:0.78rem;color:#6a1b9a;cursor:pointer">
        ✏️ Editar corrida
      </button>
      <div style="display:flex;align-items:center;gap:6px">
        <span style="font-size:0.78rem;color:#888">$</span>
        <input type="number" value="${(corrida.subtotal / corrida.tallas.reduce((s,t)=>s+t.cantidad,0)).toFixed(2)}"
               onchange="editarPrecioCorridaPOS('${key}', this.value)"
               style="width:64px;text-align:center;border:1px solid #6a1b9a;border-radius:6px;padding:3px 4px;font-size:0.9rem;font-weight:700;color:#6a1b9a">
        <span style="font-size:0.72rem;color:#888">/par</span>
      </div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px">
      <span style="font-size:0.78rem;color:#888">${corrida.tallas.reduce((s,t) => s+t.cantidad, 0)} pares</span>
      <p id="subtotal-corrida-${key.replace('|', '-')}" style="font-size:0.95rem;font-weight:700;color:#6a1b9a">$${corrida.subtotal.toFixed(2)}</p>
    </div>
  </div>
`).join('')}
    `
  }

  const totalEl = document.getElementById('pos-total')
  const paresEl = document.getElementById('pos-total-pares')
  const tipoEl = document.getElementById('pos-tipo-precio')
  if (totalEl) totalEl.textContent = '$' + total.toFixed(2)
  if (paresEl) paresEl.textContent = totalPares
  if (tipoEl) tipoEl.textContent = tipoPrecio
}
window.editarPrecioPOS = (idx, nuevoPrecio) => {
  if (!window._posCarrito[idx]) return
  const precio = parseFloat(nuevoPrecio) || 0
  window._posCarrito[idx].precio_unitario = precio
  window._posCarrito[idx].precio_manual = true

  // Actualizar subtotal del item
  const cantidad = window._posCarrito[idx].cantidad
  const subtotalEl = document.getElementById('subtotal-item-' + idx)
  if (subtotalEl) subtotalEl.textContent = '$' + (cantidad * precio).toFixed(2)

  // Actualizar total general
  const total = window._posCarrito.reduce((sum, i) => sum + (i.cantidad * i.precio_unitario), 0)
  const totalEl = document.getElementById('pos-total')
  if (totalEl) totalEl.textContent = '$' + total.toFixed(2)
}

window.editarPrecioCorridaPOS = (key, nuevoPrecioPorPar) => {
  const [producto_id, color] = key.split('|')
  const precio = parseFloat(nuevoPrecioPorPar) || 0

  window._posCarrito.forEach(i => {
    if (i.producto_id === producto_id && i.color === color && i.es_corrida) {
      i.precio_unitario = precio
      i.precio_manual = true
    }
  })

  // Actualizar subtotal de la corrida
  const corridaItems = window._posCarrito.filter(i => i.producto_id === producto_id && i.color === color && i.es_corrida)
  const subtotal = corridaItems.reduce((sum, i) => sum + (i.cantidad * i.precio_unitario), 0)
  const subtotalEl = document.getElementById('subtotal-corrida-' + key.replace('|', '-'))
  if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2)

  // Actualizar total general
  const total = window._posCarrito.reduce((sum, i) => sum + (i.cantidad * i.precio_unitario), 0)
  const totalEl = document.getElementById('pos-total')
  if (totalEl) totalEl.textContent = '$' + total.toFixed(2)
}

window.editarCorridaEnCarrito = (key) => {
  const [producto_id, color] = key.split('|')
  const { inventario, variantes } = window._posData
  const sucursalId = document.getElementById('pos-sucursal') ? document.getElementById('pos-sucursal').value : ''
  const invSucursal = inventario.filter(i => i.sucursal_id === sucursalId)
  const TALLAS_ORDEN = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Unica']

  const varsColor = variantes
    .filter(v => v.producto_id === producto_id && v.color === color)
    .sort((a, b) => TALLAS_ORDEN.indexOf(a.talla) - TALLAS_ORDEN.indexOf(b.talla))

  const modal = document.createElement('div')
  modal.id = 'pos-modal-editar-corrida'
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem'
  modal.innerHTML = `
    <div style="background:white;border-radius:16px;max-width:400px;width:100%;padding:1.5rem;max-height:90vh;overflow-y:auto">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <p style="font-weight:700;color:#6a1b9a">✏️ Editar corrida · ${color}</p>
        <button onclick="document.getElementById('pos-modal-editar-corrida').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:#888">✕</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px">
        ${varsColor.map(v => {
          const inv = invSucursal.find(i => i.variante_id === v.id)
          const stock = inv ? inv.cantidad : 0
          const enCarrito = window._posCarrito.find(i => i.variante_id === v.id && i.es_corrida)
          const cantActual = enCarrito ? enCarrito.cantidad : 0
          return `
            <div style="display:flex;align-items:center;gap:10px">
              <span style="min-width:44px;font-size:0.9rem;font-weight:700">T${v.talla}</span>
              <span style="font-size:0.72rem;color:#aaa;min-width:55px">Stock: ${stock}</span>
              <div style="display:flex;align-items:center;gap:6px">
                <button onclick="this.nextElementSibling.value=Math.max(0,parseInt(this.nextElementSibling.value)-1)"
                        style="background:#f0f0f0;border:none;border-radius:6px;width:36px;height:36px;cursor:pointer;font-size:1.1rem">−</button>
                <input type="number" min="0" max="${stock}" value="${cantActual}"
                       id="edit-corrida-${v.id}"
                       style="width:50px;text-align:center;padding:4px;border:2px solid #6a1b9a;border-radius:8px;font-size:1rem;font-weight:700">
                <button onclick="this.previousElementSibling.value=Math.min(${stock},parseInt(this.previousElementSibling.value)+1)"
                        style="background:#f0f0f0;border:none;border-radius:6px;width:36px;height:36px;cursor:pointer;font-size:1.1rem">+</button>
              </div>
            </div>
          `
        }).join('')}
      </div>
      <button onclick="guardarEdicionCorridaPOS('${producto_id}', '${color}')"
              class="btn btn-primary"
              style="width:100%;margin-top:1.5rem;padding:12px;background:#6a1b9a;border-color:#6a1b9a">
        ✅ Guardar cambios
      </button>
    </div>
  `
  document.body.appendChild(modal)
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove() })
}

window.guardarEdicionCorridaPOS = (producto_id, color) => {
  const { variantes, productos } = window._posData

  // Guardar precio manual antes de eliminar
  const itemsAnteriores = window._posCarrito.filter(i => i.producto_id === producto_id && i.color === color && i.es_corrida)
  const precioManual = itemsAnteriores.length > 0 && itemsAnteriores[0].precio_manual ? itemsAnteriores[0].precio_unitario : null

  // Eliminar items anteriores
  window._posCarrito = window._posCarrito.filter(i => !(i.producto_id === producto_id && i.color === color && i.es_corrida))

  const varsColor = variantes.filter(v => v.producto_id === producto_id && v.color === color)
  const producto = productos.find(p => p.id === producto_id)
  if (!producto) return

  const precioCorrida = precioManual !== null ? precioManual : (parseFloat(producto.precio_corrida) || (parseFloat(producto.precio_menudeo) - 110))

  varsColor.forEach(v => {
    const input = document.getElementById('edit-corrida-' + v.id)
    const cantidad = input ? parseInt(input.value) || 0 : 0
    if (cantidad <= 0) return

    window._posCarrito.push({
      variante_id: v.id,
      producto_id,
      nombre: producto.nombre,
      color,
      talla: v.talla,
      cantidad,
      precio_menudeo: parseFloat(producto.precio_menudeo) || 0,
      precio_mayoreo3: parseFloat(producto.precio_mayoreo3) || (parseFloat(producto.precio_menudeo) - 30),
      precio_mayoreo6: parseFloat(producto.precio_mayoreo6) || (parseFloat(producto.precio_menudeo) - 70),
      precio_corrida: parseFloat(producto.precio_corrida) || (parseFloat(producto.precio_menudeo) - 110),
      es_oferta: producto.es_oferta || false,
      es_corrida: true,
      precio_manual: precioManual !== null,
      precio_unitario: precioCorrida
    })
  })

  document.getElementById('pos-modal-editar-corrida').remove()
  renderCarritoPOS()
}
window.eliminarCorridaPOS = (key) => {
  const [producto_id, color] = key.split('|')
  window._posCarrito = window._posCarrito.filter(i => !(i.producto_id === producto_id && i.color === color && i.es_corrida))
  renderCarritoPOS()
}

window.cambiarCantidadPOS = async (idx, delta) => {
  const item = window._posCarrito[idx]
  if (!item) return

  if (delta > 0) {
    const sucursalId = document.getElementById('pos-sucursal') ? document.getElementById('pos-sucursal').value : ''
    try {
      const resInv = await fetch(API + '/inventario/sucursal/' + sucursalId)
      const inventario = await resInv.json()
      const invVariante = inventario.find(i => i.variante_id === item.variante_id)
      const stockDisponible = invVariante ? invVariante.cantidad : 0

      // Calcular cuántos de esta variante ya están en el carrito
      const enCarrito = window._posCarrito
        .filter(i => i.variante_id === item.variante_id)
        .reduce((sum, i) => sum + i.cantidad, 0)

      if (enCarrito >= stockDisponible) {
        alert('No hay más existencia disponible. Stock: ' + stockDisponible + ' pares')
        return
      }
    } catch(e) {
      console.error('Error verificando stock', e)
    }
  }

  item.cantidad = Math.max(1, item.cantidad + delta)
  renderCarritoPOS()
}

window.eliminarItemPOS = (idx) => {
  window._posCarrito.splice(idx, 1)
  renderCarritoPOS()
}

window.limpiarCarritoPOS = () => {
  if (window._posCarrito.length > 0 && !confirm('Limpiar el carrito?')) return
  window._posCarrito = []
  renderCarritoPOS()
}

window.cobrarPOS = async () => {
  if (window._posCarrito.length === 0) { alert('El carrito esta vacio'); return }

  const clienteId = document.getElementById('pos-cliente').value || null
  const sucursalId = document.getElementById('pos-sucursal').value
  const formaPago = document.getElementById('pos-pago').value
  const total = window._posCarrito.reduce((sum, i) => sum + (i.cantidad * i.precio_unitario), 0)

  try {
    const resPedido = await fetch(API + '/pedidos/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cliente_id: clienteId,
        canal: 'sucursal',
        sucursal_id: sucursalId,
        forma_pago: formaPago,
        total,
        subtotal: total,
        status: formaPago === 'spei' ? 'pendiente_pago' : 'confirmado'
      })
    })

    const pedidoData = await resPedido.json()
    const pedidoId = pedidoData[0].id

    for (const item of window._posCarrito) {
      await fetch(API + '/pedidos/' + pedidoId + '/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variante_id: item.variante_id,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          subtotal: item.cantidad * item.precio_unitario
        })
      })
    }

    if (formaPago !== 'spei') {
      await fetch(API + '/pedidos/' + pedidoId + '/confirmar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forma_pago: formaPago })
      })
    }

    const totalPares = window._posCarrito.reduce((sum, i) => sum + i.cantidad, 0)
    window._posCarrito = []
      renderCarritoPOS()
      imprimirTicketPOS(pedidoId, total, totalPares, formaPago)

    const resInv = await fetch(API + '/inventario/sucursal/' + sucursalId)
    window._posData.inventario = await resInv.json()
    renderProductosPOS(window._posData.productos)

  } catch(e) {
    alert('Error procesando la venta')
  }
}
window.imprimirTicketPOS = async (pedidoId, total, totalPares, formaPago) => {
  const res = await fetch(API + '/pedidos/' + pedidoId)
  const data = await res.json()
  if (!data || data.length === 0) return
  const pedido = data[0]
  const items = pedido.pedido_items || []
  const cliente = pedido.clientes || {}
  const fecha = new Date().toLocaleString('es-MX')

  const ticket = window.open('', '_blank', 'width=400,height=600')
  ticket.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Ticket</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          width: 280px;
          padding: 10px;
          color: #000;
        }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .logo { font-size: 18px; font-weight: bold; margin-bottom: 2px; }
        .divider { border-top: 1px dashed #000; margin: 8px 0; }
        .row { display: flex; justify-content: space-between; margin-bottom: 2px; }
        .item-nombre { font-weight: bold; margin-bottom: 1px; }
        .item-detalle { color: #444; font-size: 11px; }
        .total-row { display: flex; justify-content: space-between; font-size: 14px; font-weight: bold; }
        .footer { margin-top: 10px; font-size: 11px; }
        @media print {
          body { width: 280px; }
          @page { margin: 0; size: 80mm auto; }
        }
      </style>
    </head>
    <body>
      <div class="center">
        <p class="logo">Zapatillas May</p>
        <p style="font-size:10px">Leon, Guanajuato</p>
        <p style="font-size:10px">Tel: 477 247 2285</p>
      </div>
      <div class="divider"></div>
      <div class="row">
        <span>Fecha:</span>
        <span>${fecha}</span>
      </div>
      <div class="row">
        <span>Cliente:</span>
        <span>${cliente.nombre || 'General'}</span>
      </div>
      <div class="row">
        <span>Pago:</span>
        <span>${formaPago.toUpperCase()}</span>
      </div>
      <div class="divider"></div>
      ${(() => {
  const grupos = {}
  items.forEach(item => {
    const variante = item.variantes || {}
    const producto = variante.productos || {}
    const key = (producto.nombre || '—') + '|' + (variante.color || '')
    if (!grupos[key]) {
      grupos[key] = {
        nombre: producto.nombre || '—',
        color: variante.color || '',
        cantidad: 0,
        subtotal: 0
      }
    }
    grupos[key].cantidad += item.cantidad
    grupos[key].subtotal += parseFloat(item.subtotal) || (item.cantidad * item.precio_unitario)
  })
  return `
    <table style="width:100%;border-collapse:collapse;font-size:11px">
      <tr style="border-bottom:1px solid #000">
        <td style="width:30px;text-align:right;padding-right:6px;font-weight:bold">Cant</td>
        <td style="padding-right:4px;font-weight:bold">Modelo</td>
        <td style="padding-right:4px;font-weight:bold">Color</td>
        <td style="text-align:right;font-weight:bold">Total</td>
      </tr>
      ${Object.values(grupos).map(g => `
        <tr>
          <td style="width:30px;text-align:right;padding-right:6px">${g.cantidad}</td>
          <td style="padding-right:4px">${g.nombre}</td>
          <td style="padding-right:4px;color:#444">${g.color}</td>
          <td style="text-align:right;font-weight:bold">$${g.subtotal.toFixed(2)}</td>
        </tr>
      `).join('')}
    </table>
  `
})()}
      <div class="divider"></div>
      <div class="row">
        <span>Total pares:</span>
        <span>${totalPares}</span>
      </div>
      <div class="total-row">
        <span>TOTAL:</span>
        <span>$${total.toFixed(2)}</span>
      </div>
      <div class="divider"></div>
      <div class="center footer">
        <p class="bold">┬íGracias por su compra!</p>
        <p>En herrajes y pedreria no hay devoluciones</p>
        <p>por su proceso artesanal.</p>
      </div>
      <div class="divider"></div>
      <div style="font-size:10px;margin-top:4px">
        <p>RFC: SAPL620614JD7</p>
        <p>Cuautla 211 Col. Killian</p>
        <p>Leon, Gto. CP 37260</p>
        <p>Tel: 477 530 8983</p>
        <p class="center" style="margin-top:4px">zapatillasmay.mx</p>
      </div>
      <script>window.onload=()=>{window.print()}<\/script>
    </body>
    </html>
  `)
  ticket.document.close()
}
window.generarPDFPedido = async (pedidoId) => {
  const res = await fetch(API + '/pedidos/' + pedidoId)
  const data = await res.json()
  if (!data || data.length === 0) return
  const pedido = data[0]
  const items = pedido.pedido_items || []
  const cliente = pedido.clientes || {}
  const fecha = new Date(pedido.created_at).toLocaleDateString('es-MX', { year:'numeric', month:'long', day:'numeric' })
  const total = pedido.total || 0
  const totalPares = items.reduce((sum, i) => sum + i.cantidad, 0)

  const ventana = window.open('', '_blank')
  ventana.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Pedido ${pedidoId.substring(0,8).toUpperCase()}</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: Arial, sans-serif; font-size:13px; color:#333; padding:40px; }
        .header { display:flex; justify-content:space-between; align-items:start; margin-bottom:30px; }
        .logo { font-size:24px; font-weight:bold; color:#E91E8C; }
        .logo span { color:#333; }
        .empresa-datos { font-size:11px; color:#666; margin-top:4px; line-height:1.6; }
        .pedido-info { text-align:right; }
        .pedido-num { font-size:18px; font-weight:bold; color:#333; }
        .pedido-fecha { font-size:12px; color:#888; margin-top:4px; }
        .divider { border-top:2px solid #E91E8C; margin:20px 0; }
        .divider-light { border-top:1px solid #eee; margin:15px 0; }
        .section-title { font-weight:bold; font-size:12px; color:#888; text-transform:uppercase; margin-bottom:8px; }
        .cliente-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px; }
        .campo { margin-bottom:6px; }
        .campo-label { font-size:11px; color:#888; }
        .campo-valor { font-weight:600; }
        table { width:100%; border-collapse:collapse; margin-bottom:20px; }
        thead tr { background:#f5f5f5; }
        th { padding:10px 12px; text-align:left; font-size:12px; font-weight:600; color:#555; border-bottom:2px solid #eee; }
        td { padding:10px 12px; border-bottom:1px solid #f5f5f5; font-size:13px; }
        .text-right { text-align:right; }
        .total-section { display:flex; justify-content:flex-end; }
        .total-box { width:250px; }
        .total-row { display:flex; justify-content:space-between; padding:6px 0; }
        .total-final { display:flex; justify-content:space-between; padding:10px 0; border-top:2px solid #E91E8C; font-size:16px; font-weight:bold; color:#E91E8C; }
        .badge { display:inline-block; padding:3px 10px; border-radius:100px; font-size:11px; font-weight:600; }
        .badge-success { background:#e8f5e9; color:#2e7d32; }
        .badge-warning { background:#fff8e1; color:#f57f17; }
        .footer { margin-top:40px; padding-top:20px; border-top:1px solid #eee; display:flex; justify-content:space-between; font-size:11px; color:#888; }
        .leyenda { margin-top:20px; font-size:11px; color:#888; font-style:italic; }
        @media print {
          body { padding:20px; }
          @page { margin:15mm; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">Zapatillas <span>May</span></div>
          <div class="empresa-datos">
            RFC: SAPL620614JD7<br>
            Cuautla 211 Col. Killian, Leon, Gto. CP 37260<br>
            Tel: 477 530 8983 | zapatillasmay.mx
          </div>
        </div>
        <div class="pedido-info">
          <div class="pedido-num">Pedido #${pedidoId.substring(0,8).toUpperCase()}</div>
          <div class="pedido-fecha">${fecha}</div>
          <div style="margin-top:8px">
            <span class="badge ${pedido.status === 'confirmado' || pedido.status === 'pagado' ? 'badge-success' : 'badge-warning'}">${pedido.status}</span>
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="cliente-grid">
        <div>
          <div class="section-title">Datos del cliente</div>
          <div class="campo">
            <div class="campo-label">Nombre</div>
            <div class="campo-valor">${cliente.nombre || 'Cliente general'}</div>
          </div>
          <div class="campo">
            <div class="campo-label">Telefono</div>
            <div class="campo-valor">${cliente.telefono || '—'}</div>
          </div>
          <div class="campo">
            <div class="campo-label">Email</div>
            <div class="campo-valor">${cliente.email || '—'}</div>
          </div>
        </div>
        <div>
          <div class="section-title">Informacion del pedido</div>
          <div class="campo">
            <div class="campo-label">Canal</div>
            <div class="campo-valor">${pedido.canal || '—'}</div>
          </div>
          <div class="campo">
            <div class="campo-label">Forma de pago</div>
            <div class="campo-valor">${pedido.forma_pago || '—'}</div>
          </div>
          <div class="campo">
            <div class="campo-label">Sucursal</div>
            <div class="campo-valor">${pedido.sucursales ? pedido.sucursales.nombre : '—'}</div>
          </div>
        </div>
      </div>

      <div class="divider-light"></div>

      <div class="section-title">Productos</div>
      <table>
        <thead>
          <tr>
            <th>Modelo</th>
            <th>Color</th>
            <th>Talla</th>
            <th>SKU</th>
            <th class="text-right">Cant</th>
            <th class="text-right">Precio unit</th>
            <th class="text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => {
            const variante = item.variantes || {}
            const producto = variante.productos || {}
            return `
              <tr>
                <td>${producto.nombre || '—'}</td>
                <td>${variante.color || '—'}</td>
                <td>${variante.talla || '—'}</td>
                <td style="font-size:11px;color:#888">${variante.sku || '—'}</td>
                <td class="text-right">${item.cantidad}</td>
                <td class="text-right">$${item.precio_unitario}</td>
                <td class="text-right font-weight:bold">$${item.subtotal}</td>
              </tr>
            `
          }).join('')}
        </tbody>
      </table>

      <div class="total-section">
        <div class="total-box">
          <div class="total-row">
            <span>Total pares:</span>
            <span>${totalPares}</span>
          </div>
          <div class="total-final">
            <span>TOTAL:</span>
            <span>$${parseFloat(total).toFixed(2)}</span>
          </div>
        </div>
      </div>

      ${pedido.comentarios ? `
        <div class="divider-light"></div>
        <div class="section-title">Comentarios</div>
        <p style="font-size:12px;color:#555">${pedido.comentarios}</p>
      ` : ''}

      <div class="leyenda">
        * En herrajes y pedreria no hay devoluciones por su proceso artesanal.
      </div>

      <div class="footer">
        <span>Zapatillas May — zapatillasmay.mx</span>
        <span>RFC: SAPL620614JD7</span>
        <span>Generado el ${new Date().toLocaleDateString('es-MX')}</span>
      </div>

     <script>window.onload = () => { window.print() }<\/script>
    </body>
    </html>
  `)
  ventana.document.close()
}
async function cargarHistorial() {
  const content = document.getElementById('content')
  try {
    const res = await fetch(API + '/movimientos/')
    const data = await res.json()
    const tipos = {
      'venta': { label: 'Venta', badge: 'badge-success' },
      'entrada': { label: 'Entrada', badge: 'badge-info' },
      'ajuste': { label: 'Ajuste', badge: 'badge-warning' },
      'traspaso_salida': { label: 'Traspaso salida', badge: 'badge-danger' },
      'traspaso_entrada': { label: 'Traspaso entrada', badge: 'badge-info' },
      'cambio_salida': { label: 'Cambio salida', badge: 'badge-info' },
      'cambio_entrada': { label: 'Cambio entrada', badge: 'badge-info' },
    }
    content.innerHTML = `
      <div class="table-card">
        <div class="table-header">
          <h3>Historial de movimientos (${data.length})</h3>
          <div style="display:flex;gap:8px">
            <select class="form-input" id="hist-tipo" style="max-width:160px" onchange="filtrarHistorial()">
              <option value="">Todos los tipos</option>
              <option value="venta">Ventas</option>
              <option value="entrada">Entradas</option>
              <option value="ajuste">Ajustes</option>
              <option value="traspaso_salida">Traspasos</option>
              <option value="cambio_salida">Cambios</option>
            </select>
            <input class="form-input" id="hist-buscar" placeholder="Buscar..." style="max-width:200px" oninput="filtrarHistorial()">
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Fecha</th><th>Tipo</th><th>Producto</th><th>Color</th><th>Talla</th><th>Sucursal</th><th>Cantidad</th><th>Usuario</th><th>Motivo</th>
            </tr>
          </thead>
          <tbody id="hist-tbody">
            ${data.length === 0
              ? '<tr><td colspan="9" style="text-align:center;color:var(--text-muted);padding:2rem">No hay movimientos registrados</td></tr>'
              : data.map(m => {
                  const tipo = tipos[m.tipo] || { label: m.tipo, badge: 'badge-warning' }
                  const cantidad = m.cantidad || 0
                  return `<tr>
                    <td style="font-size:0.78rem;color:var(--text-muted)">${new Date(m.created_at).toLocaleString('es-MX')}</td>
                    <td><span class="badge ${tipo.badge}">${tipo.label}</span></td>
                    <td><strong>${m.variantes && m.variantes.productos ? m.variantes.productos.nombre : '—'}</strong></td>
                    <td>${m.variantes ? m.variantes.color || '—' : '—'}</td>
                    <td>${m.variantes ? m.variantes.talla || '—' : '—'}</td>
                    <td>${m.sucursales ? m.sucursales.nombre || '—' : '—'}</td>
                    <td style="font-weight:600;color:${cantidad > 0 ? 'var(--green)' : 'var(--red)'}">${cantidad > 0 ? '+' : ''}${cantidad}</td>
                    <td style="font-size:0.82rem">${m.usuario || 'Admin'}</td>
                    <td style="font-size:0.82rem;color:var(--text-muted)">${m.motivo || '—'}</td>
                  </tr>`
                }).join('')}
          </tbody>
        </table>
      </div>`
    window._historialData = data
  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:var(--red)">Error conectando con el servidor</p>'
  }
}

window.filtrarHistorial = () => {
  const tipo = document.getElementById('hist-tipo').value
  const buscar = document.getElementById('hist-buscar').value.toLowerCase()
  const data = window._historialData || []
  const tipos = {
    'venta': { label: 'Venta', badge: 'badge-success' },
    'entrada': { label: 'Entrada', badge: 'badge-info' },
    'ajuste': { label: 'Ajuste', badge: 'badge-warning' },
    'traspaso_salida': { label: 'Traspaso salida', badge: 'badge-danger' },
    'traspaso_entrada': { label: 'Traspaso entrada', badge: 'badge-info' },
    'cambio_salida': { label: 'Cambio salida', badge: 'badge-info' },
    'cambio_entrada': { label: 'Cambio entrada', badge: 'badge-info' },
  }
  const filtrados = data.filter(m => {
    if (tipo && m.tipo !== tipo) return false
    if (buscar) {
      const nombre = (m.variantes && m.variantes.productos ? m.variantes.productos.nombre : '').toLowerCase()
      const motivo = (m.motivo || '').toLowerCase()
      if (!nombre.includes(buscar) && !motivo.includes(buscar)) return false
    }
    return true
  })
  const tbody = document.getElementById('hist-tbody')
  if (!tbody) return
  tbody.innerHTML = filtrados.length === 0
    ? '<tr><td colspan="9" style="text-align:center;color:var(--text-muted);padding:2rem">No se encontraron movimientos</td></tr>'
    : filtrados.map(m => {
        const tipo_info = tipos[m.tipo] || { label: m.tipo, badge: 'badge-warning' }
        const cantidad = m.cantidad || 0
        return `<tr>
          <td style="font-size:0.78rem;color:var(--text-muted)">${new Date(m.created_at).toLocaleString('es-MX')}</td>
          <td><span class="badge ${tipo_info.badge}">${tipo_info.label}</span></td>
          <td><strong>${m.variantes && m.variantes.productos ? m.variantes.productos.nombre : '—'}</strong></td>
          <td>${m.variantes ? m.variantes.color || '—' : '—'}</td>
          <td>${m.variantes ? m.variantes.talla || '—' : '—'}</td>
          <td>${m.sucursales ? m.sucursales.nombre || '—' : '—'}</td>
          <td style="font-weight:600;color:${cantidad > 0 ? 'var(--green)' : 'var(--red)'}">${cantidad > 0 ? '+' : ''}${cantidad}</td>
          <td style="font-size:0.82rem">${m.motivo || '—'}</td>
        </tr>`
      }).join('')
}

async function cargarDashboard() {
  try {
    const resPedidos = await fetch(API + '/pedidos/')
    const pedidos = await resPedidos.json()
    const resClientes = await fetch(API + '/clientes/')
    const clientes = await resClientes.json()
    const resAlertas = await fetch(API + '/inventario/alertas')
    const alertas = await resAlertas.json()

    const hoy = new Date(); hoy.setHours(0,0,0,0)
    const hace7 = new Date(hoy); hace7.setDate(hace7.getDate()-7)
    const hace30 = new Date(hoy); hace30.setDate(hace30.getDate()-30)

    const conf = pedidos.filter(p => p.status === 'confirmado' || p.status === 'pagado')
    const hoyP = conf.filter(p => new Date(p.created_at) >= hoy)
    const s7P = conf.filter(p => new Date(p.created_at) >= hace7)

    const ventasHoy = hoyP.reduce((s,p) => s + parseFloat(p.total||0), 0)
    const ventas7 = s7P.reduce((s,p) => s + parseFloat(p.total||0), 0)
    const clientesNuevos = clientes.filter(c => c.created_at && new Date(c.created_at) >= hace30).length

    const diasNombre = ['Dom','Lun','Mar','Mie','Jue','Vie','Sab']
    const porDia = {}; diasNombre.forEach(d => porDia[d] = 0)
    conf.filter(p => new Date(p.created_at) >= hace30).forEach(p => {
      const d = diasNombre[new Date(p.created_at).getDay()]
      porDia[d] += parseFloat(p.total||0)
    })

    const porCanal = {}
    conf.forEach(p => { porCanal[p.canal||'sucursal'] = (porCanal[p.canal||'sucursal']||0) + parseFloat(p.total||0) })

    const porPago = {}
    conf.forEach(p => { porPago[p.forma_pago||'efectivo'] = (porPago[p.forma_pago||'efectivo']||0) + 1 })

    const porEmpleado = {}
    conf.forEach(p => { porEmpleado[p.empleado||'Admin'] = (porEmpleado[p.empleado||'Admin']||0) + parseFloat(p.total||0) })

    const porMes = {}
    conf.forEach(p => { const m = new Date(p.created_at).toLocaleDateString('es-MX',{month:'short',year:'numeric'}); porMes[m] = (porMes[m]||0) + parseFloat(p.total||0) })

    const porCliente = {}
    conf.forEach(p => { if(p.clientes){ porCliente[p.clientes.nombre] = (porCliente[p.clientes.nombre]||0) + parseFloat(p.total||0) } })

    const topClientes = Object.entries(porCliente).sort((a,b)=>b[1]-a[1]).slice(0,5)
    const diaMas = Object.entries(porDia).sort((a,b)=>b[1]-a[1])[0]
    const topEmp = Object.entries(porEmpleado).sort((a,b)=>b[1]-a[1])[0]

    const dashboard = document.getElementById('dashboard-contenido')
    if (!dashboard) return

    const cards = dashboard.querySelectorAll('.stat-card')
    const vals = [
      { val: '$'+ventasHoy.toFixed(0), sub: hoyP.length+' pedidos hoy', color: 'var(--pink)' },
      { val: hoyP.length, sub: 'confirmados hoy' },
      { val: '$'+ventas7.toFixed(0), sub: s7P.length+' pedidos' },
      { val: clientesNuevos, sub: 'ultimos 30 dias' },
      { val: alertas.length, sub: 'por reabastecer', color: alertas.length > 0 ? 'var(--amber)' : 'var(--green)' },
      { val: diaMas ? diaMas[0] : '—', sub: diaMas ? '$'+diaMas[1].toFixed(0)+' prom.' : '' },
      { val: topEmp ? topEmp[0] : '—', sub: topEmp ? '$'+topEmp[1].toFixed(0) : '', small: true },
      { val: clientes.length, sub: 'registrados' },
    ]
    cards.forEach((card, i) => {
      if (!vals[i]) return
      const valEl = card.querySelector('.stat-value')
      const subEl = card.querySelector('.stat-sub')
      if (valEl) { valEl.textContent = vals[i].val; valEl.style.color = vals[i].color || 'var(--text-primary)'; if(vals[i].small) valEl.style.fontSize = '1rem' }
      if (subEl) subEl.textContent = vals[i].sub || ''
    })

    const topClientesEl = document.getElementById('dash-top-clientes')
    if (topClientesEl) {
      topClientesEl.innerHTML = topClientes.length === 0
        ? '<p style="color:var(--text-muted);font-size:0.85rem">Sin datos aun</p>'
        : topClientes.map(([nombre, total], i) => `
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
            <span style="width:22px;height:22px;background:var(--pink);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;flex-shrink:0">${i+1}</span>
            <span style="flex:1;font-size:0.875rem">${nombre}</span>
            <strong style="color:var(--pink)">$${total.toFixed(0)}</strong>
          </div>`).join('')
    }

    const ultimosEl = document.getElementById('dash-ultimos-pedidos')
    if (ultimosEl) {
      ultimosEl.innerHTML = pedidos.slice(0,5).map(p => `
        <div onclick="verPedido('${p.id}')" style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);cursor:pointer">
          <div>
            <p style="font-size:0.85rem;font-weight:500">${p.clientes ? p.clientes.nombre : 'General'}</p>
            <p style="font-size:0.72rem;color:var(--text-muted)">${p.canal} · ${new Date(p.created_at).toLocaleDateString('es-MX')}</p>
          </div>
          <div style="text-align:right">
            <p style="font-weight:700;color:var(--pink)">$${p.total||0}</p>
            <span class="badge ${p.status==='confirmado'||p.status==='pagado'?'badge-success':'badge-warning'}">${p.status}</span>
          </div>
        </div>`).join('')
    }

    setTimeout(() => {
      const chartOpts = {
        responsive: true,
        plugins: { legend: { labels: { color: '#666', font: { size: 11 } } } },
        scales: {
          x: { ticks: { color: '#666', font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.05)' } },
          y: { ticks: { color: '#666', font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.05)' } }
        }
      }
      const elDias = document.getElementById('chart-dias')
      if (elDias && window.Chart) new Chart(elDias, { type: 'bar', data: { labels: diasNombre, datasets: [{ data: diasNombre.map(d => porDia[d]||0), backgroundColor: 'rgba(233,30,140,0.2)', borderColor: '#E91E8C', borderWidth: 2, borderRadius: 6 }] }, options: { ...chartOpts, plugins: { legend: { display: false } } } })

      const elCanales = document.getElementById('chart-canales')
      if (elCanales && window.Chart && Object.keys(porCanal).length > 0) new Chart(elCanales, { type: 'doughnut', data: { labels: Object.keys(porCanal), datasets: [{ data: Object.values(porCanal), backgroundColor: ['rgba(233,30,140,0.7)','rgba(0,151,178,0.7)','rgba(124,58,237,0.7)','rgba(46,125,50,0.7)'], borderColor: ['#E91E8C','#0097b2','#7c3aed','#2e7d32'], borderWidth: 2 }] }, options: { responsive: true, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { color: '#666', font: { size: 11 }, padding: 12 } } } } })

      const elMeses = document.getElementById('chart-meses')
      if (elMeses && window.Chart) { const md = Object.entries(porMes).slice(-6); new Chart(elMeses, { type: 'line', data: { labels: md.map(([m])=>m), datasets: [{ data: md.map(([,v])=>v), borderColor: '#0097b2', backgroundColor: 'rgba(0,151,178,0.08)', borderWidth: 2, pointBackgroundColor: '#0097b2', pointRadius: 4, fill: true, tension: 0.4 }] }, options: { ...chartOpts, plugins: { legend: { display: false } } } }) }

      const elPagos = document.getElementById('chart-pagos')
      if (elPagos && window.Chart && Object.keys(porPago).length > 0) new Chart(elPagos, { type: 'doughnut', data: { labels: Object.keys(porPago), datasets: [{ data: Object.values(porPago), backgroundColor: ['rgba(46,125,50,0.7)','rgba(245,127,23,0.7)','rgba(233,30,140,0.7)','rgba(124,58,237,0.7)'], borderColor: ['#2e7d32','#f57f17','#E91E8C','#7c3aed'], borderWidth: 2 }] }, options: { responsive: true, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { color: '#666', font: { size: 11 }, padding: 12 } } } } })
    }, 300)

  } catch(e) {
    console.error('Error dashboard:', e)
  }
}
window.eliminarItemPedido = (idx) => {
  window._pedidoItems.splice(idx, 1)
  window.recalcularTotal()
  window.renderItemsPedido()
}
window.cerrarSesionPanel = () => {
  if (!confirm('Cerrar sesion?')) return
  sessionStorage.removeItem('erp_empleado')
  window._empleadoActual = null
  location.reload()
}
async function cargarEmpleados() {
  const content = document.getElementById('content')
  try {
    const res = await fetch(API + '/empleados/')
    const data = await res.json()
    content.innerHTML = `
      <div class="table-card">
        <div class="table-header">
          <h3>Empleados (${data.length})</h3>
          <button class="btn btn-primary" onclick="mostrarFormEmpleado('')">+ Nuevo empleado</button>
        </div>
        <table>
          <thead>
            <tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            ${data.map(e => `
              <tr>
                <td><strong>${e.nombre}</strong></td>
                <td>${e.email}</td>
                <td><span class="badge ${e.rol === 'admin' ? 'badge-info' : 'badge-success'}">${e.rol}</span></td>
                <td><span class="badge ${e.activo ? 'badge-success' : 'badge-danger'}">${e.activo ? 'Activo' : 'Inactivo'}</span></td>
                <td style="display:flex;gap:4px">
                  <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="mostrarFormEmpleado('${e.id}')">Editar</button>
                  <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="toggleEmpleado('${e.id}',${e.activo})">${e.activo ? 'Desactivar' : 'Activar'}</button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`
  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:var(--red)">Error conectando con el servidor</p>'
  }
}

window.mostrarFormEmpleado = async (id) => {
  const content = document.getElementById('content')
  let d = {}
  if (id) {
    try {
      const res = await fetch(API + '/empleados/')
      const data = await res.json()
      d = data.find(e => e.id === id) || {}
    } catch(e) {}
  }
  content.innerHTML = `
    <div class="table-card" style="padding:2rem;max-width:500px">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('empleados')">← Volver</button>
        <h3>${id ? 'Editar empleado' : 'Nuevo empleado'}</h3>
      </div>
      <div style="display:grid;gap:1rem">
        <div><label class="form-label">Nombre *</label><input class="form-input" id="emp-nombre" placeholder="Nombre completo" value="${d.nombre||''}"></div>
        <div><label class="form-label">Email *</label><input class="form-input" id="emp-email" type="email" placeholder="correo@ejemplo.com" value="${d.email||''}"></div>
        <div><label class="form-label">${id ? 'Nueva contrasena (dejar vacio para no cambiar)' : 'Contrasena *'}</label><input class="form-input" id="emp-password" type="password" placeholder="••••••••"></div>
        <div><label class="form-label">Rol</label>
          <select class="form-input" id="emp-rol">
            <option value="vendedor" ${d.rol==='vendedor'?'selected':''}>Vendedor</option>
            <option value="admin" ${d.rol==='admin'?'selected':''}>Administrador</option>
          </select>
        </div>
      </div>
      <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1.5rem">
        <button class="btn btn-secondary" onclick="navegarA('empleados')">Cancelar</button>
        <button class="btn btn-primary" onclick="guardarEmpleado('${id||''}')">Guardar</button>
      </div>
    </div>`
}

window.guardarEmpleado = async (id) => {
  const nombre = document.getElementById('emp-nombre').value
  const email = document.getElementById('emp-email').value
  const password = document.getElementById('emp-password').value
  const rol = document.getElementById('emp-rol').value
  if (!nombre || !email) { alert('Nombre y email son obligatorios'); return }
  if (!id && !password) { alert('La contrasena es obligatoria para nuevos empleados'); return }
  try {
    const method = id ? 'PATCH' : 'POST'
    const url = id ? API + '/empleados/' + id : API + '/empleados/'
    const body = { nombre, email, rol }
    if (password) body.password = password
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) { alert('Empleado guardado correctamente'); navegarA('empleados') }
    else { const err = await res.json(); alert('Error: ' + (err.error || 'No se pudo guardar')) }
  } catch(e) { alert('Error conectando con el servidor') }
}

window.toggleEmpleado = async (id, activo) => {
  if (!confirm(activo ? 'Desactivar este empleado?' : 'Activar este empleado?')) return
  try {
    const res = await fetch(API + '/empleados/' + id, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ activo: !activo }) })
    if (res.ok) cargarEmpleados()
    else alert('Error al cambiar estado')
  } catch(e) { alert('Error conectando con el servidor') }
}
async function cargarSEO() {
  const content = document.getElementById('content')
  content.innerHTML = '<p style="padding:2rem;color:var(--text-muted)">Cargando...</p>'
  try {
    const res = await fetch(API + '/seo/config')
    const data = await res.json()
    const config = {}
    data.forEach(item => config[item.clave] = item.valor || '')

    content.innerHTML = `
      <div style="max-width:800px">
        <div class="table-card" style="padding:2rem;margin-bottom:1rem">
          <h3 style="margin-bottom:1.5rem">SEO General</h3>
          <div style="display:grid;gap:1rem">
            <div>
              <label class="form-label">Meta titulo (home)</label>
              <input class="form-input" id="seo-titulo" value="${config.meta_titulo_home}" placeholder="Zapatillas May | Calzado de Moda...">
              <p style="font-size:0.72rem;color:var(--text-muted);margin-top:4px">Recomendado: 50-60 caracteres. Actual: <span id="seo-titulo-count">${config.meta_titulo_home.length}</span></p>
            </div>
            <div>
              <label class="form-label">Meta descripcion (home)</label>
              <textarea class="form-input" id="seo-desc" rows="3" placeholder="Descripcion para Google...">${config.meta_descripcion_home}</textarea>
              <p style="font-size:0.72rem;color:var(--text-muted);margin-top:4px">Recomendado: 150-160 caracteres. Actual: <span id="seo-desc-count">${config.meta_descripcion_home.length}</span></p>
            </div>
          </div>
        </div>

        <div class="table-card" style="padding:2rem;margin-bottom:1rem">
          <h3 style="margin-bottom:1.5rem">Analiticas y Pixels</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div>
              <label class="form-label">Google Analytics ID</label>
              <input class="form-input" id="seo-ga" value="${config.google_analytics_id}" placeholder="G-XXXXXXXXXX">
            </div>
            <div>
              <label class="form-label">Facebook Pixel ID</label>
              <input class="form-input" id="seo-fb" value="${config.facebook_pixel_id}" placeholder="XXXXXXXXXXXXXXXXX">
            </div>
            <div>
              <label class="form-label">Google Search Console (verification)</label>
              <input class="form-input" id="seo-gsc" value="${config.google_search_console || ''}" placeholder="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX">
            </div>
            <div>
              <label class="form-label">Google Tag Manager ID</label>
              <input class="form-input" id="seo-gtm" value="${config.google_tag_manager || ''}" placeholder="GTM-XXXXXXX">
            </div>
            <div>
              <label class="form-label">TikTok Pixel ID</label>
              <input class="form-input" id="seo-tt" value="${config.tiktok_pixel_id}" placeholder="XXXXXXXXXXXXXXXXX">
            </div>
            <div>
              <label class="form-label">WhatsApp flotante</label>
              <input class="form-input" id="seo-wa" value="${config.whatsapp_flotante}" placeholder="524771234567">
            </div>
          </div>
        </div>

        <div class="table-card" style="padding:2rem;margin-bottom:1rem">
          <h3 style="margin-bottom:1.5rem">Redes Sociales</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div>
              <label class="form-label">Instagram URL</label>
              <input class="form-input" id="seo-ig" value="${config.instagram_url}" placeholder="https://instagram.com/zapatillasmay">
            </div>
            <div>
              <label class="form-label">Facebook URL</label>
              <input class="form-input" id="seo-fb-url" value="${config.facebook_url}" placeholder="https://facebook.com/zapatillasmay">
            </div>
            <div>
              <label class="form-label">TikTok URL</label>
              <input class="form-input" id="seo-tt-url" value="${config.tiktok_url}" placeholder="https://tiktok.com/@zapatillasmay">
            </div>
          </div>
        </div>

        <div class="table-card" style="padding:2rem;margin-bottom:1rem">
          <h3 style="margin-bottom:1.5rem">Horarios</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div>
              <label class="form-label">Lunes a Viernes</label>
              <input class="form-input" id="seo-hor1" value="${config.horario_semana}" placeholder="9:00 - 18:00">
            </div>
            <div>
              <label class="form-label">Sabado</label>
              <input class="form-input" id="seo-hor2" value="${config.horario_sabado}" placeholder="9:00 - 15:00">
            </div>
          </div>
        </div>

        <div class="table-card" style="padding:2rem;margin-bottom:1rem">
          <h3 style="margin-bottom:1rem">Herramientas</h3>
          <div style="display:flex;gap:1rem;flex-wrap:wrap">
            <a href="http://localhost:3000/sitemap.xml" target="_blank" class="btn btn-secondary">Ver sitemap.xml</a>
            <a href="http://localhost:3000/robots.txt" target="_blank" class="btn btn-secondary">Ver robots.txt</a>
            <a href="https://search.google.com/search-console" target="_blank" class="btn btn-secondary">Google Search Console</a>
            <a href="https://search.google.com/test/rich-results" target="_blank" class="btn btn-secondary">Probar Schema</a>
          </div>
        </div>

        <div style="display:flex;justify-content:flex-end">
          <button class="btn btn-primary" onclick="guardarSEO()">Guardar configuracion</button>
        </div>
      </div>
    `

    document.getElementById('seo-titulo').addEventListener('input', function() {
      document.getElementById('seo-titulo-count').textContent = this.value.length
    })
    document.getElementById('seo-desc').addEventListener('input', function() {
      document.getElementById('seo-desc-count').textContent = this.value.length
    })

  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:var(--red)">Error conectando con el servidor</p>'
  }
}

window.guardarSEO = async () => {
  const campos = {
    meta_titulo_home: document.getElementById('seo-titulo').value,
    meta_descripcion_home: document.getElementById('seo-desc').value,
    google_analytics_id: document.getElementById('seo-ga').value,
    google_search_console: document.getElementById('seo-gsc').value,
    google_tag_manager: document.getElementById('seo-gtm').value,
    facebook_pixel_id: document.getElementById('seo-fb').value,
    tiktok_pixel_id: document.getElementById('seo-tt').value,
    whatsapp_flotante: document.getElementById('seo-wa').value,
    instagram_url: document.getElementById('seo-ig').value,
    facebook_url: document.getElementById('seo-fb-url').value,
    tiktok_url: document.getElementById('seo-tt-url').value,
    horario_semana: document.getElementById('seo-hor1').value,
    horario_sabado: document.getElementById('seo-hor2').value,
  }
  try {
    const res = await fetch(API + '/seo/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campos)
    })
    if (res.ok) alert('Configuracion SEO guardada correctamente')
    else alert('Error al guardar')
  } catch(e) {
    alert('Error conectando con el servidor')
  }
}