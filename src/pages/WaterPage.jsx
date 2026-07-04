import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useT } from '../i18n'
import { Droplets, Plus, Trash2, Bell, BellOff, BarChart2, List, WifiOff } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { subDays, format, parseISO } from 'date-fns'
import { it } from 'date-fns/locale'
import { checkWaterAndNotify } from '../lib/smartNotifications'
import { loadPrefs, savePrefs, initScheduledNotifications, requestPermission } from '../lib/notifications'
import { safeWrite } from '../lib/offlineDB'

// Quick-add presets: label, icon, ml
const QUICK_PRESETS = [
  { label: 'Bicchiere', icon: '🥛', ml: 250 },
  { label: 'Tazza', icon: '☕', ml: 150 },
  { label: 'Lattina', icon: '🥤', ml: 330 },
  { label: 'Bottiglia', icon: '🧴', ml: 500 },
  { label: 'Borraccia', icon: '💧', ml: 750 },
]

const ACTIVITY_MULTIPLIERS = {
  sedentario: 1.0,
  leggero: 1.1,
  moderato: 1.2,
  attivo: 1.3,
  molto_attivo: 1.5,
}

function calcTarget(profile) {
  if (!profile?.weight_kg && !profile?.target_weight) return 2500
  const weight = profile?.weight_kg || profile?.target_weight || 70
  const mult = ACTIVITY_MULTIPLIERS[profile?.activity_level] || 1.0
  return Math.round((weight * 35 * mult) / 50) * 50
}


const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 12px', boxShadow: 'var(--shadow-sm)' }}>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#3b82f6' }}>{payload[0].value} ml</p>
      </div>
    )
  }
  return null
}

