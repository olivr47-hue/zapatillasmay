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

ALLOWED_ORIGINS = [
    "https://zapatillasmay.mx",
    "https://www.zapatillasmay.mx",
    "https://zapatillasmay-panel.vercel.app",
    "http://localhost:5173",
    "http://localhost:4173",
    "http://localhost:3000",
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
app.include_router(analytics.router)
app.include_router(searchconsole.router)
app.include_router(merchant.router)
app.include_router(businessprofile.router)
app.include_router(referidos.router)
app.include_router(carrito_abandonado.router)
app.include_router(mcp_server.router)
app.include_router(resenas.router)
app.include_router(pinterest.router)

# ── Hilo en segundo plano: procesar carritos abandonados cada 15 min ──
import threading, time as _time

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