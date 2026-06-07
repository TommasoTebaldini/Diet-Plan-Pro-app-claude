import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Utensils, MessageCircle, BookOpen, TrendingUp, User, FileText, Activity, BarChart2, Heart, Leaf, Users, ChefHat, Star, Flower2, MoreHorizontal, X, Droplets, Brain, Award } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useT } from '../i18n'
import { PAYMENTS_ACTIVE, useSubscription } from '../hooks/useSubscription'

const DOCS_EPOCH = '1970-01-01T00:00:00Z'

const badgeStyle = {
  position: 'absolute', top: -4, right: -4, width: 16, height: 16,
  borderRadius: '50%', background: '#0891b2', color: 'white',
  fontSize: 9, fontWeight: 700, display: 'flex',
  alignItems: 'center', justifyContent: 'center', border: '2px solid white',
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const handler = (e) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isDesktop
}

export default function BottomNav() {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const { isPro } = useSubscription()
  const t = useT()
  const [newDocs, setNewDocs] = useState(0)
  const [moreOpen, setMoreOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(
    () => localStorage.getItem('sidebar_open') !== 'false'
  )
  const toggleSidebar = () => setSidebarOpen(v => {
    const next = !v
    localStorage.setItem('sidebar_open', String(next))
    return next
  })
  const [unreadChat, setUnreadChat] = useState(0)
  const isDesktop = useIsDesktop()

  useEffect(() => {
    const w = (isDesktop && sidebarOpen) ? '220px' : '0px'
    document.documentElement.style.setProperty('--sidebar-w', w)
  }, [isDesktop, sidebarOpen])

  useEffect(() => {
    if (!user) return
    const key = `docs_last_seen_${user.id}`
    const lastSeen = localStorage.getItem(key) || DOCS_EPOCH
    supabase
      .from('patient_documents')
      .select('*', { count: 'exact', head: true })
      .eq('patient_id', user.id)
      .gt('created_at', lastSeen)
      .then(({ count }) => setNewDocs(count || 0))
  }, [user])

  useEffect(() => {
    if (pathname === '/documenti' && user) {
      localStorage.setItem(`docs_last_seen_${user.id}`, new Date().toISOString())
      setNewDocs(0)
    }
  }, [pathname, user])

  useEffect(() => {
    if (!user) return
    supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('patient_id', user.id)
      .eq('sender_role', 'dietitian')
      .is('read_at', null)
      .then(({ count }) => setUnreadChat(count || 0))

    const channel = supabase.channel(`nav-chat-${user.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `patient_id=eq.${user.id}` }, payload => {
        if (payload.new.sender_role === 'dietitian' && !payload.new.read_at) setUnreadChat(prev => prev + 1)
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chat_messages', filter: `patient_id=eq.${user.id}` }, payload => {
        if (payload.new.sender_role === 'dietitian' && payload.new.read_at && !payload.old?.read_at) setUnreadChat(prev => Math.max(0, prev - 1))
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [user])

  useEffect(() => { if (pathname === '/chat') setUnreadChat(0) }, [pathname])
  useEffect(() => { setMoreOpen(false) }, [pathname])

  const TABS = [
    { to: '/', icon: Home, label: t('nav.dashboard') },
    { to: '/dieta', icon: Utensils, label: t('nav.diet') },
    { to: '/macro', icon: BookOpen, label: t('nav.diary') },
    { to: '/ricette', icon: ChefHat, label: t('nav.recipes') },
    { to: '/chat', icon: MessageCircle, label: t('nav.chat'), badge: unreadChat },
    { to: '/documenti', icon: FileText, label: t('nav.documents'), badge: newDocs },
    { to: '/dietisti', icon: Users, label: t('nav.dietitians') },
    { to: '/progressi', icon: TrendingUp, label: t('nav.progress') },
    { to: '/attivita', icon: Activity, label: t('nav.activities') },
    { to: '/statistiche', icon: BarChart2, label: t('nav.report') },
    { to: '/benessere', icon: Heart, label: t('nav.wellness') },
    { to: '/ciclo', icon: Flower2, label: 'Ciclo' },
    { to: '/profilo', icon: User, label: t('nav.profile') },
    { to: '/pro', icon: Star, label: isPro ? '⭐ Pro' : '🔓 Pro' },
    ...(PAYMENTS_ACTIVE ? [{ to: '/abbonamento', icon: Star, label: 'Abbonamento' }] : []),
  ]

  // ── Desktop sidebar ──────────────────────────────────────────────────────────
  if (isDesktop) {
    const tabMap = Object.fromEntries(TABS.map(t => [t.to, t]))
    const DESKTOP_SECTIONS = [
      { label: null, items: ['/'] },
      { label: t('nav.section_nutrition'), items: ['/dieta', '/macro', '/ricette'] },
      { label: t('nav.section_professionals'), items: ['/chat', '/documenti', '/dietisti'] },
      { label: t('nav.section_monitoring'), items: ['/progressi', '/attivita', '/benessere', '/ciclo', '/statistiche'] },
      { label: null, items: PAYMENTS_ACTIVE ? ['/profilo', '/pro', '/abbonamento'] : ['/profilo', '/pro'] },
    ]

    return (
      <>
        {!sidebarOpen && (
          <button onClick={toggleSidebar} style={{
            position: 'fixed', top: '50%', transform: 'translateY(-50%)', left: 0, zIndex: 1001,
            width: 22, height: 48, borderRadius: '0 8px 8px 0',
            border: '1px solid var(--border-light)', borderLeft: 'none',
            background: 'var(--surface)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13,
            boxShadow: '2px 0 8px rgba(0,0,0,0.08)',
          }}>›</button>
        )}
        <nav className="app-sidebar" style={{
          display: 'flex', flexDirection: 'column', zIndex: 999,
          width: sidebarOpen ? 220 : 0, minWidth: 0,
          transition: 'width 0.22s ease', overflow: 'hidden',
        }}>
          <div style={{ padding: '16px 14px 12px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, minWidth: 220 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, var(--green-main), var(--green-mid))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Leaf size={15} color="white" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1, whiteSpace: 'nowrap' }}>Diet Plan</p>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Dashboard</p>
            </div>
            <button onClick={toggleSidebar} style={{ width: 26, height: 26, borderRadius: 7, border: '1px solid var(--border-light)', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, color: 'var(--text-muted)', fontSize: 13, fontWeight: 700 }}>←</button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '10px 8px', minWidth: 220 }}>
            {DESKTOP_SECTIONS.map((section, si) => (
              <div key={si}>
                {section.label && (
                  <p style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.7px', padding: si === 0 ? '4px 10px' : '14px 10px 4px', whiteSpace: 'nowrap', opacity: 0.65 }}>{section.label}</p>
                )}
                {section.items.map(to => {
                  const tab = tabMap[to]
                  if (!tab) return null
                  const { icon: Icon, label, badge } = tab
                  const active = pathname === to || (to !== '/' && pathname.startsWith(to + '/'))
                  return (
                    <Link key={to} to={to} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 10px', borderRadius: 10, marginBottom: 2,
                      textDecoration: 'none',
                      background: active ? 'var(--green-pale)' : 'transparent',
                      color: active ? 'var(--green-main)' : 'var(--text-secondary)',
                      fontWeight: active ? 600 : 400, fontSize: 13,
                      transition: 'background 0.12s, color 0.12s',
                      position: 'relative', whiteSpace: 'nowrap',
                    }}>
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                        {badge > 0 && <span style={{ ...badgeStyle, top: -5, right: -5, border: `2px solid ${active ? 'var(--green-pale)' : 'var(--surface)'}` }}>{badge}</span>}
                      </div>
                      <span>{label}</span>
                      {badge > 0 && <span style={{ marginLeft: 'auto', background: '#0891b2', color: 'white', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 100 }}>{badge}</span>}
                    </Link>
                  )
                })}
              </div>
            ))}
          </div>
        </nav>
      </>
    )
  }

  // ── Mobile: 5 tab + sheet "Altro" ────────────────────────────────────────────
  const MOBILE_PRIMARY = [
    { to: '/', icon: Home, label: t('nav.dashboard') },
    { to: '/dieta', icon: Utensils, label: t('nav.diet') },
    { to: '/macro', icon: BookOpen, label: t('nav.diary') },
    { to: '/chat', icon: MessageCircle, label: t('nav.chat'), badge: unreadChat },
    { to: '/profilo', icon: User, label: t('nav.profile') },
  ]

  const MORE_SECTIONS = [
    { label: 'Nutrizione', items: [
      { to: '/acqua', icon: Droplets, label: 'Acqua' },
      { to: '/ricette', icon: ChefHat, label: t('nav.recipes') },
      { to: '/alimenti', icon: BookOpen, label: 'Alimenti' },
    ]},
    { label: 'Salute & Benessere', items: [
      { to: '/progressi', icon: TrendingUp, label: t('nav.progress') },
      { to: '/attivita', icon: Activity, label: t('nav.activities') },
      { to: '/benessere', icon: Heart, label: t('nav.wellness') },
      { to: '/ciclo', icon: Flower2, label: 'Ciclo' },
      { to: '/statistiche', icon: BarChart2, label: t('nav.report') },
    ]},
    { label: 'Professionale', items: [
      { to: '/documenti', icon: FileText, label: t('nav.documents'), badge: newDocs },
      { to: '/dietisti', icon: Users, label: t('nav.dietitians') },
    ]},
    { label: 'Altro', items: [
      { to: '/quiz', icon: Brain, label: 'Quiz' },
      { to: '/badge', icon: Award, label: 'Badge' },
      { to: '/pro', icon: Star, label: isPro ? '⭐ Pro' : '🔓 Pro' },
      ...(PAYMENTS_ACTIVE ? [{ to: '/abbonamento', icon: Star, label: 'Abbonamento' }] : []),
    ]},
  ]

  const anyMoreActive = MORE_SECTIONS.flatMap(s => s.items).some(({ to }) =>
    pathname === to || (to !== '/' && pathname.startsWith(to + '/'))
  )

  return (
    <>
      {/* Bottom nav bar */}
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
        {MOBILE_PRIMARY.map(({ to, icon: Icon, label, badge }) => {
          const active = pathname === to || (to !== '/' && pathname.startsWith(to + '/'))
          return (
            <Link key={to} to={to} style={{
              flex: 1,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 3, textDecoration: 'none',
              color: active ? 'var(--green-main)' : '#94a3b8',
              WebkitTapHighlightColor: 'transparent',
              transition: 'color 0.15s',
              paddingTop: 6,
            }}>
              <div style={{ width: 38, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: active ? 'var(--green-pale)' : 'transparent', transition: 'background 0.2s', position: 'relative' }}>
                <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
                {badge > 0 && <span style={badgeStyle}>{badge}</span>}
              </div>
              <span style={{ fontSize: 9.5, fontWeight: active ? 600 : 400, letterSpacing: '0.01em' }}>{label}</span>
            </Link>
          )
        })}

        {/* "Altro" button */}
        <button
          onClick={() => setMoreOpen(v => !v)}
          style={{
            flex: 1, border: 'none', background: 'transparent', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 3, paddingTop: 6,
            color: (moreOpen || anyMoreActive) ? 'var(--green-main)' : '#94a3b8',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <div style={{ width: 38, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: (moreOpen || anyMoreActive) ? 'var(--green-pale)' : 'transparent', transition: 'background 0.2s', position: 'relative' }}>
            {moreOpen ? <X size={20} strokeWidth={2.2} style={{ transition: 'transform 0.2s' }} /> : <MoreHorizontal size={20} strokeWidth={1.8} />}
            {newDocs > 0 && !moreOpen && <span style={badgeStyle}>{newDocs}</span>}
          </div>
          <span style={{ fontSize: 9.5, fontWeight: (moreOpen || anyMoreActive) ? 600 : 400, letterSpacing: '0.01em' }}>Altro</span>
        </button>
      </nav>

      {/* Backdrop — CSS transition, always in DOM */}
      <div
        onClick={() => setMoreOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 997,
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)',
          opacity: moreOpen ? 1 : 0,
          pointerEvents: moreOpen ? 'auto' : 'none',
          transition: 'opacity 0.2s ease',
        }}
      />

      {/* Sheet — CSS transition, always in DOM */}
      <div style={{
        position: 'fixed',
        bottom: 'calc(64px + env(safe-area-inset-bottom))',
        left: 0, right: 0, zIndex: 998,
        background: 'var(--surface)',
        borderRadius: '22px 22px 0 0',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
        maxHeight: '72vh',
        overflowY: moreOpen ? 'auto' : 'hidden',
        padding: '10px 16px 20px',
        transform: moreOpen ? 'translateY(0)' : 'translateY(110%)',
        opacity: moreOpen ? 1 : 0,
        pointerEvents: moreOpen ? 'auto' : 'none',
        transition: 'transform 0.32s cubic-bezier(.22,1,.36,1), opacity 0.22s ease',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)', margin: '0 auto 16px' }} />

        {MORE_SECTIONS.map((section, si) => (
          <div key={si} style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{section.label}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {section.items.map(({ to, icon: Icon, label, badge }) => {
                const active = pathname === to || (to !== '/' && pathname.startsWith(to + '/'))
                return (
                  <Link key={to} to={to} style={{
                    textDecoration: 'none', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 6, padding: '10px 4px',
                    borderRadius: 14,
                    background: active ? 'var(--green-pale)' : 'var(--surface-2)',
                    border: `1.5px solid ${active ? 'var(--border)' : 'var(--border-light)'}`,
                    position: 'relative',
                    transition: 'background 0.15s, border-color 0.15s',
                  }}>
                    <div style={{ position: 'relative' }}>
                      <Icon size={20} color={active ? 'var(--green-main)' : 'var(--text-secondary)'} strokeWidth={active ? 2.2 : 1.8} />
                      {badge > 0 && <span style={{ ...badgeStyle, top: -5, right: -5 }}>{badge}</span>}
                    </div>
                    <span style={{ fontSize: 10, fontWeight: active ? 600 : 400, color: active ? 'var(--green-main)' : 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.2 }}>{label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (hover: hover) {
          .bn-link:hover { opacity: 0.75; }
        }
        .bn-link:active { transform: scale(0.88); transition: transform 0.1s; }
      `}</style>
    </>
  )
}
