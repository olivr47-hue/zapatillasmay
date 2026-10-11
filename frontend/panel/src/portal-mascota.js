// ── MASCOTA DEL PORTAL: «Tacona», una zapatilla de tacón con ojitos ─────────────────────────────────────────
// Solo vive en el portal de mayoreo. Da una frase bonita distinta en cada entrada y lleva a las secciones con botones (no inventa respuestas).
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

// Las frases se sacan de una «bolsa» barajada que se guarda en el navegador: no se repite ninguna hasta haber visto las 45
function siguienteFrase() {
  let bolsa = [], ultima = -1
  try { bolsa = JSON.parse(localStorage.getItem('pcm_bolsa') || '[]').filter(i => Number.isInteger(i) && i >= 0 && i < PC_FRASES.length); ultima = parseInt(localStorage.getItem('pcm_ultima') || '-1', 10) } catch (e) {}
  if (!bolsa.length) {
    bolsa = PC_FRASES.map((_, i) => i)
    for (let i = bolsa.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [bolsa[i], bolsa[j]] = [bolsa[j], bolsa[i]] }
    if (bolsa[bolsa.length - 1] === ultima && bolsa.length > 1) bolsa.unshift(bolsa.pop())   // la primera de la nueva vuelta nunca es la última que vio
  }
  const idx = bolsa.pop()
  try { localStorage.setItem('pcm_bolsa', JSON.stringify(bolsa)); localStorage.setItem('pcm_ultima', String(idx)) } catch (e) {}
  return PC_FRASES[idx]
}
let _fraseEntrada = null   // la frase de esta entrada (se saca una sola vez por carga de página)
function fraseDeEntrada() { if (_fraseEntrada === null) _fraseEntrada = siguienteFrase(); return _fraseEntrada }

window.pcMascotaFrase = function () {
  const el = document.getElementById('pcm-frase')
  if (el) el.textContent = siguienteFrase()
}

window.pcMascotaToggle = function (abrir) {
  const p = document.getElementById('pcm-panel'), g = document.getElementById('pcm-globo')
  if (g) g.style.display = 'none'
  if (!p) return
  const ver = typeof abrir === 'boolean' ? abrir : p.style.display === 'none'
  p.style.display = ver ? 'block' : 'none'
}

// Preguntas frecuentes: respuestas FIJAS tomadas de las instrucciones del portal («Cómo funciona el portal»). No se inventa nada:
// lo que no está aquí se resuelve por WhatsApp con la asesora.
const PC_FAQ = [
  ['¿Cómo agrego pares al carrito?', 'Entra a un producto y toca la talla que quieras. Puedes tocar varias tallas y colores del mismo modelo antes de confirmar. Al darle «Agregar al pedido» te quedas en el mismo producto para seguir agregando. Puedes seguir agregando pares en cualquier momento, incluso después de apartar algunos.', ['👟 Ir a Productos', "pcIrA('catalogo')"]],
  ['¿Qué es apartar y cómo lo hago?', 'En tu carrito toca «Apartar pares específicos» y elige exactamente cuáles pares quieres que te reservemos. Al enviarlos quedan «esperando aprobación»: nosotros revisamos y aprobamos el apartado, y hasta ese momento se reserva el stock de verdad. Puedes apartar cuantas veces quieras.', ['🛒 Ir a mi carrito', "pcIrA('carrito')"]],
  ['¿Cómo veo y cierro mis apartados?', 'Cuando tienes pares apartados aparece «Apartados» en el menú (y un banner en tu carrito) con el desglose completo. Ahí puedes pedir que se quite un par (queda pendiente hasta que lo autoricemos) o darle «Cerrar pedido» cuando quieras pagar todo lo apartado.', ['🔒 Ir a Apartados', "pcIrA('apartados')"]],
  ['¿Cómo pago mi pedido?', 'Al cerrar el pedido eliges Transferencia (te mostramos los datos bancarios) o Tarjeta (te generamos un link de pago). Ojo: una vez que cierras con una forma de pago no se puede cambiar sola desde el portal; si necesitas cambiarla, escríbele a tu asesora por WhatsApp.', null],
  ['¿Puedo cerrar el pedido sin apartar?', 'Sí. En tu carrito está el botón «Cerrar pedido» para pagar de una vez todo lo que llevas, sin pasar por la aprobación de apartado.', ['🛒 Ir a mi carrito', "pcIrA('carrito')"]],
  ['¿Cómo comparto o descargo las fotos?', 'En la ficha de un producto toca cualquier foto para verla en grande y compartirla. También puedes activar «seleccionar varias» para compartir o descargar varias fotos del mismo modelo. En el catálogo puedes seleccionar varios modelos o colores y compartirlos juntos por WhatsApp.', ['👟 Ir a Productos', "pcIrA('catalogo')"]],
  ['¿Dónde descargo los catálogos en PDF?', 'En «Catálogos» bajas un PDF con las fotos de todos los modelos activos de cada categoría, listo para mandarlo a tus clientas por WhatsApp.', ['📥 Ir a Catálogos', "pcIrA('catalogos')"]],
  ['¿Dónde pongo mi dirección de envío?', 'En «Mi cuenta». La dirección de envío es necesaria para poder cerrar cualquier pedido. Ahí también actualizas tus datos de contacto y ves tu crédito disponible si tienes.', ['👤 Ir a Mi cuenta', "pcIrA('cuenta')"]],
  ['¿Dónde veo mis pedidos?', 'En «Mis pedidos» ves los pedidos que ya hiciste.', ['📦 Ir a Mis pedidos', "pcIrA('pedidos')"]],
  ['¿Cómo pido una función o aviso de un error?', '«Sugerencias» es para escribirnos directo si quieres pedir una función nueva, avisar de un error o darnos cualquier recomendación sobre el portal.', ['💡 Ir a Sugerencias', "pcIrA('sugerencias')"]],
  ['Mi duda no está aquí', 'Escríbele a tu asesora por WhatsApp y te ayuda.', 'wa']
]
window.pcMascotaFaq = function (ver) {
  const f = document.getElementById('pcm-faq'), m = document.getElementById('pcm-menu'), c = document.getElementById('pcm-chat')
  if (!f || !m) return
  if (c) c.style.display = 'none'
  f.style.display = ver ? 'block' : 'none'
  m.style.display = ver ? 'none' : 'block'
}

