// ═══ DEMO: Marketplace (lado del negocio) y «Renta del sistema» con datos inventados ═══════════════════════════════════
export function registrarRutasMarketplace({ db, ruta, nuevoId, foto }) {
  const hace = (d) => new Date(Date.now() - d * 864e5).toISOString()
  const V = [
    { id: 'v1', nombre_tienda: 'Calzado Lupita', ciudad: 'León', estado_region: 'Gto.', nombre_contacto: 'Lupita Ramírez', telefono: '4771110001', email: 'lupita@ejemplo.demo', estado: 'activo', productos: 6, publicados: 5, por_aprobar: 1, pedidos: 14, ventas: 18430, comision_ganada: 560, comision_por_par: 20 },
    { id: 'v2', nombre_tienda: 'Boutique Mía', ciudad: 'Guadalajara', estado_region: 'Jal.', nombre_contacto: 'Mía Torres', telefono: '3331110002', email: 'mia@ejemplo.demo', estado: 'activo', productos: 3, publicados: 3, por_aprobar: 0, pedidos: 5, ventas: 6120, comision_ganada: 180, comision_por_par: 20 },
    { id: 'v3', nombre_tienda: 'Zapatos Dany', ciudad: 'Irapuato', estado_region: 'Gto.', nombre_contacto: 'Daniela Cruz', telefono: '4621110003', email: 'dany@ejemplo.demo', estado: 'pendiente', productos: 2, publicados: 0, por_aprobar: 2, pedidos: 0, ventas: 0, comision_ganada: 0, comision_por_par: 20 },
  ]
  const P = [
    { id: 'p1', nombre: 'Botín Charol Café', estado: 'pendiente', precio: 520, precio_mayoreo3: 470, envio: 120, categoria: 'botines', material: 'Charol', descripcion: 'Botín de charol con cierre lateral, tacón de 6 cm.', imagenes: [foto('#7B4F2E', '🥾')], mp_vendedores: { nombre_tienda: 'Calzado Lupita' }, mp_variantes: [{ talla: '24', color: 'Café', stock: 3 }, { talla: '25', color: 'Café', stock: 4 }] },
    { id: 'p2', nombre: 'Sandalia Dorada Fiesta', estado: 'pendiente', precio: 380, precio_mayoreo3: 340, envio: 120, categoria: 'sandalias', material: 'Sintético', descripcion: 'Sandalia dorada de tacón bloque.', imagenes: [foto('#C8A951', '👡')], mp_vendedores: { nombre_tienda: 'Zapatos Dany' }, mp_variantes: [{ talla: '23', color: 'Dorado', stock: 2 }, { talla: '24', color: 'Dorado', stock: 2 }] },
    { id: 'p3', nombre: 'Flat Rosa Suave', estado: 'publicado', precio: 290, precio_mayoreo3: 260, envio: 100, categoria: 'flats', material: 'Textil', descripcion: 'Flat cómodo para diario.', imagenes: [foto('#FF69B4', '🩰')], mp_vendedores: { nombre_tienda: 'Boutique Mía' }, mp_variantes: [{ talla: '24', color: 'Rosa', stock: 6 }] },
  ]
  const O = [
    { id: 'o1', numero: 1042, created_at: hace(1), mp_vendedores: { nombre_tienda: 'Calzado Lupita' }, cliente_nombre: 'Carolina Ruiz', cliente_telefono: '4779990001', ciudad: 'León', mp_pedido_items: [{ cantidad: 1, nombre: 'Botín Charol Café', talla: '25' }], total: 640, neto_vendedor: 520, comision: 20, envio_negocio: 0, status: 'pagado', modo_envio: 'directo' },
    { id: 'o2', numero: 1041, created_at: hace(3), mp_vendedores: { nombre_tienda: 'Boutique Mía' }, cliente_nombre: 'Beatriz Soto', cliente_telefono: '3339990002', ciudad: 'Guadalajara', mp_pedido_items: [{ cantidad: 3, nombre: 'Flat Rosa Suave', talla: '24' }], total: 980, neto_vendedor: 780, comision: 60, envio_negocio: 0, status: 'entregado', modo_envio: 'directo', guia: 'DEMO123' },
  ]
  ruta('GET', /^\/marketplace\/admin\/resumen$/, () => ({ vendedores_pendientes: 1, productos_por_aprobar: 2, vendedores_activos: 2, productos_publicados: 8, pedidos_por_enviar: 1, pedidos_por_recibir: 0, ventas_total: 24550, comision_total: 740, por_liquidar: 1840 }))
  ruta('GET', /^\/marketplace\/admin\/vendedores$/, () => V)
  ruta('PATCH', /^\/marketplace\/admin\/vendedores\/([^/]+)$/, ({ m, body }) => { const v = V.find(x => x.id === m[1]); if (v) Object.assign(v, body); return { ok: true } })
  ruta('GET', /^\/marketplace\/admin\/productos$/, ({ qs }) => { const e = new URLSearchParams(qs).get('estado'); return e ? P.filter(p => p.estado === e) : P })
  ruta('PATCH', /^\/marketplace\/admin\/productos\/([^/]+)$/, ({ m, body }) => { const p = P.find(x => x.id === m[1]); if (p) Object.assign(p, body); return { ok: true } })
  ruta('GET', /^\/marketplace\/admin\/pedidos$/, () => O)
  ruta('GET', /^\/marketplace\/admin\/saldos$/, () => [{ id: 'v1', nombre_tienda: 'Calzado Lupita', por_pagar: 1240, pedidos_por_liquidar: 3, por_enviar: 640, liquidado: 5200, clabe: '012345678901234567', titular: 'Lupita Ramírez', banco: 'BBVA' }, { id: 'v2', nombre_tienda: 'Boutique Mía', por_pagar: 600, pedidos_por_liquidar: 1, por_enviar: 0, liquidado: 2100, clabe: '', titular: '', banco: '' }])
  ruta('GET', /^\/marketplace\/admin\/ajustes$/, () => ({ pct: 3.49, fijo: 4, iva: 16, ganancia_por_par: 20, ejemplo: { neto: 500, precio_publico: 547 } }))
  ruta('POST', /^\/marketplace\/admin\/(tienda-prueba|vendedores\/[^/]+\/entrar)$/, () => ({ url: 'https://zapatillasmay.mx/vender#sistema', tienda: 'Demo' }))
  ruta('GET', /^\/demo\/admin\/prospectos$/, () => [
    { id: 'pr1', nombre: 'Rosa Elena Díaz', whatsapp: '4775550101', email: 'rosa@ejemplo.demo', negocio: 'Zapatería El Pasito', tipo_negocio: 'Zapatos', ciudad: 'León', mensaje: 'Quiero llevar inventario de 2 sucursales.', estado: 'nuevo', notas_admin: '', created_at: hace(1), demo_entro_at: hace(1) },
    { id: 'pr2', nombre: 'Marco Antonio Vela', whatsapp: '3335550102', email: 'marco@ejemplo.demo', negocio: 'Ropa Vela', tipo_negocio: 'Ropa', ciudad: 'Guadalajara', mensaje: 'Vender también en MercadoLibre.', estado: 'contactado', notas_admin: 'Le llamo el lunes', created_at: hace(4), demo_entro_at: null },
  ])
}
