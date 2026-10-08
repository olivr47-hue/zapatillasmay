// ═══ DEMO: datos INVENTADOS (nada de esto es del negocio real) ═══════════════════════════════════════════════════════
// Todo se genera en el navegador con un generador pseudoaleatorio fijo, así la demo siempre se ve igual.
let _sem = 20260101
const rnd = () => { _sem = (_sem * 1664525 + 1013904223) % 4294967296; return _sem / 4294967296 }
const pick = (a) => a[Math.floor(rnd() * a.length)]
const ent = (a, b) => a + Math.floor(rnd() * (b - a + 1))
let _id = 0
const uid = (p) => `${p}-${(++_id).toString(36).padStart(4, '0')}-demo`
const ISO = (d) => new Date(d).toISOString()
const hoy = new Date()
const hace = (dias, h = 12) => { const d = new Date(hoy); d.setDate(d.getDate() - dias); d.setHours(h, ent(0, 59), 0, 0); return ISO(d) }

// Imagen de producto: tarjeta dibujada (SVG) con el color del producto
export const FOTO = (hex, emoji = '👠') => 'data:image/svg+xml;utf8,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${hex}"/><stop offset="1" stop-color="#fff"/></linearGradient></defs><rect width="400" height="400" fill="url(#g)"/><text x="200" y="235" font-size="150" text-anchor="middle">${emoji}</text></svg>`)

const COLORES = [['Negro', '#111111'], ['Nude', '#E8C4A0'], ['Camel', '#C19A6B'], ['Vino', '#722F37'], ['Blanco', '#F5F5F5'], ['Rosa', '#FF69B4'], ['Azul marino', '#001F5B'], ['Dorado', '#C8A951'], ['Rojo', '#CC0000'], ['Plateado', '#A8A8A8']]
const CATS = [
  { c: 'tacones', p: 'TAC', e: '👠', n: ['Tacón Aurora', 'Tacón Valentina', 'Tacón Elena', 'Tacón Regina', 'Tacón Camila', 'Tacón Sofía'], pr: [420, 560] },
  { c: 'sandalias', p: 'SAN', e: '👡', n: ['Sandalia Brisa', 'Sandalia Luna', 'Sandalia Coral', 'Sandalia Marea', 'Sandalia Isla'], pr: [320, 450] },
  { c: 'botines', p: 'BTN', e: '🥾', n: ['Botín Alba', 'Botín Ámbar', 'Botín Nora', 'Botín Dalia'], pr: [520, 680] },
  { c: 'flats', p: 'FLT', e: '🩰', n: ['Flat Paloma', 'Flat Lirio', 'Flat Mía', 'Flat Jazmín'], pr: [280, 380] },
  { c: 'plataformas', p: 'PLT', e: '👢', n: ['Plataforma Nube', 'Plataforma Estela', 'Plataforma Vera'], pr: [450, 600] },
  { c: 'tenis', p: 'TEN', e: '👟', n: ['Tenis Ráfaga', 'Tenis Ola', 'Tenis Brisa Sport'], pr: [380, 520] },
]
const PROVS = [
  { id: 'prov-1', nombre: 'Calzado Los Arcos', contacto: 'Mario Ibarra', telefono: '4771000001', email: 'ventas@losarcos.demo', ciudad: 'León, Gto.', dias_credito: 15 },
  { id: 'prov-2', nombre: 'Manufacturas Delfín', contacto: 'Laura Quiroz', telefono: '4771000002', email: 'laura@delfin.demo', ciudad: 'León, Gto.', dias_credito: 30 },
  { id: 'prov-3', nombre: 'Zapatos Montiel', contacto: 'Héctor Montiel', telefono: '4771000003', email: 'hector@montiel.demo', ciudad: 'San Francisco del Rincón', dias_credito: 0 },
].map(p => ({ activo: true, direccion: 'Calle Demo 123', notas: '', created_at: hace(300), ...p }))

export const SUCURSALES = [
  { id: 'suc-1', nombre: 'Sucursal Centro', tipo: 'tienda', direccion: 'Calle Madero 100, Centro, León, Gto.', telefono: '4770000001', activa: true, created_at: hace(400) },
  { id: 'suc-2', nombre: 'Bodega', tipo: 'bodega', direccion: 'Blvd. Demo 500, León, Gto.', telefono: '4770000002', activa: true, created_at: hace(400) },
]

export const EMPLEADOS = [
  { id: 'emp-1', nombre: 'Administrador Demo', email: 'admin@demo.com', rol: 'admin', activo: true, created_at: hace(400), permisos: {} },
  { id: 'emp-2', nombre: 'Vendedora Ana', email: 'ana@demo.com', rol: 'vendedor', activo: true, created_at: hace(200), permisos: {} },
  { id: 'emp-3', nombre: 'Cajero Luis', email: 'luis@demo.com', rol: 'cajero', activo: true, created_at: hace(150), permisos: {} },
]

