import { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { fetchTodayIntake } from '../../lib/specialSections'
import { useT } from '../../i18n'

const STORAGE_KEY = 'gki_history_v1'
const MAX_HISTORY = 20

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function saveHistory(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_HISTORY))) } catch { /* storage unavailable */ }
}

// Same formula/thresholds as chetogenica.html's calcGKI() — glucose in mg/dL,
// ketones in mmol/L (standard blood ketone meter unit).
function computeGKI(glicemia, chetoni) {
  const glucMmol = glicemia / 18.0182
  return Math.round((glucMmol / chetoni) * 100) / 100
}

function interpretGKI(gki, t) {
  if (gki <= 1) return { label: t('cheto.interp_massima_label', 'Chetosi terapeutica massima'), desc: t('cheto.interp_massima_desc', 'oncologia, epilessia refrattaria'), color: '#7C3AED', bg: '#F5F3FF' }
  if (gki <= 3) return { label: t('cheto.interp_terapeutica_label', 'Chetosi terapeutica'), desc: t('cheto.interp_terapeutica_desc', 'epilessia, malattie neurodegenerative'), color: '#2563EB', bg: '#EFF6FF' }
  if (gki <= 6) return { label: t('cheto.interp_moderata_label', 'Chetosi moderata'), desc: t('cheto.interp_moderata_desc', 'perdita peso, diabete tipo 2'), color: '#CA8A04', bg: '#FEFCE8' }
  if (gki <= 9) return { label: t('cheto.interp_lieve_label', 'Chetosi lieve / adattamento'), desc: '', color: '#16A34A', bg: '#F0FDF4' }
  return { label: t('cheto.interp_non_chetosi_label', 'Non in chetosi nutrizionale'), desc: '', color: '#64748B', bg: '#F8FAFC' }
}

export default function ChetogenicaCalculator() {
  const t = useT()
  const { user } = useAuth()
  const [glicemia, setGlicemia] = useState('')
  const [chetoni, setChetoni] = useState('')
  const [history, setHistory] = useState([])
  const [intake, setIntake] = useState(null)

  useEffect(() => { setHistory(loadHistory()) }, [])
  useEffect(() => {
    if (!user?.id) return
    fetchTodayIntake(user.id).then(setIntake)
  }, [user?.id])

  const g = parseFloat(glicemia)
  const k = parseFloat(chetoni)
  const valid = g > 0 && k > 0
  const gki = valid ? computeGKI(g, k) : null
  const interp = gki !== null ? interpretGKI(gki, t) : null

  function registra() {
    if (gki === null) return
    const entry = { glicemia: g, chetoni: k, gki, date: new Date().toISOString() }
    const next = [entry, ...history].slice(0, MAX_HISTORY)
    setHistory(next)
    saveHistory(next)
    setGlicemia('')
    setChetoni('')
  }

  function cancella() {
    setHistory([])
    saveHistory([])
  }

  return (
    <div className="card" style={{ padding: 16 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{t('cheto.title', '🔬 Calcolo GKI — Glucose Ketone Index')}</h3>
      <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 14 }}>
        {t('cheto.subtitle', 'Registra glicemia e chetoni ematici dopo la misurazione per calcolare il tuo indice di chetosi.')}
      </p>

      <div style={{ display: 'flex', gap: 10 }}>
        <div className="input-group" style={{ flex: 1 }}>
          <label className="input-label">{t('cheto.label_glicemia', 'Glicemia (mg/dL)')}</label>
          <input type="number" inputMode="decimal" className="input-field" placeholder={t('cheto.placeholder_glicemia', 'es. 85')} value={glicemia} onChange={e => setGlicemia(e.target.value)} />
        </div>
        <div className="input-group" style={{ flex: 1 }}>
          <label className="input-label">{t('cheto.label_chetoni', 'Chetoni (mmol/L)')}</label>
          <input type="number" inputMode="decimal" className="input-field" placeholder={t('cheto.placeholder_chetoni', 'es. 1.5')} value={chetoni} onChange={e => setChetoni(e.target.value)} />
        </div>
      </div>

      {interp && (
        <div style={{ marginTop: 14, padding: '14px 16px', background: interp.bg, borderRadius: 12 }}>
          <p style={{ fontSize: 12, color: interp.color, marginBottom: 4 }}>{t('cheto.gki_label', 'GKI')}</p>
          <p style={{ fontSize: 26, fontWeight: 800, color: interp.color }}>{gki}</p>
          <p style={{ fontSize: 12.5, fontWeight: 600, color: interp.color, marginTop: 4 }}>{interp.label}</p>
          {interp.desc && <p style={{ fontSize: 11, color: interp.color, opacity: 0.8 }}>{interp.desc}</p>}
        </div>
      )}

      <button className="btn btn-primary btn-full" onClick={registra} disabled={!valid} style={{ marginTop: 12 }}>
        {t('cheto.btn_salva', 'Salva rilevazione')}
      </button>

      {intake && intake.carbs > 0 && (
        <div style={{ marginTop: 14, padding: '10px 12px', background: intake.carbs <= 20 ? '#F0FDF4' : intake.carbs <= 50 ? '#FEFCE8' : '#FEF2F2', borderRadius: 10 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: intake.carbs <= 20 ? '#16A34A' : intake.carbs <= 50 ? '#CA8A04' : '#DC2626' }}>
            {t('cheto.carbs_today', { carbs: Math.round(intake.carbs) }, '🍞 Carboidrati assunti oggi: {{carbs}} g')}
          </p>
          <p style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 2 }}>{t('cheto.carbs_reference', 'Riferimento generale chetogenica: solitamente sotto i 20-50 g/die — verifica il tuo target specifico con il dietista.')}</p>
        </div>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{t('cheto.history_title', '📋 Cronologia (su questo dispositivo)')}</p>
            <button onClick={cancella} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '10px 4px', margin: '-10px -4px' }}>
              <Trash2 size={12} /> {t('cheto.btn_cancella', 'Cancella')}
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {history.map((h, i) => {
              const hi = interpretGKI(h.gki, t)
              return (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--surface-2)', borderRadius: 10, fontSize: 12 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{new Date(h.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{h.glicemia} mg/dL · {h.chetoni} mmol/L</span>
                  <span style={{ fontWeight: 700, color: hi.color }}>{t('cheto.history_gki_prefix', 'GKI')} {h.gki}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
