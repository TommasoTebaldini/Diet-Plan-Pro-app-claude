import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useT } from '../i18n'
import ProGate from '../components/ProGate'
import { useSubscription } from '../hooks/useSubscription'
import { Plus, Trash2, Flame, Activity, List, BarChart2, Clock, X, Check, ExternalLink, Footprints, Play, Square, Info } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { subDays, format, parseISO } from 'date-fns'
import { it } from 'date-fns/locale'
import { getPedometer, isPedometerSupported, getTodaySteps, getStepGoal, setStepGoal as saveStepGoal, hasMotionPermission } from '../lib/pedometer'

const STEP_GOAL_KEY = 'nutriplan_step_goal'
const DEFAULT_STEP_GOAL = 10000

const ACTIVITIES = [
  { type: 'camminata', label: 'Camminata', icon: '🚶', met: 3.5, color: '#22c55e' },
  { type: 'corsa', label: 'Corsa', icon: '🏃', met: 9.0, color: '#ef4444' },
  { type: 'ciclismo', label: 'Ciclismo', icon: '🚴', met: 7.5, color: '#3b82f6' },
  { type: 'nuoto', label: 'Nuoto', icon: '🏊', met: 6.0, color: '#06b6d4' },
  { type: 'palestra', label: 'Palestra', icon: '🏋️', met: 5.5, color: '#8b5cf6' },
  { type: 'yoga', label: 'Yoga', icon: '🧘', met: 2.5, color: '#ec4899' },
  { type: 'hiit', label: 'HIIT', icon: '⚡', met: 8.0, color: '#f59e0b' },
  { type: 'calcio', label: 'Calcio', icon: '⚽', met: 7.0, color: '#84cc16' },
  { type: 'tennis', label: 'Tennis', icon: '🎾', met: 7.0, color: '#f97316' },
  { type: 'altro', label: 'Altro', icon: '💪', met: 4.0, color: '#64748b' },
]

function calcCalories(met, weightKg, durationMin) {
  return Math.round(met * weightKg * (durationMin / 60))
}

function getActivityMeta(type) {
  return ACTIVITIES.find(a => a.type === type) || ACTIVITIES[ACTIVITIES.length - 1]
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 12px', boxShadow: 'var(--shadow-sm)' }}>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--orange)' }}>{payload[0].value} kcal</p>
        {payload[0].payload?.minutes > 0 && (
          <p style={{ fontSize: 12, color: 'var(--purple)' }}>{payload[0].payload.minutes} min</p>
        )}
      </div>
    )
  }
  return null
}

