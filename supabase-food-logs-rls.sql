-- Fix food_logs: reset RLS policies and ensure all columns exist
-- Run this in the Supabase SQL Editor to fix 400 errors on food_logs

-- 1. Ensure all required columns exist (safe to run multiple times)
ALTER TABLE food_logs ADD COLUMN IF NOT EXISTS meal_time text;
ALTER TABLE food_logs ADD COLUMN IF NOT EXISTS food_data jsonb;

-- 2. Enable RLS (idempotent)
ALTER TABLE food_logs ENABLE ROW LEVEL SECURITY;

-- 3. Drop ALL existing policies on food_logs to eliminate conflicts
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE tablename = 'food_logs' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON food_logs', pol.policyname);
  END LOOP;
END $$;

-- 4. Recreate clean, non-overlapping policies

-- Users can read/write/delete their own rows
CREATE POLICY "food_logs_own" ON food_logs
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Dietitians can read their patients' logs
CREATE POLICY "food_logs_dietitian_read" ON food_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM patient_dietitian pd
      WHERE pd.patient_id = food_logs.user_id
        AND pd.dietitian_id = auth.uid()
    )
  );
