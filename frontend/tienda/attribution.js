// Captura de atribución (gclid, fbclid, UTMs, referrer externo) en localStorage.
// Se incluye en TODAS las páginas de entrada del sitio porque un clic de
// anuncio puede aterrizar en cualquiera de ellas (home, ficha de producto,
// etc.) -- antes solo se leía el parámetro de la URL de la página actual,
// así que se perdía en cuanto la clienta navegaba a otra página antes de
// llegar al checkout.
(function () {
  try {
    var params = new URLSearchParams(location.search)
    // Últimos clics de anuncio: se sobreescriben con cada nuevo valor que
    // aparezca en la URL (modelo de último clic, igual que usan Google/Meta).
    ;['gclid', 'fbclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(function (campo) {
      var valor = params.get(campo)
      if (valor) localStorage.setItem('zm_' + campo, valor)
    })
    // Referrer externo: solo se guarda una vez (primer contacto). Si no se
    // protegiera así, la segunda página que visite dentro del propio sitio
    // pisaría el referrer real con la URL anterior de zapatillasmay.mx.
    if (!localStorage.getItem('zm_referrer') && document.referrer && document.referrer.indexOf(location.hostname) === -1) {
      localStorage.setItem('zm_referrer', document.referrer)
    }
  } catch (e) {}
})()

// Botones de WhatsApp del sitio: si el enlace no trae mensaje propio, se le pone uno que dice de qué página viene la persona y
// de qué fuente llegó (chatgpt.com, facebook, google...). El servidor lee la marca "(ref: ...)" y la guarda en la conversación.
;(function () {
  try {
    var NUM = 'wa.me/5214792244560'
    function fuente() {
      var u = localStorage.getItem('zm_utm_source')
      if (u) return u
      if (localStorage.getItem('zm_gclid')) return 'google ads'
      if (localStorage.getItem('zm_fbclid')) return 'facebook'
      var r = localStorage.getItem('zm_referrer')
      if (r) { try { return new URL(r).hostname.replace(/^www\./, '') } catch (e) {} }
      return 'directo'
    }
    function pagina() {
      var p = location.pathname.replace(/\/+$/, '') || '/'
      if (p === '/') return { ref: 'inicio', txt: 'la página principal' }
      if (p === '/mayoreo') return { ref: 'mayoreo', txt: 'la página de mayoreo' }
      if (p === '/contacto') return { ref: 'contacto', txt: 'la página de contacto' }
      if (p.indexOf('/guia') === 0) return { ref: 'guia:' + p.slice(1), txt: 'una guía' }
      if (p.indexOf('/producto/') === 0) return { ref: 'producto:' + p.slice(10), txt: 'este modelo', url: 'https://zapatillasmay.mx' + p }
      return { ref: p.slice(1), txt: 'la página ' + p.slice(1) }
    }
    document.addEventListener('click', function (ev) {
      var a = ev.target && ev.target.closest ? ev.target.closest('a[href*="' + NUM + '"]') : null
      if (!a) return
      var href = a.getAttribute('href') || ''
      if (/[?&]text=/.test(href)) return
      var pg = pagina()
      var msg = (pg.url ? 'Hola, me interesa ' + pg.txt + ': ' + pg.url : 'Hola, vengo de ' + pg.txt + ' de zapatillasmay.mx y quiero información')
        + ' (ref: ' + pg.ref + ' | ' + fuente() + ')'
      a.setAttribute('href', href + (href.indexOf('?') === -1 ? '?' : '&') + 'text=' + encodeURIComponent(msg))
    }, true)
  } catch (e) {}
})()
