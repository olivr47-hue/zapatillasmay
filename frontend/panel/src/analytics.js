// ═══ Analítica (Google Analytics 4 + ventas reales del ERP) ═══════════════════════════════
// Sección rediseñada: filtro de periodo único, pestañas (Resumen · Productos · Canales · Clientas · Páginas · Embudo ·
// Perfil · Ventas y anuncios), tarjetas con cambio contra el periodo anterior y gráficas. Los datos salen de
// backend/routers/analytics.py; las ventas "reales" salen de los pedidos del ERP (no dependen del seguimiento de Google).
const API = '/api'
const esc = (v) => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

const COLOR = { rosa: '#E91E8C', azul: '#3483fa', verde: '#16a34a', morado: '#7c3aed', naranja: '#f59e0b', rojo: '#dc2626', gris: '#94a3b8', cian: '#0891b2' }
const PALETA = [COLOR.rosa, COLOR.azul, COLOR.morado, COLOR.verde, COLOR.naranja, COLOR.cian, COLOR.gris, '#ec4899']

const TABS = [
  { id: 'resumen', icono: '📈', nombre: 'Resumen' },
  { id: 'productos', icono: '👠', nombre: 'Productos' },
  { id: 'canales', icono: '🧭', nombre: 'Canales' },
  { id: 'clientas', icono: '💗', nombre: 'Clientas' },
  { id: 'paginas', icono: '📄', nombre: 'Páginas' },
  { id: 'embudo', icono: '🪜', nombre: 'Embudo' },
  { id: 'perfil', icono: '🧑‍🤝‍🧑', nombre: 'Perfil' },
  { id: 'ventas', icono: '💰', nombre: 'Ventas y anuncios' },
]
const PERIODOS = [{ d: 1, t: 'Hoy' }, { d: 7, t: '7 días' }, { d: 15, t: '15 días' }, { d: 30, t: '30 días' }, { d: 90, t: '90 días' }]

const S = { dias: 7, tab: 'resumen', canal: 'canal', metrica: 'sesiones', charts: {}, timer: null, gen: 0 }

