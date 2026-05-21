-- Run this in the Supabase SQL editor if chat messages give a 400 error.
-- It adds any missing columns to chat_messages (safe to run multiple times).

alter table chat_messages add column if not exists patient_id uuid references auth.users;
alter table chat_messages add column if not exists sender_id  uuid references auth.users;
alter table chat_messages add column if not exists sender_role text;
alter table chat_messages add column if not exists content text;
alter table chat_messages add column if not exists message_type text default 'text';
alter table chat_messages add column if not exists file_url text;
alter table chat_messages add column if not exists file_name text;
alter table chat_messages add column if not exists duration_seconds numeric;
alter table chat_messages add column if not exists read_at timestamptz;

-- If the table used a different column name for the patient reference, backfill patient_id
update chat_messages set patient_id = sender_id
  where patient_id is null and sender_role = 'patient';

-- Ensure RLS is on and the policy exists
alter table chat_messages enable row level security;

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

-- Add chat_messages to the realtime publication if not already there
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'chat_messages'
  ) then
    alter publication supabase_realtime add table chat_messages;
  end if;
end $$;
