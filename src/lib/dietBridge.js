/**
 * dietBridge: legge piano e macro target dalle tabelle NutriPlan-Pro.
 *
 * Strategia macro target (in ordine di priorità):
 *   1. RPC get_my_macro_targets() — SECURITY DEFINER, bypassa RLS,
 *      funziona anche se visible_to_patient = false.
 *      Richiede di eseguire la funzione SQL una volta in Supabase.
 *   2. Query dirette a ncpt + schede_valutazione (fallback; funziona
 *      solo se visible_to_patient = true o patient_id è impostato).
 */
import { supabase } from './supabase'

// ── Calcolo macro da ncpt.intervento ─────────────────────────────────────────
function _parseInterventoMacros(ncptRow) {
  if (!ncptRow?.intervento) return null
  let i = {}
  try { i = typeof ncptRow.intervento === 'string' ? JSON.parse(ncptRow.intervento) : (ncptRow.intervento || {}) } catch {}
  const kcal = parseFloat(i.kcal)   || null
  const prot = parseFloat(i.prot)   || null
  const cho  = parseFloat(i.cho)    || null
  const fat  = parseFloat(i.grassi || i.fat) || null
  if (!kcal && !prot) return null
  return { kcal_target: kcal, protein_target: prot, carbs_target: cho, fats_target: fat }
}

// ── Calcolo macro da schede_valutazione ──────────────────────────────────────
function _parseSchedaMacros(schedaRow) {
  if (!schedaRow?.tdee_calcolato) return null
  const tdee = parseFloat(schedaRow.tdee_calcolato)
  if (!tdee || tdee < 500) return null
  let md = {}
  try { md = typeof schedaRow.macro_dist === 'string' ? JSON.parse(schedaRow.macro_dist) : (schedaRow.macro_dist || {}) } catch {}
  const protPct = md.prot_mode !== 'gkg' ? (parseFloat(md.prot) || 20) : null
  const choPct  = md.cho_mode  !== 'gkg' ? (parseFloat(md.cho)  || 50) : null
  const fatPct  = md.fat_mode  !== 'gkg' ? (parseFloat(md.fat)  || 30) : null
  return {
    kcal_target:    Math.round(tdee),
    protein_target: protPct != null ? Math.round(tdee * protPct / 100 / 4) : null,
    carbs_target:   choPct  != null ? Math.round(tdee * choPct  / 100 / 4) : null,
    fats_target:    fatPct  != null ? Math.round(tdee * fatPct  / 100 / 9) : null,
  }
}

/**
 * Restituisce un oggetto dieta sintetica leggibile dal paziente,
 * costruito da piani + ncpt/schede_valutazione di NutriPlan-Pro.
 * Restituisce null se nessun dato trovato.
 */
export async function fetchDietFromPiani(patientId) {
  // 1. Trova cartella collegata al paziente
  const { data: link } = await supabase
    .from('patient_dietitian')
    .select('cartella_id')
    .eq('patient_id', patientId)
    .maybeSingle()
  if (!link?.cartella_id) return null

  const cid = link.cartella_id

  // 2. Piano (nome) + macro target in parallelo
  //    Per i macro: prima RPC (bypassa RLS), poi query dirette (fallback)
  const [pianoRes, rpcRes] = await Promise.allSettled([
    supabase.from('piani')
      .select('id,nome,saved_at')
      .eq('cartella_id', cid)
      .eq('visible_to_patient', true)
      .order('saved_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.rpc('get_my_macro_targets'),
  ])

  const piano = pianoRes.status === 'fulfilled' ? pianoRes.value?.data : null

  // Macro: prova prima la RPC, poi fallback a query dirette
  let macros
  const rpcData = rpcRes.status === 'fulfilled' ? rpcRes.value?.data : null
  if (rpcData && (rpcData.kcal_target || rpcData.protein_target)) {
    macros = rpcData
  } else {
    // Fallback: query dirette (funziona se visible_to_patient=true o patient_id settato)
    const [ncptRes, schedaRes] = await Promise.allSettled([
      supabase.from('ncpt')
        .select('intervento')
        .eq('cartella_id', cid)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase.from('schede_valutazione')
        .select('tdee_calcolato,macro_dist')
        .eq('cartella_id', cid)
        .order('saved_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ])
    const ncpt   = ncptRes.status   === 'fulfilled' ? ncptRes.value?.data   : null
    const scheda = schedaRes.status === 'fulfilled' ? schedaRes.value?.data : null
    macros = _parseInterventoMacros(ncpt) || _parseSchedaMacros(scheda) || {}
  }

  if (!piano && !macros.kcal_target) return null

  return {
    id:             piano?.id ?? cid,
    name:           piano?.nome || 'Piano alimentare',
    kcal_target:    macros.kcal_target    ?? null,
    protein_target: macros.protein_target ?? null,
    carbs_target:   macros.carbs_target   ?? null,
    fats_target:    macros.fats_target    ?? null,
  }
}
