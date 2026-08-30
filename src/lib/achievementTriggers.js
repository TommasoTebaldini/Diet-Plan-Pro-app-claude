// achievementTriggers.js — helper condiviso per i badge basati su "giorni
// consecutivi" (diario alimentare, acqua, benessere). Prima di questo file i
// 25 badge in AchievementsContext.jsx erano quasi tutti dead code: solo
// first_checkin e i 4 quiz_streak_* venivano davvero assegnati. Le pagine che
// salvano ciascun tipo di dato chiamano queste funzioni dopo un salvataggio
// riuscito — vedi MacroTrackerPage/WaterPage/WellnessPage.

// Streak di giorni consecutivi che termina oggi o ieri (se oggi non c'è
// ancora un log): stessa logica già usata in StreakCalendar.jsx, estratta
// qui per essere riusabile anche per acqua/benessere.
export function computeDayStreak(dateSet) {
  const toKey = d => d.toISOString().split('T')[0]
  const cur = new Date()
  if (!dateSet.has(toKey(cur))) cur.setDate(cur.getDate() - 1)
  let streak = 0
  while (dateSet.has(toKey(cur))) {
    streak++
    cur.setDate(cur.getDate() - 1)
  }
  return streak
}

// food_logs: first_food_log, streak_3/7/30
export async function checkFoodLogAchievements(supabase, userId, checkAndAward) {
  const { data } = await supabase.from('food_logs').select('date').eq('user_id', userId).neq('food_name', '__note__')
  if (!data || !data.length) return
  await checkAndAward('first_food_log')
  const streak = computeDayStreak(new Set(data.map(r => r.date)))
  if (streak >= 3) await checkAndAward('streak_3')
  if (streak >= 7) await checkAndAward('streak_7')
  if (streak >= 30) await checkAndAward('streak_30')
}

// water_logs: water_goal (oggi), water_week (7 giorni consecutivi di goal raggiunto)
export async function checkWaterAchievements(supabase, userId, checkAndAward, goalMl) {
  const goal = goalMl || 2000
  const today = new Date().toISOString().split('T')[0]
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 13) // margine per calcolare uno streak fino a 7gg
  const { data } = await supabase.from('water_logs').select('date,amount_ml').eq('user_id', userId).gte('date', cutoff.toISOString().split('T')[0])
  if (!data) return
  const totalsByDay = {}
  for (const r of data) totalsByDay[r.date] = (totalsByDay[r.date] || 0) + (r.amount_ml || 0)
  if ((totalsByDay[today] || 0) >= goal) await checkAndAward('water_goal')
  const metDays = new Set(Object.keys(totalsByDay).filter(d => totalsByDay[d] >= goal))
  if (computeDayStreak(metDays) >= 7) await checkAndAward('water_week')
}

// daily_wellness: wellness_week (7 giorni consecutivi con un check-in di benessere)
export async function checkWellnessAchievements(supabase, userId, checkAndAward) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 13)
  const { data } = await supabase.from('daily_wellness').select('date').eq('user_id', userId).gte('date', cutoff.toISOString().split('T')[0])
  if (!data) return
  if (computeDayStreak(new Set(data.map(r => r.date))) >= 7) await checkAndAward('wellness_week')
}

// weight_logs: first_weight, first_weight_loss, lost_1kg, lost_5kg — chiamare
// DOPO aver scritto il nuovo peso, passando il valore appena salvato. Se non
// viene passato (es. ri-controllo generico dopo una sync della coda offline,
// dove il chiamante non ha "il valore appena scritto" a portata di mano) si
// usa l'ultima riga già presente su Supabase.
export async function checkWeightAchievements(supabase, userId, checkAndAward, newWeightKg) {
  const { data } = await supabase.from('weight_logs').select('date,weight_kg').eq('user_id', userId).order('date', { ascending: true })
  if (!data || !data.length) return
  await checkAndAward('first_weight')
  if (data.length < 2) return
  const latest = newWeightKg != null ? newWeightKg : data[data.length - 1].weight_kg
  const first = data[0].weight_kg
  const prev = data[data.length - 2]?.weight_kg
  if (prev != null && latest != null && latest < prev) await checkAndAward('first_weight_loss')
  if (first != null && latest != null) {
    const lost = first - latest
    if (lost >= 1) await checkAndAward('lost_1kg')
    if (lost >= 5) await checkAndAward('lost_5kg')
  }
}
