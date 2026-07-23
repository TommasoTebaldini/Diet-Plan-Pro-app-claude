import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useT } from '../i18n'
import {
  Send, CheckCheck, Check, MessageCircle,
  ImagePlus, Mic, MicOff, X, Play, Pause, Bell, BellOff,
  FileText, PenLine, AlertTriangle, ArrowLeft, Video
} from 'lucide-react'
import VideoCallModal from '../components/VideoCallModal'
import { callRoomName } from '../lib/videoCall'

// ── Default GDPR privacy document (shown when doc.content is absent) ─────────
const PRIVACY_DEFAULT = `MODULO DI CONSENSO INFORMATO AL TRATTAMENTO DEI DATI PERSONALI
ai sensi del Regolamento UE 2016/679 (GDPR) e del D.Lgs. 196/2003 e ss.mm.ii.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TITOLARE DEL TRATTAMENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Il titolare del trattamento è il Professionista della Nutrizione che ha attivato il Suo account su questa piattaforma. I suoi dati di contatto sono indicati nel profilo del professionista all'interno dell'applicazione.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. FINALITÀ E BASE GIURIDICA DEL TRATTAMENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
I dati personali, inclusi i dati relativi alla salute (categorie particolari ai sensi dell'art. 9 GDPR), vengono trattati per le seguenti finalità:

a) Gestione della cartella nutrizionale e clinica del paziente
b) Elaborazione e aggiornamento di piani alimentari personalizzati
c) Monitoraggio dell'andamento nutrizionale, del peso corporeo e del benessere generale
d) Comunicazioni relative agli appuntamenti e al percorso terapeutico-nutrizionale
e) Archiviazione di documenti clinici, referti e prescrizioni
f) Adempimento degli obblighi di legge in materia sanitaria e professionale

La base giuridica del trattamento è:
- Il consenso esplicito dell'interessato (art. 6, par. 1, lett. a e art. 9, par. 2, lett. a GDPR)
- L'esecuzione del contratto di prestazione professionale (art. 6, par. 1, lett. b GDPR)
- Il rispetto di obblighi legali (art. 6, par. 1, lett. c GDPR)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. CATEGORIE DI DATI TRATTATI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Vengono trattati i seguenti dati personali:

▸ Dati anagrafici e di contatto: nome, cognome, data di nascita, codice fiscale, indirizzo, numero di telefono, indirizzo e-mail
▸ Dati antropometrici: peso attuale e storico, altezza, indice di massa corporea (BMI), composizione corporea
▸ Dati sanitari: patologie diagnosticate, farmaci assunti, intolleranze e allergie alimentari, esami del sangue e referti forniti volontariamente, anamnesi alimentare
▸ Dati relativi alle abitudini di vita: attività fisica svolta, abitudini alimentari, preferenze e restrizioni dietetiche
▸ Fotografie corporee, se concordato espressamente con il professionista
▸ Dati di utilizzo dell'applicazione NutriPlan (accessi, alimenti registrati, obiettivi)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. MODALITÀ DI TRATTAMENTO E SICUREZZA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
I dati sono trattati con strumenti elettronici e/o cartacei, con misure di sicurezza tecniche e organizzative adeguate a prevenire accessi non autorizzati, perdita, distruzione o divulgazione non consentita. La piattaforma NutriPlan utilizza connessioni cifrate (TLS/SSL), autenticazione sicura e infrastrutture cloud conformi al GDPR.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. PERIODO DI CONSERVAZIONE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
I dati vengono conservati per il periodo strettamente necessario al raggiungimento delle finalità per cui sono stati raccolti, e comunque:
- Per tutta la durata del rapporto professionale
- Per un massimo di 10 anni dalla cessazione del rapporto, salvo obblighi di legge che prevedano conservazione più lunga
- Per tutta la durata prevista dalla normativa fiscale e contabile applicabile

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. COMUNICAZIONE E CONDIVISIONE DEI DATI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
I dati personali non vengono diffusi a terzi. Possono essere comunicati esclusivamente a:
▸ Medici curanti e altri specialisti sanitari, previo esplicito consenso dell'interessato
▸ Personale amministrativo dello studio, nei limiti strettamente necessari
▸ Fornitori di servizi tecnologici (infrastruttura cloud, applicativi software) vincolati da accordi di riservatezza conformi al GDPR
▸ Autorità pubbliche, nei casi previsti dalla legge

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. TRASFERIMENTO DATI ALL'ESTERO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
I dati potrebbero essere trattati da fornitori di servizi cloud ubicati in Paesi dell'Unione Europea o in Paesi terzi che garantiscono un livello di protezione adeguato ai sensi degli artt. 44-49 GDPR, come gli USA nell'ambito del Data Privacy Framework.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7. DIRITTI DELL'INTERESSATO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
In qualsiasi momento Lei potrà esercitare i seguenti diritti (artt. 15–22 GDPR), inviando richiesta scritta al Titolare del trattamento:

▸ Diritto di accesso (art. 15): ottenere conferma che i Suoi dati siano trattati e riceverne copia
▸ Diritto di rettifica (art. 16): correggere dati inesatti o incompleti
▸ Diritto alla cancellazione / "diritto all'oblio" (art. 17): chiedere la cancellazione dei dati quando non più necessari
▸ Diritto alla limitazione del trattamento (art. 18): ottenere la sospensione temporanea del trattamento
▸ Diritto alla portabilità dei dati (art. 20): ricevere i Suoi dati in formato strutturato e leggibile da dispositivo automatico
▸ Diritto di opposizione (art. 21): opporsi al trattamento in qualsiasi momento
▸ Diritto di revocare il consenso (art. 7, par. 3): la revoca non pregiudica la liceità del trattamento effettuato prima della stessa

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
8. RECLAMO AL GARANTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Lei ha il diritto di proporre reclamo al Garante per la Protezione dei Dati Personali qualora ritenga che il trattamento dei Suoi dati personali sia effettuato in violazione del GDPR.
Sito ufficiale: www.garanteprivacy.it
Indirizzo: Piazza Venezia 11, 00187 Roma
E-mail: garante@gpdp.it

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DICHIARAZIONE DI CONSENSO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Il/La sottoscritto/a dichiara di aver letto integralmente la presente informativa, di averla compresa in ogni sua parte e di prestare il proprio consenso libero, specifico, informato e inequivocabile al trattamento dei propri dati personali, inclusi quelli relativi allo stato di salute, per le finalità sopra indicate.

Data: ${new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })}`

// ── Helpers ────────────────────────────────────────────────────────────────

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

function formatDuration(sec) {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function lastSeenLabel(ts) {
  if (!ts) return null
  const diff = Date.now() - new Date(ts).getTime()
  if (diff < 5 * 60 * 1000) return null // is online
  if (diff < 60 * 60 * 1000) return `visto ${Math.floor(diff / 60000)} min fa`
  if (diff < 24 * 60 * 60 * 1000)
    return 'visto ' + new Date(ts).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
  return 'visto ' + new Date(ts).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })
}

