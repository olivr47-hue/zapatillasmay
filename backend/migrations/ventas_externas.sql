-- Ventas de otros canales (TikTok) que cuentan SOLO para la utilidad (la general y «Tu utilidad»), no como ventas ni descuentan inventario.
-- Se cargan desde el archivo de pedidos de TikTok Seller Center; el mes es el de la fecha de pago (hora de México).
create table if not exists public.ventas_externas (
  id uuid primary key default gen_random_uuid(),
  origen text not null default 'tiktok',
  pedido_externo text not null,
  sku_vendedor text not null,
  producto_id uuid references public.productos(id) on delete set null,
  nombre text,
  cantidad integer not null check (cantidad > 0),
  venta_unit numeric not null,
  costo_real_unit numeric,
  costo_corrida_unit numeric,
  fecha_venta timestamptz not null,
  estado_externo text,
  creado_at timestamptz not null default now(),
  unique (origen, pedido_externo, sku_vendedor)
);
create index if not exists ventas_externas_fecha_idx on public.ventas_externas (fecha_venta);
alter table public.ventas_externas enable row level security;
