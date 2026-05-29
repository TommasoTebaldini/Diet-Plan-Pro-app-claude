import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

// ─── Profile sessionStorage cache (10-min TTL) ─────────────────────────────
const PROFILE_CACHE_KEY = 'nutriplan_profile_v1'
const PROFILE_CACHE_TTL = 10 * 60 * 1000

function readProfileCache(userId) {
  try {
    const raw = sessionStorage.getItem(PROFILE_CACHE_KEY)
    if (!raw) return null
    const { data, ts, uid } = JSON.parse(raw)
    if (uid !== userId) return null
    if (Date.now() - ts > PROFILE_CACHE_TTL) { sessionStorage.removeItem(PROFILE_CACHE_KEY); return null }
    return data
  } catch { return null }
}

function writeProfileCache(userId, data) {
  try { sessionStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify({ data, ts: Date.now(), uid: userId })) } catch {}
}

function clearProfileCache() {
  try { sessionStorage.removeItem(PROFILE_CACHE_KEY) } catch {}
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId) => {
    // ① Serve from cache immediately — zero wait
    const cached = readProfileCache(userId)
    if (cached) {
      setProfile(cached)
      setLoading(false)
      // Background refresh (don't block render)
      supabase.from('profiles').select('*').eq('id', userId).single().then(({ data, error }) => {
        if (!error && data) { setProfile(data); writeProfileCache(userId, data) }
      })
      return
    }
    // ② No cache — fetch and then render
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
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
    // Safety net: release loading after 6s (down from 8s) if Supabase stalls
    const safetyTimer = setTimeout(() => setLoading(false), 3000)

    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(safetyTimer)
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
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
