import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Utensils, MessageCircle, BookOpen, TrendingUp, User, FileText, Activity, BarChart2, Heart, Leaf, Users, ChefHat, Star, Flower2, X, Droplets, Brain, Award, ShoppingCart, Timer, Pill, Sparkles, ChevronRight, CalendarCheck, Trophy } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useT } from '../i18n'
import { PAYMENTS_ACTIVE, useSubscription } from '../hooks/useSubscription'
import { fetchEnabledSpecialties } from '../lib/specialSections'

const DOCS_EPOCH = '1970-01-01T00:00:00Z'
const HAS_SPECIAL_CACHE_KEY = 'has_special_cache'

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
  const { user, profile } = useAuth()
  const showCycle = profile?.gender !== 'M'
  const { isPro } = useSubscription()
  const t = useT()
  const [newDocs, setNewDocs] = useState(0)
  const [newShared, setNewShared] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(
    () => localStorage.getItem('sidebar_open') !== 'false'
  )
  const toggleSidebar = () => setSidebarOpen(v => {
    const next = !v
    localStorage.setItem('sidebar_open', String(next))
    return next
  })
  const [unreadChat, setUnreadChat] = useState(0)
  // Seeded from last known state so the "Speciale" entry doesn't pop in a few
  // seconds after the app opens on every single visit — only the very first
  // login ever has to wait on the real network round-trip below.
  const [hasSpecial, setHasSpecial] = useState(() => localStorage.getItem(HAS_SPECIAL_CACHE_KEY) === 'true')
  const isDesktop = useIsDesktop()

  useEffect(() => {
    if (!user?.id) return
    fetchEnabledSpecialties(user.id).then(keys => {
      const has = keys.length > 0
      setHasSpecial(has)
      localStorage.setItem(HAS_SPECIAL_CACHE_KEY, String(has))
    })
  }, [user?.id])

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

  useEffect(() => {
    if (!user) return
    supabase
      .from('shared_recipes')
      .select('*', { count: 'exact', head: true })
      .eq('patient_id', user.id)
      .is('viewed_at', null)
      .then(({ count }) => setNewShared(count || 0))

    const channel = supabase.channel(`nav-shared-${user.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'shared_recipes', filter: `patient_id=eq.${user.id}` }, () => {
        setNewShared(prev => prev + 1)
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'shared_recipes', filter: `patient_id=eq.${user.id}` }, payload => {
        if (payload.new.viewed_at && !payload.old?.viewed_at) setNewShared(prev => Math.max(0, prev - 1))
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [user])

  useEffect(() => { if (pathname === '/chat') setUnreadChat(0) }, [pathname])

  const TABS = [
    { to: '/', icon: Home, label: t('nav.dashboard') },
    { to: '/dieta', icon: Utensils, label: t('nav.diet') },
    { to: '/macro', icon: BookOpen, label: t('nav.diary') },
    { to: '/ricette', icon: ChefHat, label: t('nav.recipes'), badge: newShared },
    { to: '/lista-spesa', icon: ShoppingCart, label: 'Lista spesa' },
    { to: '/digiuno', icon: Timer, label: 'Digiuno IF' },
    { to: '/chat', icon: MessageCircle, label: t('nav.chat'), badge: unreadChat },
    { to: '/documenti', icon: FileText, label: t('nav.documents'), badge: newDocs },
    { to: '/dietisti', icon: Users, label: t('nav.dietitians') },
    ...(hasSpecial ? [{ to: '/speciale', icon: Sparkles, label: 'Speciale' }] : []),
    { to: '/progressi', icon: TrendingUp, label: t('nav.progress') },
    { to: '/settimana', icon: CalendarCheck, label: 'Settimana' },
    { to: '/sfide', icon: Trophy, label: 'Sfide' },
    { to: '/attivita', icon: Activity, label: t('nav.activities') },
    { to: '/statistiche', icon: BarChart2, label: t('nav.report') },
    { to: '/benessere', icon: Heart, label: t('nav.wellness') },
    ...(showCycle ? [{ to: '/ciclo', icon: Flower2, label: 'Ciclo' }] : []),
    { to: '/farmaci', icon: Pill, label: 'Farmaci' },
    { to: '/profilo', icon: User, label: t('nav.profile') },
    { to: '/pro', icon: Star, label: isPro ? '⭐ Pro' : '🔓 Pro' },
    ...(PAYMENTS_ACTIVE ? [{ to: '/abbonamento', icon: Star, label: 'Abbonamento' }] : []),
  ]

  // Sub-section sheet state — declared before the desktop early-return so hook
  // order stays identical across renders regardless of isDesktop.
  const [openGroup, setOpenGroup] = useState(null)
  useEffect(() => { setOpenGroup(null) }, [pathname])

  // ── Desktop sidebar (unchanged — plenty of room, no need to group) ─────────
  if (isDesktop) {
    const tabMap = Object.fromEntries(TABS.map(t => [t.to, t]))
    const DESKTOP_SECTIONS = [
      { label: null, items: ['/'] },
      { label: t('nav.section_nutrition'), items: ['/dieta', '/macro', '/ricette', '/lista-spesa', '/digiuno'] },
      { label: t('nav.section_professionals'), items: ['/chat', '/documenti', '/dietisti', ...(hasSpecial ? ['/speciale'] : [])] },
      { label: t('nav.section_monitoring'), items: ['/progressi', '/settimana', '/sfide', '/attivita', '/benessere', ...(showCycle ? ['/ciclo'] : []), '/farmaci', '/statistiche'] },
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

  // ── Mobile: 5 macro-groups — Home is a direct destination, the other 4 open
  // a sheet listing their sub-sections. Keeps the bar itself simple/thumb-
  // friendly regardless of how many sections exist inside each group. ───────
  const GROUPS = {
    nutrizione: {
      label: 'Nutrizione', icon: Utensils, color: 'var(--green-main)', bg: 'var(--icon-bg-green)',
      items: [
        { to: '/dieta', icon: Utensils, label: t('nav.diet'), color: 'var(--green-main)', bg: 'var(--icon-bg-green)' },
        { to: '/macro', icon: BookOpen, label: t('nav.diary'), color: 'var(--blue)', bg: 'var(--icon-bg-blue)' },
        { to: '/ricette', icon: ChefHat, label: t('nav.recipes'), badge: newShared, color: 'var(--orange)', bg: 'var(--icon-bg-orange)' },
        { to: '/acqua', icon: Droplets, label: 'Acqua', color: '#0891B2', bg: 'var(--icon-bg-cyan)' },
        { to: '/lista-spesa', icon: ShoppingCart, label: 'Lista spesa', color: 'var(--purple)', bg: 'var(--icon-bg-purple)' },
        { to: '/digiuno', icon: Timer, label: 'Digiuno IF', color: '#DB2777', bg: 'var(--icon-bg-pink)' },
        { to: '/alimenti', icon: BookOpen, label: 'Alimenti', color: '#0D9488', bg: 'var(--icon-bg-teal)' },
      ],
    },
    professionisti: {
      label: 'Professionisti', icon: Users, color: 'var(--blue)', bg: 'var(--icon-bg-blue)',
      items: [
        { to: '/chat', icon: MessageCircle, label: t('nav.chat'), badge: unreadChat, color: 'var(--blue)', bg: 'var(--icon-bg-blue)' },
        { to: '/documenti', icon: FileText, label: t('nav.documents'), badge: newDocs, color: 'var(--text-secondary)', bg: 'var(--icon-bg-gray)' },
        { to: '/dietisti', icon: Users, label: t('nav.dietitians'), color: 'var(--green-main)', bg: 'var(--icon-bg-green)' },
        ...(hasSpecial ? [{ to: '/speciale', icon: Sparkles, label: 'Speciale', color: 'var(--purple)', bg: 'var(--icon-bg-purple)' }] : []),
      ],
    },
    monitoraggio: {
      label: 'Monitoraggio', icon: TrendingUp, color: 'var(--orange)', bg: 'var(--icon-bg-orange)',
      items: [
        { to: '/progressi', icon: TrendingUp, label: t('nav.progress'), color: 'var(--orange)', bg: 'var(--icon-bg-orange)' },
        { to: '/settimana', icon: CalendarCheck, label: 'Settimana', color: 'var(--blue)', bg: 'var(--icon-bg-blue)' },
        { to: '/sfide', icon: Trophy, label: 'Sfide', color: '#D97706', bg: 'var(--icon-bg-amber)' },
        { to: '/attivita', icon: Activity, label: t('nav.activities'), color: 'var(--green-main)', bg: 'var(--icon-bg-green)' },
        { to: '/benessere', icon: Heart, label: t('nav.wellness'), color: '#DB2777', bg: 'var(--icon-bg-pink)' },
        ...(showCycle ? [{ to: '/ciclo', icon: Flower2, label: 'Ciclo', color: '#DB2777', bg: 'var(--icon-bg-pink)' }] : []),
        { to: '/farmaci', icon: Pill, label: 'Farmaci', color: 'var(--red)', bg: 'var(--icon-bg-red)' },
        { to: '/statistiche', icon: BarChart2, label: t('nav.report'), color: 'var(--purple)', bg: 'var(--icon-bg-purple)' },
      ],
    },
    profilo: {
      label: 'Profilo', icon: User, color: 'var(--green-main)', bg: 'var(--icon-bg-green)',
      items: [
        { to: '/profilo', icon: User, label: t('nav.profile'), color: 'var(--green-main)', bg: 'var(--icon-bg-green)' },
        { to: '/quiz', icon: Brain, label: 'Quiz', color: 'var(--purple)', bg: 'var(--icon-bg-purple)' },
        { to: '/badge', icon: Award, label: 'Badge', color: '#D97706', bg: 'var(--icon-bg-amber)' },
        { to: '/pro', icon: Star, label: isPro ? '⭐ Pro' : '🔓 Pro', color: '#D97706', bg: 'var(--icon-bg-amber)' },
        ...(PAYMENTS_ACTIVE ? [{ to: '/abbonamento', icon: Star, label: 'Abbonamento', color: 'var(--blue)', bg: 'var(--icon-bg-blue)' }] : []),
      ],
    },
  }
  const GROUP_KEYS = ['nutrizione', 'professionisti', 'monitoraggio', 'profilo']

  function isActive(to) {
    return pathname === to || (to !== '/' && pathname.startsWith(to + '/'))
  }
  function groupBadge(key) {
    return GROUPS[key].items.reduce((sum, it) => sum + (it.badge > 0 ? it.badge : 0), 0)
  }
  function isGroupActive(key) {
    return GROUPS[key].items.some(it => isActive(it.to))
  }

  const active = openGroup ? GROUPS[openGroup] : null

  return (
    <>
      {/* Bottom nav bar — 5 destinations, thumb-width each */}
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
        <Link to="/" style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 3, textDecoration: 'none',
          color: pathname === '/' ? 'var(--green-main)' : '#94a3b8',
          WebkitTapHighlightColor: 'transparent', transition: 'color 0.15s', paddingTop: 6,
        }}>
          <div style={{ width: 38, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: pathname === '/' ? 'var(--green-pale)' : 'transparent', transition: 'background 0.2s' }}>
            <Home size={20} strokeWidth={pathname === '/' ? 2.2 : 1.8} />
          </div>
          <span style={{ fontSize: 9.5, fontWeight: pathname === '/' ? 600 : 400, letterSpacing: '0.01em' }}>Home</span>
        </Link>

        {GROUP_KEYS.map(key => {
          const g = GROUPS[key]
          const groupIsOpen = openGroup === key
          const groupIsActive = isGroupActive(key)
          const badge = groupBadge(key)
          const on = groupIsOpen || groupIsActive
          return (
            <button
              key={key}
              onClick={() => setOpenGroup(v => v === key ? null : key)}
              style={{
                flex: 1, border: 'none', background: 'transparent', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 3, paddingTop: 6,
                color: on ? 'var(--green-main)' : '#94a3b8',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <div style={{ width: 38, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: on ? 'var(--green-pale)' : 'transparent', transition: 'background 0.2s', position: 'relative' }}>
                {groupIsOpen ? <X size={20} strokeWidth={2.2} /> : <g.icon size={20} strokeWidth={on ? 2.2 : 1.8} />}
                {badge > 0 && !groupIsOpen && <span style={badgeStyle}>{badge}</span>}
              </div>
              <span style={{ fontSize: 9.5, fontWeight: on ? 600 : 400, letterSpacing: '0.01em' }}>{g.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Backdrop */}
      <div
        onClick={() => setOpenGroup(null)}
        style={{
          position: 'fixed', inset: 0, zIndex: 997,
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)',
          opacity: openGroup ? 1 : 0,
          pointerEvents: openGroup ? 'auto' : 'none',
          transition: 'opacity 0.2s ease',
        }}
      />

      {/* Group sheet */}
      <div style={{
        position: 'fixed',
        bottom: 'calc(64px + env(safe-area-inset-bottom))',
        left: 0, right: 0, zIndex: 998,
        background: 'var(--surface)',
        borderRadius: '24px 24px 0 0',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
        maxHeight: '75dvh',
        overflowY: openGroup ? 'auto' : 'hidden',
        padding: '10px 16px 20px',
        transform: openGroup ? 'translateY(0)' : 'translateY(110%)',
        opacity: openGroup ? 1 : 0,
        pointerEvents: openGroup ? 'auto' : 'none',
        transition: 'transform 0.32s cubic-bezier(.22,1,.36,1), opacity 0.22s ease',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)', margin: '0 auto 14px' }} />

        {active && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: active.bg, color: active.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <active.icon size={19} />
              </div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{active.label}</h2>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={openGroup} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {active.items.map((it, i) => {
                  const on = isActive(it.to)
                  return (
                    <motion.div
                      key={it.to}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.22 }}
                    >
                      <Link to={it.to} style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                        borderRadius: 14, textDecoration: 'none',
                        background: on ? 'var(--green-pale)' : 'var(--surface-2)',
                        border: `1.5px solid ${on ? 'var(--border)' : 'var(--border-light)'}`,
                      }}>
                        <div style={{ width: 36, height: 36, borderRadius: 11, background: it.bg, color: it.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
                          <it.icon size={17} />
                          {it.badge > 0 && <span style={{ ...badgeStyle, top: -4, right: -4 }}>{it.badge}</span>}
                        </div>
                        <span style={{ flex: 1, fontSize: 14, fontWeight: on ? 700 : 500, color: on ? 'var(--green-main)' : 'var(--text-primary)' }}>{it.label}</span>
                        <ChevronRight size={16} color="var(--text-muted)" />
                      </Link>
                    </motion.div>
                  )
                })}
              </motion.div>
            </AnimatePresence>
          </>
        )}
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
