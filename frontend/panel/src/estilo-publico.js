// Página pública (sin login) que abre el QR de las etiquetas de caja.
// Muestra los datos de un estilo (modelo/color/talla) a clientes zapatería
// que escanean la caja -- NUNCA debe ser el link de la tienda al público,
// porque esos clientes compran por mayoreo y esta página es solo para ellos.
const API = '/api'

function _escHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}

export async function renderEstiloPublico(sku) {
  const app = document.querySelector('#app')
  app.innerHTML = `
    <div style="min-height:100vh;width:100vw;background:#0f0f1c;display:flex;align-items:center;justify-content:center;padding:24px;font-family:DM Sans,sans-serif">
      <p style="color:#8888aa;font-size:0.9rem">Cargando estilo…</p>
    </div>
  `

  let data
  try {
    const res = await fetch(`${API}/variantes/sku/${encodeURIComponent(sku)}`)
    const json = await res.json()
    data = Array.isArray(json) ? json[0] : json
  } catch (e) {
    data = null
  }

  if (!data || !data.id) {
    app.innerHTML = `
      <div style="min-height:100vh;width:100vw;background:#0f0f1c;display:flex;align-items:center;justify-content:center;padding:24px;font-family:DM Sans,sans-serif">
        <div style="text-align:center;max-width:320px">
          <p style="font-size:0.72rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#E91E8C;margin:0 0 12px">Zapatillas May</p>
          <p style="color:white;font-size:1.05rem;font-weight:700;margin:0 0 8px">Estilo no encontrado</p>
          <p style="color:#8888aa;font-size:0.85rem;margin:0">Este código no coincide con ningún estilo activo. Si acabas de recibir esta caja, contáctanos.</p>
        </div>
      </div>
    `
    return
  }

  const producto = data.productos || {}
  const codigo = (producto.nombre || '').split(' ')[0] || producto.sku_interno || data.sku
  const nombre = producto.nombre || '—'
  const foto = data.foto_url || producto.imagen_principal || ''
  const whatsMsg = encodeURIComponent(`Hola, quiero pedir más del estilo ${codigo} (${data.color || ''} · Talla ${data.talla || ''})`)

  const filas = [
    ['Color', data.color],
    ['Talla', data.talla],
    ['Material', producto.material],
    ['Categoría', producto.categoria],
  ].filter(([, v]) => v)

  const precios = [
    ['Menudeo', producto.precio_menudeo],
    ['Mayoreo 3-5 pares', producto.precio_mayoreo3],
    ['Mayoreo 6+ pares', producto.precio_mayoreo6],
    ['Corrida completa', producto.precio_corrida],
  ].filter(([, v]) => v)

  app.innerHTML = `
    <div style="min-height:100vh;width:100vw;background:#0f0f1c;display:flex;align-items:center;justify-content:center;padding:24px;font-family:DM Sans,sans-serif">
      <div style="width:100%;max-width:380px">
        <div style="text-align:center;margin-bottom:22px">
          <div style="display:inline-flex;align-items:center;gap:6px;margin-bottom:6px">
            <span style="width:7px;height:7px;border-radius:50%;background:#E91E8C;flex-shrink:0"></span>
            <span style="font-size:0.7rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#E91E8C">Zapatillas May</span>
          </div>
          <p style="color:#4a4a6a;font-size:0.78rem;margin:0">Ficha de estilo · uso interno para zapaterías</p>
        </div>

        <div style="background:#161625;border:1.5px solid #1e1e30;border-radius:16px;overflow:hidden">
          ${foto ? `<img src="${_escHtml(foto)}" alt="${_escHtml(nombre)}" style="width:100%;aspect-ratio:1;object-fit:cover;display:block">` : ''}
          <div style="padding:22px">
            <p style="color:#4a4a6a;font-size:0.68rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 4px">Código</p>
            <p style="color:white;font-size:1.7rem;font-weight:800;margin:0 0 14px;letter-spacing:-0.01em">${_escHtml(codigo)}</p>
            <p style="color:#8888aa;font-size:0.85rem;margin:0 0 16px">${_escHtml(nombre)}</p>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
              ${filas.map(([k, v]) => `
                <div>
                  <p style="color:#4a4a6a;font-size:0.65rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;margin:0 0 3px">${k}</p>
                  <p style="color:white;font-size:0.95rem;font-weight:700;margin:0">${_escHtml(v)}</p>
                </div>
              `).join('')}
            </div>

            ${precios.length ? `
              <div style="border-top:1px solid #1e1e30;padding-top:14px">
                <p style="color:#4a4a6a;font-size:0.65rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;margin:0 0 8px">Precios mayoreo</p>
                ${precios.map(([k, v]) => `
                  <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                    <span style="color:#8888aa;font-size:0.82rem">${k}</span>
                    <span style="color:white;font-size:0.82rem;font-weight:700">$${Number(v).toFixed(0)}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>

        <a href="https://wa.me/5214792244560?text=${whatsMsg}" target="_blank" rel="noopener"
          style="display:block;text-align:center;margin-top:16px;padding:13px;background:#E91E8C;color:white;border-radius:10px;font-size:0.88rem;font-weight:700;text-decoration:none">
          Pedir más de este estilo
        </a>
        <p style="text-align:center;color:#3a3a5c;font-size:0.72rem;margin-top:16px">León, Guanajuato · México · zapatillasmay.mx</p>
      </div>
    </div>
  `
}
