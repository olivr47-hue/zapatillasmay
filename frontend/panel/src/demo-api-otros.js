// ═══ DEMO: Analítica, Envíos, SEO, Referidos y Carritos abandonados con datos inventados ═══════════════════════════════
export function registrarRutasOtros({ db, ruta }) {
  const dia = (k) => { const d = new Date(Date.now() - k * 864e5); return d.toISOString().slice(0, 10) }
  const pico = (h) => Math.round(30 + 40 * Math.exp(-Math.pow((h - 20) / 4, 2)) + 15 * Math.exp(-Math.pow((h - 13) / 3, 2)))

  ruta('GET', /^\/analytics\/tiempo-real$/, () => ({ activos_ahora: 7, en_sitio: 5, en_portal: 2, por_dispositivo: { mobile: 6, desktop: 1 }, por_pais: [{ pais: 'México', activos: 7 }], paginas: [{ pagina: '/', activos: 3 }, { pagina: '/tacones', activos: 2 }, { pagina: '/producto/tacon-aurora', activos: 2 }] }))
  ruta('GET', /^\/analytics\/resumen$/, () => ({
    actual: { sessions: 4820, activeUsers: 3510, newUsers: 2870, transactions: 96, purchaseRevenue: 61200, conversion: 0.0199, ticket: 637, ingreso_por_sesion: 12.7, engagementRate: 0.61, averageSessionDuration: 112 },
    cambio_pct: { sessions: 12, activeUsers: 9, transactions: 18, purchaseRevenue: 21, conversion: 5, ticket: 3, ingreso_por_sesion: 8, engagementRate: 2 } }))
  ruta('GET', /^\/analytics\/serie$/, () => ({ serie: Array.from({ length: 90 }, (_, i) => { const k = 89 - i; const s = 120 + Math.round(60 * Math.sin(i / 6)) + (i % 7 === 5 ? 40 : 0) + i; return { fecha: dia(k), sesiones: s, usuarios: Math.round(s * 0.72), compras: Math.round(s / 55), ingreso: Math.round(s / 55) * 640 } }) }))
  ruta('GET', /^\/analytics\/horario$/, () => ({ horas: Array.from({ length: 24 }, (_, h) => ({ hora: String(h).padStart(2, '0') + ':00', sesiones: pico(h) })) }))
  ruta('GET', /^\/analytics\/ciudades$/, () => ({ ciudades: [['León', 'Guanajuato', 920], ['Ciudad de México', 'CDMX', 640], ['Guadalajara', 'Jalisco', 410], ['Querétaro', 'Querétaro', 260], ['Monterrey', 'Nuevo León', 190]].map(([ciudad, region, sesiones]) => ({ ciudad, region, sesiones })) }))
  ruta('GET', /^\/analytics\/ia-referrals$/, () => ({ total_sesiones: 0, referencias: [], por_dia: [] }))
  ruta('GET', /^\/analytics\/portal-visitas$/, () => ({ total_sesiones: 214, dias: Array.from({ length: 30 }, (_, i) => ({ fecha: dia(29 - i).replace(/-/g, ''), sesiones: 4 + (i * 7) % 11 })) }))

  // Carritos con pares sin existencia (ejemplo: toma el primer carrito apartado o en borrador)
  ruta('GET', /^\/pedidos\/carritos-sin-existencia$/, () => {
    const p = (db.pedidos || []).find(x => x.status === 'apartado' || x.status === 'borrador'); if (!p) return []
    const cl = (db.clientes || []).find(c => c.id === p.cliente_id)
    return [{ id: p.id, estado: p.status, cliente: (cl && cl.nombre) || 'Clienta de ejemplo', faltan: [{ nombre: 'Tacón Aurora', color: 'Negro', talla: '25', pide: 2, hay: 1 }] }]
  })

  // Anticipos y comprobantes de pago (la demo no sube archivos de verdad: genera una captura de ejemplo)
  const CAPT = (txt) => 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" fill="#e0f2fe"/><text x="60" y="55" font-size="13" text-anchor="middle" fill="#075985">Captura</text><text x="60" y="75" font-size="11" text-anchor="middle" fill="#075985">${txt}</text></svg>`)
  const PAGOS = {}, COMPS = {}
  const abiertos = (db.pedidos || []).filter(x => x.status === 'apartado' || x.status === 'borrador')
  if (abiertos[0]) { abiertos[0].anticipo = 500; PAGOS[abiertos[0].id] = [{ id: 'pg1', monto: 500, forma_pago: 'transferencia', tipo: 'anticipo', usuario: 'Demo', created_at: new Date().toISOString() }]; COMPS[abiertos[0].id] = [{ id: 'cp1', pago_id: 'pg1', url: CAPT('$500'), tipo: 'imagen', origen: 'panel', revisado: true, created_at: new Date().toISOString() }] }
  if (abiertos[1]) { COMPS[abiertos[1].id] = [{ id: 'cp2', pago_id: null, url: CAPT('Clienta'), tipo: 'imagen', monto: 800, nota: 'anticipo', origen: 'portal', revisado: false, created_at: new Date().toISOString() }] }
  ruta('GET', /^\/pedidos\/comprobantes-pendientes$/, () => { const o = {}; Object.entries(COMPS).forEach(([id, l]) => { const n = l.filter(c => c.revisado === false).length; if (n) o[id] = n }); return o })
  ruta('GET', /^\/pedidos\/([^/]+)\/anticipos$/, ({ m }) => { const l = PAGOS[m[1]] || []; return { pagos: l, total: l.reduce((s, x) => s + x.monto, 0) } })
  ruta('POST', /^\/pedidos\/([^/]+)\/anticipos$/, ({ m, body }) => { const p = db.pedidos.find(x => x.id === m[1]); const monto = parseFloat(body && body.monto) || 0; const pg = { id: 'pg' + Date.now(), monto, forma_pago: (body && body.forma_pago) || 'efectivo', tipo: 'anticipo', usuario: 'Demo', created_at: new Date().toISOString() }; (PAGOS[m[1]] = PAGOS[m[1]] || []).push(pg); if (p) p.anticipo = (parseFloat(p.anticipo) || 0) + monto; return { ok: true, pago_id: pg.id } })
  ruta('DELETE', /^\/pedidos\/([^/]+)\/anticipos\/([^/]+)$/, ({ m }) => { const l = PAGOS[m[1]] || []; const i = l.findIndex(x => x.id === m[2]); if (i >= 0) { const p = db.pedidos.find(x => x.id === m[1]); if (p) p.anticipo = Math.max(0, (p.anticipo || 0) - l[i].monto); l.splice(i, 1) } return { ok: true } })
  ruta('GET', /^\/pedidos\/([^/]+)\/comprobantes$/, ({ m }) => ({ comprobantes: COMPS[m[1]] || [] }))
  ruta('POST', /^\/pedidos\/([^/]+)\/comprobantes$/, ({ m }) => { const c = { id: 'cp' + Date.now(), pago_id: null, url: CAPT('Nuevo'), tipo: 'imagen', origen: 'panel', revisado: true, created_at: new Date().toISOString() }; (COMPS[m[1]] = COMPS[m[1]] || []).push(c); return { ok: true, comprobante: c } })
  ruta('PATCH', /^\/pedidos\/([^/]+)\/comprobantes\/([^/]+)$/, ({ m, body }) => { const c = (COMPS[m[1]] || []).find(x => x.id === m[2]); if (c) Object.assign(c, body); return { ok: true } })
  ruta('DELETE', /^\/pedidos\/([^/]+)\/comprobantes\/([^/]+)$/, ({ m }) => { const l = COMPS[m[1]] || []; const i = l.findIndex(x => x.id === m[2]); if (i >= 0) l.splice(i, 1); return { ok: true } })

  const haceMin = (m) => new Date(Date.now() - m * 60000).toISOString()
  ruta('GET', /^\/push\/panel-recientes$/, () => [
    { id: 'a1', titulo: '💬 Carolina Méndez', cuerpo: 'Hola, ¿tienen el tacón Aurora en talla 25?', url: '/?modulo=conversaciones', created_at: haceMin(3) },
    { id: 'a2', titulo: '📎 Comprobante de pago nuevo', cuerpo: 'Fernanda Ruiz subió un comprobante de $800. Revisa Carritos.', url: '/?modulo=carritos', created_at: haceMin(42) },
    { id: 'a3', titulo: '⚠️ SHEIN no está conectado', cuerpo: 'No se pudo comunicar con SHEIN. Revisa Conexiones.', url: '/?modulo=conexiones', created_at: haceMin(300) },
  ])

  // Tareas del equipo (ejemplos inventados)
  const hoyD = dia(0), manD = dia(-1)
  const TAREAS = [
    { id: 't1', titulo: 'Dar seguimiento al pedido de Carolina Méndez', descripcion: '1) Revisar en Pedidos si ya pagó.\n2) Si pagó, capturar la guía y mandarle el número por WhatsApp.\n3) Si no ha pagado el viernes, mandarle el recordatorio de pago.', prioridad: 'alta', asignada_a: 'Vero', fecha_vence: dia(1), pasos: [{ t: 'Revisar pago', ok: true }, { t: 'Capturar guía', ok: false }, { t: 'Avisar por WhatsApp', ok: false }], vinculo_tipo: 'cliente', vinculo_id: 'demo', vinculo_texto: 'Carolina Méndez', completada: false, agente: 'Administrador', created_at: dia(2) },
    { id: 't2', titulo: 'Resurtir tacón Aurora negro en tallas 25 y 26', descripcion: 'Pedirlo al proveedor antes del miércoles y avisar a la dueña cuándo llega.', prioridad: 'normal', asignada_a: 'Vero', fecha_vence: hoyD, pasos: [], vinculo_tipo: 'producto', vinculo_id: 'demo', vinculo_texto: 'Tacón Aurora', completada: false, agente: 'Administrador', created_at: dia(1) },
    { id: 't3', titulo: 'Contestar mensajes de mayoreo pendientes', descripcion: null, prioridad: 'baja', asignada_a: null, fecha_vence: null, pasos: [], completada: false, agente: 'Administrador', created_at: dia(0) },
  ]
  ruta('GET', /^\/chatbot\/tareas-equipo(\?.*)?$/, () => TAREAS.map(t => ({ ...t })))
  ruta('POST', /^\/chatbot\/tareas$/, ({ body }) => { const t = { id: 't' + Date.now(), completada: false, created_at: dia(0), pasos: [], ...body }; TAREAS.unshift(t); return t })
  ruta('PATCH', /^\/chatbot\/tareas\/([^/]+)$/, ({ m, body }) => { const t = TAREAS.find(x => x.id === m[1]); if (t) { Object.assign(t, body); if (body && 'completada' in body) t.completada_por = body.completada ? body.agente : null } return { ok: true } })
  ruta('DELETE', /^\/chatbot\/tareas\/([^/]+)$/, ({ m }) => { const i = TAREAS.findIndex(x => x.id === m[1]); if (i >= 0) TAREAS.splice(i, 1); return { ok: true } })
  ruta('GET', /^\/chatbot\/tareas-buscar(\?.*)?$/, () => [{ id: 'demo', texto: 'Carolina Méndez · 524771100000', telefono: '524771100000' }])

  // Conexiones (datos de ejemplo: ninguna clave real)
  const G = (id, nombre, icono, descripcion, probar, campos) => ({ id, nombre, icono, descripcion, probar, campos: campos.map(([clave, etiqueta, secreto, conf]) => ({ clave, etiqueta, secreto, ayuda: '', configurado: conf, origen: conf ? 'servidor' : 'vacio', vista: conf ? (secreto ? '••••a1b2' : 'EJEMPLO-123') : '' })) })
  const CON = [
    G('mercadopago', 'MercadoPago', '💳', 'Cobros de la tienda en línea y del portal de mayoristas.', null, [['MP_ACCESS_TOKEN', 'Access Token (producción)', true, true], ['MP_PUBLIC_KEY', 'Public Key (producción)', false, true], ['MP_WEBHOOK_SECRET', 'Clave secreta del webhook', true, true]]),
    G('whatsapp', 'WhatsApp Business (Meta)', '💬', 'Mensajes, asistente y avisos de pedidos.', null, [['WHATSAPP_TOKEN', 'Token de acceso', true, true], ['WHATSAPP_PHONE_ID', 'ID del número de teléfono', false, true], ['WHATSAPP_WABA_ID', 'ID de la cuenta (WABA)', false, true]]),
    G('mercadolibre', 'MercadoLibre', '🛒', 'Publicaciones, ventas, preguntas y mensajes.', '/ml/ping', [['ML_APP_ID', 'App ID', false, true], ['ML_CLIENT_SECRET', 'Clave secreta', true, true], ['ML_REFRESH_TOKEN', 'Refresh token', true, true]]),
    G('amazon', 'Amazon México', '📦', 'Publicaciones, existencias y pedidos.', '/amazon/ping', [['AMAZON_LWA_CLIENT_ID', 'LWA Client ID', false, true], ['AMAZON_LWA_CLIENT_SECRET', 'LWA Client Secret', true, false], ['AMAZON_SELLER_ID', 'Seller ID', false, false]]),
    G('walmart', 'Walmart Marketplace', '🏬', 'Catálogo, inventario y órdenes.', '/walmart/ping', [['WALMART_CLIENT_ID', 'Client ID', false, true], ['WALMART_CLIENT_SECRET', 'Client Secret', true, true]]),
    G('shein', 'SHEIN', '🛍️', 'Publicaciones, inventario y ventas.', '/shein/ping', [['SHEIN_APP_ID', 'App ID', false, true], ['SHEIN_APP_SECRET', 'App Secret', true, true]]),
    G('correo', 'Correo', '📧', 'Envío de correos a clientas.', null, [['RESEND_API_KEY', 'Resend: API key', true, true], ['NOTIF_EMAIL', 'Correo del negocio', false, true]]),
  ].map(g => ({ ...g, configurados: g.campos.filter(c => c.configurado).length, total: g.campos.length, estado: g.campos.every(c => c.configurado) ? 'completo' : (g.campos.some(c => c.configurado) ? 'parcial' : 'sin_configurar') }))
  const refrescar = (g) => { g.configurados = g.campos.filter(c => c.configurado).length; g.estado = g.configurados === g.total ? 'completo' : (g.configurados ? 'parcial' : 'sin_configurar') }
  ruta('GET', /^\/config\/integraciones$/, () => ({ integraciones: CON, cifrado: true }))
  ruta('PUT', /^\/config\/integraciones\/([^/]+)$/, ({ m }) => { CON.forEach(g => g.campos.forEach(c => { if (c.clave === m[1]) { c.configurado = true; c.origen = 'panel'; c.vista = c.secreto ? '••••demo' : 'EJEMPLO' } })); CON.forEach(refrescar); return { ok: true } })
  ruta('DELETE', /^\/config\/integraciones\/([^/]+)$/, ({ m }) => { CON.forEach(g => g.campos.forEach(c => { if (c.clave === m[1]) { c.configurado = false; c.origen = 'vacio'; c.vista = '' } })); CON.forEach(refrescar); return { ok: true } })

  ruta('GET', /^\/config\/envio$/, () => ({ tier1: 99, tier2: 150, tier3: 199, gratis_desde: 1299, mayoreo_tiers: [{ min_kg: 3, max_kg: 6, precio: 230 }, { min_kg: 6, max_kg: 12, precio: 280 }, { min_kg: 12, max_kg: 30, precio: 360 }, { min_kg: 30, max_kg: 50, precio: 440 }] }))
  ruta('GET', /^\/seo\/config$/, () => [
    { clave: 'meta_titulo_home', valor: 'Mi Tienda | Calzado para dama' },
    { clave: 'meta_descripcion_home', valor: 'Tacones, sandalias, botines y más. Envíos a todo el país.' },
    { clave: 'categorias_estilo', valor: '{}' }])
  ruta('GET', /^\/clientes\/referidos$/, () => db.clientes.filter(c => c.tipo === 'menudeo').map((c, i) => ({ ...c, codigo_referido: 'DEMO' + (100 + i), credito_disponible: i % 3 === 0 ? 60 : 0, referido_por: i > 2 && i % 2 ? 'DEMO100' : null })))
  ruta('GET', /^\/carrito-abandonado\/listar$/, () => ({
    carritos: db.clientes.slice(0, 4).map((c, i) => ({ id: 'ca' + i, nombre: c.nombre, email: c.email, telefono: c.telefono, total: 590 + i * 130, items: [{ nombre: 'Tacón Aurora', color: 'Negro', talla: '25', cantidad: 1, precio: 590 + i * 130 }], created_at: new Date(Date.now() - (i + 1) * 36e5 * 7).toISOString(), recordatorios_enviados: i % 2, estado: 'abandonado', recuperado: false })),
    stats: { total: 4, recuperados: 1, valor_total: 2900, valor_recuperado: 640 } }))
  ruta('GET', /^\/pedidos\/pendientes$/, () => ({ pedidos: [] }))
  ruta('GET', /^\/emails\/fallidos$/, () => ({ fallidos: [] }))
}
