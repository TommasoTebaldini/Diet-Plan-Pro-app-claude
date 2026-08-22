import { useState, useRef, useEffect } from 'react'
import { Bot, Send, Sparkles, ShieldCheck, Loader2, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useT } from '../i18n'
import { COACH_AI_ENABLED } from '../lib/coachAiConfig'

export default function CoachAiPage() {
  const t = useT()
  const { profile, recordCoachAiConsent } = useAuth()

  const welcomeMessage = {
    role: 'assistant',
    content: t('coachai.welcome', 'Ciao! Sono il tuo Coach AI — puoi farmi domande libere su alimentazione, abitudini, integrazione o gestione del peso. Non sostituisco il tuo dietista: per dubbi clinici specifici o sintomi, scrivigli direttamente in chat.'),
  }

  const SUGGESTIONS = [
    t('coachai.suggestion_proteine', 'Quante proteine mi servono al giorno?'),
    t('coachai.suggestion_frutta', 'Posso mangiare frutta la sera?'),
    t('coachai.suggestion_fame_nervosa', 'Come gestisco la fame nervosa?'),
    t('coachai.suggestion_pasti', 'Meglio 3 pasti grandi o 5 piccoli?'),
  ]

  const [messages, setMessages] = useState(() => [welcomeMessage])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [consenting, setConsenting] = useState(false)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, sending])

  async function handleAcceptConsent() {
    setConsenting(true)
    const { error: consentError } = await recordCoachAiConsent()
    setConsenting(false)
    if (consentError) setError(consentError.message || t('coachai.errore_consenso', 'Errore salvataggio consenso'))
  }

  async function send(overrideText) {
    const content = (overrideText ?? text).trim()
    if (!content || sending) return
    setError('')
    const nextMessages = [...messages, { role: 'user', content }]
    setMessages(nextMessages)
    setText('')
    setSending(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error(t('coachai.sessione_scaduta', 'Sessione scaduta — effettua di nuovo il login.'))

      const res = await fetch('/api/coach-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        // il messaggio di benvenuto è solo client-side, non va inviato al modello
        // (è sempre il primo elemento dell'array, aggiunto una sola volta al mount)
        body: JSON.stringify({ messages: nextMessages.slice(1) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)

      setMessages(m => [...m, { role: 'assistant', content: data.reply }])
    } catch (e) {
      setError(e.message || t('coachai.errore_connessione', 'Errore di connessione. Riprova.'))
    } finally {
      setSending(false)
    }
  }

  const canSend = text.trim().length > 0 && !sending

  if (!COACH_AI_ENABLED) {
    return (
      <div className="chat-fullscreen" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: 'linear-gradient(160deg, #4c1d95, #7c3aed)', padding: 'calc(env(safe-area-inset-top) + 16px) 16px 16px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Bot size={20} color="white" />
          </div>
          <p style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>{t('coachai.title', 'Coach AI')}</p>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Bot size={28} color="var(--text-muted)" />
          </div>
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{t('coachai.non_disponibile', 'Coach AI temporaneamente non disponibile')}</p>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)', maxWidth: 320, lineHeight: 1.6 }}>
            {t('coachai.non_disponibile_desc', 'Per domande su alimentazione, abitudini o dubbi specifici, scrivi direttamente al tuo dietista nella chat — ti risponderà lui.')}
          </p>
        </div>
      </div>
    )
  }

  if (!profile?.coach_ai_consent_at) {
    return (
      <div className="chat-fullscreen" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: 'linear-gradient(160deg, #4c1d95, #7c3aed)', padding: 'calc(env(safe-area-inset-top) + 16px) 16px 16px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Bot size={20} color="white" />
          </div>
          <p style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>{t('coachai.title', 'Coach AI')}</p>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={20} color="#7c3aed" />
            </div>
            <p style={{ fontSize: 14, fontWeight: 700 }}>{t('coachai.prima_di_iniziare', 'Prima di iniziare')}</p>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
            {t('coachai.consent_intro_pre', 'Il Coach AI usa un modello di intelligenza artificiale di terze parti (Groq) per risponderti — non è il tuo dietista e non lo sostituisce. Le conversazioni vengono ')}
            <strong>{t('coachai.consent_intro_strong', 'salvate e visibili al tuo dietista')}</strong>
            {t('coachai.consent_intro_post', ', così può intervenire se serve, esattamente come per la chat normale.')}
          </p>
          <ul style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.7, margin: '0 0 20px', paddingLeft: 18 }}>
            <li>{t('coachai.consent_li1', 'È una funzione facoltativa: per qualunque dubbio puoi sempre scrivere direttamente al tuo dietista.')}</li>
            <li>{t('coachai.consent_li2', 'Non fa diagnosi e non prescrive piani alimentari o target calorici precisi.')}</li>
            <li>
              {t('coachai.consent_li3_pre', "Puoi leggere i dettagli completi nell'")}
              <a href="/privacy" target="_blank" style={{ color: '#7c3aed', fontWeight: 600 }}>{t('coachai.privacy_link', 'Informativa Privacy')}</a>
              {t('coachai.consent_li3_post', '.')}
            </li>
          </ul>
          {error && <div className="alert-error" style={{ marginBottom: 12, fontSize: 12.5 }}>{error}</div>}
          <button
            onClick={handleAcceptConsent}
            disabled={consenting}
            className="btn"
            style={{ width: '100%', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white', borderRadius: 14, padding: '13px 20px', fontSize: 14, fontWeight: 600, border: 'none', cursor: consenting ? 'default' : 'pointer', opacity: consenting ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            {consenting ? <Loader2 size={15} className="spin" /> : <Check size={15} />} {t('coachai.accetto_continua', 'Accetto, continua')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-fullscreen">
      <div style={{ background: 'linear-gradient(160deg, #4c1d95, #7c3aed)', padding: 'calc(env(safe-area-inset-top) + 16px) 16px 16px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Bot size={20} color="white" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>{t('coachai.title', 'Coach AI')}</p>
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Sparkles size={11} /> {t('coachai.tagline', 'Assistente nutrizionale — non sostituisce il tuo dietista')}
          </p>
        </div>
      </div>

      <div ref={scrollRef} className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 0', WebkitOverflowScrolling: 'touch' }}>
        {messages.map((msg, i) => {
          const isMe = msg.role === 'user'
          return (
            <div key={i} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
              <div style={{
                maxWidth: '82%', background: isMe ? 'linear-gradient(135deg, var(--green-main), var(--green-mid))' : 'var(--surface-3)',
                color: isMe ? 'white' : 'var(--text-primary)', padding: '9px 14px',
                borderRadius: isMe ? '16px 16px 3px 16px' : '16px 16px 16px 3px',
                border: isMe ? 'none' : '1px solid var(--border-light)',
              }}>
                {!isMe && (
                  <p style={{ fontSize: 11, fontWeight: 700, marginBottom: 3, color: '#7C3AED', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Bot size={12} /> {t('coachai.title', 'Coach AI')}
                  </p>
                )}
                <p style={{ fontSize: 14, lineHeight: 1.55, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{msg.content}</p>
              </div>
            </div>
          )
        })}

        {sending && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10 }}>
            <div style={{ background: 'var(--surface-3)', border: '1px solid var(--border-light)', padding: '10px 14px', borderRadius: '16px 16px 16px 3px', display: 'flex', gap: 4 }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED', opacity: 0.5, animation: `coachDot 1.2s ${i * 0.15}s infinite` }} />
              ))}
            </div>
          </div>
        )}

        {messages.length === 1 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 4, marginBottom: 10 }}>
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => send(s)}
                disabled={sending}
                style={{ padding: '7px 12px', borderRadius: 100, border: '1.5px solid #DDD6FE', background: '#F5F3FF', color: '#6D28D9', fontSize: 12.5, fontWeight: 600, cursor: sending ? 'default' : 'pointer' }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {error && (
          <p style={{ textAlign: 'center', color: 'var(--red)', fontSize: 12.5, margin: '4px 0 10px' }}>{error}</p>
        )}
      </div>

      <div className="chat-input-bar" style={{ position: 'fixed', bottom: 'calc(64px + env(safe-area-inset-bottom))', left: 0, right: 0, padding: '8px 10px', background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--border-light)', zIndex: 50 }}>
        <form onSubmit={e => { e.preventDefault(); send() }} style={{ display: 'flex', alignItems: 'flex-end', gap: 7 }}>
          <div style={{ flex: 1, background: 'var(--surface-2)', borderRadius: 22, border: '1.5px solid var(--border)', padding: '9px 14px' }}>
            <textarea
              ref={inputRef} value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder={t('coachai.placeholder', 'Fai una domanda al Coach AI…')} rows={1}
              style={{ width: '100%', background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--font-b)', fontSize: 15, color: 'var(--text-primary)', resize: 'none', maxHeight: 100, lineHeight: 1.5 }}
            />
          </div>
          <button
            type="submit"
            disabled={!canSend}
            aria-label={t('coachai.invia_messaggio', 'Invia messaggio')}
            style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0, background: canSend ? '#7C3AED' : 'var(--border)', border: 'none', cursor: canSend ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Send size={17} color="white" style={{ marginLeft: 2 }} />
          </button>
        </form>
      </div>

      <style>{`
        @keyframes coachDot { 0%, 60%, 100% { opacity: 0.3; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-3px); } }
      `}</style>
    </div>
  )
}
