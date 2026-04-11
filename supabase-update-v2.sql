-- ============================================================
-- NutriPlan — SQL AGGIORNAMENTO v2
-- Esegui nel SQL Editor di Supabase
-- Aggiunge: chat, documenti paziente, progressi peso, wellness
-- ============================================================

-- Tabella: relazione paziente ↔ dietista
create table if not exists patient_dietitian (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references auth.users not null,
  dietitian_id uuid references auth.users not null,
  created_at timestamptz default now(),
  unique(patient_id, dietitian_id)
);
alter table patient_dietitian enable row level security;
create policy "visibile ai coinvolti" on patient_dietitian
  for select using (auth.uid() = patient_id or auth.uid() = dietitian_id);
create policy "dietista crea relazioni" on patient_dietitian
  for insert with check (auth.uid() = dietitian_id);

-- ============================================================
-- CHAT
-- ============================================================
create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references auth.users not null,
  sender_id uuid references auth.users not null,
  sender_role text not null check (sender_role in ('patient', 'dietitian')),
  content text not null,
  read_at timestamptz,
  created_at timestamptz default now()
);
alter table chat_messages enable row level security;
create policy "chat visibile ai coinvolti" on chat_messages
  for all using (
    auth.uid() = patient_id or
    exists (
      select 1 from patient_dietitian pd
      where pd.patient_id = chat_messages.patient_id
      and pd.dietitian_id = auth.uid()
    )
  );

-- ============================================================
-- DOCUMENTI CONDIVISI DAL DIETISTA
-- ============================================================
create table if not exists patient_documents (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references auth.users not null,
  dietitian_id uuid references auth.users not null,
  title text not null,
  type text default 'document', -- 'diet', 'advice', 'recipe', 'document', 'education'
  content text,
  file_url text,
  tags text[] default '{}',
  visible boolean default true,  -- il dietista può nascondere/mostrare
  published_at timestamptz default now(),
  created_at timestamptz default now()
);
alter table patient_documents enable row level security;
-- Paziente vede solo i documenti visibili
create policy "paziente vede propri documenti" on patient_documents
  for select using (auth.uid() = patient_id and visible = true);
-- Dietista gestisce tutti i documenti dei propri pazienti
create policy "dietista gestisce documenti" on patient_documents
  for all using (auth.uid() = dietitian_id);

-- ============================================================
-- PROGRESSI PESO
-- ============================================================
create table if not exists weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  date date not null,
  weight_kg numeric not null,
  created_at timestamptz default now(),
  unique(user_id, date)
);
alter table weight_logs enable row level security;
create policy "utente gestisce proprio peso" on weight_logs
  for all using (auth.uid() = user_id);
-- Il dietista può leggere i pesi dei propri pazienti
create policy "dietista legge peso pazienti" on weight_logs
  for select using (
    exists (
      select 1 from patient_dietitian pd
      where pd.patient_id = weight_logs.user_id
      and pd.dietitian_id = auth.uid()
    )
  );

-- ============================================================
-- WELLNESS GIORNALIERO (umore, sintomi, note)
-- ============================================================
create table if not exists daily_wellness (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  date date not null,
  mood int check (mood between 1 and 5),
  symptoms text[] default '{}',
  notes text,
  created_at timestamptz default now(),
  unique(user_id, date)
);
alter table daily_wellness enable row level security;
create policy "utente gestisce proprio wellness" on daily_wellness
  for all using (auth.uid() = user_id);
create policy "dietista legge wellness pazienti" on daily_wellness
  for select using (
    exists (
      select 1 from patient_dietitian pd
      where pd.patient_id = daily_wellness.user_id
      and pd.dietitian_id = auth.uid()
    )
  );

-- ============================================================
-- PROFILI ESTESI (target_weight, altezza, ecc.)
-- Aggiorna la tabella profiles esistente
-- ============================================================
alter table profiles add column if not exists target_weight numeric;
alter table profiles add column if not exists height_cm numeric;
alter table profiles add column if not exists birth_date date;
alter table profiles add column if not exists gender text;
alter table profiles add column if not exists activity_level text;

-- ============================================================
-- REALTIME: abilita per la chat
-- ============================================================
alter publication supabase_realtime add table chat_messages;

-- ============================================================
-- NOTE PER IL DIETISTA (da implementare nel sito)
-- Per collegare un paziente al dietista:
--   insert into patient_dietitian (patient_id, dietitian_id)
--   values ('UUID-PAZIENTE', auth.uid());
--
-- Per condividere un documento:
--   insert into patient_documents (patient_id, dietitian_id, title, type, content, visible)
--   values ('UUID-PAZIENTE', auth.uid(), 'Titolo', 'advice', 'Testo...', true);
--
-- Per nascondere un documento al paziente:
--   update patient_documents set visible = false where id = 'ID-DOCUMENTO';
-- ============================================================
