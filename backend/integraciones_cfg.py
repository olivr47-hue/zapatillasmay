"""Configuración de integraciones desde el panel (Conexiones).

Hasta ahora las claves de MercadoPago, MercadoLibre, Amazon, WhatsApp, etc. solo vivían como variables de entorno en Railway. Aquí se pueden capturar también
desde el panel y se guardan CIFRADAS (Fernet con una llave derivada de SECRET_KEY) en la tabla `config_integraciones`, que solo lee el servidor.

Reglas:
  · Un valor capturado en el panel MANDA sobre la variable de Railway; al quitarlo se vuelve a usar la de Railway (se recuerda la original al arrancar).
  · Solo se pueden editar las claves del REGISTRO de abajo: nada de base de datos, SECRET_KEY, AUTH_ENFORCE ni otras de infraestructura.
  · Los valores secretos NUNCA se devuelven completos al panel (solo los últimos 4 caracteres).
  · Al arrancar (antes de importar los routers) se cargan los valores del panel en os.environ, así los módulos que leen la variable al importarse los ven.
    Al guardar desde el panel se aplican además en caliente: en os.environ y en las constantes de los módulos que ya las copiaron.
"""
import os
import sys
import base64
import hashlib

try:
    from cryptography.fernet import Fernet, InvalidToken
except Exception:   # sin cryptography no se guarda nada (solo se leen las variables de Railway)
    Fernet = None
    InvalidToken = Exception

_PREFIJO = "enc:v1:"
_ORIGINALES: dict = {}     # valor que traía Railway antes de aplicar el del panel (None = no existía)
_DEL_PANEL: dict = {}      # claves que hoy se están sirviendo desde el panel
_CARGADO = False

# (clave, etiqueta, secreto, ayuda)
_G = lambda *campos: [dict(clave=c[0], etiqueta=c[1], secreto=c[2], ayuda=(c[3] if len(c) > 3 else "")) for c in campos]

