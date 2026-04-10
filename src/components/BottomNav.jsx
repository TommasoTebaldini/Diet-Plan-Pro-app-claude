import { Link, useLocation } from 'react-router-dom'
import { Home, Utensils, MessageCircle, FileText, TrendingUp, User } from 'lucide-react'

const TABS = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/dieta', icon: Utensils, label: 'Dieta' },
  { to: '/chat', icon: MessageCircle, label: 'Chat' },
  { to: '/documenti', icon: FileText, label: 'Documenti' },
  { to: '/progressi', icon: TrendingUp, label: 'Progressi' },
  { to: '/profilo', icon: User, label: 'Profilo' },
]

export default function BottomNav() {
  const { pathname } = useLocation()
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999,
      height: 'calc(64px + env(safe-area-inset-bottom))',
      background: 'rgba(255,255,255,0.97)',
      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--border-light)',
      display: 'flex', alignItems: 'stretch',
      boxShadow: '0 -2px 16px rgba(13,92,58,0.07)',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {TABS.map(({ to, icon: Icon, label }) => {
        const active = pathname === to || (to !== '/' && pathname.startsWith(to))
        return (
          <Link key={to} to={to} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 3, textDecoration: 'none',
            color: active ? 'var(--green-main)' : '#94a3b8',
            WebkitTapHighlightColor: 'transparent',
            transition: 'color 0.15s',
            paddingTop: 6,
          }}>
            <div style={{
              width: 38, height: 26,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 8,
              background: active ? 'var(--green-pale)' : 'transparent',
              transition: 'background 0.15s',
            }}>
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
            </div>
            <span style={{ fontSize: 9.5, fontWeight: active ? 600 : 400, letterSpacing: '0.01em' }}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
