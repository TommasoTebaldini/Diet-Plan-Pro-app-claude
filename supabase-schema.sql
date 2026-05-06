-- ============================================================
-- NutriPlan / Diet Plan Pro — Schema SQL Supabase COMPLETO
-- Esegui questo script nel SQL Editor del tuo progetto Supabase.
-- È l'UNICO file SQL del progetto: contiene tabelle, colonne,
-- indici, RLS, trigger, storage e realtime.
-- Idempotente: sicuro da rieseguire su DB già esistente.
-- ============================================================


-- ============================================================
-- TABELLE PRINCIPALI
-- ============================================================

-- Diete prescritte dal dietista
create table if not exists patient_diets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text,
  kcal_target int,
  protein_target int,
  carbs_target int,
  fats_target int,
  meals_count int default 5,
  duration_weeks int,
  notes text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Pasti della dieta
create table if not exists diet_meals (
  id uuid primary key default gen_random_uuid(),
  diet_id uuid references patient_diets not null,
  meal_type text,  -- colazione, spuntino_mattina, pranzo, spuntino_pomeriggio, cena
  day_number int,  -- 1=lunedi ... 7=domenica, null = ogni giorno
  meal_order int,
  description text,
  notes text,
  kcal int,
  proteins numeric,
  carbs numeric,
  fats numeric,
  foods jsonb default '[]'::jsonb  -- [{name, quantity, unit, substitutes:[...]}]
);

-- Diario alimentare
create table if not exists food_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  date date not null,
  meal_type text,
  meal_time text,
  food_name text,
  grams numeric,
  kcal int,
  proteins numeric,
  carbs numeric,
  fats numeric,
  food_data jsonb,
  created_at timestamptz default now()
);

-- Totali giornalieri (calcolati dall'app)
create table if not exists daily_logs (
  user_id uuid references auth.users not null default auth.uid(),
  date date not null,
  kcal int default 0,
  proteins numeric default 0,
  carbs numeric default 0,
  fats numeric default 0,
  primary key (user_id, date)
);

-- Registro acqua
create table if not exists water_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  date date not null,
  amount_ml int not null,
  created_at timestamptz default now()
);

-- Alimenti personalizzati
create table if not exists custom_foods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  name text not null,
  brand text,
  kcal_100g numeric,
  proteins_100g numeric,
  carbs_100g numeric,
  fats_100g numeric,
  fiber_100g numeric,
  source text default 'custom',  -- 'custom' o 'openfoodfacts'
  created_at timestamptz default now()
);

-- Cartelle pazienti
create table if not exists cartelle (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cognome text not null,
  codice_fiscale text unique,
  created_at timestamptz default now()
);

-- Relazione paziente ↔ dietista
create table if not exists patient_dietitian (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references auth.users not null,
  dietitian_id uuid references auth.users not null,
  cartella_id uuid references cartelle(id) on delete set null,
  created_at timestamptz default now(),
  unique(patient_id, dietitian_id)
);

-- Chat (messaggi testo, immagini, audio)
create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references auth.users not null,
  sender_id uuid references auth.users not null,
  sender_role text not null check (sender_role in ('patient', 'dietitian')),
  content text not null,
  message_type text not null default 'text' check (message_type in ('text', 'image', 'audio')),
  file_url text,
  file_name text,
  duration_seconds numeric,
  read_at timestamptz,
  created_at timestamptz default now()
);

-- Documenti condivisi dal dietista
create table if not exists patient_documents (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references auth.users not null,
  dietitian_id uuid references auth.users not null,
  title text not null,
  type text default 'document',  -- 'diet','advice','recipe','document','education','privacy'
  content text,
  file_url text,
  tags text[] default '{}',
  visible boolean default true,
  published_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Progressi peso
create table if not exists weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  date date not null,
  weight_kg numeric not null,
  created_at timestamptz default now(),
  unique(user_id, date)
);

-- Wellness giornaliero (umore, sintomi, energia, sonno, note)
create table if not exists daily_wellness (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  date date not null,
  mood int check (mood between 1 and 5),
  energy int check (energy between 1 and 5),
  sleep_quality int check (sleep_quality between 1 and 5),
  sleep_hours numeric check (sleep_hours >= 0 and sleep_hours <= 24),
  sleep_restedness int check (sleep_restedness between 1 and 5),
  symptoms text[] default '{}',
  notes text,
  created_at timestamptz default now(),
  unique(user_id, date)
);

