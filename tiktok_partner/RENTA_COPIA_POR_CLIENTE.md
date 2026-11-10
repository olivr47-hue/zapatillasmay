# Renta del sistema: una copia por cliente

Decisión del dueño (2026-11-10): cada negocio que renta el sistema tiene **su propia copia** (su base de datos, su servidor y su panel). Así sus datos nunca se mezclan con los de otro negocio.

## Cómo encaja con TikTok

La app de TikTok «ERP MAY» es **una sola**. Su secreto vive solo en el servidor central (el tuyo) y **no se reparte a las copias**. El servidor central hace de intermediario:

| Qué pasa | Quién lo hace |
|---|---|
| Firmar cada llamada a TikTok (TikTok exige firmarla con el secreto de la app) | El central, a petición de la copia |
| Renovar el acceso a TikTok cuando se vence | El central, a petición de la copia |
| Recibir el regreso de la autorización de TikTok (una sola dirección para todos) | El central: canjea el código y entrega el acceso a la copia correcta |
| Guardar el acceso a TikTok de ese negocio y usarlo | La copia del cliente (el acceso nunca se queda en el central) |

Cada copia tiene un **código** y un **secreto propio**. Todo mensaje entre la copia y el central va firmado (HMAC-SHA256) con marca de tiempo de 5 minutos. Probado con simulaciones: una firma falsa, un cliente inventado, una petición vencida o la firma de un cliente usada por otro son rechazadas.

Tu propio sistema (Zapatillas May) **no cambia**: sigue funcionando igual porque no usa el modo copia.

## Crear una copia nueva para un cliente

1. **Base de datos:** crear un proyecto de Supabase nuevo para el cliente y cargarle la estructura de tablas del sistema (pendiente: ver «Lo que falta» abajo).
2. **Servidor:** crear un servicio en Railway con el mismo código del sistema y sus variables (llaves de Supabase, `SECRET_KEY`, etc.).
3. **Panel:** crear un proyecto de Vercel para el panel de ese cliente, apuntando a su servidor.
4. **Alta en el central:** desde tu panel de administrador (o con `POST /tiktok/broker/clientes`) dar de alta al cliente con su nombre y las direcciones de su servidor y de su panel. El sistema te devuelve un **código** y un **secreto** (el secreto se ve una sola vez).
5. **Variables de TikTok en la copia del cliente:**
   - `TIKTOK_BROKER_URL` = dirección del servidor central
   - `TIKTOK_CLIENTE_CODIGO` y `TIKTOK_CLIENTE_SECRETO` = los del paso 4
   - `TIKTOK_APP_KEY` = la clave pública de la app (no es secreta)
   - **No** se pone `TIKTOK_APP_SECRET`.
6. El cliente entra a su panel → TikTok Shop → **Conectar**, autoriza con su cuenta de vendedor, y TikTok lo regresa a su panel ya conectado.

Las demás conexiones (MercadoLibre, Walmart, SHEIN, Amazon, WhatsApp, pagos…) las pone el cliente en su propio panel, en **Conexiones**, sin tocar el servidor.

## Lo que falta construir

- **Estructura de la base de datos de una copia nueva:** el sistema creció en una sola base y no existe un archivo que cree todas las tablas desde cero. Hay que generarlo a partir de la base actual (tablas, índices, funciones y permisos) y probar que una copia vacía arranca.
- **Marca blanca:** el nombre «Zapatillas May», el logo y varios textos están escritos dentro del panel, la tienda y los correos. Cada cliente debe poder poner el suyo.
- **Alta automática:** hoy cada paso de arriba es manual. Con varios clientes conviene un guion que cree todo de una vez.
- **Cobro y condiciones:** precio de la renta, qué incluye, política de privacidad y términos para otros negocios.
- **Qué pasa con las actualizaciones:** cada mejora al sistema se tendría que desplegar en todas las copias.
- **Costos de infraestructura por cliente** (Supabase, Railway, Vercel): no los he calculado; hay que ver los planes vigentes antes de fijar el precio.

## Seguridad del esquema

- El secreto de la app de TikTok queda solo en el central.
- Un cliente comprometido solo puede firmar llamadas con **su propio** acceso de TikTok (que es el único que tiene).
- Desactivar a un cliente (`activo = false` en `clientes_sistema`) corta de inmediato su firma y su renovación.
