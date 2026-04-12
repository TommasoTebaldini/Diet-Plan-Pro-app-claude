-- ============================================================
-- NutriPlan — SQL AGGIORNAMENTO v11
-- Esegui nel SQL Editor di Supabase
-- Aggiunge: misurazioni corporee, foto progressi, bucket storage
-- ============================================================

-- Tabella: misurazioni corporee
create table if not exists body_measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  date date not null,
  waist_cm numeric,
  hips_cm numeric,
  arm_cm numeric,
  thigh_cm numeric,
  chest_cm numeric,
  notes text,
  created_at timestamptz default now(),
  unique(user_id, date)
);

alter table body_measurements enable row level security;

drop policy if exists "utenti vedono le proprie misurazioni" on body_measurements;
create policy "utenti vedono le proprie misurazioni" on body_measurements
  for all using (auth.uid() = user_id);

-- Tabella: metadati foto progressi
create table if not exists progress_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  date date not null,
  photo_type text default 'progresso', -- 'prima', 'dopo', 'progresso'
  storage_path text not null,
  notes text,
  created_at timestamptz default now()
);

alter table progress_photos enable row level security;

drop policy if exists "utenti vedono le proprie foto" on progress_photos;
create policy "utenti vedono le proprie foto" on progress_photos
  for all using (auth.uid() = user_id);

-- ============================================================
-- Storage bucket per le foto progressi
-- Eseguire separatamente se necessario
-- ============================================================

insert into storage.buckets (id, name, public)
values ('progress-photos', 'progress-photos', false)
on conflict (id) do nothing;

-- Policy storage: ogni utente gestisce solo la propria cartella
drop policy if exists "utenti gestiscono le proprie foto progress" on storage.objects;
create policy "utenti gestiscono le proprie foto progress" on storage.objects
  for all using (
    bucket_id = 'progress-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
