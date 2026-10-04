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
  blanco: { nombre: 'Blanco limpio', bg: ['#fbf8f5', '#f4ece5'], texto: '#2a1a0e', suave: '#8a7b71', acento: '#b5687a', tarjeta: '#ffffff', logo: '/logo-marca.png', oscuro: false },
  rosa: { nombre: 'Rosa Zapatillas May', bg: ['#fde4ef', '#fff6fa'], texto: '#4a1631', suave: '#a0597f', acento: '#E91E8C', tarjeta: '#ffffff', logo: '/logo-marca.png', oscuro: false },
  oscuro: { nombre: 'Editorial oscuro', bg: ['#1b1214', '#120c0e'], texto: '#f7ede4', suave: '#b9a597', acento: '#d9b27a', tarjeta: '#241a1c', logo: '/logo-marca-blanco.png', oscuro: true },
  nude: { nombre: 'Nude cálido', bg: ['#efe2d6', '#e6d3c3'], texto: '#3b2a22', suave: '#7d6759', acento: '#a8654a', tarjeta: '#faf3ec', logo: '/logo-marca.png', oscuro: false },
}
const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif'
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
    l.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@500;700&display=swap'
    document.head.appendChild(l)
  }
  try {
    await Promise.all(['700 60px "Playfair Display"', 'italic 600 60px "Playfair Display"', '700 30px "DM Sans"', '500 30px "DM Sans"'].map(f => document.fonts.load(f)))
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
  const g = ctx.createLinearGradient(0, 0, W * 0.4, H)
  g.addColorStop(0, E.bg[0]); g.addColorStop(1, E.bg[1])
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
}
const pastilla = (ctx, texto, x, y, color, txt, tam, alineacion = 'left') => {
  ctx.font = `700 ${tam}px "DM Sans", sans-serif`
  const w = ctx.measureText(texto).width + tam * 1.3, h = tam * 1.9
  const x0 = alineacion === 'center' ? x - w / 2 : x
  rr(ctx, x0, y, w, h, h / 2); ctx.fillStyle = color; ctx.fill()
  ctx.fillStyle = txt; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillText(texto, x0 + w / 2, y + h / 2 + 1)
  return { w, h }
}
const logo = async (ctx, E, cx, y, ancho) => {
  const img = await cargarImagen(E.logo)
  if (!img) return 0
  const h = ancho * img.height / img.width
  ctx.drawImage(img, cx - ancho / 2, y, ancho, h)
  return h
}
const moneda = (n) => '$' + Number(n || 0).toLocaleString('es-MX', { maximumFractionDigits: 0 })

