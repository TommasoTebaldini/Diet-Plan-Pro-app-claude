-- ============================================================
-- NutriPlan — SQL AGGIORNAMENTO v5
-- Esegui nel SQL Editor di Supabase
-- Aggiunge: colonna visible_to_patient nelle tabelle cliniche
--           (piani, ncpt, schede_valutazione, bia_records,
--            note_specialistiche) utilizzate dal portale dietista
-- ============================================================

ALTER TABLE piani
  ADD COLUMN IF NOT EXISTS visible_to_patient BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE ncpt
  ADD COLUMN IF NOT EXISTS visible_to_patient BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE schede_valutazione
  ADD COLUMN IF NOT EXISTS visible_to_patient BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE bia_records
  ADD COLUMN IF NOT EXISTS visible_to_patient BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE note_specialistiche
  ADD COLUMN IF NOT EXISTS visible_to_patient BOOLEAN NOT NULL DEFAULT TRUE;
