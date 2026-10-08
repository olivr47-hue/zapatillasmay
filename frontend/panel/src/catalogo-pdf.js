// ═══ Catálogo en PDF por categoría (para mandar por WhatsApp desde Conversaciones) ═══════════════════════════════════
// Arma el PDF EN EL NAVEGADOR con los productos y fotos de ese momento (por eso siempre está al día), igual que el catálogo por categoría
// del portal de mayoristas, pero con la marca del negocio y, si se quiere, precios. Devuelve un Blob listo para descargar o enviar.
const _codigoModelo = (nombre) => {
  const m = (nombre || '').trim().match(/^([A-Za-z]+\d+)/)
  return m ? m[1].toUpperCase() : (nombre || '').trim().split(/\s+/)[0]?.toUpperCase() || 'S/C'
}

// Un renglón por modelo y color (con su foto)
window.catalogoItemsDeCategoria = (cat, productos, variantes, precioFn) => {
  const items = []
  productos.filter(p => p.categoria === cat && p.activo !== false).forEach(p => {
    const codigo = _codigoModelo(p.nombre)
    const vistos = new Set()
    variantes.filter(v => v.producto_id === p.id && v.activa !== false).forEach(v => {
      const color = (v.color || '').trim().toUpperCase()
      if (!color || vistos.has(color)) return
      vistos.add(color)
      const imgUrl = v.foto_url || p.imagen_principal
      if (imgUrl) items.push({ sku: codigo, color, imgUrl, precio: precioFn ? precioFn(p) : null })
    })
    if (!vistos.size && p.imagen_principal) items.push({ sku: codigo, color: 'ÚNICO', imgUrl: p.imagen_principal, precio: precioFn ? precioFn(p) : null })
  })
  return items
}

