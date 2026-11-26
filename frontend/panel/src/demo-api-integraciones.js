// ═══ DEMO: Mercado Libre, SHEIN, Amazon, TikTok Shop y Temu con datos inventados ════════════════════════════════════════
// Nada sale del navegador. Los pedidos de Mercado Libre y TikTok salen de los pedidos de la demo (canal mercadolibre / tiktok).
export function registrarRutasIntegraciones({ db, ruta, num, q }) {
  const hoyMs = Date.now()
  const ep = (dias, h = 12) => Math.floor((hoyMs - dias * 864e5) / 1000) - h * 60   // epoch en segundos
  const iso = (dias, h = 12) => new Date(hoyMs - dias * 864e5 - h * 36e5).toISOString()
  const prods = () => db.productos.filter(p => p.activo !== false)
  const varsDe = (p) => db.variantes.filter(v => v.producto_id === p.id && v.activa !== false)
  const tituloTK = (p) => `${p.nombre} para dama · ${p.categoria === 'tacones' ? 'tacón' : p.categoria} cómodo`
  const stockDe = (v) => db.inventario.filter(i => i.variante_id === v.id).reduce((s, i) => s + num(i.cantidad), 0)

  // ═══════════════════════════ TIKTOK SHOP ═══════════════════════════
  const tkProds = () => prods().map((p, i) => {
    const vs = varsDe(p)
    return { id: '17294' + String(80000 + i * 137), titulo: tituloTK(p), sku_ejemplo: vs[0] ? vs[0].sku : p.sku_interno, estado: i === 3 ? 'DRAFT' : i === 7 ? 'SELLER_DEACTIVATED' : 'ACTIVATE',
      skus: vs.length, stock: vs.reduce((s, v) => s + stockDe(v), 0), precio_min: num(p.precio_menudeo) + 80, precio_max: num(p.precio_menudeo) + 80, actualizado: ep(i + 1), _p: p }
  })
  ruta('GET', /^\/tiktok\/resumen$/, () => {
    const L = tkProds(), est = {}
    L.forEach(x => { est[x.estado] = (est[x.estado] || 0) + 1 })
    return { tienda: { nombre: 'Zapatillas May (demo)', region: 'MX', tipo: 'LOCAL' }, permisos: 14, token_vence: ep(-28), sync_existencias_activa: true,
      productos: { total: L.length, por_estado: est, skus: L.reduce((s, x) => s + x.skus, 0), skus_sin_sku_vendedor: 0 },
      pedidos_30d: { n: 41, total: 24380, hay_mas: false, por_estado: { COMPLETED: 24, AWAITING_SHIPMENT: 6, IN_TRANSIT: 8, CANCELLED: 3 } } }
  })
  ruta('GET', /^\/tiktok\/productos$/, ({ qs }) => {
    const t = (q(qs, 'q') || '').toLowerCase(), e = q(qs, 'estado') || ''
    const L = tkProds().filter(x => (!e || x.estado === e) && (!t || (x.titulo + x.sku_ejemplo).toLowerCase().includes(t)))
    const pag = Number(q(qs, 'pagina') || 1), por = Number(q(qs, 'por_pagina') || 50)
    return { productos: L.slice((pag - 1) * por, pag * por).map(({ _p, ...r }) => r), total: L.length, por_pagina: por }
  })
  ruta('GET', /^\/tiktok\/producto\/([^/]+)$/, ({ m }) => {
    const x = tkProds().find(r => r.id === m[1]); if (!x) throw new Error('Producto no encontrado')
    const p = x._p, vs = varsDe(p), fotosErp = {}
    vs.forEach(v => { if (!fotosErp[v.color]) fotosErp[v.color] = (v.imagenes && v.imagenes.length ? v.imagenes : [v.foto_url]).filter(Boolean) })
    return { id: x.id, titulo: x.titulo, estado: x.estado, fotos: (p.imagenes || []).slice(0, 3), categoria: ['Calzado', 'Zapatos de mujer', p.categoria === 'tacones' ? 'Tacones' : 'Calzado casual'],
      erp: { sku_interno: p.sku_interno, total_fotos: Object.values(fotosErp).reduce((s, l) => s + l.length, 0), fotos_por_color: fotosErp },
      skus: vs.map(v => ({ seller_sku: v.sku, atributos: [['Color', v.color], ['Talla', v.talla]], precio: x.precio_min, existencias: stockDe(v), stock: stockDe(v) })) }
  })
  const PED_TK = () => db.pedidos.filter(p => p.canal === 'tiktok').slice(0, 25)
  ruta('GET', /^\/tiktok\/pedidos$/, () => {
    const mapa = { confirmado: 'AWAITING_SHIPMENT', pagado: 'AWAITING_SHIPMENT', enviado: 'IN_TRANSIT', entregado: 'COMPLETED', cancelado: 'CANCELLED' }
    const L = PED_TK().map((p, i) => ({ id: '5767' + String(7812345000 + i * 9137), estado: mapa[p.status] || 'COMPLETED',
      articulos: p.pedido_items.map(it => { const v = db.variantes.find(x => x.id === it.variante_id); return { sku: v ? v.sku : it.nombre, variante: `${it.color || ''} · T${it.talla || ''}` } }),
      total: num(p.total), paqueteria: i % 3 === 0 ? 'J&T Express' : i % 3 === 1 ? 'Estafeta' : 'iMile', guia: ['IN_TRANSIT', 'COMPLETED'].includes(mapa[p.status]) ? 'JMX60112' + String(4011215 + i) : '', creado: Math.floor(new Date(p.created_at).getTime() / 1000) }))
    return { pedidos: L, total_en_pagina: L.length, hay_mas: false }
  })
  ruta('GET', /^\/tiktok\/devoluciones$/, () => ({ devoluciones: [
    { pedido: '576778123450091', estado: 'RETURN_OR_REFUND_REQUEST_COMPLETE', tipo: 'RETURN_AND_REFUND', motivo: 'No me quedó (talla)', monto: 489, creado: ep(6) },
    { pedido: '576778123450312', estado: 'RETURN_OR_REFUND_REQUEST_PENDING', tipo: 'RETURN_AND_REFUND', motivo: 'Color distinto al de la foto', monto: 559, creado: ep(2) },
    { pedido: '576778123450777', estado: 'RETURN_OR_REFUND_REQUEST_CANCEL', tipo: 'REFUND', motivo: 'Llegó tarde', monto: 429, creado: ep(14) }] }))
  ruta('GET', /^\/tiktok\/finanzas$/, () => ({ liquidaciones: [
    { fecha: ep(2), estado: 'PAID', ingresos: 6420, comisiones: -1390, ajustes: -120, neto: 4910 }, { fecha: ep(9), estado: 'PAID', ingresos: 7180, comisiones: -1545, ajustes: 0, neto: 5635 },
    { fecha: ep(16), estado: 'PAID', ingresos: 5890, comisiones: -1270, ajustes: -85, neto: 4535 }, { fecha: ep(23), estado: 'PAID', ingresos: 8040, comisiones: -1730, ajustes: 0, neto: 6310 },
    { fecha: ep(0), estado: 'PROCESSING', ingresos: 2310, comisiones: -498, ajustes: 0, neto: 1812 }] }))
  let auto = { existencias: true, ventas_desde: ep(40) }
  ruta('GET', /^\/tiktok\/automatico$/, () => auto)
  ruta('POST', /^\/tiktok\/automatico/, ({ qs }) => { const k = q(qs, 'cual') || 'ventas', on = (q(qs, 'estado') || '') !== 'off'; if (k === 'existencias') auto.existencias = on; else auto.ventas_desde = on ? ep(0) : null; return auto })
  ruta('GET', /^\/tiktok\/existencias\/plan$/, () => {
    const vs = db.variantes.slice(0, 6)
    return { revisados: 1130, iguales: 1104, cambios: 26, productos_afectados: 6, bajarian: 17, subirian: 9, de_relleno_9000_o_mas: 0, sin_match: 0, sin_sku: 0, varias_bodegas: 0,
      ejemplos: vs.map((v, i) => ({ sku: v.sku, titulo: `${(db.productos.find(p => p.id === v.producto_id) || {}).nombre || ''} ${v.color} T${v.talla}`, de: 5 + i, a: 2 + i % 3 })) }
  })
  ruta('GET', /^\/tiktok\/nuevos\/lista$/, () => ({ total: 3, listos: 2, con_pendientes: 1, modelos: [
    { sku_interno: 'L-NUEVO-0201', nombre: 'Tacón Monarca para dama', categoria_tiktok: 'Calzado › Tacones', colores: 3, skus: 18, fotos: 8, stock: 54, precio_tiktok: 659, listo: true, problemas: [], estaba_eliminado: false },
    { sku_interno: 'L-NUEVO-0202', nombre: 'Sandalia Marea para dama', categoria_tiktok: 'Calzado › Sandalias', colores: 2, skus: 12, fotos: 6, stock: 31, precio_tiktok: 519, listo: true, problemas: [], estaba_eliminado: false },
    { sku_interno: 'L-NUEVO-0203', nombre: 'Bota Cascada para dama', categoria_tiktok: 'Calzado › Botas', colores: 2, skus: 12, fotos: 1, stock: 20, precio_tiktok: 889, listo: false, problemas: ['solo 1 foto'], estaba_eliminado: false }] }))
  ruta('GET', /^\/tiktok\/fotos-pendientes$/, () => ({ activos_revisados: 14, con_una_sola_foto: 0, ya_actualizados: 14, pendientes: 0, productos: [], sin_modelo_erp: 0 }))
  ruta('GET', /^\/tiktok\/fotos\/progreso$/, () => ({ en_curso: false }))
  ruta('GET', /^\/tiktok\/variantes-faltantes$/, () => ({ activos_revisados: 14, con_variantes_faltantes: 0, productos: [], variantes_en_total: 0, sin_modelo_erp: 0 }))

  // ═══════════════════════════ MERCADO LIBRE ═══════════════════════════
  const mlItems = () => {
    const out = []
    prods().forEach((p, i) => {
      varsDe(p).filter(v => v.talla === '24' || v.talla === '25').slice(0, 4).forEach((v, k) => {
        out.push({ item_id: 'MLM' + String(3850000000 + i * 1000 + k * 7), title: `${p.nombre} ${v.color} ${v.talla} Mx`, status: (i + k) % 9 === 0 ? 'paused' : 'active', seller_sku: v.sku, qty: Math.max(0, stockDe(v)) })
      })
    })
    return out
  }
  ruta('GET', /^\/ml\/items$/, () => { const items = mlItems(); return { items, total: items.length, sin_sku: 0 } })
  ruta('GET', /^\/ml\/stock$/, () => ({ total_items: mlItems().length, desactualizados: 0, sin_sku: 0, diferencias: [] }))
  ruta('GET', /^\/ml\/sync\/log$/, () => ({ log: ['Sincronización de existencias: 128 publicaciones revisadas, 3 actualizadas.', 'Sincronización de ventas: 2 ventas nuevas.'] }))
  ruta('GET', /^\/ml\/preguntas$/, () => ({ preguntas: [
    { id: 90011, item_id: 'MLM3850001007', item_titulo: 'Tacón Aurora Nude 24 Mx', item_imagen: (db.productos[0] || {}).imagen_principal, texto: '¿Viene en talla 26? ¿Es cómodo para estar de pie varias horas?', fecha: iso(0, 2) },
    { id: 90012, item_id: 'MLM3850002014', item_titulo: 'Sandalia Brisa Negro 25 Mx', item_imagen: (db.productos[5] || {}).imagen_principal, texto: '¿Hacen envíos a Mérida y cuánto tarda?', fecha: iso(0, 6) }] }))
  ruta('GET', /^\/ml\/mensajes$/, () => ({ ok: true, revisadas: 30, mensajes: [
    { comprador: 'MARIA2931', no_leidos: 1, ultimo_mensaje: 'Buenas tardes, ya me llegó pero la talla me queda chica, ¿puedo cambiarla?', order_id: '2000011122233', fecha: iso(0, 4), link: '#' }] }))
  ruta('GET', /^\/ml\/reputacion$/, () => ({ ok: true, nickname: 'ZAPATILLASMAY', nivel: '5_green', power_seller: 'platinum', ventas_completadas: 1286,
    reclamos: { tasa: 0.008, total: 10 }, cancelaciones: { tasa: 0.012, total: 15 }, entregas_tarde: { tasa: 0.034, total: 44 },
    transacciones: { total: 1286, ratings: { positive: 0.96, neutral: 0.03, negative: 0.01 } } }))
  ruta('GET', /^\/ml\/rendimiento$/, () => {
    const modelos = prods().map((p, i) => ({ nombre: p.nombre, modelo: p.sku_interno, activos: 6, pausados: i % 4 === 0 ? 2 : 0, pausados_con_stock: i % 4 === 0 ? 2 : 0,
      stock_erp: varsDe(p).reduce((s, v) => s + stockDe(v), 0), ventas_30d: Math.max(0, 9 - i), visitas_30d: 380 - i * 17,
      calidad: { nivel: i % 5 === 0 ? 'medium' : 'high', puntaje: 100 - (i % 5) * 9 - (i % 3), mejoras: i % 5 === 0 ? [{ titulo: 'Agrega el tipo de tacón a la ficha técnica', enlace: '' }, { titulo: 'Sube una foto más de 1000 px', enlace: '' }] : [] } }))
    return { datos: { generado: new Date().toISOString(), kpis: { visitas_30d: 5230, pares_30d: 64, pedidos_30d: 58, conversion: 1.22, activos: 112, modelos: modelos.length, pausados: 8, pausados_con_stock: 6, activos_sin_stock: 0 }, modelos }, progreso: 0, total: 0 }
  })
  const sinPublicar = () => ({ total: 2, listos: 2, productos: [
    { id: 'np-1', sku_interno: 'L-NUEVO-0201', nombre: 'Tacón Monarca', num_colores: 3, num_fotos: 8, listo: true, precio_sugerido: 679 },
    { id: 'np-2', sku_interno: 'L-NUEVO-0202', nombre: 'Sandalia Marea', num_colores: 2, num_fotos: 6, listo: true, precio_sugerido: 539 }] })
  ruta('GET', /^\/ml\/catalogo-sin-publicar$/, () => sinPublicar())

  // ═══════════════════════════ SHEIN ═══════════════════════════
  const sheinVentas = () => Array.from({ length: 12 }, (_, i) => {
    const p = prods()[i % prods().length], st = ['enviado', 'entregado', 'entregado', 'confirmado', 'pagado', 'cancelado'][i % 6]
    return { id: 'sh-' + i, shein_order_id: 'GSH24' + String(100091 + i * 53), total: num(p.precio_menudeo) * (1 + (i % 2)), status: st, canal: 'shein', created_at: iso(i * 2 + 1, 5), nombre_cliente: 'Cliente SHEIN' }
  })
  ruta('GET', /^\/shein\/ping$/, () => ({ ok: true, respuesta: { info: { list: [{ warehouseName: 'Bodega León (demo)', warehouseCode: 'MXW001' }] } } }))
  ruta('GET', /^\/shein\/ventas$/, () => sheinVentas())
  ruta('GET', /^\/shein\/ordenes\/estado$/, ({ qs }) => ({ encontrada: true, detalle: { orderNo: q(qs, 'orden'), estado: 'En camino al cliente', paqueteria: 'J&T Express', actualizado: iso(0, 3) } }))
  ruta('GET', /^\/shein\/publicaciones$/, () => {
    const grupos = []
    prods().forEach((p, i) => {
      const colores = [...new Set(varsDe(p).map(v => v.color))].slice(0, 2)
      colores.forEach((c, k) => grupos.push({ nombre_erp: `${p.nombre} ${c}`, sku_interno: p.sku_interno, skcName: 'sk24' + String(1100 + i * 10 + k), spuName: 'sp24' + String(500 + i),
        skus: varsDe(p).filter(v => v.color === c).map(v => ({ talla: v.talla, supplierSku: v.sku })), sin_match: false }))
    })
    return { grupos, total_skus: grupos.reduce((s, g) => s + g.skus.length, 0), escaneando: false }
  })
  ruta('GET', /^\/shein\/catalogo-sin-publicar$/, () => sinPublicar())
  ruta('GET', /^\/shein\/sync\/log$/, () => ({ log: ['Existencias: 96 SKUs revisados, 4 actualizados.', 'Ventas: 1 venta nueva.'] }))

  // ═══════════════════════════ AMAZON ═══════════════════════════
  ruta('GET', /^\/amazon\/ping$/, () => ({ ok: true, token_ok: true, sandbox: false, tiene_client_id: true, tiene_client_secret: true, tiene_refresh_token: true, tiene_seller_id: true }))
  ruta('GET', /^\/amazon\/ventas$/, () => db.pedidos.filter(p => p.canal === 'amazon').slice(0, 8).map((p, i) => ({ amazon_order_id: `114-22334${40 + i}-0090${i}`, total: num(p.total), status: p.status, created_at: p.created_at, nombre_cliente: p.nombre_cliente })))
  ruta('GET', /^\/amazon\/ordenes$/, () => ({ ordenes: [
    { id: '114-2233441-00905', estatus: 'Unshipped', fecha: iso(0, 5), canal_cumplimiento: 'MFN', articulos_sin_enviar: 1, total: 589 },
    { id: '114-2233442-00906', estatus: 'Shipped', fecha: iso(2, 3), canal_cumplimiento: 'MFN', articulos_sin_enviar: 0, total: 429 },
    { id: '114-2233443-00907', estatus: 'Shipped', fecha: iso(4, 6), canal_cumplimiento: 'AFN', articulos_sin_enviar: 0, total: 659 }] }))
  ruta('GET', /^\/amazon\/preparacion$/, () => ({ pasos: [
    { paso: 'Conexión con Amazon', ok: true, detalle: 'Autorizada' }, { paso: 'Productos con código de barras (EAN)', ok: true, detalle: 'Todos' }, { paso: 'Fotos de 1000 px o más', ok: true, detalle: '17 de 17 modelos' },
    { paso: 'Categoría y atributos', ok: true, detalle: 'Zapatos de mujer' }], faltan: {} }))

  // ═══════════════════════════ TEMU ═══════════════════════════
  const tmProds = () => prods().map((p, i) => ({ id: 'tm-' + (601000 + i * 17), titulo: `${p.nombre} para dama`, estado: i === 4 ? 'En revisión' : i === 9 ? 'Pausado' : 'Activo', sku: p.sku_interno,
    precio: Math.round(num(p.precio_menudeo) * 0.9), skus: varsDe(p).length, stock: varsDe(p).reduce((s, v) => s + stockDe(v), 0), vistas: 420 - i * 19, imagen: p.imagen_principal }))
  ruta('GET', /^\/temu\/resumen$/, () => ({ conectado: true, tienda: 'Zapatillas May (demo)', region: 'México', productos: { total: prods().length, activos: prods().length - 2, revision: 1, pausados: 1 }, pedidos_30d: { n: 18, total: 9640 }, ventas_hoy: 3, token_vence: ep(-60) }))
  ruta('GET', /^\/temu\/productos$/, () => ({ productos: tmProds() }))
  ruta('GET', /^\/temu\/pedidos$/, () => ({ pedidos: Array.from({ length: 10 }, (_, i) => {
    const p = prods()[(i * 3) % prods().length], v = varsDe(p)[i % 6] || {}
    return { id: 'PO-211-2190' + String(5473070 + i * 311), estado: ['Por enviar', 'Enviado', 'Entregado', 'Entregado', 'Por enviar'][i % 5], articulo: `${p.nombre} · ${v.color || ''} T${v.talla || ''}`, total: Math.round(num(p.precio_menudeo) * 0.9), paqueteria: i % 2 ? 'J&T Express' : 'Estafeta', guia: i % 5 === 0 || i % 5 === 4 ? '' : 'JMX60112' + String(4011215 + i), creado: iso(i, 4) }
  }) }))
}
