# zm-img (Cloudflare Worker)

Sirve y guarda en caché las fotos de Cloudinary (cuenta `dybdtehhs`) desde `https://img.zapatillasmay.mx`.
Objetivo: que las descargas repetidas las entregue Cloudflare y no gasten créditos de descarga de Cloudinary.

- Código: `worker.js` (se pega a mano en Cloudflare: Compute > Workers & Pages > `zm-img` > Edit code).
- Dominio: Worker > Settings > Domains & Routes > Custom domain `img.zapatillasmay.mx`.
- Verificación: la cabecera `X-ZM-Cache` dice `HIT`, `MISS` o `ERR`.
- Tienda: `zmCdn()` en `frontend/tienda/assets/app.*.js`, `producto.html` y `carrito.html`; servidor: `_cdn_img()` en `backend/routers/seo.py`
  (variable `ZM_IMG_HOST` en Railway; vacía = apagado). Si el dominio falla, las fotos vuelven solas a Cloudinary.
  Interruptor de emergencia en el navegador: `localStorage.zm_img = 'cloudinary'`.
- Límite del plan gratis de Workers: 100,000 peticiones al día.
