import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useAchievements } from '../context/AchievementsContext'
import { checkWellnessAchievements } from '../lib/achievementTriggers'
import { useT } from '../i18n'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, ComposedChart, Bar,
} from 'recharts'
import { Heart, Zap, Moon, Plus, CheckCircle, Clock, BedDouble, Brain, WifiOff, Lightbulb } from 'lucide-react'
import { safeWrite } from '../lib/offlineDB'

function getMoodOptions(t) {
  return [
    { value: 1, emoji: '😞', label: t('wellness.mood_pessimo', 'Pessimo') },
    { value: 2, emoji: '😕', label: t('wellness.mood_nonbene', 'Non bene') },
    { value: 3, emoji: '😐', label: t('wellness.mood_normale', 'Normale') },
    { value: 4, emoji: '😊', label: t('wellness.mood_bene', 'Bene') },
    { value: 5, emoji: '😄', label: t('wellness.mood_ottimo', 'Ottimo') },
  ]
}

function getEnergyOptions(t) {
  return [
    { value: 1, emoji: '🪫', label: t('wellness.energy_scarica', 'Scarica') },
    { value: 2, emoji: '😴', label: t('wellness.energy_bassa', 'Bassa') },
    { value: 3, emoji: '😐', label: t('wellness.energy_normale', 'Normale') },
    { value: 4, emoji: '⚡', label: t('wellness.energy_alta', 'Alta') },
    { value: 5, emoji: '🚀', label: t('wellness.energy_massima', 'Massima') },
  ]
}

function getSleepOptions(t) {
  return [
    { value: 1, emoji: '😫', label: t('wellness.sleepq_pessima', 'Pessima') },
    { value: 2, emoji: '😔', label: t('wellness.sleepq_scarsa', 'Scarsa') },
    { value: 3, emoji: '😐', label: t('wellness.sleepq_discreta', 'Discreta') },
    { value: 4, emoji: '😴', label: t('wellness.sleepq_buona', 'Buona') },
    { value: 5, emoji: '🌟', label: t('wellness.sleepq_ottima', 'Ottima') },
  ]
}

function getRestednessOptions(t) {
  return [
    { value: 1, emoji: '🥱', label: t('wellness.rest_esausto', 'Esausto') },
    { value: 2, emoji: '😩', label: t('wellness.rest_stanco', 'Stanco') },
    { value: 3, emoji: '😐', label: t('wellness.rest_cosicosi', 'Così così') },
    { value: 4, emoji: '😌', label: t('wellness.rest_riposato', 'Riposato') },
    { value: 5, emoji: '💪', label: t('wellness.rest_carico', 'Carico') },
  ]
}

// Feature 8: Stress level options
function getStressOptions(t) {
  return [
    { value: 1, emoji: '😌', label: t('wellness.stress_nullo', 'Nullo') },
    { value: 2, emoji: '🙂', label: t('wellness.stress_lieve', 'Lieve') },
    { value: 3, emoji: '😐', label: t('wellness.stress_moderato', 'Moderato') },
    { value: 4, emoji: '😤', label: t('wellness.stress_alto', 'Alto') },
    { value: 5, emoji: '😰', label: t('wellness.stress_moltoalto', 'Molto alto') },
  ]
}

function getSymptomList(t) {
  return [
    { value: 'Gonfiore', label: t('wellness.symptom_gonfiore', 'Gonfiore') },
    { value: 'Stanchezza', label: t('wellness.symptom_stanchezza', 'Stanchezza') },
    { value: 'Mal di testa', label: t('wellness.symptom_maldi_testa', 'Mal di testa') },
    { value: 'Insonnia', label: t('wellness.symptom_insonnia', 'Insonnia') },
    { value: 'Fame', label: t('wellness.symptom_fame', 'Fame') },
    { value: 'Nausea', label: t('wellness.symptom_nausea', 'Nausea') },
    { value: 'Energia alta', label: t('wellness.symptom_energia_alta', 'Energia alta') },
    { value: 'Umore positivo', label: t('wellness.symptom_umore_positivo', 'Umore positivo') },
    { value: 'Crampi', label: t('wellness.symptom_crampi', 'Crampi') },
    { value: 'Digestione difficile', label: t('wellness.symptom_digestione_difficile', 'Digestione difficile') },
    { value: 'Ansia', label: t('wellness.symptom_ansia', 'Ansia') },
    { value: 'Concentrazione', label: t('wellness.symptom_concentrazione', 'Concentrazione') },
  ]
}

function ScaleSelector({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(value === o.value ? null : o.value)}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 3, background: 'none', cursor: 'pointer',
            border: `2px solid ${value === o.value ? 'var(--green-main)' : 'var(--border)'}`,
            borderRadius: 14, padding: '8px 6px', transition: 'all 0.15s',
            transform: value === o.value ? 'scale(1.1)' : 'none',
            minWidth: 52,
          }}
        >
          <span style={{ fontSize: 22 }}>{o.emoji}</span>
          <span style={{ fontSize: 9, color: value === o.value ? 'var(--green-main)' : 'var(--text-muted)', fontWeight: value === o.value ? 600 : 400 }}>{o.label}</span>
        </button>
      ))}
    </div>
  )
}

function MoodDot({ value }) {
  const t = useT()
  const opt = getMoodOptions(t).find(o => o.value === value)
  return opt ? <span style={{ fontSize: 16 }}>{opt.emoji}</span> : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>–</span>
}