// ── una lámina de UN modelo ──
async function laminaProducto(F, E, p, urlFoto, opts, indiceColor) {
  const { w: W, h: H } = F
  const c = document.createElement('canvas'); c.width = W; c.height = H
  const ctx = c.getContext('2d')
  const img = await cargarImagen(urlFoto)
  const pad = Math.round(W * 0.06), esHistoria = H > 1500
  fondo(ctx, W, H, E)
  if (E.oscuro) { ctx.strokeStyle = E.acento; ctx.globalAlpha = 0.55; ctx.lineWidth = 3; rr(ctx, 26, 26, W - 52, H - 52, 6); ctx.stroke(); ctx.globalAlpha = 1 }
  // proporciones: cabecera con logo · foto · pie con textos (el pie crece en formatos más cuadrados para que todo quepa)
  const altoCab = esHistoria ? 210 : Math.round(H * 0.118)
  const lw = Math.min(W * 0.3, altoCab * 0.74 / 0.342)
  await logo(ctx, E, W / 2, Math.round(altoCab * 0.14), Math.round(lw))
  const altoPie = Math.round(H * (esHistoria ? 0.25 : (H <= 1100 ? 0.375 : 0.315)))
  const fy = altoCab, fh = H - altoCab - altoPie
  const fx = pad, fw = W - pad * 2
  const arco = E === ESTILOS.nude
  const radio = arco ? [fw / 2, fw / 2, 34, 34] : 38
  ctx.save(); ctx.shadowColor = 'rgba(40,20,15,0.22)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 14
  rr(ctx, fx, fy, fw, fh, radio); ctx.fillStyle = E.tarjeta; ctx.fill(); ctx.restore()
  foto(ctx, img, fx, fy, fw, fh, radio, opts.ajuste, E.tarjeta)
  if (opts.nuevo && indiceColor === 0) pastilla(ctx, 'NUEVO', fx + (arco ? fw / 2 - 60 : 26), fy + 26, E.acento, E.oscuro ? '#1b1214' : '#ffffff', Math.round(W * 0.026))
  if (opts.precio && p.precio) {
    ctx.font = `700 ${Math.round(W * 0.05)}px ${SERIF}`
    const txt = moneda(p.precio); const tw = ctx.measureText(txt).width + 54, th = Math.round(W * 0.095)
    const px = fx + fw - tw - 26, py = fy + fh - th - 26
    rr(ctx, px, py, tw, th, th / 2); ctx.fillStyle = E.oscuro ? E.acento : '#ffffff'; ctx.fill()
    ctx.fillStyle = E.oscuro ? '#1b1214' : E.texto; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(txt, px + tw / 2, py + th / 2 + 2)
  }
  // ── pie: los textos se anclan desde ABAJO (WhatsApp, tallas, puntos de color) y el título ocupa lo que sobra ──
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'
  const yWA = H - Math.round(H * 0.032)
  const yTallas = yWA - Math.round(W * 0.056)
  const yPuntos = (opts.colores && p.colores.length) ? yTallas - Math.round(W * 0.052) : yTallas
  const y0 = fy + fh + Math.round(W * 0.05)
  ctx.fillStyle = E.acento; ctx.font = `700 ${Math.round(W * 0.021)}px "DM Sans", sans-serif`
  const sub = (opts.colorNombre && p.colorLamina) ? p.colorLamina.toUpperCase() : 'NUEVA COLECCIÓN'
  ctx.letterSpacing = '4px'; ctx.fillText(sub, W / 2, y0); ctx.letterSpacing = '0px'
  const tam = Math.round(W * (esHistoria ? 0.064 : (H <= 1100 ? 0.054 : 0.058))), inter = Math.round(tam * 1.18)
  ctx.fillStyle = E.texto; ctx.font = `700 ${tam}px ${SERIF}`
  const maxL = 2   // el pie reserva lugar para dos renglones de título
  envolver(ctx, p.titulo, W / 2, y0 + Math.round(W * 0.075), W - pad * 2.4, inter, maxL)
  if (opts.colores && p.colores.length) {
    const r = Math.round(W * 0.015), sep = r * 2.9, n = Math.min(p.colores.length, 7)
    const x0 = W / 2 - ((n - 1) * sep) / 2
    p.colores.slice(0, n).forEach((col, i) => {
      ctx.beginPath(); ctx.arc(x0 + i * sep, yPuntos - r * 0.6, r, 0, Math.PI * 2); ctx.fillStyle = col.hex || '#999'; ctx.fill()
      ctx.lineWidth = 2; ctx.strokeStyle = E.oscuro ? 'rgba(255,255,255,.5)' : 'rgba(0,0,0,.18)'; ctx.stroke()
    })
  }
  ctx.fillStyle = E.suave; ctx.font = `500 ${Math.round(W * 0.025)}px "DM Sans", sans-serif`
  ctx.fillText(p.tallas ? `Tallas ${p.tallas}  ·  Envíos a todo México` : 'Envíos a todo México', W / 2, yTallas)
  ctx.fillStyle = E.texto; ctx.font = `700 ${Math.round(W * 0.026)}px "DM Sans", sans-serif`
  ctx.fillText(`Pídelos por WhatsApp  ${WA_TXT}`, W / 2, yWA)
  return c
}

