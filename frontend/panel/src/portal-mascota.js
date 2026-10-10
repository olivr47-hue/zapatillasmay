// ── MASCOTA DEL PORTAL: «Tacona», una zapatilla de tacón con ojitos ─────────────────────────────────────────
// Solo vive en el portal de mayoreo. Da una frase bonita cada día y lleva a las secciones con botones (no inventa respuestas).
const PC_FRASES = [
  'Hoy es un buen día para surtir y vender.', 'Tu negocio crece un par a la vez. 👠', 'Quien se atreve a empezar, ya va a la mitad.',
  'Un buen zapato cambia el día de quien lo estrena.', 'Cada venta de hoy es una clienta feliz mañana.', 'Tu esfuerzo de hoy es tu tranquilidad de mañana.',
  'Vende con confianza: tus clientas buscan justo lo que tú ofreces.', 'Lo bonito se vende solo… ¡y tú lo sabes mostrar!', 'Un paso a la vez, pero siempre con tacones. ✨',
  'Tu constancia vale más que cualquier suerte.', 'Hoy sonríele a tu primera clienta: ya vendiste la mitad.', 'Arma tu corrida con tiempo y que no te falte talla.',
  'Eres tu mejor inversión. 💖', 'Los grandes negocios empezaron con un primer pedido.', 'Si lo sueñas y lo trabajas, se vende.',
  'Que tu día brille como un buen charol. ✨', 'Una foto bonita vende más que mil palabras.', 'Tus clientas confían en ti: cuídalas y volverán.',
  'No hay mal día para estrenar zapatos nuevos.', 'Lo que hoy parece poco, mañana es tu negocio.', 'Hoy mereces una ganancia bonita. 💰',
  'Una buena atención es el mejor descuento.', 'Empieza donde estás, con lo que tienes.', 'Cada par que vendes lleva un poquito de ti.',
  'Camina con seguridad: así se vende y así se vive.', 'Tus metas también necesitan buenos zapatos.', 'Hoy es un gran día para escribirle a tus clientas.',
  'El éxito se parece mucho a la constancia.', 'Trabaja con cariño y se nota en cada venta.', 'Tu negocio es tuyo: hazlo brillar. ✨',
  'Una clienta satisfecha le cuenta a otras tres.', 'La confianza también se estrena. 👠', 'Pide a tiempo, vende a tiempo, descansa a tiempo.',
  'Tú pones las ganas, yo pongo los tacones.', 'Cada día es una nueva oportunidad de vender.', 'Lo importante es no dejar de caminar.',
  'Tu sonrisa también vende. 😊', 'Los mejores resultados llegan con paciencia y buen ritmo.', 'Hoy compartes belleza, no solo zapatos.',
  'Sé la razón por la que alguien se sienta segura hoy.', 'Cuando dudes, recuerda por qué empezaste.', 'Que hoy todo te salga a pedir de talla. 😉',
  'Tus ahorros de hoy son tu surtido de mañana.', 'Brillar es una decisión diaria. ✨', 'Una buena corrida es medio negocio hecho.'
]
const PC_ATAJOS = [
  ['✨ Ver novedades', "pcIrA('novedades')"], ['👟 Armar mi pedido', "pcIrA('catalogo')"], ['🛒 Mi carrito', "pcIrA('carrito')"],
  ['📦 Mis pedidos', "pcIrA('pedidos')"], ['💰 Cómo vender', "pcIrA('vender')"], ['🧮 Calculadora', 'pcAbrirCalculadora()']
]
const _esc = (t) => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function fraseDelDia(extra) {
  const d = new Date(), n = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000)
  return PC_FRASES[(n + (extra || 0)) % PC_FRASES.length]
}

window.pcMascotaFrase = function () {
  window._pcFraseExtra = (window._pcFraseExtra || 0) + 1
  const el = document.getElementById('pcm-frase')
  if (el) el.textContent = fraseDelDia(window._pcFraseExtra * 7)
}

window.pcMascotaToggle = function (abrir) {
  const p = document.getElementById('pcm-panel'), g = document.getElementById('pcm-globo')
  if (g) g.style.display = 'none'
  if (!p) return
  const ver = typeof abrir === 'boolean' ? abrir : p.style.display === 'none'
  p.style.display = ver ? 'block' : 'none'
}