function CustomMoodTooltip({ active, payload, label }) {
  const t = useT()
  if (!active || !payload?.length) return null
  const mood = getMoodOptions(t).find(o => o.value === payload[0]?.value)
  const energy = getEnergyOptions(t).find(o => o.value === payload[1]?.value)
  const sleep = getSleepOptions(t).find(o => o.value === payload[2]?.value)
  const sleepHoursVal = payload.find(p => p.dataKey === 'sleepHours')?.value
  const restedness = getRestednessOptions(t).find(o => o.value === payload.find(p => p.dataKey === 'restedness')?.value)
  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow-md)', fontSize: 12 }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: 6 }}>{label}</p>
      {mood && <p style={{ marginBottom: 2 }}>{mood.emoji} {t('wellness.tooltip_mood', 'Umore:')} <strong>{mood.label}</strong></p>}
      {energy && <p style={{ marginBottom: 2 }}>{energy.emoji} {t('wellness.tooltip_energy', 'Energia:')} <strong>{energy.label}</strong></p>}
      {sleep && <p style={{ marginBottom: 2 }}>{sleep.emoji} {t('wellness.tooltip_sleep', 'Sonno:')} <strong>{sleep.label}</strong></p>}
      {sleepHoursVal != null && <p style={{ marginBottom: 2 }}>🕐 {t('wellness.tooltip_sleephours', 'Ore sonno:')} <strong>{sleepHoursVal}h</strong></p>}
      {restedness && <p>😴 {t('wellness.tooltip_restedness', 'Riposo:')} <strong>{restedness.label}</strong></p>}
    </div>
  )
}

function CustomCorrelationTooltip({ active, payload, label }) {
  const t = useT()
  if (!active || !payload?.length) return null
  const mood = payload.find(p => p.dataKey === 'mood')
  const kcal = payload.find(p => p.dataKey === 'kcal')
  const moodOpt = mood ? getMoodOptions(t).find(o => o.value === mood.value) : null
  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow-md)', fontSize: 12 }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: 6 }}>{label}</p>
      {moodOpt && <p style={{ marginBottom: 2 }}>{moodOpt.emoji} {t('wellness.tooltip_mood', 'Umore:')} <strong>{moodOpt.label}</strong></p>}
      {kcal && <p>🔥 {t('wellness.tooltip_kcal', 'Kcal:')} <strong>{Math.round(kcal.value)}</strong></p>}
    </div>
  )
}

// Tracks whether the DB has the extended columns (stress_level, hydration_level)
let _wellnessHasExtended = true

