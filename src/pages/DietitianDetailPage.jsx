import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { ArrowLeft, MapPin, Phone, Mail, Globe, Calendar, Briefcase, X, CheckCircle } from 'lucide-react'

function AppointmentModal({ dietitianId, onClose }) {
  const { user } = useAuth()
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function book() {
    if (!date || !time) { setError('Inserisci data e ora del colloquio.'); return }
    setSaving(true)
    setError('')
    const { error: err } = await supabase.from('appointments').insert({
      patient_id: user.id,
      dietitian_id: dietitianId,
      title: 'Colloquio richiesto',
      appointment_date: new Date(`${date}T${time}:00`).toISOString(),
      notes: notes.trim() || null,
    })
    setSaving(false)
    if (err) { setError('Errore nella prenotazione. Riprova.'); return }
    setSaved(true)
    setTimeout(onClose, 2200)
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 9999, padding: 0 }}
      onClick={onClose}
    >
      <div
        style={{ background: 'var(--surface)', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 560, margin: '0 auto', padding: '24px 20px', paddingBottom: 'calc(24px + env(safe-area-inset-bottom))', boxShadow: '0 -8px 40px rgba(0,0,0,0.15)' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700 }}>Prenota un colloquio</h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>La richiesta verrà inviata al dietista</p>
          </div>
          <button onClick={onClose} style={{ background: 'var(--surface-2)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={16} />
          </button>
        </div>

        {saved ? (
          <div style={{ textAlign: 'center', padding: '24px 0 8px' }}>
            <CheckCircle size={48} color="var(--green-main)" style={{ marginBottom: 14 }} />
            <p style={{ fontSize: 16, fontWeight: 600 }}>Richiesta inviata!</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.6 }}>Il dietista riceverà la tua richiesta di colloquio e ti contatterà per confermare.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <div className="input-group" style={{ flex: 1 }}>
                <label className="input-label">Data *</label>
                <input className="input-field" type="date" value={date} onChange={e => setDate(e.target.value)} min={today} />
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label className="input-label">Ora *</label>
                <input className="input-field" type="time" value={time} onChange={e => setTime(e.target.value)} />
              </div>
            </div>
            <div className="input-group" style={{ marginBottom: 16 }}>
              <label className="input-label">Note (opzionale)</label>
              <textarea
                className="input-field" rows={3} value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Es. Prima visita, intolleranze, obiettivi…"
                style={{ resize: 'none' }}
              />
            </div>
            {error && (
              <div style={{ background: 'var(--alert-error-bg)', border: '1px solid var(--alert-error-border)', borderRadius: 10, padding: '10px 14px', color: 'var(--alert-error-text)', fontSize: 13, marginBottom: 14 }}>
                {error}
              </div>
            )}
            <button
              className="btn btn-primary btn-full"
              onClick={book}
              disabled={saving || !date || !time}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {saving ? '…' : <><Calendar size={15} /> Invia richiesta di colloquio</>}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function DietitianDetailPage() {
  const { dietitianId } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => { loadProfile() }, [dietitianId])

  async function loadProfile() {
    const { data } = await supabase
      .from('dietitian_profiles')
      .select('*')
      .eq('dietitian_id', dietitianId)
      .eq('visible', true)
      .maybeSingle()
    setProfile(data)
    setLoading(false)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh' }}>
        <div style={{ width: 28, height: 28, border: '3px solid var(--border)', borderTopColor: 'var(--green-main)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="page">
        <div style={{ background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))', padding: 'calc(env(safe-area-inset-top) + 12px) 16px 18px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <button onClick={() => navigate('/dietisti')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
            <ArrowLeft size={18} />
          </button>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 19, color: 'white', fontWeight: 300 }}>Dietista</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '60px 24px' }}>
          <p style={{ fontSize: 15, fontWeight: 500 }}>Profilo non disponibile</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>Questo profilo non esiste o non è pubblico.</p>
          <button onClick={() => navigate('/dietisti')} style={{ marginTop: 18, background: 'var(--green-pale)', border: 'none', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontSize: 13, color: 'var(--green-main)', fontWeight: 600, fontFamily: 'var(--font-b)' }}>
            Torna alla lista
          </button>
        </div>
      </div>
    )
  }

  const initials = `${profile.nome?.[0] || ''}${profile.cognome?.[0] || ''}`.toUpperCase() || '?'
  const fullName = [profile.nome, profile.cognome].filter(Boolean).join(' ')

  return (
    <div className="page">
      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))', padding: 'calc(env(safe-area-inset-top) + 12px) 16px 24px', flexShrink: 0 }}>
        <button
          onClick={() => navigate('/dietisti')}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', marginBottom: 18 }}
        >
          <ArrowLeft size={18} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url} alt={fullName}
              style={{ width: 76, height: 76, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.4)', flexShrink: 0 }}
            />
          ) : (
            <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, color: 'white', flexShrink: 0 }}>
              {initials}
            </div>
          )}
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'white', fontWeight: 400 }}>{fullName}</h1>
            {profile.titoli && <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 4 }}>{profile.titoli}</p>}
            {profile.citta && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                <MapPin size={12} color="rgba(255,255,255,0.7)" />
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{profile.citta}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 14px 100px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Presentazione */}
        {profile.descrizione && (
          <div className="card" style={{ padding: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Presentazione</p>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{profile.descrizione}</p>
          </div>
        )}

        {/* Metodo di lavoro */}
        {profile.metodi_lavoro && (
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <Briefcase size={13} color="var(--green-main)" />
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Metodo di lavoro</p>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{profile.metodi_lavoro}</p>
          </div>
        )}

        {/* Contatti */}
        {(profile.telefono || profile.email_contatto || profile.sito_web || profile.indirizzo) && (
          <div className="card" style={{ padding: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Contatti</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {profile.indirizzo && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <MapPin size={15} color="var(--green-main)" style={{ marginTop: 1, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{profile.indirizzo}</span>
                </div>
              )}
              {profile.telefono && (
                <a href={`tel:${profile.telefono}`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                  <Phone size={15} color="var(--green-main)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--green-dark)', fontWeight: 500 }}>{profile.telefono}</span>
                </a>
              )}
              {profile.email_contatto && (
                <a href={`mailto:${profile.email_contatto}`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                  <Mail size={15} color="var(--green-main)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--green-dark)', fontWeight: 500 }}>{profile.email_contatto}</span>
                </a>
              )}
              {profile.sito_web && (
                <a
                  href={profile.sito_web.startsWith('http') ? profile.sito_web : `https://${profile.sito_web}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
                >
                  <Globe size={15} color="var(--green-main)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--green-dark)', fontWeight: 500 }}>{profile.sito_web}</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Fixed bottom CTA */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 14px', paddingBottom: 'calc(12px + env(safe-area-inset-bottom))', background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--border-light)' }}>
        <button
          className="btn btn-primary btn-full"
          onClick={() => setShowModal(true)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <Calendar size={16} /> Prenota un colloquio
        </button>
      </div>

      {showModal && <AppointmentModal dietitianId={profile.dietitian_id} onClose={() => setShowModal(false)} />}
    </div>
  )
}
