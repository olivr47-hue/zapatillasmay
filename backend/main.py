import os
from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from security import limiter, require_staff, AUTH_ENFORCE, verify_token, es_personal, _aplicar_vigencia
import re as _re
from database import supabase_get
from cache import cache_stats, cache_invalidate_prefix, cache_cleanup_expired
from routers import productos, sucursales, inventario, clientes, pedidos, imagenes, variantes, movimientos, pagos, auth, crm, finanzas, chatbot
from routers import empleados
from routers import seo
from routers import campanas
from routers import tiktok
from routers import catalogos
from routers import mercadolibre
from routers import shein
from routers import walmart
from routers import amazon
from routers import analytics
from routers import searchconsole
from routers import merchant
from routers import businessprofile
from routers import referidos
from routers import carrito_abandonado
from routers import mcp_server
from routers import tiktok as tiktok_router
from routers import resenas
from routers import pinterest
from routers import portal
from routers import sugerencias
from routers import push
from routers import emails

app = FastAPI(
    title="ERP Zapatillas May",
    description="Sistema de gestión para Zapatillas May",
    version="1.0.0"
)
try:
    from slowapi.errors import RateLimitExceeded
    from slowapi import _rate_limit_exceeded_handler
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
except ImportError:
    pass


# ── Puerta de autenticación (default-deny) para los routers que no protegen cada
# ruta por separado. Todo lo que cae bajo estos prefijos exige token de PERSONAL,
# salvo las excepciones públicas explícitas de abajo (webhooks de Meta/MP/ML,
# OAuth de marketplaces, feeds SEO, endpoints de la tienda pública).
# Se define antes que CORSMiddleware para que las respuestas 401/403 lleven
# cabeceras CORS (si no, el navegador las ve como error de red, no como 401).
# Respeta AUTH_ENFORCE igual que require_staff (despliegue seguro).
_PREFIJOS_PROTEGIDOS = (
    "/chatbot", "/finanzas", "/ml", "/shein", "/walmart", "/amazon", "/tiktok", "/analytics",
    "/campanas", "/crm", "/emails", "/catalogos", "/merchant", "/businessprofile",
    "/searchconsole", "/push", "/imagenes", "/sucursales", "/carrito-abandonado",
    "/resenas", "/sugerencias", "/referidos", "/pinterest", "/catalogo",
    "/seo", "/config", "/feed", "/productos/generar-seo", "/pagos/terminal",
)
# (método o "*", regex del path completo)
_PUBLICAS = [(m, _re.compile(r)) for m, r in (
    ("*",    r"/chatbot/whatsapp"), ("*", r"/chatbot/meta"),                 # webhooks Meta (validan firma)
    ("*",    r"/ml/(auth|callback)"), ("POST", r"/ml/notificaciones"),       # OAuth + webhook ML
    ("*",    r"/shein/(auth|callback)"), ("*", r"/tiktok/(authorize|callback)"),
    ("*",    r"/analytics/(setup|setup/callback)"), ("GET", r"/analytics/producto-popularidad"),
    ("GET",  r"/catalogos(/(?!todos$).*)?"),   # /catalogos/todos (incluye inactivos) solo personal
    ("POST", r"/emails/contacto-web"),
    ("GET",  r"/push/public-key"), ("POST", r"/push/(suscribir|desuscribir)"),
    ("GET",  r"/imagenes/pdf-viewer"),
    ("GET",  r"/sucursales/?"), ("GET", r"/sucursales/[^/]+"),
    ("POST", r"/carrito-abandonado/guardar"), ("GET", r"/carrito-abandonado/recuperar/[^/]+"),
    ("GET",  r"/resenas/producto/[^/]+"), ("POST", r"/resenas/producto/[^/]+"),
    ("POST", r"/referidos/validar"),
    ("POST", r"/pinterest/event"),
    ("GET",  r"/seo/(producto|pagina)/[^/]+"), ("GET", r"/seo/config"),
    ("GET",  r"/config/envio"),
    ("GET",  r"/feed/(meta\.xml|google\.xml|google-local\.xml|tiktok\.json)"),
)]
# Cualquier usuario con token válido (cliente de portal/tienda o personal); la
# propiedad del recurso se valida dentro de la ruta.
_CON_TOKEN = [(m, _re.compile(r)) for m, r in (
    ("GET",  r"/sugerencias/?"), ("POST", r"/sugerencias/?"),
    ("GET",  r"/referidos/(mi-codigo|stats)/[^/]+"),
    ("GET",  r"/config/pago-transferencia"),   # CLABE/titular: solo con sesión (portal), no público
)]


