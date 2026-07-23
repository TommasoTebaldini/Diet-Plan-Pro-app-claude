/**
 * MenstrualCyclePage — Feature 9: Tracciamento ciclo mestruale
 *
 * SQL per creare la tabella (eseguire in Supabase SQL editor):
 *
 * CREATE TABLE IF NOT EXISTS menstrual_cycle (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
 *   start_date DATE NOT NULL,
 *   end_date DATE,
 *   cycle_length INTEGER,
 *   notes TEXT,
 *   symptoms TEXT[],
 *   created_at TIMESTAMPTZ DEFAULT now()
 * );
 * ALTER TABLE menstrual_cycle ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "own" ON menstrual_cycle FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
 */
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Plus, X, Check, Trash2, Calendar } from 'lucide-react'

const CYCLE_SYMPTOMS = [
  'Crampi', 'Gonfiore', 'Mal di testa', 'Stanchezza',
  'Sbalzi umore', 'Nausea', 'Schiena dolente', 'Seno sensibile',
  'Spotting', 'Acne', 'Insonnia', 'Voglie alimentari',
]

const PHASE_NUTRITION = {
  'Mestruale': {
    color: '#ec4899', bg: '#fce7f3',
    summary: 'Focus su ferro e antinfiammatori per ridurre crampi e affaticamento.',
    foods: ['🥩 Carne rossa magra, legumi (ferro)', '🥦 Spinaci, broccoli (ferro + vitamina C)', '🐟 Salmone, sardine (omega-3, antinfiammatori)', '🍫 Cioccolato fondente ≥70% (magnesio)', '🫖 Tisane di zenzero e cannella (antidolorifici)'],
    avoid: ['☕ Caffeina e alcol (aggravano crampi e perdita di ferro)', '🧂 Cibi salati (ritenzione idrica)'],
  },
  'Pre-ovulatoria': {
    color: '#f59e0b', bg: '#fffbeb',
    summary: 'Energia in crescita: privilegia fitoestrogeni e vitamina B6.',
    foods: ['🫘 Soia, lenticchie, ceci (fitoestrogeni)', '🥚 Uova, pollo (vitamina B6)', '🌾 Avena, riso integrale (energia stabile)', '🥑 Avocado (grassi sani per estrogeni)', '🍓 Frutti di bosco (antiossidanti)'],
    avoid: ['🍬 Zuccheri raffinati (picchi glicemici)', '🧀 Latticini in eccesso'],
  },
  'Ovulatoria': {
    color: '#10b981', bg: '#ecfdf5',
    summary: 'Picco di energia: supporta la fertilità con fibre e antiossidanti.',
    foods: ['🥗 Verdure a foglia verde (folati)', '🍋 Agrumi, kiwi (vitamina C)', '🌰 Noci, semi di lino (zinco e omega-3)', '🐟 Tonno, sgombro (vitamina D)', '🫐 Mirtilli, lamponi (antiossidanti)'],
    avoid: ['🍟 Fritture e grassi saturi (stress ossidativo)', '🥃 Alcol'],
  },
  'Luteale': {
    color: '#7c3aed', bg: '#f5f3ff',
    summary: 'Combatti il PMS con magnesio, triptofano e riduci sale e zucchero.',
    foods: ['🍫 Cioccolato fondente, banane (triptofano e magnesio)', '🥜 Mandorle, noci (magnesio)', '🍗 Tacchino, avena (serotonina)', '🫘 Legumi (fibre, sazietà)', '🍠 Patate dolci, zucca (comfort food sano)'],
    avoid: ['🧂 Sale (gonfiore e ritenzione)', '🍬 Zuccheri (aggravano sbalzi d\'umore)', '☕ Caffeina in eccesso (ansia, insonnia)'],
  },
}

import { useState as useState2 } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

