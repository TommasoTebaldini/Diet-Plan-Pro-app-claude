import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { searchFoods } from '../lib/foodSearch'
import { ChevronLeft, ChevronRight, Plus, X, ShoppingCart, Calendar, Share2, Trash2, Check } from 'lucide-react'
import { startOfWeek, addWeeks, subWeeks, addDays, format } from 'date-fns'
import { it } from 'date-fns/locale'

// ─── Constants ────────────────────────────────────────────────────────────────

const DAYS_SHORT = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
const MEAL_TYPES = [
  { key: 'colazione',          label: 'Colazione',      icon: '☀️' },
  { key: 'spuntino_mattina',   label: 'Spuntino mat.',  icon: '🍎' },
  { key: 'pranzo',             label: 'Pranzo',         icon: '🍽️' },
  { key: 'merenda',            label: 'Merenda',        icon: '🥤' },
  { key: 'cena',               label: 'Cena',           icon: '🌙' },
]

// Food categories for shopping list grouping
function categorizeFood(name) {
  const n = (name || '').toLowerCase()
  if (/pollo|manzo|pesce|tonno|salmone|carne|prosciutto|uov|tacchino|merluzzo|sgombro|gamberett|bresaola|salume|affettat/.test(n)) return 'Proteine'
  if (/latte|yogurt|mozzarella|formaggio|ricotta|parmigian|pecorino|grana|brie|feta/.test(n)) return 'Latticini'
  if (/spinac|insalat|lattug|broccol|carota|zucchina|peperon|pomodor|cetriolo|cipolla|aglio|cavolo|verza|sedano|finocc|melanzana|asparagi|fagiolini|piselli|funghi/.test(n)) return 'Verdure'
  if (/pane|pasta|riso|farro|avena|cereale|farro|orzo|polenta|cracker|grissino|mais|quinoa|couscous|bulgur|fette biscott/.test(n)) return 'Cereali'
  if (/mela|pera|banana|arancio|limone|fragola|uva|kiwi|ananas|mango|pesca|albicocca|cilieg|frutt/.test(n)) return 'Frutta'
  return 'Altro'
}

// ─── Week helpers ─────────────────────────────────────────────────────────────

function getWeekStart(date) {
  return startOfWeek(date, { weekStartsOn: 1 })
}

function formatWeekRange(weekStart) {
  const end = addDays(weekStart, 6)
  return `${format(weekStart, 'd MMM', { locale: it })} – ${format(end, 'd MMM yyyy', { locale: it })}`
}

// ─── Macro calculation ────────────────────────────────────────────────────────

function calcMacros(foodData, grams) {
  const ratio = (grams || 100) / 100
  return {
    kcal:    Math.round((foodData.kcal_100g    || 0) * ratio),
    proteins: Math.round((foodData.proteins_100g || 0) * ratio * 10) / 10,
    carbs:    Math.round((foodData.carbs_100g    || 0) * ratio * 10) / 10,
    fats:     Math.round((foodData.fats_100g     || 0) * ratio * 10) / 10,
  }
}

// ─── Cell item component ──────────────────────────────────────────────────────

function MealItem({ item, onRemove }) {
  const macros = calcMacros(item.food_data, item.grams)
  return (
    <div style={{
      background: 'var(--green-mist)',
      border: '1px solid var(--border-light)',
      borderRadius: 8,
      padding: '6px 8px',
      marginBottom: 4,
      position: 'relative',
    }}>
      <button
        onClick={() => onRemove(item.id)}
        style={{
          position: 'absolute', top: 4, right: 4,
          background: 'none', border: 'none', cursor: 'pointer',
          padding: 2, borderRadius: 4, color: 'var(--text-muted)',
          display: 'flex', alignItems: 'center',
        }}
        title="Rimuovi"
      >
        <X size={12} />
      </button>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', paddingRight: 16, lineHeight: 1.3 }}>
        {item.food_name}
      </div>
      <div style={{ fontSize: 11, color: 'var(--green-main)', marginTop: 2 }}>
        {macros.kcal} kcal · {item.grams}g
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>
        P:{macros.proteins}g C:{macros.carbs}g G:{macros.fats}g
      </div>
    </div>
  )
}

