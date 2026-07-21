import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { jitsiUrl } from '../lib/videoCall'

// z-index vicino al massimo int: la videochiamata deve stare SOPRA qualunque
// altro overlay dell'app (menu, toast, tutorial, sheet arrivano fino a 99999).
const TOP = 2147483000

export default function VideoCallModal({ roomName, displayName, onClose }) {
  if (!roomName) return null
  // Portal su document.body: le pagine sono avvolte in PageTransition
  // (framer-motion, transform) che crea uno stacking context isolato — dentro
  // di esso nemmeno z-index 2 miliardi supera il menu laterale, che vive nel
  // contesto radice. Il portal fa uscire il video da qualunque contenitore, così
  // copre davvero tutto (menu incluso) ed è sempre chiudibile.
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: TOP, background: '#000' }}>
      {/* Barra superiore opaca col pulsante Chiudi: sempre visibile e cliccabile
          sopra la UI di Jitsi, mai coperta dall'iframe. */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: TOP + 1,
        height: 'calc(env(safe-area-inset-top) + 52px)',
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        padding: 'env(safe-area-inset-top) 12px 0 12px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0))',
        pointerEvents: 'none',
      }}>
        <button
          onClick={onClose}
          aria-label="Chiudi videochiamata"
          style={{
            pointerEvents: 'auto',
            display: 'flex', alignItems: 'center', gap: 6,
            height: 40, padding: '0 14px', borderRadius: 100,
            background: 'rgba(220,74,74,0.92)', color: '#fff', border: 'none',
            fontSize: 14, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
          }}
        >
          <X size={18} color="#fff" /> Chiudi
        </button>
      </div>
      <iframe
        src={jitsiUrl(roomName, displayName)}
        allow="camera; microphone; fullscreen; display-capture; autoplay; screen-wake-lock"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Videochiamata"
      />
    </div>,
    document.body,
  )
}
