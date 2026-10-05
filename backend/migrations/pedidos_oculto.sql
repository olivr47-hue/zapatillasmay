-- Pedidos repetidos por error: se quitan de la vista (panel y portal) sin borrarlos ni cancelarlos.
alter table public.pedidos add column if not exists oculto boolean not null default false;
notify pgrst, 'reload schema';
