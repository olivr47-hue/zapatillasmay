# -*- coding: utf-8 -*-
"""
email_utils.py
Envío de emails: intenta Gmail SMTP primero (si está configurado),
hace fallback a Resend si no.

Variables de entorno necesarias para Gmail:
  GMAIL_USER         = zapateriasmay@gmail.com
  GMAIL_APP_PASSWORD = (contraseña de aplicación de 16 chars de Google)

Variables para Resend (ya existente como fallback):
  RESEND_API_KEY
"""

import os
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

GMAIL_USER     = os.getenv("GMAIL_USER", "")
GMAIL_PASSWORD = os.getenv("GMAIL_APP_PASSWORD", "")
NEGOCIO_EMAIL  = os.getenv("NOTIF_EMAIL", "zapateriasmay@gmail.com")
FROM_DISPLAY   = "Zapatillas May"

try:
    import resend
    resend.api_key = os.getenv("RESEND_API_KEY", "")
    _RESEND_OK = bool(resend.api_key)
except ImportError:
    _RESEND_OK = False


def enviar_email(to: str, subject: str, html: str, bcc: str = None) -> bool:
    """
    Envía un email HTML. Retorna True si tuvo éxito.
    Intenta Gmail SMTP primero; si falla usa Resend.
    """
    if GMAIL_USER and GMAIL_PASSWORD:
        try:
            return _enviar_gmail(to, subject, html, bcc)
        except Exception as e:
            print(f"[email] Gmail SMTP falló, intentando Resend: {e}")

    if _RESEND_OK:
        try:
            return _enviar_resend(to, subject, html, bcc)
        except Exception as e:
            print(f"[email] Resend falló: {e}")

    print(f"[email] Sin proveedor configurado — no se envió a {to}")
    return False


def _enviar_gmail(to: str, subject: str, html: str, bcc: str = None) -> bool:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"]    = f"{FROM_DISPLAY} <{GMAIL_USER}>"
    msg["To"]      = to
    if bcc:
        msg["Bcc"] = bcc

    msg.attach(MIMEText(html, "html", "utf-8"))

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(GMAIL_USER, GMAIL_PASSWORD)
        recipients = [to] + ([bcc] if bcc else [])
        server.sendmail(GMAIL_USER, recipients, msg.as_string())

    print(f"[email] Gmail SMTP → {to} ✓")
    return True


def _enviar_resend(to: str, subject: str, html: str, bcc: str = None) -> bool:
    params = {
        "from": f"{FROM_DISPLAY} <noreply@zapatillasmay.mx>",
        "reply_to": NEGOCIO_EMAIL,
        "to": to,
        "subject": subject,
        "html": html,
    }
    if bcc:
        params["bcc"] = bcc
    resend.Emails.send(params)
    print(f"[email] Resend → {to} ✓")
    return True


# ── Plantillas ────────────────────────────────────────────────────

def _base_html(contenido: str) -> str:
    return f"""
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff">
      <div style="background:linear-gradient(135deg,#b5687a,#c8967a);padding:32px;text-align:center">
        <h1 style="color:#fff;font-weight:300;margin:0;font-size:1.5rem;letter-spacing:1px">
          Zapatillas <strong>May</strong>
        </h1>
        <p style="color:rgba(255,255,255,0.85);font-size:0.8rem;margin:6px 0 0">León, Guanajuato · zapatillasmay.mx</p>
      </div>
      <div style="padding:32px">{contenido}</div>
      <div style="background:#faf8f6;padding:20px 32px;text-align:center;border-top:1px solid #f0e8e0">
        <p style="color:#aaa;font-size:0.75rem;margin:0">
          ¿Dudas? Escríbenos por
          <a href="https://wa.me/5214792244560" style="color:#c8967a">WhatsApp</a>
          · Envíos a todo México
        </p>
      </div>
    </div>"""


