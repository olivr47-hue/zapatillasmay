import './style.css'
document.querySelector('#app').style.cssText = 'display:flex;min-height:100vh;width:100%;flex:1'
import { renderPanel } from './panel.js'
import { renderPortalCliente } from './portal-cliente.js'
import { renderEstiloPublico } from './estilo-publico.js'

// ── Página pública del QR de etiquetas de caja ──────────────────────────────
// Se revisa ANTES que cualquier lógica de sesión: quien escanea la caja no
// tiene cuenta en el ERP ni debe necesitar una. Ver estilo-publico.js.
const _skuEstiloPublico = new URLSearchParams(location.search).get('estilo')
if (_skuEstiloPublico) {
  renderEstiloPublico(_skuEstiloPublico)
}

// ── Interceptor global de fetch ─────────────────────────────────────────────
// Adjunta el JWT (erp_token) a TODA llamada a /api sin tener que tocar las ~325
// llamadas del panel una por una, y maneja 401 en un solo lugar (sesión expirada
// → limpiar y volver al login). Solo afecta a esta app (panel), no a la tienda.
;(() => {
  const _fetch = window.fetch.bind(window)
  let _redirigiendo = false
  window.fetch = async (input, init) => {
    init = init || {}
    const url = typeof input === 'string' ? input : (input && input.url) || ''
    const esApi = url.startsWith('/api') || url.startsWith(location.origin + '/api')
    if (esApi) {
      const token = localStorage.getItem('erp_token')
      if (token) {
        // Merge de Authorization respetando headers existentes (NO tocar Content-Type:
        // los uploads con FormData necesitan que el navegador ponga su propio boundary).
        const headers = new Headers(
          init.headers || (typeof input !== 'string' && input.headers) || {}
        )
        if (!headers.has('Authorization')) headers.set('Authorization', 'Bearer ' + token)
        init = { ...init, headers }
      }
    }
    const res = await _fetch(input, init)
    // Los endpoints de login/registro devuelven 401 como respuesta NORMAL
    // ante credenciales equivocadas -- el formulario necesita ese 401 para
    // mostrar "contraseña incorrecta". Si el interceptor lo trata como sesión
    // expirada, la alerta + recarga se disparan ANTES de que el formulario
    // pueda leer la respuesta, y la clienta/empleado se queda en un loop de
    // "sesión expiró" sin nunca ver el error real de su intento de login.
    const esLoginEndpoint = /\/api\/(empleados\/login|auth\/(login|google|registro|recuperar)|portal\/(login(\/google)?|otp\/(solicitar|verificar)))(\?|$)/.test(url)
    if (esApi && res.status === 401 && !esLoginEndpoint && !_redirigiendo) {
      _redirigiendo = true
      try {
        localStorage.removeItem('erp_token')
        localStorage.removeItem('erp_empleado')
        localStorage.removeItem('pc_sesion')
      } catch (e) {}
      alert('Tu sesión expiró. Inicia sesión de nuevo.')
      location.reload()
    }
    return res
  }
})()

