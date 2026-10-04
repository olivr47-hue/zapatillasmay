from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.security import HTTPAuthorizationCredentials
from database import supabase_get, supabase_get_all, supabase_post, supabase_patch, inventario_ajustar
from security import hash_password, require_staff, bearer_opcional, cliente_autorizado, verify_token, es_personal, limpiar_dict

router = APIRouter(prefix="/clientes", tags=["Clientes"])

# Campos que un cliente puede autoeditar desde el portal (nunca crédito, límite,
# tipo ni activo -- eso solo lo toca personal via require_staff en otras rutas).
_CAMPOS_CLIENTE_AUTOEDITABLES = {
    "nombre", "telefono", "email", "ciudad", "estado",
    "direccion", "codigo_postal",
}

@router.get("/")
def listar_clientes(_staff=Depends(require_staff)):
    try:
        return supabase_get_all("clientes?activo=eq.true&order=nombre.asc")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/referidos")
def listar_referidos(_staff=Depends(require_staff)):
    try:
        return supabase_get_all("clientes?tipo=eq.menudeo&activo=eq.true&order=credito_disponible.desc&select=id,nombre,email,telefono,codigo_referido,referido_por,credito_disponible")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/portal-mayoreo")
def listar_accesos_portal_mayoreo(_staff=Depends(require_staff)):
    """Cuentas (tabla usuarios) con acceso al portal mayorista -- para saber
    quién está registrado y cuándo entró por última vez (ultimo_login se
    guarda en /auth/login). El filtro real de "es mayorista" es el tipo del
    cliente ligado, no el tipo del usuario -- por eso el !inner + filtro
    sobre clientes.tipo en vez de usuarios.tipo."""
    try:
        return supabase_get_all(
            "usuarios?select=id,nombre,email,activo,ultimo_login,created_at,"
            "clientes!inner(id,nombre,telefono,ciudad,estado,tipo)"
            "&clientes.tipo=in.(zapateria,mayoreo)"
            "&order=ultimo_login.desc.nullslast"
        )
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/resumen")
def resumen_clientes(_staff=Depends(require_staff)):
    """Solo id y fecha de alta de TODOS los clientes (el dashboard únicamente cuenta y filtra por fecha;
    antes bajaba la ficha completa de cada cliente)."""
    try:
        return supabase_get_all("clientes?select=id,created_at")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/enviar-correo")
def enviar_correo_clientes(datos: dict, _staff=Depends(require_staff)):
    """Envía un correo (plantilla de la tienda) a varios clientes elegidos en el panel.
    datos: {"ids": [...], "asunto": "...", "mensaje": "... {nombre} ..."}.
    Se omiten los correos inválidos y los compartidos por varios clientes (no identifican a nadie). Máximo 80 por envío (el
    plan gratis de Resend permite 100 al día). El envío corre en segundo plano y queda en el historial de Correo corporativo."""
    import re as _re, threading, time
    ids = [str(i) for i in (datos.get("ids") or []) if _re.fullmatch(r"[0-9a-fA-F-]{36}", str(i))]
    asunto = str(datos.get("asunto") or "").strip()[:150]
    mensaje = str(datos.get("mensaje") or "").strip()[:3000]
    ids_prod = [str(i) for i in (datos.get("productos") or []) if _re.fullmatch(r"[0-9a-fA-F-]{36}", str(i))][:6]
    productos = []
    if ids_prod:
        productos = supabase_get(f"productos?id=in.({','.join(ids_prod)})&select=id,nombre,slug,sku_interno,imagen_principal,precio_menudeo,es_oferta") or []
    if not ids:
        return JSONResponse(status_code=400, content={"ok": False, "error": "No hay clientes seleccionados"})
    if not asunto or not mensaje:
        return JSONResponse(status_code=400, content={"ok": False, "error": "Escribe el asunto y el mensaje"})
    if len(ids) > 80:
        return JSONResponse(status_code=400, content={"ok": False, "error": "Máximo 80 correos por envío (límite diario del plan gratis de Resend: 100)"})
    filas = []
    for i in range(0, len(ids), 40):
        filas += supabase_get(f"clientes?id=in.({','.join(ids[i:i + 40])})&select=id,nombre,email") or []
    por_correo = {}
    for f in filas:
        e = (f.get("email") or "").strip().lower()
        if e:
            por_correo.setdefault(e, []).append(f)
    destinos, omitidos = [], {"sin_correo": 0, "invalido": 0, "compartido": 0}
    for f in filas:
        e = (f.get("email") or "").strip().lower()
        if not e:
            omitidos["sin_correo"] += 1
        elif not _re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", e):
            omitidos["invalido"] += 1
        elif len(por_correo.get(e, [])) > 1 or len(supabase_get("clientes?email=eq." + __import__("urllib.parse").parse.quote(e, safe="") + "&select=id&limit=2") or []) > 1:
            omitidos["compartido"] += 1
        else:
            destinos.append((e, f.get("nombre") or ""))
    if not destinos:
        return JSONResponse(status_code=400, content={"ok": False, "error": "Ninguno de los seleccionados tiene un correo válido y propio", "omitidos": omitidos})

    def _enviar_todos(lista, asunto_, mensaje_, productos_=None):
        from email_utils import enviar_email, email_mensaje_cliente
        for correo, nombre in lista:
            try:
                primer = (nombre.split() or [""])[0].capitalize() or "Cliente"
                html = email_mensaje_cliente(nombre, mensaje_.replace("{nombre}", primer), productos_)
                enviar_email(correo, asunto_.replace("{nombre}", primer), html, tipo="mensaje_cliente", reply_to="contacto@zapatillasmay.mx")
            except Exception as e:
                print(f"[clientes] correo a {correo} falló: {e}")
            time.sleep(0.7)   # Resend permite ~2 envíos por segundo

    threading.Thread(target=_enviar_todos, args=(destinos, asunto, mensaje, productos), daemon=True).start()
    return {"ok": True, "enviando": len(destinos), "omitidos": omitidos}


