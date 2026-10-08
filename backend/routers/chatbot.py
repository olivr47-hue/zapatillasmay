from fastapi import APIRouter, Request, UploadFile, File, Form
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_get_all, supabase_post, supabase_patch, supabase_delete
from telefonos import a_e164_mx
from cache import cache_get, cache_set, cache_invalidate, TTL_STOCK
from security import limpiar_texto
import urllib.request
import urllib.parse
import contextvars

# wamid del mensaje entrante que se está procesando: lo consume la primera fila que se guarda (para poder responderle citándolo)
_WAMID_ENTRANTE = contextvars.ContextVar("wamid_entrante", default="")
import json
import os
import time
import base64
import hmac
import hashlib
import re
import mercadopago

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

def get_api_key():
    return os.environ.get("ANTHROPIC_API_KEY", "")

def precios_web(p) -> dict:
    """Precios públicos vigentes del SITIO para un producto: menudeo = precio de panel + $80
    (salvo ofertas); desde 3 pares el sitio descuenta $60 por par (y $100 desde 6, según las
    páginas SEO). Es lo que Maya cotiza a cualquier persona."""
    try:
        pm = float(p.get("precio_menudeo") or 0)
    except (TypeError, ValueError):
        pm = 0.0
    oferta = bool(p.get("es_oferta"))
    menudeo = pm if oferta else round(pm + 80)
    return {
        "menudeo": menudeo,
        "mayoreo3": menudeo if oferta else menudeo - 60,
        "mayoreo6": menudeo if oferta else menudeo - 100,
    }


def precios_portal(p) -> dict:
    """Precios del PORTAL MAYORISTA (mismos que calcula portal-cliente.js): tiers capturados en el
    panel, o menudeo-$30 / -$70 / -$100 de respaldo cuando no están capturados."""
    def _f(k):
        try:
            v = float(p.get(k))
            return v if v > 0 else None
        except (TypeError, ValueError):
            return None
    base = _f("precio_menudeo") or 0.0
    return {
        "mayoreo3": _f("precio_mayoreo3") or max(0.0, base - 30),
        "mayoreo6": _f("precio_mayoreo6") or max(0.0, base - 70),
        "corrida":  _f("precio_corrida") or max(0.0, base - 100),
    }


def _tel10(t) -> str:
    return "".join(c for c in str(t or "") if c.isdigit())[-10:]


def es_mayorista_registrado(telefono) -> bool:
    """True si el número de WhatsApp pertenece a un cliente activo tipo mayoreo/zapatería (los que
    pueden entrar al portal mayorista). Esos clientes reciben precios de PORTAL; todos los demás,
    precios del sitio."""
    tel = _tel10(telefono)
    if len(tel) < 10:
        return False
    nums = cache_get("wa_mayoristas_tel")
    if nums is None:
        try:
            filas = supabase_get_all("clientes?tipo=in.(mayoreo,zapateria)&activo=eq.true&select=telefono")
        except Exception as e:
            print(f"[maya] no se pudo consultar mayoristas: {e}")
            return False
        nums = {_tel10(c.get("telefono")) for c in filas if _tel10(c.get("telefono"))}
        cache_set("wa_mayoristas_tel", nums, ttl=300)
    return tel in nums


def construir_catalogo(productos, mayorista=False):
    catalogo = ""
    for p in productos:
        sku = p.get('sku_interno') or p.get('id','')
        catalogo += f"- [SKU:{sku}] {p['nombre']}"
        if p.get('imagen_principal'):
            catalogo += f" [IMG:{p['imagen_principal']}]"
        _pw = precios_web(p)
        catalogo += f": menudeo ${_pw['menudeo']:.0f}"
        if not p.get('es_oferta'):
            if mayorista:
                # Cliente mayorista REGISTRADA: precios del portal
                _pp = precios_portal(p)
                catalogo += f", mayoreo 3-5pares ${_pp['mayoreo3']:.0f}, mayoreo 6+ ${_pp['mayoreo6']:.0f}"
                if p.get('corrida_activa') or p.get('precio_corrida'):
                    catalogo += f", corrida ${_pp['corrida']:.0f}"
            else:
                # Cualquier otra persona: solo el precio del sitio (desde 3 pares el sitio descuenta solo)
                catalogo += f", 3+ pares ${_pw['mayoreo3']:.0f}"
        if p.get('nuevo'):
            catalogo += " 🆕NUEVO"
        if p.get('categoria'):
            catalogo += f" [{p['categoria']}]"
        if p.get('tallas_disponibles'):
            catalogo += f" | Tallas: {', '.join(p['tallas_disponibles'])}"
        catalogo += "\n"
    return catalogo

def obtener_pedidos_cliente(telefono: str) -> list:
    """Busca los pedidos recientes del cliente por teléfono para dárselos a Maya."""
    try:
        tel = telefono.replace("+", "").strip()
        tel_sin = tel[2:] if tel.startswith("52") else tel
        tel_con = "52" + tel_sin
        pedidos = supabase_get(
            f"pedidos?telefono_cliente=in.({tel_con},{tel_sin})"
            f"&status=neq.cancelado&order=created_at.desc&limit=5"
            f"&select=id,created_at,status,total,notas,direccion_envio,numero_guia,paqueteria,tracking_url,forma_pago"
        )
        return pedidos if pedidos else []
    except Exception as e:
        print(f"[pedidos-cliente] Error: {e}")
        return []

def _resumir_pedidos(pedidos: list) -> str:
    if not pedidos:
        return ""
    status_map = {
        'pagado':           'Pagado — preparando envío',
        'enviado':          'Enviado',
        'entregado':        'Entregado',
        'checkout_iniciado':'En proceso de pago',
        'pendiente_pago':   'Pendiente de pago (SPEI/OXXO)',
        'confirmado':       'Confirmado',
        'cancelado':        'Cancelado',
    }
    lineas = []
    for p in pedidos:
        st = status_map.get(p.get('status', ''), p.get('status', ''))
        total = p.get('total', 0)
        direccion = p.get('direccion_envio', '')
        guia = p.get('numero_guia', '')
        paq  = p.get('paqueteria', '')
        url_track = p.get('tracking_url', '')
        notas = p.get('notas', '')
        pid = str(p.get('id', ''))[:8]
        linea = f"• Pedido #{pid} | {st} | ${total:.0f} MXN"
        if direccion:
            linea += f" | Envío a: {direccion}"
        if guia and paq:
            linea += f" | Guía {paq}: {guia}"
            if url_track:
                linea += f" ({url_track})"
        elif guia:
            linea += f" | Guía: {guia}"
        if notas:
            linea += f" | Detalle: {notas}"
        lineas.append(linea)
    return "\n".join(lineas)

_PORTAL_URL = "https://portal.zapatillasmay.mx"


def _seccion_precios(mayorista: bool) -> str:
    if mayorista:
        return f"""PRECIOS Y MAYOREO (USA SIEMPRE los precios EXACTOS del catálogo — NO los calcules, NO sumes ni restes nada):
- Esta persona es CLIENTE MAYORISTA REGISTRADA en el portal: usa para ella los precios de PORTAL del catálogo.
- Menudeo (1-2 pares): precio "menudeo" del catálogo (precio del sitio web).
- Mayoreo variado 3-5 pares: precio "mayoreo 3-5pares" del catálogo (puede mezclar estilos y colores).
- Mayoreo variado 6+ pares: precio "mayoreo 6+" del catálogo.
- Corrida completa: precio "corrida" del catálogo (mismo estilo/color, tallas 23 al 26 con medios = 6 pares).
- Puedes recordarle que también puede armar su carrito y apartar sus pares en su portal: {_PORTAL_URL}
- Si un modelo no muestra precio de mayoreo/corrida en el catálogo, ofrece el de menudeo y di que confirmas el de mayoreo con una asesora."""
    return f"""PRECIOS Y MAYOREO (USA SIEMPRE los precios EXACTOS del catálogo — NO los calcules, NO sumes ni restes nada):
- Usa SIEMPRE los precios del sitio web que aparecen en el catálogo.
- Menudeo (1-2 pares): precio "menudeo" del catálogo TAL CUAL.
- Desde 3 pares (puede mezclar estilos y colores): precio "3+ pares" del catálogo. Preséntalo SIEMPRE como "descuento por comprar varios pares", NUNCA como "precio de mayoreo".
- Los precios del sitio web son precios de MENUDEO (incluso con el descuento por varios pares). Si preguntan por "precio de mayoreo", mayoreo formal, corridas, zapaterías o revendedoras: aclárale que los precios del sitio son de menudeo, NO des precios de mayoreo ni de corrida por aquí, y mándale al Portal Mayorista: {_PORTAL_URL} — ahí se registra, arma su carrito, aparta sus pares y ve sus precios de mayoreo.
- Si dice que ya está registrada en el portal pero no la reconoces, dile que una asesora le confirma sus precios en un momento."""


def construir_sistema(catalogo, pedidos_cliente=None, mayorista=False):
    seccion_pedidos = ""
    if pedidos_cliente:
        resumen = _resumir_pedidos(pedidos_cliente)
        seccion_pedidos = f"""

=== PEDIDOS DE ESTE CLIENTE ===
{resumen}

REGLAS para pedidos existentes:
- Si pregunta por su pedido, rastreo o estatus: usa ESTA información, NO vuelvas a pedir su nombre, dirección, ciudad ni CP.
- Si ya tiene guía: dísela directamente.
- Si el pedido está "Pagado — preparando envío": dile que está siendo preparado y que le llegará la guía pronto.
- Si el pedido está "Enviado" sin guía: dile que ya fue enviado y que confirmes la guía con una asesora."""

    return f"""Eres Maya, asistente de ventas de Zapatillas May en León, Guanajuato por WhatsApp.

SOBRE ZAPATILLAS MAY:
- Calzado de moda para dama: tacones, sandalias, plataformas, botas, botines y accesorios
- Hecho en México con orgullo 🇲🇽
- Enviamos a todo México, Estados Unidos y Canadá
- Llegan modelos nuevos cada semana
- Ubicación física (Bodega Cuautla): Calle Cuautla 211, Col. Killian, León, Guanajuato. Si preguntan dónde están, dónde pueden pasar a ver/recoger, o piden la ubicación: da SIEMPRE esta dirección completa, NUNCA respondas solo "León, Guanajuato"

{_seccion_precios(mayorista)}

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
  • Tu correo electrónico (para tu comprobante)
  • ¿Cómo prefieres pagar?"

PASO 5 — CERRAR PEDIDO Y GENERAR LINK DE PAGO:
Cuando tengas TODOS los datos (nombre completo + dirección + email + modelos + colores + tallas):
- Usa el marcador GENERAR_PAGO con un JSON que incluya un arreglo "items" — UN objeto por cada combinación distinta de modelo+color+talla (si el cliente pide el mismo modelo en 2 tallas o colores distintos, van 2 items separados):
  GENERAR_PAGO:{{"nombre":"NOMBRE","email":"EMAIL_CLIENTE","direccion":"DIRECCION","items":[{{"sku":"SKU_EXACTO_DEL_CATALOGO","color":"COLOR_EXACTO","talla":"TALLA","cantidad":N}}]}}
- Usa el SKU EXACTO tal como aparece en el catálogo (ej. si ves "[SKU:MA302]" entonces "sku":"MA302"). NUNCA inventes ni combines SKUs de distintos modelos en un solo item.
- NO calcules tú el precio ni el envío, y NO los menciones en el mensaje de cierre — el sistema los calcula automáticamente Y VERIFICA LA EXISTENCIA REAL en inventario en ese momento antes de generar el link. Si algún item ya no tiene existencia, el sistema te lo va a decir en el siguiente turno para que se lo informes al cliente y le ofrezcas otro color/talla — NUNCA le digas al cliente "ya está listo tu pago" antes de que el sistema confirme.
- Ejemplo 3 pares distintos: GENERAR_PAGO:{{"nombre":"Lupita García","email":"lupita@email.com","direccion":"Av. Hidalgo 123, CDMX 06600","items":[{{"sku":"EF1203","color":"Latte","talla":"23.5","cantidad":1}},{{"sku":"EF1203","color":"Negro","talla":"23.5","cantidad":1}},{{"sku":"CR3385","color":"Oro","talla":"23","cantidad":1}}]}}
- NO pongas LINK_PAGO, usa GENERAR_PAGO con el JSON
- Si el cliente quiere AGREGAR más pares a un pedido ya en proceso, incluye TODOS los items (los anteriores + los nuevos) en UN SOLO GENERAR_PAGO

=== REGLAS IMPORTANTES ===
- Habla como vendedora mexicana amigable y natural (amiga, no robot)
- Máximo 3-4 líneas por mensaje, nunca textos largos de golpe
- NUNCA inventes precios ni modelos fuera del catálogo
- NUNCA mandes el link del sitio como primera respuesta, primero muestra productos
- Si el cliente llega con un pedido del sitio web (lista de productos con SKU y precio), CONFÍA en esos datos — son reales aunque no estén en tu catálogo. Procesa el pedido sin cuestionar disponibilidad. Solo pide nombre, dirección y email para envío.
- Si el cliente pide asesor humano: "Con gusto te comunico con una asesora, espera un momento 😊" y para de responder
- Si preguntan por mayoreo o corrida: sigue la sección PRECIOS Y MAYOREO de arriba (si no es mayorista registrada, mándala al Portal Mayorista; si lo es, usa los precios de portal del catálogo). NUNCA inventes precios.
- Sé diferente en cada mensaje, no repitas el mismo texto
- Responde siempre en español mexicano natural

=== COMPROBANTES DE PAGO ===
- Si el cliente manda una imagen que parece captura de transferencia, OXXO, Mercado Pago u otro comprobante de pago: confirma el pago, di que procesamos en 24hrs y pregunta al final "¿Hay algo más en lo que te pueda ayudar? 😊" NO pidas ningún dato adicional del pedido.
- NUNCA pidas nombre, dirección, modelos, tallas ni nada más cuando ya tienes el comprobante — ya tienes toda la info del pedido en el historial.{seccion_pedidos}"""

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
    global _WA_ULTIMO_ERROR
    _WA_ULTIMO_ERROR = None
    try:
        with urllib.request.urlopen(req) as r:
            data = json.loads(r.read())
            return data.get("messages", [{}])[0].get("id", "")
    except urllib.error.HTTPError as e:
        cuerpo = e.read().decode(errors="replace")
        try:
            err = (json.loads(cuerpo).get("error") or {})
        except Exception:
            err = {}
        _WA_ULTIMO_ERROR = {"codigo": err.get("code"), "mensaje": err.get("message") or cuerpo[:200]}
        print(f"Error WA send: HTTP {e.code} {cuerpo[:300]}")
        return ""
    except Exception as e:
        _WA_ULTIMO_ERROR = {"codigo": None, "mensaje": str(e)}
        print(f"Error WA send: {e}")
        return ""


_WA_ULTIMO_ERROR = None


def _explicar_error_wa() -> str:
    """Texto para el panel cuando WhatsApp rechaza un mensaje manual (antes se guardaba como enviado igual)."""
    e = _WA_ULTIMO_ERROR or {}
    if e.get("codigo") == 131047:
        return ("Pasaron más de 24 horas desde el último mensaje de la clienta, así que WhatsApp no deja mandarle texto libre. "
                "Envíale una plantilla aprobada.")
    if e.get("codigo") in (190, 102):
        return "El token de WhatsApp venció o es inválido. Hay que renovarlo en Meta."
    return "WhatsApp rechazó el mensaje" + (f": {e.get('mensaje')}" if e.get("mensaje") else " (revisa el token y el número configurados).")

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

def _resolver_items_wa(items_entrada: list, mayorista: bool = False) -> tuple:
    """Resuelve items {sku, color, talla, cantidad} de Maya contra productos/variantes/
    inventario REALES. Devuelve (pedido_items_db, faltantes, pares, subtotal).

    `faltantes` es una lista de strings legibles ("MA302 Negro T24") para los items sin
    existencia suficiente o que no se pudieron encontrar — si no está vacía, NO se debe
    generar ningún link de pago."""
    faltantes = []
    pedido_items_db = []
    pares = 0
    subtotal = 0.0

    skus = list({(it.get("sku") or "").strip() for it in items_entrada if it.get("sku")})
    if not skus:
        return [], ["(sin SKU válido)"], 0, 0.0
    filtro_sku = ",".join(skus)
    productos = supabase_get(f"productos?sku_interno=in.({filtro_sku})&select=id,sku_interno,nombre,precio_menudeo,precio_mayoreo3,precio_mayoreo6,precio_corrida,es_oferta") or []
    prod_por_sku = {p["sku_interno"]: p for p in productos}
    prod_ids = [p["id"] for p in productos]

    variantes = []
    inv_map: dict = {}
    if prod_ids:
        filtro_pid = ",".join(prod_ids)
        variantes = supabase_get(f"variantes?producto_id=in.({filtro_pid})&activa=eq.true&select=id,producto_id,color,talla") or []
        var_ids = [v["id"] for v in variantes]
        if var_ids:
            filtro_vid = ",".join(var_ids)
            inventario = supabase_get(f"inventario?variante_id=in.({filtro_vid})&select=variante_id,cantidad") or []
            for i in inventario:
                vid = i.get("variante_id")
                inv_map[vid] = inv_map.get(vid, 0) + (i.get("cantidad") or 0)

    # Total de pares (para el nivel de precio menudeo/mayoreo) se necesita ANTES de fijar
    # el precio unitario de cada item, así que primero se resuelven cantidades y variantes.
    resueltos = []
    for it in items_entrada:
        sku    = (it.get("sku") or "").strip()
        color  = (it.get("color") or "").strip().lower()
        talla  = str(it.get("talla") or "").strip().lower()
        cantidad = int(it.get("cantidad") or 1)
        etiqueta = f"{sku} {it.get('color','')} T{it.get('talla','')}".strip()

        producto = prod_por_sku.get(sku)
        if not producto:
            faltantes.append(f"{etiqueta} (modelo no encontrado)")
            continue
        variante = next((v for v in variantes
                          if v["producto_id"] == producto["id"]
                          and (v.get("color") or "").strip().lower() == color
                          and str(v.get("talla") or "").strip().lower() == talla), None)
        if not variante:
            faltantes.append(f"{etiqueta} (color/talla no encontrado)")
            continue
        stock = inv_map.get(variante["id"], 0)
        if stock < cantidad:
            faltantes.append(f"{etiqueta} (disponibles: {stock})")
            continue
        pares += cantidad
        resueltos.append((producto, variante, cantidad, etiqueta))

    if faltantes:
        return [], faltantes, pares, 0.0

    # Nivel de precio según el total de pares del pedido completo (igual que el sitio web)
    for producto, variante, cantidad, etiqueta in resueltos:
        _pw = precios_web(producto)
        if producto.get("es_oferta"):
            precio_u = float(_pw["menudeo"])
        elif mayorista and pares >= 6:
            precio_u = float(precios_portal(producto)["mayoreo6"])      # precio de portal (cliente registrada)
        elif mayorista and pares >= 3:
            precio_u = float(precios_portal(producto)["mayoreo3"])
        elif pares >= 3:
            precio_u = float(_pw["mayoreo3"])                            # descuento automático del sitio
        else:
            precio_u = float(_pw["menudeo"])
        pedido_items_db.append({
            "variante_id": variante["id"],
            "cantidad": cantidad,
            "precio_unitario": precio_u,
            "subtotal": cantidad * precio_u,
            "nombre": producto.get("nombre"),
        })
        subtotal += cantidad * precio_u

    return pedido_items_db, [], pares, subtotal


