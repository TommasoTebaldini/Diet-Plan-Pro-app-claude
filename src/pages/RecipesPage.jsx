import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { searchFoods } from '../lib/foodSearch'
import { Search, Plus, X, Trash2, ChevronDown, ChevronUp, Globe, Lock, Bookmark, Pencil } from 'lucide-react'

// ── helpers ──────────────────────────────────────────────────────────────────

// Defensive parse: ingredienti/fasi_preparazione can be a JSON string if the DB
// column was TEXT when the row was first inserted (admin-app table schema conflict).
function safeArray(v) {
  if (Array.isArray(v)) return v
  if (typeof v === 'string' && v.trim()) {
    try { const p = JSON.parse(v); return Array.isArray(p) ? p : [] } catch { return [] }
  }
  return []
}

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

function recipeToForm(r) {
  return {
    nome: r.nome || '',
    porzioni: String(r.porzioni || 4),
    tempo_preparazione_min: r.tempo_preparazione_min ? String(r.tempo_preparazione_min) : '',
    tempo_cottura_min: r.tempo_cottura_min ? String(r.tempo_cottura_min) : '',
    tempo_raffreddamento_min: r.tempo_raffreddamento_min ? String(r.tempo_raffreddamento_min) : '',
    ingredienti: safeArray(r.ingredienti),
    fasi: safeArray(r.fasi_preparazione),
    note: r.note || '',
    is_public: r.is_public || false,
  }
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

  useEffect(() => {
    const trimmed = q.trim()
    if (trimmed.length < 2) { setRes([]); return }
    const timer = setTimeout(async () => {
      setBusy(true)
      setRes(await searchFoods(trimmed))
      setBusy(false)
    }, 350)
    return () => clearTimeout(timer)
  }, [q])

  async function doSearch(e) {
    e?.preventDefault()
    const trimmed = q.trim()
    if (!trimmed || trimmed.length < 2) return
    setBusy(true); setRes([])
    setRes(await searchFoods(trimmed))
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

// ── RecipeCard ────────────────────────────────────────────────────────────────
function RecipeCard({ r, isOwn, expandedId, setExpandedId, onSave, onTogglePublic, onDelete, onEdit }) {
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
          {!isOwn && (
            <button onClick={() => onSave(r)} title="Salva nelle mie ricette" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: 'var(--green-main)' }}>
              <Bookmark size={15} />
            </button>
          )}
          {isOwn && (
            <button onClick={() => onEdit(r)} title="Modifica ricetta" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: 'var(--text-muted)' }}>
              <Pencil size={15} />
            </button>
          )}
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
          {safeArray(r.ingredienti).map((ing, i, arr) => (
            <div key={i} style={{ display: 'flex', gap: 8, padding: '5px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
              <p style={{ flex: 1, fontSize: 13 }}>{ing.food_name}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', flexShrink: 0 }}>{ing.grams}g · {ing.kcal} kcal</p>
            </div>
          ))}

          {/* Preparation steps */}
          {safeArray(r.fasi_preparazione).length > 0 && (
            <>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginTop: 14, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Preparazione</p>
              {safeArray(r.fasi_preparazione).map((step, i, arr) => (
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

          {!isOwn && (
            <button className="btn btn-primary btn-full" onClick={() => onSave(r)} style={{ marginTop: 14 }}>
              + Salva nelle mie ricette
            </button>
          )}
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
  const [pubQuery, setPubQuery] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [editingRecipe, setEditingRecipe] = useState(null)

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
    const payload = {
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
    }
    if (editingRecipe) {
      const { data, error } = await supabase.from('ricette').update(payload).eq('id', editingRecipe.id).select().single()
      setSaving(false)
      if (error) { showToast('Errore nel salvataggio'); return }
      if (data) {
        setMyRecipes(r => r.map(x => x.id === data.id ? data : x))
        setEditingRecipe(null)
        setForm(EMPTY_FORM); setNewStep('')
        setShowCreate(false)
        showToast('Ricetta aggiornata!')
      }
    } else {
      const { data, error } = await supabase.from('ricette').insert({ user_id: user.id, ...payload }).select().single()
      setSaving(false)
      if (error) { showToast('Errore nel salvataggio'); return }
      if (data) {
        setMyRecipes(r => [data, ...r])
        setTab('mine')
        setForm(EMPTY_FORM); setNewStep('')
        setShowCreate(false)
        showToast('Ricetta salvata!')
      }
    }
  }

  function handleEditRecipe(r) {
    setEditingRecipe(r)
    setForm(recipeToForm(r))
    setShowCreate(true)
    setTab('mine')
  }

  async function deleteRecipe(id) {
    await supabase.from('ricette').delete().eq('id', id)
    setMyRecipes(r => r.filter(x => x.id !== id))
  }

  async function savePublicRecipe(recipe) {
    const { data, error } = await supabase.from('ricette').insert({
      user_id: user.id,
      nome: recipe.nome, porzioni: recipe.porzioni,
      peso_totale_g: recipe.peso_totale_g,
      kcal_100g: recipe.kcal_100g, proteins_100g: recipe.proteins_100g,
      carbs_100g: recipe.carbs_100g, fats_100g: recipe.fats_100g,
      calorie_porzione: recipe.calorie_porzione,
      proteine: recipe.proteine, carboidrati: recipe.carboidrati, grassi: recipe.grassi,
      fibra: recipe.fibra,
      ingredienti: safeArray(recipe.ingredienti),
      fasi_preparazione: safeArray(recipe.fasi_preparazione),
      tempo_preparazione_min: recipe.tempo_preparazione_min || 0,
      tempo_cottura_min: recipe.tempo_cottura_min || 0,
      tempo_raffreddamento_min: recipe.tempo_raffreddamento_min || 0,
      note: recipe.note, is_public: false,
    }).select().single()
    if (error) { showToast('Errore nel salvataggio'); return }
    if (data) { setMyRecipes(r => [data, ...r]); showToast('Ricetta salvata nelle tue ricette! ✓') }
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
          <button onClick={() => {
            const next = !showCreate
            setShowCreate(next)
            if (!next) { setEditingRecipe(null); setForm(EMPTY_FORM); setNewStep('') }
            setTab('mine')
          }}
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
            <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>{editingRecipe ? 'Modifica ricetta' : 'Nuova ricetta'}</p>

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
              {saving ? 'Salvataggio...' : editingRecipe ? '✓ Aggiorna ricetta' : '✓ Salva ricetta'}
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
                  onSave={savePublicRecipe} onTogglePublic={togglePublic} onDelete={deleteRecipe} onEdit={handleEditRecipe} />
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
                    onSave={savePublicRecipe} onTogglePublic={togglePublic} onDelete={deleteRecipe} />
                ))
            }
          </>
        )}

        <div style={{ height: 16 }} />
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)', background: '#1e293b', color: 'white', padding: '10px 20px', borderRadius: 100, fontSize: 13, fontWeight: 600, zIndex: 3000, boxShadow: '0 4px 20px rgba(0,0,0,0.3)', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
          {toast}
        </div>
      )}
    </div>
  )
}
