import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { searchFoods, searchFoodsLocal } from '../lib/foodSearch'
import ProGate from '../components/ProGate'
import { useSubscription } from '../hooks/useSubscription'
import { Search, Plus, X, Trash2, ChevronDown, ChevronUp, Globe, Lock, Bookmark, Pencil, Heart, SlidersHorizontal, Camera } from 'lucide-react'
import { useT } from '../i18n'

const FREE_RECIPES_LIMIT = 5

// ── helpers ──────────────────────────────────────────────────────────────────

function safeArray(v) {
  if (Array.isArray(v)) return v
  if (typeof v === 'string' && v.trim()) {
    try { const p = JSON.parse(v); return Array.isArray(p) ? p : [] } catch { return [] }
  }
  return []
}

const r1 = v => Math.round((+v || 0) * 10) / 10
const r0 = v => Math.round(+v || 0)

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

// Totals shared by the manual recipe form AND the "save a dietitian-shared
// recipe" flow below, so both compute nutrition the exact same way.
function computeRecipeTotals(ingredienti, porzioniRaw) {
  const totals = sumIngredients(ingredienti)
  const peso = ingredienti.reduce((s, i) => s + (parseFloat(i.grams) || 0), 0)
  const porzioni = Math.max(1, parseInt(porzioniRaw) || 1)
  const fibra = ingredienti.reduce((s, i) => s + (i.food_data?.fiber_100g || 0) * (i.grams || 0) / 100, 0)
  return {
    peso_totale_g: peso,
    kcal_100g: peso > 0 ? Math.round(totals.kcal / peso * 100) : 0,
    proteins_100g: peso > 0 ? Math.round(totals.proteins / peso * 1000) / 10 : 0,
    carbs_100g: peso > 0 ? Math.round(totals.carbs / peso * 1000) / 10 : 0,
    fats_100g: peso > 0 ? Math.round(totals.fats / peso * 1000) / 10 : 0,
    calorie_porzione: Math.round(totals.kcal / porzioni),
    proteine: Math.round(totals.proteins / porzioni * 10) / 10,
    carboidrati: Math.round(totals.carbs / porzioni * 10) / 10,
    grassi: Math.round(totals.fats / porzioni * 10) / 10,
    fibra: Math.round(fibra * 10) / 10,
  }
}

// A dietitian-shared recipe only carries {nome, qt} per ingredient (no
// macros — see ricette.html's condividiRicetta in NutriPlan-Pro) — resolve
// each ingredient against the local food database so "Salva nelle mie
// ricette" ends up with real nutrition instead of hardcoded zeros.
async function resolveSharedIngredient(nome, qt) {
  const grams = parseFloat(qt) || 100
  const name = (nome || '').trim()
  if (!name) return { food_name: nome || '', grams, kcal: 0, proteins: 0, carbs: 0, fats: 0 }
  const results = await searchFoodsLocal(name)
  const lower = name.toLowerCase()
  const food = results.find(f => (f.name || '').toLowerCase() === lower) || results[0]
  if (!food) return { food_name: name, grams, kcal: 0, proteins: 0, carbs: 0, fats: 0 }
  return { food_name: food.name, food_data: food, grams, ...calcMacros(food, grams) }
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
    photo_url: r.photo_url || '',
  }
}

function fmtTime(min) {
  if (!min || min <= 0) return null
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60), m = min % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

// ── Allergen keyword map ──────────────────────────────────────────────────────
const ALLERGEN_KEYWORDS = {
  'Glutine':      ['grano', 'farina', 'pasta', 'pane', 'glutine', 'orzo', 'segale', 'avena', 'semola', 'crackers', 'grissini', 'cous cous'],
  'Lattosio':     ['latte', 'lattosio', 'panna', 'burro', 'formaggio', 'yogurt', 'mozzarella', 'ricotta', 'parmigiano', 'pecorino'],
  'Uova':         ['uovo', 'uova', 'albume', 'tuorlo', 'maionese'],
  'Pesce':        ['pesce', 'salmone', 'tonno', 'merluzzo', 'trota', 'branzino', 'orata', 'acciughe', 'sardine', 'gamberi', 'cozze', 'vongole', 'polpo', 'calamari', 'baccala'],
  'Frutta secca': ['noci', 'mandorle', 'nocciole', 'pistacchi', 'anacardi', 'arachidi', 'pinoli', 'nocciolina'],
  'Soia':         ['soia', 'tofu', 'edamame', 'miso', 'tempeh'],
}