def _coincide(lista, metodo, path):
    return any((m == "*" or metodo in m.split("|")) and rx.fullmatch(path) for m, rx in lista)


# Rutas que solo puede usar el ADMINISTRADOR. Antes el menú del panel ocultaba estos módulos a vendedores/cajeros
# ("soloAdmin"), pero el servidor aceptaba a CUALQUIER empleado con token: bastaba llamar la API directamente.
# Se dejan abiertas a todo el personal las rutas que usan pantallas de vendedor (recibir mercancía, órdenes, etc.).
_SOLO_ADMIN = [(m, _re.compile(r)) for m, r in (
    ("*",   r"/analytics(/.*)?"),
    ("*",   r"/(ml|shein|walmart|amazon|tiktok)(/.*)?"),
    ("*",   r"/emails(/.*)?"),                                   # buzón corporativo (contacto-web es público: se evalúa antes)
    ("*",   r"/push/(enviar|suscriptores|lista|historial|diagnostico)"),
    ("*",   r"/finanzas/(reporte|estado-resultados|flujo|cuentas-por-cobrar|cuentas-por-pagar|valor-inventario|proyeccion|saldo|deudas|gastos|caja)(/.*)?"),
    ("*",   r"/finanzas/ordenes/[^/]+/(abonos|marcar-pagada|marcar-cancelada)"),
    ("POST|PATCH|DELETE", r"/sucursales(/.*)?"),
    ("POST", r"/(seo|config)(/.*)?"),
    ("*",   r"/resenas/admin/.*"),
    ("PATCH", r"/sugerencias(/.*)?"),
    ("POST|PATCH|DELETE", r"/catalogos(/.*)?"),
)]


@app.middleware("http")
async def _puerta_auth(request, call_next):
    if AUTH_ENFORCE and request.method != "OPTIONS":
        path = request.url.path
        if (path.startswith(_PREFIJOS_PROTEGIDOS)
                and path not in ("/feed.json",)
                and not _coincide(_PUBLICAS, request.method, path)):
            auth = request.headers.get("authorization", "")
            if not auth.lower().startswith("bearer "):
                return JSONResponse(status_code=401, content={"detail": "Autenticacion requerida"})
            try:
                payload = verify_token(auth[7:])
            except Exception:
                return JSONResponse(status_code=401, content={"detail": "Token invalido o expirado"})
            try:
                payload = _aplicar_vigencia(payload)   # cuenta desactivada -> 401; rol vigente de la base
            except Exception:
                return JSONResponse(status_code=401, content={"detail": "Cuenta desactivada"})
            if not es_personal(payload) and not _coincide(_CON_TOKEN, request.method, path):
                return JSONResponse(status_code=403, content={"detail": "Se requiere acceso de personal"})
            if es_personal(payload) and payload.get("rol") != "admin" and _coincide(_SOLO_ADMIN, request.method, path):
                return JSONResponse(status_code=403, content={"detail": "Se requiere rol de administrador"})
    return await call_next(request)

