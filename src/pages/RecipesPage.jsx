import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { searchFoods } from '../lib/foodSearch'
import { Search, Plus, X, Trash2, ChevronDown, ChevronUp, Globe, Lock } from 'lucide-react'

// ── helpers ──────────────────────────────────────────────────────────────────
function calcMacros(food, grams) {
  const f = (parseFloat(grams) || 100) / 100
  return {
    kcal: Math.round((food.kcal_100g || 0) * f),
    proteins: Math.round((food.proteins_100g || 0) * f * 10) / 10,
    carbs: Math.round((food.carbs_100g || 0) * f * 10) / 10,
    fats: Math.round((food.fats_100g || 0) * f * 10) / 10,
  }
}

function sumIngredients(ings) {
  return ings.reduce(
    (a, i) => ({ kcal: a.kcal + (i.kcal || 0), proteins: a.proteins + (i.proteins || 0), carbs: a.carbs + (i.carbs || 0), fats: a.fats + (i.fats || 0) }),
    { kcal: 0, proteins: 0, carbs: 0, fats: 0 }
  )
}

function totalTime(r) {
  return (r.tempo_preparazione_min || 0) + (r.tempo_cottura_min || 0) + (r.tempo_raffreddamento_min || 0)
}

function fmtTime(min) {
  if (!min || min <= 0) return null
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60), m = min % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

