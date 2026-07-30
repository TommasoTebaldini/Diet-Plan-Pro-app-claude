-- Aggiunge passi e frequenza cardiaca a daily_wellness, riusando la stessa
-- riga/chiave (user_id, date) già usata per sonno/umore/energia — così il
-- dietista vede tutti i dati "wearable" del paziente (passi, FC, sonno) in
-- un'unica query già esistente (vedi chat.html, WELL_BASE) invece di una
-- tabella nuova. Scritti da HealthSyncPage.jsx insieme al sonno.
alter table daily_wellness add column if not exists steps integer check (steps >= 0);
alter table daily_wellness add column if not exists heart_rate_avg integer check (heart_rate_avg > 0 and heart_rate_avg < 300);