// ── Notificaciones push del panel (pedidos nuevos, pagos, WhatsApp) ─────────
// Reutiliza la misma infraestructura Web Push de tienda/portal (backend/routers/push.py),
// solo que aquí el suscriptor se marca con sitio:'panel' para poder targetear
// avisos internos sin mezclarlos con las notificaciones de clientes. Se define
// ANTES de la restauración de sesión de abajo, que puede llamarla de inmediato.
;(() => {
  const DISMISS_KEY = 'zm_push_panel_dismissed'

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const raw = atob(base64)
    const output = new Uint8Array(raw.length)
    for (let i = 0; i < raw.length; ++i) output[i] = raw.charCodeAt(i)
    return output
  }

  function mostrarBannerPush(onAceptar) {
    if (document.getElementById('zm-push-panel-banner')) return
    const el = document.createElement('div')
    el.id = 'zm-push-panel-banner'
    el.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;max-width:380px;margin:0 auto;z-index:9997;background:#161625;border:1.5px solid #E91E8C;border-radius:16px;padding:14px 16px;display:flex;align-items:center;gap:12px;box-shadow:0 8px 28px rgba(0,0,0,0.45);font-family:DM Sans,sans-serif'
    el.innerHTML = `
      <span style="font-size:1.6rem;flex-shrink:0">🔔</span>
      <div style="flex:1;min-width:0">
        <p style="margin:0 0 2px;font-size:0.85rem;font-weight:700;color:white">Activa avisos del panel</p>
        <p style="margin:0;font-size:0.75rem;color:#a0a0c0">Entérate al instante de pedidos nuevos, pagos y mensajes de WhatsApp.</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0">
        <button id="zm-push-panel-si" style="background:#E91E8C;color:#fff;border:none;border-radius:8px;padding:6px 12px;font-size:0.78rem;font-weight:700;cursor:pointer">Activar</button>
        <button id="zm-push-panel-no" style="background:transparent;color:#5a5a7a;border:none;font-size:0.72rem;cursor:pointer;padding:2px">Ahora no</button>
      </div>`
    document.body.appendChild(el)
    document.getElementById('zm-push-panel-si').onclick = () => { el.remove(); onAceptar() }
    document.getElementById('zm-push-panel-no').onclick = () => {
      el.remove()
      try { localStorage.setItem(DISMISS_KEY, '1') } catch (e) {}
    }
  }

  async function suscribirPush() {
    try {
      const reg = await navigator.serviceWorker.register('/sw-push.js')
      const permiso = await Notification.requestPermission()
      if (permiso !== 'granted') return
      const res = await fetch('/api/push/public-key')
      const { publicKey, configurado } = await res.json()
      if (!configurado) return
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      })
      await fetch('/api/push/suscribir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub.toJSON(), sitio: 'panel', user_agent: navigator.userAgent }),
      })
    } catch (e) { /* silencioso: navegador sin soporte, permiso bloqueado, etc. */ }
  }

  window._initPushPanel = function () {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
    if (Notification.permission === 'granted') { suscribirPush(); return }
    if (Notification.permission === 'denied') return
    try { if (localStorage.getItem(DISMISS_KEY)) return } catch (e) {}
    setTimeout(() => mostrarBannerPush(suscribirPush), 3000)
  }
})()

const SESSION_KEY    = 'erp_empleado'
const PC_SESSION_KEY = 'pc_sesion'

// ── Deep-link desde notificaciones push (WhatsApp, etc.) ────────────────────
// El service worker abre el panel con ?modulo=X&telefono=Y (ver sw-push.js).
// Sin esto la SPA ignora la URL por completo y solo restaura el último módulo
// guardado en localStorage, dejando al usuario donde se haya quedado.
async function _manejarDeepLinkNotificacion() {
  const params = new URLSearchParams(location.search)
  const modulo = params.get('modulo')
  const telefono = params.get('telefono')
  if (!modulo) return
  history.replaceState(null, '', location.pathname)
  window.navegarA(modulo)
  if (modulo === 'conversaciones' && telefono) {
    await window.cargarConversaciones()
    window.abrirChat(telefono)
  }
}

