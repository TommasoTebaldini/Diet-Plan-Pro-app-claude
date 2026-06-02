import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useAchievements } from '../context/AchievementsContext'
import { CheckCircle, ChevronRight, AlertCircle } from 'lucide-react'
import PageTransition from '../components/PageTransition'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getWeekStart(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = (day === 0 ? -6 : 1 - day) // Monday = start
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d.toISOString().split('T')[0] // YYYY-MM-DD
}

const ADHERENCE_OPTIONS = [
  { value: 'sempre', label: 'Sempre', color: '#1a7f5a', bg: '#e8f5ee' },
  { value: 'spesso', label: 'Spesso', color: '#2563eb', bg: '#eff6ff' },
  { value: 'a_volte', label: 'A volte', color: '#d97706', bg: '#fff7ed' },
  { value: 'raramente', label: 'Raramente', color: '#dc2626', bg: '#fff0f0' },
  { value: 'mai', label: 'Mai', color: '#6b7280', bg: '#f9fafb' },
]

const MOTIVATIONAL_MESSAGES = [
  'Ottimo lavoro! Ogni check-in ti avvicina ai tuoi obiettivi. 💪',
  'Continuità è la chiave del successo. Sei sulla strada giusta! 🌟',
  'Grazie per la tua onestà. Il tuo dietista ti supporta in ogni passo. 🤝',
  'Analizzare la settimana è il primo passo per migliorare. Bravissimo/a! 🎯',
]

// ─── Sub-components ────────────────────────────────────────────────────────────
function RatingRow({ label, value, onChange, max = 5, emojis }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>
        {label}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {Array.from({ length: max }, (_, i) => i + 1).map(n => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            style={{
              flex: 1,
              height: '42px',
              borderRadius: 'var(--r-sm)',
              border: value === n ? '2px solid var(--green-main)' : '1.5px solid var(--border-light)',
              background: value === n ? '#e8f5ee' : 'var(--surface)',
              cursor: 'pointer',
              fontSize: emojis ? '18px' : '13px',
              fontWeight: value === n ? 700 : 500,
              color: value === n ? 'var(--green-main)' : 'var(--text-muted)',
              transition: 'all 0.15s',
            }}
          >
            {emojis ? emojis[n - 1] : n}
          </button>
        ))}
      </div>
    </div>
  )
}

function SatisfactionSlider({ value, onChange }) {
  const pct = ((value - 1) / 9) * 100
  const color = value <= 3 ? '#dc2626' : value <= 6 ? '#d97706' : '#1a7f5a'
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Per niente soddisfatto</span>
        <span style={{
          fontSize: '22px',
          fontWeight: 800,
          color,
          minWidth: '40px',
          textAlign: 'center',
        }}>
          {value}
        </span>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Molto soddisfatto</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          width: '100%',
          height: '6px',
          borderRadius: '3px',
          appearance: 'none',
          background: `linear-gradient(to right, ${color} ${pct}%, var(--border-light) ${pct}%)`,
          cursor: 'pointer',
          outline: 'none',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
          <span key={n} style={{ fontSize: '9px', color: 'var(--text-muted)', lineHeight: 1 }}>{n}</span>
        ))}
      </div>
    </div>
  )
}

