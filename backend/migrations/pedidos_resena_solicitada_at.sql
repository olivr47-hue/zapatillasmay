-- Marca cuándo se le pidió reseña al cliente de un pedido (una sola vez por pedido).
alter table public.pedidos add column if not exists resena_solicitada_at timestamptz;
notify pgrst, 'reload schema';
