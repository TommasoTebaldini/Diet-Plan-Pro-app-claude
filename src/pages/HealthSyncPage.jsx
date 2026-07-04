import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Activity, Heart, Scale, Moon, Footprints, RefreshCw, CheckCircle, AlertCircle, Info, ExternalLink } from 'lucide-react'

// ── Platform detection ────────────────────────────────────────────────────────

function getOS() {
  const ua = navigator.userAgent
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios'
  if (/Android/.test(ua)) return 'android'
  return 'other'
}

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
}

// ── StatusBadge ───────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const map = {
    connected:    { label: 'Connesso',     bg: '#d1fae5', color: '#065f46', icon: CheckCircle },
    unavailable:  { label: 'Non disponibile', bg: '#fef3c7', color: '#92400e', icon: AlertCircle },
    manual:       { label: 'Manuale',      bg: '#dbeafe', color: '#1e40af', icon: Info },
    native:       { label: 'App nativa',   bg: '#ede9fe', color: '#5b21b6', icon: Info },
  }
  const cfg = map[status] || map.manual
  const Icon = cfg.icon
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: cfg.bg, color: cfg.color, borderRadius: 100, padding: '3px 9px', fontSize: 11, fontWeight: 600 }}>
      <Icon size={10} />
      {cfg.label}
    </span>
  )
}

// ── DataRow ────────────────────────────────────────────────────────────────────

