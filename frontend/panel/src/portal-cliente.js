// ─────────────────────────────────────────────────────────────
//  Portal de cliente mayoreo — integrado en el panel
//  Se carga cuando el login detecta un cliente (tipo = zapateria)
// ─────────────────────────────────────────────────────────────

const PC_API        = '/api'
const PC_SESION_KEY = 'pc_sesion'
const PC_CARRITO_KEY = 'pc_carrito'
// Snapshot del carrito tal como quedó la ÚLTIMA VEZ que se confirmó sincronizado
// con éxito contra el servidor -- ver pcRestaurarCarritoDeServidor() y
// pcRefrescarCarritoSiCambio() para por qué existe (evita que un borrado
// reaparezca si se recarga/refresca antes de que el servidor se entere).
const PC_CARRITO_SYNCED_KEY = 'pc_carrito_synced'
// Marca el pedido-borrador que respalda el carrito activo en el servidor, para
// distinguirlo de un pedido real sin importar su status (incluso ya cancelado).
const PC_BORRADOR_MARCA = '[carrito-respaldo]'
const TALLAS_ORDEN  = ['22','22.5','23','23.5','24','24.5','25','25.5','26','26.5','27','Unica']

window._pcModoCompartir = false
window._pcCompartirSeleccion = []

// "Nuevo" se calcula por fecha real de alta (últimos 30 días), no por la
// bandera manual `nuevo` -- no se apagaba sola con el tiempo ni se llenaba
// en todas las vías de alta de producto (ej. import masivo), así que
// modelos genuinamente recientes no aparecían y otros de meses atrás se
// quedaban marcados para siempre. `created_at` sí lo pone siempre la BD.
const esNuevo = (p) => p && p.created_at && (Date.now() - new Date(p.created_at).getTime()) < 30*24*60*60*1000

const money = (n) => '$' + Math.round(parseFloat(n) || 0).toLocaleString('es-MX')
const esc   = (s) => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')
// Calcula precio mayoreo con fallback a precio_menudeo - descuento
const precioM3 = (p) => parseFloat(p.precio_mayoreo3) || Math.max(0, parseFloat(p.precio_menudeo || 0) - 30)
const precioM6 = (p) => parseFloat(p.precio_mayoreo6) || Math.max(0, parseFloat(p.precio_menudeo || 0) - 70)
const precioCorrida = (p) => parseFloat(p.precio_corrida) || Math.max(0, parseFloat(p.precio_menudeo || 0) - 100)

// ── Estado global ────────────────────────────────────────────
const pc = {
  sesion:   null,
  tab:      localStorage.getItem('pc_active_tab_admin') || 'inicio',
  productos: [],
  variantes: [],
  inventario: [],
  carrito:  [],
  pedidos:  [],
  referido: null,
  clienteData: null,
  filtroCat: '',
  filtroNuevos: false,
  busqueda: '',
  filtroTallas: [],
  filtroColores: [],
  filtrosExpandido: false,
  datosCargados: false,
  masVendidos: [],
  modelosSugeridos: [],
  _borradorServerId: null, // id del pedido status=borrador que respalda el carrito activo en el servidor
}

function pcAuthHeaders() {
  const token = localStorage.getItem('erp_token')
  return token
    ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    : { 'Content-Type': 'application/json' }
}

// Limpia la sesión inválida/vencida y manda al login -- mismo tratamiento que
// el interceptor global da a un 401, pero disparado aquí para los 403 de
// cliente_autorizado() que ese interceptor no detecta (solo mira 401).
let _pcRelogEnCurso = false
function pcForzarRelogin() {
  if (_pcRelogEnCurso) return
  _pcRelogEnCurso = true
  try {
    localStorage.removeItem('erp_token')
    localStorage.removeItem('pc_sesion')
  } catch (e) {}
  alert('Tu sesión expiró. Inicia sesión de nuevo.')
  location.reload()
}

// ── Tema claro/oscuro ────────────────────────────────────────
// Las variables --pc-* del bloque <style> cambian con el atributo
// data-pc-theme del <html>; aquí solo se alterna ese atributo.
function pcAplicarTema(tema) {
  document.documentElement.setAttribute('data-pc-theme', tema === 'dark' ? 'dark' : 'light')
}
function pcIconoTema(tema) {
  // Muestra el icono del tema al que se CAMBIARÁ (sol si estás en oscuro, luna si estás en claro).
  return tema === 'dark' ? '☀️' : '🌙'
}
window.pcToggleTema = () => {
  const actual = document.documentElement.getAttribute('data-pc-theme') === 'dark' ? 'dark' : 'light'
  const nuevo = actual === 'light' ? 'dark' : 'light'
  pcAplicarTema(nuevo)
  try { localStorage.setItem('pc_tema', nuevo) } catch {}
  document.querySelectorAll('[data-pc-tema-icono]').forEach(el => { el.textContent = pcIconoTema(nuevo) })
}

