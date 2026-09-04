import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { t } from '../i18n'
import { clearSensitiveLocalCaches } from '../lib/clearSensitiveCache'
import { syncPendingWrites, clearQueue } from '../lib/offlineDB'

const AuthContext = createContext({})

// ─── Profile localStorage cache (30-min TTL) ───────────────────────────────
// localStorage persists across PWA restarts → instant render on re-open
const PROFILE_CACHE_KEY = 'nutriplan_profile_v2'
const PROFILE_CACHE_TTL = 30 * 60 * 1000

function readProfileCache(userId) {
  try {
    const raw = localStorage.getItem(PROFILE_CACHE_KEY)
    if (!raw) return null
    const { data, ts, uid } = JSON.parse(raw)
    if (uid !== userId) return null
    if (Date.now() - ts > PROFILE_CACHE_TTL) { localStorage.removeItem(PROFILE_CACHE_KEY); return null }
    return data
  } catch { return null }
}

function writeProfileCache(userId, data) {
  try { localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify({ data, ts: Date.now(), uid: userId })) } catch {}
}

function clearProfileCache() {
  try { localStorage.removeItem(PROFILE_CACHE_KEY) } catch {}
}

// ─── Fast session peek: reads Supabase's own localStorage key synchronously ──
// Avoids showing LoadingScreen when the user was already logged in.
// Must match the `storageKey` passed to createClient() in lib/supabase.js
// ('nutriplan_patient_auth') — this used to scan for the default 'sb-*
// -auth-token' pattern, which supabase-js only uses when storageKey is left
// unset. Since this project sets a custom storageKey, that scan never
// matched anything: the cache-hit fast path was silently dead code, so
// every app open showed the full LoadingScreen (and, on flaky storage
// reads, could briefly render the login form) even with a perfectly valid
// persisted session, instead of painting the dashboard straight away.
const SUPABASE_STORAGE_KEY = 'nutriplan_patient_auth'
function peekSession() {
  try {
    const val = JSON.parse(localStorage.getItem(SUPABASE_STORAGE_KEY) || 'null')
    const exp = val?.expires_at
    if (exp && exp * 1000 > Date.now() + 30_000) return val?.user ?? null
  } catch { /* ignore */ }
  return null
}