-- Pasti personalizzati (combinazioni di alimenti)
create table if not exists custom_meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  name text not null,
  ingredients jsonb default '[]'::jsonb,
  peso_totale_g numeric default 100,
  kcal_total numeric default 0,
  proteins_total numeric default 0,
  carbs_total numeric default 0,
  fats_total numeric default 0,
  created_at timestamptz default now()
);

-- Ricette (con ingredienti e macro auto-calcolati)
create table if not exists ricette (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  nome text not null,
  ingredienti jsonb default '[]'::jsonb,
  porzioni int default 1,
  peso_totale_g numeric default 100,
  kcal_100g numeric default 0,
  proteins_100g numeric default 0,
  carbs_100g numeric default 0,
  fats_100g numeric default 0,
  calorie_porzione numeric default 0,
  proteine numeric default 0,
  carboidrati numeric default 0,
  grassi numeric default 0,
  fibra numeric default 0,
  note text,
  created_at timestamptz default now()
);

-- Appuntamenti / visite con il dietista
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references auth.users not null,
  dietitian_id uuid references auth.users,
  title text not null default 'Visita dietistica',
  appointment_date timestamptz not null,
  notes text,
  created_at timestamptz default now()
);

-- Registrazioni attività fisica
create table if not exists activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  date date not null default current_date,
  activity_type text not null,
  duration_minutes integer not null check (duration_minutes > 0),
  calories_burned integer,
  steps integer,
  notes text,
  created_at timestamptz default now()
);

-- Pasti completati dal paziente
create table if not exists meal_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  diet_meal_id uuid references diet_meals not null,
  date date not null,
  completed_at timestamptz default now(),
  unique(user_id, diet_meal_id, date)
);

-- Misurazioni corporee
create table if not exists body_measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  date date not null,
  waist_cm numeric,
  hips_cm numeric,
  arm_cm numeric,
  thigh_cm numeric,
  chest_cm numeric,
  notes text,
  created_at timestamptz default now(),
  unique(user_id, date)
);

-- Metadati foto progressi
create table if not exists progress_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  date date not null,
  photo_type text default 'progresso',  -- 'prima', 'dopo', 'progresso'
  storage_path text not null,
  notes text,
  created_at timestamptz default now()
);

-- Profili pubblici dei dietisti
create table if not exists dietitian_profiles (
  id              uuid primary key default gen_random_uuid(),
  dietitian_id    uuid not null unique references auth.users(id) on delete cascade,
  nome            text not null default '',
  cognome         text default '',
  titoli          text default '',
  descrizione     text default '',
  citta           text default '',
  indirizzo       text default '',
  telefono        text default '',
  email_contatto  text default '',
  sito_web        text default '',
  visible         boolean default true,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);


-- ============================================================
-- COLONNE AGGIUNTIVE (profiles, tabelle cliniche, documenti)
-- ============================================================

-- Profili utente: colonne estese
alter table profiles add column if not exists role text default 'patient';
alter table profiles add column if not exists full_name text;
alter table profiles add column if not exists first_name text;
alter table profiles add column if not exists last_name text;
alter table profiles add column if not exists target_weight numeric;
alter table profiles add column if not exists height_cm numeric;
alter table profiles add column if not exists birth_date date;
alter table profiles add column if not exists gender text;
alter table profiles add column if not exists activity_level text;
alter table profiles add column if not exists last_seen_at timestamptz;
alter table profiles add column if not exists avatar_url text;
alter table profiles add column if not exists intolerances jsonb default '[]'::jsonb;
alter table profiles add column if not exists food_preferences jsonb default '[]'::jsonb;

-- Aggiorna first_name/last_name dai profili che hanno solo full_name
update profiles
set
  first_name = split_part(full_name, ' ', 1),
  last_name = case
    when full_name like '% %' then substring(full_name from position(' ' in full_name) + 1)
    else ''
  end
where
  (first_name is null or first_name = '')
  and full_name is not null
  and full_name <> '';

-- Tabelle cliniche del portale dietista: patient_id e visible_to_patient
alter table piani add column if not exists patient_id uuid references auth.users;
alter table ncpt add column if not exists patient_id uuid references auth.users;
alter table schede_valutazione add column if not exists patient_id uuid references auth.users;
alter table bia_records add column if not exists patient_id uuid references auth.users;
alter table note_specialistiche add column if not exists patient_id uuid references auth.users;

do $$
declare
  t text;
