import { Bell } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useNotifications } from '../context/NotificationContext'

/**
 * Persistent bell icon with an unread-count badge (centro notifiche, SEZIONE
 * 123) — fixed top-right, visible on every patient page like OfflineBar.
 * Hidden on the notifications page itself (no point pointing at yourself).
 */
export default function NotificationBell() {
  const { unreadCount } = useNotifications()
  const navigate = useNavigate()
  const location = useLocation()

  if (location.pathname === '/notifiche') return null

  return (
    <button
      onClick={() => navigate('/notifiche')}
      aria-label="Notifiche"
      style={{
        position: 'fixed', top: 'calc(env(safe-area-inset-top) + 12px)', right: 14, zIndex: 250,
        width: 40, height: 40, borderRadius: '50%', border: '1.5px solid var(--border, #E2E8F0)',
        background: 'var(--surface, white)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,.08)',
      }}
    >
      <Bell size={19} color="var(--text-primary, #334155)" />
      {unreadCount > 0 && (
        <span style={{
          position: 'absolute', top: -2, right: -2, minWidth: 17, height: 17, borderRadius: 9,
          background: '#DC2626', color: 'white', fontSize: 10, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
          border: '2px solid var(--surface, white)',
        }}>
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  )
}
