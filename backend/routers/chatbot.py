from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_post, supabase_patch
from cache import cache_get, cache_set, cache_invalidate
import urllib.request
import json
import os
import base64
import re
import mercadopago

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

def get_api_key():
    return os.environ.get("ANTHROPIC_API_KEY", "")

def construir_catalogo(productos):
    catalogo = ""
    for p in productos[:40]:
        sku = p.get('sku_interno') or p.get('id','')
        catalogo += f"- [SKU:{sku}] {p['nombre']}"
        if p.get('imagen_principal'):
            catalogo += f" [IMG:{p['imagen_principal']}]"
        catalogo += f": menudeo ${p['precio_menudeo']}"
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

PRECIOS Y MAYOREO:
- Menudeo: precio normal (1-2 pares)
- Mayoreo variado 3-5 pares: -$30 por par (puedes mezclar estilos y colores)
- Mayoreo variado 6+ pares: -$70 por par
- Corrida completa: -$110 por par (mismo estilo/color, tallas 23 al 26 con medios = 6 pares)

ENVÍOS:
- Menos de 6 pares: Fedex o Estafeta $99
- Mayoreo: Castores (pago al recibir), Estafeta o Fedex (pago con pedido)
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
Cuando tengas TODOS los datos (nombre completo + dirección + modelo + color + talla + precio del catálogo):
- Resume el pedido brevemente
- Usa el marcador GENERAR_PAGO con JSON exacto (sin espacios extra, sin saltos de línea dentro):
  GENERAR_PAGO:{{"nombre":"NOMBRE","direccion":"DIRECCION","modelo":"NOMBRE_MODELO","sku":"SKU_DEL_CATALOGO","color":"COLOR","talla":"TALLA","precio":PRECIO_NUMERO}}
- Ejemplo: "¡Perfecto Lupita! 🛍️ Tu pedido: MA302 Negro talla 24 — $365 + $99 envío = $464 total GENERAR_PAGO:{{"nombre":"Lupita García","direccion":"Av. Hidalgo 123, Centro, CDMX 06600","modelo":"Tacón MA302","sku":"MA302","color":"Negro","talla":"24","precio":365}}
- El sistema creará el pedido y mandará el link de Mercado Pago automáticamente
- NO pongas LINK_PAGO, usa GENERAR_PAGO con el JSON