begin
  foreach t in array array['piani','ncpt','schede_valutazione','bia_records','note_specialistiche']
  loop
    if exists (select 1 from information_schema.tables where table_name = t and table_schema = 'public') then
      execute format('alter table %I add column if not exists visible_to_patient boolean not null default true', t);
    end if;
  end loop;
end;
$$;

-- Tabelle cliniche del portale dietista: print_image_url (screenshot stampabile)
do $$
declare
  t text;
begin
  foreach t in array array['patient_documents','note_specialistiche','piani','ncpt','schede_valutazione','bia_records']
  loop
    if exists (select 1 from information_schema.tables where table_name = t and table_schema = 'public') then
      execute format('alter table %I add column if not exists print_image_url text', t);
    end if;
  end loop;
end;
$$;

-- patient_documents: firma privacy
alter table patient_documents add column if not exists requires_signature boolean default false;
alter table patient_documents add column if not exists signed_at timestamptz;
alter table patient_documents add column if not exists signature_data text;
alter table patient_documents add column if not exists signature_accepted boolean;

-- food_logs: colonne aggiunte successivamente
alter table food_logs add column if not exists created_at timestamptz default now();
alter table food_logs add column if not exists meal_time text;
alter table food_logs add column if not exists food_data jsonb;
update food_logs set created_at = now() where created_at is null;

-- daily_wellness: qualità del riposo
alter table daily_wellness add column if not exists sleep_restedness int;
alter table daily_wellness drop constraint if exists chk_sleep_restedness_range;
alter table daily_wellness add constraint chk_sleep_restedness_range
  check (sleep_restedness between 1 and 5);


-- ============================================================
-- BACKFILL: patient_id nelle tabelle cliniche (da cartella_id)
-- Necessario per record creati prima che patient_id fosse aggiunto.
-- ============================================================

do $$
begin
  if exists (select 1 from information_schema.tables where table_name='piani' and table_schema='public') then
    update piani set patient_id = pd.patient_id
    from patient_dietitian pd
    where piani.cartella_id = pd.cartella_id and piani.patient_id is null;
  end if;

  if exists (select 1 from information_schema.tables where table_name='note_specialistiche' and table_schema='public') then
    update note_specialistiche set patient_id = pd.patient_id
    from patient_dietitian pd
    where note_specialistiche.cartella_id = pd.cartella_id and note_specialistiche.patient_id is null;
  end if;

  if exists (select 1 from information_schema.tables where table_name='ncpt' and table_schema='public') then
    update ncpt set patient_id = pd.patient_id
    from patient_dietitian pd
    where ncpt.cartella_id = pd.cartella_id and ncpt.patient_id is null;
  end if;

  if exists (select 1 from information_schema.tables where table_name='schede_valutazione' and table_schema='public') then
    update schede_valutazione set patient_id = pd.patient_id
    from patient_dietitian pd
    where schede_valutazione.cartella_id = pd.cartella_id and schede_valutazione.patient_id is null;
  end if;

  if exists (select 1 from information_schema.tables where table_name='bia_records' and table_schema='public') then
    update bia_records set patient_id = pd.patient_id
    from patient_dietitian pd
    where bia_records.cartella_id = pd.cartella_id and bia_records.patient_id is null;
  end if;
end;
$$;


-- ============================================================
-- INDICI
-- ============================================================

create index if not exists activity_logs_user_date_idx on activity_logs (user_id, date desc);

create index if not exists idx_patient_documents_unsigned
  on patient_documents (patient_id, requires_signature, signed_at)
  where requires_signature = true and signed_at is null;

create index if not exists idx_dietitian_profiles_citta
  on dietitian_profiles (lower(citta))
  where visible = true;


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table patient_diets enable row level security;
alter table diet_meals enable row level security;
alter table food_logs enable row level security;
alter table daily_logs enable row level security;
alter table water_logs enable row level security;
alter table custom_foods enable row level security;
alter table cartelle enable row level security;
alter table patient_dietitian enable row level security;
alter table chat_messages enable row level security;
alter table patient_documents enable row level security;
alter table weight_logs enable row level security;
alter table daily_wellness enable row level security;
alter table custom_meals enable row level security;
alter table ricette enable row level security;
alter table appointments enable row level security;
alter table activity_logs enable row level security;
alter table meal_completions enable row level security;
alter table body_measurements enable row level security;
alter table progress_photos enable row level security;
alter table profiles enable row level security;
alter table dietitian_profiles enable row level security;


-- ============================================================
-- POLICY RLS
-- ============================================================

