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
Eres amable, profesional y usas emojis ocasionalmente. Respondes POR WHATSAPP — respuestas cortas y directas.

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
    url = f"https://graph.facebook.com/v18.0/{phone_id}/messages"
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

def guardar_conversacion(telefono, mensaje, respuesta, tipo="texto"):
    try:
        from database import supabase_post
        supabase_post("conversaciones_whatsapp", {
            "telefono": telefono,
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
            return {"replies": [{"message": "Vi que mandaste una foto! 📸\n\nPor favor dime que modelo te interesa o visita:\n👠 https://zapatillasmay.mx"}]}

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

        if tipo == "image":
            try:
                image_id = mensaje_data.get("image", {}).get("id", "")
                wa_token = os.environ.get("WHATSAPP_TOKEN", "")
                img_url_req = urllib.request.Request(
                    f"https://graph.facebook.com/v18.0/{image_id}",
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
                guardar_conversacion(from_number, "[Imagen]", respuesta, "imagen")
                return {"status": "ok"}
            except Exception as e:
                print(f"ERROR IMAGEN: {str(e)}")
                enviar_whatsapp(from_number, "Vi que mandaste una foto pero no pude verla. Por favor dime que modelo te interesa o visita https://zapatillasmay.mx 👠")
                return {"status": "ok"}

        if tipo == "text":
            mensaje = mensaje_data.get("text", {}).get("body", "")
        elif tipo == "audio":
            mensaje = "El cliente mando un audio, pidele amablemente que escriba su mensaje"
        else:
            mensaje = f"Mensaje tipo {tipo} recibido"

        if not mensaje:
            return {"status": "ok"}

        productos = supabase_get("productos?activo=eq.true&select=nombre,precio_menudeo,precio_mayoreo3,precio_mayoreo6,precio_corrida,categoria,nuevo,corrida_activa,tallas_disponibles")
        catalogo = construir_catalogo(productos)
        sistema = construir_sistema(catalogo)
        respuesta = llamar_claude(
            [{"role": "user", "content": mensaje}],
            sistema
        )
        enviar_whatsapp(from_number, respuesta)
        guardar_conversacion(from_number, mensaje, respuesta, "texto")
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
