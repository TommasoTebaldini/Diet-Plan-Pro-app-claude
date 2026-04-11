import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useAppSettings } from '../context/AppSettingsContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  LogOut, User, Mail, ExternalLink, ChevronRight, Bell, Shield, X, Check,
  Eye, EyeOff, Camera, Utensils, AlertCircle, Palette, Globe, Sun, Moon,
} from 'lucide-react'

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

// ─── Toggle switch ────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)} style={{
      width: 48, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer',
      background: checked ? 'var(--green-main)' : 'var(--border)',
      transition: 'background 0.2s', position: 'relative', flexShrink: 0,
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: '50%', background: 'white',
        position: 'absolute', top: 3,
        left: checked ? 23 : 3,
        transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
      }} />
    </button>
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
  const [currentWeight, setCurrentWeight] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function save() {
    setSaving(true)
    const updates = {
      id: user.id,
      full_name: `${form.first_name} ${form.last_name}`.trim(),
      ...form,
      height_cm: form.height_cm ? parseFloat(form.height_cm) : null,
      target_weight: form.target_weight ? parseFloat(form.target_weight) : null,
    }
    const { error } = await supabase.from('profiles').upsert(updates)
    if (!error && currentWeight) {
      const today = new Date().toISOString().split('T')[0]
      await supabase.from('weight_logs').upsert({
        user_id: user.id, date: today, weight_kg: parseFloat(currentWeight),
      }, { onConflict: 'user_id,date' })
    }
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
            <label className="input-label">Peso attuale (kg)</label>
            <input type="number" className="input-field" value={currentWeight} onChange={e => setCurrentWeight(e.target.value)} placeholder="es. 72" inputMode="decimal" step="0.1" />
          </div>
        </div>
        <div className="input-group">
          <label className="input-label">Peso obiettivo (kg)</label>
          <input type="number" className="input-field" value={form.target_weight} onChange={set('target_weight')} placeholder="70" inputMode="decimal" step="0.1" />
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

// ─── Intolerances & allergies modal ──────────────────────────────────────────
function IntolerancesModal({ profile, user, onClose, onSaved }) {
  const ITEMS = [
    'Glutine (frumento, orzo, segale)',
    'Lattosio',
    'Uova',
    'Arachidi',
    'Frutta a guscio (noci, mandorle, nocciole…)',
    'Pesce',
    'Crostacei e molluschi',
    'Soia',
    'Sedano',
    'Sesamo',
    'Senape',
    'Lupini',
    'Anidride solforosa e solfiti',
  ]
  const initial = Array.isArray(profile?.intolerances) ? profile.intolerances : (profile?.intolerances ? JSON.parse(profile.intolerances) : [])
  const [selected, setSelected] = useState(initial)
  const [other, setOther] = useState(() => {
    const custom = initial.filter(x => !ITEMS.includes(x))
    return custom.join(', ')
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function toggle(item) {
    setSelected(s => s.includes(item) ? s.filter(x => x !== item) : [...s, item])
  }

  async function save() {
    setSaving(true)
    const extras = other.split(',').map(s => s.trim()).filter(Boolean)
    const all = [...selected.filter(x => ITEMS.includes(x)), ...extras]
    const { error } = await supabase.from('profiles').upsert({ id: user.id, intolerances: all })
    setSaving(false)
    if (!error) { setSaved(true); setTimeout(() => { onSaved(); onClose() }, 900) }
  }

  return (
    <Modal title="Intolleranze e allergie" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Seleziona le tue intolleranze o allergie alimentari.
        </p>
        {ITEMS.map((item, i) => (
          <div key={item} onClick={() => toggle(item)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0', borderBottom: i < ITEMS.length - 1 ? '1px solid var(--border-light)' : 'none', cursor: 'pointer' }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${selected.includes(item) ? 'var(--green-main)' : 'var(--border)'}`, background: selected.includes(item) ? 'var(--green-main)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
              {selected.includes(item) && <Check size={13} color="white" strokeWidth={3} />}
            </div>
            <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>{item}</span>
          </div>
        ))}
        <div className="input-group" style={{ marginTop: 16 }}>
          <label className="input-label">Altre intolleranze / allergie</label>
          <input className="input-field" value={other} onChange={e => setOther(e.target.value)} placeholder="es. nichel, istamina…" />
        </div>
        <button className="btn btn-primary btn-full" onClick={save} disabled={saving || saved} style={{ marginTop: 18 }}>
          {saved ? <><Check size={16} /> Salvato!</> : saving ? 'Salvataggio…' : 'Salva'}
        </button>
      </div>
    </Modal>
  )
}

// ─── Food preferences modal ───────────────────────────────────────────────────
function FoodPrefsModal({ profile, user, onClose, onSaved }) {
  const DIETS = [
    { val: 'onnivoro', label: '🍖 Onnivoro', desc: 'Nessuna restrizione' },
    { val: 'vegetariano', label: '🥗 Vegetariano', desc: 'No carne e pesce' },
    { val: 'vegano', label: '🌱 Vegano', desc: 'No prodotti animali' },
    { val: 'pescetariano', label: '🐟 Pescetariano', desc: 'No carne, sì pesce' },
    { val: 'flexitariano', label: '🥦 Flexitariano', desc: 'Prevalentemente vegetale' },
  ]
  const EXTRAS = [
    'Senza glutine', 'Senza lattosio', 'Low carb', 'Keto', 'Paleo',
    'Senza zucchero aggiunto', 'Dieta mediterranea', 'Halal', 'Kosher',
  ]
  const initial = Array.isArray(profile?.food_preferences) ? profile.food_preferences : (profile?.food_preferences ? JSON.parse(profile.food_preferences) : [])
  const currentDiet = DIETS.find(d => initial.includes(d.val))?.val || 'onnivoro'
  const [diet, setDiet] = useState(currentDiet)
  const [extras, setExtras] = useState(initial.filter(x => EXTRAS.includes(x)))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function toggleExtra(item) {
    setExtras(s => s.includes(item) ? s.filter(x => x !== item) : [...s, item])
  }

  async function save() {
    setSaving(true)
    const all = [diet, ...extras]
    const { error } = await supabase.from('profiles').upsert({ id: user.id, food_preferences: all })
    setSaving(false)
    if (!error) { setSaved(true); setTimeout(() => { onSaved(); onClose() }, 900) }
  }

  return (
    <Modal title="Preferenze alimentari" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 10 }}>Tipo di dieta</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {DIETS.map(d => (
              <button key={d.val} onClick={() => setDiet(d.val)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, border: `1.5px solid ${diet === d.val ? 'var(--green-main)' : 'var(--border)'}`, background: diet === d.val ? 'var(--green-pale)' : 'var(--surface)', cursor: 'pointer', font: 'inherit', textAlign: 'left', transition: 'all 0.15s' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: diet === d.val ? 'var(--green-dark)' : 'var(--text-primary)' }}>{d.label}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{d.desc}</p>
                </div>
                {diet === d.val && <Check size={16} color="var(--green-main)" />}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 10 }}>Restrizioni aggiuntive</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {EXTRAS.map(item => {
              const on = extras.includes(item)
              return (
                <button key={item} onClick={() => toggleExtra(item)} style={{ padding: '7px 14px', borderRadius: 100, border: `1.5px solid ${on ? 'var(--green-main)' : 'var(--border)'}`, background: on ? 'var(--green-pale)' : 'var(--surface)', color: on ? 'var(--green-dark)' : 'var(--text-secondary)', fontSize: 13, fontWeight: on ? 600 : 400, cursor: 'pointer', font: 'inherit', transition: 'all 0.15s' }}>
                  {item}
                </button>
              )
            })}
          </div>
        </div>
        <button className="btn btn-primary btn-full" onClick={save} disabled={saving || saved}>
          {saved ? <><Check size={16} /> Salvato!</> : saving ? 'Salvataggio…' : 'Salva preferenze'}
        </button>
      </div>
    </Modal>
  )
}

// ─── Change password modal ────────────────────────────────────────────────────
function SecurityModal({ onClose }) {
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' })
  const [show, setShow] = useState(false)
  const [status, setStatus] = useState(null)
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
          <div style={{ padding: '12px 14px', borderRadius: 10, background: status === 'success' ? 'var(--green-pale)' : 'rgba(220,74,74,0.08)', color: status === 'success' ? 'var(--green-dark)' : 'var(--red)', fontSize: 14 }}>
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
function NotificationsModal({ onClose }) {
  const PREFS_KEY = 'nutriplan_notif_prefs'
  const defaults = { newMessage: true, newDocument: true, dietUpdate: true, waterReminder: false, mealReminder: false }
  const [prefs, setPrefs] = useState(() => {
    try { return { ...defaults, ...JSON.parse(localStorage.getItem(PREFS_KEY) || '{}') } }
    catch { return defaults }
  })

  const toggle = k => {
    const next = { ...prefs, [k]: !prefs[k] }
    setPrefs(next)
    localStorage.setItem(PREFS_KEY, JSON.stringify(next))
  }

  const items = [
    { key: 'newMessage', label: 'Nuovo messaggio dal dietista', desc: 'Avvisami quando il dietista ti scrive' },
    { key: 'newDocument', label: 'Nuovo documento condiviso', desc: 'Avvisami quando viene aggiunto un documento' },
    { key: 'dietUpdate', label: 'Aggiornamento piano alimentare', desc: 'Avvisami quando la dieta viene modificata' },
    { key: 'waterReminder', label: 'Promemoria acqua', desc: 'Ricordami di bere durante la giornata' },
    { key: 'mealReminder', label: 'Promemoria pasti', desc: 'Ricordami di registrare i pasti' },
  ]

  return (
    <Modal title="Notifiche" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {items.map((item, i) => (
          <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 0', borderBottom: i < items.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{item.label}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.desc}</p>
            </div>
            <Toggle checked={prefs[item.key]} onChange={() => toggle(item.key)} />
          </div>
        ))}
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 16, lineHeight: 1.6 }}>
          ℹ️ Le notifiche push richiedono che l'app sia installata sul dispositivo.
        </p>
      </div>
    </Modal>
  )
}

// ─── Appearance (theme) modal ─────────────────────────────────────────────────
function AppearanceModal({ onClose }) {
  const { theme, setTheme } = useAppSettings()

  const options = [
    { val: 'light', label: 'Chiaro', desc: 'Sfondo bianco, testo scuro', icon: <Sun size={20} /> },
    { val: 'dark', label: 'Scuro', desc: 'Sfondo scuro, testo chiaro', icon: <Moon size={20} /> },
  ]

  return (
    <Modal title="Aspetto" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4, lineHeight: 1.6 }}>
          Scegli il tema visivo dell'app.
        </p>
        {options.map(opt => (
          <button key={opt.val} onClick={() => setTheme(opt.val)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px', borderRadius: 14, border: `2px solid ${theme === opt.val ? 'var(--green-main)' : 'var(--border)'}`, background: theme === opt.val ? 'var(--green-pale)' : 'var(--surface)', cursor: 'pointer', font: 'inherit', textAlign: 'left', transition: 'all 0.15s' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: theme === opt.val ? 'var(--green-main)' : 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme === opt.val ? 'white' : 'var(--text-muted)', flexShrink: 0 }}>
              {opt.icon}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: theme === opt.val ? 'var(--green-dark)' : 'var(--text-primary)' }}>{opt.label}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{opt.desc}</p>
            </div>
            {theme === opt.val && <Check size={18} color="var(--green-main)" />}
          </button>
        ))}
      </div>
    </Modal>
  )
}

