-- RLS policies for food_logs table
-- Run this in the Supabase SQL editor

ALTER TABLE food_logs ENABLE ROW LEVEL SECURITY;

-- Allow users to SELECT their own logs
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'food_logs' AND policyname = 'food_logs_select_own'
  ) THEN
    CREATE POLICY food_logs_select_own ON food_logs
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

-- Allow users to INSERT their own logs
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'food_logs' AND policyname = 'food_logs_insert_own'
  ) THEN
    CREATE POLICY food_logs_insert_own ON food_logs
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Allow users to UPDATE their own logs
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'food_logs' AND policyname = 'food_logs_update_own'
  ) THEN
    CREATE POLICY food_logs_update_own ON food_logs
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Allow users to DELETE their own logs
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'food_logs' AND policyname = 'food_logs_delete_own'
  ) THEN
    CREATE POLICY food_logs_delete_own ON food_logs
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Allow dietitians to SELECT logs of their patients
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'food_logs' AND policyname = 'food_logs_dietitian_select'
  ) THEN
    CREATE POLICY food_logs_dietitian_select ON food_logs
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM patient_dietitian pd
          JOIN profiles p ON p.id = auth.uid()
          WHERE pd.patient_id = food_logs.user_id
            AND pd.dietitian_id = auth.uid()
            AND p.role = 'dietitian'
        )
      );
  END IF;
END $$;