// ── Chat: la clienta escribe y Tacona responde (el servidor usa solo la información del portal; ver backend/routers/tacona.py) ──
const _hist = []
const _SUGERENCIAS = ['¿Cómo aparto pares?', '¿Cómo pago mi pedido?', '¿Cómo comparto fotos sin precios?', '¿Cuánto tarda el envío?']

function _burbuja(rol, texto) {
  const caja = document.getElementById('pcm-msgs'); if (!caja) return null
  const b = document.createElement('div')
  b.style.cssText = rol === 'user'
    ? 'align-self:flex-end;max-width:85%;background:#E91E8C;color:#fff;border-radius:14px 14px 4px 14px;padding:8px 12px;font-size:.8rem;line-height:1.4'
    : 'align-self:flex-start;max-width:90%;background:rgba(233,30,140,.08);color:var(--pc-text,#222);border-radius:14px 14px 14px 4px;padding:8px 12px;font-size:.8rem;line-height:1.45;white-space:pre-wrap'
  b.textContent = texto
  caja.appendChild(b); caja.scrollTop = caja.scrollHeight
  return b
}

function _botones(acciones) {
  const caja = document.getElementById('pcm-msgs'); if (!caja || !acciones || !acciones.length) return
  const f = document.createElement('div'); f.style.cssText = 'align-self:flex-start;display:flex;flex-wrap:wrap;gap:6px'
  acciones.forEach(a => {
    if (a.id === 'wa') {
      const l = document.createElement('a'); l.className = 'pcm-chip'; l.style.textDecoration = 'none'; l.target = '_blank'; l.rel = 'noopener'; l.href = window._pcmWa || '#'; l.textContent = a.texto; f.appendChild(l)
    } else {
      const b = document.createElement('button'); b.className = 'pcm-chip'; b.textContent = a.texto
      b.onclick = () => { window.pcMascotaToggle(false); if (typeof window.pcIrA === 'function') window.pcIrA(a.id) }
      f.appendChild(b)
    }
  })
  caja.appendChild(f); caja.scrollTop = caja.scrollHeight
}

window.pcMascotaChat = function (ver) {
  const c = document.getElementById('pcm-chat'), m = document.getElementById('pcm-menu'), f = document.getElementById('pcm-faq')
  if (!c || !m) return
  if (f) f.style.display = 'none'
  c.style.display = ver ? 'block' : 'none'
  m.style.display = ver ? 'none' : 'block'
  if (!ver) return
  const caja = document.getElementById('pcm-msgs')
  if (caja && !caja.children.length) {
    _burbuja('assistant', '¡Hola! Soy Tacona 👠 Pregúntame cómo usar el portal, apartar, pagar o cómo funcionan los envíos y los cambios.')
    const sug = document.getElementById('pcm-sug')
    sug.innerHTML = ''
    _SUGERENCIAS.forEach(t => { const b = document.createElement('button'); b.className = 'pcm-chip'; b.textContent = t; b.onclick = () => window.pcMascotaEnviar(t); sug.appendChild(b) })
  }
  setTimeout(() => { const i = document.getElementById('pcm-in'); if (i) i.focus() }, 50)
}

