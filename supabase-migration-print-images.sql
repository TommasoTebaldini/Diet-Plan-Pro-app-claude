-- ============================================================
-- MIGRAZIONE: documenti stampabili come immagine (PNG)
-- Da incollare nel SQL Editor di Supabase.
-- ============================================================

-- 1. Nuova colonna print_image_url su tutte le tabelle di documenti del dietista
alter table patient_documents   add column if not exists print_image_url text;
alter table note_specialistiche add column if not exists print_image_url text;
alter table piani               add column if not exists print_image_url text;
alter table ncpt                add column if not exists print_image_url text;
alter table schede_valutazione  add column if not exists print_image_url text;
alter table bia_records         add column if not exists print_image_url text;

-- 2. Bucket privato per le immagini di stampa
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'document-prints',
  'document-prints',
  false,
  10485760, -- 10 MB
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do nothing;

-- 3. Convenzione path: <patient_id>/<document_id>.png
--    Il primo segmento del path = patient_id (come per chat-media).

-- Lettura: paziente proprietario + dietista collegato
drop policy if exists "doc prints select" on storage.objects;
create policy "doc prints select" on storage.objects
  for select using (
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

-- Scrittura: solo il dietista collegato al paziente
drop policy if exists "doc prints insert" on storage.objects;
create policy "doc prints insert" on storage.objects
  for insert with check (
    bucket_id = 'document-prints'
    and exists (
      select 1 from patient_dietitian pd
      where pd.patient_id::text = (storage.foldername(name))[1]
        and pd.dietitian_id = auth.uid()
    )
  );

drop policy if exists "doc prints update" on storage.objects;
create policy "doc prints update" on storage.objects
  for update using (
    bucket_id = 'document-prints'
    and exists (
      select 1 from patient_dietitian pd
      where pd.patient_id::text = (storage.foldername(name))[1]
        and pd.dietitian_id = auth.uid()
    )
  );

drop policy if exists "doc prints delete" on storage.objects;
create policy "doc prints delete" on storage.objects
  for delete using (
    bucket_id = 'document-prints'
    and exists (
      select 1 from patient_dietitian pd
      where pd.patient_id::text = (storage.foldername(name))[1]
        and pd.dietitian_id = auth.uid()
    )
  );
