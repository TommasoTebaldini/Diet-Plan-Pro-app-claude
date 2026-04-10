import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { LogOut, User, Mail, ExternalLink, ChevronRight, Bell, Shield } from 'lucide-react'

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  async function handleSignOut() {
    setLoading(true)
    await signOut()
    navigate('/login')
  }

  const firstName = profile?.first_name || profile?.full_name?.split(' ')[0] || 'Paziente'
  const fullName = profile?.full_name || user?.email?.split('@')[0] || 'Utente'

  const menuItems = [
    { icon: <User size={18} />, label: 'Dati personali', action: () => {}, color: 'var(--green-main)', bg: 'var(--green-pale)' },
    { icon: <Bell size={18} />, label: 'Notifiche', action: () => {}, color: '#f0922b', bg: '#fff4e6' },
    { icon: <Shield size={18} />, label: 'Privacy e sicurezza', action: () => {}, color: '#8b5cf6', bg: '#f5f3ff' },
    {
      icon: <ExternalLink size={18} />,
      label: 'Piattaforma dietista',
      action: () => window.open('https://nutri-plan-pro-cxee.vercel.app', '_blank'),
      color: '#3b82f6', bg: '#eff6ff'
    },
  ]

  return (
    <div className="page">
      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))', padding: 'calc(env(safe-area-inset-top) + 20px) 24px 40px', textAlign: 'center' }}>
        <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', border: '2px solid rgba(255,255,255,0.3)', fontSize: 28, fontWeight: 700, color: 'white' }}>
          {firstName[0]?.toUpperCase()}
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'white', fontWeight: 300, marginBottom: 4 }}>{fullName}</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Mail size={13} />{user?.email}
        </p>
        <div style={{ marginTop: 12, display: 'inline-flex' }}>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', backdropFilter: 'blur(8px)' }}>
            👤 Paziente
          </span>
        </div>
      </div>

      <div style={{ padding: '0 20px 20px', marginTop: -20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Menu */}
        <div className="card animate-slideUp" style={{ padding: 0, overflow: 'hidden' }}>
          {menuItems.map((item, i) => (
            <button key={i} onClick={item.action} style={{
              width: '100%', background: 'none', border: 'none', cursor: 'pointer',
              padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12,
              borderBottom: i < menuItems.length - 1 ? '1px solid var(--border-light)' : 'none',
              font: 'inherit', textAlign: 'left'
            }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, flexShrink: 0 }}>
                {item.icon}
              </div>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: 'var(--text-primary)' }}>{item.label}</span>
              <ChevronRight size={16} color="var(--text-muted)" />
            </button>
          ))}
        </div>

        {/* App info */}
        <div className="card" style={{ padding: '16px 18px', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>NutriPlan Paziente</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Versione 1.0.0 · Powered by NutriPlan Pro</p>
        </div>

        {/* Sign out */}
        <button onClick={handleSignOut} disabled={loading} className="btn" style={{ background: '#fff0f0', color: 'var(--red)', border: '1.5px solid #ffd4d4', borderRadius: 'var(--radius-md)', padding: '14px', fontSize: 15, fontWeight: 500, gap: 8, width: '100%', justifyContent: 'center' }}>
          <LogOut size={18} />{loading ? 'Uscita…' : 'Esci dall\'account'}
        </button>
      </div>
    </div>
  )
}
