import { Link, useLocation } from 'react-router-dom'
import { Home, Utensils, BarChart2, Droplets, User } from 'lucide-react'

const TABS = [
  { to: '/', icon: <Home size={22} />, label: 'Home' },
  { to: '/dieta', icon: <Utensils size={22} />, label: 'Dieta' },
  { to: '/macro', icon: <BarChart2 size={22} />, label: 'Macro' },
  { to: '/acqua', icon: <Droplets size={22} />, label: 'Acqua' },
  { to: '/profilo', icon: <User size={22} />, label: 'Profilo' },
]

export default function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      height: 'calc(var(--bottom-nav-height) + env(safe-area-inset-bottom))',
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--border-light)',
      display: 'flex', alignItems: 'flex-start',
      paddingTop: 8,
      zIndex: 100,
      boxShadow: '0 -4px 24px rgba(13,92,58,0.06)'
    }}>
      {TABS.map(tab => {
        const active = pathname === tab.to || (tab.to !== '/' && pathname.startsWith(tab.to))
        return (
          <Link key={tab.to} to={tab.to} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 4, textDecoration: 'none',
            padding: '4px 0',
            color: active ? 'var(--green-main)' : 'var(--text-muted)',
            WebkitTapHighlightColor: 'transparent',
          }}>
            <div style={{
              width: 44, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 12,
              background: active ? 'var(--green-pale)' : 'transparent',
              transition: 'all 0.18s ease',
              transform: active ? 'translateY(-2px)' : 'none',
            }}>
              {tab.icon}
            </div>
            <span style={{
              fontSize: 10, fontWeight: active ? 600 : 400,
              transition: 'all 0.18s ease',
            }}>
              {tab.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
