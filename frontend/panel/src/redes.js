// ═══ Estudio de publicaciones (Facebook e Instagram) ═══════════════════════════════════════════════════
// Arma imágenes bonitas de los modelos nuevos (foto, carrusel, collage o historia), escribe el texto de la publicación y las
// publica en Facebook e Instagram con un botón (o las descarga). Las imágenes se dibujan aquí mismo (canvas): lo que ves en la
// vista previa es exactamente lo que se publica.
const API = '/api'
const esc = (v) => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

const FORMATOS = {
  cuadro: { w: 1080, h: 1080, label: 'Cuadrada 1:1', nota: 'Feed de Instagram y Facebook' },
  vertical: { w: 1080, h: 1350, label: 'Vertical 4:5', nota: 'La que más espacio ocupa en Instagram' },
  historia: { w: 1080, h: 1920, label: 'Historia 9:16', nota: 'Historias de Instagram' },
}
const ESTILOS = {
  blush: { nombre: 'Rosa blush', bg: ['#fbeeee', '#f6dede'], texto: '#4a2733', suave: '#9a6a76', acento: '#b76e79', oro: '#c9a07f', tarjeta: '#fffaf8', logo: '/logo-marca.png', oscuro: false },
  champan: { nombre: 'Champán dorado', bg: ['#f5ebdf', '#ead8c3'], texto: '#43302a', suave: '#8c7466', acento: '#b8895d', oro: '#b8895d', tarjeta: '#fffaf3', logo: '/logo-marca.png', oscuro: false, arco: true },
  perla: { nombre: 'Blanco perla', bg: ['#ffffff', '#f7f1f2'], texto: '#3d2a33', suave: '#98808a', acento: '#c2788a', oro: '#d3b08e', tarjeta: '#ffffff', logo: '/logo-marca.png', oscuro: false },
  orquidea: { nombre: 'Orquídea oscuro', bg: ['#3b2230', '#2a1622'], texto: '#fbeef0', suave: '#d3b3bd', acento: '#e3a6b4', oro: '#dcc09a', tarjeta: '#43293a', logo: '/logo-marca-blanco.png', oscuro: true },
}
const LETRAS = {
  moderno: { nombre: 'Moderno', ej: 'Montserrat', titulo: 'Montserrat', texto: 'Montserrat', peso: 600, cursiva: false, escala: 1 },
  editorial: { nombre: 'Editorial de revista', ej: 'Playfair Display', titulo: 'Playfair Display', texto: 'Montserrat', peso: 600, cursiva: false, escala: 1.02 },
  lujo: { nombre: 'Lujo clásico', ej: 'Cormorant Garamond', titulo: 'Cormorant Garamond', texto: 'Josefin Sans', peso: 600, cursiva: true, escala: 1.22 },
  costura: { nombre: 'Alta costura', ej: 'Bodoni Moda', titulo: 'Bodoni Moda', texto: 'Jost', peso: 600, cursiva: false, escala: 0.98 },
  romantico: { nombre: 'Romántico', ej: 'Great Vibes', titulo: 'Cormorant Garamond', texto: 'Montserrat', peso: 600, cursiva: true, escala: 1.22, script: 'Great Vibes' },
  minimal: { nombre: 'Minimal chic', ej: 'Tenor Sans', titulo: 'Tenor Sans', texto: 'Jost', peso: 400, cursiva: false, escala: 1.02 },
  fino: { nombre: 'Fino y delicado', ej: 'Italiana', titulo: 'Italiana', texto: 'Raleway', peso: 400, cursiva: false, escala: 1.18 },
}
let LA = LETRAS.moderno
const fTit = (px, peso) => `${LA.cursiva ? 'italic ' : ''}${peso || LA.peso} ${Math.round(px * LA.escala)}px "${LA.titulo}", Georgia, serif`
const fTxt = (px, peso = 500) => `${peso} ${Math.round(px)}px "${LA.texto}", Arial, sans-serif`
// etiqueta pequeña sobre el título: en versales con letra espaciada, o en letra script (romántico)
const etiqueta = (ctx, texto, x, y, W, tam, sp, color) => {
  ctx.fillStyle = color
  if (LA.script) { ctx.font = `${Math.round(W * 0.075)}px "${LA.script}", cursive`; ctx.fillText(texto, x, y + Math.round(W * 0.012)); return }
  ctx.font = fTxt(tam, 600); espaciado(ctx, sp); ctx.fillText(String(texto).toUpperCase(), x, y); espaciado(ctx, 0)
}
const WA_TXT = '479 224 4560'
const _cache = { imgs: {} }

const cargarImagen = (url) => {
  if (!url) return Promise.resolve(null)
  if (_cache.imgs[url]) return _cache.imgs[url]
  // El sufijo evita que el navegador reutilice una copia guardada SIN permiso CORS (eso "mancha" el canvas y ya no se puede exportar)
  const u = url + (url.includes('?') ? '&' : '?') + 'rs=1'
  _cache.imgs[url] = new Promise(res => {
    const i = new Image(); i.crossOrigin = 'anonymous'
    i.onload = () => res(i); i.onerror = () => res(null); i.src = u
  })
  return _cache.imgs[url]
}
const cargarFuentes = async () => {
  if (!document.getElementById('rs-fonts')) {
    const l = document.createElement('link'); l.id = 'rs-fonts'; l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600;1,700&family=Bodoni+Moda:wght@400;600;700&family=Josefin+Sans:wght@400;600;700&family=Jost:wght@400;500;600;700&family=Tenor+Sans&family=Italiana&family=Raleway:wght@400;500;600;700&family=Great+Vibes&display=swap'
    document.head.appendChild(l)
  }
  try {
    const fam = new Set(); Object.values(LETRAS).forEach(l => { fam.add(l.titulo); fam.add(l.texto); if (l.script) fam.add(l.script) })
    await Promise.all([...fam].flatMap(f => ['400 30px "' + f + '"', '600 30px "' + f + '"', '700 30px "' + f + '"', 'italic 600 30px "' + f + '"'].map(x => document.fonts.load(x).catch(() => null))))
  } catch (e) {}
}