window.pcMascotaEnviar = async function (texto) {
  const inp = document.getElementById('pcm-in'), btn = document.getElementById('pcm-send'), sug = document.getElementById('pcm-sug')
  if (!inp || (btn && btn.disabled)) return
  const q = String(texto || inp.value || '').trim().slice(0, 300); if (!q) return
  inp.value = ''; if (sug) sug.innerHTML = ''
  _burbuja('user', q); _hist.push({ rol: 'user', texto: q })
  const espera = _burbuja('assistant', 'Tacona está escribiendo…'); if (btn) btn.disabled = true
  try {
    let tk = ''; try { tk = localStorage.getItem('erp_token') || '' } catch (e) {}
    const r = await fetch('/api/portal/tacona', { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, tk ? { Authorization: 'Bearer ' + tk } : {}), body: JSON.stringify({ mensajes: _hist.slice(-8) }) })
    const d = await r.json().catch(() => ({}))
    const resp = d.respuesta || d.error || 'No pude responder ahora. Intenta de nuevo o escríbele a tu asesora.'
    if (espera) espera.textContent = resp
    if (d.respuesta) _hist.push({ rol: 'assistant', texto: d.respuesta }); else _hist.pop()
    _botones(d.acciones || (d.respuesta ? [] : [{ id: 'wa', texto: '💬 Hablar con mi asesora' }]))
  } catch (e) {
    if (espera) espera.textContent = 'No hay conexión. Intenta de nuevo en un momento.'
    _hist.pop()
  }
  if (btn) btn.disabled = false
  const caja = document.getElementById('pcm-msgs'); if (caja) caja.scrollTop = caja.scrollHeight
  if (inp) inp.focus()
}
window.pcMascotaPregunta = function (i) {
  document.querySelectorAll('.pcm-resp').forEach(el => { if (el.dataset.i !== String(i)) el.style.display = 'none' })
  const r = document.querySelector('.pcm-resp[data-i="' + i + '"]')
  if (r) r.style.display = r.style.display === 'block' ? 'none' : 'block'
}

