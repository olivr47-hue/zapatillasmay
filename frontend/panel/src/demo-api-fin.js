// ═══ DEMO: rutas de Finanzas, Historial, Conversaciones e integraciones (se registran sobre el servidor falso) ═══════
export function registrarRutasExtra({ db, ruta, q, num, mes, cerrado, nuevoId }) {
  const MESES_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  const mesActual = () => new Date().toISOString().slice(0, 7)
  const prodDe = (it) => { const v = db.variantes.find(x => x.id === it.variante_id); return v && db.productos.find(x => x.id === v.producto_id) }
  const costoDe = (it) => { const p = prodDe(it); return p ? p.costo : 0 }
  const corridaDe = (it) => { const p = prodDe(it); return p ? p.precio_corrida : 0 }
  const pedidosMes = (m) => db.pedidos.filter(p => cerrado(p) && mes(p.confirmado_at || p.created_at) === m)

  function reporteMes(m) {
    m = m || mesActual()
    const ped = pedidosMes(m)
    const ventas = ped.reduce((s, p) => s + num(p.total), 0)
    const cmv = ped.reduce((s, p) => s + p.pedido_items.reduce((a, i) => a + costoDe(i) * i.cantidad, 0), 0)
    const cmvC = ped.reduce((s, p) => s + p.pedido_items.reduce((a, i) => a + corridaDe(i) * i.cantidad, 0), 0)
    const gastos = db.gastos.filter(g => mes(g.fecha) === m).reduce((s, g) => s + g.monto, 0)
    const [a, mm] = m.split('-').map(Number)
    const desg = {}
    ped.forEach(p => p.pedido_items.forEach(i => { const d = (desg[i.nombre] = desg[i.nombre] || { nombre: i.nombre, cantidad: 0, subtotal_costo: 0 }); d.cantidad += i.cantidad; d.subtotal_costo += costoDe(i) * i.cantidad }))
    return { mes: m, mes_etiqueta: `${MESES_ES[mm - 1]} ${a}`, total_ventas: ventas, total_ventas_productos: ventas, total_envio_cobrado: 0, total_gastos: gastos, cmv, utilidad_bruta: ventas - cmv, utilidad: ventas - cmv - gastos,
      cmv_corrida: cmvC, tu_utilidad: ventas - cmvC, utilidad_externa: 0, tu_utilidad_externa: 0, externas: { utilidad_real: 0, tu_utilidad: 0 }, num_pedidos: ped.length, ticket_promedio: ped.length ? ventas / ped.length : 0,
      desglose_cmv: Object.values(desg).sort((x, y) => y.subtotal_costo - x.subtotal_costo), num_pedidos_sin_desglose: 0, total_sin_desglose: 0 }
  }

  ruta('GET', /^\/finanzas\/reporte\/([^/]+)$/, ({ qs }) => reporteMes(q(qs, 'mes')))
  ruta('GET', /^\/finanzas\/estado-resultados\/([^/]+)$/, () => {
    const out = []
    for (let k = 0; k < 12; k++) {
      const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - k)
      const id = d.toISOString().slice(0, 7), r = reporteMes(id)
      out.push({ mes: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), mes_id: id, ventas: r.total_ventas, gastos: r.total_gastos, utilidad: r.utilidad, ventas_productos: r.total_ventas, costo_corrida: r.cmv_corrida, tu_utilidad: r.tu_utilidad, utilidad_externa: 0, tu_utilidad_externa: 0, num_pedidos: r.num_pedidos })
    }
    return out
  })
  ruta('GET', /^\/finanzas\/flujo\/([^/]+)$/, ({ qs }) => {
    const hoyS = new Date().toISOString().slice(0, 10), hace7 = Date.now() - 7 * 864e5
    const sem = db.pedidos.filter(p => cerrado(p) && new Date(p.confirmado_at || p.created_at) >= hace7)
    const hoyP = db.pedidos.filter(p => cerrado(p) && (p.confirmado_at || p.created_at).slice(0, 10) === hoyS)
    const suma = (l) => l.reduce((s, p) => s + num(p.total), 0)
    const fp = (f) => suma(hoyP.filter(p => p.forma_pago === f))
    const m = reporteMes(q(qs, 'mes'))
    const gSem = db.gastos.filter(g => new Date(g.fecha) >= hace7).reduce((s, g) => s + g.monto, 0)
    return { hoy: { efectivo: fp('efectivo'), tarjeta: fp('tarjeta'), spei: fp('transferencia'), credito: fp('credito'), total: suma(hoyP) }, semana: { ingresos: suma(sem), gastos: gSem, neto: suma(sem) - gSem }, mes: { ingresos: m.total_ventas, gastos: m.total_gastos, neto: m.total_ventas - m.total_gastos } }
  })
  ruta('GET', /^\/finanzas\/gastos\/([^/]+)$/, () => db.gastos.filter(g => g.fecha === new Date().toISOString().slice(0, 10)))
  ruta('DELETE', /^\/finanzas\/gastos\/([^/]+)$/, ({ m }) => { const i = db.gastos.findIndex(g => g.id === m[1]); if (i >= 0) db.gastos.splice(i, 1); return { ok: true } })
  ruta('GET', /^\/finanzas\/gastos-categorias\/([^/]+)$/, ({ qs }) => { const mm = q(qs, 'mes') || mesActual(); const c = {}; db.gastos.filter(g => mes(g.fecha) === mm).forEach(g => { c[g.categoria] = (c[g.categoria] || 0) + g.monto }); return Object.entries(c).map(([categoria, total]) => ({ categoria, total })).sort((a, b) => b.total - a.total) })
  ruta('GET', /^\/finanzas\/caja\/hoy\/([^/]+)$/, () => db.cajas)
  ruta('GET', /^\/finanzas\/caja\/historial\/([^/]+)$/, () => db.cajasHist)
  ruta('POST', /^\/finanzas\/caja\/abrir$/, ({ body }) => { const c = { id: nuevoId(), sucursal_id: body.sucursal_id, fecha: new Date().toISOString().slice(0, 10), monto_inicial: num(body.monto_inicial), estado: 'abierta', abierta_por: 'Administrador (demo)', created_at: new Date().toISOString() }; db.cajas = [c]; return c })
  ruta('POST', /^\/finanzas\/caja\/([^/]+)\/cerrar$/, () => { db.cajas.forEach(c => { c.estado = 'cerrada' }); return { ok: true } })
  ruta('GET', /^\/finanzas\/cuentas-por-cobrar$/, () => db.pedidos.filter(p => p.forma_pago === 'credito' && cerrado(p)).slice(0, 8).map(p => ({ ...p, saldo: Math.round(num(p.total) * 0.6), monto_credito: Math.round(num(p.total) * 0.6) })))
  const en = (d) => new Date(Date.now() + d * 864e5).toISOString().slice(0, 10)
  const cxpFila = (id, numero, prov, total, saldo, dias, credito, notas) => ({ id, numero, proveedor_nombre: prov, proveedores: { nombre: prov }, total, saldo_pendiente: saldo, dias_credito: credito, notas,
    fecha_orden: en(dias - credito), fecha_vencimiento: en(dias), dias_restantes: dias, vencido: dias < 0, abonos: saldo < total ? [{ id: id + '-a', monto: total - saldo, fecha: en(-3) }] : [] })
  ruta('GET', /^\/finanzas\/cuentas-por-pagar$/, () => [
    cxpFila('cxp-3', 1019, 'Zapatos Montiel', 7200, 7200, -4, 0, 'Nota de remisión 4471'),
    cxpFila('cxp-1', 1024, 'Calzado Los Arcos', 18400, 9200, 6, 15, 'Nota 8802 · botines'),
    cxpFila('cxp-2', 1027, 'Manufacturas Delfín', 26500, 26500, 20, 30, 'Nota 5530 · tacones')])
  ruta('GET', /^\/finanzas\/deudas$/, () => [])
  ruta('GET', /^\/finanzas\/valor-inventario$/, () => {
    let pares = 0, costo = 0, venta = 0; const por = {}
    db.inventario.forEach(i => { const v = db.variantes.find(x => x.id === i.variante_id); const p = v && db.productos.find(x => x.id === v.producto_id); if (!p || !i.cantidad) return
      const s = db.sucursales.find(x => x.id === i.sucursal_id).nombre; const o = (por[s] = por[s] || { sucursal: s, pares: 0, valor_costo: 0, valor_venta: 0 })
      pares += i.cantidad; costo += i.cantidad * p.costo; venta += i.cantidad * p.precio_menudeo; o.pares += i.cantidad; o.valor_costo += i.cantidad * p.costo; o.valor_venta += i.cantidad * p.precio_menudeo })
    return { pares_totales: pares, variantes_con_stock: db.variantes.length, valor_costo: costo, valor_venta_menudeo: venta, por_sucursal: Object.values(por) }
  })
  ruta('GET', /^\/finanzas\/analisis-inventario$/, () => ({}))
  ruta('GET', /^\/finanzas\/sugerencias-recompra\/.+$/, () => [])

  // Historial de movimientos: las ventas de los pedidos
  ruta('GET', /^\/movimientos\/?$/, () => {
    const out = []
    db.pedidos.filter(cerrado).slice(0, 120).forEach(p => p.pedido_items.forEach(i => { const v = db.variantes.find(x => x.id === i.variante_id); const pr = prodDe(i)
      out.push({ id: nuevoId(), tipo: 'venta', cantidad: -i.cantidad, cantidad_anterior: 5, motivo: 'Venta ' + p.canal, usuario: p.empleado, created_at: p.confirmado_at || p.created_at, variante_id: i.variante_id, sucursal_id: 'suc-1',
        variantes: v ? { color: v.color, talla: v.talla, sku: v.sku, productos: { nombre: pr.nombre, sku_interno: pr.sku_interno } } : null, sucursales: { nombre: 'Sucursal Centro' } }) }))
    return out
  })

  // Conversaciones (mensaje = lo que escribe la clienta, respuesta = lo que contesta Maya)
  ruta('GET', /^\/chatbot\/chats\/?$/, () => db.chats.map(c => ({ telefono: c.telefono, nombre: c.nombre, canal: 'whatsapp', mensajes: c.mensajes, ultimo_mensaje: c.ultimo_mensaje, no_leidos: c.no_leidos, ult_entrante: c.ultimo_at, ult_saliente: c.ultimo_at,
    en_control: false, agente: null, etiqueta: c.etapa === 'negociando' ? 'comprador' : 'pregunta', estado: 'abierto', mayorista: c.etiquetas.includes('mayoreo'), archivado: false, pendiente_revision: false })))
  ruta('POST', /^\/chatbot\/pedido-manual-whatsapp$/, ({ body }) => {
    const sub = (body.items || []).reduce((t, i) => t + num(i.precio_unitario) * (i.cantidad || 1), 0), pares = (body.items || []).reduce((t, i) => t + (i.cantidad || 1), 0)
    const envio = sub >= 1299 ? 0 : (pares >= 3 ? 199 : pares >= 2 ? 150 : 99)
    return { ok: true, pedido_id: nuevoId(), total: sub + envio, envio }
  })
  ruta('POST', /^\/chatbot\/link-pago-manual$/, ({ body }) => {
    const sub = (body.items || []).reduce((t, i) => t + num(i.precio_unitario) * (i.cantidad || 1), 0), pares = (body.items || []).reduce((t, i) => t + (i.cantidad || 1), 0)
    const envio = sub >= 1299 ? 0 : (pares >= 3 ? 199 : pares >= 2 ? 150 : 99)
    return { ok: true, link: 'https://www.mercadopago.com.mx/checkout/v1/redirect?pref_id=DEMO-123456', total: sub + envio }
  })
  ruta('GET', /^\/chatbot\/respuestas-rapidas$/, () => [
    { id: 'rr1', titulo: 'Bienvenida', mensaje: 'Hola! Gracias por contactarnos 👠 ¿En qué te puedo ayudar?', orden: 1 },
    { id: 'rr2', titulo: 'Pago: BBVA', mensaje: '💳 *BBVA*\nTitular: Nombre de Ejemplo\nNúmero de cuenta: 0000000000', orden: 6 },
    { id: 'rr3', titulo: 'Pago: SPEI', mensaje: '💳 *Transferencia SPEI*\nCLABE: 000000000000000000\nTitular: Nombre de Ejemplo\nBanco: Banco Ejemplo', orden: 7 },
  ])
  ruta('GET', /^\/catalogos\/?$/, () => [{ id: 'cat-1', nombre: 'TACONES', temporada: 'PV26', activo: true, portada_url: '' }, { id: 'cat-2', nombre: 'Sandalias', temporada: 'PV26', activo: true, portada_url: '' }, { id: 'cat-3', nombre: 'FLATS', temporada: 'PV26', activo: true, portada_url: '' }])
  ruta('POST', /^\/imagenes\/upload-temp$/, () => ({ url: 'https://demo.invalid/catalogo-demo.pdf' }))
  ruta('GET', /^\/chatbot\/(tareas-hoy|plantillas)$/, () => ({ tareas: [], total: 0 }))
  ruta('GET', /^\/marketplace\/admin\/resumen$/, () => ({ vendedores_pendientes: 2, productos_pendientes: 3, pedidos_por_recibir: 1, por_liquidar: 1840 }))
  ruta('GET', /^\/(ml|shein|walmart|amazon)\/ping$/, () => ({ ok: true, conectado: true, demo: true }))
  ruta('GET', /^\/redes\/estado$/, () => ({ conectado: true, pagina: 'Mi Tienda', instagram_usuario: 'mitienda', facebook: true, instagram: true, pinterest: { conectado: true, tableros: [{ id: 'b1', nombre: 'Tacones' }, { id: 'b2', nombre: 'Novedades' }], problema: '', tablero_predeterminado: '' } }))
  ruta('GET', /^\/config\/envio$/, () => ({ umbral_envio_gratis: 1299, costo_envio: 150 }))
}
