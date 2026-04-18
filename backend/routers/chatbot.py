from fastapi import APIRouter
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
        "model": "claude-sonnet-4-20250514",
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