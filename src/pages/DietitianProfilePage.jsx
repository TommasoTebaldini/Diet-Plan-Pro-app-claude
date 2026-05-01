import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { ArrowLeft, User, MapPin, Phone, Mail, Globe, GraduationCap, Eye, EyeOff, Save, CheckCircle } from 'lucide-react'

function Field({ label, icon: Icon, children }) {
  return (
    <div className="input-group">
      <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        {Icon && <Icon size={12} />} {label}
      </label>
      {children}
    </div>
  )
}

export default function DietitianProfilePage() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    nome: '',
    cognome: '',
    titoli: '',
    descrizione: '',
    citta: '',
    indirizzo: '',
    telefono: '',
    email_contatto: '',
    sito_web: '',
    visible: true,
  })

  useEffect(() => { loadProfile() }, [])

  async function loadProfile() {
    const { data } = await supabase
      .from('dietitian_profiles')
      .select('*')
      .eq('dietitian_id', user.id)
      .maybeSingle()
    if (data) {
      setForm({
        nome: data.nome || '',
        cognome: data.cognome || '',
        titoli: data.titoli || '',
        descrizione: data.descrizione || '',
        citta: data.citta || '',
        indirizzo: data.indirizzo || '',
        telefono: data.telefono || '',
        email_contatto: data.email_contatto || '',
        sito_web: data.sito_web || '',
        visible: data.visible !== false,
      })
    } else {
      // Pre-fill from auth profile
      setForm(f => ({
        ...f,
        nome: profile?.first_name || '',
        cognome: profile?.last_name || '',
        email_contatto: user?.email || '',
      }))
    }
    setLoading(false)
  }

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function saveProfile() {
    if (!form.nome.trim()) { setError('Il nome è obbligatorio.'); return }
    setSaving(true)
    setError('')
    const { error: err } = await supabase
      .from('dietitian_profiles')
      .upsert({
        dietitian_id: user.id,
        ...form,
        nome: form.nome.trim(),
        cognome: form.cognome.trim(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'dietitian_id' })
    setSaving(false)
    if (err) {
      setError('Errore nel salvataggio. Riprova.')
      return
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh' }}>
        <div style={{ width: 28, height: 28, border: '3px solid var(--border)', borderTopColor: 'var(--green-main)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      </div>
    )
  }

  // Preview card
  const initials = `${form.nome?.[0] || ''}${form.cognome?.[0] || ''}`.toUpperCase() || '?'

  return (
    <div className="page">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))',
        padding: 'calc(env(safe-area-inset-top) + 12px) 16px 18px',
        display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
      }}>
        <button
          onClick={() => navigate('/dietitian/chat')}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', flexShrink: 0 }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 19, color: 'white', fontWeight: 300 }}>
            Il mio profilo
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>
            Visibile ai pazienti nell'app
          </p>
        </div>
      </div>

      <div style={{ padding: '14px 14px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Preview card */}
        <div className="card" style={{ padding: 16 }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Anteprima profilo</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: form.descrizione ? 10 : 0 }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, var(--green-main), var(--green-mid))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 700, color: 'white',
            }}>
              {initials}
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 700 }}>
                {[form.nome, form.cognome].filter(Boolean).join(' ') || 'Il tuo nome'}
              </p>
              {form.titoli && <p style={{ fontSize: 12, color: 'var(--green-main)', fontWeight: 500, marginTop: 2 }}>{form.titoli}</p>}
              {form.citta && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                  <MapPin size={11} color="var(--text-muted)" />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{form.citta}</span>
                </div>
              )}
            </div>
          </div>
          {form.descrizione && (
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55, marginTop: 8 }}>
              {form.descrizione.slice(0, 160)}{form.descrizione.length > 160 ? '…' : ''}
            </p>
          )}

          {/* Visibility badge */}
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            {form.visible
              ? <><Eye size={13} color="var(--green-main)" /><span style={{ fontSize: 12, color: 'var(--green-main)', fontWeight: 500 }}>Profilo pubblico — visibile ai pazienti</span></>
              : <><EyeOff size={13} color="var(--text-muted)" /><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Profilo nascosto — non visibile ai pazienti</span></>
            }
          </div>
        </div>

        {/* Personal info */}
        <div className="card" style={{ padding: 16 }}>
          <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Informazioni personali</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <Field label="Nome *" icon={User} >
              <input className="input-field" value={form.nome} onChange={set('nome')} placeholder="es. Marco" />
            </Field>
            <Field label="Cognome">
              <input className="input-field" value={form.cognome} onChange={set('cognome')} placeholder="es. Rossi" />
            </Field>
          </div>
          <Field label="Titoli di studio / qualifiche" icon={GraduationCap}>
            <input
              className="input-field"
              value={form.titoli}
              onChange={set('titoli')}
              placeholder="es. Dietista, Laurea magistrale in Nutrizione Umana"
            />
          </Field>
        </div>

        {/* Bio */}
        <div className="card" style={{ padding: 16 }}>
          <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Presentazione</p>
          <Field label="Descrizione (visibile ai pazienti)">
            <textarea
              className="input-field"
              value={form.descrizione}
              onChange={set('descrizione')}
              placeholder="Presentati ai tuoi futuri pazienti: la tua esperienza, le tue specializzazioni, il tuo approccio…"
              rows={5}
              style={{ resize: 'vertical', minHeight: 110 }}
            />
          </Field>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            {form.descrizione.length} / suggerito max 400 caratteri
          </p>
        </div>

        {/* Location & contacts */}
        <div className="card" style={{ padding: 16 }}>
          <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Sede e contatti</p>
          <Field label="Città" icon={MapPin}>
            <input className="input-field" value={form.citta} onChange={set('citta')} placeholder="es. Milano" />
          </Field>
          <Field label="Indirizzo dello studio (opzionale)" icon={MapPin}>
            <input className="input-field" value={form.indirizzo} onChange={set('indirizzo')} placeholder="es. Via Roma 12, 20121 Milano" />
          </Field>
          <Field label="Telefono" icon={Phone}>
            <input className="input-field" value={form.telefono} onChange={set('telefono')} placeholder="es. +39 02 1234567" type="tel" />
          </Field>
          <Field label="Email di contatto" icon={Mail}>
            <input className="input-field" value={form.email_contatto} onChange={set('email_contatto')} placeholder="es. info@studiodietistico.it" type="email" />
          </Field>
          <Field label="Sito web (opzionale)" icon={Globe}>
            <input className="input-field" value={form.sito_web} onChange={set('sito_web')} placeholder="es. www.miostudio.it" type="url" />
          </Field>
        </div>

        {/* Visibility toggle */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Profilo pubblico</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Se attivato, il tuo profilo è visibile ai pazienti nella sezione "Trova un Dietista".
              </p>
            </div>
            <button
              onClick={() => setForm(f => ({ ...f, visible: !f.visible }))}
              style={{
                flexShrink: 0, width: 48, height: 28,
                background: form.visible ? 'var(--green-main)' : 'var(--border)',
                borderRadius: 14, border: 'none', cursor: 'pointer',
                position: 'relative', transition: 'background 0.2s',
              }}
            >
              <span style={{
                position: 'absolute', top: 3,
                left: form.visible ? 23 : 3,
                width: 22, height: 22, borderRadius: '50%',
                background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                transition: 'left 0.2s',
              }} />
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: 'var(--alert-error-bg)', border: '1px solid var(--alert-error-border)', borderRadius: 10, padding: '10px 14px', color: 'var(--alert-error-text)', fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* Save */}
        <button
          className="btn btn-primary btn-full"
          onClick={saveProfile}
          disabled={saving || !form.nome.trim()}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          {saved
            ? <><CheckCircle size={16} /> Salvato!</>
            : saving
              ? '…'
              : <><Save size={16} /> Salva profilo</>
          }
        </button>
      </div>
    </div>
  )
}