function recipeMatchesAllergen(recipe, allergen) {
  const keywords = ALLERGEN_KEYWORDS[allergen] || []
  const textToSearch = [
    recipe.nome || '',
    recipe.note || '',
    ...safeArray(recipe.ingredienti).map(i => i.food_name || ''),
  ].join(' ').toLowerCase()
  return keywords.some(kw => textToSearch.includes(kw))
}

// ── localStorage favorites ────────────────────────────────────────────────────
function getFavIds() {
  try { return JSON.parse(localStorage.getItem('fav_recipes') || '[]') } catch { return [] }
}
function toggleFavId(id) {
  const ids = getFavIds()
  const next = ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]
  localStorage.setItem('fav_recipes', JSON.stringify(next))
  return next
}

// ── EMPTY_FILTERS ─────────────────────────────────────────────────────────────
const EMPTY_FILTERS = {
  search: '',
  kcalMax: '',
  protMin: '',
  timeMax: 'all',
  allergens: [],
}

// ── IngredientSearch ──────────────────────────────────────────────────────────
function IngredientSearch({ onAdd }) {
  const t = useT()
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
                <label className="input-label">{t('food.quantity_g')}</label>
                <input type="number" className="input-field" value={pendingGrams} onChange={e => setPendingGrams(e.target.value)} min={1} inputMode="decimal" autoFocus />
              </div>
              <button type="submit" className="btn btn-primary" style={{ flexShrink: 0, height: 42 }}>{t('common.add')}</button>
              <button type="button" onClick={() => setPending(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: 'var(--text-muted)', height: 42, display: 'flex', alignItems: 'center' }}>
                <X size={15} />
              </button>
            </div>
            {(() => { const m = calcMacros(pending, pendingGrams); return <p style={{ fontSize: 11, color: 'var(--green-dark)', marginTop: 4 }}>{m.kcal} kcal · P:{m.proteins}g · C:{m.carbs}g · G:{m.fats}g</p> })()}
          </div>
        </form>
      ) : (
        <form onSubmit={doSearch} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input type="text" className="input-field" placeholder={t('recipes.search_ingredient')} value={q} onChange={e => setQ(e.target.value)} style={{ flex: 1 }} autoComplete="off" />
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
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{r0(f.kcal_100g)} kcal · P:{r1(f.proteins_100g)} C:{r1(f.carbs_100g)} G:{r1(f.fats_100g)}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── RecipeCard ────────────────────────────────────────────────────────────────
function RecipeCard({ r, isOwn, isDietitian, expandedId, setExpandedId, onSave, onTogglePublic, onDelete, onEdit, favIds, onToggleFav }) {
  const isOpen = expandedId === r.id
  const tt = totalTime(r)
  const isFav = favIds?.includes(r.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <button onClick={() => setExpandedId(isOpen ? null : r.id)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '13px 14px', display: 'flex', alignItems: 'flex-start', gap: 10, font: 'inherit', textAlign: 'left' }}>
        {r.photo_url ? (
          <img src={r.photo_url} alt="" loading="lazy" style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
        ) : (
          <div style={{ width: 40, height: 40, borderRadius: 10, background: isDietitian ? 'linear-gradient(135deg, #0891b2, #0e7490)' : 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 20 }}>
            {isDietitian ? '🩺' : '🍳'}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap', marginBottom: 3 }}>
            <p style={{ fontSize: 14, fontWeight: 700 }}>{r.nome}</p>
            {isDietitian && <span style={{ fontSize: 9, background: '#cffafe', color: '#0e7490', padding: '1px 6px', borderRadius: 100, fontWeight: 700, flexShrink: 0 }}>🩺 Dietista</span>}
            {!isDietitian && r.is_public && <span style={{ fontSize: 9, background: '#dbeafe', color: '#1d4ed8', padding: '1px 6px', borderRadius: 100, fontWeight: 700, flexShrink: 0 }}>🌐 Pubblica</span>}
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            🔥 {r.calorie_porzione || 0} kcal · {r.porzioni || 1} porz.{tt > 0 ? ` · ⏱ ${fmtTime(tt)}` : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 2, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
          {/* Dietitian tab: favourite toggle only */}
          {isDietitian && (
            <button onClick={() => onToggleFav(r.id)} title={isFav ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 10, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: isFav ? '#e11d48' : 'var(--text-muted)' }}>
              <Heart size={15} fill={isFav ? '#e11d48' : 'none'} />
            </button>
          )}
          {/* Own recipe controls */}
          {isOwn && (
            <button onClick={() => onTogglePublic(r)} title={r.is_public ? 'Rendi privata' : 'Pubblica'} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 10, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: r.is_public ? '#1d4ed8' : 'var(--text-muted)' }}>
              {r.is_public ? <Globe size={15} /> : <Lock size={15} />}
            </button>
          )}
          {!isOwn && !isDietitian && (
            <button onClick={() => onSave(r)} title="Salva nelle mie ricette" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 10, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-main)' }}>
              <Bookmark size={15} />
            </button>
          )}
          {isOwn && (
            <button onClick={() => onEdit(r)} title="Modifica ricetta" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 10, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <Pencil size={15} />
            </button>
          )}
          {isOwn && (
            <button onClick={() => onDelete(r.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 10, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
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

          {!isOwn && !isDietitian && (
            <button className="btn btn-primary btn-full" onClick={() => onSave(r)} style={{ marginTop: 14 }}>
              + Salva nelle mie ricette
            </button>
          )}
          {isDietitian && (
            <button className="btn btn-full" onClick={() => onToggleFav(r.id)} style={{ marginTop: 14, background: isFav ? '#fce7f3' : 'var(--surface-2)', color: isFav ? '#9d174d' : 'var(--text-secondary)', border: 'none', borderRadius: 10, padding: '10px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
              {isFav ? '♥ Rimossa dai preferiti' : '♡ Aggiungi ai preferiti'}
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}

// ── AdvancedFilters ───────────────────────────────────────────────────────────
function AdvancedFilters({ filters, onChange, onReset }) {
  const [open, setOpen] = useState(false)
  const allergenList = Object.keys(ALLERGEN_KEYWORDS)
  const hasActive = filters.kcalMax || filters.protMin || filters.timeMax !== 'all' || filters.allergens.length > 0

  function toggleAllergen(a) {
    const next = filters.allergens.includes(a)
      ? filters.allergens.filter(x => x !== a)
      : [...filters.allergens, a]
    onChange({ ...filters, allergens: next })
  }

  return (
    <div style={{ marginBottom: 4 }}>
      {/* Search row */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            className="input-field"
            placeholder="Cerca per nome…"
            value={filters.search}
            onChange={e => onChange({ ...filters, search: e.target.value })}
            style={{ paddingLeft: 32, flex: 1 }}
          />
          {filters.search && (
            <button onClick={() => onChange({ ...filters, search: '' })} style={{ position: 'absolute', right: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}>
              <X size={13} />
            </button>
          )}
        </div>
        <button
          onClick={() => setOpen(o => !o)}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0 12px', background: hasActive ? 'var(--green-main)' : 'var(--surface-2)', color: hasActive ? 'white' : 'var(--text-secondary)', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 600, height: 42, flexShrink: 0 }}>
          <SlidersHorizontal size={14} />
          Filtri{hasActive ? ` (${[filters.kcalMax ? 1 : 0, filters.protMin ? 1 : 0, filters.timeMax !== 'all' ? 1 : 0, filters.allergens.length].reduce((a, b) => a + b, 0)})` : ''}
        </button>
      </div>

      {open && (
        <div className="card animate-slideUp" style={{ padding: '14px 14px 10px', marginBottom: 8 }}>
          {/* Kcal + Proteine */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <div className="input-group">
              <label className="input-label">Kcal max (per porzione)</label>
              <input
                type="number"
                className="input-field"
                placeholder="es. 500"
                value={filters.kcalMax}
                onChange={e => onChange({ ...filters, kcalMax: e.target.value })}
                min={0}
                inputMode="numeric"
              />
            </div>
            <div className="input-group">
              <label className="input-label">Proteine min (g)</label>
              <input
                type="number"
                className="input-field"
                placeholder="es. 20"
                value={filters.protMin}
                onChange={e => onChange({ ...filters, protMin: e.target.value })}
                min={0}
                inputMode="numeric"
              />
            </div>
          </div>

          {/* Tempo */}
          <div className="input-group" style={{ marginBottom: 12 }}>
            <label className="input-label">Tempo totale</label>
            <select
              className="input-field"
              value={filters.timeMax}
              onChange={e => onChange({ ...filters, timeMax: e.target.value })}
            >
              <option value="all">Tutti</option>
              <option value="15">≤ 15 min</option>
              <option value="30">≤ 30 min</option>
              <option value="45">≤ 45 min</option>
              <option value="60">≤ 60 min</option>
              <option value="60+">Oltre 60 min</option>
            </select>
          </div>

          {/* Allergie */}
          <div style={{ marginBottom: 10 }}>
            <p className="input-label" style={{ marginBottom: 7 }}>Escludi allergeni</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {allergenList.map(a => {
                const active = filters.allergens.includes(a)
                return (
                  <button
                    key={a}
                    onClick={() => toggleAllergen(a)}
                    style={{ padding: '5px 11px', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: active ? '1.5px solid #dc2626' : '1.5px solid var(--border)', background: active ? '#fee2e2' : 'var(--surface-2)', color: active ? '#dc2626' : 'var(--text-secondary)', transition: 'all 0.15s' }}>
                    {active ? '✕ ' : ''}{a}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Reset */}
          {hasActive && (
            <button onClick={onReset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--green-main)', fontSize: 13, fontWeight: 600, padding: '4px 0', display: 'flex', alignItems: 'center', gap: 5 }}>
              <X size={13} /> Azzera filtri
            </button>
          )}
        </div>
      )}

      {/* Sort */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>Ordina per:</p>
        <select
          className="input-field"
          style={{ flex: 1, fontSize: 12, height: 36, padding: '0 10px' }}
          value={filters.sort || 'recent'}
          onChange={e => onChange({ ...filters, sort: e.target.value })}
        >
          <option value="recent">Più recenti</option>
          <option value="fast">Più veloci</option>
          <option value="lowcal">Meno calorie</option>
          <option value="highprot">Più proteine</option>
          <option value="alpha">Nome A-Z</option>
        </select>
      </div>
    </div>
  )
}

// ── applyFiltersAndSort ───────────────────────────────────────────────────────
function applyFiltersAndSort(recipes, filters) {
  let out = recipes

  if (filters.search) {
    const q = filters.search.toLowerCase()
    out = out.filter(r => r.nome?.toLowerCase().includes(q))
  }

  if (filters.kcalMax) {
    const max = parseFloat(filters.kcalMax)
    out = out.filter(r => (r.calorie_porzione || 0) <= max)
  }

  if (filters.protMin) {
    const min = parseFloat(filters.protMin)
    out = out.filter(r => (r.proteine || 0) >= min)
  }

  if (filters.timeMax && filters.timeMax !== 'all') {
    if (filters.timeMax === '60+') {
      out = out.filter(r => totalTime(r) > 60)
    } else {
      const max = parseInt(filters.timeMax)
      out = out.filter(r => {
        const tt = totalTime(r)
        return tt > 0 && tt <= max
      })
    }
  }

  if (filters.allergens && filters.allergens.length > 0) {
    out = out.filter(r => !filters.allergens.some(a => recipeMatchesAllergen(r, a)))
  }

  const sort = filters.sort || 'recent'
  if (sort === 'recent') out = [...out].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  else if (sort === 'fast') out = [...out].sort((a, b) => totalTime(a) - totalTime(b))
  else if (sort === 'lowcal') out = [...out].sort((a, b) => (a.calorie_porzione || 0) - (b.calorie_porzione || 0))
  else if (sort === 'highprot') out = [...out].sort((a, b) => (b.proteine || 0) - (a.proteine || 0))
  else if (sort === 'alpha') out = [...out].sort((a, b) => (a.nome || '').localeCompare(b.nome || '', 'it'))

  return out
}

// ── SharedRecipeCard ──────────────────────────────────────────────────────────
function SharedRecipeCard({ sr, onSave, onMarkViewed }) {
  const [open, setOpen] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const rd = sr.recipe_data || {}
  const ing = Array.isArray(rd.ingredienti) ? rd.ingredienti : []
  const isNew = !sr.viewed_at
  const sharedDate = sr.shared_at ? new Date(sr.shared_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }) : ''

  function toggle() {
    setOpen(o => !o)
    if (!open) onMarkViewed()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="card" style={{ padding: 0, overflow: 'hidden', border: isNew ? '2px solid #0891b2' : undefined }}>
      <button onClick={toggle} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '13px 14px', display: 'flex', alignItems: 'flex-start', gap: 10, font: 'inherit', textAlign: 'left' }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #0891b2, #0e7490)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 20 }}>
          🩺
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap', marginBottom: 3 }}>
            <p style={{ fontSize: 14, fontWeight: 700 }}>{rd.nome || 'Ricetta'}</p>
            {isNew && <span style={{ fontSize: 9, background: '#0891b2', color: 'white', padding: '1px 6px', borderRadius: 100, fontWeight: 700, flexShrink: 0 }}>NUOVA</span>}
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            🩺 Dal dietista · {rd.porzioni || 1} porz. · {ing.length} ingredienti{sharedDate ? ` · ${sharedDate}` : ''}
          </p>
        </div>
        {open ? <ChevronUp size={15} color="var(--text-muted)" style={{ alignSelf: 'center', flexShrink: 0 }} /> : <ChevronDown size={15} color="var(--text-muted)" style={{ alignSelf: 'center', flexShrink: 0 }} />}
      </button>

      {open && (
        <div style={{ borderTop: '1px solid var(--border-light)', padding: '12px 14px 14px' }}>
          {rd.note && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, fontStyle: 'italic', lineHeight: 1.5, background: '#f8fafc', borderRadius: 8, padding: '8px 10px' }}>📝 {rd.note}</p>}

          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ingredienti ({rd.porzioni || 1} porz.)</p>
          {ing.length === 0
            ? <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Nessun ingrediente</p>
            : ing.map((i, idx, arr) => {
              const name = i.nome || i.food_name || '—'
              const qty = i.qt || i.grams
              return (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: idx < arr.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                  <p style={{ fontSize: 13, flex: 1 }}>{name}</p>
                  {qty && <span style={{ fontSize: 12, color: '#0e7490', fontWeight: 700, flexShrink: 0, background: '#cffafe', padding: '1px 8px', borderRadius: 100 }}>{qty}g</span>}
                </div>
              )
            })}

          {saved ? (
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 10, padding: '10px 16px', color: '#15803d', fontWeight: 700, fontSize: 13 }}>
              ✓ Salvata nelle tue ricette
            </div>
          ) : (
            <button
              className="btn btn-full"
              disabled={saving}
              onClick={async () => { setSaving(true); await onSave(); setSaving(false); setSaved(true) }}
              style={{ marginTop: 14, background: '#ecfeff', color: '#0e7490', border: '1.5px solid #a5f3fc', borderRadius: 10, padding: '10px 16px', cursor: saving ? 'default' : 'pointer', fontWeight: 600, fontSize: 13, opacity: saving ? 0.7 : 1 }}
            >
              {saving ? 'Calcolo valori nutrizionali…' : '+ Salva nelle mie ricette'}
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}

// ── RecipesPage ───────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  nome: '', porzioni: '4',
  tempo_preparazione_min: '', tempo_cottura_min: '', tempo_raffreddamento_min: '',
  ingredienti: [], fasi: [], note: '', is_public: false, photo_url: '',
}

export default function RecipesPage() {
  const { user } = useAuth()
  const { isPro } = useSubscription()
  const t = useT()
  const [tab, setTab] = useState('mine')
  const [myRecipes, setMyRecipes] = useState([])
  const [publicRecipes, setPublicRecipes] = useState([])
  const [sharedRecipes, setSharedRecipes] = useState([])
  const [loadingMine, setLoadingMine] = useState(true)
  const [loadingPublic, setLoadingPublic] = useState(false)
  const [loadingDietist, setLoadingDietist] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [newStep, setNewStep] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [pubQuery, setPubQuery] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [editingRecipe, setEditingRecipe] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const photoInputRef = React.useRef(null)

  // Filters (shared between mine + public tabs)
  const [myFilters, setMyFilters] = useState(EMPTY_FILTERS)
  const [pubFilters, setPubFilters] = useState(EMPTY_FILTERS)

  // Favourites (dietist tab, stored in localStorage)
  const [favIds, setFavIds] = useState(getFavIds)

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

  useEffect(() => {
    supabase.from('shared_recipes').select('*').eq('patient_id', user.id)
      .order('shared_at', { ascending: false })
      .then(({ data }) => {
        setSharedRecipes(data || [])
        if (tab === 'dietist') setLoadingDietist(false)
      })
  }, [user.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (tab !== 'dietist') return
    setLoadingDietist(false)
  }, [tab])

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(null), 2500) }

  function handleToggleFav(id) {
    const next = toggleFavId(id)
    setFavIds(next)
  }

  async function saveRecipe() {
    if (!form.nome || form.ingredienti.length === 0) return
    if (!editingRecipe && !isPro && myRecipes.length >= FREE_RECIPES_LIMIT) {
      showToast(`Piano gratuito: max ${FREE_RECIPES_LIMIT} ricette. Passa al Pro per ricette illimitate.`)
      return
    }
    setSaving(true)

    let photoUrl = form.photo_url || null
    if (photoFile) {
      const ext = photoFile.name.split('.').pop().toLowerCase()
      const path = `${user.id}/${Date.now()}.${ext}`
      const { error: uploadErr } = await supabase.storage.from('recipe-photos').upload(path, photoFile)
      if (!uploadErr) {
        const { data: pub } = supabase.storage.from('recipe-photos').getPublicUrl(path)
        photoUrl = pub.publicUrl
      }
    }

    const porzioni = Math.max(1, parseInt(form.porzioni) || 1)
    const payload = {
      nome: form.nome, porzioni,
      ...computeRecipeTotals(form.ingredienti, form.porzioni),
      ingredienti: form.ingredienti,
      fasi_preparazione: form.fasi,
      tempo_preparazione_min: parseInt(form.tempo_preparazione_min) || 0,
      tempo_cottura_min: parseInt(form.tempo_cottura_min) || 0,
      tempo_raffreddamento_min: parseInt(form.tempo_raffreddamento_min) || 0,
      note: form.note,
      is_public: form.is_public,
      photo_url: photoUrl,
    }
    if (editingRecipe) {
      const { data, error } = await supabase.from('ricette').update(payload).eq('id', editingRecipe.id).select().single()
      setSaving(false)
      if (error) { showToast(t('recipes.error_save')); return }
      if (data) {
        setMyRecipes(r => r.map(x => x.id === data.id ? data : x))
        setEditingRecipe(null)
        setForm(EMPTY_FORM); setNewStep(''); setPhotoFile(null); setPhotoPreview('')
        setShowCreate(false)
        showToast(t('recipes.updated'))
      }
    } else {
      const { data, error } = await supabase.from('ricette').insert({ user_id: user.id, ...payload }).select().single()
      setSaving(false)
      if (error) { showToast(t('recipes.error_save')); return }
      if (data) {
        setMyRecipes(r => [data, ...r])
        setTab('mine')
        setForm(EMPTY_FORM); setNewStep(''); setPhotoFile(null); setPhotoPreview('')
        setShowCreate(false)
        showToast(t('recipes.saved'))
      }
    }
  }

  function handleEditRecipe(r) {
    setEditingRecipe(r)
    setForm(recipeToForm(r))
    setPhotoFile(null)
    setPhotoPreview('')
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
    if (error) { showToast(t('recipes.error_save')); return }
    if (data) { setMyRecipes(r => [data, ...r]); showToast(t('recipes.saved_yours')) }
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

  // Public tab: keep backward-compatible search + new filters
  const filteredPublic = useMemo(() => {
    const withSearch = { ...pubFilters, search: pubQuery || pubFilters.search }
    return applyFiltersAndSort(publicRecipes, withSearch)
  }, [publicRecipes, pubFilters, pubQuery])

  const filteredMine = useMemo(() => applyFiltersAndSort(myRecipes, myFilters), [myRecipes, myFilters])

  // live macro preview inside form
  const formTotals = sumIngredients(form.ingredienti)
  const formPeso = form.ingredienti.reduce((s, i) => s + (parseFloat(i.grams) || 0), 0)
  const formPorz = Math.max(1, parseInt(form.porzioni) || 1)

  const newSharedCount = sharedRecipes.filter(sr => !sr.viewed_at).length

  const tabs = [
    ['mine', `👨‍🍳 ${t('recipes.mine')}`],
    ['public', `🌐 ${t('recipes.public')}`],
    ['dietist', newSharedCount > 0 ? `🩺 Dal Dietista (${newSharedCount})` : '🩺 Dal Dietista'],
  ]

  return (
    <div className="page">
      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg, #b45309, #d97706)', padding: 'calc(env(safe-area-inset-top) + 18px) 16px 22px', flexShrink: 0 }}>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, marginBottom: 4 }}>{t('recipes.cuisine')}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <h1 style={{ fontFamily: 'var(--font-d)', fontSize: 22, color: 'white', fontWeight: 300, flex: 1 }}>{t('recipes.title')}</h1>
          <button onClick={() => {
            const next = !showCreate
            setShowCreate(next)
            if (!next) { setEditingRecipe(null); setForm(EMPTY_FORM); setNewStep(''); setPhotoFile(null); setPhotoPreview('') }
            setTab('mine')
          }}
            style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.2)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', flexShrink: 0 }}>
            {showCreate ? <X size={18} /> : <Plus size={18} />}
          </button>
        </div>
        <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 2 }}>
          {tabs.map(([val, label]) => (
            <button key={val} onClick={() => setTab(val)} style={{ padding: '7px 14px', borderRadius: 100, background: tab === val ? 'white' : 'rgba(255,255,255,0.18)', color: tab === val ? '#b45309' : 'white', border: 'none', font: 'inherit', fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '14px 14px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* ── CREATE FORM ── */}
        {showCreate && !editingRecipe && !isPro && myRecipes.length >= FREE_RECIPES_LIMIT && (
          <ProGate feature="Ricette illimitate" teaser={`Hai raggiunto il limite di ${FREE_RECIPES_LIMIT} ricette del piano gratuito. Passa al Pro per ricette illimitate.`}>
            <div />
          </ProGate>
        )}
        {showCreate && (editingRecipe || isPro || myRecipes.length < FREE_RECIPES_LIMIT) && (
          <div className="card animate-slideUp" style={{ padding: 16 }}>
            <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>{editingRecipe ? t('recipes.edit') : t('recipes.new')}</p>

            {/* Nome + porzioni */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10, marginBottom: 12 }}>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">{t('recipes.name_label')}</label>
                <input className="input-field" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="es. Pasta al pomodoro" />
              </div>
              <div className="input-group">
                <label className="input-label">{t('recipes.portions')}</label>
                <input type="number" className="input-field" value={form.porzioni} onChange={e => setForm(f => ({ ...f, porzioni: e.target.value }))} min={1} inputMode="numeric" />
              </div>
            </div>

            {/* Tempi */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: 8, marginBottom: 14 }}>
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
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('recipes.ingredients')}</p>
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
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('recipes.steps')}</p>
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

            {/* Photo */}
            <div style={{ marginBottom: 14 }}>
              <label className="input-label">Foto ricetta (opzionale)</label>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: 'none' }}
                onChange={e => {
                  const f = e.target.files?.[0]
                  if (!f) return
                  setPhotoFile(f)
                  setPhotoPreview(URL.createObjectURL(f))
                  e.target.value = ''
                }}
              />
              {photoPreview || form.photo_url ? (
                <div style={{ position: 'relative', width: '100%', height: 140, borderRadius: 12, overflow: 'hidden', border: '1.5px solid var(--border)' }}>
                  <img src={photoPreview || form.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    onClick={() => { setPhotoFile(null); setPhotoPreview(''); setForm(f => ({ ...f, photo_url: '' })) }}
                    style={{ position: 'absolute', top: 6, right: 6, width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => photoInputRef.current?.click()}
                  style={{ width: '100%', padding: '12px 0', borderRadius: 12, border: '2px dashed var(--border)', background: 'var(--surface-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}
                >
                  <Camera size={16} />
                  Aggiungi foto
                </button>
              )}
            </div>

            {/* Note */}
            <div className="input-group" style={{ marginBottom: 14 }}>
              <label className="input-label">{t('recipes.notes')}</label>
              <textarea className="input-field" rows={2} value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Varianti, consigli, sostituzioni…" style={{ resize: 'vertical' }} />
            </div>

            {/* Toggle pubblico */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: form.is_public ? '#dbeafe' : 'var(--surface-2)', borderRadius: 12, marginBottom: 14, cursor: 'pointer' }}
              onClick={() => setForm(f => ({ ...f, is_public: !f.is_public }))}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: form.is_public ? '#1d4ed8' : 'var(--text-secondary)' }}>
                  {form.is_public ? `🌐 ${t('recipes.public_label')}` : `🔒 ${t('recipes.private_label')}`}
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
              {saving ? `${t('common.loading')}` : editingRecipe ? `✓ ${t('recipes.update')}` : `✓ ${t('recipes.save')}`}
            </button>
          </div>
        )}

        {/* ── LE MIE RICETTE ── */}
        {tab === 'mine' && (
          loadingMine
            ? <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: 13 }}>{t('common.loading')}</div>
            : <>
                {myRecipes.length > 0 && (
                  <AdvancedFilters
                    filters={myFilters}
                    onChange={setMyFilters}
                    onReset={() => setMyFilters(EMPTY_FILTERS)}
                  />
                )}
                {filteredMine.length === 0 && !showCreate
                  ? (
                    <div style={{ textAlign: 'center', padding: '50px 0 30px', color: 'var(--text-muted)' }}>
                      <div style={{ fontSize: 52, marginBottom: 12 }}>🍳</div>
                      <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
                        {myRecipes.length === 0 ? t('recipes.empty_mine') : 'Nessuna ricetta corrisponde ai filtri'}
                      </p>
                      <p style={{ fontSize: 12, lineHeight: 1.7 }}>
                        {myRecipes.length === 0 ? t('recipes.create_first') : 'Prova a modificare o azzerare i filtri'}
                      </p>
                      {myRecipes.length === 0 && (
                        <button className="btn btn-primary" onClick={() => setShowCreate(true)} style={{ marginTop: 16 }}>
                          + {t('recipes.new')}
                        </button>
                      )}
                    </div>
                  )
                  : filteredMine.map(r => (
                    <RecipeCard key={r.id} r={r} isOwn expandedId={expandedId} setExpandedId={setExpandedId}
                      onSave={savePublicRecipe} onTogglePublic={togglePublic} onDelete={deleteRecipe} onEdit={handleEditRecipe}
                      favIds={favIds} onToggleFav={handleToggleFav} />
                  ))
                }
              </>
        )}

        {/* ── PUBBLICHE ── */}
        {tab === 'public' && (
          <>
            <AdvancedFilters
              filters={pubFilters}
              onChange={setPubFilters}
              onReset={() => { setPubFilters(EMPTY_FILTERS); setPubQuery('') }}
            />
            {/* Legacy search box kept for UX continuity — synced into filters */}
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input-field" placeholder="Cerca ricette pubbliche…" value={pubQuery} onChange={e => setPubQuery(e.target.value)} style={{ flex: 1 }} />
              {pubQuery && <button onClick={() => setPubQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0 8px' }}><X size={16} /></button>}
            </div>
            {loadingPublic
              ? <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: 13 }}>{t('common.loading')}</div>
              : filteredPublic.length === 0
                ? (
                  <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: 52, marginBottom: 12 }}>🌐</div>
                    <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
                      {pubQuery || pubFilters.search ? t('common.no_data') : t('recipes.empty_public')}
                    </p>
                    <p style={{ fontSize: 12 }}>
                      {pubQuery || pubFilters.search ? 'Prova un termine diverso' : 'Sii il primo a condividere una ricetta!'}
                    </p>
                  </div>
                )
                : filteredPublic.map(r => (
                  <RecipeCard key={r.id} r={r} isOwn={false} expandedId={expandedId} setExpandedId={setExpandedId}
                    onSave={savePublicRecipe} onTogglePublic={togglePublic} onDelete={deleteRecipe}
                    favIds={favIds} onToggleFav={handleToggleFav} />
                ))
            }
          </>
        )}

        {/* ── DAL DIETISTA ── */}
        {tab === 'dietist' && (
          <>
            <div style={{ background: '#ecfeff', border: '1px solid #a5f3fc', borderRadius: 12, padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>🩺</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#0e7490', marginBottom: 2 }}>Ricette dal tuo Dietista</p>
                <p style={{ fontSize: 11, color: '#0891b2', lineHeight: 1.5 }}>Ricette condivise personalmente dal tuo dietista. Puoi salvarle nelle tue ricette per modificarle.</p>
              </div>
            </div>
            {loadingDietist
              ? <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: 13 }}>{t('common.loading')}</div>
              : sharedRecipes.length === 0
                ? (
                  <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: 52, marginBottom: 12 }}>🩺</div>
                    <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Nessuna ricetta ricevuta</p>
                    <p style={{ fontSize: 12 }}>Il tuo dietista non ti ha ancora inviato ricette.</p>
                  </div>
                )
                : sharedRecipes.map(sr => (
                  <SharedRecipeCard
                    key={sr.id}
                    sr={sr}
                    onSave={async () => {
                      const rd = sr.recipe_data || {}
                      const rawIng = Array.isArray(rd.ingredienti) ? rd.ingredienti : []
                      // The shared snapshot only has {nome, qt} per ingredient, no
                      // macros (see condividiRicetta in NutriPlan-Pro/ricette.html) —
                      // resolve each one against the food database instead of
                      // saving it with hardcoded zero nutrition.
                      const ingredienti = await Promise.all(
                        rawIng.map(i => resolveSharedIngredient(i.nome || i.food_name, i.qt || i.grams))
                      )
                      savePublicRecipe({
                        nome: rd.nome || 'Ricetta',
                        porzioni: rd.porzioni || 1,
                        ingredienti,
                        ...computeRecipeTotals(ingredienti, rd.porzioni || 1),
                        note: rd.note || '',
                        fasi_preparazione: [],
                        is_public: false,
                      })
                    }}
                    onMarkViewed={async () => {
                      if (!sr.viewed_at) {
                        await supabase.from('shared_recipes').update({ viewed_at: new Date().toISOString() }).eq('id', sr.id)
                        setSharedRecipes(prev => prev.map(x => x.id === sr.id ? { ...x, viewed_at: new Date().toISOString() } : x))
                      }
                    }}
                  />
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
