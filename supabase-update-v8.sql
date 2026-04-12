-- ============================================================
-- NutriPlan — SQL AGGIORNAMENTO v8
-- Esegui nel SQL Editor di Supabase
-- Aggiunge: colonne energia e qualità del sonno a daily_wellness
-- ============================================================

alter table daily_wellness add column if not exists energy int check (energy between 1 and 5);
alter table daily_wellness add column if not exists sleep_quality int check (sleep_quality between 1 and 5);
