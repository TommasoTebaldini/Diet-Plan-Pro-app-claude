import { useState } from 'react'
import { Syringe, Pill, ChevronDown, ChevronUp } from 'lucide-react'
import { calcDiabeteMealDose, calcPancreasMealDose } from '../lib/mealCalculators'

// Shows "what to do for this meal" directly inside the diario, computed from
// whichever specialty sections the dietitian has enabled AND configured for
// this patient — a diabetic patient sees the insulin dose, a patient with
// exocrine pancreatic insufficiency sees the enzyme dose, and a patient with
// both enabled sees both at once. Renders nothing if no enabled specialty has
// enough dietitian-entered data to compute anything for this meal — this is
// meant to appear only when it can give a real, actionable number.
export default function MealDoseCalculator({ specialtyNotes, choGrams, fatGrams, mealTime, currentWeight }) {
  const [glicemia, setGlicemia] = useState('')
  const [expanded, setExpanded] = useState(null)

  const diabeteDati = specialtyNotes.find(s => s.key === 'diabete')?.note?.dati
  const pancreasDati = specialtyNotes.find(s => s.key === 'pancreas')?.note?.dati

  const diabete = diabeteDati ? calcDiabeteMealDose(diabeteDati, { choGrams, glicemia, atTime: mealTime }) : null
  const pancreas = pancreasDati ? calcPancreasMealDose(pancreasDati, { fatGrams, currentWeight }) : null

  const rows = [
    diabete?.available && { key: 'diabete', icon: Syringe, color: '#1D4ED8', bg: '#EFF6FF', label: 'Insulina', dose: diabete.total !== null ? `${diabete.total} U` : null, calc: diabete },
    pancreas?.available && { key: 'pancreas', icon: Pill, color: '#D97706', bg: '#FEF3C7', label: 'Enzimi pancreatici', dose: pancreas.ul !== null ? `${pancreas.ul.toLocaleString('it-IT')} UL` : null, calc: pancreas },
  ].filter(Boolean)

  if (!rows.length) return null

  return (
    <div style={{ marginBottom: 8, borderRadius: 12, border: '1.5px solid #E0E7FF', overflow: 'hidden' }}>
      <div style={{ padding: '8px 12px', background: '#F5F3FF', borderBottom: '1px solid #E0E7FF' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#5B21B6' }}>📋 Cosa fare per questo pasto</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {rows.map(r => {
          const isOpen = expanded === r.key
          const Icon = r.icon
          return (
            <div key={r.key} style={{ borderBottom: '1px solid var(--border-light)' }}>
              <button
                onClick={() => setExpanded(isOpen ? null : r.key)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', textAlign: 'left' }}
              >
                <div style={{ width: 28, height: 28, borderRadius: 8, background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={13} color={r.color} />
                </div>
                <span style={{ flex: 1, fontSize: 12.5, fontWeight: 600 }}>{r.label}</span>
                <span style={{ fontSize: 13.5, fontWeight: 800, color: r.color }}>{r.dose ?? '—'}</span>
                {isOpen ? <ChevronUp size={14} color="var(--text-muted)" /> : <ChevronDown size={14} color="var(--text-muted)" />}
              </button>
              {isOpen && (
                <div style={{ padding: '0 12px 10px 49px' }}>
                  {r.key === 'diabete' && (
                    <>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        {choGrams > 0 && r.calc.icRatio && <>Dose pasto: {Math.round(choGrams)}g CHO ÷ 1:{r.calc.icRatio} = {r.calc.mealDose ?? 0} U<br /></>}
                        {r.calc.fasciaNome && <>Fascia oraria: {r.calc.fasciaNome}<br /></>}
                        {r.calc.needsGlicemia && 'Aggiungi la tua glicemia attuale per includere la dose di correzione.'}
                      </p>
                      {(r.calc.fsi && r.calc.target) && (
                        <div style={{ display: 'flex', gap: 6, marginTop: 6, alignItems: 'center' }}>
                          <input
                            type="number" inputMode="decimal" placeholder="Glicemia attuale (mg/dL)"
                            value={glicemia} onChange={e => setGlicemia(e.target.value)}
                            style={{ flex: 1, padding: '6px 9px', border: '1.5px solid var(--border)', borderRadius: 8, background: 'var(--surface-2)', fontSize: 12.5, outline: 'none', color: 'var(--text-primary)' }}
                          />
                          <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>mg/dL</span>
                        </div>
                      )}
                      {r.calc.correctionDose !== null && (
                        <p style={{ fontSize: 11, color: r.color, fontWeight: 600, marginTop: 6 }}>
                          + correzione: {r.calc.correctionDose} U
                        </p>
                      )}
                    </>
                  )}
                  {r.key === 'pancreas' && (
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      {r.calc.isGrassiMethod && fatGrams > 0 && <>Basato su {Math.round(fatGrams)}g di grassi in questo pasto.<br /></>}
                      {r.calc.isPesoMethod && <>Dose fissa per pasto principale, non dipende dai grassi di questo pasto.<br /></>}
                      {r.calc.creon40 !== null && <>Creon 40.000: {r.calc.creon40} cps · 25.000: {r.calc.creon25} cps · 10.000: {r.calc.creon10} cps</>}
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <p style={{ fontSize: 9.5, color: 'var(--text-muted)', padding: '6px 12px', background: 'var(--surface-2)' }}>
        Supporto al calcolo — verifica sempre con il tuo dietista/team clinico prima di somministrare.
      </p>
    </div>
  )
}
