import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { ShoppingCart, Plus, Trash2, Check, ChevronDown, ChevronUp, Leaf, X, Save, Edit2, ListChecks, BookOpen } from 'lucide-react'
import { subDays, format } from 'date-fns'
import { it } from 'date-fns/locale'

// ── Food categorization ──────────────────────────────────────────────────────
const CATEGORIES = [
  'Frutta e verdura',
  'Carne e pesce',
  'Latticini e uova',
  'Cereali e pasta',
  'Legumi',
  'Condimenti e grassi',
  'Bevande',
  'Altro',
]

const CATEGORY_ICONS = {
  'Frutta e verdura': '🥦',
  'Carne e pesce': '🥩',
  'Latticini e uova': '🥛',
  'Cereali e pasta': '🍞',
  'Legumi': '🫘',
  'Condimenti e grassi': '🫒',
  'Bevande': '💧',
  'Altro': '🛒',
}

function categorizeFood(name) {
  const n = (name || '').toLowerCase()
  if (/pollo|tacchino|manzo|maiale|agnello|coniglio|salmone|tonno|merluzzo|branzino|orata|gamberi|carne|pesce|bresaola|prosciutto|salame|vitello|fesa|petto|filetto|sgombro|acciughe|vongole|cozze/.test(n)) return 'Carne e pesce'
  if (/latte|yogurt|formaggio|ricotta|parmigiano|mozzarella|grana|pecorino|scamorza|stracchino|burro|uov[ao]|kefir/.test(n)) return 'Latticini e uova'
  if (/pasta|riso|pane|farro|orzo|quinoa|avena|cereali|fette biscottate|biscotti|crackers|farina|polenta|cous cous|bulgur|grissini/.test(n)) return 'Cereali e pasta'
  if (/ceci|lenticchie|fagioli|piselli|soia|lupini|azuki|legumi/.test(n)) return 'Legumi'
  if (/olio|aceto|sale\b|pepe\b|spezie|erbe aromatiche|curcuma|origano|basilico|prezzemolo|aglio|cipolla|limone|maionese|senape|ketchup|tahini|miele|zucchero|stevia|soia sauce/.test(n)) return 'Condimenti e grassi'
  if (/acqua|succo|tè|the\b|caffè|bevanda|latte vegetale|avena drink|riso drink|kombucha|centrifugato/.test(n)) return 'Bevande'
  if (/mel[ae]|pera|banana|arancia|fragol|uva|kiwi|pesch|anguria|melone|pomodor|insalata|spinaci|zucchine|carote|broccoli|cavolfiore|peperone|melanzane|patatein|patate|funghi|frutta|verdura|lattuga|cetriolo|finocchio|asparagi|carciofi|rucola|valeriana|cavolo|cavol|sedano|radicchio|bietola|mais|avocado|mango|ananas|papaya|melograno|lamponi|more|mirtilli|ribes|rabarbaro|porro|scalogno/.test(n)) return 'Frutta e verdura'
  if (/acqua|succo|tè|caffè/.test(n)) return 'Bevande'
  return 'Altro'
}

// ── Extract foods from clinical piano (piani table) ──────────────────────────
function extractFoodsFromPiano(piano) {
  const foods = []
  let days = []
  try {
    const raw = typeof piano.meals === 'string' ? JSON.parse(piano.meals) : piano.meals
    days = Array.isArray(raw) ? raw : []
  } catch { return foods }

  for (const day of days) {
    for (const meal of day.meals || []) {
      const items = meal.items || meal.foods || meal.alimenti || []
      for (const food of items) {
        const name = food.nome || food.name || food.alimento || ''
        if (!name) continue
        foods.push({
          name,
          quantity: `${food.qt || food.quantita || food.quantity || food.grammi || food.grams || ''}${food.misura || food.unita || food.unit || 'g'}`,
          category: categorizeFood(name),
        })
      }
    }
  }
  return foods
}

