import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Search, Trash2, Apple } from 'lucide-react'

const OFF_API = 'https://world.openfoodfacts.org/cgi/search.pl'

async function searchSupabaseFoods(query) {
  try {
    const { data } = await supabase
      .from('foods')
      .select('id, name, brand, calories_per_100g, proteins_per_100g, carbs_per_100g, fats_per_100g, fiber_per_100g')
      .ilike('name', `%${query}%`)
      .limit(20)
    return (data || []).map(f => ({
      id: `sb_${f.id}`, name: f.name, brand: f.brand,
      kcal_100g: f.calories_per_100g || 0,
      proteins_100g: f.proteins_per_100g || 0,
      carbs_100g: f.carbs_per_100g || 0,
      fats_100g: f.fats_per_100g || 0,
      source: 'database'
    }))
  } catch { return [] }
}

async function searchOFFFoods(query) {
  try {
    const res = await fetch(`${OFF_API}?search_terms=${encodeURIComponent(query)}&json=1&fields=product_name,nutriments,quantity,brands,code&page_size=15&lc=it&cc=it`)
    const data = await res.json()
    return (data.products || [])
      .filter(p => p.product_name && p.nutriments?.['energy-kcal_100g'])
      .map(p => ({
        id: p.code, name: p.product_name, brand: p.brands,
        kcal_100g: Math.round(p.nutriments['energy-kcal_100g'] || 0),
        proteins_100g: Math.round((p.nutriments['proteins_100g'] || 0) * 10) / 10,
        carbs_100g: Math.round((p.nutriments['carbohydrates_100g'] || 0) * 10) / 10,
        fats_100g: Math.round((p.nutriments['fat_100g'] || 0) * 10) / 10,
        source: 'openfoodfacts'
      }))
  } catch { return [] }
}

async function searchFoods(query) {
  const [db, off] = await Promise.all([searchSupabaseFoods(query), searchOFFFoods(query)])
  // DB results first (dietitian's foods take priority)
  return [...db, ...off]
}

function calcMacros(food, grams) {
  const f = grams / 100
  return {
    kcal: Math.round(food.kcal_100g * f),
    proteins: Math.round(food.proteins_100g * f * 10) / 10,
    carbs: Math.round(food.carbs_100g * f * 10) / 10,
    fats: Math.round(food.fats_100g * f * 10) / 10,
  }
}

