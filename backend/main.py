from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="ERP Zapatillas May",
    description="Sistema de gestión para Zapatillas May",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def inicio():
    return {
        "mensaje": "ERP Zapatillas May funcionando",
        "version": "1.0.0"
    }

@app.get("/salud")
def salud():
    return {"estado": "ok"}