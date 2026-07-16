import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { fetchTodayIntake } from '../../lib/specialSections'

function num(v) {
  if (v === null || v === undefined || v === '') return null
  const n = parseFloat(String(v).replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

function todayKey(prefix) {
  const d = new Date()
  return `${prefix}_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// WHO Child Growth Standards (median + SD by age in months) — ported from the
// dietitian-side growth-chart tool (pediatria.html) so both apps agree.
const WHO_WEIGHT = {
  M: { 0:{med:3.35,sd:0.43},3:{med:6.0,sd:0.67},6:{med:7.9,sd:0.78},9:{med:9.2,sd:0.88},12:{med:9.6,sd:0.92},18:{med:10.9,sd:1.00},24:{med:12.2,sd:1.10},30:{med:13.3,sd:1.18},36:{med:14.3,sd:1.25},42:{med:15.3,sd:1.33},48:{med:16.3,sd:1.42},54:{med:17.3,sd:1.52},60:{med:18.3,sd:1.63},72:{med:20.5,sd:1.93},84:{med:22.9,sd:2.30},96:{med:25.3,sd:2.73},108:{med:28.1,sd:3.25},120:{med:31.9,sd:4.00},132:{med:36.3,sd:5.00},144:{med:41.2,sd:6.30},156:{med:46.8,sd:7.70},168:{med:53.3,sd:9.20},180:{med:58.7,sd:10.30},192:{med:63.0,sd:10.90},204:{med:65.0,sd:11.30},216:{med:66.0,sd:11.70} },
  F: { 0:{med:3.23,sd:0.40},3:{med:5.4,sd:0.58},6:{med:7.3,sd:0.68},9:{med:8.5,sd:0.78},12:{med:9.0,sd:0.83},18:{med:10.2,sd:0.93},24:{med:11.5,sd:1.05},30:{med:12.6,sd:1.15},36:{med:13.9,sd:1.28},42:{med:15.0,sd:1.40},48:{med:15.9,sd:1.52},54:{med:16.9,sd:1.65},60:{med:17.9,sd:1.78},72:{med:20.2,sd:2.20},84:{med:22.6,sd:2.72},96:{med:25.2,sd:3.32},108:{med:28.5,sd:4.05},120:{med:32.5,sd:4.98},132:{med:37.0,sd:6.10},144:{med:41.5,sd:7.40},156:{med:46.0,sd:8.65},168:{med:49.4,sd:9.40},180:{med:52.0,sd:9.75},192:{med:54.0,sd:10.00},204:{med:55.0,sd:10.10},216:{med:56.0,sd:10.20} },
}
const WHO_HEIGHT = {
  M: { 0:{med:49.9,sd:1.89},3:{med:61.4,sd:1.98},6:{med:67.6,sd:2.01},9:{med:72.0,sd:2.15},12:{med:75.7,sd:2.21},18:{med:82.3,sd:2.36},24:{med:87.8,sd:2.55},30:{med:92.6,sd:2.67},36:{med:96.1,sd:2.80},42:{med:99.8,sd:2.94},48:{med:103.3,sd:3.07},54:{med:106.7,sd:3.20},60:{med:110.0,sd:3.35},72:{med:116.0,sd:3.61},84:{med:121.7,sd:3.87},96:{med:127.3,sd:4.12},108:{med:132.6,sd:4.38},120:{med:137.8,sd:4.65},132:{med:143.5,sd:5.10},144:{med:149.1,sd:5.70},156:{med:155.5,sd:6.20},168:{med:162.4,sd:6.05},180:{med:167.5,sd:5.80},192:{med:170.8,sd:5.50},204:{med:172.9,sd:5.20},216:{med:174.0,sd:5.05} },
  F: { 0:{med:49.1,sd:1.86},3:{med:59.8,sd:1.90},6:{med:65.7,sd:1.95},9:{med:70.1,sd:2.07},12:{med:74.0,sd:2.16},18:{med:80.7,sd:2.28},24:{med:86.4,sd:2.46},30:{med:91.2,sd:2.60},36:{med:95.1,sd:2.76},42:{med:98.8,sd:2.91},48:{med:102.7,sd:3.05},54:{med:106.4,sd:3.19},60:{med:109.4,sd:3.33},72:{med:115.0,sd:3.60},84:{med:121.0,sd:3.88},96:{med:126.6,sd:4.14},108:{med:132.0,sd:4.43},120:{med:138.6,sd:4.74},132:{med:144.5,sd:5.28},144:{med:151.5,sd:5.85},156:{med:156.0,sd:6.02},168:{med:158.7,sd:5.80},180:{med:160.5,sd:5.55},192:{med:161.5,sd:5.40},204:{med:162.5,sd:5.30},216:{med:163.0,sd:5.25} },
}

function zToPercentile(z) {
  const table = [[-3.0,0.1],[-2.5,0.6],[-2.0,2.3],[-1.5,6.7],[-1.0,15.9],[-0.5,30.9],[0.0,50.0],[0.5,69.1],[1.0,84.1],[1.5,93.3],[2.0,97.7],[2.5,99.4],[3.0,99.9]]
  if (z <= -3.0) return 0.1
  if (z >= 3.0) return 99.9
  for (let i = 1; i < table.length; i++) {
    if (z <= table[i][0]) {
      const t = (z - table[i - 1][0]) / (table[i][0] - table[i - 1][0])
      return table[i - 1][1] + t * (table[i][1] - table[i - 1][1])
    }
  }
  return 50
}

function getClosestAge(table, ageMonths) {
  const ages = Object.keys(table).map(Number)
  return ages.reduce((a, b) => Math.abs(b - ageMonths) < Math.abs(a - ageMonths) ? b : a)
}

function percentileFor(table, sesso, ageMonths, value) {
  const bySex = table[sesso]
  if (!bySex || !value || ageMonths === null) return null
  const closest = getClosestAge(bySex, ageMonths)
  const { med, sd } = bySex[closest]
  const z = (value - med) / sd
  return Math.round(zToPercentile(z) * 10) / 10
}

export default function PediatriaTracker({ dati }) {
  const { user, profile } = useAuth()
  const [intake, setIntake] = useState(null)
  const [checked, setChecked] = useState({})
  const storageKey = todayKey('ped_meals')

  useEffect(() => {
    if (!user?.id) return
    fetchTodayIntake(user.id).then(setIntake)
  }, [user?.id])

  useEffect(() => {
    try { setChecked(JSON.parse(localStorage.getItem(storageKey) || '{}')) } catch { setChecked({}) }
  }, [storageKey])

  function toggle(name) {
    const next = { ...checked, [name]: !checked[name] }
    setChecked(next)
    try { localStorage.setItem(storageKey, JSON.stringify(next)) } catch { /* storage unavailable */ }
  }

  const pasti = (dati.piano?.pasti || []).filter(m => m && (m.nome || m.alimenti))
  const kcalTarget = num(dati.piano?.kcal)

  const sesso = profile?.gender === 'F' ? 'F' : profile?.gender === 'M' ? 'M' : null
  const anni = num(dati.paziente?.anni)
  const mesiExtra = num(dati.paziente?.mesi)
  const ageMonths = anni !== null ? Math.round(anni * 12 + (mesiExtra || 0)) : null
  const peso = num(dati.paziente?.peso)
  const altezza = num(dati.paziente?.altezza)
  const pesoPerc = sesso && ageMonths !== null ? percentileFor(WHO_WEIGHT, sesso, ageMonths, peso) : null
  const altezzaPerc = sesso && ageMonths !== null ? percentileFor(WHO_HEIGHT, sesso, ageMonths, altezza) : null
  const hasGrowth = pesoPerc !== null || altezzaPerc !== null

  if (!pasti.length && kcalTarget === null && !hasGrowth) return null

  function percBadge(perc) {
    if (perc < 3 || perc > 97) return { color: '#DC2626', bg: '#FEF2F2', label: perc < 3 ? 'Molto basso' : 'Molto alto' }
    if (perc < 15 || perc > 85) return { color: '#CA8A04', bg: '#FEFCE8', label: perc < 15 ? 'Sotto la media' : 'Sopra la media' }
    return { color: '#16A34A', bg: '#F0FDF4', label: 'Nella norma' }
  }

  return (
    <>
      {hasGrowth && (
        <div className="card" style={{ padding: 16, marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>📈 La tua crescita</h3>
          <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 14 }}>Percentili calcolati sulle curve di crescita OMS per età e sesso.</p>
          <div style={{ display: 'grid', gridTemplateColumns: pesoPerc !== null && altezzaPerc !== null ? '1fr 1fr' : '1fr', gap: 10 }}>
            {pesoPerc !== null && (() => { const b = percBadge(pesoPerc); return (
              <div style={{ textAlign: 'center', padding: '12px 10px', background: b.bg, borderRadius: 12 }}>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Peso/Età</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: b.color }}>{pesoPerc}° perc.</p>
                <p style={{ fontSize: 11, fontWeight: 600, color: b.color, marginTop: 2 }}>{b.label}</p>
              </div>
            )})()}
            {altezzaPerc !== null && (() => { const b = percBadge(altezzaPerc); return (
              <div style={{ textAlign: 'center', padding: '12px 10px', background: b.bg, borderRadius: 12 }}>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Altezza/Età</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: b.color }}>{altezzaPerc}° perc.</p>
                <p style={{ fontSize: 11, fontWeight: 600, color: b.color, marginTop: 2 }}>{b.label}</p>
              </div>
            )})()}
          </div>
          <p style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 12, textAlign: 'center' }}>
            Basato su OMS Child Growth Standards — parlane sempre con il tuo dietista/pediatra.
          </p>
        </div>
      )}
      {(pasti.length > 0 || kcalTarget !== null) && (
    <div className="card" style={{ padding: 16 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>👶 Pasti di oggi</h3>

      {pasti.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: kcalTarget !== null ? 16 : 0 }}>
          {pasti.map((m, i) => (
            <button key={i} onClick={() => toggle(m.nome || `pasto-${i}`)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: '1.5px solid var(--border-light)',
              background: checked[m.nome || `pasto-${i}`] ? '#E0E7FF' : 'var(--surface)', cursor: 'pointer', font: 'inherit', textAlign: 'left',
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: 6, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1.5px solid ${checked[m.nome || `pasto-${i}`] ? '#4F46E5' : 'var(--border)'}`,
                background: checked[m.nome || `pasto-${i}`] ? '#4F46E5' : 'transparent',
              }}>
                {checked[m.nome || `pasto-${i}`] && <Check size={13} color="white" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600 }}>{m.nome}{m.ora ? ` · ${m.ora}` : ''}</p>
                {m.alimenti && <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.alimenti}</p>}
              </div>
            </button>
          ))}
        </div>
      )}

      {kcalTarget !== null && intake !== null && (
        <div style={{ padding: '12px 10px', background: '#E0E7FF', borderRadius: 12, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Kcal assunte oggi / target</p>
          <p style={{ fontSize: 18, fontWeight: 800, color: '#4F46E5' }}>{Math.round(intake.kcal)} / {kcalTarget}</p>
        </div>
      )}
    </div>
      )}
    </>
  )
}
