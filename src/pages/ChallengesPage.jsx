import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Trophy, CheckCircle2 } from 'lucide-react'

// Sfide settimanali auto-tracciate: il progresso è DERIVATO dai dati che il
// paziente registra già (diario, acqua, passi, peso, benessere) — niente
// tabelle nuove, niente doppio inserimento, cross-device by design. La
// settimana parte dal lunedì. Lo storico delle settimane completate è
// salvato in localStorage (solo celebrativo, non clinico).

function localDateStr(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function mondayOfThisWeek() {
  const d = new Date()
  const dow = (d.getDay() + 6) % 7 // 0 = lunedì
  d.setDate(d.getDate() - dow)
  return d
}

const HISTORY_KEY = 'weekly_challenges_history'

export default function ChallengesPage() {
  const { user } = useAuth()
  const [challenges, setChallenges] = useState(null)
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') } catch { return [] }
  })

  const load = useCallback(async () => {
    if (!user?.id) return
    const monday = mondayOfThisWeek()
    const mondayStr = localDateStr(monday)

    const [foodRes, waterRes, actRes, weightRes, wellRes, dietRes] = await Promise.all([
      supabase.from('food_logs').select('date,kcal').eq('user_id', user.id).gte('date', mondayStr).neq('food_name', '__note__'),
      supabase.from('water_logs').select('date,amount_ml').eq('user_id', user.id).gte('date', mondayStr),
      supabase.from('activity_logs').select('date,steps').eq('user_id', user.id).gte('date', mondayStr),
      supabase.from('weight_logs').select('date').eq('user_id', user.id).gte('date', mondayStr),
      supabase.from('daily_wellness').select('date').eq('user_id', user.id).gte('date', mondayStr),
      supabase.from('patient_diets').select('kcal_target').eq('user_id', user.id).eq('is_active', true).limit(1),
    ])

    const kcalByDay = {}
    for (const f of foodRes.data || []) kcalByDay[f.date] = (kcalByDay[f.date] || 0) + (f.kcal || 0)
    const foodDays = Object.keys(kcalByDay).length

    const waterByDay = {}
    for (const w of waterRes.data || []) waterByDay[w.date] = (waterByDay[w.date] || 0) + (w.amount_ml || 0)
    const waterDays = Object.values(waterByDay).filter(ml => ml >= 1500).length

    const stepsByDay = {}
    for (const a of actRes.data || []) if (a.steps) stepsByDay[a.date] = Math.max(stepsByDay[a.date] || 0, a.steps)
    const stepDays = Object.values(stepsByDay).filter(s => s >= 7000).length

    const weighIns = new Set((weightRes.data || []).map(w => w.date)).size
    const wellDays = new Set((wellRes.data || []).map(w => w.date)).size

    const kcalTarget = dietRes.data?.[0]?.kcal_target || null
    const inTargetDays = kcalTarget
      ? Object.values(kcalByDay).filter(k => k >= kcalTarget * 0.85 && k <= kcalTarget * 1.15).length
      : 0

    const list = [
      { id: 'diario', emoji: '📔', title: 'Diario costante', desc: 'Registra i pasti in 5 giorni', progress: foodDays, goal: 5 },
      { id: 'acqua', emoji: '💧', title: 'Idratazione', desc: 'Almeno 1,5L d\'acqua in 5 giorni', progress: waterDays, goal: 5 },
      { id: 'passi', emoji: '🚶', title: 'In movimento', desc: '7.000+ passi in 4 giorni', progress: stepDays, goal: 4 },
      { id: 'peso', emoji: '⚖️', title: 'Sotto controllo', desc: 'Pesati almeno 2 volte', progress: weighIns, goal: 2 },
      { id: 'benessere', emoji: '😊', title: 'Check benessere', desc: 'Compila il benessere in 4 giorni', progress: wellDays, goal: 4 },
      ...(kcalTarget ? [{ id: 'target', emoji: '🎯', title: 'In linea', desc: 'Kcal nel target (±15%) in 4 giorni', progress: inTargetDays, goal: 4 }] : []),
    ]
    setChallenges(list)

    // Storico celebrativo: marca la settimana come completata quando tutte le
    // sfide raggiungono l'obiettivo (una entry per settimana).
    if (list.length && list.every(c => c.progress >= c.goal)) {
      setHistory(prev => {
        if (prev.includes(mondayStr)) return prev
        const next = [...prev, mondayStr]
        try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)) } catch { /* storage pieno */ }
        return next
      })
    }
  }, [user?.id])

  useEffect(() => { load() }, [load])

  const completed = (challenges || []).filter(c => c.progress >= c.goal).length
  const total = (challenges || []).length
  const allDone = total > 0 && completed === total

  return (
    <div className="page-container" style={{ padding: 16, paddingBottom: 90 }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>🏆 Sfide della settimana</h1>
        <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 16 }}>
          Si azzerano ogni lunedì e avanzano da sole con quello che registri nell'app.
        </p>

        {challenges === null ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Caricamento…</p>
        ) : (
          <>
            <div className="card" style={{ padding: 16, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14, ...(allDone ? { borderLeft: '3px solid var(--green-main)' } : {}) }}>
              <Trophy size={26} color={allDone ? 'var(--green-main)' : 'var(--orange)'} />
              <div>
                <p style={{ fontSize: 15, fontWeight: 800 }}>{completed}/{total} completate</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {allDone ? '🎉 Settimana perfetta! Grande costanza.' : 'Continua così, ogni registrazione conta.'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {challenges.map((c, i) => {
                const done = c.progress >= c.goal
                const pct = Math.min(100, Math.round((c.progress / c.goal) * 100))
                return (
                  <motion.div key={c.id} className="card" style={{ padding: '14px 16px' }}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 22 }}>{c.emoji}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13.5, fontWeight: 700 }}>{c.title}</p>
                        <p style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{c.desc}</p>
                      </div>
                      {done
                        ? <CheckCircle2 size={22} color="var(--green-main)" />
                        : <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0 }}>{c.progress}/{c.goal}</span>}
                    </div>
                    <div style={{ height: 6, background: 'var(--border-light)', borderRadius: 3, marginTop: 10, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: done ? 'var(--green-main)' : 'var(--orange)', borderRadius: 3, transition: 'width .5s' }} />
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {history.length > 0 && (
              <div className="card" style={{ padding: '14px 16px', marginTop: 12 }}>
                <p style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 4 }}>🏅 Settimane perfette: {history.length}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Ogni settimana con tutte le sfide completate vale una medaglia.</p>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}
