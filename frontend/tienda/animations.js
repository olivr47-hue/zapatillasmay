/* animations.js v2 — Zapatillas May
   Animaciones de UI: gradient border en botón + burst al agregar al carrito
*/

// ── GRADIENT BORDER ANIMADO EN BOTÓN ────────────────────────────────────────
// Cuando btn-agregar pasa a habilitado, muestra un borde animado que rota
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
      inset: -2px;
      border-radius: 100px;
      background: conic-gradient(from var(--angle),
        #C8967A, #b5687a, #ff9eb5, #C8967A
      );
      animation: rotate-border 2.4s linear infinite;
      z-index: -1;
    }
    .btn-agregar.listo::after {
      content: '';
      position: absolute;
      inset: 2px;
      border-radius: 100px;
      background: linear-gradient(135deg, #C8967A, #b5687a);
      z-index: -1;
    }

    /* Burst particles */
    @keyframes burst-fly {
      0%   { transform: translate(0,0) scale(1); opacity: 1; }
      100% { transform: translate(var(--bx), var(--by)) scale(0); opacity: 0; }
    }
    .burst-particle {
      position: fixed;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      animation: burst-fly 0.55s cubic-bezier(0.22,1,0.36,1) forwards;
    }

    /* Checkmark pulse al agregar */
    @keyframes check-pop {
      0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
      60%  { transform: scale(1.25) rotate(5deg); opacity: 1; }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    .btn-agregar.listo.check-anim::after {
      animation: none;
    }
  `
  document.head.appendChild(style)
})()

// ── BURST PARTICLES ──────────────────────────────────────────────────────────
function burstParticles(btn) {
  const rect = btn.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const colors = ['#C8967A', '#b5687a', '#ff9eb5', '#ffc8a0', '#fff']
  const count = 10

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div')
    el.className = 'burst-particle'
    const angle = (i / count) * 360
    const dist  = 40 + Math.random() * 30
    const rad   = (angle * Math.PI) / 180
    el.style.cssText = `
      left: ${cx - 4}px;
      top:  ${cy - 4}px;
      background: ${colors[i % colors.length]};
      --bx: ${Math.cos(rad) * dist}px;
      --by: ${Math.sin(rad) * dist}px;
    `
    document.body.appendChild(el)
    el.addEventListener('animationend', () => el.remove())
  }
}

// ── FLY-TO-CART (imagen vuela hacia el ícono del carrito) ────────────────────
function flyToCart(sourceEl) {
  const src = sourceEl
    ? (src => src)(sourceEl.closest('.gallery')?.querySelector('#gallery-main')?.src || '')
    : ''
  const cartBtn = document.getElementById('btn-ver-carrito') || document.getElementById('header-cart-btn')
  if (!cartBtn) return

  const fromRect = (document.getElementById('gallery-main') || sourceEl)?.getBoundingClientRect()
  const toRect   = cartBtn.getBoundingClientRect()
  if (!fromRect) return

  const clone = document.createElement('div')
  clone.style.cssText = `
    position: fixed;
    left: ${fromRect.left + fromRect.width / 2 - 24}px;
    top:  ${fromRect.top  + fromRect.height / 2 - 24}px;
    width: 48px; height: 48px;
    border-radius: 50%;
    background: url('${src}') center/cover, linear-gradient(135deg, #C8967A, #b5687a);
    box-shadow: 0 4px 16px rgba(200,150,122,0.5);
    pointer-events: none;
    z-index: 9999;
    transition: all 0.55s cubic-bezier(0.34,1.56,0.64,1);
    opacity: 1;
  `
  document.body.appendChild(clone)

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      clone.style.left    = `${toRect.left + toRect.width / 2 - 12}px`
      clone.style.top     = `${toRect.top  + toRect.height / 2 - 12}px`
      clone.style.width   = '24px'
      clone.style.height  = '24px'
      clone.style.opacity = '0'
      clone.style.transform = 'scale(0.3)'
    })
  })

  setTimeout(() => {
    clone.remove()
    // Pulso en el carrito
    if (cartBtn) {
      cartBtn.style.transition = 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1)'
      cartBtn.style.transform  = 'scale(1.3)'
      setTimeout(() => { cartBtn.style.transform = 'scale(1)' }, 200)
    }
  }, 580)
}

// ── API PÚBLICA: window.animateAddToCart(btn) ────────────────────────────────
window.animateAddToCart = function(btn) {
  if (!btn) return
  burstParticles(btn)
  flyToCart(btn)
}