// ─── Language modal ───────────────────────────────────────────────────────────
function LanguageModal({ onClose }) {
  const { language, setLanguage } = useAppSettings()

  const langs = [
    { val: 'it', label: 'Italiano', flag: '🇮🇹', available: true },
    { val: 'en', label: 'English', flag: '🇬🇧', available: false },
  ]

  return (
    <Modal title="Lingua" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4, lineHeight: 1.6 }}>
          Seleziona la lingua dell'app.
        </p>
        {langs.map(l => (
          <button key={l.val} onClick={() => l.available && setLanguage(l.val)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px', borderRadius: 14, border: `2px solid ${language === l.val ? 'var(--green-main)' : 'var(--border)'}`, background: language === l.val ? 'var(--green-pale)' : 'var(--surface)', cursor: l.available ? 'pointer' : 'default', font: 'inherit', textAlign: 'left', opacity: l.available ? 1 : 0.6, transition: 'all 0.15s' }}>
            <span style={{ fontSize: 28 }}>{l.flag}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: language === l.val ? 'var(--green-dark)' : 'var(--text-primary)' }}>{l.label}</p>
              {!l.available && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Disponibile prossimamente</p>}
            </div>
            {language === l.val && <Check size={18} color="var(--green-main)" />}
          </button>
        ))}
      </div>
    </Modal>
  )
}

