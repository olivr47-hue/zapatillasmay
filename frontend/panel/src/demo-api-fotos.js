// ═══ DEMO: crear hasta 3 modelos nuevos, con el limpiador de fondo blanco corriendo en el navegador ══════════════════════
import { limpiarFotoDemo, cuadrarFotoDemo, aDataUrl } from './demo-limpiar.js'

export const MAX_MODELOS_NUEVOS = 3

export function registrarRutasFotos({ db, ruta, nuevoId, num, q }) {
  const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
  const archivoDe = (body) => { const f = body && body.__form; return f && typeof f.get === 'function' ? (f.get('archivo') || f.get('file')) : null }

  // Vista previa del limpiador: devuelve la foto limpia (o explica por qué no se pudo, como el sistema real)
  ruta('POST', /^\/imagenes\/limpiar-vista$/, async ({ body }) => {
    const f = archivoDe(body); if (!f) return json({ motivo: 'no llegó la foto' }, 422)
    try {
      const blob = await limpiarFotoDemo(f)
      return new Response(blob, { status: 200, headers: { 'Content-Type': 'image/jpeg' } })
    } catch (e) { return json({ motivo: e.message || 'la foto no se presta para limpiarla' }, 422) }
  })

  // «Subir» la foto: en la demo se queda en el navegador (dirección de datos), no sale a ningún servidor
  ruta('POST', /^\/imagenes\/subir$/, async ({ body, qs }) => {
    const f = archivoDe(body); if (!f) return json({ error: 'no llegó la foto' }, 400)
    try {
      let blob = f
      if (q(qs, 'cuadrar') === 'true') blob = await cuadrarFotoDemo(f)
      return json({ url: await aDataUrl(blob), public_id: 'demo/' + nuevoId(), cuadrada: true })
    } catch (e) { return json({ error: e.message || 'no se pudo leer la foto' }, 400) }
  })

  // Límite de la demo: 3 modelos nuevos
  ruta('POST', /^\/productos\/?$/, ({ body }) => {
    const nuevos = db.productos.filter(p => p._demoNuevo).length
    if (nuevos >= MAX_MODELOS_NUEVOS) return json({ error: `La demo permite crear hasta ${MAX_MODELOS_NUEVOS} modelos nuevos para probar. Ya llegaste al límite; toca «Reiniciar demo» abajo para empezar de nuevo.` }, 403)
    const p = { id: nuevoId(), activo: true, created_at: new Date().toISOString(), _demoNuevo: true, imagenes: [], ...body }
    db.productos.unshift(p)
    return json([p])
  })

  // Variantes (color × talla) del modelo nuevo, con su foto
  ruta('POST', /^\/variantes\/lote$/, ({ body }) => {
    const sucs = (db.sucursales || []).slice(0, 1)
    const prod = db.productos.find(p => p.id === body.producto_id)
    ;(body.variantes || []).forEach(v => {
      const id = nuevoId()
      db.variantes.push({ id, producto_id: body.producto_id, activa: true, sku: `${(prod && prod.sku_interno) || 'DEMO'}-${String(v.color || '').slice(0, 3).toUpperCase()}-${v.talla}`, ...v })
      sucs.forEach(s => db.inventario.push({ variante_id: id, sucursal_id: s.id, cantidad: 2, stock_minimo: 1, cant_estanteria: 2, cant_amarres: 0, ubicacion_confirmada: false }))
    })
    if (prod) {
      const primera = (body.variantes || []).find(v => v.foto_url)
      if (primera && !prod.imagen_principal) { prod.imagen_principal = primera.foto_url; prod.imagenes = (primera.imagenes && primera.imagenes.length ? primera.imagenes : [primera.foto_url]) }
    }
    return json({ ok: true, creadas: (body.variantes || []).length })
  })
}