// ── utilidades de dibujo ──
const rr = (ctx, x, y, w, h, r) => {
  const t = Array.isArray(r) ? r : [r, r, r, r]
  ctx.beginPath()
  ctx.moveTo(x + t[0], y); ctx.lineTo(x + w - t[1], y); ctx.quadraticCurveTo(x + w, y, x + w, y + t[1])
  ctx.lineTo(x + w, y + h - t[2]); ctx.quadraticCurveTo(x + w, y + h, x + w - t[2], y + h)
  ctx.lineTo(x + t[3], y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - t[3])
  ctx.lineTo(x, y + t[0]); ctx.quadraticCurveTo(x, y, x + t[0], y); ctx.closePath()
}
// Encuadre por foto (la que elige la persona): x,y = 0..1 (0.5 centrada), z = zoom (1 = ajuste normal; <1 la aleja, >1 la acerca).
// Se guarda por URL de foto: si la misma foto sale en varios recuadros usa el mismo encuadre.
const ENC = {}
const MARCOS = { producto: null, collage: null }   // tamaño real del recuadro de la foto en cada tipo de lámina (para la vista del editor)
// Encuadre automático: cuando la foto no cabe completa en el recuadro (se recorta), se elige la zona con más detalle.
// En las fotos de calzado el zapato suele estar abajo y es lo que tiene más bordes/contraste, así que el recorte se
// desplaza hacia ahí en lugar de quedarse siempre en el centro (donde salían solo las piernas). Es solo el punto de partida:
// la persona puede moverla y acercarla en el editor de encuadre.
const _autoCache = new Map()
function autoEnc(img, w, h) {
  const clave = (img.src || '') + '|' + Math.round(w / h * 50)
  if (_autoCache.has(clave)) return _autoCache.get(clave)
  const res = { x: 0.5, y: 0.5 }
  try {
    const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height
    const af = w / h, ai = iw / ih
    if (Math.abs(ai - af) / af > 0.02) {
      const sw = 72, sh = Math.max(8, Math.round(sw * ih / iw))
      const c = document.createElement('canvas'); c.width = sw; c.height = sh
      const cx = c.getContext('2d', { willReadFrequently: true }); cx.drawImage(img, 0, 0, sw, sh)
      const d = cx.getImageData(0, 0, sw, sh).data
      const g = new Float32Array(sw * sh)
      for (let i = 0; i < sw * sh; i++) g[i] = 0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]
      const E = new Float32Array(sw * sh)
      for (let y = 1; y < sh - 1; y++) for (let x = 1; x < sw - 1; x++) E[y * sw + x] = Math.abs(g[y * sw + x + 1] - g[y * sw + x - 1]) + Math.abs(g[(y + 1) * sw + x] - g[(y - 1) * sw + x])
      const mejorVentana = (energia, largo, ventana) => {
        let suma = 0; for (let i = 0; i < ventana; i++) suma += energia[i]
        let mejor = -1, inicio = 0
        const libres = largo - ventana
        for (let s0 = 0; s0 <= libres; s0++) {
          if (s0 > 0) suma += energia[s0 + ventana - 1] - energia[s0 - 1]
          const frac = libres ? s0 / libres : 0.5
          const puntaje = suma * (1 - 0.12 * Math.abs(frac * 2 - 1))   // a igualdad, prefiere el centro
          if (puntaje > mejor) { mejor = puntaje; inicio = s0 }
        }
        return libres ? inicio / libres : 0.5
      }
      if (ai > af) {   // la foto es más ancha que el recuadro: se recorta a los lados
        const ventana = Math.max(1, Math.round(sw * af / ai))
        const col = new Float32Array(sw)
        for (let x = 0; x < sw; x++) for (let y = Math.floor(sh * 0.35); y < sh; y++) col[x] += E[y * sw + x]   // parte baja: donde suele estar el zapato
        res.x = mejorVentana(col, sw, ventana)
        res.y = 0.5
      } else {         // la foto es más alta que el recuadro: se recorta arriba y abajo
        const ventana = Math.max(1, Math.round(sh * ai / af))
        const fila = new Float32Array(sh)
        for (let y = 0; y < sh; y++) { let t = 0; for (let x = 0; x < sw; x++) t += E[y * sw + x]; fila[y] = t * (1 + 0.8 * y / sh) }   // pesa más lo de abajo
        res.y = mejorVentana(fila, sh, ventana)
        res.x = 0.5
      }
    }
  } catch (e) { /* imagen de otro dominio sin permiso de lectura: se queda centrada */ }
  _autoCache.set(clave, res)
  return res
}
const foto = (ctx, img, x, y, w, h, r, modo, fondo, enc) => {
  ctx.save(); rr(ctx, x, y, w, h, r); ctx.clip()
  if (fondo) { ctx.fillStyle = fondo; ctx.fillRect(x, y, w, h) }
  if (img) {
    const e = enc ? { x: 0.5, y: 0.5, z: 1, ...enc } : (modo === 'completa' ? { x: 0.5, y: 0.5, z: 1 } : { ...autoEnc(img, w, h), z: 1 })
    const base = modo === 'completa' ? Math.min(w / img.width, h / img.height) : Math.max(w / img.width, h / img.height)
    const s = base * e.z
    const dw = img.width * s, dh = img.height * s
    ctx.drawImage(img, x + (w - dw) * e.x, y + (h - dh) * e.y, dw, dh)
  } else { ctx.fillStyle = '#e9dfd8'; ctx.fillRect(x, y, w, h) }
  ctx.restore()
}
const envolver = (ctx, texto, cx, y, maxW, interlineado, maxLineas) => {
  const palabras = String(texto).split(/\s+/); const lineas = []; let l = ''
  for (const p of palabras) {
    const prueba = l ? l + ' ' + p : p
    if (ctx.measureText(prueba).width > maxW && l) { lineas.push(l); l = p } else l = prueba
  }
  if (l) lineas.push(l)
  const out = lineas.slice(0, maxLineas)
  if (lineas.length > maxLineas) out[maxLineas - 1] = out[maxLineas - 1].replace(/[\s.,;:]*$/, '') + '…'
  out.forEach((t, i) => ctx.fillText(t, cx, y + i * interlineado))
  return out.length
}
const fondo = (ctx, W, H, E) => {
  const g = ctx.createLinearGradient(0, 0, W * 0.5, H)
  g.addColorStop(0, E.bg[0]); g.addColorStop(1, E.bg[1])
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
  // brillo suave en una esquina (da profundidad sin recargar)
  const r = ctx.createRadialGradient(W * 0.85, H * 0.08, 10, W * 0.85, H * 0.08, W * 0.7)
  r.addColorStop(0, E.oscuro ? 'rgba(227,166,180,0.16)' : 'rgba(255,255,255,0.55)'); r.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = r; ctx.fillRect(0, 0, W, H)
}
// marco doble finísimo (detalle de papelería fina)
const marco = (ctx, W, H, E) => {
  ctx.save(); ctx.strokeStyle = E.oro; ctx.globalAlpha = 0.85
  ctx.lineWidth = 2.2; rr(ctx, 30, 30, W - 60, H - 60, 4); ctx.stroke()
  ctx.lineWidth = 0.9; rr(ctx, 42, 42, W - 84, H - 84, 3); ctx.stroke(); ctx.restore()
}
const rombo = (ctx, x, y, t, color) => { ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4); ctx.fillStyle = color; ctx.fillRect(-t / 2, -t / 2, t, t); ctx.restore() }
const divisor = (ctx, cx, y, ancho, E) => {
  ctx.save(); ctx.strokeStyle = E.oro; ctx.lineWidth = 1.4; ctx.globalAlpha = 0.9
  ctx.beginPath(); ctx.moveTo(cx - ancho / 2, y); ctx.lineTo(cx - 16, y); ctx.moveTo(cx + 16, y); ctx.lineTo(cx + ancho / 2, y); ctx.stroke()
  rombo(ctx, cx, y, 9, E.oro); ctx.restore()
}
const sello = (ctx, cx, cy, r, texto, E) => {
  ctx.save(); ctx.shadowColor = 'rgba(60,20,30,0.25)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 5
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = E.acento; ctx.fill(); ctx.restore()
  ctx.beginPath(); ctx.arc(cx, cy, r - 7, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 1.6; ctx.stroke()
  ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.font = fTxt(r * 0.3, 700); ctx.letterSpacing = '2px'
  ctx.fillText(texto, cx, cy + 2); ctx.letterSpacing = '0px'
  ctx.font = fTxt(r * 0.3, 400); ctx.fillText('✦', cx, cy - r * 0.42)
}
const etiquetaPrecio = (ctx, txt, x, yBase, W, E) => {
  ctx.font = fTit(W * 0.042, 700)
  const tw = ctx.measureText(txt).width + 58, th = Math.round(W * 0.088)
  ctx.save(); ctx.shadowColor = 'rgba(60,20,30,0.2)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 4
  rr(ctx, x - tw, yBase - th, tw, th, th / 2); ctx.fillStyle = E.oscuro ? '#fff7f2' : '#fffaf8'; ctx.fill(); ctx.restore()
  ctx.strokeStyle = E.oro; ctx.lineWidth = 1.5; rr(ctx, x - tw + 5, yBase - th + 5, tw - 10, th - 10, (th - 10) / 2); ctx.stroke()
  ctx.fillStyle = '#4a2733'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillText(txt, x - tw / 2, yBase - th / 2 + 2)
}
const logo = async (ctx, E, cx, y, ancho) => {
  const img = await cargarImagen(E.logo)
  if (!img) return 0
  const h = ancho * img.height / img.width
  ctx.drawImage(img, cx - ancho / 2, y, ancho, h)
  return h
}
const moneda = (n) => '$' + Number(n || 0).toLocaleString('es-MX', { maximumFractionDigits: 0 })
const espaciado = (ctx, px) => { ctx.letterSpacing = px + 'px' }

// ── una lámina de UN modelo ──
async function laminaProducto(F, E, p, urlFoto, opts, indiceColor) {
  const { w: W, h: H } = F
  const c = document.createElement('canvas'); c.width = W; c.height = H
  const ctx = c.getContext('2d')
  const img = await cargarImagen(urlFoto)
  const pad = Math.round(W * 0.085), esHistoria = H > 1500
  fondo(ctx, W, H, E); marco(ctx, W, H, E)
  const altoCab = esHistoria ? 230 : Math.round(H * 0.125)
  const lw = Math.min(W * 0.3, altoCab * 0.66 / 0.342)
  await logo(ctx, E, W / 2, Math.round(altoCab * 0.2), Math.round(lw))
  const altoPie = Math.round(H * (esHistoria ? 0.30 : (H <= 1100 ? 0.385 : 0.36)))
  const fy = altoCab, fh = H - altoCab - altoPie
  const fx = pad, fw = W - pad * 2
  const arco = !!E.arco
  const radio = arco ? [fw / 2, fw / 2, 30, 30] : [70, 70, 30, 30]
  // contorno fino desplazado (efecto marco de foto)
  ctx.save(); ctx.strokeStyle = E.oro; ctx.globalAlpha = 0.9; ctx.lineWidth = 1.8
  rr(ctx, fx - 13, fy - 13, fw + 26, fh + 26, arco ? [fw / 2 + 13, fw / 2 + 13, 40, 40] : [82, 82, 40, 40]); ctx.stroke(); ctx.restore()
  ctx.save(); ctx.shadowColor = E.oscuro ? 'rgba(0,0,0,0.5)' : 'rgba(120,60,70,0.28)'; ctx.shadowBlur = 38; ctx.shadowOffsetY = 14
  rr(ctx, fx, fy, fw, fh, radio); ctx.fillStyle = E.tarjeta; ctx.fill(); ctx.restore()
  MARCOS.producto = { w: fw, h: fh }
  foto(ctx, img, fx, fy, fw, fh, radio, opts.ajuste, E.tarjeta, ENC[urlFoto])
  if (opts.nuevo && indiceColor === 0) sello(ctx, fx + fw - Math.round(W * 0.075), fy + Math.round(W * 0.075), Math.round(W * 0.062), 'NUEVO', E)
  if (opts.precio && p.precio) etiquetaPrecio(ctx, moneda(p.precio), fx + fw - 26, fy + fh - 26, W, E)
  // ── pie: se ancla desde abajo (WhatsApp, tallas, puntos) y el título usa el espacio de arriba ──
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'
  const yWA = H - Math.round(H * 0.058)
  const yTallas = yWA - Math.round(W * 0.056)
  const hayPuntos = opts.colores && p.colores.length
  const yPuntos = hayPuntos ? yTallas - Math.round(W * 0.056) : yTallas
  const y0 = fy + fh + Math.round(W * 0.078)
  // texto en letra script, como invitación
  const sub = (opts.colorNombre && p.colorLamina) ? p.colorLamina : (opts.etiqueta || 'Nueva colección')
  etiqueta(ctx, sub, W / 2, y0, W, W * 0.024, 6, E.acento)
  const tam = Math.round(W * (esHistoria ? 0.056 : (H <= 1100 ? 0.044 : 0.048))), inter = Math.round(tam * 1.28 * LA.escala)
  ctx.fillStyle = E.texto; ctx.font = fTit(tam)
  envolver(ctx, p.titulo, W / 2, y0 + Math.round(W * 0.07), W - pad * 2.2, inter, H <= 1100 ? 1 : 2)
  if (hayPuntos) {
    const r = Math.round(W * 0.0145), sep = r * 3, n = Math.min(p.colores.length, 7)
    const x0 = W / 2 - ((n - 1) * sep) / 2
    p.colores.slice(0, n).forEach((col, i) => {
      ctx.beginPath(); ctx.arc(x0 + i * sep, yPuntos - r * 0.6, r, 0, Math.PI * 2); ctx.fillStyle = col.hex || '#999'; ctx.fill()
      ctx.lineWidth = 2; ctx.strokeStyle = E.oscuro ? 'rgba(255,255,255,.55)' : E.oro; ctx.stroke()
    })
  }
  ctx.fillStyle = E.suave; ctx.font = fTxt(W * 0.024, 500); espaciado(ctx, 1.5)
  ctx.fillText(p.tallas ? `TALLAS ${p.tallas}   ·   ENVÍOS A TODO MÉXICO` : 'ENVÍOS A TODO MÉXICO', W / 2, yTallas)
  espaciado(ctx, 0)
  divisor(ctx, W / 2, yWA - Math.round(W * 0.036), Math.round(W * 0.42), E)
  ctx.fillStyle = E.texto; ctx.font = fTxt(W * 0.025, 700); espaciado(ctx, 2)
  ctx.fillText((opts.pie || `WHATSAPP  ${WA_TXT}`).toUpperCase(), W / 2, yWA); espaciado(ctx, 0)
  return c
}

// Reparte el espacio del collage entre los modelos con recuadros lo más parecidos posible a una foto normal (≈ 1.4:1).
// Antes con 2 o 3 modelos eran columnas angostas y muy altas (relación 0.4-0.7): una foto horizontal se recortaba de los lados
// y el zapato quedaba fuera. Se prueban varias distribuciones y se elige la que deja los recuadros más cercanos a una foto.
function distribuirCollage(n, A, gap) {
  const col = (k) => Array.from({ length: k }, (_, i) => { const w = (A.w - gap * (k - 1)) / k; return { x: A.x + i * (w + gap), y: A.y, w, h: A.h } })
  const fil = (k) => Array.from({ length: k }, (_, i) => { const h = (A.h - gap * (k - 1)) / k; return { x: A.x, y: A.y + i * (h + gap), w: A.w, h } })
  const mitadW = (A.w - gap) / 2, mitadH = (A.h - gap) / 2
  let cand = []
  if (n <= 1) cand = [[{ ...A }]]
  else if (n === 2) cand = [col(2), fil(2)]
  else if (n === 3) cand = [
    [{ x: A.x, y: A.y, w: mitadW, h: mitadH }, { x: A.x + mitadW + gap, y: A.y, w: mitadW, h: mitadH }, { x: A.x, y: A.y + mitadH + gap, w: A.w, h: mitadH }],
    [{ x: A.x, y: A.y, w: A.w, h: mitadH }, { x: A.x, y: A.y + mitadH + gap, w: mitadW, h: mitadH }, { x: A.x + mitadW + gap, y: A.y + mitadH + gap, w: mitadW, h: mitadH }],
    col(3), fil(3)]
  else cand = [[0, 1, 2, 3].map(i => ({ x: A.x + (i % 2) * (mitadW + gap), y: A.y + Math.floor(i / 2) * (mitadH + gap), w: mitadW, h: mitadH }))]
  const costo = (celdas) => celdas.reduce((t, c) => t + Math.abs(Math.log((c.w / c.h) / 1.4)), 0)   // las fotos de calzado son horizontales (≈1.3-1.5:1): se prefiere recuadros anchos a columnas altas
  return cand.sort((a, b) => costo(a) - costo(b))[0]
}

// ── collage de varios modelos en una sola imagen ──
async function laminaCollage(F, E, prods, opts) {
  const { w: W, h: H } = F
  const c = document.createElement('canvas'); c.width = W; c.height = H
  const ctx = c.getContext('2d'); fondo(ctx, W, H, E); marco(ctx, W, H, E)
  const pad = Math.round(W * 0.085)
  const lh = await logo(ctx, E, W / 2, Math.round(H * 0.05), Math.round(W * 0.27))
  let y = Math.round(H * 0.05) + lh + Math.round(H * 0.085)
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'
  etiqueta(ctx, opts.etiqueta || 'Nueva colección', W / 2, y - Math.round(W * 0.075), W, W * 0.026, 8, E.acento)
  ctx.fillStyle = E.texto; ctx.font = fTit(W * 0.07); espaciado(ctx, 3)
  ctx.fillText(String(opts.tituloCollage || 'Nuevos modelos').toUpperCase(), W / 2, y); espaciado(ctx, 0)
  y += Math.round(W * 0.045)
  divisor(ctx, W / 2, y, Math.round(W * 0.5), E)
  const top = y + Math.round(W * 0.05)
  const piePx = Math.round(H * 0.085)
  const n = Math.min(prods.length, 4)
  const gap = Math.round(W * 0.03)
  const aw = H - top - piePx - Math.round(H * 0.045)
  const celdas = distribuirCollage(n, { x: pad, y: top, w: W - pad * 2, h: aw }, gap)
  for (let i = 0; i < n; i++) {
    const p = prods[i], img = await cargarImagen(p.foto)
    const { x, y: yy, w: cw, h: ch } = celdas[i]
    ctx.save(); ctx.shadowColor = E.oscuro ? 'rgba(0,0,0,0.45)' : 'rgba(120,60,70,0.25)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 9
    rr(ctx, x, yy, cw, ch, [46, 46, 22, 22]); ctx.fillStyle = E.tarjeta; ctx.fill(); ctx.restore()
    MARCOS.collage = { w: cw, h: ch }
    foto(ctx, img, x, yy, cw, ch, [46, 46, 22, 22], opts.ajuste, E.tarjeta, ENC[p.foto])
    ctx.strokeStyle = E.oro; ctx.lineWidth = 1.6; rr(ctx, x + 8, yy + 8, cw - 16, ch - 16, [40, 40, 16, 16]); ctx.globalAlpha = 0.7; ctx.stroke(); ctx.globalAlpha = 1
    if (opts.precio && p.precio && p.primero !== false) etiquetaPrecio(ctx, moneda(p.precio), x + cw - 16, yy + ch - 16, W * 0.78, E)
  }
  ctx.fillStyle = E.texto; ctx.font = fTxt(W * 0.024, 700); espaciado(ctx, 2)
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillText((opts.pie || `WHATSAPP  ${WA_TXT}   ·   ZAPATILLASMAY.MX`).toUpperCase(), W / 2, H - Math.round(H * 0.055)); espaciado(ctx, 0)
  return c
}

// ── portada y cierre del carrusel ──
async function laminaPortada(F, E, prods, opts) { return laminaCollage(F, E, prods, opts) }
async function laminaCierre(F, E, opts = {}) {
  const { w: W, h: H } = F
  const c = document.createElement('canvas'); c.width = W; c.height = H
  const ctx = c.getContext('2d')
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, E.oscuro ? '#5a3347' : E.acento); g.addColorStop(1, E.oscuro ? '#2a1622' : '#6e3550')
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2.2; rr(ctx, 30, 30, W - 60, H - 60, 4); ctx.stroke()
  ctx.lineWidth = 0.9; rr(ctx, 42, 42, W - 84, H - 84, 3); ctx.stroke(); ctx.restore()
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'
  const img = await cargarImagen('/logo-marca-blanco.png')
  if (img) { const w = W * 0.5, h = w * img.height / img.width; ctx.drawImage(img, W / 2 - w / 2, H * 0.16, w, h) }
  ctx.fillStyle = '#fff'; ctx.font = fTit(W * 0.075)
  envolver(ctx, opts.cierre || '¿Cuál es tu favorito?', W / 2, H * 0.46, W * 0.82, W * 0.1, 2)
  divisor(ctx, W / 2, H * 0.64, W * 0.4, { oro: '#ffffff' })
  ctx.font = fTxt(W * 0.03, 500); espaciado(ctx, 3)
  ctx.fillText('PÍDELO POR WHATSAPP', W / 2, H * 0.71); espaciado(ctx, 0)
  ctx.font = fTit(W * 0.07, 700)
  ctx.fillText(WA_TXT, W / 2, H * 0.78)
  ctx.font = fTxt(W * 0.027, 500); espaciado(ctx, 2)
  ctx.fillText('ZAPATILLASMAY.MX  ·  ENVÍOS A TODO MÉXICO', W / 2, H * 0.865); espaciado(ctx, 0)
  return c
}

