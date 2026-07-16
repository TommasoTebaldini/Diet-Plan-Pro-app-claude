import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { fetchTodayIntake } from '../../lib/specialSections'

function num(v) {
  if (v === null || v === undefined || v === '') return null
  const n = parseFloat(String(v).replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

function Bar({ label, value, target, color }) {
  const pct = target ? Math.min(100, Math.round((value / target) * 100)) : 0
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
        <span style={{ fontWeight: 500 }}>{label}</span>
        <span><b>{Math.round(value)}</b> / {target} {pct > 0 && <span style={{ color, fontWeight: 600 }}>({pct}%)</span>}</span>
      </div>
      <div style={{ height: 6, background: 'var(--border-light)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width .6s' }} />
      </div>
    </div>
  )
}

const SYMPTOMS = [
  { key: 'nausea', label: 'Nausea', tips: ['Pasti piccoli e frequenti invece di 3 pasti abbondanti', 'Cibi freddi o a temperatura ambiente (meno odore dei cibi caldi)', 'Evita cibi grassi, fritti o molto speziati', 'Zenzero (tè, caramelle) può aiutare in alcuni casi'] },
  { key: 'gusto', label: 'Alterazioni del gusto', tips: ['Prova erbe aromatiche e marinature per compensare sapori "spenti"', 'Se il metallico è fastidioso, usa posate di plastica', 'Cibi freddi/tiepidi spesso hanno un sapore più gradevole'] },
  { key: 'mucosite', label: 'Mucosite (bocca/gola infiammata)', tips: ['Cibi morbidi, frullati, evitare acidi (agrumi, pomodoro) e piccanti', 'Evita cibi molto caldi o molto salati', 'Sciacqui con acqua e bicarbonato possono dare sollievo (chiedi al team curante)'] },
  { key: 'inappetenza', label: 'Scarso appetito', tips: ['Piccoli pasti ogni 2-3 ore invece di 3 pasti principali', 'Arricchisci i piatti con olio EVO, formaggio, frutta secca tritata per aumentare le kcal senza aumentare il volume', 'Bevi lontano dai pasti per non riempirti prima di mangiare'] },
]

export default function OncologiaTracker({ dati }) {
  const { user } = useAuth()
  const [intake, setIntake] = useState(null)
  const [openSymptom, setOpenSymptom] = useState(null)

  useEffect(() => {
    if (!user?.id) return
    fetchTodayIntake(user.id).then(setIntake)
  }, [user?.id])

  const kcalTarget = num(dati.fabbisogno?.kcal_target)
  const protTarget = num(dati.fabbisogno?.prot_target)
  if (kcalTarget === null && protTarget === null) return null

  return (
    <>
      <div className="card" style={{ padding: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>🎗️ Il tuo apporto di oggi</h3>
        {intake === null ? (
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Caricamento…</p>
        ) : (
          <>
            {kcalTarget !== null && <Bar label="Kcal" value={intake.kcal} target={kcalTarget} color="#DB2777" />}
            {protTarget !== null && <Bar label="Proteine (g)" value={intake.proteins} target={protTarget} color="#1D4ED8" />}
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Calcolato dal diario alimentare di oggi. Se fatichi a raggiungere il target, parlane con il tuo dietista — può indicarti supplementi orali (ONS) o strategie pratiche.</p>
          </>
        )}
      </div>

      <div className="card" style={{ padding: 16, marginTop: 12 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>💡 Gestione dei sintomi</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {SYMPTOMS.map(s => {
            const open = openSymptom === s.key
            return (
              <div key={s.key} style={{ border: '1px solid var(--border-light)', borderRadius: 10, overflow: 'hidden' }}>
                <button onClick={() => setOpenSymptom(open ? null : s.key)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', background: open ? '#FCE7F3' : 'var(--surface-2)', border: 'none', cursor: 'pointer', font: 'inherit',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: open ? '#DB2777' : 'var(--text-primary)' }}>{s.label}</span>
                  <ChevronDown size={16} color={open ? '#DB2777' : 'var(--text-muted)'} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
                </button>
                {open && (
                  <div style={{ padding: '10px 12px', background: 'var(--surface)' }}>
                    {s.tips.map((t, i) => (
                      <p key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: i < s.tips.length - 1 ? 4 : 0 }}>• {t}</p>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