// ── formato ──
const nf = (n) => (Number(n) || 0).toLocaleString('es-MX', { maximumFractionDigits: 0 })
const dinero = (n) => '$' + nf(n)
const pct = (n, d = 1) => (Number(n) || 0).toLocaleString('es-MX', { maximumFractionDigits: d }) + '%'
const dur = (s) => { s = Math.round(Number(s) || 0); return s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s` }
const chipCambio = (v, invertir = false) => {
  if (v == null) return '<span class="an-chip an-chip-n">sin base</span>'
  const bueno = invertir ? v < 0 : v > 0
  const cls = v === 0 ? 'an-chip-n' : (bueno ? 'an-chip-ok' : 'an-chip-mal')
  return `<span class="an-chip ${cls}">${v > 0 ? '▲' : v < 0 ? '▼' : '•'} ${Math.abs(v).toLocaleString('es-MX', { maximumFractionDigits: 1 })}%</span>`
}

// ── red ──
async function pedir(ruta) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 28000)
  try {
    const r = await fetch(`${API}/analytics/${ruta}`, { signal: ctrl.signal })
    const d = await r.json().catch(() => ({}))
    if (!r.ok) return { __error: d.detail || d.error || `Error ${r.status}` }
    if (d.configurado === false) return { __noconf: d }
    if (d.error) return { __error: d.error }
    return d
  } catch (e) {
    return { __error: e.name === 'AbortError' ? 'Google tardó demasiado en responder' : (e.message || 'Sin conexión') }
  } finally { clearTimeout(t) }
}

const vacio = (txt) => `<p class="an-vacio">${txt}</p>`
const falla = (d, reintentar = 'window._anTab(window._an.tab)') => d.__noconf
  ? `<div class="an-aviso an-aviso-warn"><b>Google Analytics no está configurado.</b><br>${esc(d.__noconf.mensaje || '')}</div>`
  : `<div class="an-aviso an-aviso-mal">No se pudo cargar: ${esc(d.__error)} <button class="an-btn-mini" onclick="${reintentar}">Reintentar</button></div>`
const tarjeta = (titulo, cuerpo, extra = '', cls = '') => `<div class="an-card ${cls}"><div class="an-card-h"><span>${titulo}</span>${extra}</div>${cuerpo}</div>`
const skel = (n = 3) => `<div class="an-grid">${Array.from({ length: n }, () => '<div class="an-skel"></div>').join('')}</div>`

function barra(valor, max, color = COLOR.azul) {
  const w = max ? Math.max(2, Math.min(100, valor / max * 100)) : 0
  return `<div class="an-bar"><i style="width:${w}%;background:${color}"></i></div>`
}

// ── gráficas (Chart.js ya viene cargado en el panel) ──
function grafica(id, cfg) {
  const c = document.getElementById(id)
  if (!c) return
  if (!window.Chart) { c.replaceWith(Object.assign(document.createElement('p'), { className: 'an-vacio', textContent: 'No se pudo cargar la librería de gráficas.' })); return }
  if (S.charts[id]) { try { S.charts[id].destroy() } catch (e) {} }
  S.charts[id] = new window.Chart(c, cfg)
}
const opcionesBase = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, interaction: { mode: 'index', intersect: false } }

// ═══════════════════════════════ estructura ═══════════════════════════════
window.cargarAnalitica = async function () {
  if (S.timer) { clearInterval(S.timer); S.timer = null }
  const content = document.getElementById('content')
  content.innerHTML = `
    <style>
      .an-wrap{padding:1.25rem 1.5rem;max-width:1180px;box-sizing:border-box}
      .an-head{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;flex-wrap:wrap;margin-bottom:1rem}
      .an-titulo{margin:0;font-size:1.35rem;font-weight:800;letter-spacing:-0.3px}
      .an-sub{margin:2px 0 0;color:#888;font-size:0.82rem}
      .an-pills{display:flex;gap:4px;background:#f1f1f4;border-radius:999px;padding:3px}
      .an-pill{border:none;background:transparent;border-radius:999px;padding:6px 14px;font-size:0.8rem;font-weight:600;color:#666;cursor:pointer;font-family:inherit}
      .an-pill.on{background:#fff;color:#E91E8C;box-shadow:0 1px 4px rgba(0,0,0,.12)}
      .an-live{display:flex;align-items:center;gap:14px;flex-wrap:wrap;background:linear-gradient(135deg,#1f1633,#3b1d4a);color:#fff;border-radius:16px;padding:12px 18px;margin-bottom:1rem}
      .an-dot{width:10px;height:10px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 0 rgba(34,197,94,.7);animation:anp 1.8s infinite}
      @keyframes anp{70%{box-shadow:0 0 0 10px rgba(34,197,94,0)}100%{box-shadow:0 0 0 0 rgba(34,197,94,0)}}
      .an-live b{font-size:1.5rem;line-height:1}
      .an-live small{color:#d8c9e6;font-size:0.75rem}
      .an-tabs{display:flex;gap:4px;overflow-x:auto;border-bottom:1px solid #eee;margin-bottom:1.1rem;padding-bottom:0;scrollbar-width:none}
      .an-tabs::-webkit-scrollbar{display:none}
      .an-tab{flex:0 0 auto;border:none;background:none;padding:10px 14px;font-size:0.84rem;font-weight:600;color:#777;cursor:pointer;border-bottom:3px solid transparent;font-family:inherit;white-space:nowrap}
      .an-tab.on{color:#E91E8C;border-bottom-color:#E91E8C}
      .an-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin-bottom:1rem}
      .an-g2{display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:14px;margin-bottom:1rem}
      .an-kpi{background:#fff;border:1px solid #eee;border-radius:16px;padding:14px 16px;box-shadow:0 1px 3px rgba(0,0,0,.04)}
      .an-kpi-l{font-size:0.72rem;font-weight:700;color:#8a8a99;text-transform:uppercase;letter-spacing:.05em}
      .an-kpi-v{font-size:1.65rem;font-weight:800;margin:4px 0 6px;line-height:1.1;letter-spacing:-0.5px}
      .an-kpi-s{font-size:0.72rem;color:#999;margin-left:6px}
      .an-card{background:#fff;border:1px solid #eee;border-radius:16px;padding:16px;box-shadow:0 1px 3px rgba(0,0,0,.04);min-width:0}
      .an-card-h{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:12px;font-size:0.78rem;font-weight:800;color:#555;text-transform:uppercase;letter-spacing:.05em}
      .an-chip{display:inline-block;border-radius:999px;padding:2px 9px;font-size:0.72rem;font-weight:700;white-space:nowrap}
      .an-chip-ok{background:#dcfce7;color:#166534}.an-chip-mal{background:#fee2e2;color:#991b1b}.an-chip-n{background:#f1f1f4;color:#777}.an-chip-warn{background:#fef3c7;color:#92400e}
      .an-tabla{width:100%;border-collapse:collapse;font-size:0.82rem}
      .an-tabla th{text-align:left;font-size:0.68rem;color:#999;text-transform:uppercase;letter-spacing:.05em;padding:6px 8px;border-bottom:1px solid #eee;white-space:nowrap}
      .an-tabla td{padding:8px;border-bottom:1px solid #f5f5f7;vertical-align:middle}
      .an-tabla .num{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
      .an-scroll{overflow-x:auto}
      .an-bar{background:#f0f0f4;border-radius:6px;height:8px;min-width:60px;overflow:hidden}.an-bar i{display:block;height:100%;border-radius:6px}
      .an-vacio{color:#aaa;font-size:0.84rem;margin:0;padding:10px 0;text-align:center}
      .an-aviso{border-radius:12px;padding:12px 16px;font-size:0.85rem;margin-bottom:1rem}
      .an-aviso-warn{background:#fffbeb;color:#92400e;border:1px solid #fde68a}.an-aviso-mal{background:#fef2f2;color:#991b1b;border:1px solid #fecaca}.an-aviso-ok{background:#f0fdf4;color:#166534;border:1px solid #bbf7d0}.an-aviso-info{background:#eff6ff;color:#1e40af;border:1px solid #bfdbfe}
      .an-btn-mini{margin-left:8px;border:1px solid currentColor;background:transparent;color:inherit;border-radius:8px;padding:2px 10px;font-size:0.75rem;cursor:pointer;font-family:inherit}
      .an-skel{height:92px;border-radius:16px;background:linear-gradient(90deg,#f1f1f4 25%,#fafafc 50%,#f1f1f4 75%);background-size:200% 100%;animation:ans 1.2s infinite}
      @keyframes ans{to{background-position:-200% 0}}
      .an-seg{display:inline-flex;background:#f1f1f4;border-radius:10px;padding:3px;gap:2px;flex-wrap:wrap}
      .an-seg button{border:none;background:transparent;border-radius:8px;padding:5px 12px;font-size:0.78rem;font-weight:600;color:#666;cursor:pointer;font-family:inherit}
      .an-seg button.on{background:#fff;color:#E91E8C;box-shadow:0 1px 3px rgba(0,0,0,.12)}
      .an-graf{position:relative;height:250px}.an-graf-s{position:relative;height:200px}
      .an-lista-i{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid #f5f5f7;font-size:0.83rem}
      .an-lista-i:last-child{border-bottom:none}
      .an-emb{display:flex;align-items:center;gap:12px;margin-bottom:10px}
      .an-emb-b{height:42px;border-radius:10px;display:flex;align-items:center;padding:0 14px;color:#fff;font-weight:700;font-size:0.88rem;min-width:70px;transition:width .5s}
      .an-pill,.an-btn-mini{white-space:nowrap}
      @media(max-width:700px){.an-wrap{padding:0.9rem}.an-kpi-v{font-size:1.35rem}.an-g2{grid-template-columns:1fr !important}.an-grid{grid-template-columns:repeat(2,1fr);gap:10px}.an-hide-m{display:none}.an-pill{padding:6px 10px;font-size:0.75rem}.an-pills{width:100%;justify-content:space-between}.an-head>div:last-child{width:100%}.an-live{padding:10px 14px}}
    </style>
    <div class="an-wrap">
      <div class="an-head">
        <div><h2 class="an-titulo">📊 Analítica</h2><p class="an-sub">Qué pasa en tu tienda: visitas, productos, de dónde llegan y cuánto venden. <span id="an-act"></span></p></div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          <div class="an-pills" id="an-pills">${PERIODOS.map(p => `<button class="an-pill ${p.d === S.dias ? 'on' : ''}" data-d="${p.d}" onclick="window._anPeriodo(${p.d})">${p.t}</button>`).join('')}</div>
          <button class="an-btn-mini" style="color:#666" onclick="window._anTab(window._an.tab, true)">↻<span class="an-hide-m"> Actualizar</span></button>
        </div>
      </div>
      <div class="an-live" id="an-live"><span class="an-dot"></span><span><b id="an-activos">—</b> <small>activos ahora (últimos 30 min)</small></span><small id="an-live-det"></small><div id="an-live-pag" style="flex-basis:100%;font-size:0.74rem;color:rgba(255,255,255,0.75);margin-top:4px"></div></div>
      <div class="an-tabs" id="an-tabs">${TABS.map(t => `<button class="an-tab ${t.id === S.tab ? 'on' : ''}" data-t="${t.id}" onclick="window._anTab('${t.id}')">${t.icono} ${t.nombre}</button>`).join('')}</div>
      <div id="an-body"></div>
    </div>`
  window._an = S
  vivo()
  S.timer = setInterval(() => { if (!document.hidden && document.getElementById('an-activos')) vivo(); else if (!document.getElementById('an-activos')) { clearInterval(S.timer); S.timer = null } }, 30000)
  window._anTab(S.tab)
}

async function vivo() {
  const d = await pedir('tiempo-real')
  const a = document.getElementById('an-activos')
  if (!a) return
  if (d.__error || d.__noconf) { a.textContent = '—'; return }
  a.textContent = nf(d.activos_ahora)
  const disp = Object.entries(d.por_dispositivo || {}).map(([k, v]) => `${k === 'mobile' ? '📱 Celular' : k === 'desktop' ? '💻 Computadora' : k === 'tablet' ? '📲 Tablet' : '❔ ' + k} ${v}`).join('  ')
  const pais = (d.por_pais || [])[0]
  const det = document.getElementById('an-live-det')
  const donde = (d.en_portal != null) ? `🛍️ Tienda: ${d.en_sitio}   ·   🤝 Portal mayoristas: ${d.en_portal}` : ''
  if (det) det.textContent = [donde, disp, pais ? `🌎 ${pais.pais}: ${pais.activos}` : ''].filter(Boolean).join('   ·   ')
  const pag = document.getElementById('an-live-pag')
  if (pag) {
    const nombre = (r) => { const t = String(r || '/').split('?')[0]; return t === '/' ? 'Inicio de la tienda' : t.startsWith('/portal-mayoreo') ? 'Portal · ' + (t.split('/')[2] || 'inicio') : t.replace(/^\/(producto\/)?/, '').replace(/-/g, ' ') }
    pag.textContent = (d.paginas || []).length ? 'Viendo ahora: ' + d.paginas.slice(0, 5).map(x => `${nombre(x.pagina)} (${x.activos})`).join('  ·  ') : (d.desglose_error ? 'No se pudieron ver las páginas: ' + String(d.desglose_error).slice(0, 140) : (d.activos_ahora ? 'Google no reporta las páginas en este momento' : ''))
  }
}

window._anPeriodo = (d) => {
  S.dias = d
  document.querySelectorAll('#an-pills .an-pill').forEach(b => b.classList.toggle('on', Number(b.dataset.d) === d))
  window._anTab(S.tab)
}

window._anTab = async (tab, forzar) => {
  S.tab = tab
  const gen = ++S.gen
  document.querySelectorAll('#an-tabs .an-tab').forEach(b => b.classList.toggle('on', b.dataset.t === tab))
  const body = document.getElementById('an-body')
  if (!body) return
  body.innerHTML = skel(4)
  Object.keys(S.charts).forEach(k => { try { S.charts[k].destroy() } catch (e) {} delete S.charts[k] })
  try {
    const fn = { resumen: tabResumen, productos: tabProductos, canales: tabCanales, clientas: tabClientas, paginas: tabPaginas, embudo: tabEmbudo, perfil: tabPerfil, ventas: tabVentas }[tab]
    const html = await fn(forzar)
    if (gen !== S.gen) return           // el usuario ya cambió de pestaña o de periodo
    body.innerHTML = html.html
    if (html.despues) html.despues()
    const a = document.getElementById('an-act')
    if (a) a.textContent = 'Actualizado ' + new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
  } catch (e) {
    if (gen === S.gen) body.innerHTML = `<div class="an-aviso an-aviso-mal">Algo falló al dibujar esta pestaña: ${esc(e.message)}</div>`
  }
}

// ═══════════════════════════════ pestañas ═══════════════════════════════
async function tabResumen() {
  const dias = S.dias
  const [r, serie, hor, ciu, ia, por] = await Promise.all([
    pedir(`resumen?dias=${dias}`), pedir(`serie?dias=${Math.max(dias, 7)}`), pedir('horario'), pedir('ciudades'), pedir(`ia-referrals?dias=${dias}`), pedir('portal-visitas'),
  ])
  if (r.__error || r.__noconf) return { html: falla(r) }
  const a = r.actual, c = r.cambio_pct
  const kpi = (l, v, ch, sub = '', inv = false) => `<div class="an-kpi"><div class="an-kpi-l">${l}</div><div class="an-kpi-v">${v}</div>${chipCambio(ch, inv)}<span class="an-kpi-s">${sub}</span></div>`
  const tx = a.sessions ? `${pct(a.conversion, 2)} de las visitas termina en compra` : ''
  const insight = (() => {
    const partes = []
    if (c.sessions != null) partes.push(`Las visitas ${c.sessions >= 0 ? 'subieron' : 'bajaron'} ${Math.abs(c.sessions)}% contra el periodo anterior.`)
    if (a.transactions) partes.push(`Hubo ${nf(a.transactions)} compra(s) por ${dinero(a.purchaseRevenue)} (ticket promedio ${dinero(a.ticket)}).`)
    else partes.push('Todavía no hay compras registradas por Google en este periodo.')
    if (tx) partes.push(tx + '.')
    return partes.join(' ')
  })()
  const html = `
    <div class="an-aviso an-aviso-info">${esc(insight)}</div>
    <div class="an-grid">
      ${kpi('Visitas (sesiones)', nf(a.sessions), c.sessions)}
      ${kpi('Personas', nf(a.activeUsers), c.activeUsers, `${nf(a.newUsers)} nuevas`)}
      ${kpi('Compras', nf(a.transactions), c.transactions)}
      ${kpi('Ingresos', dinero(a.purchaseRevenue), c.purchaseRevenue)}
      ${kpi('Conversión', pct(a.conversion, 2), c.conversion)}
      ${kpi('Ticket promedio', dinero(a.ticket), c.ticket)}
      ${kpi('Ingreso por visita', dinero(a.ingreso_por_sesion), c.ingreso_por_sesion)}
      ${kpi('Interacción', pct(a.engagementRate * 100), c.engagementRate, dur(a.averageSessionDuration) + ' por visita')}
    </div>
    ${tarjeta('Tendencia', `<div class="an-seg" id="an-met" style="margin-bottom:10px">${[['sesiones', 'Visitas'], ['usuarios', 'Personas'], ['compras', 'Compras'], ['ingreso', 'Ingresos']].map(([k, t]) => `<button class="${S.metrica === k ? 'on' : ''}" onclick="window._anMetrica('${k}')">${t}</button>`).join('')}</div><div class="an-graf"><canvas id="an-g-serie"></canvas></div>`)}
    <div class="an-g2" style="margin-top:14px">
      ${tarjeta('Horario de visitas (7 días)', hor.__error ? falla(hor) : `<div class="an-graf-s"><canvas id="an-g-hor"></canvas></div><p class="an-sub" id="an-pico"></p>`)}
      ${tarjeta('De dónde son (7 días)', ciu.__error ? falla(ciu) : listaCiudades(ciu))}
    </div>
    <div class="an-g2">
      ${tarjeta(`🤖 Llegan desde asistentes de IA (${dias === 1 ? 'hoy' : dias + ' días'})`, ia.__error ? falla(ia) : listaIA(ia))}
      ${tarjeta('🛍️ Portal de mayoristas (30 días)', por.__error ? falla(por) : `<div class="an-kpi-v">${nf(por.total_sesiones)} <span class="an-kpi-s">visitas</span></div>${(por.dias || []).length ? '<div class="an-graf-s"><canvas id="an-g-portal"></canvas></div>' : vacio('Sin visitas al portal en 30 días')}`)}
    </div>`
  const despues = () => {
    S._serie = serie.__error ? null : serie.serie
    dibujarSerie()
    if (!hor.__error) {
      const h = hor.horas || [], max = Math.max(...h.map(x => x.sesiones), 1), pico = h.find(x => x.sesiones === max)
      grafica('an-g-hor', { type: 'bar', data: { labels: h.map(x => x.hora.replace(':00', '')), datasets: [{ data: h.map(x => x.sesiones), backgroundColor: h.map(x => x.sesiones === max ? COLOR.rosa : 'rgba(52,131,250,.5)'), borderRadius: 4 }] },
        options: { ...opcionesBase, scales: { y: { beginAtZero: true, ticks: { precision: 0 } }, x: { ticks: { font: { size: 10 } } } } } })
      const el = document.getElementById('an-pico'); if (el && pico && max > 1) el.textContent = `Hora con más visitas: ${pico.hora} — buen momento para publicar o mandar avisos.`
    }
    if (!por.__error && (por.dias || []).length) {
      const d = por.dias
      grafica('an-g-portal', { type: 'line', data: { labels: d.map(x => String(x.fecha).slice(6, 8) + '/' + String(x.fecha).slice(4, 6)), datasets: [{ data: d.map(x => x.sesiones), borderColor: COLOR.morado, backgroundColor: 'rgba(124,58,237,.12)', fill: true, tension: .35, pointRadius: 2 }] }, options: opcionesBase })
    }
  }
  return { html, despues }
}

function dibujarSerie() {
  const s = S._serie
  if (!s) return
  const k = S.metrica, etiqueta = { sesiones: 'Visitas', usuarios: 'Personas', compras: 'Compras', ingreso: 'Ingresos' }[k]
  const color = { sesiones: COLOR.azul, usuarios: COLOR.verde, compras: COLOR.rosa, ingreso: COLOR.morado }[k]
  const rec = S.dias === 1 ? s.slice(-7) : s.slice(-Math.max(S.dias, 7))
  grafica('an-g-serie', { type: k === 'compras' ? 'bar' : 'line', data: { labels: rec.map(x => x.fecha.slice(8, 10) + '/' + x.fecha.slice(5, 7)),
    datasets: [{ label: etiqueta, data: rec.map(x => x[k]), borderColor: color, backgroundColor: k === 'compras' ? color : color + '22', fill: k !== 'compras', tension: .35, pointRadius: rec.length > 40 ? 0 : 3, borderRadius: 5 }] },
    options: { ...opcionesBase, scales: { y: { beginAtZero: true, ticks: { precision: 0, callback: (v) => k === 'ingreso' ? '$' + nf(v) : v } } } } })
}
window._anMetrica = (k) => {
  S.metrica = k
  document.querySelectorAll('#an-met button').forEach(b => b.classList.toggle('on', b.textContent === { sesiones: 'Visitas', usuarios: 'Personas', compras: 'Compras', ingreso: 'Ingresos' }[k]))
  dibujarSerie()
}

function listaCiudades(d) {
  const c = (d.ciudades || []); const max = Math.max(...c.map(x => x.sesiones), 1)
  return c.length ? c.slice(0, 8).map(x => `<div class="an-lista-i"><span style="flex:1">${esc(x.ciudad)} <small style="color:#aaa">${esc(x.region)}</small></span>${barra(x.sesiones, max, COLOR.verde)}<b style="min-width:34px;text-align:right">${nf(x.sesiones)}</b></div>`).join('') : vacio('Sin datos de ciudades')
}
function listaIA(d) {
  const r = d.referencias || []
  if (!r.length) return vacio('Aún no llegan visitas desde ChatGPT, Perplexity o Gemini')
  const por = {}
  r.forEach(x => { por[x.source] = (por[x.source] || 0) + x.sesiones })
  const max = Math.max(...r.map(x => x.sesiones), 1)
  // Cada fila = una página que recomienda la IA (a dónde llegan las visitas), con la fuente y cuántas visitas trae
  const paginas = r.slice(0, 15).map(x => {
    const ruta = String(x.landing_page || '/')
    const url = 'https://zapatillasmay.mx' + (ruta.startsWith('/') ? ruta : '/' + ruta)
    const nombre = ruta === '/' ? 'Inicio' : (() => { const t = ruta.replace(/^\/(producto\/)?/, '').split('?')[0]; try { return decodeURIComponent(t) } catch (e) { return t } })().replace(/-/g, ' ')
    return `<div class="an-lista-i"><a href="${esc(url)}" target="_blank" rel="noopener" style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:inherit;text-decoration:none" title="${esc(ruta)}">${esc(nombre)}</a><span class="an-chip">${esc(x.source)}</span>${barra(x.sesiones, max, COLOR.verde)}<b>${nf(x.sesiones)}</b></div>`
  }).join('')
  const dias = d.por_dia || []
  const maxD = Math.max(...dias.map(x => x.sesiones), 1)
  const fechaCorta = (f) => { const t = String(f); return t.length === 8 ? `${t.slice(6, 8)}/${t.slice(4, 6)}` : t }
  const porDia = dias.length > 1
    ? `<p class="an-sub" style="margin:12px 0 6px;font-weight:700">Por día</p>` + dias.map(x => `<div class="an-lista-i"><span style="width:48px;flex:none">${fechaCorta(x.fecha)}</span>${barra(x.sesiones, maxD, COLOR.morado)}<b>${nf(x.sesiones)}</b></div>`).join('')
    : ''
  return `<div class="an-kpi-v">${nf(d.total_sesiones)} <span class="an-kpi-s">visitas</span></div>`
    + Object.entries(por).sort((a, b) => b[1] - a[1]).map(([s, n]) => `<div class="an-lista-i"><span>${esc(s)}</span><b>${nf(n)}</b></div>`).join('')
    + `<p class="an-sub" style="margin:12px 0 6px;font-weight:700">Páginas que está recomendando (${r.length > 15 ? 'las 15 con más visitas' : r.length + ' en total'})</p>`
    + paginas
    + porDia
}

// ── Productos ──
async function tabProductos() {
  const [p, b] = await Promise.all([pedir(`productos?dias=${Math.max(S.dias, 7)}`), pedir(`busquedas?dias=${Math.max(S.dias, 7)}`)])
  if (p.__error || p.__noconf) return { html: falla(p) }
  const lista = p.productos || [], al = p.alertas || {}
  const maxV = Math.max(...lista.map(x => x.vistas), 1)
  const caja = (titulo, items, vacioTxt, formato) => tarjeta(titulo, items.length ? items.map(x => `<div class="an-lista-i"><span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis">${esc(x.modelo)}</span>${formato(x)}</div>`).join('') : vacio(vacioTxt))
  const html = `
    <div class="an-aviso an-aviso-info">Se calcula con lo que registra tu tienda al ver un modelo, agregarlo al carrito y comprarlo (${Math.max(S.dias, 7)} días).</div>
    <div class="an-g2">
      ${caja('🛒 Se agregan y no se compran', al.se_agrega_no_se_compra || [], 'Ninguno por ahora 🎉', x => `<span class="an-chip an-chip-warn">${x.carrito} al carrito · 0 compras</span>`)}
      ${caja('👀 Se ven mucho y nadie los agrega', al.se_ve_no_se_agrega || [], 'Ninguno por ahora 🎉', x => `<span class="an-chip an-chip-mal">${nf(x.vistas)} vistas · 0 al carrito</span>`)}
      ${caja('⭐ Los que mejor funcionan', al.mejores || [], 'Aún no hay suficientes datos', x => `<span class="an-chip an-chip-ok">${x.compras} compra(s) · ${pct(x.pct_carrito, 0)} al carrito</span>`)}
      ${tarjeta('🔎 Lo que buscan en tu tienda', b.__error ? falla(b) : listaBusquedas(b))}
    </div>
    ${tarjeta('Todos los modelos', lista.length ? `<div class="an-scroll"><table class="an-tabla"><thead><tr><th>Modelo</th><th class="num">Vistas</th><th>Se ve</th><th class="num">Al carrito</th><th class="num">Compras</th><th class="num">Ingreso</th></tr></thead><tbody>
      ${lista.map(x => `<tr><td style="max-width:260px;overflow:hidden;text-overflow:ellipsis">${esc(x.modelo)}</td><td class="num">${nf(x.vistas)}</td><td style="min-width:90px">${barra(x.vistas, maxV)}</td><td class="num">${nf(x.carrito)} <small style="color:#aaa">${pct(x.pct_carrito, 0)}</small></td><td class="num">${nf(x.compras)}</td><td class="num">${x.ingreso ? dinero(x.ingreso) : '—'}</td></tr>`).join('')}</tbody></table></div>` : vacio('Todavía no hay datos de productos en este periodo'))}`
  return { html }
}
function listaBusquedas(b) {
  const t = b.terminos || []
  if (!t.length) return vacio('Aún no hay búsquedas registradas. Se empezaron a registrar el 4 de octubre; en unos días verás aquí lo que escribe la gente.')
  const sin = (b.sin_resultados || [])
  return (sin.length ? `<div class="an-aviso an-aviso-warn" style="padding:8px 12px;font-size:0.8rem">Buscaron y <b>no tienes</b>: ${sin.slice(0, 6).map(x => `<b>${esc(x.termino)}</b> (${x.busquedas})`).join(', ')}</div>` : '')
    + t.slice(0, 10).map(x => `<div class="an-lista-i"><span style="flex:1">${esc(x.termino)}</span>${x.sin_resultados ? '<span class="an-chip an-chip-mal">sin resultados</span>' : (x.modelos != null ? `<span class="an-chip an-chip-n">${x.modelos} modelo(s)</span>` : '')}<b>${nf(x.busquedas)}</b></div>`).join('')
}

// ── Canales ──
async function tabCanales() {
  const d = await pedir(`canales?dias=${S.dias}&por=${S.canal}`)
  const seg = `<div class="an-seg" style="margin-bottom:14px">${[['canal', 'Canal'], ['fuente', 'Fuente'], ['campana', 'Campaña'], ['dispositivo', 'Dispositivo']].map(([k, t]) => `<button class="${S.canal === k ? 'on' : ''}" onclick="window._anCanal('${k}')">${t}</button>`).join('')}</div>`
  if (d.__error || d.__noconf) return { html: seg + falla(d) }
  const f = d.filas || []
  if (!f.length) return { html: seg + vacio('Sin datos en este periodo' + (S.canal === 'campana' ? ' (solo cuentan visitas que llegan con campaña etiquetada)' : '')) }
  const maxC = Math.max(...f.map(x => x.conversion), 0.01), tot = f.reduce((s, x) => s + x.sesiones, 0) || 1
  const mejor = [...f].filter(x => x.sesiones >= 10).sort((a, b) => b.ingreso_por_sesion - a.ingreso_por_sesion)[0]
  const html = seg
    + (mejor && mejor.ingreso_por_sesion > 0 ? `<div class="an-aviso an-aviso-ok">Lo que más deja por visita: <b>${esc(mejor.nombre)}</b> (${dinero(mejor.ingreso_por_sesion)} por visita, conversión ${pct(mejor.conversion, 2)}).</div>` : '')
    + `<div class="an-g2" style="grid-template-columns:minmax(260px,1fr) 2fr">
      ${tarjeta('Reparto de visitas', `<div class="an-graf-s"><canvas id="an-g-canal"></canvas></div>`)}
      ${tarjeta(esc(d.etiqueta), `<div class="an-scroll"><table class="an-tabla"><thead><tr><th>${esc(d.etiqueta)}</th><th class="num">Visitas</th><th>Conversión</th><th class="num">Compras</th><th class="num">Ingresos</th><th class="num">Por visita</th><th class="num">Ticket</th></tr></thead><tbody>
        ${f.map(x => `<tr><td style="max-width:220px;overflow:hidden;text-overflow:ellipsis">${esc(x.nombre)}</td><td class="num">${nf(x.sesiones)} <small style="color:#aaa">${pct(x.sesiones / tot * 100, 0)}</small></td><td style="min-width:110px">${barra(x.conversion, maxC, COLOR.verde)}<small style="color:#888">${pct(x.conversion, 2)}</small></td><td class="num">${nf(x.compras)}</td><td class="num">${x.ingreso ? dinero(x.ingreso) : '—'}</td><td class="num">${x.ingreso_por_sesion ? dinero(x.ingreso_por_sesion) : '—'}</td><td class="num">${x.ticket ? dinero(x.ticket) : '—'}</td></tr>`).join('')}</tbody></table></div>`)}
    </div>`
    + tarjeta('🧾 Quién llegó (hora, ciudad, de dónde vino y qué vio)', '<div id="an-quien">Cargando…</div>')
  return { html, despues: () => { cargarQuien(); return grafica('an-g-canal', { type: 'doughnut', data: { labels: f.slice(0, 8).map(x => x.nombre), datasets: [{ data: f.slice(0, 8).map(x => x.sesiones), backgroundColor: PALETA, borderWidth: 2 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '62%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } } } } }) } }
}
window._anCanal = (k) => { S.canal = k; window._anTab('canales') }

// ── "Quién llegó": detalle de visitas (hora, ciudad, de dónde vino y qué páginas vio) ──
async function cargarQuien() {
  const caja = document.getElementById('an-quien')
  if (!caja) return
  const d = await pedir(`visitas-detalle?dias=${Math.min(S.dias, 7)}`)
  if (!document.getElementById('an-quien')) return
  if (d.__error || d.__noconf) { caja.innerHTML = falla(d); return }
  const v = d.visitas || []
  if (!v.length) { caja.innerHTML = vacio('Sin visitas en este periodo'); return }
  const hora = (t) => `${String(t).slice(8, 10)}:${String(t).slice(10, 12)}`
  const dia = (t) => `${String(t).slice(6, 8)}/${String(t).slice(4, 6)}`
  const origen = (x) => x.fuente === '(direct)' ? 'Directo (escribió la dirección o abrió un enlace de WhatsApp)' : x.fuente === '(not set)' ? 'Sin dato' : `${x.fuente} · ${x.medio}`
  const pag = (p) => p === '/' || !p ? 'Inicio' : String(p).replace(/^\//, '').replace(/-/g, ' ').slice(0, 38)
  caja.innerHTML = `<div class="an-scroll"><table class="an-tabla"><thead><tr><th>Cuándo</th><th>Ciudad</th><th>De dónde vino</th><th>Páginas</th></tr></thead><tbody>${
    v.map(x => `<tr><td style="white-space:nowrap">${dia(x.fecha)} ${hora(x.desde)}${x.hasta !== x.desde ? '–' + hora(x.hasta) : ''}</td><td>${esc(x.ciudad === '(not set)' ? x.region : x.ciudad)} <small style="color:#aaa">${esc(x.dispositivo === 'mobile' ? '📱' : x.dispositivo === 'desktop' ? '💻' : x.dispositivo)}</small></td><td>${esc(origen(x))}</td><td style="max-width:260px;overflow:hidden;text-overflow:ellipsis">${esc(x.paginas.map(pag).join(' → '))}</td></tr>`).join('')
  }</tbody></table></div><p class="an-sub" style="margin-top:8px">Cada fila es una persona aproximada (mismo día, ciudad, dispositivo y origen). La hora es la de México. Útil para ubicar de dónde llegó alguien que te escribió por WhatsApp.</p>`
}

// ── Clientas ──
async function tabClientas() {
  const d = await pedir(`clientas?dias=${S.dias}`)
  if (d.__error || d.__noconf) return { html: falla(d) }
  const g = d.grupos || []
  if (!g.length) return { html: vacio('Sin datos en este periodo') }
  const nuevas = g.find(x => x.clave === 'new'), rec = g.find(x => x.clave === 'returning')
  const col = (x, color) => !x ? vacio('Sin datos') : `<div class="an-kpi-v" style="color:${color}">${nf(x.usuarios)} <span class="an-kpi-s">personas · ${pct(x.pct_usuarios, 0)}</span></div>
    ${[['Visitas', nf(x.sesiones)], ['Páginas por visita', x.paginas_por_sesion], ['Tiempo por visita', dur(x.duracion_s)], ['Interacción', pct(x.interaccion)], ['Compras', nf(x.compras)], ['Ingresos', dinero(x.ingreso)], ['Conversión', pct(x.conversion, 2)]].map(([k, v]) => `<div class="an-lista-i"><span style="color:#777">${k}</span><b>${v}</b></div>`).join('')}`
  const lectura = nuevas && rec ? (rec.conversion > nuevas.conversion * 1.5
    ? 'Las clientas que regresan compran bastante más que las nuevas: vale la pena invertir en que regresen (avisos, ofertas para quien ya compró).'
    : (nuevas.pct_usuarios > 80 ? 'Casi todas tus visitas son clientas nuevas: la tienda atrae, pero pocas regresan. Ayudan los avisos de novedades y el correo de carrito abandonado.' : 'Hay un buen equilibrio entre clientas nuevas y recurrentes.')) : ''
  return { html: (lectura ? `<div class="an-aviso an-aviso-info">${esc(lectura)}</div>` : '')
    + `<div class="an-g2">${tarjeta('💗 Clientas nuevas', col(nuevas, COLOR.rosa))}${tarjeta('🔁 Clientas que regresan', col(rec, COLOR.azul))}</div>`
    + `<div class="an-aviso an-aviso-warn" style="font-size:0.8rem">Google no entrega "cada cuántos días regresan"; aquí se muestra cuántas son nuevas, cuántas recurrentes y cómo compran. Para clientas que ya te compraron, mira la sección Clientes del panel.</div>` }
}

// ── Páginas ──
async function tabPaginas() {
  const d = await pedir(`paginas?dias=${S.dias}`)
  if (d.__error || d.__noconf) return { html: falla(d) }
  const ent = d.entrada || [], vis = d.vistas || []
  const chipRebote = (r) => `<span class="an-chip ${r > 65 ? 'an-chip-mal' : r > 45 ? 'an-chip-warn' : 'an-chip-ok'}">${pct(r, 0)} se va</span>`
  const html = `<div class="an-g2" style="grid-template-columns:1fr">
    ${tarjeta('Por dónde entran (primera página que ven)', ent.length ? `<div class="an-scroll"><table class="an-tabla"><thead><tr><th>Página</th><th class="num">Entradas</th><th>Rebote</th><th class="num">Compras</th><th class="num">Ingresos</th></tr></thead><tbody>${ent.map(x => `<tr><td style="max-width:360px;overflow:hidden;text-overflow:ellipsis">${esc(x.pagina)}</td><td class="num">${nf(x.sesiones)}</td><td>${chipRebote(x.rebote)}</td><td class="num">${nf(x.compras)}</td><td class="num">${x.ingreso ? dinero(x.ingreso) : '—'}</td></tr>`).join('')}</tbody></table></div><p class="an-sub" style="margin-top:8px">"Rebote" = visitas que entraron y se fueron sin hacer nada más. Si una página con muchas entradas tiene mucho rebote, conviene revisarla.</p>` : vacio('Sin datos'))}
    ${tarjeta('Las más vistas', vis.length ? `<div class="an-scroll"><table class="an-tabla"><thead><tr><th>Página</th><th class="num">Vistas</th><th class="num">Personas</th><th class="num">Tiempo promedio</th></tr></thead><tbody>${vis.map(x => `<tr><td style="max-width:360px;overflow:hidden;text-overflow:ellipsis">${esc(x.pagina)}</td><td class="num">${nf(x.vistas)}</td><td class="num">${nf(x.usuarios)}</td><td class="num">${dur(x.tiempo_s)}</td></tr>`).join('')}</tbody></table></div><p class="an-sub" style="margin-top:8px">Google no entrega "páginas de salida" en su informe estándar; las de entrada de arriba son lo más cercano.</p>` : vacio('Sin datos'))}
  </div>`
  return { html }
}

// ── Embudo ──
async function tabEmbudo() {
  const d = await pedir(`embudo?dias=${S.dias === 1 ? 1 : S.dias}`)
  if (d.__error || d.__noconf) return { html: falla(d) }
  const pasos = d.pasos || [], base = Math.max(pasos[0]?.eventos || 0, 1)
  if (!pasos.some(x => x.eventos)) return { html: vacio('Sin datos de embudo en este periodo') }
  const colores = [COLOR.azul, COLOR.morado, COLOR.naranja, COLOR.verde]
  let peor = null
  const filas = pasos.map((p, i) => {
    const prev = i ? pasos[i - 1].eventos : null
    const paso = prev ? (p.eventos / prev * 100) : 100
    if (prev && prev > 0 && (!peor || paso < peor.paso)) peor = { de: pasos[i - 1].etiqueta, a: p.etiqueta, paso }
    return `<div class="an-emb"><div style="flex:1"><div class="an-emb-b" style="width:${Math.max(10, p.eventos / base * 100)}%;background:${colores[i]}">${nf(p.eventos)}</div></div>
      <div style="width:210px;font-size:0.84rem"><b>${esc(p.etiqueta)}</b><br><span style="color:#888">${pct(p.pct_del_total)} de quienes vieron${prev ? ` · pasa ${pct(paso, 0)} del anterior` : ''}</span></div></div>`
  }).join('')
  return { html: (peor ? `<div class="an-aviso an-aviso-info">Donde más se cae la gente: de <b>${esc(peor.de)}</b> a <b>${esc(peor.a)}</b> (solo pasa el ${pct(peor.paso, 0)}).</div>` : '')
    + tarjeta('Embudo de compra', filas + '<p class="an-sub">Cuenta eventos (no personas únicas): sirve para ver en qué escalón se cae más la gente.</p>') }
}

// ── Perfil: tecnología + demografía + dispositivos ──
async function tabPerfil() {
  const [t, dm, disp] = await Promise.all([pedir(`tecnologia?dias=${Math.max(S.dias, 7)}`), pedir(`demografia?dias=${Math.max(S.dias, 30)}`), pedir(`canales?dias=${S.dias}&por=dispositivo`)])
  const lista = (titulo, items, color) => tarjeta(titulo, (items || []).length ? (() => { const max = Math.max(...items.map(x => x.sesiones ?? x.usuarios), 1); return items.map(x => `<div class="an-lista-i"><span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis">${esc(x.nombre)}</span>${barra(x.sesiones ?? x.usuarios, max, color)}<b style="min-width:42px;text-align:right">${nf(x.sesiones ?? x.usuarios)}</b></div>`).join('') })() : vacio('Sin datos'))
  const dispHtml = disp.__error || disp.__noconf ? falla(disp) : tarjeta('📱 Dispositivo', `<div class="an-graf-s"><canvas id="an-g-disp"></canvas></div>`)
  const html = `<div class="an-g2">
      ${dispHtml}
      ${t.__error || t.__noconf ? falla(t) : lista('🌐 Navegador', t.navegadores, COLOR.azul)}
      ${t.__error || t.__noconf ? '' : lista('💻 Sistema', t.sistemas, COLOR.morado)}
      ${t.__error || t.__noconf ? '' : lista('🗣️ Idioma', t.idiomas, COLOR.cian)}
    </div>
    <h3 style="font-size:0.95rem;margin:1rem 0 .6rem">Edad, género e intereses</h3>
    ${dm.__error || dm.__noconf ? falla(dm) : (dm.disponible
      ? `<div class="an-g2">${lista('🎂 Edad', dm.edad, COLOR.rosa)}${lista('⚧ Género', dm.genero, COLOR.morado)}${(dm.intereses || []).length ? lista('✨ Intereses', dm.intereses, COLOR.naranja) : ''}</div>`
      : `<div class="an-aviso an-aviso-warn"><b>Google todavía no da edad ni género.</b><br>${esc(dm.motivo || '')}<br><small>Es una configuración en Google Analytics (no en el panel). Con pocas visitas Google también oculta estos datos por privacidad.</small></div>`)}`
  return { html, despues: () => { if (!(disp.__error || disp.__noconf)) { const f = disp.filas || []; grafica('an-g-disp', { type: 'doughnut', data: { labels: f.map(x => ({ mobile: 'Celular', desktop: 'Computadora', tablet: 'Tablet' }[x.nombre] || x.nombre)), datasets: [{ data: f.map(x => x.sesiones), backgroundColor: PALETA, borderWidth: 2 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '62%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } } } } }) } } }
}

// ── Ventas reales y anuncios ──
async function tabVentas() {
  const dias = Math.max(S.dias, 7)
  const [o, g, r, m] = await Promise.all([pedir(`origen-erp?dias=${dias}`), pedir(`google-vs-erp?dias=${dias}`), pedir(`roas?dias=${dias}`), pedir(`meta-ads?periodo=${dias <= 7 ? 'last_7d' : dias <= 30 ? 'last_30d' : 'last_90d'}`)])
  if (o.__error) return { html: falla(o) }
  const por = o.por_origen || []
  const kpis = `<div class="an-grid">
    <div class="an-kpi"><div class="an-kpi-l">Ventas web reales</div><div class="an-kpi-v">${dinero(o.ventas)}</div><span class="an-kpi-s">${nf(o.pedidos)} pedido(s) · últimos ${dias} días</span></div>
    <div class="an-kpi"><div class="an-kpi-l">Ticket promedio</div><div class="an-kpi-v">${dinero(o.ticket)}</div></div></div>`
  const tablaOrigen = por.length ? `<div class="an-scroll"><table class="an-tabla"><thead><tr><th>Origen</th><th class="num">Pedidos</th><th class="num">Ventas</th><th>% de ventas</th><th class="num">Ticket</th><th>Lo que más compran</th></tr></thead><tbody>
    ${por.map(x => `<tr><td><b>${esc(x.origen)}</b></td><td class="num">${nf(x.pedidos)}</td><td class="num">${dinero(x.ventas)}</td><td style="min-width:100px">${barra(x.pct_ventas, 100, COLOR.rosa)}<small style="color:#888">${pct(x.pct_ventas, 0)}</small></td><td class="num">${dinero(x.ticket)}</td><td style="font-size:0.78rem;color:#666">${(x.top_modelos || []).map(t => esc(t.modelo) + ' (' + t.pares + ')').join(' · ') || '—'}</td></tr>`).join('')}</tbody></table></div>` : vacio('Sin pedidos web en este periodo')
  // anuncios
  let anuncios = falla(r)
  if (!r.__error) {
    const me = r.meta, ga = r.google_ads
    const meta = !me.conectado ? `<div class="an-aviso an-aviso-warn">Meta Ads: ${esc(me.error || 'no conectado')}</div>`
      : `<div class="an-lista-i"><span>Gasto en Meta</span><b>${dinero(me.gasto)}</b></div><div class="an-lista-i"><span>Ventas reales que llegaron de Meta</span><b>${dinero(me.ventas_erp)} (${nf(me.pedidos_erp)} pedido${me.pedidos_erp === 1 ? '' : 's'})</b></div>
        <div class="an-lista-i"><span>Retorno real (ventas ÷ gasto)</span><span class="an-chip ${me.roas_erp >= 2 ? 'an-chip-ok' : me.roas_erp >= 1 ? 'an-chip-warn' : 'an-chip-mal'}">${me.roas_erp == null ? '—' : me.roas_erp + 'x'}</span></div>
        <div class="an-lista-i"><span>Costo por pedido</span><b>${me.costo_por_pedido ? dinero(me.costo_por_pedido) : '—'}</b></div>
        <div class="an-lista-i"><span style="color:#999">Lo que Meta dice de sí mismo</span><span style="color:#999">${me.roas_reportado_por_meta ?? '—'}x · ${me.compras_reportadas_por_meta ?? 0} compras</span></div>`
    anuncios = `<div class="an-g2">${tarjeta('📣 Meta (Facebook / Instagram)', meta)}
      ${tarjeta('🔍 Google Ads', `<div class="an-lista-i"><span>Ventas reales con clic de anuncio</span><b>${dinero(ga.ventas_erp)} (${nf(ga.pedidos_erp)} pedido${ga.pedidos_erp === 1 ? '' : 's'})</b></div><div class="an-lista-i"><span>Ticket promedio</span><b>${ga.ticket ? dinero(ga.ticket) : '—'}</b></div><div class="an-aviso an-aviso-warn" style="margin:10px 0 0;font-size:0.8rem">${esc(ga.nota)}</div>`)}</div>`
  }
  // google vs erp
  let gve = falla(g)
  if (!g.__error && !g.__noconf) {
    const dif = g.compras_sin_registrar_en_ga_pct
    const msg = dif == null ? '' : dif > 25 ? `Google no está registrando alrededor del ${pct(dif, 0)} de tus compras: sus reportes de ventas quedan cortos. Revisa que el aviso de compra se dispare también al pagar con OXXO/SPEI y con bloqueadores de anuncios.`
      : dif < -10 ? 'Google reporta MÁS compras que pedidos reales: puede contar pedidos que no se pagaron (OXXO/SPEI pendientes) o duplicados.' : 'Google y el ERP van parejos: el seguimiento está bien.'
    gve = tarjeta('⚖️ Google contra el ERP', `<div class="an-grid" style="margin-bottom:8px"><div class="an-kpi"><div class="an-kpi-l">Compras en Google</div><div class="an-kpi-v">${nf(g.ga_compras)}</div><span class="an-kpi-s">${dinero(g.ga_ingreso)}</span></div>
      <div class="an-kpi"><div class="an-kpi-l">Pedidos reales (ERP)</div><div class="an-kpi-v">${nf(g.erp_pedidos)}</div><span class="an-kpi-s">${dinero(g.erp_ventas)}</span></div></div>${msg ? `<div class="an-aviso an-aviso-info" style="margin-bottom:0">${esc(msg)}</div>` : ''}`)
  }
  // campañas de meta
  const camp = (!m.__error && !m.__noconf && (m.campanas || []).length) ? tarjeta('Campañas de Meta', `<div class="an-scroll"><table class="an-tabla"><thead><tr><th>Campaña</th><th class="num">Gasto</th><th class="num">Clics</th><th class="num">CTR</th><th class="num">Compras</th></tr></thead><tbody>${m.campanas.map(c => `<tr><td>${esc(c.nombre)}</td><td class="num">${dinero(c.gasto)}</td><td class="num">${nf(c.clics)}</td><td class="num">${pct(c.ctr, 2)}</td><td class="num">${nf(c.compras)}</td></tr>`).join('')}</tbody></table></div>`) : ''
  return { html: kpis + tarjeta('De dónde vienen tus ventas reales', tablaOrigen) + '<div style="height:14px"></div>' + anuncios + gve + '<div style="height:14px"></div>' + camp }
}
