import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import { IDDSI_LEVELS, IDDSI_ALIMENTI } from '../../data/specialtyMeta'
import { useAuth } from '../../context/AuthContext'
import { fetchTodayIntake } from '../../lib/specialSections'
import { useT } from '../../i18n'

const CATEGORIES = [
  { key: 'ok', icon: '✅', color: '#16A34A', bg: '#F0FDF4' },
  { key: 'mod', icon: '⚠️', color: '#CA8A04', bg: '#FEFCE8' },
  { key: 'no', icon: '⛔', color: '#DC2626', bg: '#FEF2F2' },
]

const SAFETY_CHECKS = [
  { key: 'postura' },
  { key: 'bocconi' },
  { key: 'tempo' },
  { key: 'addensante' },
]

function todayKey() {
  const d = new Date()
  return `disfagia_safety_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function num(v) {
  if (v === null || v === undefined || v === '') return null
  const n = parseFloat(String(v).replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

export default function DisfagiaGuide({ dati }) {
  const t = useT()
  const { user } = useAuth()
  const [checked, setChecked] = useState({})
  const [intake, setIntake] = useState(null)
  const storageKey = todayKey()

  const categoryLabels = {
    ok: t('disfagia.categoryOk', 'Consentiti'),
    mod: t('disfagia.categoryMod', 'Con moderazione'),
    no: t('disfagia.categoryNo', 'Da evitare'),
  }

  const safetyLabels = {
    postura: t('disfagia.safetyPostura', 'Seduto/a con la schiena dritta'),
    bocconi: t('disfagia.safetyBocconi', 'Bocconi piccoli, uno alla volta'),
    tempo: t('disfagia.safetyTempo', 'Tempo sufficiente, senza fretta'),
    addensante: t('disfagia.safetyAddensante', 'Addensante nella quantità giusta (se previsto)'),
  }

  useEffect(() => {
    try { setChecked(JSON.parse(localStorage.getItem(storageKey) || '{}')) } catch { setChecked({}) }
  }, [storageKey])

  useEffect(() => {
    if (!user?.id) return
    fetchTodayIntake(user.id).then(setIntake)
  }, [user?.id])

  function toggle(key) {
    const next = { ...checked, [key]: !checked[key] }
    setChecked(next)
    try { localStorage.setItem(storageKey, JSON.stringify(next)) } catch { /* storage unavailable */ }
  }

  const level = dati.iddsi
  const meta = IDDSI_LEVELS[level]
  const foods = IDDSI_ALIMENTI[level]
  const kcalTarget = num(dati.kcal)
  if (!meta || !foods) return null

  const kcalPct = kcalTarget && intake ? Math.min(100, Math.round((intake.kcal / kcalTarget) * 100)) : 0

  return (
    <>
      <div className="card" style={{ padding: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{t('disfagia.headingLevel', { level }, '🗣️ Alimenti per il tuo livello — IDDSI {{level}}')}</h3>
        <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 14 }}>
          {t('disfagia.assignedConsistency', 'Consistenza assegnata dal tuo dietista:')} <b style={{ color: meta.color }}>{meta.nome}</b>
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {CATEGORIES.map(cat => (
            <div key={cat.key}>
              <p style={{ fontSize: 12.5, fontWeight: 700, color: cat.color, marginBottom: 8 }}>{cat.icon} {categoryLabels[cat.key]}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {foods[cat.key].map((f, i) => (
                  <span key={i} style={{ fontSize: 12, background: cat.bg, color: cat.color, borderRadius: 100, padding: '5px 12px', fontWeight: 500 }}>{f}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {kcalTarget !== null && intake !== null && (
        <div className="card" style={{ padding: 16, marginTop: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>{t('disfagia.headingCalorieIntake', '🎯 Apporto calorico di oggi')}</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
            <span style={{ fontWeight: 500 }}>{t('disfagia.intakeTodayLabel', 'Assunte oggi')}</span>
            <span><b>{Math.round(intake.kcal)}</b> / {kcalTarget} kcal</span>
          </div>
          <div style={{ height: 6, background: 'var(--border-light)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${kcalPct}%`, background: '#0369A1', borderRadius: 3, transition: 'width .6s' }} />
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 16, marginTop: 12 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{t('disfagia.headingSafetyChecks', '✅ Controlli di sicurezza per il pasto')}</h3>
        <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 12 }}>{t('disfagia.safetyChecksHint', 'Spunta prima di iniziare a mangiare.')}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {SAFETY_CHECKS.map(c => {
            const done = !!checked[c.key]
            return (
              <button key={c.key} onClick={() => toggle(c.key)} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10,
                border: '1.5px solid var(--border-light)', background: done ? '#E0F2FE' : 'var(--surface-2)',
                cursor: 'pointer', font: 'inherit', textAlign: 'left',
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 6, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1.5px solid ${done ? '#0369A1' : 'var(--border)'}`, background: done ? '#0369A1' : 'transparent',
                }}>
                  {done && <Check size={13} color="white" />}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{safetyLabels[c.key]}</span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
