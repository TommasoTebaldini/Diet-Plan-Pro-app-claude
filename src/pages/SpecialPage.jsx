import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { fetchSpecialSections } from '../lib/specialSections'
import { SPECIALTIES, FIELD_CONFIG, IDDSI_LEVELS, MEAL_COLUMNS } from '../data/specialtyMeta'
import DiabeteCalculator from '../components/specialty/DiabeteCalculator'
import ChetogenicaCalculator from '../components/specialty/ChetogenicaCalculator'
import PancreasCalculator from '../components/specialty/PancreasCalculator'
import RenaleGuide from '../components/specialty/RenaleGuide'
import SportCalculator from '../components/specialty/SportCalculator'
import DisfagiaGuide from '../components/specialty/DisfagiaGuide'
import GravidanzaTracker from '../components/specialty/GravidanzaTracker'
import ObesitaTracker from '../components/specialty/ObesitaTracker'
import OncologiaTracker from '../components/specialty/OncologiaTracker'
import PazienteSanoTracker from '../components/specialty/PazienteSanoTracker'
import PediatriaTracker from '../components/specialty/PediatriaTracker'
import DcaChecklist from '../components/specialty/DcaChecklist'
import {
  ChevronLeft, ChevronRight, Sparkles, Clock,
  Droplet, Scale, Activity, HeartPulse, Droplets, Flame, Stethoscope,
  FlaskConical, Baby, MessageCircle, Leaf, Heart,
} from 'lucide-react'

const ICONS = { Droplet, Scale, Activity, HeartPulse, Droplets, Flame, Stethoscope, FlaskConical, Baby, MessageCircle, Leaf, Heart }

// Pathologies with a dedicated interactive tool beyond the generic data view.
// Extend this as more calculators are built (chetogenica/GKI tracker,
// pancreas/enzyme dosage, renale/food guide by CKD stage, ecc.).
const TOOLS = {
  diabete: DiabeteCalculator,
  chetogenica: ChetogenicaCalculator,
  pancreas: PancreasCalculator,
  renale: RenaleGuide,
  sport: SportCalculator,
  disfagia: DisfagiaGuide,
  gravidanza: GravidanzaTracker,
  obesita: ObesitaTracker,
  oncologia: OncologiaTracker,
  paziente_sano: PazienteSanoTracker,
  pediatria: PediatriaTracker,
  dca: DcaChecklist,
}

function getPath(obj, path) {
  return path.split('.').reduce((o, k) => (o && typeof o === 'object' ? o[k] : undefined), obj)
}

function hasValue(v) {
  return v !== undefined && v !== null && String(v).trim() !== ''
}

function fmtDate(d) {
  return d ? new Date(d).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }) : ''
}

// ── generic field row ────────────────────────────────────────────────────────
function FieldRow({ label, value, unit }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
      <span style={{ fontSize: 13, color: 'var(--text-muted)', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'right' }}>{value}{unit ? ` ${unit}` : ''}</span>
    </div>
  )
}

