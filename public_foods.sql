-- Run this once in the Supabase SQL editor to create the shared foods table.
-- This table is written by the dietitian site (NutriPlan-Pro) and read by the patient app.

create table if not exists public_foods (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    text,
  kcal_100g   numeric,
  proteins_100g numeric,
  carbs_100g  numeric,
  fats_100g   numeric,
  fiber_100g  numeric,
  sugar_100g  numeric,
  fat_sat_100g numeric,
  source_id   uuid,           -- links to alimenti_custom.id for update/delete sync
  created_by  uuid references auth.users(id),
  created_at  timestamptz default now()
);

alter table public_foods enable row level security;

-- Indice per ricerca ILIKE per nome (searchPublicFoods)
create index if not exists idx_public_foods_name on public_foods(name text_pattern_ops);

-- Patients (any authenticated user) can read all shared foods
create policy "All authenticated users can read public_foods"
  on public_foods for select to authenticated using (true);

-- Any authenticated user (dietitians) can add foods
create policy "Authenticated users can insert public_foods"
  on public_foods for insert to authenticated with check (true);

-- Only the creator can update their own foods
create policy "Owners can update own public_foods"
  on public_foods for update to authenticated
  using (auth.uid() = created_by);

-- Only the creator can delete their own foods
create policy "Owners can delete own public_foods"
  on public_foods for delete to authenticated
  using (auth.uid() = created_by);
