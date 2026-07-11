// ─── Notification preferences ─────────────────────────────────────────────────
export const PREFS_KEY = 'nutriplan_notif_prefs'

export const DEFAULT_PREFS = {
  // event-based (Supabase realtime)
  newMessage: true,
  newDocument: true,
  dietUpdate: true,
  // scheduled
  mealReminder: false,
  mealTimes: ['08:00', '13:00', '20:00'],
  waterReminder: false,
  waterIntervalHours: 2,
  weighReminder: false,
  weighDay: 1,      // 1 = Monday
  weighTime: '08:00',
  appointmentReminder: false,
  appointmentDate: '',
  appointmentTime: '',
}

export function loadPrefs() {
  try {
    return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(PREFS_KEY) || '{}') }
  } catch {
    return { ...DEFAULT_PREFS }
  }
}

export function savePrefs(prefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
}

// ─── Permission ────────────────────────────────────────────────────────────────
export function getPermissionStatus() {
  if (!('Notification' in window)) return 'not-supported'
  return Notification.permission
}

export async function requestPermission() {
  if (!('Notification' in window)) return 'not-supported'
  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission === 'denied') return 'denied'
  const result = await Notification.requestPermission()
  return result
}

// ─── Show a notification ───────────────────────────────────────────────────────
export function showNotification(title, body, tag = 'nutriplan') {
  if (getPermissionStatus() !== 'granted') return
  const opts = {
    body,
    tag,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [200, 100, 200],
  }
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(reg => reg.showNotification(title, opts))
      .catch(() => new Notification(title, opts))
  } else {
    new Notification(title, opts)
  }
}

// ─── Scheduling helpers ────────────────────────────────────────────────────────

/** Returns milliseconds until the next occurrence of HH:MM (today or tomorrow). */
function msUntilTime(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  const now = new Date()
  const target = new Date(now)
  target.setHours(h, m, 0, 0)
  if (target <= now) target.setDate(target.getDate() + 1)
  return target - now
}

/**
 * Returns milliseconds until the next occurrence of dayOfWeek + timeStr.
 * dayOfWeek: 0=Sunday … 6=Saturday
 */
function msUntilNextWeekday(dayOfWeek, timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  const now = new Date()
  const target = new Date(now)
  target.setHours(h, m, 0, 0)
  let daysUntil = (dayOfWeek - now.getDay() + 7) % 7
  if (daysUntil === 0 && target <= now) daysUntil = 7
  target.setDate(target.getDate() + daysUntil)
  return target - now
}

// ─── Scheduler ────────────────────────────────────────────────────────────────
const _timers = []

function _clearAll() {
  _timers.forEach(id => clearTimeout(id))
  _timers.length = 0
}

/** Schedule fn() at HH:MM every day, repeating. */
function _scheduleDaily(fn, timeStr) {
  const tick = () => {
    fn()
    const id = setTimeout(tick, msUntilTime(timeStr))
    _timers.push(id)
  }
  const id = setTimeout(tick, msUntilTime(timeStr))
  _timers.push(id)
}

/** Schedule fn() every `intervalMs` starting now+interval. */
function _scheduleRepeating(fn, intervalMs) {
  const tick = () => {
    fn()
    const id = setTimeout(tick, intervalMs)
    _timers.push(id)
  }
  const id = setTimeout(tick, intervalMs)
  _timers.push(id)
}

/** Schedule fn() on the given weekday+time, then repeat weekly. */
function _scheduleWeekly(fn, dayOfWeek, timeStr) {
  const tick = () => {
    fn()
    const id = setTimeout(tick, 7 * 24 * 60 * 60 * 1000)
    _timers.push(id)
  }
  const id = setTimeout(tick, msUntilNextWeekday(dayOfWeek, timeStr))
  _timers.push(id)
}

// ─── Public init ──────────────────────────────────────────────────────────────
/**
 * Initialise (or reinitialise) all scheduled local notifications.
 * Call on app start and whenever prefs change.
 */