-- ── food_logs ───────────────────────────────────────────────
drop policy if exists "utenti vedono i propri dati" on food_logs;
drop policy if exists "dietista legge diario pazienti" on food_logs;
drop policy if exists "food_logs_select_own" on food_logs;
drop policy if exists "food_logs_insert_own" on food_logs;
drop policy if exists "food_logs_update_own" on food_logs;
drop policy if exists "food_logs_delete_own" on food_logs;
drop policy if exists "food_logs_dietitian_select" on food_logs;
drop policy if exists "food_logs_own" on food_logs;
drop policy if exists "food_logs_dietitian_read" on food_logs;

create policy "food_logs_own" on food_logs
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "food_logs_dietitian_read" on food_logs
  for select using (
    exists (
      select 1 from patient_dietitian pd
      where pd.patient_id = food_logs.user_id
        and pd.dietitian_id = auth.uid()
    )
  );

-- ── daily_logs ──────────────────────────────────────────────
drop policy if exists "utenti vedono i propri dati" on daily_logs;
create policy "utenti vedono i propri dati" on daily_logs
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "dietista legge totali giornalieri pazienti" on daily_logs;
create policy "dietista legge totali giornalieri pazienti" on daily_logs
  for select using (
    exists (
      select 1 from patient_dietitian pd
      where pd.patient_id = daily_logs.user_id
        and pd.dietitian_id = auth.uid()
    )
  );

-- ── water_logs ──────────────────────────────────────────────
drop policy if exists "utenti vedono i propri dati" on water_logs;
create policy "utenti vedono i propri dati" on water_logs
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── custom_foods ────────────────────────────────────────────
drop policy if exists "utenti vedono i propri dati" on custom_foods;
create policy "utenti vedono i propri dati" on custom_foods
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── patient_diets ───────────────────────────────────────────
drop policy if exists "pazienti leggono la propria dieta" on patient_diets;
create policy "pazienti leggono la propria dieta" on patient_diets
  for select using (auth.uid() = user_id);

drop policy if exists "dietista gestisce diete" on patient_diets;
create policy "dietista gestisce diete" on patient_diets
  for all using (true);

-- ── diet_meals ──────────────────────────────────────────────
drop policy if exists "accesso pasti dieta propria" on diet_meals;
create policy "accesso pasti dieta propria" on diet_meals
  for select using (
    exists (
      select 1 from patient_diets pd
      where pd.id = diet_id and pd.user_id = auth.uid()
    )
  );

drop policy if exists "dietista gestisce pasti" on diet_meals;
create policy "dietista gestisce pasti" on diet_meals
  for all using (true);

-- ── patient_dietitian ───────────────────────────────────────
drop policy if exists "visibile ai coinvolti" on patient_dietitian;
create policy "visibile ai coinvolti" on patient_dietitian
  for select using (auth.uid() = patient_id or auth.uid() = dietitian_id);

drop policy if exists "dietista crea relazioni" on patient_dietitian;
create policy "dietista crea relazioni" on patient_dietitian
  for insert with check (auth.uid() = dietitian_id);

drop policy if exists "dietista aggiorna relazioni" on patient_dietitian;
create policy "dietista aggiorna relazioni" on patient_dietitian
  for update using (auth.uid() = dietitian_id);

-- ── cartelle ────────────────────────────────────────────────
drop policy if exists "dietista legge cartelle" on cartelle;
create policy "dietista legge cartelle" on cartelle
  for select using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'dietitian'
    )
  );

-- ── chat_messages ───────────────────────────────────────────
drop policy if exists "chat visibile ai coinvolti" on chat_messages;
create policy "chat visibile ai coinvolti" on chat_messages
  for all using (
    auth.uid() = patient_id or
    exists (
      select 1 from patient_dietitian pd
      where pd.patient_id = chat_messages.patient_id
        and pd.dietitian_id = auth.uid()
    )
  )
  with check (
    auth.uid() = patient_id or
    exists (
      select 1 from patient_dietitian pd
      where pd.patient_id = chat_messages.patient_id
        and pd.dietitian_id = auth.uid()
    )
  );

-- ── patient_documents ───────────────────────────────────────
drop policy if exists "paziente vede propri documenti" on patient_documents;
create policy "paziente vede propri documenti" on patient_documents
  for select using (auth.uid() = patient_id and visible is not false);

drop policy if exists "dietista gestisce documenti" on patient_documents;
create policy "dietista gestisce documenti" on patient_documents
  for all using (auth.uid() = dietitian_id)
  with check (auth.uid() = dietitian_id);