REGISTRO = [
    {"id": "mercadopago", "nombre": "MercadoPago", "icono": "💳", "probar": None,
     "descripcion": "Cobros de la tienda en línea, del portal de mayoristas y del marketplace.",
     "campos": _G(("MP_ACCESS_TOKEN", "Access Token (producción)", True, "MercadoPago → Tus integraciones → Credenciales de producción."),
                  ("MP_PUBLIC_KEY", "Public Key (producción)", False),
                  ("MP_WEBHOOK_SECRET", "Clave secreta del webhook", True, "Si la pones, MercadoPago debe firmar sus avisos con ella."),
                  ("MP_WEBHOOK_URL", "URL del webhook", False),
                  ("MP_ACCESS_TOKEN_TEST", "Access Token de pruebas", True), ("MP_PUBLIC_KEY_TEST", "Public Key de pruebas", False))},
    {"id": "whatsapp", "nombre": "WhatsApp Business (Meta)", "icono": "💬", "probar": None,
     "descripcion": "Mensajes, asistente Maya, catálogo y avisos de pedidos.",
     "campos": _G(("WHATSAPP_TOKEN", "Token de acceso", True, "Token permanente del usuario del sistema de Meta."),
                  ("WHATSAPP_PHONE_ID", "ID del número de teléfono", False), ("WHATSAPP_WABA_ID", "ID de la cuenta de WhatsApp Business (WABA)", False),
                  ("WHATSAPP_CATALOG_ID", "ID del catálogo", False), ("WHATSAPP_APP_ID", "ID de la app de Meta", False),
                  ("WHATSAPP_APP_SECRET", "Clave secreta de la app", True, "Sirve para verificar la firma de los mensajes que llegan."),
                  ("WA_VERIFY_TOKEN", "Token de verificación del webhook", True),
                  ("WA_OTP_TEMPLATE", "Plantilla del código de entrada al portal", False), ("WA_PEDIDO_CONFIRMADO_TEMPLATE", "Plantilla de pedido confirmado", False))},
    {"id": "meta", "nombre": "Facebook, Instagram y anuncios", "icono": "📣", "probar": None,
     "descripcion": "Publicaciones, Pixel, conversiones, anuncios y catálogo de Meta.",
     "campos": _G(("FB_PAGE_ACCESS_TOKEN", "Token de la página de Facebook/Instagram", True), ("FB_VERIFY_TOKEN", "Token de verificación (Messenger/Instagram)", True),
                  ("FB_PUBLISH_TOKEN", "Token para publicar", True), ("META_PIXEL_ID", "ID del Pixel", False),
                  ("META_ACCESS_TOKEN", "Token de conversiones (API de conversiones)", True), ("META_ADS_READ_TOKEN", "Token de lectura de anuncios", True),
                  ("META_AD_ACCOUNT_ID", "ID de la cuenta publicitaria", False), ("META_CATALOG_TOKEN", "Token del catálogo", True))},
    {"id": "mercadolibre", "nombre": "MercadoLibre", "icono": "🛒", "probar": "/ml/ping",
     "descripcion": "Publicaciones, ventas, preguntas y mensajes.",
     "campos": _G(("ML_APP_ID", "App ID", False), ("ML_CLIENT_SECRET", "Clave secreta (Client Secret)", True), ("ML_USER_ID", "ID de usuario del vendedor", False),
                  ("ML_REFRESH_TOKEN", "Refresh token", True, "Se renueva solo; solo cámbialo si reconectas la cuenta."), ("ML_ACCESS_TOKEN", "Access token inicial", True))},
    {"id": "amazon", "nombre": "Amazon México", "icono": "📦", "probar": "/amazon/ping",
     "descripcion": "Selling Partner API: publicaciones, existencias y pedidos.",
     "campos": _G(("AMAZON_LWA_CLIENT_ID", "LWA Client ID", False), ("AMAZON_LWA_CLIENT_SECRET", "LWA Client Secret", True), ("AMAZON_REFRESH_TOKEN", "Refresh token", True),
                  ("AMAZON_SELLER_ID", "Seller ID", False), ("AMAZON_MARKETPLACE_ID", "Marketplace ID", False),
                  ("AMAZON_SANDBOX", "Modo de pruebas (1 = sí, 0 = no)", False), ("AMAZON_PRODUCT_TYPE", "Tipo de producto", False),
                  ("AMAZON_BROWSE_NODE", "Nodo de categoría", False), ("AMAZON_VARIATION_THEME", "Tema de variaciones", False), ("AMAZON_AJUSTE_PRECIO", "Ajuste de precio ($ extra)", False))},
    {"id": "walmart", "nombre": "Walmart Marketplace", "icono": "🏬", "probar": "/walmart/ping",
     "descripcion": "Publicación de catálogo, inventario y órdenes.",
     "campos": _G(("WALMART_CLIENT_ID", "Client ID", False), ("WALMART_CLIENT_SECRET", "Client Secret", True), ("WALMART_CHANNEL_TYPE", "Channel type", False))},
    {"id": "shein", "nombre": "SHEIN", "icono": "🛍️", "probar": "/shein/ping",
     "descripcion": "Publicaciones, inventario y ventas de tu tienda semi-managed.",
     "campos": _G(("SHEIN_APP_ID", "App ID", False), ("SHEIN_APP_SECRET", "App Secret", True), ("SHEIN_PROXY_URL", "URL del proxy (si usas uno)", False))},
    {"id": "tiktok", "nombre": "TikTok Shop", "icono": "🎵", "probar": None,
     "descripcion": "Conexión de la app de TikTok (hoy el catálogo se sube por Excel).",
     "campos": _G(("TIKTOK_APP_KEY", "App Key", False), ("TIKTOK_APP_SECRET", "App Secret", True))},
    {"id": "pinterest", "nombre": "Pinterest", "icono": "📌", "probar": None, "descripcion": "Catálogo y anuncios de Pinterest.",
     "campos": _G(("PINTEREST_ACCESS_TOKEN", "Access token", True), ("PINTEREST_AD_ACCOUNT_ID", "ID de la cuenta publicitaria", False))},
    {"id": "google", "nombre": "Google (Analytics, Search Console, Merchant)", "icono": "🔎", "probar": None,
     "descripcion": "Estadísticas, posicionamiento y catálogo de Google.",
     "campos": _G(("GA4_PROPERTY_ID", "Analytics: ID de propiedad", False), ("GA4_MEASUREMENT_ID", "Analytics: ID de medición (G-…)", False), ("GA4_API_SECRET", "Analytics: secreto de la API de medición", True),
                  ("GA4_CLIENT_ID", "Analytics: Client ID (OAuth)", False), ("GA4_CLIENT_SECRET", "Analytics: Client Secret (OAuth)", True), ("GA4_REFRESH_TOKEN", "Analytics: Refresh token", True),
                  ("GA4_CREDENTIALS_JSON", "Analytics: credenciales de cuenta de servicio (JSON)", True, "Pega el archivo JSON completo."),
                  ("GSC_SITE_URL", "Search Console: dirección del sitio", False), ("GSC_CREDENTIALS_JSON", "Search Console: credenciales (JSON)", True),
                  ("MERCHANT_ID", "Merchant Center: ID", False), ("MERCHANT_CREDENTIALS_JSON", "Merchant Center: credenciales (JSON)", True),
                  ("GOOGLE_CLIENT_ID", "Inicio de sesión con Google: Client ID", False))},
    {"id": "correo", "nombre": "Correo", "icono": "📧", "probar": None,
     "descripcion": "Envío de correos a clientas y lectura de la bandeja del negocio.",
     "campos": _G(("RESEND_API_KEY", "Resend: API key", True), ("RESEND_FROM", "Resend: remitente", False), ("ZEPTOMAIL_TOKEN", "ZeptoMail: token", True),
                  ("ZEPTOMAIL_FROM", "ZeptoMail: remitente", False), ("NOTIF_EMAIL", "Correo del negocio (recibe los avisos)", False),
                  ("ZOHO_MAIL_CLIENT_ID", "Zoho Mail: Client ID", False), ("ZOHO_MAIL_CLIENT_SECRET", "Zoho Mail: Client Secret", True),
                  ("ZOHO_MAIL_REFRESH_TOKEN", "Zoho Mail: Refresh token", True), ("ZOHO_MAIL_ACCOUNT_ID", "Zoho Mail: ID de cuenta", False))},
    {"id": "ia", "nombre": "Inteligencia artificial", "icono": "🤖", "probar": None, "descripcion": "Asistente Maya y generación de textos.",
     "campos": _G(("ANTHROPIC_API_KEY", "Anthropic (Claude): API key", True), ("OPENAI_API_KEY", "OpenAI: API key", True))},
    {"id": "imagenes", "nombre": "Fotos (Cloudinary)", "icono": "🖼️", "probar": None, "descripcion": "Almacén de las fotos de productos.",
     "campos": _G(("CLOUDINARY_CLOUD_NAME", "Cloud name", False), ("CLOUDINARY_API_KEY", "API key", False), ("CLOUDINARY_API_SECRET", "API secret", True))},
    {"id": "push", "nombre": "Notificaciones push", "icono": "🔔", "probar": None, "descripcion": "Avisos al celular de tu equipo y de tus clientas.",
     "campos": _G(("VAPID_PUBLIC_KEY", "Llave pública (VAPID)", False), ("VAPID_PRIVATE_KEY", "Llave privada (VAPID)", True), ("VAPID_EMAIL", "Correo de contacto (VAPID)", False))},
    {"id": "sitio", "nombre": "Sitio", "icono": "🌐", "probar": None, "descripcion": "Dirección pública de la tienda.",
     "campos": _G(("FRONTEND_URL", "Dirección de la tienda (https://…)", False))},
]
_CLAVES = {c["clave"]: (g, c) for g in REGISTRO for c in g["campos"]}