# Los orígenes de PRODUCCIÓN siempre están presentes (nunca se quitan → cero riesgo
# para el sitio real). Los de localhost solo se agregan fuera de producción: Railway
# define RAILWAY_ENVIRONMENT, así que allí no se incluyen. Forzar con ALLOW_LOCALHOST_CORS=1.
ALLOWED_ORIGINS = [
    "https://zapatillasmay.mx",
    "https://www.zapatillasmay.mx",
    "https://zapatillasmay-panel.vercel.app",
    "https://portal.zapatillasmay.mx",
]
_EN_PROD = os.getenv("RAILWAY_ENVIRONMENT", "") != ""
if not _EN_PROD or os.getenv("ALLOW_LOCALHOST_CORS") == "1":
    ALLOWED_ORIGINS += [
        "http://localhost:5173",
        "http://localhost:4173",
        "http://localhost:3000",
        "http://localhost:5179",
        "http://localhost:5180",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Request-Id"],
)

_CSP = (
    "default-src 'self' https: data: blob:; "
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; "
    "style-src 'self' 'unsafe-inline' https:; "
    "img-src 'self' data: blob: https:; "
    "font-src 'self' https: data:; "
    "connect-src 'self' https:; "
    "frame-src 'self' https:; "
    "frame-ancestors 'self'; object-src 'none'; base-uri 'self'"
)

@app.middleware("http")
async def _security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Content-Security-Policy"] = _CSP
    # Catálogo público de la tienda (~450 KB por visita, se pedía completo en cada página): caché corta del navegador,
    # SOLO para peticiones sin sesión. Con token (panel/portal) nunca se cachea, y `Vary` evita que una caché compartida
    # mezcle la versión pública con la de personal (que trae costos).
    if request.method == "GET" and response.status_code == 200 and request.url.path in _CACHE_PUBLICA:
        response.headers["Vary"] = "Authorization"
        if request.headers.get("authorization"):
            response.headers["Cache-Control"] = "private, no-store"
        else:
            response.headers["Cache-Control"] = "public, max-age=30, stale-while-revalidate=60"
    return response

_CACHE_PUBLICA = {"/productos/", "/productos/nuevos", "/variantes/", "/inventario/slim", "/seo/config",
                  "/config/envio", "/catalogos/", "/sucursales/"}

app.include_router(productos.router)
app.include_router(sucursales.router)
app.include_router(inventario.router)
app.include_router(clientes.router)
app.include_router(pedidos.router)
app.include_router(imagenes.router)
app.include_router(variantes.router)
app.include_router(movimientos.router)
app.include_router(pagos.router)
app.include_router(auth.router)
app.include_router(empleados.router)
app.include_router(seo.router)
app.include_router(crm.router)
app.include_router(finanzas.router)
app.include_router(chatbot.router)
app.include_router(campanas.router)
app.include_router(tiktok.router)
app.include_router(catalogos.router)
app.include_router(mercadolibre.router)
app.include_router(shein.router)
app.include_router(walmart.router)
app.include_router(amazon.router)
app.include_router(analytics.router)
app.include_router(searchconsole.router)
app.include_router(merchant.router)
app.include_router(businessprofile.router)
app.include_router(referidos.router)
app.include_router(carrito_abandonado.router)
app.include_router(mcp_server.router)
app.include_router(resenas.router)
app.include_router(pinterest.router)
app.include_router(portal.router)
app.include_router(sugerencias.router)
app.include_router(push.router)
app.include_router(emails.router)

# ── Hilo en segundo plano: procesar carritos abandonados cada 15 min ──
import threading, time as _time
import datetime as _dt

def _loop_carritos_abandonados():
    # Espera inicial para no correr justo al arrancar
    _time.sleep(120)
    while True:
        try:
            res = carrito_abandonado.procesar_recordatorios()
            if res.get("enviados"):
                print(f"[carrito-abandonado] Recordatorios enviados: {res['enviados']}")
        except Exception as e:
            print(f"[carrito-abandonado] Error en loop: {e}")
        _time.sleep(15 * 60)  # cada 15 minutos

