// ═══ DEMO: funciones nuevas (nov 2026) con datos inventados ════════════════════════════════════════════════════════════
// Estantería/amarres por talla y pantalla Acomodo, Conteo físico del inventario, Guías sacadas, botón Cuadrar fotos y Conversaciones con
// fechas y reacciones. Todo corre en el navegador; nada sale a ningún servidor.
export function registrarRutasNov({ db, ruta, nuevoId, num, q }) {
  const iso = (diasAtras, h = 12, min = 0) => { const d = new Date(Date.now() - diasAtras * 864e5); d.setHours(h, min, 0, 0); return d.toISOString() }

  // ── 1) Estantería / amarres por talla ───────────────────────────────────────────────────────────────────────────────
  db.inventario.forEach((r, i) => {
    const c = num(r.cantidad)
    let am = 0
    if (c >= 4 && i % 11 === 0) am = c               // todo el par en amarres y nada en estantería: sale en «Qué reponer»
    else if (c >= 2 && i % 9 === 0) am = c - 1      // un amarre que se abrió al vender un par
    r.cant_amarres = am; r.cant_estanteria = c - am; r.ubicacion_confirmada = am > 0
  })
  let alertas = db.inventario.filter(r => r.cant_amarres > 0 && r.cant_estanteria > 0).slice(0, 4)
    .map((r, i) => ({ id: 'al-' + i, variante_id: r.variante_id, sucursal_id: r.sucursal_id, pares: 1, created_at: iso(0, 9 + i) }))
  ruta('GET', /^\/inventario\/alertas-ubicacion$/, () => alertas)
  ruta('POST', /^\/inventario\/alertas-ubicacion\/atender$/, ({ body }) => { const ids = new Set(body.variante_ids || []); alertas = alertas.filter(a => !ids.has(a.variante_id)); return { ok: true } })
  ruta('POST', /^\/inventario\/mover-ubicacion$/, ({ body }) => {
    const desde = body.desde === 'estanteria' ? 'estanteria' : 'amarres'
    ;(body.items || []).forEach(({ variante_id, cantidad }) => {
      const r = db.inventario.find(x => x.variante_id === variante_id && x.sucursal_id === body.sucursal_id); if (!r) return
      const n = num(cantidad)
      if (desde === 'amarres') { r.cant_amarres -= n; r.cant_estanteria += n } else { r.cant_estanteria -= n; r.cant_amarres += n }
      r.ubicacion_confirmada = true
    })
    return { ok: true }
  })

  // ── 2) Conteo físico de inventario (por modelo, desde el celular) ───────────────────────────────────────────────────
  const conteos = {}
  const prodDe = (id) => db.productos.find(p => p.id === id) || {}
  const resumenProd = (p, c) => ({ id: p.id, nombre: p.nombre, sku_interno: p.sku_interno, imagen_principal: p.imagen_principal, conteo_id: c ? c.id : null, conteo_por: c ? c.creado_por : null })
  const abierto = (pid) => Object.values(conteos).find(c => c.producto_id === pid && c.estado === 'abierto')
  const erpDe = (vid) => db.inventario.filter(x => x.variante_id === vid).reduce((s, x) => s + num(x.cantidad), 0)
  const talla = (t) => { const n = parseFloat(String(t).replace('_', '.')); return isNaN(n) ? 999 : n }
  const cargar = (c) => {
    const vs = db.variantes.filter(v => v.producto_id === c.producto_id && v.activa !== false)
    const filas = vs.map(v => { const ub = c.lineas[v.id]; return { id: v.id, color: v.color || '', talla: String(v.talla || ''), erp: erpDe(v.id), tocada: !!ub, contado: ub || {}, total: Object.values(ub || {}).reduce((s, n) => s + n, 0) } })
      .sort((a, b) => a.color.localeCompare(b.color) || talla(a.talla) - talla(b.talla))
    return { conteo: { id: c.id, estado: c.estado, creado_por: c.creado_por, created_at: c.created_at }, producto: prodDe(c.producto_id), variantes: filas, ubicaciones: ['estanteria', 'amarres', 'otro'] }
  }
  const plan = (d) => d.variantes.reduce((a, v) => { const nuevo = v.tocada ? v.total : 0; if (nuevo !== v.erp) a.push({ id: v.id, color: v.color, talla: v.talla, erp: v.erp, nuevo, dif: nuevo - v.erp }); return a }, [])
  ruta('GET', /^\/conteo\/buscar$/, ({ qs }) => {
    const t = (q(qs, 'q') || '').trim().toLowerCase()
    const res = t.length >= 2 ? db.productos.filter(p => p.activo !== false && ((p.nombre || '').toLowerCase().includes(t) || (p.sku_interno || '').toLowerCase().includes(t))).slice(0, 25) : []
    const enCurso = Object.values(conteos).filter(c => c.estado === 'abierto').map(c => resumenProd(prodDe(c.producto_id), c))
    return { resultados: res.map(p => resumenProd(p, abierto(p.id))), en_curso: enCurso }
  })
  ruta('POST', /^\/conteo\/iniciar$/, ({ body }) => {
    const ya = abierto(body.producto_id); if (ya) return { id: ya.id, nuevo: false }
    const c = { id: nuevoId(), producto_id: body.producto_id, estado: 'abierto', creado_por: 'Administrador (demo)', created_at: new Date().toISOString(), lineas: {} }
    conteos[c.id] = c; return { id: c.id, nuevo: true }
  })
  ruta('GET', /^\/conteo\/(?!buscar$|iniciar$)([^/]+)$/, ({ m }) => { const c = conteos[m[1]]; if (!c) throw new Error('Conteo no encontrado'); return cargar(c) })
  ruta('POST', /^\/conteo\/([^/]+)\/sumar$/, ({ m, body }) => {
    const c = conteos[m[1]]; if (!c) throw new Error('Conteo no encontrado')
    const ub = body.ubicacion || 'estanteria', delta = num(body.delta) || 1
    const l = (c.lineas[body.variante_id] = c.lineas[body.variante_id] || {})
    l[ub] = Math.max(0, (l[ub] || 0) + delta)
    return { ok: true, ubicacion: ub, cantidad: l[ub], total: Object.values(l).reduce((s, n) => s + n, 0) }
  })
  ruta('POST', /^\/conteo\/([^/]+)\/aplicar$/, ({ m, body }) => {
    const c = conteos[m[1]]; if (!c) throw new Error('Conteo no encontrado')
    const d = cargar(c), cambios = plan(d)
    const resumen = { sin_contar: 'cero', tallas_cambian: cambios.length, pares_mas: cambios.filter(x => x.dif > 0).reduce((s, x) => s + x.dif, 0),
      pares_menos: -cambios.filter(x => x.dif < 0).reduce((s, x) => s + x.dif, 0), sin_tocar: d.variantes.filter(v => !v.tocada).length }
    if (!body.confirmar) return { hecho: false, resumen, cambios }
    cambios.forEach(x => {
      const r = db.inventario.filter(i => i.variante_id === x.id).sort((a, b) => b.cantidad - a.cantidad)[0]; if (r) r.cantidad = x.nuevo
    })
    d.variantes.filter(v => v.tocada).forEach(v => {
      const r = db.inventario.filter(i => i.variante_id === v.id).sort((a, b) => b.cantidad - a.cantidad)[0]; if (!r) return
      const am = Math.min(v.contado.amarres || 0, r.cantidad)
      r.cant_amarres = am; r.cant_estanteria = r.cantidad - am; r.ubicacion_confirmada = true
    })
    c.estado = 'aplicado'
    return { hecho: true, resumen: { ...resumen, aplicados: cambios.length, ubicaciones_guardadas: d.variantes.filter(v => v.tocada).length, errores: [] } }
  })
  ruta('POST', /^\/conteo\/([^/]+)\/cancelar$/, ({ m }) => { const c = conteos[m[1]]; if (c) c.estado = 'cancelado'; return { ok: true } })

  // ── 3) Guías sacadas por plataforma ─────────────────────────────────────────────────────────────────────────────────
  ruta('GET', /^\/pedidos\/guias-impresas$/, () => {
    const lista = [
      { pedido_id: 'g1', canal: 'tiktok', pares: 2, ref: '5767781234500', hora: iso(0, 9, 12), items: ['Botín Nora Negro T24', 'Tacón Aurora Nude T25'] },
      { pedido_id: 'g2', canal: 'mercadolibre', pares: 1, ref: '2000011122233', hora: iso(0, 9, 40), items: ['Sandalia Luna Nude T23'] },
      { pedido_id: 'g3', canal: 'tiktok', pares: 1, ref: '5767781234512', hora: iso(0, 10, 5), items: ['Flat Brisa Rosa T25'] },
      { pedido_id: 'g4', canal: 'shein', pares: 3, ref: 'GSH2400091', hora: iso(0, 10, 31), items: ['Tacón Aurora Negro T24', 'Tacón Aurora Negro T25', 'Tacón Aurora Negro T26'] },
      { pedido_id: 'g5', canal: 'amazon', pares: 1, ref: '114-2233441-009', hora: iso(0, 11, 2), items: ['Sandalia Luna Camel T24'] },
    ]
    const por = {}; lista.forEach(p => { por[p.canal] = (por[p.canal] || 0) + p.pares })
    return { fecha: new Date().toISOString().slice(0, 10), pedidos: lista, pares_por_canal: por }
  })

  // ── 4) Botón «Cuadrar fotos»: revisa y corrige fotos que no son 1:1 (simulado con tiempos) ───────────────────────────
  let cu = { fase: 'libre', t0: 0 }
  const estadoCu = () => {
    const s = (Date.now() - cu.t0) / 1000
    if (cu.fase === 'escaneando') { const hechas = Math.min(1735, Math.round(s * 700)); if (hechas >= 1735) cu = { ...cu, fase: 'listo' }; else return { fase: 'escaneando', medidas_hechas: hechas, medidas_total: 1735 } }
    if (cu.fase === 'listo') return { fase: 'listo', escaneo: { fotos_revisadas: 1735, sin_medir: 0, no_cuadradas: 12, verticales: 5, horizontales: 7 } }
    if (cu.fase === 'corrigiendo') { const hechas = Math.min(12, Math.floor(s * 3)); if (hechas >= 12) cu = { ...cu, fase: 'terminado' }; else return { fase: 'corrigiendo', hechas, total: 12, errores: [] } }
    if (cu.fase === 'terminado') return { fase: 'terminado', terminado: true, hechas: 12, total: 12, filas_actualizadas: 15, errores: [] }
    return { fase: 'libre' }
  }
  ruta('POST', /^\/imagenes\/cuadrar-existentes$/, ({ qs }) => { cu = { fase: q(qs, 'confirmar') === 'true' ? 'corrigiendo' : 'escaneando', t0: Date.now() }; return { iniciado: true } })
  ruta('GET', /^\/imagenes\/cuadrar-existentes\/estado$/, () => estadoCu())

  // ── 5) Conversaciones: mensajes de días anteriores (separadores de fecha) y una reacción con emoji ──────────────────
  const c0 = db.chats[0]
  if (c0) {
    const ant = [
      { id: nuevoId(), mensaje: 'Buenas tardes, ¿tienen el tacón Aurora en talla 24?', respuesta: 'Hola 💕 Sí, en negro y en nude. ¿Cuál te late?', canal: 'whatsapp', tipo: 'texto', created_at: iso(3, 17, 5) },
      { id: nuevoId(), mensaje: 'Me quedo el negro', respuesta: 'Perfecto, te paso el link de pago.', canal: 'whatsapp', tipo: 'texto', created_at: iso(3, 17, 22) },
    ]
    c0.mensajes = [...ant, ...c0.mensajes, { id: nuevoId(), mensaje: '[Reacción] 👍', respuesta: '', canal: 'whatsapp', tipo: 'texto', created_at: iso(0, 9, 30) }]
  }
}
