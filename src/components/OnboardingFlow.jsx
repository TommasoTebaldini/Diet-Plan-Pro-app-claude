import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Utensils, Droplets, Bell, CheckCircle, Target, User, X } from 'lucide-react'

const STEPS = [
  {
    id: 'welcome',
    icon: '🥗',
    title: 'Benvenuto in NutriPlan!',
    subtitle: 'Ti guidiamo in 5 minuti attraverso le funzioni principali per iniziare al meglio il tuo percorso.',
    cta: 'Iniziamo',
    showSkip: true,
  },
  {
    id: 'goal',
    icon: null,
    lucideIcon: Target,
    title: 'Qual è il tuo obiettivo?',
    subtitle: 'Scegli l\'obiettivo principale del tuo piano nutrizionale.',
    cta: 'Avanti',
    showSkip: false,
    isGoal: true,
  },
  {
    id: 'dietitian',
    icon: '👨‍⚕️',
    title: 'Il tuo dietista è pronto',
    subtitle: 'Il tuo dietista ha già preparato un piano personalizzato per te. Ogni pasto è calibrato sui tuoi obiettivi e le tue preferenze.',
    cta: 'Guarda il tuo piano',
    showSkip: false,
    infoNote: 'Il piano è disponibile nella sezione "Dieta" della dashboard.',
  },
  {
    id: 'diary',
    icon: null,
    lucideIcon: Utensils,
    title: 'Diario alimentare',
    subtitle: 'Registra ogni pasto in pochi secondi. NutriPlan traccia automaticamente calorie, proteine, carboidrati e grassi per aiutarti a rispettare il piano.',
    cta: 'Avanti',
    showSkip: false,
  },
  {
    id: 'water',
    icon: null,
    lucideIcon: Droplets,
    title: 'Acqua & Benessere',
    subtitle: 'Monitora la tua idratazione giornaliera e registra il tuo umore. Piccole abitudini quotidiane fanno grandi differenze nel tempo.',
    cta: 'Avanti',
    showSkip: false,
  },
  {
    id: 'notifications',
    icon: null,
    lucideIcon: Bell,
    title: 'Attiva le notifiche',
    subtitle: 'Ti ricordiamo i pasti e l\'idratazione al momento giusto, così non dimentichi mai di registrare la tua giornata.',
    cta: 'Attiva notifiche',
    showSkip: false,
    isNotification: true,
  },
  {
    id: 'ready',
    icon: null,
    lucideIcon: CheckCircle,
    title: 'Tutto pronto! 🎉',
    subtitle: 'Hai tutto ciò che serve per iniziare il tuo percorso verso il benessere. Il tuo piano ti aspetta — sei già un passo avanti!',
    cta: 'Inizia',
    showSkip: false,
    isFinal: true,
  },
]

const GOALS = [
  { value: 'lose', label: '⬇️ Perdere peso', desc: 'Ridurre il peso corporeo in modo sano' },
  { value: 'maintain', label: '⚖️ Mantenere il peso', desc: 'Mantenere il peso attuale con equilibrio' },
  { value: 'gain', label: '⬆️ Aumentare la massa', desc: 'Sviluppare massa muscolare magra' },
]

