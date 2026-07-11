import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Pill, Plus, Trash2, Clock } from 'lucide-react'
import { scheduleMedicationReminders, getPermissionStatus, requestPermission } from '../lib/notifications'

const inputStyle = { boxSizing: 'border-box', padding: '9px 12px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: 'var(--surface-2)', color: 'var(--text-primary)' }

export default function MedicationsPage() {
  const { user } = useAuth()
  const [meds, setMeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [permStatus, setPermStatus] = useState(getPermissionStatus)

  // New medication form
  const [name, setName] = useState('')
  const [dosage, setDosage] = useState('')
  const [times, setTimes] = useState(['08:00'])
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('medication_reminders').select('*').eq('user_id', user.id).order('created_at')
    const list = data || []
    setMeds(list)
    setLoading(false)
    scheduleMedicationReminders(list.filter(m => m.active))
  }

  async function handleEnableNotifications() {
    const result = await requestPermission()
    setPermStatus(result)
    if (result === 'granted') scheduleMedicationReminders(meds.filter(m => m.active))
  }

  async function addMedication() {
    if (!name.trim() || times.length === 0) return
    setSaving(true)
    const { data, error } = await supabase.from('medication_reminders').insert({
      user_id: user.id, name: name.trim(), dosage: dosage.trim() || null, times, active: true,
    }).select().single()
    setSaving(false)
    if (error) return
    const next = [...meds, data]
    setMeds(next)
    scheduleMedicationReminders(next.filter(m => m.active))
    setName(''); setDosage(''); setTimes(['08:00'])
  }

  async function updateMedication(id, patch) {
    const next = meds.map(m => m.id === id ? { ...m, ...patch } : m)
    setMeds(next)
    scheduleMedicationReminders(next.filter(m => m.active))
    await supabase.from('medication_reminders').update(patch).eq('id', id)
  }

  async function deleteMedication(id) {
    const next = meds.filter(m => m.id !== id)
    setMeds(next)
    scheduleMedicationReminders(next.filter(m => m.active))
    await supabase.from('medication_reminders').delete().eq('id', id)
  }

  function addTimeSlot() { setTimes([...times, '12:00']) }
  function updateTimeSlot(i, val) { const t = [...times]; t[i] = val; setTimes(t) }
  function removeTimeSlot(i) { setTimes(times.filter((_, idx) => idx !== i)) }

  function updateMedTime(med, i, val) {
    const t = [...med.times]; t[i] = val
    updateMedication(med.id, { times: t })
  }
  function addMedTime(med) {
    updateMedication(med.id, { times: [...med.times, '12:00'] })
  }
  function removeMedTime(med, i) {
    updateMedication(med.id, { times: med.times.filter((_, idx) => idx !== i) })
  }

  const permGranted = permStatus === 'granted'
  const notSupported = permStatus === 'not-supported'

  return (
    <div className="page">
      <div style={{ background: 'linear-gradient(160deg, #7c2d12, #c2410c)', padding: 'calc(env(safe-area-inset-top) + 20px) 20px 28px' }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.05em' }}>Salute</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 14, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Pill size={22} color="white" />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'white', fontWeight: 300 }}>Farmaci e Integratori</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Promemoria per ogni assunzione</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 16px 120px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {!permGranted && !notSupported && (
          <div style={{ background: '#fff4e6', border: '1.5px solid #f0922b', borderRadius: 14, padding: '14px 16px' }}>
            <p style={{ fontSize: 13, color: '#b45309', lineHeight: 1.6, marginBottom: 10 }}>
              Attiva le notifiche per ricevere i promemoria all'orario giusto.
            </p>
            <button onClick={handleEnableNotifications} className="btn btn-primary" style={{ fontSize: 13, padding: '9px 16px' }}>
              Attiva notifiche
            </button>
          </div>
        )}

        {/* Add medication */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 20 }}>
          <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Aggiungi farmaco</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
            <input type="text" placeholder="Nome (es. Vitamina D)" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
            <input type="text" placeholder="Dose (es. 1 compressa, 2 gocce…)" value={dosage} onChange={e => setDosage(e.target.value)} style={inputStyle} />
          </div>

          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Orari</p>
          {times.map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <input type="time" value={t} onChange={e => updateTimeSlot(i, e.target.value)} style={{ ...inputStyle, flex: 1 }} />
              {times.length > 1 && (
                <button onClick={() => removeTimeSlot(i)} style={{ background: '#fff0f0', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red)', cursor: 'pointer', flexShrink: 0 }}>
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}
          <button onClick={addTimeSlot} style={{ background: 'none', border: 'none', color: '#c2410c', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: '4px 0', marginBottom: 14 }}>
            <Plus size={14} /> Aggiungi orario
          </button>

          <button
            onClick={addMedication}
            disabled={saving || !name.trim()}
            style={{ width: '100%', padding: '13px 0', borderRadius: 12, border: 'none', background: !name.trim() ? 'var(--border)' : 'linear-gradient(135deg, #c2410c, #ea580c)', color: 'white', fontSize: 15, fontWeight: 700, cursor: !name.trim() ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <Plus size={16} /> {saving ? 'Salvataggio…' : 'Aggiungi farmaco'}
          </button>
        </motion.div>

        {/* List */}
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={14} /> I tuoi farmaci
          </p>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[1, 2].map(i => <div key={i} style={{ height: 90, borderRadius: 12, background: 'var(--border-light)', animation: 'skeletonPulse 1.4s ease-in-out infinite' }} />)}
            </div>
          ) : meds.length === 0 ? (
            <div style={{ padding: '28px 16px', textAlign: 'center', background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border-light)' }}>
              <Pill size={32} color="var(--text-muted)" style={{ opacity: 0.3, marginBottom: 8 }} />
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Nessun farmaco impostato</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Aggiungine uno sopra per ricevere i promemoria</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {meds.map(med => (
                <div key={med.id} className="card" style={{ padding: 16, opacity: med.active ? 1 : 0.55 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: med.times?.length ? 10 : 0 }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700 }}>{med.name}</p>
                      {med.dosage && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{med.dosage}</p>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <button
                        onClick={() => updateMedication(med.id, { active: !med.active })}
                        style={{ background: med.active ? '#dcfce7' : 'var(--surface-2)', border: 'none', borderRadius: 8, padding: '5px 10px', fontSize: 11, fontWeight: 700, color: med.active ? '#15803D' : 'var(--text-muted)', cursor: 'pointer' }}
                      >
                        {med.active ? 'Attivo' : 'In pausa'}
                      </button>
                      <button onClick={() => deleteMedication(med.id)} style={{ background: '#fff0f0', border: 'none', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red)', cursor: 'pointer' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  {(med.times || []).map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <input type="time" value={t} onChange={e => updateMedTime(med, i, e.target.value)} style={{ ...inputStyle, flex: 1, padding: '6px 10px' }} />
                      {med.times.length > 1 && (
                        <button onClick={() => removeMedTime(med, i)} style={{ background: '#fff0f0', border: 'none', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red)', cursor: 'pointer', flexShrink: 0 }}>
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => addMedTime(med)} style={{ background: 'none', border: 'none', color: '#c2410c', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: '2px 0' }}>
                    <Plus size={12} /> Aggiungi orario
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
