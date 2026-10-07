// ═══ DEMO: servidor falso. Contesta las llamadas del panel a /api con los datos inventados de demo-datos.js. ═════════
// Nada sale del navegador. Las escrituras (crear/editar/borrar) cambian los datos en memoria mientras la pestaña esté abierta.
import * as D from './demo-datos.js'
import { registrarRutasExtra } from './demo-api-fin.js'
import { registrarRutasMarketplace } from './demo-api-mp.js'
import { registrarRutasOtros } from './demo-api-otros.js'

const db = {
  productos: D.PRODUCTOS, variantes: D.VARIANTES, inventario: D.INVENTARIO, clientes: D.CLIENTES, pedidos: D.PEDIDOS, sucursales: D.SUCURSALES,
  empleados: D.EMPLEADOS, proveedores: D.PROVEEDORES, gastos: D.GASTOS, chats: D.CHATS, cajas: [], cajasHist: [],
}
let _n = 0
const nuevoId = () => `demo-${Date.now().toString(36)}-${++_n}`
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
const q = (qs, k) => new URLSearchParams(qs).get(k)
const num = (v) => parseFloat(v || 0) || 0
const mes = (iso) => (iso || '').slice(0, 7)

function conVariante(inv) {
  const v = db.variantes.find(x => x.id === inv.variante_id)
  const p = v && db.productos.find(x => x.id === v.producto_id)
  const s = db.sucursales.find(x => x.id === inv.sucursal_id)
  return { ...inv, variantes: v ? { ...v, productos: p ? { nombre: p.nombre, sku_interno: p.sku_interno, marca: p.marca, ...p } : null } : null, sucursales: s ? { nombre: s.nombre } : null }
}
const LIGERO = ['id', 'cliente_id', 'status', 'total', 'created_at', 'confirmado_at', 'canal', 'forma_pago', 'mp_preference_id', 'mp_payment_id', 'empleado', 'nombre_cliente', 'ml_order_id', 'shein_order_id', 'walmart_order_id', 'clientes']
const ligero = (p) => Object.fromEntries(LIGERO.map(k => [k, p[k]]))
const cerrado = (p) => ['confirmado', 'pagado', 'enviado'].includes(p.status)

// Ventas por mes / canal para los reportes
function reporteFinanzas(desde, hasta) {
  const ped = db.pedidos.filter(p => cerrado(p) && (!desde || (p.confirmado_at || p.created_at) >= desde) && (!hasta || (p.confirmado_at || p.created_at) <= hasta + 'T23:59:59'))
  const ventas = ped.reduce((s, p) => s + num(p.total), 0)
  const costo = ped.reduce((s, p) => s + p.pedido_items.reduce((a, it) => { const v = db.variantes.find(x => x.id === it.variante_id); const pr = v && db.productos.find(x => x.id === v.producto_id); return a + (pr ? pr.costo : 0) * it.cantidad }, 0), 0)
  const gastos = db.gastos.filter(g => (!desde || g.fecha >= desde) && (!hasta || g.fecha <= hasta)).reduce((s, g) => s + g.monto, 0)
  return { ventas, costo_ventas: costo, utilidad_bruta: ventas - costo, gastos, utilidad_neta: ventas - costo - gastos, pedidos: ped.length, ticket_promedio: ped.length ? ventas / ped.length : 0 }
}

// ── Rutas ────────────────────────────────────────────────────────────────────────────────────────────────────────
// [método, expresión de la ruta, función(ctx) → datos]. ctx = { m: coincidencias, qs, body }
const R = []
const ruta = (met, rx, fn) => R.push([met, rx, fn])
const rutaPrio = (met, rx, fn) => R.unshift([met, rx, fn])   // las de demo-api-fin.js ganan sobre las genéricas de arriba

ruta('POST', /^\/empleados\/login$/, ({ body }) => ({ ...db.empleados[0], token: 'demo-token' }))
ruta('GET', /^\/sucursales\/?$/, () => db.sucursales)
ruta('GET', /^\/empleados\/?$/, () => db.empleados)

