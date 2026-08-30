import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useT } from '../i18n'
import ProGate from '../components/ProGate'
import { useSubscription } from '../hooks/useSubscription'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Cell, RadialBarChart,
  RadialBar, Legend,
} from 'recharts'
import {
  BarChart2, TrendingUp, TrendingDown, Minus, FileText,
  Download, Droplets, Scale, Flame, ChevronLeft, ChevronRight,
  Check, X as XIcon, Lock,
} from 'lucide-react'
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, parseISO, addWeeks, subWeeks } from 'date-fns'
import { it } from 'date-fns/locale'

// ── helpers ────────────────────────────────────────────────────
const TABS_STATIC = [
  { key: 'weekly', emoji: '📊' },
  { key: 'adherence', emoji: '✅' },
  { key: 'micro', emoji: '🥕' },
  { key: 'comparison', emoji: '⚖️' },
  { key: 'insights', emoji: '🔎' },
  { key: 'report', emoji: '📄' },
]
// Fallback labels (Italian) used while the translation dictionary loads/updates.
const TAB_LABEL_FALLBACK = {
  weekly: '📊 Settimana',
  adherence: '✅ Aderenza',
  micro: '🥕 Micro',
  comparison: '⚖️ Confronto',
  insights: '🔎 Insight',
  report: '📄 Report PDF',
}

// Soglia minima di giorni con entrambi i valori disponibili prima di mostrare
// un insight — sotto questa soglia la differenza tra bucket è più rumore che
// segnale, meglio non mostrare nulla che mostrare un confronto fuorviante.
const MIN_INSIGHT_DAYS = 10

// Divide le righe in due gruppi in base alla mediana di `field`, poi
// confronta la media di `compareField` tra i due gruppi. Nessuna libreria
// statistica: solo bucket sopra/sotto mediana e media semplice, per restare
// leggibile e trasparente (non un claim di causalità).
function medianSplitInsight(rows, field, compareField) {
  const valid = rows.filter(r => isFinite(r[field]) && isFinite(r[compareField]))
  if (valid.length < MIN_INSIGHT_DAYS) return null
  const sorted = [...valid].sort((a, b) => a[field] - b[field])
  const mid = Math.floor(sorted.length / 2)
  const median = sorted.length % 2 ? sorted[mid][field] : (sorted[mid - 1][field] + sorted[mid][field]) / 2
  const below = valid.filter(r => r[field] < median)
  const above = valid.filter(r => r[field] >= median)
  if (below.length < 3 || above.length < 3) return null
  return {
    n: valid.length,
    median,
    belowAvg: avg(below.map(r => r[compareField])),
    aboveAvg: avg(above.map(r => r[compareField])),
    belowN: below.length,
    aboveN: above.length,
  }
}

// Micronutrienti: valori di riferimento giornalieri per adulti (LARN/EFSA,
// arrotondati). `max: true` = soglia da NON superare (sodio, colesterolo),
// semantica inversa rispetto ai fabbisogni. Il ferro e i folati variano per
// sesso: risolti a runtime da profile.gender.
const MICRO_META = [
  { key: 'fiber_100g', i18nKey: 'fiber', label: 'Fibre', emoji: '🌾', unit: 'g', ref: { M: 25, F: 25 } },
  { key: 'iron_100g', i18nKey: 'iron', label: 'Ferro', emoji: '🩸', unit: 'mg', ref: { M: 10, F: 18 } },
  { key: 'calcium_100g', i18nKey: 'calcium', label: 'Calcio', emoji: '🦴', unit: 'mg', ref: { M: 1000, F: 1000 } },
  { key: 'magnesium_100g', i18nKey: 'magnesium', label: 'Magnesio', emoji: '⚡', unit: 'mg', ref: { M: 240, F: 240 } },
  { key: 'potassium_100g', i18nKey: 'potassium', label: 'Potassio', emoji: '🍌', unit: 'mg', ref: { M: 3900, F: 3900 } },
  { key: 'zinc_100g', i18nKey: 'zinc', label: 'Zinco', emoji: '🛡️', unit: 'mg', ref: { M: 12, F: 9 } },
  { key: 'folate_100g', i18nKey: 'folate', label: 'Folati', emoji: '🥬', unit: 'µg', ref: { M: 400, F: 400 } },
  { key: 'selenium_100g', i18nKey: 'selenium', label: 'Selenio', emoji: '🥜', unit: 'µg', ref: { M: 55, F: 55 } },
  { key: 'sodium_100g', i18nKey: 'sodium', label: 'Sodio', emoji: '🧂', unit: 'mg', ref: { M: 2000, F: 2000 }, max: true },
  { key: 'cholesterol_100g', i18nKey: 'cholesterol', label: 'Colesterolo', emoji: '🫀', unit: 'mg', ref: { M: 300, F: 300 }, max: true },
]

const MEAL_TYPES = ['colazione', 'spuntino_mattina', 'pranzo', 'spuntino_pomeriggio', 'cena']
const MEAL_LABELS = {
  colazione: 'Colazione',
  spuntino_mattina: 'Spuntino mat.',
  pranzo: 'Pranzo',
  spuntino_pomeriggio: 'Merenda',
  cena: 'Cena',
}

function isoDate(d) {
  return d.toISOString().split('T')[0]
}

function avg(arr) {
  if (!arr.length) return 0
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

function round1(n) { return Math.round((n || 0) * 10) / 10 }

// ── custom tooltip ─────────────────────────────────────────────
function SmallTooltip({ active, payload, label, unit = '' }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 12, boxShadow: 'var(--shadow-sm)' }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: 2 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {round1(p.value)}{unit}
        </p>
      ))}
    </div>
  )
}

// ── stat card ──────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, trend, bg = 'var(--icon-bg-green)', fg = 'var(--green-main)' }) {
  const t = useT()
  const trendColor = trend > 0 ? 'var(--green-main)' : trend < 0 ? 'var(--red)' : 'var(--text-muted)'
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 14, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: bg, color: fg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {icon}
        </div>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>{label}</span>
      </div>
      <p style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.1 }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sub}</p>}
      {trend !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: trendColor, fontSize: 11, fontWeight: 600 }}>
          {trend > 0 ? <TrendingUp size={12} /> : trend < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
          {trend > 0 ? '+' : ''}{round1(trend)} {t('stats.vs_prev_week', 'vs settimana prec.')}
        </div>
      )}
    </div>
  )
}

