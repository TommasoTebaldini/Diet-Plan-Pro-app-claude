import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Clock, ChevronDown, ChevronUp, Flame, Leaf, FileText, CheckCircle2, Circle, History, RefreshCw, TrendingUp, Calendar, Download, ClipboardList, ImageOff, ClipboardCopy, Check, MessageSquare, X, Send } from 'lucide-react'
import { useT } from '../i18n'

const r1 = v => Math.round((+v || 0) * 10) / 10
const r0 = v => Math.round(+v || 0)

const DAYS = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica']

const MEAL_META_STATIC = {
  colazione: { icon: '☀️', time: '07:00–08:30', accent: '#f59e0b', pale: '#fffbeb' },
  spuntino_mattina: { icon: '🍎', time: '10:00–10:30', accent: '#10b981', pale: '#ecfdf5' },
  pranzo: { icon: '🍽️', time: '12:30–13:30', accent: '#3b82f6', pale: '#eff6ff' },
  spuntino_pomeriggio: { icon: '🥤', time: '15:30–16:00', accent: '#8b5cf6', pale: '#f5f3ff' },
  cena: { icon: '🌙', time: '19:30–20:30', accent: '#6366f1', pale: '#eef2ff' },
}

function MacroBar({ label, value, max, color }) {
  const pct = max ? Math.min(100, (value / max) * 100) : 0
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color }}>{value || 0}g</span>
      </div>
      <div style={{ height: 6, background: 'var(--surface-3)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.5s ease' }} />
      </div>
    </div>
  )
}

function DailyNutritionSummary({ meals, diet }) {
  const t = useT()
  const total = useMemo(() => meals.reduce((acc, m) => ({
    kcal: acc.kcal + (m.kcal || 0),
    proteins: acc.proteins + Number(m.proteins || 0),
    carbs: acc.carbs + Number(m.carbs || 0),
    fats: acc.fats + Number(m.fats || 0),
  }), { kcal: 0, proteins: 0, carbs: 0, fats: 0 }), [meals])

  const kcalPct = useMemo(() =>
    diet?.kcal_target ? Math.min(100, Math.round((total.kcal / diet.kcal_target) * 100)) : null
  , [diet?.kcal_target, total.kcal])

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp size={16} color="var(--green-main)" />
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Riepilogo giornaliero</span>
        </div>
        {kcalPct !== null && (
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--green-main)' }}>{kcalPct}% obiettivo</span>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {[
          { label: 'Kcal', val: r0(total.kcal), color: '#f0922b' },
          { label: t('diet.proteins'), val: r1(total.proteins) + 'g', color: '#3b82f6' },
          { label: t('diet.carbs'), val: r1(total.carbs) + 'g', color: '#f0922b' },
          { label: t('diet.fats'), val: r1(total.fats) + 'g', color: '#e05a5a' },
        ].map(m => (
          <div key={m.label} style={{ flex: 1, textAlign: 'center', padding: '10px 4px', background: 'var(--surface-2)', borderRadius: 10 }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: m.color }}>{m.val}</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{m.label}</p>
          </div>
        ))}
      </div>

      {(diet?.protein_target || diet?.carbs_target || diet?.fats_target) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {diet.protein_target && <MacroBar label={`${t('diet.proteins')} / ${diet.protein_target}g`} value={Math.round(total.proteins)} max={diet.protein_target} color="#3b82f6" />}
          {diet.carbs_target && <MacroBar label={`${t('diet.carbs')} / ${diet.carbs_target}g`} value={Math.round(total.carbs)} max={diet.carbs_target} color="#f0922b" />}
          {diet.fats_target && <MacroBar label={`${t('diet.fats')} / ${diet.fats_target}g`} value={Math.round(total.fats)} max={diet.fats_target} color="#e05a5a" />}
        </div>
      )}
    </div>
  )
}

