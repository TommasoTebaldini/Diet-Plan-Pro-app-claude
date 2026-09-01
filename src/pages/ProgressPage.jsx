import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useT } from '../i18n'
import ProGate from '../components/ProGate'
import { useSubscription } from '../hooks/useSubscription'
import { useAchievements } from '../context/AchievementsContext'
import { checkWeightAchievements, checkWellnessAchievements } from '../lib/achievementTriggers'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'
import { TrendingDown, TrendingUp, Minus, Target, Plus, Scale, Activity, Camera, WifiOff, Ruler } from 'lucide-react'
import { safeWrite } from '../lib/offlineDB'
import { validateImageFile } from '../lib/fileValidation'

const MEASURE_META = [
  { key: 'waist_cm', label: 'Girovita', short: 'Vita', bg: 'var(--icon-bg-green)', fg: 'var(--green-main)' },
  { key: 'hips_cm', label: 'Fianchi', short: 'Fianchi', bg: 'var(--icon-bg-blue)', fg: 'var(--blue)' },
  { key: 'arm_cm', label: 'Braccia', short: 'Braccio', bg: 'var(--icon-bg-purple)', fg: 'var(--purple)' },
  { key: 'thigh_cm', label: 'Cosce', short: 'Coscia', bg: 'var(--icon-bg-orange)', fg: 'var(--orange)' },
]

const MOOD_OPTIONS = [
  { value: 1, emoji: '😞', label: 'Pessimo' },
  { value: 2, emoji: '😕', label: 'Non bene' },
  { value: 3, emoji: '😐', label: 'Nella norma' },
  { value: 4, emoji: '😊', label: 'Bene' },
  { value: 5, emoji: '😄', label: 'Ottimo' },
]

const SYMPTOM_LIST = ['Stanchezza', 'Gonfiore', 'Mal di testa', 'Insonnia', 'Fame', 'Nausea', 'Energia alta', 'Umore positivo']

