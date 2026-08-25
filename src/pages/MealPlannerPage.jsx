import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { searchFoodsLocal, supplementWithOpenFoodFacts } from '../lib/foodSearch'
import { ChevronLeft, ChevronRight, Plus, X, ShoppingCart, Calendar, Share2, Trash2, Check } from 'lucide-react'
import { startOfWeek, addWeeks, subWeeks, addDays, format } from 'date-fns'
import { it } from 'date-fns/locale'
import { useIsDesktop } from '../hooks/useIsDesktop'
import { useT } from '../i18n'
import { matchesAnyKeyword } from '../lib/keywordMatch'

// ─── Constants ────────────────────────────────────────────────────────────────

const DAYS_SHORT = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
// Translation key + Italian fallback for each short day label (used at render time via t())
const DAY_LABEL_KEYS = {
  Lun: { key: 'mealplan.giorno_lun', fallback: 'Lun' },
  Mar: { key: 'mealplan.giorno_mar', fallback: 'Mar' },
  Mer: { key: 'mealplan.giorno_mer', fallback: 'Mer' },
  Gio: { key: 'mealplan.giorno_gio', fallback: 'Gio' },
  Ven: { key: 'mealplan.giorno_ven', fallback: 'Ven' },
  Sab: { key: 'mealplan.giorno_sab', fallback: 'Sab' },
  Dom: { key: 'mealplan.giorno_dom', fallback: 'Dom' },
}
const MEAL_TYPES = [
  { key: 'colazione',          i18nKey: 'mealplan.pasto_colazione',    fallback: 'Colazione',      icon: '☀️' },
  { key: 'spuntino_mattina',   i18nKey: 'mealplan.pasto_spuntino_mat', fallback: 'Spuntino mat.',  icon: '🍎' },
  { key: 'pranzo',             i18nKey: 'mealplan.pasto_pranzo',       fallback: 'Pranzo',         icon: '🍽️' },
  { key: 'merenda',            i18nKey: 'mealplan.pasto_merenda',      fallback: 'Merenda',        icon: '🥤' },
  { key: 'cena',               i18nKey: 'mealplan.pasto_cena',         fallback: 'Cena',           icon: '🌙' },
]

// Food categories for shopping list grouping
// Collisioni per sottostringa note (una parola-chiave compare per caso dentro il nome di un
// alimento non correlato, es. "pesca" dentro "pescatrice", "orzo" dentro "scorzonera", "aglio"
// dentro "taglio") - stessa scoperta/metodologia di detectAllergens() in questo file. Non
// irrigidito con un confine di parola generale perche' romperebbe corrispondenze intenzionali
// su parole composte (es. "riso" deve continuare a far scattare "Risotto").
const CATEGORIZE_KEYWORD_EXCLUSIONS = {
  pollo: /cipoll/i,
  grana: /melagrana|melograno|sgranat/i,
  aglio: /taglio/i,
  pane: /rapanello|daikon/i,
  orzo: /scorzonera/i,
  mela: /melanzana|melagrana|melograno|melanosporum/i,
  pesca: /pescatrice/i,
}

function matchesCategory(n, words) {
  return matchesAnyKeyword(n, words, CATEGORIZE_KEYWORD_EXCLUSIONS)
}