export function AuthProvider({ children }) {
  // Optimistic init: if Supabase token in localStorage and profile cached → show app immediately
  const _peek = peekSession()
  const _cachedProfile = _peek ? readProfileCache(_peek.id) : null

  const [user, setUser] = useState(_peek)
  const [profile, setProfile] = useState(_cachedProfile)
  const [loading, setLoading] = useState(!_cachedProfile)  // false if cache hit → instant render

  // Rispecchia sempre l'utente autenticato "corrente" per i controlli di
  // staleness nelle callback async sotto — un ref, non lo state, perché va
  // letto dentro closure di promise già in volo senza rientrare nel ciclo di
  // render.
  const currentUserIdRef = useRef(_peek?.id ?? null)

  const fetchProfile = useCallback(async (userId) => {
    // ① Serve from cache immediately — zero wait
    const cached = readProfileCache(userId)
    if (cached) {
      setProfile(cached)
      setLoading(false)
      // Background refresh (don't block render). Se nel frattempo l'utente
      // ha fatto logout (o è cambiato, dispositivo condiviso) prima che
      // questa risposta arrivi, non va applicata: altrimenti ripopolerebbe
      // profilo/cache dell'utente precedente subito dopo che signOut() li ha
      // esplicitamente svuotati.
      supabase.from('profiles').select('id,email,role,full_name,first_name,last_name,avatar_url,target_weight,height_cm,birth_date,gender,activity_level,intolerances,food_preferences,last_seen_at,ai_photo_consent_at,coach_ai_consent_at,nutrition_goal').eq('id', userId).single().then(({ data, error }) => {
        if (!error && data && currentUserIdRef.current === userId) { setProfile(data); writeProfileCache(userId, data) }
      })
      return
    }
    // ② No cache — fetch then render
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id,email,role,full_name,first_name,last_name,avatar_url,target_weight,height_cm,birth_date,gender,activity_level,intolerances,food_preferences,last_seen_at,ai_photo_consent_at,coach_ai_consent_at,nutrition_goal')
        .eq('id', userId)
        .single()
      if (!error && data) { setProfile(data); writeProfileCache(userId, data) }
    } catch (e) {
      console.error('Error fetching profile:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Safety net: never show LoadingScreen for more than 4s
    const safetyTimer = setTimeout(() => setLoading(false), 4000)

    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(safetyTimer)
      const u = session?.user ?? null
      currentUserIdRef.current = u?.id ?? null
      setUser(u)
      if (u) fetchProfile(u.id)
      else { setProfile(null); setLoading(false) }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      currentUserIdRef.current = u?.id ?? null
      setUser(u)
      if (u) {
        fetchProfile(u.id)
        // Auto-link to dietitian if patient registered via invite link.
        // Validated server-side (SEZIONE 93 di supabase_setup.sql): la RPC
        // verifica che ref sia davvero un dietista con account approvato
        // prima di collegarlo, non un insert diretto su un UUID qualsiasi.
        if (_event === 'SIGNED_IN') {
          const ref = localStorage.getItem('pending_dietitian_ref')
          if (ref && ref.length > 10) {
            supabase.rpc('link_patient_to_dietitian_via_ref', { p_dietitian_id: ref })
              .then(({ data, error }) => {
                if (!error && data === true) localStorage.removeItem('pending_dietitian_ref')
              })
          }
        }
      } else { clearProfileCache(); setProfile(null); setLoading(false) }
    })

    return () => { clearTimeout(safetyTimer); subscription.unsubscribe() }
  }, [fetchProfile])

  const refreshProfile = useCallback(async () => {
    if (user) {
      clearProfileCache()
      await fetchProfile(user.id)
    }
  }, [user, fetchProfile])

  // Any supabase.auth.*()/rpc() call can hang indefinitely instead of
  // rejecting — seen in WKWebView/native builds when it contends with a
  // concurrent autoRefreshToken cycle for supabase-js's internal auth
  // mutex, and none of them have a built-in timeout. Without this race, an
  // unlucky call left whatever button triggered it (login, the AppLockGate
  // re-lock screen, registration — all of them go through here) permanently
  // stuck in its loading state with no error, recoverable only by reloading
  // the whole page. 15s is generous for a network call; a real failure (bad
  // password, offline) normally resolves in <1s.
  const withAuthTimeout = useCallback(async (promise) => {
    try {
      return await Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 15000)),
      ])
    } catch (e) {
      const error = e?.message === 'timeout'
        ? new Error(t('auth.error_timeout', 'Il server non risponde. Controlla la connessione e riprova.'))
        : (e instanceof Error ? e : new Error(String(e)))
      return { data: null, error }
    }
  }, [])

  const signIn = useCallback(async (email, password) => {
    return withAuthTimeout(supabase.auth.signInWithPassword({ email, password }))
  }, [withAuthTimeout])

  const signUp = useCallback(async (email, password, metadata) => {
    const { termsAccepted, ...rest } = metadata || {}
    const { data, error } = await withAuthTimeout(supabase.auth.signUp({
      email,
      password,
      options: { data: { ...rest, role: 'patient' } }
    }))
    if (!error && data?.user) {
      // Il trigger DB che creava il profilo automaticamente non esiste più su
      // questo progetto (rimosso lato NutriPlan-Pro, vedi supabase_setup.sql
      // SEZIONE 52) — senza questa chiamata esplicita l'account resterebbe
      // senza riga in profiles. RPC SECURITY DEFINER, funziona anche senza
      // sessione attiva (caso conferma email obbligatoria).
      // SEZIONE 76: la RPC non ingoia più i propri errori — se fallisce (auth.
      // users creato ma profiles no), va segnalato come errore di signUp
      // invece di lasciar credere alla UI che la registrazione sia riuscita.
      const { error: profileErr } = await withAuthTimeout(supabase.rpc('create_patient_profile', {
        uid: data.user.id,
        user_email: email,
        p_full_name: rest.full_name || null,
        p_first_name: rest.first_name || null,
        p_last_name: rest.last_name || null,
        terms_accepted: !!termsAccepted,
      }))
      if (profileErr) {
        console.error('create_patient_profile failed:', profileErr)
        return { data, error: profileErr }
      }
    }
    return { data, error }
  }, [withAuthTimeout])

  // Consenso esplicito per l'analisi AI delle foto pasto (Google Gemini,
  // dati sanitari) — richiesto prima del primo utilizzo della funzione,
  // vedi MealPhotoAnalyzer.jsx. Semplice UPDATE diretto: l'utente è già
  // autenticato a questo punto, protetto dalla policy profiles_update_own.
  const recordAiPhotoConsent = useCallback(async () => {
    if (!user) return { error: new Error(t('common.err_not_authenticated', 'Utente non autenticato')) }
    const now = new Date().toISOString()
    const { error } = await supabase.from('profiles').update({ ai_photo_consent_at: now }).eq('id', user.id)
    if (!error) {
      setProfile(p => (p ? { ...p, ai_photo_consent_at: now } : p))
      const cached = readProfileCache(user.id)
      if (cached) writeProfileCache(user.id, { ...cached, ai_photo_consent_at: now })
    }
    return { error }
  }, [user])

  // Consenso esplicito per il Coach AI conversazionale (Groq/Llama) —
  // distinto dal consenso foto pasto (fornitore diverso, funzione diversa).
  // Richiesto prima del primo utilizzo, vedi CoachAiPage.jsx.
  const recordCoachAiConsent = useCallback(async () => {
    if (!user) return { error: new Error(t('common.err_not_authenticated', 'Utente non autenticato')) }
    const now = new Date().toISOString()
    const { error } = await supabase.from('profiles').update({ coach_ai_consent_at: now }).eq('id', user.id)
    if (!error) {
      setProfile(p => (p ? { ...p, coach_ai_consent_at: now } : p))
      const cached = readProfileCache(user.id)
      if (cached) writeProfileCache(user.id, { ...cached, coach_ai_consent_at: now })
    }
    return { error }
  }, [user])

  const signOut = useCallback(async () => {
    // Invalida subito i refresh di profilo in volo (vedi fetchProfile) prima
    // di iniziare le operazioni async di logout sotto — altrimenti una
    // risposta che arriva durante l'await di syncPendingWrites()/signOut()
    // potrebbe ancora passare il controllo se letta più tardi.
    currentUserIdRef.current = null
    clearProfileCache()
    clearSensitiveLocalCaches()
    // Best-effort: prova a sincronizzare eventuali scritture offline in coda
    // prima di svuotare la coda, per non perdere dati non ancora salvati
    // (es. un peso registrato offline poco prima del logout). Se è tutta
    // roba già sincronizzata, clearQueue() è comunque necessario: altrimenti
    // resterebbe in IndexedDB, leggibile dal prossimo utente sullo stesso
    // dispositivo condiviso.
    try { await syncPendingWrites() } catch { /* offline o già vuota, si prosegue comunque */ }
    await clearQueue()
    await supabase.auth.signOut()
  }, [])

  const isDietitian = profile?.role === 'dietitian'

  const value = useMemo(() => ({
    user, profile, loading, isDietitian,
    signIn, signUp, signOut, refreshProfile, recordAiPhotoConsent, recordCoachAiConsent,
  }), [user, profile, loading, isDietitian, signIn, signUp, signOut, refreshProfile, recordAiPhotoConsent, recordCoachAiConsent])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
