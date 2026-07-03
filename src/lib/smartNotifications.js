// Smart contextual notifications — call these at key moments in the app
// (e.g. after logging water, on app focus, on Sunday evening)
import { showNotification } from './notifications'

/**
 * Call after each water log. Shows a smart reminder if the user is behind their daily goal.
 * @param {number} currentMl  ml consumed today
 * @param {number} goalMl     daily goal in ml
 */
export function checkWaterAndNotify(currentMl, goalMl) {
  const now = new Date()
  const hour = now.getHours()
  if (hour < 9 || hour > 21) return

  const remaining = (goalMl || 2000) - (currentMl || 0)
  if (remaining <= 0) return

  const hoursLeft = Math.max(1, 21 - hour)
  const mlPerHour = Math.round(remaining / hoursLeft)

  if (remaining > 500 && hour >= 15) {
    showNotification(
      '💧 Idratazione',
      `Sono le ${hour}:00 — hai bevuto ${currentMl}ml, ti restano ${remaining}ml (circa ${mlPerHour}ml/ora fino alle 21:00)`,
      'water-smart',
    )
  } else if (remaining > 200 && hour >= 19) {
    showNotification(
      '💧 Quasi ci sei!',
      `Ti mancano solo ${remaining}ml per raggiungere il tuo obiettivo di oggi.`,
      'water-smart-evening',
    )
  }
}

/**
 * Call on app focus (visibility change). Checks if current meal window has no log yet.
 * @param {string} userId  Supabase user id
 */
export async function checkMealAndNotify(userId) {
  const now = new Date()
  const hour = now.getHours()
  const todayStr = now.toISOString().split('T')[0]

  const mealWindows = [
    { start: 7,  end: 10, meal: 'colazione',         label: 'colazione' },
    { start: 12, end: 15, meal: 'pranzo',             label: 'pranzo' },
    { start: 15, end: 17, meal: 'spuntino_pomeriggio', label: 'merenda' },
    { start: 19, end: 22, meal: 'cena',               label: 'cena' },
  ]

  const window = mealWindows.find(w => hour >= w.start && hour < w.end)
  if (!window) return

  // Avoid firing multiple times: check localStorage timestamp
  const lastKey = `smart_notif_${window.meal}_${todayStr}`
  if (localStorage.getItem(lastKey)) return

  try {
    const { supabase } = await import('./supabase')
    const { count } = await supabase
      .from('food_logs')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('meal_type', window.meal)
      .eq('date', todayStr)

    if (count === 0) {
      showNotification(
        `🍽️ Hai già mangiato?`,
        `Ricordati di registrare la ${window.label} per tenere traccia dei macro!`,
        `meal-smart-${window.meal}`,
      )
      localStorage.setItem(lastKey, '1')
    }
  } catch {
    // Fail silently
  }
}

/**
 * Weekly summary — call on Sunday evening or on Monday morning.
 * @param {string} userId  Supabase user id
 */
export async function sendWeeklyProgressNotification(userId) {
  try {
    const today = new Date()
    const weekAgo = new Date(today - 7 * 24 * 60 * 60 * 1000)

    const { supabase } = await import('./supabase')
    const { data: logs } = await supabase
      .from('food_logs')
      .select('date')
      .eq('user_id', userId)
      .gte('date', weekAgo.toISOString().split('T')[0])

    const daysLogged = new Set((logs || []).map(l => l.date)).size

    const emoji = daysLogged >= 6 ? '🏆' : daysLogged >= 4 ? '💪' : '📊'
    const msg = daysLogged >= 6
      ? 'Settimana perfetta! Continua così.'
      : daysLogged >= 4
        ? `Hai registrato ${daysLogged}/7 giorni. Ottimo impegno!`
        : `Hai registrato solo ${daysLogged}/7 giorni. Puoi fare meglio la prossima settimana!`

    showNotification(`${emoji} Riepilogo settimanale`, msg, 'weekly-summary')
  } catch {
    // Fail silently
  }
}
