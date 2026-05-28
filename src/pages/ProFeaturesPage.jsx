import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Star, Check, X, Crown, Zap, ChevronRight } from 'lucide-react'
import { useSubscription, PAYMENTS_ACTIVE } from '../hooks/useSubscription'

// ─── Feature definitions ──────────────────────────────────────────────────────
const FEATURES = [
  {
    id: 'diary',
    emoji: '📅',
    title: 'Diario illimitato',
    subtitle: 'Storico senza confini',
    gradient: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
    color: '#0F766E',
    pale: '#F0FDFA',
    description:
      'Con il piano Free il diario è limitato agli ultimi 7 giorni. Con il Pro accedi a tutto il tuo storico alimentare senza limiti di tempo. Puoi anche pianificare i pasti dei giorni futuri — utile per prepararti in anticipo.',
    highlights: [
      'Storico alimentare illimitato nel tempo',
      'Pianifica i pasti dei giorni futuri',
      'Identifica pattern e abitudini nel lungo periodo',
    ],
    illustration: ({ color, pale }) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
          {Array.from({ length: 28 }, (_, i) => {
            const highlighted = [2, 3, 7, 8, 9, 13, 14, 15, 16, 20, 21]
            return (
              <div key={i} style={{
                width: 10, height: 10, borderRadius: 3,
                background: highlighted.includes(i) ? color : pale,
                border: `1.5px solid ${highlighted.includes(i) ? color : '#e2e8f0'}`,
                opacity: i === 22 ? 0.4 : i === 23 ? 0.25 : 1,
              }} />
            )
          })}
        </div>
        <div style={{ fontSize: 9, color, fontWeight: 700, marginTop: 2, letterSpacing: '0.05em' }}>∞ giorni</div>
      </div>
    ),
  },
  {
    id: 'micro',
    emoji: '🔬',
    title: 'Micronutrienti',
    subtitle: 'Vai oltre le calorie',
    gradient: 'linear-gradient(135deg, #6D28D9 0%, #8B5CF6 100%)',
    color: '#7C3AED',
    pale: '#F5F3FF',
    description:
      'Le calorie non raccontano tutta la storia. Con i micronutrienti Pro monitori fibre alimentari, zuccheri semplici, grassi saturi e molto altro. Scopri davvero la qualità di ciò che mangi ogni giorno.',
    highlights: [
      'Fibre alimentari totali giornaliere',
      'Zuccheri semplici e grassi saturi',
      'Dashboard nutrizione qualitativa avanzata',
    ],
    illustration: ({ color, pale }) => (
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        {[
          { label: 'Fibre', pct: 72, c: '#7C3AED' },
          { label: 'Zucch.', pct: 48, c: '#A855F7' },
          { label: 'G.Sat.', pct: 61, c: '#C084FC' },
          { label: 'Sodio', pct: 35, c: '#DDD6FE' },
        ].map((b, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: b.c }}>{b.pct}%</div>
            <div style={{ width: 16, height: 50, background: '#F3F0FF', borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div style={{ width: '100%', height: `${b.pct}%`, background: b.c, borderRadius: 4, transition: 'height 0.6s ease' }} />
            </div>
            <div style={{ fontSize: 8, color: '#94A3B8', textAlign: 'center', width: 24, lineHeight: 1.2 }}>{b.label}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'stats',
    emoji: '📊',
    title: 'Statistiche avanzate',
    subtitle: 'I tuoi trend nel tempo',
    gradient: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
    color: '#1D4ED8',
    pale: '#EFF6FF',
    description:
      'Grafici interattivi che mostrano l\'andamento di calorie, macronutrienti e peso nel tempo. Identifica i giorni migliori, analizza i pattern settimanali e scopri dove puoi migliorare.',
    highlights: [
      'Grafici trend settimanali e mensili',
      'Analisi calorie per tipo di pasto',
      'Confronto con gli obiettivi calorici del piano',
    ],
    illustration: ({ color, pale }) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 50 }}>
          {[38, 55, 42, 70, 58, 80, 65].map((h, i) => (
            <div key={i} style={{
              flex: 1, height: `${h}%`, background: i === 5 ? color : pale,
              borderRadius: 3, border: `1.5px solid ${i === 5 ? color : '#BFDBFE'}`,
              position: 'relative',
            }}>
              {i === 5 && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', fontSize: 8, fontWeight: 700, color, whiteSpace: 'nowrap' }}>best</div>
              )}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 2px' }}>
          {['L', 'M', 'M', 'G', 'V', 'S', 'D'].map((d, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 8, color: '#94A3B8', fontWeight: 600 }}>{d}</div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'adherence',
    emoji: '🎯',
    title: 'Aderenza al piano',
    subtitle: 'Segui la dieta al meglio',
    gradient: 'linear-gradient(135deg, #92400E 0%, #F59E0B 100%)',
    color: '#B45309',
    pale: '#FFFBEB',
    description:
      'Scopri in percentuale quanto stai seguendo il piano alimentare prescritto dal tuo dietista. Analisi automatica giornaliera con confronto tra pasti prescritti e quelli effettivamente consumati.',
    highlights: [
      'Percentuale aderenza giornaliera automatica',
      'Confronto pasto prescritto vs consumato',
      'Storico aderenza settimana per settimana',
    ],
    illustration: ({ color, pale }) => {
      const pct = 82
      const r = 22
      const circ = 2 * Math.PI * r
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ position: 'relative', width: 60, height: 60 }}>
            <svg width={60} height={60} style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={30} cy={30} r={r} fill="none" stroke={pale} strokeWidth={6} />
              <circle cx={30} cy={30} r={r} fill="none" stroke={color} strokeWidth={6}
                strokeLinecap="round" strokeDasharray={circ}
                strokeDashoffset={circ - (pct / 100) * circ} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 800, color, lineHeight: 1 }}>{pct}%</span>
            </div>
          </div>
          <div style={{ fontSize: 9, color: '#92400E', fontWeight: 700 }}>Aderenza oggi</div>
        </div>
      )
    },
  },
  {
    id: 'pdf',
    emoji: '📄',
    title: 'Report PDF',
    subtitle: 'Porta i dati dal dietista',
    gradient: 'linear-gradient(135deg, #0E7490 0%, #06B6D4 100%)',
    color: '#0E7490',
    pale: '#ECFEFF',
    description:
      'Genera report PDF professionali del tuo diario alimentare. Riepilogo calorico, grafici macronutrienti e andamento settimanale, pronti da condividere con il tuo dietista prima di ogni visita.',
    highlights: [
      'Report settimanale e mensile in PDF',
      'Grafici nutrizionali e riepilogo macros',
      'Condividi in un tap con il dietista',
    ],
    illustration: ({ color, pale }) => (
      <div style={{ position: 'relative', width: 52, height: 64 }}>
        <div style={{ position: 'absolute', top: 4, left: 4, width: 48, height: 60, background: '#E0F2FE', borderRadius: 6, border: '1.5px solid #BAE6FD' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, width: 48, height: 60, background: 'white', borderRadius: 6, border: `1.5px solid ${color}`, padding: '8px 7px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ height: 4, background: color, borderRadius: 2, width: '70%' }} />
          {[90, 70, 80, 55, 65, 75].map((w, i) => (
            <div key={i} style={{ height: 3, background: i === 0 ? color : '#E0F2FE', borderRadius: 2, width: `${w}%`, opacity: i === 0 ? 0.7 : 1 }} />
          ))}
          <div style={{ height: 3, background: color, borderRadius: 2, width: '40%', marginTop: 2, opacity: 0.5 }} />
        </div>
        <div style={{ position: 'absolute', top: 2, right: -4, background: color, color: 'white', fontSize: 8, fontWeight: 700, padding: '2px 5px', borderRadius: 4 }}>PDF</div>
      </div>
    ),
  },
  {
    id: 'activity',
    emoji: '🏃',
    title: 'Attività avanzata',
    subtitle: 'Sport e nutrizione uniti',
    gradient: 'linear-gradient(135deg, #C2410C 0%, #F97316 100%)',
    color: '#EA580C',
    pale: '#FFF7ED',
    description:
      'Tracciamento avanzato dell\'attività fisica con calcolo delle calorie bruciate per ogni esercizio. Visualizza il bilancio energetico netto: calorie introdotte meno quelle bruciate in un\'unica dashboard.',
    highlights: [
      'Calorie bruciate per tipo di attività',
      'Bilancio energetico netto giornaliero',
      'Storico allenamenti illimitato',
    ],
    illustration: ({ color }) => {
      const pts = [30, 18, 32, 12, 28, 8, 22, 15, 25, 10]
      const maxH = 40
      return (
        <div style={{ position: 'relative', height: 50, width: 100 }}>
          <svg width={100} height={50} style={{ overflow: 'visible' }}>
            <polyline
              points={pts.map((y, x) => `${x * 11},${maxH - y}`).join(' ')}
              fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            />
            {pts.map((y, x) => (
              <circle key={x} cx={x * 11} cy={maxH - y} r={x === 1 ? 3 : 2} fill={x === 1 ? color : 'white'} stroke={color} strokeWidth={1.5} />
            ))}
          </svg>
          <div style={{ position: 'absolute', bottom: 0, right: 0, fontSize: 9, fontWeight: 700, color, background: '#FFF7ED', padding: '1px 5px', borderRadius: 4, border: `1px solid ${color}` }}>−420 kcal</div>
        </div>
      )
    },
  },
  {
    id: 'progress',
    emoji: '📈',
    title: 'Progressi avanzati',
    subtitle: 'La tua trasformazione',
    gradient: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)',
    color: '#6D28D9',
    pale: '#EDE9FE',
    description:
      'Grafici storici illimitati di peso e BMI. Vedi l\'evoluzione della tua composizione corporea, imposta obiettivi intermedi e osserva la tua trasformazione mese dopo mese.',
    highlights: [
      'Grafico peso illimitato nel tempo',
      'Andamento BMI e confronto con il target',
      'Milestone e obiettivi intermedi',
    ],
    illustration: ({ color }) => {
      const weights = [88, 87, 86.5, 87, 85.5, 84, 83.5, 82]
      const minW = Math.min(...weights), maxW = Math.max(...weights)
      const toY = (w) => 40 - ((w - minW) / (maxW - minW)) * 35
      return (
        <div style={{ position: 'relative', height: 50, width: 100 }}>
          <svg width={100} height={50} style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <polygon
              points={[...weights.map((w, x) => `${x * 14},${toY(w)}`), `${(weights.length - 1) * 14},50`, `0,50`].join(' ')}
              fill="url(#pg)"
            />
            <polyline
              points={weights.map((w, x) => `${x * 14},${toY(w)}`).join(' ')}
              fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            />
            {weights.map((w, x) => x === weights.length - 1 && (
              <circle key={x} cx={x * 14} cy={toY(w)} r={3} fill={color} />
            ))}
          </svg>
          <div style={{ position: 'absolute', bottom: 0, right: 0, fontSize: 9, fontWeight: 700, color, background: '#EDE9FE', padding: '1px 5px', borderRadius: 4, border: `1px solid ${color}` }}>−6 kg</div>
        </div>
      )
    },
  },
  {
    id: 'recipes',
    emoji: '🍳',
    title: 'Ricette illimitate',
    subtitle: 'Il tuo ricettario digitale',
    gradient: 'linear-gradient(135deg, #065F46 0%, #10B981 100%)',
    color: '#065F46',
    pale: '#ECFDF5',
    description:
      'Crea e salva quante ricette vuoi nel tuo ricettario personale. Aggiungi ingredienti dal database CREA+BDA, ottieni automaticamente i valori nutrizionali completi e aggiungile al diario in un solo tap.',
    highlights: [
      'Ricette personali illimitate (vs 5 nel Free)',
      'Valori nutrizionali calcolati automaticamente',
      'Aggiungi al diario con un solo tap',
    ],
    illustration: ({ color, pale }) => (
      <div style={{ position: 'relative', width: 80, height: 56 }}>
        {[2, 1, 0].map((z) => (
          <div key={z} style={{
            position: 'absolute',
            top: z * 6, left: z * 4,
            width: 65, height: 44,
            background: z === 0 ? 'white' : pale,
            border: `1.5px solid ${z === 0 ? color : '#A7F3D0'}`,
            borderRadius: 8,
            boxShadow: z === 0 ? `0 2px 8px rgba(6,95,70,.15)` : 'none',
            padding: z === 0 ? '7px 8px' : 0,
            display: z === 0 ? 'flex' : 'block',
            flexDirection: 'column',
            gap: 4,
          }}>
            {z === 0 && <>
              <div style={{ height: 3, background: color, borderRadius: 2, width: '65%' }} />
              <div style={{ height: 3, background: '#D1FAE5', borderRadius: 2, width: '90%' }} />
              <div style={{ height: 3, background: '#D1FAE5', borderRadius: 2, width: '75%' }} />
              <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
                {['P', 'C', 'G'].map(l => (
                  <div key={l} style={{ flex: 1, height: 10, background: '#ECFDF5', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 7, color, fontWeight: 700 }}>{l}</span>
                  </div>
                ))}
              </div>
            </>}
          </div>
        ))}
        <div style={{ position: 'absolute', top: -4, right: -4, background: color, color: 'white', fontSize: 9, fontWeight: 700, padding: '2px 5px', borderRadius: 10 }}>∞</div>
      </div>
    ),
  },
]