export const PRODUCTOS = []
export const VARIANTES = []
export const INVENTARIO = []
let nSku = 100
for (const cat of CATS) {
  for (const nombre of cat.n) {
    const prov = pick(PROVS)
    const costo = Math.round(ent(cat.pr[0], cat.pr[1]) * 0.45 / 5) * 5
    const menudeo = Math.round(ent(cat.pr[0], cat.pr[1]) / 10) * 10 - 1
    const pid = uid('prod')
    const colores = [...COLORES].sort(() => rnd() - 0.5).slice(0, ent(2, 3))
    const slug = nombre.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-')
    const img = FOTO(colores[0][1], cat.e)
    const prod = {
      id: pid, sku_interno: `L-${cat.p}-0${++nSku}`, marca: 'Zapatillas May', proveedor: prov.nombre, proveedor_id: prov.id, categoria: cat.c, subcategoria: null,
      nombre, slug, descripcion: `${nombre}: modelo de ejemplo de la demo. Cómodo, ligero y con acabado de calidad.`, material: pick(['Piel', 'Sintético', 'Textil']),
      costo, precio_menudeo: menudeo, precio_mayoreo: menudeo - 30, precio_mayoreo3: menudeo - 30, precio_mayoreo6: menudeo - 70, precio_corrida: menudeo - 100, corrida_activa: true,
      precio_antes: null, tiene_descuento: false, porcentaje_descuento: 0, talla_minima: 22, talla_maxima: 27, tallas_disponibles: '22,23,24,25,26,27', imagen_principal: img, imagenes: [img],
      activo: true, destacado: rnd() < 0.2, nuevo: rnd() < 0.25, es_oferta: false, stock_minimo: 3, orden_home: null, created_at: hace(ent(10, 250)), updated_at: hace(ent(1, 9)), foto_limpia: false, no_resurtir: false, peso_gramos: 450,
    }
    PRODUCTOS.push(prod)
    for (const [color, hex] of colores) {
      for (let t = 22; t <= 27; t++) {
        const vid = uid('var')
        VARIANTES.push({ id: vid, producto_id: pid, color, color_hex: hex, talla: String(t), sku: `${prod.sku_interno}-${color.slice(0, 3).toUpperCase()}-${t}`, foto_url: FOTO(hex, cat.e), imagenes: [], activa: true, created_at: prod.created_at })
        for (const s of SUCURSALES) {
          const cant = rnd() < 0.03 ? ent(0, 1) : (s.id === 'suc-1' ? ent(2, 3) : ent(2, 6))
          INVENTARIO.push({ variante_id: vid, sucursal_id: s.id, cantidad: cant, stock_minimo: 1 })
        }
      }
    }
  }
}

const NOMBRES = ['María López', 'Ana Torres', 'Lupita Hernández', 'Fernanda Ruiz', 'Zapatería La Moda', 'Calzado Dulce Paso', 'Boutique Tania', 'Karla Mendoza', 'Rosa Elena Díaz', 'Zapatería El Pasito', 'Daniela Cruz', 'Mariana Ortega', 'Calzado Sol y Luna', 'Paola Reyes']
export const CLIENTES = NOMBRES.map((n, i) => {
  const mayor = /Zapater|Calzado|Boutique/.test(n)
  const c = {
    id: uid('cli'), nombre: n, telefono: `47711${String(10000 + i * 137).slice(-5)}`, email: `${n.split(' ')[0].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')}${i}@correo.demo`,
    tipo: mayor ? 'mayoreo' : 'menudeo', direccion: 'Calle Demo ' + (100 + i), limite_credito: mayor ? 20000 : 0, dias_credito: mayor ? 15 : 0, ciudad: pick(['León', 'Guadalajara', 'Querétaro', 'CDMX', 'Irapuato']), estado: 'Gto.',
    codigo_postal: '37000', activo: true, origen: pick(['tienda', 'web', 'whatsapp', 'tiktok']), created_at: hace(ent(20, 300)), credito_disponible: mayor ? 20000 : 0, comentarios_internos: '', codigo_referido: 'DEMO' + i,
  }
  return c
})

