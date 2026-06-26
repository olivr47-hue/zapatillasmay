const API = '/api'

const TALLAS = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Unica']

const COLORES_SUGERIDOS = [
  { nombre: 'Negro', hex: '#000000' },
  { nombre: 'Blanco', hex: '#FFFFFF' },
  { nombre: 'Hueso', hex: '#F5F0E8' },
  { nombre: 'Nude claro', hex: '#F5DCC8' },
  { nombre: 'Nude', hex: '#E8C4A0' },
  { nombre: 'Nude oscuro', hex: '#C49A7A' },
  { nombre: 'Nude rosa', hex: '#F2C4B0' },
  { nombre: 'Palo de rosa', hex: '#D4A096' },
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
  { id: 'dashboard', icon: '📊', label: 'Dashboard', section: 'Principal', soloAdmin: true },
  { id: 'pos', icon: '🛒', label: 'Punto de venta', section: 'Principal' },
  { id: 'productos', icon: '👠', label: 'Productos', section: 'Catalogo' },
  { id: 'resenas', icon: '⭐', label: 'Reseñas', section: 'Catalogo', soloAdmin: true },
  { id: 'inventario', icon: '📦', label: 'Inventario', section: 'Catalogo' },
  { id: 'carritos', icon: '🛒', label: 'Carritos', section: 'Ventas' },
  { id: 'pedidos', icon: '🛍️', label: 'Pedidos', section: 'Ventas' },
  { id: 'clientes', icon: '👥', label: 'Clientes', section: 'Ventas' },
  { id: 'historial', icon: '📋', label: 'Historial', section: 'Ventas' },
  { id: 'analisis', icon: '📈', label: 'Analisis', section: 'Ventas' },
  { id: 'crm', icon: '🎯', label: 'CRM', section: 'Ventas' },
  { id: 'finanzas', icon: '💰', label: 'Finanzas', section: 'Finanzas', soloAdmin: true },
  { id: 'proveedores', icon: '🏭', label: 'Proveedores', section: 'Finanzas', soloAdmin: true },
  { id: 'sucursales', icon: '🏪', label: 'Sucursales', section: 'Configuracion', soloAdmin: true },
  { id: 'empleados', icon: '👤', label: 'Empleados', section: 'Configuracion', soloAdmin: true },
  { id: 'seo', icon: '🔍', label: 'SEO y Sitio', section: 'Configuracion', soloAdmin: true },
  { id: 'envio', icon: '🚚', label: 'Envíos', section: 'Configuracion', soloAdmin: true },
  { id: 'ordenes', icon: '🛒', label: 'Órdenes de compra', section: 'Finanzas', soloAdmin: true },
  { id: 'conversaciones', icon: '💬', label: 'Conversaciones', section: 'Ventas' },
  { id: 'envios', icon: '📣', label: 'Envíos masivos', section: 'Ventas' },
  { id: 'catalogos', icon: '📖', label: 'Catálogos', section: 'Catalogo', soloAdmin: true },
  { id: 'orden-home', icon: '🏠', label: 'Orden en Home', section: 'Catalogo', soloAdmin: true },
  { id: 'generar-nombres', icon: '✏️', label: 'Generar nombres', section: 'Catalogo', soloAdmin: true },
  { id: 'mercadolibre', icon: '🛒', label: 'MercadoLibre', section: 'Integraciones', soloAdmin: true },
  { id: 'analytics', icon: '📊', label: 'Google Analytics', section: 'Integraciones', soloAdmin: true },
  { id: 'referidos', icon: '🎁', label: 'Referidos', section: 'Ventas', soloAdmin: true },
  { id: 'carritos-abandonados', icon: '🛒', label: 'Carritos abandonados', section: 'Ventas', soloAdmin: true },
]

let moduloActivo = window._empleadoActual?.rol === 'admin' ? 'dashboard' : 'pos'
let varianteCount = 1

export function renderPanel() {
  const _savedModulo = (() => { try { return localStorage.getItem('zm_panel_modulo') } catch(e) { return null } })()
  const _defaultModulo = window._empleadoActual?.rol === 'admin' ? 'dashboard' : 'pos'
  moduloActivo = _savedModulo || _defaultModulo
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
          <h1 id="topbar-title">${modulos.find(m => m.id === moduloActivo)?.label || 'Dashboard'}</h1>
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
    document.body.style.overflow = isOpen ? 'hidden' : ''
  }

  // Interval global para notificaciones de WhatsApp
  if (window._conversacionesInterval) clearInterval(window._conversacionesInterval)
  window._conversacionesInterval = setInterval(async () => {
    try {
      const chats = await window._recargarChats()
      const noLeidosAntes = window._totalNoLeidos || 0
      const noLeidosDespues = chats.reduce((s,c) => s + (c.no_leidos||0), 0)
      window._totalNoLeidos = noLeidosDespues
      if (noLeidosDespues > noLeidosAntes) {
  document.title = `(${noLeidosDespues}) Zapatillas May`
  
  // Badge en nav
  const navConv = document.querySelector('[data-modulo="conversaciones"]')
  if (navConv) {
    let badge = navConv.querySelector('.nav-badge')
    if (!badge) {
      badge = document.createElement('span')
      badge.className = 'nav-badge'
      badge.style.cssText = 'background:#e91e8c;color:white;border-radius:100px;padding:1px 6px;font-size:0.65rem;font-weight:700;margin-left:auto'
      navConv.appendChild(badge)
    }
    badge.textContent = noLeidosDespues
  }

  // Sonido
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 523
    gain.gain.setValueAtTime(0.5, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.2)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.frequency.value = 783
    gain2.gain.setValueAtTime(0.5, ctx.currentTime + 0.2)
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
    osc2.start(ctx.currentTime + 0.2)
    osc2.stop(ctx.currentTime + 0.5)
  } catch(e) {}
}

      // Refrescar la lista lateral en vivo (nuevas conversaciones / mensajes recientes)
      try { window._refrescarListaChats(chats) } catch(_) {}

      // Actualizar mensajes si hay chat abierto
      if (window._chatActivo && window._chatsData[window._chatActivo]) {
        const chat = window._chatsData[window._chatActivo]
        const mensajesArea = document.getElementById('mensajes-area')
        if (mensajesArea) {
          const estaAbajo = mensajesArea.scrollHeight - mensajesArea.scrollTop <= mensajesArea.clientHeight + 60
          mensajesArea.innerHTML = window._renderBurbujas(chat)
          if (estaAbajo) mensajesArea.scrollTop = mensajesArea.scrollHeight
        }
      }
    } catch(e) {}
  }, 8000)

 // ── Polling: pedidos por enviar ───────────────────────────────────
const _BADGE_KEY = 'zm_badge_pedidos'
let _ultimosPedidosPorEnviar = new Set()

function _setBadge(count) {
  const badge = document.getElementById('badge-pedidos-enviar')
  if (!badge) return
  badge.textContent = count
  badge.style.display = count > 0 ? 'inline' : 'none'
}

async function _pollPedidosPorEnviar() {
  try {
    const res = await fetch(API + '/pedidos/?status=pagado')
    if (!res.ok) return
    const pedidos = await res.json()
    // Solo los que vienen de MercadoPago (online): preference (Checkout Pro) o payment (pago embebido)
    const porEnviar = pedidos.filter(p => p.mp_preference_id || p.mp_payment_id)
    const count = porEnviar.length

    // Guardar en localStorage para mostrar al instante en la próxima carga
    localStorage.setItem(_BADGE_KEY, count)
    _setBadge(count)

    // Detectar pedidos nuevos (que no estaban en el poll anterior)
    const idsActuales = new Set(porEnviar.map(p => p.id))
    const nuevos = porEnviar.filter(p => !_ultimosPedidosPorEnviar.has(p.id))
    if (nuevos.length > 0 && _ultimosPedidosPorEnviar.size > 0) {
      // Solo notificar si no es la primera carga
      nuevos.forEach(p => {
        const nombre = p.nombre_cliente || 'Cliente'
        const total = parseFloat(p.total || 0).toLocaleString('es-MX', {maximumFractionDigits: 0})
        _mostrarNotifPedido(`🛍️ Nuevo pedido de ${nombre} — $${total} MXN`)
      })
    }
    _ultimosPedidosPorEnviar = idsActuales
  } catch(e) {}
}

function _mostrarNotifPedido(msg) {
  // Toast persistente en panel
  const div = document.createElement('div')
  div.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#1a1a2e;color:white;padding:14px 20px;border-radius:12px;font-size:0.85rem;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,0.3);z-index:9999;cursor:pointer;max-width:320px;line-height:1.4;border-left:4px solid #e53935'
  div.textContent = msg
  div.onclick = () => { navegarA('pedidos'); div.remove() }
  document.body.appendChild(div)
  setTimeout(() => div.remove(), 8000)

  // Notificación del navegador si tiene permiso
  if (Notification.permission === 'granted') {
    new Notification('Zapatillas May — Panel', { body: msg, icon: '/favicon.ico' })
  } else if (Notification.permission === 'default') {
    Notification.requestPermission()
  }

  // Sonido sutil
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.1)
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
    osc.start(); osc.stop(ctx.currentTime + 0.4)
  } catch(e) {}
}

window._limpiarBadgePedidos = function() {
  const badge = document.getElementById('badge-pedidos-enviar')
  if (badge) badge.style.display = 'none'
  _ultimosPedidosPorEnviar = new Set([..._ultimosPedidosPorEnviar])
}

function _arrancarPollPedidos() {
  if (document.getElementById('badge-pedidos-enviar')) {
    // Mostrar conteo cacheado al instante, luego confirmar con la API
    const cached = parseInt(localStorage.getItem(_BADGE_KEY) || '0', 10)
    if (cached > 0) _setBadge(cached)
    _pollPedidosPorEnviar()
  } else {
    setTimeout(_arrancarPollPedidos, 400)
  }
}
_arrancarPollPedidos()
if (window._pedidosInterval) clearInterval(window._pedidosInterval)
window._pedidosInterval = setInterval(_pollPedidosPorEnviar, 30000)

 window.navegarA = (id) => {
    const esAdmin = window._empleadoActual?.rol === 'admin'
    const modulo = modulos.find(m => m.id === id)
    if (modulo?.soloAdmin && !esAdmin) {
      alert('No tienes permisos para acceder a este módulo')
      return
    }
    moduloActivo = id
    try { localStorage.setItem('zm_panel_modulo', id) } catch(e) {}
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
  const esAdmin = window._empleadoActual?.rol === 'admin'
  const secciones = [...new Set(modulos.filter(m => esAdmin || !m.soloAdmin).map(m => m.section))]
  return secciones.map(sec => `
    <div class="nav-section">${sec}</div>
    ${modulos.filter(m => m.section === sec && (esAdmin || !m.soloAdmin)).map(m => `
      <div class="nav-item ${m.id === moduloActivo ? 'active' : ''}"
           data-modulo="${m.id}"
           onclick="navegarA('${m.id}')">
        <span class="nav-icon">${m.icon}</span>
        ${m.label}
        ${m.id === 'pedidos' ? '<span id="badge-pedidos-enviar" style="display:none;background:#e53935;color:white;border-radius:100px;font-size:0.65rem;font-weight:700;padding:1px 6px;margin-left:auto">0</span>' : ''}
      </div>
    `).join('')}
  `).join('')}

async function cargarModulo(id) {
  const content = document.getElementById('content')
  content.innerHTML = '<p style="padding:2rem;color:#888">Cargando...</p>'
  switch(id) {
    case 'catalogos': await cargarCatalogos(); break
    case 'dashboard': content.innerHTML = renderDashboardHTML(); setTimeout(() => cargarDashboard(), 100); break
    case 'productos': await cargarProductos(); break
    case 'resenas': await cargarResenasModeracion(); break
    case 'clientes': await cargarClientes(); break
    case 'carritos': await cargarCarritos(); break
    case 'pedidos': await cargarPedidos(); window._limpiarBadgePedidos?.(); break
    case 'sucursales': await cargarSucursales(); break
    case 'inventario': await cargarInventario(); break
    case 'pos': await cargarPOS(); break
    case 'historial': await cargarHistorial(); break
    case 'empleados': await cargarEmpleados(); break
    case 'seo': await cargarSEO(); break
    case 'envio': await cargarEnvio(); break
    case 'analisis': await cargarAnalisis(); break
    case 'crm': await cargarCRM(); break;
    case 'finanzas': await cargarFinanzas(); break;
    case 'proveedores': await cargarProveedores(); break;
    case 'ordenes': await cargarOrdenes(); break;
    case 'conversaciones': await cargarConversaciones(); break;
    case 'envios': await cargarEnviosMasivos(); break;
    case 'mercadolibre': await cargarMercadoLibre(); break;
    case 'analytics':    await cargarAnalyticsGA(); break;
    case 'orden-home':     await cargarOrdenHome(); break;
    case 'generar-nombres': await cargarGenerarNombres(); break;
    case 'referidos':    await cargarReferidos(); break;
    case 'carritos-abandonados': await cargarCarritosAbandonados(); break;
  }
}

function renderDashboard() {
  // Sync nav active state after render
  setTimeout(() => {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'))
    const navEl = document.querySelector('[data-modulo="' + moduloActivo + '"]')
    if (navEl) navEl.classList.add('active')
    const titleEl = document.getElementById('topbar-title')
    const mod = modulos.find(m => m.id === moduloActivo)
    if (titleEl && mod) titleEl.textContent = mod.label
    cargarModulo(moduloActivo)
  }, 100)
  return '<div style="padding:2rem;color:#888;text-align:center">Cargando...</div>'
}
async function cargarOrdenes() {
  const content = document.getElementById('content')
  content.innerHTML = '<p style="padding:2rem;color:#888">Cargando sugerencias...</p>'
  try {
    const resSucursales = await fetch(API + '/sucursales/')
    const sucursales = await resSucursales.json()
    const sucursalId = sucursales[0]?.id

    const [resSugerencias, resProveedores] = await Promise.all([
      fetch(API + '/finanzas/sugerencias-recompra/' + sucursalId),
      fetch(API + '/finanzas/proveedores')
    ])
    const sugerencias = await resSugerencias.json()
    const proveedores = await resProveedores.json()

    // Filtrar productos pospuestos (guardados en localStorage)
    const pospuestos = JSON.parse(localStorage.getItem('ordenes_pospuestos') || '{}')
    const hoy = new Date().toISOString().split('T')[0]
    const sugerenciasFiltradas = sugerencias.filter(p => {
      const info = pospuestos[p.producto_id]
      if (!info) return true
      if (info.hasta === null || info.hasta === undefined) return false  // indefinido
      return info.hasta <= hoy  // snooze expirado → vuelve a aparecer
    })
    const nPospuestos = sugerencias.length - sugerenciasFiltradas.length

    window._ordenesData = { sugerencias: sugerenciasFiltradas, proveedores, sucursalId }
    window._ordenSeleccion = {}

    const urgentes = sugerenciasFiltradas.filter(s => s.urgente)
    const normales = sugerenciasFiltradas.filter(s => !s.urgente)
    const totalCosto = sugerenciasFiltradas.reduce((s, p) => s + p.cantidad_sugerida * p.costo_unitario, 0)

    content.innerHTML = `
      <div style="margin-bottom:1.5rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <div>
          <h2 style="font-size:1.2rem;font-weight:700;margin-bottom:4px">🛒 Órdenes de compra</h2>
          <p style="color:#888;font-size:0.85rem">Sugerencias de recompra basadas en rotación e inventario</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <select class="form-input" id="ord-sucursal" style="max-width:200px" onchange="recargarOrdenes(this.value)">
            ${sucursales.map(s => `<option value="${s.id}">${s.nombre}</option>`).join('')}
          </select>
          <button class="btn btn-primary" onclick="generarOrden()">📋 Generar orden</button>
        </div>
      </div>

      <!-- KPIs -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-bottom:1.5rem">
        <div style="background:#ffebee;border-radius:12px;padding:1.25rem;border:1px solid #ffcdd2;text-align:center">
          <p style="font-size:1.6rem;font-weight:700;color:#c62828">${urgentes.length}</p>
          <p style="font-size:0.68rem;color:#c62828;text-transform:uppercase;letter-spacing:0.5px">🚨 Urgentes</p>
        </div>
        <div style="background:#fff8e1;border-radius:12px;padding:1.25rem;border:1px solid #ffe082;text-align:center">
          <p style="font-size:1.6rem;font-weight:700;color:#f57f17">${normales.length}</p>
          <p style="font-size:0.68rem;color:#f57f17;text-transform:uppercase;letter-spacing:0.5px">⚠️ Por resurtir</p>
        </div>
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:1.6rem;font-weight:700;color:#333">${sugerenciasFiltradas.reduce((s,p)=>s+p.cantidad_sugerida,0)}</p>
          <p style="font-size:0.68rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Pares sugeridos</p>
        </div>
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:1.6rem;font-weight:700;color:#E91E8C">$${totalCosto.toFixed(0)}</p>
          <p style="font-size:0.68rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Costo estimado</p>
        </div>
        ${nPospuestos > 0 ? `
        <div style="background:#f3e5f5;border-radius:12px;padding:1.25rem;border:1px solid #ce93d8;text-align:center;cursor:pointer" onclick="verPospuestos()">
          <p style="font-size:1.6rem;font-weight:700;color:#6a1b9a">${nPospuestos}</p>
          <p style="font-size:0.68rem;color:#6a1b9a;text-transform:uppercase;letter-spacing:0.5px">⏸️ Pospuestos</p>
        </div>` : ''}
      </div>

      ${sugerenciasFiltradas.length === 0
        ? `<div style="background:white;border-radius:12px;padding:3rem;text-align:center;border:1px solid #eee">
            <p style="font-size:2rem;margin-bottom:1rem">✅</p>
            <p style="font-weight:700;font-size:1rem;margin-bottom:4px">Todo el inventario está bien</p>
            <p style="color:#888;font-size:0.85rem">No hay productos que necesiten resurtido</p>
          </div>`
        : `
          <!-- SELECCIONAR TODOS -->
          <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
            <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
              <div style="display:flex;align-items:center;gap:12px">
                <input type="checkbox" id="sel-todos" onchange="seleccionarTodos(this.checked)" style="width:18px;height:18px;cursor:pointer;accent-color:#E91E8C">
                <p style="font-weight:700;font-size:0.9rem">Productos a resurtir (${sugerenciasFiltradas.length})</p>
              </div>
              <div style="display:flex;gap:8px">
                <button class="btn btn-secondary" style="font-size:0.78rem" onclick="filtrarOrdenes('todos')">Todos</button>
                <button class="btn btn-secondary" style="font-size:0.78rem;background:#ffebee;border-color:#c62828;color:#c62828" onclick="filtrarOrdenes('urgente')">🚨 Urgentes</button>
              </div>
            </div>

            ${sugerenciasFiltradas.map(p => `
              <div class="orden-item" data-urgente="${p.urgente}" style="padding:1rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
                <input type="checkbox" class="orden-check" data-id="${p.producto_id}" onchange="actualizarSeleccion('${p.producto_id}', this.checked)"
                       style="width:18px;height:18px;cursor:pointer;accent-color:#E91E8C;flex-shrink:0">
                ${p.imagen ? `<img src="${p.imagen}" style="width:52px;height:52px;object-fit:contain;background:#f5f5f5;border-radius:8px;flex-shrink:0">` : `<div style="width:52px;height:52px;background:#f5f5f5;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.5rem">👠</div>`}
                <div style="flex:1;min-width:140px">
                  <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px">
                    <p style="font-weight:700;font-size:0.9rem">${p.nombre}</p>
                    ${p.urgente ? '<span style="background:#ffebee;color:#c62828;padding:2px 8px;border-radius:100px;font-size:0.65rem;font-weight:700">🚨 URGENTE</span>' : '<span style="background:#fff8e1;color:#f57f17;padding:2px 8px;border-radius:100px;font-size:0.65rem;font-weight:700">⚠️ BAJO</span>'}
                  </div>
                  <p style="font-size:0.75rem;color:#888">${p.sku || ''} · Stock: ${p.stock_total} pares · Mín: ${p.stock_minimo}</p>
                  <p style="font-size:0.72rem;color:#888">${p.velocidad_semanal} pares/sem · ${p.dias_inventario ? p.dias_inventario + ' días de stock' : 'Sin ventas recientes'}</p>
                  ${p.proveedor ? `<p style="font-size:0.72rem;color:#6a1b9a;margin-top:2px">🏭 ${p.proveedor.nombre}</p>` : '<p style="font-size:0.72rem;color:#aaa;margin-top:2px">Sin proveedor asignado</p>'}
                  ${p.variantes && p.variantes.length > 0 ? `
                  <div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:4px">
                    ${p.variantes.map(v => {
                      const label = [v.talla, v.color].filter(Boolean).join(' / ')
                      const sinStock = v.sin_stock
                      return `<span style="
                        padding:2px 7px;border-radius:100px;font-size:0.68rem;font-weight:600;
                        ${sinStock
                          ? 'background:#ffebee;color:#c62828;border:1px solid #ef9a9a'
                          : 'background:#f5f5f5;color:#666;border:1px solid #e0e0e0'}
                      " title="${sinStock ? 'Sin stock' : 'Stock: ' + v.stock}">${label}${sinStock ? ' ✗' : ''}</span>`
                    }).join('')}
                  </div>` : ''}
                </div>
                <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
                  <div style="text-align:center">
                    <p style="font-size:0.68rem;color:#888;margin-bottom:2px">Sugerido</p>
                    <input type="number" min="1" value="${p.cantidad_sugerida}"
                           id="qty-orden-${p.producto_id}"
                           style="width:60px;text-align:center;border:1px solid #ddd;border-radius:6px;padding:4px;font-size:0.9rem;font-weight:700"
                           oninput="actualizarCostoOrden()">
                  </div>
                  <div style="text-align:center">
                    <p style="font-size:0.68rem;color:#888;margin-bottom:2px">Costo/par</p>
                    <p style="font-weight:700;color:#333;font-size:0.9rem">$${p.costo_unitario.toFixed(0)}</p>
                  </div>
                  <div style="text-align:center">
                    <p style="font-size:0.68rem;color:#888;margin-bottom:2px">Subtotal</p>
                    <p id="sub-${p.producto_id}" style="font-weight:700;color:#E91E8C;font-size:0.9rem">$${(p.cantidad_sugerida * p.costo_unitario).toFixed(0)}</p>
                  </div>
                  <div style="text-align:center">
                    <p style="font-size:0.68rem;color:#888;margin-bottom:2px">⏸️</p>
                    <button onclick="posponerProducto('${p.producto_id}', '${p.nombre.replace(/'/g, '')}')"
                            title="Posponer — no aparecerá por un tiempo"
                            style="background:none;border:1px solid #e0e0e0;border-radius:6px;padding:4px 8px;cursor:pointer;font-size:0.78rem;color:#999">Posponer</button>
                  </div>
                </div>
              </div>
            `).join('')}

            <div style="padding:1rem 1.5rem;background:#f9f9f9;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
              <span id="ord-seleccionados" style="font-size:0.85rem;color:#888">0 productos seleccionados</span>
              <div style="display:flex;align-items:center;gap:16px">
                <div>
                  <span style="font-size:0.85rem;color:#888">Total estimado: </span>
                  <span id="ord-total" style="font-weight:700;color:#E91E8C;font-size:1.1rem">$0</span>
                </div>
                <button class="btn btn-primary" onclick="generarOrden()">📋 Generar orden de compra</button>
              </div>
            </div>
          </div>
        `}
    `

  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error: ' + e.message + '</p>'
  }
}

window.seleccionarTodos = (checked) => {
  document.querySelectorAll('.orden-check').forEach(cb => {
    cb.checked = checked
    const id = cb.dataset.id
    window._ordenSeleccion[id] = checked
  })
  actualizarCostoOrden()
}

window.actualizarSeleccion = (id, checked) => {
  window._ordenSeleccion[id] = checked
  actualizarCostoOrden()
}

window.actualizarCostoOrden = () => {
  const { sugerencias } = window._ordenesData
  let total = 0
  let count = 0
  sugerencias.forEach(p => {
    if (window._ordenSeleccion[p.producto_id]) {
      const qty = parseInt(document.getElementById('qty-orden-' + p.producto_id)?.value || p.cantidad_sugerida)
      const sub = qty * p.costo_unitario
      total += sub
      count++
      const subEl = document.getElementById('sub-' + p.producto_id)
      if (subEl) subEl.textContent = '$' + sub.toFixed(0)
    }
  })
  const totalEl = document.getElementById('ord-total')
  const countEl = document.getElementById('ord-seleccionados')
  if (totalEl) totalEl.textContent = '$' + total.toFixed(0)
  if (countEl) countEl.textContent = count + ' productos seleccionados'
}

window.filtrarOrdenes = (tipo) => {
  document.querySelectorAll('.orden-item').forEach(el => {
    el.style.display = tipo === 'todos' || (tipo === 'urgente' && el.dataset.urgente === 'true') ? '' : 'none'
  })
}

window.recargarOrdenes = async (sucursalId) => {
  const resSugerencias = await fetch(API + '/finanzas/sugerencias-recompra/' + sucursalId)
  window._ordenesData.sugerencias = await resSugerencias.json()
  window._ordenesData.sucursalId = sucursalId
  cargarOrdenes()
}

window.generarOrden = () => {
  const { sugerencias, proveedores, sucursalId } = window._ordenesData
  const seleccionados = sugerencias.filter(p => window._ordenSeleccion[p.producto_id])

  if (seleccionados.length === 0) {
    alert('Selecciona al menos un producto para generar la orden')
    return
  }

  // Guardar referencia para imprimir/guardar
  window._ordenModal = { seleccionados, sucursalId }

  const modal = document.createElement('div')
  modal.id = 'modal-orden'
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem;overflow-y:auto'

  modal.innerHTML = `
    <div style="background:white;border-radius:16px;padding:2rem;max-width:780px;width:100%;max-height:90vh;overflow-y:auto">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
        <h3 style="font-size:1.1rem;font-weight:700">📋 Orden de compra</h3>
        <button onclick="document.getElementById('modal-orden').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:#888">✕</button>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label">Sucursal destino</label>
          <select class="form-input" id="orden-sucursal">
            <option value="${sucursalId}">Sucursal actual</option>
          </select>
        </div>
        <div>
          <label class="form-label">Fecha de entrega estimada</label>
          <input class="form-input" type="date" id="orden-fecha" value="${new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0]}">
        </div>
      </div>

      <div style="margin-bottom:1.25rem">
        <label class="form-label">Notas</label>
        <textarea class="form-input" id="orden-notas" rows="2" placeholder="Condiciones de entrega, forma de pago..."></textarea>
      </div>

      ${seleccionados.map(p => {
        const varsSinStock = (p.variantes || []).filter(v => v.sin_stock)
        const varsConStock = (p.variantes || []).filter(v => !v.sin_stock)
        const allVars = [...varsSinStock, ...varsConStock]
        return `
        <div style="background:#f9f9f9;border-radius:10px;padding:1rem;margin-bottom:1rem;border:1px solid #eee">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <div>
              <span style="font-weight:700;font-size:0.95rem">${p.nombre}</span>
              <span style="color:#888;font-size:0.75rem;margin-left:8px">${p.sku || ''}</span>
              ${p.proveedor ? `<span style="color:#6a1b9a;font-size:0.75rem;margin-left:8px">· 🏭 ${p.proveedor.nombre}</span>` : ''}
            </div>
            <span style="font-size:0.8rem;color:#888;font-weight:600">$${p.costo_unitario.toFixed(0)}/par</span>
          </div>
          ${allVars.length > 0 ? `
          <table style="width:100%;font-size:0.8rem;border-collapse:collapse">
            <thead>
              <tr style="background:#eeeeee">
                <th style="padding:5px 8px;text-align:left;font-weight:600;border-radius:4px 0 0 4px">Incluir</th>
                <th style="padding:5px 8px;text-align:left;font-weight:600">Talla</th>
                <th style="padding:5px 8px;text-align:left;font-weight:600">Color</th>
                <th style="padding:5px 8px;text-align:center;font-weight:600">Stock actual</th>
                <th style="padding:5px 8px;text-align:center;font-weight:600;border-radius:0 4px 4px 0">Pedir (pares)</th>
              </tr>
            </thead>
            <tbody>
              ${allVars.map(v => `
              <tr style="border-bottom:1px solid #f0f0f0;${v.sin_stock ? 'background:#fff8f8' : ''}">
                <td style="padding:5px 8px">
                  <input type="checkbox" id="chk-var-${v.id}" ${v.sin_stock ? 'checked' : ''}
                         onchange="ordenToggleVar('${v.id}', this.checked)"
                         style="accent-color:#E91E8C;cursor:pointer;width:15px;height:15px">
                </td>
                <td style="padding:5px 8px;font-weight:${v.sin_stock ? '700' : '400'}">${v.talla || '-'}</td>
                <td style="padding:5px 8px;color:${v.sin_stock ? '#c62828' : '#555'}">${v.color || '-'}</td>
                <td style="text-align:center;padding:5px 8px">
                  <span style="background:${v.sin_stock ? '#ffebee' : '#e8f5e9'};color:${v.sin_stock ? '#c62828' : '#2e7d32'};padding:2px 8px;border-radius:100px;font-size:0.72rem;font-weight:600">${v.stock}</span>
                </td>
                <td style="text-align:center;padding:5px 8px">
                  <input type="number" id="qty-var-${v.id}" min="0" value="${v.sin_stock ? 1 : 0}"
                         ${v.sin_stock ? '' : 'disabled'}
                         onchange="ordenRecalcTotal()"
                         style="width:55px;text-align:center;border:1px solid ${v.sin_stock ? '#E91E8C' : '#ddd'};border-radius:6px;padding:3px 5px;font-size:0.85rem;${v.sin_stock ? '' : 'opacity:0.35'}">
                </td>
              </tr>`).join('')}
            </tbody>
          </table>` : `<p style="font-size:0.8rem;color:#aaa;margin-top:4px">Sin variantes registradas — pedir ${p.cantidad_sugerida} pares en total</p>`}
        </div>`
      }).join('')}

      <div style="background:#e8f5e9;border-radius:8px;padding:1rem;display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
        <span style="font-weight:700">Total general</span>
        <span id="orden-total-general" style="font-weight:700;font-size:1.2rem;color:#2e7d32">$0</span>
      </div>

      <div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap">
        <button class="btn btn-secondary" onclick="document.getElementById('modal-orden').remove()">Cancelar</button>
        <button class="btn btn-secondary" onclick="imprimirOrden()" style="background:#e3f2fd;border-color:#1565c0;color:#1565c0">🖨️ Imprimir</button>
        <button class="btn btn-primary" onclick="guardarOrdenCompra2()">💾 Guardar orden</button>
      </div>
    </div>
  `
  document.body.appendChild(modal)
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove() })
  // Calcular total inicial
  setTimeout(ordenRecalcTotal, 50)
}

window.guardarOrdenCompra = async (proveedoresStr) => {
  const fecha = document.getElementById('orden-fecha')?.value
  const notas = document.getElementById('orden-notas')?.value || ''
  const sucursalId = window._ordenesData.sucursalId

  try {
    const porProveedor = typeof proveedoresStr === 'string' ? JSON.parse(proveedoresStr) : proveedoresStr
    for (const [provId, prov] of porProveedor) {
      const total = prov.productos.reduce((s, p) => s + p.cantidad_final * p.costo_unitario, 0)
      const res = await fetch(API + '/finanzas/ordenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proveedor_id: provId === 'sin-proveedor' ? null : provId,
          sucursal_id: sucursalId,
          status: 'borrador',
          total,
          notas,
          fecha_entrega_estimada: fecha || null
        })
      })
      const orden = await res.json()
      const ordenId = orden[0]?.id
      if (!ordenId) continue

      for (const p of prov.productos) {
        await fetch(API + '/finanzas/ordenes/' + ordenId + '/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            variante_id: null,
            cantidad: p.cantidad_final,
            costo_unitario: p.costo_unitario,
            subtotal: p.cantidad_final * p.costo_unitario
          })
        })
      }
    }
    document.querySelector('div[style*="position:fixed"]').remove()
    alert('Orden de compra guardada exitosamente')
    cargarOrdenes()
  } catch(e) {
    alert('Error guardando orden: ' + e.message)
  }
}

window.ordenToggleVar = (varId, checked) => {
  const qty = document.getElementById('qty-var-' + varId)
  if (!qty) return
  qty.disabled = !checked
  qty.style.opacity = checked ? '1' : '0.35'
  qty.style.borderColor = checked ? '#E91E8C' : '#ddd'
  if (checked && (!qty.value || qty.value === '0')) qty.value = 1
  else if (!checked) qty.value = 0
  ordenRecalcTotal()
}

window.ordenRecalcTotal = () => {
  const { seleccionados } = window._ordenModal || {}
  if (!seleccionados) return
  let total = 0
  seleccionados.forEach(p => {
    (p.variantes || []).forEach(v => {
      const chk = document.getElementById('chk-var-' + v.id)
      const qty = parseInt(document.getElementById('qty-var-' + v.id)?.value || 0)
      if (chk?.checked && qty > 0) total += qty * p.costo_unitario
    })
    // Si no tiene variantes, usar cantidad sugerida
    if (!p.variantes || p.variantes.length === 0) {
      const qty = parseInt(document.getElementById('qty-orden-' + p.producto_id)?.value || p.cantidad_sugerida)
      total += qty * p.costo_unitario
    }
  })
  const el = document.getElementById('orden-total-general')
  if (el) el.textContent = '$' + total.toFixed(0)
}

window.imprimirOrden = () => {
  const { seleccionados } = window._ordenModal || {}
  if (!seleccionados) return
  const fecha = document.getElementById('orden-fecha')?.value || ''
  const notas = document.getElementById('orden-notas')?.value || ''
  const hoy = new Date().toLocaleDateString('es-MX')

  let rows = ''
  let total = 0
  seleccionados.forEach(p => {
    const vars = p.variantes || []
    if (vars.length === 0) {
      const qty = parseInt(document.getElementById('qty-orden-' + p.producto_id)?.value || p.cantidad_sugerida)
      const sub = qty * p.costo_unitario
      total += sub
      rows += `<tr><td>${p.nombre}</td><td>${p.sku||''}</td><td>—</td><td>—</td><td style="text-align:center">${qty}</td><td style="text-align:right">$${sub.toFixed(0)}</td></tr>`
    } else {
      vars.forEach(v => {
        const chk = document.getElementById('chk-var-' + v.id)
        if (!chk?.checked) return
        const qty = parseInt(document.getElementById('qty-var-' + v.id)?.value || 0)
        if (qty <= 0) return
        const sub = qty * p.costo_unitario
        total += sub
        rows += `<tr style="${v.sin_stock ? 'background:#fff5f5' : ''}">
          <td style="font-weight:${v.sin_stock?'bold':'normal'}">${p.nombre}</td>
          <td style="color:#777">${p.sku||''}</td>
          <td>${v.talla||'—'}</td>
          <td>${v.color||'—'}</td>
          <td style="text-align:center;font-weight:bold">${qty}</td>
          <td style="text-align:right">$${sub.toFixed(0)}</td>
        </tr>`
      })
    }
  })

  const win = window.open('', '_blank')
  win.document.write(`<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Orden de compra</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 12px; padding: 24px; color: #222; }
  h1 { font-size: 18px; margin-bottom: 4px; }
  .meta { color: #666; font-size: 11px; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; }
  th { background: #f0f0f0; padding: 7px 10px; text-align: left; font-weight: 700; border-bottom: 2px solid #ddd; }
  td { padding: 6px 10px; border-bottom: 1px solid #eee; vertical-align: middle; }
  .total-row td { border-top: 2px solid #333; font-weight: bold; font-size: 13px; padding-top: 10px; }
  @media print {
    body { padding: 10px; }
    button { display: none; }
  }
</style>
</head><body>
  <h1>📋 Orden de compra</h1>
  <div class="meta">
    Fecha de emisión: ${hoy}
    ${fecha ? ' &nbsp;|&nbsp; Entrega estimada: ' + fecha : ''}
    ${notas ? ' &nbsp;|&nbsp; Notas: ' + notas : ''}
  </div>
  <table>
    <thead>
      <tr>
        <th>Modelo</th><th>SKU</th><th>Talla</th><th>Color</th>
        <th style="text-align:center">Pares</th><th style="text-align:right">Subtotal</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
    <tfoot>
      <tr class="total-row">
        <td colspan="4">TOTAL GENERAL</td>
        <td></td>
        <td style="text-align:right">$${total.toFixed(0)}</td>
      </tr>
    </tfoot>
  </table>
  <script>window.onload = () => window.print()</script>
</body></html>`)
  win.document.close()
}

window.posponerProducto = (productoId, nombre) => {
  const existente = document.getElementById('modal-posponer')
  if (existente) existente.remove()
  const m = document.createElement('div')
  m.id = 'modal-posponer'
  m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:1100;display:flex;align-items:center;justify-content:center'
  m.innerHTML = `
    <div style="background:white;border-radius:14px;padding:1.5rem;max-width:320px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,0.15)">
      <p style="font-weight:700;font-size:1rem;margin-bottom:4px">⏸️ Posponer producto</p>
      <p style="font-size:0.82rem;color:#888;margin-bottom:1.25rem">${nombre}</p>
      <div style="display:flex;flex-direction:column;gap:8px">
        <button class="btn btn-secondary" onclick="aplicarPosponer('${productoId}', 7)" style="text-align:left">📅 7 días — revisaré la próxima semana</button>
        <button class="btn btn-secondary" onclick="aplicarPosponer('${productoId}', 30)" style="text-align:left">📅 30 días — esperar el mes que entra</button>
        <button class="btn btn-secondary" onclick="aplicarPosponer('${productoId}', null)" style="text-align:left;color:#c62828;border-color:#ef9a9a">🚫 No pedir por ahora (indefinido)</button>
      </div>
      <button onclick="document.getElementById('modal-posponer').remove()" style="margin-top:1rem;width:100%;background:none;border:none;color:#aaa;cursor:pointer;font-size:0.82rem">Cancelar</button>
    </div>`
  m.addEventListener('click', e => { if (e.target === m) m.remove() })
  document.body.appendChild(m)
}

window.aplicarPosponer = (productoId, dias) => {
  const pospuestos = JSON.parse(localStorage.getItem('ordenes_pospuestos') || '{}')
  let hasta = null
  if (dias !== null) {
    const fecha = new Date()
    fecha.setDate(fecha.getDate() + dias)
    hasta = fecha.toISOString().split('T')[0]
  }
  pospuestos[productoId] = { hasta }
  localStorage.setItem('ordenes_pospuestos', JSON.stringify(pospuestos))
  document.getElementById('modal-posponer')?.remove()
  cargarOrdenes()
}

window.verPospuestos = () => {
  const pospuestos = JSON.parse(localStorage.getItem('ordenes_pospuestos') || '{}')
  const { sugerencias } = window._ordenesData
  const hoy = new Date().toISOString().split('T')[0]
  // Todos los originales que están pospuestos
  const lista = Object.entries(pospuestos).map(([id, info]) => {
    const nombre = info.nombre || id
    const hasta = info.hasta ? 'hasta ' + info.hasta : 'indefinido'
    return `• ${nombre} — ${hasta}`
  }).join('\n')
  if (!lista) { alert('No hay productos pospuestos.'); return }
  const confirmar = confirm('Productos pospuestos:\n\n' + lista + '\n\n¿Quieres reactivar todos?')
  if (confirmar) {
    localStorage.removeItem('ordenes_pospuestos')
    cargarOrdenes()
  }
}

window.guardarOrdenCompra2 = async () => {
  const { seleccionados, sucursalId } = window._ordenModal || {}
  if (!seleccionados) return
  const fecha = document.getElementById('orden-fecha')?.value
  const notas = document.getElementById('orden-notas')?.value || ''

  // Agrupar por proveedor
  const porProveedor = {}
  seleccionados.forEach(p => {
    const provId = p.proveedor_id || 'sin-proveedor'
    const provNombre = p.proveedor?.nombre || 'Sin proveedor'
    if (!porProveedor[provId]) porProveedor[provId] = { nombre: provNombre, items: [] }
    const vars = p.variantes || []
    if (vars.length === 0) {
      const qty = parseInt(document.getElementById('qty-orden-' + p.producto_id)?.value || p.cantidad_sugerida)
      porProveedor[provId].items.push({ variante_id: null, cantidad: qty, costo_unitario: p.costo_unitario })
    } else {
      vars.forEach(v => {
        const chk = document.getElementById('chk-var-' + v.id)
        if (!chk?.checked) return
        const qty = parseInt(document.getElementById('qty-var-' + v.id)?.value || 0)
        if (qty <= 0) return
        porProveedor[provId].items.push({ variante_id: v.id, cantidad: qty, costo_unitario: p.costo_unitario })
      })
    }
  })

  try {
    for (const [provId, prov] of Object.entries(porProveedor)) {
      if (prov.items.length === 0) continue
      const total = prov.items.reduce((s, i) => s + i.cantidad * i.costo_unitario, 0)
      const res = await fetch(API + '/finanzas/ordenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proveedor_id: provId === 'sin-proveedor' ? null : provId,
          sucursal_id: sucursalId,
          status: 'borrador',
          total,
          notas,
          fecha_entrega_estimada: fecha || null
        })
      })
      const orden = await res.json()
      const ordenId = orden[0]?.id
      if (!ordenId) continue
      for (const item of prov.items) {
        await fetch(API + '/finanzas/ordenes/' + ordenId + '/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...item, subtotal: item.cantidad * item.costo_unitario })
        })
      }
    }
    document.getElementById('modal-orden')?.remove()
    alert('Orden de compra guardada')
    cargarOrdenes()
  } catch(e) {
    alert('Error guardando orden: ' + e.message)
  }
}


function renderDashboardHTML() {
  const hoy = new Date().toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'long'})
  const nombre = (window._empleadoActual?.nombre || 'May').split(' ')[0]
  return `
    <div id="dashboard-contenido">

      <!-- ROW 1: Banner + 2 KPI cards -->
      <div class="dash-row-1" style="display:grid;grid-template-columns:2fr 1fr;gap:16px;margin-bottom:16px;align-items:stretch">

        <div class="dash-banner">
          <div style="position:relative;z-index:1">
            <p style="font-size:0.63rem;font-weight:700;letter-spacing:0.14em;color:var(--pink);text-transform:uppercase;margin:0 0 8px">Panel de control</p>
            <h2 style="font-size:1.55rem;font-weight:800;color:#fff;line-height:1.15;margin:0 0 6px;letter-spacing:-0.01em">¡Bienvenida, ${nombre}! 👋</h2>
            <p style="font-size:0.76rem;color:rgba(255,255,255,0.35);margin:0 0 18px;text-transform:capitalize">${hoy}</p>
            <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:4px">
              <span style="font-size:1.9rem;font-weight:900;color:#fff;font-family:'DM Mono',monospace;letter-spacing:-0.03em" id="kpi-ventas-hoy">—</span>
              <span style="font-size:0.73rem;color:rgba(255,255,255,0.45)">ventas hoy</span>
            </div>
            <p style="font-size:0.73rem;color:var(--pink);margin:0 0 20px" id="kpi-ventas-hoy-sub"></p>
            <button onclick="navegarA('pedidos')" style="background:var(--pink);border:none;color:white;padding:8px 18px;border-radius:8px;font-family:inherit;font-size:0.78rem;font-weight:700;cursor:pointer">Ver pedidos →</button>
          </div>
          <div style="position:relative;z-index:1;flex-shrink:0">
            <div style="width:96px;height:96px;background:rgba(200,150,122,0.12);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2.8rem;border:1px solid rgba(200,150,122,0.20)">👠</div>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:14px">
          <div class="dash-kpi-v" style="flex:1">
            <div class="dash-kpi-icon" style="background:var(--pink-soft)">🛍️</div>
            <p class="dash-kpi-lbl">Pedidos hoy</p>
            <p class="dash-kpi-val" id="kpi-pedidos-hoy">—</p>
            <p class="dash-kpi-sub" id="kpi-pedidos-hoy-sub"></p>
          </div>
          <div class="dash-kpi-v" style="flex:1;cursor:pointer" onclick="navegarA('inventario')">
            <div class="dash-kpi-icon" style="background:var(--amber-soft)">📦</div>
            <p class="dash-kpi-lbl">Stock bajo</p>
            <p class="dash-kpi-val" id="kpi-stock-bajo">—</p>
            <p class="dash-kpi-sub" id="kpi-stock-bajo-sub"></p>
          </div>
        </div>

      </div>

      <!-- ROW 2: Gráfica ingresos + 4 mini KPIs -->
      <div class="dash-row-2" style="display:grid;grid-template-columns:2fr 1fr;gap:16px;margin-bottom:16px;align-items:start">

        <div class="dash-card" style="padding:20px 22px">
          <div class="dash-card-header">
            <div>
              <p class="dash-card-title">Ingresos — últimos 7 días</p>
              <p class="dash-card-sub">Tendencia de ventas recientes</p>
            </div>
            <button onclick="cargarDashboard()" class="dash-refresh-btn" title="Actualizar">↻</button>
          </div>
          <div style="height:190px;position:relative;margin-top:12px"><canvas id="chart-tendencia"></canvas></div>
        </div>

        <div class="dash-kpi-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:11px">
          <div class="dash-kpi-mini">
            <p class="dash-kpi-mini-lbl">Ventas 7 días</p>
            <p class="dash-kpi-mini-val" id="kpi-ventas-7d">—</p>
            <p class="dash-kpi-mini-sub" id="kpi-ventas-7d-sub"></p>
          </div>
          <div class="dash-kpi-mini">
            <p class="dash-kpi-mini-lbl">Ventas 30 días</p>
            <p class="dash-kpi-mini-val" id="kpi-ventas-30d">—</p>
            <p class="dash-kpi-mini-sub" id="kpi-ventas-30d-sub"></p>
          </div>
          <div class="dash-kpi-mini">
            <p class="dash-kpi-mini-lbl">Clientes nuevos</p>
            <p class="dash-kpi-mini-val" id="kpi-clientes-nuevos">—</p>
            <p class="dash-kpi-mini-sub" id="kpi-clientes-nuevos-sub"></p>
          </div>
          <div class="dash-kpi-mini">
            <p class="dash-kpi-mini-lbl">Mejor día</p>
            <p class="dash-kpi-mini-val" id="kpi-mejor-dia">—</p>
            <p class="dash-kpi-mini-sub" id="kpi-mejor-dia-sub"></p>
          </div>
        </div>

      </div>

      <!-- ROW 3: Canales + Tabs + Últimos pedidos -->
      <div class="dash-row-3" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:16px;align-items:start">

        <div class="dash-card" style="padding:20px 22px">
          <div class="dash-card-header" style="margin-bottom:16px">
            <div>
              <p class="dash-card-title">Canales de venta</p>
              <p class="dash-card-sub">Distribución acumulada</p>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:14px">
            <div style="height:110px;width:110px;flex-shrink:0;position:relative"><canvas id="chart-canales"></canvas></div>
            <div id="dash-canales-lista" style="flex:1;min-width:0"></div>
          </div>
        </div>

        <div class="dash-card" style="padding:20px 22px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
            <p class="dash-card-title">Estadísticas</p>
            <div style="display:flex;gap:4px">
              <button class="dash-tab-btn active" onclick="dashSwitchTab('dias',this)">Días</button>
              <button class="dash-tab-btn" onclick="dashSwitchTab('meses',this)">Meses</button>
              <button class="dash-tab-btn" onclick="dashSwitchTab('pagos',this)">Pagos</button>
            </div>
          </div>
          <div id="dash-tab-dias" style="height:160px;position:relative"><canvas id="chart-dias"></canvas></div>
          <div id="dash-tab-meses" style="height:160px;position:relative;display:none"><canvas id="chart-meses"></canvas></div>
          <div id="dash-tab-pagos" style="height:160px;position:relative;display:none"><canvas id="chart-pagos"></canvas></div>
        </div>

        <div class="dash-card" style="padding:20px 22px">
          <div class="dash-card-header" style="margin-bottom:14px">
            <p class="dash-card-title">Últimos pedidos</p>
            <button onclick="navegarA('pedidos')" style="font-size:0.72rem;color:var(--pink);background:none;border:none;cursor:pointer;font-family:inherit;font-weight:600;padding:0;white-space:nowrap">Ver todos →</button>
          </div>
          <div id="dash-ultimos-pedidos"><div style="color:var(--text-3);font-size:0.85rem">Cargando...</div></div>
        </div>

      </div>

      <!-- ROW 4: Top clientes + Total clientes KPI -->
      <div class="dash-row-4" style="display:grid;grid-template-columns:3fr 1fr;gap:16px;margin-bottom:16px;align-items:start">
        <div class="dash-card" style="padding:20px 22px">
          <div class="dash-card-header" style="margin-bottom:14px">
            <p class="dash-card-title">Top clientes — 30 días</p>
          </div>
          <div id="dash-top-clientes"><div style="color:var(--text-3);font-size:0.85rem">Cargando...</div></div>
        </div>
        <div class="dash-kpi-v">
          <div class="dash-kpi-icon" style="background:var(--cyan-soft)">👥</div>
          <p class="dash-kpi-lbl">Total clientes</p>
          <p class="dash-kpi-val" id="kpi-total-clientes">—</p>
          <p class="dash-kpi-sub" id="kpi-total-clientes-sub"></p>
        </div>
      </div>

    </div>
  `
}
async function cargarFinanzas() {
  const content = document.getElementById('content')
  content.innerHTML = '<p style="padding:2rem;color:#888">Cargando finanzas...</p>'
  try {
    const resSucursales = await fetch(API + '/sucursales/')
    const sucursales = await resSucursales.json()
    const sucursalId = sucursales[0]?.id

    const [resCaja, resReporte, resGastos, resEstado, resFlujo, resCxC, resCategorias] = await Promise.all([
      fetch(API + '/finanzas/caja/hoy/' + sucursalId),
      fetch(API + '/finanzas/reporte/' + sucursalId),
      fetch(API + '/finanzas/gastos/' + sucursalId),
      fetch(API + '/finanzas/estado-resultados/' + sucursalId),
      fetch(API + '/finanzas/flujo/' + sucursalId),
      fetch(API + '/finanzas/cuentas-por-cobrar'),
      fetch(API + '/finanzas/gastos-categorias/' + sucursalId)
    ])

    const cajas = await resCaja.json()
    const reporte = await resReporte.json()
    const gastos = await resGastos.json()
    const estadoResultados = await resEstado.json()
    const flujo = await resFlujo.json()
    const cxc = await resCxC.json()
    const categorias = await resCategorias.json()

    const cajaActiva = cajas.find(c => c.status === 'abierta')
    const hoy = new Date().toISOString().split('T')[0]
    const gastosHoy = gastos.filter(g => g.created_at?.startsWith(hoy))
    const totalGastosHoy = gastosHoy.reduce((s, g) => s + parseFloat(g.monto || 0), 0)
    const totalCxC = cxc.reduce((s, p) => s + parseFloat(p.total || 0), 0)

    content.innerHTML = `
      <div style="margin-bottom:1.5rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <div>
          <h2 style="font-size:1.2rem;font-weight:700;margin-bottom:4px">💰 Finanzas</h2>
          <p style="color:#888;font-size:0.85rem">Control de caja, gastos y reportes financieros</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <select class="form-input" id="fin-sucursal" style="max-width:200px" onchange="recargarFinanzas(this.value)">
            ${sucursales.map(s => `<option value="${s.id}">${s.nombre}</option>`).join('')}
          </select>
          ${!cajaActiva
            ? `<button class="btn btn-primary" onclick="abrirCaja('${sucursalId}')">🔓 Abrir caja</button>`
            : `<button class="btn btn-secondary" style="color:#c62828;border-color:#c62828" onclick="cerrarCaja('${cajaActiva.id}')">🔒 Cerrar caja</button>`}
        </div>
      </div>

      <!-- ESTADO CAJA -->
      <div style="background:${cajaActiva ? '#e8f5e9' : '#ffebee'};border-radius:12px;padding:1.25rem;border:1px solid ${cajaActiva ? '#a5d6a7' : '#ffcdd2'};margin-bottom:1.5rem;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
        <span style="font-size:2rem">${cajaActiva ? '🟢' : '🔴'}</span>
        <div style="flex:1">
          <p style="font-weight:700;font-size:1rem;color:${cajaActiva ? '#2e7d32' : '#c62828'}">Caja ${cajaActiva ? 'ABIERTA' : 'CERRADA'}</p>
          <p style="font-size:0.82rem;color:#888">${cajaActiva ? `Abierta a las ${new Date(cajaActiva.hora_apertura).toLocaleTimeString('es-MX')} · Fondo: $${cajaActiva.monto_apertura}` : 'No hay caja abierta hoy'}</p>
        </div>
        ${cajaActiva ? `
          <div style="display:flex;gap:16px;flex-wrap:wrap">
            <div style="text-align:center">
              <p style="font-size:1.2rem;font-weight:700;color:#2e7d32">$${(flujo.hoy?.efectivo||0).toFixed(0)}</p>
              <p style="font-size:0.65rem;color:#888">Efectivo</p>
            </div>
            <div style="text-align:center">
              <p style="font-size:1.2rem;font-weight:700;color:#1565c0">$${(flujo.hoy?.tarjeta||0).toFixed(0)}</p>
              <p style="font-size:0.65rem;color:#888">Tarjeta</p>
            </div>
            <div style="text-align:center">
              <p style="font-size:1.2rem;font-weight:700;color:#6a1b9a">$${(flujo.hoy?.spei||0).toFixed(0)}</p>
              <p style="font-size:0.65rem;color:#888">SPEI</p>
            </div>
            <div style="text-align:center">
              <p style="font-size:1.2rem;font-weight:700;color:#E91E8C">$${(flujo.hoy?.total||0).toFixed(0)}</p>
              <p style="font-size:0.65rem;color:#888">Total hoy</p>
            </div>
          </div>
        ` : ''}
      </div>

      <!-- KPIs -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-bottom:1.5rem">
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:1.5rem;font-weight:700;color:#E91E8C">$${(reporte.total_ventas||0).toLocaleString('es-MX',{maximumFractionDigits:0})}</p>
          <p style="font-size:0.68rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Ventas 30 días</p>
        </div>
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:1.5rem;font-weight:700;color:#b5651d">$${(reporte.cmv||0).toLocaleString('es-MX',{maximumFractionDigits:0})}</p>
          <p style="font-size:0.68rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Costo mercancía</p>
        </div>
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:1.5rem;font-weight:700;color:#c62828">$${(reporte.total_gastos||0).toLocaleString('es-MX',{maximumFractionDigits:0})}</p>
          <p style="font-size:0.68rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Gastos operativos</p>
        </div>
        <div style="background:${(reporte.utilidad_bruta||0) >= 0 ? '#e3f2fd' : '#ffebee'};border-radius:12px;padding:1.25rem;border:1px solid ${(reporte.utilidad_bruta||0) >= 0 ? '#90caf9' : '#ffcdd2'};text-align:center">
          <p style="font-size:1.5rem;font-weight:700;color:#1565c0">$${(reporte.utilidad_bruta||0).toLocaleString('es-MX',{maximumFractionDigits:0})}</p>
          <p style="font-size:0.68rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Utilidad bruta</p>
          <p style="font-size:0.6rem;color:#aaa;margin-top:2px">ventas − costo</p>
        </div>
        <div style="background:${(reporte.utilidad||0) >= 0 ? '#e8f5e9' : '#ffebee'};border-radius:12px;padding:1.25rem;border:1px solid ${(reporte.utilidad||0) >= 0 ? '#a5d6a7' : '#ffcdd2'};text-align:center">
          <p style="font-size:1.5rem;font-weight:700;color:${(reporte.utilidad||0) >= 0 ? '#2e7d32' : '#c62828'}">$${(reporte.utilidad||0).toLocaleString('es-MX',{maximumFractionDigits:0})}</p>
          <p style="font-size:0.68rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Utilidad neta</p>
          <p style="font-size:0.6rem;color:#aaa;margin-top:2px">ventas − costo − gastos</p>
        </div>
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:1.5rem;font-weight:700;color:#333">$${(flujo.semana?.ingresos||0).toFixed(0)}</p>
          <p style="font-size:0.68rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Ingresos 7 días</p>
        </div>
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:1.5rem;font-weight:700;color:#333">$${(reporte.ticket_promedio||0).toFixed(0)}</p>
          <p style="font-size:0.68rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Ticket promedio</p>
        </div>
        <div style="background:#fff8e1;border-radius:12px;padding:1.25rem;border:1px solid #ffe082;text-align:center;cursor:pointer" onclick="mostrarCxC()">
          <p style="font-size:1.5rem;font-weight:700;color:#f57f17">$${totalCxC.toFixed(0)}</p>
          <p style="font-size:0.68rem;color:#f57f17;text-transform:uppercase;letter-spacing:0.5px">Cuentas x cobrar</p>
        </div>
      </div>

      <!-- TABS -->
      <div style="display:flex;gap:8px;margin-bottom:1rem;flex-wrap:wrap">
        <button class="btn btn-primary" style="font-size:0.82rem" onclick="mostrarTabFinanzas('gastos')">💸 Gastos</button>
        <button class="btn btn-secondary" style="font-size:0.82rem" onclick="mostrarTabFinanzas('cmv')">📦 Costo mercancía</button>
        <button class="btn btn-secondary" style="font-size:0.82rem" onclick="mostrarTabFinanzas('estado')">📊 Estado de resultados</button>
        <button class="btn btn-secondary" style="font-size:0.82rem" onclick="mostrarTabFinanzas('flujo')">💧 Flujo de efectivo</button>
        <button class="btn btn-secondary" style="font-size:0.82rem" onclick="mostrarTabFinanzas('caja')">📋 Historial caja</button>
        <button class="btn btn-secondary" style="font-size:0.82rem" onclick="mostrarTabFinanzas('cxc')">📑 Cuentas x cobrar</button>
      </div>

      <div id="fin-tab-contenido"></div>
    `

    window._finanzasData = { sucursalId, gastosHoy, totalGastosHoy, estadoResultados, flujo, cxc, categorias, historial: [], reporte }
    window._finanzasSucursalId = sucursalId

    // Cargar historial
    const resHist = await fetch(API + '/finanzas/caja/historial/' + sucursalId)
    const historial = await resHist.json()
    window._finanzasData.historial = historial

    mostrarTabFinanzas('gastos')

  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error cargando finanzas: ' + e.message + '</p>'
  }
}

window.mostrarTabFinanzas = (tab) => {
  const { gastosHoy, totalGastosHoy, estadoResultados, flujo, cxc, categorias, historial, sucursalId } = window._finanzasData
  const container = document.getElementById('fin-tab-contenido')
  if (!container) return

  if (tab === 'cmv') {
    const desglose       = window._finanzasData.reporte?.desglose_cmv || []
    const rep            = window._finanzasData.reporte || {}
    const totalCmv       = desglose.reduce((s, r) => s + r.subtotal_costo, 0)
    const totalVtas      = desglose.reduce((s, r) => s + r.subtotal_venta, 0)
    const margen         = totalVtas > 0 ? ((totalVtas - totalCmv) / totalVtas * 100) : 0
    const sinDesglose    = rep.num_pedidos_sin_desglose || 0
    const totalSinDesc   = rep.total_sin_desglose || 0
    container.innerHTML = `
      <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
        <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
          <p style="font-weight:700;font-size:0.9rem">📦 Desglose de costo de mercancía — 30 días</p>
          <div style="display:flex;gap:16px;font-size:0.82rem">
            <span>Total vendido: <strong style="color:#E91E8C">$${totalVtas.toLocaleString('es-MX',{maximumFractionDigits:0})}</strong></span>
            <span>Costo total: <strong style="color:#b5651d">$${totalCmv.toLocaleString('es-MX',{maximumFractionDigits:0})}</strong></span>
            <span>Margen bruto: <strong style="color:${margen>=0?'#2e7d32':'#c62828'}">${margen.toFixed(1)}%</strong></span>
          </div>
        </div>
        ${sinDesglose > 0 ? `
        <div style="background:#fff8e1;border-bottom:1px solid #ffe082;padding:12px 20px;font-size:0.83rem;color:#6d4c00;display:flex;align-items:center;gap:10px">
          <span style="font-size:1.1rem">⚠️</span>
          <span><strong>${sinDesglose} pedido${sinDesglose>1?'s':''} ($${totalSinDesc.toLocaleString('es-MX',{maximumFractionDigits:0})} MXN)</strong> no tienen productos desglosados — por eso "Ventas 30 días" es mayor que "Venta total" aquí. Son ventas registradas sin items individuales (POS antiguo o pedidos manuales sin productos).</span>
        </div>` : ''}
        ${desglose.length === 0
          ? '<p style="padding:2rem;text-align:center;color:#888">Sin ventas con costo registrado en los últimos 30 días</p>'
          : `<div style="overflow-x:auto">
            <table style="width:100%;border-collapse:collapse;font-size:0.83rem">
              <thead>
                <tr style="background:#fafafa;border-bottom:2px solid #eee">
                  <th style="padding:10px 14px;text-align:left;font-weight:600;color:#555">Producto</th>
                  <th style="padding:10px 14px;text-align:left;font-weight:600;color:#555">Color / Talla</th>
                  <th style="padding:10px 8px;text-align:center;font-weight:600;color:#555">Pares</th>
                  <th style="padding:10px 8px;text-align:right;font-weight:600;color:#555">Costo/par</th>
                  <th style="padding:10px 8px;text-align:right;font-weight:600;color:#555">Costo total</th>
                  <th style="padding:10px 8px;text-align:right;font-weight:600;color:#555">Precio venta</th>
                  <th style="padding:10px 8px;text-align:right;font-weight:600;color:#555">Venta total</th>
                  <th style="padding:10px 8px;text-align:right;font-weight:600;color:#555">Margen</th>
                </tr>
              </thead>
              <tbody>
                ${desglose.map(r => {
                  const margenR = r.subtotal_venta > 0 ? ((r.subtotal_venta - r.subtotal_costo) / r.subtotal_venta * 100) : 0
                  const margenColor = margenR >= 30 ? '#2e7d32' : margenR >= 15 ? '#f57f17' : '#c62828'
                  return `<tr style="border-bottom:1px solid #f5f5f5">
                    <td style="padding:10px 14px">
                      <p style="font-weight:600">${r.nombre}</p>
                      <p style="font-size:0.72rem;color:#aaa;font-family:monospace">${r.sku}</p>
                    </td>
                    <td style="padding:10px 14px;color:#666">${[r.color, r.talla ? 'T'+r.talla : ''].filter(Boolean).join(' · ') || '—'}</td>
                    <td style="padding:10px 8px;text-align:center;font-weight:700">${r.cantidad}</td>
                    <td style="padding:10px 8px;text-align:right;color:#b5651d">$${r.costo_unitario.toLocaleString('es-MX',{maximumFractionDigits:0})}</td>
                    <td style="padding:10px 8px;text-align:right;font-weight:700;color:#b5651d">$${r.subtotal_costo.toLocaleString('es-MX',{maximumFractionDigits:0})}</td>
                    <td style="padding:10px 8px;text-align:right;color:#555">$${r.precio_venta.toLocaleString('es-MX',{maximumFractionDigits:0})}</td>
                    <td style="padding:10px 8px;text-align:right;font-weight:700;color:#E91E8C">$${r.subtotal_venta.toLocaleString('es-MX',{maximumFractionDigits:0})}</td>
                    <td style="padding:10px 8px;text-align:right;font-weight:700;color:${margenColor}">${margenR.toFixed(1)}%</td>
                  </tr>`
                }).join('')}
              </tbody>
              <tfoot>
                <tr style="background:#f9f9f9;border-top:2px solid #eee;font-weight:700">
                  <td colspan="4" style="padding:10px 14px">TOTAL</td>
                  <td style="padding:10px 8px;text-align:right;color:#b5651d">$${totalCmv.toLocaleString('es-MX',{maximumFractionDigits:0})}</td>
                  <td></td>
                  <td style="padding:10px 8px;text-align:right;color:#E91E8C">$${totalVtas.toLocaleString('es-MX',{maximumFractionDigits:0})}</td>
                  <td style="padding:10px 8px;text-align:right;color:${margen>=0?'#2e7d32':'#c62828'}">${margen.toFixed(1)}%</td>
                </tr>
              </tfoot>
            </table>
          </div>`}
      </div>
    `
  } else if (tab === 'gastos') {
    const totalCategorias = categorias.reduce((s, c) => s + c.total, 0)
    container.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
        <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
          <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
            <p style="font-weight:700;font-size:0.9rem">💸 Gastos del día</p>
            <button class="btn btn-secondary" style="padding:4px 12px;font-size:0.78rem" onclick="agregarGasto('${sucursalId}')">+ Agregar</button>
          </div>
          ${gastosHoy.length === 0
            ? '<div style="padding:2rem;text-align:center;color:#888;font-size:0.85rem">Sin gastos hoy</div>'
            : gastosHoy.map(g => `
              <div style="padding:0.75rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:12px">
                <div style="flex:1">
                  <p style="font-size:0.85rem;font-weight:600">${g.concepto}</p>
                  <p style="font-size:0.72rem;color:#888">${g.categoria} · ${new Date(g.created_at).toLocaleTimeString('es-MX', {hour:'2-digit',minute:'2-digit'})}</p>
                </div>
                <p style="font-weight:700;color:#c62828">-$${parseFloat(g.monto).toFixed(2)}</p>
                <button onclick="eliminarGasto('${g.id}')" style="background:none;border:none;color:#ccc;cursor:pointer;font-size:1.1rem">✕</button>
              </div>
            `).join('')}
          <div style="padding:1rem 1.5rem;background:#f9f9f9;display:flex;justify-content:space-between">
            <span style="font-size:0.85rem;font-weight:600">Total gastos hoy</span>
            <span style="font-weight:700;color:#c62828">-$${totalGastosHoy.toFixed(2)}</span>
          </div>
        </div>
        <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
          <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee">
            <p style="font-weight:700;font-size:0.9rem">📊 Gastos por categoría (30 días)</p>
          </div>
          <div style="padding:1rem">
            ${categorias.length === 0
              ? '<p style="color:#888;text-align:center;padding:1rem">Sin gastos registrados</p>'
              : categorias.map(c => `
                <div style="margin-bottom:12px">
                  <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                    <span style="font-size:0.82rem;font-weight:600;text-transform:capitalize">${c.categoria}</span>
                    <span style="font-size:0.82rem;color:#c62828;font-weight:700">$${c.total.toFixed(0)}</span>
                  </div>
                  <div style="background:#f5f5f5;border-radius:100px;height:8px;overflow:hidden">
                    <div style="background:#E91E8C;height:100%;width:${totalCategorias > 0 ? (c.total/totalCategorias*100).toFixed(0) : 0}%;border-radius:100px;transition:width 0.5s"></div>
                  </div>
                </div>
              `).join('')}
          </div>
        </div>
      </div>
    `
  } else if (tab === 'estado') {
    container.innerHTML = `
      <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
        <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee">
          <p style="font-weight:700;font-size:0.9rem">📊 Estado de resultados — últimos 6 meses</p>
        </div>
        <div style="overflow-x:auto">
          <table>
            <thead>
              <tr>
                <th>Mes</th>
                <th>Ventas</th>
                <th>Gastos</th>
                <th>Utilidad</th>
                <th>Pedidos</th>
                <th>Margen</th>
              </tr>
            </thead>
            <tbody>
              ${estadoResultados.map(m => `
                <tr>
                  <td><strong>${m.mes}</strong></td>
                  <td style="color:#E91E8C;font-weight:600">$${m.ventas.toFixed(0)}</td>
                  <td style="color:#c62828">$${m.gastos.toFixed(0)}</td>
                  <td style="color:${m.utilidad >= 0 ? '#2e7d32' : '#c62828'};font-weight:700">$${m.utilidad.toFixed(0)}</td>
                  <td>${m.num_pedidos}</td>
                  <td>
                    <span style="padding:2px 8px;border-radius:100px;font-size:0.72rem;font-weight:600;background:${m.ventas > 0 && m.utilidad/m.ventas >= 0.2 ? '#e8f5e9' : m.utilidad >= 0 ? '#fff8e1' : '#ffebee'};color:${m.ventas > 0 && m.utilidad/m.ventas >= 0.2 ? '#2e7d32' : m.utilidad >= 0 ? '#f57f17' : '#c62828'}">
                      ${m.ventas > 0 ? (m.utilidad/m.ventas*100).toFixed(1) : 0}%
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div style="padding:1rem 1.5rem;background:#f9f9f9;display:flex;gap:2rem;flex-wrap:wrap">
          <div>
            <p style="font-size:0.72rem;color:#888">Total ventas 6 meses</p>
            <p style="font-weight:700;color:#E91E8C">$${estadoResultados.reduce((s,m)=>s+m.ventas,0).toFixed(0)}</p>
          </div>
          <div>
            <p style="font-size:0.72rem;color:#888">Total gastos 6 meses</p>
            <p style="font-weight:700;color:#c62828">$${estadoResultados.reduce((s,m)=>s+m.gastos,0).toFixed(0)}</p>
          </div>
          <div>
            <p style="font-size:0.72rem;color:#888">Utilidad total</p>
            <p style="font-weight:700;color:#2e7d32">$${estadoResultados.reduce((s,m)=>s+m.utilidad,0).toFixed(0)}</p>
          </div>
        </div>
      </div>
    `
  } else if (tab === 'flujo') {
    container.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem">
          <p style="font-weight:700;font-size:0.9rem;margin-bottom:1rem">🌅 Hoy</p>
          ${[
            { label: 'Efectivo', val: flujo.hoy?.efectivo||0, color: '#2e7d32' },
            { label: 'Tarjeta', val: flujo.hoy?.tarjeta||0, color: '#1565c0' },
            { label: 'SPEI', val: flujo.hoy?.spei||0, color: '#6a1b9a' },
            { label: 'Crédito', val: flujo.hoy?.credito||0, color: '#f57f17' },
          ].map(r => `
            <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f5f5f5">
              <span style="font-size:0.82rem;color:#888">${r.label}</span>
              <span style="font-weight:700;color:${r.color}">$${r.val.toFixed(0)}</span>
            </div>
          `).join('')}
          <div style="display:flex;justify-content:space-between;padding:8px 0;margin-top:4px">
            <span style="font-size:0.85rem;font-weight:700">Total</span>
            <span style="font-weight:700;color:#E91E8C;font-size:1.1rem">$${(flujo.hoy?.total||0).toFixed(0)}</span>
          </div>
        </div>
        <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem">
          <p style="font-weight:700;font-size:0.9rem;margin-bottom:1rem">📅 Últimos 7 días</p>
          <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f5f5f5">
            <span style="font-size:0.82rem;color:#888">Ingresos</span>
            <span style="font-weight:700;color:#2e7d32">$${(flujo.semana?.ingresos||0).toFixed(0)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f5f5f5">
            <span style="font-size:0.82rem;color:#888">Gastos</span>
            <span style="font-weight:700;color:#c62828">-$${(flujo.semana?.gastos||0).toFixed(0)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px 0;margin-top:4px">
            <span style="font-size:0.85rem;font-weight:700">Neto</span>
            <span style="font-weight:700;color:${(flujo.semana?.neto||0) >= 0 ? '#2e7d32' : '#c62828'};font-size:1.1rem">$${(flujo.semana?.neto||0).toFixed(0)}</span>
          </div>
        </div>
        <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem">
          <p style="font-weight:700;font-size:0.9rem;margin-bottom:1rem">📆 Últimos 30 días</p>
          <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f5f5f5">
            <span style="font-size:0.82rem;color:#888">Ingresos</span>
            <span style="font-weight:700;color:#2e7d32">$${(flujo.mes?.ingresos||0).toFixed(0)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f5f5f5">
            <span style="font-size:0.82rem;color:#888">Gastos</span>
            <span style="font-weight:700;color:#c62828">-$${(flujo.mes?.gastos||0).toFixed(0)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px 0;margin-top:4px">
            <span style="font-size:0.85rem;font-weight:700">Neto</span>
            <span style="font-weight:700;color:${(flujo.mes?.neto||0) >= 0 ? '#2e7d32' : '#c62828'};font-size:1.1rem">$${(flujo.mes?.neto||0).toFixed(0)}</span>
          </div>
        </div>
      </div>
    `
  } else if (tab === 'caja') {
    container.innerHTML = `
      <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
        <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee">
          <p style="font-weight:700;font-size:0.9rem">📋 Historial de cajas</p>
        </div>
        ${historial.length === 0
          ? '<div style="padding:2rem;text-align:center;color:#888">Sin historial</div>'
          : historial.map(c => `
            <div style="padding:1rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
              <div style="flex:1">
                <p style="font-size:0.85rem;font-weight:600">${new Date(c.fecha).toLocaleDateString('es-MX', {weekday:'short',day:'numeric',month:'short'})}</p>
                <p style="font-size:0.72rem;color:#888">Apertura: $${parseFloat(c.monto_apertura||0).toFixed(0)} · Cierre: $${parseFloat(c.monto_cierre||0).toFixed(0)}</p>
              </div>
              <div style="text-align:center">
                <p style="font-size:0.9rem;font-weight:700;color:#E91E8C">$${parseFloat(c.total_ventas||0).toFixed(0)}</p>
                <p style="font-size:0.65rem;color:#888">Ventas</p>
              </div>
              <div style="text-align:center">
                <p style="font-size:0.9rem;font-weight:700;color:${parseFloat(c.diferencia||0) >= 0 ? '#2e7d32' : '#c62828'}">${parseFloat(c.diferencia||0) >= 0 ? '+' : ''}$${parseFloat(c.diferencia||0).toFixed(0)}</p>
                <p style="font-size:0.65rem;color:#888">Diferencia</p>
              </div>
              <span style="padding:3px 10px;border-radius:100px;font-size:0.68rem;font-weight:600;background:${c.status==='cerrada'?'#e8f5e9':'#fff8e1'};color:${c.status==='cerrada'?'#2e7d32':'#f57f17'}">${c.status}</span>
            </div>
          `).join('')}
      </div>
    `
  } else if (tab === 'cxc') {
    mostrarCxC()
  }
}

window.mostrarCxC = () => {
  const { cxc } = window._finanzasData
  const container = document.getElementById('fin-tab-contenido')
  if (!container) return
  const hoy = new Date()
  container.innerHTML = `
    <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
      <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
        <p style="font-weight:700;font-size:0.9rem">📑 Cuentas por cobrar</p>
        <span style="font-size:0.78rem;color:#888">${cxc.length} pendientes · $${cxc.reduce((s,p)=>s+parseFloat(p.total||0),0).toFixed(0)} total</span>
      </div>
      ${cxc.length === 0
        ? '<div style="padding:2rem;text-align:center;color:#888">Sin cuentas por cobrar</div>'
        : cxc.map(p => {
          const diasVencido = Math.floor((hoy - new Date(p.created_at)) / (1000*60*60*24))
          return `
            <div style="padding:1rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
              <div style="flex:1">
                <p style="font-size:0.85rem;font-weight:600">${p.clientes?.nombre || 'Sin cliente'}</p>
                <p style="font-size:0.72rem;color:#888">${new Date(p.created_at).toLocaleDateString('es-MX')} · Pedido #${p.id.substring(0,8).toUpperCase()}</p>
              </div>
              <div style="text-align:right">
                <p style="font-weight:700;color:#f57f17;font-size:1rem">$${parseFloat(p.total||0).toFixed(0)}</p>
                <span style="font-size:0.68rem;padding:2px 8px;border-radius:100px;background:${diasVencido > 30 ? '#ffebee' : '#fff8e1'};color:${diasVencido > 30 ? '#c62828' : '#f57f17'}">
                  ${diasVencido} días
                </span>
              </div>
              ${p.clientes?.telefono ? `
                <a href="https://wa.me/52${p.clientes.telefono.replace(/\D/g,'')}" target="_blank"
                   style="background:#25D366;color:white;padding:6px 12px;border-radius:8px;font-size:0.78rem;text-decoration:none">
                  💬 Cobrar
                </a>
              ` : ''}
            </div>
          `
        }).join('')}
    </div>
  `
}

window.abrirCaja = async (sucursalId) => {
  const monto = prompt('¿Cuánto efectivo hay en caja para empezar? (fondo de caja)')
  if (monto === null) return
  try {
    const res = await fetch(API + '/finanzas/caja/abrir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sucursal_id: sucursalId,
        monto_apertura: parseFloat(monto) || 0,
        empleado: window._empleadoActual?.nombre || 'Admin'
      })
    })
    const data = await res.json()
    if (data.error) { alert('Error: ' + data.error); return }
    cargarFinanzas()
  } catch(e) {
    alert('Error abriendo caja')
  }
}

window.cerrarCaja = async (cajaId) => {
  const monto = prompt('¿Cuánto efectivo hay físicamente en caja al cerrar?')
  if (monto === null) return
  const notas = prompt('Notas del cierre (opcional):') || ''
  try {
    const res = await fetch(API + '/finanzas/caja/' + cajaId + '/cerrar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ monto_cierre: parseFloat(monto) || 0, notas })
    })
    const data = await res.json()
    if (data.ok) {
      alert(`Caja cerrada.\nTotal ventas: $${data.total_ventas?.toFixed(2)}\nDiferencia: $${data.diferencia?.toFixed(2)}`)
      cargarFinanzas()
    } else {
      alert('Error: ' + JSON.stringify(data))
    }
  } catch(e) {
    alert('Error cerrando caja')
  }
}

window.agregarGasto = (sucursalId) => {
  const modal = document.createElement('div')
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem'
  modal.innerHTML = `
    <div style="background:white;border-radius:16px;padding:2rem;max-width:440px;width:100%">
      <h3 style="margin-bottom:1.5rem">💸 Agregar gasto</h3>
      <div style="display:flex;flex-direction:column;gap:1rem">
        <div>
          <label class="form-label">Concepto *</label>
          <input class="form-input" id="gasto-concepto" placeholder="Ej: Transporte, Papelería, Limpieza...">
        </div>
        <div>
          <label class="form-label">Monto *</label>
          <input class="form-input" id="gasto-monto" type="number" step="0.01" placeholder="0.00">
        </div>
        <div>
          <label class="form-label">Categoría</label>
          <select class="form-input" id="gasto-categoria">
            <option value="general">General</option>
            <option value="transporte">Transporte</option>
            <option value="papeleria">Papelería</option>
            <option value="limpieza">Limpieza</option>
            <option value="servicios">Servicios</option>
            <option value="comida">Comida</option>
            <option value="renta">Renta</option>
            <option value="otro">Otro</option>
          </select>
        </div>
      </div>
      <div style="display:flex;gap:1rem;margin-top:1.5rem;justify-content:flex-end">
        <button class="btn btn-secondary" onclick="this.closest('div[style]').remove()">Cancelar</button>
        <button class="btn btn-primary" onclick="guardarGasto('${sucursalId}', this)">Guardar</button>
      </div>
    </div>
  `
  document.body.appendChild(modal)
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove() })
}

window.guardarGasto = async (sucursalId, btn) => {
  const concepto = document.getElementById('gasto-concepto').value
  const monto = document.getElementById('gasto-monto').value
  const categoria = document.getElementById('gasto-categoria').value
  if (!concepto || !monto) { alert('Completa concepto y monto'); return }
  try {
    await fetch(API + '/finanzas/gastos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sucursal_id: sucursalId,
        concepto,
        monto: parseFloat(monto),
        categoria,
        empleado: window._empleadoActual?.nombre || 'Admin'
      })
    })
    btn.closest('div[style*="position:fixed"]').remove()
    cargarFinanzas()
  } catch(e) {
    alert('Error guardando gasto')
  }
}

window.eliminarGasto = async (id) => {
  if (!confirm('¿Eliminar este gasto?')) return
  try {
    await fetch(API + '/finanzas/gastos/' + id, { method: 'DELETE' })
    cargarFinanzas()
  } catch(e) {
    alert('Error eliminando gasto')
  }
}

async function cargarProveedores() {
  const content = document.getElementById('content')
  try {
    const res = await fetch(API + '/finanzas/proveedores')
    const data = await res.json()
    content.innerHTML = `
      <div class="table-card">
        <div class="table-header">
          <h3>Proveedores (${data.length})</h3>
          <button class="btn btn-primary" onclick="mostrarFormProveedor()">+ Nuevo proveedor</button>
        </div>
        ${data.length === 0
          ? '<div style="padding:3rem;text-align:center;color:#888">No hay proveedores registrados</div>'
          : `<table>
            <thead>
              <tr><th>Nombre</th><th>Contacto</th><th>Teléfono</th><th>Ciudad</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              ${data.map(p => `
                <tr>
                  <td><strong>${p.nombre}</strong></td>
                  <td>${p.contacto || '—'}</td>
                  <td>${p.telefono || '—'}</td>
                  <td>${p.ciudad || '—'}</td>
                  <td>
                    <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="editarProveedor('${p.id}')">Editar</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>`}
      </div>
    `
  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error cargando proveedores</p>'
  }
}

window.mostrarFormProveedor = (datos) => {
  const d = datos || {}
  const modal = document.createElement('div')
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem'
  modal.innerHTML = `
    <div style="background:white;border-radius:16px;padding:2rem;max-width:500px;width:100%;max-height:90vh;overflow-y:auto">
      <h3 style="margin-bottom:1.5rem">${d.id ? 'Editar' : 'Nuevo'} proveedor</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
        <div style="grid-column:1/-1">
          <label class="form-label">Nombre *</label>
          <input class="form-input" id="prov-nombre" value="${d.nombre || ''}" placeholder="Nombre del proveedor">
        </div>
        <div>
          <label class="form-label">Contacto</label>
          <input class="form-input" id="prov-contacto" value="${d.contacto || ''}" placeholder="Nombre del contacto">
        </div>
        <div>
          <label class="form-label">Teléfono</label>
          <input class="form-input" id="prov-telefono" value="${d.telefono || ''}" placeholder="477 123 4567">
        </div>
        <div>
          <label class="form-label">Email</label>
          <input class="form-input" id="prov-email" value="${d.email || ''}" placeholder="correo@proveedor.com">
        </div>
        <div>
          <label class="form-label">Ciudad</label>
          <input class="form-input" id="prov-ciudad" value="${d.ciudad || ''}" placeholder="Leon">
        </div>
        <div style="grid-column:1/-1">
          <label class="form-label">Dirección</label>
          <input class="form-input" id="prov-direccion" value="${d.direccion || ''}" placeholder="Calle y número">
        </div>
        <div style="grid-column:1/-1">
          <label class="form-label">Notas</label>
          <textarea class="form-input" id="prov-notas" rows="2" placeholder="Condiciones de pago, tiempo de entrega...">${d.notas || ''}</textarea>
        </div>
      </div>
      <div style="display:flex;gap:1rem;margin-top:1.5rem;justify-content:flex-end">
        <button class="btn btn-secondary" onclick="this.closest('div[style*=position]').remove()">Cancelar</button>
        <button class="btn btn-primary" onclick="guardarProveedor('${d.id || ''}')">Guardar</button>
      </div>
    </div>
  `
  document.body.appendChild(modal)
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove() })
}

window.guardarProveedor = async (id) => {
  const datos = {
    nombre: document.getElementById('prov-nombre').value,
    contacto: document.getElementById('prov-contacto').value,
    telefono: document.getElementById('prov-telefono').value,
    email: document.getElementById('prov-email').value,
    ciudad: document.getElementById('prov-ciudad').value,
    direccion: document.getElementById('prov-direccion').value,
    notas: document.getElementById('prov-notas').value
  }
  if (!datos.nombre) { alert('El nombre es requerido'); return }
  try {
    if (id) {
      await fetch(API + '/finanzas/proveedores/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      })
    } else {
      await fetch(API + '/finanzas/proveedores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      })
    }
    document.querySelector('div[style*="position:fixed"]').remove()
    cargarProveedores()
  } catch(e) {
    alert('Error guardando proveedor')
  }
}

window.editarProveedor = async (id) => {
  const res = await fetch(API + '/finanzas/proveedores')
  const proveedores = await res.json()
  const proveedor = proveedores.find(p => p.id === id)
  if (proveedor) mostrarFormProveedor(proveedor)
}

async function cargarAnalisis() {
  const content = document.getElementById('content')
  content.innerHTML = `
    <div style="margin-bottom:1.5rem">
      <p style="font-size:0.7rem;font-weight:700;letter-spacing:0.1em;color:#E91E8C;text-transform:uppercase;margin:0 0 3px">Inteligencia de negocio</p>
      <h2 style="font-size:1.3rem;font-weight:800;color:#0f172a;margin:0 0 4px;letter-spacing:-0.3px">Análisis</h2>
      <p style="color:#94a3b8;font-size:0.82rem">Cargando datos...</p>
    </div>
    <div style="display:flex;gap:10px;margin-bottom:1.5rem">
      ${['rotacion','tallas','variantes'].map(t => `<div style="height:36px;width:110px;background:#f1f5f9;border-radius:8px;animation:pulse 1.5s infinite"></div>`).join('')}
    </div>
    <div style="background:#f8fafc;border-radius:14px;height:300px;animation:pulse 1.5s infinite"></div>
    <style>@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}</style>`

  try {
    const [resProductos, resVariantes, resMovimientos, resInventario] = await Promise.all([
      fetch(API + '/productos/'),
      fetch(API + '/variantes/?activa=eq.true'),
      fetch(API + '/movimientos/'),
      fetch(API + '/inventario/slim')
    ])
    const productos = await resProductos.json()
    const variantes = await resVariantes.json()
    const movimientos = await resMovimientos.json()
    const inventario = await resInventario.json()

    const varianteMap = {}
    const prodVariantes = {}
    variantes.forEach(v => {
      varianteMap[v.id] = v
      if (!prodVariantes[v.producto_id]) prodVariantes[v.producto_id] = []
      prodVariantes[v.producto_id].push(v.id)
    })
    const stockPorVariante = {}
    inventario.forEach(i => {
      stockPorVariante[i.variante_id] = (stockPorVariante[i.variante_id] || 0) + i.cantidad
    })

    const hoy = new Date()
    const hace30 = new Date(hoy - 30 * 24 * 60 * 60 * 1000)
    const hace60 = new Date(hoy - 60 * 24 * 60 * 60 * 1000)
    const hace90 = new Date(hoy - 90 * 24 * 60 * 60 * 1000)

    // Ventas por producto (unidades)
    const ventasPorProducto = {}
    // Ventas por variante_id
    const ventasPorVariante = {}
    // Ventas por (producto_id, talla)
    const ventasPorTalla = {}
    // Ventas por (producto_id, color, talla)
    const ventasPorColorTalla = {}

    const ventasMovs = movimientos.filter(m => m.tipo === 'venta')
    ventasMovs.forEach(m => {
      const variante = varianteMap[m.variante_id]
      if (!variante) return
      const pid = variante.producto_id
      const cantidad = Math.abs(m.cantidad)
      const fecha = new Date(m.created_at)

      if (!ventasPorProducto[pid]) ventasPorProducto[pid] = { d30: 0, d60: 0, d90: 0, total: 0 }
      ventasPorProducto[pid].total += cantidad
      if (fecha >= hace30) ventasPorProducto[pid].d30 += cantidad
      if (fecha >= hace60) ventasPorProducto[pid].d60 += cantidad
      if (fecha >= hace90) ventasPorProducto[pid].d90 += cantidad

      if (!ventasPorVariante[m.variante_id]) ventasPorVariante[m.variante_id] = { d30: 0, d90: 0, total: 0 }
      ventasPorVariante[m.variante_id].total += cantidad
      if (fecha >= hace30) ventasPorVariante[m.variante_id].d30 += cantidad
      if (fecha >= hace90) ventasPorVariante[m.variante_id].d90 += cantidad

      const talla = variante.talla || 'S/T'
      const key = `${pid}|${talla}`
      if (!ventasPorTalla[key]) ventasPorTalla[key] = { talla, d30: 0, d90: 0, total: 0 }
      ventasPorTalla[key].total += cantidad
      if (fecha >= hace30) ventasPorTalla[key].d30 += cantidad
      if (fecha >= hace90) ventasPorTalla[key].d90 += cantidad

      // por color+talla
      const color = variante.color || 'Sin color'
      const keyC = `${pid}|${color}|${talla}`
      if (!ventasPorColorTalla[keyC]) ventasPorColorTalla[keyC] = { talla, color, d30: 0, d90: 0, total: 0 }
      ventasPorColorTalla[keyC].total += cantidad
      if (fecha >= hace30) ventasPorColorTalla[keyC].d30 += cantidad
      if (fecha >= hace90) ventasPorColorTalla[keyC].d90 += cantidad
    })

    const productosConRotacion = productos.map(p => {
      const ventas = ventasPorProducto[p.id] || { d30: 0, d60: 0, d90: 0, total: 0 }
      const varIds = prodVariantes[p.id] || []
      const stockTotal = varIds.reduce((s, vid) => s + (stockPorVariante[vid] || 0), 0)
      const ventasSemana = ventas.d30 / 4
      const diasInventario = ventasSemana > 0 ? Math.round(stockTotal / ventasSemana * 7) : null

      let semaforo = 'gris'
      let recomendacion = 'Sin ventas recientes'
      if (ventas.d30 >= 6) { semaforo = 'verde'; recomendacion = 'Rota bien — considerar resurtido' }
      else if (ventas.d30 >= 2) { semaforo = 'amarillo'; recomendacion = 'Rotación moderada' }
      else if (ventas.d90 === 0 && stockTotal > 0) { semaforo = 'rojo'; recomendacion = 'Sin movimiento en 90 días — revisar' }
      else if (ventas.d30 > 0) { semaforo = 'amarillo'; recomendacion = 'Rotación lenta' }

      // Tallas más vendidas (global del producto)
      const tallasData = varIds
        .map(vid => varianteMap[vid]?.talla).filter(Boolean)
        .filter((t, i, a) => a.indexOf(t) === i)
        .map(talla => ({ talla, ...(ventasPorTalla[`${p.id}|${talla}`] || { d30:0, d90:0, total:0 }) }))
        .sort((a, b) => b.total - a.total)

      // Tallas por color: { color → [{ talla, total, d30 }] }
      const coloresDelProd = [...new Set(varIds.map(vid => varianteMap[vid]?.color).filter(Boolean))]
      const tallasDesglosadas = coloresDelProd.map(color => {
        const tallasDeEsteColor = varIds
          .filter(vid => varianteMap[vid]?.color === color)
          .map(vid => varianteMap[vid]?.talla).filter(Boolean)
          .filter((t, i, a) => a.indexOf(t) === i)
          .map(talla => ({ talla, ...(ventasPorColorTalla[`${p.id}|${color}|${talla}`] || { d30:0, d90:0, total:0 }) }))
          .sort((a, b) => parseFloat(a.talla) - parseFloat(b.talla))
        const totalColor = tallasDeEsteColor.reduce((s, t) => s + t.total, 0)
        return { color, tallas: tallasDeEsteColor, total: totalColor }
      }).filter(c => c.total > 0).sort((a, b) => b.total - a.total)

      // Variantes más vendidas
      const variantesData = varIds.map(vid => {
        const v = varianteMap[vid]
        if (!v) return null
        const vventas = ventasPorVariante[vid] || { d30:0, d90:0, total:0 }
        const stock = stockPorVariante[vid] || 0
        return { id: vid, label: [v.talla, v.color].filter(Boolean).join(' / ') || vid, stock, ...vventas }
      }).filter(Boolean).sort((a, b) => b.total - a.total)

      return { ...p, ventas, stockTotal, ventasSemana, diasInventario, semaforo, recomendacion, tallasData, tallasDesglosadas, variantesData }
    }).sort((a, b) => b.ventas.d30 - a.ventas.d30)

    window._analisisData = { productosConRotacion, ventasPorTalla }

    const total30 = productosConRotacion.reduce((s,p) => s+p.ventas.d30, 0)
    const total90 = productosConRotacion.reduce((s,p) => s+p.ventas.d90, 0)
    const rotan = productosConRotacion.filter(p=>p.semaforo==='verde').length
    const muertos = productosConRotacion.filter(p=>p.semaforo==='rojo').length

    const badgeSemaforo = {
      verde:   { bg:'#dcfce7', color:'#166534', dot:'#16a34a', txt:'Rota bien' },
      amarillo:{ bg:'#fef9c3', color:'#854d0e', dot:'#ca8a04', txt:'Rotación lenta' },
      rojo:    { bg:'#fee2e2', color:'#991b1b', dot:'#dc2626', txt:'Sin movimiento' },
      gris:    { bg:'#f1f5f9', color:'#64748b', dot:'#94a3b8', txt:'Sin datos' }
    }

    function miniBar(val, max, color) {
      const pct = max > 0 ? Math.round(val / max * 100) : 0
      return `<div style="display:flex;align-items:center;gap:6px">
        <div style="flex:1;height:6px;background:#f1f5f9;border-radius:3px;overflow:hidden">
          <div style="width:${pct}%;height:100%;background:${color};border-radius:3px;transition:width 0.4s ease"></div>
        </div>
        <span style="font-size:0.7rem;font-weight:700;color:#334155;min-width:22px;text-align:right">${val}</span>
      </div>`
    }

    function renderTabRotacion() {
      return `
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">
          <button class="pill-filter pill-active" onclick="filtrarRotacion('todos')">Todos</button>
          <button class="pill-filter pill-success" onclick="filtrarRotacion('verde')">Rotan bien</button>
          <button class="pill-filter pill-warning" onclick="filtrarRotacion('amarillo')">Lentos</button>
          <button class="pill-filter pill-danger" onclick="filtrarRotacion('rojo')">Sin movimiento</button>
        </div>
        <div id="rotacion-lista" style="display:flex;flex-direction:column;gap:8px">
          ${productosConRotacion.map(p => {
            const s = badgeSemaforo[p.semaforo]
            const maxD30 = Math.max(...productosConRotacion.map(x=>x.ventas.d30), 1)
            return `
            <div class="rotacion-item" data-semaforo="${p.semaforo}"
                 style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:14px 16px;display:flex;align-items:center;gap:14px;flex-wrap:wrap;transition:box-shadow 0.15s"
                 onmouseover="this.style.boxShadow='0 4px 16px rgba(0,0,0,0.07)'" onmouseout="this.style.boxShadow=''">
              ${p.imagen_principal
                ? `<img src="${p.imagen_principal}" style="width:48px;height:48px;object-fit:contain;border-radius:8px;background:#f8fafc;flex-shrink:0">`
                : `<div style="width:48px;height:48px;background:#f8fafc;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;color:#cbd5e1">👠</div>`}
              <div style="flex:1;min-width:130px">
                <p style="font-weight:700;font-size:0.88rem;color:#0f172a;margin-bottom:2px">${p.nombre}</p>
                <p style="font-size:0.72rem;color:#94a3b8;margin-bottom:6px">${p.sku_interno || ''} · ${p.stockTotal} pares en stock</p>
                <span style="display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:100px;font-size:0.67rem;font-weight:700;background:${s.bg};color:${s.color}">
                  <span style="width:6px;height:6px;border-radius:50%;background:${s.dot};flex-shrink:0"></span>${s.txt}
                </span>
              </div>
              <div style="min-width:160px;flex:1">
                <p style="font-size:0.67rem;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:5px">Ventas últimos 30 días</p>
                ${miniBar(p.ventas.d30, maxD30, '#E91E8C')}
                <div style="display:flex;gap:12px;margin-top:6px">
                  <span style="font-size:0.7rem;color:#64748b">60d: <strong>${p.ventas.d60}</strong></span>
                  <span style="font-size:0.7rem;color:#64748b">90d: <strong>${p.ventas.d90}</strong></span>
                  <span style="font-size:0.7rem;color:#64748b">${p.ventasSemana.toFixed(1)} /sem</span>
                </div>
              </div>
              <div style="text-align:right;min-width:100px">
                ${p.diasInventario
                  ? `<p style="font-size:1rem;font-weight:800;color:${p.diasInventario<14?'#dc2626':p.diasInventario<30?'#ca8a04':'#16a34a'}">${p.diasInventario}d</p>
                     <p style="font-size:0.67rem;color:#94a3b8">stock restante</p>`
                  : `<p style="font-size:0.72rem;color:#94a3b8">Sin ventas</p>`}
                <p style="font-size:0.67rem;color:#64748b;margin-top:3px">${p.recomendacion}</p>
              </div>
            </div>`
          }).join('')}
        </div>`
    }

    function renderTabTallas(filtro) {
      filtro = (filtro || '').toLowerCase()
      const productosConVentas = productosConRotacion.filter(p =>
        (p.tallasDesglosadas.length > 0 || p.tallasData.some(t => t.total > 0)) &&
        (!filtro || p.nombre.toLowerCase().includes(filtro) || (p.sku_interno||'').toLowerCase().includes(filtro))
      )
      const totalProductos = productosConRotacion.filter(p => p.tallasData.some(t => t.total > 0)).length

      const leyenda = `
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;padding:9px 14px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;flex-wrap:wrap">
          <span style="font-size:0.7rem;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;flex-shrink:0">Intensidad:</span>
          ${[
            { bg:'#f8fafc', txt:'Sin ventas' },
            { bg:'#fce7f3', txt:'1–2 pares' },
            { bg:'#fbcfe8', txt:'Moderado' },
            { bg:'#f472b6', txt:'Buenas' },
            { bg:'#E91E8C', txt:'Muy buenas' }
          ].map(l => `
            <div style="display:flex;align-items:center;gap:4px">
              <div style="width:16px;height:16px;border-radius:3px;background:${l.bg};border:1px solid rgba(0,0,0,0.08);flex-shrink:0"></div>
              <span style="font-size:0.68rem;color:#475569">${l.txt}</span>
            </div>`).join('')}
          <span style="font-size:0.68rem;color:#94a3b8;margin-left:2px">— Número = pares totales · (+X) = últimos 30 días</span>
        </div>`

      function heatmapCeldas(tallasArr) {
        const maxV = Math.max(...tallasArr.map(t => t.total), 1)
        return tallasArr.map(t => {
          const pct = Math.round(t.total / maxV * 100)
          const bg = pct === 0 ? '#f8fafc' : pct < 20 ? '#fce7f3' : pct < 50 ? '#fbcfe8' : pct < 80 ? '#f472b6' : '#E91E8C'
          const tc = pct >= 50 ? 'white' : pct === 0 ? '#cbd5e1' : '#be185d'
          const sub = pct >= 50 ? 'rgba(255,255,255,0.75)' : '#db2777'
          return `
          <div style="background:${bg};border-radius:7px;padding:8px 5px;text-align:center;transition:transform 0.15s;min-width:58px;${pct===0?'border:1px solid #e2e8f0':''}"
               title="T${t.talla}: ${t.total} pares totales (${t.d30} en 30d)"
               onmouseover="this.style.transform='scale(1.08)'" onmouseout="this.style.transform=''">
            <p style="font-size:0.9rem;font-weight:800;color:${tc};line-height:1;margin-bottom:2px">${t.total}</p>
            <p style="font-size:0.65rem;font-weight:700;color:${tc}">T${t.talla}</p>
            <p style="font-size:0.58rem;color:${t.d30>0?sub:'transparent'};margin-top:1px">${t.d30>0?'+'+t.d30:'·'}</p>
          </div>`
        }).join('')
      }

      return `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap">
          <input id="tallas-buscar" class="form-input" placeholder="Filtrar por modelo o SKU..."
            style="max-width:260px;font-size:0.82rem" value="${filtro}"
            oninput="document.getElementById('analisis-tab-content').innerHTML=window._renderTabTallas(this.value)">
          <span style="font-size:0.75rem;color:#94a3b8">${productosConVentas.length} de ${totalProductos} modelos</span>
        </div>
        ${leyenda}
        ${productosConVentas.length === 0
          ? `<div style="padding:3rem;text-align:center;color:#94a3b8;font-size:0.9rem">No se encontraron modelos</div>`
          : productosConVentas.map(p => {
            const tallaGlobalTop = p.tallasData.find(t => t.total > 0)
            const tieneColores = p.tallasDesglosadas.length > 0

            return `
            <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-bottom:10px">
              <!-- cabecera del producto -->
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap">
                ${p.imagen_principal ? `<img src="${p.imagen_principal}" style="width:40px;height:40px;object-fit:contain;border-radius:8px;background:#f8fafc;flex-shrink:0">` : ''}
                <div style="flex:1">
                  <p style="font-weight:700;font-size:0.88rem;color:#0f172a">${p.nombre}</p>
                  <p style="font-size:0.7rem;color:#94a3b8">${p.ventas.d90} pares en 90d · ${tieneColores ? p.tallasDesglosadas.length + ' colores con ventas' : p.tallasData.filter(t=>t.total>0).length + ' tallas con movimiento'}</p>
                </div>
                ${tallaGlobalTop ? `
                  <div style="background:#fdf2f8;border:1px solid #fbcfe8;border-radius:8px;padding:5px 12px;text-align:center;flex-shrink:0">
                    <p style="font-size:0.6rem;color:#9d174d;font-weight:700;text-transform:uppercase;letter-spacing:0.05em">Talla global top</p>
                    <p style="font-size:1.05rem;font-weight:800;color:#be185d;line-height:1.2">T${tallaGlobalTop.talla}</p>
                    <p style="font-size:0.62rem;color:#9d174d">${tallaGlobalTop.total} pares</p>
                  </div>` : ''}
              </div>

              ${tieneColores
                ? p.tallasDesglosadas.map(c => `
                  <div style="margin-bottom:12px">
                    <div style="display:flex;align-items:center;gap:6px;margin-bottom:7px">
                      <span style="font-size:0.72rem;font-weight:700;color:#334155;min-width:0">${c.color}</span>
                      <span style="font-size:0.65rem;color:#94a3b8;background:#f1f5f9;padding:1px 7px;border-radius:100px">${c.total} pares totales</span>
                      ${c.tallas.find(t=>t.total===Math.max(...c.tallas.map(x=>x.total)))
                        ? `<span style="font-size:0.65rem;color:#be185d;background:#fdf2f8;padding:1px 7px;border-radius:100px">
                            top: T${c.tallas.find(t=>t.total===Math.max(...c.tallas.map(x=>x.total))).talla}
                          </span>` : ''}
                    </div>
                    <div style="display:flex;gap:6px;flex-wrap:wrap">
                      ${heatmapCeldas(c.tallas)}
                    </div>
                  </div>`).join('<hr style="border:none;border-top:1px solid #f1f5f9;margin:4px 0 12px">')
                : `<div style="display:flex;gap:6px;flex-wrap:wrap">${heatmapCeldas(p.tallasData)}</div>`
              }
            </div>`
          }).join('')}
      `
    }

    function renderTabVariantes() {
      const productosConVentas = productosConRotacion.filter(p => p.variantesData.some(v => v.total > 0))
      if (productosConVentas.length === 0) return `<div style="padding:3rem;text-align:center;color:#94a3b8;font-size:0.9rem">No hay datos de ventas por variante aún</div>`

      return productosConVentas.map(p => {
        const varTop5 = p.variantesData.slice(0, 8)
        const maxVar = Math.max(...varTop5.map(v => v.total), 1)
        const winner = varTop5[0]

        return `
        <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-bottom:10px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap">
            ${p.imagen_principal ? `<img src="${p.imagen_principal}" style="width:36px;height:36px;object-fit:contain;border-radius:6px;background:#f8fafc">` : ''}
            <div style="flex:1">
              <p style="font-weight:700;font-size:0.88rem;color:#0f172a">${p.nombre}</p>
              <p style="font-size:0.7rem;color:#94a3b8">${p.variantesData.filter(v=>v.total>0).length} de ${p.variantesData.length} variantes con ventas</p>
            </div>
            ${winner && winner.total > 0 ? `<span style="background:#eff6ff;color:#1d4ed8;padding:4px 10px;border-radius:8px;font-size:0.72rem;font-weight:700">⭐ ${winner.label} — ${winner.total} vendidos</span>` : ''}
          </div>
          <div style="display:flex;flex-direction:column;gap:6px">
            ${varTop5.map((v, i) => {
              const colors = ['#E91E8C','#7c3aed','#0ea5e9','#10b981','#f59e0b','#ef4444','#6366f1','#14b8a6']
              const c = colors[i % colors.length]
              return `
              <div style="display:flex;align-items:center;gap:8px">
                <span style="font-size:0.72rem;font-weight:600;color:#64748b;min-width:100px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${v.label}</span>
                <div style="flex:1;height:20px;background:#f1f5f9;border-radius:4px;overflow:hidden;position:relative">
                  <div style="width:${Math.round(v.total/maxVar*100)}%;height:100%;background:${c};border-radius:4px;transition:width 0.5s ease;display:flex;align-items:center;padding-left:6px;box-sizing:border-box">
                    ${v.total/maxVar > 0.18 ? `<span style="font-size:0.65rem;font-weight:700;color:white">${v.total}</span>` : ''}
                  </div>
                  ${v.total/maxVar <= 0.18 ? `<span style="position:absolute;left:${Math.round(v.total/maxVar*100)+1}%;top:50%;transform:translateY(-50%);font-size:0.65rem;font-weight:700;color:#334155">${v.total}</span>` : ''}
                </div>
                <span style="font-size:0.67rem;color:#94a3b8;min-width:52px;text-align:right">Stock: ${v.stock}</span>
              </div>`
            }).join('')}
          </div>
        </div>`
      }).join('')
    }

    window._renderTabRotacion = renderTabRotacion
    window._renderTabTallas = renderTabTallas
    window._renderTabVariantes = renderTabVariantes

    content.innerHTML = `
      <div style="margin-bottom:1.5rem;display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:8px">
        <div>
          <p style="font-size:0.7rem;font-weight:700;letter-spacing:0.1em;color:#E91E8C;text-transform:uppercase;margin:0 0 3px">Inteligencia de negocio</p>
          <h2 style="font-size:1.3rem;font-weight:800;color:#0f172a;margin:0;letter-spacing:-0.3px">Análisis</h2>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;margin-bottom:1.5rem">
        <div style="background:linear-gradient(135deg,#fff0f8,#ffe4f2);border:1px solid #f9a8d4;border-radius:14px;padding:1rem 1.1rem">
          <p style="font-size:1.5rem;font-weight:800;color:#be185d;line-height:1;margin-bottom:3px">${total30}</p>
          <p style="font-size:0.67rem;font-weight:700;color:#be185d;text-transform:uppercase;letter-spacing:0.06em">Pares 30 días</p>
        </div>
        <div style="background:linear-gradient(135deg,#f5f3ff,#ede9fe);border:1px solid #ddd6fe;border-radius:14px;padding:1rem 1.1rem">
          <p style="font-size:1.5rem;font-weight:800;color:#6d28d9;line-height:1;margin-bottom:3px">${total90}</p>
          <p style="font-size:0.67rem;font-weight:700;color:#6d28d9;text-transform:uppercase;letter-spacing:0.06em">Pares 90 días</p>
        </div>
        <div style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1px solid #86efac;border-radius:14px;padding:1rem 1.1rem">
          <p style="font-size:1.5rem;font-weight:800;color:#15803d;line-height:1;margin-bottom:3px">${rotan}</p>
          <p style="font-size:0.67rem;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:0.06em">Rotan bien</p>
        </div>
        <div style="background:linear-gradient(135deg,#fff1f2,#fee2e2);border:1px solid #fca5a5;border-radius:14px;padding:1rem 1.1rem">
          <p style="font-size:1.5rem;font-weight:800;color:#b91c1c;line-height:1;margin-bottom:3px">${muertos}</p>
          <p style="font-size:0.67rem;font-weight:700;color:#b91c1c;text-transform:uppercase;letter-spacing:0.06em">Sin movimiento</p>
        </div>
      </div>

      <div style="display:flex;gap:0;margin-bottom:1.25rem;background:#f1f5f9;border-radius:10px;padding:3px;width:fit-content">
        <button id="tab-rotacion" onclick="switchTabAnalisis('rotacion')"
          style="padding:7px 18px;border-radius:8px;font-size:0.8rem;font-weight:700;border:none;cursor:pointer;transition:all 0.2s;background:white;color:#E91E8C;box-shadow:0 1px 4px rgba(0,0,0,0.1)">
          Rotación
        </button>
        <button id="tab-tallas" onclick="switchTabAnalisis('tallas')"
          style="padding:7px 18px;border-radius:8px;font-size:0.8rem;font-weight:700;border:none;cursor:pointer;transition:all 0.2s;background:transparent;color:#64748b">
          Tallas
        </button>
        <button id="tab-variantes" onclick="switchTabAnalisis('variantes')"
          style="padding:7px 18px;border-radius:8px;font-size:0.8rem;font-weight:700;border:none;cursor:pointer;transition:all 0.2s;background:transparent;color:#64748b">
          Variantes
        </button>
      </div>

      <div id="analisis-tab-content">
        ${renderTabRotacion()}
      </div>
    `

    window._analisisTabActivo = 'rotacion'

  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error cargando análisis</p>'
    console.error(e)
  }
}

window.switchTabAnalisis = (tab) => {
  const tabs = ['rotacion','tallas','variantes']
  tabs.forEach(t => {
    const btn = document.getElementById('tab-' + t)
    if (!btn) return
    if (t === tab) {
      btn.style.background = 'white'
      btn.style.color = '#E91E8C'
      btn.style.boxShadow = '0 1px 4px rgba(0,0,0,0.1)'
    } else {
      btn.style.background = 'transparent'
      btn.style.color = '#64748b'
      btn.style.boxShadow = 'none'
    }
  })
  const container = document.getElementById('analisis-tab-content')
  if (!container) return
  window._analisisTabActivo = tab
  if (tab === 'rotacion') container.innerHTML = window._renderTabRotacion()
  else if (tab === 'tallas') container.innerHTML = window._renderTabTallas()
  else if (tab === 'variantes') container.innerHTML = window._renderTabVariantes()
}

window.filtrarRotacion = (semaforo) => {
  document.querySelectorAll('.rotacion-item').forEach(item => {
    item.style.display = semaforo === 'todos' || item.dataset.semaforo === semaforo ? '' : 'none'
  })
  document.querySelectorAll('#analisis-tab-content .pill-filter').forEach(btn => {
    btn.classList.remove('pill-active')
  })
  const btnClicked = [...document.querySelectorAll('#analisis-tab-content .pill-filter')]
    .find(b => b.textContent.trim().toLowerCase().includes(
      semaforo === 'todos' ? 'todos' : semaforo === 'verde' ? 'bien' : semaforo === 'amarillo' ? 'lento' : 'movimiento'
    ))
  if (btnClicked) btnClicked.classList.add('pill-active')
}
async function cargarCRM() {
  const content = document.getElementById('content')
  content.innerHTML = '<p style="padding:2rem;color:#888">Cargando CRM...</p>'

  try {
    const [resCli, resPed, resSeg] = await Promise.all([
      fetch(API + '/clientes/'),
      fetch(API + '/pedidos/'),
      fetch(API + '/crm/seguimientos/pendientes/todos')
    ])
    const clientes = await resCli.json()
    const pedidos = await resPed.json()
    const recordatorios = await resSeg.json()

    const hoy = new Date()
    const hace30 = new Date(hoy - 30 * 24 * 60 * 60 * 1000)
    const hace60 = new Date(hoy - 60 * 24 * 60 * 60 * 1000)
    const hace90 = new Date(hoy - 90 * 24 * 60 * 60 * 1000)

    const clientesEnriquecidos = clientes.map(c => {
      const pedidosCli = pedidos.filter(p => p.cliente_id === c.id && (p.status === 'confirmado' || p.status === 'pagado'))
      const totalGastado = pedidosCli.reduce((s, p) => s + parseFloat(p.total || 0), 0)
      const ultimoPedido = pedidosCli.length > 0 ? new Date(pedidosCli[0].created_at) : null
      const diasSinComprar = ultimoPedido ? Math.floor((hoy - ultimoPedido) / (1000 * 60 * 60 * 24)) : null
      const pedidos30 = pedidosCli.filter(p => new Date(p.created_at) >= hace30).length

      let segmento = 'nuevo'
      if (pedidosCli.length === 0) segmento = 'nuevo'
      else if (totalGastado >= 5000 && pedidos30 >= 1) segmento = 'vip'
      else if (diasSinComprar > 90) segmento = 'inactivo'
      else if (diasSinComprar > 30) segmento = 'riesgo'
      else if (pedidos30 >= 2) segmento = 'frecuente'
      else segmento = 'activo'

      return { ...c, totalGastado, ultimoPedido, diasSinComprar, pedidos30, segmento, totalPedidos: pedidosCli.length }
    })

    const vip = clientesEnriquecidos.filter(c => c.segmento === 'vip')
    const enRiesgo = clientesEnriquecidos.filter(c => c.segmento === 'riesgo').sort((a,b) => b.totalGastado - a.totalGastado)
    const inactivos = clientesEnriquecidos.filter(c => c.segmento === 'inactivo').sort((a,b) => b.totalGastado - a.totalGastado)
    const top10 = [...clientesEnriquecidos].sort((a,b) => b.totalGastado - a.totalGastado).slice(0,10)

    const ventasHoy = pedidos.filter(p => {
      const f = new Date(p.created_at)
      return f.toDateString() === hoy.toDateString() && (p.status === 'confirmado' || p.status === 'pagado')
    }).reduce((s,p) => s + parseFloat(p.total||0), 0)

    const ventas30 = pedidos.filter(p => new Date(p.created_at) >= hace30 && (p.status === 'confirmado' || p.status === 'pagado'))
      .reduce((s,p) => s + parseFloat(p.total||0), 0)

    content.innerHTML = `
      <div style="margin-bottom:1.5rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <div>
          <h2 style="font-size:1.2rem;font-weight:700;margin-bottom:4px">🎯 CRM — Centro de relaciones</h2>
          <p style="color:#888;font-size:0.85rem">Gestión completa de clientes y oportunidades</p>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-secondary" onclick="mostrarPipeline()">📊 Pipeline</button>
          <button class="btn btn-secondary" onclick="mostrarCampanas()">📣 Campañas</button>
          <button class="btn btn-primary" onclick="mostrarFormCliente()">+ Nuevo cliente</button>
        </div>
      </div>

      <!-- KPIs -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-bottom:1.5rem">
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:1.6rem;font-weight:700;color:#E91E8C">$${ventasHoy.toFixed(0)}</p>
          <p style="font-size:0.7rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Ventas hoy</p>
        </div>
        <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
          <p style="font-size:1.6rem;font-weight:700;color:#E91E8C">$${ventas30.toFixed(0)}</p>
          <p style="font-size:0.7rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Ventas 30 días</p>
        </div>
        <div style="background:#fff8e1;border-radius:12px;padding:1.25rem;border:1px solid #ffe082;text-align:center;cursor:pointer" onclick="mostrarSegmento('vip')">
          <p style="font-size:1.6rem;font-weight:700;color:#f57f17">${vip.length}</p>
          <p style="font-size:0.7rem;color:#f57f17;text-transform:uppercase;letter-spacing:0.5px">⭐ Clientes VIP</p>
        </div>
        <div style="background:#fff8e1;border-radius:12px;padding:1.25rem;border:1px solid #ffe082;text-align:center;cursor:pointer" onclick="mostrarSegmento('riesgo')">
          <p style="font-size:1.6rem;font-weight:700;color:#f57f17">${enRiesgo.length}</p>
          <p style="font-size:0.7rem;color:#f57f17;text-transform:uppercase;letter-spacing:0.5px">🟡 En riesgo</p>
        </div>
        <div style="background:#ffebee;border-radius:12px;padding:1.25rem;border:1px solid #ffcdd2;text-align:center;cursor:pointer" onclick="mostrarSegmento('inactivo')">
          <p style="font-size:1.6rem;font-weight:700;color:#c62828">${inactivos.length}</p>
          <p style="font-size:0.7rem;color:#c62828;text-transform:uppercase;letter-spacing:0.5px">🔴 Inactivos</p>
        </div>
        <div style="background:#e3f2fd;border-radius:12px;padding:1.25rem;border:1px solid #90caf9;text-align:center">
          <p style="font-size:1.6rem;font-weight:700;color:#1565c0">${recordatorios.length}</p>
          <p style="font-size:0.7rem;color:#1565c0;text-transform:uppercase;letter-spacing:0.5px">📅 Recordatorios</p>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">

        <!-- ALERTAS -->
        <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
          <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
            <p style="font-weight:700;font-size:0.9rem">🟡 Clientes en riesgo</p>
            <span style="font-size:0.75rem;color:#888">${enRiesgo.length} clientes</span>
          </div>
          ${enRiesgo.length === 0
            ? '<div style="padding:2rem;text-align:center;color:#888;font-size:0.85rem">Sin clientes en riesgo</div>'
            : enRiesgo.slice(0,5).map(c => `
              <div style="padding:0.75rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:12px;cursor:pointer"
                   onclick="verCliente('${c.id}')" onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='white'">
                <div style="width:36px;height:36px;border-radius:50%;background:#fff8e1;display:flex;align-items:center;justify-content:center;font-size:0.9rem;font-weight:700;color:#f57f17;flex-shrink:0">
                  ${c.nombre.charAt(0).toUpperCase()}
                </div>
                <div style="flex:1">
                  <p style="font-size:0.85rem;font-weight:600">${c.nombre}</p>
                  <p style="font-size:0.72rem;color:#888">Hace ${c.diasSinComprar} días sin comprar · $${c.totalGastado.toFixed(0)} total</p>
                </div>
                ${c.telefono ? `<a href="https://wa.me/${c.lada||'52'}${c.telefono.replace(/\D/g,'')}" target="_blank" onclick="event.stopPropagation()" style="background:#25D366;color:white;padding:4px 10px;border-radius:6px;font-size:0.72rem;text-decoration:none">WA</a>` : ''}
              </div>
            `).join('')}
        </div>

        <!-- RECORDATORIOS -->
        <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
          <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
            <p style="font-weight:700;font-size:0.9rem">📅 Recordatorios pendientes</p>
            <span style="font-size:0.75rem;color:#888">${recordatorios.length} pendientes</span>
          </div>
          ${recordatorios.length === 0
            ? '<div style="padding:2rem;text-align:center;color:#888;font-size:0.85rem">Sin recordatorios pendientes 🎉</div>'
            : recordatorios.slice(0,5).map(r => `
              <div style="padding:0.75rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:12px">
                <div style="flex:1">
                  <p style="font-size:0.85rem;font-weight:600">${r.clientes?.nombre || 'Cliente'}</p>
                  <p style="font-size:0.72rem;color:#888">${r.contenido.substring(0,50)}</p>
                  <p style="font-size:0.68rem;color:#f57f17">${new Date(r.fecha_recordatorio).toLocaleDateString('es-MX')}</p>
                </div>
                <button onclick="completarRecordatorio('${r.id}')" style="background:#e8f5e9;border:1px solid #a5d6a7;color:#2e7d32;border-radius:6px;padding:4px 10px;font-size:0.72rem;cursor:pointer">✓ Listo</button>
              </div>
            `).join('')}
        </div>
      </div>

      <!-- TOP CLIENTES -->
      <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden;margin-bottom:1rem">
        <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee">
          <p style="font-weight:700;font-size:0.9rem">⭐ Top 10 clientes por volumen</p>
        </div>
        ${top10.map((c, idx) => `
          <div style="padding:0.75rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:12px;cursor:pointer"
               onclick="verCliente('${c.id}')" onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='white'">
            <span style="font-size:0.85rem;font-weight:700;color:${idx < 3 ? '#f57f17' : '#aaa'};min-width:20px">${idx+1}</span>
            <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#E91E8C,#c4116a);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:0.9rem;flex-shrink:0">
              ${c.nombre.charAt(0).toUpperCase()}
            </div>
            <div style="flex:1">
              <p style="font-size:0.85rem;font-weight:600">${c.nombre}</p>
              <p style="font-size:0.72rem;color:#888">${c.totalPedidos} pedidos · ${c.diasSinComprar !== null ? 'Hace ' + c.diasSinComprar + ' días' : 'Sin pedidos'}</p>
            </div>
            <div style="text-align:right">
              <p style="font-weight:700;color:#E91E8C">$${c.totalGastado.toFixed(0)}</p>
              <span style="font-size:0.65rem;padding:2px 6px;border-radius:100px;background:${c.segmento==='vip'?'#fff8e1':c.segmento==='inactivo'?'#ffebee':'#e8f5e9'};color:${c.segmento==='vip'?'#f57f17':c.segmento==='inactivo'?'#c62828':'#2e7d32'}">${c.segmento}</span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- SEGMENTO DETALLE (oculto por default) -->
      <div id="crm-segmento-detalle" style="display:none"></div>
    `

    window._crmData = { clientes: clientesEnriquecidos, pedidos, recordatorios }

  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error cargando CRM: ' + e.message + '</p>'
  }
}

window.mostrarSegmento = (seg) => {
  const { clientes } = window._crmData || {}
  if (!clientes) return
  const filtrados = clientes.filter(c => c.segmento === seg).sort((a,b) => b.totalGastado - a.totalGastado)
  const nombres = { vip: '⭐ Clientes VIP', riesgo: '🟡 En riesgo', inactivo: '🔴 Inactivos', frecuente: '🟢 Frecuentes' }
  const div = document.getElementById('crm-segmento-detalle')
  div.style.display = 'block'
  div.innerHTML = `
    <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
      <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
        <p style="font-weight:700;font-size:0.9rem">${nombres[seg] || seg} (${filtrados.length})</p>
        <button onclick="document.getElementById('crm-segmento-detalle').style.display='none'" style="background:none;border:none;cursor:pointer;color:#888;font-size:1.2rem">✕</button>
      </div>
      ${filtrados.map(c => `
        <div style="padding:0.75rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:12px;cursor:pointer"
             onclick="verCliente('${c.id}')" onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='white'">
          <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#E91E8C,#c4116a);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:0.9rem;flex-shrink:0">
            ${c.nombre.charAt(0).toUpperCase()}
          </div>
          <div style="flex:1">
            <p style="font-size:0.85rem;font-weight:600">${c.nombre}</p>
            <p style="font-size:0.72rem;color:#888">$${c.totalGastado.toFixed(0)} · ${c.totalPedidos} pedidos · ${c.diasSinComprar !== null ? 'Hace ' + c.diasSinComprar + ' días' : 'Sin pedidos'}</p>
          </div>
          ${c.telefono ? `<a href="https://wa.me/${c.lada||'52'}${c.telefono.replace(/\D/g,'')}" target="_blank" onclick="event.stopPropagation()" style="background:#25D366;color:white;padding:4px 10px;border-radius:6px;font-size:0.72rem;text-decoration:none">WhatsApp</a>` : ''}
        </div>
      `).join('')}
    </div>
  `
  div.scrollIntoView({ behavior: 'smooth' })
}

window.completarRecordatorio = async (id) => {
  try {
    await fetch(API + '/crm/seguimientos/' + id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completado: true })
    })
    cargarCRM()
  } catch(e) {
    alert('Error al completar recordatorio')
  }
}

window.mostrarPipeline = async () => {
  const content = document.getElementById('content')
  content.innerHTML = '<p style="padding:2rem;color:#888">Cargando pipeline...</p>'
  try {
    const res = await fetch(API + '/crm/oportunidades')
    const oportunidades = await res.json()
    const etapas = [
      { id: 'contacto', label: '📞 Contacto', color: '#e3f2fd', colorText: '#1565c0' },
      { id: 'interes', label: '👀 Interés', color: '#f3e5f5', colorText: '#6a1b9a' },
      { id: 'cotizacion', label: '📋 Cotización', color: '#fff8e1', colorText: '#f57f17' },
      { id: 'negociacion', label: '🤝 Negociación', color: '#fce4f3', colorText: '#E91E8C' },
      { id: 'ganado', label: '✅ Ganado', color: '#e8f5e9', colorText: '#2e7d32' },
      { id: 'perdido', label: '❌ Perdido', color: '#ffebee', colorText: '#c62828' }
    ]
    content.innerHTML = `
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap">
        <button class="btn btn-secondary" onclick="cargarCRM()">← Volver al CRM</button>
        <h2 style="flex:1;font-size:1.1rem;font-weight:700">📊 Pipeline de oportunidades</h2>
        <button class="btn btn-primary" onclick="nuevaOportunidad()">+ Nueva oportunidad</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px">
        ${etapas.map(etapa => {
          const ops = oportunidades.filter(o => o.etapa === etapa.id)
          const total = ops.reduce((s,o) => s + parseFloat(o.monto_estimado||0), 0)
          return `
            <div style="background:${etapa.color};border-radius:12px;padding:1rem;border:1px solid ${etapa.colorText}30">
              <p style="font-weight:700;font-size:0.85rem;color:${etapa.colorText};margin-bottom:4px">${etapa.label}</p>
              <p style="font-size:0.72rem;color:${etapa.colorText};margin-bottom:12px">${ops.length} ops · $${total.toFixed(0)}</p>
              ${ops.map(o => `
                <div style="background:white;border-radius:8px;padding:10px;margin-bottom:8px;border:1px solid #eee;cursor:pointer"
                     onclick="verOportunidad('${o.id}')">
                  <p style="font-size:0.82rem;font-weight:600;margin-bottom:2px">${o.titulo}</p>
                  <p style="font-size:0.72rem;color:#888">${o.clientes?.nombre || '—'}</p>
                  <p style="font-size:0.82rem;font-weight:700;color:#E91E8C;margin-top:4px">$${parseFloat(o.monto_estimado||0).toFixed(0)}</p>
                </div>
              `).join('')}
            </div>
          `
        }).join('')}
      </div>
    `
  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error cargando pipeline</p>'
  }
}

window.nuevaOportunidad = () => {
  const modal = document.createElement('div')
  modal.id = 'modal-oportunidad'
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem'
  modal.innerHTML = `
    <div style="background:white;border-radius:16px;padding:2rem;max-width:500px;width:100%;max-height:90vh;overflow-y:auto">
      <h3 style="margin-bottom:1.5rem">Nueva oportunidad</h3>
      <div style="display:flex;flex-direction:column;gap:1rem">
        <div>
          <label class="form-label">Título</label>
          <input class="form-input" id="op-titulo" placeholder="Ej: Pedido mayoreo sandalias">
        </div>
        <div>
          <label class="form-label">Cliente</label>
          <input class="form-input" id="op-cliente-buscar" placeholder="Buscar cliente..." oninput="buscarClienteOportunidad(this.value)">
          <div id="op-cliente-resultados" style="border:1px solid #ddd;border-radius:6px;max-height:150px;overflow-y:auto;display:none;background:white;margin-top:4px"></div>
          <input type="hidden" id="op-cliente-id">
        </div>
        <div>
          <label class="form-label">Monto estimado ($)</label>
          <input class="form-input" id="op-monto" type="number" placeholder="0.00">
        </div>
        <div>
          <label class="form-label">Etapa</label>
          <select class="form-input" id="op-etapa">
            <option value="contacto">📞 Contacto</option>
            <option value="interes">👀 Interés</option>
            <option value="cotizacion">📋 Cotización</option>
            <option value="negociacion">🤝 Negociación</option>
            <option value="ganado">✅ Ganado</option>
            <option value="perdido">❌ Perdido</option>
          </select>
        </div>
        <div>
          <label class="form-label">Fecha de cierre estimada</label>
          <input class="form-input" id="op-fecha" type="date">
        </div>
        <div>
          <label class="form-label">Notas</label>
          <textarea class="form-input" id="op-notas" rows="3" placeholder="Detalles de la oportunidad..."></textarea>
        </div>
      </div>
      <div style="display:flex;gap:1rem;margin-top:1.5rem;justify-content:flex-end">
        <button class="btn btn-secondary" onclick="document.getElementById('modal-oportunidad').remove()">Cancelar</button>
        <button class="btn btn-primary" onclick="guardarOportunidad()">Guardar</button>
      </div>
    </div>
  `
  document.body.appendChild(modal)
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove() })
}

window.buscarClienteOportunidad = (texto) => {
  const { clientes } = window._crmData || {}
  if (!clientes) return
  const res = document.getElementById('op-cliente-resultados')
  if (!texto || texto.length < 2) { res.style.display = 'none'; return }
  const filtrados = clientes.filter(c => c.nombre.toLowerCase().includes(texto.toLowerCase())).slice(0, 5)
  if (!filtrados.length) { res.style.display = 'none'; return }
  res.style.display = 'block'
  res.innerHTML = filtrados.map(c => `
    <div onclick="seleccionarClienteOportunidad('${c.id}', '${c.nombre}')"
         style="padding:8px 12px;cursor:pointer;border-bottom:1px solid #f5f5f5;font-size:0.85rem"
         onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
      ${c.nombre}
    </div>
  `).join('')
}


window.seleccionarClienteOportunidad = (id, nombre) => {
  document.getElementById('op-cliente-id').value = id
  document.getElementById('op-cliente-buscar').value = nombre
  document.getElementById('op-cliente-resultados').style.display = 'none'
}

window.guardarOportunidad = async () => {
  const titulo = document.getElementById('op-titulo').value
  const clienteId = document.getElementById('op-cliente-id').value
  const monto = document.getElementById('op-monto').value
  const etapa = document.getElementById('op-etapa').value
  const fecha = document.getElementById('op-fecha').value
  const notas = document.getElementById('op-notas').value
  if (!titulo) { alert('El título es requerido'); return }
  try {
    await fetch(API + '/crm/oportunidades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo, cliente_id: clienteId || null, monto_estimado: parseFloat(monto)||0, etapa, fecha_cierre_estimada: fecha || null, notas })
    })
    document.getElementById('modal-oportunidad').remove()
    mostrarPipeline()
  } catch(e) {
    alert('Error guardando oportunidad')
  }
}

async function cargarProductos(categoriaFiltro, mostrarInactivos = false) {
  const content = document.getElementById('content')
  try {
    const res = await fetch(API + '/productos/')
    const data = await res.json()
    const activos = data.filter(p => p.activo)
    const inactivos = data.filter(p => !p.activo)
    const base = mostrarInactivos ? inactivos : activos
console.log('mostrarInactivos:', mostrarInactivos, 'base:', base.length, 'inactivos:', inactivos.length)
    const categorias = [...new Set(activos.map(p => p.categoria).filter(Boolean))]
    const filtrados = categoriaFiltro ? base.filter(p => p.categoria === categoriaFiltro) : base

    content.innerHTML = `
      <div style="margin-bottom:1rem;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <button class="btn ${!mostrarInactivos && !categoriaFiltro ? 'btn-primary' : 'btn-secondary'}" onclick="window.cargarProductos(null, false)">
          ✅ Activos (${activos.length})
        </button>
        ${categorias.map(c => `
          <button class="btn ${!mostrarInactivos && categoriaFiltro === c ? 'btn-primary' : 'btn-secondary'}" onclick="window.cargarProductos('${c}', false)">
            ${c.charAt(0).toUpperCase() + c.slice(1)} (${activos.filter(p => p.categoria === c).length})
          </button>
        `).join('')}
        <button class="btn ${mostrarInactivos ? 'btn-primary' : 'btn-secondary'}" style="${mostrarInactivos ? '' : 'color:#c62828;border-color:#c62828'}" onclick="window.cargarProductos(null, true)">
          ❌ Desactivados (${inactivos.length})
        </button>
      </div>
      <div class="table-card">
        <div class="table-header">
          <h3>${mostrarInactivos ? 'Productos desactivados' : categoriaFiltro ? categoriaFiltro.charAt(0).toUpperCase() + categoriaFiltro.slice(1) : 'Productos activos'} (${filtrados.length})</h3>
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
                      ? `<img src="${p.imagen_principal}" style="width:44px;height:44px;object-fit:contain;background:#f5f5f5;border-radius:6px;border:1px solid #eee;flex-shrink:0">`
                      : `<div style="width:44px;height:44px;background:#f5f5f5;border-radius:6px;flex-shrink:0;display:flex;align-items:center;justify-content:center;color:#ccc;font-size:1.2rem">?</div>`}
                    <strong>${p.nombre}</strong>
                  </td>
                  <td><small style="color:#888">${p.sku_interno || '—'}</small></td>
                  <td>${p.categoria || '—'}</td>
                  <td>$${p.precio_menudeo}</td>
                  <td><span class="badge ${p.activo ? 'badge-success' : 'badge-danger'}">${p.activo ? 'Activo' : 'Inactivo'}</span></td>
                  <td style="display:flex;gap:4px;flex-wrap:wrap">
                    <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="editarProducto('${p.id}')">Editar</button>
                    <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="gestionarColores('${p.id}','${(p.nombre||'').replace(/'/g,'')}')">🎨 Colores</button>
                    <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="duplicarProducto('${p.id}')">Duplicar</button>
                    <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem;color:${p.activo ? '#c62828' : '#2e7d32'};border-color:${p.activo ? '#c62828' : '#2e7d32'}" onclick="toggleProducto('${p.id}', ${p.activo})">${p.activo ? 'Desactivar' : 'Activar'}</button>
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
window.cargarProductos = cargarProductos
window.mostrarCampanas = async () => {
  const content = document.getElementById('content')
  content.innerHTML = '<p style="padding:2rem;color:#888">Cargando campañas...</p>'
  
  try {
    const [resCli, resPed] = await Promise.all([
      fetch(API + '/clientes/'),
      fetch(API + '/pedidos/')
    ])
    const clientes = await resCli.json()
    const pedidos = await resPed.json()

    const hoy = new Date()
    const hace30 = new Date(hoy - 30 * 24 * 60 * 60 * 1000)
    const hace90 = new Date(hoy - 90 * 24 * 60 * 60 * 1000)

    const clientesEnriquecidos = clientes.map(c => {
      const pedidosCli = pedidos.filter(p => p.cliente_id === c.id && (p.status === 'confirmado' || p.status === 'pagado'))
      const totalGastado = pedidosCli.reduce((s, p) => s + parseFloat(p.total || 0), 0)
      const ultimoPedido = pedidosCli.length > 0 ? new Date(pedidosCli[0].created_at) : null
      const diasSinComprar = ultimoPedido ? Math.floor((hoy - ultimoPedido) / (1000 * 60 * 60 * 24)) : null
      const pedidos30 = pedidosCli.filter(p => new Date(p.created_at) >= hace30).length
      let segmento = 'nuevo'
      if (pedidosCli.length === 0) segmento = 'nuevo'
      else if (totalGastado >= 5000 && pedidos30 >= 1) segmento = 'vip'
      else if (diasSinComprar > 90) segmento = 'inactivo'
      else if (diasSinComprar > 30) segmento = 'riesgo'
      else if (pedidos30 >= 2) segmento = 'frecuente'
      else segmento = 'activo'
      return { ...c, totalGastado, diasSinComprar, segmento }
    }).filter(c => c.telefono)

    window._campanaClientes = clientesEnriquecidos

    const PLANTILLAS = [
      {
        id: 'catalogo',
        nombre: '👠 Catálogo completo',
        descripcion: 'Envía el catálogo completo de productos',
        mensaje: (nombre) => `Hola ${nombre}! 👋\n\nTe compartimos nuestro catálogo completo de calzado para dama.\n\n✨ Encuentra tacones, sandalias, botas, botines y más.\n\n🛍️ Ver catálogo completo:\nhttps://zapatillasmay.mx/#catalogo\n\nCualquier pregunta con gusto te atendemos 😊`
      },
      {
        id: 'nuevos',
        nombre: '🆕 Nuevos modelos',
        descripcion: 'Envía los últimos modelos agregados',
        mensaje: (nombre) => `¡Hola ${nombre}! 👋\n\n¡Llegaron nuevos modelos a Zapatillas May! 👠✨\n\n¿Te interesa? Con gusto te damos más información y tallas disponibles.\n\n¡Escríbenos para hacer tu pedido! 🛍️`
      },
      {
        id: 'mayoreo',
        nombre: '📦 Precios mayoreo',
        descripcion: 'Envía información de precios mayoreo',
        mensaje: (nombre) => `Hola ${nombre}! 👋\n\nTe recordamos nuestros precios de mayoreo:\n\n📦 3-5 pares variados: -$80 por par\n📦 6+ pares variados: -$150 por par\n📦 Corrida completa: -$180 por par\n\n🛍️ Ver catálogo:\nhttps://zapatillasmay.mx/#catalogo\n\n¿Te interesa hacer un pedido? Con gusto te atendemos 😊`
      },
      {
        id: 'tacones',
        nombre: '👡 Catálogo tacones',
        descripcion: 'Envía solo la categoría de tacones',
        mensaje: (nombre) => `Hola ${nombre}! 👋\n\nMira nuestra colección de tacones para dama.\n\n👡 Ver tacones:\nhttps://zapatillasmay.mx/#categoria/tacones\n\n¿Te gusta alguno? Con gusto te damos más información 😊`
      },
      {
        id: 'sandalias',
        nombre: '🩴 Catálogo sandalias',
        descripcion: 'Envía solo la categoría de sandalias',
        mensaje: (nombre) => `Hola ${nombre}! 👋\n\nMira nuestra colección de sandalias para dama.\n\n🩴 Ver sandalias:\nhttps://zapatillasmay.mx/#categoria/sandalias\n\n¿Te gusta alguna? Con gusto te damos más información 😊`
      },
      {
        id: 'seguimiento',
        nombre: '💬 Seguimiento cliente',
        descripcion: 'Mensaje de seguimiento para clientes inactivos',
        mensaje: (nombre) => `Hola ${nombre}! 👋\n\n¿Cómo estás? Hace tiempo que no sabemos de ti.\n\nTenemos modelos nuevos que te pueden interesar 👠\n\n🛍️ Ver novedades:\nhttps://zapatillasmay.mx/#nuevos\n\n¿Te puedo mostrar algo en especial? 😊`
      },
      {
        id: 'personalizado',
        nombre: '✏️ Mensaje personalizado',
        descripcion: 'Escribe tu propio mensaje',
        mensaje: (nombre) => `Hola ${nombre}! 👋\n\n`
      }
    ]

    const SEGMENTOS = [
      { id: 'todos', label: 'Todos los clientes', count: clientesEnriquecidos.length },
      { id: 'vip', label: '⭐ VIP', count: clientesEnriquecidos.filter(c=>c.segmento==='vip').length },
      { id: 'frecuente', label: '🟢 Frecuentes', count: clientesEnriquecidos.filter(c=>c.segmento==='frecuente').length },
      { id: 'riesgo', label: '🟡 En riesgo', count: clientesEnriquecidos.filter(c=>c.segmento==='riesgo').length },
      { id: 'inactivo', label: '🔴 Inactivos', count: clientesEnriquecidos.filter(c=>c.segmento==='inactivo').length },
      { id: 'mayoreo', label: '📦 Mayoreo', count: clientesEnriquecidos.filter(c=>c.tipo==='mayoreo').length },
      { id: 'zapateria', label: '🏪 Corridas', count: clientesEnriquecidos.filter(c=>c.tipo==='zapateria').length },
      { id: 'menudeo', label: '🛍️ Menudeo', count: clientesEnriquecidos.filter(c=>c.tipo==='menudeo').length },
    ]

    content.innerHTML = `
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap">
        <button class="btn btn-secondary" onclick="navegarA('crm')">← Volver al CRM</button>
        <div>
          <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:2px">📣 Campañas de WhatsApp</h2>
          <p style="font-size:0.82rem;color:#888">Envía fotos de nuevos modelos a tus clientes de mayoreo</p>
        </div>
      </div>

      <!-- CONEXIÓN WHATSAPP BUSINESS -->
      <div id="wa-conexion-card" style="background:white;border-radius:12px;border:1px solid #eee;padding:1.25rem;margin-bottom:1.5rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap">
        <div style="flex:1;min-width:200px">
          <p style="font-weight:700;font-size:0.9rem;margin-bottom:2px">📱 WhatsApp Business</p>
          <p id="wa-estado-texto" style="font-size:0.8rem;color:#888">Verificando conexión...</p>
        </div>
        <div id="wa-estado-badge" style="padding:4px 12px;border-radius:100px;font-size:0.75rem;font-weight:600;background:#f5f5f5;color:#888">
          ⏳ Cargando
        </div>
        <button id="wa-btn-conectar" onclick="mostrarQRWhatsApp()" class="btn btn-primary" style="display:none">
          Conectar con QR
        </button>
        <button id="wa-btn-desconectar" onclick="desconectarWhatsApp()" class="btn btn-secondary" style="display:none;font-size:0.78rem">
          Desconectar
        </button>
        <button onclick="forzarReconexionWA()" class="btn btn-secondary" style="font-size:0.78rem;background:#ff6b35;color:white;border-color:#ff6b35">
          🔄 Forzar reconexión
        </button>
      </div>

      <!-- QR MODAL -->
      <div id="wa-qr-panel" style="display:none;background:#f8f8f8;border:2px dashed #E91E8C;border-radius:12px;padding:1.5rem;margin-bottom:1.5rem;text-align:center">
        <p style="font-weight:700;margin-bottom:0.5rem">Escanea este QR con tu WhatsApp Business</p>
        <p style="font-size:0.8rem;color:#888;margin-bottom:1rem">Abre WhatsApp → Dispositivos vinculados → Vincular dispositivo</p>
        <div id="wa-qr-img" style="display:inline-block;background:white;padding:12px;border-radius:8px;border:1px solid #eee">
          <p style="color:#888;font-size:0.85rem;padding:2rem">Cargando QR...</p>
        </div>
        <p style="font-size:0.75rem;color:#aaa;margin-top:0.75rem">El QR expira en ~60 segundos. Si expira, haz clic en "Conectar con QR" de nuevo.</p>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem">

        <!-- CONFIGURACIÓN -->
        <div>
          <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem;margin-bottom:1rem">
            <p style="font-weight:700;font-size:0.9rem;margin-bottom:1rem">1️⃣ Selecciona el segmento</p>
            <div style="display:flex;flex-direction:column;gap:8px">
              ${SEGMENTOS.map(s => `
                <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:8px 12px;border-radius:8px;border:2px solid #eee;transition:all 0.15s"
                       onmouseover="this.style.borderColor='#E91E8C'" onmouseout="if(!document.getElementById('seg-${s.id}').checked)this.style.borderColor='#eee'">
                  <input type="radio" name="campana-segmento" id="seg-${s.id}" value="${s.id}" ${s.id==='todos'?'checked':''} 
                         onchange="actualizarVistaCampana()" style="accent-color:#E91E8C">
                  <span style="flex:1;font-size:0.85rem;font-weight:500">${s.label}</span>
                  <span style="font-size:0.75rem;color:#888;background:#f5f5f5;padding:2px 8px;border-radius:100px">${s.count}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem;margin-bottom:1rem">
            <p style="font-weight:700;font-size:0.9rem;margin-bottom:4px">2️⃣ Foto <span style="font-weight:400;color:#aaa;font-size:0.78rem">(opcional)</span></p>

            <div id="campana-foto-manual">
              <p style="font-size:0.75rem;color:#999;margin-bottom:0.875rem">Selecciona un producto para adjuntar su foto</p>
              <div style="display:flex;gap:8px;margin-bottom:0.75rem">
                <select id="campana-producto-sel" class="form-input" style="flex:1;font-size:0.82rem"
                  onchange="seleccionarProductoCampana(this.value)">
                  <option value="">— Sin foto —</option>
                </select>
                <button type="button" onclick="cargarProductosCampana()" title="Recargar productos"
                  style="padding:6px 10px;border:1px solid #eee;border-radius:8px;background:white;cursor:pointer;font-size:0.85rem">↺</button>
              </div>
              <div id="campana-foto-preview" style="display:none;border-radius:10px;overflow:hidden;border:1px solid #eee;max-height:140px;position:relative">
                <img id="campana-foto-img" src="" style="width:100%;height:140px;object-fit:cover">
                <button onclick="quitarFotoCampana()"
                  style="position:absolute;top:6px;right:6px;background:rgba(0,0,0,0.55);color:white;border:none;border-radius:50%;width:24px;height:24px;cursor:pointer;font-size:0.75rem;display:flex;align-items:center;justify-content:center">✕</button>
              </div>
            </div>

            <div id="campana-fotos-nuevos" style="display:none">
              <p style="font-size:0.75rem;color:#999;margin-bottom:6px">Busca y elige el modelo, luego selecciona los colores</p>
              <input type="text" id="campana-nuevo-buscar" placeholder="🔍 Buscar modelo..."
                oninput="filtrarModelosCampana(this.value)"
                style="width:100%;padding:7px 10px;border:1.5px solid #eee;border-radius:8px;font-size:0.82rem;font-family:inherit;outline:none;box-sizing:border-box;margin-bottom:6px">
              <div id="campana-modelos-lista"
                style="max-height:150px;overflow-y:auto;border:1px solid #eee;border-radius:8px;margin-bottom:10px">
                <p style="padding:10px 12px;font-size:0.8rem;color:#aaa">Cargando modelos...</p>
              </div>
              <div id="campana-fotos-nuevos-grid" style="display:flex;flex-direction:column;gap:6px"></div>
              <p id="campana-fotos-count" style="font-size:0.75rem;color:#E91E8C;margin-top:8px;font-weight:600"></p>
            </div>

          </div>

          <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem">
            <p style="font-weight:700;font-size:0.9rem;margin-bottom:1rem">3️⃣ Selecciona la plantilla</p>
            <div style="display:flex;flex-direction:column;gap:8px">
              ${PLANTILLAS.map(p => `
                <label style="cursor:pointer;padding:10px 12px;border-radius:8px;border:2px solid #eee;transition:all 0.15s"
                       onmouseover="this.style.borderColor='#E91E8C'" onmouseout="if(!document.getElementById('plt-${p.id}').checked)this.style.borderColor='#eee'">
                  <div style="display:flex;align-items:center;gap:8px">
                    <input type="radio" name="campana-plantilla" id="plt-${p.id}" value="${p.id}" ${p.id==='catalogo'?'checked':''}
                           onchange="actualizarVistaCampana()" style="accent-color:#E91E8C">
                    <div>
                      <p style="font-size:0.85rem;font-weight:600">${p.nombre}</p>
                      <p style="font-size:0.72rem;color:#888">${p.descripcion}</p>
                    </div>
                  </div>
                </label>
              `).join('')}
            </div>
            <div id="mensaje-personalizado" style="display:none;margin-top:1rem">
              <label class="form-label">Tu mensaje (usa {nombre} para personalizar)</label>
              <textarea class="form-input" id="texto-personalizado" rows="5" placeholder="Hola {nombre}! ..."
                        oninput="actualizarVistaCampana()">Hola {nombre}! 👋\n\n</textarea>
            </div>
          </div>
        </div>

        <!-- VISTA PREVIA Y LISTA -->
        <div>
          <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem;margin-bottom:1rem">
            <p style="font-weight:700;font-size:0.9rem;margin-bottom:1rem">4️⃣ Vista previa del mensaje</p>
            <div id="mensaje-preview" style="background:#e8f5e9;border-radius:10px;padding:1rem;font-size:0.82rem;color:#333;white-space:pre-wrap;line-height:1.6;border:1px solid #a5d6a7;max-height:200px;overflow-y:auto"></div>
          </div>

          <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
            <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
              <div style="display:flex;align-items:center;gap:10px">
                <p style="font-weight:700;font-size:0.9rem">5️⃣ Enviar a clientes</p>
                <span id="campana-count" style="font-size:0.75rem;color:#888;background:#f5f5f5;padding:2px 8px;border-radius:100px"></span>
              </div>
              <div style="display:flex;align-items:center;gap:8px">
                <label style="font-size:0.78rem;color:#666;cursor:pointer;display:flex;align-items:center;gap:5px">
                  <input type="checkbox" id="campana-sel-todos" onchange="toggleSeleccionarTodosCampana(this.checked)" style="accent-color:#E91E8C">
                  Todos
                </label>
                <button id="btn-campana-seleccionados" onclick="iniciarCampanaSeleccionados()"
                  style="background:#555;color:white;border:none;border-radius:8px;padding:6px 12px;font-size:0.75rem;font-weight:600;cursor:pointer;display:none;gap:4px;align-items:center">
                  💬 Manual (<span id="campana-sel-count">0</span>)
                </button>
                <button id="btn-campana-auto" onclick="enviarCampanaAutomatica()"
                  style="background:#E91E8C;color:white;border:none;border-radius:8px;padding:6px 14px;font-size:0.78rem;font-weight:600;cursor:pointer;display:none;gap:4px;align-items:center">
                  🤖 Enviar solos (<span id="campana-sel-count-auto">0</span>)
                </button>
              </div>
            </div>
            <div style="padding:0.75rem 1.5rem;border-bottom:1px solid #f0f0f0">
              <input type="text" id="campana-buscador" placeholder="🔍 Buscar cliente..." oninput="filtrarClientesCampana(this.value)"
                style="width:100%;padding:7px 12px;border:1px solid #eee;border-radius:8px;font-size:0.82rem;font-family:inherit;outline:none;box-sizing:border-box">
            </div>
            <div id="campana-lista" style="max-height:400px;overflow-y:auto"></div>
          </div>
        </div>
      </div>
    `

    window._plantillasCampana = PLANTILLAS
    window._campanaImagenUrl = ''
    actualizarVistaCampana()
    cargarProductosCampana()
    verificarEstadoWA()

  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error cargando campañas</p>'
  }
}

// ── WhatsApp Business (Evolution API) ─────────────────────────
window._waEstadoInterval = null

window.verificarEstadoWA = async () => {
  try {
    const res = await fetch(API + '/campanas/wa-estado')
    const data = await res.json()
    const badge = document.getElementById('wa-estado-badge')
    const texto = document.getElementById('wa-estado-texto')
    const btnConectar = document.getElementById('wa-btn-conectar')
    const btnDesconectar = document.getElementById('wa-btn-desconectar')
    if (!badge) return data.conectado

    if (data.conectado) {
      badge.style.background = '#e8f5e9'
      badge.style.color = '#2e7d32'
      badge.textContent = '✅ Conectado'
      texto.textContent = 'WhatsApp Business conectado y listo para enviar'
      btnConectar.style.display = 'none'
      btnDesconectar.style.display = 'inline-flex'
      document.getElementById('wa-qr-panel').style.display = 'none'
      if (window._waEstadoInterval) { clearInterval(window._waEstadoInterval); window._waEstadoInterval = null }
    } else {
      badge.style.background = '#ffebee'
      badge.style.color = '#c62828'
      const esSesionCaida = data.detalle && data.detalle.includes('caída')
      badge.textContent = esSesionCaida ? '⚠️ Sesión caída' : '🔴 Desconectado'
      texto.textContent = data.detalle || 'Conecta tu WhatsApp Business para enviar campañas automáticas'
      btnConectar.style.display = 'inline-flex'
      btnDesconectar.style.display = 'none'
      // Si la sesión está caída, mostrar aviso y botón prominente
      if (esSesionCaida) {
        badge.style.background = '#fff3e0'
        badge.style.color = '#e65100'
        const qrPanel = document.getElementById('wa-qr-panel')
        if (qrPanel && qrPanel.style.display === 'none') {
          qrPanel.style.display = 'block'
          document.getElementById('wa-qr-img').innerHTML = `
            <div style="padding:1.5rem;text-align:center">
              <p style="font-size:0.9rem;font-weight:700;color:#e65100;margin-bottom:0.5rem">⚠️ WhatsApp desconectado</p>
              <p style="font-size:0.8rem;color:#666;margin-bottom:1rem">La sesión se cerró. Necesitas reconectar.</p>
              <p style="font-size:0.8rem;color:#555;margin-bottom:1rem">1️⃣ Abre <strong>INICIAR ERP.bat</strong> en tu escritorio<br>2️⃣ Espera que Railway actualice (~2 min)<br>3️⃣ Haz clic en <strong>"Conectar con QR"</strong></p>
            </div>`
        }
      }
    }
    return data.conectado
  } catch(e) {
    const badge = document.getElementById('wa-estado-badge')
    if (badge) { badge.style.background='#fff8e1'; badge.style.color='#f57f17'; badge.textContent='⚠️ Sin conexión al servidor' }
    return false
  }
}

window.forzarReconexionWA = async () => {
  const panel = document.getElementById('wa-qr-panel')
  const qrDiv = document.getElementById('wa-qr-img')
  if (!panel || !qrDiv) return
  panel.style.display = 'block'
  qrDiv.innerHTML = '<p style="color:#888;font-size:0.85rem;padding:2rem">⏳ Desconectando sesión anterior y generando QR...<br><small>Esto puede tardar hasta 20 segundos</small></p>'
  try {
    const res = await fetch(API + '/campanas/wa-reiniciar', { method: 'POST' })
    const data = await res.json()
    if (data.qr) {
      const src = data.qr.startsWith('data:') ? data.qr : 'data:image/png;base64,' + data.qr
      qrDiv.innerHTML = `
        <p style="color:#2e7d32;font-size:0.82rem;margin-bottom:8px">✅ Escanea este QR con WhatsApp en tu celular</p>
        <img src="${src}" style="width:220px;height:220px;display:block;margin:0 auto">
        <p style="color:#888;font-size:0.75rem;margin-top:8px">El QR expira en ~20 segundos. Si expira, vuelve a hacer clic.</p>`
      if (window._waEstadoInterval) clearInterval(window._waEstadoInterval)
      window._waEstadoInterval = setInterval(async () => {
        const conectado = await verificarEstadoWA()
        if (conectado) {
          clearInterval(window._waEstadoInterval)
          panel.style.display = 'none'
        }
      }, 4000)
    } else if (data.nota) {
      // La instancia reconectó sola
      qrDiv.innerHTML = `<p style="color:#1565c0;font-size:0.82rem;padding:1rem">ℹ️ ${data.nota}<br>Intenta enviar un mensaje de prueba.</p>`
      verificarEstadoWA()
    } else {
      // No se obtuvo QR — mostrar error detallado
      const errMsg = data.qr_err || data.logout_err || 'No se pudo obtener QR'
      qrDiv.innerHTML = `
        <p style="color:#c62828;font-size:0.82rem;padding:1rem">
          ❌ ${errMsg.replace(/\n/g, '<br>')}
        </p>
        <button onclick="mostrarQRWhatsApp()" style="margin:0.5rem;padding:0.4rem 1rem;background:#E91E8C;color:white;border:none;border-radius:6px;cursor:pointer">
          🔄 Intentar obtener QR de nuevo
        </button>`
    }
  } catch(e) {
    qrDiv.innerHTML = `<p style="color:red;font-size:0.8rem;padding:1rem">Error de conexión: ${e.message}<br><small>Verifica que el servidor local esté corriendo.</small></p>`
  }
}

window.mostrarQRWhatsApp = async () => {
  const panel = document.getElementById('wa-qr-panel')
  const qrDiv = document.getElementById('wa-qr-img')
  if (!panel || !qrDiv) return
  panel.style.display = 'block'
  qrDiv.innerHTML = '<p style="color:#888;font-size:0.85rem;padding:2rem">Cargando QR...</p>'
  try {
    const res = await fetch(API + '/campanas/wa-qr')
    const data = await res.json()
    if (data.qr) {
      const src = data.qr.startsWith('data:') ? data.qr : 'data:image/png;base64,' + data.qr
      qrDiv.innerHTML = `<img src="${src}" style="width:220px;height:220px;display:block">`
      // Pooling para detectar conexión exitosa
      if (window._waEstadoInterval) clearInterval(window._waEstadoInterval)
      window._waEstadoInterval = setInterval(async () => {
        const conectado = await window.verificarEstadoWA()
        if (conectado) clearInterval(window._waEstadoInterval)
      }, 4000)
    } else {
      qrDiv.innerHTML = `<p style="color:red;font-size:0.8rem;padding:1rem">Error: ${data.error || 'No se obtuvo QR'}</p>`
    }
  } catch(e) {
    qrDiv.innerHTML = `<p style="color:red;font-size:0.8rem;padding:1rem">Error: ${e.message}</p>`
  }
}

window.desconectarWhatsApp = async () => {
  if (!confirm('¿Desconectar WhatsApp Business?')) return
  await fetch(API + '/campanas/wa-desconectar', { method: 'POST' })
  verificarEstadoWA()
}

// verificarEstadoWA se llama desde mostrarCampanas() cuando el DOM ya existe

window.actualizarVistaCampana = () => {
  const segmento = document.querySelector('input[name="campana-segmento"]:checked')?.value || 'todos'
  const plantillaId = document.querySelector('input[name="campana-plantilla"]:checked')?.value || 'catalogo'
  const plantilla = window._plantillasCampana?.find(p => p.id === plantillaId)
  const clientes = window._campanaClientes || []

  // Mostrar/ocultar textarea personalizado
  const divPersonalizado = document.getElementById('mensaje-personalizado')
  if (divPersonalizado) divPersonalizado.style.display = plantillaId === 'personalizado' ? 'block' : 'none'

  // Filtrar clientes por segmento
  let filtrados = clientes
  if (segmento !== 'todos') {
    if (['menudeo','mayoreo','zapateria'].includes(segmento)) {
      filtrados = clientes.filter(c => c.tipo === segmento)
    } else {
      filtrados = clientes.filter(c => c.segmento === segmento)
    }
  }

  // Si es nuevos modelos, cargar fotos automáticamente
  if (plantillaId === 'nuevos') {
    cargarFotosNuevosModelos()
  }
  const divFotoManual = document.getElementById('campana-foto-manual')
  if (divFotoManual) divFotoManual.style.display = plantillaId === 'nuevos' ? 'none' : 'block'
  const divFotosNuevos = document.getElementById('campana-fotos-nuevos')
  if (divFotosNuevos) divFotosNuevos.style.display = plantillaId === 'nuevos' ? 'block' : 'none'

  // Vista previa del mensaje
  const preview = document.getElementById('mensaje-preview')
  if (preview) {
    if (plantillaId === 'catalogo_interactivo') {
      preview.style.background = '#e3f2fd'
      preview.style.borderColor = '#90caf9'
      preview.style.color = '#1565c0'
      preview.textContent = '🛍️ Los productos seleccionados se enviarán como tarjetas interactivas en WhatsApp.\n\nEl cliente puede ver cada modelo, elegir talla/color y hacer su pedido directamente desde el chat.\n\n⚠️ Requiere que los productos estén en el catálogo de Meta Commerce.'
    } else {
      preview.style.background = '#e8f5e9'
      preview.style.borderColor = '#a5d6a7'
      preview.style.color = '#333'
      if (plantilla) {
        let msgPreview
        if (plantillaId === 'personalizado') {
          const texto = document.getElementById('texto-personalizado')?.value || ''
          msgPreview = texto.replace('{nombre}', 'María')
        } else {
          msgPreview = plantilla.mensaje('María')
        }
        preview.textContent = msgPreview
      }
    }
  }

  // Contador
  const count = document.getElementById('campana-count')
  if (count) count.textContent = filtrados.length + ' clientes'

  // Lista de clientes con botón de WhatsApp
  const lista = document.getElementById('campana-lista')
  if (!lista) return

  if (!filtrados.length) {
    lista.innerHTML = '<div style="padding:2rem;text-align:center;color:#888;font-size:0.85rem">No hay clientes en este segmento con teléfono registrado</div>'
    return
  }

  window._campanaFiltrados = filtrados
  window._campanaPlantillaId = plantillaId

  lista.innerHTML = filtrados.map((c, idx) => {
    let mensaje
    if (plantillaId === 'personalizado') {
      const texto = document.getElementById('texto-personalizado')?.value || ''
      mensaje = texto.replace('{nombre}', c.nombre.split(' ')[0])
    } else {
      mensaje = plantilla.mensaje(c.nombre.split(' ')[0])
    }
    const msgEncoded = encodeURIComponent(mensaje)
    const tel = (c.lada || '52') + c.telefono.replace(/\D/g,'')
    return `
      <div class="campana-cli-row" data-idx="${idx}" style="padding:0.75rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:12px;transition:background 0.15s">
        <input type="checkbox" class="campana-cli-check" data-idx="${idx}"
          onchange="actualizarContadorCampana()"
          style="accent-color:#E91E8C;width:16px;height:16px;flex-shrink:0;cursor:pointer">
        <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#E91E8C,#c4116a);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:0.9rem;flex-shrink:0">
          ${c.nombre.charAt(0).toUpperCase()}
        </div>
        <div style="flex:1;min-width:0">
          <p style="font-size:0.85rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.nombre}</p>
          <p style="font-size:0.72rem;color:#888">${c.tipo==='mayoreo'?'Mayoreo':c.tipo==='zapateria'?'Corridas':'Menudeo'} · ${c.telefono}</p>
        </div>
        <a href="https://wa.me/${tel}?text=${msgEncoded}" target="_blank"
           style="background:#25D366;color:white;padding:6px 12px;border-radius:8px;font-size:0.78rem;font-weight:600;text-decoration:none;white-space:nowrap;flex-shrink:0">
          💬
        </a>
      </div>
    `
  }).join('')
  actualizarContadorCampana()
}

window.actualizarContadorCampana = () => {
  const checks = document.querySelectorAll('.campana-cli-check:checked')
  const n = checks.length
  document.querySelectorAll('#campana-sel-count, #campana-sel-count-auto').forEach(el => { if (el) el.textContent = n })
  const btnManual = document.getElementById('btn-campana-seleccionados')
  const btnAuto   = document.getElementById('btn-campana-auto')
  if (btnManual) btnManual.style.display = n > 0 ? 'inline-flex' : 'none'
  if (btnAuto)   btnAuto.style.display   = n > 0 ? 'inline-flex' : 'none'
  document.querySelectorAll('.campana-cli-check').forEach(el => el.disabled = false)
  const todosCk = document.getElementById('campana-sel-todos')
  if (todosCk) {
    const total = document.querySelectorAll('.campana-cli-check').length
    todosCk.checked = n > 0 && n === total
    todosCk.indeterminate = n > 0 && n < total
  }
}

window.filtrarClientesCampana = (texto) => {
  const q = (texto || '').toLowerCase().trim()
  const todos = window._campanaFiltrados || []
  const plantillaId = window._campanaPlantillaId || 'catalogo'
  const plantilla = window._plantillasCampana?.find(p => p.id === plantillaId)
  const lista = document.getElementById('campana-lista')
  if (!lista) return

  const filtrados = q ? todos.filter(c => c.nombre.toLowerCase().includes(q) || (c.telefono||'').includes(q)) : todos

  if (!filtrados.length) {
    lista.innerHTML = '<div style="padding:2rem;text-align:center;color:#888;font-size:0.85rem">No se encontraron clientes</div>'
    return
  }

  lista.innerHTML = filtrados.map((c) => {
    const idxReal = todos.indexOf(c)
    let mensaje
    if (plantillaId === 'personalizado') {
      const texto2 = document.getElementById('texto-personalizado')?.value || ''
      mensaje = texto2.replace('{nombre}', c.nombre.split(' ')[0])
    } else {
      mensaje = plantilla ? plantilla.mensaje(c.nombre.split(' ')[0]) : ''
    }
    const msgEncoded = encodeURIComponent(mensaje)
    const tel = (c.lada || '52') + c.telefono.replace(/\D/g,'')
    return `
      <div class="campana-cli-row" data-idx="${idxReal}" style="padding:0.75rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:12px;transition:background 0.15s">
        <input type="checkbox" class="campana-cli-check" data-idx="${idxReal}"
          onchange="actualizarContadorCampana()"
          style="accent-color:#E91E8C;width:16px;height:16px;flex-shrink:0;cursor:pointer">
        <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#E91E8C,#c4116a);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:0.9rem;flex-shrink:0">
          ${c.nombre.charAt(0).toUpperCase()}
        </div>
        <div style="flex:1;min-width:0">
          <p style="font-size:0.85rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.nombre}</p>
          <p style="font-size:0.72rem;color:#888">${c.tipo==='mayoreo'?'Mayoreo':c.tipo==='zapateria'?'Corridas':'Menudeo'} · ${c.telefono}</p>
        </div>
        <a href="https://wa.me/${tel}?text=${msgEncoded}" target="_blank"
           style="background:#25D366;color:white;padding:6px 12px;border-radius:8px;font-size:0.78rem;font-weight:600;text-decoration:none;white-space:nowrap;flex-shrink:0">
          💬
        </a>
      </div>
    `
  }).join('')
}

// Carga la lista de modelos cuando se activa plantilla "nuevos"
window.cargarFotosNuevosModelos = async () => {
  const lista = document.getElementById('campana-modelos-lista')
  // Inicializar estado multi-modelo
  if (!window._campanaModelosData) window._campanaModelosData = new Map()        // productoId → {nombre, colores[]}
  if (!window._campanaModelosSeleccionados) window._campanaModelosSeleccionados = new Set() // productoId
  if (!window._campanaColoresSeleccionados) window._campanaColoresSeleccionados = new Set() // "pid::color"
  if (!lista || window._campanaModelosList) {
    if (window._campanaModelosList) _renderModelosCampana(window._campanaModelosList)
    return
  }
  try {
    const res = await fetch(API + '/productos/?activo=eq.true&select=id,nombre,sku_interno,imagen_principal&order=nombre.asc&limit=500')
    window._campanaModelosList = await res.json()
    _renderModelosCampana(window._campanaModelosList)
  } catch(e) {
    if (lista) lista.innerHTML = '<p style="padding:10px 12px;color:red;font-size:0.8rem">Error cargando modelos</p>'
  }
}

window._renderModelosCampana = (prods) => {
  const lista = document.getElementById('campana-modelos-lista')
  if (!lista) return
  if (!prods.length) {
    lista.innerHTML = '<p style="padding:10px 12px;font-size:0.8rem;color:#aaa">Sin resultados</p>'
    return
  }
  const sel = window._campanaModelosSeleccionados || new Set()
  lista.innerHTML = prods.map(p => {
    const activo = sel.has(String(p.id))
    return `
    <div onclick="seleccionarModeloCampana('${p.id}', this)" id="modelo-item-${p.id}"
         style="display:flex;align-items:center;gap:8px;padding:7px 10px;cursor:pointer;border-bottom:1px solid #f5f5f5;transition:background 0.1s;background:${activo ? '#fce4ec' : ''}">
      ${p.imagen_principal
        ? `<img src="${p.imagen_principal}" style="width:34px;height:34px;object-fit:cover;border-radius:5px;flex-shrink:0">`
        : `<div style="width:34px;height:34px;background:#f0f0f0;border-radius:5px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:14px">👟</div>`}
      <span style="font-size:0.83rem;font-weight:${activo ? '700' : '500'}">${p.nombre || p.sku_interno}</span>
      ${activo ? '<span style="margin-left:auto;font-size:0.7rem;background:#E91E8C;color:white;border-radius:20px;padding:1px 8px">✓</span>' : ''}
    </div>`
  }).join('')
}

window.filtrarModelosCampana = (q) => {
  const todos = window._campanaModelosList || []
  const filtrados = q.trim()
    ? todos.filter(p => (p.nombre||'').toLowerCase().includes(q.toLowerCase()) || (p.sku_interno||'').toLowerCase().includes(q.toLowerCase()))
    : todos
  _renderModelosCampana(filtrados)
}

// Toggle: clic en modelo lo agrega o lo quita. Los colores se acumulan.
window.seleccionarModeloCampana = async (productoId, el) => {
  const pid = String(productoId)
  if (!window._campanaModelosSeleccionados) window._campanaModelosSeleccionados = new Set()
  if (!window._campanaModelosData) window._campanaModelosData = new Map()
  if (!window._campanaColoresSeleccionados) window._campanaColoresSeleccionados = new Set()

  const grid = document.getElementById('campana-fotos-nuevos-grid')

  if (window._campanaModelosSeleccionados.has(pid)) {
    // ── Deseleccionar: quitar modelo y sus colores ──
    window._campanaModelosSeleccionados.delete(pid)
    // Quitar selecciones de colores de este modelo
    for (const key of [...window._campanaColoresSeleccionados]) {
      if (key.startsWith(pid + '::')) window._campanaColoresSeleccionados.delete(key)
    }
    // Actualizar visual del item en la lista
    if (el) {
      el.style.background = ''
      const span = el.querySelector('span')
      if (span) span.style.fontWeight = '500'
      const badge = el.querySelector('span:last-child')
      // re-render el item es más limpio
    }
    _renderColoresNuevos()
    actualizarCountFotos()
    // Re-render lista para quitar el ✓
    if (window._campanaModelosList) _renderModelosCampana(
      document.getElementById('campana-nuevo-buscar')?.value
        ? (window._campanaModelosList||[]).filter(p => (p.nombre||'').toLowerCase().includes(document.getElementById('campana-nuevo-buscar').value.toLowerCase()))
        : (window._campanaModelosList||[])
    )
    return
  }

  // ── Seleccionar: añadir modelo ──
  window._campanaModelosSeleccionados.add(pid)

  // Visual inmediato (sin esperar fetch)
  if (el) { el.style.background = '#fce4ec'; const sp = el.querySelector('span'); if(sp) sp.style.fontWeight = '700' }
  if (grid) {
    const loadEl = document.createElement('p')
    loadEl.id = 'campana-load-' + pid
    loadEl.style.cssText = 'font-size:0.8rem;color:#aaa;padding:4px 0'
    loadEl.textContent = 'Cargando colores...'
    grid.appendChild(loadEl)
  }

  // Fetch colores si no están en caché
  if (!window._campanaModelosData.has(pid)) {
    try {
      const nombreModelo = el?.querySelector('span')?.textContent || pid
      const res = await fetch(API + '/variantes/producto/' + pid)
      const variantes = await res.json()
      const mapa = {}
      for (const v of variantes) {
        if (!v.color) continue
        if (!mapa[v.color]) mapa[v.color] = { color: v.color, color_hex: v.color_hex || null, foto_url: null }
        if (!mapa[v.color].foto_url && v.foto_url) mapa[v.color].foto_url = v.foto_url
      }
      window._campanaModelosData.set(pid, { nombre: nombreModelo, colores: Object.values(mapa) })
    } catch(e) {
      window._campanaModelosSeleccionados.delete(pid)
      const loadEl = document.getElementById('campana-load-' + pid)
      if (loadEl) loadEl.remove()
      if (grid) { const err = document.createElement('p'); err.style.cssText='color:red;font-size:0.8rem'; err.textContent='Error cargando variantes'; grid.appendChild(err) }
      return
    }
  }

  const loadEl = document.getElementById('campana-load-' + pid)
  if (loadEl) loadEl.remove()

  _renderColoresNuevos()
  actualizarCountFotos()
  // Re-render lista para mostrar ✓
  if (window._campanaModelosList) _renderModelosCampana(
    document.getElementById('campana-nuevo-buscar')?.value
      ? (window._campanaModelosList||[]).filter(p => (p.nombre||'').toLowerCase().includes(document.getElementById('campana-nuevo-buscar').value.toLowerCase()))
      : (window._campanaModelosList||[])
  )
}

// Construye y renderiza la lista plana de colores de todos los modelos seleccionados
window._renderColoresNuevos = () => {
  const grid = document.getElementById('campana-fotos-nuevos-grid')
  if (!grid) return
  const modelosSel = window._campanaModelosSeleccionados || new Set()
  if (!modelosSel.size) {
    grid.innerHTML = '<p style="font-size:0.8rem;color:#aaa;padding:4px 0">Selecciona uno o más modelos arriba</p>'
    return
  }
  const sel = window._campanaColoresSeleccionados || new Set()
  const multiModelo = modelosSel.size > 1
  let html = ''
  for (const pid of modelosSel) {
    const datos = window._campanaModelosData?.get(pid)
    if (!datos) continue
    if (multiModelo) {
      html += `<p style="font-size:0.72rem;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.04em;margin:10px 0 4px;padding:0 2px">${datos.nombre}</p>`
    }
    if (!datos.colores.length) {
      html += `<p style="font-size:0.78rem;color:#aaa;margin:0 0 6px">Sin colores registrados</p>`
      continue
    }
    html += datos.colores.map(c => {
      const key = `${pid}::${c.color}`
      const activo = sel.has(key)
      const sinFoto = !c.foto_url
      return `
      <div onclick="${sinFoto ? '' : `toggleColorNuevo('${key}', this)`}"
           id="color-nuevo-row-${key.replace(/[^a-zA-Z0-9]/g,'-')}"
           style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;border:2px solid ${activo ? '#E91E8C' : '#eee'};cursor:${sinFoto ? 'default' : 'pointer'};background:${activo ? '#fce4ec' : 'white'};opacity:${sinFoto ? '.45' : '1'};transition:all 0.15s;margin-bottom:4px">
        <input type="checkbox" ${activo ? 'checked' : ''} ${sinFoto ? 'disabled' : ''}
               onclick="event.stopPropagation();toggleColorNuevo('${key}', this.closest('div'))"
               style="accent-color:#E91E8C;width:16px;height:16px;flex-shrink:0">
        <div style="width:24px;height:24px;border-radius:50%;background:${c.color_hex||'#ccc'};border:2px solid rgba(0,0,0,0.12);flex-shrink:0"></div>
        <span style="flex:1;font-size:0.84rem;font-weight:600">${c.color}</span>
        ${c.foto_url
          ? `<img src="${c.foto_url}" style="width:48px;height:48px;object-fit:cover;border-radius:7px;border:1px solid #eee;flex-shrink:0">`
          : `<span style="font-size:0.7rem;color:#bbb;flex-shrink:0">sin foto</span>`}
      </div>`
    }).join('')
  }
  grid.innerHTML = html
}

window.toggleColorNuevo = (key, el) => {
  if (!window._campanaColoresSeleccionados) window._campanaColoresSeleccionados = new Set()
  const rowId = 'color-nuevo-row-' + key.replace(/[^a-zA-Z0-9]/g, '-')
  const row = document.getElementById(rowId) || (el?.closest ? el.closest('[id^="color-nuevo-row"]') : null)
  const cb  = row?.querySelector('input[type=checkbox]')
  if (window._campanaColoresSeleccionados.has(key)) {
    window._campanaColoresSeleccionados.delete(key)
    if (row) { row.style.borderColor = '#eee'; row.style.background = 'white' }
    if (cb) cb.checked = false
  } else {
    window._campanaColoresSeleccionados.add(key)
    if (row) { row.style.borderColor = '#E91E8C'; row.style.background = '#fce4ec' }
    if (cb) cb.checked = true
  }
  actualizarCountFotos()
}

window.actualizarCountFotos = () => {
  const counter = document.getElementById('campana-fotos-count')
  if (!counter) return
  const n = window._campanaColoresSeleccionados?.size || 0
  counter.textContent = n > 0
    ? `${n} color${n > 1 ? 'es' : ''} seleccionado${n > 1 ? 's' : ''} — cada cliente recibirá ${n} foto${n > 1 ? 's' : ''}`
    : 'Palomea los colores que quieres enviar'
}

// ── Foto de producto para campaña ──────────────────────────────
window.cargarProductosCampana = async () => {
  const sel = document.getElementById('campana-producto-sel')
  if (!sel) return
  try {
    const res = await fetch(API + '/productos/?activo=eq.true&select=id,nombre,sku_interno,imagen_principal&order=created_at.desc&limit=60')
    const prods = await res.json()
    sel.innerHTML = '<option value="">— Sin foto —</option>' +
      prods.filter(p => p.imagen_principal).map(p =>
        `<option value="${p.imagen_principal}" data-nombre="${p.nombre}">${p.nombre || p.sku_interno}</option>`
      ).join('')
  } catch(e) { console.error('Error cargando productos campana:', e) }
}

window.seleccionarProductoCampana = (imgUrl) => {
  window._campanaImagenUrl = imgUrl || ''
  const prev = document.getElementById('campana-foto-preview')
  const img  = document.getElementById('campana-foto-img')
  if (prev && img) {
    if (imgUrl) { img.src = imgUrl; prev.style.display = 'block' }
    else { prev.style.display = 'none'; img.src = '' }
  }
}

window.quitarFotoCampana = () => {
  window._campanaImagenUrl = ''
  const sel = document.getElementById('campana-producto-sel')
  if (sel) sel.value = ''
  const prev = document.getElementById('campana-foto-preview')
  if (prev) prev.style.display = 'none'
}

window.cargarProductosInteractivo = async () => {
  const grid = document.getElementById('campana-prod-grid')
  if (!grid) return
  if (window._campanaProdInteractivoCargado) { renderizarProductosInteractivo(window._campanaProdInteractivo || []); return }
  grid.innerHTML = '<p style="font-size:0.8rem;color:#aaa;padding:8px">Cargando...</p>'
  try {
    const res = await fetch(API + '/productos/?activo=eq.true&select=id,nombre,sku_interno,categoria,imagen_principal&order=nombre.asc&limit=300')
    const prods = await res.json()
    window._campanaProdInteractivo = prods
    window._campanaProdSeleccionados = new Set()
    window._campanaProdInteractivoCargado = true
    renderizarProductosInteractivo(prods)
  } catch(e) {
    if (grid) grid.innerHTML = '<p style="color:red;font-size:0.8rem;padding:8px">Error cargando productos</p>'
  }
}

window.renderizarProductosInteractivo = (prods) => {
  const grid = document.getElementById('campana-prod-grid')
  if (!grid) return
  const sel = window._campanaProdSeleccionados || new Set()
  if (!prods.length) { grid.innerHTML = '<p style="font-size:0.8rem;color:#aaa;padding:8px">No hay productos</p>'; return }
  grid.innerHTML = prods.map(p => {
    const sku = p.sku_interno || p.id
    const checked = sel.has(sku)
    return `<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;border:1px solid ${checked ? '#E91E8C' : '#f0f0f0'};background:${checked ? '#fff0f8' : 'white'};transition:all 0.1s" id="prod-lbl-${sku}">
      <input type="checkbox" ${checked ? 'checked' : ''} onchange="toggleProdInteractivo('${sku}', this)"
        style="accent-color:#E91E8C;width:14px;height:14px;flex-shrink:0">
      ${p.imagen_principal ? `<img src="${p.imagen_principal}" style="width:32px;height:32px;object-fit:cover;border-radius:4px;flex-shrink:0">` : '<div style="width:32px;height:32px;background:#f5f5f5;border-radius:4px;flex-shrink:0"></div>'}
      <div style="min-width:0;flex:1">
        <p style="font-size:0.78rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.nombre || sku}</p>
        <p style="font-size:0.68rem;color:#aaa">${sku}${p.categoria ? ' · ' + p.categoria : ''}</p>
      </div>
    </label>`
  }).join('')
  actualizarCountProdInteractivo()
}

window.toggleProdInteractivo = (sku, el) => {
  if (!window._campanaProdSeleccionados) window._campanaProdSeleccionados = new Set()
  const lbl = document.getElementById('prod-lbl-' + sku)
  if (el.checked) {
    if (window._campanaProdSeleccionados.size >= 30) {
      el.checked = false
      alert('Máximo 30 productos por mensaje interactivo')
      return
    }
    window._campanaProdSeleccionados.add(sku)
    if (lbl) { lbl.style.borderColor = '#E91E8C'; lbl.style.background = '#fff0f8' }
  } else {
    window._campanaProdSeleccionados.delete(sku)
    if (lbl) { lbl.style.borderColor = '#f0f0f0'; lbl.style.background = 'white' }
  }
  actualizarCountProdInteractivo()
}

window.actualizarCountProdInteractivo = () => {
  const counter = document.getElementById('campana-prod-count')
  if (!counter) return
  const n = window._campanaProdSeleccionados?.size || 0
  counter.textContent = n > 0 ? `${n}/30 producto${n > 1 ? 's' : ''} seleccionado${n > 1 ? 's' : ''}` : 'Ningún producto seleccionado'
}

window.filtrarProductosInteractivo = (texto) => {
  const q = (texto || '').toLowerCase().trim()
  const todos = window._campanaProdInteractivo || []
  const filtrados = q ? todos.filter(p => (p.nombre||'').toLowerCase().includes(q) || (p.sku_interno||'').toLowerCase().includes(q) || (p.categoria||'').toLowerCase().includes(q)) : todos
  renderizarProductosInteractivo(filtrados)
}

window.enviarCatalogoInteractivo = async (indices) => {
  const clientes = window._campanaFiltrados || []
  const skus = Array.from(window._campanaProdSeleccionados || new Set())
  if (!skus.length) { alert('Selecciona al menos un producto'); return }
  const contactos = indices.map(i => clientes[i]).filter(Boolean).map(c => ({ telefono: c.telefono, nombre: c.nombre }))
  if (!contactos.length) return

  const overlay = document.createElement('div')
  overlay.id = 'campana-auto-overlay'
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem'
  overlay.innerHTML = `<div style="background:white;border-radius:16px;padding:2rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
    <div style="font-size:2.5rem;margin-bottom:0.75rem">🛍️</div>
    <h3 style="font-size:1rem;font-weight:700;margin-bottom:0.5rem">Enviando catálogo interactivo…</h3>
    <p style="font-size:0.82rem;color:#888">${contactos.length} contacto${contactos.length > 1 ? 's' : ''} · ${skus.length} producto${skus.length > 1 ? 's' : ''}</p>
  </div>`
  document.body.appendChild(overlay)

  try {
    const res = await fetch(API + '/envio-productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactos, skus, titulo: 'Nuestros modelos 👠', cuerpo: 'Mira los modelos disponibles. ¡Elige el tuyo!', pie: 'Zapatillas May · León, Gto.' })
    })
    const data = await res.json()
    overlay.innerHTML = `<div style="background:white;border-radius:16px;padding:2.5rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
      <div style="font-size:3rem;margin-bottom:1rem">${data.fallidos === 0 ? '🎉' : '✅'}</div>
      <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:0.5rem">¡Listo!</h3>
      <p style="color:#25D366;font-weight:700;margin-bottom:4px">${data.enviados || 0} enviados</p>
      ${data.fallidos ? `<p style="color:#e53e3e;font-size:0.82rem;margin-bottom:1rem">${data.fallidos} fallidos</p>` : '<p style="font-size:0.8rem;color:#888;margin-bottom:1rem">Sin errores</p>'}
      ${data.errores?.length ? `<p style="font-size:0.7rem;color:#aaa;margin-bottom:1rem">${data.errores[0]}</p>` : ''}
      <button onclick="document.getElementById('campana-auto-overlay').remove()"
        style="background:#E91E8C;color:white;border:none;border-radius:10px;padding:10px 28px;font-size:0.9rem;font-weight:700;cursor:pointer">Cerrar</button>
    </div>`
  } catch(e) {
    overlay.remove()
    alert('Error: ' + e.message)
  }
}

// ── Envío automático vía backend ──────────────────────────────
window.enviarCampanaAutomatica = async () => {
  const checks = document.querySelectorAll('.campana-cli-check:checked')
  const indices = Array.from(checks).map(el => parseInt(el.dataset.idx))
  const clientes = window._campanaFiltrados || []
  const plantillaId = window._campanaPlantillaId || 'catalogo'

  const plantilla = window._plantillasCampana?.find(p => p.id === plantillaId)
  const imagenUrl = window._campanaImagenUrl || ''

  // Fotos a enviar (con caption por color para plantilla "nuevos")
  let fotosUrls = []
  let fotosConCaption = []  // [{url, caption}] para colores
  if (plantillaId === 'nuevos') {
    const selKeys = window._campanaColoresSeleccionados || new Set()
    if (!selKeys.size) { alert('Selecciona al menos un color'); return }
    // Reconstruir lista de colores seleccionados desde _campanaModelosData
    for (const pid of (window._campanaModelosSeleccionados || new Set())) {
      const datos = window._campanaModelosData?.get(pid)
      if (!datos) continue
      for (const c of datos.colores) {
        const key = `${pid}::${c.color}`
        if (selKeys.has(key) && c.foto_url) {
          fotosConCaption.push({ url: c.foto_url, caption: c.color })
          fotosUrls.push(c.foto_url)
        }
      }
    }
    if (!fotosConCaption.length) { alert('Los colores seleccionados no tienen foto. Selecciona colores con imagen.'); return }
  } else if (imagenUrl) {
    fotosUrls = [imagenUrl]
  }

  const destinatarios = indices.map(i => clientes[i]).filter(Boolean).map(c => {
    let mensaje
    if (plantillaId === 'personalizado') {
      const texto = document.getElementById('texto-personalizado')?.value || ''
      mensaje = texto.replace('{nombre}', c.nombre.split(' ')[0])
    } else {
      mensaje = plantilla.mensaje(c.nombre.split(' ')[0])
    }
    return { nombre: c.nombre, telefono: c.telefono, lada: c.lada || '52', mensaje }
  })

  if (!destinatarios.length) return

  // Crear overlay de progreso
  const overlay = document.createElement('div')
  overlay.id = 'campana-auto-overlay'
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem'
  overlay.innerHTML = `
    <div style="background:white;border-radius:16px;padding:2rem;max-width:440px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3);text-align:center">
      <div style="font-size:2.5rem;margin-bottom:0.75rem">📤</div>
      <h3 style="font-size:1rem;font-weight:700;margin-bottom:0.5rem">Iniciando campaña…</h3>
      <p style="font-size:0.82rem;color:#888">Conectando con WhatsApp Business</p>
    </div>`
  document.body.appendChild(overlay)

  try {
    const res = await fetch(API + '/campanas/enviar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destinatarios: destinatarios.map(d => ({ nombre: d.nombre, telefono: d.telefono, mensaje: d.mensaje })),
        fotos_urls: fotosUrls,
        fotos_con_caption: fotosConCaption.length ? fotosConCaption : null,
        imagen_url: fotosUrls.length === 1 ? fotosUrls[0] : '',
        delay_segundos: 4
      })
    })
    const data = await res.json()
    if (data.error) { overlay.remove(); alert('Error: ' + data.error); return }

    const jobId = data.job_id
    const total = data.total

    // Polling de progreso
    const renderProgreso = (job) => {
      const p = job.progreso || 0
      const pct = Math.round((p / total) * 100)
      const ok = job.enviados || 0
      const fail = job.fallidos || 0
      overlay.innerHTML = `
        <div style="background:white;border-radius:16px;padding:2rem;max-width:440px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem">
            <h3 style="font-size:1rem;font-weight:700">🤖 Enviando campaña…</h3>
            <button onclick="cancelarCampanaAuto('${jobId}')"
              style="background:none;border:1px solid #eee;border-radius:6px;padding:4px 10px;font-size:0.75rem;color:#888;cursor:pointer">
              ⏸ Pausar
            </button>
          </div>
          <div style="background:#f5f5f5;border-radius:100px;height:10px;margin-bottom:0.5rem;overflow:hidden">
            <div style="background:linear-gradient(90deg,#E91E8C,#c4116a);height:10px;border-radius:100px;width:${pct}%;transition:width 0.5s"></div>
          </div>
          <p style="font-size:0.78rem;color:#888;text-align:center;margin-bottom:1.5rem">${p} de ${total} mensajes enviados</p>
          <div style="display:flex;gap:1rem;justify-content:center">
            <div style="text-align:center">
              <p style="font-size:1.5rem;font-weight:700;color:#25D366">${ok}</p>
              <p style="font-size:0.72rem;color:#888">Enviados</p>
            </div>
            <div style="text-align:center">
              <p style="font-size:1.5rem;font-weight:700;color:#e53e3e">${fail}</p>
              <p style="font-size:0.72rem;color:#888">Fallidos</p>
            </div>
            <div style="text-align:center">
              <p style="font-size:1.5rem;font-weight:700;color:#888">${total - p}</p>
              <p style="font-size:0.72rem;color:#888">Pendientes</p>
            </div>
          </div>
          ${p > 0 && job.resultados?.length ? `
            <div style="margin-top:1rem;max-height:120px;overflow-y:auto;border-top:1px solid #f5f5f5;padding-top:0.75rem">
              ${job.resultados.slice(-5).map(r => `
                <div style="display:flex;align-items:center;gap:8px;padding:3px 0;font-size:0.75rem">
                  <span style="color:${r.ok ? '#25D366' : '#e53e3e'}">${r.ok ? '✅' : '❌'}</span>
                  <span style="flex:1;color:#555">${r.nombre}</span>
                  ${!r.ok ? `<span style="color:#e53e3e;font-size:0.68rem" title="${(r.error||'').replace(/"/g,"'")}">Error</span>` : ''}
                </div>`).join('')}
            </div>` : ''}
        </div>`
    }

    window._campanaJobId = jobId
    const poll = setInterval(async () => {
      try {
        const r = await fetch(API + '/campanas/estado/' + jobId)
        const job = await r.json()
        renderProgreso(job)
        if (job.terminado) {
          clearInterval(poll)
          window._campanaUltimosResultados = job.resultados || []
          setTimeout(() => {
            const ok = job.enviados || 0
            const fail = job.fallidos || 0
            overlay.innerHTML = `
              <div style="background:white;border-radius:16px;padding:2.5rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
                <div style="font-size:3.5rem;margin-bottom:1rem">${fail === 0 ? '🎉' : '✅'}</div>
                <h3 style="font-size:1.2rem;font-weight:700;margin-bottom:0.5rem">¡Campaña completada!</h3>
                <p style="color:#888;font-size:0.85rem;margin-bottom:0.5rem"><strong style="color:#25D366">${ok} enviados</strong> correctamente</p>
                ${fail > 0 ? `
                  <p style="color:#e53e3e;font-size:0.8rem;margin-bottom:0.5rem">${fail} no se pudieron enviar</p>
                  <div style="background:#fff5f5;border-radius:8px;padding:0.75rem;margin-bottom:1rem;text-align:left;max-height:140px;overflow-y:auto">
                    ${job.resultados.filter(r => !r.ok).map(r => `
                      <div style="font-size:0.75rem;padding:3px 0;border-bottom:1px solid #ffe0e0">
                        <span style="font-weight:600">📵 ${r.nombre}</span>
                        <span style="color:#aaa;margin-left:4px">${r.telefono}</span><br>
                        <span style="color:#e53e3e;font-size:0.68rem">${r.error ? r.error.substring(0,120) : 'Error desconocido'}</span>
                      </div>`).join('')}
                  </div>
                  <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
                    <button onclick="reintentarFallidos(window._campanaUltimosResultados)"
                      style="background:#555;color:white;border:none;border-radius:10px;padding:10px 20px;font-size:0.82rem;font-weight:700;cursor:pointer">
                      🔄 Reintentar fallidos
                    </button>
                    <button onclick="document.getElementById('campana-auto-overlay').remove()"
                      style="background:#E91E8C;color:white;border:none;border-radius:10px;padding:10px 20px;font-size:0.82rem;font-weight:700;cursor:pointer">
                      Cerrar
                    </button>
                  </div>
                ` : '<p style="font-size:0.8rem;color:#888;margin-bottom:1rem">¡Todo perfecto!</p><button onclick="document.getElementById(\'campana-auto-overlay\').remove()" style="background:#E91E8C;color:white;border:none;border-radius:10px;padding:12px 32px;font-size:0.9rem;font-weight:700;cursor:pointer">Cerrar</button>'}
              </div>`
          }, 600)
        }
      } catch(e) { clearInterval(poll) }
    }, 1500)

  } catch(e) {
    overlay.remove()
    alert('Error conectando con el servidor: ' + e.message)
  }
}

window.cancelarCampanaAuto = async (jobId) => {
  try {
    await fetch(API + '/campanas/cancelar/' + jobId, { method: 'POST' })
  } catch(e) {}
  const overlay = document.getElementById('campana-auto-overlay')
  if (overlay) overlay.remove()
}

window.reintentarFallidos = async (resultados) => {
  const fallidos = (resultados || []).filter(r => !r.ok)
  if (!fallidos.length) return
  document.getElementById('campana-auto-overlay')?.remove()

  // Reconstruir destinatarios con el mismo mensaje que tenían originalmente
  const clientes = window._campanaFiltrados || []
  const plantillaId = window._campanaPlantillaId || 'catalogo'
  const plantilla = window._plantillasCampana?.find(p => p.id === plantillaId)
  const fotos = window._campanaFotosUrls || []
  const fotosConCaption = window._campanaFotosConCaption || null
  const imagenUrl = window._campanaImagenUrl || ''

  const destinatarios = fallidos.map(r => {
    const c = clientes.find(cl => {
      const t = String(cl.telefono || '').replace(/\D/g, '')
      const rt = String(r.telefono || '').replace(/\D/g, '')
      return rt.endsWith(t) || t.endsWith(rt)
    })
    const nombre = r.nombre || (c ? c.nombre : 'Cliente')
    const primerNombre = nombre.split(' ')[0]
    let mensaje = plantilla ? plantilla.texto.replace('{nombre}', primerNombre) : `Hola ${primerNombre}`
    return { nombre, telefono: r.telefono, mensaje }
  })

  if (!destinatarios.length) { alert('No se pudo reconstruir los destinatarios'); return }

  try {
    const res = await fetch(API + '/campanas/enviar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destinatarios, fotos_urls: fotos, fotos_con_caption: fotosConCaption, imagen_url: imagenUrl, delay_segundos: 5 })
    })
    const data = await res.json()
    if (data.error) { alert('Error: ' + data.error); return }
    alert(`Reintentando ${destinatarios.length} mensaje(s) fallido(s)...`)
  } catch(e) {
    alert('Error al reintentar: ' + e.message)
  }
}

window.toggleSeleccionarTodosCampana = (checked) => {
  const checks = document.querySelectorAll('.campana-cli-check')
  let count = 0
  checks.forEach(el => {
    if (checked) { el.checked = true; count++ }
    else { el.checked = false }
  })
  actualizarContadorCampana()
}

window.iniciarCampanaSeleccionados = () => {
  const checks = document.querySelectorAll('.campana-cli-check:checked')
  const indices = Array.from(checks).map(el => parseInt(el.dataset.idx))
  const clientes = window._campanaFiltrados || []
  const plantillaId = window._campanaPlantillaId || 'catalogo'

  const plantilla = window._plantillasCampana?.find(p => p.id === plantillaId)

  const seleccionados = indices.map(i => clientes[i]).filter(Boolean).map(c => {
    let mensaje
    if (plantillaId === 'personalizado') {
      const texto = document.getElementById('texto-personalizado')?.value || ''
      mensaje = texto.replace('{nombre}', c.nombre.split(' ')[0])
    } else {
      mensaje = plantilla.mensaje(c.nombre.split(' ')[0])
    }
    const tel = (c.lada || '52') + c.telefono.replace(/\D/g,'')
    return { ...c, mensaje, tel }
  })

  if (!seleccionados.length) return

  // Modal de envío paso a paso
  let paso = 0
  const overlay = document.createElement('div')
  overlay.id = 'campana-modal-overlay'
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem'

  const renderPaso = () => {
    const c = seleccionados[paso]
    const progreso = Math.round(((paso) / seleccionados.length) * 100)
    overlay.innerHTML = `
      <div style="background:white;border-radius:16px;padding:2rem;max-width:480px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem">
          <h3 style="font-size:1rem;font-weight:700">📣 Campaña en curso</h3>
          <button onclick="document.getElementById('campana-modal-overlay').remove()"
            style="background:none;border:none;font-size:1.2rem;cursor:pointer;color:#888">✕</button>
        </div>

        <!-- Barra de progreso -->
        <div style="background:#f5f5f5;border-radius:100px;height:6px;margin-bottom:1.5rem">
          <div style="background:#E91E8C;height:6px;border-radius:100px;width:${progreso}%;transition:width 0.3s"></div>
        </div>
        <p style="font-size:0.75rem;color:#888;text-align:center;margin-top:-1rem;margin-bottom:1.5rem">${paso} de ${seleccionados.length} enviados</p>

        <!-- Cliente actual -->
        <div style="background:#fafafa;border-radius:12px;padding:1rem;margin-bottom:1rem;display:flex;align-items:center;gap:12px">
          <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#E91E8C,#c4116a);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:1.1rem;flex-shrink:0">
            ${c.nombre.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style="font-weight:700;font-size:0.95rem">${c.nombre}</p>
            <p style="font-size:0.78rem;color:#888">${c.telefono}</p>
          </div>
        </div>

        <!-- Preview mensaje -->
        <div style="background:#e8f5e9;border-radius:10px;padding:0.875rem;font-size:0.8rem;color:#333;white-space:pre-wrap;line-height:1.55;border:1px solid #a5d6a7;max-height:140px;overflow-y:auto;margin-bottom:1.25rem">${c.mensaje}</div>

        <!-- Botones -->
        <a href="https://wa.me/${c.tel}?text=${encodeURIComponent(c.mensaje)}" target="_blank"
           onclick="setTimeout(() => document.getElementById('btn-campana-siguiente')?.focus(), 800)"
           style="display:block;background:#25D366;color:white;padding:12px;border-radius:10px;font-size:0.9rem;font-weight:700;text-decoration:none;text-align:center;margin-bottom:10px">
          💬 Abrir WhatsApp con ${c.nombre.split(' ')[0]}
        </a>
        <div style="display:flex;gap:8px">
          <button onclick="document.getElementById('campana-modal-overlay').remove()"
            style="flex:1;padding:10px;border-radius:10px;border:1px solid #eee;background:white;font-size:0.82rem;color:#888;cursor:pointer">
            Pausar campaña
          </button>
          <button id="btn-campana-siguiente"
            onclick="window._campanaAvanzar()"
            style="flex:2;padding:10px;border-radius:10px;border:none;background:#E91E8C;color:white;font-size:0.85rem;font-weight:700;cursor:pointer">
            ${paso < seleccionados.length - 1 ? '✅ Enviado → Siguiente' : '✅ Finalizar campaña'}
          </button>
        </div>
      </div>
    `
  }

  window._campanaAvanzar = () => {
    paso++
    if (paso >= seleccionados.length) {
      overlay.innerHTML = `
        <div style="background:white;border-radius:16px;padding:2.5rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
          <div style="font-size:3.5rem;margin-bottom:1rem">🎉</div>
          <h3 style="font-size:1.2rem;font-weight:700;margin-bottom:0.5rem">¡Campaña completada!</h3>
          <p style="color:#888;font-size:0.85rem;margin-bottom:1.5rem">Se enviaron mensajes a <strong>${seleccionados.length} clientes</strong> exitosamente.</p>
          <button onclick="document.getElementById('campana-modal-overlay').remove()"
            style="background:#E91E8C;color:white;border:none;border-radius:10px;padding:12px 32px;font-size:0.9rem;font-weight:700;cursor:pointer">
            Cerrar
          </button>
        </div>
      `
      return
    }
    renderPaso()
  }

  renderPaso()
  document.body.appendChild(overlay)
}

async function cargarClientes() {
  const content = document.getElementById('content')
  try {
    const [resCli, resPed] = await Promise.all([
      fetch(API + '/clientes/'),
      fetch(API + '/pedidos/')
    ])
    const clientes = await resCli.json()
    const pedidos = await resPed.json()

    // Enriquecer clientes con datos de pedidos
    const hoy = new Date()
    const hace30 = new Date(hoy - 30 * 24 * 60 * 60 * 1000)
    const hace90 = new Date(hoy - 90 * 24 * 60 * 60 * 1000)

    const clientesEnriquecidos = clientes.map(c => {
      const pedidosCli = pedidos.filter(p => p.cliente_id === c.id && (p.status === 'confirmado' || p.status === 'pagado'))
      const totalGastado = pedidosCli.reduce((s, p) => s + parseFloat(p.total || 0), 0)
      const ultimoPedido = pedidosCli.length > 0 ? new Date(pedidosCli[0].created_at) : null
      const pedidos30 = pedidosCli.filter(p => new Date(p.created_at) >= hace30).length
      const diasSinComprar = ultimoPedido ? Math.floor((hoy - ultimoPedido) / (1000 * 60 * 60 * 24)) : null

      // Segmentacion automatica
      let segmento = 'nuevo'
      let segmentoLabel = '⚪ Nuevo'
      let segmentoBg = '#f5f5f5'
      let segmentoColor = '#888'

      if (pedidosCli.length === 0) {
        segmento = 'nuevo'; segmentoLabel = '⚪ Sin compras'; segmentoBg = '#f5f5f5'; segmentoColor = '#888'
      } else if (totalGastado >= 5000 && pedidos30 >= 1) {
        segmento = 'vip'; segmentoLabel = '⭐ VIP'; segmentoBg = '#fff8e1'; segmentoColor = '#f57f17'
      } else if (diasSinComprar > 90) {
        segmento = 'inactivo'; segmentoLabel = '🔴 Inactivo'; segmentoBg = '#ffebee'; segmentoColor = '#c62828'
      } else if (diasSinComprar > 30) {
        segmento = 'riesgo'; segmentoLabel = '🟡 En riesgo'; segmentoBg = '#fff8e1'; segmentoColor = '#f57f17'
      } else if (pedidos30 >= 2) {
        segmento = 'frecuente'; segmentoLabel = '🟢 Frecuente'; segmentoBg = '#e8f5e9'; segmentoColor = '#2e7d32'
      } else {
        segmento = 'activo'; segmentoLabel = '🔵 Activo'; segmentoBg = '#e3f2fd'; segmentoColor = '#1565c0'
      }

      return { ...c, totalGastado, ultimoPedido, pedidos30, diasSinComprar, segmento, segmentoLabel, segmentoBg, segmentoColor, totalPedidos: pedidosCli.length }
    }).sort((a, b) => b.totalGastado - a.totalGastado)

    // Estadísticas
    const totalVIP = clientesEnriquecidos.filter(c => c.segmento === 'vip').length
    const totalInactivos = clientesEnriquecidos.filter(c => c.segmento === 'inactivo').length
    const totalEnRiesgo = clientesEnriquecidos.filter(c => c.segmento === 'riesgo').length
    const totalActivos = clientesEnriquecidos.filter(c => c.segmento === 'frecuente' || c.segmento === 'activo').length

    const totalTienda = clientesEnriquecidos.filter(c => c.origen === 'tienda').length

    window._clientesData = clientesEnriquecidos

    content.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-bottom:1.5rem">
        <div style="background:white;border-radius:12px;padding:1rem;border:1px solid #eee;text-align:center;cursor:pointer" onclick="filtrarClientesSeg('todos')">
          <p style="font-size:1.8rem;font-weight:700;color:#333">${clientes.length}</p>
          <p style="font-size:0.72rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Total</p>
        </div>
        <div style="background:#fdf4ff;border-radius:12px;padding:1rem;border:1px solid #e9d5ff;text-align:center;cursor:pointer" onclick="filtrarClientesSeg('tienda')">
          <p style="font-size:1.8rem;font-weight:700;color:#7c3aed">${totalTienda}</p>
          <p style="font-size:0.72rem;color:#7c3aed;text-transform:uppercase;letter-spacing:0.5px">🛍️ Tienda web</p>
        </div>
        <div style="background:#fff8e1;border-radius:12px;padding:1rem;border:1px solid #ffe082;text-align:center;cursor:pointer" onclick="filtrarClientesSeg('vip')">
          <p style="font-size:1.8rem;font-weight:700;color:#f57f17">${totalVIP}</p>
          <p style="font-size:0.72rem;color:#f57f17;text-transform:uppercase;letter-spacing:0.5px">⭐ VIP</p>
        </div>
        <div style="background:#e8f5e9;border-radius:12px;padding:1rem;border:1px solid #a5d6a7;text-align:center;cursor:pointer" onclick="filtrarClientesSeg('activos')">
          <p style="font-size:1.8rem;font-weight:700;color:#2e7d32">${totalActivos}</p>
          <p style="font-size:0.72rem;color:#2e7d32;text-transform:uppercase;letter-spacing:0.5px">🟢 Activos</p>
        </div>
        <div style="background:#fff8e1;border-radius:12px;padding:1rem;border:1px solid #ffe082;text-align:center;cursor:pointer" onclick="filtrarClientesSeg('riesgo')">
          <p style="font-size:1.8rem;font-weight:700;color:#f57f17">${totalEnRiesgo}</p>
          <p style="font-size:0.72rem;color:#f57f17;text-transform:uppercase;letter-spacing:0.5px">🟡 En riesgo</p>
        </div>
        <div style="background:#ffebee;border-radius:12px;padding:1rem;border:1px solid #ffcdd2;text-align:center;cursor:pointer" onclick="filtrarClientesSeg('inactivo')">
          <p style="font-size:1.8rem;font-weight:700;color:#c62828">${totalInactivos}</p>
          <p style="font-size:0.72rem;color:#c62828;text-transform:uppercase;letter-spacing:0.5px">🔴 Inactivos</p>
        </div>
      </div>

      <div class="table-card">
        <div class="table-header">
          <h3>Clientes (${clientes.length})</h3>
          <button class="btn btn-primary" onclick="mostrarFormCliente()">+ Nuevo cliente</button>
        </div>
        <div style="padding:0 1.5rem 1rem;display:flex;gap:8px;flex-wrap:wrap">
          <input class="form-input" id="cli-buscar" placeholder="🔍 Buscar por nombre o telefono..." style="flex:1;min-width:200px" oninput="filtrarClientes()">
          <select class="form-input" id="cli-tipo" style="min-width:140px" onchange="filtrarClientes()">
            <option value="">Todos los tipos</option>
            <option value="menudeo">Menudeo</option>
            <option value="mayoreo">Mayoreo variado</option>
            <option value="zapateria">Corridas</option>
          </select>
          <select class="form-input" id="cli-origen" style="min-width:140px" onchange="filtrarClientes()">
            <option value="">Todos los orígenes</option>
            <option value="tienda">🛍️ Registrados en tienda</option>
            <option value="panel">Panel / manual</option>
          </select>
        </div>
        <div id="cli-lista">
          ${clientesEnriquecidos.map(c => `
            <div class="cli-item" data-segmento="${c.segmento}" data-tipo="${c.tipo || ''}" data-origen="${c.origen || ''}" data-nombre="${c.nombre.toLowerCase()}" data-tel="${c.telefono || ''}"
                 style="padding:1rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:16px;flex-wrap:wrap;cursor:pointer;transition:background 0.15s"
                 onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='white'"
                 onclick="verCliente('${c.id}')">
              <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#E91E8C,#c4116a);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:1rem;flex-shrink:0">
                ${c.nombre.charAt(0).toUpperCase()}
              </div>
              <div style="flex:1;min-width:140px">
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px">
                  <p style="font-weight:700;font-size:0.95rem">${c.nombre}</p>
                  <span style="padding:2px 8px;border-radius:100px;font-size:0.65rem;font-weight:600;background:${c.segmentoBg};color:${c.segmentoColor}">${c.segmentoLabel}</span>
                  <span style="padding:2px 8px;border-radius:100px;font-size:0.65rem;font-weight:600;background:#f5f5f5;color:#888">${c.tipo === 'mayoreo' ? 'Mayoreo' : c.tipo === 'zapateria' ? 'Corridas' : 'Menudeo'}</span>
                  ${c.origen === 'tienda' ? '<span style="padding:2px 8px;border-radius:100px;font-size:0.65rem;font-weight:600;background:#fdf4ff;color:#7c3aed">🛍️ Tienda</span>' : ''}
                </div>
                <p style="font-size:0.78rem;color:#888">${c.telefono || 'Sin teléfono'}${c.ciudad ? ' · ' + c.ciudad : ''}</p>
                ${c.comentarios_internos ? `<p style="font-size:0.72rem;color:#E91E8C;margin-top:2px">📝 ${c.comentarios_internos.substring(0,50)}${c.comentarios_internos.length > 50 ? '...' : ''}</p>` : ''}
              </div>
              <div style="text-align:right;min-width:100px">
                <p style="font-weight:700;color:#E91E8C;font-size:0.95rem">$${c.totalGastado.toFixed(0)}</p>
                <p style="font-size:0.72rem;color:#888">${c.totalPedidos} pedidos</p>
                ${c.diasSinComprar !== null ? `<p style="font-size:0.68rem;color:${c.diasSinComprar > 60 ? '#c62828' : '#aaa'}">${c.diasSinComprar === 0 ? 'Hoy' : 'Hace ' + c.diasSinComprar + ' días'}</p>` : ''}
              </div>
              <div style="display:flex;gap:6px;flex-shrink:0;flex-wrap:wrap" onclick="event.stopPropagation()">
                ${c.tipo === 'menudeo' ? `<button class="btn btn-secondary" style="padding:4px 10px;font-size:0.72rem;border-color:#7c3aed;color:#7c3aed" onclick="cambiarTipoCliente('${c.id}','mayoreo',this)">→ Mayoreo</button>` : ''}
                ${c.tipo === 'mayoreo' ? `<button class="btn btn-secondary" style="padding:4px 10px;font-size:0.72rem" onclick="cambiarTipoCliente('${c.id}','menudeo',this)">→ Menudeo</button>` : ''}
                <button class="btn btn-secondary" style="padding:4px 10px;font-size:0.72rem" onclick="mostrarFormCliente('${c.id}')">Editar</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `
  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error conectando con el servidor</p>'
  }
}

window.filtrarClientes = () => {
  const buscar = (document.getElementById('cli-buscar')?.value || '').toLowerCase()
  const tipo   = document.getElementById('cli-tipo')?.value || ''
  const origen = document.getElementById('cli-origen')?.value || ''
  document.querySelectorAll('.cli-item').forEach(el => {
    const nombre  = el.dataset.nombre || ''
    const tel     = el.dataset.tel || ''
    const tipoEl  = el.dataset.tipo || ''
    const origenEl = el.dataset.origen || ''
    const matchBuscar = !buscar || nombre.includes(buscar) || tel.includes(buscar)
    const matchTipo   = !tipo   || tipoEl  === tipo
    const matchOrigen = !origen || origenEl === origen
    el.style.display = matchBuscar && matchTipo && matchOrigen ? '' : 'none'
  })
}

window.filtrarClientesSeg = (seg) => {
  // Limpiar selects al filtrar por tarjeta
  const selTipo   = document.getElementById('cli-tipo')
  const selOrigen = document.getElementById('cli-origen')
  if (selTipo)   selTipo.value   = ''
  if (selOrigen) selOrigen.value = ''
  document.querySelectorAll('.cli-item').forEach(el => {
    if (seg === 'todos')  { el.style.display = ''; return }
    if (seg === 'tienda') { el.style.display = el.dataset.origen === 'tienda' ? '' : 'none'; return }
    if (seg === 'activos') { el.style.display = (el.dataset.segmento === 'activo' || el.dataset.segmento === 'frecuente') ? '' : 'none'; return }
    el.style.display = el.dataset.segmento === seg ? '' : 'none'
  })
}

window.cambiarTipoCliente = async (id, nuevoTipo, btn) => {
  const orig = btn.textContent
  btn.disabled = true
  btn.textContent = '...'
  try {
    const res = await fetch(API + `/clientes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo: nuevoTipo })
    })
    const d = await res.json()
    if (d && !d.error) {
      btn.textContent = '✅ Actualizado'
      btn.style.color = '#15803d'
      btn.style.borderColor = '#15803d'
      // Actualizar data-tipo en la fila y refrescar badge
      const fila = btn.closest('.cli-item')
      if (fila) {
        fila.dataset.tipo = nuevoTipo
        const badgeTipo = fila.querySelector('[data-badge-tipo]')
        if (badgeTipo) badgeTipo.textContent = nuevoTipo === 'mayoreo' ? 'Mayoreo' : 'Menudeo'
      }
      setTimeout(() => cargarClientes(), 1200)
    } else {
      btn.textContent = orig
      btn.disabled = false
      alert('Error: ' + (d?.error || 'desconocido'))
    }
  } catch(e) {
    btn.textContent = orig
    btn.disabled = false
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
    const [sucursales, productos, variantes, inventario] = await Promise.all([
      fetch(API + '/sucursales/').then(r => r.json()),
      fetch(API + '/productos/').then(r => r.json()),
      fetch(API + '/variantes/').then(r => r.json()),
      fetch(API + '/inventario/').then(r => r.json())
    ])

    // Complementar variantes con las que vienen anidadas en inventario
    // (cubre variantes con activa=null que el endpoint /variantes/ filtra)
    inventario.forEach(i => {
      if (i.variantes && i.variantes.id && i.variantes.activa !== false && !variantes.find(v => v.id === i.variantes.id)) {
        variantes.push(i.variantes)
      }
    })

    window._invData = { sucursales, productos, variantes, inventario }

    // Diagnóstico automático AR1011
    const ar1011 = productos.find(p => p.sku_interno === 'AR1011')
    if (ar1011) {
      const varsAr = variantes.filter(v => v.producto_id === ar1011.id)
      const invAr = inventario.filter(i => varsAr.some(v => v.id === i.variante_id))
      console.log(`[Diag AR1011] Variantes en listado: ${varsAr.length}`, varsAr.map(v => v.color + ' T' + v.talla))
      console.log(`[Diag AR1011] Con inventario: ${invAr.length}`)
    }

    content.innerHTML = `
  <div style="margin-bottom:1.5rem">
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
      <input class="form-input" id="inv-buscar" placeholder="🔍 Buscar por nombre o SKU..." style="flex:1;min-width:200px" oninput="renderInventario()">
      <select class="form-input" id="inv-categoria" style="min-width:140px" onchange="renderInventario()">
        <option value="">Todas las categorias</option>
        ${[...new Set(productos.map(p => p.categoria).filter(Boolean))].map(c => `<option value="${c}">${c.charAt(0).toUpperCase() + c.slice(1)}</option>`).join('')}
      </select>
      <select class="form-input" id="inv-talla" style="min-width:100px" onchange="renderInventario()">
        <option value="">Todas las tallas</option>
        ${TALLAS.map(t => `<option value="${t}">${t}</option>`).join('')}
      </select>
      <select class="form-input" id="inv-estado" style="min-width:130px" onchange="renderInventario()">
        <option value="">Todos los estados</option>
        <option value="disponible">Disponible</option>
        <option value="bajo">Stock bajo</option>
        <option value="agotado">Agotado</option>
      </select>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn btn-primary" onclick="mostrarFormInventario()">+ Agregar stock</button>
      <button class="btn btn-secondary" onclick="mostrarAlertas()" style="background:#fff8e1;border-color:#f57f17;color:#f57f17">⚠ Alertas</button>
      <button class="btn btn-secondary" onclick="mostrarInventarioMasivo()" style="background:#f3e5f5;border-color:#6a1b9a;color:#6a1b9a">📋 Masivo</button>
      <button class="btn btn-secondary" onclick="mostrarEntrada()" style="background:#e8f5e9;border-color:#2e7d32;color:#2e7d32">+ Entrada</button>
      <button class="btn btn-secondary" onclick="mostrarSalida()" style="background:#ffebee;border-color:#c62828;color:#c62828">− Salida</button>
      <button class="btn btn-secondary" onclick="mostrarAjuste()" style="background:#e3f2fd;border-color:#1565c0;color:#1565c0">⚙ Ajuste</button>
      <button class="btn btn-secondary" onclick="mostrarCambio()" style="background:#f3e5f5;border-color:#6a1b9a;color:#6a1b9a">↔ Cambio</button>
      <button class="btn btn-secondary" onclick="mostrarTraspaso()" style="background:#e8eaf6;border-color:#283593;color:#283593">⇄ Traspaso</button>
    </div>
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
    if (!p.activo) return false
    if (buscar && !p.nombre.toLowerCase().includes(buscar) && !(p.sku_interno || '').toLowerCase().includes(buscar)) return false
    if (categoriaFiltro && p.categoria !== categoriaFiltro) return false
    return true
  })

  const html = sucursales.map(suc => {
    const invSucursal = inventario.filter(i => i.sucursal_id === suc.id)
    const productosHtml = productosFiltrados.map(prod => {
      const variantesProd = variantes.filter(v => v.producto_id === prod.id && v.activa !== false)
      if (variantesProd.length === 0) return ''
      const colores = [...new Set(variantesProd.map(v => v.color).filter(Boolean))]

      const coloresHtml = colores.map(color => {
        const variantesColor = variantesProd
          .filter(v => v.color === color)
          .sort((a, b) => TALLAS_ORDEN.indexOf(a.talla) - TALLAS_ORDEN.indexOf(b.talla))
        if (tallaFiltro && !variantesColor.find(v => v.talla === tallaFiltro)) return ''

        const colorHex = variantesColor[0] ? variantesColor[0].color_hex : '#888'
        const fotoColor = variantesColor[0] ? variantesColor[0].foto_url : null

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
            <div style="display:flex;align-items:center;justify-content:space-between;background:${bg};border-radius:10px;padding:8px 12px;border:1px solid ${colorTexto}30">
              <span style="font-size:0.85rem;font-weight:600;color:#555;min-width:44px">T${v.talla}</span>
              <div style="display:flex;align-items:center;gap:8px">
                <button onclick="cambiarStockInventario('${v.id}', '${suc.id}', ${cantidad !== null ? cantidad : 0}, ${minimo}, -1)"
                        style="background:#fff;border:1px solid #ddd;border-radius:6px;width:34px;height:34px;cursor:pointer;font-size:1.2rem;font-weight:700;touch-action:manipulation">−</button>
                <span id="stock-${v.id}-${suc.id}" style="font-size:1.1rem;font-weight:700;color:${colorTexto};min-width:32px;text-align:center">${cantidad !== null ? cantidad : '—'}</span>
                <button onclick="cambiarStockInventario('${v.id}', '${suc.id}', ${cantidad !== null ? cantidad : 0}, ${minimo}, 1)"
                        style="background:#fff;border:1px solid #ddd;border-radius:6px;width:34px;height:34px;cursor:pointer;font-size:1.2rem;font-weight:700;touch-action:manipulation">+</button>
              </div>
            </div>
          `
        }).join('')

        if (!tallasHtml.trim()) return ''

        return `
          <div style="background:#fafafa;border-radius:12px;padding:1rem;margin-bottom:10px;border:1px solid #eee">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
              ${fotoColor
                ? `<img src="${fotoColor}" style="width:52px;height:52px;object-fit:cover;border-radius:8px;border:1px solid #eee;flex-shrink:0">`
                : `<div style="width:52px;height:52px;background:${colorHex};border-radius:8px;border:1px solid #eee;flex-shrink:0;opacity:0.7"></div>`}
              <div style="display:flex;align-items:center;gap:8px">
                <div style="width:14px;height:14px;border-radius:50%;background:${colorHex};border:2px solid #ddd;flex-shrink:0"></div>
                <span style="font-size:0.9rem;font-weight:600;color:#333">${color}</span>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px">
              ${tallasHtml}
            </div>
          </div>
        `
      }).join('')

      if (!coloresHtml.trim()) return ''

      const imgPrincipal = prod.imagen_principal

      return `
        <div style="background:white;border-radius:12px;padding:1.25rem;margin-bottom:1rem;border:1px solid #eee">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:1rem">
            ${imgPrincipal
              ? `<img src="${imgPrincipal}" style="width:56px;height:56px;object-fit:cover;border-radius:8px;border:1px solid #eee;flex-shrink:0">`
              : `<div style="width:56px;height:56px;background:#f5f5f5;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0">👠</div>`}
            <div>
              <p style="font-weight:700;font-size:1rem;color:#1a1a1a;margin-bottom:2px">${prod.nombre}</p>
              <div>
                <span style="font-size:0.75rem;color:#888;background:#f5f5f5;padding:2px 8px;border-radius:100px;margin-right:4px">${prod.sku_interno || '—'}</span>
                <span style="font-size:0.72rem;color:#E91E8C;background:#fce4f3;padding:2px 8px;border-radius:100px">${prod.categoria || ''}</span>
              </div>
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
window.cambiarStockInventario = async (varianteId, sucursalId, cantidadActual, minimo, delta) => {
  const nuevaCantidad = Math.max(0, cantidadActual + delta)
  try {
    // Usar /movimientos/ajuste que crea el registro si no existe (upsert)
    const res = await fetch(API + '/movimientos/ajuste', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        variante_id: varianteId,
        sucursal_id: sucursalId,
        cantidad: nuevaCantidad,
        stock_minimo: minimo,
        motivo: 'Ajuste desde inventario'
      })
    })
    if (res.ok) {
      // Actualizar el display sin re-renderizar todo
      const el = document.getElementById('stock-' + varianteId + '-' + sucursalId)
      if (el) {
        el.textContent = nuevaCantidad
        // Actualizar color
        let colorTexto
        if (nuevaCantidad === 0) colorTexto = '#c62828'
        else if (nuevaCantidad <= minimo) colorTexto = '#f57f17'
        else colorTexto = '#2e7d32'
        el.style.color = colorTexto
      }
      // Actualizar datos en memoria
      const invItem = window._invData.inventario.find(i => i.variante_id === varianteId && i.sucursal_id === sucursalId)
      if (invItem) invItem.cantidad = nuevaCantidad
      // Actualizar los botones con nueva cantidad
      const btns = document.querySelectorAll(`button[onclick*="${varianteId}"][onclick*="${sucursalId}"]`)
      btns.forEach(btn => {
        btn.setAttribute('onclick', btn.getAttribute('onclick').replace(
          /cambiarStockInventario\('[^']+', '[^']+', \d+,/,
          `cambiarStockInventario('${varianteId}', '${sucursalId}', ${nuevaCantidad},`
        ))
      })
    }
  } catch(e) {
    alert('Error actualizando stock')
  }
}

window.editarStock = async (variante_id, sucursal_id, cantidad, minimo) => {
  const nuevaCantidad = prompt('Nueva cantidad:', cantidad)
  if (nuevaCantidad === null) return
  const nuevoMinimo = prompt('Stock minimo de alerta:', minimo)
  if (nuevoMinimo === null) return
  try {
    // Usar /movimientos/ajuste que crea el registro si no existe (a diferencia de PATCH que falla silencioso)
    const res = await fetch(API + '/movimientos/ajuste', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ variante_id, sucursal_id, cantidad: parseInt(nuevaCantidad), stock_minimo: parseInt(nuevoMinimo), motivo: 'Ajuste manual desde inventario' })
    })
    if (res.ok) {
      const resInv = await fetch(API + '/inventario/')
      window._invData.inventario = await resInv.json()
      renderInventario()
    } else {
      const err = await res.json().catch(() => ({}))
      alert('Error al guardar: ' + (err.error || res.status))
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
    // Usar /movimientos/ajuste que hace upsert (crea o actualiza según exista registro)
    const res = await fetch(API + '/movimientos/ajuste', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sucursal_id, variante_id, cantidad: parseInt(cantidad), stock_minimo: parseInt(stock_minimo), motivo: 'Stock cargado manualmente' })
    })
    if (res.ok) {
      alert('Stock guardado correctamente')
      navegarA('inventario')
    } else {
      const err = await res.json().catch(() => ({}))
      alert('Error al guardar stock: ' + (err.error || res.status))
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
  const todasFiltradas = variantes.filter(v => {
    const nombre = (v.productos ? v.productos.nombre || '' : '').toLowerCase()
    const color = (v.color || '').toLowerCase()
    const talla = (v.talla || '').toLowerCase()
    const sku = (v.sku || '').toLowerCase()
    const completo = nombre + ' ' + color + ' ' + talla + ' ' + sku
    return terminos.every(t => completo.includes(t))
  })
  const filtradas = todasFiltradas.slice(0, 15)

  if (filtradas.length === 0) {
    resultadosDiv.innerHTML = '<div style="padding:10px 14px;color:#888;font-size:0.85rem">No se encontraron resultados</div>'
    resultadosDiv.style.display = 'block'
    return
  }

  const esPedido = prefijo === 'ped-prod'

  // En pedidos: agrupar por producto + color y mostrar chips de talla tocables
  // (agregar varias tallas de un mismo modelo de un toque, estilo POS)
  if (esPedido) {
    const TALLAS_ORDEN = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Unica']
    const grupos = {}
    todasFiltradas.forEach(v => {
      const key = (v.producto_id || '') + '|' + (v.color || '')
      if (!grupos[key]) grupos[key] = { nombre: (v.productos ? v.productos.nombre || '—' : '—'), color: v.color || '', hex: v.color_hex, foto: v.foto_url, vars: [] }
      grupos[key].vars.push(v)
    })
    const gruposArr = Object.values(grupos).slice(0, 8)
    resultadosDiv.innerHTML = gruposArr.map(g => {
      const chips = g.vars
        .sort((a, b) => TALLAS_ORDEN.indexOf(a.talla) - TALLAS_ORDEN.indexOf(b.talla))
        .map(v => {
          const nombreCompleto = (g.nombre + ' - ' + g.color + ' - T' + v.talla).replace(/'/g, '')
          return `<button onclick="agregarItemPedido('${v.id}', '${nombreCompleto}');this.style.background='#E91E8C';this.style.color='#fff';this.style.borderColor='#E91E8C'"
                          style="min-width:46px;min-height:42px;padding:6px 12px;border:1.5px solid #ddd;border-radius:9px;background:#fff;color:#333;font-size:0.9rem;font-weight:700;cursor:pointer;font-family:inherit">T${v.talla}</button>`
        }).join('')
      return `
        <div style="padding:11px 12px;border-bottom:1px solid #f0f0f0">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:9px">
            ${g.foto ? `<img src="${g.foto}" style="width:38px;height:38px;object-fit:cover;border-radius:7px;flex-shrink:0">` : `<div style="width:38px;height:38px;background:#f3f3f3;border-radius:7px;flex-shrink:0;display:flex;align-items:center;justify-content:center">👠</div>`}
            ${g.hex ? `<span style="width:13px;height:13px;border-radius:50%;background:${g.hex};border:1px solid #ddd;flex-shrink:0"></span>` : ''}
            <span style="font-size:0.86rem;font-weight:600;line-height:1.2">${g.nombre}</span>
            <span style="font-size:0.78rem;color:#888">· ${g.color}</span>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap">${chips}</div>
        </div>`
    }).join('')
    resultadosDiv.style.display = 'block'
    return
  }

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
  const esNuevo = !datos  // new color starts expanded, existing starts collapsed

  let fotosHTML = ''
  const fotos = (window._variantesFotos && window._variantesFotos[i]) || []
  if (fotos.length > 0) {
    fotosHTML = fotos.map((foto, fIdx) => {
      const src = foto.type === 'url' ? foto.value : foto.previewUrl
      const esPortada = foto.isPortada
      return `
        <div style="position:relative;cursor:pointer" data-fidx="${fIdx}">
          <img src="${src}" 
               style="width:72px;height:72px;object-fit:cover;border-radius:10px;border:3px solid ${esPortada ? '#E91E8C' : '#eee'}"
               onclick="seleccionarPortadaClave(${i}, ${fIdx})">
          ${esPortada ? '<span class="portada-badge" style="position:absolute;top:-6px;left:-6px;background:#E91E8C;color:white;font-size:0.55rem;padding:2px 6px;border-radius:100px;font-weight:700;pointer-events:none">PORTADA</span>' : ''}
          <button type="button" onclick="eliminarFotoClave(${i}, ${fIdx})" 
                  style="position:absolute;top:-6px;right:-6px;background:#c62828;color:white;border:none;border-radius:50%;width:18px;height:18px;cursor:pointer;font-size:0.65rem;display:flex;align-items:center;justify-content:center">✕</button>
        </div>
      `
    }).join('')
  }

  const portadaFoto = fotos.find(f => f.isPortada) || fotos[0]
  const thumbSrc = portadaFoto ? (portadaFoto.type === 'url' ? portadaFoto.value : portadaFoto.previewUrl) : ''
  const thumbHTML = thumbSrc
    ? `<img src="${thumbSrc}" style="width:36px;height:36px;object-fit:cover;border-radius:6px;border:1px solid #eee;flex-shrink:0">`
    : `<div style="width:36px;height:36px;background:#f0f0f0;border-radius:6px;border:2px dashed #ddd;display:flex;align-items:center;justify-content:center;font-size:1rem;color:#ccc;flex-shrink:0">📷</div>`

  return `
    <div class="variante-item" id="variante-${i}" style="margin-bottom:0.625rem;border-radius:12px;border:1px solid #eee;box-shadow:0 1px 4px rgba(0,0,0,0.05);overflow:hidden">

      <!-- ── Compact header: always visible ── -->
      <div onclick="toggleVariante(${i})"
           style="display:flex;align-items:center;gap:10px;padding:0.75rem 1rem;background:white;cursor:pointer;user-select:none">
        <div id="v${i}-swatch-header"
             style="width:26px;height:26px;border-radius:50%;background:${d.color_hex || '#cccccc'};border:2px solid #ddd;flex-shrink:0"></div>
        <span id="v${i}-header-label"
              style="font-weight:600;color:#333;font-size:0.9rem;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${d.color || 'Color ' + (i + 1)}
        </span>
        <div id="v${i}-header-thumb" style="flex-shrink:0">${thumbHTML}</div>
        ${i === 0 ? '<span style="font-size:0.65rem;background:#E91E8C;color:white;padding:2px 8px;border-radius:100px;font-weight:700;flex-shrink:0">PORTADA</span>' : ''}
        <span id="v${i}-chevron"
              style="color:#bbb;font-size:0.8rem;flex-shrink:0;transition:transform 0.2s;transform:${esNuevo ? 'rotate(180deg)' : 'rotate(0deg)'}">▼</span>
        ${i > 0 ? `<button type="button" onclick="event.stopPropagation();eliminarColorVariante(${i},this)"
                style="background:#ffebee;border:1px solid #ffcdd2;color:#c62828;border-radius:6px;padding:3px 8px;cursor:pointer;font-size:0.75rem;font-weight:600;flex-shrink:0;line-height:1">✕</button>` : ''}
      </div>

      <!-- ── Expandable body ── -->
      <div id="v${i}-body" style="display:${esNuevo ? 'block' : 'none'};padding:1rem;background:#fafafa;border-top:1px solid #f0f0f0">

        <!-- Palette -->
        <div style="margin-bottom:0.75rem">
          <label style="font-size:0.76rem;font-weight:600;color:#888;display:block;margin-bottom:5px">Paleta rápida</label>
          <div style="display:flex;flex-wrap:wrap;gap:5px">
            ${COLORES_SUGERIDOS.map(c => `
              <div onclick="seleccionarColor(${i}, '${c.hex}', '${c.nombre}')"
                   title="${c.nombre}"
                   style="width:24px;height:24px;background:${c.hex};border-radius:50%;cursor:pointer;border:2px solid #ddd;flex-shrink:0;transition:transform 0.15s"
                   onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Color picker + name -->
        <div style="display:flex;gap:10px;align-items:center;margin-bottom:0.75rem;flex-wrap:wrap">
          <input type="color" id="v${i}-hex" value="${d.color_hex || '#000000'}"
                 style="width:40px;height:40px;border:2px solid #eee;border-radius:8px;cursor:pointer;padding:2px;flex-shrink:0"
                 oninput="var s=document.getElementById('v${i}-swatch-header');if(s)s.style.background=this.value">
          <input class="form-input" id="v${i}-nombre"
                 placeholder="Nombre del color (ej: Negro, Nude, Carey...)"
                 value="${d.color || ''}" style="flex:1;min-width:130px"
                 oninput="actualizarTablaStock();var lbl=document.getElementById('v${i}-header-label');if(lbl)lbl.textContent=this.value||'Color ${i+1}'">
        </div>

        <div style="background:white;border-radius:10px;padding:0.875rem;border:1px dashed #ddd">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;flex-wrap:wrap;gap:6px">
            <div>
              <p style="font-size:0.8rem;font-weight:600;color:#555;margin-bottom:1px">Fotos de este color</p>
              <p style="font-size:0.7rem;color:#aaa">La 1ª foto será portada · tócala para cambiarla</p>
            </div>
            <button type="button" class="btn btn-secondary"
                    onclick="document.getElementById('v${i}-imgs').click()"
                    style="font-size:0.8rem;padding:5px 12px">📷 Subir fotos</button>
            <input type="file" id="v${i}-imgs" multiple accept="image/*"
                   onchange="previsualizarImagenes(this,${i})" style="display:none">
          </div>
          <div id="v${i}-preview" style="display:flex;gap:8px;flex-wrap:wrap">
            ${fotosHTML || `<div style="width:64px;height:64px;background:#f5f5f5;border-radius:8px;border:2px dashed #ddd;display:flex;align-items:center;justify-content:center;font-size:1.3rem;color:#ccc">📷</div>`}
          </div>
        </div>
      </div>
    </div>
  `
}

window.eliminarColorVariante = async (idx, btn) => {
  const nombreInput = document.getElementById('v' + idx + '-nombre')
  const color = nombreInput ? nombreInput.value : null

  if (color && window._productoEditandoId && window._coloresExistentes) {
    if (!confirm('Eliminar el color ' + color + ' y todas sus variantes?')) return

    try {
      const resVars = await fetch(API + '/variantes/producto/' + window._productoEditandoId)
      const variantes = await resVars.json()
      const varsColor = variantes.filter(v => v.color === color)
      
      for (const v of varsColor) {
        await fetch(API + '/variantes/' + v.id + '/eliminar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
      }

      window._coloresExistentes = window._coloresExistentes.filter(c => c.color !== color)
      if (!window._coloresEliminados) window._coloresEliminados = []
      window._coloresEliminados.push(color)
      
      alert('Color eliminado correctamente')
    } catch(e) {
      alert('Error eliminando el color')
      return
    }
  }

  btn.closest('.variante-item').remove()
  
  if (window._variantesFotos && window._variantesFotos[idx]) {
    window._variantesFotos[idx].forEach(f => {
      if (f.type === 'file' && f.previewUrl) URL.revokeObjectURL(f.previewUrl)
    })
    delete window._variantesFotos[idx]
  }

  actualizarTablaStock()
}

window.actualizarVistaPreviews = (idx) => {
  const preview = document.getElementById('v' + idx + '-preview')
  if (!preview) return

  const fotos = window._variantesFotos[idx] || []
  if (fotos.length === 0) {
    preview.innerHTML = `<div style="width:64px;height:64px;background:#f5f5f5;border-radius:8px;border:2px dashed #ddd;display:flex;align-items:center;justify-content:center;font-size:1.3rem;color:#ccc">📷</div>`
    return
  }

  preview.innerHTML = fotos.map((foto, fIdx) => {
    const src = foto.type === 'url' ? foto.value : foto.previewUrl
    const esPortada = foto.isPortada
    return `
      <div style="position:relative;cursor:pointer" data-fidx="${fIdx}">
        <img src="${src}" 
             style="width:72px;height:72px;object-fit:cover;border-radius:10px;border:3px solid ${esPortada ? '#E91E8C' : '#eee'}"
             onclick="seleccionarPortadaClave(${idx}, ${fIdx})">
        ${esPortada ? '<span class="portada-badge" style="position:absolute;top:-6px;left:-6px;background:#E91E8C;color:white;font-size:0.55rem;padding:2px 6px;border-radius:100px;font-weight:700;pointer-events:none">PORTADA</span>' : ''}
        <button type="button" onclick="eliminarFotoClave(${idx}, ${fIdx})" 
                style="position:absolute;top:-6px;right:-6px;background:#c62828;color:white;border:none;border-radius:50%;width:18px;height:18px;cursor:pointer;font-size:0.65rem;display:flex;align-items:center;justify-content:center">✕</button>
      </div>
    `
  }).join('')

  const headerThumb = document.getElementById('v' + idx + '-header-thumb')
  if (headerThumb) {
    const portadaFoto = fotos.find(f => f.isPortada) || fotos[0]
    const thumbSrc = portadaFoto ? (portadaFoto.type === 'url' ? portadaFoto.value : portadaFoto.previewUrl) : ''
    headerThumb.innerHTML = thumbSrc 
      ? `<img src="${thumbSrc}" style="width:36px;height:36px;object-fit:cover;border-radius:6px;border:1px solid #eee;flex-shrink:0">`
      : `<div style="width:36px;height:36px;background:#f0f0f0;border-radius:6px;border:2px dashed #ddd;display:flex;align-items:center;justify-content:center;font-size:1rem;color:#ccc;flex-shrink:0">📷</div>`
  }
}

window.seleccionarPortadaClave = (idx, fIdx) => {
  const fotos = window._variantesFotos[idx] || []
  fotos.forEach((foto, i) => {
    foto.isPortada = (i === fIdx)
  })
  
  const portadaItem = fotos.splice(fIdx, 1)[0]
  fotos.unshift(portadaItem)
  
  window.actualizarVistaPreviews(idx)
}

window.eliminarFotoClave = (idx, fIdx) => {
  const fotos = window._variantesFotos[idx] || []
  const removed = fotos.splice(fIdx, 1)[0]
  
  if (removed && removed.type === 'file' && removed.previewUrl) {
    URL.revokeObjectURL(removed.previewUrl)
  }

  const nombreInput = document.getElementById('v' + idx + '-nombre')
  if (nombreInput && window._coloresExistentes && removed && removed.type === 'url') {
    const color = nombreInput.value
    const colorExistente = window._coloresExistentes.find(c => c.color === color)
    if (colorExistente) {
      if (colorExistente.imagenes) {
        colorExistente.imagenes = colorExistente.imagenes.filter(u => u !== removed.value)
      }
      if (colorExistente.foto_url === removed.value) {
        colorExistente.foto_url = colorExistente.imagenes && colorExistente.imagenes.length > 0 
          ? colorExistente.imagenes[0] 
          : null
      }
    }
  }

  if (removed && removed.isPortada && fotos.length > 0) {
    fotos[0].isPortada = true
  }

  window.actualizarVistaPreviews(idx)
}

window.mostrarFormProducto = (datos) => {
  if (!datos) window._coloresExistentes = null
  varianteCount = window._coloresExistentes && window._coloresExistentes.length > 0 
  ? window._coloresExistentes.length 
  : 1
  const d = datos || {}

  window._variantesFotos = {}
  if (window._coloresExistentes && window._coloresExistentes.length > 0) {
    window._coloresExistentes.forEach((c, idx) => {
      window._variantesFotos[idx] = []
      if (c.imagenes && c.imagenes.length > 0) {
        c.imagenes.forEach((url, fIdx) => {
          window._variantesFotos[idx].push({ type: 'url', value: url, isPortada: fIdx === 0 })
        })
      } else if (c.foto_url) {
        window._variantesFotos[idx].push({ type: 'url', value: c.foto_url, isPortada: true })
      }
    })
  } else {
    window._variantesFotos[0] = []
  }

  const content = document.getElementById('content')
  content.innerHTML = `
    <div class="table-card" style="padding:2rem;overflow:visible">
      <div style="position:sticky;top:0;z-index:50;background:white;border-bottom:1px solid #eee;padding:0.75rem 1.5rem;display:flex;align-items:center;justify-content:space-between;margin:-2rem -2rem 1.5rem -2rem;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
        <button type="button" class="btn btn-secondary" onclick="navegarA('productos')" style="display:flex;align-items:center;gap:6px;padding:6px 14px;font-size:0.85rem">← Volver</button>
        <button type="button" id="btn-guardar" class="btn btn-primary" onclick="guardarProducto()" style="padding:6px 18px;font-size:0.85rem">💾 Guardar</button>
      </div>

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
              <p style="font-size:0.72rem;color:#888;margin-bottom:4px">Blanco = menudeo - $100</p>
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
        ${window._coloresExistentes && window._coloresExistentes.length > 1 ? `
  <div style="background:#e8f5e9;border-radius:8px;padding:1rem;margin-bottom:1rem;border:1px solid #a5d6a7">
    <p style="font-size:0.8rem;font-weight:600;color:#2e7d32;margin-bottom:8px">🖼️ Color portada (aparece primero en la tienda)</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      ${window._coloresExistentes.map((c, i) => `
        <div onclick="seleccionarColorPortada(${i})" id="portada-color-${i}"
             style="display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:8px;border:2px solid ${i === 0 ? '#2e7d32' : '#ddd'};cursor:pointer;background:${i === 0 ? '#e8f5e9' : 'white'}">
          <div style="width:16px;height:16px;border-radius:50%;background:${c.color_hex};border:1px solid #ddd;flex-shrink:0"></div>
          <span style="font-size:0.82rem;font-weight:500">${c.color}</span>
          ${i === 0 ? '<span style="font-size:0.68rem;color:#2e7d32;font-weight:700">✓ PORTADA</span>' : ''}
        </div>
      `).join('')}
    </div>
  </div>
` : ''}
<div id="variantes-container">
  ${window._coloresExistentes && window._coloresExistentes.length > 0
    ? window._coloresExistentes.map((c, i) => renderVariante(i, c)).join('')
    : renderVariante(0, null)}
</div>
        <button type="button" class="btn btn-secondary" onclick="agregarVariante()">+ Agregar otro color</button>
      </div>

      <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
        <p style="font-weight:600;margin-bottom:1rem;color:#333">Tallas disponibles</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(70px,1fr));gap:8px">
  ${TALLAS.map(t => `
    <label class="talla-label" style="display:flex;align-items:center;justify-content:center;gap:4px;padding:10px 8px;border-radius:6px;cursor:pointer;border:2px solid ${d.tallas_disponibles && d.tallas_disponibles.includes(t) ? '#E91E8C' : 'transparent'};background:${d.tallas_disponibles && d.tallas_disponibles.includes(t) ? '#fce4f3' : '#f5f5f5'}">
      <input type="checkbox" value="${t}" style="display:none" onchange="toggleTalla(this)" ${d.tallas_disponibles && d.tallas_disponibles.includes(t) ? 'checked' : ''}>
      <span>${t}</span>
    </label>
  `).join('')}
</div>
      </div>

      <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
        <p style="font-weight:600;margin-bottom:0.5rem;color:#333">${d.id ? 'Agregar resurtido' : 'Stock inicial'}</p>
        <p style="font-size:0.8rem;color:#888;margin-bottom:1rem">${d.id ? 'Los pares que captures aquí se suman al inventario actual como entrada de mercancía.' : 'Captura cuantos pares tienes disponibles. Se asignarán a la sucursal seleccionada.'}</p>
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
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:8px">
          <div>
            <p style="font-weight:600;color:#333;margin-bottom:2px">Logistica y SEO</p>
            <p style="font-size:0.75rem;color:#aaa">Los campos de SEO se llenan automaticamente, pero puedes editarlos.</p>
          </div>
          <button type="button" id="btn-generar-seo" onclick="generarSEO()"
                  style="display:flex;align-items:center;gap:6px;padding:7px 16px;background:#f3e5f5;border:1px solid #ce93d8;color:#6a1b9a;border-radius:8px;cursor:pointer;font-size:0.82rem;font-weight:600;transition:all 0.2s">
            ✨ Generar SEO
          </button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div>
            <label class="form-label">Peso en kilos (para envio)</label>
            <input class="form-input" id="f-peso" type="number" step="0.01" placeholder="Ej: 0.45" value="${d.peso_gramos ? (d.peso_gramos / 1000).toFixed(2) : ''}">
          </div>
          <div>
            <label class="form-label" style="display:flex;align-items:center;justify-content:space-between">
              <span>Slug URL <span style="color:#888;font-size:0.72rem">(para SEO)</span></span>
              <span style="font-size:0.68rem;background:#e8f5e9;color:#2e7d32;padding:1px 6px;border-radius:100px;font-weight:600">Auto</span>
            </label>
            <input class="form-input" id="f-slug" placeholder="se genera del nombre del producto" value="${d.slug || ''}" oninput="this.dataset.autofilled='false'">
          </div>
          <div>
            <label class="form-label" style="display:flex;align-items:center;justify-content:space-between">
              <span>Meta titulo <span style="color:#888;font-size:0.72rem">(SEO)</span></span>
              <span style="font-size:0.68rem;background:#e8f5e9;color:#2e7d32;padding:1px 6px;border-radius:100px;font-weight:600">Auto</span>
            </label>
            <input class="form-input" id="f-metatitulo" placeholder="se genera del nombre del producto" value="${d.meta_titulo || ''}" oninput="this.dataset.autofilled='false'">
          </div>
          <div>
            <label class="form-label" style="display:flex;align-items:center;justify-content:space-between">
              <span>Meta descripcion <span style="color:#888;font-size:0.72rem">(Google)</span></span>
              <span id="metadesc-counter" style="font-size:0.72rem;color:${d.meta_descripcion && d.meta_descripcion.length > 140 ? '#e65100' : '#888'}">${d.meta_descripcion ? d.meta_descripcion.length + '/160' : '0/160'}</span>
            </label>
            <textarea class="form-input" id="f-metadesc" rows="3"
                      placeholder="Usa ✨ Generar SEO para crear una descripcion optimizada para Google (max 160 caracteres)"
                      style="resize:vertical"
                      oninput="var c=document.getElementById('metadesc-counter');if(c){c.textContent=this.value.length+'/160';c.style.color=this.value.length>160?'#c62828':this.value.length>140?'#e65100':'#888'}">${d.meta_descripcion || ''}</textarea>
          </div>
        </div>
      </div>

      <div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
          <p style="font-weight:600;color:#333;margin:0">🎬 Video del producto</p>
          <span style="font-size:0.72rem;background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:100px;font-weight:600">Opcional</span>
        </div>
        <p style="font-size:0.8rem;color:#888;margin-bottom:12px">Pega un link de YouTube, TikTok, Vimeo o sube un MP4. Se mostrará en el modal del producto en la tienda.</p>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px">
          <input class="form-input" id="f-video-url"
                 placeholder="https://youtube.com/watch?v=... · https://tiktok.com/... · archivo.mp4"
                 value="${d.video_url || ''}"
                 style="flex:1;min-width:200px"
                 oninput="previsualizarVideoPanel(this.value)">
          <button type="button"
                  onclick="document.getElementById('f-video-file').click()"
                  style="background:#f3f4f6;border:1.5px solid #d1d5db;border-radius:8px;padding:7px 14px;cursor:pointer;font-size:0.82rem;font-weight:600;color:#374151;white-space:nowrap">
            📁 Subir video
          </button>
          <input type="file" id="f-video-file" accept="video/*" style="display:none"
                 onchange="subirVideoProducto(this)">
        </div>
        <div id="video-preview-panel" style="margin-top:8px">
          ${d.video_url ? `<div style="font-size:0.8rem;color:#555;background:#f5f5f5;border-radius:8px;padding:8px 12px;display:flex;align-items:center;gap:8px"><span>🎬</span><a href="${d.video_url}" target="_blank" rel="noopener" style="color:#E91E8C;word-break:break-all;flex:1">${d.video_url}</a></div>` : ''}
        </div>
      </div>

      <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1.5rem">
        <input type="hidden" id="f-producto-id" value="${d.id || ''}">
        <button type="button" class="btn btn-primary" id="btn-guardar" onclick="guardarProducto()">💾 Guardar producto</button>
      </div>
    </div>
  `

  fetch(API + '/sucursales/').then(r => r.json()).then(sucursales => {
    const sel = document.getElementById('f-sucursal-stock')
    if (sel) sel.innerHTML = sucursales.map(s => `<option value="${s.id}">${s.nombre}</option>`).join('')
      setTimeout(() => actualizarTablaStock(), 100)
  })
}
window.seleccionarColorPortada = (idx) => {
  if (!window._coloresExistentes) return

  // Reordenar _variantesFotos para que quede sincronizado con el nuevo orden de colores
  // (color en idx pasa a posición 0, los demás se desplazan)
  const n = window._coloresExistentes.length
  const fotosSincronizadas = {}
  fotosSincronizadas[0] = window._variantesFotos[idx] || []
  let nuevoIdx = 1
  for (let i = 0; i < n; i++) {
    if (i === idx) continue
    fotosSincronizadas[nuevoIdx++] = window._variantesFotos[i] || []
  }
  window._variantesFotos = fotosSincronizadas

  // Mover el color seleccionado al inicio
  const color = window._coloresExistentes.splice(idx, 1)[0]
  window._coloresExistentes.unshift(color)

  // Actualizar UI de botones portada
  document.querySelectorAll('[id^="portada-color-"]').forEach((el, i) => {
    const esPortada = i === 0
    el.style.borderColor = esPortada ? '#2e7d32' : '#ddd'
    el.style.background = esPortada ? '#e8f5e9' : 'white'
    el.innerHTML = `
      <div style="width:16px;height:16px;border-radius:50%;background:${window._coloresExistentes[i].color_hex};border:1px solid #ddd;flex-shrink:0"></div>
      <span style="font-size:0.82rem;font-weight:500">${window._coloresExistentes[i].color}</span>
      ${esPortada ? '<span style="font-size:0.68rem;color:#2e7d32;font-weight:700">✓ PORTADA</span>' : ''}
    `
    el.setAttribute('onclick', 'seleccionarColorPortada(' + i + ')')
  })

  // Re-renderizar variantes en nuevo orden
  const container = document.getElementById('variantes-container')
  if (container) {
    container.innerHTML = window._coloresExistentes.map((c, i) => renderVariante(i, c)).join('')
  }
}

const _slugify = (text) =>
  text.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-').replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')

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
  // Auto-fill SEO fields: rellena si está vacío O si fue auto-rellenado anteriormente
  // (data-autofilled='true' indica que el valor lo puso este código, no el usuario)
  if (nombre) {
    const slugInput = document.getElementById('f-slug')
    if (slugInput && (!slugInput.value || slugInput.dataset.autofilled === 'true')) {
      slugInput.value = _slugify(nombre)
      slugInput.dataset.autofilled = 'true'
    }
    const metaTitulo = document.getElementById('f-metatitulo')
    if (metaTitulo && (!metaTitulo.value || metaTitulo.dataset.autofilled === 'true')) {
      metaTitulo.value = nombre.trim() + ' | Zapatillas May'
      metaTitulo.dataset.autofilled = 'true'
    }
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

// Fallback template-based SEO (usado si la IA no responde)
function _generarSEOTemplate(nombre, descripcion, categoria, material, tacon, tipoTacon, precio) {
  const slugInput = document.getElementById('f-slug')
  const metaTituloInput = document.getElementById('f-metatitulo')
  const metaDescInput = document.getElementById('f-metadesc')

  if (slugInput && !slugInput.value) slugInput.value = _slugify(nombre)
  if (metaTituloInput && !metaTituloInput.value) metaTituloInput.value = nombre + ' | Zapatillas May'

  const partes = ['Compra ' + nombre + ' en Zapatillas May.']
  if (descripcion) {
    const frase = descripcion.split(/[.!?\n]/)[0].trim()
    if (frase.length > 10) partes.push(frase.slice(0, 65) + (frase.length > 65 ? '...' : ''))
  } else if (categoria) {
    const catMap = { sandalia:'Sandalia elegante para dama', bota:'Bota de moda para dama', tenis:'Tenis casual para dama', mocasin:'Mocasín cómodo para dama', zapatilla:'Zapatilla de moda para dama', plataforma:'Plataforma cómoda para dama' }
    partes.push((catMap[categoria] || categoria) + '.')
  }
  if (material) partes.push('Material ' + material + '.')
  if (tacon && tipoTacon) partes.push('Tacón ' + tipoTacon + ' ' + tacon + ' cm.')
  else if (tacon) partes.push('Tacón ' + tacon + ' cm.')
  if (precio) partes.push('Desde $' + parseInt(precio).toLocaleString('es-MX') + ' MXN.')
  partes.push('Envío a todo México.')

  let desc = partes.join(' ')
  if (desc.length > 160) desc = desc.slice(0, 157) + '...'
  if (metaDescInput) _aplicarMetaDesc(desc)
}

function _aplicarMetaDesc(desc) {
  const metaDescInput = document.getElementById('f-metadesc')
  if (metaDescInput) {
    metaDescInput.value = desc
    const counter = document.getElementById('metadesc-counter')
    if (counter) {
      counter.textContent = desc.length + '/160'
      counter.style.color = desc.length > 160 ? '#c62828' : desc.length > 140 ? '#e65100' : '#4caf50'
    }
  }
}

window.generarSEO = async () => {
  const nombre     = (document.getElementById('f-nombre')?.value || '').trim()
  const descripcion = (document.getElementById('f-descripcion')?.value || '').trim()
  const categoria  = (document.getElementById('f-categoria')?.value || '').trim()
  const material   = (document.getElementById('f-material')?.value || '').trim()
  const tacon      = (document.getElementById('f-tacon')?.value || '').trim()
  const tipoTacon  = (document.getElementById('f-tipotacon')?.value || '').trim()
  const precio     = (document.getElementById('f-menudeo')?.value || '').trim()
  const horma      = (document.getElementById('f-horma')?.value || '').trim()

  if (!nombre && !descripcion) {
    alert('Escribe el nombre o la descripción del producto primero')
    return
  }

  const btn = document.getElementById('btn-generar-seo')
  if (btn) {
    btn.innerHTML = '<span style="display:inline-block;animation:spin 0.8s linear infinite">⏳</span> Analizando...'
    btn.disabled = true
    btn.style.opacity = '0.7'
  }

  try {
    const res = await fetch(API + '/productos/generar-seo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, descripcion, categoria, material, tacon, tipo_tacon: tipoTacon, precio, horma })
    })
    const data = await res.json()

    if (data.error) throw new Error(data.error)

    // Aplicar resultados de la IA
    const slugInput = document.getElementById('f-slug')
    const metaTituloInput = document.getElementById('f-metatitulo')

    if (slugInput && data.slug) slugInput.value = data.slug
    if (metaTituloInput && data.meta_titulo) metaTituloInput.value = data.meta_titulo
    if (data.meta_descripcion) _aplicarMetaDesc(data.meta_descripcion)

    // Si la IA sugirió un nombre de producto más descriptivo, mostrarlo sutilmente
    if (data.nombre_producto && nombre !== data.nombre_producto) {
      const nombreInput = document.getElementById('f-nombre')
      if (nombreInput) {
        // Mostrar sugerencia de nombre sin reemplazar automáticamente
        let sug = document.getElementById('seo-nombre-sugerido')
        if (!sug) {
          sug = document.createElement('div')
          sug.id = 'seo-nombre-sugerido'
          sug.style.cssText = 'margin-top:6px;padding:8px 12px;background:#f3e5f5;border-radius:8px;border:1px solid #ce93d8;font-size:0.78rem;color:#6a1b9a;display:flex;align-items:center;justify-content:space-between;gap:8px'
          nombreInput.parentElement.appendChild(sug)
        }
        sug.dataset.sugerido = data.nombre_producto
        sug.innerHTML = '<span>✨ Nombre sugerido para la tienda: <strong>' + data.nombre_producto + '</strong></span>' +
          '<button onclick="var p=this.closest(\'#seo-nombre-sugerido\');document.getElementById(\'f-nombre\').value=p.dataset.sugerido;p.remove()" style="background:#6a1b9a;color:white;border:none;border-radius:6px;padding:3px 10px;cursor:pointer;font-size:0.75rem;white-space:nowrap">Usar este</button>'
      }
    }

    if (btn) {
      btn.innerHTML = '✅ SEO generado con IA'
      btn.style.background = '#e8f5e9'
      btn.style.color = '#2e7d32'
      btn.style.borderColor = '#a5d6a7'
      btn.style.opacity = '1'
      btn.disabled = false
      setTimeout(() => { btn.innerHTML = '✨ Generar SEO'; btn.style.background = ''; btn.style.color = ''; btn.style.borderColor = '' }, 3000)
    }

  } catch(e) {
    // Fallback a plantilla
    _generarSEOTemplate(nombre, descripcion, categoria, material, tacon, tipoTacon, precio)
    if (btn) {
      btn.innerHTML = '✅ SEO generado'
      btn.style.background = '#fff8e1'
      btn.style.color = '#f57f17'
      btn.style.borderColor = '#ffe082'
      btn.style.opacity = '1'
      btn.disabled = false
      setTimeout(() => { btn.innerHTML = '✨ Generar SEO'; btn.style.background = ''; btn.style.color = ''; btn.style.borderColor = '' }, 3000)
    }
  }
}

window.seleccionarColor = (idx, hex, nombre) => {
  const hexInput = document.getElementById('v' + idx + '-hex')
  const nombreInput = document.getElementById('v' + idx + '-nombre')
  if (hexInput) {
    hexInput.value = hex
    const swatch = document.getElementById('v' + idx + '-swatch-header')
    if (swatch) swatch.style.background = hex
  }
  if (nombreInput) {
    nombreInput.value = nombre
    const lbl = document.getElementById('v' + idx + '-header-label')
    if (lbl) lbl.textContent = nombre
  }
  actualizarTablaStock()
}

window.toggleVariante = (i) => {
  const body = document.getElementById('v' + i + '-body')
  const chevron = document.getElementById('v' + i + '-chevron')
  if (!body) return
  const isOpen = body.style.display !== 'none'
  body.style.display = isOpen ? 'none' : 'block'
  if (chevron) chevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)'
}

window.agregarVariante = () => {
  // Collapse all currently open color cards
  document.querySelectorAll('.variante-item').forEach(item => {
    const m = item.id && item.id.match(/^variante-(\d+)$/)
    if (m) {
      const idx = m[1]
      const body = document.getElementById('v' + idx + '-body')
      const chevron = document.getElementById('v' + idx + '-chevron')
      if (body) body.style.display = 'none'
      if (chevron) chevron.style.transform = 'rotate(0deg)'
    }
  })
  const i = varianteCount++
  window._variantesFotos = window._variantesFotos || {}
  window._variantesFotos[i] = []
  const container = document.getElementById('variantes-container')
  const div = document.createElement('div')
  div.innerHTML = renderVariante(i, null)
  container.appendChild(div.firstElementChild)
  // Scroll to the new card
  const newCard = document.getElementById('variante-' + i)
  if (newCard) setTimeout(() => newCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 60)
}

window.previsualizarImagenes = (input, idx) => {
  if (!input.files || !input.files.length) return

  window._variantesFotos = window._variantesFotos || {}
  if (!window._variantesFotos[idx]) window._variantesFotos[idx] = []

  const fotos = window._variantesFotos[idx]

  Array.from(input.files).forEach(file => {
    fotos.push({
      type: 'file',
      value: file,
      previewUrl: URL.createObjectURL(file),
      isPortada: false
    })
  })

  // Si ninguna tiene portada, marcar la primera
  if (!fotos.some(f => f.isPortada) && fotos.length > 0) fotos[0].isPortada = true

  // Limpiar el input para poder abrir el selector otra vez (distintas carpetas)
  input.value = ''

  window.actualizarVistaPreviews(idx)
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

  contenedor.innerHTML = colores.map(c => `
    <div style="background:#f9f9f9;border-radius:10px;padding:1rem;margin-bottom:1rem;border:1px solid #eee">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:0.75rem">
        <div style="width:14px;height:14px;border-radius:50%;background:${c.hex};border:1px solid #ddd;flex-shrink:0"></div>
        <span style="font-size:0.9rem;font-weight:600">${c.nombre}</span>
        <span style="margin-left:auto;font-size:0.82rem;color:#E91E8C;font-weight:700">Total: <span id="total-color-${c.id}">0</span> pares</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px">
        ${tallas.map(t => `
          <div style="display:flex;align-items:center;gap:6px;background:white;padding:6px 8px;border-radius:8px;border:1px solid #eee">
            <span style="font-size:0.85rem;font-weight:600;color:#555;min-width:32px">T${t}</span>
            <button type="button"
                    onclick="const el=document.getElementById('stock-ini-${c.id}-${t.replace('.','_')}');el.value=Math.max(0,(parseInt(el.value)||0)-1);actualizarTotalColor('${c.id}')"
                    style="background:#f0f0f0;border:none;border-radius:6px;width:32px;height:32px;cursor:pointer;font-size:1.1rem;font-weight:700;touch-action:manipulation;flex-shrink:0">−</button>
            <input type="number" min="0" placeholder="0"
                   id="stock-ini-${c.id}-${t.replace('.','_')}"
                   oninput="actualizarTotalColor('${c.id}')"
                   style="flex:1;text-align:center;padding:5px;border:1px solid #ddd;border-radius:6px;font-size:0.9rem;font-weight:700;min-width:0">
            <button type="button"
                    onclick="const el=document.getElementById('stock-ini-${c.id}-${t.replace('.','_')}');el.value=(parseInt(el.value)||0)+1;actualizarTotalColor('${c.id}')"
                    style="background:#f0f0f0;border:none;border-radius:6px;width:32px;height:32px;cursor:pointer;font-size:1.1rem;font-weight:700;touch-action:manipulation;flex-shrink:0">+</button>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('')
}
window.actualizarTotalColor = (colorId) => {
  const inputs = document.querySelectorAll('[id^="stock-ini-' + colorId + '-"]')
  let total = 0
  inputs.forEach(input => total += parseInt(input.value) || 0)
  const totalEl = document.getElementById('total-color-' + colorId)
  if (totalEl) totalEl.textContent = total
}

async function subirImagenesVariantes() {
  const variantes = document.querySelectorAll('.variante-item')
  const resultado = []

  for (const v of variantes) {
    const idx = parseInt(v.id.replace('variante-', ''))
    const hex = document.getElementById('v' + idx + '-hex')
    const nombre = document.getElementById('v' + idx + '-nombre')

    if (!nombre || !nombre.value) continue

    const fotos = window._variantesFotos[idx] || []
    console.log(`[Fotos] Color "${nombre.value}": procesando ${fotos.length} foto(s)`)

    const promesasSubida = fotos.map(async (foto) => {
      if (foto.type === 'url') {
        return foto.value
      } else {
        const formData = new FormData()
        formData.append('archivo', foto.value)
        for (let intento = 1; intento <= 3; intento++) {
          try {
            const res = await fetch(API + '/imagenes/subir', { method: 'POST', body: formData })
            if (res.ok) {
              const data = await res.json()
              if (data.url) return data.url
            }
          } catch(e) {}
          if (intento < 3) await new Promise(r => setTimeout(r, 1200))
        }
        console.error(`[Fotos] FALLÓ subir foto de "${nombre.value}" tras 3 intentos`)
        return null
      }
    })

    const urlsResultados = await Promise.all(promesasSubida)
    const urlsValidas = urlsResultados.filter(Boolean)

    const fallidas = urlsResultados.length - urlsValidas.length
    if (fallidas > 0) alert(`⚠️ ${fallidas} foto(s) de "${nombre.value}" no se pudieron subir. Intenta de nuevo.`)

    resultado.push({ 
      color: nombre.value, 
      color_hex: hex ? hex.value : '#000000', 
      imagenes: urlsValidas
    })
  }
  return resultado
}

window.previsualizarVideoPanel = (url) => {
  const prev = document.getElementById('video-preview-panel')
  if (!prev) return
  if (!url || !url.trim()) { prev.innerHTML = ''; return }
  prev.innerHTML = `<div style="font-size:0.8rem;color:#555;background:#f5f5f5;border-radius:8px;padding:8px 12px;display:flex;align-items:center;gap:8px"><span>🎬</span><a href="${url}" target="_blank" rel="noopener" style="color:#E91E8C;word-break:break-all;flex:1">${url}</a></div>`
}

window.subirVideoProducto = async (input) => {
  const file = input.files[0]
  if (!file) return
  const urlInput = document.getElementById('f-video-url')
  const prev = document.getElementById('video-preview-panel')
  if (prev) prev.innerHTML = '<div style="color:#888;font-size:0.82rem;padding:8px 0">Subiendo video... ⏳ (puede tardar unos segundos)</div>'
  try {
    const formData = new FormData()
    formData.append('archivo', file)
    const res = await fetch(API + '/imagenes/videos/subir', { method: 'POST', body: formData })
    const data = await res.json()
    if (data.url) {
      if (urlInput) urlInput.value = data.url
      window.previsualizarVideoPanel(data.url)
    } else {
      if (prev) prev.innerHTML = '<div style="color:#c62828;font-size:0.82rem;padding:8px 0">❌ Error al subir. Intenta pegar el URL manualmente.</div>'
    }
  } catch (e) {
    if (prev) prev.innerHTML = '<div style="color:#c62828;font-size:0.82rem;padding:8px 0">❌ Error de red. Intenta pegar el URL manualmente.</div>'
  }
  input.value = ''
}

window.guardarProducto = async () => {
  // Evitar doble submit
  if (window._guardandoProducto) return
  window._guardandoProducto = true
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
  console.log(`[Guardar] Tallas seleccionadas (${tallas.length}):`, tallas)
  const variantesData = await subirImagenesVariantes()
  console.log(`[Guardar] Colores a guardar (${variantesData.length}):`, variantesData.map(v => v.color))
  const colores = []
document.querySelectorAll('.variante-item').forEach(v => {
  const id = v.id.replace('variante-', '')
  const nombre = document.getElementById('v' + id + '-nombre')
  const hex = document.getElementById('v' + id + '-hex')
  if (nombre && nombre.value) colores.push({ id, nombre: nombre.value, hex: hex ? hex.value : '#000' })
})
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
    imagen_principal: (() => {
      // Leer la foto marcada como PORTADA directamente del DOM
      const _prev = document.getElementById('v0-preview')
      const _pd   = _prev ? _prev.querySelector('[data-es-portada="true"]') : null
      if (_pd && _pd.dataset.url) return _pd.dataset.url
      // Fallback: primera imagen del primer color
      return variantesData.length > 0 && variantesData[0].imagenes.length > 0
        ? variantesData[0].imagenes[0] : null
    })(),
    video_url: document.getElementById('f-video-url') ? (document.getElementById('f-video-url').value.trim() || null) : null,
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

      if (!pid) console.error('[Variantes] ERROR: pid es null, no se crearán variantes')
      if (variantesData.length === 0) console.error('[Variantes] ERROR: variantesData vacío, no se crearán variantes (¿colores sin nombre?)')
      if (pid && variantesData.length > 0) {
  const tallasGuardar = tallas.length > 0 ? tallas : ['Unica']
  console.log(`[Variantes] pid=${pid} | colores=${variantesData.length} | tallas=${tallasGuardar.length}:`, tallasGuardar)

  // Si estamos editando, obtener variantes existentes
  let varsExistentes = []
  if (window._productoEditandoId) {
    const resVars = await fetch(API + '/variantes/producto/' + pid)
    varsExistentes = await resVars.json()
    console.log(`[Variantes] Existentes en DB: ${varsExistentes.length}`)
    if (window._coloresEliminados && window._coloresEliminados.length > 0) {
  varsExistentes = varsExistentes.filter(v => !window._coloresEliminados.includes(v.color))
}
  }

  const promesas = []
  const erroresVariante = []
for (const v of variantesData) {
  for (const talla of tallasGuardar) {
    const varExistente = varsExistentes.find(ve =>
  ve.color.trim().toLowerCase() === v.color.trim().toLowerCase() &&
  ve.talla === talla
)
    if (varExistente) {
      // Solo actualizar si algo cambió realmente
      const nuevaFoto = v.imagenes.length > 0 ? v.imagenes[0] : null
      const nuevasImagenes = JSON.stringify(v.imagenes)
      const mismaFoto = varExistente.foto_url === nuevaFoto
      const mismasImagenes = JSON.stringify(varExistente.imagenes || []) === nuevasImagenes
      const mismoHex = varExistente.color_hex === v.color_hex
      if (mismaFoto && mismasImagenes && mismoHex) {
        console.log(`[Variantes] SIN CAMBIOS: ${v.color} T${talla} — omitiendo PATCH`)
      } else {
        console.log(`[Variantes] ACTUALIZAR: ${v.color} T${talla} → ${varExistente.id}`)
        const update = { color_hex: v.color_hex, foto_url: nuevaFoto, imagenes: v.imagenes }
        promesas.push(fetch(API + '/variantes/' + varExistente.id, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(update)
        }))
      }
    } else {
      console.log(`[Variantes] CREAR NUEVO: ${v.color} T${talla}`)
  promesas.push(
    fetch(API + '/variantes/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ producto_id: pid, color: v.color, color_hex: v.color_hex, talla, foto_url: v.imagenes[0] || null, imagenes: v.imagenes || [], activa: true })
    }).then(async r => {
      if (!r.ok) {
        const txt = await r.text().catch(() => '')
        erroresVariante.push(`${v.color} T${talla}: ${r.status}`)
        console.error('Error variante:', v.color, talla, r.status, txt)
      }
    }).catch(e => {
      erroresVariante.push(`${v.color} T${talla}: error de red`)
      console.error('Error red variante:', v.color, talla, e)
    })
  )
}
  }
}
await Promise.all(promesas)
if (erroresVariante.length > 0) {
  console.warn('Variantes con error:', erroresVariante)
  alert('⚠️ Algunas variantes no se guardaron:\n' + erroresVariante.join('\n') + '\n\nRevisa la consola para más detalles.')
}
}
console.log('Colores:', colores)
console.log('Tallas:', tallas)
const sucursalStock = document.getElementById('f-sucursal-stock') ? document.getElementById('f-sucursal-stock').value : ''
// Verificar si hay cantidades capturadas en la tabla (aunque sea una)
const hayStockCapturado = colores.some(c =>
  (tallas.length > 0 ? tallas : ['Unica']).some(t => {
    const el = document.getElementById('stock-ini-' + c.id + '-' + t.replace('.','_'))
    return el && parseInt(el.value) > 0
  })
)

let stockGuardado = 0
let stockErrores = []
let stockSaltados = []

if (hayStockCapturado && !sucursalStock) {
  alert('⚠️ Capturaste cantidades de stock pero no hay sucursal seleccionada.\nEl producto se guardó, pero el inventario NO se guardó.\n\nVe a Inventario → Reabastecer para agregar las cantidades.')
} else if (sucursalStock && pid) {
  const tallasGuardar = tallas.length > 0 ? tallas : ['Unica']

  // Las variantes ya están guardadas (await Promise.all arriba): obtener IDs una sola vez
  const varsActualizadas = await fetch(API + '/variantes/producto/' + pid).then(r => r.json())

  const invActual = await fetch(API + '/inventario/').then(r => r.json())
  const varIdsConInv = new Set(invActual.filter(i => i.sucursal_id === sucursalStock).map(i => i.variante_id))

  // Construir todas las peticiones de stock en paralelo
  const stockPromesas = []
  for (const varMatch of varsActualizadas) {
    const colorMatch = colores.find(c =>
      c.nombre.trim().toLowerCase() === (varMatch.color || '').trim().toLowerCase()
    )
    if (!colorMatch) continue

    const tallaId = String(varMatch.talla || '').replace('.', '_')
    const inputStock = document.getElementById('stock-ini-' + colorMatch.id + '-' + tallaId)
    const cantidad = inputStock ? parseInt(inputStock.value) || 0 : 0

    if (cantidad > 0) {
      stockPromesas.push(
        fetch(API + '/movimientos/ajuste', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            variante_id: varMatch.id,
            sucursal_id: sucursalStock,
            cantidad,
            motivo: window._productoEditandoId ? 'Resurtido desde edicion de producto' : 'Stock inicial'
          })
        }).then(r => {
          if (!r.ok) { stockErrores.push(`${varMatch.color} T${varMatch.talla}`); return }
          stockGuardado++
          console.log(`[Stock] ✓ ${varMatch.color} T${varMatch.talla} +${cantidad}`)
        }).catch(() => stockErrores.push(`${varMatch.color} T${varMatch.talla}`))
      )
    } else if (!varIdsConInv.has(varMatch.id)) {
      stockPromesas.push(
        fetch(API + '/movimientos/ajuste', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ variante_id: varMatch.id, sucursal_id: sucursalStock, cantidad: 0, motivo: 'Registro inicial (sin stock)' })
        }).then(() => console.log(`[Stock] Registro 0: ${varMatch.color} T${varMatch.talla}`))
        .catch(() => {})
      )
    }
  }
  await Promise.all(stockPromesas)
}
      if (prod && prod.error) {
        alert('Error: ' + prod.error)
        if (btn) { btn.textContent = 'Guardar producto'; btn.disabled = false }
        window._guardandoProducto = false
        return
      }
      // Mensaje de resultado con detalle de stock
      let msgFinal = 'Producto guardado correctamente'
      if (stockGuardado > 0) msgFinal += `\n✅ Stock guardado: ${stockGuardado} variante(s)`
      if (stockSaltados.length > 0) msgFinal += `\n⚠️ No se encontraron variantes para: ${stockSaltados.join(', ')}`
      if (stockErrores.length > 0) msgFinal += `\n❌ Errores al guardar: ${stockErrores.join(', ')}`
      alert(msgFinal)
      window._productoEditandoId = null
      window._guardandoProducto = false
      navegarA('productos')
    } else {
      const err = await res.text()
      alert('Error al guardar: ' + err)
      if (btn) { btn.textContent = 'Guardar producto'; btn.disabled = false }
      window._guardandoProducto = false
    }
    window._coloresEliminados = []
  } catch(e) {
    alert('Error conectando con el servidor')
    if (btn) { btn.textContent = 'Guardar producto'; btn.disabled = false }
    window._guardandoProducto = false
  }
}

window.editarProducto = async (id) => {
  window._coloresEliminados = []
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
            foto_url: v.foto_url,
            imagenes: v.imagenes || []
          })
        }
      })

    window._productoEditandoId = id
    window._coloresExistentes = coloresUnicos.length > 0 ? coloresUnicos : null

    // Derivar tallas disponibles desde las variantes (fuente de verdad)
    // Esto garantiza que los checkboxes estén correctamente marcados al editar
    const TALLAS_ORDEN = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Unica']
    const tallasDeVariantes = [...new Set(variantes.filter(v => v.producto_id === id).map(v => v.talla))].filter(Boolean)
    tallasDeVariantes.sort((a, b) => TALLAS_ORDEN.indexOf(a) - TALLAS_ORDEN.indexOf(b))
    if (tallasDeVariantes.length > 0) {
      data[0].tallas_disponibles = tallasDeVariantes
      console.log('[Editar] Tallas cargadas desde variantes:', tallasDeVariantes)
    } else if (data[0].tallas_disponibles && Array.isArray(data[0].tallas_disponibles)) {
      // Fallback: usar el campo del producto, convirtiendo a strings por si hay números
      data[0].tallas_disponibles = data[0].tallas_disponibles.map(String)
      console.log('[Editar] Tallas cargadas desde producto:', data[0].tallas_disponibles)
    }

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

window.cargarProductosFiltro = (categoria) => cargarProductos(categoria, false)

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
  const buscar = (document.getElementById('cli-buscar')?.value || '').toLowerCase().trim()
  const tipo = document.getElementById('cli-tipo')?.value || ''
  // Works with .cli-item card view (data attributes)
  const items = document.querySelectorAll('.cli-item')
  let visible = 0
  items.forEach(el => {
    const nombre = (el.dataset.nombre || '').toLowerCase()
    const tel = el.dataset.tel || ''
    const tipoEl = el.dataset.tipo || ''
    const matchBuscar = !buscar || nombre.includes(buscar) || tel.includes(buscar)
    const matchTipo = !tipo || tipoEl === tipo
    const show = matchBuscar && matchTipo
    el.style.display = show ? '' : 'none'
    if (show) visible++
  })
  // Update count label if present
  const countEl = document.getElementById('cli-count')
  if (countEl) countEl.textContent = visible
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
            <option value="mayoreo" ${d.tipo === 'mayoreo' ? 'selected' : ''}>Mayoreo variado</option>
            <option value="zapateria" ${d.tipo === 'zapateria' ? 'selected' : ''}>Corridas</option>
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
    const [resCli, resPed] = await Promise.all([
      fetch(API + '/clientes/' + id),
      fetch(API + '/pedidos/')
    ])
    const data = await resCli.json()
    const todosPedidos = await resPed.json()
    if (!data || data.length === 0) { alert('Cliente no encontrado'); return }
    const c = data[0]
    const pedidos = todosPedidos.filter(p => p.cliente_id === id)
    const pedidosConfirmados = pedidos.filter(p => p.status === 'confirmado' || p.status === 'pagado')
    const totalGastado = pedidosConfirmados.reduce((s, p) => s + parseFloat(p.total || 0), 0)
    const ticketPromedio = pedidosConfirmados.length > 0 ? totalGastado / pedidosConfirmados.length : 0
    const ultimoPedido = pedidos.length > 0 ? new Date(pedidos[0].created_at) : null
    const diasSinComprar = ultimoPedido ? Math.floor((new Date() - ultimoPedido) / (1000 * 60 * 60 * 24)) : null

    // Meses de actividad
    const ventasPorMes = {}
    pedidosConfirmados.forEach(p => {
      const mes = new Date(p.created_at).toLocaleDateString('es-MX', { month: 'short', year: '2-digit' })
      ventasPorMes[mes] = (ventasPorMes[mes] || 0) + parseFloat(p.total || 0)
    })

    content.innerHTML = `
      <div style="max-width:900px;margin:0 auto">
        <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap">
          <button class="btn btn-secondary" onclick="navegarA('clientes')">← Volver</button>
          <div style="flex:1">
            <h2 style="font-size:1.3rem;font-weight:700">${c.nombre}</h2>
            <p style="font-size:0.82rem;color:#888">${c.tipo === 'mayoreo' ? 'Mayoreo variado' : c.tipo === 'zapateria' ? 'Corridas' : 'Menudeo'} · Cliente desde ${c.created_at ? new Date(c.created_at).toLocaleDateString('es-MX') : '—'}</p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${c.telefono ? `<a href="https://wa.me/${c.lada || '52'}${c.telefono.replace(/\D/g,'')}" target="_blank" class="btn btn-secondary" style="background:#25D366;color:white;border-color:#25D366">💬 WhatsApp</a>` : ''}
            <button class="btn btn-secondary" onclick="mostrarFormCliente('${c.id}')">✏️ Editar</button>
            <button class="btn btn-primary" onclick="nuevoPedidoCliente('${c.id}', '${c.nombre}')">+ Nuevo pedido</button>
          </div>
        </div>

        <!-- ESTADÍSTICAS -->
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-bottom:1.5rem">
          <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
            <p style="font-size:1.6rem;font-weight:700;color:#E91E8C">$${totalGastado.toFixed(0)}</p>
            <p style="font-size:0.7rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Total gastado</p>
          </div>
          <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
            <p style="font-size:1.6rem;font-weight:700;color:#333">${pedidosConfirmados.length}</p>
            <p style="font-size:0.7rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Pedidos</p>
          </div>
          <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
            <p style="font-size:1.6rem;font-weight:700;color:#333">$${ticketPromedio.toFixed(0)}</p>
            <p style="font-size:0.7rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Ticket promedio</p>
          </div>
          <div style="background:white;border-radius:12px;padding:1.25rem;border:1px solid #eee;text-align:center">
            <p style="font-size:1.6rem;font-weight:700;color:${diasSinComprar > 60 ? '#c62828' : diasSinComprar > 30 ? '#f57f17' : '#2e7d32'}">${diasSinComprar !== null ? diasSinComprar : '—'}</p>
            <p style="font-size:0.7rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Días sin comprar</p>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
          <!-- INFO -->
          <div style="background:white;border-radius:12px;padding:1.5rem;border:1px solid #eee">
            <p style="font-weight:700;font-size:0.85rem;margin-bottom:1rem;color:#333">Información de contacto</p>
            <div style="display:flex;flex-direction:column;gap:10px">
              <div style="display:flex;justify-content:space-between">
                <span style="font-size:0.8rem;color:#888">Teléfono</span>
                <span style="font-size:0.85rem;font-weight:600">${c.telefono || '—'}</span>
              </div>
              <div style="display:flex;justify-content:space-between">
                <span style="font-size:0.8rem;color:#888">Email</span>
                <span style="font-size:0.85rem;font-weight:600">${c.email || '—'}</span>
              </div>
              <div style="display:flex;justify-content:space-between">
                <span style="font-size:0.8rem;color:#888">Ciudad</span>
                <span style="font-size:0.85rem;font-weight:600">${c.ciudad || '—'}</span>
              </div>
              <div style="display:flex;justify-content:space-between">
                <span style="font-size:0.8rem;color:#888">Dirección</span>
                <span style="font-size:0.85rem;font-weight:600;text-align:right;max-width:180px">${c.direccion || '—'}</span>
              </div>
              <div style="display:flex;justify-content:space-between">
                <span style="font-size:0.8rem;color:#888">Crédito</span>
                <span style="font-size:0.85rem;font-weight:600">${c.limite_credito > 0 ? '$' + c.limite_credito + ' / ' + c.dias_credito + ' días' : 'Sin crédito'}</span>
              </div>
            </div>
          </div>

          <!-- NOTAS -->
          <div style="background:white;border-radius:12px;padding:1.5rem;border:1px solid #eee">
            <p style="font-weight:700;font-size:0.85rem;margin-bottom:1rem;color:#333">Notas internas</p>
            <textarea id="cli-notas-${c.id}" rows="5" placeholder="Escribe notas sobre este cliente..."
                      style="width:100%;border:1px solid #eee;border-radius:8px;padding:10px;font-family:DM Sans,sans-serif;font-size:0.85rem;resize:none;outline:none"
                      onfocus="this.style.borderColor='#E91E8C'" onblur="this.style.borderColor='#eee'">${c.comentarios_internos || ''}</textarea>
            <button onclick="guardarNotasCliente('${c.id}')" class="btn btn-secondary" style="width:100%;margin-top:8px;font-size:0.82rem">
              💾 Guardar notas
            </button>
          </div>
        </div>

        <!-- HISTORIAL DE PEDIDOS -->
        <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden;margin-bottom:1rem">
          <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
            <p style="font-weight:700;font-size:0.9rem">Historial de pedidos</p>
            <span style="font-size:0.78rem;color:#888">${pedidos.length} pedidos</span>
          </div>
          ${pedidos.length === 0
            ? '<div style="text-align:center;padding:2rem;color:#888">Sin pedidos registrados</div>'
            : pedidos.map(p => {
              const statusColor = { 'confirmado': '#2e7d32', 'pagado': '#2e7d32', 'pendiente_pago': '#f57f17', 'cancelado': '#c62828', 'borrador': '#f57f17' }[p.status] || '#888'
              const statusBg = { 'confirmado': '#e8f5e9', 'pagado': '#e8f5e9', 'pendiente_pago': '#fff8e1', 'cancelado': '#ffebee', 'borrador': '#fff8e1' }[p.status] || '#f5f5f5'
              return `
                <div style="padding:1rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:16px;flex-wrap:wrap;cursor:pointer" onclick="verPedido('${p.id}')"
                     onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='white'">
                  <div style="flex:1">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                      <span style="font-family:monospace;font-size:0.78rem;color:#888">#${p.id.substring(0,8).toUpperCase()}</span>
                      <span style="padding:2px 8px;border-radius:100px;font-size:0.65rem;font-weight:600;background:${statusBg};color:${statusColor}">${p.status}</span>
                    </div>
                    <p style="font-size:0.78rem;color:#888">${new Date(p.created_at).toLocaleDateString('es-MX')} · ${p.canal || '—'} · ${p.forma_pago || '—'}</p>
                  </div>
                  <p style="font-weight:700;color:#E91E8C;font-size:1rem">$${p.total || '0'}</p>
                </div>
              `
            }).join('')}
        </div>
      </div>
    `
  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error cargando cliente</p>'
  }
}

window.guardarNotasCliente = async (id) => {
  const notas = document.getElementById('cli-notas-' + id)?.value || ''
  try {
    await fetch(API + '/clientes/' + id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comentarios_internos: notas })
    })
    const btn = document.querySelector(`button[onclick="guardarNotasCliente('${id}')"]`)
    if (btn) { btn.textContent = '✅ Guardado'; setTimeout(() => btn.textContent = '💾 Guardar notas', 2000) }
  } catch(e) {
    alert('Error guardando notas')
  }
}
window.editarCliente = (id) => {
  mostrarFormCliente(id)
}
window.nuevoPedidoCliente = async (clienteId, clienteNombre) => {
  await cargarPOS()
  // Pre-seleccionar cliente en el buscador
  setTimeout(() => {
    const buscar = document.getElementById('pos-cliente-buscar')
    const hidden = document.getElementById('pos-cliente')
    const sel = document.getElementById('pos-cliente-seleccionado')
    if (buscar) buscar.value = ''
    if (hidden) hidden.value = clienteId
    if (sel) {
      sel.textContent = '✔ ' + clienteNombre + ' — toca para cambiar'
      sel.style.display = 'block'
    }
    // Actualizar titulo
    const titulo = document.getElementById('topbar-title')
    if (titulo) titulo.textContent = 'Punto de venta'
  }, 300)
}
window.verHistorialCliente = async (clienteId) => {
  const content = document.getElementById('content')
  content.innerHTML = '<p style="padding:2rem;color:#888">Cargando historial...</p>'
  try {
    const res = await fetch(API + '/pedidos/')
    const todos = await res.json()
    const pedidos = todos.filter(p => p.cliente_id === clienteId)
    const cliente = pedidos.length > 0 && pedidos[0].clientes ? pedidos[0].clientes : {}

    const totalGastado = pedidos
      .filter(p => p.status === 'confirmado' || p.status === 'pagado')
      .reduce((sum, p) => sum + parseFloat(p.total || 0), 0)

    content.innerHTML = `
      <div class="table-card" style="padding:2rem">
        <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap">
          <button class="btn btn-secondary" onclick="navegarA('clientes')">← Volver</button>
          <h3 style="flex:1">Historial — ${cliente.nombre || 'Cliente'}</h3>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1.5rem">
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.75rem;color:#888;margin-bottom:4px">Total pedidos</p>
            <p style="font-weight:700;font-size:1.2rem">${pedidos.length}</p>
          </div>
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.75rem;color:#888;margin-bottom:4px">Total gastado</p>
            <p style="font-weight:700;font-size:1.2rem;color:#E91E8C">$${totalGastado.toFixed(2)}</p>
          </div>
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.75rem;color:#888;margin-bottom:4px">Ultimo pedido</p>
            <p style="font-weight:700;font-size:0.9rem">${pedidos.length > 0 ? new Date(pedidos[0].created_at).toLocaleDateString('es-MX') : '—'}</p>
          </div>
        </div>

        ${pedidos.length === 0
          ? '<div style="text-align:center;padding:3rem;color:#888">Este cliente no tiene pedidos registrados</div>'
          : `<table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Canal</th>
                <th>Forma de pago</th>
                <th>Total</th>
                <th>Status</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${pedidos.map(p => {
                const statusColor = {
                  'confirmado': 'badge-success',
                  'pagado': 'badge-success',
                  'pendiente_pago': 'badge-warning',
                  'cancelado': 'badge-danger',
                  'borrador': 'badge-warning'
                }[p.status] || 'badge-warning'
                return `
                  <tr>
                    <td>${new Date(p.created_at).toLocaleDateString('es-MX')}</td>
                    <td>${p.canal || '—'}</td>
                    <td>${p.forma_pago || '—'}</td>
                    <td><strong style="color:#E91E8C">$${p.total || '0'}</strong></td>
                    <td><span class="badge ${statusColor}">${p.status}</span></td>
                    <td><button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="verPedido('${p.id}')">Ver pedido</button></td>
                  </tr>
                `
              }).join('')}
            </tbody>
          </table>`}
      </div>
    `
  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error cargando historial</p>'
  }
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
function _renderFilaPedido(p) {
  const statusColor = {
    'borrador':          'badge-warning',
    'checkout_iniciado': 'badge-danger',
    'pendiente_pago':    'badge-warning',
    'confirmado':        'badge-success',
    'cancelado':         'badge-danger',
    'pagado':            'badge-success',
    'por_enviar':        'badge-info',
    'enviado':           'badge-success',
  }[p.status] || 'badge-warning'

  const statusLabel = {
    'borrador':          'Borrador',
    'checkout_iniciado': '🛒 Abandonó',
    'pendiente_pago':    'Pend. pago',
    'confirmado':        'Confirmado',
    'cancelado':         'Cancelado',
    'pagado':            'Pagado',
    'por_enviar':        '📦 Por enviar',
    'enviado':           '✅ Enviado',
  }[p.status] || p.status

  // Botón de envío para pedidos pagados por MercadoPago que aún no han sido enviados
  const esPagadoOnline = (p.status === 'pagado') && (p.mp_preference_id || p.mp_payment_id)
  const esEnviado = p.status === 'enviado'

  let accionEnvio = ''
  if (esPagadoOnline) {
    accionEnvio = `<button class="btn btn-primary" style="padding:4px 8px;font-size:0.72rem;background:#1565c0;border-color:#1565c0;margin-top:4px" onclick="abrirModalEnvio('${p.id}')">🚚 Enviar</button>`
  } else if (esEnviado && p.tracking_url) {
    accionEnvio = `<a href="${p.tracking_url}" target="_blank" class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem;margin-top:4px">📍 Rastrear</a>`
  }

  const guiaInfo = esEnviado && p.numero_guia
    ? `<br><span style="font-size:0.68rem;color:#2e7d32;font-family:monospace">${p.paqueteria || ''} ${p.numero_guia}</span>`
    : ''

  return `
    <tr style="${esPagadoOnline ? 'background:#f0f7ff' : ''}">
      <td style="font-family:monospace;font-size:0.78rem;color:#888">#${p.id.substring(0,8).toUpperCase()}</td>
      <td>
        <strong>${p.clientes ? p.clientes.nombre : (p.nombre_cliente || 'Sin cliente')}</strong>
        ${p.email_cliente ? `<br><span style="font-size:0.72rem;color:#aaa">${p.email_cliente}</span>` : ''}
        ${p.telefono_cliente ? `<br><span style="font-size:0.72rem;color:#aaa">${p.telefono_cliente}</span>` : ''}
      </td>
      <td>${p.canal || (p.mp_preference_id ? 'online' : '—')}</td>
      <td><strong>$${parseFloat(p.total||0).toLocaleString('es-MX',{maximumFractionDigits:0})}</strong></td>
      <td>${p.mp_preference_id ? 'MercadoPago' : (p.forma_pago || '—')}</td>
      <td>
        <span class="badge ${statusColor}">${statusLabel}</span>
        ${guiaInfo}
      </td>
      <td>${p.created_at ? new Date(new Date(p.created_at).getTime() - 6*60*60*1000).toLocaleString('es-MX', {dateStyle:'short', timeStyle:'short'}) : '—'}</td>
      <td style="white-space:nowrap">
        <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="verPedido('${p.id}')">Ver</button>
        ${accionEnvio}
      </td>
    </tr>
  `
}

window.abrirModalEnvio = function(pedidoId) {
  const existing = document.getElementById('modal-envio')
  if (existing) existing.remove()

  const modal = document.createElement('div')
  modal.id = 'modal-envio'
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px'
  modal.innerHTML = `
    <div style="background:white;border-radius:16px;padding:32px;width:100%;max-width:420px;box-shadow:0 20px 60px rgba(0,0,0,0.25)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h3 style="font-size:1.1rem;margin:0">🚚 Registrar envío</h3>
        <button onclick="document.getElementById('modal-envio').remove()" style="background:#f5f5f5;border:none;border-radius:50%;width:30px;height:30px;cursor:pointer;font-size:1rem">✕</button>
      </div>

      <label class="form-label">Paquetería *</label>
      <select id="env-paqueteria" class="form-input" style="margin-bottom:14px">
        <option value="">Selecciona...</option>
        <option value="FedEx">FedEx</option>
        <option value="Estafeta">Estafeta</option>
        <option value="DHL">DHL</option>
        <option value="otra">Otra</option>
      </select>

      <label class="form-label">Número de guía *</label>
      <input id="env-guia" class="form-input" placeholder="Ej. 772812345678" style="margin-bottom:6px;font-family:monospace;letter-spacing:1px">
      <p style="font-size:0.72rem;color:#aaa;margin-bottom:20px">El cliente recibirá un email con el link de rastreo automáticamente.</p>

      <div style="display:flex;gap:10px">
        <button onclick="document.getElementById('modal-envio').remove()" class="btn btn-secondary" style="flex:1">Cancelar</button>
        <button onclick="confirmarEnvio('${pedidoId}')" class="btn btn-primary" style="flex:2" id="btn-confirmar-envio">Confirmar envío ✓</button>
      </div>
      <p id="env-error" style="color:red;font-size:0.8rem;margin-top:10px;display:none"></p>
    </div>
  `
  document.body.appendChild(modal)
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove() })
}

window.confirmarEnvio = async function(pedidoId) {
  const paqueteria = document.getElementById('env-paqueteria').value
  const numeroGuia = document.getElementById('env-guia').value.trim()
  const errEl = document.getElementById('env-error')
  const btn = document.getElementById('btn-confirmar-envio')

  if (!paqueteria || !numeroGuia) {
    errEl.textContent = 'Selecciona paquetería e ingresa el número de guía.'
    errEl.style.display = 'block'
    return
  }
  btn.disabled = true
  btn.textContent = 'Guardando...'
  errEl.style.display = 'none'

  try {
    const res = await fetch(API + `/pedidos/${pedidoId}/marcar-enviado`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paqueteria, numero_guia: numeroGuia })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Error al guardar')

    // Enviar template de aviso de envío por WhatsApp
    try {
      const resPed = await fetch(API + '/pedidos/' + pedidoId).then(r => r.json())
      const tel = resPed.telefono_cliente
      const nombre = (resPed.nombre_cliente || 'Cliente').split(' ')[0]
      if (tel) {
        await fetch(API + '/chatbot/templates/enviar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            telefono: tel,
            template: 'aviso_envio',
            params: [nombre, String(pedidoId).slice(-6), numeroGuia, paqueteria]
          })
        })
      }
    } catch(_) {}

    document.getElementById('modal-envio').remove()
    mostrarToast('✅ Pedido enviado — WhatsApp de tracking enviado al cliente')
    await cargarPedidos()
  } catch(e) {
    errEl.textContent = e.message
    errEl.style.display = 'block'
    btn.disabled = false
    btn.textContent = 'Confirmar envío ✓'
  }
}

async function cargarPedidos() {
  const content = document.getElementById('content')
  try {
    const res = await fetch(API + '/pedidos/')
    const data = await res.json()

    const hoy = new Date()
    const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
    const hace7 = new Date(hoy - 7 * 24 * 60 * 60 * 1000)

    // checkout_iniciado = abandonó el pago (fue a MP y no eligió método ni pagó). No es venta.
    const NO_VENTA = ['cancelado', 'borrador', 'checkout_iniciado']
    const pedidosActivos = data.filter(p => !NO_VENTA.includes(p.status))
    // La tabla "Todos" muestra solo ventas/intentos reales, no los abandonados
    const dataVisible = data.filter(p => p.status !== 'checkout_iniciado')
    const pedidosHoy = pedidosActivos.filter(p => new Date(p.created_at) >= inicioHoy)
    const totalHoy = pedidosHoy.reduce((s, p) => s + parseFloat(p.total || 0), 0)
    const total7d = pedidosActivos.filter(p => new Date(p.created_at) >= hace7).reduce((s, p) => s + parseFloat(p.total || 0), 0)
    const pendienteSPEI = data.filter(p => p.status === 'pendiente_pago').length
    const abandonados = data.filter(p => p.status === 'checkout_iniciado').length
    const porEnviar = data.filter(p => p.status === 'pagado' && (p.mp_preference_id || p.mp_payment_id)).length
    const enCredito = data.filter(p => p.forma_pago === 'credito' && p.status !== 'cancelado').length

    const kpiCard = (valor, label, sub, color, bg, border, onclick) => `
      <div style="background:${bg};border-radius:14px;padding:1.1rem 1.25rem;border:1px solid ${border};cursor:${onclick ? 'pointer' : 'default'};transition:transform 0.15s,box-shadow 0.15s"
           ${onclick ? `onclick="${onclick}" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(0,0,0,0.08)'" onmouseout="this.style.transform='';this.style.boxShadow=''"` : ''}>
        <p style="font-size:1.55rem;font-weight:800;color:${color};line-height:1;margin-bottom:3px;letter-spacing:-0.5px">${valor}</p>
        <p style="font-size:0.7rem;font-weight:600;color:${color};opacity:0.85;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:1px">${label}</p>
        ${sub ? `<p style="font-size:0.68rem;color:#94a3b8;margin-top:2px">${sub}</p>` : ''}
      </div>`

    content.innerHTML = `
      <div style="margin-bottom:1.25rem">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:16px">
          <div>
            <p style="font-size:0.7rem;font-weight:700;letter-spacing:0.1em;color:#E91E8C;text-transform:uppercase;margin:0 0 3px">Gestión de ventas</p>
            <h2 style="font-size:1.3rem;font-weight:800;color:#0f172a;margin:0;letter-spacing:-0.3px">Pedidos</h2>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="btn btn-secondary" onclick="mostrarFormLinkPago()" style="background:#ffe600;color:#333;border-color:#ffe600">💳 Crear link de pago</button>
            <button class="btn btn-primary" onclick="mostrarFormPedido()">+ Nuevo pedido</button>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;margin-bottom:16px">
          ${kpiCard(pedidosHoy.length, 'Pedidos hoy', `$${totalHoy.toLocaleString('es-MX',{maximumFractionDigits:0})} vendidos`, '#E91E8C', 'linear-gradient(135deg,#fff0f8,#ffe4f2)', '#f9a8d4', '')}
          ${kpiCard('$' + Math.round(total7d / 1000) + 'k', '7 días', `${pedidosActivos.filter(p=>new Date(p.created_at)>=hace7).length} pedidos`, '#7c3aed', '#f5f3ff', '#ddd6fe', '')}
          ${pendienteSPEI > 0
            ? kpiCard(pendienteSPEI, 'SPEI/OXXO pendiente', 'Eligió método, falta pagar', '#b45309', '#fffbeb', '#fcd34d', "cargarPedidosFiltro('pendiente_pago')")
            : kpiCard('0', 'SPEI/OXXO pendiente', 'Todo al corriente', '#16a34a', '#f0fdf4', '#86efac', '')}
          ${abandonados > 0
            ? kpiCard(abandonados, 'Abandonados', 'Fue a pagar y no terminó', '#be123c', '#fff1f2', '#fda4af', "cargarPedidosFiltro('abandonado')")
            : kpiCard('0', 'Abandonados', 'Ninguno', '#16a34a', '#f0fdf4', '#86efac', '')}
          ${porEnviar > 0
            ? kpiCard(porEnviar, 'Por enviar', 'Pagados online', '#1d4ed8', '#eff6ff', '#93c5fd', "cargarPedidosFiltro('por_enviar')")
            : kpiCard('0', 'Por enviar', 'Sin pendientes', '#16a34a', '#f0fdf4', '#86efac', '')}
          ${kpiCard(enCredito, 'En crédito', 'Pedidos activos', '#0f766e', '#f0fdfa', '#99f6e4', "cargarPedidosFiltro('credito')")}
        </div>

        <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
          <input class="form-input" id="ped-buscar" placeholder="Buscar por # pedido o cliente..."
                 style="max-width:240px;font-size:0.82rem" oninput="filtrarPedidos()">
          <div style="display:flex;gap:4px;flex-wrap:wrap" id="ped-filtros">
            <button class="pill-filter pill-active" onclick="cargarPedidosFiltro('')">Todos <span style="opacity:0.75;font-weight:400">${dataVisible.length}</span></button>
            <button class="pill-filter" onclick="cargarPedidosFiltro('sucursal')">Sucursal</button>
            <button class="pill-filter" onclick="cargarPedidosFiltro('whatsapp')">WhatsApp</button>
            <button class="pill-filter" onclick="cargarPedidosFiltro('online')">Online</button>
            <button class="pill-filter pill-warning" onclick="cargarPedidosFiltro('pendiente_pago')">SPEI/OXXO pendiente</button>
            <button class="pill-filter pill-danger" onclick="cargarPedidosFiltro('abandonado')">Abandonados ${abandonados > 0 ? `<span style="opacity:0.75;font-weight:400">${abandonados}</span>` : ''}</button>
            <button class="pill-filter pill-info" onclick="cargarPedidosFiltro('por_enviar')">Por enviar</button>
            <button class="pill-filter pill-success" onclick="cargarPedidosFiltro('credito')">Crédito</button>
          </div>
        </div>
      </div>
      <div class="table-card">
        <table>
          <thead>
            <tr>
              <th># Pedido</th>
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
            ${dataVisible.length === 0
              ? '<tr><td colspan="8" style="text-align:center;color:#888;padding:2rem">No hay pedidos</td></tr>'
              : dataVisible.map(p => _renderFilaPedido(p)).join('')}
          </tbody>
        </table>
      </div>
    `
    window._pedidosData = data
  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error conectando con el servidor</p>'
  }
}
window.filtrarPedidos = () => {
  const buscar = document.getElementById('ped-buscar').value.toLowerCase()
  const filas = document.querySelectorAll('#content tbody tr')
  filas.forEach(fila => {
    const texto = fila.textContent.toLowerCase()
    fila.style.display = texto.includes(buscar) ? '' : 'none'
  })
}

window.cargarPedidosFiltro = (filtro) => {
  const data = window._pedidosData || []
  // "Todos" (sin filtro) oculta los abandonados; solo se ven en su propio filtro
  let filtrados = data.filter(p => p.status !== 'checkout_iniciado')
  if (filtro === 'pendiente_pago') {
    filtrados = data.filter(p => p.status === 'pendiente_pago')
  } else if (filtro === 'abandonado') {
    filtrados = data.filter(p => p.status === 'checkout_iniciado')
  } else if (filtro === 'credito') {
    filtrados = data.filter(p => p.forma_pago === 'credito')
  } else if (filtro === 'por_enviar') {
    filtrados = data.filter(p => p.status === 'pagado' && (p.mp_preference_id || p.mp_payment_id))
  } else if (filtro) {
    filtrados = data.filter(p => p.canal === filtro)
  }

  // Marcar botón activo
  document.querySelectorAll('#content .btn[onclick^="cargarPedidosFiltro"]').forEach(btn => {
    btn.classList.remove('btn-primary')
    btn.classList.add('btn-secondary')
  })
  const btnActivo = document.querySelector(`#content .btn[onclick="cargarPedidosFiltro('${filtro}')"]`)
    || document.querySelector(`#content .btn[onclick="cargarPedidosFiltro('')"]`)
  if (btnActivo && filtro === '') {
    const btnTodos = document.querySelector(`#content .btn[onclick="cargarPedidosFiltro('')"]`)
    if (btnTodos) { btnTodos.classList.add('btn-primary'); btnTodos.classList.remove('btn-secondary') }
  } else if (btnActivo) {
    btnActivo.classList.add('btn-primary'); btnActivo.classList.remove('btn-secondary')
  }

  const tbody = document.querySelector('#content tbody')
  if (!tbody) return

  if (filtrados.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#888;padding:2rem">No hay pedidos con ese filtro</td></tr>'
    return
  }

  tbody.innerHTML = filtrados.map(p => _renderFilaPedido(p)).join('')
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
    precio_corrida: parseFloat(producto.precio_corrida) || (precioBase - 100),
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
          <div style="display:flex;align-items:center;gap:6px">
            <button onclick="cambiarCantidadItem(${idx}, -1)" style="background:#eee;border:none;border-radius:7px;width:34px;height:34px;cursor:pointer;font-size:1.2rem;font-weight:700;touch-action:manipulation">−</button>
            <span style="font-weight:700;min-width:26px;text-align:center">${item.cantidad}</span>
            <button onclick="cambiarCantidadItem(${idx}, 1)" style="background:#eee;border:none;border-radius:7px;width:34px;height:34px;cursor:pointer;font-size:1.2rem;font-weight:700;touch-action:manipulation">+</button>
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
  if (window._creandoPedido) return  // evita doble click
  const cliente_id = document.getElementById('ped-cliente').value
  const canal = document.getElementById('ped-canal').value
  const sucursal_id = document.getElementById('ped-sucursal').value
  const forma_pago = document.getElementById('ped-pago').value
  const comentarios = document.getElementById('ped-comentarios').value

  if (!cliente_id) { alert('Selecciona un cliente'); return }
  if (window._pedidoItems.length === 0) { alert('Agrega al menos un producto'); return }

  window._creandoPedido = true
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
      window._creandoPedido = false
      return
    }

    const pedidoData = await resPedido.json()
    const pedidoId = pedidoData.id || pedidoData[0]?.id
    if (!pedidoId) {
      alert('Error: no se obtuvo ID del pedido')
      if (btn) { btn.textContent = 'Crear pedido'; btn.disabled = false }
      window._creandoPedido = false
      return
    }

    await Promise.all(window._pedidoItems.map(item =>
      fetch(API + '/pedidos/' + pedidoId + '/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variante_id: item.variante_id,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          subtotal: item.cantidad * item.precio_unitario
        })
      })
    ))

    if (forma_pago !== 'spei' && forma_pago !== 'mercadopago') {
      await fetch(API + '/pedidos/' + pedidoId + '/confirmar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forma_pago })
      })
    }

    alert('Pedido creado correctamente')
    window._pedidoItems = []
    window._creandoPedido = false
    verPedido(pedidoId)

  } catch(e) {
    alert('Error conectando con el servidor')
    if (btn) { btn.textContent = 'Crear pedido'; btn.disabled = false }
    window._creandoPedido = false
  }
}

window.abrirPreviewPedido = async (id) => {
  // Si ya estaba abierto este pedido, lo cierra (toggle)
  const panel = document.getElementById('pedido-preview-panel')
  if (!panel) { verPedido(id); return }
  if (panel.dataset.pedidoId === id && panel.style.display !== 'none') {
    panel.style.display = 'none'; panel.dataset.pedidoId = ''; return
  }
  panel.dataset.pedidoId = id
  panel.style.display = 'block'
  panel.innerHTML = '<p style="padding:1.5rem;color:#888;text-align:center">Cargando...</p>'
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' })

  try {
    const [resPedido, resItems] = await Promise.all([
      fetch(API + '/pedidos/' + id).then(r => r.json()),
      fetch(API + '/pedidos/' + id + '/items').then(r => r.json())
    ])
    const p = Array.isArray(resPedido) ? resPedido[0] : resPedido
    const items = Array.isArray(resItems) ? resItems : []
    const cliente = p.clientes || {}
    const statusColor = { confirmado:'#2e7d32', pagado:'#2e7d32', cancelado:'#c62828', pendiente_pago:'#f57f17', borrador:'#f57f17' }[p.status] || '#888'

    panel.innerHTML = `
      <div class="table-card" style="padding:1.5rem;border:2px solid #f0f0f0">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:1.2rem">
          <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
            <h3 style="margin:0">Pedido #${p.id.substring(0,8).toUpperCase()}</h3>
            <span style="background:${statusColor}20;color:${statusColor};border:1px solid ${statusColor}40;padding:4px 10px;border-radius:20px;font-size:0.78rem;font-weight:600">${p.status}</span>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="btn btn-secondary" style="font-size:0.8rem" onclick="verPedido('${p.id}')">✏️ Editar pedido</button>
            ${p.status !== 'cancelado' && p.status !== 'confirmado' && p.status !== 'pagado' ? `<button class="btn btn-primary" style="font-size:0.8rem" onclick="confirmarPedidoAdmin('${p.id}')">✅ Confirmar</button>` : ''}
            ${p.status !== 'cancelado' ? `<button class="btn btn-secondary" style="font-size:0.8rem;color:#c62828;border-color:#c62828" onclick="cancelarPedido('${p.id}')">❌ Cancelar</button>` : ''}
            <button class="btn btn-secondary" style="font-size:0.8rem" onclick="generarPDFPedido('${p.id}')">PDF</button>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;margin-bottom:1.2rem">
          <div style="background:#f9f9f9;border-radius:8px;padding:10px">
            <p style="font-size:0.72rem;color:#888;margin-bottom:2px">Cliente</p>
            <p style="font-weight:600;font-size:0.88rem">${cliente.nombre || 'Mostrador'}</p>
            <p style="font-size:0.78rem;color:#888">${cliente.telefono || ''}</p>
          </div>
          <div style="background:#f9f9f9;border-radius:8px;padding:10px">
            <p style="font-size:0.72rem;color:#888;margin-bottom:2px">Canal / Pago</p>
            <p style="font-weight:600;font-size:0.88rem">${p.canal || '—'}</p>
            <p style="font-size:0.78rem;color:#888">${p.forma_pago || ''}</p>
          </div>
          <div style="background:#f9f9f9;border-radius:8px;padding:10px">
            <p style="font-size:0.72rem;color:#888;margin-bottom:2px">Total</p>
            <p style="font-weight:700;font-size:1.1rem;color:#E91E8C">$${p.total || '0'}</p>
          </div>
          <div style="background:#f9f9f9;border-radius:8px;padding:10px">
            <p style="font-size:0.72rem;color:#888;margin-bottom:2px">Fecha</p>
            <p style="font-weight:600;font-size:0.82rem">${p.created_at ? new Date(new Date(p.created_at).getTime()-6*60*60*1000).toLocaleString('es-MX',{dateStyle:'short',timeStyle:'short'}) : '—'}</p>
          </div>
        </div>

        <p style="font-weight:600;font-size:0.85rem;color:#333;margin-bottom:10px">Productos (${items.length})</p>
        ${items.length === 0 ? '<p style="color:#aaa;font-size:0.85rem">Sin productos registrados</p>' : ''}
        <div style="display:flex;flex-wrap:wrap;gap:10px">
          ${items.map(item => {
            const v = item.variantes || {}
            const pr = v.productos || {}
            const nombre = pr.nombre || item.nombre || '—'
            const color = v.color || item.color || ''
            const talla = v.talla || item.talla || ''
            const imagen = pr.imagen_principal || null
            return `
              <div style="display:flex;align-items:center;gap:10px;padding:10px;background:#f9f9f9;border-radius:8px;border:1px solid #eee;min-width:220px;flex:1">
                ${imagen ? `<img src="${imagen}" style="width:56px;height:56px;object-fit:cover;border-radius:8px;flex-shrink:0">` : `<div style="width:56px;height:56px;background:#eee;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.4rem">👟</div>`}
                <div>
                  <p style="font-weight:600;font-size:0.83rem;margin:0 0 2px">${nombre}${color ? ' · '+color : ''}${talla ? ' T'+talla : ''}</p>
                  <p style="font-size:0.78rem;color:#888;margin:0">${item.cantidad} pares × $${item.precio_unitario || 0}</p>
                  <p style="font-weight:700;color:#E91E8C;font-size:0.85rem;margin:2px 0 0">$${item.subtotal ?? (item.cantidad * item.precio_unitario).toFixed(2)}</p>
                </div>
              </div>`
          }).join('')}
        </div>
      </div>`
  } catch(e) {
    panel.innerHTML = '<p style="padding:1rem;color:red">Error cargando pedido</p>'
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
    let items = p.pedido_items || []
    if (items.length === 0) {
      try {
        const resItems = await fetch(API + '/pedidos/' + id + '/items')
        const itemsData = await resItems.json()
        if (Array.isArray(itemsData)) items = itemsData
      } catch(_) {}
    }
    p.pedido_items = items
    const cliente = p.clientes || {}
    window._currentPedido = p

    // SKU del primer producto del pedido, para el link de "pedir reseña"
    let _reviewSku = ''
    try {
      const it0 = (items && items[0]) || null
      if (it0) {
        if (it0.variantes && it0.variantes.productos && it0.variantes.productos.sku_interno) {
          _reviewSku = it0.variantes.productos.sku_interno
        } else if (it0.variante_id && window._variantesCache && window._productosCache) {
          const v = window._variantesCache.find(x => x.id === it0.variante_id)
          if (v) { const pr = window._productosCache.find(x => x.id === v.producto_id); if (pr) _reviewSku = pr.sku_interno || '' }
        }
      }
    } catch(_) {}
    const _telResena = (cliente.telefono || p.telefono_cliente || '')
    const _nomResena = (cliente.nombre || p.nombre_cliente || '').split(' ')[0]

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
          ${cliente.telefono ? '<a href="https://wa.me/52' + cliente.telefono.replace(/\D/g,'') + '?text=' + encodeURIComponent('Hola ' + (cliente.nombre || '') + ', tu pedido está listo') + '" target="_blank" class="btn btn-secondary" style="background:#25D366;color:white;border-color:#25D366">WhatsApp</a>' : ''}
          ${(_telResena && ['pagado','confirmado','enviado'].includes(p.status)) ? `<button class="btn btn-secondary" style="background:#f59e0b;color:white;border-color:#f59e0b" onclick="pedirResena('${_telResena.replace(/\D/g,'')}','${_nomResena.replace(/'/g,'')}','${_reviewSku}')">⭐ Pedir reseña</button>` : ''}
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1.5rem">
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.75rem;color:#888;margin-bottom:4px">Cliente</p>
            <p style="font-weight:600">${cliente.nombre || p.nombre_cliente || 'Mostrador'}</p>
            <p style="font-size:0.8rem;color:#888">${cliente.telefono || p.telefono_cliente || ''}</p>
            ${p.email_cliente ? `<p style="font-size:0.78rem;color:#888">${p.email_cliente}</p>` : ''}
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

        ${(() => {
          const dir = (p.direccion_envio || p.direccion_entrega || '').trim()
          // Pedidos de WhatsApp guardan la dirección dentro de notas tras "Envío a:"
          let dirNotas = ''
          if (!dir && p.notas) { const m = p.notas.match(/Env[ií]o a:\s*(.+)$/i); if (m) dirNotas = m[1].trim() }
          const dirFinal = dir || dirNotas
          const nombreEnvio = cliente.nombre || p.nombre_cliente || ''
          const telEnvio = cliente.telefono || p.telefono_cliente || ''
          const emailEnvio = (p.email_cliente && p.email_cliente !== 'cliente@zapatillasmay.mx') ? p.email_cliente : ''
          if (!dirFinal && !nombreEnvio && !telEnvio) return ''
          const bloqueCopia = [nombreEnvio, telEnvio, emailEnvio, dirFinal].filter(Boolean).join('\n')
          return `
          <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:1rem;margin-bottom:1.5rem">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px">
              <p style="font-size:0.8rem;font-weight:700;color:#1d4ed8;margin:0">📦 Datos de envío</p>
              <button onclick="navigator.clipboard.writeText(this.dataset.copy).then(()=>{this.textContent='✓ Copiado';setTimeout(()=>this.textContent='📋 Copiar',1500)})" data-copy="${bloqueCopia.replace(/"/g,'&quot;')}" style="padding:4px 12px;border-radius:20px;border:1.5px solid #1d4ed8;background:none;color:#1d4ed8;font-size:0.75rem;font-weight:600;cursor:pointer">📋 Copiar</button>
            </div>
            ${nombreEnvio ? `<p style="margin:2px 0;font-size:0.88rem;color:#0f172a"><strong>${nombreEnvio}</strong></p>` : ''}
            ${telEnvio ? `<p style="margin:2px 0;font-size:0.85rem;color:#334155">📞 ${telEnvio}</p>` : ''}
            ${emailEnvio ? `<p style="margin:2px 0;font-size:0.85rem;color:#334155">✉️ ${emailEnvio}</p>` : ''}
            ${dirFinal ? `<p style="margin:2px 0;font-size:0.85rem;color:#334155">📍 ${dirFinal}</p>` : '<p style="margin:2px 0;font-size:0.82rem;color:#c62828">⚠ Sin dirección registrada</p>'}
            ${p.notas ? `<p style="margin:8px 0 0;font-size:0.78rem;color:#64748b;border-top:1px solid #dbeafe;padding-top:6px">📝 ${p.notas}</p>` : ''}
          </div>`
        })()}

        <div style="margin-bottom:1.5rem">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:1rem">
            <p style="font-weight:600;color:#333;margin:0">Productos</p>
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
              ${p.status !== 'cancelado' ? `<button class="btn btn-secondary" style="font-size:0.8rem;padding:4px 12px" onclick="activarEdicionPedido('${p.id}')">✏️ Editar pedido</button>` : ''}
              ${p.status !== 'cancelado' && p.status !== 'confirmado' && p.status !== 'pagado' ? `<button class="btn btn-primary" style="font-size:0.8rem;padding:4px 12px" onclick="confirmarPedidoAdmin('${p.id}')">✅ Confirmar</button>` : ''}
              ${p.status === 'cancelado' ? `<button class="btn btn-primary" style="background:#2e7d32;border-color:#2e7d32;font-size:0.8rem;padding:4px 12px" onclick="reconfirmarPedido('${p.id}')">✅ Reconfirmar pedido</button>` : ''}
              ${p.status !== 'cancelado' ? `<button class="btn btn-secondary" style="font-size:0.8rem;padding:4px 12px;color:#c62828;border-color:#c62828" onclick="cancelarPedido('${p.id}')">❌ Cancelar pedido</button>` : ''}
              <button class="btn btn-secondary" style="font-size:0.8rem;padding:4px 12px" onclick="generarPDFPedido('${p.id}')">Generar PDF</button>
              <button class="btn btn-secondary" style="font-size:0.8rem;padding:4px 12px" onclick="imprimirTicketPOS('${p.id}',${p.total},${p.pedido_items ? p.pedido_items.reduce((s,i)=>s+i.cantidad,0) : 0},'${p.forma_pago||'efectivo'}')">Reimprimir ticket</button>
            </div>
          </div>
          <div id="items-lista">
          ${items.length === 0 ? '<p style="color:#aaa;font-size:0.85rem;padding:8px 0">Sin productos registrados en este pedido</p>' : ''}
          ${items.map(item => {
            const variante = item.variantes || {}
            const producto = variante.productos || {}
            const nombre = producto.nombre || item.nombre || '—'
            const color = variante.color || item.color || ''
            const talla = variante.talla || item.talla || ''
            // imagen: del join si existe, si no busca en caché de productos por variante_id
            let imagen = producto.imagen_principal || null
            if (!imagen && item.variante_id && window._productosCache && window._variantesCache) {
              const v = window._variantesCache.find(x => x.id === item.variante_id)
              if (v) { const pr = window._productosCache.find(x => x.id === v.producto_id); if (pr) imagen = pr.imagen_principal || null }
            }
            return `
              <div style="display:flex;align-items:center;gap:12px;padding:12px;background:#f9f9f9;border-radius:8px;margin-bottom:8px;border:1px solid #eee">
                ${imagen ? '<img src="' + imagen + '" style="width:56px;height:56px;object-fit:cover;border-radius:8px;flex-shrink:0;border:1px solid #eee">' : '<div style="width:56px;height:56px;background:#f0f0f0;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.4rem">👟</div>'}
                <div style="flex:1">
                  <p style="font-weight:600;font-size:0.85rem;margin:0 0 2px">${nombre}${color ? ' · ' + color : ''}${talla ? ' · T' + talla : ''}</p>
                  <p style="font-size:0.8rem;color:#888;margin:0">${item.cantidad} pares × $${item.precio_unitario || 0}</p>
                </div>
                <strong style="color:#E91E8C;font-size:1rem">$${item.subtotal != null ? item.subtotal : ((item.cantidad || 0) * (item.precio_unitario || 0)).toFixed(2)}</strong>
              </div>
            `
          }).join('')}
          </div>
          <div id="panel-edicion" style="display:none"></div>
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

    `
  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error cargando pedido</p>'
  }
}
window.activarEdicionPedido = async (pedidoId) => {
  const panel = document.getElementById('panel-edicion')
  const lista = document.getElementById('items-lista')
  if (!panel) return

  // Cargar variantes, productos e inventario para el buscador
  const [resVariantes, resProductos, resInv] = await Promise.all([
    fetch(API + '/variantes/').then(r => r.json()),
    fetch(API + '/productos/').then(r => r.json()),
    fetch(API + '/inventario/').then(r => r.json()).catch(() => [])
  ])

  window._editPedidoId = pedidoId
  window._editItems = (window._currentPedido?.pedido_items || []).map(i => ({...i}))
  window._editVariantes = resVariantes
  window._editProductos = resProductos
  window._editInventario = resInv
  window._editModo = 'variado'

  // Recalcular precios de los items variados al cargar la edicion
  window.recalcularPreciosEdicion()

  lista.style.display = 'none'
  panel.style.display = 'block'

  const renderEdicion = () => {
    const items = window._editItems
    const totalPares = items.reduce((s, i) => s + i.cantidad, 0)
    const tierLabel = totalPares >= 6 ? 'Mayoreo 6+ pares' : totalPares >= 3 ? 'Mayoreo 3-5 pares' : 'Menudeo'
    
    panel.innerHTML = `
      <div style="background:#fff8e1;border:1px solid #ffe082;border-radius:8px;padding:1rem;margin-bottom:1rem">
        <p style="font-weight:600;color:#f57f17;margin-bottom:0.4rem">✏️ Modo edición — los cambios ajustan inventario automáticamente</p>
        <p style="font-size:0.82rem;color:#64748b;margin:0 0 1rem 0">
          Total en pedido: <strong>${totalPares} pares</strong>
          · Esquema aplicado: <span style="background:#fff3cd;padding:2px 8px;border-radius:100px;font-weight:700;color:#856404">${tierLabel}</span>
        </p>

        <!-- BUSCADOR Y SELECTOR DE TALLAS (arriba) -->
        <div style="margin-bottom:1rem;padding-bottom:1rem;border-bottom:2px solid #ffe082">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:8px">
            <p style="font-weight:700;font-size:0.85rem;color:#333;margin:0">Agregar producto</p>
            <div style="display:flex;gap:0;border:1px solid #ddd;border-radius:8px;overflow:hidden">
              <button id="ep-modo-par" onclick="window.editPedidoModo('par')"
                style="padding:5px 14px;font-size:0.8rem;border:none;cursor:pointer;background:#E91E8C;color:white;font-weight:600">Par suelto</button>
              <button id="ep-modo-corrida" onclick="window.editPedidoModo('corrida')"
                style="padding:5px 14px;font-size:0.8rem;border:none;cursor:pointer;background:white;color:#888">Corrida completa</button>
            </div>
          </div>

          <!-- Panel par suelto -->
          <div id="ep-panel-par">
            <div style="position:relative">
              <input class="form-input" id="ep-buscar-prod" placeholder="🔍 Busca el modelo (nombre o SKU)…" oninput="window.buscarProductoPedidoEdicion(this.value)" autocomplete="off"
                onfocus="window.posicionarDropdownCarrito('ep-prod-resultados','ep-buscar-prod')" onblur="setTimeout(()=>{const el=document.getElementById('ep-prod-resultados');if(el)el.style.display='none'},250)">
              <div id="ep-prod-resultados" style="display:none;position:fixed;z-index:9999;background:white;border:1px solid #ddd;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.15);max-height:340px;overflow-y:auto;min-width:300px"></div>
            </div>
            <p style="font-size:0.76rem;color:#888;margin:7px 0 0;line-height:1.4">Busca el modelo y <strong>toca una talla</strong> para agregar 1 par. Puedes seguir tapeando tallas del mismo resultado.</p>
          </div>

          <!-- Panel corrida -->
          <div id="ep-panel-corrida" style="display:none">
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end">
              <div style="flex:2;min-width:200px;position:relative">
                <input class="form-input" id="ep-buscar-corrida" placeholder="Ej: M-TAC-0033 o nombre..." oninput="window.buscarModeloPedidoEdicion(this.value)" autocomplete="off"
                  onfocus="window.posicionarDropdownCarrito('ep-corrida-resultados','ep-buscar-corrida')" onblur="setTimeout(()=>{const el=document.getElementById('ep-corrida-resultados');if(el)el.style.display='none'},200)">
                <div id="ep-corrida-resultados" style="display:none;position:fixed;z-index:9999;background:white;border:1px solid #ddd;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.15);max-height:260px;overflow-y:auto;min-width:320px"></div>
              </div>
              <div style="width:90px">
                <label style="font-size:0.75rem;color:#888;display:block;margin-bottom:4px">Precio/par</label>
                <input type="number" class="form-input" id="ep-precio-corrida" placeholder="$" style="font-size:0.9rem">
              </div>
            </div>
            <div id="ep-corrida-tallas" style="display:none;background:#f9f9f9;border-radius:8px;padding:12px;margin-top:10px">
              <p style="font-size:0.8rem;font-weight:600;color:#333;margin-bottom:8px" id="ep-corrida-titulo">Selecciona tallas:</p>
              <div id="ep-corrida-tallas-grid" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px"></div>
              <button class="btn btn-primary" style="background:#6a1b9a;border-color:#6a1b9a" onclick="window.agregarCorridaAlPedidoEdicion()">📦 Agregar corrida</button>
            </div>
          </div>
        </div>

        <!-- ITEMS ACTUALES -->
        ${items.map((item, idx) => {
          const variante = item.variantes || {}
          const producto = variante.productos || {}
          const nombre = producto.nombre || item.nombre || '—'
          const color = variante.color || item.color || ''
          const talla = variante.talla || item.talla || ''
          const esCorridaBadge = item.es_corrida ? `<span style="background:#f3e5f5;color:#6a1b9a;font-size:0.65rem;font-weight:700;padding:2px 6px;border-radius:100px;margin-left:6px">📦 Corrida</span>` : ''
          let imagen = producto.imagen_principal || null
          if (!imagen && item.variante_id && window._editVariantes && window._editProductos) {
            const v = window._editVariantes.find(x => x.id === item.variante_id)
            if (v) { const pr = window._editProductos.find(x => x.id === v.producto_id); if (pr) imagen = pr.imagen_principal || null }
          }
          return `
            <div style="display:flex;align-items:center;gap:10px;padding:10px;background:white;border-radius:8px;margin-bottom:8px;border:1px solid #eee;flex-wrap:wrap">
              ${imagen ? '<img src="' + imagen + '" style="width:48px;height:48px;object-fit:cover;border-radius:6px;flex-shrink:0;border:1px solid #eee">' : '<div style="width:48px;height:48px;background:#f0f0f0;border-radius:6px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.2rem">👟</div>'}
              <div style="flex:1;min-width:120px">
                <p style="font-weight:600;font-size:0.85rem;margin:0">${nombre}${color ? ' · ' + color : ''}${talla ? ' T' + talla : ''}${esCorridaBadge}</p>
              </div>
              <div style="display:flex;align-items:center;gap:6px">
                <label style="font-size:0.78rem;color:#888">Cant.</label>
                <input type="number" min="1" value="${item.cantidad}" style="width:60px;padding:4px 6px;border:1px solid #ddd;border-radius:6px;font-size:0.85rem"
                  onchange="window._editItems[${idx}].cantidad = parseInt(this.value)||1; window._editItems[${idx}].subtotal = window._editItems[${idx}].cantidad * window._editItems[${idx}].precio_unitario; window.recalcularPreciosEdicion(); window._renderEdicion()">
              </div>
              <div style="display:flex;align-items:center;gap:6px">
                <label style="font-size:0.78rem;color:#888">Precio</label>
                <input type="number" min="0" value="${item.precio_unitario}" style="width:80px;padding:4px 6px;border:1px solid #ddd;border-radius:6px;font-size:0.85rem"
                  onchange="window._editItems[${idx}]._precio_manual = true; window._editItems[${idx}].precio_unitario = parseFloat(this.value)||0; window._editItems[${idx}].subtotal = window._editItems[${idx}].cantidad * window._editItems[${idx}].precio_unitario; window.recalcularPreciosEdicion(); window._renderEdicion()">
              </div>
              <button onclick="eliminarItemEdicion('${item.id}', ${idx})" style="background:none;border:none;cursor:pointer;color:#c62828;font-size:1.1rem;padding:4px" title="Eliminar">🗑</button>
            </div>
          `
        }).join('')}

        <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid #ffe082;display:flex;align-items:center;gap:12px;flex-wrap:wrap">
          <label style="font-size:0.85rem;color:#333;font-weight:600">Descuento manual ($):</label>
          <input type="number" id="edit-descuento" min="0" value="0" style="width:90px;padding:6px;border:1px solid #ddd;border-radius:6px;font-size:0.85rem">
          <span style="font-size:0.8rem;color:#888">(se resta del total final)</span>
        </div>

        <div style="margin-top:1rem;display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-primary" onclick="guardarEdicionPedido()">💾 Guardar cambios</button>
          <button class="btn btn-secondary" onclick="cancelarEdicionPedido('${pedidoId}')">Cancelar</button>
        </div>
      </div>
    `
  }

  renderEdicion()
  window._renderEdicion = renderEdicion
}

// ── Editar pedido: toggle par suelto / corrida ──────────────────────────────
window.editPedidoModo = (modo) => {
  const panPar = document.getElementById('ep-panel-par')
  const panCorrida = document.getElementById('ep-panel-corrida')
  const btnPar = document.getElementById('ep-modo-par')
  const btnCorrida = document.getElementById('ep-modo-corrida')
  if (panPar) panPar.style.display = modo === 'par' ? 'block' : 'none'
  if (panCorrida) panCorrida.style.display = modo === 'corrida' ? 'block' : 'none'
  if (btnPar) { btnPar.style.background = modo === 'par' ? '#E91E8C' : 'white'; btnPar.style.color = modo === 'par' ? 'white' : '#888' }
  if (btnCorrida) { btnCorrida.style.background = modo === 'corrida' ? '#6a1b9a' : 'white'; btnCorrida.style.color = modo === 'corrida' ? 'white' : '#888' }
}

// ── Par suelto: buscador con chips de talla tocables ─────────────────────────
window.buscarProductoPedidoEdicion = (texto) => {
  const variantes = window._editVariantes || []
  const productos = window._editProductos || []
  const inventario = window._editInventario || []
  const res = document.getElementById('ep-prod-resultados')
  if (!res) return
  window.posicionarDropdownCarrito('ep-prod-resultados', 'ep-buscar-prod')
  if (!texto || texto.length < 2) { res.style.display = 'none'; return }

  const TALLAS_ORDEN = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Unica']
  const terminos = texto.toLowerCase().split(' ').filter(Boolean)
  const filtradas = variantes.filter(v => {
    const prod = productos.find(p => p.id === v.producto_id)
    const txt = ((prod?.nombre || '') + ' ' + (v.color || '') + ' ' + (v.talla || '') + ' ' + (prod?.sku_interno || '')).toLowerCase()
    return terminos.every(t => txt.includes(t))
  })

  if (!filtradas.length) {
    res.innerHTML = '<div style="padding:12px 14px;color:#888;font-size:0.85rem">Sin resultados</div>'
    res.style.display = 'block'
    return
  }

  const grupos = {}
  filtradas.forEach(v => {
    const prod = productos.find(p => p.id === v.producto_id)
    const key = v.producto_id + '|' + (v.color || '')
    if (!grupos[key]) grupos[key] = { nombre: prod?.nombre || '—', color: v.color || '', foto: prod?.imagen_principal, hex: v.color_hex, vars: [] }
    grupos[key].vars.push(v)
  })
  const arr = Object.values(grupos).slice(0, 6)

  res.style.display = 'block'
  res.innerHTML = arr.map(g => {
    const chips = g.vars
      .sort((a, b) => TALLAS_ORDEN.indexOf(a.talla) - TALLAS_ORDEN.indexOf(b.talla))
      .map(v => {
        const inv = inventario.find(i => i.variante_id === v.id)
        const stock = inv ? inv.cantidad : 0
        const enPedido = (window._editItems || []).filter(i => i.variante_id === v.id).reduce((s, i) => s + i.cantidad, 0)
        return `
          <button onmousedown="event.preventDefault()" onclick="window.quickAddPedidoEdicion('${v.id}')" ${stock <= 0 ? 'disabled' : ''}
            style="position:relative;min-width:50px;min-height:48px;padding:5px 9px;border:1.5px solid ${enPedido > 0 ? '#E91E8C' : '#ddd'};border-radius:10px;background:${enPedido > 0 ? '#fce4f3' : '#fff'};font-family:inherit;cursor:${stock <= 0 ? 'not-allowed' : 'pointer'};${stock <= 0 ? 'opacity:0.45;' : ''}display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.1;touch-action:manipulation">
            <span style="font-size:0.92rem;font-weight:800;color:#333">T${v.talla}</span>
            <span style="font-size:0.6rem;font-weight:600;color:${stock > 0 ? '#2e7d32' : '#c62828'}">${stock > 0 ? 'stock ' + stock : 'agotado'}</span>
            ${enPedido > 0 ? `<span style="position:absolute;top:-7px;right:-7px;background:#E91E8C;color:#fff;border-radius:100px;min-width:19px;height:19px;font-size:0.65rem;display:flex;align-items:center;justify-content:center;font-weight:800;padding:0 4px">${enPedido}</span>` : ''}
          </button>`
      }).join('')
    return `
      <div style="padding:11px 12px;border-bottom:1px solid #f0f0f0">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:9px">
          ${g.foto ? `<img src="${g.foto}" style="width:36px;height:36px;object-fit:cover;border-radius:7px;flex-shrink:0">` : `<div style="width:36px;height:36px;background:#f3f3f3;border-radius:7px;flex-shrink:0;display:flex;align-items:center;justify-content:center">👠</div>`}
          ${g.hex ? `<span style="width:13px;height:13px;border-radius:50%;background:${g.hex};border:1px solid #ddd;flex-shrink:0"></span>` : ''}
          <span style="font-size:0.86rem;font-weight:600;line-height:1.2">${g.nombre}</span>
          <span style="font-size:0.78rem;color:#888">· ${g.color}</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:7px">${chips}</div>
      </div>`
  }).join('')
}

// Toca una talla = agregar 1 par al pedido (buscador queda abierto)
window.quickAddPedidoEdicion = async (varianteId) => {
  const variantes = window._editVariantes || []
  const productos = window._editProductos || []
  const v = variantes.find(x => x.id === varianteId)
  const prod = v ? productos.find(p => p.id === v.producto_id) : null
  const pedidoId = window._editPedidoId
  const queryActual = document.getElementById('ep-buscar-prod')?.value || ''

  const items = window._editItems || []
  const totalPares = items.reduce((s, i) => s + i.cantidad, 0) + 1
  const base = parseFloat(prod?.precio_menudeo) || 0
  const p3 = parseFloat(prod?.precio_mayoreo3) || Math.max(0, base - 30)
  const p6 = parseFloat(prod?.precio_mayoreo6) || Math.max(0, base - 70)
  const precio = totalPares >= 6 ? p6 : totalPares >= 3 ? p3 : base

  const existente = items.find(i => i.variante_id === varianteId && !i.es_corrida)
  try {
    if (existente) {
      await fetch(API + '/pedidos/' + pedidoId + '/items/' + existente.id, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad: existente.cantidad + 1, precio_unitario: existente.precio_unitario })
      })
    } else {
      await fetch(API + '/pedidos/' + pedidoId + '/items', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variante_id: varianteId, cantidad: 1, precio_unitario: precio, subtotal: precio, nombre: prod?.nombre || '', color: v?.color || '', talla: v?.talla || '' })
      })
    }
    const resItems = await fetch(API + '/pedidos/' + pedidoId + '/items').then(r => r.json())
    window._editItems = Array.isArray(resItems) ? resItems : []
    window.recalcularPreciosEdicion()
    window._renderEdicion()
    if (typeof mostrarToastPanel === 'function') mostrarToastPanel('✓ ' + (prod?.nombre || '') + ' T' + (v?.talla || '') + ' agregado')
    if (queryActual) setTimeout(() => {
      const inp = document.getElementById('ep-buscar-prod')
      if (inp) { inp.value = queryActual; window.buscarProductoPedidoEdicion(queryActual) }
    }, 300)
  } catch(e) { alert('Error: ' + e.message) }
}

// ── Corrida: buscador por modelo, grid de tallas con +/- ────────────────────
window.buscarModeloPedidoEdicion = (texto) => {
  const variantes = window._editVariantes || []
  const productos = window._editProductos || []
  const res = document.getElementById('ep-corrida-resultados')
  const tallasPanel = document.getElementById('ep-corrida-tallas')
  window.posicionarDropdownCarrito('ep-corrida-resultados', 'ep-buscar-corrida')
  if (!texto || texto.length < 2) {
    if (res) res.style.display = 'none'
    if (tallasPanel) tallasPanel.style.display = 'none'
    return
  }

  const grupos = {}
  variantes.forEach(v => {
    const prod = productos.find(p => p.id === v.producto_id)
    if (!prod) return
    const txt = ((prod.nombre || '') + ' ' + (v.color || '') + ' ' + (prod.sku_interno || '')).toLowerCase()
    if (!texto.toLowerCase().split(' ').every(t => txt.includes(t))) return
    const key = prod.id + '|' + (v.color || '')
    if (!grupos[key]) grupos[key] = { prod, color: v.color || '', variantes: [] }
    grupos[key].variantes.push(v)
  })

  const entradas = Object.values(grupos).slice(0, 6)
  if (!entradas.length || !res) return
  res.style.display = 'block'
  res.innerHTML = entradas.map(g => `
    <div onclick="window.seleccionarModeloEdicion('${g.prod.id}','${g.color.replace(/'/g,"\\'")}')"
         style="display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:pointer;border-bottom:1px solid #f0f0f0"
         onmouseenter="this.style.background='#f9f9f9'" onmouseleave="this.style.background=''">
      ${g.prod.imagen_principal ? `<img src="${g.prod.imagen_principal}" style="width:36px;height:36px;object-fit:cover;border-radius:6px">` : '<div style="width:36px;height:36px;background:#eee;border-radius:6px"></div>'}
      <div>
        <p style="font-size:0.85rem;font-weight:600;margin:0">${g.prod.nombre} · ${g.color}</p>
        <p style="font-size:0.72rem;color:#888;margin:0">${g.variantes.length} tallas disponibles</p>
      </div>
    </div>
  `).join('')
}

window.seleccionarModeloEdicion = (productoId, color) => {
  const variantes = window._editVariantes || []
  const productos = window._editProductos || []
  const inventario = window._editInventario || []
  const prod = productos.find(p => p.id === productoId)
  const inp = document.getElementById('ep-buscar-corrida')
  const res = document.getElementById('ep-corrida-resultados')
  if (inp) inp.value = `${prod?.nombre || ''} · ${color}`
  if (res) res.style.display = 'none'

  const TALLAS_ORDEN = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Unica']
  const varsColor = variantes
    .filter(v => v.producto_id === productoId && v.color === color)
    .sort((a, b) => TALLAS_ORDEN.indexOf(a.talla) - TALLAS_ORDEN.indexOf(b.talla))

  const base = parseFloat(prod?.precio_menudeo) || 0
  const precioCorrida = parseFloat(prod?.precio_corrida) || (base > 0 ? Math.round(base - 100) : 0)
  const precioInp = document.getElementById('ep-precio-corrida')
  if (precioInp) precioInp.value = precioCorrida || ''

  window._editCorridaSeleccionada = { productoId, color, variantes: varsColor, prod, precioCorrida }

  const titulo = document.getElementById('ep-corrida-titulo')
  if (titulo) titulo.textContent = `Tallas para ${prod?.nombre || ''} · ${color}:`

  const grid = document.getElementById('ep-corrida-tallas-grid')
  if (grid) grid.innerHTML = varsColor.map(v => {
    const inv = inventario.find(i => i.variante_id === v.id)
    const stock = inv ? inv.cantidad : null
    const agotada = stock !== null && stock === 0
    const qty = agotada ? 0 : 1
    const cardId = `ep-card-${v.id}`
    const inputId = `ep-qty-${v.id}`
    return `
      <div id="${cardId}" class="size-card" style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px 12px;border:2px solid ${agotada ? '#fecaca' : qty > 0 ? '#E91E8C' : '#e2e8f0'};border-radius:12px;background:${agotada ? '#fef2f2' : qty > 0 ? '#fdf2f8' : '#fff'};min-width:70px;transition:all 0.2s;position:relative;opacity:${agotada ? 0.6 : 1}">
        <span style="font-weight:800;font-size:0.9rem;color:#0f172a">T${v.talla}</span>
        <div style="display:flex;align-items:center;gap:4px">
          <button type="button" onclick="const inp=document.getElementById('${inputId}');inp.value=Math.max(0,parseInt(inp.value||0)-1);inp.dispatchEvent(new Event('input'))"
            style="background:#f1f5f9;color:#475569;border:none;border-radius:6px;width:24px;height:24px;cursor:pointer;font-size:1rem;font-weight:700;display:flex;align-items:center;justify-content:center" ${agotada ? 'disabled' : ''}>−</button>
          <input type="number" value="${qty}" min="0" max="${stock !== null ? stock : 999}" id="${inputId}" data-variante="${v.id}"
            style="width:36px;height:24px;text-align:center;border:1px solid #cbd5e1;border-radius:6px;font-size:0.85rem;font-weight:700;color:#0f172a;outline:none"
            oninput="const val=Math.min(parseInt(this.max)||999,Math.max(0,parseInt(this.value)||0));this.value=val;const card=document.getElementById('${cardId}');if(val>0){card.style.borderColor='#E91E8C';card.style.background='#fdf2f8'}else{card.style.borderColor='#e2e8f0';card.style.background='#fff'}"
            ${agotada ? 'disabled' : ''}>
          <button type="button" onclick="const inp=document.getElementById('${inputId}');const max=parseInt(inp.max||999);const cur=parseInt(inp.value||0);if(cur<max){inp.value=cur+1;inp.dispatchEvent(new Event('input'))}else{inp.style.borderColor='#ef4444';setTimeout(()=>inp.style.borderColor='#cbd5e1',800)}"
            style="background:#f1f5f9;color:#475569;border:none;border-radius:6px;width:24px;height:24px;cursor:pointer;font-size:1rem;font-weight:700;display:flex;align-items:center;justify-content:center" ${agotada ? 'disabled' : ''}>+</button>
        </div>
        <span style="font-size:0.65rem;font-weight:600;color:${stock === null ? '#94a3b8' : stock > 0 ? '#10b981' : '#ef4444'}">
          ${stock === null ? 'Stock: ?' : stock > 0 ? `${stock} disp.` : 'Agotado'}
        </span>
      </div>`
  }).join('')

  const panel = document.getElementById('ep-corrida-tallas')
  if (panel) panel.style.display = 'block'
}

window.agregarCorridaAlPedidoEdicion = async () => {
  const sel = window._editCorridaSeleccionada
  if (!sel?.prod) { alert('Selecciona un modelo primero'); return }
  const precio = parseFloat(document.getElementById('ep-precio-corrida')?.value) || sel.precioCorrida || 0
  if (!precio) { alert('Ingresa el precio por par'); return }
  const inputs = document.querySelectorAll('#ep-corrida-tallas-grid input[type=number][data-variante]')
  const seleccionados = Array.from(inputs).filter(inp => parseInt(inp.value) > 0)
  if (!seleccionados.length) { alert('Ingresa al menos 1 par en alguna talla'); return }
  const pedidoId = window._editPedidoId
  const btn = event.currentTarget; btn.textContent = 'Agregando...'; btn.disabled = true
  try {
    for (const inp of seleccionados) {
      const varianteId = inp.dataset.variante
      const cantidad = parseInt(inp.value) || 1
      const v = sel.variantes.find(x => x.id === varianteId)
      await fetch(API + '/pedidos/' + pedidoId + '/items', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variante_id: varianteId, cantidad, precio_unitario: precio, subtotal: cantidad * precio, nombre: sel.prod.nombre, color: sel.color, talla: v?.talla || '', es_corrida: true })
      })
    }
    const resItems = await fetch(API + '/pedidos/' + pedidoId + '/items').then(r => r.json())
    window._editItems = Array.isArray(resItems) ? resItems : []
    window.recalcularPreciosEdicion()
    window._editCorridaSeleccionada = null
    window._renderEdicion()
    if (typeof mostrarToastPanel === 'function') mostrarToastPanel('📦 Corrida agregada al pedido')
  } catch(e) { alert('Error: ' + e.message) }
  finally { btn.textContent = '📦 Agregar corrida'; btn.disabled = false }
}

window.recalcularPreciosEdicion = () => {
  const items = window._editItems || []
  const productos = window._editProductos || []
  const variantes = window._editVariantes || []
  
  const totalPares = items.reduce((s, i) => s + i.cantidad, 0)
  const tier = totalPares >= 6 ? 'mayoreo6' : totalPares >= 3 ? 'mayoreo3' : 'menudeo'
  
  items.forEach(item => {
    if (item.es_corrida) return
    
    const v = variantes.find(x => x.id === item.variante_id)
    const prod = v ? productos.find(p => p.id === v.producto_id) : null
    if (!prod) return
    
    const base = parseFloat(prod.precio_menudeo) || 0
    const p3 = parseFloat(prod.precio_mayoreo3) || (base - 30)
    const p6 = parseFloat(prod.precio_mayoreo6) || (base - 70)
    
    if (item._precio_manual === undefined) {
      if (item.precio_unitario !== base && item.precio_unitario !== p3 && item.precio_unitario !== p6) {
        item._precio_manual = true
      }
    }
    
    if (item._precio_manual) return
    
    let nuevoPrecio = base
    if (tier === 'mayoreo6') {
      nuevoPrecio = p6
    } else if (tier === 'mayoreo3') {
      nuevoPrecio = p3
    }
    
    item.precio_unitario = nuevoPrecio
    item.subtotal = item.cantidad * nuevoPrecio
  })
}

window.eliminarItemEdicion = async (itemId, idx) => {
  if (!confirm('¿Eliminar este producto del pedido?')) return
  const pedidoId = window._editPedidoId
  const res = await fetch(API + '/pedidos/' + pedidoId + '/items/' + itemId, { method: 'DELETE' })
  const data = await res.json()
  if (data.ok) {
    window._editItems.splice(idx, 1)
    window.recalcularPreciosEdicion()
    window._renderEdicion()
  } else {
    alert('Error eliminando ítem: ' + JSON.stringify(data))
  }
}

window.guardarEdicionPedido = async () => {
  const pedidoId = window._editPedidoId
  const items = window._editItems
  const descuento = parseFloat(document.getElementById('edit-descuento').value) || 0

  // Actualizar cada ítem en paralelo
  await Promise.all(items.map(item =>
    fetch(API + '/pedidos/' + pedidoId + '/items/' + item.id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cantidad: item.cantidad, precio_unitario: item.precio_unitario })
    })
  ))

  // Recalcular total con descuento
  const nuevoTotal = Math.max(0, items.reduce((s, i) => s + (i.cantidad * i.precio_unitario), 0) - descuento)
  await fetch(API + '/pedidos/' + pedidoId, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ total: nuevoTotal })
  })

  alert('Pedido actualizado correctamente')
  verPedido(pedidoId)
}

window.cancelarEdicionPedido = (pedidoId) => {
  verPedido(pedidoId)
}

window.cancelarPedido = async (id) => {
  if (!confirm('¿Cancelar este pedido? Si ya estaba confirmado se devolverá el stock automáticamente.')) return
  try {
    const res = await fetch(API + '/pedidos/' + id + '/cancelar', { method: 'POST' })
    const data = await res.json()
    if (data.ok) {
      alert(data.stock_devuelto ? 'Pedido cancelado. Stock devuelto al inventario.' : 'Pedido cancelado.')
      verPedido(id)
    } else {
      alert('Error: ' + JSON.stringify(data))
    }
  } catch(e) {
    alert('Error conectando con el servidor')
  }
}

window.reconfirmarPedido = async (id) => {
  if (!confirm('¿Reconfirmar este pedido? Se descontará el stock del inventario nuevamente.')) return
  try {
    const res = await fetch(API + '/pedidos/' + id + '/reconfirmar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
    const data = await res.json()
    if (data.ok) {
      alert('Pedido reconfirmado correctamente.')
      verPedido(id)
    } else {
      alert('Error: ' + JSON.stringify(data))
    }
  } catch(e) {
    alert('Error conectando con el servidor')
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
      // Enviar template de confirmación vía WhatsApp si hay teléfono
      try {
        const resPed = await fetch(API + '/pedidos/' + id).then(r => r.json())
        const tel = resPed.telefono_cliente
        const nombre = (resPed.nombre_cliente || 'Cliente').split(' ')[0]
        const total = resPed.total ? '$' + parseFloat(resPed.total).toFixed(0) : ''
        if (tel) {
          await fetch(API + '/chatbot/templates/enviar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              telefono: tel,
              template: 'confirmacion_pedido',
              params: [nombre, String(id).slice(-6), total]
            })
          })
        }
      } catch(_) {}
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
    const [productos, variantes, sucursales, clientes, inventario] = await Promise.all([
      fetch(API + '/productos/').then(r => r.json()),
      fetch(API + '/variantes/').then(r => r.json()),
      fetch(API + '/sucursales/').then(r => r.json()),
      fetch(API + '/clientes/').then(r => r.json()),
      fetch(API + '/inventario/').then(r => r.json())
    ])

    window._posData = { productos, variantes, sucursales, clientes, inventario }
    // Restaurar carrito guardado en el navegador para que no se pierda al recargar
    window._posCarrito = cargarCarritoLocal()
    window._posClienteId = null

    content.innerHTML = `
      <div id="pos-layout" style="display:grid;grid-template-columns:1fr 380px;gap:1rem;height:calc(100vh - 80px)">

        <div style="overflow-y:auto;padding-right:0.5rem">
          <div style="background:white;border-radius:12px;padding:1rem;margin-bottom:1rem;border:1px solid #eee;position:sticky;top:0;z-index:10">
            <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:0.75rem">
  <input class="form-input" id="pos-buscar" placeholder="🔍 Buscar por nombre o SKU..." style="width:100%;font-size:1rem;min-height:44px;padding:10px 14px" oninput="buscarPOS(this.value)">
  <select class="form-input" id="pos-sucursal" style="width:100%" onchange="actualizarInventarioPOS()">
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
          <div id="pos-productos-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:1rem;padding-bottom:80px">
          </div>
        </div>

        <div id="pos-carrito-desktop" style="background:white;border-radius:12px;border:1px solid #eee;display:flex;flex-direction:column;overflow:hidden">
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
            <select class="form-input" id="pos-pago" style="width:100%;background:white;color:#333;font-size:0.85rem;margin-bottom:8px">
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="spei">SPEI</option>
              <option value="credito">Credito</option>
            </select>
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
            <button class="btn btn-primary" style="width:100%;padding:12px;font-size:1rem;font-weight:600" onclick="cobrarPOS()">Cobrar</button>
            <button class="btn btn-secondary" style="width:100%;margin-top:6px;font-size:0.9rem;font-weight:600;border-color:#E91E8C;color:#E91E8C" onclick="guardarCarritoPOS(false)">💾 Guardar carrito</button>
            <button class="btn btn-secondary" style="width:100%;margin-top:6px;font-size:0.85rem" onclick="limpiarCarritoPOS()">Limpiar carrito</button>
          </div>
        </div>

      </div>

      <!-- BOTÓN FLOTANTE MÓVIL -->
      <div id="pos-btn-flotante" onclick="abrirDrawerPOS()" style="display:none;position:fixed;bottom:0;left:0;right:0;z-index:100;background:#E91E8C;color:white;padding:14px 20px;align-items:center;justify-content:space-between;cursor:pointer;box-shadow:0 -4px 20px rgba(0,0,0,0.2)">
        <div>
          <p style="font-size:0.7rem;font-weight:700;opacity:0.8;letter-spacing:1px">CARRITO</p>
          <p id="pos-flotante-pares" style="font-size:0.85rem;font-weight:700">0 pares</p>
        </div>
        <p id="pos-flotante-total" style="font-size:1.3rem;font-weight:800">$0.00</p>
        <div style="background:white;color:#E91E8C;padding:8px 16px;border-radius:8px;font-size:0.85rem;font-weight:700">Ver carrito →</div>
      </div>

      <!-- DRAWER MÓVIL -->
      <div id="pos-drawer-overlay" onclick="cerrarDrawerPOS()" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:199"></div>
      <div id="pos-drawer" style="position:fixed;bottom:0;left:0;right:0;z-index:200;background:white;border-radius:20px 20px 0 0;max-height:90vh;overflow-y:auto;transform:translateY(100%);transition:transform 0.3s ease">
        <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:white;z-index:10">
          <p style="font-weight:700;font-size:1.1rem">🛒 Carrito</p>
          <button onclick="cerrarDrawerPOS()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:#888">✕</button>
        </div>
        <div style="padding:0.75rem 1rem;border-bottom:1px solid #eee">
          <input class="form-input" id="pos-cliente-buscar-m" placeholder="🔍 Buscar cliente..." style="width:100%;font-size:0.9rem" oninput="buscarClientePOSM(this.value)">
          <div id="pos-cliente-resultados-m" style="border:1px solid #ddd;border-radius:6px;max-height:150px;overflow-y:auto;display:none;background:white;margin-top:4px"></div>
          <div id="pos-cliente-sel-m" style="display:none;margin-top:6px;padding:6px 10px;background:#e8f5e9;border-radius:6px;font-size:0.82rem;color:#2e7d32;cursor:pointer" onclick="limpiarClientePOSM()"></div>
        </div>
        <div id="pos-drawer-items" style="padding:0.75rem 1rem"></div>
        <div style="padding:1rem 1.5rem;border-top:1px solid #eee">
          <div style="display:flex;justify-content:space-between;margin-bottom:6px">
            <span style="color:#888;font-size:0.85rem">Pares: <strong id="pos-drawer-pares">0</strong></span>
            <span style="color:#888;font-size:0.85rem">Tipo: <strong id="pos-drawer-tipo">Menudeo</strong></span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
            <span style="font-weight:600;font-size:1rem">Total:</span>
            <span style="font-weight:800;font-size:1.5rem;color:#E91E8C" id="pos-drawer-total">$0.00</span>
          </div>
          <div style="background:#fff8e1;border-radius:8px;padding:12px;margin-bottom:12px;border:1px solid #ffe082">
            <p style="font-size:0.78rem;font-weight:700;color:#f57f17;margin-bottom:8px">Descuento por par</p>
            <div style="display:flex;align-items:center;gap:8px">
              <span style="color:#f57f17;font-weight:700">$</span>
              <input type="number" min="0" value="0" id="pos-descuento-m"
                style="width:80px;text-align:center;padding:8px;border:2px solid #f57f17;border-radius:8px;font-size:1rem;font-weight:700;color:#f57f17"
                oninput="aplicarDescuentoPOS(this.value)">
              <span style="color:#f57f17;font-size:0.85rem">de descuento por par</span>
            </div>
          </div>
          <select class="form-input" id="pos-pago-m" style="width:100%;margin-bottom:12px;font-size:0.95rem">
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="spei">SPEI</option>
            <option value="credito">Credito</option>
          </select>
          <button onclick="cobrarPOSM()" class="btn btn-primary" style="width:100%;padding:14px;font-size:1rem;font-weight:700;margin-bottom:8px">💳 Cobrar</button>
          <button onclick="guardarCarritoPOS(true)" class="btn btn-secondary" style="width:100%;font-size:0.9rem;font-weight:600;margin-bottom:8px;border-color:#E91E8C;color:#E91E8C">💾 Guardar carrito</button>
          <button onclick="limpiarCarritoPOS();cerrarDrawerPOS()" class="btn btn-secondary" style="width:100%;font-size:0.9rem">🗑 Limpiar carrito</button>
        </div>
      </div>
    `

    renderProductosPOS(productos.filter(p => p.activo))
    renderCarritoPOS()  // pintar el carrito restaurado (si lo hay)

  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error cargando punto de venta</p>'
  }
}

// Persistencia del carrito del POS en el navegador (sobrevive recargas)
const POS_CARRITO_KEY = 'pos_carrito_v1'
function cargarCarritoLocal() {
  try {
    const raw = localStorage.getItem(POS_CARRITO_KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch (_) { return [] }
}
function guardarCarritoLocal() {
  try { localStorage.setItem(POS_CARRITO_KEY, JSON.stringify(window._posCarrito || [])) } catch (_) {}
}
window.abrirDrawerPOS = () => {
  renderDrawerPOS()
  const drawer = document.getElementById('pos-drawer')
  const overlay = document.getElementById('pos-drawer-overlay')
  if (drawer) drawer.classList.add('open')
  if (overlay) overlay.classList.add('active')
  document.body.style.overflow = 'hidden'
}

window.cerrarDrawerPOS = () => {
  const drawer = document.getElementById('pos-drawer')
  const overlay = document.getElementById('pos-drawer-overlay')
  if (drawer) drawer.classList.remove('open')
  if (overlay) overlay.classList.remove('active')
  document.body.style.overflow = ''
}
window.renderDrawerPOS = () => {
  const items = window._posCarrito
  const container = document.getElementById('pos-drawer-items')
  if (!container) return

  const totalPares = items.reduce((s,i) => s+i.cantidad, 0)
  const total = items.reduce((s,i) => s+i.cantidad*i.precio_unitario, 0)
  const tipo = items.some(i=>i.es_corrida)?'Corrida':totalPares>=6?'Mayoreo 6+':totalPares>=3?'Mayoreo 3+':'Menudeo'

  const dp = document.getElementById('pos-drawer-pares')
  const dt = document.getElementById('pos-drawer-total')
  const dti = document.getElementById('pos-drawer-tipo')
  if (dp) dp.textContent = totalPares
  if (dt) dt.textContent = '$' + total.toFixed(2)
  if (dti) dti.textContent = tipo

  if (!items.length) {
    container.innerHTML = '<p style="color:#888;text-align:center;padding:2rem">El carrito esta vacio</p>'
    return
  }

  const itemsNormales = items.filter(i => !i.es_corrida)
  const itemsCorrida = items.filter(i => i.es_corrida)

  const corridasAgrupadas = {}
  itemsCorrida.forEach(i => {
    const key = i.producto_id + '|' + i.color
    if (!corridasAgrupadas[key]) {
      corridasAgrupadas[key] = { nombre: i.nombre, color: i.color, producto_id: i.producto_id, tallas: [], subtotal: 0, imagen: i.imagen || null }
    }
    corridasAgrupadas[key].tallas.push({ talla: i.talla, cantidad: i.cantidad })
    corridasAgrupadas[key].subtotal += i.cantidad * i.precio_unitario
  })

  container.innerHTML = `
    ${itemsNormales.map(item => {
      
      const realIdx = items.indexOf(item)
      return `
        <div style="padding:12px 0;border-bottom:1px solid #f5f5f5">
  <div style="display:flex;gap:10px;margin-bottom:8px;align-items:start">
    ${item.imagen ? `<img src="${item.imagen}" object-fit:contain;border-radius:8px;flex-shrink:0;background:#f5f5f5>` : `<div style="width:48px;height:48px;background:#f5f5f5;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.3rem">👠</div>`}
    <div style="flex:1">
      <p style="font-size:0.9rem;font-weight:600">${item.nombre}</p>
      <p style="font-size:0.78rem;color:#888">${item.color} · T${item.talla}</p>
    </div>
    <button onclick="eliminarItemPOS(${realIdx});renderDrawerPOS()" style="background:none;border:none;color:#ccc;cursor:pointer;font-size:1.2rem">✕</button>
  </div>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div style="display:flex;align-items:center;gap:10px">
              <button onclick="cambiarCantidadPOS(${realIdx},-1);renderDrawerPOS()" style="background:#f5f5f5;border:none;border-radius:8px;width:38px;height:38px;cursor:pointer;font-size:1.2rem;font-weight:700;touch-action:manipulation">−</button>
              <span style="font-weight:700;min-width:24px;text-align:center">${item.cantidad}</span>
              <button onclick="cambiarCantidadPOS(${realIdx},1);renderDrawerPOS()" style="background:#f5f5f5;border:none;border-radius:8px;width:38px;height:38px;cursor:pointer;font-size:1.2rem;font-weight:700;touch-action:manipulation">+</button>
            </div>
            <div style="display:flex;align-items:center;gap:4px">
              <span style="font-size:0.72rem;color:#888">$</span>
              <input type="number" value="${item.precio_unitario}"
                     onchange="editarPrecioPOS(${realIdx}, this.value);renderDrawerPOS()"
                     style="width:64px;text-align:center;border:1px solid #E91E8C;border-radius:6px;padding:4px;font-size:0.9rem;font-weight:700;color:#E91E8C">
              <span style="font-size:0.72rem;color:#888">/par</span>
            </div>
          </div>
          <p style="text-align:right;font-size:0.95rem;font-weight:700;color:#E91E8C;margin-top:4px">$${(item.cantidad*item.precio_unitario).toFixed(2)}</p>
        </div>
      `
    }).join('')}

    ${Object.entries(corridasAgrupadas).map(([key, corrida]) => `
      <div style="background:#fdf4ff;border-radius:8px;padding:12px;margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px">
          ${corrida.imagen ? `<img src="${corrida.imagen}" style="width:52px;height:52px;object-fit:cover;border-radius:8px;flex-shrink:0">` : '<div style="width:52px;height:52px;background:#f3e5f5;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.5rem">👠</div>'}
          <div style="flex:1">
            <p style="font-size:0.9rem;font-weight:700">${corrida.nombre}</p>
            <p style="font-size:0.78rem;color:#6a1b9a;font-weight:600">📦 Corrida · ${corrida.color}</p>
            <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">
              ${corrida.tallas.map(t => `<span style="background:#f3e5f5;border-radius:100px;padding:2px 8px;font-size:0.72rem;color:#6a1b9a">T${t.talla} ×${t.cantidad}</span>`).join('')}
            </div>
          </div>
          <button onclick="eliminarCorridaPOS('${key}');renderDrawerPOS()" style="background:none;border:none;color:#ccc;cursor:pointer;font-size:1.2rem">✕</button>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;flex-wrap:wrap;gap:8px">
          <span style="font-size:0.85rem;color:#888">${corrida.tallas.reduce((s,t)=>s+t.cantidad,0)} pares</span>
          <div style="display:flex;align-items:center;gap:4px">
            <span style="font-size:0.72rem;color:#888">$</span>
            <input type="number" value="${(corrida.subtotal/corrida.tallas.reduce((s,t)=>s+t.cantidad,0)).toFixed(2)}"
                   onchange="editarPrecioCorridaPOS('${key}', this.value);renderDrawerPOS()"
                   style="width:64px;text-align:center;border:1px solid #6a1b9a;border-radius:6px;padding:4px;font-size:0.9rem;font-weight:700;color:#6a1b9a">
            <span style="font-size:0.72rem;color:#888">/par</span>
          </div>
          <span style="font-weight:700;color:#6a1b9a">$${corrida.subtotal.toFixed(2)}</span>
        </div>
      </div>
    `).join('')}
  `
}

window.cobrarPOSM = async () => {
  const pm = document.getElementById('pos-pago-m')
  const pp = document.getElementById('pos-pago')
  if (pm && pp) pp.value = pm.value
  cerrarDrawerPOS()
  await cobrarPOS()
}

window.buscarClientePOSM = (texto) => {
  const { clientes } = window._posData
  const res = document.getElementById('pos-cliente-resultados-m')
  if (!texto || texto.length < 2) { res.style.display='none'; return }
  const filtrados = clientes.filter(c => c.nombre.toLowerCase().includes(texto.toLowerCase())).slice(0,5)
  if (!filtrados.length) { res.style.display='none'; return }
  res.style.display = 'block'
  res.innerHTML = filtrados.map(c => `
    <div onclick="seleccionarClientePOSM('${c.id}','${c.nombre}')"
         style="padding:8px 12px;cursor:pointer;border-bottom:1px solid #f5f5f5;font-size:0.85rem"
         onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
      <strong>${c.nombre}</strong>${c.telefono?' · '+c.telefono:''}
    </div>
  `).join('')
}

window.seleccionarClientePOSM = (id, nombre) => {
  document.getElementById('pos-cliente').value = id
  document.getElementById('pos-cliente-buscar-m').value = ''
  document.getElementById('pos-cliente-resultados-m').style.display = 'none'
  const sel = document.getElementById('pos-cliente-sel-m')
  sel.textContent = '✔ ' + nombre + ' — toca para cambiar'
  sel.style.display = 'block'
}

window.limpiarClientePOSM = () => {
  document.getElementById('pos-cliente').value = ''
  document.getElementById('pos-cliente-sel-m').style.display = 'none'
  document.getElementById('pos-cliente-buscar-m').value = ''
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
    // Actualizar también el input del drawer móvil
    const descElM = document.getElementById('pos-descuento-m')
    if (descElM) descElM.value = descuento
    // Actualizar total del drawer
    const total2 = window._posCarrito.reduce((sum, i) => sum + (i.cantidad * i.precio_unitario), 0)
    const dtEl = document.getElementById('pos-drawer-total')
    if (dtEl) dtEl.textContent = '$' + total2.toFixed(2)
    if (document.getElementById('pos-drawer')?.classList.contains('open')) renderDrawerPOS()
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

  grid.innerHTML = productos.filter(p => p.activo).map(p => {
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
            ? `<img src="${p.imagen_principal}" style="width:100%;height:160px;object-fit:contain;background:#f5f5f5">`
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
  // Cerrar cualquier modal anterior
const modalAnterior = document.getElementById('pos-modal')
if (modalAnterior) modalAnterior.remove()
  const { productos, variantes, inventario } = window._posData
  const producto = productos.find(p => p.id === productoId)
  if (!producto) return

  const sucursalId = document.getElementById('pos-sucursal') ? document.getElementById('pos-sucursal').value : ''
  const invSucursal = inventario.filter(i => i.sucursal_id === sucursalId)
  const varsProd = variantes.filter(v => v.producto_id === productoId)
  const colores = [...new Set(varsProd.map(v => v.color).filter(Boolean))]
  const TALLAS_ORDEN = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Unica']

  // Precios por nivel (con los mismos defaults que usa el resto del POS)
  const pMenudeo = parseFloat(producto.precio_menudeo) || 0
  const pMay3    = parseFloat(producto.precio_mayoreo3) || (pMenudeo - 30)
  const pMay6    = parseFloat(producto.precio_mayoreo6) || (pMenudeo - 70)
  const pCorrida = parseFloat(producto.precio_corrida)  || (pMenudeo - 100)
  const fmtP = n => '$' + Math.round(n).toLocaleString('es-MX')

  // Buffer temporal de cantidades seleccionadas
  window._posBuffer = {}

  const modal = document.createElement('div')
  modal.id = 'pos-modal'
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem'
  
  modal.innerHTML = `
    <div style="background:white;border-radius:16px;max-width:640px;width:100%;height:90vh;display:flex;flex-direction:column;overflow:hidden">

      <div style="padding:1.25rem 1.5rem 0.85rem;border-bottom:1px solid #eee;flex-shrink:0">
        <div style="display:flex;align-items:flex-start;gap:12px">
          ${producto.imagen_principal ? `<img id="pos-modal-img" src="${producto.imagen_principal}" style="width:64px;height:64px;object-fit:cover;border-radius:10px;flex-shrink:0">` : ''}
          <div style="flex:1;min-width:0">
            <p style="font-weight:700;font-size:1rem;line-height:1.25">${producto.nombre}</p>
            <p style="font-size:0.8rem;color:#888">${producto.sku_interno || ''}</p>
            <p style="font-weight:800;color:#E91E8C;font-size:1.05rem;margin-top:2px">${fmtP(pMenudeo)} <span style="font-size:0.72rem;font-weight:600;color:#aaa">menudeo</span></p>
          </div>
          <button onclick="document.getElementById('pos-modal').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:#888;flex-shrink:0;line-height:1">✕</button>
        </div>
        <div style="display:flex;gap:6px;margin-top:10px">
          <div style="flex:1;background:#fafafa;border:1px solid #eee;border-radius:9px;padding:6px 4px;text-align:center">
            <p style="font-size:0.6rem;color:#888;font-weight:700;text-transform:uppercase;letter-spacing:0.3px">Mayoreo 3+</p>
            <p style="font-size:0.92rem;font-weight:800;color:#333">${fmtP(pMay3)}</p>
          </div>
          <div style="flex:1;background:#fafafa;border:1px solid #eee;border-radius:9px;padding:6px 4px;text-align:center">
            <p style="font-size:0.6rem;color:#888;font-weight:700;text-transform:uppercase;letter-spacing:0.3px">Mayoreo 6+</p>
            <p style="font-size:0.92rem;font-weight:800;color:#333">${fmtP(pMay6)}</p>
          </div>
          <div style="flex:1;background:#f3e5f5;border:1px solid #e1bee7;border-radius:9px;padding:6px 4px;text-align:center">
            <p style="font-size:0.6rem;color:#6a1b9a;font-weight:700;text-transform:uppercase;letter-spacing:0.3px">Corrida c/u</p>
            <p style="font-size:0.92rem;font-weight:800;color:#6a1b9a">${fmtP(pCorrida)}</p>
          </div>
        </div>
      </div>

      <div id="pos-modal-scroll" style="flex:1;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch">

      ${producto.corrida_activa ? `
      <div style="padding:12px 1.5rem 0">
        <div style="display:flex;gap:4px;background:var(--surface-2,#f5f3f7);border-radius:12px;padding:4px">
          <button id="pos-modo-variado" class="pos-modo-tab active" onclick="posCambiarModo('${productoId}','variado')">🧺 Surtido variado</button>
          <button id="pos-modo-corrida" class="pos-modo-tab corrida" onclick="posCambiarModo('${productoId}','corrida')">📦 Corrida completa</button>
        </div>
        <p id="pos-modo-hint" style="font-size:0.72rem;color:#888;margin-top:7px;line-height:1.4">Elige tallas sueltas; el precio se ajusta solo según el total de pares (menudeo · mayoreo 3+ · 6+).</p>
      </div>
      ` : ''}

      <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee">
        <p id="pos-color-label" style="font-size:0.75rem;color:#888;font-weight:600;margin-bottom:8px">SELECCIONA COLOR</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${colores.map(color => {
            const varsColor = varsProd.filter(v => v.color === color)
            const v = varsColor[0]
            const fotoColor = varsColor.map(x => x.foto_url).find(Boolean)
            const totalStock = varsColor
              .reduce((sum, v) => {
                const inv = invSucursal.find(i => i.variante_id === v.id)
                return sum + (inv ? inv.cantidad : 0)
              }, 0)
            const swatch = fotoColor
              ? `<img src="${fotoColor}" style="width:46px;height:46px;object-fit:cover;border-radius:8px;border:1px solid #ddd">`
              : `<div style="width:46px;height:46px;border-radius:8px;background:${v ? v.color_hex : '#888'};border:1px solid #ddd"></div>`
            return `
              <div onclick="posSeleccionarColor('${productoId}', '${color}')"
                   id="pos-color-btn-${color.replace(/\s/g,'_')}"
                   style="display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;padding:6px;border-radius:10px;border:2px solid ${totalStock === 0 ? '#f5f5f5' : '#ddd'};opacity:${totalStock === 0 ? '0.4' : '1'};width:74px">
                ${swatch}
                <span style="font-size:0.62rem;color:#666;text-align:center;line-height:1.1;height:2.2em;overflow:hidden">${color}</span>
                <span id="pos-color-badge-${color.replace(/\s/g,'_')}" style="font-size:0.6rem;color:#2e7d32;font-weight:700;display:none">0 pares</span>
              </div>
            `
          }).join('')}
        </div>
      </div>

      <div id="pos-tallas-panel" style="padding:1rem;border-bottom:1px solid #eee">
        <p style="color:#aaa;font-size:0.85rem">← Selecciona un color para ver las tallas</p>
      </div>

      </div><!-- /pos-modal-scroll -->

      <div id="pos-modal-resumen" style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:none;flex-shrink:0">
      </div>

      <div id="pos-modal-footer" style="padding:1rem 1.5rem;display:flex;flex-direction:column;gap:8px;flex-shrink:0;border-top:1px solid #eee">
        <button onclick="confirmarModalPOS('${productoId}')"
                id="pos-btn-confirmar"
                class="btn btn-primary"
                style="width:100%;padding:14px;font-size:1rem"
                disabled>
          Selecciona al menos una talla
        </button>
      </div>
  `

  document.body.appendChild(modal)
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove() })
  window._posSeleccion = { productoId, color: null }
  window._posBuffer = {}
  window._posModo = 'variado'
  window._posColores = colores
  window._corridaCantidades = {}
  // Auto-seleccionar el primer color para mostrar las tallas de inmediato (un tap menos)
  if (colores.length) posSeleccionarColor(productoId, colores[0])
}

// ── POS modal: selección de color compartida entre los dos modos ──
window._posHighlightColor = (color, border, bg) => {
  document.querySelectorAll('[id^="pos-color-btn-"]').forEach(el => {
    el.style.borderColor = '#ddd'; el.style.background = 'transparent'
  })
  const el = document.getElementById('pos-color-btn-' + color.replace(/\s/g,'_'))
  if (el) { el.style.borderColor = border; el.style.background = bg }
}

window.posSeleccionarColor = (productoId, color) => {
  if (window._posModo === 'corrida') {
    window._corridaColorActivo = color
    window._posSeleccion.color = color
    window._posHighlightColor(color, '#6a1b9a', '#f3e5f5')
    renderCorridaTallas(productoId, color)
  } else {
    // modo variado: seleccionarColorModalPOS hace su propio resaltado (rosa) y pinta las tallas
    seleccionarColorModalPOS(productoId, color)
  }
}

window.posCambiarModo = (productoId, modo) => {
  window._posModo = modo
  const tv = document.getElementById('pos-modo-variado')
  const tc = document.getElementById('pos-modo-corrida')
  if (tv) tv.classList.toggle('active', modo === 'variado')
  if (tc) tc.classList.toggle('active', modo === 'corrida')
  const hint = document.getElementById('pos-modo-hint')
  if (hint) hint.textContent = modo === 'corrida'
    ? 'Una corrida completa: varias tallas de un mismo color a precio de corrida. Usa "Sugerir" para llenarla rápido.'
    : 'Elige tallas sueltas; el precio se ajusta solo según el total de pares (menudeo · mayoreo 3+ · 6+).'
  // cada modo recalcula sus propias insignias de color
  document.querySelectorAll('[id^="pos-color-badge-"]').forEach(b => { b.style.display = 'none' })

  const footer = document.getElementById('pos-modal-footer')
  const colorActivo = window._posSeleccion?.color || window._corridaColorActivo || (window._posColores && window._posColores[0])

  if (modo === 'corrida') {
    if (!window._corridaCantidades) window._corridaCantidades = {}
    if (footer) footer.innerHTML = `
      <button onclick="sugerirCorrida('${productoId}', window._corridaColorActivo)"
              style="width:100%;padding:12px;font-size:0.9rem;font-weight:700;cursor:pointer;background:#f3e5f5;color:#6a1b9a;border:1.5px solid #ce93d8;border-radius:10px;min-height:46px">
        ✨ Sugerir corrida (6 pares)
      </button>
      <button onclick="confirmarCorridaNueva('${productoId}')"
              id="pos-btn-confirmar-corrida" class="btn btn-primary"
              style="width:100%;padding:14px;font-size:1rem;background:#6a1b9a;border-color:#6a1b9a" disabled>
        Agrega tallas a la corrida
      </button>`
    window._corridaColorActivo = colorActivo
    if (colorActivo) { window._posHighlightColor(colorActivo, '#6a1b9a', '#f3e5f5'); renderCorridaTallas(productoId, colorActivo) }
    else {
      const panel = document.getElementById('pos-tallas-panel')
      if (panel) panel.innerHTML = '<p style="color:#aaa;font-size:0.85rem">Selecciona un color para armar la corrida</p>'
    }
  } else {
    if (footer) footer.innerHTML = `
      <button onclick="confirmarModalPOS('${productoId}')" id="pos-btn-confirmar"
              class="btn btn-primary" style="width:100%;padding:14px;font-size:1rem" disabled>
        Selecciona al menos una talla
      </button>`
    if (colorActivo) seleccionarColorModalPOS(productoId, colorActivo)
    else {
      const panel = document.getElementById('pos-tallas-panel')
      if (panel) panel.innerHTML = '<p style="color:#aaa;font-size:0.85rem">← Selecciona un color para ver las tallas</p>'
    }
    actualizarResumenModalPOS(productoId)
  }
}

// Renderiza SOLO las tallas de la corrida del color dado (el selector de color es el de arriba)
window.renderCorridaTallas = (productoId, color) => {
  const { variantes, inventario } = window._posData
  const sucursalId = document.getElementById('pos-sucursal') ? document.getElementById('pos-sucursal').value : ''
  const invSucursal = inventario.filter(i => i.sucursal_id === sucursalId)
  const TALLAS_ORDEN = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Unica']
  const varsColor = variantes
    .filter(v => v.producto_id === productoId && v.color === color)
    .sort((a, b) => TALLAS_ORDEN.indexOf(a.talla) - TALLAS_ORDEN.indexOf(b.talla))
  const panel = document.getElementById('pos-tallas-panel')
  if (!panel) return
  if (!window._corridaCantidades) window._corridaCantidades = {}

  panel.innerHTML = `
    <p style="font-size:0.75rem;color:#6a1b9a;font-weight:700;margin-bottom:12px">📦 CORRIDA · ${color} — ajusta cantidades por talla</p>
    <div style="display:flex;flex-direction:column;gap:8px">
      ${varsColor.map(v => {
        const inv = invSucursal.find(i => i.variante_id === v.id)
        const stock = inv ? inv.cantidad : 0
        const cantidad = window._corridaCantidades[v.id] || 0
        return `
          <div style="display:flex;align-items:center;gap:10px;opacity:${stock === 0 ? '0.4' : '1'}">
            <span style="min-width:40px;font-size:0.9rem;font-weight:700;color:#333">${v.talla}</span>
            <span style="font-size:0.72rem;color:#aaa;min-width:54px">Stock: ${stock}</span>
            <div style="display:flex;align-items:center;gap:6px">
              <button ${stock === 0 ? 'disabled' : ''} onclick="posCorridaQty('${v.id}',-1,${stock},'${productoId}')"
                      style="background:#f0f0f0;border:none;border-radius:8px;width:40px;height:40px;cursor:pointer;font-size:1.3rem;font-weight:700;touch-action:manipulation">−</button>
              <input type="number" min="0" max="${stock}" value="${cantidad}" id="qty-corrida-${v.id}" ${stock === 0 ? 'disabled' : ''}
                     style="width:56px;height:40px;text-align:center;padding:4px;border:2px solid ${cantidad > 0 ? '#6a1b9a' : '#ddd'};border-radius:8px;font-size:1rem;font-weight:700"
                     oninput="window._corridaCantidades['${v.id}']=Math.min(${stock},Math.max(0,parseInt(this.value)||0));this.value=window._corridaCantidades['${v.id}'];this.style.borderColor=window._corridaCantidades['${v.id}']>0?'#6a1b9a':'#ddd';actualizarBadgesCorrida('${productoId}')">
              <button ${stock === 0 ? 'disabled' : ''} onclick="posCorridaQty('${v.id}',1,${stock},'${productoId}')"
                      style="background:#f0f0f0;border:none;border-radius:8px;width:40px;height:40px;cursor:pointer;font-size:1.3rem;font-weight:700;touch-action:manipulation">+</button>
            </div>
            ${stock === 0 ? '<span style="font-size:0.7rem;color:#c62828;background:#ffebee;padding:2px 8px;border-radius:100px">Agotado</span>' : ''}
          </div>`
      }).join('')}
    </div>`
  actualizarBadgesCorrida(productoId)
}

window.posCorridaQty = (varId, delta, stock, productoId) => {
  const cur = window._corridaCantidades[varId] || 0
  const val = Math.min(stock, Math.max(0, cur + delta))
  window._corridaCantidades[varId] = val
  const input = document.getElementById('qty-corrida-' + varId)
  if (input) { input.value = val; input.style.borderColor = val > 0 ? '#6a1b9a' : '#ddd' }
  actualizarBadgesCorrida(productoId)
}

// Actualiza insignias por color (arriba), el resumen y el botón confirmar de corrida
window.actualizarBadgesCorrida = (productoId) => {
  const { variantes } = window._posData
  let total = 0
  ;(window._posColores || []).forEach(c => {
    const varsC = variantes.filter(v => v.producto_id === productoId && v.color === c)
    let sum = 0
    varsC.forEach(v => { sum += window._corridaCantidades[v.id] || 0 })
    total += sum
    const badge = document.getElementById('pos-color-badge-' + c.replace(/\s/g,'_'))
    if (badge) {
      if (sum > 0) { badge.textContent = sum + ' par' + (sum > 1 ? 'es' : ''); badge.style.color = '#6a1b9a'; badge.style.display = 'block' }
      else badge.style.display = 'none'
    }
  })

  const resumen = document.getElementById('pos-modal-resumen')
  const btn = document.getElementById('pos-btn-confirmar-corrida')
  if (total > 0) {
    if (resumen) {
      const lineas = []
      Object.entries(window._corridaCantidades).forEach(([vid, cant]) => {
        if (cant > 0) { const v = variantes.find(v => v.id === vid); if (v) lineas.push({ color: v.color, talla: v.talla, cantidad: cant }) }
      })
      resumen.style.display = 'block'
      resumen.innerHTML = `
        <p style="font-size:0.75rem;font-weight:700;color:#6a1b9a;margin-bottom:8px">📦 CORRIDA — ${total} pares</p>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${lineas.map(l => `<span style="background:#f3e5f5;border-radius:100px;padding:3px 10px;font-size:0.78rem;color:#6a1b9a"><strong>${l.color}</strong> T${l.talla} × ${l.cantidad}</span>`).join('')}
        </div>`
    }
    if (btn) { btn.textContent = `✅ Agregar corrida (${total} pares)`; btn.disabled = false }
  } else {
    if (resumen) resumen.style.display = 'none'
    if (btn) { btn.textContent = 'Agrega tallas a la corrida'; btn.disabled = true }
  }
}
// Compatibilidad: ahora "corrida" es un modo del mismo modal (selector de color único arriba)
window.mostrarCorridaModalPOS = (productoId) => posCambiarModo(productoId, 'corrida')

window.sugerirCorrida = (productoId, color) => {
  const { variantes, inventario } = window._posData
  const sucursalId = document.getElementById('pos-sucursal') ? document.getElementById('pos-sucursal').value : ''
  const invSucursal = inventario.filter(i => i.sucursal_id === sucursalId)
  const TALLAS_ORDEN = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Unica']

  const varsColor = variantes
    .filter(v => v.producto_id === productoId && v.color === color)
    .sort((a, b) => TALLAS_ORDEN.indexOf(a.talla) - TALLAS_ORDEN.indexOf(b.talla))

  const conStock = varsColor.filter(v => {
    const inv = invSucursal.find(i => i.variante_id === v.id)
    return inv && inv.cantidad > 0
  })

  // Detectar si tiene medios o solo enteros
  const tieneMedias = conStock.some(v => v.talla.includes('.'))

  // Limpiar cantidades actuales de este color
  varsColor.forEach(v => { window._corridaCantidades[v.id] = 0 })

  // Rango preferido: del 26 hacia abajo (la mayoría pide hasta 26).
  // Si no hay 26 en stock, recorrer un número hacia abajo.
  const tiene26 = conStock.some(v => v.talla === '26')
  const RANGOS = tieneMedias
    ? { con26: ['26','25.5','25','24.5','24','23.5'], sin26: ['25.5','25','24.5','24','23.5','23'] }
    : { con26: ['26','25','24','23'], sin26: ['25','24','23','22'] }
  const rangoDeseado = tiene26 ? RANGOS.con26 : RANGOS.sin26

  let seleccionadas = rangoDeseado.map(t => conStock.find(v => v.talla === t)).filter(Boolean)

  // Si el rango no completó 6, rellenar con las tallas disponibles más cercanas hacia abajo
  if (seleccionadas.length < 6) {
    const idsYa = new Set(seleccionadas.map(v => v.id))
    const rangoMinIdx = TALLAS_ORDEN.indexOf(rangoDeseado[rangoDeseado.length - 1])
    const extras = conStock
      .filter(v => !idsYa.has(v.id) && TALLAS_ORDEN.indexOf(v.talla) < rangoMinIdx)
      .sort((a, b) => TALLAS_ORDEN.indexOf(b.talla) - TALLAS_ORDEN.indexOf(a.talla)) // desc: más cercanas primero
    for (const v of extras) {
      if (seleccionadas.length >= 6) break
      seleccionadas.push(v)
    }
  }

  if (!seleccionadas.length) seleccionadas = conStock.slice(0, tieneMedias ? 6 : 5)

  if (tieneMedias) {
    // Corrida normal: 1 por talla del rango
    seleccionadas.slice(0, 6).forEach(v => {
      window._corridaCantidades[v.id] = 1
    })
  } else {
    // Solo enteros: distribuir 6 pares duplicando tallas centrales
    const tallas = seleccionadas.slice(0, 5)
    if (tallas.length === 4) {
      tallas.forEach((v, i) => {
        window._corridaCantidades[v.id] = (i === 1 || i === 2) ? 2 : 1
      })
    } else if (tallas.length === 5) {
      tallas.forEach((v, i) => {
        window._corridaCantidades[v.id] = (i === 2) ? 2 : 1
      })
    } else {
      seleccionadas.slice(0, 6).forEach(v => {
        window._corridaCantidades[v.id] = Math.ceil(6 / seleccionadas.length)
      })
    }
  }

  window._posHighlightColor(color, '#6a1b9a', '#f3e5f5')
  renderCorridaTallas(productoId, color)
}

window.confirmarCorridaNueva = (productoId) => {
  const { variantes } = window._posData
  const p = window._posData.productos.find(p => p.id === productoId)
  if (!p) return

  let agregados = 0
  Object.entries(window._corridaCantidades).forEach(([varianteId, cantidad]) => {
    if (cantidad <= 0) return
    const v = variantes.find(v => v.id === varianteId)
    if (!v) return
    const existente = window._posCarrito.find(i => i.variante_id === varianteId && i.es_corrida)
    if (existente) {
      existente.cantidad += cantidad
      existente.es_corrida = true
    } else {
      window._posCarrito.push({
        variante_id: varianteId,
        producto_id: productoId,
        nombre: p.nombre,
        color: v.color,
        talla: v.talla,
        cantidad,
        precio_menudeo: parseFloat(p.precio_menudeo) || 0,
        precio_mayoreo3: parseFloat(p.precio_mayoreo3) || (parseFloat(p.precio_menudeo) - 30),
        precio_mayoreo6: parseFloat(p.precio_mayoreo6) || (parseFloat(p.precio_menudeo) - 70),
        precio_corrida: parseFloat(p.precio_corrida) || (parseFloat(p.precio_menudeo) - 100),
        es_corrida: true,
        imagen: window._posData.variantes.find(va => va.id === varianteId)?.foto_url || p.imagen_principal || null,
        precio_unitario: parseFloat(p.precio_corrida) || (parseFloat(p.precio_menudeo) - 100)
      })
    }
    agregados++
  })

  if (agregados === 0) {
    alert('Agrega al menos una talla')
    return
  }

  // Cerrar modal
  const modal = document.getElementById('pos-modal')
  if (modal) modal.remove()
  window._corridaCantidades = {}
  renderCarritoPOS()
}

window.seleccionarColorModalPOS = (productoId, color) => {
  const { variantes, inventario } = window._posData
  const sucursalId = document.getElementById('pos-sucursal') ? document.getElementById('pos-sucursal').value : ''
  const invSucursal = inventario.filter(i => i.sucursal_id === sucursalId)
  const TALLAS_ORDEN = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Unica']

  if (window._posSeleccion && window._posSeleccion.color) {
    guardarBufferColor(productoId, window._posSeleccion.color)
  }

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

  const fotoColor = varsColor[0] ? varsColor[0].foto_url : null
  const modalImg = document.getElementById('pos-modal-img')
  if (modalImg && fotoColor) modalImg.src = fotoColor

  const bufferColor = window._posBuffer[color] || {}

  const panel = document.getElementById('pos-tallas-panel')
  if (panel) {
    panel.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <p style="font-size:0.75rem;color:#888;font-weight:600;margin:0">TALLAS — ${color}</p>
        <p style="font-size:0.7rem;color:#aaa;margin:0">Toca una talla para agregar</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(84px,1fr));gap:12px">
        ${varsColor.map(v => {
          const inv = invSucursal.find(i => i.variante_id === v.id)
          const stock = inv ? inv.cantidad : 0
          const qty = bufferColor[v.id] || 0
          return `
            <div style="position:relative">
              <button id="chip-talla-${v.id}"
                      onclick="posTallaTap('${v.id}','${productoId}','${color}',${stock})"
                      ${stock === 0 ? 'disabled' : ''}
                      style="width:100%;min-height:62px;border:2px solid ${qty > 0 ? '#E91E8C' : '#ddd'};background:${qty > 0 ? '#fce4f3' : '#fff'};border-radius:12px;cursor:${stock === 0 ? 'not-allowed' : 'pointer'};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-family:inherit;padding:8px 4px;${stock === 0 ? 'opacity:0.45' : ''};touch-action:manipulation">
                <span style="font-size:1.05rem;font-weight:800;color:#333">${v.talla}</span>
                <span style="font-size:0.63rem;color:${stock === 0 ? '#c62828' : '#aaa'}">${stock === 0 ? 'Agotado' : 'Stock ' + stock}</span>
              </button>
              <span id="chipbadge-${v.id}" style="position:absolute;top:-7px;right:-7px;background:#E91E8C;color:#fff;border-radius:100px;min-width:22px;height:22px;display:${qty > 0 ? 'flex' : 'none'};align-items:center;justify-content:center;font-size:0.75rem;font-weight:800;padding:0 5px;pointer-events:none">${qty}</span>
              <button id="chipmenos-${v.id}"
                      onclick="posTallaMenos('${v.id}','${productoId}','${color}',${stock})"
                      style="position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);background:#fff;border:1.5px solid #E91E8C;color:#E91E8C;border-radius:100px;width:26px;height:26px;display:${qty > 0 ? 'flex' : 'none'};align-items:center;justify-content:center;font-size:1.1rem;font-weight:800;cursor:pointer;line-height:1;touch-action:manipulation;box-shadow:0 1px 3px rgba(0,0,0,0.15)">−</button>
              <input type="hidden" id="qty-modal-${v.id}" value="${qty}">
            </div>
          `
        }).join('')}
      </div>
    `
  }
}

// Tocar una talla = +1 par (POS, modo variado). Mantiene el input oculto que lee el buffer.
window.posTallaTap = (varId, productoId, color, max) => {
  const input = document.getElementById('qty-modal-' + varId)
  if (!input || input.disabled) return
  const nueva = Math.min(max, (parseInt(input.value) || 0) + 1)
  input.value = nueva
  posPintarChipTalla(varId, nueva)
  actualizarBadgeColor(productoId, color)
}
window.posTallaMenos = (varId, productoId, color) => {
  const input = document.getElementById('qty-modal-' + varId)
  if (!input) return
  const nueva = Math.max(0, (parseInt(input.value) || 0) - 1)
  input.value = nueva
  posPintarChipTalla(varId, nueva)
  actualizarBadgeColor(productoId, color)
}
window.posPintarChipTalla = (varId, val) => {
  const chip = document.getElementById('chip-talla-' + varId)
  if (chip) { chip.style.borderColor = val > 0 ? '#E91E8C' : '#ddd'; chip.style.background = val > 0 ? '#fce4f3' : '#fff' }
  const badge = document.getElementById('chipbadge-' + varId)
  if (badge) { badge.textContent = val; badge.style.display = val > 0 ? 'flex' : 'none' }
  const menos = document.getElementById('chipmenos-' + varId)
  if (menos) menos.style.display = val > 0 ? 'flex' : 'none'
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
      const existente = window._posCarrito.find(i => i.variante_id === varId && !i.es_corrida)
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
          precio_corrida: parseFloat(producto.precio_corrida) || (parseFloat(producto.precio_menudeo) - 100),
          es_oferta: producto.es_oferta || false,
          es_corrida: false,
          imagen: (window._posBuffer[v ? v.color : color] && window._posData.variantes.find(va => va.id === varId)?.foto_url) || producto.imagen_principal || null,
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
        precio_corrida: parseFloat(producto.precio_corrida) || (parseFloat(producto.precio_menudeo) - 100),
        imagen: producto.imagen_principal || null,
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
      precio_corrida: parseFloat(producto.precio_corrida) || (parseFloat(producto.precio_menudeo) - 100),
      imagen: producto.imagen_principal || null,
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
        precio_corrida: parseFloat(producto.precio_corrida) || (parseFloat(producto.precio_menudeo) - 100),
        imagen: producto.imagen_principal || null,
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
        subtotal: 0,
        imagen: i.imagen || null
        
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
    <div style="display:flex;gap:10px;margin-bottom:8px">
      ${item.imagen ? `<img src="${item.imagen}" style="width:52px;height:52px;object-fit:cover;border-radius:8px;flex-shrink:0">` : `<div style="width:52px;height:52px;background:#f5f5f5;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.5rem">👠</div>`}
      <div style="flex:1">
        <p style="font-size:0.9rem;font-weight:600">${item.nombre}</p>
        <p style="font-size:0.78rem;color:#888">${item.color} · T${item.talla}</p>
      </div>
      <button onclick="eliminarItemPOS(${items.indexOf(item)})" style="background:none;border:none;color:#ccc;cursor:pointer;font-size:1.2rem;padding:0 4px">✕</button>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center">
      <div style="display:flex;align-items:center;gap:8px">
        <button onclick="cambiarCantidadPOS(${items.indexOf(item)}, -1)" style="background:#f5f5f5;border:none;border-radius:8px;width:44px;height:44px;cursor:pointer;font-size:1.4rem;font-weight:700;touch-action:manipulation;display:flex;align-items:center;justify-content:center">−</button>
        <span style="font-size:1rem;font-weight:700;min-width:24px;text-align:center">${item.cantidad}</span>
        <button onclick="cambiarCantidadPOS(${items.indexOf(item)}, 1)" style="background:#f5f5f5;border:none;border-radius:8px;width:44px;height:44px;cursor:pointer;font-size:1.4rem;font-weight:700;touch-action:manipulation;display:flex;align-items:center;justify-content:center">+</button>
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
    <div style="display:flex;gap:10px;align-items:start;margin-bottom:6px">
      ${corrida.imagen ? `<img src="${corrida.imagen}" style="width:48px;height:48px;object-fit:contain;background:#f5f5f5;border-radius:8px;flex-shrink:0">` : `<div style="width:48px;height:48px;background:#f3e5f5;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.3rem">👠</div>`}
      <div style="flex:1">
        <div style="display:flex;justify-content:space-between;align-items:start">
          <div>
            <p style="font-size:0.9rem;font-weight:700">${corrida.nombre}</p>
            <p style="font-size:0.78rem;color:#6a1b9a;font-weight:600">📦 Corrida · ${corrida.color}</p>
            <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">
              ${corrida.tallas.map(t => `<span style="background:#f3e5f5;border-radius:100px;padding:2px 8px;font-size:0.72rem;color:#6a1b9a">T${t.talla} ×${t.cantidad}</span>`).join('')}
            </div>
          </div>
          <button onclick="eliminarCorridaPOS('${key}')" style="background:none;border:none;color:#ccc;cursor:pointer;font-size:1.2rem;padding:0 4px">✕</button>
        </div>
      </div>
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
  const fp = document.getElementById('pos-flotante-pares')
  const ft = document.getElementById('pos-flotante-total')
  if (fp) fp.textContent = totalPares + ' pares'
  if (ft) ft.textContent = '$' + total.toFixed(2)
  if (document.getElementById('pos-drawer')?.classList.contains('open')) renderDrawerPOS()
  guardarCarritoLocal()  // persistir el carrito tras cada cambio
}
window.editarPrecioPOS = (idx, nuevoPrecio) => {
  if (!window._posCarrito[idx]) return
  const precio = parseFloat(nuevoPrecio)
  if (!precio || precio <= 0) {
    alert('El precio debe ser mayor a $0')
    return
  }
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
  guardarCarritoLocal()
}

window.editarPrecioCorridaPOS = (key, nuevoPrecioPorPar) => {
  const [producto_id, color] = key.split('|')
  const precio = parseFloat(nuevoPrecioPorPar)
  if (!precio || precio <= 0) {
    alert('El precio debe ser mayor a $0')
    return
  }

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
  guardarCarritoLocal()
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

  const precioCorrida = precioManual !== null ? precioManual : (parseFloat(producto.precio_corrida) || (parseFloat(producto.precio_menudeo) - 100))

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
      precio_corrida: parseFloat(producto.precio_corrida) || (parseFloat(producto.precio_menudeo) - 100),
      es_oferta: producto.es_oferta || false,
      imagen: producto.imagen_principal || null,
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

  // Guard global — bloquea cualquier doble click sin importar desde qué botón
  if (window._cobrando) return
  window._cobrando = true

  // Deshabilitar todos los botones de cobrar
  const btnCobrar = document.querySelector('button[onclick="cobrarPOS()"]')
  const btnCobrarM = document.querySelector('button[onclick="cobrarPOSM()"]')
  ;[btnCobrar, btnCobrarM].forEach(b => { if (b) { b.disabled = true; b.textContent = 'Procesando...' } })

  const clienteId = document.getElementById('pos-cliente').value || null
  const sucursalId = document.getElementById('pos-sucursal').value
  const formaPago = document.getElementById('pos-pago').value
  const total = window._posCarrito.reduce((sum, i) => sum + (i.cantidad * i.precio_unitario), 0)

  // ── Validar stock antes de crear el pedido ──────────────────────
  if (window._posData?.inventario) {
    const sinStock = []
    for (const item of window._posCarrito) {
      const inv = window._posData.inventario.find(i => i.variante_id === item.variante_id)
      const disponible = inv ? inv.cantidad : 0
      if (disponible < item.cantidad) {
        sinStock.push(`${item.nombre} ${item.color} T:${item.talla} (disponible: ${disponible}, pedido: ${item.cantidad})`)
      }
    }
    if (sinStock.length > 0) {
      alert('Sin stock suficiente:\n' + sinStock.join('\n'))
      if (btnCobrar) { btnCobrar.disabled = false; btnCobrar.textContent = 'Cobrar' }
      return
    }
  }

  let pedidoId = null
  try {
    // 1. Crear pedido como borrador primero
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
        status: 'borrador'
      })
    })
    const pedidoData = await resPedido.json()
    if (!resPedido.ok) throw new Error('No se pudo crear el pedido: ' + JSON.stringify(pedidoData))
    pedidoId = Array.isArray(pedidoData) ? pedidoData[0]?.id : pedidoData?.id
    if (!pedidoId) throw new Error('No se obtuvo ID del pedido')

    // 2. Agregar items
    for (const item of window._posCarrito) {
      const resItem = await fetch(API + '/pedidos/' + pedidoId + '/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variante_id: item.variante_id,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          subtotal: item.cantidad * item.precio_unitario
        })
      })
      if (!resItem.ok) {
        const errItem = await resItem.json().catch(() => ({}))
        throw new Error('Error en item ' + item.nombre + ': ' + JSON.stringify(errItem))
      }
    }

    // 3. Confirmar (descuenta stock)
    if (formaPago !== 'spei') {
      const resConf = await fetch(API + '/pedidos/' + pedidoId + '/confirmar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forma_pago: formaPago })
      })
      if (!resConf.ok) {
        const errConf = await resConf.json().catch(() => ({}))
        throw new Error('Error confirmando: ' + JSON.stringify(errConf))
      }
    } else {
      // SPEI: solo marcar como pendiente_pago
      await fetch(API + '/pedidos/' + pedidoId, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'pendiente_pago' })
      })
    }

    // 4. Éxito — limpiar carrito e imprimir
    const totalPares = window._posCarrito.reduce((sum, i) => sum + i.cantidad, 0)
    window._posCarrito = []
    window._cobrando = false
    renderCarritoPOS()
    imprimirTicketPOS(pedidoId, total, totalPares, formaPago)

    // 5. Refrescar inventario
    const resInv = await fetch(API + '/inventario/sucursal/' + sucursalId)
    window._posData.inventario = await resInv.json()
    renderProductosPOS(window._posData.productos)

  } catch(e) {
    console.error('Error procesando la venta:', e)
    window._cobrando = false
    // Si el pedido ya se creó, cancelarlo automáticamente para no dejar basura
    if (pedidoId) {
      try {
        await fetch(API + '/pedidos/' + pedidoId + '/cancelar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
        console.warn('Pedido ' + pedidoId + ' cancelado por error')
      } catch(e2) {}
    }
    alert('Error al procesar la venta:\n' + (e?.message || e))
    ;[btnCobrar, btnCobrarM].forEach(b => { if (b) { b.disabled = false; b.textContent = 'Cobrar' } })
  }
}

// Guardar el carrito del POS como borrador (aparece en la sección "Carritos").
// NO descuenta stock: eso ocurre al confirmar la venta desde Carritos.
window.guardarCarritoPOS = async (fromDrawer) => {
  if (!window._posCarrito || window._posCarrito.length === 0) { alert('El carrito está vacío'); return }
  const clienteId = document.getElementById('pos-cliente')?.value || null
  if (!clienteId) {
    alert('Selecciona un cliente para guardar el carrito')
    return
  }
  if (window._guardandoCarrito) return
  window._guardandoCarrito = true

  const sucursalId = document.getElementById('pos-sucursal')?.value
  const formaPago = document.getElementById('pos-pago')?.value || 'efectivo'

  const btns = [...document.querySelectorAll('button[onclick^="guardarCarritoPOS"]')]
  btns.forEach(b => { b.disabled = true; b._txt = b.textContent; b.textContent = 'Guardando...' })

  let pedidoId = null
  let creadoNuevo = false
  try {
    // 1. ¿Ya hay un carrito (borrador) abierto para este cliente? → reusarlo en vez de duplicar
    const borradores = await fetch(API + '/pedidos/?status=borrador').then(r => r.json()).catch(() => [])
    const existente = Array.isArray(borradores)
      ? borradores.find(p => p.cliente_id === clienteId && (!p.canal || p.canal === 'sucursal' || p.canal === 'mayoreo'))
      : null

    if (existente) {
      pedidoId = existente.id
    } else {
      // Crear pedido nuevo como borrador (sin confirmar → no toca stock)
      const resPedido = await fetch(API + '/pedidos/', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente_id: clienteId, canal: 'sucursal', sucursal_id: sucursalId, forma_pago: formaPago, total: 0, subtotal: 0, status: 'borrador' })
      })
      const pedidoData = await resPedido.json()
      if (!resPedido.ok) throw new Error('No se pudo crear el carrito: ' + JSON.stringify(pedidoData))
      pedidoId = Array.isArray(pedidoData) ? pedidoData[0]?.id : pedidoData?.id
      if (!pedidoId) throw new Error('No se obtuvo ID del carrito')
      creadoNuevo = true
    }

    // 2. Items actuales del carrito destino (para fusionar y no duplicar tallas)
    let itemsDestino = await fetch(API + '/pedidos/' + pedidoId + '/items').then(r => r.json()).catch(() => [])
    if (!Array.isArray(itemsDestino)) itemsDestino = []

    // 3. Fusionar cada par del POS: si ya existe esa variante (mismo modo corrida/suelto) suma cantidad; si no, lo agrega
    for (const item of window._posCarrito) {
      const esCorrida = !!item.es_corrida
      const ya = itemsDestino.find(ei => ei.variante_id === item.variante_id && (!!ei.es_corrida) === esCorrida)
      if (ya) {
        const nuevaCant = ya.cantidad + item.cantidad
        const resPatch = await fetch(API + '/pedidos/' + pedidoId + '/items/' + ya.id, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cantidad: nuevaCant, precio_unitario: item.precio_unitario, subtotal: nuevaCant * item.precio_unitario })
        })
        if (!resPatch.ok) throw new Error('Error actualizando ' + (item.nombre || '') + ': ' + JSON.stringify(await resPatch.json().catch(() => ({}))))
        ya.cantidad = nuevaCant
      } else {
        const resItem = await fetch(API + '/pedidos/' + pedidoId + '/items', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            variante_id: item.variante_id, cantidad: item.cantidad,
            precio_unitario: item.precio_unitario, subtotal: item.cantidad * item.precio_unitario,
            nombre: item.nombre || '', color: item.color || '', talla: item.talla || '', es_corrida: esCorrida
          })
        })
        if (!resItem.ok) throw new Error('Error en item ' + (item.nombre || '') + ': ' + JSON.stringify(await resItem.json().catch(() => ({}))))
        const creado = await resItem.json().catch(() => null)
        if (Array.isArray(creado) && creado[0]) itemsDestino.push(creado[0])
      }
    }

    // 4. Recalcular total del carrito destino con TODOS sus items y actualizarlo
    const itemsFinales = await fetch(API + '/pedidos/' + pedidoId + '/items').then(r => r.json()).catch(() => itemsDestino)
    const totalFinal = (Array.isArray(itemsFinales) ? itemsFinales : []).reduce((s, i) => s + (i.cantidad * i.precio_unitario), 0)
    await fetch(API + '/pedidos/' + pedidoId, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ total: totalFinal, subtotal: totalFinal })
    })

    // 5. Éxito — vaciar carrito y cliente para empezar de cero
    window._posCarrito = []
    window._guardandoCarrito = false
    if (fromDrawer && typeof cerrarDrawerPOS === 'function') cerrarDrawerPOS()
    if (typeof limpiarClientePOS === 'function') limpiarClientePOS()
    renderCarritoPOS()
    alert(existente
      ? 'Se agregó al carrito que ya tenía este cliente. Lo ves en la sección Carritos.'
      : 'Carrito guardado. Lo encuentras en la sección Carritos.')
  } catch(e) {
    window._guardandoCarrito = false
    // Solo cancelar si fue un pedido NUEVO (no tocar un carrito que ya existía)
    if (pedidoId && creadoNuevo) {
      try { await fetch(API + '/pedidos/' + pedidoId + '/cancelar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }) } catch(e2) {}
    }
    alert('No se pudo guardar el carrito:\n' + (e?.message || e))
    btns.forEach(b => { b.disabled = false; if (b._txt) b.textContent = b._txt })
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
          font-weight: bold;
          width: 72mm;
          padding: 3mm;
          color: #000;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .center { text-align: center; }
        .logo { font-size: 16px; margin-bottom: 2px; }
        .divider { border-top: 1px dashed #000; margin: 6px 0; }
        .row { display: flex; justify-content: space-between; margin-bottom: 2px; }
        .total-row { display: flex; justify-content: space-between; font-size: 14px; }
        .footer { margin-top: 8px; font-size: 10px; }
        @media print {
          @page { size: 80mm auto; margin: 0; }
          body { width: 80mm; padding: 4mm; }
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
      <span>Pedido:</span>
        <span>#${pedidoId.substring(0,8).toUpperCase()}</span>
      </div>
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
    const _clave = (producto.nombre || '—').split(' ')[0]
    const key = _clave + '|' + (variante.color || '')
    if (!grupos[key]) {
      grupos[key] = {
        nombre: _clave,
        color: variante.color || '',
        precio: item.precio_unitario || 0,
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
        <td style="width:24px;text-align:right;padding-right:4px;font-weight:bold">Cant</td>
        <td style="font-weight:bold">Modelo / Color</td>
        <td style="text-align:right;padding-right:4px;font-weight:bold">P/U</td>
        <td style="text-align:right;font-weight:bold">Total</td>
      </tr>
      ${Object.values(grupos).map(g => `
        <tr>
          <td style="width:24px;text-align:right;padding-right:4px">${g.cantidad}</td>
          <td>${g.nombre}<br><span style="font-size:10px">${g.color}</span></td>
          <td style="text-align:right;padding-right:4px">$${parseFloat(g.precio).toFixed(2)}</td>
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
        td { padding:8px 12px; border-bottom:1px solid #f5f5f5; font-size:13px; vertical-align:middle; }
        .td-foto { width:64px; padding:6px 8px; }
        .foto-variante { width:56px; height:56px; object-fit:cover; border-radius:6px; display:block; background:#f5f5f5; }
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
            <th class="td-foto"></th>
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
            const fotoUrl = variante.foto_url || ''
            return `
              <tr>
                <td class="td-foto">${fotoUrl ? `<img class="foto-variante" src="${fotoUrl}" alt="${variante.color || ''}">` : '<div class="foto-variante" style="border:1px dashed #ddd"></div>'}</td>
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
            <tr><th>Fecha</th><th>Tipo</th><th>Producto</th><th>Color</th><th>Talla</th><th>Sucursal</th><th>Cantidad</th><th>Usuario</th><th>Motivo</th><th>Acción</th></tr>
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
<td>
  ${m.tipo !== 'venta' && m.tipo !== 'ajuste' ? `
  <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem;color:#c62828;border-color:#c62828" 
          onclick="cancelarMovimiento('${m.id}', ${Math.abs(m.cantidad)}, '${m.variante_id}', '${m.sucursal_id}', '${m.tipo}')">
    Cancelar
  </button>` : ''}
</td>
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
window.cancelarMovimiento = async (id, cantidad, varianteId, sucursalId, tipo) => {
  if (!confirm('¿Cancelar este movimiento? Se revertirá el cambio en el inventario.')) return
  try {
    // Obtener inventario específico de esta variante y sucursal
    const resInv = await fetch(API + '/inventario/?variante_id=eq.' + varianteId + '&sucursal_id=eq.' + sucursalId)
    const inventario = await resInv.json()
    const cantidadActual = inventario && inventario.length > 0 ? inventario[0].cantidad : 0

    // Calcular nueva cantidad
    const nuevaCantidad = tipo === 'venta'
      ? cantidadActual + cantidad
      : Math.max(0, cantidadActual - cantidad)

    // Actualizar directamente sin crear movimiento nuevo
    const res = await fetch(API + '/inventario/actualizar', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        variante_id: varianteId,
        sucursal_id: sucursalId,
        cantidad: nuevaCantidad,
        stock_minimo: inventario && inventario.length > 0 ? inventario[0].stock_minimo : 3
      })
    })

    if (res.ok) {
      alert('Movimiento cancelado. Inventario actualizado.')
      cargarHistorial()
    } else {
      alert('Error al actualizar inventario')
    }
  } catch(e) {
    alert('Error conectando con el servidor')
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

    const conf = pedidos.filter(p => ['confirmado','pagado','enviado'].includes(p.status))
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

    // Ventas 30 días
    const hace30P = conf.filter(p => new Date(p.created_at) >= hace30)
    const ventas30 = hace30P.reduce((s,p) => s + parseFloat(p.total||0), 0)

    // Últimos 7 días por día (para gráfica tendencia)
    const ultimos7 = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(hoy); d.setDate(d.getDate() - i)
      const ds = d.toISOString().split('T')[0]
      const label = d.toLocaleDateString('es-MX',{weekday:'short',day:'numeric'})
      const total = conf.filter(p => p.created_at?.startsWith(ds)).reduce((s,p) => s + parseFloat(p.total||0), 0)
      ultimos7.push({ label, total, ds })
    }

    // KPIs
    const setKpi = (id, val, sub, color) => {
      const el = document.getElementById(id)
      const subEl = document.getElementById(id+'-sub')
      if (el) { el.textContent = val; if (color) el.style.color = color }
      if (subEl && sub) subEl.textContent = sub
    }
    setKpi('kpi-ventas-hoy',   '$'+ventasHoy.toLocaleString('es-MX',{maximumFractionDigits:0}), hoyP.length+' pedidos', '#C8967A')
    setKpi('kpi-pedidos-hoy',  hoyP.length, 'confirmados')
    setKpi('kpi-ventas-7d',    '$'+ventas7.toLocaleString('es-MX',{maximumFractionDigits:0}), s7P.length+' pedidos')
    setKpi('kpi-ventas-30d',   '$'+ventas30.toLocaleString('es-MX',{maximumFractionDigits:0}), hace30P.length+' pedidos')
    setKpi('kpi-clientes-nuevos', clientesNuevos, 'últimos 30 días')
    setKpi('kpi-stock-bajo',   alertas.length, alertas.length > 0 ? '⚠ reabastecer' : '✓ ok', alertas.length > 0 ? '#f59e0b' : '#10b981')
    setKpi('kpi-mejor-dia',    diaMas ? diaMas[0] : '—', diaMas ? '$'+diaMas[1].toLocaleString('es-MX',{maximumFractionDigits:0}) : '')
    setKpi('kpi-total-clientes', clientes.length, 'registrados')

    const topClientesEl = document.getElementById('dash-top-clientes')
    if (topClientesEl) {
      topClientesEl.innerHTML = topClientes.length === 0
        ? '<p style="color:var(--text-muted);font-size:0.85rem">Sin datos aun</p>'
        : topClientes.map(([nombre, total], i) => `
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
            <span style="width:22px;height:22px;background:linear-gradient(135deg,#C8967A,#b5687a);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.68rem;font-weight:700;flex-shrink:0">${i+1}</span>
            <span style="flex:1;font-size:0.86rem;color:var(--text-1)">${nombre}</span>
            <strong style="color:#C8967A;font-family:'DM Mono',monospace;font-size:0.88rem">$${total.toLocaleString('es-MX',{maximumFractionDigits:0})}</strong>
          </div>`).join('')
    }

    const ultimosEl = document.getElementById('dash-ultimos-pedidos')
    if (ultimosEl) {
      const canalIcon = c => c === 'online' || c === 'mp' ? '🌐' : c === 'whatsapp' ? '💬' : '🏪'
      const statusColor = s => s==='confirmado'||s==='pagado' ? '#10b981' : s==='enviado' ? '#0891b2' : '#f59e0b'
      ultimosEl.innerHTML = pedidos.slice(0,7).map(p => `
        <div onclick="verPedido('${p.id}')" style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border);cursor:pointer">
          <div style="width:36px;height:36px;background:var(--pink-soft);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0">${canalIcon(p.mp_preference_id ? 'online' : (p.canal||''))}</div>
          <div style="flex:1;min-width:0">
            <p style="font-size:0.83rem;font-weight:600;color:var(--text-1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.clientes?.nombre || p.nombre_cliente || 'General'}</p>
            <p style="font-size:0.68rem;color:var(--text-3);margin-top:1px">${p.mp_preference_id ? 'Online' : (p.canal||'Sucursal')} · ${new Date(p.created_at).toLocaleDateString('es-MX',{day:'numeric',month:'short'})}</p>
          </div>
          <div style="text-align:right;flex-shrink:0">
            <p style="font-weight:700;color:var(--pink);font-family:'DM Mono',monospace;font-size:0.84rem">$${parseFloat(p.total||0).toLocaleString('es-MX',{maximumFractionDigits:0})}</p>
            <span style="font-size:0.6rem;font-weight:700;color:${statusColor(p.status)}">${p.status}</span>
          </div>
        </div>`).join('')
    }

    setTimeout(() => {
      // Paleta que combina con la tienda
      const COLOR1 = '#E91E8C'
      const COLOR2 = '#7c3aed'
      const COLOR3 = '#0891b2'
      const COLOR4 = '#059669'
      const PALETTE = [
        'rgba(233,30,140,0.8)',  'rgba(124,58,237,0.8)',
        'rgba(8,145,178,0.8)',   'rgba(5,150,105,0.8)',
        'rgba(217,119,6,0.8)',   'rgba(220,38,38,0.8)'
      ]
      const BORDERS = ['#E91E8C','#7c3aed','#0891b2','#059669','#d97706','#dc2626']

      const axisStyle = { ticks: { color: '#94a3b8', font: { size: 9 } }, grid: { color: 'rgba(148,163,184,0.08)' } }
      const chartOpts = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: axisStyle, y: axisStyle }
      }

      // Gráfica tendencia 7 días (área)
      const elTend = document.getElementById('chart-tendencia')
      if (elTend && window.Chart) {
        new Chart(elTend, {
          type: 'line',
          data: {
            labels: ultimos7.map(d => d.label),
            datasets: [{
              data: ultimos7.map(d => d.total),
              borderColor: COLOR1,
              backgroundColor: 'rgba(233,30,140,0.08)',
              borderWidth: 2.5,
              pointBackgroundColor: COLOR1,
              pointBorderColor: 'white',
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7,
              fill: true,
              tension: 0.4
            }]
          },
          options: {
            ...chartOpts,
            plugins: { legend: { display: false },
              tooltip: { callbacks: { label: ctx => ' $' + ctx.parsed.y.toLocaleString('es-MX',{maximumFractionDigits:0}) } }
            }
          }
        })
      }

      // Barras: días de semana
      const elDias = document.getElementById('chart-dias')
      if (elDias && window.Chart) new Chart(elDias, {
        type: 'bar',
        data: { labels: diasNombre, datasets: [{ data: diasNombre.map(d => porDia[d]||0), backgroundColor: PALETTE, borderColor: BORDERS, borderWidth: 1.5, borderRadius: 6 }] },
        options: { ...chartOpts, plugins: { legend: { display: false } } }
      })

      // Dona: canal
      const elCanales = document.getElementById('chart-canales')
      const canalesLabels = Object.keys(porCanal)
      const canalesVals = Object.values(porCanal)
      if (elCanales && window.Chart && canalesLabels.length > 0) {
        new Chart(elCanales, {
          type: 'doughnut',
          data: { labels: canalesLabels, datasets: [{ data: canalesVals, backgroundColor: PALETTE, borderColor: BORDERS, borderWidth: 2 }] },
          options: { responsive: true, maintainAspectRatio: false, cutout: '72%', plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.label}: $${ctx.parsed.toLocaleString('es-MX',{maximumFractionDigits:0})}` } } } }
        })
        // Leyenda lateral
        const totalCanal = canalesVals.reduce((s,v) => s+v, 0)
        const listaEl = document.getElementById('dash-canales-lista')
        if (listaEl) listaEl.innerHTML = canalesLabels.map((lbl, i) => `
          <div style="display:flex;align-items:center;gap:7px;margin-bottom:8px">
            <span style="width:9px;height:9px;border-radius:50%;background:${BORDERS[i%BORDERS.length]};flex-shrink:0"></span>
            <span style="flex:1;font-size:0.76rem;color:var(--text-2);text-transform:capitalize">${lbl}</span>
            <span style="font-size:0.76rem;font-weight:700;color:var(--text-1);font-family:'DM Mono',monospace">${totalCanal > 0 ? Math.round(canalesVals[i]/totalCanal*100) : 0}%</span>
          </div>`).join('')
      }

      // Línea: meses
      const elMeses = document.getElementById('chart-meses')
      if (elMeses && window.Chart) {
        const md = Object.entries(porMes).slice(-6)
        new Chart(elMeses, {
          type: 'line',
          data: { labels: md.map(([m])=>m), datasets: [{ data: md.map(([,v])=>v), borderColor: COLOR2, backgroundColor: 'rgba(124,58,237,0.07)', borderWidth: 2, pointBackgroundColor: COLOR2, pointBorderColor: 'white', pointBorderWidth: 2, pointRadius: 4, fill: true, tension: 0.4 }] },
          options: { ...chartOpts, plugins: { legend: { display: false } } }
        })
      }

      // Dona: pagos
      const elPagos = document.getElementById('chart-pagos')
      if (elPagos && window.Chart && Object.keys(porPago).length > 0) new Chart(elPagos, {
        type: 'doughnut',
        data: { labels: Object.keys(porPago), datasets: [{ data: Object.values(porPago), backgroundColor: PALETTE, borderColor: BORDERS, borderWidth: 2 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}` } } } }
      })
    }, 300)

    // Tab switcher para estadísticas
    window.dashSwitchTab = (tab, btn) => {
      ['dias','meses','pagos'].forEach(t => {
        const el = document.getElementById('dash-tab-' + t)
        if (el) el.style.display = t === tab ? 'block' : 'none'
      })
      document.querySelectorAll('.dash-tab-btn').forEach(b => b.classList.remove('active'))
      if (btn) btn.classList.add('active')
    }

    // Tareas pendientes hoy
    try {
    const resTareas = await fetch(API + '/chatbot/tareas-hoy')
    const tareas = await resTareas.json()
    
    const tareasDiv = document.createElement('div')
    tareasDiv.style.cssText = 'background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem;margin-top:1.5rem'
    tareasDiv.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <h3 style="font-size:1rem;font-weight:700;margin:0">✅ Tareas pendientes hoy</h3>
        <span style="background:#e91e8c;color:white;border-radius:100px;padding:2px 10px;font-size:0.75rem">${tareas.filter(t=>!t.completada).length} pendientes</span>
      </div>
      ${tareas.length === 0
        ? '<p style="color:#aaa;font-size:0.85rem;text-align:center;padding:1rem">Sin tareas pendientes</p>'
        : tareas.map(t => `
          <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #f5f5f5">
            <input type="checkbox" ${t.completada ? 'checked' : ''}
                   onchange="completarTareaDashboard('${t.id}', this.checked)"
                   style="width:16px;height:16px;cursor:pointer;accent-color:#25D366">
            <div style="flex:1">
              <p style="font-size:0.85rem;font-weight:600;margin:0;${t.completada ? 'text-decoration:line-through;color:#aaa' : ''}">${t.titulo}</p>
              <p style="font-size:0.72rem;color:#888;margin:0">${t.nombre_contacto || t.telefono} · ${t.agente || 'Sin asignar'}</p>
            </div>
            <button onclick="navegarA('conversaciones');setTimeout(()=>abrirChat('${t.telefono}'),800)"
                    style="background:#e3f2fd;border:none;border-radius:6px;padding:4px 8px;font-size:0.72rem;color:#1565c0;cursor:pointer">Ver chat</button>
          </div>
        `).join('')}
    `
    document.getElementById('dashboard-contenido').appendChild(tareasDiv)
    } catch(e) { console.error('tareas:', e) }

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
  sessionStorage.removeItem('erp_token')
  window._empleadoActual = null
  location.reload()
}
async function cargarEmpleados() {
  const content = document.getElementById('content')
  try {
    const res = await fetch(API + '/empleados/', { headers: window.authHeaders() })
    const data = await res.json()
    if (!res.ok || !Array.isArray(data)) {
      content.innerHTML = `<div style="padding:2rem;background:#fff3cd;border-radius:12px;color:#856404">
        <strong>⚠️ ${data.detail || data.error || 'Error al cargar empleados'}</strong><br>
        <span style="font-size:0.82rem">HTTP ${res.status} — intenta recargar la página o vuelve a iniciar sesión.</span>
      </div>`
      return
    }
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
                  <button class="btn btn-secondary" style="padding:4px 8px;font-size:0.72rem;color:#E91E8C;border-color:#E91E8C" onclick="resetearPassword('${e.id}','${e.nombre}')">🔑 Reset</button>
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
      const res = await fetch(API + '/empleados/', { headers: window.authHeaders() })
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
    const res = await fetch(url, { method, headers: window.authHeaders(), body: JSON.stringify(body) })
    if (res.ok) { alert('Empleado guardado correctamente'); navegarA('empleados') }
    else { const err = await res.json(); alert('Error: ' + (err.error || 'No se pudo guardar')) }
  } catch(e) { alert('Error conectando con el servidor') }
}

window.toggleEmpleado = async (id, activo) => {
  if (!confirm(activo ? 'Desactivar este empleado?' : 'Activar este empleado?')) return
  try {
    const res = await fetch(API + '/empleados/' + id, { method: 'PATCH', headers: window.authHeaders(), body: JSON.stringify({ activo: !activo }) })
    if (res.ok) cargarEmpleados()
    else alert('Error al cambiar estado')
  } catch(e) { alert('Error conectando con el servidor') }
}
window.resetearPassword = async (id, nombre) => {
  const nueva = prompt('Nueva contrasena para ' + nombre + ':')
  if (!nueva) return
  if (nueva.length < 4) { alert('La contrasena debe tener al menos 4 caracteres'); return }
  try {
    const res = await fetch(API + '/empleados/' + id, {
      method: 'PATCH',
      headers: window.authHeaders(),
      body: JSON.stringify({ password: nueva })
    })
    if (res.ok) {
      alert('Contrasena actualizada correctamente')
    } else {
      const err = await res.json()
      alert('Error: ' + (err.error || 'No se pudo actualizar'))
    }
  } catch(e) {
    alert('Error conectando con el servidor')
  }
}


window.cargarResenasModeracion = async () => {
  const content = document.getElementById('content')
  content.innerHTML = '<p style="padding:2rem;color:#888">Cargando reseñas...</p>'
  try {
    const [resR, resP] = await Promise.all([
      fetch(API + '/resenas/admin/pendientes').then(r => r.json()).catch(() => ({ resenas: [] })),
      fetch(API + '/productos/?select=id,nombre,sku_interno').then(r => r.json()).catch(() => [])
    ])
    const resenas = (resR && resR.resenas) || []
    const prods = Array.isArray(resP) ? resP : []
    const nombreDe = (pid) => { const p = prods.find(x => x.id === pid); return p ? (p.nombre + ' · ' + (p.sku_interno || '')) : pid }
    const estrellas = (n) => '★'.repeat(n) + '☆'.repeat(5 - n)
    content.innerHTML = `
      <div style="padding:2rem;max-width:760px">
        <h2 style="margin-bottom:0.25rem">⭐ Reseñas</h2>
        <p style="color:#888;font-size:0.85rem;margin-bottom:1.5rem">Aprueba las reseñas para que aparezcan en la tienda. Se necesitan <b>3 o más aprobadas por producto</b> para mostrar estrellas en Google.</p>
        <h3 style="margin-bottom:0.75rem">Pendientes de aprobar (${resenas.length})</h3>
        <div id="resenas-mod-lista">
          ${resenas.length === 0
            ? '<div class="table-card" style="padding:2rem;text-align:center;color:#888">No hay reseñas pendientes 🎉</div>'
            : resenas.map(r => `
            <div class="table-card" id="resena-${r.id}" style="padding:1rem;margin-bottom:10px">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap">
                <div style="flex:1;min-width:200px">
                  <div style="color:#f59e0b;font-size:1rem">${estrellas(r.calificacion || 0)} <span style="color:#888;font-size:0.8rem">(${r.calificacion}/5)</span></div>
                  <p style="font-weight:600;margin:4px 0 2px">${(r.nombre_cliente || 'Anónimo')}</p>
                  <p style="font-size:0.8rem;color:#888;margin:0 0 6px">${nombreDe(r.producto_id)} · ${new Date(r.created_at).toLocaleDateString('es-MX')}</p>
                  <p style="font-size:0.9rem;color:#333;margin:0">${(r.comentario || '').replace(/</g, '&lt;')}</p>
                </div>
                <div style="display:flex;gap:6px;flex-shrink:0">
                  <button class="btn btn-primary" style="padding:6px 14px;font-size:0.8rem" onclick="aprobarResena('${r.id}')">✓ Aprobar</button>
                  <button class="btn btn-secondary" style="padding:6px 14px;font-size:0.8rem;color:#c62828" onclick="eliminarResena('${r.id}')">Eliminar</button>
                </div>
              </div>
            </div>`).join('')}
        </div>
      </div>`
  } catch (e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error: ' + e.message + '</p>'
  }
}
window.aprobarResena = async (id) => {
  try {
    await fetch(API + '/resenas/admin/' + id + '/aprobar', { method: 'PATCH' })
    const el = document.getElementById('resena-' + id); if (el) el.remove()
  } catch (e) { alert('Error al aprobar la reseña') }
}
window.eliminarResena = async (id) => {
  if (!confirm('¿Eliminar esta reseña permanentemente?')) return
  try {
    await fetch(API + '/resenas/admin/' + id, { method: 'DELETE' })
    const el = document.getElementById('resena-' + id); if (el) el.remove()
  } catch (e) { alert('Error al eliminar la reseña') }
}
// Abre WhatsApp con un mensaje para pedirle una reseña al cliente
window.pedirResena = (telefono, nombre, sku) => {
  let tel = (telefono || '').replace(/\D/g, '')
  if (!tel) { alert('Este pedido no tiene teléfono'); return }
  if (tel.length === 10) tel = '52' + tel
  const link = sku ? `https://zapatillasmay.mx/producto/${sku}` : 'https://zapatillasmay.mx'
  const msg = `¡Hola ${nombre || ''}! 🥰 ¿Te gustaron tus zapatillas? Nos ayudarías muchísimo dejando una reseña aquí 👉 ${link}\n\nSolo toca "➕ Dejar reseña". ¡Gracias por tu compra! 👠`
  window.open('https://wa.me/' + tel + '?text=' + encodeURIComponent(msg), '_blank')
}

// ── Crear link de pago manual (precio personalizado) ──────────────────────
window.mostrarFormLinkPago = (prefill) => {
  prefill = prefill || {}
  const _volver = prefill.volver === 'chat' ? 'cargarConversaciones()' : 'cargarPedidos()'
  const content = document.getElementById('content')
  content.innerHTML = `
    <div class="table-card" style="padding:2rem;max-width:560px">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.25rem">
        <button class="btn btn-secondary" onclick="${_volver}">← Volver</button>
        <h3 style="margin:0">💳 Crear link de pago</h3>
      </div>
      <p style="font-size:0.82rem;color:#888;margin-bottom:1.25rem">Para ventas con precio especial (ej. cotizado por WhatsApp). Crea el pedido + link de MercadoPago. Al pagar, se detecta en Meta y GA.</p>
      <div style="display:grid;gap:0.9rem">
        <div><label class="form-label">Modelo / descripción *</label><input class="form-input" id="lp-modelo" placeholder="Ej: MA1400 Tacones para fiesta"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem">
          <div><label class="form-label">Color</label><input class="form-input" id="lp-color" placeholder="Neutro"></div>
          <div><label class="form-label">Talla</label><input class="form-input" id="lp-talla" placeholder="24"></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem">
          <div><label class="form-label">Precio producto (sin envío) *</label><input class="form-input" id="lp-precio" type="number" min="1" placeholder="390"></div>
          <div><label class="form-label">Pares</label><input class="form-input" id="lp-pares" type="number" min="1" value="1"></div>
        </div>
        <hr style="border:none;border-top:1px solid #eee;margin:0.25rem 0">
        <div><label class="form-label">Nombre del cliente *</label><input class="form-input" id="lp-nombre" placeholder="Nombre completo"></div>
        <div><label class="form-label">WhatsApp del cliente *</label><input class="form-input" id="lp-tel" inputmode="tel" placeholder="2711476093"></div>
        <div><label class="form-label">Dirección de envío</label><textarea class="form-input" id="lp-dir" rows="2" placeholder="Calle y número, colonia, CP, ciudad, estado"></textarea></div>
      </div>
      <p style="font-size:0.78rem;color:#888;margin-top:0.75rem">El envío se agrega solo: 1 par $99 · 2 $150 · 3-5 $199 · gratis desde $1,299.</p>
      <button class="btn btn-primary" id="lp-btn" onclick="generarLinkPago()" style="margin-top:1rem;width:100%">Generar link de pago</button>
      <div id="lp-resultado" style="margin-top:1.25rem"></div>
    </div>`
  if (prefill.telefono) { const e = document.getElementById('lp-tel'); if (e) e.value = prefill.telefono.replace(/\D/g, '') }
  if (prefill.nombre) { const e = document.getElementById('lp-nombre'); if (e) e.value = prefill.nombre }
}
window.linkPagoDesdeChat = (telefono, nombre) => {
  mostrarFormLinkPago({ telefono, nombre, volver: 'chat' })
}
window.generarLinkPago = async () => {
  const v = id => (document.getElementById(id).value || '').trim()
  const modelo = v('lp-modelo'), precio = parseFloat(v('lp-precio')), pares = parseInt(v('lp-pares') || '1'), nombre = v('lp-nombre'), tel = v('lp-tel')
  if (!modelo || !nombre || !tel || !v('lp-precio')) { alert('Completa modelo, precio, nombre y WhatsApp'); return }
  if (isNaN(precio) || precio <= 0) { alert('El precio debe ser mayor a 0'); return }
  const btn = document.getElementById('lp-btn'); btn.textContent = 'Generando...'; btn.disabled = true
  const out = document.getElementById('lp-resultado'); out.innerHTML = ''
  try {
    const res = await fetch(API + '/chatbot/link-pago-manual', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telefono: tel, nombre, direccion: v('lp-dir'), modelo, color: v('lp-color'), talla: v('lp-talla'), precio, pares: pares || 1 })
    })
    const data = await res.json()
    if (!data.ok || !data.link) { out.innerHTML = `<p style="color:#c62828">Error: ${data.error || 'no se pudo generar'}</p>`; return }
    let telWa = tel.replace(/\D/g, ''); if (telWa.length === 10) telWa = '52' + telWa
    const msg = `¡Hola ${nombre.split(' ')[0]}! 🥰 Aquí está tu link de pago de ${modelo}:\n💳 Total: $${data.total} MXN (incluye envío)\n👉 ${data.link}\nAcepta tarjeta, transferencia y OXXO. En cuanto confirmes el pago, preparamos tu envío 📦✨`
    out.innerHTML = `
      <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:1rem">
        <p style="font-weight:700;color:#16a34a;margin:0 0 8px">✅ Link generado — Total $${data.total} MXN</p>
        <input class="form-input" readonly value="${data.link}" onclick="this.select()" style="font-size:0.76rem;margin-bottom:8px">
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-secondary" onclick="navigator.clipboard.writeText(this.parentElement.previousElementSibling.value);this.textContent='✓ Copiado'">📋 Copiar link</button>
          <a class="btn btn-primary" href="https://wa.me/${telWa}?text=${encodeURIComponent(msg)}" target="_blank" style="background:#25D366;border-color:#25D366">💬 Enviar por WhatsApp</a>
        </div>
      </div>`
  } catch (e) {
    out.innerHTML = `<p style="color:#c62828">Error de conexión</p>`
  } finally { btn.textContent = 'Generar link de pago'; btn.disabled = false }
}

// ── Gestionar colores de un producto (ocultar/mostrar en el sitio) ─────────
window.gestionarColores = async (productoId, nombre) => {
  const ov = document.createElement('div'); ov.id = 'modal-colores'
  ov.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;padding:16px'
  ov.onclick = (e) => { if (e.target === ov) ov.remove() }
  ov.innerHTML = `<div style="background:#fff;border-radius:14px;max-width:460px;width:100%;max-height:85vh;overflow-y:auto;padding:1.5rem">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem">
        <h3 style="margin:0;font-size:1.05rem">🎨 Colores — ${nombre}</h3>
        <button onclick="document.getElementById('modal-colores').remove()" aria-label="Cerrar" style="background:none;border:none;font-size:1.4rem;cursor:pointer;color:#888">×</button>
      </div>
      <p style="font-size:0.8rem;color:#888;margin:0 0 1rem">Apaga un color para ocultarlo del sitio web. Enciéndelo cuando vuelva a haber existencia.</p>
      <div id="colores-lista"><p style="color:#888">Cargando…</p></div>
    </div>`
  document.body.appendChild(ov)
  window._renderColoresLista(productoId)
}
window._renderColoresLista = async (productoId) => {
  const cont = document.getElementById('colores-lista'); if (!cont) return
  let vars = []
  try { vars = await fetch(API + '/variantes/producto/' + productoId + '/todas').then(r => r.json()) } catch (e) {}
  if (!Array.isArray(vars)) vars = []
  const mapa = {}
  vars.forEach(v => {
    const c = v.color || 'Sin color'
    if (!mapa[c]) mapa[c] = { color: c, hex: v.color_hex || '#999', foto: v.foto_url, activas: 0, total: 0 }
    mapa[c].total++
    if (v.activa !== false) mapa[c].activas++
    if (!mapa[c].foto && v.foto_url) mapa[c].foto = v.foto_url
  })
  const colores = Object.values(mapa)
  cont.innerHTML = colores.length ? colores.map(c => {
    const activo = c.activas > 0
    return `<div style="display:flex;align-items:center;gap:12px;padding:10px;border:1px solid #eee;border-radius:10px;margin-bottom:8px;${activo ? '' : 'opacity:0.6;background:#fafafa'}">
      ${c.foto ? `<img src="${c.foto}" style="width:44px;height:44px;object-fit:cover;border-radius:8px;flex-shrink:0">` : `<span style="width:44px;height:44px;border-radius:8px;background:${c.hex};flex-shrink:0;display:inline-block;border:1px solid #ddd"></span>`}
      <div style="flex:1;min-width:0">
        <p style="font-weight:600;margin:0">${c.color}</p>
        <p style="font-size:0.75rem;margin:0;color:${activo ? '#16a34a' : '#c62828'}">${activo ? '✓ Visible en el sitio' : '✕ Oculto'} · ${c.total} tallas</p>
      </div>
      <button class="btn ${activo ? 'btn-secondary' : 'btn-primary'}" style="padding:6px 12px;font-size:0.78rem;flex-shrink:0;${activo ? 'color:#c62828;border-color:#c62828' : ''}" onclick="toggleColorWeb('${productoId}','${c.color.replace(/'/g, "\\'")}',${activo ? 'false' : 'true'},this)">${activo ? 'Ocultar' : 'Mostrar'}</button>
    </div>`
  }).join('') : '<p style="color:#888">Este producto no tiene colores.</p>'
}
window.toggleColorWeb = async (productoId, color, activa, btn) => {
  btn.disabled = true; btn.textContent = '…'
  try {
    const res = await fetch(API + '/variantes/toggle-color', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ producto_id: productoId, color, activa }) })
    const d = await res.json()
    if (!d.ok) throw new Error(d.error || '')
    window._variantesCache = null
    window._renderColoresLista(productoId)
  } catch (e) { alert('Error al cambiar el color'); btn.disabled = false }
}

window.cargarConversaciones = async function() {
  document.title = 'Zapatillas May'
const navConv = document.querySelector('[data-modulo="conversaciones"]')
if (navConv) navConv.querySelector('.nav-badge')?.remove()
  const content = document.getElementById('content')
  content.innerHTML = '<p style="padding:2rem;color:#888">Cargando...</p>'
  try {
    // Lecturas resilientes: si /productos/ falla o devuelve vacío, NO debe tumbar la lista de chats
    const chatsRaw = await fetch(API + '/chatbot/chats').then(r => r.json()).catch(() => [])
    const chats = Array.isArray(chatsRaw) ? chatsRaw : []
    const productosRaw = await fetch(API + '/productos/?select=id,nombre,imagen_principal,precio_menudeo,precio_mayoreo3,precio_mayoreo6,precio_corrida,corrida_activa,activo').then(r => r.json()).catch(() => [])
    const productos = Array.isArray(productosRaw) ? productosRaw : []

    window._chatsData = {}
    chats.forEach(c => window._chatsData[c.telefono] = c)
    window._productosWA = productos.filter(p => p.activo)

    const totalNoLeidos = chats.reduce((s,c) => s + (c.no_leidos||0), 0)

    content.innerHTML = `
  <div id="wa-tab-content">
    <div id="wa-container">
      <div id="wa-sidebar">
        <div class="wa-sidebar-header">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
            <div>
              <p style="font-size:0.6rem;font-weight:700;letter-spacing:0.1em;color:#E91E8C;text-transform:uppercase;margin:0 0 2px">WhatsApp Cloud API</p>
              <div style="display:flex;align-items:center;gap:8px">
                <span style="font-weight:800;color:white;font-size:1rem;letter-spacing:-0.01em">Conversaciones</span>
                ${totalNoLeidos > 0 ? `<span class="wa-new-badge">${totalNoLeidos}</span>` : ''}
              </div>
            </div>
            <div style="display:flex;gap:4px">
              <button id="tab-chats" onclick="mostrarTabWA('chats')" style="padding:5px 10px;border-radius:6px;font-size:0.72rem;font-weight:600;cursor:pointer;border:1px solid #E91E8C;background:#E91E8C;color:white;font-family:inherit">Chat</button>
              <button id="tab-config" onclick="mostrarTabWA('config')" style="padding:5px 10px;border-radius:6px;font-size:0.72rem;font-weight:600;cursor:pointer;border:1px solid rgba(255,255,255,0.15);background:transparent;color:rgba(255,255,255,0.55);font-family:inherit">Config</button>
            </div>
          </div>
          <input class="wa-search-input" placeholder="Buscar contacto..." oninput="filtrarChats(this.value)">
          <div class="wa-estado-tabs">
            <button class="wa-estado-tab activa" onclick="filtrarEstado('',this)">Todos</button>
            <button class="wa-estado-tab" onclick="filtrarEstado('abierto',this)"><span class="wa-estado-dot abierto"></span>Abierto</button>
            <button class="wa-estado-tab" onclick="filtrarEstado('espera',this)"><span class="wa-estado-dot espera"></span>Espera</button>
            <button class="wa-estado-tab" onclick="filtrarEstado('cerrado',this)"><span class="wa-estado-dot cerrado"></span>Cerrado</button>
          </div>
          <div class="wa-filters">
            <button onclick="filtrarEtiqueta('')" class="wa-pill activa">Todos</button>
            <button onclick="filtrarEtiqueta('solo_pregunta')" class="wa-pill"><span style="width:6px;height:6px;border-radius:50%;background:#3b82f6;display:inline-block;flex-shrink:0"></span> Pregunta</button>
            <button onclick="filtrarEtiqueta('posible_comprador')" class="wa-pill"><span style="width:6px;height:6px;border-radius:50%;background:#f59e0b;display:inline-block;flex-shrink:0"></span> Posible</button>
            <button onclick="filtrarEtiqueta('comprador')" class="wa-pill"><span style="width:6px;height:6px;border-radius:50%;background:#10b981;display:inline-block;flex-shrink:0"></span> Comprador</button>
            <button onclick="filtrarEtiqueta('seguimiento')" class="wa-pill"><span style="width:6px;height:6px;border-radius:50%;background:#ef4444;display:inline-block;flex-shrink:0"></span> Seguim.</button>
            <button onclick="filtrarEtiqueta('frecuente')" class="wa-pill"><span style="width:6px;height:6px;border-radius:50%;background:#E91E8C;display:inline-block;flex-shrink:0"></span> Frecuente</button>
          </div>
        </div>
        <div class="wa-chat-list">
          ${window._htmlChatItems(chats)}
        </div>
      </div>

      <div id="chat-area">
        <div style="display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;gap:10px">
          <div style="width:48px;height:48px;border-radius:50%;background:rgba(233,30,140,0.08);border:1.5px solid rgba(233,30,140,0.15);display:flex;align-items:center;justify-content:center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E91E8C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <p style="font-weight:700;color:#0f172a;font-size:0.95rem;margin:0">Selecciona una conversación</p>
          <p style="font-size:0.78rem;color:#94a3b8;margin:0">para ver los mensajes</p>
        </div>
      </div>
    </div>
  </div>
    `
    // En móvil, mostrar primero la lista a pantalla completa; el chat aparece al tocar una conversación
    if (window.innerWidth <= 900) {
      const ca = document.getElementById('chat-area')
      if (ca) ca.style.display = 'none'
    }
  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error: ' + e.message + '</p>'
  }
}


window.mostrarTabWA = async (tab) => {
  const btnChats = document.getElementById('tab-chats')
  const btnConfig = document.getElementById('tab-config')
  if (btnChats) {
    const active = tab === 'chats'
    btnChats.style.background = active ? '#E91E8C' : 'transparent'
    btnChats.style.color = active ? 'white' : 'rgba(255,255,255,0.55)'
    btnChats.style.borderColor = active ? '#E91E8C' : 'rgba(255,255,255,0.15)'
  }
  if (btnConfig) {
    const active = tab === 'config'
    btnConfig.style.background = active ? '#E91E8C' : 'transparent'
    btnConfig.style.color = active ? 'white' : 'rgba(255,255,255,0.55)'
    btnConfig.style.borderColor = active ? '#E91E8C' : 'rgba(255,255,255,0.15)'
  }
  if (tab === 'chats') {
    await window.cargarConversaciones()
  } else {
    await mostrarConfigWA()
  }
}

window.filtrarEtiqueta = (etiqueta) => {
  document.querySelectorAll('.wa-pill').forEach(b => b.classList.remove('activa'))
  event.target.classList.add('activa')
  document.querySelectorAll('.wa-chat-item').forEach(el => {
    const etiq = el.dataset.etiqueta || ''
    el.style.display = !etiqueta || etiq === etiqueta ? '' : 'none'
  })
}

window.filtrarEstado = (estado, btn) => {
  document.querySelectorAll('.wa-estado-tab').forEach(b => b.classList.remove('activa'))
  if (btn) btn.classList.add('activa')
  document.querySelectorAll('.wa-chat-item').forEach(el => {
    const est = el.dataset.estado || 'abierto'
    el.style.display = !estado || est === estado ? '' : 'none'
  })
}

window.cambiarEstadoChat = async (telefono, estado) => {
  try {
    await fetch(API + '/chatbot/chats/' + telefono + '/estado', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado })
    })
    await window._recargarChats()
    abrirChat(telefono)
  } catch(e) { alert('Error: ' + e.message) }
}


window.mostrarConfigWA = async () => {
  const content = document.getElementById('content')
  try {
    const [resConfig, resRapidas] = await Promise.all([
      fetch(API + '/chatbot/config').then(r => r.json()),
      fetch(API + '/chatbot/respuestas-rapidas').then(r => r.json())
    ])

    const tabContent = document.getElementById('wa-tab-content') || content
    tabContent.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;max-width:1000px">

        <!-- CONFIG GENERAL -->
        <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem">
          <h3 style="font-weight:700;margin-bottom:1.5rem;font-size:1rem">⚙️ Configuración general</h3>

          <div style="margin-bottom:1rem">
            <label style="display:block;font-size:0.78rem;font-weight:600;color:#888;margin-bottom:6px;text-transform:uppercase">Mensaje de bienvenida</label>
            <textarea id="cfg-bienvenida" rows="3" style="width:100%;border:1px solid #eee;border-radius:8px;padding:10px;font-family:DM Sans,sans-serif;font-size:0.85rem;resize:none">${resConfig.mensaje_bienvenida || ''}</textarea>
          </div>

          <div style="margin-bottom:1rem">
            <label style="display:block;font-size:0.78rem;font-weight:600;color:#888;margin-bottom:6px;text-transform:uppercase">Mensaje fuera de horario</label>
            <textarea id="cfg-fuera" rows="3" style="width:100%;border:1px solid #eee;border-radius:8px;padding:10px;font-family:DM Sans,sans-serif;font-size:0.85rem;resize:none">${resConfig.fuera_horario || ''}</textarea>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem">
            <div>
              <label style="display:block;font-size:0.78rem;font-weight:600;color:#888;margin-bottom:6px;text-transform:uppercase">Horario inicio</label>
              <input type="time" id="cfg-inicio" value="${resConfig.horario_inicio || '09:00'}" style="width:100%;border:1px solid #eee;border-radius:8px;padding:10px;font-size:0.85rem">
            </div>
            <div>
              <label style="display:block;font-size:0.78rem;font-weight:600;color:#888;margin-bottom:6px;text-transform:uppercase">Horario fin</label>
              <input type="time" id="cfg-fin" value="${resConfig.horario_fin || '18:00'}" style="width:100%;border:1px solid #eee;border-radius:8px;padding:10px;font-size:0.85rem">
            </div>
          </div>

          <div style="margin-bottom:1.5rem;display:flex;align-items:center;gap:10px">
            <label style="font-size:0.85rem;font-weight:600">Bot activo</label>
            <input type="checkbox" id="cfg-bot" ${resConfig.bot_activo === 'true' ? 'checked' : ''} style="width:18px;height:18px;cursor:pointer">
          </div>

          <button onclick="guardarConfigWA()" style="width:100%;background:#e91e8c;color:white;border:none;border-radius:8px;padding:10px;font-weight:600;cursor:pointer">
            Guardar configuración
          </button>
        </div>

        <!-- RESPUESTAS RÁPIDAS -->
        <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
            <h3 style="font-weight:700;font-size:1rem">⚡ Respuestas rápidas</h3>
            <button onclick="nuevaRespuestaRapida()" style="background:#e91e8c;color:white;border:none;border-radius:8px;padding:6px 14px;font-size:0.8rem;font-weight:600;cursor:pointer">+ Nueva</button>
          </div>
          <div id="respuestas-lista">
            ${resRapidas.map(r => `
              <div style="border:1px solid #eee;border-radius:8px;padding:12px;margin-bottom:8px">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
                  <p style="font-weight:600;font-size:0.85rem">⚡ ${r.titulo}</p>
                  <div style="display:flex;gap:6px">
                    <button onclick="editarRespuesta('${r.id}','${r.titulo.replace(/'/g,"\\'")}','${r.mensaje.replace(/'/g,"\\'").replace(/\n/g,'\\n')}')" 
                            style="background:#f5f5f5;border:none;border-radius:6px;padding:4px 8px;font-size:0.75rem;cursor:pointer">✏️</button>
                    <button onclick="eliminarRespuesta('${r.id}')" 
                            style="background:#fce4ec;border:none;border-radius:6px;padding:4px 8px;font-size:0.75rem;cursor:pointer;color:#c62828">🗑️</button>
                  </div>
                </div>
                <p style="font-size:0.78rem;color:#888;line-height:1.5">${r.mensaje.substring(0,80)}${r.mensaje.length > 80 ? '...' : ''}</p>
              </div>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- PLANTILLAS DE UTILIDAD -->
      <div style="margin-top:1.5rem;max-width:1000px">
        <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
            <div>
              <p style="font-size:0.6rem;font-weight:700;letter-spacing:0.1em;color:#E91E8C;text-transform:uppercase;margin:0 0 2px">WhatsApp Cloud API</p>
              <h3 style="font-weight:700;font-size:1rem;margin:0">Plantillas de mensaje</h3>
            </div>
            <div style="display:flex;gap:8px">
              <button onclick="cargarPlantillas()" style="background:#f1f5f9;border:1px solid #e2e8f0;color:#475569;border-radius:8px;padding:7px 14px;font-size:0.8rem;font-weight:600;cursor:pointer">↺ Actualizar</button>
              <button onclick="crearPlantillasPredefinidas()" style="background:#E91E8C;color:white;border:none;border-radius:8px;padding:7px 14px;font-size:0.8rem;font-weight:600;cursor:pointer">+ Crear plantillas</button>
            </div>
          </div>
          <p style="font-size:0.78rem;color:#94a3b8;margin:0 0 1.5rem">Las plantillas UTILITY se envían automaticamente al confirmar pedidos y envíos. La de MARKETING para carritos abandonados. Meta las aprueba en 1–24 h.</p>
          <div id="plantillas-lista">
            <p style="font-size:0.8rem;color:#94a3b8;text-align:center;padding:20px">Cargando plantillas...</p>
          </div>
        </div>

        <!-- ── Broadcast / Campaña masiva ── -->
        <div style="background:#fff;border-radius:12px;border:1px solid #f1f5f9;padding:20px;margin-top:16px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
            <div>
              <p style="margin:0;font-weight:700;color:#0f172a;font-size:0.95rem">📢 Campaña masiva</p>
              <p style="margin:2px 0 0;font-size:0.75rem;color:#94a3b8">Envía una plantilla aprobada a todos tus contactos de WhatsApp</p>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px">
            <div>
              <label style="font-size:0.78rem;font-weight:600;color:#475569;display:block;margin-bottom:4px">Plantilla</label>
              <select id="broadcast-template" style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:8px 12px;font-size:0.85rem;outline:none;font-family:inherit">
                <option value="">Cargando plantillas...</option>
              </select>
            </div>
            <div>
              <label style="font-size:0.78rem;font-weight:600;color:#475569;display:block;margin-bottom:4px">Parámetro 1 (si la plantilla lo requiere)</label>
              <input id="broadcast-param1" placeholder="ej: nombre del cliente (se usará igual para todos)" style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:8px 12px;font-size:0.85rem;outline:none;box-sizing:border-box;font-family:inherit">
            </div>
            <div>
              <label style="font-size:0.78rem;font-weight:600;color:#475569;display:block;margin-bottom:4px">Destinatarios</label>
              <select id="broadcast-dest" style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:8px 12px;font-size:0.85rem;outline:none;font-family:inherit">
                <option value="todos">Todos los contactos de WhatsApp</option>
                <option value="compradores">Solo compradores</option>
                <option value="posibles">Posibles compradores</option>
              </select>
            </div>
            <button onclick="ejecutarBroadcast()" style="background:#E91E8C;color:#fff;border:none;border-radius:8px;padding:10px;font-size:0.9rem;font-weight:700;cursor:pointer;font-family:inherit">
              Enviar campaña →
            </button>
            <div id="broadcast-resultado" style="font-size:0.8rem;color:#64748b;text-align:center"></div>
          </div>
        </div>
      </div>
    `

    cargarPlantillas()
    // Poblar select de broadcast con plantillas aprobadas
    fetch(API + '/chatbot/templates').then(r => r.json()).then(data => {
      const sel = document.getElementById('broadcast-template')
      if (!sel) return
      const aprobadas = (data.data || []).filter(t => t.status === 'APPROVED')
      sel.innerHTML = aprobadas.length
        ? aprobadas.map(t => `<option value="${t.name}">${t.name}</option>`).join('')
        : '<option value="">Sin plantillas aprobadas</option>'
    }).catch(() => {})

  } catch(e) {
    console.error(e)
  }
}


window.ejecutarBroadcast = async () => {
  const template = document.getElementById('broadcast-template')?.value
  const param1   = document.getElementById('broadcast-param1')?.value.trim() || ''
  const destOpt  = document.getElementById('broadcast-dest')?.value || 'todos'
  const resEl    = document.getElementById('broadcast-resultado')

  if (!template) { alert('Selecciona una plantilla'); return }

  // Obtener teléfonos según filtro
  const chats = Object.values(window._chatsData || {})
  let telefonos = []
  if (destOpt === 'todos') {
    telefonos = chats.map(c => c.telefono)
  } else if (destOpt === 'compradores') {
    telefonos = chats.filter(c => c.etiqueta === 'comprador' || c.etiqueta === 'frecuente').map(c => c.telefono)
  } else if (destOpt === 'posibles') {
    telefonos = chats.filter(c => c.etiqueta === 'posible_comprador').map(c => c.telefono)
  }

  if (!telefonos.length) { alert('No hay contactos en ese grupo'); return }

  const confirmMsg = `¿Enviar "${template}" a ${telefonos.length} contacto${telefonos.length!==1?'s':''}?`
  if (!confirm(confirmMsg)) return

  if (resEl) resEl.textContent = 'Enviando...'
  try {
    const params = param1 ? [param1] : []
    const r = await fetch(API + '/chatbot/broadcast', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template, params, telefonos })
    })
    const data = await r.json()
    if (resEl) resEl.textContent = `✓ Enviados: ${data.enviados}/${data.total} — Errores: ${data.errores}`
  } catch(e) {
    if (resEl) resEl.textContent = 'Error: ' + e.message
  }
}

window.cargarPlantillas = async () => {
  const el = document.getElementById('plantillas-lista')
  if (!el) return
  try {
    const res = await fetch(API + '/chatbot/templates')
    const data = await res.json()
    const templates = data.templates || []
    if (!templates.length) {
      el.innerHTML = `<p style="font-size:0.82rem;color:#94a3b8;text-align:center;padding:16px">Sin plantillas aún. Crea las predefinidas o agrega una desde Meta Business Manager.</p>`
      return
    }
    const statusColor = { APPROVED: '#059669', PENDING: '#f59e0b', REJECTED: '#ef4444', PAUSED: '#94a3b8' }
    const statusLabel = { APPROVED: 'Aprobada', PENDING: 'Pendiente', REJECTED: 'Rechazada', PAUSED: 'Pausada' }
    el.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px">
        ${templates.map(t => {
          const body = (t.components || []).find(c => c.type === 'BODY')
          const color = statusColor[t.status] || '#94a3b8'
          const label = statusLabel[t.status] || t.status
          return `
            <div style="border:1px solid #e2e8f0;border-radius:10px;padding:14px;position:relative">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
                <code style="font-size:0.74rem;background:#f1f5f9;padding:3px 8px;border-radius:4px;color:#1e293b">${t.name}</code>
                <span style="font-size:0.67rem;font-weight:700;color:${color};background:${color}18;padding:2px 8px;border-radius:100px">${label}</span>
              </div>
              <div style="display:flex;gap:6px;margin-bottom:8px">
                <span style="font-size:0.65rem;background:#f1f5f9;padding:2px 7px;border-radius:4px;color:#64748b">${t.category}</span>
                <span style="font-size:0.65rem;background:#f1f5f9;padding:2px 7px;border-radius:4px;color:#64748b">${t.language}</span>
              </div>
              ${body ? `<p style="font-size:0.78rem;color:#475569;line-height:1.5;margin:0">${(body.text||'').substring(0,100)}${(body.text||'').length>100?'...':''}</p>` : ''}
            </div>`
        }).join('')}
      </div>`
  } catch(e) {
    el.innerHTML = `<p style="color:#ef4444;font-size:0.82rem;padding:12px">Error cargando plantillas: ${e.message}</p>`
  }
}


window.crearPlantillasPredefinidas = async () => {
  const btn = event.target
  btn.textContent = 'Creando...'
  btn.disabled = true
  try {
    const res = await fetch(API + '/chatbot/templates/crear-predefinidas', { method: 'POST' })
    const data = await res.json()
    const resumen = (data.resultados || []).map(r =>
      `${r.ok ? '✓' : '✗'} ${r.nombre}${r.error ? ': ' + JSON.parse(r.error||'{}')?.error?.message || r.error : ''}`
    ).join('\n')
    alert('Resultado:\n' + resumen)
    cargarPlantillas()
  } catch(e) {
    alert('Error: ' + e.message)
  } finally {
    btn.textContent = '+ Crear plantillas'
    btn.disabled = false
  }
}


window.guardarConfigWA = async () => {
  try {
    await fetch(API + '/chatbot/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mensaje_bienvenida: document.getElementById('cfg-bienvenida').value,
        fuera_horario: document.getElementById('cfg-fuera').value,
        horario_inicio: document.getElementById('cfg-inicio').value,
        horario_fin: document.getElementById('cfg-fin').value,
        bot_activo: document.getElementById('cfg-bot').checked ? 'true' : 'false'
      })
    })
    alert('Configuración guardada')
  } catch(e) {
    alert('Error guardando')
  }
}


window.nuevaRespuestaRapida = () => {
  const titulo = prompt('Título de la respuesta rápida:')
  if (!titulo) return
  const mensaje = prompt('Mensaje:')
  if (!mensaje) return
  fetch(API + '/chatbot/respuestas-rapidas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo, mensaje, orden: 99 })
  }).then(() => mostrarConfigWA())
}


window.editarRespuesta = (id, titulo, mensaje) => {
  const nuevoTitulo = prompt('Título:', titulo)
  if (!nuevoTitulo) return
  const nuevoMensaje = prompt('Mensaje:', mensaje.replace(/\\n/g, '\n'))
  if (!nuevoMensaje) return
  fetch(API + '/chatbot/respuestas-rapidas/' + id, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo: nuevoTitulo, mensaje: nuevoMensaje })
  }).then(() => mostrarConfigWA())
}


window.eliminarRespuesta = (id) => {
  if (!confirm('¿Eliminar esta respuesta rápida?')) return
  fetch(API + '/chatbot/respuestas-rapidas/' + id, { method: 'DELETE' })
    .then(() => mostrarConfigWA())
}


window.filtrarChats = (texto) => {
  document.querySelectorAll('.wa-chat-item').forEach(el => {
    const nombre = el.dataset.nombre || ''
    const tel = el.dataset.tel || ''
    el.style.display = !texto || nombre.includes(texto.toLowerCase()) || tel.includes(texto) ? '' : 'none'
  })
}
window.renderMensaje = (m, esManual, nombreContacto) => {
  if (m.tipo === 'imagen_saliente') {
    const partes = m.mensaje.replace(/\[.+?\]:\s*\[Imagen\]\s*/, '').split('\n')
    const url = partes[0].trim()
    const caption = partes.slice(1).join('\n').trim()
    if (url.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)/i)) {
      return '<img src="' + url + '" style="max-width:200px;border-radius:8px;display:block">' +
        (caption ? '<p style="font-size:0.82rem;color:#333;white-space:pre-wrap;margin-top:6px">' + caption + '</p>' : '')
    }
  }
  return '<p style="font-size:0.85rem;color:#333;white-space:pre-wrap">' + m.mensaje.replace(/\[.+?\]:\s*/, '') + '</p>'
}


// Helper: fetch /chats y actualiza _chatsData de forma segura
window._recargarChats = async () => {
  try {
    const raw = await fetch(API + '/chatbot/chats').then(r => r.json())
    const chats = Array.isArray(raw) ? raw : []
    const nuevo = {}
    chats.forEach(c => {
      const existente = window._chatsData[c.telefono]
      // Preserve individually-loaded full history if it's larger than the bulk fetch
      if (existente && existente._historial_completo && existente.mensajes.length > c.mensajes.length) {
        nuevo[c.telefono] = { ...c, mensajes: existente.mensajes, _historial_completo: true }
      } else {
        nuevo[c.telefono] = c
      }
    })
    window._chatsData = nuevo
    return chats
  } catch(_) { return [] }
}

// HTML de los items de la lista de chats (usado por cargarConversaciones y el auto-refresco)
window._htmlChatItems = (chats) => {
  if (!chats || chats.length === 0) {
    return '<div style="padding:2rem;text-align:center;color:#999;font-size:0.85rem">Sin conversaciones</div>'
  }
  return [...chats].sort((a,b) => new Date(b.ultimo_mensaje) - new Date(a.ultimo_mensaje)).map(c => `
              <div class="wa-chat-item" data-tel="${c.telefono}" data-nombre="${(c.nombre||'').toLowerCase()}" data-etiqueta="${c.etiqueta||''}" data-estado="${c.estado||'abierto'}"
                   onclick="abrirChat('${c.telefono}')">
                <div class="wa-avatar">
                  ${(c.nombre||c.telefono).charAt(0).toUpperCase()}
                  ${c.en_control ? '<div class="wa-control-dot"></div>' : ''}
                </div>
                <div class="wa-chat-info">
                  <div class="wa-chat-name">${c.nombre || c.telefono}
                    ${c.estado && c.estado !== 'abierto' ? `<span class="wa-estado-badge ${c.estado}">${c.estado==='espera'?'En espera':'Cerrado'}</span>` : ''}
                  </div>
                  <div class="wa-chat-preview">${(() => { const mm = (c.mensajes&&c.mensajes[0]&&c.mensajes[0].mensaje)||''; if (mm.startsWith('[Imagen]')) return '📷 Imagen'; if (mm.startsWith('[Sticker]')) return '🏷️ Sticker'; return mm.substring(0,40)+'…' })()}</div>
                </div>
                <div class="wa-chat-meta">
                  <span class="wa-chat-time">${new Date(c.ultimo_mensaje).toLocaleDateString('es-MX',{day:'numeric',month:'short'})}</span>
                  ${c.no_leidos > 0 ? `<span class="wa-unread">${c.no_leidos}</span>` : ''}
                </div>
              </div>
            `).join('')
}

// Re-renderiza la barra lateral de chats en vivo (sin perder búsqueda/filtros ni el chat abierto)
window._refrescarListaChats = (chats) => {
  const lista = document.querySelector('.wa-chat-list')
  if (!lista) return  // no estamos en la pestaña de conversaciones
  const firmaNueva = chats.map(c => c.telefono + ':' + c.ultimo_mensaje + ':' + (c.no_leidos||0)).join('|')
  if (firmaNueva === window._firmaListaChats) return  // nada cambió, no re-renderizar
  window._firmaListaChats = firmaNueva
  lista.innerHTML = window._htmlChatItems(chats)
  // Re-aplicar búsqueda y filtros activos
  const busq = document.querySelector('.wa-search-input')
  if (busq && busq.value) filtrarChats(busq.value)
  const etiqAct = document.querySelector('.wa-pill.activa')
  const estAct = document.querySelector('.wa-estado-tab.activa')
  document.querySelectorAll('.wa-chat-item').forEach(el => {
    let mostrar = true
    if (etiqAct) { const e = (etiqAct.getAttribute('onclick')||'').match(/filtrarEtiqueta\('([^']*)'\)/); if (e && e[1] && (el.dataset.etiqueta||'') !== e[1]) mostrar = false }
    if (mostrar && estAct) { const s = (estAct.getAttribute('onclick')||'').match(/filtrarEstado\('([^']*)'/); if (s && s[1] && (el.dataset.estado||'abierto') !== s[1]) mostrar = false }
    if (!mostrar) el.style.display = 'none'
  })
  // Marcar como activo el chat abierto
  if (window._chatActivo) {
    const act = lista.querySelector(`.wa-chat-item[data-tel="${window._chatActivo}"]`)
    if (act) act.classList.add('activa')
  }
}

// Función compartida de render de burbujas — usada por abrirChat y el polling
window._renderBurbujas = (chat) => {
  // Parsea timestamps forzando UTC cuando no traen zona (Supabase a veces devuelve naive)
  const parseUTC = (s) => {
    if (!s) return null
    // Si ya trae Z o offset (+hh:mm / -hh:mm), úsalo tal cual; si no, trátalo como UTC
    const tieneZona = /[zZ]$|[+-]\d{2}:?\d{2}$/.test(s)
    return new Date(tieneZona ? s : s.replace(' ', 'T') + 'Z')
  }
  const mensajesOrden = [...(chat.mensajes || [])].reverse()
  // Encontrar el índice del último mensaje saliente para poner el read receipt
  const idxUltimoSaliente = mensajesOrden.reduce((acc, m, i) => {
    const esSal = m.tipo === 'manual' || m.tipo === 'imagen_saliente' || m.tipo === 'documento_saliente' || m.tipo === 'video_saliente' || m.tipo === 'ubicacion_saliente' || m.tipo === 'contacto_saliente' || m.tipo === 'botones_saliente' || m.tipo === 'lista_saliente' || m.tipo === 'carrusel_saliente' || m.tipo === 'template_saliente'
    return esSal ? i : acc
  }, -1)

  return mensajesOrden.map((m, idx) => {
    const esSaliente = m.tipo === 'manual' || m.tipo === 'imagen_saliente' || m.tipo === 'documento_saliente' || m.tipo === 'video_saliente' || m.tipo === 'ubicacion_saliente' || m.tipo === 'contacto_saliente' || m.tipo === 'botones_saliente' || m.tipo === 'lista_saliente' || m.tipo === 'carrusel_saliente' || m.tipo === 'template_saliente'
    const senderName = esSaliente ? ((m.mensaje || '').match(/\[(.+?)\]:/)?.[1] || 'Admin') : (chat.nombre || chat.telefono)
    const _parsedAt = parseUTC(m.created_at)
    const ts = _parsedAt ? _parsedAt.toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'}) : ''
    const textoLimpio = m.mensaje ? m.mensaje.replace(/\[.+?\]:\s*/, '') : ''

    // Construir body de la burbuja según tipo
    let msgBody = ''
    if (m.tipo === 'imagen_saliente') {
      const imgUrl = m.mensaje.replace(/\[.+?\]:\s*\[Imagen\]\s*/, '').split('\n')[0].trim()
      msgBody = imgUrl.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)/i)
        ? `<img src="${imgUrl}" style="max-width:200px;border-radius:8px;display:block;cursor:pointer" onclick="window.open('${imgUrl}')">`
        : `<p>${textoLimpio}</p>`
    } else if (m.tipo === 'documento_saliente') {
      const parts = textoLimpio.replace('[Documento] ', '').split(' ')
      const fname = parts[0] || 'documento'
      const furl  = parts[1] || ''
      msgBody = `<a href="${furl}" target="_blank" class="wa-doc-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        ${fname}</a>`
    } else if (m.tipo === 'video_saliente') {
      const vurl = textoLimpio.replace('[Video] ', '')
      msgBody = `<video src="${vurl}" controls style="max-width:220px;border-radius:8px;display:block"></video>`
    } else if (m.tipo === 'botones_saliente') {
      const partes = textoLimpio.replace('[Botones] ', '').split(' -> ')
      const msg = partes[0] || textoLimpio
      const btns = (partes[1] || '').split(' | ')
      msgBody = `<p style="margin:0 0 8px">${msg}</p>
        <div style="display:flex;flex-direction:column;gap:4px">${btns.map(b=>`<span style="border:1px solid rgba(8,145,178,0.3);border-radius:6px;padding:4px 10px;font-size:0.78rem;color:#0891b2;text-align:center">${b}</span>`).join('')}</div>`
    } else if (m.tipo === 'lista_saliente') {
      const partes = textoLimpio.replace('[Lista] ', '').split(' -> ')
      const msg = partes[0] || textoLimpio
      const ops = (partes[1] || '').split(', ').slice(0, 5)
      msgBody = `<p style="margin:0 0 6px">${msg}</p>
        <div style="border:1px solid rgba(8,145,178,0.25);border-radius:6px;padding:6px 8px;font-size:0.75rem;color:#0891b2">
          ${ops.map(o=>`<div>• ${o}</div>`).join('')}
          ${ops.length < (partes[1]||'').split(', ').length ? '<div style="color:#94a3b8">…</div>' : ''}
        </div>`
    } else if (m.tipo === 'carrusel_saliente') {
      const partesC = (m.mensaje || '').split('|IMGS|')
      const imgsC = partesC[1] ? partesC[1].split(',').filter(Boolean) : []
      const textoC = textoLimpio.split('|IMGS|')[0].replace('[Carrusel] ', '')
      msgBody = `<p style="margin:0;font-size:0.85rem">${textoC}</p>
        ${imgsC.length
          ? `<div style="display:flex;gap:6px;overflow-x:auto;margin-top:6px;max-width:250px;padding-bottom:2px">${imgsC.map(u => `<img src="${u}" alt="producto" style="width:62px;height:78px;object-fit:cover;border-radius:8px;flex-shrink:0;cursor:pointer" onclick="window.open('${u}','_blank')">`).join('')}</div>`
          : '<p style="margin:4px 0 0;font-size:0.72rem;color:#94a3b8">🎠 Carrusel de productos</p>'}`
    } else if (m.tipo === 'sticker') {
      const stUrl = (m.mensaje || '').match(/https?:\/\/\S+/)
      msgBody = stUrl
        ? `<img src="${stUrl[0]}" alt="sticker" style="width:100px;height:100px;object-fit:contain">`
        : `<p style="color:#64748b;font-size:0.8rem">🏷️ Sticker</p>`
    } else if (m.tipo === 'template_saliente') {
      msgBody = `<p style="margin:0;font-size:0.85rem">${textoLimpio.replace('[Template] ','')}</p>
        <p style="margin:4px 0 0;font-size:0.72rem;color:#94a3b8">📋 Plantilla enviada</p>`
    } else if (m.tipo === 'button_reply') {
      msgBody = `<p style="margin:0;color:#0891b2;font-size:0.85rem">👆 ${textoLimpio.replace('[Botón] ','')}</p>`
    } else if (m.tipo === 'list_reply') {
      msgBody = `<p style="margin:0;color:#0891b2;font-size:0.85rem">☰ ${textoLimpio.replace('[Lista] ','')}</p>`
    } else if (m.tipo === 'ubicacion_saliente') {
      const mapsUrl = textoLimpio.match(/https:\/\/maps\.google\.com\/\?q=[\d.,]+/)?.[0] || ''
      const locName = textoLimpio.replace('[Ubicación] ', '').replace(/ https:.*/,'')
      msgBody = `<a href="${mapsUrl}" target="_blank" class="wa-doc-link" style="color:#0891b2;text-decoration:none">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        ${locName || 'Ubicación'}</a>`
    } else if (m.tipo === 'contacto_saliente') {
      const ctxt = textoLimpio.replace('[Contacto] ', '')
      msgBody = `<span class="wa-doc-link" style="color:#0f172a">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        ${ctxt}</span>`
    } else if (m.tipo === 'imagen') {
      // La URL viene en media_url (legacy) o embebida en el mensaje: "[Imagen] https://..."
      const urlEnMsg = (m.mensaje || '').match(/https?:\/\/\S+/)
      const imgSrc = m.media_url || (urlEnMsg ? urlEnMsg[0] : null)
      const caption = (m.mensaje || '').replace('[Imagen]', '').replace(/https?:\/\/\S+/, '').replace(/^[:\s]+/, '').trim()
      if (imgSrc) {
        msgBody = `<div>
          <a href="${imgSrc}" target="_blank" rel="noopener">
            <img src="${imgSrc}" alt="Imagen del cliente" style="max-width:220px;max-height:220px;border-radius:8px;display:block;cursor:pointer">
          </a>
          ${caption ? `<p style="margin:4px 0 0;font-size:0.82rem;color:#475569">${caption}</p>` : ''}
        </div>`
      } else {
        msgBody = `<p style="color:#64748b;font-size:0.8rem">📷 Imagen recibida</p>`
      }
    } else if (m.tipo === 'audio') {
      const audioSrc = m.media_url || (m.mensaje || '').match(/https?:\/\/\S+/)?.[0] || ''
      const transcripcion = textoLimpio.replace('[Audio de voz recibido]','').replace('[Audio sin contenido]','').replace('[Audio no procesable]','').trim()
      msgBody = audioSrc
        ? `<div>
            <audio src="${audioSrc}" controls style="max-width:220px;width:100%;margin-bottom:${transcripcion?'4px':'0'}"></audio>
            ${transcripcion ? `<p style="font-size:0.8rem;color:#475569;margin:0;font-style:italic">${transcripcion}</p>` : ''}
           </div>`
        : `<p style="color:#64748b;font-size:0.8rem">🎵 ${transcripcion || 'Audio de voz'}</p>`
    } else if (m.tipo === 'documento') {
      const urlEnMsg = (m.mensaje || '').match(/https?:\/\/\S+/)
      const docSrc = m.media_url || (urlEnMsg ? urlEnMsg[0] : null)
      const fname = (m.mensaje || '').replace('[Documento]','').replace(/https?:\/\/\S+/g,'').trim() || 'documento'
      msgBody = docSrc
        ? `<a href="${docSrc}" target="_blank" class="wa-doc-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            ${fname}</a>`
        : `<p style="color:#64748b;font-size:0.8rem">📄 ${fname || 'Documento recibido'}</p>`
    } else if (m.tipo === 'video') {
      const urlEnMsg = (m.mensaje || '').match(/https?:\/\/\S+/)
      const vidSrc = m.media_url || (urlEnMsg ? urlEnMsg[0] : null)
      msgBody = vidSrc
        ? `<video src="${vidSrc}" controls style="max-width:220px;border-radius:8px;display:block"></video>`
        : `<p style="color:#64748b;font-size:0.8rem">🎬 Video recibido</p>`
    } else {
      msgBody = `<p>${textoLimpio}</p>`
    }

    // Read receipt: ✓ enviado | ✓✓ gris entregado | ✓✓ azul visto
    // cliente_leyo_at = "el cliente leyó todo hasta esta hora" → todos los msg antes de esa hora son ✓✓ azul
    let readReceipt = ''
    if (esSaliente) {
      const leyoAt   = parseUTC(chat.cliente_leyo_at)
      const entregAt = parseUTC(chat.cliente_entrego_at)
      const msgAt    = parseUTC(m.created_at)
      if (leyoAt && msgAt <= leyoAt) {
        readReceipt = `<span class="wa-read-receipt read" title="Visto">✓✓</span>`
      } else if (entregAt && msgAt <= entregAt) {
        readReceipt = `<span class="wa-read-receipt delivered" title="Entregado">✓✓</span>`
      } else if (idx === idxUltimoSaliente) {
        readReceipt = `<span class="wa-read-receipt sent" title="Enviado">✓</span>`
      }
    }

    // Botón reply en hover
    const replyBtn = `<button class="wa-reply-btn" onclick="iniciarReply('${chat.telefono}','${(m.wa_message_id||'').replace(/'/g,'')}')" title="Responder">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
    </button>`

    const rendered = (m.mensaje || m.media_url) ? `
      <div class="wa-msg-row ${esSaliente ? 'saliente' : 'entrante'}" data-idx="${idx}">
        ${!esSaliente ? replyBtn : ''}
        <div class="wa-msg-row-inner">
          <span class="wa-msg-sender">${senderName}</span>
          <div class="wa-bubble ${esSaliente ? 'saliente' : 'entrante'}">${msgBody}<div class="wa-bubble-time">${ts}${readReceipt}</div></div>
        </div>
        ${esSaliente ? replyBtn : ''}
      </div>` : ''

    const botRendered = m.respuesta ? `
      <div class="wa-msg-row saliente">
        ${replyBtn}
        <div class="wa-msg-row-inner">
          <span class="wa-msg-sender" style="color:#7c3aed">Bot · Maya</span>
          <div class="wa-bubble bot">
            <p>${m.respuesta.replace(/(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|webp))/gi, '')}</p>
            ${(m.respuesta.match(/(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|webp))/gi)||[]).map(u => `<img src="${u}" style="max-width:200px;border-radius:8px;margin-top:4px;display:block" onclick="window.open('${u}')">`).join('')}
            <div class="wa-bubble-time">${ts}</div>
          </div>
        </div>
      </div>` : ''

    return rendered + botRendered
  }).join('')
}

window.abrirChat = async (telefono) => {
  let chat = window._chatsData[telefono] || {
    telefono, nombre: telefono, mensajes: [], en_control: false,
    etiqueta: 'sin_etiqueta', estado: 'abierto', no_leidos: 0
  }

  document.querySelectorAll('.wa-chat-item').forEach(el => el.classList.remove('activo'))
  const item = document.querySelector(`[data-tel="${telefono}"]`)
  if (item) item.classList.add('activo')

  const esMobil = window.innerWidth <= 900

  if (esMobil) {
    const sidebar = document.getElementById('wa-sidebar')
    const container = document.getElementById('wa-container')
    if (sidebar) sidebar.style.display = 'none'
    if (container) container.style.gridTemplateColumns = '1fr'
  }

   const area = document.getElementById('chat-area')
area.style.display = 'flex'
area.style.flexDirection = 'column'
area.style.flex = '1'
area.style.minHeight = '0'

  area.innerHTML = `
    <!-- Header compacto -->
    <div class="wa-chat-header">
      ${esMobil ? `<button onclick="volverChats()" class="wa-circ-btn">←</button>` : ''}
      <div class="wa-avatar-sm">${(chat.nombre||chat.telefono).charAt(0).toUpperCase()}</div>
      <div class="wa-header-info">
        <div class="wa-header-name">${chat.nombre || chat.telefono}</div>
        <div class="wa-header-sub">${chat.telefono} · ${chat.mensajes.length} msg</div>
      </div>
      <div class="wa-header-actions">
        ${chat.en_control
          ? `<button onclick="toggleControl('${telefono}', false)" class="wa-btn wa-btn-on" title="Activar bot automático">Bot</button>`
          : `<button onclick="toggleControl('${telefono}', true)" class="wa-btn wa-btn-off" title="Tomar control manual">Manual</button>`}
        <button onclick="mostrarCatalogoWA('${telefono}')" class="wa-btn wa-btn-prod" title="Enviar producto">Catálogo</button>
        <button onclick="mostrarRespuestasRapidas('${telefono}')" class="wa-btn wa-btn-quick" title="Respuestas rápidas">Rápidas</button>
        <button onclick="marcarNoLeido('${telefono}')" class="wa-btn" style="background:rgba(245,127,23,0.08);color:#f57f17;border-color:rgba(245,127,23,0.25)" title="Marcar pendiente de revisión">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </button>
        <button onclick="window.cargarConversaciones()" class="wa-btn wa-btn-reload" title="Recargar">↺</button>
      </div>
    </div>

    <!-- Sub-header: estado + etiqueta -->
    <div class="wa-subheader">
      <span class="wa-bot-badge ${chat.en_control ? 'manual' : 'auto'}">
        ${chat.en_control ? 'Control manual' : 'Bot activo'}
      </span>
      <select onchange="cambiarEtiqueta('${telefono}', this.value)" class="wa-label-select-sm">
        <option value="sin_etiqueta" ${!chat.etiqueta || chat.etiqueta==='sin_etiqueta' ? 'selected' : ''}>Sin etiqueta</option>
        <option value="solo_pregunta" ${chat.etiqueta==='solo_pregunta' ? 'selected' : ''}>Pregunta</option>
        <option value="posible_comprador" ${chat.etiqueta==='posible_comprador' ? 'selected' : ''}>Posible comprador</option>
        <option value="comprador" ${chat.etiqueta==='comprador' ? 'selected' : ''}>Comprador</option>
        <option value="seguimiento" ${chat.etiqueta==='seguimiento' ? 'selected' : ''}>Seguimiento</option>
        <option value="frecuente" ${chat.etiqueta==='frecuente' ? 'selected' : ''}>Frecuente</option>
      </select>
      <select onchange="cambiarEstadoChat('${telefono}', this.value)" class="wa-label-select-sm" style="border-color:${(chat.estado||'abierto')==='espera'?'#f59e0b':(chat.estado==='cerrado'?'#64748b':'#10b981')}">
        <option value="abierto" ${(!chat.estado||chat.estado==='abierto') ? 'selected' : ''}>🟢 Abierto</option>
        <option value="espera" ${chat.estado==='espera' ? 'selected' : ''}>🟡 En espera</option>
        <option value="cerrado" ${chat.estado==='cerrado' ? 'selected' : ''}>⚫ Cerrado</option>
      </select>
    </div>

    <!-- Mensajes -->
    <div id="mensajes-area">
      ${window._renderBurbujas(chat)}
    </div>

    <!-- Input -->
    <div class="wa-input-bar">
      <div class="wa-input-toolbar">
        <button class="wa-tool-btn" title="Adjuntar imagen" onclick="document.getElementById('img-file-${telefono}').click()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </button>
        <input type="file" id="img-file-${telefono}" accept="image/*" style="display:none" onchange="subirImagenWA('${telefono}',this)">
        <button class="wa-tool-btn" title="Adjuntar documento o PDF" onclick="document.getElementById('doc-file-${telefono}').click()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>
        </button>
        <input type="file" id="doc-file-${telefono}" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt" style="display:none" onchange="subirDocumentoWA('${telefono}',this)">
        <button class="wa-tool-btn" title="Adjuntar video" onclick="document.getElementById('vid-file-${telefono}').click()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
        </button>
        <input type="file" id="vid-file-${telefono}" accept="video/*" style="display:none" onchange="subirVideoWA('${telefono}',this)">
        <button class="wa-tool-btn" title="Enviar botones interactivos" onclick="mostrarModalBotones('${telefono}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="4" rx="2"/><rect x="2" y="13" width="20" height="4" rx="2"/></svg>
        </button>
        <button class="wa-tool-btn" title="Enviar lista interactiva" onclick="mostrarModalLista('${telefono}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1"/><circle cx="3" cy="12" r="1"/><circle cx="3" cy="18" r="1"/></svg>
        </button>
        <button class="wa-tool-btn" title="Enviar carrusel de productos" onclick="mostrarModalCarrusel('${telefono}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="7" height="16" rx="1"/><rect x="10" y="4" width="4" height="16" rx="1"/><rect x="15" y="4" width="7" height="16" rx="1"/></svg>
        </button>
        <button class="wa-tool-btn" title="Enviar ubicación de la tienda" onclick="enviarUbicacionWA('${telefono}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </button>
        <button class="wa-tool-btn" title="Enviar tarjeta de contacto" onclick="mostrarEnviarContactoWA('${telefono}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </button>
        <button class="wa-tool-btn" title="Respuestas rápidas" onclick="mostrarRespuestasRapidas('${telefono}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        </button>
        <button class="wa-tool-btn" title="Crear link de pago" style="color:#16a34a" onclick="linkPagoDesdeChat('${telefono}','${(chat.nombre||'').replace(/'/g,'')}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
        </button>
        <div style="flex:1"></div>
        <span id="reply-context-${telefono}" class="wa-reply-context" style="display:none"></span>
        <span id="char-count-${telefono}" class="wa-char-count"></span>
      </div>
      <div class="wa-input-row">
        <textarea id="msg-input-${telefono}" class="wa-textarea" placeholder="Escribe un mensaje..." rows="2"
                  oninput="const c=document.getElementById('char-count-${telefono}');if(c){c.textContent=this.value.length>0?this.value.length+'/1024':''}"
                  onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();enviarMensajeWA('${telefono}')}"></textarea>
        <button onclick="enviarMensajeWA('${telefono}')" class="wa-send-btn" title="Enviar (Enter)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>

    <!-- Toggle notas/tareas -->
    <button class="wa-nt-toggle" onclick="toggleNotasTareas()">
      <span style="display:flex;align-items:center;gap:6px">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        Notas y tareas
      </span>
      <span id="wa-nt-arrow" style="font-size:0.7rem">${esMobil ? '▲' : '▼'}</span>
    </button>
    <div id="notas-tareas-panel" class="${esMobil ? 'nt-collapsed' : ''}">
      <div class="wa-nt-grid">
        <div>
          <div class="wa-nt-header">
            <p class="wa-nt-title">📝 Notas</p>
            <button onclick="agregarNota('${telefono}')" class="wa-nt-add">+ Agregar</button>
          </div>
          <div id="notas-lista-${telefono}" class="wa-nt-list">
            <p style="font-size:0.75rem;color:var(--text-3);text-align:center;padding:8px">Cargando...</p>
          </div>
        </div>
        <div>
          <div class="wa-nt-header">
            <p class="wa-nt-title">✅ Tareas</p>
            <button onclick="agregarTarea('${telefono}')" class="wa-nt-add">+ Agregar</button>
          </div>
          <div id="tareas-lista-${telefono}" class="wa-nt-list">
            <p style="font-size:0.75rem;color:var(--text-3);text-align:center;padding:8px">Cargando...</p>
          </div>
        </div>
      </div>
    </div>
  `

  // Scroll inicial con los mensajes en caché
  const _scrollMensajes = () => {
    const ma = document.getElementById('mensajes-area')
    if (ma) ma.scrollTop = ma.scrollHeight
  }
  setTimeout(_scrollMensajes, 100)

  // Cargar historial individual completo si no lo tenemos aún
  if (!chat._historial_completo) {
    try {
      const msgs = await fetch(`${API}/chatbot/chats/${telefono}/mensajes`).then(r => r.json())
      if (Array.isArray(msgs) && msgs.length > 0) {
        const nombre = msgs.find(m => m.nombre_contacto && m.nombre_contacto !== telefono)?.nombre_contacto || chat.nombre
        window._chatsData[telefono] = { ...chat, nombre, mensajes: msgs, _historial_completo: true }
        chat = window._chatsData[telefono]
        // Actualizar contador en sub-header
        const sub = document.querySelector(`#chat-area .wa-header-sub`)
        if (sub) sub.textContent = `${chat.telefono} · ${msgs.length} msg`
        // Re-renderizar burbujas con historial completo
        const ma = document.getElementById('mensajes-area')
        if (ma) {
          ma.innerHTML = window._renderBurbujas(chat)
          setTimeout(() => { ma.scrollTop = ma.scrollHeight }, 50)
        }
      }
    } catch(_) { /* silencioso */ }
  }

  fetch(API + '/chatbot/chats/' + telefono + '/leido', { method: 'PATCH' })
  window._chatActivo = telefono
  cargarNotasTareas(telefono)
}



window.toggleNotasTareas = () => {
  const panel = document.getElementById('notas-tareas-panel')
  const arrow = document.getElementById('wa-nt-arrow')
  if (!panel) return
  const collapsed = panel.classList.toggle('nt-collapsed')
  if (arrow) arrow.textContent = collapsed ? '▲' : '▼'
}

window.volverChats = () => {
  const sidebar = document.getElementById('wa-sidebar')
  const container = document.getElementById('wa-container')
  if (sidebar) sidebar.style.display = ''
  if (container) container.style.gridTemplateColumns = ''
  document.querySelectorAll('.wa-chat-item').forEach(el => el.classList.remove('activo'))
  const chatArea = document.getElementById('chat-area')
  // En móvil, ocultar el área de chat para que la lista use toda la altura (maestro-detalle)
  if (chatArea && window.innerWidth <= 900) chatArea.style.display = 'none'
  if (chatArea) chatArea.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;gap:10px">
      <div style="width:48px;height:48px;border-radius:50%;background:rgba(233,30,140,0.08);border:1.5px solid rgba(233,30,140,0.15);display:flex;align-items:center;justify-content:center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E91E8C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </div>
      <p style="font-weight:700;color:#0f172a;font-size:0.95rem;margin:0">Selecciona una conversación</p>
      <p style="font-size:0.78rem;color:#94a3b8;margin:0">para ver los mensajes</p>
    </div>
  `
}

window.mostrarRespuestasRapidas = async (telefono) => {
  const res = await fetch(API + '/chatbot/respuestas-rapidas')
  const rapidas = await res.json()
  const modal = document.createElement('div')
  modal.id = 'modal-rapidas'
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:flex-end;justify-content:center;padding:1rem'
  modal.innerHTML = `
    <div style="background:white;border-radius:16px 16px 0 0;width:100%;max-width:600px;max-height:60vh;overflow-y:auto;padding:1.5rem">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <p style="font-weight:700">⚡ Respuestas rápidas</p>
        <button onclick="this.closest('div[style*=fixed]').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer">✕</button>
      </div>
      ${rapidas.map(r => `
        <div onclick="usarRespuestaRapida('${telefono}', \`${r.mensaje.replace(/`/g,'\\`')}\`)"
             style="padding:12px;border:1px solid #eee;border-radius:8px;margin-bottom:8px;cursor:pointer"
             onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
          <p style="font-weight:600;font-size:0.85rem;margin-bottom:4px">⚡ ${r.titulo}</p>
          <p style="font-size:0.78rem;color:#888">${r.mensaje}</p>
        </div>
      `).join('')}
    </div>
  `
  document.body.appendChild(modal)
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove() })
}

window.cargarNotasTareas = async (telefono) => {
  const agente = window._empleadoActual?.nombre || 'Admin'
  const hoy = new Date().toISOString().split('T')[0]

  const [notas, tareas] = await Promise.all([
    fetch(API + '/chatbot/notas/' + telefono).then(r => r.json()),
    fetch(API + '/chatbot/tareas/' + telefono).then(r => r.json())
  ])

  const notasEl = document.getElementById('notas-lista-' + telefono)
  if (notasEl) {
    notasEl.innerHTML = notas.length === 0
      ? '<p style="font-size:0.73rem;color:var(--text-3);text-align:center;padding:8px">Sin notas</p>'
      : notas.map(n => `
        <div class="wa-nota">
          <p>${n.nota}</p>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <small>${n.agente} · ${new Date(n.created_at).toLocaleDateString('es-MX')}</small>
            <button onclick="eliminarNota('${n.id}','${telefono}')" style="background:none;border:none;color:#ccc;cursor:pointer;font-size:0.72rem;padding:0">🗑️</button>
          </div>
        </div>
      `).join('')
  }

  const tareasEl = document.getElementById('tareas-lista-' + telefono)
  if (tareasEl) {
    tareasEl.innerHTML = tareas.length === 0
      ? '<p style="font-size:0.73rem;color:var(--text-3);text-align:center;padding:8px">Sin tareas</p>'
      : tareas.map(t => {
          const venceHoy = t.fecha_vence === hoy
          const vencida = t.fecha_vence && t.fecha_vence < hoy && !t.completada
          return `
            <div class="wa-tarea" style="${t.completada ? 'opacity:0.55' : ''}">
              <input type="checkbox" ${t.completada ? 'checked' : ''}
                     onchange="completarTarea('${t.id}', this.checked, '${telefono}')"
                     style="width:14px;height:14px;cursor:pointer;accent-color:#25D366;flex-shrink:0">
              <div style="flex:1;min-width:0">
                <p class="wa-tarea-title ${t.completada ? 'done' : ''}">${t.titulo}</p>
                ${t.fecha_vence ? `<p class="wa-tarea-due" style="color:${vencida ? '#c62828' : venceHoy ? '#f57f17' : 'var(--text-3)'}">${vencida ? '⚠️ Vencida' : venceHoy ? '🔔 Vence hoy' : t.fecha_vence}</p>` : ''}
              </div>
              <button onclick="eliminarTarea('${t.id}','${telefono}')" style="background:none;border:none;color:#ccc;cursor:pointer;font-size:0.72rem;padding:0">🗑️</button>
            </div>
          `
        }).join('')
  }
}


window.agregarNota = async (telefono) => {
  const nota = prompt('Escribe la nota:')
  if (!nota) return
  const agente = window._empleadoActual?.nombre || 'Admin'
  await fetch(API + '/chatbot/notas/' + telefono, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nota, agente })
  })
  cargarNotasTareas(telefono)
}


window.eliminarNota = async (id, telefono) => {
  if (!confirm('¿Eliminar nota?')) return
  await fetch(API + '/chatbot/notas/' + id, { method: 'DELETE' })
  cargarNotasTareas(telefono)
}


window.agregarTarea = async (telefono) => {
  const titulo = prompt('Título de la tarea:')
  if (!titulo) return
  const fecha = prompt('Fecha límite (YYYY-MM-DD) o déjala vacía:')
  const agente = window._empleadoActual?.nombre || 'Admin'
  await fetch(API + '/chatbot/tareas/' + telefono, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo, fecha_vence: fecha || null, agente })
  })
  cargarNotasTareas(telefono)
}


window.completarTarea = async (id, completada, telefono) => {
  await fetch(API + '/chatbot/tareas/' + id, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completada })
  })
  cargarNotasTareas(telefono)
}


window.eliminarTarea = async (id, telefono) => {
  if (!confirm('¿Eliminar tarea?')) return
  await fetch(API + '/chatbot/tareas/' + id, { method: 'DELETE' })
  cargarNotasTareas(telefono)
}


window.usarRespuestaRapida = (telefono, mensaje) => {
  document.getElementById('modal-rapidas')?.remove()
  const input = document.getElementById('msg-input-' + telefono)
  if (input) {
    input.value = mensaje
    input.focus()
    enviarMensajeWA(telefono)
  }
}


window.enviarMensajeWA = async (telefono) => {
  const input = document.getElementById('msg-input-' + telefono)
  const mensaje = input?.value?.trim()
  if (!mensaje) return
  input.value = ''
  const agente = window._empleadoActual?.nombre || 'Admin'
  const reply_to_wa_id = window._replyContext?.[telefono] || null
  cancelarReply(telefono)
  const cc = document.getElementById('char-count-' + telefono)
  if (cc) cc.textContent = ''
  try {
    await fetch(API + '/chatbot/chats/' + telefono + '/mensaje', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje, agente, reply_to_wa_id })
    })
    await window._recargarChats()
    abrirChat(telefono)
  } catch(e) {
    alert('Error enviando mensaje')
  }
}

// Reply context
window._replyContext = {}
window.iniciarReply = (telefono, waId) => {
  window._replyContext[telefono] = waId
  const ctx = document.getElementById('reply-context-' + telefono)
  if (ctx) {
    ctx.style.display = 'inline-flex'
    ctx.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg> Respondiendo &nbsp;<button onclick="cancelarReply('${telefono}')" style="border:none;background:none;cursor:pointer;color:#94a3b8;padding:0;font-size:0.75rem">✕</button>`
  }
  document.getElementById('msg-input-' + telefono)?.focus()
}
window.cancelarReply = (telefono) => {
  delete window._replyContext[telefono]
  const ctx = document.getElementById('reply-context-' + telefono)
  if (ctx) ctx.style.display = 'none'
}

window.marcarNoLeido = async (telefono) => {
  try {
    await fetch(API + '/chatbot/chats/' + telefono + '/no-leido', { method: 'PATCH' })
    // Reflejar visualmente en sidebar
    const item = document.querySelector(`[data-tel="${telefono}"]`)
    if (item && !item.querySelector('.wa-unread')) {
      const badge = document.createElement('span')
      badge.className = 'wa-unread'
      badge.textContent = '!'
      item.appendChild(badge)
    }
  } catch(e) {}
}

window.subirImagenWA = async (telefono, input) => {
  const file = input.files[0]
  if (!file) return
  input.value = ''
  const agente = window._empleadoActual?.nombre || 'Admin'
  const btn = document.querySelector('.wa-send-btn')
  if (btn) { btn.disabled = true; btn.style.opacity = '0.5' }
  try {
    // Subir a Supabase storage via endpoint existente
    const formData = new FormData()
    formData.append('file', file)
    const uploadRes = await fetch(API + '/imagenes/upload-temp', { method: 'POST', body: formData })
    const uploadData = await uploadRes.json()
    const imagen_url = uploadData.url || uploadData.public_url
    if (!imagen_url) throw new Error('No se obtuvo URL')
    await fetch(API + '/chatbot/chats/' + telefono + '/imagen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imagen_url, caption: '', agente })
    })
    await window._recargarChats()
    abrirChat(telefono)
  } catch(e) {
    alert('Error subiendo imagen: ' + e.message)
  } finally {
    if (btn) { btn.disabled = false; btn.style.opacity = '1' }
  }
}

window.subirDocumentoWA = async (telefono, input) => {
  const file = input.files[0]
  if (!file) return
  input.value = ''
  const agente = window._empleadoActual?.nombre || 'Admin'
  try {
    const formData = new FormData()
    formData.append('file', file)
    const uploadRes = await fetch(API + '/imagenes/upload-temp', { method: 'POST', body: formData })
    const uploadData = await uploadRes.json()
    const doc_url = uploadData.url || uploadData.public_url
    if (!doc_url) throw new Error('No se obtuvo URL')
    await fetch(API + '/chatbot/chats/' + telefono + '/documento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doc_url, filename: file.name, caption: '', agente })
    })
    await window._recargarChats()
    abrirChat(telefono)
  } catch(e) {
    alert('Error enviando documento: ' + e.message)
  }
}

window.subirVideoWA = async (telefono, input) => {
  const file = input.files[0]
  if (!file) return
  input.value = ''
  const agente = window._empleadoActual?.nombre || 'Admin'
  try {
    const formData = new FormData()
    formData.append('file', file)
    const uploadRes = await fetch(API + '/imagenes/upload-temp', { method: 'POST', body: formData })
    const uploadData = await uploadRes.json()
    const video_url = uploadData.url || uploadData.public_url
    if (!video_url) throw new Error('No se obtuvo URL')
    await fetch(API + '/chatbot/chats/' + telefono + '/video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ video_url, caption: '', agente })
    })
    await window._recargarChats()
    abrirChat(telefono)
  } catch(e) {
    alert('Error enviando video: ' + e.message)
  }
}

window.enviarUbicacionWA = async (telefono) => {
  const agente = window._empleadoActual?.nombre || 'Admin'
  // Coordenadas de Zapatillas May en León, Guanajuato
  const lat = '21.1250'
  const lng = '-101.6860'
  const nombre = 'Zapatillas May'
  const direccion = 'León, Guanajuato, México'
  try {
    const r = await fetch(API + '/chatbot/chats/' + telefono + '/ubicacion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lng, nombre, direccion, agente })
    })
    if (!r.ok) throw new Error('Error ' + r.status)
    await window._recargarChats()
    abrirChat(telefono)
  } catch(e) {
    alert('Error enviando ubicación: ' + e.message)
  }
}

window.mostrarEnviarContactoWA = (telefono) => {
  const existente = document.getElementById('modal-contacto-wa')
  if (existente) existente.remove()
  const m = document.createElement('div')
  m.id = 'modal-contacto-wa'
  m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:9999;display:flex;align-items:center;justify-content:center'
  m.innerHTML = `
    <div style="background:#fff;border-radius:16px;padding:28px 24px;width:340px;max-width:95vw;box-shadow:0 20px 60px rgba(0,0,0,0.2)">
      <h3 style="margin:0 0 16px;font-size:1rem;color:#0f172a">Enviar contacto por WhatsApp</h3>
      <div style="display:flex;flex-direction:column;gap:10px">
        <input id="cwa-nombre" placeholder="Nombre" value="Zapatillas May"
               style="border:1px solid #e2e8f0;border-radius:8px;padding:9px 12px;font-size:0.9rem;outline:none">
        <input id="cwa-tel" placeholder="Teléfono (ej: 4771234567)"
               style="border:1px solid #e2e8f0;border-radius:8px;padding:9px 12px;font-size:0.9rem;outline:none">
        <input id="cwa-empresa" placeholder="Empresa (opcional)" value="Zapatillas May"
               style="border:1px solid #e2e8f0;border-radius:8px;padding:9px 12px;font-size:0.9rem;outline:none">
      </div>
      <div style="display:flex;gap:10px;margin-top:18px">
        <button onclick="document.getElementById('modal-contacto-wa').remove()"
                style="flex:1;padding:10px;border:1px solid #e2e8f0;border-radius:8px;background:#fff;cursor:pointer;font-size:0.9rem;color:#64748b">
          Cancelar
        </button>
        <button onclick="enviarContactoWA('${telefono}')"
                style="flex:1;padding:10px;border:none;border-radius:8px;background:#E91E8C;color:#fff;cursor:pointer;font-size:0.9rem;font-weight:600">
          Enviar
        </button>
      </div>
    </div>`
  document.body.appendChild(m)
  m.addEventListener('click', e => { if(e.target===m) m.remove() })
  setTimeout(() => document.getElementById('cwa-tel')?.focus(), 50)
}

window.enviarContactoWA = async (telefono) => {
  const nombre = document.getElementById('cwa-nombre')?.value.trim() || 'Zapatillas May'
  const tel_c  = document.getElementById('cwa-tel')?.value.trim() || ''
  const empresa= document.getElementById('cwa-empresa')?.value.trim() || ''
  const agente = window._empleadoActual?.nombre || 'Admin'
  if (!tel_c) { alert('Ingresa el número de teléfono del contacto'); return }
  document.getElementById('modal-contacto-wa')?.remove()
  try {
    const r = await fetch(API + '/chatbot/chats/' + telefono + '/contacto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, telefono_contacto: tel_c, empresa, agente })
    })
    if (!r.ok) throw new Error('Error ' + r.status)
    await window._recargarChats()
    abrirChat(telefono)
  } catch(e) {
    alert('Error enviando contacto: ' + e.message)
  }
}

// ── Modal: Botones interactivos ────────────────────────────────────
window.mostrarModalBotones = (telefono) => {
  const m = _crearModalWA('modal-botones-wa', `
    <h3 style="margin:0 0 14px;font-size:1rem;color:#0f172a">Enviar botones interactivos</h3>
    <div style="display:flex;flex-direction:column;gap:8px">
      <input id="mbt-encabezado" placeholder="Encabezado (opcional)" style="${_inputStyle()}">
      <textarea id="mbt-cuerpo" placeholder="Mensaje principal *" rows="2" style="${_inputStyle()};resize:none"></textarea>
      <input id="mbt-btn1" placeholder="Botón 1 (opcional, máx 20 chars)" style="${_inputStyle()}">
      <input id="mbt-btn2" placeholder="Botón 2 (opcional, máx 20 chars)" style="${_inputStyle()}">
      <p style="font-size:0.75rem;color:#94a3b8;margin:0">Se agrega automáticamente: <strong>Hablar con asesor</strong></p>
    </div>
    <div style="display:flex;gap:8px;margin-top:16px">
      <button onclick="document.getElementById('modal-botones-wa').remove()" style="${_btnSecStyle()}">Cancelar</button>
      <button onclick="_enviarBotonesWA('${telefono}')" style="${_btnPrimStyle()}">Enviar</button>
    </div>`)
  document.body.appendChild(m)
  setTimeout(() => document.getElementById('mbt-cuerpo')?.focus(), 50)
}

window._enviarBotonesWA = async (telefono) => {
  const cuerpo = document.getElementById('mbt-cuerpo')?.value.trim()
  if (!cuerpo) { alert('Escribe el mensaje principal'); return }
  const encabezado = document.getElementById('mbt-encabezado')?.value.trim() || ''
  const btn1 = document.getElementById('mbt-btn1')?.value.trim() || ''
  const btn2 = document.getElementById('mbt-btn2')?.value.trim() || ''
  const botones = [btn1, btn2].filter(Boolean)
  const agente = window._empleadoActual?.nombre || 'Admin'
  document.getElementById('modal-botones-wa')?.remove()
  try {
    await fetch(API + '/chatbot/chats/' + telefono + '/botones', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cuerpo, encabezado, botones, agente })
    })
    await window._recargarChats(); abrirChat(telefono)
  } catch(e) { alert('Error: ' + e.message) }
}

// ── Modal: Lista interactiva ───────────────────────────────────────
window.mostrarModalLista = (telefono) => {
  const m = _crearModalWA('modal-lista-wa', `
    <h3 style="margin:0 0 14px;font-size:1rem;color:#0f172a">Enviar lista interactiva</h3>
    <div style="display:flex;flex-direction:column;gap:8px">
      <textarea id="mlt-cuerpo" placeholder="Mensaje principal *" rows="2" style="${_inputStyle()};resize:none"></textarea>
      <input id="mlt-boton" placeholder="Texto del botón (ej: Ver opciones)" style="${_inputStyle()}">
      <textarea id="mlt-opciones" placeholder="Opciones (una por línea, máx 10)&#10;ej:&#10;Tenis&#10;Sandalias&#10;Tacones" rows="5" style="${_inputStyle()};resize:none"></textarea>
    </div>
    <div style="display:flex;gap:8px;margin-top:16px">
      <button onclick="document.getElementById('modal-lista-wa').remove()" style="${_btnSecStyle()}">Cancelar</button>
      <button onclick="_enviarListaWA('${telefono}')" style="${_btnPrimStyle()}">Enviar</button>
    </div>`)
  document.body.appendChild(m)
  setTimeout(() => document.getElementById('mlt-cuerpo')?.focus(), 50)
}

window._enviarListaWA = async (telefono) => {
  const cuerpo = document.getElementById('mlt-cuerpo')?.value.trim()
  if (!cuerpo) { alert('Escribe el mensaje'); return }
  const titulo_boton = document.getElementById('mlt-boton')?.value.trim() || 'Ver opciones'
  const lineas = (document.getElementById('mlt-opciones')?.value || '').split('\n').map(l=>l.trim()).filter(Boolean).slice(0,10)
  if (!lineas.length) { alert('Agrega al menos una opción'); return }
  const agente = window._empleadoActual?.nombre || 'Admin'
  document.getElementById('modal-lista-wa')?.remove()
  const secciones = [{ titulo: 'Opciones', opciones: lineas.map((l,i) => ({ id: `op_${i}`, titulo: l })) }]
  try {
    await fetch(API + '/chatbot/chats/' + telefono + '/lista', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cuerpo, titulo_boton, secciones, agente })
    })
    await window._recargarChats(); abrirChat(telefono)
  } catch(e) { alert('Error: ' + e.message) }
}

// ── Modal: Carrusel — búsqueda + expand por modelo ─────────────────
window.mostrarModalCarrusel = async (telefono) => {
  const m = _crearModalWA('modal-carrusel-wa', `
    <h3 style="margin:0 0 4px;font-size:1rem;color:#0f172a">Enviar fotos de productos</h3>
    <p style="margin:0 0 8px;font-size:0.75rem;color:#94a3b8">Busca un modelo y tócalo para ver sus colores</p>
    <input id="mcr-cuerpo" placeholder="Mensaje intro" value="Mira estos modelos 👠" style="${_inputStyle()};margin-bottom:6px">
    <input id="mcr-search" placeholder="🔍 Buscar modelo..." oninput="window._mcrFiltrar()" style="${_inputStyle()};margin-bottom:6px">
    <div id="mcr-loading" style="text-align:center;padding:16px;color:#94a3b8;font-size:0.82rem">Cargando...</div>
    <div id="mcr-modelos" style="max-height:270px;overflow-y:auto;display:none;border:1px solid #e2e8f0;border-radius:8px"></div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
      <label style="display:flex;align-items:center;gap:5px;font-size:0.75rem;color:#475569;cursor:pointer">
        <input type="checkbox" id="mcr-incluir-precios" style="width:12px;height:12px">
        Incluir precios en las fotos
      </label>
      <span id="mcr-contador" style="font-size:0.72rem;color:#94a3b8">0/10 fotos</span>
    </div>
    <div style="display:flex;gap:8px;margin-top:8px">
      <button onclick="document.getElementById('modal-carrusel-wa').remove()" style="${_btnSecStyle()}">Cancelar</button>
      <button onclick="_enviarCarruselWA('${telefono}')" style="${_btnPrimStyle()}">Enviar fotos</button>
    </div>`)
  document.body.appendChild(m)

  try {
    const prods = window._productosWA || []
    const varsRes = await fetch(API + '/variantes/?activa=eq.true&select=id,producto_id,color,foto_url,imagenes,color_hex')
    const vars = await varsRes.json()

    // Construir mapa producto → variantes únicas con foto
    window._mcrDatos = prods.map(p => {
      const varsP = vars.filter(v => v.producto_id === p.id)
      const coloresSeen = new Set()
      const variantes = []
      varsP.forEach(v => {
        if (coloresSeen.has(v.color)) return
        coloresSeen.add(v.color)
        const img = v.foto_url || (v.imagenes && v.imagenes[0]) || p.imagen_principal || ''
        if (img) variantes.push({ img, color: v.color || 'Sin color', color_hex: v.color_hex || '' })
      })
      if (!variantes.length && p.imagen_principal)
        variantes.push({ img: p.imagen_principal, color: 'Color único', color_hex: '' })

      const lineasPrecio = []
      if (p.precio_menudeo)  lineasPrecio.push('Par: $' + p.precio_menudeo)
      if (p.precio_mayoreo3) lineasPrecio.push('3+: $' + p.precio_mayoreo3)
      if (p.precio_mayoreo6) lineasPrecio.push('6+: $' + p.precio_mayoreo6)
      if (p.corrida_activa && p.precio_corrida) lineasPrecio.push('Corrida: $' + p.precio_corrida)

      return { id: p.id, nombre: p.nombre, preciosStr: lineasPrecio.join(' · '), variantes }
    }).filter(p => p.variantes.length)

    document.getElementById('mcr-loading').style.display = 'none'
    document.getElementById('mcr-modelos').style.display = 'block'
    window._mcrFiltrar()
    setTimeout(() => document.getElementById('mcr-search')?.focus(), 50)
  } catch(e) {
    const el = document.getElementById('mcr-loading')
    if (el) el.textContent = 'Error: ' + e.message
  }
}

// _mcrSel: Set de claves "img|||texto|||precios" para persistir selección entre búsquedas
window._mcrSel = new Map() // key=img -> { img, texto, precios }

window._mcrFiltrar = () => {
  const q = (document.getElementById('mcr-search')?.value || '').toLowerCase().trim()
  const datos = (window._mcrDatos || []).filter(p => !q || p.nombre.toLowerCase().includes(q))
  const cont = document.getElementById('mcr-modelos')
  if (!cont) return
  if (!datos.length) { cont.innerHTML = '<p style="padding:12px;color:#94a3b8;font-size:0.82rem;text-align:center">Sin resultados</p>'; return }
  cont.innerHTML = datos.map(p => {
    const selCount = p.variantes.filter(v => window._mcrSel.has(v.img)).length
    return `
    <div style="border-bottom:1px solid #f1f5f9">
      <div onclick="window._mcrToggle('${p.id}')" style="display:flex;align-items:center;gap:8px;padding:9px 10px;cursor:pointer;user-select:none">
        <span id="mcr-arrow-${p.id}" style="font-size:0.65rem;color:#94a3b8;transition:transform 0.15s;display:inline-block">▶</span>
        <span style="flex:1;font-size:0.85rem;font-weight:600;color:#0f172a">${p.nombre}</span>
        <span style="font-size:0.7rem;color:${selCount ? '#E91E8C' : '#94a3b8'}">${selCount ? selCount + ' sel · ' : ''}${p.variantes.length} color${p.variantes.length !== 1 ? 'es' : ''}</span>
      </div>
      <div id="mcr-vars-${p.id}" style="display:none;padding:0 10px 10px 28px">
        ${p.variantes.map(v => `
          <label style="display:flex;align-items:center;gap:8px;padding:4px 0;cursor:pointer;font-size:0.82rem">
            <input type="checkbox" class="mcr-check"
              data-img="${v.img}"
              data-texto="${p.nombre} · ${v.color}"
              data-precios="${p.preciosStr}"
              ${window._mcrSel.has(v.img) ? 'checked' : ''}
              onchange="window._mcrCambio(this)"
              style="width:14px;height:14px;flex-shrink:0">
            <img src="${v.img}" style="width:40px;height:40px;border-radius:6px;object-fit:cover;flex-shrink:0;background:#f1f5f9">
            <span>${v.color}</span>
          </label>`).join('')}
      </div>
    </div>`
  }).join('')
}

window._mcrCambio = (cb) => {
  if (cb.checked) {
    window._mcrSel.set(cb.dataset.img, { img: cb.dataset.img, texto: cb.dataset.texto, precios: cb.dataset.precios })
  } else {
    window._mcrSel.delete(cb.dataset.img)
  }
  window._mcrContador()
  // Actualizar badge del modelo sin re-renderizar todo
  const vars = cb.closest('[id^="mcr-vars-"]')
  if (vars) {
    const prodId = vars.id.replace('mcr-vars-', '')
    const prod = (window._mcrDatos || []).find(p => String(p.id) === prodId)
    if (prod) {
      const selCount = prod.variantes.filter(v => window._mcrSel.has(v.img)).length
      const badge = vars.previousElementSibling?.querySelector('span:last-child')
      if (badge) { badge.textContent = (selCount ? selCount + ' sel · ' : '') + prod.variantes.length + ' color' + (prod.variantes.length !== 1 ? 'es' : ''); badge.style.color = selCount ? '#E91E8C' : '#94a3b8' }
    }
  }
}

window._mcrToggle = (id) => {
  const panel = document.getElementById('mcr-vars-' + id)
  const arrow = document.getElementById('mcr-arrow-' + id)
  if (!panel) return
  const open = panel.style.display === 'block'
  panel.style.display = open ? 'none' : 'block'
  if (arrow) arrow.style.transform = open ? '' : 'rotate(90deg)'
}

window._mcrContador = () => {
  const n = window._mcrSel.size
  const el = document.getElementById('mcr-contador')
  if (el) { el.textContent = n + '/10 fotos'; el.style.color = n >= 10 ? '#ef4444' : '#94a3b8' }
}

window._enviarCarruselWA = async (telefono) => {
  const cuerpo = document.getElementById('mcr-cuerpo')?.value.trim() || 'Mira estos modelos'
  const seleccionados = [...window._mcrSel.values()]
  if (!seleccionados.length) { alert('Selecciona al menos una foto'); return }
  if (seleccionados.length > 10) { alert('Máximo 10 fotos'); return }
  const agente = window._empleadoActual?.nombre || 'Admin'
  const incluirPrecios = document.getElementById('mcr-incluir-precios')?.checked || false
  const tarjetas = seleccionados.map(s => ({
    imagen_url: s.img,
    texto: s.texto + (incluirPrecios && s.precios ? '\n' + s.precios : '')
  }))
  document.getElementById('modal-carrusel-wa')?.remove()
  try {
    await fetch(API + '/chatbot/chats/' + telefono + '/carrusel', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cuerpo, tarjetas, agente })
    })
    await window._recargarChats(); abrirChat(telefono)
  } catch(e) { alert('Error: ' + e.message) }
}

// ── Helpers de estilo para modales ─────────────────────────────────
function _crearModalWA(id, contenido) {
  const existente = document.getElementById(id); if (existente) existente.remove()
  const m = document.createElement('div')
  m.id = id
  m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:9999;display:flex;align-items:center;justify-content:center'
  m.innerHTML = `<div style="background:#fff;border-radius:16px;padding:24px;width:360px;max-width:95vw;box-shadow:0 20px 60px rgba(0,0,0,0.2)">${contenido}</div>`
  m.addEventListener('click', e => { if (e.target === m) m.remove() })
  return m
}
function _inputStyle() { return 'border:1px solid #e2e8f0;border-radius:8px;padding:9px 12px;font-size:0.85rem;outline:none;width:100%;box-sizing:border-box;font-family:inherit' }
function _btnSecStyle() { return 'flex:1;padding:10px;border:1px solid #e2e8f0;border-radius:8px;background:#fff;cursor:pointer;font-size:0.9rem;color:#64748b;font-family:inherit' }
function _btnPrimStyle() { return 'flex:1;padding:10px;border:none;border-radius:8px;background:#E91E8C;color:#fff;cursor:pointer;font-size:0.9rem;font-weight:600;font-family:inherit' }

window.cambiarEtiqueta = async (telefono, etiqueta) => {
  try {
    await fetch(API + '/chatbot/chats/' + telefono + '/etiqueta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ etiqueta })
    })
    if (window._chatsData[telefono]) {
      window._chatsData[telefono].etiqueta = etiqueta
    }
  } catch(e) {
    alert('Error guardando etiqueta')
  }
}


window.toggleControl = async (telefono, enControl) => {
  const agente = window._empleadoActual?.nombre || 'Admin'
  try {
    const res = await fetch(API + '/chatbot/chats/' + telefono + '/control', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ en_control: enControl, agente })
    })
    const data = await res.json()
    if (data.ok) {
      // Actualizar localmente sin recargar
      if (window._chatsData[telefono]) {
        window._chatsData[telefono].en_control = enControl
        window._chatsData[telefono].agente = agente
      }
      abrirChat(telefono)
    }
  } catch(e) {
    alert('Error cambiando control')
  }
}


window.mostrarCatalogoWA = (telefono) => {
  const productos = window._productosWA || []
  const modal = document.createElement('div')
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem'
  modal.innerHTML = `
    <div style="background:white;border-radius:16px;max-width:600px;width:100%;max-height:80vh;overflow:hidden;display:flex;flex-direction:column">
      <div style="padding:1rem 1.5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
        <p style="font-weight:700">👠 Selecciona un producto</p>
        <button onclick="this.closest('div[style*=fixed]').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:#888">✕</button>
      </div>
      <input class="form-input" placeholder="Buscar producto..." style="margin:1rem;font-size:0.85rem" oninput="filtrarProductosWA(this.value)">
      <div id="productos-wa-lista" style="overflow-y:auto;padding:0 1rem 1rem">
        ${productos.filter(p => p.activo).map(p => `
  <div onclick="enviarProductoWA('${telefono}', '${(p.imagen_principal||"").replace(/'/g,"")}', window._buildCaption('${p.id}'))"
       style="display:flex;align-items:center;gap:12px;padding:10px;border:1px solid #eee;border-radius:8px;margin-bottom:8px;cursor:pointer;transition:background 0.15s"
       onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
    ${p.imagen_principal ? `<img src="${p.imagen_principal}" style="width:52px;height:52px;object-fit:contain;border-radius:6px;background:#f5f5f5;flex-shrink:0">` : '<div style="width:52px;height:52px;background:#f5f5f5;border-radius:6px;flex-shrink:0;display:flex;align-items:center;justify-content:center">👠</div>'}
    <div style="flex:1">
      <p style="font-weight:600;font-size:0.88rem">${p.nombre}</p>
      <p style="font-size:0.75rem;color:#888">$${p.precio_menudeo} menudeo · $${p.precio_mayoreo3 || (p.precio_menudeo-30)} mayoreo</p>
    </div>
    <span style="font-size:0.75rem;color:#25D366;font-weight:600">Enviar →</span>
  </div>
`).join('')}
      </div>
    </div>
  `
  document.body.appendChild(modal)
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove() })
}


window.filtrarProductosWA = (texto) => {
  document.querySelectorAll('#productos-wa-lista > div').forEach(el => {
    el.style.display = !texto || el.textContent.toLowerCase().includes(texto.toLowerCase()) ? '' : 'none'
  })
}
window._buildCaption = (id) => {
  const p = (window._productosWA || []).find(x => x.id === id)
  if (!p) return ''
  return '👠 *' + p.nombre + '*\n\n💰 *Precios:*\n• Menudeo (1-2 pares): $' + p.precio_menudeo +
    '\n• Mayoreo 3-5 pares: $' + (p.precio_mayoreo3 || (p.precio_menudeo - 30)) +
    '\n• Mayoreo 6+ pares: $' + (p.precio_mayoreo6 || (p.precio_menudeo - 70)) +
    '\n• Corrida completa: $' + (p.precio_corrida || (p.precio_menudeo - 100)) +
    '\n\n🛍️ Ver y comprar: https://zapatillasmay.mx'
}


window.enviarProductoWA = async (telefono, imagenUrl, caption) => {
  console.log('imagenUrl:', imagenUrl, 'caption:', caption)
  const modalWA = document.querySelector('div[style*="position:fixed"][style*="z-index:1000"]')
if (modalWA) modalWA.remove()
  console.log('enviando a:', telefono, imagenUrl)
  const agente = window._empleadoActual?.nombre || 'Admin'
  try {
    if (imagenUrl) {
      const captionReal = caption.replace(/\\n/g, '\n')
      await fetch(API + '/chatbot/chats/' + telefono + '/imagen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagen_url: imagenUrl, caption: captionReal, agente })
      })
    } else {
      await fetch(API + '/chatbot/chats/' + telefono + '/mensaje', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: caption, agente })
      })
    }
    await new Promise(r => setTimeout(r, 1500))
    await window._recargarChats()
    abrirChat(telefono)
  } catch(e) {
    alert('Error enviando producto')
  }
}


window.switchTipoEnvio = function(tipo, btn) {
  // Tabs
  const tabs = ['campana','catalogo','fotos']
  tabs.forEach(t => {
    const b = document.getElementById(`tab-envio-${t}`)
    const p = document.getElementById(`panel-envio-${t}`)
    if (!b || !p) return
    if (t === tipo) {
      b.style.background = '#E91E8C'; b.style.color = '#fff'; b.style.borderColor = '#E91E8C'
      p.style.display = 'block'
    } else {
      b.style.background = '#fff'; b.style.color = '#374151'; b.style.borderColor = '#e5e7eb'
      p.style.display = 'none'
    }
  })
}

window.cargarEnviosMasivos = async function() {
  const content = document.getElementById('content')
  content.innerHTML = '<p style="padding:2rem;color:#888">Cargando...</p>'
  try {
    const [resPlantillas, resClientes] = await Promise.all([
      fetch(API + '/chatbot/plantillas').then(r => r.json()),
      fetch(API + '/clientes/').then(r => r.json()),
    ])

    if (resPlantillas.error) {
      content.innerHTML = `<div style="padding:2rem;color:#c62828;background:#ffebee;border-radius:12px;margin:1rem">
        ❌ <strong>Error al cargar plantillas:</strong> ${resPlantillas.error}
        <p style="font-size:0.82rem;margin-top:8px;color:#666">Verifica que <code>WHATSAPP_WABA_ID</code> esté configurado en Railway.</p>
      </div>`
      return
    }

    const plantillas = Array.isArray(resPlantillas) ? resPlantillas : []
    window._envioPlantillas = plantillas

    const clientes = Array.isArray(resClientes) ? resClientes.filter(c => c.telefono) : []
    window._envioClientes = clientes
    window._envioContactos = clientes.map(c => ({ telefono: c.telefono, nombre: c.nombre, tipo: c.tipo, fuente: 'cliente' }))

    window._envioSeleccionados = new Set(window._envioContactos.map(c => c.telefono))
    window._envioContactosVisibles = [...window._envioContactos]

    const renderContactos = (lista) => lista.map(c => {
      const sel = window._envioSeleccionados?.has(c.telefono)
      return `<label style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;cursor:pointer;border:1.5px solid ${sel ? '#E91E8C' : '#f0f0f0'};background:${sel ? '#fff0f8' : 'white'}" id="envio-row-${c.telefono.replace(/\D/g,'')}">
        <input type="checkbox" ${sel ? 'checked' : ''} onchange="toggleEnvioContacto('${c.telefono}',this)"
          style="accent-color:#E91E8C;width:15px;height:15px;flex-shrink:0">
        <div style="width:28px;height:28px;border-radius:50%;background:#E91E8C;display:flex;align-items:center;justify-content:center;color:white;font-size:0.75rem;font-weight:700;flex-shrink:0">
          ${(c.nombre||'?').charAt(0).toUpperCase()}
        </div>
        <div style="flex:1;min-width:0">
          <p style="font-size:0.82rem;font-weight:600;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.nombre || c.telefono}</p>
          <p style="font-size:0.72rem;color:#888;margin:0">${c.telefono}${c.tipo ? ' · ' + c.tipo : ''}</p>
        </div>
      </label>`
    }).join('')

    content.innerHTML = `
      <div style="max-width:960px">
        <div style="margin-bottom:1.5rem">
          <p style="font-size:0.72rem;font-weight:600;letter-spacing:0.08em;color:#E91E8C;text-transform:uppercase;margin:0 0 3px">WhatsApp Cloud API</p>
          <h2 style="font-size:1.25rem;font-weight:700;color:#0f172a;margin:0 0 4px">Envíos masivos</h2>
          <p style="color:#94a3b8;font-size:0.78rem;margin:0">${clientes.length} clientes con teléfono registrado</p>
        </div>

        <!-- Selector de tipo de envío -->
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:1.5rem">
          <button onclick="switchTipoEnvio('campana',this)" id="tab-envio-campana"
            style="padding:14px 10px;border-radius:12px;border:2px solid #E91E8C;background:#E91E8C;color:#fff;font-size:0.82rem;font-weight:700;cursor:pointer;text-align:center;line-height:1.4">
            📣 Campaña<br>
            <span style="font-size:0.68rem;font-weight:400;opacity:0.9">Cualquier cliente · sin restricción</span>
          </button>
          <button onclick="switchTipoEnvio('catalogo',this)" id="tab-envio-catalogo"
            style="padding:14px 10px;border-radius:12px;border:2px solid #e5e7eb;background:#fff;color:#374151;font-size:0.82rem;font-weight:600;cursor:pointer;text-align:center;line-height:1.4">
            🛍️ Catálogo<br>
            <span style="font-size:0.68rem;font-weight:400;color:#888">Muestra productos del catálogo</span>
          </button>
          <button onclick="switchTipoEnvio('fotos',this)" id="tab-envio-fotos"
            style="padding:14px 10px;border-radius:12px;border:2px solid #e5e7eb;background:#fff;color:#374151;font-size:0.82rem;font-weight:600;cursor:pointer;text-align:center;line-height:1.4">
            📸 Fotos variantes<br>
            <span style="font-size:0.68rem;font-weight:400;color:#c2410c">Solo si cliente escribió hoy</span>
          </button>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem">

          <!-- COLUMNA IZQUIERDA: configuración -->
          <div>
            <!-- Panel campaña -->
            <div id="panel-envio-campana">
            <!-- Plantilla -->
            <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem;margin-bottom:1rem">
              <p style="font-size:0.7rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:#94a3b8;margin-bottom:10px">1 · Plantilla</p>
              ${plantillas.length === 0
                ? '<p style="color:#888;font-size:0.85rem">No hay plantillas aprobadas en tu cuenta de Meta.</p>'
                : plantillas.map(p => {
                    const bodyComp = (p.components || []).find(c => c.type === 'BODY')
                    const preview = bodyComp?.text?.substring(0, 55) || ''
                    const cat = (p.category || '').toUpperCase()
                    const isUtility = cat === 'UTILITY' || cat === 'AUTHENTICATION'
                    const catBadge = isUtility
                      ? `<span style="background:#dcfce7;color:#15803d;border-radius:4px;padding:1px 6px;font-size:0.65rem;font-weight:700">UTILITY · sin restricción</span>`
                      : `<span style="background:#fff3cd;color:#92400e;border-radius:4px;padding:1px 6px;font-size:0.65rem;font-weight:700">MARKETING · solo 24h</span>`
                    return `<label style="display:block;cursor:pointer;padding:10px 12px;border-radius:8px;border:2px solid #eee;margin-bottom:6px;transition:all 0.15s"
                      onmouseover="this.style.borderColor='#E91E8C'" onmouseout="if(!document.getElementById('plt-${p.name}').checked)this.style.borderColor='#eee'">
                      <div style="display:flex;align-items:flex-start;gap:8px">
                        <input type="radio" name="envio-plantilla-radio" id="plt-${p.name}" value="${p.name}" data-idioma="${p.language}"
                          onchange="onCambiarPlantillaEnvio('${p.name}','${p.language}')" style="accent-color:#E91E8C;margin-top:2px;flex-shrink:0">
                        <div style="min-width:0">
                          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:2px">
                            <p style="font-size:0.85rem;font-weight:600;margin:0">${p.name}</p>
                            ${catBadge}
                          </div>
                          <p style="font-size:0.7rem;color:#888;margin:0">${p.language}${preview ? ' · ' + preview + '…' : ''}</p>
                        </div>
                      </div>
                    </label>`
                  }).join('')
              }

              <!-- Vista previa de la plantilla seleccionada -->
              <div id="plantilla-preview-box" style="display:none;margin-top:1rem;padding-top:1rem;border-top:1px solid #f0f0f0">
                <p style="font-size:0.75rem;font-weight:700;color:#888;text-transform:uppercase;margin-bottom:8px">Vista previa del mensaje</p>
                <div style="background:#e5ddd5;border-radius:10px;padding:10px;min-height:60px">
                  <div id="plantilla-preview-burbuja" style="background:white;border-radius:8px 8px 8px 2px;padding:10px 12px;max-width:85%;font-size:0.82rem;line-height:1.55;color:#333;box-shadow:0 1px 2px rgba(0,0,0,0.1);white-space:pre-wrap"></div>
                </div>
                <p style="font-size:0.7rem;color:#aaa;margin-top:6px">Las variables como <code>{{1}}</code> se reemplazan con el nombre del cliente al enviar.</p>
              </div>
            </div>

            <!-- Imagen: selector de modelo + variante -->
            <div id="envio-seccion-foto" style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem;margin-bottom:1rem">
              <p style="font-size:0.7rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:#94a3b8;margin-bottom:8px">2 · Foto del modelo <span style="font-weight:400;color:#cbd5e1;text-transform:none;letter-spacing:0">(solo plantillas con imagen)</span></p>

              <!-- Búsqueda de modelo -->
              <input type="text" id="envio-modelo-buscar" placeholder="🔍 Buscar modelo por nombre..."
                oninput="filtrarModelosEnvio(this.value)"
                style="width:100%;padding:7px 10px;border:1.5px solid #eee;border-radius:8px;font-size:0.82rem;font-family:inherit;outline:none;box-sizing:border-box;margin-bottom:6px">
              <div id="envio-modelos-lista" style="max-height:140px;overflow-y:auto;border:1px solid #eee;border-radius:8px;margin-bottom:10px">
                <p style="padding:10px 12px;font-size:0.8rem;color:#aaa">Escribe para buscar un modelo...</p>
              </div>

              <!-- Variantes del modelo seleccionado -->
              <div id="envio-variantes-panel" style="display:none">
                <p id="envio-variantes-titulo" style="font-size:0.75rem;font-weight:700;color:#888;text-transform:uppercase;margin-bottom:6px"></p>
                <div id="envio-variantes-grid" style="display:flex;flex-direction:column;gap:5px;max-height:200px;overflow-y:auto"></div>
              </div>

              <!-- Foto seleccionada -->
              <div id="envio-foto-seleccionada" style="display:none;margin-top:10px;border-radius:10px;overflow:hidden;border:2px solid #E91E8C;position:relative">
                <img id="envio-foto-img" src="" style="width:100%;height:120px;object-fit:cover">
                <div style="position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,0.5);padding:4px 8px;display:flex;justify-content:space-between;align-items:center">
                  <span id="envio-foto-label" style="font-size:0.75rem;color:white;font-weight:600"></span>
                  <button onclick="quitarFotoEnvio()" style="background:none;border:none;color:white;cursor:pointer;font-size:0.9rem;padding:0">✕</button>
                </div>
              </div>

              <input type="hidden" id="envio-imagen">
            </div>

            <!-- Audiencia -->
            <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem;margin-bottom:1rem">
              <p style="font-size:0.7rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:#94a3b8;margin-bottom:10px">3 · Audiencia</p>
              <select id="envio-filtro" class="form-input" onchange="filtrarAudienciaEnvio()">
                <option value="todos">Todos los clientes</option>
                <option value="mayoreo">Solo Mayoreo</option>
                <option value="zapateria">Solo Zapaterías</option>
                <option value="menudeo">Solo Menudeo</option>
              </select>
            </div>

            <!-- Botón enviar -->
            <div id="envio-resultado" style="display:none;border-radius:10px;padding:1rem;margin-bottom:1rem;border:1px solid #a5d6a7;background:#e8f5e9"></div>
            <button id="btn-enviar-masivo" onclick="iniciarEnvioMasivo()" class="btn btn-primary" style="width:100%;padding:12px">
              📣 Enviar campaña
            </button>
            <p style="font-size:0.72rem;color:#aaa;text-align:center;margin-top:8px">Solo plantillas aprobadas por Meta. No arriesga el número de teléfono.</p>

            <div style="margin-top:1rem;padding-top:1rem;border-top:1px dashed #eee">
              <p style="font-size:0.75rem;font-weight:700;color:#888;margin-bottom:6px">🔧 Diagnóstico</p>
              <div style="display:flex;gap:6px;flex-wrap:wrap">
                <input type="text" id="diag-tel" class="form-input" placeholder="Tu teléfono (52...)" style="flex:1;min-width:140px;font-size:0.8rem">
                <button onclick="ejecutarDiagnostico()" class="btn btn-secondary" style="font-size:0.78rem;white-space:nowrap">Probar envío</button>
                <button onclick="ejecutarDebugPlantillas()" class="btn btn-secondary" style="font-size:0.78rem;white-space:nowrap">Ver estructura</button>
              </div>
              <div id="diag-resultado" style="display:none;margin-top:8px;padding:10px;background:#f9f9f9;border-radius:8px;font-size:0.75rem;font-family:monospace;white-space:pre-wrap;color:#333;max-height:260px;overflow-y:auto"></div>
            </div>
          </div>
          </div><!-- fin panel-envio-campana -->

          <!-- COLUMNA DERECHA: destinatarios -->
          <div>
          <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem;margin-bottom:1rem">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
              <h3 style="font-size:0.95rem;font-weight:700">👥 Destinatarios</h3>
              <span id="envio-count" style="background:#E91E8C;color:white;border-radius:100px;padding:2px 10px;font-size:0.75rem">${clientes.length} seleccionados</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
              <input type="text" id="envio-buscador" placeholder="🔍 Buscar..." oninput="buscarContactosEnvio(this.value)"
                style="flex:1;padding:7px 10px;border:1px solid #eee;border-radius:8px;font-size:0.82rem;font-family:inherit;outline:none;box-sizing:border-box">
              <label style="display:flex;align-items:center;gap:5px;font-size:0.78rem;color:#555;cursor:pointer;white-space:nowrap;flex-shrink:0">
                <input type="checkbox" id="envio-sel-todos" checked onchange="toggleSelTodosEnvio(this.checked)" style="accent-color:#E91E8C;width:14px;height:14px">
                Todos
              </label>
            </div>
            <div id="envio-lista" style="max-height:400px;overflow-y:auto;display:flex;flex-direction:column;gap:4px">
              ${renderContactos(window._envioContactos)}
            </div>
          </div>

          <!-- Catálogo interactivo -->
          <div id="panel-envio-catalogo" style="display:none">
          <div style="background:white;border-radius:12px;border:1px solid #eee;padding:1.5rem">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
              <p style="font-weight:700;font-size:0.95rem;margin:0">🛍️ Catálogo de productos</p>
              <span style="background:#e8f5e9;color:#2e7d32;border-radius:100px;padding:2px 8px;font-size:0.7rem;font-weight:600">hasta 30 modelos</span>
            </div>
            <div style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:8px 12px;margin-bottom:10px;font-size:0.76rem;color:#856404;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap">
              <span>⚠️ <strong>Tu plantilla de catálogo actual es MARKETING</strong> → solo llega a contactos activos (24h). Para enviar a cualquier cliente crea la versión UTILITY.</span>
              <button onclick="crearPlantillaCatalogo(this)" style="padding:5px 12px;border-radius:16px;border:1.5px solid #d97706;background:none;color:#92400e;font-size:0.73rem;font-weight:700;cursor:pointer;white-space:nowrap;flex-shrink:0">
                ⚙️ Crear plantilla UTILITY
              </button>
            </div>
            <p style="font-size:0.78rem;color:#888;margin-bottom:1rem">Selecciona los modelos a mostrar y elige los destinatarios en la columna derecha.</p>
            <input id="envio-prod-buscador" type="text" placeholder="🔍 Buscar modelo..."
              oninput="filtrarProductosEnvioInteractivo(this.value)"
              style="width:100%;padding:7px 10px;border:1px solid #eee;border-radius:8px;font-size:0.82rem;font-family:inherit;outline:none;box-sizing:border-box;margin-bottom:6px">
            <div id="envio-prod-grid" style="max-height:220px;overflow-y:auto;display:flex;flex-direction:column;gap:3px;margin-bottom:6px">
              <p style="font-size:0.8rem;color:#aaa;padding:4px">Cargando modelos...</p>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
              <p id="envio-prod-count" style="font-size:0.75rem;color:#E91E8C;font-weight:600;margin:0"></p>
              <button onclick="iniciarEnvioInteractivo()" class="btn btn-secondary" style="border-color:#E91E8C;color:#E91E8C;font-size:0.82rem;white-space:nowrap">
                🛍️ Enviar catálogo
              </button>
            </div>
          </div>
          </div><!-- fin panel-envio-catalogo -->

          <!-- Envío de fotos de variantes (24 h) -->
          <div id="panel-envio-fotos" style="display:none">
          <div style="background:white;border-radius:12px;border:1.5px solid #fed7aa;padding:1.5rem">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <p style="font-weight:700;font-size:0.95rem;margin:0">📸 Fotos de variantes</p>
              <span style="background:#fff7ed;color:#c2410c;border:1px solid #fed7aa;border-radius:100px;padding:2px 9px;font-size:0.7rem;font-weight:700;white-space:nowrap">⚠️ Solo 24 h</span>
            </div>
            <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:8px 12px;margin-bottom:10px;font-size:0.76rem;color:#92400e">
              ⚠️ <strong>Requiere que el cliente te haya escrito en las últimas 24 horas.</strong> Si no, el mensaje no llega (error 131047).
            </div>
            <p style="font-size:0.75rem;color:#888;margin-bottom:10px;line-height:1.4">
              Envía fotos de los colores/variantes que elijas directamente al chat, igual que en la sección CRM.
            </p>

            <!-- Mensaje de saludo -->
            <textarea id="fotos-texto" rows="2" placeholder="Mensaje de saludo (opcional) — usa {{nombre}} para personalizar. Ej: Hola {{nombre}}, llegaron nuevos modelos 🎉"
              style="width:100%;padding:8px 10px;border:1.5px solid #eee;border-radius:8px;font-size:0.82rem;font-family:inherit;outline:none;box-sizing:border-box;resize:vertical;margin-bottom:10px"></textarea>

            <!-- Buscador de modelo -->
            <input type="text" id="fotos-modelo-buscar" placeholder="🔍 Buscar modelo por nombre o SKU..."
              oninput="filtrarModelosFotos(this.value)"
              style="width:100%;padding:7px 10px;border:1.5px solid #eee;border-radius:8px;font-size:0.82rem;font-family:inherit;outline:none;box-sizing:border-box;margin-bottom:6px">
            <div id="fotos-modelos-lista" style="max-height:130px;overflow-y:auto;border:1px solid #eee;border-radius:8px;margin-bottom:8px">
              <p style="padding:10px 12px;font-size:0.8rem;color:#aaa">Escribe para buscar un modelo...</p>
            </div>

            <!-- Variantes del modelo -->
            <div id="fotos-variantes-panel" style="display:none;margin-bottom:10px">
              <p id="fotos-variantes-titulo" style="font-size:0.75rem;font-weight:700;color:#888;text-transform:uppercase;margin-bottom:6px"></p>
              <div id="fotos-variantes-grid" style="display:flex;flex-direction:column;gap:5px;max-height:200px;overflow-y:auto"></div>
            </div>

            <!-- Fotos seleccionadas -->
            <div id="fotos-seleccionadas-wrap" style="display:none;margin-bottom:12px">
              <p style="font-size:0.75rem;font-weight:700;color:#888;text-transform:uppercase;margin-bottom:6px">Fotos seleccionadas</p>
              <div id="fotos-seleccionadas-grid" style="display:flex;flex-wrap:wrap;gap:8px"></div>
            </div>

            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
              <p id="fotos-count" style="font-size:0.75rem;color:#e65100;font-weight:600;margin:0"></p>
              <button onclick="iniciarEnvioFotos()" class="btn btn-secondary"
                style="border-color:#e65100;color:#e65100;font-size:0.82rem;white-space:nowrap">
                Enviar fotos · solo 24 h
              </button>
            </div>
          </div>
          </div><!-- fin panel-envio-fotos -->

          </div><!-- fin columna derecha -->
        </div>
      </div>
    `
    window._fotosSeleccionadas = []
    cargarProductosEnvio()
    cargarProductosEnvioInteractivo()
    // Activar tab campaña por defecto
    window.switchTipoEnvio('campana', null)
    // seleccionar primera plantilla por defecto
    const primero = document.querySelector('input[name="envio-plantilla-radio"]')
    if (primero) {
      primero.checked = true
      onCambiarPlantillaEnvio(primero.value, primero.dataset.idioma)
    }
  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error: ' + e.message + '</p>'
  }
}

window.ejecutarDebugPlantillas = async () => {
  const resultado = document.getElementById('diag-resultado')
  if (!resultado) return
  resultado.style.display = 'block'
  resultado.textContent = 'Consultando estructura...'
  try {
    const res = await fetch(API + '/chatbot/plantillas-debug')
    const data = await res.json()
    resultado.textContent = JSON.stringify(data, null, 2)
  } catch(e) {
    resultado.textContent = 'Error: ' + e.message
  }
}

window.ejecutarDiagnostico = async () => {
  const tel = (document.getElementById('diag-tel')?.value || '').trim()
  const radio = document.querySelector('input[name="envio-plantilla-radio"]:checked')
  const plantilla = radio?.value || ''
  const idioma = radio?.dataset?.idioma || 'es_MX'
  const resultado = document.getElementById('diag-resultado')
  if (!resultado) return
  resultado.style.display = 'block'
  resultado.textContent = 'Consultando...'
  try {
    const res = await fetch(API + '/chatbot/wa-diagnostico', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telefono: tel, plantilla, idioma })
    })
    const data = await res.json()
    resultado.textContent = JSON.stringify(data, null, 2)
  } catch(e) {
    resultado.textContent = 'Error: ' + e.message
  }
}

window.onCambiarPlantillaEnvio = (nombre, idioma) => {
  window._envioPlantillaActual = { nombre, idioma }
  const plantillas = window._envioPlantillas || []
  const p = plantillas.find(x => x.name === nombre)
  const box = document.getElementById('plantilla-preview-box')
  const burbuja = document.getElementById('plantilla-preview-burbuja')
  if (!box || !burbuja || !p) return

  const partes = []
  const header = (p.components || []).find(c => c.type === 'HEADER')
  const body = (p.components || []).find(c => c.type === 'BODY')
  const footer = (p.components || []).find(c => c.type === 'FOOTER')
  const buttons = (p.components || []).find(c => c.type === 'BUTTONS')
  const esMPM = (buttons?.buttons || []).some(b => b.sub_type === 'MPM' || b.type === 'MPM' || (p.sub_category === 'MULTI_PRODUCT_MESSAGE'))

  if (header?.format === 'IMAGE') partes.push('🖼️ [Imagen del producto]')
  if (header?.text) partes.push(`*${header.text}*`)
  if (body?.text) partes.push(body.text)
  if (footer?.text) partes.push(`_${footer.text}_`)
  if (esMPM) partes.push('🛍️ [Catálogo de productos — selecciona abajo]')
  burbuja.textContent = partes.join('\n\n') || '(sin contenido)'
  box.style.display = 'block'

  // Actualizar etiqueta de la sección foto según tipo
  const secFoto = document.getElementById('envio-seccion-foto')
  if (secFoto) {
    secFoto.style.display = 'block'
    const lbl = secFoto.querySelector('p')
    if (lbl) lbl.innerHTML = esMPM
      ? '<span style="font-weight:700;font-size:0.9rem">2️⃣ Foto de portada del catálogo</span> <span style="font-weight:400;color:#aaa;font-size:0.78rem">(imagen principal que verá el cliente)</span>'
      : '<span style="font-weight:700;font-size:0.9rem">2️⃣ Foto del modelo</span> <span style="font-weight:400;color:#aaa;font-size:0.78rem">(opcional — para plantillas con imagen)</span>'
  }

  // Mostrar aviso MPM en el catálogo
  const mpmAviso = document.getElementById('envio-mpm-aviso')
  if (mpmAviso) mpmAviso.style.display = esMPM ? 'block' : 'none'

  window._envioEsMPM = esMPM
  // Tipo de header: IMAGE | TEXT | NONE
  window._envioHeaderTipo = header?.format || (header?.text ? 'TEXT' : 'NONE')
  // Contar variables {{N}} o {{}} en el body — Meta a veces omite el número
  const bodyText = body?.text || ''
  const bodyVars = bodyText.match(/\{\{[\d]*\}\}/g) || []
  window._envioBodyVarsCount = bodyVars.length || (bodyText.includes('{{') ? 1 : 0)

  // Mostrar/ocultar selector de foto según si el header admite imagen
  const secFotoEl = document.getElementById('envio-seccion-foto')
  if (secFotoEl) secFotoEl.style.display = window._envioHeaderTipo === 'IMAGE' ? 'block' : 'none'

  // resaltar el label seleccionado
  document.querySelectorAll('input[name="envio-plantilla-radio"]').forEach(r => {
    const lbl = r.closest('label')
    if (!lbl) return
    lbl.style.borderColor = r.value === nombre ? '#E91E8C' : '#eee'
    lbl.style.background = r.value === nombre ? '#fff0f8' : ''
  })
}

const _renderEnvioLista = (lista) => {
  const listaEl = document.getElementById('envio-lista')
  if (!listaEl) return
  listaEl.innerHTML = lista.map(c => {
    const sel = window._envioSeleccionados?.has(c.telefono)
    const tel = c.telefono.replace(/\D/g, '')
    return `<label style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;cursor:pointer;border:1.5px solid ${sel ? '#E91E8C' : '#f0f0f0'};background:${sel ? '#fff0f8' : 'white'}" id="envio-row-${tel}">
      <input type="checkbox" ${sel ? 'checked' : ''} onchange="toggleEnvioContacto('${c.telefono}',this)"
        style="accent-color:#E91E8C;width:15px;height:15px;flex-shrink:0">
      <div style="width:28px;height:28px;border-radius:50%;background:#E91E8C;display:flex;align-items:center;justify-content:center;color:white;font-size:0.75rem;font-weight:700;flex-shrink:0">
        ${(c.nombre||'?').charAt(0).toUpperCase()}
      </div>
      <div style="flex:1;min-width:0">
        <p style="font-size:0.82rem;font-weight:600;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.nombre || c.telefono}</p>
        <p style="font-size:0.72rem;color:#888;margin:0">${c.telefono}${c.tipo ? ' · ' + c.tipo : ''}</p>
      </div>
    </label>`
  }).join('')
}

const _actualizarConteoEnvio = () => {
  const n = window._envioSeleccionados?.size || 0
  const countEl = document.getElementById('envio-count')
  if (countEl) countEl.textContent = `${n} seleccionado${n !== 1 ? 's' : ''}`
  // sincronizar checkbox "Todos"
  const chkTodos = document.getElementById('envio-sel-todos')
  if (chkTodos) {
    const visible = window._envioContactosVisibles || []
    const todosCheck = visible.length > 0 && visible.every(c => window._envioSeleccionados?.has(c.telefono))
    chkTodos.checked = todosCheck
    chkTodos.indeterminate = !todosCheck && visible.some(c => window._envioSeleccionados?.has(c.telefono))
  }
}

window.toggleEnvioContacto = (telefono, el) => {
  if (!window._envioSeleccionados) window._envioSeleccionados = new Set()
  const tel = telefono.replace(/\D/g, '')
  const row = document.getElementById('envio-row-' + tel)
  if (el.checked) {
    window._envioSeleccionados.add(telefono)
    if (row) { row.style.borderColor = '#E91E8C'; row.style.background = '#fff0f8' }
  } else {
    window._envioSeleccionados.delete(telefono)
    if (row) { row.style.borderColor = '#f0f0f0'; row.style.background = 'white' }
  }
  _actualizarConteoEnvio()
}

window.toggleSelTodosEnvio = (checked) => {
  const visible = window._envioContactosVisibles || []
  if (!window._envioSeleccionados) window._envioSeleccionados = new Set()
  visible.forEach(c => {
    if (checked) window._envioSeleccionados.add(c.telefono)
    else window._envioSeleccionados.delete(c.telefono)
  })
  _renderEnvioLista(visible)
  _actualizarConteoEnvio()
}

window.filtrarAudienciaEnvio = () => {
  const filtro = document.getElementById('envio-filtro')?.value || 'todos'
  const q = (document.getElementById('envio-buscador')?.value || '').toLowerCase()
  const clientes = window._envioClientes || []
  let lista = filtro === 'todos' ? clientes : clientes.filter(c => c.tipo === filtro)
  if (q) lista = lista.filter(c => (c.nombre||'').toLowerCase().includes(q) || (c.telefono||'').includes(q))
  window._envioContactosVisibles = lista.map(c => ({ telefono: c.telefono, nombre: c.nombre, tipo: c.tipo }))
  _renderEnvioLista(window._envioContactosVisibles)
  _actualizarConteoEnvio()
}

window.buscarContactosEnvio = (texto) => {
  filtrarAudienciaEnvio()
}

window.iniciarEnvioMasivo = async () => {
  const seleccionados = window._envioSeleccionados || new Set()
  const contactosBase = window._envioClientes || []
  const contactos = contactosBase
    .filter(c => seleccionados.has(c.telefono))
    .map(c => ({ telefono: c.telefono, nombre: c.nombre }))
  if (contactos.length === 0) { alert('Selecciona al menos un destinatario'); return }

  const radioChecked = document.querySelector('input[name="envio-plantilla-radio"]:checked')
  if (!radioChecked) { alert('Selecciona una plantilla'); return }
  const plantilla = radioChecked.value
  const idioma = radioChecked.dataset.idioma || 'es_MX'
  const imagenUrl = (document.getElementById('envio-imagen')?.value || '').trim()
  const esMPM = window._envioEsMPM || false
  const skusMPM = esMPM ? Array.from(window._envioProdSeleccionados || new Set()) : []

  if (esMPM && skusMPM.length === 0) {
    alert('Esta plantilla es de catálogo — selecciona al menos un producto en la sección de abajo')
    return
  }

  if (!confirm(`¿Enviar la plantilla "${plantilla}" a ${contactos.length} contacto${contactos.length !== 1 ? 's' : ''} seleccionado${contactos.length !== 1 ? 's' : ''}${esMPM ? ` con ${skusMPM.length} producto${skusMPM.length !== 1 ? 's' : ''}` : ''}?`)) return

  // Overlay de progreso
  const overlay = document.createElement('div')
  overlay.id = 'envio-masivo-overlay'
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem'
  overlay.innerHTML = `
    <div style="background:white;border-radius:16px;padding:2rem;max-width:380px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
      <div style="font-size:2.5rem;margin-bottom:0.75rem">📣</div>
      <h3 style="font-size:1rem;font-weight:700;margin-bottom:0.5rem">Enviando campaña…</h3>
      <p style="font-size:0.82rem;color:#888;margin-bottom:1.25rem">${contactos.length} contactos · plantilla: <strong>${plantilla}</strong></p>
      <div style="background:#f5f5f5;border-radius:100px;height:8px;overflow:hidden;margin-bottom:0.5rem">
        <div id="envio-progress-bar" style="height:100%;width:5%;background:linear-gradient(90deg,#E91E8C,#25D366);border-radius:100px;transition:width 0.3s"></div>
      </div>
      <p id="envio-progress-txt" style="font-size:0.75rem;color:#888">Procesando...</p>
    </div>`
  document.body.appendChild(overlay)

  const bar = overlay.querySelector('#envio-progress-bar')
  const txt = overlay.querySelector('#envio-progress-txt')
  if (bar) bar.style.width = '15%'

  try {
    const res = await fetch(API + '/chatbot/envio-masivo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plantilla, idioma, imagen_url: imagenUrl, contactos, skus_mpm: skusMPM, body_vars_count: window._envioBodyVarsCount || 0, header_tipo: window._envioHeaderTipo || 'NONE' })
    })
    const data = await res.json()

    if (data.error) {
      overlay.innerHTML = `<div style="background:white;border-radius:16px;padding:2.5rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
        <div style="font-size:3rem;margin-bottom:1rem">❌</div>
        <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:0.5rem">Error</h3>
        <p style="color:#e53e3e;font-size:0.82rem;margin-bottom:1.5rem">${data.error}</p>
        <button onclick="document.getElementById('envio-masivo-overlay').remove()"
          style="background:#E91E8C;color:white;border:none;border-radius:10px;padding:10px 28px;font-size:0.9rem;font-weight:700;cursor:pointer">Cerrar</button>
      </div>`
      return
    }

    overlay.innerHTML = `<div style="background:white;border-radius:16px;padding:2.5rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
      <div style="font-size:3rem;margin-bottom:1rem">${data.fallidos === 0 ? '🎉' : '✅'}</div>
      <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:0.75rem">¡Campaña enviada!</h3>
      <div style="display:flex;justify-content:center;gap:1.5rem;margin-bottom:1rem">
        <div><p style="font-size:1.5rem;font-weight:800;color:#25D366;margin:0">${data.enviados}</p><p style="font-size:0.75rem;color:#888;margin:0">enviados</p></div>
        ${data.fallidos > 0 ? `<div><p style="font-size:1.5rem;font-weight:800;color:#e53e3e;margin:0">${data.fallidos}</p><p style="font-size:0.75rem;color:#888;margin:0">fallidos</p></div>` : ''}
      </div>
      ${data.errores?.length > 0 ? `<details style="text-align:left;margin-bottom:1rem"><summary style="font-size:0.78rem;color:#888;cursor:pointer">Ver errores</summary><p style="font-size:0.72rem;color:#c62828;margin-top:6px">${data.errores.slice(0,5).join('<br>')}</p></details>` : ''}
      <button onclick="document.getElementById('envio-masivo-overlay').remove()"
        style="background:#E91E8C;color:white;border:none;border-radius:10px;padding:10px 28px;font-size:0.9rem;font-weight:700;cursor:pointer">Cerrar</button>
    </div>`
  } catch(e) {
    overlay.remove()
    alert('Error de conexión: ' + e.message)
  }
}


window.cargarProductosEnvioInteractivo = async () => {
  const grid = document.getElementById('envio-prod-grid')
  if (!grid || window._envioProdInteractivoCargado) { if (window._envioProdInteractivo) renderizarEnvioProdGrid(window._envioProdInteractivo); return }
  try {
    const res = await fetch(API + '/productos/?activo=eq.true&select=id,nombre,sku_interno,categoria,imagen_principal&order=nombre.asc&limit=300')
    const prods = await res.json()
    window._envioProdInteractivo = prods
    window._envioProdSeleccionados = new Set()
    window._envioProdInteractivoCargado = true
    renderizarEnvioProdGrid(prods)
  } catch(e) {
    if (grid) grid.innerHTML = '<p style="color:red;font-size:0.8rem;padding:4px">Error cargando productos</p>'
  }
}

window.renderizarEnvioProdGrid = (prods) => {
  const grid = document.getElementById('envio-prod-grid')
  if (!grid) return
  const sel = window._envioProdSeleccionados || new Set()
  if (!prods.length) { grid.innerHTML = '<p style="font-size:0.8rem;color:#aaa;padding:4px">Sin productos</p>'; return }
  grid.innerHTML = prods.map(p => {
    const sku = p.sku_interno || p.id
    const checked = sel.has(sku)
    return `<label style="display:flex;align-items:center;gap:8px;padding:4px 6px;border-radius:6px;cursor:pointer;border:1px solid ${checked ? '#E91E8C' : '#f0f0f0'};background:${checked ? '#fff0f8' : 'white'}" id="envio-prod-lbl-${sku}">
      <input type="checkbox" ${checked ? 'checked' : ''} onchange="toggleEnvioProd('${sku}',this)" style="accent-color:#E91E8C;width:14px;height:14px;flex-shrink:0">
      ${p.imagen_principal ? `<img src="${p.imagen_principal}" style="width:28px;height:28px;object-fit:cover;border-radius:4px;flex-shrink:0">` : '<div style="width:28px;height:28px;background:#f5f5f5;border-radius:4px;flex-shrink:0"></div>'}
      <div style="min-width:0;flex:1">
        <p style="font-size:0.75rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:0">${p.nombre || sku}</p>
        <p style="font-size:0.65rem;color:#aaa;margin:0">${sku}</p>
      </div>
    </label>`
  }).join('')
  actualizarCountEnvioProd()
}

window.toggleEnvioProd = (sku, el) => {
  if (!window._envioProdSeleccionados) window._envioProdSeleccionados = new Set()
  const lbl = document.getElementById('envio-prod-lbl-' + sku)
  if (el.checked) {
    if (window._envioProdSeleccionados.size >= 30) { el.checked = false; alert('Máximo 30 productos'); return }
    window._envioProdSeleccionados.add(sku)
    if (lbl) { lbl.style.borderColor = '#E91E8C'; lbl.style.background = '#fff0f8' }
  } else {
    window._envioProdSeleccionados.delete(sku)
    if (lbl) { lbl.style.borderColor = '#f0f0f0'; lbl.style.background = 'white' }
  }
  actualizarCountEnvioProd()
}

window.actualizarCountEnvioProd = () => {
  const counter = document.getElementById('envio-prod-count')
  if (!counter) return
  const n = window._envioProdSeleccionados?.size || 0
  counter.textContent = n > 0 ? `${n}/30 producto${n > 1 ? 's' : ''} seleccionado${n > 1 ? 's' : ''}` : ''
}

window.filtrarProductosEnvioInteractivo = (texto) => {
  const q = (texto || '').toLowerCase().trim()
  const todos = window._envioProdInteractivo || []
  renderizarEnvioProdGrid(q ? todos.filter(p => (p.nombre||'').toLowerCase().includes(q) || (p.sku_interno||'').toLowerCase().includes(q)) : todos)
}

window.iniciarEnvioInteractivo = async () => {
  const seleccionados = window._envioSeleccionados || new Set()
  const contactos = (window._envioClientes || [])
    .filter(c => seleccionados.has(c.telefono))
    .map(c => ({ telefono: c.telefono, nombre: c.nombre }))
  const skus = Array.from(window._envioProdSeleccionados || new Set())
  if (!skus.length) { alert('Selecciona al menos un modelo del catálogo'); return }
  if (!contactos.length) { alert('No hay destinatarios seleccionados'); return }
  if (!confirm(`¿Enviar catálogo con ${skus.length} modelo${skus.length>1?'s':''} a ${contactos.length} destinatario${contactos.length>1?'s':''} seleccionado${contactos.length>1?'s':''}?`)) return

  const overlay = document.createElement('div')
  overlay.id = 'envio-interactivo-overlay'
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem'
  overlay.innerHTML = `<div style="background:white;border-radius:16px;padding:2rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
    <div style="font-size:2.5rem;margin-bottom:0.75rem">🛍️</div>
    <h3 style="font-size:1rem;font-weight:700;margin-bottom:0.5rem">Enviando catálogo interactivo…</h3>
    <p style="font-size:0.82rem;color:#888">${contactos.length} contacto${contactos.length>1?'s':''} · ${skus.length} producto${skus.length>1?'s':''}</p>
  </div>`
  document.body.appendChild(overlay)

  try {
    const res = await fetch(API + '/chatbot/envio-productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactos: contactos.map(c => ({ telefono: c.telefono, nombre: c.nombre })), skus, titulo: 'Nuestros modelos 👠', cuerpo: 'Mira los modelos disponibles. ¡Elige el tuyo!', pie: 'Zapatillas May · León, Gto.' })
    })
    const data = await res.json()
    if (data.error) {
      overlay.innerHTML = `<div style="background:white;border-radius:16px;padding:2.5rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
        <div style="font-size:3rem;margin-bottom:1rem">❌</div>
        <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:0.5rem">Error al enviar</h3>
        <p style="color:#e53e3e;font-size:0.82rem;margin-bottom:1rem">${data.error}</p>
        <button onclick="document.getElementById('envio-interactivo-overlay').remove()"
          style="background:#E91E8C;color:white;border:none;border-radius:10px;padding:10px 28px;font-size:0.9rem;font-weight:700;cursor:pointer">Cerrar</button>
      </div>`
      return
    }
    overlay.innerHTML = `<div style="background:white;border-radius:16px;padding:2.5rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
      <div style="font-size:3rem;margin-bottom:1rem">${!data.fallidos ? '🎉' : '✅'}</div>
      <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:0.5rem">¡Listo!</h3>
      <p style="color:#25D366;font-weight:700;margin-bottom:4px">${data.enviados || 0} enviados</p>
      ${data.fallidos ? `<p style="color:#e53e3e;font-size:0.82rem;margin-bottom:1rem">${data.fallidos} fallidos</p>` : '<p style="font-size:0.8rem;color:#888;margin-bottom:1rem">Sin errores</p>'}
      ${data.errores?.length ? `<p style="font-size:0.72rem;color:#aaa;margin-bottom:1rem">${data.errores[0]}</p>` : ''}
      <button onclick="document.getElementById('envio-interactivo-overlay').remove()"
        style="background:#E91E8C;color:white;border:none;border-radius:10px;padding:10px 28px;font-size:0.9rem;font-weight:700;cursor:pointer">Cerrar</button>
    </div>`
  } catch(e) {
    overlay.remove()
    alert('Error: ' + e.message)
  }
}

// ── Envío de fotos de variantes (24 h) ───────────────────────────

window._fotosSeleccionadas = [] // [{url, caption, modelo}]

window.filtrarModelosFotos = (q) => {
  const todos = window._envioModelosList || []
  const lista = document.getElementById('fotos-modelos-lista')
  if (!lista) return
  if (!q.trim()) {
    lista.innerHTML = '<p style="padding:10px 12px;font-size:0.8rem;color:#aaa">Escribe para buscar un modelo...</p>'
    return
  }
  const filtrados = todos.filter(p =>
    (p.nombre||'').toLowerCase().includes(q.toLowerCase()) ||
    (p.sku_interno||'').toLowerCase().includes(q.toLowerCase())
  )
  if (!filtrados.length) {
    lista.innerHTML = '<p style="padding:10px 12px;font-size:0.8rem;color:#aaa">Sin resultados</p>'
    return
  }
  lista.innerHTML = filtrados.map(p => `
    <div onclick="seleccionarModeloFotos('${p.id}','${(p.nombre||p.sku_interno).replace(/'/g,"\\'")}')"
         style="display:flex;align-items:center;gap:8px;padding:7px 10px;cursor:pointer;border-bottom:1px solid #f5f5f5;transition:background 0.1s"
         onmouseover="this.style.background='#fff3e0'" onmouseout="this.style.background=''">
      ${p.imagen_principal
        ? `<img src="${p.imagen_principal}" style="width:32px;height:32px;object-fit:cover;border-radius:5px;flex-shrink:0">`
        : `<div style="width:32px;height:32px;background:#f0f0f0;border-radius:5px;flex-shrink:0;display:flex;align-items:center;justify-content:center">👟</div>`}
      <span style="font-size:0.83rem;font-weight:500">${p.nombre || p.sku_interno}</span>
    </div>`).join('')
}

window.seleccionarModeloFotos = async (productoId, nombre) => {
  const panel = document.getElementById('fotos-variantes-panel')
  const titulo = document.getElementById('fotos-variantes-titulo')
  const grid = document.getElementById('fotos-variantes-grid')
  const buscar = document.getElementById('fotos-modelo-buscar')
  if (!panel || !grid) return
  if (buscar) buscar.value = nombre
  document.getElementById('fotos-modelos-lista').innerHTML =
    '<p style="padding:10px 12px;font-size:0.8rem;color:#aaa">Escribe para buscar otro modelo...</p>'
  panel.style.display = 'block'
  if (titulo) titulo.textContent = nombre + ' — elige colores a enviar'
  grid.innerHTML = '<p style="font-size:0.8rem;color:#aaa;padding:4px">Cargando colores...</p>'

  try {
    const res = await fetch(API + '/variantes/producto/' + productoId)
    const variantes = await res.json()
    const mapa = {}
    for (const v of variantes) {
      if (!v.color) continue
      if (!mapa[v.color]) mapa[v.color] = { color: v.color, color_hex: v.color_hex||null, foto_url: v.foto_url||null }
      if (!mapa[v.color].foto_url && v.foto_url) mapa[v.color].foto_url = v.foto_url
    }
    const colores = Object.values(mapa)
    if (!colores.length) { grid.innerHTML = '<p style="font-size:0.8rem;color:#aaa;padding:4px">Sin colores registrados</p>'; return }

    grid.innerHTML = colores.map(c => {
      const cleanFotoUrl = _waCloudinaryUrl(c.foto_url)
      const yaSelec = window._fotosSeleccionadas.some(f => f.url === cleanFotoUrl)
      return `
      <div id="fotovar-${encodeURIComponent(c.color)}"
           onclick="${c.foto_url ? `toggleFotoVariante('${c.foto_url}','${c.color.replace(/'/g,"\\'")}','${nombre.replace(/'/g,"\\'")}',this)` : ''}"
           style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;border:1.5px solid ${yaSelec?'#25D366':'#eee'};background:${yaSelec?'#f0faf4':''};cursor:${c.foto_url?'pointer':'default'};opacity:${c.foto_url?'1':'0.4'};transition:all 0.15s">
        <div style="width:22px;height:22px;border-radius:50%;background:${c.color_hex||'#ccc'};border:2px solid rgba(0,0,0,0.12);flex-shrink:0"></div>
        <span style="flex:1;font-size:0.83rem;font-weight:600">${c.color}</span>
        ${c.foto_url
          ? `<img src="${c.foto_url}" style="width:52px;height:52px;object-fit:cover;border-radius:7px;border:1px solid #eee;flex-shrink:0">`
          : `<span style="font-size:0.7rem;color:#bbb">sin foto</span>`}
        <span style="font-size:1.1rem">${yaSelec ? '✅' : '⬜'}</span>
      </div>`
    }).join('')
  } catch(e) {
    grid.innerHTML = '<p style="font-size:0.8rem;color:red;padding:4px">Error cargando variantes</p>'
  }
}

window.toggleFotoVariante = (url, color, modelo, el) => {
  const cleanUrl = _waCloudinaryUrl(url)
  const idx = window._fotosSeleccionadas.findIndex(f => f.url === cleanUrl)
  if (idx >= 0) {
    window._fotosSeleccionadas.splice(idx, 1)
    el.style.borderColor = '#eee'; el.style.background = ''
    el.querySelector('span:last-child').textContent = '⬜'
  } else {
    window._fotosSeleccionadas.push({ url: cleanUrl, caption: `${modelo} · ${color}`, modelo, color })
    el.style.borderColor = '#25D366'; el.style.background = '#f0faf4'
    el.querySelector('span:last-child').textContent = '✅'
  }
  _renderFotosSeleccionadas()
}

function _renderFotosSeleccionadas() {
  const wrap = document.getElementById('fotos-seleccionadas-wrap')
  const grid = document.getElementById('fotos-seleccionadas-grid')
  const count = document.getElementById('fotos-count')
  const n = window._fotosSeleccionadas.length
  if (count) count.textContent = n > 0 ? `${n} foto${n>1?'s':''} seleccionada${n>1?'s':''}` : ''
  if (!wrap || !grid) return
  if (n === 0) { wrap.style.display = 'none'; return }
  wrap.style.display = 'block'
  grid.innerHTML = window._fotosSeleccionadas.map((f, i) => `
    <div style="position:relative;width:64px">
      <img src="${f.url}" style="width:64px;height:64px;object-fit:cover;border-radius:8px;border:2px solid #25D366">
      <button onclick="quitarFotoSeleccionada(${i})"
        style="position:absolute;top:-6px;right:-6px;background:#e53e3e;color:white;border:none;border-radius:50%;width:18px;height:18px;font-size:0.65rem;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1">✕</button>
      <p style="font-size:0.6rem;color:#666;margin:2px 0 0;text-align:center;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;max-width:64px">${f.color}</p>
    </div>`).join('')
}

window.quitarFotoSeleccionada = (i) => {
  window._fotosSeleccionadas.splice(i, 1)
  _renderFotosSeleccionadas()
}

window.iniciarEnvioFotos = async () => {
  const seleccionados = window._envioSeleccionados || new Set()
  const contactos = (window._envioClientes || [])
    .filter(c => seleccionados.has(c.telefono))
    .map(c => ({ telefono: c.telefono, nombre: c.nombre }))
  if (!contactos.length) { alert('Selecciona al menos un destinatario'); return }
  if (!window._fotosSeleccionadas.length) { alert('Selecciona al menos una variante en la sección de fotos'); return }

  const texto = (document.getElementById('fotos-texto')?.value || '').trim()
  const n = contactos.length
  const nFotos = window._fotosSeleccionadas.length

  if (!confirm(`¿Enviar ${nFotos} foto${nFotos>1?'s':''} a ${n} contacto${n>1?'s':''} seleccionado${n>1?'s':''}?\n\n⚠️ Solo llegará a quienes te hayan escrito en las últimas 24 horas.`)) return

  const overlay = document.createElement('div')
  overlay.id = 'fotos-overlay'
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem'
  overlay.innerHTML = `<div style="background:white;border-radius:16px;padding:2rem;max-width:380px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
    <div style="font-size:2.5rem;margin-bottom:0.75rem">📸</div>
    <h3 style="font-size:1rem;font-weight:700;margin-bottom:0.5rem">Enviando fotos…</h3>
    <p style="font-size:0.82rem;color:#888">${n} contacto${n>1?'s':''} · ${nFotos} foto${nFotos>1?'s':''} por contacto</p>
    <p style="font-size:0.72rem;color:#e65100;margin-top:6px">⏱ Solo clientes activos (24 h)</p>
  </div>`
  document.body.appendChild(overlay)

  try {
    const res = await fetch(API + '/chatbot/envio-fotos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactos, texto, fotos: window._fotosSeleccionadas.map(f=>({url:f.url,caption:f.caption})), delay_segundos: 3 })
    })
    const data = await res.json()
    if (data.error) {
      overlay.innerHTML = `<div style="background:white;border-radius:16px;padding:2.5rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
        <div style="font-size:3rem;margin-bottom:1rem">❌</div>
        <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:0.5rem">Error</h3>
        <p style="color:#e53e3e;font-size:0.82rem;margin-bottom:1.5rem">${data.error}</p>
        <button onclick="document.getElementById('fotos-overlay').remove()"
          style="background:#e65100;color:white;border:none;border-radius:10px;padding:10px 28px;font-size:0.9rem;font-weight:700;cursor:pointer">Cerrar</button>
      </div>`
      return
    }
    overlay.innerHTML = `<div style="background:white;border-radius:16px;padding:2.5rem;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
      <div style="font-size:3rem;margin-bottom:1rem">${!data.fallidos?'🎉':'✅'}</div>
      <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:0.5rem">¡Listo!</h3>
      <p style="color:#25D366;font-weight:700;margin-bottom:4px">${data.enviados||0} enviados</p>
      ${data.fallidos?`<p style="color:#e53e3e;font-size:0.82rem;margin-bottom:4px">${data.fallidos} contactos sin entregas</p>`:''}
      ${data.errores?.length?`<p style="font-size:0.7rem;color:#aaa;margin-bottom:6px;text-align:left;max-height:80px;overflow-y:auto">${data.errores.slice(0,5).join('<br>')}</p>`:'<p style="font-size:0.8rem;color:#888;margin-bottom:6px">Sin errores</p>'}
      <button onclick="document.getElementById('fotos-overlay').remove()"
        style="background:#e65100;color:white;border:none;border-radius:10px;padding:10px 28px;margin-top:8px;font-size:0.9rem;font-weight:700;cursor:pointer">Cerrar</button>
    </div>`
  } catch(e) {
    overlay.remove()
    alert('Error: ' + e.message)
  }
}

// ── Selector modelo→variante para Envíos Masivos ─────────────────

window.cargarProductosEnvio = async () => {
  // Pre-carga la lista de modelos en segundo plano
  if (window._envioModelosList) return
  try {
    const res = await fetch(API + '/productos/?activo=eq.true&select=id,nombre,sku_interno,imagen_principal&order=nombre.asc&limit=500')
    window._envioModelosList = await res.json()
  } catch(e) { console.error('Error cargando modelos:', e) }
}

window.filtrarModelosEnvio = (q) => {
  const todos = window._envioModelosList || []
  const lista = document.getElementById('envio-modelos-lista')
  if (!lista) return
  if (!q.trim()) {
    lista.innerHTML = '<p style="padding:10px 12px;font-size:0.8rem;color:#aaa">Escribe para buscar un modelo...</p>'
    return
  }
  const filtrados = todos.filter(p =>
    (p.nombre||'').toLowerCase().includes(q.toLowerCase()) ||
    (p.sku_interno||'').toLowerCase().includes(q.toLowerCase())
  )
  if (!filtrados.length) {
    lista.innerHTML = '<p style="padding:10px 12px;font-size:0.8rem;color:#aaa">Sin resultados</p>'
    return
  }
  lista.innerHTML = filtrados.map(p => `
    <div onclick="seleccionarModeloEnvio('${p.id}', '${(p.nombre||p.sku_interno).replace(/'/g,"\'")}')"
         style="display:flex;align-items:center;gap:8px;padding:7px 10px;cursor:pointer;border-bottom:1px solid #f5f5f5;transition:background 0.1s"
         onmouseover="this.style.background='#fff0f8'" onmouseout="this.style.background=''">
      ${p.imagen_principal
        ? `<img src="${p.imagen_principal}" style="width:32px;height:32px;object-fit:cover;border-radius:5px;flex-shrink:0">`
        : `<div style="width:32px;height:32px;background:#f0f0f0;border-radius:5px;flex-shrink:0;display:flex;align-items:center;justify-content:center">👟</div>`}
      <span style="font-size:0.83rem;font-weight:500">${p.nombre || p.sku_interno}</span>
    </div>`).join('')
}

window.seleccionarModeloEnvio = async (productoId, nombre) => {
  const panel = document.getElementById('envio-variantes-panel')
  const titulo = document.getElementById('envio-variantes-titulo')
  const grid = document.getElementById('envio-variantes-grid')
  const buscar = document.getElementById('envio-modelo-buscar')
  if (!panel || !grid) return

  if (buscar) buscar.value = nombre
  const lista = document.getElementById('envio-modelos-lista')
  if (lista) lista.innerHTML = '<p style="padding:10px 12px;font-size:0.8rem;color:#aaa">Escribe para buscar otro modelo...</p>'

  panel.style.display = 'block'
  if (titulo) titulo.textContent = nombre + ' — elige el color'
  grid.innerHTML = '<p style="font-size:0.8rem;color:#aaa;padding:4px">Cargando colores...</p>'

  try {
    const res = await fetch(API + '/variantes/producto/' + productoId)
    const variantes = await res.json()
    // Agrupar por color, tomar primera foto por color
    const mapa = {}
    for (const v of variantes) {
      if (!v.color) continue
      if (!mapa[v.color]) mapa[v.color] = { color: v.color, color_hex: v.color_hex || null, foto_url: v.foto_url || null }
      if (!mapa[v.color].foto_url && v.foto_url) mapa[v.color].foto_url = v.foto_url
    }
    const colores = Object.values(mapa)
    if (!colores.length) {
      grid.innerHTML = '<p style="font-size:0.8rem;color:#aaa;padding:4px">Sin colores registrados</p>'
      return
    }
    grid.innerHTML = colores.map(c => `
      <div onclick="${c.foto_url ? `elegirVarianteEnvio('${c.foto_url}', '${nombre} · ${c.color}')` : ''}"
           style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;border:1.5px solid #eee;cursor:${c.foto_url ? 'pointer' : 'default'};opacity:${c.foto_url ? '1' : '0.4'};transition:all 0.15s"
           onmouseover="${c.foto_url ? "this.style.borderColor='#E91E8C';this.style.background='#fff0f8'" : ''}"
           onmouseout="${c.foto_url ? "this.style.borderColor='#eee';this.style.background=''" : ''}">
        <div style="width:22px;height:22px;border-radius:50%;background:${c.color_hex||'#ccc'};border:2px solid rgba(0,0,0,0.12);flex-shrink:0"></div>
        <span style="flex:1;font-size:0.83rem;font-weight:600">${c.color}</span>
        ${c.foto_url
          ? `<img src="${c.foto_url}" style="width:52px;height:52px;object-fit:cover;border-radius:7px;border:1px solid #eee;flex-shrink:0">`
          : `<span style="font-size:0.7rem;color:#bbb">sin foto</span>`}
      </div>`).join('')
  } catch(e) {
    grid.innerHTML = '<p style="font-size:0.8rem;color:red;padding:4px">Error cargando variantes</p>'
  }
}

// Convierte URL de Cloudinary a JPEG de alta calidad para WhatsApp (evita WebP pixelado)
function _waCloudinaryUrl(url) {
  if (!url?.includes('res.cloudinary.com')) return url
  // Reemplaza transformaciones existentes (q_auto, f_auto, etc.) por f_jpg,q_95,w_1200
  return url.replace(/\/upload\/(?:[a-z]+_[^/,]+(?:,[a-z]+_[^/,]+)*\/)*/, '/upload/f_jpg,q_95,w_1200/')
}

window.elegirVarianteEnvio = (fotoUrl, label) => {
  const cleanUrl = _waCloudinaryUrl(fotoUrl)
  const input = document.getElementById('envio-imagen')
  const contenedor = document.getElementById('envio-foto-seleccionada')
  const img = document.getElementById('envio-foto-img')
  const lbl = document.getElementById('envio-foto-label')
  if (input) input.value = cleanUrl
  if (img) img.src = cleanUrl
  if (lbl) lbl.textContent = label
  if (contenedor) contenedor.style.display = 'block'
  // actualizar preview de la plantilla con la imagen real
  const burbuja = document.getElementById('plantilla-preview-burbuja')
  if (burbuja) {
    const txt = burbuja.textContent
    if (txt.startsWith('🖼️ [Imagen del producto]')) {
      // ya está indicado, nada extra
    }
  }
  // mostrar checkmark en la variante seleccionada
  document.querySelectorAll('#envio-variantes-grid > div').forEach(d => {
    d.style.borderColor = '#eee'; d.style.background = ''
  })
  event?.currentTarget?.closest && (event.currentTarget.style.borderColor = '#25D366')
}

window.quitarFotoEnvio = () => {
  const input = document.getElementById('envio-imagen')
  const contenedor = document.getElementById('envio-foto-seleccionada')
  const img = document.getElementById('envio-foto-img')
  if (input) input.value = ''
  if (img) img.src = ''
  if (contenedor) contenedor.style.display = 'none'
}


window.sincronizarColeccionesMeta = async () => {
  const btn = document.getElementById('btn-sync-colecciones')
  const resultado = document.getElementById('seo-colecciones-resultado')
  if (btn) { btn.textContent = 'Sincronizando...'; btn.disabled = true }
  try {
    const res = await fetch(API + '/catalogo/sincronizar-colecciones', { method: 'POST' })
    const data = await res.json()
    if (data.error) {
      resultado.style.display = 'block'
      resultado.style.background = '#ffebee'
      resultado.style.borderColor = '#ef9a9a'
      resultado.innerHTML = `❌ Error: ${data.error}`
    } else {
      const creadas = data.resultados.filter(r => r.accion === 'creada').length
      const actualizadas = data.resultados.filter(r => r.accion === 'actualizada').length
      const errores = data.resultados.filter(r => r.accion === 'error')
      resultado.style.display = 'block'
      resultado.style.background = errores.length ? '#fff8e1' : '#e8f5e9'
      resultado.style.border = `1px solid ${errores.length ? '#ffe082' : '#a5d6a7'}`
      resultado.innerHTML = `
        ✅ <strong>${creadas} colecciones creadas</strong> · ${actualizadas} actualizadas
        ${errores.length ? `<br>⚠️ ${errores.length} errores: ${errores.map(e => e.categoria + ' (' + e.detalle + ')').join(', ')}` : ''}
        <br><small style="color:#888;margin-top:4px;display:block">${data.resultados.map(r => `${r.categoria}: ${r.accion}`).join(' · ')}</small>
      `
    }
  } catch(e) {
    if (resultado) { resultado.style.display='block'; resultado.style.background='#ffebee'; resultado.innerHTML = '❌ Error: ' + e.message }
  } finally {
    if (btn) { btn.textContent = '🗂️ Sincronizar colecciones en Meta'; btn.disabled = false }
  }
}

window.validarCantidadTalla = (varianteId, maxStock) => {
  const input = document.getElementById('qty-' + varianteId)
  if (!input) return
  let val = parseInt(input.value) || 0
  if (val < 0) val = 0
  if (val > maxStock) val = maxStock
  input.value = val
  input.style.borderColor = val > 0 ? '#E91E8C' : '#ddd'
}

window.recargarFinanzas = async (sucursalId) => {
  await cargarFinanzas()
}

window.verOportunidad = async (id) => {
  const data = window._crmData
  if (!data) return
  try {
    const res = await fetch(API + '/crm/oportunidades/' + id)
    const ops = await res.json()
    const o = Array.isArray(ops) ? ops[0] : ops
    if (!o) return
    const etapas = {
      contacto: '📞 Contacto', interes: '👀 Interés', cotizacion: '📋 Cotización',
      negociacion: '🤝 Negociación', ganado: '✅ Ganado', perdido: '❌ Perdido'
    }
    const modal = document.createElement('div')
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem'
    modal.innerHTML = `
      <div style="background:white;border-radius:16px;padding:2rem;max-width:480px;width:100%;max-height:90vh;overflow-y:auto">
        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:1.5rem">
          <div>
            <h3 style="font-size:1rem;font-weight:700;margin-bottom:4px">${o.titulo}</h3>
            <p style="font-size:0.82rem;color:#888">${o.clientes?.nombre || 'Sin cliente'}</p>
          </div>
          <button onclick="this.closest('div[style*=fixed]').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:#888">✕</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem">
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.72rem;color:#888;margin-bottom:4px">Monto estimado</p>
            <p style="font-weight:700;font-size:1.1rem;color:#E91E8C">$${parseFloat(o.monto_estimado||0).toFixed(0)}</p>
          </div>
          <div style="background:#f9f9f9;border-radius:8px;padding:1rem">
            <p style="font-size:0.72rem;color:#888;margin-bottom:4px">Etapa</p>
            <p style="font-weight:600;font-size:0.88rem">${etapas[o.etapa] || o.etapa}</p>
          </div>
        </div>
        ${o.fecha_cierre ? `<p style="font-size:0.82rem;color:#888;margin-bottom:1rem">📅 Cierre estimado: ${new Date(o.fecha_cierre).toLocaleDateString('es-MX')}</p>` : ''}
        ${o.notas ? `<div style="background:#f9f9f9;border-radius:8px;padding:1rem;margin-bottom:1rem"><p style="font-size:0.78rem;color:#888;margin-bottom:4px">Notas</p><p style="font-size:0.85rem">${o.notas}</p></div>` : ''}
        <div style="display:flex;gap:1rem;justify-content:flex-end;flex-wrap:wrap">
          <button class="btn btn-secondary" onclick="this.closest('div[style*=fixed]').remove()">Cerrar</button>
          <select class="form-input" style="flex:1" onchange="actualizarEtapaOportunidad('${o.id}', this.value)">
            ${Object.entries(etapas).map(([v,l]) => `<option value="${v}" ${o.etapa===v?'selected':''}>${l}</option>`).join('')}
          </select>
        </div>
      </div>
    `
    document.body.appendChild(modal)
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove() })
  } catch(e) { console.error('Error verOportunidad', e) }
}

window.actualizarEtapaOportunidad = async (id, etapa) => {
  try {
    await fetch(API + '/crm/oportunidades/' + id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ etapa })
    })
    document.querySelector('div[style*="position:fixed"][style*="z-index:1000"]')?.remove()
    mostrarPipeline()
  } catch(e) { alert('Error actualizando etapa') }
}

window.completarTareaDashboard = async (id, checked) => {
  try {
    await fetch(API + '/chatbot/tareas/' + id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completada: checked })
    })
  } catch(e) { console.error(e) }
}

async function cargarCarritosAbandonados() {
  const content = document.getElementById('content')
  content.innerHTML = '<p style="padding:2rem;color:var(--text-muted)">Cargando...</p>'
  try {
    const [resCA, resPP] = await Promise.all([
      fetch(API + '/carrito-abandonado/listar').then(r => r.json()).catch(() => ({ carritos: [], stats: {} })),
      fetch(API + '/pedidos/pendientes').then(r => r.json()).catch(() => ({ pedidos: [] })),
    ])
    const st = resCA.stats || {}
    const carritos = resCA.carritos || []
    const pedidosPendientes = Array.isArray(resPP) ? resPP : (Array.isArray(resPP.pedidos) ? resPP.pedidos : [])

    const fmtFecha = (f) => { try { return new Date(f).toLocaleString('es-MX', {day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}) } catch(e){ return f } }
    const badgeCA = (c) => {
      if (c.convertido) return '<span style="background:#e8f5e9;color:#2e7d32;padding:3px 10px;border-radius:20px;font-size:0.72rem;font-weight:600">✓ Compró</span>'
      if (c.recordatorio_enviado) return '<span style="background:#e3f2fd;color:#1565c0;padding:3px 10px;border-radius:20px;font-size:0.72rem;font-weight:600">📧 Avisado</span>'
      return '<span style="background:#fff3cd;color:#856404;padding:3px 10px;border-radius:20px;font-size:0.72rem;font-weight:600">⏳ Sin avisar</span>'
    }
    const metodoBadge = (m) => {
      const c = {'oxxo':'#e63946','spei':'#0a7c3e','tarjeta':'#1a56db','mercadopago':'#009ee3'}[m?.toLowerCase()] || '#888'
      return `<span style="background:${c}18;color:${c};padding:2px 9px;border-radius:12px;font-size:0.7rem;font-weight:700;text-transform:uppercase">${m||'—'}</span>`
    }

    content.innerHTML = `
      <div style="max-width:960px">
        <h3 style="margin-bottom:0.25rem">🛒 Seguimiento de pagos pendientes</h3>
        <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:1.25rem">
          Clientes que no completaron su pago — ya sea por carrito abandonado o pedido OXXO/SPEI sin acreditar.
        </p>

        <!-- Tabs -->
        <div style="display:flex;gap:8px;margin-bottom:1.25rem;border-bottom:2px solid var(--border);padding-bottom:0">
          <button id="tab-pp" onclick="switchTabPagos('pp')"
            style="padding:8px 18px;border:none;border-bottom:3px solid #b5687a;background:none;font-weight:700;font-size:0.85rem;color:#b5687a;cursor:pointer;margin-bottom:-2px">
            💳 OXXO / SPEI sin pagar (${pedidosPendientes.length})
          </button>
          <button id="tab-ca" onclick="switchTabPagos('ca')"
            style="padding:8px 18px;border:none;border-bottom:3px solid transparent;background:none;font-weight:600;font-size:0.85rem;color:var(--text-muted);cursor:pointer;margin-bottom:-2px">
            🛒 Carritos abandonados (${carritos.filter(c=>!c.convertido).length})
          </button>
        </div>

        <!-- Tab: Pedidos OXXO/SPEI pendientes -->
        <div id="panel-pp">
          <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:12px 16px;margin-bottom:1rem;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
            <div style="font-size:0.8rem;color:#856404">
              <strong>💬 WhatsApp requiere plantilla aprobada.</strong> Si el botón "WhatsApp" no envía, crea la plantilla primero (solo se hace una vez).
            </div>
            <button onclick="crearPlantillaPago(this)" style="padding:6px 14px;border-radius:20px;border:1.5px solid #d97706;background:none;color:#92400e;font-size:0.75rem;font-weight:700;cursor:pointer;white-space:nowrap">
              ⚙️ Crear plantilla en Meta
            </button>
          </div>
          ${pedidosPendientes.length === 0
            ? '<div class="table-card" style="padding:2rem;text-align:center;color:var(--text-muted)">No hay pedidos pendientes de pago 🎉</div>'
            : `<div class="table-card" style="padding:0;overflow:hidden">
            <div style="overflow-x:auto">
              <table style="width:100%;border-collapse:collapse;font-size:0.85rem">
                <thead>
                  <tr style="text-align:left;border-bottom:2px solid var(--border);background:var(--bg)">
                    <th style="padding:10px 14px">Cliente</th>
                    <th style="padding:10px 14px">Total</th>
                    <th style="padding:10px 14px">Método</th>
                    <th style="padding:10px 14px">Hace</th>
                    <th style="padding:10px 14px">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  ${pedidosPendientes.map(p => {
                    const nombre = p.nombre_cliente || '—'
                    const email  = p.email_cliente  || ''
                    const tel    = p.telefono_cliente|| ''
                    const horas  = p.horas_pendiente != null ? (p.horas_pendiente < 1 ? 'hace &lt;1h' : `hace ${p.horas_pendiente}h`) : '—'
                    const yaAvisado = !!p.recordatorio_pago_enviado_at
                    return `<tr data-pedido-id="${p.id}" style="border-bottom:1px solid var(--border)">
                      <td style="padding:10px 14px">
                        <div style="font-weight:600">${nombre}</div>
                        ${email ? `<div style="font-size:0.75rem;color:var(--text-muted)">${email}</div>` : ''}
                        ${tel   ? `<div style="font-size:0.75rem;color:var(--text-muted)">${tel}</div>` : ''}
                      </td>
                      <td style="padding:10px 14px;font-weight:700">$${parseFloat(p.total||0).toFixed(0)}</td>
                      <td style="padding:10px 14px">${metodoBadge(p.forma_pago)}</td>
                      <td style="padding:10px 14px;color:var(--text-muted);font-size:0.8rem">${horas}<br><span style="font-size:0.7rem">${fmtFecha(p.created_at)}</span></td>
                      <td style="padding:10px 14px">
                        <div style="display:flex;gap:6px;flex-wrap:wrap">
                          ${email ? `<button onclick="enviarRecordatorioEmail('${p.id}', this, '${(p.nombre_cliente||'').split(' ')[0]}', '${parseFloat(p.total||0).toFixed(0)}', '${(p.forma_pago||'OXXO/SPEI').toUpperCase()}')" style="padding:5px 12px;border-radius:20px;border:1.5px solid #1a56db;background:none;color:#1a56db;font-size:0.75rem;font-weight:600;cursor:pointer">📧 Email</button>` : ''}
                          ${tel   ? `<button onclick="enviarRecordatorioWA('${p.id}', this, '${(p.nombre_cliente||'').split(' ')[0]}', '${parseFloat(p.total||0).toFixed(0)}', '${(p.forma_pago||'OXXO/SPEI').toUpperCase()}')" style="padding:5px 12px;border-radius:20px;border:1.5px solid #25D366;background:none;color:#15803d;font-size:0.75rem;font-weight:600;cursor:pointer">💬 WhatsApp</button>` : ''}
                        </div>
                        ${yaAvisado ? `<div style="font-size:0.68rem;color:#aaa;margin-top:4px">Avisado ${fmtFecha(p.recordatorio_pago_enviado_at)}</div>` : ''}
                      </td>
                    </tr>`
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>`}
        </div>

        <!-- Tab: Carritos abandonados -->
        <div id="panel-ca" style="display:none">
          <div class="table-card" style="padding:1.25rem;margin-bottom:1rem">
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:1.25rem">
              <div style="background:var(--bg);border-radius:10px;padding:14px;text-align:center;border:1px solid var(--border)">
                <div style="font-size:1.6rem;font-weight:700">${st.total||0}</div>
                <div style="font-size:0.72rem;color:var(--text-muted)">Total</div>
              </div>
              <div style="background:#fffbeb;border-radius:10px;padding:14px;text-align:center;border:1px solid #fde68a">
                <div style="font-size:1.6rem;font-weight:700;color:#856404">${st.pendientes||0}</div>
                <div style="font-size:0.72rem;color:#856404">Sin avisar</div>
              </div>
              <div style="background:#eff6ff;border-radius:10px;padding:14px;text-align:center;border:1px solid #bfdbfe">
                <div style="font-size:1.6rem;font-weight:700;color:#1565c0">${st.enviados||0}</div>
                <div style="font-size:0.72rem;color:#1565c0">Avisados</div>
              </div>
              <div style="background:#f0fdf4;border-radius:10px;padding:14px;text-align:center;border:1px solid #bbf7d0">
                <div style="font-size:1.6rem;font-weight:700;color:#15803d">${st.convertidos||0}</div>
                <div style="font-size:0.72rem;color:#15803d">Compraron</div>
              </div>
            </div>
            <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:10px;padding:14px;margin-bottom:1.25rem;font-size:0.82rem;color:#0369a1">
              <strong>Recordatorio automático:</strong> se envía 1 hora después de inactividad.<br>
              Copia BCC a <strong>olivr47@gmail.com</strong> · Verifica en <a href="https://resend.com/emails" target="_blank" style="color:#0369a1;font-weight:600">resend.com/emails</a>
              <div style="margin-top:10px;display:flex;gap:8px;align-items:center;flex-wrap:wrap">
                <input id="ca-test-email" type="email" placeholder="correo de prueba"
                  style="border:1.5px solid #bae6fd;border-radius:8px;padding:8px 12px;font-size:0.82rem;flex:1;min-width:180px;outline:none">
                <button class="btn btn-primary" onclick="probarRecordatorio()" style="font-size:0.82rem">📧 Prueba</button>
              </div>
              <div id="ca-test-msg" style="margin-top:8px;font-size:0.8rem"></div>
            </div>
            <div style="overflow-x:auto">
              <table style="width:100%;border-collapse:collapse;font-size:0.85rem">
                <thead>
                  <tr style="text-align:left;border-bottom:2px solid var(--border)">
                    <th style="padding:8px">Email / Nombre</th>
                    <th style="padding:8px">Total</th>
                    <th style="padding:8px">Última actividad</th>
                    <th style="padding:8px">Estado</th>
                    <th style="padding:8px">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  ${carritos.length
                    ? carritos.map(c => `
                      <tr style="border-bottom:1px solid var(--border)">
                        <td style="padding:8px">${c.email}${c.nombre?`<br><span style="color:var(--text-muted);font-size:0.75rem">${c.nombre}</span>`:''}</td>
                        <td style="padding:8px;font-weight:600">$${parseFloat(c.total||0).toFixed(0)}</td>
                        <td style="padding:8px;color:var(--text-muted)">${fmtFecha(c.updated_at)}</td>
                        <td style="padding:8px">${badgeCA(c)}</td>
                        <td style="padding:8px">
                          ${!c.convertido ? `<button onclick="enviarWACarrito('${c.id}', this)" style="padding:5px 12px;border-radius:20px;border:1.5px solid #25D366;background:none;color:#15803d;font-size:0.75rem;font-weight:600;cursor:pointer">💬 WhatsApp</button>` : ''}
                        </td>
                      </tr>`).join('')
                    : '<tr><td colspan="5" style="padding:24px;text-align:center;color:var(--text-muted)">Aún no hay carritos abandonados registrados</td></tr>'}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>`
  } catch(e) {
    document.getElementById('content').innerHTML = `<p style="padding:2rem;color:red">Error: ${e.message}</p>`
  }
}

window.switchTabPagos = function(tab) {
  document.getElementById('panel-pp').style.display = tab === 'pp' ? 'block' : 'none'
  document.getElementById('panel-ca').style.display = tab === 'ca' ? 'block' : 'none'
  document.getElementById('tab-pp').style.cssText = tab === 'pp'
    ? 'padding:8px 18px;border:none;border-bottom:3px solid #b5687a;background:none;font-weight:700;font-size:0.85rem;color:#b5687a;cursor:pointer;margin-bottom:-2px'
    : 'padding:8px 18px;border:none;border-bottom:3px solid transparent;background:none;font-weight:600;font-size:0.85rem;color:var(--text-muted);cursor:pointer;margin-bottom:-2px'
  document.getElementById('tab-ca').style.cssText = tab === 'ca'
    ? 'padding:8px 18px;border:none;border-bottom:3px solid #b5687a;background:none;font-weight:700;font-size:0.85rem;color:#b5687a;cursor:pointer;margin-bottom:-2px'
    : 'padding:8px 18px;border:none;border-bottom:3px solid transparent;background:none;font-weight:600;font-size:0.85rem;color:var(--text-muted);cursor:pointer;margin-bottom:-2px'
}

window.enviarWACarrito = async function(carritoId, btn) {
  const orig = btn.textContent
  btn.disabled = true
  btn.textContent = 'Enviando...'
  try {
    const res = await fetch(API + `/carrito-abandonado/${carritoId}/whatsapp`, { method: 'POST' })
    const d = await res.json()
    if (d.ok) {
      btn.textContent = '✅ Enviado'
      btn.style.borderColor = '#15803d'
      btn.style.color = '#15803d'
    } else {
      btn.textContent = orig
      btn.disabled = false
      alert('Error: ' + (d.error || 'No se pudo enviar'))
    }
  } catch(e) {
    btn.textContent = orig
    btn.disabled = false
  }
}

async function _enviarRecordatorio(url, btn) {
  const orig = btn.textContent
  btn.disabled = true
  btn.textContent = 'Enviando...'
  try {
    const res = await fetch(url, { method: 'POST' })
    const d = await res.json()
    if (d.ok) {
      btn.textContent = '✅ Enviado'
      btn.style.borderColor = '#15803d'
      btn.style.color = '#15803d'
    } else {
      btn.textContent = orig
      btn.disabled = false
      alert('Error: ' + (d.error || 'No se pudo enviar'))
    }
  } catch(e) {
    btn.textContent = orig
    btn.disabled = false
  }
}

// Modal editable de recordatorio
window.abrirModalRecordatorio = async function(pedidoId, tipo, nombre, total, metodo) {
  const esWA = tipo === 'wa'
  const msgDefault = esWA ? '' : `Hola ${nombre}, te recordamos que tienes un pedido de $${total} MXN pendiente de pago vía ${metodo}.\n\nCuando realices el pago lo procesamos de inmediato. Si tienes alguna duda estamos para ayudarte 😊`

  // Remover modal previo si existe
  document.getElementById('modal-recordatorio')?.remove()

  // Cargar plantillas WA si aplica
  let plantillasHtml = ''
  let plantillasDisp = []
  if (esWA) {
    try {
      const rp = await fetch(API + '/chatbot/plantillas')
      plantillasDisp = await rp.json()
      if (!Array.isArray(plantillasDisp)) plantillasDisp = []
    } catch(e) { plantillasDisp = [] }

    if (plantillasDisp.length) {
      const opts = plantillasDisp.map(p =>
        `<option value="${p.name}" data-idioma="${(p.language||'es_MX')}">${p.name} (${p.language||'es_MX'})</option>`
      ).join('')
      plantillasHtml = `
        <div style="margin-bottom:10px">
          <label style="font-size:0.78rem;color:#555;font-weight:600;display:block;margin-bottom:4px">Plantilla a usar:</label>
          <select id="modal-wa-plantilla" style="width:100%;border:1.5px solid #e5e7eb;border-radius:8px;padding:7px 10px;font-size:0.83rem">
            ${opts}
          </select>
        </div>`
    } else {
      plantillasHtml = `<div style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:10px 12px;margin-bottom:10px;font-size:0.78rem;color:#856404">
        ⚠️ No se encontraron plantillas aprobadas. Usa el botón <strong>"⚙️ Crear plantilla en Meta"</strong> y espera la aprobación.
      </div>`
    }
  }

  const modal = document.createElement('div')
  modal.id = 'modal-recordatorio'
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem'
  modal.innerHTML = `
    <div style="background:#fff;border-radius:16px;padding:1.5rem;width:100%;max-width:480px;box-shadow:0 20px 60px rgba(0,0,0,0.2)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
        <h3 style="margin:0;font-size:1rem;font-weight:700">${esWA ? '💬 Recordatorio por WhatsApp' : '📧 Recordatorio por Email'}</h3>
        <button onclick="document.getElementById('modal-recordatorio').remove()" style="border:none;background:none;font-size:1.3rem;cursor:pointer;color:#888;line-height:1">×</button>
      </div>

      ${esWA ? `
        ${plantillasHtml}
        <div style="background:#e8f5e9;border:1px solid #a5d6a7;border-radius:8px;padding:10px 12px;margin-bottom:10px;font-size:0.76rem;color:#2e7d32;line-height:1.5">
          <strong>WhatsApp solo entrega mensajes fuera de 24h si usas una plantilla UTILITY aprobada.</strong><br>
          Si el cliente te escribió hace menos de 24h puedes usar texto libre — si no, se requiere plantilla.
        </div>
      ` : `
        <p style="font-size:0.78rem;color:#888;margin-bottom:8px">Edita el mensaje antes de enviarlo:</p>
        <textarea id="modal-recordatorio-msg" rows="6"
          style="width:100%;border:1.5px solid #e5e7eb;border-radius:10px;padding:10px 12px;font-size:0.85rem;line-height:1.6;resize:vertical;font-family:inherit;box-sizing:border-box"
        >${msgDefault}</textarea>
      `}

      <div id="modal-recordatorio-error" style="display:none;margin-top:8px;background:#ffebee;border:1px solid #ef9a9a;border-radius:8px;padding:8px 12px;font-size:0.78rem;color:#c62828"></div>

      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:1rem">
        <button onclick="document.getElementById('modal-recordatorio').remove()"
          style="padding:8px 18px;border-radius:20px;border:1.5px solid #e5e7eb;background:none;color:#666;font-size:0.82rem;cursor:pointer">
          Cancelar
        </button>
        <button id="modal-recordatorio-btn" onclick="enviarRecordatorioConfirmado('${pedidoId}','${tipo}')"
          style="padding:8px 18px;border-radius:20px;border:none;background:${esWA ? '#25D366' : '#1a56db'};color:#fff;font-size:0.82rem;font-weight:700;cursor:pointer">
          ${esWA ? '💬 Enviar por WhatsApp' : '📧 Enviar Email'}
        </button>
      </div>
    </div>`
  document.body.appendChild(modal)
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove() })
}

window.enviarRecordatorioConfirmado = async function(pedidoId, tipo) {
  const btn = document.getElementById('modal-recordatorio-btn')
  const errBox = document.getElementById('modal-recordatorio-error')
  if (!btn) return
  btn.disabled = true
  btn.textContent = 'Enviando...'
  if (errBox) errBox.style.display = 'none'

  const url = tipo === 'wa'
    ? API + `/pedidos/${pedidoId}/recordatorio-whatsapp`
    : API + `/pedidos/${pedidoId}/recordatorio-email`

  let body = {}
  if (tipo === 'wa') {
    const sel = document.getElementById('modal-wa-plantilla')
    if (sel) {
      body.plantilla = sel.value
      body.idioma = sel.selectedOptions[0]?.dataset?.idioma || 'es_MX'
    }
  } else {
    body.mensaje = document.getElementById('modal-recordatorio-msg')?.value?.trim() || ''
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const data = await res.json()
    if (data.ok) {
      document.getElementById('modal-recordatorio')?.remove()
      const rows = document.querySelectorAll(`[data-pedido-id="${pedidoId}"]`)
      rows.forEach(r => r.style.opacity = '0.5')
    } else {
      btn.disabled = false
      btn.textContent = tipo === 'wa' ? '💬 Enviar por WhatsApp' : '📧 Enviar Email'
      if (errBox) {
        errBox.textContent = data.error || 'No se pudo enviar'
        errBox.style.display = 'block'
      }
    }
  } catch(e) {
    btn.disabled = false
    btn.textContent = tipo === 'wa' ? '💬 Enviar por WhatsApp' : '📧 Enviar Email'
    if (errBox) { errBox.textContent = 'Error de red: ' + e.message; errBox.style.display = 'block' }
  }
}

window.enviarRecordatorioEmail = (id, btn, nombre, total, metodo) =>
  window.abrirModalRecordatorio(id, 'email', nombre, total, metodo)
window.enviarRecordatorioWA    = (id, btn, nombre, total, metodo) =>
  window.abrirModalRecordatorio(id, 'wa', nombre, total, metodo)

window.crearPlantillaCatalogo = async function(btn) {
  const orig = btn.textContent
  btn.disabled = true
  btn.textContent = 'Creando...'
  try {
    const res = await fetch(API + '/chatbot/crear-plantilla-catalogo', { method: 'POST' })
    const data = await res.json()
    if (data.ok) {
      btn.textContent = '✅ Enviada a Meta'
      btn.style.borderColor = '#16a34a'
      btn.style.color = '#15803d'
      alert('Plantilla "catalogo_disponible" enviada a Meta para revisión como UTILITY. Una vez aprobada (minutos/horas), selecciónala en la pestaña Campaña para enviar sin restricción de 24h.')
    } else {
      btn.disabled = false
      btn.textContent = orig
      alert('Error: ' + (data.error || JSON.stringify(data)))
    }
  } catch(e) {
    btn.disabled = false
    btn.textContent = orig
    alert('Error de red: ' + e.message)
  }
}

window.crearPlantillaPago = async function(btn) {
  const orig = btn.textContent
  btn.disabled = true
  btn.textContent = 'Creando...'
  try {
    const res = await fetch(API + '/chatbot/crear-plantilla-pago', { method: 'POST' })
    const data = await res.json()
    if (data.ok) {
      btn.textContent = '✅ Plantilla enviada a Meta'
      btn.style.borderColor = '#16a34a'
      btn.style.color = '#15803d'
      alert('Plantilla enviada a Meta para revisión. Puede tardar unos minutos en aprobarse. Una vez APROBADA, el botón WhatsApp funcionará.')
    } else {
      btn.textContent = '❌ Error'
      btn.disabled = false
      alert('Error: ' + (data.error || JSON.stringify(data)))
    }
  } catch(e) {
    btn.textContent = orig
    btn.disabled = false
    alert('Error de red: ' + e.message)
  }
}

window.probarRecordatorio = async function() {
  const email = (document.getElementById('ca-test-email').value || '').trim()
  const msg = document.getElementById('ca-test-msg')
  msg.textContent = 'Enviando...'
  try {
    const res = await fetch(API + '/carrito-abandonado/test', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email })
    })
    const d = await res.json()
    if (d.ok) {
      msg.style.color = '#15803d'
      msg.innerHTML = `✅ Correo de prueba enviado a <strong>${d.enviado_a}</strong>. Revisa tu bandeja (y spam).`
    } else {
      msg.style.color = '#c62828'
      msg.textContent = d.resend_configurado === false ? '❌ Falta configurar RESEND_API_KEY en Railway' : '❌ No se pudo enviar'
    }
  } catch(e) {
    msg.style.color = '#c62828'; msg.textContent = '❌ Error: ' + e.message
  }
}

async function cargarEnvio() {
  const content = document.getElementById('content')
  content.innerHTML = '<p style="padding:2rem;color:var(--text-muted)">Cargando...</p>'
  try {
    const res = await fetch(API + '/config/envio')
    const cfg = await res.json()

    content.innerHTML = `
      <div style="max-width:560px">
        <div class="table-card" style="padding:2rem;margin-bottom:1rem">
          <h3 style="margin-bottom:0.25rem">🚚 Configuración de Envíos</h3>
          <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:1.5rem">
            Define el costo de envío y a partir de cuánto es gratis. Se aplica automáticamente en el carrito de la tienda.
          </p>

          <div style="display:grid;gap:1.2rem">

            <div style="background:var(--bg);border-radius:10px;padding:1rem;border:1px solid var(--border)">
              <p style="font-size:0.78rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:0.75rem">Tarifas por número de pares</p>
              <div style="display:grid;gap:10px">
                <div style="display:flex;align-items:center;gap:10px">
                  <span style="font-size:0.82rem;min-width:80px">1 par</span>
                  <span style="color:var(--text-muted)">$</span>
                  <input type="number" id="envio-tier1" value="${cfg.tier1 ?? 99}" min="0" step="1"
                    style="border:1.5px solid var(--border);border-radius:8px;padding:8px 12px;font-size:0.9rem;width:110px;outline:none">
                  <span style="font-size:0.82rem;color:var(--text-muted)">MXN</span>
                </div>
                <div style="display:flex;align-items:center;gap:10px">
                  <span style="font-size:0.82rem;min-width:80px">2 pares</span>
                  <span style="color:var(--text-muted)">$</span>
                  <input type="number" id="envio-tier2" value="${cfg.tier2 ?? 150}" min="0" step="1"
                    style="border:1.5px solid var(--border);border-radius:8px;padding:8px 12px;font-size:0.9rem;width:110px;outline:none">
                  <span style="font-size:0.82rem;color:var(--text-muted)">MXN</span>
                </div>
                <div style="display:flex;align-items:center;gap:10px">
                  <span style="font-size:0.82rem;min-width:80px">3+ pares</span>
                  <span style="color:var(--text-muted)">$</span>
                  <input type="number" id="envio-tier3" value="${cfg.tier3 ?? 199}" min="0" step="1"
                    style="border:1.5px solid var(--border);border-radius:8px;padding:8px 12px;font-size:0.9rem;width:110px;outline:none">
                  <span style="font-size:0.82rem;color:var(--text-muted)">MXN</span>
                </div>
              </div>
            </div>

            <div>
              <label style="font-size:0.78rem;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:0.4rem">
                Envío gratis a partir de
              </label>
              <div style="display:flex;align-items:center;gap:8px">
                <span style="color:var(--text-muted)">$</span>
                <input type="number" id="envio-gratis-desde" value="${cfg.gratis_desde ?? 1299}"
                  min="0" step="1"
                  style="border:1.5px solid var(--border);border-radius:8px;padding:10px 14px;font-size:0.95rem;width:160px;outline:none">
                <span style="font-size:0.82rem;color:var(--text-muted)">MXN de compra</span>
              </div>
            </div>

            <div style="background:#f0fdf4;border-radius:10px;padding:1rem;font-size:0.82rem;color:#166534;border:1px solid #bbf7d0">
              <strong style="display:block;margin-bottom:6px">📋 Resumen actual:</strong>
              <div>1 par → <strong id="prev-t1">$${cfg.tier1 ?? 99}</strong> MXN</div>
              <div>2 pares → <strong id="prev-t2">$${cfg.tier2 ?? 150}</strong> MXN</div>
              <div>3+ pares → <strong id="prev-t3">$${cfg.tier3 ?? 199}</strong> MXN</div>
              <div style="margin-top:6px;padding-top:6px;border-top:1px solid #bbf7d0">
                Pedidos ≥ <strong id="prev-gratis">$${cfg.gratis_desde ?? 1299}</strong> MXN → <strong style="color:#15803d">Envío gratis 🎉</strong>
              </div>
            </div>

            <div id="envio-msg" style="display:none;padding:10px 14px;border-radius:8px;font-size:0.85rem"></div>

            <div>
              <button class="btn btn-primary" onclick="guardarEnvio()">💾 Guardar configuración</button>
            </div>
          </div>
        </div>

        <div class="table-card" style="padding:1.5rem">
          <h4 style="margin-bottom:0.5rem">📦 Paqueterías que usas</h4>
          <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:0.75rem">
            Referencia para tu equipo al hacer los envíos. Actualmente no integradas con tarifas automáticas.
          </p>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <span style="background:#e8f4fd;color:#0066cc;padding:6px 14px;border-radius:20px;font-size:0.8rem;font-weight:600">FedEx</span>
            <span style="background:#fff3cd;color:#856404;padding:6px 14px;border-radius:20px;font-size:0.8rem;font-weight:600">DHL</span>
            <span style="background:#e8f5e9;color:#2e7d32;padding:6px 14px;border-radius:20px;font-size:0.8rem;font-weight:600">Estafeta</span>
          </div>
          <p style="font-size:0.75rem;color:var(--text-muted);margin-top:10px">
            ¿Quieres calcular tarifas automáticas por código postal? Podemos integrar la API de Estafeta o FedEx en el futuro.
          </p>
        </div>
      </div>`

    // Preview en vivo
    const previewMap = { 'envio-tier1':'prev-t1', 'envio-tier2':'prev-t2', 'envio-tier3':'prev-t3', 'envio-gratis-desde':'prev-gratis' }
    Object.entries(previewMap).forEach(([inputId, previewId]) => {
      const el = document.getElementById(inputId)
      if (el) el.addEventListener('input', e => {
        const p = document.getElementById(previewId)
        if (p) p.textContent = '$' + (e.target.value || 0)
      })
    })

  } catch(e) {
    document.getElementById('content').innerHTML = `<p style="padding:2rem;color:red">Error: ${e.message}</p>`
  }
}

window.guardarEnvio = async function() {
  const tier1 = parseFloat(document.getElementById('envio-tier1').value)
  const tier2 = parseFloat(document.getElementById('envio-tier2').value)
  const tier3 = parseFloat(document.getElementById('envio-tier3').value)
  const gratis_desde = parseFloat(document.getElementById('envio-gratis-desde').value)
  if ([tier1, tier2, tier3, gratis_desde].some(isNaN)) return
  const msg = document.getElementById('envio-msg')
  try {
    const res = await fetch(API + '/config/envio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier1, tier2, tier3, gratis_desde })
    })
    const data = await res.json()
    msg.style.display = ''
    if (data.ok) {
      msg.style.background = '#e8f5e9'; msg.style.color = '#2e7d32'
      msg.textContent = '✅ Configuración guardada correctamente'
    } else {
      msg.style.background = '#fdecea'; msg.style.color = '#c62828'
      msg.textContent = '❌ Error: ' + (data.error || 'desconocido')
    }
    setTimeout(() => { msg.style.display = 'none' }, 3000)
  } catch(e) {
    msg.style.display = ''
    msg.style.background = '#fdecea'; msg.style.color = '#c62828'
    msg.textContent = '❌ Error al guardar'
  }
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
          <h3 style="margin-bottom:1rem">🗂️ Colecciones WhatsApp</h3>
          <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:1rem">Crea automáticamente las colecciones por categoría en el catálogo de Meta (Tacones, Sandalias, Botas, etc.) para que los clientes puedan navegar desde WhatsApp.</p>
          <div id="seo-colecciones-resultado" style="display:none;margin-bottom:1rem;padding:1rem;border-radius:8px;font-size:0.82rem"></div>
          <button onclick="sincronizarColeccionesMeta()" class="btn btn-primary" id="btn-sync-colecciones">🗂️ Sincronizar colecciones en Meta</button>
        </div>

        <div class="table-card" style="padding:2rem;margin-bottom:1rem">
          <h3 style="margin-bottom:0.5rem">🟡 MercadoLibre — Inventario</h3>
          <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:1.5rem">
            Sincroniza el stock de tus <b>96 publicaciones</b> de MercadoLibre con el ERP.<br>
            Primero verifica las diferencias y luego sincroniza.
          </p>
          <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1rem">
            <button onclick="mlVerStock(this)"
               style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.65rem 1.2rem;background:#f59e0b;color:#fff;border-radius:8px;font-weight:600;font-size:0.9rem;border:none;cursor:pointer">
              🔍 Ver diferencias ERP vs ML
            </button>
            <button onclick="mlSincronizar(this)"
               style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.65rem 1.2rem;background:#10B981;color:#fff;border-radius:8px;font-weight:600;font-size:0.9rem;border:none;cursor:pointer">
              🔄 Sincronizar stock ahora
            </button>
            <button onclick="mlVerLog(this)"
               style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.65rem 1.2rem;background:#6366f1;color:#fff;border-radius:8px;font-weight:600;font-size:0.9rem;border:none;cursor:pointer">
              📋 Ver resultado
            </button>
          </div>
          <div id="ml-resultado" style="display:none;margin-top:1rem;padding:1rem;background:var(--bg-secondary);border-radius:8px;font-size:0.82rem;max-height:320px;overflow-y:auto;white-space:pre-wrap;font-family:monospace"></div>
        </div>

        <!-- ── MercadoLibre: Publicar nuevo estilo ── -->
        <div class="table-card" style="padding:2rem;margin-bottom:1rem">
          <h3 style="margin-bottom:0.5rem">🟡 MercadoLibre — Publicar nuevo estilo</h3>
          <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:1.5rem">
            Crea publicaciones individuales por variante (color+talla) directo desde el ERP.
            Usa <b>Solo preview</b> para revisar el payload antes de publicar.
          </p>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
            <div>
              <label style="font-size:0.8rem;font-weight:600;display:block;margin-bottom:4px">SKU del producto</label>
              <input id="ml-pub-sku" type="text" placeholder="Ej: M-TAC-0022"
                style="width:100%;padding:0.5rem;border:1px solid var(--border);border-radius:6px;font-size:0.85rem;background:var(--bg-primary);color:var(--text-primary)">
            </div>
            <div>
              <label style="font-size:0.8rem;font-weight:600;display:block;margin-bottom:4px">Tipo de listing</label>
              <select id="ml-pub-listing"
                style="width:100%;padding:0.5rem;border:1px solid var(--border);border-radius:6px;font-size:0.85rem;background:var(--bg-primary);color:var(--text-primary)">
                <option value="free">Gratis (free)</option>
                <option value="bronze">Bronce</option>
                <option value="silver">Plata</option>
                <option value="gold_pro" selected>Oro Pro (como los actuales)</option>
              </select>
            </div>
          </div>

          <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1rem">
            <button onclick="mlPublicarPreview(this)"
              style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.65rem 1.2rem;background:#0284c7;color:#fff;border-radius:8px;font-weight:600;font-size:0.9rem;border:none;cursor:pointer">
              👁️ Solo preview (sin publicar)
            </button>
            <button onclick="mlPublicarReal(this)"
              style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.65rem 1.2rem;background:#16a34a;color:#fff;border-radius:8px;font-weight:600;font-size:0.9rem;border:none;cursor:pointer">
              🚀 Publicar en ML
            </button>
          </div>
          <div id="ml-pub-resultado" style="display:none;margin-top:1rem;padding:1rem;background:var(--bg-secondary);border-radius:8px;font-size:0.82rem;max-height:500px;overflow-y:auto;white-space:pre-wrap;font-family:monospace"></div>
        </div>

        <div class="table-card" style="padding:2rem;margin-bottom:1rem">
          <h3 style="margin-bottom:0.5rem">🎵 TikTok Shop — Sincronización</h3>
          <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:1.5rem">
            Descarga los archivos Excel listos para subir al <b>TikTok Shop Seller Center</b>.<br>
            <b>Paso 1:</b> Importa todos los productos (primera vez).<br>
            <b>Paso 2:</b> Actualiza el stock cuando cambie tu inventario.
          </p>
          <div style="display:flex;gap:1rem;flex-wrap:wrap">
            <button onclick="descargarExcelTikTok(this,'import-excel','tiktok_importacion.csv')"
               style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.65rem 1.2rem;background:#6366f1;color:#fff;border-radius:8px;font-weight:600;font-size:0.9rem;border:none;cursor:pointer">
              📥 Descargar Excel de Importación
            </button>
            <button onclick="descargarExcelTikTok(this,'stock-excel','tiktok_stock.csv')"
               style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.65rem 1.2rem;background:#10B981;color:#fff;border-radius:8px;font-weight:600;font-size:0.9rem;border:none;cursor:pointer">
              📊 Descargar Excel de Stock
            </button>
          </div>
          <div style="margin-top:1rem;padding:0.8rem;background:var(--bg-secondary);border-radius:8px;font-size:0.78rem;color:var(--text-muted)">
            <b>Cómo usar:</b>
            1. Elimina los productos actuales en TikTok Shop.
            2. Descarga "Excel de Importación" → súbelo en <i>Gestionar productos → Agregar producto</i>.
            3. Cuando cambie tu stock, descarga "Excel de Stock" y súbelo en <i>Administrar existencias → Reabastecer en lote</i>.
          </div>
        </div>
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
  <h3 style="margin-bottom:1.5rem">Imagen Hero (portada)</h3>
  <div style="display:grid;gap:1rem">
    <div>
      <label class="form-label">URL de imagen de fondo</label>
      <input class="form-input" id="seo-hero-img" value="${(config.hero_imagen||'').replace(/"/g, '')}" placeholder="https://res.cloudinary.com/...">
      <p style="font-size:0.72rem;color:var(--text-muted);margin-top:4px">Pega la URL de Cloudinary de la imagen que quieres como fondo de la portada</p>
    </div>
    ${(config.hero_imagen || '') !== '' ? '<img src="' + (config.hero_imagen||'') + '" style="max-height:160px;object-fit:cover;border-radius:8px;border:1px solid #eee">' : ''}
  </div>
</div>
<div>
  <label class="form-label">URL Favicon</label>
  <input class="form-input" id="seo-favicon" value="${(config.favicon_url||'').replace(/"/g, '')}" placeholder="https://res.cloudinary.com/...">
  <p style="font-size:0.72rem;color:var(--text-muted);margin-top:4px">Icono que aparece en la pestaña del navegador (recomendado 32x32px)</p>
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
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem">
            <div>
              <label class="form-label">Lunes</label>
              <input class="form-input" id="seo-hor-lunes" value="${config.horario_lunes || '10:00 - 15:00'}" placeholder="10:00 - 15:00">
            </div>
            <div>
              <label class="form-label">Martes a Viernes</label>
              <input class="form-input" id="seo-hor1" value="${config.horario_semana}" placeholder="10:00 - 19:00">
            </div>
            <div>
              <label class="form-label">Sabado</label>
              <input class="form-input" id="seo-hor2" value="${config.horario_sabado}" placeholder="10:00 - 15:00">
            </div>
          </div>
        </div>

        <div class="table-card" style="padding:2rem;margin-bottom:1rem">
  <h3 style="margin-bottom:1rem">Herramientas y Feeds</h3>
  <div style="display:flex;gap:1rem;flex-wrap:wrap">
    <a href="https://zapatillasmay-production.up.railway.app/sitemap.xml" target="_blank" class="btn btn-secondary">🗺️ Sitemap.xml</a>
    <a href="https://zapatillasmay-production.up.railway.app/robots.txt" target="_blank" class="btn btn-secondary">🤖 Robots.txt</a>
    <a href="https://zapatillasmay-production.up.railway.app/feed/meta.xml" target="_blank" class="btn btn-secondary">📘 Feed Meta</a>
    <a href="https://zapatillasmay-production.up.railway.app/feed/google.xml" target="_blank" class="btn btn-secondary">🛍️ Feed Google</a>
    <a href="https://zapatillasmay-production.up.railway.app/feed/tiktok.json" target="_blank" class="btn btn-secondary">🎵 Feed TikTok</a>
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
    favicon_url: document.getElementById('seo-favicon').value,
    hero_imagen: document.getElementById('seo-hero-img').value,
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
    horario_lunes: document.getElementById('seo-hor-lunes').value,
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

// ═══════════════════════════════════════════════════════
//  MÓDULO CATÁLOGOS  (v2 — selector + generador canvas)
// ═══════════════════════════════════════════════════════

async function cargarCatalogos() {
  const content = document.getElementById('content')
  try {
    const res = await fetch(API + '/catalogos/todos')
    const catalogos = await res.json()
    content.innerHTML = `
      <div class="table-card">
        <div class="table-header">
          <h3>Catálogos (${catalogos.length})</h3>
          <button class="btn btn-primary" onclick="mostrarFormCatalogo()">+ Nuevo catálogo</button>
        </div>
        <div id="catalogos-form-area"></div>

        <!-- Catálogos por categoría -->
        <div style="background:#fef9f5;border:1px solid #fde8d8;border-radius:12px;padding:16px;margin-bottom:20px">
          <p style="font-size:0.85rem;font-weight:700;color:#7c3a1a;margin-bottom:4px">📥 Descargar catálogo por categoría</p>
          <p style="font-size:0.78rem;color:#A07860;margin-bottom:12px">Genera un PDF con todos los productos activos de esa categoría. Se actualiza automáticamente.</p>
          <div style="display:flex;flex-wrap:wrap;gap:8px" id="cat-pdf-btns">
            ${[['tacones','👠 Tacones'],['sandalias','👡 Sandalias'],['botas','🥾 Botas'],['botines','👢 Botines'],['flats','🥿 Flats'],['plataformas','⬆️ Plataformas'],['tenis','👟 Tenis'],['nina','🎀 Niña'],['accesorios','👜 Accesorios']].map(([id,label]) =>
              `<button onclick="descargarCatalogoPorCategoria('${id}','${label}')" style="background:white;border:1.5px solid #C8967A;border-radius:8px;padding:6px 14px;font-size:0.78rem;font-weight:600;color:#7c3a1a;cursor:pointer">${label}</button>`
            ).join('')}
          </div>
          <p id="cat-pdf-msg" style="font-size:0.78rem;color:#C8967A;margin-top:10px;display:none"></p>
        </div>
        ${catalogos.length === 0 ? `
          <div style="padding:3rem;text-align:center;color:#888">
            <div style="font-size:2.5rem;margin-bottom:12px">📖</div>
            <p>Aún no tienes catálogos. ¡Crea el primero!</p>
          </div>` : `
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:20px;padding:8px 0 4px">
          ${catalogos.map(c => `
            <div style="background:white;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06)">
              ${c.portada_url
                ? `<img src="${c.portada_url}" style="width:100%;aspect-ratio:3/4;object-fit:cover;display:block;background:#f3f4f6">`
                : `<div style="width:100%;aspect-ratio:3/4;background:#f3f4f6;display:flex;align-items:center;justify-content:center;font-size:3rem">📖</div>`}
              <div style="padding:14px">
                ${c.temporada ? `<p style="font-size:0.68rem;letter-spacing:2px;color:#C8967A;text-transform:uppercase;margin-bottom:4px">${c.temporada}</p>` : ''}
                <p style="font-weight:600;font-size:0.95rem;margin-bottom:4px">${c.nombre}</p>
                <p style="font-size:0.75rem;color:#888;margin-bottom:12px">${c.activo ? '✅ Visible' : '🔴 Oculto'}</p>
                <div style="display:flex;flex-direction:column;gap:6px">
                  <button class="btn btn-primary" style="padding:6px;font-size:0.8rem" onclick="gestionarPaginas('${c.id}','${(c.nombre||'').replace(/'/g,"\\'")}')">📄 Gestionar páginas</button>
                  <button class="btn btn-secondary" style="padding:6px;font-size:0.8rem" onclick="window.open('https://zapatillasmay.mx/catalogo?abrir=${c.id}','_blank')">👁 Vista previa</button>
                  <div style="display:flex;gap:6px">
                    <button class="btn btn-secondary" style="flex:1;padding:5px;font-size:0.75rem" onclick="mostrarFormCatalogo('${c.id}')">✏️ Editar</button>
                    <button class="btn btn-secondary" style="flex:1;padding:5px;font-size:0.75rem;color:${c.activo?'#dc2626':'#16a34a'}" onclick="toggleCatalogo('${c.id}',${c.activo})">${c.activo?'Ocultar':'Publicar'}</button>
                  </div>
                </div>
              </div>
            </div>`).join('')}
        </div>`}
      </div>`
  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error cargando catálogos: ' + e.message + '</p>'
  }
}

window.mostrarFormCatalogo = function(id = null) {
  const area = document.getElementById('catalogos-form-area')
  if (!area) return
  area.innerHTML = `
    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin-bottom:20px">
      <h4 style="margin-bottom:16px;font-size:0.95rem">${id ? '✏️ Editar catálogo' : '➕ Nuevo catálogo'}</h4>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
        <div>
          <label style="font-size:0.78rem;font-weight:600;color:#374151;display:block;margin-bottom:4px">Nombre *</label>
          <input class="form-input" id="cat-nombre" placeholder="Ej: Colección Primavera 2026" style="width:100%">
        </div>
        <div>
          <label style="font-size:0.78rem;font-weight:600;color:#374151;display:block;margin-bottom:4px">Temporada</label>
          <input class="form-input" id="cat-temporada" placeholder="Ej: PV26" style="width:100%">
        </div>
      </div>
      <div style="margin-bottom:12px">
        <label style="font-size:0.78rem;font-weight:600;color:#374151;display:block;margin-bottom:4px">Imagen de portada</label>
        <div style="display:flex;align-items:center;gap:10px">
          <button class="btn btn-secondary" style="padding:6px 14px;font-size:0.8rem" onclick="document.getElementById('cat-portada-file').click()">📁 Subir imagen</button>
          <input type="file" id="cat-portada-file" accept="image/*" style="display:none" onchange="previewPortadaCat(this)">
          <span id="cat-portada-nombre" style="font-size:0.8rem;color:#888">Ningún archivo seleccionado</span>
        </div>
        <div id="cat-portada-preview" style="margin-top:8px"></div>
        <input type="hidden" id="cat-portada-url" value="">
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-primary" onclick="guardarCatalogo('${id||''}')">💾 Guardar</button>
        <button class="btn btn-secondary" onclick="document.getElementById('catalogos-form-area').innerHTML=''">Cancelar</button>
      </div>
    </div>`

  if (id) {
    // Cargar datos actuales
    fetch(API + '/catalogos/' + id)
      .then(r => r.json())
      .then(data => {
        const c = Array.isArray(data) ? data[0] : data
        if (!c) return
        document.getElementById('cat-nombre').value = c.nombre || ''
        document.getElementById('cat-temporada').value = c.temporada || ''
        if (c.portada_url) {
          document.getElementById('cat-portada-url').value = c.portada_url
          document.getElementById('cat-portada-nombre').textContent = 'Portada actual'
          document.getElementById('cat-portada-preview').innerHTML =
            `<img src="${c.portada_url}" style="height:80px;border-radius:6px;object-fit:cover">`
        }
      })
  }
}

window.previewPortadaCat = function(input) {
  const file = input.files[0]
  if (!file) return
  document.getElementById('cat-portada-nombre').textContent = file.name
  const reader = new FileReader()
  reader.onload = e => {
    document.getElementById('cat-portada-preview').innerHTML =
      `<img src="${e.target.result}" style="height:80px;border-radius:6px;object-fit:cover">`
  }
  reader.readAsDataURL(file)
}

window.guardarCatalogo = async function(id) {
  const nombre = document.getElementById('cat-nombre').value.trim()
  if (!nombre) { alert('El nombre es obligatorio'); return }
  const temporada = document.getElementById('cat-temporada').value.trim()
  let portada_url = document.getElementById('cat-portada-url').value

  // Subir portada si hay archivo nuevo
  const fileInput = document.getElementById('cat-portada-file')
  if (fileInput.files.length > 0) {
    const formData = new FormData()
    formData.append('archivo', fileInput.files[0])
    formData.append('carpeta', 'catalogos')
    try {
      const res = await fetch(API + '/imagenes/subir?carpeta=catalogos', { method: 'POST', body: formData })
      const data = await res.json()
      portada_url = data.url || portada_url
    } catch(e) {
      alert('Error subiendo portada: ' + e.message); return
    }
  }

  const payload = { nombre, temporada, portada_url: portada_url || null }
  try {
    if (id) {
      await fetch(API + '/catalogos/' + id, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    } else {
      await fetch(API + '/catalogos/', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    }
    await cargarCatalogos()
  } catch(e) {
    alert('Error guardando: ' + e.message)
  }
}

window.toggleCatalogo = async function(id, activo) {
  if (!confirm(activo ? '¿Ocultar este catálogo de la tienda?' : '¿Publicar este catálogo en la tienda?')) return
  await fetch(API + '/catalogos/' + id, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ activo: !activo }) })
  await cargarCatalogos()
}

// ── GESTIÓN DE PÁGINAS ────────────────────────────────────

window.gestionarPaginas = async function(catalogoId, nombre) {
  const content = document.getElementById('content')
  content.innerHTML = '<p style="padding:2rem;color:#888">Cargando...</p>'
  try {
    const [resCat, resPag] = await Promise.all([
      fetch(API + '/catalogos/' + catalogoId),
      fetch(API + '/catalogos/' + catalogoId + '/paginas')
    ])
    const catData = await resCat.json()
    const catInfo = Array.isArray(catData) ? catData[0] : catData
    const paginas = await resPag.json()
    window._catalogoPaginasData = { catalogoId, nombre, paginas, tabActiva: 'subir', portada_url: catInfo?.portada_url || null }
    renderGestionPaginas()
  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error: ' + e.message + '</p>'
  }
}

function _tabStyle(activa, id) {
  return `padding:9px 18px;font-size:0.83rem;font-weight:600;border:none;cursor:pointer;border-bottom:3px solid ${activa===id?'#C8967A':'transparent'};background:none;color:${activa===id?'#C8967A':'#6b7280'};transition:all 0.2s;font-family:inherit`
}

function renderGestionPaginas() {
  const { catalogoId, nombre, paginas, tabActiva, portada_url } = window._catalogoPaginasData
  const content = document.getElementById('content')
  const nextNum = paginas.length > 0 ? Math.max(...paginas.map(p => p.pagina_numero)) + 1 : 1

  content.innerHTML = `
    <div class="table-card">
      <div class="table-header">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <button class="btn btn-secondary" style="padding:5px 12px;font-size:0.8rem" onclick="navegarA('catalogos')">← Catálogos</button>
          <h3>📖 ${nombre} <span style="color:#888;font-weight:400">(${paginas.length} páginas)</span></h3>
          <button class="btn btn-secondary" style="padding:5px 12px;font-size:0.8rem;margin-left:auto" onclick="window.open('https://zapatillasmay.mx/catalogo?abrir=${catalogoId}','_blank')">👁 Vista previa</button>
        </div>
      </div>

      <!-- Tabs -->
      <div style="display:flex;border-bottom:2px solid #e5e7eb;margin-bottom:20px;gap:4px">
        <button style="${_tabStyle(tabActiva,'subir')}" onclick="switchTabCat('subir')">📁 Subir imágenes</button>
        <button style="${_tabStyle(tabActiva,'seleccionar')}" onclick="switchTabCat('seleccionar')">🖼 De la tienda</button>
        <button style="${_tabStyle(tabActiva,'generar')}" onclick="switchTabCat('generar')">✨ Generar automático</button>
      </div>

      <!-- Tab: SUBIR -->
      <div id="tab-subir" style="display:${tabActiva==='subir'?'block':'none'}">
        <div style="border:2px dashed #e5e7eb;border-radius:12px;padding:32px;text-align:center;cursor:pointer;transition:border-color 0.2s"
             onclick="document.getElementById('cat-pag-files').click()"
             ondragover="event.preventDefault();this.style.borderColor='#C8967A'"
             ondragleave="this.style.borderColor='#e5e7eb'"
             ondrop="event.preventDefault();this.style.borderColor='#e5e7eb';subirPaginasCatalogo({files:event.dataTransfer.files},'${catalogoId}')">
          <div style="font-size:2.5rem;margin-bottom:10px">🖼️</div>
          <p style="font-weight:600;margin-bottom:4px">Arrastra imágenes aquí o haz click</p>
          <p style="font-size:0.8rem;color:#888">Selecciona varias a la vez — se agregan en orden alfabético</p>
          <button class="btn btn-primary" style="margin-top:14px" onclick="event.stopPropagation();document.getElementById('cat-pag-files').click()">+ Seleccionar imágenes</button>
        </div>
        <input type="file" id="cat-pag-files" accept="image/*" multiple style="display:none" onchange="subirPaginasCatalogo(this,'${catalogoId}')">
        <div id="upload-progress" style="display:none;margin-top:14px;padding:12px;background:#eff6ff;border-radius:8px">
          <p id="upload-msg" style="font-size:0.85rem;color:#1d4ed8;margin-bottom:6px">Subiendo...</p>
          <div style="height:6px;background:#dbeafe;border-radius:3px">
            <div id="upload-bar" style="height:100%;background:#3b82f6;border-radius:3px;transition:width 0.3s;width:0%"></div>
          </div>
        </div>
      </div>

      <!-- Tab: SELECCIONAR DE LA TIENDA -->
      <div id="tab-seleccionar" style="display:${tabActiva==='seleccionar'?'block':'none'}">
        <div id="selector-tienda-content">
          <p style="color:#888;font-size:0.85rem;margin-bottom:12px">Cargando fotos de tus productos...</p>
        </div>
      </div>

      <!-- Tab: GENERAR AUTOMÁTICO -->
      <div id="tab-generar" style="display:${tabActiva==='generar'?'block':'none'}">
        <div id="generador-content">
          <p style="color:#888;font-size:0.85rem;margin-bottom:12px">Cargando productos...</p>
        </div>
      </div>

      <!-- Páginas actuales -->
      <div style="margin-top:28px">
        ${(portada_url || paginas.length > 0) ? `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
          <h4 style="font-size:0.85rem;font-weight:700;color:#374151;margin:0;text-transform:uppercase;letter-spacing:1px">Páginas del catálogo</h4>
          <button onclick="descargarCatalogoPDF()" style="background:#C8967A;color:white;border:none;border-radius:8px;padding:7px 14px;font-size:0.78rem;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px">
            📥 Descargar PDF
          </button>
        </div>
        <div id="paginas-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px">
          ${portada_url ? `
            <div style="background:white;border:2px solid #C8967A;border-radius:10px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.05)">
              <img src="${portada_url}" style="width:100%;aspect-ratio:3/4;object-fit:cover;display:block;background:#f3f4f6">
              <div style="padding:6px 8px;background:#fff8f5">
                <div style="font-size:0.7rem;font-weight:700;color:#C8967A;margin-bottom:2px">🖼 Portada</div>
                <div style="font-size:0.65rem;color:#888">Primera página</div>
              </div>
            </div>` : ''}
          ${paginas.map((p, i) => `
            <div style="background:white;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.05)">
              <img src="${p.imagen_url}" style="width:100%;aspect-ratio:3/4;object-fit:cover;display:block;background:#f3f4f6">
              <div style="padding:6px 8px">
                <div style="font-size:0.7rem;font-weight:600;color:#374151;margin-bottom:4px">Pág ${p.pagina_numero}</div>
                <div style="display:flex;gap:3px;flex-wrap:wrap">
                  ${i > 0 ? `<button onclick="moverPagina('${p.id}','up')" title="Mover arriba" style="flex:1;background:#f3f4f6;border:none;border-radius:4px;cursor:pointer;padding:3px;font-size:0.7rem">↑</button>` : ''}
                  ${i < paginas.length-1 ? `<button onclick="moverPagina('${p.id}','down')" title="Mover abajo" style="flex:1;background:#f3f4f6;border:none;border-radius:4px;cursor:pointer;padding:3px;font-size:0.7rem">↓</button>` : ''}
                  <button onclick="usarComoPortada('${p.imagen_url}','${catalogoId}')" title="Usar como portada" style="flex:1;background:#fef3c7;border:none;border-radius:4px;cursor:pointer;padding:3px;font-size:0.7rem">🖼</button>
                  <button onclick="eliminarPagina('${p.id}','${catalogoId}')" title="Eliminar" style="flex:1;background:#fee2e2;border:none;border-radius:4px;cursor:pointer;padding:3px;font-size:0.7rem;color:#dc2626">✕</button>
                </div>
              </div>
            </div>`).join('')}
        </div>` : `
        <div style="text-align:center;padding:24px;color:#9ca3af;border:1px dashed #e5e7eb;border-radius:10px">
          <p>Aún no hay páginas. Usa una de las opciones de arriba para agregarlas.</p>
        </div>`}
      </div>
    </div>`

  // Inicializar tab activa
  if (tabActiva === 'seleccionar') _cargarSelectorTienda(catalogoId)
  if (tabActiva === 'generar') _cargarGenerador(catalogoId)
}

window.switchTabCat = function(tab) {
  const { catalogoId } = window._catalogoPaginasData
  window._catalogoPaginasData.tabActiva = tab
  document.querySelectorAll('#tab-subir,#tab-seleccionar,#tab-generar').forEach(el => el.style.display = 'none')
  document.getElementById('tab-' + tab).style.display = 'block'
  // Actualizar estilos de botones
  document.querySelectorAll('[onclick^="switchTabCat"]').forEach(btn => {
    const t = btn.getAttribute('onclick').match(/'(\w+)'/)?.[1]
    btn.style.borderBottomColor = t === tab ? '#C8967A' : 'transparent'
    btn.style.color = t === tab ? '#C8967A' : '#6b7280'
  })
  if (tab === 'seleccionar') _cargarSelectorTienda(catalogoId)
  if (tab === 'generar') _cargarGenerador(catalogoId)
}

// ── DESCARGAR CATÁLOGO PDF ──────────────────────────────────

window.descargarCatalogoPDF = async function() {
  const data = window._catalogoPaginasData
  if (!data) return
  const { portada_url, paginas, nombre } = data

  const imagenes = []
  if (portada_url) imagenes.push(portada_url)
  const paginasOrdenadas = [...paginas].sort((a, b) => a.pagina_numero - b.pagina_numero)
  paginasOrdenadas.forEach(p => { if (p.imagen_url) imagenes.push(p.imagen_url) })

  if (imagenes.length === 0) {
    alert('No hay páginas para descargar.')
    return
  }

  const btn = document.querySelector('[onclick="descargarCatalogoPDF()"]')
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Generando PDF...' }

  try {
    // Cargar jsPDF dinámicamente si no está disponible
    if (!window.jspdf) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script')
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
        s.onload = resolve; s.onerror = reject
        document.head.appendChild(s)
      })
    }
    const { jsPDF } = window.jspdf

    // Cargar todas las imágenes como dataURL
    const cargarImg = (url) => new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth || img.width
        canvas.height = img.naturalHeight || img.height
        canvas.getContext('2d').drawImage(img, 0, 0)
        resolve({ dataUrl: canvas.toDataURL('image/jpeg', 0.92), w: canvas.width, h: canvas.height })
      }
      img.onerror = () => resolve(null)
      img.src = url
    })

    const imgs = await Promise.all(imagenes.map(cargarImg))
    const validas = imgs.filter(Boolean)

    if (validas.length === 0) {
      alert('No se pudieron cargar las imágenes. Revisa tu conexión.')
      return
    }

    // Página fija 3:4 portrait para todo (210×280mm)
    // Las páginas del catálogo (1080×1440 = exactamente 3:4) llenan perfecto.
    // Si la portada tiene otro ratio, se centra con fondo blanco (contain).
    const pdfW = 210, pdfH = 280
    const pdf = new jsPDF({ unit: 'mm', format: [pdfW, pdfH] })

    const _addImgContain = (img, isFirst) => {
      if (!isFirst) pdf.addPage([pdfW, pdfH])
      const ir = img.w / img.h, pr = pdfW / pdfH
      let dw, dh, dx, dy
      if (ir > pr) { dw = pdfW; dh = pdfW / ir; dx = 0; dy = (pdfH - dh) / 2 }
      else         { dh = pdfH; dw = pdfH * ir;  dy = 0; dx = (pdfW - dw) / 2 }
      pdf.addImage(img.dataUrl, 'JPEG', dx, dy, dw, dh)
    }

    validas.forEach((img, i) => _addImgContain(img, i === 0))

    const nombreArchivo = (nombre || 'catalogo').replace(/[^a-zA-Z0-9_\-áéíóúñÁÉÍÓÚÑ ]/g, '').trim() || 'catalogo'
    pdf.save(`${nombreArchivo}.pdf`)
  } catch(e) {
    console.error('Error generando PDF:', e)
    alert('Error al generar el PDF: ' + e.message)
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = '📥 Descargar PDF' }
  }
}

// ── TAB: SELECCIONAR DE LA TIENDA ──────────────────────────

async function _cargarSelectorTienda(catalogoId) {
  const cont = document.getElementById('selector-tienda-content')
  if (!cont) return
  try {
    const [resV, resP] = await Promise.all([
      fetch(API + '/variantes/'),
      fetch(API + '/productos/')
    ])
    const variantes = await resV.json()
    const productos = await resP.json()

    // Recopilar todas las fotos únicas con contexto
    const fotos = []
    variantes.forEach(v => {
      const prod = productos.find(p => p.id === v.producto_id)
      const nombre = prod?.nombre || v.sku || ''
      if (v.foto_url) fotos.push({ url: v.foto_url, nombre, color: v.color || '' })
      if (v.imagenes && Array.isArray(v.imagenes)) {
        v.imagenes.forEach(u => { if (u && u !== v.foto_url) fotos.push({ url: u, nombre, color: v.color || '' }) })
      }
    })
    // Eliminar duplicados por URL
    const unicas = fotos.filter((f, i, a) => a.findIndex(x => x.url === f.url) === i)

    window._selectorFotos = { fotos: unicas, seleccionadas: new Set() }

    cont.innerHTML = `
      <div style="margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
        <p style="font-size:0.83rem;color:#374151">${unicas.length} fotos disponibles — haz click para seleccionar</p>
        <div style="display:flex;gap:8px">
          <span id="sel-count" style="font-size:0.83rem;color:#C8967A;font-weight:600">0 seleccionadas</span>
          <button class="btn btn-primary" style="padding:6px 14px;font-size:0.8rem" onclick="agregarSeleccionadas('${catalogoId}')">✅ Agregar seleccionadas</button>
        </div>
      </div>
      <input class="form-input" placeholder="🔍 Buscar por nombre o color..." style="width:100%;margin-bottom:10px" oninput="_filtrarSelectorFotos(this.value)">
      <div id="fotos-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px;max-height:420px;overflow-y:auto;padding:4px">
        ${unicas.map((f, i) => `
          <div id="foto-item-${i}" onclick="_toggleFoto(${i})"
               style="cursor:pointer;border-radius:8px;overflow:hidden;border:2px solid transparent;transition:border-color 0.15s;position:relative">
            <img src="${f.url}" style="width:100%;aspect-ratio:3/4;object-fit:cover;display:block;background:#f3f4f6">
            <div style="padding:4px 6px;background:white">
              <p style="font-size:0.62rem;color:#374151;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${f.nombre}</p>
              ${f.color ? `<p style="font-size:0.6rem;color:#888">${f.color}</p>` : ''}
            </div>
            <div id="foto-check-${i}" style="display:none;position:absolute;top:4px;right:4px;background:#C8967A;color:white;border-radius:50%;width:20px;height:20px;font-size:0.7rem;display:none;align-items:center;justify-content:center;font-weight:700">✓</div>
          </div>`).join('')}
      </div>`
  } catch(e) {
    cont.innerHTML = '<p style="color:red">Error: ' + e.message + '</p>'
  }
}

window._toggleFoto = function(idx) {
  const { seleccionadas, fotos } = window._selectorFotos
  const item = document.getElementById('foto-item-' + idx)
  const check = document.getElementById('foto-check-' + idx)
  if (seleccionadas.has(idx)) {
    seleccionadas.delete(idx)
    item.style.borderColor = 'transparent'
    check.style.display = 'none'
  } else {
    seleccionadas.add(idx)
    item.style.borderColor = '#C8967A'
    check.style.display = 'flex'
  }
  document.getElementById('sel-count').textContent = seleccionadas.size + ' seleccionadas'
}

window._filtrarSelectorFotos = function(texto) {
  const { fotos } = window._selectorFotos
  const t = texto.toLowerCase()
  fotos.forEach((f, i) => {
    const item = document.getElementById('foto-item-' + i)
    if (item) item.style.display = (!t || f.nombre.toLowerCase().includes(t) || f.color.toLowerCase().includes(t)) ? '' : 'none'
  })
}

window.agregarSeleccionadas = async function(catalogoId) {
  const { seleccionadas, fotos } = window._selectorFotos
  if (!seleccionadas.size) { alert('Selecciona al menos una foto'); return }
  const { paginas } = window._catalogoPaginasData
  let nextNum = paginas.length > 0 ? Math.max(...paginas.map(p => p.pagina_numero)) + 1 : 1
  const btn = event.target
  btn.disabled = true; btn.textContent = 'Agregando...'
  for (const idx of seleccionadas) {
    await fetch(API + '/catalogos/' + catalogoId + '/paginas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imagen_url: fotos[idx].url, pagina_numero: nextNum++ })
    })
  }
  await gestionarPaginas(catalogoId, window._catalogoPaginasData.nombre)
}

// ── TAB: GENERAR AUTOMÁTICO ────────────────────────────────

async function _cargarGenerador(catalogoId) {
  const cont = document.getElementById('generador-content')
  if (!cont) return
  try {
    const [resP, resV] = await Promise.all([
      fetch(API + '/productos/'),
      fetch(API + '/variantes/')
    ])
    const productos = (await resP.json()).filter(p => p.activo && p.imagen_principal)
    const variantes = await resV.json()
    // Pre-computar colores únicos por producto
    const coloresPorProd = productos.map(p => {
      const vars = variantes.filter(v => v.producto_id === p.id && v.activa !== false)
      const uniq = [], seen = new Set()
      for (const v of vars) {
        const c = (v.color || '').trim()
        if (c && !seen.has(c)) { seen.add(c); uniq.push({ color: c, hex: v.color_hex || '#999', foto: v.foto_url }) }
      }
      return uniq
    })

    window._generadorData = { productos, variantes, catalogoId, seleccionados: new Set(), coloresPorProd }

    cont.innerHTML = `
      <div style="background:#fef9f5;border:1px solid #fde8d8;border-radius:10px;padding:14px;margin-bottom:16px;font-size:0.83rem;color:#7c3a1a">
        <strong>✨ Cómo funciona:</strong> selecciona los productos que quieres incluir. Luego activa o desactiva los colores (bolitas) que aparecerán en cada página.
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:8px">
        <div style="display:flex;gap:8px;align-items:center">
          <label style="font-size:0.8rem;font-weight:600">Productos por página:</label>
          <select id="gen-layout" class="form-input" style="width:auto;padding:5px 10px;font-size:0.8rem">
            <option value="1">1 por página</option>
            <option value="1e">1 prod. — editorial 📸</option>
            <option value="2" selected>2 por página</option>
            <option value="4">4 por página</option>
          </select>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <span id="gen-count" style="font-size:0.83rem;color:#C8967A;font-weight:600">0 seleccionados</span>
          <button class="btn btn-secondary" style="padding:5px 10px;font-size:0.78rem" onclick="_selTodosGenerador()">Todos</button>
          <button class="btn btn-primary" style="padding:6px 14px;font-size:0.8rem" id="btn-generar" onclick="generarPaginasCanvas('${catalogoId}')">✨ Generar páginas</button>
        </div>
      </div>
      <div id="gen-progress" style="display:none;padding:10px;background:#eff6ff;border-radius:8px;margin-bottom:12px">
        <p id="gen-msg" style="font-size:0.83rem;color:#1d4ed8;margin-bottom:6px">Generando...</p>
        <div style="height:6px;background:#dbeafe;border-radius:3px"><div id="gen-bar" style="height:100%;background:#3b82f6;border-radius:3px;transition:width 0.3s;width:0%"></div></div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px;max-height:460px;overflow-y:auto;padding:4px">
        ${productos.map((p, i) => {
          const vars = variantes.filter(v => v.producto_id === p.id)
          const precio = p.precio_menudeo || 0
          const colores = coloresPorProd[i]
          const swatches = colores.length > 1
            ? `<div id="gen-colores-${i}" style="display:flex;flex-wrap:wrap;gap:3px;margin-top:5px;opacity:0.35;pointer-events:none">
                ${colores.map((c, ci) => `
                  <div id="gen-col-${i}-${ci}"
                       title="${c.color}"
                       onclick="event.stopPropagation();_toggleColorGen(${i},${ci})"
                       data-sel="1"
                       style="width:13px;height:13px;border-radius:50%;background:${c.hex};border:2px solid #C8967A;cursor:pointer;flex-shrink:0;box-sizing:border-box;transition:opacity 0.15s,border-color 0.15s">
                  </div>`).join('')}
               </div>`
            : ''
          return `
          <div id="gen-item-${i}" onclick="_toggleGenProd(${i})"
               style="cursor:pointer;border-radius:8px;overflow:hidden;border:2px solid transparent;transition:border-color 0.15s;background:white;box-shadow:0 1px 3px rgba(0,0,0,0.05)">
            <img src="${p.imagen_principal}" style="width:100%;aspect-ratio:3/4;object-fit:cover;display:block;background:#f3f4f6">
            <div style="padding:5px 7px 7px">
              <p style="font-size:0.62rem;font-weight:600;color:#374151;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.nombre}</p>
              <p style="font-size:0.6rem;color:#C8967A;font-weight:600">$${precio || '—'}</p>
              ${swatches}
            </div>
          </div>`
        }).join('')}
      </div>`
  } catch(e) {
    cont.innerHTML = '<p style="color:red">Error: ' + e.message + '</p>'
  }
}

window._toggleGenProd = function(idx) {
  const { seleccionados } = window._generadorData
  const item = document.getElementById('gen-item-' + idx)
  const colDiv = document.getElementById('gen-colores-' + idx)
  if (seleccionados.has(idx)) {
    seleccionados.delete(idx)
    item.style.borderColor = 'transparent'
    if (colDiv) { colDiv.style.opacity = '0.35'; colDiv.style.pointerEvents = 'none' }
  } else {
    seleccionados.add(idx)
    item.style.borderColor = '#C8967A'
    if (colDiv) { colDiv.style.opacity = '1'; colDiv.style.pointerEvents = 'auto' }
  }
  document.getElementById('gen-count').textContent = seleccionados.size + ' seleccionados'
}

window._toggleColorGen = function(prodIdx, colorIdx) {
  const swatch = document.getElementById(`gen-col-${prodIdx}-${colorIdx}`)
  if (!swatch) return
  const esSel = swatch.dataset.sel === '1'
  swatch.dataset.sel = esSel ? '0' : '1'
  swatch.style.borderColor = esSel ? '#ccc' : '#C8967A'
  swatch.style.opacity = esSel ? '0.3' : '1'
  swatch.title = (window._generadorData.coloresPorProd[prodIdx]?.[colorIdx]?.color || '') + (esSel ? ' (excluido)' : '')
}

window._selTodosGenerador = function() {
  const { productos, seleccionados } = window._generadorData
  const todos = seleccionados.size === productos.length
  seleccionados.clear()
  productos.forEach((_, i) => {
    const item = document.getElementById('gen-item-' + i)
    if (!todos) { seleccionados.add(i); if (item) item.style.borderColor = '#C8967A' }
    else { if (item) item.style.borderColor = 'transparent' }
  })
  document.getElementById('gen-count').textContent = seleccionados.size + ' seleccionados'
}

// Carga una imagen con CORS para poder usarla en canvas
function _cargarImgCanvas(url) {
  return new Promise(resolve => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now()
  })
}

// Dibuja texto con wrap en canvas
function _wrapText(ctx, text, x, y, maxW, lineH) {
  const words = text.split(' ')
  let line = ''
  let cy = y
  for (let w of words) {
    const test = line + (line ? ' ' : '') + w
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, cy)
      line = w; cy += lineH
    } else { line = test }
  }
  if (line) ctx.fillText(line, x, cy)
  return cy + lineH
}

window.generarPaginasCanvas = async function(catalogoId) {
  const { productos, variantes, seleccionados, coloresPorProd } = window._generadorData
  if (!seleccionados.size) { alert('Selecciona al menos un producto'); return }

  const layoutVal = document.getElementById('gen-layout').value
  const layout = layoutVal === '1e' ? 1 : parseInt(layoutVal)

  // Expandir: 1 entrada por color seleccionado (así se genera 1 página por color)
  const selArr = []
  Array.from(seleccionados).sort((a, b) => a - b).forEach(prodIdx => {
    const p = productos[prodIdx]
    const colores = coloresPorProd ? coloresPorProd[prodIdx] : []

    if (!colores || colores.length <= 1) {
      // Sin variantes de color: una sola página para el producto
      selArr.push({ prod: p, origIdx: prodIdx, colorFiltro: null, todosColSel: colores || [] })
    } else {
      // Colores múltiples: filtrar los que el usuario dejó activos
      const activos = colores.filter((_, ci) => {
        const s = document.getElementById(`gen-col-${prodIdx}-${ci}`)
        return !s || s.dataset.sel !== '0'
      })
      const usar = activos.length > 0 ? activos : colores // fallback: todos
      // Una entrada (= una página) por cada color activo
      for (const c of usar) {
        selArr.push({ prod: p, origIdx: prodIdx, colorFiltro: c.color, todosColSel: usar })
      }
    }
  })

  // Helper: variantes de un ítem (filtradas al color específico de esa página)
  const _varsDeItem = (item) => {
    const all = variantes.filter(v => v.producto_id === item.prod.id && v.activa !== false)
    if (!item.colorFiltro) return all
    return all.filter(v => (v.color || '').trim() === item.colorFiltro)
  }
  // Compatibilidad con helpers anteriores
  const _varsSeleccionadas = (p, origIdx) => _varsDeItem(selArr.find(s => s.prod.id === p.id && s.origIdx === origIdx) || { prod: p, origIdx, colorFiltro: null })

  // Agrupar según layout
  const grupos = []
  for (let i = 0; i < selArr.length; i += layout) grupos.push(selArr.slice(i, i + layout))

  const btn = document.getElementById('btn-generar')
  const prog = document.getElementById('gen-progress')
  const msg = document.getElementById('gen-msg')
  const bar = document.getElementById('gen-bar')
  btn.disabled = true; prog.style.display = 'block'

  const { paginas } = window._catalogoPaginasData
  let nextNum = paginas.length > 0 ? Math.max(...paginas.map(p => p.pagina_numero)) + 1 : 1

  for (let gi = 0; gi < grupos.length; gi++) {
    const grupo = grupos[gi]
    // Extraer el producto real del wrapper { prod, origIdx }
    const _getProd = (item) => item?.prod ?? item
    const _getOrigIdx = (item) => item?.origIdx ?? productos.indexOf(item?.prod ?? item)
    msg.textContent = `Generando página ${gi + 1} de ${grupos.length}...`
    bar.style.width = ((gi / grupos.length) * 100) + '%'

    const canvas = document.createElement('canvas')
    canvas.width = 1080; canvas.height = 1440
    const ctx = canvas.getContext('2d')

    // ── Fondo blanco roto ──────────────────────────────────
    ctx.fillStyle = '#FAFAF8'
    ctx.fillRect(0, 0, 1080, 1440)

    // ── Encabezado editorial ───────────────────────────────
    // Línea fina superior
    ctx.fillStyle = '#C8967A'
    ctx.fillRect(60, 48, 960, 1)
    // Nombre marca centrado
    ctx.fillStyle = '#2A1A0E'
    ctx.font = '300 22px DM Sans, sans-serif'
    ctx.textAlign = 'center'
    ctx.letterSpacing = '8px'
    ctx.fillText('ZAPATILLAS MAY', 540, 42)
    ctx.letterSpacing = '0px'
    // Línea fina inferior del header
    ctx.fillStyle = '#C8967A'
    ctx.fillRect(60, 58, 960, 1)

    if (layoutVal === '1e') {
      // ── LAYOUT EDITORIAL: 1 página por color ──────────────────────────────
      const item0 = grupo[0]
      const p = _getProd(item0)

      // Variantes de ESTE color específico (una página por color)
      const varsP = _varsDeItem(item0)

      // Fotos de este color
      const fotosUnicas = [], urlsVistas = new Set()
      const _addFoto = u => { if (u && !urlsVistas.has(u)) { urlsVistas.add(u); fotosUnicas.push(u) } }
      if (varsP.length > 0 && varsP[0].foto_url) _addFoto(varsP[0].foto_url)
      else _addFoto(p.imagen_principal)
      for (const v of varsP) {
        _addFoto(v.foto_url)
        if (Array.isArray(v.imagenes)) v.imagenes.forEach(_addFoto)
        if (fotosUnicas.length >= 3) break
      }
      const nFotos = fotosUnicas.length  // 1, 2 ó 3+

      // Bolitas: TODOS los colores activos de este producto (para que el cliente vea las opciones)
      const coloresDisp = (item0.todosColSel || []).map(c => ({ color: c.color, hex: c.hex }))

      // Fallback de hex por nombre de color
      const _hexMap = {
        'negro':'#1C1C1C','blanco':'#F8F8F8','hueso':'#F0EBE1','beige':'#D9C9A8',
        'camel':'#C19A6B','cafe claro':'#A0725A','cafe medio':'#7A4A30','cafe oscuro':'#4A2010',
        'cafe':'#6B3A2A','chocolate':'#3D1C02','cognac':'#9B4421','taupe':'#8B7355',
        'nude':'#D4A97A','nude claro':'#E8C9A8','nude oscuro':'#C0886A','nude rosa':'#DDA090',
        'palo de rosa':'#D4A0A0','salmon':'#FA8072','coral':'#FF6B4A',
        'rojo':'#CC2200','vino':'#722F37','bordo':'#800020',
        'rosa claro':'#F9C0CB','rosa':'#F4607A','fusha':'#E91E8C',
        'naranja':'#FF8C00','amarillo':'#F5C518',
        'dorado':'#D4AF37','oro':'#CFB53B','oro rosa':'#E8B4B8','plateado':'#C0C0C0',
        'azul claro':'#5B8DB8','azul':'#1E4080','azul marino':'#001F5B','turquesa':'#40C4AA',
        'verde':'#2D6A4F','verde menta':'#98D8C8',
        'gris claro':'#C8C8C8','gris':'#909090','gris oscuro':'#505050',
        'morado':'#7B2D8B','lila':'#C8A0D8','multicolor':'#CCAA88'
      }
      const _getHex = ({ color, hex }) => {
        if (hex && hex.startsWith('#')) return hex
        const lower = (color || '').toLowerCase()
        if (_hexMap[lower]) return _hexMap[lower]
        for (const [k, v] of Object.entries(_hexMap)) { if (lower.includes(k)) return v }
        return '#BBAA99'
      }

      // Helper: contain — imagen completa visible, sin recorte, fondo blanco
      const _drawContain = (img, x, y, w, h) => {
        ctx.save()
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(x, y, w, h)
        if (img) {
          ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip()
          const ir = img.naturalWidth / img.naturalHeight, cr = w / h
          let dx, dy, dw, dh
          if (ir > cr) { dw = w; dh = w / ir; dx = x; dy = y + (h - dh) / 2 }
          else          { dh = h; dw = h * ir; dy = y; dx = x + (w - dw) / 2 }
          ctx.drawImage(img, dx, dy, dw, dh)
        }
        ctx.restore()
      }

      // Área de imagen más corta para dejar espacio a nombre + bolitas
      const cTop = 62, imgAreaH = 1080
      const nyBase = cTop + imgAreaH + 12  // = 1154

      if (nFotos >= 3) {
        // ── 3 fotos: grande izquierda + 2 apiladas derecha (contain, sin recorte)
        const [imgIzq, imgArrDer, imgAbajoDer] = await Promise.all(fotosUnicas.slice(0,3).map(_cargarImgCanvas))
        const gapC = 10, gapR = 10
        const leftW = 648, rightW = 1080 - leftW - gapC          // 422
        const rightH = Math.floor((imgAreaH - gapR) / 2)          // 535
        _drawContain(imgIzq,      0,            cTop,                  leftW,  imgAreaH)
        _drawContain(imgArrDer,   leftW + gapC, cTop,                  rightW, rightH)
        _drawContain(imgAbajoDer, leftW + gapC, cTop + rightH + gapR, rightW, rightH)

      } else if (nFotos === 2) {
        // ── 2 fotos: columnas iguales lado a lado (contain, sin recorte)
        const [imgA, imgB] = await Promise.all(fotosUnicas.map(_cargarImgCanvas))
        const gap = 10, colW = Math.floor((1080 - gap) / 2)       // 535
        _drawContain(imgA, 0,          cTop, colW, imgAreaH)
        _drawContain(imgB, colW + gap, cTop, colW, imgAreaH)

      } else {
        // ── 1 foto: imagen grande centrada (contain, sin recorte)
        const [imgSolo] = await Promise.all([_cargarImgCanvas(fotosUnicas[0])])
        _drawContain(imgSolo, 40, cTop, 1000, imgAreaH)
      }

      // ── Nombre del producto ─────────────────────────────────────────────────
      ctx.fillStyle = '#E8DDD5'
      ctx.fillRect(0, nyBase, 1080, 1)
      ctx.fillStyle = '#2A1A0E'
      ctx.textAlign = 'center'
      ctx.font = '300 28px DM Sans, sans-serif'
      ctx.letterSpacing = '3px'
      _wrapText(ctx, p.nombre.toUpperCase(), 540, nyBase + 42, 960, 38)
      ctx.letterSpacing = '0px'
      if (p.sku) {
        ctx.fillStyle = '#A07860'
        ctx.font = '400 14px DM Mono, monospace'
        ctx.fillText(p.sku, 540, nyBase + 66)
      }

      // ── Bolitas de colores disponibles ─────────────────────────────────────
      if (coloresDisp.length > 0) {
        const dotR = 11, dotGap = 8
        const maxDots = Math.min(coloresDisp.length, 14)
        const totalW = maxDots * (dotR * 2) + (maxDots - 1) * dotGap
        let dotX = Math.round(540 - totalW / 2 + dotR)
        const dotY = nyBase + 100  // y ≈ 1254

        for (let di = 0; di < maxDots; di++) {
          const cx = dotX + di * (dotR * 2 + dotGap)
          ctx.beginPath()
          ctx.arc(cx, dotY, dotR, 0, Math.PI * 2)
          ctx.fillStyle = _getHex(coloresDisp[di])
          ctx.fill()
          ctx.strokeStyle = 'rgba(0,0,0,0.18)'
          ctx.lineWidth = 1.5
          ctx.stroke()
        }
      }

    } else {
      // ── LAYOUT GRILLA (1 / 2 / 4 por página) ──────────────────────────────
      const cols = layout <= 2 ? layout : 2
      const rows = layout === 4 ? 2 : 1
      // Zona disponible para los productos
      const areaTop = 80, areaBottom = 100
      const gapX = layout === 1 ? 0 : 20
      const gapY = layout === 4 ? 20 : 0
      const padX = layout === 1 ? 40 : 28
      const cellW = (1080 - padX * 2 - gapX * (cols - 1)) / cols
      const cellH = (1440 - areaTop - areaBottom - gapY * (rows - 1)) / rows

      for (let pi = 0; pi < grupo.length; pi++) {
        const p = _getProd(grupo[pi])
        const origIdx = _getOrigIdx(grupo[pi])
        const col = pi % cols, row = Math.floor(pi / cols)
        const x = padX + col * (cellW + gapX)
        const y = areaTop + row * (cellH + gapY)

        // Altura para la foto (reserva espacio para el nombre abajo)
        const nameH = layout === 1 ? 120 : (layout === 2 ? 90 : 70)
        const imgH = cellH - nameH

        // ── Foto del producto (foto del color de esta página) ──────────────────
        const varsGrilla = _varsDeItem(grupo[pi])
        const fotoGrilla = (varsGrilla.length > 0 && varsGrilla[0].foto_url) ? varsGrilla[0].foto_url : p.imagen_principal
        const img = await _cargarImgCanvas(fotoGrilla)
        ctx.save()
        // Fondo blanco detrás de la foto
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(x, y, cellW, imgH)
        if (img) {
          ctx.beginPath(); ctx.rect(x, y, cellW, imgH); ctx.clip()
          const ir = img.naturalWidth / img.naturalHeight
          const cr = cellW / imgH
          let dx, dy, dw, dh
          if (ir > cr) { dw = cellW; dh = cellW / ir; dx = x; dy = y + (imgH - dh) / 2 }
          else { dh = imgH; dw = imgH * ir; dy = y; dx = x + (cellW - dw) / 2 }
          ctx.drawImage(img, dx, dy, dw, dh)
        }
        ctx.restore()

        // ── Separador fino entre foto y nombre ────────────
        ctx.fillStyle = '#E8DDD5'
        ctx.fillRect(x, y + imgH, cellW, 1)

        // ── Nombre del producto ────────────────────────────
        const nameY = y + imgH + (nameH / 2)
        ctx.fillStyle = '#2A1A0E'
        ctx.textAlign = 'center'
        const fs = layout === 1 ? 34 : (layout === 2 ? 24 : 19)
        ctx.font = `300 ${fs}px DM Sans, sans-serif`
        // Nombre en mayúsculas con espaciado
        ctx.letterSpacing = '2px'
        _wrapText(ctx, p.nombre.toUpperCase(), x + cellW / 2, nameY - 8, cellW - 32, fs + 10)
        ctx.letterSpacing = '0px'
        // Código SKU en pequeño
        if (p.sku) {
          ctx.fillStyle = '#A07860'
          ctx.font = `400 ${layout === 1 ? 18 : 13}px DM Mono, monospace`
          ctx.fillText(p.sku, x + cellW / 2, nameY + (layout === 1 ? 36 : 26))
        }
      }
    }

    // ── Pie editorial ──────────────────────────────────────
    // Línea fina
    ctx.fillStyle = '#C8967A'
    ctx.fillRect(60, 1340, 960, 1)
    // Instagram handle
    ctx.fillStyle = '#A07860'
    ctx.font = '300 18px DM Sans, sans-serif'
    ctx.textAlign = 'center'
    ctx.letterSpacing = '3px'
    ctx.fillText('@ZAPATILLASMAY', 540, 1368)
    ctx.letterSpacing = '0px'
    ctx.fillStyle = '#C0A898'
    ctx.font = '300 15px DM Sans, sans-serif'
    ctx.fillText('zapatillasmay.mx  ·  León, Guanajuato', 540, 1394)

    // Canvas → Blob → subir
    const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.92))
    const fd = new FormData()
    fd.append('archivo', blob, `catalogo-pag-${nextNum}.jpg`)
    try {
      const upRes = await fetch(API + '/imagenes/subir?carpeta=catalogos', { method: 'POST', body: fd })
      const upData = await upRes.json()
      if (upData.url) {
        await fetch(API + '/catalogos/' + catalogoId + '/paginas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imagen_url: upData.url, pagina_numero: nextNum++ })
        })
      }
    } catch(e) { console.error('Error subiendo página generada', e) }
  }

  bar.style.width = '100%'
  msg.textContent = `✅ ${grupos.length} páginas generadas`
  setTimeout(() => { prog.style.display = 'none' }, 2000)
  btn.disabled = false
  await gestionarPaginas(catalogoId, window._catalogoPaginasData.nombre)
}

// ── CATÁLOGO PDF POR CATEGORÍA ─────────────────────────────

window.descargarCatalogoPorCategoria = async function(cat, label) {
  const msg = document.getElementById('cat-pdf-msg')
  const btns = document.querySelectorAll('#cat-pdf-btns button')
  btns.forEach(b => b.disabled = true)
  if (msg) { msg.style.display = 'block'; msg.textContent = `⏳ Cargando productos de ${label}...` }

  try {
    const [resP, resV] = await Promise.all([
      fetch(API + `/productos/?categoria=eq.${cat}&activo=eq.true&order=nombre.asc`),
      fetch(API + '/variantes/')
    ])
    const productos = await resP.json()
    const variantes = await resV.json()

    if (!productos.length) {
      if (msg) msg.textContent = `Sin productos activos en ${label}`
      btns.forEach(b => b.disabled = false)
      return
    }

    if (msg) msg.textContent = `✏️ Generando PDF (${productos.length} productos)...`

    // Cargar jsPDF
    if (!window.jspdf) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script')
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
        s.onload = resolve; s.onerror = reject
        document.head.appendChild(s)
      })
    }
    const { jsPDF } = window.jspdf

    const COLS = 2, ROWS = 2, PER_PAGE = COLS * ROWS
    const CW = 1080, CH = 1440
    const PAD = 40, GAP = 16
    const HEADER_H = 70, FOOTER_H = 80
    const cellW = (CW - PAD * 2 - GAP * (COLS - 1)) / COLS
    const cellH = (CH - HEADER_H - FOOTER_H - GAP * (ROWS - 1)) / ROWS
    const NAME_H = 60

    const _cargarImg = url => new Promise(resolve => {
      if (!url) return resolve(null)
      const img = new Image(); img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = () => resolve(null)
      img.src = url
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
      }
      ctx.restore()
    }

    const grupos = []
    for (let i = 0; i < productos.length; i += PER_PAGE) grupos.push(productos.slice(i, i + PER_PAGE))

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [CW, CH] })
    let primeraPagina = true

    for (let gi = 0; gi < grupos.length; gi++) {
      if (msg) msg.textContent = `✏️ Página ${gi + 1} de ${grupos.length}...`
      const grupo = grupos[gi]

      const canvas = document.createElement('canvas')
      canvas.width = CW; canvas.height = CH
      const ctx = canvas.getContext('2d')

      // Fondo
      ctx.fillStyle = '#FAFAF8'; ctx.fillRect(0, 0, CW, CH)

      // Header
      ctx.fillStyle = '#C8967A'; ctx.fillRect(PAD, 36, CW - PAD * 2, 1)
      ctx.fillStyle = '#2A1A0E'; ctx.font = '300 20px sans-serif'
      ctx.textAlign = 'center'; ctx.letterSpacing = '8px'
      ctx.fillText('ZAPATILLAS MAY', CW / 2, 32)
      ctx.letterSpacing = '3px'
      ctx.font = '400 13px sans-serif'; ctx.fillStyle = '#A07860'
      ctx.fillText(label.replace(/^[^\s]+\s/, '').toUpperCase(), CW / 2, 54)
      ctx.letterSpacing = '0px'
      ctx.fillStyle = '#C8967A'; ctx.fillRect(PAD, 62, CW - PAD * 2, 1)

      // Celdas
      for (let pi = 0; pi < grupo.length; pi++) {
        const p = grupo[pi]
        const col = pi % COLS, row = Math.floor(pi / COLS)
        const x = PAD + col * (cellW + GAP)
        const y = HEADER_H + row * (cellH + GAP)
        const imgH = cellH - NAME_H

        const vars = variantes.filter(v => v.producto_id === p.id && v.activa !== false)
        const fotoUrl = (vars.length > 0 && vars[0].foto_url) ? vars[0].foto_url : p.imagen_principal
        const img = await _cargarImg(fotoUrl)
        _drawContain(ctx, img, x, y, cellW, imgH)

        // Separador
        ctx.fillStyle = '#E8DDD5'; ctx.fillRect(x, y + imgH, cellW, 1)

        // Nombre
        ctx.fillStyle = '#2A1A0E'; ctx.textAlign = 'center'
        ctx.font = '600 18px sans-serif'
        const nombre = p.nombre.length > 28 ? p.nombre.substring(0, 26) + '…' : p.nombre
        ctx.fillText(nombre.toUpperCase(), x + cellW / 2, y + imgH + 26)
        if (p.precio_menudeo) {
          ctx.fillStyle = '#C8967A'; ctx.font = '400 15px sans-serif'
          ctx.fillText(`$${Number(p.precio_menudeo).toFixed(0)} MXN`, x + cellW / 2, y + imgH + 48)
        }
      }

      // Footer
      ctx.fillStyle = '#C8967A'; ctx.fillRect(PAD, CH - FOOTER_H, CW - PAD * 2, 1)
      ctx.fillStyle = '#A07860'; ctx.textAlign = 'center'; ctx.font = '300 16px sans-serif'
      ctx.letterSpacing = '3px'; ctx.fillText('@ZAPATILLASMAY', CW / 2, CH - 50)
      ctx.letterSpacing = '0px'; ctx.fillStyle = '#C0A898'; ctx.font = '300 13px sans-serif'
      ctx.fillText('zapatillasmay.mx  ·  León, Guanajuato', CW / 2, CH - 28)

      const dataUrl = canvas.toDataURL('image/jpeg', 0.88)
      if (!primeraPagina) pdf.addPage()
      pdf.addImage(dataUrl, 'JPEG', 0, 0, CW, CH)
      primeraPagina = false
    }

    const nombreArchivo = `catalogo-${cat}-zapatillasmay.pdf`
    pdf.save(nombreArchivo)
    if (msg) { msg.textContent = `✅ Descargado: ${nombreArchivo}`; setTimeout(() => { msg.style.display = 'none' }, 4000) }

  } catch(e) {
    console.error(e)
    if (msg) msg.textContent = 'Error generando el PDF: ' + e.message
  } finally {
    btns.forEach(b => b.disabled = false)
  }
}

// Helper: rectángulo con bordes redondeados
function _roundRect(ctx, x, y, w, h, r) {
  if (typeof r === 'number') r = [r, r, r, r]
  ctx.beginPath()
  ctx.moveTo(x + r[0], y)
  ctx.lineTo(x + w - r[1], y); ctx.arcTo(x + w, y, x + w, y + r[1], r[1])
  ctx.lineTo(x + w, y + h - r[2]); ctx.arcTo(x + w, y + h, x + w - r[2], y + h, r[2])
  ctx.lineTo(x + r[3], y + h); ctx.arcTo(x, y + h, x, y + h - r[3], r[3])
  ctx.lineTo(x, y + r[0]); ctx.arcTo(x, y, x + r[0], y, r[0])
  ctx.closePath()
}

window.subirPaginasCatalogo = async function(input, catalogoId) {
  const files = Array.from(input.files || input)
  if (!files.length) return
  const progress = document.getElementById('upload-progress')
  const msg = document.getElementById('upload-msg')
  const bar = document.getElementById('upload-bar')
  if (progress) progress.style.display = 'block'
  const { paginas } = window._catalogoPaginasData
  let nextNum = paginas.length > 0 ? Math.max(...paginas.map(p => p.pagina_numero)) + 1 : 1
  for (let i = 0; i < files.length; i++) {
    if (msg) msg.textContent = `Subiendo ${i + 1} de ${files.length}...`
    if (bar) bar.style.width = ((i / files.length) * 100) + '%'
    try {
      const fd = new FormData()
      fd.append('archivo', files[i])
      const res = await fetch(API + '/imagenes/subir?carpeta=catalogos', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) {
        await fetch(API + '/catalogos/' + catalogoId + '/paginas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imagen_url: data.url, pagina_numero: nextNum++ })
        })
      }
    } catch(e) { console.error('Error subiendo página ' + (i+1), e) }
  }
  if (bar) bar.style.width = '100%'
  if (msg) msg.textContent = '✅ Listo'
  setTimeout(() => { if (progress) progress.style.display = 'none' }, 1500)
  if (input.value !== undefined) input.value = ''
  await gestionarPaginas(catalogoId, window._catalogoPaginasData.nombre)
}

window.moverPagina = async function(pagId, direccion) {
  const { paginas, catalogoId, nombre } = window._catalogoPaginasData
  const idx = paginas.findIndex(p => p.id === pagId)
  if (idx === -1) return
  const otrIdx = direccion === 'up' ? idx - 1 : idx + 1
  if (otrIdx < 0 || otrIdx >= paginas.length) return
  const numA = paginas[idx].pagina_numero
  const numB = paginas[otrIdx].pagina_numero
  await Promise.all([
    fetch(API + '/catalogos/paginas/' + paginas[idx].id, { method: 'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ pagina_numero: numB }) }),
    fetch(API + '/catalogos/paginas/' + paginas[otrIdx].id, { method: 'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ pagina_numero: numA }) })
  ])
  await gestionarPaginas(catalogoId, nombre)
}

window.eliminarPagina = async function(pagId, catalogoId) {
  if (!confirm('¿Eliminar esta página?')) return
  await fetch(API + '/catalogos/paginas/' + pagId, { method: 'DELETE' })
  await gestionarPaginas(catalogoId, window._catalogoPaginasData.nombre)
}

window.usarComoPortada = async function(url, catalogoId) {
  await fetch(API + '/catalogos/' + catalogoId, { method: 'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ portada_url: url }) })
  alert('✅ Portada actualizada')
}

// ═══════════════════════════════════════════════════════
// MercadoLibre — funciones del panel
// ═══════════════════════════════════════════════════════
window.mlVerStock = async function(btn) {
  const orig = btn.innerHTML
  btn.innerHTML = '⏳ Consultando...'
  btn.disabled = true
  const box = document.getElementById('ml-resultado')
  try {
    const r = await fetch(API + '/ml/stock')
    const d = await r.json()
    box.style.display = 'block'
    if (d.diferencias && d.diferencias.length > 0) {
      const lineas = d.diferencias.map(x =>
        `${x.item_id} | SKU: ${x.seller_sku} | ML: ${x.qty_ml} | ERP: ${x.qty_erp}`
      ).join('\n')
      box.textContent = `📊 ${d.total_items} items · ${d.desactualizados} desactualizados · ${d.sin_sku} sin SKU\n\nDIFERENCIAS:\n${lineas}`
    } else {
      box.textContent = `✅ Todo sincronizado — ${d.total_items} items revisados`
    }
  } catch(e) {
    box.style.display = 'block'
    box.textContent = 'Error: ' + e.message
  }
  btn.innerHTML = orig
  btn.disabled = false
}

window.mlSincronizar = async function(btn) {
  if (!confirm('¿Sincronizar el stock de todas las publicaciones de MercadoLibre con el ERP?')) return
  const orig = btn.innerHTML
  btn.innerHTML = '⏳ Sincronizando...'
  btn.disabled = true
  const box = document.getElementById('ml-resultado')
  try {
    const r = await fetch(API + '/ml/sync', { method: 'POST' })
    const d = await r.json()
    box.style.display = 'block'
    box.textContent = '🔄 ' + d.message + '\n\nEspera 30 segundos y haz clic en "Ver resultado".'
  } catch(e) {
    box.style.display = 'block'
    box.textContent = 'Error: ' + e.message
  }
  btn.innerHTML = orig
  btn.disabled = false
}

window.mlVerLog = async function(btn) {
  const orig = btn.innerHTML
  btn.innerHTML = '⏳ Cargando...'
  btn.disabled = true
  const box = document.getElementById('ml-resultado')
  try {
    const r = await fetch(API + '/ml/sync/log')
    const d = await r.json()
    box.style.display = 'block'
    if (d.error) {
      box.textContent = '❌ Error: ' + d.error
    } else if (d.message) {
      box.textContent = d.message
    } else {
      const fecha = d.ts ? new Date(d.ts * 1000).toLocaleString('es-MX') : ''
      box.textContent = `Última sync: ${fecha}\n\n✅ Actualizados: ${d.actualizados}\n⏭️  Sin cambio:   ${d.sin_cambio}\n❓ Sin match:    ${d.sin_match}\n❌ Errores:      ${d.errores}` +
        (d.detalle_actualizados?.length ? '\n\nACTUALIZADOS:\n' + d.detalle_actualizados.map(x => `  ${x.sku}: ${x.antes} → ${x.despues}`).join('\n') : '') +
        (d.detalle_errores?.length ? '\n\nERRORES:\n' + d.detalle_errores.map(x => `  ${x.sku}: ${x.error}`).join('\n') : '') +
        (d.detalle_sin_match?.length ? '\n\nSIN MATCH (primeros 20):\n' + d.detalle_sin_match.map(x => `  ${x.item} ${x.sku}`).join('\n') : '')
    }
  } catch(e) {
    box.style.display = 'block'
    box.textContent = 'Error: ' + e.message
  }
  btn.innerHTML = orig
  btn.disabled = false
}

// ─── MercadoLibre: Publicar nuevo estilo ────────────────────────────────────

async function _mlPublicar(solo_preview, btn) {
  const sku     = document.getElementById('ml-pub-sku').value.trim()
  const listing = document.getElementById('ml-pub-listing').value
  const box     = document.getElementById('ml-pub-resultado')
  const orig    = btn.innerHTML
  if (!sku) { alert('Ingresa el SKU del producto (ej: M-SAN-0148)'); return }

  btn.innerHTML = solo_preview ? '⏳ Generando preview...' : '⏳ Publicando en ML...'
  btn.disabled = true
  box.style.display = 'none'

  try {
    // Pasar sku_interno directamente — el backend hace el lookup en Supabase
    const r = await fetch(API + '/ml/publicar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sku_interno:  sku.toUpperCase().trim(),
        listing_type: listing,
        solo_preview: solo_preview,
      })
    })
    const d = await r.json()

    box.style.display = 'block'

    if (!r.ok) {
      box.textContent = '❌ Error: ' + (d.detail || JSON.stringify(d))
      return
    }

    if (solo_preview) {
      // Mostrar el primer payload de forma legible
      const first = d.resultados?.[0]
      if (!first) { box.textContent = 'Sin resultados'; return }
      const p = first.preview
      let txt = `=== PREVIEW — ${d.producto} (${d.total} variantes) ===\n\n`
      txt += `Producto:    ${d.producto} (${d.categoria})\n`
      txt += `Category ID: ${d.category_id}\n`
      txt += `Listing:     ${listing}\n\n`
      txt += `--- Primera variante: ${first.sku} ---\n`
      txt += `Título:      ${p.title}\n`
      txt += `Precio:      $${p.price} MXN\n`
      txt += `Stock:       ${p.available_quantity}\n`
      txt += `Imágenes:    ${p.pictures?.length || 0}\n`
      txt += `Descripción: ${p.description?.plain_text?.substring(0,120)}...\n\n`
      txt += `Atributos:\n` + (p.attributes || []).map(a => `  ${a.id}: ${a.value_name}`).join('\n')
      txt += `\n\n... y ${d.total - 1} variantes más con la misma estructura.`
      box.textContent = txt
    } else {
      // Resultados reales
      const ok  = d.resultados?.filter(r => r.status === 'publicado') || []
      const err = d.resultados?.filter(r => r.status === 'error') || []
      let txt = `=== RESULTADO — ${d.producto} ===\n`
      txt += `✅ Publicados: ${ok.length}   ❌ Errores: ${err.length}\n\n`
      if (ok.length) {
        txt += 'PUBLICADOS:\n'
        ok.forEach(x => { txt += `  ${x.sku} → ${x.item_id}\n  ${x.permalink || ''}\n` })
      }
      if (err.length) {
        txt += '\nERRORES:\n'
        err.forEach(x => {
          txt += `  ${x.sku}  [${x.codigo}] ${x.error}\n`
          if (x.causas?.length) x.causas.forEach(c => { txt += `    ↳ ${c.code}: ${c.message}\n` })
        })
      }
      box.textContent = txt
    }
  } catch(e) {
    box.style.display = 'block'
    box.textContent = 'Error inesperado: ' + e.message
  } finally {
    btn.innerHTML = orig
    btn.disabled = false
  }
}

window.mlPublicarPreview = function(btn) { _mlPublicar(true, btn) }
window.mlPublicarReal    = function(btn) {
  if (!confirm('¿Publicar TODAS las variantes activas de este producto en MercadoLibre? Esto creará nuevos items en tu cuenta.')) return
  _mlPublicar(false, btn)
}

// ═══════════════════════════════════════════════════════
window.descargarExcelTikTok = async function(btn, endpoint, filename) {
  const textoOriginal = btn.innerHTML
  try {
    btn.innerHTML = '⏳ Generando...'
    btn.disabled = true
    const res = await fetch(`${API}/tiktok/${endpoint}`)
    if (!res.ok) { const txt = await res.text(); throw new Error(`Error ${res.status}: ${txt}`) }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch(e) {
    alert('Error al descargar el archivo: ' + e.message)
  } finally {
    btn.innerHTML = textoOriginal
    btn.disabled = false
  }
}

// ─── MERCADOLIBRE ─────────────────────────────────────────────────────────────

async function cargarMercadoLibre() {
  const content = document.getElementById('content')
  content.innerHTML = `
    <div style="padding:2rem;max-width:860px">
      <h2 style="margin-bottom:0.25rem">🛒 MercadoLibre</h2>
      <p style="color:#888;font-size:0.85rem;margin-bottom:1.5rem">
        Genera el preview, edita el JSON de cada variante (especialmente el título), y publica.
      </p>

      <!-- Mis publicaciones -->
      <div class="card" style="margin-bottom:1.5rem">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem">
          <h3 style="margin:0">📋 Mis publicaciones</h3>
          <button onclick="mlCargarPublicaciones(this)"
                  style="padding:0.4rem 1rem;background:#3483fa;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:0.85rem;font-weight:600">
            🔄 Cargar / Actualizar
          </button>
        </div>
        <div id="ml-pubs-wrap">
          <p style="color:#aaa;font-size:0.85rem;margin:0">Haz clic en "Cargar" para ver tus publicaciones activas en MercadoLibre.</p>
        </div>
      </div>

      <!-- Paso 1: configurar -->
      <div class="card" style="margin-bottom:1.5rem">
        <h3 style="margin-bottom:1rem">Paso 1 — Publicar producto nuevo</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:0.75rem">
          <div style="position:relative">
            <label style="font-size:0.8rem;font-weight:600;display:block;margin-bottom:4px">SKU o modelo del producto</label>
            <input id="ml-sku" type="text" placeholder="Ej: CR3385 o C-TAC-0118" autocomplete="off"
                   style="width:100%;padding:0.5rem 0.75rem;border:1px solid #ddd;border-radius:6px;font-size:0.95rem;box-sizing:border-box">
            <div id="ml-sku-sug" style="display:none;position:absolute;z-index:30;left:0;right:0;top:100%;background:#fff;border:1px solid #ddd;border-top:none;border-radius:0 0 6px 6px;max-height:240px;overflow-y:auto;box-shadow:0 6px 16px rgba(0,0,0,0.12)"></div>
          </div>
          <div>
            <label style="font-size:0.8rem;font-weight:600;display:block;margin-bottom:4px">Tipo de publicación</label>
            <select id="ml-listing"
                    style="width:100%;padding:0.5rem 0.75rem;border:1px solid #ddd;border-radius:6px;font-size:0.95rem">
              <option value="gold_pro">Oro Premium — gold_pro (16%)</option>
              <option value="gold_special">Oro Especial — gold_special (12%)</option>
              <option value="silver">Plata (9%)</option>
              <option value="bronze">Bronce (5%)</option>
            </select>
            <div style="font-size:0.75rem;color:#e67e22;margin-top:3px">⚠️ La categoría de calzado no admite publicaciones gratis</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr auto;gap:0.75rem;margin-bottom:0.75rem;align-items:start">
          <div>
            <label style="font-size:0.8rem;font-weight:600;display:block;margin-bottom:4px">
              Título para ML <span style="color:#3483fa">★</span>
              <span style="font-weight:400;color:#888">(igual para todas las variantes)</span>
            </label>
            <input id="ml-titulo" type="text" placeholder="Ej: Sandalia Tacón Alto Para Fiesta Marca May"
                   maxlength="60"
                   style="width:100%;padding:0.5rem 0.75rem;border:2px solid #3483fa;border-radius:6px;font-size:0.95rem">
            <div style="font-size:0.75rem;color:#888;margin-top:3px">Máximo 60 caracteres — <span id="ml-titulo-count">0</span>/60</div>
          </div>
          <div>
            <label style="font-size:0.8rem;font-weight:600;display:block;margin-bottom:4px">
              Precio ML (MXN) <span style="color:#888;font-weight:400">— opcional</span>
            </label>
            <input id="ml-precio" type="number" min="1" step="1" placeholder="Ej: 520"
                   style="width:130px;padding:0.5rem 0.75rem;border:1px solid #ddd;border-radius:6px;font-size:0.95rem">
            <div style="font-size:0.75rem;color:#888;margin-top:3px">Vacío = precio del ERP</div>
          </div>
        </div>

        <div style="margin-bottom:0.75rem">
          <label style="font-size:0.8rem;font-weight:600;display:block;margin-bottom:4px">
            Descripción ML
            <span style="font-weight:400;color:#888">— vacío = usa la del ERP</span>
          </label>
          <textarea id="ml-descripcion" rows="4"
                    placeholder="Descripción del producto para MercadoLibre..."
                    style="width:100%;padding:0.5rem 0.75rem;border:1px solid #ddd;border-radius:6px;font-size:0.88rem;resize:vertical;box-sizing:border-box"></textarea>
        </div>

        <!-- Selector de foto de portada — se llena al generar preview -->
        <div id="ml-fotos-wrap" style="display:none;margin-bottom:0.75rem">
          <label style="font-size:0.8rem;font-weight:600;display:block;margin-bottom:6px">
            📷 Foto de portada
            <span style="color:#e67e22">★</span>
            <span style="font-weight:400;color:#888"> — ML exige fondo blanco/sin fondo. Click para seleccionar cuál va primero.</span>
          </label>
          <div id="ml-fotos-grid" style="display:flex;gap:8px;flex-wrap:wrap"></div>
        </div>

        <button onclick="mlGenerarPreview()" id="ml-btn-preview"
                style="padding:0.6rem 1.5rem;background:#3483fa;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:0.95rem;font-weight:600">
          🔍 Generar preview
        </button>
      </div>

      <!-- Paso 2: editar variantes -->
      <div id="ml-variantes-wrap" style="display:none">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
          <h3 id="ml-variantes-titulo" style="margin:0">Paso 2 — Edita los JSONs</h3>
          <button onclick="mlPublicarTodas()" id="ml-btn-publicar"
                  style="padding:0.6rem 1.5rem;background:#ffe600;color:#333;border:none;border-radius:6px;cursor:pointer;font-size:0.95rem;font-weight:700">
            🚀 Publicar todas en ML
          </button>
        </div>
        <p style="font-size:0.82rem;color:#888;margin-bottom:1rem">
          Cada textarea es el JSON que se enviará a ML. Puedes cambiar el título, precio, imágenes, etc.
        </p>
        <div id="ml-variantes-list"></div>
      </div>

      <!-- Resultado publicación -->
      <div id="ml-resultado" style="display:none;margin-top:1.5rem" class="card">
        <h3 id="ml-resultado-titulo" style="margin-bottom:0.75rem">Resultado</h3>
        <div id="ml-resultado-body"></div>
      </div>
    </div>
  `

  // Contador de caracteres del título
  document.getElementById('ml-titulo').addEventListener('input', function() {
    document.getElementById('ml-titulo-count').textContent = this.value.length
  })

  // ── Autocompletado del SKU: buscar por modelo (nombre) o SKU interno ──
  let _mlProductos = []
  fetch(`${API}/productos/?select=id,sku_interno,nombre,activo`)
    .then(r => r.json())
    .then(d => { _mlProductos = (Array.isArray(d) ? d : []).filter(p => p.activo !== false) })
    .catch(() => {})
  const _skuInput = document.getElementById('ml-sku')
  const _skuSug   = document.getElementById('ml-sku-sug')
  const _mlRenderSug = (q) => {
    q = (q || '').toLowerCase().trim()
    if (!q || !_mlProductos.length) { _skuSug.style.display = 'none'; return }
    const matches = _mlProductos.filter(p =>
      (p.nombre || '').toLowerCase().includes(q) || (p.sku_interno || '').toLowerCase().includes(q)
    ).slice(0, 12)
    if (!matches.length) { _skuSug.style.display = 'none'; return }
    _skuSug.innerHTML = matches.map(p => `
      <div onclick="window._mlElegirSku('${(p.sku_interno || '').replace(/'/g,"\\'")}')"
           style="padding:0.5rem 0.75rem;cursor:pointer;border-bottom:1px solid #f0f0f0;font-size:0.85rem"
           onmouseover="this.style.background='#f0f7ff'" onmouseout="this.style.background='#fff'">
        <span style="font-weight:600">${p.nombre || ''}</span>
        <span style="color:#888;font-size:0.75rem;margin-left:6px">${p.sku_interno || ''}</span>
      </div>`).join('')
    _skuSug.style.display = 'block'
  }
  window._mlElegirSku = (sku) => { _skuInput.value = sku; _skuSug.style.display = 'none' }
  _skuInput.addEventListener('input', () => _mlRenderSug(_skuInput.value))
  _skuInput.addEventListener('focus', () => _mlRenderSug(_skuInput.value))
  document.addEventListener('click', (e) => {
    if (_skuSug && !_skuSug.contains(e.target) && e.target !== _skuInput) _skuSug.style.display = 'none'
  })
  // Resolver lo escrito (modelo o SKU) a un sku_interno válido. Devuelve sku o null si es ambiguo.
  window._mlResolverSku = (texto) => {
    const t = (texto || '').trim()
    if (!t || !_mlProductos.length) return t.toUpperCase()
    const exact = _mlProductos.find(p => (p.sku_interno || '').toUpperCase() === t.toUpperCase())
    if (exact) return exact.sku_interno.toUpperCase()
    const byName = _mlProductos.filter(p => (p.nombre || '').toLowerCase().includes(t.toLowerCase()))
    if (byName.length === 1) return byName[0].sku_interno.toUpperCase()
    if (byName.length > 1) return '__AMBIGUO__'
    return t.toUpperCase()  // dejar pasar; el backend dirá si no existe
  }

  window.mlGenerarPreview = async () => {
    const skuTexto  = document.getElementById('ml-sku').value.trim()
    const tipo      = document.getElementById('ml-listing').value
    const titulo    = document.getElementById('ml-titulo').value.trim()
    const precioRaw = document.getElementById('ml-precio').value.trim()
    const precio    = precioRaw ? parseFloat(precioRaw) : null
    if (!skuTexto) { alert('Ingresa el SKU o modelo del producto'); return }
    // Resolver modelo/nombre → sku_interno
    const sku = window._mlResolverSku(skuTexto)
    if (sku === '__AMBIGUO__') { alert('Hay varios productos que coinciden con "' + skuTexto + '". Elige uno de la lista que aparece al escribir.'); return }
    if (!titulo) { alert('Ingresa el título para ML'); return }
    if (titulo.length > 60) { alert('El título no puede superar 60 caracteres'); return }
    if (precio !== null && (isNaN(precio) || precio <= 0)) { alert('El precio debe ser mayor a 0'); return }

    const btn = document.getElementById('ml-btn-preview')
    btn.textContent = '⏳ Generando...'
    btn.disabled = true

    // Descripción e índice de portada (se llenan después del fetch)
    let portadaIdx = 0

    try {
      const res  = await fetch(`${API}/ml/publicar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku_interno: sku, listing_type: tipo, solo_preview: true })
      })
      const data = await res.json()
      if (!res.ok) { alert('Error: ' + (data.detail || JSON.stringify(data))); return }

      const resultados = data.resultados || []
      if (!resultados.length) { alert('No se encontraron variantes activas'); return }

      // Pre-llenar descripción siempre (sobrescribir si el usuario no ha escrito nada)
      const descEl = document.getElementById('ml-descripcion')
      const descTexto = resultados[0]?.preview?.description?.plain_text || ''
      if (!descEl.value.trim()) descEl.value = descTexto

      // Agrupar fotos por color — cada color tiene su propio selector de portada
      const fotosPorColor = {}  // { color: [{ source, ...}] }
      const todasFotos = []
      const urlsVistos = new Set()
      for (const r of resultados) {
        const color = r.color || 'Sin color'
        if (!fotosPorColor[color]) fotosPorColor[color] = []
        for (const pic of (r.preview?.pictures || [])) {
          if (pic.source) {
            if (!fotosPorColor[color].find(p => p.source === pic.source))
              fotosPorColor[color].push(pic)
            if (!urlsVistos.has(pic.source)) { urlsVistos.add(pic.source); todasFotos.push(pic) }
          }
        }
      }

      // portadaByColor: { color: índice } — coloresActivos: Set de colores seleccionados
      const portadaByColor = {}
      const coloresActivos = new Set()
      const fotosExcluidas = new Set()  // sources de fotos que NO se enviarán
      for (const color of Object.keys(fotosPorColor)) {
        portadaByColor[color] = 0
        coloresActivos.add(color)
      }

      const colores = Object.keys(fotosPorColor)
      if (colores.length > 0) {
        const fotosWrap = document.getElementById('ml-fotos-wrap')
        const fotosGrid = document.getElementById('ml-fotos-grid')

        const rerenderTodo = () => {
          renderFotoGrid()
          const resultadosFiltrados = resultados.filter(r => coloresActivos.has(r.color || 'Sin color'))
          _mlRenderVariantes(resultadosFiltrados, titulo, precio, portadaByColor, descEl.value.trim(), fotosPorColor, fotosExcluidas)
        }

        const renderFotoGrid = () => {
          fotosGrid.innerHTML = colores.map(color => {
            const fotos = fotosPorColor[color]
            if (!fotos.length) return ''
            const activo = coloresActivos.has(color)
            const colorKey = color.replace(/'/g, "\\'")
            const colorId  = color.replace(/[^a-zA-Z0-9]/g, '_')
            return `
              <div style="margin-bottom:1rem;width:100%;opacity:${activo ? 1 : 0.4}">
                <label style="display:flex;align-items:center;gap:8px;cursor:pointer;margin-bottom:6px">
                  <input type="checkbox" id="ml-chk-${colorId}" ${activo ? 'checked' : ''}
                    onchange="mlToggleColor('${colorKey}')"
                    style="width:16px;height:16px;cursor:pointer;accent-color:#3483fa">
                  <span style="font-size:0.82rem;font-weight:700;color:#333">${color}</span>
                  <span style="font-size:0.72rem;color:#888">(${resultados.filter(r=>(r.color||'Sin color')===color).length} tallas)</span>
                </label>
                <div style="display:flex;gap:8px;flex-wrap:wrap;padding-left:24px">
                  ${fotos.map((p, i) => {
                    const excl = fotosExcluidas.has(p.source)
                    const esPortada = i===portadaByColor[color] && activo && !excl
                    return `
                    <div onclick="${(activo && !excl) ? `mlSeleccionarPortadaColor('${colorKey}',${i})` : ''}"
                         id="ml-foto-${colorId}-${i}"
                         style="cursor:${(activo&&!excl)?'pointer':'default'};border:3px solid ${esPortada?'#3483fa':'#ddd'};border-radius:8px;overflow:hidden;width:80px;height:80px;position:relative;flex-shrink:0;opacity:${excl?0.35:1}">
                      <img src="${p.source}" style="width:100%;height:100%;object-fit:cover">
                      ${activo ? `<div onclick="event.stopPropagation();mlToggleFoto('${colorKey}',${i},'${p.source.replace(/'/g,"\\'")}')" title="${excl?'Incluir foto':'Quitar foto'}" style="position:absolute;top:2px;right:2px;width:20px;height:20px;border-radius:50%;background:${excl?'#16a34a':'#e74c3c'};color:#fff;font-size:0.75rem;line-height:1;display:flex;align-items:center;justify-content:center;cursor:pointer;font-weight:700;box-shadow:0 1px 3px rgba(0,0,0,0.3)">${excl?'+':'✕'}</div>` : ''}
                      ${esPortada ? '<div style="position:absolute;bottom:0;left:0;right:0;background:#3483fa;color:#fff;font-size:0.55rem;text-align:center;padding:2px;font-weight:700">PORTADA</div>' : ''}
                    </div>`
                  }).join('')}
                </div>
              </div>`
          }).join('')
        }

        renderFotoGrid()
        fotosWrap.style.display = 'block'

        window.mlToggleColor = (color) => {
          if (coloresActivos.has(color)) coloresActivos.delete(color)
          else coloresActivos.add(color)
          rerenderTodo()
        }
        window.mlSeleccionarPortadaColor = (color, idx) => {
          portadaByColor[color] = idx
          rerenderTodo()
        }
        window.mlToggleFoto = (color, idx, source) => {
          if (fotosExcluidas.has(source)) {
            fotosExcluidas.delete(source)
          } else {
            fotosExcluidas.add(source)
            // Si quitamos la portada actual, mover la portada a la primera foto incluida
            const fotos = fotosPorColor[color] || []
            if (fotos[portadaByColor[color]] && fotos[portadaByColor[color]].source === source) {
              const firstIncl = fotos.findIndex(p => !fotosExcluidas.has(p.source))
              portadaByColor[color] = firstIncl >= 0 ? firstIncl : 0
            }
          }
          rerenderTodo()
        }
      }

      const resultadosFiltrados = resultados.filter(r => coloresActivos.has(r.color || 'Sin color'))
      _mlRenderVariantes(resultadosFiltrados, titulo, precio, portadaByColor, descEl.value.trim(), fotosPorColor)

      const wrap = document.getElementById('ml-variantes-wrap')
      wrap.style.display = 'block'
      wrap.scrollIntoView({ behavior: 'smooth', block: 'start' })

    } catch(e) {
      alert('Error de conexión: ' + e.message)
    } finally {
      btn.textContent = '🔍 Generar preview'
      btn.disabled = false
    }
  }

  function _mlRenderVariantes(resultados, titulo, precio, portadaByColor, descripcion, fotosPorColor, fotosExcluidas) {
    fotosExcluidas = fotosExcluidas || new Set()
    const tit  = document.getElementById('ml-variantes-titulo')
    const list = document.getElementById('ml-variantes-list')
    tit.textContent = `Paso 2 — Revisa y edita (${resultados.length} variantes, título aplicado a todas)`

    list.innerHTML = resultados.map((r, i) => {
      const payload = { ...r.preview }
      delete payload.title
      payload.family_name = titulo

      // Precio ML
      if (precio !== null) payload.price = precio

      // Descripción personalizada
      if (descripcion) payload.description = { plain_text: descripcion }

      // Fotos: portada del color de esta variante va primero
      if (fotosPorColor) {
        const color = r.color || 'Sin color'
        const fotosColor = fotosPorColor[color] || []
        const idx = (portadaByColor && portadaByColor[color]) || 0
        const portadaSrc = fotosColor[idx] ? fotosColor[idx].source : null
        // Solo fotos NO excluidas
        let fotos = fotosColor.filter(p => !fotosExcluidas.has(p.source))
        // La portada (si sigue incluida) va primero
        if (portadaSrc) {
          const pIdx = fotos.findIndex(f => f.source === portadaSrc)
          if (pIdx > 0) { const [portada] = fotos.splice(pIdx, 1); fotos.unshift(portada) }
        }
        // Completar con fotos de otros colores (no excluidas) si hay menos de 3
        if (fotos.length < 3) {
          for (const [c, pics] of Object.entries(fotosPorColor)) {
            if (c === color) continue
            for (const p of pics) {
              if (fotosExcluidas.has(p.source)) continue
              if (!fotos.find(f => f.source === p.source)) fotos.push(p)
              if (fotos.length >= 12) break
            }
            if (fotos.length >= 12) break
          }
        }
        payload.pictures = fotos.slice(0, 12)
      }

      return `
        <details style="margin-bottom:0.5rem;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden">
          <summary style="padding:0.5rem 1rem;cursor:pointer;background:#f8f8f8;font-size:0.85rem;font-weight:600;list-style:none;display:flex;justify-content:space-between">
            <span>${r.sku || 'Variante ' + (i+1)} &nbsp;·&nbsp; ${r.color || ''} ${r.talla || ''}</span>
            <span style="font-size:0.75rem;color:#aaa">▾ editar JSON</span>
          </summary>
          <div style="padding:0.5rem">
            <textarea id="ml-json-${i}"
                      style="width:100%;height:260px;font-family:monospace;font-size:0.73rem;border:1px solid #ddd;border-radius:4px;padding:0.5rem;resize:vertical;box-sizing:border-box"
                      spellcheck="false">${JSON.stringify(payload, null, 2)}</textarea>
          </div>
        </details>`
    }).join('')
  }

  window.mlCargarPublicaciones = async (btn) => {
    const wrap = document.getElementById('ml-pubs-wrap')
    const orig = btn.innerHTML
    btn.innerHTML = '⏳ Cargando...'
    btn.disabled = true
    wrap.innerHTML = '<p style="color:#aaa;font-size:0.85rem">Consultando MercadoLibre (puede tardar ~10 s)...</p>'
    try {
      const res  = await fetch(`${API}/ml/items`)
      const data = await res.json()
      if (!res.ok) { wrap.innerHTML = `<p style="color:red">Error: ${data.detail || JSON.stringify(data)}</p>`; return }

      const items = data.items || []
      if (!items.length) { wrap.innerHTML = '<p style="color:#aaa;font-size:0.85rem">No se encontraron publicaciones.</p>'; return }

      const statusBadge = (s) => {
        const map = { active: ['#27ae60','Activa'], paused: ['#e67e22','Pausada'], closed: ['#e74c3c','Cerrada'], under_review: ['#8e44ad','En revisión'] }
        const [color, label] = map[s] || ['#999', s]
        return `<span style="background:${color};color:#fff;border-radius:4px;padding:2px 7px;font-size:0.72rem;font-weight:700">${label}</span>`
      }

      const filas = items.map(it => `
        <tr data-search="${(it.item_id + ' ' + (it.title||'') + ' ' + (it.seller_sku||'')).toLowerCase().replace(/"/g,'')}" style="border-bottom:1px solid var(--border)">
          <td style="padding:0.4rem 0.5rem;font-size:0.78rem;color:#3483fa;white-space:nowrap">
            <a href="https://articulo.mercadolibre.com.mx/${it.item_id.replace(/^(ML[A-Z]+)(\d+)$/, '$1-$2')}" target="_blank" style="color:#3483fa;text-decoration:none">
              ${it.item_id}
            </a>
          </td>
          <td style="padding:0.4rem 0.5rem;font-size:0.82rem;max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${it.title}">${it.title}</td>
          <td style="padding:0.4rem 0.5rem;white-space:nowrap">${statusBadge(it.status)}</td>
          <td style="padding:0.4rem 0.5rem;font-size:0.78rem;color:#555;white-space:nowrap">${it.seller_sku || '—'}</td>
          <td style="padding:0.4rem 0.5rem;font-size:0.82rem;text-align:right;font-weight:600">${it.qty}</td>
        </tr>`).join('')

      const active  = items.filter(i => i.status === 'active').length
      const paused  = items.filter(i => i.status === 'paused').length
      const sinSku  = data.sin_sku || 0

      wrap.innerHTML = `
        <div style="display:flex;gap:1.5rem;margin-bottom:0.75rem;flex-wrap:wrap">
          <span style="font-size:0.82rem;color:#555">Total: <b>${data.total}</b></span>
          <span style="font-size:0.82rem;color:#27ae60">Activas: <b>${active}</b></span>
          <span style="font-size:0.82rem;color:#e67e22">Pausadas: <b>${paused}</b></span>
          ${sinSku ? `<span style="font-size:0.82rem;color:#e74c3c">Sin SKU ERP: <b>${sinSku}</b></span>` : ''}
        </div>
        <input id="ml-pubs-buscar" oninput="mlFiltrarPubs(this.value)" placeholder="🔍 Buscar por título, SKU o item ID..."
               style="width:100%;padding:0.5rem 0.75rem;border:1px solid #ddd;border-radius:6px;font-size:0.9rem;margin-bottom:0.6rem;box-sizing:border-box">
        <div style="overflow-x:auto;max-height:400px;overflow-y:auto;border:1px solid var(--border);border-radius:6px">
          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr style="background:var(--bg-secondary);position:sticky;top:0">
                <th style="padding:0.4rem 0.5rem;font-size:0.75rem;text-align:left;color:#888;font-weight:600">Item ID</th>
                <th style="padding:0.4rem 0.5rem;font-size:0.75rem;text-align:left;color:#888;font-weight:600">Título</th>
                <th style="padding:0.4rem 0.5rem;font-size:0.75rem;text-align:left;color:#888;font-weight:600">Estado</th>
                <th style="padding:0.4rem 0.5rem;font-size:0.75rem;text-align:left;color:#888;font-weight:600">SKU ERP</th>
                <th style="padding:0.4rem 0.5rem;font-size:0.75rem;text-align:right;color:#888;font-weight:600">Stock</th>
              </tr>
            </thead>
            <tbody>${filas}</tbody>
          </table>
        </div>`
    } catch(e) {
      wrap.innerHTML = `<p style="color:red">Error de conexión: ${e.message}</p>`
    } finally {
      btn.innerHTML = orig
      btn.disabled = false
    }
  }

  window.mlFiltrarPubs = (q) => {
    q = (q || '').toLowerCase().trim()
    document.querySelectorAll('#ml-pubs-wrap tbody tr').forEach(tr => {
      tr.style.display = !q || (tr.dataset.search || '').includes(q) ? '' : 'none'
    })
  }

  window.mlPublicarTodas = async () => {
    if (!confirm('¿Publicar TODAS las variantes en MercadoLibre con los JSONs editados?')) return

    const list     = document.getElementById('ml-variantes-list')
    const textareas = list.querySelectorAll('textarea')
    const payloads = []

    for (let i = 0; i < textareas.length; i++) {
      try {
        payloads.push(JSON.parse(textareas[i].value))
      } catch(e) {
        alert(`JSON inválido en variante ${i+1}: ${e.message}`)
        return
      }
    }

    const btn = document.getElementById('ml-btn-publicar')
    btn.textContent = '⏳ Publicando...'
    btn.disabled = true

    const resDiv = document.getElementById('ml-resultado')
    const titulo = document.getElementById('ml-resultado-titulo')
    const body   = document.getElementById('ml-resultado-body')
    resDiv.style.display = 'block'
    titulo.textContent   = '⏳ Publicando...'
    body.innerHTML       = '<p style="color:#888">Enviando a MercadoLibre...</p>'

    try {
      const res  = await fetch(`${API}/ml/publicar-payloads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payloads })
      })
      const data = await res.json()

      const pub = data.publicados || 0
      const err = data.errores    || 0
      titulo.textContent = `✅ ${pub} publicado(s)${err ? ` · ❌ ${err} con error` : ''} de ${data.total || 0}`

      body.innerHTML = (data.resultados || []).map(it => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0;border-bottom:1px solid #eee">
          <span style="font-size:0.85rem">${it.sku || '—'} ${it.title ? '— ' + it.title : ''}</span>
          ${it.ok
            ? `<a href="${it.permalink || '#'}" target="_blank"
                 style="font-size:0.8rem;color:#3483fa;white-space:nowrap">🔗 ${it.item_id}</a>`
            : `<span style="font-size:0.8rem;color:red"
                     title='${JSON.stringify(it.causa||[])}'>❌ ${it.error || 'Error'}</span>`
          }
        </div>
      `).join('') || '<p style="color:#888">Sin detalles</p>'

    } catch(e) {
      titulo.textContent = '❌ Error de conexión'
      body.innerHTML = `<p style="color:red">${e.message}</p>`
    } finally {
      btn.textContent = '🚀 Publicar todas en ML'
      btn.disabled = false
    }
  }
}

// ─── GOOGLE ANALYTICS ─────────────────────────────────────────────────────────

// ─── ORDEN EN HOME ───────────────────────────────────────────────────────────

let _ordenHomeList = []
let _ohBusqueda = ''

async function cargarOrdenHome() {
  const content = document.getElementById('content')
  content.innerHTML = `
    <style>
      .oh-wrap { padding:1rem; max-width:700px; }
      .oh-row {
        display:flex; align-items:center; gap:0.6rem;
        background:#fff; border:1px solid #eee; border-radius:8px;
        padding:0.5rem 0.65rem; margin-bottom:0.4rem;
        transition: box-shadow .15s, opacity .15s;
      }
      .oh-row.dragging { opacity:.4; }
      .oh-row.drag-over { box-shadow:0 0 0 2px #3483fa; background:#f0f6ff; }
      .oh-handle { cursor:grab; color:#ccc; font-size:1.1rem; user-select:none; flex-shrink:0; }
      .oh-pos-input {
        width:42px; height:32px; border:1px solid #ddd; border-radius:6px;
        text-align:center; font-size:0.85rem; font-weight:700; color:#3483fa;
        background:#f8f9ff; flex-shrink:0;
      }
      .oh-pos-input:focus { outline:none; border-color:#3483fa; background:#fff; }
      .oh-img { width:40px; height:40px; object-fit:cover; border-radius:6px; background:#f5f5f5; flex-shrink:0; }
      .oh-info { flex:1; min-width:0; }
      .oh-nombre { font-size:0.83rem; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .oh-sku { font-size:0.7rem; color:#aaa; }
      .oh-btns { display:flex; flex-direction:column; gap:2px; flex-shrink:0; }
      .oh-btn {
        width:26px; height:26px; border:1px solid #e0e0e0; border-radius:5px;
        background:#fafafa; cursor:pointer; font-size:0.85rem;
        display:flex; align-items:center; justify-content:center; padding:0;
      }
      .oh-btn:active { background:#e8f0ff; }
      .oh-btn:disabled { opacity:.25; cursor:default; }
      .oh-stock-badge {
        background:#e8f5e9; color:#2e7d32; font-size:0.66rem; font-weight:700;
        padding:1px 6px; border-radius:100px; margin-left:4px; white-space:nowrap;
      }
      @media(max-width:480px){
        .oh-nombre { font-size:0.78rem; }
        .oh-img { width:34px; height:34px; }
        .oh-handle { display:none; }
      }
    </style>
    <div class="oh-wrap">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;flex-wrap:wrap;gap:0.5rem">
        <div>
          <h2 style="margin:0;font-size:1.05rem">🏠 Orden en Home</h2>
          <p style="margin:0.2rem 0 0;font-size:0.75rem;color:#888">Escribe un número para mover el modelo a esa posición</p>
        </div>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
          <button id="oh-sort-stock-btn" onclick="_ohOrdenarPorStock()" style="background:#fff;color:#2e7d32;border:1px solid #a5d6a7;border-radius:8px;padding:0.5rem 0.9rem;font-size:0.83rem;font-weight:600;cursor:pointer">
            📦 Por stock
          </button>
          <button id="oh-save-btn" onclick="guardarOrdenHome()" style="background:#3483fa;color:#fff;border:none;border-radius:8px;padding:0.5rem 1.1rem;font-size:0.83rem;font-weight:600;cursor:pointer">
            💾 Guardar orden
          </button>
        </div>
      </div>
      <input id="oh-search" type="text" placeholder="🔍 Buscar modelo o SKU..."
        oninput="_ohFiltrar(this.value)"
        style="width:100%;box-sizing:border-box;padding:0.55rem 0.8rem;border:1px solid #ddd;border-radius:8px;font-size:0.85rem;margin-bottom:0.75rem">
      <div id="oh-count" style="font-size:0.75rem;color:#aaa;margin-bottom:0.5rem"></div>
      <div id="oh-lista"><p style="color:#888;text-align:center;padding:2rem">Cargando...</p></div>
    </div>
  `

  try {
    const r = await fetch(`${API}/productos/`)
    const todos = await r.json()
    _ordenHomeList = todos.filter(p => p.activo).sort((a, b) => {
      const ao = a.orden_home ?? 99999
      const bo = b.orden_home ?? 99999
      if (ao !== bo) return ao - bo
      return new Date(b.created_at) - new Date(a.created_at)
    })
    _ohBusqueda = ''
    _ohRenderLista()
  } catch(e) {
    document.getElementById('oh-lista').innerHTML = `<p style="color:red">Error: ${e.message}</p>`
  }
}

window._ohFiltrar = function(val) {
  _ohBusqueda = val.toLowerCase().trim()
  _ohRenderLista()
}

function _ohRenderLista() {
  const lista = document.getElementById('oh-lista')
  const countEl = document.getElementById('oh-count')
  if (!lista) return

  const total = _ordenHomeList.length
  const visibles = _ohBusqueda
    ? _ordenHomeList.filter(p =>
        (p.nombre || '').toLowerCase().includes(_ohBusqueda) ||
        (p.sku_interno || '').toLowerCase().includes(_ohBusqueda)
      )
    : _ordenHomeList

  if (countEl) countEl.textContent = _ohBusqueda
    ? `${visibles.length} de ${total} modelos`
    : `${total} modelos activos`

  if (!total) {
    lista.innerHTML = '<p style="color:#888;text-align:center;padding:2rem">No hay productos activos</p>'
    return
  }
  if (!visibles.length) {
    lista.innerHTML = '<p style="color:#aaa;text-align:center;padding:1.5rem">Sin resultados para esa búsqueda</p>'
    return
  }

  lista.innerHTML = visibles.map(p => {
    const i = _ordenHomeList.indexOf(p)  // posición real en la lista completa
    const pos = i + 1
    const foto = p.foto_principal || (p.imagenes && p.imagenes[0]) || ''
    const imgHtml = foto
      ? `<img class="oh-img" src="${foto}" alt="" loading="lazy" onerror="this.style.display='none'">`
      : `<div class="oh-img" style="display:flex;align-items:center;justify-content:center;font-size:1.1rem">👠</div>`
    return `
      <div class="oh-row" id="oh-row-${i}" draggable="true"
           ondragstart="_ohDragStart(event,${i})"
           ondragover="_ohDragOver(event,${i})"
           ondrop="_ohDrop(event,${i})"
           ondragend="_ohDragEnd()">
        <span class="oh-handle">⠿</span>
        <input class="oh-pos-input" type="number" min="1" max="${total}" value="${pos}"
          title="Posición — presiona Enter para mover"
          onkeydown="if(event.key==='Enter')_ohSetPos('${p.id}',+this.value)"
          onblur="_ohSetPos('${p.id}',+this.value)">
        ${imgHtml}
        <div class="oh-info">
          <div class="oh-nombre">${p.nombre || 'Sin nombre'}</div>
          <div class="oh-sku">${p.sku_interno || ''}${p._stockTotal != null ? `<span class="oh-stock-badge">📦 ${p._stockTotal}</span>` : ''}</div>
        </div>
        <div class="oh-btns">
          <button class="oh-btn" onclick="_ohMover(${i},-1)" ${i === 0 ? 'disabled' : ''}>↑</button>
          <button class="oh-btn" onclick="_ohMover(${i},1)" ${i === total - 1 ? 'disabled' : ''}>↓</button>
        </div>
      </div>`
  }).join('')
}

window._ohSetPos = function(id, nuevaPos) {
  const idx = _ordenHomeList.findIndex(p => p.id === id)
  if (idx === -1) return
  nuevaPos = Math.max(1, Math.min(Math.round(nuevaPos), _ordenHomeList.length)) - 1
  if (idx === nuevaPos) return
  const [item] = _ordenHomeList.splice(idx, 1)
  _ordenHomeList.splice(nuevaPos, 0, item)
  _ohRenderLista()
  // Mantener el foco en el buscador si estaba activo
}

window._ohMover = function(idx, dir) {
  const nuevoIdx = idx + dir
  if (nuevoIdx < 0 || nuevoIdx >= _ordenHomeList.length) return
  const tmp = _ordenHomeList[idx]
  _ordenHomeList[idx] = _ordenHomeList[nuevoIdx]
  _ordenHomeList[nuevoIdx] = tmp
  _ohRenderLista()
}

let _ohDragIdx = null
window._ohDragStart = function(e, i) {
  _ohDragIdx = i
  e.dataTransfer.effectAllowed = 'move'
  setTimeout(() => { const el = document.getElementById(`oh-row-${i}`); if(el) el.classList.add('dragging') }, 0)
}
window._ohDragOver = function(e, i) {
  e.preventDefault()
  document.querySelectorAll('.oh-row').forEach(r => r.classList.remove('drag-over'))
  const el = document.getElementById(`oh-row-${i}`)
  if (el) el.classList.add('drag-over')
}
window._ohDrop = function(e, i) {
  e.preventDefault()
  if (_ohDragIdx === null || _ohDragIdx === i) return
  const [item] = _ordenHomeList.splice(_ohDragIdx, 1)
  _ordenHomeList.splice(i, 0, item)
  _ohDragIdx = null
  _ohRenderLista()
}
window._ohDragEnd = function() {
  _ohDragIdx = null
  document.querySelectorAll('.oh-row').forEach(r => { r.classList.remove('dragging'); r.classList.remove('drag-over') })
}

window._ohOrdenarPorStock = async function() {
  const btn = document.getElementById('oh-sort-stock-btn')
  if (btn) { btn.disabled = true; btn.textContent = 'Cargando...' }
  try {
    const [varsRes, slimRes] = await Promise.all([
      fetch(`${API}/variantes/`),
      fetch(`${API}/inventario/slim`)
    ])
    const vars = await varsRes.json()
    const slim = await slimRes.json()

    // variante_id → producto_id
    const varMap = {}
    vars.forEach(v => { varMap[v.id] = v.producto_id })

    // suma de stock por producto
    const stockPorProd = {}
    slim.forEach(s => {
      const pid = varMap[s.variante_id]
      if (pid) stockPorProd[pid] = (stockPorProd[pid] || 0) + (s.cantidad || 0)
    })

    _ordenHomeList.forEach(p => { p._stockTotal = stockPorProd[p.id] || 0 })
    _ordenHomeList.sort((a, b) => (b._stockTotal || 0) - (a._stockTotal || 0))
    _ohRenderLista()
    if (btn) { btn.style.background = '#e8f5e9'; btn.textContent = '📦 Por stock ✓' }
    setTimeout(() => { if (btn) { btn.style.background = '#fff'; btn.textContent = '📦 Por stock' } }, 2000)
  } catch(e) {
    alert('Error al obtener stock: ' + e.message)
  } finally {
    if (btn) btn.disabled = false
  }
}

window.guardarOrdenHome = async function() {
  const btn = document.getElementById('oh-save-btn')
  if (btn) { btn.disabled = true; btn.textContent = 'Guardando...' }
  try {
    const ordenes = _ordenHomeList.map((p, i) => ({ id: p.id, orden_home: i + 1 }))
    const r = await fetch(`${API}/productos/orden-home`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ordenes)
    })
    const d = await r.json()
    if (d.ok) {
      if (btn) { btn.textContent = '✅ Guardado'; btn.style.background = '#22c55e' }
      setTimeout(() => { if(btn) { btn.disabled = false; btn.textContent = '💾 Guardar orden'; btn.style.background = '#3483fa' } }, 2000)
    } else {
      alert('Error al guardar: ' + JSON.stringify(d))
      if (btn) { btn.disabled = false; btn.textContent = '💾 Guardar orden' }
    }
  } catch(e) {
    alert('Error: ' + e.message)
    if (btn) { btn.disabled = false; btn.textContent = '💾 Guardar orden' }
  }
}

// ─── FIN ORDEN EN HOME ───────────────────────────────────────────────────────

let _gaRealtimeInterval = null

async function cargarAnalyticsGA() {
  if (_gaRealtimeInterval) { clearInterval(_gaRealtimeInterval); _gaRealtimeInterval = null }
  const content = document.getElementById('content')
  content.innerHTML = `
    <style>
      .ga-wrap { padding:1rem; max-width:900px; box-sizing:border-box; }
      .ga-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; flex-wrap:wrap; gap:0.5rem; }
      .ga-top { display:grid; grid-template-columns:160px 1fr; gap:1rem; margin-bottom:1rem; }
      .ga-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:0.6rem; }
      .ga-stat { text-align:center; }
      .ga-stat-num { font-size:1.6rem; font-weight:700; line-height:1.2; }
      .ga-stat-lbl { font-size:0.7rem; color:#888; margin-top:2px; }
      @media(max-width:600px){
        .ga-wrap { padding:0.75rem; }
        .ga-top { grid-template-columns:1fr; }
        .ga-stats { grid-template-columns:repeat(3,1fr); gap:0.4rem; }
        .ga-stat-num { font-size:1.25rem; }
        .ga-stat-lbl { font-size:0.65rem; }
      }
    </style>
    <div class="ga-wrap">
      <div class="ga-header">
        <h2 style="margin:0;font-size:1.1rem">📊 Google Analytics</h2>
        <span id="ga-ultima-act" style="font-size:0.75rem;color:#aaa"></span>
      </div>

      <!-- Tiempo real + Hoy -->
      <div class="ga-top">
        <div class="card" style="text-align:center;padding:1.25rem">
          <div style="font-size:0.7rem;color:#888;text-transform:uppercase;letter-spacing:.05em;margin-bottom:0.25rem">Ahora en el sitio</div>
          <div id="ga-activos" style="font-size:3rem;font-weight:700;color:#22c55e;line-height:1">—</div>
          <div style="font-size:0.7rem;color:#888;margin-top:0.2rem">usuarios activos</div>
          <div id="ga-dispositivos" style="font-size:0.68rem;color:#bbb;margin-top:0.4rem;line-height:1.5"></div>
          <div id="ga-paginas-rt" style="margin-top:0.6rem;text-align:left"></div>
        </div>
        <div class="card" style="padding:1rem">
          <div style="font-size:0.7rem;font-weight:600;color:#888;margin-bottom:0.6rem;text-transform:uppercase;letter-spacing:.05em" id="ga-hoy-label">Hoy</div>
          <div class="ga-stats">
            <div class="ga-stat"><div class="ga-stat-num" id="ga-sesiones">—</div><div class="ga-stat-lbl">Sesiones</div></div>
            <div class="ga-stat"><div class="ga-stat-num" id="ga-usuarios">—</div><div class="ga-stat-lbl">Usuarios</div></div>
            <div class="ga-stat"><div class="ga-stat-num" id="ga-pageviews">—</div><div class="ga-stat-lbl">Páginas</div></div>
            <div class="ga-stat"><div class="ga-stat-num" id="ga-nuevos">—</div><div class="ga-stat-lbl">Nuevos</div></div>
            <div class="ga-stat"><div class="ga-stat-num" id="ga-duracion">—</div><div class="ga-stat-lbl">Duración</div></div>
            <div class="ga-stat"><div class="ga-stat-num" id="ga-rebote">—</div><div class="ga-stat-lbl">Rebote</div></div>
          </div>
        </div>
      </div>

      <!-- Gráfica 7 días -->
      <div class="card" style="margin-bottom:1rem;padding:1rem">
        <div style="font-size:0.7rem;font-weight:600;color:#888;margin-bottom:0.6rem;text-transform:uppercase;letter-spacing:.05em">Últimos 7 días</div>
        <canvas id="ga-chart" height="90"></canvas>
      </div>

      <!-- Top páginas -->
      <div class="card" style="padding:1rem">
        <div style="font-size:0.7rem;font-weight:600;color:#888;margin-bottom:0.6rem;text-transform:uppercase;letter-spacing:.05em">Top páginas hoy</div>
        <div id="ga-top-paginas"><p style="color:#888;font-size:0.85rem">Cargando...</p></div>
      </div>

      <!-- Setup guide si no está configurado -->
      <div id="ga-setup" style="display:none;margin-top:1rem" class="card">
        <h4 style="margin-top:0">⚙️ Configuración pendiente</h4>
        <div id="ga-setup-body"></div>
      </div>
    </div>
  `

  await _gaCargarTodo()

  // Auto-refresh del tiempo real cada 30 segundos
  _gaRealtimeInterval = setInterval(async () => {
    if (document.getElementById('ga-activos')) await _gaActualizarRealtime()
    else { clearInterval(_gaRealtimeInterval); _gaRealtimeInterval = null }
  }, 30000)
}

async function _gaFetchConTimeout(url, ms = 8000) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), ms)
  try {
    const r = await fetch(url, { signal: ctrl.signal })
    clearTimeout(timer)
    return r
  } catch(e) {
    clearTimeout(timer)
    if (e.name === 'AbortError') throw new Error('timeout')
    throw e
  }
}

async function _gaCargarTodo() {
  // Cargar las 3 secciones independientemente — si una falla no bloquea las demás
  const tareas = [
    _gaActualizarRealtime().catch(() => _gaSeccionError('ga-activos', '—')),
    _gaCargarHoy().catch(() => _gaSeccionError('ga-sesiones', '—')),
    _gaCargarSemana().catch(() => _gaSeccionError('ga-chart', null))
  ]
  await Promise.allSettled(tareas)
  const el = document.getElementById('ga-ultima-act')
  if (el) el.textContent = 'Actualizado: ' + new Date().toLocaleTimeString('es-MX', {hour:'2-digit',minute:'2-digit',second:'2-digit'})
}

function _gaSeccionError(elId, val) {
  const el = document.getElementById(elId)
  if (el && val !== null) el.textContent = val
}

async function _gaActualizarRealtime() {
  try {
    const r = await _gaFetchConTimeout(`${API}/analytics/tiempo-real`)
    const d = await r.json()
    if (!d.configurado) { _gaMostrarSetup(d); return }
    const el = document.getElementById('ga-activos')
    if (!el) return
    el.textContent = d.activos_ahora ?? 0

    // Dispositivos
    const dispEl = document.getElementById('ga-dispositivos')
    if (dispEl && d.por_dispositivo) {
      dispEl.textContent = Object.entries(d.por_dispositivo)
        .map(([k,v]) => `${k}: ${v}`).join(' · ')
    }

    // Países en tiempo real
    const paginasEl = document.getElementById('ga-paginas-rt')
    if (paginasEl && d.por_pais?.length) {
      paginasEl.innerHTML =
        `<div style="font-size:0.65rem;color:#aaa;margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em">Por país</div>` +
        d.por_pais.map(p => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:2px 0;border-bottom:1px solid #f5f5f5;gap:4px">
            <span style="font-size:0.68rem;color:#555;flex:1">${p.pais || 'Desconocido'}</span>
            <span style="font-size:0.68rem;font-weight:700;color:#22c55e;flex-shrink:0">${p.activos}</span>
          </div>`).join('')
    } else if (paginasEl) {
      paginasEl.innerHTML = ''
    }
  } catch(e) { console.warn('GA realtime:', e.message) }
}

async function _gaCargarHoy() {
  try {
    const r = await _gaFetchConTimeout(`${API}/analytics/hoy`)
    const d = await r.json()
    if (!d.configurado) return
    if (d.error) { console.warn('GA hoy error:', d.error); return }

    // Etiqueta del período (hoy o ayer si GA4 aún no procesó)
    const labelEl = document.getElementById('ga-hoy-label')
    if (labelEl) labelEl.textContent = d.periodo === 'ayer' ? 'Ayer (GA4 procesando hoy)' : 'Hoy'

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val }
    set('ga-sesiones',  d.sesiones ?? '—')
    set('ga-usuarios',  d.usuarios_activos ?? '—')
    set('ga-pageviews', d.paginas_vistas ?? '—')
    set('ga-nuevos',    d.usuarios_nuevos ?? '—')
    const dur = d.duracion_promedio_s
    set('ga-duracion', dur ? `${Math.floor(dur/60)}m ${dur%60}s` : '—')
    set('ga-rebote',   d.tasa_rebote != null ? `${d.tasa_rebote}%` : '—')

    const top = document.getElementById('ga-top-paginas')
    if (top) {
      if (d.top_paginas?.length) {
        top.innerHTML = d.top_paginas.map(p => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:0.35rem 0;border-bottom:1px solid #f0f0f0;gap:0.5rem">
            <span style="font-size:0.8rem;color:#333;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1"
                  title="${p.pagina}">${p.pagina}</span>
            <span style="font-size:0.8rem;font-weight:600;color:#3483fa;flex-shrink:0">${p.vistas} vistas</span>
          </div>`).join('')
      } else {
        top.innerHTML = '<p style="color:#bbb;font-size:0.82rem;margin:0">Sin datos de páginas aún</p>'
      }
    }
  } catch(e) { console.warn('GA hoy:', e.message) }
}

async function _gaCargarSemana() {
  try {
    const r = await _gaFetchConTimeout(`${API}/analytics/semana`)
    const d = await r.json()
    if (!d.configurado || !d.dias?.length) return

    const canvas = document.getElementById('ga-chart')
    if (!canvas || !window.Chart) return

    if (canvas._chartInstance) canvas._chartInstance.destroy()
    canvas._chartInstance = new Chart(canvas, {
      type: 'bar',
      data: {
        labels:   d.dias.map(x => x.fecha),
        datasets: [
          {
            label:           'Sesiones',
            data:            d.dias.map(x => x.sesiones),
            backgroundColor: 'rgba(52,131,250,0.7)',
            borderRadius:    4,
          },
          {
            label:           'Usuarios',
            data:            d.dias.map(x => x.usuarios),
            backgroundColor: 'rgba(34,197,94,0.5)',
            borderRadius:    4,
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
      }
    })
  } catch(e) { console.warn('GA semana:', e.message) }
}

function _gaMostrarSetup(d) {
  const el = document.getElementById('ga-setup')
  const body = document.getElementById('ga-setup-body')
  if (!el || !body) return
  el.style.display = 'block'
  body.innerHTML = `
    <p style="color:#666;margin-bottom:0.75rem">${d.mensaje || ''}</p>
    <ol style="color:#555;font-size:0.85rem;line-height:1.8">
      ${(d.pasos || []).map(p => `<li>${p}</li>`).join('')}
    </ol>
    <p style="font-size:0.82rem;color:#888;margin-top:0.75rem">
      Variables a agregar en Railway → Variables:
      <code style="background:#f0f0f0;padding:2px 6px;border-radius:4px">GA4_PROPERTY_ID</code> y
      <code style="background:#f0f0f0;padding:2px 6px;border-radius:4px">GA4_CREDENTIALS_JSON</code>
    </p>`
  // Poner placeholder en los números
  ;['ga-activos','ga-sesiones','ga-usuarios','ga-pageviews','ga-nuevos','ga-duracion','ga-rebote']
    .forEach(id => { const el = document.getElementById(id); if (el) el.textContent = '—' })
}

// ── REFERIDOS ──────────────────────────────────────────────────────────────
async function cargarReferidos() {
  const content = document.getElementById('content')
  content.innerHTML = '<p style="padding:2rem;color:#888">Cargando referidos...</p>'
  try {
    const res = await fetch(API + '/clientes/referidos')
    const clientes = await res.json()

    // Stats generales
    const conCodigo    = clientes.filter(c => c.codigo_referido).length
    const conCredito   = clientes.filter(c => parseFloat(c.credito_disponible || 0) > 0).length
    const totalCredito = clientes.reduce((s, c) => s + parseFloat(c.credito_disponible || 0), 0)
    const referidores  = clientes.filter(c => c.codigo_referido && clientes.some(x => x.referido_por === c.codigo_referido))

    // Mapa código → nombre del referidor
    const mapCodigo = {}
    clientes.forEach(c => { if (c.codigo_referido) mapCodigo[c.codigo_referido] = c.nombre })

    window._referidosData = clientes

    content.innerHTML = `
      <div style="padding:1rem;max-width:960px">
        <h2 style="margin:0 0 1rem;font-size:1.1rem">🎁 Programa de Referidos</h2>

        <!-- Stats -->
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;margin-bottom:1.5rem">
          <div style="background:white;border-radius:12px;padding:1rem;border:1px solid #eee;text-align:center">
            <p style="font-size:1.8rem;font-weight:700;color:#333">${clientes.length}</p>
            <p style="font-size:0.72rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Clientes menudeo</p>
          </div>
          <div style="background:#fff8e1;border-radius:12px;padding:1rem;border:1px solid #ffe082;text-align:center">
            <p style="font-size:1.8rem;font-weight:700;color:#f57f17">${referidores.length}</p>
            <p style="font-size:0.72rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Han referido alguien</p>
          </div>
          <div style="background:#e8f5e9;border-radius:12px;padding:1rem;border:1px solid #a5d6a7;text-align:center">
            <p style="font-size:1.8rem;font-weight:700;color:#2e7d32">${conCredito}</p>
            <p style="font-size:0.72rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Con crédito activo</p>
          </div>
          <div style="background:#fce4ec;border-radius:12px;padding:1rem;border:1px solid #f48fb1;text-align:center">
            <p style="font-size:1.8rem;font-weight:700;color:#c62828">$${totalCredito.toFixed(0)}</p>
            <p style="font-size:0.72rem;color:#888;text-transform:uppercase;letter-spacing:0.5px">Crédito total emitido</p>
          </div>
        </div>

        <!-- Buscador -->
        <input id="ref-buscar" type="text" placeholder="Buscar cliente..." oninput="filtrarReferidos(this.value)"
          style="width:100%;box-sizing:border-box;padding:10px 14px;border:1px solid #ddd;border-radius:8px;font-size:0.88rem;margin-bottom:1rem;outline:none">

        <!-- Tabla -->
        <div style="background:white;border-radius:12px;border:1px solid #eee;overflow:hidden">
          <table style="width:100%;border-collapse:collapse;font-size:0.83rem">
            <thead>
              <tr style="background:#fafafa;border-bottom:1px solid #eee">
                <th style="padding:10px 12px;text-align:left;font-weight:600;color:#555">Cliente</th>
                <th style="padding:10px 12px;text-align:left;font-weight:600;color:#555">Código</th>
                <th style="padding:10px 12px;text-align:left;font-weight:600;color:#555">Referido por</th>
                <th style="padding:10px 12px;text-align:right;font-weight:600;color:#555">Crédito</th>
                <th style="padding:10px 12px;text-align:center;font-weight:600;color:#555">Acción</th>
              </tr>
            </thead>
            <tbody id="ref-tbody">
              ${clientes.map(c => _rowReferido(c, mapCodigo)).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `
  } catch(e) {
    content.innerHTML = `<p style="padding:2rem;color:red">Error cargando referidos: ${e.message}</p>`
  }
}

function _rowReferido(c, mapCodigo) {
  const credito = parseFloat(c.credito_disponible || 0)
  const referidorNombre = c.referido_por ? (mapCodigo[c.referido_por] || c.referido_por) : '—'
  const creditoColor = credito > 0 ? '#2e7d32' : '#aaa'
  return `<tr id="ref-row-${c.id}" style="border-bottom:1px solid #f5f5f5">
    <td style="padding:10px 12px">
      <p style="font-weight:600;margin:0">${c.nombre || '—'}</p>
      <p style="font-size:0.75rem;color:#888;margin:2px 0 0">${c.email || c.telefono || ''}</p>
    </td>
    <td style="padding:10px 12px">
      ${c.codigo_referido
        ? `<span style="font-family:monospace;background:#f0f0f0;padding:3px 8px;border-radius:6px;font-size:0.8rem;letter-spacing:1px">${c.codigo_referido}</span>`
        : `<button onclick="generarCodigoReferido('${c.id}')" style="font-size:0.75rem;padding:3px 8px;border:1px solid #ddd;border-radius:6px;background:white;cursor:pointer;color:#555">Generar</button>`
      }
    </td>
    <td style="padding:10px 12px;color:#555">${referidorNombre}</td>
    <td style="padding:10px 12px;text-align:right;font-weight:700;color:${creditoColor}">$${credito.toFixed(0)} MXN</td>
    <td style="padding:10px 12px;text-align:center">
      <button onclick="ajustarCredito('${c.id}','${(c.nombre||'').replace(/'/g,"\\'")}',${credito})"
        style="font-size:0.75rem;padding:4px 10px;border:1px solid #ddd;border-radius:6px;background:white;cursor:pointer;color:#333">
        Ajustar
      </button>
    </td>
  </tr>`
}

window.filtrarReferidos = function(q) {
  const rows = document.querySelectorAll('#ref-tbody tr')
  const lq = q.toLowerCase()
  rows.forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(lq) ? '' : 'none'
  })
}

window.generarCodigoReferido = async function(clienteId) {
  try {
    const res = await fetch(API + '/referidos/mi-codigo/' + clienteId)
    const data = await res.json()
    if (data.codigo_referido) {
      await cargarReferidos()
    } else {
      alert('Error generando código')
    }
  } catch(e) { alert('Error: ' + e.message) }
}

window.ajustarCredito = async function(clienteId, nombre, creditoActual) {
  const nuevo = prompt(`Ajustar crédito de ${nombre}\nCrédito actual: $${creditoActual} MXN\n\nNuevo monto:`, creditoActual)
  if (nuevo === null) return
  const monto = parseFloat(nuevo)
  if (isNaN(monto) || monto < 0) return alert('Monto inválido')
  try {
    const res = await fetch(API + '/clientes/' + clienteId, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credito_disponible: monto })
    })
    if (res.ok) await cargarReferidos()
    else alert('Error actualizando crédito')
  } catch(e) { alert('Error: ' + e.message) }
}

// ─── CARRITOS MAYOREO ──────────────────────────────────────────────────────────

async function cargarCarritos() {
  const content = document.getElementById('content')
  content.innerHTML = '<p style="padding:2rem;color:#888">Cargando carritos...</p>'
  try {
    const [resBorradores, resClientes, resSucursales] = await Promise.all([
      fetch(API + '/pedidos/?status=borrador').then(r => r.json()).catch(() => []),
      fetch(API + '/clientes/').then(r => r.json()),
      fetch(API + '/sucursales/').then(r => r.json())
    ])
    // Filtrar solo borradores del canal sucursal o sin canal (mayoreo manual)
    const borradores = Array.isArray(resBorradores)
      ? resBorradores.filter(p => p.status === 'borrador' && (!p.canal || p.canal === 'sucursal' || p.canal === 'mayoreo'))
      : []

    content.innerHTML = `
      <div style="padding:0 0 1rem">
        <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:1.5rem;flex-wrap:wrap;gap:8px">
          <div>
            <p style="font-size:0.72rem;font-weight:600;letter-spacing:0.08em;color:#E91E8C;text-transform:uppercase;margin:0 0 3px">Punto de venta</p>
            <h2 style="font-size:1.25rem;font-weight:700;color:#0f172a;margin:0">Carritos activos</h2>
            <p style="color:#94a3b8;font-size:0.78rem;margin:4px 0 0">El stock se reserva al confirmar la venta</p>
          </div>
          <button class="btn btn-primary" onclick="nuevoCarrito()">+ Nuevo carrito</button>
        </div>

        ${borradores.length === 0 ? `
          <div class="table-card" style="padding:3rem;text-align:center">
            <p style="font-weight:700;color:#0f172a;font-size:1rem">Sin carritos abiertos</p>
            <p style="font-size:0.82rem;color:#94a3b8;margin-top:4px">Crea uno para agregar productos a un cliente</p>
            <button class="btn btn-primary" style="margin-top:1.25rem" onclick="nuevoCarrito()">+ Nuevo carrito</button>
          </div>
        ` : `
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem">
            ${borradores.map(p => {
              const cliente = p.clientes || {}
              const dias = p.created_at ? Math.floor((Date.now() - new Date(p.created_at).getTime()) / 86400000) : 0
              return `
                <div style="background:white;border-radius:14px;border:1px solid #e2e8f0;padding:1.2rem;cursor:pointer;transition:box-shadow 0.18s,border-color 0.18s" onclick="abrirCarrito('${p.id}')"
                     onmouseenter="this.style.boxShadow='0 4px 24px rgba(0,0,0,0.08)';this.style.borderColor='#E91E8C'" onmouseleave="this.style.boxShadow='';this.style.borderColor='#e2e8f0'">
                  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px">
                    <div>
                      <p style="font-weight:700;font-size:0.95rem;color:#0f172a;margin:0">${cliente.nombre || 'Sin cliente'}</p>
                      <p style="font-size:0.75rem;color:#94a3b8;margin:3px 0 0">${cliente.telefono || 'Sin teléfono'}</p>
                    </div>
                    <span style="background:${dias === 0 ? '#f0fdf4' : dias <= 2 ? '#fffbeb' : '#fef2f2'};color:${dias === 0 ? '#065f46' : dias <= 2 ? '#b45309' : '#991b1b'};border:1px solid ${dias === 0 ? '#bbf7d0' : dias <= 2 ? '#fde68a' : '#fecaca'};border-radius:100px;padding:3px 10px;font-size:0.7rem;font-weight:700;white-space:nowrap">
                      ${dias === 0 ? 'Hoy' : dias === 1 ? '1 día' : dias + ' días'}
                    </span>
                  </div>
                  <div style="border-top:1px solid #f1f5f9;padding-top:12px;margin-bottom:14px">
                    <p style="font-size:0.65rem;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#94a3b8;margin:0 0 2px">Total</p>
                    <p style="font-weight:700;font-size:1.35rem;color:#E91E8C;margin:0">$${parseFloat(p.total || 0).toLocaleString('es-MX', {minimumFractionDigits:2})}</p>
                  </div>
                  <div style="display:flex;gap:6px">
                    <button class="btn btn-primary" style="flex:1;font-size:0.8rem" onclick="event.stopPropagation();abrirCarrito('${p.id}')">Abrir</button>
                    <button class="btn btn-secondary" style="font-size:0.8rem;color:#dc2626;border-color:#fca5a5" onclick="event.stopPropagation();liberarCarrito('${p.id}')">Liberar</button>
                  </div>
                </div>
              `
            }).join('')}
          </div>
        `}
      </div>
    `
    window._carritoClientes = resClientes
    window._carritoSucursales = resSucursales
  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error cargando carritos</p>'
  }
}

window.nuevoCarrito = async () => {
  const clientes = window._carritoClientes || []
  const sucursales = window._carritoSucursales || []

  const content = document.getElementById('content')
  content.innerHTML = `
    <div class="table-card" style="padding:2rem;max-width:500px">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
        <button class="btn btn-secondary" onclick="cargarCarritos()">← Volver</button>
        <h3 style="margin:0">Nuevo carrito</h3>
      </div>
      <div style="display:grid;gap:1rem">
        <div>
          <label class="form-label">Cliente</label>
          <select id="nc-cliente" class="form-input">
            <option value="">— Selecciona cliente —</option>
            ${clientes.map(c => `<option value="${c.id}">${c.nombre}${c.telefono ? ' · ' + c.telefono : ''}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="form-label">Sucursal</label>
          <select id="nc-sucursal" class="form-input">
            ${sucursales.map(s => `<option value="${s.id}">${s.nombre}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="form-label">Comentario (opcional)</label>
          <input class="form-input" id="nc-comentario" placeholder="Ej: Anticipo $500, entrega el viernes...">
        </div>
        <button class="btn btn-primary" onclick="crearNuevoCarrito()">Crear carrito</button>
      </div>
    </div>
  `
}

window.crearNuevoCarrito = async () => {
  const clienteId = document.getElementById('nc-cliente').value
  const sucursalId = document.getElementById('nc-sucursal').value
  const comentario = document.getElementById('nc-comentario').value
  if (!clienteId) { alert('Selecciona un cliente'); return }

  try {
    const res = await fetch(API + '/pedidos/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cliente_id: clienteId,
        sucursal_id: sucursalId,
        canal: 'sucursal',
        forma_pago: 'efectivo',
        status: 'borrador',
        total: 0,
        subtotal: 0,
        comentarios: comentario || null,
        items: []
      })
    })
    const data = await res.json()
    const pedidoId = data.id || data[0]?.id
    if (!pedidoId) { alert('Error creando carrito'); return }
    abrirCarrito(pedidoId)
  } catch(e) {
    alert('Error: ' + e.message)
  }
}

window.abrirCarrito = async (pedidoId) => {
  const content = document.getElementById('content')
  content.innerHTML = '<p style="padding:2rem;color:#888">Cargando carrito...</p>'
  try {
    const [resPedido, resItems, resVariantes, resProductos, resInv] = await Promise.all([
      fetch(API + '/pedidos/' + pedidoId).then(r => r.json()),
      fetch(API + '/pedidos/' + pedidoId + '/items').then(r => r.json()),
      fetch(API + '/variantes/?activa=eq.true').then(r => r.json()),
      fetch(API + '/productos/').then(r => r.json()),
      fetch(API + '/inventario/').then(r => r.json()).catch(() => [])
    ])

    const p = Array.isArray(resPedido) ? resPedido[0] : resPedido
    const cliente = p.clientes || {}

    window._carritoActivo = {
      pedidoId,
      items: Array.isArray(resItems) ? resItems : [],
      variantes: resVariantes,
      productos: resProductos,
      inventario: resInv,
      sucursalId: p.sucursal_id
    }

    renderCarritoAbierto(p)
  } catch(e) {
    content.innerHTML = '<p style="padding:2rem;color:red">Error cargando carrito</p>'
  }
}

function renderCarritoAbierto(p) {
  const content = document.getElementById('content')
  const { pedidoId, items, variantes, productos, inventario, sucursalId } = window._carritoActivo
  const cliente = p.clientes || {}
  const total = items.reduce((s, i) => s + (i.cantidad * i.precio_unitario), 0)
  const totalPares = items.reduce((s, i) => s + i.cantidad, 0)
  const dias = p.created_at ? Math.floor((Date.now() - new Date(p.created_at).getTime()) / 86400000) : 0

  content.innerHTML = `
    <div style="max-width:860px">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap">
        <button class="btn btn-secondary" onclick="cargarCarritos()">← Carritos</button>
        <div style="flex:1">
          <h3 style="margin:0">${cliente.nombre || 'Sin cliente'}</h3>
          <p style="font-size:0.8rem;color:#888;margin:2px 0 0">${cliente.telefono || ''} · Abierto hace ${dias === 0 ? 'hoy' : dias + ' día(s)'}</p>
        </div>
        <button class="btn btn-primary" style="background:#2e7d32;border-color:#2e7d32" onclick="confirmarVentaCarrito('${pedidoId}','${p.forma_pago || 'efectivo'}')">
          ✅ Confirmar venta
        </button>
        <button class="btn btn-secondary" style="color:#c62828;border-color:#c62828" onclick="liberarCarrito('${pedidoId}')">
          🗑 Liberar
        </button>
      </div>

      <!-- Buscador para agregar productos -->
      <div class="table-card" style="padding:1.2rem;margin-bottom:1rem">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px">
          <p style="font-weight:600;color:#333;margin:0">Agregar producto</p>
          <div style="display:flex;gap:0;border:1px solid #ddd;border-radius:8px;overflow:hidden">
            <button id="c-modo-par" onclick="carritoModo('par')"
              style="padding:5px 14px;font-size:0.8rem;border:none;cursor:pointer;background:#E91E8C;color:white;font-weight:600">Par suelto</button>
            <button id="c-modo-corrida" onclick="carritoModo('corrida')"
              style="padding:5px 14px;font-size:0.8rem;border:none;cursor:pointer;background:white;color:#888">Corrida completa</button>
          </div>
        </div>

        <!-- Modo par suelto -->
        <div id="c-panel-par">
          <div style="position:relative">
            <input class="form-input" id="c-buscar-prod" placeholder="🔍 Busca el modelo (nombre o SKU)…" oninput="buscarProductoCarrito(this.value)" autocomplete="off"
              onfocus="posicionarDropdownCarrito('c-prod-resultados','c-buscar-prod')" onblur="setTimeout(()=>{const el=document.getElementById('c-prod-resultados');if(el)el.style.display='none'},250)">
            <div id="c-prod-resultados" style="display:none;position:fixed;z-index:9999;background:white;border:1px solid #ddd;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.15);max-height:340px;overflow-y:auto;min-width:300px"></div>
          </div>
          <p style="font-size:0.76rem;color:#888;margin:7px 0 0;line-height:1.4">Busca el modelo y <strong>toca una talla</strong> para agregar 1 par. El precio se ajusta solo (menudeo · mayoreo). Ajusta cantidades en la lista de abajo.</p>
          <p id="c-prod-seleccionado" style="display:none"></p>
        </div>

        <!-- Modo corrida -->
        <div id="c-panel-corrida" style="display:none">
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end;margin-bottom:10px">
            <div style="flex:2;min-width:200px;position:relative">
              <label style="font-size:0.75rem;color:#888;display:block;margin-bottom:4px">Modelo (busca sin talla)</label>
              <input class="form-input" id="c-buscar-corrida" placeholder="Ej: M-TAC-0033 o nombre..." oninput="buscarModeloCarrito(this.value)" autocomplete="off" style="font-size:0.9rem"
                onfocus="posicionarDropdownCarrito('c-corrida-resultados','c-buscar-corrida')" onblur="setTimeout(()=>{const el=document.getElementById('c-corrida-resultados');if(el)el.style.display='none'},200)">
              <div id="c-corrida-resultados" style="display:none;position:fixed;z-index:9999;background:white;border:1px solid #ddd;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.15);max-height:260px;overflow-y:auto;min-width:320px"></div>
            </div>
            <div style="width:90px">
              <label style="font-size:0.75rem;color:#888;display:block;margin-bottom:4px">Precio/par</label>
              <input type="number" class="form-input" id="c-precio-corrida" placeholder="$" style="font-size:0.9rem">
            </div>
          </div>
          <div id="c-corrida-tallas" style="display:none;background:#f9f9f9;border-radius:8px;padding:12px;margin-top:8px">
            <p style="font-size:0.8rem;font-weight:600;color:#333;margin-bottom:8px">Selecciona tallas a agregar:</p>
            <div id="c-corrida-tallas-grid" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px"></div>
            <button class="btn btn-primary" style="background:#6a1b9a;border-color:#6a1b9a" onclick="agregarCorridaAlCarritoActivo()">📦 Agregar corrida</button>
          </div>
        </div>
      </div>

      <!-- Lista de productos en el carrito -->
      <div class="table-card" style="padding:1.2rem">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
          <p style="font-weight:600;color:#333;margin:0">Productos en carrito (<span id="carrito-total-pares">${totalPares}</span> pares)</p>
          <p style="font-weight:700;font-size:1.2rem;color:#E91E8C;margin:0">Total: $<span id="carrito-total-monto">${total.toFixed(2)}</span></p>
        </div>

        <div id="carrito-items-lista">
          ${items.length === 0 ? '<p style="color:#aaa;text-align:center;padding:2rem">Carrito vacío — agrega productos arriba</p>' : ''}
          ${(() => {
            // Agrupar: es_corrida viene directo de la BD
            const grupos = {}
            items.forEach((item, idx) => {
              const v = item.variantes || {}
              const pr = v.productos || {}
              const nombre = pr.nombre || item.nombre || '—'
              const color = v.color || item.color || ''
              const esCorrida = !!item.es_corrida
              // Corridas agrupan por nombre+color; pares sueltos van solos por su ID
              const key = esCorrida ? ('c|' + nombre + '|' + color) : ('s|' + item.id)
              if (!grupos[key]) grupos[key] = { nombre, color, esCorrida, items: [], imagen: v.foto_url || pr.imagen_principal || null }
              grupos[key].items.push({ ...item, _idx: idx })
            })

            return Object.values(grupos).map(g => {
              const esCorrida = g.esCorrida
              const imagen = g.imagen

              if (!esCorrida) {
                // Par suelto — fila normal
                const item = g.items[0]
                const v = item.variantes || {}
                const pr = v.productos || {}
                const talla = v.talla || item.talla || ''
                const invItem = inventario.find(i => i.variante_id === item.variante_id && (sucursalId ? i.sucursal_id === sucursalId : true))
                const stock = invItem ? invItem.cantidad : null
                return `
                  <div style="display:flex;align-items:center;gap:10px;padding:10px;background:#f9f9f9;border-radius:8px;margin-bottom:8px;border:1px solid #eee;flex-wrap:wrap">
                    ${imagen ? `<img src="${imagen}" style="width:52px;height:52px;object-fit:cover;border-radius:8px;flex-shrink:0">` : `<div style="width:52px;height:52px;background:#eee;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center">👟</div>`}
                    <div style="flex:1;min-width:120px">
                      <p style="font-weight:600;font-size:0.85rem;margin:0">${g.nombre}${g.color ? ' · '+g.color : ''}${talla ? ' T'+talla : ''}</p>
                      ${stock !== null ? `<p style="font-size:0.72rem;color:${stock>0?'#2e7d32':'#c62828'};margin:2px 0 0">Stock: ${stock} pares</p>` : ''}
                    </div>
                    <div style="display:flex;align-items:center;gap:6px">
                      <button onclick="cambiarCantidadCarrito(${item._idx},-1)" style="background:#eee;border:none;border-radius:4px;width:26px;height:26px;cursor:pointer;font-size:1rem">−</button>
                      <span style="font-weight:700;min-width:24px;text-align:center">${item.cantidad}</span>
                      <button onclick="cambiarCantidadCarrito(${item._idx},1)" style="background:#eee;border:none;border-radius:4px;width:26px;height:26px;cursor:pointer;font-size:1rem">+</button>
                    </div>
                    <input type="number" value="${item.precio_unitario}" style="width:80px;padding:5px;border:1px solid #ddd;border-radius:6px;text-align:center;font-size:0.85rem"
                      onchange="actualizarPrecioCarrito(${item._idx}, this.value)">
                    <strong style="color:#E91E8C;min-width:70px;text-align:right">$${(item.cantidad * item.precio_unitario).toFixed(2)}</strong>
                    <button onclick="eliminarDeCarrito('${item.id}',${item._idx})" style="background:none;border:none;color:#c62828;cursor:pointer;font-size:1.1rem;padding:4px">🗑</button>
                  </div>`
              } else {
                // Corrida agrupada
                const totalParesCorrida = g.items.reduce((s,i) => s+i.cantidad, 0)
                const subtotalCorrida = g.items.reduce((s,i) => s+(i.cantidad*i.precio_unitario), 0)
                const precioPorPar = (subtotalCorrida / totalParesCorrida).toFixed(2)
                const ids = g.items.map(i => i.id).join(',')
                return `
                  <div style="background:#fdf4ff;border-radius:8px;padding:12px;margin-bottom:8px;border:1px solid #e8d5f5">
                    <div style="display:flex;align-items:start;gap:10px;margin-bottom:8px">
                      ${imagen ? `<img src="${imagen}" style="width:52px;height:52px;object-fit:cover;border-radius:8px;flex-shrink:0">` : `<div style="width:52px;height:52px;background:#f3e5f5;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.3rem">👠</div>`}
                      <div style="flex:1">
                        <p style="font-weight:700;font-size:0.88rem;margin:0">${g.nombre}</p>
                        <p style="font-size:0.78rem;color:#6a1b9a;font-weight:600;margin:2px 0 4px">📦 Corrida · ${g.color}</p>
                        <div style="display:flex;flex-wrap:wrap;gap:4px">
                          ${g.items.map(i => {
                            const vt = i.variantes || {}
                            const talla = vt.talla || i.talla || '?'
                            return `<span style="background:#f3e5f5;border-radius:100px;padding:2px 8px;font-size:0.72rem;color:#6a1b9a">T${talla}</span>`
                          }).join('')}
                        </div>
                      </div>
                      <button onclick="eliminarCorridaCarrito('${ids}')" style="background:none;border:none;color:#c62828;cursor:pointer;font-size:1.1rem;padding:4px">🗑</button>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
                      <span id="corrida-header-${ids.replace(/,/g,'_').substring(0,20)}" style="font-size:0.85rem;color:#888">${totalParesCorrida} pares · <strong style="color:#6a1b9a">$${subtotalCorrida.toFixed(2)}</strong></span>
                      <div style="display:flex;align-items:center;gap:4px">
                        <span style="font-size:0.72rem;color:#888">$</span>
                        <input type="number" value="${precioPorPar}"
                          onchange="actualizarPrecioCorridaCarrito('${ids}', this.value)"
                          style="width:70px;text-align:center;border:1px solid #6a1b9a;border-radius:6px;padding:4px;font-size:0.9rem;font-weight:700;color:#6a1b9a">
                        <span style="font-size:0.72rem;color:#888">/par</span>
                      </div>
                      <strong style="color:#6a1b9a">$${subtotalCorrida.toFixed(2)}</strong>
                    </div>
                    <!-- Detalle editable por talla (toggle) -->
                    <div id="corrida-detalle-${ids.replace(/,/g,'_').substring(0,20)}" style="display:none;margin-top:10px;border-top:1px solid #e8d5f5;padding-top:10px">
                      ${g.items.map(i => {
                        const vt = i.variantes || {}
                        const talla = vt.talla || i.talla || '?'
                        const invItem = inventario.find(x => x.variante_id === i.variante_id && (sucursalId ? x.sucursal_id === sucursalId : true))
                        const stockMax = invItem ? invItem.cantidad : 999
                        return `
                          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"
                               data-item-id="${i.id}" data-item-idx="${i._idx}" data-stock="${stockMax}" data-precio="${i.precio_unitario}">
                            <span style="background:#f3e5f5;border-radius:100px;padding:3px 10px;font-size:0.8rem;font-weight:700;color:#6a1b9a;min-width:44px;text-align:center">T${talla}</span>
                            <button onclick="cambiarCantCorridaDOM(this.parentElement,-1)" style="background:#eee;border:none;border-radius:4px;width:24px;height:24px;cursor:pointer;font-size:0.9rem">−</button>
                            <span class="ccd-cant" style="font-weight:700;min-width:20px;text-align:center;font-size:0.9rem">${i.cantidad}</span>
                            <button onclick="cambiarCantCorridaDOM(this.parentElement,1)" style="background:#eee;border:none;border-radius:4px;width:24px;height:24px;cursor:pointer;font-size:0.9rem">+</button>
                            <span style="font-size:0.8rem;color:#888;flex:1">× $${i.precio_unitario}</span>
                            <strong class="ccd-sub" style="color:#6a1b9a;font-size:0.82rem">$${(i.cantidad*i.precio_unitario).toFixed(2)}</strong>
                            <button onclick="eliminarDeCarrito('${i.id}',${i._idx})" style="background:none;border:none;color:#c62828;cursor:pointer;font-size:1rem;padding:2px">🗑</button>
                          </div>`
                      }).join('')}
                    </div>
                    <button onclick="toggleCorridaDetalle('${ids.replace(/,/g,'_').substring(0,20)}')"
                      style="margin-top:8px;background:none;border:1px solid #d8b4fe;border-radius:6px;padding:4px 10px;font-size:0.75rem;color:#6a1b9a;cursor:pointer;width:100%">
                      ✏️ Editar tallas individualmente
                    </button>
                  </div>`
              }
            }).join('')
          })()}
        </div>

        ${items.length > 0 ? `
          <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid #eee;display:flex;justify-content:flex-end;align-items:center;gap:1rem">
            <div style="display:flex;align-items:center;gap:8px">
              <label style="font-size:0.85rem;color:#333">Forma de pago:</label>
              <select id="c-forma-pago" class="form-input" style="width:140px">
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="spei">SPEI</option>
                <option value="credito">Crédito</option>
              </select>
            </div>
            <button class="btn btn-primary" style="background:#2e7d32;border-color:#2e7d32;font-size:1rem;padding:10px 24px" onclick="confirmarVentaCarrito('${pedidoId}')">
              ✅ Confirmar venta — $<span id="carrito-total-btn">${total.toFixed(2)}</span>
            </button>
          </div>
        ` : ''}
      </div>
    </div>
  `
  window._carritoActivo.pedidoData = p
  window._carritoActivo.varianteSeleccionada = null
}

window.mostrarToastPanel = (msg) => {
  let t = document.getElementById('panel-toast')
  if (!t) {
    t = document.createElement('div')
    t.id = 'panel-toast'
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#333;color:white;padding:10px 20px;border-radius:8px;font-size:0.9rem;z-index:99999;transition:opacity 0.3s'
    document.body.appendChild(t)
  }
  t.textContent = msg
  t.style.opacity = '1'
  clearTimeout(t._timer)
  t._timer = setTimeout(() => { t.style.opacity = '0' }, 3000)
}

window.posicionarDropdownCarrito = (dropId, inputId) => {
  const input = document.getElementById(inputId)
  const drop = document.getElementById(dropId)
  if (!input || !drop) return
  const rect = input.getBoundingClientRect()
  drop.style.top = (rect.bottom + 4) + 'px'
  drop.style.left = rect.left + 'px'
  drop.style.width = Math.max(rect.width, 320) + 'px'
}

window.buscarProductoCarrito = (texto) => {
  const { variantes, productos } = window._carritoActivo
  const res = document.getElementById('c-prod-resultados')
  if (!res) return
  posicionarDropdownCarrito('c-prod-resultados', 'c-buscar-prod')
  if (!texto || texto.length < 2) { res.style.display = 'none'; return }
  const TALLAS_ORDEN = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Unica']
  const terminos = texto.toLowerCase().split(' ').filter(Boolean)
  const filtradas = variantes.filter(v => {
    const prod = productos.find(p => p.id === v.producto_id)
    const txt = ((prod?.nombre || '') + ' ' + (v.color || '') + ' ' + (v.talla || '') + ' ' + (prod?.sku_interno || '')).toLowerCase()
    return terminos.every(t => txt.includes(t))
  })

  if (!filtradas.length) {
    res.innerHTML = '<div style="padding:12px 14px;color:#888;font-size:0.85rem">Sin resultados</div>'
    res.style.display = 'block'
    return
  }

  // Agrupar por modelo + color → chips de talla tocables (toca = +1 par al carrito)
  const grupos = {}
  filtradas.forEach(v => {
    const prod = productos.find(p => p.id === v.producto_id)
    const key = v.producto_id + '|' + (v.color || '')
    if (!grupos[key]) grupos[key] = { nombre: prod?.nombre || '—', color: v.color || '', foto: prod?.imagen_principal, hex: v.color_hex, vars: [] }
    grupos[key].vars.push(v)
  })
  const arr = Object.values(grupos).slice(0, 6)

  res.style.display = 'block'
  res.innerHTML = arr.map(g => {
    const chips = g.vars
      .sort((a, b) => TALLAS_ORDEN.indexOf(a.talla) - TALLAS_ORDEN.indexOf(b.talla))
      .map(v => {
        const inv = window._carritoActivo.inventario.find(i => i.variante_id === v.id && i.sucursal_id === window._carritoActivo.sucursalId)
        const stock = inv ? inv.cantidad : 0
        const enCarrito = window._carritoActivo.items.filter(i => i.variante_id === v.id && !i.es_corrida).reduce((s, i) => s + i.cantidad, 0)
        return `
          <button onmousedown="event.preventDefault()" onclick="quickAddCarrito('${v.id}')" ${stock <= 0 ? 'disabled' : ''}
                  style="position:relative;min-width:50px;min-height:48px;padding:5px 9px;border:1.5px solid ${enCarrito > 0 ? '#E91E8C' : '#ddd'};border-radius:10px;background:${enCarrito > 0 ? '#fce4f3' : '#fff'};font-family:inherit;cursor:${stock <= 0 ? 'not-allowed' : 'pointer'};${stock <= 0 ? 'opacity:0.45' : ''};display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.1;touch-action:manipulation">
            <span style="font-size:0.92rem;font-weight:800;color:#333">T${v.talla}</span>
            <span style="font-size:0.6rem;font-weight:600;color:${stock > 0 ? '#2e7d32' : '#c62828'}">${stock > 0 ? 'stock ' + stock : 'agotado'}</span>
            ${enCarrito > 0 ? `<span style="position:absolute;top:-7px;right:-7px;background:#E91E8C;color:#fff;border-radius:100px;min-width:19px;height:19px;font-size:0.65rem;display:flex;align-items:center;justify-content:center;font-weight:800;padding:0 4px">${enCarrito}</span>` : ''}
          </button>`
      }).join('')
    return `
      <div style="padding:11px 12px;border-bottom:1px solid #f0f0f0">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:9px">
          ${g.foto ? `<img src="${g.foto}" style="width:36px;height:36px;object-fit:cover;border-radius:7px;flex-shrink:0">` : `<div style="width:36px;height:36px;background:#f3f3f3;border-radius:7px;flex-shrink:0;display:flex;align-items:center;justify-content:center">👠</div>`}
          ${g.hex ? `<span style="width:13px;height:13px;border-radius:50%;background:${g.hex};border:1px solid #ddd;flex-shrink:0"></span>` : ''}
          <span style="font-size:0.86rem;font-weight:600;line-height:1.2">${g.nombre}</span>
          <span style="font-size:0.78rem;color:#888">· ${g.color}</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:7px">${chips}</div>
      </div>`
  }).join('')
}

// Toca una talla en el buscador = agregar 1 par al carrito del cliente (refresca y deja el buscador abierto)
window.quickAddCarrito = async (varianteId) => {
  const ca = window._carritoActivo
  if (!ca) return
  const v = ca.variantes.find(x => x.id === varianteId)
  const prod = v ? ca.productos.find(p => p.id === v.producto_id) : null
  const precio = parseFloat(prod?.precio_mayoreo6 || prod?.precio_mayoreo3 || prod?.precio_menudeo) || 0
  const existente = ca.items.find(i => i.variante_id === varianteId && !i.es_corrida)
  const queryActual = document.getElementById('c-buscar-prod') ? document.getElementById('c-buscar-prod').value : ''
  try {
    if (existente) {
      await fetch(API + '/pedidos/' + ca.pedidoId + '/items/' + existente.id, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad: existente.cantidad + 1, precio_unitario: existente.precio_unitario })
      })
    } else {
      await fetch(API + '/pedidos/' + ca.pedidoId + '/items', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variante_id: varianteId, cantidad: 1, precio_unitario: precio, subtotal: precio, nombre: prod?.nombre || '', color: v?.color || '', talla: v?.talla || '' })
      })
    }
    const its = await fetch(API + '/pedidos/' + ca.pedidoId + '/items').then(r => r.json())
    ca.items = Array.isArray(its) ? its : []
    ca._tier = null
    await recalcularPreciosCarrito()
    renderCarritoAbierto(ca.pedidoData)
    const pares = ca.items.reduce((s, i) => s + i.cantidad, 0)
    mostrarToastPanel('✓ ' + (prod?.nombre || '') + ' T' + (v?.talla || '') + ' · ' + pares + ' pares')
    // Reabrir el buscador con la misma búsqueda para seguir agregando tallas (outlast del timer de blur)
    if (queryActual) setTimeout(() => {
      const inp = document.getElementById('c-buscar-prod')
      if (inp) { inp.value = queryActual; buscarProductoCarrito(queryActual) }
    }, 300)
  } catch(e) { alert('Error: ' + e.message) }
}

window.seleccionarVarianteCarrito = (varianteId) => {
  const { variantes, productos } = window._carritoActivo
  const v = variantes.find(x => x.id === varianteId)
  const prod = productos.find(x => x.id === v?.producto_id)
  window._carritoActivo.varianteSeleccionada = varianteId
  document.getElementById('c-buscar-prod').value = `${prod?.nombre || ''} · ${v?.color || ''} T${v?.talla || ''}`
  document.getElementById('c-prod-resultados').style.display = 'none'
  // Auto-llenar precio mayoreo6 por default
  const precioSugerido = prod?.precio_mayoreo6 || prod?.precio_mayoreo3 || prod?.precio_menudeo || ''
  document.getElementById('c-precio').value = precioSugerido
  const sel = document.getElementById('c-prod-seleccionado')
  sel.style.display = 'block'
  sel.textContent = `✓ Seleccionado: ${prod?.nombre} — ${v?.color} T${v?.talla}`
}

window.agregarAlCarritoActivo = async () => {
  const varianteId = window._carritoActivo?.varianteSeleccionada
  const cantidad = parseInt(document.getElementById('c-cantidad').value) || 1
  const precio = parseFloat(document.getElementById('c-precio').value) || 0
  if (!varianteId) { alert('Selecciona un producto primero'); return }
  if (!precio) { alert('Ingresa el precio por par'); return }

  const { variantes, productos } = window._carritoActivo
  const v = variantes.find(x => x.id === varianteId)
  const prod = productos.find(x => x.id === v?.producto_id)

  try {
    const res = await fetch(API + '/pedidos/' + window._carritoActivo.pedidoId + '/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        variante_id: varianteId,
        cantidad,
        precio_unitario: precio,
        subtotal: cantidad * precio,
        nombre: prod?.nombre || '',
        color: v?.color || '',
        talla: v?.talla || ''
      })
    })
    if (!res.ok) { alert('Error agregando producto'); return }

    // Recargar items y recalcular precios por tier
    const resItemsActualizados = await fetch(API + '/pedidos/' + window._carritoActivo.pedidoId + '/items').then(r => r.json())
    window._carritoActivo.items = Array.isArray(resItemsActualizados) ? resItemsActualizados : []
    window._carritoActivo._tier = null  // forzar recálculo
    await recalcularPreciosCarrito()

    // Limpiar y recargar
    document.getElementById('c-buscar-prod').value = ''
    document.getElementById('c-cantidad').value = '1'
    document.getElementById('c-precio').value = ''
    document.getElementById('c-prod-seleccionado').style.display = 'none'
    window._carritoActivo.varianteSeleccionada = null
    await abrirCarrito(window._carritoActivo.pedidoId)
  } catch(e) {
    alert('Error: ' + e.message)
  }
}

window.cambiarCantidadCarrito = async (idx, delta) => {
  const item = window._carritoActivo.items[idx]
  if (!item) return
  const nuevaCantidad = Math.max(1, item.cantidad + delta)
  window._carritoActivo.items[idx].cantidad = nuevaCantidad
  try {
    await fetch(API + '/pedidos/' + window._carritoActivo.pedidoId + '/items/' + item.id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cantidad: nuevaCantidad, precio_unitario: item.precio_unitario })
    })
    await recalcularPreciosCarrito()
    await abrirCarrito(window._carritoActivo.pedidoId)
  } catch(e) { alert('Error: ' + e.message) }
}

window.recalcularPreciosCarrito = async () => {
  const { pedidoId, items, variantes, productos } = window._carritoActivo
  const totalPares = items.reduce((s, i) => s + i.cantidad, 0)

  // Determinar tier
  const tier = totalPares >= 6 ? 'mayoreo6' : totalPares >= 3 ? 'mayoreo3' : 'menudeo'
  const tierAnterior = window._carritoActivo._tier || 'menudeo'
  if (tier === tierAnterior) return  // no cambió, nada que hacer

  window._carritoActivo._tier = tier

  const tierLabel = tier === 'mayoreo6' ? 'Mayoreo 6+ pares' : tier === 'mayoreo3' ? 'Mayoreo 3-5 pares' : 'Menudeo'

  // Actualizar precio de cada ítem con el precio del tier correspondiente
  let algoActualizado = false
  for (const item of items) {
    if (item._precio_manual) continue  // no tocar precios que el usuario modificó a mano
    const v = variantes.find(x => x.id === item.variante_id)
    const prod = v ? productos.find(p => p.id === v.producto_id) : null
    if (!prod) continue

    const base = parseFloat(prod.precio_menudeo) || 0
    let nuevoPrecio
    if (tier === 'mayoreo6') {
      nuevoPrecio = parseFloat(prod.precio_mayoreo6) || (base > 0 ? Math.round(base - 70) : base)
    } else if (tier === 'mayoreo3') {
      nuevoPrecio = parseFloat(prod.precio_mayoreo3) || (base > 0 ? Math.round(base - 30) : base)
    } else {
      nuevoPrecio = base
    }

    if (nuevoPrecio && nuevoPrecio !== item.precio_unitario) {
      item.precio_unitario = nuevoPrecio
      await fetch(API + '/pedidos/' + pedidoId + '/items/' + item.id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad: item.cantidad, precio_unitario: nuevoPrecio })
      })
      algoActualizado = true
    }
  }

  // Actualizar total
  const nuevoTotal = items.reduce((s, i) => s + (i.cantidad * i.precio_unitario), 0)
  await fetch(API + '/pedidos/' + pedidoId, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ total: nuevoTotal })
  })

  if (algoActualizado) {
    mostrarToastPanel(`📦 Precios actualizados a ${tierLabel}`)
  }
}

window.actualizarPrecioCarrito = async (idx, nuevoPrecio) => {
  const item = window._carritoActivo.items[idx]
  const precio = parseFloat(nuevoPrecio) || 0
  if (!precio || !item) return
  item._precio_manual = true  // no sobreescribir con tier automático
  try {
    await fetch(API + '/pedidos/' + window._carritoActivo.pedidoId + '/items/' + item.id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cantidad: item.cantidad, precio_unitario: precio })
    })
    const nuevoTotal = window._carritoActivo.items.map((i, ix) => (ix === idx ? precio : i.precio_unitario) * i.cantidad).reduce((a, b) => a + b, 0)
    await fetch(API + '/pedidos/' + window._carritoActivo.pedidoId, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ total: nuevoTotal })
    })
    await abrirCarrito(window._carritoActivo.pedidoId)
  } catch(e) { alert('Error: ' + e.message) }
}

window.eliminarDeCarrito = async (itemId, idx) => {
  if (!itemId || itemId === 'undefined') {
    alert('Error: el ítem no tiene ID válido')
    return
  }
  try {
    const res = await fetch(API + '/pedidos/' + window._carritoActivo.pedidoId + '/items/' + itemId, { method: 'DELETE' })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      alert('Error eliminando: ' + (err.error || res.status))
      return
    }
    const nuevoTotal = window._carritoActivo.items
      .filter((_, i) => i !== idx)
      .reduce((s, i) => s + (i.cantidad * i.precio_unitario), 0)
    await fetch(API + '/pedidos/' + window._carritoActivo.pedidoId, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ total: nuevoTotal })
    })
    await abrirCarrito(window._carritoActivo.pedidoId)
  } catch(e) { alert('Error: ' + e.message) }
}

window.cambiarCantCorridaDOM = async (row, delta) => {
  const itemId  = row.dataset.itemId
  const idx     = parseInt(row.dataset.itemIdx)
  const stockMax = parseInt(row.dataset.stock) || 999
  const precio  = parseFloat(row.dataset.precio) || 0
  const cantSpan = row.querySelector('.ccd-cant')
  const subSpan  = row.querySelector('.ccd-sub')
  if (!itemId || !cantSpan) return

  const cantActual = parseInt(cantSpan.textContent) || 1
  const nuevaCantidad = Math.max(1, cantActual + delta)

  if (delta > 0 && nuevaCantidad > stockMax) {
    mostrarToastPanel(`⚠️ Solo hay ${stockMax} pares en stock`)
    return
  }

  try {
    await fetch(API + '/pedidos/' + window._carritoActivo.pedidoId + '/items/' + itemId, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cantidad: nuevaCantidad, precio_unitario: precio })
    })
    // Actualizar DOM inmediatamente
    cantSpan.textContent = nuevaCantidad
    if (subSpan) subSpan.textContent = '$' + (nuevaCantidad * precio).toFixed(2)
    // Actualizar item en memoria
    if (window._carritoActivo.items[idx]) window._carritoActivo.items[idx].cantidad = nuevaCantidad
    // Actualizar header del grupo (pares + total)
    const detalle = row.closest('[id^="corrida-detalle-"]')
    if (detalle) {
      const allRows = detalle.querySelectorAll('[data-item-id]')
      let totalP = 0, totalS = 0
      allRows.forEach(r => {
        const c = parseInt(r.querySelector('.ccd-cant')?.textContent || 0)
        const p = parseFloat(r.dataset.precio || 0)
        totalP += c; totalS += c * p
      })
      const headerId = detalle.id.replace('corrida-detalle-', 'corrida-header-')
      const hEl = document.getElementById(headerId)
      if (hEl) hEl.innerHTML = `${totalP} pares · <strong style="color:#6a1b9a">$${totalS.toFixed(2)}</strong>`
      // Actualizar también el total grande a la derecha
      const contenedorCorrida = detalle.parentElement
      if (contenedorCorrida) {
        const strongs = contenedorCorrida.querySelectorAll('strong[style*="6a1b9a"]')
        strongs.forEach(s => { if (!s.closest('[id^="corrida-header"]')) s.textContent = '$' + totalS.toFixed(2) })
      }
    }
    // Actualizar total del pedido en pantalla y en servidor
    const nuevoTotal = window._carritoActivo.items.reduce((s, i) => s + (i.cantidad * i.precio_unitario), 0)
    const totalPares = window._carritoActivo.items.reduce((s, i) => s + i.cantidad, 0)
    const elMonto = document.getElementById('carrito-total-monto')
    const elPares = document.getElementById('carrito-total-pares')
    const elBtn   = document.getElementById('carrito-total-btn')
    if (elMonto) elMonto.textContent = nuevoTotal.toFixed(2)
    if (elPares) elPares.textContent = totalPares
    if (elBtn)   elBtn.textContent   = nuevoTotal.toFixed(2)
    fetch(API + '/pedidos/' + window._carritoActivo.pedidoId, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ total: nuevoTotal })
    })
  } catch(e) { alert('Error: ' + e.message) }
}

window.toggleCorridaDetalle = (key) => {
  const el = document.getElementById('corrida-detalle-' + key)
  if (!el) return
  const visible = el.style.display !== 'none'
  el.style.display = visible ? 'none' : 'block'
  const btn = el.nextElementSibling
  if (btn) btn.textContent = visible ? '✏️ Editar tallas individualmente' : '▲ Cerrar edición'
}

window.eliminarCorridaCarrito = async (idsStr) => {
  const ids = idsStr.split(',').filter(Boolean)
  try {
    for (const id of ids) {
      await fetch(API + '/pedidos/' + window._carritoActivo.pedidoId + '/items/' + id, { method: 'DELETE' })
    }
    const nuevoTotal = window._carritoActivo.items
      .filter(i => !ids.includes(i.id))
      .reduce((s, i) => s + (i.cantidad * i.precio_unitario), 0)
    await fetch(API + '/pedidos/' + window._carritoActivo.pedidoId, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ total: nuevoTotal })
    })
    await abrirCarrito(window._carritoActivo.pedidoId)
  } catch(e) { alert('Error: ' + e.message) }
}

window.actualizarPrecioCorridaCarrito = async (idsStr, nuevoPrecio) => {
  const ids = idsStr.split(',').filter(Boolean)
  const precio = parseFloat(nuevoPrecio) || 0
  if (!precio) return
  try {
    for (const id of ids) {
      const item = window._carritoActivo.items.find(i => i.id === id)
      if (!item) continue
      item._precio_manual = true
      item.precio_unitario = precio
      await fetch(API + '/pedidos/' + window._carritoActivo.pedidoId + '/items/' + id, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad: item.cantidad, precio_unitario: precio })
      })
    }
    const nuevoTotal = window._carritoActivo.items.reduce((s, i) => s + (i.cantidad * i.precio_unitario), 0)
    await fetch(API + '/pedidos/' + window._carritoActivo.pedidoId, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ total: nuevoTotal })
    })
    await abrirCarrito(window._carritoActivo.pedidoId)
  } catch(e) { alert('Error: ' + e.message) }
}

window.confirmarVentaCarrito = async (pedidoId) => {
  const formaPagoEl = document.getElementById('c-forma-pago')
  const formaPago = formaPagoEl ? formaPagoEl.value : 'efectivo'
  if (!confirm(`¿Confirmar la venta? Se descontará el stock del inventario.`)) return
  try {
    const res = await fetch(API + '/pedidos/' + pedidoId + '/confirmar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ forma_pago: formaPago })
    })
    const data = await res.json()
    if (data.ok) {
      alert('✅ Venta confirmada. Stock descontado.')
      cargarCarritos()
    } else {
      alert('Error: ' + JSON.stringify(data))
    }
  } catch(e) { alert('Error: ' + e.message) }
}

window.carritoModo = (modo) => {
  document.getElementById('c-panel-par').style.display = modo === 'par' ? 'block' : 'none'
  document.getElementById('c-panel-corrida').style.display = modo === 'corrida' ? 'block' : 'none'
  document.getElementById('c-modo-par').style.background = modo === 'par' ? '#E91E8C' : 'white'
  document.getElementById('c-modo-par').style.color = modo === 'par' ? 'white' : '#888'
  document.getElementById('c-modo-corrida').style.background = modo === 'corrida' ? '#6a1b9a' : 'white'
  document.getElementById('c-modo-corrida').style.color = modo === 'corrida' ? 'white' : '#888'
}

window.buscarModeloCarrito = (texto) => {
  const { variantes, productos } = window._carritoActivo
  const res = document.getElementById('c-corrida-resultados')
  const tallasPanel = document.getElementById('c-corrida-tallas')
  posicionarDropdownCarrito('c-corrida-resultados', 'c-buscar-corrida')
  if (!texto || texto.length < 2) { res.style.display = 'none'; tallasPanel.style.display = 'none'; return }

  // Agrupar por producto+color (no por talla)
  const grupos = {}
  variantes.forEach(v => {
    const prod = productos.find(p => p.id === v.producto_id)
    if (!prod) return
    const txt = ((prod.nombre || '') + ' ' + (v.color || '') + ' ' + (prod.sku_interno || '')).toLowerCase()
    if (!texto.toLowerCase().split(' ').every(t => txt.includes(t))) return
    const key = prod.id + '|' + (v.color || '')
    if (!grupos[key]) grupos[key] = { prod, color: v.color || '', variantes: [] }
    grupos[key].variantes.push(v)
  })

  const entradas = Object.values(grupos).slice(0, 6)
  if (!entradas.length) { res.style.display = 'none'; return }
  res.style.display = 'block'
  res.innerHTML = entradas.map(g => `
    <div onclick="seleccionarModeloCorrida('${g.prod.id}','${g.color.replace(/'/g,"\\'")}')"
         style="display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:pointer;border-bottom:1px solid #f0f0f0"
         onmouseenter="this.style.background='#f9f9f9'" onmouseleave="this.style.background=''">
      ${g.prod.imagen_principal ? `<img src="${g.prod.imagen_principal}" style="width:36px;height:36px;object-fit:cover;border-radius:6px">` : '<div style="width:36px;height:36px;background:#eee;border-radius:6px"></div>'}
      <div>
        <p style="font-size:0.85rem;font-weight:600;margin:0">${g.prod.nombre} · ${g.color}</p>
        <p style="font-size:0.72rem;color:#888;margin:0">${g.variantes.length} tallas disponibles</p>
      </div>
    </div>
  `).join('')
}

window.seleccionarModeloCorrida = (productoId, color) => {
  const { variantes, productos, inventario, sucursalId } = window._carritoActivo
  const prod = productos.find(p => p.id === productoId)
  document.getElementById('c-buscar-corrida').value = `${prod?.nombre || ''} · ${color}`
  document.getElementById('c-corrida-resultados').style.display = 'none'

  const TALLAS_ORDEN = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Unica']
  const varsColor = variantes
    .filter(v => v.producto_id === productoId && v.color === color)
    .sort((a, b) => TALLAS_ORDEN.indexOf(a.talla) - TALLAS_ORDEN.indexOf(b.talla))

  // Auto-precio: precio_corrida → mayoreo6 → (menudeo-70 automático)
  const base = parseFloat(prod?.precio_menudeo) || 0
  const precioCorrida = parseFloat(prod?.precio_corrida) || (base > 0 ? Math.round(base - 100) : 0)
  document.getElementById('c-precio-corrida').value = precioCorrida || ''

  // Guardar selección con precio incluido
  window._corridaSeleccionada = { productoId, color, variantes: varsColor, prod, precioCorrida }

  const grid = document.getElementById('c-corrida-tallas-grid')
  grid.innerHTML = varsColor.map(v => {
    // Buscar stock: intentar con sucursalId, si no hay datos mostrar sin deshabilitar
    const inv = inventario.find(i => i.variante_id === v.id && (sucursalId ? i.sucursal_id === sucursalId : true))
    const stock = inv ? inv.cantidad : null
    const agotada = stock !== null && stock === 0
    const qty = agotada ? 0 : 1
    const cardId = `c-card-${v.id}`
    const inputId = `c-qty-${v.id}`
    const activeBg = qty > 0 ? '#fdf2f8' : '#ffffff'
    const activeBorder = qty > 0 ? '#E91E8C' : '#e2e8f0'
    
    return `
      <div id="${cardId}" class="size-card" style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px 12px;border:2px solid ${agotada ? '#fecaca' : activeBorder};border-radius:12px;background:${agotada ? '#fef2f2' : activeBg};min-width:70px;transition:all 0.2s ease;position:relative;opacity:${agotada ? 0.6 : 1}">
        <span style="font-weight:800;font-size:0.9rem;color:#0f172a">T${v.talla}</span>
        <div style="display:flex;align-items:center;gap:4px">
          <button type="button" onclick="const inp=document.getElementById('${inputId}');inp.value=Math.max(0,parseInt(inp.value||0)-1);inp.dispatchEvent(new Event('input'))"
            style="background:#f1f5f9;color:#475569;border:none;border-radius:6px;width:24px;height:24px;cursor:pointer;font-size:1rem;font-weight:700;display:flex;align-items:center;justify-content:center;transition:background 0.2s"
            onmouseenter="this.style.background='#e2e8f0'" onmouseleave="this.style.background='#f1f5f9'" ${agotada ? 'disabled' : ''}>−</button>
          
          <input type="number" value="${qty}" min="0" max="${stock !== null ? stock : 999}" id="${inputId}" data-variante="${v.id}"
            style="width:36px;height:24px;text-align:center;border:1px solid #cbd5e1;border-radius:6px;font-size:0.85rem;font-weight:700;color:#0f172a;outline:none"
            oninput="const val=Math.min(parseInt(this.max)||999,Math.max(0,parseInt(this.value)||0));this.value=val;const card=document.getElementById('${cardId}');if(val>0){card.style.borderColor='#E91E8C';card.style.background='#fdf2f8'}else{card.style.borderColor='#e2e8f0';card.style.background='#ffffff'}"
            ${agotada ? 'disabled' : ''}>
          
          <button type="button" onclick="const inp=document.getElementById('${inputId}');const max=parseInt(inp.max||999);const cur=parseInt(inp.value||0);if(cur<max){inp.value=cur+1;inp.dispatchEvent(new Event('input'))}else{inp.style.borderColor='#ef4444';setTimeout(()=>inp.style.borderColor='#cbd5e1',800)}"
            style="background:#f1f5f9;color:#475569;border:none;border-radius:6px;width:24px;height:24px;cursor:pointer;font-size:1rem;font-weight:700;display:flex;align-items:center;justify-content:center;transition:background 0.2s"
            onmouseenter="this.style.background='#e2e8f0'" onmouseleave="this.style.background='#f1f5f9'" ${agotada ? 'disabled' : ''}>+</button>
        </div>
        <span style="font-size:0.65rem;font-weight:600;color:${stock === null ? '#94a3b8' : stock > 0 ? '#10b981' : '#ef4444'}">
          ${stock === null ? 'Stock: ?' : stock > 0 ? `${stock} disp.` : 'Agotado'}
        </span>
      </div>
    `
  }).join('')

  document.getElementById('c-corrida-tallas').style.display = 'block'
}

window.agregarCorridaAlCarritoActivo = async () => {
  const { productoId, color, variantes: varsColor, prod } = window._corridaSeleccionada || {}
  if (!prod) { alert('Selecciona un modelo primero'); return }
  const precio = parseFloat(document.getElementById('c-precio-corrida').value) || window._corridaSeleccionada?.precioCorrida || 0
  if (!precio) { alert('No se encontró precio para este producto. Ingrésalo manualmente.'); return }

  const inputs = document.querySelectorAll('#c-corrida-tallas-grid input[type=number][data-variante]')
  const seleccionados = Array.from(inputs).filter(inp => parseInt(inp.value) > 0)
  if (seleccionados.length === 0) { alert('Ingresa al menos 1 par en alguna talla'); return }

  const pedidoId = window._carritoActivo.pedidoId
  let totalAgregado = 0

  for (const inp of seleccionados) {
    const varianteId = inp.dataset.variante
    const cantidad = parseInt(inp.value) || 1
    const v = varsColor.find(x => x.id === varianteId)
    await fetch(API + '/pedidos/' + pedidoId + '/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        variante_id: varianteId,
        cantidad,
        precio_unitario: precio,
        subtotal: cantidad * precio,
        nombre: prod.nombre,
        color: color,
        talla: v?.talla || '',
        es_corrida: true
      })
    })
    totalAgregado += cantidad * precio
  }

  // Actualizar total
  const totalActual = window._carritoActivo.items.reduce((s, i) => s + (i.cantidad * i.precio_unitario), 0)
  await fetch(API + '/pedidos/' + pedidoId, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ total: totalActual + totalAgregado })
  })

  await abrirCarrito(pedidoId)
}

window.liberarCarrito = async (pedidoId) => {
  if (!confirm('¿Liberar este carrito? Los productos quedan disponibles para otros clientes.')) return
  try {
    const res = await fetch(API + '/pedidos/' + pedidoId + '/cancelar', { method: 'POST' })
    const data = await res.json()
    if (data.ok) {
      alert('Carrito liberado.')
      cargarCarritos()
    }
  } catch(e) { alert('Error: ' + e.message) }
}


// ── Generar nombres de productos ──────────────────────────────────────────
async function cargarGenerarNombres() {
  const content = document.getElementById('content')
  content.innerHTML = `
    <div style="padding:1.5rem;max-width:860px">
      <h2 style="margin:0 0 4px;font-size:1.05rem">✏️ Generar nombres de productos</h2>
      <p style="margin:0 0 1.2rem;font-size:0.82rem;color:#64748b">
        Construye nombres descriptivos automáticamente usando SKU + categoría + palabras clave de la descripción + altura del tacón.
        Primero revisa el preview y luego aplica los cambios.
      </p>

      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:1rem;align-items:center">
        <label style="display:flex;align-items:center;gap:6px;font-size:0.82rem;color:#475569;cursor:pointer">
          <input type="checkbox" id="gn-solo-cortos"> Solo productos sin nombre descriptivo
        </label>
        <button onclick="gnPreview()" style="padding:8px 18px;background:#3483fa;color:#fff;border:none;border-radius:8px;font-size:0.83rem;font-weight:600;cursor:pointer">
          👁 Ver preview
        </button>
        <button id="gn-btn-aplicar" onclick="gnAplicar()" style="padding:8px 18px;background:#10b981;color:#fff;border:none;border-radius:8px;font-size:0.83rem;font-weight:600;cursor:pointer;display:none">
          ✅ Aplicar todos los cambios
        </button>
        <span id="gn-status" style="font-size:0.8rem;color:#64748b"></span>
      </div>

      <div id="gn-tabla" style="display:none">
        <div style="display:grid;grid-template-columns:200px 1fr 80px;gap:4px;font-size:0.72rem;font-weight:700;color:#94a3b8;padding:4px 8px;text-transform:uppercase">
          <span>Nombre actual</span><span>Nombre nuevo (editable)</span><span></span>
        </div>
        <div id="gn-rows"></div>
      </div>
    </div>`

  window.gnPreview = async () => {
    const soloCortos = document.getElementById('gn-solo-cortos')?.checked || false
    document.getElementById('gn-status').textContent = 'Cargando...'
    try {
      const r = await fetch(API + '/productos/generar-nombres', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modo: 'preview', solo_sin_descripcion: soloCortos })
      })
      const data = await r.json()
      if (!data.ok) { alert('Error: ' + data.error); return }
      window._gnProductos = data.productos
      document.getElementById('gn-tabla').style.display = 'block'
      document.getElementById('gn-btn-aplicar').style.display = 'inline-block'
      document.getElementById('gn-status').textContent = `${data.total} productos`
      document.getElementById('gn-rows').innerHTML = data.productos.map((p, i) => `
        <div style="display:grid;grid-template-columns:200px 1fr 80px;gap:6px;padding:5px 8px;border-bottom:1px solid #f1f5f9;align-items:center">
          <span style="color:#64748b;font-size:0.78rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${p.nombre_orig}">${p.nombre_orig}</span>
          <input
            class="gn-input"
            data-idx="${i}"
            value="${p.nombre_nuevo.replace(/"/g,'&quot;')}"
            style="border:1px solid #e2e8f0;border-radius:6px;padding:5px 8px;font-size:0.81rem;width:100%;outline:none;color:#0f172a"
            oninput="window._gnProductos[${i}].nombre_nuevo=this.value"
            onfocus="this.style.borderColor='#E91E8C'"
            onblur="this.style.borderColor='#e2e8f0'">
          <button onclick="window.gnGuardarUno(${i})" style="padding:4px 10px;border:none;background:#10b981;color:#fff;border-radius:6px;font-size:0.75rem;font-weight:600;cursor:pointer;white-space:nowrap">
            Guardar
          </button>
        </div>`).join('')
    } catch(e) { alert('Error: ' + e.message) }
  }

  window.gnGuardarUno = async (idx) => {
    const p = window._gnProductos?.[idx]
    if (!p) return
    const btn = document.querySelectorAll('.gn-input')[idx]?.nextElementSibling
    if (btn) { btn.textContent = '...'; btn.disabled = true }
    try {
      await fetch(`${API}/productos/${p.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: p.nombre_nuevo })
      })
      if (btn) { btn.textContent = '✓'; btn.style.background = '#94a3b8'; btn.disabled = true }
    } catch(e) {
      if (btn) { btn.textContent = 'Guardar'; btn.disabled = false }
      alert('Error: ' + e.message)
    }
  }

  window.gnAplicar = async () => {
    if (!confirm(`¿Aplicar los ${window._gnProductos?.length || 0} nombres del preview? Los que ya guardaste individualmente no se sobreescriben.`)) return
    document.getElementById('gn-status').textContent = 'Aplicando...'
    document.getElementById('gn-btn-aplicar').disabled = true
    let ok = 0, err = 0
    for (const p of (window._gnProductos || [])) {
      try {
        await fetch(`${API}/productos/${p.id}`, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre: p.nombre_nuevo })
        })
        ok++
      } catch(e) { err++ }
    }
    document.getElementById('gn-status').textContent = `✅ ${ok} actualizados${err ? ' · ⚠ ' + err + ' errores' : ''}`
    document.getElementById('gn-btn-aplicar').disabled = false
    // Marcar todos los botones como guardados
    document.querySelectorAll('.gn-input + button').forEach(b => { b.textContent = '✓'; b.style.background = '#94a3b8'; b.disabled = true })
  }
}
