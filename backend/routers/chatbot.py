from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from database import supabase_get
import urllib.request
import json
import os
import base64

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

def get_api_key():
    return os.environ.get("ANTHROPIC_API_KEY", "")

def construir_catalogo(productos):
    catalogo = ""
    for p in productos[:30]:
        catalogo += f"- {p['nombre']}: menudeo ${p['precio_menudeo']}"
        if p.get('precio_mayoreo3'):
            catalogo += f", mayoreo 3-5 pares ${p['precio_mayoreo3']}"
        if p.get('precio_mayoreo6'):
            catalogo += f", mayoreo 6+ ${p['precio_mayoreo6']}"
        if p.get('precio_corrida') and p.get('corrida_activa'):
            catalogo += f", corrida ${p['precio_corrida']}"
        if p.get('nuevo'):
            catalogo += " NUEVO"
        if p.get('tallas_disponibles'):
            catalogo += f" | Tallas: {', '.join(p['tallas_disponibles'])}"
        catalogo += "\n"
    return catalogo

def construir_sistema(catalogo):
    return f"""Eres el asistente virtual de Zapatillas May, tienda de calzado para dama en Leon, Guanajuato, Mexico.
Eres amable, profesional y usas emojis ocasionalmente. Respondes POR WHATSAPP - respuestas cortas y directas.

CATALOGO:
{catalogo if catalogo else "Catalogo en actualizacion"}

PRECIOS:
- Menudeo: precio normal por par
- Mayoreo 3-5 pares variados: precio mayoreo
- Mayoreo 6+ pares variados: mejor precio
- Corrida completa mismo modelo: precio especial

VER CATALOGO: https://zapatillasmay.mx
NUEVOS MODELOS: https://zapatillasmay.mx/#nuevos

REGLAS:
- Maximo 150 palabras por respuesta
- Si piden precio da el precio exacto
- Si quieren pedir solicita: modelo, talla, color, nombre y direccion
- Nunca inventes informacion"""

def llamar_claude(mensajes, sistema):
    url = "https://api.anthropic.com/v1/messages"
    headers = {
        "x-api-key": get_api_key(),
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }
    body = json.dumps({
        "model": "claude-sonnet-4-6",
        "max_tokens": 1024,
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

def llamar_claude_con_imagen(img_b64, sistema):
    url = "https://api.anthropic.com/v1/messages"
    headers = {
        "x-api-key": get_api_key(),
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }
    body = json.dumps({
        "model": "claude-sonnet-4-6",
        "max_tokens": 1024,
        "system": sistema,
        "messages": [{
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/jpeg",
                        "data": img_b64
                    }
                },
                {
                    "type": "text",
                    "text": "El cliente mando esta foto. Describe que tipo de calzado es y si tenemos algo similar en nuestro catalogo. Si no reconoces el estilo preguntale que tipo de calzado busca."
                }
            ]
        }]
    }).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read())
            return data["content"][0]["text"]
    except urllib.error.HTTPError as e:
        error = e.read().decode()
        raise Exception(f"Claude API error: {error}")

def enviar_whatsapp(from_number, respuesta):
    wa_token = os.environ.get("WHATSAPP_TOKEN", "")
    phone_id = os.environ.get("WHATSAPP_PHONE_ID", "")
    if not wa_token or not phone_id:
        return
    url = f"https://graph.facebook.com/v25.0/{phone_id}/messages"
    headers = {
        "Authorization": f"Bearer {wa_token}",
        "Content-Type": "application/json"
    }
    body = json.dumps({
        "messaging_product": "whatsapp",
        "to": from_number,
        "type": "text",
        "text": {"body": respuesta}
    }).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    urllib.request.urlopen(req)

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
        print(f"ERROR guardando conversacion: {str(e)}")

