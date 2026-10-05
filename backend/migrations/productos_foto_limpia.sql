-- Foto "limpia" del zapato (sin modelo) elegida en el panel; se usa en listados, guias y estilo Solo la foto
alter table public.productos add column if not exists foto_limpia text;
notify pgrst, 'reload schema';
