from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from database import supabase_get
import urllib.request
import json
import os
import base64
import re

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

def get_api_key():
    return os.environ.get("ANTHROPIC_API_KEY", "")

def construir_catalogo(productos):
    catalogo = ""
    for p in productos[:40]:
        catalogo += f"- {p['nombre']}"
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
            catalogo += " NUEVO"
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
- Enviamos en 24hrs después de confirmar pago (excepto sábados 1pm+ y domingos)
- Cambios: el retorno de paquetería corre por cuenta del comprador

CATÁLOGO ACTUAL:
{catalogo if catalogo else "Catálogo en actualización"}

=== CÓMO RESPONDER ===
Habla como vendedora mexicana amigable y natural. Máximo 3-4 líneas por mensaje.

CUANDO PREGUNTEN POR CALZADO (sandalias, tacones, botas, etc.):
- Responde SÍ mencionando 1-2 modelos con precio
- Si el modelo tiene [IMG:url] en el catálogo, DEBES incluir la foto así:
  ENVIAR_FOTO:[url_exacta_del_IMG]
- Ejemplo: "Sí amiga! El MA302 está a $365 👠 ENVIAR_FOTO:[https://url.jpg] ¿Te gusta?"
- Copia la URL EXACTA del [IMG:...], no la modifiques

CUANDO NO HAY FOTO:
- Si el producto NO tiene [IMG:url], no pongas ENVIAR_FOTO

PROCESO DE PEDIDO:
- Necesitas: modelo + talla + color + nombre completo + dirección
- Si el cliente pide hablar con asesor: responde "Con gusto te comunico con una asesora, espera un momento 😊" y no respondas más

REGLAS:
- Nunca inventes precios ni modelos que no estén en el catálogo
- Nunca como primera respuesta mandes SOLO el link al sitio, primero muestra productos
- Sé natural y diferente en cada mensaje, no repitas siempre el mismo texto
- Responde siempre en español"""

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

def procesar_y_enviar_respuesta(from_number, respuesta_claude):
    """Extrae marcadores ENVIAR_FOTO:[url] y envía texto + imágenes separados"""
    partes = re.split(r'ENVIAR_FOTO:(\S+)', respuesta_claude)
    
    texto_final = ""
    fotos = []
    
    for i, parte in enumerate(partes):
        if i % 2 == 0:
            t = parte.strip()
            if t:
                texto_final += t + " "
        else:
            # Limpiar corchetes y puntuación del URL
            url_foto = parte.strip().strip('[]').rstrip('.,;)')
            if url_foto.startswith('http'):
                fotos.append(url_foto)
    
    texto_final = texto_final.strip()
    
    if texto_final:
        enviar_whatsapp_texto(from_number, texto_final)
    
    for url in fotos[:2]:
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
    except Exception as e:
        print(f"ERROR guardando: {str(e)}")

def enviar_whatsapp(from_number, respuesta):
    enviar_whatsapp_texto(from_number, respuesta)

def cargar_catalogo():
    return supabase_get("productos?activo=eq.true&select=nombre,precio_menudeo,precio_mayoreo3,precio_mayoreo6,precio_corrida,categoria,nuevo,corrida_activa,tallas_disponibles,imagen_principal")

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

    except Exception as e:
        print(f"ERROR WHATSAPP: {str(e)}")
        return {"status": "ok"}

@router.get("/whatsapp")
async def verificar_webhook(request: Request):
    params = dict(request.query_params)
    mode = params.get("hub.mode")
    token = params.get("hub.verify_token")
    challenge = params.get("hub.challenge")
    if mode == "subscribe" and token == "zapatillasmay2024":
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
    try:
        conversaciones = supabase_get("conversaciones_whatsapp?order=created_at.desc")
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
        control = supabase_get("chats_control")
        for c in control:
            if c['telefono'] in chats:
                chats[c['telefono']]['en_control'] = c.get('en_control', False)
                chats[c['telefono']]['agente'] = c.get('agente')
                chats[c['telefono']]['etiqueta'] = c.get('etiqueta', 'sin_etiqueta')
        return list(chats.values())
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
            return JSONResponse(status_code=500, content={"error": "Token no configurado"})
        plantilla = datos.get("plantilla", "catalogo_completo")
        contactos = datos.get("contactos", [])
        imagen_url = datos.get("imagen_url", "")
        enviados = 0
        fallidos = 0
        errores = []
        for contacto in contactos:
            try:
                telefono = contacto.get("telefono", "")
                nombre = contacto.get("nombre", "Cliente")
                if not telefono:
                    continue
                tel = telefono.replace("+", "").replace(" ", "").replace("-", "")
                if not tel.startswith("52"):
                    tel = "52" + tel
                components = []
                if imagen_url:
                    components.append({"type": "header", "parameters": [{"type": "image", "image": {"link": imagen_url}}]})
                if plantilla in ["catalogo_completo"]:
                    nombre_limpio = (nombre or "Cliente").strip() or "Cliente"
                    components.append({"type": "body", "parameters": [{"type": "text", "parameter_name": "customer_name", "text": nombre_limpio}]})
                idiomas = {"catalogo_completo": "en", "nuevos_modelos": "es_MX", "hello_world": "en_US"}
                idioma = idiomas.get(plantilla, "es_MX")
                body_msg = {"messaging_product": "whatsapp", "to": tel, "type": "template", "template": {"name": plantilla, "language": {"code": idioma}, "components": components}}
                url = f"https://graph.facebook.com/v25.0/{phone_id}/messages"
                headers = {"Authorization": f"Bearer {wa_token}", "Content-Type": "application/json"}
                body = json.dumps(body_msg).encode("utf-8")
                req = urllib.request.Request(url, data=body, headers=headers, method="POST")
                try:
                    with urllib.request.urlopen(req) as resp:
                        enviados += 1
                except urllib.error.HTTPError as http_e:
                    error_body = http_e.read().decode()
                    fallidos += 1
                    errores.append(f"{telefono}: HTTP {http_e.code} - {error_body}")
                except Exception as inner_e:
                    fallidos += 1
                    errores.append(f"{telefono}: {str(inner_e)}")
            except Exception as e:
                fallidos += 1
                errores.append(f"{telefono}: {str(e)}")
        return {"ok": True, "enviados": enviados, "fallidos": fallidos, "errores": errores}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/plantillas")
async def listar_plantillas():
    try:
        wa_token = os.environ.get("WHATSAPP_TOKEN", "")
        waba_id = os.environ.get("WHATSAPP_WABA_ID", "")
        if not waba_id:
            return [{"name": "catalogo_completo", "status": "APPROVED"}, {"name": "nuevos_modelos", "status": "APPROVED"}]
        url = f"https://graph.facebook.com/v25.0/{waba_id}/message_templates?status=APPROVED"
        req = urllib.request.Request(url, headers={"Authorization": f"Bearer {wa_token}"})
        with urllib.request.urlopen(req) as r:
            data = json.loads(r.read())
        return data.get("data", [])
    except:
        return [{"name": "catalogo_completo", "status": "APPROVED"}, {"name": "nuevos_modelos", "status": "APPROVED"}]

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
    
@router.get("/catalogo-info")
async def catalogo_info():
    import httpx
    headers = {"Authorization": f"Bearer {os.getenv('WHATSAPP_TOKEN')}"}
    waba_id = os.getenv('WHATSAPP_WABA_ID')
    async with httpx.AsyncClient() as client:
        res = await client.get(f"https://graph.facebook.com/v19.0/{waba_id}/product_catalogs", headers=headers)
        return res.json()
