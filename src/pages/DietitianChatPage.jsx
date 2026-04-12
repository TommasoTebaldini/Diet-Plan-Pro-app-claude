import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Send, CheckCheck, Check, MessageCircle, LogOut, Users, ArrowLeft } from 'lucide-react'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function patientDisplayName(profile) {
  const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
  return name || profile.email || 'Paziente'
}

function avatarInitials(profile) {
  const name = patientDisplayName(profile)
  const parts = name.split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

function formatTime(ts) {
  const d = new Date(ts)
  const now = new Date()
  if (d.toDateString() === now.toDateString())
    return d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })
}

function dayLabel(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  const y = new Date(now); y.setDate(now.getDate() - 1)
  if (d.toDateString() === now.toDateString()) return 'Oggi'
  if (d.toDateString() === y.toDateString()) return 'Ieri'
  return d.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })
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

// ─── PatientList sidebar ──────────────────────────────────────────────────────

function PatientList({ patients, loading, selected, onSelect, onSignOut }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'white' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))',
        padding: 'calc(env(safe-area-inset-top) + 16px) 16px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Users size={20} color="white" />
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'white', fontWeight: 400 }}>
              Chat Pazienti
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11 }}>Vista dietista</p>
          </div>
        </div>
        <button onClick={onSignOut} style={{
          background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10,
          padding: '7px 10px', cursor: 'pointer', color: 'white',
          display: 'flex', alignItems: 'center', gap: 5, fontSize: 12,
        }}>
          <LogOut size={14} /> Esci
        </button>
      </div>

      {/* Patient list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ width: 24, height: 24, border: '3px solid var(--border)', borderTopColor: 'var(--green-main)', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 10px' }} />
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Caricamento…</p>
          </div>
        ) : patients.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 24px' }}>
            <MessageCircle size={40} color="var(--border)" style={{ marginBottom: 12 }} />
            <p style={{ fontSize: 14, fontWeight: 500 }}>Nessun paziente collegato</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.6, maxWidth: 280 }}>
              Collega i pazienti dal tuo pannello di gestione per avviare le chat.
            </p>
          </div>
        ) : patients.map(p => {
          const name = patientDisplayName(p.profile)
          const isActive = p.id === selected
          return (
            <button key={p.id} onClick={() => onSelect(p.id)} style={{
              width: '100%', background: isActive ? 'var(--green-pale)' : 'white',
              border: 'none', borderBottom: '1px solid var(--border-light)',
              padding: '13px 16px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
              transition: 'background 0.12s',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                background: isActive ? 'var(--green-main)' : 'var(--green-pale)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700,
                color: isActive ? 'white' : 'var(--green-main)',
              }}>
                {avatarInitials(p.profile)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6, marginBottom: 2 }}>
                  <p style={{
                    fontSize: 14, fontWeight: p.unread > 0 ? 700 : 500,
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {name}
                  </p>
                  {p.lastMsg && (
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', flexShrink: 0 }}>
                      {formatTime(p.lastMsg.created_at)}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    {p.lastMsg
                      ? (p.lastMsg.sender_role === 'dietitian' ? 'Tu: ' : '') + p.lastMsg.content
                      : 'Nessun messaggio'}
                  </p>
                  {p.unread > 0 && (
                    <span style={{
                      background: 'var(--green-main)', color: 'white',
                      fontSize: 10, fontWeight: 700,
                      minWidth: 18, height: 18, borderRadius: 9, padding: '0 3px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {p.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Chat view ────────────────────────────────────────────────────────────────

function ChatView({ currentPatient, messages, text, setText, sending, bottomRef, inputRef, onSend, onBack }) {
  const groups = groupByDate(messages)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface-2)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))',
        padding: 'calc(env(safe-area-inset-top) + 14px) 16px 14px',
        display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
      }}>
        <button onClick={onBack} className="dietitian-back-btn" style={{
          background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10,
          width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'white', flexShrink: 0,
        }} aria-label="Torna alla lista">
          <ArrowLeft size={18} />
        </button>
        {currentPatient ? (
          <>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'white', flexShrink: 0, border: '2px solid rgba(255,255,255,0.3)' }}>
              {avatarInitials(currentPatient.profile)}
            </div>
            <div>
              <p style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>
                {patientDisplayName(currentPatient.profile)}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11 }}>Paziente</p>
            </div>
          </>
        ) : (
          <p style={{ color: 'white', fontSize: 15 }}>Seleziona un paziente</p>
        )}
      </div>

      {!currentPatient ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center' }}>
          <MessageCircle size={48} color="var(--border)" style={{ marginBottom: 14 }} />
          <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-muted)' }}>Seleziona un paziente</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.6, maxWidth: 260 }}>
            Clicca su un paziente nella lista per leggere e rispondere ai messaggi.
          </p>
        </div>
      ) : (
        <>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px 0', WebkitOverflowScrolling: 'touch' }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px' }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>💬</div>
                <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>Nessun messaggio</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Inizia la conversazione con {patientDisplayName(currentPatient.profile)}.
                </p>
              </div>
            ) : (
              Object.entries(groups).map(([day, msgs]) => (
                <div key={day}>
                  <div style={{ textAlign: 'center', margin: '10px 0' }}>
                    <span style={{ background: 'var(--border)', color: 'var(--text-muted)', fontSize: 11, padding: '3px 10px', borderRadius: 100 }}>
                      {dayLabel(day)}
                    </span>
                  </div>
                  {msgs.map((msg, i) => {
                    const isMe = msg.sender_role === 'dietitian'
                    const showAvatar = !isMe && (i === 0 || msgs[i - 1]?.sender_role !== msg.sender_role)
                    return (
                      <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: 5, alignItems: 'flex-end', gap: 6 }}>
                        {!isMe && (
                          <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--green-main)', flexShrink: 0, visibility: showAvatar ? 'visible' : 'hidden' }}>
                            {avatarInitials(currentPatient.profile)[0]}
                          </div>
                        )}
                        <div style={{ maxWidth: '75%', background: isMe ? 'linear-gradient(135deg, var(--green-main), var(--green-mid))' : 'white', color: isMe ? 'white' : 'var(--text-primary)', padding: '9px 13px', borderRadius: isMe ? '16px 16px 3px 16px' : '16px 16px 16px 3px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', border: isMe ? 'none' : '1px solid var(--border-light)' }}>
                          <p style={{ fontSize: 14, lineHeight: 1.5, wordBreak: 'break-word' }}>{msg.content}</p>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3, marginTop: 3 }}>
                            <span style={{ fontSize: 10, opacity: 0.65 }}>{formatTime(msg.created_at)}</span>
                            {isMe && (msg.read_at
                              ? <CheckCheck size={11} style={{ opacity: 0.7 }} />
                              : <Check size={11} style={{ opacity: 0.4 }} />
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
          <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--border-light)', paddingBottom: 'calc(10px + env(safe-area-inset-bottom))' }}>
            <form onSubmit={onSend} style={{ display: 'flex', alignItems: 'flex-end', gap: 9 }}>
              <div style={{ flex: 1, background: 'var(--surface-2)', borderRadius: 22, border: '1.5px solid var(--border)', padding: '9px 14px', display: 'flex', alignItems: 'center' }}>
                <textarea
                  ref={inputRef} value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(e) } }}
                  placeholder="Scrivi un messaggio…" rows={1}
                  style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-primary)', resize: 'none', maxHeight: 100, lineHeight: 1.5 }}
                />
              </div>
              <button type="submit" disabled={!text.trim() || sending} style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0, background: text.trim() ? 'var(--green-main)' : 'var(--border)', border: 'none', cursor: text.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s', boxShadow: text.trim() ? '0 2px 8px rgba(26,127,90,0.3)' : 'none' }}>
                <Send size={17} color="white" style={{ marginLeft: 2 }} />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DietitianChatPage() {
  const { user, signOut } = useAuth()
  const [patients, setPatients] = useState([])
  const [selected, setSelected] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loadingList, setLoadingList] = useState(true)
  const [sending, setSending] = useState(false)
  const [mobilePanel, setMobilePanel] = useState('list')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  // ── Load patient list ────────────────────────────────────────────────────
  useEffect(() => {
    loadPatients()
    const channel = supabase.channel('dietitian-list-updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        () => loadPatients())
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [user.id])

  async function loadPatients() {
    const { data: links } = await supabase
      .from('patient_dietitian')
      .select('patient_id')
      .eq('dietitian_id', user.id)

    if (!links || links.length === 0) {
      setPatients([])
      setLoadingList(false)
      return
    }

    const ids = links.map(l => l.patient_id)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email')
      .in('id', ids)

    const enriched = await Promise.all((profiles ?? []).map(async profile => {
      const { data: last } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('patient_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(1)
      const { count: unread } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('patient_id', profile.id)
        .eq('sender_role', 'patient')
        .is('read_at', null)
      return { id: profile.id, profile, lastMsg: last?.[0] ?? null, unread: unread ?? 0 }
    }))

    enriched.sort((a, b) => {
      if (b.unread !== a.unread) return b.unread - a.unread
      return (b.lastMsg?.created_at ?? '').localeCompare(a.lastMsg?.created_at ?? '')
    })

    setPatients(enriched)
    setLoadingList(false)
  }

  // ── Load messages for selected patient ───────────────────────────────────
  useEffect(() => {
    if (!selected) return
    loadMessages(selected)
    const channel = supabase.channel(`dietitian-msgs-${selected}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'chat_messages',
        filter: `patient_id=eq.${selected}`,
      }, payload => {
        setMessages(prev =>
          prev.find(m => m.id === payload.new.id) ? prev : [...prev, payload.new]
        )
        if (payload.new.sender_role === 'patient') markAsRead([payload.new.id])
        loadPatients()
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [selected])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function loadMessages(patientId) {
    const { data: msgs } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: true })
    setMessages(msgs ?? [])
    const unread = (msgs ?? []).filter(m => m.sender_role === 'patient' && !m.read_at)
    if (unread.length) markAsRead(unread.map(m => m.id))
  }

  async function markAsRead(ids) {
    if (!ids.length) return
    await supabase.from('chat_messages').update({ read_at: new Date().toISOString() }).in('id', ids)
    setPatients(prev => prev.map(p => p.id === selected ? { ...p, unread: 0 } : p))
  }

  function openChat(patientId) {
    setSelected(patientId)
    setMessages([])
    setMobilePanel('chat')
  }

  async function sendMessage(e) {
    e?.preventDefault()
    const content = text.trim()
    if (!content || sending || !selected) return
    setSending(true)
    setText('')
    const optimistic = {
      id: `opt_${Date.now()}`, patient_id: selected,
      sender_role: 'dietitian', sender_id: user.id,
      content, created_at: new Date().toISOString(), read_at: null,
    }
    setMessages(prev => [...prev, optimistic])
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({ patient_id: selected, sender_role: 'dietitian', sender_id: user.id, content })
      .select().single()
    if (data) {
      setMessages(prev => prev.map(m => m.id === optimistic.id ? data : m))
      loadPatients()
    } else if (error) {
      setMessages(prev => prev.filter(m => m.id !== optimistic.id))
      setText(content)
    }
    setSending(false)
    inputRef.current?.focus()
  }

  const currentPatient = patients.find(p => p.id === selected) ?? null

  const listProps = { patients, loading: loadingList, selected, onSelect: openChat, onSignOut: signOut }
  const chatProps = { currentPatient, messages, text, setText, sending, bottomRef, inputRef, onSend: sendMessage, onBack: () => setMobilePanel('list') }

  return (
    <>
      <style>{`
        .dietitian-page { display: flex; height: 100dvh; overflow: hidden; }
        .dietitian-sidebar { width: 320px; flex-shrink: 0; border-right: 1px solid var(--border-light); }
        .dietitian-chat-area { flex: 1; min-width: 0; }
        .dietitian-mobile { display: none; }
        @media (max-width: 639px) {
          .dietitian-page { display: none; }
          .dietitian-mobile { display: flex; flex-direction: column; height: 100dvh; }
          .dietitian-back-btn { display: flex !important; }
        }
        @media (min-width: 640px) {
          .dietitian-back-btn { display: none !important; }
        }
      `}</style>

      {/* Desktop: side-by-side */}
      <div className="dietitian-page">
        <div className="dietitian-sidebar">
          <PatientList {...listProps} />
        </div>
        <div className="dietitian-chat-area">
          <ChatView {...chatProps} />
        </div>
      </div>

      {/* Mobile: one panel at a time */}
      <div className="dietitian-mobile">
        {mobilePanel === 'list'
          ? <PatientList {...listProps} />
          : <ChatView {...chatProps} />
        }
      </div>
    </>
  )
}
