import os
os.chdir(r"C:\Users\User\Desktop\ERP Zapatillas May\frontend\tienda")
s = open("links.html", encoding="utf-8").read()

def rep(a, b):
    global s
    assert s.count(a) == 1, a[:60]
    s = s.replace(a, b, 1)

# número correcto (479 224 4560 = 5214792244560)
rep("Atención directa · 477 224 4560", "Atención directa · 479 224 4560")
# insignias
rep('<span class="badge">🏷️ Mayoreo desde 3 pares</span>',
    '<span class="badge">🏭 Fabricantes desde 1996</span>\n      <span class="badge">🏷️ Mayoreo desde 3 pares</span>')
# mayoreo: no prometer "sin registro"
rep("Desde 3 pares · sin registro", "Portal de mayoristas · registro gratis")

# más enlaces útiles
rep('''    <p class="cats-label">Explora por categoría</p>''',
'''    <div id="nov-bloque" style="width:100%;display:none">
      <p class="cats-label">Novedades</p>
      <div id="nov" class="nov"></div>
    </div>

    <p class="cats-label">Explora por categoría</p>''')
rep('''      <a class="cat" href="/nina?utm_source=bio&utm_medium=links"><span class="ce">🎀</span>Niña</a>
    </div>''',
'''      <a class="cat" href="/nina?utm_source=bio&utm_medium=links"><span class="ce">🎀</span>Niña</a>
    </div>

    <p class="cats-label">Ayuda</p>
    <div class="ayuda">
      <a href="/tabla-tallas?utm_source=bio&utm_medium=links">📏 Tabla de tallas</a>
      <a href="/envios?utm_source=bio&utm_medium=links">🚚 Envíos</a>
      <a href="/mi-cuenta?utm_source=bio&utm_medium=links">📦 Mi pedido</a>
      <a href="/como-comprar?utm_source=bio&utm_medium=links">🛒 Cómo comprar</a>
    </div>''')

# estilos
rep("    .footer {\n      margin-top: 26px;", """    /* NOVEDADES */
    .nov { width: 100%; display: grid; grid-template-columns: repeat(3, 1fr); gap: 9px; }
    .nov a { text-decoration: none; color: var(--black); background: white; border: 1.5px solid var(--cream-dark); border-radius: 14px; overflow: hidden; transition: transform 0.18s, border-color 0.18s; }
    .nov a:hover { transform: translateY(-2px); border-color: var(--tan); }
    .nov img { width: 100%; aspect-ratio: 1 / 1; object-fit: cover; display: block; background: var(--cream); }
    .nov span { display: block; font-size: 0.68rem; font-weight: 600; padding: 7px 8px 9px; line-height: 1.25; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
    /* AYUDA */
    .ayuda { width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
    .ayuda a { display: block; text-align: center; padding: 12px 8px; background: white; border: 1.5px solid var(--cream-dark); border-radius: 14px; text-decoration: none; color: var(--black); font-size: 0.78rem; font-weight: 600; transition: transform 0.18s, border-color 0.18s; }
    .ayuda a:hover { transform: translateY(-2px); border-color: var(--tan); }
    .link:focus-visible, .cat:focus-visible, .ayuda a:focus-visible, .nov a:focus-visible, .social a:focus-visible { outline: 2px solid var(--mauve); outline-offset: 2px; }

    .footer {
      margin-top: 26px;""")

# script: novedades (3 modelos, sin precio) + medición de clics
rep("</body>", """<script>
  // Novedades: 3 modelos con foto (destacados/nuevos primero). Si falla, el bloque queda oculto.
  (function () {
    var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] }) }
    fetch('https://zapatillasmay-production.up.railway.app/productos/carrito?ids=')
      .then(function (r) { return r.ok ? r.json() : Promise.reject() })
      .then(function (d) {
        var l = (d.sugerencias || []).filter(function (p) { return p.imagen_principal && (p.slug || p.sku_interno) }).slice(0, 3)
        if (!l.length) return
        document.getElementById('nov').innerHTML = l.map(function (p) {
          var img = String(p.imagen_principal).replace('/upload/', '/upload/w_360,h_360,c_fill,f_auto,q_auto/')
          return '<a href="/producto/' + encodeURIComponent(p.slug || p.sku_interno) + '?utm_source=bio&utm_medium=links"><img src="' + esc(img) + '" alt="' + esc(p.nombre) + '" loading="lazy" width="180" height="180"><span>' + esc(p.nombre) + '</span></a>'
        }).join('')
        document.getElementById('nov-bloque').style.display = 'block'
      }).catch(function () {})
  })()
  // Cuenta los clics de cada botón en Analytics
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]'); if (!a || typeof gtag !== 'function') return
    gtag('event', 'clic_links', { destino: a.getAttribute('href').split('?')[0], texto: (a.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 60) })
  })
</script>
</body>""")
open("links.html", "w", encoding="utf-8").write(s)
print("ok")