# Constantes de módulo que se llaman distinto a la variable (se actualizan en caliente al guardar)
_ALIAS = {
    "NOTIF_EMAIL": [("email_utils", "NEGOCIO_EMAIL"), ("routers.auth", "_NOTIF_EMAIL"), ("routers.carrito_abandonado", "_NOTIF_EMAIL")],
    "AMAZON_LWA_CLIENT_ID": [("routers.amazon", "LWA_CLIENT_ID")], "AMAZON_LWA_CLIENT_SECRET": [("routers.amazon", "LWA_CLIENT_SECRET")],
    "AMAZON_REFRESH_TOKEN": [("routers.amazon", "REFRESH_TOKEN")], "AMAZON_SELLER_ID": [("routers.amazon", "SELLER_ID")], "AMAZON_MARKETPLACE_ID": [("routers.amazon", "MARKETPLACE_ID")],
    "AMAZON_PRODUCT_TYPE": [("routers.amazon", "_PRODUCT_TYPE")], "AMAZON_VARIATION_THEME": [("routers.amazon", "_VARIATION_THEME")], "AMAZON_BROWSE_NODE": [("routers.amazon", "_BROWSE_NODE")],
    "WA_VERIFY_TOKEN": [("routers.chatbot", "_WA_VERIFY_TOKEN")], "FB_VERIFY_TOKEN": [("routers.chatbot", "_FB_VERIFY_TOKEN")],
    "FRONTEND_URL": [("routers.marketplace", "_FRONT")],
    "ML_CLIENT_SECRET": [("routers.mercadolibre", "ML_SECRET")], "ML_ACCESS_TOKEN": [("routers.mercadolibre", "ML_TOKEN_ENV")], "ML_REFRESH_TOKEN": [("routers.mercadolibre", "ML_REFRESH")],
    "PINTEREST_ACCESS_TOKEN": [("routers.pinterest", "_TOKEN")], "PINTEREST_AD_ACCOUNT_ID": [("routers.pinterest", "_AD_ACCOUNT")],
    "ZOHO_MAIL_CLIENT_ID": [("zoho_mail", "CLIENT_ID")], "ZOHO_MAIL_CLIENT_SECRET": [("zoho_mail", "CLIENT_SECRET")],
    "ZOHO_MAIL_REFRESH_TOKEN": [("zoho_mail", "REFRESH_TOKEN")], "ZOHO_MAIL_ACCOUNT_ID": [("zoho_mail", "ACCOUNT_ID_ENV")],
}