// ── texto de la publicación ──
function escribirTexto(prods, opts) {
  const l = []
  l.push(prods.length > 1 ? '✨ NUEVOS MODELOS en Zapatillas May ✨' : '✨ NUEVO en Zapatillas May ✨')
  l.push('')
  prods.forEach(p => {
    const col = p.colores.length ? ` · ${p.colores.slice(0, 4).map(c => c.n).join(', ')}` : ''
    l.push(`👠 ${p.titulo}${p.precio ? ' — ' + moneda(p.precio) + ' MXN' : ''}${col}`)
  })
  l.push('')
  l.push('🚚 Envíos a todo México · 📍 León, Guanajuato')
  l.push(`💬 Pídelos por WhatsApp: ${WA_TXT}`)
  l.push('🛍️ zapatillasmay.mx')
  l.push('')
  l.push('#zapatillas #calzadodama #zapatosdemujer #leonguanajuato #modamexicana #nuevacoleccion #zapatillasmay #tacones #botines #sandalias')
  return l.join('\n')
}

// ── estado y pantalla ──
const S = { prods: [], variantes: [], sel: [], publicados: new Set(), imgs: [], estado: null, galerias: {}, fotos: {}, textos: { etiqueta: '', tituloCollage: '', cierre: '', pie: '', porProd: {} } }