export default function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0)
  const [selectedGoal, setSelectedGoal] = useState('')
  const [notifStatus, setNotifStatus] = useState(null) // null | 'granted' | 'denied'

  const current = STEPS[step]
  const totalSteps = STEPS.length

  function handleNext() {
    if (current.isGoal && selectedGoal) {
      localStorage.setItem('onboarding_goal', selectedGoal)
    }
    if (current.isNotification && notifStatus === null) {
      // Try to request permission, then advance
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(perm => {
          setNotifStatus(perm)
          advanceStep()
        })
        return
      }
      setNotifStatus(Notification.permission)
    }
    advanceStep()
  }

  function advanceStep() {
    if (step < totalSteps - 1) {
      setStep(s => s + 1)
    }
  }

  function handleComplete() {
    localStorage.setItem('onboarding_done', '1')
    onComplete()
  }

  function handleSkip() {
    localStorage.setItem('onboarding_done', '1')
    onComplete()
  }

  const LucideIcon = current.lucideIcon

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.75)',
      zIndex: 9000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 16px',
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -18, scale: 0.97 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '100%',
            maxWidth: 380,
            background: 'var(--surface)',
            borderRadius: 20,
            padding: '32px 24px 28px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
            position: 'relative',
          }}
        >
          {/* Skip button top-right */}
          <button
            onClick={handleSkip}
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
            }}
            aria-label="Salta onboarding"
          >
            <X size={18} />
          </button>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 28 }}>
            {STEPS.map((_, i) => (
              <div
                key={i}
                style={{
                  height: 6,
                  width: i === step ? 22 : 6,
                  borderRadius: 3,
                  background: i <= step ? 'var(--green-main)' : 'var(--border-light)',
                  transition: 'width 0.3s ease, background 0.3s ease',
                }}
              />
            ))}
          </div>

          {/* Icon */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            {current.icon ? (
              <span style={{ fontSize: 52, lineHeight: 1 }}>{current.icon}</span>
            ) : (
              <div style={{
                width: 72,
                height: 72,
                borderRadius: 22,
                background: 'var(--green-pale)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {LucideIcon && <LucideIcon size={32} color="var(--green-main)" strokeWidth={1.6} />}
              </div>
            )}
          </div>

          {/* Title */}
          <h2 style={{
            fontSize: 22,
            fontFamily: 'var(--font-d)',
            fontWeight: 500,
            color: 'var(--text-primary)',
            textAlign: 'center',
            lineHeight: 1.25,
            marginBottom: 10,
          }}>
            {current.title}
          </h2>

          {/* Subtitle */}
          <p style={{
            fontSize: 14,
            color: 'var(--text-muted)',
            textAlign: 'center',
            lineHeight: 1.6,
            marginBottom: current.isGoal ? 20 : 28,
          }}>
            {current.subtitle}
          </p>

          {/* Info note */}
          {current.infoNote && (
            <div style={{
              background: 'var(--green-pale)',
              borderRadius: 10,
              padding: '10px 14px',
              marginBottom: 24,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
            }}>
              <span style={{ fontSize: 14 }}>💡</span>
              <p style={{ fontSize: 13, color: 'var(--green-dark)', lineHeight: 1.5 }}>{current.infoNote}</p>
            </div>
          )}

          {/* Goal selector */}
          {current.isGoal && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {GOALS.map(g => (
                <button
                  key={g.value}
                  onClick={() => setSelectedGoal(g.value)}
                  style={{
                    background: selectedGoal === g.value ? 'var(--green-pale)' : 'var(--surface-2)',
                    border: selectedGoal === g.value
                      ? '2px solid var(--green-main)'
                      : '2px solid var(--border-light)',
                    borderRadius: 12,
                    padding: '12px 14px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{g.label}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{g.desc}</p>
                </button>
              ))}
            </div>
          )}

          {/* Notification status feedback */}
          {current.isNotification && notifStatus && (
            <div style={{
              background: notifStatus === 'granted' ? 'var(--alert-success-bg)' : 'var(--alert-warning-bg)',
              border: `1px solid ${notifStatus === 'granted' ? 'var(--alert-success-border)' : 'var(--alert-warning-border)'}`,
              borderRadius: 10,
              padding: '10px 14px',
              marginBottom: 20,
              textAlign: 'center',
            }}>
              <p style={{
                fontSize: 13,
                color: notifStatus === 'granted' ? 'var(--alert-success-text)' : 'var(--alert-warning-text)',
                fontWeight: 500,
              }}>
                {notifStatus === 'granted'
                  ? '✅ Notifiche attivate!'
                  : '⚠️ Potrai attivarle in seguito dalle impostazioni.'}
              </p>
            </div>
          )}

          {/* CTA button */}
          <button
            onClick={current.isFinal ? handleComplete : handleNext}
            disabled={current.isGoal && !selectedGoal}
            style={{
              width: '100%',
              padding: '14px',
              background: current.isGoal && !selectedGoal
                ? 'var(--border-light)'
                : 'var(--green-main)',
              color: current.isGoal && !selectedGoal ? 'var(--text-muted)' : 'white',
              border: 'none',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              cursor: current.isGoal && !selectedGoal ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s ease, transform 0.1s ease',
              letterSpacing: '0.01em',
            }}
          >
            {current.cta}
          </button>

          {/* Skip text link on first step */}
          {current.showSkip && (
            <button
              onClick={handleSkip}
              style={{
                width: '100%',
                marginTop: 12,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                fontSize: 13,
                padding: '6px',
              }}
            >
              Salta introduzione
            </button>
          )}

          {/* Step counter */}
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>
            {step + 1} di {totalSteps}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