function montar(sesion) {
  const nombre = (sesion.nombre || '').split(' ')[0] || ''
  const hoy = new Date().toISOString().slice(0, 10)
  let visto = ''
  try { visto = localStorage.getItem('pcm_globo') || '' } catch (e) {}
  const wa = 'https://wa.me/5214792244560?text=' + encodeURIComponent('Hola, soy ' + (sesion.nombre || 'cliente') + ' del portal mayoreo y tengo una pregunta 👋')
  const r = document.createElement('div')
  r.id = 'pcm-raiz'
  r.innerHTML = `<style>
    #pcm-raiz{position:fixed;right:18px;bottom:24px;z-index:490;font-family:inherit}
    @media(max-width:768px){#pcm-raiz{bottom:84px}}
    #pcm-btn{width:53px;height:59px;border:none;background:none;cursor:pointer;padding:0;display:flex;align-items:flex-end;justify-content:center;animation:pcmBob 3.2s ease-in-out infinite;filter:drop-shadow(0 6px 10px rgba(120,0,60,.35))}
    #pcm-btn img{width:100%;height:100%;object-fit:contain;display:block;pointer-events:none}
    @keyframes pcmBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
    @media(prefers-reduced-motion:reduce){#pcm-btn{animation:none}}
    #pcm-globo,#pcm-panel{position:absolute;right:0;bottom:68px;background:var(--pc-bg-elev,#fff);color:var(--pc-text,#222);border:1px solid var(--pc-border,#eee);border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.25)}
    #pcm-globo{width:230px;padding:12px 14px;font-size:.82rem;line-height:1.35;cursor:pointer}
    #pcm-panel{width:min(290px,calc(100vw - 28px));padding:14px}
    .pcm-chip{border:1px solid var(--pc-border,#eee);background:transparent;color:var(--pc-text,#222);border-radius:100px;padding:7px 12px;font-size:.76rem;font-weight:600;cursor:pointer;font-family:inherit}
    .pcm-chip:hover{border-color:#E91E8C;color:#E91E8C}
  </style>
  <div id="pcm-globo" style="display:none" onclick="pcMascotaToggle(true)"><strong style="color:#E91E8C">${nombre ? 'Hola, ' + _esc(nombre) + ' 💖' : 'Hola 💖'}</strong><br>${_esc(fraseDelDia())}</div>
  <div id="pcm-panel" style="display:none">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <strong style="font-size:.9rem">👠 Tacona, tu asistente</strong>
      <button onclick="pcMascotaToggle(false)" aria-label="Cerrar" style="background:none;border:none;font-size:1.1rem;cursor:pointer;color:var(--pc-muted,#888)">✕</button>
    </div>
    <div style="background:rgba(233,30,140,.08);border-radius:12px;padding:10px 12px;margin-bottom:10px">
      <div style="font-size:.66rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#E91E8C;margin-bottom:4px">Frase del día</div>
      <div id="pcm-frase" style="font-size:.84rem;line-height:1.35">${_esc(fraseDelDia())}</div>
      <button onclick="pcMascotaFrase()" style="margin-top:6px;background:none;border:none;color:#E91E8C;font-size:.72rem;font-weight:700;cursor:pointer;padding:0;font-family:inherit">Otra frase →</button>
    </div>
    <div style="font-size:.76rem;color:var(--pc-muted,#888);margin-bottom:6px">¿A dónde quieres ir?</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px">${PC_ATAJOS.map(x => `<button class="pcm-chip" onclick="pcMascotaToggle(false);${x[1]}">${x[0]}</button>`).join('')}
      <a class="pcm-chip" style="text-decoration:none" target="_blank" rel="noopener" href="${_esc(wa)}">💬 Hablar con mi asesora</a></div>
  </div>
  <button id="pcm-btn" onclick="pcMascotaToggle()" aria-label="Tacona, tu asistente" title="Tacona">
    <img src="/tacona.png" alt="" width="53" height="59" decoding="async">
  </button>`
  document.body.appendChild(r)
  if (visto !== hoy) {
    setTimeout(() => {
      const g = document.getElementById('pcm-globo'), p = document.getElementById('pcm-panel')
      if (g && p && p.style.display === 'none') { g.style.display = 'block'; setTimeout(() => { g.style.display = 'none' }, 9000) }
    }, 2500)
    try { localStorage.setItem('pcm_globo', hoy) } catch (e) {}
  }
}

// El portal se vuelve a dibujar al cambiar de sección o al cerrar sesión: se revisa seguido si la mascota debe estar o no
export function iniciarMascota(getSesion) {
  setInterval(() => {
    const sesion = getSesion()
    const dentro = document.getElementById('pc-main') && sesion
    const r = document.getElementById('pcm-raiz')
    if (dentro && !r) montar(sesion)
    else if (r && !document.getElementById('pc-main')) r.remove()
  }, 1500)
}
