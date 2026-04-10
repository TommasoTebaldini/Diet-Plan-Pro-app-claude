import { Link, useLocation } from 'react-router-dom'
import { Home, Utensils, MessageCircle, FileText, TrendingUp, User } from 'lucide-react'

const TABS = [
  { to: '/', icon: <Home size={21} />, label: 'Home' },
  { to: '/dieta', icon: <Utensils size={21} />, label: 'Dieta' },
  { to: '/chat', icon: <MessageCircle size={21} />, label: 'Chat' },
  { to: '/documenti', icon: <FileText size={21} />, label: 'Documenti' },
  { to: '/progressi', icon: <TrendingUp size={21} />, label: 'Progressi' },
  { to: '/profilo', icon: <User size={21} />, label: 'Profilo' },
]

export default function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 'calc(72px + env(safe-area-inset-bottom))',
      background: 'rgba(255,255,255,0.97)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--border-light)',
      display: 'flex',
      alignItems: 'flex-start',
      paddingTop: 8,
      zIndex: 1000,
      boxShadow: '0 -4px 24px rgba(13,92,58,0.08)'
    }}>
      {TABS.map(tab => {
        const active = pathname === tab.to || (tab.to !== '/' && pathname.startsWith(tab.to))
        return (
          <Link key={tab.to} to={tab.to} style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            textDecoration: 'none',
            padding: '2px 0',
            color: active ? 'var(--green-main)' : 'var(--text-muted)',
            WebkitTapHighlightColor: 'transparent',
          }}>
            <div style={{
              width: 40,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              background: active ? 'var(--green-pale)' : 'transparent',
              transition: 'all 0.18s ease',
              transform: active ? 'translateY(-1px)' : 'none',
            }}>
              {tab.icon}
            </div>
            <span style={{
              fontSize: 9.5,
              fontWeight: active ? 600 : 400,
              lineHeight: 1,
            }}>
              {tab.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
