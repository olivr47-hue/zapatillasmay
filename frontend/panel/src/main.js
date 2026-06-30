import './style.css'
document.querySelector('#app').style.cssText = 'display:flex;min-height:100vh;width:100%;flex:1'
import { renderPanel } from './panel.js'
import { renderPortalCliente } from './portal-cliente.js'

const SESSION_KEY    = 'erp_empleado'
const PC_SESSION_KEY = 'pc_sesion'

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

          <p style="text-align:center;margin-top:16px">
            <a href="#" onclick="mostrarRecuperar(event)"
               style="color:#E91E8C;font-size:0.8rem;text-decoration:none;opacity:0.85"
               onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.85'">
              ¿Olvidaste tu contraseña?
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
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(data))
        if (data.token) sessionStorage.setItem('erp_token', data.token)
        window._empleadoActual = data
        renderPanel()
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
          sessionStorage.setItem(PC_SESSION_KEY, JSON.stringify(sesionCliente))
          if (data2.token) sessionStorage.setItem('erp_token', data2.token)
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
}

// Helper global: encabezados con JWT para endpoints protegidos
window.authHeaders = () => {
  const token = sessionStorage.getItem('erp_token')
  return token ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
               : { 'Content-Type': 'application/json' }
}

const sesion = sessionStorage.getItem(SESSION_KEY)
const sesionCliente = sessionStorage.getItem(PC_SESSION_KEY)

if (sesion) {
  try {
    window._empleadoActual = JSON.parse(sesion)
    renderPanel()
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