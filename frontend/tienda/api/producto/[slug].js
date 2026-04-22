export default async function handler(req, res) {
  const { slug } = req.query
  const apiRes = await fetch(`https://zapatillasmay-production.up.railway.app/productos/?sku_interno=eq.${slug}&select=nombre,descripcion,imagen_principal,precio_menudeo`)
  const productos = await apiRes.json()
  const p = productos[0]
  
  if (!p) {
    res.redirect(302, '/')
    return
  }

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${p.nombre} | Zapatillas May</title>
  <meta name="description" content="${p.descripcion || 'Calzado de moda para dama en León, Guanajuato'}">
  <meta property="og:title" content="${p.nombre} | Zapatillas May">
  <meta property="og:description" content="${p.descripcion || 'Calzado de moda para dama en León, Guanajuato'}">
  <meta property="og:image" content="${p.imagen_principal}">
  <meta property="og:image:alt" content="${p.nombre} | Zapatillas May">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="1200">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:url" content="https://www.zapatillasmay.mx/producto/${slug}">
  <meta property="og:type" content="product">
  <meta property="og:site_name" content="Zapatillas May">
  <meta property="fb:app_id" content="1476063547636095">
  <meta property="product:price:amount" content="${p.precio_menudeo}">
  <meta property="product:price:currency" content="MXN">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${p.nombre} | Zapatillas May">
  <meta name="twitter:description" content="${p.descripcion || 'Calzado de moda para dama'}">
  <meta name="twitter:image" content="${p.imagen_principal}">
</head>
<body>
  <script>window.location.href = '/producto/${slug}#open'</script>
</body>
</html>`

  res.setHeader('Content-Type', 'text/html')
  res.send(html)
}