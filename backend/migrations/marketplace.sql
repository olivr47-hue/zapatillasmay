-- Marketplace: otros vendedores publican sus productos en zapatillasmay.mx, el negocio cobra todo y gana una comisión por par.
-- Tablas propias (no se mezclan con productos/inventario/pedidos del negocio): así no afectan sus finanzas, análisis ni integraciones.
-- Todas con RLS activado y sin políticas: solo el backend (service role) las toca.

create table if not exists public.mp_vendedores (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  password_hash text not null,
  nombre_tienda text not null,
  slug text not null,
  nombre_contacto text,
  telefono text,
  ciudad text,
  estado_region text,
  descripcion text,
  banco text,
  clabe text,
  titular text,
  comision_por_par numeric not null default 20,
  estado text not null default 'pendiente' check (estado in ('pendiente','activo','suspendido')),
  notas_admin text,
  reset_token_hash text,
  reset_token_exp bigint,
  ultimo_login timestamptz,
  aprobado_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index if not exists mp_vendedores_email_uq on public.mp_vendedores (lower(email));
create unique index if not exists mp_vendedores_slug_uq on public.mp_vendedores (slug);

create table if not exists public.mp_productos (
  id uuid primary key default gen_random_uuid(),
  vendedor_id uuid not null references public.mp_vendedores(id) on delete cascade,
  nombre text not null,
  slug text not null,
  descripcion text,
  categoria text,
  material text,
  precio numeric not null check (precio > 0),           -- lo que paga el cliente por par (sin envío)
  envio numeric not null default 150 check (envio >= 0), -- envío por pedido: va completo al vendedor, que es quien envía
  peso_gramos integer,
  imagenes text[] not null default '{}',
  estado text not null default 'borrador' check (estado in ('borrador','pendiente','publicado','rechazado','pausado')),
  motivo_rechazo text,
  publicado_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists mp_productos_slug_uq on public.mp_productos (slug);
create index if not exists mp_productos_vendedor_idx on public.mp_productos (vendedor_id);
create index if not exists mp_productos_estado_idx on public.mp_productos (estado);

create table if not exists public.mp_variantes (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid not null references public.mp_productos(id) on delete cascade,
  color text not null default '',
  talla text not null default '',
  stock integer not null default 0 check (stock >= 0),
  unique (producto_id, color, talla)
);

create table if not exists public.mp_liquidaciones (
  id uuid primary key default gen_random_uuid(),
  vendedor_id uuid not null references public.mp_vendedores(id) on delete cascade,
  monto numeric not null,
  referencia text,
  nota text,
  creado_por text,
  created_at timestamptz not null default now()
);

create table if not exists public.mp_pedidos (
  id uuid primary key default gen_random_uuid(),
  numero bigint generated always as identity,
  vendedor_id uuid not null references public.mp_vendedores(id),
  cliente_nombre text not null,
  cliente_email text not null,
  cliente_telefono text,
  direccion text,
  ciudad text,
  estado_region text,
  cp text,
  notas text,
  subtotal numeric not null,
  envio numeric not null default 0,
  total numeric not null,
  comision numeric not null default 0,         -- lo que gana el negocio
  neto_vendedor numeric not null default 0,    -- lo que le toca al vendedor: subtotal − comisión + envío
  status text not null default 'pendiente_pago' check (status in ('pendiente_pago','pagado','enviado','entregado','cancelado')),
  mp_preference_id text,
  mp_payment_id text,
  paqueteria text,
  guia text,
  liquidacion_id uuid references public.mp_liquidaciones(id),
  created_at timestamptz not null default now(),
  pagado_at timestamptz,
  enviado_at timestamptz,
  entregado_at timestamptz
);
create index if not exists mp_pedidos_vendedor_idx on public.mp_pedidos (vendedor_id, status);

create table if not exists public.mp_pedido_items (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references public.mp_pedidos(id) on delete cascade,
  producto_id uuid references public.mp_productos(id) on delete set null,
  variante_id uuid references public.mp_variantes(id) on delete set null,
  nombre text not null,
  color text,
  talla text,
  cantidad integer not null check (cantidad > 0),
  precio_unitario numeric not null,
  comision_unitaria numeric not null default 0
);
create index if not exists mp_pedido_items_pedido_idx on public.mp_pedido_items (pedido_id);

alter table public.mp_vendedores enable row level security;
alter table public.mp_productos enable row level security;
alter table public.mp_variantes enable row level security;
alter table public.mp_liquidaciones enable row level security;
alter table public.mp_pedidos enable row level security;
alter table public.mp_pedido_items enable row level security;

-- Extras (aplicado después):
alter table public.mp_vendedores add column if not exists cargo_pago_pct numeric not null default 0 check (cargo_pago_pct >= 0 and cargo_pago_pct <= 15);

create or replace function public.mp_descontar_stock(p_variante uuid, p_cantidad integer)
returns integer language sql as $$
  update public.mp_variantes set stock = greatest(stock - p_cantidad, 0) where id = p_variante returning stock;
$$;

create or replace function public.mp_devolver_stock(p_variante uuid, p_cantidad integer)
returns integer language sql as $$
  update public.mp_variantes set stock = stock + p_cantidad where id = p_variante returning stock;
$$;

-- Producto del vendedor completo (como en Productos del panel): detalles técnicos, video y fotos/color por color
alter table public.mp_productos
  add column if not exists subcategoria text, add column if not exists material_suela text, add column if not exists forro text,
  add column if not exists horma text, add column if not exists altura_tacon numeric, add column if not exists tipo_tacon text,
  add column if not exists ocasion text[] not null default '{}', add column if not exists ajuste_empeine text,
  add column if not exists recomendacion_talla text, add column if not exists temporada text, add column if not exists video_url text;
alter table public.mp_variantes add column if not exists color_hex text, add column if not exists imagenes text[] not null default '{}';