// ── collage de varios modelos en una sola imagen ──
async function laminaCollage(F, E, prods, opts) {
  const { w: W, h: H } = F
  const c = document.createElement('canvas'); c.width = W; c.height = H
  const ctx = c.getContext('2d'); fondo(ctx, W, H, E)
  const pad = Math.round(W * 0.05), esHistoria = H > 1500
  if (E.oscuro) { ctx.strokeStyle = E.acento; ctx.globalAlpha = 0.55; ctx.lineWidth = 3; rr(ctx, 26, 26, W - 52, H - 52, 6); ctx.stroke(); ctx.globalAlpha = 1 }
  const lh = await logo(ctx, E, W / 2, Math.round(H * 0.035), Math.round(W * 0.3))
  let y = Math.round(H * 0.035) + lh + Math.round(H * 0.018)
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = E.acento; ctx.font = `700 ${Math.round(W * 0.024)}px "DM Sans", sans-serif`; ctx.letterSpacing = '5px'
  ctx.fillText('NUEVA COLECCIÓN', W / 2, y + 12); ctx.letterSpacing = '0px'
  y += Math.round(W * 0.095)
  ctx.fillStyle = E.texto; ctx.font = `700 ${Math.round(W * 0.075)}px ${SERIF}`
  ctx.fillText('Nuevos modelos', W / 2, y)
  const top = y + Math.round(W * 0.05)
  const piePx = Math.round(H * 0.075)
  const n = Math.min(prods.length, 4)
  const cols = n === 1 ? 1 : 2, filas = Math.ceil(n / cols)
  const gap = Math.round(W * 0.025)
  const aw = H - top - piePx - pad * 0.4
  const cw = (W - pad * 2 - gap * (cols - 1)) / cols, ch = (aw - gap * (filas - 1)) / filas
  for (let i = 0; i < n; i++) {
    const p = prods[i], img = await cargarImagen(p.foto)
    const x = pad + (i % cols) * (cw + gap), yy = top + Math.floor(i / cols) * (ch + gap)
    ctx.save(); ctx.shadowColor = 'rgba(40,20,15,0.18)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8
    rr(ctx, x, yy, cw, ch, 28); ctx.fillStyle = E.tarjeta; ctx.fill(); ctx.restore()
    foto(ctx, img, x, yy, cw, ch, 28, opts.ajuste, E.tarjeta)
    if (opts.precio && p.precio) pastilla(ctx, moneda(p.precio), x + 16, yy + ch - Math.round(W * 0.07) - 16, E.oscuro ? E.acento : E.acento, E.oscuro ? '#1b1214' : '#fff', Math.round(W * 0.024))
  }
  ctx.fillStyle = E.texto; ctx.font = `700 ${Math.round(W * 0.026)}px "DM Sans", sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillText(`Pídelos por WhatsApp  ${WA_TXT}  ·  zapatillasmay.mx`, W / 2, H - piePx / 2 - 6)
  return c
}

// ── portada y cierre del carrusel ──
async function laminaPortada(F, E, prods, opts) {
  return laminaCollage(F, E, prods, opts)
}
async function laminaCierre(F, E) {
  const { w: W, h: H } = F
  const c = document.createElement('canvas'); c.width = W; c.height = H
  const ctx = c.getContext('2d')
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, E.acento); g.addColorStop(1, E.oscuro ? '#8a6a3a' : '#7a2d4d')
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'
  const img = await cargarImagen('/logo-marca-blanco.png')
  if (img) { const w = W * 0.5, h = w * img.height / img.width; ctx.drawImage(img, W / 2 - w / 2, H * 0.17, w, h) }
  ctx.fillStyle = '#fff'; ctx.font = `700 ${Math.round(W * 0.085)}px ${SERIF}`
  envolver(ctx, '¿Cuál es tu favorito?', W / 2, H * 0.47, W * 0.8, W * 0.1, 2)
  ctx.font = `500 ${Math.round(W * 0.036)}px "DM Sans", sans-serif`
  ctx.fillText('Pídelo por WhatsApp', W / 2, H * 0.66)
  ctx.font = `700 ${Math.round(W * 0.07)}px "DM Sans", sans-serif`
  ctx.fillText(WA_TXT, W / 2, H * 0.73)
  ctx.font = `500 ${Math.round(W * 0.032)}px "DM Sans", sans-serif`
  ctx.fillText('zapatillasmay.mx  ·  Envíos a todo México', W / 2, H * 0.82)
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

const OPT = { tipo: 'fotos', formato: 'vertical', estilo: 'blanco' }
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