// ── AudioPlayer ─────────────────────────────────────────────────────────────

function AudioPlayer({ src, isMe }) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)

  function toggle() {
    const a = audioRef.current
    if (!a) return
    if (playing) { a.pause() } else { a.play() }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 160 }}>
      <audio
        ref={audioRef} src={src} preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setProgress(0) }}
        onLoadedMetadata={e => setDuration(e.target.duration || 0)}
        onTimeUpdate={e => setProgress(e.target.currentTime / (e.target.duration || 1))}
      />
      <button
        onClick={toggle}
        style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', cursor: 'pointer', background: isMe ? 'rgba(255,255,255,0.25)' : 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
      >
        {playing
          ? <Pause size={14} color={isMe ? 'white' : 'var(--green-main)'} />
          : <Play size={14} color={isMe ? 'white' : 'var(--green-main)'} style={{ marginLeft: 1 }} />}
      </button>
      <div style={{ flex: 1 }}>
        <div style={{ height: 3, borderRadius: 2, background: isMe ? 'rgba(255,255,255,0.3)' : 'var(--border)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress * 100}%`, background: isMe ? 'white' : 'var(--green-main)', borderRadius: 2, transition: 'width 0.1s' }} />
        </div>
        <span style={{ fontSize: 10, opacity: 0.7, marginTop: 2, display: 'block' }}>
          {duration > 0 ? formatDuration(duration) : '–'}
        </span>
      </div>
    </div>
  )
}

// ── Signature Modal ──────────────────────────────────────────────────────────

function SignatureModal({ doc, onClose, onSigned }) {
  const canvasRef = useRef(null)
  const [drawing, setDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [signing, setSigning] = useState(false)
  const [mode, setMode] = useState('canvas') // 'canvas' | 'typed'
  const [typedName, setTypedName] = useState('')
  const lastPos = useRef(null)

  function getPos(e, canvas) {
    const rect = canvas.getBoundingClientRect()
    const src = e.touches ? e.touches[0] : e
    return { x: src.clientX - rect.left, y: src.clientY - rect.top }
  }

  function startDraw(e) {
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    setDrawing(true)
    lastPos.current = getPos(e, canvas)
  }

  function draw(e) {
    e.preventDefault()
    if (!drawing) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const pos = getPos(e, canvas)
    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = '#1a2e1a'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
    lastPos.current = pos
    setHasSignature(true)
  }

  function endDraw(e) {
    e.preventDefault()
    setDrawing(false)
    lastPos.current = null
  }

  function clearCanvas() {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
  }

  function applyTypedSignature() {
    if (!typedName.trim()) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.font = 'italic 32px Georgia, serif'
    ctx.fillStyle = '#1a2e1a'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(typedName.trim(), canvas.width / 2, canvas.height / 2)
    setHasSignature(true)
  }

  async function submitSignature() {
    if (!hasSignature) return
    setSigning(true)
    const canvas = canvasRef.current
    const signatureData = canvas.toDataURL('image/png')
    const { error } = await supabase.from('patient_documents').update({
      signed_at: new Date().toISOString(),
      signature_data: signatureData,
    }).eq('id', doc.id)
    setSigning(false)
    if (!error) onSigned(doc.id)
  }

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div className="animate-slideUp" style={{ background: 'var(--surface)', borderRadius: '20px 20px 0 0', maxHeight: '92dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid var(--border-light)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fff3cd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={18} color="#856404" />
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700 }}>Firma documento</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{doc.title || 'Informativa privacy'}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'var(--surface-2)', border: 'none', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>

        {/* Document content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px' }}>
          <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: '14px 16px', marginBottom: 16, fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.75, border: '1px solid var(--border-light)', whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono, monospace)', letterSpacing: '0.01em' }}>
            {doc.content && doc.content.trim().length > 30 ? doc.content : PRIVACY_DEFAULT}
          </div>

          {/* Mode toggle */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {[{ key: 'canvas', label: '✍️ Firma manuale' }, { key: 'typed', label: '⌨️ Firma con nome' }].map(t => (
              <button key={t.key} onClick={() => { setMode(t.key); clearCanvas(); setHasSignature(false) }}
                style={{ flex: 1, padding: '9px 6px', borderRadius: 10, fontSize: 13, fontWeight: 500, border: `1.5px solid ${mode === t.key ? 'var(--green-main)' : 'var(--border)'}`, background: mode === t.key ? 'var(--green-pale)' : 'var(--surface-2)', color: mode === t.key ? 'var(--green-dark)' : 'var(--text-secondary)', cursor: 'pointer' }}>
                {t.label}
              </button>
            ))}
          </div>

          {mode === 'typed' && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input
                type="text"
                className="input-field"
                placeholder="Il tuo nome e cognome"
                value={typedName}
                onChange={e => setTypedName(e.target.value)}
                style={{ flex: 1 }}
              />
              <button onClick={applyTypedSignature} disabled={!typedName.trim()}
                style={{ padding: '0 16px', background: 'var(--green-main)', color: 'white', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: typedName.trim() ? 1 : 0.5 }}>
                Applica
              </button>
            </div>
          )}

          {/* Canvas */}
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
              {mode === 'canvas' ? 'Disegna la tua firma qui sotto:' : 'Anteprima firma:'}
            </p>
            <canvas
              ref={canvasRef}
              width={340}
              height={120}
              onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
              onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
              style={{ width: '100%', height: 120, border: '2px dashed var(--border)', borderRadius: 12, background: '#fafafa', touchAction: 'none', cursor: mode === 'canvas' ? 'crosshair' : 'default', display: 'block' }}
            />
            {hasSignature && (
              <button onClick={clearCanvas} style={{ position: 'absolute', top: 28, right: 8, background: 'rgba(255,255,255,0.9)', border: '1px solid var(--border)', borderRadius: 8, padding: '3px 10px', fontSize: 11, color: 'var(--text-muted)', cursor: 'pointer' }}>
                Cancella
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-light)', paddingBottom: 'calc(12px + env(safe-area-inset-bottom))', flexShrink: 0 }}>
          <button
            onClick={submitSignature}
            disabled={!hasSignature || signing}
            className="btn btn-primary btn-full"
            style={{ opacity: hasSignature && !signing ? 1 : 0.5 }}
          >
            {signing ? 'Salvataggio…' : '✅ Firma e conferma'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ── Chat list (dietitian thread + group threads) ──────────────────────────────

function profileLabel(p) {
  return p.full_name || `${p.nome || ''} ${p.cognome || ''}`.trim() || p.email || 'Utente'
}

function ChatListView({ dietitianName, dietitianOnline, dietitianPreview, dietitianUnread, notLinked, groups, onOpenDietitian, onOpenGroup }) {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--surface-2)' }}>
      <div style={{ background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))', padding: 'calc(env(safe-area-inset-top) + 16px) 20px 20px', flexShrink: 0 }}>
        <h1 style={{ fontFamily: 'var(--font-d)', fontSize: 22, color: 'white', fontWeight: 300 }}>Chat</h1>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px calc(90px + env(safe-area-inset-bottom))' }}>
        {!notLinked && (
          <div onClick={onOpenDietitian} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 10px', borderRadius: 14, cursor: 'pointer', background: 'var(--surface)', marginBottom: 8, border: '1px solid var(--border-light)' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 700, color: 'var(--green-main)' }}>
                {dietitianName?.[0]?.toUpperCase() || 'D'}
              </div>
              {dietitianOnline && <span style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: '#4ade80', border: '2px solid var(--surface)' }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14.5, fontWeight: 600 }}>{dietitianName}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dietitianPreview || 'Il tuo dietista'}</p>
            </div>
            {dietitianUnread && <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--red)', flexShrink: 0 }} />}
          </div>
        )}
        {groups.map(g => (
          <div key={g.id} onClick={() => onOpenGroup(g)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 10px', borderRadius: 14, cursor: 'pointer', background: 'var(--surface)', marginBottom: 8, border: '1px solid var(--border-light)' }}>
            <div style={{ width: 46, height: 46, borderRadius: '50%', background: g.color || '#0F766E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>👥</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14.5, fontWeight: 600 }}>{g.name}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.lastMsg ? (g.lastMsg.type === 'voice' ? '🎤 Messaggio vocale' : g.lastMsg.content) : 'Nessun messaggio'}</p>
            </div>
            {g.unread && <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--red)', flexShrink: 0 }} />}
          </div>
        ))}
        {notLinked && groups.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: 13.5 }}>Nessuna chat disponibile.</div>
        )}
      </div>
    </div>
  )
}

