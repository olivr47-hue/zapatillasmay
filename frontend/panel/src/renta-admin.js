// ═══ Renta del sistema: interesados que pidieron la demo (formulario de zapatillasmay.mx/vender) ═══════════════════════
const API = '/api'
const _esAdmin = () => { try { return !!localStorage.getItem('erp_token') && window._empleadoActual && window._empleadoActual.rol === 'admin' } catch (e) { return false } }
const esc = (v) => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const ETQ = { nuevo: ['#fff4e5', '#b26a00', 'Nuevo'], contactado: ['#e3f2fd', '#1565c0', 'Contactado'], demo: ['#f3e8ff', '#6d28d9', 'Vio la demo'], cliente: ['#e8f5e9', '#2e7d32', 'Cliente'], descartado: ['#eee', '#666', 'Descartado'] }
let _pros = []

async function api(ruta, op = {}) {
  const r = await fetch(API + ruta, { method: op.method || 'GET', headers: op.json !== undefined ? { 'Content-Type': 'application/json' } : undefined, body: op.json !== undefined ? JSON.stringify(op.json) : undefined })
  const d = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(d.error || d.detail || 'Error')
  return d
}

window.cargarProspectos = async function () {
  const content = document.getElementById('content')
  content.innerHTML = `<div style="margin-bottom:1rem"><p style="font-size:0.7rem;font-weight:700;letter-spacing:0.1em;color:#E91E8C;text-transform:uppercase;margin:0 0 3px">Renta del sistema</p>
    <h2 style="font-size:1.3rem;font-weight:800;margin:0">🧪 Interesados en rentar</h2>
    <p style="font-size:0.78rem;color:#64748b;margin:4px 0 0">Personas que dejaron sus datos para ver la demo en <a href="https://zapatillasmay.mx/vender#sistema" target="_blank" rel="noopener">zapatillasmay.mx/vender</a>. Escríbeles por WhatsApp y marca cómo va cada uno.</p></div>
    <div id="pros-cuerpo"><p style="color:#888">Cargando…</p></div>`
  try {
    _pros = await api('/demo/admin/prospectos')
    pintar()
  } catch (e) { document.getElementById('pros-cuerpo').innerHTML = `<p style="color:#dc2626">No se pudo cargar: ${esc(e.message)}</p>` }
}

function pintar() {
  const c = document.getElementById('pros-cuerpo'); if (!c) return
  if (!_pros.length) { c.innerHTML = '<p style="color:#94a3b8;padding:1rem">Todavía no hay interesados. Cuando alguien pida la demo aparece aquí y te llega una notificación.</p>'; return }
  c.innerHTML = `<div class="table-card"><table><thead><tr><th>Interesado</th><th>Negocio</th><th>Contacto</th><th>Estado</th><th>Notas</th><th>Cuándo</th></tr></thead><tbody>
    ${_pros.map(p => `<tr><td><strong>${esc(p.nombre)}</strong><br><span style="font-size:0.72rem;color:#94a3b8">${esc(p.email)}</span></td>
      <td style="font-size:0.8rem">${esc(p.negocio || '—')}<br><span style="color:#94a3b8">${esc(p.tipo_negocio || '')} ${esc(p.ciudad || '')}</span>${p.mensaje ? `<br><span style="color:#475569">«${esc(p.mensaje)}»</span>` : ''}</td>
      <td><a class="btn btn-secondary" style="font-size:0.74rem;padding:3px 10px;text-decoration:none" target="_blank" rel="noopener" href="https://wa.me/52${esc(p.whatsapp)}?text=${encodeURIComponent('Hola ' + p.nombre.split(' ')[0] + ', soy de Zapatillas May. Vi que quieres probar el sistema. ¿Te cuento cómo funciona?')}">💬 ${esc(p.whatsapp)}</a></td>
      <td><select class="form-input" style="font-size:0.78rem;padding:3px 6px" onchange="prosEstado('${esc(p.id)}', this.value)">${Object.entries(ETQ).map(([k, t]) => `<option value="${k}" ${p.estado === k ? 'selected' : ''}>${t[2]}</option>`).join('')}</select></td>
      <td><input class="form-input" style="font-size:0.78rem;padding:3px 6px;min-width:150px" value="${esc(p.notas_admin || '')}" placeholder="Nota…" onchange="prosNota('${esc(p.id)}', this.value)"></td>
      <td style="font-size:0.74rem;color:#64748b">${new Date(p.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}${p.demo_entro_at ? '<br>entró a la demo' : ''}</td></tr>`).join('')}</tbody></table></div>`
}
window.prosEstado = async (id, estado) => { try { await api('/demo/admin/prospectos/' + id, { method: 'PATCH', json: { estado } }); const p = _pros.find(x => x.id === id); if (p) p.estado = estado; badge() } catch (e) { alert(e.message) } }
window.prosNota = async (id, notas_admin) => { try { await api('/demo/admin/prospectos/' + id, { method: 'PATCH', json: { notas_admin } }) } catch (e) { alert(e.message) } }

async function badge() {
  if (!_esAdmin()) return   // solo con sesión de administrador: sin sesión el servidor responde 401 y el panel lo toma como «sesión expirada»
  try {
    const l = await api('/demo/admin/prospectos')
    const n = l.filter(p => p.estado === 'nuevo').length
    const b = document.getElementById('badge-prospectos')
    if (b) { b.textContent = n; b.style.display = n > 0 ? 'inline' : 'none' }
  } catch (e) {}
}
setTimeout(badge, 3500)
if (window._prosBadgeInt) clearInterval(window._prosBadgeInt)
window._prosBadgeInt = setInterval(badge, 180000)
