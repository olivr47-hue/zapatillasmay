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
  { id: 'productos', icon: '👠', label: 'Productos', section: 'Catalogo' },
  { id: 'inventario', icon: '📦', label: 'Inventario', section: 'Catalogo' },
  { id: 'pedidos', icon: '🛍️', label: 'Pedidos', section: 'Ventas' },
  { id: 'clientes', icon: '👥', label: 'Clientes', section: 'Ventas' },
  { id: 'sucursales', icon: '🏪', label: 'Sucursales', section: 'Configuracion' },
  { id: 'historial', icon: '📋', label: 'Historial', section: 'Ventas' },
]

let moduloActivo = 'dashboard'
let varianteCount = 1

export function renderPanel() {
  document.querySelector('#app').innerHTML = `
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
          <span style="font-size:0.8rem;color:#888">Leon, Gto.</span>
        </div>
      </div>
      <div class="content" id="content">
        ${renderDashboardHTML()}
      </div>
    </div>
  `
  setTimeout(() => {
    if (document.getElementById('dashboard-contenido')) {
      cargarDashboard()
    }
  }, 800)


  window.toggleSidebar = () => {
    document.getElementById('sidebar').classList.toggle('open')
  }
  window.navegarA = (id) => {
    moduloActivo = id
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
  content.innerHTML = '<div style="padding:3rem;text-align:center;color:var(--text-muted)">Cargando...</div>'
  switch(id) {
    case 'dashboard': content.innerHTML = renderDashboardHTML(); setTimeout(() => cargarDashboard(), 100); break
    case 'pos': await cargarPOS(); break
    case 'productos': await cargarProductos(); break
    case 'clientes': await cargarClientes(); break
    case 'pedidos': await cargarPedidos(); break
    case 'sucursales': await cargarSucursales(); break
    case 'inventario': await cargarInventario(); break
    case 'historial': await cargarHistorial(); break
  }
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
          <button class="btn btn-primary" onclick="mostrarFormProducto()">+ Nuevo producto</button>
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
          <button class="btn btn-primary">+ Nuevo cliente</button>
        </div>
        <table>
          <thead>
            <tr><th>Nombre</th><th>Telefono</th><th>Tipo</th><th>Email</th></tr>
          </thead>
          <tbody>
            ${data.length === 0
              ? '<tr><td colspan="4" style="text-align:center;color:#888;padding:2rem">No hay clientes</td></tr>'
              : data.map(c => `
                <tr>
                  <td><strong>${c.nombre}</strong></td>
                  <td>${c.telefono || '—'}</td>
                  <td><span class="badge ${c.tipo === 'mayoreo' ? 'badge-info' : 'badge-success'}">${c.tipo}</span></td>
                  <td>${c.email || '—'}</td>
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

async function cargarPedidos() {
  const content = document.getElementById('content')
  try {
    const res = await fetch(API + '/pedidos/')
    const data = await res.json()
    content.innerHTML = `
      <div class="table-card">
        <div class="table-header">
          <h3>Pedidos (${data.length})</h3>
          <button class="btn btn-primary">+ Nuevo pedido</button>
        </div>
        <table>
          <thead>
            <tr><th>Cliente</th><th>Total</th><th>Canal</th><th>Status</th><th>Fecha</th></tr>
          </thead>
          <tbody>
            ${data.length === 0
              ? '<tr><td colspan="5" style="text-align:center;color:#888;padding:2rem">No hay pedidos</td></tr>'
              : data.map(p => `
                <tr>
                  <td>${p.clientes ? p.clientes.nombre : '—'}</td>
                  <td>$${p.total || '0'}</td>
                  <td>${p.canal}</td>
                  <td><span class="badge badge-warning">${p.status}</span></td>
                  <td>${new Date(p.created_at).toLocaleDateString('es-MX')}</td>
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
            <tr><th>Nombre</th><th>Tipo</th><th>Direccion</th><th>Telefono</th><th>Estado</th></tr>
          </thead>
          <tbody>
            ${data.map(s => `
              <tr>
                <td><strong>${s.nombre}</strong></td>
                <td>${s.tipo}</td>
                <td>${s.direccion || '—'}</td>
                <td>${s.telefono || '—'}</td>
                <td><span class="badge badge-success">Activa</span></td>
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
        <button class="btn btn-secondary" onclick="mostrarAjuste()" style="background:#e3f2fd;border-color:#1565c0;color:#1565c0">Ajuste</button>
        <button class="btn btn-secondary" onclick="mostrarCambio()" style="background:#f3e5f5;border-color:#6a1b9a;color:#6a1b9a">Cambio</button>
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
      alert('Ajuste guardado. Anterior: ' + data.cantidad_anterior + ' pares → Nuevo: ' + data.cantidad_nueva + ' pares')
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
  resultadosDiv.innerHTML = filtradas.map(v => `
    <div onclick="seleccionarVariante('${v.id}', '${(v.productos ? v.productos.nombre || '' : '').replace(/'/g, '')} - ${v.color} - T${v.talla}', '${prefijo}')"
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
  `).join('')
  resultadosDiv.style.display = 'block'
}

window.seleccionarVariante = (id, texto, prefijo) => {
  const input = document.getElementById(prefijo)
  if (input) input.value = id
  const selDiv = document.getElementById(prefijo + '-seleccionado')
  if (selDiv) { selDiv.textContent = '✓ ' + texto; selDiv.style.display = 'block' }
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
          <div id="v${i}-preview" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"></div>
        </div>
      </div>
    </div>
  `
}

window.mostrarFormProducto = (datos) => {
  varianteCount = 1
  const d = datos || {}
  const content = document.getElementById('content')
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
        <div id="variantes-container">${renderVariante(0, null)}</div>
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
        <button type="button" class="btn btn-primary" id="btn-guardar" onclick="guardarProducto()">Guardar producto</button>
      </div>
    </div>
  `
  window._productoEditandoId = null
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
  preview.innerHTML = ''
  Array.from(input.files).forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = document.createElement('img')
      img.src = e.target.result
      img.style.cssText = 'width:60px;height:60px;object-fit:cover;border-radius:6px;border:1px solid #ddd'
      preview.appendChild(img)
    }
    reader.readAsDataURL(file)
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
  for (const v of variantes) {
    const id = v.id.replace('variante-', '')
    const hex = document.getElementById('v' + id + '-hex')
    const nombre = document.getElementById('v' + id + '-nombre')
    const inputImgs = document.getElementById('v' + id + '-imgs')
    if (!nombre || !nombre.value) continue
    const urls = []
    if (inputImgs && inputImgs.files.length > 0) {
      for (const file of inputImgs.files) {
        const formData = new FormData()
        formData.append('archivo', file)
        try {
          const res = await fetch(API + '/imagenes/subir', { method: 'POST', body: formData })
          const data = await res.json()
          if (data.url) urls.push(data.url)
        } catch(e) {}
      }
    }
    resultado.push({ color: nombre.value, color_hex: hex ? hex.value : '#000000', imagenes: urls })
  }
  return resultado
}

window.guardarProducto = async () => {
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
        for (const v of variantesData) {
          for (const talla of tallasGuardar) {
            await fetch(API + '/variantes/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ producto_id: pid, color: v.color, color_hex: v.color_hex, talla, foto_url: v.imagenes[0] || null })
            })
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
  try {
    const res = await fetch(API + '/productos/' + id)
    const data = await res.json()
    if (data && data.length > 0) {
      window._productoEditandoId = id
      mostrarFormProducto(data[0])
    }
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
            <strong style="color:var(--pink);font-family:DM Mono,monospace">$${total.toFixed(0)}</strong>
          </div>`).join('')
    }

    const ultimosEl = document.getElementById('dash-ultimos-pedidos')
    if (ultimosEl) {
      ultimosEl.innerHTML = pedidos.slice(0,5).map(p => `
        <div onclick="verPedido('${p.id}')" style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);cursor:pointer" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">
          <div>
            <p style="font-size:0.85rem;font-weight:500">${p.clientes ? p.clientes.nombre : 'General'}</p>
            <p style="font-size:0.72rem;color:var(--text-muted)">${p.canal} · ${new Date(p.created_at).toLocaleDateString('es-MX')}</p>
          </div>
          <div style="text-align:right">
            <p style="font-weight:700;color:var(--pink);font-family:DM Mono,monospace">$${p.total||0}</p>
            <span class="badge ${p.status==='confirmado'||p.status==='pagado'?'badge-success':'badge-warning'}">${p.status}</span>
          </div>
        </div>`).join('')
    }

    setTimeout(() => {
      const chartOpts = {
        responsive: true,
        plugins: { legend: { labels: { color: '#8892a4', font: { size: 11 } } } },
        scales: {
          x: { ticks: { color: '#8892a4', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
          y: { ticks: { color: '#8892a4', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.04)' } }
        }
      }
      const elDias = document.getElementById('chart-dias')
      if (elDias && window.Chart) new Chart(elDias, { type: 'bar', data: { labels: diasNombre, datasets: [{ data: diasNombre.map(d => porDia[d]||0), backgroundColor: 'rgba(240,20,126,0.2)', borderColor: '#f0147e', borderWidth: 2, borderRadius: 6 }] }, options: { ...chartOpts, plugins: { legend: { display: false } } } })

      const elCanales = document.getElementById('chart-canales')
      if (elCanales && window.Chart && Object.keys(porCanal).length > 0) new Chart(elCanales, { type: 'doughnut', data: { labels: Object.keys(porCanal), datasets: [{ data: Object.values(porCanal), backgroundColor: ['rgba(240,20,126,0.7)','rgba(0,212,255,0.7)','rgba(124,58,237,0.7)','rgba(16,217,126,0.7)'], borderColor: ['#f0147e','#00d4ff','#7c3aed','#10d97e'], borderWidth: 2 }] }, options: { responsive: true, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { color: '#8892a4', font: { size: 11 }, padding: 12 } } } } })

      const elMeses = document.getElementById('chart-meses')
      if (elMeses && window.Chart) { const md = Object.entries(porMes).slice(-6); new Chart(elMeses, { type: 'line', data: { labels: md.map(([m])=>m), datasets: [{ data: md.map(([,v])=>v), borderColor: '#00d4ff', backgroundColor: 'rgba(0,212,255,0.08)', borderWidth: 2, pointBackgroundColor: '#00d4ff', pointRadius: 4, fill: true, tension: 0.4 }] }, options: { ...chartOpts, plugins: { legend: { display: false } } } }) }

      const elPagos = document.getElementById('chart-pagos')
      if (elPagos && window.Chart && Object.keys(porPago).length > 0) new Chart(elPagos, { type: 'doughnut', data: { labels: Object.keys(porPago), datasets: [{ data: Object.values(porPago), backgroundColor: ['rgba(16,217,126,0.7)','rgba(245,158,11,0.7)','rgba(240,20,126,0.7)','rgba(124,58,237,0.7)'], borderColor: ['#10d97e','#f59e0b','#f0147e','#7c3aed'], borderWidth: 2 }] }, options: { responsive: true, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { color: '#8892a4', font: { size: 11 }, padding: 12 } } } } })
    }, 300)

  } catch(e) {
    console.error('Error dashboard:', e)
  }
}
async function cargarHistorial() {
  const content = document.getElementById('content')
  try {
    const res = await fetch(API + '/movimientos/')
    const data = await res.json()

    const tipos = {
      'venta': { label: 'Venta', color: 'var(--green)', badge: 'badge-success' },
      'entrada': { label: 'Entrada', color: 'var(--cyan)', badge: 'badge-info' },
      'ajuste': { label: 'Ajuste', color: 'var(--amber)', badge: 'badge-warning' },
      'traspaso_salida': { label: 'Traspaso salida', color: 'var(--red)', badge: 'badge-danger' },
      'traspaso_entrada': { label: 'Traspaso entrada', color: 'var(--cyan)', badge: 'badge-info' },
      'cambio_salida': { label: 'Cambio salida', color: '#7c3aed', badge: 'badge-info' },
      'cambio_entrada': { label: 'Cambio entrada', color: '#7c3aed', badge: 'badge-info' },
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
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Producto</th>
              <th>Color</th>
              <th>Talla</th>
              <th>Sucursal</th>
              <th>Cantidad</th>
              <th>Usuario</th>
              <th>Motivo</th>           
               /tr>
          </thead>
          <tbody id="hist-tbody">
            ${data.length === 0
              ? '<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:2rem">No hay movimientos registrados</td></tr>'
              : data.map(m => {
                  const tipo = tipos[m.tipo] || { label: m.tipo, color: 'var(--text-muted)', badge: 'badge-warning' }
                  const cantidad = m.cantidad || 0
                  return `
                    <tr>
                      <td style="font-family:DM Mono,monospace;font-size:0.78rem;color:var(--text-muted)">${new Date(m.created_at).toLocaleString('es-MX')}</td>
                      <td><span class="badge ${tipo.badge}">${tipo.label}</span></td>
                      <td><strong>${m.variantes && m.variantes.productos ? m.variantes.productos.nombre : '—'}</strong></td>
                      <td>
                        ${m.variantes && m.variantes.color_hex ? `<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${m.variantes.color_hex};border:1px solid rgba(255,255,255,0.1);vertical-align:middle;margin-right:6px"></span>` : ''}
                        ${m.variantes ? m.variantes.color || '—' : '—'}
                      </td>
                      <td>${m.variantes ? m.variantes.talla || '—' : '—'}</td>
                      <td>${m.sucursales ? m.sucursales.nombre || '—' : '—'}</td>
                      <td style="font-family:DM Mono,monospace;font-weight:600;color:${cantidad > 0 ? 'var(--green)' : 'var(--red)'}">
                        ${cantidad > 0 ? '+' : ''}${cantidad}
                      </td>
                      <td style="font-size:0.82rem;color:var(--text-secondary)">${m.usuario || 'Admin'}</td>
                      <td style="font-size:0.82rem;color:var(--text-muted)">${m.motivo || '—'}</td>                    
                      </tr>
                  `
                }).join('')}
          </tbody>
        </table>
      </div>
    `
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
    ? '<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:2rem">No se encontraron movimientos</td></tr>'
    : filtrados.map(m => {
        const tipo_info = tipos[m.tipo] || { label: m.tipo, badge: 'badge-warning' }
        const cantidad = m.cantidad || 0
        return `
          <tr>
            <td style="font-family:DM Mono,monospace;font-size:0.78rem;color:var(--text-muted)">${new Date(m.created_at).toLocaleString('es-MX')}</td>
            <td><span class="badge ${tipo_info.badge}">${tipo_info.label}</span></td>
            <td><strong>${m.variantes && m.variantes.productos ? m.variantes.productos.nombre : '—'}</strong></td>
            <td>${m.variantes ? m.variantes.color || '—' : '—'}</td>
            <td>${m.variantes ? m.variantes.talla || '—' : '—'}</td>
            <td>${m.sucursales ? m.sucursales.nombre || '—' : '—'}</td>
            <td style="font-family:DM Mono,monospace;font-weight:600;color:${cantidad > 0 ? 'var(--green)' : 'var(--red)'}">
              ${cantidad > 0 ? '+' : ''}${cantidad}
            </td>
            <td style="font-size:0.82rem;color:var(--text-muted)">${m.motivo || '—'}</td>
          </tr>
        `
      }).join('')
}