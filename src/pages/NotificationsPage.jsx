import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Bell, CheckCheck } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import { useT } from '../i18n'

const PAGE_SIZE = 30

function formatWhen(iso, locale) {
  const d = new Date(iso)
  const datePart = d.toLocaleDateString(locale)
  const timePart = d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
  return `${datePart} ${timePart}`
}

/**
 * Centro notifiche (SEZIONE 123) — storico persistente degli eventi
 * notificati, consultabile anche se una push è stata persa o il permesso
 * non è mai stato concesso. Diverso da NotificationContext's toast-in-the-
 * moment: qui si legge la tabella `notifications`, non i canali realtime di
 * showNotification().
 */
export default function NotificationsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { refreshUnreadCount } = useNotifications()
  const t = useT()
  const locale = t('locale_code', 'it-IT')

  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [offset, setOffset] = useState(0)

  const load = useCallback(async (reset) => {
    if (!user) return
    setLoading(true)
    const from = reset ? 0 : offset
    let q = supabase.from('notifications').select('*').eq('user_id', user.id)
      .order('created_at', { ascending: false }).range(from, from + PAGE_SIZE - 1)
    if (filter === 'unread') q = q.is('read_at', null)
    const { data, error } = await q
    if (!error) {
      setItems(prev => reset ? (data || []) : [...prev, ...(data || [])])
      setOffset(from + (data?.length || 0))
      setHasMore((data?.length || 0) === PAGE_SIZE)
    }
    setLoading(false)
  }, [user, filter, offset])

  useEffect(() => { load(true) }, [user?.id, filter]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleClick(item) {
    if (!item.read_at) {
      setItems(prev => prev.map(n => n.id === item.id ? { ...n, read_at: new Date().toISOString() } : n))
      await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('id', item.id)
      refreshUnreadCount()
    }
    if (item.url) navigate(item.url)
  }

  async function markAllRead() {
    if (!user) return
    await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('user_id', user.id).is('read_at', null)
    setItems(prev => prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() })))
    refreshUnreadCount()
  }

  return (
    <div style={{ padding: '0 0 40px', minHeight: '100vh', background: 'var(--surface-2, #F8FAFC)' }}>
      <div style={{
        background: 'linear-gradient(135deg, #0a4a2e 0%, #1a7f5a 100%)',
        padding: 'calc(env(safe-area-inset-top) + 20px) 20px 20px',
        color: 'white',
      }}>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => navigate(-1)}
          style={{
            background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10,
            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'white', marginBottom: 14,
          }}
        >
          <ArrowLeft size={18} />
        </motion.button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Bell size={22} />
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{t('notifications.title', 'Notifiche')}</h1>
        </div>
      </div>

      <div style={{ padding: '16px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 4, background: 'var(--surface, white)', borderRadius: 10, padding: 4, border: '1px solid var(--border, #E2E8F0)' }}>
          {['all', 'unread'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '7px 14px', borderRadius: 7, border: 'none', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
              background: filter === f ? 'var(--text-primary, #1E293B)' : 'transparent',
              color: filter === f ? 'white' : 'var(--text-secondary, #64748B)',
            }}>
              {f === 'all' ? t('notifications.filter_all', 'Tutte') : t('notifications.filter_unread', 'Non lette')}
            </button>
          ))}
        </div>
        <button onClick={markAllRead} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8,
          border: '1px solid var(--border, #E2E8F0)', background: 'var(--surface, white)',
          color: 'var(--text-secondary, #64748B)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
        }}>
          <CheckCheck size={14} /> {t('notifications.mark_all_read', 'Segna tutte come lette')}
        </button>
      </div>

      <div style={{ padding: 16 }}>
        {items.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary, #64748B)', fontSize: 13.5 }}>
            {filter === 'unread' ? t('notifications.empty_unread', 'Nessuna notifica non letta.') : t('notifications.empty', 'Nessuna notifica.')}
          </div>
        )}
        {items.map(n => (
          <div
            key={n.id}
            onClick={() => handleClick(n)}
            style={{
              display: 'flex', gap: 12, alignItems: 'flex-start', padding: '13px 12px', marginBottom: 8,
              borderRadius: 12, cursor: 'pointer', border: '1px solid var(--border, #E2E8F0)',
              background: n.read_at ? 'var(--surface, white)' : 'rgba(26,127,90,0.06)',
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', marginTop: 6, flexShrink: 0, background: n.read_at ? 'transparent' : '#1a7f5a' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: n.read_at ? 500 : 700, color: 'var(--text-primary, #1E293B)' }}>{n.title}</div>
              {n.body && <div style={{ fontSize: 12.5, color: 'var(--text-secondary, #64748B)', marginTop: 2 }}>{n.body}</div>}
              <div style={{ fontSize: 11, color: 'var(--text-tertiary, #94A3B8)', marginTop: 4 }}>{formatWhen(n.created_at, locale)}</div>
            </div>
          </div>
        ))}
        {loading && <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-secondary, #64748B)', fontSize: 13 }}>{t('notifications.loading', 'Caricamento...')}</div>}
        {hasMore && !loading && (
          <button onClick={() => load(false)} style={{
            display: 'block', margin: '10px auto 0', padding: '9px 18px', borderRadius: 8,
            border: '1px solid var(--border, #E2E8F0)', background: 'var(--surface, white)',
            color: 'var(--text-secondary, #64748B)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
          }}>
            {t('notifications.load_more', 'Carica altre')}
          </button>
        )}
      </div>
    </div>
  )
}
