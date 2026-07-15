import { useState, useEffect } from 'react'
import { Stethoscope } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { fetchTodayIntake } from '../../lib/specialSections'

function num(v) {
  if (v === null || v === undefined || v === '') return null
  const n = parseFloat(String(v).replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

function Bar({ label, value, target, color }) {
  const pct = target ? Math.min(100, Math.round((value / target) * 100)) : 0
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
        <span style={{ fontWeight: 500 }}>{label}</span>
        <span><b>{Math.round(value)}</b> / {target} {pct > 0 && <span style={{ color, fontWeight: 600 }}>({pct}%)</span>}</span>
      </div>
      <div style={{ height: 6, background: 'var(--border-light)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width .6s' }} />
      </div>
    </div>
  )
}

export default function OncologiaTracker({ dati }) {
  const { user } = useAuth()
  const [intake, setIntake] = useState(null)

  useEffect(() => {
    if (!user?.id) return
    fetchTodayIntake(user.id).then(setIntake)
  }, [user?.id])

  const kcalTarget = num(dati.fabbisogno?.kcal_target)
  const protTarget = num(dati.fabbisogno?.prot_target)
  if (kcalTarget === null && protTarget === null) return null

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: '#FCE7F3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Stethoscope size={16} color="#DB2777" />
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 700 }}>Il tuo apporto di oggi</h3>
      </div>
      {intake === null ? (
        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Caricamento…</p>
      ) : (
        <>
          {kcalTarget !== null && <Bar label="Kcal" value={intake.kcal} target={kcalTarget} color="#DB2777" />}
          {protTarget !== null && <Bar label="Proteine (g)" value={intake.proteins} target={protTarget} color="#1D4ED8" />}
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Calcolato dal diario alimentare di oggi. Se fatichi a raggiungere il target, parlane con il tuo dietista — può indicarti supplementi orali (ONS) o strategie pratiche.</p>
        </>
      )}
    </div>
  )
}
