import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Utensils, MessageCircle, BookOpen, TrendingUp, User, FileText, Activity, BarChart2, Heart } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const DOCS_EPOCH = '1970-01-01T00:00:00Z'

const badgeStyle = {
  position: 'absolute', top: -4, right: -4, width: 16, height: 16,
  borderRadius: '50%', background: '#0891b2', color: 'white',
  fontSize: 9, fontWeight: 700, display: 'flex',
  alignItems: 'center', justifyContent: 'center', border: '2px solid white',
}

export default function BottomNav() {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const [newDocs, setNewDocs] = useState(0)
  const [unreadChat, setUnreadChat] = useState(0)

  // Unread documents badge
  useEffect(() => {
    if (!user) return
    const key = `docs_last_seen_${user.id}`
    const lastSeen = localStorage.getItem(key) || DOCS_EPOCH
    supabase
      .from('patient_documents')
      .select('*', { count: 'exact', head: true })
      .eq('patient_id', user.id)
      .eq('visible', true)
      .gt('created_at', lastSeen)
      .then(({ count }) => setNewDocs(count || 0))
  }, [user])

  useEffect(() => {
    if (pathname === '/documenti' && user) {
      localStorage.setItem(`docs_last_seen_${user.id}`, new Date().toISOString())
      setNewDocs(0)
    }
  }, [pathname, user])

  // Unread chat badge
  useEffect(() => {
    if (!user) return
    // Initial count
    supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('patient_id', user.id)
      .eq('sender_role', 'dietitian')
      .is('read_at', null)
      .then(({ count }) => setUnreadChat(count || 0))

    // Realtime subscription for new dietitian messages
    const channel = supabase.channel(`nav-chat-${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'chat_messages',
        filter: `patient_id=eq.${user.id}`
      }, payload => {
        if (payload.new.sender_role === 'dietitian' && !payload.new.read_at) {
          setUnreadChat(prev => prev + 1)
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'chat_messages',
        filter: `patient_id=eq.${user.id}`
      }, payload => {
        if (payload.new.sender_role === 'dietitian' && payload.new.read_at && !payload.old?.read_at) {
          setUnreadChat(prev => Math.max(0, prev - 1))
        }
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [user])

  // Clear chat badge when visiting chat
  useEffect(() => {
    if (pathname === '/chat') setUnreadChat(0)
  }, [pathname])

  const TABS = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/dieta', icon: Utensils, label: 'Dieta' },
    { to: '/macro', icon: BookOpen, label: 'Diario' },
    { to: '/chat', icon: MessageCircle, label: 'Chat', badge: unreadChat },
    { to: '/documenti', icon: FileText, label: 'Documenti', badge: newDocs },
    { to: '/progressi', icon: TrendingUp, label: 'Progressi' },
    { to: '/attivita', icon: Activity, label: 'Attività' },
    { to: '/statistiche', icon: BarChart2, label: 'Report' },
    { to: '/benessere', icon: Heart, label: 'Benessere' },
    { to: '/profilo', icon: User, label: 'Profilo' },
  ]

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
      {TABS.map(({ to, icon: Icon, label, badge }) => {
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
              position: 'relative',
            }}>
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
              {badge > 0 && <span style={badgeStyle}>{badge}</span>}
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
