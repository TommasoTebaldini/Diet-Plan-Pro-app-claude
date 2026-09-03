import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useAppSettings } from '../context/AppSettingsContext'
import { useAchievements } from '../context/AchievementsContext'
import { checkWeightAchievements } from '../lib/achievementTriggers'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { validateImageFile } from '../lib/fileValidation'
import { useT } from '../i18n'
import {
  LogOut, User, Mail, ChevronRight, Bell, Shield, X, Check,
  Eye, EyeOff, Camera, Utensils, AlertCircle, Globe, Moon, Sun, Type, Contrast,
  Fingerprint, Download, Upload, Accessibility, Plus, Trash2, BellOff, BellRing,
  Star, Crown,
} from 'lucide-react'
import { useSubscription } from '../hooks/useSubscription'
import {
  isBiometricSupported,
  isBiometricAvailable,
  getBiometricCredentialId,
  getBiometricUserId,
  registerBiometric,
  clearBiometricCredential,
} from '../lib/biometric'
import {
  loadPrefs, savePrefs, getPermissionStatus, requestPermission, initScheduledNotifications,
  subscribeToPush, DEFAULT_PREFS,
} from '../lib/notifications'

// Local calendar date (not UTC) — toISOString() shifts to UTC and shows
// the wrong day for users east of UTC (e.g. Italy) right after midnight.
function localDateStr(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// A legacy row saved before these columns were arrays (or any manual DB edit)
// could leave a non-JSON string here — JSON.parse would throw synchronously
// during render and take down the whole page for that patient.
function safeParseArray(v) {
  if (!v) return []
  try {
    const parsed = JSON.parse(v)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// ─── Modal wrapper ────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  const t = useT()
  return (
    <div className="modal-fullscreen" style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
      <div style={{ background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))', padding: 'calc(env(safe-area-inset-top) + 14px) 18px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onClose} aria-label={t('common.close', 'Chiudi')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', flexShrink: 0 }}>
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
  const t = useT()
  const { checkAndAward } = useAchievements()
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
  const [error, setError] = useState('')
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function save() {
    setSaving(true)
    setError('')
    const updates = {
      id: user.id,
      full_name: `${form.first_name} ${form.last_name}`.trim(),
      ...form,
      height_cm: form.height_cm ? parseFloat(form.height_cm) : null,
      target_weight: form.target_weight ? parseFloat(form.target_weight) : null,
    }
    const { error: saveError } = await supabase.from('profiles').upsert(updates)
    let weightError = null
    if (!saveError && currentWeight) {
      const today = localDateStr()
      ;({ error: weightError } = await supabase.from('weight_logs').upsert({
        user_id: user.id, date: today, weight_kg: parseFloat(currentWeight),
      }, { onConflict: 'user_id,date' }))
    }
    setSaving(false)
    if (!saveError && !weightError) {
      setSaved(true)
      if (currentWeight) checkWeightAchievements(supabase, user.id, checkAndAward, parseFloat(currentWeight)).catch(() => {})
      const coreFilled = form.first_name && form.last_name && form.birth_date && form.gender && form.height_cm && form.activity_level
      if (coreFilled) checkAndAward('profile_complete').catch(() => {})
      setTimeout(() => { onSaved(); onClose() }, 900)
    } else {
      // Previously: on error the button just reverted from "Salvataggio…" to
      // "Salva" with zero indication anything went wrong — the patient could
      // believe safety-relevant data (allergies, etc.) had been saved when it
      // hadn't. Surface it like SecurityModal already does for password errors.
      setError((saveError || weightError)?.message || t('profile.save_error', 'Errore nel salvataggio'))
    }
  }

  const ACTIVITY = [
    { val: 'sedentario', label: t('profile.activity_sedentary', 'Sedentario') },
    { val: 'leggero', label: t('profile.activity_light', 'Leggero (1-2 giorni/sett)') },
    { val: 'moderato', label: t('profile.activity_moderate', 'Moderato (3-5 giorni/sett)') },
    { val: 'attivo', label: t('profile.activity_active', 'Attivo (6-7 giorni/sett)') },
    { val: 'molto_attivo', label: t('profile.activity_very_active', 'Molto attivo') },
  ]

  return (
    <Modal title={t('profile.personal_data', 'Dati personali')} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {error && (
          <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(220,74,74,0.08)', color: 'var(--red)', fontSize: 14 }}>
            {error}
          </div>
        )}
        <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="input-group">
            <label className="input-label" htmlFor="pd-first-name">{t('profile.first_name', 'Nome')}</label>
            <input id="pd-first-name" className="input-field" value={form.first_name} onChange={set('first_name')} placeholder={t('profile.first_name_placeholder', 'Mario')} />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="pd-last-name">{t('profile.last_name', 'Cognome')}</label>
            <input id="pd-last-name" className="input-field" value={form.last_name} onChange={set('last_name')} placeholder={t('profile.last_name_placeholder', 'Rossi')} />
          </div>
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="pd-birth-date">{t('profile.date_of_birth', 'Data di nascita')}</label>
          <input id="pd-birth-date" type="date" className="input-field" value={form.birth_date} onChange={set('birth_date')} />
        </div>
        <div className="input-group">
          <label className="input-label">{t('profile.gender', 'Sesso')}</label>
          <div role="group" aria-label={t('profile.gender', 'Sesso')} style={{ display: 'flex', gap: 10 }}>
            {['M', 'F'].map(g => (
              <button key={g} onClick={() => setForm(f => ({ ...f, gender: g }))} aria-pressed={form.gender === g} style={{ flex: 1, padding: '11px', borderRadius: 12, background: form.gender === g ? 'var(--green-main)' : 'var(--surface-2)', color: form.gender === g ? 'white' : 'var(--text-secondary)', border: `1.5px solid ${form.gender === g ? 'transparent' : 'var(--border)'}`, font: 'inherit', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                {g === 'M' ? t('profile.gender_male_option', '♂ Maschio') : t('profile.gender_female_option', '♀ Femmina')}
              </button>
            ))}
          </div>
        </div>
        <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="input-group">
            <label className="input-label" htmlFor="pd-height">{t('profile.height', 'Altezza (cm)')}</label>
            <input id="pd-height" type="number" className="input-field" value={form.height_cm} onChange={set('height_cm')} placeholder="170" inputMode="decimal" />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="pd-current-weight">{t('profile.current_weight', 'Peso attuale (kg)')}</label>
            <input id="pd-current-weight" type="number" className="input-field" value={currentWeight} onChange={e => setCurrentWeight(e.target.value)} placeholder={t('profile.current_weight_placeholder', 'es. 72')} inputMode="decimal" step="0.1" />
          </div>
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="pd-target-weight">{t('profile.target_weight', 'Peso obiettivo (kg)')}</label>
          <input id="pd-target-weight" type="number" className="input-field" value={form.target_weight} onChange={set('target_weight')} placeholder="70" inputMode="decimal" step="0.1" />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="pd-activity-level">{t('profile.activity_level_full', 'Livello attività fisica')}</label>
          <select id="pd-activity-level" className="input-field" value={form.activity_level} onChange={set('activity_level')}>
            <option value="">{t('profile.select_placeholder', 'Seleziona…')}</option>
            {ACTIVITY.map(a => <option key={a.val} value={a.val}>{a.label}</option>)}
          </select>
        </div>
        <button className="btn btn-primary btn-full" onClick={save} disabled={saving || saved} style={{ marginTop: 6 }}>
          {saved ? <><Check size={16} /> {t('profile.saved_exclaim', 'Salvato!')}</> : saving ? t('profile.saving_ellipsis', 'Salvataggio…') : t('profile.personal_data_save', 'Salva dati')}
        </button>
      </div>
    </Modal>
  )
}

// ─── Intolerances & allergies modal ──────────────────────────────────────────
function IntolerancesModal({ profile, user, onClose, onSaved }) {
  const t = useT()
  const ITEMS = [
    t('profile.intol_gluten', 'Glutine (frumento, orzo, segale)'),
    t('profile.intol_lactose', 'Lattosio'),
    t('profile.intol_eggs', 'Uova'),
    t('profile.intol_peanuts', 'Arachidi'),
    t('profile.intol_treenuts', 'Frutta a guscio (noci, mandorle, nocciole…)'),
    t('profile.intol_fish', 'Pesce'),
    t('profile.intol_shellfish', 'Crostacei e molluschi'),
    t('profile.intol_soy', 'Soia'),
    t('profile.intol_celery', 'Sedano'),
    t('profile.intol_sesame', 'Sesamo'),
    t('profile.intol_mustard', 'Senape'),
    t('profile.intol_lupin', 'Lupini'),
    t('profile.intol_sulphites', 'Anidride solforosa e solfiti'),
  ]
  const initial = Array.isArray(profile?.intolerances) ? profile.intolerances : safeParseArray(profile?.intolerances)
  const [selected, setSelected] = useState(initial)
  const [other, setOther] = useState(() => {
    const custom = initial.filter(x => !ITEMS.includes(x))
    return custom.join(', ')
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function toggle(item) {
    setSelected(s => s.includes(item) ? s.filter(x => x !== item) : [...s, item])
  }

  async function save() {
    setSaving(true)
    setError('')
    const extras = other.split(',').map(s => s.trim()).filter(Boolean)
    const all = [...selected.filter(x => ITEMS.includes(x)), ...extras]
    const { error: saveError } = await supabase.from('profiles').upsert({ id: user.id, intolerances: all })
    setSaving(false)
    if (!saveError) { setSaved(true); setTimeout(() => { onSaved(); onClose() }, 900) }
    // Otherwise: don't let the button silently revert to "Salva" — allergy data
    // is safety-relevant, the patient must know the save failed.
    else setError(saveError.message || t('profile.save_error', 'Errore nel salvataggio'))
  }

  return (
    <Modal title={t('profile.intolerances', 'Intolleranze e allergie')} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          {t('profile.intolerances_select_text', 'Seleziona le tue intolleranze o allergie alimentari.')}
        </p>
        {error && (
          <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(220,74,74,0.08)', color: 'var(--red)', fontSize: 14, marginBottom: 16 }}>
            {error}
          </div>
        )}
        {ITEMS.map((item, i) => (
          <div key={item} onClick={() => toggle(item)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0', borderBottom: i < ITEMS.length - 1 ? '1px solid var(--border-light)' : 'none', cursor: 'pointer' }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${selected.includes(item) ? 'var(--green-main)' : 'var(--border)'}`, background: selected.includes(item) ? 'var(--green-main)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
              {selected.includes(item) && <Check size={13} color="white" strokeWidth={3} />}
            </div>
            <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>{item}</span>
          </div>
        ))}
        <div className="input-group" style={{ marginTop: 16 }}>
          <label className="input-label">{t('profile.intolerances_other_label', 'Altre intolleranze / allergie')}</label>
          <input className="input-field" value={other} onChange={e => setOther(e.target.value)} placeholder={t('profile.intolerances_other_placeholder', 'es. nichel, istamina…')} />
        </div>
        <button className="btn btn-primary btn-full" onClick={save} disabled={saving || saved} style={{ marginTop: 18 }}>
          {saved ? <><Check size={16} /> {t('profile.saved_exclaim', 'Salvato!')}</> : saving ? t('profile.saving_ellipsis', 'Salvataggio…') : t('common.save', 'Salva')}
        </button>
      </div>
    </Modal>
  )
}

// ─── Food preferences modal ───────────────────────────────────────────────────
function FoodPrefsModal({ profile, user, onClose, onSaved }) {
  const t = useT()
  const DIETS = [
    { val: 'onnivoro', label: t('profile.diet_omnivore_label', '🍖 Onnivoro'), desc: t('profile.diet_omnivore_desc', 'Nessuna restrizione') },
    { val: 'vegetariano', label: t('profile.diet_vegetarian_label', '🥗 Vegetariano'), desc: t('profile.diet_vegetarian_desc', 'No carne e pesce') },
    { val: 'vegano', label: t('profile.diet_vegan_label', '🌱 Vegano'), desc: t('profile.diet_vegan_desc', 'No prodotti animali') },
    { val: 'pescetariano', label: t('profile.diet_pescetarian_label', '🐟 Pescetariano'), desc: t('profile.diet_pescetarian_desc', 'No carne, sì pesce') },
    { val: 'flexitariano', label: t('profile.diet_flexitarian_label', '🥦 Flexitariano'), desc: t('profile.diet_flexitarian_desc', 'Prevalentemente vegetale') },
  ]
  const EXTRAS = [
    t('profile.diet_glutenfree', 'Senza glutine'), t('profile.extra_lactosefree', 'Senza lattosio'), t('profile.extra_lowcarb', 'Low carb'), t('profile.extra_keto', 'Keto'), t('profile.extra_paleo', 'Paleo'),
    t('profile.extra_no_added_sugar', 'Senza zucchero aggiunto'), t('profile.extra_mediterranean', 'Dieta mediterranea'), t('profile.extra_halal', 'Halal'), t('profile.extra_kosher', 'Kosher'),
  ]
  const initial = Array.isArray(profile?.food_preferences) ? profile.food_preferences : safeParseArray(profile?.food_preferences)
  const currentDiet = DIETS.find(d => initial.includes(d.val))?.val || 'onnivoro'
  const [diet, setDiet] = useState(currentDiet)
  const [extras, setExtras] = useState(initial.filter(x => EXTRAS.includes(x)))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function toggleExtra(item) {
    setExtras(s => s.includes(item) ? s.filter(x => x !== item) : [...s, item])
  }

  async function save() {
    setSaving(true)
    setError('')
    const all = [diet, ...extras]
    const { error: saveError } = await supabase.from('profiles').upsert({ id: user.id, food_preferences: all })
    setSaving(false)
    if (!saveError) { setSaved(true); setTimeout(() => { onSaved(); onClose() }, 900) }
    else setError(saveError.message || t('profile.save_error', 'Errore nel salvataggio'))
  }

  return (
    <Modal title={t('profile.food_prefs', 'Preferenze alimentari')} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {error && (
          <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(220,74,74,0.08)', color: 'var(--red)', fontSize: 14 }}>
            {error}
          </div>
        )}
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 10 }}>{t('profile.diet_type', 'Tipo di dieta')}</p>
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
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 10 }}>{t('profile.food_prefs_extra_restrictions', 'Restrizioni aggiuntive')}</p>
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
          {saved ? <><Check size={16} /> {t('profile.saved_exclaim', 'Salvato!')}</> : saving ? t('profile.saving_ellipsis', 'Salvataggio…') : t('profile.food_prefs_save', 'Salva preferenze')}
        </button>
      </div>
    </Modal>
  )
}

// ─── Change password modal ────────────────────────────────────────────────────
function SecurityModal({ onClose }) {
  const t = useT()
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' })
  const [show, setShow] = useState(false)
  const [status, setStatus] = useState(null)
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function changePassword() {
    if (form.newPass !== form.confirm) return setStatus('error'), setMsg(t('profile.password_mismatch', 'Le password non coincidono'))
    if (form.newPass.length < 8) return setStatus('error'), setMsg(t('profile.password_too_short', 'La password deve avere almeno 8 caratteri'))
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: form.newPass })
    setLoading(false)
    if (error) { setStatus('error'); setMsg(error.message) }
    else { setStatus('success'); setMsg(t('profile.password_updated_success', 'Password aggiornata con successo!')); setTimeout(onClose, 1500) }
  }

  return (
    <Modal title={t('profile.security_title', 'Privacy e sicurezza')} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {t('profile.security_description', 'Cambia la password del tuo account. Usa una password di almeno 8 caratteri.')}
        </p>
        {status && (
          <div style={{ padding: '12px 14px', borderRadius: 10, background: status === 'success' ? 'var(--green-pale)' : 'rgba(220,74,74,0.08)', color: status === 'success' ? 'var(--green-dark)' : 'var(--red)', fontSize: 14 }}>
            {msg}
          </div>
        )}
        {['newPass', 'confirm'].map((k, i) => (
          <div key={k} className="input-group">
            <label className="input-label">{i === 0 ? t('profile.new_password', 'Nuova password') : t('profile.confirm_password_short', 'Conferma password')}</label>
            <div style={{ position: 'relative' }}>
              <input type={show ? 'text' : 'password'} className="input-field" value={form[k]} onChange={set(k)} placeholder="••••••••" style={{ paddingRight: 44 }} />
              {i === 0 && (
                <button type="button" onClick={() => setShow(v => !v)} aria-label={show ? t('profile.hide_password', 'Nascondi password') : t('profile.show_password', 'Mostra password')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              )}
            </div>
          </div>
        ))}
        <button className="btn btn-primary btn-full" onClick={changePassword} disabled={loading || !form.newPass || !form.confirm} style={{ marginTop: 6 }}>
          {loading ? t('profile.updating_ellipsis', 'Aggiornamento…') : t('profile.update_password_button', 'Aggiorna password')}
        </button>
      </div>
    </Modal>
  )
}

// ─── Notifications modal ──────────────────────────────────────────────────────
function Toggle({ on, onClick, label }) {
  return (
    <button onClick={onClick} role="switch" aria-checked={on} aria-label={label} style={{
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

function getWeekDays(t) {
  return [
    { val: 1, label: t('profile.day_monday', 'Lunedì') },
    { val: 2, label: t('profile.day_tuesday', 'Martedì') },
    { val: 3, label: t('profile.day_wednesday', 'Mercoledì') },
    { val: 4, label: t('profile.day_thursday', 'Giovedì') },
    { val: 5, label: t('profile.day_friday', 'Venerdì') },
    { val: 6, label: t('profile.day_saturday', 'Sabato') },
    { val: 0, label: t('profile.day_sunday', 'Domenica') },
  ]
}

function getWaterIntervals(t) {
  return [
    { val: 0.5, label: t('profile.water_interval_30min', 'Ogni 30 min') },
    { val: 1, label: t('profile.water_interval_1h', 'Ogni ora') },
    { val: 1.5, label: t('profile.water_interval_1h30', 'Ogni 1h 30min') },
    { val: 2, label: t('profile.water_interval_2h', 'Ogni 2 ore') },
    { val: 3, label: t('profile.water_interval_3h', 'Ogni 3 ore') },
    { val: 4, label: t('profile.water_interval_4h', 'Ogni 4 ore') },
  ]
}

function NotificationsModal({ user, onClose }) {
  const t = useT()
  const WEEK_DAYS = getWeekDays(t)
  const WATER_INTERVALS = getWaterIntervals(t)
  const [prefs, setPrefs] = useState(loadPrefs)
  const [permStatus, setPermStatus] = useState(getPermissionStatus)
  const [requesting, setRequesting] = useState(false)
  const [pushWarning, setPushWarning] = useState(false)

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
    if (result === 'granted') {
      initScheduledNotifications(prefs)
      // subscribeToPush ora ritorna null anche quando il permesso browser è
      // concesso ma il salvataggio della sottoscrizione su Supabase fallisce
      // — senza aspettarla e controllarla, l'utente vedeva "notifiche
      // attive" pur non ricevendo mai nulla (il server non ha una riga
      // push_subscriptions da cui inviare).
      const sub = await subscribeToPush(user.id)
      setPushWarning(!sub)
    }
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
  const inputStyle = { background: 'var(--surface-2)', border: '1.5px solid var(--border)', borderRadius: 10, padding: '8px 12px', fontSize: 16, color: 'var(--text-primary)', font: 'inherit', width: '100%' }

  return (
    <Modal title={t('profile.notifications_title', 'Notifiche e promemoria')} onClose={onClose}>
      {/* Permission banner */}
      {!permGranted && !notSupported && (
        <div style={{ background: permDenied ? '#fff0f0' : 'var(--green-pale)', border: `1.5px solid ${permDenied ? '#ffd4d4' : 'var(--green-light)'}`, borderRadius: 14, padding: '14px 16px', marginBottom: 20 }}>
          {permDenied ? (
            <>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--red)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <BellOff size={16} /> {t('profile.notifications_blocked_title', 'Notifiche bloccate')}
              </p>
              <p style={{ fontSize: 13, color: '#c0392b', lineHeight: 1.6 }}>
                {t('profile.notifications_blocked_desc', 'Hai bloccato le notifiche. Per attivarle vai nelle impostazioni del browser e concedi il permesso a questo sito.')}
              </p>
            </>
          ) : (
            <>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--green-dark)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <BellRing size={16} /> {t('profile.notifications_enable_title', 'Attiva le notifiche')}
              </p>
              <p style={{ fontSize: 13, color: 'var(--green-dark)', lineHeight: 1.6, marginBottom: 10 }}>
                {t('profile.notifications_enable_desc', "Permetti all'app di mostrare notifiche per ricevere promemoria e avvisi.")}
              </p>
              <button onClick={handleRequestPermission} disabled={requesting} className="btn btn-primary" style={{ fontSize: 14, padding: '10px 18px', gap: 6 }}>
                <Bell size={15} />{requesting ? t('profile.waiting_ellipsis', 'In attesa…') : t('profile.enable_notifications_button', 'Attiva notifiche')}
              </button>
            </>
          )}
        </div>
      )}

      {notSupported && (
        <div style={{ background: '#fff4e6', border: '1.5px solid #f0922b', borderRadius: 14, padding: '14px 16px', marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: '#b45309', lineHeight: 1.6 }}>{t('profile.notifications_not_supported', "⚠️ Il tuo browser non supporta le notifiche push. Installa l'app per ricevere le notifiche.")}</p>
        </div>
      )}

      {permGranted && pushWarning && (
        <div style={{ background: '#fff4e6', border: '1.5px solid #f0922b', borderRadius: 14, padding: '14px 16px', marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: '#b45309', lineHeight: 1.6 }}>{t('profile.push_subscribe_error', "⚠️ Permesso concesso, ma non è stato possibile attivare le notifiche push su questo dispositivo. Riprova più tardi.")}</p>
        </div>
      )}

      {/* ── Event-based notifications ───────────────────────────── */}
      <div style={sectionStyle}>
        <p style={sectionHeaderStyle}>{t('profile.notifications_dietitian_section', 'Avvisi dal dietista')}</p>

        {[
          { key: 'newMessage', label: t('profile.notif_new_message_label', 'Nuovo messaggio'), desc: t('profile.notif_new_message_desc', 'Avvisami quando il dietista ti scrive') },
          { key: 'newDocument', label: t('profile.notif_new_document_label', 'Nuovo documento condiviso'), desc: t('profile.notif_new_document_desc', 'Avvisami quando viene aggiunto un documento') },
          { key: 'dietUpdate', label: t('profile.notif_diet_update_label', 'Aggiornamento piano alimentare'), desc: t('profile.notif_diet_update_desc', 'Avvisami quando la dieta viene modificata') },
        ].map(item => (
          <div key={item.key} style={rowStyle}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.desc}</p>
            </div>
            <Toggle on={prefs[item.key]} onClick={() => update({ [item.key]: !prefs[item.key] })} label={item.label} />
          </div>
        ))}
      </div>

      {/* ── Meal reminders ─────────────────────────────────────── */}
      <div style={sectionStyle}>
        <p style={sectionHeaderStyle}>{t('profile.meal_reminders_section', 'Promemoria pasti')}</p>
        <div style={{ ...rowStyle, borderBottom: prefs.mealReminder ? '1px solid var(--border-light)' : 'none' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 500 }}>{t('profile.meal_reminders_section', 'Promemoria pasti')}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t('profile.meal_reminders_desc', 'Notifica per ogni pasto configurato')}</p>
          </div>
          <Toggle on={prefs.mealReminder} onClick={() => update({ mealReminder: !prefs.mealReminder })} label={t('profile.meal_reminders_section', 'Promemoria pasti')} />
        </div>
        {prefs.mealReminder && (
          <div style={{ padding: '10px 0 4px' }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>{t('profile.meal_config_hint', 'Configura orario e nome per ogni pasto')}</p>
            {prefs.mealTimes.map((mt, i) => {
              const labels = prefs.mealLabels || []
              const label = labels[i] || ''
              const defaultLabels = [
                t('profile.meal_breakfast', 'Colazione'),
                t('profile.meal_morning_snack', 'Spuntino mattina'),
                t('profile.meal_lunch', 'Pranzo'),
                t('profile.meal_afternoon_snack', 'Spuntino pomeriggio'),
                t('profile.meal_dinner', 'Cena'),
                t('profile.meal_evening_snack', 'Spuntino sera'),
              ]
              const placeholder = defaultLabels[i] || t('profile.meal_number', { n: i + 1 }, 'Pasto {{n}}')
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <input
                    type="text"
                    value={label}
                    placeholder={placeholder}
                    onChange={e => {
                      const labels = [...(prefs.mealLabels || Array(prefs.mealTimes.length).fill(''))]
                      labels[i] = e.target.value
                      update({ mealLabels: labels })
                    }}
                    style={{ ...inputStyle, flex: 1.4, fontSize: 13 }}
                  />
                  <input
                    type="time"
                    value={mt}
                    onChange={e => updateMealTime(i, e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  {prefs.mealTimes.length > 1 && (
                    <button onClick={() => {
                      const labels = [...(prefs.mealLabels || [])]
                      labels.splice(i, 1)
                      update({ mealLabels: labels })
                      removeMealTime(i)
                    }} aria-label={t('profile.remove_meal_aria', { meal: placeholder }, 'Rimuovi {{meal}}')} style={{ background: '#fff0f0', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red)', cursor: 'pointer', flexShrink: 0 }}>
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              )
            })}
            {prefs.mealTimes.length < 6 && (
              <button onClick={addMealTime} style={{ background: 'var(--green-pale)', border: '1.5px dashed var(--green-light)', borderRadius: 10, width: '100%', padding: '9px', fontSize: 13, color: 'var(--green-main)', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, font: 'inherit', marginTop: 2 }}>
                <Plus size={14} />{t('profile.add_meal_button', 'Aggiungi pasto')}
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Water reminders ────────────────────────────────────── */}
      <div style={sectionStyle}>
        <p style={sectionHeaderStyle}>{t('profile.water_reminders_section', 'Promemoria acqua')}</p>
        <div style={{ ...rowStyle, borderBottom: prefs.waterReminder ? '1px solid var(--border-light)' : 'none' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 500 }}>{t('profile.water_reminders_section', 'Promemoria acqua')}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t('profile.water_reminders_desc', 'Ricordami di bere durante la giornata')}</p>
          </div>
          <Toggle on={prefs.waterReminder} onClick={() => update({ waterReminder: !prefs.waterReminder })} label={t('profile.water_reminders_aria', 'Promemoria idratazione')} />
        </div>
        {prefs.waterReminder && (
          <div style={{ padding: '10px 0 4px' }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{t('profile.frequency_label', 'Frequenza')}</p>
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
        <p style={sectionHeaderStyle}>{t('profile.weigh_reminders_section', 'Promemoria pesarsi')}</p>
        <div style={{ ...rowStyle, borderBottom: prefs.weighReminder ? '1px solid var(--border-light)' : 'none' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 500 }}>{t('profile.weigh_reminder_weekly_label', 'Promemoria settimanale')}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t('profile.weigh_reminder_weekly_desc', 'Ricordami di pesarmi una volta a settimana')}</p>
          </div>
          <Toggle on={prefs.weighReminder} onClick={() => update({ weighReminder: !prefs.weighReminder })} label={t('profile.weigh_reminder_weekly_aria', 'Promemoria pesata settimanale')} />
        </div>
        {prefs.weighReminder && (
          <div className="form-grid-2" style={{ padding: '10px 0 4px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{t('profile.day_label', 'Giorno')}</p>
              <select
                value={prefs.weighDay}
                onChange={e => update({ weighDay: parseInt(e.target.value) })}
                style={inputStyle}
              >
                {WEEK_DAYS.map(d => <option key={d.val} value={d.val}>{d.label}</option>)}
              </select>
            </div>
            <div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{t('profile.time_label', 'Orario')}</p>
              <input type="time" value={prefs.weighTime} onChange={e => update({ weighTime: e.target.value })} style={inputStyle} />
            </div>
          </div>
        )}
      </div>

      {/* ── Appointment reminder ───────────────────────────────── */}
      <div style={sectionStyle}>
        <p style={sectionHeaderStyle}>{t('profile.appointment_reminder_section', 'Promemoria appuntamento')}</p>
        <div style={{ ...rowStyle, borderBottom: prefs.appointmentReminder ? '1px solid var(--border-light)' : 'none' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 500 }}>{t('profile.appointment_reminder_visit_label', 'Promemoria visita')}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t('profile.appointment_reminder_desc', "Avvisami 1 ora prima dell'appuntamento")}</p>
          </div>
          <Toggle on={prefs.appointmentReminder} onClick={() => update({ appointmentReminder: !prefs.appointmentReminder })} label={t('profile.appointment_reminder_aria', 'Promemoria appuntamenti')} />
        </div>
        {prefs.appointmentReminder && (
          <div className="form-grid-2" style={{ padding: '10px 0 4px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{t('profile.appointment_date_label', 'Data visita')}</p>
              <input type="date" value={prefs.appointmentDate} onChange={e => update({ appointmentDate: e.target.value })} style={inputStyle} min={localDateStr()} />
            </div>
            <div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{t('profile.time_label', 'Orario')}</p>
              <input type="time" value={prefs.appointmentTime} onChange={e => update({ appointmentTime: e.target.value })} style={inputStyle} />
            </div>
          </div>
        )}
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 20, lineHeight: 1.6 }}>
        {t('profile.notifications_footer_info', "ℹ️ I promemoria schedulati (pasti, acqua, pesata) funzionano quando l'app è aperta o installata come PWA.")}
      </p>
    </Modal>
  )
}

// ─── Appearance & Accessibility modal ────────────────────────────────────────
function AppearanceModal({ onClose }) {
  const t = useT()
  const { settings, update } = useAppSettings()

  const textSizes = [
    { val: 'normal', label: t('profile.normal', 'Normale') },
    { val: 'large', label: t('profile.large', 'Grande') },
    { val: 'xlarge', label: t('profile.xlarge', 'Extra grande') },
  ]

  return (
    <Modal title={t('profile.appearance_title', 'Aspetto e accessibilità')} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* Dark mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 0', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {settings.darkMode ? <Moon size={18} color="var(--text-secondary)" /> : <Sun size={18} color="var(--orange)" />}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 500 }}>{t('profile.dark_mode', 'Modalità scura')}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{t('profile.dark_mode_desc', "Riduci l'affaticamento degli occhi")}</p>
          </div>
          <button onClick={() => update({ darkMode: !settings.darkMode })} role="switch" aria-checked={settings.darkMode} aria-label={t('profile.dark_mode', 'Modalità scura')} style={{
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
            <p style={{ fontSize: 14, fontWeight: 500 }}>{t('profile.high_contrast', 'Alto contrasto')}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{t('profile.high_contrast_desc', 'Migliora la leggibilità del testo')}</p>
          </div>
          <button onClick={() => update({ highContrast: !settings.highContrast })} role="switch" aria-checked={settings.highContrast} aria-label={t('profile.high_contrast', 'Alto contrasto')} style={{
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
              <p style={{ fontSize: 14, fontWeight: 500 }}>{t('profile.text_size', 'Dimensione testo')}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{t('profile.text_size_desc', 'Adatta la leggibilità')}</p>
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

// ─── Language modal ───────────────────────────────────────────────────────────
function LanguageModal({ onClose }) {
  const { settings, update } = useAppSettings()

  const langs = [
    { val: 'it', label: 'Italiano', flag: '🇮🇹', desc: 'Lingua predefinita' },
    { val: 'en', label: 'English', flag: '🇬🇧', desc: 'English interface' },
    { val: 'de', label: 'Deutsch', flag: '🇩🇪', desc: 'Deutsche Benutzeroberfläche' },
    { val: 'fr', label: 'Français', flag: '🇫🇷', desc: 'Interface en français' },
    { val: 'es', label: 'Español', flag: '🇪🇸', desc: 'Interfaz en español' },
  ]

  const titleMap = { it: 'Lingua', en: 'Language', de: 'Sprache', fr: 'Langue', es: 'Idioma' }
  const title = titleMap[settings.language] || 'Lingua'

  return (
    <Modal title={title} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {langs.map(l => (
          <button key={l.val} onClick={() => update({ language: l.val })} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px', borderRadius: 14, border: `2px solid ${settings.language === l.val ? 'var(--green-main)' : 'var(--border)'}`, background: settings.language === l.val ? 'var(--green-pale)' : 'var(--surface)', cursor: 'pointer', font: 'inherit', textAlign: 'left', transition: 'all 0.15s' }}>
            <span style={{ fontSize: 28 }}>{l.flag}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: settings.language === l.val ? 'var(--green-dark)' : 'var(--text-primary)' }}>{l.label}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{l.desc}</p>
            </div>
            {settings.language === l.val && <Check size={18} color="var(--green-main)" />}
          </button>
        ))}
      </div>
    </Modal>
  )
}

// ─── Biometric modal ──────────────────────────────────────────────────────────
function BiometricModal({ user, onClose }) {
  const t = useT()
  const [available, setAvailable] = useState(null) // null=checking, true, false
  const [hasCredential, setHasCredential] = useState(false)
  const [status, setStatus] = useState(null) // 'success'|'error'|null
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Il credential salvato in localStorage sopravvive al logout (non viene
    // svuotato da signOut()): su un dispositivo condiviso, senza verificare
    // che appartenga proprio a questo user.id, un utente diverso da quello
    // che l'ha registrato vedrebbe "Face ID già attivo" per una credenziale
    // WebAuthn che non è la sua. Stesso controllo già fatto in AppLockGate.jsx.
    setHasCredential(!!getBiometricCredentialId() && getBiometricUserId() === user.id)
    if (!isBiometricSupported()) { setAvailable(false); return }
    isBiometricAvailable().then(setAvailable)
  }, [user.id])

  async function handleRegister() {
    setStatus(null); setLoading(true)
    try {
      const ok = await registerBiometric(user.id, user.email)
      if (ok) { setHasCredential(true); setStatus('success'); setMsg(t('profile.biometric_activated', 'Face ID / Touch ID attivato!')) }
      else setStatus('error'), setMsg(t('profile.biometric_registration_cancelled', 'Registrazione annullata o non supportata.'))
    } catch (e) {
      setStatus('error'); setMsg(e?.message || t('profile.biometric_registration_error', 'Errore durante la registrazione.'))
    } finally {
      setLoading(false)
    }
  }

  function handleRemove() {
    clearBiometricCredential()
    setHasCredential(false)
    setStatus('success'); setMsg(t('profile.biometric_removed', 'Autenticazione biometrica rimossa.'))
  }

  return (
    <Modal title="Face ID / Touch ID" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Fingerprint size={36} color="var(--green-main)" />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{t('profile.biometric_quick_access_title', 'Accesso rapido biometrico')}</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {t('profile.biometric_description', 'Usa Face ID, Touch ID o impronta digitale per accedere senza digitare la password.')}
          </p>
        </div>

        {available === null && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>{t('profile.biometric_checking', 'Verifica disponibilità…')}</p>
        )}

        {available === false && (
          <div style={{ background: '#fff4e6', border: '1px solid #fed7aa', borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#92400e' }}>
            {t('profile.biometric_not_supported', "Il tuo dispositivo o browser non supporta l'autenticazione biometrica.")}
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
            {loading ? t('profile.biometric_registering', 'Registrazione…') : t('profile.biometric_activate_button', 'Attiva Face ID / Touch ID')}
          </button>
        )}

        {available === true && hasCredential && (
          <button className="btn btn-danger btn-full" onClick={handleRemove}>
            {t('profile.biometric_remove_button', 'Rimuovi autenticazione biometrica')}
          </button>
        )}
      </div>
    </Modal>
  )
}

// ─── Backup & Restore modal ───────────────────────────────────────────────────
function BackupModal({ user, onClose }) {
  const t = useT()
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)
  const [status, setStatus] = useState(null)
  const [msg, setMsg] = useState('')

  async function handleExport() {
    setExporting(true); setStatus(null)
    try {
      const [profile, dietLogs, waterLogs, measurements] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('food_logs').select('*').eq('user_id', user.id),
        supabase.from('water_logs').select('*').eq('user_id', user.id),
        supabase.from('body_measurements').select('*').eq('user_id', user.id),
      ])

      const firstError = [profile, dietLogs, waterLogs, measurements].find(r => r.error)?.error
      if (firstError) throw firstError

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
      setStatus('success'); setMsg(t('profile.backup_export_success', 'Backup esportato con successo!'))
    } catch (e) {
      setStatus('error'); setMsg(e?.message || t('profile.backup_export_error', "Errore durante l'esportazione."))
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
      if (!backup.data || backup.version !== 1) throw new Error(t('profile.backup_invalid_file', 'File di backup non valido.'))
      // Il backup porta con sé l'id dell'account che lo ha esportato (vedi
      // handleExport), ma finora non veniva mai confrontato con l'utente
      // loggato ora — ogni riga viene riscritta con user.id corrente
      // (`{...profile, id: user.id}` ecc.), quindi importare per sbaglio il
      // file di un altro account (device condiviso, file scelto per errore)
      // sovrascriveva silenziosamente i dati REALI dell'utente loggato con
      // quelli dell'altra persona, senza alcun avviso.
      if (backup.userId && backup.userId !== user.id) {
        throw new Error(t('profile.backup_wrong_account', 'Questo file di backup appartiene a un altro account e non può essere importato qui.'))
      }

      const { profile, dietLogs, waterLogs, measurements } = backup.data

      const ops = []
      if (profile) ops.push(supabase.from('profiles').upsert({ ...profile, id: user.id }))
      if (dietLogs?.length) ops.push(supabase.from('food_logs').upsert(dietLogs.map(r => ({ ...r, user_id: user.id }))))
      if (waterLogs?.length) ops.push(supabase.from('water_logs').upsert(waterLogs.map(r => ({ ...r, user_id: user.id }))))
      if (measurements?.length) ops.push(supabase.from('body_measurements').upsert(measurements.map(r => ({ ...r, user_id: user.id }))))

      const results = await Promise.all(ops)
      const firstError = results.find(r => r.error)?.error
      if (firstError) throw firstError
      setStatus('success'); setMsg(t('profile.backup_restore_success', 'Ripristino completato!'))
    } catch (e) {
      setStatus('error'); setMsg(e?.message || t('profile.backup_restore_error', 'Errore durante il ripristino.'))
    } finally {
      setImporting(false)
      e.target.value = ''
    }
  }

  return (
    <Modal title={t('profile.backup_title', 'Backup e ripristino')} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {t('profile.backup_description', 'Esporta tutti i tuoi dati (profilo, diario alimentare, acqua, misurazioni) in un file JSON. Puoi reimportarlo in qualsiasi momento.')}
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
          {exporting ? t('profile.backup_exporting', 'Esportazione…') : t('profile.backup_export_button', 'Esporta backup')}
        </button>

        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 16 }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
            {t('profile.backup_restore_hint', 'Ripristina da un backup precedente:')}
          </p>
          <label style={{ display: 'block' }}>
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
            <span className="btn btn-secondary btn-full" style={{ gap: 10, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              {importing
                ? <span style={{ width: 16, height: 16, border: '2px solid var(--green-main)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                : <Upload size={18} />
              }
              {importing ? t('profile.backup_restoring', 'Ripristino…') : t('profile.backup_import_button', 'Importa backup')}
            </span>
          </label>
        </div>

        <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {t('profile.backup_restore_warning', '⚠️ Il ripristino sovrascrive i dati esistenti con quelli del file selezionato.')}
        </p>
      </div>
    </Modal>
  )
}

// ─── Delete account modal ─────────────────────────────────────────────────────
function DeleteAccountModal({ user, onClose, onDeleted }) {
  const t = useT()
  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  async function handleDelete() {
    setDeleting(true)
    setError('')
    try {
      // delete_own_account() è plpgsql: cancella le righe DB ma non può
      // chiamare la Storage API. Senza questo cleanup, foto progressi
      // (progress-photos), ricette (recipe-photos), avatar (avatars) e
      // allegati chat (chat-media, in cartelle <user.id>/... come gli altri
      // bucket qui sopra; voice-messages ha invece una cartella letterale
      // 'voice-messages/' extra dentro il bucket — vedi
      // chat.html sendVoiceMessage() in NutriPlan-Pro, path
      // `voice-messages/${targetPatientId}/...` — e la policy RLS
      // storage.foldername(name)[2], non [1], coerentemente — chat_messages
      // ha ON DELETE CASCADE su auth.users) restano orfani nello storage per
      // sempre — dopo la RPC anche auth.users viene cancellato, quindi non
      // ci sarebbe più modo di risalire ai path per ripulirli in un secondo
      // momento. Best-effort: un fallimento qui non deve bloccare la
      // cancellazione dell'account (diritto all'oblio, GDPR Art. 17).
      try {
        const [{ data: progressFiles }, { data: recipeFiles }, { data: avatarFiles }, { data: chatMediaFiles }, { data: voiceFiles }] = await Promise.all([
          supabase.storage.from('progress-photos').list(user.id),
          supabase.storage.from('recipe-photos').list(user.id),
          supabase.storage.from('avatars').list(''),
          supabase.storage.from('chat-media').list(user.id),
          supabase.storage.from('voice-messages').list(`voice-messages/${user.id}`),
        ])
        const cleanups = []
        if (progressFiles?.length) cleanups.push(supabase.storage.from('progress-photos').remove(progressFiles.map(f => `${user.id}/${f.name}`)))
        if (recipeFiles?.length) cleanups.push(supabase.storage.from('recipe-photos').remove(recipeFiles.map(f => `${user.id}/${f.name}`)))
        const avatarNames = (avatarFiles || []).filter(f => f.name.startsWith(user.id)).map(f => f.name)
        if (avatarNames.length) cleanups.push(supabase.storage.from('avatars').remove(avatarNames))
        if (chatMediaFiles?.length) cleanups.push(supabase.storage.from('chat-media').remove(chatMediaFiles.map(f => `${user.id}/${f.name}`)))
        if (voiceFiles?.length) cleanups.push(supabase.storage.from('voice-messages').remove(voiceFiles.map(f => `voice-messages/${user.id}/${f.name}`)))
        await Promise.all(cleanups)
      } catch { /* best-effort, non bloccante */ }

      const { error: rpcErr } = await supabase.rpc('delete_own_account')
      if (rpcErr) throw rpcErr
      onDeleted()
    } catch {
      setError(t('profile.delete_account_error', "Errore nell'eliminazione. Contatta il supporto."))
      setDeleting(false)
    }
  }

  const canDelete = confirmText === 'ELIMINA'

  return (
    <Modal title={t('profile.delete_account', 'Elimina account')} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: '#fee2e2', border: '1.5px solid #fca5a5', borderRadius: 12, padding: '14px 16px' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#dc2626', marginBottom: 4 }}>{t('profile.delete_account_warning_title', '⚠️ Azione irreversibile')}</p>
          <p style={{ fontSize: 13, color: '#991b1b', lineHeight: 1.6 }}>
            {t('profile.delete_account_warning_desc', 'Questa azione eliminerà definitivamente il tuo account e tutti i tuoi dati (pasti, progressi, messaggi, ecc.). Non è possibile annullare questa operazione.')}
          </p>
        </div>

        <div className="input-group">
          <label className="input-label" style={{ color: '#dc2626' }}>{t('profile.delete_account_confirm_label', { word: 'ELIMINA' }, 'Scrivi {{word}} per confermare')}</label>
          <input
            className="input-field"
            value={confirmText}
            onChange={e => setConfirmText(e.target.value)}
            placeholder="ELIMINA"
            style={{ borderColor: canDelete ? '#dc2626' : undefined }}
          />
        </div>

        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#dc2626' }}>
            {error}
          </div>
        )}

        <button
          onClick={handleDelete}
          disabled={!canDelete || deleting}
          style={{
            background: canDelete ? '#dc2626' : '#94a3b8',
            color: 'white', border: 'none', borderRadius: 12, padding: '14px',
            fontSize: 15, fontWeight: 600, cursor: canDelete && !deleting ? 'pointer' : 'not-allowed',
            width: '100%', transition: 'background 0.2s',
          }}
        >
          {deleting ? t('profile.delete_account_deleting', 'Eliminazione in corso…') : t('profile.delete_account_confirm_button', 'Conferma eliminazione')}
        </button>

        <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
          {t('profile.delete_account_gdpr_notice', 'Conforme al GDPR Art. 17 – Diritto alla cancellazione.')}
        </p>
      </div>
    </Modal>
  )
}

// ─── Main Profile page ────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, profile, signOut, refreshProfile } = useAuth()
  const { settings } = useAppSettings()
  const { isPro } = useSubscription()
  const t = useT()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [modal, setModal] = useState(null) // 'personal' | 'intolerances' | 'foodprefs' | 'security' | 'notifications' | 'appearance' | 'language' | 'biometric' | 'backup'
  const [localProfile, setLocalProfile] = useState(profile)
  const [loggingOut, setLoggingOut] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarError, setAvatarError] = useState('')
  // Password change inline
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwMsg, setPwMsg] = useState('')
  const [showPwSection, setShowPwSection] = useState(false)
  // Notification prefs
  const [notifPrefs, setNotifPrefs] = useState(() => {
    try {
      // NOTE: uses its own storage key (distinct from lib/notifications.js's
      // PREFS_KEY = 'nutriplan_notif_prefs') because that key has a different
      // shape (mealTimes, waterIntervalHours, weighDay, ...) and is consumed
      // by NotificationContext — reusing it here would silently clobber the
      // user's scheduled-notification settings whenever a quick toggle below
      // is flipped, and vice versa.
      const saved = localStorage.getItem('nutriplan_notif_prefs_quick')
      return saved ? JSON.parse(saved) : { mealReminder: true, waterReminder: true, weeklyReport: true, dietitianMessages: true, activityReminder: false }
    } catch { return { mealReminder: true, waterReminder: true, weeklyReport: true, dietitianMessages: true, activityReminder: false } }
  })

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
    const invalid = validateImageFile(file, { maxBytes: 5 * 1024 * 1024 })
    if (invalid) {
      setAvatarError(invalid === 'too_large'
        ? t('profile.avatar_too_large', 'La foto è troppo grande. Massimo 5 MB.')
        : t('profile.avatar_invalid_type', 'Formato immagine non supportato. Usa JPEG, PNG, WEBP o GIF.'))
      return
    }
    setAvatarError('')
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
      // Il path è `${user.id}.${ext}`: upsert:true sovrascrive solo se l'estensione
      // non cambia. Se l'utente carica un'estensione diversa da quella precedente
      // (es. da .jpg a .png), il file vecchio non viene mai sovrascritto né
      // altrimenti rimosso — resterebbe orfano nello storage per sempre. Pulizia
      // best-effort delle sole altre estensioni supportate (vedi
      // ALLOWED_IMAGE_TYPES in fileValidation.js), non bloccante.
      try {
        const staleExts = ['jpg', 'jpeg', 'png', 'webp', 'gif'].filter(e => e !== ext)
        const stalePaths = staleExts.map(e => `${user.id}.${e}`)
        if (stalePaths.length) await supabase.storage.from('avatars').remove(stalePaths)
      } catch { /* best-effort */ }
    } catch (err) {
      console.error('Avatar upload error:', err)
      setAvatarError(t('profile.avatar_upload_error', 'Errore nel caricamento. Riprova.'))
    } finally {
      setAvatarUploading(false)
      e.target.value = ''
    }
  }

  const firstName = localProfile?.first_name || localProfile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'P'
  const fullName = localProfile?.full_name || `${localProfile?.first_name || ''} ${localProfile?.last_name || ''}`.trim() || user?.email?.split('@')[0] || 'Utente'
  const avatarUrl = localProfile?.avatar_url

  const menuItems = [
    { icon: <User size={18} />, label: t('profile.personal_data'), desc: t('profile.personal_data_desc'), color: 'var(--green-main)', bg: 'var(--green-pale)', action: () => setModal('personal') },
    { icon: <AlertCircle size={18} />, label: t('profile.intolerances'), desc: t('profile.intolerances_desc'), color: '#e8882a', bg: '#fff4e6', action: () => setModal('intolerances') },
    { icon: <Utensils size={18} />, label: t('profile.food_prefs'), desc: t('profile.food_prefs_desc'), color: '#10b981', bg: '#ecfdf5', action: () => setModal('foodprefs') },
    { icon: <Bell size={18} />, label: t('profile.notifications'), desc: t('profile.notifications_desc'), color: '#f0922b', bg: '#fff4e6', action: () => setModal('notifications') },
    { icon: <Shield size={18} />, label: t('profile.security'), desc: t('profile.security_desc'), color: '#8b5cf6', bg: '#f5f3ff', action: () => setModal('security') },
    { icon: <Fingerprint size={18} />, label: 'Face ID / Touch ID', desc: t('profile.biometric'), color: '#0ea5e9', bg: '#e0f2fe', action: () => setModal('biometric') },
    { icon: <Accessibility size={18} />, label: t('profile.appearance'), desc: t('profile.appearance_desc'), color: '#6366f1', bg: '#eef2ff', action: () => setModal('appearance') },
    { icon: <Globe size={18} />, label: t('profile.language'), desc: t('profile.language_desc'), color: '#0ea5e9', bg: '#f0f9ff', action: () => setModal('language') },
    { icon: <Download size={18} />, label: t('profile.backup'), desc: t('profile.backup_desc'), color: '#059669', bg: '#d1fae5', action: () => setModal('backup') },
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
                <img src={avatarUrl} alt={t('profile.avatar_alt', 'Foto profilo')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                firstName[0]?.toUpperCase()
              )}
            </div>
            <button onClick={() => fileInputRef.current?.click()} aria-label={t('profile.change_avatar_aria', 'Cambia foto profilo')} style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: '50%', background: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.25)' }}>
              <Camera size={13} color="var(--green-dark)" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
          </div>

          <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 22, color: 'white', fontWeight: 300, marginBottom: 4 }}>{fullName}</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <Mail size={12} />{user?.email}
          </p>
          {avatarError && (
            <p style={{ color: '#fecaca', fontSize: 12, marginTop: 6 }}>{avatarError}</p>
          )}
          {localProfile?.height_cm && localProfile?.target_weight && (
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 12 }}>
              {[
                { label: t('profile.height_short', 'Altezza'), val: `${localProfile.height_cm} cm` },
                { label: t('profile.goal', 'Obiettivo'), val: `${localProfile.target_weight} kg` },
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
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {menuItems.map((item, i) => (
              <motion.button
                key={i}
                onClick={item.action}
                whileTap={{ scale: 0.98, transition: { delay: 0, duration: 0.08 } }}
                style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: i < menuItems.length - 1 ? '1px solid var(--border-light)' : 'none', font: 'inherit', textAlign: 'left' }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{item.desc}</p>
                </div>
                <ChevronRight size={15} color="var(--text-muted)" />
              </motion.button>
            ))}
          </div>

          {/* Pro card */}
          <button
            onClick={() => navigate('/pro')}
            style={{
              width: '100%', background: isPro
                ? 'linear-gradient(135deg, #064E3B, #0F766E)'
                : 'linear-gradient(135deg, #1E1B4B, #4338CA)',
              border: 'none', borderRadius: 16, padding: '16px 18px',
              display: 'flex', alignItems: 'center', gap: 13, cursor: 'pointer',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: -15, right: -15, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
            <div style={{
              width: 42, height: 42, borderRadius: 12, flexShrink: 0,
              background: isPro ? 'rgba(251,191,36,0.25)' : 'rgba(255,255,255,0.15)',
              border: `1.5px solid ${isPro ? 'rgba(251,191,36,0.5)' : 'rgba(255,255,255,0.25)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {isPro ? <Crown size={20} color="#FCD34D" /> : <Star size={20} color="white" />}
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <p style={{ color: 'white', fontWeight: 700, fontSize: 14, margin: '0 0 2px' }}>
                {isPro ? t('profile.pro_active_badge', '⭐ Piano Pro attivo') : t('profile.pro_discover_badge', 'Scopri NutriPlan Pro')}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11.5, margin: 0 }}>
                {isPro ? t('profile.pro_active_desc', 'Tutte le funzioni avanzate sbloccate') : t('profile.pro_discover_desc', '8 funzioni esclusive · €5,99/mese')}
              </p>
            </div>
            <ChevronRight size={16} color="rgba(255,255,255,0.55)" />
          </button>

          {/* Inline password change */}
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: showPwSection ? 12 : 0 }}>
              <p style={{ fontSize: 13, fontWeight: 700 }}>{t('profile.change_password_section_title', '🔑 Cambia password')}</p>
              <button onClick={() => { setShowPwSection(v => !v); setPwMsg('') }} style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--green-main)', fontWeight: 600, cursor: 'pointer' }}>
                {showPwSection ? t('common.close', 'Chiudi') : t('common.edit', 'Modifica')}
              </button>
            </div>
            {showPwSection && (
              <>
                <input type="password" placeholder={t('profile.new_password_placeholder', 'Nuova password (min 8 caratteri)')} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="input-field" style={{ marginBottom: 8 }} />
                <input type="password" placeholder={t('profile.confirm_new_password', 'Conferma nuova password')} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="input-field" style={{ marginBottom: 12 }} />
                <button className="btn btn-primary" onClick={async () => {
                  if (newPassword.length < 8) { setPwMsg(t('profile.password_min_length_error', 'La password deve essere almeno 8 caratteri')); return }
                  if (newPassword !== confirmPassword) { setPwMsg(t('profile.passwords_no_match', 'Le password non corrispondono')); return }
                  setPwLoading(true)
                  const { error } = await supabase.auth.updateUser({ password: newPassword })
                  setPwLoading(false)
                  setPwMsg(error ? t('profile.error_prefix', 'Errore: ') + error.message : t('profile.password_updated_success_check', '✅ Password aggiornata con successo'))
                  if (!error) { setNewPassword(''); setConfirmPassword('') }
                }} disabled={pwLoading} style={{ width: '100%', justifyContent: 'center' }}>
                  {pwLoading ? '...' : t('profile.update_password_button', 'Aggiorna password')}
                </button>
                {pwMsg && <p style={{ fontSize: 12, marginTop: 8, color: pwMsg.includes('✅') ? 'var(--green-main)' : 'var(--red)' }}>{pwMsg}</p>}
              </>
            )}
          </div>

          {/* Notification prefs quick toggles */}
          <div className="card" style={{ padding: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>{t('profile.notification_prefs_section_title', '🔔 Preferenze notifiche')}</p>
            {[
              { key: 'mealReminder', label: t('profile.quick_meal_reminder', '📊 Promemoria pasti') },
              { key: 'waterReminder', label: t('profile.quick_water_reminder', '💧 Promemoria acqua') },
              { key: 'weeklyReport', label: t('profile.quick_weekly_report', '📈 Report settimanale') },
              { key: 'dietitianMessages', label: t('profile.quick_dietitian_messages', '💬 Messaggi dal dietista') },
              { key: 'activityReminder', label: t('profile.quick_activity_reminder', '🏃 Promemoria attività fisica') },
            ].map(item => (
              <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                <p style={{ fontSize: 13 }}>{item.label}</p>
                <button onClick={() => {
                  const next = { ...notifPrefs, [item.key]: !notifPrefs[item.key] }
                  setNotifPrefs(next)
                  try { localStorage.setItem('nutriplan_notif_prefs_quick', JSON.stringify(next)) } catch {}
                }} role="switch" aria-checked={notifPrefs[item.key]} aria-label={item.label.replace(/^[^\w]+/, '').trim()} style={{
                  width: 44, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
                  background: notifPrefs[item.key] ? 'var(--green-main)' : 'var(--border)',
                  transition: 'background 0.2s', position: 'relative', flexShrink: 0,
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', background: 'white',
                    position: 'absolute', top: 3, left: notifPrefs[item.key] ? 21 : 3,
                    transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }} />
                </button>
              </div>
            ))}
          </div>

          {/* App info */}
          <div className="card" style={{ padding: '14px 16px', textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t('profile.app_info_version', 'NutriPlan Paziente · v1.0.0')}</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Powered by NutriPlan Pro</p>
          </div>

          {/* Danger zone */}
          <div className="card" style={{ padding: 16, border: '1.5px solid #fca5a5', background: '#fff5f5' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#dc2626', marginBottom: 6 }}>{t('profile.danger_zone_title', '⚠️ Zona Pericolosa')}</p>
            <p style={{ fontSize: 12, color: '#991b1b', lineHeight: 1.6, marginBottom: 12 }}>
              {t('profile.danger_zone_desc', 'Elimina definitivamente il tuo account e tutti i dati associati. Questa azione non può essere annullata.')}
            </p>
            <button
              onClick={() => setModal('deleteaccount')}
              style={{ background: 'none', border: '1.5px solid #dc2626', borderRadius: 10, padding: '10px 16px', color: '#dc2626', fontSize: 13, fontWeight: 600, cursor: 'pointer', font: 'inherit' }}
            >
              {t('profile.delete_account', 'Elimina account')}
            </button>
          </div>

          {/* Sign out */}
          <button onClick={handleSignOut} disabled={loggingOut} className="btn btn-danger" style={{ borderRadius: 'var(--r-md)', padding: '14px', fontSize: 15, fontWeight: 500, width: '100%', justifyContent: 'center', gap: 8 }}>
            <LogOut size={17} />{loggingOut ? '…' : t('profile.sign_out')}
          </button>
        </div>
      </div>

      {modal === 'personal' && <PersonalDataModal profile={localProfile} user={user} onClose={() => setModal(null)} onSaved={reloadProfile} />}
      {modal === 'intolerances' && <IntolerancesModal profile={localProfile} user={user} onClose={() => setModal(null)} onSaved={reloadProfile} />}
      {modal === 'foodprefs' && <FoodPrefsModal profile={localProfile} user={user} onClose={() => setModal(null)} onSaved={reloadProfile} />}
      {modal === 'security' && <SecurityModal onClose={() => setModal(null)} />}
      {modal === 'notifications' && <NotificationsModal user={user} onClose={() => setModal(null)} />}
      {modal === 'appearance' && <AppearanceModal onClose={() => setModal(null)} />}
      {modal === 'language' && <LanguageModal onClose={() => setModal(null)} />}
      {modal === 'biometric' && <BiometricModal user={user} onClose={() => setModal(null)} />}
      {modal === 'backup' && <BackupModal user={user} onClose={() => setModal(null)} />}
      {modal === 'deleteaccount' && <DeleteAccountModal user={user} onClose={() => setModal(null)} onDeleted={async () => { await signOut(); navigate('/login') }} />}
    </>
  )
}
