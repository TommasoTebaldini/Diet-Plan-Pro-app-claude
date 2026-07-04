import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import AchievementToast from '../components/AchievementToast'

// ─── Badge definitions ────────────────────────────────────────────────────────
export const ALL_ACHIEVEMENTS = [
  // Diario
  {
    key: 'first_food_log',
    name: 'Prima registrazione',
    description: 'Hai registrato il tuo primo pasto nel diario alimentare.',
    icon: '📝',
    category: 'Diario',
  },
  {
    key: 'streak_3',
    name: '3 giorni di fila',
    description: 'Hai registrato pasti per 3 giorni consecutivi.',
    icon: '🔥',
    category: 'Diario',
  },
  {
    key: 'streak_7',
    name: '7 giorni di fila',
    description: 'Una settimana intera di registrazioni consecutive!',
    icon: '🌟',
    category: 'Diario',
  },
  {
    key: 'streak_30',
    name: '30 giorni di fila',
    description: 'Un mese intero di costanza. Sei straordinario/a!',
    icon: '🏆',
    category: 'Diario',
  },
  // Acqua
  {
    key: 'water_goal',
    name: 'Idratato',
    description: 'Hai raggiunto il tuo obiettivo giornaliero di acqua.',
    icon: '💧',
    category: 'Acqua',
  },
  {
    key: 'water_week',
    name: 'Settimana idratata',
    description: 'Hai raggiunto il goal idrico per 7 giorni di fila.',
    icon: '🌊',
    category: 'Acqua',
  },
  // Peso
  {
    key: 'first_weight',
    name: 'Prima pesata',
    description: 'Hai registrato il tuo primo peso.',
    icon: '⚖️',
    category: 'Peso',
  },
  {
    key: 'first_weight_loss',
    name: 'Prima perdita di peso',
    description: 'Hai registrato la tua prima diminuzione di peso.',
    icon: '📉',
    category: 'Peso',
  },
  {
    key: 'lost_1kg',
    name: '-1 kg',
    description: 'Hai perso il tuo primo chilogrammo. Ottimo lavoro!',
    icon: '🎯',
    category: 'Peso',
  },
  {
    key: 'lost_5kg',
    name: '-5 kg',
    description: 'Hai perso 5 kg dal tuo punto di partenza. Incredibile!',
    icon: '🥇',
    category: 'Peso',
  },
  // Benessere
  {
    key: 'first_checkin',
    name: 'Primo check-in umore',
    description: 'Hai completato il tuo primo check-in settimanale.',
    icon: '😊',
    category: 'Benessere',
  },
  {
    key: 'wellness_week',
    name: 'Settimana di benessere',
    description: 'Hai registrato il benessere per 7 giorni consecutivi.',
    icon: '🧘',
    category: 'Benessere',
  },
  // Ricette
  {
    key: 'first_recipe',
    name: 'Prima ricetta creata',
    description: 'Hai creato la tua prima ricetta personalizzata.',
    icon: '🍳',
    category: 'Ricette',
  },
  {
    key: 'chef_novizio',
    name: 'Chef novizio',
    description: 'Hai creato 5 ricette personalizzate.',
    icon: '👨‍🍳',
    category: 'Ricette',
  },
  // Attività
  {
    key: 'first_activity',
    name: 'Prima attività',
    description: 'Hai registrato la tua prima attività fisica.',
    icon: '🏃',
    category: 'Attività',
  },
  {
    key: 'steps_10000',
    name: '10.000 passi',
    description: 'Hai raggiunto i 10.000 passi in un giorno.',
    icon: '👟',
    category: 'Attività',
  },
  // Social
  {
    key: 'first_dietitian_message',
    name: 'Primo messaggio al dietista',
    description: 'Hai inviato il tuo primo messaggio al dietista.',
    icon: '💬',
    category: 'Social',
  },
  // Engagement
  {
    key: 'app_streak_7',
    name: '7 giorni sull\'app',
    description: 'Hai aperto l\'app per 7 giorni di fila.',
    icon: '📱',
    category: 'Engagement',
  },
  {
    key: 'logins_30',
    name: '30 accessi',
    description: 'Hai effettuato 30 accessi all\'app.',
    icon: '🎖️',
    category: 'Engagement',
  },
  // Quiz
  {
    key: 'quiz_streak_3',
    name: 'Quiz 3 giorni',
    description: 'Hai completato il quiz per 3 giorni di fila.',
    icon: '🎯',
    category: 'Quiz',
  },
  {
    key: 'quiz_streak_7',
    name: 'Quiz 7 giorni',
    description: 'Una settimana intera di quiz consecutivi!',
    icon: '🧠',
    category: 'Quiz',
  },
  {
    key: 'quiz_streak_14',
    name: 'Quiz 2 settimane',
    description: 'Due settimane di quiz senza interruzioni. Bravo/a!',
    icon: '💡',
    category: 'Quiz',
  },
  {
    key: 'quiz_streak_30',
    name: 'Quiz un mese',
    description: 'Un mese di quiz ogni giorno. Sei un esperto!',
    icon: '🏆',
    category: 'Quiz',
  },
  // Speciali
  {
    key: 'onboarding_complete',
    name: 'Nuovo inizio',
    description: 'Hai completato l\'onboarding. Benvenuto/a nel tuo percorso!',
    icon: '🚀',
    category: 'Speciali',
  },
  {
    key: 'profile_complete',
    name: 'Profilo completo',
    description: 'Hai completato il tuo profilo con tutte le informazioni.',
    icon: '✅',
    category: 'Speciali',
  },
]