// Calcola i set di date ciclo e previsioni per un dato mese
function buildCycleMap(cycles, year, month, predictedRanges) {
  const cycleDays = new Set()
  const predictedDays = new Set()

  for (const cycle of cycles) {
    const start = new Date(cycle.start_date + 'T12:00:00')
    const end = cycle.end_date ? new Date(cycle.end_date + 'T12:00:00') : new Date(start.getTime() + 4 * 86400000)
    let cur = new Date(start)
    while (cur <= end) {
      if (cur.getFullYear() === year && cur.getMonth() === month) cycleDays.add(cur.getDate())
      cur.setDate(cur.getDate() + 1)
    }
  }
  for (const { start: ps, end: pe } of (predictedRanges || [])) {
    let cur = new Date(ps)
    while (cur <= pe) {
      if (cur.getFullYear() === year && cur.getMonth() === month && !cycleDays.has(cur.getDate())) {
        predictedDays.add(cur.getDate())
      }
      cur.setDate(cur.getDate() + 1)
    }
  }
  return { cycleDays, predictedDays }
}

function MiniCalendar({ cycles, predictedRanges }) {
  const todayObj = new Date()
  const [viewYear, setViewYear] = useState2(todayObj.getFullYear())
  const [viewMonth, setViewMonth] = useState2(todayObj.getMonth())

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDow = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7
  const { cycleDays, predictedDays } = buildCycleMap(cycles, viewYear, viewMonth, predictedRanges)

  const isCurrentMonth = viewYear === todayObj.getFullYear() && viewMonth === todayObj.getMonth()
  const DAYS_IT = ['L', 'M', 'M', 'G', 'V', 'S', 'D']
  const cells = Array(firstDow).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1))

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) } else setViewMonth(m => m - 1) }
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) } else setViewMonth(m => m + 1) }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
          <ChevronLeft size={18} />
        </button>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
          {new Date(viewYear, viewMonth, 1).toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
        </p>
        <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
          <ChevronRight size={18} />
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
        {DAYS_IT.map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, paddingBottom: 4 }}>{d}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const isToday = isCurrentMonth && day === todayObj.getDate()
          const isCycle = cycleDays.has(day)
          const isPredicted = predictedDays.has(day)
          return (
            <div key={i} style={{
              width: '100%', aspectRatio: '1', borderRadius: 8,
              background: isCycle ? '#fce7f3' : isPredicted ? '#fff0f7' : isToday ? 'var(--green-pale)' : 'transparent',
              border: isToday ? '1.5px solid var(--green-main)'
                    : isCycle ? '1.5px solid #f9a8d4'
                    : isPredicted ? '1.5px dashed #f9a8d4'
                    : '1.5px solid transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: isToday ? 700 : 400,
              color: isCycle ? '#be185d' : isPredicted ? '#ec4899' : isToday ? 'var(--green-dark)' : 'var(--text-primary)',
              opacity: isPredicted ? 0.75 : 1,
            }}>
              {day}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function MenstrualCyclePage() {
  const { user, profile } = useAuth()
  const today = new Date().toISOString().split('T')[0]

  const [cycles, setCycles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [showNotes, setShowNotes] = useState(null) // cycle id for note editing
  const [noteText, setNoteText] = useState('')
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [showSymptomModal, setShowSymptomModal] = useState(null) // cycle id
  const [tableExists, setTableExists] = useState(true)

  useEffect(() => {
    loadCycles()
  }, [])

  async function loadCycles() {
    const { data, error: err } = await supabase
      .from('menstrual_cycle')
      .select('*')
      .eq('user_id', user.id)
      .order('start_date', { ascending: false })
      .limit(12)

    if (err) {
      if (err.code === '42P01') {
        setTableExists(false)
      } else {
        setError('Errore nel caricamento dati.')
      }
    } else {
      setCycles(data || [])
    }
    setLoading(false)
  }

  async function startCycle() {
    setSaving(true)
    setError('')
    const { data, error: err } = await supabase
      .from('menstrual_cycle')
      .insert({ user_id: user.id, start_date: today })
      .select()
      .single()

    if (err) {
      if (err.code === '42P01') {
        setTableExists(false)
        setError('Tabella menstrual_cycle non esiste. Creala nel Supabase SQL editor (vedi commento nel file sorgente).')
      } else {
        setError('Errore nel salvare. Riprova.')
      }
    } else if (data) {
      setCycles(prev => [data, ...prev])
    }
    setSaving(false)
  }

  async function endCycle(cycle) {
    setSaving(true)
    const duration = Math.round((new Date(today) - new Date(cycle.start_date)) / (1000 * 60 * 60 * 24)) + 1
    const { data, error: err } = await supabase
      .from('menstrual_cycle')
      .update({ end_date: today, cycle_length: duration })
      .eq('id', cycle.id)
      .select()
      .single()

    if (!err && data) {
      setCycles(prev => prev.map(c => c.id === cycle.id ? data : c))
    }
    setSaving(false)
  }

  async function deleteCycle(id) {
    const removed = cycles.find(c => c.id === id)
    setCycles(prev => prev.filter(c => c.id !== id))
    const { error } = await supabase.from('menstrual_cycle').delete().eq('id', id)
    if (error && removed) setCycles(prev => [...prev, removed])
  }

  async function saveNotes(cycleId) {
    const { data } = await supabase
      .from('menstrual_cycle')
      .update({ notes: noteText })
      .eq('id', cycleId)
      .select()
      .single()
    if (data) setCycles(prev => prev.map(c => c.id === cycleId ? data : c))
    setShowNotes(null)
    setNoteText('')
  }

  async function saveSymptoms(cycleId) {
    const { data } = await supabase
      .from('menstrual_cycle')
      .update({ symptoms: selectedSymptoms })
      .eq('id', cycleId)
      .select()
      .single()
    if (data) setCycles(prev => prev.map(c => c.id === cycleId ? data : c))
    setShowSymptomModal(null)
    setSelectedSymptoms([])
  }

  // ── Previsione ciclo (stile Flo) + Fasi del ciclo ─────────────────────────
  const completedCycles = cycles.filter(c => c.end_date && c.cycle_length)

  // Durata media del ciclo (in giorni)
  const avgDuration = completedCycles.length > 0
    ? Math.round(completedCycles.reduce((s, c) => s + c.cycle_length, 0) / completedCycles.length)
    : 5

  // Intervallo medio tra inizi (default 28 giorni)
  let avgInterval = 28
  if (cycles.length >= 2) {
    const sortedStarts = [...cycles].sort((a, b) => a.start_date.localeCompare(b.start_date))
    const intervals = []
    for (let i = 1; i < sortedStarts.length; i++) {
      const d = Math.round((new Date(sortedStarts[i].start_date + 'T12:00:00') - new Date(sortedStarts[i-1].start_date + 'T12:00:00')) / 86400000)
      if (d > 0 && d < 60) intervals.push(d) // ignora valori anomali
    }
    if (intervals.length) avgInterval = Math.round(intervals.reduce((s, x) => s + x, 0) / intervals.length)
  }

  // Genera previsioni per i prossimi 3 cicli
  let nextCycleEstimate = null
  const predictedRanges = []
  if (cycles.length > 0 && !cycles[0]?.end_date === false || cycles[0]?.start_date) {
    // Trova l'ultimo inizio registrato
    const sorted = [...cycles].sort((a, b) => b.start_date.localeCompare(a.start_date))
    const lastStart = new Date(sorted[0].start_date + 'T12:00:00')
    for (let i = 1; i <= 3; i++) {
      const predStart = new Date(lastStart)
      predStart.setDate(predStart.getDate() + avgInterval * i)
      const predEnd = new Date(predStart)
      predEnd.setDate(predEnd.getDate() + avgDuration - 1)
      if (i === 1) {
        nextCycleEstimate = {
          date: predStart.toISOString().split('T')[0],
          interval: avgInterval,
          avgDuration,
          daysUntil: Math.round((predStart - new Date()) / 86400000),
        }
      }
      predictedRanges.push({ start: predStart, end: predEnd })
    }
  }

  // ── Calcolo fasi del ciclo ─────────────────────────────────────────────────
  const ovDay = Math.max(10, Math.round(avgInterval / 2))
  const cyclePhases = [
    {
      name: 'Mestruale', emoji: '🩸',
      startDay: 1, endDay: Math.max(3, avgDuration),
      color: '#ec4899', bg: '#fce7f3',
      desc: 'Perdita di sangue. Riposo, cura di sé e alimentazione ricca di ferro.',
    },
    {
      name: 'Pre-ovulatoria', emoji: '🌱',
      startDay: Math.max(3, avgDuration) + 1, endDay: Math.max(ovDay - 3, Math.max(3, avgDuration) + 2),
      color: '#f59e0b', bg: '#fffbeb',
      desc: 'Energia in crescita, umore positivo. Estrogeni in aumento.',
    },
    {
      name: 'Ovulatoria', emoji: '🌸',
      startDay: Math.max(ovDay - 2, Math.max(3, avgDuration) + 2), endDay: ovDay + 1,
      color: '#10b981', bg: '#ecfdf5',
      desc: 'Periodo fertile. Picco di energia, libido e creatività.',
    },
    {
      name: 'Luteale', emoji: '🌙',
      startDay: ovDay + 2, endDay: avgInterval,
      color: '#7c3aed', bg: '#f5f3ff',
      desc: 'Progesterone in salita. Possibili sbalzi d\'umore (PMS), gonfiore.',
    },
  ].filter(p => p.startDay <= p.endDay)

  // Giorno attuale nel ciclo (basato sull'ultimo inizio noto)
  const lastCycleStart = cycles.length > 0
    ? [...cycles].sort((a, b) => b.start_date.localeCompare(a.start_date))[0].start_date
    : null
  const rawDayInCycle = lastCycleStart
    ? Math.round((new Date() - new Date(lastCycleStart + 'T12:00:00')) / 86400000) + 1
    : null
  const dayInCycle = rawDayInCycle !== null ? Math.min(rawDayInCycle, avgInterval) : null
  const currentPhase = dayInCycle !== null && dayInCycle > 0
    ? (cyclePhases.find(p => dayInCycle >= p.startDay && dayInCycle <= p.endDay) || cyclePhases[cyclePhases.length - 1])
    : null

  const activeCycle = cycles.find(c => c.start_date && !c.end_date)

  if (profile?.gender === 'M') {
    return (
      <div className="page">
        <div style={{ background: 'linear-gradient(160deg, #9d174d, #ec4899)', padding: 'calc(env(safe-area-inset-top) + 20px) 20px 24px' }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 }}>Salute</p>
          <h1 style={{ fontFamily: 'var(--font-d)', fontSize: 24, color: 'white', fontWeight: 300 }}>Ciclo Mestruale</h1>
        </div>
        <div style={{ padding: 20 }}>
          <div className="card" style={{ padding: 20, textAlign: 'center' }}>
            <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Sezione non disponibile</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Questa sezione è dedicata al tracciamento del ciclo mestruale e non è pertinente per il tuo profilo.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!tableExists) {
    return (
      <div className="page">
        <div style={{ background: 'linear-gradient(160deg, #9d174d, #ec4899)', padding: 'calc(env(safe-area-inset-top) + 20px) 20px 24px' }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 }}>Salute</p>
          <h1 style={{ fontFamily: 'var(--font-d)', fontSize: 24, color: 'white', fontWeight: 300 }}>Ciclo Mestruale</h1>
        </div>
        <div style={{ padding: 20 }}>
          <div className="card" style={{ padding: 20 }}>
            <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>Configurazione richiesta</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              La tabella <code>menstrual_cycle</code> non esiste ancora nel database. Esegui questo SQL nel pannello Supabase:
            </p>
            <pre style={{ background: 'var(--surface-2)', borderRadius: 10, padding: 12, fontSize: 11, marginTop: 12, overflowX: 'auto', color: 'var(--text-primary)' }}>{`CREATE TABLE IF NOT EXISTS menstrual_cycle (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  cycle_length INTEGER,
  notes TEXT,
  symptoms TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE menstrual_cycle ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own" ON menstrual_cycle FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);`}</pre>
            <button className="btn btn-primary" onClick={() => { setTableExists(true); setLoading(true); loadCycles() }} style={{ marginTop: 16 }}>
              Ho creato la tabella, riprova
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg, #9d174d, #ec4899)', padding: 'calc(env(safe-area-inset-top) + 20px) 20px 24px' }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 }}>Salute femminile</p>
        <h1 style={{ fontFamily: 'var(--font-d)', fontSize: 24, color: 'white', fontWeight: 300, marginBottom: 16 }}>Ciclo Mestruale</h1>
        {/* Stats */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { label: 'Cicli registrati', val: cycles.length },
            { label: 'Durata media', val: completedCycles.length > 0 ? `${Math.round(completedCycles.reduce((s, c) => s + c.cycle_length, 0) / completedCycles.length)}g` : '–' },
            { label: 'Intervallo medio', val: nextCycleEstimate ? `${nextCycleEstimate.interval}g` : '–' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              style={{ flex: 1, background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '10px 8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
              <p style={{ color: 'white', fontSize: 16, fontWeight: 700 }}>{s.val}</p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 2 }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 16px 80px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {error && (
          <div style={{ background: 'var(--alert-error-bg)', border: '1px solid var(--alert-error-border)', borderRadius: 12, padding: '12px 16px', color: 'var(--alert-error-text)', fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          {!activeCycle ? (
            <button
              className="btn btn-primary"
              onClick={startCycle}
              disabled={saving}
              style={{ flex: 1, background: 'linear-gradient(135deg, #9d174d, #ec4899)', justifyContent: 'center', gap: 8 }}
            >
              <Plus size={16} />
              {saving ? '…' : 'Inizia ciclo oggi'}
            </button>
          ) : (
            <>
              <div style={{ flex: 1, background: '#fce7f3', border: '1.5px solid #f9a8d4', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ec4899', animation: 'pulse 1.5s infinite' }} />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#be185d' }}>Ciclo in corso</p>
                  <p style={{ fontSize: 11, color: '#9d174d' }}>
                    Dal {new Date(activeCycle.start_date + 'T12:00:00').toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}
                    {' · '}
                    {Math.round((new Date() - new Date(activeCycle.start_date + 'T12:00:00')) / (1000 * 60 * 60 * 24)) + 1}° giorno
                  </p>
                </div>
              </div>
              <button
                className="btn"
                onClick={() => endCycle(activeCycle)}
                disabled={saving}
                style={{ background: '#fce7f3', color: '#be185d', border: '1.5px solid #f9a8d4', gap: 6, padding: '0 16px' }}
              >
                <Check size={15} />
                Fine ciclo
              </button>
            </>
          )}
        </div>

        {/* Previsione prossimo ciclo (stile Flo) */}
        {nextCycleEstimate && !activeCycle && (
          <div style={{ background: 'linear-gradient(135deg, #9d174d11, #ec489911)', border: '1.5px solid #f9a8d4', borderRadius: 16, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #9d174d, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🌸</div>
              <div>
                <p style={{ fontSize: 12, color: '#9d174d', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Prossimo ciclo stimato</p>
                <p style={{ fontSize: 16, fontWeight: 800, color: '#be185d' }}>
                  {new Date(nextCycleEstimate.date + 'T12:00:00').toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.7)', borderRadius: 10, padding: '8px 12px', textAlign: 'center' }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: '#be185d' }}>{nextCycleEstimate.daysUntil > 0 ? nextCycleEstimate.daysUntil : 0}</p>
                <p style={{ fontSize: 10, color: '#9d174d', fontWeight: 600 }}>giorni mancanti</p>
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.7)', borderRadius: 10, padding: '8px 12px', textAlign: 'center' }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: '#be185d' }}>{nextCycleEstimate.avgDuration}</p>
                <p style={{ fontSize: 10, color: '#9d174d', fontWeight: 600 }}>durata stimata</p>
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.7)', borderRadius: 10, padding: '8px 12px', textAlign: 'center' }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: '#be185d' }}>{nextCycleEstimate.interval}</p>
                <p style={{ fontSize: 10, color: '#9d174d', fontWeight: 600 }}>giorni ciclo</p>
              </div>
            </div>
            <p style={{ fontSize: 10, color: '#9d174d', opacity: 0.7, marginTop: 8, textAlign: 'center' }}>
              Stima basata sui tuoi cicli precedenti · Le date tratteggiate sul calendario indicano i cicli previsti
            </p>
          </div>
        )}

        {/* Mini calendar */}
        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Calendario del mese</h3>
          <MiniCalendar cycles={cycles} predictedRanges={predictedRanges} />
          <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: '#fce7f3', border: '1.5px solid #f9a8d4' }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Ciclo registrato</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: '#fff0f7', border: '1.5px dashed #f9a8d4' }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Ciclo previsto</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: 'var(--green-pale)', border: '1.5px solid var(--green-main)' }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Oggi</span>
            </div>
          </div>
        </div>

        {/* ── Fasi del ciclo ── */}
        {cycles.length > 0 && cyclePhases.length > 0 && (
          <div className="card" style={{ padding: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Fasi del ciclo</h3>

            {/* Fase attuale */}
            {currentPhase && dayInCycle !== null && (
              <div style={{
                background: currentPhase.bg,
                borderRadius: 14, padding: '12px 14px', marginBottom: 14,
                border: `1.5px solid ${currentPhase.color}55`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 30 }}>{currentPhase.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 10, color: currentPhase.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>
                      Fase attuale · Giorno {dayInCycle} di {avgInterval}
                    </p>
                    <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>{currentPhase.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.4 }}>{currentPhase.desc}</p>
                  </div>
                </div>
                {/* Progress bar in cycle */}
                <div style={{ marginTop: 10, height: 4, background: 'rgba(0,0,0,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, Math.round(dayInCycle / avgInterval * 100))}%`, background: currentPhase.color, borderRadius: 2, transition: 'width .6s' }} />
                </div>
                <p style={{ fontSize: 10, color: currentPhase.color, marginTop: 4, opacity: 0.8 }}>
                  {avgInterval - dayInCycle} giorni al prossimo ciclo stimato
                </p>
              </div>
            )}

            {/* Timeline di tutte le fasi */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {cyclePhases.map(p => {
                const isActive = currentPhase?.name === p.name
                return (
                  <div key={p.name} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 12,
                    background: isActive ? p.bg : 'var(--surface-2)',
                    border: `1.5px solid ${isActive ? p.color + '55' : 'transparent'}`,
                    transition: 'all .15s',
                  }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{p.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: isActive ? p.color : 'var(--text-primary)' }}>{p.name}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Giorni {p.startDay}–{p.endDay} · {p.endDay - p.startDay + 1} giorni</p>
                    </div>
                    {isActive ? (
                      <span style={{ fontSize: 10, background: p.color, color: 'white', borderRadius: 100, padding: '2px 9px', fontWeight: 700, flexShrink: 0 }}>Ora</span>
                    ) : (
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', flexShrink: 0 }}>g.{p.startDay}–{p.endDay}</span>
                    )}
                  </div>
                )
              })}
            </div>
            <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 10, textAlign: 'center', opacity: 0.7 }}>
              Stime basate su ciclo medio di {avgInterval} giorni · Per uso informativo
            </p>
          </div>
        )}

        {/* Consigli nutrizionali per fase */}
        {currentPhase && PHASE_NUTRITION[currentPhase.name] && (() => {
          const tips = PHASE_NUTRITION[currentPhase.name]
          return (
            <div className="card" style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 22 }}>{currentPhase.emoji}</span>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: tips.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Consigli nutrizionali</p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Fase {currentPhase.name}</p>
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.5, background: tips.bg, borderRadius: 10, padding: '10px 12px', border: `1px solid ${tips.color}33` }}>{tips.summary}</p>
              <p style={{ fontSize: 11, fontWeight: 700, color: tips.color, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>✅ Preferisci</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                {tips.foods.map((f, i) => (
                  <p key={i} style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4, paddingLeft: 4 }}>{f}</p>
                ))}
              </div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>⚠️ Riduci o evita</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {tips.avoid.map((f, i) => (
                  <p key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4, paddingLeft: 4 }}>{f}</p>
                ))}
              </div>
            </div>
          )
        })()}

        {/* History list */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: 13 }}>Caricamento…</div>
        ) : cycles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <Calendar size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p style={{ fontSize: 15, fontWeight: 500 }}>Nessun ciclo registrato</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Premi "Inizia ciclo oggi" per cominciare il tracciamento.</p>
          </div>
        ) : (
          <div className="card" style={{ padding: '18px 20px' }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Storico cicli</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {cycles.slice(0, 6).map((cycle, idx) => {
                const startD = new Date(cycle.start_date + 'T12:00:00')
                const endD = cycle.end_date ? new Date(cycle.end_date + 'T12:00:00') : null
                const isActive = !cycle.end_date
                return (
                  <motion.div key={cycle.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                    <div style={{ padding: '12px 14px', background: isActive ? '#fdf2f8' : 'var(--surface-2)', borderRadius: 12, border: isActive ? '1.5px solid #f9a8d4' : '1px solid var(--border-light)' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <span style={{ fontSize: 18 }}>{isActive ? '🩸' : '🌸'}</span>
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 600, color: isActive ? '#be185d' : 'var(--text-primary)' }}>
                                {startD.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                                {endD && ` → ${endD.toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })}`}
                              </p>
                              {cycle.cycle_length && (
                                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{cycle.cycle_length} giorni di durata</p>
                              )}
                              {isActive && (
                                <p style={{ fontSize: 11, color: '#ec4899', fontWeight: 500 }}>In corso</p>
                              )}
                            </div>
                          </div>

                          {/* Symptoms */}
                          {cycle.symptoms?.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
                              {cycle.symptoms.map(s => (
                                <span key={s} style={{ fontSize: 10, background: '#fce7f3', color: '#be185d', borderRadius: 100, padding: '2px 7px', border: '1px solid #f9a8d4' }}>{s}</span>
                              ))}
                            </div>
                          )}

                          {cycle.notes && (
                            <p style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>"{cycle.notes}"</p>
                          )}

                          {/* Actions */}
                          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                            <button
                              onClick={() => { setShowSymptomModal(cycle.id); setSelectedSymptoms(cycle.symptoms || []) }}
                              style={{ fontSize: 11, fontFamily: 'var(--font-b)', color: '#ec4899', background: 'none', border: '1px solid #f9a8d4', borderRadius: 8, padding: '4px 10px', cursor: 'pointer' }}
                            >
                              + Sintomi
                            </button>
                            <button
                              onClick={() => { setShowNotes(cycle.id); setNoteText(cycle.notes || '') }}
                              style={{ fontSize: 11, fontFamily: 'var(--font-b)', color: 'var(--text-muted)', background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer' }}
                            >
                              📝 Note
                            </button>
                          </div>
                        </div>
                        <button onClick={() => deleteCycle(cycle.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: 'var(--text-muted)', flexShrink: 0 }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Symptom modal */}
      {showSymptomModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.65)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div className="animate-slideUp" style={{ background: 'var(--surface)', borderRadius: '20px 20px 0 0', padding: 20, paddingBottom: 'calc(20px + env(safe-area-inset-bottom))', maxHeight: '90dvh', overflowY: 'auto', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Sintomi</h3>
              <button onClick={() => setShowSymptomModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {CYCLE_SYMPTOMS.map(s => (
                <button key={s} onClick={() => setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
                  style={{ padding: '7px 14px', borderRadius: 100, font: 'inherit', fontSize: 13, cursor: 'pointer',
                    background: selectedSymptoms.includes(s) ? '#fce7f3' : 'var(--surface-2)',
                    color: selectedSymptoms.includes(s) ? '#be185d' : 'var(--text-secondary)',
                    border: `1.5px solid ${selectedSymptoms.includes(s) ? '#f9a8d4' : 'var(--border)'}` }}>
                  {s}
                </button>
              ))}
            </div>
            <button className="btn btn-primary" onClick={() => saveSymptoms(showSymptomModal)} style={{ width: '100%', background: 'linear-gradient(135deg, #9d174d, #ec4899)' }}>
              Salva sintomi
            </button>
          </div>
        </div>
      )}

      {/* Notes modal */}
      {showNotes && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'var(--surface)', borderRadius: 16, padding: 20, width: '100%', maxWidth: 400, maxHeight: '85dvh', overflowY: 'auto', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Note ciclo</h3>
              <button onClick={() => setShowNotes(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <textarea
              className="input-field"
              rows={4}
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Come ti senti? Annotazioni…"
              style={{ resize: 'vertical', marginBottom: 12 }}
              autoFocus
            />
            <button className="btn btn-primary" onClick={() => saveNotes(showNotes)} style={{ width: '100%', background: 'linear-gradient(135deg, #9d174d, #ec4899)' }}>
              Salva note
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
