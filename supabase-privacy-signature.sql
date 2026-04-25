-- Add signature support to patient_documents
-- Run this in the Supabase SQL editor

ALTER TABLE patient_documents
  ADD COLUMN IF NOT EXISTS requires_signature BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS signed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS signature_data TEXT;

-- Index for fast lookup of unsigned docs per patient
CREATE INDEX IF NOT EXISTS idx_patient_documents_unsigned
  ON patient_documents (patient_id, requires_signature, signed_at)
  WHERE requires_signature = TRUE AND signed_at IS NULL;