function datosProducto(p) {
  const vars = S.variantes.filter(v => v.producto_id === p.id)
  const colores = []
  const vistos = new Set()
  vars.forEach(v => { if (v.color && !vistos.has(v.color)) { vistos.add(v.color); colores.push({ n: v.color, hex: v.color_hex || '#999', foto: v.foto_url || '' }) } })
  const tallas = [...new Set(vars.map(v => parseFloat(v.talla)).filter(x => !isNaN(x)))].sort((a, b) => a - b)
  const corto = String(p.nombre || '').replace(/\s+/g, ' ').trim()
  const titulo = corto.length > 46 ? corto.slice(0, 46).replace(/\s+\S*$/, '') : corto
  const precio = (parseFloat(p.precio_menudeo) || 0) + (p.es_oferta ? 0 : 80)   // el mismo precio que ve la clienta en la tienda
  const elegida = S.fotos[p.id] && S.fotos[p.id].principal
  return { id: p.id, titulo, precio: Math.round(precio), colores, foto: elegida || p.imagen_principal || (colores[0] && colores[0].foto) || '', tallas: tallas.length ? `${tallas[0]}–${tallas[tallas.length - 1]}` : '' }
}

window.cargarRedes = async function () {
  const content = document.getElementById('content')
  content.innerHTML = '<p style="padding:2rem;color:#888">Cargando estudio de publicaciones...</p>'
  try {
    const [productos, variantes, pub, est] = await Promise.all([
      fetch(API + '/productos/').then(r => r.json()),
      fetch(API + '/variantes/?ligero=true').then(r => r.json()),
      fetch(API + '/redes/publicados').then(r => r.json()).catch(() => ({ ids: [] })),
      fetch(API + '/redes/estado').then(r => r.json()).catch(() => null),
    ])
    S.prods = (Array.isArray(productos) ? productos : []).filter(p => p.activo && p.imagen_principal)
    S.variantes = Array.isArray(variantes) ? variantes : []
    S.publicados = new Set(pub.ids || [])
    S.estado = est
    S.sel = []; S.imgs = []
  } catch (e) { content.innerHTML = `<p style="padding:2rem;color:red">Error cargando: ${esc(e.message)}</p>`; return }
  await cargarFuentes()
  const hace = (iso) => (Date.now() - new Date(iso).getTime()) / 86400000
  const nuevos = S.prods.filter(p => hace(p.created_at) <= 30 && !S.publicados.has(p.id)).slice(0, 14)
  const e = S.estado || {}
  const chip = (ok, texto) => `<span style="display:inline-flex;align-items:center;gap:5px;padding:4px 11px;border-radius:100px;font-size:0.74rem;font-weight:700;background:${ok === true ? '#e8f5e9' : ok === false ? '#fee2e2' : '#fef3c7'};color:${ok === true ? '#2e7d32' : ok === false ? '#b91c1c' : '#92400e'}">${ok === true ? '✓' : ok === false ? '✗' : '?'} ${texto}</span>`
  content.innerHTML = `
  <style>
    .rs-wrap{max-width:1100px}
    .rs-card{background:#fff;border:1px solid #eef0f4;border-radius:16px;padding:16px 18px;margin-bottom:14px}
    .rs-h{font-size:0.78rem;font-weight:700;color:#be185d;text-transform:uppercase;letter-spacing:.08em;margin:0 0 8px}
    .rs-gal{display:flex;gap:8px;overflow-x:auto;padding:4px 2px 8px;scrollbar-width:thin}
    .rs-ft{position:relative;flex:0 0 auto;width:78px;cursor:pointer;border-radius:12px;border:2px solid #eee;background:#faf6f4;padding:0;overflow:hidden}
    .rs-ft img{display:block;width:100%;height:96px;object-fit:cover}
    .rs-ft.pri{border-color:#E91E8C;box-shadow:0 0 0 2px rgba(233,30,140,.18)}
    .rs-ft.ext{border-color:#16a34a}
    .rs-ft .rs-tag{position:absolute;left:0;right:0;top:0;text-align:center;font-size:0.6rem;font-weight:800;color:#fff;background:#E91E8C;padding:2px 0}
    .rs-ft .rs-mas{position:absolute;right:4px;bottom:22px;width:24px;height:24px;border-radius:50%;border:none;background:rgba(255,255,255,.95);box-shadow:0 1px 4px rgba(0,0,0,.3);font-size:0.95rem;font-weight:800;color:#555;cursor:pointer;line-height:1;padding:0}
    .rs-ft.ext .rs-mas{background:#16a34a;color:#fff}
    .rs-ft .rs-col{display:block;font-size:0.62rem;color:#666;text-align:center;padding:3px 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .rs-chip{display:inline-flex;align-items:center;gap:8px;border:1.5px solid #e2e8f0;border-radius:12px;padding:5px 10px 5px 5px;margin:0 6px 6px 0;cursor:pointer;font-size:0.76rem;background:#fff}
    .rs-chip.on{border-color:#E91E8C;background:#fdf2f8}
    .rs-chip img{width:38px;height:38px;object-fit:cover;border-radius:8px}
    .rs-opc{display:flex;gap:8px;flex-wrap:wrap}
    .rs-opc button{border:1.5px solid #e2e8f0;background:#fff;border-radius:12px;padding:8px 12px;cursor:pointer;font-size:0.78rem;font-weight:600;color:#475569;text-align:left}
    .rs-opc button.on{border-color:#E91E8C;background:#fdf2f8;color:#9d174d}
    .rs-opc small{display:block;font-weight:400;color:#94a3b8;font-size:0.66rem}
    #rs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px}
    #rs-grid canvas{width:100%;height:auto;border-radius:12px;box-shadow:0 6px 20px rgba(0,0,0,.12);background:#eee}
    @media(max-width:640px){#rs-grid{grid-template-columns:repeat(2,1fr)}}
  </style>
  <div class="rs-wrap">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:8px;margin-bottom:12px">
      <div><p style="font-size:0.7rem;font-weight:700;letter-spacing:.1em;color:#E91E8C;text-transform:uppercase;margin:0 0 3px">Redes sociales</p>
        <h2 style="font-size:1.3rem;font-weight:800;margin:0">Estudio de publicaciones</h2></div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${e.conectado ? chip(e.facebook, 'Facebook' + (e.pagina ? ': ' + esc(e.pagina) : '')) + chip(e.instagram, 'Instagram' + (e.instagram_usuario ? ': @' + esc(e.instagram_usuario) : '')) : chip(false, 'Sin conexión con Meta')}
        ${e.conectado && e.permisos_conocidos ? chip(e.puede_facebook && e.puede_instagram, 'Permisos de publicar') : ''}
      </div>
    </div>
    ${(!e.conectado) ? `<div class="rs-card" style="background:#fef2f2;border-color:#fecaca;font-size:0.8rem;color:#991b1b">${esc((e && e.problema) || 'No se pudo comprobar la conexión con Facebook/Instagram.')} Puedes armar y descargar las imágenes igual.</div>` : ''}
    ${(e.conectado && e.permisos_conocidos && (!e.puede_facebook || !e.puede_instagram)) ? `<div class="rs-card" style="background:#fffbeb;border-color:#fde68a;font-size:0.8rem;color:#92400e;line-height:1.6">
      <strong>Falta activar permisos para publicar desde el sistema:</strong> ${!e.puede_facebook ? '«pages_manage_posts» (Facebook)' : ''}${(!e.puede_facebook && !e.puede_instagram) ? ' y ' : ''}${!e.puede_instagram ? '«instagram_content_publish» (Instagram)' : ''}.
      Mientras tanto puedes <strong>descargar</strong> las imágenes y el texto y publicarlos a mano.</div>` : ''}

    <div class="rs-card">
      <p class="rs-h">1 · Elige los modelos</p>
      ${nuevos.length ? `<p style="font-size:0.76rem;color:#64748b;margin:0 0 6px">Modelos nuevos (últimos 30 días) que todavía no has publicado:</p><div id="rs-nuevos">${nuevos.map(p => `<div class="rs-chip" data-id="${esc(p.id)}" onclick="rsToggle('${esc(p.id)}')"><img src="${esc(p.imagen_principal)}" loading="lazy"><span>${esc(String(p.nombre).split(' ').slice(0, 3).join(' '))}</span></div>`).join('')}</div>` : '<p style="font-size:0.78rem;color:#94a3b8;margin:0 0 6px">No hay modelos nuevos sin publicar. Busca cualquier modelo:</p>'}
      <input id="rs-buscar" class="form-input" placeholder="🔍 Buscar otro modelo por nombre o SKU..." style="width:100%;margin:6px 0" oninput="rsBuscar(this.value)" autocomplete="off">
      <div id="rs-res" style="display:none;border:1px solid #eef0f4;border-radius:10px;max-height:200px;overflow:auto;margin-bottom:6px"></div>
      <div id="rs-elegidos" style="margin-top:4px"></div>
    </div>

    <div class="rs-card">
      <p class="rs-h">2 · Formato y estilo</p>
      <div class="rs-opc" id="rs-tipo" style="margin-bottom:8px">
        <button class="on" data-v="fotos" onclick="rsOpt('tipo','fotos')">Una imagen por modelo<small>Cada modelo en su propia imagen</small></button>
        <button data-v="carrusel" onclick="rsOpt('tipo','carrusel')">Carrusel<small>Portada + modelos + cierre (se desliza)</small></button>
        <button data-v="collage" onclick="rsOpt('tipo','collage')">Collage<small>Hasta 4 modelos en una imagen</small></button>
      </div>
      <div class="rs-opc" id="rs-formato" style="margin-bottom:8px">
        ${Object.entries(FORMATOS).map(([k, f], i) => `<button class="${i === 1 ? 'on' : ''}" data-v="${k}" onclick="rsOpt('formato','${k}')">${f.label}<small>${f.nota}</small></button>`).join('')}
      </div>
      <p style="font-size:0.72rem;color:#94a3b8;margin:4px 0 4px">Tipo de letra</p>
      <div class="rs-opc" id="rs-letra" style="margin-bottom:10px">
        ${Object.entries(LETRAS).map(([k, l], i) => `<button class="${i === 0 ? 'on' : ''}" data-v="${k}" onclick="rsOpt('letra','${k}')"><span style="font-family:'${l.ej}',serif;font-size:1.05rem;${l.cursiva ? 'font-style:italic;' : ''}color:#2a1a0e">${l.nombre === 'Romántico' ? 'Nueva colección' : 'Nueva colección'}</span><small>${l.nombre}</small></button>`).join('')}
      </div>
      <p style="font-size:0.72rem;color:#94a3b8;margin:4px 0 4px">Colores</p>
      <div class="rs-opc" id="rs-estilo" style="margin-bottom:10px">
        ${Object.entries(ESTILOS).map(([k, s], i) => `<button class="${i === 0 ? 'on' : ''}" data-v="${k}" onclick="rsOpt('estilo','${k}')"><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:${s.acento};vertical-align:-2px;margin-right:5px"></span>${s.nombre}</button>`).join('')}
      </div>
      <div style="display:flex;gap:14px;flex-wrap:wrap;font-size:0.78rem;color:#475569">
        <label><input type="checkbox" id="rs-o-precio" checked onchange="rsGenerar()"> Mostrar precio</label>
        <label><input type="checkbox" id="rs-o-nuevo" checked onchange="rsGenerar()"> Etiqueta «NUEVO»</label>
        <label><input type="checkbox" id="rs-o-colores" checked onchange="rsGenerar()"> Puntos de colores y tallas</label>
        <label><input type="checkbox" id="rs-o-porcolor" onchange="rsGenerar()"> Una lámina por cada color (carrusel / fotos)</label>
        <label><input type="checkbox" id="rs-o-completa" onchange="rsGenerar()"> Mostrar la foto completa (sin recortar)</label>
      </div>
    </div>

    <div class="rs-card" id="rs-fotos-card" style="display:none">
      <p class="rs-h">Fotos de cada modelo <span style="text-transform:none;letter-spacing:0;font-weight:500;color:#94a3b8">· elige la foto y el color que quieres mostrar</span></p>
      <p style="font-size:0.76rem;color:#64748b;margin:0 0 10px"><b style="color:#E91E8C">Toca una foto</b> para usarla como principal (la del collage, la portada y la primera imagen). <b style="color:#16a34a">Toca el ＋</b> de otras fotos para sumarlas: en el <b>carrusel</b> son imágenes extra y en el <b>collage</b> son recuadros más (hasta 4 por imagen), aunque sean del mismo modelo y color.</p>
      <div id="rs-fotos"></div>
    </div>

    <div class="rs-card" id="rs-textos" style="display:none">
      <p class="rs-h">Textos de las imágenes <span style="text-transform:none;letter-spacing:0;font-weight:500;color:#94a3b8">· cámbialos como quieras, la vista previa se actualiza sola</span></p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin-bottom:12px">
        <label style="font-size:0.74rem;color:#64748b">Etiqueta superior<input class="form-input" id="rs-t-etiqueta" placeholder="Nueva colección" maxlength="40" oninput="rsTexto('etiqueta',this.value)" style="width:100%;margin-top:3px"></label>
        <label style="font-size:0.74rem;color:#64748b">Línea de abajo<input class="form-input" id="rs-t-pie" placeholder="WhatsApp 479 224 4560" maxlength="60" oninput="rsTexto('pie',this.value)" style="width:100%;margin-top:3px"></label>
        <label style="font-size:0.74rem;color:#64748b">Título del collage / portada<input class="form-input" id="rs-t-collage" placeholder="Nuevos modelos" maxlength="30" oninput="rsTexto('tituloCollage',this.value)" style="width:100%;margin-top:3px"></label>
        <label style="font-size:0.74rem;color:#64748b">Frase de cierre (carrusel)<input class="form-input" id="rs-t-cierre" placeholder="¿Cuál es tu favorito?" maxlength="40" oninput="rsTexto('cierre',this.value)" style="width:100%;margin-top:3px"></label>
      </div>
      <div id="rs-t-prods"></div>
    </div>

    <div class="rs-card" id="rs-encuadre-card" style="display:none">
      <p class="rs-h">Encuadre de las fotos <span style="text-transform:none;letter-spacing:0;font-weight:500;color:#94a3b8">· arrastra la foto para acomodarla; con la barra la acercas o la alejas</span></p>
      <p style="font-size:0.76rem;color:#64748b;margin:0 0 10px">Cada recuadro tiene la forma real del espacio de la foto en el formato que elegiste, así ves qué se recorta. Si el zapato se corta, aleja la foto o muévela.</p>
      <div id="rs-encuadre" style="display:flex;gap:14px;flex-wrap:wrap"></div>
      <div style="margin-top:10px"><button class="btn btn-secondary" style="padding:5px 12px;font-size:0.76rem" onclick="rsEncuadreReiniciar()">↺ Centrar todas</button></div>
    </div>

    <div class="rs-card">
      <p class="rs-h">3 · Vista previa</p>
      <p id="rs-vacio" style="font-size:0.82rem;color:#94a3b8;margin:0">Elige al menos un modelo para ver cómo quedan las imágenes.</p>
      <div id="rs-grid"></div>
    </div>

    <div class="rs-card" id="rs-publicar" style="display:none">
      <p class="rs-h">4 · Texto y publicación</p>
      <textarea id="rs-caption" class="form-input" rows="9" maxlength="2100" style="width:100%;font-size:0.84rem"></textarea>
      <div style="display:flex;gap:14px;flex-wrap:wrap;margin:10px 0;font-size:0.82rem">
        <label><input type="checkbox" id="rs-d-fb" ${e.facebook ? 'checked' : ''}> Publicar en Facebook</label>
        <label><input type="checkbox" id="rs-d-ig" ${e.instagram ? 'checked' : ''}> Publicar en Instagram</label>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-primary" id="rs-btn-pub" onclick="rsPublicar()" ${e.conectado ? '' : 'disabled'}>🚀 Publicar ahora</button>
        <button class="btn btn-secondary" onclick="rsDescargar()">⬇ Descargar imágenes</button>
        <button class="btn btn-secondary" onclick="rsCopiarTexto()">📋 Copiar texto</button>
      </div>
      <p id="rs-res-pub" style="font-size:0.8rem;margin:10px 0 0;display:none"></p>
    </div>
    <div class="rs-card"><p class="rs-h">Publicado recientemente</p><div id="rs-hist" style="font-size:0.78rem;color:#64748b">Cargando...</div></div>
  </div>`
  window.rsHistorial()
}

const OPT = { tipo: 'fotos', formato: 'vertical', estilo: 'blush', letra: 'moderno' }
window.rsOpt = async (k, v) => {
  OPT[k] = v
  if (k === 'letra') { LA = LETRAS[v] || LETRAS.moderno; await cargarFuentes() }
  document.querySelectorAll(`#rs-${k} button`).forEach(b => b.classList.toggle('on', b.dataset.v === v))
  window.rsGenerar()
}
window.rsToggle = (id) => {
  const i = S.sel.indexOf(id)
  if (i >= 0) S.sel.splice(i, 1)
  else { if (S.sel.length >= 8) { alert('Máximo 8 modelos por publicación.'); return }; S.sel.push(id) }
  document.querySelectorAll('#rs-nuevos .rs-chip').forEach(c => c.classList.toggle('on', S.sel.includes(c.dataset.id)))
  const cont = document.getElementById('rs-elegidos')
  window.rsPintarTextos()
  window.rsPintarFotos()
  S.sel.forEach(id => cargarGaleria(id).then(() => window.rsPintarFotos()))
  cont.innerHTML = S.sel.length ? S.sel.map(id => { const p = S.prods.find(x => x.id === id); return p ? `<span class="rs-chip on" onclick="rsToggle('${esc(id)}')"><img src="${esc(p.imagen_principal)}"><span>${esc(String(p.nombre).split(' ').slice(0, 3).join(' '))} ✕</span></span>` : '' }).join('') : ''
  window.rsGenerar()
}
window.rsBuscar = (q) => {
  const r = document.getElementById('rs-res'); q = (q || '').toLowerCase().trim()
  if (q.length < 2) { r.style.display = 'none'; return }
  const l = S.prods.filter(p => `${p.nombre} ${p.sku_interno || ''}`.toLowerCase().includes(q)).slice(0, 10)
  r.innerHTML = l.map(p => `<div onclick="rsToggle('${esc(p.id)}');document.getElementById('rs-res').style.display='none';document.getElementById('rs-buscar').value=''" style="display:flex;gap:8px;align-items:center;padding:7px 10px;cursor:pointer;border-bottom:1px solid #f1f5f9;font-size:0.8rem"><img src="${esc(p.imagen_principal)}" style="width:34px;height:34px;object-fit:cover;border-radius:6px"><span>${esc(p.nombre)}<br><span style="color:#94a3b8;font-size:0.7rem">${esc(p.sku_interno || '')}</span></span></div>`).join('') || '<div style="padding:10px;color:#94a3b8;font-size:0.8rem">Sin resultados</div>'
  r.style.display = 'block'
}

