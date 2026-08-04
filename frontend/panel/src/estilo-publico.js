// Página pública (sin login) que abre el QR de las etiquetas de caja.
// Muestra los datos de un estilo (modelo/color/talla) a clientes zapatería
// que escanean la caja -- NUNCA debe ser el link de la tienda al público,
// porque esos clientes compran por mayoreo y esta página es solo para ellos.
const API = '/api'

function _escHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}

const HORMA_LABELS = { normal: 'Normal - talla real', reducida: 'Reducida - corre chico', amplia: 'Amplia - corre grande' }
const TACON_LABELS = { aguja: 'Aguja', bloque: 'Bloque', cuna: 'Cuña', plataforma: 'Plataforma', sin_tacon: 'Sin tacón' }

export async function renderEstiloPublico(sku) {
  // Quien escanea la caja no debe recibir el prompt de "instalar app" del
  // navegador (el manifest.json aplica a todo el sitio, incluida esta página).
  window.addEventListener('beforeinstallprompt', (e) => e.preventDefault())

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
  // Todas las fotos de ESTE color (variante), no solo la de portada
  const fotos = Array.isArray(data.imagenes) && data.imagenes.length
    ? data.imagenes
    : (data.foto_url ? [data.foto_url] : (producto.imagen_principal ? [producto.imagen_principal] : []))

  let taconTexto = TACON_LABELS[producto.tipo_tacon] || producto.tipo_tacon || ''
  if (producto.altura_tacon) taconTexto += (taconTexto ? ' · ' : '') + producto.altura_tacon + ' cm'

  const filas = [
    ['Color', data.color],
    ['Talla', data.talla],
    ['Material', producto.material],
    ['Suela', producto.material_suela],
    ['Forro', producto.forro],
    ['Tacón', taconTexto],
    ['Horma', HORMA_LABELS[producto.horma] || producto.horma],
    ['Categoría', producto.categoria],
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
          ${fotos.length ? `
            <img id="estilo-foto-principal" src="${_escHtml(fotos[0])}" alt="${_escHtml(nombre)}" style="width:100%;aspect-ratio:1;object-fit:contain;background:#0f0f1c;display:block">
            ${fotos.length > 1 ? `
              <div style="display:flex;gap:6px;padding:10px;overflow-x:auto;border-top:1px solid #1e1e30">
                ${fotos.map((url, i) => `
                  <img src="${_escHtml(url)}" onclick="document.getElementById('estilo-foto-principal').src=this.src"
                    style="width:52px;height:52px;object-fit:cover;border-radius:8px;cursor:pointer;flex-shrink:0;border:1.5px solid ${i === 0 ? '#E91E8C' : '#2a2a40'}">
                `).join('')}
              </div>
            ` : ''}
          ` : ''}
          <div style="padding:22px">
            <p style="color:#4a4a6a;font-size:0.68rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 4px">Código</p>
            <p style="color:white;font-size:1.7rem;font-weight:800;margin:0 0 14px;letter-spacing:-0.01em;text-transform:uppercase">${_escHtml(codigo)}</p>
            <p style="color:#8888aa;font-size:0.85rem;margin:0 0 16px;text-transform:uppercase">${_escHtml(nombre)}</p>

            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:16px">
              ${filas.map(([k, v]) => `
                <div style="min-width:0">
                  <p style="color:#4a4a6a;font-size:0.65rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;margin:0 0 3px">${k}</p>
                  <p style="color:white;font-size:0.95rem;font-weight:700;margin:0;text-transform:uppercase;overflow-wrap:break-word">${_escHtml(v)}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <p style="text-align:center;color:#3a3a5c;font-size:0.72rem;margin-top:16px">León, Guanajuato · México</p>
      </div>
    </div>
  `
}