// Pedidos de los últimos ~7 meses: más recientes más seguidos
export const PEDIDOS = []
export const PEDIDO_ITEMS = []
const CANALES = ['pos', 'pos', 'pos', 'web', 'web', 'whatsapp', 'mercadolibre', 'tiktok', 'amazon']
for (let i = 0; i < 160; i++) {
  const dias = Math.floor(Math.pow(rnd(), 1.6) * 210)
  const cli = pick(CLIENTES)
  const canal = cli.tipo === 'mayoreo' ? 'portal' : pick(CANALES)
  const pid = uid('ped')
  const nItems = cli.tipo === 'mayoreo' ? ent(6, 18) : ent(1, 3)
  let total = 0
  const items = []
  for (let k = 0; k < nItems; k++) {
    const v = pick(VARIANTES), p = PRODUCTOS.find(x => x.id === v.producto_id)
    const precio = cli.tipo === 'mayoreo' ? p.precio_mayoreo6 : p.precio_menudeo
    items.push({ id: uid('it'), pedido_id: pid, variante_id: v.id, cantidad: 1, precio_unitario: precio, subtotal: precio, nombre: p.nombre, color: v.color, talla: v.talla, es_corrida: false, reservado: false, solicitud_liberar: false, solicitud_apartar: false })
    total += precio
  }
  const abierto = dias < 4 && rnd() < 0.5
  const status = abierto ? pick(['pendiente_pago', 'pagado', 'apartado']) : pick(['confirmado', 'confirmado', 'confirmado', 'enviado', 'pagado', 'cancelado'])
  const fecha = hace(dias, ent(10, 20))
  const ped = {
    id: pid, cliente_id: cli.id, status, total, created_at: fecha, confirmado_at: status === 'pendiente_pago' || status === 'apartado' ? null : fecha, canal, forma_pago: canal === 'pos' ? pick(['efectivo', 'tarjeta', 'transferencia']) : (cli.tipo === 'mayoreo' && rnd() < 0.3 ? 'credito' : 'mercadopago'),
    mp_preference_id: null, mp_payment_id: null, empleado: pick(EMPLEADOS).nombre, nombre_cliente: cli.nombre, sucursal_id: 'suc-1', oculto: false, guia: null, paqueteria: null,
    clientes: { nombre: cli.nombre, telefono: cli.telefono, email: cli.email }, sucursales: { nombre: 'Sucursal Centro' }, pedido_items: items,
  }
  PEDIDOS.push(ped); PEDIDO_ITEMS.push(...items)
}
PEDIDOS.sort((a, b) => (b.confirmado_at || b.created_at).localeCompare(a.confirmado_at || a.created_at))

export const PROVEEDORES = PROVS
export const GASTOS = Array.from({ length: 40 }, (_, i) => ({ id: uid('gas'), concepto: pick(['Renta del local', 'Luz', 'Nómina', 'Publicidad Meta', 'Empaques', 'Envíos', 'Internet']), categoria: pick(['Renta', 'Servicios', 'Nómina', 'Marketing', 'Operación']), monto: ent(300, 9000), fecha: hace(i * 5).slice(0, 10), sucursal_id: 'suc-1', created_at: hace(i * 5) }))

const MSJ = [
  ['Hola, ¿tienen el Tacón Aurora en negro talla 25?', 'Hola 😊 ¡Sí! Tenemos talla 25 en negro. ¿Te lo apartamos?'],
  ['¿Hacen envíos a Guadalajara?', 'Claro, enviamos a todo México. El envío es gratis en compras desde $1,299.'],
  ['Quiero comprar 6 pares para mi tienda', 'Con gusto. Para mayoreo tenemos precios especiales desde 3 pares. ¿Te paso el catálogo?'],
]
export const CHATS = MSJ.map((m, i) => ({
  telefono: `52477110${i}00${i}`, nombre: ['Carolina', 'Beatriz', 'Zapatería El Sol'][i], ultimo_mensaje: m[1], ultimo_at: hace(0, 9 + i), no_leidos: i === 0 ? 2 : 0, bot_activo: true, etiquetas: i === 2 ? ['mayoreo'] : [], etapa: ['nuevo', 'interesado', 'negociando'][i],
  mensajes: [{ id: uid('m'), mensaje: m[0], respuesta: m[1], canal: 'whatsapp', created_at: hace(0, 8 + i) }],
}))

// Ejemplo: una clienta responde a las fotos de un carrusel que le mandaron
const _f1 = FOTO('#111111', '👠'), _f2 = FOTO('#E8C4A0', '👡')
CHATS.push({
  telefono: '5213311500000', nombre: 'Karla (ejemplo)', ultimo_mensaje: 'Estos dos pares', ultimo_at: hace(0, 11), no_leidos: 1, bot_activo: true, etiquetas: [], etapa: 'interesado',
  mensajes: [
    { id: uid('m'), mensaje: 'Estos dos pares', respuesta: '', canal: 'whatsapp', tipo: 'texto', created_at: hace(0, 11) },
    { id: uid('m'), mensaje: '.\n[El cliente está respondiendo sobre: Tacón Aurora · Negro\n|IMGS|' + _f1 + ']', respuesta: '', canal: 'whatsapp', tipo: 'texto', created_at: hace(0, 10) },
    { id: uid('m'), mensaje: 'Hola, me interesan\n[El cliente está respondiendo sobre: [Carrusel] Mira estos modelos 👠 — Productos: Tacón Aurora · Negro, Sandalia Luna · Nude (2 fotos)\n|IMGS|' + _f1 + ',' + _f2 + ']', respuesta: '', canal: 'whatsapp', tipo: 'texto', created_at: hace(0, 9) },
  ],
})