// Pedidos
ruta('GET', /^\/pedidos\/?$/, ({ qs }) => {
  let l = db.pedidos.filter(p => !p.oculto)
  const st = q(qs, 'status'); if (st) l = l.filter(p => p.status === st)
  const cid = q(qs, 'cliente_id'); if (cid) l = l.filter(p => p.cliente_id === cid)
  return q(qs, 'ligero') === 'true' ? l.map(ligero) : l
})
ruta('GET', /^\/pedidos\/por-enviar-resumen$/, () => db.pedidos.filter(p => p.status === 'pagado' && ['web', 'mercadolibre', 'amazon'].includes(p.canal)).map(p => ({ id: p.id, nombre_cliente: p.nombre_cliente, total: p.total, canal: p.canal })))
ruta('GET', /^\/pedidos\/apartados$/, () => db.pedidos.filter(p => p.status === 'apartado'))
ruta('GET', /^\/pedidos\/solicitudes-liberacion$/, () => ({ solicitudes: [], total: 0 }))
ruta('GET', /^\/pedidos\/solicitudes-total$/, () => ({ total: 0 }))
ruta('GET', /^\/pedidos\/([^/]+)$/, ({ m }) => db.pedidos.find(p => p.id === m[1]) || null)
ruta('POST', /^\/pedidos\/?$/, ({ body }) => {
  const cli = db.clientes.find(c => c.id === body.cliente_id)
  const abierto = ['borrador', 'pendiente_pago', 'apartado'].includes(body.status)
  const p = { id: nuevoId(), status: 'confirmado', canal: 'pos', forma_pago: 'efectivo', oculto: false, mp_preference_id: null, mp_payment_id: null, empleado: 'Administrador (demo)', sucursal_id: 'suc-1',
    ...body, total: num(body.total), created_at: new Date().toISOString(), confirmado_at: abierto ? null : new Date().toISOString(), nombre_cliente: cli ? cli.nombre : (body.nombre_cliente || 'Mostrador'),
    clientes: cli ? { nombre: cli.nombre, telefono: cli.telefono, email: cli.email } : null, sucursales: { nombre: 'Sucursal Centro' }, pedido_items: [] }
  db.pedidos.unshift(p)
  return [p]
})
ruta('POST', /^\/pedidos\/([^/]+)\/items$/, ({ m, body }) => {
  const p = db.pedidos.find(x => x.id === m[1]); if (!p) return { ok: true }
  const v = db.variantes.find(x => x.id === body.variante_id), pr = v && db.productos.find(x => x.id === v.producto_id)
  const it = { id: nuevoId(), pedido_id: p.id, nombre: pr ? pr.nombre : '', color: v ? v.color : '', talla: v ? v.talla : '', cantidad: 1, ...body, subtotal: num(body.subtotal) || num(body.precio_unitario) * (body.cantidad || 1), variantes: v ? { ...v, productos: pr } : null }
  p.pedido_items.push(it); return [it]
})
ruta('POST', /^\/pedidos\/([^/]+)\/confirmar$/, ({ m, body }) => {
  const p = db.pedidos.find(x => x.id === m[1]); if (!p) return { ok: true }
  p.status = 'confirmado'; p.confirmado_at = new Date().toISOString(); if (body && body.forma_pago) p.forma_pago = body.forma_pago
  p.pedido_items.forEach(i => { const inv = db.inventario.find(x => x.variante_id === i.variante_id && x.sucursal_id === (p.sucursal_id || 'suc-1')); if (inv) inv.cantidad = Math.max(0, inv.cantidad - (i.cantidad || 1)) })
  return { ok: true, pedido: p }
})
ruta('POST', /^\/pedidos\/([^/]+)\/cancelar$/, ({ m }) => { const p = db.pedidos.find(x => x.id === m[1]); if (p) p.status = 'cancelado'; return { ok: true } })
ruta('PATCH', /^\/pedidos\/([^/]+)(\/.*)?$/, ({ m, body }) => { const p = db.pedidos.find(x => x.id === m[1]); if (p) Object.assign(p, body && typeof body === 'object' ? body : {}); return p || { ok: true } })
ruta('DELETE', /^\/pedidos\/([^/]+)$/, ({ m }) => { const i = db.pedidos.findIndex(x => x.id === m[1]); if (i >= 0) db.pedidos.splice(i, 1); return { ok: true } })

// Clientes
ruta('GET', /^\/clientes\/resumen$/, () => db.clientes)
ruta('GET', /^\/clientes\/?$/, () => db.clientes)
ruta('GET', /^\/clientes\/([^/]+)$/, ({ m }) => db.clientes.find(c => c.id === m[1]) || null)
ruta('POST', /^\/clientes\/?$/, ({ body }) => { const c = { id: nuevoId(), activo: true, tipo: 'menudeo', created_at: new Date().toISOString(), ...body }; db.clientes.unshift(c); return c })
ruta('PATCH', /^\/clientes\/([^/]+)$/, ({ m, body }) => { const c = db.clientes.find(x => x.id === m[1]); if (c) Object.assign(c, body); return c })