// ── Entry point ──────────────────────────────────────────────
export function renderPortalCliente(sesionData) {
  pc.sesion = sesionData
  _pcInitAnalytics()
  // Tema: claro por defecto; recuerda la última elección del cliente.
  try { pcAplicarTema(localStorage.getItem('pc_tema') === 'dark' ? 'dark' : 'light') } catch {}
  try { pc.carrito = JSON.parse(localStorage.getItem(PC_CARRITO_KEY) || '[]') } catch { pc.carrito = [] }
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

// Antes no había ninguna forma de medir cuánta gente entra al portal
// mayorista -- GA4 solo estaba instalado en la tienda pública. Se activa
// aquí (no en el HTML) para que el uso del panel de administración (mismo
// bundle) nunca se mezcle con las métricas de las clientas.
let _pcAnalyticsInit = false
function _pcInitAnalytics() {
  if (_pcAnalyticsInit || typeof gtag !== 'function') return
  _pcAnalyticsInit = true
  try {
    gtag('js', new Date())
    gtag('config', 'G-QX8MK3D4RY', {
      page_title: 'Portal mayorista',
      page_path: '/portal-mayoreo',
    })
  } catch (e) { /* si falla GA4 no debe tumbar el portal */ }
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
    el.style.cssText = 'position:fixed;bottom:16px;left:16px;right:16px;max-width:380px;margin:0 auto;background:var(--pc-card);border:1px solid var(--pc-border-2);color:var(--pc-text);border-radius:14px;padding:14px 16px;box-shadow:0 8px 24px rgba(0,0,0,0.4);z-index:9999;display:flex;align-items:center;gap:12px'
    el.innerHTML = `
      <span style="font-size:1.6rem;flex-shrink:0">🔔</span>
      <div style="flex:1;min-width:0">
        <p style="margin:0 0 2px;font-size:0.85rem;font-weight:700">Activa avisos</p>
        <p style="margin:0;font-size:0.78rem;color:var(--pc-text-4)">Te avisamos de tu pedido y promociones.</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0">
        <button id="pc-push-si" style="background:#E91E8C;color:#fff;border:none;border-radius:8px;padding:6px 12px;font-size:0.78rem;font-weight:700;cursor:pointer">Activar</button>
        <button id="pc-push-no" style="background:transparent;color:var(--pc-text-4);border:none;font-size:0.72rem;cursor:pointer;padding:2px">No, gracias</button>
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
  <div id="pc-root" style="display:flex;min-height:100vh;width:100%;background:var(--pc-bg);font-family:'DM Sans',sans-serif;color:var(--pc-text)">

    <!-- Overlay de Sidebar en móvil -->
    <div id="pc-sidebar-overlay" onclick="pcToggleSidebar()" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:190;transition:opacity 0.25s"></div>

    <!-- Sidebar -->
    <aside id="pc-sidebar" style="width:220px;flex-shrink:0;background:var(--pc-bg-elev);border-right:1px solid var(--pc-border);display:flex;flex-direction:column;padding:0;transition:width 0.2s">
      <!-- Logo -->
      <div style="padding:24px 20px 20px;border-bottom:1px solid var(--pc-border)">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
          <span style="width:8px;height:8px;border-radius:50%;background:#E91E8C;flex-shrink:0"></span>
          <span style="font-size:0.65rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#E91E8C">Zapatillas May</span>
        </div>
        <p style="font-size:0.75rem;font-weight:600;color:var(--pc-text-3);margin:0">Portal Mayoreo <span style="font-size:0.6rem;color:var(--pc-muted-2)">v5</span></p>
        <p style="font-size:0.72rem;color:var(--pc-muted);margin:2px 0 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(pc.sesion?.nombre || '')}</p>
      </div>

      <!-- Nav -->
      <nav style="flex:1;padding:12px 10px;display:flex;flex-direction:column;gap:2px" id="pc-nav">
        ${pcNavItem('inicio',   '🏠', 'Mi resumen')}
        ${pcNavItem('catalogo', '👟', 'Productos')}
        ${pcNavItem('catalogos','📥', 'Catálogos')}
        ${pcNavItem('carrito',  '🛒', 'Carrito')}
        ${pcNavItem('apartados','🔒', 'Apartados')}
        ${pcNavItem('pedidos',  '📦', 'Mis pedidos')}
        ${pcNavItem('sugerencias','💡', 'Sugerencias')}
        ${pcNavItem('cuenta',   '👤', 'Mi cuenta')}
      </nav>

      <!-- Tema + Cerrar sesión -->
      <div style="padding:12px 10px;border-top:1px solid var(--pc-border);display:flex;flex-direction:column;gap:8px">
        <button onclick="pcToggleTema()" style="width:100%;padding:8px 12px;background:transparent;border:1px solid var(--pc-border-2);border-radius:8px;color:var(--pc-text-3);font-family:inherit;font-size:0.78rem;cursor:pointer;text-align:left;transition:all 0.15s;display:flex;align-items:center;gap:8px"
          onmouseover="this.style.borderColor='#E91E8C';this.style.color='#E91E8C'" onmouseout="this.style.borderColor='var(--pc-border-2)';this.style.color='var(--pc-text-3)'">
          <span data-pc-tema-icono>${pcIconoTema(document.documentElement.getAttribute('data-pc-theme') === 'light' ? 'light' : 'dark')}</span> Cambiar tema
        </button>
        <button onclick="pcCerrarSesion()" style="width:100%;padding:8px 12px;background:transparent;border:1px solid var(--pc-border-2);border-radius:8px;color:var(--pc-muted);font-family:inherit;font-size:0.78rem;cursor:pointer;text-align:left;transition:all 0.15s"
          onmouseover="this.style.borderColor='#E91E8C';this.style.color='#E91E8C'" onmouseout="this.style.borderColor='var(--pc-border-2)';this.style.color='var(--pc-muted)'">
          ← Cerrar sesión
        </button>
      </div>
    </aside>

    <!-- Contenido principal -->
    <main id="pc-main" style="flex:1;overflow-y:auto;min-width:0">
      <!-- Topbar móvil -->
      <div id="pc-topbar" style="display:none;align-items:center;justify-content:space-between;padding:14px 16px;background:var(--pc-bg-elev);border-bottom:1px solid var(--pc-border);position:sticky;top:0;z-index:50">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="width:7px;height:7px;border-radius:50%;background:#E91E8C"></span>
          <span style="font-size:0.7rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#E91E8C">Portal Mayoreo</span>
        </div>
        <div style="display:flex;align-items:center;gap:4px">
          <button onclick="pcToggleTema()" title="Cambiar tema" style="background:none;border:none;color:var(--pc-text-3);cursor:pointer;padding:4px;font-size:1.05rem;line-height:1"><span data-pc-tema-icono>${pcIconoTema(document.documentElement.getAttribute('data-pc-theme') === 'light' ? 'light' : 'dark')}</span></button>
          
          <button onclick="pcIrA('carrito')" title="Ver carrito" style="background:none;border:none;color:var(--pc-text-3);cursor:pointer;padding:4px;position:relative;display:flex;align-items:center;justify-content:center">
            🛒
            <span id="pc-topbar-cart-badge" style="position:absolute;top:-2px;right:-2px;background:#E91E8C;color:#fff;border-radius:100px;min-width:16px;height:16px;display:none;align-items:center;justify-content:center;font-size:0.6rem;font-weight:800;padding:0 3px"></span>
          </button>

          <button onclick="pcToggleSidebar()" style="background:none;border:none;color:var(--pc-text-3);cursor:pointer;padding:4px">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
      </div>

      <!-- Área de contenido -->
      <div id="pc-content" style="padding:28px 32px;max-width:1200px">
        <div style="text-align:center;padding:60px;color:var(--pc-muted-2)">
          <div style="width:32px;height:32px;border:3px solid #E91E8C;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 16px"></div>
          Cargando...
        </div>
      </div>
    </main>
  </div>

  <!-- ═══ BOTTOM NAV estilo app (solo móvil) ═══ -->
  <nav id="pc-bottomnav" aria-label="Navegación principal">
    <button class="pc-nav-item pc-bn-item${pc.tab === 'inicio' ? ' activo' : ''}" onclick="pcIrA('inicio')" aria-label="Inicio">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>
      <span>Inicio</span>
    </button>
    <button class="pc-nav-item pc-bn-item${pc.tab === 'catalogo' ? ' activo' : ''}" onclick="pcIrA('catalogo')" aria-label="Productos">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
      <span>Productos</span>
    </button>
    <button class="pc-bn-item pc-bn-search" onclick="pcBottomSearch()" aria-label="Buscar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
      <span>Buscar</span>
    </button>
    <button class="pc-nav-item pc-bn-item pc-bn-cart${pc.tab === 'carrito' ? ' activo' : ''}" onclick="pcIrA('carrito')" aria-label="Carrito">
      <span class="pc-bn-cart-wrap">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        <span class="pc-bn-badge" id="pc-bn-cart-badge" style="display:none" aria-hidden="true">0</span>
      </span>
      <span>Carrito</span>
    </button>
    <button class="pc-nav-item pc-bn-item${pc.tab === 'cuenta' ? ' activo' : ''}" onclick="pcIrA('cuenta')" aria-label="Mi cuenta">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>
      <span>Cuenta</span>
    </button>
  </nav>

  <a href="https://wa.me/5214792244560?text=${encodeURIComponent('Hola, soy ' + (pc.sesion?.nombre || 'cliente') + ' del portal mayoreo y tengo una pregunta 👋')}"
     target="_blank" rel="noopener" title="Escríbele a tu asesora"
     style="position:fixed;bottom:24px;right:24px;width:52px;height:52px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 20px rgba(37,211,102,0.4);z-index:500;text-decoration:none">
    <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
  </a>

  <style>
    /* ── Tema (claro por defecto, oscuro con data-pc-theme="dark") ── */
    :root {
      --pc-bg: #f3f4f9; --pc-bg-elev: #ffffff; --pc-card: #ffffff;
      --pc-border: #e6e8f0; --pc-border-2: #d4d8e4; --pc-hover: #eef0f6;
      --pc-text: #1b1b2c; --pc-text-2: #33334a; --pc-text-3: #52526a;
      --pc-text-4: #6f6f88; --pc-muted: #8a8aa0; --pc-muted-2: #a8a8bc;
      --pc-purple: #7c3aed; --pc-green: #059669;
    }
    :root[data-pc-theme="dark"] {
      --pc-bg: #0f0f1c; --pc-bg-elev: #0c0c17; --pc-card: #161625;
      --pc-border: #1e1e30; --pc-border-2: #2a2a40; --pc-hover: #161625;
      --pc-text: #e2e2f0; --pc-text-2: #c0c0e0; --pc-text-3: #a0a0c0;
      --pc-text-4: #8888aa; --pc-muted: #5a5a7a; --pc-muted-2: #3a3a5c;
      --pc-purple: #b39ddb; --pc-green: #4ade80;
    }
    @keyframes spin { to { transform: rotate(360deg) } }
    #pc-bottomnav { display: none; }
    @media (max-width: 768px) {
      #pc-sidebar { position:fixed;left:0;top:0;bottom:0;z-index:200;transform:translateX(-100%);transition:transform 0.25s; }
      #pc-sidebar.open { transform:translateX(0); }
      #pc-topbar { display:flex!important; }
      #pc-content { padding:20px 16px!important; }
      .pc-prod-grid { grid-template-columns:repeat(2,1fr)!important; gap:10px!important; }
      .pc-cart-layout { grid-template-columns:1fr!important; }
      .pc-cart-summary { position:static!important; width:100%!important; }

      /* Bottom nav estilo app */
      #pc-bottomnav {
        display: flex;
        position: fixed; left: 0; right: 0; bottom: 0; z-index: 210;
        background: var(--pc-bg-elev);
        backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
        border-top: 1px solid var(--pc-border);
        padding: 6px 4px calc(6px + env(safe-area-inset-bottom));
        box-shadow: 0 -4px 24px rgba(0,0,0,0.12);
      }
      .pc-bn-item {
        flex: 1; background: none; border: none; cursor: pointer;
        display: flex; flex-direction: column; align-items: center; gap: 3px;
        padding: 6px 2px; color: var(--pc-muted); font-family: inherit;
        font-size: 0.62rem; font-weight: 600; text-decoration: none;
        transition: color 0.18s, transform 0.18s;
        -webkit-tap-highlight-color: transparent;
      }
      .pc-bn-item svg { width: 22px; height: 22px; transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1); }
      .pc-bn-item:active { transform: scale(0.92); }
      .pc-bn-item:active svg { transform: scale(1.12); }
      .pc-bn-item.activo { color: #E91E8C; background: none; }
      /* Botón Buscar destacado (centro) */
      .pc-bn-search svg {
        background: #E91E8C; color: white;
        border-radius: 50%; padding: 7px; width: 36px; height: 36px;
        box-shadow: 0 4px 14px rgba(233,30,140,0.45); margin-top: -14px;
      }
      .pc-bn-search span:last-child { margin-top: 1px; }
      .pc-bn-cart-wrap { position: relative; display: inline-flex; }
      .pc-bn-badge {
        position: absolute; top: -6px; right: -8px;
        background: #E91E8C; color: white;
        min-width: 16px; height: 16px; border-radius: 100px; padding: 0 4px;
        font-size: 0.6rem; font-weight: 700; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 2px 6px rgba(233,30,140,0.45);
      }
      /* Espacio para que el bottom-nav no tape contenido ni los flotantes existentes */
      #pc-content { padding-bottom: 76px !important; }
      a[href*="wa.me"][style*="fixed"] { bottom: 84px !important; }
      #pc-bulk-share-bar { bottom: 76px !important; }
    }
    .pc-prod-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:14px; }
    .pc-nav-item { display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;cursor:pointer;
      font-size:0.83rem;font-weight:500;color:var(--pc-text-4);border:none;background:none;
      font-family:inherit;width:100%;text-align:left;transition:all 0.15s; }
    .pc-nav-item:hover { background:var(--pc-hover);color:var(--pc-text-2); }
    .pc-nav-item.activo { background:rgba(233,30,140,0.12);color:#E91E8C; }
    .pc-kpi { background:var(--pc-card);border:1px solid var(--pc-border);border-radius:12px;padding:20px;min-width:0; }
    .pc-kpi-val { font-size:1.6rem;font-weight:800;color:var(--pc-text);margin:4px 0 2px;letter-spacing:-0.02em; }
    .pc-kpi-lbl { font-size:0.7rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:var(--pc-muted); }
    .pc-kpi-sub { font-size:0.75rem;color:var(--pc-muted); }
    .pc-card { background:var(--pc-card);border:1px solid var(--pc-border);border-radius:12px;padding:20px; }
    .pc-prod-card { background:var(--pc-card);border:1px solid var(--pc-border);border-radius:10px;overflow:hidden;cursor:pointer;transition:border-color 0.15s; }
    .pc-prod-card:hover { border-color:#E91E8C; }
    .pc-badge { display:inline-block;padding:3px 8px;border-radius:100px;font-size:0.65rem;font-weight:700; }
    .pc-btn { padding:10px 20px;border:none;border-radius:8px;font-family:inherit;font-size:0.83rem;font-weight:600;cursor:pointer;transition:all 0.15s; }
    .pc-btn-primary { background:#E91E8C;color:white; }
    .pc-btn-primary:hover { background:#d01a7e; }
    .pc-btn-secondary { background:var(--pc-border);color:var(--pc-text-3);border:1px solid var(--pc-border-2); }
    .pc-btn-secondary:hover { border-color:#E91E8C;color:#E91E8C; }
    .pc-input { width:100%;padding:10px 14px;background:var(--pc-bg);border:1.5px solid var(--pc-border);border-radius:8px;
      color:var(--pc-text);font-family:inherit;font-size:0.85rem;outline:none;box-sizing:border-box;transition:border-color 0.15s; }
    .pc-input:focus { border-color:#E91E8C; }
    .pc-status-chip { display:inline-block;padding:3px 10px;border-radius:100px;font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em; }
  </style>`

  // Registrar globales
  window.pcIrA = pcIrA
  window.pcCerrarSesion = pcCerrarSesion
  window.pcToggleSidebar = pcToggleSidebar
  window.pcQuitarDelCarrito = pcQuitarDelCarrito
  window.pcFiltrarCat = (c) => { pc.filtroCat = c; pc.filtroNuevos = false; renderCatalogo() }
  window.pcFiltrarNuevos = () => { pc.filtroNuevos = !pc.filtroNuevos; pc.filtroCat = ''; renderCatalogo() }
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
  window.pcBuscar = (q) => {
    pc.busqueda = q
    const inputAntes = document.getElementById('pc-search-input')
    const cursor = inputAntes ? inputAntes.selectionStart : null
    renderCatalogo()
    const inputDespues = document.getElementById('pc-search-input')
    if (inputDespues) {
      inputDespues.focus()
      if (cursor != null) inputDespues.setSelectionRange(cursor, cursor)
    }
  }
  window.pcVaciarCarrito = () => { pc.carrito = []; pcGuardarCarrito(true); renderCarrito() }
  window.pcActualizarBadgeCarritoTopbar = pcActualizarBadgeCarritoTopbar
  window.pcBottomSearch = pcBottomSearch

  // Reemplazar spinner de inmediato
  const _initContent = document.getElementById('pc-content')
  if (_initContent) {
    try { renderInicio(_initContent) } catch(e) {
      console.error('[pc] renderInicio init error', e)
      _initContent.innerHTML = `<div style="padding:40px;text-align:center;color:#ef4444">Error al inicializar: ${e.message}</div>`
    }
  }

  if (typeof pcActualizarBadgeCarritoTopbar === 'function') {
    pcActualizarBadgeCarritoTopbar()
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
  try { localStorage.setItem('pc_active_tab_admin', tab) } catch {}
  try { if (typeof gtag === 'function') gtag('event', 'page_view', { page_title: 'Portal mayorista', page_path: '/portal-mayoreo/' + tab }) } catch {}
  // Actualizar nav items
  document.querySelectorAll('.pc-nav-item').forEach(el => {
    const t = el.getAttribute('onclick')?.match(/'(\w+)'/)?.[1]
    el.classList.toggle('activo', t === tab)
  })
  const content = document.getElementById('pc-content')
  if (!content) return
  // El polling en vivo del carrito solo debe correr mientras esa pestaña está
  // abierta (evita llamadas de más en el resto del portal).
  if (tab === 'carrito') pcIniciarPollCarrito(); else pcDetenerPollCarrito()
  try {
    switch (tab) {
      case 'inicio':   renderInicio(content); break
      case 'catalogo': renderCatalogo(content); break
      case 'catalogos': renderCatalogosDescarga(content); break
      case 'carrito':  renderCarrito(content); break
      case 'apartados': renderApartados(content); break
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
  const overlay = document.getElementById('pc-sidebar-overlay')
  if (overlay) overlay.style.display = 'none'
}

function pcToggleSidebar(_fromBack) {
  const sidebar = document.getElementById('pc-sidebar')
  const overlay = document.getElementById('pc-sidebar-overlay')
  const isOpen = sidebar?.classList.toggle('open')
  if (overlay) {
    overlay.style.display = isOpen ? 'block' : 'none'
  }
  if (isOpen && !_fromBack && window._zmPushBack) {
    window._zmPushBack(() => pcToggleSidebar(true))
  }
}

// Botón "Buscar" del bottom-nav: va a Productos (si no estabas ahí), sube
// hasta arriba y enfoca el buscador -- mismo patrón que zmBottomSearch() en la tienda.
function pcBottomSearch() {
  if (pc.tab !== 'catalogo') pcIrA('catalogo')
  const main = document.getElementById('pc-main')
  if (main) main.scrollTo({ top: 0, behavior: 'smooth' })
  setTimeout(() => {
    const input = document.getElementById('pc-search-input')
    if (input) input.focus()
  }, 300)
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
  // Variante para los endpoints ligados al cliente (/auth/pedidos/{cid},
  // /clientes/{cid}), protegidos con cliente_autorizado(): si el token no
  // coincide o venció responden 403 (no 401), que el interceptor global de
  // main.js NO detecta como sesión vencida (solo reacciona a 401) -- ese 403
  // quedaba ignorado en silencio por _safeFetch, y como GUARDAR el carrito no
  // exige el mismo token estricto, el efecto era: cada dispositivo seguía
  // guardando lo suyo, pero ninguno lograba "leer" de vuelta lo que guardó el
  // otro -- el bug real de "lo que agrego en la PC no aparece en el celular".
  const _safeFetchCliente = async (url) => {
    try {
      const res = await fetch(url, { headers: pcAuthHeaders() })
      if (res.status === 401 || res.status === 403) { pcForzarRelogin(); return null }
      if (!res.ok) return null
      return await res.json()
    } catch (e) {
      console.error('[portal] fetch error', url, e)
      return null
    }
  }

  const [prod, vari, inv, ped, cli, masVend] = await Promise.all([
    _safeFetch(`${PC_API}/productos/`),
    _safeFetch(`${PC_API}/variantes/?activa=eq.true`),
    _safeFetch(`${PC_API}/inventario/`),
    cid ? _safeFetchCliente(`${PC_API}/auth/pedidos/${cid}`) : Promise.resolve(null),
    cid ? _safeFetchCliente(`${PC_API}/clientes/${cid}`) : Promise.resolve(null),
    _safeFetch(`${PC_API}/productos/mas-vendidos`),
  ])

  if (Array.isArray(prod)) {
    // El orden del catálogo se queda tal cual viene del panel (orden_home) --
    // no tocar. La rotación de exposición para modelos menos vistos vive
    // aparte, en la sugerencia de Inicio (ver pc.modelosSugeridos).
    // Modelos de uso interno (lotes "OFERTA250", "OFERTA200", etc.) no se
    // ofrecen a clientes mayoristas, aunque existan en el ERP para otros canales.
    pc.productos = prod.filter(p => p.activo !== false
      && !/^oferta/i.test(p.nombre || '') && !/^oferta/i.test(p.sku_interno || ''))
  }
  if (Array.isArray(vari)) pc.variantes = vari
  if (Array.isArray(inv)) pc.inventario = inv
  if (cli) pc.clienteData = Array.isArray(cli) ? cli[0] : cli
  if (Array.isArray(masVend)) pc.masVendidos = masVend.filter(p =>
    !/^oferta/i.test(p.nombre || '') && !/^oferta/i.test(p.sku_interno || ''))
  // Sugerencias de Inicio: mezcla de más vendidos + modelos al azar, para que
  // productos menos vistos también tengan oportunidad de aparecer -- sin
  // tocar el orden real del catálogo (eso se queda como está en el panel).
  {
    const destacadosIds = new Set(pc.masVendidos.slice(0, 4).map(p => p.id))
    const resto = pc.productos.filter(p => !destacadosIds.has(p.id))
    for (let i = resto.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[resto[i], resto[j]] = [resto[j], resto[i]]
    }
    pc.modelosSugeridos = [
      ...pc.masVendidos.slice(0, 4).map(p => ({ ...p, _tag: `${p.pares_vendidos} vendidos` })),
      ...resto.slice(0, 4).map(p => ({ ...p, _tag: null })),
    ]
  }
  if (Array.isArray(ped)) {
    // El borrador que respalda el carrito activo no debe verse como "pedido" --
    // se usa aparte para restaurar el carrito, nunca en Mis pedidos / Inicio.
    try { await pcRestaurarCarritoDeServidor(ped) } catch {}
    // Ocultar de "Mis pedidos" el borrador que respalda el carrito activo --
    // MIENTRAS siga con esa marca sigue siendo "el carrito", así esté en
    // borrador o en apartado (que es una cotización previa al cierre, no un
    // pedido real todavía). Al cerrar un apartado (cerrar-apartado en el
    // backend) esa marca se quita, así que ahí sí se vuelve a ver como
    // pedido real -- por eso este filtro ya no depende del status.
    pc.pedidos = ped.filter(p => p.notas !== PC_BORRADOR_MARCA)
  }

  pc.datosCargados = true
  // Re-renderizar la pestaña activa con datos
  pcIrA(pc.tab)
  try {
    const activeProdId = localStorage.getItem('pc_active_product_id_admin')
    if (activeProdId) {
      pcAbrirProducto(activeProdId)
    }
  } catch {}
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
      <h1 style="font-size:1.5rem;font-weight:800;color:var(--pc-text);margin:0 0 4px;letter-spacing:-0.01em">
        Hola, ${esc(pc.sesion?.nombre?.split(' ')[0] || 'bienvenida')} 👋
      </h1>
      <p style="font-size:0.85rem;color:var(--pc-muted);margin:0">Resumen de tu cuenta mayoreo</p>
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

    <!-- Instrucciones: cómo funciona el portal -->
    <details class="pc-card" style="margin-bottom:28px;padding:16px 20px">
      <summary style="cursor:pointer;font-weight:700;color:var(--pc-text);font-size:0.92rem;list-style:none;display:flex;align-items:center;gap:8px">
        <span>❓</span> Cómo funciona el portal
      </summary>
      <div style="margin-top:16px;font-size:0.83rem;color:var(--pc-text-3);line-height:1.6">

        <p style="font-weight:700;color:var(--pc-text);margin:0 0 6px">🛍️ Agregar pares al carrito</p>
        <p style="margin:0 0 16px">Entra a un producto y toca la talla que quieras — se va guardando en un contador. Puedes tocar varias tallas y colores del mismo modelo antes de confirmar; al darle "Agregar al pedido" te quedas en el mismo producto (no se cierra) para que sigas agregando tallas si quieres. Puedes seguir agregando pares al carrito en cualquier momento, incluso después de mandar apartar algunos.</p>

        <p style="font-weight:700;color:var(--pc-text);margin:0 0 6px">🔒 Apartados</p>
        <p style="margin:0 0 16px">En tu carrito, toca "Apartar pares específicos" para seleccionar exactamente cuáles pares quieres que te reservemos. Al enviarlos, quedan como "esperando aprobación" — nosotros revisamos y aprobamos el apartado; hasta ese momento se reserva el stock de verdad. Una vez aprobado, esos pares dejan de contarse como carrito normal y aparecen resumidos aparte; puedes seguir agregando pares nuevos al carrito y volver a apartar cuantas veces quieras.</p>

        <p style="font-weight:700;color:var(--pc-text);margin:0 0 6px">📦 Ver y cerrar tus apartados</p>
        <p style="margin:0 0 16px">Cuando tienes pares apartados, aparece un acceso a "Apartados" (en el menú, o el banner en tu carrito) donde ves el desglose completo. Desde ahí puedes pedir que se quite un par específico (queda pendiente hasta que lo autoricemos) o darle "Cerrar pedido" cuando ya quieras pagar todo lo apartado — eliges <strong>Transferencia</strong> (te mostramos los datos bancarios) o <strong>Tarjeta</strong> (te generamos un link de pago). Ojo: una vez que cierras con una forma de pago, no se puede cambiar sola desde el portal — si necesitas cambiarla, escríbenos por WhatsApp.</p>

        <p style="font-weight:700;color:var(--pc-text);margin:0 0 6px">⚡ Cerrar pedido directo</p>
        <p style="margin:0 0 16px">Si no quieres apartar por partes, en tu carrito también está el botón "Cerrar pedido" para pagar de una vez todo lo que llevas, sin pasar por la aprobación de apartado.</p>

        <p style="font-weight:700;color:var(--pc-text);margin:0 0 6px">📸 Compartir o descargar fotos</p>
        <p style="margin:0 0 16px">Dentro de la ficha de un producto, toca cualquier foto para verla en grande. Ahí puedes compartir esa foto sola, o activar "seleccionar varias" para elegir varias fotos del mismo modelo y compartirlas o descargarlas juntas de una vez. También puedes compartir las fotos de portada de varios productos sin entrar a cada uno: en el catálogo, selecciona los modelos/colores que quieras y compártelos juntos por WhatsApp. No hay un límite fijo de cuántas fotos puedes seleccionar — el límite real depende de la app a la que las compartas (por ejemplo, WhatsApp).</p>

        <p style="font-weight:700;color:var(--pc-text);margin:0 0 6px">📥 Catálogos para descargar</p>
        <p style="margin:0 0 16px">En "Catálogos" puedes bajar un PDF con las fotos de todos los modelos activos de cada categoría (tacones, sandalias, botas, etc.) — listo para mandarlo directo a tus clientas por WhatsApp, sin tener que armar nada tú misma.</p>

        <p style="font-weight:700;color:var(--pc-text);margin:0 0 6px">💡 Sugerencias</p>
        <p style="margin:0 0 16px">Esta sección no es de productos — es para escribirnos directo si quieres pedir una función nueva, avisar de un error, o darnos cualquier recomendación sobre el portal.</p>

        <p style="font-weight:700;color:var(--pc-text);margin:0">👤 Mi cuenta</p>
        <p style="margin:0">Ahí actualizas tu dirección de envío (necesaria para poder cerrar cualquier pedido), tus datos de contacto y tu crédito disponible si tienes.</p>

      </div>
    </details>

    <!-- Sugerencias: más vendidos del mes + modelos al azar (rotan cada sesión) -->
    ${pc.modelosSugeridos.length ? `
    <div style="margin-bottom:28px">
      <p style="font-size:0.8rem;font-weight:700;color:var(--pc-text);margin:0 0 10px">🔥 Sugerencias para ti</p>
      <div style="display:flex;gap:12px;overflow-x:auto;padding-bottom:6px;scrollbar-width:thin">
        ${pc.modelosSugeridos.map(p => `
          <div onclick="pcAbrirProducto('${p.id}')" style="flex:0 0 130px;min-width:0;cursor:pointer">
            <div style="position:relative;aspect-ratio:1/1;border-radius:10px;overflow:hidden;background:var(--pc-card);margin-bottom:6px">
              <img src="${esc(p.imagen_principal||'')}" alt="${esc(p.nombre)}" loading="lazy" style="width:100%;height:100%;object-fit:cover">
              ${p._tag ? `<span style="position:absolute;top:6px;left:6px;background:rgba(233,30,140,0.92);color:white;font-size:0.6rem;font-weight:700;padding:2px 7px;border-radius:100px">${esc(p._tag)}</span>` : ''}
            </div>
            <p style="font-size:0.75rem;color:var(--pc-text-2);margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(p.nombre)}</p>
          </div>`).join('')}
      </div>
    </div>` : ''}

    <!-- Historial de compras -->
    ${hayHistorial ? `
    <div class="pc-card" style="margin-bottom:20px">
      <p style="font-weight:700;color:var(--pc-text);margin:0 0 16px">Tu historial de compras</p>
      <div style="display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:20px;align-items:start">
        <div>
          <p style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--pc-muted);margin:0 0 10px">Gasto por mes</p>
          <div style="position:relative;height:160px"><canvas id="pc-chart-gasto"></canvas></div>
        </div>
        <div>
          <p style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--pc-muted);margin:0 0 10px">Modelos más comprados</p>
          ${topModelos.length ? topModelos.map(([nombre, cant], i) => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;${i<topModelos.length-1?'border-bottom:1px solid var(--pc-border)':''}">
              <span style="font-size:0.8rem;color:var(--pc-text-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:8px">${esc(nombre)}</span>
              <span style="font-size:0.8rem;font-weight:700;color:#E91E8C;flex-shrink:0">${cant} par${cant!==1?'es':''}</span>
            </div>`).join('') : `<p style="font-size:0.8rem;color:var(--pc-muted)">Sin datos aún</p>`}
        </div>
      </div>
    </div>` : ''}

    <!-- Últimos pedidos -->
    ${ultimosPedidos.length ? `
    <div class="pc-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <p style="font-weight:700;color:var(--pc-text);margin:0">Últimos pedidos</p>
        <button onclick="pcIrA('pedidos')" style="background:none;border:none;color:#E91E8C;font-size:0.78rem;cursor:pointer;font-family:inherit">Ver todos →</button>
      </div>
      ${ultimosPedidos.map(p => pcPedidoFila(p)).join('')}
    </div>` : `
    <div class="pc-card" style="text-align:center;padding:40px">
      <p style="font-size:2rem;margin:0 0 12px">🛍️</p>
      <p style="color:var(--pc-text-3);font-weight:600;margin:0 0 8px">Aún no tienes pedidos</p>
      <p style="color:var(--pc-muted);font-size:0.83rem;margin:0 0 20px">Explora el catálogo y haz tu primer pedido mayoreo</p>
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
        x: { grid: { display: false }, ticks: { color: 'var(--pc-muted)', font: { size: 11 } } },
        y: { grid: { color: 'var(--pc-border)' }, ticks: { color: 'var(--pc-muted)', font: { size: 10 }, callback: (v) => money(v) } },
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
    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--pc-border);gap:12px" onclick="pcIrA('pedidos')" style="cursor:pointer">
      <div style="min-width:0">
        <p style="font-size:0.78rem;font-family:monospace;color:var(--pc-text-4);margin:0 0 2px">#${(p.id||'').substring(0,8).toUpperCase()}</p>
        <p style="font-size:0.83rem;color:var(--pc-text-3);margin:0">${new Date(p.created_at).toLocaleDateString('es-MX')}</p>
      </div>
      <span class="pc-status-chip" style="background:${color}20;color:${color};white-space:nowrap">${p.status}</span>
      <p style="font-weight:700;color:var(--pc-text);margin:0;white-space:nowrap">${money(p.total)}</p>
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
  if (pc.filtroNuevos) prods = prods.filter(esNuevo)
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
    <div style="margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%">
      <h1 style="font-size:1.4rem;font-weight:800;color:var(--pc-text);margin:0">Productos</h1>
      <button onclick="pcToggleModoCompartir()" class="pc-btn" style="padding:6px 12px;font-size:0.75rem;background:${window._pcModoCompartir ? '#25D366' : 'var(--pc-card)'};color:${window._pcModoCompartir ? 'white' : 'var(--pc-text-2)'};border:1.5px solid ${window._pcModoCompartir ? '#25D366' : 'var(--pc-border-2)'};font-weight:700;display:flex;align-items:center;gap:6px;cursor:pointer;border-radius:100px">📲 ${window._pcModoCompartir ? 'Listo' : 'Compartir fotos (sin precios)'}</button>
    </div>

    <!-- Categorías -->
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;align-items:center;width:100%">
      <button onclick="pcFiltrarNuevos()" class="pc-btn ${pc.filtroNuevos ? 'pc-btn-primary' : 'pc-btn-secondary'}" style="padding:8px 14px;font-size:0.78rem;${pc.filtroNuevos ? '' : 'color:var(--pc-green);border-color:var(--pc-green)'}">✨ Nuevos</button>
      <button onclick="pcFiltrarCat('')" class="pc-btn ${!pc.filtroCat && !pc.filtroNuevos ? 'pc-btn-primary' : 'pc-btn-secondary'}" style="padding:8px 14px;font-size:0.78rem">Todos</button>
      ${cats.map(c => `<button onclick="pcFiltrarCat('${esc(c)}')" class="pc-btn ${pc.filtroCat === c && !pc.filtroNuevos ? 'pc-btn-primary' : 'pc-btn-secondary'}" style="padding:8px 14px;font-size:0.78rem;text-transform:capitalize">${c}</button>`).join('')}
    </div>

    <!-- Buscador -->
    <div style="margin-bottom:14px">
      <input id="pc-search-input" class="pc-input" style="width:100%" placeholder="🔍 Buscar modelo o SKU..."
        value="${esc(pc.busqueda)}" oninput="pcBuscar(this.value)">
    </div>

    <!-- Filtros: talla y color (colapsable) -->
    ${(tallasDisponibles.length || coloresDisponibles.length) ? `
    <div class="pc-card" style="margin-bottom:20px;padding:0;overflow:hidden">
      <button onclick="pcToggleFiltrosPanel()" style="width:100%;background:none;border:none;padding:14px 20px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;font-family:inherit">
        <span style="display:flex;align-items:center;gap:8px">
          <span style="font-size:0.85rem;font-weight:700;color:var(--pc-text)">🎛️ Filtrar por talla o color</span>
          ${hayFiltrosActivos ? `<span style="background:#E91E8C;color:white;font-size:0.68rem;font-weight:700;border-radius:100px;padding:2px 8px">${pc.filtroTallas.length + pc.filtroColores.length}</span>` : ''}
        </span>
        <span style="color:var(--pc-muted);font-size:0.75rem;display:flex;align-items:center;gap:10px">
          ${hayFiltrosActivos ? `<span onclick="event.stopPropagation();pcLimpiarFiltrosTC()" style="color:#E91E8C;font-weight:600;cursor:pointer">Limpiar</span>` : ''}
          <span style="transition:transform 0.2s;display:inline-block;transform:rotate(${pc.filtrosExpandido ? '180deg' : '0deg'})">▾</span>
        </span>
      </button>

      ${pc.filtrosExpandido ? `
      <div style="padding:4px 20px 18px;border-top:1px solid var(--pc-border)">
        ${tallasDisponibles.length ? `
        <div style="margin-top:14px;margin-bottom:${coloresDisponibles.length ? '14px' : '0'}">
          <p style="font-size:0.68rem;color:var(--pc-muted);margin:0 0 8px">Talla</p>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            ${tallasDisponibles.map(t => {
              const sel = pc.filtroTallas.includes(t)
              return `<button onclick="pcToggleFiltroTalla('${esc(t)}')"
                style="min-width:40px;padding:6px 10px;border-radius:8px;border:1.5px solid ${sel ? '#E91E8C' : 'var(--pc-border-2)'};background:${sel ? 'rgba(233,30,140,0.15)' : 'var(--pc-bg)'};color:${sel ? '#E91E8C' : 'var(--pc-text-3)'};font-family:inherit;font-size:0.78rem;font-weight:700;cursor:pointer;transition:all 0.15s">${esc(t)}</button>`
            }).join('')}
          </div>
        </div>` : ''}

        ${coloresDisponibles.length ? `
        <div style="margin-top:${tallasDisponibles.length ? '0' : '14px'}">
          <p style="font-size:0.68rem;color:var(--pc-muted);margin:0 0 8px">Color</p>
          <div style="display:flex;flex-wrap:wrap;gap:8px;max-height:160px;overflow-y:auto">
            ${coloresDisponibles.map(([color, hex]) => {
              const sel = pc.filtroColores.includes(color)
              return `<button onclick="pcToggleFiltroColor('${esc(color)}')" title="${esc(color)}"
                style="display:flex;align-items:center;gap:6px;padding:5px 10px 5px 6px;border-radius:100px;border:1.5px solid ${sel ? '#E91E8C' : 'var(--pc-border-2)'};background:${sel ? 'rgba(233,30,140,0.1)' : 'var(--pc-bg)'};cursor:pointer;font-family:inherit;transition:all 0.15s">
                <span style="width:16px;height:16px;border-radius:50%;background:${hex || '#888'};border:1px solid rgba(255,255,255,0.2);flex-shrink:0"></span>
                <span style="font-size:0.75rem;color:${sel ? '#E91E8C' : 'var(--pc-text-3)'};font-weight:${sel ? '700' : '500'};white-space:nowrap">${esc(color)}</span>
              </button>`
            }).join('')}
          </div>
        </div>` : ''}
      </div>` : ''}
    </div>` : ''}

    <!-- Grid productos -->
    ${prods.length === 0 ? `<div style="text-align:center;padding:60px;color:var(--pc-muted)">Sin resultados para "${esc(pc.busqueda)}"</div>` : `
    <div class="pc-prod-grid">
      ${prods.map(p => pcProductoCard(p)).join('')}
    </div>`}

    ${(() => {
      if (window._pcModoCompartir) {
        if (window._pcCompartirSeleccion.length === 0) return ''
        return `
        <div id="pc-bulk-share-bar" style="position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:900;background:var(--pc-card);border:2px solid #25D366;border-radius:18px;padding:12px 20px;display:flex;align-items:center;gap:16px;box-shadow:0 8px 32px rgba(0,0,0,0.5);width:90%;max-width:500px">
          <div style="flex:1;line-height:1.2">
            <p style="margin:0;font-size:0.75rem;color:var(--pc-text-4);font-weight:600">Compartir fotos</p>
            <p style="margin:0;font-size:1rem;font-weight:800;color:var(--pc-text)">${window._pcCompartirSeleccion.length} seleccionados</p>
            <p style="margin:2px 0 0;font-size:0.58rem;color:#10b981;font-weight:600">⚠️ Solo fotos de portada (sin precios)</p>
          </div>
          <div style="display:flex;gap:8px">
            <button onclick="pcCompartirVariosWhatsApp()" id="pc-bulk-share-btn" class="pc-btn" style="padding:10px 14px;font-size:0.8rem;background:#25D366;color:white;border:none;border-radius:8px;font-weight:700;display:flex;align-items:center;gap:6px;cursor:pointer">💬 Compartir</button>
            <button onclick="pcCancelarSeleccionCompartir()" class="pc-btn pc-btn-secondary" style="padding:10px 14px;font-size:0.8rem;cursor:pointer">Cancelar</button>
          </div>
        </div>`
      }
      return ''
    })()}
  `
}

window.pcToggleModoCompartir = () => {
  window._pcModoCompartir = !window._pcModoCompartir
  if (!window._pcModoCompartir) {
    window._pcCompartirSeleccion = []
  }
  renderCatalogo()
}

window.pcToggleSeleccionCompartir = (prodId) => {
  const p = pc.productos.find(x => x.id === prodId)
  if (!p) return
  const vars = pc.variantes.filter(v => v.producto_id === prodId)
  const colores = [...new Set(vars.map(v => v.color).filter(Boolean))]
  
  if (colores.length > 0) {
    const algunColSel = colores.some(c => window._pcCompartirSeleccion.includes(`${prodId}::${c}`))
    if (algunColSel) {
      colores.forEach(c => {
        const idx = window._pcCompartirSeleccion.indexOf(`${prodId}::${c}`)
        if (idx > -1) window._pcCompartirSeleccion.splice(idx, 1)
      })
    } else {
      colores.forEach(c => {
        const item = `${prodId}::${c}`
        if (!window._pcCompartirSeleccion.includes(item)) {
          window._pcCompartirSeleccion.push(item)
        }
      })
    }
  } else {
    const item = `${prodId}::default`
    const idx = window._pcCompartirSeleccion.indexOf(item)
    if (idx > -1) {
      window._pcCompartirSeleccion.splice(idx, 1)
    } else {
      window._pcCompartirSeleccion.push(item)
    }
  }
  renderCatalogo()
}

window.pcToggleSeleccionColorCompartir = (prodId, color) => {
  const item = `${prodId}::${color}`
  const idx = window._pcCompartirSeleccion.indexOf(item)
  if (idx > -1) {
    window._pcCompartirSeleccion.splice(idx, 1)
  } else {
    window._pcCompartirSeleccion.push(item)
  }
  renderCatalogo()
}

window.pcCancelarSeleccionCompartir = () => {
  window._pcModoCompartir = false
  window._pcCompartirSeleccion = []
  renderCatalogo()
}

window.pcCompartirVariosWhatsApp = async () => {
  const btn = document.getElementById('pc-bulk-share-btn')
  if (!btn) return
  const origTxt = btn.innerHTML
  btn.innerHTML = '⏳ Procesando...'
  btn.disabled = true

  try {
    if (!window._pcCompartirSeleccion.length) {
      alert('Selecciona al menos un producto.')
      return
    }

    const files = []
    const selecInfo = []
    
    for (const item of window._pcCompartirSeleccion) {
      const [prodId, colorName] = item.split('::')
      const p = pc.productos.find(x => x.id === prodId)
      if (!p) continue
      
      const vars = pc.variantes.filter(v => v.producto_id === prodId)
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
      <h1 style="font-size:1.4rem;font-weight:800;color:var(--pc-text);margin:0 0 4px">📥 Catálogos</h1>
      <p style="font-size:0.83rem;color:var(--pc-muted);margin:0">Descarga un PDF con fotos de todos los modelos activos por categoría, listo para compartir con tus clientes.</p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px">
      ${PC_CATEGORIAS_CATALOGO.map(([id, icon, label]) => {
        const total = pc.productos.filter(p => p.categoria === id && p.activo !== false).length
        return `
        <div id="pc-cat-card-${id}" class="pc-card" style="text-align:center;padding:24px 16px;display:flex;flex-direction:column;align-items:center;gap:10px;transition:border-color 0.15s,transform 0.15s"
          onmouseover="this.style.borderColor='#E91E8C';this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='var(--pc-border)';this.style.transform='translateY(0)'">
          <div style="width:56px;height:56px;border-radius:50%;background:rgba(233,30,140,0.1);display:flex;align-items:center;justify-content:center;font-size:1.6rem">${icon}</div>
          <div>
            <p style="font-weight:700;color:var(--pc-text);margin:0 0 2px;font-size:0.92rem">${label}</p>
            <p style="font-size:0.72rem;color:var(--pc-muted);margin:0">${total} modelo${total !== 1 ? 's' : ''}</p>
          </div>
          <button onclick="pcDescargarCatalogoPorCategoria('${id}','${icon} ${label}')" class="pc-btn pc-btn-primary" style="width:100%;padding:9px;font-size:0.8rem;margin-top:4px" ${total === 0 ? 'disabled style="opacity:0.4;cursor:not-allowed"' : ''}>
            Descargar PDF
          </button>
          <p class="pc-cat-msg" id="pc-cat-msg-${id}" style="font-size:0.7rem;color:var(--pc-text-3);margin:0;display:none;min-height:14px"></p>
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
  const seleccionado = window._pcModoCompartir && window._pcCompartirSeleccion.some(x => x.startsWith(p.id + '::'))

  const clickAction = window._pcModoCompartir 
    ? `pcToggleSeleccionCompartir('${p.id}')` 
    : `pcAbrirProducto('${p.id}')`

  return `
    <div class="pc-prod-card" onclick="${clickAction}" style="display:flex;flex-direction:column;position:relative;${seleccionado ? 'border-color:#25D366;box-shadow:0 0 0 2px #25D366;' : ''}">
      <div style="position:relative;aspect-ratio:3/4;overflow:hidden;background:var(--pc-bg-elev)">
        <img id="pc-card-img-${p.id}" src="${esc(imgPrincipal)}" alt="${esc(p.nombre)}" loading="lazy"
          style="width:100%;height:100%;object-fit:cover;transition:opacity 0.2s">
        ${p.es_oferta ? '<span style="position:absolute;top:8px;left:8px;background:#E91E8C;color:white;font-size:0.6rem;font-weight:700;padding:3px 7px;border-radius:100px">OFERTA</span>' : ''}
        ${esNuevo(p) ? '<span style="position:absolute;top:8px;right:8px;background:#10b981;color:white;font-size:0.6rem;font-weight:700;padding:3px 7px;border-radius:100px">NUEVO</span>' : ''}
        ${enCarrito > 0 && !window._pcModoCompartir ? `<span style="position:absolute;bottom:8px;right:8px;background:rgba(233,30,140,0.92);color:white;font-size:0.6rem;font-weight:700;padding:3px 8px;border-radius:100px">${enCarrito} par${enCarrito !== 1 ? 'es' : ''}</span>` : ''}
        
        ${window._pcModoCompartir ? `
          <div style="position:absolute;top:8px;left:8px;width:24px;height:24px;border-radius:50%;background:${seleccionado ? '#25D366' : 'rgba(0,0,0,0.5)'};border:2px solid white;display:flex;align-items:center;justify-content:center;z-index:10;color:white;font-weight:bold;font-size:0.8rem;box-shadow:0 2px 6px rgba(0,0,0,0.3)">
            ${seleccionado ? '✓' : ''}
          </div>
        ` : ''}
      </div>
      <!-- Swatches de color -->
      ${coloresList.length > 0 ? `
      <div style="display:flex;gap:5px;padding:8px 10px;background:var(--pc-bg-elev);flex-wrap:wrap" onclick="event.stopPropagation()">
        ${coloresList.slice(0,8).map(([cn, cd]) => {
          if (window._pcModoCompartir) {
            const colorSel = window._pcCompartirSeleccion.includes(p.id + '::' + cn)
            return `
              <div title="${esc(cn)}" onclick="event.stopPropagation();pcToggleSeleccionColorCompartir('${p.id}','${esc(cn)}')"
                style="width:18px;height:18px;border-radius:50%;background:${cd.hex||'#888'};border:2px solid ${colorSel ? '#25D366' : 'var(--pc-border-2)'};cursor:pointer;flex-shrink:0;position:relative;display:flex;align-items:center;justify-content:center;transition:border-color 0.15s">
                ${colorSel ? '<span style="color:#25D366;font-size:0.62rem;font-weight:900">✓</span>' : ''}
              </div>`
          } else {
            return `
              <div title="${esc(cn)}" onclick="pcCardColor('${p.id}','${esc(cd.foto||imgPrincipal)}',this)"
                style="width:18px;height:18px;border-radius:50%;background:${cd.hex||'#888'};border:2px solid var(--pc-border-2);cursor:pointer;flex-shrink:0;transition:border-color 0.15s"
                onmouseover="this.style.borderColor='#E91E8C'" onmouseout="if(!this.dataset.sel)this.style.borderColor='var(--pc-border-2)'">
              </div>`
          }
        }).join('')}
        ${coloresList.length > 8 ? `<span style="font-size:0.62rem;color:var(--pc-muted);align-self:center">+${coloresList.length-8}</span>` : ''}
      </div>` : ''}
      <div style="padding:10px 12px;flex:1;display:flex;flex-direction:column">
        <p style="font-size:0.65rem;color:var(--pc-muted);margin:0 0 2px;font-family:monospace">${esc(p.sku_interno||'')}</p>
        <p style="font-size:0.83rem;font-weight:600;color:var(--pc-text-2);margin:0 0 8px;line-height:1.3;flex:1">${esc(p.nombre)}</p>
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px">
          ${m3 ? `<span style="font-size:0.72rem;color:var(--pc-text-3)">3-5: <strong style="color:var(--pc-text)">${money(m3)}</strong></span>` : ''}
          ${m6 ? `<span style="font-size:0.72rem;color:var(--pc-text-3)">6+: <strong style="color:#E91E8C">${money(m6)}</strong></span>` : ''}
        </div>
        ${window._pcModoCompartir ? `
          <button class="pc-btn" style="width:100%;padding:7px;font-size:0.78rem;background:${seleccionado ? 'rgba(37,211,102,0.15)' : 'var(--pc-bg-elev)'};color:${seleccionado ? '#25D366' : 'var(--pc-text-3)'};border:1.5px solid ${seleccionado ? '#25D366' : 'var(--pc-border-2)'};font-weight:bold;cursor:pointer">
            ${seleccionado ? '✓ Seleccionado' : 'Seleccionar'}
          </button>
        ` : `
          <button onclick="event.stopPropagation();pcAbrirProducto('${p.id}')" class="pc-btn pc-btn-primary" style="width:100%;padding:7px;font-size:0.78rem">
            ${enCarrito > 0 ? `✓ ${enCarrito} par${enCarrito !== 1 ? 'es' : ''} · Editar` : '+ Seleccionar tallas'}
          </button>
        `}
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
    delete d.dataset.sel; d.style.borderColor = 'var(--pc-border-2)'
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

// Traduce los códigos guardados en tipo_tacon/horma (valores de <select> del
// alta de producto) a una etiqueta legible para el cliente.
function pcEtiquetaTipoTacon(v) {
  return { aguja: 'Aguja', bloque: 'Bloque', cuna: 'Cuña', plataforma: 'Plataforma', sin_tacon: 'Sin tacón' }[v] || v
}
function pcEtiquetaHorma(v) {
  return { normal: 'Normal', reducida: 'Reducida (corre chico)', amplia: 'Amplia (corre grande)' }[v] || v
}

// ── Modal de producto: port del POS (misma lógica, datos de pc.*) ──────────────
window.pcAbrirProducto = function(prodId) {
  if (window._zmPushBack) window._zmPushBack(() => {
    document.getElementById('pc-modal')?.remove()
    try { localStorage.removeItem('pc_active_product_id_admin') } catch {}
  })
  const prev = document.getElementById('pc-modal')
  if (prev) prev.remove()
  try { localStorage.setItem('pc_active_product_id_admin', prodId) } catch {}

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
    <div style="background:var(--pc-card);border:1px solid var(--pc-border-2);border-radius:16px;max-width:640px;width:100%;height:90vh;display:flex;flex-direction:column;overflow:hidden">

      <!-- Header: foto + nombre + precios -->
      <div style="padding:1.25rem 1.5rem 0.85rem;border-bottom:1px solid var(--pc-border-2);flex-shrink:0">
        <div style="display:flex;align-items:flex-start;gap:12px">
          <img id="pc-modal-img" src="${esc(p.imagen_principal||'')}" onclick="abrirLightboxPC(this.src, null, '${esc(String(p.nombre || '').split(' ')[0])}')"
            style="width:64px;height:64px;object-fit:cover;border-radius:10px;flex-shrink:0;cursor:zoom-in;background:var(--pc-bg-elev)">
          <div style="flex:1;min-width:0">
            <p style="font-size:0.65rem;font-family:monospace;color:var(--pc-muted);margin:0 0 2px">${esc(p.sku_interno||'')}</p>
            <p style="font-weight:700;font-size:0.95rem;line-height:1.25;color:var(--pc-text);margin:0">${esc(p.nombre)}</p>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;gap:6px;flex-shrink:0">
            <button onclick="history.back()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--pc-muted);line-height:1">✕</button>
            <button onclick="pcToggleCompartir('${prodId}')" title="Compartir con tus clientes" style="background:none;border:none;font-size:1.1rem;cursor:pointer;color:var(--pc-muted);line-height:1;padding:2px">↗️</button>
          </div>
        </div>
        <div id="pc-compartir-${prodId}" style="display:none;gap:8px;margin-top:8px;padding:8px 0 2px;border-top:1px solid var(--pc-border-2)">
          <button onclick="pcCompartirProducto('${prodId}','whatsapp')" style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;background:#25D366;color:white;border:none;border-radius:8px;padding:8px;font-size:0.78rem;font-weight:600;cursor:pointer;font-family:inherit">💬 WhatsApp</button>
          <button onclick="pcCompartirProducto('${prodId}','facebook')" style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;background:#1877F2;color:white;border:none;border-radius:8px;padding:8px;font-size:0.78rem;font-weight:600;cursor:pointer;font-family:inherit">👍 Facebook</button>
          <button onclick="pcCompartirProducto('${prodId}','copiar')" style="flex:0 0 auto;background:var(--pc-bg);border:1px solid var(--pc-border-2);color:var(--pc-text-2);border-radius:8px;padding:8px 12px;font-size:0.78rem;cursor:pointer;font-family:inherit">🔗</button>
        </div>
        <div style="display:flex;gap:6px;margin-top:10px">
          <div style="flex:1;background:var(--pc-bg);border:1px solid var(--pc-border-2);border-radius:9px;padding:6px 4px;text-align:center">
            <p style="font-size:0.6rem;color:var(--pc-muted);font-weight:700;text-transform:uppercase;margin:0 0 2px">Variado 3-5</p>
            <p style="font-size:0.92rem;font-weight:800;color:var(--pc-text);margin:0">${fmtP(pMay3)}</p>
          </div>
          <div style="flex:1;background:var(--pc-bg);border:1px solid var(--pc-border-2);border-radius:9px;padding:6px 4px;text-align:center">
            <p style="font-size:0.6rem;color:var(--pc-muted);font-weight:700;text-transform:uppercase;margin:0 0 2px">Variado 6+</p>
            <p style="font-size:0.92rem;font-weight:800;color:#E91E8C;margin:0">${fmtP(pMay6)}</p>
          </div>
          <div id="pc-tier-corr-container" style="flex:1"></div>
        </div>
        <!-- Strip de fotos por color -->
        <div id="pc-modal-foto-strip" style="display:none;gap:6px;flex-wrap:nowrap;overflow-x:auto;padding:8px 0 0;-webkit-overflow-scrolling:touch"></div>
      </div>

      <!-- Scroll area: tabs + colores + tallas -->
      <div id="pc-modal-scroll" style="flex:1;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch">

        <div id="pc-mode-tabs-container"></div>

        <!-- Selector de colores -->
        <div style="padding:1rem 1.5rem;border-bottom:1px solid var(--pc-border)">
          <p style="font-size:0.7rem;color:var(--pc-muted);font-weight:700;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.08em">Selecciona color</p>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${colores.map(color => {
              const varsColor = varsProd.filter(v => v.color === color)
              const fotoColor = varsColor.map(x => x.foto_url).find(Boolean)
              const hex = varsColor[0]?.color_hex || '#888'
              const totalStock = varsColor.reduce((sum, v) => {
                return sum + pc.inventario.filter(i => i.variante_id === v.id).reduce((s, i) => s + (i.cantidad || 0), 0)
              }, 0)
              const swatch = fotoColor
                ? `<img src="${esc(fotoColor)}" style="width:46px;height:46px;object-fit:cover;border-radius:8px;border:1px solid var(--pc-border-2)">`
                : `<div style="width:46px;height:46px;border-radius:8px;background:${hex};border:1px solid var(--pc-border-2)"></div>`
              return `
                <div onclick="pcSeleccionarColor('${prodId}','${esc(color)}')"
                     id="pc-color-btn-${esc(color.replace(/\s/g,'_'))}"
                     style="display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;padding:6px;border-radius:10px;border:2px solid ${totalStock===0?'var(--pc-border)':'var(--pc-border-2)'};opacity:${totalStock===0?'0.4':'1'};width:74px;transition:border-color 0.15s">
                  ${swatch}
                  <span style="font-size:0.6rem;color:var(--pc-text-4);text-align:center;line-height:1.1;height:2.2em;overflow:hidden">${esc(color)}</span>
                  <span id="pc-color-badge-${esc(color.replace(/\s/g,'_'))}" style="font-size:0.6rem;color:#E91E8C;font-weight:700;display:none"></span>
                </div>`
            }).join('')}
          </div>
        </div>

        <!-- Panel de tallas (se rellena al seleccionar color) -->
        <div id="pc-tallas-panel" style="padding:1rem 1.5rem;border-bottom:1px solid var(--pc-border)">
          <p style="color:var(--pc-muted);font-size:0.85rem">← Selecciona un color para ver las tallas</p>
        </div>

        ${(p.descripcion || p.material || p.material_suela || p.forro || p.tipo_tacon || p.altura_tacon || p.horma) ? `
        <div style="padding:1rem 1.5rem">
          ${p.descripcion ? `
          <p style="font-size:0.7rem;color:var(--pc-muted);font-weight:700;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.08em">Descripción</p>
          <p style="font-size:0.85rem;color:var(--pc-text-2);line-height:1.6;margin:0 0 16px">${esc(p.descripcion)}</p>` : ''}
          ${(p.material || p.material_suela || p.forro || p.tipo_tacon || p.altura_tacon || p.horma) ? `
          <p style="font-size:0.7rem;color:var(--pc-muted);font-weight:700;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.08em">Detalles del producto</p>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
            ${p.material ? `<div><p style="font-size:0.65rem;color:var(--pc-muted);margin:0 0 2px;text-transform:uppercase">Material</p><p style="font-size:0.82rem;color:var(--pc-text);margin:0;text-transform:uppercase">${esc(p.material)}</p></div>` : ''}
            ${p.material_suela ? `<div><p style="font-size:0.65rem;color:var(--pc-muted);margin:0 0 2px;text-transform:uppercase">Suela</p><p style="font-size:0.82rem;color:var(--pc-text);margin:0;text-transform:uppercase">${esc(p.material_suela)}</p></div>` : ''}
            ${p.forro ? `<div><p style="font-size:0.65rem;color:var(--pc-muted);margin:0 0 2px;text-transform:uppercase">Forro</p><p style="font-size:0.82rem;color:var(--pc-text);margin:0;text-transform:uppercase">${esc(p.forro)}</p></div>` : ''}
            ${p.altura_tacon ? `<div><p style="font-size:0.65rem;color:var(--pc-muted);margin:0 0 2px;text-transform:uppercase">Tamaño de tacón</p><p style="font-size:0.82rem;color:var(--pc-text);margin:0">${esc(p.altura_tacon)} cm</p></div>` : ''}
            ${p.tipo_tacon ? `<div><p style="font-size:0.65rem;color:var(--pc-muted);margin:0 0 2px;text-transform:uppercase">Tipo de tacón</p><p style="font-size:0.82rem;color:var(--pc-text);margin:0;text-transform:uppercase">${esc(pcEtiquetaTipoTacon(p.tipo_tacon))}</p></div>` : ''}
            ${p.horma ? `<div><p style="font-size:0.65rem;color:var(--pc-muted);margin:0 0 2px;text-transform:uppercase">Horma</p><p style="font-size:0.82rem;color:var(--pc-text);margin:0;text-transform:uppercase">${esc(pcEtiquetaHorma(p.horma))}</p></div>` : ''}
          </div>` : ''}
        </div>` : ''}

      </div><!-- /scroll -->

      <!-- Resumen selección -->
      <div id="pc-modal-resumen" style="padding:0.75rem 1.5rem;border-bottom:1px solid var(--pc-border);display:none;flex-shrink:0"></div>

      <!-- Footer: botón confirmar -->
      <div id="pc-modal-footer" style="padding:1rem 1.5rem;display:flex;flex-direction:column;gap:8px;flex-shrink:0;border-top:1px solid var(--pc-border-2)">
        <button onclick="pcConfirmarModal('${prodId}')" id="pc-btn-confirmar" disabled
          style="width:100%;padding:14px;background:#E91E8C;color:white;border:none;border-radius:10px;font-family:inherit;font-size:1rem;font-weight:700;cursor:pointer;opacity:0.5">
          Selecciona al menos una talla
        </button>
        <button onclick="history.back(); setTimeout(() => pcIrA('carrito'), 50)"
          style="width:100%;padding:10px;background:transparent;color:var(--pc-muted);border:1px solid var(--pc-border-2);border-radius:10px;font-family:inherit;font-size:0.82rem;cursor:pointer">
          Ver pedido actual →
        </button>
      </div>
    </div>`

  document.body.appendChild(modal)
  modal.addEventListener('click', e => { if (e.target === modal) history.back() })
  window._pcSeleccion = { prodId, color: null }
  window._pcCorridaM = 1

  // Auto-seleccionar primer color
  if (colores.length) pcSeleccionarColor(prodId, colores[0])
}

// ── Helpers del modal de producto (port del POS) ──────────────────────────────

window.pcActualizarTabsModal = (prodId, color) => {
  const p = pc.productos.find(x => x.id === prodId)
  if (!p) return

  const container = document.getElementById('pc-mode-tabs-container')
  const tierContainer = document.getElementById('pc-tier-corr-container')

  const maxM = pcMaxCorridasDisponibles(prodId, color)
  const disponible = maxM >= 1

  if (tierContainer) {
    if (disponible && p.corrida_activa) {
      const pCorr = precioCorrida(p)
      const fmtP = n => '$' + Math.round(n).toLocaleString('es-MX')
      tierContainer.innerHTML = `
        <div style="flex:1;background:rgba(107,27,154,0.1);border:1px solid rgba(107,27,154,0.3);border-radius:9px;padding:6px 4px;text-align:center">
          <p style="font-size:0.6rem;color:var(--pc-purple);font-weight:700;text-transform:uppercase;margin:0 0 2px">Corrida c/u</p>
          <p style="font-size:0.92rem;font-weight:800;color:var(--pc-purple);margin:0">${fmtP(pCorr)}</p>
        </div>`
    } else {
      tierContainer.innerHTML = ''
    }
  }

  if (container) {
    if (p.corrida_activa && disponible) {
      const modo = window._pcModo || 'variado'
      container.innerHTML = `
        <div style="padding:12px 1.5rem 0">
          <div style="display:flex;gap:4px;background:var(--pc-bg-elev);border-radius:12px;padding:4px">
            <button id="pc-modo-variado" onclick="pcCambiarModo('${prodId}','variado')"
              style="flex:1;padding:8px;border:none;border-radius:9px;cursor:pointer;font-family:inherit;font-size:0.82rem;font-weight:700;background:${modo==='variado'?'#E91E8C':'transparent'};color:${modo==='variado'?'white':'var(--pc-muted)'};transition:all 0.15s">
              🧺 Variado
            </button>
            <button id="pc-modo-corrida" onclick="pcCambiarModo('${prodId}','corrida')"
              style="flex:1;padding:8px;border:none;border-radius:9px;cursor:pointer;font-family:inherit;font-size:0.82rem;font-weight:700;background:${modo==='corrida'?'#6a1b9a':'transparent'};color:${modo==='corrida'?'white':'var(--pc-purple)'};transition:all 0.15s">
              📦 Corrida
            </button>
          </div>
          <p id="pc-modo-hint" style="font-size:0.72rem;color:var(--pc-muted);margin:6px 0 0;line-height:1.4">
            ${modo === 'corrida' 
              ? 'Corrida completa: varias tallas del mismo color a precio de corrida. Ajusta la cantidad arriba.' 
              : 'Elige tallas sueltas — precio ajusta según total de pares en tu pedido.'}
          </p>
        </div>`
    } else {
      window._pcModo = 'variado'
      container.innerHTML = ''
    }
  }
}

window.pcCambiarModo = (prodId, modo) => {
  window._pcModo = modo
  const colorActivo = window._pcSeleccion?.color || (window._pcColores && window._pcColores[0])
  pcActualizarTabsModal(prodId, colorActivo)

  const footer = document.getElementById('pc-modal-footer')

  if (modo === 'corrida') {
    if (footer) footer.innerHTML = `
      <button onclick="pcConfirmarCorrida('${prodId}')" id="pc-btn-confirmar-corrida" disabled
        style="width:100%;padding:14px;background:#6a1b9a;color:white;border:none;border-radius:10px;font-family:inherit;font-size:1rem;font-weight:700;cursor:pointer;opacity:0.5">
        Agrega corridas
      </button>`
    if (colorActivo) { 
      _pcHighlightColor(colorActivo,'#6a1b9a','rgba(107,27,154,0.12)')
      pcRenderCorridaTallas(prodId, colorActivo)
      window._pcSeleccion.color = colorActivo 
    }
  } else {
    if (footer) footer.innerHTML = `
      <button onclick="pcConfirmarModal('${prodId}')" id="pc-btn-confirmar" disabled
        style="width:100%;padding:14px;background:#E91E8C;color:white;border:none;border-radius:10px;font-family:inherit;font-size:1rem;font-weight:700;cursor:pointer;opacity:0.5">
        Selecciona al menos una talla
      </button>`
    if (window._pcColores) {
      window._pcColores.forEach(c => {
        pcActualizarBadgeColor(prodId, c)
      })
    }
    if (colorActivo) pcSeleccionarColor(prodId, colorActivo)
  }
}

function _pcHighlightColor(color, border, bg) {
  document.querySelectorAll('[id^="pc-color-btn-"]').forEach(el => { el.style.borderColor='var(--pc-border-2)'; el.style.background='transparent' })
  const el = document.getElementById('pc-color-btn-' + color.replace(/\s/g,'_'))
  if (el) { el.style.borderColor = border; el.style.background = bg }
}

window.pcSeleccionarColor = (prodId, color) => {
  pcActualizarTabsModal(prodId, color)

  const p = pc.productos.find(x => x.id === prodId)
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
      const modelCode = p ? String(p.nombre || '').split(' ')[0] : ''
      strip.innerHTML = todasFotos.map((u, i) => `
        <img src="${esc(u)}" onclick="document.getElementById('pc-modal-img').src='${esc(u)}';document.querySelectorAll('#pc-modal-foto-strip img').forEach(el=>el.style.outline='none');this.style.outline='2px solid #E91E8C';abrirLightboxPC('${esc(u)}',window._pcFotosColorActual,'${esc(modelCode)}')"
          style="width:52px;height:52px;object-fit:cover;border-radius:8px;cursor:pointer;flex-shrink:0;outline:${i===0?'2px solid #E91E8C':'none'}">
      `).join('')
    }
  }

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

    const bufferColor = window._pcBuffer[color] || {}
    const panel = document.getElementById('pc-tallas-panel')
    if (panel) {
      panel.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
          <p style="font-size:0.75rem;color:var(--pc-muted);font-weight:600;margin:0;text-transform:uppercase">Tallas — ${esc(color)}</p>
          <p style="font-size:0.7rem;color:var(--pc-muted-2);margin:0">Toca para agregar</p>
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
                  style="width:100%;min-height:62px;border:2px solid ${qty>0?'#E91E8C':'var(--pc-border-2)'};background:${qty>0?'rgba(233,30,140,0.12)':'var(--pc-bg)'};border-radius:12px;cursor:${stock===0?'not-allowed':'pointer'};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-family:inherit;padding:8px 4px;${stock===0?'opacity:0.4':''}">
                  <span style="font-size:1rem;font-weight:800;color:${stock===0?'var(--pc-muted-2)':'var(--pc-text)'}">${esc(v.talla)}</span>
                  <span style="font-size:0.62rem;color:${stock===0?'var(--pc-muted-2)':'var(--pc-green)'}">${stock===0?'Agotado':'Disponible'}</span>
                </button>
                ${stock===0 ? `<button onclick="pcAvisameStock('${v.id}',this)" title="Avísame cuando haya stock" style="position:absolute;top:-7px;left:-7px;background:var(--pc-card);border:1.5px solid var(--pc-border-2);color:var(--pc-muted);border-radius:100px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:0.8rem;cursor:pointer;padding:0">🔔</button>` : ''}
                <span id="pc-chipbadge-${v.id}" style="position:absolute;top:-7px;right:-7px;background:#E91E8C;color:#fff;border-radius:100px;min-width:22px;height:22px;display:${qty>0?'flex':'none'};align-items:center;justify-content:center;font-size:0.75rem;font-weight:800;padding:0 5px;pointer-events:none">${qty}</span>
                <button id="pc-chipmenos-${v.id}"
                  onclick="pcTallaMenos('${v.id}','${prodId}','${esc(color)}')"
                  style="position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);background:var(--pc-bg);border:1.5px solid #E91E8C;color:#E91E8C;border-radius:100px;width:26px;height:26px;display:${qty>0?'flex':'none'};align-items:center;justify-content:center;font-size:1.1rem;font-weight:800;cursor:pointer;line-height:1;touch-action:manipulation">−</button>
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
  if (chip) { chip.style.borderColor = val>0?'#E91E8C':'var(--pc-border-2)'; chip.style.background = val>0?'rgba(233,30,140,0.12)':'var(--pc-bg)' }
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
      resumen.innerHTML = `<p style="font-size:0.75rem;font-weight:700;color:var(--pc-green);margin-bottom:6px">🛒 ${totalPares} pares seleccionados</p>
        <div style="display:flex;flex-wrap:wrap;gap:5px">
          ${lineas.map(l=>`<span style="background:var(--pc-bg-elev);border:1px solid var(--pc-border-2);border-radius:100px;padding:2px 10px;font-size:0.78rem;color:var(--pc-text-2)"><strong>${esc(l.color)}</strong> T${l.talla} ×${l.cantidad}</span>`).join('')}
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
  pcGuardarCarrito()
  // Antes esto cerraba el producto y regresaba al catálogo (history.back())
  // -- molesto para quien quiere agregar varias tallas del mismo modelo, porque
  // tenía que volver a abrir el producto cada vez. Ahora se queda en el mismo
  // producto (buffer limpio, listo para seguir eligiendo) y solo se avisa con
  // un toast que sí se agregó.
  pcMostrarExito(`✅ ${agregados > 1 ? agregados + ' tallas agregadas' : '1 talla agregada'} al carrito`)
  pcAbrirProducto(prodId)
}

// ── Corrida mode ──────────────────────────────────────────────────────────────
window.pcMaxCorridasDisponibles = (prodId, color) => {
  if (!color) return 0
  const vars = pc.variantes.filter(v => v.producto_id === prodId && v.color === color)
  if (!vars.length) return 0

  const tieneMedios = vars.some(v => v.talla && (v.talla.includes('.5') || v.talla.includes('½') || v.talla.includes('/')))

  let maxM = 0
  for (let M = 1; M <= 6; M++) {
    if (tieneMedios) {
      const uniqueSizesWithStock = vars.filter(v => {
        const stock = pc.inventario.filter(i => i.variante_id === v.id).reduce((s,x)=>s+(x.cantidad||0),0)
        return stock >= M
      })
      if (uniqueSizesWithStock.length >= 6) {
        maxM = M
        continue
      }
      let sumEffective = 0
      vars.forEach(v => {
        const stock = pc.inventario.filter(i => i.variante_id === v.id).reduce((s,x)=>s+(x.cantidad||0),0)
        sumEffective += Math.min(stock, 2 * M)
      })
      if (sumEffective >= 6 * M) {
        maxM = M
      } else {
        break
      }
    } else {
      let sumEffective = 0
      vars.forEach(v => {
        const stock = pc.inventario.filter(i => i.variante_id === v.id).reduce((s,x)=>s+(x.cantidad||0),0)
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

window.pcResolverItemsCorrida = (prodId, color, M) => {
  const vars = pc.variantes
    .filter(v => v.producto_id === prodId && v.color === color)
    .sort((a, b) => TALLAS_ORDEN.indexOf(a.talla) - TALLAS_ORDEN.indexOf(b.talla))

  const tieneMedios = vars.some(v => v.talla && (v.talla.includes('.5') || v.talla.includes('½') || v.talla.includes('/')))
  const qtyMap = {}

  if (tieneMedios) {
    const uniqueSizesWithStock = vars.filter(v => {
      const stock = pc.inventario.filter(i => i.variante_id === v.id).reduce((s,x)=>s+(x.cantidad||0),0)
      return stock >= M
    })
    if (uniqueSizesWithStock.length >= 6) {
      uniqueSizesWithStock.slice(0, 6).forEach(v => {
        qtyMap[v.id] = M
      })
      return qtyMap
    }
  }

  let totalNeeded = 6 * M
  for (const v of vars) {
    const stock = pc.inventario.filter(i => i.variante_id === v.id).reduce((s,x)=>s+(x.cantidad||0),0)
    const aTomar = Math.min(stock, 2 * M, totalNeeded)
    if (aTomar > 0) {
      qtyMap[v.id] = aTomar
      totalNeeded -= aTomar
    }
    if (totalNeeded <= 0) break
  }
  return qtyMap
}

window.__changePCCorridaM = (prodId, color, d) => {
  const maxM = pcMaxCorridasDisponibles(prodId, color)
  window._pcCorridaM = Math.min(maxM, Math.max(1, (window._pcCorridaM || 1) + d))
  pcRenderCorridaTallas(prodId, color)
}

window.pcRenderCorridaTallas = (prodId, color) => {
  const varsProd = pc.variantes.filter(v => v.producto_id === prodId && v.color === color)
    .sort((a,b) => TALLAS_ORDEN.indexOf(a.talla) - TALLAS_ORDEN.indexOf(b.talla))
  const panel = document.getElementById('pc-tallas-panel')
  if (!panel) return

  const maxM = pcMaxCorridasDisponibles(prodId, color)
  if (window._pcCorridaM === undefined || window._pcCorridaM > maxM || window._pcCorridaM < 1) {
    window._pcCorridaM = 1
  }

  panel.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px">
      <!-- Selector de cantidad de corridas -->
      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:none">
        <span style="font-weight:800;font-size:1.05rem;color:var(--pc-text)">Corridas a agregar</span>
        <div style="display:flex;align-items:center;gap:8px">
          <button onclick="window.__changePCCorridaM('${prodId}', '${esc(color)}', -1)"
            style="background:var(--pc-bg);border:1px solid var(--pc-border-2);color:var(--pc-text-2);border-radius:8px;width:38px;height:38px;cursor:pointer;font-size:1.2rem;font-weight:700">−</button>
          <span style="min-width:24px;text-align:center;font-weight:800;font-size:1.1rem;color:var(--pc-text)">${window._pcCorridaM}</span>
          <button onclick="window.__changePCCorridaM('${prodId}', '${esc(color)}', 1)"
            style="background:var(--pc-bg);border:1px solid var(--pc-border-2);color:var(--pc-text-2);border-radius:8px;width:38px;height:38px;cursor:pointer;font-size:1.2rem;font-weight:700">+</button>
        </div>
      </div>
      
      <div style="padding: 12px 16px; background: rgba(107,27,154,0.06); border-radius: 8px; color: var(--pc-purple); font-weight: 600; font-size: 0.9rem; text-align: center;">
        Cada corrida incluye 6 pares (sugeridos según stock disponible).
      </div>
    </div>`
  
  pcActualizarBadgesCorrida(prodId)
}

window.pcCorridaQty = () => {}

window.pcActualizarBadgesCorrida = (prodId) => {
  // Ocultar todos los badges de color primero en modo corrida para evitar confusión
  document.querySelectorAll('[id^="pc-color-badge-"]').forEach(b => {
    b.style.display = 'none'
  });

  const color = window._pcSeleccion?.color
  const resolvedQty = pcResolverItemsCorrida(prodId, color, window._pcCorridaM || 1)
  
  let total = Object.values(resolvedQty).reduce((s, x) => s + x, 0)
  
  const badge = document.getElementById('pc-color-badge-' + color.replace(/\s/g,'_'))
  if (badge) {
    if (total > 0) {
      badge.textContent = total + ' pares'
      badge.style.color = 'var(--pc-purple)'
      badge.style.display = 'block'
    } else {
      badge.style.display = 'none'
    }
  }

  const resumen = document.getElementById('pc-modal-resumen')
  const btn = document.getElementById('pc-btn-confirmar-corrida')
  if (total > 0) {
    if (resumen) {
      resumen.style.display = 'block'
      resumen.innerHTML = `<p style="font-size:0.75rem;font-weight:700;color:var(--pc-purple);margin:0">📦 CORRIDA — ${total} pares</p>`
    }
    if (btn) { 
      btn.textContent = `✅ Agregar ${window._pcCorridaM} ${window._pcCorridaM === 1 ? 'corrida' : 'corridas'} (${total} pares)`
      btn.disabled = false
      btn.style.opacity = '1' 
    }
  } else {
    if (resumen) resumen.style.display = 'none'
    if (btn) { btn.textContent = 'Agrega tallas a la corrida'; btn.disabled = true; btn.style.opacity = '0.5' }
  }
}

window.pcSugerirCorrida = () => {}

window.pcConfirmarCorrida = (prodId) => {
  const p = pc.productos.find(x => x.id === prodId)
  if (!p) return
  const color = window._pcSeleccion?.color
  const resolvedQty = pcResolverItemsCorrida(prodId, color, window._pcCorridaM || 1)
  let agregados = 0
  const precio = precioCorrida(p)
  
  Object.entries(resolvedQty).forEach(([varId, cantidad]) => {
    if (cantidad <= 0) return
    const v = pc.variantes.find(v => v.id === varId)
    if (!v) return
    const foto = v.foto_url || p.imagen_principal || null
    const existente = pc.carrito.find(i => i.variante_id === varId && i.es_corrida)
    if (existente) { existente.cantidad += cantidad }
    else pc.carrito.push({ producto_id: prodId, variante_id: varId, nombre: p.nombre, sku: p.sku_interno, imagen: foto, talla: v.talla, color: v.color, cantidad, precio_unitario: precio, es_corrida: true })
    agregados += cantidad
  })
  
  if (agregados === 0) { alert('Agrega al menos una talla'); return }
  history.back()
  window._pcCorridaCantidades = {}
  pcGuardarCarrito()
  renderCatalogo()
}

window.abrirLightboxPC = function(src, fotos, sku) {
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

  // Modo selección múltiple: para compartir varias fotos del mismo modelo
  // de un jalón, en vez de una por una.
  let modoSeleccion = false
  let seleccion = new Set()

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
    const numSel = seleccion.size
    lb.innerHTML = `
      <button onclick="history.back()" style="position:absolute;top:16px;right:16px;background:rgba(255,255,255,0.1);border:none;color:white;font-size:1.4rem;width:44px;height:44px;border-radius:50%;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center">✕</button>
      <button onclick="${numSel > 0 ? 'pcCompartirSeleccionLB()' : 'pcCompartirImagenLB()'}" title="${numSel > 0 ? 'Compartir ' + numSel + ' fotos' : 'Compartir esta foto'}" style="position:absolute;top:16px;left:16px;background:rgba(255,255,255,0.15);border:none;color:white;width:44px;height:44px;border-radius:50%;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
        ${numSel > 0 ? `<span style="position:absolute;top:-4px;right:-4px;background:#E91E8C;color:white;border-radius:100px;min-width:17px;height:17px;font-size:0.62rem;font-weight:800;display:flex;align-items:center;justify-content:center;padding:0 3px">${numSel}</span>` : ''}
      </button>
      <button onclick="pcDescargarImagenLB()" title="Descargar esta foto" style="position:absolute;top:16px;left:68px;background:rgba(255,255,255,0.15);border:none;color:white;width:44px;height:44px;border-radius:50%;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
      </button>
      ${total > 1 ? `<button onclick="pcToggleModoSeleccionLB()" title="${modoSeleccion ? 'Cerrar selección' : 'Seleccionar varias fotos'}" style="position:absolute;top:16px;left:120px;background:${modoSeleccion ? 'rgba(233,30,140,0.55)' : 'rgba(255,255,255,0.15)'};border:none;color:white;width:44px;height:44px;border-radius:50%;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="12" height="12" rx="2"/><path d="M8 21h9a2 2 0 0 0 2-2V8"/></svg>
      </button>` : ''}
      ${total > 1 ? `<button id="lb-prev" onclick="lbNav(-1)" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.12);border:none;color:white;font-size:1.6rem;width:44px;height:44px;border-radius:50%;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center;opacity:${idx===0?0.3:1}">‹</button>` : ''}
      <img id="lb-img" src="${fotos[idx]}" style="max-width:92vw;max-height:82vh;object-fit:contain;border-radius:10px;box-shadow:0 8px 40px rgba(0,0,0,0.8);user-select:none;-webkit-user-drag:none;cursor:zoom-in;transition:transform 0.1s ease-out">
      ${total > 1 ? `<button id="lb-next" onclick="lbNav(1)" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.12);border:none;color:white;font-size:1.6rem;width:44px;height:44px;border-radius:50%;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center;opacity:${idx===total-1?0.3:1}">›</button>` : ''}
      ${modoSeleccion
        ? `<div style="display:flex;gap:8px;margin-top:16px;z-index:2;max-width:92vw;overflow-x:auto;padding:4px 2px">${fotos.map((f,i)=>`
            <div onclick="pcToggleSeleccionFotoLB(${i})" style="position:relative;flex-shrink:0;cursor:pointer">
              <img src="${f}" style="width:52px;height:52px;object-fit:cover;border-radius:8px;border:2px solid ${seleccion.has(i) ? '#E91E8C' : 'rgba(255,255,255,0.3)'};opacity:${seleccion.has(i) ? 1 : 0.55}">
              ${seleccion.has(i) ? `<span style="position:absolute;top:-5px;right:-5px;background:#E91E8C;color:white;border-radius:50%;width:18px;height:18px;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:800;border:2px solid rgba(0,0,0,0.9)">✓</span>` : ''}
            </div>`).join('')}</div>
           <p style="color:rgba(255,255,255,0.6);font-size:0.72rem;margin:8px 0 0;z-index:2">Toca las fotos que quieres compartir</p>`
        : (total > 1 ? `<div style="display:flex;gap:6px;margin-top:14px;z-index:2">${fotos.map((_,i)=>`<div onclick="lbGoto(${i})" style="width:${i===idx?'22px':'8px'};height:8px;border-radius:4px;background:${i===idx?'#E91E8C':'rgba(255,255,255,0.3)'};cursor:pointer;transition:all 0.2s"></div>`).join('')}</div>` : '')
      }
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
      if (e?.name !== 'AbortError' && typeof pcMostrarExito === 'function') pcMostrarExito('No se pudo compartir la imagen')
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
      if (typeof pcMostrarExito === 'function') pcMostrarExito('Imagen descargada')
    } catch (e) {
      window.open(url, '_blank')
    }
  }

  window.pcToggleModoSeleccionLB = () => {
    modoSeleccion = !modoSeleccion
    if (modoSeleccion) seleccion.add(idx) // arranca con la foto que ya estabas viendo
    else seleccion.clear()
    render()
    addGestures()
  }

  window.pcToggleSeleccionFotoLB = (i) => {
    if (seleccion.has(i)) seleccion.delete(i)
    else seleccion.add(i)
    render()
    addGestures()
  }

  window.pcCompartirSeleccionLB = async () => {
    const urls = [...seleccion].sort((a, b) => a - b).map(i => fotos[i])
    if (!urls.length) return
    try {
      const files = []
      for (const url of urls) {
        const resp = await fetch(url)
        const blob = await resp.blob()
        const ext = (blob.type.split('/')[1] || 'jpg').replace('jpeg', 'jpg')
        files.push(new File([blob], `zapatillasmay-${Date.now()}-${files.length}.${ext}`, { type: blob.type }))
      }
      if (navigator.canShare && navigator.canShare({ files })) {
        await navigator.share({ files, title: 'Zapatillas May' })
      } else if (navigator.share) {
        await navigator.share({ url: urls[0] })
      } else {
        for (const f of files) {
          const a = document.createElement('a')
          a.href = URL.createObjectURL(f)
          a.download = f.name
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          await new Promise(r => setTimeout(r, 300))
        }
        if (typeof pcMostrarExito === 'function') pcMostrarExito(`${files.length} fotos descargadas`)
      }
    } catch (e) {
      if (e?.name !== 'AbortError' && typeof pcMostrarExito === 'function') pcMostrarExito('No se pudo compartir las fotos')
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
          // Doble tap: alternar zoom
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

    // Zoom con rueda de mouse (Escritorio)
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

    // Pan con arrastre de mouse (Escritorio)
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


function pcGuardarCarrito(inmediato) {
  try { localStorage.setItem(PC_CARRITO_KEY, JSON.stringify(pc.carrito)) } catch {}
  // Quitar un par debe reflejarse en el servidor YA -- si se deja en el debounce
  // normal (1.5s) y el cliente recarga antes de que corra, el borrador del
  // servidor sigue con el item viejo y pcRestaurarCarritoDeServidor lo revive.
  if (inmediato) {
    clearTimeout(_pcSyncTimer)
    pcSincronizarCarritoServidor().catch(() => {})
  } else {
    pcSincronizarCarritoServidorDebounced()
  }
  if (typeof pcActualizarBadgeCarritoTopbar === 'function') {
    pcActualizarBadgeCarritoTopbar()
  }
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

let _pcSyncEnCurso = false
let _pcSyncPendiente = false
async function pcSincronizarCarritoServidor() {
  if (!pc.sesion?.cliente_id) return
  // Evitar sincronizaciones superpuestas: esta función borra TODOS los items
  // del borrador y los vuelve a crear uno por uno, así que si se ejecutara dos
  // veces en paralelo (o si el poll de 8s lee el borrador justo a medio borrar/
  // recrear) el carrito parpadea -- items que "se agregan y quitan solos".
  if (_pcSyncEnCurso) { _pcSyncPendiente = true; return }
  _pcSyncEnCurso = true
  try {
    await _pcSincronizarCarritoServidorReal()
  } finally {
    _pcSyncEnCurso = false
    if (_pcSyncPendiente) { _pcSyncPendiente = false; pcSincronizarCarritoServidorDebounced() }
  }
}

function _pcMarcarSincronizado() {
  // Snapshot de "esto es lo que el servidor de verdad tiene ahora" -- ver
  // PC_CARRITO_SYNCED_KEY arriba.
  try { localStorage.setItem(PC_CARRITO_SYNCED_KEY, JSON.stringify(pc.carrito)) } catch {}
}

async function _pcSincronizarCarritoServidorReal() {
  if (!pc.carrito.length) {
    // Carrito vacío: cancelar el borrador del servidor si había uno, para no
    // dejar un borrador viejo con items que ya no están.
    if (pc._borradorServerId) {
      const idViejo = pc._borradorServerId
      pc._borradorServerId = null
      try {
        const res = await fetch(`${PC_API}/pedidos/${idViejo}/cancelar`, { method: 'POST' })
        if (res.ok) _pcMarcarSincronizado()
      } catch (e) { /* si falla, PC_CARRITO_SYNCED_KEY se queda vieja y el próximo restore reintenta */ }
    } else {
      _pcMarcarSincronizado()
    }
    return
  }
  let pedidoId = pc._borradorServerId
  if (!pedidoId) {
    // OJO: "/pedidos" SIN diagonal final -- FastAPI redirige (307) a "/pedidos/",
    // y esa redirección sale del proxy /api de Vercel directo al dominio de
    // Railway, que el navegador bloquea por CORS ("Failed to fetch"), sin
    // ningún error visible más que el catch silencioso de quien llama esta
    // función. Este es el bug real detrás de "el carrito no sincroniza entre
    // dispositivos": el POST para respaldar el carrito en el servidor nunca
    // llegaba a completarse.
    const res = await fetch(`${PC_API}/pedidos/`, {
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
    let huboError = false
    const actuales = await fetch(`${PC_API}/pedidos/${pedidoId}/items`).then(r => r.ok ? r.json() : [])
    // Los ítems ya apartados (reservado=true) o con una solicitud de apartado
    // pendiente (solicitud_apartar=true) NUNCA se tocan aquí -- ni se borran
    // ni se vuelven a crear. Borrarlos y recrearlos en cada sync perdería la
    // reserva de stock o la bandera de "esperando aprobación".
    for (const it of (Array.isArray(actuales) ? actuales : [])) {
      if (it.reservado || it.solicitud_apartar) continue
      const r = await fetch(`${PC_API}/pedidos/${pedidoId}/items/${it.id}`, { method: 'DELETE' }).catch(() => null)
      if (!r || !r.ok) huboError = true
    }
    for (const item of pc.carrito) {
      if (item.reservado || item.solicitud_apartar) continue  // ya existe en el servidor, no duplicar
      const r = await fetch(`${PC_API}/pedidos/${pedidoId}/items`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variante_id: item.variante_id, cantidad: item.cantidad, precio_unitario: item.precio_unitario,
          subtotal: item.cantidad * item.precio_unitario, nombre: item.nombre, color: item.color,
          talla: item.talla, es_corrida: !!item.es_corrida,
        })
      }).catch(() => null)
      if (!r || !r.ok) huboError = true
    }
    const total = pc.carrito.reduce((s, i) => s + i.cantidad * i.precio_unitario, 0)
    const rTotal = await fetch(`${PC_API}/pedidos/${pedidoId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ total })
    }).catch(() => null)
    if (!rTotal || !rTotal.ok) huboError = true
    // Solo se marca "confirmado con el servidor" si TODO salió bien -- si algo
    // falló (404/500/red caída), se deja la marca vieja para que el próximo
    // restore/poll detecte la diferencia y reintente el envío en vez de
    // asumir que el servidor ya tiene el estado correcto.
    if (!huboError) _pcMarcarSincronizado()
  } catch (e) { /* silencioso -- el carrito local sigue funcionando aunque falle el respaldo */ }
}

// Restaura el carrito desde el borrador del servidor cuando el local está
// vacío (ej. sesión nueva en otro dispositivo). `pedidosCrudos` es la
// respuesta SIN filtrar de /auth/pedidos/{cliente_id} (incluye borradores).
async function pcRestaurarCarritoDeServidor(pedidosCrudos) {
  // OJO: debe filtrar por status='borrador' o 'apartado' -- son los dos
  // estados en los que ese pedido sigue siendo "el carrito en vivo" (ver
  // cerrar-apartado: solo al cerrarse de verdad se le quita la marca y dejan
  // de contar). Si se restringe solo a 'borrador', en cuanto se aprueba un
  // apartado esta función deja de encontrarlo -- el carrito se ve vacío al
  // recargar aunque en el servidor sigan los pares (aprobados y sin aprobar).
  // Tampoco debe encontrar un carrito-respaldo viejo ya liberado/cancelado
  // (status='cancelado'): si solo se buscara por la marca de texto, ese
  // carrito muerto se seguiría reusando para siempre.
  const borrador = (Array.isArray(pedidosCrudos) ? pedidosCrudos : [])
    .find(p => p.notas === PC_BORRADOR_MARCA && (p.status === 'borrador' || p.status === 'apartado'))
  if (!borrador) return
  pc._borradorServerId = borrador.id

  // Si el carrito local (cargado de localStorage al iniciar, ANTES de esta
  // función) no coincide con el último snapshot confirmado como sincronizado,
  // hay un cambio local (ej. un "quitar") que el servidor todavía no confirmó
  // -- pisar con lo que diga el servidor en ese momento revivirla justo lo que
  // el cliente acaba de borrar. En ese caso se respeta lo local y se reintenta
  // empujarlo al servidor, en vez de leerlo de vuelta.
  let ultimoSincronizado = null
  try { ultimoSincronizado = localStorage.getItem(PC_CARRITO_SYNCED_KEY) } catch {}
  if (ultimoSincronizado !== null && ultimoSincronizado !== JSON.stringify(pc.carrito)) {
    pcSincronizarCarritoServidorDebounced()
    return
  }

  const items = borrador.pedido_items || []
  // El borrador del servidor es la fuente de verdad del carrito: así, si la
  // asesora arma/edita el carrito del cliente desde el panel de administración,
  // al cliente le aparece al entrar (y viceversa, porque el portal ya respalda
  // sus cambios en este mismo borrador). Solo se conserva el carrito local si
  // el del servidor está vacío -- para no borrar algo que el cliente acaba de
  // agregar y que aún no se sincronizó.
  if (!items.length) return
  const delServidor = []
  items.forEach(i => {
    const v = i.variantes
    if (!v || !v.id) return
    const prod = pc.productos.find(x => x.id === v.producto_id)
    delServidor.push({
      id: i.id, producto_id: v.producto_id, variante_id: v.id, nombre: v.productos?.nombre || i.nombre || 'Producto',
      sku: prod?.sku_interno || null, imagen: v.foto_url || v.productos?.imagen_principal || null,
      talla: v.talla || i.talla, color: v.color || i.color, cantidad: i.cantidad,
      precio_unitario: i.precio_unitario || 0, es_corrida: !!i.es_corrida,
      reservado: !!i.reservado, solicitud_liberar: !!i.solicitud_liberar, solicitud_apartar: !!i.solicitud_apartar,
    })
  })
  if (!delServidor.length) return
  pc.carrito = delServidor
  try { localStorage.setItem(PC_CARRITO_KEY, JSON.stringify(pc.carrito)) } catch {}
  _pcMarcarSincronizado()
  if (typeof pcActualizarBadgeCarritoTopbar === 'function') pcActualizarBadgeCarritoTopbar()
}

// ── Carrito en vivo ───────────────────────────────────────────
// Mismo mecanismo que el lado panel (ver _iniciarPollCarritoActivo en
// panel.js): sin WebSockets, solo refresca mientras la pestaña "Carrito" está
// abierta -- cada pocos segundos y al instante si el cliente vuelve a esta
// pestaña del navegador -- así ve reflejado lo que la asesora le agregue
// desde el panel de administración.
function pcDetenerPollCarrito() {
  if (window._pcCarritoPollInterval) { clearInterval(window._pcCarritoPollInterval); window._pcCarritoPollInterval = null }
  if (window._pcCarritoPollFocusHandler) { window.removeEventListener('focus', window._pcCarritoPollFocusHandler); window._pcCarritoPollFocusHandler = null }
}

function pcIniciarPollCarrito() {
  pcDetenerPollCarrito()
  const refrescar = () => pcRefrescarCarritoSiCambio()
  window._pcCarritoPollInterval = setInterval(refrescar, 8000)
  window._pcCarritoPollFocusHandler = refrescar
  window.addEventListener('focus', window._pcCarritoPollFocusHandler)
}

async function pcRefrescarCarritoSiCambio() {
  if (pc.tab !== 'carrito' || !pc.sesion?.cliente_id) { pcDetenerPollCarrito(); return }
  // No interrumpir si el cliente está escribiendo/editando algo en la pantalla
  const activo = document.activeElement
  if (activo && (activo.tagName === 'INPUT' || activo.tagName === 'TEXTAREA')) return
  // No leer el borrador mientras se está sincronizando (borrado+recreado de items):
  // se vería a medio transicionar y ese estado parcial se pintaría como real.
  if (_pcSyncEnCurso) return
  try {
    const resPoll = await fetch(`${PC_API}/auth/pedidos/${pc.sesion.cliente_id}`, { headers: pcAuthHeaders() })
    if (resPoll.status === 401 || resPoll.status === 403) { pcDetenerPollCarrito(); pcForzarRelogin(); return }
    const ped = resPoll.ok ? await resPoll.json() : null
    // Mismo criterio que en pcRestaurarCarritoDeServidor: borrador Y apartado
    // cuentan como "el carrito en vivo" (ver el comentario ahí).
    const borrador = (Array.isArray(ped) ? ped : []).find(p => p.notas === PC_BORRADOR_MARCA && (p.status === 'borrador' || p.status === 'apartado'))
    const itemsServidor = borrador?.pedido_items || []
    const antes = JSON.stringify(pc.carrito.map(i => [i.variante_id, i.cantidad, i.precio_unitario, !!i.reservado, !!i.solicitud_liberar, !!i.solicitud_apartar]))
    const despues = JSON.stringify(itemsServidor.map(i => [i.variantes?.id, i.cantidad, i.precio_unitario, !!i.reservado, !!i.solicitud_liberar, !!i.solicitud_apartar]))
    if (antes === despues) return  // sin cambios, no tocar el DOM
    // Si lo local todavía no se confirmó sincronizado (ej. un "quitar" reciente
    // cuyo DELETE al servidor sigue en camino), no hay que pisarlo con el
    // estado -viejo- que este poll acaba de leer -- solo reintentar el envío.
    let ultimoSincronizado = null
    try { ultimoSincronizado = localStorage.getItem(PC_CARRITO_SYNCED_KEY) } catch {}
    if (ultimoSincronizado !== null && ultimoSincronizado !== JSON.stringify(pc.carrito)) {
      pcSincronizarCarritoServidorDebounced()
      return
    }
    pc._borradorServerId = borrador?.id || null
    pc.carrito = itemsServidor.map(i => {
      const v = i.variantes
      const prod = pc.productos.find(x => x.id === v?.producto_id)
      return {
        id: i.id, producto_id: v?.producto_id, variante_id: v?.id, nombre: v?.productos?.nombre || i.nombre || 'Producto',
        sku: prod?.sku_interno || null, imagen: v?.foto_url || v?.productos?.imagen_principal || null,
        talla: v?.talla || i.talla, color: v?.color || i.color, cantidad: i.cantidad,
        precio_unitario: i.precio_unitario || 0, es_corrida: !!i.es_corrida,
        reservado: !!i.reservado, solicitud_liberar: !!i.solicitud_liberar, solicitud_apartar: !!i.solicitud_apartar,
      }
    })
    try { localStorage.setItem(PC_CARRITO_KEY, JSON.stringify(pc.carrito)) } catch {}
    _pcMarcarSincronizado()
    if (typeof pcActualizarBadgeCarritoTopbar === 'function') pcActualizarBadgeCarritoTopbar()
    if (pc.tab === 'carrito') renderCarrito()
  } catch (e) { /* silencioso -- se reintenta en el siguiente ciclo */ }
}

// ── CARRITO / HACER PEDIDO ───────────────────────────────────
function renderCarrito(el) {
  el = el || document.getElementById('pc-content')
  if (!el) return
  // Recalcular precios desde datos vivos (corrige $0 de localStorage)
  if (pc.productos.length > 0) {
    const totalPares = pc.carrito.reduce((s, i) => s + i.cantidad, 0)
    // OJO: solo guardar/sincronizar si algún precio realmente cambió. Antes
    // esto llamaba a pcGuardarCarrito() en CADA render -- incluyendo los
    // renders que dispara el poll de 8s al traer el carrito del servidor --
    // lo que disparaba una resincronización (borra+recrea todos los items)
    // sin que el cliente hubiera hecho nada. Eso hacía que el poll de OTRO
    // dispositivo pudiera leer el borrador a medio transicionar y lo pintara
    // como real: pares que "se agregan y quitan solos".
    let huboCambioPrecio = false
    pc.carrito.forEach(item => {
      const p = pc.productos.find(x => x.id === item.producto_id)
      if (!p) return
      const nuevo = item.es_corrida ? precioCorrida(p) : (totalPares >= 6 ? precioM6(p) : precioM3(p))
      if (nuevo !== item.precio_unitario) { item.precio_unitario = nuevo; huboCambioPrecio = true }
    })
    if (huboCambioPrecio) pcGuardarCarrito()
  }
  const total = pc.carrito.reduce((s, i) => s + (i.precio_unitario * i.cantidad), 0)
  const totalPares = pc.carrito.reduce((s, i) => s + i.cantidad, 0)
  const credito = parseFloat(pc.clienteData?.credito_disponible || 0)

  if (pc.carrito.length === 0) {
    el.innerHTML = `
      <div style="text-align:center;padding:60px 20px">
        <p style="font-size:3rem;margin:0 0 16px">🛒</p>
        <p style="font-size:1rem;font-weight:700;color:var(--pc-text-3);margin:0 0 8px">Tu pedido está vacío</p>
        <p style="color:var(--pc-muted);font-size:0.83rem;margin:0 0 24px">Agrega productos desde el catálogo</p>
        <button onclick="pcIrA('catalogo')" class="pc-btn pc-btn-primary">Ver catálogo</button>
      </div>`
    return
  }

  el.innerHTML = `
    <div style="margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div>
        <h1 style="font-size:1.4rem;font-weight:800;color:var(--pc-text);margin:0 0 4px">Carrito</h1>
        <p style="font-size:0.83rem;color:var(--pc-muted);margin:0">${totalPares} par${totalPares !== 1 ? 'es' : ''} · ${money(total)}</p>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${pc.carrito.length > 0 ? `
        <button onclick="pcIrA('catalogo')" class="pc-btn pc-btn-secondary" style="font-size:0.78rem">📋 Ver catálogo</button>` : ''}
      </div>
    </div>

    <div class="pc-cart-layout" style="display:grid;grid-template-columns:1fr 340px;gap:20px;align-items:start">

      <!-- Items del carrito -->
      <div>
        ${(() => {
          const apartados = pc.carrito.filter(i => i.reservado)
          const paresApartados = apartados.reduce((s,i)=>s+i.cantidad, 0)
          const totalApartado = apartados.reduce((s,i)=>s+i.cantidad*i.precio_unitario, 0)
          if (!paresApartados) return ''
          return `<button onclick="pcIrA('apartados')" class="pc-card" style="display:flex;align-items:center;justify-content:space-between;width:100%;text-align:left;border:1px solid #fde68a;background:#fffbeb;padding:14px 16px;margin-bottom:14px;cursor:pointer">
            <span style="font-size:0.88rem;font-weight:700;color:#92400e">🔒 ${paresApartados} par${paresApartados!==1?'es':''} apartado${paresApartados!==1?'s':''} · ${money(totalApartado)}</span>
            <span style="font-size:0.78rem;color:#b45309;font-weight:700">Ver detalle →</span>
          </button>`
        })()}
        ${pc.carrito.filter(i=>!i.reservado).length === 0 ? '' : (() => {
          const normales = pc.carrito.filter(i => !i.es_corrida && !i.reservado)
          const corridas = pc.carrito.filter(i => i.es_corrida && !i.reservado)
          // Agrupar corridas por producto+color
          const corridasAgrupadas = {}
          corridas.forEach(i => {
            const key = i.producto_id + '|' + i.color
            if (!corridasAgrupadas[key]) corridasAgrupadas[key] = { nombre: i.nombre, sku: i.sku, color: i.color, producto_id: i.producto_id, imagen: i.imagen || null, tallas: [], subtotal: 0, precio_unitario: i.precio_unitario, pendiente: i.solicitud_apartar }
            corridasAgrupadas[key].tallas.push({ talla: i.talla, cantidad: i.cantidad, variante_id: i.variante_id })
            corridasAgrupadas[key].subtotal += i.cantidad * i.precio_unitario
          })
          const modoSel = !!pc._seleccionApartadoActivo
          const sel = pc._seleccionApartado || new Set()
          return `<div class="pc-card" style="margin-bottom:16px">
          ${normales.map((item) => {
            const idx = pc.carrito.indexOf(item)
            const pendienteLiberar = item.reservado && item.solicitud_liberar
            const pendienteApartar = !item.reservado && item.solicitud_apartar
            const seleccionable = modoSel && !pendienteApartar
            const marcado = sel.has(item.variante_id)
            return `<div style="display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--pc-border);${pendienteLiberar || pendienteApartar ? 'opacity:0.55' : ''}">
              ${seleccionable ? `<input type="checkbox" onchange="pcToggleSeleccionApartado('${item.variante_id}')" ${marcado?'checked':''} style="width:20px;height:20px;accent-color:#E91E8C;cursor:pointer;flex-shrink:0">` : ''}
              ${item.imagen ? `<img src="${esc(item.imagen)}" onclick="pcAbrirProducto('${item.producto_id}')" title="Ver producto / agregar más pares" style="width:60px;height:60px;object-fit:cover;border-radius:8px;background:var(--pc-bg-elev);flex-shrink:0;cursor:pointer">` : `<div onclick="pcAbrirProducto('${item.producto_id}')" style="width:60px;height:60px;background:var(--pc-bg-elev);border-radius:8px;flex-shrink:0;cursor:pointer"></div>`}
              <div style="flex:1;min-width:0">
                <p style="font-size:0.95rem;font-weight:800;color:var(--pc-text);margin:0 0 4px">${esc(String(item.nombre || '').split(' ')[0])}</p>
                <p style="font-size:0.78rem;color:var(--pc-text-4);margin:0">Talla ${esc(item.talla)} ${item.color ? '· '+esc(item.color) : ''} · ${item.cantidad} par${item.cantidad !== 1 ? 'es' : ''}</p>
                ${pendienteLiberar ? `<p style="font-size:0.72rem;color:#f59e0b;font-weight:700;margin:2px 0 0">Solicitud de liberación enviada — esperando aprobación</p>` : ''}
                ${pendienteApartar ? `<p style="font-size:0.72rem;color:#f59e0b;font-weight:700;margin:2px 0 0">🙋 Pidiendo apartar — esperando aprobación</p>` : ''}
              </div>
              <div style="text-align:right;flex-shrink:0">
                <p style="font-weight:700;color:var(--pc-text);margin:0 0 4px">${money(item.precio_unitario * item.cantidad)}</p>
                <p style="font-size:0.72rem;color:var(--pc-muted);margin:0">${money(item.precio_unitario)} c/u</p>
                ${pendienteLiberar || pendienteApartar || modoSel ? '' : `<button onclick="pcQuitarDelCarrito(${idx})" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:0.72rem;padding:2px 0;margin-top:4px">✕ quitar</button>`}
              </div>
            </div>`
          }).join('')}
          ${Object.entries(corridasAgrupadas).map(([key, corrida]) => {
            const pendienteApartar = corrida.pendiente
            const seleccionable = modoSel && !pendienteApartar
            const marcado = sel.has('corrida:'+key)
            return `
          <div style="padding:12px 0;border-bottom:1px solid var(--pc-border);background:rgba(107,27,154,0.06);border-radius:8px;padding:12px;margin-bottom:4px;${pendienteApartar ? 'opacity:0.55' : ''}">
            <div style="display:flex;gap:10px;align-items:flex-start">
              ${seleccionable ? `<input type="checkbox" onchange="pcToggleSeleccionApartado('corrida:${key}')" ${marcado?'checked':''} style="width:20px;height:20px;accent-color:#E91E8C;cursor:pointer;flex-shrink:0;margin-top:4px">` : ''}
              ${corrida.imagen ? `<img src="${esc(corrida.imagen)}" onclick="pcAbrirProducto('${corrida.producto_id}')" title="Ver producto / agregar más pares" style="width:52px;height:52px;object-fit:cover;border-radius:8px;background:var(--pc-bg-elev);flex-shrink:0;cursor:pointer">` : `<div onclick="pcAbrirProducto('${corrida.producto_id}')" style="width:52px;height:52px;background:var(--pc-bg-elev);border-radius:8px;flex-shrink:0;cursor:pointer"></div>`}
              <div style="flex:1;min-width:0">
                <div style="display:flex;justify-content:space-between;align-items:flex-start">
                  <div style="flex:1;min-width:0">
                    <p style="font-size:0.95rem;font-weight:800;color:var(--pc-text);margin:0 0 4px">${esc(String(corrida.nombre || '').split(' ')[0])}</p>
                    <p style="font-size:0.75rem;color:#a855f7;font-weight:600;margin:0 0 6px">📦 Corrida · ${esc(corrida.color)}</p>
                    ${pendienteApartar ? `<p style="font-size:0.72rem;color:#f59e0b;font-weight:700;margin:0 0 6px">🙋 Pidiendo apartar — esperando aprobación</p>` : ''}
                  </div>
                  ${pendienteApartar || modoSel ? '' : `<button onclick="pcQuitarCorrida('${key}')" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:1rem;padding:0 4px;flex-shrink:0">✕</button>`}
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
                  <span style="font-size:0.75rem;color:var(--pc-text-4)">${money(corrida.precio_unitario)} c/u</span>
                  <div style="display:flex;align-items:center;gap:6px">
                    <button onclick="window.__pcQtyGrupoCorrida('${corrida.producto_id}','${esc(corrida.color)}',-1)"
                      style="background:var(--pc-bg);border:1px solid var(--pc-border-2);color:var(--pc-text-2);border-radius:8px;width:30px;height:30px;cursor:pointer;font-size:1.1rem;font-weight:700">−</button>
                    <span style="min-width:20px;text-align:center;font-weight:800;color:var(--pc-text)">${corrida.tallas.reduce((s,t)=>s+t.cantidad,0)}</span>
                    <button onclick="window.__pcQtyGrupoCorrida('${corrida.producto_id}','${esc(corrida.color)}',1)"
                      style="background:var(--pc-bg);border:1px solid var(--pc-border-2);color:var(--pc-text-2);border-radius:8px;width:30px;height:30px;cursor:pointer;font-size:1.1rem;font-weight:700">+</button>
                  </div>
                  <span style="font-weight:700;color:#a855f7">${money(corrida.subtotal)}</span>
                </div>
              </div>
            </div>
          </div>`}).join('')}
        </div>`
        })()}
        ${pc._seleccionApartadoActivo && (pc._seleccionApartado?.size || 0) > 0 ? `
        <div style="position:sticky;bottom:12px;background:#0f172a;border-radius:12px;padding:14px 18px;display:flex;justify-content:space-between;align-items:center;gap:12px;box-shadow:0 8px 24px rgba(0,0,0,0.25)">
          <span style="color:white;font-weight:700;font-size:0.85rem">${pc._seleccionApartado.size} seleccionado${pc._seleccionApartado.size!==1?'s':''}</span>
          <button onclick="pcEnviarParaApartar()" class="pc-btn pc-btn-primary" style="font-size:0.85rem">🔒 Enviar para apartar</button>
        </div>` : ''}
      </div>

      <!-- Resumen del pedido -->
      ${pc.carrito.length > 0 ? `
      <div class="pc-card pc-cart-summary" style="position:sticky;top:20px">
        <p style="font-weight:700;color:var(--pc-text);margin:0 0 16px">Resumen</p>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <span style="color:var(--pc-text-4);font-size:0.83rem">${totalPares} pares</span>
          <span style="color:var(--pc-text);font-size:0.83rem">${money(total)}</span>
        </div>
        ${credito > 0 ? `
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <span style="color:#10b981;font-size:0.83rem">Crédito</span>
          <span style="color:#10b981;font-size:0.83rem">-${money(credito)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:16px;padding-top:8px;border-top:1px solid var(--pc-border)">
          <span style="font-weight:700;color:var(--pc-text)">Total</span>
          <span style="font-weight:700;color:#E91E8C">${money(Math.max(0, total - credito))}</span>
        </div>` : `
        <div style="display:flex;justify-content:space-between;margin-bottom:16px;padding-top:8px;border-top:1px solid var(--pc-border)">
          <span style="font-weight:700;color:var(--pc-text)">Total</span>
          <span style="font-weight:700;color:#E91E8C">${money(total)}</span>
        </div>`}
        ${(() => {
          const dir = (pc.clienteData?.direccion || '').trim()
          if (dir) {
            return `<div style="margin-bottom:12px;padding:10px 12px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);border-radius:8px">
              <p style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#10b981;margin:0 0 4px">📍 Se envía a</p>
              <p style="font-size:0.8rem;color:var(--pc-text-2);margin:0">${esc(dir)}${pc.clienteData?.codigo_postal ? ', CP '+esc(pc.clienteData.codigo_postal) : ''}${pc.clienteData?.ciudad ? ', '+esc(pc.clienteData.ciudad) : ''}</p>
              <button onclick="pcIrA('cuenta')" style="background:none;border:none;color:var(--pc-muted);font-size:0.72rem;cursor:pointer;padding:4px 0 0;text-decoration:underline">Cambiar dirección</button>
            </div>`
          }
          return `<div style="margin-bottom:12px;padding:10px 12px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.25);border-radius:8px">
            <p style="font-size:0.8rem;color:#f87171;font-weight:600;margin:0 0 4px">⚠️ Falta tu dirección de envío</p>
            <button onclick="pcIrA('cuenta')" class="pc-btn pc-btn-secondary" style="font-size:0.78rem;padding:6px 12px">Agregar dirección</button>
          </div>`
        })()}
        <div style="margin-bottom:12px">
          <label style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--pc-muted);display:block;margin-bottom:6px">Notas del pedido</label>
          <textarea id="pc-notas" class="pc-input" style="height:70px;resize:none" placeholder="Color específico, urgencia, instrucciones..."></textarea>
        </div>
        <button onclick="pcToggleModoSeleccionApartado()" class="pc-btn ${pc._seleccionApartadoActivo ? 'pc-btn-secondary' : 'pc-btn-primary'}" style="width:100%;margin-bottom:8px">
          ${pc._seleccionApartadoActivo ? 'Cancelar selección' : '🔒 Apartar pares específicos'}
        </button>
        ${totalPares < 3 ? `
        <p style="font-size:0.75rem;color:var(--pc-muted);margin:0 0 8px;text-align:center">Pedido mínimo para cerrar: 3 pares (llevas ${totalPares})</p>` : ''}
        <div style="display:flex;gap:8px">
          <button onclick="pcCerrarPedidoDirecto()" class="pc-btn pc-btn-secondary" style="flex:1;font-size:0.78rem" ${totalPares < 3 ? 'disabled title="Pedido mínimo: 3 pares"' : ''}>
            Cerrar pedido
          </button>
          <button onclick="if(confirm('¿Vaciar el carrito?'))pcVaciarCarrito()" class="pc-btn pc-btn-secondary" style="flex:1;font-size:0.78rem">
            Vaciar carrito
          </button>
        </div>
        <p id="pc-pedido-err" style="color:#ef4444;font-size:0.78rem;margin-top:8px;display:none"></p>
        <div id="pc-pago-directo-modal"></div>
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

// Un par ya apartado (reservado=true) no se puede quitar directo -- el stock
// ya se descontó al aprobarlo. En vez de borrarlo, se manda una solicitud de
// liberación: el par se queda en el carrito (marcado como "pendiente") hasta
// que la asesora la apruebe o la niegue desde el panel.
window.pcSolicitarLiberacion = async function(item) {
  if (!item || item.solicitud_liberar) return
  item.solicitud_liberar = true
  renderCarrito()
  if (item.id && pc._borradorServerId) {
    try {
      await fetch(`${PC_API}/pedidos/${pc._borradorServerId}/items/${item.id}/solicitar-liberacion`, { method: 'POST' })
    } catch (e) { /* se reintenta solo en el próximo poll si el servidor no quedó marcado */ }
  }
}

window.pcQuitarDelCarrito = function(idx) {
  const item = pc.carrito[idx]
  if (item && item.reservado) { pcSolicitarLiberacion(item); return }
  pc.carrito.splice(idx, 1)
  pcGuardarCarrito(true)
  renderCarrito()
}

window.pcQuitarCorrida = function(key) {
  const [productoId, color] = key.split('|')
  const delGrupo = pc.carrito.filter(i => i.es_corrida && i.producto_id === productoId && i.color === color)
  const reservados = delGrupo.filter(i => i.reservado)
  const libres = delGrupo.filter(i => !i.reservado)
  reservados.forEach(i => pcSolicitarLiberacion(i))
  if (libres.length) {
    pc.carrito = pc.carrito.filter(i => !libres.includes(i))
    pcGuardarCarrito(true)
  }
  renderCarrito()
}

// ── Selección para "Enviar para apartar" ────────────────────────────────
window.pcToggleModoSeleccionApartado = function() {
  pc._seleccionApartadoActivo = !pc._seleccionApartadoActivo
  pc._seleccionApartado = new Set()
  renderCarrito()
}

window.pcToggleSeleccionApartado = function(key) {
  if (!pc._seleccionApartado) pc._seleccionApartado = new Set()
  if (pc._seleccionApartado.has(key)) pc._seleccionApartado.delete(key)
  else pc._seleccionApartado.add(key)
  renderCarrito()
}

window.pcEnviarParaApartar = async function() {
  const sel = pc._seleccionApartado
  if (!sel || !sel.size) return
  const btns = document.querySelectorAll('[onclick="pcEnviarParaApartar()"]')
  btns.forEach(b => { b.disabled = true; b.textContent = 'Enviando...' })
  try {
    // Asegurar que el carrito esté sincronizado antes de mandar la solicitud
    // -- si algo local todavía no tiene id real del servidor, la solicitud no
    // podría anclarse al ítem correcto.
    await _pcSincronizarCarritoServidorReal()
    const pedidoId = pc._borradorServerId
    if (!pedidoId) throw new Error('No se pudo sincronizar el carrito')
    const frescos = await fetch(`${PC_API}/pedidos/${pedidoId}/items`).then(r => r.ok ? r.json() : [])
    const idsAEnviar = []
    for (const item of pc.carrito) {
      const key = item.es_corrida ? ('corrida:' + item.producto_id + '|' + item.color) : item.variante_id
      if (!sel.has(key)) continue
      const match = (Array.isArray(frescos) ? frescos : []).find(f => f.variantes?.id === item.variante_id && !f.reservado)
      if (match) idsAEnviar.push(match.id)
    }
    if (!idsAEnviar.length) throw new Error('No se encontraron los ítems en el servidor, intenta de nuevo')
    const res = await fetch(`${PC_API}/pedidos/${pedidoId}/items/solicitar-apartado`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_ids: idsAEnviar })
    })
    const data = await res.json()
    if (!data.ok) throw new Error(data.error || 'Error al enviar')
    pc._seleccionApartadoActivo = false
    pc._seleccionApartado = new Set()
    // Refrescar desde el servidor para traer la bandera solicitud_apartar real
    const pedRes = await fetch(`${PC_API}/auth/pedidos/${pc.sesion.cliente_id}`, { headers: pcAuthHeaders() })
    const ped = pedRes.ok ? await pedRes.json() : []
    await pcRestaurarCarritoDeServidor(ped)
    renderCarrito()
  } catch (e) {
    alert('Error: ' + e.message)
  } finally {
    btns.forEach(b => { b.disabled = false; b.textContent = '🔒 Enviar para apartar' })
  }
}

// ── Sección "Apartados" ──────────────────────────────────────────────────
async function renderApartados(el) {
  el = el || document.getElementById('pc-content')
  if (!el) return
  el.innerHTML = '<div style="padding:40px;text-align:center;color:var(--pc-muted)">Cargando...</div>'
  try {
    const pedRes = await fetch(`${PC_API}/auth/pedidos/${pc.sesion.cliente_id}`, { headers: pcAuthHeaders() })
    const ped = pedRes.ok ? await pedRes.json() : []
    const borrador = (Array.isArray(ped) ? ped : []).find(p => p.notas === PC_BORRADOR_MARCA && p.status === 'apartado')
    const items = (borrador?.pedido_items || []).filter(i => i.reservado)
    const total = items.reduce((s,i)=>s+i.cantidad*i.precio_unitario, 0)
    const totalPares = items.reduce((s,i)=>s+i.cantidad, 0)

    if (!items.length) {
      el.innerHTML = `
        <div style="text-align:center;padding:60px 20px">
          <p style="font-size:3rem;margin:0 0 16px">🔒</p>
          <p style="font-size:1rem;font-weight:700;color:var(--pc-text-3);margin:0 0 8px">No tienes pares apartados</p>
          <p style="color:var(--pc-muted);font-size:0.83rem;margin:0 0 24px">Selecciona pares en tu carrito y pide que se te aparten</p>
          <button onclick="pcIrA('carrito')" class="pc-btn pc-btn-primary">Ir al carrito</button>
        </div>`
      return
    }

    el.innerHTML = `
      <div style="margin-bottom:20px">
        <h1 style="font-size:1.4rem;font-weight:800;color:var(--pc-text);margin:0 0 4px">🔒 Apartados</h1>
        <p style="font-size:0.83rem;color:var(--pc-muted);margin:0">${totalPares} par${totalPares!==1?'es':''} · ${money(total)}</p>
      </div>
      <div class="pc-card" style="margin-bottom:16px">
        ${items.map(item => {
          const v = item.variantes || {}
          const pr = v.productos || {}
          const pendiente = item.solicitud_liberar
          return `<div style="display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--pc-border);${pendiente?'opacity:0.55':''}">
            ${v.foto_url || pr.imagen_principal ? `<img src="${esc(v.foto_url || pr.imagen_principal)}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;background:var(--pc-bg-elev);flex-shrink:0">` : `<div style="width:60px;height:60px;background:var(--pc-bg-elev);border-radius:8px;flex-shrink:0"></div>`}
            <div style="flex:1;min-width:0">
              <p style="font-size:0.95rem;font-weight:800;color:var(--pc-text);margin:0 0 4px">${esc(String(pr.nombre || item.nombre || '').split(' ')[0])}</p>
              <p style="font-size:0.78rem;color:var(--pc-text-4);margin:0">Talla ${esc(v.talla || item.talla)} ${item.color ? '· '+esc(item.color) : ''} · ${item.cantidad} par${item.cantidad!==1?'es':''}</p>
              ${pendiente ? `<p style="font-size:0.72rem;color:#f59e0b;font-weight:700;margin:2px 0 0">Solicitud de liberación enviada — esperando aprobación</p>` : ''}
            </div>
            <div style="text-align:right;flex-shrink:0">
              <p style="font-weight:700;color:var(--pc-text);margin:0 0 4px">${money(item.precio_unitario * item.cantidad)}</p>
              ${pendiente ? '' : `<button onclick="pcPedirQuitarApartado('${item.id}')" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:0.72rem;padding:2px 0">pedir quitar este par</button>`}
            </div>
          </div>`
        }).join('')}
      </div>
      <button onclick="pcAbrirCerrarApartado('${borrador.id}', ${total})" class="pc-btn pc-btn-primary" style="width:100%;font-size:0.95rem;padding:14px">Cerrar pedido — ${money(total)}</button>
      <div id="pc-cerrar-apartado-modal"></div>
    `
  } catch (e) {
    el.innerHTML = `<div style="padding:40px;color:#ef4444;text-align:center">Error al cargar apartados</div>`
  }
}

window.pcPedirQuitarApartado = async function(itemId) {
  if (!confirm('¿Pedir que se quite este par de tu apartado?')) return
  try {
    const pedRes = await fetch(`${PC_API}/auth/pedidos/${pc.sesion.cliente_id}`, { headers: pcAuthHeaders() })
    const ped = pedRes.ok ? await pedRes.json() : []
    const borrador = (Array.isArray(ped) ? ped : []).find(p => p.notas === PC_BORRADOR_MARCA && p.status === 'apartado')
    if (!borrador) return
    await fetch(`${PC_API}/pedidos/${borrador.id}/items/${itemId}/solicitar-liberacion`, { method: 'POST' })
    renderApartados()
  } catch (e) { alert('Error: ' + e.message) }
}

window.pcAbrirCerrarApartado = function(pedidoId, total) {
  const modal = document.getElementById('pc-cerrar-apartado-modal')
  if (!modal) return
  modal.innerHTML = `
    <div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px" onclick="if(event.target===this) this.remove()">
      <div class="pc-card" style="max-width:400px;width:100%;padding:24px">
        <h3 style="margin:0 0 6px;font-size:1.1rem;color:var(--pc-text)">Cerrar pedido — ${money(total)}</h3>
        <p style="font-size:0.82rem;color:var(--pc-muted);margin:0 0 18px">¿Cómo vas a pagar?</p>
        <button id="pc-pago-btn-transferencia" onclick="pcCerrarApartadoConPago('${pedidoId}','transferencia')" class="pc-btn pc-btn-secondary" style="width:100%;margin-bottom:10px;text-align:left;padding:14px">🏦 Transferencia o pago en OXXO</button>
        <button id="pc-pago-btn-tarjeta" onclick="pcCerrarApartadoConPago('${pedidoId}','tarjeta')" class="pc-btn pc-btn-secondary" style="width:100%;text-align:left;padding:14px">💳 Tarjeta — te genero un link de pago</button>
        <div id="pc-cerrar-apartado-resultado" style="margin-top:16px"></div>
      </div>
    </div>`
}

window.pcCerrarApartadoConPago = async function(pedidoId, formaPago) {
  const resultado = document.getElementById('pc-cerrar-apartado-resultado')
  if (resultado) resultado.innerHTML = '<p style="text-align:center;color:var(--pc-muted);font-size:0.85rem">Un momento...</p>'
  // Deshabilitar los dos botones de inmediato -- antes se podía dar clic en
  // "Transferencia" DESPUÉS de ya haber cerrado con "Tarjeta" (o viceversa),
  // lo que tronaba con "solo se puede cerrar un pedido que ya está apartado"
  // porque el pedido ya había dejado de estar en status='apartado'.
  ;['pc-pago-btn-transferencia', 'pc-pago-btn-tarjeta'].forEach(id => {
    const b = document.getElementById(id)
    if (b) { b.disabled = true; b.style.opacity = '0.5'; b.style.pointerEvents = 'none' }
  })
  // Los items para MercadoPago se toman ANTES de vaciar pc.carrito más abajo
  // -- si no, se manda un array vacío (el backend igual lo resuelve por
  // pedido_id como respaldo, pero no hay que depender de eso).
  const itemsParaMP = pc.carrito.filter(i => i.reservado).map(i => ({ nombre: i.nombre, cantidad: i.cantidad, precio: i.precio_unitario }))
  try {
    const res = await fetch(`${PC_API}/pedidos/${pedidoId}/cerrar-apartado`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ forma_pago: formaPago })
    })
    const data = await res.json()
    if (!data.ok) {
      if (/ya está apartado/i.test(data.error || '')) {
        if (resultado) resultado.innerHTML = `<p style="font-size:0.85rem;color:var(--pc-text)">Este pedido ya se cerró antes. Si necesitas cambiar la forma de pago, escríbenos por WhatsApp.</p>`
        return
      }
      throw new Error(data.error || 'Error al cerrar el pedido')
    }

    // El pedido que se acaba de cerrar YA NO es "el carrito en vivo" (el
    // backend le quitó la marca de carrito-respaldo) -- si se sigue usando
    // como referencia local, lo próximo que la clienta agregue se mezclaría
    // con un pedido ya cerrado. Se limpia para que el próximo cambio de
    // carrito cree un borrador nuevo desde cero.
    if (pc._borradorServerId === pedidoId) {
      pc.carrito = []
      pc._borradorServerId = null
      try { localStorage.setItem(PC_CARRITO_KEY, JSON.stringify(pc.carrito)) } catch {}
      _pcMarcarSincronizado()
      if (typeof pcActualizarBadgeCarritoTopbar === 'function') pcActualizarBadgeCarritoTopbar()
    }
    if (pc.sesion?.cliente_id) {
      const rp = await fetch(`${PC_API}/auth/pedidos/${pc.sesion.cliente_id}`, { headers: pcAuthHeaders() }).catch(() => null)
      if (rp?.ok) {
        const todos = await rp.json()
        pc.pedidos = Array.isArray(todos) ? todos.filter(p => p.notas !== PC_BORRADOR_MARCA) : todos
      }
    }

    if (formaPago === 'transferencia') {
      const cfg = await fetch(`${PC_API}/config/pago-transferencia`).then(r => r.json()).catch(() => ({}))
      if (!cfg.clabe) {
        if (resultado) resultado.innerHTML = `<p style="font-size:0.85rem;color:var(--pc-text)">Tu pedido quedó marcado como pendiente de pago. Contáctanos por WhatsApp para darte los datos de la transferencia.</p>`
      } else if (resultado) {
        resultado.innerHTML = `
          <div style="background:var(--pc-bg-elev);border-radius:10px;padding:14px">
            <p style="font-size:0.78rem;color:var(--pc-muted);margin:0 0 8px">Transferencia bancaria:</p>
            <p style="font-size:0.85rem;margin:0 0 4px"><strong>Banco:</strong> ${esc(cfg.banco)}</p>
            <p style="font-size:0.85rem;margin:0 0 4px"><strong>CLABE:</strong> ${esc(cfg.clabe)}</p>
            ${cfg.cuenta ? `<p style="font-size:0.85rem;margin:0 0 4px"><strong>Cuenta (sin CLABE):</strong> ${esc(cfg.cuenta)}</p>` : ''}
            <p style="font-size:0.85rem;margin:0 0 10px"><strong>Titular:</strong> ${esc(cfg.titular)}</p>
            ${cfg.tarjeta_oxxo ? `
            <p style="font-size:0.78rem;color:var(--pc-muted);margin:10px 0 8px;border-top:1px solid var(--pc-border);padding-top:10px">O deposita en OXXO a esta tarjeta:</p>
            <p style="font-size:0.85rem;margin:0"><strong>Tarjeta:</strong> ${esc(cfg.tarjeta_oxxo)}</p>
            <p style="font-size:0.85rem;margin:0"><strong>Titular:</strong> ${esc(cfg.titular)}</p>` : ''}
          </div>
          <p style="font-size:0.78rem;color:var(--pc-muted);margin:10px 0 0">Cuando hagas la transferencia, mándanos el comprobante por WhatsApp.</p>`
      }
    } else {
      const mpRes = await fetch(`${PC_API}/pagos/crear-preferencia`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pedido_id: pedidoId,
          items: itemsParaMP,
          cliente: { nombre: pc.clienteData?.nombre || '', email: pc.clienteData?.email || '' }
        })
      })
      const mpData = await mpRes.json()
      if (mpData.init_point && resultado) {
        resultado.innerHTML = `<a href="${mpData.init_point}" target="_blank" class="pc-btn pc-btn-primary" style="width:100%;text-align:center;display:block">Ir a pagar con MercadoPago →</a>`
      } else if (resultado) {
        resultado.innerHTML = `<p style="font-size:0.85rem;color:#ef4444">No se pudo generar el link de pago. Intenta de nuevo o contáctanos.</p>`
      }
    }
  } catch (e) {
    if (resultado) resultado.innerHTML = `<p style="font-size:0.85rem;color:#ef4444">Error: ${e.message}</p>`
  }
}

// "Cerrar pedido" desde el carrito directo (sin pasar por apartado/aprobación
// manual) -- para la clienta que no quiere apartar par por par, sino pagar
// de una vez todo lo que lleva. Crea el pedido igual que antes, pero en vez
// de solo avisar "te contactaremos" ahora le abre las opciones de pago
// (transferencia/tarjeta) al instante, igual que en Apartados.
window.pcCerrarPedidoDirecto = async function() {
  const notas = document.getElementById('pc-notas')?.value?.trim() || ''
  const errEl = document.getElementById('pc-pedido-err')
  if (pc.carrito.length === 0) return
  const totalParesCierre = pc.carrito.reduce((s, i) => s + (i.cantidad || 0), 0)
  if (totalParesCierre < 3) {
    if (errEl) { errEl.textContent = `Pedido mínimo para cerrar: 3 pares (llevas ${totalParesCierre})`; errEl.style.display = 'block' }
    return
  }
  if (!pc.sesion?.cliente_id) { if (errEl) { errEl.textContent = 'Sin sesión activa'; errEl.style.display = 'block' } return }
  const direccion = (pc.clienteData?.direccion || '').trim()
  if (!direccion) {
    if (errEl) { errEl.textContent = 'Agrega tu dirección de envío en Mi cuenta antes de cerrar el pedido'; errEl.style.display = 'block' }
    return
  }
  const direccionEnvio = `${direccion}${pc.clienteData?.codigo_postal ? ', CP '+pc.clienteData.codigo_postal : ''}${pc.clienteData?.ciudad ? ', '+pc.clienteData.ciudad : ''}${pc.clienteData?.estado ? ', '+pc.clienteData.estado : ''}`

  const total = pc.carrito.reduce((s, i) => s + (i.precio_unitario * i.cantidad), 0)
  const itemsParaMP = pc.carrito.map(i => ({ nombre: i.nombre, cantidad: i.cantidad, precio: i.precio_unitario }))

  const btn = document.querySelector('[onclick="pcCerrarPedidoDirecto()"]')
  if (btn) { btn.textContent = 'Enviando...'; btn.disabled = true }

  try {
    // OJO: "/pedidos" SIN diagonal final -- ver el comentario en
    // pcSincronizarCarritoServidor. Sin la diagonal, el navegador bloqueaba
    // por CORS al seguir la redirección de FastAPI, y el pedido nunca se
    // llegaba a crear -- aunque el cliente viera "Enviando..." y no un error.
    const res = await fetch(`${PC_API}/pedidos/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cliente_id: pc.sesion.cliente_id,
        total,
        status: 'pendiente_pago',
        canal: 'portal_mayoreo',
        comentarios: notas,
        direccion_envio: direccionEnvio,
        items: pc.carrito.map(i => ({
          variante_id: i.variante_id,
          nombre: i.nombre,
          talla: i.talla,
          color: i.color,
          cantidad: i.cantidad,
          precio_unitario: i.precio_unitario,
          subtotal: i.cantidad * i.precio_unitario,
          es_corrida: !!i.es_corrida,
        }))
      })
    })
    if (res.ok) {
      const data = await res.json()
      const nuevoPedidoId = Array.isArray(data) ? data[0]?.id : data?.id
      pc.carrito = []
      pcGuardarCarrito(true)
      // Recargar pedidos (filtrando el borrador que respaldaba el carrito)
      if (pc.sesion?.cliente_id) {
        const rp = await fetch(`${PC_API}/auth/pedidos/${pc.sesion.cliente_id}`)
        if (rp.ok) {
          const todos = await rp.json()
          pc.pedidos = Array.isArray(todos) ? todos.filter(p => p.notas !== PC_BORRADOR_MARCA) : todos
        }
      }
      if (nuevoPedidoId) pcAbrirPagoDirecto(nuevoPedidoId, total, itemsParaMP)
      else pcMostrarExito('¡Pedido enviado! Te contactaremos para coordinar el pago y envío.')
      if (btn) { btn.textContent = 'Cerrar pedido'; btn.disabled = false }
    } else {
      const d = await res.json()
      if (errEl) { errEl.textContent = d.error || 'Error al enviar el pedido'; errEl.style.display = 'block' }
      if (btn) { btn.textContent = 'Cerrar pedido'; btn.disabled = false }
    }
  } catch(e) {
    if (errEl) { errEl.textContent = 'Error conectando con el servidor'; errEl.style.display = 'block' }
    if (btn) { btn.textContent = 'Cerrar pedido'; btn.disabled = false }
  }
}

// Opciones de pago para un pedido recién creado directo desde el carrito
// (ya nace en pendiente_pago -- a diferencia de Apartados, aquí no hay que
// llamar cerrar-apartado, solo guardar la forma de pago elegida).
window.pcAbrirPagoDirecto = function(pedidoId, total, itemsParaMP) {
  window._pcItemsParaMPTemp = itemsParaMP  // evita tener que serializar el array dentro de un onclick
  let modal = document.getElementById('pc-pago-directo-modal')
  if (!modal) { modal = document.createElement('div'); modal.id = 'pc-pago-directo-modal'; document.body.appendChild(modal) }
  modal.innerHTML = `
    <div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px" onclick="if(event.target===this) this.remove()">
      <div class="pc-card" style="max-width:400px;width:100%;padding:24px">
        <h3 style="margin:0 0 6px;font-size:1.1rem;color:var(--pc-text)">¡Pedido enviado! — ${money(total)}</h3>
        <p style="font-size:0.82rem;color:var(--pc-muted);margin:0 0 18px">¿Cómo vas a pagar?</p>
        <button onclick="pcElegirPagoDirecto('${pedidoId}','transferencia')" class="pc-btn pc-btn-secondary" style="width:100%;margin-bottom:10px;text-align:left;padding:14px">🏦 Transferencia o pago en OXXO</button>
        <button onclick="pcElegirPagoDirecto('${pedidoId}','tarjeta')" class="pc-btn pc-btn-secondary" style="width:100%;text-align:left;padding:14px">💳 Tarjeta — te genero un link de pago</button>
        <div id="pc-pago-directo-resultado" style="margin-top:16px"></div>
      </div>
    </div>`
}

window.pcElegirPagoDirecto = async function(pedidoId, formaPago) {
  const itemsParaMP = window._pcItemsParaMPTemp || []
  const resultado = document.getElementById('pc-pago-directo-resultado')
  if (resultado) resultado.innerHTML = '<p style="text-align:center;color:var(--pc-muted);font-size:0.85rem">Un momento...</p>'
  try {
    await fetch(`${PC_API}/pedidos/${pedidoId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ forma_pago: formaPago })
    })
    if (formaPago === 'transferencia') {
      const cfg = await fetch(`${PC_API}/config/pago-transferencia`).then(r => r.json()).catch(() => ({}))
      if (!cfg.clabe) {
        if (resultado) resultado.innerHTML = `<p style="font-size:0.85rem;color:var(--pc-text)">Contáctanos por WhatsApp para darte los datos de la transferencia.</p>`
      } else if (resultado) {
        resultado.innerHTML = `
          <div style="background:var(--pc-bg-elev);border-radius:10px;padding:14px">
            <p style="font-size:0.78rem;color:var(--pc-muted);margin:0 0 8px">Transferencia bancaria:</p>
            <p style="font-size:0.85rem;margin:0 0 4px"><strong>Banco:</strong> ${esc(cfg.banco)}</p>
            <p style="font-size:0.85rem;margin:0 0 4px"><strong>CLABE:</strong> ${esc(cfg.clabe)}</p>
            ${cfg.cuenta ? `<p style="font-size:0.85rem;margin:0 0 4px"><strong>Cuenta (sin CLABE):</strong> ${esc(cfg.cuenta)}</p>` : ''}
            <p style="font-size:0.85rem;margin:0 0 10px"><strong>Titular:</strong> ${esc(cfg.titular)}</p>
            ${cfg.tarjeta_oxxo ? `
            <p style="font-size:0.78rem;color:var(--pc-muted);margin:10px 0 8px;border-top:1px solid var(--pc-border);padding-top:10px">O deposita en OXXO a esta tarjeta:</p>
            <p style="font-size:0.85rem;margin:0"><strong>Tarjeta:</strong> ${esc(cfg.tarjeta_oxxo)}</p>
            <p style="font-size:0.85rem;margin:0"><strong>Titular:</strong> ${esc(cfg.titular)}</p>` : ''}
          </div>
          <p style="font-size:0.78rem;color:var(--pc-muted);margin:10px 0 0">Cuando hagas la transferencia, mándanos el comprobante por WhatsApp.</p>`
      }
    } else {
      const mpRes = await fetch(`${PC_API}/pagos/crear-preferencia`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pedido_id: pedidoId, items: itemsParaMP,
          cliente: { nombre: pc.clienteData?.nombre || '', email: pc.clienteData?.email || '' }
        })
      })
      const mpData = await mpRes.json()
      if (mpData.init_point && resultado) {
        resultado.innerHTML = `<a href="${mpData.init_point}" target="_blank" class="pc-btn pc-btn-primary" style="width:100%;text-align:center;display:block">Ir a pagar con MercadoPago →</a>`
      } else if (resultado) {
        resultado.innerHTML = `<p style="font-size:0.85rem;color:#ef4444">No se pudo generar el link de pago. Intenta de nuevo o contáctanos.</p>`
      }
    }
  } catch (e) {
    if (resultado) resultado.innerHTML = `<p style="font-size:0.85rem;color:#ef4444">Error: ${e.message}</p>`
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
      <h1 style="font-size:1.4rem;font-weight:800;color:var(--pc-text);margin:0 0 4px">Mis pedidos</h1>
      <p style="font-size:0.83rem;color:var(--pc-muted);margin:0">${pedidos.length} pedido${pedidos.length !== 1 ? 's' : ''} en total</p>
    </div>

    ${pedidos.length === 0 ? `
    <div style="text-align:center;padding:60px;color:var(--pc-muted)">
      <p style="font-size:2rem;margin:0 0 12px">📦</p>
      <p style="color:var(--pc-text-3);font-weight:600;margin:0 0 8px">Sin pedidos aún</p>
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
          <p style="font-size:0.72rem;font-family:monospace;color:var(--pc-muted);margin:0 0 2px">#${(p.id||'').substring(0,8).toUpperCase()}</p>
          <p style="font-size:0.83rem;color:var(--pc-text-4);margin:0">${new Date(p.created_at).toLocaleDateString('es-MX',{day:'2-digit',month:'long',year:'numeric'})}</p>
        </div>
        <div style="text-align:right">
          <span class="pc-status-chip" style="background:${color}20;color:${color}">${STATUS_ICONS[p.status]||''} ${STATUS_LABELS[p.status]||p.status}</span>
          <p style="font-size:1.1rem;font-weight:800;color:var(--pc-text);margin:6px 0 0">${money(p.total)}</p>
        </div>
      </div>

      <!-- Timeline -->
      ${p.status !== 'cancelado' ? `
      <div style="display:flex;align-items:center;margin-bottom:20px;overflow-x:auto;padding:4px 0">
        ${STATUS_STEPS.map((s, i) => {
          const done = i <= stepIdx
          const c = done ? '#E91E8C' : 'var(--pc-border-2)'
          return `
            <div style="display:flex;align-items:center;flex-shrink:0">
              <div style="text-align:center;min-width:70px">
                <div style="width:28px;height:28px;border-radius:50%;background:${done ? 'rgba(233,30,140,0.15)' : 'var(--pc-bg)'};border:2px solid ${c};display:flex;align-items:center;justify-content:center;margin:0 auto 5px;font-size:0.75rem">${done ? '✓' : ''}</div>
                <p style="font-size:0.6rem;color:${done ? '#E91E8C' : 'var(--pc-muted-2)'};margin:0;white-space:nowrap">${STATUS_LABELS[s]||s}</p>
              </div>
              ${i < STATUS_STEPS.length - 1 ? `<div style="flex:1;height:2px;background:${i < stepIdx ? '#E91E8C' : 'var(--pc-border)'};min-width:20px;margin:0 2px;margin-bottom:18px"></div>` : ''}
            </div>`
        }).join('')}
      </div>` : ''}

      <!-- Tracking -->
      ${p.numero_guia || p.tracking_url ? `
      <div style="background:rgba(139,92,246,0.08);border:1px solid rgba(139,92,246,0.2);border-radius:8px;padding:12px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
        <div>
          <p style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#8b5cf6;margin:0 0 2px">${p.paqueteria || 'Paquetería'}</p>
          <p style="font-size:0.85rem;font-family:monospace;color:var(--pc-text-2);margin:0">${p.numero_guia || ''}</p>
        </div>
        ${p.tracking_url ? `<a href="${esc(p.tracking_url)}" target="_blank" class="pc-btn pc-btn-primary" style="font-size:0.78rem;padding:8px 16px;text-decoration:none">🔍 Rastrear envío</a>` : ''}
      </div>` : ''}

      <!-- Items -->
      ${items.length > 0 ? `
      <div style="border-top:1px solid var(--pc-border);padding-top:12px">
        ${items.map(i => `
          <div style="display:flex;align-items:center;gap:12px;padding:8px 0">
            ${i.variantes?.productos?.imagen_principal ? `<img src="${esc(i.variantes.productos.imagen_principal)}" style="width:44px;height:44px;object-fit:cover;border-radius:6px;background:var(--pc-bg-elev);flex-shrink:0">` : ''}
            <div style="flex:1;min-width:0">
              <p style="font-size:0.83rem;font-weight:500;color:var(--pc-text-2);margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(i.variantes?.productos?.nombre || 'Producto')}</p>
              <p style="font-size:0.72rem;color:var(--pc-muted);margin:0">Talla ${esc(i.variantes?.talla||'')} · ${i.cantidad} par${i.cantidad !== 1 ? 'es' : ''}</p>
            </div>
            <p style="font-weight:700;color:var(--pc-text);margin:0;flex-shrink:0">${money((i.precio_unitario||0)*i.cantidad)}</p>
          </div>`).join('')}
      </div>` : ''}
      ${['pendiente_pago','checkout_iniciado'].includes(p.status) ? `
      <button onclick="pcContinuarPago('${p.id}')" class="pc-btn pc-btn-primary" style="width:100%;margin-top:14px;font-size:0.82rem">💳 Continuar pago</button>
      <p style="font-size:0.72rem;color:var(--pc-muted);margin:6px 0 0;text-align:center">${p.status === 'checkout_iniciado' ? 'El link de pago anterior quedó a medias -- genera uno nuevo o paga por transferencia.' : 'Elige cómo pagar este pedido.'}</p>
      <button onclick="pcCancelarPedidoCliente('${p.id}')" class="pc-btn pc-btn-secondary" style="width:100%;margin-top:10px;font-size:0.78rem;color:#ef4444">✕ Ya no quiero este pedido, cancelarlo</button>` : ''}
      ${items.length > 0 ? `
      <button onclick="pcReordenar('${p.id}')" class="pc-btn pc-btn-secondary" style="width:100%;margin-top:10px;font-size:0.82rem">🔁 Pedir de nuevo</button>` : ''}
    </div>`
}

window.pcCancelarPedidoCliente = async function(pedidoId) {
  if (!confirm('¿Cancelar este pedido? No se podrá pagar después -- si cambias de opinión tendrás que hacer uno nuevo.')) return
  try {
    const res = await fetch(`${PC_API}/pedidos/${pedidoId}/cancelar`, { method: 'POST' })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || data.error) throw new Error(data.error || 'No se pudo cancelar')
    if (pc.sesion?.cliente_id) {
      const rp = await fetch(`${PC_API}/auth/pedidos/${pc.sesion.cliente_id}`, { headers: pcAuthHeaders() }).catch(() => null)
      if (rp?.ok) {
        const todos = await rp.json()
        pc.pedidos = Array.isArray(todos) ? todos.filter(p => p.notas !== PC_BORRADOR_MARCA) : todos
      }
    }
    if (typeof pcMostrarExito === 'function') pcMostrarExito('Pedido cancelado')
    renderMisPedidos()
  } catch (e) { alert('Error: ' + e.message) }
}

