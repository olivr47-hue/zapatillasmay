import { animate, inView, stagger } from 'https://cdn.jsdelivr.net/npm/motion@latest/dist/motion.js'

// Respeta la preferencia del sistema de reducir movimiento
const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (noMotion) { /* nada */ }

const ease = [0.23, 1, 0.32, 1]       // suave
const spring = [0.34, 1.56, 0.64, 1]  // rebote

// ─────────────────────────────────────────
// REVEAL SCROLL — funciona en todas las páginas
// ─────────────────────────────────────────
function setupScrollReveals() {
  if (noMotion) return

  // Product cards — stagger por fila
  inView('.product-card', ({ target }) => {
    animate(target, { opacity: [0, 1], y: [36, 0] }, { duration: 0.55, easing: ease })
  }, { amount: 0.15 })

  // Category cards
  inView('.cat-card', ({ target }) => {
    animate(target, { opacity: [0, 1], y: [28, 0], scale: [0.94, 1] }, { duration: 0.45, easing: ease })
  }, { amount: 0.2 })

  // Títulos de secciones
  inView('.section-title', ({ target }) => {
    animate(target, { opacity: [0, 1], y: [18, 0] }, { duration: 0.5, easing: ease })
  }, { amount: 0.5 })

  // Testimonios
  inView('.testimonio-card', ({ target }) => {
    animate(target, { opacity: [0, 1], y: [24, 0] }, { duration: 0.45, easing: ease })
  }, { amount: 0.2 })

  // Banner mayoreo
  inView('.banner-mayoreo', ({ target }) => {
    animate(target, { opacity: [0, 1], y: [20, 0] }, { duration: 0.5, easing: ease })
  }, { amount: 0.3 })

  // Tarjetas de catálogo (catálogos page)
  inView('.catalogo-card', ({ target }) => {
    animate(target, { opacity: [0, 1], scale: [0.93, 1] }, { duration: 0.4, easing: spring })
  }, { amount: 0.2 })

  // Info cards (producto page)
  inView('.info-card', ({ target }) => {
    animate(target, { opacity: [0, 1], y: [14, 0] }, { duration: 0.35, easing: ease })
  }, { amount: 0.3 })
}

// ─────────────────────────────────────────
// HERO — index.html
// ─────────────────────────────────────────
function animateHero() {
  if (noMotion) return
  const content = document.getElementById('hero-content')
  if (!content) return

  const eyebrow  = content.querySelector('.hero-eyebrow')
  const title    = content.querySelector('.hero-title')
  const subtitle = content.querySelector('.hero-subtitle')
  const cta      = content.querySelector('.hero-cta')
  const garantia = content.querySelector('.hero-garantias, .cro-garantia')

  const els = [eyebrow, title, subtitle, cta, garantia].filter(Boolean)

  // Estado inicial inmediato antes de que arranque el CSS fade-in
  els.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(40px)' })

  animate(els, { opacity: [0, 1], y: [40, 0] }, {
    duration: 0.75,
    delay: stagger(0.13, { start: 0.15 }),
    easing: ease
  })
}

// ─────────────────────────────────────────
// HERO SHOE — paralaje sutil al mover el ratón
// ─────────────────────────────────────────
function setupHeroShoe() {
  if (noMotion) return
  const shoe = document.getElementById('hero-shoe-wrap')
  if (!shoe) return
  let rafId
  document.addEventListener('mousemove', (e) => {
    cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(() => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const dx = (e.clientX - cx) / cx   // -1 a 1
      const dy = (e.clientY - cy) / cy
      shoe.style.transform = `translate(${dx * 10}px, ${dy * 6}px) rotate(${dx * 1.5}deg)`
    })
  })
}

// ─────────────────────────────────────────
// PÁGINA DE ENTRADA — fade in suave al navegar
// ─────────────────────────────────────────
function pageEnter() {
  if (noMotion) return
  animate(document.body, { opacity: [0, 1] }, { duration: 0.35, easing: ease })
}

// ─────────────────────────────────────────
// PRODUCTO — animar sección de producto al cargar
// ─────────────────────────────────────────
function animateProductoPage() {
  if (noMotion) return

  // Imagen principal
  const gallery = document.querySelector('.gallery-main, #gallery-main')
  if (gallery) animate(gallery, { opacity: [0, 1], scale: [0.96, 1] }, { duration: 0.55, easing: ease })

  // Nombre, precio, descripción — stagger
  const productSection = document.getElementById('product-section')
  if (productSection) {
    const children = [...productSection.children]
    animate(children, { opacity: [0, 1], x: [20, 0] }, {
      duration: 0.45,
      delay: stagger(0.07, { start: 0.2 }),
      easing: ease
    })
  }

  // Sticky bar
  const sb = document.getElementById('sticky-bar')
  if (sb) {
    setTimeout(() => {
      animate(sb, { y: [60, 0], opacity: [0, 1] }, { duration: 0.4, easing: spring })
    }, 600)
  }
}

