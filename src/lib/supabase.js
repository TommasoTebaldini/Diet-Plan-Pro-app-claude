import { createClient } from '@supabase/supabase-js'

// These will be replaced with your actual Supabase credentials
// from your existing nutri-plan-pro project
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'nutriplan_patient_auth',
  }
})

// Resolves the patient's linked dietitian id, used to tag chat_messages
// rows (see SEZIONE 73 in NutriPlan-Pro's supabase_setup.sql) so RLS can
// scope a message to the specific dietitian relationship it belongs to,
// instead of any dietitian ever linked to the patient.
export async function getMyDietitianId(patientId) {
  const { data } = await supabase
    .from('patient_dietitian')
    .select('dietitian_id')
    .eq('patient_id', patientId)
    .limit(1)
    .maybeSingle()
  return data?.dietitian_id || null
}
