-- ============================================================
-- TRIGGER: auto-aggiorna cartelle.gdpr_consenso quando il
-- paziente firma un documento di tipo 'gdpr' dall'app paziente.
-- Esegui questo SQL nel SQL Editor di Supabase.
-- ============================================================

create or replace function _auto_gdpr_consent()
returns trigger language plpgsql security definer as $$
begin
  -- Scatta solo quando signed_at passa da NULL a valorizzato e il tipo e' 'gdpr'
  if new.type = 'gdpr' and new.signed_at is not null
     and (old.signed_at is null) then
    update cartelle c
    set gdpr_consenso    = true,
        gdpr_consenso_at = new.signed_at
    from patient_dietitian pd
    where pd.patient_id   = new.patient_id
      and pd.dietitian_id = new.dietitian_id
      and pd.cartella_id  is not null
      and pd.cartella_id  = c.id
      and (c.gdpr_consenso is null or c.gdpr_consenso = false);
  end if;
  return new;
end;
$$;

drop trigger if exists trg_auto_gdpr_consent on patient_documents;
create trigger trg_auto_gdpr_consent
  after update of signed_at on patient_documents
  for each row execute function _auto_gdpr_consent();
