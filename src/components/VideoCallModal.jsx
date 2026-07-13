import { X } from 'lucide-react'
import { jitsiUrl } from '../lib/videoCall'

export default function VideoCallModal({ roomName, displayName, onClose }) {
  if (!roomName) return null
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 4000, background: '#000' }}>
      <button
        onClick={onClose}
        aria-label="Chiudi videochiamata"
        style={{
          position: 'absolute', top: 'calc(env(safe-area-inset-top) + 12px)', right: 14, zIndex: 4001,
          width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.18)',
          border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}
      >
        <X size={20} color="#fff" />
      </button>
      <iframe
        src={jitsiUrl(roomName, displayName)}
        allow="camera; microphone; fullscreen; display-capture; autoplay"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Videochiamata"
      />
    </div>
  )
}