def _loop_ml_ventas():
    """Descuenta inventario del ERP por ventas nuevas en MercadoLibre, y marca
    como enviados los pedidos que el vendedor ya despachó en una agencia de
    ML (no cuando le llega al cliente), cada 10 minutos."""
    _time.sleep(150)  # espera inicial
    while True:
        try:
            from routers.mercadolibre import _hacer_sync_ventas
            res = _hacer_sync_ventas()
            if res.get("procesadas"):
                print(f"[ml-ventas] Pedidos procesados: {res['procesadas']} de {res['revisadas']} revisadas")
        except Exception as e:
            print(f"[ml-ventas] Error en loop: {e}")
        try:
            from routers.mercadolibre import _hacer_sync_entregas
            res2 = _hacer_sync_entregas()
            if res2.get("actualizados"):
                print(f"[ml-entregas] Marcados como enviados: {res2['actualizados']} de {res2['revisados']} revisados")
        except Exception as e:
            print(f"[ml-entregas] Error en loop: {e}")
        _time.sleep(10 * 60)  # cada 10 minutos

def _loop_shein_ventas():
    """Descuenta inventario del ERP por ventas nuevas en SHEIN cada 10 minutos
    (antes solo corria si alguien entraba al panel y le daba clic manual al
    boton de sincronizar -- las ventas se podian quedar sin descontar)."""
    _time.sleep(200)  # espera inicial, escalonada contra los otros hilos
    while True:
        try:
            from routers.shein import _hacer_sync_ventas_shein
            res = _hacer_sync_ventas_shein()
            if res.get("procesadas"):
                print(f"[shein-ventas] Pedidos procesados: {res['procesadas']} de {res['revisadas']} revisadas")
        except Exception as e:
            print(f"[shein-ventas] Error en loop: {e}")
        _time.sleep(10 * 60)  # cada 10 minutos

def _loop_amazon_ventas():
    """Trae ventas nuevas de Amazon y descuenta inventario cada 10 minutos. No hace
    nada mientras no estén las variables AMAZON_* en Railway (cuenta sin conectar)."""
    _time.sleep(230)
    while True:
        try:
            from routers.amazon import _hacer_sync_ventas_amazon, _configurado
            if _configurado():
                res = _hacer_sync_ventas_amazon()
                if res.get("procesadas"):
                    print(f"[amazon-ventas] Pedidos procesados: {res['procesadas']} de {res['revisadas']} revisadas")
        except Exception as e:
            print(f"[amazon-ventas] Error en loop: {e}")
        _time.sleep(10 * 60)

def _loop_tiktok_sync():
    """Sincroniza inventario con TikTok Shop cada 30 minutos si hay token activo."""
    _time.sleep(180)  # espera 3 min al arrancar
    while True:
        try:
            estado = tiktok_router.status()
            if isinstance(estado, dict) and estado.get("connected"):
                res = tiktok_router.sync_stock()
                if isinstance(res, dict) and res.get("ok"):
                    print(f"[tiktok-sync] Stock actualizado — OK:{res.get('actualizados')} ERR:{res.get('errores')} SIN_MATCH:{res.get('sin_match')}")
                else:
                    print(f"[tiktok-sync] Respuesta inesperada: {res}")
        except Exception as e:
            print(f"[tiktok-sync] Error en loop: {e}")
        _time.sleep(30 * 60)  # cada 30 minutos

def _loop_secuencias_wa():
    """Revisa cada 15 minutos si hay pasos de secuencias de WhatsApp (drip) que
    ya les toca enviarse y los manda."""
    _time.sleep(120)  # espera inicial
    while True:
        try:
            from routers.chatbot import procesar_secuencias_wa
            res = procesar_secuencias_wa()
            if res.get("enviados"):
                print(f"[secuencias-wa] Enviados: {res['enviados']} de {res.get('revisados', 0)} revisados")
        except Exception as e:
            print(f"[secuencias-wa] Error en loop: {e}")
        _time.sleep(15 * 60)  # cada 15 minutos

