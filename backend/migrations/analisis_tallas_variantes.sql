-- Pestañas Tallas y Variantes de Análisis calculadas en la base de datos (las usa GET /finanzas/analisis-tallas-variantes).
-- Ventas = movimientos de inventario tipo venta/salida (todos los canales), de siempre / 90 d / 30 d; stock = todas las sucursales.
-- Solo modelos activos que han tenido ventas, ordenados por lo vendido en 30 días.
create or replace function public.analisis_tallas_variantes()
returns jsonb
language sql
stable
as $$
with v as (
  select v.id vid, v.producto_id, coalesce(nullif(v.talla,''),'S/T') talla, coalesce(nullif(v.color,''),'Sin color') color,
         v.talla talla_real, v.color color_real,
         coalesce((select sum(i.cantidad) from inventario i where i.variante_id = v.id), 0) stock
  from variantes v where v.activa
),
mv as (
  select m.variante_id,
         sum(abs(m.cantidad)) total,
         sum(abs(m.cantidad)) filter (where m.created_at >= now() - interval '90 days') d90,
         sum(abs(m.cantidad)) filter (where m.created_at >= now() - interval '30 days') d30
  from movimientos_inventario m
  where m.tipo in ('venta','salida')
  group by 1
),
j as (
  select v.*, coalesce(mv.total,0) total, coalesce(mv.d90,0) d90, coalesce(mv.d30,0) d30
  from v left join mv on mv.variante_id = v.vid
),
-- por producto + talla (suma de todos los colores)
pt as (
  select producto_id, talla, sum(total) total, sum(d90) d90, sum(d30) d30
  from j group by 1,2
),
-- por producto + color + talla
pct as (
  select producto_id, color, talla, sum(total) total, sum(d90) d90, sum(d30) d30
  from j group by 1,2,3
),
pc as (
  select producto_id, color, sum(total) total from pct group by 1,2
),
prod as (
  select j.producto_id, sum(j.total) total, sum(j.d90) d90, sum(j.d30) d30 from j group by 1 having sum(j.total) > 0
)
select coalesce(jsonb_agg(x.o order by x.d30 desc, x.total desc), '[]'::jsonb) from (
  select prod.d30, prod.total, jsonb_build_object(
    'id', pr.id, 'nombre', pr.nombre, 'sku_interno', pr.sku_interno, 'imagen_principal', pr.imagen_principal, 'd90', prod.d90,
    'tallas', (select coalesce(jsonb_agg(jsonb_build_object('talla', t.talla, 'd30', t.d30, 'd90', t.d90, 'total', t.total) order by t.total desc, t.talla), '[]'::jsonb)
               from pt t where t.producto_id = pr.id),
    'colores', (select coalesce(jsonb_agg(jsonb_build_object('color', c.color, 'total', c.total, 'tallas',
                  (select jsonb_agg(jsonb_build_object('talla', q.talla, 'd30', q.d30, 'd90', q.d90, 'total', q.total)
                          order by coalesce(substring(q.talla from '^[0-9]+(?:\.[0-9]+)?')::numeric, 999), q.talla)
                   from pct q where q.producto_id = c.producto_id and q.color = c.color)) order by c.total desc), '[]'::jsonb)
                from pc c where c.producto_id = pr.id and c.total > 0),
    'variantes', (select coalesce(jsonb_agg(jsonb_build_object('id', j.vid, 'label', nullif(concat_ws(' / ', j.talla_real, j.color_real), ''),
                    'stock', j.stock, 'd30', j.d30, 'd90', j.d90, 'total', j.total) order by j.total desc, j.talla), '[]'::jsonb)
                  from j where j.producto_id = pr.id)
  ) o
  from prod join productos pr on pr.id = prod.producto_id and pr.activo
) x;
$$;
