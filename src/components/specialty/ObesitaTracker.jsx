import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { fetchLatestWeight } from '../../lib/specialSections'

function num(v) {
  if (v === null || v === undefined || v === '') return null
  const n = parseFloat(String(v).replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

export default function ObesitaTracker({ dati }) {
  const { user } = useAuth()
  const [current, setCurrent] = useState(null)

  useEffect(() => {
    if (!user?.id) return
    fetchLatestWeight(user.id).then(setCurrent)
  }, [user?.id])

  const start = num(dati.valutazione?.peso)
  const target = num(dati.fabbisogno?.peso_target)
  const kcalTarget = num(dati.piano?.kcal)
  const deficit = dati.fabbisogno?.deficit

  if (target === null && kcalTarget === null) return null

  const weight = current ?? start
  const progressPct = start !== null && target !== null && weight !== null && start !== target
    ? Math.max(0, Math.min(100, ((start - weight) / (start - target)) * 100))
    : null
  const toGo = target !== null && weight !== null ? Math.round((weight - target) * 10) / 10 : null

  return (
    <div className="card" style={{ padding: 16 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>⚖️ Il tuo percorso peso</h3>

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
        </>
      )}

      {kcalTarget !== null && (
        <div style={{ marginTop: target !== null ? 16 : 0, textAlign: 'center', padding: '12px 10px', background: '#FFEDD5', borderRadius: 12 }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Kcal target giornaliero{deficit ? ` (${deficit})` : ''}</p>
          <p style={{ fontSize: 20, fontWeight: 800, color: '#EA580C' }}>{kcalTarget} kcal</p>
        </div>
      )}
    </div>
  )
}
