import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { searchFoods } from '../lib/foodSearch'
import { Search, Plus, X, BookOpen, Star, StarOff, Trash2 } from 'lucide-react'

export default function FoodDatabasePage() {
  const [tab, setTab] = useState('search')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [saved, setSaved] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', brand: '', kcal_100g: '', proteins_100g: '', carbs_100g: '', fats_100g: '', fiber_100g: '' })

  useEffect(() => {
    supabase.from('custom_foods').select('*').order('name').then(({ data }) => setSaved(data || []))
  }, [])

  async function handleSearch(e) {
    e?.preventDefault()
    if (!query.trim()) return
    setSearching(true); setResults([])
    const foods = await searchFoods(query.trim())
    setResults(foods); setSearching(false)
  }

  async function saveToFavorites(food) {
    // Check not already saved
    const already = saved.find(s => s.name === food.name)
    if (already) return
    const { data } = await supabase.from('custom_foods').insert({
      name: food.name, brand: food.brand || '',
      kcal_100g: food.kcal_100g, proteins_100g: food.proteins_100g,
      carbs_100g: food.carbs_100g, fats_100g: food.fats_100g,
      fiber_100g: food.fiber_100g || 0, source: food.source
    }).select().single()
    if (data) setSaved(s => [...s, data])
  }

  async function removeFavorite(id) {
    await supabase.from('custom_foods').delete().eq('id', id)
    setSaved(s => s.filter(x => x.id !== id))
  }

  async function addCustomFood() {
    if (!form.name || !form.kcal_100g) return
    const { data } = await supabase.from('custom_foods').insert({
      name: form.name, brand: form.brand,
      kcal_100g: parseFloat(form.kcal_100g) || 0,
      proteins_100g: parseFloat(form.proteins_100g) || 0,
      carbs_100g: parseFloat(form.carbs_100g) || 0,
      fats_100g: parseFloat(form.fats_100g) || 0,
      fiber_100g: parseFloat(form.fiber_100g) || 0,
      source: 'custom'
    }).select().single()
    if (data) {
      setSaved(s => [...s, data])
      setShowAdd(false)
      setForm({ name: '', brand: '', kcal_100g: '', proteins_100g: '', carbs_100g: '', fats_100g: '', fiber_100g: '' })
    }
  }

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="page">
      <div style={{ background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))', padding: 'calc(env(safe-area-inset-top) + 18px) 16px 22px' }}>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, marginBottom: 4 }}>Archivio</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'white', fontWeight: 300, marginBottom: 14 }}>Database alimenti</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['search', '🔍 Cerca'], ['saved', '⭐ Preferiti']].map(([t, l]) => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '7px 18px', borderRadius: 100, background: tab === t ? 'white' : 'rgba(255,255,255,0.15)', color: tab === t ? 'var(--green-main)' : 'white', border: 'none', font: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '14px 14px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {tab === 'search' && (
          <>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
              <input type="text" className="input-field" placeholder="Cerca nel database…" value={query} onChange={e => setQuery(e.target.value)} style={{ flex: 1 }} autoComplete="off" />
              <button type="submit" className="btn btn-primary" style={{ padding: '0 16px' }} disabled={searching || !query.trim()}>
                {searching
                  ? <span style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'block' }} />
                  : <Search size={15} />}
              </button>
            </form>

            {searching && (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: 13 }}>
                Ricerca nel database del dietista e in Open Food Facts…
              </div>
            )}

            {results.length === 0 && !searching && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <BookOpen size={36} style={{ marginBottom: 10, opacity: 0.25 }} />
                <p style={{ fontSize: 14, fontWeight: 500 }}>Cerca qualsiasi alimento</p>
                <p style={{ fontSize: 12, marginTop: 4, lineHeight: 1.6 }}>Prima dal database del tuo dietista,<br />poi da Open Food Facts (milioni di alimenti)</p>
              </div>
            )}

            {results.map((f, i) => {
              const isSaved = saved.some(s => s.name === f.name)
              return (
                <div key={`${f.id}_${i}`} className="card" style={{ padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, flex: 1, lineHeight: 1.3 }}>{f.name}</p>
                      <span style={{ fontSize: 9, background: f.source === 'database' ? 'var(--green-pale)' : '#f1f5f9', color: f.source === 'database' ? 'var(--green-main)' : 'var(--text-muted)', padding: '2px 6px', borderRadius: 100, fontWeight: 700, flexShrink: 0 }}>
                        {f.source === 'database' ? 'DB' : 'OFF'}
                      </span>
                    </div>
                    {f.brand && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{f.brand}</p>}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {[`🔥 ${f.kcal_100g}kcal`, `P:${f.proteins_100g}g`, `C:${f.carbs_100g}g`, `G:${f.fats_100g}g`].map(v => (
                        <span key={v} style={{ fontSize: 11, background: 'var(--surface-2)', padding: '2px 7px', borderRadius: 100, color: 'var(--text-secondary)' }}>{v}</span>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => saveToFavorites(f)} style={{ background: 'none', border: 'none', cursor: isSaved ? 'default' : 'pointer', padding: 6, flexShrink: 0, color: isSaved ? '#f59e0b' : 'var(--border)' }}>
                    {isSaved ? <Star size={18} fill="#f59e0b" /> : <Star size={18} />}
                  </button>
                </div>
              )
            })}
          </>
        )}

        {tab === 'saved' && (
          <>
            <button className="btn btn-primary" onClick={() => setShowAdd(v => !v)} style={{ alignSelf: 'flex-start' }}>
              {showAdd ? <X size={15} /> : <Plus size={15} />}{showAdd ? 'Annulla' : 'Aggiungi manualmente'}
            </button>

            {showAdd && (
              <div className="card animate-slideUp" style={{ padding: 14 }}>
                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Nuovo alimento</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="input-label">Nome *</label>
                      <input className="input-field" value={form.name} onChange={set('name')} placeholder="es. Muesli artigianale" />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Marca</label>
                      <input className="input-field" value={form.brand} onChange={set('brand')} placeholder="Opzionale" />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Kcal/100g *</label>
                      <input type="number" className="input-field" value={form.kcal_100g} onChange={set('kcal_100g')} placeholder="0" inputMode="decimal" />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Proteine/100g</label>
                      <input type="number" className="input-field" value={form.proteins_100g} onChange={set('proteins_100g')} placeholder="0" inputMode="decimal" />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Carboidrati/100g</label>
                      <input type="number" className="input-field" value={form.carbs_100g} onChange={set('carbs_100g')} placeholder="0" inputMode="decimal" />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Grassi/100g</label>
                      <input type="number" className="input-field" value={form.fats_100g} onChange={set('fats_100g')} placeholder="0" inputMode="decimal" />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Fibre/100g</label>
                      <input type="number" className="input-field" value={form.fiber_100g} onChange={set('fiber_100g')} placeholder="0" inputMode="decimal" />
                    </div>
                  </div>
                  <button className="btn btn-primary" onClick={addCustomFood} disabled={!form.name || !form.kcal_100g}>Salva alimento</button>
                </div>
              </div>
            )}

            {saved.length === 0 && !showAdd && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <Star size={36} style={{ marginBottom: 10, opacity: 0.25 }} />
                <p style={{ fontSize: 14, fontWeight: 500 }}>Nessun alimento nei preferiti</p>
                <p style={{ fontSize: 12, marginTop: 4 }}>Cerca e salva gli alimenti che usi spesso</p>
              </div>
            )}

            {saved.map(f => (
              <div key={f.id} className="card" style={{ padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>{f.name}</p>
                    <span style={{ fontSize: 9, background: f.source === 'custom' ? '#f5f3ff' : f.source === 'database' ? 'var(--green-pale)' : '#f1f5f9', color: f.source === 'custom' ? '#7c3aed' : f.source === 'database' ? 'var(--green-main)' : 'var(--text-muted)', padding: '2px 5px', borderRadius: 100, fontWeight: 700 }}>
                      {f.source === 'custom' ? '✏️' : f.source === 'database' ? 'DB' : 'OFF'}
                    </span>
                  </div>
                  {f.brand && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 5 }}>{f.brand}</p>}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {[`🔥 ${f.kcal_100g}kcal`, `P:${f.proteins_100g}g`, `C:${f.carbs_100g}g`, `G:${f.fats_100g}g`].map(v => (
                      <span key={v} style={{ fontSize: 11, background: 'var(--surface-2)', padding: '2px 7px', borderRadius: 100, color: 'var(--text-secondary)' }}>{v}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => removeFavorite(f.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 6, flexShrink: 0 }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
