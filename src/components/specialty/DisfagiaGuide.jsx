import { IDDSI_LEVELS, IDDSI_ALIMENTI } from '../../data/specialtyMeta'

const CATEGORIES = [
  { key: 'ok', label: 'Consentiti', icon: '✅', color: '#16A34A', bg: '#F0FDF4' },
  { key: 'mod', label: 'Con moderazione', icon: '⚠️', color: '#CA8A04', bg: '#FEFCE8' },
  { key: 'no', label: 'Da evitare', icon: '⛔', color: '#DC2626', bg: '#FEF2F2' },
]

export default function DisfagiaGuide({ dati }) {
  const level = dati.iddsi
  const meta = IDDSI_LEVELS[level]
  const foods = IDDSI_ALIMENTI[level]
  if (!meta || !foods) return null

  return (
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
  )
}