@router.post("/mensaje")
async def procesar_mensaje(datos: dict):
    try:
        mensaje = datos.get("mensaje", "")
        historial = datos.get("historial", [])
        productos = supabase_get("productos?activo=eq.true&select=nombre,precio_menudeo,precio_mayoreo3,precio_mayoreo6,precio_corrida,categoria,nuevo,corrida_activa,tallas_disponibles")
        catalogo = construir_catalogo(productos)
        sistema = construir_sistema(catalogo)
        mensajes = historial + [{"role": "user", "content": mensaje}]
        respuesta = llamar_claude(mensajes, sistema)
        return {"respuesta": respuesta, "ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/autoresponder")
async def autoresponder_webhook(datos: dict):
    try:
        print(f"DATOS RECIBIDOS: {json.dumps(datos)}")
        query = datos.get("query", {})
        mensaje = query.get("message", "")
        sender = query.get("sender", "Cliente")
        if not mensaje:
            return {"replies": [{"message": "Hola! En que te puedo ayudar? 👠"}]}
        if mensaje in ["Foto", "Image", "foto", "photo", "imagen"]:
            return {"replies": [{"message": "Vi que mandaste una foto! Dime que modelo te interesa o visita: https://zapatillasmay.mx"}]}
        productos = supabase_get("productos?activo=eq.true&select=nombre,precio_menudeo,precio_mayoreo3,precio_mayoreo6,precio_corrida,categoria,nuevo,corrida_activa,tallas_disponibles")
        catalogo = construir_catalogo(productos)
        sistema = construir_sistema(catalogo)
        respuesta = llamar_claude(
            [{"role": "user", "content": f"{sender} dice: {mensaje}"}],
            sistema
        )
        return {"replies": [{"message": respuesta}]}
    except Exception as e:
        print(f"ERROR CHATBOT: {str(e)}")
        return {"replies": [{"message": f"Error: {str(e)}"}]}

@router.get("/whatsapp")
async def verificar_webhook(request: Request):
    params = dict(request.query_params)
    mode = params.get("hub.mode")
    token = params.get("hub.verify_token")
    challenge = params.get("hub.challenge")
    if mode == "subscribe" and token == "zapatillasmay2024":
        return int(challenge)
    return JSONResponse(status_code=403, content={"error": "Token invalido"})

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

        if tipo == "image":
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
                img_req = urllib.request.Request(
                    img_url,
                    headers={"Authorization": f"Bearer {wa_token}"}
                )
                with urllib.request.urlopen(img_req) as r:
                    img_bytes = r.read()
                img_b64 = base64.b64encode(img_bytes).decode("utf-8")
                productos = supabase_get("productos?activo=eq.true&select=nombre,precio_menudeo,precio_mayoreo3,precio_mayoreo6,precio_corrida,categoria,nuevo,corrida_activa,tallas_disponibles")
                catalogo = construir_catalogo(productos)
                sistema = construir_sistema(catalogo)
                respuesta = llamar_claude_con_imagen(img_b64, sistema)
                enviar_whatsapp(from_number, respuesta)
                guardar_conversacion(from_number, "[Imagen]", respuesta, "imagen", nombre_contacto)
                return {"status": "ok"}
            except Exception as e:
                print(f"ERROR IMAGEN: {str(e)}")
                enviar_whatsapp(from_number, "Vi que mandaste una foto pero no pude verla. Por favor dime que modelo te interesa o visita https://zapatillasmay.mx")
                return {"status": "ok"}

        if tipo == "text":
            mensaje = mensaje_data.get("text", {}).get("body", "")
        elif tipo == "audio":
            mensaje = "El cliente mando un audio, pidele amablemente que escriba su mensaje"
        else:
            mensaje = f"Mensaje tipo {tipo} recibido"

        if not mensaje:
            return {"status": "ok"}

        control = supabase_get(f"chats_control?telefono=eq.{from_number}&en_control=eq.true")
        if control:
            guardar_conversacion(from_number, mensaje, None, "texto", nombre_contacto)
            return {"status": "ok"}

        productos = supabase_get("productos?activo=eq.true&select=nombre,precio_menudeo,precio_mayoreo3,precio_mayoreo6,precio_corrida,categoria,nuevo,corrida_activa,tallas_disponibles")
        catalogo = construir_catalogo(productos)
        sistema = construir_sistema(catalogo)
        respuesta = llamar_claude(
            [{"role": "user", "content": mensaje}],
            sistema
        )
        enviar_whatsapp(from_number, respuesta)
        guardar_conversacion(from_number, mensaje, respuesta, "texto", nombre_contacto)
        return {"status": "ok"}

    except Exception as e:
        print(f"ERROR WHATSAPP: {str(e)}")
        return {"status": "ok"}

