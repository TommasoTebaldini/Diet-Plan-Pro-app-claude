import { supabase } from './supabase'
import { SPECIALTY_KEYS } from '../data/specialtyMeta'

// Notes are written with JSON.stringify(dati) by most specialist pages (so the
// jsonb column holds a JSON-encoded string) but gravidanza.html passes a raw
// object — normalize both here so callers never have to think about it.
function parseDati(raw) {
  if (!raw) return {}
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) } catch { return {} }
  }
  return raw
}

async function resolveCartellaIds(userId) {
  const { data: links } = await supabase
    .from('patient_dietitian')
    .select('cartella_id')
    .eq('patient_id', userId)
  return [...new Set((links || []).map(l => l.cartella_id).filter(Boolean))]
}

// A pathology section is visible to the patient purely based on
// patient_specialty_access.enabled — NOT on whether any note_specialistiche
// row happens to have visible_to_patient=true. That flag only gates the
// generic document-style views elsewhere in NutriPlan-Pro; here the dietitian
// enables/disables a whole section independently of what's been saved.
export async function fetchEnabledSpecialties(userId) {
  if (!userId) return []
  const { data, error } = await supabase
    .from('patient_specialty_access')
    .select('specialty')
    .eq('patient_id', userId)
    .eq('enabled', true)
  if (error || !data) return []
  return data.map(r => r.specialty).filter(k => SPECIALTY_KEYS.includes(k))
}

// Returns, for every enabled specialty, its most recent note_specialistiche
// entry (the data source) — or `note: null` if the dietitian enabled the
// section but hasn't saved any data for it yet.
export async function fetchSpecialSections(userId) {
  if (!userId) return []
  const enabled = await fetchEnabledSpecialties(userId)
  if (!enabled.length) return []

  const cartellaIds = await resolveCartellaIds(userId)
  let latestByTipo = {}
  if (cartellaIds.length) {
    const { data } = await supabase
      .from('note_specialistiche')
      .select('id, tipo, nota, dati, created_at, updated_at')
      .in('cartella_id', cartellaIds)
      .in('tipo', enabled)
      .order('created_at', { ascending: false })
    for (const row of data || []) {
      if (!latestByTipo[row.tipo]) latestByTipo[row.tipo] = { ...row, dati: parseDati(row.dati) }
    }
  }

  return enabled.map(key => ({ key, note: latestByTipo[key] || null }))
}
