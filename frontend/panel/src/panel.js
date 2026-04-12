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
        <div class="stat-sub">En catalogo</div>
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
        <p style="font-size:1.1rem;margin-bottom:0.5rem">Sistema funcionando correctamente</p>
        <p>Selecciona un modulo del menu para comenzar</p>
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
              <th>Mayoreo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${filtrados.length === 0
              ? '<tr><td colspan="7" style="text-align:center;color:#888;padding:2rem">No hay productos en esta categoria</td></tr>'
              : filtrados.map(p => `
                <tr>
                  <td style="display:flex;align-items:center;gap:10px">
                    ${p.imagen_principal ? '<img src="' + p.imagen_principal + '" style="width:44px;height:44px;object-fit:cover;border-radius:6px;border:1px solid #eee;flex-shrink:0">' : '<div style="width:44px;height:44px;background:#f5f5f5;border-radius:6px;flex-shrink:0;display:flex;align-items:center;justify-content:center;color:#ccc">?</div>'}
                    <strong>${p.nombre}</strong>
                  </td>
                  <td><small style="color:#888">${p.sku_interno || '—'}</small></td>
                  <td>${p.categoria || '—'}</td>
                  <td>$${p.precio_menudeo}</td>
                  <td>$${p.precio_mayoreo || '—'}</td>
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
              ? '<tr><td colspan="4" style="text-align:center;color:#888;padding:2rem">No hay clientes aun</td></tr>'
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
              ? '<tr><td colspan="5" style="text-align:center;color:#888;padding:2rem">No hay pedidos aun</td></tr>'
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
        <input class="form-input" id="inv-buscar" placeholder="Buscar por nombre o SKU..." style="max-width:280px" oninput="renderInventario()">
        <select class="form-input" id="inv-categoria" style="max-width:160px" onchange="renderInventario()">
          <option value="">Todas las categorias</option>
          ${[...new Set(productos.map(p => p.categoria).filter(Boolean))].map(c => `<option value="${c}">${c.charAt(0).toUpperCase() + c.slice(1)}</option>`).join('')}
        </select>
        <select class="form-input" id="inv-talla" style="max-width:120px" onchange="renderInventario()">
          <option value="">Todas las tallas</option>
          ${['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27'].map(t => `<option value="${t}">${t}</option>`).join('')}
        </select>
        <select class="form-input" id="inv-estado" style="max-width:140px" onchange="renderInventario()">
          <option value="">Todos los estados</option>
          <option value="disponible">Disponible</option>
          <option value="bajo">Stock bajo</option>
          <option value="agotado">Agotado</option>
        </select>
        <button class="btn btn-primary" onclick="mostrarFormInventario()">+ Agregar stock</button>
      </div>
      <div id="inv-contenido"></div>
    `
    renderInventario()
  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error conectando con el servidor</p>'
  }
}

function generarSKU(categoria, nombre) {
  const cat = CATEGORIAS.find(c => c.value === categoria)
  const prefix = cat ? cat.prefix : 'MAY'
  const palabras = nombre.trim().split(' ').slice(0, 2).map(p => p.substring(0, 3).toUpperCase()).join('')
  const num = Math.floor(Math.random() * 900) + 100
  return prefix + '-' + palabras + '-' + num
}