// ── Extract foods from diet_meals ────────────────────────────────────────────
function extractFoodsFromDietMeals(meals) {
  const foods = []
  for (const meal of meals) {
    for (const food of meal.foods || []) {
      const name = food.name || food.nome || ''
      if (!name) continue
      foods.push({
        name,
        quantity: `${food.quantity || food.qt || ''}${food.unit || 'g'}`,
        category: categorizeFood(name),
      })
    }
  }
  return foods
}

// Deduplicate by name (case-insensitive), keep first occurrence
function deduplicateFoods(foods) {
  const seen = new Set()
  return foods.filter(f => {
    const key = f.name.toLowerCase().trim()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// ── localStorage helpers ─────────────────────────────────────────────────────
function loadLists(userId) {
  try {
    return JSON.parse(localStorage.getItem(`shopping_lists_${userId}`) || '[]')
  } catch { return [] }
}
function saveLists(userId, lists) {
  localStorage.setItem(`shopping_lists_${userId}`, JSON.stringify(lists))
}
function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

// ── DietTab: shopping list generated from active diet ────────────────────────
function DietTab({ user }) {
  const [loading, setLoading] = useState(true)
  const [foods, setFoods] = useState([])
  const [checked, setChecked] = useState({}) // { foodKey: true }
  const [collapsed, setCollapsed] = useState({})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const allFoods = []

      // Load clinical plans from piani table
      const linkRes = await supabase.from('patient_dietitian').select('cartella_id').eq('patient_id', user.id).maybeSingle().then(r => r, () => ({ data: null }))
      const cartellaId = linkRes?.data?.cartella_id ?? null
      if (cartellaId) {
        const { data: piani } = await supabase.from('piani').select('meals').eq('cartella_id', cartellaId).eq('visible_to_patient', true).order('saved_at', { ascending: false }).limit(1)
        if (piani?.[0]) allFoods.push(...extractFoodsFromPiano(piani[0]))
      }

      // Load active structured diet meals
      if (allFoods.length === 0) {
        const { data: activeDiet } = await supabase.from('patient_diets').select('id').eq('user_id', user.id).eq('is_active', true).maybeSingle()
        if (activeDiet) {
          const { data: meals } = await supabase.from('diet_meals').select('foods').eq('diet_id', activeDiet.id)
          if (meals) allFoods.push(...extractFoodsFromDietMeals(meals))
        }
      }

      setFoods(deduplicateFoods(allFoods))
      setLoading(false)
    }
    load()
  }, [user.id])

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = foods.filter(f => f.category === cat)
    return acc
  }, {})

  function toggleCheck(key) {
    setChecked(prev => ({ ...prev, [key]: !prev[key] }))
  }
  function toggleCollapse(cat) {
    setCollapsed(prev => ({ ...prev, [cat]: !prev[cat] }))
  }

  function saveAsCustomList(userId) {
    const items = foods.map((f, i) => ({
      id: uid(),
      name: f.name,
      quantity: f.quantity,
      category: f.category,
      checked: !!checked[`${f.category}_${i}_${f.name}`],
    }))
    const lists = loadLists(userId)
    lists.unshift({
      id: uid(),
      name: `Lista dalla dieta – ${new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}`,
      createdAt: new Date().toISOString(),
      items,
    })
    saveLists(userId, lists)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (loading) return (
    <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
      <div style={{ width: 28, height: 28, border: '3px solid var(--border)', borderTopColor: 'var(--green-main)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
      Caricamento dieta...
    </div>
  )

  if (foods.length === 0) return (
    <div style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--text-muted)' }}>
      <ShoppingCart size={40} style={{ opacity: 0.25, marginBottom: 12 }} />
      <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Nessuna dieta attiva</p>
      <p style={{ fontSize: 13, lineHeight: 1.6 }}>Quando il tuo dietista ti assegna un piano alimentare, qui troverai la lista della spesa generata automaticamente.</p>
    </div>
  )

  const checkedCount = foods.filter((f, i) => checked[`${f.category}_${i}_${f.name}`]).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Stats bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--green-pale)', borderRadius: 14, border: '1px solid var(--border-light)' }}>
        <span style={{ fontSize: 13, color: 'var(--green-dark)', fontWeight: 600 }}>
          {checkedCount}/{foods.length} articoli
        </span>
        <button
          onClick={() => saveAsCustomList(user.id)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, border: 'none', background: saved ? '#10b981' : 'var(--green-main)', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}
        >
          {saved ? <><Check size={12} /> Salvata!</> : <><Save size={12} /> Salva lista</>}
        </button>
      </div>

      {CATEGORIES.map(cat => {
        const items = grouped[cat]
        if (!items || items.length === 0) return null
        const isCollapsed = collapsed[cat]
        const catChecked = items.filter((f, i) => checked[`${cat}_${foods.indexOf(f)}_${f.name}`]).length
        return (
          <div key={cat} style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 14, overflow: 'hidden' }}>
            <button
              onClick={() => toggleCollapse(cat)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <span style={{ fontSize: 18 }}>{CATEGORY_ICONS[cat]}</span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{cat}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{catChecked}/{items.length}</span>
              {isCollapsed ? <ChevronDown size={16} color="var(--text-muted)" /> : <ChevronUp size={16} color="var(--text-muted)" />}
            </button>
            {!isCollapsed && (
              <div style={{ borderTop: '1px solid var(--border-light)' }}>
                {items.map((food, localIdx) => {
                  const globalIdx = foods.indexOf(food)
                  const key = `${cat}_${globalIdx}_${food.name}`
                  const isChecked = !!checked[key]
                  return (
                    <div
                      key={key}
                      onClick={() => toggleCheck(key)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderBottom: localIdx < items.length - 1 ? '1px solid var(--border-light)' : 'none', cursor: 'pointer', background: isChecked ? 'var(--surface-2)' : 'transparent', transition: 'background 0.15s' }}
                    >
                      <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${isChecked ? 'var(--green-main)' : 'var(--border)'}`, background: isChecked ? 'var(--green-main)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                        {isChecked && <Check size={13} color="white" strokeWidth={3} />}
                      </div>
                      <span style={{ flex: 1, fontSize: 14, color: isChecked ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: isChecked ? 'line-through' : 'none', transition: 'all 0.15s' }}>
                        {food.name}
                      </span>
                      {food.quantity && food.quantity !== 'g' && food.quantity !== 'undefinedg' && (
                        <span style={{ fontSize: 12, color: 'var(--green-main)', fontWeight: 700, background: 'var(--green-pale)', padding: '2px 8px', borderRadius: 20, flexShrink: 0 }}>
                          {food.quantity}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── DiaryTab: shopping list from last 7 days diary ────────────────────────────
function DiaryTab({ user }) {
  const [loading, setLoading] = useState(true)
  const [foods, setFoods] = useState([])
  const [checked, setChecked] = useState({})
  const [collapsed, setCollapsed] = useState({})
  const [saved, setSaved] = useState(false)
  const [days, setDays] = useState(7)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const from = subDays(new Date(), days - 1).toISOString().split('T')[0]
      const { data } = await supabase
        .from('food_logs')
        .select('food_name, grams')
        .eq('user_id', user.id)
        .gte('date', from)
        .neq('food_name', '__note__')
      const map = {}
      for (const row of data || []) {
        const key = (row.food_name || '').toLowerCase().trim()
        if (!key) continue
        if (!map[key]) map[key] = { name: row.food_name, totalGrams: 0, count: 0, category: categorizeFood(row.food_name) }
        map[key].totalGrams += parseFloat(row.grams || 0)
        map[key].count++
      }
      setFoods(Object.values(map).sort((a, b) => b.count - a.count))
      setChecked({})
      setLoading(false)
    }
    load()
  }, [user.id, days])

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = foods.filter(f => f.category === cat)
    return acc
  }, {})
  const checkedCount = foods.filter(f => checked[f.name]).length

  function saveAsCustomList() {
    const items = foods.map(f => ({ id: uid(), name: f.name, quantity: `~${Math.round(f.totalGrams / f.count)}g`, category: f.category, checked: !!checked[f.name] }))
    const lists = loadLists(user.id)
    lists.unshift({ id: uid(), name: `Dal diario – ultimi ${days}gg (${format(new Date(), 'd MMM', { locale: it })})`, createdAt: new Date().toISOString(), items })
    saveLists(user.id, lists)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (loading) return (
    <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
      <div style={{ width: 28, height: 28, border: '3px solid var(--border)', borderTopColor: 'var(--green-main)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
      Caricamento diario...
    </div>
  )

  if (foods.length === 0) return (
    <div style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--text-muted)' }}>
      <BookOpen size={40} style={{ opacity: 0.25, marginBottom: 12 }} />
      <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Nessun dato nel diario</p>
      <p style={{ fontSize: 13, lineHeight: 1.6 }}>Registra i pasti nel diario per gli ultimi {days} giorni per generare la lista automaticamente.</p>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Period selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)', flexShrink: 0 }}>Ultimi</span>
        {[7, 14, 30].map(d => (
          <button key={d} onClick={() => setDays(d)} style={{ padding: '5px 12px', borderRadius: 20, border: 'none', font: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer', background: days === d ? 'var(--green-main)' : 'var(--surface-2)', color: days === d ? 'white' : 'var(--text-secondary)' }}>{d}gg</button>
        ))}
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--green-pale)', borderRadius: 14, border: '1px solid var(--border-light)' }}>
        <span style={{ fontSize: 13, color: 'var(--green-dark)', fontWeight: 600 }}>{checkedCount}/{foods.length} articoli</span>
        <button onClick={saveAsCustomList} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, border: 'none', background: saved ? '#10b981' : 'var(--green-main)', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}>
          {saved ? <><Check size={12} /> Salvata!</> : <><Save size={12} /> Salva lista</>}
        </button>
      </div>

      {CATEGORIES.map(cat => {
        const items = grouped[cat]
        if (!items || items.length === 0) return null
        const isCollapsed = collapsed[cat]
        const catChecked = items.filter(f => checked[f.name]).length
        return (
          <div key={cat} style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 14, overflow: 'hidden' }}>
            <button onClick={() => setCollapsed(s => ({ ...s, [cat]: !s[cat] }))} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ fontSize: 18 }}>{CATEGORY_ICONS[cat]}</span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{cat}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{catChecked}/{items.length}</span>
              {isCollapsed ? <ChevronDown size={16} color="var(--text-muted)" /> : <ChevronUp size={16} color="var(--text-muted)" />}
            </button>
            {!isCollapsed && (
              <div style={{ borderTop: '1px solid var(--border-light)' }}>
                {items.map((food, idx) => {
                  const isChecked = !!checked[food.name]
                  return (
                    <div key={food.name} onClick={() => setChecked(s => ({ ...s, [food.name]: !s[food.name] }))}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderBottom: idx < items.length - 1 ? '1px solid var(--border-light)' : 'none', cursor: 'pointer', background: isChecked ? 'var(--surface-2)' : 'transparent', transition: 'background 0.15s' }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${isChecked ? 'var(--green-main)' : 'var(--border)'}`, background: isChecked ? 'var(--green-main)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                        {isChecked && <Check size={13} color="white" strokeWidth={3} />}
                      </div>
                      <span style={{ flex: 1, fontSize: 14, color: isChecked ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: isChecked ? 'line-through' : 'none', transition: 'all 0.15s' }}>{food.name}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>{food.count}×</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── ListsTab: custom shopping lists ──────────────────────────────────────────
function ListsTab({ user }) {
  const [lists, setLists] = useState(() => loadLists(user.id))
  const [activeListId, setActiveListId] = useState(null)
  const [newItemText, setNewItemText] = useState('')
  const [creatingList, setCreatingList] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [editingName, setEditingName] = useState(null)
  const [editNameText, setEditNameText] = useState('')

  function persist(updated) {
    setLists(updated)
    saveLists(user.id, updated)
  }

  function createList() {
    if (!newListName.trim()) return
    const list = { id: uid(), name: newListName.trim(), createdAt: new Date().toISOString(), items: [] }
    const updated = [list, ...lists]
    persist(updated)
    setActiveListId(list.id)
    setCreatingList(false)
    setNewListName('')
  }

  function deleteList(listId) {
    persist(lists.filter(l => l.id !== listId))
    if (activeListId === listId) setActiveListId(null)
  }

  function toggleItem(listId, itemId) {
    persist(lists.map(l => l.id !== listId ? l : {
      ...l,
      items: l.items.map(it => it.id !== itemId ? it : { ...it, checked: !it.checked }),
    }))
  }

  function addItem(listId) {
    const name = newItemText.trim()
    if (!name) return
    persist(lists.map(l => l.id !== listId ? l : {
      ...l,
      items: [...l.items, { id: uid(), name, category: categorizeFood(name), checked: false }],
    }))
    setNewItemText('')
  }

  function deleteItem(listId, itemId) {
    persist(lists.map(l => l.id !== listId ? l : {
      ...l,
      items: l.items.filter(it => it.id !== itemId),
    }))
  }

  function renameList(listId) {
    if (!editNameText.trim()) return
    persist(lists.map(l => l.id !== listId ? l : { ...l, name: editNameText.trim() }))
    setEditingName(null)
    setEditNameText('')
  }

  const activeList = lists.find(l => l.id === activeListId)

  if (activeList) {
    const checkedCount = activeList.items.filter(i => i.checked).length
    const grouped = CATEGORIES.reduce((acc, cat) => {
      acc[cat] = activeList.items.filter(i => i.category === cat)
      return acc
    }, {})

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Back + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => setActiveListId(null)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 12, border: '1.5px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>
            ← Indietro
          </button>
          <div style={{ flex: 1 }}>
            {editingName === activeList.id ? (
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  value={editNameText}
                  onChange={e => setEditNameText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') renameList(activeList.id) }}
                  autoFocus
                  style={{ flex: 1, padding: '7px 10px', border: '1.5px solid var(--green-main)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
                />
                <button onClick={() => renameList(activeList.id)} style={{ padding: '7px 12px', borderRadius: 10, border: 'none', background: 'var(--green-main)', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>OK</button>
                <button onClick={() => setEditingName(null)} style={{ padding: '7px 10px', borderRadius: 10, border: '1px solid var(--border)', background: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)' }}>✕</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{activeList.name}</span>
                <button onClick={() => { setEditingName(activeList.id); setEditNameText(activeList.name) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
                  <Edit2 size={13} />
                </button>
              </div>
            )}
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{checkedCount}/{activeList.items.length}</span>
        </div>

        {/* Add item */}
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={newItemText}
            onChange={e => setNewItemText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addItem(activeList.id) }}
            placeholder="Aggiungi un articolo..."
            style={{ flex: 1, padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', background: 'var(--surface)' }}
          />
          <button
            onClick={() => addItem(activeList.id)}
            disabled={!newItemText.trim()}
            style={{ padding: '11px 16px', borderRadius: 12, border: 'none', background: newItemText.trim() ? 'var(--green-main)' : 'var(--border)', color: 'white', cursor: newItemText.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700 }}
          >
            <Plus size={16} />
          </button>
        </div>

        {activeList.items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '28px 0', color: 'var(--text-muted)', fontSize: 13 }}>
            Aggiungi il tuo primo articolo qui sopra
          </div>
        ) : (
          CATEGORIES.map(cat => {
            const items = grouped[cat]
            if (!items || items.length === 0) return null
            return (
              <div key={cat} style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: 16 }}>{CATEGORY_ICONS[cat]}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>{cat}</span>
                </div>
                {items.map((item, idx) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderBottom: idx < items.length - 1 ? '1px solid var(--border-light)' : 'none', background: item.checked ? 'var(--surface-2)' : 'transparent' }}>
                    <div onClick={() => toggleItem(activeList.id, item.id)} style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${item.checked ? 'var(--green-main)' : 'var(--border)'}`, background: item.checked ? 'var(--green-main)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', transition: 'all 0.15s' }}>
                      {item.checked && <Check size={13} color="white" strokeWidth={3} />}
                    </div>
                    <span
                      onClick={() => toggleItem(activeList.id, item.id)}
                      style={{ flex: 1, fontSize: 14, color: item.checked ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: item.checked ? 'line-through' : 'none', cursor: 'pointer', transition: 'all 0.15s' }}
                    >
                      {item.name}
                    </span>
                    <button onClick={() => deleteItem(activeList.id, item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, display: 'flex', alignItems: 'center' }}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )
          })
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Create new list */}
      {creatingList ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={newListName}
            onChange={e => setNewListName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') createList() }}
            placeholder="Nome della lista..."
            autoFocus
            style={{ flex: 1, padding: '11px 14px', border: '1.5px solid var(--green-main)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
          />
          <button onClick={createList} disabled={!newListName.trim()} style={{ padding: '11px 16px', borderRadius: 12, border: 'none', background: newListName.trim() ? 'var(--green-main)' : 'var(--border)', color: 'white', cursor: newListName.trim() ? 'pointer' : 'default', fontSize: 14, fontWeight: 700 }}>Crea</button>
          <button onClick={() => { setCreatingList(false); setNewListName('') }} style={{ padding: '11px 14px', borderRadius: 12, border: '1px solid var(--border)', background: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--text-muted)' }}>✕</button>
        </div>
      ) : (
        <button
          onClick={() => setCreatingList(true)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', borderRadius: 14, border: '1.5px dashed var(--border)', background: 'var(--surface)', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', width: '100%' }}
        >
          <Plus size={16} /> Nuova lista della spesa
        </button>
      )}

      {lists.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
          <ListChecks size={36} style={{ opacity: 0.25, marginBottom: 10 }} />
          <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Nessuna lista salvata</p>
          <p style={{ fontSize: 13 }}>Crea la tua prima lista oppure salvala dalla scheda "Dalla dieta"</p>
        </div>
      ) : (
        lists.map(list => {
          const total = list.items.length
          const done = list.items.filter(i => i.checked).length
          return (
            <div key={list.id} style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ShoppingCart size={18} color="var(--green-main)" />
                </div>
                <button onClick={() => setActiveListId(list.id)} style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{list.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {new Date(list.createdAt).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })} · {done}/{total} articoli
                  </p>
                </button>
                {total > 0 && (
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: done === total ? 'var(--green-pale)' : 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {done === total
                      ? <Check size={16} color="var(--green-main)" />
                      : <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{Math.round((done / total) * 100)}%</span>
                    }
                  </div>
                )}
                <button
                  onClick={() => deleteList(list.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '6px', display: 'flex', alignItems: 'center', flexShrink: 0 }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ShoppingListPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState(0)

  const tabs = [
    { label: 'Dalla dieta', icon: Leaf },
    { label: 'Dal diario', icon: BookOpen },
    { label: 'Mie liste', icon: ListChecks },
  ]

  return (
    <div className="page">
      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg, var(--green-dark) 0%, var(--green-main) 100%)', padding: 'calc(env(safe-area-inset-top) + 18px) 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShoppingCart size={22} color="white" />
          </div>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 2 }}>Nutrizione</p>
            <h1 style={{ fontFamily: 'var(--font-d)', fontSize: 21, color: 'white', fontWeight: 300, lineHeight: 1.2 }}>Lista della spesa</h1>
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 8 }}>
          {tabs.map((t, i) => {
            const Icon = t.icon
            return (
              <button
                key={i}
                onClick={() => setTab(i)}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 12px', borderRadius: 12, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, transition: 'all 0.15s', background: tab === i ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)', color: tab === i ? 'var(--green-dark)' : 'rgba(255,255,255,0.85)' }}
              >
                <Icon size={14} strokeWidth={2} />
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ padding: '16px 16px 100px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {tab === 0 ? <DietTab user={user} /> : tab === 1 ? <DiaryTab user={user} /> : <ListsTab user={user} />}
      </div>
    </div>
  )
}
