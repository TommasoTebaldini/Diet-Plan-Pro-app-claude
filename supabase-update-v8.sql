-- ============================================================
-- NutriPlan — SQL AGGIORNAMENTO v8
-- Esegui nel SQL Editor di Supabase
-- Aggiunge: activity_logs (tracciamento attività fisica)
-- ============================================================

-- Tabella: registrazioni attività fisica
create table if not exists activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  date date not null default current_date,
  activity_type text not null,
  duration_minutes integer not null check (duration_minutes > 0),
  calories_burned integer,
  steps integer,
  notes text,
  created_at timestamptz default now()
);

alter table activity_logs enable row level security;

drop policy if exists "utente gestisce proprie attività" on activity_logs;
create policy "utente gestisce proprie attività" on activity_logs
  for all using (auth.uid() = user_id);

-- Indice per query frequenti (per data e utente)
create index if not exists activity_logs_user_date_idx on activity_logs (user_id, date desc);

-- ============================================================
-- ESEMPIO
-- insert into activity_logs (activity_type, duration_minutes, calories_burned, steps, notes)
-- values ('corsa', 30, 320, 4200, 'Corsa mattutina al parco');
-- ============================================================
