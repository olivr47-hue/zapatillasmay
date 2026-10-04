# -*- coding: utf-8 -*-
"""
email_utils.py
Envío de emails vía ZeptoMail (API HTTP de Zoho para correo transaccional
desde tu propio dominio). Ya NO hay Resend -- se retiró por completo: los
flujos que lo usaban directo (recuperar password, OTP del portal, carrito
abandonado, etc.) no pasaban por aquí y por eso, aunque se configurara Zoho,
esos correos seguían saliendo por Resend sin que se notara.

Tampoco se usa SMTP (Zoho/Gmail): Railway bloquea las conexiones SMTP
salientes por completo (confirmado con un envío real: tanto el puerto 465
como el 587 daban timeout aunque las credenciales fueran correctas) -- por
eso el proyecto usaba Resend desde el inicio, y por eso ahora se usa
ZeptoMail, que es HTTP (no SMTP) y sí atraviesa ese bloqueo.

Variables de entorno:
  ZEPTOMAIL_TOKEN = el "Send Mail Token" del Agent en zeptomail.zoho.com
                     (pestaña API, dentro de SMTP/API del Mail Agent)
  GMAIL_USER / SMTP_USER / ZOHO_USER / ZEPTOMAIL_FROM
                  = correo remitente verificado en ZeptoMail, ej.
                    contacto@zapatillasmay.mx (se reusa el mismo nombre de
                    variable que ya se usaba para Zoho, por si ya está puesta)

Cada intento de envío (exitoso o no) se guarda en la tabla `emails_enviados`
para poder verlos desde el panel — antes no había forma de confirmar qué se
mandó ni por dónde.
"""

import os
import json
import html as _h
import urllib.request
import urllib.error

def _limpiar_token_zeptomail(valor: str) -> str:
    """El dashboard de ZeptoMail muestra/copia el valor completo del header
    ("Zoho-enczapikey <token>"), no solo el token -- si se pega tal cual en
    Railway, hay que quitarle el prefijo aquí para no duplicarlo al armar el
    header de autorización."""
    valor = (valor or "").strip()
    if valor.lower().startswith("zoho-enczapikey"):
        valor = valor[len("zoho-enczapikey"):].strip()
    return valor


ZEPTOMAIL_TOKEN = _limpiar_token_zeptomail(os.getenv("ZEPTOMAIL_TOKEN", ""))
REMITENTE_EMAIL = (
    os.getenv("GMAIL_USER") or os.getenv("SMTP_USER") or os.getenv("ZOHO_USER")
    or os.getenv("ZEPTOMAIL_FROM") or ""
).strip()
NEGOCIO_EMAIL  = os.getenv("NOTIF_EMAIL", "contacto@zapatillasmay.mx")
FROM_DISPLAY   = "Zapatillas May"

_ZEPTOMAIL_URL = "https://api.zeptomail.com/v1.1/email"
RESEND_API_KEY = (os.getenv("RESEND_API_KEY") or "").strip()
RESEND_FROM = (os.getenv("RESEND_FROM") or "").strip()   # opcional; por defecto el remitente de siempre (el dominio debe estar verificado en Resend)


def _guardar_log(destinatario: str, asunto: str, html: str, exito: bool, error: str, bcc: str, tipo: str, proveedor: str = "zeptomail"):
    try:
        from database import supabase_post
        supabase_post("emails_enviados", {
            "destinatario": destinatario,
            "asunto":       asunto,
            # El HTML solo se guarda si el correo salió: los fallos repetidos (misma dirección cada 15 min) llenaron la base
            "html":         html if exito else None,
            "exito":        exito,
            "error":        (error or None) and str(error)[:400],
            "proveedor":    proveedor,
            "tipo":         tipo or None,
            "bcc":          bcc,
        })
    except Exception as e:
        print(f"[email] No se pudo guardar el log del correo (no crítico): {e}")


def diagnostico_smtp() -> dict:
    """Estado de la config de ZeptoMail, sin exponer el token."""
    resend_ok = bool(RESEND_API_KEY and (RESEND_FROM or REMITENTE_EMAIL))
    zepto_ok = bool(ZEPTOMAIL_TOKEN and REMITENTE_EMAIL)
    return {
        "configurado": resend_ok or zepto_ok,
        "usuario": (RESEND_FROM or REMITENTE_EMAIL) or None,
        "proveedor": "resend" if resend_ok else "zeptomail",
        "resend_configurado": resend_ok,
        "zeptomail_configurado": zepto_ok,
    }


