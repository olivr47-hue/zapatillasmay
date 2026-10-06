-- Conversaciones: archivar (ocultar) un chat; si la clienta vuelve a escribir reaparece
alter table public.chats_control add column if not exists archivado boolean not null default false;
alter table public.chats_control add column if not exists archivado_at timestamptz;
notify pgrst, 'reload schema';
