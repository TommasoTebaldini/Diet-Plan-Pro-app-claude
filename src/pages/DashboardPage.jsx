import { useState, useEffect, useMemo, lazy, Suspense } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const QuizPage = lazy(() => import('./QuizPage'))
import { useAuth } from '../context/AuthContext'
import { useAppSettings } from '../context/AppSettingsContext'
import { supabase } from '../lib/supabase'
import { fetchDietFromPiani, fetchWaterTarget } from '../lib/dietBridge'
import { useT } from '../i18n'
import { Utensils, Droplets, TrendingUp, Apple, Flame, Leaf, MessageCircle, FileText, BookOpen, User, ChevronRight, Activity, Scale, Calendar, Zap, Award, Heart, BarChart2, Star, Crown, Brain } from 'lucide-react'
import StreakCalendar from '../components/StreakCalendar'
import DailyTipsCard from '../components/DailyTipsCard'
import DailyLessonCard from '../components/DailyLessonCard'
import { useSubscription } from '../hooks/useSubscription'
import OnboardingFlow from '../components/OnboardingFlow'
import TutorialTooltip from '../components/TutorialTooltip'
import { useFirstVisit } from '../hooks/useFirstVisit'

const r1 = v => Math.round((+v || 0) * 10) / 10
const r0 = v => Math.round(+v || 0)

// Testo di framing basato sull'obiettivo scelto in onboarding (profiles.nutrition_goal) —
// prima raccolto e mai più letto da nessuna parte, ora dà contesto al target calorico.
const GOAL_LABELS = {
  lose: 'perdere peso',
  maintain: 'mantenere il peso',
  gain: 'aumentare la massa muscolare',
}

// Aderenza settimanale al piano del dietista: % di giorni (ultimi 7, oggi escluso se
// ancora in corso) in cui le kcal registrate rientrano in una banda ragionevole (±15%)
// del target prescritto da NutriPlan-Pro. Un giorno senza alcuna registrazione conta
// come non allineato: non loggare è comunque una deviazione dal piano.
const ADHERENCE_BAND = 0.15
function computeAdherence(dailyRows, kcalTarget, todayStr) {
  if (!kcalTarget) return null
  const byDate = new Map(dailyRows.map(r => [r.date, r.kcal]))
  const days = []
  for (let i = 1; i <= 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }
  let aligned = 0
  days.forEach(d => {
    const kcal = byDate.get(d)
    if (kcal != null && Math.abs(kcal - kcalTarget) <= kcalTarget * ADHERENCE_BAND) aligned++
  })
  return Math.round((aligned / days.length) * 100)
}

// Animated progress ring: starts at 0, transitions to target pct on mount
function Ring({ pct, color, size = 60, strokeWidth = 7 }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setDisplay(pct), 80)
    return () => clearTimeout(t)
  }, [pct])
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - Math.min(100, display) / 100 * circ
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,.15)" strokeWidth={strokeWidth} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
        strokeWidth={strokeWidth} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }} />
    </svg>
  )
}

// Meal types with time windows (startHour as decimal)
const MEAL_ORDER = ['colazione', 'spuntino_mattina', 'pranzo', 'spuntino_pomeriggio', 'cena']
const MEAL_STATIC = {
  colazione:           { icon: '☀️', time: '07:00–08:30', startHour: 7 },
  spuntino_mattina:    { icon: '🍎', time: '10:00–10:30', startHour: 10 },
  pranzo:              { icon: '🍽️', time: '12:30–13:30', startHour: 12.5 },
  spuntino_pomeriggio: { icon: '🥤', time: '15:30–16:00', startHour: 15.5 },
  cena:                { icon: '🌙', time: '19:30–20:30', startHour: 19.5 },
}

function getNextMeal(meals, nowHour) {
  for (const type of MEAL_ORDER) {
    if (MEAL_STATIC[type].startHour > nowHour) {
      const meal = meals.find(m => m.meal_type === type)
      if (meal) return { meal, type }
    }
  }
  return null
}