export function initScheduledNotifications(prefs) {
  _clearAll()
  if (getPermissionStatus() !== 'granted') return

  const p = { ...DEFAULT_PREFS, ...prefs }

  // Meal reminders
  if (p.mealReminder && Array.isArray(p.mealTimes)) {
    const defaultLabels = ['Colazione','Spuntino mattina','Pranzo','Spuntino pomeriggio','Cena','Spuntino sera']
    p.mealTimes.forEach((time, i) => {
      const label = (p.mealLabels && p.mealLabels[i]) || defaultLabels[i] || `Pasto ${i+1}`
      _scheduleDaily(
        () => showNotification(`🍽️ ${label}`, `Hai registrato ${label.toLowerCase()}? Apri l'app per il diario pasti.`, `meal-${i}`),
        time,
      )
    })
  }

  // Water reminders
  if (p.waterReminder && p.waterIntervalHours > 0) {
    const ms = p.waterIntervalHours * 60 * 60 * 1000
    _scheduleRepeating(
      () => showNotification('💧 Ricordati di bere!', "Bevi un bicchiere d'acqua per mantenerti idratato", 'water'),
      ms,
    )
  }

  // Weigh-in reminder
  if (p.weighReminder) {
    _scheduleWeekly(
      () => showNotification('⚖️ Giorno della bilancia!', 'Ricordati di pesarti e registrare il peso', 'weigh'),
      Number(p.weighDay),
      p.weighTime,
    )
  }

  // Appointment reminder (1 h before)
  if (p.appointmentReminder && p.appointmentDate && p.appointmentTime) {
    const appt = new Date(`${p.appointmentDate}T${p.appointmentTime}`)
    const delay = appt - Date.now() - 60 * 60 * 1000 // 1 hour before
    if (delay > 0) {
      const id = setTimeout(
        () => showNotification('📅 Appuntamento tra 1 ora!', `Hai una visita dal dietista alle ${p.appointmentTime}`, 'appointment'),
        delay,
      )
      _timers.push(id)
    }
  }
}

// ─── Medication reminders ───────────────────────────────────────────────────
// Lista dinamica (da Supabase, non da un blob localStorage a forma fissa come
// DEFAULT_PREFS) — timer separati dai _timers di initScheduledNotifications
// così ri-schedulare i farmaci dopo un'aggiunta/modifica non tocca pasti/
// acqua/pesata/appuntamento, e viceversa.
const _medTimers = []

function _clearMedTimers() {
  _medTimers.forEach(id => clearTimeout(id))
  _medTimers.length = 0
}

/**
 * (Ri)pianifica le notifiche locali per una lista di farmaci attivi.
 * Ogni farmaco ha `times`: array di stringhe 'HH:MM'.
 * Chiamare al boot (con la lista caricata da Supabase) e dopo ogni modifica.
 */
export function scheduleMedicationReminders(meds) {
  _clearMedTimers()
  if (getPermissionStatus() !== 'granted') return
  if (!Array.isArray(meds)) return

  meds.filter(m => m.active !== false).forEach(med => {
    (med.times || []).forEach(time => {
      const tick = () => {
        showNotification(
          '💊 ' + med.name,
          med.dosage ? `Dose: ${med.dosage}` : 'È ora di prendere il farmaco',
          `med-${med.id}-${time}`,
        )
        const id = setTimeout(tick, 24 * 60 * 60 * 1000)
        _medTimers.push(id)
      }
      const id = setTimeout(tick, msUntilTime(time))
      _medTimers.push(id)
    })
  })
}

// ─── Web Push (real background push via VAPID) ─────────────────────────────
// Requires VITE_VAPID_PUBLIC_KEY in .env.local
// Generate keys: node -e "const wp=require('web-push');const k=wp.generateVAPIDKeys();console.log(JSON.stringify(k))"

export const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || ''

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)))
}

/**
 * Subscribe to Web Push and persist the subscription in Supabase.
 * Call after the user grants notification permission.
 */
export async function subscribeToPush(userId) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null
  if (!VAPID_PUBLIC_KEY) {
    console.warn('[push] VITE_VAPID_PUBLIC_KEY not set — skipping push subscription')
    return null
  }
  try {
    const reg = await navigator.serviceWorker.ready
    let sub = await reg.pushManager.getSubscription()
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })
    }
    const subData = sub.toJSON()
    const { supabase } = await import('./supabase')
    // push_subscriptions ha unique(user_id), non unique(endpoint) — con
    // onConflict:'endpoint' l'upsert falliva sempre con 42P10 (nessun vincolo
    // corrispondente), quindi nessuna sottoscrizione veniva mai salvata.
    await supabase.from('push_subscriptions').upsert(
      {
        user_id: userId,
        endpoint: subData.endpoint,
        p256dh: subData.keys?.p256dh,
        auth: subData.keys?.auth,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    )
    return sub
  } catch (e) {
    console.warn('[push] Subscription failed:', e)
    return null
  }
}

/** Unsubscribe from Web Push and remove from Supabase. */
export async function unsubscribeFromPush(userId) {
  try {
    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.getSubscription()
    if (sub) await sub.unsubscribe()
    const { supabase } = await import('./supabase')
    await supabase.from('push_subscriptions').delete().eq('user_id', userId)
  } catch (e) {
    console.warn('[push] Unsubscribe failed:', e)
  }
}

/** Returns true if the browser currently has an active push subscription. */
export async function hasPushSubscription() {
  try {
    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.getSubscription()
    return !!sub
  } catch {
    return false
  }
}
