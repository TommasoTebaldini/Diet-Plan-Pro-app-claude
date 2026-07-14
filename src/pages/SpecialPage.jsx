import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { fetchVisibleSpecialtyNotes } from '../lib/specialSections'
import { SPECIALTIES, FIELD_CONFIG, IDDSI_LEVELS, MEAL_COLUMNS } from '../data/specialtyMeta'
import {
  ChevronLeft, ChevronRight, Sparkles,
  Droplet, Scale, Activity, HeartPulse, Droplets, Flame, Stethoscope,
  FlaskConical, Baby, MessageCircle, Leaf, Heart,
} from 'lucide-react'

const ICONS = { Droplet, Scale, Activity, HeartPulse, Droplets, Flame, Stethoscope, FlaskConical, Baby, MessageCircle, Leaf, Heart }

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

function NoteDetail({ tipo, note }) {
  const config = FIELD_CONFIG[tipo]
  if (!config) return null

  if (config.flatFields) {
    const fields = config.flatFields.filter(f => hasValue(note.dati[f.key]))
    if (!fields.length) return null
    return (
      <div className="card" style={{ padding: 16 }}>
        {fields.map(f => {
          if (f.format === 'iddsi') {
            const lvl = IDDSI_LEVELS[note.dati[f.key]]
            return <FieldRow key={f.key} label={f.label} value={lvl ? `Livello ${note.dati[f.key]} — ${lvl.nome}` : note.dati[f.key]} />
          }
          return <FieldRow key={f.key} label={f.label} value={note.dati[f.key]} unit={f.unit} />
        })}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(config.groups || []).map(g => <GroupCard key={g.path} group={g} dati={note.dati} />)}
    </div>
  )
}

// ── main page ─────────────────────────────────────────────────────────────────
export default function SpecialPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState([])
  const [activeTipo, setActiveTipo] = useState(null)

  useEffect(() => {
    if (!user?.id) return
    fetchVisibleSpecialtyNotes(user.id).then(rows => { setNotes(rows); setLoading(false) })
  }, [user?.id])

  const byTipo = {}
  for (const n of notes) {
    if (!byTipo[n.tipo]) byTipo[n.tipo] = []
    byTipo[n.tipo].push(n)
  }
  const availableSpecialties = SPECIALTIES.filter(s => byTipo[s.key]?.length)
  const active = SPECIALTIES.find(s => s.key === activeTipo)

  return (
    <div className="page">
      <div style={{ background: 'linear-gradient(160deg, #4c1d95, #7c3aed)', padding: 'calc(env(safe-area-inset-top) + 20px) 20px 24px' }}>
        {active ? (
          <button onClick={() => setActiveTipo(null)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 100, padding: '6px 12px 6px 8px', color: 'white', fontSize: 12, fontWeight: 600, marginBottom: 12, cursor: 'pointer' }}>
            <ChevronLeft size={14} /> Speciale
          </button>
        ) : (
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 }}>Condiviso dal tuo dietista</p>
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
                    <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Nessun contenuto condiviso</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Il tuo dietista non ha ancora reso visibile nessuna scheda qui.</p>
                  </div>
                ) : availableSpecialties.map(s => {
                  const Icon = ICONS[s.icon]
                  const count = byTipo[s.key].length
                  return (
                    <button key={s.key} onClick={() => setActiveTipo(s.key)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 14, cursor: 'pointer', font: 'inherit', textAlign: 'left' }}>
                      <div style={{ width: 42, height: 42, borderRadius: 12, background: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {Icon && <Icon size={20} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 600 }}>{s.label}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{count} {count === 1 ? 'scheda condivisa' : 'schede condivise'} · aggiornato {fmtDate(byTipo[s.key][0].created_at)}</p>
                      </div>
                      <ChevronRight size={18} color="var(--text-muted)" />
                    </button>
                  )
                })}
              </motion.div>
            ) : (
              <motion.div key="detail" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {byTipo[active.key].map(note => (
                  <div key={note.id}>
                    {note.nota && <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>{note.nota}</p>}
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>{fmtDate(note.updated_at || note.created_at)}</p>
                    <NoteDetail tipo={active.key} note={note} />
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