drop policy if exists "paziente firma documento" on patient_documents;
create policy "paziente firma documento" on patient_documents
  for update using (auth.uid() = patient_id)
  with check (auth.uid() = patient_id);

drop policy if exists "dietista legge propri documenti" on patient_documents;
create policy "dietista legge propri documenti" on patient_documents
  for select using (dietitian_id = auth.uid());

-- ── weight_logs ─────────────────────────────────────────────
drop policy if exists "utente gestisce proprio peso" on weight_logs;
create policy "utente gestisce proprio peso" on weight_logs
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "dietista legge peso pazienti" on weight_logs;
create policy "dietista legge peso pazienti" on weight_logs
  for select using (
    exists (
      select 1 from patient_dietitian pd
      where pd.patient_id = weight_logs.user_id
        and pd.dietitian_id = auth.uid()
    )
  );

-- ── daily_wellness ──────────────────────────────────────────
drop policy if exists "utente gestisce proprio wellness" on daily_wellness;
create policy "utente gestisce proprio wellness" on daily_wellness
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "dietista legge wellness pazienti" on daily_wellness;
create policy "dietista legge wellness pazienti" on daily_wellness
  for select using (
    exists (
      select 1 from patient_dietitian pd
      where pd.patient_id = daily_wellness.user_id
        and pd.dietitian_id = auth.uid()
    )
  );

-- ── profiles ────────────────────────────────────────────────
drop policy if exists "utenti vedono il proprio profilo" on profiles;
create policy "utenti vedono il proprio profilo" on profiles
  for select using (auth.uid() = id);

drop policy if exists "utenti aggiornano il proprio profilo" on profiles;
create policy "utenti aggiornano il proprio profilo" on profiles
  for update using (auth.uid() = id);

drop policy if exists "utenti inseriscono il proprio profilo" on profiles;
create policy "utenti inseriscono il proprio profilo" on profiles
  for insert with check (auth.uid() = id);

drop policy if exists "dietista legge profili pazienti" on profiles;
create policy "dietista legge profili pazienti" on profiles
  for select using (
    exists (
      select 1 from patient_dietitian pd
      where pd.patient_id = profiles.id
        and pd.dietitian_id = auth.uid()
    )
    or auth.uid() = id
  );

-- ── custom_meals ────────────────────────────────────────────
drop policy if exists "utente gestisce propri pasti" on custom_meals;
create policy "utente gestisce propri pasti" on custom_meals
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── ricette ─────────────────────────────────────────────────
-- Columns added by NutriPlan patient app (table may exist from admin app with fewer columns)
alter table ricette add column if not exists user_id uuid references auth.users(id);
alter table ricette add column if not exists ingredienti jsonb default '[]'::jsonb;
alter table ricette add column if not exists porzioni int default 1;
alter table ricette add column if not exists peso_totale_g numeric default 0;
alter table ricette add column if not exists kcal_100g numeric default 0;
alter table ricette add column if not exists proteins_100g numeric default 0;
alter table ricette add column if not exists carbs_100g numeric default 0;
alter table ricette add column if not exists fats_100g numeric default 0;
alter table ricette add column if not exists calorie_porzione numeric default 0;
alter table ricette add column if not exists proteine numeric default 0;
alter table ricette add column if not exists carboidrati numeric default 0;
alter table ricette add column if not exists grassi numeric default 0;
alter table ricette add column if not exists fibra numeric default 0;
alter table ricette add column if not exists note text;
alter table ricette add column if not exists fasi_preparazione jsonb default '[]'::jsonb;
alter table ricette add column if not exists tempo_preparazione_min int default 0;
alter table ricette add column if not exists tempo_cottura_min int default 0;
alter table ricette add column if not exists tempo_raffreddamento_min int default 0;
alter table ricette add column if not exists is_public boolean default false;
-- Enable RLS if not already enabled
alter table ricette enable row level security;

drop policy if exists "utente gestisce proprie ricette" on ricette;
drop policy if exists "leggi ricette proprie e pubbliche" on ricette;
drop policy if exists "inserisci ricette" on ricette;
drop policy if exists "modifica ricette" on ricette;
drop policy if exists "elimina ricette" on ricette;

create policy "leggi ricette proprie e pubbliche" on ricette
  for select using (auth.uid() = user_id or is_public = true);
create policy "inserisci ricette" on ricette
  for insert with check (auth.uid() = user_id);
create policy "modifica ricette" on ricette
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "elimina ricette" on ricette
  for delete using (auth.uid() = user_id);

