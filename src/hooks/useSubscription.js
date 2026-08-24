import { useAuth } from '../context/AuthContext'

// ─── Payments flag ────────────────────────────────────────────────────────────
// Set to true when Stripe is configured and live.
// While false: all patients are treated as Pro, all payment UI is hidden.
export const PAYMENTS_ACTIVE = false

// ─── Plan definitions ─────────────────────────────────────────────────────────
// Module-level constants: cannot call useT() here (not inside a hook/component).
// Each entry carries an i18n `key` plus the Italian text as fallback; consumers
// (e.g. SubscriptionPage) translate at render time via t(entry.key, entry.label).
export const FREE_FEATURES = [
  { key: 'subfeature.diet_plan', label: 'Piano alimentare del dietista' },
  { key: 'subfeature.diary_7_days', label: 'Diario alimentare (ultimi 7 giorni)' },
  { key: 'subfeature.chat_dietitian', label: 'Chat con il tuo dietista' },
  { key: 'subfeature.documents', label: 'Documenti e referti' },
  { key: 'subfeature.food_database', label: 'Database alimenti CREA+BDA' },
  { key: 'subfeature.water_tracking', label: 'Tracciamento acqua' },
  { key: 'subfeature.weight_basic', label: 'Peso corporeo base' },
  { key: 'subfeature.daily_wellness', label: 'Benessere giornaliero' },
]

export const PRO_FEATURES = [
  { key: 'subfeature.diary_unlimited', label: 'Diario alimentare illimitato (storico completo)' },
  { key: 'subfeature.micronutrients_detailed', label: 'Micronutrienti dettagliati (vitamine, minerali, fibre)' },
  { key: 'subfeature.stats_advanced', label: 'Statistiche avanzate e grafici trend' },
  { key: 'subfeature.adherence_analysis', label: 'Analisi aderenza al piano del dietista' },
  { key: 'subfeature.pdf_report', label: 'Report PDF settimanale/mensile' },
  { key: 'subfeature.activity_advanced', label: 'Attività fisica avanzata' },
  { key: 'subfeature.progress_advanced', label: 'Progressi avanzati con grafici storici' },
  { key: 'subfeature.recipes_unlimited', label: 'Ricette personali illimitate' },
]

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useSubscription() {
  const { profile } = useAuth()

  if (!PAYMENTS_ACTIVE) {
    return { isPro: true, paymentsActive: false, plan: 'pro', expiresAt: null }
  }

  const plan = profile?.subscription_plan || 'free'
  const expiresAt = profile?.subscription_expires_at || null
  const isPro = plan === 'pro' && (!expiresAt || new Date(expiresAt) > new Date())

  return { isPro, paymentsActive: true, plan: isPro ? 'pro' : 'free', expiresAt }
}