let _tTimer = null
window.rsTexto = (campo, valor) => { S.textos[campo] = valor; clearTimeout(_tTimer); _tTimer = setTimeout(() => window.rsGenerar(), 450) }
window.rsTextoProd = (id, campo, valor) => {
  S.textos.porProd[id] = { ...(S.textos.porProd[id] || {}), [campo]: valor }
  clearTimeout(_tTimer); _tTimer = setTimeout(() => window.rsGenerar(), 450)
}
window.rsPintarTextos = () => {
  const card = document.getElementById('rs-textos'), cont = document.getElementById('rs-t-prods')
  if (!card || !cont) return
  card.style.display = S.sel.length ? 'block' : 'none'
  cont.innerHTML = S.sel.map(id => {
    const base = S.prods.find(p => p.id === id); if (!base) return ''
    const d = datosProducto(base), x = S.textos.porProd[id] || {}
    return `<div style="display:grid;grid-template-columns:44px 2fr 90px 120px;gap:8px;align-items:end;padding:8px 0;border-top:1px solid #f1f5f9">
      <img src="${esc(base.imagen_principal)}" style="width:44px;height:44px;object-fit:cover;border-radius:8px">
      <label style="font-size:0.7rem;color:#94a3b8">Nombre en la imagen<input class="form-input" value="${esc(x.titulo !== undefined ? x.titulo : d.titulo)}" maxlength="70" oninput="rsTextoProd('${esc(id)}','titulo',this.value)" style="width:100%;margin-top:2px;font-size:0.82rem"></label>
      <label style="font-size:0.7rem;color:#94a3b8">Precio $<input class="form-input" type="number" min="0" value="${esc(x.precio !== undefined ? x.precio : d.precio)}" oninput="rsTextoProd('${esc(id)}','precio',this.value)" style="width:100%;margin-top:2px;font-size:0.82rem"></label>
      <label style="font-size:0.7rem;color:#94a3b8">Tallas<input class="form-input" value="${esc(x.tallas !== undefined ? x.tallas : d.tallas)}" maxlength="20" placeholder="23–27" oninput="rsTextoProd('${esc(id)}','tallas',this.value)" style="width:100%;margin-top:2px;font-size:0.82rem"></label>
    </div>`
  }).join('')
}
// ── editor de encuadre: cada foto en un recuadro con la forma real del espacio donde va ──
let _firmaEnc = ''
let _encTimer = null
const encAncho = 150
function _geomEnc(url) {
  const m = (OPT.tipo === 'collage' ? MARCOS.collage : MARCOS.producto) || MARCOS.producto || MARCOS.collage || { w: 1, h: 1 }
  const bw = encAncho, bh = Math.min(240, Math.round(encAncho * m.h / m.w))
  return { bw, bh, img: _imgsEnc[url] }
}
const _imgsEnc = {}
// Encuadre efectivo de una foto del editor: el que eligió la persona o, si no, el automático (igual que al dibujar la imagen)
function encEf(caja) {
  const url = caja.dataset.u, im = _imgsEnc[url]
  if (ENC[url]) return { x: 0.5, y: 0.5, z: 1, ...ENC[url] }
  const completa = document.getElementById('rs-o-completa')?.checked
  return completa || !im ? { x: 0.5, y: 0.5, z: 1 } : { ...autoEnc(im, caja.clientWidth, caja.clientHeight), z: 1 }
}
function _posicionarEnc(caja) {
  const url = caja.dataset.u, im = _imgsEnc[url]
  const el = caja.querySelector('img'); if (!im || !el) return
  const e = encEf(caja), bw = caja.clientWidth, bh = caja.clientHeight
  const completa = document.getElementById('rs-o-completa')?.checked
  const base = completa ? Math.min(bw / im.naturalWidth, bh / im.naturalHeight) : Math.max(bw / im.naturalWidth, bh / im.naturalHeight)
  const dw = im.naturalWidth * base * e.z, dh = im.naturalHeight * base * e.z
  el.style.width = dw + 'px'; el.style.height = dh + 'px'
  el.style.left = (bw - dw) * e.x + 'px'; el.style.top = (bh - dh) * e.y + 'px'
}
function _programarRegenerar() { clearTimeout(_encTimer); _encTimer = setTimeout(() => window.rsGenerar(), 300) }
window.rsEncuadreZoom = (i, v) => {
  const caja = document.querySelectorAll('#rs-encuadre .rs-enc')[i]; if (!caja) return
  const u = caja.dataset.u; ENC[u] = { ...encEf(caja), z: parseFloat(v) }
  _posicionarEnc(caja); _programarRegenerar()
}
window.rsEncuadreCentrar = (i) => {
  const caja = document.querySelectorAll('#rs-encuadre .rs-enc')[i]; if (!caja) return
  delete ENC[caja.dataset.u]
  const sl = document.getElementById('rs-enc-z-' + i); if (sl) sl.value = 1
  _posicionarEnc(caja); _programarRegenerar()
}
window.rsEncuadreReiniciar = () => {
  Object.keys(ENC).forEach(k => delete ENC[k])
  _firmaEnc = ''; rsPintarEncuadre(Object.keys(_imgsEnc).filter(u => document.querySelector(`#rs-encuadre .rs-enc[data-u="${CSS.escape(u)}"]`)))
  _programarRegenerar()
}
function rsPintarEncuadre(urls) {
  const card = document.getElementById('rs-encuadre-card'), cont = document.getElementById('rs-encuadre')
  if (!card || !cont) return
  card.style.display = urls.length ? 'block' : 'none'
  // Solo se vuelve a dibujar si cambiaron las fotos o la forma del recuadro (no durante un arrastre)
  const m = (OPT.tipo === 'collage' ? MARCOS.collage : MARCOS.producto) || { w: 1, h: 1 }
  const firma = urls.join('|') + '#' + OPT.tipo + OPT.formato + Math.round(m.h / m.w * 100) + (document.getElementById('rs-o-completa')?.checked ? 'c' : 'l')
  if (firma === _firmaEnc) return
  _firmaEnc = firma
  cont.innerHTML = urls.map((u, i) => {
    const g = _geomEnc(u)
    return `<div style="width:${encAncho}px">
      <div class="rs-enc" data-u="${esc(u)}" style="position:relative;width:${g.bw}px;height:${g.bh}px;overflow:hidden;border-radius:12px;background:#f3e9e6;border:2px solid #e7c9d3;cursor:grab;touch-action:none;user-select:none">
        <img src="${esc(u)}" crossorigin="anonymous" draggable="false" style="position:absolute;max-width:none;pointer-events:none">
      </div>
      <input type="range" id="rs-enc-z-${i}" min="0.5" max="2.5" step="0.05" value="${(ENC[u] && ENC[u].z) || 1}" oninput="rsEncuadreZoom(${i}, this.value)" style="width:100%;margin:6px 0 0">
      <div style="display:flex;justify-content:space-between;font-size:0.68rem;color:#94a3b8"><span>alejar</span><button onclick="rsEncuadreCentrar(${i})" style="background:none;border:none;color:#be185d;cursor:pointer;font-size:0.68rem;padding:0">centrar</button><span>acercar</span></div>
    </div>`
  }).join('')
  cont.querySelectorAll('.rs-enc').forEach((caja) => {
    const u = caja.dataset.u, el = caja.querySelector('img')
    const listo = () => { _imgsEnc[u] = el; _posicionarEnc(caja) }
    if (el.complete && el.naturalWidth) listo(); else el.onload = listo
    let arr = null
    caja.addEventListener('pointerdown', (ev) => { arr = { x: ev.clientX, y: ev.clientY, e: encEf(caja) }; caja.setPointerCapture(ev.pointerId); caja.style.cursor = 'grabbing' })
    caja.addEventListener('pointermove', (ev) => {
      if (!arr) return
      const bw = caja.clientWidth, bh = caja.clientHeight
      const completa = document.getElementById('rs-o-completa')?.checked
      const base = completa ? Math.min(bw / el.naturalWidth, bh / el.naturalHeight) : Math.max(bw / el.naturalWidth, bh / el.naturalHeight)
      const dw = el.naturalWidth * base * arr.e.z, dh = el.naturalHeight * base * arr.e.z
      const sx = bw - dw, sy = bh - dh     // holgura: negativa si la foto es más grande que el recuadro
      const nx = Math.abs(sx) < 1 ? arr.e.x : Math.max(0, Math.min(1, arr.e.x + (ev.clientX - arr.x) / sx))
      const ny = Math.abs(sy) < 1 ? arr.e.y : Math.max(0, Math.min(1, arr.e.y + (ev.clientY - arr.y) / sy))
      ENC[u] = { ...arr.e, x: nx, y: ny }
      _posicionarEnc(caja); _programarRegenerar()
    })
    const fin = () => { arr = null; caja.style.cursor = 'grab' }
    caja.addEventListener('pointerup', fin); caja.addEventListener('pointercancel', fin)
  })
}

