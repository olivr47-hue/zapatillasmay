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
from routers import referidos

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
app.include_router(referidos.router)

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
    for prefijo in ("productos", "variantes", "inventario"):
        cache_invalidate_prefix(prefijo)
    return {"ok": True, "mensaje": "Caché limpiado"}        