// ── main component ─────────────────────────────────────────────
export default function StatisticsPage() {
  const { user, profile } = useAuth()
  const { isPro } = useSubscription()
  const t = useT()
  const [tab, setTab] = useState('weekly')
  const [loading, setLoading] = useState(true)

  // data
  const [weekOffset, setWeekOffset] = useState(0) // 0 = current week
  const [weekData, setWeekData] = useState({ macros: [], water: [], weights: [] })
  const [prevWeekData, setPrevWeekData] = useState({ macros: [], water: [], weights: [] })
  const [adherenceData, setAdherenceData] = useState([])
  const [dietTarget, setDietTarget] = useState(null)
  const [mealsCount, setMealsCount] = useState(3)
  const [generatingPdf, setGeneratingPdf] = useState(false)
  const [microData, setMicroData] = useState(null) // caricato lazy al primo ingresso nel tab Micro
  const [insightsData, setInsightsData] = useState(null) // caricato lazy al primo ingresso nel tab Insight
  const [pdfMode, setPdfMode] = useState('weekly')
  const [monthStr, setMonthStr] = useState(format(new Date(), 'yyyy-MM'))
  const [generatingMonthlyPdf, setGeneratingMonthlyPdf] = useState(false)

  const { today, weekStart, weekEnd, prevWeekStart, prevWeekEnd } = useMemo(() => {
    const d = new Date()
    const ws = startOfWeek(subWeeks(d, weekOffset), { weekStartsOn: 1 })
    const we = endOfWeek(ws, { weekStartsOn: 1 })
    return { today: d, weekStart: ws, weekEnd: we, prevWeekStart: subWeeks(ws, 1), prevWeekEnd: subWeeks(we, 1) }
  }, [weekOffset])

  useEffect(() => {
    if (!isPro && weekOffset > 0) { setWeekOffset(0); return }
    loadAll()
  }, [weekOffset, isPro])

  // Micronutrienti: aggregati dal food_data dei log della settimana corrente.
  // Query separata e lazy (solo quando si apre il tab): food_data è jsonb
  // pesante e non serve agli altri tab.
  useEffect(() => {
    if (tab !== 'micro' || !user?.id) return
    setMicroData(null)
    const ws = isoDate(weekStart)
    const we = isoDate(weekEnd)
    supabase.from('food_logs')
      .select('date,grams,food_data')
      .eq('user_id', user.id).gte('date', ws).lte('date', we)
      .neq('food_name', '__note__').limit(600)
      .then(({ data }) => {
        const rows = data || []
        const totals = {}
        const days = new Set()
        let withMicro = 0
        for (const r of rows) {
          const fd = r.food_data
          if (!fd || fd.isNote) continue
          days.add(r.date)
          const factor = (parseFloat(r.grams) || 0) / 100
          let any = false
          for (const m of MICRO_META) {
            const v = parseFloat(fd[m.key])
            if (isFinite(v) && v > 0) { totals[m.key] = (totals[m.key] || 0) + v * factor; any = true }
          }
          if (any) withMicro++
        }
        const nDays = Math.max(1, days.size)
        const daily = {}
        for (const m of MICRO_META) daily[m.key] = (totals[m.key] || 0) / nDays
        setMicroData({ daily, nDays: days.size, nLogs: rows.length, withMicro })
      })
  }, [tab, user?.id, weekOffset]) // eslint-disable-line react-hooks/exhaustive-deps

  // Insight di correlazione: finestra fissa di 30 giorni (indipendente dal
  // navigatore settimanale sopra), caricata lazy solo quando si apre il tab
  // — stesso pattern del tab Micro. Unisce daily_logs (proteine) e
  // daily_wellness (umore/energia/sonno) per data.
  useEffect(() => {
    if (tab !== 'insights' || !user?.id || insightsData) return
    const since = isoDate(subDays(new Date(), 30))
    Promise.all([
      supabase.from('daily_logs').select('date,proteins').eq('user_id', user.id).gte('date', since),
      supabase.from('daily_wellness').select('date,mood,energy,sleep_hours').eq('user_id', user.id).gte('date', since),
    ]).then(([macroRes, wellnessRes]) => {
      const macroByDate = {}
      for (const m of macroRes.data || []) macroByDate[m.date] = m.proteins
      const rows = (wellnessRes.data || []).map(w => ({
        date: w.date,
        proteins: macroByDate[w.date] != null ? parseFloat(macroByDate[w.date]) : null,
        mood: w.mood != null ? parseFloat(w.mood) : null,
        energy: w.energy != null ? parseFloat(w.energy) : null,
        sleepHours: w.sleep_hours != null ? parseFloat(w.sleep_hours) : null,
      }))
      setInsightsData({
        proteinEnergy: medianSplitInsight(rows, 'proteins', 'energy'),
        sleepMood: medianSplitInsight(rows, 'sleepHours', 'mood'),
      })
    })
  }, [tab, user?.id, insightsData])

  async function loadAll() {
    setLoading(true)
    const ws = isoDate(weekStart)
    const we = isoDate(weekEnd)
    const pws = isoDate(prevWeekStart)
    const pwe = isoDate(prevWeekEnd)

    const [macroRes, waterRes, weightRes, pMacroRes, pWaterRes, pWeightRes, dietRes, adherenceRes] = await Promise.all([
      supabase.from('daily_logs').select('date,kcal,proteins,carbs,fats').eq('user_id', user.id).gte('date', ws).lte('date', we).order('date'),
      supabase.from('water_logs').select('date,amount_ml').eq('user_id', user.id).gte('date', ws).lte('date', we),
      supabase.from('weight_logs').select('date,weight_kg').eq('user_id', user.id).gte('date', ws).lte('date', we),
      supabase.from('daily_logs').select('date,kcal,proteins,carbs,fats').eq('user_id', user.id).gte('date', pws).lte('date', pwe).order('date'),
      supabase.from('water_logs').select('date,amount_ml').eq('user_id', user.id).gte('date', pws).lte('date', pwe),
      supabase.from('weight_logs').select('date,weight_kg').eq('user_id', user.id).gte('date', pws).lte('date', pwe),
      supabase.from('patient_diets').select('kcal_target,protein_target,carbs_target,fats_target,meals_count').eq('user_id', user.id).eq('is_active', true).maybeSingle(),
      supabase.from('food_logs').select('date,meal_type').eq('user_id', user.id).gte('date', pws).lte('date', we).limit(300),
    ])

    setDietTarget(dietRes.data || null)
    setMealsCount(dietRes.data?.meals_count || 3)

    // aggregate water by date
    const waterByDate = {}
    for (const w of waterRes.data || []) {
      waterByDate[w.date] = (waterByDate[w.date] || 0) + w.amount_ml
    }
    const pWaterByDate = {}
    for (const w of pWaterRes.data || []) {
      pWaterByDate[w.date] = (pWaterByDate[w.date] || 0) + w.amount_ml
    }

    setWeekData({
      macros: macroRes.data || [],
      water: Object.entries(waterByDate).map(([date, ml]) => ({ date, ml })),
      weights: weightRes.data || [],
    })
    setPrevWeekData({
      macros: pMacroRes.data || [],
      water: Object.entries(pWaterByDate).map(([date, ml]) => ({ date, ml })),
      weights: pWeightRes.data || [],
    })

    // adherence: for each day in 2-week window, which meal types were logged
    const allFoodLogs = adherenceRes.data || []
    const loggedMealsByDate = {}
    for (const fl of allFoodLogs) {
      if (!loggedMealsByDate[fl.date]) loggedMealsByDate[fl.date] = new Set()
      loggedMealsByDate[fl.date].add(fl.meal_type)
    }
    const expectedMeals = (dietRes.data?.meals_count || 3)
    const daysRange = eachDayOfInterval({ start: prevWeekStart, end: weekEnd })
    const adh = daysRange.map(d => {
      const ds = isoDate(d)
      const logged = loggedMealsByDate[ds]?.size || 0
      return {
        date: ds,
        label: format(d, 'dd/MM', { locale: it }),
        dayLabel: format(d, 'EEE', { locale: it }),
        pct: Math.min(100, Math.round((logged / expectedMeals) * 100)),
        logged,
        expected: expectedMeals,
      }
    })
    setAdherenceData(adh)
    setLoading(false)
  }

  // ── computed weekly stats ──────────────────────────────────────
  const days7 = eachDayOfInterval({ start: weekStart, end: weekEnd })

  function buildDailyChart() {
    return days7.map(d => {
      const ds = isoDate(d)
      const m = weekData.macros.find(x => x.date === ds) || {}
      const waterEntries = weekData.water.filter(x => x.date === ds)
      const waterMl = waterEntries.reduce((a, b) => a + b.ml, 0)
      // null (not 0) when the day has no log at all, so the PDF table below can
      // tell "nothing logged" apart from "logged, totals to exactly 0" — a
      // fasting/water-only day. The bar chart renders a null bar as an empty
      // gap, same as it did with a 0-height bar, so this doesn't change it.
      return {
        label: format(d, 'EEE', { locale: it }),
        kcal: m.kcal != null ? m.kcal : null,
        proteins: m.proteins != null ? Math.round(m.proteins) : null,
        carbs: m.carbs != null ? Math.round(m.carbs) : null,
        fats: m.fats != null ? Math.round(m.fats) : null,
        water: waterMl,
      }
    })
  }

  const dailyChart = buildDailyChart()

  // kcal rounded to an integer, macros to 1 decimal (CLAUDE.md "Macro Calculations")
  const weekAvg = {
    kcal: Math.round(avg(weekData.macros.map(m => m.kcal || 0))),
    proteins: round1(avg(weekData.macros.map(m => m.proteins || 0))),
    carbs: round1(avg(weekData.macros.map(m => m.carbs || 0))),
    fats: round1(avg(weekData.macros.map(m => m.fats || 0))),
    water: round1(avg(weekData.water.map(w => w.ml || 0))),
    weight: weekData.weights.length ? round1(avg(weekData.weights.map(w => w.weight_kg))) : null,
  }
  const prevAvg = {
    kcal: Math.round(avg(prevWeekData.macros.map(m => m.kcal || 0))),
    proteins: round1(avg(prevWeekData.macros.map(m => m.proteins || 0))),
    carbs: round1(avg(prevWeekData.macros.map(m => m.carbs || 0))),
    fats: round1(avg(prevWeekData.macros.map(m => m.fats || 0))),
    water: round1(avg(prevWeekData.water.map(w => w.ml || 0))),
    weight: prevWeekData.weights.length ? round1(avg(prevWeekData.weights.map(w => w.weight_kg))) : null,
  }

  const weekLabel = `${format(weekStart, 'd MMM', { locale: it })} – ${format(weekEnd, 'd MMM yyyy', { locale: it })}`

  // ── PDF generation ─────────────────────────────────────────────
  async function generatePdf() {
    setGeneratingPdf(true)
    try {
      const { default: jsPDF } = await import('jspdf')
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const W = 210
      const margin = 14
      let y = 20

      const addText = (text, x, yy, opts = {}) => {
        doc.setFontSize(opts.size || 10)
        doc.setFont('helvetica', opts.style || 'normal')
        doc.setTextColor(...(opts.color || [30, 30, 30]))
        doc.text(text, x, yy)
      }

      const addLine = (yy) => {
        doc.setDrawColor(200, 224, 212)
        doc.setLineWidth(0.3)
        doc.line(margin, yy, W - margin, yy)
      }

      // header
      doc.setFillColor(21, 122, 74)
      doc.rect(0, 0, W, 30, 'F')
      addText(t('stats.pdf.weekly_title', 'Diet Plan Pro — Report Settimanale'), margin, 13, { size: 14, style: 'bold', color: [255, 255, 255] })
      addText(weekLabel, margin, 21, { size: 9, color: [200, 240, 220] })
      if (profile?.full_name) {
        addText(t('stats.pdf.patient', { name: profile.full_name }, 'Paziente: {{name}}'), W - margin - 50, 13, { size: 9, color: [200, 240, 220] })
      }
      addText(t('stats.pdf.generated_on', { date: format(today, 'd MMMM yyyy', { locale: it }) }, 'Generato il {{date}}'), W - margin - 50, 21, { size: 8, color: [180, 230, 200] })
      y = 40

      // summary stats
      addText(t('stats.pdf.daily_averages', 'Medie giornaliere'), margin, y, { size: 12, style: 'bold' }); y += 7
      addLine(y); y += 5

      const statsRows = [
        [t('stats.pdf.row_calories', 'Calorie'), t('stats.pdf.val_kcal_day', { value: weekAvg.kcal }, '{{value}} kcal/die'), dietTarget?.kcal_target ? t('stats.pdf.target_kcal', { value: dietTarget.kcal_target }, 'Obiettivo: {{value}} kcal') : ''],
        [t('stats.pdf.row_protein', 'Proteine'), t('stats.pdf.val_g_day', { value: weekAvg.proteins }, '{{value}} g/die'), dietTarget?.protein_target ? t('stats.pdf.target_g', { value: dietTarget.protein_target }, 'Obiettivo: {{value}} g') : ''],
        [t('stats.pdf.row_carbs', 'Carboidrati'), t('stats.pdf.val_g_day', { value: weekAvg.carbs }, '{{value}} g/die'), dietTarget?.carbs_target ? t('stats.pdf.target_g', { value: dietTarget.carbs_target }, 'Obiettivo: {{value}} g') : ''],
        [t('stats.pdf.row_fats', 'Grassi'), t('stats.pdf.val_g_day', { value: weekAvg.fats }, '{{value}} g/die'), dietTarget?.fats_target ? t('stats.pdf.target_g', { value: dietTarget.fats_target }, 'Obiettivo: {{value}} g') : ''],
        [t('stats.pdf.row_water', 'Acqua'), weekAvg.water ? t('stats.pdf.val_ml_day', { value: Math.round(weekAvg.water) }, '{{value}} ml/die') : t('stats.pdf.na', 'N/D'), ''],
        [t('stats.pdf.row_weight_avg', 'Peso medio'), weekAvg.weight ? t('stats.pdf.val_kg', { value: weekAvg.weight }, '{{value}} kg') : t('stats.pdf.na', 'N/D'), ''],
      ]
      for (const [label, val, note] of statsRows) {
        doc.setFillColor(247, 250, 248)
        doc.rect(margin, y - 4, W - margin * 2, 7, 'F')
        addText(label, margin + 2, y, { size: 9, style: 'bold', color: [45, 74, 56] })
        addText(val, 80, y, { size: 9 })
        addText(note, 130, y, { size: 8, color: [107, 143, 122] })
        y += 8
      }

      // daily breakdown
      y += 4
      addText(t('stats.pdf.daily_breakdown', 'Dettaglio giornaliero'), margin, y, { size: 12, style: 'bold' }); y += 7
      addLine(y); y += 5

      // header row
      const cols = [margin + 2, 40, 72, 100, 128, 156]
      const headers = [
        t('stats.pdf.col_date', 'Data'),
        t('stats.pdf.col_kcal', 'Kcal'),
        t('stats.pdf.col_protein_short', 'Prot.'),
        t('stats.pdf.col_carbs_short', 'Carbo'),
        t('stats.pdf.col_fats', 'Grassi'),
        t('stats.pdf.col_water', 'Acqua'),
      ]
      doc.setFillColor(21, 122, 74)
      doc.rect(margin, y - 4.5, W - margin * 2, 7, 'F')
      headers.forEach((h, i) => addText(h, cols[i], y, { size: 8, style: 'bold', color: [255, 255, 255] }))
      y += 8

      for (const row of dailyChart) {
        if (y > 260) { doc.addPage(); y = 20 }
        const rowIdx = dailyChart.indexOf(row)
        if (rowIdx % 2 === 0) { doc.setFillColor(240, 250, 245); doc.rect(margin, y - 4.5, W - margin * 2, 7, 'F') }
        const vals = [row.label, row.kcal != null ? row.kcal : '–', row.proteins != null ? row.proteins : '–', row.carbs != null ? row.carbs : '–', row.fats != null ? row.fats : '–', row.water ? `${Math.round(row.water)} ml` : '–']
        vals.forEach((v, i) => addText(String(v), cols[i], y, { size: 8 }))
        y += 8
      }

      // adherence
      y += 6
      if (y > 240) { doc.addPage(); y = 20 }
      addText(t('stats.pdf.diet_adherence', 'Aderenza alla dieta'), margin, y, { size: 12, style: 'bold' }); y += 7
      addLine(y); y += 5

      const weekAdh = adherenceData.filter(d => d.date >= isoDate(weekStart) && d.date <= isoDate(weekEnd))
      const avgAdh = weekAdh.length ? Math.round(avg(weekAdh.map(d => d.pct))) : 0
      addText(t('stats.pdf.weekly_avg', { value: avgAdh }, 'Media settimanale: {{value}}%'), margin + 2, y, { size: 10, style: 'bold', color: avgAdh >= 80 ? [21, 122, 74] : avgAdh >= 50 ? [200, 120, 20] : [180, 40, 40] })
      y += 8

      for (const d of weekAdh) {
        if (y > 270) { doc.addPage(); y = 20 }
        const barW = Math.round((d.pct / 100) * (W - margin * 2 - 50))
        doc.setFillColor(d.pct >= 80 ? 21 : d.pct >= 50 ? 200 : 180, d.pct >= 80 ? 122 : d.pct >= 50 ? 120 : 40, d.pct >= 80 ? 74 : d.pct >= 50 ? 20 : 40)
        doc.rect(margin + 38, y - 3.5, barW, 5, 'F')
        addText(`${d.label} (${d.dayLabel})`, margin + 2, y, { size: 8 })
        addText(`${d.pct}%`, margin + 38 + barW + 2, y, { size: 8, style: 'bold' })
        y += 7
      }

      // notes
      y += 6
      if (y > 250) { doc.addPage(); y = 20 }
      addText(t('stats.pdf.notes', 'Note'), margin, y, { size: 12, style: 'bold' }); y += 7
      addLine(y); y += 5
      doc.setFillColor(247, 250, 248)
      doc.rect(margin, y - 4, W - margin * 2, 30, 'F')
      addText('_____________________________________', margin + 2, y + 5, { size: 9, color: [180, 200, 190] })
      addText('_____________________________________', margin + 2, y + 13, { size: 9, color: [180, 200, 190] })
      addText('_____________________________________', margin + 2, y + 21, { size: 9, color: [180, 200, 190] })

      // footer
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        addText(t('stats.pdf.page_footer', { page: i, total: pageCount }, 'Diet Plan Pro • Pagina {{page}} di {{total}}'), margin, 290, { size: 8, color: [150, 170, 160] })
        addText(t('stats.pdf.confidential', 'Documento riservato — da condividere con il proprio dietista'), W - margin - 80, 290, { size: 7, color: [180, 200, 190] })
      }

      const fileName = `report_${format(weekStart, 'yyyy-MM-dd')}_${profile?.full_name?.replace(/\s+/g, '_') || t('stats.pdf.patient_filename', 'paziente')}.pdf`
      doc.save(fileName)
    } finally {
      setGeneratingPdf(false)
    }
  }

  // ── Monthly PDF generation ─────────────────────────────────────
  async function generateMonthlyPdf() {
    setGeneratingMonthlyPdf(true)
    try {
      const [yearStr, monStr] = monthStr.split('-')
      const year = parseInt(yearStr)
      const mon = parseInt(monStr) - 1
      const monthStart = new Date(year, mon, 1)
      const monthEnd = new Date(year, mon + 1, 0)
      const msStr = isoDate(monthStart)
      const meStr = isoDate(monthEnd)

      const [macroRes, waterRes, weightRes, adherenceRes, dietRes] = await Promise.all([
        supabase.from('daily_logs').select('date,kcal,proteins,carbs,fats').eq('user_id', user.id).gte('date', msStr).lte('date', meStr).order('date'),
        supabase.from('water_logs').select('date,amount_ml').eq('user_id', user.id).gte('date', msStr).lte('date', meStr),
        supabase.from('weight_logs').select('date,weight_kg').eq('user_id', user.id).gte('date', msStr).lte('date', meStr),
        supabase.from('food_logs').select('date,meal_type').eq('user_id', user.id).gte('date', msStr).lte('date', meStr).limit(1000),
        supabase.from('patient_diets').select('kcal_target,protein_target,carbs_target,fats_target,meals_count').eq('user_id', user.id).eq('is_active', true).maybeSingle(),
      ])

      const macros = macroRes.data || []
      const waterByDate = {}
      for (const w of waterRes.data || []) waterByDate[w.date] = (waterByDate[w.date] || 0) + w.amount_ml
      const weightArr = weightRes.data || []
      const allFoodLogs = adherenceRes.data || []
      const diet = dietRes.data || null
      const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
      const daysInMonth = allDays.length

      const monthMacroAvg = {
        kcal: Math.round(avg(macros.map(m => m.kcal || 0))),
        proteins: round1(avg(macros.map(m => m.proteins || 0))),
        carbs: round1(avg(macros.map(m => m.carbs || 0))),
        fats: round1(avg(macros.map(m => m.fats || 0))),
      }
      const monthWaterAvg = Object.values(waterByDate).length ? round1(avg(Object.values(waterByDate))) : 0
      const monthWeightAvg = weightArr.length ? round1(avg(weightArr.map(w => w.weight_kg))) : null
      const daysLogged = macros.filter(m => (m.kcal || 0) > 0).length

      const loggedMealsByDate = {}
      for (const fl of allFoodLogs) {
        if (!loggedMealsByDate[fl.date]) loggedMealsByDate[fl.date] = new Set()
        loggedMealsByDate[fl.date].add(fl.meal_type)
      }
      const expectedMeals = diet?.meals_count || 3
      const avgMonthAdh = round1(avg(allDays.map(d => {
        const ds = isoDate(d)
        return Math.min(100, Math.round(((loggedMealsByDate[ds]?.size || 0) / expectedMeals) * 100))
      })))

      const { default: jsPDF } = await import('jspdf')
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const W = 210
      const margin = 14
      let y = 20

      const addText = (text, x, yy, opts = {}) => {
        doc.setFontSize(opts.size || 10)
        doc.setFont('helvetica', opts.style || 'normal')
        doc.setTextColor(...(opts.color || [30, 30, 30]))
        doc.text(text, x, yy)
      }
      const addLine = (yy) => {
        doc.setDrawColor(200, 224, 212)
        doc.setLineWidth(0.3)
        doc.line(margin, yy, W - margin, yy)
      }

      const monthName = format(monthStart, 'MMMM yyyy', { locale: it })

      doc.setFillColor(21, 122, 74)
      doc.rect(0, 0, W, 30, 'F')
      addText(t('stats.pdf.monthly_title', 'Diet Plan Pro - Report Mensile'), margin, 13, { size: 14, style: 'bold', color: [255, 255, 255] })
      addText(monthName, margin, 21, { size: 9, color: [200, 240, 220] })
      if (profile?.full_name) addText(t('stats.pdf.patient', { name: profile.full_name }, 'Paziente: {{name}}'), W - margin - 50, 13, { size: 9, color: [200, 240, 220] })
      addText(t('stats.pdf.generated_on', { date: format(today, 'd MMMM yyyy', { locale: it }) }, 'Generato il {{date}}'), W - margin - 50, 21, { size: 8, color: [180, 230, 200] })
      y = 40

      addText(t('stats.pdf.monthly_averages', 'Medie mensili'), margin, y, { size: 12, style: 'bold' }); y += 7
      addLine(y); y += 5
      const statsRows = [
        [t('stats.pdf.month_row_calories', 'Calorie medie'), t('stats.pdf.val_kcal_day', { value: monthMacroAvg.kcal }, '{{value}} kcal/die'), diet?.kcal_target ? t('stats.pdf.target_kcal', { value: diet.kcal_target }, 'Obiettivo: {{value}} kcal') : ''],
        [t('stats.pdf.month_row_protein', 'Proteine medie'), t('stats.pdf.val_g_day', { value: monthMacroAvg.proteins }, '{{value}} g/die'), diet?.protein_target ? t('stats.pdf.target_g', { value: diet.protein_target }, 'Obiettivo: {{value}} g') : ''],
        [t('stats.pdf.month_row_carbs', 'Carboidrati medi'), t('stats.pdf.val_g_day', { value: monthMacroAvg.carbs }, '{{value}} g/die'), diet?.carbs_target ? t('stats.pdf.target_g', { value: diet.carbs_target }, 'Obiettivo: {{value}} g') : ''],
        [t('stats.pdf.month_row_fats', 'Grassi medi'), t('stats.pdf.val_g_day', { value: monthMacroAvg.fats }, '{{value}} g/die'), diet?.fats_target ? t('stats.pdf.target_g', { value: diet.fats_target }, 'Obiettivo: {{value}} g') : ''],
        [t('stats.pdf.month_row_water', 'Acqua media'), monthWaterAvg ? t('stats.pdf.val_ml_day', { value: Math.round(monthWaterAvg) }, '{{value}} ml/die') : t('stats.pdf.na', 'N/D'), ''],
        [t('stats.pdf.row_weight_avg', 'Peso medio'), monthWeightAvg ? t('stats.pdf.val_kg', { value: monthWeightAvg }, '{{value}} kg') : t('stats.pdf.na', 'N/D'), ''],
        [t('stats.pdf.days_logged', 'Giorni registrati'), t('stats.pdf.days_ratio', { logged: daysLogged, total: daysInMonth }, '{{logged}} / {{total}}'), ''],
        [t('stats.pdf.month_row_adherence', 'Aderenza media'), `${avgMonthAdh}%`, ''],
      ]
      for (const [label, val, note] of statsRows) {
        doc.setFillColor(247, 250, 248)
        doc.rect(margin, y - 4, W - margin * 2, 7, 'F')
        addText(label, margin + 2, y, { size: 9, style: 'bold', color: [45, 74, 56] })
        addText(val, 80, y, { size: 9 })
        addText(note, 130, y, { size: 8, color: [107, 143, 122] })
        y += 8
      }

      y += 4
      addText(t('stats.pdf.weekly_summary', 'Riepilogo settimanale'), margin, y, { size: 12, style: 'bold' }); y += 7
      addLine(y); y += 5
      const cols = [margin + 2, 46, 76, 104, 132, 160]
      const hdrs = [
        t('stats.pdf.col_week', 'Settimana'),
        t('stats.pdf.col_kcal', 'Kcal'),
        t('stats.pdf.col_protein_short', 'Prot.'),
        t('stats.pdf.col_carbs_short', 'Carbo'),
        t('stats.pdf.col_fats', 'Grassi'),
        t('stats.pdf.col_water', 'Acqua'),
      ]
      doc.setFillColor(21, 122, 74)
      doc.rect(margin, y - 4.5, W - margin * 2, 7, 'F')
      hdrs.forEach((h, i) => addText(h, cols[i], y, { size: 8, style: 'bold', color: [255, 255, 255] }))
      y += 8

      let cur = new Date(monthStart)
      let wn = 1
      while (cur <= monthEnd) {
        const wEnd = new Date(Math.min(new Date(year, mon, cur.getDate() + 6).getTime(), monthEnd.getTime()))
        const wsStr = isoDate(cur)
        const weStr = isoDate(wEnd)
        const wMacros = macros.filter(m => m.date >= wsStr && m.date <= weStr)
        const wWater = Object.entries(waterByDate).filter(([d]) => d >= wsStr && d <= weStr).map(([, ml]) => ml)
        if (y > 265) { doc.addPage(); y = 20 }
        if (wn % 2 === 0) { doc.setFillColor(240, 250, 245); doc.rect(margin, y - 4.5, W - margin * 2, 7, 'F') }
        const wLabel = t('stats.pdf.week_label', { n: wn, start: format(cur, 'd/M', { locale: it }), end: format(wEnd, 'd/M', { locale: it }) }, 'Sett.{{n}} ({{start}}-{{end}})')
        const wVals = [
          wLabel,
          wMacros.length ? String(round1(avg(wMacros.map(m => m.kcal || 0)))) : '-',
          wMacros.length ? String(round1(avg(wMacros.map(m => m.proteins || 0)))) : '-',
          wMacros.length ? String(round1(avg(wMacros.map(m => m.carbs || 0)))) : '-',
          wMacros.length ? String(round1(avg(wMacros.map(m => m.fats || 0)))) : '-',
          wWater.length ? `${Math.round(avg(wWater))}ml` : '-',
        ]
        wVals.forEach((v, i) => addText(v, cols[i], y, { size: 8 }))
        y += 8
        cur = new Date(year, mon, cur.getDate() + 7)
        wn++
      }

      y += 4
      if (y > 230) { doc.addPage(); y = 20 }
      addText(t('stats.pdf.daily_breakdown', 'Dettaglio giornaliero'), margin, y, { size: 12, style: 'bold' }); y += 7
      addLine(y); y += 5
      doc.setFillColor(21, 122, 74)
      doc.rect(margin, y - 4.5, W - margin * 2, 7, 'F')
      hdrs.forEach((h, i) => addText(h, cols[i], y, { size: 8, style: 'bold', color: [255, 255, 255] }))
      y += 8

      for (const [i, d] of allDays.entries()) {
        if (y > 265) { doc.addPage(); y = 20 }
        const ds = isoDate(d)
        const row = macros.find(m => m.date === ds) || {}
        const waterMl = waterByDate[ds] || 0
        if (i % 2 === 0) { doc.setFillColor(240, 250, 245); doc.rect(margin, y - 4.5, W - margin * 2, 7, 'F') }
        const rowVals = [
          format(d, 'dd/MM EEE', { locale: it }),
          row.kcal != null ? String(row.kcal) : '-',
          row.proteins != null ? String(round1(row.proteins)) : '-',
          row.carbs != null ? String(round1(row.carbs)) : '-',
          row.fats != null ? String(round1(row.fats)) : '-',
          waterMl ? `${Math.round(waterMl)}ml` : '-',
        ]
        rowVals.forEach((v, idx) => addText(v, cols[idx], y, { size: 7.5 }))
        y += 7
      }

      y += 6
      if (y > 250) { doc.addPage(); y = 20 }
      addText(t('stats.pdf.notes_dietitian', 'Note per il dietista'), margin, y, { size: 12, style: 'bold' }); y += 7
      addLine(y); y += 5
      doc.setFillColor(247, 250, 248)
      doc.rect(margin, y - 4, W - margin * 2, 30, 'F')
      addText('_____________________________________', margin + 2, y + 5, { size: 9, color: [180, 200, 190] })
      addText('_____________________________________', margin + 2, y + 13, { size: 9, color: [180, 200, 190] })
      addText('_____________________________________', margin + 2, y + 21, { size: 9, color: [180, 200, 190] })

      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        addText(t('stats.pdf.page_footer_dash', { page: i, total: pageCount }, 'Diet Plan Pro - Pagina {{page}} di {{total}}'), margin, 290, { size: 8, color: [150, 170, 160] })
        addText(t('stats.pdf.confidential_dash', 'Documento riservato - da condividere con il proprio dietista'), W - margin - 80, 290, { size: 7, color: [180, 200, 190] })
      }

      const fileName = `report_mensile_${monthStr}_${profile?.full_name?.replace(/\s+/g, '_') || t('stats.pdf.patient_filename', 'paziente')}.pdf`
      doc.save(fileName)
    } finally {
      setGeneratingMonthlyPdf(false)
    }
  }

  // ── adherence stats ────────────────────────────────────────────
  const weekAdherenceData = adherenceData.filter(d => d.date >= isoDate(weekStart) && d.date <= isoDate(weekEnd))
  const avgAdherence = weekAdherenceData.length ? Math.round(avg(weekAdherenceData.map(d => d.pct))) : 0

  // ── comparison chart ───────────────────────────────────────────
  const comparisonData = [
    { id: 'kcal', emoji: '🔥', name: t('stats.pdf.col_kcal', 'Kcal'), curr: weekAvg.kcal, prev: prevAvg.kcal, target: dietTarget?.kcal_target || null },
    { id: 'protein', emoji: '💪', name: t('stats.pdf.col_protein_short', 'Prot.'), curr: weekAvg.proteins, prev: prevAvg.proteins, target: dietTarget?.protein_target || null },
    { id: 'carbs', emoji: '🌾', name: t('stats.pdf.col_carbs_short', 'Carbo'), curr: weekAvg.carbs, prev: prevAvg.carbs, target: dietTarget?.carbs_target || null },
    { id: 'fats', emoji: '🥑', name: t('stats.pdf.row_fats', 'Grassi'), curr: weekAvg.fats, prev: prevAvg.fats, target: dietTarget?.fats_target || null },
  ]

  // Same nutrient → same color across tabs (kcal/prot/carbo/grassi), just a different mark (radial vs bar)
  const NUTRIENT_COLOR = { kcal: 'var(--orange)', protein: 'var(--blue)', carbs: '#eab308', fats: 'var(--red)' }
  const radialData = comparisonData
    .filter(row => row.target)
    .map(row => ({ name: row.name, value: Math.min(100, Math.round(row.curr / row.target * 100)), fill: NUTRIENT_COLOR[row.id] }))

  // ── render ─────────────────────────────────────────────────────
  return (
    <div className="page">
      {/* header */}
      <div style={{ background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))', padding: 'calc(env(safe-area-inset-top) + 20px) 24px 24px' }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 }}>{t('stats.advanced', 'Analisi avanzata')}</p>
        <h1 style={{ fontFamily: 'var(--font-d)', fontSize: 24, color: 'white', fontWeight: 300 }}>{t('stats.title')}</h1>
      </div>

      {/* tab bar */}
      <div style={{ padding: '14px 16px', background: 'var(--surface)', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', gap: 6, background: 'var(--surface-2)', borderRadius: 12, padding: 4 }}>
          {TABS_STATIC.map(tab_ => (
            <button key={tab_.key} onClick={() => setTab(tab_.key)} style={{
              flex: 1, padding: '8px 4px', borderRadius: 9, border: 'none', cursor: 'pointer', font: 'inherit',
              fontSize: 11.5, fontWeight: tab === tab_.key ? 700 : 500, transition: 'all .15s',
              background: tab === tab_.key ? 'var(--surface)' : 'transparent',
              color: tab === tab_.key ? 'var(--green-main)' : 'var(--text-muted)',
              boxShadow: tab === tab_.key ? 'var(--shadow-sm)' : 'none',
            }}>{t(`stats.tab_${tab_.key === 'weekly' ? 'week' : tab_.key}`, TAB_LABEL_FALLBACK[tab_.key])}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ height: 72, borderRadius: 14, background: 'var(--border-light)', animation: 'skeletonPulse 1.4s ease-in-out infinite', animationDelay: `${i * 0.07}s` }} />
          ))}
        </div>
      ) : (
        <div style={{ padding: '16px 16px 100px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* week navigator */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface)', borderRadius: 14, padding: '10px 16px', border: '1px solid var(--border-light)' }}>
            <button onClick={() => isPro && setWeekOffset(v => v + 1)} disabled={!isPro} aria-label={t('stats.prev_week_aria', 'Settimana precedente')} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', cursor: isPro ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', opacity: isPro ? 1 : 0.5 }}>
              {isPro ? <ChevronLeft size={16} color="var(--text-secondary)" /> : <Lock size={14} color="var(--text-muted)" />}
            </button>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 14, fontWeight: 600 }}>{weekLabel}</p>
              {weekOffset === 0 && <p style={{ fontSize: 11, color: 'var(--green-main)' }}>{t('stats.current_week', 'Settimana corrente')}</p>}
              {weekOffset > 0 && <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t(weekOffset === 1 ? 'stats.weeks_ago_one' : 'stats.weeks_ago_other', { count: weekOffset }, weekOffset === 1 ? '{{count}} settimana fa' : '{{count}} settimane fa')}</p>}
            </div>
            <button onClick={() => setWeekOffset(v => Math.max(0, v - 1))} disabled={weekOffset === 0} aria-label={t('stats.next_week_aria', 'Settimana successiva')} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', cursor: weekOffset === 0 ? 'default' : 'pointer', opacity: weekOffset === 0 ? 0.4 : 1, display: 'flex', alignItems: 'center' }}>
              <ChevronRight size={16} color="var(--text-secondary)" />
            </button>
          </div>

          {/* ── TAB: weekly report ── */}
          {tab === 'weekly' && (
            <>
              {/* summary cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { icon: <Flame size={15} />, bg: 'var(--icon-bg-orange)', fg: 'var(--orange)', label: t('stats.avg_kcal', 'Kcal media/die'), value: `${weekAvg.kcal}`, sub: dietTarget?.kcal_target ? t('stats.target_value', { value: dietTarget.kcal_target }, 'Obiettivo: {{value}}') : undefined, trend: weekAvg.kcal - prevAvg.kcal },
                  { icon: <Droplets size={15} />, bg: 'var(--icon-bg-blue)', fg: 'var(--blue)', label: t('stats.avg_water', 'Acqua media/die'), value: weekAvg.water ? `${Math.round(weekAvg.water)} ml` : t('stats.pdf.na', 'N/D'), sub: !weekAvg.water ? t('stats.log_first_glass', 'Registra il primo bicchiere') : undefined, trend: weekAvg.water && prevAvg.water ? weekAvg.water - prevAvg.water : undefined },
                  { icon: <Scale size={15} />, bg: 'var(--icon-bg-purple)', fg: 'var(--purple)', label: t('stats.avg_weight', 'Peso medio'), value: weekAvg.weight ? `${weekAvg.weight} kg` : t('stats.pdf.na', 'N/D'), sub: !weekAvg.weight ? t('stats.log_first_weight', 'Registra il primo peso') : undefined, trend: weekAvg.weight && prevAvg.weight ? weekAvg.weight - prevAvg.weight : undefined },
                  { icon: <Check size={15} />, bg: 'var(--icon-bg-green)', fg: 'var(--green-main)', label: t('stats.avg_adherence', 'Aderenza media'), value: `${avgAdherence}%`, sub: t('stats.days_ge80', { count: weekAdherenceData.filter(d => d.pct >= 80).length, total: 7 }, '{{count}}/{{total}} giorni ≥80%') },
                ].map((card, i) => (
                  <motion.div key={card.label}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <StatCard {...card} />
                  </motion.div>
                ))}
              </div>

              {/* weekly macro chart — Pro only */}
              <ProGate feature={t('stats.progate.charts_feature', 'Grafici settimanali')} teaser={t('stats.progate.charts_teaser', 'Visualizza i grafici di calorie e idratazione giorno per giorno')}>
                <div className="card" style={{ padding: '16px 10px 14px' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, paddingLeft: 6 }}>📊 {t('stats.daily_calories', 'Calorie giornaliere')}</h3>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={dailyChart} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                      <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                      <Tooltip content={<SmallTooltip unit=" kcal" />} />
                      {dietTarget?.kcal_target && <ReferenceLine y={dietTarget.kcal_target} stroke="var(--orange)" strokeDasharray="4 3" strokeWidth={1.5} label={{ value: t('stats.target', 'Target'), fontSize: 9, fill: 'var(--orange)', position: 'insideTopRight' }} />}
                      <Bar dataKey="kcal" name={t('stats.pdf.col_kcal', 'Kcal')} radius={[4, 4, 0, 0]}>
                        {dailyChart.map((e, i) => <Cell key={i} fill={dietTarget?.kcal_target && e.kcal > dietTarget.kcal_target * 1.05 ? '#e05a5a' : 'var(--green-main)'} fillOpacity={0.85} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="card" style={{ padding: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>💧 {t('stats.daily_hydration', 'Idratazione giornaliera')}</h3>
                  <ResponsiveContainer width="100%" height={140}>
                    <BarChart data={dailyChart} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                      <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                      <Tooltip content={<SmallTooltip unit=" ml" />} />
                      <ReferenceLine y={2000} stroke="#3b82f6" strokeDasharray="4 3" strokeWidth={1.5} label={{ value: '2 L', fontSize: 9, fill: '#3b82f6', position: 'insideTopRight' }} />
                      <Bar dataKey="water" name={t('stats.pdf.row_water', 'Acqua')} fill="#3b82f6" fillOpacity={0.75} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ProGate>

              {/* macro averages table */}
              <div className="card" style={{ padding: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>📈 {t('stats.weekly_averages', 'Medie settimanali')}</h3>
                {[
                  { label: t('stats.pdf.row_calories', 'Calorie'), val: `${weekAvg.kcal} kcal`, target: dietTarget?.kcal_target ? `${dietTarget.kcal_target} kcal` : null, pct: dietTarget?.kcal_target ? Math.min(100, Math.round(weekAvg.kcal / dietTarget.kcal_target * 100)) : null, color: '#f0922b' },
                  { label: t('stats.pdf.row_protein', 'Proteine'), val: `${weekAvg.proteins} g`, target: dietTarget?.protein_target ? `${dietTarget.protein_target} g` : null, pct: dietTarget?.protein_target ? Math.min(100, Math.round(weekAvg.proteins / dietTarget.protein_target * 100)) : null, color: '#3b82f6' },
                  { label: t('stats.pdf.row_carbs', 'Carboidrati'), val: `${weekAvg.carbs} g`, target: dietTarget?.carbs_target ? `${dietTarget.carbs_target} g` : null, pct: dietTarget?.carbs_target ? Math.min(100, Math.round(weekAvg.carbs / dietTarget.carbs_target * 100)) : null, color: '#f0922b' },
                  { label: t('stats.pdf.row_fats', 'Grassi'), val: `${weekAvg.fats} g`, target: dietTarget?.fats_target ? `${dietTarget.fats_target} g` : null, pct: dietTarget?.fats_target ? Math.min(100, Math.round(weekAvg.fats / dietTarget.fats_target * 100)) : null, color: '#e05a5a' },
                ].map(row => (
                  <div key={row.label} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                      <span style={{ fontWeight: 500 }}>{row.label}</span>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ fontWeight: 700 }}>{row.val}</span>
                        {row.target && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>/ {row.target}</span>}
                        {row.pct !== null && <span style={{ fontSize: 11, fontWeight: 600, color: row.pct > 105 ? 'var(--red)' : row.pct >= 85 ? 'var(--green-main)' : 'var(--orange)' }}>{row.pct}%</span>}
                      </div>
                    </div>
                    {row.pct !== null && (
                      <div style={{ height: 5, background: 'var(--border-light)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${row.pct}%`, background: row.color, borderRadius: 3, transition: 'width 0.6s ease' }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── TAB: adherence ── */}
          {tab === 'adherence' && (
            <ProGate feature={t('stats.progate.adherence_feature', 'Analisi aderenza')} teaser={t('stats.progate.adherence_teaser', 'Monitora quanto segui la tua dieta giorno per giorno')}>
            <>
              {/* adherence score */}
              <div className="card" style={{ padding: 20, textAlign: 'center' }}>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>{t('stats.avg_adherence_week', 'Aderenza media questa settimana')}</p>
                <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 120, height: 120, margin: '0 auto 12px' }}>
                  <svg width="120" height="120" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
                    <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border-light)" strokeWidth="10" />
                    <circle cx="60" cy="60" r="50" fill="none"
                      stroke={avgAdherence >= 80 ? 'var(--green-main)' : avgAdherence >= 50 ? 'var(--orange)' : 'var(--red)'}
                      strokeWidth="10" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - avgAdherence / 100)}`}
                      style={{ transition: 'stroke-dashoffset 1s ease' }}
                    />
                  </svg>
                  <div>
                    <p style={{ fontSize: 28, fontWeight: 800, color: avgAdherence >= 80 ? 'var(--green-main)' : avgAdherence >= 50 ? 'var(--orange)' : 'var(--red)' }}>{avgAdherence}%</p>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  {avgAdherence >= 80 ? t('stats.adherence_msg_excellent', '🏆 Ottima aderenza alla dieta!') : avgAdherence >= 60 ? t('stats.adherence_msg_good', '👍 Buona aderenza, continua così!') : avgAdherence >= 40 ? t('stats.adherence_msg_improve', '💪 Puoi migliorare! Registra tutti i pasti.') : t('stats.adherence_msg_low', '⚠️ Aderenza bassa. Prova a registrare ogni pasto.')}
                </p>
              </div>

              {/* daily adherence chart */}
              <div className="card" style={{ padding: '16px 10px 14px' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, paddingLeft: 6 }}>📅 {t('stats.daily_adherence_2weeks', 'Aderenza giornaliera (ultime 2 settimane)')}</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={adherenceData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                    <XAxis dataKey="label" tick={{ fontSize: 9, fill: 'var(--text-muted)' }} interval={1} />
                    <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                    <Tooltip formatter={(v) => [`${v}%`, t('stats.adherence_label', 'Aderenza')]} labelStyle={{ fontSize: 11 }} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <ReferenceLine y={80} stroke="var(--green-main)" strokeDasharray="4 3" strokeWidth={1.5} label={{ value: '80%', fontSize: 9, fill: 'var(--green-main)', position: 'insideTopRight' }} />
                    <Bar dataKey="pct" name={t('stats.adherence_label', 'Aderenza')} radius={[4, 4, 0, 0]}>
                      {adherenceData.map((e, i) => <Cell key={i} fill={e.pct >= 80 ? 'var(--green-main)' : e.pct >= 50 ? 'var(--orange)' : 'var(--red)'} fillOpacity={0.8} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* daily adherence list */}
              <div className="card" style={{ padding: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{t('stats.detail_per_day', 'Dettaglio per giorno')}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {adherenceData.slice(-14).reverse().map(d => (
                    <div key={d.date} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, textAlign: 'center' }}>
                        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>{d.dayLabel}</p>
                        <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{d.label}</p>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ height: 8, background: 'var(--border-light)', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${d.pct}%`, background: d.pct >= 80 ? 'var(--green-main)' : d.pct >= 50 ? 'var(--orange)' : 'var(--red)', borderRadius: 4, transition: 'width 0.5s ease' }} />
                        </div>
                      </div>
                      <div style={{ width: 44, textAlign: 'right' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: d.pct >= 80 ? 'var(--green-main)' : d.pct >= 50 ? 'var(--orange)' : d.pct > 0 ? 'var(--red)' : 'var(--text-muted)' }}>{d.pct > 0 ? `${d.pct}%` : '–'}</span>
                        <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t('stats.meals_ratio', { logged: d.logged, expected: d.expected }, '{{logged}}/{{expected}} pasti')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
            </ProGate>
          )}

          {/* ── TAB: micronutrienti ── */}
          {tab === 'micro' && (
            <div className="card" style={{ padding: '18px 16px' }}>
              <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>🥕 {t('stats.micro_title', 'Micronutrienti — media giornaliera')}</p>
              <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 14 }}>
                {t('stats.micro_subtitle', { days: microData?.nDays || 0 }, 'Calcolata sui {{days}} giorni con diario di questa settimana, confrontata coi valori di riferimento per adulti (LARN).')}
              </p>
              {microData === null ? (
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t('stats.loading', 'Caricamento…')}</p>
              ) : microData.nDays === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t('stats.micro_empty', 'Nessun alimento registrato questa settimana: compila il diario per vedere i micronutrienti.')}</p>
              ) : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {MICRO_META.map(m => {
                      const val = microData.daily[m.key] || 0
                      const ref = m.ref[profile?.gender === 'F' ? 'F' : 'M']
                      const pct = Math.min(140, Math.round((val / ref) * 100))
                      const color = m.max
                        ? (pct <= 100 ? 'var(--green-main)' : pct <= 125 ? 'var(--orange)' : 'var(--red)')
                        : (pct >= 90 ? 'var(--green-main)' : pct >= 60 ? 'var(--orange)' : 'var(--red)')
                      const shown = val >= 100 ? Math.round(val) : Math.round(val * 10) / 10
                      return (
                        <div key={m.key}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                            <span style={{ fontSize: 12.5, fontWeight: 600 }}>{m.emoji} {t(`stats.micro_${m.i18nKey}`, m.label)}</span>
                            <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                              <b style={{ color, fontSize: 12.5 }}>{shown}</b> / {ref} {m.unit}{m.max ? ` ${t('stats.micro_max', 'max')}` : ''}
                            </span>
                          </div>
                          <div style={{ height: 7, background: 'var(--border-light)', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${Math.min(100, pct)}%`, background: color, borderRadius: 4, transition: 'width .5s' }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <p style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 14, lineHeight: 1.5 }}>
                    ⚠️ {t('stats.micro_disclaimer', 'Stima indicativa: molti prodotti confezionati non riportano i micronutrienti in etichetta, quindi i valori reali possono essere più alti di quelli mostrati. Per valutazioni cliniche fai riferimento al tuo dietista.')}
                  </p>
                </>
              )}
            </div>
          )}

          {/* ── TAB: comparison ── */}
          {tab === 'comparison' && (
            <ProGate feature={t('stats.progate.comparison_feature', 'Confronto settimane')} teaser={t('stats.progate.comparison_teaser', 'Confronta due settimane di dati per misurare i tuoi progressi')}>
            <>
              {radialData.length > 0 && (
                <div className="card" style={{ padding: '18px 16px' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>🎯 {t('stats.overview', "Vista d'insieme")}</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{t('stats.pct_target_reached', "% dell'obiettivo raggiunto questa settimana")}</p>
                  <ResponsiveContainer width="100%" height={190}>
                    <RadialBarChart innerRadius="28%" outerRadius="100%" data={radialData} startAngle={90} endAngle={-270}>
                      <RadialBar dataKey="value" background={{ fill: 'var(--border-light)' }} cornerRadius={8}>
                        {radialData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                      </RadialBar>
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 2 }}>
                    {radialData.map(d => (
                      <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.fill, flexShrink: 0 }} />
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{d.name}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{d.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="card" style={{ padding: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>⚖️ {t('stats.compare_weeks', 'Confronto settimane')}</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
                  {t('stats.selected_vs_prev_week', 'Settimana selezionata vs settimana precedente')}
                </p>

                {comparisonData.map(row => {
                  const diff = row.curr - row.prev
                  const hasPrev = row.prev > 0
                  const pctChange = hasPrev ? Math.round((diff / row.prev) * 100) : null
                  return (
                    <div key={row.id} style={{ marginBottom: 18 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{row.emoji} {row.name}</span>
                        {pctChange !== null && (
                          <span style={{ fontSize: 12, fontWeight: 600, color: Math.abs(diff) < 5 ? 'var(--text-muted)' : diff < 0 ? 'var(--green-main)' : 'var(--red)', display: 'flex', alignItems: 'center', gap: 3 }}>
                            {diff > 0 ? <TrendingUp size={13} /> : diff < 0 ? <TrendingDown size={13} /> : <Minus size={13} />}
                            {diff > 0 ? '+' : ''}{pctChange}%
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>{t('stats.current_week', 'Settimana corrente')}</p>
                          <div style={{ height: 28, background: 'var(--border-light)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${row.target ? Math.min(100, row.curr / row.target * 100) : Math.min(100, row.prev > 0 ? (row.curr / Math.max(row.curr, row.prev)) * 100 : 100)}%`, background: 'var(--green-main)', opacity: 0.85, borderRadius: 6, transition: 'width 0.6s ease' }} />
                            <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{round1(row.curr)}</span>
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>{t('stats.prev_week_short', 'Settimana prec.')}</p>
                          <div style={{ height: 28, background: 'var(--border-light)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${row.target ? Math.min(100, row.prev / row.target * 100) : Math.min(100, row.curr > 0 ? (row.prev / Math.max(row.curr, row.prev)) * 100 : 100)}%`, background: '#94a3b8', opacity: 0.85, borderRadius: 6, transition: 'width 0.6s ease' }} />
                            <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{round1(row.prev)}</span>
                          </div>
                        </div>
                      </div>
                      {row.target && (
                        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{t('stats.target_value', { value: row.target }, 'Obiettivo: {{value}}')}</p>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* weight comparison */}
              {(weekAvg.weight || prevAvg.weight) && (
                <div className="card" style={{ padding: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>⚖️ {t('stats.weight', 'Peso')}</h3>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1, textAlign: 'center', padding: '14px 10px', background: 'var(--green-pale)', borderRadius: 12 }}>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{t('stats.this_week_full', 'Questa settimana')}</p>
                      <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--green-main)' }}>{weekAvg.weight ?? '–'} <span style={{ fontSize: 13 }}>kg</span></p>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center', padding: '14px 10px', background: 'var(--surface-2)', borderRadius: 12 }}>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{t('stats.prev_week_short', 'Settimana prec.')}</p>
                      <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-secondary)' }}>{prevAvg.weight ?? '–'} <span style={{ fontSize: 13 }}>kg</span></p>
                    </div>
                  </div>
                  {weekAvg.weight && prevAvg.weight && (
                    <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: weekAvg.weight < prevAvg.weight ? 'var(--green-main)' : weekAvg.weight > prevAvg.weight ? 'var(--red)' : 'var(--text-muted)' }}>
                      {weekAvg.weight < prevAvg.weight ? <TrendingDown size={16} /> : weekAvg.weight > prevAvg.weight ? <TrendingUp size={16} /> : <Minus size={16} />}
                      {weekAvg.weight < prevAvg.weight ? t('stats.weight_lost', 'Persi ') : weekAvg.weight > prevAvg.weight ? t('stats.weight_gained', 'Guadagnati ') : t('stats.weight_stable', 'Stabile ')}
                      {weekAvg.weight !== prevAvg.weight && `${Math.abs(round1(weekAvg.weight - prevAvg.weight))} kg`}
                    </div>
                  )}
                </div>
              )}

              {/* water comparison */}
              <div className="card" style={{ padding: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>💧 {t('stats.hydration', 'Idratazione')}</h3>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1, textAlign: 'center', padding: '14px 10px', background: 'rgba(59,130,246,0.08)', borderRadius: 12 }}>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{t('stats.this_week_full', 'Questa settimana')}</p>
                    <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--blue)' }}>{weekAvg.water ? `${Math.round(weekAvg.water)}` : '–'} <span style={{ fontSize: 13 }}>{t('stats.ml_per_day', 'ml/die')}</span></p>
                  </div>
                  <div style={{ flex: 1, textAlign: 'center', padding: '14px 10px', background: 'var(--surface-2)', borderRadius: 12 }}>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{t('stats.prev_week_short', 'Settimana prec.')}</p>
                    <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-secondary)' }}>{prevAvg.water ? `${Math.round(prevAvg.water)}` : '–'} <span style={{ fontSize: 13 }}>{t('stats.ml_per_day', 'ml/die')}</span></p>
                  </div>
                </div>
              </div>
            </>
            </ProGate>
          )}

          {/* ── TAB: insight di correlazione ── */}
          {tab === 'insights' && (
            <ProGate feature={t('stats.progate.insights_feature', 'Insight personalizzati')} teaser={t('stats.progate.insights_teaser', 'Scopri correlazioni tra alimentazione, sonno e benessere nei tuoi dati')}>
            <>
              <div className="card" style={{ padding: '18px 16px' }}>
                <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>🔎 {t('stats.insights_title', 'Insight sui tuoi dati')}</p>
                <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 14 }}>
                  {t('stats.insights_subtitle', 'Calcolati sugli ultimi 30 giorni, confrontando i giorni con valori sopra e sotto la tua media. Sono correlazioni osservate nei tuoi dati, non un parere clinico: per qualunque dubbio parlane con il tuo dietista.')}
                </p>

                {insightsData === null ? (
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t('stats.loading', 'Caricamento…')}</p>
                ) : !insightsData.proteinEnergy && !insightsData.sleepMood ? (
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {t('stats.insights_more_history_needed', 'Serve più storico per questa analisi: continua a registrare diario alimentare e check-in di benessere, gli insight compariranno qui appena ci sono abbastanza giorni di dati.')}
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {insightsData.proteinEnergy && (() => {
                      const r = insightsData.proteinEnergy
                      const diff = round1(r.aboveAvg - r.belowAvg)
                      return (
                        <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: '14px 16px' }}>
                          <p style={{ fontSize: 13, lineHeight: 1.6 }}>
                            💪 {t('stats.insight.days_with', 'Nei giorni con')} <b>{t('stats.insight.more_protein', 'più proteine')}</b> {t('stats.insight.protein_range', { median: round1(r.median), count: r.aboveN }, '({{median}}g o più, {{count}} giorni)')} {t('stats.insight.energy_avg_intro', 'il tuo livello di energia registrato è in media')} <b>{round1(r.aboveAvg)}/10</b>, {t('stats.insight.versus', 'contro')} <b>{round1(r.belowAvg)}/10</b> {t('stats.insight.protein_days_less', { count: r.belowN }, 'nei giorni con meno proteine ({{count}} giorni)')}
                            {Math.abs(diff) >= 0.3
                              ? diff > 0 ? t('stats.insight.protein_diff_high', ' — una differenza a favore dei giorni ad alto apporto proteico.') : t('stats.insight.protein_diff_low', ' — una differenza a favore dei giorni a basso apporto proteico.')
                              : t('stats.insight.diff_minimal', ' — differenza minima, per ora nessun pattern chiaro.')}
                          </p>
                        </div>
                      )
                    })()}
                    {insightsData.sleepMood && (() => {
                      const r = insightsData.sleepMood
                      const diff = round1(r.aboveAvg - r.belowAvg)
                      return (
                        <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: '14px 16px' }}>
                          <p style={{ fontSize: 13, lineHeight: 1.6 }}>
                            😴 {t('stats.insight.slept', 'Nei giorni in cui hai dormito')} <b>{t('stats.insight.sleep_hours_bold', { median: round1(r.median) }, '{{median}}+ ore')}</b> {t('stats.insight.count_days', { count: r.aboveN }, '({{count}} giorni)')} {t('stats.insight.mood_avg_intro', 'il tuo umore registrato è in media')} <b>{round1(r.aboveAvg)}/10</b>, {t('stats.insight.versus', 'contro')} <b>{round1(r.belowAvg)}/10</b> {t('stats.insight.sleep_days_less', { count: r.belowN }, 'nei giorni con meno sonno ({{count}} giorni)')}
                            {Math.abs(diff) >= 0.3
                              ? diff > 0 ? t('stats.insight.sleep_diff_high', ' — dormire di più sembra accompagnarsi a un umore migliore, nei tuoi dati.') : t('stats.insight.sleep_diff_low', ' — dormire di meno sembra accompagnarsi a un umore migliore, nei tuoi dati (verifica se ci sono altri fattori).')
                              : t('stats.insight.diff_minimal', ' — differenza minima, per ora nessun pattern chiaro.')}
                          </p>
                        </div>
                      )
                    })()}
                  </div>
                )}
              </div>
            </>
            </ProGate>
          )}

          {/* ── TAB: report PDF ── */}
          {tab === 'report' && (
            <ProGate feature={t('stats.progate.report_feature', 'Report PDF')} teaser={t('stats.progate.report_teaser', 'Genera report professionali da condividere con il tuo dietista')}>
            <>
              {/* Toggle settimanale / mensile */}
              <div style={{ display: 'flex', background: 'var(--surface-2)', borderRadius: 12, padding: 4, gap: 4 }}>
                {[
                  { key: 'weekly', label: `📅 ${t('stats.weekly_label', 'Settimanale')}` },
                  { key: 'monthly', label: `🗓️ ${t('stats.monthly_label', 'Mensile')}` },
                ].map(m => (
                  <button
                    key={m.key}
                    onClick={() => setPdfMode(m.key)}
                    style={{ flex: 1, padding: '9px 4px', borderRadius: 9, background: pdfMode === m.key ? 'var(--surface)' : 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: pdfMode === m.key ? 700 : 400, color: pdfMode === m.key ? 'var(--green-main)' : 'var(--text-muted)', boxShadow: pdfMode === m.key ? 'var(--shadow-sm)' : 'none', transition: 'all 0.15s', font: 'inherit' }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {pdfMode === 'weekly' && (
                <>
                  <div className="card" style={{ padding: 20, textAlign: 'center' }}>
                    <div style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                      <FileText size={28} color="var(--green-main)" />
                    </div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{t('stats.weekly_pdf_report', 'Report Settimanale PDF')}</h2>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.5 }}>
                      {weekLabel}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.5 }}>
                      {t('stats.weekly_pdf_desc', 'Include medie macro, idratazione, peso e aderenza alla dieta.')}
                    </p>
                    <button className="btn btn-primary btn-full" onClick={generatePdf} disabled={generatingPdf} style={{ fontSize: 15, padding: '14px 20px' }}>
                      {generatingPdf ? <span>{t('stats.generating', 'Generazione in corso…')}</span> : <><Download size={18} />{t('stats.download_pdf_report', 'Scarica Report PDF')}</>}
                    </button>
                  </div>
                  {radialData.length > 0 && (
                    <div className="card" style={{ padding: '16px 16px 10px' }}>
                      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>📊 {t('stats.chart_preview', 'Anteprima grafica')}</h3>
                      {comparisonData.filter(row => row.target).map(row => {
                        const pct = Math.min(100, Math.round(row.curr / row.target * 100))
                        const color = NUTRIENT_COLOR[row.id]
                        return (
                          <div key={row.id} style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                              <span style={{ fontWeight: 500 }}>{row.emoji} {row.name}</span>
                              <span style={{ color: 'var(--text-muted)' }}>{round1(row.curr)} / {row.target}</span>
                            </div>
                            <div style={{ height: 6, background: 'var(--border-light)', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3 }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  <div className="card" style={{ padding: 16 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>📋 {t('stats.content_preview', 'Anteprima contenuto')}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {[
                        { icon: '📅', title: t('stats.period', 'Periodo'), desc: weekLabel },
                        { icon: '🔥', title: t('stats.avg_calories', 'Media calorie'), desc: `${weekAvg.kcal} kcal/die${dietTarget?.kcal_target ? ` ${t('stats.target_paren', { value: dietTarget.kcal_target }, '(obiettivo: {{value}})')}` : ''}` },
                        { icon: '💪', title: t('stats.avg_protein_full', 'Proteine medie'), desc: `${weekAvg.proteins} g/die` },
                        { icon: '🌾', title: t('stats.avg_carbs_full', 'Carboidrati medi'), desc: `${weekAvg.carbs} g/die` },
                        { icon: '🥑', title: t('stats.avg_fats_full', 'Grassi medi'), desc: `${weekAvg.fats} g/die` },
                        { icon: '💧', title: t('stats.avg_water_full', 'Acqua media'), desc: weekAvg.water ? `${Math.round(weekAvg.water)} ml/die` : t('stats.no_data_short', 'Nessun dato') },
                        { icon: '⚖️', title: t('stats.avg_weight', 'Peso medio'), desc: weekAvg.weight ? `${weekAvg.weight} kg` : t('stats.no_data_short', 'Nessun dato') },
                        { icon: '✅', title: t('stats.diet_adherence_short', 'Aderenza dieta'), desc: t('stats.weekly_avg_pct', { value: avgAdherence }, '{{value}}% media settimanale') },
                      ].map(item => (
                        <div key={item.title} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: 'var(--surface-2)', borderRadius: 10 }}>
                          <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{item.icon}</span>
                          <div>
                            <p style={{ fontSize: 12, fontWeight: 600 }}>{item.title}</p>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {pdfMode === 'monthly' && (
                <>
                  <div className="card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                      <div style={{ width: 52, height: 52, borderRadius: 16, background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FileText size={24} color="var(--green-main)" />
                      </div>
                      <div>
                        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{t('stats.monthly_pdf_report', 'Report Mensile PDF')}</h2>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t('stats.monthly_checkup_visit', 'Visita di controllo mensile')}</p>
                      </div>
                    </div>
                    <div className="input-group" style={{ marginBottom: 16 }}>
                      <label className="input-label">{t('stats.reference_month', 'Mese di riferimento')}</label>
                      <input
                        type="month"
                        className="input-field"
                        value={monthStr}
                        onChange={e => setMonthStr(e.target.value)}
                        max={format(today, 'yyyy-MM')}
                      />
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
                      {t('stats.monthly_pdf_desc', { month: monthStr ? format(new Date(monthStr + '-01'), 'MMMM yyyy', { locale: it }) : t('stats.selected_month', 'il mese selezionato') }, 'Il PDF include medie mensili, riepilogo per settimana, dettaglio giornaliero e aderenza alla dieta per {{month}}.')}
                    </p>
                    <button className="btn btn-primary btn-full" onClick={generateMonthlyPdf} disabled={generatingMonthlyPdf || !monthStr} style={{ fontSize: 15, padding: '14px 20px' }}>
                      {generatingMonthlyPdf ? <span>{t('stats.generating', 'Generazione in corso…')}</span> : <><Download size={18} />{t('stats.download_monthly_report', 'Scarica Report Mensile')}</>}
                    </button>
                  </div>
                  <div className="card" style={{ padding: 16 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>📋 {t('stats.monthly_report_content', 'Contenuto del report mensile')}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {[
                        { icon: '📊', text: t('stats.content_monthly_averages', 'Medie mensili di calorie, proteine, carboidrati e grassi') },
                        { icon: '📅', text: t('stats.content_weekly_summary', 'Riepilogo per settimana (4-5 settimane del mese)') },
                        { icon: '📋', text: t('stats.content_daily_breakdown', 'Dettaglio giornaliero con tutti i macronutrienti') },
                        { icon: '💧', text: t('stats.content_avg_hydration', 'Media idratazione giornaliera') },
                        { icon: '⚖️', text: t('stats.content_weight_trend', 'Andamento peso nel mese') },
                        { icon: '✅', text: t('stats.content_avg_adherence_prescribed', 'Aderenza media alla dieta prescritta') },
                        { icon: '📝', text: t('stats.content_notes_space', 'Spazio note per il dietista') },
                      ].map(item => (
                        <div key={item.text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '7px 10px', background: 'var(--surface-2)', borderRadius: 9 }}>
                          <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
                {t('stats.pdf_save_note', 'Il PDF viene salvato sul tuo dispositivo e può essere inviato via email o WhatsApp al tuo dietista.')}
              </p>
            </>
            </ProGate>
          )}

        </div>
      )}
    </div>
  )
}


