const PAGINAS = {
  'nosotros': `
  <div class="pg-hero">
    <p class="pg-hero-eyebrow" data-animate>Desde León, Guanajuato · Capital del calzado</p>
    <h2 class="pg-hero-title" data-animate>Zapatillas <em>May</em></h2>
    <p class="pg-hero-sub" data-animate>Calzado de moda para dama hecho en México — con el corazón de León y el precio justo que merecen nuestras clientas.</p>
  </div>
  <div class="pg-body">
    <div class="pg-card" data-animate>
      <h2 class="pg-h2">Nacimos en el <em>corazón</em> del calzado mexicano</h2>
      <p class="pg-p">León, Guanajuato es reconocida mundialmente por la calidad de su calzado, y Zapatillas May nació de esa tradición. Empezamos como una zapatería familiar con una misión clara: llevar moda accesible y de calidad directamente a las manos de nuestras clientas, sin intermediarios.</p>
      <p class="pg-p">Trabajamos directamente con fabricantes leoneses para garantizarte el mejor precio en cada par. El precio justo y la calidad real, sin complicaciones.</p>
      <p class="pg-p">Cada temporada renovamos nuestro catálogo con los modelos más trendy — tacones, sandalias, botas y botines — siempre con materiales duraderos y acabados de calidad.</p>
    </div>
    <div class="pg-grid" style="margin-bottom:20px">
      <div class="pg-stat" data-animate><div class="pg-stat-val">100%</div><div class="pg-stat-label">Calzado hecho en México</div></div>
      <div class="pg-stat s1" data-animate><div class="pg-stat-val">+500</div><div class="pg-stat-label">Revendedoras activas</div></div>
      <div class="pg-stat s2" data-animate><div class="pg-stat-val">+50</div><div class="pg-stat-label">Modelos nuevos por temporada</div></div>
      <div class="pg-stat s3" data-animate><div class="pg-stat-val">MX</div><div class="pg-stat-label">Envíos a todo México</div></div>
    </div>
    <div class="pg-card" data-animate>
      <h2 class="pg-h2">Lo que nos <em>diferencia</em></h2>
      <div class="pg-grid">
        <div data-animate><p class="pg-h3">Directo de fábrica</p><p class="pg-p">Sin intermediarios. Compramos directo a fabricantes leoneses, eso se refleja en tu precio.</p></div>
        <div class="s1" data-animate><p class="pg-h3">Cambios de talla fáciles</p><p class="pg-p">Te asesoramos por WhatsApp antes de comprar y si la talla no queda, te ayudamos con el cambio.</p></div>
        <div class="s2" data-animate><p class="pg-h3">Calidad seleccionada</p><p class="pg-p">Revisamos cada modelo antes de ofrecerlo. Solo entra al catálogo lo que cumple nuestros estándares.</p></div>
        <div class="s3" data-animate><p class="pg-h3">Envío rápido y seguro</p><p class="pg-p">Fedex, DHL o Estafeta a todo México. Tu pedido llega bien empacado en 3–5 días hábiles.</p></div>
      </div>
    </div>
    <div class="pg-card" data-animate style="background:linear-gradient(135deg,rgba(200,150,122,0.07),rgba(181,104,122,0.04));border-color:rgba(200,150,122,0.22)">
      <h2 class="pg-h2">Nuestra <em>promesa</em></h2>
      <p class="pg-p">Si por cualquier razón el producto que recibes no es lo que esperabas, contáctanos. Somos un negocio familiar y nuestra reputación depende de que estés satisfecha. Respondemos por WhatsApp todos los días.</p>
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:16px">
        <a href="https://wa.me/5214792244560" target="_blank" rel="noopener" class="pg-cta">💬 Escríbenos por WhatsApp</a>
        <button onclick="mostrarCatalogo()" class="pg-cta" style="background:transparent;border:1.5px solid rgba(200,150,122,0.5);color:#C8967A;box-shadow:none">Ver catálogo</button>
      </div>
    </div>
  </div>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"AboutPage","name":"Acerca de Zapatillas May","description":"Zapatillas May es una zapatería familiar en León, Guanajuato. Venta de calzado femenino de moda con envíos a todo México.","url":"https://zapatillasmay.mx/nosotros","mainEntity":{"@type":"LocalBusiness","name":"Zapatillas May","image":"https://res.cloudinary.com/dybdtehhs/image/upload/v1776836428/Proyecto_nuevo_wpdwus.png","address":{"@type":"PostalAddress","streetAddress":"Cuautla 211 Col. Killian","addressLocality":"León","addressRegion":"Guanajuato","postalCode":"37260","addressCountry":"MX"},"telephone":"+5214792244560","url":"https://zapatillasmay.mx"}}
  <\/script>
`,
  '_contacto_old_unused': `REMOVED
  <div style="max-width:900px;margin:0 auto;padding:clamp(32px,6vw,80px) clamp(16px,5vw,40px);overflow-x:hidden">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:40px;align-items:center;margin-bottom:60px">
      <div>
        <h2 style="font-family:var(--font-display);font-size:clamp(1.8rem,4vw,2.5rem);font-weight:400;margin-bottom:20px;line-height:1.2">Nacimos en el <em style="font-style:italic;color:var(--pink)">corazon</em> del calzado mexicano</h2>
        <p style="color:var(--gray-600);line-height:1.8;margin-bottom:16px">Leon, Guanajuato es la capital mundial del calzado, y nosotros somos parte de esa tradicion. Zapatillas May nacio con la mision de llevar moda accesible y de calidad directamente a nuestras clientas.</p>
        <p style="color:var(--gray-600);line-height:1.8;margin-bottom:16px">Trabajamos directamente con fabricantes locales para ofrecerte los mejores precios tanto en menudeo como en mayoreo, sin intermediarios.</p>
        <p style="color:var(--gray-600);line-height:1.8">Cada temporada renovamos nuestro catalogo con los modelos mas trendy — tacones, sandalias, botas y botines — siempre con materiales de calidad y precios justos.</p>
      </div>
      <div style="background:var(--gray-100);border-radius:12px;padding:40px;text-align:center">
        <div style="margin-bottom:16px;display:flex;justify-content:center">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="20" fill="#E91E8C" fill-opacity="0.1"/>
    <path d="M15 55 C15 55 20 45 35 43 C45 42 52 45 58 42 C63 39 65 32 63 28" stroke="#E91E8C" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M63 28 C63 28 64 22 60 20" stroke="#E91E8C" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M15 55 L62 55" stroke="#E91E8C" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M15 55 L15 58 Q38 60 62 58 L62 55" fill="#E91E8C" fill-opacity="0.15"/>
     </svg>
    </div>
        <p style="font-family:var(--font-display);font-size:1.5rem;color:var(--black);margin-bottom:8px">Calzado de moda<br>para dama</p>
        <p style="font-size:0.85rem;color:var(--gray-600)">Leon, Guanajuato · Mexico</p>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px;margin-bottom:60px">
      <div style="background:var(--black);border-radius:12px;padding:28px;text-align:center">
        <div style="font-size:1.8rem;font-family:var(--font-mono);color:var(--pink);margin-bottom:8px">100%</div>
        <p style="color:rgba(255,255,255,0.6);font-size:0.82rem">Calzado mexicano de calidad</p>
      </div>
      <div style="background:var(--black);border-radius:12px;padding:28px;text-align:center">
        <div style="font-size:1.8rem;font-family:var(--font-mono);color:var(--pink);margin-bottom:8px">Leon</div>
        <p style="color:rgba(255,255,255,0.6);font-size:0.82rem">Capital mundial del calzado</p>
      </div>
      <div style="background:var(--black);border-radius:12px;padding:28px;text-align:center">
        <div style="font-size:1.8rem;font-family:var(--font-mono);color:var(--pink);margin-bottom:8px">+50</div>
        <p style="color:rgba(255,255,255,0.6);font-size:0.82rem">Modelos nuevos cada temporada</p>
      </div>
      <div style="background:var(--black);border-radius:12px;padding:28px;text-align:center">
        <div style="font-size:1.8rem;font-family:var(--font-mono);color:var(--pink);margin-bottom:8px">MX</div>
        <p style="color:rgba(255,255,255,0.6);font-size:0.82rem">Envios a todo Mexico</p>
      </div>
    </div>

    <div style="background:var(--gray-100);border-radius:16px;padding:clamp(24px,5vw,48px);margin-bottom:40px">
      <h2 style="font-family:var(--font-display);font-size:clamp(1.5rem,3vw,2rem);font-weight:400;margin-bottom:24px">Nuestros <em style="font-style:italic;color:var(--pink)">valores</em></h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px">
        <div>
          <p style="font-weight:700;margin-bottom:6px">👠 Moda accesible</p>
          <p style="font-size:0.85rem;color:var(--gray-600);line-height:1.7">Precios justos sin sacrificar estilo, para todos los bolsillos.</p>
        </div>
        <div>
          <p style="font-weight:700;margin-bottom:6px">🏭 Hecho en Mexico</p>
          <p style="font-size:0.85rem;color:var(--gray-600);line-height:1.7">Apoyamos a los fabricantes leoneses. Todo nuestro calzado es producido localmente.</p>
        </div>
        <div>
          <p style="font-weight:700;margin-bottom:6px">✨ Calidad garantizada</p>
          <p style="font-size:0.85rem;color:var(--gray-600);line-height:1.7">Seleccionamos cuidadosamente cada modelo antes de ofrecerlo a nuestras clientas.</p>
        </div>
        <div>
          <p style="font-weight:700;margin-bottom:6px">🚚 Envio rapido</p>
          <p style="font-size:0.85rem;color:var(--gray-600);line-height:1.7">Enviamos a todo Mexico por Fedex, DHL o Estafeta. Entrega en 3-5 dias habiles.</p>
        </div>
      </div>
    </div>

    <div style="text-align:center">
      <a href="https://wa.me/5214792244560" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;padding:14px 32px;background:#25D366;color:white;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.85rem">💬 Contactar por WhatsApp</a>
    </div>
  </div>
`,
  'contacto': `
  <div class="pg-hero">
    <p class="pg-hero-eyebrow" data-animate>Estamos aquí para ti · León, Guanajuato</p>
    <h2 class="pg-hero-title" data-animate>Cont<em>acto</em></h2>
    <p class="pg-hero-sub" data-animate>Respondemos por WhatsApp todos los días. También puedes visitarnos o llamarnos directamente.</p>
  </div>
  <div class="pg-body">
    <a href="https://wa.me/5214792244560" target="_blank" rel="noopener" data-animate style="display:flex;align-items:center;gap:16px;padding:20px 24px;background:#25D366;border-radius:16px;text-decoration:none;margin-bottom:14px;transition:transform 0.2s,box-shadow 0.2s;box-shadow:0 4px 16px rgba(37,211,102,0.28);color:white">
      <div style="background:rgba(255,255,255,0.2);border-radius:50%;width:52px;height:52px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1.5rem">💬</div>
      <div>
        <p style="font-weight:700;font-size:1rem;margin-bottom:2px">WhatsApp — canal principal</p>
        <p style="font-size:0.82rem;color:rgba(255,255,255,0.88)">479 224 4560 · Respuesta en menos de 1 hora</p>
      </div>
      <span style="margin-left:auto;font-size:1.4rem;opacity:0.8">→</span>
    </a>
    <div class="pg-grid" style="margin-bottom:20px">
      <div class="pg-card" data-animate style="margin-bottom:0"><p class="pg-h3">📍 Ubicación</p><p class="pg-p">Cuautla 211 Col. Killian<br>León, Guanajuato · CP 37260</p></div>
      <div class="pg-card s1" data-animate style="margin-bottom:0"><p class="pg-h3">🕐 Horarios</p><p class="pg-p">Lun y Sáb: 10:00–15:00<br>Mar–Vie: 10:00–19:00<br>Dom: cerrado</p></div>
      <div class="pg-card s2" data-animate style="margin-bottom:0"><p class="pg-h3">📞 Teléfono</p><p class="pg-p"><a href="tel:+524775308983" style="color:inherit;text-decoration:none">477 530 8983</a></p></div>
      <div class="pg-card s3" data-animate style="margin-bottom:0"><p class="pg-h3">📧 Email</p><p class="pg-p"><a href="mailto:contacto@zapatillasmay.mx" style="color:inherit;text-decoration:none">contacto@zapatillasmay.mx</a></p></div>
    </div>
    <div class="pg-card" data-animate>
      <div style="border-radius:12px;overflow:hidden;height:220px">
        <iframe src="https://www.google.com/maps?q=Zapatillas+May,Cuautla+211,Killian,Leon,Guanajuato&ll=21.1227007,-101.6626636&z=17&output=embed" width="100%" height="220" style="border:0;display:block" allowfullscreen loading="lazy" title="Ubicación Zapatillas May"></iframe>
      </div>
    </div>
    <div class="pg-card" data-animate>
      <h2 class="pg-h2">Enviar <em>mensaje</em></h2>
      <p class="pg-p" style="margin-bottom:16px">Te contactamos de vuelta por correo. ¿Prefieres WhatsApp? Usa el botón de arriba.</p>
      <div style="display:flex;flex-direction:column;gap:12px">
        <div><label class="form-label" for="contacto-nombre">Nombre</label><input type="text" id="contacto-nombre" placeholder="Tu nombre" class="form-input" autocomplete="name"></div>
        <div><label class="form-label" for="contacto-correo">Correo</label><input type="email" id="contacto-correo" placeholder="tu@correo.com" class="form-input" autocomplete="email"></div>
        <div><label class="form-label" for="contacto-msg">Mensaje</label><textarea id="contacto-msg" placeholder="¿En qué te podemos ayudar?" rows="3" class="form-input"></textarea></div>
        <button onclick="enviarContacto()" id="contacto-btn" class="pg-cta" style="width:100%;justify-content:center">✉️ Enviar mensaje →</button>
      </div>
    </div>
    <div data-animate style="text-align:center;padding:8px 0 16px">
      <p class="pg-p" style="margin-bottom:12px">Síguenos en redes sociales</p>
      <div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap">
        <a href="https://www.instagram.com/zapatillas_may" target="_blank" rel="noopener" class="pg-badge" style="text-decoration:none">Instagram</a>
        <a href="https://www.facebook.com/MAYZapatillas/" target="_blank" rel="noopener" class="pg-badge" style="text-decoration:none">Facebook</a>
        <a href="https://tiktok.com/@zapatillasmay" target="_blank" rel="noopener" class="pg-badge" style="text-decoration:none">TikTok</a>
      </div>
    </div>
  </div>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"ContactPage","name":"Contacto — Zapatillas May","url":"https://zapatillasmay.mx/contacto","mainEntity":{"@type":"LocalBusiness","name":"Zapatillas May","telephone":"+5214792244560","email":"contacto@zapatillasmay.mx","address":{"@type":"PostalAddress","streetAddress":"Cuautla 211 Col. Killian","addressLocality":"León","addressRegion":"Guanajuato","postalCode":"37260","addressCountry":"MX"},"openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Saturday"],"opens":"10:00","closes":"15:00"},{"@type":"OpeningHoursSpecification","dayOfWeek":["Tuesday","Wednesday","Thursday","Friday"],"opens":"10:00","closes":"19:00"}]}}
  <\/script>
`,
  'como-comprar': `
  <div class="pg-hero">
    <p class="pg-hero-eyebrow" data-animate>Fácil, rápido y sin complicaciones</p>
    <h2 class="pg-hero-title" data-animate>Cómo <em>comprar</em></h2>
    <p class="pg-hero-sub" data-animate>En 5 pasos tienes tus zapatos favoritos en casa. Sin registro previo ni mínimos de compra.</p>
  </div>
  <div class="pg-body">
    <div class="pg-card" data-animate>
      <h2 class="pg-h2" style="margin-bottom:20px">El proceso, <em>paso a paso</em></h2>
      ${[
        ['1','Explora el catálogo','Navega por categorías — tacones, sandalias, botas, botines y más — o usa el buscador. El stock se actualiza en tiempo real.'],
        ['2','Elige color y talla','Cada modelo muestra los colores y tallas disponibles. Si tienes dudas de talla, revisa nuestra tabla de tallas o escríbenos.'],
        ['3','Agrega al carrito','El precio de 3+ pares se aplica automático según la cantidad de pares que tengas en el carrito. Sin códigos ni trámites.'],
        ['4','Paga en línea','Elige tu forma de pago (tarjeta, SPEI, OXXO o Mercado Pago) y confirma tu pedido. Todo el proceso es en el sitio, sin negociar nada por WhatsApp.'],
        ['5','Recíbelo en tu domicilio','Te llega en 1–3 días hábiles a toda la República, con guía de rastreo por correo. ¡Listo!']
      ].map(([n,t,d],i,arr) => `
        <div style="display:flex;gap:20px;align-items:start;padding:${i>0?'20px 0 0':'0 0 0'}">
          <div style="width:44px;height:44px;background:linear-gradient(135deg,#C8967A,#b5687a);border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);font-weight:700;color:white;font-size:1rem;flex-shrink:0;box-shadow:0 4px 12px rgba(200,150,122,0.35)">${n}</div>
          <div style="flex:1"><p style="font-weight:700;color:#2A1A0E;margin-bottom:4px;font-size:0.95rem">${t}</p><p class="pg-p" style="margin-bottom:0">${d}</p></div>
        </div>
        ${i<arr.length-1?'<div class="pg-divider" style="margin-left:64px"></div>':''}
      `).join('')}
    </div>
    <div class="pg-grid" style="margin-bottom:20px">
      <div class="pg-card" data-animate style="margin-bottom:0">
        <p class="pg-h3">💳 Formas de pago</p>
        <ul class="pg-list" style="margin-top:8px">
          <li>Transferencia SPEI / OXXO Pay</li>
          <li>Mercado Pago (tarjeta o crédito)</li>
          <li>Tarjeta de débito / crédito en tienda</li>
          <li>Efectivo en tienda</li>
        </ul>
      </div>
      <div class="pg-card s1" data-animate style="margin-bottom:0">
        <p class="pg-h3">🚚 Envíos</p>
        <ul class="pg-list" style="margin-top:8px">
          <li>Fedex, DHL o Estafeta</li>
          <li>Entrega en 3–5 días hábiles</li>
          <li>León y zonas cercanas: 1–2 días</li>
          <li>Envío gratis en pedidos desde $1,299</li>
        </ul>
      </div>
    </div>
    <div class="pg-card" data-animate style="background:rgba(200,150,122,0.05);border-color:rgba(200,150,122,0.2)">
      <p class="pg-h3">💡 Preguntas frecuentes</p>
      <p class="pg-p"><strong>¿Hay mínimo de compra?</strong><br>No. Puedes comprar desde 1 par al precio de menudeo, y el descuento de 3+ pares se activa automáticamente. Si compras para revender, conoce nuestros <a href="#" onclick="mostrarPagina('mayoreo');return false" style="color:#C8967A;font-weight:600">precios de mayoreo</a>.</p>
      <div class="pg-divider"></div>
      <p class="pg-p"><strong>¿Cómo sé mi talla?</strong><br>Usamos tallas mexicanas (MX). Revisa la <a href="#" onclick="mostrarPagina('tabla-tallas');return false" style="color:#C8967A;font-weight:600">tabla de tallas</a> o pregúntanos.</p>
      <div class="pg-divider"></div>
      <p class="pg-p"><strong>¿Puedo devolver si no me queda?</strong><br>Sí, tienes 7 días hábiles. Consulta nuestra <a href="#" onclick="mostrarPagina('devoluciones');return false" style="color:#C8967A;font-weight:600">política de devoluciones</a>.</p>
    </div>
    <div data-animate style="text-align:center;padding-bottom:16px">
      <button onclick="mostrarCatalogo()" class="pg-cta" style="border:none;cursor:pointer">🛍️ Empezar a comprar</button>
      <p style="margin-top:14px;font-size:0.8rem;color:var(--gray-600)">¿Dudas antes de comprar? <a href="https://wa.me/5214792244560" target="_blank" rel="noopener" style="color:#C8967A;font-weight:600">Escríbenos por WhatsApp</a></p>
    </div>
  </div>
  `,
  'mayoreo': `
  <style>
    .may-badge{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;background:rgba(200,150,122,0.12);border:1px solid rgba(200,150,122,0.28);border-radius:100px;font-size:0.7rem;font-weight:700;color:#8B5E4A;text-transform:uppercase;letter-spacing:0.08em}
    .may-tier{border-radius:14px;padding:22px 18px;text-align:center}
    .may-tier-bar{height:4px;border-radius:100px;margin:14px 0 12px}
    .may-why{background:var(--gray-100);border-radius:12px;padding:22px 18px;border:1px solid var(--gray-200);text-align:center}
    .may-why-icon{width:44px;height:44px;background:linear-gradient(135deg,#C8967A,#b5687a);border-radius:12px;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;font-size:1.3rem}
    .may-testi{background:var(--white);border:1px solid var(--gray-200);border-radius:12px;padding:22px;display:flex;flex-direction:column;gap:0}
    .may-avatar{width:36px;height:36px;background:linear-gradient(135deg,#C8967A,#b5687a);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:0.85rem;flex-shrink:0}
    .may-input{border:1.5px solid rgba(245,240,232,0.2);background:rgba(245,240,232,0.07);border-radius:10px;padding:14px 16px;font-family:var(--font-body);font-size:0.9rem;color:var(--white);outline:none;width:100%;box-sizing:border-box}
    .may-input::placeholder{color:rgba(245,240,232,0.4)}
    .may-sticky{display:none;position:fixed;left:0;right:0;z-index:9001;padding:10px 16px 12px;background:rgba(250,248,246,0.97);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-top:1px solid rgba(200,150,122,0.18);box-shadow:0 -4px 24px rgba(42,26,14,0.1);gap:10px;bottom:calc(60px + env(safe-area-inset-bottom))}
    @media(max-width:767px){
      .may-sticky{display:flex}
      .may-mobile-col{flex-direction:column!important}
      .may-pc-2col{grid-template-columns:1fr!important}
    }
  </style>

  <div class="pg-hero" style="padding-top:20px">
    <p class="pg-hero-eyebrow" data-animate>Calzado de Leon, Gto. · Para revendedoras y zapaterias</p>
    <h2 class="pg-hero-title" data-animate>¿Buscas revender calzado?<br><em>Hazlo sin complicaciones</em></h2>
    <p class="pg-hero-sub" data-animate>Comprando aqui mismo ya tienes descuento automatico desde 3 pares. Para tu catalogo completo, tu corrida armada y tus precios preferenciales por mayor volumen, entra al Portal de Mayoristas.</p>
    <div data-animate style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:22px">
      <span class="may-badge">📍 Fabrica propia en Leon, Gto.</span>
      <span class="may-badge">👠 +500 revendedoras activas</span>
      <span class="may-badge">💰 Descuentos especiales y precios de corrida</span>
    </div>
    <div data-animate style="margin-top:22px">
      <a href="https://portal.zapatillasmay.mx" target="_blank" rel="noopener" class="pg-cta">🔑 Entrar al Portal de Mayoristas →</a>
    </div>
  </div>

  <div class="pg-body">
    <div data-animate style="background:linear-gradient(135deg,#E91E8C,#c8967a);border-radius:18px;padding:28px 26px;margin-bottom:28px;color:white;text-align:center">
      <p style="font-size:0.72rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;opacity:0.85;margin:0 0 10px">Tienes zapateria o vendes por catalogo?</p>
      <p style="font-size:1.35rem;font-weight:800;margin:0 0 12px;line-height:1.3">Entra al Portal de Mayoristas</p>
      <p style="font-size:0.9rem;opacity:0.95;margin:0 0 18px;line-height:1.6">Descarga catalogos con fotos por categoria, arma tu corrida por talla y color, ve tus precios especiales y haz tu pedido directo desde tu celular.</p>
      <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:20px">
        <span style="background:rgba(255,255,255,0.18);border-radius:100px;padding:6px 14px;font-size:0.76rem;font-weight:600">📥 Catalogos por categoria</span>
        <span style="background:rgba(255,255,255,0.18);border-radius:100px;padding:6px 14px;font-size:0.76rem;font-weight:600">👟 Arma tu corrida</span>
        <span style="background:rgba(255,255,255,0.18);border-radius:100px;padding:6px 14px;font-size:0.76rem;font-weight:600">📱 Pide desde tu celular</span>
      </div>
      <a href="https://portal.zapatillasmay.mx" target="_blank" rel="noopener" style="display:inline-block;background:white;color:#E91E8C;font-weight:800;text-decoration:none;padding:13px 30px;border-radius:100px;font-size:0.92rem">Entrar al portal de mayoristas →</a>
    </div>

    <!-- EJEMPLOS DE DESCUENTO -->
    <div data-animate style="margin-bottom:56px">
      <h2 style="font-family:var(--font-display);font-size:clamp(1.6rem,3.5vw,2.4rem);font-weight:400;text-align:center;margin-bottom:8px;color:var(--black)">Ejemplo de <em style="font-style:normal;color:var(--pink)">precios de mayoreo</em></h2>
      <p style="text-align:center;color:var(--gray-600);font-size:0.86rem;margin-bottom:8px;max-width:480px;margin-left:auto;margin-right:auto">Ilustrativo, tomando como base el precio de menudeo de cada modelo. Tus precios reales, por modelo, los ves con tu cuenta dentro del Portal de Mayoristas.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;max-width:820px;margin:24px auto 0">
        <div style="border-radius:14px;padding:20px 16px;text-align:center;border:1.5px solid var(--gray-200);background:var(--white)">
          <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:1px;color:var(--gray-600);margin-bottom:8px">1–2 pares</div>
          <div style="font-weight:700;font-size:1rem;color:var(--black)">Precio menudeo</div>
        </div>
        <div style="border-radius:14px;padding:20px 16px;text-align:center;border:1.5px solid rgba(200,150,122,0.4);background:linear-gradient(135deg,rgba(200,150,122,0.08),rgba(181,104,122,0.04))">
          <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:1px;color:var(--gray-600);margin-bottom:8px">3–5 pares</div>
          <div style="font-weight:700;font-size:1rem;color:var(--pink)">-$60 por par*</div>
        </div>
        <div style="border-radius:14px;padding:20px 16px;text-align:center;border:1.5px solid rgba(181,104,122,0.5);background:linear-gradient(135deg,rgba(181,104,122,0.12),rgba(200,150,122,0.06))">
          <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:1px;color:var(--gray-600);margin-bottom:8px">6+ pares</div>
          <div style="font-weight:700;font-size:1rem;color:var(--pink)">-$100 por par*</div>
        </div>
        <div style="border-radius:14px;padding:20px 16px;text-align:center;border:2px solid var(--black);background:var(--black);position:relative">
          <div style="position:absolute;top:-11px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#C8967A,#b5687a);color:white;font-size:0.55rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:3px 10px;border-radius:100px;white-space:nowrap">Mejor precio</div>
          <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:1px;color:rgba(245,240,232,0.6);margin-bottom:8px">Corrida completa</div>
          <div style="font-weight:700;font-size:1rem;color:#7CFFB2">-$180 por par*</div>
        </div>
      </div>
      <p style="text-align:center;color:var(--gray-600);font-size:0.72rem;margin-top:10px">*Ejemplo ilustrativo. El precio de 3-5 pares ya se aplica automatico comprando en zapatillasmay.mx. El precio de 6+ pares, tu corrida armada y tu catalogo completo estan disponibles registrandote en el Portal de Mayoristas.</p>
      <div style="text-align:center;margin-top:20px">
        <a href="https://portal.zapatillasmay.mx" target="_blank" rel="noopener" class="pg-cta">🔑 Registrarme y ver mis precios →</a>
      </div>
    </div>

    <!-- ¿BUSCAS REVENDER? -->
    <div data-animate style="margin-bottom:56px">
      <h2 style="font-family:var(--font-display);font-size:clamp(1.6rem,3.5vw,2.4rem);font-weight:400;text-align:center;margin-bottom:8px;color:var(--black)">¿Buscas <em style="font-style:normal;color:var(--pink)">revender calzado</em>?</h2>
      <p style="text-align:center;color:var(--gray-600);font-size:0.86rem;margin-bottom:32px;max-width:480px;margin-left:auto;margin-right:auto">Tus precios preferenciales, catálogo completo con fotos y tu corrida armada por talla y color te esperan en el Portal de Mayoristas.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px">

        <div class="may-tier" style="border:1.5px solid var(--gray-200);background:var(--white)">
          <div style="font-size:1.6rem;margin-bottom:10px">🛍️</div>
          <p style="font-weight:700;font-size:0.88rem;color:var(--black);margin-bottom:6px">Surtido variado</p>
          <p style="font-size:0.75rem;color:var(--gray-600);line-height:1.55">Mezcla modelos y colores libremente para armar tu pedido</p>
        </div>

        <div class="may-tier" style="border:1.5px solid rgba(200,150,122,0.35);background:linear-gradient(135deg,rgba(200,150,122,0.06),rgba(181,104,122,0.03))">
          <div style="font-size:1.6rem;margin-bottom:10px">👟</div>
          <p style="font-weight:700;font-size:0.88rem;color:var(--black);margin-bottom:6px">Corridas completas</p>
          <p style="font-size:0.75rem;color:var(--gray-600);line-height:1.55">Mismo modelo y color en todas las tallas, listo para tu tienda</p>
        </div>

        <div class="may-tier" style="border:1.5px solid rgba(181,104,122,0.4);background:linear-gradient(135deg,rgba(181,104,122,0.08),rgba(200,150,122,0.05))">
          <div style="font-size:1.6rem;margin-bottom:10px">📥</div>
          <p style="font-weight:700;font-size:0.88rem;color:var(--black);margin-bottom:6px">Catálogo con fotos</p>
          <p style="font-size:0.75rem;color:var(--gray-600);line-height:1.55">Material fotográfico por categoría, listo para vender en redes</p>
        </div>

        <div class="may-tier" style="border:2px solid var(--black);background:var(--black);position:relative">
          <div style="position:absolute;top:-11px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#C8967A,#b5687a);color:white;font-size:0.58rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:3px 12px;border-radius:100px;white-space:nowrap">En el portal</div>
          <div style="font-size:1.6rem;margin-bottom:10px">💰</div>
          <p style="font-weight:700;font-size:0.88rem;color:var(--white);margin-bottom:6px">Precios preferenciales</p>
          <p style="font-size:0.75rem;color:rgba(245,240,232,0.55);line-height:1.55">Tu lista de precios especial, visible solo con tu cuenta</p>
        </div>

      </div>
      <div style="text-align:center;margin-top:28px">
        <a href="https://portal.zapatillasmay.mx" target="_blank" rel="noopener" class="pg-cta">🔑 Entrar al Portal de Mayoristas →</a>
      </div>
    </div>

    <!-- POR QUE NOSOTROS -->
    <div style="margin-bottom:56px">
      <h2 data-animate style="font-family:var(--font-display);font-size:clamp(1.6rem,3.5vw,2.4rem);font-weight:400;text-align:center;margin-bottom:8px;color:var(--black)">Zapatos dama por <em style="font-style:normal;color:var(--pink)">mayoreo en Mexico</em></h2>
      <p style="text-align:center;color:var(--gray-600);font-size:0.86rem;margin-bottom:30px">Por que cientos de revendedoras nos eligen</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px">
        <div class="may-why s1" data-animate>
          <div class="may-why-icon">👠</div>
          <p style="font-weight:700;font-size:0.9rem;color:var(--black);margin-bottom:6px">Fabrica propia en Leon</p>
          <p style="font-size:0.79rem;color:var(--gray-600);line-height:1.65">Sin intermediarios. Calidad directa de la capital del calzado de Mexico.</p>
        </div>
        <div class="may-why s2" data-animate>
          <div class="may-why-icon">🔄</div>
          <p style="font-weight:700;font-size:0.9rem;color:var(--black);margin-bottom:6px">Registro gratis y sin contratos</p>
          <p style="font-size:0.79rem;color:var(--gray-600);line-height:1.65">Sin minimo de pedido ni permanencia. Te registras una vez en el portal y listo.</p>
        </div>
        <div class="may-why s3" data-animate>
          <div class="may-why-icon">✨</div>
          <p style="font-weight:700;font-size:0.9rem;color:var(--black);margin-bottom:6px">Modelos de temporada</p>
          <p style="font-size:0.79rem;color:var(--gray-600);line-height:1.65">Tacones, sandalias, botas y botines que se venden. Material fotografico incluido.</p>
        </div>
        <div class="may-why s4" data-animate>
          <div class="may-why-icon">📦</div>
          <p style="font-weight:700;font-size:0.9rem;color:var(--black);margin-bottom:6px">Entrega en 3 a 5 dias</p>
          <p style="font-size:0.79rem;color:var(--gray-600);line-height:1.65">Fedex, DHL y Estafeta a toda la Republica. Empaque individual por par.</p>
        </div>
      </div>
    </div>

    <!-- TESTIMONIOS -->
    <div style="margin-bottom:56px">
      <h2 data-animate style="font-family:var(--font-display);font-size:clamp(1.6rem,3.5vw,2.4rem);font-weight:400;text-align:center;margin-bottom:28px;color:var(--black)">Lo que dicen nuestras <em style="font-style:normal;color:var(--pink)">revendedoras</em></h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px">

        <div class="may-testi s1" data-animate>
          <div style="display:flex;gap:2px;margin-bottom:12px"><span style="color:#C8967A;font-size:0.85rem">&#9733;&#9733;&#9733;&#9733;&#9733;</span></div>
          <p style="font-size:0.84rem;color:#5a4030;line-height:1.75;margin-bottom:16px;flex:1">"Llevo 2 anos comprando con May. Los tacones se venden solos en mi tienda. Me registre en el portal sin ningun tramite complicado y ahora pido corridas completas."</p>
          <div style="display:flex;align-items:center;gap:10px">
            <div class="may-avatar">A</div>
            <div>
              <p style="font-weight:700;font-size:0.8rem;color:var(--black);margin-bottom:1px">Ana Ramirez</p>
              <p style="font-size:0.7rem;color:var(--gray-600)">Revendedora, Ciudad de Mexico</p>
            </div>
          </div>
        </div>

        <div class="may-testi s2" data-animate>
          <div style="display:flex;gap:2px;margin-bottom:12px"><span style="color:#C8967A;font-size:0.85rem">&#9733;&#9733;&#9733;&#9733;&#9733;</span></div>
          <p style="font-size:0.84rem;color:#5a4030;line-height:1.75;margin-bottom:16px;flex:1">"Me conviene mezclar modelos para llegar al precio de mayoreo. Las sandalias de temporada se agotan rapidisimo. Muy buen surtido y la atencion es excelente."</p>
          <div style="display:flex;align-items:center;gap:10px">
            <div class="may-avatar">P</div>
            <div>
              <p style="font-weight:700;font-size:0.8rem;color:var(--black);margin-bottom:1px">Patricia Morales</p>
              <p style="font-size:0.7rem;color:var(--gray-600)">Zapateria propia, Monterrey</p>
            </div>
          </div>
        </div>

        <div class="may-testi s3" data-animate>
          <div style="display:flex;gap:2px;margin-bottom:12px"><span style="color:#C8967A;font-size:0.85rem">&#9733;&#9733;&#9733;&#9733;&#9733;</span></div>
          <p style="font-size:0.84rem;color:#5a4030;line-height:1.75;margin-bottom:16px;flex:1">"Me ayudan por WhatsApp a elegir los modelos que mas se venden en Guadalajara. Ya voy por mi cuarto pedido. El envio llega rapido y bien empacado."</p>
          <div style="display:flex;align-items:center;gap:10px">
            <div class="may-avatar">C</div>
            <div>
              <p style="font-weight:700;font-size:0.8rem;color:var(--black);margin-bottom:1px">Claudia Espinoza</p>
              <p style="font-size:0.7rem;color:var(--gray-600)">Boutique online, Guadalajara</p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- QUE INCLUYE -->
    <div style="margin-bottom:56px">
      <h2 data-animate style="font-family:var(--font-display);font-size:clamp(1.6rem,3.5vw,2.4rem);font-weight:400;margin-bottom:28px;text-align:center">Que <em style="font-style:normal;color:var(--pink)">incluye</em> tu pedido</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px">
        <div data-animate class="s1" style="background:var(--gray-100);border-radius:10px;padding:20px 18px;border:1px solid var(--gray-200)">
          <div style="font-size:1.5rem;margin-bottom:10px">📦</div>
          <p style="font-weight:700;margin-bottom:5px;font-size:0.88rem;color:var(--black)">Empaque cuidadoso</p>
          <p style="font-size:0.79rem;color:var(--gray-600);line-height:1.65">Cada par en su caja individual protegida para llegar en perfectas condiciones.</p>
        </div>
        <div data-animate class="s2" style="background:var(--gray-100);border-radius:10px;padding:20px 18px;border:1px solid var(--gray-200)">
          <div style="font-size:1.5rem;margin-bottom:10px">🚚</div>
          <p style="font-weight:700;margin-bottom:5px;font-size:0.88rem;color:var(--black)">Envio a toda la Republica</p>
          <p style="font-size:0.79rem;color:var(--gray-600);line-height:1.65">Fedex, DHL y Estafeta. Entrega en 3 a 5 dias habiles a todo Mexico.</p>
        </div>
        <div data-animate class="s3" style="background:var(--gray-100);border-radius:10px;padding:20px 18px;border:1px solid var(--gray-200)">
          <div style="font-size:1.5rem;margin-bottom:10px">💬</div>
          <p style="font-weight:700;margin-bottom:5px;font-size:0.88rem;color:var(--black)">Asesoria por WhatsApp</p>
          <p style="font-size:0.79rem;color:var(--gray-600);line-height:1.65">Te ayudamos a elegir los modelos que mejor se venden en tu zona.</p>
        </div>
        <div data-animate class="s4" style="background:var(--gray-100);border-radius:10px;padding:20px 18px;border:1px solid var(--gray-200)">
          <div style="font-size:1.5rem;margin-bottom:10px">🔄</div>
          <p style="font-weight:700;margin-bottom:5px;font-size:0.88rem;color:var(--black)">Mezcla de modelos</p>
          <p style="font-size:0.79rem;color:var(--gray-600);line-height:1.65">Combina estilos y colores en un pedido para alcanzar el descuento por varios pares.</p>
        </div>
        <div data-animate class="s4" style="background:var(--gray-100);border-radius:10px;padding:20px 18px;border:1px solid var(--gray-200)">
          <div style="font-size:1.5rem;margin-bottom:10px">📸</div>
          <p style="font-weight:700;margin-bottom:5px;font-size:0.88rem;color:var(--black)">Fotos profesionales</p>
          <p style="font-size:0.79rem;color:var(--gray-600);line-height:1.65">Material fotografico de los productos para venderlos en redes sociales.</p>
        </div>
      </div>
    </div>

    <!-- FAQ -->
    <div data-animate style="margin-bottom:56px">
      <h2 style="font-family:var(--font-display);font-size:clamp(1.6rem,3.5vw,2.4rem);font-weight:400;margin-bottom:24px;text-align:center">Preguntas <em style="font-style:normal;color:var(--pink)">frecuentes</em></h2>
      <div style="display:flex;flex-direction:column;gap:10px">

        <div style="border:1px solid var(--gray-200);border-radius:10px;overflow:hidden">
          <div style="padding:16px 20px;font-weight:600;font-size:0.88rem;background:var(--white);cursor:pointer;display:flex;justify-content:space-between;align-items:center;color:var(--black);gap:12px" role="button" tabindex="0" onclick="var a=this.nextElementSibling,s=this.querySelector('.faq-ic'),o=a.style.display==='block';a.style.display=o?'none':'block';s.textContent=o?'+':'-'" onkeydown="if(event.key==='Enter'||event.key===' '){var a=this.nextElementSibling,s=this.querySelector('.faq-ic'),o=a.style.display==='block';a.style.display=o?'none':'block';s.textContent=o?'+':'-'}">
            <span>Hay minimo de compra para mayoreo?</span>
            <span class="faq-ic" style="color:var(--pink);font-size:1.3rem;font-weight:300;flex-shrink:0;line-height:1;margin-left:8px">+</span>
          </div>
          <div style="display:none;padding:0 20px 16px;font-size:0.84rem;color:var(--gray-600);line-height:1.75">No hay minimo de registro ni de compra. Comprando en zapatillasmay.mx, el descuento de 3-5 pares se aplica automatico. El precio de 6+ pares, tu corrida armada y tu catalogo completo estan disponibles registrandote en el Portal de Mayoristas.</div>
        </div>

        <div style="border:1px solid var(--gray-200);border-radius:10px;overflow:hidden">
          <div style="padding:16px 20px;font-weight:600;font-size:0.88rem;background:var(--white);cursor:pointer;display:flex;justify-content:space-between;align-items:center;color:var(--black);gap:12px" role="button" tabindex="0" onclick="var a=this.nextElementSibling,s=this.querySelector('.faq-ic'),o=a.style.display==='block';a.style.display=o?'none':'block';s.textContent=o?'+':'-'" onkeydown="if(event.key==='Enter'||event.key===' '){var a=this.nextElementSibling,s=this.querySelector('.faq-ic'),o=a.style.display==='block';a.style.display=o?'none':'block';s.textContent=o?'+':'-'}">
            <span>Puedo mezclar modelos y colores en un pedido?</span>
            <span class="faq-ic" style="color:var(--pink);font-size:1.3rem;font-weight:300;flex-shrink:0;line-height:1;margin-left:8px">+</span>
          </div>
          <div style="display:none;padding:0 20px 16px;font-size:0.84rem;color:var(--gray-600);line-height:1.75">Si. El descuento por varios pares se calcula por el total de pares en tu pedido, sin importar si son modelos o colores diferentes. Puedes mezclar tacones, sandalias, botas y botines.</div>
        </div>

        <div style="border:1px solid var(--gray-200);border-radius:10px;overflow:hidden">
          <div style="padding:16px 20px;font-weight:600;font-size:0.88rem;background:var(--white);cursor:pointer;display:flex;justify-content:space-between;align-items:center;color:var(--black);gap:12px" role="button" tabindex="0" onclick="var a=this.nextElementSibling,s=this.querySelector('.faq-ic'),o=a.style.display==='block';a.style.display=o?'none':'block';s.textContent=o?'+':'-'" onkeydown="if(event.key==='Enter'||event.key===' '){var a=this.nextElementSibling,s=this.querySelector('.faq-ic'),o=a.style.display==='block';a.style.display=o?'none':'block';s.textContent=o?'+':'-'}">
            <span>Que es una corrida completa de calzado?</span>
            <span class="faq-ic" style="color:var(--pink);font-size:1.3rem;font-weight:300;flex-shrink:0;line-height:1;margin-left:8px">+</span>
          </div>
          <div style="display:none;padding:0 20px 16px;font-size:0.84rem;color:var(--gray-600);line-height:1.75">Es el mismo modelo y color en todas las tallas disponibles, generalmente del 23 al 26. Es la opcion con mejor precio por par de todo el catalogo.
            <br><br>¿Buscas comprar por corrida? <a href="https://portal.zapatillasmay.mx" target="_blank" rel="noopener" style="color:var(--pink);font-weight:600;text-decoration:underline">Entra al Portal de Mayoristas →</a>
          </div>
        </div>

        <div style="border:1px solid var(--gray-200);border-radius:10px;overflow:hidden">
          <div style="padding:16px 20px;font-weight:600;font-size:0.88rem;background:var(--white);cursor:pointer;display:flex;justify-content:space-between;align-items:center;color:var(--black);gap:12px" role="button" tabindex="0" onclick="var a=this.nextElementSibling,s=this.querySelector('.faq-ic'),o=a.style.display==='block';a.style.display=o?'none':'block';s.textContent=o?'+':'-'" onkeydown="if(event.key==='Enter'||event.key===' '){var a=this.nextElementSibling,s=this.querySelector('.faq-ic'),o=a.style.display==='block';a.style.display=o?'none':'block';s.textContent=o?'+':'-'}">
            <span>Como se hace el pago para pedidos de mayoreo?</span>
            <span class="faq-ic" style="color:var(--pink);font-size:1.3rem;font-weight:300;flex-shrink:0;line-height:1;margin-left:8px">+</span>
          </div>
          <div style="display:none;padding:0 20px 16px;font-size:0.84rem;color:var(--gray-600);line-height:1.75">Aceptamos transferencia SPEI, tarjeta de credito o debito, OXXO y Mercado Pago. Tambien efectivo si recoges en nuestra tienda en Leon, Guanajuato.</div>
        </div>

        <div style="border:1px solid var(--gray-200);border-radius:10px;overflow:hidden">
          <div style="padding:16px 20px;font-weight:600;font-size:0.88rem;background:var(--white);cursor:pointer;display:flex;justify-content:space-between;align-items:center;color:var(--black);gap:12px" role="button" tabindex="0" onclick="var a=this.nextElementSibling,s=this.querySelector('.faq-ic'),o=a.style.display==='block';a.style.display=o?'none':'block';s.textContent=o?'+':'-'" onkeydown="if(event.key==='Enter'||event.key===' '){var a=this.nextElementSibling,s=this.querySelector('.faq-ic'),o=a.style.display==='block';a.style.display=o?'none':'block';s.textContent=o?'+':'-'}">
            <span>Hacen envios de calzado mayoreo fuera de Mexico?</span>
            <span class="faq-ic" style="color:var(--pink);font-size:1.3rem;font-weight:300;flex-shrink:0;line-height:1;margin-left:8px">+</span>
          </div>
          <div style="display:none;padding:0 20px 16px;font-size:0.84rem;color:var(--gray-600);line-height:1.75">Por el momento solo enviamos dentro de la Republica Mexicana con Fedex, DHL o Estafeta. Entrega en 3 a 5 dias habiles a cualquier estado.</div>
        </div>

        <div style="border:1px solid var(--gray-200);border-radius:10px;overflow:hidden">
          <div style="padding:16px 20px;font-weight:600;font-size:0.88rem;background:var(--white);cursor:pointer;display:flex;justify-content:space-between;align-items:center;color:var(--black);gap:12px" role="button" tabindex="0" onclick="var a=this.nextElementSibling,s=this.querySelector('.faq-ic'),o=a.style.display==='block';a.style.display=o?'none':'block';s.textContent=o?'+':'-'" onkeydown="if(event.key==='Enter'||event.key===' '){var a=this.nextElementSibling,s=this.querySelector('.faq-ic'),o=a.style.display==='block';a.style.display=o?'none':'block';s.textContent=o?'+':'-'}">
            <span>Puedo ver los productos antes de hacer mi pedido?</span>
            <span class="faq-ic" style="color:var(--pink);font-size:1.3rem;font-weight:300;flex-shrink:0;line-height:1;margin-left:8px">+</span>
          </div>
          <div style="display:none;padding:0 20px 16px;font-size:0.84rem;color:var(--gray-600);line-height:1.75">Si, puedes visitar nuestra tienda en Leon, Guanajuato. Tambien te enviamos fotos y videos por WhatsApp antes de confirmar tu pedido para que veas exactamente lo que vas a recibir.</div>
        </div>

      </div>
    </div>

    <!-- FORM REVENDEDORA - BOTON CORREGIDO -->
    <div data-animate style="background:linear-gradient(135deg,#2A1A0E,#4a2c1a);border-radius:16px;padding:clamp(28px,5vw,48px);margin-bottom:40px">
      <h2 style="font-family:var(--font-display);font-size:clamp(1.5rem,3vw,2.2rem);font-weight:400;color:var(--white);text-align:center;margin-bottom:6px">Conviertete en <em style="font-style:normal;font-weight:500;color:var(--pink)">revendedora</em></h2>
      <p style="color:rgba(245,240,232,0.55);font-size:0.84rem;text-align:center;margin-bottom:28px;max-width:440px;margin-left:auto;margin-right:auto">Dejanos tus datos y te contactamos por WhatsApp para asesorarte con los modelos que mejor se venden en tu zona.</p>
      <div id="may-form" style="max-width:460px;margin:0 auto;display:grid;gap:12px">
        <input id="may-nombre" class="may-input" placeholder="Tu nombre *" autocomplete="name">
        <input id="may-negocio" class="may-input" placeholder="Nombre de tu negocio (opcional)">
        <div class="may-pc-2col" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <input id="may-ciudad" class="may-input" placeholder="Ciudad *">
          <input id="may-telefono" class="may-input" type="tel" placeholder="WhatsApp *" autocomplete="tel">
        </div>
        <input id="may-email" class="may-input" type="email" placeholder="Email (opcional)" autocomplete="email">
        <button onclick="registrarMayorista()" id="may-btn" style="width:100%;box-sizing:border-box;background:linear-gradient(135deg,#C8967A,#b5687a);color:white;border:none;border-radius:100px;padding:16px 24px;font-family:var(--font-body);font-size:0.9rem;font-weight:700;cursor:pointer;margin-top:4px;transition:opacity 0.2s,transform 0.15s;display:block;text-align:center" onmouseenter="this.style.opacity='0.9'" onmouseleave="this.style.opacity='1'">Quiero ser revendedora</button>
      </div>
      <div id="may-ok" style="display:none;text-align:center;color:var(--white);padding:28px 0">
        <div style="font-size:2.5rem;margin-bottom:10px">🎉</div>
        <p style="font-size:1.1rem;font-weight:600;margin-bottom:6px">Solicitud recibida!</p>
        <p style="font-size:0.84rem;color:rgba(245,240,232,0.6)">Te contactaremos muy pronto por WhatsApp.</p>
      </div>
    </div>

    <!-- CTAs FINALES -->
    <div data-animate style="text-align:center;padding:8px 0 32px">
      <a href="https://wa.me/5214792244560?text=Hola%2C%20tengo%20dudas%20sobre%20los%20precios%20de%20mayoreo.%20%C2%BFMe%20pueden%20ayudar%3F" target="_blank" rel="noopener" class="pg-cta">💬 ¿Dudas sobre precios? Escríbenos</a>
      <div style="margin-top:12px">
        <button onclick="mostrarCatalogo()" class="pg-cta" style="background:linear-gradient(135deg,#2A1A0E,#4a2c1a)">👠 Ver catálogo</button>
      </div>
    </div>

  </div>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Hay minimo de compra para mayoreo en Zapatillas May?",
        "acceptedAnswer": { "@type": "Answer", "text": "No hay minimo de registro ni de compra. Comprando en zapatillasmay.mx el descuento de 3-5 pares se aplica automatico. El precio de 6+ pares y tu corrida armada estan disponibles registrandote en el Portal de Mayoristas." }
      },
      {
        "@type": "Question",
        "name": "Puedo mezclar modelos y colores en un pedido de calzado mayoreo?",
        "acceptedAnswer": { "@type": "Answer", "text": "Si. El descuento por varios pares se calcula por el total de pares en tu pedido, sin importar si son modelos o colores diferentes. Puedes mezclar tacones, sandalias, botas y botines." }
      },
      {
        "@type": "Question",
        "name": "Que es una corrida completa de calzado en Leon Guanajuato?",
        "acceptedAnswer": { "@type": "Answer", "text": "Es el mismo modelo y color en todas las tallas disponibles, generalmente del 23 al 26. Es la opcion con mejor precio por par de todo el catalogo." }
      },
      {
        "@type": "Question",
        "name": "Como se hace el pago para pedidos de zapatos por mayoreo?",
        "acceptedAnswer": { "@type": "Answer", "text": "Aceptamos transferencia SPEI, tarjeta de credito o debito, OXXO y Mercado Pago. Tambien efectivo si recoges en nuestra tienda en Leon, Guanajuato." }
      },
      {
        "@type": "Question",
        "name": "Hacen envios de calzado mayoreo a toda la Republica Mexicana?",
        "acceptedAnswer": { "@type": "Answer", "text": "Si, enviamos a toda la Republica Mexicana con Fedex, DHL o Estafeta. La entrega tarda entre 3 y 5 dias habiles." }
      },
      {
        "@type": "Question",
        "name": "Puedo ver los productos de calzado mayoreo antes de comprar?",
        "acceptedAnswer": { "@type": "Answer", "text": "Si, puedes visitar nuestra tienda en Leon, Guanajuato. Tambien enviamos fotos y videos por WhatsApp antes de confirmar tu pedido." }
      }
    ]
  }
  <\/script>
`,
  'devoluciones': `
  <div class="pg-hero">
    <p class="pg-hero-eyebrow">Tu satisfacción es lo primero</p>
    <h2 class="pg-hero-title">Devoluc<em>iones</em></h2>
  </div>
  <div class="pg-body">
    <div class="pg-card">
      <p class="pg-h3">1. Plazo</p><p class="pg-p">Cuentas con <strong>7 días hábiles</strong> desde la recepción para solicitar una devolución.</p>
      <div class="pg-divider"></div>
      <p class="pg-h3">2. Motivos válidos sin costo</p>
      <ul class="pg-list"><li>Producto recibido en mal estado</li><li>Producto incorrecto (diferente al solicitado)</li></ul>
      <div class="pg-divider"></div>
      <p class="pg-h3">3. Condiciones del producto</p>
      <ul class="pg-list"><li>Sin señales de uso</li><li>Empaque original conservado</li><li>Sin daños ocasionados por el cliente</li></ul>
      <div class="pg-divider"></div>
      <p class="pg-h3">4. Proceso</p>
      <ul class="pg-list"><li>WhatsApp: +52 1 479 224 4560</li><li>Email: contacto@zapatillasmay.mx</li></ul>
      <p class="pg-p">Te proporcionamos guía de retorno e indicaciones de envío.</p>
      <div class="pg-divider"></div>
      <p class="pg-h3">5. Reembolso</p>
      <p class="pg-p">Una vez validado el producto, el reembolso se procesa en <strong>4 días hábiles</strong>.</p>
    </div>
    <div style="text-align:center;padding-bottom:16px">
      <a href="https://wa.me/5214792244560" target="_blank" rel="noopener" class="pg-cta">💬 Contactar por WhatsApp</a>
    </div>
  </div>
  `,
  'privacidad': `
  <div class="pg-hero">
    <p class="pg-hero-eyebrow">Transparencia y confianza</p>
    <h2 class="pg-hero-title">Privac<em>idad</em></h2>
  </div>
  <div class="pg-body">
    <div class="pg-card">
      <p class="pg-h3">1. Información que recopilamos</p>
      <p class="pg-p">Nombre, correo electrónico, teléfono y dirección de envío cuando realizas un pedido o nos contactas.</p>
      <div class="pg-divider"></div>
      <p class="pg-h3">2. Uso de la información</p>
      <p class="pg-p">Procesamos pedidos, respondemos consultas y mejoramos nuestros servicios. No vendemos ni compartimos tu información con terceros.</p>
      <div class="pg-divider"></div>
      <p class="pg-h3">3. WhatsApp y comunicaciones</p>
      <p class="pg-p">Al contactarnos por WhatsApp aceptas recibir respuestas de nuestro asistente. No compartimos tu número con terceros.</p>
      <div class="pg-divider"></div>
      <p class="pg-h3">4. Cookies</p>
      <p class="pg-p">Usamos cookies para mejorar tu experiencia. Puedes desactivarlas en la configuración de tu navegador.</p>
      <div class="pg-divider"></div>
      <p class="pg-h3">5. Seguridad</p>
      <p class="pg-p">Implementamos medidas de seguridad para proteger tu información personal contra acceso no autorizado.</p>
      <div class="pg-divider"></div>
      <p class="pg-h3">6. Tus derechos</p>
      <ul class="pg-list"><li>WhatsApp: +52 477 804 7982</li><li>León, Guanajuato, México</li></ul>
    </div>
    <div style="text-align:center;padding-bottom:16px">
      <a href="https://wa.me/5214792244560" target="_blank" rel="noopener" class="pg-cta">💬 Contactar por WhatsApp</a>
    </div>
  </div>
  `,
  'envios': `
  <div class="pg-hero">
    <p class="pg-hero-eyebrow" data-animate>Enviamos a toda la República Mexicana</p>
    <h2 class="pg-hero-title" data-animate>Env<em>íos</em></h2>
    <p class="pg-hero-sub" data-animate>Fedex, DHL o Estafeta. Entrega rápida, empaque seguro, seguimiento en tiempo real.</p>
  </div>
  <div class="pg-body">
    <div class="pg-grid" style="margin-bottom:20px">
      <div class="pg-card" data-animate style="margin-bottom:0">
        <p class="pg-h3">📦 Envío a domicilio</p>
        <p class="pg-p">Enviamos por Fedex, DHL o Estafeta a cualquier punto de México. El costo depende del peso del paquete y la distancia al destino.</p>
        <p class="pg-p" style="font-weight:600;color:#C8967A;margin-bottom:0">Envío gratis en pedidos de $1,299 o más</p>
      </div>
      <div class="pg-card s1" data-animate style="margin-bottom:0">
        <p class="pg-h3">🏪 Recoger en tienda</p>
        <p class="pg-p">Visítanos sin costo de envío en:<br><strong>Cuautla 211 Col. Killian<br>León, Guanajuato · CP 37260</strong></p>
      </div>
    </div>
    <div class="pg-card" data-animate>
      <h2 class="pg-h2">Tiempos de <em>entrega</em></h2>
      <div class="pg-grid" style="margin:16px 0 0">
        <div style="padding:16px;background:rgba(200,150,122,0.06);border-radius:12px;border:1px solid rgba(200,150,122,0.15)" data-animate>
          <p style="font-weight:700;color:#2A1A0E;margin-bottom:6px;font-size:0.9rem">León y área metropolitana</p>
          <p style="font-family:var(--font-mono);font-size:1.4rem;font-weight:700;color:#C8967A;margin-bottom:4px">1–2 días</p>
          <p class="pg-p" style="margin:0;font-size:0.8rem">hábiles</p>
        </div>
        <div style="padding:16px;background:rgba(200,150,122,0.06);border-radius:12px;border:1px solid rgba(200,150,122,0.15)" data-animate class="s1">
          <p style="font-weight:700;color:#2A1A0E;margin-bottom:6px;font-size:0.9rem">Resto del país</p>
          <p style="font-family:var(--font-mono);font-size:1.4rem;font-weight:700;color:#C8967A;margin-bottom:4px">3–5 días</p>
          <p class="pg-p" style="margin:0;font-size:0.8rem">hábiles</p>
        </div>
        <div style="padding:16px;background:rgba(200,150,122,0.06);border-radius:12px;border:1px solid rgba(200,150,122,0.15)" data-animate class="s2">
          <p style="font-weight:700;color:#2A1A0E;margin-bottom:6px;font-size:0.9rem">Zonas remotas</p>
          <p style="font-family:var(--font-mono);font-size:1.4rem;font-weight:700;color:#C8967A;margin-bottom:4px">5–7 días</p>
          <p class="pg-p" style="margin:0;font-size:0.8rem">hábiles</p>
        </div>
      </div>
      <p class="pg-p" style="margin-top:16px;font-size:0.82rem;color:#8B6A54">Los tiempos son estimados y pueden variar por días festivos o demanda de la paquetería.</p>
    </div>
    <div class="pg-card" data-animate>
      <h2 class="pg-h2">Formas de <em>pago</em></h2>
      <div class="pg-grid">
        <div data-animate><p class="pg-h3">Transferencia</p><p class="pg-p">SPEI / transferencia bancaria. Te compartimos los datos por WhatsApp.</p></div>
        <div class="s1" data-animate><p class="pg-h3">Mercado Pago</p><p class="pg-p">Link de pago con tarjeta de crédito o débito.</p></div>
        <div class="s2" data-animate><p class="pg-h3">OXXO Pay</p><p class="pg-p">Generamos un código de pago para que pagues en efectivo en OXXO.</p></div>
        <div class="s3" data-animate><p class="pg-h3">En tienda</p><p class="pg-p">Efectivo o tarjeta directamente en nuestro local en León.</p></div>
      </div>
    </div>
    <div class="pg-card" data-animate style="background:rgba(200,150,122,0.05);border-color:rgba(200,150,122,0.2)">
      <p class="pg-h3">📦 ¿Cómo va empacado mi pedido?</p>
      <p class="pg-p">Cada par va en su caja original, protegido con papel tissue. Los pedidos de varios pares se consolidan en una caja de cartón resistente con cinta de seguridad. Guardamos el número de guía para seguimiento.</p>
    </div>
    <div data-animate style="text-align:center;padding-bottom:16px">
      <a href="https://wa.me/5214792244560" target="_blank" rel="noopener" class="pg-cta">💬 Cotizar envío por WhatsApp</a>
    </div>
  </div>
  `,
  'tabla-tallas': `
  <div class="pg-hero">
    <p class="pg-hero-eyebrow" data-animate>Encuentra tu talla perfecta</p>
    <h2 class="pg-hero-title" data-animate>Tabla de <em>tallas</em></h2>
    <p class="pg-hero-sub" data-animate>Manejamos tallas mexicanas (MX). Si tienes dudas, escríbenos y te asesoramos sin compromiso.</p>
  </div>
  <div class="pg-body">
    <div class="pg-card" data-animate>
      <h2 class="pg-h2" style="margin-bottom:16px">Equivalencia de <em>tallas</em></h2>
      <div style="overflow-x:auto">
        <table class="pg-table">
          <thead><tr><th style="text-align:center">MX</th><th style="text-align:center">CM</th><th style="text-align:center">US</th><th style="text-align:center">EU</th></tr></thead>
          <tbody>
            ${[['22','22.0','5','35'],['22.5','22.5','5.5','35.5'],['23','23.0','6','36'],['23.5','23.5','6.5','36.5'],['24','24.0','7','37'],['24.5','24.5','7.5','37.5'],['25','25.0','8','38'],['25.5','25.5','8.5','38.5'],['26','26.0','9','39'],['26.5','26.5','9.5','39.5'],['27','27.0','10','40']].map(([mx,cm,us,eu])=>`
              <tr><td style="text-align:center;font-weight:700;color:#C8967A;font-family:var(--font-mono)">${mx}</td><td style="text-align:center;font-family:var(--font-mono)">${cm}</td><td style="text-align:center;font-family:var(--font-mono)">${us}</td><td style="text-align:center;font-family:var(--font-mono)">${eu}</td></tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
    <div class="pg-grid" style="margin-bottom:20px">
      <div class="pg-card" data-animate style="margin-bottom:0;background:rgba(200,150,122,0.06);border-color:rgba(200,150,122,0.2)">
        <p class="pg-h3">📏 Cómo medir tu pie</p>
        <p class="pg-p">Párate en una hoja de papel, marca el talón y el punto más largo del dedo. Mide esa distancia en centímetros y búscala en la columna CM.</p>
        <p class="pg-p" style="font-weight:600;color:#C8967A;margin-bottom:0">¿Estás entre dos tallas? Elige la más grande.</p>
      </div>
      <div class="pg-card s1" data-animate style="margin-bottom:0">
        <p class="pg-h3">👠 Consejo para tacones</p>
        <p class="pg-p">Con tacones altos, muchas clientas prefieren media talla más grande para mayor comodidad, especialmente si el tacón es de aguja o punta fina.</p>
      </div>
    </div>
    <div data-animate style="text-align:center;padding-bottom:16px">
      <p class="pg-p" style="margin-bottom:16px">¿Aún no sabes tu talla? Te ayudamos a elegir</p>
      <a href="https://wa.me/5214792244560" target="_blank" rel="noopener" class="pg-cta">💬 Asesoría de talla por WhatsApp</a>
    </div>
  </div>
`,
  'devoluciones': `
  <div class="pg-hero">
    <p class="pg-hero-eyebrow" data-animate>Tu satisfacción es lo primero</p>
    <h2 class="pg-hero-title" data-animate>Devoluc<em>iones</em></h2>
    <p class="pg-hero-sub" data-animate>7 días hábiles para solicitar cambio o devolución. Sin complicaciones.</p>
  </div>
  <div class="pg-body">
    <div class="pg-grid" style="margin-bottom:20px">
      <div class="pg-card" data-animate style="margin-bottom:0;background:rgba(200,150,122,0.06);border-color:rgba(200,150,122,0.2)">
        <p class="pg-h3">✅ Cuándo aplica</p>
        <ul class="pg-list" style="margin-top:8px">
          <li>Producto recibido en mal estado</li>
          <li>Producto diferente al solicitado</li>
        </ul>
        <p class="pg-p" style="margin-top:12px;margin-bottom:0;font-size:0.82rem">Sin costo de envío de retorno en estos casos.</p>
      </div>
      <div class="pg-card s1" data-animate style="margin-bottom:0">
        <p class="pg-h3">📦 Condiciones del producto</p>
        <ul class="pg-list" style="margin-top:8px">
          <li>Sin señales de uso</li>
          <li>Empaque original conservado</li>
          <li>Sin daños ocasionados por el cliente</li>
        </ul>
      </div>
    </div>
    <div class="pg-card" data-animate>
      <h2 class="pg-h2">¿Cómo inicio mi <em>devolución</em>?</h2>
      ${[
        ['Contáctanos en máximo 7 días','Escríbenos por WhatsApp (479 224 4560) o email dentro de los 7 días hábiles de haber recibido tu pedido.'],
        ['Revisamos tu caso','Te pedimos fotos del producto para documentar el motivo. En menos de 24 horas te confirmamos.'],
        ['Te enviamos la guía de retorno','En casos válidos, generamos una guía prepagada. Solo empacas y lo entregas a la paquetería.'],
        ['Reembolso o cambio','Una vez que recibimos el producto, procesamos el reembolso en 4 días hábiles o lo cambiamos por otro modelo.']
      ].map(([t,d],i,arr)=>`
        <div style="display:flex;gap:16px;align-items:start;padding:${i>0?'18px 0 0':'0'}">
          <div style="width:36px;height:36px;background:linear-gradient(135deg,#C8967A,#b5687a);border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);font-weight:700;color:white;font-size:0.85rem;flex-shrink:0">${i+1}</div>
          <div style="flex:1"><p style="font-weight:700;color:#2A1A0E;margin-bottom:4px;font-size:0.9rem">${t}</p><p class="pg-p" style="margin-bottom:0;font-size:0.85rem">${d}</p></div>
        </div>
        ${i<arr.length-1?'<div class="pg-divider" style="margin-left:52px"></div>':''}
      `).join('')}
    </div>
    <div data-animate style="text-align:center;padding-bottom:16px">
      <a href="https://wa.me/5214792244560" target="_blank" rel="noopener" class="pg-cta">💬 Iniciar devolución por WhatsApp</a>
    </div>
  </div>
`,
  'privacidad': `
  <div class="pg-hero">
    <p class="pg-hero-eyebrow" data-animate>Transparencia total</p>
    <h2 class="pg-hero-title" data-animate>Polít<em>ica</em> de privacidad</h2>
    <p class="pg-hero-sub" data-animate>Tu información es tuya. No la vendemos ni la compartimos con terceros. Punto.</p>
  </div>
  <div class="pg-body">
    <div class="pg-card" data-animate>
      <p class="pg-h3">1. Qué información recopilamos</p>
      <p class="pg-p">Nombre, correo electrónico, teléfono y dirección de envío cuando realizas un pedido o te registras. También recopilamos datos de navegación (cookies) para mejorar la experiencia en el sitio.</p>
      <div class="pg-divider"></div>
      <p class="pg-h3">2. Para qué usamos tu información</p>
      <ul class="pg-list">
        <li>Procesar y coordinar tu pedido</li>
        <li>Enviarte confirmaciones y actualizaciones de envío</li>
        <li>Responderte consultas por WhatsApp o email</li>
        <li>Mejorar nuestros productos y servicio</li>
      </ul>
      <div class="pg-divider"></div>
      <p class="pg-h3">3. WhatsApp y comunicaciones</p>
      <p class="pg-p">Al contactarnos por WhatsApp aceptas recibir respuestas de nuestro equipo. No compartimos tu número con terceros ni te enviamos publicidad sin tu consentimiento.</p>
      <div class="pg-divider"></div>
      <p class="pg-h3">4. Cookies y herramientas de análisis</p>
      <p class="pg-p">Usamos Google Analytics y Meta Pixel para entender cómo se usa el sitio y mostrar anuncios relevantes en redes sociales. Puedes rechazar cookies desde el banner de consentimiento al ingresar al sitio.</p>
      <div class="pg-divider"></div>
      <p class="pg-h3">5. Seguridad</p>
      <p class="pg-p">Tu información se almacena en servidores seguros. Los pagos se procesan a través de Mercado Pago; no almacenamos datos de tarjetas en nuestros sistemas.</p>
      <div class="pg-divider"></div>
      <p class="pg-h3">6. Tus derechos (LFPDPPP)</p>
      <p class="pg-p">Tienes derecho a acceder, rectificar, cancelar u oponerte al uso de tu información personal (derechos ARCO). Para ejercerlos contáctanos:</p>
      <ul class="pg-list">
        <li>WhatsApp: +52 1 479 224 4560</li>
        <li>Email: contacto@zapatillasmay.mx</li>
        <li>León, Guanajuato, México</li>
      </ul>
    </div>
    <div data-animate style="text-align:center;padding-bottom:16px">
      <a href="https://wa.me/5214792244560" target="_blank" rel="noopener" class="pg-cta">💬 Contactar por WhatsApp</a>
    </div>
  </div>
`,
  'terminos': `
  <div class="pg-hero">
    <p class="pg-hero-eyebrow" data-animate>Reglas claras</p>
    <h2 class="pg-hero-title" data-animate>Términ<em>os</em> y condiciones</h2>
    <p class="pg-hero-sub" data-animate>Lo que debes saber antes de comprar en Zapatillas May.</p>
  </div>
  <div class="pg-body">
    <div class="pg-card" data-animate>
      <p class="pg-h3">1. Sobre nosotros</p>
      <p class="pg-p">Zapatillas May es una tienda de calzado de moda para dama con base en León, Guanajuato, México. Vendemos al público (menudeo) a través de este sitio, y a revendedores registrados (mayoreo) a través de nuestro portal de mayoristas.</p>
      <div class="pg-divider"></div>
      <p class="pg-h3">2. Productos y precios</p>
      <p class="pg-p">Los precios se muestran en pesos mexicanos (MXN) e incluyen IVA. Nos esforzamos por mantener el catálogo y el stock actualizados, pero puede haber diferencias de disponibilidad por talla o color al momento de tu compra; si esto ocurre te contactamos antes de procesar el pedido.</p>
      <div class="pg-divider"></div>
      <p class="pg-h3">3. Pedidos y pago</p>
      <p class="pg-p">Los pagos se procesan de forma segura a través de Mercado Pago. Un pedido se considera confirmado una vez que el pago es aprobado. No almacenamos los datos de tu tarjeta en nuestros sistemas.</p>
      <div class="pg-divider"></div>
      <p class="pg-h3">4. Envíos y devoluciones</p>
      <p class="pg-p">Consulta los tiempos y costos de envío en nuestra página de <a href="/envios">Envíos</a>, y nuestra política completa de cambios y devoluciones en <a href="/devoluciones">Devoluciones</a>.</p>
      <div class="pg-divider"></div>
      <p class="pg-h3">5. Comunicación por WhatsApp, Instagram y Messenger</p>
      <p class="pg-p">Al escribirnos por WhatsApp, Instagram o Messenger para pedir información, dar seguimiento a un pedido o resolver una duda, aceptas que nuestro equipo (o Maya, nuestra asistente automatizada) te responda por ese mismo medio. No usamos estos canales para enviarte publicidad no solicitada.</p>
      <div class="pg-divider"></div>
      <p class="pg-h3">6. Uso del sitio</p>
      <p class="pg-p">Este sitio es para uso personal y de compra. No está permitido su uso para fines fraudulentos, para extraer información de forma automatizada (scraping) sin autorización, ni para revender nuestros contenidos o imágenes sin permiso.</p>
      <div class="pg-divider"></div>
      <p class="pg-h3">7. Contacto</p>
      <p class="pg-p">Si tienes dudas sobre estos términos, contáctanos:</p>
      <ul class="pg-list">
        <li>WhatsApp: +52 1 479 224 4560</li>
        <li>Email: contacto@zapatillasmay.mx</li>
        <li>León, Guanajuato, México</li>
      </ul>
    </div>
    <div data-animate style="text-align:center;padding-bottom:16px">
      <a href="https://wa.me/5214792244560" target="_blank" rel="noopener" class="pg-cta">💬 Contactar por WhatsApp</a>
    </div>
  </div>
`,
  'eliminacion-datos': `
  <div class="pg-hero">
    <p class="pg-hero-eyebrow" data-animate>Tus datos, tu decisión</p>
    <h2 class="pg-hero-title" data-animate>Eliminac<em>ión</em> de datos</h2>
    <p class="pg-hero-sub" data-animate>Cómo pedir que borremos tu información, paso a paso.</p>
  </div>
  <div class="pg-body">
    <div class="pg-card" data-animate>
      <p class="pg-h3">1. Qué información guardamos</p>
      <p class="pg-p">Si nos has escrito por WhatsApp, Instagram o Messenger, o has hecho un pedido con nosotros, podemos tener guardado: tu nombre, teléfono, correo, dirección de envío, historial de pedidos, y el contenido de las conversaciones que hemos tenido contigo por esos canales.</p>
      <div class="pg-divider"></div>
      <p class="pg-h3">2. Cómo pedir que se elimine tu información</p>
      <p class="pg-p">Puedes solicitar la eliminación de tus datos personales en cualquier momento, por cualquiera de estos medios:</p>
      <ul class="pg-list">
        <li>WhatsApp: +52 1 479 224 4560 — escribe "Eliminar mis datos"</li>
        <li>Email: contacto@zapatillasmay.mx — asunto "Solicitud de eliminación de datos"</li>
      </ul>
      <p class="pg-p">Para procesar tu solicitud te pediremos confirmar tu nombre y el número de teléfono o correo con el que nos contactaste, para localizar y borrar la información correcta.</p>
      <div class="pg-divider"></div>
      <p class="pg-h3">3. Tiempo de respuesta</p>
      <p class="pg-p">Confirmamos y completamos toda solicitud de eliminación en un plazo máximo de 15 días hábiles. Si tienes un pedido en proceso, conservamos únicamente los datos indispensables para completarlo (como lo exige la ley) y eliminamos el resto.</p>
      <div class="pg-divider"></div>
      <p class="pg-h3">4. Desconectar Instagram o Facebook</p>
      <p class="pg-p">Dejar de seguirnos, bloquearnos o eliminar la conversación desde tu app de Instagram o Messenger no borra automáticamente la información ya guardada en nuestros sistemas — para eso necesitamos tu solicitud explícita por los medios de arriba.</p>
      <div class="pg-divider"></div>
      <p class="pg-h3">5. Más información</p>
      <p class="pg-p">Consulta también nuestra <a href="/privacidad">Política de privacidad</a> para conocer el detalle completo de qué información recopilamos y cómo la usamos.</p>
    </div>
    <div data-animate style="text-align:center;padding-bottom:16px">
      <a href="https://wa.me/5214792244560" target="_blank" rel="noopener" class="pg-cta">💬 Solicitar por WhatsApp</a>
    </div>
  </div>
`,
  '_tabla_tallas_old': `REPLACED_ABOVE`

}


// ── ANIMACIONES PÁGINAS INTERNAS ──────────────
function initScrollAnimations(container) {
  var pending = Array.from(container.querySelectorAll('[data-animate]'));
  if (!pending.length) return;
  var vh = window.innerHeight || document.documentElement.clientHeight || 600;
  function check() {
    if (!pending.length) return;
    pending = pending.filter(function(el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh - 40) { el.classList.add('in-view'); return false; }
      return true;
    });
    if (!pending.length) window.removeEventListener('scroll', onScroll);
  }
  var ticking = false;
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(function(){ check(); ticking = false; }); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  // Esperar a que el navegador pinte el estado inicial (oculto) antes de revisar,
  // si no los elementos ya visibles en pantalla se marcan in-view al instante
  // y nunca se ve la transición de aparición.
  requestAnimationFrame(function(){ requestAnimationFrame(check); })
}

function animarPaginaInterna(contenido) {
  contenido.querySelectorAll('p').forEach(function(p) {
    var txt = p.textContent.trim();
    if (txt.length > 0 && txt.length <= 4) {
      var code = txt.codePointAt(0);
      if (code > 0x2000) {
        p.classList.add('page-emoji-float');
        p.style.animationDelay = (Math.random() * 1.2).toFixed(2) + 's';
      }
    }
  });
}
function mostrarPagina(id) {
  const pagina = document.getElementById('pagina-interna')
  const contenido = document.getElementById('pagina-contenido')
  const hero = document.getElementById('hero-section')
  const bannerMayoreo = document.querySelector('.banner-mayoreo')

  if (!PAGINAS[id]) return

  // Ocultar TODAS las secciones del home (categorías, productos, testimonios)
  document.querySelectorAll('.section').forEach(s => s.style.display = 'none')
  if (hero) hero.style.display = 'none'
  if (bannerMayoreo) bannerMayoreo.style.display = 'none'
  const ssrBlock = document.getElementById('ssr-page-content')
  if (ssrBlock) ssrBlock.style.display = 'none'

  // Mostrar página
  document.documentElement.classList.remove('ruta-home')
  document.documentElement.classList.add('ruta-interna')
  contenido.innerHTML = PAGINAS[id]
  setTimeout(function(){ animarPaginaInterna(contenido); initScrollAnimations(contenido); }, 80)
  pagina.style.display = 'block'
  window.scrollTo({ top: 0, behavior: 'instant' })
  history.pushState({}, '', '/' + id)
  if (typeof gtag === 'function') gtag('event', 'page_view', { page_path: '/' + id, page_title: id })
}

async function enviarContacto() {
  const nombre = document.getElementById('contacto-nombre').value.trim()
  const correo = document.getElementById('contacto-correo').value.trim()
  const msg = document.getElementById('contacto-msg').value.trim()
  if (!nombre || !msg) { mostrarToast('Por favor completa nombre y mensaje'); return }
  if (!correo || !correo.includes('@')) { mostrarToast('Escribe un correo válido'); return }
  const btn = document.getElementById('contacto-btn')
  const textoOriginal = btn.textContent
  btn.disabled = true
  btn.textContent = 'Enviando…'
  try {
    const res = await fetch(API + '/emails/contacto-web', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, correo, mensaje: msg })
    })
    const data = await res.json()
    if (!res.ok || !data.ok) throw new Error(data.error || 'No se pudo enviar')
    mostrarToast('✓ Mensaje enviado, te contactamos pronto')
    document.getElementById('contacto-nombre').value = ''
    document.getElementById('contacto-correo').value = ''
    document.getElementById('contacto-msg').value = ''
  } catch (e) {
    mostrarToast('No se pudo enviar. Intenta por WhatsApp arriba.')
  } finally {
    btn.disabled = false
    btn.textContent = textoOriginal
  }
}

async function registrarMayorista() {
  const nombre   = (document.getElementById('may-nombre').value || '').trim()
  const negocio  = (document.getElementById('may-negocio').value || '').trim()
  const ciudad   = (document.getElementById('may-ciudad').value || '').trim()
  const telefono = (document.getElementById('may-telefono').value || '').trim()
  const email    = (document.getElementById('may-email').value || '').trim()
  if (!nombre || !ciudad || !telefono) {
    mostrarToast('Completa nombre, ciudad y WhatsApp')
    return
  }
  const btn = document.getElementById('may-btn')
  btn.disabled = true
  btn.textContent = 'Enviando…'
  // Eventos
  if (typeof gtag === 'function') gtag('event', 'generate_lead', { event_category: 'mayorista' })
  if (window.fbq) fbq('track', 'Lead', { content_name: 'mayorista' })
  let enviado = false
  try {
    const rMay = await fetch('https://zapatillasmay-production.up.railway.app/auth/mayorista/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, negocio, ciudad, telefono, email })
    })
    enviado = rMay.ok
  } catch(e) {}
  if (!enviado) {   // antes siempre se mostraba "enviado" aunque la solicitud no hubiera llegado
    btn.disabled = false
    btn.textContent = 'Quiero ser revendedora'
    mostrarToast('No se pudo enviar. Escríbenos por WhatsApp y te damos de alta.')
    return
  }
  // Mostrar confirmación
  const form = document.getElementById('may-form')
  const ok = document.getElementById('may-ok')
  if (form) form.style.display = 'none'
  if (ok) ok.style.display = 'block'
}
/* parallax hero → manejado por GSAP ScrollTrigger */

  