// ─── Main Profile page ────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, profile, signOut, refreshProfile } = useAuth()
  const { theme } = useAppSettings()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [modal, setModal] = useState(null)
  const [localProfile, setLocalProfile] = useState(profile)
  const [loggingOut, setLoggingOut] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)

  useEffect(() => { setLocalProfile(profile) }, [profile])

  async function handleSignOut() {
    setLoggingOut(true)
    await signOut()
    navigate('/login')
  }

  async function reloadProfile() {
    await refreshProfile()
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const maxSize = 5 * 1024 * 1024 // 5 MB
    if (file.size > maxSize) return alert('La foto è troppo grande. Massimo 5 MB.')
    setAvatarUploading(true)
    try {
      const ext = file.name.split('.').pop().toLowerCase()
      const path = `${user.id}.${ext}`
      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      const avatarUrl = `${data.publicUrl}?t=${Date.now()}`
      await supabase.from('profiles').upsert({ id: user.id, avatar_url: avatarUrl })
      await refreshProfile()
    } catch (err) {
      console.error('Avatar upload error:', err)
    } finally {
      setAvatarUploading(false)
      e.target.value = ''
    }
  }

  const firstName = localProfile?.first_name || localProfile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'P'
  const fullName = localProfile?.full_name || `${localProfile?.first_name || ''} ${localProfile?.last_name || ''}`.trim() || user?.email?.split('@')[0] || 'Utente'
  const avatarUrl = localProfile?.avatar_url

  const menuItems = [
    { icon: <User size={18} />, label: 'Dati personali', desc: 'Nome, data nascita, altezza, peso', color: 'var(--green-main)', bg: 'var(--green-pale)', action: () => setModal('personal') },
    { icon: <AlertCircle size={18} />, label: 'Intolleranze e allergie', desc: 'Glutine, lattosio e altro', color: '#e8882a', bg: '#fff4e6', action: () => setModal('intolerances') },
    { icon: <Utensils size={18} />, label: 'Preferenze alimentari', desc: 'Vegetariano, vegano, ecc.', color: '#10b981', bg: '#ecfdf5', action: () => setModal('foodprefs') },
    { icon: <Bell size={18} />, label: 'Notifiche', desc: 'Gestisci gli avvisi', color: '#f0922b', bg: '#fff4e6', action: () => setModal('notifications') },
    { icon: <Shield size={18} />, label: 'Privacy e sicurezza', desc: 'Cambia password', color: '#8b5cf6', bg: '#f5f3ff', action: () => setModal('security') },
    { icon: <Palette size={18} />, label: 'Aspetto', desc: theme === 'dark' ? 'Tema scuro attivo' : 'Tema chiaro attivo', color: '#3b82f6', bg: '#eff6ff', action: () => setModal('appearance') },
    { icon: <Globe size={18} />, label: 'Lingua', desc: 'Italiano', color: '#0ea5e9', bg: '#f0f9ff', action: () => setModal('language') },
    { icon: <ExternalLink size={18} />, label: 'Piattaforma dietista', desc: 'Accedi al portale professionale', color: '#64748b', bg: '#f8fafc', action: () => window.open('https://nutri-plan-pro-cxee.vercel.app', '_blank') },
  ]

  return (
    <>
      <div className="page">
        {/* Header */}
        <div style={{ background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))', padding: 'calc(env(safe-area-inset-top) + 24px) 20px 36px', textAlign: 'center' }}>
          {/* Avatar with upload button */}
          <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 12px' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.3)', fontSize: 28, fontWeight: 700, color: 'white', overflow: 'hidden' }}>
              {avatarUploading ? (
                <div style={{ width: 24, height: 24, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              ) : avatarUrl ? (
                <img src={avatarUrl} alt="Foto profilo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                firstName[0]?.toUpperCase()
              )}
            </div>
            <button onClick={() => fileInputRef.current?.click()} style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: '50%', background: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.25)' }}>
              <Camera size={13} color="var(--green-dark)" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
          </div>

          <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 22, color: 'white', fontWeight: 300, marginBottom: 4 }}>{fullName}</h2>
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
          <button onClick={handleSignOut} disabled={loggingOut} className="btn btn-danger" style={{ borderRadius: 'var(--r-md)', padding: '14px', fontSize: 15, fontWeight: 500, width: '100%', justifyContent: 'center', gap: 8 }}>
            <LogOut size={17} />{loggingOut ? 'Uscita…' : 'Esci dall\'account'}
          </button>
        </div>
      </div>

      {modal === 'personal' && <PersonalDataModal profile={localProfile} user={user} onClose={() => setModal(null)} onSaved={reloadProfile} />}
      {modal === 'intolerances' && <IntolerancesModal profile={localProfile} user={user} onClose={() => setModal(null)} onSaved={reloadProfile} />}
      {modal === 'foodprefs' && <FoodPrefsModal profile={localProfile} user={user} onClose={() => setModal(null)} onSaved={reloadProfile} />}
      {modal === 'security' && <SecurityModal onClose={() => setModal(null)} />}
      {modal === 'notifications' && <NotificationsModal onClose={() => setModal(null)} />}
      {modal === 'appearance' && <AppearanceModal onClose={() => setModal(null)} />}
      {modal === 'language' && <LanguageModal onClose={() => setModal(null)} />}
    </>
  )
}
