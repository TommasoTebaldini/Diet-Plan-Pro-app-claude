import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { CalendarCheck, TrendingUp, TrendingDown, Minus, Droplets, Footprints, Flame } from 'lucide-react'

// "La tua settimana": riepilogo automatico degli ultimi 7 giorni confrontati
// con i 7 precedenti — tutto calcolato client-side dai dati già registrati
// (food_logs, weight_logs, water_logs, activity_logs), nessuna tabella nuova.

function localDateStr(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function daysAgoStr(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return localDateStr(d)
}

function Delta({ value, unit = '', invert = false, decimals = 0 }) {
  if (value === null || !isFinite(value)) return null
  const rounded = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
  if (rounded === 0) return <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 2 }}><Minus size={11} /> stabile</span>
  const positiveIsGood = invert ? rounded < 0 : rounded > 0
  const color = positiveIsGood ? 'var(--green-main)' : 'var(--orange)'
  const Icon = rounded > 0 ? TrendingUp : TrendingDown
  return (
    <span style={{ fontSize: 11, fontWeight: 600, color, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      <Icon size={11} /> {rounded > 0 ? '+' : ''}{rounded}{unit} vs sett. prec.
    </span>
  )
}

export default function WeeklyReportPage() {
  const { user } = useAuth()
  const [data, setData] = useState(null)

  const load = useCallback(async () => {
    if (!user?.id) return
    const cutoff14 = daysAgoStr(13)
    const [foodRes, weightRes, waterRes, actRes, dietRes] = await Promise.all([
      supabase.from('food_logs').select('date,kcal').eq('user_id', user.id).gte('date', cutoff14).neq('food_name', '__note__'),
      supabase.from('weight_logs').select('date,weight_kg').eq('user_id', user.id).gte('date', daysAgoStr(30)).order('date'),
      supabase.from('water_logs').select('date,amount_ml').eq('user_id', user.id).gte('date', cutoff14),
      supabase.from('activity_logs').select('date,steps').eq('user_id', user.id).gte('date', cutoff14),
      supabase.from('patient_diets').select('kcal_target').eq('user_id', user.id).eq('is_active', true).limit(1),
    ])

    const thisWeek = new Set(Array.from({ length: 7 }, (_, i) => daysAgoStr(i)))
    const lastWeek = new Set(Array.from({ length: 7 }, (_, i) => daysAgoStr(i + 7)))

    function splitByWeek(rows, dateKey = 'date') {
      const cur = [], prev = []
      for (const r of rows || []) {
        if (thisWeek.has(r[dateKey])) cur.push(r)
        else if (lastWeek.has(r[dateKey])) prev.push(r)
      }
      return [cur, prev]
    }

    const [foodCur, foodPrev] = splitByWeek(foodRes.data)
    const [waterCur, waterPrev] = splitByWeek(waterRes.data)
    const [actCur, actPrev] = splitByWeek(actRes.data)

    const kcalByDay = {}
    for (const f of foodCur) kcalByDay[f.date] = (kcalByDay[f.date] || 0) + (f.kcal || 0)
    const daysCur = new Set(foodCur.map(f => f.date)).size
    const daysPrev = new Set(foodPrev.map(f => f.date)).size
    const avgKcal = daysCur ? Math.round(Object.values(kcalByDay).reduce((a, b) => a + b, 0) / daysCur) : null

    const waterDays = cur => {
      const byDay = {}
      for (const w of cur) byDay[w.date] = (byDay[w.date] || 0) + (w.amount_ml || 0)
      const vals = Object.values(byDay)
      return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null
    }
    const avgWaterCur = waterDays(waterCur)
    const avgWaterPrev = waterDays(waterPrev)

    const stepsAvg = list => {
      const byDay = {}
      for (const a of list) if (a.steps) byDay[a.date] = Math.max(byDay[a.date] || 0, a.steps)
      const vals = Object.values(byDay)
      return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null
    }
    const avgStepsCur = stepsAvg(actCur)
    const avgStepsPrev = stepsAvg(actPrev)

    // Peso: primo e ultimo valore degli ultimi 30 giorni per il trend, più il
    // confronto settimana su settimana quando ci sono pesate in entrambe.
    const weights = weightRes.data || []
    const wCur = weights.filter(w => thisWeek.has(w.date))
    const wPrev = weights.filter(w => lastWeek.has(w.date))
    const lastWeight = weights.length ? weights[weights.length - 1].weight_kg : null
    const weekWeightDelta = wCur.length && wPrev.length
      ? wCur[wCur.length - 1].weight_kg - wPrev[wPrev.length - 1].weight_kg
      : null

    // Barre kcal degli ultimi 7 giorni (oggi a destra)
    const bars = Array.from({ length: 7 }, (_, i) => {
      const d = daysAgoStr(6 - i)
      return { date: d, kcal: Math.round(kcalByDay[d] || 0) }
    })

    setData({
      daysCur, daysPrev, avgKcal,
      kcalTarget: dietRes.data?.[0]?.kcal_target || null,
      avgWaterCur, avgWaterPrev, avgStepsCur, avgStepsPrev,
      lastWeight, weekWeightDelta, bars,
    })
  }, [user?.id])

  useEffect(() => { load() }, [load])

  if (!data) {
    return <div className="page-container" style={{ padding: 16 }}><p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Caricamento…</p></div>
  }

  const maxBar = Math.max(1, ...data.bars.map(b => b.kcal))
  const giorniLbl = ['L', 'M', 'M', 'G', 'V', 'S', 'D']

  return (
    <div className="page-container" style={{ padding: 16, paddingBottom: 90 }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>📅 La tua settimana</h1>
        <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 16 }}>Ultimi 7 giorni a confronto con la settimana precedente.</p>

        <div className="card" style={{ padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <CalendarCheck size={18} color="var(--green-main)" />
            <span style={{ fontSize: 14, fontWeight: 700 }}>Diario compilato</span>
          </div>
          <p style={{ fontSize: 26, fontWeight: 800, color: data.daysCur >= 5 ? 'var(--green-main)' : data.daysCur >= 3 ? 'var(--orange)' : 'var(--red)' }}>
            {data.daysCur}<span style={{ fontSize: 15, color: 'var(--text-muted)', fontWeight: 600 }}>/7 giorni</span>
          </p>
          <Delta value={data.daysCur - data.daysPrev} unit=" gg" />
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 64, marginTop: 14 }}>
            {data.bars.map((b, i) => {
              const dow = (new Date(b.date + 'T12:00:00').getDay() + 6) % 7
              return (
                <div key={b.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <div style={{
                    width: '100%', borderRadius: 5,
                    height: `${Math.max(4, (b.kcal / maxBar) * 48)}px`,
                    background: b.kcal ? (i === 6 ? 'var(--green-main)' : 'var(--green-pale, #BBF7D0)') : 'var(--border-light)',
                  }} title={`${b.kcal} kcal`} />
                  <span style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>{giorniLbl[dow]}</span>
                </div>
              )
            })}
          </div>
          {data.avgKcal !== null && (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
              <Flame size={13} /> Media {data.avgKcal} kcal/giorno{data.kcalTarget ? ` · target ${data.kcalTarget} kcal` : ''}
            </p>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <div className="card" style={{ padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <TrendingUp size={14} color="var(--orange)" />
              <span style={{ fontSize: 12.5, fontWeight: 700 }}>Peso</span>
            </div>
            <p style={{ fontSize: 20, fontWeight: 800 }}>{data.lastWeight != null ? `${data.lastWeight} kg` : '—'}</p>
            {data.weekWeightDelta !== null
              ? <Delta value={data.weekWeightDelta} unit=" kg" invert decimals={1} />
              : <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Pesati in entrambe le settimane per il confronto</span>}
          </div>
          <div className="card" style={{ padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Droplets size={14} color="#0891B2" />
              <span style={{ fontSize: 12.5, fontWeight: 700 }}>Acqua</span>
            </div>
            <p style={{ fontSize: 20, fontWeight: 800 }}>{data.avgWaterCur != null ? `${(data.avgWaterCur / 1000).toFixed(1)} L` : '—'}</p>
            {data.avgWaterCur != null && data.avgWaterPrev != null && <Delta value={(data.avgWaterCur - data.avgWaterPrev) / 1000} unit=" L" decimals={1} />}
          </div>
          <div className="card" style={{ padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Footprints size={14} color="var(--green-main)" />
              <span style={{ fontSize: 12.5, fontWeight: 700 }}>Passi</span>
            </div>
            <p style={{ fontSize: 20, fontWeight: 800 }}>{data.avgStepsCur != null ? data.avgStepsCur.toLocaleString('it') : '—'}</p>
            {data.avgStepsCur != null && data.avgStepsPrev != null && <Delta value={data.avgStepsCur - data.avgStepsPrev} />}
          </div>
          <div className="card" style={{ padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Flame size={14} color="var(--red)" />
              <span style={{ fontSize: 12.5, fontWeight: 700 }}>Kcal medie</span>
            </div>
            <p style={{ fontSize: 20, fontWeight: 800 }}>{data.avgKcal != null ? data.avgKcal : '—'}</p>
            {data.kcalTarget && data.avgKcal != null && (
              <span style={{ fontSize: 11, color: Math.abs(data.avgKcal - data.kcalTarget) <= data.kcalTarget * 0.15 ? 'var(--green-main)' : 'var(--orange)', fontWeight: 600 }}>
                {Math.abs(data.avgKcal - data.kcalTarget) <= data.kcalTarget * 0.15 ? '✓ In linea col target' : `${data.avgKcal > data.kcalTarget ? '+' : ''}${data.avgKcal - data.kcalTarget} kcal dal target`}
              </span>
            )}
          </div>
        </div>

        <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
          Il riepilogo si aggiorna automaticamente con i dati che registri nell'app.
        </p>
      </motion.div>
    </div>
  )
}