function FoodItem({ food, overrideKey, override, onOverride }) {
  // Normalize: dietitian panel stores alternatives in `altPrint` ({nome,qt,misura}); standard format uses `substitutes` ({name,quantity,unit})
  const subs = food.substitutes?.length
    ? food.substitutes
    : (food.altPrint || []).map(a => ({ name: a.nome || a.name || '', quantity: a.qt || a.quantita || a.quantity || '', unit: a.misura || a.unit || 'g' }))
  const hasSubs = subs.length > 0
  const selectedSubIdx = override?.subIdx ?? null
  const customGrams = override?.grams ?? ''

  const activeSub = selectedSubIdx != null ? subs[selectedSubIdx] : null
  const displayName = activeSub ? activeSub.name : (food.name || food.nome || '')
  const displayQty = activeSub ? (customGrams || activeSub.quantity) : food.quantity
  const displayUnit = activeSub ? (activeSub.unit || 'g') : (food.unit || 'g')

  function selectSub(i) {
    if (!onOverride || !overrideKey) return
    if (i === selectedSubIdx) { onOverride(overrideKey, null); return }
    const sub = subs[i]
    onOverride(overrideKey, { subIdx: i, grams: String(sub.quantity || '') })
  }

  return (
    <div style={{ padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', fontFamily: 'var(--font-b)' }}>{displayName}</span>
          {activeSub && (
            <span style={{ fontSize: 10, color: 'var(--green-main)', fontWeight: 700, background: 'var(--green-pale)', padding: '1px 6px', borderRadius: 100 }}>sostituto</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {activeSub && onOverride && (
            <input
              type="number"
              value={customGrams}
              onChange={e => onOverride(overrideKey, { subIdx: selectedSubIdx, grams: e.target.value })}
              style={{ width: 60, padding: '2px 6px', borderRadius: 8, border: '1.5px solid var(--green-main)', fontSize: 13, fontFamily: 'inherit', textAlign: 'center', outline: 'none' }}
              min={1}
            />
          )}
          <span style={{ fontSize: 13, color: activeSub ? 'white' : 'var(--green-main)', fontWeight: 700, flexShrink: 0, background: activeSub ? 'var(--green-main)' : 'var(--green-pale)', padding: '2px 9px', borderRadius: 100, fontFamily: 'var(--font-b)' }}>
            {displayQty} {displayUnit}
          </span>
        </div>
      </div>
      {hasSubs && onOverride && (
        <div style={{ marginTop: 6, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          <button
            onClick={() => onOverride(overrideKey, null)}
            style={{ padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: 'none', background: selectedSubIdx == null ? 'var(--green-main)' : 'var(--surface-3)', color: selectedSubIdx == null ? 'white' : 'var(--text-muted)' }}
          >Originale</button>
          {subs.map((sub, i) => (
            <button
              key={i}
              onClick={() => selectSub(i)}
              style={{ padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: 'none', background: selectedSubIdx === i ? 'var(--green-main)' : 'var(--surface-3)', color: selectedSubIdx === i ? 'white' : 'var(--text-secondary)' }}
            >
              {sub.name} · {sub.quantity}{sub.unit || 'g'}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const MEAL_LABELS_IT = {
  colazione: 'Colazione', spuntino_mattina: 'Spuntino mattina',
  pranzo: 'Pranzo', spuntino_pomeriggio: 'Spuntino pomeriggio', cena: 'Cena',
}

function MealFeedbackModal({ meal, user, onClose }) {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const mealLabel = meal.nome || MEAL_LABELS_IT[meal.meal_type] || meal.meal_type

  async function send() {
    if (!text.trim()) return
    setSending(true)
    try {
      await supabase.from('chat_messages').insert({
        patient_id: user.id,
        sender_id: user.id,
        sender_role: 'patient',
        content: `💬 Feedback sul pasto "${mealLabel}": ${text.trim()}`,
      })
      setSent(true)
      setTimeout(onClose, 1800)
    } catch { /* ignore */ }
    setSending(false)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1200, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', padding: '0 0 calc(64px + env(safe-area-inset-bottom))' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--surface)', borderRadius: '20px 20px 0 0', padding: '20px 20px 24px', width: '100%', boxShadow: '0 -8px 32px rgba(0,0,0,0.2)', maxHeight: '85dvh', overflowY: 'auto', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700 }}>💬 Feedback al dietista</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Pasto: {mealLabel}</p>
          </div>
          <button onClick={onClose} style={{ background: 'var(--surface-2)', border: 'none', borderRadius: 10, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={16} color="var(--text-muted)" />
          </button>
        </div>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '12px 0', color: 'var(--green-main)', fontWeight: 600, fontSize: 15 }}>✅ Feedback inviato!</div>
        ) : (
          <>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Es: questo pranzo era troppo pesante, posso ridurre i carboidrati?"
              rows={3}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid var(--border)', fontFamily: 'inherit', fontSize: 14, resize: 'none', outline: 'none', boxSizing: 'border-box', marginBottom: 12 }}
              autoFocus
            />
            <button
              onClick={send}
              disabled={!text.trim() || sending}
              style={{ width: '100%', background: text.trim() ? 'var(--green-main)' : 'var(--border)', color: 'white', border: 'none', borderRadius: 12, padding: '13px', fontSize: 15, fontWeight: 700, cursor: text.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}
            >
              <Send size={16} />{sending ? 'Invio...' : 'Invia al dietista'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function MealCard({ meal, completed, onToggleComplete, user, foodOverrides, onFoodOverride }) {
  const [open, setOpen] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const t = useT()
  const mealLabels = useMemo(() => Object.fromEntries(
    Object.entries(MEAL_META_STATIC).map(([k, v]) => [k, { ...v, label: t(`meal.${k}`) }])
  ), [t])
  const meta = mealLabels[meal.meal_type] || { label: meal.meal_type, icon: '🍴', time: '', accent: 'var(--green-main)', pale: 'var(--green-pale)' }

  return (
    <div style={{
      borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border-light)',
      background: 'var(--surface)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      opacity: completed ? 0.85 : 1,
      transition: 'opacity 0.2s, transform 0.18s cubic-bezier(.16,1,.3,1), box-shadow 0.18s',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)' }}
    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)' }}
    >
      {/* Accent top bar */}
      <div style={{ height: 3, background: completed ? 'var(--green-main)' : meta.accent }} />

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          onClick={() => setOpen(v => !v)}
          style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', padding: '14px 12px 14px 16px', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 14, background: meta.pale, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
            {meta.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-b)' }}>{meta.label}</p>
              {completed && (
                <span style={{ fontSize: 10, color: 'var(--green-main)', fontWeight: 700, background: 'var(--green-pale)', padding: '2px 8px', borderRadius: 100 }}>✓ Completato</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 3, flexWrap: 'wrap' }}>
              {meal.kcal && <span style={{ fontSize: 12, color: meta.accent, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}><Flame size={10} color={meta.accent} />{r0(meal.kcal)} kcal</span>}
            </div>
          </div>
          {open ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
        </button>
        <button
          onClick={() => onToggleComplete(meal.id)}
          style={{ padding: '14px 14px 14px 4px', background: 'none', border: 'none', cursor: 'pointer', color: completed ? 'var(--green-main)' : 'var(--border)', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
          title={completed ? 'Segna come non completato' : 'Segna come completato'}
        >
          {completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
        </button>
        <button
          onClick={() => setShowFeedback(true)}
          title="Invia feedback al dietista su questo pasto"
          style={{ padding: '14px 8px 14px 0', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
        >
          <MessageSquare size={18} />
        </button>
      </div>

      {showFeedback && user && (
        <MealFeedbackModal meal={meal} user={user} onClose={() => setShowFeedback(false)} />
      )}

      {open && (
        <div style={{ borderTop: '1px solid var(--border-light)', padding: '14px 16px 16px' }}>
          {meal.foods && meal.foods.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: meal.notes ? 12 : 0 }}>
              {meal.foods.map((food, i) => (
                <FoodItem
                  key={i}
                  food={food}
                  overrideKey={`${meal.id}_${i}`}
                  override={foodOverrides?.[`${meal.id}_${i}`]}
                  onOverride={onFoodOverride}
                />
              ))}
            </div>
          ) : meal.description ? (
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: meal.notes ? 12 : 0, fontFamily: 'var(--font-b)' }}>{meal.description}</p>
          ) : null}

          {meal.notes && (
            <div style={{ background: meta.pale, borderRadius: 10, padding: '10px 13px', marginTop: 8, borderLeft: `3px solid ${meta.accent}` }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55, fontFamily: 'var(--font-b)' }}>💡 {meal.notes}</p>
            </div>
          )}

          {meal.kcal && (
            <div style={{ display: 'flex', gap: 8, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border-light)' }}>
              {[
                { label: 'Proteine', val: r1(meal.proteins), color: '#3b82f6' },
                { label: 'Carboidrati', val: r1(meal.carbs), color: '#f0922b' },
                { label: 'Grassi', val: r1(meal.fats), color: '#e05a5a' },
              ].filter(m => m.val).map(m => (
                <div key={m.label} style={{ flex: 1, textAlign: 'center', padding: '8px 4px', background: 'var(--surface-2)', borderRadius: 10, border: '1px solid var(--border-light)' }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: m.color, fontFamily: 'var(--font-b)' }}>{m.val}g</p>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{m.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function HistoryDietCard({ diet, onSelect, selected, meals }) {
  const [historyTab, setHistoryTab] = useState(0)
  const t = useT()
  const mealLabels = useMemo(() => Object.fromEntries(
    Object.entries(MEAL_META_STATIC).map(([k, v]) => [k, { ...v, label: t(`meal.${k}`) }])
  ), [t])
  const hasWeekly = meals.some(m => m.day_number)
  const dayMeals = meals.filter(m => m.day_number === historyTab + 1 || !m.day_number)

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <button
        onClick={() => onSelect(diet.id)}
        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}
      >
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Calendar size={16} color="var(--text-muted)" />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{diet.name || 'Piano alimentare'}</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            {new Date(diet.created_at).toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
            {diet.kcal_target ? ` · ${diet.kcal_target} kcal` : ''}
            {diet.duration_weeks ? ` · ${diet.duration_weeks} sett.` : ''}
          </p>
        </div>
        {selected ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
      </button>

      {selected && (
        <div style={{ borderTop: '1px solid var(--border-light)', padding: '12px 16px 16px' }}>
          {meals.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '8px 0' }}>Nessun pasto registrato per questo piano</p>
          ) : (
            <>
              {hasWeekly && (
                <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 10, WebkitOverflowScrolling: 'touch' }}>
                  {DAYS.map((d, i) => (
                    <button key={d} onClick={() => setHistoryTab(i)} style={{
                      flexShrink: 0, padding: '6px 12px', borderRadius: 100,
                      background: historyTab === i ? 'var(--green-main)' : 'var(--surface)',
                      color: historyTab === i ? 'white' : 'var(--text-secondary)',
                      border: `1.5px solid ${historyTab === i ? 'transparent' : 'var(--border)'}`,
                      font: 'inherit', fontSize: 12, cursor: 'pointer'
                    }}>
                      {d.slice(0, 3)}
                    </button>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {dayMeals.length === 0 ? (
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '8px 0' }}>Nessun pasto per questo giorno</p>
                ) : dayMeals.map((m, i) => {
                  const meta = mealLabels[m.meal_type] || { label: m.meal_type, icon: '🍴', accent: 'var(--green-main)', pale: 'var(--green-pale)' }
                  return (
                    <div key={m.id || i} style={{ padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 10, borderLeft: `3px solid ${meta.accent || 'var(--green-main)'}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 18 }}>{meta.icon}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{meta.label}</span>
                        {m.kcal && <span style={{ fontSize: 12, fontWeight: 600, color: meta.accent || 'var(--green-main)', background: meta.pale || 'var(--green-pale)', padding: '2px 8px', borderRadius: 100, marginLeft: 'auto' }}>{m.kcal} kcal</span>}
                      </div>
                      {m.foods && m.foods.length > 0 && (
                        <div style={{ marginTop: 8, paddingLeft: 26, display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {m.foods.map((f, j) => (
                            <div key={j} style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{f.name}</span>
                              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{f.quantity} {f.unit || 'g'}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

const MEAL_PRINT_LABELS = {
  colazione: { label: 'Colazione', emoji: '☀️' },
  spuntino_mattina: { label: 'Spuntino mattina', emoji: '🍎' },
  pranzo: { label: 'Pranzo', emoji: '🍽️' },
  spuntino_pomeriggio: { label: 'Spuntino pomeriggio', emoji: '🥤' },
  cena: { label: 'Cena', emoji: '🌙' },
}

const MEAL_TYPE_MAP = { colazione: 'colazione', spuntino_mattina: 'spuntino_mattina', pranzo: 'pranzo', spuntino_pomeriggio: 'spuntino_pomeriggio', cena: 'cena' }
const NOME_TO_MEAL_TYPE = {
  'colazione': 'colazione', 'breakfast': 'colazione',
  'spuntino mattino': 'spuntino_mattina', 'spuntino mattina': 'spuntino_mattina', 'morning snack': 'spuntino_mattina',
  'pranzo': 'pranzo', 'lunch': 'pranzo',
  'spuntino pomeriggio': 'spuntino_pomeriggio', 'afternoon snack': 'spuntino_pomeriggio',
  'cena': 'cena', 'dinner': 'cena',
}

function MacroChip({ val, label, color, bg }) {
  if (val == null) return null
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, padding: '2px 7px', borderRadius: 20, background: bg, color, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
      {label} {val}
    </span>
  )
}

function PianoAlimentareContent({ piano }) {
  const { user } = useAuth()
  const today = new Date().toISOString().split('T')[0]
  const [copyState, setCopyState] = useState({ dayIdx: null, date: today, busy: false, doneIdx: null })
  const [feedbackMeal, setFeedbackMeal] = useState(null)
  const [selectedAlts, setSelectedAlts] = useState({})

  let days
  try {
    const raw = typeof piano.meals === 'string' ? JSON.parse(piano.meals) : piano.meals
    days = Array.isArray(raw) ? raw : []
  } catch { days = [] }

  const displayMode = piano.display_mode || 'normale'

  async function copyDayToDiary(day, di) {
    setCopyState(s => ({ ...s, busy: true }))
    const targetDate = copyState.date
    const inserts = []
    const meals = day.meals || []
    for (let mi = 0; mi < meals.length; mi++) {
      const meal = meals[mi]
      const mealKey = meal.tipo || meal.meal_type || ''
      const mealType = MEAL_TYPE_MAP[mealKey] || NOME_TO_MEAL_TYPE[(meal.nome || '').toLowerCase().trim()] || 'pranzo'
      const foods = meal.items || meal.foods || meal.alimenti || []
      for (let fi = 0; fi < foods.length; fi++) {
        const food = foods[fi]
        // skip recipe header rows — ingredients are copied individually
        if (food.isRicetta) continue
        const altKey = `${di}_${mi}_${fi}`
        const selAltIdx = selectedAlts[altKey] ?? null
        const alt = selAltIdx != null ? (food.altPrint || [])[selAltIdx] : null
        const nome = alt ? (alt.nome || alt.name || food.nome || food.name || food.alimento || '') : (food.nome || food.name || food.alimento || '')
        if (!nome) continue
        const qt = alt
          ? (parseFloat(alt.qt || alt.quantita || alt.quantity || food.qt || food.quantita || food.quantity || food.grams || 100) || 0)
          : (parseFloat(food.qt || food.quantita || food.quantity || food.grammi || food.grams || 100) || 0)
        const k = food.kcal_100g || 0
        const p = food.proteins_100g || 0
        const c = food.carbs_100g || 0
        const f = food.fats_100g || 0
        inserts.push({
          user_id: user.id, date: targetDate, meal_type: mealType,
          food_name: nome, grams: qt,
          kcal: k ? Math.round(k * qt / 100) : null,
          proteins: p ? Math.round(p * qt / 100 * 10) / 10 : null,
          carbs: c ? Math.round(c * qt / 100 * 10) / 10 : null,
          fats: f ? Math.round(f * qt / 100 * 10) / 10 : null,
          food_data: { source: 'diet_plan', plan_nome: piano.nome || '', alt_used: alt ? nome : null },
        })
      }
    }
    if (inserts.length) {
      await supabase.from('food_logs').insert(inserts)
      const { data: allFoods } = await supabase.from('food_logs').select('kcal,proteins,carbs,fats').eq('user_id', user.id).eq('date', targetDate)
      if (allFoods) {
        const t = allFoods.reduce((a, r) => ({ kcal: a.kcal + (r.kcal || 0), proteins: a.proteins + (r.proteins || 0), carbs: a.carbs + (r.carbs || 0), fats: a.fats + (r.fats || 0) }), { kcal: 0, proteins: 0, carbs: 0, fats: 0 })
        await supabase.from('daily_logs').upsert({ user_id: user.id, date: targetDate, ...t }, { onConflict: 'user_id,date' })
      }
    }
    setCopyState({ dayIdx: null, date: today, busy: false, doneIdx: di })
    setTimeout(() => setCopyState(s => ({ ...s, doneIdx: null })), 3000)
  }

  if (!days.length) return (
    <div style={{ textAlign: 'center', padding: '28px 24px', color: 'var(--text-muted)' }}>
      <ImageOff size={32} style={{ opacity: 0.3, marginBottom: 10 }} />
      <p style={{ fontSize: 14 }}>Il dietista non ha ancora aggiunto il dettaglio dei pasti.</p>
    </div>
  )

  return (
    <div style={{ padding: '12px 14px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {feedbackMeal && user && (
        <MealFeedbackModal meal={feedbackMeal} user={user} onClose={() => setFeedbackMeal(null)} />
      )}
      {days.map((day, di) => {
        // Compute day totals from meal data
        const allFoods = (day.meals || []).flatMap(m => m.items || m.foods || m.alimenti || [])
        const hasDayMacros = allFoods.some(f => f.kcal_100g)
        const dayTot = hasDayMacros ? allFoods.reduce((acc, food) => {
          const qt = parseFloat(food.qt || food.quantity || food.grams || 0) || 0
          return {
            kcal: acc.kcal + (food.kcal_100g ? Math.round(food.kcal_100g * qt / 100) : 0),
            prot: acc.prot + (food.proteins_100g ? Math.round(food.proteins_100g * qt / 100 * 10) / 10 : 0),
            carb: acc.carb + (food.carbs_100g ? Math.round(food.carbs_100g * qt / 100 * 10) / 10 : 0),
            fat:  acc.fat  + (food.fats_100g  ? Math.round(food.fats_100g  * qt / 100 * 10) / 10 : 0),
          }
        }, { kcal: 0, prot: 0, carb: 0, fat: 0 }) : null

        return (
          <div key={day.id || di}>
            {/* ── Day header ── */}
            <div style={{ background: 'linear-gradient(135deg, var(--green-dark), var(--green-main))', borderRadius: 14, padding: '12px 16px', marginBottom: 10, boxShadow: '0 2px 8px rgba(26,127,90,.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: hasDayMacros ? 8 : 0 }}>
                <span style={{ fontSize: 16 }}>📅</span>
                <span style={{ fontWeight: 800, fontSize: 15, color: 'white', flex: 1, letterSpacing: '0.01em' }}>{day.nome || `Giorno ${di + 1}`}</span>
                {/* Copy button */}
                {copyState.doneIdx === di ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, background: 'rgba(255,255,255,.25)', borderRadius: 20, padding: '4px 10px', color: 'white', fontWeight: 700 }}>
                    <Check size={11} /> Copiato!
                  </span>
                ) : copyState.dayIdx === di ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }} onClick={e => e.stopPropagation()}>
                    <input type="date" value={copyState.date}
                      onChange={e => setCopyState(s => ({ ...s, date: e.target.value }))}
                      style={{ padding: '3px 6px', borderRadius: 7, border: 'none', fontSize: 11.5, background: 'rgba(255,255,255,.92)', color: '#1a1a1a', outline: 'none', maxWidth: 120 }}
                    />
                    <button onClick={() => copyDayToDiary(day, di)} disabled={copyState.busy}
                      style={{ padding: '4px 12px', borderRadius: 20, border: 'none', background: 'white', color: 'var(--green-dark)', fontSize: 12, fontWeight: 800, cursor: 'pointer', opacity: copyState.busy ? 0.6 : 1 }}>
                      {copyState.busy ? '⏳' : '✓ Copia'}
                    </button>
                    <button onClick={() => setCopyState(s => ({ ...s, dayIdx: null }))}
                      style={{ padding: '4px 8px', borderRadius: 20, border: 'none', background: 'rgba(0,0,0,.25)', color: 'white', fontSize: 12, cursor: 'pointer' }}>✕</button>
                  </div>
                ) : (
                  <button onClick={() => setCopyState(s => ({ ...s, dayIdx: di, date: today }))}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 12px', borderRadius: 20, border: '1.5px solid rgba(255,255,255,.5)', background: 'rgba(255,255,255,.15)', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', backdropFilter: 'blur(4px)' }}>
                    <ClipboardCopy size={11} /> Copia nel diario
                  </button>
                )}
              </div>
              {/* Day macro summary */}
              {dayTot && displayMode !== 'semplice' && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, background: 'rgba(255,255,255,.18)', color: 'white', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>🔥 {Math.round(dayTot.kcal)} kcal</span>
                  {displayMode !== 'compatta' && <>
                    <span style={{ fontSize: 11, background: 'rgba(96,165,250,.3)', color: '#dbeafe', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>💪 {Math.round(dayTot.prot * 10) / 10}g prot</span>
                    <span style={{ fontSize: 11, background: 'rgba(251,191,36,.3)', color: '#fef3c7', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>🍞 {Math.round(dayTot.carb * 10) / 10}g carbo</span>
                    <span style={{ fontSize: 11, background: 'rgba(248,113,113,.3)', color: '#fee2e2', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>🧈 {Math.round(dayTot.fat * 10) / 10}g grassi</span>
                  </>}
                </div>
              )}
            </div>

            {/* ── Meals ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(day.meals || []).map((meal, mi) => {
                const mealKey = meal.id || meal.tipo || ''
                const meta = MEAL_PRINT_LABELS[mealKey] || { label: meal.nome || meal.id || 'Pasto', emoji: '🍴' }
                const foods = meal.items || meal.foods || meal.alimenti || []
                const mealEmoji = meal.emoji || meta.emoji
                const mealLabel = meal.nome || meta.label
                const note = meal.note || meal.notes || ''
                const hasMacros = foods.some(f => f.kcal_100g)

                // Meal total kcal (computed or stored)
                const mealKcalComputed = hasMacros ? foods.reduce((s, food) => {
                  const qt = parseFloat(food.qt || food.quantity || food.grams || 0) || 0
                  return s + (food.kcal_100g ? Math.round(food.kcal_100g * qt / 100) : 0)
                }, 0) : null
                const mealKcal = mealKcalComputed ?? meal.kcal ?? meal.calorie ?? null

                if (!foods.length && !meal.descrizione && !meal.description) return null

                return (
                  <div key={meal.id || mi} style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 14, overflow: 'hidden' }}>
                    {/* Meal header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--surface-2)', borderBottom: foods.length ? '1px solid var(--border-light)' : 'none' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                        {mealEmoji}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--green-dark)', lineHeight: 1 }}>{mealLabel}</p>
                      </div>
                      {mealKcal && displayMode !== 'semplice' ? (
                        <div style={{ textAlign: 'center', background: 'var(--green-pale)', borderRadius: 10, padding: '4px 10px' }}>
                          <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--green-main)', lineHeight: 1 }}>{mealKcal}</p>
                          <p style={{ fontSize: 10, color: 'var(--green-dark)', fontWeight: 600 }}>kcal</p>
                        </div>
                      ) : null}
                      <button
                        onClick={() => setFeedbackMeal({ meal_type: meal.id || meal.tipo || 'pasto', nome: mealLabel })}
                        title="Invia feedback al dietista su questo pasto"
                        style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', flexShrink: 0 }}
                      >
                        <MessageSquare size={16} />
                      </button>
                    </div>

                    {/* Food rows */}
                    {foods.length > 0 && (() => {
                      // Group items: recipe header + following ricettaIng items form a recipe block
                      const blocks = []
                      let i = 0
                      while (i < foods.length) {
                        if (foods[i].isRicetta) {
                          const block = { type: 'recipe', header: foods[i], headerIdx: i, ingredients: [] }
                          let j = i + 1
                          while (j < foods.length && foods[j].ricettaIng) { block.ingredients.push({ food: foods[j], fi: j }); j++ }
                          blocks.push(block); i = j
                        } else if (foods[i].ricettaIng) {
                          i++ // orphaned ingredient — skip
                        } else {
                          blocks.push({ type: 'food', food: foods[i], fi: i }); i++
                        }
                      }
                      return (
                        <div style={{ padding: '6px 0' }}>
                          {blocks.map((block, bi) => {
                            if (block.type === 'recipe') {
                              const hdr = block.header
                              const porzioni = hdr.ricettaPorzioni || 1
                              const ingList = block.ingredients
                              // Compute recipe totals for prospetto
                              const recTotKcal = ingList.reduce((s, { food: ing }) => s + (ing.kcal_100g && ing.qt ? Math.round(ing.kcal_100g * parseFloat(ing.qt) / 100) : 0), 0)
                              const recTotProt = ingList.reduce((s, { food: ing }) => s + (ing.proteins_100g && ing.qt ? Math.round(ing.proteins_100g * parseFloat(ing.qt) / 100 * 10) / 10 : 0), 0)
                              const recTotCarb = ingList.reduce((s, { food: ing }) => s + (ing.carbs_100g && ing.qt ? Math.round(ing.carbs_100g * parseFloat(ing.qt) / 100 * 10) / 10 : 0), 0)
                              const recTotFat  = ingList.reduce((s, { food: ing }) => s + (ing.fats_100g && ing.qt ? Math.round(ing.fats_100g * parseFloat(ing.qt) / 100 * 10) / 10 : 0), 0)
                              const hasIngMacros = ingList.some(({ food: ing }) => ing.kcal_100g)
                              return (
                                <div key={bi} style={{ margin: '6px 10px 8px', border: '2px solid #86efac', borderRadius: 14, overflow: 'hidden' }}>
                                  {/* Recipe header */}
                                  <div style={{ background: 'linear-gradient(90deg,#ecfdf5,#f0fdf4)', padding: '8px 14px', borderBottom: '1px solid #86efac', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: 14 }}>📋</span>
                                    <span style={{ fontSize: 14, fontWeight: 700, color: '#065f46', flex: 1 }}>{hdr.nome}</span>
                                    <span style={{ fontSize: 11, background: '#d1fae5', color: '#065f46', padding: '2px 10px', borderRadius: 20, fontWeight: 700 }}>
                                      {porzioni} {porzioni === 1 ? 'porzione' : 'porzioni'}
                                    </span>
                                  </div>
                                  {/* Ingredient list */}
                                  {ingList.map(({ food: ing, fi: ingFi }, ii) => {
                                    const ingQt = parseFloat(ing.qt) || 0
                                    const ingUnit = ing.misura || 'g'
                                    const ingKcal = ing.kcal_100g && ingQt ? Math.round(ing.kcal_100g * ingQt / 100) : null
                                    const ingProt = ing.proteins_100g && ingQt ? Math.round(ing.proteins_100g * ingQt / 100 * 10) / 10 : null
                                    const ingCarb = ing.carbs_100g && ingQt ? Math.round(ing.carbs_100g * ingQt / 100 * 10) / 10 : null
                                    const ingFat  = ing.fats_100g && ingQt ? Math.round(ing.fats_100g * ingQt / 100 * 10) / 10 : null
                                    return (
                                      <div key={ii} style={{ padding: '6px 14px 6px 22px', borderBottom: ii < ingList.length - 1 ? '1px solid #dcfce7' : 'none', background: '#f0fdf4' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                                          <p style={{ fontSize: 13, color: '#166534', flex: 1, lineHeight: 1.3 }}>└ {ing.nome}</p>
                                          <span style={{ fontSize: 12, fontWeight: 700, color: 'white', background: '#16a34a', padding: '1px 8px', borderRadius: 20, flexShrink: 0 }}>
                                            {ingQt || ''}{ingUnit}
                                          </span>
                                        </div>
                                        {hasIngMacros && displayMode !== 'semplice' && ingKcal != null && (
                                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
                                            <MacroChip val={ingKcal} label="🔥 Kcal" color="#92400e" bg="#fef3c7" />
                                            {displayMode !== 'compatta' && <>
                                              {ingProt != null && <MacroChip val={`${ingProt}g`} label="💪 Prot" color="#1e40af" bg="#dbeafe" />}
                                              {ingCarb != null && <MacroChip val={`${ingCarb}g`} label="🍞 Carbo" color="#92400e" bg="#fef9c3" />}
                                              {ingFat != null && <MacroChip val={`${ingFat}g`} label="🧈 Grassi" color="#991b1b" bg="#fee2e2" />}
                                            </>}
                                          </div>
                                        )}
                                      </div>
                                    )
                                  })}
                                  {/* Recipe totals — only in normale mode */}
                                  {hasIngMacros && displayMode === 'normale' && recTotKcal > 0 && (
                                    <div style={{ padding: '6px 14px', background: '#d1fae5', display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                                      <span style={{ fontSize: 10, fontWeight: 700, color: '#065f46', letterSpacing: '.04em' }}>TOTALE RICETTA</span>
                                      <MacroChip val={recTotKcal} label="🔥 Kcal" color="#92400e" bg="#fef3c7" />
                                      <MacroChip val={`${Math.round(recTotProt * 10) / 10}g`} label="💪 Prot" color="#1e40af" bg="#dbeafe" />
                                      <MacroChip val={`${Math.round(recTotCarb * 10) / 10}g`} label="🍞 Carbo" color="#92400e" bg="#fef9c3" />
                                      <MacroChip val={`${Math.round(recTotFat * 10) / 10}g`} label="🧈 Grassi" color="#991b1b" bg="#fee2e2" />
                                    </div>
                                  )}
                                </div>
                              )
                            }

                            // Regular food item
                            const { food, fi } = block
                            const altKey = `${di}_${mi}_${fi}`
                            const selAltIdx = selectedAlts[altKey] ?? null
                            const alts = food.altPrint || []
                            const selectedAlt = selAltIdx != null ? alts[selAltIdx] : null

                            const nome = food.nome || food.name || food.alimento || ''
                            if (!nome) return null
                            const origQt = parseFloat(food.qt || food.quantita || food.quantity || food.grammi || food.grams || 0) || 0
                            const origUnit = food.misura || food.unita || food.unit || 'g'

                            const displayNome = selectedAlt ? (selectedAlt.nome || selectedAlt.name || nome) : nome
                            const displayQt = selectedAlt ? (parseFloat(selectedAlt.qt || selectedAlt.quantita || selectedAlt.quantity || origQt) || origQt) : origQt
                            const displayUnit = selectedAlt ? (selectedAlt.misura || 'g') : origUnit

                            const kcalItem   = food.kcal_100g     && displayQt ? Math.round(food.kcal_100g * displayQt / 100) : null
                            const protItem   = food.proteins_100g && displayQt ? Math.round(food.proteins_100g * displayQt / 100 * 10) / 10 : null
                            const carbItem   = food.carbs_100g    && displayQt ? Math.round(food.carbs_100g * displayQt / 100 * 10) / 10 : null
                            const fatItem    = food.fats_100g     && displayQt ? Math.round(food.fats_100g * displayQt / 100 * 10) / 10 : null
                            const fatSatItem = food.fatSat_100g   && displayQt ? Math.round(food.fatSat_100g * displayQt / 100 * 10) / 10 : null
                            const sugarItem  = food.sugar_100g    && displayQt ? Math.round(food.sugar_100g * displayQt / 100 * 10) / 10 : null
                            const saltItem   = food.salt_100g     && displayQt ? Math.round(food.salt_100g * displayQt / 100 * 10) / 10 : null

                            return (
                              <div key={bi} style={{ padding: '8px 14px', borderBottom: bi < blocks.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                                  <p style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text-primary)', flex: 1, lineHeight: 1.3 }}>{displayNome}</p>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                                    <span style={{ fontSize: 13, fontWeight: 800, color: 'white', background: selectedAlt ? 'var(--green-dark)' : 'var(--green-main)', padding: '2px 10px', borderRadius: 20 }}>
                                      {displayQt || ''}{displayUnit}
                                    </span>
                                  </div>
                                </div>
                                {hasMacros && displayMode !== 'semplice' && (kcalItem != null || protItem != null) && (
                                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 5 }}>
                                    <MacroChip val={kcalItem} label="🔥 Kcal" color="#92400e" bg="#fef3c7" />
                                    {displayMode !== 'compatta' && <>
                                      <MacroChip val={protItem != null ? `${protItem}g` : null} label="💪 Prot" color="#1e40af" bg="#dbeafe" />
                                      <MacroChip val={carbItem != null ? `${carbItem}g` : null} label="🍞 Carbo" color="#92400e" bg="#fef9c3" />
                                      <MacroChip val={fatItem != null ? `${fatItem}g` : null} label="🧈 Grassi" color="#991b1b" bg="#fee2e2" />
                                      <MacroChip val={fatSatItem != null ? `${fatSatItem}g` : null} label="🥩 Gr.sat" color="#7c2d12" bg="#fef2e2" />
                                      <MacroChip val={sugarItem != null ? `${sugarItem}g` : null} label="🍬 Zucch" color="#78350f" bg="#fef9c3" />
                                      <MacroChip val={saltItem != null ? `${saltItem}g` : null} label="🧂 Sale" color="#374151" bg="#f3f4f6" />
                                    </>}
                                  </div>
                                )}
                                {alts.length > 0 && (
                                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4, marginTop: 6 }}>
                                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '.04em', flexShrink: 0 }}>SOSTITUISCI CON</span>
                                    {selectedAlt && (
                                      <button
                                        onClick={() => setSelectedAlts(s => { const n = { ...s }; delete n[altKey]; return n })}
                                        style={{ fontSize: 11, fontWeight: 600, background: 'var(--surface-3)', color: 'var(--text-secondary)', padding: '3px 10px', borderRadius: 20, border: '1.5px solid var(--border-light)', whiteSpace: 'nowrap', cursor: 'pointer' }}
                                      >↩ Originale</button>
                                    )}
                                    {alts.map((a, ai) => (
                                      <button
                                        key={ai}
                                        onClick={() => setSelectedAlts(s => ({ ...s, [altKey]: selAltIdx === ai ? null : ai }))}
                                        style={{ fontSize: 11, fontWeight: 600, background: selAltIdx === ai ? 'var(--green-main)' : 'var(--surface-2)', color: selAltIdx === ai ? 'white' : 'var(--green-dark)', padding: '3px 10px', borderRadius: 20, border: selAltIdx === ai ? '1.5px solid var(--green-main)' : '1.5px solid var(--border-light)', whiteSpace: 'nowrap', cursor: 'pointer' }}
                                      >
                                        ⇄ {a.nome || a.name} {a.qt || a.quantita || a.quantity}{a.misura || 'g'}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )
                    })()}

                    {!foods.length && (meal.descrizione || meal.description) && (
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, padding: '10px 14px' }}>{meal.descrizione || meal.description}</p>
                    )}

                    {note && (
                      <div style={{ margin: '0 14px 10px', padding: '8px 12px', background: '#fffbeb', borderRadius: 10, borderLeft: '3px solid #f59e0b', fontSize: 12, color: '#92400e', lineHeight: 1.5 }}>
                        💡 {note}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function LatestClinicalPlanCard({ piano }) {
  const title = piano.nome || 'Piano alimentare'
  const savedStr = piano.saved_at
    ? new Date(piano.saved_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  return (
    <div style={{ borderRadius: 18, overflow: 'hidden', border: '1px solid var(--border-light)', background: 'var(--surface)', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
      {/* Coloured top accent */}
      <div style={{ height: 4, background: 'linear-gradient(90deg, var(--green-main), var(--green-dark))' }} />

      {/* Header */}
      <div style={{ padding: '16px 18px', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid #bbf7d0' }}>
        <div style={{ width: 46, height: 46, borderRadius: 14, background: 'var(--green-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(26,127,90,0.3)' }}>
          <ClipboardList size={22} color="white" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 11, color: 'var(--green-dark)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700, marginBottom: 3 }}>Piano alimentare personalizzato</p>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--green-dark)', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</h3>
          {savedStr && <p style={{ fontSize: 12, color: '#4d7c5a', marginTop: 3 }}>📅 {savedStr}</p>}
        </div>
        {piano.print_image_url && (
          <a
            href={piano.print_image_url}
            download={`${title}.png`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            title="Scarica immagine"
            style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 11, background: 'var(--green-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textDecoration: 'none', boxShadow: '0 2px 6px rgba(26,127,90,0.25)' }}
          >
            <Download size={17} />
          </a>
        )}
      </div>

      {/* Always show table — image is accessible from Documents section */}
      <PianoAlimentareContent piano={piano} />
    </div>
  )
}

function OlderClinicalPlanCard({ piano }) {
  const [expanded, setExpanded] = useState(false)
  const title = piano.nome || 'Piano alimentare'
  const savedStr = piano.saved_at
    ? new Date(piano.saved_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  return (
    <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border-light)', background: 'var(--surface)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
      <button
        onClick={() => setExpanded(v => !v)}
        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}
      >
        <div style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Calendar size={16} color="var(--text-muted)" />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</p>
          {savedStr && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{savedStr}</p>}
        </div>
        {expanded ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
      </button>

      {expanded && (
        <div style={{ borderTop: '1px solid var(--border-light)' }}>
          <PianoAlimentareContent piano={piano} />
        </div>
      )}
    </div>
  )
}

export default function DietPage() {
  const { user, profile } = useAuth()
  const t = useT()
  const [diet, setDiet] = useState(null)
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(0)
  const [completions, setCompletions] = useState(new Set())
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [selectedHistoryId, setSelectedHistoryId] = useState(null)
  const [historyMeals, setHistoryMeals] = useState([])
  const [clinicalPlans, setClinicalPlans] = useState([])
  const [showOlderPlans, setShowOlderPlans] = useState(false)
  const [copyDiet, setCopyDiet] = useState({ open: false, date: '', busy: false, done: false })
  const [foodOverrides, setFoodOverrides] = useState({})

  const setFoodOverride = useCallback((key, val) => {
    setFoodOverrides(prev => {
      const next = { ...prev }
      if (val === null) delete next[key]
      else next[key] = val
      return next
    })
  }, [])

  const today = useMemo(() => new Date().toISOString().split('T')[0], [])

  const allergenWarning = useMemo(() => {
    if (!profile?.intolerances?.length) return null
    const intolerances = profile.intolerances.map(i => i.toLowerCase().trim()).filter(Boolean)
    const problematic = new Set()
    for (const meal of meals) {
      for (const food of (meal.foods || [])) {
        const name = (food.name || food.nome || '').toLowerCase()
        for (const intol of intolerances) {
          if (name.includes(intol)) problematic.add(food.name || food.nome)
        }
      }
    }
    for (const piano of clinicalPlans) {
      try {
        const raw = typeof piano.meals === 'string' ? JSON.parse(piano.meals) : piano.meals
        for (const day of (Array.isArray(raw) ? raw : [])) {
          for (const meal of (day.meals || [])) {
            for (const food of (meal.items || meal.foods || meal.alimenti || [])) {
              const name = (food.nome || food.name || food.alimento || '').toLowerCase()
              for (const intol of intolerances) {
                if (name.includes(intol)) problematic.add(food.nome || food.name || food.alimento)
              }
            }
          }
        }
      } catch { /* ignore parse errors */ }
    }
    return problematic.size > 0 ? [...problematic] : null
  }, [profile?.intolerances, meals, clinicalPlans])

  useEffect(() => {
    async function load() {
      // Batch 1: active diet, diet history, and cartella link all in parallel
      const [{ data: activeDiet }, { data: allDiets }, linkRes] = await Promise.all([
        supabase.from('patient_diets').select('id, name, kcal_target, protein_target, carbs_target, fats_target, duration_weeks, notes').eq('user_id', user.id).eq('is_active', true).maybeSingle(),
        supabase.from('patient_diets').select('id, name, created_at, kcal_target, duration_weeks').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('patient_dietitian').select('cartella_id').eq('patient_id', user.id).maybeSingle().then(r => r, () => ({ data: null })),
      ])
      setDiet(activeDiet)
      setHistory((allDiets || []).filter(d => !activeDiet || d.id !== activeDiet.id))

      const cartellaId = linkRes?.data?.cartella_id ?? null

      // Batch 2: meal details + clinical plans in parallel (both depend on batch 1 results)
      const batch2 = []
      if (activeDiet) {
        batch2.push(
          supabase.from('diet_meals').select('id,diet_id,meal_type,meal_order,day_number,kcal,proteins,carbs,fats,notes,description,foods').eq('diet_id', activeDiet.id).order('day_number').order('meal_order'),
          supabase.from('meal_completions').select('diet_meal_id').eq('user_id', user.id).eq('date', today),
        )
      } else {
        batch2.push(Promise.resolve({ data: null }), Promise.resolve({ data: null }))
      }
      if (cartellaId) {
        batch2.push(
          supabase.from('piani').select('id, nome, data_piano, meals, print_image_url, saved_at, display_mode').eq('cartella_id', cartellaId).eq('visible_to_patient', true).order('saved_at', { ascending: false }).then(r => r, () => ({ data: null }))
        )
      } else {
        batch2.push(Promise.resolve({ data: null }))
      }

      const [mealsRes, completionsRes, pianiRes] = await Promise.all(batch2)
      if (activeDiet) {
        setMeals(mealsRes.data || [])
        setCompletions(new Set((completionsRes.data || []).map(c => c.diet_meal_id)))
      }
      if (pianiRes.data) setClinicalPlans(pianiRes.data)

      setLoading(false)
    }
    load()
  }, [today])

  const toggleComplete = useCallback(async (mealId) => {
    const isCompleted = completions.has(mealId)
    setCompletions(prev => {
      const next = new Set(prev)
      if (isCompleted) next.delete(mealId)
      else next.add(mealId)
      return next
    })
    try {
      if (isCompleted) {
        await supabase.from('meal_completions').delete().eq('user_id', user.id).eq('diet_meal_id', mealId).eq('date', today)
      } else {
        await supabase.from('meal_completions').upsert(
          { user_id: user.id, diet_meal_id: mealId, date: today },
          { onConflict: 'user_id,diet_meal_id,date' }
        )
      }
    } catch {
      setCompletions(prev => {
        const next = new Set(prev)
        if (isCompleted) next.add(mealId)
        else next.delete(mealId)
        return next
      })
    }
  }, [completions, today])

  const handleHistorySelect = useCallback(async (dietId) => {
    if (selectedHistoryId === dietId) {
      setSelectedHistoryId(null)
      setHistoryMeals([])
      return
    }
    setSelectedHistoryId(dietId)
    const { data } = await supabase.from('diet_meals').select('id,diet_id,meal_type,meal_order,day_number,kcal,proteins,carbs,fats,notes,description,foods').eq('diet_id', dietId).order('day_number').order('meal_order')
    setHistoryMeals(data || [])
  }, [selectedHistoryId])

  const copyDayMealsToLog = useCallback(async (targetDate) => {
    setCopyDiet(s => ({ ...s, busy: true }))
    const dayNumber = tab + 1
    const mealsForDay = meals.filter(m => m.day_number === dayNumber || !m.day_number)
    const inserts = []
    for (const meal of mealsForDay) {
      const foods = meal.foods || []
      if (foods.length > 0) {
        for (let fi = 0; fi < foods.length; fi++) {
          const food = foods[fi]
          const overrideKey = `${meal.id}_${fi}`
          const override = foodOverrides[overrideKey]
          let name, qty, k100, p100, c100, f100
          if (override?.subIdx != null && food.substitutes?.[override.subIdx]) {
            const sub = food.substitutes[override.subIdx]
            name = sub.name
            qty = parseFloat(override.grams || sub.quantity) || 0
            k100 = sub.kcal_100g || 0; p100 = sub.proteins_100g || 0
            c100 = sub.carbs_100g || 0; f100 = sub.fats_100g || 0
          } else {
            name = food.name || food.nome || ''
            if (!name) continue
            qty = parseFloat(food.quantity || food.qt || 100) || 0
            k100 = food.kcal_100g || 0; p100 = food.proteins_100g || 0
            c100 = food.carbs_100g || 0; f100 = food.fats_100g || 0
          }
          if (!name) continue
          inserts.push({
            user_id: user.id, date: targetDate, meal_type: meal.meal_type,
            food_name: name, grams: qty,
            kcal: k100 ? Math.round(k100 * qty / 100) : null,
            proteins: p100 ? Math.round(p100 * qty / 100 * 10) / 10 : null,
            carbs: c100 ? Math.round(c100 * qty / 100 * 10) / 10 : null,
            fats: f100 ? Math.round(f100 * qty / 100 * 10) / 10 : null,
            food_data: { source: 'diet_plan', plan_nome: diet?.name || '' },
          })
        }
      } else if (meal.kcal) {
        // No individual foods saved — insert one entry per meal with aggregate macros
        inserts.push({
          user_id: user.id, date: targetDate, meal_type: meal.meal_type,
          food_name: meal.description || t(`meal.${meal.meal_type}`) || meal.meal_type,
          grams: 0,
          kcal: meal.kcal || null, proteins: meal.proteins || null,
          carbs: meal.carbs || null, fats: meal.fats || null,
          food_data: { source: 'diet_plan', plan_nome: diet?.name || '' },
        })
      }
    }
    if (inserts.length) {
      const { error } = await supabase.from('food_logs').insert(inserts)
      if (error) console.error('copy error', error)
      const { data: allFoods } = await supabase.from('food_logs').select('kcal,proteins,carbs,fats').eq('user_id', user.id).eq('date', targetDate)
      if (allFoods) {
        const tot = allFoods.reduce((a, r) => ({ kcal: a.kcal + (r.kcal || 0), proteins: a.proteins + (r.proteins || 0), carbs: a.carbs + (r.carbs || 0), fats: a.fats + (r.fats || 0) }), { kcal: 0, proteins: 0, carbs: 0, fats: 0 })
        await supabase.from('daily_logs').upsert({ user_id: user.id, date: targetDate, ...tot }, { onConflict: 'user_id,date' })
      }
    }
    setCopyDiet({ open: false, date: '', busy: false, done: true })
    setTimeout(() => setCopyDiet(s => ({ ...s, done: false })), 3000)
  }, [meals, tab, user.id, diet, t, foodOverrides])

  if (loading) return (
    <div className="page" style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="skeleton" style={{ height: 24, width: '45%', marginBottom: 4 }} />
      {[1, 2, 3].map(i => (
        <div key={i} className="card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 12 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: 14, width: '55%', marginBottom: 6 }} />
              <div className="skeleton" style={{ height: 11, width: '35%' }} />
            </div>
          </div>
          <div className="skeleton" style={{ height: 10, width: '90%' }} />
          <div className="skeleton" style={{ height: 10, width: '70%' }} />
        </div>
      ))}
    </div>
  )

  if (!diet && clinicalPlans.length === 0) return (
    <div className="page" style={{ padding: 32 }}>
      <div style={{ textAlign: 'center', paddingTop: 40, paddingBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🥗</div>
        <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 22, fontWeight: 300, marginBottom: 8 }}>{t('diet.no_plan')}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>{t('diet.contact_dietitian')}</p>
      </div>

      {history.length > 0 && (
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 12 }}>Piani precedenti</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {history.map(d => (
              <HistoryDietCard
                key={d.id}
                diet={d}
                onSelect={handleHistorySelect}
                selected={selectedHistoryId === d.id}
                meals={selectedHistoryId === d.id ? historyMeals : []}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const dayMeals = diet ? meals.filter(m => m.day_number === tab + 1 || !m.day_number) : []
  const hasWeekly = diet ? meals.some(m => m.day_number) : false
  const completedCount = dayMeals.filter(m => completions.has(m.id)).length
  const allDone = dayMeals.length > 0 && completedCount === dayMeals.length

  return (
    <div className="page">
      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg, var(--green-dark) 0%, var(--green-main) 100%)', padding: 'calc(env(safe-area-inset-top) + 18px) 20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: diet ? 16 : 0 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Leaf size={22} color="white" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 2 }}>
              {diet ? 'Piano attivo' : t('diet.title')}
            </p>
            <h1 style={{ fontFamily: 'var(--font-d)', fontSize: 21, color: 'white', fontWeight: 300, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {diet ? (diet.name || 'Piano personalizzato') : 'Piani alimentari'}
            </h1>
          </div>
        </div>
        {diet && (
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { label: `${diet.kcal_target || '–'}`, sub: 'kcal/giorno', icon: '🔥' },
              { label: `${diet.protein_target || '–'}g`, sub: 'proteine', icon: '💪' },
              { label: `${diet.duration_weeks || '–'} sett.`, sub: 'durata', icon: '📅' },
            ].map(s => (
              <div key={s.sub} style={{ flex: 1, background: 'rgba(255,255,255,0.13)', borderRadius: 14, padding: '10px 8px', border: '1px solid rgba(255,255,255,0.18)', textAlign: 'center' }}>
                <p style={{ fontSize: 9, marginBottom: 2 }}>{s.icon}</p>
                <p style={{ color: 'white', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-b)', lineHeight: 1 }}>{s.label}</p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, marginTop: 2 }}>{s.sub}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Allergen warning */}
        {allergenWarning && (
          <div style={{ background: '#fefce8', border: '1.5px solid #fbbf24', borderRadius: 14, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1 }}>⚠️</span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#92400e', marginBottom: 3 }}>Attenzione alle tue intolleranze</p>
              <p style={{ fontSize: 12, color: '#78350f', lineHeight: 1.5 }}>
                Questo piano contiene alimenti che potrebbero non essere adatti alle tue intolleranze:{' '}
                <strong>{allergenWarning.join(', ')}</strong>
              </p>
            </div>
          </div>
        )}

        {/* Clinical plans from dietitian portal */}
        {clinicalPlans.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <ClipboardList size={15} color="var(--green-main)" />
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Piano dal dietista</span>
            </div>

            {/* Latest plan shown directly */}
            <LatestClinicalPlanCard piano={clinicalPlans[0]} />

            {/* Older plans collapsible */}
            {clinicalPlans.length > 1 && (
              <div style={{ marginTop: 10 }}>
                <button
                  onClick={() => setShowOlderPlans(v => !v)}
                  style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', color: 'var(--text-secondary)' }}
                >
                  <History size={16} />
                  <span style={{ fontSize: 14, fontWeight: 600 }}>Piani precedenti ({clinicalPlans.length - 1})</span>
                  {showOlderPlans ? <ChevronUp size={16} style={{ marginLeft: 'auto' }} /> : <ChevronDown size={16} style={{ marginLeft: 'auto' }} />}
                </button>
                {showOlderPlans && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {clinicalPlans.slice(1).map(plan => (
                      <OlderClinicalPlanCard key={plan.id} piano={plan} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {diet && (
          <>
            {/* Day tabs */}
            {hasWeekly && (
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, WebkitOverflowScrolling: 'touch' }}>
                {DAYS.map((d, i) => (
                  <button key={d} onClick={() => setTab(i)} style={{
                    flexShrink: 0, padding: '8px 16px', borderRadius: 100,
                    background: tab === i ? 'var(--green-main)' : 'var(--surface)',
                    color: tab === i ? 'white' : 'var(--text-secondary)',
                    border: `1.5px solid ${tab === i ? 'transparent' : 'var(--border)'}`,
                    font: 'inherit', fontSize: 13, fontWeight: 500, cursor: 'pointer'
                  }}>
                    {d.slice(0, 3)}
                  </button>
                ))}
              </div>
            )}

            {/* Diet notes */}
            {diet.notes && (
              <div style={{ background: 'var(--green-pale)', borderRadius: 14, padding: '14px 16px', display: 'flex', gap: 10 }}>
                <FileText size={16} color="var(--green-main)" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 13, color: 'var(--green-dark)', lineHeight: 1.6 }}>{diet.notes}</p>
              </div>
            )}

            {/* Daily nutrition summary */}
            {dayMeals.length > 0 && dayMeals.some(m => m.kcal) && (
              <DailyNutritionSummary meals={dayMeals} diet={diet} />
            )}

            {/* Meal completion progress */}
            {dayMeals.length > 0 && (
              <div style={{ background: allDone ? 'var(--green-pale)' : 'var(--surface)', borderRadius: 16, padding: '13px 16px', border: `1px solid ${allDone ? 'var(--green-light)' : 'var(--border-light)'}`, display: 'flex', alignItems: 'center', gap: 12, transition: 'background 0.3s, border-color 0.3s' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                    <span style={{ fontSize: 13, color: allDone ? 'var(--green-dark)' : 'var(--text-secondary)', fontWeight: 600, fontFamily: 'var(--font-b)' }}>
                      {allDone ? '🎉 Tutti i pasti completati!' : 'Avanzamento pasti'}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: allDone ? 'var(--green-main)' : 'var(--text-muted)', fontFamily: 'var(--font-b)' }}>{completedCount}/{dayMeals.length}</span>
                  </div>
                  <div style={{ height: 7, background: 'var(--surface-3)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(completedCount / dayMeals.length) * 100}%`, background: 'var(--green-main)', borderRadius: 4, transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Copy day to diary */}
            {dayMeals.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {copyDiet.done ? (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'var(--green-pale)', borderRadius: 12, border: '1px solid var(--green-light)' }}>
                    <Check size={16} color="var(--green-main)" />
                    <span style={{ fontSize: 13, color: 'var(--green-dark)', fontWeight: 600 }}>Aggiunto al diario!</span>
                  </div>
                ) : copyDiet.open ? (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 12, border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600, flexShrink: 0 }}>📋 Copia in data:</span>
                    <input
                      type="date"
                      value={copyDiet.date || today}
                      onChange={e => setCopyDiet(s => ({ ...s, date: e.target.value }))}
                      style={{ flex: 1, padding: '5px 8px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
                    />
                    <button
                      onClick={() => copyDayMealsToLog(copyDiet.date || today)}
                      disabled={copyDiet.busy}
                      style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: 'var(--green-main)', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: copyDiet.busy ? 0.6 : 1, flexShrink: 0 }}
                    >{copyDiet.busy ? '⏳' : 'Copia'}</button>
                    <button onClick={() => setCopyDiet(s => ({ ...s, open: false }))} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)' }}>✕</button>
                  </div>
                ) : (
                  <button
                    onClick={() => setCopyDiet({ open: true, date: today, busy: false, done: false })}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 12, border: '1.5px dashed var(--border)', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600 }}
                  >
                    <ClipboardCopy size={15} />
                    Copia questo giorno nel diario alimentare
                  </button>
                )}
              </div>
            )}

            {/* Meals */}
            {dayMeals.length > 0
              ? dayMeals.map((m, i) => (
                <motion.div
                  key={m.id || i}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <MealCard
                    meal={m}
                    completed={completions.has(m.id)}
                    onToggleComplete={toggleComplete}
                    user={user}
                    foodOverrides={foodOverrides}
                    onFoodOverride={setFoodOverride}
                  />
                </motion.div>
              ))
              : <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>Nessun pasto per questo giorno</div>
            }
          </>
        )}

        {!diet && clinicalPlans.length > 0 && (
          <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: 13 }}>Non è presente un piano alimentare dettagliato con i pasti. Consulta i piani del dietista sopra.</p>
          </div>
        )}

        {/* History section */}
        {history.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <button
              onClick={() => setShowHistory(v => !v)}
              style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', color: 'var(--text-secondary)' }}
            >
              <History size={16} />
              <span style={{ fontSize: 14, fontWeight: 600 }}>Storico piani ({history.length})</span>
              {showHistory ? <ChevronUp size={16} style={{ marginLeft: 'auto' }} /> : <ChevronDown size={16} style={{ marginLeft: 'auto' }} />}
            </button>

            {showHistory && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {history.map(d => (
                  <HistoryDietCard
                    key={d.id}
                    diet={d}
                    onSelect={handleHistorySelect}
                    selected={selectedHistoryId === d.id}
                    meals={selectedHistoryId === d.id ? historyMeals : []}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