// ─────────────────────────────────────────
// CARRITO — animar items al cargar
// ─────────────────────────────────────────
function animateCarritoPage() {
  if (noMotion) return

  // Esperamos a que el carrito se renderice (es dinámico)
  const observer = new MutationObserver((_, obs) => {
    const items = document.querySelectorAll('.cart-item, [class*="carrito-item"]')
    if (items.length > 0) {
      obs.disconnect()
      animate(items, { opacity: [0, 1], x: [30, 0] }, {
        duration: 0.4,
        delay: stagger(0.06),
        easing: ease
      })
    }
  })
  const container = document.getElementById('cart-list') || document.getElementById('carrito-items') || document.body
  observer.observe(container, { childList: true, subtree: true })
  setTimeout(() => observer.disconnect(), 4000)
}

// ─────────────────────────────────────────
// CHECKOUT — form fields stagger
// ─────────────────────────────────────────
function animateCheckoutPage() {
  if (noMotion) return
  const fields = document.querySelectorAll('.campo, .form-group, input[type="text"], input[type="email"], input[type="tel"], select')
  if (fields.length > 0) {
    animate(fields, { opacity: [0, 1], y: [12, 0] }, {
      duration: 0.3,
      delay: stagger(0.04, { start: 0.3 }),
      easing: ease
    })
  }

  // Stepper steps pop
  const steps = document.querySelectorAll('.step')
  if (steps.length > 0) {
    animate(steps, { opacity: [0, 1], scale: [0.8, 1] }, {
      duration: 0.35,
      delay: stagger(0.08, { start: 0.1 }),
      easing: spring
    })
  }
}

// ─────────────────────────────────────────
// ADD TO CART — animación del botón + vuelo al carrito
// ─────────────────────────────────────────
window.animateAddToCart = function(btnEl) {
  if (noMotion) return

  btnEl = btnEl || document.getElementById('btn-agregar')

  // 1. Bounce del botón
  if (btnEl) {
    animate(btnEl, { scale: [1, 0.86, 1.08, 1] }, { duration: 0.45, easing: spring })
    // Ripple de color
    animate(btnEl, { boxShadow: [
      '0 6px 24px rgba(200,150,122,0.45)',
      '0 0 0 12px rgba(200,150,122,0)',
      '0 6px 24px rgba(200,150,122,0.45)'
    ] }, { duration: 0.6, easing: ease })
  }

  // 2. Ícono del carrito — pop
  const cartLink = document.querySelector('a.btn-icon[href="/carrito"], a[href="/carrito"].btn-icon')
  const cartBadge = document.getElementById('cart-count')

  if (cartLink) {
    animate(cartLink, { scale: [1, 1.45, 1] }, { duration: 0.35, easing: spring })
  }
  if (cartBadge) {
    animate(cartBadge, { scale: [0.6, 1.6, 1] }, { duration: 0.4, easing: spring })
  }

  // 3. Partícula que vuela al carrito
  if (!btnEl || !cartLink) return
  const btnRect  = btnEl.getBoundingClientRect()
  const cartRect = cartLink.getBoundingClientRect()

  const startX = btnRect.left + btnRect.width / 2
  const startY = btnRect.top  + btnRect.height / 2
  const endX   = cartRect.left + cartRect.width / 2
  const endY   = cartRect.top  + cartRect.height / 2

  for (let i = 0; i < 5; i++) {
    const dot = document.createElement('div')
    const angle = (i / 5) * Math.PI * 2
    const burst = 18
    dot.style.cssText = [
      'position:fixed',
      `left:${startX - 5}px`,
      `top:${startY - 5}px`,
      'width:10px',
      'height:10px',
      'border-radius:50%',
      'background:#9c5a52',
      'pointer-events:none',
      'z-index:9999',
      'opacity:1'
    ].join(';')
    document.body.appendChild(dot)

    // Primera fase: burst desde el botón
    animate(dot, {
      transform: [
        'translate(0,0) scale(1)',
        `translate(${Math.cos(angle)*burst}px,${Math.sin(angle)*burst}px) scale(0.7)`
      ]
    }, { duration: 0.18, easing: ease }).finished.then(() => {
      // Segunda fase: vuela al carrito
      const dx = endX - startX - Math.cos(angle)*burst
      const dy = endY - startY - Math.sin(angle)*burst
      animate(dot, {
        transform: [
          `translate(${Math.cos(angle)*burst}px,${Math.sin(angle)*burst}px) scale(0.7)`,
          `translate(${dx + Math.cos(angle)*burst}px,${dy + Math.sin(angle)*burst}px) scale(0.2)`
        ],
        opacity: [1, 0]
      }, { duration: 0.38, delay: i * 0.03, easing: ease }).finished.then(() => dot.remove())
    })
  }
}