// Productos / variantes / inventario
ruta('GET', /^\/productos\/?$/, ({ qs }) => { let l = db.productos; const a = q(qs, 'activo'); if (a) l = l.filter(p => String(p.activo) === a.replace('eq.', '')); return l })
ruta('GET', /^\/productos\/siguiente-sku\/.+$/, () => ({ sku: 'L-DEMO-0999', siguiente: 999 }))
ruta('GET', /^\/productos\/(destacados|nuevos|mas-vendidos)$/, () => db.productos.slice(0, 8))
ruta('GET', /^\/productos\/catalog-version$/, () => ({ version: 'demo' }))
ruta('GET', /^\/productos\/([^/]+)$/, ({ m }) => db.productos.find(p => p.id === m[1]) || null)
ruta('POST', /^\/productos\/?$/, ({ body }) => { const p = { id: nuevoId(), activo: true, created_at: new Date().toISOString(), ...body }; db.productos.unshift(p); return [p] })
ruta('PATCH', /^\/productos\/([^/]+)(\/.*)?$/, ({ m, body }) => { const p = db.productos.find(x => x.id === m[1]); if (p && body && typeof body === 'object') Object.assign(p, body); return p ? [p] : { ok: true } })
ruta('GET', /^\/variantes\/?$/, ({ qs }) => {
  const ids = q(qs, 'producto_ids'); let l = db.variantes
  if (ids) { const s = new Set(ids.split(',')); l = l.filter(v => s.has(v.producto_id)) }
  return q(qs, 'ligero') === 'true' ? l.map(({ imagenes, foto_url, ...r }) => r) : l.map(v => ({ ...v, productos: db.productos.find(p => p.id === v.producto_id) }))
})
ruta('GET', /^\/variantes\/producto\/([^/]+)(\/todas)?$/, ({ m }) => db.variantes.filter(v => v.producto_id === m[1]))
ruta('GET', /^\/variantes\/sku\/(.+)$/, ({ m }) => db.variantes.filter(v => v.sku === decodeURIComponent(m[1])))
ruta('POST', /^\/variantes\/?$/, ({ body }) => { const v = { id: nuevoId(), activa: true, ...body }; db.variantes.push(v); return [v] })
ruta('PATCH', /^\/variantes\/([^/]+)$/, ({ m, body }) => { const v = db.variantes.find(x => x.id === m[1]); if (v) Object.assign(v, body); return v ? [v] : { ok: true } })
ruta('GET', /^\/inventario\/slim$/, () => Object.values(db.inventario.reduce((a, i) => { (a[i.variante_id] = a[i.variante_id] || { variante_id: i.variante_id, cantidad: 0 }).cantidad += i.cantidad; return a }, {})))
ruta('GET', /^\/inventario\/alertas$/, ({ qs }) => { const l = db.inventario.filter(i => i.cantidad <= (i.stock_minimo ?? 1)); return q(qs, 'conteo') === 'true' ? { total: l.length } : l.map(conVariante) })
ruta('GET', /^\/inventario\/sucursal\/([^/]+)$/, ({ m }) => db.inventario.filter(i => i.sucursal_id === m[1]).map(conVariante))
ruta('GET', /^\/inventario\/?$/, ({ qs }) => q(qs, 'ligero') === 'true' ? db.inventario : db.inventario.map(conVariante))
ruta('PATCH', /^\/inventario\/actualizar$/, ({ body }) => {
  const i = db.inventario.find(x => x.variante_id === body.variante_id && x.sucursal_id === body.sucursal_id)
  if (i) { if (body.cantidad != null) i.cantidad = num(body.cantidad); if (body.stock_minimo != null) i.stock_minimo = num(body.stock_minimo) }
  else if (body.variante_id) db.inventario.push({ variante_id: body.variante_id, sucursal_id: body.sucursal_id, cantidad: num(body.cantidad), stock_minimo: 3 })
  return { ok: true }
})
ruta('POST', /^\/movimientos\/ajuste$/, ({ body }) => {
  const i = db.inventario.find(x => x.variante_id === body.variante_id && x.sucursal_id === body.sucursal_id)
  if (i) i.cantidad = Math.max(0, i.cantidad + num(body.cantidad) * (body.tipo === 'salida' ? -1 : 1))
  return { ok: true }
})
ruta('GET', /^\/movimientos\/?.*$/, () => [])

