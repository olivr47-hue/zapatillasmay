# Material para la Revisión de la App de Meta — Zapatillas May Bot

Preparado para solicitar acceso estándar (Advanced Access) a los permisos:
- `instagram_manage_comments`
- `instagram_manage_messages`
- `instagram_manage_engagement`

App ID: 1476063547636095 · Negocio: Zapatillas MAY

---

## ✅ Ya listo (lo hice yo)

- Página de Términos y condiciones: https://zapatillasmay.mx/terminos
- Página de Eliminación de datos: https://zapatillasmay.mx/eliminacion-datos
- URLs actualizadas en Configuración básica de la app (antes apuntaban a facebook.com)
- Política de privacidad ya existía: https://zapatillasmay.mx/privacidad

## ⚠️ Lo que falta y solo tú puedes hacer

1. **Grabar el video de demostración** (obligatorio, ver guion abajo).
2. **Confirmar verificación de negocio** — revisa en business.facebook.com > Configuración del negocio > Verificación del negocio, que tu negocio esté verificado. Si no lo está, Meta te lo va a pedir durante la revisión de todos modos.
3. **Enviar la solicitud** en developers.facebook.com/apps/1476063547636095 → Casos de uso → "Administrar mensajes y contenido en Instagram" → Permisos y funciones → botón "Solicitar acceso avanzado" en cada uno de los 3 permisos.
4. Pegar el texto de justificación de cada permiso (abajo) en el campo que pida Meta.

---

## 1. Justificación de uso — `instagram_manage_comments`

**Cómo lo usamos (texto sugerido para el formulario):**

> Zapatillas May es una tienda de calzado de moda para dama. Usamos este permiso para que nuestra asistente automatizada, Maya, responda públicamente los comentarios que los clientes dejan en nuestras publicaciones de Instagram (por ejemplo, preguntas sobre precio, tallas disponibles o el modelo). Maya consulta nuestro catálogo real de productos y responde en 1-2 líneas con datos exactos (precio, tallas), o invita al cliente a escribirnos por mensaje directo si necesita dar más información personal. Nunca publicamos contenido promocional no solicitado ni pedimos datos personales en los comentarios públicos.

## 2. Justificación de uso — `instagram_manage_messages`

> Usamos este permiso para que Maya, nuestra asistente automatizada, conteste los mensajes directos que los clientes nos mandan por Instagram — igual que ya hacemos por WhatsApp. Maya contesta preguntas sobre productos, tallas, precios y el estado de un pedido, usando el catálogo real de la tienda. En cualquier momento el negocio puede pausar a Maya (globalmente o por conversación) y un empleado real toma el control desde nuestro panel de administración.

## 3. Justificación de uso — `instagram_manage_engagement`

> Este permiso es necesario para que Maya pueda publicar la respuesta a un comentario (crear una respuesta enlazada al comentario original del cliente), como parte del mismo flujo de atención a comentarios descrito arriba.

---

## Guion para el video de demostración

Meta pide un screencast SIN cortes mostrando el flujo real, de principio a fin. Sugerencia (2-3 minutos):

1. **(10s)** Muestra tu cuenta de Instagram de negocio conectada a la app en el Meta Developer Console (pantalla de "Casos de uso" → Instagram, mostrando la cuenta vinculada).
2. **(30s) Comentarios:** Desde OTRA cuenta de Instagram (no la del negocio), comenta en una publicación real de @zapatillasmay preguntando algo simple, ej. "¿Tienen el modelo en talla 24?". Cambia a la cuenta del negocio y muestra cómo, segundos después, aparece la respuesta automática de Maya en los comentarios de esa publicación.
3. **(30s) Mensajes directos:** Desde la misma cuenta externa, manda un DM a @zapatillasmay preguntando algo, ej. "¿Cuánto cuesta el par de tacones rosas?". Muestra la respuesta automática de Maya en el chat.
4. **(30s) Panel de control:** Abre el panel de administración (portal.zapatillasmay.mx → Conversaciones) y muestra esa misma conversación de Instagram apareciendo ahí, con su insignia de canal (📷 Instagram), y el interruptor "Maya activa/en pausa".
5. **(20s) Apagar Maya:** Apaga el interruptor de Maya, manda otro mensaje de prueba desde la cuenta externa, y muestra que esta vez Maya NO contesta sola (el mensaje se guarda en el panel para que un humano lo conteste).

Este video se sube directamente en el formulario de solicitud de cada permiso.

---

## Notas técnicas de referencia (por si Meta pregunta)

- Webhook URL: `https://zapatillasmay-production.up.railway.app/chatbot/meta`
- Campos suscritos: `comments`, `messages` (ya confirmados activos)
- La app ya está en modo "Publicada", solo faltan estos 3 permisos en Advanced Access
