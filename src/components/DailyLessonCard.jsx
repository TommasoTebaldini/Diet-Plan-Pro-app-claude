import { useState } from 'react'
import { GraduationCap, CheckCircle2, XCircle, Flame } from 'lucide-react'

// "Lezione del giorno" (stile percorso educativo Noom): una micro-lezione
// quotidiana costruita sul question bank del quiz (2000 domande con
// spiegazione) — domanda deterministica per data, così tutti i giorni ne
// esce una diversa e la stessa per tutta la giornata. Il bank (~1MB JSON,
// già cacheato 7gg lato HTTP per /quiz) viene scaricato SOLO al tap su
// "Inizia", mai al mount della dashboard.

const DONE_KEY = 'daily_lesson_done'      // { date, correct }
const STREAK_KEY = 'daily_lesson_streak'  // { count, last }

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function loadDone() {
  try {
    const raw = JSON.parse(localStorage.getItem(DONE_KEY) || 'null')
    return raw?.date === todayStr() ? raw : null
  } catch { return null }
}

function loadStreak() {
  try { return JSON.parse(localStorage.getItem(STREAK_KEY) || 'null') || { count: 0, last: null } } catch { return { count: 0, last: null } }
}

function bumpStreak() {
  const today = todayStr()
  const s = loadStreak()
  if (s.last === today) return s
  const yesterday = (() => {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  })()
  const next = { count: s.last === yesterday ? s.count + 1 : 1, last: today }
  try { localStorage.setItem(STREAK_KEY, JSON.stringify(next)) } catch { /* pieno */ }
  return next
}

// Indice deterministico dalla data: giorno-dell'anno * primo grande, mod n.
function questionIndexForToday(n) {
  const d = new Date()
  const start = new Date(d.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((d - start) / 86400000)
  return ((d.getFullYear() * 367 + dayOfYear) * 2654435761 >>> 0) % n
}

export default function DailyLessonCard() {
  const [done, setDone] = useState(() => loadDone())
  const [streak, setStreak] = useState(() => loadStreak())
  const [question, setQuestion] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [picked, setPicked] = useState(null)

  async function start() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/data/quiz-questions.json')
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const bank = await res.json()
      const qs = bank.questions || []
      if (!qs.length) throw new Error('Bank vuoto')
      setQuestion(qs[questionIndexForToday(qs.length)])
    } catch {
      setError('Impossibile caricare la lezione, riprova.')
    }
    setLoading(false)
  }

  function answer(i) {
    if (picked !== null || !question) return
    setPicked(i)
    const correct = i === question.ans
    const record = { date: todayStr(), correct }
    try { localStorage.setItem(DONE_KEY, JSON.stringify(record)) } catch { /* pieno */ }
    setDone(record)
    setStreak(bumpStreak())
  }

  const showQuestion = question && (!done || picked !== null)

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--icon-bg-purple, #f5f3ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <GraduationCap size={19} color="var(--purple, #7c3aed)" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 700 }}>Lezione del giorno</p>
          <p style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>1 minuto per imparare qualcosa di nuovo</p>
        </div>
        {streak.count > 1 && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 700, color: '#EA580C', flexShrink: 0 }}>
            <Flame size={13} /> {streak.count}
          </span>
        )}
      </div>

      {done && picked === null && !question ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 10 }}>
          {done.correct ? <CheckCircle2 size={16} color="var(--green-main)" /> : <XCircle size={16} color="var(--orange)" />}
          <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
            Lezione di oggi completata{done.correct ? ' — risposta esatta! 🎉' : ' — domani un\'altra occasione.'}
          </span>
        </div>
      ) : !showQuestion ? (
        <>
          {error && <p style={{ fontSize: 12, color: 'var(--red)', marginBottom: 8 }}>{error}</p>}
          <button onClick={start} disabled={loading} style={{
            width: '100%', padding: '11px', borderRadius: 12, border: 'none', cursor: 'pointer',
            background: 'var(--purple, #7c3aed)', color: 'white', fontSize: 13.5, fontWeight: 700, font: 'inherit', opacity: loading ? 0.6 : 1,
          }}>
            {loading ? 'Caricamento…' : '📚 Inizia la lezione'}
          </button>
        </>
      ) : (
        <div>
          <p style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 10 }}>{question.q}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {question.opts.map((opt, i) => {
              const isAns = i === question.ans
              const isPicked = i === picked
              let bg = 'var(--surface-2)', border = 'var(--border)', color = 'var(--text-primary)'
              if (picked !== null) {
                if (isAns) { bg = 'var(--green-pale, #d1fae5)'; border = 'var(--green-main)'; color = 'var(--green-dark, #065f46)' }
                else if (isPicked) { bg = '#fef2f2'; border = 'var(--red)'; color = 'var(--red)' }
              }
              return (
                <button key={i} onClick={() => answer(i)} disabled={picked !== null} style={{
                  textAlign: 'left', padding: '10px 12px', borderRadius: 10, cursor: picked === null ? 'pointer' : 'default',
                  background: bg, border: `1.5px solid ${border}`, color, fontSize: 13, font: 'inherit', fontWeight: 500,
                }}>
                  {opt}
                </button>
              )
            })}
          </div>
          {picked !== null && (
            <div style={{ marginTop: 10, padding: '10px 12px', background: 'var(--icon-bg-purple, #f5f3ff)', borderRadius: 10 }}>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <b>{picked === question.ans ? '✅ Esatto! ' : '💡 '}</b>{question.exp}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
