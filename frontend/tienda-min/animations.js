(function(){const t=document.createElement("style");t.textContent=`
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

    /* Bounce del bot\xF3n al agregar */
    @keyframes btn-bounce {
      0%   { transform: scale(1); }
      30%  { transform: scale(0.92); }
      65%  { transform: scale(1.06); }
      100% { transform: scale(1); }
    }
    .btn-agregar.bouncing {
      animation: btn-bounce 0.45s cubic-bezier(0.34,1.56,0.64,1);
    }
  `,document.head.appendChild(t)})();function burstParticles(o){const t=o.getBoundingClientRect(),i=t.left+t.width/2,a=t.top+t.height/2,r=[{size:12,color:"#C8967A"},{size:9,color:"#ff9eb5"},{size:14,color:"#b5687a"},{size:8,color:"#ffc8a0"},{size:11,color:"#ffffff"},{size:10,color:"#C8967A"},{size:7,color:"#ff9eb5"},{size:13,color:"#b5687a"},{size:9,color:"#ffd4b8"},{size:10,color:"#e88fa0"},{size:8,color:"#C8967A"},{size:12,color:"#ff9eb5"}];r.forEach((e,n)=>{const s=document.createElement("div");s.className="burst-particle";const d=n/r.length*360,b=(Math.random()-.5)*28,f=d+b,c=55+Math.random()*45,l=f*Math.PI/180,m=Math.random()*60;s.style.cssText=`
      left: ${i-e.size/2}px;
      top:  ${a-e.size/2}px;
      width:  ${e.size}px;
      height: ${e.size}px;
      background: ${e.color};
      --bx: ${Math.cos(l)*c}px;
      --by: ${Math.sin(l)*c}px;
      animation-delay: ${m}ms;
      box-shadow: 0 0 ${e.size}px ${e.color}88;
    `,document.body.appendChild(s),s.addEventListener("animationend",()=>s.remove())}),o.classList.add("bouncing"),o.addEventListener("animationend",()=>o.classList.remove("bouncing"),{once:!0})}function flyToCart(o){const t=document.getElementById("gallery-main"),i=document.getElementById("btn-ver-carrito")||document.getElementById("header-cart-btn");if(!i||!t)return;const a=t.getBoundingClientRect(),r=i.getBoundingClientRect(),e=72,n=document.createElement("div");n.style.cssText=`
    position: fixed;
    left: ${a.left+a.width/2-e/2}px;
    top:  ${a.top+a.height/2-e/2}px;
    width:  ${e}px;
    height: ${e}px;
    border-radius: 50%;
    background: url('${t.src}') center/cover,
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
  `,document.body.appendChild(n),requestAnimationFrame(()=>{requestAnimationFrame(()=>{n.style.left=`${r.left+r.width/2-28/2}px`,n.style.top=`${r.top+r.height/2-28/2}px`,n.style.width="28px",n.style.height="28px",n.style.opacity="0",n.style.transform="scale(0.4)"})}),setTimeout(()=>{n.remove(),i.style.transition="transform 0.22s cubic-bezier(0.34,1.56,0.64,1)",i.style.transform="scale(1.45)",setTimeout(()=>{i.style.transform="scale(1)",setTimeout(()=>{i.style.transition=""},250)},240)},780)}window.animateAddToCart=function(o){o&&(burstParticles(o),flyToCart(o))};