def _loop_correo_nuevo():
    """Revisa el Inbox de Zoho Mail cada 15 minutos y manda push a los admins
    suscritos (sitio='panel') cuando llega correo nuevo.
    Antes era cada 5 min (8,640 veces/mes) -- se bajó a 15 min (~2,880/mes)
    para reducir el consumo de Memory/Network en Railway, que es lo que
    hace que el plan Hobby de $5 casi siempre termine costando más."""
    _time.sleep(90)  # espera inicial
    while True:
        try:
            import zoho_mail
            from routers.push import enviar_push
            if zoho_mail.configurado():
                nuevos = zoho_mail.verificar_correo_nuevo()
                for m in nuevos:
                    enviar_push(
                        f"📧 Correo nuevo de {m['de']}",
                        m["asunto"],
                        url="/",
                        sitio="panel",
                    )
                if nuevos:
                    print(f"[correo-nuevo] Push enviado por {len(nuevos)} correo(s) nuevo(s)")
        except Exception as e:
            print(f"[correo-nuevo] Error en loop: {e}")
        _time.sleep(15 * 60)  # cada 15 minutos

def _loop_limpieza_cache():
    """Purga entradas vencidas del caché en memoria cada 10 minutos. El
    caché (cache.py) solo se limpia solo cuando alguien vuelve a pedir la
    MISMA clave vencida -- claves de baja frecuencia (ej. ssr_prod_{sku} por
    cada producto que visita un bot) se quedaban acumuladas en RAM sin
    límite hasta el próximo redeploy, y eso es lo que hacía que el uso de
    Memory en Railway subiera de forma constante durante días (ver Usage:
    Memory era ~75% del costo del plan Hobby)."""
    _time.sleep(300)  # espera inicial
    while True:
        try:
            borradas = cache_cleanup_expired()
            if borradas:
                print(f"[limpieza-cache] {borradas} entrada(s) vencida(s) purgada(s)")
        except Exception as e:
            print(f"[limpieza-cache] Error en loop: {e}")
        _time.sleep(10 * 60)  # cada 10 minutos

def _loop_reporte_semanal():
    """Cada lunes ~9am (hora Mexico, UTC-6) manda un push a los admins del
    panel con el resumen de la semana: sesiones/usuarios de GA4 y gasto/
    compras/ROAS de Meta Ads -- para no tener que entrar al panel a
    revisarlo. Revisa cada 30 min y solo dispara una vez por semana
    (guarda la fecha del último envío en memoria)."""
    _time.sleep(240)
    ultimo_envio = None
    while True:
        try:
            ahora_mx = _dt.datetime.now(_dt.timezone.utc) - _dt.timedelta(hours=6)
            if ahora_mx.weekday() == 0 and 9 <= ahora_mx.hour < 10 and ultimo_envio != ahora_mx.date():
                semana = analytics.metricas_semana()
                dias = (semana.get("dias") or [])[-7:]
                sesiones_semana = sum(d.get("sesiones", 0) for d in dias)
                usuarios_semana = sum(d.get("usuarios", 0) for d in dias)
                meta = analytics.meta_ads(periodo="last_7d")
                if meta.get("configurado") and not meta.get("error"):
                    gasto   = meta.get("total_gasto", 0)
                    compras = meta.get("total_compras", 0)
                    roas    = meta.get("roas_promedio", 0)
                    cuerpo  = f"{sesiones_semana} sesiones, {usuarios_semana} usuarios · Meta: ${gasto:,.0f} gastados, {compras} compras, ROAS {roas}x"
                else:
                    cuerpo = f"{sesiones_semana} sesiones, {usuarios_semana} usuarios · Meta Ads no disponible"
                push.enviar_push("📊 Resumen semanal", cuerpo, url="/", sitio="panel")
                ultimo_envio = ahora_mx.date()
                print(f"[reporte-semanal] Enviado: {cuerpo}")
        except Exception as e:
            print(f"[reporte-semanal] Error en loop: {e}")
        _time.sleep(30 * 60)  # revisa cada 30 minutos


