-- Tabla speakers para gestión desde el dashboard
create table if not exists speakers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  role        text,                          -- 'Host', 'Co-host' o null
  title       text not null,                 -- bio corta
  topic       text not null,                 -- tema en el Bootcamp
  pillar      text check (pillar in ('Mentalidad', 'Velocidad', 'Entorno')),
  ig          text,                          -- handle sin @
  photo_url   text,                          -- URL de la foto (Supabase Storage)
  featured    boolean not null default false,
  "order"     integer not null default 0,    -- orden de aparición en la landing
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists speakers_order_idx on speakers ("order");

create or replace function update_speakers_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists speakers_updated_at on speakers;
create trigger speakers_updated_at
  before update on speakers
  for each row execute function update_speakers_updated_at();

-- Storage bucket para fotos de speakers
insert into storage.buckets (id, name, public)
values ('speakers', 'speakers', true)
on conflict (id) do nothing;

-- Policy: lectura pública
create policy "speakers_public_read"
  on storage.objects for select
  using (bucket_id = 'speakers');

-- Policy: escritura solo autenticado o service role (API routes lo manejan)
create policy "speakers_service_write"
  on storage.objects for insert
  using (bucket_id = 'speakers');