function renderVariante(i, datos) {
  const d = datos || {}
  return `
    <div class="variante-item" id="variante-${i}" style="background:#f9f9f9;border-radius:8px;padding:1rem;margin-bottom:1rem;border:1px solid #eee">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem">
        <p style="font-weight:500;color:#333;font-size:0.9rem">Color ${i + 1}</p>
        ${i > 0 ? '<button type="button" onclick="this.closest(\'.variante-item\').remove()" style="background:none;border:none;color:#E91E8C;cursor:pointer;font-size:0.85rem">Eliminar</button>' : ''}
      </div>
      <div style="margin-bottom:0.75rem">
        <label class="form-label">Paleta de colores</label>
        <div style="display:flex;flex-wrap:wrap;gap:5px;max-width:100%">
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
          <input class="form-input" id="v${i}-nombre" placeholder="Nombre del color" value="${d.color || ''}" style="width:160px">
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
          <input class="form-input" id="f-proveedor" placeholder="Nombre del proveedor" value="${d.proveedor || ''}">
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
    <p style="font-size:0.75rem;color:#888;margin-bottom:1rem">Deja en blanco para calcular automatico. Si pones un valor ese tiene prioridad sobre el automatico.</p>
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
    <div style="margin-top:1rem;display:flex
  </div>
</div>

      <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
        <p style="font-weight:600;margin-bottom:0.5rem;color:#333">Colores e imagenes</p>
        <p style="font-size:0.8rem;color:#888;margin-bottom:1rem">Selecciona de la paleta o personaliza el color. Sube las fotos de cada color por separado.</p>
        <div id="variantes-container">${renderVariante(0, null)}</div>
        <button type="button" class="btn btn-secondary" onclick="agregarVariante()">+ Agregar otro color</button>
        <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem;margin-top:1rem">
  <p style="font-weight:600;margin-bottom:0.5rem;color:#333">Stock inicial</p>
  <p style="font-size:0.8rem;color:#888;margin-bottom:1rem">Captura cuantos pares tienes disponibles al dar de alta el producto. Se asignaran a la sucursal seleccionada.</p>
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
  const nombre = document.getElementById('f-nombre').value
  const categoria = document.getElementById('f-categoria').value
  const proveedor = document.getElementById('f-proveedor').value
  const skuInput = document.getElementById('f-sku')
  if (!skuInput.value && nombre && categoria && proveedor) {
    try {
      const res = await fetch(API + '/productos/siguiente-sku/' + categoria + '/' + encodeURIComponent(proveedor))
      const data = await res.json()
      skuInput.value = data.sku_base
    } catch(e) {
      console.error('Error generando SKU', e)
    }
  }
}

window.regenerarSKU = async () => {
  const categoria = document.getElementById('f-categoria').value
  const proveedor = document.getElementById('f-proveedor').value
  if (categoria && proveedor) {
    try {
      const res = await fetch(API + '/productos/siguiente-sku/' + categoria + '/' + encodeURIComponent(proveedor))
      const data = await res.json()
      document.getElementById('f-sku').value = data.sku_base
    } catch(e) {
      console.error('Error generando SKU', e)
    }
  } else {
    alert('Selecciona categoria y escribe el proveedor primero')
  }
}

window.regenerarSKU = () => {
  const nombre = document.getElementById('f-nombre').value
  const categoria = document.getElementById('f-categoria').value
  if (nombre && categoria) {
    document.getElementById('f-sku').value = generarSKU(categoria, nombre)
  }
}

window.seleccionarColor = (idx, hex, nombre) => {
  document.getElementById('v' + idx + '-hex').value = hex
  document.getElementById('v' + idx + '-nombre').value = nombre
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
  document.getElementById('descuento-pct').style.display = chk.checked ? 'flex' : 'none'
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
        } catch(e) {
          console.error('Error subiendo imagen', e)
        }
      }
    }
    resultado.push({ color: nombre.value, color_hex: hex ? hex.value : '#000000', imagenes: urls })
  }
  return resultado
}

window.guardarProducto = async () => {
  const nombre = document.getElementById('f-nombre').value
  const costo = document.getElementById('f-costo').value
  const precio_menudeo = document.getElementById('f-menudeo').value
  const categoria = document.getElementById('f-categoria').value

  if (!nombre || !costo || !precio_menudeo || !categoria) {
    alert('Por favor completa los campos obligatorios: Nombre, Categoria, Costo y Precio menudeo')
    return
  }

  const btn = document.getElementById('btn-guardar')
  btn.textContent = 'Guardando...'
  btn.disabled = true

  const tallas = [...document.querySelectorAll('.talla-label input:checked')].map(i => i.value)
  const variantesData = await subirImagenesVariantes()
  const pesoKilos = document.getElementById('f-peso').value
  const pesoGramos = pesoKilos ? Math.round(parseFloat(pesoKilos) * 1000) : null

  const producto = {
    nombre,
    sku_interno: document.getElementById('f-sku').value || null,
    marca: document.getElementById('f-marca').value || null,
    proveedor: document.getElementById('f-proveedor').value || null,
    categoria,
    subcategoria: document.getElementById('f-subcategoria').value || null,
    descripcion: document.getElementById('f-descripcion').value || null,
    material: document.getElementById('f-material').value || null,
    material_suela: document.getElementById('f-suela').value || null,
    forro: document.getElementById('f-forro').value || null,
    horma: document.getElementById('f-horma').value || null,
    altura_tacon: document.getElementById('f-tacon').value ? parseFloat(document.getElementById('f-tacon').value) : null,
    tipo_tacon: document.getElementById('f-tipotacon').value || null,
    costo: parseFloat(costo),
    precio_menudeo: parseFloat(precio_menudeo),
    precio_antes: document.getElementById('f-antes').value ? parseFloat(document.getElementById('f-antes').value) : null,
    tiene_descuento: document.getElementById('f-descuento').checked,
    porcentaje_descuento: document.getElementById('f-pct') ? parseInt(document.getElementById('f-pct').value) || 0 : 0,
    tallas_disponibles: tallas,
    peso_gramos: pesoGramos,
    slug: document.getElementById('f-slug').value ? document.getElementById('f-slug').value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : null,
    meta_titulo: document.getElementById('f-metatitulo').value || null,
    meta_descripcion: document.getElementById('f-metadesc').value || null,
    imagen_principal: variantesData.length > 0 && variantesData[0].imagenes.length > 0 ? variantesData[0].imagenes[0] : null,precio_mayoreo3: document.getElementById('f-mayoreo3').value ? parseFloat(document.getElementById('f-mayoreo3').value) : null,
    precio_mayoreo6: document.getElementById('f-mayoreo6').value ? parseFloat(document.getElementById('f-mayoreo6').value) : null,
    precio_corrida: document.getElementById('f-corrida').value ? parseFloat(document.getElementById('f-corrida').value) : null,
    corrida_activa: document.getElementById('f-corrida-activa').checked,
    es_oferta: document.getElementById('f-oferta').checked,
    activo: true,
    nuevo: !window._productoEditandoId
  }

  try {
    const method = window._productoEditandoId ? 'PATCH' : 'POST'
    const url = window._productoEditandoId ? API + '/productos/' + window._productoEditandoId : API + '/productos/'
    console.log('Enviando producto:', JSON.stringify(producto))
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
              body: JSON.stringify({
                producto_id: pid,
                color: v.color,
                color_hex: v.color_hex,
                talla: talla,
                foto_url: v.imagenes[0] || null
              })
            })
          }
        }
      }
     const sucursalStock = document.getElementById('f-sucursal-stock')?.value
if (sucursalStock && pid) {
  const tallasGuardar = tallas.length > 0 ? tallas : ['Unica']
  for (const v of variantesData) {
    for (const talla of tallasGuardar) {
      const tallaId = talla.replace('.', '_')
      const varIdx = variantesData.indexOf(v)
      const inputStock = document.getElementById('stock-ini-' + varIdx + '-' + tallaId)
      const cantidad = inputStock ? parseInt(inputStock.value) || 0 : 0
      if (cantidad > 0) {
        const varRes = await fetch(API + '/variantes/producto/' + pid)
        const vars = await varRes.json()
        const varMatch = vars.find(vr => vr.color === v.color && vr.talla === talla)
        if (varMatch) {
          await fetch(API + '/inventario/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              variante_id: varMatch.id,
              sucursal_id: sucursalStock,
              cantidad,
              stock_minimo: 3
            })
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
      btn.textContent = 'Guardar producto'
      btn.disabled = false
    }
  } catch(e) {
    alert('Error conectando con el servidor')
    btn.textContent = 'Guardar producto'
    btn.disabled = false
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
  const confirmMsg = activo ? 'Desactivar este producto?' : 'Activar este producto?'
  if (!confirm(confirmMsg)) return
  try {
    const res = await fetch(API + '/productos/' + id + '/' + accion, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    })
    if (res.ok) {
      cargarProductos()
    } else {
      alert('Error al cambiar el estado del producto')
    }
  } catch(e) {
    alert('Error conectando con el servidor')
  }
}
window.filtrarInventario = async () => {
  const sucursalId = document.getElementById('filtro-sucursal').value
  const productoId = document.getElementById('filtro-producto').value
  const tabla = document.getElementById('inventario-tabla')

  tabla.innerHTML = '<p style="padding:2rem;color:#888;text-align:center">Cargando...</p>'

  try {
    let url = API + '/inventario/'
    if (sucursalId) url = API + '/inventario/sucursal/' + sucursalId
    else if (productoId) url = API + '/inventario/producto/' + productoId

    const res = await fetch(url)
    const data = await res.json()

    if (data.length === 0) {
      tabla.innerHTML = '<div style="padding:2rem;color:#888;text-align:center">No hay inventario registrado para este filtro</div>'
      return
    }

    tabla.innerHTML = `
      <div class="table-card">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Color</th>
              <th>Talla</th>
              <th>SKU</th>
              <th>Sucursal</th>
              <th>Cantidad</th>
              <th>Stock minimo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(i => {
              const cantidad = i.cantidad || 0
              const minimo = i.stock_minimo || 3
              const estado = cantidad === 0 ? 'badge-danger' : cantidad <= minimo ? 'badge-warning' : 'badge-success'
              const estadoTexto = cantidad === 0 ? 'Agotado' : cantidad <= minimo ? 'Stock bajo' : 'Disponible'
              return `
                <tr>
                  <td><strong>${i.variantes?.productos?.nombre || '—'}</strong></td>
                  <td>
                    ${i.variantes?.color_hex ? '<span style="display:inline-block;width:14px;height:14px;background:' + i.variantes.color_hex + ';border-radius:50%;margin-right:6px;border:1px solid #ddd;vertical-align:middle"></span>' : ''}
                    ${i.variantes?.color || '—'}
                  </td>
                  <td>${i.variantes?.talla || '—'}</td>
                  <td><small style="color:#888">${i.variantes?.sku || '—'}</small></td>
                  <td>${i.sucursales?.nombre || '—'}</td>
                  <td><strong>${cantidad}</strong></td>
                  <td>${minimo}</td>
                  <td><span class="badge ${estado}">${estadoTexto}</span></td>
                  <td>
                    <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem"
                      onclick="editarStock('${i.variante_id}', '${i.sucursal_id}', ${cantidad}, ${minimo})">
                      Editar
                    </button>
                  </td>
                </tr>
              `
            }).join('')}
          </tbody>
        </table>
      </div>
    `
  } catch(e) {
    tabla.innerHTML = '<p style="padding:2rem;color:red">Error cargando inventario</p>'
  }
}

window.mostrarFormInventario = async () => {
  const resSucursales = await fetch(API + '/sucursales/')
  const sucursales = await resSucursales.json()
  const resVariantes = await fetch(API + '/variantes/')
  const variantes = await resVariantes.json()

  const content = document.getElementById('content')
  content.innerHTML = `
    <div class="table-card" style="padding:2rem">
      <h3 style="margin-bottom:1.5rem">Agregar stock</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label">Sucursal *</label>
          <select class="form-input" id="inv-sucursal" required>
            <option value="">Selecciona sucursal...</option>
            ${sucursales.map(s => `<option value="${s.id}">${s.nombre}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="form-label">Variante (producto + color + talla) *</label>
          <select class="form-input" id="inv-variante" required>
            <option value="">Selecciona variante...</option>
            ${variantes.map(v => `<option value="${v.id}">${v.productos?.nombre || ''} - ${v.color} - Talla ${v.talla} (${v.sku || ''})</option>`).join('')}
          </select>
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
      <div style="display:flex;gap:1rem;justify-content:flex-end">
        <button type="button" class="btn btn-secondary" onclick="navegarA('inventario')">Cancelar</button>
        <button type="button" class="btn btn-primary" onclick="guardarInventario()">Guardar stock</button>
      </div>
    </div>
  `
}

window.guardarInventario = async () => {
  const sucursal_id = document.getElementById('inv-sucursal').value
  const variante_id = document.getElementById('inv-variante').value
  const cantidad = document.getElementById('inv-cantidad').value
  const stock_minimo = document.getElementById('inv-minimo').value || 3

  if (!sucursal_id || !variante_id || cantidad === '') {
    alert('Por favor completa todos los campos obligatorios')
    return
  }

  try {
    const res = await fetch(API + '/inventario/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sucursal_id,
        variante_id,
        cantidad: parseInt(cantidad),
        stock_minimo: parseInt(stock_minimo)
      })
    })
    if (res.ok) {
      alert('Stock guardado correctamente')
      navegarA('inventario')
    } else {
      const err = await res.text()
      alert('Error: ' + err)
    }
  } catch(e) {
    alert('Error conectando con el servidor')
  }
}

