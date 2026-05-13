import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import {
  ArrowLeft, MapPin, Phone, Mail, Globe, Calendar, Briefcase,
  X, CheckCircle, ChevronLeft, ChevronRight, Clock, AlertCircle, XCircle
} from 'lucide-react'

const MONTHS_IT = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno',
  'Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre']
const DAYS_IT = ['Lun','Mar','Mer','Gio','Ven','Sab','Dom']

function localDateStr(d) {
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0')
}

function getLocalTimeHHMM(utcStr) {
  const d = new Date(utcStr)
  return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0')
}

function getDow(dateStr) {
  // 0=Mon … 6=Sun
  const d = new Date(dateStr + 'T00:00:00')
  return (d.getDay() + 6) % 7
}

function generateSlots(avail) {
  if (!avail || !avail.enabled) return []
  const dur = avail.slot_duration_minutes || 60
  const result = []
  function addRange(start, end) {
    if (!start || !end) return
    let [sh, sm] = start.slice(0, 5).split(':').map(Number)
    const [eh, em] = end.slice(0, 5).split(':').map(Number)
    const endMin = eh * 60 + em
    while (sh * 60 + sm + dur <= endMin) {
      result.push(String(sh).padStart(2,'0') + ':' + String(sm).padStart(2,'0'))
      const next = sh * 60 + sm + dur
      sh = Math.floor(next / 60)
      sm = next % 60
    }
  }
  addRange(avail.start_time_1, avail.end_time_1)
  addRange(avail.start_time_2, avail.end_time_2)
  return result
}

// ─── Booking modal ───────────────────────────────────────────────────────────