export default function WellnessPage() {
  const { user } = useAuth()
  const { checkAndAward } = useAchievements()
  const t = useT()
  const moodOptions = getMoodOptions(t)
  const energyOptions = getEnergyOptions(t)
  const sleepOptions = getSleepOptions(t)
  const restednessOptions = getRestednessOptions(t)
  const stressOptions = getStressOptions(t)
  const symptomList = getSymptomList(t)
  const today = new Date().toISOString().split('T')[0]

  const [todayLog, setTodayLog] = useState(null)
  const [mood, setMood] = useState(null)
  const [energy, setEnergy] = useState(null)
  const [sleepQuality, setSleepQuality] = useState(null)
  const [sleepHours, setSleepHours] = useState(null)
  const [sleepRestedness, setSleepRestedness] = useState(null)
  const [stressLevel, setStressLevel] = useState(null) // Feature 8
  const [symptoms, setSymptoms] = useState([])
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [history, setHistory] = useState([])
  const [macroHistory, setMacroHistory] = useState([])
  const [range, setRange] = useState(30)
  const [chartTab, setChartTab] = useState('trend') // 'trend' | 'correlazione'
  // Segnale indipendente dal range selezionato — "esiste mai stato un
  // check-in, a prescindere dalla finestra 7/30/90gg attualmente scelta".
  // Serve a non nascondere la card del grafico (e i suoi stessi selettori)
  // quando il range corrente non ha dati: senza questo, selezionare "7g"
  // con l'ultimo check-in più vecchio di 7 giorni fa nascondeva l'intera
  // card, bottoni compresi, intrappolando l'utente (via solo un reload).
  const [hasAnyHistory, setHasAnyHistory] = useState(null) // null = ancora da controllare

  useEffect(() => {
    loadData()
    supabase.from('daily_wellness').select('id').eq('user_id', user.id).limit(2)
      .then(({ data }) => setHasAnyHistory((data?.length || 0) > 1))
  }, [])

  useEffect(() => {
    loadData()
  }, [range])

  async function loadData() {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - range)
    const from = cutoff.toISOString().split('T')[0]

    // Run wellness + macro in parallel; fall back to base columns only if extended fails
    const wellSelect = _wellnessHasExtended !== false
      ? 'id,date,mood,energy,sleep_quality,sleep_hours,sleep_restedness,symptoms,notes,stress_level,hydration_level'
      : 'id,date,mood,energy,sleep_quality,sleep_hours,sleep_restedness,symptoms,notes'

    const [wellRes0, macroRes] = await Promise.all([
      supabase.from('daily_wellness').select(wellSelect)
        .eq('user_id', user.id).gte('date', from).order('date', { ascending: true }),
      supabase.from('daily_logs').select('date, kcal, proteins, carbs, fats')
        .eq('user_id', user.id).gte('date', from).order('date', { ascending: true }),
    ])

    let wellnessRes = wellRes0
    if (wellRes0.error && _wellnessHasExtended !== false) {
      _wellnessHasExtended = false
      wellnessRes = await supabase.from('daily_wellness')
        .select('id,date,mood,energy,sleep_quality,sleep_hours,sleep_restedness,symptoms,notes')
        .eq('user_id', user.id).gte('date', from).order('date', { ascending: true })
    } else if (!wellRes0.error) {
      _wellnessHasExtended = true
    }

    const wellnessData = wellnessRes.data || []
    setHistory(wellnessData)
    setMacroHistory(macroRes.data || [])

    const log = wellnessData.find(w => w.date === today)
    setTodayLog(log || null)
    if (log) {
      setMood(log.mood || null)
      setEnergy(log.energy || null)
      setSleepQuality(log.sleep_quality || null)
      setSleepHours(log.sleep_hours != null ? log.sleep_hours : null)
      setSleepRestedness(log.sleep_restedness || null)
      setStressLevel(log.stress_level || null)
      setSymptoms(log.symptoms || [])
      setNotes(log.notes || '')
    } else {
      setShowForm(true)
    }
  }

  async function saveEntry() {
    setSaving(true)
    setError('')

    // Offline fallback: queue to IndexedDB
    if (!navigator.onLine) {
      const baseFields = {
        mood: mood ?? null, energy: energy ?? null,
        sleep_quality: sleepQuality ?? null, sleep_hours: sleepHours ?? null,
        sleep_restedness: sleepRestedness ?? null,
        symptoms: symptoms.length > 0 ? symptoms : [],
        notes: notes || null,
      }
      // Mirror the online path's schema-fallback: only queue stress_level if we
      // already know the column exists, otherwise a queued write against a DB
      // without it would 400 on every sync retry and stay stuck forever (the
      // online path can retry with base fields instead, but a queued item can't).
      const fields = _wellnessHasExtended ? { ...baseFields, stress_level: stressLevel ?? null } : baseFields
      await safeWrite('daily_wellness', { user_id: user.id, date: today, ...fields })
      setSaving(false)
      setSaved(true)
      setShowForm(false)
      setError(t('wellness.saved_offline', 'Salvato offline — verrà sincronizzato alla prossima connessione.'))
      setTimeout(() => setSaved(false), 3000)
      return
    }

    try {
      // Base fields always supported
      const baseFields = {
        mood: mood ?? null,
        energy: energy ?? null,
        sleep_quality: sleepQuality ?? null,
        sleep_hours: sleepHours ?? null,
        sleep_restedness: sleepRestedness ?? null,
        symptoms: symptoms.length > 0 ? symptoms : [],
        notes: notes || null,
      }
      // Extended fields only if columns exist in DB. hydration_level is
      // intentionally omitted: there's no UI control for it on this page, so
      // sending `hydration_level: null` here would silently wipe out any
      // value set elsewhere (e.g. a future feature or manual edit) on every
      // single wellness save.
      const fields = _wellnessHasExtended
        ? { ...baseFields, stress_level: stressLevel ?? null }
        : baseFields

      // Try update first; if extended columns missing (PGRST204), retry with base only
      let { data: updatedRows, error: updateError } = await supabase
        .from('daily_wellness')
        .update(fields)
        .eq('user_id', user.id)
        .eq('date', today)
        .select('id')

      if (updateError && (updateError.code === 'PGRST204' || updateError.message?.includes('stress_level') || updateError.message?.includes('hydration_level'))) {
        _wellnessHasExtended = false
        ;({ data: updatedRows, error: updateError } = await supabase
          .from('daily_wellness')
          .update(baseFields)
          .eq('user_id', user.id)
          .eq('date', today)
          .select('id'))
      }

      if (updateError) {
        console.error('Wellness update error:', updateError.message, updateError.details, updateError.hint, updateError.code)
        setSaving(false)
        setError(t('wellness.error_save', 'Errore durante il salvataggio. Riprova.'))
        return
      }

      let opError = null
      if (!updatedRows || updatedRows.length === 0) {
        // No row for today: create one.
        let insertRes = await supabase
          .from('daily_wellness')
          .insert({ user_id: user.id, date: today, ...fields })
        if (insertRes.error && (insertRes.error.code === 'PGRST204' || insertRes.error.message?.includes('stress_level') || insertRes.error.message?.includes('hydration_level'))) {
          _wellnessHasExtended = false
          insertRes = await supabase
            .from('daily_wellness')
            .insert({ user_id: user.id, date: today, ...baseFields })
        }
        opError = insertRes.error
      }

      setSaving(false)

      if (opError) {
        console.error('Wellness save error:', opError)
        setError(t('wellness.error_save', 'Errore durante il salvataggio. Riprova.'))
        return
      }

      setSaved(true)
      setShowForm(false)
      setTimeout(() => setSaved(false), 3000)
      checkWellnessAchievements(supabase, user.id, checkAndAward).catch(() => {})
      await loadData()
    } catch (err) {
      console.error('Wellness unexpected error:', err)
      setSaving(false)
      setError(t('wellness.error_save', 'Errore durante il salvataggio. Riprova.'))
    }
  }

  function toggleSymptom(s) {
    setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  // Build chart data: merge wellness and macro history by date
  const trendData = history.map(w => ({
    date: new Date(w.date + 'T12:00:00').toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }),
    mood: w.mood,
    energy: w.energy,
    sleep: w.sleep_quality,
    sleepHours: w.sleep_hours,
    restedness: w.sleep_restedness,
  }))

  const macroMap = {}
  macroHistory.forEach(m => { macroMap[m.date] = m })

  const correlationData = history
    .filter(w => w.mood && macroMap[w.date])
    .map(w => {
      const macro = macroMap[w.date]
      return {
        date: new Date(w.date + 'T12:00:00').toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }),
        mood: w.mood,
        kcal: macro?.kcal || 0,
      }
    })

  const moodEntries = history.filter(w => w.mood)
  const moodAvg = moodEntries.length > 0
    ? (moodEntries.reduce((s, w) => s + w.mood, 0) / moodEntries.length).toFixed(1)
    : null

  const energyEntries = history.filter(w => w.energy)
  const energyAvg = energyEntries.length > 0
    ? (energyEntries.reduce((s, w) => s + w.energy, 0) / energyEntries.length).toFixed(1)
    : null

  const sleepEntries = history.filter(w => w.sleep_quality)
  const sleepAvg = sleepEntries.length > 0
    ? (sleepEntries.reduce((s, w) => s + w.sleep_quality, 0) / sleepEntries.length).toFixed(1)
    : null

  const sleepHoursEntries = history.filter(w => w.sleep_hours != null)
  const sleepHoursAvg = sleepHoursEntries.length > 0
    ? (sleepHoursEntries.reduce((s, w) => s + w.sleep_hours, 0) / sleepHoursEntries.length).toFixed(1)
    : null

  const restednessEntries = history.filter(w => w.sleep_restedness)
  const restednessAvg = restednessEntries.length > 0
    ? (restednessEntries.reduce((s, w) => s + w.sleep_restedness, 0) / restednessEntries.length).toFixed(1)
    : null

  // Feature 8: Stress avg
  const stressEntries = history.filter(w => w.stress_level)
  const stressAvg = stressEntries.length > 0
    ? (stressEntries.reduce((s, w) => s + w.stress_level, 0) / stressEntries.length).toFixed(1)
    : null

  const todayMoodOpt = moodOptions.find(o => o.value === (todayLog?.mood))
  const todayEnergyOpt = energyOptions.find(o => o.value === (todayLog?.energy))
  const todaySleepOpt = sleepOptions.find(o => o.value === (todayLog?.sleep_quality))
  const todayRestednessOpt = restednessOptions.find(o => o.value === (todayLog?.sleep_restedness))

  // Compute auto insights (min 2 data points per group)
  const MIN_INSIGHT_PTS = 2
  const insights = []
  const longSleep = history.filter(w => w.sleep_hours >= 7 && w.mood)
  const shortSleep = history.filter(w => w.sleep_hours != null && w.sleep_hours < 7 && w.mood)
  if (longSleep.length >= MIN_INSIGHT_PTS && shortSleep.length >= MIN_INSIGHT_PTS) {
    const al = (longSleep.reduce((s, w) => s + w.mood, 0) / longSleep.length).toFixed(1)
    const as_ = (shortSleep.reduce((s, w) => s + w.mood, 0) / shortSleep.length).toFixed(1)
    const diff = Math.abs(parseFloat(al) - parseFloat(as_))
    if (diff >= 0.3) insights.push({ positive: parseFloat(al) > parseFloat(as_), text: t('wellness.insight_sleep_mood', { long: al, short: as_, comment: parseFloat(al) > parseFloat(as_) ? t('wellness.insight_rest_counts', '💚 Il riposo conta!') : t('wellness.insight_other_factors', '🤔 Altri fattori influenzano il tuo umore.') }, 'Quando dormi ≥7h il tuo umore medio è {{long}}/5, vs {{short}}/5 con meno sonno. {{comment}}') })
  }
  const goodSleep = history.filter(w => w.sleep_quality >= 4 && w.energy)
  const badSleep = history.filter(w => w.sleep_quality != null && w.sleep_quality <= 2 && w.energy)
  if (goodSleep.length >= MIN_INSIGHT_PTS && badSleep.length >= MIN_INSIGHT_PTS) {
    const ag = (goodSleep.reduce((s, w) => s + w.energy, 0) / goodSleep.length).toFixed(1)
    const ab = (badSleep.reduce((s, w) => s + w.energy, 0) / badSleep.length).toFixed(1)
    insights.push({ positive: parseFloat(ag) > parseFloat(ab), text: t('wellness.insight_sleep_energy', { good: ag, bad: ab }, 'Con sonno buono (≥4/5) la tua energia media è {{good}}/5, vs {{bad}}/5 con sonno scarso. 😴') })
  }
  const hiKcalMoods = correlationData.filter(d => d.kcal > 1800 && d.mood)
  const loKcalMoods = correlationData.filter(d => d.kcal > 0 && d.kcal <= 1800 && d.mood)
  if (hiKcalMoods.length >= MIN_INSIGHT_PTS && loKcalMoods.length >= MIN_INSIGHT_PTS) {
    const ah = (hiKcalMoods.reduce((s, d) => s + d.mood, 0) / hiKcalMoods.length).toFixed(1)
    const al2 = (loKcalMoods.reduce((s, d) => s + d.mood, 0) / loKcalMoods.length).toFixed(1)
    if (Math.abs(parseFloat(ah) - parseFloat(al2)) >= 0.3) insights.push({ positive: parseFloat(ah) >= parseFloat(al2), text: t('wellness.insight_kcal_mood', { high: ah, low: al2 }, 'Nei giorni con >1800 kcal il tuo umore medio è {{high}}/5, vs {{low}}/5 con meno calorie. 🍽️') })
  }
  const loStressSleep = history.filter(w => w.stress_level != null && w.stress_level <= 2 && w.sleep_quality)
  const hiStressSleep = history.filter(w => w.stress_level >= 4 && w.sleep_quality)
  if (loStressSleep.length >= MIN_INSIGHT_PTS && hiStressSleep.length >= MIN_INSIGHT_PTS) {
    const als = (loStressSleep.reduce((s, w) => s + w.sleep_quality, 0) / loStressSleep.length).toFixed(1)
    const ahs = (hiStressSleep.reduce((s, w) => s + w.sleep_quality, 0) / hiStressSleep.length).toFixed(1)
    insights.push({ positive: parseFloat(als) > parseFloat(ahs), text: t('wellness.insight_stress_sleep', { low: als, high: ahs }, 'Con stress basso la qualità del sonno è {{low}}/5, vs {{high}}/5 con stress alto. 🧠') })
  }

  return (
    <div className="page">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg, #4c1d95, #7c3aed)',
        padding: 'calc(env(safe-area-inset-top) + 20px) 24px 28px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 }}>{t('wellness.how_are_you', 'Come stai?')}</p>
            <h1 style={{ fontFamily: 'var(--font-d)', fontSize: 24, color: 'white', fontWeight: 300 }}>{t('nav.wellness')}</h1>
          </div>
          <button
            onClick={() => setShowForm(v => !v)}
            className="btn"
            style={{ background: 'rgba(255,255,255,0.18)', color: 'white', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: 14, padding: '10px 16px', fontSize: 14, fontWeight: 600, gap: 6 }}
          >
            <Plus size={16} />{t('common.today')}
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: 10 }}>
          {[
            { label: t('wellness.avg_mood', 'Umore medio'), val: moodAvg ? `${moodAvg}/5` : '–', icon: <Heart size={14} />, emoji: moodOptions.find(o => o.value === Math.round(Number(moodAvg)))?.emoji },
            { label: t('wellness.avg_energy', 'Energia media'), val: energyAvg ? `${energyAvg}/5` : '–', icon: <Zap size={14} />, emoji: energyOptions.find(o => o.value === Math.round(Number(energyAvg)))?.emoji },
            { label: t('wellness.avg_sleep', 'Sonno medio'), val: sleepAvg ? `${sleepAvg}/5` : '–', icon: <Moon size={14} />, emoji: sleepOptions.find(o => o.value === Math.round(Number(sleepAvg)))?.emoji },
            { label: t('wellness.avg_sleep_hours', 'Ore sonno medie'), val: sleepHoursAvg ? `${sleepHoursAvg}h` : '–', icon: <Clock size={14} /> },
            { label: t('wellness.avg_rest', 'Riposo medio'), val: restednessAvg ? `${restednessAvg}/5` : '–', icon: <BedDouble size={14} />, emoji: restednessOptions.find(o => o.value === Math.round(Number(restednessAvg)))?.emoji },
            { label: t('wellness.avg_stress', 'Stress medio'), val: stressAvg ? `${stressAvg}/5` : '–', icon: <Brain size={14} />, emoji: stressOptions.find(o => o.value === Math.round(Number(stressAvg)))?.emoji },
          ].map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.06 + i * 0.06, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 14, padding: '12px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>
                {s.icon}<span style={{ fontSize: 10 }}>{s.label}</span>
              </div>
              <p style={{ color: 'white', fontSize: 16, fontWeight: 700 }}>
                {s.emoji ? `${s.emoji} ` : ''}{s.val}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Saved feedback */}
        {saved && (
          <div className="animate-slideUp" style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--green-pale)', border: '1.5px solid var(--green-light)', borderRadius: 14, padding: '12px 16px', color: 'var(--green-dark)' }}>
            <CheckCircle size={18} />
            <span style={{ fontSize: 14, fontWeight: 500 }}>{t('wellness.saved')}</span>
          </div>
        )}

        {/* Error feedback */}
        {error && (
          <div className="animate-slideUp" style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--alert-error-bg)', border: '1.5px solid var(--alert-error-border)', borderRadius: 14, padding: '12px 16px', color: 'var(--alert-error-text)' }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>{error}</span>
          </div>
        )}

        {/* Today summary (when not editing) */}
        {!showForm && todayLog && (
          <div className="card animate-slideUp" style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600 }}>{t('wellness.todays_checkin', 'Check-in di oggi')}</h3>
              <button onClick={() => setShowForm(true)} style={{ fontSize: 12, color: '#7c3aed', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>{t('common.edit')}</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
              {[
                { label: t('wellness.mood', 'Umore'), emoji: todayMoodOpt?.emoji, text: todayMoodOpt?.label },
                { label: t('wellness.label_energy', 'Energia'), emoji: todayEnergyOpt?.emoji, text: todayEnergyOpt?.label },
                { label: t('wellness.label_sleep', 'Sonno'), emoji: todaySleepOpt?.emoji, text: todaySleepOpt?.label },
                { label: t('wellness.label_sleep_hours', 'Ore sonno'), emoji: '🕐', text: todayLog?.sleep_hours != null ? `${todayLog.sleep_hours}h` : null },
                { label: t('wellness.label_restedness', 'Riposo'), emoji: todayRestednessOpt?.emoji, text: todayRestednessOpt?.label },
                { label: t('wellness.label_stress', 'Stress'), emoji: stressOptions.find(o => o.value === todayLog?.stress_level)?.emoji, text: stressOptions.find(o => o.value === todayLog?.stress_level)?.label },
              ].map(item => (
                <div key={item.label} style={{ background: 'var(--surface-2)', borderRadius: 12, padding: '10px 8px', textAlign: 'center' }}>
                  <p style={{ fontSize: 24, marginBottom: 4 }}>{item.emoji || '–'}</p>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.label}</p>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{item.text || '–'}</p>
                </div>
              ))}
            </div>
            {todayLog.symptoms?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                {todayLog.symptoms.map(s => (
                  <span key={s} className="badge badge-purple" style={{ fontSize: 11 }}>{symptomList.find(o => o.value === s)?.label || s}</span>
                ))}
              </div>
            )}
            {todayLog.notes && (
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic', borderTop: '1px solid var(--border-light)', paddingTop: 10 }}>"{todayLog.notes}"</p>
            )}
          </div>
        )}

        {/* Check-in form */}
        {showForm && (
          <div className="card animate-slideUp" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>📝 {t('wellness.days_checkin', 'Check-in del giorno')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

              {/* Mood */}
              <div>
                <p className="input-label" style={{ marginBottom: 12 }}>😊 {t('wellness.how_feel', 'Come ti senti oggi?')}</p>
                <ScaleSelector options={moodOptions} value={mood} onChange={setMood} />
              </div>

              {/* Energy */}
              <div>
                <p className="input-label" style={{ marginBottom: 12 }}>⚡ {t('wellness.energy_level', 'Livello di energia')}</p>
                <ScaleSelector options={energyOptions} value={energy} onChange={setEnergy} />
              </div>

              {/* Sleep */}
              <div>
                <p className="input-label" style={{ marginBottom: 12 }}>🌙 {t('wellness.sleep_quality', 'Qualità del sonno (notte scorsa)')}</p>
                <ScaleSelector options={sleepOptions} value={sleepQuality} onChange={setSleepQuality} />
              </div>

              {/* Sleep hours */}
              <div>
                <p className="input-label" style={{ marginBottom: 10 }}>🕐 {t('wellness.sleep_hours', 'Quante ore hai dormito?')}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button
                    onClick={() => setSleepHours(h => Math.max(0, (h ?? 7) - 0.5))}
                    aria-label={t('wellness.aria_decrease_sleep', 'Diminuisci ore di sonno')}
                    style={{
                      width: 44, height: 44, borderRadius: 10, border: '1.5px solid var(--border)',
                      background: 'var(--surface-2)', cursor: 'pointer', fontSize: 18, fontWeight: 600,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed',
                    }}
                  >−</button>
                  <span style={{
                    flex: 1, textAlign: 'center', fontSize: 22, fontWeight: 700,
                    color: sleepHours != null ? '#7c3aed' : 'var(--text-muted)',
                    background: '#f5f3ff', borderRadius: 10, padding: '8px 10px',
                  }}>
                    {sleepHours != null ? `${sleepHours}h` : t('wellness.tap_hint', 'Tocca +/−')}
                  </span>
                  <button
                    onClick={() => setSleepHours(h => Math.min(24, (h ?? 7) + 0.5))}
                    aria-label={t('wellness.aria_increase_sleep', 'Aumenta ore di sonno')}
                    style={{
                      width: 44, height: 44, borderRadius: 10, border: '1.5px solid var(--border)',
                      background: 'var(--surface-2)', cursor: 'pointer', fontSize: 18, fontWeight: 600,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed',
                    }}
                  >+</button>
                </div>
              </div>

              {/* Restedness */}
              <div>
                <p className="input-label" style={{ marginBottom: 12 }}>😴 {t('wellness.restedness', 'Quanto ti senti riposato?')}</p>
                <ScaleSelector options={restednessOptions} value={sleepRestedness} onChange={setSleepRestedness} />
              </div>

              {/* Feature 8: Stress level */}
              <div>
                <p className="input-label" style={{ marginBottom: 12 }}>🧠 {t('wellness.form_stress_question', 'Livello di stress')}</p>
                <ScaleSelector options={stressOptions} value={stressLevel} onChange={setStressLevel} />
              </div>

              {/* Symptoms */}
              <div>
                <p className="input-label" style={{ marginBottom: 10 }}>🔍 {t('wellness.symptoms_label', 'Sintomi / sensazioni fisiche')}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {symptomList.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => toggleSymptom(value)}
                      style={{
                        padding: '6px 14px', borderRadius: 100, font: 'inherit', fontSize: 13, cursor: 'pointer',
                        background: symptoms.includes(value) ? '#f5f3ff' : 'var(--surface-2)',
                        color: symptoms.includes(value) ? '#7c3aed' : 'var(--text-secondary)',
                        border: `1.5px solid ${symptoms.includes(value) ? '#7c3aed' : 'var(--border)'}`,
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="input-group">
                <label className="input-label">📓 {t('wellness.free_notes', 'Note libere')}</label>
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder={t('wellness.form_notes_placeholder', 'Come è andata oggi? Annotazioni sul benessere, sulla dieta…')}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                {todayLog && (
                  <button className="btn btn-secondary" onClick={() => setShowForm(false)} style={{ flex: 1 }}>
                    {t('common.cancel')}
                  </button>
                )}
                <button
                  className="btn btn-primary"
                  onClick={saveEntry}
                  disabled={saving || (!mood && !energy && !sleepQuality && sleepHours == null && !sleepRestedness && !stressLevel && !symptoms.length && !notes)}
                  style={{ flex: 2, background: 'linear-gradient(135deg, #4c1d95, #7c3aed)' }}
                >
                  {saving ? `${t('wellness.save')}…` : `✓ ${t('wellness.save')}`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* No data at all — hasAnyHistory è indipendente dal range selezionato,
            così non mostra questo messaggio quando esiste storico ma non nella
            finestra 7/30/90gg corrente */}
        {!showForm && !todayLog && hasAnyHistory === false && (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
            <Heart size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
            <p style={{ fontSize: 15, fontWeight: 500 }}>{t('wellness.start_title', 'Inizia il tuo diario del benessere')}</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>{t('wellness.empty_subtitle', 'Registra umore, energia e qualità del sonno ogni giorno.')}</p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)} style={{ marginTop: 20, background: 'linear-gradient(135deg, #4c1d95, #7c3aed)' }}>
              <Plus size={16} />{t('wellness.first_checkin', 'Primo check-in')}
            </button>
          </div>
        )}

        {/* Charts section — gate on hasAnyHistory (indipendente dal range), non
            su history.length: altrimenti selezionare "7g" senza check-in negli
            ultimi 7 giorni nascondeva l'intera card, selettori di range
            inclusi, intrappolando l'utente (via solo un reload di pagina) */}
        {hasAnyHistory && (
          <div className="card" style={{ padding: '18px 12px 14px' }}>
            {/* Tab selector */}
            <div style={{ display: 'flex', gap: 8, paddingLeft: 8, marginBottom: 16 }}>
              {[
                { key: 'trend', label: t('wellness.tab_trend', '📈 Andamento') },
                { key: 'correlazione', label: t('wellness.tab_correlation', '🔗 Correlazione dieta') },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setChartTab(tab.key)}
                  style={{
                    padding: '6px 14px', borderRadius: 100, font: 'inherit', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                    background: chartTab === tab.key ? '#7c3aed' : 'var(--surface-2)',
                    color: chartTab === tab.key ? 'white' : 'var(--text-secondary)',
                    border: `1.5px solid ${chartTab === tab.key ? 'transparent' : 'var(--border)'}`,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Range selector */}
            <div style={{ display: 'flex', gap: 6, paddingLeft: 8, marginBottom: 14 }}>
              {[7, 30, 90].map(r => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  style={{
                    padding: '3px 10px', borderRadius: 100, font: 'inherit', fontSize: 11, cursor: 'pointer',
                    background: range === r ? 'var(--green-main)' : 'var(--surface-2)',
                    color: range === r ? 'white' : 'var(--text-muted)',
                    border: `1px solid ${range === r ? 'transparent' : 'var(--border)'}`,
                  }}
                >
                  {r}{t('wellness.days_suffix', 'g')}
                </button>
              ))}
            </div>

            {history.length <= 1 ? (
              <div style={{ textAlign: 'center', padding: '28px 0', color: 'var(--text-muted)', fontSize: 13 }}>
                {t('wellness.no_checkins_range', { range }, 'Nessun check-in negli ultimi {{range}} giorni.')}
              </div>
            ) : chartTab === 'trend' ? (
              <>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', paddingLeft: 8, marginBottom: 8 }}>
                  {t('wellness.scale_label', 'Scala 1–5')} &nbsp;·&nbsp;
                  <span style={{ color: '#7c3aed' }}>● {t('wellness.mood', 'Umore')}</span>
                  {trendData.some(d => d.energy) && <span style={{ color: '#f59e0b' }}> &nbsp;● {t('wellness.label_energy', 'Energia')}</span>}
                  {trendData.some(d => d.sleep) && <span style={{ color: '#06b6d4' }}> &nbsp;● {t('wellness.label_sleep', 'Sonno')}</span>}
                  {trendData.some(d => d.restedness) && <span style={{ color: '#10b981' }}> &nbsp;● {t('wellness.label_restedness', 'Riposo')}</span>}
                </p>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={trendData} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} interval="preserveStartEnd" />
                    <YAxis domain={[0, 5.5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                    <Tooltip content={<CustomMoodTooltip />} />
                    <ReferenceLine y={3} stroke="var(--border)" strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="mood" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 4, fill: '#7c3aed' }} activeDot={{ r: 6 }} connectNulls />
                    <Line type="monotone" dataKey="energy" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: '#f59e0b' }} activeDot={{ r: 5 }} connectNulls />
                    <Line type="monotone" dataKey="sleep" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3, fill: '#06b6d4' }} activeDot={{ r: 5 }} connectNulls />
                    <Line type="monotone" dataKey="restedness" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981' }} activeDot={{ r: 5 }} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              </>
            ) : correlationData.length > 0 ? (
              <>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', paddingLeft: 8, marginBottom: 8 }}>
                  {t('wellness.correlation_desc', 'Umore (linea viola) vs Kcal ingerite (barre arancio)')}
                </p>
                <ResponsiveContainer width="100%" height={200}>
                  <ComposedChart data={correlationData} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} interval="preserveStartEnd" />
                    <YAxis yAxisId="left" domain={[0, 5.5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                    <Tooltip content={<CustomCorrelationTooltip />} />
                    <Bar yAxisId="right" dataKey="kcal" fill="#f59e0b" fillOpacity={0.35} radius={[3, 3, 0, 0]} />
                    <Line yAxisId="left" type="monotone" dataKey="mood" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 4, fill: '#7c3aed' }} activeDot={{ r: 6 }} connectNulls />
                  </ComposedChart>
                </ResponsiveContainer>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '28px 0', color: 'var(--text-muted)', fontSize: 13 }}>
                <p>{t('wellness.no_diet_correlation', 'Aggiungi pasti nel diario alimentare per vedere la correlazione umore/dieta.')}</p>
              </div>
            )}
          </div>
        )}

        {/* History list */}
        {history.length > 0 && (
          <div className="card" style={{ padding: '18px 20px' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>{t('water.history')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[...history].reverse().slice(0, 14).map(entry => {
                const moodOpt = moodOptions.find(o => o.value === entry.mood)
                const energyOpt = energyOptions.find(o => o.value === entry.energy)
                const sleepOpt = sleepOptions.find(o => o.value === entry.sleep_quality)
                const restednessOpt = restednessOptions.find(o => o.value === entry.sleep_restedness)
                const stressOpt = stressOptions.find(o => o.value === entry.stress_level)
                const isToday = entry.date === today
                return (
                  <div key={entry.id} style={{ display: 'flex', gap: 12, padding: '10px 12px', background: isToday ? '#f5f3ff' : 'var(--surface-2)', borderRadius: 12, border: isToday ? '1.5px solid #c4b5fd' : '1px solid transparent' }}>
                    <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 44 }}>
                      <p style={{ fontSize: 22 }}>{moodOpt?.emoji || '–'}</p>
                      <p style={{ fontSize: 10, color: isToday ? '#7c3aed' : 'var(--text-muted)', fontWeight: isToday ? 600 : 400 }}>
                        {isToday ? t('common.today') : new Date(entry.date + 'T12:00:00').toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                        {moodOpt && <span style={{ fontSize: 11, background: 'var(--icon-bg-purple)', color: 'var(--purple)', borderRadius: 100, padding: '2px 8px', fontWeight: 500 }}>😊 {moodOpt.label}</span>}
                        {energyOpt && <span style={{ fontSize: 11, background: 'var(--icon-bg-amber)', color: 'var(--orange)', borderRadius: 100, padding: '2px 8px', fontWeight: 500 }}>⚡ {energyOpt.label}</span>}
                        {sleepOpt && <span style={{ fontSize: 11, background: 'var(--icon-bg-cyan)', color: 'var(--blue)', borderRadius: 100, padding: '2px 8px', fontWeight: 500 }}>🌙 {sleepOpt.label}</span>}
                        {entry.sleep_hours != null && <span style={{ fontSize: 11, background: 'var(--icon-bg-purple)', color: 'var(--purple)', borderRadius: 100, padding: '2px 8px', fontWeight: 500 }}>🕐 {entry.sleep_hours}h</span>}
                        {restednessOpt && <span style={{ fontSize: 11, background: 'var(--icon-bg-lime)', color: 'var(--green-mid)', borderRadius: 100, padding: '2px 8px', fontWeight: 500 }}>😴 {restednessOpt.label}</span>}
                        {stressOpt && <span style={{ fontSize: 11, background: '#fef3c7', color: '#92400e', borderRadius: 100, padding: '2px 8px', fontWeight: 500 }}>🧠 {stressOpt.label}</span>}
                      </div>
                      {entry.symptoms?.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
                          {entry.symptoms.slice(0, 4).map(s => (
                            <span key={s} style={{ fontSize: 10, background: 'var(--surface)', color: 'var(--text-muted)', borderRadius: 100, padding: '1px 6px', border: '1px solid var(--border-light)' }}>{symptomList.find(o => o.value === s)?.label || s}</span>
                          ))}
                          {entry.symptoms.length > 4 && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>+{entry.symptoms.length - 4}</span>}
                        </div>
                      )}
                      {entry.notes && (
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.notes}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Insights automatici */}
        <div className="card" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: insights.length > 0 ? 14 : 0 }}>
            <Lightbulb size={16} color="#f59e0b" />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{t('wellness.insights_title', 'Insight automatici')}</h3>
            {history.length > 0 && <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>{t('wellness.insights_range_count', { count: history.length }, 'ultimi {{count}} giorni')}</span>}
          </div>
          {insights.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {insights.map((ins, i) => (
                <div key={i} style={{ background: ins.positive ? '#f0fdf4' : '#fffbeb', borderRadius: 12, padding: '12px 14px', border: `1px solid ${ins.positive ? '#bbf7d0' : '#fde68a'}` }}>
                  <p style={{ fontSize: 13, color: ins.positive ? '#166534' : '#92400e', fontWeight: 500, lineHeight: 1.5, margin: 0 }}>{ins.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginTop: 10 }}>
              {history.length < 4
                ? t('wellness.insights_need_more', { count: history.length }, 'Registra ancora qualche giornata (hai {{count}} su 4 minime) per sbloccare correlazioni personalizzate tra sonno, umore, energia e alimentazione.')
                : t('wellness.insights_no_correlation', 'Ancora nessuna correlazione rilevante. Continua a registrare il tuo benessere per scoprire i tuoi pattern personali.')}
            </p>
          )}
        </div>

        <div style={{ height: 'var(--nav)' }} />
      </div>
    </div>
  )
}
