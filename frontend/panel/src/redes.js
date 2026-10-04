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
const SERIF = '"Montserrat", "Montserrat", Arial, sans-serif'   // títulos y precios
const SCRIPT = SERIF
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
    l.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap'
    document.head.appendChild(l)
  }
  try {
    await Promise.all(['400 30px "Montserrat"', '500 30px "Montserrat"', '600 30px "Montserrat"', '700 30px "Montserrat"'].map(f => document.fonts.load(f)))
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
const foto = (ctx, img, x, y, w, h, r, modo, fondo) => {
  ctx.save(); rr(ctx, x, y, w, h, r); ctx.clip()
  if (fondo) { ctx.fillStyle = fondo; ctx.fillRect(x, y, w, h) }
  if (img) {
    const s = modo === 'completa' ? Math.min(w / img.width, h / img.height) : Math.max(w / img.width, h / img.height)
    const dw = img.width * s, dh = img.height * s
    ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh)
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
  ctx.font = `700 ${Math.round(r * 0.3)}px "Montserrat", sans-serif`; ctx.letterSpacing = '2px'
  ctx.fillText(texto, cx, cy + 2); ctx.letterSpacing = '0px'
  ctx.font = `${Math.round(r * 0.3)}px "Montserrat", sans-serif`; ctx.fillText('✦', cx, cy - r * 0.42)
}
const etiquetaPrecio = (ctx, txt, x, yBase, W, E) => {
  ctx.font = `700 ${Math.round(W * 0.042)}px ${SERIF}`
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
  foto(ctx, img, fx, fy, fw, fh, radio, opts.ajuste, E.tarjeta)
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
  const sub = (opts.colorNombre && p.colorLamina) ? p.colorLamina : 'Nueva colección'
  ctx.fillStyle = E.acento; ctx.font = `600 ${Math.round(W * 0.024)}px ${SERIF}`; espaciado(ctx, 6)
  ctx.fillText(sub.toUpperCase(), W / 2, y0); espaciado(ctx, 0)
  const tam = Math.round(W * (esHistoria ? 0.056 : (H <= 1100 ? 0.044 : 0.048))), inter = Math.round(tam * 1.28)
  ctx.fillStyle = E.texto; ctx.font = `600 ${tam}px ${SERIF}`
  envolver(ctx, p.titulo, W / 2, y0 + Math.round(W * 0.07), W - pad * 2.2, inter, H <= 1100 ? 1 : 2)
  if (hayPuntos) {
    const r = Math.round(W * 0.0145), sep = r * 3, n = Math.min(p.colores.length, 7)
    const x0 = W / 2 - ((n - 1) * sep) / 2
    p.colores.slice(0, n).forEach((col, i) => {
      ctx.beginPath(); ctx.arc(x0 + i * sep, yPuntos - r * 0.6, r, 0, Math.PI * 2); ctx.fillStyle = col.hex || '#999'; ctx.fill()
      ctx.lineWidth = 2; ctx.strokeStyle = E.oscuro ? 'rgba(255,255,255,.55)' : E.oro; ctx.stroke()
    })
  }
  ctx.fillStyle = E.suave; ctx.font = `500 ${Math.round(W * 0.024)}px "Montserrat", sans-serif`; espaciado(ctx, 1.5)
  ctx.fillText(p.tallas ? `TALLAS ${p.tallas}   ·   ENVÍOS A TODO MÉXICO` : 'ENVÍOS A TODO MÉXICO', W / 2, yTallas)
  espaciado(ctx, 0)
  divisor(ctx, W / 2, yWA - Math.round(W * 0.036), Math.round(W * 0.42), E)
  ctx.fillStyle = E.texto; ctx.font = `700 ${Math.round(W * 0.025)}px "Montserrat", sans-serif`; espaciado(ctx, 2)
  ctx.fillText(`WHATSAPP  ${WA_TXT}`, W / 2, yWA); espaciado(ctx, 0)
  return c
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
  ctx.fillStyle = E.acento; ctx.font = `600 ${Math.round(W * 0.026)}px ${SERIF}`; espaciado(ctx, 8)
  ctx.fillText('NUEVA COLECCIÓN', W / 2, y - Math.round(W * 0.075)); espaciado(ctx, 0)
  ctx.fillStyle = E.texto; ctx.font = `600 ${Math.round(W * 0.07)}px ${SERIF}`; espaciado(ctx, 3)
  ctx.fillText('NUEVOS MODELOS', W / 2, y); espaciado(ctx, 0)
  y += Math.round(W * 0.045)
  divisor(ctx, W / 2, y, Math.round(W * 0.5), E)
  const top = y + Math.round(W * 0.05)
  const piePx = Math.round(H * 0.085)
  const n = Math.min(prods.length, 4)
  const cols = n <= 3 ? n : 2, filas = Math.ceil(n / cols)   // 2-3 modelos: en columnas altas (como la foto); 4: cuadrícula 2x2
  const gap = Math.round(W * 0.03)
  const aw = H - top - piePx - Math.round(H * 0.045)
  const cw = (W - pad * 2 - gap * (cols - 1)) / cols, ch = (aw - gap * (filas - 1)) / filas
  for (let i = 0; i < n; i++) {
    const p = prods[i], img = await cargarImagen(p.foto)
    const x = pad + (i % cols) * (cw + gap), yy = top + Math.floor(i / cols) * (ch + gap)
    ctx.save(); ctx.shadowColor = E.oscuro ? 'rgba(0,0,0,0.45)' : 'rgba(120,60,70,0.25)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 9
    rr(ctx, x, yy, cw, ch, [46, 46, 22, 22]); ctx.fillStyle = E.tarjeta; ctx.fill(); ctx.restore()
    foto(ctx, img, x, yy, cw, ch, [46, 46, 22, 22], opts.ajuste, E.tarjeta)
    ctx.strokeStyle = E.oro; ctx.lineWidth = 1.6; rr(ctx, x + 8, yy + 8, cw - 16, ch - 16, [40, 40, 16, 16]); ctx.globalAlpha = 0.7; ctx.stroke(); ctx.globalAlpha = 1
    if (opts.precio && p.precio) etiquetaPrecio(ctx, moneda(p.precio), x + cw - 16, yy + ch - 16, W * 0.78, E)
  }
  ctx.fillStyle = E.texto; ctx.font = `700 ${Math.round(W * 0.024)}px "Montserrat", sans-serif`; espaciado(ctx, 2)
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillText(`WHATSAPP  ${WA_TXT}   ·   ZAPATILLASMAY.MX`, W / 2, H - Math.round(H * 0.055)); espaciado(ctx, 0)
  return c
}

// ── portada y cierre del carrusel ──
async function laminaPortada(F, E, prods, opts) { return laminaCollage(F, E, prods, opts) }
async function laminaCierre(F, E) {
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
  ctx.fillStyle = '#fff'; ctx.font = `600 ${Math.round(W * 0.075)}px ${SERIF}`
  envolver(ctx, '¿Cuál es tu favorito?', W / 2, H * 0.46, W * 0.82, W * 0.1, 2)
  divisor(ctx, W / 2, H * 0.64, W * 0.4, { oro: '#ffffff' })
  ctx.font = `500 ${Math.round(W * 0.03)}px "Montserrat", sans-serif`; espaciado(ctx, 3)
  ctx.fillText('PÍDELO POR WHATSAPP', W / 2, H * 0.71); espaciado(ctx, 0)
  ctx.font = `700 ${Math.round(W * 0.07)}px ${SERIF}`
  ctx.fillText(WA_TXT, W / 2, H * 0.78)
  ctx.font = `500 ${Math.round(W * 0.027)}px "Montserrat", sans-serif`; espaciado(ctx, 2)
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
const S = { prods: [], variantes: [], sel: [], publicados: new Set(), imgs: [], estado: null }

function datosProducto(p) {
  const vars = S.variantes.filter(v => v.producto_id === p.id)
  const colores = []
  const vistos = new Set()
  vars.forEach(v => { if (v.color && !vistos.has(v.color)) { vistos.add(v.color); colores.push({ n: v.color, hex: v.color_hex || '#999', foto: v.foto_url || '' }) } })
  const tallas = [...new Set(vars.map(v => parseFloat(v.talla)).filter(x => !isNaN(x)))].sort((a, b) => a - b)
  const corto = String(p.nombre || '').replace(/\s+/g, ' ').trim()
  const titulo = corto.length > 46 ? corto.slice(0, 46).replace(/\s+\S*$/, '') : corto
  const precio = (parseFloat(p.precio_menudeo) || 0) + (p.es_oferta ? 0 : 80)   // el mismo precio que ve la clienta en la tienda
  return { id: p.id, titulo, precio: Math.round(precio), colores, foto: p.imagen_principal || (colores[0] && colores[0].foto) || '', tallas: tallas.length ? `${tallas[0]}–${tallas[tallas.length - 1]}` : '' }
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

const OPT = { tipo: 'fotos', formato: 'vertical', estilo: 'blush' }
window.rsOpt = (k, v) => {
  OPT[k] = v
  document.querySelectorAll(`#rs-${k} button`).forEach(b => b.classList.toggle('on', b.dataset.v === v))
  window.rsGenerar()
}
window.rsToggle = (id) => {
  const i = S.sel.indexOf(id)
  if (i >= 0) S.sel.splice(i, 1)
  else { if (S.sel.length >= 8) { alert('Máximo 8 modelos por publicación.'); return }; S.sel.push(id) }
  document.querySelectorAll('#rs-nuevos .rs-chip').forEach(c => c.classList.toggle('on', S.sel.includes(c.dataset.id)))
  const cont = document.getElementById('rs-elegidos')
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

let _gen = 0
window.rsGenerar = async () => {
  const mi = ++_gen
  const grid = document.getElementById('rs-grid'), vacio = document.getElementById('rs-vacio'), pub = document.getElementById('rs-publicar')
  if (!grid) return
  if (!S.sel.length) { grid.innerHTML = ''; vacio.style.display = 'block'; pub.style.display = 'none'; S.imgs = []; return }
  vacio.style.display = 'none'; grid.innerHTML = '<p style="font-size:0.8rem;color:#64748b;grid-column:1/-1">Armando las imágenes...</p>'
  const F = FORMATOS[OPT.formato], E = ESTILOS[OPT.estilo]
  const o = (id) => document.getElementById(id)?.checked
  const opts = { precio: o('rs-o-precio'), nuevo: o('rs-o-nuevo'), colores: o('rs-o-colores'), ajuste: o('rs-o-completa') ? 'completa' : 'llenar', colorNombre: false }
  const prods = S.sel.map(id => datosProducto(S.prods.find(p => p.id === id))).filter(Boolean)
  const laminas = []
  const porColor = o('rs-o-porcolor')
  const delProducto = async (p) => {
    const urls = [p.foto]
    if (porColor) p.colores.forEach(c => { if (c.foto && !urls.includes(c.foto)) urls.push(c.foto) })
    for (const [i, u] of urls.slice(0, 4).entries()) {
      const colorLam = i > 0 ? (p.colores.find(c => c.foto === u) || {}).n : ''
      laminas.push(await laminaProducto(F, E, { ...p, colorLamina: colorLam }, u, { ...opts, colorNombre: i > 0 }, i))
    }
  }
  if (OPT.tipo === 'collage') {
    for (let i = 0; i < prods.length; i += 4) laminas.push(await laminaCollage(F, E, prods.slice(i, i + 4), opts))
  } else if (OPT.tipo === 'carrusel') {
    if (prods.length > 1) laminas.push(await laminaPortada(F, E, prods.slice(0, 4), opts))
    for (const p of prods) await delProducto(p)
    laminas.push(await laminaCierre(F, E))
  } else {
    for (const p of prods) await delProducto(p)
  }
  if (mi !== _gen) return   // se cambió una opción mientras se armaba: gana la última
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
