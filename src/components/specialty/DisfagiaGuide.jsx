import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import { IDDSI_LEVELS, IDDSI_ALIMENTI } from '../../data/specialtyMeta'

const CATEGORIES = [
  { key: 'ok', label: 'Consentiti', icon: '✅', color: '#16A34A', bg: '#F0FDF4' },
  { key: 'mod', label: 'Con moderazione', icon: '⚠️', color: '#CA8A04', bg: '#FEFCE8' },
  { key: 'no', label: 'Da evitare', icon: '⛔', color: '#DC2626', bg: '#FEF2F2' },
]

const SAFETY_CHECKS = [
  { key: 'postura', label: 'Seduto/a con la schiena dritta' },
  { key: 'bocconi', label: 'Bocconi piccoli, uno alla volta' },
  { key: 'tempo', label: 'Tempo sufficiente, senza fretta' },
  { key: 'addensante', label: 'Addensante nella quantità giusta (se previsto)' },
]

function todayKey() {
  const d = new Date()
  return `disfagia_safety_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function DisfagiaGuide({ dati }) {
  const [checked, setChecked] = useState({})
  const storageKey = todayKey()

  useEffect(() => {
    try { setChecked(JSON.parse(localStorage.getItem(storageKey) || '{}')) } catch { setChecked({}) }
  }, [storageKey])

  function toggle(key) {
    const next = { ...checked, [key]: !checked[key] }
    setChecked(next)
    try { localStorage.setItem(storageKey, JSON.stringify(next)) } catch { /* storage unavailable */ }
  }

  const level = dati.iddsi
  const meta = IDDSI_LEVELS[level]
  const foods = IDDSI_ALIMENTI[level]
  if (!meta || !foods) return null

  return (
    <>
      <div className="card" style={{ padding: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>🗣️ Alimenti per il tuo livello — IDDSI {level}</h3>
        <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 14 }}>
          Consistenza assegnata dal tuo dietista: <b style={{ color: meta.color }}>{meta.nome}</b>
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {CATEGORIES.map(cat => (
            <div key={cat.key}>
              <p style={{ fontSize: 12.5, fontWeight: 700, color: cat.color, marginBottom: 8 }}>{cat.icon} {cat.label}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {foods[cat.key].map((f, i) => (
                  <span key={i} style={{ fontSize: 12, background: cat.bg, color: cat.color, borderRadius: 100, padding: '5px 12px', fontWeight: 500 }}>{f}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginTop: 12 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>✅ Controlli di sicurezza per il pasto</h3>
        <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 12 }}>Spunta prima di iniziare a mangiare.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {SAFETY_CHECKS.map(c => {
            const done = !!checked[c.key]
            return (
              <button key={c.key} onClick={() => toggle(c.key)} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10,
                border: '1.5px solid var(--border-light)', background: done ? '#E0F2FE' : 'var(--surface-2)',
                cursor: 'pointer', font: 'inherit', textAlign: 'left',
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 6, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1.5px solid ${done ? '#0369A1' : 'var(--border)'}`, background: done ? '#0369A1' : 'transparent',
                }}>
                  {done && <Check size={13} color="white" />}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{c.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
