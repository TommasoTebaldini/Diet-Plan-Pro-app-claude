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

// Fetches every note_specialistiche row the dietitian has made visible to this
// patient, restricted to the 12 pathology types shown in the "Speciale" section
// (excludes 'questionario'/'consiglio'/'soap_note'/'ristorazione' etc.).
export async function fetchVisibleSpecialtyNotes(userId) {
  if (!userId) return []
  const { data: links } = await supabase
    .from('patient_dietitian')
    .select('cartella_id')
    .eq('patient_id', userId)
  const cartellaIds = [...new Set((links || []).map(l => l.cartella_id).filter(Boolean))]
  if (!cartellaIds.length) return []

  const { data, error } = await supabase
    .from('note_specialistiche')
    .select('id, tipo, nota, dati, created_at, updated_at')
    .in('cartella_id', cartellaIds)
    .in('tipo', SPECIALTY_KEYS)
    .eq('visible_to_patient', true)
    .order('created_at', { ascending: false })
  if (error || !data) return []

  return data.map(row => ({ ...row, dati: parseDati(row.dati) }))
}