function AppointmentModal({ dietitianId, dietitianName, onClose, onBooked }) {
  const { user } = useAuth()
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const [availability, setAvailability] = useState([])
  const [avLoaded, setAvLoaded] = useState(false)
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(null)
  const [bookedTimes, setBookedTimes] = useState([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase
      .from('dietitian_availability')
      .select('*')
      .eq('dietitian_id', dietitianId)
      .then(({ data }) => { setAvailability(data || []); setAvLoaded(true) })
  }, [dietitianId])

  function getAvailForDow(dow) {
    return availability.find(a => a.day_of_week === dow && a.enabled) || null
  }

  function isDayAvailable(date) {
    if (date < today) return false
    const dow = (date.getDay() + 6) % 7
    return !!getAvailForDow(dow)
  }

  async function onSelectDate(dateStr) {
    if (selectedDate === dateStr) return
    setSelectedDate(dateStr)
    setSelectedSlot(null)
    setSlotsLoading(true)
    const start = new Date(dateStr + 'T00:00:00')
    const end = new Date(start.getTime() + 24 * 3600 * 1000)
    const { data } = await supabase
      .from('appointments')
      .select('appointment_date, duration_minutes')
      .eq('dietitian_id', dietitianId)
      .gte('appointment_date', start.toISOString())
      .lt('appointment_date', end.toISOString())
      .neq('status', 'cancelled')
    setBookedTimes((data || []).map(b => getLocalTimeHHMM(b.appointment_date)))
    setSlotsLoading(false)
  }

  function getSlotsForDate(dateStr) {
    if (!dateStr) return []
    const dow = getDow(dateStr)
    const avail = getAvailForDow(dow)
    return generateSlots(avail)
  }

  async function book() {
    if (!selectedDate || !selectedSlot) { setError('Seleziona data e orario.'); return }
    setSaving(true); setError('')
    const dow = getDow(selectedDate)
    const avail = getAvailForDow(dow)
    const dur = avail?.slot_duration_minutes || 60
    const apptDate = new Date(selectedDate + 'T' + selectedSlot + ':00')
    const { error: err } = await supabase.from('appointments').insert({
      patient_id: user.id,
      dietitian_id: dietitianId,
      title: 'Colloquio di conoscimento',
      appointment_date: apptDate.toISOString(),
      notes: notes.trim() || null,
      booked_by_patient: true,
      status: 'pending',
      duration_minutes: dur,
    })
    setSaving(false)
    if (err) { setError('Errore nella prenotazione. Riprova.'); return }
    setSaved(true)
    setTimeout(() => { onBooked?.(); onClose() }, 2600)
  }

  function getCalDays() {
    const firstDay = new Date(calYear, calMonth, 1)
    const lastDay = new Date(calYear, calMonth + 1, 0)
    const startDow = (firstDay.getDay() + 6) % 7
    const days = []
    for (let i = 0; i < startDow; i++) days.push(null)
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(calYear, calMonth, d))
    return days
  }

  const canGoPrev = calYear > today.getFullYear() || calMonth > today.getMonth()
  const slots = getSlotsForDate(selectedDate)
  const noAvailability = avLoaded && availability.filter(a => a.enabled).length === 0

  const btnNav = { background: 'var(--surface-2)', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 9999 }}
      onClick={onClose}
    >
      <div
        style={{ background: 'var(--surface)', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 560, margin: '0 auto', maxHeight: '88dvh', display: 'flex', flexDirection: 'column', boxShadow: '0 -8px 40px rgba(0,0,0,0.15)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 20px 14px', flexShrink: 0, borderBottom: '1px solid var(--border-light)' }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700 }}>Prenota un colloquio</h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>con {dietitianName}</p>
          </div>
          <button onClick={onClose} style={{ ...btnNav, borderRadius: '50%', width: 32, height: 32 }}>
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', paddingBottom: 'calc(24px + env(safe-area-inset-bottom))' }}>

          {saved ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <CheckCircle size={52} color="var(--green-main)" style={{ marginBottom: 16 }} />
              <p style={{ fontSize: 17, fontWeight: 700 }}>Prenotazione inviata!</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.6 }}>
                Il dietista riceverà la tua richiesta di colloquio. Ti contatteranno per conferma.
              </p>
            </div>
          ) : noAvailability ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
              <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Nessuna disponibilità configurata</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Questo dietista non ha ancora impostato gli orari disponibili. Contattalo direttamente.
              </p>
            </div>
          ) : (
            <>
              {/* Calendar */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <button
                    onClick={() => {
                      if (!canGoPrev) return
                      if (calMonth === 0) { setCalYear(y => y-1); setCalMonth(11) } else setCalMonth(m => m-1)
                    }}
                    style={{ ...btnNav, opacity: canGoPrev ? 1 : 0.25, cursor: canGoPrev ? 'pointer' : 'default' }}
                  ><ChevronLeft size={15} /></button>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{MONTHS_IT[calMonth]} {calYear}</span>
                  <button
                    onClick={() => { if (calMonth === 11) { setCalYear(y => y+1); setCalMonth(0) } else setCalMonth(m => m+1) }}
                    style={btnNav}
                  ><ChevronRight size={15} /></button>
                </div>

                {/* Day headers */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
                  {DAYS_IT.map(d => (
                    <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', padding: '2px 0' }}>{d}</div>
                  ))}
                </div>

                {!avLoaded ? (
                  <div style={{ textAlign: 'center', padding: 24 }}>
                    <div style={{ width: 24, height: 24, border: '3px solid var(--border)', borderTopColor: 'var(--green-main)', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
                    {getCalDays().map((date, i) => {
                      if (!date) return <div key={`pad-${i}`} />
                      const dateStr = localDateStr(date)
                      const avail = isDayAvailable(date)
                      const isSelected = selectedDate === dateStr
                      const isPast = date < today
                      return (
                        <button
                          key={dateStr}
                          onClick={() => avail && onSelectDate(dateStr)}
                          disabled={!avail}
                          style={{
                            height: 36, borderRadius: 8, border: isSelected ? '2px solid var(--green-main)' : '2px solid transparent',
                            cursor: avail ? 'pointer' : 'default',
                            background: isSelected ? 'var(--green-main)' : avail ? 'var(--green-pale)' : 'transparent',
                            color: isSelected ? 'white' : avail ? 'var(--green-dark)' : 'var(--text-muted)',
                            fontWeight: avail ? 600 : 400, fontSize: 13,
                            opacity: isPast ? 0.3 : 1,
                            fontFamily: 'var(--font-b)',
                          }}
                        >{date.getDate()}</button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Slot picker */}
              {selectedDate && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                    Orari — {new Date(selectedDate + 'T00:00:00').toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                  {slotsLoading ? (
                    <div style={{ textAlign: 'center', padding: 16 }}>
                      <div style={{ width: 20, height: 20, border: '2px solid var(--border)', borderTopColor: 'var(--green-main)', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
                    </div>
                  ) : slots.length === 0 ? (
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>Nessuno slot per questo giorno.</p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                      {slots.map(slot => {
                        const booked = bookedTimes.includes(slot)
                        const isSel = selectedSlot === slot
                        return (
                          <button
                            key={slot}
                            onClick={() => !booked && setSelectedSlot(slot)}
                            disabled={booked}
                            style={{
                              padding: '10px 4px', borderRadius: 10,
                              border: `1.5px solid ${isSel ? 'var(--green-main)' : booked ? 'var(--border-light)' : 'var(--border)'}`,
                              background: isSel ? 'var(--green-main)' : booked ? 'var(--surface-2)' : 'var(--surface)',
                              color: isSel ? 'white' : booked ? 'var(--text-muted)' : 'var(--text-primary)',
                              fontSize: 13, fontWeight: 600, cursor: booked ? 'not-allowed' : 'pointer',
                              fontFamily: 'var(--font-b)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                            }}
                          >
                            <Clock size={11} style={{ opacity: booked ? 0.4 : 1 }} />
                            {slot}
                            {booked && <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>Occupato</span>}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              {selectedSlot && (
                <div className="input-group" style={{ marginBottom: 16 }}>
                  <label className="input-label">Note (opzionale)</label>
                  <textarea
                    className="input-field" rows={3} value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Motivo del colloquio, intolleranze, obiettivi..."
                    style={{ resize: 'none' }}
                  />
                </div>
              )}

              {error && (
                <div style={{ background: 'var(--alert-error-bg)', border: '1px solid var(--alert-error-border)', borderRadius: 10, padding: '10px 14px', color: 'var(--alert-error-text)', fontSize: 13, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertCircle size={14} style={{ flexShrink: 0 }} /> {error}
                </div>
              )}

              <button
                className="btn btn-primary btn-full"
                onClick={book}
                disabled={saving || !selectedDate || !selectedSlot}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                {saving ? '…' : <><Calendar size={15} /> Conferma prenotazione</>}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DietitianDetailPage() {
  const { dietitianId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [myAppointments, setMyAppointments] = useState([])
  const [cancelling, setCancelling] = useState(null) // id being cancelled
  const [sidebarW, setSidebarW] = useState(0)

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) {
        setSidebarW(localStorage.getItem('sidebar_open') !== 'false' ? 220 : 0)
      } else setSidebarW(0)
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('storage', update)
    return () => { window.removeEventListener('resize', update); window.removeEventListener('storage', update) }
  }, [])

  useEffect(() => { loadProfile(); loadMyAppointments() }, [dietitianId])

  async function loadProfile() {
    const { data } = await supabase
      .from('dietitian_profiles').select('*')
      .eq('dietitian_id', dietitianId).eq('visible', true).maybeSingle()
    setProfile(data)
    setLoading(false)
  }

  async function loadMyAppointments() {
    if (!user) return
    const { data } = await supabase
      .from('appointments').select('*')
      .eq('patient_id', user.id).eq('dietitian_id', dietitianId)
      .neq('status', 'cancelled')
      .gte('appointment_date', new Date().toISOString())
      .order('appointment_date', { ascending: true })
    setMyAppointments(data || [])
  }

  async function cancelAppointment(appt) {
    const apptDate = new Date(appt.appointment_date)
    const twoDaysBefore = new Date(apptDate.getTime() - 2 * 24 * 3600 * 1000)
    if (new Date() > twoDaysBefore) {
      alert('Non puoi annullare meno di 48 ore prima del colloquio.')
      return
    }
    if (!confirm('Annullare questo colloquio?')) return
    setCancelling(appt.id)
    await supabase.from('appointments')
      .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
      .eq('id', appt.id)
    setCancelling(null)
    setMyAppointments(prev => prev.filter(a => a.id !== appt.id))
  }

  function canCancel(appt) {
    const apptDate = new Date(appt.appointment_date)
    return apptDate.getTime() - Date.now() > 2 * 24 * 3600 * 1000
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
    <div className="page" style={{ paddingBottom: 0 }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))', padding: 'calc(env(safe-area-inset-top) + 12px) 16px 24px', flexShrink: 0 }}>
        <button
          onClick={() => navigate('/dietisti')}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', marginBottom: 18 }}
        ><ArrowLeft size={18} /></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={fullName} style={{ width: 76, height: 76, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.4)', flexShrink: 0 }} />
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

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}>

        {/* My upcoming appointments */}
        {myAppointments.length > 0 && (
          <div className="card" style={{ padding: 14, marginBottom: 12, border: '1.5px solid var(--green-main)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--green-main)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Le tue prenotazioni</p>
            {myAppointments.map(appt => {
              const d = new Date(appt.appointment_date)
              const canC = canCancel(appt)
              return (
                <div key={appt.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600 }}>
                      {d.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      ore {getLocalTimeHHMM(appt.appointment_date)} · {appt.duration_minutes || 60} min
                    </p>
                  </div>
                  {canC ? (
                    <button
                      onClick={() => cancelAppointment(appt)}
                      disabled={cancelling === appt.id}
                      style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}
                    >
                      <XCircle size={13} style={{ color: 'var(--red)' }} />
                      {cancelling === appt.id ? '…' : 'Annulla'}
                    </button>
                  ) : (
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', maxWidth: 100, textAlign: 'right' }}>Annullabile fino a 48h prima</span>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Presentazione */}
        {profile.descrizione && (
          <div className="card" style={{ padding: 16, marginBottom: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Presentazione</p>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{profile.descrizione}</p>
          </div>
        )}

        {/* Metodo di lavoro */}
        {profile.metodi_lavoro && (
          <div className="card" style={{ padding: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <Briefcase size={13} color="var(--green-main)" />
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Metodo di lavoro</p>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{profile.metodi_lavoro}</p>
          </div>
        )}

        {/* Contatti */}
        {(profile.telefono || profile.email_contatto || profile.sito_web || profile.indirizzo) && (
          <div className="card" style={{ padding: 16, marginBottom: 12 }}>
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

      {/* Fixed bottom CTA — respects desktop sidebar */}
      <div style={{
        position: 'fixed', bottom: 0,
        left: sidebarW, right: 0,
        padding: '12px 14px',
        paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
        background: 'rgba(var(--surface-rgb, 255,255,255), 0.97)',
        backgroundColor: 'var(--surface)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--border-light)',
        transition: 'left 0.22s ease',
      }}>
        <button
          className="btn btn-primary btn-full"
          onClick={() => setShowModal(true)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <Calendar size={16} /> Prenota un colloquio
        </button>
      </div>

      {showModal && (
        <AppointmentModal
          dietitianId={profile.dietitian_id}
          dietitianName={fullName}
          onClose={() => setShowModal(false)}
          onBooked={loadMyAppointments}
        />
      )}
    </div>
  )
}