_ERR_LINK = {"msg": ""}   # motivo del último fallo al generar un link (lo muestra el panel)


def generar_link_pago_wa(telefono: str, datos_pedido: dict) -> tuple:
    """Crea el pedido en ERP + preferencia Mercado Pago. Devuelve (link, total, pedido_id, faltantes).

    Acepta dos formatos de producto en `items`:
    - {variante_id, nombre, cantidad, precio_unitario} — variantes reales ya resueltas
      (panel admin / carrito del sitio). Se confía en el precio recibido.
    - {sku, color, talla, cantidad} — formato de Maya (WhatsApp): se resuelve contra
      productos/variantes/inventario REALES y se verifica existencia antes de cotizar.
      Si algo no tiene stock suficiente, se aborta sin crear pedido ni link — se devuelve
      la lista de `faltantes` para que se le informe al cliente.
    """
    try:
        nombre     = datos_pedido.get("nombre", "Cliente")
        direccion  = datos_pedido.get("direccion", "")
        email_cliente = datos_pedido.get("email", "").strip() or "cliente@zapatillasmay.mx"
        items_entrada = datos_pedido.get("items") or []

        pedido_items_db = []
        if items_entrada and items_entrada[0].get("sku") and not items_entrada[0].get("variante_id"):
            # Formato de Maya: verificar existencia real antes de cotizar nada.
            pedido_items_db, faltantes, pares, precio = _resolver_items_wa(items_entrada, es_mayorista_registrado(telefono))
            if faltantes:
                return None, 0, None, faltantes
            descripcion = ", ".join(f"{it['nombre']} x{it['cantidad']}" for it in pedido_items_db)
        elif items_entrada:
            pares = 0
            precio = 0.0  # subtotal (sin envío), para el cálculo de envío de abajo
            descripciones = []
            for it in items_entrada:
                cantidad = int(it.get("cantidad") or 1)
                precio_u = float(it.get("precio_unitario") or 0)
                nombre_item = it.get("nombre") or "Producto"
                pedido_items_db.append({
                    "variante_id": it.get("variante_id"),
                    "cantidad": cantidad,
                    "precio_unitario": precio_u,
                    "subtotal": cantidad * precio_u,
                    "nombre": nombre_item,
                })
                pares += cantidad
                precio += cantidad * precio_u
                descripciones.append(f"{nombre_item} x{cantidad}")
            descripcion = ", ".join(descripciones)
        else:
            modelo = datos_pedido.get("modelo", "Calzado")
            color  = datos_pedido.get("color", "")
            talla  = datos_pedido.get("talla", "")
            precio = float(datos_pedido.get("precio", 0))
            pares  = int(datos_pedido.get("pares", 1))
            descripcion = f"{modelo} — {color} talla {talla}"

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
        notas       = f"Pedido WhatsApp | {descripcion} | Envío a: {direccion}"

        # 0. Idempotencia: si ya se generó un link para este mismo número y total en los últimos 30 min y sigue sin pagarse,
        #    se devuelve ESE link en vez de crear otro pedido (antes cada clic en «Generar link» creaba un pedido nuevo: Michelle
        #    quedó con 3 pedidos iguales).
        try:
            import datetime as _dt
            _desde = (_dt.datetime.now(_dt.timezone.utc) - _dt.timedelta(minutes=30)).strftime("%Y-%m-%dT%H:%M:%SZ")
            _t10 = _tel10(telefono)
            _mp_tok = os.environ.get("MP_ACCESS_TOKEN", "")
            if _t10 and _mp_tok:
                _prev = supabase_get(
                    f"pedidos?canal=eq.whatsapp&status=in.(pendiente_pago,checkout_iniciado)&total=eq.{total:.2f}"
                    f"&created_at=gte.{_desde}&telefono_cliente=like.*{_t10}&mp_preference_id=not.is.null"
                    f"&order=created_at.desc&limit=1&select=id,mp_preference_id") or []
                if _prev:
                    _pref = mercadopago.SDK(_mp_tok).preference().get(_prev[0]["mp_preference_id"])
                    _ip = ((_pref or {}).get("response") or {}).get("init_point")
                    if _ip:
                        print(f"[link-pago] se reutiliza el pedido {_prev[0]['id']} (mismo número y total en los últimos 30 min)")
                        return _ip, total, _prev[0]["id"], []
        except Exception as _e_idem:
            print(f"[link-pago] no se pudo revisar si ya existía el link, se crea uno nuevo: {_e_idem}")

        # 1. Crear pedido en Supabase
        try:
            pedido_db = supabase_post("pedidos", {
                "nombre_cliente":   nombre,
                "telefono_cliente": telefono,
                "email_cliente":    email_cliente,
                "total":            total,
                "status":           "pendiente_pago",   # link enviado por WhatsApp: queda en Pedidos → Pendientes hasta que pague (antes "checkout_iniciado" = "Abandonó", que casi nadie revisa)
                "canal":            "whatsapp",
                "notas":            notas,
                "direccion_envio":  direccion,
            })
        except Exception as e:
            print(f"[link-pago] FALLO al crear pedido en Supabase: {e}")
            _ERR_LINK["msg"] = "No se pudo crear el pedido en la base de datos: " + str(e)[:200]
            return None, 0, None, []
        # supabase_post puede devolver lista o dict
        pedido_id = (pedido_db[0] if isinstance(pedido_db, list) else pedido_db).get("id")
        if not pedido_id:
            print(f"[link-pago] Pedido creado sin id. Respuesta: {pedido_db}")
            return None, total, None, []

        # 1b. Guardar las variantes reales del inventario (si vinieron) como pedido_items,
        # para que el webhook de pago descuente stock automáticamente al aprobarse.
        for item in pedido_items_db:
            try:
                item_row = dict(item, pedido_id=pedido_id)
                supabase_post("pedido_items", item_row)
            except Exception as e:
                print(f"[link-pago] No se pudo guardar pedido_item (no crítico): {e}")

        # 2. Crear preferencia Mercado Pago
        mp_token = os.environ.get("MP_ACCESS_TOKEN", "")
        if not mp_token:
            print("[link-pago] FALTA MP_ACCESS_TOKEN en variables de entorno")
            _ERR_LINK["msg"] = "Falta MP_ACCESS_TOKEN en el servidor"
            return None, total, pedido_id, []
        try:
            sdk = mercadopago.SDK(mp_token)
            if pedido_items_db:
                mp_items = [
                    {"title": (it.get("nombre") or "Producto")[:255], "quantity": int(it.get("cantidad") or 1),
                     "unit_price": float(it.get("precio_unitario") or 0), "currency_id": "MXN"}
                    for it in pedido_items_db
                ]
            else:
                mp_items = [{"title": descripcion[:255], "quantity": 1, "unit_price": precio, "currency_id": "MXN"}]
            mp_items.append({"title": "Envío", "quantity": 1, "unit_price": envio, "currency_id": "MXN"})
            pref_data = {
                "items": mp_items,
                "payer":              {"name": nombre, "email": email_cliente},
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
                _ERR_LINK["msg"] = "Mercado Pago no devolvió el link: " + str((result.get("response") or {}).get("message") or result.get("status") or "sin detalle")[:200]
                return None, total, pedido_id, []
        except Exception as e:
            print(f"[link-pago] FALLO en Mercado Pago: {e}")
            _ERR_LINK["msg"] = "Falló la conexión con Mercado Pago: " + str(e)[:200]
            return None, total, pedido_id, []

        if pref.get("id"):
            try:
                supabase_patch(f"pedidos?id=eq.{pedido_id}",
                               {"mp_preference_id": pref["id"]})
            except Exception as e:
                print(f"[link-pago] No se pudo guardar mp_preference_id (no crítico): {e}")
        return link, total, pedido_id, []
    except Exception as e:
        import traceback
        print(f"[link-pago] Error inesperado: {e}\n{traceback.format_exc()}")
        _ERR_LINK["msg"] = "Error inesperado: " + str(e)[:200]
        return None, 0, None, []


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

def _extraer_generar_pago(texto: str):
    """Extrae el JSON de GENERAR_PAGO:{...} contando llaves (el JSON trae un arreglo
    "items" con objetos propios anidados — una regex simple \\{[^}]+\\} se corta en la
    primera llave de cierre y trunca el JSON). Devuelve (json_str_o_None, texto_sin_marcador)."""
    idx = texto.find("GENERAR_PAGO:")
    if idx == -1:
        return None, texto
    start = texto.find("{", idx)
    if start == -1:
        return None, texto
    depth = 0
    end = None
    for i in range(start, len(texto)):
        if texto[i] == "{":
            depth += 1
        elif texto[i] == "}":
            depth -= 1
            if depth == 0:
                end = i
                break
    if end is None:
        return None, texto
    json_str = texto[start:end + 1]
    texto_limpio = (texto[:idx] + texto[end + 1:]).strip()
    return json_str, texto_limpio

def procesar_y_enviar_respuesta(from_number, respuesta_claude):
    """Procesa marcadores en la respuesta de Maya y ejecuta las acciones correspondientes."""

    # ── GENERAR_PAGO:{json} ──────────────────────────────────────────────────
    json_pago, texto = _extraer_generar_pago(respuesta_claude)
    if json_pago:
        msg_enviado = texto  # lo que finalmente se guarda como respuesta
        if texto:
            enviar_whatsapp_texto(from_number, texto)
        try:
            datos = json.loads(json_pago)
            link, total, pedido_id, faltantes = generar_link_pago_wa(from_number, datos)
            time.sleep(1)
            if faltantes:
                msg_sin_stock = (
                    "Uy, justo se me acaba de agotar 😔 esto ya no tiene existencia:\n"
                    + "\n".join(f"• {f}" for f in faltantes)
                    + "\n\n¿Le damos otra talla/color o le muestro otra opción? 💕"
                )
                enviar_whatsapp_texto(from_number, msg_sin_stock)
                msg_enviado = (texto + "\n\n" + msg_sin_stock).strip() if texto else msg_sin_stock
            elif link:
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
                _msg_sin_imgs = msg.split('|IMGS|')[0]
                productos_mostrados = re.sub(r'\[.*?\]:\s*\[Carrusel\]\s*', '', _msg_sin_imgs).strip()
                mensajes.append({"role": "assistant", "content": f"[Envié un carrusel de fotos al cliente: {productos_mostrados}]"})
            elif tipo == 'imagen_saliente':
                # Foto individual enviada al cliente
                producto_info = re.sub(r'\[.*?\]:\s*', '', msg).strip()
                mensajes.append({"role": "assistant", "content": f"[Envié una foto al cliente: {producto_info}]"})
            elif resp:
                resp_limpia = re.sub(r'ENVIAR_FOTO:\[[^\]]+\]', '', resp)
                resp_limpia = re.sub(r'ENVIAR_FOTO:\S+', '', resp_limpia)
                resp_limpia = re.sub(r'BUSCAR_COLORES:\[?[A-Za-z0-9_\-]+\]?', '', resp_limpia)
                _, resp_limpia = _extraer_generar_pago(resp_limpia)
                resp_limpia = resp_limpia.strip()
                if resp_limpia:
                    mensajes.append({"role": "assistant", "content": resp_limpia})
        return mensajes
    except:
        return []

def subir_imagen_storage(img_bytes: bytes, filename: str, content_type: str = "image/jpeg") -> str:
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
            "Content-Type": content_type,
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

@router.get("/debug-media")
def debug_media():
    """Diagnostico temporal: por que las imagenes/audios de clientes llegan sin
    media_url. Prueba (1) que WHATSAPP_TOKEN siga siendo valido contra la Graph
    API y (2) que la subida a Supabase Storage (bucket wa-media) funcione.
    No expone el token ni ningun secreto en la respuesta."""
    resultado = {}
    wa_token = os.environ.get("WHATSAPP_TOKEN", "")
    resultado["whatsapp_token_configurado"] = bool(wa_token)
    if wa_token:
        try:
            req = urllib.request.Request(
                f"https://graph.facebook.com/v25.0/debug_token?input_token={wa_token}&access_token={wa_token}",
                headers={}
            )
            with urllib.request.urlopen(req) as r:
                data = json.loads(r.read())
            resultado["whatsapp_token_valido"] = True
            resultado["whatsapp_token_info"] = data.get("data", {})
        except urllib.error.HTTPError as e:
            try:
                cuerpo = json.loads(e.read().decode())
            except Exception:
                cuerpo = {}
            resultado["whatsapp_token_valido"] = False
            resultado["whatsapp_token_error"] = cuerpo.get("error", {}).get("message", str(e))
        except Exception as e:
            resultado["whatsapp_token_valido"] = False
            resultado["whatsapp_token_error"] = str(e)

    resultado["supabase_url_configurado"] = bool(os.environ.get("SUPABASE_URL", ""))
    resultado["supabase_key_configurado"] = bool(os.environ.get("SUPABASE_KEY", ""))
    try:
        test_url = subir_imagen_storage(b"test", "_debug_test.txt", content_type="text/plain")
        resultado["storage_upload_ok"] = bool(test_url)
        resultado["storage_upload_url"] = test_url
    except Exception as e:
        resultado["storage_upload_ok"] = False
        resultado["storage_upload_error"] = str(e)

    # Probar el INSERT real con media_url, sin el catch que lo enmascara,
    # para ver si conversaciones_whatsapp.media_url sigue con el cache de
    # PostgREST desactualizado (mismo patron que ya paso con pedidos).
    try:
        from database import supabase_post, supabase_delete
        test_row = supabase_post("conversaciones_whatsapp", {
            "telefono": "0000000000_debug",
            "mensaje": "[debug-media test]",
            "tipo": "texto",
            "media_url": "https://example.com/debug.jpg"
        })
        resultado["insert_media_url_ok"] = True
        try:
            supabase_delete("conversaciones_whatsapp?telefono=eq.0000000000_debug")
        except Exception:
            pass
    except Exception as e:
        resultado["insert_media_url_ok"] = False
        resultado["insert_media_url_error"] = str(e)

    return resultado


def _control_manual_expirado(telefono) -> bool:
    """True si un chat en control manual lleva demasiado tiempo sin que NADIE del equipo escriba. Un chat tomado por
    una asesora se quedaba así para siempre: Maya no volvía a contestar (hoy 58 de 72 chats en manual llevan más de 14
    días inactivos, y a 15 clientas ni Maya ni el equipo les contestó en más de 24 h). Por decisión del dueño (2026-10-04) el
    regreso automático está APAGADO: un chat en control manual se queda así hasta que el equipo lo regrese a Maya.
    Para volver a activarlo basta poner CONTROL_MANUAL_EXPIRA_HORAS en Railway con las horas (ej. 48) sin mensaje
    manual del equipo tras las cuales el control regresa a Maya."""
    try:
        horas = float(os.environ.get("CONTROL_MANUAL_EXPIRA_HORAS", "0"))
    except ValueError:
        horas = 0.0
    if horas <= 0:
        return False
    try:
        import datetime as _d
        tel = urllib.parse.quote(str(telefono), safe="")
        manual = supabase_get(f"conversaciones_whatsapp?telefono=eq.{tel}&tipo=eq.manual&order=created_at.desc&limit=1&select=created_at")
        if manual:
            ref = manual[0]["created_at"]
        else:   # nadie del equipo ha escrito: se mide contra la última actividad del chat
            ult = supabase_get(f"conversaciones_whatsapp?telefono=eq.{tel}&order=created_at.desc&limit=1&select=created_at")
            if not ult:
                return False
            ref = ult[0]["created_at"]
        t = _d.datetime.fromisoformat(str(ref).replace("Z", "+00:00"))
        return (_d.datetime.now(_d.timezone.utc) - t).total_seconds() > horas * 3600
    except Exception as e:
        print(f"[control] no se pudo evaluar la expiración de {telefono}: {e}")
        return False


def _liberar_control_si_expiro(telefono, control):
    """Devuelve `control` (falsy si expiró y se liberó el chat para Maya)."""
    if control and _control_manual_expirado(telefono):
        try:
            supabase_patch(f"chats_control?telefono=eq.{urllib.parse.quote(str(telefono), safe='')}", {"en_control": False})
            cache_invalidate("chats_lista")
            print(f"[control] {telefono}: control manual expirado, Maya vuelve a contestar")
        except Exception as e:
            print(f"[control] no se pudo liberar {telefono}: {e}")
            return control
        return []
    return control


def _maya_activa_global() -> bool:
    """Interruptor general para pausar a Maya en TODOS los canales a la vez
    (a diferencia de 'en_control', que solo pausa una conversacion puntual).
    Reusa la clave 'bot_activo' -- ya existia un checkbox para esto en la
    pestaña Config del panel, pero nada en el backend la leia todavia.
    Cuando esta apagada, los mensajes se siguen guardando para que el equipo
    los conteste a mano, pero Maya no genera ni envia respuesta automatica."""
    cached = cache_get("maya_activa_global")
    if cached is not None:
        return cached
    try:
        fila = supabase_get("whatsapp_config?clave=eq.bot_activo")
        activa = fila[0]["valor"] != "false" if fila else True
    except Exception:
        activa = True
    cache_set("maya_activa_global", activa, ttl=30)
    return activa


def guardar_conversacion(telefono, mensaje, respuesta, tipo="texto", nombre="", media_url="", canal="whatsapp"):
    try:
        from database import supabase_post
        data = {
            "telefono": telefono,
            "nombre_contacto": limpiar_texto(nombre),
            "mensaje": limpiar_texto(mensaje),
            "respuesta": limpiar_texto(respuesta),
            "tipo": tipo
        }
        if media_url:
            data["media_url"] = media_url
        if canal and canal != "whatsapp":
            data["canal"] = canal
        _w_ent = _WAMID_ENTRANTE.get()
        if _w_ent:
            data["wa_message_id"] = _w_ent
            _WAMID_ENTRANTE.set("")   # solo la primera fila del webhook lleva el wamid
        try:
            supabase_post("conversaciones_whatsapp", data)
        except Exception as e_post:
            # Si falla por columnas que el cache de PostgREST no conoce todavia
            # (migracion reciente), reintentar quitandolas una por una.
            reintentado = False
            if "media_url" in data:
                data.pop("media_url", None)
                reintentado = True
            if "canal" in data:
                data.pop("canal", None)
                reintentado = True
            if "wa_message_id" in data:
                data.pop("wa_message_id", None)
                reintentado = True
            if reintentado:
                supabase_post("conversaciones_whatsapp", data)
            else:
                raise e_post
        cache_invalidate("chats_lista")  # forzar refresh en próximo poll
    except Exception as e:
        print(f"ERROR guardando: {str(e)}")
        return
    # Aviso push al panel — todo lo que pasa por aquí es un mensaje ENTRANTE del
    # cliente (las respuestas manuales del asesor se guardan aparte, sin pasar por
    # esta función), así que siempre vale la pena avisar. Nunca debe tumbar el
    # guardado del mensaje si falla.
    try:
        from routers.push import enviar_push
        from urllib.parse import quote
        preview = (mensaje or "")[:100]
        enviar_push(
            titulo=f"💬 {nombre or telefono}",
            cuerpo=preview,
            url=f"/?modulo=conversaciones&telefono={quote(str(telefono))}",
            sitio="panel",
        )
    except Exception as e_push:
        print(f"[push] Error avisando mensaje WA entrante: {e_push}")

def enviar_whatsapp(from_number, respuesta):
    enviar_whatsapp_texto(from_number, respuesta)

_TALLAS_ORDEN = ['22', '22.5', '23', '23.5', '24', '24.5', '25', '25.5', '26', '26.5', '27', 'Unica']

def _tallas_reales_catalogo() -> dict:
    """Tallas con stock > 0 por producto_id, calculado desde variantes+inventario
    reales (igual que el feed del sitio web) -- cacheado para no pegarle a la DB
    en cada mensaje/comentario que procese Maya."""
    cache_key = "chatbot_tallas_reales"
    cached = cache_get(cache_key)
    if cached is not None:
        return cached
    try:
        variantes = supabase_get("variantes?activa=eq.true&select=id,producto_id,talla") or []
        inventario = supabase_get("inventario?select=variante_id,cantidad") or []
        inv_map = {i["variante_id"]: (i.get("cantidad") or 0) for i in inventario if i.get("variante_id")}
        tallas_por_producto: dict = {}
        for v in variantes:
            pid = v.get("producto_id")
            talla = (v.get("talla") or "").strip()
            if not pid or not talla or inv_map.get(v.get("id"), 0) <= 0:
                continue
            tallas_por_producto.setdefault(pid, set()).add(talla)
        resultado = {
            pid: sorted(tallas, key=lambda t: _TALLAS_ORDEN.index(t) if t in _TALLAS_ORDEN else 99)
            for pid, tallas in tallas_por_producto.items()
        }
        cache_set(cache_key, resultado, ttl=TTL_STOCK)
        return resultado
    except Exception as e:
        print(f"[catalogo] Error calculando tallas reales: {e}")
        return {}

def cargar_catalogo():
    productos = supabase_get("productos?activo=eq.true&select=id,sku_interno,nombre,precio_menudeo,precio_mayoreo3,precio_mayoreo6,precio_corrida,es_oferta,categoria,nuevo,corrida_activa,tallas_disponibles,imagen_principal") or []
    tallas_reales = _tallas_reales_catalogo()
    for p in productos:
        if p.get("id") in tallas_reales:
            p["tallas_disponibles"] = tallas_reales[p["id"]]  # puede quedar [] si se agotó todo
    return productos

def _procesar_audio_wa(mensaje_data: dict, from_number: str) -> tuple:
    """Descarga el audio de WhatsApp, lo sube a Storage y lo transcribe con Whisper.
    Retorna (transcripcion, url_publica). El audio guardado NUNCA se pierde: si falla la transcripción (OpenAI sin crédito, límite de uso, etc.)
    igual se devuelve la URL para que se pueda escuchar en el panel."""
    pub_url = ""
    try:
        audio_id = mensaje_data.get("audio", {}).get("id", "")
        if not audio_id:
            return ("[Audio no procesable]", "")
        wa_token   = os.environ.get("WHATSAPP_TOKEN", "")
        openai_key = os.environ.get("OPENAI_API_KEY", "")

        req = urllib.request.Request(
            f"https://graph.facebook.com/v25.0/{audio_id}",
            headers={"Authorization": f"Bearer {wa_token}"}
        )
        with urllib.request.urlopen(req) as r:
            media_data = json.loads(r.read())
        audio_url = media_data.get("url", "")
        if not audio_url:
            return (f"[Audio ERROR-DEBUG-TEMPORAL: sin url en media_data={media_data}]", "")

        audio_req = urllib.request.Request(audio_url, headers={"Authorization": f"Bearer {wa_token}"})
        with urllib.request.urlopen(audio_req) as r:
            audio_bytes = r.read()

        pub_url = subir_imagen_storage(audio_bytes, f"{from_number}_{audio_id}.ogg", content_type="audio/ogg")

        if not openai_key:
            print(f"[audio] sin OPENAI_API_KEY, audio de {from_number} no transcrito")
            return ("[Audio de voz recibido]", pub_url)

        try:
            return _transcribir_whisper(audio_bytes, openai_key, pub_url)
        except Exception as e_w:
            print(f"[audio-wa] No se pudo transcribir (el audio sí se guardó y se puede escuchar): {e_w}")
            return ("[Audio de voz recibido]", pub_url)

    except Exception as e:
        print(f"[audio-wa] Error: {e}")
        return ("[Audio de voz recibido]", pub_url)


def _transcribir_whisper(audio_bytes: bytes, openai_key: str, pub_url: str) -> tuple:
    """Transcribe con Whisper (un reintento si responde 429 o error del servidor). Lanza la excepción si no se logra."""
    boundary = "----WhisperBoundary"
    body_parts = [
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"model\"\r\n\r\nwhisper-1".encode(),
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"language\"\r\n\r\nes".encode(),
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"audio.ogg\"\r\nContent-Type: audio/ogg\r\n\r\n".encode() + audio_bytes,
        f"--{boundary}--".encode(),
    ]
    body = b"\r\n".join(body_parts)
    for intento in range(2):
        req = urllib.request.Request(
            "https://api.openai.com/v1/audio/transcriptions", data=body, method="POST",
            headers={"Authorization": f"Bearer {openai_key}", "Content-Type": f"multipart/form-data; boundary={boundary}"})
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                texto = (json.loads(r.read()).get("text") or "").strip()
            return (texto or "[Audio sin contenido]", pub_url)
        except urllib.error.HTTPError as e:
            if intento == 0 and (e.code == 429 or e.code >= 500):
                time.sleep(2)
                continue
            raise


def _procesar_documento_wa(mensaje_data: dict, from_number: str) -> tuple:
    """Descarga un documento de WhatsApp y lo sube a Storage. Retorna (nombre, url)."""
    try:
        doc = mensaje_data.get("document", {})
        doc_id = doc.get("id", "")
        doc_filename = doc.get("filename", f"documento_{doc_id}")
        wa_token = os.environ.get("WHATSAPP_TOKEN", "")
        req = urllib.request.Request(
            f"https://graph.facebook.com/v25.0/{doc_id}",
            headers={"Authorization": f"Bearer {wa_token}"}
        )
        with urllib.request.urlopen(req) as r:
            meta = json.loads(r.read())
        dl_url = meta.get("url", "")
        if not dl_url:
            return (doc_filename, "")
        dl_req = urllib.request.Request(dl_url, headers={"Authorization": f"Bearer {wa_token}"})
        with urllib.request.urlopen(dl_req) as r:
            doc_bytes = r.read()
        mime = doc.get("mime_type", "application/octet-stream")
        pub_url = subir_imagen_storage(doc_bytes, f"{from_number}_{doc_id}_{doc_filename}", content_type=mime)
        return (doc_filename, pub_url)
    except Exception as e:
        print(f"[documento-wa] Error: {e}")
        return ("documento", "")


def _procesar_video_wa(mensaje_data: dict, from_number: str) -> str:
    """Descarga un video de WhatsApp y lo sube a Storage. Retorna la URL pública."""
    try:
        vid = mensaje_data.get("video", {})
        vid_id = vid.get("id", "")
        wa_token = os.environ.get("WHATSAPP_TOKEN", "")
        req = urllib.request.Request(
            f"https://graph.facebook.com/v25.0/{vid_id}",
            headers={"Authorization": f"Bearer {wa_token}"}
        )
        with urllib.request.urlopen(req) as r:
            meta = json.loads(r.read())
        dl_url = meta.get("url", "")
        if not dl_url:
            return ""
        dl_req = urllib.request.Request(dl_url, headers={"Authorization": f"Bearer {wa_token}"})
        with urllib.request.urlopen(dl_req) as r:
            vid_bytes = r.read()
        mime = vid.get("mime_type", "video/mp4")
        return subir_imagen_storage(vid_bytes, f"{from_number}_{vid_id}.mp4", content_type=mime)
    except Exception as e:
        print(f"[video-wa] Error: {e}")
        return ""


@router.post("/link-pago-manual")
def link_pago_manual(datos: dict):
    """Genera un pedido manual + link de Mercado Pago con precio personalizado
    (ventas del admin, ej. cuando se cotizó un precio especial). El pago dispara
    Purchase a Meta/GA igual que cualquier pedido. Espera:
    {telefono, nombre, direccion, items: [{variante_id, nombre, cantidad, precio_unitario}, ...]}
    (o, si no se conoce la variante exacta: modelo, color, talla, precio, pares)."""
    try:
        telefono = (datos.get("telefono") or "").strip()
        if not telefono:
            return JSONResponse(status_code=400, content={"ok": False, "error": "Falta el teléfono del cliente"})
        _ERR_LINK["msg"] = ""
        link, total, pedido_id, faltantes = generar_link_pago_wa(telefono, datos)
        if link:
            return {"ok": True, "link": link, "total": total, "pedido_id": pedido_id}
        if faltantes:
            return JSONResponse(status_code=409, content={"ok": False, "error": "Sin existencia suficiente", "faltantes": faltantes})
        return JSONResponse(status_code=500, content={"ok": False, "error": _ERR_LINK["msg"] or "No se pudo generar el link (revisa MP_ACCESS_TOKEN)"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"ok": False, "error": str(e)})


_ETQ_FORMA_WA = {'transferencia': 'depósito/transferencia BBVA', 'spei': 'SPEI', 'oxxo': 'depósito en OXXO (Spin)', 'efectivo': 'efectivo'}


def _sucursal_con_stock(items: list):
    """Sucursal desde la que se surte el pedido: la primera (tiendas antes que bodegas) que tiene TODOS los pares. Si ninguna alcanza, la de más existencia
    y la lista de lo que falta. Devuelve (sucursal_id, faltantes)."""
    necesita = {}
    for i in items:
        necesita[i["variante_id"]] = necesita.get(i["variante_id"], 0) + int(i["cantidad"])
    inv = supabase_get(f"inventario?variante_id=in.({','.join(necesita)})&select=variante_id,sucursal_id,cantidad") or []
    por = {}
    for r in inv:
        por.setdefault(r["sucursal_id"], {})[r["variante_id"]] = int(r.get("cantidad") or 0)
    sucs = supabase_get("sucursales?activa=eq.true&select=id,tipo,nombre&order=created_at.asc") or []
    sucs.sort(key=lambda x: 0 if (x.get("tipo") or "") == "tienda" else 1)
    mejor, mejor_pares, mejor_falta = None, -1, []
    for sc in sucs:
        d = por.get(sc["id"], {})
        falta = [(v, n - d.get(v, 0)) for v, n in necesita.items() if d.get(v, 0) < n]
        if not falta:
            return sc["id"], []
        cubre = sum(min(d.get(v, 0), n) for v, n in necesita.items())
        if cubre > mejor_pares:
            mejor, mejor_pares, mejor_falta = sc["id"], cubre, falta
    nombres = {i["variante_id"]: i.get("nombre") or "Producto" for i in items}
    return mejor, [f"{nombres.get(v, 'Producto')} (faltan {n})" for v, n in mejor_falta]


@router.post("/pedido-manual-whatsapp")
def pedido_manual_whatsapp(datos: dict):
    """Pedido de una clienta de WhatsApp SIN link de MercadoPago: paga por depósito/transferencia BBVA, SPEI, OXXO o efectivo. Canal «whatsapp» (cuenta como venta
    que llega sola). Queda «pendiente de pago»; el panel lo confirma de inmediato si ya depositó (eso descuenta el inventario) o más tarde con
    «Confirmar pago recibido». {telefono, nombre, direccion, forma_pago, items:[{variante_id, nombre, cantidad, precio_unitario}], envio?, empleado?, forzar?}"""
    try:
        telefono = (datos.get("telefono") or "").strip()
        if not telefono:
            return JSONResponse(status_code=400, content={"ok": False, "error": "Falta el teléfono de la clienta"})
        forma = str(datos.get("forma_pago") or "")
        if forma not in ("transferencia", "spei", "oxxo", "efectivo"):
            return JSONResponse(status_code=400, content={"ok": False, "error": "Forma de pago no válida"})
        items = []
        for it in (datos.get("items") or [])[:40]:
            try:
                cant, precio = int(it.get("cantidad") or 0), float(it.get("precio_unitario") or 0)
            except (TypeError, ValueError):
                continue
            if it.get("variante_id") and cant > 0 and precio >= 0:
                items.append({"variante_id": it["variante_id"], "cantidad": cant, "precio_unitario": precio, "subtotal": cant * precio, "nombre": (it.get("nombre") or "Producto")[:200]})
        if not items:
            return JSONResponse(status_code=400, content={"ok": False, "error": "Agrega al menos un modelo"})
        pares = sum(i["cantidad"] for i in items)
        subtotal = sum(i["subtotal"] for i in items)
        envio_auto = 0.0 if subtotal >= 1299 else (199.0 if pares >= 3 else (150.0 if pares >= 2 else 99.0))
        try:
            envio = float(datos.get("envio")) if datos.get("envio") not in (None, "") else envio_auto
        except (TypeError, ValueError):
            envio = envio_auto
        envio = max(0.0, envio)
        total = subtotal + envio
        suc_id, faltantes = _sucursal_con_stock(items)
        if faltantes and not datos.get("forzar"):
            return JSONResponse(status_code=409, content={"ok": False, "error": "Sin existencia suficiente", "faltantes": faltantes})
        t10 = _tel10(telefono)
        # Idempotencia: el mismo número y total en los últimos 30 min, sin pagar y sin link, es el mismo pedido (evita pedidos repetidos por doble clic)
        try:
            import datetime as _dt
            desde = (_dt.datetime.now(_dt.timezone.utc) - _dt.timedelta(minutes=30)).strftime("%Y-%m-%dT%H:%M:%SZ")
            previo = supabase_get(f"pedidos?canal=eq.whatsapp&status=eq.pendiente_pago&total=eq.{total:.2f}&created_at=gte.{desde}&mp_preference_id=is.null"
                                  f"&telefono_cliente=like.*{t10}&order=created_at.desc&limit=1&select=id") if t10 else []
            if previo:
                return {"ok": True, "pedido_id": previo[0]["id"], "total": total, "envio": envio, "repetido": True}
        except Exception as e_i:
            print(f"[pedido-manual-wa] idempotencia: {e_i}")
        cliente_id = None
        try:
            cli = supabase_get(f"clientes?telefono=like.*{t10}&select=id&limit=1") if t10 else []
            cliente_id = cli[0]["id"] if cli else None
        except Exception:
            cliente_id = None
        nombre = (datos.get("nombre") or "Cliente").strip()[:120]
        direccion = (datos.get("direccion") or "").strip()[:400]
        descripcion = ", ".join(f"{i['nombre']} x{i['cantidad']}" for i in items)
        fila = {
            "nombre_cliente": nombre, "telefono_cliente": telefono, "total": total, "costo_envio": envio, "status": "pendiente_pago", "canal": "whatsapp",
            # depósito BBVA, SPEI y depósito en OXXO se guardan como «spei» (así caen en el mismo renglón de Caja/Finanzas); el método exacto queda en las notas
            "forma_pago": "efectivo" if forma == "efectivo" else "spei", "sucursal_id": suc_id, "notas": f"Pedido WhatsApp ({_ETQ_FORMA_WA[forma]}) | {descripcion} | Envío a: {direccion}"[:1000], "direccion_envio": direccion,
            "empleado": (datos.get("empleado") or "")[:80] or None,
        }
        if cliente_id:
            fila["cliente_id"] = cliente_id
        r = supabase_post("pedidos", fila)
        pedido_id = (r[0] if isinstance(r, list) else r).get("id")
        for it in items:
            supabase_post("pedido_items", dict(it, pedido_id=pedido_id))
        try:
            supabase_post("pedido_historial", {"pedido_id": pedido_id, "accion": "creado", "detalle": f"Pedido de WhatsApp sin link ({forma})", "usuario": (datos.get("empleado") or None)})
        except Exception:
            pass
        return {"ok": True, "pedido_id": pedido_id, "total": total, "envio": envio, "sucursal_id": suc_id, "faltantes": faltantes}
    except Exception as e:
        import traceback
        print(f"[pedido-manual-wa] {e}\n{traceback.format_exc()}")
        return JSONResponse(status_code=500, content={"ok": False, "error": "No se pudo crear el pedido: " + str(e)[:160]})


def _verificar_firma_meta(body: bytes, signature_header: str) -> bool:
    """Valida `X-Hub-Signature-256` del webhook de Meta con el App Secret.

    Si `WHATSAPP_APP_SECRET` no está configurado no se puede validar: se permite el
    request (comportamiento actual) para no tumbar el bot en vivo, pero se registra una
    advertencia. En cuanto se configure el secret en el entorno, la firma se exige.
    """
    app_secret = os.environ.get("WHATSAPP_APP_SECRET", "")
    if not app_secret:
        print("[wa webhook] WHATSAPP_APP_SECRET no configurado; firma NO verificada")
        return True
    if not signature_header or not signature_header.startswith("sha256="):
        return False
    esperado = "sha256=" + hmac.new(app_secret.encode(), body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(esperado, signature_header)


# Dedup de reintentos de Meta: si el webhook no recibe 200 rápido, Meta REENVÍA el
# mismo payload → el mensaje se procesaba dos veces (doble fila en el panel y doble
# respuesta de Maya al cliente). Guardamos los wamid vistos por ~15 min en memoria.
_WAMIDS_VISTOS: dict = {}
_TAREAS_BG: set = set()  # referencias fuertes a tareas de webhook en vuelo (anti-GC)

def _wamid_duplicado(wamid: str) -> bool:
    if not wamid:
        return False
    ahora = time.time()
    if len(_WAMIDS_VISTOS) > 2000:  # límite de seguridad
        _WAMIDS_VISTOS.clear()
    for k in [k for k, t in _WAMIDS_VISTOS.items() if ahora - t > 900]:
        _WAMIDS_VISTOS.pop(k, None)
    if wamid in _WAMIDS_VISTOS:
        return True
    _WAMIDS_VISTOS[wamid] = ahora
    return False


@router.post("/whatsapp")
async def recibir_mensaje_whatsapp(request: Request):
    """Recibe webhooks de Meta. Responde 200 DE INMEDIATO y procesa en segundo plano:
    si tardamos más de ~10 s en contestar (Claude, media, etc.), Meta reintenta la
    entrega y el mensaje se duplicaba. El procesamiento vive en
    `_procesar_webhook_whatsapp`."""
    import asyncio
    raw_body = await request.body()
    if not _verificar_firma_meta(raw_body, request.headers.get("X-Hub-Signature-256", "")):
        print("[wa webhook] firma inválida — request rechazado")
        return JSONResponse(status_code=403, content={"error": "firma inválida"})
    try:
        datos = json.loads(raw_body) if raw_body else {}
    except Exception:
        datos = {}
    try:
        _msgs = datos.get("entry", [{}])[0].get("changes", [{}])[0].get("value", {}).get("messages", [])
        _wamid = _msgs[0].get("id", "") if _msgs else ""
    except Exception:
        _wamid = ""
    if _wamid and _wamid_duplicado(_wamid):
        print(f"[wa webhook] reintento de Meta ignorado (wamid ya procesado): {_wamid}")
        return {"status": "ok"}
    # Guardar referencia fuerte: sin esto el GC puede matar la tarea antes de terminar.
    tarea = asyncio.create_task(_procesar_webhook_whatsapp(datos))
    _TAREAS_BG.add(tarea)
    tarea.add_done_callback(_TAREAS_BG.discard)
    return {"status": "ok"}


async def _procesar_webhook_whatsapp(datos: dict):
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
            st_wamid    = st.get("id", "")    # wamid del mensaje SALIENTE al que refiere el recibo
            if status_type in ("delivered", "read") and recipient:
                try:
                    existing = supabase_get(f"chats_control?telefono=eq.{recipient}")
                    campo = "cliente_entrego_at" if status_type == "delivered" else "cliente_leyo_at"
                    now_iso = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                    if existing:
                        supabase_patch(f"chats_control?telefono=eq.{recipient}", {campo: now_iso})
                    else:
                        # en_control=False explícito: un recibo de lectura NO debe apagar a Maya
                        supabase_post("chats_control", {"telefono": recipient, campo: now_iso, "en_control": False})
                    cache_invalidate("chats_lista")
                except Exception as e:
                    print(f"Error guardando status {status_type}: {e}")
            # Envío FALLIDO (WhatsApp lo aceptó y luego no pudo entregarlo): se deja una nota en el chat con el motivo real.
            if status_type == "failed" and recipient and st_wamid:
                try:
                    _registrar_fallo_wa(recipient, st_wamid, st.get("errors") or [])
                except Exception as e:
                    print(f"[wa] no se pudo registrar el fallo de entrega: {e}")
            # Métricas de broadcast: si este wamid pertenece a un envío masivo, actualizar su estado.
            if status_type in ("delivered", "read", "failed") and st_wamid:
                try:
                    _actualizar_metrica_broadcast(st_wamid, status_type)
                except Exception as e:
                    print(f"[broadcast] error métrica {status_type}: {e}")

        messages = value.get("messages", [])
        if not messages:
            return {"status": "ok"}

        mensaje_data = messages[0]
        tipo         = mensaje_data.get("type", "text")
        from_number  = mensaje_data.get("from", "")
        wa_msg_id    = mensaje_data.get("id", "")   # wamid del mensaje entrante
        _WAMID_ENTRANTE.set(wa_msg_id or "")
        contacts     = value.get("contacts", [])
        nombre_contacto = contacts[0].get("profile", {}).get("name", "") if contacts else ""

        _registrar_origen_chat(from_number, mensaje_data)   # de dónde llegó (best-effort, nunca rompe el webhook)

        # ── Mark as read automático al recibir ──────────────────────
        if wa_msg_id:
            mark_as_read_wa(wa_msg_id)

        control = supabase_get(f"chats_control?telefono=eq.{from_number}&en_control=eq.true")
        control = _liberar_control_si_expiro(from_number, control)
        if not control and not _maya_activa_global():
            control = True  # Maya apagada globalmente -- mismo camino que un take-over manual

        # ── Sticker ─────────────────────────────────────────────────
        if tipo == "sticker":
            msg_sticker = "[Sticker]"
            try:
                sticker_id = mensaje_data.get("sticker", {}).get("id", "")
                if sticker_id:
                    wa_token = os.environ.get("WHATSAPP_TOKEN", "")
                    meta_req = urllib.request.Request(
                        f"https://graph.facebook.com/v25.0/{sticker_id}",
                        headers={"Authorization": f"Bearer {wa_token}"}
                    )
                    with urllib.request.urlopen(meta_req) as r:
                        st_meta = json.loads(r.read())
                    st_url = st_meta.get("url", "")
                    if st_url:
                        st_req = urllib.request.Request(st_url, headers={"Authorization": f"Bearer {wa_token}"})
                        with urllib.request.urlopen(st_req) as r:
                            st_bytes = r.read()
                        public_url = subir_imagen_storage(st_bytes, f"{from_number}_{sticker_id}.webp", content_type="image/webp")
                        if public_url:
                            msg_sticker = f"[Sticker] {public_url}"
            except Exception as e:
                print(f"[sticker] no se pudo guardar imagen: {e}")
            guardar_conversacion(from_number, msg_sticker, None, "sticker", nombre_contacto)
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
        _es_mayorista = es_mayorista_registrado(from_number)
        catalogo = construir_catalogo(productos, _es_mayorista)
        pedidos_cliente = obtener_pedidos_cliente(from_number)
        sistema = construir_sistema(catalogo, pedidos_cliente, _es_mayorista)
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
                    respaldo_carrusel = None
                    for row in ref_rows:
                        if row.get("wa_message_id") == ctx_wamid:
                            ctx_info = row.get("mensaje", "")
                            break
                        if row.get("tipo") == "carrusel_saliente":
                            txt_row = row.get("mensaje", "") or ""
                            # ¿a cuál foto del carrusel respondió? (cada foto guarda el id de su mensaje de WhatsApp)
                            try:
                                mapa = json.loads(txt_row.split("\n|MAP|", 1)[1]) if "\n|MAP|" in txt_row else []
                            except Exception:
                                mapa = []
                            hit = next((x for x in mapa if x.get("w") == ctx_wamid), None)
                            if hit:
                                ctx_info = f"{hit.get('n', '')}\n|IMGS|{hit.get('u', '')}"
                                break
                            if respaldo_carrusel is None:
                                respaldo_carrusel = txt_row   # carrusel completo si no se identifica la foto
                    if ctx_info is None:
                        ctx_info = respaldo_carrusel
                    if ctx_info:
                        ctx_info = ctx_info.split("\n|MAP|")[0]
                        producto_ref = re.sub(r'\[.*?\]:\s*', '', ctx_info).strip()
                        mensaje = f"{mensaje}\n[El cliente está respondiendo sobre: {producto_ref}]"
                except Exception:
                    pass
        elif tipo == "audio":
            # ── Audio: descargar a Storage + transcribir con Whisper ────────────
            transcripcion, audio_pub_url = _procesar_audio_wa(mensaje_data, from_number)
            if control:
                guardar_conversacion(from_number, transcripcion, None, "audio", nombre_contacto, media_url=audio_pub_url)
                cache_invalidate("chats_lista")
                return {"status": "ok"}
            resp_audio = None
            if transcripcion and not transcripcion.startswith("["):
                try:
                    hist_audio = obtener_historial(from_number) + [{"role": "user", "content": transcripcion}]
                    r_audio = llamar_claude(hist_audio, sistema)
                    resp_audio = procesar_y_enviar_respuesta(from_number, r_audio)
                except Exception as e:
                    print(f"[chatbot] Error Claude audio: {e}")
            guardar_conversacion(from_number, transcripcion, resp_audio, "audio", nombre_contacto, media_url=audio_pub_url)
            cache_invalidate("chats_lista")
            return {"status": "ok"}
        elif tipo == "document":
            # ── Documento: descargar a Storage ───────────────────────────────────
            fname, doc_url = _procesar_documento_wa(mensaje_data, from_number)
            guardar_conversacion(from_number, f"[Documento] {fname}", None, "documento", nombre_contacto, media_url=doc_url)
            cache_invalidate("chats_lista")
            return {"status": "ok"}
        elif tipo == "video":
            # ── Video: descargar a Storage ───────────────────────────────────────
            vid_url = _procesar_video_wa(mensaje_data, from_number)
            guardar_conversacion(from_number, "[Video]", None, "video", nombre_contacto, media_url=vid_url)
            cache_invalidate("chats_lista")
            return {"status": "ok"}
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
                    from fastapi.concurrency import run_in_threadpool
                    mensajes_h = obtener_historial(from_number) + [{"role": "user", "content": btn_title}]
                    respuesta_claude = await run_in_threadpool(llamar_claude, mensajes_h, construir_sistema(construir_catalogo(cargar_catalogo(), es_mayorista_registrado(from_number)), obtener_pedidos_cliente(from_number), es_mayorista_registrado(from_number)))
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
                    from fastapi.concurrency import run_in_threadpool
                    mensajes_h = obtener_historial(from_number) + [{"role": "user", "content": row_title}]
                    respuesta_claude = await run_in_threadpool(llamar_claude, mensajes_h, construir_sistema(construir_catalogo(cargar_catalogo(), es_mayorista_registrado(from_number)), obtener_pedidos_cliente(from_number), es_mayorista_registrado(from_number)))
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

        # ── FLUJO por palabra clave (automatización estilo ManyChat) ──
        # Aquí el bot está activo (control es falsy). Si el mensaje coincide con un
        # flujo activo, respondemos con su texto y NO gastamos una llamada a Claude.
        try:
            _resp_flujo = _buscar_flujo(mensaje, en_control=False)
        except Exception:
            _resp_flujo = None
        if _resp_flujo:
            enviar_whatsapp_texto(from_number, _resp_flujo)
            guardar_conversacion(from_number, mensaje, _resp_flujo, "texto", nombre_contacto)
            cache_invalidate("chats_lista")
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
        from fastapi.concurrency import run_in_threadpool
        for intento in range(2):  # 1 reintento
            try:
                respuesta_claude = await run_in_threadpool(llamar_claude, mensajes_claude, sistema)
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
        # Actualizar la fila existente con la respuesta (evita duplicar el mensaje del cliente)
        try:
            latest = supabase_get(
                f"conversaciones_whatsapp?telefono=eq.{from_number}"
                f"&tipo=eq.texto&respuesta=is.null&order=created_at.desc&limit=1"
            )
            if latest:
                supabase_patch(
                    f"conversaciones_whatsapp?id=eq.{latest[0]['id']}",
                    {"respuesta": texto_guardado or respuesta_claude}
                )
                cache_invalidate("chats_lista")
            else:
                guardar_conversacion(from_number, mensaje_final, texto_guardado or respuesta_claude, "texto", nombre_contacto)
        except Exception as patch_err:
            print(f"[chatbot] Error actualizando respuesta en fila existente: {patch_err}")
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
def verificar_webhook(request: Request):
    params = dict(request.query_params)
    mode = params.get("hub.mode")
    token = params.get("hub.verify_token")
    challenge = params.get("hub.challenge")
    if _WA_VERIFY_TOKEN and mode == "subscribe" and token == _WA_VERIFY_TOKEN:
        return int(challenge)
    return JSONResponse(status_code=403, content={"error": "Token invalido"})


# ── MESSENGER + INSTAGRAM (mismo Meta App que WhatsApp) ──────────────────
# Reusa el mismo "cerebro" de Maya (catalogo, flujos por palabra clave,
# Claude, historial) -- solo cambia como se reciben y mandan los mensajes.
# v1: solo texto. Los marcadores de Maya para fotos/pago (pensados para
# WhatsApp) se limpian del texto en vez de ejecutarse.
_FB_VERIFY_TOKEN = os.getenv("FB_VERIFY_TOKEN", "")
FB_PAGE_ACCESS_TOKEN = os.getenv("FB_PAGE_ACCESS_TOKEN", "")

@router.get("/meta")
def verificar_webhook_meta(request: Request):
    params = dict(request.query_params)
    mode = params.get("hub.mode")
    token = params.get("hub.verify_token")
    challenge = params.get("hub.challenge")
    if _FB_VERIFY_TOKEN and mode == "subscribe" and token == _FB_VERIFY_TOKEN:
        return int(challenge)
    return JSONResponse(status_code=403, content={"error": "Token invalido"})


def _limpiar_respuesta_ia_meta(texto: str) -> str:
    """Quita marcadores internos de Maya (fotos/colores/pago, pensados para
    WhatsApp) del texto antes de mandarlo por Messenger/Instagram."""
    limpio = re.sub(r'ENVIAR_FOTO:\[[^\]]+\]', '', texto or '')
    limpio = re.sub(r'ENVIAR_FOTO:\S+', '', limpio)
    limpio = re.sub(r'BUSCAR_COLORES:\[?[A-Za-z0-9_\-]+\]?', '', limpio)
    _, limpio = _extraer_generar_pago(limpio)
    return limpio.strip()


def _enviar_mensaje_meta(destinatario_id: str, texto: str):
    """Manda un mensaje de texto por la Send API de Meta -- misma llamada para
    Messenger e Instagram cuando se usa el token de la pagina."""
    if not FB_PAGE_ACCESS_TOKEN:
        print("[meta webhook] FB_PAGE_ACCESS_TOKEN no configurado, no se pudo responder")
        return
    try:
        body = json.dumps({
            "recipient": {"id": destinatario_id},
            "message": {"text": texto},
            "messaging_type": "RESPONSE",
        }).encode()
        req = urllib.request.Request(
            f"https://graph.facebook.com/v21.0/me/messages?access_token={FB_PAGE_ACCESS_TOKEN}",
            data=body, headers={"Content-Type": "application/json"}, method="POST"
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            resp.read()
    except urllib.error.HTTPError as e:
        print(f"[meta webhook] Error enviando mensaje: {e.read().decode()}")
    except Exception as e:
        print(f"[meta webhook] Error enviando mensaje: {e}")


# ── Comentarios públicos (Facebook feed / Instagram comments) ───────────────
_META_IDS_CACHE: dict = {}

def _obtener_ids_propios_meta() -> tuple:
    """Devuelve (page_id, ig_id) de la cuenta conectada -- para distinguir un
    comentario nuevo de un cliente de un eco de la respuesta que Maya misma
    acaba de publicar (evita que se responda a si misma en loop)."""
    if _META_IDS_CACHE:
        return _META_IDS_CACHE.get("page_id", ""), _META_IDS_CACHE.get("ig_id", "")
    if not FB_PAGE_ACCESS_TOKEN:
        return "", ""
    try:
        req = urllib.request.Request(
            f"https://graph.facebook.com/v21.0/me?fields=id,instagram_business_account&access_token={FB_PAGE_ACCESS_TOKEN}"
        )
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read())
        page_id = data.get("id", "")
        ig_id = (data.get("instagram_business_account") or {}).get("id", "")
        _META_IDS_CACHE["page_id"] = page_id
        _META_IDS_CACHE["ig_id"] = ig_id
        return page_id, ig_id
    except Exception as e:
        print(f"[meta webhook] Error resolviendo ids propios: {e}")
        return "", ""


def _sistema_comentario_meta(catalogo: str) -> str:
    return f"""Eres Maya, la cuenta de Zapatillas May respondiendo comentarios PUBLICOS en una publicacion de Facebook o Instagram.

SOBRE ZAPATILLAS MAY:
- Calzado de moda para dama en Leon, Guanajuato. Envios a todo Mexico, USA y Canada.

CATALOGO ACTUAL (precios y tallas reales -- usalos tal cual, sin inventar ni calcular):
{catalogo if catalogo else "Catálogo en actualización"}

REGLAS PARA COMENTARIOS PUBLICOS (todo mundo lo ve, no es un chat privado):
- Responde en 1-2 lineas, tono amigable de marca, nunca como robot.
- Si preguntan precio, tallas o disponibilidad de un modelo del catalogo: contesta con el dato EXACTO del catalogo.
- NUNCA pidas datos personales (direccion, telefono, email) en el comentario -- si hace falta cerrar una venta, invita a mandar mensaje directo: "Te esperamos por inbox para tu pedido 💕"
- NUNCA generes links de pago ni uses marcadores internos (ENVIAR_FOTO, BUSCAR_COLORES, GENERAR_PAGO) -- aqui no aplican.
- Si el comentario no tiene relacion con el negocio, es spam o solo un emoji: responde algo breve y cordial (ej. un emoji o "¡Gracias! 😊"), nunca lo ignores por completo.
- Responde siempre en español mexicano natural."""


def _responder_comentario_meta(comment_id: str, texto: str, plataforma: str):
    """Publica una respuesta a un comentario -- POST /{id}/comments en Facebook,
    POST /{id}/replies en Instagram (mismo Page Access Token para ambos)."""
    if not FB_PAGE_ACCESS_TOKEN or not comment_id or not texto:
        return
    endpoint = "replies" if plataforma == "instagram" else "comments"
    try:
        body = urllib.parse.urlencode({"message": texto}).encode()
        req = urllib.request.Request(
            f"https://graph.facebook.com/v21.0/{comment_id}/{endpoint}?access_token={FB_PAGE_ACCESS_TOKEN}",
            data=body, method="POST"
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            resp.read()
    except urllib.error.HTTPError as e:
        print(f"[meta webhook] Error respondiendo comentario: {e.read().decode()}")
    except Exception as e:
        print(f"[meta webhook] Error respondiendo comentario: {e}")


async def _procesar_comentarios_meta(datos: dict):
    """Procesa comentarios nuevos en publicaciones (campo 'feed' de Facebook,
    campo 'comments' de Instagram) y responde publicamente con IA."""
    try:
        page_id, ig_id = _obtener_ids_propios_meta()
        for entry in datos.get("entry", []):
            for change in entry.get("changes", []):
                campo = change.get("field", "")
                valor = change.get("value", {}) or {}

                if campo == "feed":
                    if valor.get("item") != "comment" or valor.get("verb") != "add":
                        continue
                    comment_id = valor.get("comment_id", "")
                    autor_id = valor.get("sender_id", "")
                    texto_comentario = (valor.get("message") or "").strip()
                    plataforma = "facebook"
                elif campo == "comments":
                    comment_id = valor.get("id", "")
                    autor_id = (valor.get("from") or {}).get("id", "")
                    texto_comentario = (valor.get("text") or "").strip()
                    plataforma = "instagram"
                else:
                    continue

                if not comment_id or not texto_comentario:
                    continue
                if autor_id and page_id and autor_id == page_id:
                    continue  # eco de nuestra propia respuesta
                if autor_id and ig_id and autor_id == ig_id:
                    continue
                if _wamid_duplicado(f"comment:{comment_id}"):
                    continue

                if not _maya_activa_global():
                    identificador_c = f"{'ig' if plataforma == 'instagram' else 'fb'}coment:{autor_id or comment_id}"
                    guardar_conversacion(identificador_c, texto_comentario, None, "comentario_publico", "", canal=f"{plataforma}_comentario")
                    continue

                try:
                    productos = cargar_catalogo()
                    catalogo = construir_catalogo(productos)
                    sistema_comentario = _sistema_comentario_meta(catalogo)
                    respuesta = llamar_claude([{"role": "user", "content": texto_comentario}], sistema_comentario)
                    respuesta_limpia = _limpiar_respuesta_ia_meta(respuesta).strip()
                except Exception as e:
                    respuesta_limpia = ""
                    print(f"[meta webhook] Error IA comentario: {e}")

                if respuesta_limpia:
                    _responder_comentario_meta(comment_id, respuesta_limpia, plataforma)
                    identificador_c = f"{'ig' if plataforma == 'instagram' else 'fb'}coment:{autor_id or comment_id}"
                    guardar_conversacion(identificador_c, texto_comentario, respuesta_limpia, "comentario_publico", "", canal=f"{plataforma}_comentario")
    except Exception as e:
        print(f"[meta webhook] Error procesando comentarios: {e}")


async def _procesar_webhook_meta(datos: dict):
    try:
        await _procesar_comentarios_meta(datos)

        object_type = datos.get("object", "")
        canal = "instagram" if object_type == "instagram" else "messenger"
        prefijo = "ig" if canal == "instagram" else "msgr"

        for entry in datos.get("entry", []):
            for evento in entry.get("messaging", []):
                mensaje_obj = evento.get("message") or {}
                if mensaje_obj.get("is_echo"):
                    continue  # eco de un mensaje que mando la pagina misma -- ignorar
                sender_id = (evento.get("sender") or {}).get("id", "")
                mid = mensaje_obj.get("mid", "")
                texto = (mensaje_obj.get("text") or "").strip()
                if not sender_id:
                    continue
                if mid and _wamid_duplicado(mid):
                    continue

                identificador = f"{prefijo}:{sender_id}"

                if not texto:
                    guardar_conversacion(identificador, "[Adjunto no soportado todavía]", None, "no_soportado", "", canal=canal)
                    continue

                control = supabase_get(f"chats_control?telefono=eq.{identificador}&en_control=eq.true")
                control = _liberar_control_si_expiro(identificador, control)
                if control or not _maya_activa_global():
                    guardar_conversacion(identificador, texto, None, "texto", "", canal=canal)
                    continue

                _resp_flujo = None
                try:
                    _resp_flujo = _buscar_flujo(texto, en_control=False)
                except Exception:
                    pass
                if _resp_flujo:
                    _enviar_mensaje_meta(sender_id, _resp_flujo)
                    guardar_conversacion(identificador, texto, _resp_flujo, "texto", "", canal=canal)
                    continue

                try:
                    productos = cargar_catalogo()
                    catalogo = construir_catalogo(productos)
                    sistema = construir_sistema(catalogo, [])
                    historial = obtener_historial(identificador)
                    mensajes_h = historial + [{"role": "user", "content": texto}]
                    respuesta = llamar_claude(mensajes_h, sistema)
                    respuesta_limpia = _limpiar_respuesta_ia_meta(respuesta)
                except Exception as e:
                    respuesta = None
                    respuesta_limpia = "Disculpa, tuve un problema técnico 😔 ¿Puedes repetir tu mensaje?"
                    print(f"[meta webhook] Error Claude: {e}")

                if respuesta_limpia:
                    _enviar_mensaje_meta(sender_id, respuesta_limpia)
                guardar_conversacion(identificador, texto, respuesta or respuesta_limpia, "texto", "", canal=canal)
    except Exception as e:
        print(f"[meta webhook] Error procesando: {e}")


@router.post("/meta")
async def recibir_webhook_meta(request: Request):
    """Recibe webhooks de Messenger e Instagram. Responde 200 de inmediato y
    procesa en segundo plano, igual que /whatsapp (evita reintentos/duplicados
    de Meta si Claude tarda)."""
    import asyncio
    raw_body = await request.body()
    if not _verificar_firma_meta(raw_body, request.headers.get("X-Hub-Signature-256", "")):
        print("[meta webhook] firma invalida - request rechazado")
        return JSONResponse(status_code=403, content={"error": "firma invalida"})
    try:
        datos = json.loads(raw_body) if raw_body else {}
    except Exception:
        datos = {}
    asyncio.create_task(_procesar_webhook_meta(datos))
    return {"status": "ok"}


@router.post("/mensaje")
def procesar_mensaje(datos: dict):
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

def _chats_desde_mensajes_legado() -> dict:
    """Método anterior: arma los chats con los últimos 400 mensajes (solo respaldo si falla la función SQL)."""
    # Solo los campos necesarios para la lista + límite 400 mensajes recientes
    try:
        conversaciones = supabase_get(
            "conversaciones_whatsapp"
            "?order=created_at.desc"
            "&limit=400"
            "&select=telefono,nombre_contacto,created_at,leido,mensaje,respuesta,tipo,wa_message_id,media_url,canal,reply_to_wa_id"
        )
    except Exception:
        conversaciones = supabase_get(
            "conversaciones_whatsapp"
            "?order=created_at.desc"
            "&limit=400"
            "&select=telefono,nombre_contacto,created_at,leido,mensaje,respuesta,tipo,wa_message_id"
        )
    chats = {}
    for m in conversaciones:
        tel = m['telefono']
        if tel not in chats:
            chats[tel] = {
                "telefono": tel,
                "nombre": None,
                "canal": m.get('canal') or 'whatsapp',
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
    return chats


_MOTIVOS_FALLO_WA = {
    131042: "La cuenta de WhatsApp Business no tiene método de pago: Meta no entrega las plantillas hasta que se agregue uno (Meta Business → Facturación → Agregar método de pago).",
    131049: "WhatsApp decidió no entregar este mensaje de plantilla (protege a las clientas de mensajes promocionales que no pidieron: suele pasar si ella no ha escrito en mucho tiempo). Pídele que te escriba y vuelve a intentar.",
    131026: "El número no tiene WhatsApp, no está disponible o no aceptó los términos de WhatsApp.",
    131047: "Pasaron más de 24 h desde su último mensaje: solo se puede mandar una plantilla aprobada.",
    131048: "WhatsApp limitó los envíos de la cuenta por calidad (demasiados reportes de spam).",
    131051: "Tipo de mensaje no compatible con su WhatsApp.",
    130472: "El número está en una prueba de Meta y no recibe este mensaje.",
    132000: "La plantilla lleva más (o menos) datos de los que pide.",
    132001: "La plantilla no existe o no está aprobada en ese idioma.",
    132005: "El texto de la plantilla quedó muy largo al llenarlo.",
    132007: "La plantilla infringe las políticas de WhatsApp y está pausada.",
    132012: "Los datos de la plantilla no tienen el formato correcto.",
    132015: "La plantilla está pausada por baja calidad.",
    132016: "La plantilla está deshabilitada por baja calidad.",
}


def _registrar_fallo_wa(recipient: str, wamid: str, errores: list):
    """Deja en el chat una nota «No se pudo entregar…» (solo una vez por mensaje, aunque Meta reintente el aviso)."""
    marca = f"{wamid}#fallo"
    if supabase_get(f"conversaciones_whatsapp?wa_message_id=eq.{urllib.parse.quote(marca, safe='')}&select=id&limit=1"):
        return
    e = (errores or [{}])[0]
    codigo = e.get("code")
    motivo = _MOTIVOS_FALLO_WA.get(codigo) or (e.get("error_data") or {}).get("details") or e.get("message") or e.get("title") or "sin detalle"
    supabase_post("conversaciones_whatsapp", {
        "telefono": recipient,
        "mensaje": f"[Sistema]: ⚠️ No se pudo entregar un mensaje a la clienta (código {codigo}): {motivo}",
        "respuesta": None, "tipo": "manual", "wa_message_id": marca, "leido": True,
    })
    cache_invalidate("chats_lista")


def _variantes_tel(telefono) -> list:
    """Las formas en que puede estar guardado el mismo número de México: 10 dígitos, 52+10 y 521+10 (WhatsApp usa una u otra
    según el mensaje: las plantillas se guardaban como 52+10 y las respuestas de la clienta llegan como 521+10, y por eso una
    misma persona aparecía en dos conversaciones)."""
    d = "".join(ch for ch in str(telefono or "") if ch.isdigit())
    if len(d) < 10:
        return [d] if d else []
    t10 = d[-10:]
    base = d[:-10]
    if base in ("", "52", "521"):
        return [t10, "52" + t10, "521" + t10]
    return [d]


def _nombres_desde_clientes(chats: dict) -> dict:
    """A los chats que solo muestran el número (WhatsApp no mandó nombre de perfil) se les pone el nombre del cliente dado de alta
    con ese mismo teléfono (se compara por los últimos 10 dígitos, sin importar cómo esté escrito). No modifica la base de datos."""
    pendientes = {}
    for tel, ch in chats.items():
        nom = str(ch.get("nombre") or "").strip()
        if not nom or nom.isdigit() or nom == str(tel):
            pendientes[_tel10(tel)] = tel
    if not pendientes:
        return chats
    mapa = cache_get("clientes_tel_nombre")
    if mapa is None:
        mapa = {}
        try:
            for cli in (supabase_get_all("clientes?select=nombre,telefono&order=id.asc") or []):
                t10 = _tel10(cli.get("telefono"))
                nom = (cli.get("nombre") or "").strip()
                if len(t10) == 10 and nom and t10 not in mapa:
                    mapa[t10] = nom
        except Exception as e:
            print(f"[chats] no se pudieron leer los clientes para poner nombres: {e}")
        cache_set("clientes_tel_nombre", mapa, ttl=600)
    for t10, tel in pendientes.items():
        if mapa.get(t10):
            chats[tel]["nombre"] = mapa[t10]
            chats[tel]["nombre_de_cliente"] = True
    return chats


def _unir_chats_duplicados(chats: dict) -> dict:
    """Junta en un solo chat los que son del mismo número (misma clienta con 52… y 521…). El chat que se conserva es el
    que tiene mensajes entrantes (el de 521…); el otro se suma como alias para leer su historial."""
    grupos = {}
    for tel, ch in chats.items():
        v = _variantes_tel(tel)
        clave = v[0] if (len(v) == 3) else tel
        grupos.setdefault(clave, []).append(tel)
    salida = {}
    for clave, tels in grupos.items():
        if len(tels) == 1:
            salida[tels[0]] = chats[tels[0]]
            continue
        # canónico: el que tiene entrantes; si hay empate, el que empieza con 521
        tels.sort(key=lambda t: (0 if chats[t].get("ult_entrante") else 1, 0 if str(t).startswith("521") else 1))
        canon = tels[0]
        base = dict(chats[canon])
        msgs, vistos = [], set()
        for t in tels:
            for m in (chats[t].get("mensajes") or []):
                k = m.get("wa_message_id") or m.get("id") or ((m.get("created_at") or "") + (m.get("mensaje") or ""))
                if k in vistos:
                    continue
                vistos.add(k)
                msgs.append(m)
        msgs.sort(key=lambda m: m.get("created_at") or "", reverse=True)
        base["mensajes"] = msgs[:8]
        base["no_leidos"] = sum((chats[t].get("no_leidos") or 0) for t in tels)
        for campo in ("ult_entrante", "ult_saliente", "ultimo_mensaje"):
            vals = [chats[t].get(campo) for t in tels if chats[t].get(campo)]
            if vals:
                base[campo] = max(vals, key=lambda x: str(x))
        nombres = [chats[t].get("nombre") for t in tels if chats[t].get("nombre") and not str(chats[t].get("nombre")).isdigit()]
        if nombres:
            base["nombre"] = nombres[0]
        base["telefonos_alias"] = [t for t in tels if t != canon]
        salida[canon] = base
    return salida


@router.get("/chats")
def listar_chats():
    # Caché 20s — el frontend poll cada 30s, así casi siempre lo sirve de memoria
    cached = cache_get("chats_lista")
    if cached is not None:
        return cached
    try:
        chats = {}
        try:
            # Lista COMPLETA de chats (función SQL): los N chats con actividad más reciente, con conteo real de no leídos
            # y cuándo escribió la clienta / se le respondió. Antes se leían solo los últimos 400 MENSAJES y las clientas
            # con conversaciones más antiguas (73% hoy: 140 de 192) no aparecían en el panel.
            from database import supabase_rpc
            for it in (supabase_rpc("chats_lista", {"p_limite": 400, "p_msgs": 4}) or []):
                msgs = it.get("mensajes") or []
                tel = it["telefono"]
                chats[tel] = {
                    "telefono": tel,
                    "nombre": it.get("nombre_contacto") or tel,
                    "canal": (msgs[0].get("canal") if msgs else None) or "whatsapp",
                    "mensajes": msgs,
                    "ultimo_mensaje": it.get("ultimo_mensaje"),
                    "no_leidos": it.get("no_leidos") or 0,
                    "ult_entrante": it.get("ult_entrante"),
                    "ult_saliente": it.get("ult_saliente"),
                    "en_control": False,
                    "agente": None,
                    "etiqueta": "sin_etiqueta",
                }
        except Exception as e_rpc:
            print(f"[chats] RPC chats_lista no disponible, uso el método anterior: {e_rpc}")
            chats = _chats_desde_mensajes_legado()
        chats = _unir_chats_duplicados(chats)
        chats = _nombres_desde_clientes(chats)
        # Intentar con columnas nuevas, fallback a columnas base si no existen aún
        try:
            control = supabase_get("chats_control?select=telefono,en_control,agente,etiqueta,cliente_leyo_at,cliente_entrego_at,pendiente_revision,estado,mayorista,origen,archivado,archivado_at")
        except Exception:
            try:
                control = supabase_get("chats_control?select=telefono,en_control,agente,etiqueta,cliente_leyo_at,cliente_entrego_at,pendiente_revision,estado,mayorista")
            except Exception:
                control = None
        if control is None:
            try:
                control = supabase_get("chats_control?select=telefono,en_control,agente,etiqueta,cliente_leyo_at,cliente_entrego_at,pendiente_revision,estado")
            except Exception:
                try:
                    control = supabase_get("chats_control?select=telefono,en_control,agente,etiqueta,cliente_leyo_at,cliente_entrego_at,pendiente_revision")
                except Exception:
                    control = supabase_get("chats_control?select=telefono,en_control,agente,etiqueta")
        # el control de un número se busca en todas sus variantes (los avisos de entregado/leído llegan con 521…)
        _alias = {}
        for _canon, _ch in chats.items():
            for _t in [_canon] + (_ch.get("telefonos_alias") or []):
                _alias[_t] = _canon
        control = sorted(control or [], key=lambda x: 1 if x.get('telefono') in chats else 0)   # el del chat canónico se aplica al final
        for c in control:
            _k = _alias.get(c['telefono'])
            if _k and _k != c['telefono']:
                if c.get('archivado') and not chats[_k].get('archivado'):
                    chats[_k]['archivado'] = True
                    chats[_k]['archivado_at'] = c.get('archivado_at')
                for _campo in ('cliente_leyo_at', 'cliente_entrego_at'):
                    if c.get(_campo) and str(c.get(_campo)) > str(chats[_k].get(_campo) or ''):
                        chats[_k][_campo] = c.get(_campo)
                continue
            if c['telefono'] in chats:
                chats[c['telefono']]['en_control'] = c.get('en_control', False)
                chats[c['telefono']]['agente'] = c.get('agente')
                chats[c['telefono']]['etiqueta'] = c.get('etiqueta', 'sin_etiqueta')
                chats[c['telefono']]['cliente_leyo_at'] = c.get('cliente_leyo_at')
                chats[c['telefono']]['cliente_entrego_at'] = c.get('cliente_entrego_at')
                chats[c['telefono']]['pendiente_revision'] = c.get('pendiente_revision', False)
                chats[c['telefono']]['estado'] = c.get('estado', 'abierto')
                chats[c['telefono']]['mayorista'] = c.get('mayorista', False)
                chats[c['telefono']]['origen'] = c.get('origen')
                chats[c['telefono']]['archivado'] = bool(c.get('archivado'))
                chats[c['telefono']]['archivado_at'] = c.get('archivado_at')
        # un chat archivado vuelve a la lista si la clienta escribió después de archivarlo
        for _ch in chats.values():
            if _ch.get('archivado') and _ch.get('archivado_at') and _ch.get('ult_entrante'):
                try:
                    import datetime as _dt
                    _a = _dt.datetime.fromisoformat(str(_ch['archivado_at']).replace('Z', '+00:00'))
                    _e = _dt.datetime.fromisoformat(str(_ch['ult_entrante']).replace('Z', '+00:00'))
                    if _a.tzinfo is None:
                        _a = _a.replace(tzinfo=_dt.timezone.utc)
                    if _e.tzinfo is None:
                        _e = _e.replace(tzinfo=_dt.timezone.utc)
                    if _e > _a:
                        _ch['archivado'] = False
                except Exception:
                    pass
        result = list(chats.values())
        cache_set("chats_lista", result, ttl=20)
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/chats/{telefono}/mensajes")
def listar_mensajes_chat(telefono: str):
    """Historial individual de un chat (últimos 150 mensajes, con media_url)."""
    try:
        _vars = _variantes_tel(telefono) or [telefono]
        msgs = supabase_get(
            f"conversaciones_whatsapp"
            f"?telefono=in.({','.join(_vars)})"
            f"&order=created_at.desc"
            f"&limit=150"
            f"&select=id,telefono,nombre_contacto,created_at,leido,mensaje,respuesta,tipo,wa_message_id,media_url,reply_to_wa_id"
        )
        return msgs or []
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/conversaciones")
def listar_conversaciones():
    try:
        return supabase_get("conversaciones_whatsapp?order=created_at.desc&limit=100")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/chats/{telefono}/control")
def tomar_control(telefono: str, datos: dict):
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
def enviar_mensaje_manual(telefono: str, datos: dict):
    try:
        from database import supabase_post
        mensaje = datos.get("mensaje", "")
        agente = datos.get("agente", "Admin")
        reply_to = datos.get("reply_to_wa_id")
        if not mensaje:
            return JSONResponse(status_code=400, content={"error": "Mensaje vacio"})

        if telefono.startswith("igcoment:") or telefono.startswith("fbcoment:"):
            return JSONResponse(status_code=400, content={
                "error": "Los comentarios públicos todavía no se pueden contestar desde aquí — responde directamente en Instagram/Facebook."
            })

        wa_id = None
        if telefono.startswith("msgr:") or telefono.startswith("ig:"):
            destinatario_id = telefono.split(":", 1)[1]
            _enviar_mensaje_meta(destinatario_id, mensaje)
        else:
            wa_id = enviar_whatsapp_texto(telefono, mensaje, reply_to_id=reply_to)
            if not wa_id:
                # Antes igual se guardaba como enviado y se respondía ok: la asesora creía haber contestado.
                return JSONResponse(status_code=502, content={"error": _explicar_error_wa()})
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
        if reply_to:
            row["reply_to_wa_id"] = reply_to
        try:
            supabase_post("conversaciones_whatsapp", row)
        except Exception:
            if "reply_to_wa_id" not in row:
                raise
            row.pop("reply_to_wa_id", None)   # por si el cache de columnas aún no la conoce: el mensaje ya salió, se guarda igual
            supabase_post("conversaciones_whatsapp", row)
        cache_invalidate("chats_lista")
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/chats/{telefono}/imagen")
def enviar_imagen_manual(telefono: str, datos: dict):
    try:
        from database import supabase_post
        imagen_url = datos.get("imagen_url", "")
        caption = datos.get("caption", "")
        agente = datos.get("agente", "Admin")
        if not enviar_whatsapp_imagen(telefono, imagen_url, caption):
            return JSONResponse(status_code=502, content={"error": _explicar_error_wa()})
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

@router.get("/stickers")
def listar_stickers():
    """Stickers guardados para mandar desde el panel."""
    try:
        return supabase_get("stickers?select=id,url&order=created_at.desc&limit=200") or []
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/stickers")
def guardar_sticker(archivo: UploadFile = File(None), url: str = Form("")):
    """Guarda un sticker: o se sube un .webp (el panel convierte la imagen a 512x512) o se guarda uno recibido (url de nuestro Storage)."""
    try:
        supabase_url = os.environ.get("SUPABASE_URL", "")
        if archivo is not None:
            datos = archivo.file.read(300 * 1024 + 1)
            if len(datos) > 300 * 1024:
                return JSONResponse(status_code=400, content={"error": "El sticker pesa demasiado (máx. 300 KB)"})
            if not (datos[:4] == b"RIFF" and datos[8:12] == b"WEBP"):
                return JSONResponse(status_code=400, content={"error": "El sticker debe ser .webp"})
            url = subir_imagen_storage(datos, f"sticker_{int(time.time() * 1000)}.webp", content_type="image/webp")
            if not url:
                return JSONResponse(status_code=500, content={"error": "No se pudo guardar el sticker"})
        elif not (supabase_url and url.startswith(supabase_url + "/storage/v1/object/public/wa-media/")):
            return JSONResponse(status_code=400, content={"error": "Sticker no válido"})
        if supabase_get(f"stickers?url=eq.{urllib.parse.quote(url, safe='')}&select=id&limit=1"):
            return {"ok": True, "ya_estaba": True}
        supabase_post("stickers", {"url": url})
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.delete("/stickers/{id}")
def borrar_sticker(id: str):
    try:
        supabase_delete(f"stickers?id=eq.{urllib.parse.quote(id, safe='')}")
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/chats/{telefono}/sticker")
def enviar_sticker_manual(telefono: str, datos: dict):
    """Manda un sticker guardado (webp de nuestro Storage) por WhatsApp."""
    try:
        url = datos.get("url", "")
        agente = datos.get("agente", "Admin")
        supabase_url = os.environ.get("SUPABASE_URL", "")
        if not (supabase_url and url.startswith(supabase_url + "/storage/v1/object/public/wa-media/")):
            return JSONResponse(status_code=400, content={"error": "Sticker no válido"})
        wamid = _wa_send({"messaging_product": "whatsapp", "to": telefono, "type": "sticker", "sticker": {"link": url}})
        if not wamid:
            return JSONResponse(status_code=502, content={"error": _explicar_error_wa()})
        supabase_post("conversaciones_whatsapp", {
            "telefono": telefono, "mensaje": f"[{agente}]: [Imagen] {url}\n", "respuesta": None,
            "tipo": "imagen_saliente", "leido": True, "wa_message_id": wamid,
        })
        cache_invalidate("chats_lista")
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.patch("/chats/{telefono}/leido")
def marcar_leido(telefono: str):
    try:
        from database import supabase_patch
        supabase_patch(f"conversaciones_whatsapp?telefono=eq.{telefono}&leido=eq.false", {"leido": True})
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/chats/{telefono}/etiqueta")
def cambiar_etiqueta(telefono: str, datos: dict):
    try:
        from database import supabase_post, supabase_patch
        etiqueta = datos.get("etiqueta", "sin_etiqueta")
        existente = supabase_get(f"chats_control?telefono=eq.{telefono}")
        if existente:
            supabase_patch(f"chats_control?telefono=eq.{telefono}", {"etiqueta": etiqueta})
        else:
            supabase_post("chats_control", {"telefono": telefono, "etiqueta": etiqueta})
        _inscribir_en_secuencias(telefono, etiqueta)
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/chats/{telefono}/mayorista")
def marcar_mayorista(telefono: str, datos: dict):
    """Marca/desmarca manualmente una conversación como mayorista -- para gente
    que pregunta por mayoreo pero todavía no está registrada como cliente
    tipo mayoreo/zapateria (esa detección automática por tipo de cliente vive
    en el frontend, pero deja fuera a los leads que aún no compran)."""
    try:
        from database import supabase_post, supabase_patch
        mayorista = bool(datos.get("mayorista", True))
        existente = supabase_get(f"chats_control?telefono=eq.{telefono}")
        if existente:
            supabase_patch(f"chats_control?telefono=eq.{telefono}", {"mayorista": mayorista})
        else:
            supabase_post("chats_control", {"telefono": telefono, "mayorista": mayorista})
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/diagnostico-claude")
def diagnostico_claude():
    """Temporal: prueba la conexión con la API de Claude y muestra el error exacto si falla."""
    key = get_api_key()
    resultado = {"api_key_configurada": bool(key), "api_key_prefix": (key[:12] + "...") if key else None}
    try:
        respuesta = llamar_claude([{"role": "user", "content": "Responde solo con: ok"}], "Eres un asistente de prueba.")
        resultado["status"] = "ok"
        resultado["respuesta"] = respuesta
    except Exception as e:
        resultado["status"] = "error"
        resultado["error"] = str(e)
    return resultado

@router.get("/config")
def obtener_config():
    try:
        config = supabase_get("whatsapp_config")
        return {c['clave']: c['valor'] for c in config}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/config")
def guardar_config(datos: dict):
    try:
        from database import supabase_patch, supabase_post
        for clave, valor in datos.items():
            existente = supabase_get(f"whatsapp_config?clave=eq.{clave}")
            if existente:
                supabase_patch(f"whatsapp_config?clave=eq.{clave}", {"valor": str(valor)})
            else:
                supabase_post("whatsapp_config", {"clave": clave, "valor": str(valor)})
        if "bot_activo" in datos:
            cache_invalidate("maya_activa_global")
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/respuestas-rapidas")
def obtener_respuestas():
    try:
        return supabase_get("respuestas_rapidas?order=orden.asc")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/respuestas-rapidas")
def crear_respuesta(datos: dict):
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
def actualizar_respuesta(id: str, datos: dict):
    try:
        from database import supabase_patch
        supabase_patch(f"respuestas_rapidas?id=eq.{id}", datos)
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.delete("/respuestas-rapidas/{id}")
def eliminar_respuesta(id: str):
    try:
        from database import supabase_delete
        supabase_delete(f"respuestas_rapidas?id=eq.{id}")
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ── FLUJOS DE AUTOMATIZACIÓN (respuestas por palabra clave, estilo ManyChat) ──
@router.get("/flujos")
def listar_flujos():
    try:
        return supabase_get("wa_flujos?order=orden.asc,created_at.asc") or []
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/flujos")
def crear_flujo(datos: dict):
    try:
        from database import supabase_post
        return supabase_post("wa_flujos", {
            "nombre": (datos.get("nombre") or "").strip() or "Flujo sin nombre",
            "activo": bool(datos.get("activo", True)),
            "palabras_clave": (datos.get("palabras_clave") or "").strip(),
            "coincidencia": datos.get("coincidencia") or "contiene",
            "respuesta": (datos.get("respuesta") or "").strip(),
            "solo_si_bot": bool(datos.get("solo_si_bot", True)),
            "orden": int(datos.get("orden") or 0),
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.patch("/flujos/{id}")
def actualizar_flujo(id: str, datos: dict):
    try:
        from database import supabase_patch
        permitidos = {"nombre", "activo", "palabras_clave", "coincidencia", "respuesta", "solo_si_bot", "orden"}
        upd = {k: v for k, v in datos.items() if k in permitidos}
        supabase_patch(f"wa_flujos?id=eq.{id}", upd)
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.delete("/flujos/{id}")
def eliminar_flujo(id: str):
    try:
        from database import supabase_delete
        supabase_delete(f"wa_flujos?id=eq.{id}")
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


def _buscar_flujo(texto: str, en_control: bool):
    """Devuelve la respuesta del primer flujo activo cuya palabra clave coincida con
    el texto entrante, o None. Reglas de coincidencia: contiene | exacta | empieza."""
    try:
        flujos = supabase_get("wa_flujos?activo=eq.true&order=orden.asc,created_at.asc") or []
    except Exception:
        return None
    t = (texto or "").strip().lower()
    if not t:
        return None
    for f in flujos:
        if f.get("solo_si_bot", True) and en_control:
            continue  # el chat lo lleva un asesor manual: no auto-responder
        modo = f.get("coincidencia") or "contiene"
        claves = [k.strip().lower() for k in (f.get("palabras_clave") or "").split(",") if k.strip()]
        for k in claves:
            hit = (t == k) if modo == "exacta" else (t.startswith(k) if modo == "empieza" else (k in t))
            if hit:
                try:
                    supabase_patch(f"wa_flujos?id=eq.{f['id']}", {"veces_disparado": (f.get("veces_disparado") or 0) + 1})
                except Exception:
                    pass
                return f.get("respuesta") or None
    return None


# ── SECUENCIAS DE MENSAJES (drip, disparadas por etapa del embudo) ──────────
@router.get("/secuencias")
def listar_secuencias():
    try:
        return supabase_get("wa_secuencias?order=created_at.asc") or []
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/secuencias")
def crear_secuencia(datos: dict):
    try:
        from database import supabase_post
        pasos = datos.get("pasos") or []
        pasos = [{"dias_espera": int(p.get("dias_espera") or 0), "mensaje": (p.get("mensaje") or "").strip()}
                 for p in pasos if (p.get("mensaje") or "").strip()]
        return supabase_post("wa_secuencias", {
            "nombre": (datos.get("nombre") or "").strip() or "Secuencia sin nombre",
            "activo": bool(datos.get("activo", True)),
            "etiqueta_disparadora": datos.get("etiqueta_disparadora") or "posible_comprador",
            "solo_si_bot": bool(datos.get("solo_si_bot", True)),
            "pasos": pasos,
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.patch("/secuencias/{id}")
def actualizar_secuencia(id: str, datos: dict):
    try:
        from database import supabase_patch
        upd = {}
        if "nombre" in datos: upd["nombre"] = (datos.get("nombre") or "").strip() or "Secuencia sin nombre"
        if "activo" in datos: upd["activo"] = bool(datos.get("activo"))
        if "etiqueta_disparadora" in datos: upd["etiqueta_disparadora"] = datos.get("etiqueta_disparadora")
        if "solo_si_bot" in datos: upd["solo_si_bot"] = bool(datos.get("solo_si_bot"))
        if "pasos" in datos:
            pasos = datos.get("pasos") or []
            upd["pasos"] = [{"dias_espera": int(p.get("dias_espera") or 0), "mensaje": (p.get("mensaje") or "").strip()}
                             for p in pasos if (p.get("mensaje") or "").strip()]
        supabase_patch(f"wa_secuencias?id=eq.{id}", upd)
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.delete("/secuencias/{id}")
def eliminar_secuencia(id: str):
    try:
        from database import supabase_delete
        supabase_delete(f"wa_secuencias?id=eq.{id}")
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


def _inscribir_en_secuencias(telefono: str, etiqueta: str):
    """Al cambiar la etapa de un chat en el embudo, inscribe el telefono en toda
    secuencia activa disparada por esa etapa (si no tiene ya una inscripción activa
    en esa misma secuencia)."""
    try:
        from database import supabase_post
        import datetime as _dt
        secuencias = supabase_get(f"wa_secuencias?activo=eq.true&etiqueta_disparadora=eq.{etiqueta}") or []
        for s in secuencias:
            pasos = s.get("pasos") or []
            if not pasos:
                continue
            ya = supabase_get(f"wa_secuencia_envios?secuencia_id=eq.{s['id']}&telefono=eq.{telefono}&estado=eq.activa") or []
            if ya:
                continue
            dias = int(pasos[0].get("dias_espera") or 0)
            proximo = (_dt.datetime.now(_dt.timezone.utc) + _dt.timedelta(days=dias)).isoformat()
            supabase_post("wa_secuencia_envios", {
                "secuencia_id": s["id"], "telefono": telefono,
                "paso_actual": 0, "proximo_envio_at": proximo, "estado": "activa",
            })
    except Exception as e:
        print(f"[secuencias-wa] error al inscribir {telefono}: {e}")


def procesar_secuencias_wa() -> dict:
    """Envía el paso que le toque a cada inscripción activa cuya hora ya llegó.
    Pensado para llamarse desde un hilo periódico (ver main.py)."""
    import datetime as _dt
    from database import supabase_patch
    ahora = _dt.datetime.now(_dt.timezone.utc)
    enviados, saltados, errores = 0, 0, 0
    try:
        pendientes = supabase_get(
            f"wa_secuencia_envios?estado=eq.activa&proximo_envio_at=lte.{urllib.parse.quote(ahora.isoformat())}"  # quote: el "+00:00" sin codificar daba HTTP 400 y ninguna secuencia salía nunca
        ) or []
    except Exception as e:
        return {"error": str(e)}

    for envio in pendientes:
        try:
            tel = envio["telefono"]
            secu = supabase_get(f"wa_secuencias?id=eq.{envio['secuencia_id']}")
            if not secu:
                supabase_patch(f"wa_secuencia_envios?id=eq.{envio['id']}", {"estado": "cancelada"})
                continue
            secu = secu[0]
            if not secu.get("activo"):
                supabase_patch(f"wa_secuencia_envios?id=eq.{envio['id']}", {"estado": "cancelada"})
                continue
            if secu.get("solo_si_bot", True):
                control = supabase_get(f"chats_control?telefono=eq.{tel}&en_control=eq.true")
                if control:
                    saltados += 1
                    continue  # asesor manual activo: reintenta en el próximo ciclo

            pasos = secu.get("pasos") or []
            paso_i = envio.get("paso_actual", 0)
            if paso_i >= len(pasos):
                supabase_patch(f"wa_secuencia_envios?id=eq.{envio['id']}", {"estado": "completada"})
                continue

            mensaje = pasos[paso_i].get("mensaje", "")
            if mensaje:
                enviar_whatsapp_texto(tel, mensaje)
                try:
                    supabase_post("conversaciones_whatsapp", {
                        "telefono": tel, "mensaje": f"[Secuencia]: {mensaje}",
                        "tipo": "secuencia_saliente", "leido": True,
                    })
                except Exception:
                    pass
                supabase_patch(f"wa_secuencias?id=eq.{secu['id']}", {"veces_disparado": (secu.get("veces_disparado") or 0) + 1})
                enviados += 1

            if paso_i + 1 < len(pasos):
                dias = int(pasos[paso_i + 1].get("dias_espera") or 0)
                proximo = (ahora + _dt.timedelta(days=dias)).isoformat()
                supabase_patch(f"wa_secuencia_envios?id=eq.{envio['id']}", {"paso_actual": paso_i + 1, "proximo_envio_at": proximo})
            else:
                supabase_patch(f"wa_secuencia_envios?id=eq.{envio['id']}", {"paso_actual": paso_i + 1, "estado": "completada"})
        except Exception as e:
            errores += 1
            print(f"[secuencias-wa] error procesando envio {envio.get('id')}: {e}")

    return {"revisados": len(pendientes), "enviados": enviados, "saltados": saltados, "errores": errores}


# ── SEGMENTOS (filtros guardados para targetear broadcasts) ─────────────────
@router.get("/segmentos")
def listar_segmentos():
    try:
        return supabase_get("wa_segmentos?order=created_at.asc") or []
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/segmentos")
def crear_segmento(datos: dict):
    try:
        from database import supabase_post
        return supabase_post("wa_segmentos", {
            "nombre": (datos.get("nombre") or "").strip() or "Segmento sin nombre",
            "filtro_etiqueta": datos.get("filtro_etiqueta") or None,
            "filtro_estado": datos.get("filtro_estado") or None,
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.delete("/segmentos/{id}")
def eliminar_segmento(id: str):
    try:
        from database import supabase_delete
        supabase_delete(f"wa_segmentos?id=eq.{id}")
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


def _actualizar_metrica_broadcast(wamid: str, status_type: str):
    """Correlaciona un recibo de Meta (delivered/read/failed) con un envío de broadcast
    por su wamid y actualiza el estado del envío + recalcula los contadores del broadcast."""
    from database import supabase_patch
    envios = supabase_get(f"wa_broadcast_envios?wa_message_id=eq.{wamid}&select=id,broadcast_id,estado") or []
    if not envios:
        return
    env = envios[0]
    nuevo = {"delivered": "entregado", "read": "leido", "failed": "fallido"}.get(status_type)
    if not nuevo:
        return
    rango = {"enviado": 0, "entregado": 1, "leido": 2}
    # No degradar (read>delivered); fallido siempre se registra.
    if nuevo != "fallido" and rango.get(nuevo, 0) <= rango.get(env.get("estado", "enviado"), 0):
        return
    supabase_patch(f"wa_broadcast_envios?id=eq.{env['id']}", {"estado": nuevo})
    bid = env.get("broadcast_id")
    if not bid:
        return
    todos = supabase_get(f"wa_broadcast_envios?broadcast_id=eq.{bid}&select=estado") or []
    entregados = sum(1 for e in todos if e.get("estado") in ("entregado", "leido"))
    leidos = sum(1 for e in todos if e.get("estado") == "leido")
    fallidos = sum(1 for e in todos if e.get("estado") == "fallido")
    supabase_patch(f"wa_broadcasts?id=eq.{bid}", {"entregados": entregados, "leidos": leidos, "fallidos": fallidos})


@router.get("/notas/{telefono}")
def obtener_notas(telefono: str):
    try:
        return supabase_get(f"notas_contacto?telefono=eq.{telefono}&order=created_at.desc")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/notas/{telefono}")
def crear_nota(telefono: str, datos: dict):
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
def eliminar_nota(id: str):
    try:
        from database import supabase_delete
        supabase_delete(f"notas_contacto?id=eq.{id}")
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/tareas/{telefono}")
def obtener_tareas(telefono: str):
    try:
        return supabase_get(f"tareas_contacto?telefono=eq.{telefono}&order=created_at.asc")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/tareas/{telefono}")
def crear_tarea(telefono: str, datos: dict):
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
def actualizar_tarea(id: str, datos: dict):
    try:
        from database import supabase_patch
        supabase_patch(f"tareas_contacto?id=eq.{id}", datos)
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.delete("/tareas/{id}")
def eliminar_tarea(id: str):
    try:
        from database import supabase_delete
        supabase_delete(f"tareas_contacto?id=eq.{id}")
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/tareas-hoy")
def tareas_hoy():
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
def envio_masivo(datos: dict):  # sync (no async): hace HTTP bloqueante/sleep por contacto; en async congelaba todo el servidor
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
        ya_enviados_masivo = set()
        url = f"https://graph.facebook.com/v25.0/{phone_id}/messages"
        headers = {"Authorization": f"Bearer {wa_token}", "Content-Type": "application/json"}

        for contacto in contactos:
            telefono = contacto.get("telefono", "")
            nombre = (contacto.get("nombre") or "Cliente").strip() or "Cliente"
            if not telefono:
                continue
            tel = a_e164_mx(telefono)
            if tel in ya_enviados_masivo:      # el mismo número repetido en la lista recibía el mensaje dos veces
                continue
            ya_enviados_masivo.add(tel)

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
                    # {{NOMBRE}} en cualquier variable se reemplaza por el nombre real del
                    # contacto — así el admin puede editar libremente el resto de variables
                    # (precio, código, etc.) y seguir personalizando con el nombre donde quiera.
                    # Si la plantilla usa variables CON NOMBRE (ej. {{customer_name}}), Meta
                    # exige "parameter_name" en cada parámetro — sin él rechaza con error 100
                    # "Parameter name is missing or empty".
                    body_params = []
                    for v in variables_body:
                        texto = str(v.get("text", "")).replace("{{NOMBRE}}", nombre).replace("{{nombre}}", nombre)
                        param = {"type": "text", "text": texto}
                        if v.get("parameter_name"):
                            param["parameter_name"] = v["parameter_name"]
                        body_params.append(param)
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
def envio_fotos(datos: dict):  # sync (no async): hace HTTP bloqueante/sleep por contacto; en async congelaba todo el servidor
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
            return a_e164_mx(t)

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
def plantillas_debug():
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
def autoresponder_webhook(datos: dict):
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
def wa_diagnostico(datos: dict):
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

    tel = a_e164_mx(telefono)

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


@router.post("/crear-plantilla-pedido-confirmado")
def crear_plantilla_pedido_confirmado():
    """Crea la plantilla 'pedido_confirmado' en Meta WA Business (categoria UTILITY,
    no tiene restriccion de ventana de 24h) -- respaldo cuando el cliente no escribio
    en las ultimas 24h y el texto libre de confirmacion es rechazado por Meta
    (error 131047 'Re-engagement message')."""
    wa_token = os.environ.get("WHATSAPP_TOKEN", "")
    waba_id = os.environ.get("WHATSAPP_WABA_ID", "")
    if not wa_token or not waba_id:
        return JSONResponse(status_code=500, content={"error": "Faltan WHATSAPP_TOKEN o WHATSAPP_WABA_ID en Railway"})

    plantilla = {
        "name": "pedido_confirmado",
        "language": "es_MX",
        "category": "UTILITY",
        "components": [
            {
                "type": "HEADER",
                "format": "TEXT",
                "text": "¡Tu compra está confirmada!"
            },
            {
                "type": "BODY",
                "text": (
                    "Hola {{1}}, tu pedido #{{2}} en Zapatillas May está confirmado "
                    "por ${{3}} MXN.\n\n"
                    "Ya lo estamos preparando y te avisamos en cuanto salga a envío."
                ),
                "example": {
                    "body_text": [["María", "A1B2C3D4", "850"]]
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


@router.post("/crear-plantilla-pago")
def crear_plantilla_pago():
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
                        "phone_number": "+5214792244560"
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


def _crear_plantilla_meta(plantilla: dict) -> dict:
    """Envía UNA plantilla a revisión de Meta. Devuelve {"nombre","estado","detalle"}; si ya existe no es error."""
    wa_token = os.environ.get("WHATSAPP_TOKEN", "")
    waba_id = os.environ.get("WHATSAPP_WABA_ID", "")
    url = f"https://graph.facebook.com/v25.0/{waba_id}/message_templates"
    headers = {"Authorization": f"Bearer {wa_token}", "Content-Type": "application/json"}
    try:
        req = urllib.request.Request(url, data=json.dumps(plantilla).encode(), headers=headers, method="POST")
        with urllib.request.urlopen(req, timeout=20) as r:
            resp = json.loads(r.read())
        return {"nombre": plantilla["name"], "estado": "enviada", "detalle": resp.get("status", "PENDING")}
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        if "2388024" in body or "already exist" in body.lower() or "ya existe" in body.lower():
            return {"nombre": plantilla["name"], "estado": "ya_existia", "detalle": ""}
        return {"nombre": plantilla["name"], "estado": "error", "detalle": f"HTTP {e.code}: {body[:300]}"}
    except Exception as e:
        return {"nombre": plantilla["name"], "estado": "error", "detalle": str(e)}


_PIE_PLANTILLA = {"type": "FOOTER", "text": "Zapatillas May · León, Guanajuato"}
_BOTON_WEB = {"type": "BUTTONS", "buttons": [{"type": "URL", "text": "Ir a zapatillasmay.mx", "url": "https://zapatillasmay.mx"}]}


def _plantillas_base() -> list:
    return [
        {   # panel.js (confirmar envío) la manda con [nombre, últimos 6 del pedido, guía, paquetería]
            "name": "aviso_envio", "language": "es_MX", "category": "UTILITY",
            "components": [
                {"type": "HEADER", "format": "TEXT", "text": "¡Tu pedido va en camino!"},
                {"type": "BODY",
                 "text": "Hola {{1}}, tu pedido #{{2}} de Zapatillas May ya salió a envío 📦\n\nTu guía de rastreo es {{3}} con {{4}}.\n\nCualquier duda con gusto te ayudamos.",
                 "example": {"body_text": [["María", "A1B2C3", "3606204067", "Estafeta"]]}},
                _PIE_PLANTILLA,
            ],
        },
        {   # aviso de confirmación cuando la clienta no escribió en las últimas 24 h
            "name": "pedido_confirmado", "language": "es_MX", "category": "UTILITY",
            "components": [
                {"type": "HEADER", "format": "TEXT", "text": "¡Tu compra está confirmada!"},
                {"type": "BODY",
                 "text": "Hola {{1}}, tu pedido #{{2}} en Zapatillas May está confirmado por ${{3}} MXN.\n\nYa lo estamos preparando y te avisamos en cuanto salga a envío.",
                 "example": {"body_text": [["María", "A1B2C3D4", "850"]]}},
                _PIE_PLANTILLA, _BOTON_WEB,
            ],
        },
        {
            "name": "recordatorio_pago_pendiente", "language": "es_MX", "category": "UTILITY",
            "components": [
                {"type": "HEADER", "format": "TEXT", "text": "Tu pedido está esperando el pago"},
                {"type": "BODY",
                 "text": "Hola {{1}}, te recordamos que tu pedido en Zapatillas May está pendiente de pago por ${{2}} MXN vía {{3}}.\n\nRealiza tu pago para que procesemos tu pedido lo antes posible. Si ya pagaste, por favor ignora este mensaje.\n\nTienes dudas, con gusto te ayudamos.",
                 "example": {"body_text": [["María", "850", "OXXO"]]}},
                _PIE_PLANTILLA, _BOTON_WEB,
            ],
        },
        {   # secuencias de seguimiento (carritos): MARKETING, se cobra por conversación
            "name": "seguimiento_carrito", "language": "es_MX", "category": "MARKETING",
            "components": [
                {"type": "BODY",
                 "text": "Hola {{1}}, vimos que dejaste unos modelos apartados en tu carrito de Zapatillas May 👠 ¿Te ayudamos a terminar tu pedido? Respóndenos por aquí y con gusto te apoyamos.",
                 "example": {"body_text": [["María"]]}},
                _PIE_PLANTILLA,
            ],
        },
        {   # novedades por WhatsApp (de pocas en pocas) para clientas que no han escrito en las últimas 24 h
            "name": "novedades_modelos", "language": "es_MX", "category": "MARKETING",
            "components": [
                {"type": "BODY",
                 "text": "Hola {{1}} 👋 Llegaron modelos nuevos a Zapatillas May: {{2}}. Mira las fotos y los precios en nuestro sitio 👇",
                 "example": {"body_text": [["María", "Botín MA6902 Negro, Sandalia SAN-01"]]}},
                _PIE_PLANTILLA, _BOTON_WEB,
            ],
        },
        {
            "name": "reactivacion_cliente", "language": "es_MX", "category": "MARKETING",
            "components": [
                {"type": "BODY",
                 "text": "Hola {{1}}, hace tiempo no te vemos por Zapatillas May y tenemos modelos nuevos de temporada 👠 ¿Te enviamos el catálogo? Respóndenos y te lo mandamos.",
                 "example": {"body_text": [["María"]]}},
                _PIE_PLANTILLA,
            ],
        },
    ]


@router.post("/crear-plantillas-base")
def crear_plantillas_base():
    """Crea de una vez las plantillas que el ERP necesita (aviso de envío, confirmación, recordatorio de pago y las
    dos de seguimiento). Las que ya existen se omiten. Meta las revisa: tardan de minutos a horas en aprobarse."""
    if not os.environ.get("WHATSAPP_TOKEN") or not os.environ.get("WHATSAPP_WABA_ID"):
        return JSONResponse(status_code=500, content={"error": "Faltan WHATSAPP_TOKEN o WHATSAPP_WABA_ID en Railway"})
    resultados = [_crear_plantilla_meta(p) for p in _plantillas_base()]
    return {"ok": not any(r["estado"] == "error" for r in resultados), "resultados": resultados}


@router.post("/editar-boton-plantilla")
async def editar_boton_plantilla(datos: dict):
    """
    Edita el botón URL de una plantilla ya aprobada (ej. cambiar a dónde apunta
    "ver nuevos modelos"). Manda TODOS los componentes tal cual están, solo con
    la URL del botón cambiada — Meta requiere el set completo de componentes,
    no un parche parcial. Editar una plantilla la regresa a revisión (PENDING),
    pero cambios de solo-URL normalmente se aprueban rápido.
    Body: { template_id, nueva_url, boton_texto (opcional, para identificar el botón si hay varios) }
    """
    wa_token = os.environ.get("WHATSAPP_TOKEN", "")
    if not wa_token:
        return JSONResponse(status_code=500, content={"error": "Falta WHATSAPP_TOKEN en Railway"})

    template_id = datos.get("template_id", "")
    nueva_url = datos.get("nueva_url", "")
    template_name = datos.get("template_name", "")
    if not template_id or not nueva_url:
        return JSONResponse(status_code=400, content={"error": "template_id y nueva_url son requeridos"})

    # Traer los componentes actuales para no perder nada al editar
    try:
        plantillas = await listar_plantillas()
        lista = plantillas if isinstance(plantillas, list) else []
        actual = next((p for p in lista if p.get("id") == template_id or p.get("name") == template_name), None)
        if not actual:
            return JSONResponse(status_code=404, content={"error": "No se encontró la plantilla"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"No se pudo leer la plantilla actual: {e}"})

    componentes = actual.get("components", [])
    encontrado = False
    for comp in componentes:
        if comp.get("type") == "BUTTONS":
            for btn in comp.get("buttons", []):
                if btn.get("type") == "URL":
                    btn["url"] = nueva_url
                    encontrado = True
    if not encontrado:
        return JSONResponse(status_code=400, content={"error": "La plantilla no tiene un botón de tipo URL"})

    url = f"https://graph.facebook.com/v25.0/{template_id}"
    headers_req = {"Authorization": f"Bearer {wa_token}", "Content-Type": "application/json"}
    body = {"category": actual.get("category"), "components": componentes}
    try:
        req = urllib.request.Request(url, data=json.dumps(body).encode(), headers=headers_req, method="POST")
        with urllib.request.urlopen(req, timeout=15) as r:
            resp = json.loads(r.read())
        return {"ok": True, "meta_response": resp}
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        return JSONResponse(status_code=500, content={"error": f"Meta API HTTP {e.code}: {error_body[:500]}"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/plantilla-estado/{template_id}")
def plantilla_estado(template_id: str):
    """Diagnóstico de solo lectura: consulta el estado y motivo de rechazo
    (si aplica) de una plantilla puntual por su ID."""
    wa_token = os.environ.get("WHATSAPP_TOKEN", "")
    if not wa_token:
        return JSONResponse(status_code=500, content={"error": "Falta WHATSAPP_TOKEN en Railway"})
    url = f"https://graph.facebook.com/v25.0/{template_id}?fields=name,status,category,rejected_reason,quality_score"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {wa_token}"})
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        return JSONResponse(status_code=500, content={"error": f"Meta API HTTP {e.code}: {body[:500]}"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


def _subir_media_handle_meta(wa_token: str, app_id: str, contenido: bytes, mime: str) -> str:
    """Sube un archivo a la API de subida reanudable de Meta y devuelve el
    'header_handle' que se usa como muestra al crear una plantilla con
    encabezado IMAGE/VIDEO/DOCUMENT. Requiere el App ID de Facebook (público,
    no es un secreto) — WHATSAPP_APP_ID en Railway."""
    # 1) Iniciar sesión de subida
    init_url = f"https://graph.facebook.com/v20.0/{app_id}/uploads?file_length={len(contenido)}&file_type={mime}&access_token={wa_token}"
    req = urllib.request.Request(init_url, method="POST")
    with urllib.request.urlopen(req, timeout=15) as r:
        sesion = json.loads(r.read())
    upload_id = sesion.get("id", "")
    if not upload_id:
        raise RuntimeError(f"Meta no devolvió upload session id: {sesion}")

    # 2) Subir el archivo completo a esa sesión
    up_url = f"https://graph.facebook.com/v20.0/{upload_id}"
    req2 = urllib.request.Request(
        up_url, data=contenido, method="POST",
        headers={"Authorization": f"OAuth {wa_token}", "file_offset": "0"}
    )
    with urllib.request.urlopen(req2, timeout=30) as r2:
        resultado = json.loads(r2.read())
    handle = resultado.get("h", "")
    if not handle:
        raise RuntimeError(f"Meta no devolvió el header_handle: {resultado}")
    return handle


@router.post("/crear-plantilla-portal-nuevos-modelos")
def crear_plantilla_portal_nuevos_modelos():
    """
    Crea 'portal_nuevos_modelos' — igual que catalogo_completo pero con el
    botón apuntando al portal mayorista en vez de la home de la tienda.
    catalogo_completo no se puede editar (Meta lo rechaza en esta cuenta:
    "Solo puedes eliminar o añadir plantillas"), así que en vez de tocarla
    se crea esta como reemplazo. La imagen de muestra se toma del producto
    activo más reciente y se sube de nuevo a Meta (la URL de ejemplo de la
    plantilla vieja ya expiró — Meta no acepta URLs externas como muestra,
    solo un header_handle de su propia API de subida).
    """
    wa_token = os.environ.get("WHATSAPP_TOKEN", "")
    waba_id = os.environ.get("WHATSAPP_WABA_ID", "")
    app_id = os.environ.get("WHATSAPP_APP_ID", "")
    if not wa_token or not waba_id:
        return JSONResponse(status_code=500, content={"error": "Faltan WHATSAPP_TOKEN o WHATSAPP_WABA_ID en Railway"})
    if not app_id:
        return JSONResponse(status_code=500, content={"error": "Falta WHATSAPP_APP_ID en Railway"})

    try:
        productos = supabase_get("productos?activo=eq.true&select=imagen_principal&order=created_at.desc&limit=1")
        imagen_url = productos[0].get("imagen_principal") if productos else None
        if not imagen_url:
            return JSONResponse(status_code=500, content={"error": "No se encontró una imagen de producto activo para usar de muestra"})
        img_req = urllib.request.Request(imagen_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(img_req, timeout=15) as r:
            imagen_bytes = r.read()
            content_type = r.headers.get("Content-Type", "image/jpeg")
        header_handle = _subir_media_handle_meta(wa_token, app_id, imagen_bytes, content_type)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"No se pudo subir la imagen de muestra: {e}"})

    plantilla = {
        "name": "portal_nuevos_modelos",
        "language": "es_MX",
        "category": "MARKETING",
        "components": [
            {
                "type": "HEADER",
                "format": "IMAGE",
                "example": {
                    "header_handle": [header_handle]
                }
            },
            {
                "type": "BODY",
                "text": "Hola {{customer_name}}, \ntenemos nuevos modelos de calzado 👠 \nVisítanos en zapatillasmay.mx",
                "example": {
                    "body_text_named_params": [
                        {"param_name": "customer_name", "example": "María"}
                    ]
                }
            },
            {
                "type": "FOOTER",
                "text": "Escribe stop para dejar de recibir mensajes"
            },
            {
                "type": "BUTTONS",
                "buttons": [
                    {
                        "type": "URL",
                        "text": "ver nuevos modelos",
                        "url": "https://portal.zapatillasmay.mx"
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


@router.post("/crear-plantilla-catalogo")
def crear_plantilla_catalogo():
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
def envio_productos(datos: dict):  # sync (no async): hace HTTP bloqueante/sleep por contacto; en async congelaba todo el servidor
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
        todos_retailer_ids = [item["product_retailer_id"] for s in sections for item in s["product_items"]]
        total_skus = len(todos_retailer_ids)

        wa_url = f"https://graph.facebook.com/v25.0/{phone_id}/messages"
        headers_req = {"Authorization": f"Bearer {wa_token}", "Content-Type": "application/json"}

        enviados = 0
        fallidos = 0
        errores = []

        for contacto in contactos:
            telefono = a_e164_mx(contacto.get("telefono") or "")
            if not telefono:
                continue

            if total_skus == 1:
                # Mensaje de producto único
                interactive_msg = {
                    "type": "product",
                    "body": {"text": cuerpo},
                    "footer": {"text": pie},
                    "action": {
                        "catalog_id": catalog_id,
                        "product_retailer_id": todos_retailer_ids[0]
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
def enviar_documento_manual(telefono: str, datos: dict):
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


@router.post("/chats/{telefono}/audio")
def enviar_audio_manual(telefono: str, archivo: UploadFile = File(...), agente: str = Form("Admin")):
    """Audio grabado en el panel: se guarda en Storage y se manda por WhatsApp (mp3, ogg/opus, m4a, aac o amr; máx. 16 MB)."""
    try:
        tipo = (archivo.content_type or "").split(";")[0].strip().lower()
        ext = {"audio/mpeg": "mp3", "audio/mp3": "mp3", "audio/ogg": "ogg", "audio/mp4": "m4a", "audio/aac": "aac", "audio/amr": "amr"}.get(tipo)
        if not ext:
            return JSONResponse(status_code=400, content={"error": "Formato de audio no permitido por WhatsApp (" + (tipo or "desconocido") + ")"})
        datos = archivo.file.read(16 * 1024 * 1024 + 1)
        if len(datos) > 16 * 1024 * 1024:
            return JSONResponse(status_code=400, content={"error": "El audio pesa más de 16 MB"})
        if len(datos) < 500:
            return JSONResponse(status_code=400, content={"error": "El audio está vacío"})
        solo_digitos = re.sub(r"\D", "", telefono)
        nombre = f"salida_{solo_digitos}_{int(time.time())}.{ext}"
        if ext == "ogg" and not datos.startswith(b"OggS"):
            return JSONResponse(status_code=400, content={"error": "El archivo .ogg no es válido"})
        voz = ext == "ogg"   # ogg con códec opus = NOTA DE VOZ (voice: true); los demás formatos van como audio normal
        url = subir_imagen_storage(datos, nombre, content_type="audio/mpeg" if ext == "mp3" else ("audio/ogg; codecs=opus" if voz else tipo))
        if not url:
            return JSONResponse(status_code=500, content={"error": "No se pudo guardar el audio"})
        carga_audio = {"link": url}
        if voz:
            carga_audio["voice"] = True
        wamid = _wa_send({"messaging_product": "whatsapp", "to": telefono, "type": "audio", "audio": carga_audio})
        if not wamid:
            err = (_WA_ULTIMO_ERROR or {}).get("mensaje") or "WhatsApp no aceptó el audio (puede que ya pasaron más de 24 h desde su último mensaje)"
            return JSONResponse(status_code=502, content={"error": err})
        supabase_post("conversaciones_whatsapp", {
            "telefono": telefono, "mensaje": f"[{agente}]: [Audio] {url}", "respuesta": None,
            "tipo": "audio_saliente", "leido": True, "wa_message_id": wamid,
        })
        cache_invalidate("chats_lista")
        return {"ok": True, "url": url, "nota_de_voz": voz}
    except Exception as e:
        print(f"[audio-manual] {e}")
        return JSONResponse(status_code=500, content={"error": "No se pudo enviar el audio: " + str(e)[:160]})


@router.post("/chats/{telefono}/video")
def enviar_video_manual(telefono: str, datos: dict):
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
def enviar_reaccion(telefono: str, datos: dict):
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
def marcar_no_leido(telefono: str):
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
def enviar_ubicacion_manual(telefono: str, datos: dict):
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
def enviar_contacto_manual(telefono: str, datos: dict):
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
def debug_env():
    """Diagnóstico: qué variables WA están configuradas (sin mostrar valores sensibles)."""
    keys = ["WHATSAPP_TOKEN","WHATSAPP_PHONE_ID","WHATSAPP_WABA_ID","WABA_ID","WA_BUSINESS_ID","WHATSAPP_BUSINESS_ID"]
    return {k: ("✓ SET" if os.environ.get(k) else "✗ MISSING") for k in keys}

@router.get("/templates")
def listar_templates():
    try:
        waba_id = _get_waba_id()
        if not waba_id:
            return JSONResponse(status_code=400, content={"error": "No se pudo obtener WABA_ID"})
        data = _wa_graph(f"{waba_id}/message_templates?fields=name,status,category,language,components&limit=50")
        return {"waba_id": waba_id, "templates": data.get("data", [])}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/templates")
def crear_template(datos: dict):
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
def eliminar_template(template_name: str):
    try:
        waba_id = _get_waba_id()
        result = _wa_graph(f"{waba_id}/message_templates?name={template_name}", method="DELETE")
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/templates/enviar")
def enviar_template(datos: dict):
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
            "to": a_e164_mx(telefono),
            "type": "template",
            "template": {
                "name": template,
                "language": {"code": language},
                "components": components
            }
        }
        wa_id = _wa_send(payload)
        if not wa_id:
            # Antes devolvía {"ok": True, "wa_id": ""} aunque Meta rechazara la plantilla: el panel creía que se mandó.
            return JSONResponse(status_code=502, content={"error": _explicar_error_wa()})
        # Queda en el historial del chat (antes no se veía que se había mandado) y cuenta como respuesta al cliente.
        try:
            supabase_post("conversaciones_whatsapp", {
                "telefono": a_e164_mx(telefono),   # misma llave que usan los chats (52 + 10 dígitos)
                "mensaje": f"[Plantilla]: {template}" + (" — " + " | ".join(str(x) for x in params) if params else ""),
                "respuesta": None,
                "tipo": "plantilla_saliente",
                "wa_message_id": wa_id,
                "leido": True,
            })
            cache_invalidate("chats_lista")
        except Exception as e_log:
            print(f"[templates] no se pudo guardar en el historial: {e_log}")
        return {"ok": True, "wa_id": wa_id}
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        return JSONResponse(status_code=e.code, content={"error": body})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/templates/crear-predefinidas")
def crear_templates_predefinidos():
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
def enviar_botones_interactivos(telefono: str, datos: dict):
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
def enviar_lista_interactiva(telefono: str, datos: dict):
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
def enviar_carrusel(telefono: str, datos: dict):
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
        mapa_fotos = []   # [{w: id del mensaje de WhatsApp, n: nombre del modelo, u: foto}] para saber a qué foto responde la clienta
        for i, t in enumerate(tarjetas_validas):
            img_url = t["imagen_url"]
            caption = t.get("texto", "")
            # El intro va en el caption de la primera imagen
            if i == 0 and cuerpo:
                caption = f"{cuerpo}\n\n{caption}" if caption else cuerpo
            # El CTA va en el caption de la última imagen
            if i == len(tarjetas_validas) - 1:
                caption = f"{caption}\n\n¿Alguno te llama la atención? 👀" if caption else "¿Alguno te llama la atención? 👀"
            _wid = _wa_send({
                "messaging_product": "whatsapp", "to": telefono, "type": "image",
                "image": {"link": img_url, "caption": caption[:1024]}
            })
            if _wid:
                mapa_fotos.append({"w": _wid, "n": (t.get("texto", "").split("\n")[0] or "")[:160], "u": img_url, "c": caption[:1024]})
            enviadas += 1

        # No poner en control manual automáticamente — Maya puede seguir respondiendo

        try:
            # Guardar nombres de los productos para que Maya tenga contexto
            nombres_productos = ", ".join([t.get("texto", "").split("\n")[0] for t in tarjetas_validas if t.get("texto")])
            _imgs_carrusel = ",".join([t["imagen_url"] for t in tarjetas_validas if t.get("imagen_url")])
            supabase_post("conversaciones_whatsapp", {
                "telefono": telefono,
                "mensaje": f"[{agente}]: [Carrusel] {cuerpo} — Productos: {nombres_productos} ({enviadas} fotos)\n|IMGS|{_imgs_carrusel}"
                           + (("\n|MAP|" + json.dumps(mapa_fotos, ensure_ascii=False)) if mapa_fotos else ""),
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
def broadcast_masivo(datos: dict):  # sync (no async): hace HTTP bloqueante/sleep por contacto; en async congelaba todo el servidor
    """Envia un template aprobado a multiples telefonos y registra el broadcast +
    un envío por destinatario en wa_broadcasts / wa_broadcast_envios para métricas."""
    try:
        template_name = datos.get("template", "")
        params        = datos.get("params", [])
        telefonos     = datos.get("telefonos", [])
        idioma        = datos.get("idioma", "es_MX")
        nombre        = (datos.get("nombre") or template_name).strip()
        filtro_etiqueta = datos.get("filtro_etiqueta")
        # Opcional: {"telefono": "nombre"} para personalizar. Un parámetro "{nombre}" se cambia por el primer nombre de cada cliente.
        nombres_por_tel = datos.get("nombres") or {}

        if not template_name:
            return JSONResponse(status_code=400, content={"error": "template requerido"})
        if not telefonos:
            return JSONResponse(status_code=400, content={"error": "telefonos requeridos"})

        # Registro del broadcast (para historial y métricas de entrega/lectura)
        broadcast_id = None
        try:
            creado = supabase_post("wa_broadcasts", {
                "nombre": nombre, "plantilla": template_name, "idioma": idioma,
                "parametros": params, "filtro_etiqueta": filtro_etiqueta,
                "estado": "enviando", "total": len(telefonos),
            })
            if isinstance(creado, list) and creado:
                broadcast_id = creado[0].get("id")
        except Exception as e:
            print(f"[broadcast] no se pudo crear registro: {e}")

        resultados = []
        for tel in telefonos:
            try:
                components = []
                _n = str(nombres_por_tel.get(tel) or "").strip()
                _primer = _n.split()[0].title() if _n else "Cliente"
                params_tel = [str(p).replace("{nombre}", _primer) for p in params]
                if params_tel:
                    components.append({"type": "body", "parameters": [{"type": "text", "text": p} for p in params_tel]})
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
                if broadcast_id:
                    try:
                        supabase_post("wa_broadcast_envios", {
                            "broadcast_id": broadcast_id, "telefono": tel,
                            "wa_message_id": wamid or None,
                            "estado": "enviado" if wamid else "fallido",
                        })
                    except Exception: pass
            except Exception as e:
                resultados.append({"tel": tel, "ok": False, "error": str(e)})
                if broadcast_id:
                    try:
                        supabase_post("wa_broadcast_envios", {
                            "broadcast_id": broadcast_id, "telefono": tel,
                            "estado": "fallido", "error": str(e)[:300],
                        })
                    except Exception: pass

        cache_invalidate("chats_lista")
        enviados = sum(1 for r in resultados if r.get("ok"))
        if broadcast_id:
            try:
                supabase_patch(f"wa_broadcasts?id=eq.{broadcast_id}", {
                    "estado": "enviado", "enviados": enviados, "fallidos": len(telefonos) - enviados,
                })
            except Exception: pass
        return {"ok": True, "broadcast_id": broadcast_id, "total": len(telefonos), "enviados": enviados,
                "errores": len(telefonos) - enviados, "resultados": resultados}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/broadcasts")
def listar_broadcasts():
    """Historial de broadcasts con sus métricas (para el panel)."""
    try:
        return supabase_get("wa_broadcasts?order=created_at.desc&limit=50") or []
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


# ═══════════════════════════════════════════════════════════════════
#  ESTADO DE BANDEJA (abierto / espera / cerrado)
# ═══════════════════════════════════════════════════════════════════

@router.post("/chats/{telefono}/archivar")
def archivar_chat(telefono: str, datos: dict):
    """Oculta (archivar=true) o devuelve (archivar=false) una conversación en la lista. Los mensajes NO se borran; si la clienta
    vuelve a escribir, el chat reaparece solo."""
    try:
        archivar = bool(datos.get("archivar", True))
        import datetime as _dt
        ahora = _dt.datetime.now(_dt.timezone.utc).isoformat()
        cambio = {"archivado": archivar, "archivado_at": ahora if archivar else None}
        for t in (_variantes_tel(telefono) or [telefono]):
            existente = supabase_get(f"chats_control?telefono=eq.{t}&select=telefono")
            if existente:
                supabase_patch(f"chats_control?telefono=eq.{t}", cambio)
            elif t == telefono:
                supabase_post("chats_control", {"telefono": t, "en_control": False, **cambio})
        cache_invalidate("chats_lista")
        return {"ok": True, "archivado": archivar}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.delete("/chats/{telefono}")
def eliminar_chat(telefono: str):
    """Elimina PARA SIEMPRE todos los mensajes de una conversación (y su control). Solo se permite si el chat ya está archivado
    (se archiva primero, y recién desde «Archivadas» se elimina). No se puede deshacer."""
    try:
        variantes = _variantes_tel(telefono) or [telefono]
        lista = ",".join(variantes)
        ctrl = supabase_get(f"chats_control?telefono=in.({lista})&select=telefono,archivado") or []
        if not any(x.get("archivado") for x in ctrl):
            return JSONResponse(status_code=409, content={"error": "Primero archiva la conversación; solo se elimina desde «Archivadas»."})
        borrados = supabase_get(f"conversaciones_whatsapp?telefono=in.({lista})&select=id") or []
        supabase_delete(f"conversaciones_whatsapp?telefono=in.({lista})")
        supabase_delete(f"chats_control?telefono=in.({lista})")
        cache_invalidate("chats_lista")
        print(f"[chats] conversación {telefono} eliminada ({len(borrados)} mensajes)")
        return {"ok": True, "mensajes_eliminados": len(borrados)}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.patch("/chats/{telefono}/estado")
def cambiar_estado_chat(telefono: str, datos: dict):
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


def _registrar_origen_chat(telefono, mensaje_data):
    """Guarda de dónde llegó una conversación (solo la primera vez). Dos fuentes:
    1) anuncio "Click to WhatsApp" de Meta: el mensaje trae `referral` (titular/anuncio);
    2) botón de WhatsApp del sitio: el mensaje prellenado termina con "(ref: <página> | <fuente>)".
    Nunca lanza excepción: si algo falla, el webhook sigue normal."""
    try:
        origen = ""
        ref = mensaje_data.get("referral") or {}
        if ref:
            detalle = (ref.get("headline") or ref.get("source_url") or ref.get("source_id") or "").strip()
            origen = ("Anuncio de Meta: " + detalle)[:200] if detalle else "Anuncio de Meta"
        if not origen and mensaje_data.get("type") == "text":
            cuerpo = ((mensaje_data.get("text") or {}).get("body") or "")
            m = re.search(r"\(ref:\s*([^)]{1,120})\)", cuerpo)
            if m:
                origen = m.group(1).strip()
        if not origen or not telefono:
            return
        tel_q = urllib.parse.quote(str(telefono), safe="")
        existente = supabase_get(f"chats_control?telefono=eq.{tel_q}&select=telefono,origen")
        if existente:
            if not (existente[0].get("origen") or "").strip():
                supabase_patch(f"chats_control?telefono=eq.{tel_q}", {"origen": origen})
        else:
            supabase_post("chats_control", {"telefono": telefono, "en_control": False, "origen": origen})
    except Exception as e:
        print(f"[chatbot] origen de la conversación no guardado: {e}")
