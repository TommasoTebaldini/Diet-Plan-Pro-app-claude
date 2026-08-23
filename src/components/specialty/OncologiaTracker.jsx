import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { fetchTodayIntake } from '../../lib/specialSections'
import { useT } from '../../i18n'

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

export default function OncologiaTracker({ dati }) {
  const t = useT()
  const { user } = useAuth()
  const [intake, setIntake] = useState(null)
  const [openSymptom, setOpenSymptom] = useState(null)

  const SYMPTOMS = [
    { key: 'nausea', label: t('oncologia.symptomNauseaLabel', 'Nausea'), tips: [
      t('oncologia.symptomNauseaTip1', 'Pasti piccoli e frequenti invece di 3 pasti abbondanti'),
      t('oncologia.symptomNauseaTip2', 'Cibi freddi o a temperatura ambiente (meno odore dei cibi caldi)'),
      t('oncologia.symptomNauseaTip3', 'Evita cibi grassi, fritti o molto speziati'),
      t('oncologia.symptomNauseaTip4', 'Zenzero (tè, caramelle) può aiutare in alcuni casi'),
    ] },
    { key: 'gusto', label: t('oncologia.symptomGustoLabel', 'Alterazioni del gusto'), tips: [
      t('oncologia.symptomGustoTip1', 'Prova erbe aromatiche e marinature per compensare sapori "spenti"'),
      t('oncologia.symptomGustoTip2', 'Se il metallico è fastidioso, usa posate di plastica'),
      t('oncologia.symptomGustoTip3', 'Cibi freddi/tiepidi spesso hanno un sapore più gradevole'),
    ] },
    { key: 'mucosite', label: t('oncologia.symptomMucositeLabel', 'Mucosite (bocca/gola infiammata)'), tips: [
      t('oncologia.symptomMucositeTip1', 'Cibi morbidi, frullati, evitare acidi (agrumi, pomodoro) e piccanti'),
      t('oncologia.symptomMucositeTip2', 'Evita cibi molto caldi o molto salati'),
      t('oncologia.symptomMucositeTip3', 'Sciacqui con acqua e bicarbonato possono dare sollievo (chiedi al team curante)'),
    ] },
    { key: 'inappetenza', label: t('oncologia.symptomInappetenzaLabel', 'Scarso appetito'), tips: [
      t('oncologia.symptomInappetenzaTip1', 'Piccoli pasti ogni 2-3 ore invece di 3 pasti principali'),
      t('oncologia.symptomInappetenzaTip2', 'Arricchisci i piatti con olio EVO, formaggio, frutta secca tritata per aumentare le kcal senza aumentare il volume'),
      t('oncologia.symptomInappetenzaTip3', 'Bevi lontano dai pasti per non riempirti prima di mangiare'),
    ] },
  ]

  useEffect(() => {
    if (!user?.id) return
    fetchTodayIntake(user.id).then(setIntake)
  }, [user?.id])

  const kcalTarget = num(dati.fabbisogno?.kcal_target)
  const protTarget = num(dati.fabbisogno?.prot_target)
  const dpeso = dati.clinica?.dpeso
  const dpesoMatch = dpeso ? String(dpeso).match(/-?\d+(?:[.,]\d+)?/) : null
  const dpesoNum = dpesoMatch ? parseFloat(dpesoMatch[0].replace(',', '.')) : null
  const dpesoAlert = dpesoNum !== null && dpesoNum < 0
  if (kcalTarget === null && protTarget === null && !dpeso) return null

  return (
    <>
      {dpeso && (
        <div className="card" style={{ padding: '14px 16px', marginBottom: 12, background: dpesoAlert ? '#FEF2F2' : 'var(--surface)', border: dpesoAlert ? '1.5px solid #FECACA' : undefined }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>{dpesoAlert ? '⚠️' : '⚖️'}</span>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: dpesoAlert ? '#B91C1C' : 'var(--text-primary)' }}>{t('oncologia.weightChangeLabel', { dpeso }, 'Variazione di peso recente: {{dpeso}}')}</p>
              {dpesoAlert && <p style={{ fontSize: 11, color: '#B91C1C', marginTop: 2 }}>{t('oncologia.weightChangeAlert', 'Un calo di peso in corso — parlane con il tuo team di cura al prossimo controllo.')}</p>}
            </div>
          </div>
        </div>
      )}

      {(kcalTarget !== null || protTarget !== null) && (
      <div className="card" style={{ padding: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>{t('oncologia.intakeTitle', '🎗️ Il tuo apporto di oggi')}</h3>
        {intake === null ? (
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t('oncologia.loading', 'Caricamento…')}</p>
        ) : (
          <>
            {kcalTarget !== null && <Bar label={t('oncologia.kcalLabel', 'Kcal')} value={intake.kcal} target={kcalTarget} color="#DB2777" />}
            {protTarget !== null && <Bar label={t('oncologia.proteinsLabel', 'Proteine (g)')} value={intake.proteins} target={protTarget} color="#1D4ED8" />}
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{t('oncologia.intakeNote', 'Calcolato dal diario alimentare di oggi. Se fatichi a raggiungere il target, parlane con il tuo dietista — può indicarti supplementi orali (ONS) o strategie pratiche.')}</p>
          </>
        )}
      </div>
      )}

      <div className="card" style={{ padding: 16, marginTop: 12 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>{t('oncologia.symptomsTitle', '💡 Gestione dei sintomi')}</h3>
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
                    {s.tips.map((tip, i) => (
                      <p key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: i < s.tips.length - 1 ? 4 : 0 }}>• {tip}</p>
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
