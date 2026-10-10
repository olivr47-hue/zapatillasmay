# Product Marketing Context — Zapatillas May

*Last updated: 2026-10-10*

## Product Overview
**One-liner:** Calzado de moda para dama fabricado en León, Guanajuato, con venta en menudeo, descuento automático por volumen en la tienda y un portal de mayoreo para revendedoras.
**What it does:** Zapatillas May vende calzado femenino de moda (tacones, sandalias, botas, botines, niña) directamente al consumidor final y a revendedores/tiendas. En la tienda el descuento por volumen es automático (a más pares en el carrito, menor precio por par, sin códigos). Las revendedoras con cuenta usan el portal de mayoreo (zapatillasmay.mx/mayoreo lleva al portal): catálogo, carrito, apartados, corridas, pedidos, registro de ventas, calculadora y la mascota Tacona.
**Product category:** Calzado femenino de moda / Tienda de zapatos en línea
**Product type:** E-commerce (tienda en línea) con modelo dual menudeo + mayoreo
**Business model:** Venta directa. Precios dinámicos por volumen:
- 1 par: precio de la tienda = precio menudeo del panel +$80 (salvo modelos en oferta)
- 3–5 pares: -$60/par sobre el precio de la tienda
- 6+ pares: -$100/par sobre el precio de la tienda
- Corrida completa: precio de corrida por modelo (portal de mayoreo)
- Envío gratis desde $1,299
- Algunas clientas de mayoreo compran a crédito (forma de pago «crédito»)
- Otros canales: Mercado Libre, Amazon, Walmart, SHEIN y TikTok Shop (inventario y estados se sincronizan desde el panel)

## Target Audience
**Menudeo (consumidor final):**
- Mujeres de 18–45 años en México
- Buscan moda accesible, modelos actuales, precios justos
- Compran desde el celular (mobile-first)

**Mayoreo (revendedores):**
- Dueños de tiendas pequeñas de calzado o ropa
- Revendedoras independientes (venta por catálogo, redes sociales)
- Boutiques que buscan surtir modelos de moda sin comprometerse a pedidos mínimos grandes

**Decision-makers:** La compradora directamente (B2C) y el/la dueño/a de negocio (B2B)
**Primary use case:** Comprar calzado de moda a buen precio, con envío a todo México
**Jobs to be done:**
- "Quiero estar a la moda sin pagar precios de boutique"
- "Necesito surtir mi tienda con modelos actuales sin complicarme"
- "Busco mayoreo sin que me obliguen a pedir docenas o registrarme"

## Problems & Pain Points
**Core problem (menudeo):** Difícil encontrar calzado de moda con buen precio y envío confiable a todo México
**Core problem (mayoreo):** Los proveedores de mayoreo exigen pedidos mínimos grandes, registro previo, o solo venden en León presencialmente
**Why alternatives fall short:**
- Mercado Libre / Amazon: poca variedad de moda, no es directo del fabricante
- Tiendas locales: precios de menudeo, sin mayoreo
- Distribuidores tradicionales: requieren registro, pedidos mínimos, pago anticipado
**Emotional tension:** "No sé si el producto va a llegar bien" / "¿Los modelos son actuales o del año pasado?"

## Competitive Landscape
**Direct:** Otras tiendas de calzado en línea (Flexi, PRICE, Shein calzado) — no tienen mayoreo automático ni son locales de León
**Secondary:** Mercado Libre, Amazon — precios bajos pero sin garantía de moda actual
**Indirect:** Comprar en León presencialmente — mejor precio pero requiere desplazamiento

## Differentiation
**Key differentiators:**
- Descuento automático por volumen en la tienda (3+ pares) sin códigos; portal de mayoreo con apartados y corridas para revendedoras
- Nuevos modelos cada semana (producción local León, Guanajuato)
- Precio transparente: el sistema calcula el descuento solo
- Canal directo fabricante→cliente (sin intermediarios)
**Why customers choose us:** Precio de mayoreo accesible para pequeños revendedores + moda actual + envíos a todo México

## Customer Language
**How they describe the problem:**
- "¿Manejan mayoreo?"
- "¿Cuánto es el mínimo?"
- "¿Hacen envíos a [ciudad]?"
- "¿Los modelos son nuevos?"
**How they describe us:**
- "Calzado de León"
- "Zapatillas May"
**Words to use:** moda, colección, modelos nuevos, mayoreo sin complicaciones, precio por volumen, envíos a todo México
**Words to avoid:** zapatos usados, outlet, segunda mano, temporada pasada

## Brand Voice
**Tone:** Femenino, moderno, accesible — ni muy formal ni muy informal
**Style:** Directo, visual, orientado a la moda
**Personality:** Trendy, confiable, cercano, aspiracional sin ser exclusivo

## Social Presence
- Instagram: @zapatillas_may (Maya, asistente de WhatsApp/Instagram, contesta a clientas)
- Facebook: MAYZapatillas
- TikTok: @zapatillasmay
- WhatsApp: +52 479 224 4560 · Correo: contacto@zapatillasmay.mx

## Contact & Location
- Dirección: Cuautla 211 Col. Killian, León, Guanajuato, CP 37260
- Horario: (definir)

## Tech Stack (para referencia)
- Tienda: HTML/JS estático en Vercel (zapatillasmay.mx); panel y portal de mayoreo: Vite en Vercel (portal.zapatillasmay.mx)
- Backend: FastAPI en Railway
- DB: Supabase
- Imágenes: Cloudinary
- Analytics: Google Analytics 4 (propiedad 473384950)
- Píxeles: Facebook Pixel + TikTok Pixel

## Goals
**Business goal:** Aumentar ventas en línea menudeo y mayoreo; crecer base de revendedores
**Conversion action:** Agregar al carrito → completar pedido vía WhatsApp o checkout
**Current metrics (oct 2026):** más de 3,000 pares vendidos y ~500 pedidos; la tienda web minorista es una parte pequeña de las ventas (~3%), la mayor parte viene de mayoreo/portal y mostrador; 283 modelos disponibles en la tienda; 0 reseñas publicadas. GA4 activo (propiedad 473384950). Plan Vercel gratuito (cerca del límite de solicitudes).
