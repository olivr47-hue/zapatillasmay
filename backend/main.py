from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import supabase_get
from routers import productos, sucursales, inventario, clientes, pedidos, imagenes, variantes, movimientos

app = FastAPI(
    title="ERP Zapatillas May",
    description="Sistema de gestión para Zapatillas May",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(productos.router)
app.include_router(sucursales.router)
app.include_router(inventario.router)
app.include_router(clientes.router)
app.include_router(pedidos.router)
app.include_router(imagenes.router)
app.include_router(variantes.router)
app.include_router(movimientos.router)

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