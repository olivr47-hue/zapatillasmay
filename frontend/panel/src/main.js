import './style.css'
document.querySelector('#app').style.cssText = 'display:flex;min-height:100vh;width:100%'
import { renderPanel } from './panel.js'

const SESSION_KEY = 'erp_empleado'

function renderLogin() {
  document.querySelector('#app').innerHTML = `
    <div style="min-height:100vh;background:#0f0f1a;display:flex;align-items:center;justify-content:center;padding:20px">
      <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:40px;width:100%;max-width:400px">
        <div style="text-align:center;margin-bottom:32px">
          <h1 style="font-family:DM Sans,sans-serif;font-size:1.5rem;font-weight:700;color:white">Zapatillas <span style="color:#E91E8C">May</span></h1>
          <p style="color:#8892a4;font-size:0.85rem;margin-top:6px">Panel de administracion</p>
        </div>
        <div style="margin-bottom:16px">
          <label style="display:block;font-size:0.72rem;font-weight:600;color:#8892a4;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Email</label>
          <input type="email" id="login-email" placeholder="correo@ejemplo.com"
            style="width:100%;padding:10px 14px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:rgba(255,255,255,0.05);color:white;font-family:DM Sans,sans-serif;font-size:0.875rem;outline:none"
            onkeydown="if(event.key==='Enter')hacerLogin()">
        </div>
        <div style="margin-bottom:24px">
          <label style="display:block;font-size:0.72rem;font-weight:600;color:#8892a4;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Contrasena</label>
          <input type="password" id="login-password" placeholder="••••••••"
            style="width:100%;padding:10px 14px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:rgba(255,255,255,0.05);color:white;font-family:DM Sans,sans-serif;font-size:0.875rem;outline:none"
            onkeydown="if(event.key==='Enter')hacerLogin()">
        </div>
        <button onclick="hacerLogin()" id="btn-login"
          style="width:100%;padding:12px;background:linear-gradient(135deg,#E91E8C,#c2187a);color:white;border:none;border-radius:8px;font-family:DM Sans,sans-serif;font-size:0.875rem;font-weight:600;cursor:pointer">
          Iniciar sesion
        </button>
        <p id="login-error" style="color:#fc8181;font-size:0.82rem;text-align:center;margin-top:12px;display:none"></p>
      </div>
    </div>
  `

  window.hacerLogin = async () => {
    const email = document.getElementById('login-email').value
    const password = document.getElementById('login-password').value
    const btn = document.getElementById('btn-login')
    const error = document.getElementById('login-error')
    if (!email || !password) { mostrarError('Por favor completa todos los campos'); return }
    btn.textContent = 'Verificando...'
    btn.disabled = true
    try {
      const res = await fetch('/api/empleados/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (res.ok) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(data))
        window._empleadoActual = data
        renderPanel()
      } else {
        mostrarError(data.error || 'Email o contrasena incorrectos')
        btn.textContent = 'Iniciar sesion'
        btn.disabled = false
      }
    } catch(e) {
      mostrarError('Error conectando con el servidor')
      btn.textContent = 'Iniciar sesion'
      btn.disabled = false
    }
  }

  function mostrarError(msg) {
    const error = document.getElementById('login-error')
    if (error) { error.textContent = msg; error.style.display = 'block' }
  }
}

const sesion = sessionStorage.getItem(SESSION_KEY)
if (sesion) {
  try {
    window._empleadoActual = JSON.parse(sesion)
    renderPanel()
  } catch(e) {
    renderLogin()
  }
} else {
  renderLogin()
}