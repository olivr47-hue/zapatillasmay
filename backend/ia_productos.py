# -*- coding: utf-8 -*-
"""
Alta de productos asistida: Claude mira las fotos de un modelo y PROPONE los datos de la ficha (nombre descriptivo, descripción,
categoría, tipo y altura de tacón, material, temporada, colores). El equipo revisa y guarda: nada se publica solo.
Precio, código del modelo y existencias NO los propone (Claude no los puede saber).
"""
import os
import re
import json
import base64
import urllib.request
import urllib.error

MODELO = os.getenv("IA_PRODUCTOS_MODELO", "claude-sonnet-4-6")

_PROMPT = """Eres experta en calzado de dama de una zapatería mexicana (Zapatillas May, León, Gto.). Mira las fotos de UN modelo de calzado y propone
los datos para darlo de alta en la tienda en línea. Escribe en español de México, claro y sin exagerar.
Código del modelo (no lo cambies): {CODIGO}
Texto que ya escribió el equipo (puede estar vacío): {TEXTO}

Elige SIEMPRE entre las opciones permitidas; si ninguna aplica, usa "".
- categoria: una de {CATEGORIAS}
- tipo_tacon: una de {TIPOS_TACON}
- temporada: una de {TEMPORADAS}

Responde SOLO un objeto JSON con:
{
  "nombre": "CODIGO + nombre descriptivo corto como lo buscaría una clienta (ej. 'EF1627 Botines de malla punta de pez de verano para dama'), máx. 80 caracteres",
  "descripcion": "2 a 4 frases: qué es, para qué ocasión, cómo se ve y se siente; sin inventar materiales que no se vean",
  "categoria": "...",
  "tipo_tacon": "...",
  "altura_tacon_cm": número aproximado o null si no tiene tacón o no se aprecia,
  "material": "lo que se aprecia: sintético, piel, charol, gamuza, malla, textil, etc.",
  "temporada": "...",
  "colores": ["nombres de los colores que se ven, en español, ej. 'Negro', 'Nude', 'Dorado'"],
  "ocasion": "fiesta, oficina, casual, boda, etc.",
  "notas": "algo que el equipo deba verificar (ej. 'la altura es aproximada, mídela')"
}"""


def _descargar(url: str):
    u = url
    if "/image/upload/" in u and "/image/upload/w_" not in u:
        u = u.replace("/image/upload/", "/image/upload/w_1000,f_jpg,q_80/")
    with urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "zm-ia-productos"}), timeout=30) as r:
        datos = r.read(8 * 1024 * 1024)
        ct = (r.headers.get("Content-Type") or "image/jpeg").split(";")[0].strip().lower()
    if ct not in ("image/jpeg", "image/png", "image/webp", "image/gif"):
        ct = "image/jpeg"
    return datos, ct


def sugerir_desde_fotos(urls: list, codigo: str = "", texto: str = "", opciones: dict = None) -> dict:
    key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not key:
        return {"error": "Falta ANTHROPIC_API_KEY"}
    # cada foto puede ser una dirección https (ya subida) o {"media_type","data"} en base64 (foto nueva reducida en el navegador)
    entradas = [u for u in (urls or []) if (isinstance(u, str) and u.startswith("https://"))
                or (isinstance(u, dict) and u.get("data") and u.get("media_type") in ("image/jpeg", "image/png", "image/webp"))][:4]
    if not entradas:
        return {"error": "Primero agrega al menos una foto del modelo"}
    opciones = opciones or {}
    bloques = []
    for u in entradas:
        try:
            if isinstance(u, dict):
                if len(u["data"]) > 3_000_000:      # ~2.2 MB: el navegador ya la reduce; esto es solo un tope
                    continue
                bloques.append({"type": "image", "source": {"type": "base64", "media_type": u["media_type"], "data": u["data"]}})
            else:
                datos, ct = _descargar(u)
                bloques.append({"type": "image", "source": {"type": "base64", "media_type": ct, "data": base64.b64encode(datos).decode()}})
        except Exception as e:
            print(f"[ia_productos] no se pudo usar una foto: {e}")
    if not bloques:
        return {"error": "No se pudieron abrir las fotos"}
    lista = lambda k: json.dumps([x for x in (opciones.get(k) or []) if x], ensure_ascii=False) or "[]"
    prompt = (_PROMPT.replace("{CODIGO}", (codigo or "(sin código)")[:40]).replace("{TEXTO}", (texto or "")[:600])
              .replace("{CATEGORIAS}", lista("categorias")).replace("{TIPOS_TACON}", lista("tipos_tacon")).replace("{TEMPORADAS}", lista("temporadas")))
    cuerpo = {"model": MODELO, "max_tokens": 900, "messages": [{"role": "user", "content": bloques + [{"type": "text", "text": prompt}]}]}
    req = urllib.request.Request("https://api.anthropic.com/v1/messages", data=json.dumps(cuerpo).encode(), method="POST",
                                 headers={"x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            resp = json.loads(r.read())
    except urllib.error.HTTPError as e:
        detalle = e.read().decode(errors="replace")
        try:
            msg = (json.loads(detalle).get("error") or {}).get("message") or detalle[:200]
        except Exception:
            msg = detalle[:200]
        return {"error": "La cuenta de la API de Claude no tiene saldo" if "credit balance" in msg.lower() else msg}
    texto_r = "".join(b.get("text", "") for b in resp.get("content", []) if b.get("type") == "text")
    m = re.search(r"\{.*\}", texto_r, re.S)
    if not m:
        return {"error": "No se pudo interpretar la respuesta"}
    try:
        d = json.loads(m.group(0))
    except Exception:
        return {"error": "No se pudo interpretar la respuesta"}
    # solo valores permitidos en los campos de lista
    for campo, k in (("categoria", "categorias"), ("tipo_tacon", "tipos_tacon"), ("temporada", "temporadas")):
        permitidas = [x for x in (opciones.get(k) or []) if x]
        if permitidas and d.get(campo) not in permitidas:
            d[campo] = ""
    try:
        a = d.get("altura_tacon_cm")
        d["altura_tacon_cm"] = round(float(a) * 2) / 2 if a not in (None, "") else None
    except (TypeError, ValueError):
        d["altura_tacon_cm"] = None
    cod = (codigo or "").strip()
    if cod and d.get("nombre") and not str(d["nombre"]).upper().startswith(cod.upper()):
        d["nombre"] = f"{cod} {d['nombre']}"
    d["nombre"] = str(d.get("nombre") or "")[:90]
    return {"ok": True, **d}
