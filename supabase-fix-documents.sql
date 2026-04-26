-- Fix: show all documents shared by dietitian
-- Run this in the Supabase SQL Editor
-- Fixes "documents not showing" by updating patient_id in clinical tables
-- and extending RLS policies to also allow access via cartella_id link.

-- ─── Step 1: populate patient_id for existing records ──────────────────────────
-- Records created in the dietitian portal before patient_id was added have
-- patient_id = NULL, which blocks the current "auth.uid() = patient_id" RLS.
-- We derive patient_id from the cartella_id → patient_dietitian relationship.

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='piani' AND table_schema='public') THEN
    UPDATE piani SET patient_id = pd.patient_id
    FROM patient_dietitian pd
    WHERE piani.cartella_id = pd.cartella_id AND piani.patient_id IS NULL;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='note_specialistiche' AND table_schema='public') THEN
    UPDATE note_specialistiche SET patient_id = pd.patient_id
    FROM patient_dietitian pd
    WHERE note_specialistiche.cartella_id = pd.cartella_id AND note_specialistiche.patient_id IS NULL;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='ncpt' AND table_schema='public') THEN
    UPDATE ncpt SET patient_id = pd.patient_id
    FROM patient_dietitian pd
    WHERE ncpt.cartella_id = pd.cartella_id AND ncpt.patient_id IS NULL;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='schede_valutazione' AND table_schema='public') THEN
    UPDATE schede_valutazione SET patient_id = pd.patient_id
    FROM patient_dietitian pd
    WHERE schede_valutazione.cartella_id = pd.cartella_id AND schede_valutazione.patient_id IS NULL;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='bia_records' AND table_schema='public') THEN
    UPDATE bia_records SET patient_id = pd.patient_id
    FROM patient_dietitian pd
    WHERE bia_records.cartella_id = pd.cartella_id AND bia_records.patient_id IS NULL;
  END IF;
END $$;


-- ─── Step 2: update RLS policies to allow access also via cartella_id ─────────
-- This is a fallback: even if patient_id is NULL, the patient can read records
-- whose cartella_id matches their patient_dietitian link.

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='piani' AND table_schema='public')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='piani' AND column_name='cartella_id' AND table_schema='public')
  THEN
    DROP POLICY IF EXISTS "paziente legge propri piani" ON piani;
    EXECUTE $p$
      CREATE POLICY "paziente legge propri piani" ON piani
        FOR SELECT USING (
          visible_to_patient = true
          AND (
            auth.uid() = patient_id
            OR EXISTS (
              SELECT 1 FROM patient_dietitian pd
              WHERE pd.patient_id = auth.uid() AND pd.cartella_id = piani.cartella_id
            )
          )
        )
    $p$;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='note_specialistiche' AND table_schema='public')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='note_specialistiche' AND column_name='cartella_id' AND table_schema='public')
  THEN
    DROP POLICY IF EXISTS "paziente legge proprie note" ON note_specialistiche;
    EXECUTE $p$
      CREATE POLICY "paziente legge proprie note" ON note_specialistiche
        FOR SELECT USING (
          visible_to_patient = true
          AND (
            auth.uid() = patient_id
            OR EXISTS (
              SELECT 1 FROM patient_dietitian pd
              WHERE pd.patient_id = auth.uid() AND pd.cartella_id = note_specialistiche.cartella_id
            )
          )
        )
    $p$;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='ncpt' AND table_schema='public')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ncpt' AND column_name='cartella_id' AND table_schema='public')
  THEN
    DROP POLICY IF EXISTS "paziente legge propri ncpt" ON ncpt;
    EXECUTE $p$
      CREATE POLICY "paziente legge propri ncpt" ON ncpt
        FOR SELECT USING (
          visible_to_patient = true
          AND (
            auth.uid() = patient_id
            OR EXISTS (
              SELECT 1 FROM patient_dietitian pd
              WHERE pd.patient_id = auth.uid() AND pd.cartella_id = ncpt.cartella_id
            )
          )
        )
    $p$;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='schede_valutazione' AND table_schema='public')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schede_valutazione' AND column_name='cartella_id' AND table_schema='public')
  THEN
    DROP POLICY IF EXISTS "paziente legge proprie schede" ON schede_valutazione;
    EXECUTE $p$
      CREATE POLICY "paziente legge proprie schede" ON schede_valutazione
        FOR SELECT USING (
          visible_to_patient = true
          AND (
            auth.uid() = patient_id
            OR EXISTS (
              SELECT 1 FROM patient_dietitian pd
              WHERE pd.patient_id = auth.uid() AND pd.cartella_id = schede_valutazione.cartella_id
            )
          )
        )
    $p$;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='bia_records' AND table_schema='public')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bia_records' AND column_name='cartella_id' AND table_schema='public')
  THEN
    DROP POLICY IF EXISTS "paziente legge propri bia" ON bia_records;
    EXECUTE $p$
      CREATE POLICY "paziente legge propri bia" ON bia_records
        FOR SELECT USING (
          visible_to_patient = true
          AND (
            auth.uid() = patient_id
            OR EXISTS (
              SELECT 1 FROM patient_dietitian pd
              WHERE pd.patient_id = auth.uid() AND pd.cartella_id = bia_records.cartella_id
            )
          )
        )
    $p$;
  END IF;
END $$;


-- ─── Step 3: ensure signature columns exist on patient_documents ───────────────
ALTER TABLE patient_documents ADD COLUMN IF NOT EXISTS requires_signature BOOLEAN DEFAULT FALSE;
ALTER TABLE patient_documents ADD COLUMN IF NOT EXISTS signed_at TIMESTAMPTZ;
ALTER TABLE patient_documents ADD COLUMN IF NOT EXISTS signature_data TEXT;
ALTER TABLE patient_documents ADD COLUMN IF NOT EXISTS signature_accepted BOOLEAN;

-- Index for fast lookup of unsigned docs per patient
CREATE INDEX IF NOT EXISTS idx_patient_documents_unsigned
  ON patient_documents (patient_id, requires_signature, signed_at)
  WHERE requires_signature = TRUE AND signed_at IS NULL;

-- Allow patient to UPDATE their own document (for signing)
DROP POLICY IF EXISTS "paziente firma documento" ON patient_documents;
CREATE POLICY "paziente firma documento" ON patient_documents
  FOR UPDATE USING (auth.uid() = patient_id)
  WITH CHECK (auth.uid() = patient_id);