function categorizeFood(name) {
  const n = (name || '').toLowerCase()
  if (matchesCategory(n, ['pollo', 'manzo', 'pesce', 'tonno', 'salmone', 'carne', 'prosciutto', 'uov', 'tacchino', 'merluzzo', 'sgombro', 'gamberett', 'bresaola', 'salume', 'affettat'])) return 'Proteine'
  if (matchesCategory(n, ['latte', 'yogurt', 'mozzarella', 'formaggio', 'ricotta', 'parmigian', 'pecorino', 'grana', 'brie', 'feta'])) return 'Latticini'
  if (matchesCategory(n, ['spinac', 'insalat', 'lattug', 'broccol', 'carota', 'zucchina', 'peperon', 'pomodor', 'cetriolo', 'cipolla', 'aglio', 'cavolo', 'verza', 'sedano', 'finocc', 'melanzana', 'asparagi', 'fagiolini', 'piselli', 'funghi'])) return 'Verdure'
  if (matchesCategory(n, ['pane', 'pasta', 'riso', 'farro', 'avena', 'cereale', 'orzo', 'polenta', 'cracker', 'grissino', 'mais', 'quinoa', 'couscous', 'bulgur', 'fette biscott'])) return 'Cereali'
  if (matchesCategory(n, ['mela', 'pera', 'banana', 'arancio', 'limone', 'fragola', 'uva', 'kiwi', 'ananas', 'mango', 'pesca', 'albicocca', 'cilieg', 'frutt'])) return 'Frutta'
  return 'Altro'
}

// Translation key + Italian fallback for each internal category identifier (display only)
const CATEGORY_LABEL_KEYS = {
  Proteine: { key: 'mealplan.categoria_proteine', fallback: 'Proteine' },
  Latticini: { key: 'mealplan.categoria_latticini', fallback: 'Latticini' },
  Verdure: { key: 'mealplan.categoria_verdure', fallback: 'Verdure' },
  Cereali: { key: 'mealplan.categoria_cereali', fallback: 'Cereali' },
  Frutta: { key: 'mealplan.categoria_frutta', fallback: 'Frutta' },
  Altro: { key: 'mealplan.categoria_altro', fallback: 'Altro' },
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
  const t = useT()
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
        title={t('mealplan.rimuovi', 'Rimuovi')}
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
        {t('mealplan.abbr_proteine', 'P')}:{macros.proteins}g {t('mealplan.abbr_carboidrati', 'C')}:{macros.carbs}g {t('mealplan.abbr_grassi', 'G')}:{macros.fats}g
      </div>
    </div>
  )
}

// ─── Add Food Modal ───────────────────────────────────────────────────────────

