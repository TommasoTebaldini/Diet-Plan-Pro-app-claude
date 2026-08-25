// Chiamato da signOut() — prima, solo PROFILE_CACHE_KEY veniva ripulito al
// logout: le cache locali degli strumenti clinici (checklist DCA, letture di
// frequenza cardiaca, storici dose insulina/GKI) restavano in localStorage
// indefinitamente, leggibili dal prossimo utente che accede allo stesso
// dispositivo/browser (es. device condiviso in famiglia). Queste chiavi non
// sono nemmeno namespaced per utente (sono per-data, es. "dca_meals_2026-08-
// 25"), quindi il problema esiste a prescindere da CHI ha effettuato il
// login prima.
const SENSITIVE_KEY_PREFIXES = [
  'dca_',        // DcaChecklist.jsx — checklist/note disturbo alimentare
  'disfagia_',   // DisfagiaGuide.jsx — checklist sicurezza deglutizione
  'pancreas_',   // PancreasCalculator.jsx — dosaggio enzimi PERT
  'ped_meals_',  // PediatriaTracker.jsx — pasti pediatrici
  'hr_',         // HealthSyncPage.jsx — letture frequenza cardiaca
]
const SENSITIVE_EXACT_KEYS = [
  'gki_history_v1',              // ChetogenicaCalculator.jsx
  'diabete_dose_history_v1',     // DiabeteCalculator.jsx
]

export function clearSensitiveLocalCaches() {
  try {
    const keys = Object.keys(localStorage)
    for (const key of keys) {
      if (SENSITIVE_EXACT_KEYS.includes(key) || SENSITIVE_KEY_PREFIXES.some(p => key.startsWith(p))) {
        localStorage.removeItem(key)
      }
    }
  } catch {
    // storage non disponibile — niente da pulire
  }
}
