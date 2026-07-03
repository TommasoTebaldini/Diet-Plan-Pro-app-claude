-- Aggiunge il constraint UNIQUE necessario per l'upsert dei passi del pedometro
-- Eseguire in Supabase SQL Editor prima di usare la feature di sync passi
-- Nota: IF NOT EXISTS non è valido per ADD CONSTRAINT in PostgreSQL — usiamo un DO block
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'activity_logs_user_date_type_key'
  ) THEN
    ALTER TABLE activity_logs
      ADD CONSTRAINT activity_logs_user_date_type_key
      UNIQUE (user_id, date, activity_type);
  END IF;
END;
$$;
