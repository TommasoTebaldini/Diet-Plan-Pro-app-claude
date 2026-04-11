-- ============================================================
-- NutriPlan — SQL AGGIORNAMENTO v3
-- Esegui nel SQL Editor di Supabase
-- Aggiunge: colonna meal_time in food_logs
-- ============================================================

-- Aggiunge orario del pasto alla tabella food_logs
-- (già parzialmente supportato tramite food_data jsonb,
--  questa colonna permette query e filtri diretti)
alter table food_logs add column if not exists meal_time text;