def _fernet():
    if Fernet is None:
        return None
    sk = os.environ.get("SECRET_KEY", "")
    if not sk:
        return None
    return Fernet(base64.urlsafe_b64encode(hashlib.sha256(("integraciones|" + sk).encode()).digest()))


def cifrar(valor: str) -> str:
    f = _fernet()
    if f is None:
        raise RuntimeError("No se pueden cifrar las claves en este servidor")
    return _PREFIJO + f.encrypt(valor.encode("utf-8")).decode()


def descifrar(guardado: str):
    if not guardado or not guardado.startswith(_PREFIJO):
        return None
    f = _fernet()
    if f is None:
        return None
    try:
        return f.decrypt(guardado[len(_PREFIJO):].encode()).decode("utf-8")
    except InvalidToken:
        return None


def _modulos():
    return [m for n, m in list(sys.modules.items()) if m is not None and (n.startswith("routers.") or n in ("email_utils", "zoho_mail", "storage"))]


def _env_actual(clave: str) -> str:
    return os.environ.get(clave) or ""


def _aplicar_en_memoria(clave: str, valor):
    """Pone el valor (o restaura el de Railway si valor es None) en os.environ y en las constantes de los módulos ya importados."""
    if valor is None:
        orig = _ORIGINALES.get(clave)
        if orig is None:
            os.environ.pop(clave, None)
        else:
            os.environ[clave] = orig
    else:
        os.environ[clave] = valor
    v = os.environ.get(clave)
    mods = _modulos()
    # constantes con el mismo nombre que la variable
    for m in mods:
        if hasattr(m, clave) and isinstance(getattr(m, clave), (str, type(None))):
            try:
                setattr(m, clave, v if clave != "AMAZON_SANDBOX" else v)
            except Exception:
                pass
    # constantes con otro nombre
    for nombre_mod, attr in _ALIAS.get(clave, []):
        m = sys.modules.get(nombre_mod)
        if m is not None and hasattr(m, attr):
            try:
                setattr(m, attr, v if v is not None else (None if getattr(m, attr) is None else ""))
            except Exception:
                pass
    # casos con transformación
    try:
        eu = sys.modules.get("email_utils")
        if eu is not None:
            if clave == "ZEPTOMAIL_TOKEN":
                eu.ZEPTOMAIL_TOKEN = eu._limpiar_token_zeptomail(v or "")
            if clave in ("RESEND_API_KEY",):
                eu.RESEND_API_KEY = (v or "").strip()
            if clave == "RESEND_FROM":
                eu.RESEND_FROM = (v or "").strip()
            if clave in ("GMAIL_USER", "SMTP_USER", "ZOHO_USER", "ZEPTOMAIL_FROM"):
                eu.REMITENTE_EMAIL = (os.getenv("GMAIL_USER") or os.getenv("SMTP_USER") or os.getenv("ZOHO_USER") or os.getenv("ZEPTOMAIL_FROM") or "").strip()
        pg = sys.modules.get("routers.pagos")
        if pg is not None:
            import mercadopago
            if clave == "MP_ACCESS_TOKEN" and v:
                pg.sdk = mercadopago.SDK(v)
            if clave == "MP_ACCESS_TOKEN_TEST":
                pg.MP_ACCESS_TOKEN_TEST = v or ""
                pg.sdk_test = mercadopago.SDK(v) if v else None
        am = sys.modules.get("routers.amazon")
        if am is not None:
            if clave == "AMAZON_SANDBOX":
                am.SANDBOX = (v or "0") == "1"
            if clave == "AMAZON_AJUSTE_PRECIO":
                try:
                    am._AMAZON_AJUSTE_PRECIO = float(v or "0")
                except Exception:
                    pass
        if clave in ("GA4_CREDENTIALS_JSON", "GSC_CREDENTIALS_JSON", "MERCHANT_CREDENTIALS_JSON"):
            g4, gsc, mer = _env_actual("GA4_CREDENTIALS_JSON"), _env_actual("GSC_CREDENTIALS_JSON"), _env_actual("MERCHANT_CREDENTIALS_JSON")
            for nombre_mod, attr, val in (("routers.analytics", "GA4_CREDENTIALS", g4 or gsc), ("routers.businessprofile", "CREDENTIALS", gsc or mer),
                                          ("routers.merchant", "MERCHANT_CREDENTIALS", mer or gsc), ("routers.searchconsole", "GSC_CREDENTIALS", gsc)):
                m = sys.modules.get(nombre_mod)
                if m is not None:
                    setattr(m, attr, val)
        if clave in ("META_ADS_READ_TOKEN", "META_ACCESS_TOKEN"):
            an = sys.modules.get("routers.analytics")
            if an is not None:
                an.META_ACCESS_TOKEN = _env_actual("META_ADS_READ_TOKEN") or _env_actual("META_ACCESS_TOKEN")
    except Exception as e:
        print(f"[conexiones] aplicando {clave} en caliente: {e}")


