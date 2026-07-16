import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { fetchSpecialSections } from '../lib/specialSections'
import { SPECIALTIES, FIELD_CONFIG, IDDSI_LEVELS, MEAL_COLUMNS, TIPS, QUICK_LINKS } from '../data/specialtyMeta'
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
  ChevronLeft, ChevronRight, Sparkles, Clock, Lightbulb, BookOpen, Scale, Droplets, MessageCircle,
} from 'lucide-react'

// Icons referenced by key from QUICK_LINKS (specialtyMeta.js) — pathology
// identity itself is shown with emoji now, not lucide icons.
const ICONS = { BookOpen, Scale, Droplets, MessageCircle }

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

// Darkens a hex color for the header gradient's top stop (same two-stop
// gradient style as the rest of the app's page headers, e.g. var(--green-dark)
// → var(--green-main), just computed per-pathology instead of a fixed pair).
function darken(hex, factor = 0.6) {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.round(((n >> 16) & 255) * factor)
  const g = Math.round(((n >> 8) & 255) * factor)
  const b = Math.round((n & 255) * factor)
  return `rgb(${r},${g},${b})`
}

// Keyword-based icon for a data group — avoids having to hand-annotate every
// single group across 12 pathologies with its own icon.
function groupIcon(path) {
  const p = path.toLowerCase()
  if (p.includes('piano')) return '🍽️'
  if (p.includes('fabbisogno')) return '🔥'
  if (p.includes('dose') || p.includes('pert')) return '💉'
  if (p.includes('gki')) return '🔬'
  if (p.includes('calcolo')) return '🧮'
  if (p.includes('valutazione') || p.includes('clinica')) return '📋'
  if (p.includes('supporto') || p.includes('sintomi')) return '💊'
  if (p.includes('comportamento')) return '🧠'
  if (p.includes('rapporto')) return '⚖️'
  return '📌'
}

// ── generic field row ────────────────────────────────────────────────────────
function FieldRow({ label, value, unit }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '9px 0', borderBottom: '1px solid var(--border-light)' }}>
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
            <tr key={i} style={{ borderBottom: '1px solid var(--border-light)', background: i % 2 ? 'var(--surface-2)' : 'transparent' }}>
              {cols.map(c => (
                <td key={c.key} style={{ padding: '8px', color: 'var(--text-secondary)' }}>
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

function GroupCard({ group, dati, accent }) {
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 16 }}>{groupIcon(group.path)}</span>
        <h3 style={{ fontSize: 14, fontWeight: 700 }}>{group.label}</h3>
      </div>
      {fields.map(f => <FieldRow key={f.key} label={f.label || f.key} value={data[f.key]} unit={f.unit} />)}
      {activeCheckboxes.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{group.checkboxGroup.label}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {activeCheckboxes.map(([k, label]) => (
              <span key={k} style={{ fontSize: 11.5, background: `${accent}1a`, color: accent, borderRadius: 100, padding: '3px 10px', fontWeight: 500 }}>{label}</span>
            ))}
          </div>
        </div>
      )}
      {hasMeals && <MealsTable meals={meals} />}
    </div>
  )
}

