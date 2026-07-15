import { useState } from 'react'

function num(v) {
  if (v === null || v === undefined || v === '') return null
  const n = parseFloat(String(v).replace(',', '.'))
  return Number.isFinite(n) && n > 0 ? n : null
}

export default function SportCalculator({ dati }) {
  const [training, setTraining] = useState(true)

  const kcalTrain = num(dati.piano?.kcal_train)
  const kcalRest = num(dati.piano?.kcal_rest)
  const protPerKg = num(dati.piano?.prot_per_kg)
  const peso = num(dati.calc?.peso)
  const oraTrain = dati.piano?.ora_train

  const kcalTarget = training ? kcalTrain : kcalRest
  const protTarget = protPerKg && peso ? Math.round(protPerKg * peso * 10) / 10 : null

  if (!kcalTrain && !kcalRest && !protTarget) return null

  return (
    <div className="card" style={{ padding: 16 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>🎯 Il tuo obiettivo di oggi</h3>

      {(kcalTrain !== null || kcalRest !== null) && (
        <div style={{ display: 'flex', gap: 6, background: 'var(--surface-2)', borderRadius: 12, padding: 4, marginBottom: 14, marginTop: 10 }}>
          <button onClick={() => setTraining(true)} style={{
            flex: 1, padding: '8px 4px', borderRadius: 9, border: 'none', cursor: 'pointer', font: 'inherit',
            fontSize: 12.5, fontWeight: training ? 700 : 500,
            background: training ? 'var(--surface)' : 'transparent',
            color: training ? '#059669' : 'var(--text-muted)',
            boxShadow: training ? 'var(--shadow-sm)' : 'none',
          }}>🏋️ Giorno di allenamento</button>
          <button onClick={() => setTraining(false)} style={{
            flex: 1, padding: '8px 4px', borderRadius: 9, border: 'none', cursor: 'pointer', font: 'inherit',
            fontSize: 12.5, fontWeight: !training ? 700 : 500,
            background: !training ? 'var(--surface)' : 'transparent',
            color: !training ? '#059669' : 'var(--text-muted)',
            boxShadow: !training ? 'var(--shadow-sm)' : 'none',
          }}>🛌 Giorno di riposo</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: protTarget ? '1fr 1fr' : '1fr', gap: 10 }}>
        {kcalTarget !== null && (
          <div style={{ textAlign: 'center', padding: '14px 10px', background: '#D1FAE5', borderRadius: 12 }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Kcal target</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#059669' }}>{kcalTarget}</p>
          </div>
        )}
        {protTarget !== null && (
          <div style={{ textAlign: 'center', padding: '14px 10px', background: '#EFF6FF', borderRadius: 12 }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Proteine target</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#1D4ED8' }}>{protTarget} g</p>
          </div>
        )}
      </div>

      {training && oraTrain && (
        <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 12, textAlign: 'center' }}>⏱️ Timing pre-workout consigliato: {oraTrain}</p>
      )}
    </div>
  )
}
