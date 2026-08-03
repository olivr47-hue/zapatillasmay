import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from security import limiter
from database import supabase_get
from cache import cache_stats, cache_invalidate_prefix
from routers import productos, sucursales, inventario, clientes, pedidos, imagenes, variantes, movimientos, pagos, auth, crm, finanzas, chatbot
from routers import empleados
from routers import seo
from routers import campanas
from routers import tiktok
from routers import catalogos
from routers import mercadolibre
from routers import shein
from routers import walmart
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
    return response

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
    """Descuenta inventario del ERP por ventas nuevas en MercadoLibre cada 10 minutos."""
    _time.sleep(150)  # espera inicial
    while True:
        try:
            from routers.mercadolibre import _hacer_sync_ventas
            res = _hacer_sync_ventas()
            if res.get("procesadas"):
                print(f"[ml-ventas] Pedidos procesados: {res['procesadas']} de {res['revisadas']} revisadas")
        except Exception as e:
            print(f"[ml-ventas] Error en loop: {e}")
        _time.sleep(10 * 60)  # cada 10 minutos

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
        return {"estado": "error", "detalle": str(e)}
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
def cache_estado():
    """Ver qué hay en caché y cuánto tiempo le queda a cada clave."""
    return cache_stats()

@app.post("/cache/limpiar")
def cache_limpiar():
    """Limpiar todo el caché manualmente (fuerza recarga desde Supabase)."""
    for prefijo in ("productos", "variantes", "inventario", "tpl_", "seo_", "ssr_"):
        cache_invalidate_prefix(prefijo)
    return {"ok": True, "mensaje": "Caché limpiado"}