// Local calendar date (not UTC) — toISOString() shifts to UTC and shows
// the wrong day for users east of UTC (e.g. Italy) right after midnight.
function localDateStr(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

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
  const { checkAndAward } = useAchievements()
  const t = useT()
  const MOOD_LABELS = {
    1: t('progress.mood.terrible', 'Pessimo'),
    2: t('progress.mood.bad', 'Non bene'),
    3: t('progress.mood.normal', 'Nella norma'),
    4: t('progress.mood.good', 'Bene'),
    5: t('progress.mood.excellent', 'Ottimo'),
  }
  const SYMPTOM_KEY_MAP = {
    'Stanchezza': 'tiredness', 'Gonfiore': 'bloating', 'Mal di testa': 'headache', 'Insonnia': 'insomnia',
    'Fame': 'hunger', 'Nausea': 'nausea', 'Energia alta': 'highEnergy', 'Umore positivo': 'positiveMood',
  }
  const symptomLabel = (s) => t(`progress.symptom.${SYMPTOM_KEY_MAP[s] || s}`, s)
  const MEASURE_LABELS = {
    waist_cm: t('progress.measure.waist', 'Girovita'),
    hips_cm: t('progress.measure.hips', 'Fianchi'),
    arm_cm: t('progress.measure.arms', 'Braccia'),
    thigh_cm: t('progress.measure.thighs', 'Cosce'),
  }
  const MEASURE_SHORTS = {
    waist_cm: t('progress.measure.waistShort', 'Vita'),
    hips_cm: t('progress.measure.hipsShort', 'Fianchi'),
    arm_cm: t('progress.measure.armsShort', 'Braccio'),
    thigh_cm: t('progress.measure.thighsShort', 'Coscia'),
  }
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
  const today = useMemo(() => localDateStr(), [])
  const [cartellaId, setCartellaId] = useState(null)
  const [schede, setSchede] = useState([])
  const [biaData, setBiaData] = useState([])
  const [activeTab, setActiveTab] = useState('peso') // 'peso' | 'circonferenze' | 'bia' | 'foto'
  const [photos, setPhotos] = useState([])
  const [photoUrls, setPhotoUrls] = useState({})
  const [photoType, setPhotoType] = useState('progresso')
  const [photoNotes, setPhotoNotes] = useState('')
  const [photoUploading, setPhotoUploading] = useState(false)
  const [photoError, setPhotoError] = useState('')
  const [lightboxUrl, setLightboxUrl] = useState(null)

  // ── Misure corporee (auto-misurate dal paziente) ────────────────
  const [bodyMeasurements, setBodyMeasurements] = useState([])
  const [measureDate, setMeasureDate] = useState(localDateStr())
  const [waist, setWaist] = useState('')
  const [hips, setHips] = useState('')
  const [arms, setArms] = useState('')
  const [thighs, setThighs] = useState('')
  const [savingMeasure, setSavingMeasure] = useState(false)
  const [measureMsg, setMeasureMsg] = useState('')

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const [weightsRes, wellnessRes, linkRes, photosRes, measuresRes] = await Promise.all([
      supabase.from('weight_logs').select('id,date,weight_kg').eq('user_id', user.id).order('date', { ascending: true }).limit(730),
      supabase.from('daily_wellness').select('*').eq('user_id', user.id).eq('date', today).maybeSingle(),
      supabase.from('patient_dietitian').select('cartella_id').eq('patient_id', user.id).maybeSingle(),
      supabase.from('progress_photos').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50),
      supabase.from('body_measurements').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(10),
    ])
    setWeights(weightsRes.data || [])
    if (!measuresRes.error && measuresRes.data) setBodyMeasurements(measuresRes.data)
    const photoList = photosRes.data || []
    setPhotos(photoList)
    loadSignedUrls(photoList)
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
        supabase.from('bia_records').select('id,data_misura,peso,altezza,sesso,eta,bf_pct,ffm_kg,fm_kg,tbw,angolo_fase,bcm,muscle,bone,icw,ecw,ffmi').eq('cartella_id', cid).eq('visible_to_patient', true).order('data_misura', { ascending: true }),
      ])
      setSchede(schedeRes.data || [])
      setBiaData(biaRes.data || [])
    }
  }

  async function loadBodyMeasurements() {
    const { data, error } = await supabase
      .from('body_measurements')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(10)
    if (!error && data) setBodyMeasurements(data)
  }

  async function saveMeasure() {
    if (!waist && !hips && !arms && !thighs) {
      setMeasureMsg(t('progress.measureRequired', 'Inserisci almeno una misura.'))
      return
    }
    setSavingMeasure(true)
    setMeasureMsg('')
    try {
      const { error } = await supabase.from('body_measurements').upsert({
        user_id: user.id,
        date: measureDate,
        waist_cm: parseFloat(waist) || null,
        hips_cm: parseFloat(hips) || null,
        arm_cm: parseFloat(arms) || null,
        thigh_cm: parseFloat(thighs) || null,
      }, { onConflict: 'user_id,date' })
      if (error) {
        if (error.code === '42P01' || String(error.message).includes('does not exist')) {
          setMeasureMsg(t('progress.measureUnavailable', 'Funzione disponibile dopo aggiornamento database.'))
        } else {
          setMeasureMsg(t('progress.measureError', { message: error.message }, 'Errore: {{message}}'))
        }
      } else {
        setMeasureMsg(t('progress.measureSaved', '✅ Misure salvate!'))
        setWaist(''); setHips(''); setArms(''); setThighs('')
        await loadBodyMeasurements()
        setTimeout(() => setMeasureMsg(''), 2500)
      }
    } catch {
      setMeasureMsg(t('progress.measureUnavailable', 'Funzione disponibile dopo aggiornamento database.'))
    } finally {
      setSavingMeasure(false)
    }
  }

  async function saveEntry() {
    setSaving(true)
    setSaveError(null)
    setSaveOk(false)

    const isOnline = navigator.onLine
    try {
      // Save weight
      if (newWeight) {
        const w = parseFloat(newWeight)
        if (!isNaN(w)) {
          if (isOnline) {
            const { data, error } = await supabase.from('weight_logs')
              .upsert({ user_id: user.id, date: today, weight_kg: w }, { onConflict: 'user_id,date' })
              .select().single()
            if (error) throw new Error(t('progress.weightError', { message: error.message }, 'Errore peso: {{message}}'))
            if (data) {
              setWeights(prev => {
                const filtered = prev.filter(x => x.date !== today)
                return [...filtered, data].sort((a, b) => a.date.localeCompare(b.date))
              })
              checkWeightAchievements(supabase, user.id, checkAndAward, w).catch(() => {})
            }
          } else {
            await safeWrite('weight_logs', { user_id: user.id, date: today, weight_kg: w })
            setWeights(prev => {
              const filtered = prev.filter(x => x.date !== today)
              return [...filtered, { date: today, weight_kg: w, _pending: true }].sort((a, b) => a.date.localeCompare(b.date))
            })
          }
        }
      }

      // Save wellness — symptoms must be text[] for Supabase
      if (mood || symptoms.length || notes) {
        const wellnessData = {
          user_id: user.id,
          date: today,
          mood: mood || null,
          symptoms: symptoms,
          notes: notes || null,
        }
        if (isOnline) {
          const { error } = await supabase.from('daily_wellness')
            .upsert(wellnessData, { onConflict: 'user_id,date' })
          if (error) throw new Error(t('progress.wellnessError', { message: error.message }, 'Errore benessere: {{message}}'))
          checkWellnessAchievements(supabase, user.id, checkAndAward).catch(() => {})
        } else {
          await safeWrite('daily_wellness', wellnessData)
        }
      }

      setSaveOk(true)
      if (!isOnline) setSaveError(t('progress.offlineSaved', 'Dati salvati offline — verranno sincronizzati alla prossima connessione.'))
      setShowAdd(false)
      setTimeout(() => setSaveOk(false), 3000)
      if (isOnline) loadData()
    } catch (e) {
      setSaveError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function loadSignedUrls(photoList) {
    if (!photoList.length) return
    const entries = await Promise.all(
      photoList.map(async (p) => {
        const { data, error } = await supabase.storage
          .from('progress-photos')
          .createSignedUrl(p.storage_path, 3600)
        return [p.id, error ? null : data?.signedUrl]
      })
    )
    setPhotoUrls(Object.fromEntries(entries))
  }

  async function uploadPhoto(file) {
    if (!file) return
    const invalid = validateImageFile(file)
    if (invalid) {
      setPhotoError(invalid === 'too_large'
        ? t('progress.photoTooLarge', 'Immagine troppo grande (max 8 MB).')
        : t('progress.photoInvalidType', 'Formato immagine non supportato. Usa JPEG, PNG o WEBP.'))
      return
    }
    setPhotoUploading(true)
    setPhotoError('')
    try {
      const ext = file.name.split('.').pop().toLowerCase() || 'jpg'
      const path = `${user.id}/${today}-${photoType}-${Date.now()}.${ext}`
      const { error: uploadErr } = await supabase.storage.from('progress-photos').upload(path, file, { upsert: false })
      if (uploadErr) throw uploadErr
      const { error: dbErr } = await supabase.from('progress_photos').insert({
        user_id: user.id, date: today, photo_type: photoType, storage_path: path, notes: photoNotes || null,
      })
      if (dbErr) throw dbErr
      const { data: fresh } = await supabase.from('progress_photos').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50)
      const freshList = fresh || []
      setPhotos(freshList)
      loadSignedUrls(freshList)
      setPhotoNotes('')
    } catch (e) {
      setPhotoError(t('progress.uploadError', 'Errore nel caricamento. ') + (e?.message || t('progress.retry', 'Riprova.')))
    } finally {
      setPhotoUploading(false)
    }
  }

  const cutoff = useMemo(() => { const d = new Date(); d.setDate(d.getDate() - range); return d }, [range])
  const chartData = weights
    .filter(w => new Date(w.date) >= cutoff)
    .map(w => ({
      date: new Date(w.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }),
      peso: w.weight_kg
    }))

  const latest = weights[weights.length - 1]?.weight_kg
  const previous = weights[weights.length - 2]?.weight_kg
  // != null (not truthy) checks: a logged weight of exactly 0 kg is bad data,
  // but it's still a value, not a "missing" one — treating it as falsy hid
  // the trend arrow / totalChange / goal-progress bar for that entry.
  const diff = latest != null && previous != null ? (latest - previous).toFixed(1) : null
  const target = profile?.target_weight
  const initial = weights[0]?.weight_kg
  const totalChange = latest != null && initial != null ? (latest - initial).toFixed(1) : null

  return (
    <div className="page">
      <div style={{ background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))', padding: 'calc(env(safe-area-inset-top) + 20px) 24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 }}>{t('progress.subtitle', 'Il mio percorso')}</p>
            <h1 style={{ fontFamily: 'var(--font-d)', fontSize: 24, color: 'white', fontWeight: 300 }}>{t('progress.title')}</h1>
          </div>
          <button
            onClick={() => {
              if (activeTab !== 'peso') {
                setActiveTab('peso')
                setShowAdd(true)
              } else {
                setShowAdd(v => !v)
              }
            }}
            className="btn" style={{ background: 'white', color: 'var(--green-main)', borderRadius: 14, padding: '10px 16px', fontSize: 14, fontWeight: 600, gap: 6 }}>
            <Plus size={16} />{t('common.today')}
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: 10 }}>
          {[
            { label: t('progress.weight'), val: latest != null ? `${latest} kg` : '–', sub: diff !== null ? `${diff > 0 ? '+' : ''}${diff} kg` : '', icon: <Scale size={14} /> },
            { label: t('progress.trend'), val: totalChange !== null ? `${totalChange > 0 ? '+' : ''}${totalChange} kg` : '–', sub: t('progress.sinceStart', "dall'inizio"), icon: <Activity size={14} /> },
            { label: t('dash.goal'), val: target != null ? `${target} kg` : '–', sub: latest != null && target != null ? t('progress.remaining', { value: Math.abs(latest - target).toFixed(1) }, 'Mancano {{value}} kg') : '', icon: <Target size={14} /> },
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
            { key: 'peso', label: `⚖️ ${t('progress.tab.weight', 'Peso')}` },
            { key: 'circonferenze', label: `📏 ${t('progress.tab.measurements', 'Misure')}` },
            { key: 'bia', label: '⚡ BIA' },
            { key: 'foto', label: `📸 ${t('progress.tab.photos', 'Foto')}` },
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
                ✅ {t('progress.saveSuccess', 'Dati salvati con successo!')}
              </div>
            )}
            {saveError && (
              <div style={{ background: 'var(--alert-error-bg)', border: '1px solid var(--alert-error-border)', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: 'var(--alert-error-text)' }}>
                ⚠️ {saveError}
              </div>
            )}

            {/* Today's wellness summary */}
            {todayLog && !showAdd && (
              <div className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 28 }}>
                  {MOOD_OPTIONS.find(m => m.value === todayLog.mood)?.emoji || '😐'}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{t('progress.wellnessRegistered', 'Benessere di oggi registrato')}</p>
                  {todayLog.symptoms?.length > 0 && (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{todayLog.symptoms.map(symptomLabel).join(', ')}</p>
                  )}
                </div>
                <button onClick={() => setShowAdd(true)} style={{ background: 'var(--surface-2)', border: 'none', borderRadius: 10, padding: '6px 12px', fontSize: 12, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  {t('common.edit', 'Modifica')}
                </button>
              </div>
            )}

            {/* Add entry panel */}
            {showAdd && (
              <div className="card animate-slideUp" style={{ padding: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>📝 {t('progress.updateToday', 'Aggiorna di oggi')}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="input-group">
                    <label className="input-label">⚖️ {t('progress.weight')}</label>
                    <input type="number" step="0.1" className="input-field" placeholder={t('progress.weightPlaceholder', 'es. 72.5')} value={newWeight} onChange={e => setNewWeight(e.target.value)} />
                  </div>
                  <div>
                    <p className="input-label" style={{ marginBottom: 10 }}>😊 {t('progress.feelingToday', 'Come ti senti oggi?')}</p>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                      {MOOD_OPTIONS.map(m => (
                        <button key={m.value} onClick={() => setMood(m.value)} style={{ flex: 1, minWidth: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: `2px solid ${mood === m.value ? 'var(--green-main)' : 'var(--border)'}`, borderRadius: 14, padding: '10px 8px', cursor: 'pointer', transition: 'all 0.15s', transform: mood === m.value ? 'scale(1.1)' : 'none' }}>
                          <span style={{ fontSize: 24 }}>{m.emoji}</span>
                          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{MOOD_LABELS[m.value]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="input-label" style={{ marginBottom: 10 }}>🔍 {t('progress.symptomsNotes', 'Sintomi / Note fisiche')}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {SYMPTOM_LIST.map(s => (
                        <button key={s} onClick={() => setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])} style={{ padding: '6px 14px', borderRadius: 100, background: symptoms.includes(s) ? 'var(--green-pale)' : 'var(--surface-2)', color: symptoms.includes(s) ? 'var(--green-main)' : 'var(--text-secondary)', border: `1.5px solid ${symptoms.includes(s) ? 'var(--green-main)' : 'var(--border)'}`, font: 'inherit', fontSize: 13, cursor: 'pointer' }}>
                          {symptomLabel(s)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">📓 {t('progress.freeNotes', 'Note libere')}</label>
                    <textarea className="input-field" rows={3} placeholder={t('progress.notesPlaceholder', 'Come è andata oggi? Annotazioni sulla dieta…')} value={notes} onChange={e => setNotes(e.target.value)} style={{ resize: 'vertical' }} />
                  </div>
                  <button className="btn btn-primary" onClick={saveEntry} disabled={saving}>
                    {saving ? `${t('common.save')}…` : t('common.save')}
                  </button>
                </div>
              </div>
            )}

            {/* Chart — Pro only */}
            {weights.length > 1 && (
              <ProGate feature={t('progress.chartFeature', 'Grafico andamento peso')} teaser={t('progress.chartTeaser', "Visualizza il grafico dell'andamento del tuo peso nel tempo")}>
              <div className="card" style={{ padding: '18px 12px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600 }}>{t('progress.weightTrend', 'Andamento peso')}</h3>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[7, 30, 90].map(r => (
                      <button key={r} onClick={() => setRange(r)} style={{ padding: '4px 10px', borderRadius: 100, background: range === r ? 'var(--green-main)' : 'var(--surface-2)', color: range === r ? 'white' : 'var(--text-muted)', border: `1px solid ${range === r ? 'transparent' : 'var(--border)'}`, font: 'inherit', fontSize: 12, cursor: 'pointer' }}>
                        {r}{t('progress.daySuffix', 'g')}
                      </button>
                    ))}
                  </div>
                </div>
                {chartData.length > 1 ? (
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} interval="preserveStartEnd" />
                      <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} domain={['dataMin - 1', 'dataMax + 1']} />
                      <Tooltip content={<CustomTooltip />} />
                      {target && <ReferenceLine y={target} stroke="var(--orange)" strokeDasharray="4 4" label={{ value: t('progress.target', 'Obiettivo'), fontSize: 10, fill: 'var(--orange)', position: 'insideTopRight' }} />}
                      <Line type="monotone" dataKey="peso" stroke="var(--green-main)" strokeWidth={2.5} dot={{ r: 3, fill: 'var(--green-main)' }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '0 20px' }}>
                    {t('progress.noMeasurementsRange', { range }, 'Nessuna misurazione negli ultimi {{range}} giorni.')}
                  </div>
                )}
              </div>
              </ProGate>
            )}

            {/* History */}
            {weights.length > 0 && (
              <div className="card" style={{ padding: '18px 16px' }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>{t('progress.history', 'Storico misurazioni')}</h3>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {[...weights].reverse().slice(0, isPro ? 10 : 3).map((w, i, arr) => {
                    const prev = arr[i + 1]
                    const d = prev ? (w.weight_kg - prev.weight_kg).toFixed(1) : null
                    const dVal = d !== null ? parseFloat(d) : null
                    const isToday = w.date === today
                    const isLast = i === arr.length - 1
                    // Distance to target as percentage (0–100%)
                    const distPct = target != null && initial != null && latest != null
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
                              {isToday && <span style={{ fontSize: 10, background: 'var(--green-main)', color: 'white', borderRadius: 100, padding: '1px 7px', fontWeight: 700, marginLeft: 2 }}>{t('common.today', 'Oggi')}</span>}
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
                                  {distPct >= 100 ? t('progress.goalReached', '✓ obiettivo') : t('progress.kgToGoal', { value: Math.abs(w.weight_kg - target).toFixed(1) }, '{{value}} kg al goal')}
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
                  <ProGate feature={t('progress.fullHistory', 'Storico completo')} teaser={t('progress.unlockAllMeasurements', { count: weights.length }, 'Sblocca tutte le {{count}} misurazioni nel piano Pro')}>
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
                <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{t('progress.startTracking', 'Inizia a tracciare i progressi')}</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 20 }}>{t('progress.startTrackingDesc', 'Registra il tuo peso ogni settimana per vedere il tuo percorso.')}</p>
                <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
                  <Plus size={16} />{t('progress.firstMeasurement', 'Prima misurazione')}
                </button>
              </div>
            )}
          </>
        )}

        {/* ── Circonferenze e Pliche ── */}
        {activeTab === 'circonferenze' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* ── Le tue misure (auto-misurate) ── */}
            <div className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--icon-bg-green)', color: 'var(--green-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Ruler size={15} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700 }}>{t('progress.yourMeasurements', 'Le tue misure')}</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                {[
                  { m: MEASURE_META[0], val: waist, set: setWaist, ph: '78' },
                  { m: MEASURE_META[1], val: hips, set: setHips, ph: '95' },
                  { m: MEASURE_META[2], val: arms, set: setArms, ph: '30' },
                  { m: MEASURE_META[3], val: thighs, set: setThighs, ph: '55' },
                ].map(({ m, val, set, ph }) => (
                  <div key={m.key}>
                    <label style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: m.fg, flexShrink: 0 }} />
                      {MEASURE_LABELS[m.key]} (cm)
                    </label>
                    <input type="number" className="input-field" placeholder={t('progress.examplePlaceholder', { value: ph }, 'es. {{value}}')} value={val} onChange={e => set(e.target.value)} inputMode="decimal" step="0.1" />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 4 }}>{t('progress.dateLabel', 'Data')}</label>
                <input type="date" className="input-field" value={measureDate} onChange={e => setMeasureDate(e.target.value)} max={localDateStr()} />
              </div>
              <button className="btn btn-primary btn-full" onClick={saveMeasure} disabled={savingMeasure}>
                {savingMeasure ? t('progress.saving', 'Salvataggio...') : t('progress.saveMeasures', 'Salva misure')}
              </button>
              {measureMsg && (
                <p style={{ fontSize: 13, marginTop: 8, color: measureMsg.includes('✅') ? 'var(--green-main)' : 'var(--red)' }}>
                  {measureMsg}
                </p>
              )}

              {/* Trend girovita/fianchi */}
              {bodyMeasurements.filter(m => m.waist_cm).length > 1 && (
                <div style={{ marginTop: 20 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>{bodyMeasurements.some(m => m.hips_cm) ? t('progress.waistHipsTrend', 'Trend girovita e fianchi') : t('progress.waistTrend', 'Trend girovita')}</h4>
                  <ResponsiveContainer width="100%" height={120}>
                    <LineChart data={[...bodyMeasurements].filter(m => m.waist_cm).reverse()} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                      <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'var(--text-muted)' }} tickFormatter={d => d ? d.slice(5) : ''} />
                      <YAxis tick={{ fontSize: 9, fill: 'var(--text-muted)' }} domain={['dataMin - 2', 'dataMax + 2']} />
                      <Tooltip formatter={(v, n) => [v + ' cm', n]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Line type="monotone" dataKey="waist_cm" name={MEASURE_LABELS.waist_cm} stroke="var(--green-main)" dot={{ r: 3 }} strokeWidth={2} />
                      {bodyMeasurements.some(m => m.hips_cm) && (
                        <Line type="monotone" dataKey="hips_cm" name={MEASURE_LABELS.hips_cm} stroke="var(--blue)" dot={{ r: 3 }} strokeWidth={2} connectNulls />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Storico */}
              {bodyMeasurements.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{t('progress.lastMeasures', 'Ultime misure')}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {bodyMeasurements.map((m, i) => (
                      <div key={m.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'var(--surface-2)', borderRadius: 10, fontSize: 12, flexWrap: 'wrap', gap: 6 }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{m.date}</span>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {MEASURE_META.map(meta => m[meta.key] ? (
                            <span key={meta.key} style={{ fontSize: 11, background: meta.bg, color: meta.fg, borderRadius: 100, padding: '2px 8px', fontWeight: 500 }}>
                              {MEASURE_SHORTS[meta.key]} {m[meta.key]}
                            </span>
                          ) : null)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Misure rilevate dal dietista ── */}
            {!cartellaId ? (
              <div className="card" style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: 28, marginBottom: 8 }}>📏</p>
                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{t('progress.noDietitianLinked', 'Nessun dietista collegato')}</p>
                <p style={{ fontSize: 12 }}>{t('progress.anthropometricInfo', 'Le misure antropometriche vengono inserite dal tuo dietista durante le visite.')}</p>
              </div>
            ) : schede.length === 0 ? (
              <div className="card" style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: 28, marginBottom: 8 }}>📏</p>
                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{t('progress.noMeasurementsAvailable', 'Nessuna misurazione disponibile')}</p>
                <p style={{ fontSize: 12 }}>{t('progress.noMeasurementsShared', 'Il tuo dietista non ha ancora condiviso misure con te.')}</p>
              </div>
            ) : (
              <>
                {/* Latest values summary */}
                {(() => {
                  const last = schede[schede.length - 1]
                  const prev = schede[schede.length - 2]
                  const delta = (field) => {
                    const d = last[field] != null && prev?.[field] != null ? (last[field] - prev[field]).toFixed(1) : null
                    return d !== null ? <span style={{ fontSize: 10, color: parseFloat(d) > 0 ? '#EF4444' : '#22C55E', marginLeft: 4 }}>{parseFloat(d) > 0 ? '+' : ''}{d}</span> : null
                  }
                  return (
                    <div className="card" style={{ padding: 16 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{t('progress.detectedByDietitian', { date: new Date(last.saved_at).toLocaleDateString('it-IT') }, 'Rilevate dal dietista · {{date}}')}</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: 8 }}>
                        {[
                          { key: 'vita', label: MEASURE_SHORTS.waist_cm, unit: 'cm', icon: '📐' },
                          { key: 'fianchi', label: MEASURE_SHORTS.hips_cm, unit: 'cm', icon: '📐' },
                          { key: 'braccio', label: MEASURE_SHORTS.arm_cm, unit: 'cm', icon: '💪' },
                          { key: 'plica', label: t('progress.measure.plica', 'Plica'), unit: 'mm', icon: '📏' },
                          { key: 'massa_grassa_pct', label: t('progress.metric.fatPercent', '% Grasso'), unit: '%', icon: '🔴' },
                          { key: 'massa_magra', label: t('progress.measure.leanMassKg', 'Massa magra'), unit: 'kg', icon: '💪' },
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
                  <ProGate feature={t('progress.circumferenceChartFeature', 'Grafico circonferenze')} teaser={t('progress.circumferenceChartTeaser', "Visualizza l'andamento delle tue misure nel tempo")}>
                  <div className="card" style={{ padding: '18px 12px 12px' }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, padding: '0 6px' }}>📏 {t('progress.circumferenceTrend', 'Andamento circonferenze')}</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={schede.map(s => ({
                        data: new Date(s.saved_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }),
                        vita: s.vita || null, fianchi: s.fianchi || null, braccio: s.braccio || null,
                      }))} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                        <XAxis dataKey="data" tick={{ fontSize: 9, fill: 'var(--text-muted)' }} interval="preserveStartEnd" />
                        <YAxis tick={{ fontSize: 9, fill: 'var(--text-muted)' }} domain={['dataMin - 2', 'dataMax + 2']} />
                        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border)' }} />
                        {schede.some(s => s.vita) && <Line type="monotone" dataKey="vita" name={t('progress.series.waistCm', 'Vita (cm)')} stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />}
                        {schede.some(s => s.fianchi) && <Line type="monotone" dataKey="fianchi" name={t('progress.series.hipsCm', 'Fianchi (cm)')} stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} />}
                        {schede.some(s => s.braccio) && <Line type="monotone" dataKey="braccio" name={t('progress.series.armCm', 'Braccio (cm)')} stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  </ProGate>
                )}
                {/* History table */}
                <div className="card" style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{t('progress.measureHistory', 'Storico misure')}</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                      <thead><tr style={{ borderBottom: '1.5px solid var(--border)' }}>
                        {[t('progress.dateLabel', 'Data'), MEASURE_SHORTS.waist_cm, MEASURE_SHORTS.hips_cm, MEASURE_SHORTS.arm_cm, t('progress.measure.plica', 'Plica'), t('progress.table.fatPctNoSpace', '%Grasso')].map(h => (
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
                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{t('progress.noDietitianLinked', 'Nessun dietista collegato')}</p>
                <p style={{ fontSize: 12 }}>{t('progress.bia.info', 'I dati BIA vengono inseriti dal tuo dietista durante le visite.')}</p>
              </div>
            ) : biaData.length === 0 ? (
              <div className="card" style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: 28, marginBottom: 8 }}>⚡</p>
                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{t('progress.bia.noData', 'Nessuna misurazione BIA disponibile')}</p>
                <p style={{ fontSize: 12 }}>{t('progress.bia.noDataShared', 'Il tuo dietista non ha ancora condiviso dati BIA con te.')}</p>
              </div>
            ) : (
              <>
                {(() => {
                  const last = biaData[biaData.length - 1]
                  const prev = biaData[biaData.length - 2]
                  const r1b = v => v != null ? parseFloat(v).toFixed(1) : null

                  const allMetrics = [
                    { key: 'bf_pct',      label: t('progress.metric.fatPercent', '% Grasso'),    unit: '%',     icon: '🔴', col: '#dc2626', bg: '#fee2e2', good: 'down' },
                    { key: 'ffm_kg',      label: t('progress.metric.leanMass', 'Massa Magra'), unit: ' kg',   icon: '💪', col: '#1d4ed8', bg: '#dbeafe', good: 'up' },
                    { key: 'fm_kg',       label: t('progress.metric.fatMass', 'Massa Grassa'),unit: ' kg',   icon: '📊', col: '#ea580c', bg: '#fff7ed', good: 'down' },
                    { key: 'tbw',         label: t('progress.metric.totalWater', 'Acqua Tot.'),  unit: ' L',    icon: '💧', col: '#0369a1', bg: '#e0f2fe', good: null },
                    { key: 'icw',         label: t('progress.metric.icw', 'Intra (ICW)'), unit: ' L',    icon: '🫀', col: '#1d4ed8', bg: '#eff6ff', good: null },
                    { key: 'ecw',         label: t('progress.metric.ecw', 'Extra (ECW)'), unit: ' L',    icon: '💦', col: '#0e7490', bg: '#ecfeff', good: null },
                    { key: 'bcm',         label: 'BCM',         unit: ' kg',   icon: '⚡', col: '#7c3aed', bg: '#f5f3ff', good: 'up' },
                    { key: 'muscle',      label: t('progress.metric.muscle', 'Muscolo'),     unit: ' kg',   icon: '🏋️', col: '#0891b2', bg: '#ecfeff', good: 'up' },
                    { key: 'bone',        label: t('progress.metric.bone', 'Massa Ossea'), unit: ' kg',   icon: '🦴', col: '#64748b', bg: '#f1f5f9', good: null },
                    { key: 'ffmi',        label: 'FFMI',        unit: ' kg/m²',icon: '📐', col: '#059669', bg: '#f0fdf4', good: 'up' },
                    { key: 'angolo_fase', label: t('progress.metric.phaseAngleAbbr', 'Ang. di Fase'),unit: '°',     icon: '🎯', col: '#15803d', bg: '#f0fdf4', good: 'up' },
                  ].filter(m => last[m.key] != null)

                  const getDelta = (field) => {
                    const cur = last[field], pre = prev?.[field]
                    if (cur == null || pre == null) return null
                    return parseFloat((cur - pre).toFixed(1))
                  }

                  const fm = last.fm_kg != null ? last.fm_kg : (last.bf_pct != null && last.peso ? last.peso * last.bf_pct / 100 : null)
                  const ffm = last.ffm_kg != null ? last.ffm_kg : (fm != null && last.peso ? last.peso - fm : null)
                  const showComp = last.peso && (fm != null || ffm != null)
                  const showWater = last.tbw && (last.icw != null || last.ecw != null)

                  const icwVal = last.icw != null ? last.icw : (last.tbw ? last.tbw * 0.605 : null)
                  const ecwVal = last.ecw != null ? last.ecw : (last.tbw ? last.tbw * 0.395 : null)
                  const ecwRatio = last.tbw && ecwVal ? ecwVal / last.tbw : null
                  const ecwColor = ecwRatio == null ? '#64748b' : ecwRatio < 0.36 ? '#1d4ed8' : ecwRatio < 0.39 ? '#16a34a' : ecwRatio < 0.41 ? '#f59e0b' : '#dc2626'
                  const ecwStatus = ecwRatio == null ? '' : ecwRatio < 0.36 ? t('progress.status.dehydration', 'Disidratazione') : ecwRatio < 0.39 ? t('progress.range.normal', 'Normale') : ecwRatio < 0.41 ? t('progress.status.waterRetention', 'Ritenzione idrica') : t('progress.range.edema', 'Edema')

                  return (
                    <>
                      {/* Header */}
                      <div className="card" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>⚡ {t('progress.bia.latest', 'Ultima BIA')}</h3>
                          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(last.data_misura).toLocaleDateString('it-IT')}{last.peso ? ` · ${r1b(last.peso)} kg` : ''}</p>
                        </div>
                        {prev && <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}>{t('progress.vsLabel', 'vs.')} {new Date(prev.data_misura).toLocaleDateString('it-IT')}</p>}
                      </div>

                      {/* Metric tiles */}
                      <div className="card" style={{ padding: 16 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', gap: 8 }}>
                          {allMetrics.map(m => {
                            const d = getDelta(m.key)
                            const dColor = d == null ? null :
                              m.good === 'up' ? (d > 0 ? '#16a34a' : d < 0 ? '#dc2626' : 'var(--text-muted)') :
                              m.good === 'down' ? (d < 0 ? '#16a34a' : d > 0 ? '#dc2626' : 'var(--text-muted)') :
                              d !== 0 ? '#f59e0b' : 'var(--text-muted)'
                            return (
                              <div key={m.key} style={{ background: m.bg, borderRadius: 12, padding: '10px 6px', textAlign: 'center' }}>
                                <div style={{ fontSize: 15 }}>{m.icon}</div>
                                <div style={{ fontSize: 14, fontWeight: 800, color: m.col, marginTop: 3, lineHeight: 1.1 }}>
                                  {r1b(last[m.key])}{m.unit}
                                </div>
                                {d != null && (
                                  <div style={{ fontSize: 10, color: dColor, fontWeight: 700, marginTop: 1 }}>
                                    {d > 0 ? '+' : ''}{d}
                                  </div>
                                )}
                                <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.2 }}>{m.label}</div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Body composition bar */}
                      {showComp && (() => {
                        const fmVal = fm || 0
                        const ffmVal = ffm || 0
                        const total = fmVal + ffmVal
                        const fmPct = total > 0 ? (fmVal / total * 100).toFixed(1) : 0
                        const ffmPct = total > 0 ? (ffmVal / total * 100).toFixed(1) : 0
                        return (
                          <div className="card" style={{ padding: 16 }}>
                            <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>📊 {t('progress.bodyComposition', 'Composizione corporea')} — {r1b(last.peso)} kg</h3>
                            <div style={{ height: 26, borderRadius: 13, overflow: 'hidden', display: 'flex', marginBottom: 10 }}>
                              <div style={{ width: `${fmPct}%`, background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {parseFloat(fmPct) > 10 && <span style={{ fontSize: 9, color: 'white', fontWeight: 700 }}>{fmPct}%</span>}
                              </div>
                              <div style={{ flex: 1, background: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: 9, color: 'white', fontWeight: 700 }}>{ffmPct}%</span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: 14, fontSize: 11, flexWrap: 'wrap' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#ef4444', display: 'inline-block' }}/>{t('progress.metric.fatMass', 'Massa Grassa')} {r1b(fmVal)} kg ({fmPct}%)</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#1d4ed8', display: 'inline-block' }}/>{t('progress.metric.leanMass', 'Massa Magra')} {r1b(ffmVal)} kg ({ffmPct}%)</span>
                            </div>
                          </div>
                        )
                      })()}

                      {/* Water distribution */}
                      {showWater && (
                        <div className="card" style={{ padding: 16 }}>
                          <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>💧 {t('progress.waterDistribution', 'Distribuzione Idrica')} — {r1b(last.tbw)} L TBW</h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {[
                              { label: t('progress.icwLabel', 'ICW — Intracellulare'), val: icwVal, col: '#1d4ed8' },
                              { label: t('progress.ecwLabel', 'ECW — Extracellulare'), val: ecwVal, col: ecwRatio > 0.39 ? '#f59e0b' : '#0ea5e9' },
                            ].map(w => w.val != null && (
                              <div key={w.label}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                                  <span style={{ color: 'var(--text-muted)' }}>{w.label}</span>
                                  <span style={{ fontWeight: 600 }}>{r1b(w.val)} L ({last.tbw > 0 ? (w.val / last.tbw * 100).toFixed(0) : '—'}%)</span>
                                </div>
                                <div style={{ height: 8, background: 'var(--surface-2)', borderRadius: 4, overflow: 'hidden' }}>
                                  <div style={{ height: '100%', width: `${last.tbw > 0 ? Math.min(100, w.val / last.tbw * 100) : 0}%`, background: w.col, borderRadius: 4 }} />
                                </div>
                              </div>
                            ))}
                          </div>
                          {ecwRatio != null && (
                            <div style={{ background: '#eff6ff', borderRadius: 8, padding: '8px 12px', fontSize: 11, marginTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: 'var(--text-muted)' }}>ECW/TBW ratio</span>
                              <span style={{ fontWeight: 700, color: ecwColor }}>{ecwRatio.toFixed(2)} — {ecwStatus}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* ── Confronto con valori di riferimento ── */}
                      {(() => {
                        const sesso = last.sesso || 'F'
                        const isMale = sesso === 'M'
                        const lblEssential = t('progress.range.essential', 'Essenziale')
                        const lblAthlete = t('progress.range.athlete', 'Atleta')
                        const lblFitness = t('progress.range.fitness', 'Fitness')
                        const lblNormal = t('progress.range.normal', 'Normale')
                        const lblOverweight = t('progress.range.overweight', 'Sovrappeso')
                        const lblObesity = t('progress.range.obesity', 'Obesità')
                        const lblCritical = t('progress.range.critical', 'Critico')
                        const lblReduced = t('progress.range.reduced', 'Ridotto')
                        const lblExcellent = t('progress.range.excellent', 'Ottimo')
                        const lblLow = t('progress.range.low', 'Basso')
                        const lblGood = t('progress.range.good', 'Buono')
                        const lblHigh = t('progress.range.high', 'Elevato')
                        const lblDehydrated = t('progress.range.dehydrated', 'Disidrat.')
                        const lblRetention = t('progress.range.retention', 'Ritenzione')
                        const lblEdema = t('progress.range.edema', 'Edema')
                        const bfRanges = isMale
                          ? [{ from:0,to:6,label:lblEssential,col:'#7c3aed',bg:'#ede9fe' },{ from:6,to:14,label:lblAthlete,col:'#1d4ed8',bg:'#dbeafe' },{ from:14,to:18,label:lblFitness,col:'#16a34a',bg:'#dcfce7' },{ from:18,to:25,label:lblNormal,col:'#15803d',bg:'#f0fdf4' },{ from:25,to:30,label:lblOverweight,col:'#f59e0b',bg:'#fef3c7' },{ from:30,to:50,label:lblObesity,col:'#dc2626',bg:'#fee2e2' }]
                          : [{ from:0,to:14,label:lblEssential,col:'#7c3aed',bg:'#ede9fe' },{ from:14,to:21,label:lblAthlete,col:'#1d4ed8',bg:'#dbeafe' },{ from:21,to:25,label:lblFitness,col:'#16a34a',bg:'#dcfce7' },{ from:25,to:32,label:lblNormal,col:'#15803d',bg:'#f0fdf4' },{ from:32,to:37,label:lblOverweight,col:'#f59e0b',bg:'#fef3c7' },{ from:37,to:55,label:lblObesity,col:'#dc2626',bg:'#fee2e2' }]
                        const afRanges = [{ from:0,to:4,label:lblCritical,col:'#dc2626',bg:'#fee2e2' },{ from:4,to:5,label:lblReduced,col:'#f59e0b',bg:'#fef3c7' },{ from:5,to:7,label:lblNormal,col:'#16a34a',bg:'#dcfce7' },{ from:7,to:12,label:lblExcellent,col:'#1d4ed8',bg:'#dbeafe' }]
                        const ffmiRanges = isMale
                          ? [{ from:0,to:18,label:lblLow,col:'#f59e0b',bg:'#fef3c7' },{ from:18,to:20,label:lblNormal,col:'#16a34a',bg:'#dcfce7' },{ from:20,to:25,label:lblGood,col:'#15803d',bg:'#f0fdf4' },{ from:25,to:30,label:lblHigh,col:'#1d4ed8',bg:'#dbeafe' }]
                          : [{ from:0,to:14,label:lblLow,col:'#f59e0b',bg:'#fef3c7' },{ from:14,to:17,label:lblNormal,col:'#16a34a',bg:'#dcfce7' },{ from:17,to:20,label:lblGood,col:'#15803d',bg:'#f0fdf4' },{ from:20,to:26,label:lblHigh,col:'#1d4ed8',bg:'#dbeafe' }]
                        const ecwRanges = [{ from:0,to:36,label:lblDehydrated,col:'#1d4ed8',bg:'#dbeafe' },{ from:36,to:39,label:lblNormal,col:'#16a34a',bg:'#dcfce7' },{ from:39,to:41,label:lblRetention,col:'#f59e0b',bg:'#fef3c7' },{ from:41,to:60,label:lblEdema,col:'#dc2626',bg:'#fee2e2' }]

                        const makeGauge = (label, value, unit, ranges, min, max) => {
                          if (value == null) return null
                          const pct = Math.min(100, Math.max(0, (value - min) / (max - min) * 100))
                          const active = ranges.find(r => value >= r.from && value < r.to) || ranges[ranges.length - 1]
                          const zonePcts = ranges.map(r => Math.min(r.to, max) - Math.max(r.from, min)).map(w => Math.max(0, w / (max - min) * 100))
                          return (
                            <div key={label} style={{ marginBottom: 14 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                                <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
                                <span style={{ fontWeight: 700, color: active.col }}>{parseFloat(value).toFixed(1)}{unit} — {active.label}</span>
                              </div>
                              <div style={{ position: 'relative', height: 14, borderRadius: 7, overflow: 'hidden', display: 'flex' }}>
                                {ranges.map((r, i) => <div key={i} style={{ flex: zonePcts[i], background: r.col, opacity: 0.25 }} />)}
                                <div style={{ position: 'absolute', left: `calc(${pct}% - 5px)`, top: 0, width: 10, height: 14, background: active.col, borderRadius: 3, boxShadow: '0 1px 4px rgba(0,0,0,0.35)' }} />
                              </div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                                {ranges.map((r, i) => (
                                  <span key={i} style={{ fontSize: 9, color: r.col, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <span style={{ width: 7, height: 7, borderRadius: 2, background: r.col, display: 'inline-block', opacity: 0.7 }} />
                                    {r.label} {r.from}–{r.to < max ? r.to : '+'}{unit}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )
                        }

                        const hasSomeRef = last.bf_pct != null || last.angolo_fase != null || last.ffmi != null || (ecwRatio != null)
                        if (!hasSomeRef) return null
                        return (
                          <div className="card" style={{ padding: 16 }}>
                            <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>
                              🎯 {t('progress.referencePosition', 'Posizione rispetto ai valori di riferimento')} {sesso === 'M' ? '♂' : '♀'}
                            </h3>
                            {makeGauge(t('progress.metric.fatMass', 'Massa Grassa'), last.bf_pct, '%', bfRanges, 0, 50)}
                            {makeGauge(t('progress.metric.phaseAngle', 'Angolo di Fase'), last.angolo_fase, '°', afRanges, 0, 12)}
                            {last.ffmi != null && makeGauge('FFMI', last.ffmi, ' kg/m²', ffmiRanges, 0, isMale ? 30 : 26)}
                            {ecwRatio != null && makeGauge(t('progress.metric.hydrationEcwTbw', 'Idratazione ECW/TBW'), ecwRatio * 100, '%', ecwRanges, 0, 60)}
                          </div>
                        )
                      })()}

                      {/* ── Grafico esagonale / radar — Profilo vs Riferimento ── */}
                      {(() => {
                        const sesso = last.sesso || 'F'
                        const isMale = sesso === 'M'
                        const rd = []

                        // % Grasso: 100 = centro range normale, decresce fuori
                        if (last.bf_pct != null) {
                          const optLow = isMale ? 18 : 25, optHigh = isMale ? 25 : 32, worst = isMale ? 35 : 45
                          let sc
                          if (last.bf_pct >= optLow && last.bf_pct <= optHigh) sc = 100
                          else if (last.bf_pct < optLow) sc = Math.max(20, 100 - (optLow - last.bf_pct) * 3)
                          else sc = Math.max(5, 100 - (last.bf_pct - optHigh) / (worst - optHigh) * 95)
                          rd.push({ subject: t('progress.metric.fatPercent', '% Grasso'), Tu: Math.round(sc), Rif: 80 })
                        }

                        // Angolo di Fase: 7° = 100%
                        if (last.angolo_fase != null) {
                          rd.push({ subject: t('progress.radar.phaseAngle', 'Ang. Fase'), Tu: Math.min(100, Math.max(5, Math.round(last.angolo_fase / 7 * 100))), Rif: 71 })
                        }

                        // FFMI: midpoint "Buono" come riferimento
                        if (last.ffmi != null) {
                          const refFFMI = isMale ? 22.5 : 18.5
                          rd.push({ subject: 'FFMI', Tu: Math.min(100, Math.max(5, Math.round(last.ffmi / refFFMI * 100))), Rif: 84 })
                        }

                        // Idratazione TBW% del peso
                        if (last.tbw != null && last.peso) {
                          const tbwPct = last.tbw / last.peso * 100
                          const refTBW = isMale ? 62 : 55
                          rd.push({ subject: t('progress.hydration', 'Idratazione'), Tu: Math.min(100, Math.max(5, Math.round(tbwPct / refTBW * 100))), Rif: 87 })
                        }

                        // Bilancio idrico ECW/TBW
                        if (ecwRatio != null) {
                          const sc = ecwRatio < 0.36 ? 55 : ecwRatio < 0.39 ? 92 : ecwRatio < 0.41 ? 62 : 30
                          rd.push({ subject: t('progress.radar.waterBalance', 'Bil. Idrico'), Tu: sc, Rif: 92 })
                        }

                        // BCM / FFM qualità cellulare
                        if (last.bcm != null && last.ffm_kg && last.ffm_kg > 0) {
                          rd.push({ subject: 'BCM', Tu: Math.min(100, Math.max(5, Math.round(last.bcm / last.ffm_kg * 100 / 55 * 100))), Rif: 78 })
                        }

                        if (rd.length < 3) return null
                        return (
                          <ProGate feature={t('progress.radarChartFeature', 'Grafico radar BIA')} teaser={t('progress.radarChartTeaser', 'Visualizza il tuo profilo corporeo vs popolazione di riferimento')}>
                            <div className="card" style={{ padding: '16px 12px 8px' }}>
                              <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, padding: '0 4px' }}>🕸️ {t('progress.bodyProfileVsReference', 'Profilo corporeo vs Riferimento')} {isMale ? '♂' : '♀'}</h3>
                              <p style={{ fontSize: 10, color: 'var(--text-muted)', padding: '0 4px', marginBottom: 4 }}>
                                {t('progress.radarLegend', 'Blu = il tuo profilo · Grigio = adulto sano di riferimento · Scala 0–100')}
                              </p>
                              <ResponsiveContainer width="100%" height={270}>
                                <RadarChart data={rd} margin={{ top: 10, right: 40, bottom: 10, left: 40 }}>
                                  <PolarGrid stroke="var(--border)" />
                                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8, fill: 'var(--text-muted)' }} tickCount={4} />
                                  <Radar name={t('progress.you', 'Tu')} dataKey="Tu" stroke="#1d4ed8" fill="#1d4ed8" fillOpacity={0.22} dot={{ r: 3, fill: '#1d4ed8' }} />
                                  <Radar name={t('progress.reference', 'Riferimento')} dataKey="Rif" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.08} strokeDasharray="5 5" />
                                  <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid var(--border)' }} formatter={(v) => [v + ' / 100', '']} />
                                </RadarChart>
                              </ResponsiveContainer>
                            </div>
                          </ProGate>
                        )
                      })()}

                      {/* ── Confronto vs misura precedente ── */}
                      {prev && (() => {
                        const compMetrics = [
                          { key: 'bf_pct', label: t('progress.metric.fatPercent', '% Grasso'), col: '#dc2626' },
                          { key: 'ffm_kg', label: t('progress.metric.leanMassKgShort', 'M.Magra kg'), col: '#1d4ed8' },
                          { key: 'fm_kg', label: t('progress.metric.fatMassKgShort', 'M.Grassa kg'), col: '#ea580c' },
                          { key: 'tbw', label: t('progress.metric.waterL', 'Acqua L'), col: '#0369a1' },
                          { key: 'angolo_fase', label: t('progress.metric.phaseAngleDeg', 'Ang. Fase°'), col: '#15803d' },
                        ].filter(m => last[m.key] != null && prev[m.key] != null)
                        if (!compMetrics.length) return null

                        const chartData = compMetrics.map(m => ({
                          name: m.label,
                          Precedente: parseFloat(parseFloat(prev[m.key]).toFixed(1)),
                          Attuale: parseFloat(parseFloat(last[m.key]).toFixed(1)),
                        }))

                        return (
                          <ProGate feature={t('progress.comparisonChartFeature', 'Grafico confronto BIA')} teaser={t('progress.comparisonChartTeaser', 'Visualizza il confronto grafico tra le misurazioni')}>
                            <div className="card" style={{ padding: '16px 12px 12px' }}>
                              <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, padding: '0 4px' }}>📊 {t('progress.comparisonWithPrevious', 'Confronto con misura precedente')}</h3>
                              <p style={{ fontSize: 11, color: 'var(--text-muted)', padding: '0 4px', marginBottom: 10 }}>
                                {new Date(prev.data_misura).toLocaleDateString('it-IT')} → {new Date(last.data_misura).toLocaleDateString('it-IT')}
                              </p>
                              <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 30 }} barCategoryGap="30%">
                                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'var(--text-muted)' }} angle={-30} textAnchor="end" interval={0} />
                                  <YAxis tick={{ fontSize: 9, fill: 'var(--text-muted)' }} />
                                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid var(--border)' }} />
                                  <Legend iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 4 }} />
                                  <Bar dataKey="Precedente" name={t('progress.previous', 'Precedente')} fill="#94a3b8" radius={[3,3,0,0]} />
                                  <Bar dataKey="Attuale" name={t('progress.current', 'Attuale')} fill="#1d4ed8" radius={[3,3,0,0]} />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </ProGate>
                        )
                      })()}

                      {/* ── Trend nel tempo ── */}
                      {biaData.length > 1 && (
                        <ProGate feature={t('progress.timeChartFeature', 'Grafici BIA nel tempo')} teaser={t('progress.timeChartTeaser', "Visualizza l'andamento completo della composizione corporea")}>
                          <div className="card" style={{ padding: '16px 12px 12px' }}>
                            <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, padding: '0 4px' }}>📈 {t('progress.trendOverTime', 'Andamento nel tempo')}</h3>
                            <ResponsiveContainer width="100%" height={200}>
                              <LineChart data={biaData.map(b => ({
                                d: new Date(b.data_misura).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }),
                                grassoPct: b.bf_pct != null ? parseFloat(parseFloat(b.bf_pct).toFixed(1)) : null,
                                massaMagraKg: b.ffm_kg != null ? parseFloat(parseFloat(b.ffm_kg).toFixed(1)) : null,
                                acquaL: b.tbw != null ? parseFloat(parseFloat(b.tbw).toFixed(1)) : null,
                                angFaseDeg: b.angolo_fase != null ? parseFloat(parseFloat(b.angolo_fase).toFixed(1)) : null,
                              }))} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                                <XAxis dataKey="d" tick={{ fontSize: 9, fill: 'var(--text-muted)' }} interval="preserveStartEnd" />
                                <YAxis tick={{ fontSize: 9, fill: 'var(--text-muted)' }} />
                                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid var(--border)' }} />
                                <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                                {biaData.some(b => b.bf_pct != null) && <Line type="monotone" dataKey="grassoPct" name={t('progress.chart.fatPct', 'Grasso %')} stroke="#dc2626" strokeWidth={2} dot={{ r: 3 }} connectNulls />}
                                {biaData.some(b => b.ffm_kg != null) && <Line type="monotone" dataKey="massaMagraKg" name={t('progress.chart.leanMassKg', 'Massa magra kg')} stroke="#1d4ed8" strokeWidth={2} dot={{ r: 3 }} connectNulls />}
                                {biaData.some(b => b.tbw != null) && <Line type="monotone" dataKey="acquaL" name={t('progress.metric.waterL', 'Acqua L')} stroke="#0369a1" strokeWidth={2} dot={{ r: 3 }} connectNulls />}
                                {biaData.some(b => b.angolo_fase != null) && <Line type="monotone" dataKey="angFaseDeg" name={t('progress.metric.phaseAngleDeg', 'Ang. Fase°')} stroke="#15803d" strokeWidth={2} dot={{ r: 3 }} connectNulls />}
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </ProGate>
                      )}

                      {/* Storico */}
                      <div className="card" style={{ padding: 16 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>📋 {t('progress.bia.history', 'Storico BIA')}</h3>
                        <div style={{ overflowX: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                            <thead><tr style={{ borderBottom: '1.5px solid var(--border)' }}>
                              {[t('progress.dateLabel', 'Data'), t('progress.tab.weight', 'Peso'), t('progress.table.fatPctShort', '%Gr.'), t('progress.table.leanMassShort', 'M.Magra'), t('progress.table.fatMassShort', 'M.Grassa'), 'TBW', t('progress.table.angleShort', 'Ang.°'), 'FFMI'].map(h => (
                                <th key={h} style={{ padding: '5px 6px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: 10, whiteSpace: 'nowrap' }}>{h}</th>
                              ))}
                            </tr></thead>
                            <tbody>
                              {[...biaData].reverse().map((b, idx, arr) => {
                                const nxt = arr[idx + 1]
                                const dVal = (cur, prv) => cur != null && prv != null ? parseFloat((cur - prv).toFixed(1)) : null
                                const cell = (v, unit, d, goodDir) => {
                                  const dColor = d == null ? null : (goodDir === 'down' ? (d < 0 ? '#16a34a' : '#dc2626') : goodDir === 'up' ? (d > 0 ? '#16a34a' : '#dc2626') : '#f59e0b')
                                  return v != null
                                    ? <>{r1b(v)}{unit}{d != null && <span style={{ fontSize: 9, color: dColor, marginLeft: 2 }}>{d > 0 ? '+' : ''}{d}</span>}</>
                                    : '—'
                                }
                                return (
                                  <tr key={b.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '6px 6px', whiteSpace: 'nowrap' }}>{new Date(b.data_misura).toLocaleDateString('it-IT')}</td>
                                    <td style={{ padding: '6px 6px' }}>{b.peso != null ? `${r1b(b.peso)} kg` : '—'}</td>
                                    <td style={{ padding: '6px 6px', color: '#dc2626', fontWeight: 600 }}>{cell(b.bf_pct, '%', dVal(b.bf_pct, nxt?.bf_pct), 'down')}</td>
                                    <td style={{ padding: '6px 6px' }}>{cell(b.ffm_kg, ' kg', dVal(b.ffm_kg, nxt?.ffm_kg), 'up')}</td>
                                    <td style={{ padding: '6px 6px' }}>{cell(b.fm_kg, ' kg', dVal(b.fm_kg, nxt?.fm_kg), 'down')}</td>
                                    <td style={{ padding: '6px 6px' }}>{cell(b.tbw, ' L', null, null)}</td>
                                    <td style={{ padding: '6px 6px', fontWeight: 600 }}>{cell(b.angolo_fase, '°', dVal(b.angolo_fase, nxt?.angolo_fase), 'up')}</td>
                                    <td style={{ padding: '6px 6px' }}>{cell(b.ffmi, '', dVal(b.ffmi, nxt?.ffmi), 'up')}</td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )
                })()}
              </>
            )}
          </div>
        )}

        {/* ── Foto Progressi ── */}
        {activeTab === 'foto' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Upload card */}
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>📸 {t('progress.uploadPhoto', 'Carica foto')}</h3>
              <p className="input-label" style={{ marginBottom: 8 }}>{t('progress.photoType', 'Tipo di foto')}</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[{ val: 'prima', label: t('progress.photoType.before', 'Prima') }, { val: 'progresso', label: t('progress.photoType.during', 'Durante') }, { val: 'dopo', label: t('progress.photoType.after', 'Dopo') }].map(pt => (
                  <button key={pt.val} onClick={() => setPhotoType(pt.val)} style={{
                    flex: 1, padding: '9px 6px', borderRadius: 10,
                    border: `2px solid ${photoType === pt.val ? 'var(--green-main)' : 'var(--border)'}`,
                    background: photoType === pt.val ? 'var(--green-pale)' : 'var(--surface-2)',
                    color: photoType === pt.val ? 'var(--green-dark)' : 'var(--text-secondary)',
                    font: 'inherit', fontSize: 13, fontWeight: photoType === pt.val ? 700 : 400, cursor: 'pointer',
                  }}>{pt.label}</button>
                ))}
              </div>
              <div className="input-group" style={{ marginBottom: 14 }}>
                <label className="input-label">{t('progress.notesOptional', 'Note (opzionale)')}</label>
                <input className="input-field" placeholder={t('progress.photoNotesPlaceholder', 'es. Settimana 4 di dieta…')} value={photoNotes} onChange={e => setPhotoNotes(e.target.value)} />
              </div>
              {photoError && (
                <div style={{ background: 'var(--alert-error-bg)', border: '1px solid var(--alert-error-border)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--alert-error-text)', marginBottom: 12 }}>
                  {photoError}
                </div>
              )}
              <label style={{ display: 'block' }}>
                <input type="file" accept="image/*" style={{ display: 'none' }} disabled={photoUploading}
                  onChange={e => { const f = e.target.files?.[0]; if (f) uploadPhoto(f); e.target.value = '' }} />
                <span className="btn btn-primary" style={{
                  width: '100%', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 0',
                  cursor: photoUploading ? 'wait' : 'pointer', opacity: photoUploading ? 0.7 : 1,
                }}>
                  {photoUploading ? t('progress.uploading', 'Caricamento…') : <><Camera size={16} /> {t('progress.choosePhoto', 'Scegli foto')}</>}
                </span>
              </label>
            </div>

            {/* Gallery */}
            {photos.length === 0 ? (
              <div className="card" style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: 48, marginBottom: 8 }}>📷</p>
                <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{t('progress.noPhotosYet', 'Nessuna foto ancora')}</p>
                <p style={{ fontSize: 13 }}>{t('progress.uploadFirstPhoto', 'Carica la tua prima foto del percorso!')}</p>
              </div>
            ) : (
              <div className="card" style={{ padding: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>{t('progress.yourPhotos', { count: photos.length }, 'Le tue foto ({{count}})')}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {photos.map(photo => {
                    const url = photoUrls[photo.id]
                    const TYPE_LABELS = {
                      prima: t('progress.photoType.before', 'Prima'),
                      progresso: t('progress.photoType.during', 'Durante'),
                      dopo: t('progress.photoType.after', 'Dopo'),
                    }
                    return (
                      <div key={photo.id} onClick={() => url && setLightboxUrl(url)} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', aspectRatio: '1', cursor: url ? 'pointer' : 'default', background: 'var(--surface-2)' }}>
                        {url ? (
                          <img src={url} alt={TYPE_LABELS[photo.photo_type] || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 24 }}>⏳</div>
                        )}
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.72))', padding: '18px 6px 5px' }}>
                          <p style={{ color: 'white', fontSize: 10, fontWeight: 700 }}>{TYPE_LABELS[photo.photo_type] || ''}</p>
                          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 9 }}>{new Date(photo.date + 'T12:00:00').toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Lightbox */}
            {lightboxUrl && (
              <div onClick={() => setLightboxUrl(null)} style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                <img src={lightboxUrl} alt={t('progress.progressPhotoAlt', 'Foto progressi')} style={{ maxWidth: '100%', maxHeight: '90dvh', borderRadius: 12, objectFit: 'contain' }} onClick={e => e.stopPropagation()} />
                <button onClick={() => setLightboxUrl(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 22, lineHeight: 1 }}>×</button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