window.editarStock = async (variante_id, sucursal_id, cantidad, minimo) => {
  const nuevaCantidad = prompt('Nueva cantidad:', cantidad)
  if (nuevaCantidad === null) return
  const nuevoMinimo = prompt('Stock minimo:', minimo)
  if (nuevoMinimo === null) return

  try {
    const res = await fetch(API + '/inventario/actualizar', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        variante_id,
        sucursal_id,
        cantidad: parseInt(nuevaCantidad),
        stock_minimo: parseInt(nuevoMinimo)
      })
    })
    if (res.ok) {
      filtrarInventario()
    } else {
      alert('Error actualizando stock')
    }
  } catch(e) {
    alert('Error conectando con el servidor')
  }
}
window.renderInventario = () => {
  const { sucursales, productos, variantes, inventario } = window._invData
  const buscar = document.getElementById('inv-buscar').value.toLowerCase()
  const categoriaFiltro = document.getElementById('inv-categoria').value
  const tallaFiltro = document.getElementById('inv-talla').value
  const estadoFiltro = document.getElementById('inv-estado').value

  const TALLAS_ORDEN = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Unica']

  const productosFiltrados = productos.filter(p => {
    if (buscar && !p.nombre.toLowerCase().includes(buscar) && !(p.sku_interno || '').toLowerCase().includes(buscar)) return false
    if (categoriaFiltro && p.categoria !== categoriaFiltro) return false
    return true
  })

  const html = sucursales.map(suc => {
    const invSucursal = inventario.filter(i => i.sucursal_id === suc.id)
    if (invSucursal.length === 0) return ''

    const productosHtml = productosFiltrados.map(prod => {
      const variantesProd = variantes.filter(v => v.producto_id === prod.id)
      if (variantesProd.length === 0) return ''

      const colores = [...new Set(variantesProd.map(v => v.color).filter(Boolean))]
      
      const coloresHtml = colores.map(color => {
        const variantesColor = variantesProd
          .filter(v => v.color === color)
          .sort((a, b) => TALLAS_ORDEN.indexOf(a.talla) - TALLAS_ORDEN.indexOf(b.talla))

        if (tallaFiltro && !variantesColor.find(v => v.talla === tallaFiltro)) return ''

        const colorHex = variantesColor[0]?.color_hex || '#888'
        
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

          let bg, color2, title
          if (cantidad === null) {
            bg = '#f0f0f0'; color2 = '#aaa'; title = 'Sin registro'
          } else if (cantidad === 0) {
            bg = '#ffebee'; color2 = '#c62828'; title = 'Agotado'
          } else if (cantidad <= minimo) {
            bg = '#fff8e1'; color2 = '#f57f17'; title = 'Stock bajo'
          } else {
            bg = '#e8f5e9'; color2 = '#2e7d32'; title = 'Disponible'
          }

          return `
            <div onclick="editarStock('${v.id}', '${suc.id}', ${cantidad || 0}, ${minimo})"
                 title="${title} - Click para editar"
                 style="display:inline-flex;flex-direction:column;align-items:center;background:${bg};border-radius:8px;padding:6px 10px;cursor:pointer;min-width:52px;border:1px solid ${color2}30;transition:transform 0.1s"
                 onmouseover="this.style.transform='scale(1.05)'"
                 onmouseout="this.style.transform='scale(1)'">
              <span style="font-size:0.7rem;color:#666;font-weight:500">${v.talla}</span>
              <span style="font-size:1rem;font-weight:700;color:${color2}">${cantidad !== null ? cantidad : '—'}</span>
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
            <button class="btn btn-secondary" style="padding:4px 10px;font-size:0.75rem" onclick="mostrarFormInventarioProducto('${prod.id}', '${suc.id}')">+ Stock rapido</button>
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

  document.getElementById('inv-contenido').innerHTML = html || `
    <div style="text-align:center;padding:3rem;color:#888">
      <p style="font-size:1.1rem">No hay inventario registrado</p>
      <p style="margin-top:0.5rem">Agrega stock con el boton "+ Agregar stock"</p>
    </div>
  `
}

window.mostrarFormInventarioProducto = async (productoId, sucursalId) => {
  const resVariantes = await fetch(API + '/variantes/producto/' + productoId)
  const variantes = await resVariantes.json()
  const resSucursales = await fetch(API + '/sucursales/')
  const sucursales = await resSucursales.json()

  const TALLAS_ORDEN = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Unica']
  const colores = [...new Set(variantes.map(v => v.color).filter(Boolean))]

  const content = document.getElementById('content')
  content.innerHTML = `
    <div class="table-card" style="padding:2rem">
      <h3 style="margin-bottom:1.5rem">Agregar stock rapido</h3>
      <div style="margin-bottom:1.5rem">
        <label class="form-label">Sucursal</label>
        <select class="form-input" id="inv-suc-rapido" style="max-width:300px">
          ${sucursales.map(s => `<option value="${s.id}" ${s.id === sucursalId ? 'selected' : ''}>${s.nombre}</option>`).join('')}
        </select>
      </div>
      <div id="inv-rapido-tabla">
        ${colores.map(color => {
          const variantesColor = variantes
            .filter(v => v.color === color)
            .sort((a, b) => TALLAS_ORDEN.indexOf(a.talla) - TALLAS_ORDEN.indexOf(b.talla))
          const colorHex = variantesColor[0]?.color_hex || '#888'
          return `
            <div style="margin-bottom:1.5rem">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:0.75rem">
                <div style="width:16px;height:16px;border-radius:50%;background:${colorHex};border:2px solid #ddd"></div>
                <span style="font-weight:600;color:#333">${color}</span>
              </div>
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                ${variantesColor.map(v => `
                  <div style="text-align:center">
                    <div style="font-size:0.75rem;color:#888;margin-bottom:4px">${v.talla}</div>
                    <input type="number" min="0" placeholder="0"
                           id="stock-${v.id}"
                           style="width:60px;text-align:center;padding:6px;border:1px solid #ddd;border-radius:6px;font-size:0.9rem">
                  </div>
                `).join('')}
              </div>
            </div>
          `
        }).join('')}
      </div>
      <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1.5rem">
        <button type="button" class="btn btn-secondary" onclick="navegarA('inventario')">Cancelar</button>
        <button type="button" class="btn btn-primary" onclick="guardarStockRapido(${JSON.stringify(variantes.map(v => v.id))})">Guardar todo</button>
      </div>
    </div>
  `
}

window.guardarStockRapido = async (varianteIds) => {
  const sucursalId = document.getElementById('inv-suc-rapido').value
  let guardados = 0
  let errores = 0

  for (const vid of varianteIds) {
    const input = document.getElementById('stock-' + vid)
    if (!input || input.value === '') continue
    const cantidad = parseInt(input.value)

    try {
      const res = await fetch(API + '/inventario/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variante_id: vid,
          sucursal_id: sucursalId,
          cantidad,
          stock_minimo: 3
        })
      })
      if (res.ok) guardados++
      else errores++
    } catch(e) {
      errores++
    }
  }

  if (errores > 0) {
    alert(`Guardados: ${guardados}, Errores: ${errores}. Los errores pueden ser porque ya existe ese registro, usa "Editar" para actualizarlo.`)
  } else {
    alert(`${guardados} registros guardados correctamente`)
  }
  navegarA('inventario')
}
window.actualizarTablaStock = () => {
  const TALLAS_ORDEN = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Unica']
  
  const tallas = [...document.querySelectorAll('.talla-label input:checked')]
    .map(i => i.value)
    .sort((a, b) => TALLAS_ORDEN.indexOf(a) - TALLAS_ORDEN.indexOf(b))

  const variantes = document.querySelectorAll('.variante-item')
  const colores = []
  variantes.forEach(v => {
    const id = v.id.replace('variante-', '')
    const nombre = document.getElementById('v' + id + '-nombre')?.value
    const hex = document.getElementById('v' + id + '-hex')?.value
    if (nombre) colores.push({ nombre, hex, id })
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