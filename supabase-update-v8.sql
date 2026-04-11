-- ============================================================
-- NutriPlan — SQL AGGIORNAMENTO v8
-- Esegui nel SQL Editor di Supabase
-- Aggiunge: supporto media nella chat (foto, audio)
--           stato online/offline (last_seen_at in profiles)
--           storage bucket per i media della chat
-- ============================================================

-- ── 1. Colonne aggiuntive in chat_messages ──────────────────
ALTER TABLE chat_messages
  ADD COLUMN IF NOT EXISTS message_type text NOT NULL DEFAULT 'text'
    CHECK (message_type IN ('text', 'image', 'audio'));

ALTER TABLE chat_messages
  ADD COLUMN IF NOT EXISTS file_url text;

ALTER TABLE chat_messages
  ADD COLUMN IF NOT EXISTS file_name text;

-- Durata in secondi (per i messaggi vocali)
ALTER TABLE chat_messages
  ADD COLUMN IF NOT EXISTS duration_seconds numeric;

-- ── 2. Stato online in profiles ─────────────────────────────
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS last_seen_at timestamptz;

-- Abilita realtime su profiles (per aggiornamenti stato online)
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;

-- ── 3. Storage bucket per i media della chat ────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'chat-media',
  'chat-media',
  false,
  52428800,  -- 50 MB
  ARRAY[
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'audio/webm', 'audio/ogg', 'audio/mp4', 'audio/mpeg', 'audio/wav'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- RLS Storage: il paziente può caricare file nella propria cartella
DROP POLICY IF EXISTS "chat media upload" ON storage.objects;
CREATE POLICY "chat media upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'chat-media'
    AND auth.uid() IS NOT NULL
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- RLS Storage: il paziente e il suo dietista possono leggere i file
DROP POLICY IF EXISTS "chat media select" ON storage.objects;
CREATE POLICY "chat media select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'chat-media'
    AND (
      -- Il proprietario del file (cartella = patient_id)
      auth.uid()::text = (storage.foldername(name))[1]
      -- Il dietista collegato al paziente
      OR EXISTS (
        SELECT 1 FROM patient_dietitian pd
        WHERE pd.patient_id::text = (storage.foldername(name))[1]
          AND pd.dietitian_id = auth.uid()
      )
    )
  );

-- RLS Storage: solo il proprietario può eliminare i propri file
DROP POLICY IF EXISTS "chat media delete" ON storage.objects;
CREATE POLICY "chat media delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'chat-media'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================
-- NOTE
-- 1. message_type: 'text' (default), 'image', 'audio'
-- 2. file_url: URL firmato (signed URL) generato dall'app al momento
--    dell'upload, valido 10 anni. Viene salvato direttamente nel campo.
-- 3. last_seen_at: aggiornato dall'app ogni 60s mentre l'utente è
--    sulla pagina chat. Dietista "online" se last_seen_at < 5 minuti.
-- 4. Il bucket 'chat-media' è privato. I file sono accessibili solo
--    tramite signed URL generato dall'app.
-- ============================================================