def _loop_apartados_vencidos():
    """Cada mañana (~9am México) avisa por push al panel cuántos apartados ya vencieron. NO libera nada solo
    (eso lo decide la dueña): antes un apartado vencido solo se marcaba en rojo dentro de Carritos y su stock
    quedaba reservado indefinidamente sin que nadie se enterara."""
    _time.sleep(260)
    ultimo_aviso = None
    while True:
        try:
            ahora_mx = _dt.datetime.now(_dt.timezone.utc) - _dt.timedelta(hours=6)
            if 9 <= ahora_mx.hour < 10 and ultimo_aviso != ahora_mx.date():
                import urllib.parse as _up
                corte = _up.quote(_dt.datetime.now(_dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"))
                vencidos = supabase_get(f"pedidos?status=eq.apartado&apartado_hasta=lt.{corte}&select=id,nombre_cliente") or []
                ultimo_aviso = ahora_mx.date()
                if vencidos:
                    push.enviar_push(
                        "⏰ Apartados vencidos",
                        f"{len(vencidos)} apartado(s) ya vencieron y siguen reservando stock. Revisa Carritos.",
                        url="/?modulo=carritos", sitio="panel",
                    )
                    print(f"[apartados] aviso: {len(vencidos)} vencido(s)")
        except Exception as e:
            print(f"[apartados] Error en loop: {e}")
        _time.sleep(30 * 60)


def _loop_chats_sin_responder():
    """Cada mañana (~9am México) avisa por push cuántas clientas llevan más de 24 h sin que nadie (ni Maya) les
    conteste. Hoy hay chats donde la clienta esperó días sin que nadie se enterara."""
    _time.sleep(280)
    ultimo_aviso = None
    while True:
        try:
            ahora_mx = _dt.datetime.now(_dt.timezone.utc) - _dt.timedelta(hours=6)
            if 9 <= ahora_mx.hour < 10 and ultimo_aviso != ahora_mx.date():
                from database import supabase_rpc
                ahora = _dt.datetime.now(_dt.timezone.utc)
                esperando = 0
                for c in (supabase_rpc("chats_lista", {"p_limite": 400, "p_msgs": 1}) or []):
                    ent, sal = c.get("ult_entrante"), c.get("ult_saliente")
                    if not ent:
                        continue
                    te = _dt.datetime.fromisoformat(ent.replace("Z", "+00:00"))
                    ts = _dt.datetime.fromisoformat(sal.replace("Z", "+00:00")) if sal else None
                    if (ts is None or te > ts) and (ahora - te).total_seconds() > 24 * 3600 and (ahora - te).days < 30:
                        esperando += 1
                ultimo_aviso = ahora_mx.date()
                if esperando:
                    push.enviar_push(
                        "⏳ Clientas sin respuesta",
                        f"{esperando} conversación(es) llevan más de 24 h sin respuesta. Revisa Conversaciones > Sin responder.",
                        url="/?modulo=conversaciones", sitio="panel",
                    )
                    print(f"[chats] aviso: {esperando} chat(s) sin responder")
        except Exception as e:
            print(f"[chats] Error en loop de sin responder: {e}")
        _time.sleep(30 * 60)


@app.on_event("startup")
def _iniciar_hilos():
    # Carrito abandonado
    t1 = threading.Thread(target=_loop_carritos_abandonados, daemon=True)
    t1.start()
    print("[carrito-abandonado] Hilo de recordatorios iniciado (cada 15 min)")
    # TikTok Shop sync
    t2 = threading.Thread(target=_loop_tiktok_sync, daemon=True)
    t2.start()
    print("[tiktok-sync] Hilo de sincronización de inventario iniciado (cada 30 min)")
    # MercadoLibre: descontar inventario por ventas nuevas
    t3 = threading.Thread(target=_loop_ml_ventas, daemon=True)
    t3.start()
    print("[ml-ventas] Hilo de sincronización de ventas iniciado (cada 10 min)")
    # SHEIN: descontar inventario por ventas nuevas
    t3b = threading.Thread(target=_loop_shein_ventas, daemon=True)
    t3b.start()
    print("[shein-ventas] Hilo de sincronización de ventas iniciado (cada 10 min)")
    # Amazon: descontar inventario por ventas nuevas (solo si está configurado)
    t3c = threading.Thread(target=_loop_amazon_ventas, daemon=True)
    t3c.start()
    print("[amazon-ventas] Hilo de sincronización de ventas iniciado (cada 10 min, solo si hay credenciales)")
    # Correo entrante: avisar a admins del panel
    t4 = threading.Thread(target=_loop_correo_nuevo, daemon=True)
    t4.start()
    print("[correo-nuevo] Hilo de aviso de correo entrante iniciado (cada 15 min)")
    # Secuencias de WhatsApp (drip)
    t5 = threading.Thread(target=_loop_secuencias_wa, daemon=True)
    t5.start()
    print("[secuencias-wa] Hilo de secuencias de WhatsApp iniciado (cada 15 min)")
    # Reporte semanal (GA4 + Meta Ads) por push a los admins del panel
    t6 = threading.Thread(target=_loop_reporte_semanal, daemon=True)
    t6.start()
    print("[reporte-semanal] Hilo de reporte semanal iniciado (lunes 9am)")
    # Aviso diario de clientas sin responder
    t9 = threading.Thread(target=_loop_chats_sin_responder, daemon=True)
    t9.start()
    # Aviso diario de apartados vencidos
    t8 = threading.Thread(target=_loop_apartados_vencidos, daemon=True)
    t8.start()
    # Limpieza periódica del caché en memoria (evita que crezca sin límite)
    t7 = threading.Thread(target=_loop_limpieza_cache, daemon=True)
    t7.start()
    print("[limpieza-cache] Hilo de limpieza de caché iniciado (cada 10 min)")

@app.get("/")
def inicio():
    return {
        "mensaje": "ERP Zapatillas May funcionando",
        "version": "1.0.0"
    }

@app.get("/salud")
def salud():
    try:
        supabase_get("sucursales")
        return {"estado": "ok", "base_de_datos": "conectada"}
    except Exception as e:
        return JSONResponse(status_code=503, content={"estado": "error", "detalle": "base de datos no disponible"})
        # redeploy finanzas
        
@app.get("/health")
def health():
    return {"ok": True}

@app.get("/utils/cp/{cp}")
def buscar_cp(cp: str):
    """Proxy SEPOMEX: devuelve estado, ciudad y colonias para un CP mexicano."""
    import urllib.request, json, re
    cp = re.sub(r'\D', '', cp)[:5]
    if len(cp) != 5:
        return {"error": "CP inválido"}
    try:
        req = urllib.request.Request(
            f"https://sepomex.nitrostudio.com.mx/api/latest/cp/{cp}.json",
            headers={"User-Agent": "ZapatillasMay/1.0"}
        )
        with urllib.request.urlopen(req, timeout=5) as r:
            data = json.loads(r.read())
        posts = data.get("data", {}).get("postcodes", [])
        if not posts:
            return {"error": "CP no encontrado"}
        estado = (posts[0].get("d_estado") or "").strip()
        ciudad = (posts[0].get("d_mnpio") or posts[0].get("d_ciudad") or "").strip()
        colonias = sorted({(p.get("d_asenta") or "").strip() for p in posts if p.get("d_asenta")})
        return {"estado": estado, "ciudad": ciudad, "colonias": colonias}
    except Exception as e:
        return {"error": str(e)}

@app.get("/cache/stats")
def cache_estado(_staff=Depends(require_staff)):
    """Ver qué hay en caché y cuánto tiempo le queda a cada clave."""
    return cache_stats()

@app.post("/cache/limpiar")
def cache_limpiar(_staff=Depends(require_staff)):
    """Limpiar todo el caché manualmente (fuerza recarga desde Supabase)."""
    for prefijo in ("productos", "variantes", "inventario", "tpl_", "seo_", "ssr_"):
        cache_invalidate_prefix(prefijo)
    return {"ok": True, "mensaje": "Caché limpiado"}