export default function WaterPage() {
  const { profile, user } = useAuth()
  const t = useT()
  const today = useMemo(() => new Date().toISOString().split('T')[0], [])
  const [latestWeight, setLatestWeight] = useState(null)
  const target = calcTarget({ ...profile, weight_kg: latestWeight })

  const [logs, setLogs] = useState([])
  const [weekData, setWeekData] = useState([])
  const [custom, setCustom] = useState('')
  const [loading, setLoading] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [tab, setTab] = useState('oggi') // 'oggi' | 'settimana'
  const [notifEnabled, setNotifEnabled] = useState(() => loadPrefs().waterReminder === true)
  const [offlineSaved, setOfflineSaved] = useState(false)

  // Load today's logs + latest weight
  useEffect(() => {
    async function load() {
      const [logsRes, weightRes] = await Promise.all([
        supabase.from('water_logs').select('id, amount_ml, created_at').eq('user_id', user.id).eq('date', today).order('created_at'),
        supabase.from('weight_logs').select('weight_kg').eq('user_id', user.id).order('date', { ascending: false }).limit(1).maybeSingle(),
      ])
      if (!logsRes.error) setLogs(logsRes.data || [])
      if (!weightRes.error && weightRes.data?.weight_kg) setLatestWeight(weightRes.data.weight_kg)
    }
    load()
  }, [today, user.id])

  // Load weekly data
  useEffect(() => {
    async function loadWeek() {
      const from = subDays(new Date(), 6).toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('water_logs')
        .select('date, amount_ml')
        .eq('user_id', user.id)
        .gte('date', from)
        .lte('date', today)
      if (error) return
      const map = {}
      for (let i = 6; i >= 0; i--) {
        const d = subDays(new Date(), i).toISOString().split('T')[0]
        map[d] = 0
      }
      ;(data || []).forEach(r => { map[r.date] = (map[r.date] || 0) + r.amount_ml })
      setWeekData(
        Object.entries(map).map(([date, total]) => ({
          date,
          total,
          label: format(parseISO(date), 'EEE', { locale: it }),
        }))
      )
    }
    loadWeek()
  }, [today, user.id, logs])

  const total = logs.reduce((s, l) => s + l.amount_ml, 0)
  const pct = Math.min(100, Math.round((total / target) * 100))
  const remaining = Math.max(0, target - total)
  const statusMsg = pct >= 100 ? `🎉 ${t('water.goal_reached')}` : pct >= 60 ? `👍 ${t('water.well_done')}` : pct >= 30 ? `💧 ${t('water.keep_going')}` : '⚠️ Hai bevuto poco'

  async function addWater(ml) {
    setSaveError(null)
    setOfflineSaved(false)
    setLoading(true)
    const { data, offline } = await safeWrite('water_logs', { user_id: user.id, date: today, amount_ml: ml })
    const logEntry = data || { id: 'pending_' + Date.now(), amount_ml: ml, created_at: new Date().toISOString(), _pending: true }
    setLogs(l => {
      const updated = [...l, logEntry]
      if (!offline) {
        const newTotal = updated.reduce((s, w) => s + w.amount_ml, 0)
        checkWaterAndNotify(newTotal, target)
      }
      return updated
    })
    if (offline) {
      setOfflineSaved(true)
      setTimeout(() => setOfflineSaved(false), 4000)
    }
    setCustom('')
    setLoading(false)
  }

  async function removeLog(id) {
    await supabase.from('water_logs').delete().eq('id', id)
    setLogs(l => l.filter(x => x.id !== id))
  }

  async function toggleNotifications() {
    const prefs = loadPrefs()
    if (notifEnabled) {
      const updated = { ...prefs, waterReminder: false }
      savePrefs(updated)
      initScheduledNotifications(updated)
      setNotifEnabled(false)
    } else {
      const permission = await requestPermission()
      if (permission !== 'granted') {
        setSaveError('Abilita le notifiche nelle impostazioni del browser.')
        return
      }
      const updated = { ...prefs, waterReminder: true }
      savePrefs(updated)
      initScheduledNotifications(updated)
      setNotifEnabled(true)
    }
  }

  return (
    <div className="page">
      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg, #1e40af 0%, #3b82f6 100%)', padding: 'calc(env(safe-area-inset-top) + 20px) 24px 28px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <button onClick={toggleNotifications} title={notifEnabled ? 'Disattiva promemoria' : 'Attiva promemoria'} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, padding: '10px 14px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, minHeight: 44 }}>
            {notifEnabled ? <Bell size={15} /> : <BellOff size={15} />}
            {notifEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 }}>{t('water.title')}</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'white', fontWeight: 300, marginBottom: 8 }}>
          {total} <span style={{ fontSize: 16, opacity: 0.75 }}>ml</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{statusMsg}</p>
      </div>

      {saveError && (
        <div style={{ margin: '12px 20px 0', padding: '10px 14px', background: '#fee2e2', borderRadius: 10, color: '#dc2626', fontSize: 13 }}>
          {saveError}
        </div>
      )}
      {offlineSaved && (
        <div style={{ margin: '12px 20px 0', padding: '10px 14px', background: '#fef3c7', borderRadius: 10, color: '#92400e', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
          <WifiOff size={14} /> Salvato offline — verrà sincronizzato alla prossima connessione
        </div>
      )}

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Progress ring + stats */}
        <motion.div className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{ padding: '24px 20px', textAlign: 'center' }}>
          <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto 16px' }}>
            <svg viewBox="0 0 160 160" style={{ width: 160, height: 160, transform: 'rotate(-90deg)' }}>
              <circle cx={80} cy={80} r={68} fill="none" stroke="#dbeafe" strokeWidth={12} />
              <circle cx={80} cy={80} r={68} fill="none" stroke="#3b82f6"
                strokeWidth={12} strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 68}
                strokeDashoffset={2 * Math.PI * 68 * (1 - pct / 100)}
                style={{ transition: 'stroke-dashoffset 1s ease' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Droplets size={28} color="#3b82f6" />
              <p style={{ fontSize: 28, fontWeight: 700, color: '#1e40af', lineHeight: 1 }}>{pct}%</p>
              <p style={{ fontSize: 12, color: '#60a5fa' }}>completato</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#3b82f6' }}>{total}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>bevuti (ml)</p>
            </div>
            <div style={{ width: 1, background: 'var(--border)' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#94a3b8' }}>{remaining}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>rimanenti (ml)</p>
            </div>
            <div style={{ width: 1, background: 'var(--border)' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{target}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>obiettivo (ml)</p>
            </div>
          </div>

          {profile?.activity_level && (
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10 }}>
              Obiettivo calcolato su peso e livello attività
            </p>
          )}
        </motion.div>

        {/* Quick add */}
        <motion.div className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{ padding: '18px 20px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>{t('water.add')}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(58px, 1fr))', gap: 8, marginBottom: 14 }}>
            {QUICK_PRESETS.map(({ label, icon, ml }, i) => (
              <motion.button key={ml} onClick={() => addWater(ml)} disabled={loading}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                whileTap={{ scale: 0.92 }}
                className="water-preset-btn"
                style={{
                  padding: '12px 4px', borderRadius: 14,
                  background: 'linear-gradient(145deg, #eff6ff, #dbeafe)',
                  border: '1.5px solid #bfdbfe',
                  font: 'inherit', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  boxShadow: '0 1px 4px rgba(59,130,246,.1)',
              }}>
                <span style={{ fontSize: 22 }}>{icon}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#2563eb' }}>{ml} ml</span>
                <span style={{ fontSize: 10, color: '#60a5fa', fontWeight: 500 }}>{label}</span>
              </motion.button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="number"
              className="input-field"
              placeholder={t('water.custom_amount') + ' (ml)'}
              value={custom}
              onChange={e => setCustom(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { const v = parseInt(custom, 10); if (v > 0) addWater(v) } }}
              style={{ flex: 1 }}
              inputMode="numeric"
              min="1"
            />
            <button className="btn btn-primary" onClick={() => { const v = parseInt(custom, 10); if (v > 0) addWater(v) }} disabled={!custom || parseInt(custom, 10) <= 0 || loading} style={{ padding: '0 16px' }}>
              <Plus size={18} />
            </button>
          </div>
        </motion.div>

        {/* Tabs: oggi / settimana */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { key: 'oggi', icon: <List size={14} />, label: t('common.today') },
            { key: 'settimana', icon: <BarChart2 size={14} />, label: t('common.week') },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: 1, padding: '10px 8px', borderRadius: 12, border: 'none', font: 'inherit',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              background: tab === t.key ? '#3b82f6' : 'var(--surface-2)',
              color: tab === t.key ? 'white' : 'var(--text-secondary)',
            }}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'oggi' && (
          <div className="card" style={{ padding: '18px 20px' }}>
            {logs.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, padding: '12px 0' }}>{t('common.no_data')}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[...logs].reverse().map(l => (
                  <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Droplets size={16} color="#3b82f6" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 500 }}>{l.amount_ml} ml</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(l.created_at).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <button onClick={() => removeLog(l.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 12, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'settimana' && (
          <div className="card" style={{ padding: '18px 20px' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{t('water.history')}</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
              Media: {weekData.length ? Math.round(weekData.reduce((s, d) => s + d.total, 0) / weekData.length) : 0} ml/giorno
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weekData} margin={{ top: 0, right: 4, left: -20, bottom: 0 }} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#eff6ff' }} />
                <ReferenceLine y={target} stroke="#3b82f6" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: 'Obiettivo', position: 'right', fontSize: 10, fill: '#3b82f6' }} />
                <Bar dataKey="total" radius={[6, 6, 0, 0]}
                  fill="#60a5fa"
                  label={false}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>

            {/* Daily summary list */}
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[...weekData].reverse().map(d => {
                const dpct = Math.min(100, Math.round((d.total / target) * 100))
                return (
                  <div key={d.date} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 52, textAlign: 'right' }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: d.date === today ? '#3b82f6' : 'var(--text-primary)' }}>
                        {format(parseISO(d.date), 'd MMM', { locale: it })}
                      </p>
                    </div>
                    <div style={{ flex: 1, height: 8, background: 'var(--border-light)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${dpct}%`, background: dpct >= 100 ? '#22c55e' : '#60a5fa', borderRadius: 4, transition: 'width 0.8s ease' }} />
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', width: 56, textAlign: 'right' }}>{d.total} ml</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
