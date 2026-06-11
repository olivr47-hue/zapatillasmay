-- Tabla de reseñas de productos por clientes verificados
create table if not exists resenas_producto (
  id            uuid primary key default gen_random_uuid(),
  producto_id   uuid not null references productos(id) on delete cascade,
  pedido_id     uuid not null references pedidos(id) on delete cascade,
  calificacion  smallint not null check (calificacion between 1 and 5),
  comentario    text,
  nombre_cliente text,
  aprobada      boolean not null default true,
  created_at    timestamptz not null default now(),
  unique (producto_id, pedido_id)   -- un cliente no puede reseñar el mismo producto dos veces por pedido
);

-- Índices para queries frecuentes
create index if not exists idx_resenas_producto_id on resenas_producto(producto_id);
create index if not exists idx_resenas_aprobada   on resenas_producto(aprobada);

-- Row Level Security: solo el backend (service role) puede insertar/actualizar
alter table resenas_producto enable row level security;

-- Lectura pública de reseñas aprobadas
create policy "read_aprobadas" on resenas_producto
  for select using (aprobada = true);

-- Solo service role puede insertar, actualizar y eliminar
create policy "service_write" on resenas_producto
  for all using (auth.role() = 'service_role');
