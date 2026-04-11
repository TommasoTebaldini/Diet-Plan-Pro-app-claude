import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { searchFoods } from '../lib/foodSearch'
import { Plus, Search, Trash2, Apple, X, ChevronDown, ChevronUp } from 'lucide-react'

function calcMacros(food, grams) {
  const f = (parseFloat(grams) || 100) / 100
  return {
    kcal: Math.round(food.kcal_100g * f),
    proteins: Math.round(food.proteins_100g * f * 10) / 10,
    carbs: Math.round(food.carbs_100g * f * 10) / 10,
    fats: Math.round(food.fats_100g * f * 10) / 10,
  }
}

const MEALS = [
  { key: 'colazione', label: 'Colazione', emoji: '☀️' },
  { key: 'spuntino_mattina', label: 'Spuntino', emoji: '🍎' },
  { key: 'pranzo', label: 'Pranzo', emoji: '🍽️' },
  { key: 'spuntino_pomeriggio', label: 'Merenda', emoji: '🥤' },
  { key: 'cena', label: 'Cena', emoji: '🌙' },
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
  const [expandedMeal, setExpandedMeal] = useState(null)

  useEffect(() => { loadLog() }, [today])

  async function loadLog() {
    const { data } = await supabase.from('food_logs').select('*').eq('date', today).order('created_at')
    setLog(data || [])
    const { data: d } = await supabase.from('patient_diets').select('*').eq('is_active', true).maybeSingle()
    setDiet(d)
  }

  async function handleSearch(e) {
    e?.preventDefault()
    if (!query.trim()) return
    setSearching(true); setResults([])
    const foods = await searchFoods(query.trim())
    setResults(foods); setSearching(false)
  }

  async function addFood() {
    if (!selected) return
    setSaving(true)
    const m = calcMacros(selected, grams)
    const { data } = await supabase.from('food_logs').insert({
      date: today, meal_type: meal, food_name: selected.name,
      grams: parseFloat(grams) || 100, ...m, food_data: selected
    }).select().single()
    if (data) setLog(l => [...l, data])
    await updateDailyLog()
    setSelected(null); setQuery(''); setResults([])
    setShowSearch(false); setSaving(false)
  }

  async function updateDailyLog() {
    const { data } = await supabase.from('food_logs').select('*').eq('date', today)
    if (!data) return
    const t = data.reduce((a, f) => ({
      kcal: a.kcal + (f.kcal || 0), proteins: a.proteins + (f.proteins || 0),
      carbs: a.carbs + (f.carbs || 0), fats: a.fats + (f.fats || 0),
    }), { kcal: 0, proteins: 0, carbs: 0, fats: 0 })
    await supabase.from('daily_logs').upsert({ date: today, ...t }, { onConflict: 'date' })
  }

  async function removeFood(id) {
    await supabase.from('food_logs').delete().eq('id', id)
    setLog(l => l.filter(x => x.id !== id))
    await updateDailyLog()
  }

  const totals = log.reduce((a, f) => ({
    kcal: a.kcal + (f.kcal || 0), proteins: a.proteins + (f.proteins || 0),
    carbs: a.carbs + (f.carbs || 0), fats: a.fats + (f.fats || 0),
  }), { kcal: 0, proteins: 0, carbs: 0, fats: 0 })

  const preview = selected ? calcMacros(selected, grams) : null

  return (
    <div className="page">
      <div style={{ background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))', padding: 'calc(env(safe-area-inset-top) + 18px) 16px 20px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11 }}>Diario alimentare</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'white', fontWeight: 300 }}>
              {new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'short' })}
            </h1>
          </div>
          <button onClick={() => { setShowSearch(v => !v); setSelected(null); setResults([]) }}
            style={{ background: showSearch ? 'rgba(255,255,255,0.2)' : 'white', color: showSearch ? 'white' : 'var(--green-main)', border: 'none', borderRadius: 12, padding: '9px 14px', font: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
            {showSearch ? <X size={15} /> : <Plus size={15} />}{showSearch ? 'Chiudi' : 'Aggiungi'}
          </button>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
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
      </div>

      <div style={{ padding: '14px 14px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {showSearch && (
          <div className="card animate-slideUp" style={{ padding: 14 }}>
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 12, paddingBottom: 2 }}>
              {MEALS.map(m => (
                <button key={m.key} onClick={() => setMeal(m.key)} style={{
                  flexShrink: 0, padding: '5px 10px', borderRadius: 100,
                  background: meal === m.key ? 'var(--green-main)' : 'var(--surface-2)',
                  color: meal === m.key ? 'white' : 'var(--text-secondary)',
                  border: `1.5px solid ${meal === m.key ? 'transparent' : 'var(--border)'}`,
                  font: 'inherit', fontSize: 12, fontWeight: 500, cursor: 'pointer'
                }}>{m.emoji} {m.label}</button>
              ))}
            </div>

            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input type="text" className="input-field" placeholder="es. pollo, pasta, mela…"
                value={query} onChange={e => setQuery(e.target.value)} style={{ flex: 1 }} autoComplete="off" />
              <button type="submit" className="btn btn-primary" style={{ padding: '0 14px', flexShrink: 0 }} disabled={searching || !query.trim()}>
                {searching
                  ? <span style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'block' }} />
                  : <Search size={15} />}
              </button>
            </form>

            {searching && (
              <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', padding: '8px 0' }}>
                Ricerca nel database e in Open Food Facts…
              </p>
            )}

            {!selected && !searching && results.length > 0 && (
              <div style={{ maxHeight: 250, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 7 }}>
                {results.map((f, i) => (
                  <button key={`${f.id}_${i}`} onClick={() => { setSelected(f); setGrams('100') }} style={{ background: 'var(--surface-2)', border: '1.5px solid var(--border)', borderRadius: 10, padding: '9px 11px', textAlign: 'left', cursor: 'pointer', font: 'inherit', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.3, flex: 1 }}>{f.name}</p>
                      {(() => {
                        const badges = { recent: ['🕐','#fff4e6','#c45e00'], diet: ['🥗','var(--green-pale)','var(--green-main)'], recipe: ['🍳','#fff4e6','#c45e00'], openfoodfacts: ['🌍','#f1f5f9','var(--text-muted)'], database: ['DB','var(--green-pale)','var(--green-main)'] }
                        const [label, bg, color] = badges[f.source] || badges.openfoodfacts
                        return <span style={{ fontSize: 9, background: bg, color, padding: '2px 5px', borderRadius: 100, fontWeight: 700, flexShrink: 0 }}>{label}</span>
                      })()}
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      {f.brand ? `${f.brand} · ` : ''}{f.kcal_100g} kcal · P:{f.proteins_100g} C:{f.carbs_100g} G:{f.fats_100g}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {!selected && !searching && query && results.length === 0 && (
              <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', padding: '10px 0' }}>
                Nessun risultato per "{query}". Prova con un termine diverso.
              </p>
            )}

            {selected && (
              <div>
                <div style={{ background: 'var(--green-pale)', borderRadius: 12, padding: '11px 13px', marginBottom: 11, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{selected.name}</p>
                    {preview && <p style={{ fontSize: 12, color: 'var(--green-dark)' }}>{preview.kcal} kcal · P:{preview.proteins}g · C:{preview.carbs}g · G:{preview.fats}g</p>}
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'var(--text-muted)' }}><X size={15} /></button>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label">Grammi</label>
                    <input type="number" className="input-field" value={grams} onChange={e => setGrams(e.target.value)} min={1} inputMode="decimal" />
                  </div>
                  <button className="btn btn-primary" onClick={addFood} disabled={saving} style={{ alignSelf: 'flex-end', height: 48, padding: '0 18px' }}>
                    {saving ? '…' : 'Aggiungi'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {diet && (
          <div className="card" style={{ padding: 14 }}>
            <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Obiettivi</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <MacroBar label="Proteine" value={totals.proteins} target={diet.protein_target} color="#3b82f6" />
              <MacroBar label="Carboidrati" value={totals.carbs} target={diet.carbs_target} color="#f0922b" />
              <MacroBar label="Grassi" value={totals.fats} target={diet.fats_target} color="#e05a5a" />
            </div>
          </div>
        )}

        {MEALS.map(m => {
          const mealFoods = log.filter(f => f.meal_type === m.key)
          if (!mealFoods.length) return null
          const mealKcal = mealFoods.reduce((s, f) => s + (f.kcal || 0), 0)
          const isOpen = expandedMeal === m.key
          return (
            <div key={m.key} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <button onClick={() => setExpandedMeal(isOpen ? null : m.key)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '13px 14px', display: 'flex', alignItems: 'center', gap: 9, font: 'inherit' }}>
                <span style={{ fontSize: 20 }}>{m.emoji}</span>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 600, textAlign: 'left' }}>{m.label}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{mealKcal} kcal</span>
                {isOpen ? <ChevronUp size={15} color="var(--text-muted)" /> : <ChevronDown size={15} color="var(--text-muted)" />}
              </button>
              {isOpen && (
                <div style={{ borderTop: '1px solid var(--border-light)', padding: '10px 14px 12px' }}>
                  {mealFoods.map(f => (
                    <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 9, paddingBottom: 9 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Apple size={14} color="var(--green-main)" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.food_name}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{f.grams}g · {f.kcal} kcal · P:{f.proteins}g</p>
                      </div>
                      <button onClick={() => removeFood(f.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 5, flexShrink: 0 }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {log.length === 0 && !showSearch && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
            <Apple size={38} style={{ marginBottom: 10, opacity: 0.25 }} />
            <p style={{ fontSize: 15, fontWeight: 500 }}>Nessun alimento registrato</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Tocca "Aggiungi" per iniziare</p>
          </div>
        )}
      </div>
    </div>
  )
}
