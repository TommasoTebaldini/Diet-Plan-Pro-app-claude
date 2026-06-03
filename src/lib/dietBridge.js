/**
 * dietBridge: legge piano e macro target dalle tabelle NutriPlan-Pro
 * (piani, ncpt, schede_valutazione) via patient_dietitian.
 *
 * Priorità macro target:
 *   1. ncpt.intervento  → {kcal, prot, cho, grassi} in grammi prescritti
 *   2. schede_valutazione → tdee_calcolato + macro_dist (%) → calcola grammi
 */
import { supabase } from './supabase'

function _parseInterventoMacros(ncptRow) {
  if (!ncptRow?.intervento) return null
  let i = {}
  try { i = typeof ncptRow.intervento === 'string' ? JSON.parse(ncptRow.intervento) : (ncptRow.intervento || {}) } catch {}
  const kcal = parseFloat(i.kcal) || null
  const prot = parseFloat(i.prot) || null
  const cho  = parseFloat(i.cho)  || null
  const fat  = parseFloat(i.grassi || i.fat) || null
  // Serve almeno kcal o prot per essere utile
  if (!kcal && !prot) return null
  return { kcal_target: kcal, protein_target: prot, carbs_target: cho, fats_target: fat }
}

function _parseSchedaMacros(schedaRow) {
  if (!schedaRow?.tdee_calcolato) return null
  const tdee = parseFloat(schedaRow.tdee_calcolato)
  if (!tdee || tdee < 500) return null
  let md = {}
  try { md = typeof schedaRow.macro_dist === 'string' ? JSON.parse(schedaRow.macro_dist) : (schedaRow.macro_dist || {}) } catch {}
  // Usa la modalità percentuale; se gkg non abbiamo il peso qui
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
 * Restituisce un oggetto "dieta sintetica" leggibile dal paziente,
 * costruito dalle tabelle NutriPlan-Pro. Null se nessun dato trovato.
 */
export async function fetchDietFromPiani(patientId) {
  // 1. Trova la cartella collegata al paziente
  const { data: link } = await supabase
    .from('patient_dietitian')
    .select('cartella_id')
    .eq('patient_id', patientId)
    .maybeSingle()
  if (!link?.cartella_id) return null

  const cid = link.cartella_id

  // 2. Leggi piano, ncpt e scheda in parallelo
  const [pianoRes, ncptRes, schedaRes] = await Promise.allSettled([
    supabase.from('piani')
      .select('id,nome,saved_at')
      .eq('cartella_id', cid)
      .eq('visible_to_patient', true)
      .order('saved_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
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

  const piano  = pianoRes.status  === 'fulfilled' ? pianoRes.value?.data  : null
  const ncpt   = ncptRes.status   === 'fulfilled' ? ncptRes.value?.data   : null
  const scheda = schedaRes.status === 'fulfilled' ? schedaRes.value?.data : null

  // Macro target: ncpt.intervento → scheda_valutazione → nessuno
  const macros = _parseInterventoMacros(ncpt) || _parseSchedaMacros(scheda) || {}

  // Serve almeno un piano o dei target per restituire qualcosa
  if (!piano && !macros.kcal_target) return null

  return {
    id:   piano?.id ?? cid,
    name: piano?.nome || 'Piano alimentare',
    kcal_target:    macros.kcal_target    ?? null,
    protein_target: macros.protein_target ?? null,
    carbs_target:   macros.carbs_target   ?? null,
    fats_target:    macros.fats_target    ?? null,
  }
}
