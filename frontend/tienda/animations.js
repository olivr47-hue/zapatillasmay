// Zapatillas May — animaciones CSS + IntersectionObserver (sin dependencias)

const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ─── Inyectar CSS de animaciones ──────────────────────
;(function injectCSS() {
  if (noMotion) return
  const s = document.createElement('style')
  s.textContent = `
    /* Reveal base: elementos esperan invisible */
    .zm-reveal {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.55s cubic-bezier(0.23,1,0.32,1),
                  transform 0.55s cubic-bezier(0.23,1,0.32,1);
    }
    .zm-reveal.zm-scale {
      transform: translateY(0) scale(0.94);
      transition: opacity 0.45s cubic-bezier(0.23,1,0.32,1),
                  transform 0.45s cubic-bezier(0.34,1.56,0.64,1);
    }
    /* Visible: dispara la transición */
    .zm-reveal.zm-in {
      opacity: 1 !important;
      transform: none !important;
    }
    /* Stagger por posición */
    .zm-reveal:nth-child(1) { transition-delay: 0.00s; }
    .zm-reveal:nth-child(2) { transition-delay: 0.06s; }
    .zm-reveal:nth-child(3) { transition-delay: 0.12s; }
    .zm-reveal:nth-child(4) { transition-delay: 0.18s; }
    .zm-reveal:nth-child(5) { transition-delay: 0.24s; }
    .zm-reveal:nth-child(6) { transition-delay: 0.30s; }
    .zm-reveal:nth-child(n+7) { transition-delay: 0.30s; }

    /* Hero */
    .zm-hero-el {
      opacity: 0;
      transform: translateY(36px);
      transition: opacity 0.7s cubic-bezier(0.23,1,0.32,1),
                  transform 0.7s cubic-bezier(0.23,1,0.32,1);
    }
    .zm-hero-el.zm-in { opacity: 1; transform: none; }

    /* Hover suave en cards */
    .product-card {
      transition: opacity 0.55s cubic-bezier(0.23,1,0.32,1),
                  transform 0.55s cubic-bezier(0.23,1,0.32,1),
                  box-shadow 0.22s cubic-bezier(0.23,1,0.32,1);
    }
    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 16px 36px rgba(90,40,10,0.13);
    }

    /* Selección color/talla — pulso al activarse */
    @keyframes zmSelect {
      0%   { transform: scale(1); }
      45%  { transform: scale(1.18); }
      100% { transform: scale(1); }
    }
    .color-btn, .talla-btn, .talla-opt {
      transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1),
                  box-shadow 0.18s ease,
                  background 0.18s ease,
                  border-color 0.18s ease;
    }
    .color-btn.zm-selected, .talla-btn.zm-selected, .talla-opt.zm-selected {
      animation: zmSelect 0.28s cubic-bezier(0.34,1.56,0.64,1);
    }

    /* Botón agregar — bounce cuando se habilita */
    @keyframes zmBtnReady {
      0%   { transform: scale(1); }
      40%  { transform: scale(1.06); }
      100% { transform: scale(1); }
    }
    .btn-agregar.zm-ready { animation: zmBtnReady 0.35s cubic-bezier(0.34,1.56,0.64,1); }

    /* Toast feedback */
    @keyframes zmToastIn {
      from { opacity:0; transform: translateY(12px) scale(0.95); }
      to   { opacity:1; transform: translateY(0) scale(1); }
    }
    .zm-toast { animation: zmToastIn 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards; }

    /* Page enter */
    @keyframes zmFadeIn { from { opacity:0 } to { opacity:1 } }
    body { animation: zmFadeIn 0.35s ease forwards; }
  `
  document.head.appendChild(s)
})()

// ─── IntersectionObserver central ─────────────────────
const _seen = new WeakSet()
let _io = null

function getIO() {
  if (_io) return _io
  _io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return
      e.target.classList.add('zm-in')
      _io.unobserve(e.target)
    })
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' })
  return _io
}

function markReveal(el, scale) {
  if (_seen.has(el)) return
  _seen.add(el)
  el.classList.add('zm-reveal')
  if (scale) el.classList.add('zm-scale')
  getIO().observe(el)
}