// ── IngredientSearch ──────────────────────────────────────────────────────────
function IngredientSearch({ onAdd }) {
  const [q, setQ] = useState('')
  const [res, setRes] = useState([])
  const [busy, setBusy] = useState(false)
  const [pending, setPending] = useState(null)
  const [pendingGrams, setPendingGrams] = useState('100')

  async function doSearch(e) {
    e?.preventDefault()
    if (!q.trim() || q.trim().length < 2) return
    setBusy(true); setRes([])
    setRes(await searchFoods(q.trim()))
    setBusy(false)
  }

  function select(food) { setPending(food); setPendingGrams('100'); setRes([]) }

  function confirm(e) {
    e.preventDefault()
    if (!pending) return
    onAdd({ food_name: pending.name, food_data: pending, grams: parseFloat(pendingGrams) || 100, ...calcMacros(pending, pendingGrams) })
    setPending(null); setQ('')
  }

  return (
    <div>
      {pending ? (
        <form onSubmit={confirm}>
          <div style={{ background: 'var(--green-pale)', borderRadius: 10, padding: '10px 12px', marginBottom: 8 }}>
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{pending.name}</p>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <div className="input-group" style={{ flex: 1 }}>
                <label className="input-label">Quantità (g)</label>
                <input type="number" className="input-field" value={pendingGrams} onChange={e => setPendingGrams(e.target.value)} min={1} inputMode="decimal" autoFocus />
              </div>
              <button type="submit" className="btn btn-primary" style={{ flexShrink: 0, height: 42 }}>Aggiungi</button>
              <button type="button" onClick={() => setPending(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: 'var(--text-muted)', height: 42, display: 'flex', alignItems: 'center' }}>
                <X size={15} />
              </button>
            </div>
            {(() => { const m = calcMacros(pending, pendingGrams); return <p style={{ fontSize: 11, color: 'var(--green-dark)', marginTop: 4 }}>{m.kcal} kcal · P:{m.proteins}g · C:{m.carbs}g · G:{m.fats}g</p> })()}
          </div>
        </form>
      ) : (
        <form onSubmit={doSearch} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input type="text" className="input-field" placeholder="Cerca ingrediente…" value={q} onChange={e => setQ(e.target.value)} style={{ flex: 1 }} autoComplete="off" />
          <button type="submit" className="btn btn-primary" style={{ padding: '0 14px', flexShrink: 0 }} disabled={busy || q.trim().length < 2}>
            {busy
              ? <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'block' }} />
              : <Search size={14} />}
          </button>
        </form>
      )}
      {!pending && res.length > 0 && (
        <div style={{ border: '1.5px solid var(--border)', borderRadius: 10, overflow: 'hidden', marginBottom: 8 }}>
          {res.slice(0, 8).map((f, i) => (
            <button key={`${f.id}_${i}`} onClick={() => select(f)} style={{ width: '100%', background: 'none', border: 'none', borderBottom: i < Math.min(res.length, 8) - 1 ? '1px solid var(--border-light)' : 'none', padding: '9px 12px', textAlign: 'left', cursor: 'pointer', font: 'inherit' }}>
              <p style={{ fontSize: 13, fontWeight: 500 }}>{f.name}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{f.kcal_100g} kcal · P:{f.proteins_100g} C:{f.carbs_100g} G:{f.fats_100g}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── LogModal ─────────────────────────────────────────────────────────────────
const MEAL_TYPES = [
  { val: 'colazione', label: 'Colazione' },
  { val: 'spuntino_mattina', label: 'Spunt. mattina' },
  { val: 'pranzo', label: 'Pranzo' },
  { val: 'spuntino_pomeriggio', label: 'Spunt. pomeriggio' },
  { val: 'cena', label: 'Cena' },
]

function LogModal({ recipe, userId, onClose }) {
  const [meal, setMeal] = useState('pranzo')
  const [portions, setPortions] = useState('1')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [saving, setSaving] = useState(false)

  const porz = parseInt(recipe.porzioni) || 1
  const num = Math.max(0.5, parseFloat(portions) || 1)
  const gramPerPortion = (recipe.peso_totale_g || 100) / porz
  const kcal = Math.round((recipe.calorie_porzione || 0) * num)
  const proteins = Math.round((recipe.proteine || 0) * num * 10) / 10
  const carbs = Math.round((recipe.carboidrati || 0) * num * 10) / 10
  const fats = Math.round((recipe.grassi || 0) * num * 10) / 10

  async function save() {
    setSaving(true)
    await supabase.from('food_logs').insert({
      user_id: userId, date, meal_type: meal,
      food_name: recipe.nome,
      grams: Math.round(gramPerPortion * num),
      kcal, proteins, carbs, fats,
      food_data: {
        id: `ricetta_${recipe.id}`, name: recipe.nome,
        brand: recipe.is_public ? '🌐 Ricetta condivisa' : '🍳 Ricetta',
        kcal_100g: recipe.kcal_100g, proteins_100g: recipe.proteins_100g,
        carbs_100g: recipe.carbs_100g, fats_100g: recipe.fats_100g,
        source: 'recipe',
      },
    })
    setSaving(false)
    onClose(true)
  }

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 2000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(false) }}>
      <div style={{ background: 'var(--surface)', borderRadius: '20px 20px 0 0', padding: '20px 16px calc(20px + env(safe-area-inset-bottom))', width: '100%', maxWidth: 520, maxHeight: '85vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
          <p style={{ fontSize: 16, fontWeight: 700, flex: 1 }}>Aggiungi al diario</p>
          <button onClick={() => onClose(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}><X size={18} /></button>
        </div>

        <div style={{ background: 'var(--green-pale)', borderRadius: 12, padding: '10px 14px', marginBottom: 14 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--green-dark)' }}>🍳 {recipe.nome}</p>
          <p style={{ fontSize: 12, color: 'var(--green-dark)', marginTop: 2 }}>{kcal} kcal · P:{proteins}g · C:{carbs}g · G:{fats}g</p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{num} porz. × {Math.round(gramPerPortion)}g</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          <div className="input-group">
            <label className="input-label">Porzioni</label>
            <input type="number" className="input-field" value={portions} onChange={e => setPortions(e.target.value)} min="0.5" step="0.5" inputMode="decimal" />
          </div>
          <div className="input-group">
            <label className="input-label">Data</label>
            <input type="date" className="input-field" value={date} onChange={e => setDate(e.target.value)} />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <p className="input-label" style={{ marginBottom: 8 }}>Pasto</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {MEAL_TYPES.map(m => (
              <button key={m.val} onClick={() => setMeal(m.val)} style={{ padding: '7px 13px', borderRadius: 100, border: `1.5px solid ${meal === m.val ? 'var(--green-main)' : 'var(--border)'}`, background: meal === m.val ? 'var(--green-pale)' : 'var(--surface)', color: meal === m.val ? 'var(--green-main)' : 'var(--text-secondary)', fontSize: 12, fontWeight: 600, cursor: 'pointer', font: 'inherit' }}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-primary btn-full" onClick={save} disabled={saving}>
          {saving ? 'Registrazione...' : '+ Registra nel diario'}
        </button>
      </div>
    </div>,
    document.body
  )
}

// ── RecipeCard ────────────────────────────────────────────────────────────────
function RecipeCard({ r, isOwn, expandedId, setExpandedId, setLogRecipe, onTogglePublic, onDelete }) {
  const isOpen = expandedId === r.id
  const tt = totalTime(r)

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <button onClick={() => setExpandedId(isOpen ? null : r.id)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '13px 14px', display: 'flex', alignItems: 'flex-start', gap: 10, font: 'inherit', textAlign: 'left' }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 20 }}>
          🍳
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap', marginBottom: 3 }}>
            <p style={{ fontSize: 14, fontWeight: 700 }}>{r.nome}</p>
            {r.is_public && <span style={{ fontSize: 9, background: '#dbeafe', color: '#1d4ed8', padding: '1px 6px', borderRadius: 100, fontWeight: 700, flexShrink: 0 }}>🌐 Pubblica</span>}
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            🔥 {r.calorie_porzione || 0} kcal · {r.porzioni || 1} porz.{tt > 0 ? ` · ⏱ ${fmtTime(tt)}` : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 2, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
          {isOwn && (
            <button onClick={() => onTogglePublic(r)} title={r.is_public ? 'Rendi privata' : 'Pubblica'} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: r.is_public ? '#1d4ed8' : 'var(--text-muted)' }}>
              {r.is_public ? <Globe size={15} /> : <Lock size={15} />}
            </button>
          )}
          <button onClick={() => setLogRecipe(r)} title="Aggiungi al diario" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: 'var(--green-main)' }}>
            <Plus size={15} />
          </button>
          {isOwn && (
            <button onClick={() => onDelete(r.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: 'var(--text-muted)' }}>
              <Trash2 size={15} />
            </button>
          )}
          {isOpen ? <ChevronUp size={15} color="var(--text-muted)" style={{ alignSelf: 'center' }} /> : <ChevronDown size={15} color="var(--text-muted)" style={{ alignSelf: 'center' }} />}
        </div>
      </button>

      {isOpen && (
        <div style={{ borderTop: '1px solid var(--border-light)', padding: '12px 14px 14px' }}>
          {/* Macros */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {[`🔥 ${r.calorie_porzione} kcal`, `P:${r.proteine}g`, `C:${r.carboidrati}g`, `G:${r.grassi}g`].map(v => (
              <span key={v} style={{ fontSize: 11, background: 'var(--surface-2)', padding: '2px 8px', borderRadius: 100, color: 'var(--text-secondary)' }}>{v}</span>
            ))}
            <span style={{ fontSize: 11, background: '#f1f5f9', padding: '2px 8px', borderRadius: 100, color: 'var(--text-muted)' }}>per porzione</span>
          </div>

          {/* Timing chips */}
          {(r.tempo_preparazione_min > 0 || r.tempo_cottura_min > 0 || r.tempo_raffreddamento_min > 0) && (
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 12 }}>
              {r.tempo_preparazione_min > 0 && <span style={{ fontSize: 11, background: '#fef9c3', color: '#854d0e', padding: '3px 9px', borderRadius: 100, fontWeight: 600 }}>⏱ Prep: {fmtTime(r.tempo_preparazione_min)}</span>}
              {r.tempo_cottura_min > 0 && <span style={{ fontSize: 11, background: '#fee2e2', color: '#991b1b', padding: '3px 9px', borderRadius: 100, fontWeight: 600 }}>🔥 Cottura: {fmtTime(r.tempo_cottura_min)}</span>}
              {r.tempo_raffreddamento_min > 0 && <span style={{ fontSize: 11, background: '#dbeafe', color: '#1e40af', padding: '3px 9px', borderRadius: 100, fontWeight: 600 }}>❄️ Riposo: {fmtTime(r.tempo_raffreddamento_min)}</span>}
            </div>
          )}

          {/* Ingredients */}
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ingredienti</p>
          {(r.ingredienti || []).map((ing, i, arr) => (
            <div key={i} style={{ display: 'flex', gap: 8, padding: '5px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
              <p style={{ flex: 1, fontSize: 13 }}>{ing.food_name}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', flexShrink: 0 }}>{ing.grams}g · {ing.kcal} kcal</p>
            </div>
          ))}

          {/* Preparation steps */}
          {(r.fasi_preparazione || []).length > 0 && (
            <>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginTop: 14, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Preparazione</p>
              {r.fasi_preparazione.map((step, i, arr) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border-light)' : 'none', alignItems: 'flex-start' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--green-main)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>
                    {i + 1}
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--text-primary)', flex: 1 }}>{step}</p>
                </div>
              ))}
            </>
          )}

          {r.note && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10, fontStyle: 'italic', lineHeight: 1.5 }}>📝 {r.note}</p>}

          <button className="btn btn-primary btn-full" onClick={() => setLogRecipe(r)} style={{ marginTop: 14 }}>
            + Aggiungi al diario
          </button>
        </div>
      )}
    </div>
  )
}

