export default async function handler(req, res) {
  const { slug } = req.query
  try {
    const apiRes = await fetch(`https://zapatillasmay-production.up.railway.app/productos/?sku_interno=eq.${slug}&select=nombre,descripcion,imagen_principal,precio_menudeo`)
    const productos = await apiRes.json()
    const p = productos[0]
    
    if (!p) {
      res.redirect(302, '/')
      return
    }

    const nombre = (p.nombre || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
    const descripcion = (p.descripcion || p.nombre || 'Calzado de moda para dama').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/\n/g, ' ')
    const imagen = p.imagen_principal || ''
    const precio = p.precio_menudeo || 0
    const nombreClean = (p.nombre || '').replace(/[\u0000-\u001F]/g, '')
    const descripcionClean = (p.descripcion || p.nombre || '').replace(/[\u0000-\u001F]/g, '').substring(0, 200)
    const schema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": nombreClean,
  "description": descripcionClean,
  "image": imagen,
  "sku": slug,
  "brand": { "@type": "Brand", "name": "Zapatillas May" },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "MXN",
    "price": precio,
    "availability": "https://schema.org/InStock",
    "url": `https://zapatillasmay.mx/producto/${slug}`
  }
})

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${nombre} | Zapatillas May</title>
  <meta name="description" content="${descripcion}">
  <meta property="og:title" content="${nombre} | Zapatillas May">
  <meta property="og:description" content="${descripcion}">
  <meta property="og:image" content="${imagen}">
  <meta property="og:image:alt" content="${nombre} | Zapatillas May">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="1200">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:url" content="https://www.zapatillasmay.mx/producto/${slug}">
  <meta property="og:type" content="product">
  <meta property="og:site_name" content="Zapatillas May">
  <meta property="fb:app_id" content="1476063547636095">
  <meta property="product:price:amount" content="${precio}">
  <meta property="product:price:currency" content="MXN">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${nombre} | Zapatillas May">
  <meta name="twitter:description" content="${descripcion}">
  <meta name="twitter:image" content="${imagen}">
  <script type="application/ld+json">${schema}</script>
</head>
<body>
  <script>window.location.href = 'https://zapatillasmay.mx/?p=${slug}'</script>
</body>
</html>`

    res.setHeader('Content-Type', 'text/html')
    res.send(html)
  } catch(e) {
    res.redirect(302, '/')
  }
}