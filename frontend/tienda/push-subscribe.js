// Notificaciones push de la tienda — banner discreto de opt-in + suscripcion.
;(function () {
  const API = 'https://zapatillasmay-production.up.railway.app'
  const DISMISS_KEY = 'zm_push_dismissed'

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const raw = atob(base64)
    const output = new Uint8Array(raw.length)
    for (let i = 0; i < raw.length; ++i) output[i] = raw.charCodeAt(i)
    return output
  }

  function mostrarBanner(onAceptar) {
    if (document.getElementById('zm-push-banner')) return
    const el = document.createElement('div')
    el.id = 'zm-push-banner'
    el.style.cssText = 'position:fixed;bottom:16px;left:16px;right:16px;max-width:380px;margin:0 auto;background:#1a1a1a;color:#fff;border-radius:14px;padding:14px 16px;box-shadow:0 8px 24px rgba(0,0,0,0.25);z-index:9999;font-family:inherit;display:flex;align-items:center;gap:12px;animation:zmPushIn .3s ease'
    el.innerHTML = `
      <style>@keyframes zmPushIn{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}</style>
      <span style="font-size:1.6rem;flex-shrink:0">🔔</span>
      <div style="flex:1;min-width:0">
        <p style="margin:0 0 2px;font-size:0.85rem;font-weight:700">Activa avisos</p>
        <p style="margin:0;font-size:0.78rem;color:#ccc">Te avisamos de tu pedido y ofertas, como WhatsApp.</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0">
        <button id="zm-push-si" style="background:#E91E8C;color:#fff;border:none;border-radius:8px;padding:6px 12px;font-size:0.78rem;font-weight:700;cursor:pointer">Activar</button>
        <button id="zm-push-no" style="background:transparent;color:#999;border:none;font-size:0.72rem;cursor:pointer;padding:2px">No, gracias</button>
      </div>`
    document.body.appendChild(el)
    document.getElementById('zm-push-si').onclick = function () {
      el.remove()
      onAceptar()
    }
    document.getElementById('zm-push-no').onclick = function () {
      el.remove()
      try { localStorage.setItem(DISMISS_KEY, '1') } catch (e) {}
    }
  }

  async function suscribir() {
    try {
      const reg = await navigator.serviceWorker.register('/sw-push.js')
      const permiso = await Notification.requestPermission()
      if (permiso !== 'granted') return
      const res = await fetch(API + '/push/public-key')
      const { publicKey, configurado } = await res.json()
      if (!configurado) return
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      })
      await fetch(API + '/push/suscribir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub.toJSON(), sitio: 'tienda', user_agent: navigator.userAgent }),
      })
    } catch (e) { /* silencioso: navegador sin soporte, permiso bloqueado, etc. */ }
  }

  function init() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
    if (Notification.permission === 'granted') { suscribir(); return }
    if (Notification.permission === 'denied') return
    try { if (localStorage.getItem(DISMISS_KEY)) return } catch (e) {}
    setTimeout(function () { mostrarBanner(suscribir) }, 9000)
  }

  if (document.readyState === 'complete') init()
  else window.addEventListener('load', init)
})()
