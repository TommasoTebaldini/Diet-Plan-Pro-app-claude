import { useState, useEffect } from 'react'
import { AlertTriangle, History, Trash2, Clock } from 'lucide-react'

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

function timeToMinutes(t) {
  if (!t) return null
  const [h, m] = t.split(':').map(Number)
  return Number.isFinite(h) ? h * 60 + (m || 0) : null
}
function isInRange(current, from, to) {
  if (from === null || to === null) return false
  return from <= to ? current >= from && current < to : current >= from || current < to // wraps midnight
}
function findCurrentFasciaIdx(fasce) {
  const now = new Date()
  const current = now.getHours() * 60 + now.getMinutes()
  const idx = fasce.findIndex(f => isInRange(current, timeToMinutes(f.oraDa), timeToMinutes(f.oraA)))
  return idx >= 0 ? idx : 0
}

export default function DiabeteCalculator({ dati }) {
  const [cho, setCho] = useState('')
  const [glicemia, setGlicemia] = useState('')
  const [history, setHistory] = useState([])

  // Multiple I:C/ISF profiles by time of day (e.g. for pump users, whose
  // insulin resistance varies across the day) — falls back to the single
  // flat values below when the dietitian hasn't set any up.
  const fasce = (dati.fasce_orarie || []).filter(f => f && (f.ic || f.fsi))
  const [fasciaIdx, setFasciaIdx] = useState(0)

  useEffect(() => { setHistory(loadHistory()) }, [])
  useEffect(() => { if (fasce.length) setFasciaIdx(findCurrentFasciaIdx(fasce)) }, [fasce.length])

  const fasciaAttiva = fasce[fasciaIdx]

  // Pull the ratio/ISF from the active time block if set, otherwise wherever
  // the dietitian saved a single flat value — dedicated "dose pasto" fields
  // first, then the standalone calculators, then the depliant summary.
  const icRatio = num(fasciaAttiva?.ic) ?? num(dati.dose_pasto?.ic) ?? firstNumber(dati.rapporto_ic?.risultato) ?? firstNumber(dati.depliant?.ic)
  const fsi = num(fasciaAttiva?.fsi) ?? num(dati.dose_pasto?.fsi) ?? firstNumber(dati.fsi?.risultato) ?? firstNumber(dati.depliant?.fsi)
  const target = num(fasciaAttiva?.target) ?? num(dati.dose_pasto?.target) ?? firstNumber(dati.depliant?.target)

  const choVal = num(cho)
  const glicemiaVal = num(glicemia)

  const mealDose = icRatio && choVal ? choVal / icRatio : null
  const correctionDose = fsi && target && glicemiaVal ? (glicemiaVal - target) / fsi : null
  const total = mealDose !== null || correctionDose !== null
    ? round05((mealDose || 0) + (correctionDose || 0))
    : null

  function registra() {
    if (total === null) return
    const entry = { cho: choVal, glicemia: glicemiaVal, total, fascia: fasciaAttiva?.nome || null, date: new Date().toISOString() }
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
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>💉 Calcolo dose insulina pasto</h3>

      {fasce.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={12} /> Fascia oraria — selezionata automaticamente in base all'ora, puoi cambiarla
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {fasce.map((f, i) => (
              <button key={i} onClick={() => setFasciaIdx(i)} style={{
                padding: '6px 12px', borderRadius: 100, border: `1.5px solid ${i === fasciaIdx ? '#1D4ED8' : 'var(--border)'}`,
                background: i === fasciaIdx ? '#EFF6FF' : 'var(--surface)', color: i === fasciaIdx ? '#1D4ED8' : 'var(--text-secondary)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer', font: 'inherit',
              }}>
                {f.nome || `Fascia ${i + 1}`}{f.oraDa && f.oraA ? ` · ${f.oraDa}–${f.oraA}` : ''}
              </button>
            ))}
          </div>
        </div>
      )}

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

      {fasce.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>📋 Il tuo profilo completo</p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--border)' }}>
                  <th style={{ padding: '6px 8px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Fascia</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Orario</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>I:C</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>FSI</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Target</th>
                </tr>
              </thead>
              <tbody>
                {fasce.map((f, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-light)', background: i === fasciaIdx ? '#EFF6FF' : (i % 2 ? 'var(--surface-2)' : 'transparent') }}>
                    <td style={{ padding: '7px 8px', fontWeight: i === fasciaIdx ? 700 : 400 }}>{f.nome || `Fascia ${i + 1}`}</td>
                    <td style={{ padding: '7px 8px', color: 'var(--text-secondary)' }}>{f.oraDa && f.oraA ? `${f.oraDa}–${f.oraA}` : '—'}</td>
                    <td style={{ padding: '7px 8px', color: 'var(--text-secondary)' }}>{f.ic ? `1:${f.ic}` : '—'}</td>
                    <td style={{ padding: '7px 8px', color: 'var(--text-secondary)' }}>{f.fsi || '—'}</td>
                    <td style={{ padding: '7px 8px', color: 'var(--text-secondary)' }}>{f.target || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                <span style={{ color: 'var(--text-secondary)' }}>{h.fascia ? `${h.fascia} · ` : ''}{h.cho ? `${h.cho}g CHO` : ''}{h.glicemia ? ` · ${h.glicemia} mg/dL` : ''}</span>
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
