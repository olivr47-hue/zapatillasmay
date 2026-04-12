const API = 'http://127.0.0.1:8000'

const modulos = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard', section: 'Principal' },
  { id: 'productos', icon: '👠', label: 'Productos', section: 'Catálogo' },
  { id: 'inventario', icon: '📦', label: 'Inventario', section: 'Catálogo' },
  { id: 'pedidos', icon: '🛍️', label: 'Pedidos', section: 'Ventas' },
  { id: 'clientes', icon: '👥', label: 'Clientes', section: 'Ventas' },
  { id: 'sucursales', icon: '🏪', label: 'Sucursales', section: 'Configuración' },
]

let moduloActivo = 'dashboard'

export function renderPanel() {
  document.querySelector('#app').innerHTML = `
    <div class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        <h2>Zapatillas <span>May</span></h2>
        <p>Panel de administración</p>
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
          <span style="font-size:0.8rem;color:#888">León, Gto.</span>
        </div>
      </div>
      <div class="content" id="content">
        ${renderDashboard()}
      </div>
    </div>
  `
  window.toggleSidebar = () => {
    document.getElementById('sidebar').classList.toggle('open')
  }
  window.navegarA = (id) => {
    moduloActivo = id
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'))
    document.querySelector(`[data-modulo="${id}"]`).classList.add('active')
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
    case 'dashboard': content.innerHTML = renderDashboard(); break
    case 'productos': await cargarProductos(); break
    case 'clientes': await cargarClientes(); break
    case 'pedidos': await cargarPedidos(); break
    case 'sucursales': await cargarSucursales(); break
    case 'inventario': await cargarInventario(); break
  }
}

function renderDashboard() {
  return `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Productos activos</div>
        <div class="stat-value">—</div>
        <div class="stat-sub">En catálogo</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Pedidos hoy</div>
        <div class="stat-value">—</div>
        <div class="stat-sub">Todos los canales</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Clientes</div>
        <div class="stat-value">—</div>
        <div class="stat-sub">Registrados</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Sucursales</div>
        <div class="stat-value">—</div>
        <div class="stat-sub">Activas</div>
      </div>
    </div>
    <div class="table-card">
      <div class="table-header">
        <h3>Bienvenido al ERP Zapatillas May</h3>
      </div>
      <div style="padding:2rem;color:#888;text-align:center">
        <p style="font-size:1.1rem;margin-bottom:0.5rem">Sistema funcionando correctamente ✅</p>
        <p>Selecciona un módulo del menú para comenzar</p>
      </div>
    </div>
  `
}

async function cargarProductos() {
  const content = document.getElementById('content')
  try {
    const res = await fetch(`${API}/productos/`)
    const data = await res.json()
    content.innerHTML = `
      <div class="table-card">
        <div class="table-header">
          <h3>Productos (${data.length})</h3>
          <button class="btn btn-primary">+ Nuevo producto</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio menudeo</th>
              <th>Precio mayoreo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${data.length === 0 ? '<tr><td colspan="5" style="text-align:center;color:#888;padding:2rem">No hay productos aún</td></tr>' :
              data.map(p => `
                <tr>
                  <td><strong>${p.nombre}</strong><br><small style="color:#888">${p.sku_interno || '—'}</small></td>
                  <td>${p.categoria || '—'}</td>
                  <td>$${p.precio_menudeo}</td>
                  <td>$${p.precio_mayoreo || '—'}</td>
                  <td><span class="badge ${p.activo ? 'badge-success' : 'badge-danger'}">${p.activo ? 'Activo' : 'Inactivo'}</span></td>
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
    const res = await fetch(`${API}/clientes/`)
    const data = await res.json()
    content.innerHTML = `
      <div class="table-card">
        <div class="table-header">
          <h3>Clientes (${data.length})</h3>
          <button class="btn btn-primary">+ Nuevo cliente</button>
        </div>
        <table>
          <thead>
            <tr><th>Nombre</th><th>Teléfono</th><th>Tipo</th><th>Email</th></tr>
          </thead>
          <tbody>
            ${data.length === 0 ? '<tr><td colspan="4" style="text-align:center;color:#888;padding:2rem">No hay clientes aún</td></tr>' :
              data.map(c => `
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
    const res = await fetch(`${API}/pedidos/`)
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
            ${data.length === 0 ? '<tr><td colspan="5" style="text-align:center;color:#888;padding:2rem">No hay pedidos aún</td></tr>' :
              data.map(p => `
                <tr>
                  <td>${p.clientes?.nombre || '—'}</td>
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
    const res = await fetch(`${API}/sucursales/`)
    const data = await res.json()
    content.innerHTML = `
      <div class="table-card">
        <div class="table-header">
          <h3>Sucursales (${data.length})</h3>
          <button class="btn btn-primary">+ Nueva sucursal</button>
        </div>
        <table>
          <thead>
            <tr><th>Nombre</th><th>Tipo</th><th>Dirección</th><th>Teléfono</th><th>Estado</th></tr>
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
  content.innerHTML = `
    <div class="table-card">
      <div class="table-header">
        <h3>Inventario por sucursal</h3>
      </div>
      <div style="padding:2rem;color:#888;text-align:center">
        <p>Agrega productos primero para ver el inventario aquí</p>
      </div>
    </div>
  `
}