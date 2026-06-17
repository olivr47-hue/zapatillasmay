from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_post, supabase_patch
from cache import cache_get, cache_set, cache_invalidate
import urllib.request
import json
import os
import time
import base64
import re
import mercadopago

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

def get_api_key():
    return os.environ.get("ANTHROPIC_API_KEY", "")

def construir_catalogo(productos):
    catalogo = ""
    for p in productos:
        sku = p.get('sku_interno') or p.get('id','')
        catalogo += f"- [SKU:{sku}] {p['nombre']}"
        if p.get('imagen_principal'):
            catalogo += f" [IMG:{p['imagen_principal']}]"
        _pm = p.get('precio_menudeo') or 0
        _menudeo_real = _pm if p.get('es_oferta') else round(_pm + 80)
        catalogo += f": menudeo ${_menudeo_real}"
        if p.get('precio_mayoreo3'):
            catalogo += f", mayoreo 3-5pares ${p['precio_mayoreo3']}"
        if p.get('precio_mayoreo6'):
            catalogo += f", mayoreo 6+ ${p['precio_mayoreo6']}"
        if p.get('precio_corrida') and p.get('corrida_activa'):
            catalogo += f", corrida ${p['precio_corrida']}"
        if p.get('nuevo'):
            catalogo += " 🆕NUEVO"
        if p.get('categoria'):
            catalogo += f" [{p['categoria']}]"
        if p.get('tallas_disponibles'):
            catalogo += f" | Tallas: {', '.join(p['tallas_disponibles'])}"
        catalogo += "\n"
    return catalogo

def construir_sistema(catalogo):
    return f"""Eres Maya, asistente de ventas de Zapatillas May en León, Guanajuato por WhatsApp.

SOBRE ZAPATILLAS MAY:
- Calzado de moda para dama: tacones, sandalias, plataformas, botas, botines y accesorios
- Hecho en México con orgullo 🇲🇽
- Enviamos a todo México, Estados Unidos y Canadá
- Llegan modelos nuevos cada semana

PRECIOS Y MAYOREO (USA SIEMPRE los precios EXACTOS que aparecen en el catálogo de cada modelo — NO los calcules, NO sumes ni restes nada):
- Menudeo (1-2 pares): usa el precio "menudeo" del catálogo TAL CUAL (ya es el precio de venta al público del sitio web).
- Mayoreo variado 3-5 pares: usa el precio "mayoreo 3-5pares" del catálogo (puedes mezclar estilos y colores).
- Mayoreo variado 6+ pares: usa el precio "mayoreo 6+" del catálogo.
- Corrida completa: usa el precio "corrida" del catálogo (mismo estilo/color, tallas 23 al 26 con medios = 6 pares).
- Si un modelo no muestra precio de mayoreo/corrida en el catálogo, ofrece el de menudeo y di que confirmas el de mayoreo con una asesora.

ENVÍOS (costo exacto — úsalo al calcular totales):
- 1 par: $99 | 2 pares: $150 | 3-5 pares: $199
- Envío GRATIS cuando el subtotal de productos es $1,299 o más
- Mayoreo 6+ pares: Castores (pago al recibir), Estafeta o Fedex (pago con pedido)
- IMPORTANTE: siempre calcula el envío correcto según número de pares antes de cotizar
- Horario: Lunes y Sábado 10am–3pm | Martes a Viernes 10am–7pm | Domingo: cerrado
- Enviamos en 24hrs después de confirmar pago (excepto sábados 3pm+ y domingos)
- Cambios: el retorno de paquetería corre por cuenta del comprador

CATÁLOGO ACTUAL (cada línea: [SKU:codigo] nombre [IMG:foto] precio | tallas):
{catalogo if catalogo else "Catálogo en actualización"}

=== FLUJO DE VENTA — SIGUE ESTOS PASOS EN ORDEN ===

PASO 1 — MOSTRAR PRODUCTO:
Cuando pregunten por algún tipo de calzado o modelo específico:
- Menciona 1-2 modelos con precio
- Incluye su foto: ENVIAR_FOTO:[url_exacta_del_IMG]
- Pregunta si le gusta o si quiere ver los colores disponibles
- Ejemplo: "Tenemos el MA302 a $365 👠 ENVIAR_FOTO:[https://...] ¿Te gusta? ¿Le doy una vuelta a los colores disponibles?"

PASO 2 — MOSTRAR COLORES (cuando el cliente muestre interés en un modelo):
- USA el marcador: BUSCAR_COLORES:[SKU_exacto]
- Ejemplo: "¡Claro! Mira los colores que tenemos del MA302 😍 BUSCAR_COLORES:[MA302]"
- El sistema mandará automáticamente las fotos de cada color disponible
- Después pregunta: "¿Cuál color te late más?"

PASO 3 — CONFIRMAR COLOR Y TALLA:
Cuando el cliente elija color:
- Confirma el color elegido
- Pregunta la talla: "¡Perfecto el [color]! ¿Qué talla usas? Manejamos del 22 al 27 👟"

PASO 4 — TOMAR DATOS DE ENVÍO:
Cuando tengas modelo + color + talla:
- "¡Listo! Para tu pedido necesito 📦:
  • Tu nombre completo
  • Dirección de envío (calle, número, colonia, ciudad, CP)
  • ¿Cómo prefieres pagar?"

PASO 5 — CERRAR PEDIDO Y GENERAR LINK DE PAGO:
Cuando tengas TODOS los datos (nombre completo + dirección + modelos + colores + tallas + precios):
- Calcula el subtotal sumando todos los pares
- Calcula el envío según las reglas de ENVÍOS (1 par=$99, 2=$150, 3-5=$199, gratis si subtotal≥$1,299)
- Resume el pedido con subtotal + envío + total
- Usa el marcador GENERAR_PAGO con JSON exacto (sin espacios extra, sin saltos de línea dentro):
  GENERAR_PAGO:{{"nombre":"NOMBRE","direccion":"DIRECCION","modelo":"DESCRIPCION_PEDIDO","sku":"SKU_PRINCIPAL","color":"COLOR","talla":"TALLAS","precio":SUBTOTAL_NUMERO,"pares":TOTAL_PARES}}
- Ejemplo pedido 3 pares $430 c/u: GENERAR_PAGO:{{"nombre":"Lupita García","direccion":"Av. Hidalgo 123, CDMX 06600","modelo":"EF1203 LATTE T23.5 + EF1203 NEGRO T23.5 + CR3385 ORO T23","sku":"EF1203","color":"varios","talla":"varios","precio":1290,"pares":3}}
- El sistema calculará el envío correcto y mandará el link de Mercado Pago automáticamente
- NO pongas LINK_PAGO, usa GENERAR_PAGO con el JSON

=== REGLAS IMPORTANTES ===
- Habla como vendedora mexicana amigable y natural (amiga, no robot)
- Máximo 3-4 líneas por mensaje, nunca textos largos de golpe
- NUNCA inventes precios ni modelos fuera del catálogo
- NUNCA mandes el link del sitio como primera respuesta, primero muestra productos
- Si el cliente llega con un pedido del sitio web (lista de productos con SKU y precio), CONFÍA en esos datos — son reales aunque no estén en tu catálogo. Procesa el pedido sin cuestionar disponibilidad. Solo pide nombre y dirección para envío.
- Si el cliente pide asesor humano: "Con gusto te comunico con una asesora, espera un momento 😊" y para de responder
- Si preguntan por mayoreo, explica los precios y pregunta cuántos pares buscan
- Sé diferente en cada mensaje, no repitas el mismo texto
- Responde siempre en español mexicano natural

=== COMPROBANTES DE PAGO ===
- Si el cliente manda una imagen que parece captura de transferencia, OXXO, Mercado Pago u otro comprobante de pago: confirma el pago, di que procesamos en 24hrs y pregunta al final "¿Hay algo más en lo que te pueda ayudar? 😊" NO pidas ningún dato adicional del pedido.
- NUNCA pidas nombre, dirección, modelos, tallas ni nada más cuando ya tienes el comprobante — ya tienes toda la info del pedido en el historial."""

def llamar_claude(mensajes, sistema):
    url = "https://api.anthropic.com/v1/messages"
    headers = {
        "x-api-key": get_api_key(),
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }
    body = json.dumps({
        "model": "claude-sonnet-4-6",
        "max_tokens": 500,
        "system": sistema,
        "messages": mensajes
    }).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read())
            return data["content"][0]["text"]
    except urllib.error.HTTPError as e:
        error = e.read().decode()
        raise Exception(f"Claude API error: {error}")

def llamar_claude_con_imagen(img_b64, sistema, historial=[], caption=""):
    url = "https://api.anthropic.com/v1/messages"
    headers = {
        "x-api-key": get_api_key(),
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }
    # Incluir el caption del cliente si lo mandó junto con la imagen
    if caption:
        texto_prompt = (
            f"La clienta me mandó esta foto y escribió: \"{caption}\". "
            f"SÍ PUEDO VER LA IMAGEN. Analiza el estilo (taco, sandalia, bota, plataforma), color y detalles. "
            f"Responde a lo que preguntó y busca en el catálogo el modelo MÁS parecido. "
            f"Menciona el precio y muestra la foto con ENVIAR_FOTO:[url]. Si hay 2 opciones parecidas muéstralas. "
            f"NO digas que no recibiste la imagen."
        )
    else:
        texto_prompt = (
            "El cliente me mandó esta imagen. SÍ PUEDO VER LA IMAGEN. "
            "PRIMERO determina qué tipo de imagen es:\n"
            "A) Comprobante de pago (captura de transferencia, OXXO, Mercado Pago, CoDi, SPEI, etc.) → confirma el pago, di que procesamos en 24hrs y pregunta '¿Hay algo más en lo que te pueda ayudar? 😊'. Sin pedir datos del pedido.\n"
            "B) Foto de calzado → analiza el estilo (taco, sandalia, bota, plataforma), color y detalles. Busca en el catálogo el modelo MÁS parecido, menciona el precio y muestra la foto con ENVIAR_FOTO:[url]. Si hay 2 opciones parecidas muéstralas.\n"
            "NO digas que no recibiste la imagen."
        )
    mensajes = historial + [{
        "role": "user",
        "content": [
            {
                "type": "image",
                "source": {"type": "base64", "media_type": "image/jpeg", "data": img_b64}
            },
            {
                "type": "text",
                "text": texto_prompt
            }
        ]
    }]
    body = json.dumps({
        "model": "claude-sonnet-4-6",
        "max_tokens": 500,
        "system": sistema,
        "messages": mensajes
    }).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read())
            return data["content"][0]["text"]
    except urllib.error.HTTPError as e:
        error = e.read().decode()
        raise Exception(f"Claude API error: {error}")

