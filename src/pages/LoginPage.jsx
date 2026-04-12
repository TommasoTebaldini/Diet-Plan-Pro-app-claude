import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Leaf, Eye, EyeOff, AlertCircle, Fingerprint } from 'lucide-react'
import {
  isBiometricSupported,
  isBiometricAvailable,
  getBiometricCredentialId,
  getBiometricUserId,
  authenticateBiometric,
} from '../lib/biometric'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [biometricLoading, setBiometricLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasBiometric, setHasBiometric] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Show biometric button only if the device supports it AND a credential is stored
    async function check() {
      const credId = getBiometricCredentialId()
      if (!credId) return
      const available = await isBiometricAvailable()
      setHasBiometric(available)
    }
    if (isBiometricSupported()) check()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'Email o password non corretti'
        : error.message)
    } else {
      navigate('/')
    }
    setLoading(false)
  }

  async function handleBiometricLogin() {
    setError('')
    setBiometricLoading(true)
    try {
      const ok = await authenticateBiometric()
      if (!ok) { setError('Autenticazione biometrica annullata.'); return }

      // Re-use the existing Supabase session (user already authenticated before,
      // the biometric gesture just confirms physical presence).
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        navigate('/')
      } else {
        setError('Sessione scaduta. Accedi con email e password.')
      }
    } catch (e) {
      setError(e?.message || 'Autenticazione biometrica non riuscita.')
    } finally {
      setBiometricLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(160deg, var(--green-dark) 0%, var(--green-main) 40%, var(--green-mid) 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background decorations */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 60% 60%, rgba(255,255,255,0.04) 0%, transparent 40%)'
      }} />

      {/* Centered content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 20px', position: 'relative', zIndex: 1,
      }}>
        {/* Logo and welcome */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 22,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}>
            <Leaf size={36} color="white" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'white', fontWeight: 300, letterSpacing: '-0.3px', lineHeight: 1.2 }}>
            Bentornato
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, marginTop: 8 }}>
            Il tuo piano nutrizionale ti aspetta
          </p>
        </div>

        {/* Form card */}
        <div className="card animate-slideUp" style={{
          borderRadius: 'var(--radius-xl)', padding: 32,
          width: '100%', maxWidth: 420,
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: 'var(--text-primary)' }}>
            Accedi
          </h2>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#fff0f0', border: '1px solid #ffd4d4',
              borderRadius: 'var(--radius-sm)', padding: '12px 14px',
              marginBottom: 20, color: 'var(--red)', fontSize: 14
            }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input
                type="email" className="input-field"
                placeholder="nome@email.com"
                value={email} onChange={e => setEmail(e.target.value)}
                required autoComplete="email"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-field"
                  placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  required autoComplete="current-password"
                  style={{ paddingRight: 48 }}
                />
                <button type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                    display: 'flex', alignItems: 'center'
                  }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 4 }}>
              {loading
                ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                    Accesso in corso…
                  </span>
                : 'Accedi'}
            </button>
          </form>

          {hasBiometric && (
            <>
              <div className="divider" style={{ margin: '20px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ flex: 1, height: 1, background: 'var(--border-light)' }} />
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>oppure</span>
                <span style={{ flex: 1, height: 1, background: 'var(--border-light)' }} />
              </div>
              <button
                onClick={handleBiometricLogin}
                disabled={biometricLoading}
                className="btn btn-secondary btn-full"
                style={{ gap: 10 }}
              >
                {biometricLoading
                  ? <span style={{ width: 16, height: 16, border: '2px solid var(--green-main)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  : <Fingerprint size={20} />
                }
                {biometricLoading ? 'Verifica in corso…' : 'Accedi con Face ID / Touch ID'}
              </button>
            </>
          )}

          <div className="divider" />

          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
            Non hai un account?{' '}
            <Link to="/register" style={{ color: 'var(--green-main)', fontWeight: 500, textDecoration: 'none' }}>
              Registrati
            </Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 24 }}>
          Sei un dietista?{' '}
          <a href="https://nutri-plan-pro-cxee.vercel.app" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>
            Accedi alla piattaforma professionale →
          </a>
        </p>
      </div>
    </div>
  )
}
