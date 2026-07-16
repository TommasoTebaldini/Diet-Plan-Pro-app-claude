import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { fetchLatestWeight, fetchTodayIntake } from '../../lib/specialSections'

function num(v) {
  if (v === null || v === undefined || v === '') return null
  const n = parseFloat(String(v).replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

const BMI_CATEGORIES = [
  { max: 18.5, label: 'Sottopeso', color: '#0891B2' },
  { max: 25, label: 'Normopeso', color: '#16A34A' },
  { max: 30, label: 'Sovrappeso', color: '#D97706' },
  { max: Infinity, label: 'Obesità', color: '#DC2626' },
]

export default function ObesitaTracker({ dati }) {
  const { user, profile } = useAuth()
  const [current, setCurrent] = useState(null)
  const [intake, setIntake] = useState(null)

  useEffect(() => {
    if (!user?.id) return
    fetchLatestWeight(user.id).then(setCurrent)
    fetchTodayIntake(user.id).then(setIntake)
  }, [user?.id])

  const start = num(dati.valutazione?.peso)
  const target = num(dati.fabbisogno?.peso_target)
  const kcalTarget = num(dati.piano?.kcal)
  const deficit = dati.fabbisogno?.deficit
  const heightCm = num(profile?.height_cm)

  if (target === null && kcalTarget === null) return null

  const weight = current ?? start
  const progressPct = start !== null && target !== null && weight !== null && start !== target
    ? Math.max(0, Math.min(100, ((start - weight) / (start - target)) * 100))
    : null
  const toGo = target !== null && weight !== null ? Math.round((weight - target) * 10) / 10 : null
  const bmi = weight !== null && heightCm ? Math.round((weight / Math.pow(heightCm / 100, 2)) * 10) / 10 : null
  const bmiCat = bmi !== null ? BMI_CATEGORIES.find(c => bmi < c.max) : null

  // Weeks-to-goal, same 1kg-fat≈7700kcal rule the dietitian's own tool uses (obesita.html calcObiettivoOb).
  const deficitPerDay = deficit === 'personalizzato' ? num(dati.fabbisogno?.deficit_custom) : num(deficit)
  const weeksToGoal = toGo !== null && toGo > 0 && deficitPerDay
    ? Math.round((toGo * 7700) / (deficitPerDay * 7))
    : null
  const kcalPct = kcalTarget && intake ? Math.min(100, Math.round((intake.kcal / kcalTarget) * 100)) : 0

  return (
    <div className="card" style={{ padding: 16 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>⚖️ Il tuo percorso peso</h3>

      {bmi !== null && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 12, marginBottom: 14 }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 20, fontWeight: 800, color: bmiCat.color }}>{bmi}</p>
            <p style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>BMI</p>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12.5, fontWeight: 600, color: bmiCat.color }}>{bmiCat.label}</p>
            <p style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>Calcolato dal tuo ultimo peso registrato e dall'altezza nel profilo</p>
          </div>
        </div>
      )}

      {target !== null && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
            <span>{weight !== null ? `${weight} kg` : '—'}</span>
            <span>Obiettivo: {target} kg</span>
          </div>
          {progressPct !== null && (
            <div style={{ height: 8, background: 'var(--border-light)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progressPct}%`, background: '#EA580C', borderRadius: 4, transition: 'width .6s' }} />
            </div>
          )}
          {toGo !== null && toGo > 0 && (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, textAlign: 'center' }}>Mancano {toGo} kg all'obiettivo</p>
          )}
          {toGo !== null && toGo <= 0 && (
            <p style={{ fontSize: 12, color: '#16A34A', marginTop: 8, textAlign: 'center', fontWeight: 600 }}>✓ Obiettivo raggiunto</p>
          )}
          {weeksToGoal !== null && (
            <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 4, textAlign: 'center' }}>Al ritmo previsto dal tuo dietista: ~{weeksToGoal} settimane per arrivarci</p>
          )}
        </>
      )}

      {kcalTarget !== null && (
        <div style={{ marginTop: target !== null ? 16 : 0, textAlign: 'center', padding: '12px 10px', background: '#FFEDD5', borderRadius: 12 }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Kcal target giornaliero{deficit ? ` (${deficit})` : ''}</p>
          <p style={{ fontSize: 20, fontWeight: 800, color: '#EA580C' }}>{kcalTarget} kcal</p>
        </div>
      )}

      {kcalTarget !== null && intake !== null && (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
            <span style={{ fontWeight: 500 }}>Assunte oggi</span>
            <span><b>{Math.round(intake.kcal)}</b> / {kcalTarget} kcal</span>
          </div>
          <div style={{ height: 6, background: 'var(--border-light)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${kcalPct}%`, background: '#EA580C', borderRadius: 3, transition: 'width .6s' }} />
          </div>
        </div>
      )}
    </div>
  )
}
