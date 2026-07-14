import { useState, useEffect } from 'react'
import { Baby, Check } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { fetchTodayIntake } from '../../lib/specialSections'

function num(v) {
  if (v === null || v === undefined || v === '') return null
  const n = parseFloat(String(v).replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

function todayKey(prefix) {
  const d = new Date()
  return `${prefix}_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function PediatriaTracker({ dati }) {
  const { user } = useAuth()
  const [intake, setIntake] = useState(null)
  const [checked, setChecked] = useState({})
  const storageKey = todayKey('ped_meals')

  useEffect(() => {
    if (!user?.id) return
    fetchTodayIntake(user.id).then(setIntake)
  }, [user?.id])

  useEffect(() => {
    try { setChecked(JSON.parse(localStorage.getItem(storageKey) || '{}')) } catch { setChecked({}) }
  }, [storageKey])

  function toggle(name) {
    const next = { ...checked, [name]: !checked[name] }
    setChecked(next)
    try { localStorage.setItem(storageKey, JSON.stringify(next)) } catch { /* storage unavailable */ }
  }

  const pasti = (dati.piano?.pasti || []).filter(m => m && (m.nome || m.alimenti))
  const kcalTarget = num(dati.piano?.kcal)
  if (!pasti.length && kcalTarget === null) return null

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <Baby size={16} color="#5B21B6" />
        <h3 style={{ fontSize: 14, fontWeight: 700 }}>Pasti di oggi</h3>
      </div>

      {pasti.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: kcalTarget !== null ? 16 : 0 }}>
          {pasti.map((m, i) => (
            <button key={i} onClick={() => toggle(m.nome || `pasto-${i}`)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: '1.5px solid var(--border-light)',
              background: checked[m.nome || `pasto-${i}`] ? '#EDE9FE' : 'var(--surface)', cursor: 'pointer', font: 'inherit', textAlign: 'left',
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: 6, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1.5px solid ${checked[m.nome || `pasto-${i}`] ? '#5B21B6' : 'var(--border)'}`,
                background: checked[m.nome || `pasto-${i}`] ? '#5B21B6' : 'transparent',
              }}>
                {checked[m.nome || `pasto-${i}`] && <Check size={13} color="white" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600 }}>{m.nome}{m.ora ? ` · ${m.ora}` : ''}</p>
                {m.alimenti && <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.alimenti}</p>}
              </div>
            </button>
          ))}
        </div>
      )}

      {kcalTarget !== null && intake !== null && (
        <div style={{ padding: '12px 10px', background: '#EDE9FE', borderRadius: 12, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Kcal assunte oggi / target</p>
          <p style={{ fontSize: 18, fontWeight: 800, color: '#5B21B6' }}>{Math.round(intake.kcal)} / {kcalTarget}</p>
        </div>
      )}
    </div>
  )
}