function Section({ number, title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--r-md)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-xs)',
        padding: '18px 16px',
        marginBottom: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: '#e8f5ee',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '13px',
          fontWeight: 700,
          color: '#1a7f5a',
          flexShrink: 0,
        }}>
          {number}
        </div>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          {title}
        </h3>
      </div>
      {children}
    </motion.div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CheckinPage() {
  const { user } = useAuth()
  const { checkAndAward } = useAchievements()

  const weekStart = getWeekStart()

  const [alreadyDone, setAlreadyDone] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [motivMsg] = useState(() => MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)])

  // Form state
  const [satisfaction, setSatisfaction] = useState(7)
  const [adherence, setAdherence] = useState(null)
  const [weightKg, setWeightKg] = useState('')
  const [energy, setEnergy] = useState(null)
  const [sleepQuality, setSleepQuality] = useState(null)
  const [stress, setStress] = useState(null)
  const [difficulties, setDifficulties] = useState('')
  const [nextWeekGoal, setNextWeekGoal] = useState('')
  const [messageToDietitian, setMessageToDietitian] = useState('')

  useEffect(() => {
    if (!user) return
    const check = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('weekly_checkins')
        .select('id')
        .eq('user_id', user.id)
        .eq('week_start_date', weekStart)
        .maybeSingle()
      setAlreadyDone(!!data)
      setLoading(false)
    }
    check()
  }, [user, weekStart])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!adherence || !energy || !sleepQuality || !stress) {
      setError('Per favore completa tutte le sezioni obbligatorie.')
      return
    }
    setError(null)
    setSubmitting(true)

    try {
      const payload = {
        user_id: user.id,
        week_start_date: weekStart,
        satisfaction_score: satisfaction,
        diet_adherence: adherence,
        weight_kg: weightKg ? parseFloat(weightKg) : null,
        energy,
        sleep_quality: sleepQuality,
        stress,
        difficulties: difficulties.trim() || null,
        next_week_goal: nextWeekGoal.trim() || null,
        message_to_dietitian: messageToDietitian.trim() || null,
      }

      const { error: insertError } = await supabase
        .from('weekly_checkins')
        .insert(payload)

      if (insertError) throw insertError

      // If message to dietitian is not empty, send it as a chat message
      if (messageToDietitian.trim()) {
        await supabase.from('chat_messages').insert({
          patient_id: user.id,
          sender_role: 'patient',
          sender_id: user.id,
          content: `📊 Check-in settimanale: ${messageToDietitian.trim()}`,
          message_type: 'text',
        })
      }

      // Award badge
      await checkAndAward('first_checkin')

      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'Si è verificato un errore. Riprova.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <PageTransition>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid var(--border-light)', borderTopColor: 'var(--green-main)', animation: 'spin 0.8s linear infinite' }} />
        </div>
      </PageTransition>
    )
  }

  if (alreadyDone) {
    return (
      <PageTransition>
        <div style={{ padding: '24px 16px', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <div style={{ fontSize: '64px' }}>✅</div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Check-in già completato
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', maxWidth: '300px', lineHeight: 1.5, margin: 0 }}>
            Hai già inviato il check-in per questa settimana (dal {weekStart}). Torna la prossima settimana!
          </p>
        </div>
      </PageTransition>
    )
  }

  if (submitted) {
    return (
      <PageTransition>
        <div style={{ padding: '40px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: '#e8f5ee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
            }}
          >
            🎉
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 10px', fontFamily: 'var(--font-d)' }}>
              Check-in completato!
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--text-muted)', maxWidth: '300px', lineHeight: 1.6, margin: '0 auto' }}>
              {motivMsg}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              background: '#e8f5ee',
              border: '1px solid #c3e6cd',
              borderRadius: 'var(--r-md)',
              padding: '16px 20px',
              maxWidth: '320px',
              width: '100%',
            }}
          >
            <div style={{ fontSize: '13px', color: '#1a7f5a', fontWeight: 600 }}>
              Il tuo dietista potrà visualizzare questo check-in nel suo pannello. Continua così!
            </div>
          </motion.div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div style={{ padding: '0 0 calc(var(--nav) + 32px)', background: 'var(--surface-2)', minHeight: '100vh' }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0a4a2e 0%, #1a7f5a 100%)',
          padding: '48px 20px 24px',
          color: '#fff',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>📋</div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 6px', fontFamily: 'var(--font-d)' }}>
            Check-in Settimanale
          </h1>
          <p style={{ fontSize: '13px', opacity: 0.8, margin: 0 }}>
            Settimana dal {new Date(weekStart + 'T00:00:00').toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '16px 14px' }}>

          {/* 1. Soddisfazione generale */}
          <Section number="1" title="Come è andata questa settimana?">
            <SatisfactionSlider value={satisfaction} onChange={setSatisfaction} />
          </Section>

          {/* 2. Aderenza al piano */}
          <Section number="2" title="Hai seguito il piano alimentare?">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {ADHERENCE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAdherence(opt.value)}
                  style={{
                    flex: '1 1 calc(33% - 8px)',
                    minWidth: '80px',
                    padding: '10px 8px',
                    borderRadius: 'var(--r-sm)',
                    border: adherence === opt.value ? `2px solid ${opt.color}` : '1.5px solid var(--border-light)',
                    background: adherence === opt.value ? opt.bg : 'var(--surface)',
                    color: adherence === opt.value ? opt.color : 'var(--text-muted)',
                    fontSize: '13px',
                    fontWeight: adherence === opt.value ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </Section>

          {/* 3. Peso */}
          <Section number="3" title="Peso attuale (opzionale)">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="number"
                step="0.1"
                min="30"
                max="300"
                placeholder="es. 72.5"
                value={weightKg}
                onChange={e => setWeightKg(e.target.value)}
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  borderRadius: 'var(--r-sm)',
                  border: '1.5px solid var(--border-light)',
                  background: 'var(--surface)',
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              />
              <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-muted)', minWidth: '24px' }}>kg</span>
            </div>
          </Section>

          {/* 4. Benessere fisico */}
          <Section number="4" title="Come ti sei sentito/a fisicamente?">
            <RatingRow
              label="Energia"
              value={energy}
              onChange={setEnergy}
              emojis={['🪫', '😴', '😐', '⚡', '🚀']}
            />
            <RatingRow
              label="Qualità del sonno"
              value={sleepQuality}
              onChange={setSleepQuality}
              emojis={['😫', '😔', '😐', '😴', '🌟']}
            />
            <RatingRow
              label="Livello di stress"
              value={stress}
              onChange={setStress}
              emojis={['😌', '🙂', '😐', '😰', '😤']}
            />
          </Section>

          {/* 5. Difficoltà */}
          <Section number="5" title="Difficoltà incontrate (opzionale)">
            <textarea
              placeholder="Descrivi eventuali difficoltà nella settimana..."
              value={difficulties}
              onChange={e => setDifficulties(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--r-sm)',
                border: '1.5px solid var(--border-light)',
                background: 'var(--surface)',
                fontSize: '14px',
                color: 'var(--text-primary)',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'var(--font-b)',
                boxSizing: 'border-box',
              }}
            />
          </Section>

          {/* 6. Obiettivo prossima settimana */}
          <Section number="6" title="Obiettivo per la prossima settimana (opzionale)">
            <textarea
              placeholder="Cosa vuoi migliorare o raggiungere la prossima settimana?"
              value={nextWeekGoal}
              onChange={e => setNextWeekGoal(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--r-sm)',
                border: '1.5px solid var(--border-light)',
                background: 'var(--surface)',
                fontSize: '14px',
                color: 'var(--text-primary)',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'var(--font-b)',
                boxSizing: 'border-box',
              }}
            />
          </Section>

          {/* 7. Messaggio al dietista */}
          <Section number="7" title="Messaggio al dietista (opzionale)">
            <textarea
              placeholder="Vuoi comunicare qualcosa al tuo dietista? (verrà inviato anche in chat)"
              value={messageToDietitian}
              onChange={e => setMessageToDietitian(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--r-sm)',
                border: '1.5px solid var(--border-light)',
                background: 'var(--surface)',
                fontSize: '14px',
                color: 'var(--text-primary)',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'var(--font-b)',
                boxSizing: 'border-box',
              }}
            />
            {messageToDietitian.trim() && (
              <div style={{
                marginTop: '8px',
                padding: '8px 10px',
                background: '#eff6ff',
                borderRadius: 'var(--r-sm)',
                fontSize: '12px',
                color: '#2563eb',
              }}>
                Il messaggio verrà inviato al tuo dietista anche nella chat.
              </div>
            )}
          </Section>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '12px 14px',
                  background: 'var(--alert-error-bg)',
                  border: '1px solid var(--alert-error-border)',
                  borderRadius: 'var(--r-sm)',
                  marginBottom: '12px',
                }}
              >
                <AlertCircle size={16} color="var(--alert-error-text)" style={{ flexShrink: 0, marginTop: '1px' }} />
                <span style={{ fontSize: '13px', color: 'var(--alert-error-text)' }}>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: 'var(--r-md)',
              border: 'none',
              background: submitting ? 'var(--border-light)' : 'linear-gradient(135deg, #1a7f5a, #3dba7a)',
              color: submitting ? 'var(--text-muted)' : '#fff',
              fontSize: '16px',
              fontWeight: 700,
              cursor: submitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              boxShadow: submitting ? 'none' : '0 4px 16px rgba(26,127,90,0.3)',
            }}
          >
            {submitting ? (
              <>
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2.5px solid var(--text-muted)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
                Invio in corso...
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                Invia check-in
              </>
            )}
          </button>

        </form>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--green-main);
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }
        input[type=range]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--green-main);
          cursor: pointer;
          border: 2px solid #fff;
        }
      `}</style>
    </PageTransition>
  )
}