-- ── appointments ────────────────────────────────────────────
drop policy if exists "paziente vede i propri appuntamenti" on appointments;
create policy "paziente vede i propri appuntamenti" on appointments
  for select using (auth.uid() = patient_id);

drop policy if exists "dietista gestisce appuntamenti" on appointments;
create policy "dietista gestisce appuntamenti" on appointments
  for all using (
    auth.uid() = dietitian_id or
    exists (
      select 1 from patient_dietitian pd
      where pd.patient_id = appointments.patient_id
        and pd.dietitian_id = auth.uid()
    )
  );

-- ── activity_logs ───────────────────────────────────────────
drop policy if exists "utente gestisce proprie attività" on activity_logs;
create policy "utente gestisce proprie attività" on activity_logs
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── meal_completions ────────────────────────────────────────
drop policy if exists "paziente gestisce completamenti" on meal_completions;
create policy "paziente gestisce completamenti" on meal_completions
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "dietista legge completamenti" on meal_completions;
create policy "dietista legge completamenti" on meal_completions
  for select using (
    exists (
      select 1 from patient_dietitian pd
      where pd.patient_id = meal_completions.user_id
        and pd.dietitian_id = auth.uid()
    )
  );

-- ── body_measurements ───────────────────────────────────────
drop policy if exists "utenti vedono le proprie misurazioni" on body_measurements;
create policy "utenti vedono le proprie misurazioni" on body_measurements
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── progress_photos ─────────────────────────────────────────
drop policy if exists "utenti vedono le proprie foto" on progress_photos;
create policy "utenti vedono le proprie foto" on progress_photos
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── dietitian_profiles ──────────────────────────────────────
drop policy if exists "dietitian_manage_own_profile" on dietitian_profiles;
create policy "dietitian_manage_own_profile" on dietitian_profiles
  for all to authenticated
  using (auth.uid() = dietitian_id)
  with check (auth.uid() = dietitian_id);

drop policy if exists "read_visible_profiles" on dietitian_profiles;
create policy "read_visible_profiles" on dietitian_profiles
  for select to authenticated
  using (visible = true);


-- ============================================================
-- POLICY RLS: Tabelle cliniche del portale dietista
-- I pazienti possono leggere i propri dati quando
-- visible_to_patient = true, tramite patient_id o cartella_id.
-- ============================================================

