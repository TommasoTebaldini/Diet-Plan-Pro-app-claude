import { useAuth } from '../context/AuthContext'

// ─── Payments flag ────────────────────────────────────────────────────────────
// Set to true when Stripe is configured and live.
// While false: all patients are treated as Pro, all payment UI is hidden.
export const PAYMENTS_ACTIVE = false

// ─── Plan definitions ─────────────────────────────────────────────────────────
export const FREE_FEATURES = [
  'Piano alimentare del dietista',
  'Diario alimentare (ultimi 7 giorni)',
  'Chat con il tuo dietista',
  'Documenti e referti',
  'Database alimenti CREA+BDA',
  'Tracciamento acqua',
  'Peso corporeo base',
  'Benessere giornaliero',
]

export const PRO_FEATURES = [
  'Diario alimentare illimitato (storico completo)',
  'Micronutrienti dettagliati (vitamine, minerali, fibre)',
  'Statistiche avanzate e grafici trend',
  'Analisi aderenza al piano del dietista',
  'Report PDF settimanale/mensile',
  'Attività fisica avanzata',
  'Progressi avanzati con grafici storici',
  'Ricette personali illimitate',
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