function GroupThreadView({ group, user, onBack }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [memberProfiles, setMemberProfiles] = useState({})
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const messagesContainerRef = useRef(null)
  const inputRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const recordingTimerRef = useRef(null)
  const recordingSecondsRef = useRef(0)

  useEffect(() => {
    let cancelled = false
    let channel

    async function load() {
      const [{ data: members }, { data: msgs }] = await Promise.all([
        supabase.from('chat_group_members').select('user_id,member_role').eq('group_id', group.id),
        supabase.from('chat_group_messages').select('*').eq('group_id', group.id).order('created_at', { ascending: true }).limit(200),
      ])
      if (cancelled) return
      const ids = (members || []).map(m => m.user_id)
      if (ids.length) {
        const { data: profiles } = await supabase.from('profiles').select('id,nome,cognome,full_name,email,role').in('id', ids)
        const map = {}
        ;(profiles || []).forEach(p => { map[p.id] = { name: profileLabel(p), role: p.role } })
        if (!cancelled) setMemberProfiles(map)
      }
      if (!cancelled) {
        setMessages(msgs || [])
        setLoading(false)
      }
      await supabase.from('chat_group_members').update({ last_read_at: new Date().toISOString() }).eq('group_id', group.id).eq('user_id', user.id)
    }
    load()

    channel = supabase.channel(`group-${group.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_group_messages', filter: `group_id=eq.${group.id}` }, payload => {
        if (payload.new.status !== 'sent') return // proprio messaggio programmato di un altro membro: non ancora visibile
        setMessages(prev => prev.find(m => m.id === payload.new.id) ? prev : [...prev, payload.new].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)))
        if (payload.new.sender_id !== user.id) {
          supabase.from('chat_group_members').update({ last_read_at: new Date().toISOString() }).eq('group_id', group.id).eq('user_id', user.id)
        }
      })
      // Un messaggio programmato diventa visibile via UPDATE (scheduled -> sent),
      // non via INSERT, per chi non l'ha inviato (vedi RLS su chat_group_messages).
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chat_group_messages', filter: `group_id=eq.${group.id}` }, payload => {
        const msg = payload.new
        let wasNew = false
        setMessages(prev => {
          const exists = prev.some(m => m.id === msg.id)
          wasNew = !exists
          const next = exists ? prev.map(m => m.id === msg.id ? msg : m) : [...prev, msg]
          return next.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        })
        if (wasNew && msg.sender_id !== user.id) {
          supabase.from('chat_group_members').update({ last_read_at: new Date().toISOString() }).eq('group_id', group.id).eq('user_id', user.id)
        }
      })
      .subscribe()

    return () => {
      cancelled = true
      if (channel) supabase.removeChannel(channel)
      clearInterval(recordingTimerRef.current)
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.ondataavailable = null
        mediaRecorderRef.current.onstop = () => { mediaRecorderRef.current.stream?.getTracks().forEach(t => t.stop()) }
        mediaRecorderRef.current.stop()
      }
    }
  }, [group.id, user.id])

  useEffect(() => {
    const el = messagesContainerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  async function sendMessage(e) {
    e?.preventDefault()
    const content = text.trim()
    if (!content || sending) return
    setSending(true)
    setText('')
    const optimistic = { id: `opt_${Date.now()}`, group_id: group.id, sender_id: user.id, content, type: 'text', status: 'sent', created_at: new Date().toISOString() }
    setMessages(prev => [...prev, optimistic])
    const { data, error } = await supabase.from('chat_group_messages').insert({ group_id: group.id, sender_id: user.id, content, type: 'text', status: 'sent' }).select().single()
    if (data) {
      setMessages(prev => prev.map(m => m.id === optimistic.id ? data : m))
    } else if (error) {
      setMessages(prev => prev.filter(m => m.id !== optimistic.id))
      setText(content)
    }
    setSending(false)
    inputRef.current?.focus()
  }

  // ── Voice recording ─────────────────────────────────────────────────────
  async function startRecording() {
    if (isRecording) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg'
      const recorder = new MediaRecorder(stream, { mimeType })
      audioChunksRef.current = []
      recorder.ondataavailable = e => { if (e.data.size > 0) audioChunksRef.current.push(e.data) }
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        const blob = new Blob(audioChunksRef.current, { type: mimeType })
        // recorder.onstop is assigned once here and never recreated, so closing
        // over the recordingDuration state variable directly always reads its
        // value from this exact moment (effectively stuck at 0) — read the ref
        // the interval below keeps live instead.
        const dur = recordingSecondsRef.current
        setIsRecording(false)
        setRecordingDuration(0)
        if (blob.size >= 100) await sendAudio(blob, dur, mimeType)
      }
      recorder.start()
      mediaRecorderRef.current = recorder
      setIsRecording(true)
      setRecordingDuration(0)
      recordingSecondsRef.current = 0
      recordingTimerRef.current = setInterval(() => {
        recordingSecondsRef.current += 1
        setRecordingDuration(recordingSecondsRef.current)
      }, 1000)
    } catch {
      alert('Impossibile accedere al microfono.')
    }
  }

  function stopRecording(cancel = false) {
    clearInterval(recordingTimerRef.current)
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      if (cancel) {
        mediaRecorderRef.current.ondataavailable = null
        mediaRecorderRef.current.onstop = () => { mediaRecorderRef.current.stream?.getTracks().forEach(t => t.stop()) }
      }
      mediaRecorderRef.current.stop()
    }
    if (cancel) { setIsRecording(false); setRecordingDuration(0) }
  }

  async function sendAudio(blob, dur, mimeType) {
    const ext = mimeType.includes('ogg') ? 'ogg' : 'webm'
    setSending(true)
    const optimistic = { id: `opt_${Date.now()}`, group_id: group.id, sender_id: user.id, content: URL.createObjectURL(blob), type: 'voice', status: 'sent', duration_seconds: dur, created_at: new Date().toISOString() }
    setMessages(prev => [...prev, optimistic])
    try {
      const path = `${group.id}/${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from('group-chat-media').upload(path, blob, { contentType: mimeType })
      if (upErr) throw upErr
      const { data: signed, error: signErr } = await supabase.storage.from('group-chat-media').createSignedUrl(path, 315_360_000)
      if (signErr) throw signErr
      const { data, error } = await supabase.from('chat_group_messages')
        .insert({ group_id: group.id, sender_id: user.id, content: signed.signedUrl, type: 'voice', status: 'sent' })
        .select().single()
      if (data) {
        setMessages(prev => prev.map(m => m.id === optimistic.id ? data : m))
      } else if (error) {
        setMessages(prev => prev.filter(m => m.id !== optimistic.id))
      }
    } catch {
      setMessages(prev => prev.filter(m => m.id !== optimistic.id))
    }
    setSending(false)
  }

  const canSendText = text.trim().length > 0 && !sending && !isRecording
  const dayGroups = groupByDate(messages)

  return (
    <div className="chat-fullscreen">
      <div style={{ background: `linear-gradient(160deg, ${group.color || '#157A4A'}, ${group.color || '#1a9f60'})`, padding: 'calc(env(safe-area-inset-top) + 14px) 16px 16px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <ArrowLeft size={17} color="white" />
        </button>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>👥</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: 'white', fontSize: 16, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{group.name}</p>
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 11 }}>{Object.keys(memberProfiles).length || ''} membri</p>
        </div>
      </div>

      <div ref={messagesContainerRef} className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '12px 14px 0', WebkitOverflowScrolling: 'touch' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 13 }}>Caricamento…</div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>💬</div>
            <p style={{ fontSize: 15, fontWeight: 500 }}>Inizia la conversazione di gruppo</p>
          </div>
        ) : (
          Object.entries(dayGroups).map(([day, msgs]) => (
            <div key={day}>
              <div style={{ textAlign: 'center', margin: '10px 0' }}>
                <span style={{ background: 'var(--border)', color: 'var(--text-muted)', fontSize: 11, padding: '3px 10px', borderRadius: 100 }}>{dayLabel(day)}</span>
              </div>
              {msgs.map(msg => {
                const isMe = msg.sender_id === user.id
                const info = memberProfiles[msg.sender_id]
                const isDietitian = info?.role === 'dietitian'
                return (
                  <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: 6 }}>
                    <div style={{ maxWidth: '78%', background: isMe ? 'linear-gradient(135deg, var(--green-main), var(--green-mid))' : 'var(--surface-3)', color: isMe ? 'white' : 'var(--text-primary)', padding: '8px 13px', borderRadius: isMe ? '16px 16px 3px 16px' : '16px 16px 16px 3px', border: isMe ? 'none' : '1px solid var(--border-light)' }}>
                      {!isMe && (
                        <p style={{ fontSize: 11, fontWeight: 700, marginBottom: 2, color: isDietitian ? '#7C3AED' : 'var(--green-main)', display: 'flex', alignItems: 'center', gap: 5 }}>
                          {info?.name || 'Utente'}
                          <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 20, background: isDietitian ? '#EDE9FE' : '#DCFCE7', color: isDietitian ? '#6D28D9' : '#15803D' }}>
                            {isDietitian ? 'Dietista/Nutrizionista' : 'Paziente'}
                          </span>
                        </p>
                      )}
                      {msg.type === 'voice' && msg.content ? (
                        <AudioPlayer src={msg.content} isMe={isMe} />
                      ) : (
                        <p style={{ fontSize: 14, lineHeight: 1.5, wordBreak: 'break-word' }}>{msg.content}</p>
                      )}
                      <div style={{ textAlign: 'right', marginTop: 3 }}>
                        <span style={{ fontSize: 10, opacity: 0.65 }}>{formatTime(msg.created_at)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))
        )}
      </div>

      <div className="chat-input-bar" style={{ position: 'fixed', bottom: 'calc(64px + env(safe-area-inset-bottom))', left: 0, right: 0, padding: '8px 10px', background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--border-light)', zIndex: 50 }}>
        {isRecording ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px' }}>
            <button
              onClick={() => stopRecording(true)}
              style={{ width: 38, height: 38, borderRadius: '50%', border: 'none', cursor: 'pointer', background: '#fff0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              <X size={16} color="var(--red)" />
            </button>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red)', animation: 'pulse 1s infinite', flexShrink: 0 }} />
              <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--red)' }}>{formatDuration(recordingDuration)}</span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Registrazione…</span>
            </div>
            <button
              onClick={() => stopRecording(false)}
              style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'var(--green-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(21,122,74,0.35)' }}
            >
              <Send size={17} color="white" style={{ marginLeft: 2 }} />
            </button>
          </div>
        ) : (
          <form onSubmit={sendMessage} style={{ display: 'flex', alignItems: 'flex-end', gap: 7 }}>
            <div style={{ flex: 1, background: 'var(--surface-2)', borderRadius: 22, border: '1.5px solid var(--border)', padding: '9px 14px' }}>
              <textarea
                ref={inputRef} value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                placeholder="Scrivi al gruppo…" rows={1}
                style={{ width: '100%', background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--font-b)', fontSize: 15, color: 'var(--text-primary)', resize: 'none', maxHeight: 100, lineHeight: 1.5 }}
              />
            </div>
            {canSendText ? (
              <button type="submit" style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0, background: 'var(--green-main)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(26,127,90,0.3)' }}>
                <Send size={17} color="white" style={{ marginLeft: 2 }} />
              </button>
            ) : (
              <button
                type="button"
                onMouseDown={startRecording}
                onTouchStart={e => { e.preventDefault(); startRecording() }}
                disabled={sending}
                style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0, background: sending ? 'var(--border)' : 'var(--surface-3)', border: 'none', cursor: sending ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: sending ? 0.5 : 1 }}
              >
                <Mic size={19} color="var(--text-muted)" />
              </button>
            )}
          </form>
        )}
      </div>
      <div style={{ height: 'calc(72px + env(safe-area-inset-bottom))' }} />
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function ChatPage() {
  const { user } = useAuth()
  const t = useT()

  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [dietitian, setDietitian] = useState(null)
  const [dietitianId, setDietitianId] = useState(null)
  const [notLinked, setNotLinked] = useState(false)
  const [unsignedDocs, setUnsignedDocs] = useState([])
  const [signingDoc, setSigningDoc] = useState(null)
  const [callRoom, setCallRoom] = useState(null)

  // Group chats
  const [groups, setGroups] = useState([])
  const [groupsLoaded, setGroupsLoaded] = useState(false)
  const [activeThread, setActiveThread] = useState(null) // null=deciding, 'list', 'dietitian', or a group object

  // Online status
  const [dietitianLastSeen, setDietitianLastSeen] = useState(null)

  // Voice recording
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)

  // Notifications
  const [notifPermission, setNotifPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  )

  const bottomRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const recordingTimerRef = useRef(null)
  const recordingSecondsRef = useRef(0)
  const presenceIntervalRef = useRef(null)
  const dietitianIdRef = useRef(null)
  const dietitianRef = useRef(null)

  // ── Notification permission ─────────────────────────────────────────────
  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission().then(p => setNotifPermission(p))
    }
  }, [])

  // ── Load data + realtime ────────────────────────────────────────────────
  useEffect(() => {
    let channel
    loadData().then(dId => {
      if (!dId) return
      // Realtime: new chat messages
      channel = supabase.channel(`chat-patient-${user.id}`)
        .on('postgres_changes', {
          event: 'INSERT', schema: 'public', table: 'chat_messages',
          filter: `patient_id=eq.${user.id}`
        }, payload => {
          setMessages(prev => {
            if (prev.find(m => m.id === payload.new.id)) return prev
            return [...prev, payload.new]
          })
          if (payload.new.sender_role === 'dietitian') {
            markAsRead([payload.new.id])
            showPushNotification(payload.new)
          }
        })
        // Realtime: read receipts updated (dietitian read our messages)
        .on('postgres_changes', {
          event: 'UPDATE', schema: 'public', table: 'chat_messages',
          filter: `patient_id=eq.${user.id}`
        }, payload => {
          setMessages(prev => prev.map(m => m.id === payload.new.id ? { ...m, read_at: payload.new.read_at } : m))
        })
        // Realtime: dietitian online status
        .on('postgres_changes', {
          event: 'UPDATE', schema: 'public', table: 'profiles',
          filter: `id=eq.${dId}`
        }, payload => {
          setDietitianLastSeen(payload.new.last_seen_at)
        })
        .subscribe()
    })

    // Update patient's own last_seen_at every 60s
    updateLastSeen()
    presenceIntervalRef.current = setInterval(updateLastSeen, 60_000)

    return () => {
      if (channel) supabase.removeChannel(channel)
      clearInterval(presenceIntervalRef.current)
      stopRecording(true)
    }
  }, [user.id])

  useEffect(() => {
    const el = messagesContainerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  // ── Load group chats the patient belongs to ─────────────────────────────
  useEffect(() => {
    async function loadGroups() {
      const { data: mine } = await supabase.from('chat_group_members').select('group_id,last_read_at').eq('user_id', user.id)
      const groupIds = (mine || []).map(m => m.group_id)
      if (!groupIds.length) { setGroups([]); setGroupsLoaded(true); return }
      const [{ data: gRows }, { data: lastMsgs }] = await Promise.all([
        supabase.from('chat_groups').select('*').in('id', groupIds),
        supabase.from('chat_group_messages').select('group_id,sender_id,content,type,created_at').in('group_id', groupIds).order('created_at', { ascending: false }),
      ])
      const myReadMap = Object.fromEntries((mine || []).map(m => [m.group_id, m.last_read_at]))
      const lastByGroup = {}
      ;(lastMsgs || []).forEach(m => { if (!lastByGroup[m.group_id]) lastByGroup[m.group_id] = m })
      const list = (gRows || []).map(g => {
        const last = lastByGroup[g.id]
        const unread = !!(last && last.sender_id !== user.id && (!myReadMap[g.id] || new Date(last.created_at) > new Date(myReadMap[g.id])))
        return { ...g, lastMsg: last || null, unread }
      })
      setGroups(list)
      setGroupsLoaded(true)
    }
    loadGroups()
  }, [user.id])

  // ── Decide the default thread once both the dietitian chat and groups have loaded ──
  useEffect(() => {
    if (activeThread !== null) return
    if (!loading && groupsLoaded) {
      setActiveThread(groups.length > 0 ? 'list' : 'dietitian')
    }
  }, [loading, groupsLoaded, groups, activeThread])

  async function updateLastSeen() {
    await supabase.from('profiles').update({ last_seen_at: new Date().toISOString() }).eq('id', user.id)
  }

  async function loadData() {
    const CACHE_KEY = `chat_dietitian_${user.id}`
    const cachedDId = sessionStorage.getItem(CACHE_KEY)

    let dId = cachedDId

    if (!dId) {
      // First time: fetch link (cold path)
      const { data: link } = await supabase
        .from('patient_dietitian')
        .select('dietitian_id')
        .eq('patient_id', user.id)
        .maybeSingle()

      if (!link) {
        setNotLinked(true)
        setLoading(false)
        return null
      }
      dId = link.dietitian_id
      sessionStorage.setItem(CACHE_KEY, dId)
    }

    setDietitianId(dId)
    dietitianIdRef.current = dId

    // Fetch dietitian profile, messages, and unsigned docs all in parallel
    const [profileRes, msgsRes, docsRes] = await Promise.all([
      supabase.from('profiles').select('full_name, first_name, last_name, last_seen_at').eq('id', dId).maybeSingle(),
      supabase.from('chat_messages')
        .select('id,patient_id,sender_role,sender_id,content,message_type,file_url,file_name,duration_seconds,read_at,created_at')
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50),
      supabase.from('patient_documents').select('id, title, content, type').eq('patient_id', user.id).eq('requires_signature', true).is('signed_at', null).eq('visible', true),
    ])

    // If cached dietitian_id turned stale (no profile found), retry with fresh lookup
    if (!profileRes.data && cachedDId) {
      sessionStorage.removeItem(CACHE_KEY)
      const { data: link } = await supabase
        .from('patient_dietitian')
        .select('dietitian_id')
        .eq('patient_id', user.id)
        .maybeSingle()
      if (!link) {
        setNotLinked(true)
        setLoading(false)
        return null
      }
      dId = link.dietitian_id
      sessionStorage.setItem(CACHE_KEY, dId)
      setDietitianId(dId)
      dietitianIdRef.current = dId
    }

    const dietitianProfile = profileRes.data || { full_name: 'Il tuo dietista' }
    setDietitian(dietitianProfile)
    dietitianRef.current = dietitianProfile
    setDietitianLastSeen(profileRes.data?.last_seen_at || null)
    const msgs = (msgsRes.data || []).reverse()
    setMessages(msgs)
    setHasMore((msgsRes.data || []).length >= 50)
    setUnsignedDocs(docsRes.data || [])

    const unread = (msgsRes.data || []).filter(m => m.sender_role === 'dietitian' && !m.read_at)
    if (unread.length) markAsRead(unread.map(m => m.id))

    setLoading(false)
    return dId
  }

  async function loadMoreMessages() {
    if (!messages.length || loadingMore || !hasMore) return
    setLoadingMore(true)
    const oldest = messages[0].created_at
    const { data } = await supabase.from('chat_messages')
      .select('id,patient_id,sender_role,sender_id,content,message_type,file_url,file_name,duration_seconds,read_at,created_at')
      .eq('patient_id', user.id)
      .lt('created_at', oldest)
      .order('created_at', { ascending: false })
      .limit(50)
    if (data && data.length > 0) {
      const container = messagesContainerRef.current
      const prevScrollHeight = container?.scrollHeight || 0
      const older = data.reverse()
      setMessages(prev => [...older, ...prev])
      setHasMore(data.length >= 50)
      requestAnimationFrame(() => {
        if (container) container.scrollTop = container.scrollHeight - prevScrollHeight
      })
    } else {
      setHasMore(false)
    }
    setLoadingMore(false)
  }

  async function markAsRead(ids) {
    if (!ids.length) return
    await supabase.from('chat_messages').update({ read_at: new Date().toISOString() }).in('id', ids)
  }

  function showPushNotification(msg) {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
    if (document.visibilityState === 'visible') return
    // Read from the ref, not the `dietitian` state: this function is captured by
    // the realtime subscription set up once on mount, before loadData() resolves,
    // so the state closure would stay stuck on its initial (null) value forever.
    const d = dietitianRef.current
    const dName = d?.full_name ||
      `${d?.first_name || ''} ${d?.last_name || ''}`.trim() || 'Dietista'
    const body = msg.message_type === 'image' ? '📷 Foto' :
      msg.message_type === 'audio' ? '🎤 Messaggio vocale' : msg.content
    new Notification(`Nuovo messaggio da ${dName}`, { body, icon: '/icons/icon-192x192.png' })
  }

  // ── Send text message ───────────────────────────────────────────────────
  async function sendMessage(e) {
    e?.preventDefault()
    const content = text.trim()
    if (!content || sending) return
    setSending(true)
    setText('')
    const optimistic = {
      id: `opt_${Date.now()}`, patient_id: user.id,
      sender_role: 'patient', sender_id: user.id,
      content, message_type: 'text', created_at: new Date().toISOString(), read_at: null
    }
    setMessages(prev => [...prev, optimistic])
    const { data, error } = await supabase.from('chat_messages').insert({
      patient_id: user.id, sender_role: 'patient',
      sender_id: user.id, content, message_type: 'text'
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

  // ── Start video call ────────────────────────────────────────────────────
  async function startVideoCall() {
    if (!dietitianId) return
    const room = callRoomName(user.id, dietitianId)
    setCallRoom(room)
    const optimistic = {
      id: `opt_${Date.now()}`, patient_id: user.id,
      sender_role: 'patient', sender_id: user.id,
      content: room, message_type: 'video_call', created_at: new Date().toISOString(), read_at: null,
    }
    setMessages(prev => [...prev, optimistic])
    const { data } = await supabase.from('chat_messages').insert({
      patient_id: user.id, sender_role: 'patient',
      sender_id: user.id, content: room, message_type: 'video_call',
    }).select().single()
    if (data) setMessages(prev => prev.map(m => m.id === optimistic.id ? data : m))
  }

  // ── Upload helper ───────────────────────────────────────────────────────
  async function uploadToStorage(file, folder) {
    const ext = file.name ? file.name.split('.').pop() : 'bin'
    const path = `${user.id}/${folder}_${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('chat-media').upload(path, file)
    if (error) throw error
    const { data: signed } = await supabase.storage
      .from('chat-media')
      .createSignedUrl(path, 315_360_000) // ~10 years
    return signed.signedUrl
  }

  // ── Photo upload ────────────────────────────────────────────────────────
  async function handlePhotoSelected(e) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setSending(true)
    const optimistic = {
      id: `opt_${Date.now()}`, patient_id: user.id,
      sender_role: 'patient', sender_id: user.id,
      content: '', message_type: 'image', file_url: URL.createObjectURL(file),
      file_name: file.name, created_at: new Date().toISOString(), read_at: null
    }
    setMessages(prev => [...prev, optimistic])
    try {
      const fileUrl = await uploadToStorage(file, 'img')
      const { data, error } = await supabase.from('chat_messages').insert({
        patient_id: user.id, sender_role: 'patient', sender_id: user.id,
        content: '', message_type: 'image', file_url: fileUrl, file_name: file.name
      }).select().single()
      if (data) {
        setMessages(prev => prev.map(m => m.id === optimistic.id ? data : m))
      } else if (error) {
        setMessages(prev => prev.filter(m => m.id !== optimistic.id))
      }
    } catch {
      setMessages(prev => prev.filter(m => m.id !== optimistic.id))
    }
    setSending(false)
  }

  // ── Voice recording ─────────────────────────────────────────────────────
  async function startRecording() {
    if (isRecording) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg'
      const recorder = new MediaRecorder(stream, { mimeType })
      audioChunksRef.current = []
      recorder.ondataavailable = e => { if (e.data.size > 0) audioChunksRef.current.push(e.data) }
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        const blob = new Blob(audioChunksRef.current, { type: mimeType })
        // Same fix as the other chat view's startRecording(): onstop is
        // assigned once and never recreated, so reading recordingDuration
        // directly here always sees its value from this exact moment
        // (effectively stuck at 0) — read the ref the interval keeps live.
        const dur = recordingSecondsRef.current
        setIsRecording(false)
        setRecordingDuration(0)
        await sendAudio(blob, dur, mimeType)
      }
      recorder.start()
      mediaRecorderRef.current = recorder
      setIsRecording(true)
      setRecordingDuration(0)
      recordingSecondsRef.current = 0
      recordingTimerRef.current = setInterval(() => {
        recordingSecondsRef.current += 1
        setRecordingDuration(recordingSecondsRef.current)
      }, 1000)
    } catch {
      alert('Impossibile accedere al microfono.')
    }
  }

  function stopRecording(cancel = false) {
    clearInterval(recordingTimerRef.current)
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      if (cancel) {
        mediaRecorderRef.current.ondataavailable = null
        mediaRecorderRef.current.onstop = () => {
          mediaRecorderRef.current.stream?.getTracks().forEach(t => t.stop())
        }
      }
      mediaRecorderRef.current.stop()
    }
    if (cancel) {
      setIsRecording(false)
      setRecordingDuration(0)
    }
  }

  async function sendAudio(blob, dur, mimeType) {
    const ext = mimeType.includes('ogg') ? 'ogg' : 'webm'
    const file = new File([blob], `voice_${Date.now()}.${ext}`, { type: mimeType })
    setSending(true)
    const optimistic = {
      id: `opt_${Date.now()}`, patient_id: user.id,
      sender_role: 'patient', sender_id: user.id,
      content: '', message_type: 'audio', file_url: URL.createObjectURL(blob),
      duration_seconds: dur, created_at: new Date().toISOString(), read_at: null
    }
    setMessages(prev => [...prev, optimistic])
    try {
      const fileUrl = await uploadToStorage(file, 'audio')
      const { data, error } = await supabase.from('chat_messages').insert({
        patient_id: user.id, sender_role: 'patient', sender_id: user.id,
        content: '', message_type: 'audio', file_url: fileUrl, duration_seconds: dur
      }).select().single()
      if (data) {
        setMessages(prev => prev.map(m => m.id === optimistic.id ? data : m))
      } else if (error) {
        setMessages(prev => prev.filter(m => m.id !== optimistic.id))
      }
    } catch {
      setMessages(prev => prev.filter(m => m.id !== optimistic.id))
    }
    setSending(false)
  }

  // ── Notification toggle ─────────────────────────────────────────────────
  async function requestNotifications() {
    if (typeof Notification === 'undefined') return
    const p = await Notification.requestPermission()
    setNotifPermission(p)
  }

  // ── Derived values ──────────────────────────────────────────────────────
  const dietitianName = dietitian?.full_name ||
    `${dietitian?.first_name || ''} ${dietitian?.last_name || ''}`.trim() || 'Il tuo dietista'

  const isOnline = dietitianLastSeen
    ? (Date.now() - new Date(dietitianLastSeen).getTime()) < 5 * 60 * 1000
    : false

  const seenLabel = isOnline ? 'Online' : lastSeenLabel(dietitianLastSeen)

  const canSendText = text.trim().length > 0 && !sending && !isRecording

  // ── Deciding / list / group thread routing ──────────────────────────────
  if (activeThread === null) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-2)' }}>
        <div className="skeleton" style={{ width: 60, height: 60, borderRadius: '50%' }} />
      </div>
    )
  }

  if (activeThread === 'list') {
    return (
      <ChatListView
        dietitianName={dietitianName}
        dietitianOnline={isOnline}
        dietitianPreview={messages[messages.length - 1]?.content || 'Il tuo dietista'}
        dietitianUnread={messages.some(m => m.sender_role === 'dietitian' && !m.read_at)}
        notLinked={notLinked}
        groups={groups}
        onOpenDietitian={() => setActiveThread('dietitian')}
        onOpenGroup={g => setActiveThread(g)}
      />
    )
  }

  if (activeThread && typeof activeThread === 'object') {
    return (
      <GroupThreadView
        group={activeThread}
        user={user}
        onBack={() => setActiveThread(groups.length > 0 ? 'list' : 'dietitian')}
      />
    )
  }

  // ── Not linked ──────────────────────────────────────────────────────────
  if (!loading && notLinked) return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--surface-2)' }}>
      <div style={{ background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))', padding: 'calc(env(safe-area-inset-top) + 16px) 20px 20px' }}>
        <h1 style={{ fontFamily: 'var(--font-d)', fontSize: 22, color: 'white', fontWeight: 300 }}>Chat</h1>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <MessageCircle size={32} color="var(--green-main)" />
        </div>
        <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 22, fontWeight: 300, marginBottom: 10 }}>
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

  const dayGroups = groupByDate(messages)

  return (
    <div className="chat-fullscreen">
      {/* Hidden file input for photos */}
      <input
        ref={fileInputRef} type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        style={{ display: 'none' }}
        onChange={handlePhotoSelected}
      />

      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))', padding: 'calc(env(safe-area-inset-top) + 14px) 16px 16px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        {groups.length > 0 && (
          <button
            onClick={() => setActiveThread('list')}
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
          >
            <ArrowLeft size={17} color="white" />
          </button>
        )}
        {/* Avatar with online indicator */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: 'white', border: '2px solid rgba(255,255,255,0.3)' }}>
            {dietitianName[0]?.toUpperCase()}
          </div>
          {/* Online dot */}
          <span style={{
            position: 'absolute', bottom: 1, right: 1,
            width: 10, height: 10, borderRadius: '50%',
            background: isOnline ? '#4ade80' : '#94a3b8',
            border: '2px solid rgba(10,74,46,0.9)',
            transition: 'background 0.3s'
          }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>{dietitianName}</p>
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 11 }}>
            {seenLabel || 'Dietista'}
          </p>
        </div>
        {/* Video call button */}
        {dietitianId && (
          <button
            onClick={startVideoCall}
            title="Avvia videochiamata"
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', padding: 10, minWidth: 44, minHeight: 44, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Video size={18} color="white" />
          </button>
        )}
        {/* Notification bell */}
        {typeof Notification !== 'undefined' && (
          <button
            onClick={requestNotifications}
            title={notifPermission === 'granted' ? 'Notifiche attive' : 'Attiva notifiche'}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 10, minWidth: 44, minHeight: 44, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: notifPermission === 'granted' ? 1 : 0.55 }}
          >
            {notifPermission === 'granted'
              ? <Bell size={18} color="white" />
              : <BellOff size={18} color="white" />}
          </button>
        )}
      </div>

      {/* Unsigned documents banner */}
      {unsignedDocs.length > 0 && (
        <div style={{ background: 'var(--alert-warning-bg)', borderBottom: '1px solid var(--alert-warning-border)', padding: '10px 16px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <AlertTriangle size={16} color="var(--alert-warning-text)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--alert-warning-text)', marginBottom: 4 }}>
                {unsignedDocs.length === 1 ? 'Documento da firmare' : `${unsignedDocs.length} documenti da firmare`}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {unsignedDocs.map(doc => (
                  <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FileText size={13} color="var(--alert-warning-text)" />
                      <span style={{ fontSize: 13, color: 'var(--alert-warning-text)' }}>{doc.title || 'Informativa privacy'}</span>
                    </div>
                    <button
                      onClick={() => setSigningDoc(doc)}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--alert-warning-text)', color: 'white', border: 'none', borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
                    >
                      <PenLine size={12} />
                      Firma
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div ref={messagesContainerRef} className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '12px 14px 0', WebkitOverflowScrolling: 'touch' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '20px 0' }}>
            {[['70%', false], ['50%', true], ['80%', false], ['40%', true], ['65%', false]].map(([w, isMe], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 6 }}>
                {!isMe && <div className="skeleton" style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0 }} />}
                <div className="skeleton" style={{ height: 36, width: w, borderRadius: isMe ? '16px 16px 3px 16px' : '16px 16px 16px 3px', animationDelay: `${i * 0.1}s` }} />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>💬</div>
            <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>Inizia la conversazione</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>Scrivi un messaggio a {dietitianName}<br />per domande o aggiornamenti.</p>
          </div>
        ) : (
          <>
            {hasMore && (
              <div style={{ textAlign: 'center', padding: '8px 0 12px' }}>
                <button
                  onClick={loadMoreMessages}
                  disabled={loadingMore}
                  style={{ fontSize: 12, color: 'var(--green-main)', background: 'var(--green-pale)', border: '1.5px solid var(--border-light)', borderRadius: 20, padding: '7px 16px', cursor: loadingMore ? 'default' : 'pointer', fontWeight: 600, opacity: loadingMore ? 0.6 : 1 }}
                >
                  {loadingMore ? 'Caricamento…' : '↑ Carica messaggi precedenti'}
                </button>
              </div>
            )}
            {Object.entries(dayGroups).map(([day, msgs]) => (
            <div key={day}>
              <div style={{ textAlign: 'center', margin: '10px 0' }}>
                <span style={{ background: 'var(--border)', color: 'var(--text-muted)', fontSize: 11, padding: '3px 10px', borderRadius: 100 }}>{dayLabel(day)}</span>
              </div>
              {msgs.map((msg, i) => {
                const isMe = msg.sender_role === 'patient'
                const showAvatar = !isMe && (i === 0 || msgs[i - 1]?.sender_role !== msg.sender_role)
                const type = msg.message_type || 'text'
                return (
                  <div key={msg.id} className={isMe ? 'msg-in-right' : 'msg-in-left'} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: 5, alignItems: 'flex-end', gap: 6 }}>
                    {!isMe && (
                      <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--green-main)', flexShrink: 0, visibility: showAvatar ? 'visible' : 'hidden' }}>
                        {dietitianName[0]}
                      </div>
                    )}
                    <div style={{ maxWidth: '75%', background: isMe ? 'linear-gradient(135deg, var(--green-main), var(--green-mid))' : 'var(--surface-3)', color: isMe ? 'white' : 'var(--text-primary)', padding: type === 'image' ? '4px 4px 8px' : '9px 13px', borderRadius: isMe ? '16px 16px 3px 16px' : '16px 16px 16px 3px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', border: isMe ? 'none' : '1px solid var(--border-light)', overflow: 'hidden' }}>
                      {type === 'text' && (
                        <p style={{ fontSize: 14, lineHeight: 1.5, wordBreak: 'break-word' }}>{msg.content}</p>
                      )}
                      {type === 'image' && msg.file_url && (
                        <div>
                          <img
                            src={msg.file_url} alt="Foto"
                            style={{ display: 'block', maxWidth: 220, maxHeight: 220, borderRadius: 12, objectFit: 'cover', cursor: 'pointer' }}
                            onClick={() => window.open(msg.file_url, '_blank')}
                          />
                        </div>
                      )}
                      {type === 'audio' && msg.file_url && (
                        <AudioPlayer src={msg.file_url} isMe={isMe} />
                      )}
                      {type === 'video_call' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Video size={16} color={isMe ? 'white' : 'var(--green-main)'} />
                          <span style={{ fontSize: 13.5, fontWeight: 500 }}>
                            {isMe ? 'Hai avviato una videochiamata' : 'Videochiamata in corso'}
                          </span>
                          <button
                            onClick={() => setCallRoom(msg.content)}
                            style={{
                              marginLeft: 4, background: isMe ? 'rgba(255,255,255,0.25)' : 'var(--green-pale)',
                              color: isMe ? 'white' : 'var(--green-dark)', border: 'none', borderRadius: 100,
                              padding: '4px 11px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
                            }}
                          >
                            Partecipa
                          </button>
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3, marginTop: 4, paddingRight: type === 'image' ? 6 : 0 }}>
                        <span style={{ fontSize: 10, opacity: 0.65 }}>{formatTime(msg.created_at)}</span>
                        {isMe && (msg.read_at
                          ? <CheckCheck size={11} color={isMe ? 'rgba(255,255,255,0.85)' : 'var(--green-main)'} />
                          : <Check size={11} style={{ opacity: 0.45 }} />)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
          </>
        )}
        <div ref={bottomRef} style={{ height: 8 }} />
      </div>

      {/* Signature modal */}
      {signingDoc && (
        <SignatureModal
          doc={signingDoc}
          onClose={() => setSigningDoc(null)}
          onSigned={docId => {
            setUnsignedDocs(prev => prev.filter(d => d.id !== docId))
            setSigningDoc(null)
          }}
        />
      )}

      {/* Video call */}
      {callRoom && (
        <VideoCallModal roomName={callRoom} displayName={user.email} onClose={() => setCallRoom(null)} />
      )}

      {/* Input bar */}
      <div className="chat-input-bar" style={{ position: 'fixed', bottom: 'calc(64px + env(safe-area-inset-bottom))', left: 0, right: 0, padding: '8px 10px', background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--border-light)', zIndex: 50 }}>
        {isRecording ? (
          // ── Recording UI ──
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px' }}>
            <button
              onClick={() => stopRecording(true)}
              style={{ width: 38, height: 38, borderRadius: '50%', border: 'none', cursor: 'pointer', background: '#fff0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              <X size={16} color="var(--red)" />
            </button>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red)', animation: 'pulse 1s infinite', flexShrink: 0 }} />
              <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--red)' }}>
                {formatDuration(recordingDuration)}
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Registrazione…</span>
            </div>
            <button
              onClick={() => stopRecording(false)}
              style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'var(--green-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(21,122,74,0.35)' }}
            >
              <Send size={17} color="white" style={{ marginLeft: 2 }} />
            </button>
          </div>
        ) : (
          // ── Normal input ──
          <form onSubmit={sendMessage} style={{ display: 'flex', alignItems: 'flex-end', gap: 7 }}>
            {/* Photo button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={sending}
              style={{ width: 38, height: 38, borderRadius: '50%', border: 'none', cursor: sending ? 'default' : 'pointer', background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: sending ? 0.5 : 1 }}
            >
              <ImagePlus size={18} color="var(--text-muted)" />
            </button>

            {/* Text area */}
            <div style={{ flex: 1, background: 'var(--surface-2)', borderRadius: 22, border: '1.5px solid var(--border)', padding: '9px 14px', display: 'flex', alignItems: 'center' }}>
              <textarea
                ref={inputRef} value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                placeholder={t('chat.placeholder')} rows={1}
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--font-b)', fontSize: 15, color: 'var(--text-primary)', resize: 'none', maxHeight: 100, lineHeight: 1.5 }}
              />
            </div>

            {/* Send / Mic button */}
            {canSendText ? (
              <button
                type="submit"
                style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0, background: 'var(--green-main)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(26,127,90,0.3)' }}
              >
                <Send size={17} color="white" style={{ marginLeft: 2 }} />
              </button>
            ) : (
              <button
                type="button"
                onMouseDown={startRecording}
                onTouchStart={e => { e.preventDefault(); startRecording() }}
                disabled={sending}
                style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0, background: sending ? 'var(--border)' : 'var(--surface-3)', border: 'none', cursor: sending ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: sending ? 0.5 : 1 }}
              >
                <Mic size={19} color="var(--text-muted)" />
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