@router.get("/conversaciones")
async def listar_conversaciones():
    try:
        return supabase_get("conversaciones_whatsapp?order=created_at.desc&limit=100")
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
                    "agente": None
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
            chats[tel]['mensajes'].append(m)
            if not m.get('leido'):
                chats[tel]['no_leidos'] += 1
        control = supabase_get("chats_control")
        for c in control:
            if c['telefono'] in chats:
                chats[c['telefono']]['en_control'] = c.get('en_control', False)
                chats[c['telefono']]['agente'] = c.get('agente')
                chats[c['telefono']]['etiqueta'] = c.get('etiqueta', 'sin_etiqueta')
        return list(chats.values())
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
        enviar_whatsapp(telefono, mensaje)
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
        wa_token = os.environ.get("WHATSAPP_TOKEN", "")
        phone_id = os.environ.get("WHATSAPP_PHONE_ID", "")
        if not wa_token or not phone_id:
            return JSONResponse(status_code=500, content={"error": "Token no configurado"})
        url = f"https://graph.facebook.com/v25.0/{phone_id}/messages"
        headers = {"Authorization": f"Bearer {wa_token}", "Content-Type": "application/json"}
        body = json.dumps({
            "messaging_product": "whatsapp",
            "to": telefono,
            "type": "image",
            "image": {"link": imagen_url, "caption": caption}
        }).encode("utf-8")
        req = urllib.request.Request(url, data=body, headers=headers, method="POST")
        urllib.request.urlopen(req)
        supabase_post("conversaciones_whatsapp", {
            "telefono": telefono,
            "mensaje": f"[{agente}]: [Imagen] {caption}",
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
        resultado = {c['clave']: c['valor'] for c in config}
        return resultado
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

                # Limpiar teléfono
                tel = telefono.replace("+", "").replace(" ", "").replace("-", "")
                if not tel.startswith("52"):
                    tel = "52" + tel

                # Construir componentes dinamicamente
                components = []
                if imagen_url:
                    components.append({
                        "type": "header",
                        "parameters": [{"type": "image", "image": {"link": imagen_url}}]
                    })
                # Plantillas con variable de nombre
                plantillas_con_nombre = ["catalogo_completo"]
                tiene_nombre = plantilla in plantillas_con_nombre
                if tiene_nombre:
                    nombre_limpio = (nombre or "Cliente").strip() or "Cliente"
                    components.append({
                        "type": "body",
                        "parameters": [{
                            "type": "text",
                            "parameter_name": "customer_name",
                            "text": nombre_limpio
                        }]
                    })

                # Idioma por plantilla
                idiomas = {
                    "catalogo_completo": "en",
                    "nuevos_modelos": "es_MX",
                    "hello_world": "en_US"
                }
                idioma = idiomas.get(plantilla, "es_MX")

                body_msg = {
                    "messaging_product": "whatsapp",
                    "to": tel,
                    "type": "template",
                    "template": {
                        "name": plantilla,
                        "language": {"code": idioma},
                        "components": components
                    }
                }

                url = f"https://graph.facebook.com/v25.0/{phone_id}/messages"
                headers = {
                    "Authorization": f"Bearer {wa_token}",
                    "Content-Type": "application/json"
                }
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

        return {
            "ok": True,
            "enviados": enviados,
            "fallidos": fallidos,
            "errores": errores
        }
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
    except Exception as e:
        return [{"name": "catalogo_completo", "status": "APPROVED"}, {"name": "nuevos_modelos", "status": "APPROVED"}]