function renderLogin() {
  document.querySelector('#app').innerHTML = `
    <div style="min-height:100vh;width:100vw;display:flex;font-family:DM Sans,sans-serif">

      <!-- Panel izquierdo: marca -->
      <div style="display:none;flex:0 0 42%;background:#0c0c17;flex-direction:column;justify-content:space-between;padding:48px 52px;position:relative;overflow:hidden"
           id="login-brand-panel">
        <!-- Glow decorativo -->
        <div style="position:absolute;top:-120px;left:-80px;width:420px;height:420px;background:radial-gradient(circle,rgba(233,30,140,0.18) 0%,transparent 70%);pointer-events:none"></div>
        <div style="position:absolute;bottom:-60px;right:-60px;width:300px;height:300px;background:radial-gradient(circle,rgba(233,30,140,0.1) 0%,transparent 70%);pointer-events:none"></div>

        <!-- Logo -->
        <div>
          <div style="display:inline-flex;align-items:center;gap:6px;margin-bottom:0">
            <span style="width:8px;height:8px;border-radius:50%;background:#E91E8C;display:inline-block;flex-shrink:0"></span>
            <span style="font-size:0.72rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#E91E8C">Zapatillas May</span>
          </div>
        </div>

        <!-- Texto central -->
        <div>
          <p style="font-size:0.7rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#E91E8C;margin:0 0 16px">ERP · Panel interno</p>
          <h2 style="font-size:3rem;font-weight:800;color:white;line-height:1.08;margin:0 0 20px;letter-spacing:-0.02em">
            Gestiona<br>tu negocio<br>desde aquí.
          </h2>
          <p style="font-size:0.85rem;color:#4a4a6a;line-height:1.6;max-width:280px;margin:0">
            Pedidos, clientes, inventario, WhatsApp y campañas, todo en un solo lugar.
          </p>
        </div>

        <!-- Footer -->
        <div>
          <p style="font-size:0.7rem;color:#2a2a3f;margin:0">León, Guanajuato · México</p>
        </div>
      </div>

      <!-- Panel derecho: formulario -->
      <div style="flex:1;background:#0f0f1c;display:flex;align-items:center;justify-content:center;padding:24px;position:relative">
        <!-- Glow sutil -->
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-60%);width:500px;height:400px;background:radial-gradient(ellipse,rgba(233,30,140,0.07) 0%,transparent 65%);pointer-events:none"></div>

        <div style="width:100%;max-width:360px;position:relative">
          <!-- Logo en móvil (oculto en desktop cuando el panel izq está visible) -->
          <div style="text-align:center;margin-bottom:40px">
            <div style="display:inline-flex;align-items:center;gap:6px;margin-bottom:10px">
              <span style="width:7px;height:7px;border-radius:50%;background:#E91E8C;flex-shrink:0"></span>
              <span style="font-size:0.7rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#E91E8C">Zapatillas May</span>
            </div>
            <h1 style="font-size:1.6rem;font-weight:800;color:white;margin:0;letter-spacing:-0.01em">Bienvenida</h1>
            <p style="color:#3a3a5c;font-size:0.82rem;margin:6px 0 0">Ingresa tus credenciales para continuar</p>
          </div>

          <div style="margin-bottom:18px">
            <label style="display:block;font-size:0.68rem;font-weight:700;color:#4a4a6a;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px">Correo electrónico</label>
            <input type="email" id="login-email" placeholder="tu@correo.com"
              style="width:100%;padding:12px 16px;border:1.5px solid #1e1e30;border-radius:10px;background:#161625;color:white;font-family:DM Sans,sans-serif;font-size:0.9rem;outline:none;box-sizing:border-box;transition:border-color 0.15s"
              onfocus="this.style.borderColor='#E91E8C'" onblur="this.style.borderColor='#1e1e30'"
              onkeydown="if(event.key==='Enter')hacerLogin()">
          </div>

          <div style="margin-bottom:28px">
            <label style="display:block;font-size:0.68rem;font-weight:700;color:#4a4a6a;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px">Contraseña</label>
            <input type="password" id="login-password" placeholder="••••••••"
              style="width:100%;padding:12px 16px;border:1.5px solid #1e1e30;border-radius:10px;background:#161625;color:white;font-family:DM Sans,sans-serif;font-size:0.9rem;outline:none;box-sizing:border-box;transition:border-color 0.15s"
              onfocus="this.style.borderColor='#E91E8C'" onblur="this.style.borderColor='#1e1e30'"
              onkeydown="if(event.key==='Enter')hacerLogin()">
          </div>

          <button onclick="hacerLogin()" id="btn-login"
            style="width:100%;padding:13px;background:#E91E8C;color:white;border:none;border-radius:10px;font-family:DM Sans,sans-serif;font-size:0.9rem;font-weight:700;cursor:pointer;letter-spacing:0.01em;transition:background 0.15s"
            onmouseover="this.style.background='#d01a7e'" onmouseout="this.style.background='#E91E8C'">
            Iniciar sesión
          </button>

          <div style="display:flex;align-items:center;gap:10px;margin:16px 0">
            <div style="flex:1;height:1px;background:#1e1e30"></div>
            <span style="font-size:0.72rem;color:#4a4a6a">clientes mayoristas</span>
            <div style="flex:1;height:1px;background:#1e1e30"></div>
          </div>
          <div id="google-btn-container" style="display:flex;justify-content:center;min-height:40px"></div>

          <p style="text-align:center;margin-top:16px;display:flex;justify-content:center;gap:16px;flex-wrap:wrap">
            <a href="#" onclick="mostrarRecuperar(event)"
               style="color:#E91E8C;font-size:0.8rem;text-decoration:none;opacity:0.85"
               onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.85'">
              ¿Olvidaste tu contraseña?
            </a>
            <a href="#" onclick="mostrarRegistroMayoreo(event)"
               style="color:#E91E8C;font-size:0.8rem;text-decoration:none;opacity:0.85"
               onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.85'">
              Crear cuenta mayorista
            </a>
          </p>

          <p id="login-error" style="color:#f87171;font-size:0.8rem;text-align:center;margin-top:10px;display:none;background:rgba(248,113,113,0.08);padding:8px 12px;border-radius:8px;border:1px solid rgba(248,113,113,0.2)"></p>
          <p id="login-ok" style="color:#4ade80;font-size:0.8rem;text-align:center;margin-top:10px;display:none;background:rgba(74,222,128,0.08);padding:8px 12px;border-radius:8px;border:1px solid rgba(74,222,128,0.2)"></p>

          <!-- Sección recuperar contraseña (oculta por defecto) -->
          <div id="recuperar-section" style="display:none;margin-top:20px;padding-top:20px;border-top:1px solid #1e1e30">
            <p style="font-size:0.8rem;color:#8888aa;margin:0 0 12px;text-align:center">Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.</p>
            <input type="email" id="recuperar-email" placeholder="tu@correo.com"
              style="width:100%;padding:12px 16px;border:1.5px solid #1e1e30;border-radius:10px;background:#161625;color:white;font-family:DM Sans,sans-serif;font-size:0.9rem;outline:none;box-sizing:border-box;margin-bottom:10px"
              onfocus="this.style.borderColor='#E91E8C'" onblur="this.style.borderColor='#1e1e30'">
            <button onclick="enviarRecuperar()"
              style="width:100%;padding:11px;background:transparent;color:#E91E8C;border:1.5px solid #E91E8C;border-radius:10px;font-family:DM Sans,sans-serif;font-size:0.85rem;font-weight:700;cursor:pointer">
              Enviar enlace
            </button>
          </div>

          <!-- Sección crear cuenta mayorista (oculta por defecto) -->
          <div id="registro-mayoreo-section" style="display:none;margin-top:20px;padding-top:20px;border-top:1px solid #1e1e30">
            <p style="font-size:0.8rem;color:#8888aa;margin:0 0 14px;text-align:center">Crea tu cuenta para ver precios de mayoreo y hacer pedidos.</p>
            <input type="text" id="reg-nombre" placeholder="Nombre del negocio o tuyo"
              style="width:100%;padding:11px 16px;border:1.5px solid #1e1e30;border-radius:10px;background:#161625;color:white;font-family:DM Sans,sans-serif;font-size:0.88rem;outline:none;box-sizing:border-box;margin-bottom:8px"
              onfocus="this.style.borderColor='#E91E8C'" onblur="this.style.borderColor='#1e1e30'">
            <input type="tel" id="reg-telefono" placeholder="Teléfono (10 dígitos)"
              style="width:100%;padding:11px 16px;border:1.5px solid #1e1e30;border-radius:10px;background:#161625;color:white;font-family:DM Sans,sans-serif;font-size:0.88rem;outline:none;box-sizing:border-box;margin-bottom:8px"
              onfocus="this.style.borderColor='#E91E8C'" onblur="this.style.borderColor='#1e1e30'">
            <input type="email" id="reg-email" placeholder="Correo electrónico"
              style="width:100%;padding:11px 16px;border:1.5px solid #1e1e30;border-radius:10px;background:#161625;color:white;font-family:DM Sans,sans-serif;font-size:0.88rem;outline:none;box-sizing:border-box;margin-bottom:8px"
              onfocus="this.style.borderColor='#E91E8C'" onblur="this.style.borderColor='#1e1e30'">
            <input type="password" id="reg-password" placeholder="Crea una contraseña"
              style="width:100%;padding:11px 16px;border:1.5px solid #1e1e30;border-radius:10px;background:#161625;color:white;font-family:DM Sans,sans-serif;font-size:0.88rem;outline:none;box-sizing:border-box;margin-bottom:8px"
              onfocus="this.style.borderColor='#E91E8C'" onblur="this.style.borderColor='#1e1e30'">
            <select id="reg-tipo"
              style="width:100%;padding:11px 16px;border:1.5px solid #1e1e30;border-radius:10px;background:#161625;color:white;font-family:DM Sans,sans-serif;font-size:0.88rem;outline:none;box-sizing:border-box;margin-bottom:8px">
              <option value="mayoreo">Compro surtido variado (3+ pares)</option>
              <option value="zapateria">Compro corridas completas (zapatería)</option>
            </select>
            <input type="text" id="reg-referido" placeholder="Código de referido (opcional)"
              style="width:100%;padding:11px 16px;border:1.5px solid #1e1e30;border-radius:10px;background:#161625;color:white;font-family:DM Sans,sans-serif;font-size:0.88rem;outline:none;box-sizing:border-box;margin-bottom:12px;text-transform:uppercase"
              onfocus="this.style.borderColor='#E91E8C'" onblur="this.style.borderColor='#1e1e30'">
            <button onclick="crearCuentaMayoreo()" id="btn-registro-mayoreo"
              style="width:100%;padding:12px;background:#E91E8C;color:white;border:none;border-radius:10px;font-family:DM Sans,sans-serif;font-size:0.88rem;font-weight:700;cursor:pointer">
              Crear cuenta
            </button>
          </div>
        </div>
      </div>
    </div>

    <style>
      @media(min-width:720px){
        #login-brand-panel{display:flex!important}
      }
    </style>
  `

  window.hacerLogin = async () => {
    const email = document.getElementById('login-email').value
    const password = document.getElementById('login-password').value
    const btn = document.getElementById('btn-login')
    if (!email || !password) { mostrarError('Por favor completa todos los campos'); return }
    btn.textContent = 'Verificando...'
    btn.disabled = true

    // 1. Intentar login como empleado
    try {
      const res = await fetch('/api/empleados/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(data))
        if (data.token) localStorage.setItem('erp_token', data.token)
        window._empleadoActual = data
        renderPanel()
        window._initPushPanel()
        return
      }
    } catch(e) {}

    // 2. Intentar login como cliente
    try {
      const res2 = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data2 = await res2.json()
      if (res2.ok) {
        if (data2.tipo === 'zapateria' || data2.tipo === 'mayoreo') {
          const sesionCliente = { ...data2, email }
          localStorage.setItem(PC_SESSION_KEY, JSON.stringify(sesionCliente))
          if (data2.token) localStorage.setItem('erp_token', data2.token)
          renderPortalCliente(sesionCliente)
          return
        } else {
          mostrarError('Esta cuenta no tiene acceso al portal mayoreo')
          btn.textContent = 'Iniciar sesión'
          btn.disabled = false
          return
        }
      }
    } catch(e) {}

    mostrarError('Email o contraseña incorrectos')
    btn.textContent = 'Iniciar sesión'
    btn.disabled = false
  }

  function mostrarError(msg) {
    const el = document.getElementById('login-error')
    const ok = document.getElementById('login-ok')
    if (el) { el.textContent = msg; el.style.display = 'block' }
    if (ok) ok.style.display = 'none'
  }

  function mostrarOk(msg) {
    const el = document.getElementById('login-ok')
    const err = document.getElementById('login-error')
    if (el) { el.textContent = msg; el.style.display = 'block' }
    if (err) err.style.display = 'none'
  }

  window.mostrarRecuperar = (e) => {
    e.preventDefault()
    const sec = document.getElementById('recuperar-section')
    if (sec) sec.style.display = sec.style.display === 'none' ? 'block' : 'none'
    const inp = document.getElementById('recuperar-email')
    if (inp) inp.value = document.getElementById('login-email').value || ''
  }

  window.enviarRecuperar = async () => {
    const email = (document.getElementById('recuperar-email').value || '').trim()
    if (!email) { mostrarError('Ingresa tu correo electrónico'); return }
    try {
      const res = await fetch('/api/auth/recuperar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      mostrarOk('Si existe una cuenta con ese correo, recibirás las instrucciones.')
      const sec = document.getElementById('recuperar-section')
      if (sec) sec.style.display = 'none'
    } catch(e) {
      mostrarError('Error al enviar. Intenta de nuevo.')
    }
  }

  // ── Google Sign-In (solo clientes mayoristas) ──────────────────
  ;(async () => {
    try {
      const res = await fetch('/api/seo/config')
      const config = await res.json()
      const entry = Array.isArray(config) ? config.find(c => c.clave === 'google_client_id') : null
      const googleClientId = entry ? entry.valor : null
      if (!googleClientId) return

      const cargarScript = () => new Promise((resolve, reject) => {
        if (window.google && window.google.accounts) return resolve()
        const s = document.createElement('script')
        s.src = 'https://accounts.google.com/gsi/client'
        s.async = true; s.defer = true
        s.onload = resolve; s.onerror = reject
        document.head.appendChild(s)
      })
      await cargarScript()

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleLoginPortal,
        auto_select: false,
        cancel_on_tap_outside: true
      })
      const container = document.getElementById('google-btn-container')
      if (container) {
        window.google.accounts.id.renderButton(container, {
          theme: 'outline', size: 'large', width: 320, locale: 'es_MX', text: 'signin_with'
        })
      }
    } catch (e) {}
  })()

  async function handleGoogleLoginPortal(credentialResponse) {
    const idToken = credentialResponse.credential
    if (!idToken) { mostrarError('Error al conectar con Google'); return }
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: idToken, tipo: 'mayoreo' })
      })
      const data = await res.json()
      if (!res.ok) { mostrarError(data.error || 'Error al iniciar sesión con Google'); return }
      if (data.tipo === 'zapateria' || data.tipo === 'mayoreo') {
        const sesionCliente = { ...data, email: data.email }
        localStorage.setItem(PC_SESSION_KEY, JSON.stringify(sesionCliente))
        if (data.token) localStorage.setItem('erp_token', data.token)
        renderPortalCliente(sesionCliente)
      } else {
        mostrarError('Esta cuenta no tiene acceso al portal mayoreo')
      }
    } catch (e) {
      mostrarError('Error conectando con el servidor')
    }
  }

  window.mostrarRegistroMayoreo = (e) => {
    if (e) e.preventDefault()
    const sec = document.getElementById('registro-mayoreo-section')
    if (sec) sec.style.display = sec.style.display === 'none' ? 'block' : 'none'
    const recSec = document.getElementById('recuperar-section')
    if (recSec) recSec.style.display = 'none'
  }

  // Si llegan con un link de referido (?ref=CODIGO), precargar y abrir el formulario
  const refParam = new URLSearchParams(window.location.search).get('ref')
  if (refParam) {
    const campo = document.getElementById('reg-referido')
    if (campo) campo.value = refParam.toUpperCase()
    mostrarRegistroMayoreo()
  }

  window.crearCuentaMayoreo = async () => {
    const nombre = (document.getElementById('reg-nombre').value || '').trim()
    const telefono = (document.getElementById('reg-telefono').value || '').trim()
    const email = (document.getElementById('reg-email').value || '').trim()
    const password = document.getElementById('reg-password').value || ''
    const tipo = document.getElementById('reg-tipo').value
    const codigo_referido = (document.getElementById('reg-referido').value || '').trim().toUpperCase()

    if (!nombre || !email || !password) { mostrarError('Completa nombre, correo y contraseña'); return }
    if (password.length < 4) { mostrarError('La contraseña debe tener al menos 4 caracteres'); return }

    const btn = document.getElementById('btn-registro-mayoreo')
    btn.textContent = 'Creando cuenta...'
    btn.disabled = true

    try {
      const res = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password, telefono, tipo, codigo_referido })
      })
      const data = await res.json()
      if (!res.ok) {
        mostrarError(data.error || 'No se pudo crear la cuenta')
        btn.textContent = 'Crear cuenta'
        btn.disabled = false
        return
      }
      // Auto-login tras registro exitoso
      const resLogin = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const dataLogin = await resLogin.json()
      if (resLogin.ok) {
        const sesionCliente = { ...dataLogin, email }
        localStorage.setItem(PC_SESSION_KEY, JSON.stringify(sesionCliente))
        if (dataLogin.token) localStorage.setItem('erp_token', dataLogin.token)
        renderPortalCliente(sesionCliente)
      } else {
        mostrarOk('Cuenta creada. Ahora inicia sesión.')
        const sec = document.getElementById('registro-mayoreo-section')
        if (sec) sec.style.display = 'none'
        btn.textContent = 'Crear cuenta'
        btn.disabled = false
      }
    } catch (e) {
      mostrarError('Error al crear la cuenta. Intenta de nuevo.')
      btn.textContent = 'Crear cuenta'
      btn.disabled = false
    }
  }
}