// ─── Comparison rows ──────────────────────────────────────────────────────────
const COMPARE = [
  { label: 'Diario alimentare', free: '7 giorni', pro: '∞ illimitato' },
  { label: 'Piani futuri', free: false, pro: true },
  { label: 'Micronutrienti', free: false, pro: true },
  { label: 'Statistiche avanzate', free: false, pro: true },
  { label: 'Aderenza al piano', free: false, pro: true },
  { label: 'Report PDF', free: false, pro: true },
  { label: 'Attività avanzata', free: false, pro: true },
  { label: 'Ricette', free: '5 ricette', pro: '∞ illimitate' },
]

// ─── FeatureCard ─────────────────────────────────────────────────────────────
function FeatureCard({ feature, onOpen }) {
  const Illus = feature.illustration
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onOpen}
      style={{
        background: 'var(--surface)',
        border: '1.5px solid var(--border-light)',
        borderRadius: 18,
        padding: '18px 14px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 10,
        width: '100%',
        textAlign: 'left',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.15s',
      }}
    >
      {/* Gradient accent top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: feature.gradient, borderRadius: '18px 18px 0 0' }} />

      {/* Emoji icon */}
      <div style={{
        width: 44, height: 44, borderRadius: 13,
        background: feature.gradient,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, boxShadow: `0 3px 10px ${feature.color}33`,
      }}>
        {feature.emoji}
      </div>

      {/* Title + subtitle */}
      <div>
        <p style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.2 }}>{feature.title}</p>
        <p style={{ fontSize: 11.5, color: 'var(--text-muted)', margin: '3px 0 0', lineHeight: 1.3 }}>{feature.subtitle}</p>
      </div>

      {/* "Scopri" CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 'auto' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: feature.color }}>Scopri</span>
        <ChevronRight size={11} color={feature.color} />
      </div>
    </motion.button>
  )
}

// ─── Feature detail bottom sheet ─────────────────────────────────────────────
function FeatureSheet({ feature, onClose, onSubscribe }) {
  const Illus = feature.illustration
  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      />
      <motion.div
        key="sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 201,
          background: 'var(--surface)',
          borderRadius: '24px 24px 0 0',
          maxHeight: '88vh', overflowY: 'auto',
          paddingBottom: 'calc(24px + env(safe-area-inset-bottom))',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)' }} />
        </div>

        {/* Header gradient */}
        <div style={{
          background: feature.gradient,
          margin: '14px 18px 0',
          borderRadius: 18,
          padding: '22px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ position: 'absolute', bottom: -30, right: 30, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 36, lineHeight: 1, marginBottom: 8 }}>{feature.emoji}</div>
            <h2 style={{ color: 'white', fontSize: 20, fontWeight: 800, margin: '0 0 3px', fontFamily: 'var(--font-display, serif)' }}>{feature.title}</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, margin: 0 }}>{feature.subtitle}</p>
          </div>

          {/* Mini illustration */}
          <div style={{ position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: '10px 12px', backdropFilter: 'blur(8px)' }}>
            <Illus color="rgba(255,255,255,0.9)" pale="rgba(255,255,255,0.2)" />
          </div>
        </div>

        {/* Close button */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 20, right: 20, zIndex: 10,
          width: 32, height: 32, borderRadius: '50%',
          background: 'var(--surface-2)', border: '1.5px solid var(--border-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <X size={15} color="var(--text-muted)" />
        </button>

        {/* Content */}
        <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Description */}
          <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
            {feature.description}
          </p>

          {/* Highlights */}
          <div style={{ background: 'var(--surface-2)', borderRadius: 14, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: feature.color, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Include</p>
            {feature.highlights.map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                  background: feature.pale, border: `1.5px solid ${feature.color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Check size={11} color={feature.color} />
                </div>
                <p style={{ fontSize: 13.5, color: 'var(--text-primary)', margin: 0, lineHeight: 1.45 }}>{h}</p>
              </div>
            ))}
          </div>

          {/* Pro badge */}
          <div style={{
            background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
            border: '1.5px solid #FDE68A', borderRadius: 12, padding: '12px 14px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <Crown size={18} color="#D97706" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: 12.5, color: '#92400E', margin: 0, lineHeight: 1.4 }}>
              Funzione esclusiva del piano <strong>NutriPlan Pro</strong> · €5,99/mese
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={onSubscribe}
            style={{
              width: '100%', padding: '14px 0', borderRadius: 14, border: 'none',
              background: feature.gradient,
              color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: `0 4px 16px ${feature.color}44`,
            }}
          >
            <Star size={16} />
            Sblocca con il Pro
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ProFeaturesPage() {
  const navigate = useNavigate()
  const { isPro } = useSubscription()
  const [activeFeature, setActiveFeature] = useState(null)

  function handleSubscribe() {
    setActiveFeature(null)
    navigate('/abbonamento')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', overflowY: 'auto', paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}>

      {/* ── Hero ── */}
      <div style={{
        background: 'linear-gradient(160deg, #064E3B 0%, #0F766E 50%, #059669 100%)',
        padding: 'calc(env(safe-area-inset-top) + 14px) 18px 28px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative bg circles */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -30, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        {/* Back button */}
        <button onClick={() => navigate(-1)} style={{
          background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10,
          width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'white', marginBottom: 20, position: 'relative', zIndex: 1,
        }}>
          <ArrowLeft size={18} />
        </button>

        {/* Crown icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'rgba(251,191,36,0.25)', border: '1.5px solid rgba(251,191,36,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Crown size={24} color="#FCD34D" />
          </div>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700 }}>NutriPlan</p>
            <h1 style={{ color: 'white', fontSize: 24, fontWeight: 800, margin: 0, fontFamily: 'var(--font-display, serif)', lineHeight: 1 }}>Piano Pro</h1>
          </div>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 14.5, lineHeight: 1.55, margin: '0 0 18px', position: 'relative', zIndex: 1 }}>
          Il massimo della nutrizione personalizzata. <strong style={{ color: 'white' }}>8 funzioni esclusive</strong> per seguire al meglio la tua alimentazione.
        </p>

        {/* Price badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.3)',
          borderRadius: 12, padding: '9px 14px', marginBottom: 16, position: 'relative', zIndex: 1,
        }}>
          <Star size={14} color="#FCD34D" fill="#FCD34D" />
          <span style={{ color: 'white', fontSize: 13.5, fontWeight: 700 }}>€5,99/mese</span>
          <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.3)' }} />
          <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12.5 }}>7 giorni gratis</span>
        </div>

        {/* CTA button */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleSubscribe}
          style={{
            width: '100%', padding: '14px 0', borderRadius: 14, border: 'none',
            background: 'white', color: '#0F766E', fontWeight: 800, fontSize: 15,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)', position: 'relative', zIndex: 1,
          }}
        >
          <Star size={16} color="#0F766E" fill="#0F766E" />
          {isPro ? '✅ Piano Pro attivo' : 'Inizia 7 giorni gratuiti'}
        </motion.button>

        {!isPro && (
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, textAlign: 'center', marginTop: 8, position: 'relative', zIndex: 1 }}>
            Nessuna carta di credito richiesta per la prova
          </p>
        )}
      </div>

      <div style={{ padding: '22px 16px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* ── Features grid ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 3, height: 18, background: 'linear-gradient(180deg, #0F766E, #10B981)', borderRadius: 2 }} />
            <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>8 funzioni esclusive</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {FEATURES.map(f => (
              <FeatureCard key={f.id} feature={f} onOpen={() => setActiveFeature(f)} />
            ))}
          </div>
        </div>

        {/* ── Comparison table ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 3, height: 18, background: 'linear-gradient(180deg, #0F766E, #10B981)', borderRadius: 2 }} />
            <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Free vs Pro</p>
          </div>
          <div style={{
            background: 'var(--surface)', border: '1.5px solid var(--border-light)',
            borderRadius: 18, overflow: 'hidden',
          }}>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ padding: '11px 14px', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Funzione</div>
              <div style={{ padding: '11px 8px', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Free</div>
              <div style={{ padding: '11px 8px', fontSize: 11, fontWeight: 700, color: '#0F766E', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.06em', background: '#F0FDFA' }}>⭐ Pro</div>
            </div>
            {COMPARE.map((row, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '1fr 80px 100px',
                borderBottom: i < COMPARE.length - 1 ? '1px solid var(--border-light)' : 'none',
              }}>
                <div style={{ padding: '11px 14px', fontSize: 12.5, color: 'var(--text-primary)', fontWeight: 500, display: 'flex', alignItems: 'center' }}>{row.label}</div>
                <div style={{ padding: '11px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {row.free === false
                    ? <X size={14} color="#94A3B8" />
                    : <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textAlign: 'center' }}>{row.free}</span>}
                </div>
                <div style={{ padding: '11px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0FDFA' }}>
                  {row.pro === true
                    ? <Check size={14} color="#0F766E" />
                    : <span style={{ fontSize: 11, color: '#0F766E', fontWeight: 700, textAlign: 'center' }}>{row.pro}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Trust signals ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { emoji: '🔒', label: 'Pagamenti sicuri', sub: 'via Stripe PCI' },
            { emoji: '🔄', label: 'Cancella quando', sub: 'vuoi, senza vincoli' },
            { emoji: '🎁', label: '7 giorni gratis', sub: 'senza carta' },
          ].map((t, i) => (
            <div key={i} style={{
              background: 'var(--surface)', border: '1.5px solid var(--border-light)',
              borderRadius: 14, padding: '12px 10px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 22, marginBottom: 5 }}>{t.emoji}</div>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px', lineHeight: 1.3 }}>{t.label}</p>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: 0, lineHeight: 1.3 }}>{t.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Final CTA ── */}
        <div style={{
          background: 'linear-gradient(135deg, #064E3B, #0F766E)',
          borderRadius: 20, padding: '24px 20px', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <Crown size={28} color="#FCD34D" style={{ marginBottom: 10 }} />
          <h3 style={{ color: 'white', fontSize: 19, fontWeight: 800, margin: '0 0 6px', fontFamily: 'var(--font-display, serif)' }}>NutriPlan Pro</h3>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, margin: '0 0 6px' }}>
            €5,99/mese · fatturato mensilmente
          </p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, margin: '0 0 18px' }}>
            7 giorni gratis, poi €5,99/mese
          </p>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleSubscribe}
            style={{
              width: '100%', padding: '14px 0', borderRadius: 14, border: 'none',
              background: 'white', color: '#0F766E', fontWeight: 800, fontSize: 15,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            }}
          >
            <Star size={16} color="#0F766E" fill="#0F766E" />
            {isPro ? '✅ Piano Pro attivo' : 'Inizia 7 giorni gratuiti'}
          </motion.button>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10.5, marginTop: 10, margin: '10px 0 0' }}>
            Nessun impegno · Cancella in qualsiasi momento
          </p>
        </div>

      </div>

      {/* Feature detail bottom sheet */}
      <AnimatePresence>
        {activeFeature && (
          <FeatureSheet
            feature={activeFeature}
            onClose={() => setActiveFeature(null)}
            onSubscribe={handleSubscribe}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
