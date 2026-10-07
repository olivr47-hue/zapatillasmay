"""Conexiones: ver y capturar desde el panel las claves de las integraciones (solo administrador). Ver integraciones_cfg.py.
  GET    /config/integraciones            estado de cada integración (los secretos solo con los últimos 4 caracteres)
  PUT    /config/integraciones/{clave}    guarda un valor (cifrado) y lo aplica de inmediato
  DELETE /config/integraciones/{clave}    quita el valor del panel y vuelve a usar el de Railway
"""
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

import integraciones_cfg as cfg
from security import require_admin

router = APIRouter(prefix="/config/integraciones", tags=["Conexiones"])


@router.get("")
def ver_conexiones(_a=Depends(require_admin)):
    return {"integraciones": cfg.estado(), "cifrado": cfg.Fernet is not None}


@router.put("/{clave}")
def guardar_conexion(clave: str, datos: dict, a=Depends(require_admin)):
    try:
        cfg.guardar(clave, str(datos.get("valor") or ""), quien=str(a.get("email") or a.get("nombre") or "admin"))
    except KeyError as e:
        return JSONResponse(status_code=404, content={"error": str(e.args[0])})
    except ValueError as e:
        return JSONResponse(status_code=400, content={"error": str(e)})
    except Exception as e:
        print(f"[conexiones] guardar {clave}: {e}")
        return JSONResponse(status_code=500, content={"error": "No se pudo guardar. Intenta de nuevo."})
    print(f"[conexiones] {clave} actualizada desde el panel por {a.get('email') or a.get('nombre')}")   # nunca se imprime el valor
    return {"ok": True}


@router.delete("/{clave}")
def quitar_conexion(clave: str, a=Depends(require_admin)):
    try:
        cfg.quitar(clave)
    except KeyError as e:
        return JSONResponse(status_code=404, content={"error": str(e.args[0])})
    except Exception as e:
        print(f"[conexiones] quitar {clave}: {e}")
        return JSONResponse(status_code=500, content={"error": "No se pudo quitar. Intenta de nuevo."})
    print(f"[conexiones] {clave} quitada del panel por {a.get('email') or a.get('nombre')}")
    return {"ok": True}
