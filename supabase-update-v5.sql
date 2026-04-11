-- ============================================================
-- NutriPlan — SQL AGGIORNAMENTO v5
-- Esegui nel SQL Editor di Supabase
-- Aggiunge: meal_completions — traccia i pasti completati dal paziente
-- ============================================================

-- Tabella: pasti segnati come completati
create table if not exists meal_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  diet_meal_id uuid references diet_meals not null,
  date date not null,
  completed_at timestamptz default now(),
  unique(user_id, diet_meal_id, date)
);

alter table meal_completions enable row level security;

-- Il paziente può leggere e gestire i propri completamenti
drop policy if exists "paziente gestisce completamenti" on meal_completions;
create policy "paziente gestisce completamenti" on meal_completions
  for all using (auth.uid() = user_id);

-- Il dietista può leggere i completamenti dei propri pazienti
drop policy if exists "dietista legge completamenti" on meal_completions;
create policy "dietista legge completamenti" on meal_completions
  for select using (
    exists (
      select 1 from patient_dietitian pd
      where pd.patient_id = meal_completions.user_id
        and pd.dietitian_id = auth.uid()
    )
  );

-- ============================================================
-- NOTA SCHEMA: sostituti degli alimenti
-- Il campo diet_meals.foods è jsonb con struttura:
--   [{"name": "Pasta", "quantity": 80, "unit": "g"}]
--
-- Per aggiungere sostituti, estendi ogni alimento con:
--   [{"name": "Pasta", "quantity": 80, "unit": "g",
--     "substitutes": [{"name": "Riso", "quantity": 70, "unit": "g"}]}]
--
-- Nessuna modifica allo schema è necessaria: il campo foods
-- è già jsonb e l'app legge automaticamente i sostituti.
-- ============================================================
