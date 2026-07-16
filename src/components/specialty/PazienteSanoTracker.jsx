import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { fetchTodayIntake } from '../../lib/specialSections'

function num(v) {
  if (v === null || v === undefined || v === '') return null
  const n = parseFloat(String(v).replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

export default function PazienteSanoTracker({ dati }) {
  const { user } = useAuth()
  const [intake, setIntake] = useState(null)

  useEffect(() => {
    if (!user?.id) return
    fetchTodayIntake(user.id).then(setIntake)
  }, [user?.id])

  const bmr = num(dati.valutazione?.bmr)
  const tdee = num(dati.valutazione?.tdee)
  const kcalTarget = num(dati.piano_config?.kcal) ?? num(dati.valutazione?.target)
  if (bmr === null && tdee === null && kcalTarget === null) return null

  const pct = kcalTarget && intake ? Math.min(100, Math.round((intake.kcal / kcalTarget) * 100)) : 0

  return (
    <div className="card" style={{ padding: 16 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>🌿 Il tuo fabbisogno</h3>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${[bmr, tdee, kcalTarget].filter(v => v !== null).length}, 1fr)`, gap: 8, marginBottom: kcalTarget ? 16 : 0 }}>
        {bmr !== null && (
          <div style={{ textAlign: 'center', padding: '10px 6px', background: 'var(--surface-2)', borderRadius: 10 }}>
            <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Metabolismo basale</p>
            <p style={{ fontSize: 16, fontWeight: 700 }}>{bmr}</p>
          </div>
        )}
        {tdee !== null && (
          <div style={{ textAlign: 'center', padding: '10px 6px', background: 'var(--surface-2)', borderRadius: 10 }}>
            <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Fabbisogno totale</p>
            <p style={{ fontSize: 16, fontWeight: 700 }}>{tdee}</p>
          </div>
        )}
        {kcalTarget !== null && (
          <div style={{ textAlign: 'center', padding: '10px 6px', background: '#F0FDF4', borderRadius: 10 }}>
            <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Target giornaliero</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#16A34A' }}>{kcalTarget}</p>
          </div>
        )}
      </div>

      {kcalTarget !== null && intake !== null && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
            <span style={{ fontWeight: 500 }}>Assunte oggi</span>
            <span><b>{Math.round(intake.kcal)}</b> / {kcalTarget} kcal</span>
          </div>
          <div style={{ height: 6, background: 'var(--border-light)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: '#16A34A', borderRadius: 3, transition: 'width .6s' }} />
          </div>
        </div>
      )}

      {intake !== null && (intake.proteins > 0 || intake.carbs > 0 || intake.fats > 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 14 }}>
          <div style={{ textAlign: 'center', padding: '8px 4px', background: 'var(--surface-2)', borderRadius: 10 }}>
            <p style={{ fontSize: 14, fontWeight: 700 }}>{Math.round(intake.proteins)}g</p>
            <p style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>Proteine</p>
          </div>
          <div style={{ textAlign: 'center', padding: '8px 4px', background: 'var(--surface-2)', borderRadius: 10 }}>
            <p style={{ fontSize: 14, fontWeight: 700 }}>{Math.round(intake.carbs)}g</p>
            <p style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>Carboidrati</p>
          </div>
          <div style={{ textAlign: 'center', padding: '8px 4px', background: 'var(--surface-2)', borderRadius: 10 }}>
            <p style={{ fontSize: 14, fontWeight: 700 }}>{Math.round(intake.fats)}g</p>
            <p style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>Grassi</p>
          </div>
        </div>
      )}
    </div>
  )
}
