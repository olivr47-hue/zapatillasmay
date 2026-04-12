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
          <button class="btn btn-primary" onclick="mostrarFormProducto()">+ Nuevo producto</button>
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
            ${data.length === 0
              ? '<tr><td colspan="5" style="text-align:center;color:#888;padding:2rem">No hay productos aún</td></tr>'
              : data.map(p => `
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
            ${data.length === 0
              ? '<tr><td colspan="4" style="text-align:center;color:#888;padding:2rem">No hay clientes aún</td></tr>'
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
            ${data.length === 0
              ? '<tr><td colspan="5" style="text-align:center;color:#888;padding:2rem">No hay pedidos aún</td></tr>'
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

const TALLAS = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Única']

window.mostrarFormProducto = () => {
  const content = document.getElementById('content')
  content.innerHTML = `
    <div class="table-card" style="padding:2rem">
      <h3 style="margin-bottom:1.5rem">Nuevo producto</h3>
      <form id="form-producto">

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
          <div>
            <label class="form-label">Nombre del producto *</label>
            <input class="form-input" id="f-nombre" required placeholder="Ej: Sandalia de tacón Valentina">
          </div>
          <div>
            <label class="form-label">SKU interno</label>
            <input class="form-input" id="f-sku" placeholder="Ej: MAY-001">
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
          <div>
            <label class="form-label">Marca (visible al cliente)</label>
            <input class="form-input" id="f-marca" placeholder="Ej: Zapatillas May">
          </div>
          <div>
            <label class="form-label">Proveedor (interno)</label>
            <input class="form-input" id="f-proveedor" placeholder="Nombre del proveedor">
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
          <div>
            <label class="form-label">Categoría *</label>
            <select class="form-input" id="f-categoria" required>
              <option value="">Selecciona...</option>
              <option value="tacones">Tacones</option>
              <option value="sandalias">Sandalias</option>
              <option value="botas">Botas</option>
              <option value="botines">Botines</option>
              <option value="flats">Flats</option>
              <option value="plataformas">Plataformas</option>
              <option value="tenis">Tenis</option>
              <option value="nina">Calzado de niña</option>
              <option value="accesorios">Accesorios</option>
            </select>
          </div>
          <div>
            <label class="form-label">Subcategoría</label>
            <input class="form-input" id="f-subcategoria" placeholder="Ej: Casual, Fiesta, Trabajo">
          </div>
        </div>

        <div style="margin-bottom:1rem">
          <label class="form-label">Descripción</label>
          <textarea class="form-input" id="f-descripcion" rows="3" placeholder="Describe el producto detalladamente para SEO..."></textarea>
        </div>

        <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
          <p style="font-weight:600;margin-bottom:1rem;color:#333">Detalles técnicos</p>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem">
            <div>
              <label class="form-label">Material</label>
              <input class="form-input" id="f-material" placeholder="Ej: Cuero sintético">
            </div>
            <div>
              <label class="form-label">Material suela</label>
              <input class="form-input" id="f-suela" placeholder="Ej: Hule">
            </div>
            <div>
              <label class="form-label">Forro</label>
              <input class="form-input" id="f-forro" placeholder="Ej: Textil">
            </div>
            <div>
              <label class="form-label">Horma</label>
              <select class="form-input" id="f-horma">
                <option value="">Selecciona...</option>
                <option value="normal">Normal</option>
                <option value="reducida">Reducida</option>
                <option value="amplia">Amplia</option>
              </select>
            </div>
            <div>
              <label class="form-label">Altura tacón (cm)</label>
              <input class="form-input" id="f-tacon" type="number" step="0.5" placeholder="Ej: 8.5">
            </div>
            <div>
              <label class="form-label">Tipo de tacón</label>
              <select class="form-input" id="f-tipotacon">
                <option value="">Selecciona...</option>
                <option value="aguja">Aguja</option>
                <option value="bloque">Bloque</option>
                <option value="cuña">Cuña</option>
                <option value="plataforma">Plataforma</option>
                <option value="sin_tacon">Sin tacón</option>
              </select>
            </div>
          </div>
        </div>

        <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
          <p style="font-weight:600;margin-bottom:1rem;color:#333">Precios</p>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:1rem">
            <div>
              <label class="form-label">Costo (interno) *</label>
              <input class="form-input" id="f-costo" type="number" step="0.01" required placeholder="0.00">
            </div>
            <div>
              <label class="form-label">Precio menudeo *</label>
              <input class="form-input" id="f-menudeo" type="number" step="0.01" required placeholder="0.00">
            </div>
            <div>
              <label class="form-label">Precio mayoreo</label>
              <input class="form-input" id="f-mayoreo" type="number" step="0.01" placeholder="0.00">
            </div>
            <div>
              <label class="form-label">Precio antes (tachado)</label>
              <input class="form-input" id="f-antes" type="number" step="0.01" placeholder="0.00">
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:1rem;margin-top:1rem">
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
              <input type="checkbox" id="f-descuento" onchange="toggleDescuento()">
              <span class="form-label" style="margin:0">Tiene descuento</span>
            </label>
            <div id="descuento-pct" style="display:none">
              <input class="form-input" id="f-pct" type="number" min="0" max="100" placeholder="%" style="width:80px">
            </div>
          </div>
        </div>

        <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
          <p style="font-weight:600;margin-bottom:1rem;color:#333">Tallas disponibles</p>
          <div style="display:flex;flex-wrap:wrap;gap:8px">
            ${TALLAS.map(t => `
              <label class="talla-label" style="display:flex;align-items:center;gap:4px;background:#f5f5f5;padding:6px 12px;border-radius:6px;cursor:pointer;border:2px solid transparent">
                <input type="checkbox" value="${t}" style="display:none" onchange="toggleTalla(this)">
                <span>${t}</span>
              </label>
            `).join('')}
          </div>
        </div>

        <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
          <p style="font-weight:600;margin-bottom:1rem;color:#333">Logística y SEO</p>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div>
              <label class="form-label">Peso en gramos (para envío)</label>
              <input class="form-input" id="f-peso" type="number" placeholder="Ej: 450">
            </div>
            <div>
              <label class="form-label">Slug URL (para SEO)</label>
              <input class="form-input" id="f-slug" placeholder="Ej: sandalia-tacon-valentina">
            </div>
            <div>
              <label class="form-label">Meta título (SEO)</label>
              <input class="form-input" id="f-metatitulo" placeholder="Ej: Sandalia de tacón Valentina | Zapatillas May">
            </div>
            <div>
              <label class="form-label">Meta descripción (SEO)</label>
              <input class="form-input" id="f-metadesc" placeholder="Descripción para Google (máx 160 caracteres)">
            </div>
          </div>
        </div>

        <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1.5rem">
          <button type="button" class="btn btn-secondary" onclick="navegarA('productos')">Cancelar</button>
          <button type="button" class="btn btn-primary" onclick="guardarProducto()">Guardar producto</button>
        </div>

      </form>
    </div>
  `
}

window.toggleDescuento = () => {
  const chk = document.getElementById('f-descuento')
  document.getElementById('descuento-pct').style.display = chk.checked ? 'block' : 'none'
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
}

window.guardarProducto = async () => {
  const nombre = document.getElementById('f-nombre').value
  const costo = document.getElementById('f-costo').value
  const precio_menudeo = document.getElementById('f-menudeo').value
  const categoria = document.getElementById('f-categoria').value

  if (!nombre || !costo || !precio_menudeo || !categoria) {
    alert('Por favor completa los campos obligatorios: Nombre, Categoría, Costo y Precio menudeo')
    return
  }

  const tallas = [...document.querySelectorAll('.talla-label input:checked')].map(i => i.value)

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
    precio_mayoreo: document.getElementById('f-mayoreo').value ? parseFloat(document.getElementById('f-mayoreo').value) : null,
    precio_antes: document.getElementById('f-antes').value ? parseFloat(document.getElementById('f-antes').value) : null,
    tiene_descuento: document.getElementById('f-descuento').checked,
    porcentaje_descuento: document.getElementById('f-pct') ? parseInt(document.getElementById('f-pct').value) || 0 : 0,
    tallas_disponibles: tallas,
    peso_gramos: document.getElementById('f-peso').value ? parseInt(document.getElementById('f-peso').value) : null,
    slug: document.getElementById('f-slug').value || null,
    meta_titulo: document.getElementById('f-metatitulo').value || null,
    meta_descripcion: document.getElementById('f-metadesc').value || null,
    activo: true,
    nuevo: true
  }

  try {
    const res = await fetch(`${API}/productos/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto)
    })
    if (res.ok) {
      alert('Producto guardado correctamente')
      navegarA('productos')
    } else {
      const err = await res.text()
      alert('Error al guardar: ' + err)
    }
  } catch(e) {
    alert('Error conectando con el servidor')
  }
}