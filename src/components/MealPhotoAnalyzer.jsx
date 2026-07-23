import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, X, Check, AlertCircle, Loader2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import { analyzeMealPhoto, isMealAIAvailable } from '../lib/mealPhotoAI'

function calcMacros(food) {
  const f = food.grams / 100
  return {
    kcal: Math.round(food.kcal_100g * f),
    proteins: Math.round(food.proteins_100g * f * 10) / 10,
    carbs: Math.round(food.carbs_100g * f * 10) / 10,
    fats: Math.round(food.fats_100g * f * 10) / 10,
  }
}

const CONFIDENCE_COLOR = { alta: '#16a34a', media: '#d97706', bassa: '#dc2626' }

export default function MealPhotoAnalyzer({ onAddFoods, onClose }) {
  const [phase, setPhase] = useState('idle') // idle | analyzing | results | error
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(new Set())
  const [expanded, setExpanded] = useState(true)
  const [grams, setGrams] = useState({})
  const inputRef = useRef()

  async function handleFile(file) {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    setPhase('analyzing')
    setError('')
    try {
      const res = await analyzeMealPhoto(file)
      setResult(res)
      setSelected(new Set(res.foods.map((_, i) => i)))
      setGrams(Object.fromEntries(res.foods.map((f, i) => [i, String(f.grams)])))
      setPhase('results')
    } catch (e) {
      setError(e.message || 'Errore analisi foto')
      setPhase('error')
    }
  }

  function handleCapture(e) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function toggleFood(i) {
    setSelected(s => {
      const ns = new Set(s)
      ns.has(i) ? ns.delete(i) : ns.add(i)
      return ns
    })
  }

  function handleAdd() {
    if (!result) return
    const foods = result.foods
      .filter((_, i) => selected.has(i))
      .map((f, i) => {
        const g = parseFloat(grams[i]) || f.grams
        return {
          food_name: f.name,
          grams: g,
          ...(() => {
            const factor = g / 100
            return {
              kcal: Math.round(f.kcal_100g * factor),
              proteins: Math.round(f.proteins_100g * factor * 10) / 10,
              carbs: Math.round(f.carbs_100g * factor * 10) / 10,
              fats: Math.round(f.fats_100g * factor * 10) / 10,
              food_data: { source: 'photo_ai', kcal_100g: f.kcal_100g, proteins_100g: f.proteins_100g, carbs_100g: f.carbs_100g, fats_100g: f.fats_100g },
            }
          })(),
        }
      })
    onAddFoods(foods)
    onClose()
  }

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'flex-end', backdropFilter: 'blur(4px)' }}>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 280 }}
        style={{ width: '100%', maxWidth: 480, margin: '0 auto', background: 'var(--surface)', borderRadius: '24px 24px 0 0', padding: '20px 20px calc(28px + env(safe-area-inset-bottom))', maxHeight: '92dvh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(135deg, #7c3aed, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={18} color="white" />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Analisi foto pasto</h3>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>AI riconosce gli alimenti automaticamente</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'var(--surface-3)', border: 'none', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={16} color="var(--text-muted)" />
          </button>
        </div>

        {/* Server setup hint — shown only on specific error */}

        {/* Idle: show capture button */}
        {phase === 'idle' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '30px 0' }}>
            <div style={{ width: 90, height: 90, borderRadius: 24, background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '2px dashed #a78bfa' }}>
              <Camera size={36} color="#7c3aed" />
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Scatta o carica una foto del pasto</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>L'AI identificherà gli alimenti e stimerà le calorie</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button
                onClick={() => { inputRef.current.capture = 'environment'; inputRef.current.click() }}
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white', border: 'none', borderRadius: 14, padding: '13px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <Camera size={16} /> Fotocamera
              </button>
              <button
                onClick={() => { inputRef.current.removeAttribute('capture'); inputRef.current.click() }}
                style={{ background: 'var(--surface-3)', color: 'var(--text-primary)', border: '1.5px solid var(--border)', borderRadius: 14, padding: '13px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
              >
                Galleria
              </button>
            </div>
            <input ref={inputRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleCapture} />
          </motion.div>
        )}

        {/* Analyzing */}
        {phase === 'analyzing' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '20px 0' }}>
            {preview && <img src={preview} alt="pasto" style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 16, marginBottom: 20 }} />}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 10 }}>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                <Loader2 size={22} color="#7c3aed" />
              </motion.div>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#7c3aed' }}>Analisi in corso…</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>L'AI sta identificando gli alimenti nel piatto</p>
          </motion.div>
        )}

        {/* Error */}
        {phase === 'error' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '10px 0' }}>
            <div className="alert-error" style={{ marginBottom: 12, lineHeight: 1.5 }}>
              <strong>Errore analisi</strong><br />{error}
            </div>
            {error?.includes('chiave AI') || error?.includes('Secrets') ? (
              <div className="alert-info" style={{ marginBottom: 16, fontSize: 12, lineHeight: 1.6 }}>
                <strong>Setup richiesto (una volta sola):</strong><br />
                1. Ottieni una chiave gratuita su <strong>aistudio.google.com</strong><br />
                2. Supabase Dashboard → Edge Functions → <code>analyze-meal</code> → Secrets<br />
                3. Aggiungi <code>GEMINI_API_KEY</code> con la tua chiave<br />
                4. Deploy: <code>supabase functions deploy analyze-meal</code>
              </div>
            ) : null}
            <button onClick={() => setPhase('idle')} className="btn btn-secondary btn-full">Riprova</button>
          </motion.div>
        )}

        {/* Results */}
        {phase === 'results' && result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {preview && <img src={preview} alt="pasto" style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 16, marginBottom: 14 }} />}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700 }}>{result.description || 'Alimenti riconosciuti'}</p>
                <span style={{ fontSize: 11, color: CONFIDENCE_COLOR[result.confidence] || '#666', fontWeight: 600 }}>
                  Confidenza: {result.confidence}
                </span>
              </div>
              <button onClick={() => setExpanded(v => !v)} style={{ background: 'var(--surface-3)', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer' }}>
                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            {/* Total preview */}
            {(() => {
              const tot = result.foods.filter((_, i) => selected.has(i)).reduce((s, f, i) => {
                const g = parseFloat(grams[i]) || f.grams
                const factor = g / 100
                return { kcal: s.kcal + Math.round(f.kcal_100g * factor), p: s.p + f.proteins_100g * factor, c: s.c + f.carbs_100g * factor, fat: s.fat + f.fats_100g * factor }
              }, { kcal: 0, p: 0, c: 0, fat: 0 })
              return (
                <div style={{ background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', borderRadius: 14, padding: '12px 14px', marginBottom: 14, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {[
                    { label: 'kcal', val: tot.kcal, color: '#f59e0b' },
                    { label: 'Proteine', val: `${tot.p.toFixed(1)}g`, color: '#22c55e' },
                    { label: 'Carboidrati', val: `${tot.c.toFixed(1)}g`, color: '#3b82f6' },
                    { label: 'Grassi', val: `${tot.fat.toFixed(1)}g`, color: '#f97316' },
                  ].map(m => (
                    <div key={m.label} style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: m.color }}>{m.val}</p>
                      <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.label}</p>
                    </div>
                  ))}
                </div>
              )
            })()}

            {/* Food list */}
            <AnimatePresence>
              {expanded && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                  {result.foods.map((food, i) => {
                    const g = parseFloat(grams[i]) || food.grams
                    const m = calcMacros({ ...food, grams: g })
                    return (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                        <button onClick={() => toggleFood(i)} style={{ width: 26, height: 26, borderRadius: 8, border: `2px solid ${selected.has(i) ? '#7c3aed' : 'var(--border)'}`, background: selected.has(i) ? '#7c3aed' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                          {selected.has(i) && <Check size={13} color="white" />}
                        </button>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: selected.has(i) ? 'var(--text-primary)' : 'var(--text-muted)' }}>{food.name}</p>
                          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.kcal} kcal · P:{m.proteins}g · C:{m.carbs}g · G:{m.fats}g</p>
                        </div>
                        <input
                          type="number" min={1} inputMode="numeric"
                          value={grams[i] ?? food.grams}
                          onChange={e => setGrams(g => ({ ...g, [i]: e.target.value }))}
                          style={{ width: 62, padding: '6px 8px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--surface-2)', fontSize: 13, color: 'var(--text-primary)', textAlign: 'right' }}
                        />
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>g</span>
                      </motion.div>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button onClick={() => { setPhase('idle'); setPreview(null); setResult(null) }} className="btn btn-secondary" style={{ flex: 1 }}>
                Nuova foto
              </button>
              <button onClick={handleAdd} disabled={selected.size === 0} className="btn" style={{ flex: 2, background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white', borderRadius: 14, padding: '13px 20px', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', opacity: selected.size === 0 ? 0.5 : 1 }}>
                <Check size={15} /> Aggiungi {selected.size} aliment{selected.size === 1 ? 'o' : 'i'}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>,
    document.body
  )
}
