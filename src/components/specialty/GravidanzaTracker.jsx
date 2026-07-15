function num(v) {
  if (v === null || v === undefined || v === '') return null
  const n = parseFloat(String(v).replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

// IOM (Institute of Medicine) 2009 gestational weight gain guidelines —
// pre-pregnancy BMI category → total recommended gain + 2nd/3rd trimester
// weekly rate. First trimester (≤13 weeks) is ~0.5–2 kg for every category.
const IOM_SINGLE = [
  { max: 18.5, label: 'Sottopeso', total: [12.5, 18], weekly: [0.44, 0.58] },
  { max: 25,   label: 'Normopeso', total: [11.5, 16], weekly: [0.35, 0.50] },
  { max: 30,   label: 'Sovrappeso', total: [7, 11.5],  weekly: [0.23, 0.33] },
  { max: Infinity, label: 'Obesità', total: [5, 9], weekly: [0.17, 0.27] },
]
const IOM_TWINS = [
  { max: 25, label: 'Normopeso', total: [17, 25] },
  { max: 30, label: 'Sovrappeso', total: [14, 23] },
  { max: Infinity, label: 'Obesità', total: [11, 19] },
]

function categoryFor(bmi, isTwins) {
  const table = isTwins ? IOM_TWINS : IOM_SINGLE
  return table.find(c => bmi < c.max) || table[table.length - 1]
}

export default function GravidanzaTracker({ dati }) {
  const bmi = num(dati.bmi)
  const pesoPre = num(dati.pesoPre)
  const pesoAtt = num(dati.pesoAtt)
  const settimane = num(dati.settimane)
  const isTwins = String(dati.tipo || '').toLowerCase().includes('gemel')

  if (bmi === null) return null
  const cat = categoryFor(bmi, isTwins)
  const gain = pesoPre !== null && pesoAtt !== null ? Math.round((pesoAtt - pesoPre) * 10) / 10 : null

  let expectedRange = null
  if (!isTwins && settimane !== null && cat.weekly) {
    if (settimane <= 13) {
      expectedRange = [0, 2]
    } else {
      const extraWeeks = settimane - 13
      expectedRange = [
        Math.round((1 + cat.weekly[0] * extraWeeks) * 10) / 10,
        Math.round((2 + cat.weekly[1] * extraWeeks) * 10) / 10,
      ]
    }
  }

  const inRange = gain !== null && expectedRange ? gain >= expectedRange[0] && gain <= expectedRange[1] : null

  return (
    <div className="card" style={{ padding: 16 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>🤰 Incremento di peso in gravidanza</h3>
      <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 14 }}>
        Categoria pre-gravidanza: <b style={{ color: '#C026D3' }}>{cat.label}</b> (BMI {bmi}){isTwins ? ' · Gravidanza gemellare' : ''}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: gain !== null ? '1fr 1fr' : '1fr', gap: 10, marginBottom: 14 }}>
        {gain !== null && (
          <div style={{ textAlign: 'center', padding: '14px 10px', background: '#FAE8FF', borderRadius: 12 }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Incremento finora</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#C026D3' }}>{gain > 0 ? '+' : ''}{gain} kg</p>
          </div>
        )}
        <div style={{ textAlign: 'center', padding: '14px 10px', background: 'var(--surface-2)', borderRadius: 12 }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Obiettivo a termine</p>
          <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-secondary)' }}>{cat.total[0]}–{cat.total[1]} kg</p>
        </div>
      </div>

      {expectedRange && (
        <div style={{ padding: '10px 14px', background: inRange ? '#F0FDF4' : '#FFFBEB', borderRadius: 10 }}>
          <p style={{ fontSize: 12.5, color: inRange ? '#166534' : '#92400E' }}>
            Alla settimana {settimane}, l'incremento tipico atteso è <b>{expectedRange[0]}–{expectedRange[1]} kg</b>
            {gain !== null && (inRange ? ' — sei in linea con il percorso previsto.' : gain < expectedRange[0] ? ', il tuo incremento è al momento sotto il range tipico.' : ', il tuo incremento è al momento sopra il range tipico.')}
          </p>
        </div>
      )}

      <p style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 12, textAlign: 'center' }}>
        Range di riferimento IOM 2009 — parlane sempre con il tuo dietista/ginecologo, ogni gravidanza è diversa.
      </p>
    </div>
  )
}