// ─── Observar elementos estáticos ─────────────────────
function setupStaticReveals() {
  if (noMotion) return
  document.querySelectorAll('.section-title').forEach(el => markReveal(el))
  document.querySelectorAll('.testimonio-card').forEach(el => markReveal(el))
  document.querySelectorAll('.banner-mayoreo').forEach(el => markReveal(el))
  document.querySelectorAll('.catalogo-card').forEach(el => markReveal(el, true))
  document.querySelectorAll('.cat-card').forEach(el => markReveal(el, true))
  document.querySelectorAll('.info-card').forEach(el => markReveal(el))
  document.querySelectorAll('.cro-tier').forEach(el => markReveal(el))
}

// ─── Cards dinámicas: llamado desde _agregarLote() ────
window.zmObserveCards = function() {
  // Recoger solo tarjetas nuevas (no procesadas aún)
  const nuevas = Array.from(document.querySelectorAll('.product-card'))
    .filter(el => !_seen.has(el))
  if (!nuevas.length) return

  nuevas.forEach(el => {
    _seen.add(el)
    el.classList.add('zm-reveal')
  })

  // Stagger directo: más fiable que IO para contenido dinámico
  // En reduce-motion: solo fade (sin transform) via corta duración
  requestAnimationFrame(() => {
    nuevas.forEach((el, i) => {
      setTimeout(() => el.classList.add('zm-in'), 30 + i * 55)
    })
  })
}

// ─── Hero ──────────────────────────────────────────────
function animateHero() {
  const content = document.getElementById('hero-content')
  if (!content) return

  const selectors = ['.hero-eyebrow','.hero-title','.hero-subtitle','.hero-cta','.hero-garantias']
  const els = selectors.map(s => content.querySelector(s)).filter(Boolean)

  // Estado inicial
  els.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(28px)' })

  // 200ms mínimo: tiempo suficiente para que el browser pinte el estado inicial
  els.forEach((el, i) => {
    setTimeout(() => {
      el.style.transition = 'opacity 0.72s cubic-bezier(0.23,1,0.32,1), transform 0.72s cubic-bezier(0.23,1,0.32,1)'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    }, 200 + i * 130)
  })
}

// ─── Contador numérico ─────────────────────────────────
function setupCounters() {
  const el = document.getElementById('cro-pedidos')
  if (!el) return

  const target = 2400
  const duration = 1800

  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return
    io.disconnect()
    if (noMotion) { el.textContent = '+' + target.toLocaleString('es-MX'); return }

    const start = performance.now()
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      const val = Math.round(eased * target)
      el.textContent = '+' + val.toLocaleString('es-MX')
      if (p < 1) requestAnimationFrame(tick)
    }
    el.textContent = '+0'
    requestAnimationFrame(tick)
  }, { threshold: 0.5 })

  io.observe(el)
}

// Hero shoe parallax eliminado — el hero en index.html maneja el fondo

// ─── Add to cart ──────────────────────────────────────
window.animateAddToCart = function(btnEl) {
  if (noMotion) return
  btnEl = btnEl || document.getElementById('btn-agregar')

  // Bounce botón
  if (btnEl) {
    btnEl.animate(
      [{ transform:'scale(1)' },{ transform:'scale(0.87)' },{ transform:'scale(1.1)' },{ transform:'scale(1)' }],
      { duration: 400, easing: 'cubic-bezier(0.34,1.56,0.64,1)' }
    )
  }

  // Pop carrito + badge
  const cartLink = document.querySelector('a.btn-icon[href="/carrito"]')
  const badge    = document.getElementById('cart-count')
  if (cartLink) cartLink.animate([{ transform:'scale(1)' },{ transform:'scale(1.5)' },{ transform:'scale(1)' }], { duration: 380, easing: 'cubic-bezier(0.34,1.56,0.64,1)' })
  if (badge)    badge.animate(   [{ transform:'scale(0.5)' },{ transform:'scale(1.8)' },{ transform:'scale(1)' }], { duration: 400, easing: 'cubic-bezier(0.34,1.56,0.64,1)' })

  // Partículas
  if (!btnEl || !cartLink) return
  const b = btnEl.getBoundingClientRect()
  const c = cartLink.getBoundingClientRect()
  const sx = b.left + b.width / 2,  sy = b.top + b.height / 2
  const ex = c.left + c.width / 2,  ey = c.top + c.height / 2

  for (let i = 0; i < 6; i++) {
    const dot = document.createElement('div')
    const angle = (i / 6) * Math.PI * 2
    const burst = 18
    Object.assign(dot.style, {
      position:'fixed', width:'9px', height:'9px', borderRadius:'50%',
      background: i % 2 ? '#9c5a52' : '#b5687a',
      left:(sx-4.5)+'px', top:(sy-4.5)+'px',
      pointerEvents:'none', zIndex:'9999',
    })
    document.body.appendChild(dot)
    const bx = Math.cos(angle)*burst, by = Math.sin(angle)*burst
    dot.animate(
      [{ transform:'translate(0,0) scale(1)', opacity:1 },
       { transform:`translate(${bx}px,${by}px) scale(0.7)`, opacity:1, offset: 0.25 },
       { transform:`translate(${ex-sx}px,${ey-sy}px) scale(0.1)`, opacity:0 }],
      { duration: 560, delay: i * 28, easing:'cubic-bezier(0.23,1,0.32,1)', fill:'forwards' }
    ).onfinish = () => dot.remove()
  }
}

