-- Recensioni pazienti sul profilo pubblico del dietista.
-- Una recensione richiede che il paziente abbia avuto almeno un appuntamento
-- (non annullato) con quel dietista — evita recensioni da chi non è mai
-- stato in contatto ("verified experience", stesso principio delle
-- recensioni verificate di Amazon/TripAdvisor).
--
-- Esegui questo file una sola volta nell'SQL Editor di Supabase.

create table if not exists dietitian_reviews (
  id            uuid primary key default gen_random_uuid(),
  dietitian_id  uuid not null references auth.users(id) on delete cascade,
  patient_id    uuid not null references auth.users(id) on delete cascade,
  rating        smallint not null check (rating between 1 and 5),
  comment       text default '',
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),
  unique(dietitian_id, patient_id)
);

create index if not exists idx_dietitian_reviews_dietitian
  on dietitian_reviews(dietitian_id, created_at desc);

alter table dietitian_reviews enable row level security;

-- Chiunque autenticato può leggere le recensioni di un dietista (social proof
-- pubblico, stesso livello di visibilità di dietitian_profiles).
drop policy if exists "read_all_reviews" on dietitian_reviews;
create policy "read_all_reviews" on dietitian_reviews
  for select to authenticated
  using (true);

-- Il paziente può inserire/modificare/eliminare SOLO la propria recensione,
-- e SOLO se ha almeno un appuntamento GIA' AVVENUTO (non nel futuro) e non
-- annullato con quel dietista — gli status in uso sono solo 'pending' e
-- 'cancelled' (nessun 'completed' esplicito), quindi il criterio di
-- "avvenuto" è la data passata, non lo status.
drop policy if exists "patient_review_if_had_appointment" on dietitian_reviews;
create policy "patient_review_if_had_appointment" on dietitian_reviews
  for insert to authenticated
  with check (
    auth.uid() = patient_id
    and exists (
      select 1 from appointments a
      where a.patient_id = auth.uid()
        and a.dietitian_id = dietitian_reviews.dietitian_id
        and a.appointment_date < now()
        and coalesce(a.status, 'pending') <> 'cancelled'
    )
  );

drop policy if exists "patient_update_own_review" on dietitian_reviews;
create policy "patient_update_own_review" on dietitian_reviews
  for update to authenticated
  using (auth.uid() = patient_id)
  with check (auth.uid() = patient_id);

drop policy if exists "patient_delete_own_review" on dietitian_reviews;
create policy "patient_delete_own_review" on dietitian_reviews
  for delete to authenticated
  using (auth.uid() = patient_id);
