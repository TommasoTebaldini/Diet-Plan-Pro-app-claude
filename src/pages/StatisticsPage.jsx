import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useT } from '../i18n'
import ProGate from '../components/ProGate'
import { useSubscription } from '../hooks/useSubscription'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
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

// â”€â”€ helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const TABS_STATIC = [
  { key: 'weekly', emoji: 'ðŸ“Š', label: 'ðŸ“Š Settimana' },
  { key: 'adherence', emoji: 'âœ…', label: 'âœ… Aderenza' },
  { key: 'comparison', emoji: 'âš–ï¸', label: 'âš–ï¸ Confronto' },
  { key: 'report', emoji: 'ðŸ“„', label: 'ðŸ“„ Report PDF' },
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

// â”€â”€ custom tooltip â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€ stat card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function StatCard({ icon, label, value, sub, trend }) {
  const trendColor = trend > 0 ? 'var(--green-main)' : trend < 0 ? 'var(--red)' : 'var(--text-muted)'
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 14, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 12 }}>
        {icon}<span style={{ fontWeight: 500 }}>{label}</span>
      </div>
      <p style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.1 }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sub}</p>}
      {trend !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: trendColor, fontSize: 11, fontWeight: 600 }}>
          {trend > 0 ? <TrendingUp size={12} /> : trend < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
          {trend > 0 ? '+' : ''}{round1(trend)} vs settimana prec.
        </div>
      )}
    </div>
  )
}

