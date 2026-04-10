import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Send, CheckCheck, Check, MessageCircle } from 'lucide-react'

export default function ChatPage() {
  const { user, profile } = useAuth()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [dietitian, setDietitian] = useState(null)
  const [notLinked, setNotLinked] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    loadData()
    const channel = supabase.channel('chat-patient')
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'chat_messages',
        filter: `patient_id=eq.${user.id}`
      }, payload => {
        setMessages(prev => {
          // avoid duplicates
          if (prev.find(m => m.id === payload.new.id)) return prev
          return [...prev, payload.new]
        })
        if (payload.new.sender_role === 'dietitian') markAsRead([payload.new.id])
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [user.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function loadData() {
    // Load dietitian link
    const { data: link } = await supabase
      .from('patient_dietitian')
      .select('dietitian_id')
      .eq('patient_id', user.id)
      .maybeSingle()

    if (!link) {
      setNotLinked(true)
      setLoading(false)
      return
    }

    // Try to get dietitian profile
    const { data: dProfile } = await supabase
      .from('profiles')
      .select('full_name, first_name, last_name')
      .eq('id', link.dietitian_id)
      .maybeSingle()

    setDietitian(dProfile || { full_name: 'Il tuo dietista' })

    // Load messages
    const { data: msgs } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('patient_id', user.id)
      .order('created_at', { ascending: true })
    setMessages(msgs || [])

    const unread = (msgs || []).filter(m => m.sender_role === 'dietitian' && !m.read_at)
    if (unread.length) markAsRead(unread.map(m => m.id))

    setLoading(false)
  }

  async function markAsRead(ids) {
    if (!ids.length) return
    await supabase.from('chat_messages').update({ read_at: new Date().toISOString() }).in('id', ids)
  }

  async function sendMessage(e) {
    e?.preventDefault()
    const content = text.trim()
    if (!content || sending) return
    setSending(true)
    setText('')
    const optimistic = {
      id: `opt_${Date.now()}`, patient_id: user.id,
      sender_role: 'patient', sender_id: user.id,
      content, created_at: new Date().toISOString(), read_at: null
    }
    setMessages(prev => [...prev, optimistic])
    const { data, error } = await supabase.from('chat_messages').insert({
      patient_id: user.id, sender_role: 'patient',
      sender_id: user.id, content
    }).select().single()
    if (data) {
      setMessages(prev => prev.map(m => m.id === optimistic.id ? data : m))
    } else if (error) {
      setMessages(prev => prev.filter(m => m.id !== optimistic.id))
      setText(content)
    }
    setSending(false)
    inputRef.current?.focus()
  }

  function formatTime(ts) {
    const d = new Date(ts)
    const now = new Date()
    if (d.toDateString() === now.toDateString())
      return d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
    return d.toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }) + ' ' +
      d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
  }

  function groupByDate(msgs) {
    const groups = {}
    msgs.forEach(m => {
      const day = new Date(m.created_at).toDateString()
      if (!groups[day]) groups[day] = []
      groups[day].push(m)
    })
    return groups
  }

  function dayLabel(dateStr) {
    const d = new Date(dateStr); const now = new Date()
    const y = new Date(now); y.setDate(now.getDate() - 1)
    if (d.toDateString() === now.toDateString()) return 'Oggi'
    if (d.toDateString() === y.toDateString()) return 'Ieri'
    return d.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  const dietitianName = dietitian?.full_name ||
    `${dietitian?.first_name || ''} ${dietitian?.last_name || ''}`.trim() ||
    'Il tuo dietista'

  // ── Not linked state ──
  if (!loading && notLinked) return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--surface-2)' }}>
      <div style={{ background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))', padding: 'calc(env(safe-area-inset-top) + 16px) 20px 20px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'white', fontWeight: 300 }}>Chat</h1>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <MessageCircle size={32} color="var(--green-main)" />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 300, marginBottom: 10 }}>
          Nessun dietista collegato
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7, maxWidth: 300 }}>
          Per usare la chat, il tuo dietista deve collegarti al suo profilo dalla piattaforma professionale.
        </p>
        <div style={{ marginTop: 24, background: 'var(--green-pale)', borderRadius: 14, padding: '16px 20px', maxWidth: 320 }}>
          <p style={{ fontSize: 13, color: 'var(--green-dark)', lineHeight: 1.6 }}>
            💡 Chiedi al tuo dietista di cercare la tua email (<strong>{user.email}</strong>) nella sezione "Collega paziente" della sua app.
          </p>
        </div>
      </div>
      <div style={{ height: 'calc(72px + env(safe-area-inset-bottom))' }} />
    </div>
  )

  const groups = groupByDate(messages)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'var(--surface-2)', paddingBottom: 'calc(72px + env(safe-area-inset-bottom))' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))', padding: 'calc(env(safe-area-inset-top) + 14px) 16px 16px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: 'white', flexShrink: 0, border: '2px solid rgba(255,255,255,0.3)' }}>
          {dietitianName[0]?.toUpperCase()}
        </div>
        <div>
          <p style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>{dietitianName}</p>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>Dietista</p>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px 0', WebkitOverflowScrolling: 'touch' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ width: 24, height: 24, border: '3px solid var(--border)', borderTopColor: 'var(--green-main)', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 10px' }} />
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Caricamento…</p>
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>💬</div>
            <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>Inizia la conversazione</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>Scrivi un messaggio a {dietitianName}<br />per domande o aggiornamenti.</p>
          </div>
        ) : (
          Object.entries(groups).map(([day, msgs]) => (
            <div key={day}>
              <div style={{ textAlign: 'center', margin: '10px 0' }}>
                <span style={{ background: 'var(--border)', color: 'var(--text-muted)', fontSize: 11, padding: '3px 10px', borderRadius: 100 }}>{dayLabel(day)}</span>
              </div>
              {msgs.map((msg, i) => {
                const isMe = msg.sender_role === 'patient'
                const showAvatar = !isMe && (i === 0 || msgs[i - 1]?.sender_role !== msg.sender_role)
                return (
                  <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: 5, alignItems: 'flex-end', gap: 6 }}>
                    {!isMe && (
                      <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--green-main)', flexShrink: 0, visibility: showAvatar ? 'visible' : 'hidden' }}>
                        {dietitianName[0]}
                      </div>
                    )}
                    <div style={{ maxWidth: '75%', background: isMe ? 'linear-gradient(135deg, var(--green-main), var(--green-mid))' : 'white', color: isMe ? 'white' : 'var(--text-primary)', padding: '9px 13px', borderRadius: isMe ? '16px 16px 3px 16px' : '16px 16px 16px 3px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', border: isMe ? 'none' : '1px solid var(--border-light)' }}>
                      <p style={{ fontSize: 14, lineHeight: 1.5, wordBreak: 'break-word' }}>{msg.content}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3, marginTop: 3 }}>
                        <span style={{ fontSize: 10, opacity: 0.65 }}>{formatTime(msg.created_at)}</span>
                        {isMe && (msg.read_at ? <CheckCheck size={11} style={{ opacity: 0.7 }} /> : <Check size={11} style={{ opacity: 0.4 }} />)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))
        )}
        <div ref={bottomRef} style={{ height: 8 }} />
      </div>

      {/* Input - fixed above bottom nav */}
      <div style={{ position: 'fixed', bottom: 'calc(72px + env(safe-area-inset-bottom))', left: 0, right: 0, padding: '10px 12px', background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--border-light)', zIndex: 50 }}>
        <form onSubmit={sendMessage} style={{ display: 'flex', alignItems: 'flex-end', gap: 9 }}>
          <div style={{ flex: 1, background: 'var(--surface-2)', borderRadius: 22, border: '1.5px solid var(--border)', padding: '9px 14px', display: 'flex', alignItems: 'center' }}>
            <textarea
              ref={inputRef} value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder="Scrivi un messaggio…" rows={1}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-primary)', resize: 'none', maxHeight: 100, lineHeight: 1.5 }}
            />
          </div>
          <button type="submit" disabled={!text.trim() || sending} style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0, background: text.trim() ? 'var(--green-main)' : 'var(--border)', border: 'none', cursor: text.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s', boxShadow: text.trim() ? '0 2px 8px rgba(26,127,90,0.3)' : 'none' }}>
            <Send size={17} color="white" style={{ marginLeft: 2 }} />
          </button>
        </form>
      </div>
    </div>
  )
}