// ─────────────────────────────────────────
// HOVER en product cards — realzar con motion
// ─────────────────────────────────────────
function setupCardHover() {
  if (noMotion) return
  // Solo añade el listener una vez cuando los cards aparecen
  document.addEventListener('mouseover', (e) => {
    const card = e.target.closest('.product-card')
    if (!card || card._motionHover) return
    card._motionHover = true
    card.addEventListener('mouseenter', () => {
      animate(card, { y: -4, boxShadow: '0 16px 40px rgba(90,40,10,0.14)' }, { duration: 0.2, easing: ease })
    })
    card.addEventListener('mouseleave', () => {
      animate(card, { y: 0, boxShadow: '0 2px 8px rgba(90,40,10,0.06)' }, { duration: 0.2, easing: ease })
    })
  }, { passive: true })
}

// ─────────────────────────────────────────
// TOAST — animación de entrada/salida
// ─────────────────────────────────────────
function patchToast() {
  if (noMotion) return
  const originalMostrarToast = window.mostrarToast
  if (!originalMostrarToast) return
  window.mostrarToast = function(msg) {
    originalMostrarToast(msg)
    const toast = document.getElementById('toast')
    if (toast) {
      animate(toast, { y: [40, 0], opacity: [0, 1], scale: [0.9, 1] }, { duration: 0.35, easing: spring })
    }
  }
}

// ─────────────────────────────────────────
// NAVEGACIÓN — highlight activo animado
// ─────────────────────────────────────────
function setupNavAnimations() {
  if (noMotion) return
  // Navbar slide down en primera carga
  const nav = document.querySelector('nav, .nav, header')
  if (nav) {
    animate(nav, { y: [-10, 0], opacity: [0, 1] }, { duration: 0.45, easing: ease })
  }
  // Links de nav: underline animado al hover
  document.querySelectorAll('.nav-cats a, .nav-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
      animate(link, { y: -2 }, { duration: 0.15, easing: ease })
    })
    link.addEventListener('mouseleave', () => {
      animate(link, { y: 0 }, { duration: 0.15, easing: ease })
    })
  })
}

// ─────────────────────────────────────────
// NÚMEROS QUE CUENTAN (para badges/totales)
// ─────────────────────────────────────────
window.animateCount = function(el, from, to, duration = 800) {
  if (noMotion || !el) { el && (el.textContent = to); return }
  const start = performance.now()
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1)
    const easedProgress = 1 - Math.pow(1 - progress, 3) // ease-out cubic
    const current = Math.round(from + (to - from) * easedProgress)
    el.textContent = current
    if (progress < 1) requestAnimationFrame(update)
  }
  requestAnimationFrame(update)
}

// ─────────────────────────────────────────
// FILTROS — pop al activar chip
// ─────────────────────────────────────────
function setupFiltrosAnim() {
  if (noMotion) return
  document.addEventListener('click', (e) => {
    const chip = e.target.closest('.filtro-chip, .pill-filter')
    if (!chip) return
    animate(chip, { scale: [0.92, 1.06, 1] }, { duration: 0.25, easing: spring })
  })
}

// ─────────────────────────────────────────
// INIT — detecta la página y arranca lo que corresponde
// Los módulos ES son diferidos: DOMContentLoaded ya disparó.
// Usamos readyState para cubrir ambos casos.
// ─────────────────────────────────────────
function init() {
  pageEnter()
  setupScrollReveals()
  setupCardHover()
  setupFiltrosAnim()
  setupNavAnimations()

  const path = location.pathname

  // index / home
  if (path === '/' || path === '/index.html' || path.endsWith('index.html')) {
    animateHero()
    setupHeroShoe()
    setTimeout(patchToast, 200)
  }

  // producto
  if (path.startsWith('/producto') || document.getElementById('product-section')) {
    animateProductoPage()
    setTimeout(patchToast, 200)
  }

  // carrito
  if (path === '/carrito' || path.endsWith('carrito.html')) {
    animateCarritoPage()
  }

  // checkout
  if (path === '/checkout' || path.endsWith('checkout.html')) {
    animateCheckoutPage()
  }
}

// Módulos ES son siempre diferidos — el DOM ya está listo cuando corren
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}

// Para páginas SPA que cambian contenido dinámicamente (index.html carga secciones)
window.addEventListener('zm:sectionChanged', () => {
  setTimeout(setupScrollReveals, 100)
})
