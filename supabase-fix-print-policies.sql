-- ============================================================
-- FIX: storage policies per document-prints
-- Permette al dietista di caricare immagini nella propria cartella
-- anche quando la cartella paziente non è ancora collegata a un account paziente.
-- La signed URL viene salvata in print_image_url e rimane accessibile al paziente.
-- ============================================================

-- INSERT: consenti upload nella propria cartella OPPURE nella cartella del paziente collegato
drop policy if exists "doc prints insert" on storage.objects;
create policy "doc prints insert" on storage.objects
  for insert with check (
    bucket_id = 'document-prints'
    and (
      -- Il dietista carica nella propria cartella (folder = proprio auth.uid)
      auth.uid()::text = (storage.foldername(name))[1]
      or
      -- Oppure in una cartella paziente cui è collegato
      exists (
        select 1 from patient_dietitian pd
        where pd.patient_id::text = (storage.foldername(name))[1]
          and pd.dietitian_id = auth.uid()
      )
    )
  );

-- UPDATE: stessa logica
drop policy if exists "doc prints update" on storage.objects;
create policy "doc prints update" on storage.objects
  for update using (
    bucket_id = 'document-prints'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or
      exists (
        select 1 from patient_dietitian pd
        where pd.patient_id::text = (storage.foldername(name))[1]
          and pd.dietitian_id = auth.uid()
      )
    )
  );

-- DELETE: stessa logica
drop policy if exists "doc prints delete" on storage.objects;
create policy "doc prints delete" on storage.objects
  for delete using (
    bucket_id = 'document-prints'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or
      exists (
        select 1 from patient_dietitian pd
        where pd.patient_id::text = (storage.foldername(name))[1]
          and pd.dietitian_id = auth.uid()
      )
    )
  );

-- SELECT: paziente vede la propria cartella O cartella del dietista collegato
drop policy if exists "doc prints select" on storage.objects;
create policy "doc prints select" on storage.objects
  for select using (
    bucket_id = 'document-prints'
    and (
      -- Il proprietario della cartella (paziente o dietista) vede i propri file
      auth.uid()::text = (storage.foldername(name))[1]
      or
      -- Paziente vede i file salvati nella cartella del proprio dietista
      exists (
        select 1 from patient_dietitian pd
        where pd.dietitian_id::text = (storage.foldername(name))[1]
          and pd.patient_id = auth.uid()
      )
      or
      -- Dietista vede i file nelle cartelle dei propri pazienti
      exists (
        select 1 from patient_dietitian pd
        where pd.patient_id::text = (storage.foldername(name))[1]
          and pd.dietitian_id = auth.uid()
      )
    )
  );
