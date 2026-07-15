import { useState, useEffect } from 'react'
import { Calculator, AlertTriangle, History, Trash2 } from 'lucide-react'

const STORAGE_KEY = 'diabete_dose_history_v1'
const MAX_HISTORY = 20

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function saveHistory(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_HISTORY))) } catch { /* storage unavailable */ }
}

function num(v) {
  if (v === null || v === undefined || v === '') return null
  const n = parseFloat(String(v).replace(',', '.'))
  return Number.isFinite(n) && n > 0 ? n : null
}

// Free-text result strings like "1U : 8g" or "45 mg/dL" (the live calculators
// on diabete.html write their result as display text, not a clean number) —
// used as a fallback when the dedicated numeric field is empty. Dietitians
// often only fill in one of the several places this ratio can end up.
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
  const [history, setHistory] = useState([])

  useEffect(() => { setHistory(loadHistory()) }, [])

  // Pull the ratio/ISF from wherever the dietitian actually saved it —
  // dedicated "dose pasto" fields first, then the standalone calculators,
  // then the free-text depliant summary as a last resort.
  const icRatio = num(dati.dose_pasto?.ic) ?? firstNumber(dati.rapporto_ic?.risultato) ?? firstNumber(dati.depliant?.ic)
  const fsi = num(dati.dose_pasto?.fsi) ?? firstNumber(dati.fsi?.risultato) ?? firstNumber(dati.depliant?.fsi)
  const target = num(dati.dose_pasto?.target) ?? firstNumber(dati.depliant?.target)

  const choVal = num(cho)
  const glicemiaVal = num(glicemia)

  const mealDose = icRatio && choVal ? choVal / icRatio : null
  const correctionDose = fsi && target && glicemiaVal ? (glicemiaVal - target) / fsi : null
  const total = mealDose !== null || correctionDose !== null
    ? round05((mealDose || 0) + (correctionDose || 0))
    : null

  function registra() {
    if (total === null) return
    const entry = { cho: choVal, glicemia: glicemiaVal, total, date: new Date().toISOString() }
    const next = [entry, ...history].slice(0, MAX_HISTORY)
    setHistory(next)
    saveHistory(next)
    setCho('')
    setGlicemia('')
  }

  function cancellaStorico() {
    setHistory([])
    saveHistory([])
  }

  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Calculator size={16} color="#1D4ED8" />
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 700 }}>Calcolo dose insulina pasto</h3>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
        <span style={{ fontSize: 11.5, fontWeight: 600, background: icRatio ? '#EFF6FF' : 'var(--surface-2)', color: icRatio ? '#1D4ED8' : 'var(--text-muted)', borderRadius: 100, padding: '4px 10px' }}>
          I:C {icRatio ? `1U : ${icRatio}g` : 'non impostato'}
        </span>
        <span style={{ fontSize: 11.5, fontWeight: 600, background: fsi ? '#EFF6FF' : 'var(--surface-2)', color: fsi ? '#1D4ED8' : 'var(--text-muted)', borderRadius: 100, padding: '4px 10px' }}>
          FSI {fsi ? `${fsi} mg/dL per U` : 'non impostato'}
        </span>
        <span style={{ fontSize: 11.5, fontWeight: 600, background: target ? '#EFF6FF' : 'var(--surface-2)', color: target ? '#1D4ED8' : 'var(--text-muted)', borderRadius: 100, padding: '4px 10px' }}>
          Target {target ? `${target} mg/dL` : 'non impostato'}
        </span>
      </div>

      {!icRatio && !fsi && (
        <div style={{ display: 'flex', gap: 8, padding: '10px 12px', background: 'var(--alert-info-bg)', border: '1px solid var(--alert-info-border)', borderRadius: 10, marginBottom: 14 }}>
          <p style={{ fontSize: 12, color: 'var(--alert-info-text)', lineHeight: 1.5 }}>
            Il tuo dietista non ha ancora impostato i parametri per questo calcolo (rapporto I:C e FSI) — puoi comunque provare i valori qui sotto, ma il risultato non apparirà finché non li avrà inseriti nella tua scheda.
          </p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="input-group">
          <label className="input-label">Carboidrati del pasto (g)</label>
          <input type="number" inputMode="decimal" className="input-field" placeholder="es. 60" value={cho} onChange={e => setCho(e.target.value)} />
        </div>
        <div className="input-group">
          <label className="input-label">Glicemia attuale (mg/dL) — opzionale, per la correzione</label>
          <input type="number" inputMode="decimal" className="input-field" placeholder="es. 140" value={glicemia} onChange={e => setGlicemia(e.target.value)} />
        </div>
      </div>

      {total !== null && (
        <div style={{ marginTop: 16, padding: '14px 16px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 12 }}>
          <p style={{ fontSize: 12, color: '#1D4ED8', marginBottom: 4 }}>Dose stimata</p>
          <p style={{ fontSize: 28, fontWeight: 800, color: '#1D4ED8' }}>{total} U</p>
          <div style={{ fontSize: 11.5, color: '#1D4ED8', opacity: 0.8, marginTop: 6 }}>
            {mealDose !== null && <div>Dose pasto: {choVal}g ÷ {icRatio} = {round05(mealDose)} U</div>}
            {correctionDose !== null && <div>Correzione: ({glicemiaVal} − {target}) ÷ {fsi} = {round05(correctionDose)} U</div>}
          </div>
          <button className="btn btn-primary btn-full" onClick={registra} style={{ marginTop: 12 }}>
            Registra questa dose
          </button>
        </div>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <History size={13} /> Dosi registrate (su questo dispositivo)
            </p>
            <button onClick={cancellaStorico} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
              <Trash2 size={12} /> Cancella
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {history.map((h, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--surface-2)', borderRadius: 10, fontSize: 12 }}>
                <span style={{ color: 'var(--text-muted)' }}>{new Date(h.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{h.cho ? `${h.cho}g CHO` : ''}{h.glicemia ? ` · ${h.glicemia} mg/dL` : ''}</span>
                <span style={{ fontWeight: 700, color: '#1D4ED8' }}>{h.total} U</span>
              </div>
            ))}
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
