import { createContext, useContext, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { loadPrefs, initScheduledNotifications, showNotification } from '../lib/notifications'
import { checkMealAndNotify } from '../lib/smartNotifications'

const NotificationContext = createContext({})

export function NotificationProvider({ children, user }) {
  const channelsRef = useRef([])
  const prefsRef = useRef(loadPrefs())

  // (Re)initialise whenever user changes or on first mount
  useEffect(() => {
    if (!user) return

    // Keep prefsRef fresh when localStorage changes (handles cross-tab updates
    // and same-tab saves that dispatch a StorageEvent via notifications.js)
    function handleStorage(e) {
      if (!e.key || e.key === 'nutriplan_notif_prefs') prefsRef.current = loadPrefs()
    }
    window.addEventListener('storage', handleStorage)

    // Scheduled local notifications
    initScheduledNotifications(prefsRef.current)

    // ── Supabase Realtime: canale unico con 4 subscription (era 3 canali separati)
    // Un solo WebSocket per utente invece di tre
    const channel = supabase
      .channel(`notif-${user.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `patient_id=eq.${user.id}` },
        payload => {
          if (payload.new?.sender_role === 'dietitian' && prefsRef.current.newMessage) {
            showNotification('💬 Nuovo messaggio dal dietista', payload.new.content?.slice(0, 80) || '', 'chat-msg')
          }
        },
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'patient_documents', filter: `patient_id=eq.${user.id}` },
        payload => {
          const prefs = prefsRef.current
          if (payload.new?.visible && prefs.newDocument) {
            if (payload.new?.requires_signature) {
              showNotification('🔏 Firma richiesta', payload.new.title || 'Il tuo dietista ha condiviso un documento da firmare', 'doc-sign')
            } else {
              showNotification('📄 Nuovo documento condiviso', payload.new.title || 'Il tuo dietista ha condiviso un documento', 'doc-new')
            }
          }
        },
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'diet_plans', filter: `patient_id=eq.${user.id}` },
        () => {
          if (prefsRef.current.dietUpdate) {
            showNotification('🥗 Piano alimentare aggiornato', 'Il tuo dietista ha aggiornato la tua dieta', 'diet-update')
          }
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'diet_plans', filter: `patient_id=eq.${user.id}` },
        () => {
          if (prefsRef.current.dietUpdate) {
            showNotification('🥗 Piano alimentare aggiornato', 'Il tuo dietista ha modificato la tua dieta', 'diet-update')
          }
        },
      )
      .subscribe()

    channelsRef.current = [channel]

    // Smart contextual meal notification on app focus
    function handleVisibility() {
      if (!document.hidden && prefsRef.current.mealReminder !== false) {
        checkMealAndNotify(user.id)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      channelsRef.current.forEach(ch => supabase.removeChannel(ch))
      channelsRef.current = []
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('storage', handleStorage)
    }
  }, [user?.id])

  return (
    <NotificationContext.Provider value={{}}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
