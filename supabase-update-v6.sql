-- ============================================================
-- NutriPlan — SQL AGGIORNAMENTO v6
-- Esegui nel SQL Editor di Supabase
-- Aggiunge: custom_meals (pasti personalizzati), ricette (con ingredienti e macro auto)
-- ============================================================

-- Tabella: pasti personalizzati (combinazioni di alimenti)
create table if not exists custom_meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  name text not null,
  ingredients jsonb default '[]'::jsonb,  -- [{food_name, food_data, grams, kcal, proteins, carbs, fats}]
  peso_totale_g numeric default 100,
  kcal_total numeric default 0,
  proteins_total numeric default 0,
  carbs_total numeric default 0,
  fats_total numeric default 0,
  created_at timestamptz default now()
);

alter table custom_meals enable row level security;

drop policy if exists "utente gestisce propri pasti" on custom_meals;
create policy "utente gestisce propri pasti" on custom_meals
  for all using (auth.uid() = user_id);

-- Tabella: ricette (con ingredienti, calcolo macro automatico)
create table if not exists ricette (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  nome text not null,
  ingredienti jsonb default '[]'::jsonb,  -- [{food_name, food_data, grams, kcal, proteins, carbs, fats}]
  porzioni int default 1,
  peso_totale_g numeric default 100,
  kcal_100g numeric default 0,
  proteins_100g numeric default 0,
  carbs_100g numeric default 0,
  fats_100g numeric default 0,
  calorie_porzione numeric default 0,
  proteine numeric default 0,
  carboidrati numeric default 0,
  grassi numeric default 0,
  fibra numeric default 0,
  note text,
  created_at timestamptz default now()
);

alter table ricette enable row level security;

drop policy if exists "utente gestisce proprie ricette" on ricette;
create policy "utente gestisce proprie ricette" on ricette
  for all using (auth.uid() = user_id);

-- ============================================================
-- NOTE
-- custom_meals: pasti combinati (es. "Colazione tipo") composti da
--   più alimenti. Vengono mostrati nei risultati di ricerca alimenti
--   e possono essere aggiunti al diario come un unico elemento.
--
-- ricette: ricette con elenco ingredienti. I macro vengono calcolati
--   automaticamente dalla somma degli ingredienti, divisi per il
--   peso totale per ottenere i valori per 100g.
-- ============================================================
