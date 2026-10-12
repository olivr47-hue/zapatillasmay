// Actualización automática del panel/portal.
// Una pestaña abierta sigue con el código con el que cargó aunque se publique una versión nueva (en las computadoras que nunca se
// cierran podía pasar días). Aquí se compara el archivo principal de la página abierta con el que sirve el sitio ahora y, si cambió,
// se recarga sola, pero solo cuando no estorba: pestaña sin uso unos minutos, sin escribir en un campo y sin ventanas abiertas.
// Solo en el sitio publicado (en local y en la demo no hay archivo con huella en /assets/).
const _ACTUAL = (() => {
  try {
    const s = document.querySelector('script[type="module"][src*="/assets/index-"]')
    return s ? new URL(s.src, location.href).pathname : null
  } catch (e) { return null }
})()

if (_ACTUAL && !window.__ZM_DEMO) {
  const MIN_ENTRE_REVISIONES = 2 * 60 * 1000     // no revisar más seguido que esto
  const REVISION_PERIODICA = 20 * 60 * 1000      // además, cada 20 min si la pestaña sigue a la vista
  const INACTIVIDAD = window.__ZM_AUTO_INACT || 2 * 60 * 1000   // sin tocar nada durante este tiempo
  const NO_RECARGAR_SEGUIDO = 10 * 60 * 1000     // protección contra recargas en bucle (p. ej. caché atrasada)

  let ultimaActividad = Date.now()
  let ultimaRevision = 0
  let hayNueva = false
  const marcar = () => { ultimaActividad = Date.now() }
  for (const ev of ['pointerdown', 'keydown', 'touchstart', 'wheel', 'scroll']) window.addEventListener(ev, marcar, { passive: true, capture: true })

  const _visible = (el) => !!(el && (el.offsetWidth || el.offsetHeight || el.getClientRects().length))
  const _estorba = () => {
    const a = document.activeElement
    if (a && (a.tagName === 'TEXTAREA' || a.isContentEditable || (a.tagName === 'INPUT' && !['button', 'checkbox', 'radio', 'submit', 'range', 'file'].includes((a.type || '').toLowerCase())) || a.tagName === 'SELECT')) return true
    if (document.querySelector('dialog[open]')) return true
    for (const m of document.querySelectorAll('[id^="modal"], .modal, .modal-overlay')) if (_visible(m)) return true
    return false
  }

  const _intentarRecargar = () => {
    if (!hayNueva) return
    if (Date.now() - ultimaActividad < INACTIVIDAD || _estorba()) { setTimeout(_intentarRecargar, 30 * 1000); return }
    try {
      const ult = parseInt(sessionStorage.getItem('zm_auto_recarga') || '0', 10)
      if (Date.now() - ult < NO_RECARGAR_SEGUIDO) return
      sessionStorage.setItem('zm_auto_recarga', String(Date.now()))
    } catch (e) {}
    location.reload()
  }

  const revisar = async () => {
    if (hayNueva || Date.now() - ultimaRevision < MIN_ENTRE_REVISIONES) return
    ultimaRevision = Date.now()
    try {
      const r = await fetch('/?_v=' + Date.now(), { cache: 'no-store' })
      if (!r.ok) return
      const html = await r.text()
      const m = html.match(/<script[^>]+type="module"[^>]+src="([^"]*\/assets\/index-[^"]+\.js)"/)
      if (m && new URL(m[1], location.href).pathname !== _ACTUAL) { hayNueva = true; _intentarRecargar() }
    } catch (e) {}
  }

  document.addEventListener('visibilitychange', () => { if (!document.hidden) revisar() })
  setInterval(() => { if (!document.hidden) revisar() }, REVISION_PERIODICA)
}