def enviar_email(to: str, subject: str, html: str, bcc: str = None, tipo: str = "", reply_to: str = None) -> bool:
    """
    Envía un email HTML vía ZeptoMail. Retorna True si tuvo éxito.
    Registra el intento en `emails_enviados` sin importar el resultado.
    `tipo` es una etiqueta libre (ej. "recuperar_password", "carrito_abandonado")
    para poder filtrar el historial en el panel.
    `reply_to` opcional: si se pasa, contestar el correo va a esa direccion
    en vez de a REMITENTE_EMAIL (util para notificaciones "de parte de" alguien).
    """
    errores = []
    # 1) Resend (plan gratis: 3,000 correos/mes y 100/día) si está configurado
    if RESEND_API_KEY and (RESEND_FROM or REMITENTE_EMAIL):
        try:
            _enviar_resend(to, subject, html, bcc, reply_to)
            _guardar_log(to, subject, html, True, None, bcc, tipo, "resend")
            return True
        except Exception as e:
            print(f"[email] Resend falló: {e}")
            errores.append(str(e))
    # 2) ZeptoMail (respaldo, o único proveedor si no hay Resend)
    if ZEPTOMAIL_TOKEN and REMITENTE_EMAIL:
        try:
            _enviar_zeptomail(to, subject, html, bcc, reply_to)
            _guardar_log(to, subject, html, True, None, bcc, tipo, "zeptomail")
            return True
        except Exception as e:
            print(f"[email] ZeptoMail falló: {e}")
            errores.append(str(e))
    if not errores:
        print(f"[email] Ningún proveedor configurado — no se envió a {to}")
        errores.append("Sin proveedor de correo configurado (falta RESEND_API_KEY o ZEPTOMAIL_TOKEN en Railway)")
    _guardar_log(to, subject, html, False, " | ".join(errores), bcc, tipo, "resend" if RESEND_API_KEY else "zeptomail")
    return False


