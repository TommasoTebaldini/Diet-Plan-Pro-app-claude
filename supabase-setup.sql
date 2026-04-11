-- ============================================================
-- NutriPlan Paziente — Script SQL Supabase
-- Esegui questo script nel SQL Editor del tuo progetto Supabase
-- ============================================================

-- Tabella: diete prescritte dal dietista
create table if not exists patient_diets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text,
  kcal_target int,
  protein_target int,
  carbs_target int,
  fats_target int,
  meals_count int default 5,
  duration_weeks int,
  notes text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Tabella: pasti della dieta
create table if not exists diet_meals (
  id uuid primary key default gen_random_uuid(),
  diet_id uuid references patient_diets not null,
  meal_type text,  -- colazione, spuntino_mattina, pranzo, spuntino_pomeriggio, cena
  day_number int,  -- 1=lunedi ... 7=domenica, null = ogni giorno
  meal_order int,
  description text,
  notes text,
  kcal int,
  proteins numeric,
  carbs numeric,
  fats numeric,
  foods jsonb default '[]'::jsonb  -- array di {name, quantity, unit}
);

-- Tabella: diario alimentare
create table if not exists food_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  date date not null,
  meal_type text,
  food_name text,
  grams numeric,
  kcal int,
  proteins numeric,
  carbs numeric,
  fats numeric,
  food_data jsonb,
  created_at timestamptz default now()
);

-- Tabella: totali giornalieri (calcolati dall'app)
create table if not exists daily_logs (
  user_id uuid references auth.users not null default auth.uid(),
  date date not null,
  kcal int default 0,
  proteins numeric default 0,
  carbs numeric default 0,
  fats numeric default 0,
  primary key (user_id, date)
);

-- Tabella: registro acqua
create table if not exists water_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  date date not null,
  amount_ml int not null,
  created_at timestamptz default now()
);

-- Tabella: alimenti personalizzati
create table if not exists custom_foods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  name text not null,
  brand text,
  kcal_100g numeric,
  proteins_100g numeric,
  carbs_100g numeric,
  fats_100g numeric,
  fiber_100g numeric,
  source text default 'custom',  -- 'custom' o 'openfoodfacts'
  created_at timestamptz default now()
);

-- ============================================================
-- Row Level Security (RLS) — ogni paziente vede solo i suoi dati
-- ============================================================

alter table patient_diets enable row level security;
alter table diet_meals enable row level security;
alter table food_logs enable row level security;
alter table daily_logs enable row level security;
alter table water_logs enable row level security;
alter table custom_foods enable row level security;

-- Policy food_logs
drop policy if exists "utenti vedono i propri dati" on food_logs;
create policy "utenti vedono i propri dati" on food_logs
  for all using (auth.uid() = user_id);

-- Policy daily_logs
drop policy if exists "utenti vedono i propri dati" on daily_logs;
create policy "utenti vedono i propri dati" on daily_logs
  for all using (auth.uid() = user_id);

-- Policy water_logs
drop policy if exists "utenti vedono i propri dati" on water_logs;
create policy "utenti vedono i propri dati" on water_logs
  for all using (auth.uid() = user_id);

-- Policy custom_foods
drop policy if exists "utenti vedono i propri dati" on custom_foods;
create policy "utenti vedono i propri dati" on custom_foods
  for all using (auth.uid() = user_id);

-- Policy patient_diets: il paziente legge la propria
drop policy if exists "pazienti leggono la propria dieta" on patient_diets;
create policy "pazienti leggono la propria dieta" on patient_diets
  for select using (auth.uid() = user_id);

-- Policy patient_diets: il dietista può creare/modificare le diete
-- NOTA: raffina aggiungendo un campo "role" nel profilo utente
drop policy if exists "dietista gestisce diete" on patient_diets;
create policy "dietista gestisce diete" on patient_diets
  for all using (true);  -- temporaneo, raffina con ruoli

-- Policy diet_meals: paziente vede i pasti della propria dieta
drop policy if exists "accesso pasti dieta propria" on diet_meals;
create policy "accesso pasti dieta propria" on diet_meals
  for select using (
    exists (
      select 1 from patient_diets pd
      where pd.id = diet_id and pd.user_id = auth.uid()
    )
  );

-- Accesso in scrittura ai pasti per il dietista
drop policy if exists "dietista gestisce pasti" on diet_meals;
create policy "dietista gestisce pasti" on diet_meals
  for all using (true);  -- temporaneo, raffina con ruoli

-- ============================================================
-- NOTA PER IL DIETISTA
-- Per assegnare una dieta a un paziente, inserisci così:
-- 
-- insert into patient_diets (user_id, name, kcal_target, ...)
-- values ('UUID-DEL-PAZIENTE', 'Piano dimagrimento', 1800, ...);
--
-- L'UUID del paziente si trova in Supabase → Authentication → Users
-- ============================================================