// ── fotos de cada modelo: todas las fotos de todos los colores para escoger la principal y las extras ──
const miniatura = (u) => (u && u.includes('res.cloudinary.com') && u.includes('/upload/')) ? u.replace('/upload/', '/upload/w_200,h_240,c_fill,g_auto,q_auto/') : u
async function cargarGaleria(pid) {
  if (S.galerias[pid]) return
  S.galerias[pid] = []      // marcador: ya se está cargando
  const base = S.prods.find(p => p.id === pid); if (!base) return
  const url = (x) => typeof x === 'string' ? x : (x && x.url) || ''
  const porUrl = new Map()  // url -> {color, hex}
  let vars = []
  try { const r = await fetch(`${API}/variantes/producto/${encodeURIComponent(pid)}`); vars = await r.json(); if (!Array.isArray(vars)) vars = [] } catch (e) { vars = [] }
  vars.forEach(v => { [v.foto_url, ...(Array.isArray(v.imagenes) ? v.imagenes : [])].map(url).filter(Boolean).forEach(u => { if (!porUrl.has(u)) porUrl.set(u, { color: v.color || '', hex: v.color_hex || '' }) }) })
  const lista = [], vistos = new Set()
  const add = (u, etiquetaPortada) => { u = url(u); if (!u || vistos.has(u)) return; vistos.add(u); const c = porUrl.get(u) || {}; lista.push({ url: u, color: c.color || '', hex: c.hex || '', portada: !!etiquetaPortada }) }
  add(base.imagen_principal, true)
  ;(Array.isArray(base.imagenes) ? base.imagenes : []).forEach(u => add(u))
  porUrl.forEach((_, u) => add(u))
  S.galerias[pid] = lista
}
window.rsPintarFotos = () => {
  const card = document.getElementById('rs-fotos-card'), cont = document.getElementById('rs-fotos')
  if (!card || !cont) return
  card.style.display = S.sel.length ? 'block' : 'none'
  cont.innerHTML = S.sel.map(id => {
    const base = S.prods.find(p => p.id === id); if (!base) return ''
    const gal = S.galerias[id]
    const d = datosProducto(base), f = S.fotos[id] || {}, extras = f.extras || []
    const cuerpo = !gal ? '<p style="font-size:0.78rem;color:#94a3b8;margin:0">Cargando fotos...</p>'
      : !gal.length ? '<p style="font-size:0.78rem;color:#94a3b8;margin:0">Este modelo no tiene fotos.</p>'
      : `<div class="rs-gal">${gal.map((g, i) => {
        const pri = g.url === d.foto, ext = extras.includes(g.url)
        return `<div class="rs-ft ${pri ? 'pri' : ''} ${ext ? 'ext' : ''}" onclick="rsFotoPrincipal('${esc(id)}',${i})" title="${esc(g.color || (g.portada ? 'Portada' : 'Foto'))}">
          ${pri ? '<span class="rs-tag">PRINCIPAL</span>' : ''}<img src="${esc(miniatura(g.url))}" loading="lazy" alt="">
          ${pri ? '' : `<button class="rs-mas" title="${ext ? 'Quitar del carrusel' : 'Agregar al carrusel'}" onclick="event.stopPropagation();rsFotoExtra('${esc(id)}',${i})">${ext ? '✓' : '＋'}</button>`}
          <span class="rs-col">${g.hex ? `<i style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${esc(g.hex)};border:1px solid rgba(0,0,0,.2);margin-right:3px"></i>` : ''}${esc(g.color || (g.portada ? 'Portada' : 'Foto'))}</span>
        </div>`
      }).join('')}</div>`
    return `<div style="margin-bottom:6px"><p style="margin:0 0 4px;font-size:0.82rem;font-weight:700;color:#334155">${esc(d.titulo)}</p>${cuerpo}</div>`
  }).join('')
}
window.rsFotoPrincipal = (id, i) => {
  const g = (S.galerias[id] || [])[i]; if (!g) return
  const f = S.fotos[id] = S.fotos[id] || { extras: [] }
  f.principal = g.url
  f.extras = (f.extras || []).filter(u => u !== g.url)
  window.rsPintarFotos(); window.rsGenerar()
}
window.rsFotoExtra = (id, i) => {
  const g = (S.galerias[id] || [])[i]; if (!g) return
  const f = S.fotos[id] = S.fotos[id] || { extras: [] }
  f.extras = f.extras || []
  const k = f.extras.indexOf(g.url)
  if (k >= 0) f.extras.splice(k, 1)
  else { if (f.extras.length >= 5) { alert('Máximo 5 fotos extra por modelo.'); return } f.extras.push(g.url) }
  window.rsPintarFotos(); window.rsGenerar()
}