window.pcContinuarPago = function(pedidoId) {
  const p = (pc.pedidos || []).find(x => x.id === pedidoId)
  if (!p) return
  const items = p.pedido_items || []
  const itemsParaMP = items.map(i => ({
    nombre: i.variantes?.productos?.nombre || i.nombre || 'Producto',
    cantidad: i.cantidad, precio: i.precio_unitario,
  }))
  pcAbrirPagoDirecto(pedidoId, parseFloat(p.total || 0), itemsParaMP)
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
        sku: prod?.sku_interno || null, imagen: v.foto_url || v.productos?.imagen_principal || null,
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
      <h1 style="font-size:1.4rem;font-weight:800;color:var(--pc-text);margin:0 0 4px">💡 Sugerencias</h1>
      <p style="font-size:0.83rem;color:var(--pc-muted);margin:0">¿Te gustaría alguna función nueva, una mejora o tienes alguna recomendación? Cuéntanos.</p>
    </div>

    <div class="pc-card" style="margin-bottom:16px">
      <label style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--pc-muted);display:block;margin-bottom:8px">Tipo</label>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px" id="pc-sug-tipos">
        ${[['sugerencia','💡 Sugerencia'],['funcion','✨ Función nueva'],['problema','⚠️ Problema/Error'],['otro','💬 Otro']].map(([v,l], i) => `
          <button type="button" data-tipo="${v}" onclick="pcSeleccionarTipoSugerencia('${v}')" class="pc-btn ${i===0?'pc-btn-primary':'pc-btn-secondary'}" style="padding:8px 14px;font-size:0.78rem">${l}</button>
        `).join('')}
      </div>
      <label style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--pc-muted);display:block;margin-bottom:8px">Tu mensaje</label>
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
      <h1 style="font-size:1.4rem;font-weight:800;color:var(--pc-text);margin:0 0 4px">Mi cuenta</h1>
      <p style="font-size:0.83rem;color:var(--pc-muted);margin:0">${esc(s.email||'')}</p>
    </div>

    <div class="pc-card" style="margin-bottom:14px">
      <p style="font-weight:700;color:var(--pc-text);margin:0 0 16px">Datos de contacto</p>
      <div style="display:grid;gap:12px">
        <div>
          <label style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--pc-muted);display:block;margin-bottom:5px">Nombre</label>
          <input id="mc-nombre" class="pc-input" value="${esc(s.nombre||c.nombre||'')}">
        </div>
        <div>
          <label style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--pc-muted);display:block;margin-bottom:5px">Teléfono</label>
          <input id="mc-tel" class="pc-input" type="tel" value="${esc(c.telefono||'')}">
        </div>
        <div>
          <label style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--pc-muted);display:block;margin-bottom:5px">Ciudad / Estado</label>
          <input id="mc-ciudad" class="pc-input" placeholder="ej. Guadalajara, Jalisco" value="${esc((c.ciudad||'') + (c.estado ? ', '+c.estado : ''))}">
        </div>
      </div>
      <button onclick="pcGuardarCuenta()" class="pc-btn pc-btn-primary" style="margin-top:16px">Guardar cambios</button>
      <p id="mc-msg" style="font-size:0.78rem;margin-top:8px;display:none"></p>
    </div>

    <div class="pc-card" style="margin-bottom:14px">
      <p style="font-weight:700;color:var(--pc-text);margin:0 0 4px">Dirección de envío</p>
      <p style="font-size:0.78rem;color:var(--pc-muted);margin:0 0 16px">Se usa para armar tus pedidos del portal — sin esto el negocio no sabe a dónde enviar.</p>
      <div style="display:grid;gap:12px">
        <div>
          <label style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--pc-muted);display:block;margin-bottom:5px">Calle, número y colonia</label>
          <textarea id="mc-direccion" class="pc-input" style="height:60px;resize:none" placeholder="Ej. Av. Hidalgo 123, Col. Centro">${esc(c.direccion||'')}</textarea>
        </div>
        <div>
          <label style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--pc-muted);display:block;margin-bottom:5px">Código postal</label>
          <input id="mc-cp" class="pc-input" inputmode="numeric" maxlength="5" value="${esc(c.codigo_postal||'')}">
        </div>
      </div>
      <button onclick="pcGuardarDireccion()" class="pc-btn pc-btn-primary" style="margin-top:16px">Guardar dirección</button>
      <p id="mc-dir-msg" style="font-size:0.78rem;margin-top:8px;display:none"></p>
    </div>

    <div class="pc-card">
      <p style="font-weight:700;color:var(--pc-text);margin:0 0 16px">Cambiar contraseña</p>
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