// ─── Add Food Modal ───────────────────────────────────────────────────────────

function AddFoodModal({ dayIndex, mealType, onClose, onAdd }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [grams, setGrams] = useState('100')
  const inputRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await searchFoods(query)
        setResults(res.slice(0, 20))
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 350)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  function handleSelect(food) {
    setSelected(food)
    setQuery(food.name)
    setResults([])
  }

  function handleAdd() {
    if (!selected) return
    const g = parseFloat(grams) || 100
    onAdd({ food: selected, grams: g })
    onClose()
  }

  const mealLabel = MEAL_TYPES.find(m => m.key === mealType)?.label || mealType
  const dayLabel = DAYS_SHORT[dayIndex]

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.18 }}
        style={{
          background: 'var(--surface)',
          borderRadius: 16,
          padding: 20,
          width: '100%',
          maxWidth: 420,
          boxShadow: 'var(--shadow-lg)',
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
              Aggiungi alimento
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {dayLabel} · {mealLabel}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setSelected(null) }}
          placeholder="Cerca alimento..."
          style={{
            width: '100%', padding: '10px 12px', borderRadius: 10,
            border: '1.5px solid var(--border)', background: 'var(--surface-2)',
            color: 'var(--text-primary)', fontSize: 14, outline: 'none',
            boxSizing: 'border-box',
          }}
        />

        {loading && (
          <div style={{ textAlign: 'center', padding: '12px 0', color: 'var(--text-muted)', fontSize: 13 }}>
            Ricerca in corso...
          </div>
        )}

        {results.length > 0 && (
          <div style={{
            border: '1px solid var(--border-light)', borderRadius: 10,
            marginTop: 8, maxHeight: 220, overflowY: 'auto',
            background: 'var(--surface)',
          }}>
            {results.map((food, i) => (
              <button
                key={i}
                onClick={() => handleSelect(food)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '9px 12px', background: 'none', border: 'none',
                  cursor: 'pointer', borderBottom: i < results.length - 1 ? '1px solid var(--border-light)' : 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{food.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {food.kcal_100g} kcal/100g · P:{food.proteins_100g}g C:{food.carbs_100g}g G:{food.fats_100g}g
                </div>
              </button>
            ))}
          </div>
        )}

        {selected && (
          <div style={{ marginTop: 14 }}>
            <div style={{
              background: 'var(--green-pale)', borderRadius: 10, padding: '10px 12px',
              border: '1px solid var(--border-light)', marginBottom: 12,
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                {selected.name}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {selected.kcal_100g} kcal / 100g
              </div>
            </div>

            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Grammi
            </label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="number"
                value={grams}
                onChange={e => setGrams(e.target.value)}
                min="1"
                style={{
                  width: 90, padding: '8px 10px', borderRadius: 8,
                  border: '1.5px solid var(--border)', background: 'var(--surface-2)',
                  color: 'var(--text-primary)', fontSize: 14, outline: 'none',
                }}
              />
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>g</span>
              {parseFloat(grams) > 0 && (
                <span style={{ fontSize: 12, color: 'var(--green-main)', marginLeft: 4 }}>
                  = {Math.round((selected.kcal_100g || 0) * parseFloat(grams) / 100)} kcal
                </span>
              )}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 10,
              border: '1.5px solid var(--border)', background: 'none',
              color: 'var(--text-secondary)', fontSize: 14, cursor: 'pointer',
            }}
          >
            Annulla
          </button>
          <button
            onClick={handleAdd}
            disabled={!selected}
            style={{
              flex: 2, padding: '10px 0', borderRadius: 10, border: 'none',
              background: selected ? 'var(--green-main)' : 'var(--surface-3)',
              color: selected ? '#fff' : 'var(--text-muted)',
              fontSize: 14, fontWeight: 600, cursor: selected ? 'pointer' : 'not-allowed',
              transition: 'background 0.2s',
            }}
          >
            Aggiungi
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Shopping List Tab ────────────────────────────────────────────────────────

function ShoppingListTab({ items, userId, weekStart }) {
  const storageKey = `shopping_list_checked_${userId}_${weekStart}`

  const [checked, setChecked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '{}')
    } catch { return {} }
  })

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(checked))
  }, [checked, storageKey])

  // Aggregate items by food name
  const aggregated = {}
  items.forEach(item => {
    const name = item.food_data?.name || item.food_name
    if (!aggregated[name]) {
      aggregated[name] = { name, grams: 0, category: categorizeFood(name) }
    }
    aggregated[name].grams += Number(item.grams || 100)
  })

  // Group by category
  const grouped = {}
  Object.values(aggregated).forEach(item => {
    if (!grouped[item.category]) grouped[item.category] = []
    grouped[item.category].push(item)
  })

  const categoryOrder = ['Proteine', 'Verdure', 'Frutta', 'Cereali', 'Latticini', 'Altro']

  const allChecked = Object.values(aggregated).filter(i => checked[i.name])
  const totalItems = Object.values(aggregated).length

  function toggleItem(name) {
    setChecked(prev => ({ ...prev, [name]: !prev[name] }))
  }

  function clearChecked() {
    setChecked({})
  }

  async function shareList() {
    const lines = ['Lista della Spesa', `Settimana del ${weekStart}`, '']
    categoryOrder.forEach(cat => {
      const catItems = grouped[cat]
      if (!catItems?.length) return
      lines.push(`--- ${cat} ---`)
      catItems.forEach(i => lines.push(`• ${i.name} — ${Math.round(i.grams)}g`))
      lines.push('')
    })
    const text = lines.join('\n')
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Lista della Spesa NutriPlan', text })
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(text)
      alert('Lista copiata negli appunti!')
    }
  }

  if (totalItems === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
        <ShoppingCart size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Lista vuota</div>
        <div style={{ fontSize: 14 }}>Aggiungi alimenti al piano per generare la lista della spesa</div>
      </div>
    )
  }

  return (
    <div>
      {/* Header actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          {allChecked.length}/{totalItems} acquistati
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={clearChecked}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 12px', borderRadius: 8,
              border: '1.5px solid var(--border)', background: 'none',
              color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer',
            }}
          >
            <Trash2 size={14} /> Pulisci acquistati
          </button>
          <button
            onClick={shareList}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 12px', borderRadius: 8, border: 'none',
              background: 'var(--green-main)', color: '#fff',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            <Share2 size={14} /> Condividi lista
          </button>
        </div>
      </div>

      {/* Grouped items */}
      {categoryOrder.map(cat => {
        const catItems = grouped[cat]
        if (!catItems?.length) return null
        return (
          <div key={cat} style={{ marginBottom: 20 }}>
            <div style={{
              fontSize: 12, fontWeight: 700, color: 'var(--green-main)',
              textTransform: 'uppercase', letterSpacing: '0.05em',
              marginBottom: 8, paddingBottom: 4,
              borderBottom: '1px solid var(--border-light)',
            }}>
              {cat}
            </div>
            {catItems.map(item => (
              <div
                key={item.name}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 0',
                  borderBottom: '1px solid var(--border-light)',
                  opacity: checked[item.name] ? 0.45 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                <button
                  onClick={() => toggleItem(item.name)}
                  style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    border: '2px solid var(--green-main)', background: checked[item.name] ? 'var(--green-main)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'background 0.15s',
                  }}
                >
                  {checked[item.name] && <Check size={13} color="#fff" strokeWidth={3} />}
                </button>
                <span style={{
                  fontSize: 14, color: 'var(--text-primary)', flex: 1,
                  textDecoration: checked[item.name] ? 'line-through' : 'none',
                }}>
                  {item.name}
                </span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', flexShrink: 0 }}>
                  {Math.round(item.grams)}g
                </span>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

// ─── Weekly Grid ──────────────────────────────────────────────────────────────

function DailyKcalBadge({ items, kcalGoal }) {
  const total = items.reduce((sum, item) => {
    const macros = calcMacros(item.food_data, item.grams)
    return sum + macros.kcal
  }, 0)

  if (total === 0) return null

  const isOver = kcalGoal && total > kcalGoal * 1.2
  const color = isOver ? 'var(--red)' : 'var(--green-main)'

  return (
    <div style={{
      marginTop: 6, paddingTop: 6,
      borderTop: '1px solid var(--border-light)',
      textAlign: 'center',
      fontSize: 12, fontWeight: 700, color,
    }}>
      {total} kcal
    </div>
  )
}

function GridCell({ dayIndex, mealType, items, onAdd, onRemove }) {
  const cellItems = items.filter(i => i.day_of_week === dayIndex && i.meal_type === mealType)

  return (
    <div style={{
      minHeight: 70,
      padding: 6,
      borderRight: '1px solid var(--border-light)',
      borderBottom: '1px solid var(--border-light)',
      verticalAlign: 'top',
    }}>
      {cellItems.map(item => (
        <MealItem key={item.id} item={item} onRemove={onRemove} />
      ))}
      <button
        onClick={() => onAdd(dayIndex, mealType)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '100%', padding: '4px 0', borderRadius: 6,
          border: '1px dashed var(--border)', background: 'none',
          color: 'var(--text-muted)', cursor: 'pointer',
          fontSize: 12, gap: 3,
          transition: 'border-color 0.15s, color 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green-main)'; e.currentTarget.style.color = 'var(--green-main)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
      >
        <Plus size={12} /> Aggiungi
      </button>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MealPlannerPage() {
  const { user } = useAuth()
  const [weekOffset, setWeekOffset] = useState(0)
  const [activeTab, setActiveTab] = useState('piano')
  const [items, setItems] = useState([])
  const [planId, setPlanId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [modal, setModal] = useState(null) // { dayIndex, mealType }

  const weekStart = getWeekStart(addWeeks(new Date(), weekOffset))
  const weekStartStr = format(weekStart, 'yyyy-MM-dd')

  // ── Load plan ──────────────────────────────────────────────────────────────
  const loadPlan = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      // Find or create plan for this week
      const { data: plan, error: planErr } = await supabase
        .from('meal_plans')
        .select('id')
        .eq('user_id', user.id)
        .eq('week_start_date', weekStartStr)
        .maybeSingle()

      if (planErr) throw planErr

      if (!plan) {
        setItems([])
        setPlanId(null)
        setLoading(false)
        return
      }

      setPlanId(plan.id)

      const { data: planItems, error: itemsErr } = await supabase
        .from('meal_plan_items')
        .select('*')
        .eq('plan_id', plan.id)
        .order('created_at', { ascending: true })

      if (itemsErr) throw itemsErr
      setItems(planItems || [])
    } catch (err) {
      console.error('Errore caricamento piano:', err)
    } finally {
      setLoading(false)
    }
  }, [user, weekStartStr])

  useEffect(() => {
    loadPlan()
  }, [loadPlan])

  // ── Ensure plan exists in DB, return planId ────────────────────────────────
  async function ensurePlan() {
    if (planId) return planId
    const { data, error } = await supabase
      .from('meal_plans')
      .upsert({ user_id: user.id, week_start_date: weekStartStr }, { onConflict: 'user_id,week_start_date' })
      .select('id')
      .single()
    if (error) throw error
    setPlanId(data.id)
    return data.id
  }

  // ── Add food item ──────────────────────────────────────────────────────────
  async function handleAddFood({ food, grams }) {
    if (!user || !modal) return
    try {
      const pid = await ensurePlan()
      const newItem = {
        plan_id: pid,
        day_of_week: modal.dayIndex,
        meal_type: modal.mealType,
        food_name: food.name,
        food_data: {
          name: food.name,
          kcal_100g: food.kcal_100g || 0,
          proteins_100g: food.proteins_100g || 0,
          carbs_100g: food.carbs_100g || 0,
          fats_100g: food.fats_100g || 0,
        },
        grams,
      }
      const { data, error } = await supabase
        .from('meal_plan_items')
        .insert(newItem)
        .select()
        .single()
      if (error) throw error
      setItems(prev => [...prev, data])
    } catch (err) {
      console.error('Errore aggiunta alimento:', err)
    }
  }

  // ── Remove food item ───────────────────────────────────────────────────────
  async function handleRemoveItem(itemId) {
    try {
      const { error } = await supabase.from('meal_plan_items').delete().eq('id', itemId)
      if (error) throw error
      setItems(prev => prev.filter(i => i.id !== itemId))
    } catch (err) {
      console.error('Errore rimozione alimento:', err)
    }
  }

  // ── Save plan (bulk upsert) ────────────────────────────────────────────────
  async function handleSavePlan() {
    if (!user) return
    setSaving(true)
    try {
      await ensurePlan()
      setSaveMsg('Piano salvato!')
      setTimeout(() => setSaveMsg(''), 2500)
    } catch (err) {
      console.error('Errore salvataggio piano:', err)
      setSaveMsg('Errore nel salvataggio')
      setTimeout(() => setSaveMsg(''), 2500)
    } finally {
      setSaving(false)
    }
  }

  function openModal(dayIndex, mealType) {
    setModal({ dayIndex, mealType })
  }

  function closeModal() {
    setModal(null)
  }

  return (
    <div className="page" style={{ padding: '16px 0 100px', minHeight: '100vh', background: 'var(--surface-2)' }}>
      {/* ── Header ── */}
      <div style={{ padding: '0 16px 16px', background: 'var(--surface)', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Pianificatore Settimanale
          </h1>
          <Calendar size={22} color="var(--green-main)" />
        </div>

        {/* Week navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <button
            onClick={() => setWeekOffset(w => w - 1)}
            style={{
              background: 'var(--surface-2)', border: '1.5px solid var(--border)',
              borderRadius: 8, width: 34, height: 34, display: 'flex',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <ChevronLeft size={18} color="var(--text-secondary)" />
          </button>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', minWidth: 160, textAlign: 'center' }}>
            {formatWeekRange(weekStart)}
          </span>
          <button
            onClick={() => setWeekOffset(w => w + 1)}
            style={{
              background: 'var(--surface-2)', border: '1.5px solid var(--border)',
              borderRadius: 8, width: 34, height: 34, display: 'flex',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <ChevronRight size={18} color="var(--text-secondary)" />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginTop: 14, background: 'var(--surface-3)', borderRadius: 10, padding: 4 }}>
          {[
            { key: 'piano', label: 'Piano' },
            { key: 'spesa', label: 'Lista Spesa' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1, padding: '8px 0', borderRadius: 7, border: 'none',
                background: activeTab === tab.key ? 'var(--surface)' : 'none',
                color: activeTab === tab.key ? 'var(--green-main)' : 'var(--text-muted)',
                fontSize: 14, fontWeight: activeTab === tab.key ? 700 : 500,
                cursor: 'pointer',
                boxShadow: activeTab === tab.key ? 'var(--shadow-xs)' : 'none',
                transition: 'background 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: '16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontSize: 14 }}>
            Caricamento piano...
          </div>
        ) : activeTab === 'piano' ? (
          <>
            {/* Desktop/Tablet grid */}
            <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--border-light)', background: 'var(--surface)' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '80px repeat(7, minmax(120px, 1fr))',
                minWidth: 900,
              }}>
                {/* Header row */}
                <div style={{
                  background: 'var(--surface-3)',
                  borderRight: '1px solid var(--border-light)',
                  borderBottom: '1px solid var(--border-light)',
                  padding: '10px 8px',
                }} />
                {DAYS_SHORT.map((day, di) => {
                  const date = addDays(weekStart, di)
                  const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                  return (
                    <div
                      key={day}
                      style={{
                        background: isToday ? 'var(--green-pale)' : 'var(--surface-3)',
                        borderRight: di < 6 ? '1px solid var(--border-light)' : 'none',
                        borderBottom: '1px solid var(--border-light)',
                        padding: '10px 8px',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 700, color: isToday ? 'var(--green-main)' : 'var(--text-secondary)' }}>
                        {day}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {format(date, 'd MMM', { locale: it })}
                      </div>
                    </div>
                  )
                })}

                {/* Meal rows */}
                {MEAL_TYPES.map(meal => (
                  <>
                    {/* Meal label */}
                    <div
                      key={`label-${meal.key}`}
                      style={{
                        background: 'var(--surface-2)',
                        borderRight: '1px solid var(--border-light)',
                        borderBottom: '1px solid var(--border-light)',
                        padding: '10px 6px',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'flex-start',
                        gap: 3,
                      }}
                    >
                      <span style={{ fontSize: 16 }}>{meal.icon}</span>
                      <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.2 }}>
                        {meal.label}
                      </span>
                    </div>

                    {/* Day cells */}
                    {DAYS_SHORT.map((_, di) => (
                      <GridCell
                        key={`${meal.key}-${di}`}
                        dayIndex={di}
                        mealType={meal.key}
                        items={items}
                        onAdd={openModal}
                        onRemove={handleRemoveItem}
                      />
                    ))}
                  </>
                ))}

                {/* Totals row */}
                <div style={{
                  background: 'var(--surface-2)',
                  borderRight: '1px solid var(--border-light)',
                  padding: '8px 6px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center' }}>
                    TOTALE
                  </span>
                </div>
                {DAYS_SHORT.map((_, di) => {
                  const dayItems = items.filter(i => i.day_of_week === di)
                  const total = dayItems.reduce((sum, item) => sum + calcMacros(item.food_data, item.grams).kcal, 0)
                  return (
                    <div
                      key={`total-${di}`}
                      style={{
                        padding: '8px 6px', textAlign: 'center',
                        borderRight: di < 6 ? '1px solid var(--border-light)' : 'none',
                        background: 'var(--surface-2)',
                      }}
                    >
                      {total > 0 && (
                        <span style={{
                          fontSize: 12, fontWeight: 700,
                          color: 'var(--green-main)',
                        }}>
                          {total} kcal
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        ) : (
          <ShoppingListTab items={items} userId={user?.id} weekStart={weekStartStr} />
        )}
      </div>

      {/* ── Sticky Save Button ── */}
      {activeTab === 'piano' && (
        <div style={{
          position: 'fixed', bottom: 72, left: 0, right: 0,
          padding: '12px 16px', background: 'var(--surface)',
          borderTop: '1px solid var(--border-light)',
          display: 'flex', alignItems: 'center', gap: 12,
          zIndex: 100,
        }}>
          {saveMsg && (
            <span style={{
              fontSize: 13, color: saveMsg.includes('Errore') ? 'var(--red)' : 'var(--green-main)',
              fontWeight: 600, flex: 1,
            }}>
              {saveMsg}
            </span>
          )}
          <button
            onClick={handleSavePlan}
            disabled={saving}
            style={{
              flex: 1, maxWidth: 300, margin: '0 auto',
              padding: '12px 0', borderRadius: 12, border: 'none',
              background: saving ? 'var(--surface-3)' : 'var(--green-main)',
              color: saving ? 'var(--text-muted)' : '#fff',
              fontSize: 15, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              display: 'block',
            }}
          >
            {saving ? 'Salvataggio...' : 'Salva piano'}
          </button>
        </div>
      )}

      {/* ── Add Food Modal ── */}
      <AnimatePresence>
        {modal && (
          <AddFoodModal
            key="add-modal"
            dayIndex={modal.dayIndex}
            mealType={modal.mealType}
            onClose={closeModal}
            onAdd={handleAddFood}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