let _gen = 0
window.rsGenerar = async () => {
  const mi = ++_gen
  const grid = document.getElementById('rs-grid'), vacio = document.getElementById('rs-vacio'), pub = document.getElementById('rs-publicar')
  if (!grid) return
  if (!S.sel.length) { grid.innerHTML = ''; vacio.style.display = 'block'; pub.style.display = 'none'; S.imgs = []; return }
  vacio.style.display = 'none'; grid.innerHTML = '<p style="font-size:0.8rem;color:#64748b;grid-column:1/-1">Armando las imágenes...</p>'
  const F = FORMATOS[OPT.formato], E = ESTILOS[OPT.estilo]
  const o = (id) => document.getElementById(id)?.checked
  const T = S.textos
  const opts = { precio: o('rs-o-precio'), nuevo: o('rs-o-nuevo'), colores: o('rs-o-colores'), ajuste: o('rs-o-completa') ? 'completa' : 'llenar', colorNombre: false,
    etiqueta: (T.etiqueta || '').trim(), tituloCollage: (T.tituloCollage || '').trim(), cierre: (T.cierre || '').trim(), pie: (T.pie || '').trim() }
  const prods = S.sel.map(id => {
    const d = datosProducto(S.prods.find(p => p.id === id)); if (!d) return null
    const x = T.porProd[id] || {}
    if ((x.titulo || '').trim()) d.titulo = x.titulo.trim()
    if (x.precio !== undefined && x.precio !== '' && !isNaN(parseFloat(x.precio))) d.precio = Math.round(parseFloat(x.precio))
    if (x.tallas !== undefined && String(x.tallas).trim() !== '') d.tallas = String(x.tallas).trim()
    return d
  }).filter(Boolean)
  const laminas = []
  const porColor = o('rs-o-porcolor')
  const fotosUsadas = []   // para el editor de encuadre
  const usada = (u) => { if (u && !fotosUsadas.includes(u)) fotosUsadas.push(u) }
  const delProducto = async (p) => {
    const urls = [p.foto]
    if (porColor) p.colores.forEach(c => { if (c.foto && !urls.includes(c.foto)) urls.push(c.foto) })
    ;((S.fotos[p.id] && S.fotos[p.id].extras) || []).forEach(u => { if (!urls.includes(u)) urls.push(u) })
    const manual = !!(S.fotos[p.id] && S.fotos[p.id].principal)
    const colorDe = (u) => ((S.galerias[p.id] || []).find(g => g.url === u) || {}).color || (p.colores.find(c => c.foto === u) || {}).n || ''
    for (const [i, u] of urls.slice(0, 6).entries()) {
      usada(u)
      // si se eligió otra foto como principal (o es una imagen extra), la lámina dice de qué color es
      const colorLam = (i > 0 || manual) ? colorDe(u) : ''
      laminas.push(await laminaProducto(F, E, { ...p, colorLamina: colorLam }, u, { ...opts, colorNombre: !!colorLam }, i))
    }
  }
  if (OPT.tipo === 'collage') {
    // Cada recuadro es una foto: la principal de cada modelo y, además, las fotos extra que se marcaron (✓), aunque sean del
    // mismo modelo y color (ej. 3 fotos de un mismo zapato). De 4 en 4 por imagen; el precio solo va en la primera foto de cada modelo.
    const items = []
    prods.forEach(p => {
      const extras = ((S.fotos[p.id] && S.fotos[p.id].extras) || []).filter(u => u && u !== p.foto)
      ;[p.foto, ...extras].forEach((u, k) => items.push({ ...p, foto: u, primero: k === 0 }))
    })
    items.forEach(it => usada(it.foto))
    for (let i = 0; i < items.length; i += 4) laminas.push(await laminaCollage(F, E, items.slice(i, i + 4), opts))
  } else if (OPT.tipo === 'carrusel') {
    if (prods.length > 1) laminas.push(await laminaPortada(F, E, prods.slice(0, 4), opts))
    for (const p of prods) await delProducto(p)
    laminas.push(await laminaCierre(F, E, opts))
  } else {
    for (const p of prods) await delProducto(p)
  }
  if (mi !== _gen) return   // se cambió una opción mientras se armaba: gana la última
  rsPintarEncuadre(fotosUsadas)
  S.imgs = laminas.slice(0, 10)
  grid.innerHTML = ''
  S.imgs.forEach((c, i) => { const w = document.createElement('div'); w.appendChild(c); const t = document.createElement('div'); t.style.cssText = 'font-size:0.68rem;color:#94a3b8;text-align:center;margin-top:3px'; t.textContent = OPT.tipo === 'carrusel' ? `Lámina ${i + 1} de ${S.imgs.length}` : `Imagen ${i + 1}`; w.appendChild(t); grid.appendChild(w) })
  pub.style.display = 'block'
  const cap = document.getElementById('rs-caption')
  if (cap) {
    // El texto se reescribe solo cuando cambian los modelos; si lo editaste a mano se respeta mientras no cambies la selección
    if (cap.dataset.sel !== S.sel.join(',') || !cap.dataset.editado) { cap.value = escribirTexto(prods, opts); delete cap.dataset.editado }
    cap.dataset.sel = S.sel.join(',')
    cap.oninput = () => { cap.dataset.editado = '1' }
  }
}

