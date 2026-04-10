import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Utensils, Clock, ChevronDown, ChevronUp, Flame, Leaf, FileText } from 'lucide-react'

const MEAL_LABELS = {
  colazione: { label: 'Colazione', icon: '☀️', time: '07:00–08:30' },
  spuntino_mattina: { label: 'Spuntino mattina', icon: '🍎', time: '10:00–10:30' },
  pranzo: { label: 'Pranzo', icon: '🍽️', time: '12:30–13:30' },
  spuntino_pomeriggio: { label: 'Spuntino pomeriggio', icon: '🥤', time: '15:30–16:00' },
  cena: { label: 'Cena', icon: '🌙', time: '19:30–20:30' },
}

function MealCard({ meal }) {
  const [open, setOpen] = useState(false)
  const meta = MEAL_LABELS[meal.meal_type] || { label: meal.meal_type, icon: '🍴', time: '' }

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <button onClick={() => setOpen(v => !v)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
        <span style={{ fontSize: 26 }}>{meta.icon}</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{meta.label}</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 3 }}>
            {meta.time && <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={11} />{meta.time}</span>}
            {meal.kcal && <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}><Flame size={11} />{meal.kcal} kcal</span>}
          </div>
        </div>
        {open ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
      </button>

      {open && (
        <div style={{ borderTop: '1px solid var(--border-light)', padding: '14px 18px 16px' }}>
          {meal.foods && meal.foods.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: meal.notes ? 12 : 0 }}>
              {meal.foods.map((food, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>{food.name}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{food.quantity} {food.unit || 'g'}</span>
                </div>
              ))}
            </div>
          ) : meal.description ? (
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: meal.notes ? 12 : 0 }}>{meal.description}</p>
          ) : null}

          {meal.notes && (
            <div style={{ background: 'var(--green-pale)', borderRadius: 10, padding: '10px 12px', marginTop: 8 }}>
              <p style={{ fontSize: 13, color: 'var(--green-dark)', lineHeight: 1.5 }}>💡 {meal.notes}</p>
            </div>
          )}

          {meal.kcal && (
            <div style={{ display: 'flex', gap: 12, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-light)' }}>
              {[
                { label: 'Proteine', val: meal.proteins, color: '#3b82f6' },
                { label: 'Carboidrati', val: meal.carbs, color: '#f0922b' },
                { label: 'Grassi', val: meal.fats, color: '#e05a5a' },
              ].filter(m => m.val).map(m => (
                <div key={m.label} style={{ flex: 1, textAlign: 'center', padding: '8px', background: 'var(--surface-2)', borderRadius: 8 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: m.color }}>{m.val}g</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function DietPage() {
  const [diet, setDiet] = useState(null)
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(0)

  const DAYS = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica']

  useEffect(() => {
    async function load() {
      const { data: activeDiet } = await supabase
        .from('patient_diets').select('*').eq('is_active', true).maybeSingle()
      setDiet(activeDiet)
      if (activeDiet) {
        const { data: mealData } = await supabase
          .from('diet_meals').select('*').eq('diet_id', activeDiet.id).order('day_number').order('meal_order')
        setMeals(mealData || [])
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh' }}>
      <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--green-main)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  )

  if (!diet) return (
    <div className="page" style={{ alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🥗</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 300, marginBottom: 8 }}>Nessun piano attivo</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>Il tuo dietista non ha ancora caricato un piano alimentare. Contattalo per iniziare il percorso.</p>
    </div>
  )

  const dayMeals = meals.filter(m => m.day_number === tab + 1 || !m.day_number)
  const hasWeekly = meals.some(m => m.day_number)

  return (
    <div className="page">
      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg, var(--green-dark) 0%, var(--green-main) 100%)', padding: 'calc(env(safe-area-inset-top) + 20px) 24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: 14, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Leaf size={20} color="white" />
          </div>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Piano attivo</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'white', fontWeight: 300 }}>{diet.name || 'Piano personalizzato'}</h1>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { label: `${diet.kcal_target || '–'} kcal`, sub: 'obiettivo' },
            { label: `${diet.protein_target || '–'}g`, sub: 'proteine' },
            { label: `${diet.duration_weeks || '–'} sett.`, sub: 'durata' },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: '10px 12px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <p style={{ color: 'white', fontSize: 15, fontWeight: 600 }}>{s.label}</p>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11 }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Day tabs if weekly plan */}
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

        {/* Notes */}
        {diet.notes && (
          <div style={{ background: 'var(--green-pale)', borderRadius: 14, padding: '14px 16px', display: 'flex', gap: 10 }}>
            <FileText size={16} color="var(--green-main)" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 13, color: 'var(--green-dark)', lineHeight: 1.6 }}>{diet.notes}</p>
          </div>
        )}

        {/* Meals */}
        {dayMeals.length > 0
          ? dayMeals.map((m, i) => <MealCard key={m.id || i} meal={m} />)
          : <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>Nessun pasto per questo giorno</div>
        }
      </div>
    </div>
  )
}