// ─── Carrito: revelar items ────────────────────────────
function animateCarritoPage() {
  if (noMotion) return
  function revelar() {
    document.querySelectorAll('.cart-item, [class*="carrito-item"]').forEach(el => markReveal(el))
  }
  revelar()
  const container = document.getElementById('cart-list') || document.getElementById('carrito-items') || document.body
  const mo = new MutationObserver(() => { revelar(); mo.disconnect() })
  mo.observe(container, { childList: true, subtree: true })
  setTimeout(() => mo.disconnect(), 5000)
}

// ─── Checkout ─────────────────────────────────────────
function animateCheckoutPage() {
  if (noMotion) return
  document.querySelectorAll('.step').forEach(el => markReveal(el, true))
  document.querySelectorAll('input[type="text"],input[type="email"],input[type="tel"],select,.campo').forEach(el => markReveal(el))
}

// ─── Selección color / talla ──────────────────────────
function setupSelectionAnimations() {
  if (noMotion) return

  // Pulso al seleccionar color o talla (event delegation)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.color-btn, .talla-btn, .talla-opt, .color-opt')
    if (!btn || btn.disabled) return

    // Quitar clase anterior para poder re-animarla
    btn.classList.remove('zm-selected')
    void btn.offsetWidth // reflow para reiniciar animación
    btn.classList.add('zm-selected')

    // Bounce del botón agregar cuando ambos están listos
    setTimeout(() => {
      const btnAgregar = document.getElementById('btn-agregar')
      if (btnAgregar && !btnAgregar.disabled) {
        btnAgregar.classList.remove('zm-ready')
        void btnAgregar.offsetWidth
        btnAgregar.classList.add('zm-ready')
      }
    }, 50)
  })

  // Animar cambio de imagen en galería de producto
  document.addEventListener('click', (e) => {
    const thumb = e.target.closest('.gallery-thumb')
    if (!thumb) return
    const main = document.querySelector('.gallery-main img, #gallery-main img')
    if (main) {
      main.animate(
        [{ opacity: 0.6, transform: 'scale(0.97)' }, { opacity: 1, transform: 'scale(1)' }],
        { duration: 220, easing: 'cubic-bezier(0.23,1,0.32,1)' }
      )
    }
  })
}

// ─── INIT ─────────────────────────────────────────────
function init() {
  setupStaticReveals()
  setupCounters()
  setupSelectionAnimations()

  const path = location.pathname
  const isHome = path === '/' || path === '' || path.endsWith('index.html')

  if (isHome) animateHero()

  if (path.startsWith('/producto') || document.getElementById('product-section')) {
    setTimeout(() => {
      document.querySelectorAll('.gallery-main, #gallery-main').forEach(el => markReveal(el))
      document.querySelectorAll('#product-section > *').forEach(el => markReveal(el))
    }, 100)
  }

  if (path === '/carrito' || path.endsWith('carrito.html')) animateCarritoPage()
  if (path === '/checkout' || path.endsWith('checkout.html')) animateCheckoutPage()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