@router.get("/{id}")
def obtener_cliente(id: str, credentials: HTTPAuthorizationCredentials = Depends(bearer_opcional)):
    if not cliente_autorizado(id, credentials):
        raise HTTPException(status_code=403, detail="No autorizado")
    try:
        return supabase_get(f"clientes?id=eq.{id}")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/")
def crear_cliente(cliente: dict, _staff=Depends(require_staff)):
    try:
        return supabase_post("clientes", cliente)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.patch("/{id}")
def actualizar_cliente(id: str, cliente: dict, credentials: HTTPAuthorizationCredentials = Depends(bearer_opcional)):
    if not cliente_autorizado(id, credentials):
        raise HTTPException(status_code=403, detail="No autorizado")
    try:
        es_staff = bool(credentials) and bool(es_personal(verify_token(credentials.credentials)))
        if not es_staff:
            # El cliente autoeditando su propia cuenta desde el portal solo puede
            # tocar datos de contacto/envío -- nunca crédito, límite, tipo ni activo.
            cliente = limpiar_dict({k: v for k, v in cliente.items() if k in _CAMPOS_CLIENTE_AUTOEDITABLES})
        return supabase_patch(f"clientes?id=eq.{id}", cliente)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.patch("/{id}/desactivar")
def desactivar_cliente(id: str, _staff=Depends(require_staff)):
    try:
        return supabase_patch(f"clientes?id=eq.{id}", {"activo": False})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/{id}/creditos-historial")
def historial_creditos_cliente(id: str, _staff=Depends(require_staff)):
    try:
        return supabase_get_all(f"clientes_creditos_historial?cliente_id=eq.{id}&order=created_at.desc")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/{id}/nota-credito")
def nota_credito_cliente(id: str, datos: dict, _staff=Depends(require_staff)):
    """Registra saldo a favor del cliente (ej. devolvio pares defectuosos por
    correo y en vez de reembolso/reemplazo fisico -- caro en paqueteria en
    ambos sentidos -- se le da credito para su siguiente pedido). Si vienen
    items, entran a inventario igual que una recepcion de mercancia normal.
    El monto SIEMPRE se SUMA al saldo existente (nunca lo reemplaza) y queda
    un renglon de auditoria, a diferencia del ajuste manual viejo de
    Referidos que sobreescribia el numero sin dejar rastro de motivo."""
    try:
        monto = float(datos.get("monto") or 0)
        motivo = (datos.get("motivo") or "").strip()
        sucursal_id = datos.get("sucursal_id")
        items = datos.get("items") or []
        if monto <= 0:
            return JSONResponse(status_code=400, content={"error": "El monto debe ser mayor a 0"})

        clientes_row = supabase_get(f"clientes?id=eq.{id}&select=id,credito_disponible")
        if not clientes_row:
            return JSONResponse(status_code=404, content={"error": "Cliente no encontrado"})
        saldo_actual = float(clientes_row[0].get("credito_disponible") or 0)

        for i in items:
            variante_id = i.get("variante_id")
            cantidad = int(i.get("cantidad") or 0)
            if not variante_id or cantidad <= 0 or not sucursal_id:
                continue
            # entrada ATÓMICA al inventario (crea la fila si no existía)
            _aj = inventario_ajustar(variante_id, sucursal_id, cantidad, crear=True)
            cantidad_anterior = _aj["anterior"] if _aj else 0
            supabase_post("movimientos_inventario", {
                "tipo": "entrada",
                "variante_id": variante_id,
                "sucursal_id": sucursal_id,
                "cantidad": cantidad,
                "cantidad_anterior": cantidad_anterior,
                "motivo": f"Devolucion cliente (nota de credito){' - ' + motivo if motivo else ''}",
            })

        # Suma al saldo con compare-and-swap: dos notas de crédito simultáneas ya no pisan la otra
        # (antes: leer, sumar y escribir sin condición).
        nuevo_saldo = None
        for _ in range(5):
            nuevo_saldo = round(saldo_actual + monto, 2)
            if supabase_patch(f"clientes?id=eq.{id}&credito_disponible=eq.{saldo_actual:.2f}", {"credito_disponible": nuevo_saldo}):
                break
            releido = supabase_get(f"clientes?id=eq.{id}&select=credito_disponible") or [{}]
            saldo_actual = float(releido[0].get("credito_disponible") or 0)
            nuevo_saldo = None
        if nuevo_saldo is None:
            return JSONResponse(status_code=409, content={"error": "El saldo cambió mientras se guardaba; intenta de nuevo"})
        supabase_post("clientes_creditos_historial", {
            "cliente_id": id,
            "monto": monto,
            "tipo": "nota_credito",
            "motivo": motivo or None,
            "saldo_despues": nuevo_saldo,
        })
        return {"ok": True, "credito_disponible": nuevo_saldo}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/{id}/ajustar-credito")