function AddFoodModal({ dayIndex, mealType, onClose, onAdd, userId }) {
  const t = useT()
  const [tab, setTab] = useState('alimento') // 'alimento' | 'ricetta'
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [grams, setGrams] = useState('100')
  const [portions, setPortions] = useState('1')
  const inputRef = useRef(null)
  const debounceRef = useRef(null)
  const searchIdRef = useRef(0)

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [])

  // Search foods or recipes depending on tab
  useEffect(() => {
    setSelected(null)
    setResults([])
    if (!query.trim()) return
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      const searchId = ++searchIdRef.current
      setLoading(true)
      try {
        if (tab === 'alimento') {
          // Two-phase search (same pattern as MacroTrackerPage/RecipesPage):
          // local sources answer immediately instead of blocking every
          // keystroke on the Open Food Facts network round trip. searchId
          // guards against a slower, older search overwriting a newer one.
          const trimmed = query.trim()
          const local = await searchFoodsLocal(trimmed)
          if (searchId !== searchIdRef.current) return
          setResults(local.slice(0, 20))
          setLoading(false)
          if (trimmed.length >= 3) {
            const supplemented = await supplementWithOpenFoodFacts(trimmed, local)
            if (searchId !== searchIdRef.current) return
            setResults(supplemented.slice(0, 20))
          }
          return
        } else {
          const { supabase: sb } = await import('../lib/supabase')
          const q = query.toLowerCase()
          const { data } = await sb.from('ricette').select('id,nome,porzioni,peso_totale_g,calorie_porzione,ingredienti').or(`user_id.eq.${userId},is_public.eq.true`).ilike('nome', `%${query}%`).limit(20)
          setResults((data || []).map(r => ({
            _isRecipe: true, id: r.id, name: r.nome,
            porzioni: r.porzioni || 1,
            pesoTotale: r.peso_totale_g || 0,
            caloriePorzione: r.calorie_porzione || 0,
            ingredienti: r.ingredienti || [],
          })))
        }
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 350)
    return () => clearTimeout(debounceRef.current)
  }, [query, tab, userId])

  function handleSelect(item) {
    setSelected(item)
    setQuery(item.name)
    setResults([])
    if (item._isRecipe) {
      const portionG = item.pesoTotale > 0 ? Math.round(item.pesoTotale / item.porzioni) : 100
      setPortions('1')
      setGrams(String(portionG))
    } else {
      setGrams('100')
    }
  }

  function handleAdd() {
    if (!selected) return
    if (selected._isRecipe) {
      const nPortions = parseFloat(portions) || 1
      const portionG = selected.pesoTotale > 0 ? selected.pesoTotale / selected.porzioni : 100
      const totalG = Math.round(portionG * nPortions)
      // Sum macros from ingredients per 100g of total recipe
      const ingSum = (selected.ingredienti || []).reduce((acc, i) => ({
        kcal: acc.kcal + (i.kcal || 0), proteins: acc.proteins + (i.proteins || 0),
        carbs: acc.carbs + (i.carbs || 0), fats: acc.fats + (i.fats || 0),
      }), { kcal: 0, proteins: 0, carbs: 0, fats: 0 })
      const totalW = selected.pesoTotale || 100
      const food = {
        name: selected.name,
        kcal_100g: Math.round(ingSum.kcal / totalW * 100),
        proteins_100g: Math.round(ingSum.proteins / totalW * 100 * 10) / 10,
        carbs_100g: Math.round(ingSum.carbs / totalW * 100 * 10) / 10,
        fats_100g: Math.round(ingSum.fats / totalW * 100 * 10) / 10,
        _recipe_id: selected.id,
      }
      // Fallback: use caloriePorzione if ingredients macros not available
      if (!food.kcal_100g && selected.caloriePorzione) {
        food.kcal_100g = Math.round(selected.caloriePorzione / portionG * 100)
      }
      onAdd({ food, grams: totalG })
    } else {
      onAdd({ food: selected, grams: parseFloat(grams) || 100 })
    }
    onClose()
  }

  const mealDef = MEAL_TYPES.find(m => m.key === mealType)
  const mealLabel = mealDef ? t(mealDef.i18nKey, mealDef.fallback) : mealType
  const dayShort = DAYS_SHORT[dayIndex]
  const dayLabel = t(DAY_LABEL_KEYS[dayShort].key, DAY_LABEL_KEYS[dayShort].fallback)

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
          maxHeight: '85dvh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
              {t('mealplan.aggiungi_al_piano', 'Aggiungi al piano')}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {dayLabel} · {mealLabel}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t('mealplan.chiudi', 'Chiudi')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          {[
            { key: 'alimento', i18nKey: 'mealplan.tab_alimento', fallback: '🍎 Alimento' },
            { key: 'ricetta', i18nKey: 'mealplan.tab_ricetta', fallback: '👨‍🍳 Ricetta' },
          ].map(tabDef => (
            <button key={tabDef.key} onClick={() => { setTab(tabDef.key); setQuery(''); setSelected(null) }}
              style={{ flex: 1, padding: '8px', borderRadius: 10, border: 'none', font: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer', background: tab === tabDef.key ? 'var(--green-main)' : 'var(--surface-2)', color: tab === tabDef.key ? 'white' : 'var(--text-secondary)' }}>
              {t(tabDef.i18nKey, tabDef.fallback)}
            </button>
          ))}
        </div>

        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setSelected(null) }}
          placeholder={tab === 'alimento' ? t('mealplan.cerca_alimento_placeholder', 'Cerca alimento...') : t('mealplan.cerca_ricetta_placeholder', 'Cerca ricetta...')}
          style={{
            width: '100%', padding: '10px 12px', borderRadius: 10,
            border: '1.5px solid var(--border)', background: 'var(--surface-2)',
            color: 'var(--text-primary)', fontSize: 14, outline: 'none',
            boxSizing: 'border-box',
          }}
        />

        {loading && (
          <div style={{ textAlign: 'center', padding: '12px 0', color: 'var(--text-muted)', fontSize: 13 }}>
            {t('mealplan.ricerca_in_corso', 'Ricerca in corso...')}
          </div>
        )}

        {results.length > 0 && (
          <div style={{
            border: '1px solid var(--border-light)', borderRadius: 10,
            marginTop: 8, maxHeight: 220, overflowY: 'auto',
            background: 'var(--surface)',
          }}>
            {results.map((item, i) => (
              <button
                key={i}
                onClick={() => handleSelect(item)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '9px 12px', background: 'none', border: 'none',
                  cursor: 'pointer', borderBottom: i < results.length - 1 ? '1px solid var(--border-light)' : 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {item._isRecipe
                    ? t('mealplan.risultato_ricetta_info', { porzioni: item.porzioni, kcal: item.caloriePorzione }, '🍽️ {{porzioni}} porz. · {{kcal}} kcal/porz.')
                    : t('mealplan.risultato_alimento_info', { kcal: item.kcal_100g, proteins: item.proteins_100g, carbs: item.carbs_100g, fats: item.fats_100g }, '{{kcal}} kcal/100g · P:{{proteins}}g C:{{carbs}}g G:{{fats}}g')}
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
                {selected._isRecipe
                  ? (selected.porzioni !== 1
                      ? t('mealplan.info_ricetta_porzioni_plurale', { porzioni: selected.porzioni, kcal: selected.caloriePorzione }, '👨‍🍳 {{porzioni}} porzioni · {{kcal}} kcal/porz.')
                      : t('mealplan.info_ricetta_porzioni_singolare', { porzioni: selected.porzioni, kcal: selected.caloriePorzione }, '👨‍🍳 {{porzioni}} porzione · {{kcal}} kcal/porz.'))
                  : t('mealplan.info_alimento_kcal', { kcal: selected.kcal_100g }, '{{kcal}} kcal / 100g')}
              </div>
            </div>

            {selected._isRecipe ? (
              <>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                  {t('mealplan.numero_porzioni', 'Numero di porzioni')}
                </label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="number"
                    value={portions}
                    onChange={e => setPortions(e.target.value)}
                    min="0.5"
                    step="0.5"
                    style={{ width: 90, padding: '8px 10px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
                  />
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t('mealplan.unita_porzioni', 'porz.')}</span>
                  {parseFloat(portions) > 0 && selected.caloriePorzione > 0 && (
                    <span style={{ fontSize: 12, color: 'var(--green-main)', marginLeft: 4 }}>
                      {t('mealplan.uguale_kcal', { kcal: Math.round(selected.caloriePorzione * parseFloat(portions)) }, '= {{kcal}} kcal')}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                  {t('mealplan.grammi_label', 'Grammi')}
                </label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="number"
                    value={grams}
                    onChange={e => setGrams(e.target.value)}
                    min="1"
                    style={{ width: 90, padding: '8px 10px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
                  />
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>g</span>
                  {parseFloat(grams) > 0 && (
                    <span style={{ fontSize: 12, color: 'var(--green-main)', marginLeft: 4 }}>
                      {t('mealplan.uguale_kcal', { kcal: Math.round((selected.kcal_100g || 0) * parseFloat(grams) / 100) }, '= {{kcal}} kcal')}
                    </span>
                  )}
                </div>
              </>
            )}
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
            {t('mealplan.annulla', 'Annulla')}
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
            {t('mealplan.aggiungi', 'Aggiungi')}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Shopping List Tab ────────────────────────────────────────────────────────

function ShoppingListTab({ items, userId, weekStart }) {
  const t = useT()
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
    const lines = [t('mealplan.lista_spesa_titolo', 'Lista della Spesa'), t('mealplan.settimana_del', { data: weekStart }, 'Settimana del {{data}}'), '']
    categoryOrder.forEach(cat => {
      const catItems = grouped[cat]
      if (!catItems?.length) return
      const catLabel = t(CATEGORY_LABEL_KEYS[cat].key, CATEGORY_LABEL_KEYS[cat].fallback)
      lines.push(`--- ${catLabel} ---`)
      catItems.forEach(i => lines.push(`• ${i.name} — ${Math.round(i.grams)}g`))
      lines.push('')
    })
    const text = lines.join('\n')
    if (navigator.share) {
      try {
        await navigator.share({ title: t('mealplan.condividi_titolo', 'Lista della Spesa NutriPlan'), text })
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(text)
      alert(t('mealplan.lista_copiata', 'Lista copiata negli appunti!'))
    }
  }

  if (totalItems === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
        <ShoppingCart size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{t('mealplan.lista_vuota_titolo', 'Lista vuota')}</div>
        <div style={{ fontSize: 14 }}>{t('mealplan.lista_vuota_testo', 'Aggiungi alimenti al piano per generare la lista della spesa')}</div>
      </div>
    )
  }

  return (
    <div>
      {/* Header actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          {t('mealplan.acquistati_contatore', { checked: allChecked.length, total: totalItems }, '{{checked}}/{{total}} acquistati')}
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
            <Trash2 size={14} /> {t('mealplan.pulisci_acquistati', 'Pulisci acquistati')}
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
            <Share2 size={14} /> {t('mealplan.condividi_lista', 'Condividi lista')}
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
              {t(CATEGORY_LABEL_KEYS[cat].key, CATEGORY_LABEL_KEYS[cat].fallback)}
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
  const t = useT()
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
        <Plus size={12} /> {t('mealplan.aggiungi', 'Aggiungi')}
      </button>
    </div>
  )
}

// ─── Mobile: day strip + single-day plan ───────────────────────────────────────
// La griglia 7 giorni × 5 pasti sotto ha senso solo da tablet in su: su
// telefono era comunque presente ma solo come tabella di 900px scorrevole
// orizzontalmente, non un vero layout mobile-first. Qui si sceglie un giorno
// dalla striscia e si vedono solo i suoi pasti, impilati verticalmente.

function DayStrip({ weekStart, selectedDay, onSelect, items }) {
  const t = useT()
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  return (
    <div style={{ display: 'flex', gap: 6, overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 2 }}>
      {DAYS_SHORT.map((day, di) => {
        const date = addDays(weekStart, di)
        const isToday = format(date, 'yyyy-MM-dd') === todayStr
        const active = di === selectedDay
        const dayTotal = items
          .filter(i => i.day_of_week === di)
          .reduce((sum, i) => sum + calcMacros(i.food_data, i.grams).kcal, 0)
        return (
          <button
            key={day}
            onClick={() => onSelect(di)}
            style={{
              flex: '0 0 auto', minWidth: 50, padding: '8px 4px 7px', borderRadius: 12,
              border: active ? '2px solid var(--green-main)' : '1.5px solid var(--border-light)',
              background: active ? 'var(--green-pale)' : 'var(--surface)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: active || isToday ? 'var(--green-main)' : 'var(--text-secondary)' }}>
              {t(DAY_LABEL_KEYS[day].key, DAY_LABEL_KEYS[day].fallback)}
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{format(date, 'd')}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--green-main)', minHeight: 11 }}>
              {dayTotal > 0 ? `${dayTotal}` : ''}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function MobileDayPlan({ dayIndex, items, onAdd, onRemove }) {
  const t = useT()
  const dayItems = items.filter(i => i.day_of_week === dayIndex)
  const dayTotal = dayItems.reduce((sum, i) => sum + calcMacros(i.food_data, i.grams).kcal, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
      {dayTotal > 0 && (
        <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, color: 'var(--green-main)' }}>
          {t('mealplan.kcal_totali_giornata', { kcal: dayTotal }, '{{kcal}} kcal totali in giornata')}
        </div>
      )}
      {MEAL_TYPES.map(meal => {
        const mealItems = dayItems.filter(i => i.meal_type === meal.key)
        return (
          <div key={meal.key} className="card" style={{ padding: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 17 }}>{meal.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{t(meal.i18nKey, meal.fallback)}</span>
            </div>
            {mealItems.map(item => (
              <MealItem key={item.id} item={item} onRemove={onRemove} />
            ))}
            <button
              onClick={() => onAdd(dayIndex, meal.key)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '100%', padding: '9px 0', borderRadius: 8,
                border: '1px dashed var(--border)', background: 'none',
                color: 'var(--text-muted)', cursor: 'pointer',
                fontSize: 13, gap: 5, marginTop: mealItems.length ? 4 : 0,
              }}
            >
              <Plus size={13} /> {t('mealplan.aggiungi', 'Aggiungi')}
            </button>
          </div>
        )
      })}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MealPlannerPage() {
  const t = useT()
  const { user } = useAuth()
  const isDesktop = useIsDesktop()
  const [weekOffset, setWeekOffset] = useState(0)
  const [activeTab, setActiveTab] = useState('piano')
  // Giorno selezionato nella vista mobile — di default il giorno della
  // settimana corrente (Lun=0..Dom=6), qualunque settimana si stia sfogliando.
  const [selectedDay, setSelectedDay] = useState(() => {
    const jsDay = new Date().getDay() // 0=Dom..6=Sab
    return jsDay === 0 ? 6 : jsDay - 1
  })
  const [items, setItems] = useState([])
  const [planId, setPlanId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [saveMsgIsError, setSaveMsgIsError] = useState(false)
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
      setSaveMsgIsError(true)
      setSaveMsg(t('mealplan.errore_aggiunta', 'Errore nell\'aggiunta. Riprova.'))
      setTimeout(() => setSaveMsg(''), 2500)
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
      setSaveMsgIsError(true)
      setSaveMsg(t('mealplan.errore_rimozione', 'Errore nella rimozione. Riprova.'))
      setTimeout(() => setSaveMsg(''), 2500)
    }
  }

  // ── Save plan (bulk upsert) ────────────────────────────────────────────────
  async function handleSavePlan() {
    if (!user) return
    setSaving(true)
    try {
      await ensurePlan()
      setSaveMsgIsError(false)
      setSaveMsg(t('mealplan.piano_salvato', 'Piano salvato!'))
      setTimeout(() => setSaveMsg(''), 2500)
    } catch (err) {
      console.error('Errore salvataggio piano:', err)
      setSaveMsgIsError(true)
      setSaveMsg(t('mealplan.errore_salvataggio', 'Errore nel salvataggio'))
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
            {t('mealplan.titolo', 'Pianificatore Settimanale')}
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
            { key: 'piano', i18nKey: 'mealplan.tab_piano', fallback: 'Piano' },
            { key: 'spesa', i18nKey: 'mealplan.tab_lista_spesa', fallback: 'Lista Spesa' },
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
              {t(tab.i18nKey, tab.fallback)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: '16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontSize: 14 }}>
            {t('mealplan.caricamento_piano', 'Caricamento piano...')}
          </div>
        ) : activeTab === 'piano' ? (
          !isDesktop ? (
            <>
              {/* Mobile: striscia giorni + pasti del giorno selezionato, impilati */}
              <DayStrip weekStart={weekStart} selectedDay={selectedDay} onSelect={setSelectedDay} items={items} />
              <MobileDayPlan dayIndex={selectedDay} items={items} onAdd={openModal} onRemove={handleRemoveItem} />
            </>
          ) : (
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
                        {t(DAY_LABEL_KEYS[day].key, DAY_LABEL_KEYS[day].fallback)}
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
                        {t(meal.i18nKey, meal.fallback)}
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
                    {t('mealplan.totale', 'TOTALE')}
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
          )
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
              fontSize: 13, color: saveMsgIsError ? 'var(--red)' : 'var(--green-main)',
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
            {saving ? t('mealplan.salvataggio_in_corso', 'Salvataggio...') : t('mealplan.salva_piano', 'Salva piano')}
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
            userId={user?.id}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