def _enviar_resend(to: str, subject: str, html: str, bcc: str = None, reply_to: str = None):
    remitente = RESEND_FROM or REMITENTE_EMAIL
    body = {"from": f"{FROM_DISPLAY} <{remitente}>", "to": [to], "subject": subject, "html": html}
    if bcc:
        body["bcc"] = [bcc]
    if reply_to:
        body["reply_to"] = reply_to
    req = urllib.request.Request(
        "https://api.resend.com/emails",
        data=json.dumps(body).encode("utf-8"),
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {RESEND_API_KEY}",
            # Resend está detrás de Cloudflare: sin User-Agent propio rechaza el cliente por defecto de Python (403)
            "User-Agent": "zapatillasmay-erp/1.0",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            r.read()
        print(f"[email] Resend → {to} ✓")
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", errors="replace")
        raise Exception(f"Resend HTTP {e.code}: {raw[:300]}")


def _enviar_zeptomail(to: str, subject: str, html: str, bcc: str = None, reply_to: str = None):
    body = {
        "from": {"address": REMITENTE_EMAIL, "name": FROM_DISPLAY},
        "to": [{"email_address": {"address": to}}],
        "subject": subject,
        "htmlbody": html,
    }
    if bcc:
        body["bcc"] = [{"email_address": {"address": bcc}}]
    if reply_to:
        body["reply_to"] = [{"address": reply_to}]

    req = urllib.request.Request(
        _ZEPTOMAIL_URL,
        data=json.dumps(body).encode("utf-8"),
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": f"Zoho-enczapikey {ZEPTOMAIL_TOKEN}",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            r.read()
        print(f"[email] ZeptoMail → {to} ✓")
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", errors="replace")
        raise Exception(f"ZeptoMail HTTP {e.code}: {raw[:400]}")


# ── Plantillas ────────────────────────────────────────────────────

def _base_html(contenido: str, preheader: str = "") -> str:
    """Marco común de todos los correos. Hecho con tablas (no flex/grid) para que se vea igual en Gmail, Outlook y Apple Mail,
    con texto de vista previa (preheader), botones que no se rompen y pie con contacto."""
    pre = (
        f'<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;font-size:1px;line-height:1px">'
        f'{_h.escape(preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>'
    ) if preheader else ""
    return f"""<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><title>Zapatillas May</title></head>
<body style="margin:0;padding:0;background:#f4eeea">
{pre}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4eeea"><tr><td align="center" style="padding:24px 12px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;font-family:Arial,Helvetica,sans-serif">
    <tr><td align="center" bgcolor="#ffffff" style="background:#ffffff;padding:26px 24px 16px;border-bottom:4px solid #b5687a">
      <a href="https://zapatillasmay.mx" style="text-decoration:none;color:#2A1A0E">
        <img src="https://zapatillasmay.mx/images/logosolo.png" width="230" alt="Zapatillas May"
             style="display:block;margin:0 auto;width:230px;max-width:70%;height:auto;border:0;font-family:Georgia,serif;font-size:26px;color:#2A1A0E"></a>
      <span style="display:block;margin-top:6px;font-size:12px;color:#a67c6a;letter-spacing:.8px">Calzado para dama · León, Guanajuato</span>
    </td></tr>
    <tr><td style="padding:32px 28px 8px 28px">{contenido}</td></tr>
    <tr><td style="padding:8px 28px 28px 28px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="background:#faf5f1;border-radius:12px;padding:16px">
        <span style="font-size:13px;color:#7a6a60;line-height:1.6">¿Tienes alguna duda? Respondemos rápido por WhatsApp</span><br>
        <a href="https://wa.me/5214792244560" style="display:inline-block;margin-top:10px;background:#25D366;color:#ffffff;text-decoration:none;font-weight:700;font-size:13px;padding:10px 22px;border-radius:50px">💬 Escribir por WhatsApp</a>
      </td></tr></table>
    </td></tr>
    <tr><td align="center" style="background:#2A1A0E;padding:18px 24px">
      <span style="font-size:12px;color:#d9c9bd;line-height:1.7">Envíos a todo México · Pago seguro<br>
      <a href="https://zapatillasmay.mx" style="color:#e8b4a0;text-decoration:none">zapatillasmay.mx</a>
      &nbsp;·&nbsp; <a href="mailto:contacto@zapatillasmay.mx" style="color:#e8b4a0;text-decoration:none">contacto@zapatillasmay.mx</a></span>
    </td></tr>
  </table>
</td></tr></table>
</body></html>"""


def _boton(texto: str, url: str, color: str = "#b5687a") -> str:
    """Botón que se ve bien en todos los clientes de correo (tabla con fondo sólido)."""
    return (
        f'<table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:6px auto"><tr>'
        f'<td align="center" bgcolor="{color}" style="background:{color};border-radius:50px">'
        f'<a href="{_h.escape(url, quote=True)}" style="display:inline-block;padding:14px 34px;color:#ffffff;text-decoration:none;'
        f'font-weight:700;font-size:15px;font-family:Arial,Helvetica,sans-serif">{texto}</a></td></tr></table>'
    )


def _imagenes_de_items(items: list) -> dict:
    """variante_id -> URL de la foto (la del color; si no hay, la del producto). Para las miniaturas del correo."""
    ids = [str(i.get("variante_id")) for i in items if i.get("variante_id")]
    if not ids:
        return {}
    try:
        from database import supabase_get
        filas = supabase_get(f"variantes?id=in.({','.join(ids)})&select=id,foto_url,productos(imagen_principal)") or []
        return {f["id"]: (f.get("foto_url") or (f.get("productos") or {}).get("imagen_principal") or "") for f in filas}
    except Exception:
        return {}


def _miniatura(url: str) -> str:
    url = str(url or "")
    if url.startswith("https://") or url.startswith("http://"):
        return (f'<img src="{_h.escape(url, quote=True)}" width="72" height="72" alt="" '
                f'style="display:block;width:72px;height:72px;border-radius:10px;object-fit:cover;background:#f5f0eb">')
    return '<div style="width:72px;height:72px;border-radius:10px;background:#f5f0eb;text-align:center;line-height:72px;font-size:28px">👠</div>'


def _seguimiento_pasos(paso_actual: int) -> str:
    """Barra de 4 pasos: Confirmado · Preparando · Enviado · Entregado (paso_actual de 1 a 4)."""
    etiquetas = ["Pedido confirmado", "Preparando", "Enviado", "Entregado"]
    celdas = ""
    for i, et in enumerate(etiquetas, start=1):
        hecho = i <= paso_actual
        bola_bg = "#b5687a" if hecho else "#e9dfd8"
        bola_tx = "#ffffff" if hecho else "#a89a90"
        celdas += (
            f'<td align="center" width="25%" style="padding:0 2px;vertical-align:top">'
            f'<div style="width:30px;height:30px;line-height:30px;border-radius:50%;background:{bola_bg};color:{bola_tx};'
            f'font-size:14px;font-weight:700;margin:0 auto">{"✓" if hecho else i}</div>'
            f'<div style="font-size:11px;color:{"#2A1A0E" if hecho else "#a89a90"};margin-top:6px;line-height:1.3;'
            f'font-weight:{"700" if hecho else "400"}">{et}</div></td>'
        )
    return f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0 22px"><tr>{celdas}</tr></table>'


def email_pedido_confirmado(pedido: dict):
    """Retorna (subject, html) para email de pago confirmado al cliente."""
    nombre   = _h.escape((pedido.get("nombre_cliente") or "Clienta").split()[0].capitalize())
    total    = float(pedido.get("total") or 0)
    pedido_id = str(pedido.get("id") or "")[:8].upper()
    direccion = _h.escape(pedido.get("direccion_envio") or "—")
    items    = pedido.get("pedido_items") or []
    fotos    = _imagenes_de_items(items)

    filas = ""
    subtotal = 0.0
    envio = float(pedido.get("costo_envio") or 0)
    pares = 0
    for it in items:
        cant = int(it.get("cantidad") or 1)
        precio = float(it.get("precio_unitario") or 0)
        if str(it.get("nombre") or "").strip().lower() == "envío" or str(it.get("nombre") or "").strip().lower() == "envio":
            envio = envio or precio * cant     # el envío viaja como renglón del pedido
            continue
        nom  = _h.escape(str(it.get("nombre") or "Producto"))
        col  = _h.escape(str(it.get("color") or ""))
        tal  = _h.escape(str(it.get("talla") or ""))
        meta = " · ".join([x for x in [col, f"Talla {tal}" if tal else ""] if x])
        subtotal += precio * cant
        pares += cant
        filas += f"""
        <tr>
          <td width="86" style="padding:12px 0;border-bottom:1px solid #f3e9e2;vertical-align:top">{_miniatura(fotos.get(str(it.get('variante_id')), ''))}</td>
          <td style="padding:12px 0;border-bottom:1px solid #f3e9e2;vertical-align:top;font-size:14px;color:#2A1A0E;line-height:1.45">
            <strong>{nom}</strong><br>
            <span style="color:#8a7b71;font-size:12px">{meta}</span><br>
            <span style="color:#8a7b71;font-size:12px">{cant} {("par" if cant == 1 else "pares")} × ${precio:,.0f}</span>
          </td>
          <td align="right" style="padding:12px 0;border-bottom:1px solid #f3e9e2;vertical-align:top;font-size:14px;color:#b5687a;font-weight:700;white-space:nowrap">${precio * cant:,.0f}</td>
        </tr>"""

    envio_fila = (f'<tr><td style="padding:4px 0;font-size:13px;color:#7a6a60">Envío</td>'
                  f'<td align="right" style="padding:4px 0;font-size:13px;color:#2A1A0E">{"Gratis" if envio <= 0 else f"${envio:,.0f}"}</td></tr>')

    contenido = f"""
      <h1 style="margin:0 0 6px;font-size:24px;line-height:1.25;color:#2A1A0E">¡Gracias por tu compra, {nombre}! 🎉</h1>
      <p style="margin:0 0 20px;font-size:15px;line-height:1.65;color:#5b4d44">
        Recibimos tu pago y ya estamos preparando tu pedido con mucho cariño. Te avisaremos por correo y WhatsApp en cuanto salga, con tu número de rastreo.
      </p>

      {_seguimiento_pasos(1)}

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px"><tr>
        <td style="background:#fdf8f5;border-radius:12px;padding:14px 18px">
          <span style="font-size:11px;color:#a89a90;text-transform:uppercase;letter-spacing:1px">Número de pedido</span><br>
          <span style="font-size:20px;font-weight:700;color:#2A1A0E;font-family:'Courier New',monospace">#{pedido_id}</span>
          <span style="font-size:12px;color:#8a7b71">&nbsp;·&nbsp;{pares} {("par" if pares == 1 else "pares")}</span>
        </td></tr></table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">{filas}</table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:14px 0 22px">
        <tr><td style="padding:4px 0;font-size:13px;color:#7a6a60">Productos</td><td align="right" style="padding:4px 0;font-size:13px;color:#2A1A0E">${subtotal:,.0f}</td></tr>
        {envio_fila}
        <tr><td style="padding:10px 0 0;border-top:2px solid #efe1d8;font-size:16px;font-weight:700;color:#2A1A0E">Total pagado</td>
            <td align="right" style="padding:10px 0 0;border-top:2px solid #efe1d8;font-size:20px;font-weight:700;color:#b5687a">${total:,.0f} MXN</td></tr>
      </table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px"><tr>
        <td style="background:#f7f1ec;border-radius:12px;padding:14px 18px">
          <span style="font-size:11px;color:#a89a90;text-transform:uppercase;letter-spacing:1px">📦 Se enviará a</span><br>
          <span style="font-size:14px;color:#2A1A0E;line-height:1.55">{direccion}</span>
        </td></tr></table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px"><tr>
        <td style="border-left:3px solid #c8967a;padding:4px 0 4px 14px;font-size:13px;color:#5b4d44;line-height:1.65">
          <strong>¿Qué sigue?</strong><br>
          1) Preparamos y revisamos tus zapatillas.<br>
          2) Las enviamos con paquetería (normalmente en 1 a 3 días hábiles).<br>
          3) Te mandamos la guía para que sigas tu paquete.
        </td></tr></table>

      {_boton("Seguir comprando →", "https://zapatillasmay.mx")}
      <p style="margin:18px 0 0;font-size:12px;color:#a89a90;text-align:center">Guarda este correo: tu número de pedido es <strong>#{pedido_id}</strong>.</p>"""

    subject = f"✅ Pedido #{pedido_id} confirmado — gracias por tu compra, {nombre}"
    return subject, _base_html(contenido, f"Recibimos tu pago de ${total:,.0f} MXN. Estamos preparando tu pedido #{pedido_id}.")


def email_resumen_carrito(pedido: dict, items: list, anticipo: float = 0.0, modo: str = "resumen", mensaje: str = ""):
    """Correo para la clienta con el resumen de su carrito / apartado (lo envía el personal desde la sección Carritos).
    modo: "resumen" (cotización o apartado) | "vencimiento" (recordatorio de que su apartado vence o ya venció)."""
    import datetime as _dt
    cliente = pedido.get("clientes") or {}
    nombre = _h.escape(((cliente.get("nombre") or pedido.get("nombre_cliente") or "Clienta").split() or ["Clienta"])[0].capitalize())
    es_apartado = pedido.get("status") == "apartado"
    pedido_id = str(pedido.get("id") or "")[:8].upper()
    fotos = _imagenes_de_items(items)

    filas = ""
    subtotal = 0.0
    pares = 0
    for it in items:
        cant = int(it.get("cantidad") or 1)
        precio = float(it.get("precio_unitario") or 0)
        v = it.get("variantes") or {}
        pr = v.get("productos") or {}
        nom = _h.escape(str(pr.get("nombre") or it.get("nombre") or "Producto"))
        col = _h.escape(str(v.get("color") or it.get("color") or ""))
        tal = _h.escape(str(v.get("talla") or it.get("talla") or ""))
        meta = " · ".join([x for x in [col, f"Talla {tal}" if tal else ""] if x])
        if cant < 0:
            continue
        subtotal += precio * cant
        pares += cant
        apartado_tag = ' <span style="background:#fff3cd;color:#856404;border-radius:10px;padding:1px 7px;font-size:10px;font-weight:700">🔒 apartado</span>' if it.get("reservado") else ""
        foto = fotos.get(str(it.get("variante_id")), "") or v.get("foto_url") or pr.get("imagen_principal") or ""
        filas += f"""
        <tr>
          <td width="86" style="padding:12px 0;border-bottom:1px solid #f3e9e2;vertical-align:top">{_miniatura(foto)}</td>
          <td style="padding:12px 0;border-bottom:1px solid #f3e9e2;vertical-align:top;font-size:14px;color:#2A1A0E;line-height:1.45">
            <strong>{nom}</strong>{apartado_tag}<br>
            <span style="color:#8a7b71;font-size:12px">{meta}</span><br>
            <span style="color:#8a7b71;font-size:12px">{cant} {("par" if cant == 1 else "pares")} × ${precio:,.0f}</span>
          </td>
          <td align="right" style="padding:12px 0;border-bottom:1px solid #f3e9e2;vertical-align:top;font-size:14px;color:#b5687a;font-weight:700;white-space:nowrap">${precio * cant:,.0f}</td>
        </tr>"""

    envio = float(pedido.get("costo_envio") or 0)
    total = float(pedido.get("total") or (subtotal + envio))
    saldo = max(0.0, total - float(anticipo or 0))

    vence_txt = ""
    vencido = False
    if pedido.get("apartado_hasta"):
        try:
            hasta = _dt.datetime.fromisoformat(str(pedido["apartado_hasta"]).replace("Z", "+00:00"))
            dias = (hasta - _dt.datetime.now(_dt.timezone.utc)).days
            fecha = hasta.astimezone(_dt.timezone(_dt.timedelta(hours=-6))).strftime("%d/%m/%Y")
            vencido = dias < 0
            vence_txt = f"venció el {fecha}" if vencido else f"vence el {fecha}" + (" (hoy)" if dias == 0 else f" (en {dias} día{'s' if dias != 1 else ''})")
        except Exception:
            pass

    if modo == "vencimiento":
        titulo = f"{nombre}, tu apartado {'ya venció' if vencido else 'está por vencer'} ⏰"
        intro = ("Tus pares siguen guardados a tu nombre, pero el plazo de tu apartado "
                 + (vence_txt or "está por terminar") + ". Si aún los quieres, escríbenos para completar tu compra y no perderlos.")
        asunto = f"⏰ Tu apartado {'venció' if vencido else 'está por vencer'} — Zapatillas May"
        pre = "Escríbenos para completar tu compra y conservar tus pares."
    elif es_apartado:
        titulo = f"{nombre}, tus pares están apartados 🔒"
        intro = ("Guardamos estos modelos a tu nombre" + (f"; tu apartado {vence_txt}" if vence_txt else "") +
                 ". Cuando quieras completar tu compra, escríbenos y te decimos cómo pagar el saldo.")
        asunto = f"🔒 Tus pares están apartados — Zapatillas May"
        pre = f"Resumen de tu apartado: {pares} par(es), saldo ${saldo:,.0f} MXN."
    else:
        titulo = f"{nombre}, aquí está el resumen de tu pedido 👠"
        intro = "Este es el resumen de los modelos que revisamos juntas. Aún no están apartados: si quieres reservarlos, avísanos."
        asunto = "👠 Resumen de tu pedido — Zapatillas May"
        pre = f"{pares} par(es) por ${total:,.0f} MXN. Respóndenos por WhatsApp para apartarlos."

    nota = (f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px"><tr>'
            f'<td style="background:#fdf8f5;border-left:3px solid #c8967a;border-radius:6px;padding:12px 16px;font-size:14px;color:#5b4d44;line-height:1.6">{_h.escape(mensaje)}</td></tr></table>') if mensaje.strip() else ""
    envio_fila = (f'<tr><td style="padding:4px 0;font-size:13px;color:#7a6a60">Envío</td>'
                  f'<td align="right" style="padding:4px 0;font-size:13px;color:#2A1A0E">${envio:,.0f}</td></tr>') if envio > 0 else ""
    anticipo_fila = (f'<tr><td style="padding:4px 0;font-size:13px;color:#2e7d32">Anticipo recibido</td>'
                     f'<td align="right" style="padding:4px 0;font-size:13px;color:#2e7d32">− ${float(anticipo):,.0f}</td></tr>') if anticipo and float(anticipo) > 0 else ""
    caja_vence = (f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px"><tr>'
                  f'<td style="background:{"#fdecea" if vencido else "#fff8e1"};border-radius:12px;padding:12px 16px;font-size:13px;color:{"#9a2b21" if vencido else "#6d4c00"}">'
                  f'⏱️ Tu apartado {vence_txt}</td></tr></table>') if vence_txt and es_apartado else ""

    contenido = f"""
      <h1 style="margin:0 0 8px;font-size:23px;line-height:1.3;color:#2A1A0E">{titulo}</h1>
      <p style="margin:0 0 18px;font-size:15px;line-height:1.65;color:#5b4d44">{intro}</p>
      {nota}{caja_vence}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">{filas}</table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:14px 0 22px">
        <tr><td style="padding:4px 0;font-size:13px;color:#7a6a60">Productos ({pares} {("par" if pares == 1 else "pares")})</td><td align="right" style="padding:4px 0;font-size:13px;color:#2A1A0E">${subtotal:,.0f}</td></tr>
        {envio_fila}
        <tr><td style="padding:8px 0 0;border-top:1px solid #efe1d8;font-size:14px;font-weight:700;color:#2A1A0E">Total</td>
            <td align="right" style="padding:8px 0 0;border-top:1px solid #efe1d8;font-size:15px;font-weight:700;color:#2A1A0E">${total:,.0f} MXN</td></tr>
        {anticipo_fila}
        <tr><td style="padding:8px 0 0;font-size:16px;font-weight:700;color:#2A1A0E">{"Saldo por pagar" if anticipo and float(anticipo) > 0 else "Total a pagar"}</td>
            <td align="right" style="padding:8px 0 0;font-size:21px;font-weight:700;color:#b5687a">${saldo:,.0f} MXN</td></tr>
      </table>
      {_boton("Escribirnos por WhatsApp →", "https://wa.me/5214792244560?text=" + __import__("urllib.parse").parse.quote(f"Hola, quiero continuar con mi pedido #{pedido_id}"), "#25D366")}
      <p style="margin:16px 0 0;font-size:12px;color:#a89a90;text-align:center">Referencia de tu pedido: <strong>#{pedido_id}</strong></p>"""
    return asunto, _base_html(contenido, pre)


def email_mensaje_cliente(nombre: str, mensaje: str):
    """Correo de personal a una clienta (promociones, avisos, seguimiento). `mensaje` ya trae el {nombre} resuelto;
    se escapa, se respetan los saltos de línea y los links se vuelven tocables."""
    import re as _re
    primer = _h.escape((nombre or "").split()[0].capitalize()) if (nombre or "").strip() else ""
    cuerpo = _h.escape(mensaje or "")
    cuerpo = _re.sub(r'((?:https?://|www\.)[^\s<]+)', lambda m: (
        f'<a href="{m.group(1) if m.group(1).lower().startswith("http") else "https://" + m.group(1)}" '
        f'style="color:#b5687a;font-weight:700;word-break:break-all">{m.group(1)}</a>'), cuerpo)
    cuerpo = cuerpo.replace("\n", "<br>")
    contenido = f"""
      <h1 style="margin:0 0 14px;font-size:22px;line-height:1.3;color:#2A1A0E">{("Hola " + primer + " 👋") if primer else "Hola 👋"}</h1>
      <p style="margin:0 0 22px;font-size:15px;line-height:1.75;color:#5b4d44">{cuerpo}</p>
      {_boton("Ver los modelos →", "https://zapatillasmay.mx")}
      <p style="margin:22px 0 0;font-size:11px;color:#a89a90;text-align:center;line-height:1.6">
        Recibes este correo porque eres clienta de Zapatillas May. Si ya no quieres recibir mensajes, responde con la palabra BAJA.</p>"""
    return _base_html(contenido, (mensaje or "")[:110])


def email_pedido_pendiente_spei(pedido: dict):
    """Retorna (subject, html) para email de SPEI pendiente al cliente."""
    nombre    = _h.escape((pedido.get("nombre_cliente") or "Clienta").split()[0].capitalize())
    total     = float(pedido.get("total") or 0)
    pedido_id = str(pedido.get("id") or "")[:8].upper()

    contenido = f"""
      <h2 style="color:#2A1A0E;font-size:1.3rem;margin-bottom:4px">¡Ya casi, {nombre}! ⏳</h2>
      <p style="color:#555;font-size:0.92rem;line-height:1.6;margin-bottom:24px">
        Recibimos tu intención de pago por SPEI. En cuanto tu banco
        confirme la transferencia, procesamos tu pedido de inmediato.
      </p>

      <div style="background:#fff8e1;border:1px solid #ffe082;border-radius:10px;
                  padding:18px 20px;margin-bottom:20px">
        <p style="font-size:0.85rem;color:#6d4c00;margin:0;line-height:1.6">
          ⏱️ <strong>Tiempo de acreditación:</strong> normalmente entre 15 minutos y 2 horas
          dependiendo de tu banco.<br><br>
          📩 Cuando se confirme recibirás otro correo con los detalles de tu pedido.
        </p>
      </div>

      <div style="background:#fdf8f5;border-radius:10px;padding:16px 20px;margin-bottom:20px">
        <p style="font-size:0.7rem;color:#aaa;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px">
          Número de pedido
        </p>
        <p style="font-size:1.1rem;font-weight:700;color:#2A1A0E;font-family:monospace;margin:0 0 8px">
          #{pedido_id}
        </p>
        <p style="font-size:0.7rem;color:#aaa;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px">
          Total a transferir
        </p>
        <p style="font-size:1.2rem;font-weight:700;color:#b5687a;margin:0">${total:,.0f} MXN</p>
      </div>

      <p style="color:#888;font-size:0.85rem;text-align:center;line-height:1.6">
        ¿Ya realizaste el pago y tienes dudas?<br>
        <a href="https://wa.me/5214792244560?text=Hola%2C+hice+un+pago+SPEI+para+el+pedido+%23{pedido_id}"
           style="color:#c8967a;font-weight:700">Escríbenos por WhatsApp →</a>
      </p>"""

    subject = f"⏳ Pago SPEI pendiente — Pedido #{pedido_id} · Zapatillas May"
    return subject, _base_html(contenido, f"Falta confirmar tu transferencia de ${total:,.0f} MXN para el pedido #{pedido_id}.")


def email_envio_realizado(pedido: dict, paqueteria: str, numero_guia: str, tracking_url: str):
    """Retorna (subject, html) para notificar al cliente que su pedido fue enviado."""
    nombre    = _h.escape((pedido.get("nombre_cliente") or "Clienta").split()[0].capitalize())
    pedido_id = str(pedido.get("id") or "")[:8].upper()
    total     = float(pedido.get("total") or 0)
    direccion = _h.escape(pedido.get("direccion_envio") or "—")

    logo_paqueteria = {"fedex": "📦 FedEx", "estafeta": "📦 Estafeta", "dhl": "📦 DHL"}.get(
        paqueteria.lower(), f"📦 {_h.escape(paqueteria)}"
    )
    numero_guia = _h.escape(str(numero_guia))
    tracking_url = tracking_url if str(tracking_url).startswith(("https://", "http://")) else "https://zapatillasmay.mx"

    contenido = f"""
      <h2 style="color:#2A1A0E;font-size:1.3rem;margin-bottom:4px">¡Tu pedido va en camino, {nombre}! 🚚</h2>
      <p style="color:#555;font-size:0.92rem;line-height:1.6;margin-bottom:18px">
        Ya enviamos tu paquete. Puedes rastrear tu envío en cualquier momento con el botón de abajo.
        La entrega suele tardar de 2 a 5 días hábiles según tu ciudad.
      </p>
      {_seguimiento_pasos(3)}

      <div style="background:#e8f5e9;border:1px solid #a5d6a7;border-radius:10px;padding:18px 20px;margin-bottom:20px">
        <p style="font-size:0.7rem;color:#2e7d32;text-transform:uppercase;letter-spacing:1px;font-weight:700;margin:0 0 8px">
          {logo_paqueteria}
        </p>
        <p style="font-size:0.75rem;color:#555;margin:0 0 4px">Número de guía</p>
        <p style="font-size:1.2rem;font-weight:700;color:#2A1A0E;font-family:monospace;margin:0 0 14px;letter-spacing:2px">
          {numero_guia}
        </p>
        <a href="{tracking_url}"
           style="display:inline-block;background:#2e7d32;color:#fff;padding:11px 24px;
                  border-radius:50px;text-decoration:none;font-weight:700;font-size:0.88rem">
          Rastrear mi paquete →
        </a>
      </div>

      <div style="background:#fdf8f5;border-radius:10px;padding:14px 20px;margin-bottom:20px">
        <table style="width:100%;font-size:0.85rem">
          <tr>
            <td style="color:#aaa;padding:3px 0;width:120px">Pedido</td>
            <td style="font-family:monospace;font-weight:700">#{pedido_id}</td>
          </tr>
          <tr>
            <td style="color:#aaa;padding:3px 0">Total pagado</td>
            <td style="font-weight:700;color:#b5687a">${total:,.0f} MXN</td>
          </tr>
          <tr>
            <td style="color:#aaa;padding:3px 0;vertical-align:top">Dirección</td>
            <td style="line-height:1.5">{direccion}</td>
          </tr>
        </table>
      </div>

      <p style="color:#888;font-size:0.83rem;text-align:center;line-height:1.6">
        ¿Algo no está bien con tu pedido?<br>
        <a href="https://wa.me/5214792244560?text=Hola%2C+tengo+una+pregunta+sobre+mi+pedido+%23{pedido_id}"
           style="color:#c8967a;font-weight:700">Escríbenos por WhatsApp →</a>
      </p>"""

    subject = f"🚚 Tu pedido #{pedido_id} ya fue enviado — Zapatillas May"
    return subject, _base_html(contenido, f"{paqueteria} · guía {numero_guia}. Rastrea tu paquete cuando quieras.")


def email_nuevo_pedido_negocio(pedido: dict):
    """Retorna (subject, html) para notificar al negocio de un pedido pagado."""
    pedido_id = str(pedido.get("id") or "")[:8].upper()
    nombre    = _h.escape(pedido.get("nombre_cliente") or "—")
    email     = pedido.get("email_cliente") or "—"
    telefono  = pedido.get("telefono_cliente") or "—"
    total     = float(pedido.get("total") or 0)
    direccion = _h.escape(pedido.get("direccion_envio") or "—")
    notas     = _h.escape(pedido.get("notas") or "")
    items     = pedido.get("pedido_items") or []

    filas = ""
    for it in items:
        nom  = _h.escape(str(it.get("nombre") or "?"))
        col  = it.get("color") or ""
        tal  = it.get("talla") or ""
        cant = it.get("cantidad") or 1
        precio = float(it.get("precio_unitario") or 0)
        filas += f"""
        <tr>
          <td style="padding:8px 6px;border-bottom:1px solid #f0e8e0;font-size:13px">{nom}</td>
          <td style="padding:8px 6px;border-bottom:1px solid #f0e8e0;font-size:13px;color:#888">{col}</td>
          <td style="padding:8px 6px;border-bottom:1px solid #f0e8e0;font-size:13px;text-align:center">{tal}</td>
          <td style="padding:8px 6px;border-bottom:1px solid #f0e8e0;font-size:13px;text-align:center">{cant}</td>
          <td style="padding:8px 6px;border-bottom:1px solid #f0e8e0;font-size:13px;
                     text-align:right;color:#b5687a;font-weight:700">${precio * cant:,.0f}</td>
        </tr>"""

    notas_html = f'<p style="background:#fff8e1;border-radius:8px;padding:12px;font-size:0.85rem;color:#6d4c00"><strong>Notas:</strong> {notas}</p>' if notas else ""

    contenido = f"""
      <h2 style="color:#2A1A0E;font-size:1.2rem;margin-bottom:4px">🛍️ Nuevo pedido pagado #{pedido_id}</h2>
      <p style="color:#888;font-size:0.85rem;margin-bottom:24px">Ya puedes prepararlo para envío.</p>

      <div style="background:#f5f0eb;border-radius:10px;padding:16px 20px;margin-bottom:20px">
        <table style="width:100%;font-size:0.88rem">
          <tr><td style="color:#aaa;padding:4px 0;width:120px">Cliente</td><td><strong>{nombre}</strong></td></tr>
          <tr><td style="color:#aaa;padding:4px 0">Email</td><td><a href="mailto:{email}" style="color:#b5687a">{email}</a></td></tr>
          <tr><td style="color:#aaa;padding:4px 0">Teléfono</td>
              <td><a href="https://wa.me/52{telefono.replace('+','').replace(' ','')}" style="color:#25D366">{telefono}</a></td></tr>
          <tr><td style="color:#aaa;padding:4px 0">Dirección</td><td>{direccion}</td></tr>
          <tr><td style="color:#aaa;padding:4px 0">Total</td>
              <td><strong style="color:#b5687a;font-size:1rem">${total:,.0f} MXN</strong></td></tr>
        </table>
      </div>

      {notas_html}

      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
        <thead>
          <tr style="background:#fdf8f5">
            <th style="padding:8px 6px;text-align:left;font-size:11px;color:#aaa;text-transform:uppercase">Producto</th>
            <th style="padding:8px 6px;text-align:left;font-size:11px;color:#aaa;text-transform:uppercase">Color</th>
            <th style="padding:8px 6px;text-align:center;font-size:11px;color:#aaa;text-transform:uppercase">Talla</th>
            <th style="padding:8px 6px;text-align:center;font-size:11px;color:#aaa;text-transform:uppercase">Pares</th>
            <th style="padding:8px 6px;text-align:right;font-size:11px;color:#aaa;text-transform:uppercase">Subtotal</th>
          </tr>
        </thead>
        <tbody>{filas}</tbody>
      </table>"""

    subject = f"🛍️ Pedido #{pedido_id} pagado — {nombre} · ${total:,.0f} MXN"
    return subject, _base_html(contenido)


def email_contacto_web(nombre: str, correo: str, mensaje: str):
    """Retorna (subject, html) para notificar al negocio de un mensaje del
    formulario de contacto del sitio (reply-to = correo de quien escribió)."""
    nombre, correo, mensaje = _h.escape(nombre), _h.escape(correo), _h.escape(mensaje)
    contenido = f"""
      <h2 style="color:#2A1A0E;font-size:1.2rem;margin-bottom:4px">✉️ Nuevo mensaje de contacto</h2>
      <p style="color:#888;font-size:0.85rem;margin-bottom:24px">Enviado desde el formulario de zapatillasmay.mx/contacto</p>

      <div style="background:#f5f0eb;border-radius:10px;padding:16px 20px;margin-bottom:20px">
        <table style="width:100%;font-size:0.88rem">
          <tr><td style="color:#aaa;padding:4px 0;width:100px">Nombre</td><td><strong>{nombre}</strong></td></tr>
          <tr><td style="color:#aaa;padding:4px 0">Correo</td><td><a href="mailto:{correo}" style="color:#b5687a">{correo}</a></td></tr>
        </table>
      </div>

      <div style="background:#fdf8f5;border-radius:10px;padding:16px 20px;white-space:pre-wrap;font-size:0.9rem;color:#333;line-height:1.6">{mensaje}</div>

      <p style="color:#888;font-size:0.83rem;text-align:center;margin-top:20px">
        Responde directo a este correo para contestarle a {nombre}.
      </p>"""

    subject = f"✉️ Contacto web — {nombre}"
    return subject, _base_html(contenido)
