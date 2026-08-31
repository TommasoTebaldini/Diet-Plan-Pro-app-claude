import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase, getMyDietitianId } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useAchievements } from '../context/AchievementsContext'
import { CheckCircle, ChevronRight, AlertCircle } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import { useT } from '../i18n'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getWeekStart(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = (day === 0 ? -6 : 1 - day) // Monday = start
  d.setDate(d.getDate() + diff)
  // toISOString() converte in UTC, spostando la data indietro di un giorno
  // per chiunque sia in un fuso orario positivo (es. l'Italia) — costruire
  // la stringa a mano dai componenti locali della data, come altrove
  // nell'app (vedi localDateStr in agenda.html/DietitianDetailPage.jsx).
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

function getAdherenceOptions(t) {
  return [
    { value: 'sempre', label: t('checkin.aderenza_sempre', 'Sempre'), color: '#1a7f5a', bg: '#e8f5ee' },
    { value: 'spesso', label: t('checkin.aderenza_spesso', 'Spesso'), color: '#2563eb', bg: '#eff6ff' },
    { value: 'a_volte', label: t('checkin.aderenza_a_volte', 'A volte'), color: '#d97706', bg: '#fff7ed' },
    { value: 'raramente', label: t('checkin.aderenza_raramente', 'Raramente'), color: '#dc2626', bg: '#fff0f0' },
    { value: 'mai', label: t('checkin.aderenza_mai', 'Mai'), color: '#6b7280', bg: '#f9fafb' },
  ]
}

function getMotivationalMessages(t) {
  return [
    t('checkin.motiv_1', 'Ottimo lavoro! Ogni check-in ti avvicina ai tuoi obiettivi. 💪'),
    t('checkin.motiv_2', 'Continuità è la chiave del successo. Sei sulla strada giusta! 🌟'),
    t('checkin.motiv_3', 'Grazie per la tua onestà. Il tuo dietista ti supporta in ogni passo. 🤝'),
    t('checkin.motiv_4', 'Analizzare la settimana è il primo passo per migliorare. Bravissimo/a! 🎯'),
  ]
}

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
  const t = useT()
  const pct = ((value - 1) / 9) * 100
  const color = value <= 3 ? '#dc2626' : value <= 6 ? '#d97706' : '#1a7f5a'
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t('checkin.per_niente_soddisfatto', 'Per niente soddisfatto')}</span>
        <span style={{
          fontSize: '22px',
          fontWeight: 800,
          color,
          minWidth: '40px',
          textAlign: 'center',
        }}>
          {value}
        </span>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t('checkin.molto_soddisfatto', 'Molto soddisfatto')}</span>
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
  const t = useT()
  const { user } = useAuth()
  const { checkAndAward } = useAchievements()

  const weekStart = getWeekStart()
  const adherenceOptions = getAdherenceOptions(t)

  const [alreadyDone, setAlreadyDone] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [motivMsg] = useState(() => {
    const messages = getMotivationalMessages(t)
    return messages[Math.floor(Math.random() * messages.length)]
  })

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
      setError(t('checkin.errore_campi_obbligatori', 'Per favore completa tutte le sezioni obbligatorie.'))
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

      // Da qui in poi il check-in è già salvato: un fallimento nel messaggio
      // in chat o nel badge non deve più far apparire un errore generico
      // all'utente. Prima, un paziente senza dietista collegato (dietitianId
      // null) faceva fallire l'insert in chat_messages (dietitian_id NOT
      // NULL nello schema) e l'intero submit sembrava fallito nonostante il
      // check-in fosse già scritto — un reinvio poi urtava il vincolo
      // UNIQUE(user_id, week_start_date) con un errore grezzo invece della
      // schermata "già inviato".
      if (messageToDietitian.trim()) {
        try {
          const dietitianId = await getMyDietitianId(user.id)
          if (dietitianId) {
            await supabase.from('chat_messages').insert({
              patient_id: user.id,
              dietitian_id: dietitianId,
              sender_role: 'patient',
              sender_id: user.id,
              content: t('checkin.msg_prefix_chat', { msg: messageToDietitian.trim() }, '📊 Check-in settimanale: {{msg}}'),
              message_type: 'text',
            })
          }
        } catch (chatErr) {
          console.warn('Checkin: invio messaggio in chat fallito (check-in comunque salvato):', chatErr.message)
        }
      }

      // Award badge — anche questo non deve bloccare la conferma del check-in
      try {
        await checkAndAward('first_checkin')
      } catch (badgeErr) {
        console.warn('Checkin: assegnazione badge fallita:', badgeErr.message)
      }

      setSubmitted(true)
    } catch (err) {
      setError(err.message || t('checkin.errore_generico', 'Si è verificato un errore. Riprova.'))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <PageTransition>
        <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60dvh' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid var(--border-light)', borderTopColor: 'var(--green-main)', animation: 'spin 0.8s linear infinite' }} />
        </div>
      </PageTransition>
    )
  }

  if (alreadyDone) {
    return (
      <PageTransition>
        <div className="page" style={{ padding: '24px 16px', textAlign: 'center', minHeight: '60dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <div style={{ fontSize: '64px' }}>✅</div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            {t('checkin.gia_completato_titolo', 'Check-in già completato')}
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', maxWidth: '300px', lineHeight: 1.5, margin: 0 }}>
            {t('checkin.gia_completato_testo', { weekStart }, 'Hai già inviato il check-in per questa settimana (dal {{weekStart}}). Torna la prossima settimana!')}
          </p>
        </div>
      </PageTransition>
    )
  }

  if (submitted) {
    return (
      <PageTransition>
        <div className="page" style={{ padding: '40px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
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
              {t('checkin.completato_titolo', 'Check-in completato!')}
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
              {t('checkin.dietista_visualizza', 'Il tuo dietista potrà visualizzare questo check-in nel suo pannello. Continua così!')}
            </div>
          </motion.div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="page" style={{ padding: '0 0 calc(var(--nav) + 32px)', background: 'var(--surface-2)', minHeight: '100dvh' }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0a4a2e 0%, #1a7f5a 100%)',
          padding: '48px 20px 24px',
          color: '#fff',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>📋</div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 6px', fontFamily: 'var(--font-d)' }}>
            {t('checkin.titolo_pagina', 'Check-in Settimanale')}
          </h1>
          <p style={{ fontSize: '13px', opacity: 0.8, margin: 0 }}>
            {t('checkin.settimana_dal', { data: new Date(weekStart + 'T00:00:00').toLocaleDateString('it-IT', { day: 'numeric', month: 'long' }) }, 'Settimana dal {{data}}')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '16px 14px' }}>

          {/* 1. Soddisfazione generale */}
          <Section number="1" title={t('checkin.sezione1_titolo', 'Come è andata questa settimana?')}>
            <SatisfactionSlider value={satisfaction} onChange={setSatisfaction} />
          </Section>

          {/* 2. Aderenza al piano */}
          <Section number="2" title={t('checkin.sezione2_titolo', 'Hai seguito il piano alimentare?')}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {adherenceOptions.map(opt => (
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
          <Section number="3" title={t('checkin.sezione3_titolo', 'Peso attuale (opzionale)')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="number"
                step="0.1"
                min="30"
                max="300"
                placeholder={t('checkin.peso_placeholder', 'es. 72.5')}
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
          <Section number="4" title={t('checkin.sezione4_titolo', 'Come ti sei sentito/a fisicamente?')}>
            <RatingRow
              label={t('checkin.energia', 'Energia')}
              value={energy}
              onChange={setEnergy}
              emojis={['🪫', '😴', '😐', '⚡', '🚀']}
            />
            <RatingRow
              label={t('checkin.qualita_sonno', 'Qualità del sonno')}
              value={sleepQuality}
              onChange={setSleepQuality}
              emojis={['😫', '😔', '😐', '😴', '🌟']}
            />
            <RatingRow
              label={t('checkin.livello_stress', 'Livello di stress')}
              value={stress}
              onChange={setStress}
              emojis={['😌', '🙂', '😐', '😰', '😤']}
            />
          </Section>

          {/* 5. Difficoltà */}
          <Section number="5" title={t('checkin.sezione5_titolo', 'Difficoltà incontrate (opzionale)')}>
            <textarea
              placeholder={t('checkin.difficolta_placeholder', 'Descrivi eventuali difficoltà nella settimana...')}
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
          <Section number="6" title={t('checkin.sezione6_titolo', 'Obiettivo per la prossima settimana (opzionale)')}>
            <textarea
              placeholder={t('checkin.obiettivo_placeholder', 'Cosa vuoi migliorare o raggiungere la prossima settimana?')}
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
          <Section number="7" title={t('checkin.sezione7_titolo', 'Messaggio al dietista (opzionale)')}>
            <textarea
              placeholder={t('checkin.messaggio_placeholder', 'Vuoi comunicare qualcosa al tuo dietista? (verrà inviato anche in chat)')}
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
                {t('checkin.messaggio_info_chat', 'Il messaggio verrà inviato al tuo dietista anche nella chat.')}
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
                {t('checkin.invio_in_corso', 'Invio in corso...')}
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                {t('checkin.invia', 'Invia check-in')}
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