window.__pcQtyGrupoCorrida = (productoId, color, d) => {
  const items = pc.carrito.filter(i => i.producto_id === productoId && i.color === color && i.es_corrida)
  const currentTotal = items.reduce((s, x) => s + x.cantidad, 0)
  const currentM = currentTotal / 6
  const newM = currentM + d
  
  if (newM <= 0) {
    pc.carrito = pc.carrito.filter(i => !(i.producto_id === productoId && i.color === color && i.es_corrida))
    pcGuardarCarrito()
    renderCarrito()
    return
  }
  
  const maxM = pcMaxCorridasDisponibles(productoId, color)
  if (newM > maxM) {
    alert(`Sin existencias para ${newM} corridas (máximo ${maxM})`)
    return
  }
  
  const newQtyMap = pcResolverItemsCorrida(productoId, color, newM)
  
  // Remove existing
  pc.carrito = pc.carrito.filter(i => !(i.producto_id === productoId && i.color === color && i.es_corrida))
  
  // Add new
  const p = pc.productos.find(x => x.id === productoId)
  const precio = precioCorrida(p)
  Object.entries(newQtyMap).forEach(([varId, cant]) => {
    if (cant <= 0) return
    const v = pc.variantes.find(x => x.id === varId)
    const foto = v.foto_url || p.imagen_principal || null
    pc.carrito.push({ producto_id: productoId, variante_id: varId, nombre: p.nombre, sku: p.sku_interno, imagen: foto, talla: v.talla, color: v.color, cantidad: cant, precio_unitario: precio, es_corrida: true })
  })
  
  pcGuardarCarrito()
  renderCarrito()
}

