/* animations.js v3.1 — Zapatillas May */

// ── GRADIENT BORDER ANIMADO EN BOTÓN ────────────────────────────────────────
;(function initGradientBorder() {
  const style = document.createElement('style')
  style.textContent = `
    @property --angle {
      syntax: '<angle>';
      initial-value: 0deg;
      inherits: false;
    }
    @keyframes rotate-border {
      to { --angle: 360deg; }
    }
    .btn-agregar.listo {
      position: relative;
      z-index: 0;
    }
    .btn-agregar.listo::before {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 100px;
      background: conic-gradient(from var(--angle),
        #C8967A 0%, #ff9eb5 25%, #fff 45%, #b5687a 60%, #C8967A 100%
      );
      animation: rotate-border 1.6s linear infinite;
      z-index: -1;
      filter: blur(1px);
    }
    .btn-agregar.listo::after {
      content: '';
      position: absolute;
      inset: 3px;
      border-radius: 100px;
      background: linear-gradient(135deg, #C8967A, #b5687a);
      z-index: -1;
    }

    /* Burst particles */
    @keyframes burst-fly {
      0%   { transform: translate(0,0) scale(1.2); opacity: 1; }
      70%  { opacity: 1; }
      100% { transform: translate(var(--bx), var(--by)) scale(0); opacity: 0; }
    }
    .burst-particle {
      position: fixed;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      animation: burst-fly 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }

    /* Bounce del botón al agregar */
    @keyframes btn-bounce {
      0%   { transform: scale(1); }
      30%  { transform: scale(0.92); }
      65%  { transform: scale(1.06); }
      100% { transform: scale(1); }
    }
    .btn-agregar.bouncing {
      animation: btn-bounce 0.45s cubic-bezier(0.34,1.56,0.64,1);
    }
  `
  document.head.appendChild(style)
})()

// ── BURST PARTICLES ──────────────────────────────────────────────────────────
function burstParticles(btn) {
  const rect = btn.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2

  // Mezcla de círculos y estrellas (div rotados)
  const shapes = [
    { size: 12, color: '#C8967A' },
    { size: 9,  color: '#ff9eb5' },
    { size: 14, color: '#b5687a' },
    { size: 8,  color: '#ffc8a0' },
    { size: 11, color: '#ffffff' },
    { size: 10, color: '#C8967A' },
    { size: 7,  color: '#ff9eb5' },
    { size: 13, color: '#b5687a' },
    { size: 9,  color: '#ffd4b8' },
    { size: 10, color: '#e88fa0' },
    { size: 8,  color: '#C8967A' },
    { size: 12, color: '#ff9eb5' },
  ]

  shapes.forEach((s, i) => {
    const el = document.createElement('div')
    el.className = 'burst-particle'
    // Ángulo con offset aleatorio pequeño para que no sean exactamente uniformes
    const baseAngle = (i / shapes.length) * 360
    const jitter    = (Math.random() - 0.5) * 28
    const angle     = baseAngle + jitter
    const dist      = 55 + Math.random() * 45   // 55–100px
    const rad       = (angle * Math.PI) / 180
    const delay     = Math.random() * 60         // stagger leve

    el.style.cssText = `
      left: ${cx - s.size / 2}px;
      top:  ${cy - s.size / 2}px;
      width:  ${s.size}px;
      height: ${s.size}px;
      background: ${s.color};
      --bx: ${Math.cos(rad) * dist}px;
      --by: ${Math.sin(rad) * dist}px;
      animation-delay: ${delay}ms;
      box-shadow: 0 0 ${s.size}px ${s.color}88;
    `
    document.body.appendChild(el)
    el.addEventListener('animationend', () => el.remove())
  })

  // Bounce en el botón
  btn.classList.add('bouncing')
  btn.addEventListener('animationend', () => btn.classList.remove('bouncing'), { once: true })
}

// ── FLY-TO-CART ──────────────────────────────────────────────────────────────
function flyToCart(btn) {
  const imgEl   = document.getElementById('gallery-main')
  const cartBtn = document.getElementById('btn-ver-carrito') || document.getElementById('header-cart-btn')
  if (!cartBtn || !imgEl) return

  const fromRect = imgEl.getBoundingClientRect()
  const toRect   = cartBtn.getBoundingClientRect()

  // Clonar imagen como círculo grande
  const SIZE = 72
  const clone = document.createElement('div')
  clone.style.cssText = `
    position: fixed;
    left: ${fromRect.left + fromRect.width  / 2 - SIZE / 2}px;
    top:  ${fromRect.top  + fromRect.height / 2 - SIZE / 2}px;
    width:  ${SIZE}px;
    height: ${SIZE}px;
    border-radius: 50%;
    background: url('${imgEl.src}') center/cover,
                linear-gradient(135deg, #C8967A, #b5687a);
    box-shadow: 0 8px 28px rgba(200,150,122,0.6);
    border: 3px solid rgba(255,255,255,0.8);
    pointer-events: none;
    z-index: 9999;
    opacity: 1;
    transform: scale(1);
    will-change: transform, opacity, left, top, width, height;
    transition:
      left    0.75s cubic-bezier(0.34, 1.2, 0.64, 1),
      top     0.75s cubic-bezier(0.34, 1.2, 0.64, 1),
      width   0.75s cubic-bezier(0.34, 1.2, 0.64, 1),
      height  0.75s cubic-bezier(0.34, 1.2, 0.64, 1),
      opacity 0.25s ease 0.5s,
      transform 0.75s cubic-bezier(0.34, 1.2, 0.64, 1);
  `
  document.body.appendChild(clone)

  // Esperar 2 frames para que el browser registre el estado inicial
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const endSize = 28
      clone.style.left      = `${toRect.left + toRect.width  / 2 - endSize / 2}px`
      clone.style.top       = `${toRect.top  + toRect.height / 2 - endSize / 2}px`
      clone.style.width     = `${endSize}px`
      clone.style.height    = `${endSize}px`
      clone.style.opacity   = '0'
      clone.style.transform = 'scale(0.4)'
    })
  })

  // Pulso en el ícono del carrito cuando llega
  setTimeout(() => {
    clone.remove()
    cartBtn.style.transition = 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1)'
    cartBtn.style.transform  = 'scale(1.45)'
    setTimeout(() => {
      cartBtn.style.transform = 'scale(1)'
      setTimeout(() => { cartBtn.style.transition = '' }, 250)
    }, 240)
  }, 780)
}

// ── API PÚBLICA ───────────────────────────────────────────────────────────────
window.animateAddToCart = function(btn) {
  if (!btn) return
  burstParticles(btn)
  flyToCart(btn)
}
