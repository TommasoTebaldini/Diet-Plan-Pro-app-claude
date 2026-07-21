import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Sparkles, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'

const CACHE_KEY = 'nutriplan_daily_tips'

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { date, tips } = JSON.parse(raw)
    const today = new Date().toISOString().split('T')[0]
    return date === today ? tips : null
  } catch { return null }
}

function saveCache(tips) {
  const today = new Date().toISOString().split('T')[0]
  localStorage.setItem(CACHE_KEY, JSON.stringify({ date: today, tips }))
}

const CATEGORY_COLOR = {
  macros:     { bg: '#fef3c7', text: '#92400e' },
  sugar:      { bg: '#fce7f3', text: '#9d174d' },
  hydration:  { bg: '#dbeafe', text: '#1e40af' },
  protein:    { bg: '#d1fae5', text: '#065f46' },
  fiber:      { bg: '#ecfdf5', text: '#047857' },
  habit:      { bg: '#f3f4f6', text: '#374151' },
  mood:       { bg: '#ede9fe', text: '#4c1d95' },
}

export default function DailyTipsCard() {
  const { user } = useAuth()
  const [tips, setTips] = useState(() => loadCache())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(true)
  const [noData, setNoData] = useState(false)

  const fetchTips = useCallback(async (force = false) => {
    if (!force) {
      const cached = loadCache()
      if (cached) { setTips(cached); return }
    }
    // La edge function daily-tips richiede il JWT: se la sessione non è ancora
    // pronta, functions.invoke partirebbe senza header Authorization e il
    // gateway Supabase risponde "Missing authorization header". Aspetta la
    // sessione invece di fallire con un errore rumoroso in console.
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    setLoading(true)
    setError('')
    setNoData(false)
    try {
      const { data, error } = await supabase.functions.invoke('daily-tips', { method: 'POST' })
      if (error) throw new Error(error.message || 'Errore AI')
      if (data?.noData) { setNoData(true); setTips([]); return }
      setTips(data?.tips || [])
      if (data?.tips?.length) saveCache(data.tips)
    } catch (e) {
      setError(e.message || 'Errore nel caricare i suggerimenti')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetchTips() }, [fetchTips])

  // Don't render if no data yesterday and not loading
  if (noData && !loading) return null

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 14px', cursor: 'pointer' }}
        onClick={() => setExpanded(e => !e)}
      >
        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Sparkles size={16} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>Suggerimenti AI di oggi</p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
            {loading ? 'Analisi in corso…' : tips?.length ? `${tips.length} consigli basati su ieri` : 'Personalizzati per te'}
          </p>
        </div>
        <button
          onClick={e => { e.stopPropagation(); fetchTips(true) }}
          disabled={loading}
          title="Aggiorna suggerimenti"
          style={{ background: 'none', border: 'none', cursor: loading ? 'default' : 'pointer', padding: 8, color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
        >
          <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
        </button>
        {expanded ? <ChevronUp size={15} color="var(--text-muted)" /> : <ChevronDown size={15} color="var(--text-muted)" />}
      </div>

      {expanded && (
        <div style={{ borderTop: '1px solid var(--border-light)', padding: '10px 14px 14px' }}>
          {/* Loading skeleton */}
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[1, 2].map(i => (
                <div key={i} style={{ height: 60, borderRadius: 10, background: 'var(--border-light)', animation: 'skeletonPulse 1.4s ease-in-out infinite', animationDelay: `${i * 0.12}s` }} />
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '8px 0' }}>
              <p style={{ marginBottom: 8 }}>⚠️ {error}</p>
              <button onClick={() => fetchTips(true)} style={{ fontSize: 12, color: 'var(--green-main)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                Riprova
              </button>
            </div>
          )}

          {/* Tips */}
          {!loading && !error && tips?.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tips.map((tip, i) => {
                const colors = CATEGORY_COLOR[tip.category] || CATEGORY_COLOR.habit
                return (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', background: colors.bg, borderRadius: 10 }}>
                    <span style={{ fontSize: 20, lineHeight: 1.3, flexShrink: 0 }}>{tip.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: colors.text, marginBottom: 2 }}>{tip.title}</p>
                      <p style={{ fontSize: 12, color: colors.text, opacity: 0.85, lineHeight: 1.5 }}>{tip.text}</p>
                    </div>
                  </div>
                )
              })}
              <p style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'right', marginTop: 2 }}>
                Basati sui dati di ieri · si aggiornano ogni giorno
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
