import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Send, Paperclip, CheckCheck, Check, Clock } from 'lucide-react'

export default function ChatPage() {
  const { user, profile } = useAuth()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [dietitian, setDietitian] = useState(null)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    loadMessages()
    loadDietitian()

    // Realtime subscription
    const channel = supabase
      .channel('chat-messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `patient_id=eq.${user.id}`
      }, payload => {
        setMessages(prev => [...prev, payload.new])
        markAsRead([payload.new.id])
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [user.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function loadMessages() {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('patient_id', user.id)
      .order('created_at', { ascending: true })
    setMessages(data || [])
    setLoading(false)
    // Mark incoming as read
    const unread = (data || []).filter(m => m.sender_role === 'dietitian' && !m.read_at)
    if (unread.length > 0) markAsRead(unread.map(m => m.id))
  }

  async function loadDietitian() {
    const { data } = await supabase
      .from('patient_dietitian')
      .select('dietitian_id, dietitian_profiles(full_name, avatar_url)')
      .eq('patient_id', user.id)
      .maybeSingle()
    setDietitian(data?.dietitian_profiles || null)
  }

  async function markAsRead(ids) {
    if (!ids.length) return
    await supabase.from('chat_messages')
      .update({ read_at: new Date().toISOString() })
      .in('id', ids)
  }

  async function sendMessage(e) {
    e?.preventDefault()
    if (!text.trim() || sending) return
    setSending(true)
    const msg = {
      patient_id: user.id,
      sender_role: 'patient',
      sender_id: user.id,
      content: text.trim(),
      created_at: new Date().toISOString()
    }
    const { data } = await supabase.from('chat_messages').insert(msg).select().single()
    if (data) setMessages(prev => [...prev, data])
    setText('')
    setSending(false)
    inputRef.current?.focus()
  }

  function formatTime(ts) {
    const d = new Date(ts)
    const now = new Date()
    const isToday = d.toDateString() === now.toDateString()
    if (isToday) return d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
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
    const d = new Date(dateStr)
    const now = new Date()
    const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1)
    if (d.toDateString() === now.toDateString()) return 'Oggi'
    if (d.toDateString() === yesterday.toDateString()) return 'Ieri'
    return d.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  const groups = groupByDate(messages)
  const firstName = profile?.first_name || 'Paziente'
  const dietitianName = dietitian?.full_name || 'Il tuo dietista'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'var(--surface-2)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))',
        padding: 'calc(env(safe-area-inset-top) + 14px) 20px 16px',
        display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 700, color: 'white', flexShrink: 0
        }}>
          {dietitianName[0]?.toUpperCase()}
        </div>
        <div>
          <p style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>{dietitianName}</p>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Dietista</p>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0', WebkitOverflowScrolling: 'touch' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            <div style={{ width: 24, height: 24, border: '3px solid var(--border)', borderTopColor: 'var(--green-main)', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 12px' }} />
            Caricamento messaggi…
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
            <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>Inizia la conversazione</p>
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>Puoi scrivere al tuo dietista per domande,<br />aggiornamenti o consigli.</p>
          </div>
        ) : (
          Object.entries(groups).map(([day, msgs]) => (
            <div key={day}>
              {/* Day divider */}
              <div style={{ textAlign: 'center', margin: '12px 0' }}>
                <span style={{ background: 'var(--border)', color: 'var(--text-muted)', fontSize: 11, padding: '4px 12px', borderRadius: 100, fontWeight: 500 }}>
                  {dayLabel(day)}
                </span>
              </div>
              {msgs.map((msg, i) => {
                const isPatient = msg.sender_role === 'patient'
                const showAvatar = !isPatient && (i === 0 || msgs[i - 1]?.sender_role !== msg.sender_role)
                return (
                  <div key={msg.id} style={{
                    display: 'flex',
                    justifyContent: isPatient ? 'flex-end' : 'flex-start',
                    marginBottom: 6, alignItems: 'flex-end', gap: 8
                  }}>
                    {!isPatient && (
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--green-main)', flexShrink: 0, visibility: showAvatar ? 'visible' : 'hidden' }}>
                        {dietitianName[0]}
                      </div>
                    )}
                    <div style={{
                      maxWidth: '72%',
                      background: isPatient
                        ? 'linear-gradient(135deg, var(--green-main), var(--green-mid))'
                        : 'white',
                      color: isPatient ? 'white' : 'var(--text-primary)',
                      padding: '10px 14px',
                      borderRadius: isPatient ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                      border: isPatient ? 'none' : '1px solid var(--border-light)'
                    }}>
                      <p style={{ fontSize: 14, lineHeight: 1.5, wordBreak: 'break-word' }}>{msg.content}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 4 }}>
                        <span style={{ fontSize: 10, opacity: 0.7 }}>{formatTime(msg.created_at)}</span>
                        {isPatient && (
                          msg.read_at
                            ? <CheckCheck size={12} style={{ opacity: 0.7 }} />
                            : <Check size={12} style={{ opacity: 0.5 }} />
                        )}
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

      {/* Input */}
      <div style={{
        padding: '12px 16px',
        paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
        background: 'white',
        borderTop: '1px solid var(--border-light)',
        flexShrink: 0
      }}>
        <form onSubmit={sendMessage} style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
          <div style={{ flex: 1, background: 'var(--surface-2)', borderRadius: 24, border: '1.5px solid var(--border)', padding: '10px 16px', display: 'flex', alignItems: 'center' }}>
            <textarea
              ref={inputRef}
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder="Scrivi un messaggio…"
              rows={1}
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-primary)',
                resize: 'none', maxHeight: 120, lineHeight: 1.5
              }}
            />
          </div>
          <button type="submit" disabled={!text.trim() || sending} style={{
            width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
            background: text.trim() ? 'var(--green-main)' : 'var(--border)',
            border: 'none', cursor: text.trim() ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s',
            boxShadow: text.trim() ? '0 2px 8px rgba(26,127,90,0.3)' : 'none'
          }}>
            <Send size={18} color="white" style={{ marginLeft: 2 }} />
          </button>
        </form>
      </div>
    </div>
  )
}
