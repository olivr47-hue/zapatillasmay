from fastapi import APIRouter
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_post, supabase_patch, supabase_delete
from datetime import date

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
        
        # Calcular ventas del dia
        pedidos = supabase_get(f"pedidos?sucursal_id=eq.{caja[0]['sucursal_id']}&status=eq.confirmado")
        hoy = date.today().isoformat()
        pedidos_hoy = [p for p in pedidos if p['created_at'][:10] == hoy]
        
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
@router.get("/gastos/{sucursal_id}")
def listar_gastos(sucursal_id: str):
    try:
        return supabase_get(f"gastos?sucursal_id=eq.{sucursal_id}&order=created_at.desc")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/gastos")
def crear_gasto(datos: dict):
    try:
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

# ─── REPORTES ─────────────────────────────────────
@router.get("/reporte/{sucursal_id}")
def reporte_financiero(sucursal_id: str):
    try:
        from datetime import datetime, timedelta
        hoy = date.today()
        hace30 = (hoy - timedelta(days=30)).isoformat()
        
        pedidos = supabase_get(f"pedidos?sucursal_id=eq.{sucursal_id}&status=eq.confirmado&created_at=gte.{hace30}")
        gastos = supabase_get(f"gastos?sucursal_id=eq.{sucursal_id}&created_at=gte.{hace30}T00:00:00")
        
        total_ventas = sum(float(p['total'] or 0) for p in pedidos)
        total_gastos = sum(float(g['monto'] or 0) for g in gastos)
        utilidad = total_ventas - total_gastos
        
        return {
            "total_ventas": total_ventas,
            "total_gastos": total_gastos,
            "utilidad": utilidad,
            "num_pedidos": len(pedidos),
            "ticket_promedio": total_ventas / len(pedidos) if pedidos else 0
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
            pedidos = supabase_get(f"pedidos?sucursal_id=eq.{sucursal_id}&status=eq.confirmado&created_at=gte.{primer_dia.isoformat()}T00:00:00&created_at=lte.{ultimo_dia.isoformat()}T23:59:59")
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

        pedidos_semana = supabase_get(f"pedidos?sucursal_id=eq.{sucursal_id}&status=eq.confirmado&created_at=gte.{hace7}T00:00:00")
        pedidos_mes = supabase_get(f"pedidos?sucursal_id=eq.{sucursal_id}&status=eq.confirmado&created_at=gte.{hace30}T00:00:00")
        gastos_semana = supabase_get(f"gastos?sucursal_id=eq.{sucursal_id}&created_at=gte.{hace7}T00:00:00")
        gastos_mes = supabase_get(f"gastos?sucursal_id=eq.{sucursal_id}&created_at=gte.{hace30}T00:00:00")

        # Por forma de pago hoy
        hoy_str = hoy.isoformat()
        pedidos_hoy = supabase_get(f"pedidos?sucursal_id=eq.{sucursal_id}&status=eq.confirmado&created_at=gte.{hoy_str}T00:00:00")

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
        pedidos = supabase_get("pedidos?forma_pago=eq.credito&status=eq.confirmado&select=*,clientes(nombre,telefono)")
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

        productos = supabase_get("productos?activo=eq.true&select=*,proveedores(nombre,telefono,email)")
        variantes = supabase_get("variantes?select=*")
        inventario = supabase_get(f"inventario?sucursal_id=eq.{sucursal_id}")
        movimientos = supabase_get(f"movimientos?tipo=eq.venta&created_at=gte.{hace90}T00:00:00")

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
            stock_minimo = p.get('stock_minimo', 1)
            
            cantidad_sugerida = 0
            if velocidad_semanal > 0:
                cantidad_sugerida = max(0, round(velocidad_semanal * 4) - stock_total)
            
            if stock_total <= stock_minimo or (dias_inventario and dias_inventario <= 14):
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
                    "cantidad_sugerida": max(6, cantidad_sugerida),
                    "costo_unitario": float(p.get('costo') or 0),
                    "proveedor": p.get('proveedores'),
                    "proveedor_id": p.get('proveedor_id'),
                    "urgente": stock_total == 0 or (dias_inventario and dias_inventario <= 7)
                })

        sugerencias.sort(key=lambda x: (not x['urgente'], x['dias_inventario'] or 999))
        return sugerencias
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})