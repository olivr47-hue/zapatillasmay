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
      <div class="pg-card s2" data-animate style="margin-bottom:0"><p class="pg-h3">📞 Teléfono</p><p class="pg-p"><a href="tel:+524772472285" style="color:inherit;text-decoration:none">477 247 2285</a></p></div>
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
    .mx-chip{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;background:rgba(200,150,122,0.12);border:1px solid rgba(200,150,122,0.28);border-radius:100px;font-size:0.72rem;font-weight:700;color:#8B5E4A;letter-spacing:0.02em}
    .mx-sec{margin-bottom:64px}
    .mx-h2{font-family:var(--font-display);font-size:clamp(1.6rem,3.5vw,2.4rem);font-weight:400;text-align:center;margin-bottom:8px;color:var(--black)}
    .mx-h2 em{font-style:normal;color:var(--pink)}
    .mx-lead{text-align:center;color:var(--gray-600);font-size:0.9rem;margin:0 auto 30px;max-width:520px;line-height:1.7}
    .mx-pasos{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}
    .mx-paso{background:var(--white);border:1.5px solid var(--gray-200);border-radius:16px;padding:22px 20px;position:relative}
    .mx-num{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#C8967A,#b5687a);color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center;margin-bottom:12px;font-size:0.95rem}
    .mx-paso b{display:block;font-size:0.95rem;color:var(--black);margin-bottom:6px}
    .mx-paso span{font-size:0.8rem;color:var(--gray-600);line-height:1.65}
    .mx-feat{display:grid;grid-template-columns:1fr;gap:22px;align-items:center;margin-bottom:52px}
    .mx-fshot{display:flex;justify-content:center}
    .mx-phone{width:100%;max-width:290px;border:7px solid #2A1A0E;border-radius:32px;overflow:hidden;background:#fff;box-shadow:0 18px 40px rgba(60,30,15,0.22)}
    .mx-phone img{display:block;width:100%;height:auto}
    .mx-kick{font-size:0.68rem;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#b5687a;margin-bottom:8px}
    .mx-h3{font-family:var(--font-display);font-size:clamp(1.4rem,3vw,1.9rem);font-weight:500;line-height:1.2;margin-bottom:10px;color:var(--black)}
    .mx-p{font-size:0.88rem;color:var(--gray-600);line-height:1.75;margin-bottom:12px}
    .mx-ul{list-style:none;padding:0;margin:0;display:grid;gap:8px}
    .mx-ul li{font-size:0.84rem;color:#5a4030;line-height:1.6;padding-left:26px;position:relative}
    .mx-ul li::before{content:'✓';position:absolute;left:0;top:0;color:#fff;background:#25a86b;width:18px;height:18px;border-radius:50%;font-size:0.65rem;font-weight:800;display:flex;align-items:center;justify-content:center;margin-top:2px}
    .mx-nota{text-align:center;color:var(--gray-600);font-size:0.74rem;margin-top:-18px;margin-bottom:46px}
    .mx-mini{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;margin-bottom:56px}
    .mx-minicard{background:var(--gray-100);border:1px solid var(--gray-200);border-radius:16px;padding:22px 20px;display:flex;gap:16px;align-items:center}
    .mx-minicard img{width:96px;flex-shrink:0;border-radius:14px;border:3px solid #2A1A0E;display:block;height:auto}
    .mx-minicard b{display:block;font-size:0.92rem;color:var(--black);margin-bottom:5px}
    .mx-minicard span{font-size:0.79rem;color:var(--gray-600);line-height:1.65}
    .mx-prec{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;max-width:820px;margin:0 auto}
    .mx-pc{border-radius:14px;padding:22px 18px;text-align:center;border:1.5px solid var(--gray-200);background:var(--white)}
    .mx-pc small{display:block;font-size:0.7rem;text-transform:uppercase;letter-spacing:1px;color:var(--gray-600);margin-bottom:8px}
    .mx-pc b{display:block;font-size:1rem;color:var(--black);margin-bottom:6px}
    .mx-pc span{font-size:0.76rem;color:var(--gray-600);line-height:1.6}
    .mx-pc.hl{border-color:rgba(181,104,122,0.5);background:linear-gradient(135deg,rgba(181,104,122,0.1),rgba(200,150,122,0.05))}
    .mx-pc.dk{background:var(--black);border-color:var(--black)}
    .mx-pc.dk small{color:rgba(245,240,232,0.6)} .mx-pc.dk b{color:#fff} .mx-pc.dk span{color:rgba(245,240,232,0.7)}
    .mx-why{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px}
    .mx-hero-cta{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:22px}
    .mx-cta2{display:inline-block;padding:14px 26px;border-radius:100px;border:2px solid #C8967A;color:#8B5E4A;font-weight:700;font-size:0.9rem;text-decoration:none;background:transparent}
    @media(min-width:768px){
      .mx-feat{grid-template-columns:1fr 1fr;gap:56px}
      .mx-feat.inv .mx-fshot{order:2}
    }
    .may-input{border:1.5px solid rgba(245,240,232,0.2);background:rgba(245,240,232,0.07);border-radius:10px;padding:14px 16px;font-family:var(--font-body);font-size:0.9rem;color:var(--white);outline:none;width:100%;box-sizing:border-box}
    .may-input::placeholder{color:rgba(245,240,232,0.4)}
    @media(max-width:767px){.may-pc-2col{grid-template-columns:1fr!important}}
  </style>

  <div class="pg-hero" style="padding-top:20px">
    <p class="pg-hero-eyebrow" data-animate>Para revendedoras, boutiques y zapaterías</p>
    <h2 class="pg-hero-title" data-animate>Surte tu negocio con calzado de fábrica,<br><em>desde tu celular</em></h2>
    <p class="pg-hero-sub" data-animate>El Portal de Mayoristas es tu catálogo, tu carrito y tus herramientas para vender, todo en un solo lugar. Crea tu cuenta gratis, elige tus modelos y compártelos con tus clientas con tu propia marca.</p>
    <div data-animate style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:22px">
      <span class="mx-chip">📍 Fábrica propia en León, Gto.</span>
      <span class="mx-chip">👠 Más de 230 cuentas de revendedoras y zapaterías</span>
      <span class="mx-chip">🚚 Envíos a todo México</span>
    </div>
    <div data-animate class="mx-hero-cta">
      <a href="https://portal.zapatillasmay.mx" target="_blank" rel="noopener" class="pg-cta">🔑 Crear mi cuenta gratis →</a>
      <a href="https://wa.me/5214792244560?text=Hola%2C%20quiero%20informaci%C3%B3n%20del%20portal%20de%20mayoristas" target="_blank" rel="noopener" class="mx-cta2">💬 Hablar con una asesora</a>
    </div>
    <p data-animate style="font-size:0.78rem;color:var(--gray-600);margin-top:14px">¿Ya tienes cuenta? <a href="https://portal.zapatillasmay.mx" target="_blank" rel="noopener" style="color:var(--pink);font-weight:700">Entrar al portal</a></p>
  </div>

  <div class="pg-body">

    <!-- COMO FUNCIONA -->
    <div class="mx-sec" data-animate>
      <h2 class="mx-h2">Así de fácil <em>funciona</em></h2>
      <p class="mx-lead">Cuatro pasos, sin tratos complicados ni pedidos mínimos enormes.</p>
      <div class="mx-pasos">
        <div class="mx-paso"><div class="mx-num">1</div><b>Crea tu cuenta gratis</b><span>Te registras una vez en el portal. Sin costo, sin contratos y sin permanencia.</span></div>
        <div class="mx-paso"><div class="mx-num">2</div><b>Elige modelos, colores y tallas</b><span>Mezcla modelos y colores a tu gusto (surtido variado) o arma una corrida completa.</span></div>
        <div class="mx-paso"><div class="mx-num">3</div><b>Aparta o cierra tu pedido</b><span>Aparta los pares que quieras reservar, o cierra el pedido y paga por transferencia o tarjeta.</span></div>
        <div class="mx-paso"><div class="mx-num">4</div><b>Recibe en tu ciudad</b><span>Enviamos a todo México por paquetería, con número de guía para que lo rastrees.</span></div>
      </div>
    </div>

    <!-- HERRAMIENTAS -->
    <div class="mx-sec">
      <h2 class="mx-h2" data-animate>Lo que puedes hacer <em>dentro del portal</em></h2>
      <p class="mx-lead" data-animate>No es solo un lugar para comprar: trae las herramientas para que vendas más fácil a tus clientas.</p>

    <div class="mx-feat" data-animate>
      <div class="mx-fshot"><div class="mx-phone"><img src="/images/mayoreo/compartir-fotos.webp" alt="Pantalla del portal para compartir fotos de modelos sin precios" loading="lazy" width="560"></div></div>
      <div class="mx-ftxt">
        <p class="mx-kick">Comparte sin precios</p>
        <h3 class="mx-h3">Comparte fotos listas para publicar, sin precios</h3>
        <p class="mx-p">Selecciona los modelos y colores que quieras y compártelos por WhatsApp o redes con solo la foto de portada. Así tú pones el precio que quieras.</p>
        <ul class="mx-ul"><li>Elige varios modelos y colores a la vez y compártelos juntos.</li><li>Cada foto sale sin precios: nadie ve tu costo de mayoreo.</li><li>En la ficha de un modelo puedes ver cada foto en grande, compartirla sola o descargar varias de una vez.</li></ul>
      </div>
    </div>

    <div class="mx-feat inv" data-animate>
      <div class="mx-fshot"><div class="mx-phone"><img src="/images/mayoreo/catalogo-con-tu-marca.webp" alt="Pantalla del portal para descargar catálogos en PDF con el nombre y WhatsApp de tu negocio" loading="lazy" width="560"></div></div>
      <div class="mx-ftxt">
        <p class="mx-kick">Catálogos con tu marca</p>
        <h3 class="mx-h3">Descarga catálogos en PDF con el nombre de tu negocio</h3>
        <p class="mx-p">Baja un PDF por categoría (tacones, sandalias, botas y más) con todos los modelos activos, listo para mandarlo a tus clientas. Sale con tu nombre y tu WhatsApp, no con los nuestros.</p>
        <ul class="mx-ul"><li>Escribe el nombre de tu negocio y tu WhatsApp: salen grandes en el encabezado y otra vez al pie de cada página.</li><li>Elígelo solo con fotos, o con tus precios de venta (por porcentaje o cantidad fija sobre tu costo).</li><li>Tu costo de mayoreo nunca aparece en el PDF.</li></ul>
      </div>
    </div>

    <div class="mx-feat" data-animate>
      <div class="mx-fshot"><div class="mx-phone"><img src="/images/mayoreo/lista-de-precios.webp" alt="Pantalla del portal con tu margen de ganancia y la lista de precios para mandar por WhatsApp" loading="lazy" width="560"></div></div>
      <div class="mx-ftxt">
        <p class="mx-kick">Tus precios y tu ganancia</p>
        <h3 class="mx-h3">Fija tu margen y manda tu lista de precios por WhatsApp</h3>
        <p class="mx-p">Decide cuánto quieres ganar (por ejemplo 40% sobre tu costo) y el portal te muestra a cuánto vender cada modelo y cuánto te queda por par.</p>
        <ul class="mx-ul"><li>Una lista de precios lista para copiar o mandar por WhatsApp, con solo los modelos que tienen existencias.</li><li>Puedes usar tu propio margen o el mismo precio que ven tus clientas en la tienda.</li><li>Tus clientas nunca ven tu precio de mayoreo.</li></ul>
      </div>
    </div>

    <div class="mx-feat inv" data-animate>
      <div class="mx-fshot"><div class="mx-phone"><img src="/images/mayoreo/arma-tu-pedido.webp" alt="Pantalla del portal para elegir color, tallas y armar el pedido variado o por corrida" loading="lazy" width="560"></div></div>
      <div class="mx-ftxt">
        <p class="mx-kick">Arma tu pedido</p>
        <h3 class="mx-h3">Mezcla modelos o compra la corrida completa</h3>
        <p class="mx-p">Entra a un modelo, elige el color, toca las tallas que quieras y listo. El portal te muestra los precios por volumen y cuánto ganarías al venderlo.</p>
        <ul class="mx-ul"><li>Surtido variado: combina modelos, colores y tallas en un mismo pedido.</li><li>Corrida completa: un modelo y color en varias tallas, con el mejor precio por par.</li><li>Aparta pares específicos y nosotros aprobamos el apartado; puedes seguir agregando y apartar cuantas veces quieras.</li></ul>
      </div>
    </div>

    <div class="mx-feat" data-animate>
      <div class="mx-fshot"><div class="mx-phone"><img src="/images/mayoreo/tacona-preguntas.webp" alt="Tacona, la asistente del portal, mostrando preguntas frecuentes" loading="lazy" width="560"></div></div>
      <div class="mx-ftxt">
        <p class="mx-kick">Siempre acompañada</p>
        <h3 class="mx-h3">Tacona te responde las dudas del portal</h3>
        <p class="mx-p">Tacona es la asistente del portal. Te saluda con una frase distinta cada vez que entras y te ayuda a encontrar las cosas sin perderte.</p>
        <ul class="mx-ul"><li>Preguntas frecuentes sobre cómo agregar al carrito, apartar, pagar y compartir fotos, cada una con su botón para ir a la sección.</li><li>Si tu duda no está ahí, te lleva directo a WhatsApp con tu asesora.</li></ul>
      </div>
    </div>
      <p class="mx-nota" data-animate>Capturas con datos de ejemplo (modelos y precios de demostración).</p>

      <div class="mx-mini" data-animate>
        <div class="mx-minicard"><img src="/images/mayoreo/calculadora.webp" alt="Calculadora del portal" loading="lazy" width="420"><div><b>Calculadora integrada</b><span>Suma, resta, multiplica y saca porcentajes sin salir del portal: ideal para tus cuentas con tus clientas.</span></div></div>
        <div class="mx-minicard"><div style="font-size:2.6rem;width:96px;text-align:center;flex-shrink:0">📒</div><div><b>Mi registro de ventas</b><span>Anota lo que vendes y lo que gastas y ve tu ganancia real, bruta y neta, por mes. Solo tú lo ves, y puedes descargarlo a Excel.</span></div></div>
      </div>
      <div style="text-align:center">
        <a href="https://portal.zapatillasmay.mx" target="_blank" rel="noopener" class="pg-cta">🔑 Crear mi cuenta gratis →</a>
      </div>
    </div>

    <!-- PRECIOS -->
    <div class="mx-sec" data-animate>
      <h2 class="mx-h2">Cómo bajan los <em>precios</em></h2>
      <p class="mx-lead">Entre más pares compras, menos pagas por cada uno.</p>
      <div class="mx-prec">
        <div class="mx-pc"><small>1–2 pares</small><b>Precio de la tienda</b><span>En zapatillasmay.mx</span></div>
        <div class="mx-pc hl"><small>3–5 pares</small><b>−$60 por par*</b><span>Se aplica solo en el carrito de zapatillasmay.mx, sin registro.</span></div>
        <div class="mx-pc hl"><small>6+ pares</small><b>−$100 por par*</b><span>Precio de mayoreo, dentro del portal.</span></div>
        <div class="mx-pc dk"><small>Corrida completa</small><b>Hasta −$180 por par*</b><span>El mejor precio por par, dentro del portal.</span></div>
      </div>
      <p style="text-align:center;color:var(--gray-600);font-size:0.74rem;margin-top:12px;max-width:560px;margin-left:auto;margin-right:auto;line-height:1.6">*Ejemplo ilustrativo sobre el precio de menudeo. Tus precios reales, por modelo, los ves con tu cuenta dentro del portal.</p>
    </div>

    <!-- POR QUE NOSOTROS -->
    <div class="mx-sec">
      <h2 class="mx-h2" data-animate>Por qué comprar <em>con nosotros</em></h2>
      <p class="mx-lead" data-animate>Somos fábrica, no intermediarios.</p>
      <div class="mx-why">
        <div class="may-why" data-animate style="background:var(--gray-100);border-radius:12px;padding:22px 18px;border:1px solid var(--gray-200);text-align:center"><div style="font-size:1.6rem;margin-bottom:10px">👠</div><p style="font-weight:700;font-size:0.9rem;color:var(--black);margin-bottom:6px">Fábrica propia en León</p><p style="font-size:0.79rem;color:var(--gray-600);line-height:1.65">Calzado de dama directo de la capital del calzado de México.</p></div>
        <div class="may-why" data-animate style="background:var(--gray-100);border-radius:12px;padding:22px 18px;border:1px solid var(--gray-200);text-align:center"><div style="font-size:1.6rem;margin-bottom:10px">✨</div><p style="font-weight:700;font-size:0.9rem;color:var(--black);margin-bottom:6px">Modelos nuevos cada semana</p><p style="font-size:0.79rem;color:var(--gray-600);line-height:1.65">Tacones, sandalias, plataformas, botas y botines que se renuevan seguido.</p></div>
        <div class="may-why" data-animate style="background:var(--gray-100);border-radius:12px;padding:22px 18px;border:1px solid var(--gray-200);text-align:center"><div style="font-size:1.6rem;margin-bottom:10px">💬</div><p style="font-weight:700;font-size:0.9rem;color:var(--black);margin-bottom:6px">Asesoría por WhatsApp</p><p style="font-size:0.79rem;color:var(--gray-600);line-height:1.65">Una asesora te ayuda a armar tu pedido y a resolver tus dudas.</p></div>
        <div class="may-why" data-animate style="background:var(--gray-100);border-radius:12px;padding:22px 18px;border:1px solid var(--gray-200);text-align:center"><div style="font-size:1.6rem;margin-bottom:10px">🔄</div><p style="font-weight:700;font-size:0.9rem;color:var(--black);margin-bottom:6px">Cambios y garantía</p><p style="font-size:0.79rem;color:var(--gray-600);line-height:1.65">22 días para cambios y 30 días de garantía por defectos de fábrica.</p></div>
      </div>
    </div>

    <!-- FAQ -->
    <div data-animate class="mx-sec">
      <h2 class="mx-h2" style="margin-bottom:24px">Preguntas <em>frecuentes</em></h2>
      <div style="display:flex;flex-direction:column;gap:10px">

        <div style="border:1px solid var(--gray-200);border-radius:10px;overflow:hidden">
          <div style="padding:16px 20px;font-weight:600;font-size:0.88rem;background:var(--white);cursor:pointer;display:flex;justify-content:space-between;align-items:center;color:var(--black);gap:12px" role="button" tabindex="0" onclick="var a=this.nextElementSibling,s=this.querySelector('.faq-ic'),o=a.style.display==='block';a.style.display=o?'none':'block';s.textContent=o?'+':'-'" onkeydown="if(event.key==='Enter'||event.key===' '){var a=this.nextElementSibling,s=this.querySelector('.faq-ic'),o=a.style.display==='block';a.style.display=o?'none':'block';s.textContent=o?'+':'-'}">
            <span>¿Cuesta algo registrarme?</span>
            <span class="faq-ic" style="color:var(--pink);font-size:1.3rem;font-weight:300;flex-shrink:0;line-height:1;margin-left:8px">+</span>
          </div>
          <div style="display:none;padding:0 20px 16px;font-size:0.84rem;color:var(--gray-600);line-height:1.75">No. El registro en el portal es gratuito y sin contratos ni permanencia.</div>
        </div>
        <div style="border:1px solid var(--gray-200);border-radius:10px;overflow:hidden">
          <div style="padding:16px 20px;font-weight:600;font-size:0.88rem;background:var(--white);cursor:pointer;display:flex;justify-content:space-between;align-items:center;color:var(--black);gap:12px" role="button" tabindex="0" onclick="var a=this.nextElementSibling,s=this.querySelector('.faq-ic'),o=a.style.display==='block';a.style.display=o?'none':'block';s.textContent=o?'+':'-'" onkeydown="if(event.key==='Enter'||event.key===' '){var a=this.nextElementSibling,s=this.querySelector('.faq-ic'),o=a.style.display==='block';a.style.display=o?'none':'block';s.textContent=o?'+':'-'}">
            <span>¿Hay mínimo de compra?</span>
            <span class="faq-ic" style="color:var(--pink);font-size:1.3rem;font-weight:300;flex-shrink:0;line-height:1;margin-left:8px">+</span>
          </div>
          <div style="display:none;padding:0 20px 16px;font-size:0.84rem;color:var(--gray-600);line-height:1.75">Puedes comprar desde 1 par al precio de la tienda en línea, y desde 3 pares ya hay descuento automático. Los precios de mayoreo aplican desde 6 pares, y pueden ser de modelos, colores y tallas diferentes.</div>
        </div>
        <div style="border:1px solid var(--gray-200);border-radius:10px;overflow:hidden">
          <div style="padding:16px 20px;font-weight:600;font-size:0.88rem;background:var(--white);cursor:pointer;display:flex;justify-content:space-between;align-items:center;color:var(--black);gap:12px" role="button" tabindex="0" onclick="var a=this.nextElementSibling,s=this.querySelector('.faq-ic'),o=a.style.display==='block';a.style.display=o?'none':'block';s.textContent=o?'+':'-'" onkeydown="if(event.key==='Enter'||event.key===' '){var a=this.nextElementSibling,s=this.querySelector('.faq-ic'),o=a.style.display==='block';a.style.display=o?'none':'block';s.textContent=o?'+':'-'}">
            <span>¿Qué es una corrida?</span>
            <span class="faq-ic" style="color:var(--pink);font-size:1.3rem;font-weight:300;flex-shrink:0;line-height:1;margin-left:8px">+</span>
          </div>
          <div style="display:none;padding:0 20px 16px;font-size:0.84rem;color:var(--gray-600);line-height:1.75">Es un mismo modelo y color en varias tallas, normalmente 6 pares, ideal para surtir una tienda. Es la forma de comprar con el mejor precio por par.</div>
        </div>
        <div style="border:1px solid var(--gray-200);border-radius:10px;overflow:hidden">
          <div style="padding:16px 20px;font-weight:600;font-size:0.88rem;background:var(--white);cursor:pointer;display:flex;justify-content:space-between;align-items:center;color:var(--black);gap:12px" role="button" tabindex="0" onclick="var a=this.nextElementSibling,s=this.querySelector('.faq-ic'),o=a.style.display==='block';a.style.display=o?'none':'block';s.textContent=o?'+':'-'" onkeydown="if(event.key==='Enter'||event.key===' '){var a=this.nextElementSibling,s=this.querySelector('.faq-ic'),o=a.style.display==='block';a.style.display=o?'none':'block';s.textContent=o?'+':'-'}">
            <span>¿Mis clientas pueden ver mis precios de mayoreo?</span>
            <span class="faq-ic" style="color:var(--pink);font-size:1.3rem;font-weight:300;flex-shrink:0;line-height:1;margin-left:8px">+</span>
          </div>
          <div style="display:none;padding:0 20px 16px;font-size:0.84rem;color:var(--gray-600);line-height:1.75">No. Tus precios de mayoreo solo los ves tú dentro del portal. En los catálogos y listas que compartes pones tus propios precios de venta, o los mandas solo con fotos.</div>
        </div>
        <div style="border:1px solid var(--gray-200);border-radius:10px;overflow:hidden">
          <div style="padding:16px 20px;font-weight:600;font-size:0.88rem;background:var(--white);cursor:pointer;display:flex;justify-content:space-between;align-items:center;color:var(--black);gap:12px" role="button" tabindex="0" onclick="var a=this.nextElementSibling,s=this.querySelector('.faq-ic'),o=a.style.display==='block';a.style.display=o?'none':'block';s.textContent=o?'+':'-'" onkeydown="if(event.key==='Enter'||event.key===' '){var a=this.nextElementSibling,s=this.querySelector('.faq-ic'),o=a.style.display==='block';a.style.display=o?'none':'block';s.textContent=o?'+':'-'}">
            <span>¿Cómo pago mi pedido?</span>
            <span class="faq-ic" style="color:var(--pink);font-size:1.3rem;font-weight:300;flex-shrink:0;line-height:1;margin-left:8px">+</span>
          </div>
          <div style="display:none;padding:0 20px 16px;font-size:0.84rem;color:var(--gray-600);line-height:1.75">Al cerrar tu pedido eliges transferencia (te mostramos los datos bancarios) o tarjeta (te generamos un link de pago). Si quieres reservar pares antes de pagar, puedes apartarlos y nosotros aprobamos el apartado.</div>
        </div>
        <div style="border:1px solid var(--gray-200);border-radius:10px;overflow:hidden">
          <div style="padding:16px 20px;font-weight:600;font-size:0.88rem;background:var(--white);cursor:pointer;display:flex;justify-content:space-between;align-items:center;color:var(--black);gap:12px" role="button" tabindex="0" onclick="var a=this.nextElementSibling,s=this.querySelector('.faq-ic'),o=a.style.display==='block';a.style.display=o?'none':'block';s.textContent=o?'+':'-'" onkeydown="if(event.key==='Enter'||event.key===' '){var a=this.nextElementSibling,s=this.querySelector('.faq-ic'),o=a.style.display==='block';a.style.display=o?'none':'block';s.textContent=o?'+':'-'}">
            <span>¿Cómo envían y cuánto tardan?</span>
            <span class="faq-ic" style="color:var(--pink);font-size:1.3rem;font-weight:300;flex-shrink:0;line-height:1;margin-left:8px">+</span>
          </div>
          <div style="display:none;padding:0 20px 16px;font-size:0.84rem;color:var(--gray-600);line-height:1.75">Enviamos a todo México por paquetería con número de guía para rastreo. En pedidos de 6 pares o más puedes elegir Castores (pago al recibir), Estafeta o Fedex (pago con el pedido). Normalmente enviamos dentro de las 24 horas siguientes a confirmar tu pago, en días hábiles.</div>
        </div>
        <div style="border:1px solid var(--gray-200);border-radius:10px;overflow:hidden">
          <div style="padding:16px 20px;font-weight:600;font-size:0.88rem;background:var(--white);cursor:pointer;display:flex;justify-content:space-between;align-items:center;color:var(--black);gap:12px" role="button" tabindex="0" onclick="var a=this.nextElementSibling,s=this.querySelector('.faq-ic'),o=a.style.display==='block';a.style.display=o?'none':'block';s.textContent=o?'+':'-'" onkeydown="if(event.key==='Enter'||event.key===' '){var a=this.nextElementSibling,s=this.querySelector('.faq-ic'),o=a.style.display==='block';a.style.display=o?'none':'block';s.textContent=o?'+':'-'}">
            <span>¿Puedo hacer cambios o garantía?</span>
            <span class="faq-ic" style="color:var(--pink);font-size:1.3rem;font-weight:300;flex-shrink:0;line-height:1;margin-left:8px">+</span>
          </div>
          <div style="display:none;padding:0 20px 16px;font-size:0.84rem;color:var(--gray-600);line-height:1.75">Sí. Dentro de los primeros 22 días desde que recibes tu pedido puedes cambiar por otro estilo, con el calzado sin uso, limpio y en su caja (sujeto a existencia). La garantía por defectos de fábrica es de 30 días. La paquetería de retorno corre por cuenta del comprador.</div>
        </div>
        <div style="border:1px solid var(--gray-200);border-radius:10px;overflow:hidden">
          <div style="padding:16px 20px;font-weight:600;font-size:0.88rem;background:var(--white);cursor:pointer;display:flex;justify-content:space-between;align-items:center;color:var(--black);gap:12px" role="button" tabindex="0" onclick="var a=this.nextElementSibling,s=this.querySelector('.faq-ic'),o=a.style.display==='block';a.style.display=o?'none':'block';s.textContent=o?'+':'-'" onkeydown="if(event.key==='Enter'||event.key===' '){var a=this.nextElementSibling,s=this.querySelector('.faq-ic'),o=a.style.display==='block';a.style.display=o?'none':'block';s.textContent=o?'+':'-'}">
            <span>¿Puedo ver cómo es el portal antes de registrarme?</span>
            <span class="faq-ic" style="color:var(--pink);font-size:1.3rem;font-weight:300;flex-shrink:0;line-height:1;margin-left:8px">+</span>
          </div>
          <div style="display:none;padding:0 20px 16px;font-size:0.84rem;color:var(--gray-600);line-height:1.75">Las capturas de esta página son de ejemplo, con modelos y precios de demostración. Al crear tu cuenta gratis ves el catálogo real con tus precios. Si prefieres, escríbenos por WhatsApp y una asesora te lo muestra.</div>
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

  
  </div>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "¿Cuesta algo registrarme?", "acceptedAnswer": { "@type": "Answer", "text": "No. El registro en el portal es gratuito y sin contratos ni permanencia." } },
      { "@type": "Question", "name": "¿Hay mínimo de compra?", "acceptedAnswer": { "@type": "Answer", "text": "Puedes comprar desde 1 par al precio de la tienda en línea, y desde 3 pares ya hay descuento automático. Los precios de mayoreo aplican desde 6 pares, y pueden ser de modelos, colores y tallas diferentes." } },
      { "@type": "Question", "name": "¿Qué es una corrida?", "acceptedAnswer": { "@type": "Answer", "text": "Es un mismo modelo y color en varias tallas, normalmente 6 pares, ideal para surtir una tienda. Es la forma de comprar con el mejor precio por par." } },
      { "@type": "Question", "name": "¿Mis clientas pueden ver mis precios de mayoreo?", "acceptedAnswer": { "@type": "Answer", "text": "No. Tus precios de mayoreo solo los ves tú dentro del portal. En los catálogos y listas que compartes pones tus propios precios de venta, o los mandas solo con fotos." } },
      { "@type": "Question", "name": "¿Cómo pago mi pedido?", "acceptedAnswer": { "@type": "Answer", "text": "Al cerrar tu pedido eliges transferencia (te mostramos los datos bancarios) o tarjeta (te generamos un link de pago). Si quieres reservar pares antes de pagar, puedes apartarlos y nosotros aprobamos el apartado." } },
      { "@type": "Question", "name": "¿Cómo envían y cuánto tardan?", "acceptedAnswer": { "@type": "Answer", "text": "Enviamos a todo México por paquetería con número de guía para rastreo. En pedidos de 6 pares o más puedes elegir Castores (pago al recibir), Estafeta o Fedex (pago con el pedido). Normalmente enviamos dentro de las 24 horas siguientes a confirmar tu pago, en días hábiles." } },
      { "@type": "Question", "name": "¿Puedo hacer cambios o garantía?", "acceptedAnswer": { "@type": "Answer", "text": "Sí. Dentro de los primeros 22 días desde que recibes tu pedido puedes cambiar por otro estilo, con el calzado sin uso, limpio y en su caja (sujeto a existencia). La garantía por defectos de fábrica es de 30 días. La paquetería de retorno corre por cuenta del comprador." } },
      { "@type": "Question", "name": "¿Puedo ver cómo es el portal antes de registrarme?", "acceptedAnswer": { "@type": "Answer", "text": "Las capturas de esta página son de ejemplo, con modelos y precios de demostración. Al crear tu cuenta gratis ves el catálogo real con tus precios. Si prefieres, escríbenos por WhatsApp y una asesora te lo muestra." } }
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

  
