import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Utensils, Droplets, Bell, CheckCircle, Target, User, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useAchievements } from '../context/AchievementsContext'
import { supabase } from '../lib/supabase'
import { useT } from '../i18n'

export default function OnboardingFlow({ onComplete }) {
  const { user, refreshProfile } = useAuth()
  const { checkAndAward } = useAchievements()
  const t = useT()
  const [step, setStep] = useState(0)
  const [selectedGoal, setSelectedGoal] = useState('')
  const [notifStatus, setNotifStatus] = useState(null) // null | 'granted' | 'denied'

  const STEPS = [
    {
      id: 'welcome',
      icon: '🥗',
      title: t('onboarding.welcome.title', 'Benvenuto in NutriPlan!'),
      subtitle: t('onboarding.welcome.subtitle', 'Ti guidiamo in 5 minuti attraverso le funzioni principali per iniziare al meglio il tuo percorso.'),
      cta: t('onboarding.welcome.cta', 'Iniziamo'),
      showSkip: true,
    },
    {
      id: 'goal',
      icon: null,
      lucideIcon: Target,
      title: t('onboarding.goal.title', 'Qual è il tuo obiettivo?'),
      subtitle: t('onboarding.goal.subtitle', 'Scegli l\'obiettivo principale del tuo piano nutrizionale.'),
      cta: t('onboarding.goal.cta', 'Avanti'),
      showSkip: false,
      isGoal: true,
    },
    {
      id: 'dietitian',
      icon: '👨‍⚕️',
      title: t('onboarding.dietitian.title', 'Trova il tuo professionista'),
      subtitle: t('onboarding.dietitian.subtitle', 'Collegati al tuo dietista di fiducia oppure esplora i professionisti disponibili su NutriPlan per essere seguito passo dopo passo nel tuo percorso.'),
      cta: t('onboarding.dietitian.cta', 'Avanti'),
      showSkip: false,
      infoNote: t('onboarding.dietitian.infoNote', 'Vai nella sezione "Dietisti" della dashboard per cercare un professionista o collegare il tuo dietista.'),
    },
    {
      id: 'diary',
      icon: null,
      lucideIcon: Utensils,
      title: t('onboarding.diary.title', 'Diario alimentare'),
      subtitle: t('onboarding.diary.subtitle', 'Registra ogni pasto in pochi secondi. NutriPlan traccia automaticamente calorie, proteine, carboidrati e grassi per aiutarti a rispettare il piano.'),
      cta: t('onboarding.diary.cta', 'Avanti'),
      showSkip: false,
    },
    {
      id: 'water',
      icon: null,
      lucideIcon: Droplets,
      title: t('onboarding.water.title', 'Acqua & Benessere'),
      subtitle: t('onboarding.water.subtitle', 'Monitora la tua idratazione giornaliera e registra il tuo umore. Piccole abitudini quotidiane fanno grandi differenze nel tempo.'),
      cta: t('onboarding.water.cta', 'Avanti'),
      showSkip: false,
    },
    {
      id: 'notifications',
      icon: null,
      lucideIcon: Bell,
      title: t('onboarding.notifications.title', 'Attiva le notifiche'),
      subtitle: t('onboarding.notifications.subtitle', 'Ti ricordiamo i pasti e l\'idratazione al momento giusto, così non dimentichi mai di registrare la tua giornata.'),
      cta: t('onboarding.notifications.cta', 'Attiva notifiche'),
      showSkip: false,
      isNotification: true,
    },
    {
      id: 'ready',
      icon: null,
      lucideIcon: CheckCircle,
      title: t('onboarding.ready.title', 'Tutto pronto! 🎉'),
      subtitle: t('onboarding.ready.subtitle', 'Hai tutto ciò che serve per iniziare. Registra i tuoi pasti, monitora il benessere e traccia i progressi — ogni piccolo passo conta!'),
      cta: t('onboarding.ready.cta', 'Inizia'),
      showSkip: false,
      isFinal: true,
    },
  ]

  const GOALS = [
    { value: 'lose', label: t('onboarding.goal.lose.label', '⬇️ Perdere peso'), desc: t('onboarding.goal.lose.desc', 'Ridurre il peso corporeo in modo sano') },
    { value: 'maintain', label: t('onboarding.goal.maintain.label', '⚖️ Mantenere il peso'), desc: t('onboarding.goal.maintain.desc', 'Mantenere il peso attuale con equilibrio') },
    { value: 'gain', label: t('onboarding.goal.gain.label', '⬆️ Aumentare la massa'), desc: t('onboarding.goal.gain.desc', 'Sviluppare massa muscolare magra') },
  ]

  const current = STEPS[step]
  const totalSteps = STEPS.length

  function handleNext() {
    if (current.isGoal && selectedGoal) {
      localStorage.setItem('onboarding_goal', selectedGoal)
      // Persistenza server-side (profiles.nutrition_goal): prima restava solo
      // in localStorage e non veniva mai letta da nessuna parte — best-effort,
      // non deve mai bloccare l'avanzamento dell'onboarding.
      if (user) {
        supabase.from('profiles').update({ nutrition_goal: selectedGoal }).eq('id', user.id)
          .then(({ error }) => {
            if (error) console.error('Salvataggio obiettivo onboarding fallito:', error)
            else refreshProfile()
          })
      }
    }
    if (current.isNotification && notifStatus === null) {
      // Request permission and show the feedback message below — do NOT
      // advance yet, or the granted/denied message never gets a chance to
      // render (setNotifStatus + advanceStep in the same tick means React
      // has already moved past this step by the time it paints). The user
      // taps the CTA a second time (now "Continua", see the button label
      // below) once notifStatus is set.
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(perm => {
          setNotifStatus(perm)
        })
        return
      }
      setNotifStatus(Notification.permission)
      return
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
    checkAndAward('onboarding_complete').catch(() => {})
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
            aria-label={t('onboarding.skipAriaLabel', 'Salta onboarding')}
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
                  ? t('onboarding.notifGranted', '✅ Notifiche attivate!')
                  : t('onboarding.notifDenied', '⚠️ Potrai attivarle in seguito dalle impostazioni.')}
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
            {current.isNotification && notifStatus !== null ? t('onboarding.continueCta', 'Continua') : current.cta}
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
              {t('onboarding.skipIntro', 'Salta introduzione')}
            </button>
          )}

          {/* Step counter */}
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>
            {t('onboarding.stepCounter', { current: step + 1, total: totalSteps }, '{{current}} di {{total}}')}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
