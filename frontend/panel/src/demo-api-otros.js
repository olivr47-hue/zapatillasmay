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

  ruta('GET', /^\/config\/envio$/, () => ({ tier1: 99, tier2: 150, tier3: 199, gratis_desde: 1299, mayoreo_tiers: [{ min_kg: 3, max_kg: 6, precio: 230 }, { min_kg: 6, max_kg: 12, precio: 280 }, { min_kg: 12, max_kg: 30, precio: 360 }, { min_kg: 30, max_kg: 50, precio: 440 }] }))
  ruta('GET', /^\/seo\/config$/, () => [
    { clave: 'meta_titulo_home', valor: 'Zapatillas May | Calzado para dama (demo)' },
    { clave: 'meta_descripcion_home', valor: 'Tacones, sandalias, botines y más. Envíos a todo México.' },
    { clave: 'categorias_estilo', valor: '{}' }])
  ruta('GET', /^\/clientes\/referidos$/, () => db.clientes.filter(c => c.tipo === 'menudeo').map((c, i) => ({ ...c, codigo_referido: 'MAY' + (100 + i), credito_disponible: i % 3 === 0 ? 60 : 0, referido_por: i > 2 && i % 2 ? 'MAY100' : null })))
  ruta('GET', /^\/carrito-abandonado\/listar$/, () => ({
    carritos: db.clientes.slice(0, 4).map((c, i) => ({ id: 'ca' + i, nombre: c.nombre, email: c.email, telefono: c.telefono, total: 590 + i * 130, items: [{ nombre: 'Tacón Aurora', color: 'Negro', talla: '25', cantidad: 1, precio: 590 + i * 130 }], created_at: new Date(Date.now() - (i + 1) * 36e5 * 7).toISOString(), recordatorios_enviados: i % 2, estado: 'abandonado', recuperado: false })),
    stats: { total: 4, recuperados: 1, valor_total: 2900, valor_recuperado: 640 } }))
  ruta('GET', /^\/pedidos\/pendientes$/, () => ({ pedidos: [] }))
  ruta('GET', /^\/emails\/fallidos$/, () => ({ fallidos: [] }))
}
