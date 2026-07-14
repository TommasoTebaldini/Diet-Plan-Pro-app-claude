import { Droplets } from 'lucide-react'

// Same per-stage limits table as renale.html's calcIRC() — kept identical so
// the patient always sees the exact numbers the dietist is working from.
const STAGE_CONFIG = {
  g1g2: { kMax: null, pMax: null, naMax: 5, liq: 'Libera', label: 'G1–G2', color: '#059669' },
  g3a:  { kMax: 2500, pMax: 800,  naMax: 5, liq: 'Libera', label: 'G3a', color: '#D97706' },
  g3b:  { kMax: 2000, pMax: 700,  naMax: 5, liq: 'Secondo bilancio idrico', label: 'G3b', color: '#EA580C' },
  g4:   { kMax: 1500, pMax: 600,  naMax: 3, liq: 'Restrizione se edemi', label: 'G4', color: '#DC2626' },
  g5:   { kMax: 1000, pMax: 500,  naMax: 2, liq: 'Diuresi + 500 mL', label: 'G5', color: '#991B1B' },
  hd:   { kMax: 2500, pMax: 1000, naMax: 2, liq: 'Diuresi + 500–750 mL', label: 'Emodialisi', color: '#1D4ED8' },
  pd:   { kMax: 3500, pMax: 1000, naMax: 2, liq: 'Diuresi + 500–750 mL', label: 'Dialisi Peritoneale', color: '#059669' },
}

const TIPS = [
  'La doppia bollitura (lisciviazione) riduce il potassio delle verdure del 30–50% — porta a bollore, scola, cambia l\'acqua e continua la cottura.',
  'Attenzione agli additivi a base di fosforo (sigle E338–E341, E450, E452) in salumi, formaggi fusi, pane industriale e snack: il fosforo aggiunto si assorbe quasi al 100%, molto più di quello naturale degli alimenti.',
  'Evita i sostituti del sale a base di cloruro di potassio (KCl) — possono causare un aumento pericoloso della potassiemia.',
]

export default function RenaleGuide({ dati }) {
  const stadio = dati.calcolo?.stadio
  const cfg = STAGE_CONFIG[stadio]
  if (!cfg) return null

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Droplets size={16} color={cfg.color} />
        <h3 style={{ fontSize: 14, fontWeight: 700 }}>I tuoi limiti giornalieri — Stadio {cfg.label}</h3>
      </div>
      <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 14 }}>
        Impostati dal tuo dietista in base al tuo stadio di malattia renale cronica.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {cfg.kMax && (
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 12px', background: '#FEE2E2', borderRadius: 8, fontSize: 13 }}>
            <span>⚡ Potassio max</span><b style={{ color: '#7F1D1D' }}>&lt;{cfg.kMax} mg/die</b>
          </div>
        )}
        {cfg.pMax && (
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 12px', background: '#FEE2E2', borderRadius: 8, fontSize: 13 }}>
            <span>🔵 Fosforo max</span><b style={{ color: '#7F1D1D' }}>&lt;{cfg.pMax} mg/die</b>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 12px', background: '#FEE2E2', borderRadius: 8, fontSize: 13 }}>
          <span>🧂 Sodio max</span><b style={{ color: '#7F1D1D' }}>&lt;{cfg.naMax} g NaCl/die</b>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 12px', background: '#EFF6FF', borderRadius: 8, fontSize: 13 }}>
          <span>💧 Liquidi</span><b style={{ color: '#1D4ED8' }}>{cfg.liq}</b>
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Consigli pratici</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TIPS.map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, padding: '9px 11px', background: 'var(--surface-2)', borderRadius: 10 }}>
              <span style={{ flexShrink: 0 }}>💡</span>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{t}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
