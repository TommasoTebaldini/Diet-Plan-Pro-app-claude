-- Aggiunge il constraint UNIQUE necessario per l'upsert dei passi del pedometro
-- Eseguire in Supabase SQL Editor prima di usare la feature di sync passi
ALTER TABLE activity_logs
  ADD CONSTRAINT IF NOT EXISTS activity_logs_user_date_type_key
  UNIQUE (user_id, date, activity_type);
