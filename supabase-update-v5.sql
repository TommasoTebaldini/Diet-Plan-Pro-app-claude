-- ============================================================
-- NutriPlan — SQL AGGIORNAMENTO v5
-- Esegui nel SQL Editor di Supabase
-- Aggiunge: tabella appuntamenti (visite con il dietista)
-- ============================================================

-- Tabella: appuntamenti / visite
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references auth.users not null,
  dietitian_id uuid references auth.users,
  title text not null default 'Visita dietistica',
  appointment_date timestamptz not null,
  notes text,
  created_at timestamptz default now()
);

alter table appointments enable row level security;

-- Il paziente può vedere i propri appuntamenti
drop policy if exists "paziente vede i propri appuntamenti" on appointments;
create policy "paziente vede i propri appuntamenti" on appointments
  for select using (auth.uid() = patient_id);

-- Il dietista può gestire gli appuntamenti dei propri pazienti
drop policy if exists "dietista gestisce appuntamenti" on appointments;
create policy "dietista gestisce appuntamenti" on appointments
  for all using (
    auth.uid() = dietitian_id or
    exists (
      select 1 from patient_dietitian pd
      where pd.patient_id = appointments.patient_id
        and pd.dietitian_id = auth.uid()
    )
  );

-- ============================================================
-- ESEMPIO: come il dietista crea un appuntamento
-- insert into appointments (patient_id, dietitian_id, title, appointment_date, notes)
-- values ('UUID-PAZIENTE', auth.uid(), 'Visita di controllo', '2025-05-15 10:00:00+02', 'Portare diario alimentare');
-- ============================================================