function MacroBar({ label, value, target, color }) {
  const pct = Math.min(100, target ? Math.round((value / target) * 100) : 0)
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
        <span style={{ fontWeight: 500 }}>{label}</span>
        <span style={{ color: 'var(--text-muted)' }}>{value}g {target ? `/ ${target}g` : ''}</span>
      </div>
      <div style={{ height: 6, background: 'var(--border-light)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  )
}

export default function MacroTrackerPage() {
  const today = new Date().toISOString().split('T')[0]
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState(null)
  const [grams, setGrams] = useState('100')
  const [meal, setMeal] = useState('pranzo')
  const [log, setLog] = useState([])
  const [diet, setDiet] = useState(null)
  const [saving, setSaving] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  const MEALS = ['colazione', 'spuntino_mattina', 'pranzo', 'spuntino_pomeriggio', 'cena']
  const MEAL_LABELS = { colazione: 'Colazione', spuntino_mattina: 'Spuntino mattina', pranzo: 'Pranzo', spuntino_pomeriggio: 'Spuntino pom.', cena: 'Cena' }

  useEffect(() => {
    async function loadLog() {
      const { data } = await supabase.from('food_logs').select('*').eq('date', today).order('created_at')
      setLog(data || [])
      const { data: d } = await supabase.from('patient_diets').select('*').eq('is_active', true).maybeSingle()
      setDiet(d)
    }
    loadLog()
  }, [today])

  async function handleSearch(e) {
    e?.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    const foods = await searchFoods(query)
    setResults(foods)
    setSearching(false)
  }

  async function addFood() {
    if (!selected) return
    setSaving(true)
    const m = calcMacros(selected, parseFloat(grams) || 100)
    const entry = {
      date: today, meal_type: meal,
      food_name: selected.name, grams: parseFloat(grams),
      kcal: m.kcal, proteins: m.proteins, carbs: m.carbs, fats: m.fats,
      food_data: selected
    }
    const { data } = await supabase.from('food_logs').insert(entry).select().single()
    if (data) setLog(l => [...l, data])
    setSelected(null); setQuery(''); setResults([]); setShowSearch(false)
    setSaving(false)
    // Update daily totals
    await updateDailyLog()
  }

  async function updateDailyLog() {
    const { data: allLogs } = await supabase.from('food_logs').select('*').eq('date', today)
    if (!allLogs) return
    const totals = allLogs.reduce((acc, f) => ({
      kcal: acc.kcal + f.kcal,
      proteins: acc.proteins + f.proteins,
      carbs: acc.carbs + f.carbs,
      fats: acc.fats + f.fats
    }), { kcal: 0, proteins: 0, carbs: 0, fats: 0 })
    await supabase.from('daily_logs').upsert({ date: today, ...totals }, { onConflict: 'date' })
  }

  async function removeFood(id) {
    await supabase.from('food_logs').delete().eq('id', id)
    setLog(l => l.filter(x => x.id !== id))
    await updateDailyLog()
  }

  const totals = log.reduce((a, f) => ({
    kcal: a.kcal + f.kcal,
    proteins: a.proteins + f.proteins,
    carbs: a.carbs + f.carbs,
    fats: a.fats + f.fats
  }), { kcal: 0, proteins: 0, carbs: 0, fats: 0 })

  const preview = selected ? calcMacros(selected, parseFloat(grams) || 100) : null

  return (
    <div className="page">
      <div style={{ background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))', padding: 'calc(env(safe-area-inset-top) + 20px) 24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Diario</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'white', fontWeight: 300 }}>Traccia i pasti</h1>
          </div>
          <button className="btn" onClick={() => setShowSearch(v => !v)} style={{ background: 'white', color: 'var(--green-main)', borderRadius: 14, padding: '10px 16px', fontSize: 14, fontWeight: 600, gap: 6 }}>
            <Plus size={16} />Aggiungi
          </button>
        </div>
        {/* Totals summary */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { label: 'kcal', val: totals.kcal, target: diet?.kcal_target, icon: '🔥' },
            { label: 'Proteine', val: `${totals.proteins}g`, target: null, icon: '💪' },
            { label: 'Carbo', val: `${totals.carbs}g`, target: null, icon: '🌾' },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: '10px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.15)' }}>
              <p style={{ color: 'white', fontSize: 15, fontWeight: 700 }}>{s.val}{s.target ? `/${s.target}` : ''}</p>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Search panel */}
        {showSearch && (
          <div className="card animate-slideUp" style={{ padding: 18 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Cerca alimento</h3>

            {/* Meal selector */}
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 14, paddingBottom: 4 }}>
              {MEALS.map(m => (
                <button key={m} onClick={() => setMeal(m)} style={{ flexShrink: 0, padding: '6px 14px', borderRadius: 100, background: meal === m ? 'var(--green-main)' : 'var(--surface-2)', color: meal === m ? 'white' : 'var(--text-secondary)', border: `1px solid ${meal === m ? 'transparent' : 'var(--border)'}`, font: 'inherit', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
                  {MEAL_LABELS[m]}
                </button>
              ))}
            </div>

            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <input type="text" className="input-field" placeholder="es. pasta integrale, petto di pollo…" value={query} onChange={e => setQuery(e.target.value)} style={{ flex: 1 }} />
              <button type="submit" className="btn btn-primary" style={{ padding: '0 16px' }} disabled={searching}>
                {searching ? <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'block' }} /> : <Search size={16} />}
              </button>
            </form>

            {results.length > 0 && !selected && (
              <div style={{ maxHeight: 220, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {results.map(f => (
                  <button key={f.id} onClick={() => setSelected(f)} style={{ width: '100%', background: 'var(--surface-2)', border: '1.5px solid var(--border)', borderRadius: 10, padding: '10px 12px', textAlign: 'left', cursor: 'pointer', font: 'inherit' }}>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>{f.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {f.brand && `${f.brand} · `}{f.kcal_100g} kcal/100g · P:{f.proteins_100g}g C:{f.carbs_100g}g F:{f.fats_100g}g
                    {f.source === 'database' && <span style={{ marginLeft: 6, color: 'var(--green-main)', fontWeight: 600 }}>✓ DB dietista</span>}
                  </p>
                  </button>
                ))}
              </div>
            )}

            {selected && (
              <div>
                <div style={{ background: 'var(--green-pale)', borderRadius: 12, padding: '12px 14px', marginBottom: 14 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{selected.name}</p>
                  {preview && <p style={{ fontSize: 13, color: 'var(--green-dark)' }}>{preview.kcal} kcal · P:{preview.proteins}g · C:{preview.carbs}g · G:{preview.fats}g</p>}
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                  <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label">Grammatura (g)</label>
                    <input type="number" className="input-field" value={grams} onChange={e => setGrams(e.target.value)} min={1} />
                  </div>
                  <button className="btn btn-primary" onClick={addFood} disabled={saving} style={{ height: 48, padding: '0 20px' }}>
                    {saving ? '...' : 'Aggiungi'}
                  </button>
                  <button className="btn btn-ghost" onClick={() => setSelected(null)} style={{ height: 48, padding: '0 12px' }}>Annulla</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Macro bars */}
        {diet && (
          <div className="card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Obiettivi giornalieri</h3>
            <MacroBar label="Proteine" value={totals.proteins} target={diet.protein_target} color="#3b82f6" />
            <MacroBar label="Carboidrati" value={totals.carbs} target={diet.carbs_target} color="#f0922b" />
            <MacroBar label="Grassi" value={totals.fats} target={diet.fats_target} color="#e05a5a" />
          </div>
        )}

        {/* Food log by meal */}
        {MEALS.map(m => {
          const mealFoods = log.filter(f => f.meal_type === m)
          if (!mealFoods.length) return null
          return (
            <div key={m} className="card" style={{ padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h4 style={{ fontSize: 14, fontWeight: 600 }}>{MEAL_LABELS[m]}</h4>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{mealFoods.reduce((s, f) => s + f.kcal, 0)} kcal</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {mealFoods.map(f => (
                  <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Apple size={16} color="var(--green-main)" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.food_name}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{f.grams}g · {f.kcal} kcal · P:{f.proteins}g</p>
                    </div>
                    <button onClick={() => removeFood(f.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 6 }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {log.length === 0 && !showSearch && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            <Apple size={36} style={{ marginBottom: 12, opacity: 0.4 }} />
            <p style={{ fontSize: 14 }}>Nessun alimento registrato oggi</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Tocca "Aggiungi" per iniziare</p>
          </div>
        )}
      </div>
    </div>
  )
}
