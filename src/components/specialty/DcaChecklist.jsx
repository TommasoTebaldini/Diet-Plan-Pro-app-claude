import { useState, useEffect } from 'react'
import { HeartPulse, Check } from 'lucide-react'

function todayKey() {
  const d = new Date()
  return `dca_meals_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Deliberately no calorie/macro numbers here — for a patient in an eating
// disorder pathway, a numeric adherence score can do more harm than good.
// This is just a gentle "have you had your meals today" presence tracker.
export default function DcaChecklist({ dati }) {
  const [checked, setChecked] = useState({})
  const storageKey = todayKey()

  useEffect(() => {
    try { setChecked(JSON.parse(localStorage.getItem(storageKey) || '{}')) } catch { setChecked({}) }
  }, [storageKey])

  function toggle(name) {
    const next = { ...checked, [name]: !checked[name] }
    setChecked(next)
    try { localStorage.setItem(storageKey, JSON.stringify(next)) } catch { /* storage unavailable */ }
  }

  const pasti = (dati.piano?.pasti || []).filter(m => m && (m.nome || m.alimenti))
  if (!pasti.length) return null

  const doneCount = pasti.filter((m, i) => checked[m.nome || `pasto-${i}`]).length

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: '#FFE4E6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <HeartPulse size={16} color="#E11D48" />
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 700 }}>I tuoi pasti di oggi</h3>
      </div>
      <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 14 }}>
        Un piccolo promemoria, senza numeri da inseguire — spunta man mano che li completi.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {pasti.map((m, i) => {
          const key = m.nome || `pasto-${i}`
          const done = !!checked[key]
          return (
            <button key={i} onClick={() => toggle(key)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: '1.5px solid var(--border-light)',
              background: done ? '#FFE4E6' : 'var(--surface)', cursor: 'pointer', font: 'inherit', textAlign: 'left',
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: 6, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1.5px solid ${done ? '#E11D48' : 'var(--border)'}`,
                background: done ? '#E11D48' : 'transparent',
              }}>
                {done && <Check size={13} color="white" />}
              </div>
              <p style={{ fontSize: 13, fontWeight: 600 }}>{m.nome}{m.ora ? ` · ${m.ora}` : ''}</p>
            </button>
          )
        })}
      </div>

      {doneCount > 0 && (
        <p style={{ fontSize: 12, color: '#E11D48', marginTop: 10, textAlign: 'center' }}>
          {doneCount === pasti.length ? 'Hai completato la giornata — bravo/a per esserci stato/a per te.' : 'Un passo alla volta, va bene così.'}
        </p>
      )}
    </div>
  )
}
