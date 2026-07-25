from fastapi import APIRouter
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_get_all, supabase_post, supabase_patch, supabase_delete
from datetime import date
import json

router = APIRouter(prefix="/finanzas", tags=["Finanzas"])

# ─── CAJA ────────────────────────────────────────
@router.get("/caja/hoy/{sucursal_id}")
def caja_hoy(sucursal_id: str):
    try:
        hoy = date.today().isoformat()
        return supabase_get(f"cajas?sucursal_id=eq.{sucursal_id}&fecha=eq.{hoy}&order=created_at.desc")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/caja/historial/{sucursal_id}")
def historial_cajas(sucursal_id: str):
    try:
        return supabase_get(f"cajas?sucursal_id=eq.{sucursal_id}&order=created_at.desc&limit=30")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/caja/abrir")
def abrir_caja(datos: dict):
    try:
        sucursal_id = datos.get("sucursal_id")
        hoy = date.today().isoformat()
        existente = supabase_get(f"cajas?sucursal_id=eq.{sucursal_id}&fecha=eq.{hoy}&status=eq.abierta")
        if existente:
            return JSONResponse(status_code=400, content={"error": "Ya hay una caja abierta hoy"})
        return supabase_post("cajas", {
            "sucursal_id": sucursal_id,
            "empleado": datos.get("empleado", "Admin"),
            "monto_apertura": datos.get("monto_apertura", 0),
            "fecha": hoy,
            "status": "abierta"
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/caja/{id}/cerrar")
def cerrar_caja(id: str, datos: dict):
    try:
        caja = supabase_get(f"cajas?id=eq.{id}")
        if not caja:
            return JSONResponse(status_code=404, content={"error": "Caja no encontrada"})
        
        # Calcular ventas del dia -- por confirmado_at (cuando se cerro la venta),
        # no created_at (cuando se abrio el carrito/borrador, que puede ser dias antes)
        pedidos = supabase_get(f"pedidos?sucursal_id=eq.{caja[0]['sucursal_id']}&status=in.(confirmado,pagado,entregado)&select=*")
        hoy = date.today().isoformat()
        pedidos_hoy = [p for p in pedidos if (p.get('confirmado_at') or p['created_at'])[:10] == hoy]
        
        ventas_efectivo = sum(float(p['total'] or 0) for p in pedidos_hoy if p.get('forma_pago') == 'efectivo')
        ventas_tarjeta = sum(float(p['total'] or 0) for p in pedidos_hoy if p.get('forma_pago') == 'tarjeta')
        ventas_spei = sum(float(p['total'] or 0) for p in pedidos_hoy if p.get('forma_pago') == 'spei')
        ventas_credito = sum(float(p['total'] or 0) for p in pedidos_hoy if p.get('forma_pago') == 'credito')
        total_ventas = ventas_efectivo + ventas_tarjeta + ventas_spei + ventas_credito
        
        monto_cierre = datos.get("monto_cierre", 0)
        diferencia = float(monto_cierre) - (float(caja[0]['monto_apertura']) + ventas_efectivo)
        
        supabase_patch(f"cajas?id=eq.{id}", {
            "status": "cerrada",
            "hora_cierre": "now()",
            "monto_cierre": monto_cierre,
            "ventas_efectivo": ventas_efectivo,
            "ventas_tarjeta": ventas_tarjeta,
            "ventas_spei": ventas_spei,
            "ventas_credito": ventas_credito,
            "total_ventas": total_ventas,
            "diferencia": diferencia,
            "notas": datos.get("notas", "")
        })
        return {"ok": True, "total_ventas": total_ventas, "diferencia": diferencia}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ─── GASTOS ───────────────────────────────────────
def _materializar_gastos_recurrentes(sucursal_id):
    """Los gastos recurrentes (renta, nomina, suscripciones) se guardan una
    vez como 'plantilla' (es_recurrente=true, plantilla_id=null) y aqui se
    clona automaticamente una copia para el mes actual si todavia no existe,
    para no tener que capturarlos a mano cada mes."""
    import calendar
    try:
        hoy = date.today()
        mes_actual = hoy.strftime("%Y-%m")
        plantillas = supabase_get(
            f"gastos?sucursal_id=eq.{sucursal_id}&es_recurrente=eq.true&plantilla_id=is.null"
        ) or []
        for t in plantillas:
            if t.get("mes_generado") == mes_actual:
                continue
            ya_generado = supabase_get(
                f"gastos?plantilla_id=eq.{t['id']}&mes_generado=eq.{mes_actual}"
            )
            if ya_generado:
                continue
            dia = t.get("dia_mes") or 1
            ultimo_dia = calendar.monthrange(hoy.year, hoy.month)[1]
            fecha_gasto = date(hoy.year, hoy.month, min(dia, ultimo_dia))
            try:
                supabase_post("gastos", {
                    "sucursal_id": sucursal_id,
                    "concepto": t["concepto"],
                    "monto": t["monto"],
                    "categoria": t.get("categoria", "general"),
                    "empleado": "Sistema (recurrente)",
                    "fecha": fecha_gasto.isoformat(),
                    "es_recurrente": True,
                    "dia_mes": dia,
                    "plantilla_id": t["id"],
                    "mes_generado": mes_actual,
                })
            except Exception:
                pass  # no bloquear el listado si falla un gasto recurrente individual
    except Exception:
        pass

@router.get("/gastos/{sucursal_id}")
def listar_gastos(sucursal_id: str):
    try:
        _materializar_gastos_recurrentes(sucursal_id)
        return supabase_get(f"gastos?sucursal_id=eq.{sucursal_id}&order=created_at.desc")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/gastos")
def crear_gasto(datos: dict):
    try:
        if datos.get("es_recurrente"):
            hoy = date.today()
            datos.setdefault("dia_mes", hoy.day)
            datos["mes_generado"] = hoy.strftime("%Y-%m")
        return supabase_post("gastos", datos)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.delete("/gastos/{id}")
def eliminar_gasto(id: str):
    try:
        return supabase_delete(f"gastos?id=eq.{id}")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ─── PROVEEDORES ──────────────────────────────────
@router.get("/proveedores")
def listar_proveedores():
    try:
        return supabase_get("proveedores?activo=eq.true&order=nombre.asc")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/proveedores")
def crear_proveedor(datos: dict):
    try:
        return supabase_post("proveedores", datos)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.patch("/proveedores/{id}")
def actualizar_proveedor(id: str, datos: dict):
    try:
        return supabase_patch(f"proveedores?id=eq.{id}", datos)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ─── ORDENES DE COMPRA ────────────────────────────
@router.get("/ordenes")
def listar_ordenes():
    try:
        return supabase_get("ordenes_compra?order=created_at.desc&select=*,proveedores(nombre),sucursales(nombre)")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/ordenes")
def crear_orden(datos: dict):
    try:
        return supabase_post("ordenes_compra", datos)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.patch("/ordenes/{id}")
def actualizar_orden(id: str, datos: dict):
    try:
        return supabase_patch(f"ordenes_compra?id=eq.{id}", datos)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/ordenes/{id}/items")
def agregar_item_orden(id: str, item: dict):
    try:
        item["orden_id"] = id
        return supabase_post("ordenes_compra_items", item)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/ordenes/{id}/items")
def items_orden(id: str):
    try:
        return supabase_get(f"ordenes_compra_items?orden_id=eq.{id}&select=*,variantes(*,productos(nombre))")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/ordenes/recibir")
def recibir_mercancia(datos: dict):
    """Registra una remision de mercancia que ya llego: sube el inventario
    de cada variante recibida Y crea la orden de compra (cuenta por pagar)
    en un solo paso, con la fecha de hoy y el dias_credito que se le haya
    dado a esa remision en particular (puede ser distinto al default del
    proveedor si se llego a otro acuerdo)."""
    try:
        proveedor_id = datos.get("proveedor_id")
        sucursal_id = datos.get("sucursal_id")
        dias_credito = datos.get("dias_credito")
        notas = datos.get("notas", "")
        items = datos.get("items") or []
        if not sucursal_id or not items:
            return JSONResponse(status_code=400, content={"error": "Falta sucursal o productos"})

        total = sum(float(i.get("cantidad", 0)) * float(i.get("costo_unitario", 0)) for i in items)
        pagada = bool(datos.get("pagada"))

        orden_payload = {
            "proveedor_id": proveedor_id,
            "sucursal_id": sucursal_id,
            "status": "pagada" if pagada else "recibida",
            "total": total,
            "notas": notas,
        }
        if pagada:
            from datetime import datetime
            orden_payload["fecha_pago"] = datetime.now().isoformat()
        if dias_credito is not None:
            orden_payload["dias_credito"] = int(dias_credito)
        orden = supabase_post("ordenes_compra", orden_payload)
        orden_id = orden[0]["id"]

        for i in items:
            variante_id = i.get("variante_id")
            cantidad = int(i.get("cantidad") or 0)
            costo_unitario = float(i.get("costo_unitario") or 0)
            if not variante_id or cantidad <= 0:
                continue

            supabase_post("ordenes_compra_items", {
                "orden_id": orden_id,
                "variante_id": variante_id,
                "cantidad": cantidad,
                "costo_unitario": costo_unitario,
                "subtotal": cantidad * costo_unitario,
            })

            inv_actual = supabase_get(f"inventario?variante_id=eq.{variante_id}&sucursal_id=eq.{sucursal_id}")
            cantidad_anterior = inv_actual[0]["cantidad"] if inv_actual else 0
            cantidad_nueva = cantidad_anterior + cantidad
            if inv_actual:
                supabase_patch(
                    f"inventario?variante_id=eq.{variante_id}&sucursal_id=eq.{sucursal_id}",
                    {"cantidad": cantidad_nueva}
                )
            else:
                supabase_post("inventario", {
                    "variante_id": variante_id, "sucursal_id": sucursal_id,
                    "cantidad": cantidad_nueva, "stock_minimo": 3
                })
            supabase_post("movimientos_inventario", {
                "tipo": "entrada",
                "variante_id": variante_id,
                "sucursal_id": sucursal_id,
                "cantidad": cantidad,
                "cantidad_anterior": cantidad_anterior,
                "motivo": f"Recepcion de mercancia - orden {orden_id}",
            })

        return {"ok": True, "orden_id": orden_id, "total": total}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ─── REPORTES ─────────────────────────────────────
@router.get("/reporte/{sucursal_id}")
def reporte_financiero(sucursal_id: str):
    try:
        from datetime import datetime, timedelta
        hoy = date.today()
        hace30 = (hoy - timedelta(days=30)).isoformat()

        # Pedidos de la sucursal + pedidos online (sin sucursal) en los últimos 30 días.
        # Se filtra por confirmado_at (fecha real de venta), no created_at (fecha del
        # carrito/borrador, que puede ser de mucho antes si se dejo pendiente).
        pedidos_sucursal = supabase_get(
            f"pedidos?sucursal_id=eq.{sucursal_id}"
            f"&status=in.(confirmado,pagado,entregado,enviado)&confirmado_at=gte.{hace30}"
            f"&select=id,total"
        ) or []
        pedidos_online = supabase_get(
            f"pedidos?sucursal_id=is.null"
            f"&status=in.(pagado,enviado)&confirmado_at=gte.{hace30}"
            f"&select=id,total"
        ) or []
        pedidos = pedidos_sucursal + pedidos_online

        gastos = supabase_get(
            f"gastos?sucursal_id=eq.{sucursal_id}&created_at=gte.{hace30}T00:00:00"
        ) or []

        total_ventas = sum(float(p['total'] or 0) for p in pedidos)
        total_gastos = sum(float(g['monto'] or 0) for g in gastos)

        # Diagnóstico: cuántos pedidos no tienen items registrados
        ids_pedidos = [p['id'] for p in pedidos]
        pedidos_sin_items = []
        cmv = 0.0
        if ids_pedidos:
            # 1. Todos los items en una sola consulta
            ids_str = ','.join(ids_pedidos)
            items = supabase_get(
                f"pedido_items?pedido_id=in.({ids_str})"
                f"&select=pedido_id,cantidad,variante_id,precio_unitario,nombre"
            ) or []

            items_validos = [
                i for i in items
                if i.get('variante_id') and int(i.get('cantidad') or 0) > 0
            ]

            # 2. Todas las variantes necesarias en una sola consulta
            variante_ids_unicos = list({i['variante_id'] for i in items_validos})
            variantes_map = {}
            if variante_ids_unicos:
                vids_str = ','.join(variante_ids_unicos)
                vs = supabase_get(
                    f"variantes?id=in.({vids_str})&select=id,producto_id,color,talla"
                ) or []
                variantes_map = {v['id']: v for v in vs}

            # 3. Todos los productos necesarios en una sola consulta
            producto_ids_unicos = list({
                variantes_map[i['variante_id']].get('producto_id')
                for i in items_validos
                if variantes_map.get(i['variante_id'], {}).get('producto_id')
            })
            productos_map = {}
            if producto_ids_unicos:
                pids_str = ','.join(producto_ids_unicos)
                ps = supabase_get(
                    f"productos?id=in.({pids_str})&select=id,nombre,costo,sku_interno"
                ) or []
                productos_map = {p['id']: p for p in ps}

            # 4. Construir desglose
            desglose_cmv = []
            for item in items_validos:
                variante_id  = item['variante_id']
                cantidad     = int(item.get('cantidad') or 0)
                precio_venta = float(item.get('precio_unitario') or 0)
                nombre_item  = item.get('nombre', '')

                var         = variantes_map.get(variante_id, {})
                producto_id = var.get('producto_id')
                prod        = productos_map.get(producto_id, {}) if producto_id else {}

                costo  = float(prod.get('costo') or 0)
                nombre = prod.get('nombre') or nombre_item
                sku    = prod.get('sku_interno', '')
                color  = var.get('color', '')
                talla  = var.get('talla', '')

                subtotal_costo = costo * cantidad
                subtotal_venta = precio_venta * cantidad
                cmv += subtotal_costo
                desglose_cmv.append({
                    'nombre':         nombre,
                    'sku':            sku,
                    'color':          color,
                    'talla':          talla,
                    'cantidad':       cantidad,
                    'costo_unitario': costo,
                    'precio_venta':   precio_venta,
                    'subtotal_costo': subtotal_costo,
                    'subtotal_venta': subtotal_venta,
                })

        # Detectar pedidos sin items (ventas que no se pueden desglosar por producto)
        ids_con_items = {i.get('pedido_id') for i in (items or []) if i.get('pedido_id')}
        pedidos_sin_items_lista = [p for p in pedidos if p['id'] not in ids_con_items]
        total_sin_desglose = sum(float(p['total'] or 0) for p in pedidos_sin_items_lista)

        # Ventas solo de productos (sin envío): suma real de precio_unitario × cantidad
        total_ventas_productos = sum(r['subtotal_venta'] for r in desglose_cmv)
        total_envio_cobrado    = total_ventas - total_ventas_productos

        # Utilidad basada en ingresos de productos (sin distorsionar con el envío)
        utilidad_bruta = total_ventas_productos - cmv
        utilidad_neta  = utilidad_bruta - total_gastos

        desglose_cmv_sorted = sorted(desglose_cmv, key=lambda x: x['subtotal_costo'], reverse=True)

        return {
            "total_ventas":           total_ventas,            # ingresos totales (productos + envío)
            "total_ventas_productos": total_ventas_productos,  # solo productos
            "total_envio_cobrado":    total_envio_cobrado,     # envío cobrado al cliente
            "total_gastos":           total_gastos,
            "cmv":                    cmv,
            "utilidad_bruta":         utilidad_bruta,          # ventas productos − CMV
            "utilidad":               utilidad_neta,           # utilidad_bruta − gastos operativos
            "num_pedidos":            len(pedidos),
            "ticket_promedio":        total_ventas / len(pedidos) if pedidos else 0,
            "desglose_cmv":           desglose_cmv_sorted,
            "num_pedidos_sin_desglose": len(pedidos_sin_items_lista),
            "total_sin_desglose":     total_sin_desglose,
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
        # ─── ESTADO DE RESULTADOS ─────────────────────────
@router.get("/estado-resultados/{sucursal_id}")
def estado_resultados(sucursal_id: str):
    try:
        from datetime import datetime, timedelta
        hoy = date.today()
        
        # Ultimos 6 meses
        meses = []
        for i in range(5, -1, -1):
            primer_dia = (hoy.replace(day=1) - timedelta(days=i*30)).replace(day=1)
            if primer_dia.month == 12:
                ultimo_dia = primer_dia.replace(year=primer_dia.year+1, month=1, day=1) - timedelta(days=1)
            else:
                ultimo_dia = primer_dia.replace(month=primer_dia.month+1, day=1) - timedelta(days=1)
            meses.append((primer_dia, ultimo_dia))

        resultado = []
        for primer_dia, ultimo_dia in meses:
            pedidos = supabase_get(f"pedidos?sucursal_id=eq.{sucursal_id}&status=in.(confirmado,pagado,entregado)&confirmado_at=gte.{primer_dia.isoformat()}T00:00:00&confirmado_at=lte.{ultimo_dia.isoformat()}T23:59:59")
            gastos = supabase_get(f"gastos?sucursal_id=eq.{sucursal_id}&created_at=gte.{primer_dia.isoformat()}T00:00:00&created_at=lte.{ultimo_dia.isoformat()}T23:59:59")
            
            ventas = sum(float(p['total'] or 0) for p in pedidos)
            gasto = sum(float(g['monto'] or 0) for g in gastos)
            utilidad = ventas - gasto
            
            resultado.append({
                "mes": primer_dia.strftime("%b %Y"),
                "ventas": ventas,
                "gastos": gasto,
                "utilidad": utilidad,
                "num_pedidos": len(pedidos)
            })
        
        return resultado
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ─── FLUJO DE EFECTIVO ────────────────────────────
@router.get("/flujo/{sucursal_id}")
def flujo_efectivo(sucursal_id: str):
    try:
        from datetime import timedelta
        hoy = date.today()
        hace7 = (hoy - timedelta(days=7)).isoformat()
        hace30 = (hoy - timedelta(days=30)).isoformat()

        pedidos_semana = supabase_get(f"pedidos?sucursal_id=eq.{sucursal_id}&status=in.(confirmado,pagado,entregado)&confirmado_at=gte.{hace7}T00:00:00")
        pedidos_mes = supabase_get(f"pedidos?sucursal_id=eq.{sucursal_id}&status=in.(confirmado,pagado,entregado)&confirmado_at=gte.{hace30}T00:00:00")
        gastos_semana = supabase_get(f"gastos?sucursal_id=eq.{sucursal_id}&created_at=gte.{hace7}T00:00:00")
        gastos_mes = supabase_get(f"gastos?sucursal_id=eq.{sucursal_id}&created_at=gte.{hace30}T00:00:00")

        # Por forma de pago hoy
        hoy_str = hoy.isoformat()
        pedidos_hoy = supabase_get(f"pedidos?sucursal_id=eq.{sucursal_id}&status=in.(confirmado,pagado,entregado)&confirmado_at=gte.{hoy_str}T00:00:00")

        return {
            "hoy": {
                "efectivo": sum(float(p['total'] or 0) for p in pedidos_hoy if p.get('forma_pago') == 'efectivo'),
                "tarjeta": sum(float(p['total'] or 0) for p in pedidos_hoy if p.get('forma_pago') == 'tarjeta'),
                "spei": sum(float(p['total'] or 0) for p in pedidos_hoy if p.get('forma_pago') == 'spei'),
                "credito": sum(float(p['total'] or 0) for p in pedidos_hoy if p.get('forma_pago') == 'credito'),
                "total": sum(float(p['total'] or 0) for p in pedidos_hoy)
            },
            "semana": {
                "ingresos": sum(float(p['total'] or 0) for p in pedidos_semana),
                "gastos": sum(float(g['monto'] or 0) for g in gastos_semana),
                "neto": sum(float(p['total'] or 0) for p in pedidos_semana) - sum(float(g['monto'] or 0) for g in gastos_semana)
            },
            "mes": {
                "ingresos": sum(float(p['total'] or 0) for p in pedidos_mes),
                "gastos": sum(float(g['monto'] or 0) for g in gastos_mes),
                "neto": sum(float(p['total'] or 0) for p in pedidos_mes) - sum(float(g['monto'] or 0) for g in gastos_mes)
            }
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ─── CUENTAS POR COBRAR ───────────────────────────
@router.get("/cuentas-por-cobrar")
def cuentas_por_cobrar():
    try:
        pedidos = supabase_get("pedidos?forma_pago=eq.credito&status=in.(confirmado,pagado,entregado)&select=*,clientes(nombre,telefono)")
        return pedidos
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ─── GASTOS POR CATEGORIA ─────────────────────────
@router.get("/gastos-categorias/{sucursal_id}")
def gastos_por_categoria(sucursal_id: str):
    try:
        from datetime import timedelta
        hace30 = (date.today() - timedelta(days=30)).isoformat()
        gastos = supabase_get(f"gastos?sucursal_id=eq.{sucursal_id}&created_at=gte.{hace30}T00:00:00")
        
        categorias = {}
        for g in gastos:
            cat = g.get('categoria', 'general')
            categorias[cat] = categorias.get(cat, 0) + float(g['monto'] or 0)
        
        return [{"categoria": k, "total": v} for k, v in sorted(categorias.items(), key=lambda x: -x[1])]
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
        # ─── SUGERENCIAS DE RECOMPRA ──────────────────────
@router.get("/sugerencias-recompra/{sucursal_id}")
def sugerencias_recompra(sucursal_id: str):
    try:
        from datetime import timedelta
        hace30 = (date.today() - timedelta(days=30)).isoformat()
        hace90 = (date.today() - timedelta(days=90)).isoformat()

        # supabase_get sin paginar corta en ~1000 filas (limite de PostgREST) —
        # con 1400+ variantes y miles de movimientos, se perdian productos
        # completos del desglose sin ningun error visible (quedaban con
        # variantes_detalle vacio, como si no necesitaran nada).
        productos = supabase_get_all("productos?activo=eq.true&select=*,proveedores(nombre,telefono,email)")
        # Solo variantes activas: colores/tallas descontinuados no deben inflar
        # el stock_total ni disparar "sin_stock" de algo que ya no se vende.
        variantes = supabase_get_all("variantes?activa=eq.true&select=*")
        inventario = supabase_get_all(f"inventario?sucursal_id=eq.{sucursal_id}")
        # 'venta' = POS/pedidos propios. 'salida' = MercadoLibre/SHEIN/Walmart
        # (esos canales registran su descuento de inventario con ese tipo distinto).
        movimientos = supabase_get_all(f"movimientos_inventario?tipo=in.(venta,salida)&created_at=gte.{hace90}T00:00:00")

        sugerencias = []
        for p in productos:
            vars_prod = [v for v in variantes if v['producto_id'] == p['id']]
            var_ids = [v['id'] for v in vars_prod]
            
            stock_total = sum(
                i['cantidad'] for i in inventario 
                if i['variante_id'] in var_ids
            )
            
            ventas_30 = sum(
                abs(m['cantidad']) for m in movimientos 
                if m['variante_id'] in var_ids and m['created_at'][:10] >= hace30
            )
            ventas_90 = sum(
                abs(m['cantidad']) for m in movimientos 
                if m['variante_id'] in var_ids
            )
            
            velocidad_semanal = ventas_30 / 4 if ventas_30 > 0 else ventas_90 / 12
            dias_inventario = round(stock_total / velocidad_semanal * 7) if velocidad_semanal > 0 else None
            stock_minimo = p.get('stock_minimo') or 1  # default 1 par: aparece cuando llega a 1 o 0

            # Detalle de stock por variante (antes de calcular cantidad_sugerida)
            variantes_detalle = []
            for v in vars_prod:
                stock_v = sum(i['cantidad'] for i in inventario if i['variante_id'] == v['id'])
                variantes_detalle.append({
                    "id": v['id'],
                    "talla": v.get('talla', ''),
                    "color": v.get('color', ''),
                    "sku": v.get('sku', ''),
                    "stock": stock_v,
                    "sin_stock": stock_v == 0
                })

            # Ordenar por talla numérica si es posible, si no alfabético
            def sort_talla(v):
                try:
                    return (0, float(v['talla']))
                except:
                    return (1, v['talla'] or '')
            variantes_detalle.sort(key=sort_talla)

            variantes_sin_stock = [v for v in variantes_detalle if v['sin_stock']]
            tiene_variante_sin_stock = len(variantes_sin_stock) > 0

            # cantidad_sugerida: al menos 1 par por cada variante sin stock,
            # y si hay velocidad, lo que dicte la rotación (lo que sea mayor)
            cantidad_sugerida = len(variantes_sin_stock)  # mínimo 1 par x variante faltante
            if velocidad_semanal > 0:
                por_rotacion = max(0, round(velocidad_semanal * 4) - stock_total)
                cantidad_sugerida = max(cantidad_sugerida, por_rotacion)

            # Días "efectivos" para ordenar por urgencia real: si ya hay una
            # variante en cero (o el total está en cero), cuenta como 0 días
            # sin importar qué tan bien surtido esté el resto del modelo —
            # así un modelo con una talla agotada siempre queda antes que uno
            # con más días de stock global pero ninguna talla realmente agotada.
            dias_efectivos = 0 if (stock_total == 0 or tiene_variante_sin_stock) else (dias_inventario if dias_inventario is not None else 9999)

            # Mostrar si: stock total bajo mínimo, alguna variante en 0, o días críticos
            if stock_total == 0 or stock_total <= stock_minimo or tiene_variante_sin_stock or (dias_inventario and dias_inventario <= 21):
                sugerencias.append({
                    "producto_id": p['id'],
                    "nombre": p['nombre'],
                    "sku": p.get('sku_interno', ''),
                    "imagen": p.get('imagen_principal'),
                    "stock_total": stock_total,
                    "stock_minimo": stock_minimo,
                    "ventas_30": ventas_30,
                    "ventas_90": ventas_90,
                    "velocidad_semanal": round(velocidad_semanal, 1),
                    "dias_inventario": dias_inventario,
                    "dias_efectivos": dias_efectivos,
                    "cantidad_sugerida": max(6, cantidad_sugerida),
                    "costo_unitario": float(p.get('costo') or 0),
                    "proveedor": p.get('proveedores'),
                    "proveedor_id": p.get('proveedor_id'),
                    "urgente": stock_total == 0 or tiene_variante_sin_stock or (dias_inventario and dias_inventario <= 7),
                    "variantes": variantes_detalle
                })

        # Entre empatados en dias_efectivos (ej. todos los "urgentes" con alguna
        # variante en 0), priorizar los que más rápido se venden -- sin esto,
        # un modelo agotado casi sin ventas quedaba mezclado al mismo nivel que
        # uno agotado que vende decenas de pares por semana.
        sugerencias.sort(key=lambda x: (x['dias_efectivos'], -x['velocidad_semanal']))
        return sugerencias
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ─── CUENTAS POR PAGAR (proveedores) ──────────────
@router.get("/cuentas-por-pagar")
def cuentas_por_pagar():
    """Ordenes de compra que todavia no se han pagado, con su fecha de
    vencimiento calculada a partir de los dias de credito del proveedor."""
    try:
        from datetime import datetime, timedelta
        ordenes = supabase_get_all(
            "ordenes_compra?status=not.in.(pagada,cancelada)"
            "&order=created_at.asc&select=*,proveedores(nombre,telefono,dias_credito)"
        )
        hoy = date.today()
        resultado = []
        for o in ordenes:
            prov = o.get("proveedores") or {}
            # La orden puede traer su propio dias_credito (acuerdo puntual con
            # el proveedor); si no, se usa el default capturado en el proveedor.
            dias_credito = o.get("dias_credito")
            if dias_credito is None:
                dias_credito = prov.get("dias_credito") or 0
            fecha_orden = datetime.fromisoformat(o["created_at"]).date()
            fecha_vencimiento = fecha_orden + timedelta(days=dias_credito)
            dias_restantes = (fecha_vencimiento - hoy).days
            resultado.append({
                **o,
                "proveedor_nombre": prov.get("nombre") or "Sin proveedor",
                "dias_credito": dias_credito,
                "fecha_orden": fecha_orden.isoformat(),
                "fecha_vencimiento": fecha_vencimiento.isoformat(),
                "dias_restantes": dias_restantes,
                "vencido": dias_restantes < 0,
            })
        resultado.sort(key=lambda x: x["dias_restantes"])
        return resultado
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/ordenes/{id}/marcar-pagada")
def marcar_orden_pagada(id: str):
    try:
        from datetime import datetime
        supabase_patch(f"ordenes_compra?id=eq.{id}", {
            "status": "pagada",
            "fecha_pago": datetime.now().isoformat()
        })
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/ordenes/{id}/marcar-cancelada")
def marcar_orden_cancelada(id: str):
    try:
        supabase_patch(f"ordenes_compra?id=eq.{id}", {"status": "cancelada"})
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ─── DEUDAS / PRESTAMOS ────────────────────────────
def _proximo_dia_pago(dia_pago):
    """Dado un dia del mes (1-28ish), regresa la proxima fecha en que cae."""
    from datetime import timedelta
    import calendar
    if not dia_pago:
        return None
    hoy = date.today()
    ultimo_dia_mes = calendar.monthrange(hoy.year, hoy.month)[1]
    dia = min(dia_pago, ultimo_dia_mes)
    candidata = date(hoy.year, hoy.month, dia)
    if candidata < hoy:
        mes = hoy.month + 1
        anio = hoy.year
        if mes > 12:
            mes = 1
            anio += 1
        ultimo_dia_sig = calendar.monthrange(anio, mes)[1]
        candidata = date(anio, mes, min(dia_pago, ultimo_dia_sig))
    return candidata.isoformat()

@router.get("/deudas")
def listar_deudas():
    try:
        deudas = supabase_get("deudas?activo=eq.true&order=dia_pago.asc.nullslast")
        for d in deudas:
            d["proximo_pago"] = _proximo_dia_pago(d.get("dia_pago"))
        return deudas
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/deudas")
def crear_deuda(datos: dict):
    try:
        datos.setdefault("saldo_actual", datos.get("monto_original", 0))
        return supabase_post("deudas", datos)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.patch("/deudas/{id}")
def actualizar_deuda(id: str, datos: dict):
    try:
        return supabase_patch(f"deudas?id=eq.{id}", datos)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/deudas/{id}/pagos")
def listar_pagos_deuda(id: str):
    try:
        return supabase_get(f"deudas_pagos?deuda_id=eq.{id}&order=fecha.desc")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/deudas/{id}/pagos")
def registrar_pago_deuda(id: str, datos: dict):
    """Registra un pago (capital + interes) y descuenta el capital del saldo."""
    try:
        deuda = supabase_get(f"deudas?id=eq.{id}")
        if not deuda:
            return JSONResponse(status_code=404, content={"error": "Deuda no encontrada"})
        deuda = deuda[0]

        monto_capital = float(datos.get("monto_capital") or 0)
        monto_interes = float(datos.get("monto_interes") or 0)
        monto_total   = float(datos.get("monto") or (monto_capital + monto_interes))
        saldo_nuevo   = max(0, float(deuda["saldo_actual"]) - monto_capital)

        pago = supabase_post("deudas_pagos", {
            "deuda_id": id,
            "monto": monto_total,
            "monto_interes": monto_interes,
            "monto_capital": monto_capital,
            "fecha": datos.get("fecha") or date.today().isoformat(),
            "saldo_despues": saldo_nuevo,
            "notas": datos.get("notas", "")
        })

        supabase_patch(f"deudas?id=eq.{id}", {"saldo_actual": saldo_nuevo})
        if saldo_nuevo <= 0:
            supabase_patch(f"deudas?id=eq.{id}", {"activo": False})

        return {"ok": True, "saldo_actual": saldo_nuevo, "pago": pago}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ─── SALDO INICIAL (para proyeccion de flujo) ─────
@router.get("/saldo")
def obtener_saldo():
    try:
        rows = supabase_get("configuracion?clave=eq.saldo_flujo_efectivo")
        if rows and rows[0].get("valor"):
            return json.loads(rows[0]["valor"])
        return {"monto": 0, "fecha": None}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/saldo")
def guardar_saldo(datos: dict):
    try:
        valor = json.dumps({"monto": float(datos.get("monto") or 0), "fecha": date.today().isoformat()})
        existente = supabase_get("configuracion?clave=eq.saldo_flujo_efectivo")
        if existente:
            supabase_patch("configuracion?clave=eq.saldo_flujo_efectivo", {"valor": valor})
        else:
            supabase_post("configuracion", {"clave": "saldo_flujo_efectivo", "valor": valor})
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ─── PROYECCION DE FLUJO DE CAJA ──────────────────
@router.get("/proyeccion/{sucursal_id}")
def proyeccion_flujo(sucursal_id: str, dias: int = 60):
    """Proyecta el saldo dia a dia combinando: saldo inicial capturado,
    ingreso promedio (velocidad de venta reciente), egresos variables
    promedio, y egresos YA CONOCIDOS con fecha (cuentas por pagar a
    proveedores, gastos recurrentes, pagos de deudas)."""
    try:
        from datetime import timedelta
        import calendar as _cal
        hoy = date.today()

        saldo_rows = supabase_get("configuracion?clave=eq.saldo_flujo_efectivo")
        saldo_inicial = 0.0
        if saldo_rows and saldo_rows[0].get("valor"):
            saldo_inicial = float(json.loads(saldo_rows[0]["valor"]).get("monto") or 0)

        hace30 = (hoy - timedelta(days=30)).isoformat()
        pedidos_suc = supabase_get(
            f"pedidos?sucursal_id=eq.{sucursal_id}&status=in.(confirmado,pagado,entregado,enviado)"
            f"&confirmado_at=gte.{hace30}&select=total"
        ) or []
        pedidos_online = supabase_get(
            f"pedidos?sucursal_id=is.null&status=in.(pagado,enviado)"
            f"&confirmado_at=gte.{hace30}&select=total"
        ) or []
        ventas_30 = sum(float(p['total'] or 0) for p in pedidos_suc + pedidos_online)
        ingreso_diario_prom = ventas_30 / 30

        gastos_30 = supabase_get(f"gastos?sucursal_id=eq.{sucursal_id}&created_at=gte.{hace30}T00:00:00") or []
        gastos_variables_30 = sum(float(g['monto'] or 0) for g in gastos_30 if not g.get('es_recurrente'))
        egreso_variable_diario = gastos_variables_30 / 30

        cxp = cuentas_por_pagar()
        if isinstance(cxp, JSONResponse):
            cxp = []
        plantillas = supabase_get(
            f"gastos?sucursal_id=eq.{sucursal_id}&es_recurrente=eq.true&plantilla_id=is.null"
        ) or []
        deudas = supabase_get("deudas?activo=eq.true") or []

        dias_proyeccion = []
        saldo_actual = saldo_inicial
        for i in range(dias):
            fecha_i = hoy + timedelta(days=i)
            fecha_iso = fecha_i.isoformat()
            ingreso = ingreso_diario_prom
            egreso = egreso_variable_diario
            detalle = []

            for o in cxp:
                if o.get("fecha_vencimiento") == fecha_iso:
                    monto = float(o.get("total") or 0)
                    egreso += monto
                    detalle.append(f"Pago a {o.get('proveedor_nombre')}: ${monto:,.0f}")

            for t in plantillas:
                dia = t.get("dia_mes") or 1
                ultimo_dia = _cal.monthrange(fecha_i.year, fecha_i.month)[1]
                if fecha_i.day == min(dia, ultimo_dia):
                    monto = float(t.get("monto") or 0)
                    egreso += monto
                    detalle.append(f"{t.get('concepto')}: ${monto:,.0f}")

            for d in deudas:
                dia_pago = d.get("dia_pago")
                pago_mensual = d.get("pago_mensual")
                if dia_pago and pago_mensual:
                    ultimo_dia = _cal.monthrange(fecha_i.year, fecha_i.month)[1]
                    if fecha_i.day == min(dia_pago, ultimo_dia):
                        monto = float(pago_mensual or 0)
                        egreso += monto
                        detalle.append(f"Pago deuda {d.get('nombre')}: ${monto:,.0f}")

            saldo_actual += (ingreso - egreso)
            dias_proyeccion.append({
                "fecha": fecha_iso,
                "ingreso": round(ingreso, 2),
                "egreso": round(egreso, 2),
                "saldo": round(saldo_actual, 2),
                "detalle_egresos": detalle,
            })

        return {
            "saldo_inicial": saldo_inicial,
            "ingreso_diario_promedio": round(ingreso_diario_prom, 2),
            "egreso_variable_diario": round(egreso_variable_diario, 2),
            "dias": dias_proyeccion,
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})