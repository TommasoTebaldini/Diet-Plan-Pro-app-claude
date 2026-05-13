import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useT } from '../i18n'
import { ArrowLeft, User, MapPin, Phone, Mail, Globe, GraduationCap, Eye, EyeOff, Save, CheckCircle, Camera, Briefcase } from 'lucide-react'

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
  const t = useT()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    nome: '',
    cognome: '',
    titoli: '',
    descrizione: '',
    metodi_lavoro: '',
    citta: '',
    indirizzo: '',
    telefono: '',
    email_contatto: '',
    sito_web: '',
    avatar_url: '',
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
        metodi_lavoro: data.metodi_lavoro || '',
        citta: data.citta || '',
        indirizzo: data.indirizzo || '',
        telefono: data.telefono || '',
        email_contatto: data.email_contatto || '',
        sito_web: data.sito_web || '',
        avatar_url: data.avatar_url || '',
        visible: data.visible !== false,
      })
    } else {
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

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('La foto non deve superare 5 MB.'); return }
    setUploadingPhoto(true)
    setError('')
    const ext = file.name.split('.').pop().toLowerCase() || 'jpg'
    const path = `${user.id}/avatar.${ext}`
    const { error: uploadErr } = await supabase.storage
      .from('dietitian-avatars')
      .upload(path, file, { upsert: true, contentType: file.type })
    if (uploadErr) {
      setError('Errore nel caricamento della foto. Verifica che il bucket "dietitian-avatars" esista.')
      setUploadingPhoto(false)
      return
    }
    const { data: urlData } = supabase.storage.from('dietitian-avatars').getPublicUrl(path)
    const publicUrl = urlData?.publicUrl + `?t=${Date.now()}`
    setForm(f => ({ ...f, avatar_url: publicUrl }))
    setUploadingPhoto(false)
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
    if (err) { setError('Errore nel salvataggio. Riprova.'); return }
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
            {t('dietitian.profile')}
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
            {/* Avatar with upload */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              {form.avatar_url ? (
                <img
                  src={form.avatar_url} alt="Foto profilo"
                  style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-light)' }}
                />
              ) : (
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--green-main), var(--green-mid))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, fontWeight: 700, color: 'white',
                }}>
                  {initials}
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                style={{
                  position: 'absolute', bottom: -2, right: -2, width: 22, height: 22,
                  borderRadius: '50%', background: 'var(--green-main)', border: '2px solid white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}
                title="Cambia foto"
              >
                {uploadingPhoto
                  ? <span style={{ width: 9, height: 9, border: '1.5px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'block' }} />
                  : <Camera size={10} color="white" />
                }
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
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

        {/* Foto profilo */}
        <div className="card" style={{ padding: 16 }}>
          <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Foto profilo</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 }}>
            La foto sarà visibile ai pazienti nella lista e sulla tua pagina profilo. Formato consigliato: quadrato, max 5 MB.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingPhoto}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--green-pale)', border: '1.5px dashed var(--green-main)',
              borderRadius: 10, padding: '10px 16px', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, color: 'var(--green-main)', fontFamily: 'var(--font-b)',
            }}
          >
            <Camera size={15} />
            {uploadingPhoto ? 'Caricamento…' : form.avatar_url ? 'Cambia foto' : 'Carica foto'}
          </button>
        </div>

        {/* Personal info */}
        <div className="card" style={{ padding: 16 }}>
          <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Informazioni personali</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <Field label="Nome *" icon={User}>
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

        {/* Presentazione */}
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

        {/* Metodi di lavoro */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
            <Briefcase size={14} color="var(--green-main)" />
            <p style={{ fontSize: 14, fontWeight: 600 }}>Metodi di lavoro</p>
          </div>
          <Field label="Come lavori con i pazienti">
            <textarea
              className="input-field"
              value={form.metodi_lavoro}
              onChange={set('metodi_lavoro')}
              placeholder="es. Approccio personalizzato basato sulla bioimpedenziometria, colloqui mensili, supporto continuo via app…"
              rows={4}
              style={{ resize: 'vertical', minHeight: 95 }}
            />
          </Field>
        </div>

        {/* Location & contacts */}
        <div className="card" style={{ padding: 16 }}>
          <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Sede e contatti</p>
          <Field label="Città dove operi" icon={MapPin}>
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
            <input className="input-field" value={form.sito_web} onChange={set('sito_web')} placeholder="es. www.miostudio.it" />
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
            ? <><CheckCircle size={16} /> {t('profile.saved')}</>
            : saving
              ? '…'
              : <><Save size={16} /> {t('common.save')}</>
          }
        </button>
      </div>
    </div>
  )
}
