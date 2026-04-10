import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Droplets, Plus, Trash2 } from 'lucide-react'

const QUICK_AMOUNTS = [150, 200, 250, 330, 500]

const WAVE_SVG = (pct) => `
  <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.95"/>
      </linearGradient>
    </defs>
    <path d="M0,${200 - pct * 2} Q100,${200 - pct * 2 - 20} 200,${200 - pct * 2} Q300,${200 - pct * 2 + 20} 400,${200 - pct * 2} L400,200 L0,200 Z" fill="url(#wg)">
      <animate attributeName="d" dur="3s" repeatCount="indefinite"
        values="M0,${200 - pct * 2} Q100,${200 - pct * 2 - 20} 200,${200 - pct * 2} Q300,${200 - pct * 2 + 20} 400,${200 - pct * 2} L400,200 L0,200 Z;
                M0,${200 - pct * 2} Q100,${200 - pct * 2 + 20} 200,${200 - pct * 2} Q300,${200 - pct * 2 - 20} 400,${200 - pct * 2} L400,200 L0,200 Z;
                M0,${200 - pct * 2} Q100,${200 - pct * 2 - 20} 200,${200 - pct * 2} Q300,${200 - pct * 2 + 20} 400,${200 - pct * 2} L400,200 L0,200 Z"/>
    </path>
  </svg>
`

export default function WaterPage() {
  const today = new Date().toISOString().split('T')[0]
  const TARGET = 2500
  const [logs, setLogs] = useState([])
  const [custom, setCustom] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('water_logs').select('*').eq('date', today).order('created_at')
      setLogs(data || [])
    }
    load()
  }, [today])

  const total = logs.reduce((s, l) => s + l.amount_ml, 0)
  const pct = Math.min(100, Math.round((total / TARGET) * 100))

  async function addWater(ml) {
    setLoading(true)
    const { data } = await supabase.from('water_logs').insert({ date: today, amount_ml: ml }).select().single()
    if (data) setLogs(l => [...l, data])
    setCustom('')
    setLoading(false)
  }

  async function removeLog(id) {
    await supabase.from('water_logs').delete().eq('id', id)
    setLogs(l => l.filter(x => x.id !== id))
  }

  const statusMsg = pct >= 100 ? '🎉 Obiettivo raggiunto!' : pct >= 60 ? '👍 Stai andando bene!' : pct >= 30 ? '💧 Continua a bere!' : '⚠️ Hai bevuto poco'
  const remaining = Math.max(0, TARGET - total)

  return (
    <div className="page">
      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg, #1e40af 0%, #3b82f6 100%)', padding: 'calc(env(safe-area-inset-top) + 20px) 24px 28px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 }}>Idratazione di oggi</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'white', fontWeight: 300, marginBottom: 8 }}>
          {total} <span style={{ fontSize: 16, opacity: 0.75 }}>ml</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{statusMsg}</p>
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Visual water bottle */}
        <div className="card" style={{ padding: '24px 20px', textAlign: 'center' }}>
          {/* Progress circle */}
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
              <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{TARGET}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>obiettivo (ml)</p>
            </div>
          </div>
        </div>

        {/* Quick add */}
        <div className="card" style={{ padding: '18px 20px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Aggiungi veloce</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            {QUICK_AMOUNTS.map(ml => (
              <button key={ml} onClick={() => addWater(ml)} disabled={loading} style={{
                padding: '10px 16px', borderRadius: 12,
                background: 'var(--surface-2)', border: '1.5px solid var(--border)',
                font: 'inherit', fontSize: 14, fontWeight: 500, color: '#3b82f6', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2
              }}>
                💧 {ml >= 500 ? '🍼' : ml >= 300 ? '🥤' : '☕'}
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ml} ml</span>
              </button>
            ))}
          </div>

          {/* Custom amount */}
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="number" className="input-field" placeholder="Quantità personalizzata (ml)" value={custom} onChange={e => setCustom(e.target.value)} style={{ flex: 1 }} />
            <button className="btn btn-primary" onClick={() => custom && addWater(parseInt(custom))} disabled={!custom || loading} style={{ padding: '0 16px' }}>
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Log list */}
        {logs.length > 0 && (
          <div className="card" style={{ padding: '18px 20px' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Registro oggi</h3>
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
                  <button onClick={() => removeLog(l.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 6 }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
