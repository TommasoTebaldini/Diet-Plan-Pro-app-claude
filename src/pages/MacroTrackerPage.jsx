import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useT } from '../i18n'
import { searchFoodsLocal, searchFoods, searchByBarcode } from '../lib/foodSearch'
import { Plus, Trash2, Apple, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Clock, ScanLine, AlertCircle, Pencil, Check, Lock, Camera } from 'lucide-react'
import BarcodeScanner from '../components/BarcodeScanner'
import MealPhotoAnalyzer from '../components/MealPhotoAnalyzer'
import ProGate from '../components/ProGate'
import { useSubscription } from '../hooks/useSubscription'

const FREE_HISTORY_DAYS = 7

function calcMacros(food, grams) {
  const f = (parseFloat(grams) || 100) / 100
  return {
    kcal: Math.round((food.kcal_100g || 0) * f),
    proteins: Math.round((food.proteins_100g || 0) * f * 10) / 10,
    carbs: Math.round((food.carbs_100g || 0) * f * 10) / 10,
    fats: Math.round((food.fats_100g || 0) * f * 10) / 10,
  }
}

function getDefaultServingSize(food) {
  if (food.serving_size_g) return food.serving_size_g
  if (food.default_grams) return food.default_grams
  const cat = food.category || ''
  if (cat === 'Proteine') return 100
  if (cat === 'Legumi') return 150
  if (cat === 'Verdure') return 200
  if (cat === 'Frutta') return 150
  if (cat === 'Frutta secca') return 30
  if (cat === 'Latticini') return 125
  if (cat === 'Grassi') return 10
  if (cat === 'Cereali') return 80
  if (cat === 'Condimenti e Salse') return 15
  if (cat === 'Bevande') return 200
  if (cat === 'Dolci e Zuccheri') return 50
  if (cat === 'Salumi e Insaccati') return 50
  if (cat === 'Pane e Prodotti da Forno') return 50
  if (cat === 'Piatti Pronti') return 200
  if (cat === 'Snack e Ultra-Processati') return 30
  return 100
}

const MEALS_STATIC = [
  { key: 'colazione', emoji: '☀️', defaultTime: '07:30', accent: '#f59e0b', pale: '#fffbeb' },
  { key: 'spuntino_mattina', emoji: '🍎', defaultTime: '10:00', accent: '#10b981', pale: '#ecfdf5' },
  { key: 'pranzo', emoji: '🍽️', defaultTime: '12:30', accent: '#3b82f6', pale: '#eff6ff' },
  { key: 'spuntino_pomeriggio', emoji: '🥤', defaultTime: '15:30', accent: '#8b5cf6', pale: '#f5f3ff' },
  { key: 'cena', emoji: '🌙', defaultTime: '19:30', accent: '#6366f1', pale: '#eef2ff' },
  { key: 'extra', emoji: '➕', defaultTime: '12:00', accent: '#64748b', pale: '#f8fafc' },
]

const MOOD_OPTIONS = [
  { value: 1, emoji: '😞', label: 'Pessimo' },
  { value: 2, emoji: '😕', label: 'Non bene' },
  { value: 3, emoji: '😐', label: 'Normale' },
  { value: 4, emoji: '😊', label: 'Bene' },
  { value: 5, emoji: '😄', label: 'Ottimo' },
]