// â”€â”€ main component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
  const [pdfMode, setPdfMode] = useState('weekly')
  const [monthStr, setMonthStr] = useState(format(new Date(), 'yyyy-MM'))
  const [generatingMonthlyPdf, setGeneratingMonthlyPdf] = useState(false)

  // ── Body measurements ─────────────────────────────────────────
  const [bodyMeasurements, setBodyMeasurements] = useState([])
  const [measureDate, setMeasureDate] = useState(new Date().toISOString().split('T')[0])
  const [waist, setWaist] = useState('')
  const [hips, setHips] = useState('')
  const [arms, setArms] = useState('')
  const [thighs, setThighs] = useState('')
  const [savingMeasure, setSavingMeasure] = useState(false)
  const [measureMsg, setMeasureMsg] = useState('')

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

  // Body measurements
  useEffect(() => {
    if (user?.id) loadBodyMeasurements()
  }, [user?.id])

  async function loadBodyMeasurements() {
    try {
      const { data, error } = await supabase
        .from('body_measurements')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(10)
      if (!error && data) setBodyMeasurements(data)
    } catch {}
  }

  async function saveMeasure() {
    if (!waist && !hips && !arms && !thighs) {
      setMeasureMsg('Inserisci almeno una misura.')
      return
    }
    setSavingMeasure(true)
    setMeasureMsg('')
    try {
      const { error } = await supabase.from('body_measurements').insert({
        user_id: user.id,
        date: measureDate,
        waist_cm: parseFloat(waist) || null,
        hips_cm: parseFloat(hips) || null,
        arms_cm: parseFloat(arms) || null,
        thighs_cm: parseFloat(thighs) || null,
      })
      if (error) {
        if (error.code === '42P01' || String(error.message).includes('does not exist')) {
          setMeasureMsg('Funzione disponibile dopo aggiornamento database.')
        } else {
          setMeasureMsg('Errore: ' + error.message)
        }
      } else {
        setMeasureMsg('✅ Misure salvate!')
        setWaist(''); setHips(''); setArms(''); setThighs('')
        await loadBodyMeasurements()
        setTimeout(() => setMeasureMsg(''), 2500)
      }
    } catch {
      setMeasureMsg('Funzione disponibile dopo aggiornamento database.')
    } finally {
      setSavingMeasure(false)
    }
  }

  // â”€â”€ computed weekly stats â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const days7 = eachDayOfInterval({ start: weekStart, end: weekEnd })

  function buildDailyChart() {
    return days7.map(d => {
      const ds = isoDate(d)
      const m = weekData.macros.find(x => x.date === ds) || {}
      const waterEntries = weekData.water.filter(x => x.date === ds)
      const waterMl = waterEntries.reduce((a, b) => a + b.ml, 0)
      return {
        label: format(d, 'EEE', { locale: it }),
        kcal: m.kcal || 0,
        proteins: Math.round(m.proteins || 0),
        carbs: Math.round(m.carbs || 0),
        fats: Math.round(m.fats || 0),
        water: waterMl,
      }
    })
  }

  const dailyChart = buildDailyChart()

  const weekAvg = {
    kcal: round1(avg(weekData.macros.map(m => m.kcal || 0))),
    proteins: round1(avg(weekData.macros.map(m => m.proteins || 0))),
    carbs: round1(avg(weekData.macros.map(m => m.carbs || 0))),
    fats: round1(avg(weekData.macros.map(m => m.fats || 0))),
    water: round1(avg(weekData.water.map(w => w.ml || 0))),
    weight: weekData.weights.length ? round1(avg(weekData.weights.map(w => w.weight_kg))) : null,
  }
  const prevAvg = {
    kcal: round1(avg(prevWeekData.macros.map(m => m.kcal || 0))),
    proteins: round1(avg(prevWeekData.macros.map(m => m.proteins || 0))),
    carbs: round1(avg(prevWeekData.macros.map(m => m.carbs || 0))),
    fats: round1(avg(prevWeekData.macros.map(m => m.fats || 0))),
    water: round1(avg(prevWeekData.water.map(w => w.ml || 0))),
    weight: prevWeekData.weights.length ? round1(avg(prevWeekData.weights.map(w => w.weight_kg))) : null,
  }

  const weekLabel = `${format(weekStart, 'd MMM', { locale: it })} â€“ ${format(weekEnd, 'd MMM yyyy', { locale: it })}`

  // â”€â”€ PDF generation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
      addText('Diet Plan Pro â€” Report Settimanale', margin, 13, { size: 14, style: 'bold', color: [255, 255, 255] })
      addText(weekLabel, margin, 21, { size: 9, color: [200, 240, 220] })
      if (profile?.full_name) {
        addText(`Paziente: ${profile.full_name}`, W - margin - 50, 13, { size: 9, color: [200, 240, 220] })
      }
      addText(`Generato il ${format(today, 'd MMMM yyyy', { locale: it })}`, W - margin - 50, 21, { size: 8, color: [180, 230, 200] })
      y = 40

      // summary stats
      addText('Medie giornaliere', margin, y, { size: 12, style: 'bold' }); y += 7
      addLine(y); y += 5

      const statsRows = [
        ['Calorie', `${weekAvg.kcal} kcal/die`, dietTarget?.kcal_target ? `Obiettivo: ${dietTarget.kcal_target} kcal` : ''],
        ['Proteine', `${weekAvg.proteins} g/die`, dietTarget?.protein_target ? `Obiettivo: ${dietTarget.protein_target} g` : ''],
        ['Carboidrati', `${weekAvg.carbs} g/die`, dietTarget?.carbs_target ? `Obiettivo: ${dietTarget.carbs_target} g` : ''],
        ['Grassi', `${weekAvg.fats} g/die`, dietTarget?.fats_target ? `Obiettivo: ${dietTarget.fats_target} g` : ''],
        ['Acqua', weekAvg.water ? `${Math.round(weekAvg.water)} ml/die` : 'N/D', ''],
        ['Peso medio', weekAvg.weight ? `${weekAvg.weight} kg` : 'N/D', ''],
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
      addText('Dettaglio giornaliero', margin, y, { size: 12, style: 'bold' }); y += 7
      addLine(y); y += 5

      // header row
      const cols = [margin + 2, 40, 72, 100, 128, 156]
      const headers = ['Data', 'Kcal', 'Prot.', 'Carbo', 'Grassi', 'Acqua']
      doc.setFillColor(21, 122, 74)
      doc.rect(margin, y - 4.5, W - margin * 2, 7, 'F')
      headers.forEach((h, i) => addText(h, cols[i], y, { size: 8, style: 'bold', color: [255, 255, 255] }))
      y += 8

      for (const row of dailyChart) {
        if (y > 260) { doc.addPage(); y = 20 }
        const rowIdx = dailyChart.indexOf(row)
        if (rowIdx % 2 === 0) { doc.setFillColor(240, 250, 245); doc.rect(margin, y - 4.5, W - margin * 2, 7, 'F') }
        const vals = [row.label, row.kcal || 'â€“', row.proteins || 'â€“', row.carbs || 'â€“', row.fats || 'â€“', row.water ? `${Math.round(row.water)} ml` : 'â€“']
        vals.forEach((v, i) => addText(String(v), cols[i], y, { size: 8 }))
        y += 8
      }

      // adherence
      y += 6
      if (y > 240) { doc.addPage(); y = 20 }
      addText('Aderenza alla dieta', margin, y, { size: 12, style: 'bold' }); y += 7
      addLine(y); y += 5

      const weekAdh = adherenceData.filter(d => d.date >= isoDate(weekStart) && d.date <= isoDate(weekEnd))
      const avgAdh = weekAdh.length ? Math.round(avg(weekAdh.map(d => d.pct))) : 0
      addText(`Media settimanale: ${avgAdh}%`, margin + 2, y, { size: 10, style: 'bold', color: avgAdh >= 80 ? [21, 122, 74] : avgAdh >= 50 ? [200, 120, 20] : [180, 40, 40] })
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
      addText('Note', margin, y, { size: 12, style: 'bold' }); y += 7
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
        addText(`Diet Plan Pro â€¢ Pagina ${i} di ${pageCount}`, margin, 290, { size: 8, color: [150, 170, 160] })
        addText('Documento riservato â€” da condividere con il proprio dietista', W - margin - 80, 290, { size: 7, color: [180, 200, 190] })
      }

      const fileName = `report_${format(weekStart, 'yyyy-MM-dd')}_${profile?.full_name?.replace(/\s+/g, '_') || 'paziente'}.pdf`
      doc.save(fileName)
    } finally {
      setGeneratingPdf(false)
    }
  }

  // â”€â”€ Monthly PDF generation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
        kcal: round1(avg(macros.map(m => m.kcal || 0))),
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
      addText('Diet Plan Pro - Report Mensile', margin, 13, { size: 14, style: 'bold', color: [255, 255, 255] })
      addText(monthName, margin, 21, { size: 9, color: [200, 240, 220] })
      if (profile?.full_name) addText(`Paziente: ${profile.full_name}`, W - margin - 50, 13, { size: 9, color: [200, 240, 220] })
      addText(`Generato il ${format(today, 'd MMMM yyyy', { locale: it })}`, W - margin - 50, 21, { size: 8, color: [180, 230, 200] })
      y = 40

      addText('Medie mensili', margin, y, { size: 12, style: 'bold' }); y += 7
      addLine(y); y += 5
      const statsRows = [
        ['Calorie medie', `${monthMacroAvg.kcal} kcal/die`, diet?.kcal_target ? `Obiettivo: ${diet.kcal_target} kcal` : ''],
        ['Proteine medie', `${monthMacroAvg.proteins} g/die`, diet?.protein_target ? `Obiettivo: ${diet.protein_target} g` : ''],
        ['Carboidrati medi', `${monthMacroAvg.carbs} g/die`, diet?.carbs_target ? `Obiettivo: ${diet.carbs_target} g` : ''],
        ['Grassi medi', `${monthMacroAvg.fats} g/die`, diet?.fats_target ? `Obiettivo: ${diet.fats_target} g` : ''],
        ['Acqua media', monthWaterAvg ? `${Math.round(monthWaterAvg)} ml/die` : 'N/D', ''],
        ['Peso medio', monthWeightAvg ? `${monthWeightAvg} kg` : 'N/D', ''],
        ['Giorni registrati', `${daysLogged} / ${daysInMonth}`, ''],
        ['Aderenza media', `${avgMonthAdh}%`, ''],
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
      addText('Riepilogo settimanale', margin, y, { size: 12, style: 'bold' }); y += 7
      addLine(y); y += 5
      const cols = [margin + 2, 46, 76, 104, 132, 160]
      const hdrs = ['Settimana', 'Kcal', 'Prot.', 'Carbo', 'Grassi', 'Acqua']
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
        const wLabel = `Sett.${wn} (${format(cur, 'd/M', { locale: it })}-${format(wEnd, 'd/M', { locale: it })})`
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
      addText('Dettaglio giornaliero', margin, y, { size: 12, style: 'bold' }); y += 7
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
          row.kcal ? String(row.kcal) : '-',
          row.proteins ? String(round1(row.proteins)) : '-',
          row.carbs ? String(round1(row.carbs)) : '-',
          row.fats ? String(round1(row.fats)) : '-',
          waterMl ? `${Math.round(waterMl)}ml` : '-',
        ]
        rowVals.forEach((v, idx) => addText(v, cols[idx], y, { size: 7.5 }))
        y += 7
      }

      y += 6
      if (y > 250) { doc.addPage(); y = 20 }
      addText('Note per il dietista', margin, y, { size: 12, style: 'bold' }); y += 7
      addLine(y); y += 5
      doc.setFillColor(247, 250, 248)
      doc.rect(margin, y - 4, W - margin * 2, 30, 'F')
      addText('_____________________________________', margin + 2, y + 5, { size: 9, color: [180, 200, 190] })
      addText('_____________________________________', margin + 2, y + 13, { size: 9, color: [180, 200, 190] })
      addText('_____________________________________', margin + 2, y + 21, { size: 9, color: [180, 200, 190] })

      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        addText(`Diet Plan Pro - Pagina ${i} di ${pageCount}`, margin, 290, { size: 8, color: [150, 170, 160] })
        addText('Documento riservato - da condividere con il proprio dietista', W - margin - 80, 290, { size: 7, color: [180, 200, 190] })
      }

      const fileName = `report_mensile_${monthStr}_${profile?.full_name?.replace(/\s+/g, '_') || 'paziente'}.pdf`
      doc.save(fileName)
    } finally {
      setGeneratingMonthlyPdf(false)
    }
  }

  // â”€â”€ adherence stats â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const weekAdherenceData = adherenceData.filter(d => d.date >= isoDate(weekStart) && d.date <= isoDate(weekEnd))
  const avgAdherence = weekAdherenceData.length ? Math.round(avg(weekAdherenceData.map(d => d.pct))) : 0

  // â”€â”€ comparison chart â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const comparisonData = [
    { name: 'ðŸ”¥ Kcal', curr: weekAvg.kcal, prev: prevAvg.kcal, target: dietTarget?.kcal_target || null },
    { name: 'ðŸ’ª Prot.', curr: weekAvg.proteins, prev: prevAvg.proteins, target: dietTarget?.protein_target || null },
    { name: 'ðŸŒ¾ Carbo', curr: weekAvg.carbs, prev: prevAvg.carbs, target: dietTarget?.carbs_target || null },
    { name: 'ðŸ¥‘ Grassi', curr: weekAvg.fats, prev: prevAvg.fats, target: dietTarget?.fats_target || null },
  ]

  // â”€â”€ render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <div className="page">
      {/* header */}
      <div style={{ background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))', padding: 'calc(env(safe-area-inset-top) + 20px) 24px 24px' }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 }}>Analisi avanzata</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'white', fontWeight: 300 }}>{t('stats.title')}</h1>
      </div>

      {/* tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', background: 'var(--surface)' }}>
        {TABS_STATIC.map(tab_ => (
          <button key={tab_.key} onClick={() => setTab(tab_.key)} style={{ flex: 1, padding: '11px 4px', background: 'none', border: 'none', font: 'inherit', fontSize: 11.5, fontWeight: tab === tab_.key ? 700 : 400, color: tab === tab_.key ? 'var(--green-main)' : 'var(--text-muted)', borderBottom: `2px solid ${tab === tab_.key ? 'var(--green-main)' : 'transparent'}`, cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center', lineHeight: 1.3 }}>
            {tab_.label}
          </button>
        ))}
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
            <button onClick={() => isPro && setWeekOffset(v => v + 1)} disabled={!isPro} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', cursor: isPro ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', opacity: isPro ? 1 : 0.5 }}>
              {isPro ? <ChevronLeft size={16} color="var(--text-secondary)" /> : <Lock size={14} color="var(--text-muted)" />}
            </button>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 14, fontWeight: 600 }}>{weekLabel}</p>
              {weekOffset === 0 && <p style={{ fontSize: 11, color: 'var(--green-main)' }}>Settimana corrente</p>}
              {weekOffset > 0 && <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{weekOffset} {weekOffset === 1 ? 'settimana' : 'settimane'} fa</p>}
            </div>
            <button onClick={() => setWeekOffset(v => Math.max(0, v - 1))} disabled={weekOffset === 0} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', cursor: weekOffset === 0 ? 'default' : 'pointer', opacity: weekOffset === 0 ? 0.4 : 1, display: 'flex', alignItems: 'center' }}>
              <ChevronRight size={16} color="var(--text-secondary)" />
            </button>
          </div>

          {/* â”€â”€ TAB: weekly report â”€â”€ */}
          {tab === 'weekly' && (
            <>
              {/* summary cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { icon: <Flame size={13} />, label: 'Kcal media/die', value: `${weekAvg.kcal}`, sub: dietTarget?.kcal_target ? `Obiettivo: ${dietTarget.kcal_target}` : undefined, trend: weekAvg.kcal - prevAvg.kcal },
                  { icon: <Droplets size={13} />, label: 'Acqua media/die', value: weekAvg.water ? `${Math.round(weekAvg.water)} ml` : 'N/D', trend: weekAvg.water && prevAvg.water ? weekAvg.water - prevAvg.water : undefined },
                  { icon: <Scale size={13} />, label: 'Peso medio', value: weekAvg.weight ? `${weekAvg.weight} kg` : 'N/D', trend: weekAvg.weight && prevAvg.weight ? weekAvg.weight - prevAvg.weight : undefined },
                  { icon: <Check size={13} />, label: 'Aderenza media', value: `${avgAdherence}%`, sub: `${weekAdherenceData.filter(d => d.pct >= 80).length}/7 giorni â‰¥80%` },
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

              {/* weekly macro chart â€” Pro only */}
              <ProGate feature="Grafici settimanali" teaser="Visualizza i grafici di calorie e idratazione giorno per giorno">
                <div className="card" style={{ padding: '16px 10px 14px' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, paddingLeft: 6 }}>ðŸ“Š Calorie giornaliere</h3>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={dailyChart} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                      <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                      <Tooltip content={<SmallTooltip unit=" kcal" />} />
                      {dietTarget?.kcal_target && <ReferenceLine y={dietTarget.kcal_target} stroke="var(--orange)" strokeDasharray="4 3" strokeWidth={1.5} label={{ value: 'Target', fontSize: 9, fill: 'var(--orange)', position: 'insideTopRight' }} />}
                      <Bar dataKey="kcal" name="Kcal" radius={[4, 4, 0, 0]}>
                        {dailyChart.map((e, i) => <Cell key={i} fill={dietTarget?.kcal_target && e.kcal > dietTarget.kcal_target * 1.05 ? '#e05a5a' : 'var(--green-main)'} fillOpacity={0.85} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="card" style={{ padding: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>ðŸ’§ Idratazione giornaliera</h3>
                  <ResponsiveContainer width="100%" height={140}>
                    <BarChart data={dailyChart} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                      <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                      <Tooltip content={<SmallTooltip unit=" ml" />} />
                      <ReferenceLine y={2000} stroke="#3b82f6" strokeDasharray="4 3" strokeWidth={1.5} label={{ value: '2 L', fontSize: 9, fill: '#3b82f6', position: 'insideTopRight' }} />
                      <Bar dataKey="water" name="Acqua" fill="#3b82f6" fillOpacity={0.75} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ProGate>

              {/* macro averages table */}
              <div className="card" style={{ padding: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>ðŸ“ˆ Medie settimanali</h3>
                {[
                  { label: 'Calorie', val: `${weekAvg.kcal} kcal`, target: dietTarget?.kcal_target ? `${dietTarget.kcal_target} kcal` : null, pct: dietTarget?.kcal_target ? Math.min(100, Math.round(weekAvg.kcal / dietTarget.kcal_target * 100)) : null, color: '#f0922b' },
                  { label: 'Proteine', val: `${weekAvg.proteins} g`, target: dietTarget?.protein_target ? `${dietTarget.protein_target} g` : null, pct: dietTarget?.protein_target ? Math.min(100, Math.round(weekAvg.proteins / dietTarget.protein_target * 100)) : null, color: '#3b82f6' },
                  { label: 'Carboidrati', val: `${weekAvg.carbs} g`, target: dietTarget?.carbs_target ? `${dietTarget.carbs_target} g` : null, pct: dietTarget?.carbs_target ? Math.min(100, Math.round(weekAvg.carbs / dietTarget.carbs_target * 100)) : null, color: '#f0922b' },
                  { label: 'Grassi', val: `${weekAvg.fats} g`, target: dietTarget?.fats_target ? `${dietTarget.fats_target} g` : null, pct: dietTarget?.fats_target ? Math.min(100, Math.round(weekAvg.fats / dietTarget.fats_target * 100)) : null, color: '#e05a5a' },
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

          {/* â”€â”€ TAB: adherence â”€â”€ */}
          {tab === 'adherence' && (
            <ProGate feature="Analisi aderenza" teaser="Monitora quanto segui la tua dieta giorno per giorno">
            <>
              {/* adherence score */}
              <div className="card" style={{ padding: 20, textAlign: 'center' }}>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>Aderenza media questa settimana</p>
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
                  {avgAdherence >= 80 ? 'ðŸ† Ottima aderenza alla dieta!' : avgAdherence >= 60 ? 'ðŸ‘ Buona aderenza, continua cosÃ¬!' : avgAdherence >= 40 ? 'ðŸ’ª Puoi migliorare! Registra tutti i pasti.' : 'âš ï¸ Aderenza bassa. Prova a registrare ogni pasto.'}
                </p>
              </div>

              {/* daily adherence chart */}
              <div className="card" style={{ padding: '16px 10px 14px' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, paddingLeft: 6 }}>ðŸ“… Aderenza giornaliera (ultime 2 settimane)</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={adherenceData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                    <XAxis dataKey="label" tick={{ fontSize: 9, fill: 'var(--text-muted)' }} interval={1} />
                    <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                    <Tooltip formatter={(v) => [`${v}%`, 'Aderenza']} labelStyle={{ fontSize: 11 }} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <ReferenceLine y={80} stroke="var(--green-main)" strokeDasharray="4 3" strokeWidth={1.5} label={{ value: '80%', fontSize: 9, fill: 'var(--green-main)', position: 'insideTopRight' }} />
                    <Bar dataKey="pct" name="Aderenza" radius={[4, 4, 0, 0]}>
                      {adherenceData.map((e, i) => <Cell key={i} fill={e.pct >= 80 ? 'var(--green-main)' : e.pct >= 50 ? 'var(--orange)' : 'var(--red)'} fillOpacity={0.8} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* daily adherence list */}
              <div className="card" style={{ padding: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Dettaglio per giorno</h3>
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
                        <span style={{ fontSize: 12, fontWeight: 700, color: d.pct >= 80 ? 'var(--green-main)' : d.pct >= 50 ? 'var(--orange)' : d.pct > 0 ? 'var(--red)' : 'var(--text-muted)' }}>{d.pct > 0 ? `${d.pct}%` : 'â€“'}</span>
                        <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{d.logged}/{d.expected} pasti</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
            </ProGate>
          )}

          {/* â”€â”€ TAB: comparison â”€â”€ */}
          {tab === 'comparison' && (
            <ProGate feature="Confronto settimane" teaser="Confronta due settimane di dati per misurare i tuoi progressi">
            <>
              <div className="card" style={{ padding: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>âš–ï¸ Confronto settimane</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
                  Settimana selezionata vs settimana precedente
                </p>

                {comparisonData.map(row => {
                  const diff = row.curr - row.prev
                  const hasPrev = row.prev > 0
                  const pctChange = hasPrev ? Math.round((diff / row.prev) * 100) : null
                  return (
                    <div key={row.name} style={{ marginBottom: 18 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{row.name}</span>
                        {pctChange !== null && (
                          <span style={{ fontSize: 12, fontWeight: 600, color: Math.abs(diff) < 5 ? 'var(--text-muted)' : diff < 0 ? 'var(--green-main)' : 'var(--red)', display: 'flex', alignItems: 'center', gap: 3 }}>
                            {diff > 0 ? <TrendingUp size={13} /> : diff < 0 ? <TrendingDown size={13} /> : <Minus size={13} />}
                            {diff > 0 ? '+' : ''}{pctChange}%
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>Settimana corrente</p>
                          <div style={{ height: 28, background: 'var(--border-light)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${row.target ? Math.min(100, row.curr / row.target * 100) : Math.min(100, row.prev > 0 ? (row.curr / Math.max(row.curr, row.prev)) * 100 : 100)}%`, background: 'var(--green-main)', opacity: 0.85, borderRadius: 6, transition: 'width 0.6s ease' }} />
                            <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{round1(row.curr)}</span>
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>Settimana prec.</p>
                          <div style={{ height: 28, background: 'var(--border-light)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${row.target ? Math.min(100, row.prev / row.target * 100) : Math.min(100, row.curr > 0 ? (row.prev / Math.max(row.curr, row.prev)) * 100 : 100)}%`, background: '#94a3b8', opacity: 0.85, borderRadius: 6, transition: 'width 0.6s ease' }} />
                            <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{round1(row.prev)}</span>
                          </div>
                        </div>
                      </div>
                      {row.target && (
                        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>Obiettivo: {row.target}</p>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* weight comparison */}
              {(weekAvg.weight || prevAvg.weight) && (
                <div className="card" style={{ padding: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>âš–ï¸ Peso</h3>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1, textAlign: 'center', padding: '14px 10px', background: 'var(--green-pale)', borderRadius: 12 }}>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Questa settimana</p>
                      <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--green-main)' }}>{weekAvg.weight ?? 'â€“'} <span style={{ fontSize: 13 }}>kg</span></p>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center', padding: '14px 10px', background: 'var(--surface-2)', borderRadius: 12 }}>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Settimana prec.</p>
                      <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-secondary)' }}>{prevAvg.weight ?? 'â€“'} <span style={{ fontSize: 13 }}>kg</span></p>
                    </div>
                  </div>
                  {weekAvg.weight && prevAvg.weight && (
                    <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: weekAvg.weight < prevAvg.weight ? 'var(--green-main)' : weekAvg.weight > prevAvg.weight ? 'var(--red)' : 'var(--text-muted)' }}>
                      {weekAvg.weight < prevAvg.weight ? <TrendingDown size={16} /> : weekAvg.weight > prevAvg.weight ? <TrendingUp size={16} /> : <Minus size={16} />}
                      {weekAvg.weight < prevAvg.weight ? 'Persi ' : weekAvg.weight > prevAvg.weight ? 'Guadagnati ' : 'Stabile '}
                      {weekAvg.weight !== prevAvg.weight && `${Math.abs(round1(weekAvg.weight - prevAvg.weight))} kg`}
                    </div>
                  )}
                </div>
              )}

              {/* water comparison */}
              <div className="card" style={{ padding: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>ðŸ’§ Idratazione</h3>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1, textAlign: 'center', padding: '14px 10px', background: 'rgba(59,130,246,0.08)', borderRadius: 12 }}>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Questa settimana</p>
                    <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--blue)' }}>{weekAvg.water ? `${Math.round(weekAvg.water)}` : 'â€“'} <span style={{ fontSize: 13 }}>ml/die</span></p>
                  </div>
                  <div style={{ flex: 1, textAlign: 'center', padding: '14px 10px', background: 'var(--surface-2)', borderRadius: 12 }}>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Settimana prec.</p>
                    <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-secondary)' }}>{prevAvg.water ? `${Math.round(prevAvg.water)}` : 'â€“'} <span style={{ fontSize: 13 }}>ml/die</span></p>
                  </div>
                </div>
              </div>
            </>
            </ProGate>
          )}

          {/* â”€â”€ TAB: report PDF â”€â”€ */}
          {tab === 'report' && (
            <ProGate feature="Report PDF" teaser="Genera report professionali da condividere con il tuo dietista">
            <>
              {/* Toggle settimanale / mensile */}
              <div style={{ display: 'flex', background: 'var(--surface-2)', borderRadius: 12, padding: 4, gap: 4 }}>
                {[
                  { key: 'weekly', label: 'ðŸ“… Settimanale' },
                  { key: 'monthly', label: 'ðŸ—“ï¸ Mensile' },
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
                    <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Report Settimanale PDF</h2>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.5 }}>
                      {weekLabel}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.5 }}>
                      Include medie macro, idratazione, peso e aderenza alla dieta.
                    </p>
                    <button className="btn btn-primary btn-full" onClick={generatePdf} disabled={generatingPdf} style={{ fontSize: 15, padding: '14px 20px' }}>
                      {generatingPdf ? <span>Generazione in corsoâ€¦</span> : <><Download size={18} />Scarica Report PDF</>}
                    </button>
                  </div>
                  <div className="card" style={{ padding: 16 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>ðŸ“‹ Anteprima contenuto</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {[
                        { icon: 'ðŸ“…', title: 'Periodo', desc: weekLabel },
                        { icon: 'ðŸ”¥', title: 'Media calorie', desc: `${weekAvg.kcal} kcal/die${dietTarget?.kcal_target ? ` (obiettivo: ${dietTarget.kcal_target})` : ''}` },
                        { icon: 'ðŸ’ª', title: 'Proteine medie', desc: `${weekAvg.proteins} g/die` },
                        { icon: 'ðŸŒ¾', title: 'Carboidrati medi', desc: `${weekAvg.carbs} g/die` },
                        { icon: 'ðŸ¥‘', title: 'Grassi medi', desc: `${weekAvg.fats} g/die` },
                        { icon: 'ðŸ’§', title: 'Acqua media', desc: weekAvg.water ? `${Math.round(weekAvg.water)} ml/die` : 'Nessun dato' },
                        { icon: 'âš–ï¸', title: 'Peso medio', desc: weekAvg.weight ? `${weekAvg.weight} kg` : 'Nessun dato' },
                        { icon: 'âœ…', title: 'Aderenza dieta', desc: `${avgAdherence}% media settimanale` },
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
                        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>Report Mensile PDF</h2>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Visita di controllo mensile</p>
                      </div>
                    </div>
                    <div className="input-group" style={{ marginBottom: 16 }}>
                      <label className="input-label">Mese di riferimento</label>
                      <input
                        type="month"
                        className="input-field"
                        value={monthStr}
                        onChange={e => setMonthStr(e.target.value)}
                        max={format(today, 'yyyy-MM')}
                      />
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
                      Il PDF include medie mensili, riepilogo per settimana, dettaglio giornaliero e aderenza alla dieta per {monthStr ? format(new Date(monthStr + '-01'), 'MMMM yyyy', { locale: it }) : 'il mese selezionato'}.
                    </p>
                    <button className="btn btn-primary btn-full" onClick={generateMonthlyPdf} disabled={generatingMonthlyPdf || !monthStr} style={{ fontSize: 15, padding: '14px 20px' }}>
                      {generatingMonthlyPdf ? <span>Generazione in corsoâ€¦</span> : <><Download size={18} />Scarica Report Mensile</>}
                    </button>
                  </div>
                  <div className="card" style={{ padding: 16 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>ðŸ“‹ Contenuto del report mensile</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {[
                        { icon: 'ðŸ“Š', text: 'Medie mensili di calorie, proteine, carboidrati e grassi' },
                        { icon: 'ðŸ“…', text: 'Riepilogo per settimana (4-5 settimane del mese)' },
                        { icon: 'ðŸ“‹', text: 'Dettaglio giornaliero con tutti i macronutrienti' },
                        { icon: 'ðŸ’§', text: 'Media idratazione giornaliera' },
                        { icon: 'âš–ï¸', text: 'Andamento peso nel mese' },
                        { icon: 'âœ…', text: 'Aderenza media alla dieta prescritta' },
                        { icon: 'ðŸ“', text: 'Spazio note per il dietista' },
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
                Il PDF viene salvato sul tuo dispositivo e puÃ² essere inviato via email o WhatsApp al tuo dietista.
              </p>
            </>
            </ProGate>
          )}


          {/* Body measurements section */}
          <div className="card" style={{ padding: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>📏 Misure Corporee</h3>

            {/* Form */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <div>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 4 }}>Girovita (cm)</label>
                <input type="number" className="input-field" placeholder="es. 78" value={waist} onChange={e => setWaist(e.target.value)} inputMode="decimal" step="0.1" />
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 4 }}>Fianchi (cm)</label>
                <input type="number" className="input-field" placeholder="es. 95" value={hips} onChange={e => setHips(e.target.value)} inputMode="decimal" step="0.1" />
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 4 }}>Braccia (cm)</label>
                <input type="number" className="input-field" placeholder="es. 30" value={arms} onChange={e => setArms(e.target.value)} inputMode="decimal" step="0.1" />
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 4 }}>Cosce (cm)</label>
                <input type="number" className="input-field" placeholder="es. 55" value={thighs} onChange={e => setThighs(e.target.value)} inputMode="decimal" step="0.1" />
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 4 }}>Data</label>
              <input type="date" className="input-field" value={measureDate} onChange={e => setMeasureDate(e.target.value)} max={new Date().toISOString().split('T')[0]} />
            </div>
            <button className="btn btn-primary btn-full" onClick={saveMeasure} disabled={savingMeasure}>
              {savingMeasure ? 'Salvataggio...' : 'Salva misure'}
            </button>
            {measureMsg && (
              <p style={{ fontSize: 13, marginTop: 8, color: measureMsg.includes('✅') ? 'var(--green-main)' : 'var(--red)' }}>
                {measureMsg}
              </p>
            )}

            {/* Waist trend chart */}
            {bodyMeasurements.filter(m => m.waist_cm).length > 1 && (
              <div style={{ marginTop: 20 }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Trend girovita</h4>
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={[...bodyMeasurements].filter(m => m.waist_cm).reverse()} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                    <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'var(--text-muted)' }} tickFormatter={d => d ? d.slice(5) : ''} />
                    <YAxis tick={{ fontSize: 9, fill: 'var(--text-muted)' }} domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip formatter={v => [v + ' cm', 'Girovita']} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    <Line type="monotone" dataKey="waist_cm" stroke="var(--green-main)" dot={{ r: 3 }} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* History table */}
            {bodyMeasurements.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Ultime misure</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {bodyMeasurements.map((m, i) => (
                    <div key={m.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'var(--surface-2)', borderRadius: 10, fontSize: 12 }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{m.date}</span>
                      <div style={{ display: 'flex', gap: 10, color: 'var(--text-muted)' }}>
                        {m.waist_cm && <span>○ {m.waist_cm} cm</span>}
                        {m.hips_cm && <span>○ F {m.hips_cm}</span>}
                        {m.arms_cm && <span>○ B {m.arms_cm}</span>}
                        {m.thighs_cm && <span>○ C {m.thighs_cm}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}


