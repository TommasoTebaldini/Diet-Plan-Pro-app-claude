import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { NotFoundException } from '@zxing/library'
import { X, Camera } from 'lucide-react'
import { useT } from '../i18n'

export default function BarcodeScanner({ onDetected, onFound, onClose }) {
  const t = useT()
  const videoRef = useRef(null)
  const readerRef = useRef(null)
  const [error, setError] = useState('')
  const [scanning, setScanning] = useState(true)

  // Support both onDetected (new API) and onFound (legacy API).
  // Kept in a ref (updated every render) so the video-decode effect below,
  // which must run only once so it doesn't restart the camera stream on
  // every re-render, always calls the LATEST callback instead of the one
  // captured when it first mounted (stale closure otherwise, since the
  // parent's onFound/onDetected prop is often a fresh function each render).
  const handleDetectedRef = useRef(null)
  handleDetectedRef.current = (code) => {
    if (onDetected) onDetected(code)
    else if (onFound) onFound(code)
  }

  useEffect(() => {
    let reader
    try {
      reader = new BrowserMultiFormatReader()
      readerRef.current = reader
      reader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
        if (result) {
          setScanning(false)
          handleDetectedRef.current(result.getText())
        }
        if (err && !(err instanceof NotFoundException)) {
          // NotFoundException is normal (no barcode in frame yet), ignore it
          if (!String(err).includes('NotFoundException')) {
            setError(t('barcode.cameraAccessError', 'Impossibile accedere alla fotocamera.'))
          }
        }
      }).catch(() => setError(t('barcode.cameraPermissionDenied', 'Permesso fotocamera negato.')))
    } catch (e) {
      setError(t('barcode.notSupported', 'Scanner non supportato su questo browser.'))
    }
    return () => {
      try { if (readerRef.current) readerRef.current.reset() } catch {}
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Portal su document.body: le pagine sono avvolte in PageTransition
  // (framer-motion, transform) che crea uno stacking context isolato — dentro
  // di esso un position:fixed non copre davvero il menu laterale, che vive nel
  // contesto radice (stesso fix già applicato a VideoCallModal/DocModal).
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <button onClick={onClose} aria-label={t('barcode.closeScanner', 'Chiudi scanner')} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 40, height: 40, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <X size={20} />
      </button>
      <p style={{ color: 'white', fontSize: 16, fontWeight: 600, marginBottom: 20 }}>
        <Camera size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />
        {t('barcode.frameInstruction', 'Inquadra il codice a barre')}
      </p>
      {error ? (
        <div style={{ color: '#FCA5A5', fontSize: 14, textAlign: 'center', padding: '0 32px' }}>{error}</div>
      ) : (
        <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.3)' }}>
          <video ref={videoRef} style={{ width: '80vw', maxWidth: 340, height: 260, objectFit: 'cover', display: 'block' }} muted playsInline />
          <div style={{ position: 'absolute', inset: 0, border: '2px solid rgba(34,197,94,0.8)', borderRadius: 16, boxShadow: 'inset 0 0 0 40px rgba(0,0,0,0.3)' }} />
          {scanning && <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 2, background: 'rgba(34,197,94,0.8)', animation: 'scanline 1.5s ease-in-out infinite' }} />}
        </div>
      )}
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 16 }}>{t('barcode.supportedFormats', 'Supporta EAN-13, QR code, UPC-A e altri formati')}</p>
      <style>{`@keyframes scanline { 0%,100%{top:30%} 50%{top:70%} }`}</style>
    </div>,
    document.body
  )
}
