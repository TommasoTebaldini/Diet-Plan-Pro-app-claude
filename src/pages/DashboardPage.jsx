import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Utensils, Droplets, BarChart2, Apple, ChevronRight, Flame, Leaf, MessageCircle, FileText, BookOpen, User } from 'lucide-react'

function MacroRing({ percent, color, size = 56 }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (percent / 100) * circ
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border-light)" strokeWidth={6} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
        strokeWidth={6} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1s ease' }} />
    </svg>
  )
}

export default function DashboardPage() {
  const { profile } = useAuth()
  const [todayLog, setTodayLog] = useState(null)
  const [waterLog, setWaterLog] = useState(0)
  const [diet, setDiet] = useState(null)
  const [loading, setLoading] = useState(true)
  const today = new Date().toISOString().split('T')[0]

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buongiorno' : hour < 18 ? 'Buon pomeriggio' : 'Buona sera'

  useEffect(() => {
    async function load() {
      try {
        // Load today's macro log
        const { data: log } = await supabase
          .from('daily_logs').select('*').eq('date', today).maybeSingle()
        setTodayLog(log)

        // Load water intake
        const { data: water } = await supabase
          .from('water_logs').select('amount_ml').eq('date', today)
        setWaterLog(water?.reduce((s, w) => s + w.amount_ml, 0) || 0)

        // Load active diet
        const { data: activeDiet } = await supabase
          .from('patient_diets').select('*').eq('is_active', true).maybeSingle()
        setDiet(activeDiet)
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    load()
  }, [today])

  const firstName = profile?.first_name || profile?.full_name?.split(' ')[0] || 'Paziente'
  const kcalTarget = diet?.kcal_target || 2000
  const kcalLogged = todayLog?.kcal || 0
  const kcalPct = Math.min(100, Math.round((kcalLogged / kcalTarget) * 100))
  const waterTarget = 2500
  const waterPct = Math.min(100, Math.round((waterLog / waterTarget) * 100))

  const macros = [
    { label: 'Proteine', value: todayLog?.proteins || 0, target: diet?.protein_target || 120, color: '#3b82f6', unit: 'g' },
    { label: 'Carboidrati', value: todayLog?.carbs || 0, target: diet?.carbs_target || 240, color: '#f0922b', unit: 'g' },
    { label: 'Grassi', value: todayLog?.fats || 0, target: diet?.fats_target || 70, color: '#e05a5a', unit: 'g' },
  ]

  const quickActions = [
    { label: 'La mia dieta', icon: <Utensils size={20} />, to: '/dieta', color: 'var(--green-main)', bg: 'var(--green-pale)' },
    { label: 'Traccia pasto', icon: <Apple size={20} />, to: '/macro', color: '#f0922b', bg: '#fff4e6' },
    { label: 'Acqua', icon: <Droplets size={20} />, to: '/acqua', color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Progressi', icon: <BarChart2 size={20} />, to: '/progressi', color: '#8b5cf6', bg: '#f5f3ff' },
    { label: 'Chat', icon: <MessageCircle size={20} />, to: '/chat', color: '#e05a5a', bg: '#fff0f0' },
    { label: 'Documenti', icon: <FileText size={20} />, to: '/documenti', color: '#0ea5e9', bg: '#f0f9ff' },
    { label: 'Alimenti', icon: <BookOpen size={20} />, to: '/alimenti', color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Profilo', icon: <User size={20} />, to: '/profilo', color: '#64748b', bg: '#f8fafc' },
  ]

  return (
    <div className="page" style={{ padding: '0 0 calc(var(--bottom-nav-height) + env(safe-area-inset-bottom))' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg, var(--green-dark) 0%, var(--green-main) 100%)',
        padding: 'calc(env(safe-area-inset-top) + 20px) 24px 32px',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 90% 10%, rgba(255,255,255,0.08) 0%, transparent 50%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 2 }}>{greeting} 👋</p>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'white', fontWeight: 300 }}>{firstName}</h1>
            </div>
            <Link to="/profilo" style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)', textDecoration: 'none', color: 'white', fontSize: 16, fontWeight: 600 }}>
              {firstName[0]?.toUpperCase()}
            </Link>
          </div>

          {/* Kcal card */}
          <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', borderRadius: 18, padding: '16px 20px', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <MacroRing percent={kcalPct} color="rgba(255,255,255,0.9)" size={64} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Flame size={20} color="white" />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 2 }}>Calorie oggi</p>
              <p style={{ color: 'white', fontSize: 22, fontWeight: 600 }}>{kcalLogged} <span style={{ fontSize: 14, opacity: 0.7 }}>/ {kcalTarget} kcal</span></p>
              <div style={{ marginTop: 8, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${kcalPct}%`, background: 'white', borderRadius: 2, transition: 'width 1s ease' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Quick actions 4x2 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {quickActions.map(a => (
            <Link key={a.to + a.label} to={a.to} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 54, height: 54, borderRadius: 18, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.color }}>
                {a.icon}
              </div>
              <span style={{ fontSize: 10.5, color: 'var(--text-secondary)', fontWeight: 500, textAlign: 'center', lineHeight: 1.2 }}>{a.label}</span>
            </Link>
          ))}
        </div>

        {/* Macros row */}
        <div className="card" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Macro di oggi</h3>
            <Link to="/macro" style={{ fontSize: 13, color: 'var(--green-main)', textDecoration: 'none', fontWeight: 500 }}>Traccia →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {macros.map(m => {
              const pct = Math.min(100, Math.round((m.value / m.target) * 100))
              return (
                <div key={m.label} style={{ textAlign: 'center' }}>
                  <div style={{ position: 'relative', display: 'inline-block', marginBottom: 6 }}>
                    <MacroRing percent={pct} color={m.color} size={52} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: m.color }}>{pct}%</div>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{m.value}{m.unit}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.label}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Water */}
        <div className="card" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Droplets size={18} color="#3b82f6" />
              <h3 style={{ fontSize: 15, fontWeight: 600 }}>Acqua</h3>
            </div>
            <Link to="/acqua" style={{ fontSize: 13, color: 'var(--green-main)', textDecoration: 'none', fontWeight: 500 }}>Aggiungi →</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                <span style={{ fontWeight: 600 }}>{waterLog} ml</span>
                <span style={{ color: 'var(--text-muted)' }}>/ {waterTarget} ml</span>
              </div>
              <div style={{ height: 8, background: 'var(--border-light)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${waterPct}%`, background: 'linear-gradient(90deg, #60a5fa, #3b82f6)', borderRadius: 4, transition: 'width 1s ease' }} />
              </div>
            </div>
            <span style={{ fontSize: 24, fontWeight: 700, color: '#3b82f6' }}>{waterPct}%</span>
          </div>
        </div>

        {/* Diet preview */}
        {diet ? (
          <Link to="/dieta" style={{ textDecoration: 'none' }}>
            <div className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Leaf size={22} color="var(--green-main)" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 2 }}>Piano attivo</p>
                <p style={{ fontSize: 15, fontWeight: 600 }}>{diet.name || 'Piano personalizzato'}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{diet.kcal_target} kcal · {diet.meals_count || 5} pasti</p>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </div>
          </Link>
        ) : (
          <div className="card" style={{ padding: '18px 20px', textAlign: 'center', border: '1.5px dashed var(--border)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Nessun piano attivo.<br />Contatta il tuo dietista.</p>
          </div>
        )}
      </div>
    </div>
  )
}
