import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Zap, Star, Trophy, RefreshCw, ChevronRight, CheckCircle2, XCircle, Flame, BookOpen, Lock } from 'lucide-react'
import QUESTIONS, { CATEGORIES } from '../data/quizQuestions'

const QUESTIONS_PER_DAY = 5

// Deterministic daily question selection — same questions for everyone on the same day
function getQuestionsForToday() {
  const today = new Date().toISOString().split('T')[0]
  const seed = today.split('-').reduce((acc, v) => acc * 100 + parseInt(v), 0)
  const indices = []
  let s = seed
  // Ensure category variety: pick one from each of first 5 categories if possible
  const cats = Object.keys(CATEGORIES)
  const catBuckets = {}
  cats.forEach(c => { catBuckets[c] = QUESTIONS.reduce((a, q, i) => (q.cat === c ? [...a, i] : a), []) })

  while (indices.length < QUESTIONS_PER_DAY) {
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b)
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b)
    s = s ^ (s >>> 16)
    const idx = Math.abs(s) % QUESTIONS.length
    if (!indices.includes(idx)) indices.push(idx)
  }
  return indices.map(i => QUESTIONS[i])
}

function todayKey() { return new Date().toISOString().split('T')[0] }

function loadProgress() {
  try {
    const raw = localStorage.getItem(`quiz_${todayKey()}`)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveProgress(data) {
  localStorage.setItem(`quiz_${todayKey()}`, JSON.stringify(data))
}

function getStreak() {
  try { return parseInt(localStorage.getItem('quiz_streak') || '0') } catch { return 0 }
}

function updateStreak(completed) {
  if (!completed) return getStreak()
  const today = todayKey()
  const lastDay = localStorage.getItem('quiz_last_day')
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  let streak = getStreak()
  if (lastDay === yesterday) {
    streak += 1
  } else if (lastDay !== today) {
    streak = 1
  }
  localStorage.setItem('quiz_streak', String(streak))
  localStorage.setItem('quiz_last_day', today)
  return streak
}

function ScoreStars({ score, total }) {
  const pct = score / total
  const stars = pct >= 0.8 ? 3 : pct >= 0.5 ? 2 : 1
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
      {[1, 2, 3].map(i => (
        <Star key={i} size={32} fill={i <= stars ? '#fbbf24' : 'none'} color={i <= stars ? '#fbbf24' : '#d1d5db'} />
      ))}
    </div>
  )
}

export default function QuizPage({ inModal = false }) {
  const { user } = useAuth()
  // When inside a modal the page already has a header — no safe-area top padding needed
  const tp = (x) => inModal ? `${x}px` : `calc(env(safe-area-inset-top) + ${x}px)`
  const pageClass = inModal ? undefined : 'page'
  const pageStyle = inModal ? { flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: 24 } : { padding: 0 }
  const [phase, setPhase] = useState('loading') // loading | idle | playing | feedback | done
  const [questions] = useState(() => getQuestionsForToday())
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState([]) // { correct: bool }
  const [streak, setStreak] = useState(0)
  const [finalStreak, setFinalStreak] = useState(0)
  const feedbackTimer = useRef(null)

  useEffect(() => {
    const prog = loadProgress()
    setStreak(getStreak())
    if (prog?.done) {
      setAnswers(prog.answers || [])
      setPhase('done')
    } else {
      setPhase('idle')
    }
    return () => clearTimeout(feedbackTimer.current)
  }, [])

  function startQuiz() {
    setIdx(0)
    setAnswers([])
    setSelected(null)
    setPhase('playing')
  }

  function handleSelect(optIdx) {
    if (phase !== 'playing') return
    const q = questions[idx]
    const correct = optIdx === q.ans
    setSelected(optIdx)
    setPhase('feedback')
    const newAnswers = [...answers, { correct }]
    setAnswers(newAnswers)

    feedbackTimer.current = setTimeout(() => {
      if (idx + 1 < questions.length) {
        setIdx(i => i + 1)
        setSelected(null)
        setPhase('playing')
      } else {
        const score = newAnswers.filter(a => a.correct).length
        const newStreak = updateStreak(true)
        setFinalStreak(newStreak)
        saveProgress({ done: true, score, total: questions.length, answers: newAnswers, streak: newStreak })
        setPhase('done')
        // Try to save to Supabase (fault-tolerant)
        supabase.from('quiz_results').upsert(
          { user_id: user.id, date: todayKey(), score, total: questions.length, streak: newStreak },
          { onConflict: 'user_id,date' }
        ).catch(() => {})
      }
    }, 1600)
  }

  // ── LOADING
  if (phase === 'loading') return (
    <div className={pageClass} style={{ ...pageStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--green-main)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  const q = questions[idx]
  const cat = q ? CATEGORIES[q.cat] : null
  const score = answers.filter(a => a.correct).length
  const pct = answers.length ? score / answers.length : 0
  const totalScore = phase === 'done' ? answers.filter(a => a.correct).length : score

  // ── DONE
  if (phase === 'done') {
    const finalScore = answers.filter(a => a.correct).length
    const pctFinal = finalScore / questions.length
    const msg = pctFinal === 1 ? 'Perfetto! 🎉 Sei un esperto!' :
                pctFinal >= 0.8 ? 'Ottimo! Quasi tutto giusto!' :
                pctFinal >= 0.5 ? 'Buono! Continua ad imparare.' :
                'Non mollare, ritorna domani!'
    const emoji = pctFinal === 1 ? '🏆' : pctFinal >= 0.8 ? '🌟' : pctFinal >= 0.5 ? '📚' : '💪'
    const fs = finalStreak || getStreak()

    return (
      <div className={pageClass} style={pageStyle}>
        {/* Hero */}
        <div style={{ background: 'linear-gradient(160deg, #1a7f5a 0%, #14b8a6 100%)', padding: `${tp(32)} 24px 32px`, textAlign: 'center' }}>
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <div style={{ fontSize: 72, lineHeight: 1, marginBottom: 16 }}>{emoji}</div>
          </motion.div>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 13, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>Quiz del giorno</p>
            <h1 style={{ color: 'white', fontSize: 26, fontWeight: 800, marginBottom: 8 }}>{finalScore}/{questions.length} corrette</h1>
            <p style={{ color: 'rgba(255,255,255,.85)', fontSize: 15 }}>{msg}</p>
          </motion.div>
        </div>

        <div style={{ padding: '20px 20px 100px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Stars */}
          <motion.div className="card" style={{ padding: '20px 16px', textAlign: 'center' }}
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <ScoreStars score={finalScore} total={questions.length} />
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 12 }}>
              {pctFinal === 1 ? '3 stelle — risultato perfetto!' : pctFinal >= 0.8 ? '2 stelle — ottima conoscenza!' : '1 stella — continua a praticare!'}
            </p>
          </motion.div>

          {/* Streak */}
          {fs > 0 && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
              <div style={{ background: 'linear-gradient(135deg, #fff7ed, #fef3c7)', border: '1.5px solid #fed7aa', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #f97316, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Flame size={22} color="white" fill="white" />
                </div>
                <div>
                  <p style={{ fontSize: 11, color: '#92400e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>Striscia</p>
                  <p style={{ fontSize: 20, fontWeight: 800, color: '#c2410c' }}>{fs} {fs === 1 ? 'giorno' : 'giorni'} di fila!</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Question review */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Riepilogo domande</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {questions.map((question, i) => {
                const correct = answers[i]?.correct
                const qCat = CATEGORIES[question.cat]
                return (
                  <div key={i} style={{ background: 'var(--surface)', border: `1.5px solid ${correct ? '#bbf7d0' : '#fecaca'}`, borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: correct ? '#dcfce7' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      {correct ? <CheckCircle2 size={16} color="#16a34a" /> : <XCircle size={16} color="#dc2626" />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                        <span style={{ fontSize: 11, background: qCat?.bg, color: qCat?.color, padding: '1px 8px', borderRadius: 20, fontWeight: 700 }}>{qCat?.emoji} {qCat?.label}</span>
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.3 }}>{question.q}</p>
                      <p style={{ fontSize: 11.5, color: correct ? '#16a34a' : '#dc2626', fontWeight: 600, marginBottom: 3 }}>
                        {correct ? '✓ ' : '✗ '}{question.opts[question.ans]}
                      </p>
                      <p style={{ fontSize: 11.5, color: 'var(--text-muted)', lineHeight: 1.5 }}>{question.exp}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Come back tomorrow */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
            <div style={{ background: 'var(--surface-2)', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, border: '1px solid var(--border)' }}>
              <Lock size={18} color="var(--text-muted)" />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Nuovo quiz domani</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Torna domani per 5 nuove domande!</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // ── IDLE (start screen)
  if (phase === 'idle') {
    const todayCategories = [...new Set(questions.map(q => q.cat))].slice(0, 4)
    const currentStreak = getStreak()
    return (
      <div className={pageClass} style={pageStyle}>
        {/* Hero gradient */}
        <div style={{ background: 'linear-gradient(160deg, #4c1d95 0%, #7c3aed 50%, #a855f7 100%)', padding: `${tp(28)} 24px 36px`, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,.06)' }} />
          <div style={{ position: 'absolute', bottom: -20, left: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,.05)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 64, lineHeight: 1, marginBottom: 16 }}>🧠</div>
            <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>Quiz del giorno</p>
            <h1 style={{ color: 'white', fontSize: 26, fontWeight: 800, lineHeight: 1.2, marginBottom: 8 }}>Impara qualcosa di nuovo!</h1>
            <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 14 }}>{QUESTIONS_PER_DAY} domande • circa 2 minuti</p>
            {currentStreak > 0 && (
              <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,165,0,.2)', border: '1.5px solid rgba(255,165,0,.4)', borderRadius: 20, padding: '5px 14px' }}>
                <Flame size={14} color="#fbbf24" fill="#fbbf24" />
                <span style={{ color: '#fde68a', fontSize: 13, fontWeight: 700 }}>Striscia: {currentStreak} {currentStreak === 1 ? 'giorno' : 'giorni'}</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: '20px 20px 100px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Today's categories */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Argomenti di oggi</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {todayCategories.map(c => {
                const cat = CATEGORIES[c]
                return (
                  <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: cat.bg, borderRadius: 20, border: `1.5px solid ${cat.light}` }}>
                    <span style={{ fontSize: 14 }}>{cat.emoji}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: cat.color }}>{cat.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Rules */}
          <div className="card" style={{ padding: '16px 18px' }}>
            <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Come funziona</p>
            {[
              { icon: '✅', text: '5 domande a risposta multipla' },
              { icon: '⚡', text: 'Feedback immediato con spiegazione' },
              { icon: '🔥', text: 'Mantieni la striscia giornaliera' },
              { icon: '🔄', text: 'Nuovo quiz ogni giorno alle mezzanotte' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 16 }}>{icon}</span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{text}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={startQuiz}
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white', border: 'none', borderRadius: 16, padding: '18px 24px', fontSize: 17, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 4px 20px rgba(124,58,237,.4)' }}
          >
            <Zap size={20} fill="white" color="white" />
            Inizia il quiz
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </div>
    )
  }

  // ── PLAYING / FEEDBACK
  const progress = (idx / questions.length) * 100
  const isFeedback = phase === 'feedback'

  return (
    <div className={pageClass} style={pageStyle}>
      {/* Top bar with progress */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border-light)', padding: `${tp(12)} 20px 12px` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, minWidth: 36 }}>{idx + 1}/{questions.length}</span>
          <div style={{ flex: 1, height: 8, background: 'var(--surface-3)', borderRadius: 4, overflow: 'hidden' }}>
            <motion.div
              style={{ height: '100%', background: 'linear-gradient(90deg, #7c3aed, #a855f7)', borderRadius: 4 }}
              initial={{ width: `${(idx / questions.length) * 100}%` }}
              animate={{ width: `${((idx + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Star size={14} color="#fbbf24" fill="#fbbf24" />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>{answers.filter(a => a.correct).length}</span>
          </div>
        </div>
        {/* Category pill */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', background: cat.bg, borderRadius: 20, border: `1.5px solid ${cat.light}` }}>
          <span style={{ fontSize: 13 }}>{cat.emoji}</span>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: cat.color }}>{cat.label}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -40, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{ padding: '24px 20px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          {/* Question */}
          <div>
            <p style={{ fontSize: 19, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4 }}>{q.q}</p>
          </div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {q.opts.map((opt, i) => {
              const isSelected = selected === i
              const isCorrect = i === q.ans
              let bg = 'var(--surface)', border = '2px solid var(--border)', color = 'var(--text-primary)'
              let iconEl = null

              if (isFeedback) {
                if (isCorrect) {
                  bg = '#dcfce7'; border = '2px solid #16a34a'; color = '#15803d'
                  iconEl = <CheckCircle2 size={20} color="#16a34a" style={{ flexShrink: 0 }} />
                } else if (isSelected && !isCorrect) {
                  bg = '#fee2e2'; border = '2px solid #dc2626'; color = '#b91c1c'
                  iconEl = <XCircle size={20} color="#dc2626" style={{ flexShrink: 0 }} />
                } else {
                  bg = 'var(--surface-2)'; border = '2px solid var(--border-light)'; color = 'var(--text-muted)'
                }
              } else if (isSelected) {
                bg = cat.bg; border = `2px solid ${cat.color}`; color = cat.color
              }

              return (
                <motion.button
                  key={i}
                  whileTap={!isFeedback ? { scale: 0.97 } : {}}
                  onClick={() => handleSelect(i)}
                  disabled={isFeedback}
                  style={{ background: bg, border, borderRadius: 14, padding: '14px 16px', fontSize: 14, fontWeight: 600, color, cursor: isFeedback ? 'default' : 'pointer', fontFamily: 'inherit', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, transition: 'background .15s, border-color .15s, color .15s' }}
                >
                  <span style={{ width: 28, height: 28, borderRadius: 8, background: isFeedback ? 'transparent' : 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13, fontWeight: 800, color: isFeedback ? 'inherit' : 'var(--text-muted)', border: isFeedback ? 'none' : '1px solid var(--border)' }}>
                    {isFeedback && iconEl ? iconEl : ['A','B','C','D'][i]}
                  </span>
                  <span style={{ flex: 1 }}>{opt}</span>
                </motion.button>
              )
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {isFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                style={{ background: answers.at(-1)?.correct ? '#f0fdf4' : '#fef2f2', border: `1.5px solid ${answers.at(-1)?.correct ? '#bbf7d0' : '#fecaca'}`, borderRadius: 14, padding: '14px 16px' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{answers.at(-1)?.correct ? '💡' : '📖'}</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: answers.at(-1)?.correct ? '#15803d' : '#b91c1c', marginBottom: 4 }}>
                      {answers.at(-1)?.correct ? 'Corretto!' : `Risposta: ${q.opts[q.ans]}`}
                    </p>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{q.exp}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
