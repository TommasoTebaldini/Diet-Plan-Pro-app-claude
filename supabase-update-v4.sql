-- ============================================================
-- NutriPlan — SQL AGGIORNAMENTO v4
-- Esegui nel SQL Editor di Supabase (stesso progetto del sito dietista)
-- Aggiunge: colonne first_name/last_name in profiles
--           trigger auto-creazione profilo alla registrazione
-- ============================================================

-- Aggiunge colonne nome/cognome se non presenti
alter table profiles add column if not exists full_name text;
alter table profiles add column if not exists first_name text;
alter table profiles add column if not exists last_name text;

-- Aggiorna first_name/last_name dai profili esistenti che hanno solo full_name
update profiles
set
  first_name = split_part(full_name, ' ', 1),
  last_name = case
    when full_name like '% %' then substring(full_name from position(' ' in full_name) + 1)
    else ''
  end
where
  (first_name is null or first_name = '')
  and full_name is not null
  and full_name <> '';

-- ============================================================
-- Trigger: crea automaticamente una riga in profiles
-- quando un utente si registra (sia dall'app paziente che dal sito)
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    first_name,
    last_name,
    role
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce(new.raw_user_meta_data->>'first_name', split_part(coalesce(new.raw_user_meta_data->>'full_name', ''), ' ', 1)),
    coalesce(new.raw_user_meta_data->>'last_name',  case
      when coalesce(new.raw_user_meta_data->>'full_name', '') like '% %'
        then substring(coalesce(new.raw_user_meta_data->>'full_name', '') from position(' ' in coalesce(new.raw_user_meta_data->>'full_name', '')) + 1)
      else ''
    end),
    coalesce(new.raw_user_meta_data->>'role', 'patient')
  )
  on conflict (id) do update set
    full_name  = coalesce(excluded.full_name,  profiles.full_name),
    first_name = coalesce(excluded.first_name, profiles.first_name),
    last_name  = coalesce(excluded.last_name,  profiles.last_name);
  return new;
end;
$$;

-- Ricrea il trigger (drop se esiste già, poi ricrea)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- RLS: assicura che ogni paziente possa leggere/aggiornare
-- il proprio profilo (necessario se la policy non esistesse)
-- ============================================================
alter table profiles enable row level security;

drop policy if exists "utenti vedono il proprio profilo" on profiles;
create policy "utenti vedono il proprio profilo" on profiles
  for select using (auth.uid() = id);

drop policy if exists "utenti aggiornano il proprio profilo" on profiles;
create policy "utenti aggiornano il proprio profilo" on profiles
  for update using (auth.uid() = id);

drop policy if exists "utenti inseriscono il proprio profilo" on profiles;
create policy "utenti inseriscono il proprio profilo" on profiles
  for insert with check (auth.uid() = id);

-- Il dietista può leggere i profili dei propri pazienti
drop policy if exists "dietista legge profili pazienti" on profiles;
create policy "dietista legge profili pazienti" on profiles
  for select using (
    exists (
      select 1 from patient_dietitian pd
      where pd.patient_id = profiles.id
        and pd.dietitian_id = auth.uid()
    )
    or auth.uid() = id
  );