do $$
begin
  -- piani
  if exists (select 1 from information_schema.tables where table_name='piani' and table_schema='public')
     and exists (select 1 from information_schema.columns where table_name='piani' and table_schema='public' and column_name='patient_id')
     and exists (select 1 from information_schema.columns where table_name='piani' and table_schema='public' and column_name='visible_to_patient')
  then
    execute $p$ alter table piani enable row level security $p$;
    drop policy if exists "paziente legge propri piani" on piani;
    execute $p$
      create policy "paziente legge propri piani" on piani
        for select using (
          visible_to_patient = true
          and (
            auth.uid() = patient_id
            or exists (
              select 1 from patient_dietitian pd
              where pd.patient_id = auth.uid() and pd.cartella_id = piani.cartella_id
            )
          )
        )
    $p$;
  end if;

  -- note_specialistiche
  if exists (select 1 from information_schema.tables where table_name='note_specialistiche' and table_schema='public')
     and exists (select 1 from information_schema.columns where table_name='note_specialistiche' and table_schema='public' and column_name='patient_id')
     and exists (select 1 from information_schema.columns where table_name='note_specialistiche' and table_schema='public' and column_name='visible_to_patient')
  then
    execute $p$ alter table note_specialistiche enable row level security $p$;
    drop policy if exists "paziente legge proprie note" on note_specialistiche;
    execute $p$
      create policy "paziente legge proprie note" on note_specialistiche
        for select using (
          visible_to_patient = true
          and (
            auth.uid() = patient_id
            or exists (
              select 1 from patient_dietitian pd
              where pd.patient_id = auth.uid() and pd.cartella_id = note_specialistiche.cartella_id
            )
          )
        )
    $p$;
  end if;

  -- ncpt
  if exists (select 1 from information_schema.tables where table_name='ncpt' and table_schema='public')
     and exists (select 1 from information_schema.columns where table_name='ncpt' and table_schema='public' and column_name='patient_id')
     and exists (select 1 from information_schema.columns where table_name='ncpt' and table_schema='public' and column_name='visible_to_patient')
  then
    execute $p$ alter table ncpt enable row level security $p$;
    drop policy if exists "paziente legge propri ncpt" on ncpt;
    execute $p$
      create policy "paziente legge propri ncpt" on ncpt
        for select using (
          visible_to_patient = true
          and (
            auth.uid() = patient_id
            or exists (
              select 1 from patient_dietitian pd
              where pd.patient_id = auth.uid() and pd.cartella_id = ncpt.cartella_id
            )
          )
        )
    $p$;
  end if;

  -- schede_valutazione
  if exists (select 1 from information_schema.tables where table_name='schede_valutazione' and table_schema='public')
     and exists (select 1 from information_schema.columns where table_name='schede_valutazione' and table_schema='public' and column_name='patient_id')
     and exists (select 1 from information_schema.columns where table_name='schede_valutazione' and table_schema='public' and column_name='visible_to_patient')
  then
    execute $p$ alter table schede_valutazione enable row level security $p$;
    drop policy if exists "paziente legge proprie schede" on schede_valutazione;
    execute $p$
      create policy "paziente legge proprie schede" on schede_valutazione
        for select using (
          visible_to_patient = true
          and (
            auth.uid() = patient_id
            or exists (
              select 1 from patient_dietitian pd
              where pd.patient_id = auth.uid() and pd.cartella_id = schede_valutazione.cartella_id
            )
          )
        )
    $p$;
  end if;

  -- bia_records
  if exists (select 1 from information_schema.tables where table_name='bia_records' and table_schema='public')
     and exists (select 1 from information_schema.columns where table_name='bia_records' and table_schema='public' and column_name='patient_id')
     and exists (select 1 from information_schema.columns where table_name='bia_records' and table_schema='public' and column_name='visible_to_patient')
  then
    execute $p$ alter table bia_records enable row level security $p$;
    drop policy if exists "paziente legge propri bia" on bia_records;
    execute $p$
      create policy "paziente legge propri bia" on bia_records
        for select using (
          visible_to_patient = true
          and (
            auth.uid() = patient_id
            or exists (
              select 1 from patient_dietitian pd
              where pd.patient_id = auth.uid() and pd.cartella_id = bia_records.cartella_id
            )
          )
        )
    $p$;
  end if;
end;
$$;


-- ============================================================
-- TRIGGER: auto-creazione profilo alla registrazione
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    first_name,
    last_name,
    role
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce(new.raw_user_meta_data->>'first_name', split_part(coalesce(new.raw_user_meta_data->>'full_name', ''), ' ', 1)),
    coalesce(new.raw_user_meta_data->>'last_name', case
      when coalesce(new.raw_user_meta_data->>'full_name', '') like '% %'
        then substring(coalesce(new.raw_user_meta_data->>'full_name', '') from position(' ' in coalesce(new.raw_user_meta_data->>'full_name', '')) + 1)
      else ''
    end),
    coalesce(new.raw_user_meta_data->>'role', 'patient')
  )
  on conflict (id) do update set
    full_name  = coalesce(excluded.full_name,  profiles.full_name),
    first_name = coalesce(excluded.first_name, profiles.first_name),
    last_name  = coalesce(excluded.last_name,  profiles.last_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

-- chat-media (foto e audio della chat, privato)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'chat-media', 'chat-media', false, 52428800,
  array['image/jpeg','image/png','image/gif','image/webp',
        'audio/webm','audio/ogg','audio/mp4','audio/mpeg','audio/wav']
)
on conflict (id) do nothing;

-- progress-photos (foto progressi, privato)
insert into storage.buckets (id, name, public)
values ('progress-photos', 'progress-photos', false)
on conflict (id) do nothing;

-- avatars (foto profilo, pubblico)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- document-prints (screenshot documenti clinici, privato — 10 MB)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'document-prints', 'document-prints', false, 10485760,
  array['image/png','image/jpeg','image/webp']
)
on conflict (id) do nothing;


-- ============================================================
-- STORAGE POLICIES
-- ============================================================

-- ── chat-media ──────────────────────────────────────────────
drop policy if exists "chat media upload" on storage.objects;
create policy "chat media upload" on storage.objects
  for insert with check (
    bucket_id = 'chat-media'
    and auth.uid() is not null
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "chat media select" on storage.objects;
create policy "chat media select" on storage.objects
  for select using (
    bucket_id = 'chat-media'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or exists (
        select 1 from patient_dietitian pd
        where pd.patient_id::text = (storage.foldername(name))[1]
          and pd.dietitian_id = auth.uid()
      )
    )
  );