function DataRow({ icon: Icon, label, value, unit, status, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0', borderBottom: '1px solid var(--border-light)' }}>
      <div style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={18} color="var(--green-main)" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <p style={{ fontSize: 14, fontWeight: 600 }}>{label}</p>
          <StatusBadge status={status} />
        </div>
        {value !== undefined && (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 1 }}>
            {value !== null ? <><strong style={{ color: 'var(--text-primary)' }}>{value}</strong> {unit}</> : 'Nessun dato'}
          </p>
        )}
        {children}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function HealthSyncPage() {
  const { user } = useAuth()
  const os = getOS()
  const pwa = isStandalone()

  const [steps, setSteps] = useState(null)
  const [weight, setWeight] = useState(null)
  const [sleep, setSleep] = useState(null)
  const [heartRate, setHeartRate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState('')

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    loadAppData()
  }, [])

  async function loadAppData() {
    setLoading(true)
    const [stepRes, weightRes, wellRes] = await Promise.all([
      supabase.from('daily_logs').select('date').eq('user_id', user.id).eq('date', today).maybeSingle(),
      supabase.from('weight_logs').select('weight_kg,date').eq('user_id', user.id).order('date', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('daily_wellness').select('sleep_hours').eq('user_id', user.id).eq('date', today).maybeSingle(),
    ])
    setWeight(weightRes.data?.weight_kg ?? null)
    setSleep(wellRes.data?.sleep_hours ?? null)

    // Steps from pedometer localStorage
    try {
      const stored = localStorage.getItem('pedometer_steps_' + today)
      setSteps(stored ? parseInt(stored) : null)
    } catch { setSteps(null) }
    // Heart rate from localStorage
    try {
      const hr = localStorage.getItem('hr_' + today)
      setHeartRate(hr ? parseInt(hr) : null)
    } catch { setHeartRate(null) }

    setLoading(false)
  }

  // ── Android Health Connect (Web API — experimental, Android 14+ / Chrome 131+) ─
  async function connectHealthConnect() {
    setSyncing(true)
    setSyncMsg('')
    try {
      // Check if Health Connect web API is available
      if ('health' in navigator) {
        const health = navigator.health
        await health.requestAuthorization(['steps', 'weight', 'heartRate', 'sleepSession'])
        const now = new Date()
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const records = await health.readRecords('Steps', { startTime: start.toISOString(), endTime: now.toISOString() })
        const totalSteps = records.records.reduce((s, r) => s + (r.count?.value || 0), 0)
        if (totalSteps > 0) {
          setSteps(totalSteps)
          localStorage.setItem('pedometer_steps_' + today, String(totalSteps))
        }
        // Try to sync weight
        try {
          const wRes = await health.readRecords('Weight', { startTime: new Date(Date.now() - 86400000).toISOString(), endTime: now.toISOString() })
          const latestW = wRes.records?.[wRes.records.length - 1]?.weight?.value
          if (latestW) {
            setWeight(latestW)
            await supabase.from('weight_logs').insert({ user_id: user.id, weight_kg: latestW, date: today })
          }
        } catch {}
        // Try to sync sleep
        try {
          const sRes = await health.readRecords('SleepSession', { startTime: start.toISOString(), endTime: now.toISOString() })
          const sessions = sRes.records || []
          if (sessions.length > 0) {
            const totalMs = sessions.reduce((s, r) => s + (new Date(r.endTime) - new Date(r.startTime)), 0)
            const hours = Math.round(totalMs / 3600000 * 10) / 10
            setSleep(hours)
            await supabase.from('daily_wellness').upsert({ user_id: user.id, date: today, sleep_hours: hours }, { onConflict: 'user_id,date' })
          }
        } catch {}
        setSyncMsg(`Sincronizzati ${totalSteps.toLocaleString()} passi + dati salute da Health Connect`)
      } else {
        // Fallback: open Health Connect settings
        window.open('intent://com.google.android.apps.healthdata#Intent;scheme=https;package=com.google.android.apps.healthdata;end', '_blank')
        setSyncMsg('Apri Google Health Connect e abilita la condivisione dati con NutriPlan.')
      }
    } catch (e) {
      const msg = e?.message || ''
      if (msg.includes('not granted') || msg.includes('denied')) {
        setSyncMsg('Permesso negato. Abilita l\'accesso da Impostazioni → Salute.')
      } else {
        setSyncMsg('Health Connect non disponibile su questo dispositivo o browser.')
      }
    } finally {
      setSyncing(false)
    }
  }

  // ── Manual entries ────────────────────────────────────────────────────────────
  const [manualSteps, setManualSteps] = useState('')
  const [manualWeight, setManualWeight] = useState('')
  const [manualSleep, setManualSleep] = useState('')
  const [manualHR, setManualHR] = useState('')

  async function saveManualSteps() {
    const n = parseInt(manualSteps)
    if (!n || n <= 0) return
    setSteps(n)
    localStorage.setItem('pedometer_steps_' + today, String(n))
    setManualSteps('')
    setSyncMsg('Passi salvati!')
    setTimeout(() => setSyncMsg(''), 2500)
  }

  async function saveManualWeight() {
    const kg = parseFloat(manualWeight)
    if (!kg || kg <= 0) return
    await supabase.from('weight_logs').insert({ user_id: user.id, weight_kg: kg, date: today })
    setWeight(kg)
    setManualWeight('')
    setSyncMsg('Peso salvato!')
    setTimeout(() => setSyncMsg(''), 2500)
  }

  async function saveManualSleep() {
    const h = parseFloat(manualSleep)
    if (!h || h <= 0) return
    await supabase.from('daily_wellness').upsert({ user_id: user.id, date: today, sleep_hours: h }, { onConflict: 'user_id,date' })
    setSleep(h)
    setManualSleep('')
    setSyncMsg('Ore di sonno salvate!')
    setTimeout(() => setSyncMsg(''), 2500)
  }

  function saveManualHR() {
    const bpm = parseInt(manualHR)
    if (!bpm || bpm <= 0) return
    setHeartRate(bpm)
    localStorage.setItem('hr_' + today, String(bpm))
    setManualHR('')
    setSyncMsg('Frequenza cardiaca salvata!')
    setTimeout(() => setSyncMsg(''), 2500)
  }

  return (
    <div className="page">
      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg, #0f172a, #1e3a5f)', padding: 'calc(env(safe-area-inset-top) + 20px) 24px 24px' }}>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, marginBottom: 4 }}>Integrazione salute</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'white', fontWeight: 300 }}>Health Sync</h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 4 }}>
          {os === 'ios' ? 'iPhone · iOS' : os === 'android' ? 'Android' : 'Web'}{pwa ? ' · PWA' : ''}
        </p>
      </div>

      <div style={{ padding: '16px 16px 100px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Platform notice */}
        {os === 'ios' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '14px 16px', background: '#fef9f0', border: '1.5px solid #fde68a' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>🍎</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#92400e', marginBottom: 4 }}>Apple HealthKit</p>
                <p style={{ fontSize: 12, color: '#78350f', lineHeight: 1.5 }}>
                  HealthKit richiede un'app nativa iOS. La PWA può leggere i passi via sensori del dispositivo. Per la sincronizzazione completa di frequenza cardiaca, sonno e attività è necessaria la versione nativa dell'app.
                </p>
                <a
                  href="https://support.apple.com/it-it/guide/iphone/iph3ecf67d1/ios"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: 12, color: '#d97706', fontWeight: 600 }}
                >
                  <ExternalLink size={11} /> Come esportare da Salute iOS
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {os === 'android' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '14px 16px', background: '#f0fdf4', border: '1.5px solid #86efac' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>💚</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#14532d', marginBottom: 4 }}>Google Health Connect</p>
                <p style={{ fontSize: 12, color: '#166534', lineHeight: 1.5, marginBottom: 10 }}>
                  Disponibile su Android 14+ con Chrome 131+. Il browser chiederà il permesso per accedere ai tuoi dati di salute.
                </p>
                <button
                  onClick={connectHealthConnect}
                  disabled={syncing}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#16a34a', color: 'white', border: 'none', borderRadius: 9, padding: '9px 14px', cursor: syncing ? 'default' : 'pointer', fontSize: 13, fontWeight: 600 }}
                >
                  <RefreshCw size={14} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
                  {syncing ? 'Connessione…' : 'Connetti Health Connect'}
                </button>
                {syncMsg && <p style={{ fontSize: 12, color: '#166534', marginTop: 8 }}>{syncMsg}</p>}
              </div>
            </div>
          </motion.div>
        )}

        {/* Data overview */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card" style={{ padding: '14px 16px' }}>
          <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Dati di oggi</p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>
            {new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[1,2,3,4].map(i => <div key={i} style={{ height: 50, borderRadius: 8, background: 'var(--border-light)', animation: 'skeletonPulse 1.4s ease-in-out infinite' }} />)}
            </div>
          ) : (
            <>
              <DataRow icon={Footprints} label="Passi" value={steps ? steps.toLocaleString('it-IT') : null} unit="passi" status={steps !== null ? 'connected' : os === 'android' ? 'unavailable' : 'manual'}>
                {steps === null && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                    <input
                      type="number"
                      placeholder="Inserisci passi…"
                      value={manualSteps}
                      onChange={e => setManualSteps(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && saveManualSteps()}
                      style={{ flex: 1, padding: '5px 9px', border: '1.5px solid var(--border)', borderRadius: 8, background: 'var(--surface-2)', fontSize: 13, outline: 'none', color: 'var(--text-primary)' }}
                    />
                    <button onClick={saveManualSteps} disabled={!manualSteps} style={{ padding: '5px 12px', background: 'var(--green-main)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>
                      Salva
                    </button>
                  </div>
                )}
              </DataRow>

              <DataRow icon={Heart} label="Frequenza cardiaca" value={heartRate} unit="bpm" status={heartRate !== null ? 'connected' : 'manual'}>
                <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                  <input type="number" placeholder="es. 72" value={manualHR} onChange={e => setManualHR(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveManualHR()}
                    style={{ flex: 1, padding: '5px 9px', border: '1.5px solid var(--border)', borderRadius: 8, background: 'var(--surface-2)', fontSize: 13, outline: 'none', color: 'var(--text-primary)' }} />
                  <button onClick={saveManualHR} disabled={!manualHR} style={{ padding: '5px 12px', background: 'var(--green-main)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>
                    {heartRate !== null ? 'Aggiorna' : 'Salva'}
                  </button>
                </div>
              </DataRow>

              <DataRow icon={Scale} label="Peso" value={weight} unit="kg" status={weight !== null ? 'connected' : 'manual'}>
                <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                  <input type="number" step="0.1" placeholder="es. 70.5" value={manualWeight} onChange={e => setManualWeight(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveManualWeight()}
                    style={{ flex: 1, padding: '5px 9px', border: '1.5px solid var(--border)', borderRadius: 8, background: 'var(--surface-2)', fontSize: 13, outline: 'none', color: 'var(--text-primary)' }} />
                  <button onClick={saveManualWeight} disabled={!manualWeight} style={{ padding: '5px 12px', background: 'var(--green-main)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>
                    {weight !== null ? 'Aggiorna' : 'Salva'}
                  </button>
                </div>
              </DataRow>

              <DataRow icon={Moon} label="Ore di sonno" value={sleep} unit="ore" status={sleep !== null ? 'connected' : 'manual'}>
                <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                  <input type="number" step="0.5" placeholder="es. 7.5" value={manualSleep} onChange={e => setManualSleep(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveManualSleep()}
                    style={{ flex: 1, padding: '5px 9px', border: '1.5px solid var(--border)', borderRadius: 8, background: 'var(--surface-2)', fontSize: 13, outline: 'none', color: 'var(--text-primary)' }} />
                  <button onClick={saveManualSleep} disabled={!manualSleep} style={{ padding: '5px 12px', background: 'var(--green-main)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>
                    {sleep !== null ? 'Aggiorna' : 'Salva'}
                  </button>
                </div>
              </DataRow>

              <DataRow icon={Activity} label="Attività fisica" value={null} unit="" status="manual">
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
                  Registra in <a href="/attivita" style={{ color: 'var(--green-main)' }}>Attività</a>
                </p>
              </DataRow>
            </>
          )}
        </motion.div>

        {syncMsg && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ background: '#dcfce7', border: '1.5px solid #86efac', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#15803d', fontWeight: 600 }}>
            ✓ {syncMsg}
          </motion.div>
        )}

      </div>
    </div>
  )
}
