import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { supabase } from '../lib/supabase'

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
// Avoids showing LoadingScreen when the user was already logged in
function peekSession() {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
        const val = JSON.parse(localStorage.getItem(key) || 'null')
        const exp = val?.expires_at
        if (exp && exp * 1000 > Date.now() + 30_000) return val?.user ?? null
      }
    }
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

  const fetchProfile = useCallback(async (userId) => {
    // ① Serve from cache immediately — zero wait
    const cached = readProfileCache(userId)
    if (cached) {
      setProfile(cached)
      setLoading(false)
      // Background refresh (don't block render)
      supabase.from('profiles').select('id,email,role,full_name,first_name,last_name,avatar_url,target_weight,height_cm,birth_date,gender,activity_level,intolerances,food_preferences,last_seen_at').eq('id', userId).single().then(({ data, error }) => {
        if (!error && data) { setProfile(data); writeProfileCache(userId, data) }
      })
      return
    }
    // ② No cache — fetch then render
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id,email,role,full_name,first_name,last_name,avatar_url,target_weight,height_cm,birth_date,gender,activity_level,intolerances,food_preferences,last_seen_at')
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
      setUser(u)
      if (u) fetchProfile(u.id)
      else { setProfile(null); setLoading(false) }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        fetchProfile(u.id)
        // Auto-link to dietitian if patient registered via invite link
        if (_event === 'SIGNED_IN') {
          const ref = localStorage.getItem('pending_dietitian_ref')
          if (ref && ref.length > 10) {
            supabase.from('patient_dietitian')
              .insert({ patient_id: u.id, dietitian_id: ref })
              .then(({ error }) => {
                if (!error) localStorage.removeItem('pending_dietitian_ref')
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

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }, [])

  const signUp = useCallback(async (email, password, metadata) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { ...metadata, role: 'patient' } }
    })
    return { data, error }
  }, [])

  const signOut = useCallback(async () => {
    clearProfileCache()
    await supabase.auth.signOut()
  }, [])

  const isDietitian = profile?.role === 'dietitian'

  const value = useMemo(() => ({
    user, profile, loading, isDietitian,
    signIn, signUp, signOut, refreshProfile,
  }), [user, profile, loading, isDietitian, signIn, signUp, signOut, refreshProfile])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