function pcActualizarBadgeCarritoTopbar() {
  const totalPares = (pc.carrito || []).reduce((s, i) => s + (i.cantidad || 0), 0)
  ;['pc-topbar-cart-badge', 'pc-bn-cart-badge'].forEach(id => {
    const badge = document.getElementById(id)
    if (!badge) return
    if (totalPares > 0) {
      badge.textContent = totalPares
      badge.style.display = 'flex'
    } else {
      badge.style.display = 'none'
    }
  })
  _pcActualizarBottomNavApartados()
}

// El ícono "Apartados" del bottom nav solo aparece cuando la clienta
// realmente tiene pares apartados -- no siempre, para no llenar la barra
// de algo que la mayoría de las visitas no necesita.
function _pcActualizarBottomNavApartados() {
  const nav = document.getElementById('pc-bottomnav')
  if (!nav) return
  const hayApartados = (pc.carrito || []).some(i => i.reservado)
  let btn = document.getElementById('pc-bn-apartados')
  if (hayApartados && !btn) {
    const cuentaBtn = nav.querySelector('.pc-nav-item:last-child')
    btn = document.createElement('button')
    btn.id = 'pc-bn-apartados'
    btn.className = 'pc-nav-item pc-bn-item' + (pc.tab === 'apartados' ? ' activo' : '')
    btn.setAttribute('aria-label', 'Apartados')
    btn.onclick = () => pcIrA('apartados')
    btn.innerHTML = `<span style="font-size:1.15rem;line-height:1">🔒</span><span>Apartados</span>`
    if (cuentaBtn) nav.insertBefore(btn, cuentaBtn); else nav.appendChild(btn)
  } else if (!hayApartados && btn) {
    btn.remove()
  } else if (btn) {
    btn.classList.toggle('activo', pc.tab === 'apartados')
  }
}