let _globoMostrado = false
function montar(sesion) {
  const nombre = (sesion.nombre || '').split(' ')[0] || ''
  const wa = 'https://wa.me/5214792244560?text=' + encodeURIComponent('Hola, soy ' + (sesion.nombre || 'cliente') + ' del portal mayoreo y tengo una pregunta 👋')
  window._pcmWa = wa
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
    #pcm-panel{width:min(300px,calc(100vw - 28px));padding:14px;max-height:calc(100vh - 140px);overflow-y:auto}
    .pcm-chip{border:1px solid var(--pc-border,#eee);background:transparent;color:var(--pc-text,#222);border-radius:100px;padding:7px 12px;font-size:.76rem;font-weight:600;cursor:pointer;font-family:inherit}
    .pcm-chip:hover{border-color:#E91E8C;color:#E91E8C}
  </style>
  <div id="pcm-globo" style="display:none" onclick="pcMascotaToggle(true)"><strong style="color:#E91E8C">${nombre ? 'Hola, ' + _esc(nombre) + ' 💖' : 'Hola 💖'}</strong><br>${_esc(fraseDeEntrada())}</div>
  <div id="pcm-panel" style="display:none">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <strong style="font-size:.9rem">👠 Tacona, tu asistente</strong>
      <button onclick="pcMascotaToggle(false)" aria-label="Cerrar" style="background:none;border:none;font-size:1.1rem;cursor:pointer;color:var(--pc-muted,#888)">✕</button>
    </div>
    <div id="pcm-menu">
    <div style="background:rgba(233,30,140,.08);border-radius:12px;padding:10px 12px;margin-bottom:10px">
      <div style="font-size:.66rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#E91E8C;margin-bottom:4px">Para ti hoy</div>
      <div id="pcm-frase" style="font-size:.84rem;line-height:1.35">${_esc(fraseDeEntrada())}</div>
      <button onclick="pcMascotaFrase()" style="margin-top:6px;background:none;border:none;color:#E91E8C;font-size:.72rem;font-weight:700;cursor:pointer;padding:0;font-family:inherit">Otra frase →</button>
    </div>
    <button class="pcm-chip" onclick="pcMascotaChat(true)" style="width:100%;margin-bottom:8px;background:#E91E8C;color:#fff;border-color:#E91E8C">💬 Pregúntale a Tacona</button>
    <button class="pcm-chip" onclick="pcMascotaFaq(true)" style="width:100%;margin-bottom:10px">❓ Preguntas frecuentes</button>
    <div style="font-size:.76rem;color:var(--pc-muted,#888);margin-bottom:6px">¿A dónde quieres ir?</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px">${PC_ATAJOS.map(x => `<button class="pcm-chip" onclick="pcMascotaToggle(false);${x[1]}">${x[0]}</button>`).join('')}
      <a class="pcm-chip" style="text-decoration:none" target="_blank" rel="noopener" href="${_esc(wa)}">💬 Hablar con mi asesora</a></div>
    </div>
    <div id="pcm-chat" style="display:none">
      <button onclick="pcMascotaChat(false)" style="background:none;border:none;color:#E91E8C;font-size:.76rem;font-weight:700;cursor:pointer;padding:0 0 8px;font-family:inherit">← Volver</button>
      <div style="font-size:.78rem;font-weight:700;margin-bottom:8px">Pregúntale a Tacona</div>
      <div id="pcm-msgs" style="max-height:32vh;overflow-y:auto;display:flex;flex-direction:column;gap:8px;margin-bottom:8px"></div>
      <div id="pcm-sug" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px"></div>
      <form onsubmit="pcMascotaEnviar();return false" style="display:flex;gap:6px">
        <input id="pcm-in" maxlength="300" autocomplete="off" placeholder="Escribe tu pregunta…" style="flex:1;min-width:0;padding:9px 12px;border-radius:100px;border:1px solid var(--pc-border,#ddd);background:var(--pc-bg,#fff);color:var(--pc-text,#222);font-family:inherit;font-size:.8rem">
        <button type="submit" id="pcm-send" aria-label="Enviar" style="width:38px;height:38px;border-radius:50%;border:none;background:#E91E8C;color:#fff;font-size:1rem;cursor:pointer">➤</button>
      </form>
      <p style="font-size:.64rem;color:var(--pc-muted,#888);margin:8px 0 0;line-height:1.4">Tacona no ve tus pedidos, precios ni existencias: para eso, escríbele a tu asesora.</p>
    </div>
    <div id="pcm-faq" style="display:none">
      <button onclick="pcMascotaFaq(false)" style="background:none;border:none;color:#E91E8C;font-size:.76rem;font-weight:700;cursor:pointer;padding:0 0 8px;font-family:inherit">← Volver</button>
      <div style="font-size:.78rem;font-weight:700;margin-bottom:8px">Preguntas frecuentes</div>
      <div style="max-height:46vh;overflow-y:auto;padding-right:2px">${PC_FAQ.map((q, i) => `
        <div style="border-bottom:1px solid var(--pc-border,#eee);padding:2px 0">
          <button onclick="pcMascotaPregunta(${i})" style="width:100%;text-align:left;background:none;border:none;padding:9px 0;font-size:.8rem;font-weight:600;color:var(--pc-text,#222);cursor:pointer;font-family:inherit">${_esc(q[0])}</button>
          <div class="pcm-resp" data-i="${i}" style="display:none;font-size:.78rem;line-height:1.45;color:var(--pc-text-3,#555);padding:0 0 10px">${_esc(q[1])}
            ${q[2] === 'wa' ? `<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px"><button class="pcm-chip" onclick="pcMascotaChat(true)">💬 Preguntarle a Tacona</button><a class="pcm-chip" style="text-decoration:none;display:inline-block" target="_blank" rel="noopener" href="${_esc(wa)}">💬 Hablar con mi asesora</a></div>` : q[2] ? `<div style="margin-top:8px"><button class="pcm-chip" onclick="pcMascotaToggle(false);${q[2][1]}">${q[2][0]}</button></div>` : ''}
          </div>
        </div>`).join('')}</div>
    </div>
  </div>
  <button id="pcm-btn" onclick="pcMascotaToggle()" aria-label="Tacona, tu asistente" title="Tacona">
    <img src="/tacona.png" alt="" width="53" height="59" decoding="async">
  </button>`
  document.body.appendChild(r)
  if (!_globoMostrado) {
    _globoMostrado = true
    setTimeout(() => {
      const g = document.getElementById('pcm-globo'), p = document.getElementById('pcm-panel')
      if (g && p && p.style.display === 'none') { g.style.display = 'block'; setTimeout(() => { g.style.display = 'none' }, 9000) }
    }, 2500)
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
