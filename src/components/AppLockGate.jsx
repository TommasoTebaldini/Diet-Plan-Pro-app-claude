import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Lock, Fingerprint, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useT } from '../i18n'
import { isBiometricAvailable, getBiometricCredentialId, getBiometricUserId, authenticateBiometric } from '../lib/biometric'

// Sblocco richiesto dopo N minuti di app in background — prima, un dispositivo
// sbloccato/incustodito dava accesso pieno ai dati sanitari senza alcuna
// frizione ulteriore: il pulsante "biometria" in ProfilePage sbloccava solo
// la SCHERMATA di login (velocizza l'accesso quando non c'è ancora sessione),
// non richiedeva mai nulla per riprendere una sessione già valida. Questo
// gate copre quel buco: non tocca la sessione Supabase (resta valida),
// blocca solo la UI finché l'utente non ripete Face ID/Touch ID o la
// password.
const LOCK_TIMEOUT_MS = 5 * 60 * 1000 // 5 minuti
const BG_AT_KEY = 'app_lock_backgrounded_at'

const TOP = 2147483000

export default function AppLockGate() {
  const { user, signIn } = useAuth()
  const t = useT()
  const [locked, setLocked] = useState(false)
  const [hasBiometric, setHasBiometric] = useState(false)
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const checkedBiometricRef = useRef(false)

  const markActive = useCallback(() => {
    localStorage.removeItem(BG_AT_KEY)
  }, [])

  useEffect(() => {
    if (!user) { setLocked(false); return }

    async function checkBiometric() {
      const available = await isBiometricAvailable()
      setHasBiometric(available && !!getBiometricCredentialId() && getBiometricUserId() === user.id)
    }
    checkBiometric()

    function onVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        localStorage.setItem(BG_AT_KEY, String(Date.now()))
      } else {
        const bgAt = Number(localStorage.getItem(BG_AT_KEY) || 0)
        if (bgAt && Date.now() - bgAt > LOCK_TIMEOUT_MS) {
          setLocked(true)
        }
        localStorage.removeItem(BG_AT_KEY)
      }
    }

    // Copre anche il caso "app riaperta da fredda" (es. task killata dal
    // sistema su mobile): se al mount troviamo un timestamp di background
    // già scaduto, blocchiamo subito invece di aspettare il prossimo evento.
    if (!checkedBiometricRef.current) {
      checkedBiometricRef.current = true
      const bgAt = Number(localStorage.getItem(BG_AT_KEY) || 0)
      if (bgAt && Date.now() - bgAt > LOCK_TIMEOUT_MS) setLocked(true)
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [user])

  async function tryBiometric() {
    setError('')
    setBusy(true)
    try {
      const ok = await authenticateBiometric()
      if (ok) { setLocked(false); markActive() }
      else setError(t('applock.biometric_failed', 'Verifica non riuscita. Riprova o usa la password.'))
    } catch {
      setError(t('applock.biometric_failed', 'Verifica non riuscita. Riprova o usa la password.'))
    } finally {
      setBusy(false)
    }
  }

  async function tryPassword(e) {
    e.preventDefault()
    if (!password) return
    setError('')
    setBusy(true)
    try {
      // signIn() now always resolves (it has its own internal timeout — see
      // AuthContext) instead of ever hanging, but this still guards against
      // any other unexpected throw so `busy` can never get stuck true with
      // the unlock button permanently disabled and no way out but a reload.
      const { error: signInError } = await signIn(user.email, password)
      if (signInError) {
        setError(t('applock.wrong_password', 'Password errata.'))
      } else {
        setPassword('')
        setLocked(false)
        markActive()
      }
    } catch {
      setError(t('applock.wrong_password', 'Password errata.'))
    } finally {
      setBusy(false)
    }
  }

  if (!locked || !user) return null

  return createPortal(
    <div style={{
      position: 'fixed', inset: 0, zIndex: TOP,
      background: 'var(--green-mist, #f0fdf4)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 32, textAlign: 'center',
    }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--green-pale, #dcfce7)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <Lock size={32} color="var(--green-main, #1a7f5a)" />
      </div>
      <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 22, fontWeight: 300, marginBottom: 8 }}>
        {t('applock.title', 'App bloccata')}
      </h2>
      <p style={{ color: 'var(--text-secondary, #475569)', fontSize: 14, marginBottom: 24, maxWidth: 320 }}>
        {t('applock.subtitle', 'Per proteggere i tuoi dati sanitari, sblocca per continuare.')}
      </p>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff0f0', border: '1px solid #ffd4d4', borderRadius: 10, padding: '10px 14px', marginBottom: 16, color: 'var(--red, #dc2626)', fontSize: 13, maxWidth: 320 }}>
          <AlertCircle size={15} /> {error}
        </div>
      )}

      {hasBiometric && (
        <button
          onClick={tryBiometric}
          disabled={busy}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, minWidth: 220, justifyContent: 'center' }}
        >
          <Fingerprint size={18} /> {t('applock.unlock_biometric', 'Sblocca con Face ID / Touch ID')}
        </button>
      )}

      <form onSubmit={tryPassword} style={{ width: '100%', maxWidth: 280, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ position: 'relative' }}>
          <input
            type={showPass ? 'text' : 'password'}
            className="input-field"
            placeholder={t('applock.password_placeholder', 'Password')}
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            style={{ paddingRight: 44 }}
          />
          <button
            type="button"
            onClick={() => setShowPass(v => !v)}
            aria-label={t('applock.toggle_password', 'Mostra/nascondi password')}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
          >
            {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
        <button type="submit" className="btn btn-secondary" disabled={busy || !password}>
          {t('applock.unlock_password', 'Sblocca con password')}
        </button>
      </form>
    </div>,
    document.body,
  )
}