// ─── Log activity bottom-sheet ────────────────────────────────────────────────
function LogForm({ onClose, onSaved, userWeight, userId }) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    activity_type: 'camminata',
    duration_minutes: '',
    steps: '',
    notes: '',
  })
  const [saving, setSaving] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const meta = getActivityMeta(form.activity_type)
  const durationNum = parseInt(form.duration_minutes, 10)
  const estimatedCalories = durationNum > 0 && userWeight
    ? calcCalories(meta.met, userWeight, durationNum)
    : null

  async function save() {
    if (!durationNum || durationNum <= 0) return
    setSaving(true)
    const calories = estimatedCalories || calcCalories(meta.met, userWeight || 70, durationNum)
    const stepsVal = form.steps ? parseInt(form.steps, 10) : null
    try {
      await supabase.from('activity_logs').insert({
        user_id: userId,
        date: today,
        activity_type: form.activity_type,
        duration_minutes: durationNum,
        calories_burned: calories,
        steps: stepsVal && stepsVal > 0 ? stepsVal : null,
        notes: form.notes || null,
      })
      onSaved()
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ width: '100%', maxWidth: 480, margin: '0 auto', background: 'var(--surface)', borderRadius: '24px 24px 0 0', padding: '20px 20px calc(24px + env(safe-area-inset-bottom))', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700 }}>Registra attività</h3>
          <button onClick={onClose} style={{ background: 'var(--surface-3)', border: 'none', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={16} color="var(--text-muted)" />
          </button>
        </div>

        {/* Activity type selector */}
        <div style={{ marginBottom: 14 }}>
          <label className="input-label" style={{ display: 'block', marginBottom: 8 }}>Tipo di attività</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))', gap: 8 }}>
            {ACTIVITIES.map(a => (
              <button key={a.type} onClick={() => setForm(f => ({ ...f, activity_type: a.type }))} style={{
                padding: '10px 4px', borderRadius: 12,
                background: form.activity_type === a.type ? a.color + '22' : 'var(--surface-2)',
                border: form.activity_type === a.type ? `2px solid ${a.color}` : '1.5px solid var(--border)',
                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              }}>
                <span style={{ fontSize: 20 }}>{a.icon}</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: form.activity_type === a.type ? a.color : 'var(--text-muted)' }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="input-group" style={{ marginBottom: 14 }}>
          <label className="input-label">Durata (minuti)</label>
          <input type="number" className="input-field" placeholder="es. 30" value={form.duration_minutes} onChange={set('duration_minutes')} inputMode="numeric" min="1" />
        </div>

        {/* Steps (only for walking/running) */}
        {(form.activity_type === 'camminata' || form.activity_type === 'corsa') && (
          <div className="input-group" style={{ marginBottom: 14 }}>
            <label className="input-label">Passi (opzionale)</label>
            <input type="number" className="input-field" placeholder="es. 5000" value={form.steps} onChange={set('steps')} inputMode="numeric" min="0" />
          </div>
        )}

        {/* Notes */}
        <div className="input-group" style={{ marginBottom: 16 }}>
          <label className="input-label">Note (opzionale)</label>
          <input type="text" className="input-field" placeholder="es. Corsa al parco" value={form.notes} onChange={set('notes')} />
        </div>

        {/* Estimated calories preview */}
        {estimatedCalories && (
          <div style={{ background: 'var(--icon-bg-amber)', borderRadius: 12, padding: '12px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--alert-warning-border)' }}>
            <Flame size={18} color="var(--orange)" />
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--orange)' }}>~{estimatedCalories} kcal bruciate stimate</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Basato su MET {meta.met} × {userWeight} kg × {form.duration_minutes} min</p>
            </div>
          </div>
        )}

        <button className="btn btn-primary btn-full" onClick={save} disabled={saving || !durationNum || durationNum <= 0}>
          {saving ? 'Salvando…' : <><Check size={16} /> Salva attività</>}
        </button>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ActivityPage() {
  const { profile, user } = useAuth()
  const { isPro } = useSubscription()
  const t = useT()
  const today = new Date().toISOString().split('T')[0]

  const [logs, setLogs] = useState([])
  const [weekData, setWeekData] = useState([])
  const [historyLogs, setHistoryLogs] = useState([])
  const [latestWeight, setLatestWeight] = useState(null)
  const [tab, setTab] = useState('oggi')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stepGoal, setStepGoalState] = useState(() => getStepGoal())
  const [editingStepGoal, setEditingStepGoal] = useState(false)
  const [stepGoalInput, setStepGoalInput] = useState(String(DEFAULT_STEP_GOAL))
  // Activity goals
  const [activityGoals, setActivityGoals] = useState(() => {
    try {
      const saved = localStorage.getItem('nutriplan_activity_goals')
      return saved ? JSON.parse(saved) : { steps: 10000, calories: 300, minutes: 30 }
    } catch { return { steps: 10000, calories: 300, minutes: 30 } }
  })
  const [editingGoals, setEditingGoals] = useState(false)
  const [goalsInput, setGoalsInput] = useState({ steps: '10000', calories: '300', minutes: '30' })

  // Live pedometer state
  const [liveSteps, setLiveSteps] = useState(() => getTodaySteps())
  const [pedoActive, setPedoActive] = useState(false)
  const [pedoPermErr, setPedoPermErr] = useState(false)
  const [pedoNeedsGesture, setPedoNeedsGesture] = useState(false)
  const pedoRef = useRef(null)
  const syncTimeoutRef = useRef(null)

  const userWeight = latestWeight || profile?.weight_kg || profile?.target_weight || 70

  // Load today's logs + latest weight
  useEffect(() => {
    async function load() {
      setLoading(true)
      const [logsRes, weightRes] = await Promise.all([
        supabase.from('activity_logs').select('id,activity_type,duration_minutes,calories_burned,steps,notes,date,created_at').eq('user_id', user.id).eq('date', today).order('created_at'),
        supabase.from('weight_logs').select('weight_kg').eq('user_id', user.id).order('date', { ascending: false }).limit(1).maybeSingle(),
      ])
      if (!logsRes.error) setLogs(logsRes.data || [])
      if (!weightRes.error && weightRes.data?.weight_kg) setLatestWeight(weightRes.data.weight_kg)
      // Load steps from Supabase and use if greater than local
      const passiRes = await supabase.from('activity_logs').select('steps').eq('user_id', user.id).eq('date', today).eq('activity_type', 'passi').maybeSingle()
      if (!passiRes.error && passiRes.data?.steps && passiRes.data.steps > getTodaySteps()) {
        setLiveSteps(passiRes.data.steps)
      }
      setLoading(false)
    }
    load()
  }, [today, user.id])

  // Load weekly data
  useEffect(() => {
    async function loadWeek() {
      const from = subDays(new Date(), 6).toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('activity_logs')
        .select('date, calories_burned, duration_minutes')
        .eq('user_id', user.id)
        .gte('date', from)
        .lte('date', today)
      if (error) return
      const map = {}
      for (let i = 6; i >= 0; i--) {
        const d = subDays(new Date(), i).toISOString().split('T')[0]
        map[d] = { calories: 0, minutes: 0 }
      }
      ;(data || []).forEach(r => {
        if (map[r.date]) {
          map[r.date].calories += r.calories_burned || 0
          map[r.date].minutes += r.duration_minutes || 0
        }
      })
      setWeekData(
        Object.entries(map).map(([date, v]) => ({
          date,
          calories: v.calories,
          minutes: v.minutes,
          label: format(parseISO(date), 'EEE', { locale: it }),
        }))
      )
    }
    loadWeek()
  }, [today, user.id, logs])

  // Load history when tab changes
  useEffect(() => {
    if (tab !== 'storico') return
    async function loadHistory() {
      const from = subDays(new Date(), 30).toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('activity_logs')
        .select('id,activity_type,duration_minutes,calories_burned,steps,notes,date,created_at')
        .eq('user_id', user.id)
        .gte('date', from)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(150)
      if (!error) setHistoryLogs(data || [])
    }
    loadHistory()
  }, [tab, user.id])

  // Computed totals for today — use liveSteps as total (pedometer + logged)
  const todayCalories = logs.reduce((s, l) => s + (l.calories_burned || 0), 0)
  const todayMinutes = logs.reduce((s, l) => s + l.duration_minutes, 0)
  const loggedSteps = logs.reduce((s, l) => s + (l.steps || 0), 0)
  const totalSteps = Math.max(liveSteps, loggedSteps)
  const todaySteps = totalSteps
  const stepPct = Math.min(100, Math.round((todaySteps / stepGoal) * 100))

  async function deleteLog(id) {
    await supabase.from('activity_logs').delete().eq('id', id)
    setLogs(l => l.filter(x => x.id !== id))
  }

  // ── Live pedometer ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isPedometerSupported()) return
    const pedo = getPedometer()
    pedoRef.current = pedo
    const onStep = e => setLiveSteps(e.detail.steps)
    const onStart = () => { setPedoActive(true); setPedoNeedsGesture(false) }
    const onStop = () => setPedoActive(false)
    pedo.addEventListener('step', onStep)
    pedo.addEventListener('start', onStart)
    pedo.addEventListener('stop', onStop)
    setPedoActive(pedo.active)
    setLiveSteps(pedo.steps)

    // Auto-start: if permission already granted (or not needed on this platform), start immediately
    if (!pedo.active) {
      if (hasMotionPermission()) {
        pedo.start()
      } else {
        // iOS without prior permission: needs a user gesture to request
        setPedoNeedsGesture(true)
      }
    }

    return () => {
      pedo.removeEventListener('step', onStep)
      pedo.removeEventListener('start', onStart)
      pedo.removeEventListener('stop', onStop)
    }
  }, [])

  // Sync pedometer steps to Supabase (debounced 5s after last step)
  useEffect(() => {
    if (!user?.id || liveSteps <= 0) return
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current)
    syncTimeoutRef.current = setTimeout(async () => {
      try {
        // Niente vincolo unique su (user_id,date,activity_type): upsert+onConflict
        // fallirebbe sempre con 42P10. Select-then-write invece, coerente con la
        // lettura a riga singola già fatta altrove (vedi passiRes/.maybeSingle()).
        const { data: existing } = await supabase.from('activity_logs')
          .select('id')
          .eq('user_id', user.id).eq('date', today).eq('activity_type', 'passi')
          .maybeSingle()
        if (existing) {
          await supabase.from('activity_logs').update({ steps: liveSteps }).eq('id', existing.id)
        } else {
          // duration_minutes è NOT NULL/CHECK(>0): non ha un vero significato per
          // un conteggio passi passivo in background, placeholder minimo valido.
          await supabase.from('activity_logs').insert({
            user_id: user.id, date: today, activity_type: 'passi', steps: liveSteps, duration_minutes: 1,
          })
        }
      } catch {}
    }, 5000)
    return () => { if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current) }
  }, [liveSteps, today, user.id])

  async function activatePedometer() {
    const pedo = pedoRef.current
    if (!pedo) return
    setPedoPermErr(false)
    const ok = await pedo.start()
    if (!ok) setPedoPermErr(true)
    else setPedoNeedsGesture(false)
  }

  async function togglePedometer() {
    const pedo = pedoRef.current
    if (!pedo) return
    if (pedo.active) {
      pedo.stop()
    } else {
      setPedoPermErr(false)
      const ok = await pedo.start()
      if (!ok) setPedoPermErr(true)
    }
  }

  function handleSaveGoal() {
    const v = parseInt(stepGoalInput, 10)
    if (!isNaN(v) && v > 0) {
      setStepGoalState(v)
      saveStepGoal(v)
    }
    setEditingStepGoal(false)
  }

  // Keep backward compat name
  function saveStepGoalFn() { handleSaveGoal() }

  function reloadToday() {
    supabase.from('activity_logs').select('id,activity_type,duration_minutes,calories_burned,steps,notes,date,created_at').eq('user_id', user.id).eq('date', today).order('created_at')
      .then(({ data }) => { if (data) setLogs(data) })
  }

  // Weekly stats
  const weekCaloriesAvg = weekData.length
    ? Math.round(weekData.reduce((s, d) => s + d.calories, 0) / weekData.length)
    : 0
  const weekMinutesAvg = weekData.length
    ? Math.round(weekData.reduce((s, d) => s + d.minutes, 0) / weekData.length)
    : 0

  return (
    <div className="page">
      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(160deg, #c2410c 0%, #f97316 60%, #fb923c 100%)',
        padding: 'calc(env(safe-area-inset-top) + 20px) 24px 28px',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -20, left: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, marginBottom: 4 }}>{t('nav.activities')}</p>
          <h1 style={{ fontFamily: 'var(--font-d)', fontSize: 34, color: 'white', fontWeight: 300, lineHeight: 1, marginBottom: 6 }}>
            {todayCalories} <span style={{ fontSize: 16, opacity: 0.75 }}>kcal bruciate</span>
          </h1>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 10 }}>
            {[
              { val: `${todayMinutes}'`, label: 'min attivi' },
              { val: String(logs.length), label: 'attività' },
              ...(todaySteps > 0 ? [{ val: todaySteps.toLocaleString('it-IT'), label: 'passi' }] : []),
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.82 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.08 + i * 0.07, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '8px 14px', textAlign: 'center' }}
              >
                <p style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>{s.val}</p>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ── Log activity button ── */}
        <button className="btn btn-primary btn-full" onClick={() => setShowForm(true)} style={{ gap: 8, fontSize: 15 }}>
          <Plus size={18} /> {t('common.add')}
        </button>

        {/* ── Live Pedometer card ── */}
        {isPedometerSupported() && (
          <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ padding: '18px 20px', background: pedoActive ? 'linear-gradient(135deg, #fff7ed, #fff)' : 'var(--surface)', border: pedoActive ? '1.5px solid #fed7aa' : '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: pedoActive ? '#fff7ed' : 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: pedoActive ? '1.5px solid #fed7aa' : '1.5px solid var(--border)' }}>
                  <motion.span style={{ fontSize: 22 }} animate={pedoActive ? { rotate: [0, -10, 10, -5, 5, 0] } : {}} transition={{ repeat: pedoActive ? Infinity : 0, duration: 1.2, repeatDelay: 0.5 }}>
                    🦶
                  </motion.span>
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700 }}>Contapassi</p>
                  <p style={{ fontSize: 11, color: pedoActive ? '#f97316' : 'var(--text-muted)', fontWeight: pedoActive ? 600 : 400 }}>
                    {pedoActive ? '● Attivo automaticamente' : pedoNeedsGesture ? 'Tocca per attivare' : 'In avvio…'}
                  </p>
                </div>
              </div>
              {pedoNeedsGesture ? (
                <motion.button
                  onClick={activatePedometer}
                  whileTap={{ scale: 0.92 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, background: 'linear-gradient(135deg, var(--green-main), var(--green-mid))', color: 'white', minHeight: 44 }}
                >
                  <Footprints size={14} /> Attiva
                </motion.button>
              ) : pedoActive ? (
                <motion.button
                  onClick={togglePedometer}
                  whileTap={{ scale: 0.92 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 13px', borderRadius: 10, border: '1.5px solid #fed7aa', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: 'transparent', color: '#f97316', minHeight: 36 }}
                >
                  <Square size={12} /> Ferma
                </motion.button>
              ) : null}
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 12 }}>
              <motion.span
                key={liveSteps}
                initial={{ scale: 1.2, color: '#f97316' }}
                animate={{ scale: 1, color: 'var(--text-primary)' }}
                transition={{ duration: 0.3 }}
                style={{ fontSize: 44, fontWeight: 800, fontFamily: 'var(--font-d)', lineHeight: 1 }}
              >
                {liveSteps.toLocaleString('it-IT')}
              </motion.span>
              <span style={{ fontSize: 15, color: 'var(--text-muted)', paddingBottom: 8 }}>passi</span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)', paddingBottom: 8, marginLeft: 6 }}>
                · ~{Math.round(liveSteps * 0.0008 * 10) / 10} km
              </span>
            </div>

            <div style={{ height: 8, background: 'var(--border-light)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
              <motion.div
                style={{ height: '100%', background: 'linear-gradient(90deg, #fbbf24, #f97316)', borderRadius: 4 }}
                animate={{ width: `${Math.min(100, Math.round((liveSteps / stepGoal) * 100))}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>

            {pedoPermErr && (
              <div className="alert-error" style={{ marginTop: 8, fontSize: 12 }}>
                Accesso al sensore negato. Su iOS vai in Impostazioni → Privacy → Movimento e fitness.
              </div>
            )}
            {!pedoActive && !pedoNeedsGesture && !pedoPermErr && (
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Info size={11} /> Tieni l'app aperta nelle app recenti per continuare il conteggio
              </p>
            )}
            {pedoNeedsGesture && (
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Info size={11} /> Su iOS è richiesta l'autorizzazione al primo utilizzo
              </p>
            )}
          </motion.div>
        )}

        {/* ── Steps goal card ── */}
        <motion.div className="card" style={{ padding: '18px 20px' }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                👟
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600 }}>Obiettivo passi</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {todaySteps.toLocaleString('it-IT')} / {stepGoal.toLocaleString('it-IT')} passi
                </p>
              </div>
            </div>
            {!editingStepGoal ? (
              <button onClick={() => { setStepGoalInput(String(stepGoal)); setEditingStepGoal(true) }}
                style={{ fontSize: 12, color: 'var(--green-main)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                {t('common.edit')}
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input
                  type="number"
                  value={stepGoalInput}
                  onChange={e => setStepGoalInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') saveStepGoal() }}
                  style={{ width: 84, padding: '6px 8px', borderRadius: 8, border: '1.5px solid var(--green-main)', fontSize: 16, fontFamily: 'var(--font-b)', outline: 'none' }}
                  inputMode="numeric"
                  min="500"
                />
                <button onClick={handleSaveGoal} style={{ background: 'var(--green-main)', border: 'none', borderRadius: 8, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Check size={14} color="white" />
                </button>
              </div>
            )}
          </div>
          <div style={{ height: 10, background: 'var(--border-light)', borderRadius: 5, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{
              height: '100%', width: `${stepPct}%`,
              background: stepPct >= 100 ? 'linear-gradient(90deg, #22c55e, #16a34a)' : 'linear-gradient(90deg, #fbbf24, #f97316)',
              borderRadius: 5, transition: 'width 0.8s ease',
            }} />
          </div>
          <p style={{ fontSize: 12, color: stepPct >= 100 ? '#16a34a' : 'var(--text-muted)', fontWeight: stepPct >= 100 ? 600 : 400 }}>
            {stepPct >= 100
              ? '🎉 Obiettivo passi raggiunto!'
              : todaySteps > 0
                ? `${stepPct}% completato · ${(stepGoal - todaySteps).toLocaleString('it-IT')} passi mancanti`
                : 'Registra una camminata o corsa per aggiungere passi'}
          </p>
        </motion.div>

        {/* ── Health app integration ── */}
        <motion.div className="card" style={{ padding: '16px 18px', borderLeft: '3px solid var(--blue)' }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--blue)' }}>📱 Collega la tua app salute</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 }}>
            Apri Apple Health o Google Fit per sincronizzare passi e attività con i tuoi dati di salute.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <a href="x-apple-health://" style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              background: 'var(--icon-bg-blue)', border: '1px solid var(--alert-info-border)', borderRadius: 10, padding: '10px 8px',
              textDecoration: 'none', color: 'var(--blue)', fontSize: 12, fontWeight: 600,
            }}>
              <span>🍎</span> Apple Health <ExternalLink size={11} />
            </a>
            <a href="https://fit.google.com" target="_blank" rel="noopener noreferrer" style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              background: 'var(--icon-bg-lime)', border: '1px solid var(--alert-success-border)', borderRadius: 10, padding: '10px 8px',
              textDecoration: 'none', color: 'var(--green-mid)', fontSize: 12, fontWeight: 600,
            }}>
              <span>🏃</span> Google Fit <ExternalLink size={11} />
            </a>
          </div>
        </motion.div>

        {/* ── I miei obiettivi ── */}
        <motion.div className="card" style={{ padding: '18px 20px' }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fef9c3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🎯</div>
              <p style={{ fontSize: 14, fontWeight: 700 }}>I miei obiettivi</p>
            </div>
            {!editingGoals ? (
              <button onClick={() => { setGoalsInput({ steps: String(activityGoals.steps), calories: String(activityGoals.calories), minutes: String(activityGoals.minutes) }); setEditingGoals(true) }}
                style={{ fontSize: 12, color: '#f97316', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Modifica</button>
            ) : (
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => {
                  const next = { steps: parseInt(goalsInput.steps) || 10000, calories: parseInt(goalsInput.calories) || 300, minutes: parseInt(goalsInput.minutes) || 30 }
                  setActivityGoals(next)
                  try { localStorage.setItem('nutriplan_activity_goals', JSON.stringify(next)) } catch {}
                  setEditingGoals(false)
                }} style={{ background: '#f97316', border: 'none', borderRadius: 8, minWidth: 44, minHeight: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Check size={14} color="white" />
                </button>
                <button onClick={() => setEditingGoals(false)} style={{ background: 'var(--surface-2)', border: 'none', borderRadius: 8, minWidth: 44, minHeight: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={14} color="var(--text-muted)" />
                </button>
              </div>
            )}
          </div>
          {[
            { key: 'calories', label: 'Calorie bruciate', unit: 'kcal', current: todayCalories, icon: '🔥', color: '#f97316' },
            { key: 'minutes', label: 'Minuti di esercizio', unit: 'min', current: todayMinutes, icon: '⏱️', color: '#8b5cf6' },
            { key: 'steps', label: 'Passi giornalieri', unit: 'passi', current: todaySteps, icon: '👟', color: '#f59e0b' },
          ].map(goal => {
            const goalVal = activityGoals[goal.key] || 1
            const pct = Math.min(100, Math.round((goal.current / goalVal) * 100))
            const barColor = pct >= 100 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444'
            return (
              <div key={goal.key} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{goal.icon} {goal.label}</span>
                  {editingGoals ? (
                    <input type="number" value={goalsInput[goal.key]} onChange={e => setGoalsInput(g => ({ ...g, [goal.key]: e.target.value }))}
                      style={{ width: 80, padding: '4px 8px', borderRadius: 8, border: '1.5px solid #f97316', fontSize: 14, fontFamily: 'inherit', outline: 'none', textAlign: 'right' }}
                      inputMode="numeric" min="1" />
                  ) : (
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      <strong style={{ color: 'var(--text-primary)', fontSize: 14 }}>{goal.current.toLocaleString('it-IT')}</strong> / {goalVal.toLocaleString('it-IT')} {goal.unit}
                    </span>
                  )}
                </div>
                <div style={{ height: 8, background: 'var(--border-light)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: pct + '%', background: barColor, borderRadius: 4, transition: 'width 0.6s ease' }} />
                </div>
                <p style={{ fontSize: 10, color: pct >= 100 ? '#16a34a' : pct >= 50 ? '#d97706' : '#dc2626', fontWeight: 600, marginTop: 3 }}>
                  {pct >= 100 ? '\u2713 Obiettivo raggiunto!' : pct + '% completato'}
                </p>
              </div>
            )
          })}
        </motion.div>

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { key: 'oggi', icon: <List size={14} />, label: 'Oggi' },
            { key: 'settimana', icon: <BarChart2 size={14} />, label: 'Settimana' },
            { key: 'storico', icon: <Clock size={14} />, label: 'Storico' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: 1, padding: '10px 8px', borderRadius: 12, border: 'none', font: 'inherit',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              background: tab === t.key ? '#f97316' : 'var(--surface-2)',
              color: tab === t.key ? 'white' : 'var(--text-secondary)',
            }}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* ── Today tab ── */}
        {tab === 'oggi' && (
          <div className="card" style={{ padding: '18px 20px' }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[1, 2].map(i => <div key={i} className="skeleton" style={{ height: 60, borderRadius: 12 }} />)}
              </div>
            ) : logs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: 36, marginBottom: 8 }}>🏃</p>
                <p style={{ fontSize: 14 }}>Nessuna attività registrata oggi</p>
                <p style={{ fontSize: 12, marginTop: 4 }}>Tocca "Registra attività" per iniziare!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {logs.map(l => {
                  const meta = getActivityMeta(l.activity_type)
                  return (
                    <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: meta.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 22 }}>
                        {meta.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 600 }}>{meta.label}</p>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {l.duration_minutes} min
                          {l.calories_burned ? ` · ${l.calories_burned} kcal` : ''}
                          {l.steps ? ` · ${l.steps.toLocaleString('it-IT')} passi` : ''}
                        </p>
                        {l.notes && <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{l.notes}</p>}
                      </div>
                      <button onClick={() => deleteLog(l.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 12, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )
                })}

                {/* Daily totals row */}
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 12, marginTop: 2, display: 'flex', gap: 16, justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--orange)' }}>{todayCalories}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>kcal bruciate</p>
                  </div>
                  <div style={{ width: 1, background: 'var(--border)' }} />
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--purple)' }}>{todayMinutes}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>min attivi</p>
                  </div>
                  {todaySteps > 0 && (
                    <>
                      <div style={{ width: 1, background: 'var(--border)' }} />
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--orange)' }}>{todaySteps.toLocaleString('it-IT')}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>passi</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Weekly chart ── */}
        {tab === 'settimana' && (
          <ProGate feature="Grafico settimanale" teaser="Visualizza il riepilogo settimanale delle tue attività e calorie bruciate">
          <div className="card" style={{ padding: '18px 20px' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Grafico settimanale</h3>
            <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Media kcal/giorno</p>
                <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--orange)' }}>{weekCaloriesAvg}</p>
              </div>
              <div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Media min/giorno</p>
                <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--purple)' }}>{weekMinutesAvg}</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weekData} margin={{ top: 0, right: 4, left: -20, bottom: 0 }} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#fff7ed' }} />
                <Bar dataKey="calories" radius={[6, 6, 0, 0]} fill="#fb923c" maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>

            {/* Daily summary list */}
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[...weekData].reverse().map(d => {
                const maxCal = Math.max(...weekData.map(x => x.calories), 1)
                const barPct = Math.round((d.calories / maxCal) * 100)
                return (
                  <div key={d.date} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 52, textAlign: 'right' }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: d.date === today ? '#f97316' : 'var(--text-primary)' }}>
                        {format(parseISO(d.date), 'd MMM', { locale: it })}
                      </p>
                    </div>
                    <div style={{ flex: 1, height: 8, background: 'var(--border-light)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${barPct}%`, background: '#fb923c', borderRadius: 4, transition: 'width 0.8s ease' }} />
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', width: 60, textAlign: 'right' }}>
                      {d.calories > 0 ? `${d.calories} kcal` : '–'}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
          </ProGate>
        )}

        {/* ── History tab ── */}
        {tab === 'storico' && (
          <ProGate feature="Storico allenamenti" teaser="Accedi allo storico completo dei tuoi allenamenti degli ultimi 30 giorni">
          <div className="card" style={{ padding: '18px 20px' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Storico allenamenti (30 giorni)</h3>
            {historyLogs.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, padding: '12px 0' }}>
                Nessuna attività registrata negli ultimi 30 giorni
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {historyLogs.map(l => {
                  const meta = getActivityMeta(l.activity_type)
                  return (
                    <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: meta.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>
                        {meta.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 500 }}>{meta.label}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {format(parseISO(l.date), 'd MMM yyyy', { locale: it })}
                          {' · '}{l.duration_minutes} min
                          {l.calories_burned ? ` · ${l.calories_burned} kcal` : ''}
                          {l.steps ? ` · ${l.steps.toLocaleString('it-IT')} passi` : ''}
                        </p>
                        {l.notes && <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{l.notes}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          </ProGate>
        )}
      </div>

      {/* ── Log form bottom sheet ── */}
      {showForm && (
        <LogForm
          onClose={() => setShowForm(false)}
          onSaved={reloadToday}
          userWeight={userWeight}
          userId={user.id}
        />
      )}
    </div>
  )
}
