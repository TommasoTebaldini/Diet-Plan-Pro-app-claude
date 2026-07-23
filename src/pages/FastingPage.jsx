import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Timer, Play, Square, Clock, History } from 'lucide-react'

const PROTOCOLS = [
  { key: '16:8',  label: '16:8',  desc: 'Digiuno 16h, finestra 8h',  fast: 16, eat: 8 },
  { key: '18:6',  label: '18:6',  desc: 'Digiuno 18h, finestra 6h',  fast: 18, eat: 6 },
  { key: '20:4',  label: '20:4',  desc: 'Digiuno 20h, finestra 4h',  fast: 20, eat: 4 },
  { key: 'OMAD',  label: 'OMAD',  desc: 'Un pasto al giorno (23:1)', fast: 23, eat: 1 },
]

function formatDuration(ms) {
  if (ms <= 0) return '00:00:00'
  const s = Math.floor(ms / 1000)
  const h = String(Math.floor(s / 3600)).padStart(2, '0')
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
  const sec = String(s % 60).padStart(2, '0')
  return `${h}:${m}:${sec}`
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const STORAGE_KEY = 'np_active_fast'

export default function FastingPage() {
  const { user } = useAuth()
  const [protocol, setProtocol] = useState('16:8')
  const [activeFast, setActiveFast] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const tickRef = useRef(null)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
      if (stored?.startedAt) { setActiveFast(stored); setProtocol(stored.protocol) }
    } catch {}
    loadHistory()
  }, [])

  useEffect(() => {
    clearInterval(tickRef.current)
    if (activeFast) {
      const tick = () => setElapsed(Date.now() - new Date(activeFast.startedAt).getTime())
      tick()
      tickRef.current = setInterval(tick, 1000)
    } else {
      setElapsed(0)
    }
    return () => clearInterval(tickRef.current)
  }, [activeFast])

  async function loadHistory() {
    setLoading(true)
    const { data } = await supabase.from('fasting_logs')
      .select('*').eq('user_id', user.id)
      .order('started_at', { ascending: false }).limit(20)
    setHistory(data || [])
    setLoading(false)
  }

  function startFast() {
    const fast = { startedAt: new Date().toISOString(), protocol }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fast))
    setActiveFast(fast)
    setNotes('')
  }

  async function stopFast() {
    if (!activeFast) return
    const endedAt = new Date().toISOString()
    localStorage.removeItem(STORAGE_KEY)
    const { data } = await supabase.from('fasting_logs').insert({
      user_id: user.id,
      started_at: activeFast.startedAt,
      ended_at: endedAt,
      protocol: activeFast.protocol,
      notes: notes || null,
    }).select().single()
    setActiveFast(null)
    if (data) setHistory(prev => [data, ...prev.slice(0, 19)])
  }

  const activeProto = PROTOCOLS.find(p => p.key === (activeFast?.protocol || protocol)) || PROTOCOLS[0]
  const targetMs = activeProto.fast * 3600000
  const progress = Math.min(elapsed / targetMs, 1)
  const remaining = Math.max(targetMs - elapsed, 0)
  const isComplete = elapsed >= targetMs

  const circumference = 2 * Math.PI * 50

  return (
    <div className="page">
      <div style={{ background: 'linear-gradient(160deg, #0c4a6e, #0369a1)', padding: 'calc(env(safe-area-inset-top) + 20px) 20px 28px' }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.05em' }}>Nutrizione</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 14, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Timer size={22} color="white" />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-d)', fontSize: 22, color: 'white', fontWeight: 300 }}>Digiuno Intermittente</h1>
            {activeFast && (
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                Protocollo {activeFast.protocol} · {isComplete ? '✅ Completato!' : 'In corso'}
              </p>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 16px 120px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Active fast card */}
        {activeFast ? (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ padding: 20, textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.05em' }}>Digiuno attivo · {activeFast.protocol}</p>

            <p style={{ fontSize: 48, fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: isComplete ? '#16a34a' : 'var(--text-primary)', letterSpacing: '-1px', lineHeight: 1.1, fontFamily: 'monospace', marginBottom: 16 }}>
              {formatDuration(elapsed)}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
              <svg width={120} height={120} viewBox="0 0 120 120">
                <circle cx={60} cy={60} r={50} fill="none" stroke="var(--border-light)" strokeWidth={8} />
                <circle
                  cx={60} cy={60} r={50} fill="none"
                  stroke={isComplete ? '#16a34a' : '#0369a1'}
                  strokeWidth={8}
                  strokeDasharray={`${circumference}`}
                  strokeDashoffset={`${circumference * (1 - progress)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
                <text x={60} y={56} textAnchor="middle" fontSize={12} fill="var(--text-muted)" fontFamily="inherit">{Math.round(progress * 100)}%</text>
                <text x={60} y={72} textAnchor="middle" fontSize={11} fill="var(--text-muted)" fontFamily="inherit">{isComplete ? 'fatto!' : 'obiet.'}</text>
              </svg>
            </div>

            {isComplete ? (
              <p style={{ fontSize: 14, color: '#16a34a', fontWeight: 700, marginBottom: 14 }}>
                Hai completato le {activeProto.fast}h! 🎉
              </p>
            ) : (
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
                Ancora <strong style={{ color: 'var(--text-primary)' }}>{formatDuration(remaining)}</strong> all'obiettivo
              </p>
            )}

            <input
              placeholder="Note facoltative…"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: 'var(--surface-2)', marginBottom: 12, color: 'var(--text-primary)' }}
            />
            <button
              onClick={stopFast}
              style={{ width: '100%', padding: '13px 0', borderRadius: 12, border: 'none', background: '#dc2626', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <Square size={16} fill="white" />
              Termina digiuno
            </button>
          </motion.div>
        ) : (
          /* Start card */
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 20 }}>
            <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Inizia un nuovo digiuno</p>

            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 10 }}>Protocollo</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              {PROTOCOLS.map(p => (
                <button key={p.key} onClick={() => setProtocol(p.key)}
                  style={{ padding: '12px 10px', borderRadius: 12, border: `2px solid ${protocol === p.key ? '#0369a1' : 'var(--border)'}`, background: protocol === p.key ? '#eff6ff' : 'var(--surface-2)', cursor: 'pointer', textAlign: 'left', transition: 'all .15s' }}>
                  <p style={{ fontSize: 16, fontWeight: 800, color: protocol === p.key ? '#0369a1' : 'var(--text-primary)', marginBottom: 3 }}>{p.label}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.3 }}>{p.desc}</p>
                </button>
              ))}
            </div>

            <div style={{ background: '#eff6ff', borderRadius: 10, padding: '10px 12px', marginBottom: 16 }}>
              <p style={{ fontSize: 12, color: '#1d4ed8', lineHeight: 1.6 }}>
                <strong>Protocollo {activeProto.label}:</strong> digiuna per <strong>{activeProto.fast}h</strong>, poi mangia entro una finestra di {activeProto.eat}h.
              </p>
            </div>

            <button
              onClick={startFast}
              style={{ width: '100%', padding: '14px 0', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #0369a1, #0284c7)', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <Play size={16} fill="white" />
              Inizia {activeProto.label}
            </button>
          </motion.div>
        )}

        {/* History */}
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <History size={14} /> Storico digiuni
          </p>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[1, 2, 3].map(i => <div key={i} style={{ height: 70, borderRadius: 12, background: 'var(--border-light)', animation: 'skeletonPulse 1.4s ease-in-out infinite' }} />)}
            </div>
          ) : history.length === 0 ? (
            <div style={{ padding: '28px 16px', textAlign: 'center', background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border-light)' }}>
              <Clock size={32} color="var(--text-muted)" style={{ opacity: 0.3, marginBottom: 8 }} />
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Nessun digiuno completato</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Inizia il tuo primo digiuno sopra</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {history.map(log => {
                const dur = log.ended_at ? new Date(log.ended_at) - new Date(log.started_at) : null
                const durH = dur !== null ? Math.floor(dur / 3600000) : null
                const durM = dur !== null ? Math.floor((dur % 3600000) / 60000) : null
                const target = PROTOCOLS.find(p => p.key === log.protocol)?.fast || 16
                const completed = durH !== null && durH >= target
                return (
                  <div key={log.id} style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 12, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{log.protocol}</span>
                        <span style={{ fontSize: 11, padding: '1px 7px', borderRadius: 100, background: completed ? '#dcfce7' : '#fef3c7', color: completed ? '#15803d' : '#92400e', fontWeight: 600 }}>
                          {completed ? '✅ Completato' : '⏸ Parziale'}
                        </span>
                      </div>
                      {durH !== null && <span style={{ fontSize: 13, fontWeight: 700, color: completed ? '#15803d' : 'var(--text-secondary)' }}>{durH}h {durM}m</span>}
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {formatDate(log.started_at)}{log.ended_at ? ` → ${formatDate(log.ended_at)}` : ''}
                    </p>
                    {log.notes && <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, fontStyle: 'italic' }}>{log.notes}</p>}
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
