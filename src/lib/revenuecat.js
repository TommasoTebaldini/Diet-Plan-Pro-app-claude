// Abbonamento Pro nell'app nativa (iOS/Android) via RevenueCat, che fa da
// wrapper unico su StoreKit (Apple) e Play Billing (Google) — obbligatori
// per vendere contenuti/funzionalità digitali dentro un'app nativa (Apple
// Guideline 3.1.1, policy equivalente su Play Store). Stripe (vedi
// SubscriptionPage.jsx) resta l'unico canale di pagamento sul web, dove
// quella regola non si applica.
//
// app_user_id di RevenueCat = id utente Supabase (impostato in initRevenueCat
// sotto): la funzione edge revenuecat-webhook (NutriPlan-Pro/supabase/
// functions/revenuecat-webhook) può quindi aggiornare profiles.subscription_plan
// / subscription_expires_at senza bisogno di una tabella di mapping separata,
// a differenza del flusso Stripe che usa user_payment_credentials perché lì
// l'identificatore lato provider è lo Stripe customer id, non l'uid Supabase.
//
// SETUP ANCORA DA FARE prima che questo modulo funzioni davvero (vedi
// android/RELEASE_SIGNING.md e la spiegazione già data in chat per il resto):
//   1. Creare i prodotti "abbonamento Pro mensile" in App Store Connect e
//      Play Console con lo stesso prezzo/periodo di Stripe.
//   2. Creare un progetto su RevenueCat, collegarlo ai due store, creare
//      un Entitlement "pro" e un Offering "default" con un package mensile
//      (RevenueCat lo chiama $rc_monthly se lo crei come "Monthly" standard
//      — se lo chiami diversamente in dashboard, aggiorna MONTHLY_PACKAGE_ID
//      sotto).
//   3. Prendere le due chiavi pubbliche SDK (iOS e Android, sono diverse)
//      da RevenueCat → Project settings → API keys, e metterle in
//      .env.local / variabili d'ambiente Vercel come VITE_REVENUECAT_IOS_KEY
//      e VITE_REVENUECAT_ANDROID_KEY.
//   4. Deployare revenuecat-webhook e incollarne l'URL in RevenueCat →
//      Project settings → Integrations → Webhooks, con l'authorization
//      header configurato lì e nel secret REVENUECAT_WEBHOOK_AUTH della
//      function (vedi commento in quel file).
//   5. `npx cap sync` dopo aver installato @revenuecat/purchases-capacitor
//      (già fatto in questo commit) per generare i progetti nativi.
import { Capacitor } from '@capacitor/core'

export const PRO_ENTITLEMENT_ID = 'pro'
export const MONTHLY_PACKAGE_ID = '$rc_monthly'

const IOS_API_KEY = import.meta.env.VITE_REVENUECAT_IOS_KEY || ''
const ANDROID_API_KEY = import.meta.env.VITE_REVENUECAT_ANDROID_KEY || ''

export function isRevenueCatSupported() {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() !== 'web'
}

function apiKeyForPlatform() {
  return Capacitor.getPlatform() === 'ios' ? IOS_API_KEY : ANDROID_API_KEY
}

let _configuredForUserId = null

// Va chiamata una volta per utente loggato (AppInner in App.jsx lo fa già
// per il contapassi con lo stesso pattern — vedi PedometerAutoStart), non a
// ogni render: Purchases.configure() riapre la connessione col backend RC,
// farlo ripetutamente è inutile e rallenta l'avvio. userId = uid Supabase,
// diventa l'app_user_id lato RevenueCat.
export async function initRevenueCat(userId) {
  if (!isRevenueCatSupported() || !userId || _configuredForUserId === userId) return
  const apiKey = apiKeyForPlatform()
  if (!apiKey) {
    console.warn('[revenuecat] Chiave API mancante per la piattaforma corrente — vedi src/lib/revenuecat.js per il setup richiesto.')
    return
  }
  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor')
    await Purchases.configure({ apiKey, appUserID: userId })
    _configuredForUserId = userId
  } catch (e) {
    console.error('[revenuecat] configure fallita:', e)
  }
}

// Da chiamare al logout per evitare che il prossimo utente sullo stesso
// dispositivo erediti l'identità RevenueCat di chi ha usato l'app prima
// (stesso principio di clearSensitiveLocalCaches in AuthContext.signOut).
export async function resetRevenueCat() {
  if (!isRevenueCatSupported() || !_configuredForUserId) return
  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor')
    await Purchases.logOut()
  } catch (e) {
    // logOut() rifiuta se l'utente corrente è già anonimo (mai configurato
    // con un appUserID reale) — non è un errore da segnalare.
    console.warn('[revenuecat] logOut (silenziato):', e?.message || e)
  } finally {
    _configuredForUserId = null
  }
}

// Ritorna il package mensile dell'offering di default, o null se non
// disponibile (rete assente, prodotto non ancora propagato dagli store,
// setup RevenueCat incompleto — il chiamante mostra un errore generico).
export async function getMonthlyPackage() {
  if (!isRevenueCatSupported()) return null
  const { Purchases } = await import('@revenuecat/purchases-capacitor')
  const offerings = await Purchases.getOfferings()
  const current = offerings.current
  if (!current) return null
  return current.availablePackages.find(p => p.identifier === MONTHLY_PACKAGE_ID)
    || current.monthly
    || null
}

// Avvia l'acquisto nativo (StoreKit/Play Billing dietro le quinte). Al
// successo l'entitlement è già attivo lato RevenueCat, ma profiles.
// subscription_plan si aggiorna solo quando arriva il webhook — il
// chiamante deve quindi comunque fare un refreshProfile() a breve, non
// fidarsi solo del return di questa funzione per aggiornare la UI.
export async function purchaseMonthlyPackage() {
  const pkg = await getMonthlyPackage()
  if (!pkg) throw new Error('Pacchetto abbonamento non disponibile al momento. Riprova tra poco.')
  const { Purchases } = await import('@revenuecat/purchases-capacitor')
  const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg })
  return isEntitlementActive(customerInfo)
}

export async function restorePurchases() {
  if (!isRevenueCatSupported()) return false
  const { Purchases } = await import('@revenuecat/purchases-capacitor')
  const { customerInfo } = await Purchases.restorePurchases()
  return isEntitlementActive(customerInfo)
}

function isEntitlementActive(customerInfo) {
  return !!customerInfo?.entitlements?.active?.[PRO_ENTITLEMENT_ID]
}

// Link alla gestione abbonamento nativa dello store — Apple/Google non
// permettono un flusso di cancellazione custom per gli acquisti in-app,
// va sempre reindirizzato qui (equivalente nativo del portale Stripe usato
// sul web).
export function openNativeSubscriptionManagement() {
  const url = Capacitor.getPlatform() === 'ios'
    ? 'itms-apps://apps.apple.com/account/subscriptions'
    : 'https://play.google.com/store/account/subscriptions'
  window.open(url, '_blank')
}
