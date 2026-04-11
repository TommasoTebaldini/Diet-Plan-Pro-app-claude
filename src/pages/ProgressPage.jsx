import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { TrendingDown, TrendingUp, Minus, Target, Plus, Scale, Activity, Flame } from 'lucide-react'

const MOOD_OPTIONS = [
  { value: 1, emoji: '😞', label: 'Pessimo' },
  { value: 2, emoji: '😕', label: 'Non bene' },
  { value: 3, emoji: '😐', label: 'Nella norma' },
  { value: 4, emoji: '😊', label: 'Bene' },
  { value: 5, emoji: '😄', label: 'Ottimo' },
]

const SYMPTOM_LIST = ['Stanchezza', 'Gonfiore', 'Mal di testa', 'Insonnia', 'Fame', 'Nausea', 'Energia alta', 'Umore positivo']

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow-md)' }}>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--green-main)' }}>{payload[0].value} kg</p>
    </div>
  )
}

export default function ProgressPage() {
  const { user, profile } = useAuth()
  const [weights, setWeights] = useState([])
  const [todayLog, setTodayLog] = useState(null)
  const [newWeight, setNewWeight] = useState('')
  const [mood, setMood] = useState(null)
  const [symptoms, setSymptoms] = useState([])
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [range, setRange] = useState(30)
  const [macroHistory, setMacroHistory] = useState([])
  const [macroRange, setMacroRange] = useState(30)
  const [dietTarget, setDietTarget] = useState(null)
  const [macroTab, setMacroTab] = useState('kcal') // kcal | proteins | carbs | fats
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    loadMacroHistory()
  }, [macroRange])

  async function loadData() {
    const [wRes, logRes, dietRes] = await Promise.all([
      supabase.from('weight_logs').select('*').eq('user_id', user.id).order('date', { ascending: true }),
      supabase.from('daily_wellness').select('*').eq('date', today).maybeSingle(),
      supabase.from('patient_diets').select('kcal_target,protein_target,carbs_target,fats_target').eq('is_active', true).maybeSingle(),
    ])
    setWeights(wRes.data || [])
    setDietTarget(dietRes.data || null)
    const log = logRes.data
    setTodayLog(log)
    if (log) {
      setMood(log.mood)
      setSymptoms(log.symptoms || [])
      setNotes(log.notes || '')
    }
  }

  async function loadMacroHistory() {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - macroRange)
    const from = cutoffDate.toISOString().split('T')[0]
    const { data } = await supabase
      .from('daily_logs')
      .select('date, kcal, proteins, carbs, fats')
      .gte('date', from)
      .order('date', { ascending: true })
    setMacroHistory(data || [])
  }

  async function saveEntry() {
    setSaving(true)
    // Save weight
    if (newWeight) {
      const w = parseFloat(newWeight)
      if (!isNaN(w)) {
        const { data } = await supabase.from('weight_logs')
          .upsert({ user_id: user.id, date: today, weight_kg: w }, { onConflict: 'user_id,date' })
          .select().single()
        if (data) setWeights(prev => {
          const filtered = prev.filter(x => x.date !== today)
          return [...filtered, data].sort((a, b) => a.date.localeCompare(b.date))
        })
      }
    }
    // Save wellness
    if (mood || symptoms.length || notes) {
      await supabase.from('daily_wellness')
        .upsert({ user_id: user.id, date: today, mood, symptoms, notes }, { onConflict: 'user_id,date' })
    }
    setShowAdd(false)
    setSaving(false)
    loadData()
  }

  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - range)
  const chartData = weights
    .filter(w => new Date(w.date) >= cutoff)
    .map(w => ({
      date: new Date(w.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }),
      peso: w.weight_kg
    }))

  const latest = weights[weights.length - 1]?.weight_kg
  const previous = weights[weights.length - 2]?.weight_kg
  const diff = latest && previous ? (latest - previous).toFixed(1) : null
  const target = profile?.target_weight
  const initial = weights[0]?.weight_kg

  const totalChange = latest && initial ? (latest - initial).toFixed(1) : null

  return (
    <div className="page">
      <div style={{ background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))', padding: 'calc(env(safe-area-inset-top) + 20px) 24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 }}>Il mio percorso</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'white', fontWeight: 300 }}>Progressi</h1>
          </div>
          <button onClick={() => setShowAdd(v => !v)} className="btn" style={{ background: 'white', color: 'var(--green-main)', borderRadius: 14, padding: '10px 16px', fontSize: 14, fontWeight: 600, gap: 6 }}>
            <Plus size={16} />Oggi
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { label: 'Peso attuale', val: latest ? `${latest} kg` : '–', sub: diff ? `${diff > 0 ? '+' : ''}${diff} kg` : '', icon: <Scale size={14} /> },
            { label: 'Cambiamento', val: totalChange ? `${totalChange > 0 ? '+' : ''}${totalChange} kg` : '–', sub: 'dall\'inizio', icon: <Activity size={14} /> },
            { label: 'Obiettivo', val: target ? `${target} kg` : '–', sub: latest && target ? `Mancano ${Math.abs(latest - target).toFixed(1)} kg` : '', icon: <Target size={14} /> },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 14, padding: '12px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>
                {s.icon}<span style={{ fontSize: 10 }}>{s.label}</span>
              </div>
              <p style={{ color: 'white', fontSize: 16, fontWeight: 700 }}>{s.val}</p>
              {s.sub && <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, marginTop: 2 }}>{s.sub}</p>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Add entry panel */}
        {showAdd && (
          <div className="card animate-slideUp" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>📝 Aggiorna di oggi</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="input-group">
                <label className="input-label">⚖️ Peso (kg)</label>
                <input type="number" step="0.1" className="input-field" placeholder="es. 72.5" value={newWeight} onChange={e => setNewWeight(e.target.value)} />
              </div>
              <div>
                <p className="input-label" style={{ marginBottom: 10 }}>😊 Come ti senti oggi?</p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  {MOOD_OPTIONS.map(m => (
                    <button key={m.value} onClick={() => setMood(m.value)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: `2px solid ${mood === m.value ? 'var(--green-main)' : 'var(--border)'}`, borderRadius: 14, padding: '10px 8px', cursor: 'pointer', transition: 'all 0.15s', transform: mood === m.value ? 'scale(1.1)' : 'none' }}>
                      <span style={{ fontSize: 24 }}>{m.emoji}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="input-label" style={{ marginBottom: 10 }}>🔍 Sintomi / Note fisiche</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {SYMPTOM_LIST.map(s => (
                    <button key={s} onClick={() => setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])} style={{ padding: '6px 14px', borderRadius: 100, background: symptoms.includes(s) ? 'var(--green-pale)' : 'var(--surface-2)', color: symptoms.includes(s) ? 'var(--green-main)' : 'var(--text-secondary)', border: `1.5px solid ${symptoms.includes(s) ? 'var(--green-main)' : 'var(--border)'}`, font: 'inherit', fontSize: 13, cursor: 'pointer' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">📓 Note libere</label>
                <textarea className="input-field" rows={3} placeholder="Come è andata oggi? Annotazioni sulla dieta…" value={notes} onChange={e => setNotes(e.target.value)} style={{ resize: 'vertical' }} />
              </div>
              <button className="btn btn-primary" onClick={saveEntry} disabled={saving}>
                {saving ? 'Salvataggio…' : 'Salva'}
              </button>
            </div>
          </div>
        )}

        {/* Chart */}
        {chartData.length > 1 && (
          <div className="card" style={{ padding: '18px 12px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600 }}>Andamento peso</h3>
              <div style={{ display: 'flex', gap: 6 }}>
                {[7, 30, 90].map(r => (
                  <button key={r} onClick={() => setRange(r)} style={{ padding: '4px 10px', borderRadius: 100, background: range === r ? 'var(--green-main)' : 'var(--surface-2)', color: range === r ? 'white' : 'var(--text-muted)', border: `1px solid ${range === r ? 'transparent' : 'var(--border)'}`, font: 'inherit', fontSize: 12, cursor: 'pointer' }}>
                    {r}g
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip content={<CustomTooltip />} />
                {target && <ReferenceLine y={target} stroke="var(--orange)" strokeDasharray="4 4" label={{ value: 'Obiettivo', fontSize: 10, fill: 'var(--orange)', position: 'insideTopRight' }} />}
                <Line type="monotone" dataKey="peso" stroke="var(--green-main)" strokeWidth={2.5} dot={{ r: 3, fill: 'var(--green-main)' }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* History */}
        {weights.length > 0 && (
          <div className="card" style={{ padding: '18px 20px' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Storico misurazioni</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[...weights].reverse().slice(0, 10).map((w, i) => {
                const prev = [...weights].reverse()[i + 1]
                const d = prev ? (w.weight_kg - prev.weight_kg).toFixed(1) : null
                return (
                  <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Scale size={18} color="var(--green-main)" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 15, fontWeight: 600 }}>{w.weight_kg} kg</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(w.date).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                    </div>
                    {d !== null && (
                      <span style={{ fontSize: 13, fontWeight: 600, color: parseFloat(d) < 0 ? 'var(--green-main)' : parseFloat(d) > 0 ? 'var(--red)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 2 }}>
                        {parseFloat(d) < 0 ? <TrendingDown size={14} /> : parseFloat(d) > 0 ? <TrendingUp size={14} /> : <Minus size={14} />}
                        {d > 0 ? '+' : ''}{d}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {weights.length === 0 && !showAdd && (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
            <Scale size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
            <p style={{ fontSize: 15, fontWeight: 500 }}>Inizia a tracciare i tuoi progressi</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Registra il tuo peso e come ti senti ogni giorno.</p>
            <button className="btn btn-primary" onClick={() => setShowAdd(true)} style={{ marginTop: 20 }}>
              <Plus size={16} />Aggiungi prima misurazione
            </button>
          </div>
        )}

        {/* ── Macro history chart ── */}
        <div className="card" style={{ padding: '18px 12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Flame size={16} color="var(--green-main)" />
              <h3 style={{ fontSize: 15, fontWeight: 600 }}>Storico macronutrienti</h3>
            </div>
            <div style={{ display: 'flex', gap: 5 }}>
              {[30, 90].map(r => (
                <button key={r} onClick={() => setMacroRange(r)} style={{ padding: '4px 10px', borderRadius: 100, background: macroRange === r ? 'var(--green-main)' : 'var(--surface-2)', color: macroRange === r ? 'white' : 'var(--text-muted)', border: `1px solid ${macroRange === r ? 'transparent' : 'var(--border)'}`, font: 'inherit', fontSize: 12, cursor: 'pointer' }}>
                  {r}g
                </button>
              ))}
            </div>
          </div>

          {/* Macro tab selector */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingLeft: 8, paddingBottom: 12 }}>
            {[
              { key: 'kcal', label: '🔥 Kcal', color: '#f0922b', targetKey: 'kcal_target' },
              { key: 'proteins', label: '💪 Prot.', color: '#3b82f6', targetKey: 'protein_target' },
              { key: 'carbs', label: '🌾 Carbo', color: '#f0922b', targetKey: 'carbs_target' },
              { key: 'fats', label: '🥑 Grassi', color: '#e05a5a', targetKey: 'fats_target' },
            ].map(t => (
              <button key={t.key} onClick={() => setMacroTab(t.key)} style={{ flexShrink: 0, padding: '5px 12px', borderRadius: 100, background: macroTab === t.key ? 'var(--green-main)' : 'var(--surface-2)', color: macroTab === t.key ? 'white' : 'var(--text-secondary)', border: `1.5px solid ${macroTab === t.key ? 'transparent' : 'var(--border)'}`, font: 'inherit', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
                {t.label}
              </button>
            ))}
          </div>

          {macroHistory.length > 0 ? (() => {
            const tabs = {
              kcal: { color: '#f0922b', targetKey: 'kcal_target', unit: 'kcal' },
              proteins: { color: '#3b82f6', targetKey: 'protein_target', unit: 'g' },
              carbs: { color: '#f0922b', targetKey: 'carbs_target', unit: 'g' },
              fats: { color: '#e05a5a', targetKey: 'fats_target', unit: 'g' },
            }
            const { color, targetKey, unit } = tabs[macroTab]
            const targetVal = dietTarget?.[targetKey] || null
            const chartData = macroHistory.map(d => ({
              date: new Date(d.date + 'T12:00:00').toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }),
              val: Math.round((d[macroTab] || 0) * 10) / 10,
              target: targetVal,
            }))
            return (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                  <Tooltip
                    formatter={(v, n) => [`${v} ${unit}`, n === 'val' ? (macroTab === 'kcal' ? 'Kcal' : macroTab) : 'Obiettivo']}
                    labelStyle={{ fontSize: 11 }}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border)' }}
                  />
                  {targetVal && <ReferenceLine y={targetVal} stroke={color} strokeDasharray="4 4" strokeWidth={1.5} label={{ value: 'Obiettivo', fontSize: 9, fill: color, position: 'insideTopRight' }} />}
                  <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={targetVal && entry.val > targetVal ? '#e05a5a' : color} fillOpacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )
          })() : (
            <div style={{ textAlign: 'center', padding: '28px 0', color: 'var(--text-muted)', fontSize: 13 }}>
              <Flame size={28} style={{ marginBottom: 8, opacity: 0.2 }} />
              <p>Nessun dato disponibile.<br />Inizia a registrare i tuoi pasti nel diario.</p>
            </div>
          )}

          {/* Daily list */}
          {macroHistory.length > 0 && (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border-light)' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, paddingLeft: 8 }}>Ultimi {macroRange} giorni</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[...macroHistory].reverse().slice(0, 15).map(d => {
                  const pct = dietTarget?.kcal_target ? Math.min(100, Math.round(d.kcal / dietTarget.kcal_target * 100)) : null
                  return (
                    <div key={d.date} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'var(--surface-2)', borderRadius: 10 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                          <p style={{ fontSize: 12, fontWeight: 600 }}>{new Date(d.date + 'T12:00:00').toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                          <p style={{ fontSize: 12, fontWeight: 700, color: pct !== null && pct > 105 ? 'var(--red)' : 'var(--green-main)' }}>
                            {d.kcal} kcal{pct !== null ? ` (${pct}%)` : ''}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                          {[`P:${Math.round(d.proteins || 0)}g`, `C:${Math.round(d.carbs || 0)}g`, `G:${Math.round(d.fats || 0)}g`].map(v => (
                            <span key={v} style={{ fontSize: 10, background: 'var(--surface)', padding: '1px 6px', borderRadius: 100, color: 'var(--text-muted)' }}>{v}</span>
                          ))}
                        </div>
                        {dietTarget?.kcal_target && (
                          <div style={{ height: 3, background: 'var(--border-light)', borderRadius: 2, marginTop: 5, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${Math.min(100, pct)}%`, background: pct > 105 ? 'var(--red)' : 'var(--green-main)', borderRadius: 2, transition: 'width 0.5s ease' }} />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
