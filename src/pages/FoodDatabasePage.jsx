import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Search, Plus, X, BookOpen } from 'lucide-react'

const OFF_API = 'https://world.openfoodfacts.org/cgi/search.pl'

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
    setSearching(true)
    try {
      const res = await fetch(`${OFF_API}?search_terms=${encodeURIComponent(query)}&json=1&fields=product_name,nutriments,brands,code&page_size=25&lc=it&cc=it`)
      const data = await res.json()
      setResults((data.products || [])
        .filter(p => p.product_name && p.nutriments?.['energy-kcal_100g'])
        .map(p => ({
          id: p.code, name: p.product_name, brand: p.brands,
          kcal_100g: Math.round(p.nutriments['energy-kcal_100g'] || 0),
          proteins_100g: Math.round((p.nutriments['proteins_100g'] || 0) * 10) / 10,
          carbs_100g: Math.round((p.nutriments['carbohydrates_100g'] || 0) * 10) / 10,
          fats_100g: Math.round((p.nutriments['fat_100g'] || 0) * 10) / 10,
          fiber_100g: Math.round((p.nutriments['fiber_100g'] || 0) * 10) / 10,
        })))
    } catch (e) { console.error(e) }
    setSearching(false)
  }

  async function saveFood(food) {
    const { data } = await supabase.from('custom_foods').insert({ ...food, source: 'openfoodfacts' }).select().single()
    if (data) setSaved(s => [...s, data])
  }

  async function addCustomFood() {
    const entry = {
      name: form.name, brand: form.brand,
      kcal_100g: parseFloat(form.kcal_100g) || 0,
      proteins_100g: parseFloat(form.proteins_100g) || 0,
      carbs_100g: parseFloat(form.carbs_100g) || 0,
      fats_100g: parseFloat(form.fats_100g) || 0,
      fiber_100g: parseFloat(form.fiber_100g) || 0,
      source: 'custom'
    }
    const { data } = await supabase.from('custom_foods').insert(entry).select().single()
    if (data) { setSaved(s => [...s, data]); setShowAdd(false); setForm({ name: '', brand: '', kcal_100g: '', proteins_100g: '', carbs_100g: '', fats_100g: '', fiber_100g: '' }) }
  }

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="page">
      <div style={{ background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))', padding: 'calc(env(safe-area-inset-top) + 20px) 24px 28px' }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 }}>Archivio</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'white', fontWeight: 300, marginBottom: 16 }}>Database alimenti</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          {['search', 'saved'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 20px', borderRadius: 100, background: tab === t ? 'white' : 'rgba(255,255,255,0.15)', color: tab === t ? 'var(--green-main)' : 'white', border: 'none', font: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              {t === 'search' ? '🔍 Cerca' : '⭐ I miei alimenti'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {tab === 'search' && (
          <>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
              <input type="text" className="input-field" placeholder="Cerca nel database mondiale…" value={query} onChange={e => setQuery(e.target.value)} style={{ flex: 1 }} />
              <button type="submit" className="btn btn-primary" style={{ padding: '0 18px' }} disabled={searching}>
                {searching ? <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'block' }} /> : <Search size={16} />}
              </button>
            </form>

            {results.length === 0 && (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                <BookOpen size={36} style={{ marginBottom: 10, opacity: 0.3 }} />
                <p style={{ fontSize: 14 }}>Cerca qualsiasi alimento<br />nel database Open Food Facts</p>
              </div>
            )}

            {results.map(f => (
              <div key={f.id} className="card" style={{ padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{f.name}</p>
                  {f.brand && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{f.brand}</p>}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {[
                      { l: '🔥', v: `${f.kcal_100g}kcal` },
                      { l: '💪', v: `P:${f.proteins_100g}g` },
                      { l: '🌾', v: `C:${f.carbs_100g}g` },
                      { l: '🧈', v: `G:${f.fats_100g}g` },
                    ].map(m => (
                      <span key={m.l} style={{ fontSize: 11, background: 'var(--surface-2)', padding: '2px 8px', borderRadius: 100, color: 'var(--text-secondary)' }}>{m.l} {m.v}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => saveFood(f)} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: 13, flexShrink: 0 }}>
                  <Plus size={14} />Salva
                </button>
              </div>
            ))}
          </>
        )}

        {tab === 'saved' && (
          <>
            <button className="btn btn-primary" onClick={() => setShowAdd(v => !v)} style={{ alignSelf: 'flex-start' }}>
              <Plus size={16} />{showAdd ? 'Annulla' : 'Aggiungi alimento'}
            </button>

            {showAdd && (
              <div className="card animate-slideUp" style={{ padding: 18 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Nuovo alimento personalizzato</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="input-label">Nome *</label>
                      <input type="text" className="input-field" value={form.name} onChange={set('name')} placeholder="es. Muesli artigianale" />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Marca</label>
                      <input type="text" className="input-field" value={form.brand} onChange={set('brand')} placeholder="Opzionale" />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Kcal/100g *</label>
                      <input type="number" className="input-field" value={form.kcal_100g} onChange={set('kcal_100g')} placeholder="0" />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Proteine/100g</label>
                      <input type="number" className="input-field" value={form.proteins_100g} onChange={set('proteins_100g')} placeholder="0" />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Carboidrati/100g</label>
                      <input type="number" className="input-field" value={form.carbs_100g} onChange={set('carbs_100g')} placeholder="0" />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Grassi/100g</label>
                      <input type="number" className="input-field" value={form.fats_100g} onChange={set('fats_100g')} placeholder="0" />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Fibre/100g</label>
                      <input type="number" className="input-field" value={form.fiber_100g} onChange={set('fiber_100g')} placeholder="0" />
                    </div>
                  </div>
                  <button className="btn btn-primary" onClick={addCustomFood} disabled={!form.name || !form.kcal_100g}>Salva alimento</button>
                </div>
              </div>
            )}

            {saved.length === 0 && !showAdd && (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: 14 }}>Nessun alimento salvato</p>
                <p style={{ fontSize: 13, marginTop: 4 }}>Cerca nel database o aggiungine uno manualmente</p>
              </div>
            )}

            {saved.map(f => (
              <div key={f.id} className="card" style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{f.name}</p>
                  <span style={{ fontSize: 11 }} className="badge badge-green">{f.source === 'custom' ? '✏️ personale' : '🌍 OFF'}</span>
                </div>
                {f.brand && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{f.brand}</p>}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[
                    { v: `${f.kcal_100g}kcal` },
                    { v: `P:${f.proteins_100g}g` },
                    { v: `C:${f.carbs_100g}g` },
                    { v: `G:${f.fats_100g}g` },
                  ].map(m => (
                    <span key={m.v} style={{ fontSize: 11, background: 'var(--surface-2)', padding: '2px 8px', borderRadius: 100, color: 'var(--text-secondary)' }}>{m.v}</span>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