drop policy if exists "chat media delete" on storage.objects;
create policy "chat media delete" on storage.objects
  for delete using (
    bucket_id = 'chat-media'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ── progress-photos ─────────────────────────────────────────
drop policy if exists "utenti gestiscono le proprie foto progress" on storage.objects;
create policy "utenti gestiscono le proprie foto progress" on storage.objects
  for all using (
    bucket_id = 'progress-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ── avatars ─────────────────────────────────────────────────
drop policy if exists "utente carica avatar" on storage.objects;
create policy "utente carica avatar" on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and auth.uid()::text = split_part(name, '.', 1)
  );

drop policy if exists "utente aggiorna avatar" on storage.objects;
create policy "utente aggiorna avatar" on storage.objects
  for update using (
    bucket_id = 'avatars'
    and auth.uid()::text = split_part(name, '.', 1)
  );

drop policy if exists "avatar pubblici" on storage.objects;
create policy "avatar pubblici" on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "utente elimina avatar" on storage.objects;
create policy "utente elimina avatar" on storage.objects
  for delete using (
    bucket_id = 'avatars'
    and auth.uid()::text = split_part(name, '.', 1)
  );

-- ── document-prints ─────────────────────────────────────────
-- Path: <owner_id>/<document_id>.png
-- owner_id può essere patient_id o dietitian_id (il dietista usa la propria cartella)

drop policy if exists "doc prints select" on storage.objects;
create policy "doc prints select" on storage.objects
  for select using (
    bucket_id = 'document-prints'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or exists (
        select 1 from patient_dietitian pd
        where pd.dietitian_id::text = (storage.foldername(name))[1]
          and pd.patient_id = auth.uid()
      )
      or exists (
        select 1 from patient_dietitian pd
        where pd.patient_id::text = (storage.foldername(name))[1]
          and pd.dietitian_id = auth.uid()
      )
    )
  );

drop policy if exists "doc prints insert" on storage.objects;
create policy "doc prints insert" on storage.objects
  for insert with check (
    bucket_id = 'document-prints'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or exists (
        select 1 from patient_dietitian pd
        where pd.patient_id::text = (storage.foldername(name))[1]
          and pd.dietitian_id = auth.uid()
      )
    )
  );

drop policy if exists "doc prints update" on storage.objects;
create policy "doc prints update" on storage.objects
  for update using (
    bucket_id = 'document-prints'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or exists (
        select 1 from patient_dietitian pd
        where pd.patient_id::text = (storage.foldername(name))[1]
          and pd.dietitian_id = auth.uid()
      )
    )
  );

drop policy if exists "doc prints delete" on storage.objects;
create policy "doc prints delete" on storage.objects
  for delete using (
    bucket_id = 'document-prints'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or exists (
        select 1 from patient_dietitian pd
        where pd.patient_id::text = (storage.foldername(name))[1]
          and pd.dietitian_id = auth.uid()
      )
    )
  );


-- ============================================================
-- REALTIME
-- ============================================================

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'chat_messages'
  ) then
    alter publication supabase_realtime add table chat_messages;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'profiles'
  ) then
    alter publication supabase_realtime add table profiles;
  end if;
end;
$$;


-- ============================================================
-- NOTE PER IL DIETISTA
--
-- Assegnare una dieta a un paziente:
--   insert into patient_diets (user_id, name, kcal_target, ...)
--   values ('UUID-PAZIENTE', 'Piano dimagrimento', 1800, ...);
--
-- Collegare un paziente al dietista:
--   insert into patient_dietitian (patient_id, dietitian_id)
--   values ('UUID-PAZIENTE', auth.uid());
--
-- Condividere un documento:
--   insert into patient_documents (patient_id, dietitian_id, title, type, content, visible)
--   values ('UUID-PAZIENTE', auth.uid(), 'Titolo', 'advice', 'Testo...', true);
--
-- Inviare privacy al paziente (con firma richiesta):
--   insert into patient_documents (patient_id, dietitian_id, title, type, content, visible, requires_signature)
--   values ('UUID-PAZIENTE', auth.uid(), 'Informativa Privacy', 'privacy', '...testo...', true, true);
--
-- Creare un appuntamento:
--   insert into appointments (patient_id, dietitian_id, title, appointment_date)
--   values ('UUID-PAZIENTE', auth.uid(), 'Visita di controllo', '2025-05-15 10:00:00+02');
--
-- L'UUID del paziente si trova in Supabase → Authentication → Users
-- ============================================================
