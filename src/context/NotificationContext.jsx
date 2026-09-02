import { createContext, useContext, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { loadPrefs, initScheduledNotifications, showNotification, scheduleMedicationReminders } from '../lib/notifications'
import { checkMealAndNotify, checkStreakAtRiskAndNotify } from '../lib/smartNotifications'
import { useT } from '../i18n'

const NotificationContext = createContext({})

export function NotificationProvider({ children, user }) {
  const t = useT()
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

    // Medication reminders — lista dinamica da Supabase, ripianificata anche
    // su ogni INSERT/UPDATE/DELETE (es. modifica fatta in un'altra tab/sessione)
    function loadAndScheduleMeds() {
      supabase.from('medication_reminders').select('*').eq('user_id', user.id).eq('active', true)
        .then(({ data }) => scheduleMedicationReminders(data || []))
    }
    loadAndScheduleMeds()

    // ── Supabase Realtime: canale unico con 4 subscription (era 3 canali separati)
    // Un solo WebSocket per utente invece di tre
    const channel = supabase
      .channel(`notif-${user.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'patient_documents', filter: `patient_id=eq.${user.id}` },
        payload => {
          const prefs = prefsRef.current
          if (payload.new?.visible && prefs.newDocument) {
            if (payload.new?.requires_signature) {
              showNotification(t('notif.doc_signature_required_title', '🔏 Firma richiesta'), payload.new.title || t('notif.doc_signature_required_body', 'Il tuo dietista ha condiviso un documento da firmare'), 'doc-sign')
            } else {
              showNotification(t('notif.new_document_title', '📄 Nuovo documento condiviso'), payload.new.title || t('notif.new_document_body', 'Il tuo dietista ha condiviso un documento'), 'doc-new')
            }
          }
        },
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'patient_diets', filter: `user_id=eq.${user.id}` },
        () => {
          if (prefsRef.current.dietUpdate) {
            showNotification(t('notif.diet_updated_title', '🥗 Piano alimentare aggiornato'), t('notif.diet_created_body', 'Il tuo dietista ha aggiornato la tua dieta'), 'diet-update')
          }
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'patient_diets', filter: `user_id=eq.${user.id}` },
        () => {
          if (prefsRef.current.dietUpdate) {
            showNotification(t('notif.diet_updated_title', '🥗 Piano alimentare aggiornato'), t('notif.diet_modified_body', 'Il tuo dietista ha modificato la tua dieta'), 'diet-update')
          }
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'medication_reminders', filter: `user_id=eq.${user.id}` },
        loadAndScheduleMeds,
      )
      .subscribe()

    // chat_messages è una vista cifrata lato DB (SEZIONE 80 di
    // supabase_setup.sql, NutriPlan-Pro): postgres_changes non riceve mai
    // nulla su di essa (legge lo stream di replica della tabella base, non
    // la vista decifrata). Stesso canale broadcast privato già usato da
    // ChatPage.jsx per il contenuto già decifrato dal trigger
    // chat_messages_broadcast() — qui serve solo per la notifica, non per lo
    // stato dei messaggi.
    const chatChannel = supabase
      .channel(`chat:${user.id}`, { config: { private: true } })
      .on('broadcast', { event: 'INSERT' }, payload => {
        const msg = payload.payload
        // I messaggi programmati (status='scheduled') non sono ancora
        // destinati al paziente — arrivano via un UPDATE separato quando il
        // trigger li porta a 'sent'.
        if (msg?.status === 'sent' && msg?.sender_role === 'dietitian' && prefsRef.current.newMessage) {
          showNotification(t('notif.new_chat_message_title', '💬 Nuovo messaggio dal dietista'), msg.content?.slice(0, 80) || '', 'chat-msg')
        }
      })
      .on('broadcast', { event: 'UPDATE' }, payload => {
        const msg = payload.payload
        if (msg?.status === 'sent' && msg?.sender_role === 'dietitian' && prefsRef.current.newMessage) {
          showNotification(t('notif.new_chat_message_title', '💬 Nuovo messaggio dal dietista'), msg.content?.slice(0, 80) || '', 'chat-msg')
        }
      })
      .subscribe()

    channelsRef.current = [channel, chatChannel]

    // Smart contextual meal notification on app focus
    function handleVisibility() {
      if (!document.hidden && prefsRef.current.mealReminder !== false) {
        checkMealAndNotify(user.id)
        checkStreakAtRiskAndNotify(user.id)
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
