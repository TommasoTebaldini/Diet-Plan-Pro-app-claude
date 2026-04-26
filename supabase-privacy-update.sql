-- ============================================================
-- UPDATE: aggiunge signature_accepted a patient_documents
-- e aggiorna le policy RLS per permettere al dietista
-- di leggere lo stato della firma.
-- ============================================================

ALTER TABLE patient_documents
  ADD COLUMN IF NOT EXISTS signature_accepted BOOLEAN;

-- Consenti al dietista di leggere i propri documenti (per vedere lo stato firma)
DROP POLICY IF EXISTS "dietista legge propri documenti" ON patient_documents;
CREATE POLICY "dietista legge propri documenti" ON patient_documents
  FOR SELECT
  USING (dietitian_id = auth.uid());