const aBlob = (c) => new Promise(res => c.toBlob(res, 'image/jpeg', 0.92))
window.rsDescargar = async () => {
  if (!S.imgs.length) return
  for (const [i, c] of S.imgs.entries()) {
    try {
      const b = await aBlob(c)
      const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `zapatillasmay_${OPT.estilo}_${i + 1}.jpg`
      document.body.appendChild(a); a.click(); a.remove()
      await new Promise(r => setTimeout(r, 300))
    } catch (e) { alert('No se pudo exportar la imagen (¿alguna foto no permite descargarla?).'); return }
  }
}
window.rsCopiarTexto = async () => {
  try { await navigator.clipboard.writeText(document.getElementById('rs-caption').value); window.mostrarToastPanel && window.mostrarToastPanel('📋 Texto copiado') } catch (e) { document.getElementById('rs-caption').select() }
}
window.rsPublicar = async () => {
  const fb = document.getElementById('rs-d-fb').checked, ig = document.getElementById('rs-d-ig').checked
  const destinos = [fb && 'facebook', ig && 'instagram'].filter(Boolean)
  const res = document.getElementById('rs-res-pub'), btn = document.getElementById('rs-btn-pub')
  const msg = (t, ok) => { res.style.display = 'block'; res.style.color = ok ? '#15803d' : '#b91c1c'; res.innerHTML = t }
  if (!destinos.length) { msg('Elige dónde publicar (Facebook, Instagram o ambos).', false); return }
  if (!S.imgs.length) return
  const esHistoria = OPT.formato === 'historia'
  if (esHistoria && fb) { msg('Las historias solo se publican en Instagram: quita Facebook o cambia el formato.', false); return }
  if (!confirm(`¿Publicar ahora en ${destinos.map(d => d === 'facebook' ? 'Facebook' : 'Instagram').join(' y ')}? ${S.imgs.length > 1 ? `(${S.imgs.length} imágenes)` : ''} Se publica de verdad.`)) return
  btn.disabled = true
  try {
    const urls = []
    for (const [i, c] of S.imgs.entries()) {
      btn.textContent = `Subiendo imágenes ${i + 1}/${S.imgs.length}...`
      const b = await aBlob(c)
      const fd = new FormData(); fd.append('archivo', new File([b], `post_${Date.now()}_${i}.jpg`, { type: 'image/jpeg' }))
      const r = await fetch(API + '/imagenes/upload-temp', { method: 'POST', body: fd })
      const d = await r.json().catch(() => ({}))
      const u = d.url || d.public_url
      if (!r.ok || !u) throw new Error('No se pudo subir una de las imágenes')
      urls.push(u)
    }
    btn.textContent = 'Publicando en Meta (puede tardar un minuto)...'
    const r = await fetch(API + '/redes/publicar', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls, caption: document.getElementById('rs-caption').value, destinos, historia: esHistoria, producto_ids: S.sel }) })
    const d = await r.json().catch(() => ({}))
    if (!d.resultados) throw new Error(d.error || 'No se pudo publicar')
    const lineas = Object.entries(d.resultados).map(([k, v]) => `${v.ok ? '✅' : '❌'} <strong>${k === 'facebook' ? 'Facebook' : 'Instagram'}:</strong> ${v.ok ? 'publicado' : esc(v.error)}`)
    msg(lineas.join('<br>'), d.ok)
    if (d.ok) { S.sel.forEach(id => S.publicados.add(id)); window.rsHistorial() }
  } catch (e) { msg('Error: ' + esc(e.message), false) }
  btn.disabled = false; btn.textContent = '🚀 Publicar ahora'
}
window.rsHistorial = async () => {
  const el = document.getElementById('rs-hist'); if (!el) return
  try {
    const l = await fetch(API + '/redes/historial').then(r => r.json())
    el.innerHTML = Array.isArray(l) && l.length ? l.slice(0, 10).map(x => `<div style="padding:6px 0;border-top:1px solid #f1f5f9"><strong>${x.destino === 'facebook' ? 'Facebook' : 'Instagram'}</strong> · ${esc(x.tipo)} · ${new Date(x.created_at).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })} · ${esc(x.usuario || '')}<br><span style="color:#94a3b8">${esc(String(x.caption || '').split('\n')[2] || String(x.caption || '').slice(0, 70))}</span></div>`).join('') : 'Todavía no has publicado desde aquí.'
  } catch (e) { el.textContent = 'No se pudo cargar el historial.' }
}