function MacroBar({ label, value, target, color }) {
  const pct = Math.min(100, target > 0 ? Math.round((value / target) * 100) : 0)
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
        <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ color: 'var(--text-muted)' }}>{value}g{target ? ` / ${target}g` : ''}</span>
      </div>
      <div style={{ height: 6, background: 'var(--border-light)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  )
}

export default function MacroTrackerPage() {
  const { user } = useAuth()
  const { isPro } = useSubscription()
  const t = useT()
  const MEALS = MEALS_STATIC.map(m => ({
    ...m,
    label: m.key === 'extra' ? 'Extra' : t(`meal.${m.key}`),
  }))
  const todayStr = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(todayStr)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState(null)
  const [grams, setGrams] = useState('100')
  const [mealTime, setMealTime] = useState('12:30')
  const [meal, setMeal] = useState('pranzo')
  const [log, setLog] = useState([])
  const [diet, setDiet] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [expandedMeal, setExpandedMeal] = useState('colazione')
  const [activeMealAdd, setActiveMealAdd] = useState(null)
  const [mood, setMood] = useState(null)
  const [addedFood, setAddedFood] = useState(null)
  const [showScanner, setShowScanner] = useState(false)
  const [scanningBarcode, setScanningBarcode] = useState(false)
  const [barcodeError, setBarcodeError] = useState('')
  const [barcodeFoodModal, setBarcodeFoodModal] = useState(null)
  const [editingFood, setEditingFood] = useState(null) // food log id being edited
  const [editGrams, setEditGrams] = useState('')
  const [editSaving, setEditSaving] = useState(false)
  const [showPhotoAnalyzer, setShowPhotoAnalyzer] = useState(false)
  const searchRef = useRef(null)
  const searchCacheRef = useRef(new Map())
  const latestSearchIdRef = useRef(0)
  const [, forceUpdate] = useState(0)
  const [mealNoteInputs, setMealNoteInputs] = useState({})
  const [savingNote, setSavingNote] = useState(null)

  // Reposition portal dropdown on scroll/resize
  useEffect(() => {
    if (!results.length) return
    const handler = () => forceUpdate(n => n + 1)
    window.addEventListener('scroll', handler, true)
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('scroll', handler, true)
      window.removeEventListener('resize', handler)
    }
  }, [results.length])

  useEffect(() => { loadLog() }, [date])

  async function loadLog() {
    const [foodRes, dietRes, wellnessRes] = await Promise.all([
      supabase.from('food_logs').select('id,date,meal_type,meal_time,food_name,grams,kcal,proteins,carbs,fats,food_data').eq('user_id', user.id).eq('date', date).order('created_at'),
      supabase.from('patient_diets').select('*').eq('user_id', user.id).eq('is_active', true).maybeSingle(),
      supabase.from('daily_wellness').select('mood').eq('user_id', user.id).eq('date', date).maybeSingle(),
    ])
    if (foodRes.error) console.error('[food_logs] load error:', foodRes.error)
    setLog(foodRes.data || [])
    setDiet(dietRes.data)
    setMood(wellnessRes.data?.mood || null)
  }

  // Two-phase live search: local results first (~200ms), then OFA in background
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([])
      setSearching(false)
      return
    }
    const normalizedQuery = query.trim().toLowerCase()
    const cachedResults = searchCacheRef.current.get(normalizedQuery)
    if (cachedResults) {
      setResults(cachedResults)
      setSearching(false)
      return
    }
    setSearching(true)
    const timer = setTimeout(async () => {
      const searchId = ++latestSearchIdRef.current
      try {
        // Phase 1: fast local results (no external API)
        const localFoods = await searchFoodsLocal(normalizedQuery)
        if (searchId !== latestSearchIdRef.current) return
        if (localFoods.length > 0) {
          setResults(localFoods)
          setSearching(false)
        }

        // Phase 2: always supplement with Open Food Facts for 3+ char queries
        if (normalizedQuery.length >= 3) {
          const allFoods = await searchFoods(normalizedQuery)
          if (searchId !== latestSearchIdRef.current) return
          searchCacheRef.current.set(normalizedQuery, allFoods)
          if (searchCacheRef.current.size > 40) {
            const firstKey = searchCacheRef.current.keys().next().value
            if (firstKey) searchCacheRef.current.delete(firstKey)
          }
          setResults(allFoods)
        } else {
          searchCacheRef.current.set(normalizedQuery, localFoods)
          if (searchCacheRef.current.size > 40) {
            const firstKey = searchCacheRef.current.keys().next().value
            if (firstKey) searchCacheRef.current.delete(firstKey)
          }
        }
      } catch (err) {
        console.error('Errore ricerca alimenti:', err)
        if (searchId !== latestSearchIdRef.current) return
        setResults([])
      } finally {
        if (searchId === latestSearchIdRef.current) setSearching(false)
      }
    }, 150)
    return () => clearTimeout(timer)
  }, [query])

  function selectMealType(key) {
    setMeal(key)
    const def = MEALS.find(m => m.key === key)
    if (def) setMealTime(def.defaultTime)
  }

  function openMealSearch(mealKey) {
    selectMealType(mealKey)
    setActiveMealAdd(mealKey)
    setSelected(null)
    setQuery('')
    setResults([])
  }

  function closeSearch() {
    setActiveMealAdd(null)
    setSelected(null)
    setResults([])
    setSaveError('')
    setAddedFood(null)
  }

  function autoMealFromTime() {
    const h = new Date().getHours()
    if (h < 10) return 'colazione'
    if (h < 12) return 'spuntino_mattina'
    if (h < 15) return 'pranzo'
    if (h < 18) return 'spuntino_pomeriggio'
    return 'cena'
  }

  async function handleBarcodeFound(barcode) {
    setShowScanner(false)
    setScanningBarcode(true)
    setBarcodeError('')
    const food = await searchByBarcode(barcode)
    setScanningBarcode(false)
    if (food) {
      if (activeMealAdd) {
        // Inside meal search — fill directly
        setSelected(food)
        setGrams(String(getDefaultServingSize(food)))
        setQuery(food.name)
        setResults([])
      } else {
        // Header scan — open dedicated modal
        setBarcodeFoodModal({ food, grams: String(getDefaultServingSize(food)), meal: autoMealFromTime() })
      }
    } else {
      setBarcodeError(`Prodotto con codice "${barcode}" non trovato. Prova la ricerca manuale.`)
      setTimeout(() => setBarcodeError(''), 5000)
    }
  }

  async function addBarcodeFood() {
    if (!barcodeFoodModal) return
    setSaving(true)
    const { food, grams: gramsVal, meal: mealKey } = barcodeFoodModal
    const m = calcMacros(food, gramsVal)
    try {
      const foodData = {
        id: food.id, name: food.name, brand: food.brand || '',
        kcal_100g: food.kcal_100g || 0, proteins_100g: food.proteins_100g || 0,
        carbs_100g: food.carbs_100g || 0, fats_100g: food.fats_100g || 0,
        fiber_100g: food.fiber_100g || 0, source: food.source || '',
      sugar_100g: food.sugar_100g || 0, fatSat_100g: food.fatSat_100g || 0,
      }
      const { data, error } = await supabase.from('food_logs').insert({
        user_id: user.id,
        date, meal_type: mealKey, food_name: food.name,
        grams: parseFloat(gramsVal) || 100, ...m,
        food_data: foodData,
      }).select().single()
      if (error || !data) { setSaving(false); return }
      setLog(l => [...l, data])
      await updateDailyLog()
      const savedName = food.name
      setBarcodeFoodModal(null)
      setExpandedMeal(mealKey)
      setAddedFood(savedName)
      setTimeout(() => setAddedFood(null), 2500)
    } catch (e) {
      console.error('Errore salvataggio barcode food:', e)
    } finally {
      setSaving(false)
    }
  }

  async function addFood() {
    if (!selected) return
    setSaving(true)
    setSaveError('')
    const m = calcMacros(selected, grams)
    let savedName = null
    try {
      // Build food_data with only defined values
      const foodData = {
        id: selected.id, name: selected.name, brand: selected.brand || '',
        kcal_100g: selected.kcal_100g || 0, proteins_100g: selected.proteins_100g || 0,
        carbs_100g: selected.carbs_100g || 0, fats_100g: selected.fats_100g || 0,
        fiber_100g: selected.fiber_100g || 0, source: selected.source || '',
        sugar_100g: selected.sugar_100g || 0, fatSat_100g: selected.fatSat_100g || 0,
        meal_time: mealTime || null,
      }
      const { data, error } = await supabase.from('food_logs').insert({
        user_id: user.id,
        date, meal_type: meal, meal_time: mealTime || null, food_name: selected.name,
        grams: parseFloat(grams) || 100, ...m,
        food_data: foodData,
      }).select().single()
      if (error) {
        console.error('Errore salvataggio alimento:', error)
        setSaveError(`Errore nel salvare l'alimento: ${error.message || 'errore sconosciuto'}. Riprova.`)
        return
      }
      if (!data) {
        setSaveError("Errore nel salvare l'alimento. Riprova.")
        return
      }
      setLog(l => [...l, data])
      await updateDailyLog()
      savedName = selected.name
      setSelected(null); setQuery(''); setResults([])
      setExpandedMeal(meal)
    } catch (e) {
      console.error('Errore imprevisto salvataggio:', e)
      setSaveError("Errore imprevisto nel salvare l'alimento. Riprova.")
    } finally {
      setSaving(false)
    }
    if (savedName) {
      setAddedFood(savedName)
      setTimeout(() => setAddedFood(null), 2500)
    }
  }

  async function addFoodsFromPhoto(foods) {
    const inserts = foods.map(f => ({
      user_id: user.id, date, meal_type: meal,
      food_name: f.food_name, grams: f.grams,
      kcal: f.kcal, proteins: f.proteins, carbs: f.carbs, fats: f.fats,
      food_data: f.food_data || {},
    }))
    const { data, error } = await supabase.from('food_logs').insert(inserts).select()
    if (!error && data) {
      setLog(l => [...l, ...data])
      await updateDailyLog()
    }
  }

  async function updateDailyLog() {
    const { data } = await supabase.from('food_logs').select('*').eq('user_id', user.id).eq('date', date)
    if (!data) return
    const t = data.reduce((a, f) => ({
      kcal: a.kcal + (f.kcal || 0), proteins: a.proteins + (f.proteins || 0),
      carbs: a.carbs + (f.carbs || 0), fats: a.fats + (f.fats || 0),
    }), { kcal: 0, proteins: 0, carbs: 0, fats: 0 })
    await supabase.from('daily_logs').upsert({ user_id: user.id, date, ...t }, { onConflict: 'user_id,date' })
  }

  async function removeFood(id) {
    await supabase.from('food_logs').delete().eq('id', id)
    setLog(l => l.filter(x => x.id !== id))
    await updateDailyLog()
  }

  async function saveNote(mealKey) {
    const note = (mealNoteInputs[mealKey] || '').trim()
    if (!note) return
    setSavingNote(mealKey)
    const { data, error } = await supabase.from('food_logs').insert({
      user_id: user.id,
      date, meal_type: mealKey, food_name: '__note__',
      grams: 0, kcal: 0, proteins: 0, carbs: 0, fats: 0,
      food_data: { isNote: true, note },
    }).select().single()
    if (!error && data) {
      setLog(l => [...l, data])
      setMealNoteInputs(prev => ({ ...prev, [mealKey]: '' }))
    }
    setSavingNote(null)
  }

  async function updateFoodGrams(foodLog) {
    const gVal = parseFloat(editGrams)
    if (!gVal || gVal <= 0) return
    setEditSaving(true)
    const fd = foodLog.food_data || {}
    const origG = foodLog.grams || 100
    const per100 = {
      kcal: fd.kcal_100g ?? (foodLog.kcal / origG * 100),
      proteins: fd.proteins_100g ?? (foodLog.proteins / origG * 100),
      carbs: fd.carbs_100g ?? (foodLog.carbs / origG * 100),
      fats: fd.fats_100g ?? (foodLog.fats / origG * 100),
    }
    const m = {
      kcal: Math.round(per100.kcal * gVal / 100),
      proteins: Math.round(per100.proteins * gVal / 10) / 10,
      carbs: Math.round(per100.carbs * gVal / 10) / 10,
      fats: Math.round(per100.fats * gVal / 10) / 10,
    }
    const { error } = await supabase.from('food_logs').update({ grams: gVal, ...m }).eq('id', foodLog.id)
    if (!error) {
      setLog(l => l.map(f => f.id === foodLog.id ? { ...f, grams: gVal, ...m } : f))
      await updateDailyLog()
    }
    setEditingFood(null)
    setEditSaving(false)
  }

  async function saveMood(value) {
    const newMood = mood === value ? null : value
    setMood(newMood)
    // First check if a wellness entry already exists for this date
    const { data: existing } = await supabase.from('daily_wellness').select('id')
      .eq('user_id', user.id).eq('date', date).maybeSingle()
    if (existing) {
      // Only update the mood field to preserve other wellness data
      await supabase.from('daily_wellness').update({ mood: newMood })
        .eq('user_id', user.id).eq('date', date)
    } else {
      await supabase.from('daily_wellness').insert(
        { user_id: user.id, date, mood: newMood }
      )
    }
  }

  function changeDate(delta) {
    const d = new Date(date)
    d.setDate(d.getDate() + delta)
    const next = d.toISOString().split('T')[0]
    if (!isPro && delta < 0) {
      const daysBack = Math.round((new Date(todayStr) - new Date(next)) / (1000 * 60 * 60 * 24))
      if (daysBack > FREE_HISTORY_DAYS) return
    }
    setDate(next)
    setActiveMealAdd(null)
    setSelected(null)
    setQuery('')
    setResults([])
    setExpandedMeal('colazione')
  }

  const daysFromToday = Math.round((new Date(todayStr) - new Date(date)) / (1000 * 60 * 60 * 24))
  const atFreeLimit = !isPro && daysFromToday >= FREE_HISTORY_DAYS - 1

  const totals = log.filter(f => f.food_name !== '__note__').reduce((a, f) => ({
    kcal: a.kcal + (f.kcal || 0), proteins: a.proteins + (f.proteins || 0),
    carbs: a.carbs + (f.carbs || 0), fats: a.fats + (f.fats || 0),
  }), { kcal: 0, proteins: 0, carbs: 0, fats: 0 })

  const microTotals = log
    .filter(f => f.food_name !== '__note__')
    .reduce((a, f) => {
      const fd = f.food_data || {}
      const g = f.grams || 100
      return {
        fiber: a.fiber + (fd.fiber_100g || 0) * g / 100,
        sugar: a.sugar + (fd.sugar_100g || 0) * g / 100,
        fatSat: a.fatSat + (fd.fatSat_100g || 0) * g / 100,
      }
    }, { fiber: 0, sugar: 0, fatSat: 0 })

  const preview = selected ? calcMacros(selected, grams) : null
  const isToday = date === todayStr
  const displayDate = new Date(date + 'T12:00:00')

  return (
    <div className="page">
      {/* ── Header ── */}
      <div style={{ background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))', padding: 'calc(env(safe-area-inset-top) + 16px) 16px 18px', flexShrink: 0 }}>
        {/* Date navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <button
            onClick={() => changeDate(-1)}
            disabled={atFreeLimit}
            title={atFreeLimit ? `Piano Free: storico limitato a ${FREE_HISTORY_DAYS} giorni` : undefined}
            style={{ background: atFreeLimit ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: atFreeLimit ? 'default' : 'pointer', color: atFreeLimit ? 'rgba(255,255,255,0.35)' : 'white', flexShrink: 0 }}>
            {atFreeLimit ? <Lock size={15} /> : <ChevronLeft size={18} />}
          </button>

          <div style={{ textAlign: 'center', flex: 1 }}>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11 }}>Diario alimentare</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'white', fontWeight: 300, lineHeight: 1.2 }}>
              {isToday ? 'Oggi · ' : ''}{displayDate.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })}
            </h1>
          </div>

          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
            <button
              onClick={() => setShowPhotoAnalyzer(true)}
              title="Analizza foto pasto con AI"
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
            >
              <Camera size={18} />
            </button>
            <button
              onClick={() => setShowScanner(true)}
              title="Scansiona codice a barre"
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
            >
              {scanningBarcode
                ? <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'block' }} />
                : <ScanLine size={18} />
              }
            </button>
            <button onClick={() => changeDate(1)} disabled={isToday} style={{ background: isToday ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isToday ? 'default' : 'pointer', color: isToday ? 'rgba(255,255,255,0.3)' : 'white' }}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Macro totals */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          {[
            { label: 'Kcal', val: `${totals.kcal}${diet?.kcal_target ? `/${diet.kcal_target}` : ''}` },
            { label: 'Prot.', val: `${totals.proteins}g` },
            { label: 'Carbo', val: `${totals.carbs}g` },
            { label: 'Grassi', val: `${totals.fats}g` },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: '7px 4px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.12)' }}>
              <p style={{ color: 'white', fontSize: 13, fontWeight: 700 }}>{s.val}</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Mood row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, flexShrink: 0 }}>Umore:</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {MOOD_OPTIONS.map(m => (
              <button key={m.value} onClick={() => saveMood(m.value)} title={m.label} style={{
                background: mood === m.value ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.08)',
                border: `1.5px solid ${mood === m.value ? 'rgba(255,255,255,0.7)' : 'transparent'}`,
                borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: 17, transition: 'all 0.15s',
                transform: mood === m.value ? 'scale(1.15)' : 'none',
              }}>
                {m.emoji}
              </button>
            ))}
          </div>
          {mood && (
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginLeft: 2 }}>
              {MOOD_OPTIONS.find(m => m.value === mood)?.label}
            </span>
          )}
        </div>
      </div>

      <div style={{ padding: '14px 14px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Free plan history limit banner */}
        {atFreeLimit && (
          <div style={{ background: '#fefce8', border: '1.5px solid #fde68a', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Lock size={15} color="#92400e" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12.5, fontWeight: 600, color: '#92400e', margin: 0 }}>
                Storico limitato a {FREE_HISTORY_DAYS} giorni nel piano Free
              </p>
              <p style={{ fontSize: 11.5, color: '#78350f', margin: '2px 0 0' }}>
                Passa al Pro per accedere a tutto lo storico del diario.
              </p>
            </div>
          </div>
        )}

        {/* ── Macro targets ── */}
        {diet && (
          <div className="card" style={{ padding: 14 }}>
            <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Obiettivi giornalieri</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <MacroBar label="Proteine" value={totals.proteins} target={diet.protein_target} color="#3b82f6" />
              <MacroBar label="Carboidrati" value={totals.carbs} target={diet.carbs_target} color="#f0922b" />
              <MacroBar label="Grassi" value={totals.fats} target={diet.fats_target} color="#e05a5a" />
            </div>
          </div>
        )}

        {/* ── Meal cards ── */}
        {MEALS.map((m, mIdx) => {
          const mealFoods = log.filter(f => f.meal_type === m.key && f.food_name !== '__note__')
          const mealNotes = log.filter(f => f.meal_type === m.key && f.food_name === '__note__')
          const mealKcal = mealFoods.reduce((s, f) => s + (f.kcal || 0), 0)
          const isOpen = expandedMeal === m.key
          const isSearching = activeMealAdd === m.key
          const times = mealFoods.map(f => f.food_data?.meal_time).filter(Boolean).sort()
          const timeLabel = times.length > 0 ? times[0] : null
          return (
            <div key={m.key} className="card animate-fadeIn" style={{ padding: 0, overflow: isSearching ? 'visible' : 'hidden', position: 'relative', zIndex: isSearching ? 30 : 1, borderLeft: `3px solid ${m.accent || 'var(--green-main)'}`, animationDelay: `${mIdx * 0.05}s`, transition: 'box-shadow .18s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '13px 14px', gap: 9 }}>
                <button onClick={() => { setExpandedMeal(isOpen ? null : m.key); if (isOpen && isSearching) closeSearch() }} style={{ display: 'flex', alignItems: 'center', gap: 9, flex: 1, background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', color: 'var(--text-primary)', padding: 0, textAlign: 'left' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: m.pale || 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                    {m.emoji}
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{m.label}</span>
                    {timeLabel && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 1 }}>
                        <Clock size={10} color="var(--text-muted)" />
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{timeLabel}</span>
                      </div>
                    )}
                  </div>
                  {mealKcal > 0 && (
                    <span style={{ fontSize: 12, fontWeight: 600, color: m.accent || 'var(--green-main)', background: m.pale || 'var(--surface-2)', padding: '3px 8px', borderRadius: 100, marginRight: 4 }}>
                      {mealKcal} kcal
                    </span>
                  )}
                  {isOpen ? <ChevronUp size={15} color="var(--text-muted)" /> : <ChevronDown size={15} color="var(--text-muted)" />}
                </button>
                <button
                  onClick={() => { if (isSearching) { closeSearch() } else { openMealSearch(m.key); setExpandedMeal(m.key) } }}
                  title={`Aggiungi a ${m.label}`}
                  style={{ flexShrink: 0, minWidth: 44, minHeight: 44, borderRadius: 8, background: isSearching ? (m.accent || 'var(--green-main)') : (m.pale || 'var(--green-pale)'), border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isSearching ? 'white' : (m.accent || 'var(--green-main)') }}
                >
                  {isSearching ? <X size={14} /> : <Plus size={14} />}
                </button>
              </div>
              {isOpen && (
                <div style={{ borderTop: '1px solid var(--border-light)', padding: '10px 14px 12px' }}>
                  {mealFoods.map(f => (
                    <div key={f.id} style={{ paddingBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 9, background: m.pale || 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Apple size={14} color={m.accent || 'var(--green-main)'} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.food_name}</p>
                          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            {f.grams}g · {f.kcal} kcal · P:{f.proteins}g
                            {f.food_data?.meal_time && <> · <Clock size={9} style={{ display: 'inline', verticalAlign: 'middle' }} /> {f.food_data.meal_time}</>}
                          </p>
                        </div>
                        <button onClick={() => { setEditingFood(f.id); setEditGrams(String(f.grams || 100)) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 10, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => removeFood(f.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 10, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                      {editingFood === f.id && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 6, paddingLeft: 41 }}>
                          <input
                            type="number" min={1} inputMode="decimal"
                            value={editGrams}
                            onChange={e => setEditGrams(e.target.value)}
                            style={{ width: 80, padding: '5px 10px', border: '1.5px solid var(--border)', borderRadius: 8, background: 'var(--surface-2)', color: 'var(--text-primary)', outline: 'none', fontSize: 16 }}
                            autoFocus
                          />
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>g</span>
                          <button onClick={() => updateFoodGrams(f)} disabled={editSaving} style={{ background: 'var(--green-main)', border: 'none', borderRadius: 8, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                            {editSaving ? <span style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'block' }} /> : <Check size={14} color="white" />}
                          </button>
                          <button onClick={() => setEditingFood(null)} style={{ background: 'var(--surface-3)', border: 'none', borderRadius: 8, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                            <X size={14} color="var(--text-muted)" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {/* Meal notes */}
                  {mealNotes.map(n => {
                    const fd = n.food_data
                    const noteText = fd
                      ? (typeof fd === 'string' ? (() => { try { return JSON.parse(fd)?.note || fd } catch { return fd } })() : (fd?.note || ''))
                      : ''
                    if (!noteText) return null
                    return (
                      <div key={n.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6, padding: '7px 10px', background: '#fffbeb', borderRadius: 8, border: '1px dashed #fde68a' }}>
                        <span style={{ fontSize: 15, lineHeight: 1.4 }}>📝</span>
                        <p style={{ flex: 1, fontSize: 12.5, color: '#78350f', lineHeight: 1.5, margin: 0 }}>{noteText}</p>
                        <button onClick={() => removeFood(n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b45309', padding: '2px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )
                  })}

                  {mealFoods.length === 0 && mealNotes.length === 0 && !isSearching && (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '8px 0' }}>
                      Nessun alimento — tocca + per aggiungere
                    </p>
                  )}

                  {/* Note input */}
                  {!isSearching && (
                    <div style={{ marginTop: (mealFoods.length > 0 || mealNotes.length > 0) ? 6 : 0, display: 'flex', gap: 6 }}>
                      <input
                        type="text"
                        placeholder="📝 Aggiungi nota al pasto…"
                        value={mealNoteInputs[m.key] || ''}
                        onChange={e => setMealNoteInputs(prev => ({ ...prev, [m.key]: e.target.value }))}
                        onKeyDown={e => { if (e.key === 'Enter' && mealNoteInputs[m.key]?.trim()) saveNote(m.key) }}
                        style={{ flex: 1, padding: '7px 11px', border: '1.5px solid var(--border)', borderRadius: 10, background: 'var(--surface-2)', fontSize: 13, outline: 'none', color: 'var(--text-primary)', fontFamily: 'var(--font-b)' }}
                      />
                      <button
                        onClick={() => saveNote(m.key)}
                        disabled={!mealNoteInputs[m.key]?.trim() || savingNote === m.key}
                        style={{ flexShrink: 0, padding: '0 14px', height: 40, background: mealNoteInputs[m.key]?.trim() ? 'var(--green-pale)' : 'var(--surface-3)', border: `1.5px solid ${mealNoteInputs[m.key]?.trim() ? 'var(--green-main)' : 'var(--border)'}`, borderRadius: 10, cursor: mealNoteInputs[m.key]?.trim() ? 'pointer' : 'default', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: mealNoteInputs[m.key]?.trim() ? 1 : 0.4, transition: 'all 0.15s' }}
                      >
                        {savingNote === m.key
                          ? <span style={{ width: 12, height: 12, border: '2px solid var(--border)', borderTopColor: 'var(--green-main)', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'block' }} />
                          : '📝'}
                      </button>
                    </div>
                  )}

                  {/* ── Inline search form ── */}
                  {isSearching && (
                    <div className="animate-slideUp" style={{ marginTop: mealFoods.length > 0 ? 6 : 0, padding: '10px 0 0' }}>
                      {/* Success confirmation */}
                      {addedFood && (
                        <div className="animate-popIn" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--green-pale)', borderRadius: 10, padding: '9px 12px', marginBottom: 10, color: 'var(--green-dark)', fontSize: 13, fontWeight: 500 }}>
                          <span>✅</span> <span>"{addedFood}" aggiunto!</span>
                        </div>
                      )}
                      {/* Error feedback */}
                      {saveError && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--alert-error-bg)', borderRadius: 10, padding: '9px 12px', marginBottom: 10, color: 'var(--alert-error-text)', fontSize: 13, fontWeight: 500 }}>
                          <span>⚠️</span> <span>{saveError}</span>
                        </div>
                      )}

                      {/* Live search input */}
                      <div style={{ position: 'relative', marginBottom: 8 }} ref={searchRef}>
                        <div style={{ position: 'relative', display: 'flex', gap: 8 }}>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="Cerca alimento (es. pollo, pasta, mela…)"
                            value={query}
                            onChange={e => { setQuery(e.target.value); setSelected(null); setSaveError('') }}
                            autoComplete="off"
                            style={{ flex: 1, paddingRight: searching ? 40 : 14 }}
                          />
                          {(searching || scanningBarcode) && (
                            <span style={{ position: 'absolute', right: 52, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, border: '2px solid var(--border)', borderTopColor: 'var(--green-main)', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'block' }} />
                          )}
                          <button
                            type="button"
                            onClick={() => setShowScanner(true)}
                            title="Scansiona codice a barre"
                            style={{ flexShrink: 0, width: 42, height: 42, background: 'var(--surface-2)', border: '1.5px solid var(--border)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}
                          >
                            <ScanLine size={18} />
                          </button>
                        </div>

                        {/* Barcode error */}
                        {barcodeError && (
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center', background: 'var(--alert-error-bg)', padding: '8px 12px', borderRadius: 8, marginTop: 8, color: 'var(--alert-error-text)', fontSize: 12 }}>
                            <AlertCircle size={14} style={{ flexShrink: 0 }} />
                            <span>{barcodeError}</span>
                          </div>
                        )}

                        {/* Dropdown results — rendered in a portal to avoid overflow:hidden clipping */}
                        {!selected && (results.length > 0 || (searching && query.trim().length >= 2)) && searchRef.current && createPortal(
                          <div className="animate-dropdown" style={{
                            position: 'fixed',
                            top: searchRef.current.getBoundingClientRect().bottom + 4,
                            left: searchRef.current.getBoundingClientRect().left,
                            width: searchRef.current.getBoundingClientRect().width,
                            zIndex: 99999,
                            background: 'var(--surface, #fff)',
                            border: '1.5px solid var(--border, #e5e7eb)',
                            borderRadius: 12,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                            maxHeight: 260,
                            overflowY: 'auto',
                          }}>
                            {searching && results.length === 0 && (
                              <div style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ width: 12, height: 12, border: '2px solid var(--border)', borderTopColor: 'var(--green-main)', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block', flexShrink: 0 }} />
                                Ricerca in corso…
                              </div>
                            )}
                            {results.map((f, i) => (
                              <button key={`${f.id}_${i}`} className="animate-listItem stagger-item" onClick={() => { setSelected(f); setGrams(String(getDefaultServingSize(f))); setResults([]) }} style={{
                                width: '100%', background: 'none', border: 'none', borderBottom: i < results.length - 1 ? '1px solid var(--border-light, #f3f4f6)' : 'none',
                                padding: '10px 13px', textAlign: 'left', cursor: 'pointer', font: 'inherit',
                                transition: 'background .12s',
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'none'}
                              >
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
                                  <p style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.3, flex: 1 }}>{f.name}</p>
                                  {(() => {
                                    const badges = { recent: ['Recente', 'var(--icon-bg-orange)', 'var(--alert-warning-text)'], diet: ['Piano', 'var(--green-pale)', 'var(--green-main)'], recipe: ['Ricetta', 'var(--icon-bg-orange)', 'var(--alert-warning-text)'], custom_meal: ['Pasto', 'var(--icon-bg-green)', 'var(--green-dark)'], openfoodfacts: ['OFF', 'var(--surface-3)', 'var(--text-muted)'], dietitian: ['CREA', 'var(--icon-bg-green)', 'var(--green-dark)'] }
                                    const [label, bg, color] = badges[f.source] || badges.openfoodfacts
                                    return <span style={{ fontSize: 9, background: bg, color, padding: '2px 6px', borderRadius: 100, fontWeight: 700, flexShrink: 0 }}>{label}</span>
                                  })()}
                                </div>
                                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                                  {f.brand ? `${f.brand} · ` : ''}{f.kcal_100g} kcal · P:{f.proteins_100g} C:{f.carbs_100g} G:{f.fats_100g}
                                </p>
                              </button>
                            ))}
                          </div>,
                          document.body
                        )}

                        {!selected && !searching && query.trim().length >= 2 && results.length === 0 && (
                          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', padding: '10px 0' }}>
                            Nessun risultato per "{query}". Prova con un termine diverso.
                          </p>
                        )}
                      </div>

                      {/* Selected food + grams + time */}
                      {selected && (
                        <div>
                          <div style={{ background: 'var(--green-pale)', borderRadius: 12, padding: '11px 13px', marginBottom: 11, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                            <div style={{ flex: 1 }}>
                              <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{selected.name}</p>
                              {preview && <p style={{ fontSize: 12, color: 'var(--green-dark)' }}>{preview.kcal} kcal · P:{preview.proteins}g · C:{preview.carbs}g · G:{preview.fats}g</p>}
                            </div>
                            <button onClick={() => { setSelected(null); setQuery('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'var(--text-muted)' }}><X size={15} /></button>
                          </div>
                          <div style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                            <div className="input-group" style={{ flex: '1 1 80px' }}>
                              <label className="input-label">Porzioni</label>
                              <input type="number" className="input-field"
                                value={parseFloat(grams) > 0 ? Math.round(parseFloat(grams) / getDefaultServingSize(selected) * 100) / 100 : ''}
                                onChange={e => {
                                  const p = parseFloat(e.target.value)
                                  if (!isNaN(p) && p > 0) setGrams(String(Math.round(p * getDefaultServingSize(selected))))
                                  else setGrams('')
                                }}
                                min={0} step="any" inputMode="decimal" />
                            </div>
                            <div className="input-group" style={{ flex: '1 1 80px' }}>
                              <label className="input-label">Quantità (g)</label>
                              <input type="number" className="input-field" value={grams} onChange={e => setGrams(e.target.value)} min={1} inputMode="decimal" />
                            </div>
                            <div className="input-group" style={{ flex: '1 1 80px' }}>
                              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} />Orario</label>
                              <select value={mealTime} onChange={e => setMealTime(e.target.value)} style={{ cursor: 'pointer', width: '100%', padding: '6px 10px', border: '1.5px solid var(--border)', borderRadius: 10, background: 'var(--surface-2)', color: 'var(--text-primary)', fontSize: 13, outline: 'none', appearance: 'none', WebkitAppearance: 'none', fontFamily: 'var(--font-b)' }}>
                                {Array.from({ length: 38 }, (_, i) => {
                                  const h = Math.floor(i / 2) + 5
                                  const mn = i % 2 === 0 ? '00' : '30'
                                  const t = `${String(h).padStart(2, '0')}:${mn}`
                                  return <option key={t} value={t}>{t}</option>
                                })}
                              </select>
                            </div>
                          </div>
                          <button className="btn btn-primary btn-full" onClick={addFood} disabled={saving}>
                            {saving ? '…' : 'Aggiungi al diario'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {/* Micronutrient section — Pro only */}
        <ProGate feature="Micronutrienti" teaser="Monitora vitamine, minerali e fibre con il piano Pro">
          <div className="card" style={{ padding: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>🔬 Micronutrienti del giorno</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { label: 'Fibra', val: microTotals.fiber > 0 ? `${Math.round(microTotals.fiber * 10) / 10}` : '–', unit: 'g', icon: '🌾' },
                { label: 'Sodio', val: '–', unit: 'mg', icon: '🧂' },
                { label: 'Calcio', val: '–', unit: 'mg', icon: '🦴' },
                { label: 'Ferro', val: '–', unit: 'mg', icon: '🔴' },
                { label: 'Zuccheri semplici', val: microTotals.sugar > 0 ? `${Math.round(microTotals.sugar * 10) / 10}` : '–', unit: 'g', icon: '🍬' },
                { label: 'Grassi saturi', val: microTotals.fatSat > 0 ? `${Math.round(microTotals.fatSat * 10) / 10}` : '–', unit: 'g', icon: '🫒' },
              ].map(n => (
                <div key={n.label} style={{ background: 'var(--surface-2)', borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{n.icon}</span>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600 }}>{n.label}</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--green-main)' }}>{n.val} <span style={{ fontSize: 10, fontWeight: 400, color: 'var(--text-muted)' }}>{n.unit}</span></p>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10, textAlign: 'center' }}>
              Fibra, zuccheri semplici e grassi saturi calcolati dagli alimenti aggiunti oggi.
            </p>
          </div>
        </ProGate>

        <div style={{ height: 24 }} />
      </div>

      {showScanner && (
        <BarcodeScanner
          onFound={handleBarcodeFound}
          onClose={() => setShowScanner(false)}
        />
      )}

      <AnimatePresence>
        {showPhotoAnalyzer && (
          <MealPhotoAnalyzer
            onAddFoods={addFoodsFromPhoto}
            onClose={() => setShowPhotoAnalyzer(false)}
          />
        )}
      </AnimatePresence>

      {/* Barcode food modal — opened when scanning from header (no meal open) */}
      {barcodeFoodModal && (() => {
        const { food, grams: bGrams, meal: bMeal } = barcodeFoodModal
        const bPreview = calcMacros(food, bGrams)
        return (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.65)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div className="animate-slideUp" style={{ background: 'var(--surface)', borderRadius: '20px 20px 0 0', padding: 20, paddingBottom: 'calc(20px + env(safe-area-inset-bottom))' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>🛒 Alimento trovato</h3>
                <button onClick={() => setBarcodeFoodModal(null)} style={{ background: 'var(--surface-2)', border: 'none', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={16} />
                </button>
              </div>

              {/* Food info */}
              <div style={{ background: 'var(--green-pale)', borderRadius: 12, padding: '12px 14px', marginBottom: 14 }}>
                <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{food.name}</p>
                {food.brand && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{food.brand}</p>}
                <div style={{ display: 'flex', gap: 14 }}>
                  {[
                    { label: 'Kcal', val: food.kcal_100g },
                    { label: 'Prot.', val: `${food.proteins_100g}g` },
                    { label: 'Carbo', val: `${food.carbs_100g}g` },
                    { label: 'Grassi', val: `${food.fats_100g}g` },
                  ].map(s => (
                    <div key={s.label} style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--green-dark)' }}>{s.val}</p>
                      <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{s.label}</p>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6 }}>valori per 100 g</p>
              </div>

              {/* Meal + grams */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">Pasto</label>
                  <select className="input-field" value={bMeal} onChange={e => setBarcodeFoodModal(m => ({ ...m, meal: e.target.value }))}>
                    {MEALS.map(m => <option key={m.key} value={m.key}>{m.emoji} {m.label}</option>)}
                  </select>
                </div>
                <div className="input-group" style={{ width: 110 }}>
                  <label className="input-label">Quantità (g)</label>
                  <input type="number" className="input-field" value={bGrams} onChange={e => setBarcodeFoodModal(m => ({ ...m, grams: e.target.value }))} min={1} inputMode="decimal" />
                </div>
              </div>

              {/* Macro preview */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {[
                  { label: 'Kcal', val: bPreview.kcal },
                  { label: 'Proteine', val: `${bPreview.proteins}g` },
                  { label: 'Carboidrati', val: `${bPreview.carbs}g` },
                  { label: 'Grassi', val: `${bPreview.fats}g` },
                ].map(s => (
                  <div key={s.label} style={{ flex: 1, background: 'var(--surface-2)', borderRadius: 8, padding: '7px 4px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
                    <p style={{ fontSize: 13, fontWeight: 700 }}>{s.val}</p>
                    <p style={{ fontSize: 9, color: 'var(--text-muted)' }}>{s.label}</p>
                  </div>
                ))}
              </div>

              <button className="btn btn-primary btn-full" onClick={addBarcodeFood} disabled={saving}>
                {saving ? '…' : 'Aggiungi al diario'}
              </button>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
