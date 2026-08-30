import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import AchievementToast from '../components/AchievementToast'
import { checkWaterAchievements, checkWellnessAchievements } from '../lib/achievementTriggers'

// ─── Badge definitions ────────────────────────────────────────────────────────
// name/description restano il fallback italiano; nameKey/descKey sono le
// chiavi i18n usate a runtime dai componenti che le rendono visibili
// (BadgesPage.jsx, AchievementToast.jsx) perché qui, fuori da un componente
// React, l'hook useT() non è disponibile.
export const ALL_ACHIEVEMENTS = [
  // Diario
  {
    key: 'first_food_log',
    name: 'Prima registrazione',
    nameKey: 'achievement.first_food_log_name',
    description: 'Hai registrato il tuo primo pasto nel diario alimentare.',
    descKey: 'achievement.first_food_log_desc',
    icon: '📝',
    category: 'Diario',
  },
  {
    key: 'streak_3',
    name: '3 giorni di fila',
    nameKey: 'achievement.streak_3_name',
    description: 'Hai registrato pasti per 3 giorni consecutivi.',
    descKey: 'achievement.streak_3_desc',
    icon: '🔥',
    category: 'Diario',
  },
  {
    key: 'streak_7',
    name: '7 giorni di fila',
    nameKey: 'achievement.streak_7_name',
    description: 'Una settimana intera di registrazioni consecutive!',
    descKey: 'achievement.streak_7_desc',
    icon: '🌟',
    category: 'Diario',
  },
  {
    key: 'streak_30',
    name: '30 giorni di fila',
    nameKey: 'achievement.streak_30_name',
    description: 'Un mese intero di costanza. Sei straordinario/a!',
    descKey: 'achievement.streak_30_desc',
    icon: '🏆',
    category: 'Diario',
  },
  // Acqua
  {
    key: 'water_goal',
    name: 'Idratato',
    nameKey: 'achievement.water_goal_name',
    description: 'Hai raggiunto il tuo obiettivo giornaliero di acqua.',
    descKey: 'achievement.water_goal_desc',
    icon: '💧',
    category: 'Acqua',
  },
  {
    key: 'water_week',
    name: 'Settimana idratata',
    nameKey: 'achievement.water_week_name',
    description: 'Hai raggiunto il goal idrico per 7 giorni di fila.',
    descKey: 'achievement.water_week_desc',
    icon: '🌊',
    category: 'Acqua',
  },
  // Peso
  {
    key: 'first_weight',
    name: 'Prima pesata',
    nameKey: 'achievement.first_weight_name',
    description: 'Hai registrato il tuo primo peso.',
    descKey: 'achievement.first_weight_desc',
    icon: '⚖️',
    category: 'Peso',
  },
  {
    key: 'first_weight_loss',
    name: 'Prima perdita di peso',
    nameKey: 'achievement.first_weight_loss_name',
    description: 'Hai registrato la tua prima diminuzione di peso.',
    descKey: 'achievement.first_weight_loss_desc',
    icon: '📉',
    category: 'Peso',
  },
  {
    key: 'lost_1kg',
    name: '-1 kg',
    nameKey: 'achievement.lost_1kg_name',
    description: 'Hai perso il tuo primo chilogrammo. Ottimo lavoro!',
    descKey: 'achievement.lost_1kg_desc',
    icon: '🎯',
    category: 'Peso',
  },
  {
    key: 'lost_5kg',
    name: '-5 kg',
    nameKey: 'achievement.lost_5kg_name',
    description: 'Hai perso 5 kg dal tuo punto di partenza. Incredibile!',
    descKey: 'achievement.lost_5kg_desc',
    icon: '🥇',
    category: 'Peso',
  },
  // Benessere
  {
    key: 'first_checkin',
    name: 'Primo check-in umore',
    nameKey: 'achievement.first_checkin_name',
    description: 'Hai completato il tuo primo check-in settimanale.',
    descKey: 'achievement.first_checkin_desc',
    icon: '😊',
    category: 'Benessere',
  },
  {
    key: 'wellness_week',
    name: 'Settimana di benessere',
    nameKey: 'achievement.wellness_week_name',
    description: 'Hai registrato il benessere per 7 giorni consecutivi.',
    descKey: 'achievement.wellness_week_desc',
    icon: '🧘',
    category: 'Benessere',
  },
  // Ricette
  {
    key: 'first_recipe',
    name: 'Prima ricetta creata',
    nameKey: 'achievement.first_recipe_name',
    description: 'Hai creato la tua prima ricetta personalizzata.',
    descKey: 'achievement.first_recipe_desc',
    icon: '🍳',
    category: 'Ricette',
  },
  {
    key: 'chef_novizio',
    name: 'Chef novizio',
    nameKey: 'achievement.chef_novizio_name',
    description: 'Hai creato 5 ricette personalizzate.',
    descKey: 'achievement.chef_novizio_desc',
    icon: '👨‍🍳',
    category: 'Ricette',
  },
  // Attività
  {
    key: 'first_activity',
    name: 'Prima attività',
    nameKey: 'achievement.first_activity_name',
    description: 'Hai registrato la tua prima attività fisica.',
    descKey: 'achievement.first_activity_desc',
    icon: '🏃',
    category: 'Attività',
  },
  {
    key: 'steps_10000',
    name: '10.000 passi',
    nameKey: 'achievement.steps_10000_name',
    description: 'Hai raggiunto i 10.000 passi in un giorno.',
    descKey: 'achievement.steps_10000_desc',
    icon: '👟',
    category: 'Attività',
  },
  // Social
  {
    key: 'first_dietitian_message',
    name: 'Primo messaggio al dietista',
    nameKey: 'achievement.first_dietitian_message_name',
    description: 'Hai inviato il tuo primo messaggio al dietista.',
    descKey: 'achievement.first_dietitian_message_desc',
    icon: '💬',
    category: 'Social',
  },
  // Engagement
  {
    key: 'app_streak_7',
    name: '7 giorni sull\'app',
    nameKey: 'achievement.app_streak_7_name',
    description: 'Hai aperto l\'app per 7 giorni di fila.',
    descKey: 'achievement.app_streak_7_desc',
    icon: '📱',
    category: 'Engagement',
  },
  {
    key: 'logins_30',
    name: '30 accessi',
    nameKey: 'achievement.logins_30_name',
    description: 'Hai effettuato 30 accessi all\'app.',
    descKey: 'achievement.logins_30_desc',
    icon: '🎖️',
    category: 'Engagement',
  },
  // Quiz
  {
    key: 'quiz_streak_3',
    name: 'Quiz 3 giorni',
    nameKey: 'achievement.quiz_streak_3_name',
    description: 'Hai completato il quiz per 3 giorni di fila.',
    descKey: 'achievement.quiz_streak_3_desc',
    icon: '🎯',
    category: 'Quiz',
  },
  {
    key: 'quiz_streak_7',
    name: 'Quiz 7 giorni',
    nameKey: 'achievement.quiz_streak_7_name',
    description: 'Una settimana intera di quiz consecutivi!',
    descKey: 'achievement.quiz_streak_7_desc',
    icon: '🧠',
    category: 'Quiz',
  },
  {
    key: 'quiz_streak_14',
    name: 'Quiz 2 settimane',
    nameKey: 'achievement.quiz_streak_14_name',
    description: 'Due settimane di quiz senza interruzioni. Bravo/a!',
    descKey: 'achievement.quiz_streak_14_desc',
    icon: '💡',
    category: 'Quiz',
  },
  {
    key: 'quiz_streak_30',
    name: 'Quiz un mese',
    nameKey: 'achievement.quiz_streak_30_name',
    description: 'Un mese di quiz ogni giorno. Sei un esperto!',
    descKey: 'achievement.quiz_streak_30_desc',
    icon: '🏆',
    category: 'Quiz',
  },
  // Speciali
  {
    key: 'onboarding_complete',
    name: 'Nuovo inizio',
    nameKey: 'achievement.onboarding_complete_name',
    description: 'Hai completato l\'onboarding. Benvenuto/a nel tuo percorso!',
    descKey: 'achievement.onboarding_complete_desc',
    icon: '🚀',
    category: 'Speciali',
  },
  {
    key: 'profile_complete',
    name: 'Profilo completo',
    nameKey: 'achievement.profile_complete_name',
    description: 'Hai completato il tuo profilo con tutte le informazioni.',
    descKey: 'achievement.profile_complete_desc',
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

  // Water/wellness entries saved while offline never run checkWaterAchievements
  // / checkWellnessAchievements (those only fire inline after an online save —
  // see WaterPage/WellnessPage). Without this, an offline-then-synced entry
  // could never earn its achievement, even after reaching Supabase. offlineDB's
  // syncPendingWrites() dispatches this event once the queue has synced.
  useEffect(() => {
    if (!user) return
    function onSynced(e) {
      const tables = e.detail?.tables || []
      if (tables.includes('water_logs')) checkWaterAchievements(supabase, user.id, checkAndAward).catch(() => {})
      if (tables.includes('daily_wellness')) checkWellnessAchievements(supabase, user.id, checkAndAward).catch(() => {})
    }
    window.addEventListener('offlinedb:synced', onSynced)
    return () => window.removeEventListener('offlinedb:synced', onSynced)
  }, [user, checkAndAward])

  const getProgress = useCallback((key) => {
    return earned[key] ? { earned: true, earned_at: earned[key] } : { earned: false }
  }, [earned])

  // app_streak_7 / logins_30: nessuna tabella nel DB traccia già le aperture
  // giornaliere dell'app, e aggiungerne una richiederebbe una migration che
  // non possiamo eseguire da qui (connessione Supabase di sessione in sola
  // lettura) — teniamo lo storico degli ultimi 30 accessi in localStorage,
  // per-dispositivo: non perfetto (un utente multi-dispositivo può risultare
  // sotto-contato), ma sufficiente per un badge di engagement, non un dato
  // clinico. Un solo giorno per data, deduplicato.
  useEffect(() => {
    if (!user) return
    const KEY = 'login_dates'
    const today = new Date().toISOString().split('T')[0]
    let dates
    try { dates = JSON.parse(localStorage.getItem(KEY) || '[]') } catch { dates = [] }
    if (!dates.includes(today)) {
      dates.push(today)
      dates = dates.slice(-30)
      localStorage.setItem(KEY, JSON.stringify(dates))
    }
    const dateSet = new Set(dates)
    const toKey = d => d.toISOString().split('T')[0]
    let cur = new Date()
    if (!dateSet.has(toKey(cur))) cur.setDate(cur.getDate() - 1)
    let streak = 0
    while (dateSet.has(toKey(cur))) { streak++; cur.setDate(cur.getDate() - 1) }
    if (streak >= 7) checkAndAward('app_streak_7')
    if (dates.length >= 30) checkAndAward('logins_30')
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al cambio utente/mount, non ad ogni render
  }, [user])

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
