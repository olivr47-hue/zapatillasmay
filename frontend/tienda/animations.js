// Zapatillas May — animaciones usando Web Animations API nativa (sin CDN)

const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const ease  = 'cubic-bezier(0.23, 1, 0.32, 1)'
const spring = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

// ─── utilidades ───────────────────────────────────────
function anim(el, frames, opts) {
  if (!el || noMotion) return null
  return el.animate(frames, { fill: 'forwards', easing: ease, ...opts })
}

function animStagger(els, frames, opts) {
  const list = [...(els instanceof NodeList ? els : els)]
  const base = opts.delay || 0
  const step = opts.stagger || 60
  list.forEach((el, i) => {
    if (el) el.animate(frames, { fill: 'forwards', easing: ease, ...opts, delay: base + i * step })
  })
}

// ─── scroll reveal con IntersectionObserver ───────────
function setupScrollReveals() {
  if (noMotion) return

  const configs = [
    { sel: '.product-card',       frames: [{ opacity:0, transform:'translateY(32px)' }, { opacity:1, transform:'translateY(0)' }], dur: 500 },
    { sel: '.cat-card',           frames: [{ opacity:0, transform:'translateY(24px) scale(0.94)' }, { opacity:1, transform:'translateY(0) scale(1)' }], dur: 420 },
    { sel: '.section-title',      frames: [{ opacity:0, transform:'translateY(16px)' }, { opacity:1, transform:'translateY(0)' }], dur: 480 },
    { sel: '.testimonio-card',    frames: [{ opacity:0, transform:'translateY(20px)' }, { opacity:1, transform:'translateY(0)' }], dur: 420 },
    { sel: '.banner-mayoreo',     frames: [{ opacity:0, transform:'translateY(16px)' }, { opacity:1, transform:'translateY(0)' }], dur: 500 },
    { sel: '.catalogo-card',      frames: [{ opacity:0, transform:'scale(0.93)' },      { opacity:1, transform:'scale(1)' }],      dur: 380 },
    { sel: '.info-card',          frames: [{ opacity:0, transform:'translateY(12px)' }, { opacity:1, transform:'translateY(0)' }], dur: 320 },
  ]

  const seen = new WeakSet()
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || seen.has(entry.target)) return
      seen.add(entry.target)
      io.unobserve(entry.target)
      const cfg = entry.target._animCfg
      if (!cfg) return
      entry.target.animate(cfg.frames, { fill: 'forwards', easing: ease, duration: cfg.dur })
    })
  }, { threshold: 0.1 })

  configs.forEach(({ sel, frames, dur }) => {
    document.querySelectorAll(sel).forEach(el => {
      if (seen.has(el)) return
      el._animCfg = { frames, dur }
      // Estado inicial
      el.style.opacity = '0'
      io.observe(el)
    })
  })

  // Re-observar cards que se agreguen después (productos que carga el JS)
  const gridObs = new MutationObserver(() => {
    configs.forEach(({ sel, frames, dur }) => {
      document.querySelectorAll(sel).forEach(el => {
        if (seen.has(el) || el._animCfg) return
        el._animCfg = { frames, dur }
        el.style.opacity = '0'
        io.observe(el)
      })
    })
  })
  const grids = document.querySelectorAll('.products-grid, .cats-grid, #products-grid, #catalogo-grid')
  grids.forEach(g => gridObs.observe(g, { childList: true }))
}

// ─── page enter ───────────────────────────────────────
function pageEnter() {
  if (noMotion) return
  document.body.animate(
    [{ opacity: 0 }, { opacity: 1 }],
    { duration: 300, easing: ease, fill: 'forwards' }
  )
}

// ─── hero ─────────────────────────────────────────────
function animateHero() {
  if (noMotion) return
  const content = document.getElementById('hero-content')
  if (!content) return
  const els = [
    content.querySelector('.hero-eyebrow'),
    content.querySelector('.hero-title'),
    content.querySelector('.hero-subtitle'),
    content.querySelector('.hero-cta'),
    content.querySelector('.hero-garantias'),
  ].filter(Boolean)

  els.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(40px)' })

  els.forEach((el, i) => {
    el.animate(
      [{ opacity:0, transform:'translateY(40px)' }, { opacity:1, transform:'translateY(0)' }],
      { duration: 700, delay: 150 + i * 120, easing: ease, fill: 'forwards' }
    )
  })
}