=== REGLAS IMPORTANTES ===
- Habla como vendedora mexicana amigable y natural (amiga, no robot)
- Máximo 3-4 líneas por mensaje, nunca textos largos de golpe
- NUNCA inventes precios ni modelos fuera del catálogo
- NUNCA mandes el link del sitio como primera respuesta, primero muestra productos
- Si el cliente pide asesor humano: "Con gusto te comunico con una asesora, espera un momento 😊" y para de responder
- Si preguntan por mayoreo, explica los precios y pregunta cuántos pares buscan
- Sé diferente en cada mensaje, no repitas el mismo texto
- Responde siempre en español mexicano natural"""

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

def llamar_claude_con_imagen(img_b64, sistema, historial=[]):
    url = "https://api.anthropic.com/v1/messages"
    headers = {
        "x-api-key": get_api_key(),
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }
    mensajes = historial + [{
        "role": "user",
        "content": [
            {
                "type": "image",
                "source": {"type": "base64", "media_type": "image/jpeg", "data": img_b64}
            },
            {
                "type": "text",
                "text": "La clienta mandó esta foto de calzado. Identifica el estilo y recomienda modelos similares del catálogo con precio. Si tienen [IMG:url] inclúyela como ENVIAR_FOTO:[url]"
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

def enviar_whatsapp_texto(to, texto):
    wa_token = os.environ.get("WHATSAPP_TOKEN", "")
    phone_id = os.environ.get("WHATSAPP_PHONE_ID", "")
    if not wa_token or not phone_id:
        return
    url = f"https://graph.facebook.com/v25.0/{phone_id}/messages"
    headers = {"Authorization": f"Bearer {wa_token}", "Content-Type": "application/json"}
    body = json.dumps({
        "messaging_product": "whatsapp",
        "to": to,
        "type": "text",
        "text": {"body": texto}
    }).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    try:
        urllib.request.urlopen(req)
    except Exception as e:
        print(f"Error texto WA: {e}")

def enviar_whatsapp_imagen(to, url_img, caption=""):
    print(f"ENVIANDO IMAGEN: {url_img}")
    wa_token = os.environ.get("WHATSAPP_TOKEN", "")
    phone_id = os.environ.get("WHATSAPP_PHONE_ID", "")
    if not wa_token or not phone_id:
        return
    url = f"https://graph.facebook.com/v25.0/{phone_id}/messages"
    headers = {"Authorization": f"Bearer {wa_token}", "Content-Type": "application/json"}
    body = json.dumps({
        "messaging_product": "whatsapp",
        "to": to,
        "type": "image",
        "image": {"link": url_img, "caption": caption}
    }).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    try:
        urllib.request.urlopen(req)
    except Exception as e:
        print(f"Error imagen WA: {e}")

def generar_link_pago_wa(telefono: str, datos_pedido: dict) -> tuple:
    """Crea el pedido en ERP + preferencia Mercado Pago. Devuelve (link, total, pedido_id)."""
    try:
        nombre     = datos_pedido.get("nombre", "Cliente")
        direccion  = datos_pedido.get("direccion", "")
        modelo     = datos_pedido.get("modelo", "Calzado")
        color      = datos_pedido.get("color", "")
        talla      = datos_pedido.get("talla", "")
        precio     = float(datos_pedido.get("precio", 0))
        envio      = 99.0
        total      = precio + envio
        descripcion = f"{modelo} — {color} talla {talla}"
        notas       = f"Pedido WhatsApp | {descripcion} | Envío a: {direccion}"

        # 1. Crear pedido en Supabase
        pedido_db = supabase_post("pedidos", {
            "nombre_cliente":   nombre,
            "telefono_cliente": telefono,
            "email_cliente":    "cliente@zapatillasmay.mx",
            "total":            total,
            "status":           "pendiente_pago",
            "canal":            "whatsapp",
            "notas":            notas,
        })
        # supabase_post puede devolver lista o dict
        pedido_id = (pedido_db[0] if isinstance(pedido_db, list) else pedido_db).get("id")
        if not pedido_id:
            return None, total, None

        # 2. Crear preferencia Mercado Pago
        sdk = mercadopago.SDK(os.environ.get("MP_ACCESS_TOKEN", ""))
        pref_data = {
            "items": [
                {"title": descripcion[:255], "quantity": 1, "unit_price": precio, "currency_id": "MXN"},
                {"title": "Envío",           "quantity": 1, "unit_price": envio,  "currency_id": "MXN"},
            ],
            "payer":              {"name": nombre, "email": "cliente@zapatillasmay.mx"},
            "external_reference": str(pedido_id),
            "notification_url":   os.environ.get("MP_WEBHOOK_URL", ""),
            "back_urls": {
                "success": "https://zapatillasmay.com/gracias",
                "failure": "https://zapatillasmay.com/pago-fallido",
                "pending": "https://zapatillasmay.com/pago-pendiente",
            },
            "auto_return": "approved",
        }
        result = sdk.preference().create(pref_data)
        pref   = result["response"]
        link   = pref.get("init_point", "")

        if pref.get("id"):
            supabase_patch(f"pedidos?id=eq.{pedido_id}",
                           {"mp_preference_id": pref["id"]})
        return link, total, pedido_id
    except Exception as e:
        print(f"Error generando link MP: {e}")
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
        if texto:
            enviar_whatsapp_texto(from_number, texto)
        try:
            datos = json.loads(match_pago.group(1))
            link, total, pedido_id = generar_link_pago_wa(from_number, datos)
            import time; time.sleep(1)
            if link:
                nombre_corto = datos.get("nombre", "").split()[0] or "aquí"
                enviar_whatsapp_texto(
                    from_number,
                    f"💳 *Link de pago — ${total:.0f} MXN*\n\n{link}\n\n"
                    f"_Acepta tarjeta, transferencia, OXXO y más. "
                    f"En cuanto confirme el pago procesamos tu pedido 🚀_"
                )
            else:
                enviar_whatsapp_texto(from_number,
                    "Hubo un problema generando tu link de pago, escríbeme y te lo mando por otro medio 🙏")
        except Exception as e:
            print(f"Error procesando GENERAR_PAGO: {e}")
            enviar_whatsapp_texto(from_number,
                "Hubo un problema generando tu link de pago, escríbeme y te lo mando por otro medio 🙏")
        return texto or respuesta_claude

    # ── BUSCAR_COLORES:[SKU] ─────────────────────────────────────────────────
    match_colores = re.search(r'BUSCAR_COLORES:\[?([A-Za-z0-9_\-]+)\]?', respuesta_claude)
    if match_colores:
        sku = match_colores.group(1).strip()
        # Texto sin el marcador
        texto = re.sub(r'BUSCAR_COLORES:\[?[A-Za-z0-9_\-]+\]?', '', respuesta_claude).strip()
        if texto:
            enviar_whatsapp_texto(from_number, texto)
        import time
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
        import time; time.sleep(0.8)
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

def obtener_historial(telefono, limite=6):
    try:
        convs = supabase_get(f"conversaciones_whatsapp?telefono=eq.{telefono}&order=created_at.desc&limit={limite}")
        convs = list(reversed(convs))
        mensajes = []
        for c in convs:
            msg = c.get('mensaje', '')
            resp = c.get('respuesta', '')
            if msg and not msg.startswith('['):
                mensajes.append({"role": "user", "content": msg})
            if resp:
                # Quitar marcadores FOTO del historial para no confundir al modelo
                resp_limpia = re.sub(r'ENVIAR_FOTO:\[[^\]]+\]', '', resp).strip()
                resp_limpia = re.sub(r'ENVIAR_FOTO:\S+', '', resp_limpia).strip()
                if resp_limpia:
                    mensajes.append({"role": "assistant", "content": resp_limpia})
        return mensajes
    except:
        return []

def guardar_conversacion(telefono, mensaje, respuesta, tipo="texto", nombre=""):
    try:
        from database import supabase_post
        supabase_post("conversaciones_whatsapp", {
            "telefono": telefono,
            "nombre_contacto": nombre,
            "mensaje": mensaje,
            "respuesta": respuesta,
            "tipo": tipo
        })
        cache_invalidate("chats_lista")  # forzar refresh en próximo poll
    except Exception as e:
        print(f"ERROR guardando: {str(e)}")

def enviar_whatsapp(from_number, respuesta):
    enviar_whatsapp_texto(from_number, respuesta)

def cargar_catalogo():
    return supabase_get("productos?activo=eq.true&select=id,sku_interno,nombre,precio_menudeo,precio_mayoreo3,precio_mayoreo6,precio_corrida,categoria,nuevo,corrida_activa,tallas_disponibles,imagen_principal")

@router.post("/whatsapp")
async def recibir_mensaje_whatsapp(datos: dict):
    try:
        print(f"WHATSAPP DATOS: {json.dumps(datos)}")
        entry = datos.get("entry", [{}])[0]
        changes = entry.get("changes", [{}])[0]
        value = changes.get("value", {})
        messages = value.get("messages", [])
        if not messages:
            return {"status": "ok"}

        mensaje_data = messages[0]
        tipo = mensaje_data.get("type", "text")
        from_number = mensaje_data.get("from", "")
        contacts = value.get("contacts", [])
        nombre_contacto = contacts[0].get("profile", {}).get("name", "") if contacts else ""

        control = supabase_get(f"chats_control?telefono=eq.{from_number}&en_control=eq.true")

        productos = cargar_catalogo()
        catalogo = construir_catalogo(productos)
        sistema = construir_sistema(catalogo)
        historial = obtener_historial(from_number)

        if tipo == "image":
            if control:
                guardar_conversacion(from_number, "[Imagen recibida]", None, "imagen", nombre_contacto)
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
                img_b64 = base64.b64encode(img_bytes).decode("utf-8")
                respuesta_claude = llamar_claude_con_imagen(img_b64, sistema, historial)
                texto_guardado = procesar_y_enviar_respuesta(from_number, respuesta_claude)
                guardar_conversacion(from_number, "[Imagen]", texto_guardado, "imagen", nombre_contacto)
            except Exception as e:
                print(f"ERROR IMAGEN: {str(e)}")
                enviar_whatsapp_texto(from_number, "Vi que mandaste una foto 📸 ¿Qué tipo de calzado buscas? Cuéntame y te muestro opciones 😊")
            return {"status": "ok"}

        if tipo == "text":
            mensaje = mensaje_data.get("text", {}).get("body", "")
        elif tipo == "audio":
            mensaje = "La cliente mandó un audio, pídele amablemente que escriba su mensaje"
        else:
            return {"status": "ok"}

        if not mensaje:
            return {"status": "ok"}

        if control:
            guardar_conversacion(from_number, mensaje, None, "texto", nombre_contacto)
            return {"status": "ok"}

        mensajes = historial + [{"role": "user", "content": mensaje}]
        respuesta_claude = llamar_claude(mensajes, sistema)
        texto_guardado = procesar_y_enviar_respuesta(from_number, respuesta_claude)
        guardar_conversacion(from_number, mensaje, respuesta_claude, "texto", nombre_contacto)
        return {"status": "ok"}

    except Exception:
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
        # Solo los campos necesarios para la lista + límite 300 mensajes recientes
        conversaciones = supabase_get(
            "conversaciones_whatsapp"
            "?order=created_at.desc"
            "&limit=300"
            "&select=telefono,nombre_contacto,created_at,leido,mensaje,tipo"
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
        control = supabase_get("chats_control?select=telefono,en_control,agente,etiqueta")
        for c in control:
            if c['telefono'] in chats:
                chats[c['telefono']]['en_control'] = c.get('en_control', False)
                chats[c['telefono']]['agente'] = c.get('agente')
                chats[c['telefono']]['etiqueta'] = c.get('etiqueta', 'sin_etiqueta')
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
        if not mensaje:
            return JSONResponse(status_code=400, content={"error": "Mensaje vacio"})
        enviar_whatsapp_texto(telefono, mensaje)
        supabase_post("conversaciones_whatsapp", {
            "telefono": telefono,
            "mensaje": f"[{agente}]: {mensaje}",
            "respuesta": None,
            "tipo": "manual",
            "leido": True
        })
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
            if imagen_url:
                components.append({"type": "header", "parameters": [{"type": "image", "image": {"link": imagen_url}}]})

            body_params = []
            if body_vars_count > 0:
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
    if not telefono or not plantilla:
        return resultado

    tel = telefono.replace("+", "").replace(" ", "").replace("-", "")
    if not tel.startswith("52"):
        tel = "52" + tel

    body_msg = {
        "messaging_product": "whatsapp",
        "to": tel,
        "type": "template",
        "template": {"name": plantilla, "language": {"code": idioma}, "components": []}
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