// ── RecipesPage ───────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  nome: '', porzioni: '4',
  tempo_preparazione_min: '', tempo_cottura_min: '', tempo_raffreddamento_min: '',
  ingredienti: [], fasi: [], note: '', is_public: false,
}

export default function RecipesPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState('mine')
  const [myRecipes, setMyRecipes] = useState([])
  const [publicRecipes, setPublicRecipes] = useState([])
  const [loadingMine, setLoadingMine] = useState(true)
  const [loadingPublic, setLoadingPublic] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [newStep, setNewStep] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [logRecipe, setLogRecipe] = useState(null)
  const [pubQuery, setPubQuery] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    setLoadingMine(true)
    supabase.from('ricette').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => { setMyRecipes(data || []); setLoadingMine(false) })
  }, [user.id])

  useEffect(() => {
    if (tab !== 'public') return
    setLoadingPublic(true)
    supabase.from('ricette').select('*').eq('is_public', true).neq('user_id', user.id)
      .order('created_at', { ascending: false }).limit(50)
      .then(({ data }) => { setPublicRecipes(data || []); setLoadingPublic(false) })
  }, [tab, user.id])

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(null), 2500) }

  async function saveRecipe() {
    if (!form.nome || form.ingredienti.length === 0) return
    setSaving(true)
    const t = sumIngredients(form.ingredienti)
    const peso = form.ingredienti.reduce((s, i) => s + (parseFloat(i.grams) || 0), 0)
    const porzioni = Math.max(1, parseInt(form.porzioni) || 1)
    const fibra = form.ingredienti.reduce((s, i) => s + (i.food_data?.fiber_100g || 0) * (i.grams || 0) / 100, 0)
    const { data } = await supabase.from('ricette').insert({
      nome: form.nome, porzioni,
      peso_totale_g: peso,
      kcal_100g: peso > 0 ? Math.round(t.kcal / peso * 100) : 0,
      proteins_100g: peso > 0 ? Math.round(t.proteins / peso * 1000) / 10 : 0,
      carbs_100g: peso > 0 ? Math.round(t.carbs / peso * 1000) / 10 : 0,
      fats_100g: peso > 0 ? Math.round(t.fats / peso * 1000) / 10 : 0,
      calorie_porzione: Math.round(t.kcal / porzioni),
      proteine: Math.round(t.proteins / porzioni * 10) / 10,
      carboidrati: Math.round(t.carbs / porzioni * 10) / 10,
      grassi: Math.round(t.fats / porzioni * 10) / 10,
      fibra: Math.round(fibra * 10) / 10,
      ingredienti: form.ingredienti,
      fasi_preparazione: form.fasi,
      tempo_preparazione_min: parseInt(form.tempo_preparazione_min) || 0,
      tempo_cottura_min: parseInt(form.tempo_cottura_min) || 0,
      tempo_raffreddamento_min: parseInt(form.tempo_raffreddamento_min) || 0,
      note: form.note,
      is_public: form.is_public,
    }).select().single()
    setSaving(false)
    if (data) {
      setMyRecipes(r => [data, ...r])
      setForm(EMPTY_FORM); setNewStep('')
      setShowCreate(false)
      showToast('Ricetta salvata!')
    }
  }

  async function deleteRecipe(id) {
    await supabase.from('ricette').delete().eq('id', id)
    setMyRecipes(r => r.filter(x => x.id !== id))
  }

  async function togglePublic(recipe) {
    const { data } = await supabase.from('ricette').update({ is_public: !recipe.is_public }).eq('id', recipe.id).select().single()
    if (data) setMyRecipes(r => r.map(x => x.id === recipe.id ? data : x))
  }

  function addStep() {
    if (!newStep.trim()) return
    setForm(f => ({ ...f, fasi: [...f.fasi, newStep.trim()] }))
    setNewStep('')
  }

  const filtered = publicRecipes.filter(r => !pubQuery || r.nome?.toLowerCase().includes(pubQuery.toLowerCase()))

  // live macro preview inside form
  const formTotals = sumIngredients(form.ingredienti)
  const formPeso = form.ingredienti.reduce((s, i) => s + (parseFloat(i.grams) || 0), 0)
  const formPorz = Math.max(1, parseInt(form.porzioni) || 1)

  return (
    <div className="page">
      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg, #b45309, #d97706)', padding: 'calc(env(safe-area-inset-top) + 18px) 16px 22px', flexShrink: 0 }}>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, marginBottom: 4 }}>Cucina</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'white', fontWeight: 300, flex: 1 }}>Ricette</h1>
          <button onClick={() => { setShowCreate(v => !v); setTab('mine') }}
            style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.2)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', flexShrink: 0 }}>
            {showCreate ? <X size={18} /> : <Plus size={18} />}
          </button>
        </div>
        <div style={{ display: 'flex', gap: 7 }}>
          {[['mine', '👨‍🍳 Le mie'], ['public', '🌐 Pubbliche']].map(([val, label]) => (
            <button key={val} onClick={() => setTab(val)} style={{ padding: '7px 14px', borderRadius: 100, background: tab === val ? 'white' : 'rgba(255,255,255,0.18)', color: tab === val ? '#b45309' : 'white', border: 'none', font: 'inherit', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '14px 14px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* ── CREATE FORM ── */}
        {showCreate && (
          <div className="card animate-slideUp" style={{ padding: 16 }}>
            <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Nuova ricetta</p>

            {/* Nome + porzioni */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10, marginBottom: 12 }}>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Nome ricetta *</label>
                <input className="input-field" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="es. Pasta al pomodoro" />
              </div>
              <div className="input-group">
                <label className="input-label">Porzioni</label>
                <input type="number" className="input-field" value={form.porzioni} onChange={e => setForm(f => ({ ...f, porzioni: e.target.value }))} min={1} inputMode="numeric" />
              </div>
            </div>

            {/* Tempi */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
              <div className="input-group">
                <label className="input-label">⏱ Prep (min)</label>
                <input type="number" className="input-field" value={form.tempo_preparazione_min} onChange={e => setForm(f => ({ ...f, tempo_preparazione_min: e.target.value }))} min={0} inputMode="numeric" placeholder="0" />
              </div>
              <div className="input-group">
                <label className="input-label">🔥 Cottura</label>
                <input type="number" className="input-field" value={form.tempo_cottura_min} onChange={e => setForm(f => ({ ...f, tempo_cottura_min: e.target.value }))} min={0} inputMode="numeric" placeholder="0" />
              </div>
              <div className="input-group">
                <label className="input-label">❄️ Riposo</label>
                <input type="number" className="input-field" value={form.tempo_raffreddamento_min} onChange={e => setForm(f => ({ ...f, tempo_raffreddamento_min: e.target.value }))} min={0} inputMode="numeric" placeholder="0" />
              </div>
            </div>

            {/* Ingredienti */}
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ingredienti *</p>
            <IngredientSearch onAdd={ing => setForm(f => ({ ...f, ingredienti: [...f.ingredienti, ing] }))} />
            {form.ingredienti.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                {form.ingredienti.map((ing, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500 }}>{ing.food_name}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{ing.grams}g · {ing.kcal} kcal</p>
                    </div>
                    <button onClick={() => setForm(f => ({ ...f, ingredienti: f.ingredienti.filter((_, i) => i !== idx) }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <div style={{ marginTop: 9, background: 'var(--green-pale)', borderRadius: 10, padding: '10px 13px' }}>
                  <p style={{ fontSize: 12, color: 'var(--green-dark)', fontWeight: 600 }}>Totale ({Math.round(formPeso)}g): {formTotals.kcal} kcal</p>
                  <p style={{ fontSize: 11, color: 'var(--green-dark)', marginTop: 3 }}>Per porzione: {Math.round(formTotals.kcal / formPorz)} kcal · P:{Math.round(formTotals.proteins / formPorz * 10) / 10}g · C:{Math.round(formTotals.carbs / formPorz * 10) / 10}g · G:{Math.round(formTotals.fats / formPorz * 10) / 10}g</p>
                </div>
              </div>
            )}

            {/* Fasi preparazione */}
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fasi di preparazione</p>
            {form.fasi.map((step, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '7px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--green-main)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>
                  {idx + 1}
                </div>
                <p style={{ flex: 1, fontSize: 13, lineHeight: 1.4, color: 'var(--text-primary)' }}>{step}</p>
                <button onClick={() => setForm(f => ({ ...f, fasi: f.fasi.filter((_, i) => i !== idx) }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, flexShrink: 0 }}>
                  <X size={14} />
                </button>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 8, marginBottom: 14 }}>
              <input className="input-field" value={newStep} onChange={e => setNewStep(e.target.value)}
                placeholder="Descrivi una fase…"
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addStep() } }}
                style={{ flex: 1 }} />
              <button className="btn btn-primary" onClick={addStep} style={{ padding: '0 14px', flexShrink: 0 }} disabled={!newStep.trim()}>
                <Plus size={14} />
              </button>
            </div>

            {/* Note */}
            <div className="input-group" style={{ marginBottom: 14 }}>
              <label className="input-label">Note (opzionale)</label>
              <textarea className="input-field" rows={2} value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Varianti, consigli, sostituzioni…" style={{ resize: 'vertical' }} />
            </div>

            {/* Toggle pubblico */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: form.is_public ? '#dbeafe' : 'var(--surface-2)', borderRadius: 12, marginBottom: 14, cursor: 'pointer' }}
              onClick={() => setForm(f => ({ ...f, is_public: !f.is_public }))}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: form.is_public ? '#1d4ed8' : 'var(--text-secondary)' }}>
                  {form.is_public ? '🌐 Ricetta pubblica' : '🔒 Ricetta privata'}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  {form.is_public ? 'Visibile a tutti gli utenti' : 'Visibile solo a te'}
                </p>
              </div>
              <div style={{ width: 40, height: 22, borderRadius: 100, background: form.is_public ? '#3b82f6' : 'var(--border)', transition: 'background 0.2s', position: 'relative', flexShrink: 0 }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: form.is_public ? 21 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
              </div>
            </div>

            <button className="btn btn-primary btn-full" onClick={saveRecipe} disabled={saving || !form.nome || form.ingredienti.length === 0}>
              {saving ? 'Salvataggio...' : '✓ Salva ricetta'}
            </button>
          </div>
        )}

        {/* ── LE MIE RICETTE ── */}
        {tab === 'mine' && (
          loadingMine
            ? <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: 13 }}>Caricamento...</div>
            : myRecipes.length === 0 && !showCreate
              ? (
                <div style={{ textAlign: 'center', padding: '50px 0 30px', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: 52, marginBottom: 12 }}>🍳</div>
                  <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Nessuna ricetta</p>
                  <p style={{ fontSize: 12, lineHeight: 1.7 }}>Crea la tua prima ricetta e calcola<br />i macro automaticamente</p>
                  <button className="btn btn-primary" onClick={() => setShowCreate(true)} style={{ marginTop: 16 }}>
                    + Crea ricetta
                  </button>
                </div>
              )
              : myRecipes.map(r => (
                <RecipeCard key={r.id} r={r} isOwn expandedId={expandedId} setExpandedId={setExpandedId}
                  setLogRecipe={setLogRecipe} onTogglePublic={togglePublic} onDelete={deleteRecipe} />
              ))
        )}

        {/* ── PUBBLICHE ── */}
        {tab === 'public' && (
          <>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input-field" placeholder="Cerca ricette pubbliche…" value={pubQuery} onChange={e => setPubQuery(e.target.value)} style={{ flex: 1 }} />
              {pubQuery && <button onClick={() => setPubQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0 8px' }}><X size={16} /></button>}
            </div>
            {loadingPublic
              ? <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: 13 }}>Caricamento...</div>
              : filtered.length === 0
                ? (
                  <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: 52, marginBottom: 12 }}>🌐</div>
                    <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
                      {pubQuery ? 'Nessun risultato' : 'Nessuna ricetta pubblica'}
                    </p>
                    <p style={{ fontSize: 12 }}>
                      {pubQuery ? 'Prova un termine diverso' : 'Sii il primo a condividere una ricetta!'}
                    </p>
                  </div>
                )
                : filtered.map(r => (
                  <RecipeCard key={r.id} r={r} isOwn={false} expandedId={expandedId} setExpandedId={setExpandedId}
                    setLogRecipe={setLogRecipe} onTogglePublic={togglePublic} onDelete={deleteRecipe} />
                ))
            }
          </>
        )}

        <div style={{ height: 16 }} />
      </div>

      {/* Diary log modal */}
      {logRecipe && (
        <LogModal recipe={logRecipe} userId={user.id} onClose={saved => { setLogRecipe(null); if (saved) showToast('Registrato nel diario! ✓') }} />
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)', background: '#1e293b', color: 'white', padding: '10px 20px', borderRadius: 100, fontSize: 13, fontWeight: 600, zIndex: 3000, boxShadow: '0 4px 20px rgba(0,0,0,0.3)', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
          {toast}
        </div>
      )}
    </div>
  )
}
