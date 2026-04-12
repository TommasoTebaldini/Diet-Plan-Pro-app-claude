-- ============================================================
-- NutriPlan — SQL AGGIORNAMENTO v10
-- Esegui nel SQL Editor di Supabase
-- Aggiunge: avatar_url, intolerances, food_preferences in profiles
--           storage bucket per foto profilo
-- ============================================================

-- Colonna URL avatar (foto profilo)
alter table profiles add column if not exists avatar_url text;

-- Colonna intolleranze e allergie (array JSON di stringhe)
alter table profiles add column if not exists intolerances jsonb default '[]'::jsonb;

-- Colonna preferenze alimentari (array JSON di stringhe)
alter table profiles add column if not exists food_preferences jsonb default '[]'::jsonb;

-- ============================================================
-- STORAGE: bucket per le foto profilo
-- Esegui queste istruzioni nella sezione Storage del dashboard Supabase
-- oppure via SQL come segue:
-- ============================================================

-- Crea il bucket "avatars" (pubblico, per permettere la visualizzazione diretta)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Policy: ogni utente può caricare/aggiornare solo la propria foto
drop policy if exists "utente carica avatar" on storage.objects;
create policy "utente carica avatar" on storage.objects
  for insert with check (
    bucket_id = 'avatars' and
    auth.uid()::text = split_part(name, '.', 1)
  );

drop policy if exists "utente aggiorna avatar" on storage.objects;
create policy "utente aggiorna avatar" on storage.objects
  for update using (
    bucket_id = 'avatars' and
    auth.uid()::text = split_part(name, '.', 1)
  );

-- Policy: chiunque può leggere gli avatar (bucket pubblico)
drop policy if exists "avatar pubblici" on storage.objects;
create policy "avatar pubblici" on storage.objects
  for select using (bucket_id = 'avatars');

-- Policy: ogni utente può eliminare il proprio avatar
drop policy if exists "utente elimina avatar" on storage.objects;
create policy "utente elimina avatar" on storage.objects
  for delete using (
    bucket_id = 'avatars' and
    auth.uid()::text = split_part(name, '.', 1)
  );
