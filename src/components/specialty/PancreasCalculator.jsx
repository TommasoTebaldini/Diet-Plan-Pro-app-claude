import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'

function num(v) {
  if (v === null || v === undefined || v === '') return null
  const n = parseFloat(String(v).replace(',', '.'))
  return Number.isFinite(n) && n > 0 ? n : null
}

// The dietist's own PERT reference dose (grams of fat → UL) is the source of
// truth for the per-gram rate — we back-derive it instead of re-implementing
// the pathology/method lookup table from pancreas.html, so this can never
// drift out of sync with what the dietist actually prescribed.
function parseULText(v) {
  if (!v) return null
  const digits = String(v).replace(/[^\d]/g, '')
  return digits ? parseInt(digits, 10) : null
}

export default function PancreasCalculator({ dati }) {
  const [grassiPasto, setGrassiPasto] = useState('')

  const isGrassiMethod = dati.pert?.metodo === 'grassi'
  const grassiRef = num(dati.pert?.grassi)
  const ulRef = parseULText(dati.pert?.risultato_ul)
  const ratePerGram = isGrassiMethod && grassiRef && ulRef ? ulRef / grassiRef : null

  const grassiVal = num(grassiPasto)
  const ul = ratePerGram && grassiVal ? Math.round(ratePerGram * grassiVal) : null
  const creon40 = ul ? Math.ceil(ul / 40000) : null
  const creon25 = ul ? Math.ceil(ul / 25000) : null
  const creon10 = ul ? Math.ceil(ul / 10000) : null

  return (
    <div className="card" style={{ padding: 16 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>💊 Calcolo dose enzimi pancreatici (PERT)</h3>

      {!ratePerGram ? (
        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {isGrassiMethod
            ? 'Mancano i dati di riferimento del tuo dietista per calcolare il rapporto UL/grammo — chiedi di aggiornare la scheda.'
            : 'Il tuo dietista ha impostato una dose per kg di peso corporeo, non calcolabile per singolo pasto — consulta la dose di riferimento qui sotto.'}
        </p>
      ) : (
        <>
          <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 14 }}>
            Basato sul rapporto {Math.round(ratePerGram)} UL per grammo di grasso, calcolato dal tuo dietista.
          </p>
          <div className="input-group">
            <label className="input-label">Grammi di grasso in questo pasto</label>
            <input type="number" inputMode="decimal" className="input-field" placeholder="es. 25" value={grassiPasto} onChange={e => setGrassiPasto(e.target.value)} />
          </div>

          {ul !== null && (
            <div style={{ marginTop: 14, padding: '14px 16px', background: '#FEF3C7', borderRadius: 12 }}>
              <p style={{ fontSize: 12, color: '#D97706', marginBottom: 4 }}>Dose stimata per questo pasto</p>
              <p style={{ fontSize: 26, fontWeight: 800, color: '#D97706' }}>{ul.toLocaleString('it-IT')} UL</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, background: '#DBEAFE', color: '#1D4ED8', borderRadius: 100, padding: '3px 10px' }}>Creon 40.000: {creon40} cps</span>
                <span style={{ fontSize: 11.5, fontWeight: 700, background: '#EDE9FE', color: '#5B21B6', borderRadius: 100, padding: '3px 10px' }}>Creon 25.000: {creon25} cps</span>
                <span style={{ fontSize: 11.5, fontWeight: 700, background: '#FCE7F3', color: '#9D174D', borderRadius: 100, padding: '3px 10px' }}>Creon 10.000: {creon10} cps</span>
              </div>
            </div>
          )}
        </>
      )}

      <div style={{ marginTop: 14, display: 'flex', gap: 8, padding: '10px 12px', background: 'var(--alert-warning-bg)', border: '1px solid var(--alert-warning-border)', borderRadius: 10 }}>
        <AlertTriangle size={16} color="var(--alert-warning-text)" style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 11.5, color: 'var(--alert-warning-text)', lineHeight: 1.5 }}>
          Supporto al calcolo basato sui parametri del tuo specialista — non modificare la terapia enzimatica senza il suo parere, specialmente in caso di sintomi digestivi persistenti.
        </p>
      </div>
    </div>
  )
}
