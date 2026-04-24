-- ============================================================
-- Profili pubblici dei dietisti
-- Eseguire questo script sul progetto Supabase condiviso.
-- ============================================================

CREATE TABLE IF NOT EXISTS dietitian_profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dietitian_id    UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nome            TEXT NOT NULL DEFAULT '',
  cognome         TEXT DEFAULT '',
  titoli          TEXT DEFAULT '',        -- es. "Dietista, Laurea in Scienze della Nutrizione"
  descrizione     TEXT DEFAULT '',        -- presentazione libera del professionista
  citta           TEXT DEFAULT '',
  indirizzo       TEXT DEFAULT '',
  telefono        TEXT DEFAULT '',
  email_contatto  TEXT DEFAULT '',
  sito_web        TEXT DEFAULT '',
  visible         BOOLEAN DEFAULT TRUE,   -- se false il profilo non è mostrato ai pazienti
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row Level Security ──────────────────────────────────────

ALTER TABLE dietitian_profiles ENABLE ROW LEVEL SECURITY;

-- I dietisti gestiscono il proprio profilo
CREATE POLICY "dietitian_manage_own_profile" ON dietitian_profiles
  FOR ALL
  TO authenticated
  USING  (auth.uid() = dietitian_id)
  WITH CHECK (auth.uid() = dietitian_id);

-- Tutti gli utenti autenticati possono leggere i profili visibili
CREATE POLICY "read_visible_profiles" ON dietitian_profiles
  FOR SELECT
  TO authenticated
  USING (visible = TRUE);

-- ── Indice per la ricerca per città ────────────────────────

CREATE INDEX IF NOT EXISTS idx_dietitian_profiles_citta
  ON dietitian_profiles (lower(citta))
  WHERE visible = TRUE;
