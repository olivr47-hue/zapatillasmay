// ═══ DEMO: pantalla de Analítica completa (Productos, Canales, Clientas, Páginas, Embudo, Perfil y Ventas y anuncios) ═══
// Datos inventados; el resumen y la gráfica en tiempo real ya viven en demo-api-otros.js.
export function registrarRutasAnalytics({ ruta, db }) {
  const ymd = (k, h = 12, mi = 0) => { const d = new Date(Date.now() - k * 864e5); const p = (n) => String(n).padStart(2, '0'); return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}${p(h)}${p(mi)}` }
  const modelos = () => (db.productos || []).slice(0, 14).map(p => p.nombre)
  const M = () => modelos()

  ruta('GET', /^\/analytics\/productos$/, () => {
    const n = M()
    const filas = n.map((modelo, i) => {
      const vistas = 620 - i * 38, carrito = Math.max(4, Math.round(vistas * (0.11 - i * 0.003))), compras = Math.max(0, Math.round(carrito * (0.33 - i * 0.015)))
      return { modelo, vistas, carrito, pct_carrito: +(carrito / vistas * 100).toFixed(1), compras, ingreso: compras * (420 + (i % 5) * 60) }
    })
    return {
      productos: filas,
      alertas: {
        se_agrega_no_se_compra: filas.filter(x => x.compras === 0 || x.compras < 2).slice(0, 4).map(x => ({ modelo: x.modelo, carrito: x.carrito })),
        se_ve_no_se_agrega: filas.slice(-3).map(x => ({ modelo: x.modelo, vistas: x.vistas })),
        mejores: filas.filter(x => x.compras > 0).slice(0, 4),
      },
    }
  })
  ruta('GET', /^\/analytics\/busquedas$/, () => ({
    terminos: [{ termino: 'tacones negros', busquedas: 64, modelos: 12 }, { termino: 'sandalias', busquedas: 51, modelos: 9 }, { termino: 'botines', busquedas: 38, modelos: 7 },
      { termino: 'tacón 10 cm', busquedas: 29, modelos: 5 }, { termino: 'zapatos de novia', busquedas: 17, sin_resultados: true }, { termino: 'flats', busquedas: 15, modelos: 6 }],
    sin_resultados: [{ termino: 'zapatos de novia', busquedas: 17 }, { termino: 'tenis blancos', busquedas: 9 }],
  }))
  ruta('GET', /^\/analytics\/canales$/, ({ qs }) => {
    const por = new URLSearchParams(qs).get('por') || 'canal'
    const f = (nombre, sesiones, conv, ticket) => { const compras = Math.round(sesiones * conv / 100); return { nombre, sesiones, conversion: conv, compras, ingreso: compras * ticket, ingreso_por_sesion: +(compras * ticket / sesiones).toFixed(2), ticket } }
    const T = {
      canal: { etiqueta: 'Canal', filas: [f('Directo', 1480, 2.4, 610), f('Búsqueda orgánica', 1120, 1.9, 590), f('Social (Instagram/Facebook)', 940, 1.2, 540), f('Anuncios de pago', 760, 2.9, 650), f('Correo y WhatsApp', 520, 4.1, 700)] },
      fuente: { etiqueta: 'Fuente', filas: [f('(direct)', 1480, 2.4, 610), f('google', 1120, 1.9, 590), f('instagram', 610, 1.1, 530), f('facebook', 330, 1.4, 560), f('whatsapp', 520, 4.1, 700)] },
      campana: { etiqueta: 'Campaña', filas: [f('buen-fin-tacones', 410, 3.4, 690), f('novedades-botines', 350, 2.6, 640), f('retargeting-carrito', 210, 5.2, 620)] },
      dispositivo: { etiqueta: 'Dispositivo', filas: [f('mobile', 3680, 1.8, 580), f('desktop', 960, 3.1, 690), f('tablet', 180, 1.4, 540)] },
    }
    return T[por] || T.canal
  })
  ruta('GET', /^\/analytics\/visitas-detalle$/, () => ({
    visitas: [
      { fecha: ymd(0).slice(0, 8), desde: ymd(0, 14, 5), hasta: ymd(0, 14, 11), ciudad: 'León', region: 'Guanajuato', dispositivo: 'mobile', fuente: 'whatsapp', medio: 'referral', paginas: ['/', '/tacones', '/producto/tacon-aurora'] },
      { fecha: ymd(0).slice(0, 8), desde: ymd(0, 12, 40), hasta: ymd(0, 12, 40), ciudad: 'Ciudad de México', region: 'CDMX', dispositivo: 'desktop', fuente: 'google', medio: 'organic', paginas: ['/sandalias'] },
      { fecha: ymd(0).slice(0, 8), desde: ymd(0, 11, 18), hasta: ymd(0, 11, 27), ciudad: 'Guadalajara', region: 'Jalisco', dispositivo: 'mobile', fuente: 'instagram', medio: 'social', paginas: ['/', '/botines', '/producto/botin-nora', '/carrito'] },
      { fecha: ymd(1).slice(0, 8), desde: ymd(1, 20, 2), hasta: ymd(1, 20, 9), ciudad: 'Monterrey', region: 'Nuevo León', dispositivo: 'mobile', fuente: '(direct)', medio: '(none)', paginas: ['/', '/flats'] },
      { fecha: ymd(1).slice(0, 8), desde: ymd(1, 18, 45), hasta: ymd(1, 18, 52), ciudad: 'Querétaro', region: 'Querétaro', dispositivo: 'mobile', fuente: 'facebook', medio: 'paid', paginas: ['/producto/sandalia-luna', '/carrito', '/checkout'] },
    ],
  }))
  ruta('GET', /^\/analytics\/clientas$/, () => ({
    grupos: [
      { clave: 'new', usuarios: 3120, pct_usuarios: 83, sesiones: 3890, paginas_por_sesion: 3.4, duracion_s: 118, interaccion: 58, compras: 48, ingreso: 27400, conversion: 1.2 },
      { clave: 'returning', usuarios: 640, pct_usuarios: 17, sesiones: 930, paginas_por_sesion: 5.1, duracion_s: 214, interaccion: 74, compras: 52, ingreso: 33800, conversion: 5.6 },
    ],
  }))
  ruta('GET', /^\/analytics\/paginas$/, () => ({
    entrada: [{ pagina: '/', sesiones: 2310, rebote: 41, compras: 38, ingreso: 22800 }, { pagina: '/tacones', sesiones: 690, rebote: 36, compras: 21, ingreso: 13300 },
      { pagina: '/mayoreo', sesiones: 410, rebote: 52, compras: 6, ingreso: 9800 }, { pagina: '/sandalias', sesiones: 380, rebote: 44, compras: 9, ingreso: 4900 }, { pagina: '/producto/tacon-aurora', sesiones: 320, rebote: 58, compras: 7, ingreso: 4200 }],
    vistas: [{ pagina: '/', vistas: 6400, usuarios: 2900, tiempo_s: 52 }, { pagina: '/tacones', vistas: 2800, usuarios: 1500, tiempo_s: 71 }, { pagina: '/producto/tacon-aurora', vistas: 1900, usuarios: 1100, tiempo_s: 96 },
      { pagina: '/carrito', vistas: 1300, usuarios: 780, tiempo_s: 88 }, { pagina: '/sandalias', vistas: 1250, usuarios: 800, tiempo_s: 64 }],
  }))
  ruta('GET', /^\/analytics\/embudo$/, () => ({
    pasos: [
      { etiqueta: 'Vieron un modelo', eventos: 9400, pct_del_total: 100 },
      { etiqueta: 'Lo agregaron al carrito', eventos: 1010, pct_del_total: 10.7 },
      { etiqueta: 'Iniciaron el pago', eventos: 390, pct_del_total: 4.1 },
      { etiqueta: 'Compraron', eventos: 100, pct_del_total: 1.1 },
    ],
  }))
  ruta('GET', /^\/analytics\/tecnologia$/, () => ({
    navegadores: [{ nombre: 'Chrome', sesiones: 2980 }, { nombre: 'Safari', sesiones: 1320 }, { nombre: 'Samsung Internet', sesiones: 280 }, { nombre: 'Edge', sesiones: 150 }],
    sistemas: [{ nombre: 'Android', sesiones: 2640 }, { nombre: 'iOS', sesiones: 1420 }, { nombre: 'Windows', sesiones: 610 }, { nombre: 'macOS', sesiones: 90 }],
    idiomas: [{ nombre: 'es-mx', sesiones: 4310 }, { nombre: 'es', sesiones: 380 }, { nombre: 'en-us', sesiones: 130 }],
  }))
  ruta('GET', /^\/analytics\/demografia$/, () => ({
    disponible: true,
    edad: [{ nombre: '18-24', usuarios: 410 }, { nombre: '25-34', usuarios: 1180 }, { nombre: '35-44', usuarios: 930 }, { nombre: '45-54', usuarios: 520 }, { nombre: '55+', usuarios: 210 }],
    genero: [{ nombre: 'Mujer', usuarios: 2870 }, { nombre: 'Hombre', usuarios: 380 }],
    intereses: [{ nombre: 'Moda y accesorios', usuarios: 1450 }, { nombre: 'Compras en línea', usuarios: 1210 }, { nombre: 'Belleza', usuarios: 760 }],
  }))
  ruta('GET', /^\/analytics\/origen-erp$/, () => ({
    ventas: 61200, pedidos: 96, ticket: 637,
    por_origen: [
      { origen: 'Google (orgánico)', pedidos: 31, ventas: 19800, pct_ventas: 32, ticket: 639, top_modelos: [{ modelo: 'Tacón Aurora', pares: 9 }, { modelo: 'Botín Nora', pares: 7 }] },
      { origen: 'Directo', pedidos: 24, ventas: 15900, pct_ventas: 26, ticket: 662, top_modelos: [{ modelo: 'Sandalia Luna', pares: 8 }] },
      { origen: 'Instagram', pedidos: 17, ventas: 10100, pct_ventas: 17, ticket: 594, top_modelos: [{ modelo: 'Flat Brisa', pares: 6 }] },
      { origen: 'WhatsApp', pedidos: 14, ventas: 9200, pct_ventas: 15, ticket: 657, top_modelos: [{ modelo: 'Tacón Aurora', pares: 5 }] },
      { origen: 'Meta Ads', pedidos: 10, ventas: 6200, pct_ventas: 10, ticket: 620, top_modelos: [{ modelo: 'Botín Nora', pares: 4 }] },
    ],
  }))
  ruta('GET', /^\/analytics\/google-vs-erp$/, () => ({ ga_compras: 82, ga_ingreso: 52400, erp_pedidos: 96, erp_ventas: 61200, compras_sin_registrar_en_ga_pct: 14.6 }))
  ruta('GET', /^\/analytics\/roas$/, () => ({
    meta: { conectado: true, gasto: 4200, ventas_erp: 6200, pedidos_erp: 10, roas_erp: 1.5, costo_por_pedido: 420, roas_reportado_por_meta: 2.1, compras_reportadas_por_meta: 13 },
    google_ads: { conectado: true, gasto: 3100, ventas_erp: 7400, pedidos_erp: 12, roas_erp: 2.4, costo_por_pedido: 258, roas_ga4: 2.8, compras_ga4: 14, clics: 1260,
      campanas: [{ nombre: 'Tacones - Búsqueda', gasto: 1800, clics: 720, ctr: 4.1, cpc: 2.5, compras: 9 }, { nombre: 'Botines - Shopping', gasto: 1300, clics: 540, ctr: 3.2, cpc: 2.4, compras: 5 }] },
  }))
  ruta('GET', /^\/analytics\/meta-ads$/, () => ({
    campanas: [{ nombre: 'Buen Fin - Tacones', gasto: 2100, clics: 980, ctr: 2.8, compras: 6 }, { nombre: 'Retargeting carrito', gasto: 900, clics: 410, ctr: 3.6, compras: 4 }, { nombre: 'Novedades botines', gasto: 1200, clics: 520, ctr: 2.1, compras: 3 }],
  }))
}
