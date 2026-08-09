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