function MealsTable({ meals }) {
  const rows = (meals || []).filter(m => m && (m.nome || m.alimenti))
  if (!rows.length) return null
  const cols = MEAL_COLUMNS.filter(c => rows.some(r => hasValue(r[c.key])))
  return (
    <div style={{ marginTop: 10, overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: '1.5px solid var(--border)' }}>
            {cols.map(c => <th key={c.key} style={{ padding: '6px 8px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((m, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--border-light)' }}>
              {cols.map(c => (
                <td key={c.key} style={{ padding: '7px 8px', color: 'var(--text-secondary)' }}>
                  {hasValue(m[c.key]) ? `${m[c.key]}${c.unit ? ' ' + c.unit : ''}` : '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function GroupCard({ group, dati }) {
  const data = getPath(dati, group.path) || {}
  const fields = (group.fields || []).filter(f => hasValue(data[f.key]))
  const meals = group.meals ? data[group.meals] : null
  const hasMeals = Array.isArray(meals) && meals.some(m => m && (m.nome || m.alimenti))
  const checkboxData = group.checkboxGroup ? getPath(dati, group.checkboxGroup.path) || {} : null
  const activeCheckboxes = checkboxData
    ? Object.entries(group.checkboxGroup.labels).filter(([k]) => checkboxData[k])
    : []

  if (!fields.length && !hasMeals && !activeCheckboxes.length) return null

  return (
    <div className="card" style={{ padding: 16 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{group.label}</h3>
      {fields.map(f => <FieldRow key={f.key} label={f.label || f.key} value={data[f.key]} unit={f.unit} />)}
      {activeCheckboxes.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{group.checkboxGroup.label}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {activeCheckboxes.map(([k, label]) => (
              <span key={k} style={{ fontSize: 11.5, background: 'var(--icon-bg-orange)', color: 'var(--orange)', borderRadius: 100, padding: '3px 10px', fontWeight: 500 }}>{label}</span>
            ))}
          </div>
        </div>
      )}
      {hasMeals && <MealsTable meals={meals} />}
    </div>
  )
}

function NoteDetail({ tipo, dati }) {
  const config = FIELD_CONFIG[tipo]
  if (!config) return null

  if (config.flatFields) {
    const fields = config.flatFields.filter(f => hasValue(dati[f.key]))
    if (!fields.length) return null
    return (
      <div className="card" style={{ padding: 16 }}>
        {fields.map(f => {
          if (f.format === 'iddsi') {
            const lvl = IDDSI_LEVELS[dati[f.key]]
            return <FieldRow key={f.key} label={f.label} value={lvl ? `Livello ${dati[f.key]} — ${lvl.nome}` : dati[f.key]} />
          }
          return <FieldRow key={f.key} label={f.label} value={dati[f.key]} unit={f.unit} />
        })}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(config.groups || []).map(g => <GroupCard key={g.path} group={g} dati={dati} />)}
    </div>
  )
}

// ── main page ─────────────────────────────────────────────────────────────────
export default function SpecialPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [sections, setSections] = useState([])
  const [activeTipo, setActiveTipo] = useState(null)

  useEffect(() => {
    if (!user?.id) return
    fetchSpecialSections(user.id).then(rows => { setSections(rows); setLoading(false) })
  }, [user?.id])

  const byKey = Object.fromEntries(sections.map(s => [s.key, s]))
  const availableSpecialties = SPECIALTIES.filter(s => byKey[s.key])
  const active = SPECIALTIES.find(s => s.key === activeTipo)
  const activeSection = active ? byKey[active.key] : null
  const Tool = active ? TOOLS[active.key] : null

  return (
    <div className="page">
      <div style={{ background: 'linear-gradient(160deg, #4c1d95, #7c3aed)', padding: 'calc(env(safe-area-inset-top) + 20px) 20px 24px' }}>
        {active ? (
          <button onClick={() => setActiveTipo(null)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 100, padding: '6px 12px 6px 8px', color: 'white', fontSize: 12, fontWeight: 600, marginBottom: 12, cursor: 'pointer' }}>
            <ChevronLeft size={14} /> Speciale
          </button>
        ) : (
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 }}>Attivato dal tuo dietista</p>
        )}
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'white', fontWeight: 300, display: 'flex', alignItems: 'center', gap: 8 }}>
          {!active && <Sparkles size={20} />} {active ? active.label : 'Speciale'}
        </h1>
      </div>

      <div style={{ padding: 20 }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: 64, borderRadius: 14, background: 'var(--border-light)', animation: 'skeletonPulse 1.4s ease-in-out infinite', animationDelay: `${i * 0.07}s` }} />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {!active ? (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {availableSpecialties.length === 0 ? (
                  <div className="card" style={{ padding: 24, textAlign: 'center' }}>
                    <Sparkles size={28} color="var(--text-muted)" style={{ marginBottom: 10 }} />
                    <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Nessuna sezione attiva</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Il tuo dietista non ha ancora attivato nessuna sezione qui.</p>
                  </div>
                ) : availableSpecialties.map(s => {
                  const Icon = ICONS[s.icon]
                  const section = byKey[s.key]
                  return (
                    <button key={s.key} onClick={() => setActiveTipo(s.key)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 14, cursor: 'pointer', font: 'inherit', textAlign: 'left' }}>
                      <div style={{ width: 42, height: 42, borderRadius: 12, background: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {Icon && <Icon size={20} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 600 }}>{s.label}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {section.note ? `Aggiornato ${fmtDate(section.note.updated_at || section.note.created_at)}` : 'In attesa dei dati del dietista'}
                        </p>
                      </div>
                      <ChevronRight size={18} color="var(--text-muted)" />
                    </button>
                  )
                })}
              </motion.div>
            ) : (
              <motion.div key="detail" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {!activeSection?.note ? (
                  <div className="card" style={{ padding: 24, textAlign: 'center' }}>
                    <Clock size={26} color="var(--text-muted)" style={{ marginBottom: 10 }} />
                    <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>In attesa dei dati</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Il tuo dietista ha attivato questa sezione ma non ha ancora salvato una scheda — torna a controllare più avanti.</p>
                  </div>
                ) : (
                  <>
                    {Tool && <Tool dati={activeSection.note.dati} />}
                    {activeSection.note.nota && <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{activeSection.note.nota}</p>}
                    <NoteDetail tipo={active.key} dati={activeSection.note.dati} />
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>Ultimo aggiornamento: {fmtDate(activeSection.note.updated_at || activeSection.note.created_at)}</p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
