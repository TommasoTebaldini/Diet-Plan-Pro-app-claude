import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Leaf, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()

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

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--green-mist)' }}>
      {/* Hero banner */}
      <div style={{
        background: 'linear-gradient(160deg, var(--green-dark) 0%, var(--green-main) 60%, var(--green-mid) 100%)',
        padding: '60px 32px 48px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%)'
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <Leaf size={32} color="white" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'white', fontWeight: 300, letterSpacing: '-0.3px', lineHeight: 1.2 }}>
            Bentornato
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, marginTop: 8 }}>
            Il tuo piano nutrizionale ti aspetta
          </p>
        </div>
      </div>

      {/* Form card */}
      <div style={{ flex: 1, padding: '0 20px 40px', marginTop: -24, position: 'relative' }}>
        <div className="card animate-slideUp" style={{ borderRadius: 'var(--radius-xl)', padding: 28 }}>
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

          <div className="divider" />

          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
            Non hai un account?{' '}
            <Link to="/register" style={{ color: 'var(--green-main)', fontWeight: 500, textDecoration: 'none' }}>
              Registrati
            </Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 24 }}>
          Sei un dietista?{' '}
          <a href="https://nutri-plan-pro-cxee.vercel.app" style={{ color: 'var(--green-main)', textDecoration: 'none' }}>
            Accedi alla piattaforma professionale →
          </a>
        </p>
      </div>
    </div>
  )
}
