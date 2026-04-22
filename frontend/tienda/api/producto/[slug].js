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
  <meta property="og:title" content="${p.nombre} | Zapatillas May">
  <meta property="og:image" content="${p.imagen_principal}">
  <meta property="og:description" content="${p.descripcion || 'Calzado de moda para dama'}">
  <meta property="og:url" content="https://zapatillasmay.mx/producto/${slug}">
  <meta property="og:type" content="product">
  <meta property="product:price:amount" content="${p.precio_menudeo}">
  <meta property="product:price:currency" content="MXN">
</head>
<body>
  <script>window.location.href = '/?producto=${slug}'</script>
</body>
</html>`

  res.setHeader('Content-Type', 'text/html')
  res.send(html)
}