// _shared/monthlyQuota.ts — quota mensile DURATURA per utente (vedi
// supabase-schema.sql / supabase_setup.sql, tabella usage_counters + RPC
// increment_usage_and_check). _shared/rateLimit.ts protegge dagli abusi al
// minuto ma è esplicitamente per-istanza/non garantito su finestre lunghe
// (vedi commento in quel file) — inadatto a un tetto mensile reale. Qui il
// contatore vive in Postgres, incrementato atomicamente via RPC usando lo
// stesso client Supabase già usato per verificare la sessione (inoltra
// automaticamente l'Authorization header dell'utente, così auth.uid() dentro
// la funzione corrisponde davvero a chi sta chiamando).
//
// Fail-open per design: se la RPC non è ancora deployata o Supabase non
// risponde, non blocchiamo un utente pagante per un problema nostro.

// deno-lint-ignore no-explicit-any
export async function checkMonthlyQuota(
  supabase: any,
  userId: string,
  scope: string,
  max: number,
): Promise<boolean> {
  const period = new Date().toISOString().slice(0, 7) // 'YYYY-MM', UTC
  try {
    const { data, error } = await supabase.rpc('increment_usage_and_check', {
      p_user_id: userId,
      p_scope: scope,
      p_period: period,
      p_max: max,
    })
    if (error) return true // RPC non ancora deployata o errore infra: fail-open
    return Boolean(data)
  } catch {
    return true
  }
}
