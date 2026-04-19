from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from database import supabase_get
import urllib.request
import json
import os

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

def get_api_key():
    return os.environ.get("ANTHROPIC_API_KEY", "")

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

@router.post("/mensaje")
async def procesar_mensaje(datos: dict):
    try:
        mensaje = datos.get("mensaje", "")
        historial = datos.get("historial", [])
        
        # Obtener contexto del negocio
        productos = supabase_get("productos?activo=eq.true&select=nombre,precio_menudeo,precio_mayoreo3,precio_mayoreo6,precio_corrida,categoria,nuevo,corrida_activa,tallas_disponibles")
        
        # Construir lista de productos para el contexto
        catalogo = ""
        for p in productos[:30]:
            catalogo += f"- {p['nombre']}: menudeo ${p['precio_menudeo']}"
            if p.get('precio_mayoreo3'):
                catalogo += f", mayoreo 3+ ${p['precio_mayoreo3']}"
            if p.get('precio_mayoreo6'):
                catalogo += f", mayoreo 6+ ${p['precio_mayoreo6']}"
            if p.get('precio_corrida') and p.get('corrida_activa'):
                catalogo += f", corrida ${p['precio_corrida']}"
            if p.get('nuevo'):
                catalogo += " ⭐NUEVO"
            catalogo += f" | Categoría: {p.get('categoria','')}"
            if p.get('tallas_disponibles'):
                catalogo += f" | Tallas: {', '.join(p['tallas_disponibles'])}"
            catalogo += "\n"

        sistema = f"""Eres el asistente virtual de Zapatillas May, una tienda de calzado para dama ubicada en León, Guanajuato, México.

Tu personalidad es amable, profesional y conocedora de moda. Usas emojis ocasionalmente para ser más cercana.

CATÁLOGO ACTUAL:
{catalogo}

PRECIOS Y TIPOS DE VENTA:
- Menudeo: precio normal por par
- Mayoreo variado 3-5 pares: precio mayoreo 3
- Mayoreo variado 6+ pares: precio mayoreo 6  
- Corrida completa (mismo modelo, tallas surtidas): precio corrida, aplica descuento de ~$110 por par vs menudeo

POLÍTICAS:
- Envíos a todo México
- Aceptamos efectivo, tarjeta, transferencia y SPEI
- Para pedidos mayoreo pueden apartar con anticipo
- Ver catálogo completo en: https://zapatillasmay.mx
- Nuevos modelos en: https://zapatillasmay.mx/#nuevos

INSTRUCCIONES:
- Responde siempre en español
- Sé concisa pero completa
- Si preguntan por un modelo específico da precio y tallas disponibles
- Si quieren hacer un pedido pídeles nombre, modelo, talla, color y dirección de entrega
- Si preguntan por mayoreo explica los tipos de precio
- Nunca inventes información que no tengas
- Si no sabes algo di que lo verificarás con el equipo
- Respuestas cortas para WhatsApp (máximo 3-4 párrafos)"""

        # Construir historial de mensajes
        mensajes = historial + [{"role": "user", "content": mensaje}]
        
        respuesta = llamar_claude(mensajes, sistema)
        
        return {
            "respuesta": respuesta,
            "ok": True
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/autoresponder")
async def autoresponder_webhook(datos: dict):
    try:
        print(f"DATOS RECIBIDOS: {json.dumps(datos)}")
        # AutoResponder manda el mensaje dentro de query.message
        query = datos.get("query", {})
        mensaje = query.get("message", "")
        sender = query.get("sender", "Cliente")
        
        if not mensaje:
            return {"replies": [{"message": "Hola! ¿En qué te puedo ayudar? 👠"}]}

        productos = supabase_get("productos?activo=eq.true&select=nombre,precio_menudeo,precio_mayoreo3,precio_mayoreo6,precio_corrida,categoria,nuevo,corrida_activa,tallas_disponibles")
        
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
                catalogo += " ⭐NUEVO"
            if p.get('tallas_disponibles'):
                catalogo += f" | Tallas: {', '.join(p['tallas_disponibles'])}"
            catalogo += "\n"

        sistema = f"""Eres el asistente virtual de Zapatillas May, tienda de calzado para dama en León, Guanajuato, México.

Eres amable, profesional y usas emojis ocasionalmente. Respondes POR WHATSAPP así que tus respuestas deben ser cortas y directas.

CATÁLOGO ACTUAL:
{catalogo if catalogo else "Catálogo en actualización, consultar con el equipo"}

PRECIOS:
- Menudeo: 1-2 pares precio normal
- Mayoreo 3-5 pares variados: precio mayoreo 3
- Mayoreo 6+ pares variados: mejor precio
- Corrida completa mismo modelo tallas surtidas: precio especial

VER CATÁLOGO COMPLETO: https://zapatillasmay.mx
NUEVOS MODELOS: https://zapatillasmay.mx/#nuevos

REGLAS IMPORTANTES:
- Respuestas cortas para WhatsApp (máximo 150 palabras)
- Si preguntan precio da el precio exacto del catálogo
- Si quieren hacer un pedido solicita: modelo, talla, color, nombre y dirección
- Si preguntan por mayoreo explica los tipos de precio
- Nunca inventes información que no tengas
- Si no sabes algo di que lo verificarás con el equipo
- Saluda con el nombre del cliente si lo tienes"""

        respuesta = llamar_claude(
            [{"role": "user", "content": f"{sender} dice: {mensaje}"}],
            sistema
        )
        
        # AutoResponder espera replies como array
        return {"replies": [{"message": respuesta}]}
        
    except Exception as e:
        print(f"ERROR CHATBOT: {str(e)}")
        return {"replies": [{"message": f"Error: {str(e)}"}]}

@router.get("/whatsapp")
async def verificar_webhook(request: Request):
    from fastapi import Request
    params = dict(request.query_params)
    mode = params.get("hub.mode")
    token = params.get("hub.verify_token")
    challenge = params.get("hub.challenge")
    
    if mode == "subscribe" and token == "zapatillasmay2024":
        return int(challenge)
    return JSONResponse(status_code=403, content={"error": "Token inválido"})

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
        
        if tipo == "text":
            mensaje = mensaje_data.get("text", {}).get("body", "")
        elif tipo == "audio":
            mensaje = "[Audio recibido — por favor escribe tu mensaje]"
        elif tipo == "image":
    try:
        image_id = mensaje_data.get("image", {}).get("id", "")
        wa_token = os.environ.get("WHATSAPP_TOKEN", "")
        
        # Obtener URL de la imagen
        img_url_req = urllib.request.Request(
            f"https://graph.facebook.com/v18.0/{image_id}",
            headers={"Authorization": f"Bearer {wa_token}"}
        )
        with urllib.request.urlopen(img_url_req) as r:
            img_data = json.loads(r.read())
        img_url = img_data.get("url", "")
        
        # Descargar la imagen
        img_req = urllib.request.Request(
            img_url,
            headers={"Authorization": f"Bearer {wa_token}"}
        )
        with urllib.request.urlopen(img_req) as r:
            img_bytes = r.read()
        
        import base64
        img_b64 = base64.b64encode(img_bytes).decode("utf-8")
        
        # Llamar a Claude con la imagen
        productos = supabase_get("productos?activo=eq.true&select=nombre,precio_menudeo,precio_mayoreo3,precio_mayoreo6,precio_corrida,categoria,nuevo,corrida_activa,tallas_disponibles")
        catalogo = construir_catalogo(productos)
        sistema = construir_sistema(catalogo)
        
        respuesta = llamar_claude_con_imagen(img_b64, sistema)
        
        wa_token2 = os.environ.get("WHATSAPP_TOKEN", "")
        phone_id = os.environ.get("WHATSAPP_PHONE_ID", "")
        if wa_token2 and phone_id:
            url = f"https://graph.facebook.com/v18.0/{phone_id}/messages"
            headers = {
                "Authorization": f"Bearer {wa_token2}",
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
        return {"status": "ok"}
    except Exception as e:
        print(f"ERROR IMAGEN: {str(e)}")
        mensaje = "El cliente mando una foto pero no pude verla, preguntale que modelo le interesa"

        else:
            mensaje = f"[Mensaje tipo {tipo}]"
        
        if not mensaje:
            return {"status": "ok"}
            
        productos = supabase_get("productos?activo=eq.true&select=nombre,precio_menudeo,precio_mayoreo3,precio_mayoreo6,precio_corrida,categoria,nuevo,corrida_activa,tallas_disponibles")
        
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
                catalogo += " ⭐NUEVO"
            catalogo += "\n"

        sistema = f"""Eres el asistente virtual de Zapatillas May, tienda de calzado para dama en León, Guanajuato, México.
Eres amable, profesional y usas emojis ocasionalmente. Respondes POR WHATSAPP — respuestas cortas y directas.

CATÁLOGO:
{catalogo if catalogo else "Catálogo en actualización"}

PRECIOS:
- Menudeo: precio normal por par
- Mayoreo 3-5 pares variados: precio mayoreo
- Mayoreo 6+ pares variados: mejor precio
- Corrida completa mismo modelo: precio especial

VER CATÁLOGO: https://zapatillasmay.mx
NUEVOS MODELOS: https://zapatillasmay.mx/#nuevos

REGLAS:
- Máximo 150 palabras por respuesta
- Si piden precio da el precio exacto
- Si quieren pedir solicita: modelo, talla, color, nombre y dirección
- Nunca inventes información"""

        respuesta = llamar_claude(
            [{"role": "user", "content": mensaje}],
            sistema
        )
        
        # Enviar respuesta por WhatsApp API
        wa_token = os.environ.get("WHATSAPP_TOKEN", "")
        phone_id = os.environ.get("WHATSAPP_PHONE_ID", "")
        
        if wa_token and phone_id:
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
        
        return {"status": "ok"}
        
    except Exception as e:
        print(f"ERROR WHATSAPP: {str(e)}")
        return {"status": "ok"} 
          