function getMotivationalMessage(t, kcalPct, waterPct, streak) {
  if (streak >= 14) return t('dash.motiv_streak14', { streak }, '🏆 {{streak}} giorni di fila! Sei straordinario!')
  if (streak >= 7)  return t('dash.motiv_streak7', { streak }, '🔥 {{streak}} giorni consecutivi! Continua così!')
  if (streak >= 3)  return t('dash.motiv_streak3', { streak }, '⚡ {{streak}} giorni di streak! Stai crescendo!')
  if (kcalPct >= 90) return t('dash.motiv_kcal90', '✅ Ottimo! Stai raggiungendo l\'obiettivo calorico!')
  if (kcalPct >= 50) return t('dash.motiv_kcal50', '💪 Sei a metà strada. Registra il prossimo pasto!')
  if (waterPct >= 80) return t('dash.motiv_water80', '💧 Ottima idratazione oggi! Continua!')
  if (kcalPct === 0)  return t('dash.motiv_kcal_zero', '🌱 Buona giornata! Inizia a registrare i pasti.')
  return t('dash.motiv_default', '🎯 Ogni piccolo passo conta. Vai avanti!')
}

function StatPill({ label, val, target, color }) {
  const pct = target ? Math.min(100, Math.round(val / target * 100)) : 0
  return (
    <div style={{ flex: 1, background: 'rgba(255,255,255,.1)', borderRadius: 14, padding: '10px 8px', textAlign: 'center', border: '1px solid rgba(255,255,255,.12)', backdropFilter: 'blur(8px)' }}>
      <div style={{ height: 3, background: 'rgba(255,255,255,.2)', borderRadius: 2, marginBottom: 8, overflow: 'hidden' }}>
        {target && <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2, transition: 'width 1s ease' }} />}
      </div>
      <p style={{ color: 'white', fontSize: 14, fontWeight: 700, lineHeight: 1 }}>{val}{target ? `/${target}` : ''}</p>
      <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 10, marginTop: 3 }}>{label}</p>
    </div>
  )
}

const ACTIONS = [
  { label: 'Dieta', tKey: 'dash.action_diet', icon: Utensils, to: '/dieta', color: '#157a4a', bg: '#e6f5ee' },
  { label: 'Pasti', tKey: 'dash.action_meals', icon: Apple, to: '/macro', color: '#e8882a', bg: '#fff4e6' },
  { label: 'Acqua', tKey: 'dash.action_water', icon: Droplets, to: '/acqua', color: '#2f7de8', bg: '#eff6ff' },
  { label: 'Attività', tKey: 'dash.action_activity', icon: Activity, to: '/attivita', color: '#f97316', bg: '#fff7ed' },
  { label: 'Progressi', tKey: 'dash.action_progress', icon: TrendingUp, to: '/progressi', color: '#7c3aed', bg: '#f5f3ff' },
  { label: 'Benessere', tKey: 'dash.action_wellness', icon: Heart, to: '/benessere', color: '#ec4899', bg: '#fdf2f8' },
  { label: 'Report', tKey: 'dash.action_report', icon: BarChart2, to: '/statistiche', color: '#0f766e', bg: '#f0fdfa' },
  { label: 'Chat', tKey: 'dash.action_chat', icon: MessageCircle, to: '/chat', color: '#dc4a4a', bg: '#fff0f0' },
  { label: 'Documenti', tKey: 'dash.action_documents', icon: FileText, to: '/documenti', color: '#0891b2', bg: '#ecfeff' },
  { label: 'Alimenti', tKey: 'dash.action_foods', icon: BookOpen, to: '/alimenti', color: '#157a4a', bg: '#f0fdf4' },
  { label: 'Quiz', tKey: 'dash.action_quiz', icon: Brain, to: '/quiz', color: '#7c3aed', bg: '#f5f3ff' },
  { label: 'Profilo', tKey: 'dash.action_profile', icon: User, to: '/profilo', color: '#64748b', bg: '#f8fafc' },
]