function TipsCard({ tipo, accent, accentBg }) {
  const tips = TIPS[tipo]
  if (!tips?.length) return null
  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Lightbulb size={16} color={accent} />
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 700 }}>Consigli pratici</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tips.map((t, i) => {
          const tip = typeof t === 'string' ? { text: t } : t
          return (
            <div key={i} style={{ display: 'flex', gap: 9, padding: '9px 11px', background: 'var(--surface-2)', borderRadius: 10 }}>
              <span style={{ flexShrink: 0, color: accent, fontWeight: 700, fontSize: 13 }}>{i + 1}</span>
              <div>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{tip.text}</p>
                {tip.tel && (
                  <a href={`tel:${tip.tel}`} style={{ display: 'inline-block', marginTop: 6, fontSize: 14, fontWeight: 700, color: accent, textDecoration: 'none' }}>
                    📞 {tip.telLabel || tip.tel}
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function QuickLinksRow({ tipo }) {
  const links = QUICK_LINKS[tipo]
  if (!links?.length) return null
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {links.map(l => {
        const Icon = ICONS[l.icon]
        return (
          <Link key={l.to} to={l.to} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 100, textDecoration: 'none', color: 'var(--text-secondary)', fontSize: 12.5, fontWeight: 600 }}>
            {Icon && <Icon size={14} />} {l.label}
          </Link>
        )
      })}
    </div>
  )
}

function NoteDetail({ tipo, dati, accent }) {
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
      {(config.groups || []).map(g => <GroupCard key={g.path} group={g} dati={dati} accent={accent} />)}
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

  const headerGradient = active
    ? `linear-gradient(160deg, ${darken(active.color)}, ${active.color})`
    : 'linear-gradient(160deg, #4c1d95, #7c3aed)'

  return (
    <div className="page">
      <div style={{ background: headerGradient, padding: 'calc(env(safe-area-inset-top) + 20px) 20px 24px', transition: 'background .25s' }}>
        {active ? (
          <>
            <button onClick={() => setActiveTipo(null)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 100, padding: '6px 12px 6px 8px', color: 'white', fontSize: 12, fontWeight: 600, marginBottom: 16, cursor: 'pointer' }}>
              <ChevronLeft size={14} /> ✨ Speciale
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 26 }}>
                {active.emoji}
              </div>
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'white', fontWeight: 400, lineHeight: 1.2 }}>{active.emoji} {active.label}</h1>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2 }}>{active.description}</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 }}>Attivato dal tuo dietista</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'white', fontWeight: 300, display: 'flex', alignItems: 'center', gap: 8 }}>
              ✨ Speciale
            </h1>
          </>
        )}
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
                  <div className="card" style={{ padding: 28, textAlign: 'center' }}>
                    <Sparkles size={30} color="var(--text-muted)" style={{ marginBottom: 12 }} />
                    <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Nessuna sezione attiva</p>
                    <p style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Il tuo dietista non ha ancora attivato nessuna sezione qui.</p>
                  </div>
                ) : availableSpecialties.map((s, i) => {
                  const section = byKey[s.key]
                  return (
                    <motion.button
                      key={s.key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.28 }}
                      onClick={() => setActiveTipo(s.key)}
                      style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px', background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 16, cursor: 'pointer', font: 'inherit', textAlign: 'left', boxShadow: 'var(--shadow-xs)' }}
                    >
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 24 }}>
                        {s.emoji}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 14.5, fontWeight: 700 }}>{s.emoji} {s.label}</p>
                        <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 1 }}>{s.description}</p>
                        <p style={{ fontSize: 10.5, color: section.note ? s.color : 'var(--text-muted)', fontWeight: 600, marginTop: 4 }}>
                          {section.note ? `● Aggiornato ${fmtDate(section.note.updated_at || section.note.created_at)}` : '○ In attesa dei dati del dietista'}
                        </p>
                      </div>
                      <ChevronRight size={18} color="var(--text-muted)" />
                    </motion.button>
                  )
                })}
              </motion.div>
            ) : (
              <motion.div key="detail" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <QuickLinksRow tipo={active.key} />
                {!activeSection?.note ? (
                  <div className="card" style={{ padding: 28, textAlign: 'center' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 16, background: active.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                      <Clock size={24} color={active.color} />
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>In attesa dei dati</p>
                    <p style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Il tuo dietista ha attivato questa sezione ma non ha ancora salvato una scheda — torna a controllare più avanti.</p>
                  </div>
                ) : (
                  <>
                    {Tool && <Tool dati={activeSection.note.dati} accent={active.color} accentBg={active.bg} />}
                    <TipsCard tipo={active.key} accent={active.color} accentBg={active.bg} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                        <div style={{ flex: 1, height: 1, background: 'var(--border-light)' }} />
                        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Dati della scheda</p>
                        <div style={{ flex: 1, height: 1, background: 'var(--border-light)' }} />
                      </div>
                      {activeSection.note.nota && <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>{activeSection.note.nota}</p>}
                      <NoteDetail tipo={active.key} dati={activeSection.note.dati} accent={active.color} />
                    </div>
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