def ajustar_credito_cliente(id: str, datos: dict, _staff=Depends(require_staff)):
    """Fija el saldo a favor del cliente en un monto exacto (corrección manual) y deja renglón de auditoría con
    la diferencia. Antes el panel hacía PATCH credito_disponible=<monto> directo: sobrescribía sin dejar rastro."""
    try:
        try:
            nuevo = round(float(datos.get("nuevo_saldo")), 2)
        except (TypeError, ValueError):
            return JSONResponse(status_code=400, content={"error": "Monto inválido"})
        if nuevo < 0:
            return JSONResponse(status_code=400, content={"error": "El saldo no puede ser negativo"})
        fila = supabase_get(f"clientes?id=eq.{id}&select=credito_disponible")
        if not fila:
            return JSONResponse(status_code=404, content={"error": "Cliente no encontrado"})
        anterior = float(fila[0].get("credito_disponible") or 0)
        supabase_patch(f"clientes?id=eq.{id}", {"credito_disponible": nuevo})
        if round(nuevo - anterior, 2) != 0:
            supabase_post("clientes_creditos_historial", {
                "cliente_id": id, "monto": round(nuevo - anterior, 2), "tipo": "ajuste_manual",
                "motivo": (datos.get("motivo") or "Ajuste manual desde el panel")[:200], "saldo_despues": nuevo,
            })
        return {"ok": True, "credito_disponible": nuevo, "anterior": anterior}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/{id}/dar-acceso")
def dar_acceso_portal(id: str, _staff=Depends(require_staff)):
    """Crea (o resetea) el acceso al portal mayorista de un cliente.
    Genera una contraseña ALEATORIA (antes eran los últimos 4 dígitos del teléfono,
    predecibles: cualquiera con el teléfono público entraba). Se devuelve al admin
    autenticado para que la comparta; el cliente también puede entrar por OTP."""
    import secrets as _secrets
    try:
        clientes = supabase_get(f"clientes?id=eq.{id}")
        if not clientes:
            return JSONResponse(status_code=404, content={"error": "Cliente no encontrado"})
        c = clientes[0]

        if c.get("tipo") not in ("zapateria", "mayoreo"):
            return JSONResponse(status_code=400, content={"error": "Solo clientes de tipo mayoreo/zapatería pueden tener acceso al portal"})

        telefono = "".join(ch for ch in (c.get("telefono") or "") if ch.isdigit())
        if not telefono and not c.get("email"):
            return JSONResponse(status_code=400, content={"error": "El cliente necesita teléfono o email para crear su acceso"})

        # Contraseña aleatoria legible (sin caracteres ambiguos como 0/O, 1/l/I).
        _alfabeto = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"
        password = "".join(_secrets.choice(_alfabeto) for _ in range(8))
        password_hash = hash_password(password)

        email_usuario = c.get("email") or f"tel{telefono}@portal.zapatillasmay.com"

        existentes = supabase_get(f"usuarios?cliente_id=eq.{id}")
        if existentes:
            supabase_patch(f"usuarios?id=eq.{existentes[0]['id']}", {
                "password_hash": password_hash,
                "activo": True,
                "email": email_usuario
            })
        else:
            supabase_post("usuarios", {
                "nombre": c.get("nombre"),
                "email": email_usuario,
                "password_hash": password_hash,
                "tipo": c.get("tipo"),
                "cliente_id": id,
                "activo": True
            })

        return {
            "telefono": c.get("telefono"),
            "usuario": telefono if telefono else email_usuario,
            "password": password,
            "nombre": c.get("nombre")
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})