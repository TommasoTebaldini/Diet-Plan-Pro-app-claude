import { useState } from 'react'
import { Calculator, AlertTriangle } from 'lucide-react'

function num(v) {
  if (v === null || v === undefined || v === '') return null
  const n = parseFloat(String(v).replace(',', '.'))
  return Number.isFinite(n) && n > 0 ? n : null
}

// Extracts the first number out of a free-text result string like "1U : 8g"
// (the I:C calculator on diabete.html writes its result as display text, not
// a clean number) — used only as a fallback when the raw input field is empty.
function firstNumber(v) {
  if (!v) return null
  const m = String(v).match(/[\d.,]+/)
  return m ? num(m[0]) : null
}

function round05(n) {
  return Math.round(n * 2) / 2
}

export default function DiabeteCalculator({ dati }) {
  const [cho, setCho] = useState('')
  const [glicemia, setGlicemia] = useState('')

  const icRatio = num(dati.dose_pasto?.ic) ?? firstNumber(dati.rapporto_ic?.risultato)
  const fsi = num(dati.dose_pasto?.fsi) ?? firstNumber(dati.fsi?.risultato)
  const target = num(dati.dose_pasto?.target)

  const choVal = num(cho)
  const glicemiaVal = num(glicemia)

  const mealDose = icRatio && choVal ? choVal / icRatio : null
  const correctionDose = fsi && target && glicemiaVal ? (glicemiaVal - target) / fsi : null
  const total = mealDose !== null || correctionDose !== null
    ? round05((mealDose || 0) + (correctionDose || 0))
    : null

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Calculator size={16} color="#1D4ED8" />
        <h3 style={{ fontSize: 14, fontWeight: 700 }}>Calcolo dose insulina pasto</h3>
      </div>
      <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 14 }}>
        Basato sui parametri impostati dal tuo dietista/diabetologo: rapporto insulina/carboidrati {icRatio ? `1U : ${icRatio}g` : '(non impostato)'}
        {fsi ? ` · FSI ${fsi} mg/dL per U` : ''}{target ? ` · target ${target} mg/dL` : ''}.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="input-group">
          <label className="input-label">Carboidrati del pasto (g)</label>
          <input type="number" inputMode="decimal" className="input-field" placeholder="es. 60" value={cho} onChange={e => setCho(e.target.value)} disabled={!icRatio} />
          {!icRatio && <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Il tuo dietista non ha ancora impostato il rapporto insulina/carboidrati.</p>}
        </div>
        <div className="input-group">
          <label className="input-label">Glicemia attuale (mg/dL) — opzionale, per la correzione</label>
          <input type="number" inputMode="decimal" className="input-field" placeholder="es. 140" value={glicemia} onChange={e => setGlicemia(e.target.value)} disabled={!fsi || !target} />
          {(!fsi || !target) && <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>FSI e/o target glicemico non ancora impostati — solo la dose pasto sarà calcolabile.</p>}
        </div>
      </div>

      {total !== null && (
        <div style={{ marginTop: 16, padding: '14px 16px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 12 }}>
          <p style={{ fontSize: 12, color: '#1D4ED8', marginBottom: 4 }}>Dose stimata</p>
          <p style={{ fontSize: 26, fontWeight: 800, color: '#1D4ED8' }}>{total} U</p>
          <div style={{ fontSize: 11.5, color: '#1D4ED8', opacity: 0.8, marginTop: 6 }}>
            {mealDose !== null && <div>Dose pasto: {choVal}g ÷ {icRatio} = {round05(mealDose)} U</div>}
            {correctionDose !== null && <div>Correzione: ({glicemiaVal} − {target}) ÷ {fsi} = {round05(correctionDose)} U</div>}
          </div>
        </div>
      )}

      <div style={{ marginTop: 14, display: 'flex', gap: 8, padding: '10px 12px', background: 'var(--alert-warning-bg)', border: '1px solid var(--alert-warning-border)', borderRadius: 10 }}>
        <AlertTriangle size={16} color="var(--alert-warning-text)" style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 11.5, color: 'var(--alert-warning-text)', lineHeight: 1.5 }}>
          Questo è solo un supporto al calcolo basato sui parametri che ti ha comunicato il tuo dietista/diabetologo — non sostituisce il suo giudizio clinico. Verifica sempre la dose prima di somministrarla, specialmente se la glicemia è molto fuori range.
        </p>
      </div>
    </div>
  )
}
