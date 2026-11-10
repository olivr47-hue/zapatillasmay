"""
tiktok_broker.py -- «copia por cliente»: cada negocio que renta el sistema tiene SU PROPIA copia (su base de datos, su servidor y su panel).
La app de TikTok (ERP MAY) es UNA sola y su secreto NO se reparte: lo guarda solo el servidor central (este proyecto), que actua de intermediario:

  · FIRMA las llamadas a TikTok de cada copia (TikTok exige firmar con el secreto de la app).
  · RENUEVA el acceso de cada copia cuando se vence.
  · RECIBE el regreso de la autorizacion de TikTok (una sola direccion para todos), canjea el codigo y ENTREGA el acceso a la copia correcta.

Cada copia se identifica con un codigo y un secreto propio (tabla clientes_sistema). Todo mensaje entre copia y central va firmado con HMAC-SHA256
sobre el cuerpo, con marca de tiempo (tolerancia 5 min), para que nadie pueda hacerse pasar por otro cliente.
"""
import hashlib
import hmac
import json
import secrets
import time
import urllib.error
import urllib.request

from database import supabase_get, supabase_post, supabase_patch

TOLERANCIA_SEG = 300


def firmar(secreto: str, cuerpo: bytes) -> str:
    return hmac.new(secreto.encode("utf-8"), cuerpo, hashlib.sha256).hexdigest()


def firma_valida(secreto: str, cuerpo: bytes, firma: str) -> bool:
    return bool(secreto and firma) and hmac.compare_digest(firmar(secreto, cuerpo), str(firma))


def cliente_por_codigo(codigo: str):
    if not codigo or len(codigo) > 40:
        return None
    import urllib.parse as _up
    filas = supabase_get(f"clientes_sistema?codigo=eq.{_up.quote(codigo, safe='')}&activo=eq.true&limit=1") or []
    return filas[0] if filas else None


def verificar_cliente(codigo: str, cuerpo: bytes, firma: str):
    """(cliente, datos_json, None) si la peticion viene de una copia registrada y la firma y la hora son validas; si no, (None, None, motivo)."""
    cli = cliente_por_codigo(codigo)
    if not cli:
        return None, None, "cliente desconocido o desactivado"
    if not firma_valida(cli["secreto"], cuerpo, firma):
        return None, None, "firma invalida"
    try:
        datos = json.loads(cuerpo or b"{}")
    except Exception:
        return None, None, "cuerpo invalido"
    if abs(time.time() - float(datos.get("ts") or 0)) > TOLERANCIA_SEG:
        return None, None, "peticion vencida"
    return cli, datos, None


def post_firmado(url: str, codigo: str, secreto: str, datos: dict, timeout: int = 20) -> dict:
    """POST de JSON firmado (sirve en los dos sentidos: copia -> central y central -> copia)."""
    cuerpo = json.dumps({**datos, "ts": int(time.time())}, separators=(",", ":")).encode("utf-8")
    req = urllib.request.Request(url, data=cuerpo, method="POST",
                                 headers={"Content-Type": "application/json", "X-Cliente": codigo, "X-Firma": firmar(secreto, cuerpo)})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        try:
            return {"error": json.loads(e.read()).get("error") or f"HTTP {e.code}", "http": e.code}
        except Exception:
            return {"error": f"HTTP {e.code}", "http": e.code}
    except Exception as e:
        return {"error": f"{type(e).__name__}: {str(e)[:120]}"}


def crear_cliente(nombre: str, url_api: str, url_panel: str = "") -> dict:
    """Da de alta una copia. Devuelve el codigo y el secreto (el secreto solo se ve esta vez: se pone en las variables de esa copia)."""
    codigo = "c-" + secrets.token_hex(4)
    secreto = secrets.token_urlsafe(32)
    supabase_post("clientes_sistema", {"codigo": codigo, "nombre": nombre[:120], "url_api": url_api.rstrip("/"),
                                       "url_panel": (url_panel or "").rstrip("/") or None, "secreto": secreto})
    return {"codigo": codigo, "secreto": secreto}