// Helper global: encabezados con JWT para endpoints protegidos
window.authHeaders = () => {
  const token = localStorage.getItem('erp_token')
  return token ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
               : { 'Content-Type': 'application/json' }
}

// Todo lo que sigue (sesión, banner de instalar app, trampa del botón atrás)
// es exclusivo de la app con login -- la página pública del QR (estilo-publico.js)
// ya renderizó su contenido arriba y no debe ser pisado ni interferido por esto.
if (!_skuEstiloPublico) {

const sesion = localStorage.getItem(SESSION_KEY)
const sesionCliente = localStorage.getItem(PC_SESSION_KEY)

if (sesion) {
  try {
    window._empleadoActual = JSON.parse(sesion)
    renderPanel()
    window._initPushPanel()
    _manejarDeepLinkNotificacion()
  } catch(e) {
    renderLogin()
  }
} else if (sesionCliente) {
  try {
    renderPortalCliente(JSON.parse(sesionCliente))
  } catch(e) {
    renderLogin()
  }
} else {
  renderLogin()
}

// ── Banner "Instalar app" ────────────────────────────────────────────
;(() => {
  const DISMISS_KEY = 'zm_install_dismissed'
  const DIAS_ESPERA = 7

  const yaInstalada = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
  if (yaInstalada) return

  const dismissedAt = parseInt(localStorage.getItem(DISMISS_KEY) || '0', 10)
  if (dismissedAt && (Date.now() - dismissedAt) < DIAS_ESPERA * 86400000) return

  const esIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
  let deferredPrompt = null

  function mostrarBanner(modoIOS) {
    if (document.getElementById('zm-install-banner')) return
    const banner = document.createElement('div')
    banner.id = 'zm-install-banner'
    banner.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:9998;background:#161625;border:1.5px solid #E91E8C;border-radius:16px;padding:14px 16px;display:flex;align-items:center;gap:12px;box-shadow:0 8px 28px rgba(0,0,0,0.45);font-family:DM Sans,sans-serif;animation:zmSlideUp 0.3s ease-out'
    banner.innerHTML = `
      <img src="/icons/icon-192.png" style="width:40px;height:40px;border-radius:10px;flex-shrink:0">
      <div style="flex:1;min-width:0">
        <p style="margin:0;font-size:0.85rem;font-weight:700;color:white">Instala Zapatillas May</p>
        <p style="margin:2px 0 0;font-size:0.75rem;color:#a0a0c0">${modoIOS ? 'Toca compartir 􀈂 y luego "Agregar a pantalla de inicio"' : 'Acceso directo desde tu pantalla de inicio, sin navegador'}</p>
      </div>
      ${modoIOS ? '' : `<button id="zm-install-btn" style="background:#E91E8C;color:white;border:none;border-radius:100px;padding:9px 16px;font-size:0.8rem;font-weight:700;cursor:pointer;flex-shrink:0;white-space:nowrap">Instalar</button>`}
      <button id="zm-install-close" style="background:none;border:none;color:#5a5a7a;font-size:1.2rem;cursor:pointer;flex-shrink:0;line-height:1;padding:4px">✕</button>
    `
    document.body.appendChild(banner)

    const style = document.createElement('style')
    style.textContent = '@keyframes zmSlideUp{from{transform:translateY(120%)}to{transform:translateY(0)}}'
    document.head.appendChild(style)

    document.getElementById('zm-install-close').onclick = () => {
      localStorage.setItem(DISMISS_KEY, String(Date.now()))
      banner.remove()
    }
    const btnInstalar = document.getElementById('zm-install-btn')
    if (btnInstalar) {
      btnInstalar.onclick = async () => {
        if (!deferredPrompt) return
        deferredPrompt.prompt()
        await deferredPrompt.userChoice
        deferredPrompt = null
        banner.remove()
      }
    }
  }

  if (esIOS) {
    setTimeout(() => mostrarBanner(true), 2500)
  } else {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      deferredPrompt = e
      setTimeout(() => mostrarBanner(false), 1500)
    })
  }
})()

