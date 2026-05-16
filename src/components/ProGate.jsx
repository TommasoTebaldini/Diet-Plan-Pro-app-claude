import { useNavigate } from 'react-router-dom'
import { Lock, Star } from 'lucide-react'
import { useSubscription, PAYMENTS_ACTIVE } from '../hooks/useSubscription'

/**
 * Wraps Pro-only content. While PAYMENTS_ACTIVE=false renders children unconditionally.
 * When active: shows a paywall overlay if user is not Pro.
 *
 * Props:
 *   feature  — short label shown in the paywall ("Statistiche avanzate")
 *   teaser   — optional preview content shown blurred behind the lock
 *   children — the actual Pro content
 */
export default function ProGate({ feature, teaser, children }) {
  const { isPro } = useSubscription()
  const navigate = useNavigate()

  // Payments inactive: render content for everyone
  if (!PAYMENTS_ACTIVE) return children

  if (isPro) return children

  return (
    <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', minHeight: 200 }}>
      {/* Blurred teaser behind the lock */}
      {teaser && (
        <div style={{ filter: 'blur(6px)', pointerEvents: 'none', userSelect: 'none', opacity: 0.45 }}>
          {teaser}
        </div>
      )}

      {/* Paywall overlay */}
      <div style={{
        position: teaser ? 'absolute' : 'relative',
        inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 12, padding: 28, textAlign: 'center',
        background: teaser ? 'rgba(255,255,255,0.82)' : 'var(--surface-2)',
        backdropFilter: teaser ? 'blur(4px)' : undefined,
        borderRadius: 16,
        border: '1.5px solid var(--border-light)',
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--green-main), var(--green-mid))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Lock size={22} color="white" />
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', margin: '0 0 4px' }}>
            {feature || 'Funzione Premium'}
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
            Disponibile con il piano Pro a €5,99/mese
          </p>
        </div>
        <button
          onClick={() => navigate('/abbonamento')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'linear-gradient(135deg, var(--green-main), var(--green-mid))',
            color: 'white', border: 'none', borderRadius: 12,
            padding: '11px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}
        >
          <Star size={15} />
          Scopri il piano Pro
        </button>
      </div>
    </div>
  )
}