// Proveedores, compras, gastos, finanzas
ruta('GET', /^\/finanzas\/proveedores\/?$/, () => db.proveedores)
ruta('POST', /^\/finanzas\/proveedores\/?$/, ({ body }) => { const p = { id: nuevoId(), activo: true, ...body }; db.proveedores.push(p); return p })
ruta('GET', /^\/finanzas\/ordenes\/?$/, () => [])
ruta('GET', /^\/finanzas\/gastos\/?$/, () => db.gastos)
ruta('POST', /^\/finanzas\/gastos\/?$/, ({ body }) => { const g = { id: nuevoId(), fecha: new Date().toISOString().slice(0, 10), ...body }; db.gastos.unshift(g); return g })
ruta('GET', /^\/finanzas\/(reporte|estado-resultados|desglose)\/?$/, ({ qs }) => reporteFinanzas(q(qs, 'desde') || q(qs, 'fecha_inicio'), q(qs, 'hasta') || q(qs, 'fecha_fin')))

// Conversaciones (WhatsApp)
ruta('GET', /^\/chatbot\/chats\/?$/, () => db.chats.map(({ mensajes, ...c }) => c))
ruta('GET', /^\/chatbot\/chats\/([^/]+)\/?(mensajes)?$/, ({ m }) => { const c = db.chats.find(x => x.telefono === m[1]); return c ? (m[2] ? c.mensajes : { ...c }) : [] })
ruta('POST', /^\/chatbot\/chats\/([^/]+)\/(enviar|mensaje)\/?$/, ({ m, body }) => { const c = db.chats.find(x => x.telefono === m[1]); if (c) c.mensajes.push({ id: nuevoId(), direccion: 'out', texto: body.texto || body.mensaje || '', created_at: new Date().toISOString() }); return { ok: true } })
ruta('GET', /^\/chatbot\/config\/?$/, () => ({ activo: true, prompt: 'Eres Maya, la asistente de Zapatillas May (demo).' }))

// Cosas que el panel consulta al abrir y que en la demo son «sin novedades»
ruta('GET', /^\/(carrito-abandonado|sugerencias|resenas\/admin|push\/lista|emails\/historial|novedades)(\/.*)?$/, () => [])
ruta('GET', /^\/demo\/admin\/prospectos$/, () => [])

registrarRutasExtra({ db, ruta: rutaPrio, q, num, mes, cerrado, nuevoId })
registrarRutasMarketplace({ db, ruta: rutaPrio, nuevoId, foto: D.FOTO })
registrarRutasOtros({ db, ruta: rutaPrio })

// ── Atención de la petición ──────────────────────────────────────────────────────────────────────────────────────
export async function responderDemo(input, init) {
  const url = typeof input === 'string' ? input : (input && input.url) || ''
  const metodo = ((init && init.method) || (typeof input !== 'string' && input && input.method) || 'GET').toUpperCase()
  let ruta_ = url
  try {
    if (url.startsWith('http')) {
      const u = new URL(url)
      if (/railway\.app$/.test(u.hostname)) ruta_ = '/api' + u.pathname + u.search   // llamadas directas al servidor (SHEIN...)
      else if (u.origin !== location.origin) return window.__fetchReal(input, init)
      else ruta_ = u.pathname + u.search
    }
  } catch (e) {}
  if (!ruta_.startsWith('/api')) return window.__fetchReal(input, init)   // imágenes, fuentes, etc.
  const [path, qs = ''] = ruta_.replace(/^\/api/, '').split('?')
  let body = {}
  try { const raw = init && init.body; if (typeof raw === 'string') body = JSON.parse(raw) } catch (e) {}
  for (const [met, rx, fn] of R) {
    if (met !== metodo) continue
    const m = path.match(rx)
    if (m) { try { await new Promise(r => setTimeout(r, 60)); return json(fn({ m, qs, body })) } catch (e) { console.warn('[demo]', path, e); return json({ error: 'Demo: ' + e.message }, 500) } }
  }
  if (metodo === 'GET') { console.info('[demo] sin dato para GET', path); return json([]) }
  return json({ ok: true, demo: true })
}
