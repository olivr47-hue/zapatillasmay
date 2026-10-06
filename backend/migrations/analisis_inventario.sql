-- Análisis de inventario calculado en la base de datos (lo usa GET /finanzas/analisis-inventario).
-- Ventas = movimientos de inventario tipo venta/salida de los últimos 90 días (todos los canales); inventario = todas las sucursales.
-- Semáforo: rojo = hay stock y 0 ventas en 90 d · morado = >=4 pares en una sola venta · verde = >=2 ventas distintas y (<=21 días de stock
-- o una talla/color que se vende y está en cero) · azul = rota bien · amarillo = rotación lenta.
create or replace function public.analisis_inventario()
returns jsonb
language sql
stable
as $$
with st as (
  select v.id vid, v.producto_id, coalesce((select sum(i.cantidad) from inventario i where i.variante_id = v.id), 0) stock
  from variantes v where v.activa
),
mv as (
  select m.variante_id,
         sum(abs(m.cantidad)) filter (where m.created_at >= now() - interval '90 days') v90,
         sum(abs(m.cantidad)) filter (where m.created_at >= now() - interval '60 days') v60,
         sum(abs(m.cantidad)) filter (where m.created_at >= now() - interval '30 days') v30
  from movimientos_inventario m
  where m.tipo in ('venta','salida') and m.created_at >= now() - interval '90 days'
  group by 1
),
ev as (
  select v.producto_id, count(distinct date_trunc('minute', m.created_at)) eventos90
  from movimientos_inventario m join variantes v on v.id = m.variante_id
  where m.tipo in ('venta','salida') and m.created_at >= now() - interval '90 days'
  group by 1
),
j as (
  select st.producto_id, st.vid, st.stock, coalesce(mv.v90,0) v90, coalesce(mv.v60,0) v60, coalesce(mv.v30,0) v30
  from st left join mv on mv.variante_id = st.vid
),
p as (
  select producto_id, sum(stock) stock, sum(v90) v90, sum(v60) v60, sum(v30) v30,
         count(*) filter (where stock = 0 and v90 >= 2) faltantes_clave,
         count(*) variantes
  from j group by 1
),
c as (
  select pr.id, pr.nombre, pr.sku_interno, pr.imagen_principal, pr.categoria, coalesce(pr.costo,0) costo,
         p.stock, p.v90, p.v60, p.v30, p.faltantes_clave, coalesce(ev.eventos90,0) eventos90,
         case when p.v30 > 0 then round(p.stock / (p.v30/4.0) * 7) end dias
  from p join productos pr on pr.id = p.producto_id and pr.activo
  left join ev on ev.producto_id = p.producto_id
),
s as (
  select c.*,
    case
      when v90 = 0 and stock > 0 then 'rojo'
      when v90 > 0 and eventos90 <= 1 and v90 >= 4 then 'morado'
      when v90 > 0 and eventos90 >= 2 then case when (dias is not null and dias <= 21) or faltantes_clave > 0 then 'verde' else 'azul' end
      when v90 > 0 then 'amarillo'
      else 'gris' end semaforo
  from c where stock > 0 or v90 > 0
)
select jsonb_build_object(
  'resumen', jsonb_build_object(
    'modelos_con_stock', (select count(*) from s where stock > 0),
    'pares_stock', coalesce((select sum(stock) from s), 0),
    'capital_costo', coalesce((select round(sum(stock*costo)) from s), 0),
    'capital_parado', coalesce((select round(sum(stock*costo)) from s where semaforo = 'rojo'), 0),
    'modelos_parados', (select count(*) from s where semaforo = 'rojo'),
    'pares_parados', coalesce((select sum(stock) from s where semaforo = 'rojo'), 0),
    'pares_30', coalesce((select sum(v30) from s), 0),
    'pares_60', coalesce((select sum(v60) from s), 0),
    'pares_90', coalesce((select sum(v90) from s), 0),
    'rotan', (select count(*) from s where semaforo in ('verde','azul')),
    'pedir_ahora', (select count(*) from s where semaforo = 'verde'),
    'puntuales', (select count(*) from s where semaforo = 'morado'),
    'lentos', (select count(*) from s where semaforo = 'amarillo'),
    'cobertura_dias', (select case when sum(v90) > 0 then round(sum(stock) / (sum(v90)/90.0)) end from s)
  ),
  'modelos', coalesce((select jsonb_agg(to_jsonb(s) order by s.v30 desc, s.v90 desc) from s), '[]'::jsonb)
);
$$;