def email_pedido_confirmado(pedido: dict):
    """Retorna (subject, html) para email de pago confirmado al cliente."""
    nombre   = (pedido.get("nombre_cliente") or "Clienta").split()[0].capitalize()
    total    = float(pedido.get("total") or 0)
    pedido_id = str(pedido.get("id") or "")[:8].upper()
    direccion = pedido.get("direccion_envio") or "—"
    items    = pedido.get("pedido_items") or []

    filas = ""
    for it in items:
        nom  = it.get("nombre") or "Producto"
        col  = it.get("color") or ""
        tal  = it.get("talla") or ""
        cant = it.get("cantidad") or 1
        precio = float(it.get("precio_unitario") or 0)
        meta = " · ".join([x for x in [col, f"T{tal}" if tal else ""] if x])
        filas += f"""
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f5ede8;font-size:14px;color:#333">
            <strong>{nom}</strong><br>
            <span style="color:#aaa;font-size:12px">{meta} · {cant} {("par" if cant==1 else "pares")}</span>
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #f5ede8;font-size:14px;color:#b5687a;
                     text-align:right;font-weight:700;white-space:nowrap">
            ${precio * cant:,.0f} MXN
          </td>
        </tr>"""

    contenido = f"""
      <h2 style="color:#2A1A0E;font-size:1.3rem;margin-bottom:4px">¡Gracias, {nombre}! 🎉</h2>
      <p style="color:#555;font-size:0.92rem;line-height:1.6;margin-bottom:24px">
        Recibimos tu pago y ya estamos preparando tu pedido.
        Te avisamos cuando lo enviemos con tu número de rastreo.
      </p>

      <div style="background:#fdf8f5;border-radius:10px;padding:16px 20px;margin-bottom:20px">
        <p style="font-size:0.7rem;color:#aaa;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px">
          Número de pedido
        </p>
        <p style="font-size:1.1rem;font-weight:700;color:#2A1A0E;font-family:monospace;margin:0">
          #{pedido_id}
        </p>
      </div>

      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">{filas}</table>

      <div style="display:flex;justify-content:space-between;padding:14px 0;
                  border-top:2px solid #f0e0d6;margin-bottom:20px">
        <strong style="font-size:1rem;color:#2A1A0E">Total pagado</strong>
        <strong style="font-size:1.1rem;color:#b5687a">${total:,.0f} MXN</strong>
      </div>

      <div style="background:#f5f0eb;border-radius:10px;padding:14px 20px;margin-bottom:24px">
        <p style="font-size:0.7rem;color:#aaa;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px">
          📦 Dirección de envío
        </p>
        <p style="font-size:0.88rem;color:#333;margin:0;line-height:1.5">{direccion}</p>
      </div>

      <a href="https://zapatillasmay.mx"
         style="display:block;text-align:center;background:linear-gradient(135deg,#b5687a,#c8967a);
                color:#fff;padding:14px;border-radius:50px;text-decoration:none;
                font-weight:700;font-size:0.9rem;margin-bottom:16px">
        Ver más modelos →
      </a>"""

    subject = f"✅ Pedido confirmado #{pedido_id} — Zapatillas May"
    return subject, _base_html(contenido)


def email_pedido_pendiente_spei(pedido: dict):
    """Retorna (subject, html) para email de SPEI pendiente al cliente."""
    nombre    = (pedido.get("nombre_cliente") or "Clienta").split()[0].capitalize()
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
    return subject, _base_html(contenido)


def email_envio_realizado(pedido: dict, paqueteria: str, numero_guia: str, tracking_url: str):
    """Retorna (subject, html) para notificar al cliente que su pedido fue enviado."""
    nombre    = (pedido.get("nombre_cliente") or "Clienta").split()[0].capitalize()
    pedido_id = str(pedido.get("id") or "")[:8].upper()
    total     = float(pedido.get("total") or 0)
    direccion = pedido.get("direccion_envio") or "—"

    logo_paqueteria = {"fedex": "📦 FedEx", "estafeta": "📦 Estafeta", "dhl": "📦 DHL"}.get(
        paqueteria.lower(), f"📦 {paqueteria}"
    )

    contenido = f"""
      <h2 style="color:#2A1A0E;font-size:1.3rem;margin-bottom:4px">¡Tu pedido va en camino, {nombre}! 🚚</h2>
      <p style="color:#555;font-size:0.92rem;line-height:1.6;margin-bottom:24px">
        Ya enviamos tu paquete. Puedes rastrear tu envío en cualquier momento con el botón de abajo.
      </p>

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
    return subject, _base_html(contenido)


def email_nuevo_pedido_negocio(pedido: dict):
    """Retorna (subject, html) para notificar al negocio de un pedido pagado."""
    pedido_id = str(pedido.get("id") or "")[:8].upper()
    nombre    = pedido.get("nombre_cliente") or "—"
    email     = pedido.get("email_cliente") or "—"
    telefono  = pedido.get("telefono_cliente") or "—"
    total     = float(pedido.get("total") or 0)
    direccion = pedido.get("direccion_envio") or "—"
    notas     = pedido.get("notas") or ""
    items     = pedido.get("pedido_items") or []

    filas = ""
    for it in items:
        nom  = it.get("nombre") or "?"
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