const AchievementsContext = createContext({})

export function AchievementsProvider({ children }) {
  const { user } = useAuth()
  const [earned, setEarned] = useState({}) // { key: earned_at }
  const earnedRef = useRef({})
  const [toastQueue, setToastQueue] = useState([])
  const [currentToast, setCurrentToast] = useState(null)
  const processingToast = useRef(false)

  // Keep earnedRef in sync so checkAndAward can read it without being in its dep array
  useEffect(() => { earnedRef.current = earned }, [earned])

  // Load earned achievements from Supabase
  useEffect(() => {
    if (!user) { setEarned({}); return }
    const load = async () => {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('achievement_key, earned_at')
        .eq('user_id', user.id)
      if (!error && data) {
        const map = {}
        data.forEach(row => { map[row.achievement_key] = row.earned_at })
        setEarned(map)
      }
    }
    load()
  }, [user])

  // Process toast queue
  useEffect(() => {
    if (currentToast || toastQueue.length === 0) return
    const [next, ...rest] = toastQueue
    setCurrentToast(next)
    setToastQueue(rest)
  }, [toastQueue, currentToast])

  const dismissToast = useCallback(() => {
    setCurrentToast(null)
  }, [])

  const checkAndAward = useCallback(async (key) => {
    if (!user) return
    if (earnedRef.current[key]) return // already earned

    const achievement = ALL_ACHIEVEMENTS.find(a => a.key === key)
    if (!achievement) return

    const { error } = await supabase
      .from('user_achievements')
      .insert({ user_id: user.id, achievement_key: key })

    if (!error) {
      const now = new Date().toISOString()
      setEarned(prev => ({ ...prev, [key]: now }))
      setToastQueue(prev => [...prev, achievement])
    }
  }, [user])

  const getProgress = useCallback((key) => {
    return earned[key] ? { earned: true, earned_at: earned[key] } : { earned: false }
  }, [earned])

  return (
    <AchievementsContext.Provider value={{
      achievements: ALL_ACHIEVEMENTS,
      earned,
      checkAndAward,
      getProgress,
    }}>
      {children}
      {currentToast && (
        <AchievementToast
          achievement={currentToast}
          onDismiss={dismissToast}
        />
      )}
    </AchievementsContext.Provider>
  )
}

export function useAchievements() {
  return useContext(AchievementsContext)
}