def _wa_send(payload: dict) -> str:
    """Envía payload a la API de WhatsApp y devuelve el message_id (wamid)."""
    wa_token = os.environ.get("WHATSAPP_TOKEN", "")
    phone_id = os.environ.get("WHATSAPP_PHONE_ID", "")
    if not wa_token or not phone_id:
        return ""
    url = f"https://graph.facebook.com/v25.0/{phone_id}/messages"
    headers = {"Authorization": f"Bearer {wa_token}", "Content-Type": "application/json"}
    req = urllib.request.Request(url, data=json.dumps(payload).encode(), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as r:
            data = json.loads(r.read())
            return data.get("messages", [{}])[0].get("id", "")
    except Exception as e:
        print(f"Error WA send: {e}")
        return ""

def enviar_whatsapp_texto(to, texto, reply_to_id=None):
    payload = {
        "messaging_product": "whatsapp",
        "to": to,
        "type": "text",
        "text": {"body": texto}
    }
    if reply_to_id:
        payload["context"] = {"message_id": reply_to_id}
    return _wa_send(payload)

def enviar_whatsapp_plantilla(to: str, nombre_plantilla: str, idioma: str, parametros: list) -> str | None:
    """Envía un mensaje usando una plantilla aprobada de Meta WA. parametros = lista de strings para {{1}}, {{2}}..."""
    components = []
    if parametros:
        components.append({
            "type": "body",
            "parameters": [{"type": "text", "text": str(p)} for p in parametros]
        })
    return _wa_send({
        "messaging_product": "whatsapp",
        "to": to,
        "type": "template",
        "template": {
            "name": nombre_plantilla,
            "language": {"code": idioma},
            "components": components
        }
    })

def enviar_whatsapp_imagen(to, url_img, caption=""):
    print(f"ENVIANDO IMAGEN: {url_img}")
    return _wa_send({
        "messaging_product": "whatsapp",
        "to": to,
        "type": "image",
        "image": {"link": url_img, "caption": caption}
    })

def enviar_whatsapp_documento(to, url_doc, filename="documento.pdf", caption=""):
    return _wa_send({
        "messaging_product": "whatsapp",
        "to": to,
        "type": "document",
        "document": {"link": url_doc, "filename": filename, "caption": caption}
    })

def enviar_whatsapp_video(to, url_vid, caption=""):
    return _wa_send({
        "messaging_product": "whatsapp",
        "to": to,
        "type": "video",
        "video": {"link": url_vid, "caption": caption}
    })

def enviar_whatsapp_reaccion(to, message_id, emoji):
    return _wa_send({
        "messaging_product": "whatsapp",
        "to": to,
        "type": "reaction",
        "reaction": {"message_id": message_id, "emoji": emoji}
    })

def enviar_whatsapp_ubicacion(to, lat, lng, nombre="", direccion=""):
    return _wa_send({
        "messaging_product": "whatsapp",
        "to": to,
        "type": "location",
        "location": {"latitude": lat, "longitude": lng, "name": nombre, "address": direccion}
    })

def enviar_whatsapp_contacto(to, nombre, telefono, empresa=""):
    return _wa_send({
        "messaging_product": "whatsapp",
        "to": to,
        "type": "contacts",
        "contacts": [{
            "name": {"formatted_name": nombre, "first_name": nombre.split()[0]},
            "phones": [{"phone": telefono, "type": "CELL", "wa_id": telefono}],
            "org": {"company": empresa} if empresa else {}
        }]
    })

def mark_as_read_wa(message_id: str):
    """Envía el visto (✓✓ azul) al cliente en WhatsApp."""
    wa_token = os.environ.get("WHATSAPP_TOKEN", "")
    phone_id = os.environ.get("WHATSAPP_PHONE_ID", "")
    if not wa_token or not phone_id or not message_id:
        return
    try:
        _wa_send({
            "messaging_product": "whatsapp",
            "status": "read",
            "message_id": message_id
        })
    except Exception:
        pass

def generar_link_pago_wa(telefono: str, datos_pedido: dict) -> tuple:
    """Crea el pedido en ERP + preferencia Mercado Pago. Devuelve (link, total, pedido_id)."""
    try:
        nombre     = datos_pedido.get("nombre", "Cliente")
        direccion  = datos_pedido.get("direccion", "")
        modelo     = datos_pedido.get("modelo", "Calzado")
        color      = datos_pedido.get("color", "")
        talla      = datos_pedido.get("talla", "")
        precio     = float(datos_pedido.get("precio", 0))
        pares      = int(datos_pedido.get("pares", 1))
        # Cálculo de envío igual que el sitio web
        if precio >= 1299:
            envio = 0.0
        elif pares >= 3:
            envio = 199.0
        elif pares >= 2:
            envio = 150.0
        else:
            envio = 99.0
        total      = precio + envio
        descripcion = f"{modelo} — {color} talla {talla}"
        notas       = f"Pedido WhatsApp | {descripcion} | Envío a: {direccion}"

        # 1. Crear pedido en Supabase
        try:
            pedido_db = supabase_post("pedidos", {
                "nombre_cliente":   nombre,
                "telefono_cliente": telefono,
                "email_cliente":    "cliente@zapatillasmay.mx",
                "total":            total,
                "status":           "checkout_iniciado",
                "canal":            "whatsapp",
                "notas":            notas,
                "direccion_envio":  direccion,
            })
        except Exception as e:
            print(f"[link-pago] FALLO al crear pedido en Supabase: {e}")
            return None, 0, None
        # supabase_post puede devolver lista o dict
        pedido_id = (pedido_db[0] if isinstance(pedido_db, list) else pedido_db).get("id")
        if not pedido_id:
            print(f"[link-pago] Pedido creado sin id. Respuesta: {pedido_db}")
            return None, total, None

        # 2. Crear preferencia Mercado Pago
        mp_token = os.environ.get("MP_ACCESS_TOKEN", "")
        if not mp_token:
            print("[link-pago] FALTA MP_ACCESS_TOKEN en variables de entorno")
            return None, total, pedido_id
        try:
            sdk = mercadopago.SDK(mp_token)
            pref_data = {
                "items": [
                    {"title": descripcion[:255], "quantity": 1, "unit_price": precio, "currency_id": "MXN"},
                    {"title": "Envío",           "quantity": 1, "unit_price": envio,  "currency_id": "MXN"},
                ],
                "payer":              {"name": nombre, "email": "cliente@zapatillasmay.mx"},
                "external_reference": str(pedido_id),
                "back_urls": {
                    "success": "https://zapatillasmay.com/gracias",
                    "failure": "https://zapatillasmay.com/pago-fallido",
                    "pending": "https://zapatillasmay.com/pago-pendiente",
                },
                "auto_return": "approved",
            }
            # Solo incluir notification_url si NO está vacío (MP rechaza "" como URL inválida)
            webhook_url = os.environ.get("MP_WEBHOOK_URL", "")
            if webhook_url:
                pref_data["notification_url"] = webhook_url
            result = sdk.preference().create(pref_data)
            pref   = result["response"]
            link   = pref.get("init_point", "")
            if not link:
                print(f"[link-pago] MP no devolvió init_point. Respuesta MP: {result}")
                return None, total, pedido_id
        except Exception as e:
            print(f"[link-pago] FALLO en Mercado Pago: {e}")
            return None, total, pedido_id

        if pref.get("id"):
            try:
                supabase_patch(f"pedidos?id=eq.{pedido_id}",
                               {"mp_preference_id": pref["id"]})
            except Exception as e:
                print(f"[link-pago] No se pudo guardar mp_preference_id (no crítico): {e}")
        return link, total, pedido_id
    except Exception as e:
        import traceback
        print(f"[link-pago] Error inesperado: {e}\n{traceback.format_exc()}")
        return None, 0, None


def obtener_colores_modelo(sku):
    """Devuelve lista de {color, foto_url} del modelo con ese SKU."""
    try:
        # Buscar el producto por sku_interno
        prods = supabase_get(f"productos?sku_interno=eq.{sku}&select=id")
        if not prods:
            return []
        prod_id = prods[0]['id']
        variantes = supabase_get(f"variantes?producto_id=eq.{prod_id}&activa=eq.true&select=color,foto_url,color_hex")
        # Agrupar por color (un registro por color, primera foto disponible)
        mapa = {}
        for v in variantes:
            c = v.get('color','')
            if not c:
                continue
            if c not in mapa:
                mapa[c] = {'color': c, 'foto_url': v.get('foto_url'), 'hex': v.get('color_hex','')}
            elif not mapa[c]['foto_url'] and v.get('foto_url'):
                mapa[c]['foto_url'] = v['foto_url']
        return list(mapa.values())
    except Exception as e:
        print(f"Error obteniendo colores: {e}")
        return []

def obtener_info_pago():
    """Obtiene las instrucciones de pago — primero env var, luego DB."""
    # 1) Variable de entorno en Railway (más fácil de configurar)
    pago_env = os.environ.get("PAGO_INFO", "").strip()
    if pago_env:
        return pago_env
    # 2) Tabla whatsapp_config en Supabase
    try:
        config = supabase_get("whatsapp_config")
        cfg = {c['clave']: c['valor'] for c in config}
        if cfg.get('info_pago'):
            return cfg['info_pago']
        if cfg.get('clabe'):
            return (f"💳 *Datos de pago:*\n"
                    f"Banco: {cfg.get('banco','')}\n"
                    f"CLABE: {cfg['clabe']}\n"
                    f"Titular: {cfg.get('titular','Zapatillas May')}\n\n"
                    f"_Envía tu comprobante aquí y procesamos tu pedido en 24hrs_ ✅")
    except:
        pass
    return "Escríbenos para darte los datos de pago 💳"

def procesar_y_enviar_respuesta(from_number, respuesta_claude):
    """Procesa marcadores en la respuesta de Maya y ejecuta las acciones correspondientes."""

    # ── GENERAR_PAGO:{json} ──────────────────────────────────────────────────
    match_pago = re.search(r'GENERAR_PAGO:(\{[^}]+\})', respuesta_claude)
    if match_pago:
        texto = re.sub(r'GENERAR_PAGO:\{[^}]+\}', '', respuesta_claude).strip()
        msg_enviado = texto  # lo que finalmente se guarda como respuesta
        if texto:
            enviar_whatsapp_texto(from_number, texto)
        try:
            datos = json.loads(match_pago.group(1))
            link, total, pedido_id = generar_link_pago_wa(from_number, datos)
            time.sleep(1)
            if link:
                msg_link = (
                    f"💳 *Link de pago — ${total:.0f} MXN*\n\n{link}\n\n"
                    f"_Acepta tarjeta, transferencia, OXXO y más. "
                    f"En cuanto confirme el pago procesamos tu pedido 🚀_"
                )
                enviar_whatsapp_texto(from_number, msg_link)
                msg_enviado = (texto + "\n\n" + msg_link).strip()
            else:
                msg_fallback = "Hubo un problema generando tu link de pago 😔 Escríbeme y te lo mando por otro medio."
                enviar_whatsapp_texto(from_number, msg_fallback)
                msg_enviado = (texto + "\n\n" + msg_fallback).strip() if texto else msg_fallback
                print(f"[chatbot] MP falló para {from_number} — token posiblemente expirado")
        except Exception as e:
            print(f"[chatbot] Error procesando GENERAR_PAGO para {from_number}: {e}")
            msg_fallback = "Hubo un problema generando tu link de pago 😔 Escríbeme y te lo mando por otro medio."
            enviar_whatsapp_texto(from_number, msg_fallback)
            msg_enviado = (texto + "\n\n" + msg_fallback).strip() if texto else msg_fallback
        return msg_enviado or respuesta_claude

    # ── BUSCAR_COLORES:[SKU] ─────────────────────────────────────────────────
    match_colores = re.search(r'BUSCAR_COLORES:\[?([A-Za-z0-9_\-]+)\]?', respuesta_claude)
    if match_colores:
        sku = match_colores.group(1).strip()
        # Texto sin el marcador
        texto = re.sub(r'BUSCAR_COLORES:\[?[A-Za-z0-9_\-]+\]?', '', respuesta_claude).strip()
        if texto:
            enviar_whatsapp_texto(from_number, texto)
        colores = obtener_colores_modelo(sku)
        if colores:
            for c in colores:
                if c.get('foto_url'):
                    time.sleep(0.8)
                    enviar_whatsapp_imagen(from_number, c['foto_url'], c['color'])
                else:
                    time.sleep(0.4)
                    enviar_whatsapp_texto(from_number, f"• {c['color']} (sin foto disponible)")
        else:
            enviar_whatsapp_texto(from_number, "Por el momento no tengo las fotos de colores disponibles, pero escríbeme cuál prefieres y te confirmo 😊")
        return texto or respuesta_claude

    # ── LINK_PAGO ────────────────────────────────────────────────────────────
    if 'LINK_PAGO' in respuesta_claude:
        texto = respuesta_claude.replace('LINK_PAGO', '').strip()
        if texto:
            enviar_whatsapp_texto(from_number, texto)
        time.sleep(0.8)
        info_pago = obtener_info_pago()
        enviar_whatsapp_texto(from_number, info_pago)
        return texto or respuesta_claude

    # ── ENVIAR_FOTO:[url] (fotos de producto, sin límite de 2) ──────────────
    partes = re.split(r'ENVIAR_FOTO:(\S+)', respuesta_claude)
    texto_final = ""
    fotos = []
    for i, parte in enumerate(partes):
        if i % 2 == 0:
            t = parte.strip()
            if t:
                texto_final += t + " "
        else:
            url_foto = parte.strip().strip('[]').rstrip('.,;)')
            if url_foto.startswith('http'):
                fotos.append(url_foto)
    texto_final = texto_final.strip()
    if texto_final:
        enviar_whatsapp_texto(from_number, texto_final)
    for url in fotos[:5]:  # máx 5 fotos de producto
        enviar_whatsapp_imagen(from_number, url)
    return texto_final or respuesta_claude

def obtener_historial(telefono, limite=10):
    try:
        convs = supabase_get(f"conversaciones_whatsapp?telefono=eq.{telefono}&order=created_at.desc&limit={limite}")
        convs = list(reversed(convs))
        mensajes = []
        for c in convs:
            msg  = c.get('mensaje', '') or ''
            resp = c.get('respuesta', '') or ''
            tipo = c.get('tipo', '')

            # ── Mensaje del cliente ──────────────────────────────────
            if tipo == 'carrusel_saliente':
                # Del carrusel solo guardamos el contexto como asistente
                pass
            elif msg.startswith('[') and not msg.startswith('[Botón]') and not msg.startswith('[Lista]'):
                pass  # sticker, ubicacion, etc — no aportan al historial de venta
            elif msg:
                mensajes.append({"role": "user", "content": msg})

            # ── Respuesta del asistente ──────────────────────────────
            if tipo == 'carrusel_saliente':
                # Extraer productos del mensaje guardado para que Maya sepa qué se mostró
                productos_mostrados = re.sub(r'\[.*?\]:\s*\[Carrusel\]\s*', '', msg).strip()
                mensajes.append({"role": "assistant", "content": f"[Envié un carrusel de fotos al cliente: {productos_mostrados}]"})
            elif tipo == 'imagen_saliente':
                # Foto individual enviada al cliente
                producto_info = re.sub(r'\[.*?\]:\s*', '', msg).strip()
                mensajes.append({"role": "assistant", "content": f"[Envié una foto al cliente: {producto_info}]"})
            elif resp:
                resp_limpia = re.sub(r'ENVIAR_FOTO:\[[^\]]+\]', '', resp)
                resp_limpia = re.sub(r'ENVIAR_FOTO:\S+', '', resp_limpia)
                resp_limpia = re.sub(r'BUSCAR_COLORES:\[?[A-Za-z0-9_\-]+\]?', '', resp_limpia)
                resp_limpia = re.sub(r'GENERAR_PAGO:\{[^}]+\}', '', resp_limpia).strip()
                if resp_limpia:
                    mensajes.append({"role": "assistant", "content": resp_limpia})
        return mensajes
    except:
        return []

def subir_imagen_storage(img_bytes: bytes, filename: str) -> str:
    """Sube bytes de imagen a Supabase Storage y devuelve la URL pública."""
    supabase_url = os.environ.get("SUPABASE_URL", "")
    supabase_key = os.environ.get("SUPABASE_KEY", "")
    if not supabase_url or not supabase_key:
        return ""
    upload_url = f"{supabase_url}/storage/v1/object/wa-media/{filename}"
    req = urllib.request.Request(
        upload_url,
        data=img_bytes,
        headers={
            "apikey": supabase_key,
            "Authorization": f"Bearer {supabase_key}",
            "Content-Type": "image/jpeg",
            "x-upsert": "true"
        },
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as r:
            r.read()
        return f"{supabase_url}/storage/v1/object/public/wa-media/{filename}"
    except urllib.error.HTTPError as e:
        try:
            cuerpo = e.read().decode()
        except Exception:
            cuerpo = ""
        print(f"[storage] Error subiendo imagen HTTP {e.code}: {cuerpo}")
        return ""
    except Exception as e:
        print(f"[storage] Error subiendo imagen: {e}")
        return ""

def guardar_conversacion(telefono, mensaje, respuesta, tipo="texto", nombre="", media_url=""):
    try:
        from database import supabase_post
        data = {
            "telefono": telefono,
            "nombre_contacto": nombre,
            "mensaje": mensaje,
            "respuesta": respuesta,
            "tipo": tipo
        }
        if media_url:
            data["media_url"] = media_url
        try:
            supabase_post("conversaciones_whatsapp", data)
        except Exception as e_post:
            # Si falla por la columna media_url (cache de PostgREST desactualizado), reintentar sin ella
            if "media_url" in data:
                data.pop("media_url", None)
                supabase_post("conversaciones_whatsapp", data)
            else:
                raise e_post
        cache_invalidate("chats_lista")  # forzar refresh en próximo poll
    except Exception as e:
        print(f"ERROR guardando: {str(e)}")

def enviar_whatsapp(from_number, respuesta):
    enviar_whatsapp_texto(from_number, respuesta)

def cargar_catalogo():
    return supabase_get("productos?activo=eq.true&select=id,sku_interno,nombre,precio_menudeo,precio_mayoreo3,precio_mayoreo6,precio_corrida,es_oferta,categoria,nuevo,corrida_activa,tallas_disponibles,imagen_principal")

def _transcribir_audio_wa(mensaje_data: dict, from_number: str) -> str:
    """Descarga el audio de WhatsApp y lo transcribe con Whisper (OpenAI)."""
    try:
        audio_id = mensaje_data.get("audio", {}).get("id", "")
        if not audio_id:
            return "[Audio no procesable]"
        wa_token  = os.environ.get("WHATSAPP_TOKEN", "")
        openai_key = os.environ.get("OPENAI_API_KEY", "")

        # Obtener URL del audio
        req = urllib.request.Request(
            f"https://graph.facebook.com/v25.0/{audio_id}",
            headers={"Authorization": f"Bearer {wa_token}"}
        )
        with urllib.request.urlopen(req) as r:
            media_data = json.loads(r.read())
        audio_url = media_data.get("url", "")
        if not audio_url:
            return "[Audio recibido — no se pudo obtener URL]"

        # Descargar el archivo de audio
        audio_req = urllib.request.Request(audio_url, headers={"Authorization": f"Bearer {wa_token}"})
        with urllib.request.urlopen(audio_req) as r:
            audio_bytes = r.read()

        # Si no hay OpenAI key, solo registrar
        if not openai_key:
            print(f"[audio] sin OPENAI_API_KEY, audio de {from_number} no transcrito")
            return "[Audio de voz recibido]"

        # Transcribir con Whisper
        import io
        boundary = "----WhisperBoundary"
        body_parts = [
            f"--{boundary}\r\nContent-Disposition: form-data; name=\"model\"\r\n\r\nwhisper-1".encode(),
            f"--{boundary}\r\nContent-Disposition: form-data; name=\"language\"\r\n\r\nes".encode(),
            f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"audio.ogg\"\r\nContent-Type: audio/ogg\r\n\r\n".encode() + audio_bytes,
            f"--{boundary}--".encode(),
        ]
        body = b"\r\n".join(body_parts)
        whisper_req = urllib.request.Request(
            "https://api.openai.com/v1/audio/transcriptions",
            data=body,
            headers={
                "Authorization": f"Bearer {openai_key}",
                "Content-Type": f"multipart/form-data; boundary={boundary}"
            },
            method="POST"
        )
        with urllib.request.urlopen(whisper_req) as r:
            result = json.loads(r.read())
        texto = result.get("text", "").strip()
        return texto if texto else "[Audio sin contenido detectado]"

    except Exception as e:
        print(f"[audio-transcripcion] Error: {e}")
        return "[Audio de voz recibido — no se pudo transcribir]"


@router.post("/link-pago-manual")
async def link_pago_manual(datos: dict):
    """Genera un pedido manual + link de Mercado Pago con precio personalizado
    (ventas del admin, ej. cuando se cotizó un precio especial). El pago dispara
    Purchase a Meta/GA igual que cualquier pedido. Espera:
    {telefono, nombre, direccion, modelo, color, talla, precio (subtotal sin envío), pares}"""
    try:
        telefono = (datos.get("telefono") or "").strip()
        if not telefono:
            return JSONResponse(status_code=400, content={"ok": False, "error": "Falta el teléfono del cliente"})
        link, total, pedido_id = generar_link_pago_wa(telefono, datos)
        if link:
            return {"ok": True, "link": link, "total": total, "pedido_id": pedido_id}
        return JSONResponse(status_code=500, content={"ok": False, "error": "No se pudo generar el link (revisa MP_ACCESS_TOKEN)"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"ok": False, "error": str(e)})


@router.post("/whatsapp")
async def recibir_mensaje_whatsapp(datos: dict):
    try:
        print(f"WHATSAPP DATOS: {json.dumps(datos)}")
        entry = datos.get("entry", [{}])[0]
        changes = entry.get("changes", [{}])[0]
        value = changes.get("value", {})

        # ── Recibos de entrega y lectura ──────────────────────────────────────
        statuses = value.get("statuses", [])
        for st in statuses:
            status_type = st.get("status")   # sent | delivered | read | failed
            recipient   = st.get("recipient_id", "")
            if status_type in ("delivered", "read") and recipient:
                try:
                    existing = supabase_get(f"chats_control?telefono=eq.{recipient}")
                    campo = "cliente_entrego_at" if status_type == "delivered" else "cliente_leyo_at"
                    now_iso = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                    if existing:
                        supabase_patch(f"chats_control?telefono=eq.{recipient}", {campo: now_iso})
                    else:
                        supabase_post("chats_control", {"telefono": recipient, campo: now_iso})
                    cache_invalidate("chats_lista")
                except Exception as e:
                    print(f"Error guardando status {status_type}: {e}")

        messages = value.get("messages", [])
        if not messages:
            return {"status": "ok"}

        mensaje_data = messages[0]
        tipo         = mensaje_data.get("type", "text")
        from_number  = mensaje_data.get("from", "")
        wa_msg_id    = mensaje_data.get("id", "")   # wamid del mensaje entrante
        contacts     = value.get("contacts", [])
        nombre_contacto = contacts[0].get("profile", {}).get("name", "") if contacts else ""

        # ── Mark as read automático al recibir ──────────────────────
        if wa_msg_id:
            mark_as_read_wa(wa_msg_id)

        control = supabase_get(f"chats_control?telefono=eq.{from_number}&en_control=eq.true")

        # ── Sticker ─────────────────────────────────────────────────
        if tipo == "sticker":
            guardar_conversacion(from_number, "[Sticker]", None, "sticker", nombre_contacto)
            return {"status": "ok"}

        # ── Ubicación entrante ───────────────────────────────────────
        if tipo == "location":
            loc  = mensaje_data.get("location", {})
            lat  = loc.get("latitude", "")
            lng  = loc.get("longitude", "")
            nom  = loc.get("name", "")
            addr = loc.get("address", "")
            maps = f"https://maps.google.com/?q={lat},{lng}"
            texto_loc = f"[Ubicación] {nom} {addr} {maps}".strip()
            guardar_conversacion(from_number, texto_loc, None, "ubicacion", nombre_contacto)
            if not control:
                respuesta = f"Recibí tu ubicación 📍 ¿Es para envío a domicilio o para recoger en tienda?"
                enviar_whatsapp_texto(from_number, respuesta)
                guardar_conversacion(from_number, texto_loc, respuesta, "ubicacion", nombre_contacto)
            return {"status": "ok"}

        productos = cargar_catalogo()
        catalogo = construir_catalogo(productos)
        sistema = construir_sistema(catalogo)
        historial = obtener_historial(from_number)

        if tipo == "image":
            caption_img = mensaje_data.get("image", {}).get("caption", "").strip()
            msg_guardado = f"[Imagen]{': ' + caption_img if caption_img else ''}"
            if control:
                # En control manual: descargar y subir a Storage para que el agente vea la imagen
                try:
                    image_id = mensaje_data.get("image", {}).get("id", "")
                    wa_token = os.environ.get("WHATSAPP_TOKEN", "")
                    img_url_req = urllib.request.Request(
                        f"https://graph.facebook.com/v25.0/{image_id}",
                        headers={"Authorization": f"Bearer {wa_token}"}
                    )
                    with urllib.request.urlopen(img_url_req) as r:
                        img_meta = json.loads(r.read())
                    img_url_wa = img_meta.get("url", "")
                    img_req = urllib.request.Request(img_url_wa, headers={"Authorization": f"Bearer {wa_token}"})
                    with urllib.request.urlopen(img_req) as r:
                        img_bytes_ctrl = r.read()
                    filename_ctrl = f"{from_number}_{image_id}.jpg"
                    public_url_ctrl = subir_imagen_storage(img_bytes_ctrl, filename_ctrl)
                    # La URL se guarda dentro del mensaje (no en columna aparte) para que el panel la muestre
                    msg_ctrl = (f"[Imagen] {public_url_ctrl}" + (f" {caption_img}" if caption_img else "")).strip() if public_url_ctrl else msg_guardado
                    guardar_conversacion(from_number, msg_ctrl, None, "imagen", nombre_contacto)
                except Exception:
                    guardar_conversacion(from_number, msg_guardado, None, "imagen", nombre_contacto)
                return {"status": "ok"}
            try:
                image_id = mensaje_data.get("image", {}).get("id", "")
                wa_token = os.environ.get("WHATSAPP_TOKEN", "")
                img_url_req = urllib.request.Request(
                    f"https://graph.facebook.com/v25.0/{image_id}",
                    headers={"Authorization": f"Bearer {wa_token}"}
                )
                with urllib.request.urlopen(img_url_req) as r:
                    img_data = json.loads(r.read())
                img_url = img_data.get("url", "")
                img_req = urllib.request.Request(img_url, headers={"Authorization": f"Bearer {wa_token}"})
                with urllib.request.urlopen(img_req) as r:
                    img_bytes = r.read()
                # Subir a Storage para persistencia en el panel
                filename = f"{from_number}_{image_id}.jpg"
                public_url = subir_imagen_storage(img_bytes, filename)
                # La URL se guarda dentro del mensaje (no en columna aparte) para que el panel la muestre
                if public_url:
                    msg_guardado = (f"[Imagen] {public_url}" + (f" {caption_img}" if caption_img else "")).strip()
                img_b64 = base64.b64encode(img_bytes).decode("utf-8")
                # Retry igual que mensajes de texto
                respuesta_claude = None
                for intento in range(2):
                    try:
                        respuesta_claude = llamar_claude_con_imagen(img_b64, sistema, historial, caption=caption_img)
                        break
                    except Exception as e:
                        print(f"[chatbot] Error Claude imagen intento {intento+1}: {e}")
                        if intento == 0:
                            import asyncio; await asyncio.sleep(3)
                if respuesta_claude is None:
                    fb = "Vi tu foto 📸 Tuve un problema técnico, ¿puedes reenviarla? 😊"
                    enviar_whatsapp_texto(from_number, fb)
                    guardar_conversacion(from_number, msg_guardado, fb, "imagen", nombre_contacto)
                    return {"status": "ok"}
                texto_guardado = procesar_y_enviar_respuesta(from_number, respuesta_claude)
                guardar_conversacion(from_number, msg_guardado, texto_guardado, "imagen", nombre_contacto)
            except Exception as e:
                import traceback
                print(f"[chatbot] ERROR IMAGEN {from_number}: {e}\n{traceback.format_exc()}")
                fb = "Vi tu foto 📸 Dime qué estilo buscas y te muestro opciones similares 😊"
                enviar_whatsapp_texto(from_number, fb)
                guardar_conversacion(from_number, msg_guardado, fb, "imagen", nombre_contacto)
            return {"status": "ok"}

        if tipo == "text":
            mensaje = mensaje_data.get("text", {}).get("body", "")
            # ── Contexto: el cliente respondió a un mensaje específico ────────
            ctx = mensaje_data.get("context", {})
            ctx_wamid = ctx.get("id", "")
            if ctx_wamid:
                try:
                    # Buscar a qué mensaje se estaba respondiendo (carrusel, foto)
                    ref_rows = supabase_get(f"conversaciones_whatsapp?telefono=eq.{from_number}&order=created_at.desc&limit=20")
                    ctx_info = None
                    for row in ref_rows:
                        if row.get("wa_message_id") == ctx_wamid:
                            ctx_info = row.get("mensaje", "")
                            break
                        # Si no encontramos por wa_message_id, buscar en carrusel reciente
                        if row.get("tipo") == "carrusel_saliente":
                            ctx_info = row.get("mensaje", "")
                            break
                    if ctx_info:
                        producto_ref = re.sub(r'\[.*?\]:\s*', '', ctx_info).strip()
                        mensaje = f"{mensaje}\n[El cliente está respondiendo sobre: {producto_ref}]"
                except Exception:
                    pass
        elif tipo == "audio":
            # ── Transcripción con Whisper ────────────────────────────
            mensaje = _transcribir_audio_wa(mensaje_data, from_number)
        elif tipo == "interactive":
            # ── Respuesta a botón o lista interactiva ────────────────
            inter = mensaje_data.get("interactive", {})
            inter_tipo = inter.get("type", "")
            if inter_tipo == "button_reply":
                btn = inter.get("button_reply", {})
                btn_id = btn.get("id", "")
                btn_title = btn.get("title", "")
                mensaje = f"[Botón] {btn_title}"
                guardar_conversacion(from_number, mensaje, None, "button_reply", nombre_contacto)
                # Si tocó "Hablar con asesor" → poner en control
                if btn_id == "asesor" or "asesor" in btn_title.lower():
                    existente = supabase_get(f"chats_control?telefono=eq.{from_number}")
                    if existente:
                        supabase_patch(f"chats_control?telefono=eq.{from_number}", {"en_control": True, "estado": "abierto"})
                    else:
                        supabase_post("chats_control", {"telefono": from_number, "en_control": True, "estado": "abierto"})
                    enviar_whatsapp_texto(from_number, "¡Hola! Un asesor te atenderá en breve 😊")
                else:
                    # Pasar a Maya como si fuera texto
                    mensajes_h = obtener_historial(from_number) + [{"role": "user", "content": btn_title}]
                    respuesta_claude = llamar_claude(mensajes_h, construir_sistema(construir_catalogo(cargar_catalogo())))
                    texto_guardado = procesar_y_enviar_respuesta(from_number, respuesta_claude)
                    guardar_conversacion(from_number, btn_title, respuesta_claude, "texto", nombre_contacto)
                cache_invalidate("chats_lista")
                return {"status": "ok"}
            elif inter_tipo == "list_reply":
                row = inter.get("list_reply", {})
                row_title = row.get("title", "")
                mensaje = f"[Lista] {row_title}"
                guardar_conversacion(from_number, mensaje, None, "list_reply", nombre_contacto)
                if not control:
                    mensajes_h = obtener_historial(from_number) + [{"role": "user", "content": row_title}]
                    respuesta_claude = llamar_claude(mensajes_h, construir_sistema(construir_catalogo(cargar_catalogo())))
                    texto_guardado = procesar_y_enviar_respuesta(from_number, respuesta_claude)
                    guardar_conversacion(from_number, row_title, respuesta_claude, "texto", nombre_contacto)
                cache_invalidate("chats_lista")
                return {"status": "ok"}
            else:
                guardar_conversacion(from_number, f"[Interactive:{inter_tipo}]", None, "interactive", nombre_contacto)
                return {"status": "ok"}
        elif tipo in ("sticker", "location"):
            return {"status": "ok"}   # ya manejados arriba
        else:
            # Tipos no soportados: ignorar silenciosamente pero registrar
            guardar_conversacion(from_number, f"[{tipo}]", None, tipo, nombre_contacto)
            return {"status": "ok"}

        if not mensaje:
            return {"status": "ok"}

        if control:
            guardar_conversacion(from_number, mensaje, None, "texto", nombre_contacto)
            return {"status": "ok"}

        # ── DEBOUNCE: guardar mensaje primero, esperar 2s y verificar si llegó otro ──
        # Esto evita que dos mensajes enviados rápido se procesen por separado
        guardar_conversacion(from_number, mensaje, None, "pendiente", nombre_contacto)
        import asyncio
        await asyncio.sleep(2)  # async sleep — no bloquea el event loop

        # Buscar mensajes pendientes (sin respuesta) de este número en los últimos 5s
        try:
            recientes = supabase_get(
                f"conversaciones_whatsapp?telefono=eq.{from_number}"
                f"&respuesta=is.null&tipo=eq.pendiente"
                f"&order=created_at.desc&limit=5"
            )
        except Exception:
            recientes = []

        # Si hay más de un mensaje pendiente, combinarlos
        pendientes = [r for r in recientes if r.get("mensaje") and not r.get("mensaje","").startswith("[")]
        if len(pendientes) > 1:
            # Solo el más reciente procesa; los demás ya están guardados
            # Si este mensaje NO es el más reciente, salir (el más reciente lo procesará)
            mas_reciente = pendientes[0]  # order desc → [0] es el más reciente
            if mas_reciente.get("mensaje") != mensaje:
                return {"status": "ok"}
            # Combinar todos los pendientes en orden cronológico
            mensaje_combinado = "\n".join(r["mensaje"] for r in reversed(pendientes))
            # Marcar todos como procesados
            try:
                supabase_patch(
                    f"conversaciones_whatsapp?telefono=eq.{from_number}&respuesta=is.null&tipo=eq.pendiente",
                    {"tipo": "texto"}
                )
            except Exception:
                pass
            mensaje_final = mensaje_combinado
        else:
            # Solo un mensaje pendiente, procesar normal
            try:
                supabase_patch(
                    f"conversaciones_whatsapp?telefono=eq.{from_number}&respuesta=is.null&tipo=eq.pendiente",
                    {"tipo": "texto"}
                )
            except Exception:
                pass
            mensaje_final = mensaje

        # Recargar historial ahora que los mensajes están guardados
        historial_actualizado = obtener_historial(from_number, limite=10)
        mensajes_claude = historial_actualizado + [{"role": "user", "content": mensaje_final}]

        # ── Llamar Claude con retry en caso de error temporal ──────────────────
        respuesta_claude = None
        ultimo_error = None
        for intento in range(2):  # 1 reintento
            try:
                respuesta_claude = llamar_claude(mensajes_claude, sistema)
                break
            except Exception as e:
                ultimo_error = e
                print(f"[chatbot] Error Claude intento {intento+1}: {e}")
                if intento == 0:
                    await asyncio.sleep(3)

        if respuesta_claude is None:
            # Claude no respondió después de reintentos — avisar al usuario
            msg_error = "Disculpa, tuve un problema técnico 😔 ¿Puedes repetir tu mensaje?"
            enviar_whatsapp_texto(from_number, msg_error)
            guardar_conversacion(from_number, mensaje_final, msg_error, "texto", nombre_contacto)
            print(f"[chatbot] FATAL para {from_number}: {ultimo_error}")
            return {"status": "ok"}

        texto_guardado = procesar_y_enviar_respuesta(from_number, respuesta_claude)
        guardar_conversacion(from_number, mensaje_final, texto_guardado or respuesta_claude, "texto", nombre_contacto)
        return {"status": "ok"}

    except Exception as e:
        import traceback
        print(f"[chatbot] EXCEPCION no manejada para {locals().get('from_number','?')}: {e}")
        print(traceback.format_exc())
        # Intentar avisar al usuario si tenemos su número
        try:
            fn = locals().get('from_number')
            if fn:
                enviar_whatsapp_texto(fn, "Disculpa, tuve un problema técnico 😔 ¿Puedes repetir tu mensaje?")
        except Exception:
            pass
        return {"status": "ok"}

_WA_VERIFY_TOKEN = os.getenv("WA_VERIFY_TOKEN", "")

@router.get("/whatsapp")
async def verificar_webhook(request: Request):
    params = dict(request.query_params)
    mode = params.get("hub.mode")
    token = params.get("hub.verify_token")
    challenge = params.get("hub.challenge")
    if _WA_VERIFY_TOKEN and mode == "subscribe" and token == _WA_VERIFY_TOKEN:
        return int(challenge)
    return JSONResponse(status_code=403, content={"error": "Token invalido"})

@router.post("/mensaje")
async def procesar_mensaje(datos: dict):
    try:
        mensaje = datos.get("mensaje", "")
        historial = datos.get("historial", [])
        productos = cargar_catalogo()
        catalogo = construir_catalogo(productos)
        sistema = construir_sistema(catalogo)
        mensajes = historial + [{"role": "user", "content": mensaje}]
        respuesta = llamar_claude(mensajes, sistema)
        return {"respuesta": respuesta, "ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/chats")
async def listar_chats():
    # Caché 20s — el frontend poll cada 30s, así casi siempre lo sirve de memoria
    cached = cache_get("chats_lista")
    if cached is not None:
        return cached
    try:
        # Solo los campos necesarios para la lista + límite 400 mensajes recientes
        try:
            conversaciones = supabase_get(
                "conversaciones_whatsapp"
                "?order=created_at.desc"
                "&limit=400"
                "&select=telefono,nombre_contacto,created_at,leido,mensaje,respuesta,tipo,wa_message_id"
            )
        except Exception:
            conversaciones = supabase_get(
                "conversaciones_whatsapp"
                "?order=created_at.desc"
                "&limit=400"
                "&select=telefono,nombre_contacto,created_at,leido,mensaje,respuesta,tipo"
            )
        chats = {}
        for m in conversaciones:
            tel = m['telefono']
            if tel not in chats:
                chats[tel] = {
                    "telefono": tel,
                    "nombre": None,
                    "mensajes": [],
                    "ultimo_mensaje": m['created_at'],
                    "no_leidos": 0,
                    "en_control": False,
                    "agente": None,
                    "etiqueta": "sin_etiqueta"
                }
            chats[tel]['mensajes'].append(m)
            if not m.get('leido'):
                chats[tel]['no_leidos'] += 1
        for tel, chat in chats.items():
            nombre = tel
            for m in chat['mensajes']:
                if m.get('nombre_contacto') and m['nombre_contacto'] != tel:
                    nombre = m['nombre_contacto']
                    break
            chat['nombre'] = nombre
        # Intentar con columnas nuevas, fallback a columnas base si no existen aún
        try:
            control = supabase_get("chats_control?select=telefono,en_control,agente,etiqueta,cliente_leyo_at,cliente_entrego_at,pendiente_revision,estado")
        except Exception:
            try:
                control = supabase_get("chats_control?select=telefono,en_control,agente,etiqueta,cliente_leyo_at,cliente_entrego_at,pendiente_revision")
            except Exception:
                control = supabase_get("chats_control?select=telefono,en_control,agente,etiqueta")
        for c in control:
            if c['telefono'] in chats:
                chats[c['telefono']]['en_control'] = c.get('en_control', False)
                chats[c['telefono']]['agente'] = c.get('agente')
                chats[c['telefono']]['etiqueta'] = c.get('etiqueta', 'sin_etiqueta')
                chats[c['telefono']]['cliente_leyo_at'] = c.get('cliente_leyo_at')
                chats[c['telefono']]['cliente_entrego_at'] = c.get('cliente_entrego_at')
                chats[c['telefono']]['pendiente_revision'] = c.get('pendiente_revision', False)
                chats[c['telefono']]['estado'] = c.get('estado', 'abierto')
        result = list(chats.values())
        cache_set("chats_lista", result, ttl=20)
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/conversaciones")
async def listar_conversaciones():
    try:
        return supabase_get("conversaciones_whatsapp?order=created_at.desc&limit=100")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/chats/{telefono}/control")
async def tomar_control(telefono: str, datos: dict):
    try:
        from database import supabase_post, supabase_patch
        en_control = datos.get("en_control", True)
        agente = datos.get("agente", "Admin")
        existente = supabase_get(f"chats_control?telefono=eq.{telefono}")
        if existente:
            supabase_patch(f"chats_control?telefono=eq.{telefono}", {"en_control": en_control, "agente": agente})
        else:
            supabase_post("chats_control", {"telefono": telefono, "en_control": en_control, "agente": agente})
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/chats/{telefono}/mensaje")
async def enviar_mensaje_manual(telefono: str, datos: dict):
    try:
        from database import supabase_post
        mensaje = datos.get("mensaje", "")
        agente = datos.get("agente", "Admin")
        reply_to = datos.get("reply_to_wa_id")
        if not mensaje:
            return JSONResponse(status_code=400, content={"error": "Mensaje vacio"})
        wa_id = enviar_whatsapp_texto(telefono, mensaje, reply_to_id=reply_to)
        row = {
            "telefono": telefono,
            "mensaje": f"[{agente}]: {mensaje}",
            "respuesta": None,
            "tipo": "manual",
            "leido": True
        }
        if wa_id:
            try:
                row["wa_message_id"] = wa_id
            except Exception:
                pass
        supabase_post("conversaciones_whatsapp", row)
        cache_invalidate("chats_lista")
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/chats/{telefono}/imagen")
async def enviar_imagen_manual(telefono: str, datos: dict):
    try:
        from database import supabase_post
        imagen_url = datos.get("imagen_url", "")
        caption = datos.get("caption", "")
        agente = datos.get("agente", "Admin")
        enviar_whatsapp_imagen(telefono, imagen_url, caption)
        supabase_post("conversaciones_whatsapp", {
            "telefono": telefono,
            "mensaje": f"[{agente}]: [Imagen] {imagen_url}\n{caption}",
            "respuesta": None,
            "tipo": "imagen_saliente",
            "leido": True
        })
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.patch("/chats/{telefono}/leido")
async def marcar_leido(telefono: str):
    try:
        from database import supabase_patch
        supabase_patch(f"conversaciones_whatsapp?telefono=eq.{telefono}&leido=eq.false", {"leido": True})
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/chats/{telefono}/etiqueta")
async def cambiar_etiqueta(telefono: str, datos: dict):
    try:
        from database import supabase_post, supabase_patch
        etiqueta = datos.get("etiqueta", "sin_etiqueta")
        existente = supabase_get(f"chats_control?telefono=eq.{telefono}")
        if existente:
            supabase_patch(f"chats_control?telefono=eq.{telefono}", {"etiqueta": etiqueta})
        else:
            supabase_post("chats_control", {"telefono": telefono, "etiqueta": etiqueta})
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/config")
async def obtener_config():
    try:
        config = supabase_get("whatsapp_config")
        return {c['clave']: c['valor'] for c in config}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/config")
async def guardar_config(datos: dict):
    try:
        from database import supabase_patch, supabase_post
        for clave, valor in datos.items():
            existente = supabase_get(f"whatsapp_config?clave=eq.{clave}")
            if existente:
                supabase_patch(f"whatsapp_config?clave=eq.{clave}", {"valor": str(valor)})
            else:
                supabase_post("whatsapp_config", {"clave": clave, "valor": str(valor)})
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/respuestas-rapidas")
async def obtener_respuestas():
    try:
        return supabase_get("respuestas_rapidas?order=orden.asc")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/respuestas-rapidas")
async def crear_respuesta(datos: dict):
    try:
        from database import supabase_post
        return supabase_post("respuestas_rapidas", {
            "titulo": datos.get("titulo"),
            "mensaje": datos.get("mensaje"),
            "orden": datos.get("orden", 0)
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.patch("/respuestas-rapidas/{id}")
async def actualizar_respuesta(id: str, datos: dict):
    try:
        from database import supabase_patch
        supabase_patch(f"respuestas_rapidas?id=eq.{id}", datos)
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.delete("/respuestas-rapidas/{id}")
async def eliminar_respuesta(id: str):
    try:
        from database import supabase_delete
        supabase_delete(f"respuestas_rapidas?id=eq.{id}")
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/notas/{telefono}")
async def obtener_notas(telefono: str):
    try:
        return supabase_get(f"notas_contacto?telefono=eq.{telefono}&order=created_at.desc")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/notas/{telefono}")
async def crear_nota(telefono: str, datos: dict):
    try:
        from database import supabase_post
        return supabase_post("notas_contacto", {
            "telefono": telefono,
            "nota": datos.get("nota"),
            "agente": datos.get("agente", "Admin")
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.delete("/notas/{id}")
async def eliminar_nota(id: str):
    try:
        from database import supabase_delete
        supabase_delete(f"notas_contacto?id=eq.{id}")
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/tareas/{telefono}")
async def obtener_tareas(telefono: str):
    try:
        return supabase_get(f"tareas_contacto?telefono=eq.{telefono}&order=created_at.asc")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/tareas/{telefono}")
async def crear_tarea(telefono: str, datos: dict):
    try:
        from database import supabase_post
        return supabase_post("tareas_contacto", {
            "telefono": telefono,
            "titulo": datos.get("titulo"),
            "fecha_vence": datos.get("fecha_vence"),
            "agente": datos.get("agente", "Admin")
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.patch("/tareas/{id}")
async def actualizar_tarea(id: str, datos: dict):
    try:
        from database import supabase_patch
        supabase_patch(f"tareas_contacto?id=eq.{id}", datos)
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.delete("/tareas/{id}")
async def eliminar_tarea(id: str):
    try:
        from database import supabase_delete
        supabase_delete(f"tareas_contacto?id=eq.{id}")
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/tareas-hoy")
async def tareas_hoy():
    try:
        from datetime import date
        hoy = date.today().isoformat()
        tareas = supabase_get(f"tareas_contacto?fecha_vence=lte.{hoy}&completada=eq.false&order=fecha_vence.asc")
        for t in tareas:
            clientes = supabase_get(f"clientes?telefono=eq.{t['telefono']}&select=nombre")
            t['nombre_contacto'] = clientes[0]['nombre'] if clientes else None
        return tareas
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/envio-masivo")
async def envio_masivo(datos: dict):
    try:
        wa_token = os.environ.get("WHATSAPP_TOKEN", "")
        phone_id = os.environ.get("WHATSAPP_PHONE_ID", "")
        if not wa_token or not phone_id:
            return JSONResponse(status_code=500, content={"error": "Faltan variables WHATSAPP_TOKEN o WHATSAPP_PHONE_ID en Railway"})
        plantilla = datos.get("plantilla", "")
        idioma = datos.get("idioma", "es_MX")
        contactos = datos.get("contactos", [])
        imagen_url = (datos.get("imagen_url") or "").strip()
        variables_body = datos.get("variables_body", [])  # [{"text": "valor"}]
        body_vars_count = datos.get("body_vars_count", 1)  # 0 = template has no {{N}} vars
        header_tipo = (datos.get("header_tipo") or "NONE").upper()  # IMAGE | TEXT | NONE
        if not plantilla:
            return JSONResponse(status_code=400, content={"error": "Selecciona una plantilla"})
        if not contactos:
            return JSONResponse(status_code=400, content={"error": "No hay contactos"})

        # Plantilla MPM: convertir sku_interno → product_retailer_id reales del catálogo Meta
        skus_mpm = datos.get("skus_mpm", [])
        mpm_sections = None
        if skus_mpm:
            variantes_db = supabase_get("variantes?activa=eq.true&select=producto_id,color,talla")
            productos_db = supabase_get("productos?activo=eq.true&select=id,sku_interno")
            sku_a_id = {p.get("sku_interno"): p.get("id") for p in productos_db if p.get("sku_interno")}
            pid_a_variante = {}
            for v in variantes_db:
                pid = v.get("producto_id")
                if pid and pid not in pid_a_variante and v.get("color"):
                    pid_a_variante[pid] = v

            def _retailer_id(sku, variante):
                color = (variante.get("color") or "").strip()
                talla = str(variante.get("talla") or "").strip()
                color_norm = color.replace(" ", "_").replace("/", "_").replace("-", "_").strip("_")
                return f"{sku}-{color_norm}-{talla}" if talla else f"{sku}-{color_norm}"

            retailer_ids = []
            for sku in skus_mpm[:30]:
                pid = sku_a_id.get(sku)
                variante = pid_a_variante.get(pid) if pid else None
                if variante:
                    retailer_ids.append(_retailer_id(sku, variante))

            if retailer_ids:
                mpm_sections = [{"title": "Nuevos Modelos 👠", "product_items": [{"product_retailer_id": r} for r in retailer_ids]}]

        enviados = 0
        fallidos = 0
        errores = []
        url = f"https://graph.facebook.com/v25.0/{phone_id}/messages"
        headers = {"Authorization": f"Bearer {wa_token}", "Content-Type": "application/json"}

        for contacto in contactos:
            telefono = contacto.get("telefono", "")
            nombre = (contacto.get("nombre") or "Cliente").strip() or "Cliente"
            if not telefono:
                continue
            tel = telefono.replace("+", "").replace(" ", "").replace("-", "").replace("(", "").replace(")", "")
            if not tel.startswith("52"):
                tel = "52" + tel

            components = []
            if header_tipo == "IMAGE" and imagen_url:
                components.append({"type": "header", "parameters": [{"type": "image", "image": {"link": imagen_url}}]})
            elif header_tipo == "TEXT":
                # Header de texto sin variables (nombre en body es suficiente)
                pass

            body_params = []
            # Enviar parámetro de nombre si la plantilla tiene variables (body_vars_count > 0)
            # o si el nombre es real (no default "Cliente") como fallback por si el frontend
            # no detectó bien el número de variables
            tiene_vars = body_vars_count > 0 or (nombre and nombre != "Cliente")
            if tiene_vars:
                if variables_body:
                    body_params = [{"type": "text", "text": v.get("text", "")} for v in variables_body]
                elif nombre:
                    body_params = [{"type": "text", "text": nombre}]
            if body_params:
                components.append({"type": "body", "parameters": body_params})

            # Componente MPM (catálogo de productos en plantilla)
            if mpm_sections:
                components.append({
                    "type": "button",
                    "sub_type": "mpm",
                    "index": "0",
                    "parameters": [{"type": "action", "action": {"sections": mpm_sections}}]
                })

            body_msg = {
                "messaging_product": "whatsapp",
                "to": tel,
                "type": "template",
                "template": {"name": plantilla, "language": {"code": idioma}, "components": components}
            }
            try:
                req = urllib.request.Request(url, data=json.dumps(body_msg).encode("utf-8"), headers=headers, method="POST")
                with urllib.request.urlopen(req):
                    enviados += 1
            except urllib.error.HTTPError as http_e:
                error_body = http_e.read().decode()
                fallidos += 1
                errores.append(f"{telefono}: HTTP {http_e.code} - {error_body[:200]}")
            except Exception as inner_e:
                fallidos += 1
                errores.append(f"{telefono}: {str(inner_e)}")

        return {"ok": True, "enviados": enviados, "fallidos": fallidos, "errores": errores}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/envio-fotos")
async def envio_fotos(datos: dict):
    """
    Envía imágenes de variantes directamente (texto + fotos).
    Solo funciona dentro de la ventana de 24 h (el cliente escribió primero).
    """
    try:
        wa_token = os.environ.get("WHATSAPP_TOKEN", "")
        phone_id = os.environ.get("WHATSAPP_PHONE_ID", "")
        if not wa_token or not phone_id:
            return JSONResponse(status_code=500, content={"error": "Faltan variables WHATSAPP_TOKEN / WHATSAPP_PHONE_ID"})

        contactos = datos.get("contactos", [])
        texto    = (datos.get("texto") or "").strip()
        fotos    = datos.get("fotos", [])   # [{url, caption}]
        delay    = float(datos.get("delay_segundos", 3))

        if not contactos:
            return JSONResponse(status_code=400, content={"error": "No hay destinatarios"})
        if not fotos:
            return JSONResponse(status_code=400, content={"error": "No hay fotos seleccionadas"})

        url_api = f"https://graph.facebook.com/v25.0/{phone_id}/messages"
        hdrs = {"Authorization": f"Bearer {wa_token}", "Content-Type": "application/json"}

        enviados = 0
        fallidos = 0
        errores  = []

        def _tel(t):
            t = str(t).replace("+","").replace(" ","").replace("-","").replace("(","").replace(")","")
            return t if t.startswith("52") else "52" + t

        def _post(payload):
            req = urllib.request.Request(url_api,
                data=json.dumps(payload).encode(), headers=hdrs, method="POST")
            with urllib.request.urlopen(req, timeout=12) as r:
                r.read()

        for contacto in contactos:
            tel    = _tel(contacto.get("telefono",""))
            nombre = (contacto.get("nombre") or "Cliente").strip() or "Cliente"
            contacto_ok = True

            # 1. Mensaje de texto de saludo (si hay)
            if texto:
                try:
                    saludo = texto.replace("{{nombre}}", nombre).replace("{{1}}", nombre)
                    _post({"messaging_product":"whatsapp","to":tel,"type":"text","text":{"body":saludo}})
                    time.sleep(1)
                except urllib.error.HTTPError as e:
                    body_err = e.read().decode()
                    contacto_ok = False
                    errores.append(f"{tel} (saludo): HTTP {e.code} - {body_err[:150]}")
                except Exception as e:
                    contacto_ok = False
                    errores.append(f"{tel} (saludo): {str(e)}")

            # 2. Cada imagen en su propio try — si una falla, las demás siguen
            fotos_ok = 0
            for i, foto in enumerate(fotos):
                img_url = (foto.get("url") or "").strip()
                caption = (foto.get("caption") or "").strip()
                if not img_url:
                    continue
                try:
                    _post({"messaging_product":"whatsapp","to":tel,"type":"image",
                           "image":{"link":img_url,"caption":caption}})
                    fotos_ok += 1
                except urllib.error.HTTPError as e:
                    body_err = e.read().decode()
                    errores.append(f"{tel} (foto {i+1}): HTTP {e.code} - {body_err[:150]}")
                except Exception as e:
                    errores.append(f"{tel} (foto {i+1}): {str(e)}")
                if i < len(fotos) - 1:
                    time.sleep(1.2)

            if fotos_ok > 0:
                enviados += 1
            else:
                fallidos += 1

            if contacto != contactos[-1]:
                time.sleep(delay)

        return {"ok": True, "enviados": enviados, "fallidos": fallidos, "errores": errores}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/plantillas")
async def listar_plantillas():
    try:
        wa_token = os.environ.get("WHATSAPP_TOKEN", "")
        waba_id = os.environ.get("WHATSAPP_WABA_ID", "")
        if not waba_id:
            return JSONResponse(status_code=500, content={"error": "Falta variable WHATSAPP_WABA_ID en Railway"})
        url = f"https://graph.facebook.com/v25.0/{waba_id}/message_templates?status=APPROVED&limit=50&fields=name,language,status,components,sub_category,category"
        req = urllib.request.Request(url, headers={"Authorization": f"Bearer {wa_token}"})
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read())
        return data.get("data", [])
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        return JSONResponse(status_code=500, content={"error": f"Meta API: {body[:300]}"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/plantillas-debug")
async def plantillas_debug():
    """Devuelve estructura RAW de plantillas + ejemplos de retailer_id del catálogo."""
    wa_token = os.environ.get("WHATSAPP_TOKEN", "")
    waba_id = os.environ.get("WHATSAPP_WABA_ID", "")
    catalog_id = os.environ.get("WHATSAPP_CATALOG_ID", "")
    resultado = {}
    # Plantillas raw
    try:
        url = f"https://graph.facebook.com/v25.0/{waba_id}/message_templates?status=APPROVED&limit=10&fields=name,language,status,components,sub_category,category"
        req = urllib.request.Request(url, headers={"Authorization": f"Bearer {wa_token}"})
        with urllib.request.urlopen(req, timeout=10) as r:
            resultado["plantillas"] = json.loads(r.read()).get("data", [])
    except Exception as e:
        resultado["plantillas_error"] = str(e)
    # Primeros productos del catálogo Meta para ver sus retailer_id reales
    try:
        url2 = f"https://graph.facebook.com/v25.0/{catalog_id}/products?fields=retailer_id,name&limit=10"
        req2 = urllib.request.Request(url2, headers={"Authorization": f"Bearer {wa_token}"})
        with urllib.request.urlopen(req2, timeout=10) as r2:
            resultado["catalogo_productos"] = json.loads(r2.read())
    except Exception as e:
        resultado["catalogo_error"] = str(e)
    # Primeras variantes de la DB para comparar
    try:
        vars_db = supabase_get("variantes?activa=eq.true&select=producto_id,color,talla&limit=5")
        prods_db = supabase_get("productos?activo=eq.true&select=id,sku_interno&limit=5")
        sku_map = {p["id"]: p["sku_interno"] for p in prods_db}
        resultado["variantes_db_ejemplo"] = [
            {"sku": sku_map.get(v["producto_id"], "?"), "color": v["color"], "talla": v["talla"]}
            for v in vars_db
        ]
    except Exception as e:
        resultado["variantes_error"] = str(e)
    return resultado

@router.post("/autoresponder")
async def autoresponder_webhook(datos: dict):
    try:
        query = datos.get("query", {})
        mensaje = query.get("message", "")
        if not mensaje:
            return {"replies": [{"message": "Hola! En qué te puedo ayudar? 👠"}]}
        productos = cargar_catalogo()
        catalogo = construir_catalogo(productos)
        sistema = construir_sistema(catalogo)
        respuesta = llamar_claude([{"role": "user", "content": mensaje}], sistema)
        return {"replies": [{"message": respuesta}]}
    except Exception as e:
        return {"replies": [{"message": f"Error: {str(e)}"}]}
    
@router.post("/wa-diagnostico")
async def wa_diagnostico(datos: dict):
    """Envía UN mensaje de prueba a un número y devuelve la respuesta exacta de Meta."""
    wa_token = os.environ.get("WHATSAPP_TOKEN", "")
    phone_id = os.environ.get("WHATSAPP_PHONE_ID", "")
    waba_id = os.environ.get("WHATSAPP_WABA_ID", "")

    resultado = {
        "vars": {
            "WHATSAPP_TOKEN": ("✅ configurado (" + wa_token[:12] + "...)") if wa_token else "❌ VACÍO",
            "WHATSAPP_PHONE_ID": ("✅ " + phone_id) if phone_id else "❌ VACÍO",
            "WHATSAPP_WABA_ID": ("✅ " + waba_id) if waba_id else "❌ VACÍO",
        }
    }

    telefono = datos.get("telefono", "")
    plantilla = datos.get("plantilla", "")
    idioma = datos.get("idioma", "es_MX")
    # Parámetros de prueba: se autodetectan según la plantilla o se pasan explícitamente
    body_params_custom = datos.get("body_params", [])  # lista de strings
    if not telefono or not plantilla:
        return resultado

    tel = telefono.replace("+", "").replace(" ", "").replace("-", "")
    if not tel.startswith("52"):
        tel = "52" + tel

    # Detectar cuántas variables tiene la plantilla consultando Meta
    components_diag = []
    try:
        url_tpl = f"https://graph.facebook.com/v25.0/{waba_id}/message_templates?name={plantilla}&fields=components&limit=1"
        req_tpl = urllib.request.Request(url_tpl, headers={"Authorization": f"Bearer {wa_token}"})
        with urllib.request.urlopen(req_tpl, timeout=8) as r:
            tpl_data = json.loads(r.read())
        tpl_items = tpl_data.get("data", [])
        if tpl_items:
            body_comp = next((c for c in tpl_items[0].get("components", []) if c.get("type") == "BODY"), None)
            if body_comp:
                import re as _re
                n_vars = len(set(_re.findall(r'\{\{\d+\}\}', body_comp.get("text", ""))))
                if n_vars > 0:
                    if body_params_custom:
                        params = [{"type": "text", "text": str(p)} for p in body_params_custom[:n_vars]]
                    else:
                        # Valores de prueba genéricos
                        defaults = ["Cliente", "500", "OXXO", "Prueba4", "Prueba5"]
                        params = [{"type": "text", "text": defaults[i] if i < len(defaults) else f"Var{i+1}"} for i in range(n_vars)]
                    components_diag.append({"type": "body", "parameters": params})
                    resultado["params_enviados"] = [p["text"] for p in params]
    except Exception as e:
        resultado["params_warning"] = f"No se pudo detectar variables: {e}"

    body_msg = {
        "messaging_product": "whatsapp",
        "to": tel,
        "type": "template",
        "template": {"name": plantilla, "language": {"code": idioma}, "components": components_diag}
    }
    url = f"https://graph.facebook.com/v25.0/{phone_id}/messages"
    headers = {"Authorization": f"Bearer {wa_token}", "Content-Type": "application/json"}
    try:
        req = urllib.request.Request(url, data=json.dumps(body_msg).encode(), headers=headers, method="POST")
        with urllib.request.urlopen(req) as r:
            resp_body = json.loads(r.read())
        resultado["meta_response"] = resp_body
        resultado["status"] = "✅ Meta aceptó el mensaje"
    except urllib.error.HTTPError as e:
        err = e.read().decode()
        resultado["meta_response"] = json.loads(err) if err.startswith('{') else err
        resultado["status"] = f"❌ Meta rechazó: HTTP {e.code}"
    except Exception as ex:
        resultado["status"] = f"❌ Error: {str(ex)}"
    return resultado


@router.post("/crear-plantilla-pago")
async def crear_plantilla_pago():
    """Crea la plantilla 'recordatorio_pago_pendiente' en Meta WA Business para recordatorios OXXO/SPEI."""
    wa_token = os.environ.get("WHATSAPP_TOKEN", "")
    waba_id = os.environ.get("WHATSAPP_WABA_ID", "")
    if not wa_token or not waba_id:
        return JSONResponse(status_code=500, content={"error": "Faltan WHATSAPP_TOKEN o WHATSAPP_WABA_ID en Railway"})

    plantilla = {
        "name": "recordatorio_pago_pendiente",
        "language": "es_MX",
        "category": "UTILITY",
        "components": [
            {
                "type": "HEADER",
                "format": "TEXT",
                "text": "Tu pedido está esperando el pago"
            },
            {
                "type": "BODY",
                "text": (
                    "Hola {{1}}, te recordamos que tu pedido en Zapatillas May "
                    "está pendiente de pago por ${{2}} MXN vía {{3}}.\n\n"
                    "Realiza tu pago para que procesemos tu pedido lo antes posible. "
                    "Si ya pagaste, por favor ignora este mensaje.\n\n"
                    "Tienes dudas, con gusto te ayudamos."
                ),
                "example": {
                    "body_text": [["María", "850", "OXXO"]]
                }
            },
            {
                "type": "FOOTER",
                "text": "Zapatillas May · León, Guanajuato"
            },
            {
                "type": "BUTTONS",
                "buttons": [
                    {
                        "type": "URL",
                        "text": "Ir a zapatillasmay.mx",
                        "url": "https://zapatillasmay.mx"
                    },
                    {
                        "type": "PHONE_NUMBER",
                        "text": "Llamar al negocio",
                        "phone_number": "+524792244560"
                    }
                ]
            }
        ]
    }

    url = f"https://graph.facebook.com/v25.0/{waba_id}/message_templates"
    headers = {"Authorization": f"Bearer {wa_token}", "Content-Type": "application/json"}
    try:
        req = urllib.request.Request(url, data=json.dumps(plantilla).encode(), headers=headers, method="POST")
        with urllib.request.urlopen(req, timeout=15) as r:
            resp = json.loads(r.read())
        return {"ok": True, "meta_response": resp}
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        return JSONResponse(status_code=500, content={"error": f"Meta API HTTP {e.code}: {body[:500]}"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/crear-plantilla-catalogo")
async def crear_plantilla_catalogo():
    """
    Crea la plantilla 'catalogo_disponible' en Meta WA Business con categoría UTILITY.
    Al ser UTILITY puede enviarse a contactos fríos sin restricción de 24h.
    Usa botón MPM (Multi-Product Message) para mostrar el catálogo de productos.
    """
    wa_token = os.environ.get("WHATSAPP_TOKEN", "")
    waba_id = os.environ.get("WHATSAPP_WABA_ID", "")
    catalog_id = os.environ.get("WHATSAPP_CATALOG_ID", "")
    if not wa_token or not waba_id:
        return JSONResponse(status_code=500, content={"error": "Faltan WHATSAPP_TOKEN o WHATSAPP_WABA_ID en Railway"})
    if not catalog_id:
        return JSONResponse(status_code=500, content={"error": "Falta WHATSAPP_CATALOG_ID en Railway"})

    plantilla = {
        "name": "catalogo_disponible",
        "language": "es_MX",
        "category": "UTILITY",
        "components": [
            {
                "type": "HEADER",
                "format": "TEXT",
                "text": "Zapatillas May"
            },
            {
                "type": "BODY",
                "text": "Hola {{1}}, aqui tienes los modelos disponibles que solicitaste. Puedes ver fotos, tallas y precios de cada par.",
                "example": {
                    "body_text": [["Maria"]]
                }
            },
            {
                "type": "FOOTER",
                "text": "Leon, Guanajuato · Envios a todo Mexico"
            },
            {
                "type": "BUTTONS",
                "buttons": [
                    {
                        "type": "MPM",
                        "text": "View items"
                    }
                ]
            }
        ]
    }

    url = f"https://graph.facebook.com/v25.0/{waba_id}/message_templates"
    headers_req = {"Authorization": f"Bearer {wa_token}", "Content-Type": "application/json"}
    try:
        req = urllib.request.Request(url, data=json.dumps(plantilla).encode(), headers=headers_req, method="POST")
        with urllib.request.urlopen(req, timeout=15) as r:
            resp = json.loads(r.read())
        return {"ok": True, "meta_response": resp}
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        return JSONResponse(status_code=500, content={"error": f"Meta API HTTP {e.code}: {body[:500]}"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/catalogo-info")
async def catalogo_info():
    import httpx
    headers = {"Authorization": f"Bearer {os.getenv('WHATSAPP_TOKEN')}"}
    waba_id = os.getenv('WHATSAPP_WABA_ID')
    async with httpx.AsyncClient() as client:
        res = await client.get(f"https://graph.facebook.com/v19.0/{waba_id}/product_catalogs", headers=headers)
        return res.json()

@router.post("/envio-productos")
async def envio_productos(datos: dict):
    """Envía mensaje interactivo product_list de WhatsApp con hasta 30 productos del catálogo."""
    try:
        wa_token = os.environ.get("WHATSAPP_TOKEN", "")
        phone_id = os.environ.get("WHATSAPP_PHONE_ID", "")
        catalog_id = os.environ.get("WHATSAPP_CATALOG_ID", "844924814623850")
        if not wa_token or not phone_id:
            return JSONResponse(status_code=500, content={"error": "Token no configurado"})

        contactos = datos.get("contactos", [])   # [{"telefono": "...", "nombre": "..."}]
        skus      = datos.get("skus", [])         # list of sku_interno values (max 30)
        titulo    = datos.get("titulo", "Nuestros modelos") or "Nuestros modelos"
        cuerpo    = datos.get("cuerpo", "Elige el que más te guste 👠") or "Elige el que más te guste 👠"
        pie       = datos.get("pie", "Zapatillas May · León, Gto.") or "Zapatillas May · León, Gto."

        if not contactos:
            return JSONResponse(status_code=400, content={"error": "Se requiere al menos un contacto"})
        if not skus:
            return JSONResponse(status_code=400, content={"error": "Se requiere al menos un SKU"})

        # Limitar a 30 productos
        skus = skus[:30]

        # Obtener datos de productos para agrupar por categoría
        productos_db = supabase_get("productos?activo=eq.true&select=sku_interno,id,nombre,categoria")
        sku_a_prod = {}
        for p in productos_db:
            k = p.get("sku_interno") or p.get("id")
            if k:
                sku_a_prod[k] = p

        # Obtener variantes para construir los product_retailer_id correctos
        # (el catálogo de Meta usa el ID de variante, no el sku_interno)
        variantes_db = supabase_get("variantes?activa=eq.true&select=producto_id,color,talla")
        # Mapear producto_id -> primera variante disponible
        prod_id_a_variante = {}
        for v in variantes_db:
            pid = v.get("producto_id")
            if pid and pid not in prod_id_a_variante:
                prod_id_a_variante[pid] = v

        def construir_variant_id(sku, variante):
            """Construye el product_retailer_id igual que el feed meta.xml"""
            color = (variante.get("color") or "").strip()
            talla = str(variante.get("talla") or "").strip()
            color_norm = color.replace(" ", "_").replace("/", "_").replace("-", "_").strip("_")
            if talla:
                return f"{sku}-{color_norm}-{talla}"
            else:
                return f"{sku}-{color_norm}"

        # Agrupar SKUs por categoría usando variant IDs como product_retailer_id
        secciones_dict = {}  # categoria -> [retailer_ids]
        for sku in skus:
            prod = sku_a_prod.get(sku)
            cat = (prod.get("categoria") or "Modelos") if prod else "Modelos"
            cat = cat.strip().title() or "Modelos"
            # Buscar la variante del producto para construir el ID correcto
            prod_id = prod.get("id") if prod else None
            variante = prod_id_a_variante.get(prod_id) if prod_id else None
            if variante:
                retailer_id = construir_variant_id(sku, variante)
            else:
                retailer_id = sku  # fallback al sku si no tiene variantes
            secciones_dict.setdefault(cat, []).append(retailer_id)

        # Construir secciones (máx 10 secciones, títulos máx 24 chars)
        sections = []
        for cat, items in list(secciones_dict.items())[:10]:
            sections.append({
                "title": cat[:24],
                "product_items": [{"product_retailer_id": s} for s in items]
            })

        # Si hay un solo SKU usar tipo "product", si hay varios usar "product_list"
        total_skus = sum(len(s["product_items"]) for s in sections)

        wa_url = f"https://graph.facebook.com/v25.0/{phone_id}/messages"
        headers_req = {"Authorization": f"Bearer {wa_token}", "Content-Type": "application/json"}

        enviados = 0
        fallidos = 0
        errores = []

        for contacto in contactos:
            telefono = (contacto.get("telefono") or "").replace("+", "").replace(" ", "").replace("-", "")
            if not telefono:
                continue
            if not telefono.startswith("52"):
                telefono = "52" + telefono

            if total_skus == 1:
                # Mensaje de producto único
                interactive_msg = {
                    "type": "product",
                    "body": {"text": cuerpo},
                    "footer": {"text": pie},
                    "action": {
                        "catalog_id": catalog_id,
                        "product_retailer_id": skus[0]
                    }
                }
            else:
                # Mensaje de lista de productos
                interactive_msg = {
                    "type": "product_list",
                    "header": {"type": "text", "text": titulo[:60]},
                    "body": {"text": cuerpo[:1024]},
                    "footer": {"text": pie[:60]},
                    "action": {
                        "catalog_id": catalog_id,
                        "sections": sections
                    }
                }

            body_msg = {
                "messaging_product": "whatsapp",
                "to": telefono,
                "type": "interactive",
                "interactive": interactive_msg
            }

            body_enc = json.dumps(body_msg).encode("utf-8")
            req = urllib.request.Request(wa_url, data=body_enc, headers=headers_req, method="POST")
            try:
                with urllib.request.urlopen(req) as resp:
                    enviados += 1
            except urllib.error.HTTPError as http_e:
                error_body = http_e.read().decode()
                fallidos += 1
                print(f"Error WA catálogo HTTP {http_e.code}: {error_body}")
                errores.append(f"{telefono}: HTTP {http_e.code} - {error_body}")
            except Exception as inner_e:
                fallidos += 1
                print(f"Error WA catálogo: {str(inner_e)}")
                errores.append(f"{telefono}: {str(inner_e)}")

        return {"ok": True, "enviados": enviados, "fallidos": fallidos, "errores": errores}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


# ─── Nuevos endpoints WhatsApp Cloud API ──────────────────────────────────────

@router.post("/chats/{telefono}/documento")
async def enviar_documento_manual(telefono: str, datos: dict):
    try:
        doc_url  = datos.get("doc_url", "")
        filename = datos.get("filename", "documento.pdf")
        caption  = datos.get("caption", "")
        agente   = datos.get("agente", "Admin")
        if not doc_url:
            return JSONResponse(status_code=400, content={"error": "doc_url requerido"})
        enviar_whatsapp_documento(telefono, doc_url, filename, caption)
        supabase_post("conversaciones_whatsapp", {
            "telefono": telefono,
            "mensaje": f"[{agente}]: [Documento] {filename} {doc_url}",
            "respuesta": None,
            "tipo": "documento_saliente",
            "leido": True
        })
        cache_invalidate("chats_lista")
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/chats/{telefono}/video")
async def enviar_video_manual(telefono: str, datos: dict):
    try:
        video_url = datos.get("video_url", "")
        caption   = datos.get("caption", "")
        agente    = datos.get("agente", "Admin")
        if not video_url:
            return JSONResponse(status_code=400, content={"error": "video_url requerido"})
        enviar_whatsapp_video(telefono, video_url, caption)
        supabase_post("conversaciones_whatsapp", {
            "telefono": telefono,
            "mensaje": f"[{agente}]: [Video] {video_url}",
            "respuesta": None,
            "tipo": "video_saliente",
            "leido": True
        })
        cache_invalidate("chats_lista")
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/chats/{telefono}/reaccion")
async def enviar_reaccion(telefono: str, datos: dict):
    try:
        message_id = datos.get("message_id", "")
        emoji      = datos.get("emoji", "👍")
        if not message_id:
            return JSONResponse(status_code=400, content={"error": "message_id requerido"})
        enviar_whatsapp_reaccion(telefono, message_id, emoji)
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.patch("/chats/{telefono}/no-leido")
async def marcar_no_leido(telefono: str):
    try:
        existing = supabase_get(f"chats_control?telefono=eq.{telefono}")
        if existing:
            supabase_patch(f"chats_control?telefono=eq.{telefono}", {"pendiente_revision": True})
        else:
            supabase_post("chats_control", {"telefono": telefono, "pendiente_revision": True})
        cache_invalidate("chats_lista")
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/chats/{telefono}/ubicacion")
async def enviar_ubicacion_manual(telefono: str, datos: dict):
    try:
        lat    = datos.get("lat", "")
        lng    = datos.get("lng", "")
        nombre = datos.get("nombre", "Zapatillas May")
        dir_   = datos.get("direccion", "León, Guanajuato")
        agente = datos.get("agente", "Admin")
        if not lat or not lng:
            return JSONResponse(status_code=400, content={"error": "lat y lng requeridos"})
        enviar_whatsapp_ubicacion(telefono, lat, lng, nombre, dir_)
        supabase_post("conversaciones_whatsapp", {
            "telefono": telefono,
            "mensaje": f"[{agente}]: [Ubicación] {nombre} https://maps.google.com/?q={lat},{lng}",
            "respuesta": None,
            "tipo": "ubicacion_saliente",
            "leido": True
        })
        cache_invalidate("chats_lista")
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/chats/{telefono}/contacto")
async def enviar_contacto_manual(telefono: str, datos: dict):
    try:
        nombre_c = datos.get("nombre", "Zapatillas May")
        tel_c    = datos.get("telefono_contacto", "")
        empresa  = datos.get("empresa", "Zapatillas May")
        agente   = datos.get("agente", "Admin")
        if not tel_c:
            return JSONResponse(status_code=400, content={"error": "telefono_contacto requerido"})
        enviar_whatsapp_contacto(telefono, nombre_c, tel_c, empresa)
        supabase_post("conversaciones_whatsapp", {
            "telefono": telefono,
            "mensaje": f"[{agente}]: [Contacto] {nombre_c} {tel_c}",
            "respuesta": None,
            "tipo": "contacto_saliente",
            "leido": True
        })
        cache_invalidate("chats_lista")
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


# ─── Gestión de plantillas de WhatsApp ────────────────────────────────────────

def _wa_graph(path: str, method: str = "GET", body: dict = None) -> dict:
    """Llamada genérica a la Graph API de Meta."""
    wa_token = os.environ.get("WHATSAPP_TOKEN", "")
    headers  = {"Authorization": f"Bearer {wa_token}", "Content-Type": "application/json"}
    url = f"https://graph.facebook.com/v25.0/{path}"
    data = json.dumps(body).encode() if body else None
    req  = urllib.request.Request(url, data=data, headers=headers, method=method)
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

def _get_waba_id() -> str:
    """Obtiene el WABA_ID desde cualquiera de los nombres posibles de env var."""
    for key in ("WHATSAPP_WABA_ID", "WABA_ID", "WA_BUSINESS_ID", "WHATSAPP_BUSINESS_ID"):
        val = os.environ.get(key, "")
        if val:
            return val
    return ""

@router.get("/templates/debug-env")
async def debug_env():
    """Diagnóstico: qué variables WA están configuradas (sin mostrar valores sensibles)."""
    keys = ["WHATSAPP_TOKEN","WHATSAPP_PHONE_ID","WHATSAPP_WABA_ID","WABA_ID","WA_BUSINESS_ID","WHATSAPP_BUSINESS_ID"]
    return {k: ("✓ SET" if os.environ.get(k) else "✗ MISSING") for k in keys}

@router.get("/templates")
async def listar_templates():
    try:
        waba_id = _get_waba_id()
        if not waba_id:
            return JSONResponse(status_code=400, content={"error": "No se pudo obtener WABA_ID"})
        data = _wa_graph(f"{waba_id}/message_templates?fields=name,status,category,language,components&limit=50")
        return {"waba_id": waba_id, "templates": data.get("data", [])}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/templates")
async def crear_template(datos: dict):
    """Crea una plantilla en Meta. datos = {name, category, language, components}"""
    try:
        waba_id = _get_waba_id()
        if not waba_id:
            return JSONResponse(status_code=400, content={"error": "No se pudo obtener WABA_ID"})
        result = _wa_graph(f"{waba_id}/message_templates", method="POST", body=datos)
        return result
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        return JSONResponse(status_code=e.code, content={"error": body})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.delete("/templates/{template_name}")
async def eliminar_template(template_name: str):
    try:
        waba_id = _get_waba_id()
        result = _wa_graph(f"{waba_id}/message_templates?name={template_name}", method="DELETE")
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/templates/enviar")
async def enviar_template(datos: dict):
    """Envía una plantilla aprobada a un teléfono con parámetros posicionales."""
    try:
        telefono  = datos.get("telefono", "")
        template  = datos.get("template", "")
        params    = datos.get("params", [])   # lista de strings posicionales
        language  = datos.get("language", "es_MX")
        if not telefono or not template:
            return JSONResponse(status_code=400, content={"error": "telefono y template requeridos"})

        components = []
        if params:
            components.append({
                "type": "body",
                "parameters": [{"type": "text", "text": str(p)} for p in params]
            })
            # Si la plantilla tiene botones con variable (aviso_envio → URL con {{1}})
            if template == "aviso_envio" and len(params) >= 3:
                components.append({
                    "type": "button",
                    "sub_type": "url",
                    "index": "0",
                    "parameters": [{"type": "text", "text": str(params[2])}]
                })

        payload = {
            "messaging_product": "whatsapp",
            "to": telefono,
            "type": "template",
            "template": {
                "name": template,
                "language": {"code": language},
                "components": components
            }
        }
        wa_id = _wa_send(payload)
        return {"ok": True, "wa_id": wa_id}
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        return JSONResponse(status_code=e.code, content={"error": body})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/templates/crear-predefinidas")
async def crear_templates_predefinidos():
    """Crea las 3 plantillas de utilidad para Zapatillas May."""
    try:
        waba_id = _get_waba_id()
    except urllib.error.HTTPError as e:
        err = e.read().decode()
        return JSONResponse(status_code=e.code, content={"error": f"Error obteniendo WABA_ID: {err}"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Error obteniendo WABA_ID: {str(e)}"})
    if not waba_id:
        return JSONResponse(status_code=400, content={"error": "No se pudo obtener WABA_ID — verifica WHATSAPP_TOKEN y WHATSAPP_PHONE_ID en Railway"})

    plantillas = [
        {
            "name": "confirmacion_pedido",
            "category": "UTILITY",
            "language": "es_MX",
            "components": [
                {
                    "type": "HEADER",
                    "format": "TEXT",
                    "text": "Pedido confirmado"
                },
                {
                    "type": "BODY",
                    "text": "Hola {{1}}, tu pedido #{{2}} por ${{3}} MXN ha sido confirmado. En breve te enviamos la guía de rastreo. Cualquier duda estamos aquí.",
                    "example": {
                        "body_text": [["Ana", "1042", "980"]]
                    }
                },
                {
                    "type": "FOOTER",
                    "text": "Zapatillas May · León, Gto."
                }
            ]
        },
        {
            "name": "aviso_envio",
            "category": "UTILITY",
            "language": "es_MX",
            "components": [
                {
                    "type": "HEADER",
                    "format": "TEXT",
                    "text": "Tu pedido va en camino"
                },
                {
                    "type": "BODY",
                    "text": "Hola {{1}}, tu pedido #{{2}} fue enviado. Tu número de guía es {{3}} con {{4}}. Tiempo estimado: 2 a 4 días hábiles.",
                    "example": {
                        "body_text": [["Ana", "1042", "1Z999AA10123456784", "DHL"]]
                    }
                },
                {
                    "type": "FOOTER",
                    "text": "Zapatillas May · León, Gto."
                },
                {
                    "type": "BUTTONS",
                    "buttons": [
                        {
                            "type": "URL",
                            "text": "Rastrear pedido",
                            "url": "https://www.dhl.com.mx/es/express/rastreo.html?AWB={{1}}",
                            "example": ["1Z999AA10123456784"]
                        }
                    ]
                }
            ]
        },
        {
            "name": "recordatorio_carrito",
            "category": "MARKETING",
            "language": "es_MX",
            "components": [
                {
                    "type": "HEADER",
                    "format": "TEXT",
                    "text": "Olvidaste algo"
                },
                {
                    "type": "BODY",
                    "text": "Hola {{1}}, vimos que dejaste {{2}} en tu carrito. Aún lo tenemos disponible en talla {{3}}. Escríbenos y te lo apartamos antes de que se agote.",
                    "example": {
                        "body_text": [["Ana", "tacones stiletto negro", "25"]]
                    }
                },
                {
                    "type": "FOOTER",
                    "text": "Zapatillas May · León, Gto."
                }
            ]
        }
    ]

    resultados = []
    for p in plantillas:
        try:
            r = _wa_graph(f"{waba_id}/message_templates", method="POST", body=p)
            resultados.append({"nombre": p["name"], "ok": True, "id": r.get("id"), "status": r.get("status")})
        except urllib.error.HTTPError as e:
            err = e.read().decode()
            resultados.append({"nombre": p["name"], "ok": False, "error": err})
        except Exception as ex:
            resultados.append({"nombre": p["name"], "ok": False, "error": str(ex)})

    return {"waba_id": waba_id, "resultados": resultados}


# ═══════════════════════════════════════════════════════════════════
#  MENSAJES INTERACTIVOS — BOTONES, LISTA, CARRUSEL
# ═══════════════════════════════════════════════════════════════════

@router.post("/chats/{telefono}/botones")
async def enviar_botones_interactivos(telefono: str, datos: dict):
    """Envía mensaje con hasta 3 botones. Siempre incluye 'Hablar con asesor'."""
    try:
        cuerpo      = datos.get("cuerpo", "¿En qué te puedo ayudar?")
        encabezado  = datos.get("encabezado", "")
        pie         = datos.get("pie", "")
        botones_raw = datos.get("botones", [])
        agente      = datos.get("agente", "Admin")

        botones = []
        for i, b in enumerate(botones_raw[:2]):
            titulo = str(b).strip()[:20]
            if titulo:
                botones.append({"type": "reply", "reply": {"id": f"btn_{i}", "title": titulo}})
        botones.append({"type": "reply", "reply": {"id": "asesor", "title": "Hablar con asesor"}})

        interactive = {"type": "button", "body": {"text": cuerpo}, "action": {"buttons": botones}}
        if encabezado:
            interactive["header"] = {"type": "text", "text": encabezado[:60]}
        if pie:
            interactive["footer"] = {"text": pie[:60]}

        wamid = _wa_send({"messaging_product": "whatsapp", "to": telefono, "type": "interactive", "interactive": interactive})
        btns_txt = " | ".join(b["reply"]["title"] for b in botones)
        row_botones = {"telefono": telefono, "mensaje": f"[{agente}]: [Botones] {cuerpo} -> {btns_txt}",
                       "respuesta": None, "tipo": "botones_saliente", "leido": True}
        if wamid:
            try: row_botones["wa_message_id"] = wamid
            except Exception: pass
        try: supabase_post("conversaciones_whatsapp", row_botones)
        except Exception: pass
        cache_invalidate("chats_lista")
        return {"ok": True, "wamid": wamid}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/chats/{telefono}/lista")
async def enviar_lista_interactiva(telefono: str, datos: dict):
    """Envía menu desplegable con secciones y opciones (hasta 10)."""
    try:
        cuerpo        = datos.get("cuerpo", "Selecciona una opcion:")
        titulo_boton  = datos.get("titulo_boton", "Ver opciones")[:20]
        secciones_raw = datos.get("secciones", [])
        agente        = datos.get("agente", "Admin")

        if not secciones_raw:
            return JSONResponse(status_code=400, content={"error": "secciones requeridas"})

        secciones = []
        for sec in secciones_raw[:10]:
            rows = []
            for i, op in enumerate(sec.get("opciones", [])[:10]):
                row = {"id": str(op.get("id", f"op_{i}"))[:200], "title": str(op.get("titulo", ""))[:24]}
                if op.get("descripcion"):
                    row["description"] = str(op["descripcion"])[:72]
                rows.append(row)
            secciones.append({"title": str(sec.get("titulo", "Opciones"))[:24], "rows": rows})

        wamid = _wa_send({
            "messaging_product": "whatsapp", "to": telefono, "type": "interactive",
            "interactive": {"type": "list", "body": {"text": cuerpo},
                            "action": {"button": titulo_boton, "sections": secciones}}
        })
        opciones_txt = ", ".join(op.get("titulo","") for sec in secciones_raw for op in sec.get("opciones",[]))
        row_lista = {"telefono": telefono, "mensaje": f"[{agente}]: [Lista] {cuerpo} -> {opciones_txt}",
                     "respuesta": None, "tipo": "lista_saliente", "leido": True}
        if wamid:
            try: row_lista["wa_message_id"] = wamid
            except Exception: pass
        try: supabase_post("conversaciones_whatsapp", row_lista)
        except Exception: pass
        cache_invalidate("chats_lista")
        return {"ok": True, "wamid": wamid}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/chats/{telefono}/carrusel")
async def enviar_carrusel(telefono: str, datos: dict):
    """Envia multiples imagenes seguidas con caption (nombre + precio)."""
    try:
        cuerpo       = datos.get("cuerpo", "Mira estos modelos:")
        tarjetas_raw = datos.get("tarjetas", [])
        agente       = datos.get("agente", "Admin")

        if not tarjetas_raw:
            return JSONResponse(status_code=400, content={"error": "tarjetas requeridas"})

        tarjetas_validas = [t for t in tarjetas_raw[:10] if t.get("imagen_url")]
        if not tarjetas_validas:
            return JSONResponse(status_code=400, content={"error": "ninguna tarjeta tiene imagen_url"})

        # Solo imágenes con caption — sin mensajes de texto separados para evitar desorden
        enviadas = 0
        for i, t in enumerate(tarjetas_validas):
            img_url = t["imagen_url"]
            caption = t.get("texto", "")
            # El intro va en el caption de la primera imagen
            if i == 0 and cuerpo:
                caption = f"{cuerpo}\n\n{caption}" if caption else cuerpo
            # El CTA va en el caption de la última imagen
            if i == len(tarjetas_validas) - 1:
                caption = f"{caption}\n\n¿Alguno te llama la atención? 👀" if caption else "¿Alguno te llama la atención? 👀"
            _wa_send({
                "messaging_product": "whatsapp", "to": telefono, "type": "image",
                "image": {"link": img_url, "caption": caption[:1024]}
            })
            enviadas += 1

        # No poner en control manual automáticamente — Maya puede seguir respondiendo

        try:
            # Guardar nombres de los productos para que Maya tenga contexto
            nombres_productos = ", ".join([t.get("texto", "").split("\n")[0] for t in tarjetas_validas if t.get("texto")])
            supabase_post("conversaciones_whatsapp", {
                "telefono": telefono,
                "mensaje": f"[{agente}]: [Carrusel] {cuerpo} — Productos: {nombres_productos} ({enviadas} fotos)",
                "tipo": "carrusel_saliente",
                "leido": True
            })
        except Exception:
            pass  # no bloquear si falla el registro
        cache_invalidate("chats_lista")
        return {"ok": True, "enviadas": enviadas}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


# ═══════════════════════════════════════════════════════════════════
#  BROADCAST MASIVO
# ═══════════════════════════════════════════════════════════════════

@router.post("/broadcast")
async def broadcast_masivo(datos: dict):
    """Envia un template aprobado a multiples telefonos."""
    try:
        template_name = datos.get("template", "")
        params        = datos.get("params", [])
        telefonos     = datos.get("telefonos", [])
        idioma        = datos.get("idioma", "es_MX")

        if not template_name:
            return JSONResponse(status_code=400, content={"error": "template requerido"})
        if not telefonos:
            return JSONResponse(status_code=400, content={"error": "telefonos requeridos"})

        resultados = []
        for tel in telefonos:
            try:
                components = []
                if params:
                    components.append({"type": "body", "parameters": [{"type": "text", "text": str(p)} for p in params]})
                wamid = _wa_send({
                    "messaging_product": "whatsapp", "to": tel, "type": "template",
                    "template": {"name": template_name, "language": {"code": idioma}, "components": components}
                })
                resultados.append({"tel": tel, "ok": bool(wamid), "wamid": wamid})
                row_bc = {"telefono": tel, "mensaje": f"[Broadcast]: [Template] {template_name}",
                          "respuesta": None, "tipo": "template_saliente", "leido": True}
                if wamid:
                    try: row_bc["wa_message_id"] = wamid
                    except Exception: pass
                try: supabase_post("conversaciones_whatsapp", row_bc)
                except Exception: pass
            except Exception as e:
                resultados.append({"tel": tel, "ok": False, "error": str(e)})

        cache_invalidate("chats_lista")
        enviados = sum(1 for r in resultados if r.get("ok"))
        return {"ok": True, "total": len(telefonos), "enviados": enviados,
                "errores": len(telefonos) - enviados, "resultados": resultados}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


# ═══════════════════════════════════════════════════════════════════
#  ESTADO DE BANDEJA (abierto / espera / cerrado)
# ═══════════════════════════════════════════════════════════════════

@router.patch("/chats/{telefono}/estado")
async def cambiar_estado_chat(telefono: str, datos: dict):
    """Cambia el estado del chat: abierto | espera | cerrado."""
    try:
        estado = datos.get("estado", "abierto")
        if estado not in ("abierto", "espera", "cerrado"):
            return JSONResponse(status_code=400, content={"error": "estado invalido"})
        existente = supabase_get(f"chats_control?telefono=eq.{telefono}")
        if existente:
            supabase_patch(f"chats_control?telefono=eq.{telefono}", {"estado": estado})
        else:
            supabase_post("chats_control", {"telefono": telefono, "estado": estado})
        cache_invalidate("chats_lista")
        return {"ok": True, "estado": estado}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