def cargar_overrides():
    """Se llama al arrancar, ANTES de importar los routers: pone en os.environ los valores guardados desde el panel."""
    global _CARGADO
    _CARGADO = True
    try:
        from database import supabase_get
        filas = supabase_get("config_integraciones?select=clave,valor") or []
    except Exception as e:
        print(f"[conexiones] no se pudieron leer las claves del panel (se usan las de Railway): {e}")
        return
    n = 0
    for f in filas:
        clave = f.get("clave")
        if clave not in _CLAVES:
            continue
        valor = descifrar(f.get("valor"))
        if valor is None:
            print(f"[conexiones] no se pudo descifrar {clave}; se usa la de Railway")
            continue
        _ORIGINALES.setdefault(clave, os.environ.get(clave))
        os.environ[clave] = valor
        _DEL_PANEL[clave] = True
        n += 1
    if n:
        print(f"[conexiones] {n} clave(s) cargadas desde el panel")


def _vista(clave: str, secreto: bool):
    valor = os.environ.get(clave) or ""
    if not valor:
        return ""
    if not secreto:
        return valor[:300]
    return "••••" + (valor[-4:] if len(valor) >= 12 else "")


def estado() -> list:
    out = []
    for g in REGISTRO:
        campos = []
        for c in g["campos"]:
            valor = os.environ.get(c["clave"]) or ""
            origen = "panel" if _DEL_PANEL.get(c["clave"]) else ("servidor" if valor else "vacio")
            campos.append({**c, "configurado": bool(valor), "origen": origen, "vista": _vista(c["clave"], c["secreto"])})
        n = sum(1 for c in campos if c["configurado"])
        out.append({"id": g["id"], "nombre": g["nombre"], "icono": g["icono"], "descripcion": g["descripcion"], "probar": g.get("probar"), "campos": campos,
                    "configurados": n, "total": len(campos), "estado": "completo" if n == len(campos) else ("parcial" if n else "sin_configurar")})
    return out


def guardar(clave: str, valor: str, quien: str = ""):
    if clave not in _CLAVES:
        raise KeyError("Esa clave no se puede editar desde el panel")
    valor = (valor or "").strip()
    if not valor or len(valor) > 12000:
        raise ValueError("Escribe un valor (máximo 12,000 caracteres)")
    if "\n" in valor and not clave.endswith("_JSON"):
        raise ValueError("El valor no debe tener saltos de línea")
    from database import supabase_get, supabase_post, supabase_patch
    cif = cifrar(valor)
    existe = supabase_get(f"config_integraciones?clave=eq.{clave}&select=clave&limit=1") or []
    if existe:
        supabase_patch(f"config_integraciones?clave=eq.{clave}", {"valor": cif, "actualizado_por": quien[:80], "updated_at": __import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat()})
    else:
        supabase_post("config_integraciones", {"clave": clave, "valor": cif, "actualizado_por": quien[:80]})
    _ORIGINALES.setdefault(clave, os.environ.get(clave))
    _DEL_PANEL[clave] = True
    _aplicar_en_memoria(clave, valor)


def quitar(clave: str):
    if clave not in _CLAVES:
        raise KeyError("Esa clave no se puede editar desde el panel")
    from database import supabase_delete
    supabase_delete(f"config_integraciones?clave=eq.{clave}")
    _DEL_PANEL.pop(clave, None)
    _aplicar_en_memoria(clave, None)
    _ORIGINALES.pop(clave, None)