// ─── hero shoe parallax (solo desktop) ────────────────
function setupHeroShoe() {
  if (noMotion) return
  const shoe = document.getElementById('hero-shoe-wrap')
  if (!shoe) return
  let raf
  document.addEventListener('mousemove', (e) => {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => {
      const dx = (e.clientX / window.innerWidth  - 0.5) * 18
      const dy = (e.clientY / window.innerHeight - 0.5) * 10
      shoe.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx * 0.12}deg)`
      shoe.style.transition = 'transform 0.4s cubic-bezier(0.23,1,0.32,1)'
    })
  }, { passive: true })
}

// ─── navbar ───────────────────────────────────────────
function setupNavAnimations() {
  if (noMotion) return
  const nav = document.querySelector('nav, .nav, header')
  if (nav) anim(nav, [{ opacity:0, transform:'translateY(-8px)' }, { opacity:1, transform:'translateY(0)' }], { duration: 400 })

  document.querySelectorAll('.nav-cats a').forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.animate([{ transform:'translateY(0)' }, { transform:'translateY(-2px)' }], { duration: 140, easing: ease, fill: 'forwards' })
    }, { passive: true })
    link.addEventListener('mouseleave', () => {
      link.animate([{ transform:'translateY(-2px)' }, { transform:'translateY(0)' }], { duration: 140, easing: ease, fill: 'forwards' })
    }, { passive: true })
  })
}

// ─── product card hover ───────────────────────────────
function setupCardHover() {
  if (noMotion) return
  document.addEventListener('mouseover', (e) => {
    const card = e.target.closest('.product-card')
    if (!card || card._hoverReady) return
    card._hoverReady = true
    card.addEventListener('mouseenter', () => {
      card.animate([{ transform:'translateY(0)' }, { transform:'translateY(-4px)' }], { duration: 180, easing: ease, fill: 'forwards' })
    }, { passive: true })
    card.addEventListener('mouseleave', () => {
      card.animate([{ transform:'translateY(-4px)' }, { transform:'translateY(0)' }], { duration: 180, easing: ease, fill: 'forwards' })
    }, { passive: true })
  }, { passive: true })
}

// ─── filtro chips ─────────────────────────────────────
function setupFiltrosAnim() {
  if (noMotion) return
  document.addEventListener('click', (e) => {
    const chip = e.target.closest('.filtro-chip, .pill-filter')
    if (!chip) return
    chip.animate(
      [{ transform:'scale(1)' }, { transform:'scale(0.91)' }, { transform:'scale(1.07)' }, { transform:'scale(1)' }],
      { duration: 280, easing: spring }
    )
  }, { passive: true })
}

// ─── producto page ────────────────────────────────────
function animateProductoPage() {
  if (noMotion) return
  const gallery = document.getElementById('gallery-main')
  if (gallery) anim(gallery, [{ opacity:0, transform:'scale(0.96)' }, { opacity:1, transform:'scale(1)' }], { duration: 500 })

  const section = document.getElementById('product-section')
  if (section) {
    animStagger([...section.children],
      [{ opacity:0, transform:'translateX(20px)' }, { opacity:1, transform:'translateX(0)' }],
      { duration: 420, stagger: 60, delay: 180 }
    )
  }
}

// ─── carrito page ─────────────────────────────────────
function animateCarritoPage() {
  if (noMotion) return
  function revelarItems() {
    const items = document.querySelectorAll('.cart-item, [class*="carrito-item"]')
    if (items.length === 0) return
    animStagger(items,
      [{ opacity:0, transform:'translateX(28px)' }, { opacity:1, transform:'translateX(0)' }],
      { duration: 360, stagger: 55 }
    )
  }
  // Observar si los items se renderizan después
  const container = document.getElementById('cart-list') || document.getElementById('carrito-items') || document.body
  const mo = new MutationObserver(() => { revelarItems(); mo.disconnect() })
  mo.observe(container, { childList: true, subtree: true })
  setTimeout(() => mo.disconnect(), 4000)
  revelarItems()
}

// ─── checkout page ────────────────────────────────────
function animateCheckoutPage() {
  if (noMotion) return
  const steps = document.querySelectorAll('.step, .dot')
  if (steps.length) animStagger(steps, [{ opacity:0, transform:'scale(0.75)' }, { opacity:1, transform:'scale(1)' }], { duration: 300, easing: spring, stagger: 70, delay: 100 })

  const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], select, .campo')
  if (inputs.length) animStagger(inputs, [{ opacity:0, transform:'translateY(10px)' }, { opacity:1, transform:'translateY(0)' }], { duration: 280, stagger: 35, delay: 280 })
}

// ─── ADD TO CART ──────────────────────────────────────
window.animateAddToCart = function(btnEl) {
  if (noMotion) return
  btnEl = btnEl || document.getElementById('btn-agregar')

  // Bounce del botón
  if (btnEl) {
    btnEl.animate(
      [{ transform:'scale(1)' }, { transform:'scale(0.87)' }, { transform:'scale(1.09)' }, { transform:'scale(1)' }],
      { duration: 420, easing: spring }
    )
  }

  // Cart icon + badge pop
  const cartLink = document.querySelector('a.btn-icon[href="/carrito"]')
  const badge    = document.getElementById('cart-count')
  if (cartLink) cartLink.animate([{ transform:'scale(1)' }, { transform:'scale(1.5)' }, { transform:'scale(1)' }], { duration: 350, easing: spring })
  if (badge)    badge.animate(   [{ transform:'scale(0.5)' }, { transform:'scale(1.7)' }, { transform:'scale(1)' }], { duration: 380, easing: spring })

  // Partículas que vuelan al carrito
  if (!btnEl || !cartLink) return
  const bRect = btnEl.getBoundingClientRect()
  const cRect = cartLink.getBoundingClientRect()
  const sx = bRect.left + bRect.width  / 2
  const sy = bRect.top  + bRect.height / 2
  const ex = cRect.left + cRect.width  / 2
  const ey = cRect.top  + cRect.height / 2

  for (let i = 0; i < 6; i++) {
    const dot = document.createElement('div')
    const angle = (i / 6) * Math.PI * 2
    const burst = 20
    Object.assign(dot.style, {
      position: 'fixed',
      width: '9px', height: '9px',
      borderRadius: '50%',
      background: i % 2 === 0 ? '#9c5a52' : '#b5687a',
      left: (sx - 4.5) + 'px',
      top:  (sy - 4.5) + 'px',
      pointerEvents: 'none',
      zIndex: '9999',
    })
    document.body.appendChild(dot)

    const bx = Math.cos(angle) * burst
    const by = Math.sin(angle) * burst
    const tx = ex - sx
    const ty = ey - sy

    // fase 1 — burst
    const a1 = dot.animate(
      [{ transform:'translate(0,0) scale(1)', opacity:1 },
       { transform:`translate(${bx}px,${by}px) scale(0.7)`, opacity:1 }],
      { duration: 160, easing: ease, fill: 'forwards' }
    )
    a1.onfinish = () => {
      // fase 2 — vuela al carrito
      dot.animate(
        [{ transform:`translate(${bx}px,${by}px) scale(0.7)`, opacity:1 },
         { transform:`translate(${tx}px,${ty}px) scale(0.15)`, opacity:0 }],
        { duration: 380, delay: i * 25, easing: ease, fill: 'forwards' }
      ).onfinish = () => dot.remove()
    }
  }
}

// ─── INIT ─────────────────────────────────────────────
function init() {
  pageEnter()
  setupScrollReveals()
  setupCardHover()
  setupFiltrosAnim()
  setupNavAnimations()

  const path = location.pathname

  if (path === '/' || path.endsWith('index.html') || path === '') {
    animateHero()
    setupHeroShoe()
  }

  if (path.startsWith('/producto') || document.getElementById('product-section')) {
    animateProductoPage()
  }

  if (path === '/carrito' || path.endsWith('carrito.html')) {
    animateCarritoPage()
  }

  if (path === '/checkout' || path.endsWith('checkout.html')) {
    animateCheckoutPage()
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
