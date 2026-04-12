import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAppSettings } from '../context/AppSettingsContext'
import {
  LogOut, User, Mail, ExternalLink, ChevronRight, Bell, Shield, X, Check,
  Eye, EyeOff, Moon, Sun, Type, Contrast, Fingerprint, Download, Upload,
  Accessibility, Plus, Trash2, BellOff, BellRing,
} from 'lucide-react'
import {
  isBiometricSupported,
  isBiometricAvailable,
  getBiometricCredentialId,
  registerBiometric,
  clearBiometricCredential,
} from '../lib/biometric'
import {
  loadPrefs, savePrefs, getPermissionStatus, requestPermission, initScheduledNotifications,
  DEFAULT_PREFS,
} from '../lib/notifications'

// ─── Modal wrapper ────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
      <div style={{ background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))', padding: 'calc(env(safe-area-inset-top) + 14px) 18px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', flexShrink: 0 }}>
          <X size={18} />
        </button>
        <h2 style={{ color: 'white', fontSize: 17, fontWeight: 600 }}>{title}</h2>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 20, paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}>
        {children}
      </div>
    </div>
  )
}

// ─── Personal data modal ──────────────────────────────────────────────────────
function PersonalDataModal({ profile, user, onClose, onSaved }) {
  const [form, setForm] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    birth_date: profile?.birth_date || '',
    gender: profile?.gender || '',
    height_cm: profile?.height_cm || '',
    target_weight: profile?.target_weight || '',
    activity_level: profile?.activity_level || '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function save() {
    setSaving(true)
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: `${form.first_name} ${form.last_name}`.trim(),
      ...form,
      height_cm: form.height_cm ? parseFloat(form.height_cm) : null,
      target_weight: form.target_weight ? parseFloat(form.target_weight) : null,
    })
    setSaving(false)
    if (!error) { setSaved(true); setTimeout(() => { onSaved(); onClose() }, 900) }
  }

  const ACTIVITY = [
    { val: 'sedentario', label: 'Sedentario' },
    { val: 'leggero', label: 'Leggero (1-2 giorni/sett)' },
    { val: 'moderato', label: 'Moderato (3-5 giorni/sett)' },
    { val: 'attivo', label: 'Attivo (6-7 giorni/sett)' },
    { val: 'molto_attivo', label: 'Molto attivo' },
  ]

  return (
    <Modal title="Dati personali" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="input-group">
            <label className="input-label">Nome</label>
            <input className="input-field" value={form.first_name} onChange={set('first_name')} placeholder="Mario" />
          </div>
          <div className="input-group">
            <label className="input-label">Cognome</label>
            <input className="input-field" value={form.last_name} onChange={set('last_name')} placeholder="Rossi" />
          </div>
        </div>
        <div className="input-group">
          <label className="input-label">Data di nascita</label>
          <input type="date" className="input-field" value={form.birth_date} onChange={set('birth_date')} />
        </div>
        <div className="input-group">
          <label className="input-label">Sesso</label>
          <div style={{ display: 'flex', gap: 10 }}>
            {['M', 'F'].map(g => (
              <button key={g} onClick={() => setForm(f => ({ ...f, gender: g }))} style={{ flex: 1, padding: '11px', borderRadius: 12, background: form.gender === g ? 'var(--green-main)' : 'var(--surface-2)', color: form.gender === g ? 'white' : 'var(--text-secondary)', border: `1.5px solid ${form.gender === g ? 'transparent' : 'var(--border)'}`, font: 'inherit', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                {g === 'M' ? '♂ Maschio' : '♀ Femmina'}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="input-group">
            <label className="input-label">Altezza (cm)</label>
            <input type="number" className="input-field" value={form.height_cm} onChange={set('height_cm')} placeholder="170" inputMode="decimal" />
          </div>
          <div className="input-group">
            <label className="input-label">Peso obiettivo (kg)</label>
            <input type="number" className="input-field" value={form.target_weight} onChange={set('target_weight')} placeholder="70" inputMode="decimal" step="0.1" />
          </div>
        </div>
        <div className="input-group">
          <label className="input-label">Livello attività fisica</label>
          <select className="input-field" value={form.activity_level} onChange={set('activity_level')}>
            <option value="">Seleziona…</option>
            {ACTIVITY.map(a => <option key={a.val} value={a.val}>{a.label}</option>)}
          </select>
        </div>
        <button className="btn btn-primary btn-full" onClick={save} disabled={saving || saved} style={{ marginTop: 6 }}>
          {saved ? <><Check size={16} /> Salvato!</> : saving ? 'Salvataggio…' : 'Salva dati'}
        </button>
      </div>
    </Modal>
  )
}

// ─── Change password modal ────────────────────────────────────────────────────
function SecurityModal({ onClose }) {
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' })
  const [show, setShow] = useState(false)
  const [status, setStatus] = useState(null) // 'success' | 'error' | null
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function changePassword() {
    if (form.newPass !== form.confirm) return setStatus('error'), setMsg('Le password non coincidono')
    if (form.newPass.length < 6) return setStatus('error'), setMsg('La password deve avere almeno 6 caratteri')
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: form.newPass })
    setLoading(false)
    if (error) { setStatus('error'); setMsg(error.message) }
    else { setStatus('success'); setMsg('Password aggiornata con successo!'); setTimeout(onClose, 1500) }
  }

  return (
    <Modal title="Privacy e sicurezza" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Cambia la password del tuo account. Usa una password di almeno 6 caratteri.
        </p>
        {status && (
          <div style={{ padding: '12px 14px', borderRadius: 10, background: status === 'success' ? 'var(--green-pale)' : '#fff0f0', color: status === 'success' ? 'var(--green-dark)' : 'var(--red)', fontSize: 14 }}>
            {msg}
          </div>
        )}
        {['newPass', 'confirm'].map((k, i) => (
          <div key={k} className="input-group">
            <label className="input-label">{i === 0 ? 'Nuova password' : 'Conferma password'}</label>
            <div style={{ position: 'relative' }}>
              <input type={show ? 'text' : 'password'} className="input-field" value={form[k]} onChange={set(k)} placeholder="••••••••" style={{ paddingRight: 44 }} />
              {i === 0 && (
                <button type="button" onClick={() => setShow(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              )}
            </div>
          </div>
        ))}
        <button className="btn btn-primary btn-full" onClick={changePassword} disabled={loading || !form.newPass || !form.confirm} style={{ marginTop: 6 }}>
          {loading ? 'Aggiornamento…' : 'Aggiorna password'}
        </button>
      </div>
    </Modal>
  )
}

// ─── Notifications modal ──────────────────────────────────────────────────────
function Toggle({ on, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: 48, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer',
      background: on ? 'var(--green-main)' : 'var(--border)',
      transition: 'background 0.2s', position: 'relative', flexShrink: 0,
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: '50%', background: 'white',
        position: 'absolute', top: 3, left: on ? 23 : 3,
        transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
      }} />
    </button>
  )
}

const WEEK_DAYS = [
  { val: 1, label: 'Lunedì' },
  { val: 2, label: 'Martedì' },
  { val: 3, label: 'Mercoledì' },
  { val: 4, label: 'Giovedì' },
  { val: 5, label: 'Venerdì' },
  { val: 6, label: 'Sabato' },
  { val: 0, label: 'Domenica' },
]

const WATER_INTERVALS = [
  { val: 0.5, label: 'Ogni 30 min' },
  { val: 1, label: 'Ogni ora' },
  { val: 1.5, label: 'Ogni 1h 30min' },
  { val: 2, label: 'Ogni 2 ore' },
  { val: 3, label: 'Ogni 3 ore' },
  { val: 4, label: 'Ogni 4 ore' },
]

function NotificationsModal({ onClose }) {
  const [prefs, setPrefs] = useState(loadPrefs)
  const [permStatus, setPermStatus] = useState(getPermissionStatus)
  const [requesting, setRequesting] = useState(false)

  function update(patch) {
    setPrefs(prev => {
      const next = { ...prev, ...patch }
      savePrefs(next)
      initScheduledNotifications(next)
      return next
    })
  }

  async function handleRequestPermission() {
    setRequesting(true)
    const result = await requestPermission()
    setPermStatus(result)
    setRequesting(false)
    if (result === 'granted') initScheduledNotifications(prefs)
  }

  // Meal time helpers
  function updateMealTime(index, val) {
    const times = [...prefs.mealTimes]
    times[index] = val
    update({ mealTimes: times })
  }
  function addMealTime() {
    update({ mealTimes: [...prefs.mealTimes, '12:00'] })
  }
  function removeMealTime(index) {
    update({ mealTimes: prefs.mealTimes.filter((_, i) => i !== index) })
  }

  const permGranted = permStatus === 'granted'
  const permDenied = permStatus === 'denied'
  const notSupported = permStatus === 'not-supported'

  const sectionStyle = { marginBottom: 0 }
  const sectionHeaderStyle = { fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '18px 0 8px', borderBottom: '1px solid var(--border-light)', marginBottom: 0 }
  const rowStyle = { display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--border-light)' }
  const inputStyle = { background: 'var(--surface-2)', border: '1.5px solid var(--border)', borderRadius: 10, padding: '8px 12px', fontSize: 14, color: 'var(--text-primary)', font: 'inherit', width: '100%' }

  return (
    <Modal title="Notifiche e promemoria" onClose={onClose}>
      {/* Permission banner */}
      {!permGranted && !notSupported && (
        <div style={{ background: permDenied ? '#fff0f0' : 'var(--green-pale)', border: `1.5px solid ${permDenied ? '#ffd4d4' : 'var(--green-light)'}`, borderRadius: 14, padding: '14px 16px', marginBottom: 20 }}>
          {permDenied ? (
            <>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--red)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <BellOff size={16} /> Notifiche bloccate
              </p>
              <p style={{ fontSize: 13, color: '#c0392b', lineHeight: 1.6 }}>
                Hai bloccato le notifiche. Per attivarle vai nelle impostazioni del browser e concedi il permesso a questo sito.
              </p>
            </>
          ) : (
            <>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--green-dark)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <BellRing size={16} /> Attiva le notifiche
              </p>
              <p style={{ fontSize: 13, color: 'var(--green-dark)', lineHeight: 1.6, marginBottom: 10 }}>
                Permetti all'app di mostrare notifiche per ricevere promemoria e avvisi.
              </p>
              <button onClick={handleRequestPermission} disabled={requesting} className="btn btn-primary" style={{ fontSize: 14, padding: '10px 18px', gap: 6 }}>
                <Bell size={15} />{requesting ? 'In attesa…' : 'Attiva notifiche'}
              </button>
            </>
          )}
        </div>
      )}

      {notSupported && (
        <div style={{ background: '#fff4e6', border: '1.5px solid #f0922b', borderRadius: 14, padding: '14px 16px', marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: '#b45309', lineHeight: 1.6 }}>⚠️ Il tuo browser non supporta le notifiche push. Installa l'app per ricevere le notifiche.</p>
        </div>
      )}

      {/* ── Event-based notifications ───────────────────────────── */}
      <div style={sectionStyle}>
        <p style={sectionHeaderStyle}>Avvisi dal dietista</p>

        {[
          { key: 'newMessage', label: 'Nuovo messaggio', desc: 'Avvisami quando il dietista ti scrive' },
          { key: 'newDocument', label: 'Nuovo documento condiviso', desc: 'Avvisami quando viene aggiunto un documento' },
          { key: 'dietUpdate', label: 'Aggiornamento piano alimentare', desc: 'Avvisami quando la dieta viene modificata' },
        ].map(item => (
          <div key={item.key} style={rowStyle}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.desc}</p>
            </div>
            <Toggle on={prefs[item.key]} onClick={() => update({ [item.key]: !prefs[item.key] })} />
          </div>
        ))}
      </div>

      {/* ── Meal reminders ─────────────────────────────────────── */}
      <div style={sectionStyle}>
        <p style={sectionHeaderStyle}>Promemoria pasti</p>
        <div style={{ ...rowStyle, borderBottom: prefs.mealReminder ? '1px solid var(--border-light)' : 'none' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 500 }}>Promemoria pasti</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Ricordami di registrare i pasti</p>
          </div>
          <Toggle on={prefs.mealReminder} onClick={() => update({ mealReminder: !prefs.mealReminder })} />
        </div>
        {prefs.mealReminder && (
          <div style={{ padding: '10px 0 4px' }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>Orari promemoria</p>
            {prefs.mealTimes.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <input
                  type="time"
                  value={t}
                  onChange={e => updateMealTime(i, e.target.value)}
                  style={{ ...inputStyle, flex: 1 }}
                />
                {prefs.mealTimes.length > 1 && (
                  <button onClick={() => removeMealTime(i)} style={{ background: '#fff0f0', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red)', cursor: 'pointer', flexShrink: 0 }}>
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
            {prefs.mealTimes.length < 6 && (
              <button onClick={addMealTime} style={{ background: 'var(--green-pale)', border: '1.5px dashed var(--green-light)', borderRadius: 10, width: '100%', padding: '9px', fontSize: 13, color: 'var(--green-main)', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, font: 'inherit', marginTop: 2 }}>
                <Plus size={14} />Aggiungi orario
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Water reminders ────────────────────────────────────── */}
      <div style={sectionStyle}>
        <p style={sectionHeaderStyle}>Promemoria acqua</p>
        <div style={{ ...rowStyle, borderBottom: prefs.waterReminder ? '1px solid var(--border-light)' : 'none' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 500 }}>Promemoria acqua</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Ricordami di bere durante la giornata</p>
          </div>
          <Toggle on={prefs.waterReminder} onClick={() => update({ waterReminder: !prefs.waterReminder })} />
        </div>
        {prefs.waterReminder && (
          <div style={{ padding: '10px 0 4px' }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Frequenza</p>
            <select
              value={prefs.waterIntervalHours}
              onChange={e => update({ waterIntervalHours: parseFloat(e.target.value) })}
              style={inputStyle}
            >
              {WATER_INTERVALS.map(w => (
                <option key={w.val} value={w.val}>{w.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ── Weigh-in reminder ──────────────────────────────────── */}
      <div style={sectionStyle}>
        <p style={sectionHeaderStyle}>Promemoria pesarsi</p>
        <div style={{ ...rowStyle, borderBottom: prefs.weighReminder ? '1px solid var(--border-light)' : 'none' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 500 }}>Promemoria settimanale</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Ricordami di pesarmi una volta a settimana</p>
          </div>
          <Toggle on={prefs.weighReminder} onClick={() => update({ weighReminder: !prefs.weighReminder })} />
        </div>
        {prefs.weighReminder && (
          <div style={{ padding: '10px 0 4px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Giorno</p>
              <select
                value={prefs.weighDay}
                onChange={e => update({ weighDay: parseInt(e.target.value) })}
                style={inputStyle}
              >
                {WEEK_DAYS.map(d => <option key={d.val} value={d.val}>{d.label}</option>)}
              </select>
            </div>
            <div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Orario</p>
              <input type="time" value={prefs.weighTime} onChange={e => update({ weighTime: e.target.value })} style={inputStyle} />
            </div>
          </div>
        )}
      </div>

      {/* ── Appointment reminder ───────────────────────────────── */}
      <div style={sectionStyle}>
        <p style={sectionHeaderStyle}>Promemoria appuntamento</p>
        <div style={{ ...rowStyle, borderBottom: prefs.appointmentReminder ? '1px solid var(--border-light)' : 'none' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 500 }}>Promemoria visita</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Avvisami 1 ora prima dell'appuntamento</p>
          </div>
          <Toggle on={prefs.appointmentReminder} onClick={() => update({ appointmentReminder: !prefs.appointmentReminder })} />
        </div>
        {prefs.appointmentReminder && (
          <div style={{ padding: '10px 0 4px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Data visita</p>
              <input type="date" value={prefs.appointmentDate} onChange={e => update({ appointmentDate: e.target.value })} style={inputStyle} min={new Date().toISOString().split('T')[0]} />
            </div>
            <div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Orario</p>
              <input type="time" value={prefs.appointmentTime} onChange={e => update({ appointmentTime: e.target.value })} style={inputStyle} />
            </div>
          </div>
        )}
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 20, lineHeight: 1.6 }}>
        ℹ️ I promemoria schedulati (pasti, acqua, pesata) funzionano quando l'app è aperta o installata come PWA.
      </p>
    </Modal>
  )
}

// ─── Appearance & Accessibility modal ────────────────────────────────────────
function AppearanceModal({ onClose }) {
  const { settings, update } = useAppSettings()

  const textSizes = [
    { val: 'normal', label: 'Normale' },
    { val: 'large', label: 'Grande' },
    { val: 'xlarge', label: 'Extra grande' },
  ]

  return (
    <Modal title="Aspetto e accessibilità" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* Dark mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 0', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {settings.darkMode ? <Moon size={18} color="var(--text-secondary)" /> : <Sun size={18} color="var(--orange)" />}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 500 }}>Modalità scura</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Riduci l'affaticamento degli occhi</p>
          </div>
          <button onClick={() => update({ darkMode: !settings.darkMode })} style={{
            width: 48, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer',
            background: settings.darkMode ? 'var(--green-main)' : 'var(--border)',
            transition: 'background 0.2s', position: 'relative', flexShrink: 0
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%', background: 'white',
              position: 'absolute', top: 3,
              left: settings.darkMode ? 23 : 3,
              transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
            }} />
          </button>
        </div>

        {/* High contrast */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 0', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Contrast size={18} color="var(--text-secondary)" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 500 }}>Alto contrasto</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Migliora la leggibilità del testo</p>
          </div>
          <button onClick={() => update({ highContrast: !settings.highContrast })} style={{
            width: 48, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer',
            background: settings.highContrast ? 'var(--green-main)' : 'var(--border)',
            transition: 'background 0.2s', position: 'relative', flexShrink: 0
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%', background: 'white',
              position: 'absolute', top: 3,
              left: settings.highContrast ? 23 : 3,
              transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
            }} />
          </button>
        </div>

        {/* Text size */}
        <div style={{ padding: '16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Type size={18} color="var(--text-secondary)" />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 500 }}>Dimensione testo</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Adatta la leggibilità</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {textSizes.map(ts => (
              <button
                key={ts.val}
                onClick={() => update({ textSize: ts.val })}
                style={{
                  flex: 1, padding: '10px 4px', borderRadius: 10,
                  background: settings.textSize === ts.val ? 'var(--green-main)' : 'var(--surface-2)',
                  color: settings.textSize === ts.val ? 'white' : 'var(--text-secondary)',
                  border: `1.5px solid ${settings.textSize === ts.val ? 'transparent' : 'var(--border)'}`,
                  font: 'inherit', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                }}
              >
                {ts.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}

// ─── Biometric modal ──────────────────────────────────────────────────────────
function BiometricModal({ user, onClose }) {
  const [available, setAvailable] = useState(null) // null=checking, true, false
  const [hasCredential, setHasCredential] = useState(false)
  const [status, setStatus] = useState(null) // 'success'|'error'|null
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setHasCredential(!!getBiometricCredentialId())
    if (!isBiometricSupported()) { setAvailable(false); return }
    isBiometricAvailable().then(setAvailable)
  }, [])

  async function handleRegister() {
    setStatus(null); setLoading(true)
    try {
      const ok = await registerBiometric(user.id, user.email)
      if (ok) { setHasCredential(true); setStatus('success'); setMsg('Face ID / Touch ID attivato!') }
      else setStatus('error'), setMsg('Registrazione annullata o non supportata.')
    } catch (e) {
      setStatus('error'); setMsg(e?.message || 'Errore durante la registrazione.')
    } finally {
      setLoading(false)
    }
  }

  function handleRemove() {
    clearBiometricCredential()
    setHasCredential(false)
    setStatus('success'); setMsg('Autenticazione biometrica rimossa.')
  }

  return (
    <Modal title="Face ID / Touch ID" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Fingerprint size={36} color="var(--green-main)" />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Accesso rapido biometrico</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Usa Face ID, Touch ID o impronta digitale per accedere senza digitare la password.
          </p>
        </div>

        {available === null && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>Verifica disponibilità…</p>
        )}

        {available === false && (
          <div style={{ background: '#fff4e6', border: '1px solid #fed7aa', borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#92400e' }}>
            Il tuo dispositivo o browser non supporta l'autenticazione biometrica.
          </div>
        )}

        {status && (
          <div style={{ padding: '12px 14px', borderRadius: 10, background: status === 'success' ? 'var(--green-pale)' : '#fff0f0', color: status === 'success' ? 'var(--green-dark)' : 'var(--red)', fontSize: 14 }}>
            {msg}
          </div>
        )}

        {available === true && !hasCredential && (
          <button className="btn btn-primary btn-full" onClick={handleRegister} disabled={loading} style={{ gap: 10 }}>
            {loading
              ? <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              : <Fingerprint size={18} />
            }
            {loading ? 'Registrazione…' : 'Attiva Face ID / Touch ID'}
          </button>
        )}

        {available === true && hasCredential && (
          <button className="btn btn-danger btn-full" onClick={handleRemove}>
            Rimuovi autenticazione biometrica
          </button>
        )}
      </div>
    </Modal>
  )
}

// ─── Backup & Restore modal ───────────────────────────────────────────────────
function BackupModal({ user, onClose }) {
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)
  const [status, setStatus] = useState(null)
  const [msg, setMsg] = useState('')

  async function handleExport() {
    setExporting(true); setStatus(null)
    try {
      const [profile, dietLogs, waterLogs, measurements] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('diet_logs').select('*').eq('user_id', user.id),
        supabase.from('water_logs').select('*').eq('user_id', user.id),
        supabase.from('measurements').select('*').eq('user_id', user.id),
      ])

      const backup = {
        version: 1,
        exportedAt: new Date().toISOString(),
        userId: user.id,
        email: user.email,
        data: {
          profile: profile.data,
          dietLogs: dietLogs.data || [],
          waterLogs: waterLogs.data || [],
          measurements: measurements.data || [],
        },
      }

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `nutriplan-backup-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      setStatus('success'); setMsg('Backup esportato con successo!')
    } catch (e) {
      setStatus('error'); setMsg(e?.message || 'Errore durante l\'esportazione.')
    } finally {
      setExporting(false)
    }
  }

  async function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true); setStatus(null)
    try {
      const text = await file.text()
      const backup = JSON.parse(text)
      if (!backup.data || backup.version !== 1) throw new Error('File di backup non valido.')

      const { profile, dietLogs, waterLogs, measurements } = backup.data

      const ops = []
      if (profile) ops.push(supabase.from('profiles').upsert({ ...profile, id: user.id }))
      if (dietLogs?.length) ops.push(supabase.from('diet_logs').upsert(dietLogs.map(r => ({ ...r, user_id: user.id }))))
      if (waterLogs?.length) ops.push(supabase.from('water_logs').upsert(waterLogs.map(r => ({ ...r, user_id: user.id }))))
      if (measurements?.length) ops.push(supabase.from('measurements').upsert(measurements.map(r => ({ ...r, user_id: user.id }))))

      await Promise.all(ops)
      setStatus('success'); setMsg('Ripristino completato!')
    } catch (e) {
      setStatus('error'); setMsg(e?.message || 'Errore durante il ripristino.')
    } finally {
      setImporting(false)
      e.target.value = ''
    }
  }

  return (
    <Modal title="Backup e ripristino" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Esporta tutti i tuoi dati (profilo, diario alimentare, acqua, misurazioni) in un file JSON. Puoi reimportarlo in qualsiasi momento.
        </p>

        {status && (
          <div style={{ padding: '12px 14px', borderRadius: 10, background: status === 'success' ? 'var(--green-pale)' : '#fff0f0', color: status === 'success' ? 'var(--green-dark)' : 'var(--red)', fontSize: 14 }}>
            {msg}
          </div>
        )}

        <button className="btn btn-primary btn-full" onClick={handleExport} disabled={exporting} style={{ gap: 10 }}>
          {exporting
            ? <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            : <Download size={18} />
          }
          {exporting ? 'Esportazione…' : 'Esporta backup'}
        </button>

        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 16 }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
            Ripristina da un backup precedente:
          </p>
          <label style={{ display: 'block' }}>
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
            <span className="btn btn-secondary btn-full" style={{ gap: 10, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              {importing
                ? <span style={{ width: 16, height: 16, border: '2px solid var(--green-main)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                : <Upload size={18} />
              }
              {importing ? 'Ripristino…' : 'Importa backup'}
            </span>
          </label>
        </div>

        <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
          ⚠️ Il ripristino sovrascrive i dati esistenti con quelli del file selezionato.
        </p>
      </div>
    </Modal>
  )
}

// ─── Main Profile page ────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, profile, signOut, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [modal, setModal] = useState(null) // 'personal' | 'security' | 'notifications' | 'appearance' | 'biometric' | 'backup'
  const [localProfile, setLocalProfile] = useState(profile)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => { setLocalProfile(profile) }, [profile])

  async function handleSignOut() {
    setLoggingOut(true)
    await signOut()
    navigate('/login')
  }

  async function reloadProfile() {
    await refreshProfile()
    // localProfile is synced from global profile via useEffect([profile])
  }

  const firstName = localProfile?.first_name || localProfile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'P'
  const fullName = localProfile?.full_name || `${localProfile?.first_name || ''} ${localProfile?.last_name || ''}`.trim() || user?.email?.split('@')[0] || 'Utente'

  const menuItems = [
    { icon: <User size={18} />, label: 'Dati personali', desc: 'Nome, altezza, peso, obiettivo', color: 'var(--green-main)', bg: 'var(--green-pale)', action: () => setModal('personal') },
    { icon: <Bell size={18} />, label: 'Notifiche', desc: 'Gestisci gli avvisi', color: '#f0922b', bg: '#fff4e6', action: () => setModal('notifications') },
    { icon: <Shield size={18} />, label: 'Privacy e sicurezza', desc: 'Cambia password', color: '#8b5cf6', bg: '#f5f3ff', action: () => setModal('security') },
    { icon: <Fingerprint size={18} />, label: 'Face ID / Touch ID', desc: 'Accesso rapido biometrico', color: '#0ea5e9', bg: '#e0f2fe', action: () => setModal('biometric') },
    { icon: <Accessibility size={18} />, label: 'Aspetto e accessibilità', desc: 'Tema, contrasto, dimensione testo', color: '#6366f1', bg: '#eef2ff', action: () => setModal('appearance') },
    { icon: <Download size={18} />, label: 'Backup e ripristino', desc: 'Esporta o importa i tuoi dati', color: '#059669', bg: '#d1fae5', action: () => setModal('backup') },
    { icon: <ExternalLink size={18} />, label: 'Piattaforma dietista', desc: 'Accedi al portale professionale', color: '#3b82f6', bg: '#eff6ff', action: () => window.open('https://nutri-plan-pro-cxee.vercel.app', '_blank') },
  ]

  return (
    <>
      <div className="page">
        {/* Header */}
        <div style={{ background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))', padding: 'calc(env(safe-area-inset-top) + 24px) 20px 36px', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', border: '2px solid rgba(255,255,255,0.3)', fontSize: 26, fontWeight: 700, color: 'white' }}>
            {firstName[0]?.toUpperCase()}
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'white', fontWeight: 300, marginBottom: 4 }}>{fullName}</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <Mail size={12} />{user?.email}
          </p>
          {localProfile?.height_cm && localProfile?.target_weight && (
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 12 }}>
              {[
                { label: 'Altezza', val: `${localProfile.height_cm} cm` },
                { label: 'Obiettivo', val: `${localProfile.target_weight} kg` },
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '6px 14px' }}>
                  <p style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>{s.val}</p>
                  <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10 }}>{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '0 16px 16px', marginTop: -16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Menu */}
          <div className="card animate-slideUp" style={{ padding: 0, overflow: 'hidden' }}>
            {menuItems.map((item, i) => (
              <button key={i} onClick={item.action} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: i < menuItems.length - 1 ? '1px solid var(--border-light)' : 'none', font: 'inherit', textAlign: 'left' }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{item.desc}</p>
                </div>
                <ChevronRight size={15} color="var(--text-muted)" />
              </button>
            ))}
          </div>

          {/* App info */}
          <div className="card" style={{ padding: '14px 16px', textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>NutriPlan Paziente · v1.0.0</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Powered by NutriPlan Pro</p>
          </div>

          {/* Sign out */}
          <button onClick={handleSignOut} disabled={loggingOut} className="btn" style={{ background: '#fff0f0', color: 'var(--red)', border: '1.5px solid #ffd4d4', borderRadius: 'var(--radius-md)', padding: '14px', fontSize: 15, fontWeight: 500, width: '100%', justifyContent: 'center', gap: 8 }}>
            <LogOut size={17} />{loggingOut ? 'Uscita…' : 'Esci dall\'account'}
          </button>
        </div>
      </div>

      {modal === 'personal' && <PersonalDataModal profile={localProfile} user={user} onClose={() => setModal(null)} onSaved={reloadProfile} />}
      {modal === 'security' && <SecurityModal onClose={() => setModal(null)} />}
      {modal === 'notifications' && <NotificationsModal onClose={() => setModal(null)} />}
      {modal === 'appearance' && <AppearanceModal onClose={() => setModal(null)} />}
      {modal === 'biometric' && <BiometricModal user={user} onClose={() => setModal(null)} />}
      {modal === 'backup' && <BackupModal user={user} onClose={() => setModal(null)} />}
    </>
  )
}
