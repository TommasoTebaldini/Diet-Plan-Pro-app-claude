import { useState, useEffect } from 'react'
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
  const tp = (x) => inModal ? `${x}px` : `calc(env(safe-area-inset-top) + ${x}px)`
  const pageClass = inModal ? undefined : 'page'
  const pageStyle = inModal ? { flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: 24 } : { padding: 0 }

  const [phase, setPhase] = useState('loading') // loading | idle | playing | done
  const [questions] = useState(() => getQuestionsForToday())
  // answers[i] = null (not answered yet) | { selected: number, correct: boolean }
  const [answers, setAnswers] = useState(() => Array(QUESTIONS_PER_DAY).fill(null))
  const [idx, setIdx] = useState(0)
  const [streak, setStreak] = useState(0)
  const [finalStreak, setFinalStreak] = useState(0)

  useEffect(() => {
    const prog = loadProgress()
    setStreak(getStreak())
    if (prog?.done) {
      setAnswers(prog.answers || Array(QUESTIONS_PER_DAY).fill(null))
      setPhase('done')
    } else {
      setPhase('idle')
    }
  }, [])

  function startQuiz() {
    setIdx(0)
    setAnswers(Array(QUESTIONS_PER_DAY).fill(null))
    setPhase('playing')
  }

  function handleSelect(optIdx) {
    const q = questions[idx]
    const correct = optIdx === q.ans
    setAnswers(prev => {
      const next = [...prev]
      next[idx] = { selected: optIdx, correct }
      return next
    })
  }

  function goNext() {
    if (idx < questions.length - 1) setIdx(i => i + 1)
  }

  function goPrev() {
    if (idx > 0) setIdx(i => i - 1)
  }

  function finish() {
    const finalAnswers = answers.map(a => a || { selected: -1, correct: false })
    const score = finalAnswers.filter(a => a.correct).length
    const newStreak = updateStreak(true)
    setFinalStreak(newStreak)
    saveProgress({ done: true, score, total: questions.length, answers: finalAnswers, streak: newStreak })
    setPhase('done')
    supabase.from('quiz_results').upsert(
      { user_id: user.id, date: todayKey(), score, total: questions.length, streak: newStreak },
      { onConflict: 'user_id,date' }
    ).catch(() => {})
  }

  // ── LOADING
  if (phase === 'loading') return (
    <div className={pageClass} style={{ ...pageStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #e5e7eb', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  // ── DONE
  if (phase === 'done') {
    const finalScore = answers.filter(a => a?.correct).length
    const pctFinal = finalScore / questions.length
    const msg = pctFinal === 1 ? 'Perfetto! Sei un esperto!' :
                pctFinal >= 0.8 ? 'Ottimo! Quasi tutto giusto!' :
                pctFinal >= 0.5 ? 'Buono! Continua ad imparare.' : 'Non mollare, ritorna domani!'
    const emoji = pctFinal === 1 ? '🏆' : pctFinal >= 0.8 ? '🌟' : pctFinal >= 0.5 ? '📚' : '💪'
    const fs = finalStreak || getStreak()
    return (
      <div className={pageClass} style={pageStyle}>
        <div style={{ background: 'linear-gradient(160deg, #1a7f5a 0%, #14b8a6 100%)', padding: `${tp(24)} 24px 28px`, textAlign: 'center', borderRadius: inModal ? '0' : undefined }}>
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <div style={{ fontSize: 56, lineHeight: 1, marginBottom: 10 }}>{emoji}</div>
          </motion.div>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>Risultato</p>
          <h1 style={{ color: 'white', fontSize: 24, fontWeight: 800, marginBottom: 6 }}>{finalScore}/{questions.length} corrette</h1>
          <p style={{ color: 'rgba(255,255,255,.85)', fontSize: 14 }}>{msg}</p>
          {fs > 0 && (
            <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,165,0,.2)', border: '1.5px solid rgba(255,165,0,.4)', borderRadius: 20, padding: '4px 12px' }}>
              <Flame size={13} color="#fbbf24" fill="#fbbf24" />
              <span style={{ color: '#fde68a', fontSize: 12, fontWeight: 700 }}>Striscia: {fs} {fs === 1 ? 'giorno' : 'giorni'}</span>
            </div>
          )}
        </div>
        <div style={{ padding: '16px 18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <motion.div style={{ textAlign: 'center', padding: '16px', background: '#f9fafb', borderRadius: 14, border: '1px solid #e5e7eb' }}
            initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <ScoreStars score={finalScore} total={questions.length} />
            <p style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>
              {pctFinal === 1 ? '3 stelle — risultato perfetto!' : pctFinal >= 0.8 ? '2 stelle — ottima conoscenza!' : '1 stella — continua a praticare!'}
            </p>
          </motion.div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em' }}>Riepilogo</p>
          {questions.map((question, i) => {
            const ans = answers[i]
            const correct = ans?.correct
            const qCat = CATEGORIES[question.cat]
            return (
              <motion.div key={i} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 + i * 0.07 }}
                style={{ background: 'white', border: `1.5px solid ${correct ? '#bbf7d0' : '#fecaca'}`, borderRadius: 12, padding: '11px 13px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: correct ? '#dcfce7' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {correct ? <CheckCircle2 size={14} color="#16a34a" /> : <XCircle size={14} color="#dc2626" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                    <span style={{ fontSize: 10, background: qCat?.bg, color: qCat?.color, padding: '1px 7px', borderRadius: 20, fontWeight: 700 }}>{qCat?.emoji} {qCat?.label}</span>
                  </div>
                  <p style={{ fontSize: 12.5, fontWeight: 600, color: '#111827', marginBottom: 3, lineHeight: 1.35 }}>{question.q}</p>
                  <p style={{ fontSize: 11.5, color: correct ? '#16a34a' : '#dc2626', fontWeight: 600, marginBottom: 3 }}>
                    {correct ? '✓ ' : '✗ '}{question.opts[question.ans]}
                  </p>
                  <p style={{ fontSize: 11.5, color: '#6b7280', lineHeight: 1.5 }}>{question.exp}</p>
                </div>
              </motion.div>
            )
          })}
          <div style={{ background: '#f3f4f6', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, border: '1px solid #e5e7eb' }}>
            <Lock size={16} color="#9ca3af" />
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Nuovo quiz domani</p>
              <p style={{ fontSize: 11.5, color: '#9ca3af' }}>Torna domani per 5 nuove domande!</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── IDLE
  if (phase === 'idle') {
    const todayCategories = [...new Set(questions.map(q => q.cat))].slice(0, 4)
    const currentStreak = getStreak()
    return (
      <div className={pageClass} style={pageStyle}>
        <div style={{ background: 'linear-gradient(160deg, #4c1d95 0%, #7c3aed 60%, #a855f7 100%)', padding: `${tp(24)} 22px 28px`, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,.06)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 52, lineHeight: 1, marginBottom: 10 }}>🧠</div>
            <h1 style={{ color: 'white', fontSize: 22, fontWeight: 800, lineHeight: 1.2, marginBottom: 6 }}>Impara qualcosa di nuovo!</h1>
            <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 13 }}>{QUESTIONS_PER_DAY} domande • puoi tornare indietro quando vuoi</p>
            {currentStreak > 0 && (
              <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(255,165,0,.2)', border: '1.5px solid rgba(255,165,0,.4)', borderRadius: 20, padding: '4px 12px' }}>
                <Flame size={13} color="#fbbf24" fill="#fbbf24" />
                <span style={{ color: '#fde68a', fontSize: 12, fontWeight: 700 }}>Striscia: {currentStreak} {currentStreak === 1 ? 'giorno' : 'giorni'}</span>
              </div>
            )}
          </div>
        </div>
        <div style={{ padding: '16px 18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {todayCategories.map(c => {
              const cat = CATEGORIES[c]
              return (
                <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 11px', background: cat.bg, borderRadius: 20, border: `1.5px solid ${cat.light}` }}>
                  <span style={{ fontSize: 13 }}>{cat.emoji}</span>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: cat.color }}>{cat.label}</span>
                </div>
              )
            })}
          </div>
          <div style={{ background: '#f9fafb', borderRadius: 14, padding: '14px 16px', border: '1px solid #e5e7eb' }}>
            {[
              { icon: '↩️', text: 'Puoi andare avanti e indietro liberamente' },
              { icon: '💡', text: 'Spiegazione subito dopo ogni risposta' },
              { icon: '🔄', text: 'Puoi cambiare risposta tornando alla domanda' },
              { icon: '🔥', text: 'Mantieni la striscia giornaliera' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8, lastChild: { marginBottom: 0 } }}>
                <span style={{ fontSize: 15 }}>{icon}</span>
                <span style={{ fontSize: 12.5, color: '#4b5563' }}>{text}</span>
              </div>
            ))}
          </div>
          <motion.button whileTap={{ scale: 0.96 }} onClick={startQuiz}
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white', border: 'none', borderRadius: 14, padding: '15px 24px', fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 4px 16px rgba(124,58,237,.4)' }}>
            <Zap size={18} fill="white" color="white" />
            Inizia il quiz
            <ChevronRight size={18} />
          </motion.button>
        </div>
      </div>
    )
  }

  // ── PLAYING
  const q = questions[idx]
  const cat = CATEGORIES[q.cat]
  const currentAnswer = answers[idx]        // null | { selected, correct }
  const isAnswered = currentAnswer !== null
  const isLast = idx === questions.length - 1
  const answeredCount = answers.filter(Boolean).length

  return (
    <div className={pageClass} style={pageStyle}>
      {/* Progress dots */}
      <div style={{ padding: `${tp(12)} 18px 10px`, background: 'white', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          {questions.map((_, i) => {
            const a = answers[i]
            const isCurrent = i === idx
            const color = a ? (a.correct ? '#16a34a' : '#dc2626') : isCurrent ? '#7c3aed' : '#d1d5db'
            const bg = a ? (a.correct ? '#16a34a' : '#dc2626') : isCurrent ? '#7c3aed' : 'transparent'
            return (
              <button key={i} onClick={() => setIdx(i)}
                style={{ flex: 1, height: 8, borderRadius: 4, background: bg, border: `2px solid ${color}`, cursor: 'pointer', transition: 'all .2s', opacity: isCurrent ? 1 : 0.7 }} />
            )
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 9px', background: cat.bg, borderRadius: 20, border: `1.5px solid ${cat.light}` }}>
            <span style={{ fontSize: 12 }}>{cat.emoji}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: cat.color }}>{cat.label}</span>
          </div>
          <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>Domanda {idx + 1} di {questions.length}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={idx}
          initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          style={{ padding: '18px 18px 12px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Question */}
          <p style={{ fontSize: 17, fontWeight: 700, color: '#111827', lineHeight: 1.45 }}>{q.q}</p>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {q.opts.map((opt, i) => {
              const isSelected = currentAnswer?.selected === i
              const isCorrect = i === q.ans
              let bg = 'white', border = '2px solid #e5e7eb', color = '#111827'
              let icon = null
              if (isAnswered) {
                if (isCorrect) { bg = '#f0fdf4'; border = '2px solid #16a34a'; color = '#15803d'; icon = <CheckCircle2 size={18} color="#16a34a" /> }
                else if (isSelected) { bg = '#fef2f2'; border = '2px solid #dc2626'; color = '#b91c1c'; icon = <XCircle size={18} color="#dc2626" /> }
                else { bg = '#f9fafb'; border = '2px solid #e5e7eb'; color = '#9ca3af' }
              } else if (isSelected) {
                bg = cat.bg; border = `2px solid ${cat.color}`; color = cat.color
              }
              return (
                <motion.button key={i} whileTap={!isAnswered ? { scale: 0.97 } : {}}
                  onClick={() => handleSelect(i)}
                  style={{ background: bg, border, borderRadius: 12, padding: '12px 14px', fontSize: 13.5, fontWeight: 600, color, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, transition: 'all .15s' }}>
                  <span style={{ width: 26, height: 26, borderRadius: 7, background: isAnswered ? 'transparent' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 800, color: isAnswered ? 'inherit' : '#6b7280', border: isAnswered ? 'none' : '1px solid #e5e7eb' }}>
                    {isAnswered && icon ? icon : ['A','B','C','D'][i]}
                  </span>
                  <span style={{ flex: 1 }}>{opt}</span>
                </motion.button>
              )
            })}
          </div>

          {/* Explanation — always visible once answered, no timer */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}
                style={{ background: currentAnswer.correct ? '#f0fdf4' : '#fef2f2', border: `1.5px solid ${currentAnswer.correct ? '#bbf7d0' : '#fecaca'}`, borderRadius: 12, padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{currentAnswer.correct ? '💡' : '📖'}</span>
                  <div>
                    <p style={{ fontSize: 12.5, fontWeight: 700, color: currentAnswer.correct ? '#15803d' : '#b91c1c', marginBottom: 4 }}>
                      {currentAnswer.correct ? 'Corretto!' : `Risposta esatta: ${q.opts[q.ans]}`}
                    </p>
                    <p style={{ fontSize: 12.5, color: '#374151', lineHeight: 1.55 }}>{q.exp}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
            {/* Back */}
            <button onClick={goPrev} disabled={idx === 0}
              style={{ flex: 1, padding: '11px 0', borderRadius: 12, border: '2px solid #e5e7eb', background: 'white', fontSize: 13.5, fontWeight: 700, color: idx === 0 ? '#d1d5db' : '#374151', cursor: idx === 0 ? 'default' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              ← Precedente
            </button>

            {/* Forward / Finish */}
            {isLast ? (
              <motion.button whileTap={{ scale: 0.97 }} onClick={finish}
                style={{ flex: 2, padding: '11px 0', borderRadius: 12, border: 'none', background: answeredCount === questions.length ? 'linear-gradient(135deg, #16a34a, #15803d)' : '#d1fae5', fontSize: 13.5, fontWeight: 700, color: answeredCount === questions.length ? 'white' : '#6b7280', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                ✓ Completa quiz {answeredCount < questions.length ? `(${answeredCount}/${questions.length})` : ''}
              </motion.button>
            ) : (
              <button onClick={goNext} disabled={!isAnswered}
                style={{ flex: 2, padding: '11px 0', borderRadius: 12, border: 'none', background: isAnswered ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : '#ede9fe', fontSize: 13.5, fontWeight: 700, color: isAnswered ? 'white' : '#9ca3af', cursor: isAnswered ? 'pointer' : 'default', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                Avanti →
              </button>
            )}
          </div>

          {!isAnswered && (
            <p style={{ textAlign: 'center', fontSize: 11.5, color: '#9ca3af' }}>Seleziona una risposta per continuare</p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