// ── Navegación interna con el botón "atrás" ─────────────────────────
// Pila de pantallas: cada sección/modal/sidebar que se abre puede
// registrar cómo "regresar". Si no hay nada que regresar, se pide
// confirmar (2 veces) antes de cerrar la app instalada.
window._zmNavStack = []
window._zmPushBack = (restoreFn) => {
  history.pushState({ zmNav: window._zmNavStack.length + 1 }, '')
  window._zmNavStack.push(restoreFn)
}
;(() => {
  let ultimoIntento = 0
  history.pushState({ zmApp: true }, '')
  window.addEventListener('popstate', () => {
    if (window._zmNavStack.length > 0) {
      const restoreFn = window._zmNavStack.pop()
      try { restoreFn() } catch (e) {}
      return
    }
    const ahora = Date.now()
    if (ahora - ultimoIntento < 2000) return // segundo "atrás" rápido: deja salir
    ultimoIntento = ahora
    history.pushState({ zmApp: true }, '') // vuelve a atrapar el siguiente "atrás"
    const toast = document.createElement('div')
    toast.textContent = 'Presiona atrás de nuevo para salir'
    toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#161625;color:white;padding:10px 20px;border-radius:100px;font-family:DM Sans,sans-serif;font-size:0.82rem;z-index:99999;box-shadow:0 4px 16px rgba(0,0,0,0.3)'
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 1800)
  })
})()

} // fin if (!_skuEstiloPublico)