import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useT } from '../i18n'
import ProGate from '../components/ProGate'
import { useSubscription } from '../hooks/useSubscription'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { TrendingDown, TrendingUp, Minus, Target, Plus, Scale, Activity } from 'lucide-react'

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
  const { isPro } = useSubscription()
  const t = useT()
  const [weights, setWeights] = useState([])
  const [todayLog, setTodayLog] = useState(null)
  const [newWeight, setNewWeight] = useState('')
  const [mood, setMood] = useState(null)
  const [symptoms, setSymptoms] = useState([])
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [saveOk, setSaveOk] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [range, setRange] = useState(30)
  const today = new Date().toISOString().split('T')[0]
  const [cartellaId, setCartellaId] = useState(null)
  const [schede, setSchede] = useState([])
  const [biaData, setBiaData] = useState([])
  const [activeTab, setActiveTab] = useState('peso') // 'peso' | 'circonferenze' | 'bia'

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const [weightsRes, wellnessRes, linkRes] = await Promise.all([
      supabase.from('weight_logs').select('id,date,weight_kg').eq('user_id', user.id).order('date', { ascending: true }).limit(730),
      supabase.from('daily_wellness').select('*').eq('user_id', user.id).eq('date', today).maybeSingle(),
      supabase.from('patient_dietitian').select('cartella_id').eq('patient_id', user.id).maybeSingle(),
    ])
    setWeights(weightsRes.data || [])
    const log = wellnessRes.data
    setTodayLog(log)
    if (log) {
      setMood(log.mood)
      setSymptoms(Array.isArray(log.symptoms) ? log.symptoms : [])
      setNotes(log.notes || '')
    }
    const cid = linkRes.data?.cartella_id
    if (cid) {
      setCartellaId(cid)
      const [schedeRes, biaRes] = await Promise.all([
        supabase.from('schede_valutazione').select('id,saved_at,peso,vita,fianchi,braccio,plica,massa_grassa_pct,massa_magra').eq('cartella_id', cid).eq('visible_to_patient', true).order('saved_at', { ascending: true }),
        supabase.from('bia_records').select('id,data_misura,peso,bf_pct,ffm_kg,fm_kg,tbw,angolo_fase,bcm,muscle').eq('cartella_id', cid).eq('visible_to_patient', true).order('data_misura', { ascending: true }),
      ])
      setSchede(schedeRes.data || [])
      setBiaData(biaRes.data || [])
    }
  }

  async function saveEntry() {
    setSaving(true)
    setSaveError(null)
    setSaveOk(false)

    try {
      // Save weight
      if (newWeight) {
        const w = parseFloat(newWeight)
        if (!isNaN(w)) {
          const { data, error } = await supabase.from('weight_logs')
            .upsert({ user_id: user.id, date: today, weight_kg: w }, { onConflict: 'user_id,date' })
            .select().single()
          if (error) throw new Error('Errore peso: ' + error.message)
          if (data) setWeights(prev => {
            const filtered = prev.filter(x => x.date !== today)
            return [...filtered, data].sort((a, b) => a.date.localeCompare(b.date))
          })
        }
      }

      // Save wellness — symptoms must be text[] for Supabase
      if (mood || symptoms.length || notes) {
        const wellnessData = {
          user_id: user.id,
          date: today,
          mood: mood || null,
          symptoms: symptoms,   // array di stringhe
          notes: notes || null,
        }
        const { error } = await supabase.from('daily_wellness')
          .upsert(wellnessData, { onConflict: 'user_id,date' })
        if (error) throw new Error('Errore benessere: ' + error.message)
      }

      setSaveOk(true)
      setShowAdd(false)
      setTimeout(() => setSaveOk(false), 3000)
      loadData()
    } catch (e) {
      setSaveError(e.message)
    } finally {
      setSaving(false)
    }
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
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'white', fontWeight: 300 }}>{t('progress.title')}</h1>
          </div>
          <button onClick={() => setShowAdd(v => !v)} className="btn" style={{ background: 'white', color: 'var(--green-main)', borderRadius: 14, padding: '10px 16px', fontSize: 14, fontWeight: 600, gap: 6 }}>
            <Plus size={16} />{t('common.today')}
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: 10 }}>
          {[
            { label: t('progress.weight'), val: latest ? `${latest} kg` : '–', sub: diff ? `${diff > 0 ? '+' : ''}${diff} kg` : '', icon: <Scale size={14} /> },
            { label: t('progress.trend'), val: totalChange ? `${totalChange > 0 ? '+' : ''}${totalChange} kg` : '–', sub: "dall'inizio", icon: <Activity size={14} /> },
            { label: t('dash.goal'), val: target ? `${target} kg` : '–', sub: latest && target ? `Mancano ${Math.abs(latest - target).toFixed(1)} kg` : '', icon: <Target size={14} /> },
          ].map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 14, padding: '12px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>
                {s.icon}<span style={{ fontSize: 10 }}>{s.label}</span>
              </div>
              <p style={{ color: 'white', fontSize: 16, fontWeight: 700 }}>{s.val}</p>
              {s.sub && <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, marginTop: 2 }}>{s.sub}</p>}
            </motion.div>
          ))}
        </div>
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 6, background: 'var(--surface-2)', borderRadius: 12, padding: 4 }}>
          {[
            { key: 'peso', label: '⚖️ Peso' },
            { key: 'circonferenze', label: '📏 Misure' },
            { key: 'bia', label: '⚡ BIA' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              flex: 1, padding: '8px 4px', borderRadius: 9, border: 'none', cursor: 'pointer', font: 'inherit',
              fontSize: 12, fontWeight: 600, transition: 'all .15s',
              background: activeTab === tab.key ? 'var(--surface)' : 'transparent',
              color: activeTab === tab.key ? 'var(--green-main)' : 'var(--text-muted)',
              boxShadow: activeTab === tab.key ? '0 1px 4px rgba(0,0,0,.1)' : 'none',
            }}>{tab.label}</button>
          ))}
        </div>

        {/* ── Peso ── */}
        {activeTab === 'peso' && (
          <>
            {/* Success / Error feedback */}
            {saveOk && (
              <div style={{ background: 'var(--alert-success-bg)', border: '1px solid var(--alert-success-border)', borderRadius: 12, padding: '12px 16px', fontSize: 14, color: 'var(--alert-success-text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                ✅ Dati salvati con successo!
              </div>
            )}
            {saveError && (
              <div style={{ background: 'var(--alert-error-bg)', border: '1px solid var(--alert-error-border)', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: 'var(--alert-error-text)' }}>
                ⚠️ {saveError}
                <p style={{ fontSize: 11, marginTop: 4, opacity: 0.8 }}>
                  Se l'errore persiste, esegui questo SQL su Supabase:<br />
                  <code style={{ fontFamily: 'monospace', fontSize: 10 }}>
                    ALTER TABLE daily_wellness ENABLE ROW LEVEL SECURITY;<br />
                    CREATE POLICY "utenti wellness" ON daily_wellness FOR ALL USING (auth.uid() = user_id);
                  </code>
                </p>
              </div>
            )}

            {/* Today's wellness summary */}
            {todayLog && !showAdd && (
              <div className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 28 }}>
                  {MOOD_OPTIONS.find(m => m.value === todayLog.mood)?.emoji || '😐'}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Benessere di oggi registrato</p>
                  {todayLog.symptoms?.length > 0 && (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{todayLog.symptoms.join(', ')}</p>
                  )}
                </div>
                <button onClick={() => setShowAdd(true)} style={{ background: 'var(--surface-2)', border: 'none', borderRadius: 10, padding: '6px 12px', fontSize: 12, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  Modifica
                </button>
              </div>
            )}

            {/* Add entry panel */}
            {showAdd && (
              <div className="card animate-slideUp" style={{ padding: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>📝 Aggiorna di oggi</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="input-group">
                    <label className="input-label">⚖️ {t('progress.weight')}</label>
                    <input type="number" step="0.1" className="input-field" placeholder="es. 72.5" value={newWeight} onChange={e => setNewWeight(e.target.value)} />
                  </div>
                  <div>
                    <p className="input-label" style={{ marginBottom: 10 }}>😊 Come ti senti oggi?</p>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                      {MOOD_OPTIONS.map(m => (
                        <button key={m.value} onClick={() => setMood(m.value)} style={{ flex: 1, minWidth: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: `2px solid ${mood === m.value ? 'var(--green-main)' : 'var(--border)'}`, borderRadius: 14, padding: '10px 8px', cursor: 'pointer', transition: 'all 0.15s', transform: mood === m.value ? 'scale(1.1)' : 'none' }}>
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
                    {saving ? `${t('common.save')}…` : t('common.save')}
                  </button>
                </div>
              </div>
            )}

            {/* Chart — Pro only */}
            {chartData.length > 1 && (
              <ProGate feature="Grafico andamento peso" teaser="Visualizza il grafico dell'andamento del tuo peso nel tempo">
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
              </ProGate>
            )}

            {/* History */}
            {weights.length > 0 && (
              <div className="card" style={{ padding: '18px 16px' }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Storico misurazioni</h3>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {[...weights].reverse().slice(0, isPro ? 10 : 3).map((w, i, arr) => {
                    const prev = arr[i + 1]
                    const d = prev ? (w.weight_kg - prev.weight_kg).toFixed(1) : null
                    const dVal = d !== null ? parseFloat(d) : null
                    const isToday = w.date === today
                    const isLast = i === arr.length - 1
                    // Distance to target as percentage (0–100%)
                    const distPct = target && initial && latest
                      ? Math.max(0, Math.min(100, 100 - Math.abs(w.weight_kg - target) / Math.max(0.1, Math.abs(initial - target)) * 100))
                      : null
                    return (
                      <div key={w.id} style={{ display: 'flex', gap: 12, position: 'relative' }}>
                        {/* Timeline connector line */}
                        {!isLast && (
                          <div style={{ position: 'absolute', left: 19, top: 42, bottom: 0, width: 2, background: 'var(--border-light)', zIndex: 0 }} />
                        )}
                        {/* Icon bubble */}
                        <div style={{
                          width: 40, height: 40, borderRadius: '50%', flexShrink: 0, zIndex: 1,
                          background: dVal !== null && dVal < 0 ? 'var(--green-pale)' : dVal !== null && dVal > 0 ? '#fff0f0' : isToday ? 'var(--green-pale)' : 'var(--surface-2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: `2px solid ${dVal !== null && dVal < 0 ? 'var(--green-light)' : dVal !== null && dVal > 0 ? '#fca5a5' : isToday ? 'var(--green-main)' : 'var(--border)'}`,
                        }}>
                          <Scale size={16} color={dVal !== null && dVal < 0 ? 'var(--green-main)' : dVal !== null && dVal > 0 ? 'var(--red)' : 'var(--text-muted)'} />
                        </div>
                        {/* Content card */}
                        <div style={{
                          flex: 1, marginBottom: isLast ? 0 : 10,
                          background: isToday ? 'var(--green-pale)' : 'var(--surface-2)',
                          borderRadius: 14, padding: '10px 14px',
                          border: `1.5px solid ${isToday ? 'var(--green-light)' : 'var(--border-light)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                              <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{w.weight_kg}</p>
                              <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>kg</p>
                              {isToday && <span style={{ fontSize: 10, background: 'var(--green-main)', color: 'white', borderRadius: 100, padding: '1px 7px', fontWeight: 700, marginLeft: 2 }}>Oggi</span>}
                            </div>
                            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1, textTransform: 'capitalize' }}>
                              {new Date(w.date + 'T12:00:00').toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })}
                            </p>
                            {distPct !== null && (
                              <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ flex: 1, height: 4, background: 'var(--border-light)', borderRadius: 2, overflow: 'hidden', maxWidth: 80 }}>
                                  <div style={{ height: '100%', width: `${distPct}%`, background: 'var(--green-main)', borderRadius: 2, transition: 'width .6s' }} />
                                </div>
                                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                                  {distPct >= 100 ? '✓ obiettivo' : `${Math.abs(w.weight_kg - target).toFixed(1)} kg al goal`}
                                </span>
                              </div>
                            )}
                          </div>
                          {d !== null && (
                            <span style={{
                              fontSize: 12, fontWeight: 700, flexShrink: 0,
                              display: 'flex', alignItems: 'center', gap: 3,
                              color: dVal < 0 ? 'var(--green-main)' : dVal > 0 ? 'var(--red)' : 'var(--text-muted)',
                              background: dVal < 0 ? 'var(--green-pale)' : dVal > 0 ? '#fff0f0' : 'var(--surface-3)',
                              padding: '5px 10px', borderRadius: 100,
                              border: `1px solid ${dVal < 0 ? 'var(--border)' : dVal > 0 ? '#fca5a5' : 'var(--border-light)'}`,
                            }}>
                              {dVal < 0 ? <TrendingDown size={12} /> : dVal > 0 ? <TrendingUp size={12} /> : <Minus size={12} />}
                              {dVal > 0 ? '+' : ''}{d} kg
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
                {!isPro && weights.length > 3 && (
                  <ProGate feature="Storico completo" teaser={`Sblocca tutte le ${weights.length} misurazioni nel piano Pro`}>
                    <div />
                  </ProGate>
                )}
              </div>
            )}

            {weights.length === 0 && !showAdd && (
              <div className="card" style={{ textAlign: 'center', padding: '36px 20px' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Scale size={36} color="var(--green-main)" />
                </div>
                <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Inizia a tracciare i progressi</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 20 }}>Registra il tuo peso ogni settimana per vedere il tuo percorso.</p>
                <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
                  <Plus size={16} />Prima misurazione
                </button>
              </div>
            )}
          </>
        )}

        {/* ── Circonferenze e Pliche ── */}
        {activeTab === 'circonferenze' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {!cartellaId ? (
              <div className="card" style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: 28, marginBottom: 8 }}>📏</p>
                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Nessun dietista collegato</p>
                <p style={{ fontSize: 12 }}>Le misure antropometriche vengono inserite dal tuo dietista durante le visite.</p>
              </div>
            ) : schede.length === 0 ? (
              <div className="card" style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: 28, marginBottom: 8 }}>📏</p>
                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Nessuna misurazione disponibile</p>
                <p style={{ fontSize: 12 }}>Il tuo dietista non ha ancora condiviso misure con te.</p>
              </div>
            ) : (
              <>
                {/* Latest values summary */}
                {(() => {
                  const last = schede[schede.length - 1]
                  const prev = schede[schede.length - 2]
                  const delta = (field) => {
                    const d = last[field] && prev?.[field] ? (last[field] - prev[field]).toFixed(1) : null
                    return d !== null ? <span style={{ fontSize: 10, color: parseFloat(d) > 0 ? '#EF4444' : '#22C55E', marginLeft: 4 }}>{parseFloat(d) > 0 ? '+' : ''}{d}</span> : null
                  }
                  return (
                    <div className="card" style={{ padding: 16 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Ultime misure · {new Date(last.saved_at).toLocaleDateString('it-IT')}</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: 8 }}>
                        {[
                          { key: 'vita', label: 'Vita', unit: 'cm', icon: '📐' },
                          { key: 'fianchi', label: 'Fianchi', unit: 'cm', icon: '📐' },
                          { key: 'braccio', label: 'Braccio', unit: 'cm', icon: '💪' },
                          { key: 'plica', label: 'Plica', unit: 'mm', icon: '📏' },
                          { key: 'massa_grassa_pct', label: '% Grasso', unit: '%', icon: '🔴' },
                          { key: 'massa_magra', label: 'Massa magra', unit: 'kg', icon: '💪' },
                        ].filter(m => last[m.key]).map(m => (
                          <div key={m.key} style={{ background: 'var(--surface-2)', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
                            <div style={{ fontSize: 16 }}>{m.icon}</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginTop: 3 }}>{last[m.key]}{m.unit}</div>
                            {delta(m.key)}
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{m.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })()}
                {/* Chart */}
                {schede.length > 1 && (
                  <ProGate feature="Grafico circonferenze" teaser="Visualizza l'andamento delle tue misure nel tempo">
                  <div className="card" style={{ padding: '18px 12px 12px' }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, padding: '0 6px' }}>📏 Andamento circonferenze</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={schede.map(s => ({
                        data: new Date(s.saved_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }),
                        vita: s.vita || null, fianchi: s.fianchi || null, braccio: s.braccio || null,
                      }))} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                        <XAxis dataKey="data" tick={{ fontSize: 9, fill: 'var(--text-muted)' }} interval="preserveStartEnd" />
                        <YAxis tick={{ fontSize: 9, fill: 'var(--text-muted)' }} domain={['dataMin - 2', 'dataMax + 2']} />
                        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border)' }} />
                        {schede.some(s => s.vita) && <Line type="monotone" dataKey="vita" name="Vita (cm)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />}
                        {schede.some(s => s.fianchi) && <Line type="monotone" dataKey="fianchi" name="Fianchi (cm)" stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} />}
                        {schede.some(s => s.braccio) && <Line type="monotone" dataKey="braccio" name="Braccio (cm)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  </ProGate>
                )}
                {/* History table */}
                <div className="card" style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Storico misure</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                      <thead><tr style={{ borderBottom: '1.5px solid var(--border)' }}>
                        {['Data','Vita','Fianchi','Braccio','Plica','%Grasso'].map(h => (
                          <th key={h} style={{ padding: '6px 8px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11 }}>{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {[...schede].reverse().map(s => (
                          <tr key={s.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                            <td style={{ padding: '7px 8px', whiteSpace: 'nowrap' }}>{new Date(s.saved_at).toLocaleDateString('it-IT')}</td>
                            <td style={{ padding: '7px 8px' }}>{s.vita ? `${s.vita}` : '—'}</td>
                            <td style={{ padding: '7px 8px' }}>{s.fianchi ? `${s.fianchi}` : '—'}</td>
                            <td style={{ padding: '7px 8px' }}>{s.braccio ? `${s.braccio}` : '—'}</td>
                            <td style={{ padding: '7px 8px' }}>{s.plica ? `${s.plica}` : '—'}</td>
                            <td style={{ padding: '7px 8px' }}>{s.massa_grassa_pct ? `${s.massa_grassa_pct}%` : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── BIA ── */}
        {activeTab === 'bia' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {!cartellaId ? (
              <div className="card" style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: 28, marginBottom: 8 }}>⚡</p>
                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Nessun dietista collegato</p>
                <p style={{ fontSize: 12 }}>I dati BIA vengono inseriti dal tuo dietista durante le visite.</p>
              </div>
            ) : biaData.length === 0 ? (
              <div className="card" style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: 28, marginBottom: 8 }}>⚡</p>
                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Nessuna misurazione BIA disponibile</p>
                <p style={{ fontSize: 12 }}>Il tuo dietista non ha ancora condiviso dati BIA con te.</p>
              </div>
            ) : (
              <>
                {/* Latest BIA */}
                {(() => {
                  const last = biaData[biaData.length - 1]
                  const prev = biaData[biaData.length - 2]
                  const delta = (field) => {
                    const d = last[field] != null && prev?.[field] != null ? (last[field] - prev[field]).toFixed(1) : null
                    return d !== null ? <span style={{ fontSize: 10, color: parseFloat(d) > 0 ? '#EF4444' : '#22C55E', marginLeft: 4 }}>{parseFloat(d) > 0 ? '+' : ''}{d}</span> : null
                  }
                  return (
                    <div className="card" style={{ padding: 16 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Ultima BIA · {new Date(last.data_misura).toLocaleDateString('it-IT')}</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: 8 }}>
                        {[
                          { key: 'bf_pct', label: '% Grasso', unit: '%', icon: '🔴', color: '#dc2626', bg: '#fee2e2' },
                          { key: 'ffm_kg', label: 'Massa magra', unit: 'kg', icon: '💪', color: '#1d4ed8', bg: '#dbeafe' },
                          { key: 'fm_kg', label: 'Massa grassa', unit: 'kg', icon: '📊', color: '#ea580c', bg: '#fff7ed' },
                          { key: 'tbw', label: 'Acqua tot.', unit: 'L', icon: '💧', color: '#0369a1', bg: '#e0f2fe' },
                          { key: 'bcm', label: 'BCM', unit: 'kg', icon: '⚡', color: '#7c3aed', bg: '#f5f3ff' },
                          { key: 'angolo_fase', label: 'Ang. Fase', unit: '°', icon: '📐', color: '#15803d', bg: '#f0fdf4' },
                        ].filter(m => last[m.key] != null).map(m => (
                          <div key={m.key} style={{ background: m.bg, borderRadius: 12, padding: '12px 8px', textAlign: 'center' }}>
                            <div style={{ fontSize: 18 }}>{m.icon}</div>
                            <div style={{ fontSize: 16, fontWeight: 800, color: m.color, marginTop: 4 }}>{last[m.key]}{m.unit}</div>
                            {delta(m.key)}
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>{m.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })()}
                {/* BIA chart */}
                {biaData.length > 1 && (
                  <ProGate feature="Grafico BIA" teaser="Visualizza l'andamento della composizione corporea nel tempo">
                  <div className="card" style={{ padding: '18px 12px 12px' }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, padding: '0 6px' }}>⚡ Composizione corporea nel tempo</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={biaData.map(b => ({
                        data: new Date(b.data_misura).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }),
                        'Grasso (%)': b.bf_pct || null,
                        'Massa magra (kg)': b.ffm_kg || null,
                        'Acqua (L)': b.tbw || null,
                      }))} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                        <XAxis dataKey="data" tick={{ fontSize: 9, fill: 'var(--text-muted)' }} interval="preserveStartEnd" />
                        <YAxis tick={{ fontSize: 9, fill: 'var(--text-muted)' }} />
                        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border)' }} />
                        {biaData.some(b => b.bf_pct) && <Line type="monotone" dataKey="Grasso (%)" stroke="#dc2626" strokeWidth={2} dot={{ r: 3 }} />}
                        {biaData.some(b => b.ffm_kg) && <Line type="monotone" dataKey="Massa magra (kg)" stroke="#1d4ed8" strokeWidth={2} dot={{ r: 3 }} />}
                        {biaData.some(b => b.tbw) && <Line type="monotone" dataKey="Acqua (L)" stroke="#0369a1" strokeWidth={2} dot={{ r: 3 }} />}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  </ProGate>
                )}
                {/* BIA history */}
                <div className="card" style={{ padding: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Storico BIA</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                      <thead><tr style={{ borderBottom: '1.5px solid var(--border)' }}>
                        {['Data','%Grasso','M.Magra','M.Grassa','Acqua','Ang.Fase'].map(h => (
                          <th key={h} style={{ padding: '6px 8px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11 }}>{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {[...biaData].reverse().map(b => (
                          <tr key={b.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                            <td style={{ padding: '7px 8px', whiteSpace: 'nowrap' }}>{new Date(b.data_misura).toLocaleDateString('it-IT')}</td>
                            <td style={{ padding: '7px 8px' }}>{b.bf_pct != null ? `${b.bf_pct}%` : '—'}</td>
                            <td style={{ padding: '7px 8px' }}>{b.ffm_kg != null ? `${b.ffm_kg}kg` : '—'}</td>
                            <td style={{ padding: '7px 8px' }}>{b.fm_kg != null ? `${b.fm_kg}kg` : '—'}</td>
                            <td style={{ padding: '7px 8px' }}>{b.tbw != null ? `${b.tbw}L` : '—'}</td>
                            <td style={{ padding: '7px 8px' }}>{b.angolo_fase != null ? `${b.angolo_fase}°` : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