window.generarCatalogoPDFBlob = async ({ items, titulo, negocio, tel, conPrecio, progreso }) => {
  if (!window.jspdf) {
    await new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
      s.onload = resolve; s.onerror = () => reject(new Error('No se pudo cargar el generador de PDF'))
      document.head.appendChild(s)
    })
  }
  const { jsPDF } = window.jspdf
  const cols = 2, rows = 3, porPagina = cols * rows
  const pageW = 1080, pageH = 1440
  const _tel = tel ? (tel.length === 10 ? tel.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3') : tel) : ''
  const marca = !!(negocio || _tel)
  const marginX = 40, gapX = 24, gapY = 32
  const marginTop = !marca ? 80 : (negocio ? (_tel ? 176 : 126) : 150)
  const marginBottom = marca ? 96 : 80
  const cellW = (pageW - marginX * 2 - gapX * (cols - 1)) / cols
  const cellH = (pageH - marginTop - marginBottom - gapY * (rows - 1)) / rows
  const imgH = cellH - (conPrecio ? 70 : 50)

  const cargar = (url) => new Promise(resolve => {
    if (!url) return resolve(null)
    const img = new Image(); img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img); img.onerror = () => resolve(null)
    img.src = /^https?:/i.test(url) ? url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now() : url
  })
  const contener = (ctx, img, x, y, w, h) => {
    ctx.save(); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(x, y, w, h)
    if (img) {
      ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip()
      const ir = img.naturalWidth / img.naturalHeight, cr = w / h
      let dx, dy, dw, dh
      if (ir > cr) { dw = w; dh = w / ir; dx = x; dy = y + (h - dh) / 2 } else { dh = h; dw = h * ir; dy = y; dx = x + (w - dw) / 2 }
      ctx.drawImage(img, dx, dy, dw, dh)
    } else {
      ctx.fillStyle = '#F3F4F6'; ctx.fillRect(x, y, w, h)
      ctx.fillStyle = '#9CA3AF'; ctx.font = '20px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Sin imagen', x + w / 2, y + h / 2)
    }
    ctx.restore()
  }

  const paginas = []
  for (let i = 0; i < items.length; i += porPagina) paginas.push(items.slice(i, i + porPagina))
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [pageW, pageH] })
  const tituloCat = String(titulo || '').toUpperCase()

  for (let pi = 0; pi < paginas.length; pi++) {
    if (progreso) progreso(pi + 1, paginas.length)
    const canvas = document.createElement('canvas'); canvas.width = pageW; canvas.height = pageH
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#FAFAF8'; ctx.fillRect(0, 0, pageW, pageH)
    ctx.textAlign = 'center'
    if (marca) {
      let yy = 56
      if (negocio) {
        ctx.fillStyle = '#2A1A0E'; ctx.font = '700 40px sans-serif'
        let tam = 40
        while (ctx.measureText(negocio.toUpperCase()).width > pageW - 120 && tam > 22) { tam -= 2; ctx.font = `700 ${tam}px sans-serif` }
        ctx.fillText(negocio.toUpperCase(), pageW / 2, yy); yy += 36
      }
      ctx.fillStyle = '#8A6A55'; ctx.font = '400 20px sans-serif'; ctx.letterSpacing = '4px'
      ctx.fillText(`CATÁLOGO DE ${tituloCat}`, pageW / 2, yy); ctx.letterSpacing = '0px'
      if (_tel) {
        const txt = 'WhatsApp: ' + _tel
        ctx.font = '700 30px sans-serif'
        const w = ctx.measureText(txt).width + 64, h = 50, x = (pageW - w) / 2, y = yy + 14
        ctx.fillStyle = '#25D366'
        ctx.beginPath(); ctx.moveTo(x + h / 2, y); ctx.lineTo(x + w - h / 2, y); ctx.arc(x + w - h / 2, y + h / 2, h / 2, -Math.PI / 2, Math.PI / 2)
        ctx.lineTo(x + h / 2, y + h); ctx.arc(x + h / 2, y + h / 2, h / 2, Math.PI / 2, -Math.PI / 2); ctx.closePath(); ctx.fill()
        ctx.fillStyle = '#FFFFFF'; ctx.fillText(txt, pageW / 2, y + 35)
      }
      ctx.fillStyle = '#C8967A'; ctx.fillRect(marginX, marginTop - 12, pageW - marginX * 2, 1.5)
    } else {
      ctx.fillStyle = '#2A1A0E'; ctx.font = '300 20px sans-serif'; ctx.letterSpacing = '4px'
      ctx.fillText(`CATÁLOGO DE ${tituloCat}`, pageW / 2, 38); ctx.letterSpacing = '0px'
      ctx.fillStyle = '#C8967A'; ctx.fillRect(marginX, 48, pageW - marginX * 2, 1.5)
    }
    for (let k = 0; k < paginas[pi].length; k++) {
      const it = paginas[pi][k]
      const cx = marginX + (k % cols) * (cellW + gapX), cy = marginTop + Math.floor(k / cols) * (cellH + gapY)
      contener(ctx, await cargar(it.imgUrl), cx, cy, cellW, imgH)
      ctx.fillStyle = '#E8DDD5'; ctx.fillRect(cx, cy + imgH, cellW, 1)
      ctx.fillStyle = '#2A1A0E'; ctx.textAlign = 'center'; ctx.font = '600 18px sans-serif'
      ctx.fillText(`${it.sku} ${it.color}`, cx + cellW / 2, cy + imgH + 26)
      if (it.precio) { ctx.fillStyle = '#B3125F'; ctx.font = '700 26px sans-serif'; ctx.fillText('$' + Math.round(it.precio).toLocaleString('es-MX'), cx + cellW / 2, cy + imgH + 58) }
    }
    ctx.fillStyle = '#C8967A'; ctx.fillRect(marginX, pageH - (marca ? 78 : 48), pageW - marginX * 2, 1)
    ctx.textAlign = 'center'
    if (marca) { ctx.fillStyle = '#4A2E1E'; ctx.font = '700 24px sans-serif'; ctx.fillText([negocio, _tel ? 'WhatsApp ' + _tel : ''].filter(Boolean).join('   ·   '), pageW / 2, pageH - 46) }
    ctx.fillStyle = '#A07860'; ctx.font = '300 15px sans-serif'
    ctx.fillText([conPrecio ? 'Precios en MXN, no incluyen envío' : '', `Página ${pi + 1} de ${paginas.length}`].filter(Boolean).join('   |   '), pageW / 2, pageH - (marca ? 20 : 30))
    if (pi > 0) pdf.addPage([pageW, pageH])
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.88), 'JPEG', 0, 0, pageW, pageH)
  }
  return pdf.output('blob')
}
