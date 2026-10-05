-- De dónde llegó una conversación de WhatsApp (página del sitio · fuente, o anuncio de Meta). Se guarda la primera vez.
alter table public.chats_control add column if not exists origen text;
notify pgrst, 'reload schema';
