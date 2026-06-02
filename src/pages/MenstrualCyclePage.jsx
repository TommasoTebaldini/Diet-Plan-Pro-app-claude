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

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function MiniCalendar({ cycles }) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7 // Mon=0

  // Build set of cycle dates for this month
  const cycleDays = new Set()
  for (const cycle of cycles) {
    const start = new Date(cycle.start_date + 'T12:00:00')
    const end = cycle.end_date ? new Date(cycle.end_date + 'T12:00:00') : start
    let cur = new Date(start)
    while (cur <= end) {
      if (cur.getFullYear() === year && cur.getMonth() === month) {
        cycleDays.add(cur.getDate())
      }
      cur.setDate(cur.getDate() + 1)
    }
  }

  const DAYS_IT = ['L', 'M', 'M', 'G', 'V', 'S', 'D']
  const cells = Array(firstDow).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1))

  return (
    <div>
      <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>
        {today.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {DAYS_IT.map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, paddingBottom: 4 }}>{d}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const isToday = day === today.getDate()
          const isCycle = cycleDays.has(day)
          return (
            <div key={i} style={{
              width: '100%', aspectRatio: '1',
              borderRadius: 8,
              background: isCycle ? '#fce7f3' : isToday ? 'var(--green-pale)' : 'transparent',
              border: isToday ? '1.5px solid var(--green-main)' : isCycle ? '1.5px solid #f9a8d4' : '1.5px solid transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: isToday ? 700 : 400,
              color: isCycle ? '#be185d' : isToday ? 'var(--green-dark)' : 'var(--text-primary)',
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
  const { user } = useAuth()
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
    await supabase.from('menstrual_cycle').delete().eq('id', id)
    setCycles(prev => prev.filter(c => c.id !== id))
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

  // Estimate next cycle based on average cycle length
  const completedCycles = cycles.filter(c => c.end_date && c.cycle_length)
  let nextCycleEstimate = null
  if (completedCycles.length >= 1 && cycles[0]?.start_date) {
    const avgLength = Math.round(
      completedCycles.reduce((s, c) => s + c.cycle_length, 0) / completedCycles.length
    )
    // Average interval between starts (if multiple cycles)
    let avgInterval = 28
    if (completedCycles.length >= 2) {
      const starts = [...cycles].reverse().map(c => new Date(c.start_date + 'T12:00:00'))
      const intervals = []
      for (let i = 1; i < starts.length; i++) {
        intervals.push(Math.round((starts[i] - starts[i - 1]) / (1000 * 60 * 60 * 24)))
      }
      avgInterval = Math.round(intervals.reduce((s, x) => s + x, 0) / intervals.length)
    }
    const lastStart = new Date(cycles[0].start_date + 'T12:00:00')
    const nextStart = new Date(lastStart)
    nextStart.setDate(nextStart.getDate() + avgInterval)
    nextCycleEstimate = { date: nextStart.toISOString().split('T')[0], interval: avgInterval, avgLength }
  }

  const activeCycle = cycles.find(c => c.start_date && !c.end_date)

  if (!tableExists) {
    return (
      <div className="page">
        <div style={{ background: 'linear-gradient(160deg, #9d174d, #ec4899)', padding: 'calc(env(safe-area-inset-top) + 20px) 20px 24px' }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 }}>Salute</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'white', fontWeight: 300 }}>Ciclo Mestruale</h1>
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
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'white', fontWeight: 300, marginBottom: 16 }}>Ciclo Mestruale</h1>
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

        {/* Next cycle estimate */}
        {nextCycleEstimate && !activeCycle && (
          <div className="card" style={{ padding: 14, background: '#fdf2f8', border: '1.5px solid #f9a8d4' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>📅</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#9d174d' }}>Prossimo ciclo stimato</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#be185d' }}>
                  {new Date(nextCycleEstimate.date + 'T12:00:00').toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  Basato su intervallo medio di {nextCycleEstimate.interval} giorni
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mini calendar */}
        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Calendario del mese</h3>
          <MiniCalendar cycles={cycles} />
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: '#fce7f3', border: '1.5px solid #f9a8d4' }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Giorno ciclo</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: 'var(--green-pale)', border: '1.5px solid var(--green-main)' }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Oggi</span>
            </div>
          </div>
        </div>

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
                              style={{ fontSize: 11, color: '#ec4899', background: 'none', border: '1px solid #f9a8d4', borderRadius: 8, padding: '4px 10px', cursor: 'pointer' }}
                            >
                              + Sintomi
                            </button>
                            <button
                              onClick={() => { setShowNotes(cycle.id); setNoteText(cycle.notes || '') }}
                              style={{ fontSize: 11, color: 'var(--text-muted)', background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer' }}
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
          <div className="animate-slideUp" style={{ background: 'var(--surface)', borderRadius: '20px 20px 0 0', padding: 20, paddingBottom: 'calc(20px + env(safe-area-inset-bottom))' }}>
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
          <div style={{ background: 'var(--surface)', borderRadius: 16, padding: 20, width: '100%', maxWidth: 400 }}>
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