function QuizBannerCard({ onOpen }) {
  const t = useT()
  const today = new Date().toISOString().split('T')[0]
  const done = (() => { try { return !!JSON.parse(localStorage.getItem(`quiz_${today}`) || 'null')?.done } catch { return false } })()
  const streak = (() => { try { return parseInt(localStorage.getItem('quiz_streak') || '0') } catch { return 0 } })()
  return (
    <motion.div whileHover={{ y: -3, scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={onOpen} style={{ cursor: 'pointer' }}>
      <div style={{ background: done ? 'linear-gradient(135deg, #064E3B, #0F766E)' : 'linear-gradient(135deg, #4c1d95, #7c3aed)', borderRadius: 18, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -18, right: -18, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,.07)' }} />
        <div style={{ width: 46, height: 46, borderRadius: 14, background: 'rgba(255,255,255,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 24 }}>
          {done ? '✅' : '🧠'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>
            {done ? t('dash.quiz_done_badge', 'Completato oggi') : t('dash.quiz_of_the_day', 'Quiz del giorno')}
          </p>
          <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: 0 }}>
            {done ? t('dash.quiz_done_message', 'Ottimo lavoro! Torna domani') : t('dash.quiz_start_message', 'Impara qualcosa di nuovo oggi')}
          </p>
          {streak > 0 && <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 12, marginTop: 2 }}>🔥 {streak === 1 ? t('quiz.streak_day', { count: streak }, 'Striscia: {{count}} giorno') : t('quiz.streak_days', { count: streak }, 'Striscia: {{count}} giorni')}</p>}
        </div>
        <ChevronRight size={18} color="rgba(255,255,255,.6)" style={{ flexShrink: 0 }} />
      </div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const { profile, user } = useAuth()
  const { settings } = useAppSettings()
  const { isPro } = useSubscription()
  const t = useT()
  const dark = settings.darkMode
  const [todayLog, setTodayLog] = useState(null)
  const [waterLog, setWaterLog] = useState(0)
  const [waterTarget, setWaterTarget] = useState(2500)
  const [diet, setDiet] = useState(null)
  const [weight, setWeight] = useState(null)
  const [unreadChat, setUnreadChat] = useState(0)
  const [streak, setStreak] = useState(0)
  const [adherence, setAdherence] = useState(null)
  const [nextMealInfo, setNextMealInfo] = useState(null)
  const [appointment, setAppointment] = useState(null)
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('onboarding_done'))
  const [showQuiz, setShowQuiz] = useState(false)
  const { isFirstVisit: isDashFirstVisit } = useFirstVisit('dashboard')

  function handleOnboardingDone() {
    setShowOnboarding(false)
  }

  const MEAL_META = useMemo(() => Object.fromEntries(
    MEAL_ORDER.map(k => [k, { ...MEAL_STATIC[k], label: t(`meal.${k}`) }])
  ), [t])

  const tutorialSteps = useMemo(() => [
    {
      target: '.page > div:first-child',
      title: t('dash.tutorial1_title', 'Il tuo riepilogo giornaliero'),
      text: t('dash.tutorial1_text', 'Qui trovi le calorie consumate oggi e i tuoi macronutrienti (proteine, carboidrati, grassi) rispetto agli obiettivi del piano.'),
    },
    {
      target: '[data-tutorial="quick-actions"]',
      title: t('dash.tutorial2_title', 'Accesso rapido alle sezioni'),
      text: t('dash.tutorial2_text', 'Da qui puoi raggiungere velocemente tutte le funzioni: diario pasti, acqua, progressi, chat con il dietista e molto altro.'),
    },
    {
      target: '[data-tutorial="water-bar"]',
      title: t('dash.tutorial3_title', 'Tracker idratazione'),
      text: t('dash.tutorial3_text', 'Monitora quanta acqua bevi ogni giorno. Toccа "+ Aggiungi" per registrare un\'assunzione e mantenerti idratato.'),
    },
  ], [t])

  const { hour, greet } = useMemo(() => {
    const h = new Date().getHours()
    return { hour: h, greet: h < 6 ? t('dash.greeting_evening') : h < 12 ? t('dash.greeting_morning') : h < 18 ? t('dash.greeting_afternoon') : t('dash.greeting_evening') }
  }, [t])

  useEffect(() => {
    async function load() {
      const now = new Date()
      const today = now.toISOString().split('T')[0]
      const nowDecimalHour = now.getHours() + now.getMinutes() / 60
      const jsDay = now.getDay()
      const dayNumber = jsDay === 0 ? 7 : jsDay

      const sixtyAgo = new Date(now)
      sixtyAgo.setDate(sixtyAgo.getDate() - 60)

      const sevenAgo = new Date(now)
      sevenAgo.setDate(sevenAgo.getDate() - 7)

      // Single parallel batch — everything at once, no waterfalls
      const [log, water, activeDiet, w, chat, streakRes, apptRes, weekRes, waterTargetRes] = await Promise.allSettled([
        supabase.from('daily_logs').select('kcal,proteins,carbs,fats').eq('user_id', user.id).eq('date', today).maybeSingle(),
        supabase.from('water_logs').select('amount_ml').eq('user_id', user.id).eq('date', today),
        supabase.from('patient_diets').select('id,name,kcal_target,protein_target,carbs_target,fats_target,notes').eq('user_id', user.id).eq('is_active', true).maybeSingle(),
        supabase.from('weight_logs').select('weight_kg').eq('user_id', user.id).order('date', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('chat_messages').select('id', { count: 'exact' }).eq('patient_id', user.id).eq('sender_role', 'dietitian').is('read_at', null),
        supabase.from('daily_logs').select('date').eq('user_id', user.id).gte('date', sixtyAgo.toISOString().split('T')[0]).order('date', { ascending: false }),
        supabase.from('appointments').select('id,appointment_date,title,notes').eq('patient_id', user.id).gte('appointment_date', now.toISOString()).order('appointment_date').limit(1).maybeSingle(),
        supabase.from('daily_logs').select('date,kcal').eq('user_id', user.id).gte('date', sevenAgo.toISOString().split('T')[0]),
        fetchWaterTarget(user.id),
      ])

      if (log.value?.data) setTodayLog(log.value.data)
      if (water.value?.data) setWaterLog(water.value.data.reduce((s, w) => s + w.amount_ml, 0))
      if (w.value?.data) setWeight(w.value.data.weight_kg)
      if (chat.value?.count) setUnreadChat(chat.value.count)
      // Fabbisogno idrico prescritto dal dietista, se impostato — altrimenti
      // resta il default 2500 (stato iniziale, vedi useState sopra).
      if (waterTargetRes.value) setWaterTarget(waterTargetRes.value)

      let currentDiet = activeDiet.value?.data ?? null
      // Fallback 1: prova senza filtro is_active
      if (!currentDiet && activeDiet.status === 'fulfilled' && !activeDiet.value?.error) {
        const { data: fb } = await supabase
          .from('patient_diets')
          .select('id,name,kcal_target,protein_target,carbs_target,fats_target,notes')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
        currentDiet = fb ?? null
      }
      // Fallback 2: piano + macro target da NutriPlan-Pro (piani + ncpt/schede_valutazione)
      if (!currentDiet) {
        const synth = await fetchDietFromPiani(user.id)
        if (synth) currentDiet = synth
      }
      setDiet(currentDiet)

      // Aderenza settimanale al piano — solo se abbiamo un target kcal reale
      // (piano prescritto dal dietista, non un default generico).
      if (currentDiet?.kcal_target) {
        const weekRows = weekRes.value?.data || []
        setAdherence(computeAdherence(weekRows, currentDiet.kcal_target, today))
      }

      // Streak calculation
      const streakRows = streakRes.value?.data
      if (streakRows) {
        const datesSet = new Set(streakRows.map(r => r.date))
        let s = 0
        const startOffset = datesSet.has(today) ? 0 : 1
        for (let i = startOffset; i < 60 + startOffset; i++) {
          const d = new Date(now)
          d.setDate(d.getDate() - i)
          if (datesSet.has(d.toISOString().split('T')[0])) s++
          else break
        }
        setStreak(s)
      }

      // Appointment
      if (apptRes.status === 'fulfilled' && apptRes.value?.data) {
        setAppointment(apptRes.value.data)
      }

      // Next meal — only if diet exists (second micro-batch, non-blocking for UI)
      if (currentDiet) {
        supabase.from('diet_meals')
          .select('id,diet_id,meal_type,meal_order,day_number,kcal')
          .eq('diet_id', currentDiet.id)
          .or(`day_number.eq.${dayNumber},day_number.is.null`)
          .order('meal_order')
          .then(({ data: mealRows }) => {
            if (mealRows?.length) {
              const found = getNextMeal(mealRows, nowDecimalHour)
              setNextMealInfo(found)
            }
          })
      }
    }
    load()
  }, [user.id])

  const firstName = profile?.first_name || profile?.full_name?.split(' ')[0] || t('dash.greeting_fallback_name', 'Ciao')
  const kcal = todayLog?.kcal || 0
  const kcalTarget = diet?.kcal_target || 2000
  const kcalPct = Math.min(100, Math.round(kcal / kcalTarget * 100))
  const waterPct = Math.min(100, Math.round(waterLog / waterTarget * 100))
  const motivationalMsg = getMotivationalMessage(t, kcalPct, waterPct, streak)

  // Format appointment date
  const apptDate = appointment ? new Date(appointment.appointment_date) : null
  const apptLabel = apptDate
    ? apptDate.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })
    : null
  const apptTime = apptDate
    ? apptDate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <div className="page">
      {/* ── Hero header ── */}
      <div style={{
        background: 'linear-gradient(160deg, var(--green-dark) 0%, var(--green-main) 55%, var(--green-mid) 100%)',
        padding: 'calc(env(safe-area-inset-top) + 20px) 20px 28px',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,.05)' }} />
        <div style={{ position: 'absolute', bottom: -20, left: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,.04)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 12, marginBottom: 2 }}>{greet} 👋</p>
              <h1 style={{ fontFamily: 'var(--font-d)', fontSize: 28, color: 'white', fontWeight: 300, lineHeight: 1.1 }}>{firstName}</h1>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {streak > 0 && (
                <div style={{ height: 42, borderRadius: 100, background: 'rgba(255,165,0,.25)', border: '1.5px solid rgba(255,165,0,.45)', display: 'flex', alignItems: 'center', gap: 5, padding: '0 12px' }}>
                  <Zap size={14} color="#fbbf24" fill="#fbbf24" />
                  <span style={{ color: '#fde68a', fontSize: 13, fontWeight: 700 }}>{streak}d</span>
                </div>
              )}
              {unreadChat > 0 && (
                <Link to="/chat" style={{ width: 42, height: 42, borderRadius: '50%', background: '#dc4a4a', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', position: 'relative', boxShadow: '0 4px 12px rgba(220,74,74,.4)' }}>
                  <MessageCircle size={18} color="white" />
                  <span style={{ position: 'absolute', top: -2, right: -2, width: 18, height: 18, borderRadius: '50%', background: 'white', color: '#dc4a4a', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadChat}</span>
                </Link>
              )}
                <Link to="/profilo" style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,.18)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: 'white', fontWeight: 700, fontSize: 16, border: '1.5px solid rgba(255,255,255,.25)', position: 'relative' }}>
                {firstName[0]?.toUpperCase()}
                {isPro && (
                  <span style={{ position: 'absolute', bottom: -4, right: -4, width: 18, height: 18, borderRadius: '50%', background: 'linear-gradient(135deg, #FCD34D, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, border: '2px solid rgba(255,255,255,0.3)' }}>
                    <Crown size={9} color="#7c2d12" />
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Calorie ring + stats */}
          <div style={{ background: 'rgba(255,255,255,.1)', backdropFilter: 'blur(12px)', borderRadius: 20, padding: '16px 18px', border: '1px solid rgba(255,255,255,.18)', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <Ring pct={kcalPct} color="rgba(255,255,255,.9)" size={68} strokeWidth={7} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Flame size={14} color="white" />
                <span style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>{kcalPct}%</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 11, marginBottom: 2 }}>{t('dash.calories_today', 'Calorie oggi')}</p>
              <p style={{ color: 'white', fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{r0(kcal)} <span style={{ fontSize: 13, opacity: .7, fontWeight: 400 }}>/ {kcalTarget} kcal</span></p>
              <div style={{ marginTop: 8, height: 5, background: 'rgba(255,255,255,.2)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${kcalPct}%`, background: 'white', borderRadius: 3, transition: 'width 1.2s ease' }} />
              </div>
            </div>
          </div>

          {/* Macro pills */}
          <div style={{ display: 'flex', gap: 6 }}>
            <StatPill label={t('dash.prot', 'Prot.')} val={`${r1(todayLog?.proteins)}g`} target={diet?.protein_target ? `${diet.protein_target}g` : null} color="#93c5fd" />
            <StatPill label={t('dash.carbo', 'Carbo')} val={`${r1(todayLog?.carbs)}g`} target={diet?.carbs_target ? `${diet.carbs_target}g` : null} color="#fcd34d" />
            <StatPill label={t('dash.fat', 'Grassi')} val={`${r1(todayLog?.fats)}g`} target={diet?.fats_target ? `${diet.fats_target}g` : null} color="#fca5a5" />
            <StatPill label={t('dash.action_water', 'Acqua')} val={`${r1(waterLog / 1000)}L`} target={`${r1(waterTarget / 1000)}L`} color="#7dd3fc" />
          </div>

          {/* Motivational message */}
          <div style={{ marginTop: 12, background: 'rgba(255,255,255,.1)', borderRadius: 12, padding: '10px 14px', border: '1px solid rgba(255,255,255,.15)' }}>
            <p style={{ color: 'rgba(255,255,255,.9)', fontSize: 13, fontWeight: 500 }}>{motivationalMsg}</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* ── Aderenza al piano del dietista — il metro che nessun tracker
             consumer generico (MyFitnessPal/Cronometer/Yazio) può offrire,
             perché non ha un professionista reale dietro i target. Mostrato
             solo quando abbiamo un target kcal prescritto, non il default. ── */}
        {diet?.kcal_target && adherence !== null && (
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}
          >
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <Ring
                pct={adherence}
                color={adherence >= 70 ? 'var(--green-main)' : adherence >= 40 ? '#f59e0b' : '#dc4a4a'}
                size={56}
                strokeWidth={6}
              />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{adherence}%</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 2 }}>{t('stats.compliance', 'Aderenza al piano')}</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                {t('dash.adherence_summary', { pct: adherence }, '{{pct}}% allineato al piano del tuo dietista questa settimana')}
              </p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{t('dash.adherence_detail', 'Giorni con kcal entro ±15% dal target prescritto (ultimi 7 giorni)')}</p>
            </div>
          </motion.div>
        )}

        {/* Quick actions 4x2 */}
        <div data-tutorial="quick-actions">
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>{t('dash.quick_access', 'Accesso rapido')}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: 10 }}>
            {ACTIONS.map(({ label, tKey, icon: Icon, to, color, bg }, idx) => (
              <motion.div
                key={to}
                whileHover={{ y: -4, scale: 1.05 }}
                whileTap={{ scale: 0.88 }}
              >
                <Link to={to} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 18, background: dark ? color + '26' : bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: dark ? color + 'cc' : color, boxShadow: `0 2px 8px ${color}22`, border: dark ? `1px solid ${color}30` : `1.5px solid ${color}18`, transition: 'transform .15s', position: 'relative' }}>
                    <Icon size={22} strokeWidth={1.8} />
                    {to === '/chat' && unreadChat > 0 && (
                      <span style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%', background: '#dc4a4a', color: 'white', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--surface-2)' }}>{unreadChat}</span>
                    )}
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'center' }}>{t(tKey, label)}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Water bar */}
        <motion.div
          data-tutorial="water-bar"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: dark ? '#2f7de826' : '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Droplets size={18} color="#2f7de8" />
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, textAlign: 'center' }}>{t('dash.hydration', 'Idratazione')}</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>{waterLog} ml / {waterTarget} ml</p>
          </div>
          <div style={{ height: 8, background: 'var(--border-light)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${waterPct}%`, background: 'linear-gradient(90deg, #60a5fa, #2f7de8)', borderRadius: 4, transition: 'width 1.2s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
            <Link to="/acqua" style={{ fontSize: 13, color: 'var(--green-main)', fontWeight: 600, textDecoration: 'none' }}>{t('dash.add', '+ Aggiungi')}</Link>
          </div>
        </motion.div>

        {/* Next meal */}
        {nextMealInfo && (
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}>
          <Link to="/dieta" style={{ textDecoration: 'none' }}>
            <div className="card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: dark ? '#f9731626' : '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 22 }}>
                {MEAL_STATIC[nextMealInfo.type]?.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('dash.next_meal')}</p>
                <p style={{ fontSize: 15, fontWeight: 600 }}>{t(`meal.${nextMealInfo.type}`)}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>
                  🕐 {MEAL_STATIC[nextMealInfo.type]?.time}
                  {nextMealInfo.meal.kcal ? ` · ${r0(nextMealInfo.meal.kcal)} kcal` : ''}
                </p>
              </div>
              <ChevronRight size={16} color="var(--text-muted)" />
            </div>
          </Link>
          </motion.div>
        )}

        {/* Weight + diet summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <motion.div className="card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: dark ? '#7c3aed26' : '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <Scale size={18} color="#7c3aed" />
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{t('dash.current_weight', 'Peso attuale')}</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{weight ? `${weight} kg` : '–'}</p>
            {profile?.target_weight && <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{t('dash.target_weight_label', { weight: profile.target_weight }, 'Obiettivo: {{weight}} kg')}</p>}
          </motion.div>
          <motion.div className="card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.07, duration: 0.38, ease: [0.16, 1, 0.3, 1] }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <Leaf size={18} color="var(--green-main)" />
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{t('dash.active_plan', 'Piano attivo')}</p>
            <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{diet?.name || t('dash.no_plan', 'Nessun piano')}</p>
            {diet && <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{diet.kcal_target} kcal</p>}
            {diet && profile?.nutrition_goal && GOAL_LABELS[profile.nutrition_goal] && (
              <p style={{ fontSize: 10, color: 'var(--green-main)', marginTop: 3, fontWeight: 600 }}>
                {t('dash.goal_in_line', { goal: t(`dash.goal_${profile.nutrition_goal}`, GOAL_LABELS[profile.nutrition_goal]) }, 'In linea con il tuo obiettivo: {{goal}}')}
              </p>
            )}
          </motion.div>
        </div>

        {/* Appointment reminder */}
        {appointment && (
          <motion.div className="card" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }} style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, borderLeft: '3px solid var(--green-main)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Calendar size={20} color="var(--green-main)" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('dash.next_visit', 'Prossima visita')}</p>
              <p style={{ fontSize: 15, fontWeight: 600 }}>{appointment.title}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1, textTransform: 'capitalize' }}>
                {apptLabel} · {apptTime}
              </p>
              {appointment.notes && <p style={{ fontSize: 12, color: 'var(--green-dark)', marginTop: 4 }}>💡 {appointment.notes}</p>}
            </div>
          </motion.div>
        )}

        {/* Unread messages from dietitian */}
        {unreadChat > 0 && (
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}>
          <Link to="/chat" style={{ textDecoration: 'none' }}>
            <div className="card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, borderLeft: '3px solid #dc4a4a' }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: dark ? '#dc4a4a26' : '#fff0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
                <MessageCircle size={20} color="#dc4a4a" />
                <span style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: '50%', background: '#dc4a4a', color: 'white', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--surface-2)' }}>{unreadChat}</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('dash.unread_messages', 'Messaggi non letti')}</p>
                <p style={{ fontSize: 15, fontWeight: 600 }}>
                  {unreadChat === 1
                    ? t('dash.unreadMessagesOne', '1 nuovo messaggio dal dietista')
                    : t('dash.unreadMessagesOther', { count: unreadChat }, '{{count}} nuovi messaggi dal dietista')}
                </p>
                <p style={{ fontSize: 12, color: '#dc4a4a', fontWeight: 500, marginTop: 1 }}>{t('dash.tap_to_read', 'Tocca per leggere →')}</p>
              </div>
            </div>
          </Link>
          </motion.div>
        )}

        {/* Diet preview */}
        {diet && (
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}>
          <Link to="/dieta" style={{ textDecoration: 'none' }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '16px', gap: 8 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, var(--green-pale), #c8f5e2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Utensils size={20} color="var(--green-main)" strokeWidth={1.8} />
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t('dash.custom_plan', 'Piano personalizzato')}</p>
              <p style={{ fontSize: 15, fontWeight: 600 }}>{diet.name || t('dash.view_your_diet', 'Vedi la tua dieta')}</p>
              {diet.notes && <p style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '90%' }}>{diet.notes}</p>}
              <span style={{ fontSize: 12, color: 'var(--green-main)', fontWeight: 600, marginTop: 2 }}>{t('dash.view_diet_arrow', 'Vedi dieta →')}</span>
            </div>
          </Link>
          </motion.div>
        )}
        {/* ── Pro promo card — solo se non Pro ── */}
        {!isPro && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
          <Link to="/pro" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, #1E1B4B, #4338CA)',
              borderRadius: 18, padding: '16px 18px',
              display: 'flex', alignItems: 'center', gap: 14, position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
              <div style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0, background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star size={22} color="white" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: 'white', fontWeight: 800, fontSize: 15, margin: '0 0 2px' }}>{t('profile.pro_discover_badge', 'Scopri NutriPlan Pro')}</p>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, margin: 0 }}>{t('dash.pro_promo_desc', '8 funzioni esclusive · 7 giorni gratis →')}</p>
              </div>
              <ChevronRight size={18} color="rgba(255,255,255,0.6)" style={{ flexShrink: 0 }} />
            </div>
          </Link>
          </motion.div>
        )}

        {/* ── Quiz del giorno ── */}
        <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
          <QuizBannerCard onOpen={() => setShowQuiz(true)} />
        </motion.div>

        {/* ── AI Daily Tips ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <DailyTipsCard />
        </motion.div>

        {/* ── Lezione del giorno (percorso educativo quotidiano) ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <DailyLessonCard />
        </motion.div>

        {/* ── Feature 4: Streak Calendar ── */}
        <motion.div
          className="card"
          style={{ padding: '14px 16px' }}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{t('dash.food_progress_title', 'Il mio progresso alimentare')}</p>
          <StreakCalendar />
        </motion.div>

        <div style={{ height: 8 }} />
      </div>

      {/* Onboarding overlay — shown only on first login */}
      {showOnboarding && (
        <OnboardingFlow onComplete={handleOnboardingDone} />
      )}

      {/* Quiz modal — backdrop + centered card, rendered via portal above BottomNav */}
      {showQuiz && createPortal(
        <AnimatePresence>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowQuiz(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 16px' }}
          >
            {/* Card — stop propagation so clicking inside doesn't close */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#ffffff', borderRadius: 24, width: '100%', maxWidth: 460, maxHeight: '88dvh', overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column' }}
            >
              {/* Card header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px 12px', borderBottom: '1px solid var(--border-light)', flexShrink: 0 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>🧠 {t('dash.quiz_of_the_day', 'Quiz del giorno')}</span>
                <button
                  onClick={() => setShowQuiz(false)}
                  aria-label={t('dash.quiz_close_aria', 'Chiudi quiz')}
                  style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1 }}
                >✕</button>
              </div>
              {/* Quiz content */}
              <Suspense fallback={<div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}><div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--green-main)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /></div>}>
                <QuizPage inModal />
              </Suspense>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}

      {/* Dashboard tutorial — shown only on first visit after onboarding */}
      {!showOnboarding && isDashFirstVisit && (
        <TutorialTooltip
          steps={tutorialSteps}
          pageKey="dashboard"
          onDone={() => {}}
        />
      )}
    </div>
  )
}
