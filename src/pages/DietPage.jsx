import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Clock, ChevronDown, ChevronUp, Flame, Leaf, FileText, CheckCircle2, Circle, History, RefreshCw, TrendingUp, Calendar, Download, ClipboardList, ImageOff } from 'lucide-react'
import { useT } from '../i18n'

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
  const total = meals.reduce((acc, m) => ({
    kcal: acc.kcal + (m.kcal || 0),
    proteins: acc.proteins + Number(m.proteins || 0),
    carbs: acc.carbs + Number(m.carbs || 0),
    fats: acc.fats + Number(m.fats || 0),
  }), { kcal: 0, proteins: 0, carbs: 0, fats: 0 })

  const kcalPct = diet?.kcal_target ? Math.min(100, Math.round((total.kcal / diet.kcal_target) * 100)) : null

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
          { label: 'Kcal', val: total.kcal, color: '#f0922b' },
          { label: t('diet.proteins'), val: Math.round(total.proteins) + 'g', color: '#3b82f6' },
          { label: t('diet.carbs'), val: Math.round(total.carbs) + 'g', color: '#f0922b' },
          { label: t('diet.fats'), val: Math.round(total.fats) + 'g', color: '#e05a5a' },
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

function FoodItem({ food }) {
  const [showSubs, setShowSubs] = useState(false)
  const hasSubs = food.substitutes && food.substitutes.length > 0

  return (
    <div style={{ padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', fontFamily: 'var(--font-b)' }}>{food.name}</span>
          {hasSubs && (
            <button
              onClick={() => setShowSubs(v => !v)}
              style={{ background: 'var(--green-pale)', border: 'none', cursor: 'pointer', color: 'var(--green-main)', fontSize: 10, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 8px', borderRadius: 100 }}
            >
              <RefreshCw size={9} />
              {showSubs ? 'Nascondi' : 'Alt.'}
            </button>
          )}
        </div>
        <span style={{ fontSize: 13, color: 'var(--green-main)', fontWeight: 700, flexShrink: 0, background: 'var(--green-pale)', padding: '2px 9px', borderRadius: 100, fontFamily: 'var(--font-b)' }}>
          {food.quantity} {food.unit || 'g'}
        </span>
      </div>
      {hasSubs && showSubs && (
        <div style={{ marginTop: 8, padding: '8px 12px', background: 'var(--surface-2)', borderRadius: 10, borderLeft: '3px solid var(--green-main)' }}>
          <p style={{ fontSize: 11, color: 'var(--green-dark)', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Sostituti:</p>
          {food.substitutes.map((sub, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: i > 0 ? 5 : 0 }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'var(--font-b)' }}>{sub.name}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{sub.quantity} {sub.unit || 'g'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function MealCard({ meal, completed, onToggleComplete }) {
  const [open, setOpen] = useState(false)
  const meta = MEAL_LABELS[meal.meal_type] || { label: meal.meal_type, icon: '🍴', time: '', accent: 'var(--green-main)', pale: 'var(--green-pale)' }

  return (
    <div style={{
      borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border-light)',
      background: 'var(--surface)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      opacity: completed ? 0.85 : 1, transition: 'opacity 0.2s',
    }}>
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
              {meta.time && <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={10} />{meta.time}</span>}
              {meal.kcal && <span style={{ fontSize: 12, color: meta.accent, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}><Flame size={10} color={meta.accent} />{meal.kcal} kcal</span>}
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
      </div>

      {open && (
        <div style={{ borderTop: '1px solid var(--border-light)', padding: '14px 16px 16px' }}>
          {meal.foods && meal.foods.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: meal.notes ? 12 : 0 }}>
              {meal.foods.map((food, i) => <FoodItem key={i} food={food} />)}
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
                { label: 'Proteine', val: meal.proteins, color: '#3b82f6' },
                { label: 'Carboidrati', val: meal.carbs, color: '#f0922b' },
                { label: 'Grassi', val: meal.fats, color: '#e05a5a' },
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
                  const meta = MEAL_LABELS[m.meal_type] || { label: m.meal_type, icon: '🍴' }
                  return (
                    <div key={m.id || i} style={{ padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 18 }}>{meta.icon}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{meta.label}</span>
                        {m.kcal && <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>{m.kcal} kcal</span>}
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

function PianoAlimentareContent({ piano }) {
  let days = []
  try {
    const raw = typeof piano.meals === 'string' ? JSON.parse(piano.meals) : piano.meals
    days = Array.isArray(raw) ? raw : []
  } catch { days = [] }

  const title = piano.nome || 'Piano alimentare'
  const dataStr = piano.data_piano ? new Date(piano.data_piano).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

  return (
    <div style={{ padding: '16px 16px 20px' }}>
      {days.length > 0 ? days.map((day, di) => (
        <div key={day.id || di} style={{ marginBottom: 20 }}>
          <div style={{ background: 'linear-gradient(90deg, var(--green-main), var(--green-dark))', color: 'white', padding: '8px 14px', borderRadius: 10, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📅</span>
            <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.01em' }}>{day.nome || `Giorno ${di + 1}`}</span>
          </div>
          {(day.meals || []).map((meal, mi) => {
            const mealKey = meal.id || meal.tipo || ''
            const meta = MEAL_PRINT_LABELS[mealKey] || { label: meal.nome || meal.id || 'Pasto', emoji: '🍴' }
            const foods = meal.items || meal.foods || meal.alimenti || []
            const kcal = meal.kcal || meal.calorie || null
            const note = meal.note || meal.notes || ''
            const mealEmoji = meal.emoji || meta.emoji
            const mealLabel = meal.nome || meta.label
            return (
              <div key={meal.id || mi} style={{ border: '1px solid var(--border-light)', borderRadius: 12, overflow: 'hidden', marginBottom: 8, background: 'var(--surface)' }}>
                <div style={{ padding: '9px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', background: 'var(--surface-2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 17 }}>{mealEmoji}</span>
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--green-dark)' }}>{mealLabel}</span>
                  </div>
                  {kcal && <span style={{ fontSize: 12, color: 'var(--green-main)', background: 'var(--green-pale)', padding: '2px 9px', borderRadius: 100, fontWeight: 600 }}>🔥 {kcal} kcal</span>}
                </div>
                <div style={{ padding: '10px 14px' }}>
                  {foods.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                      <tbody>
                        {foods.map((food, fi) => (
                          <tr key={fi} style={{ borderBottom: fi < foods.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                            <td style={{ padding: '5px 0', color: 'var(--text-primary)', fontWeight: 500 }}>{food.nome || food.name || food.alimento || ''}</td>
                            <td style={{ padding: '5px 0', textAlign: 'right', color: 'var(--green-main)', fontWeight: 700 }}>
                              {food.qt || food.quantita || food.quantity || food.grammi || food.grams || ''}{food.misura || food.unita || food.unit || 'g'}
                            </td>
                          </tr>
                        ))}
                        {foods.some(f => f.altPrint?.length > 0) && (
                          <tr><td colSpan={2} style={{ padding: '4px 0 0', fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            Alt: {foods.flatMap(f => f.altPrint || []).map(a => `${a.nome} ${a.qt}g`).join(' / ')}
                          </td></tr>
                        )}
                      </tbody>
                    </table>
                  ) : (meal.descrizione || meal.description) ? (
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{meal.descrizione || meal.description}</p>
                  ) : null}
                  {note && (
                    <div style={{ marginTop: 8, padding: '7px 11px', background: '#fffbeb', borderRadius: 8, borderLeft: '3px solid #f59e0b', fontSize: 12, color: '#92400e', lineHeight: 1.5 }}>
                      💡 {note}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )) : (
        <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
          <ImageOff size={32} style={{ opacity: 0.3, marginBottom: 10 }} />
          <p style={{ fontSize: 14 }}>Il dietista non ha ancora aggiunto il dettaglio dei pasti.</p>
        </div>
      )}
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

      {/* Content: image or JSON renderer */}
      {piano.print_image_url ? (
        <div style={{ background: '#f1f5f9', padding: '18px 16px 20px' }}>
          <img
            src={piano.print_image_url}
            alt={title}
            style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.13)', background: 'white' }}
          />
        </div>
      ) : (
        <PianoAlimentareContent piano={piano} />
      )}
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
          {piano.print_image_url ? (
            <div style={{ background: '#f1f5f9', padding: '14px 14px 16px' }}>
              <img
                src={piano.print_image_url}
                alt={title}
                style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.1)', background: 'white' }}
              />
            </div>
          ) : (
            <PianoAlimentareContent piano={piano} />
          )}
        </div>
      )}
    </div>
  )
}

export default function DietPage() {
  const { user } = useAuth()
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

  const today = useMemo(() => new Date().toISOString().split('T')[0], [])
  const MEAL_LABELS = useMemo(() => Object.fromEntries(
    Object.entries(MEAL_META_STATIC).map(([k, v]) => [k, { ...v, label: t(`meal.${k}`) }])
  ), [t])

  useEffect(() => {
    async function load() {
      const [{ data: activeDiet }, { data: allDiets }] = await Promise.all([
        supabase.from('patient_diets').select('*').eq('user_id', user.id).eq('is_active', true).maybeSingle(),
        supabase.from('patient_diets').select('id, name, created_at, kcal_target, duration_weeks').eq('user_id', user.id).order('created_at', { ascending: false }),
      ])
      setDiet(activeDiet)
      setHistory((allDiets || []).filter(d => !activeDiet || d.id !== activeDiet.id))

      if (activeDiet) {
        const [{ data: mealData }, { data: completionData }] = await Promise.all([
          supabase.from('diet_meals').select('*').eq('diet_id', activeDiet.id).order('day_number').order('meal_order'),
          supabase.from('meal_completions').select('diet_meal_id').eq('user_id', user.id).eq('date', today),
        ])
        setMeals(mealData || [])
        setCompletions(new Set((completionData || []).map(c => c.diet_meal_id)))
      }

      // Load clinical diet plans from dietitian portal (piani table via cartella_id)
      try {
        const { data: link } = await supabase
          .from('patient_dietitian')
          .select('cartella_id')
          .eq('patient_id', user.id)
          .maybeSingle()

        if (link?.cartella_id) {
          const { data: pianiData } = await supabase
            .from('piani')
            .select('*')
            .eq('cartella_id', link.cartella_id)
            .eq('visible_to_patient', true)
            .order('saved_at', { ascending: false })
          setClinicalPlans(pianiData || [])
        }
      } catch {
        // Table may not exist
      }

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
    const { data } = await supabase.from('diet_meals').select('*').eq('diet_id', dietId).order('day_number').order('meal_order')
    setHistoryMeals(data || [])
  }, [selectedHistoryId])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh' }}>
      <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--green-main)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
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

            {/* Meals */}
            {dayMeals.length > 0
              ? dayMeals.map((m, i) => (
                <MealCard
                  key={m.id || i}
                  meal={m}
                  completed={completions.has(m.id)}
                  onToggleComplete={toggleComplete}
                />
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
