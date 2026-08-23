import { useState, useEffect } from 'react'
import { Star, MessageSquare } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useT } from '../i18n'

// ─── Presentational star rating (read-only, supports half-star display) ────
export function StarRating({ value = 0, size = 14, showValue = false, count = null }) {
  const rounded = Math.round(value)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <div style={{ display: 'flex', gap: 1 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <Star
            key={i}
            size={size}
            fill={rounded >= i ? '#F59E0B' : 'none'}
            color={rounded >= i ? '#F59E0B' : 'var(--border)'}
            strokeWidth={1.5}
          />
        ))}
      </div>
      {showValue && value > 0 && (
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
          {value.toFixed(1)}{count != null && <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}> ({count})</span>}
        </span>
      )}
    </div>
  )
}

// ─── Interactive star picker for the review form ────────────────────────────
function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
        >
          <Star size={26} fill={(hover || value) >= i ? '#F59E0B' : 'none'} color={(hover || value) >= i ? '#F59E0B' : 'var(--border)'} strokeWidth={1.5} />
        </button>
      ))}
    </div>
  )
}

// ─── Batch helper: media voti per una lista di dietitian_id (per la vista elenco) ──
export async function fetchRatingSummaries(dietitianIds) {
  if (!dietitianIds?.length) return {}
  const { data } = await supabase
    .from('dietitian_reviews')
    .select('dietitian_id, rating')
    .in('dietitian_id', dietitianIds)
  const byId = {}
  for (const row of data || []) {
    if (!byId[row.dietitian_id]) byId[row.dietitian_id] = { sum: 0, count: 0 }
    byId[row.dietitian_id].sum += row.rating
    byId[row.dietitian_id].count += 1
  }
  const result = {}
  for (const [id, { sum, count }] of Object.entries(byId)) {
    result[id] = { average: sum / count, count }
  }
  return result
}

// ─── Full reviews section (list + form) per la scheda dettaglio dietista ────
export default function DietitianReviewsSection({ dietitianId }) {
  const t = useT()
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [canReview, setCanReview] = useState(false)
  const [myReview, setMyReview] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formRating, setFormRating] = useState(0)
  const [formComment, setFormComment] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [dietitianId, user])

  async function load() {
    setLoading(true)
    const { data: reviewRows } = await supabase
      .from('dietitian_reviews')
      .select('id, patient_id, rating, comment, created_at')
      .eq('dietitian_id', dietitianId)
      .order('created_at', { ascending: false })
    const rows = reviewRows || []
    // Nomi pazienti recuperati con una query separata su profiles (nessuna FK
    // diretta dietitian_reviews -> profiles per l'embed automatico PostgREST,
    // patient_id referenzia auth.users) - stesso pattern usato in ChatPage.jsx.
    const patientIds = [...new Set(rows.map(r => r.patient_id))]
    let namesById = {}
    if (patientIds.length) {
      const { data: profs } = await supabase.from('profiles').select('id, nome, cognome, full_name').in('id', patientIds)
      for (const p of profs || []) namesById[p.id] = p
    }
    setReviews(rows.map(r => ({ ...r, _patient: namesById[r.patient_id] })))

    if (user) {
      const mine = rows.find(r => r.patient_id === user.id)
      setMyReview(mine || null)
      if (mine) { setFormRating(mine.rating); setFormComment(mine.comment || '') }

      if (!mine) {
        const { data: pastAppt } = await supabase
          .from('appointments')
          .select('id')
          .eq('patient_id', user.id)
          .eq('dietitian_id', dietitianId)
          .lt('appointment_date', new Date().toISOString())
          .neq('status', 'cancelled')
          .limit(1)
          .maybeSingle()
        setCanReview(!!pastAppt)
      }
    }
    setLoading(false)
  }

  async function submitReview() {
    if (formRating < 1) { setError(t('reviews.errore_punteggio', 'Seleziona un punteggio da 1 a 5 stelle.')); return }
    setSaving(true); setError('')
    const { error: err } = await supabase.from('dietitian_reviews').upsert({
      dietitian_id: dietitianId,
      patient_id: user.id,
      rating: formRating,
      comment: formComment.trim(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'dietitian_id,patient_id' })
    setSaving(false)
    if (err) { setError(t('reviews.errore_salvataggio', { messaggio: err.message }, 'Errore nel salvataggio: {{messaggio}}')); return }
    setShowForm(false)
    load()
  }

  async function deleteReview() {
    if (!confirm(t('reviews.conferma_elimina', 'Eliminare la tua recensione?'))) return
    await supabase.from('dietitian_reviews').delete().eq('id', myReview.id)
    setMyReview(null); setFormRating(0); setFormComment('')
    load()
  }

  const average = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

  if (loading) return null

  return (
    <div className="card" style={{ padding: 16, marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MessageSquare size={13} color="var(--green-main)" />
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t('reviews.titolo_sezione', 'Recensioni')}</p>
        </div>
        {reviews.length > 0 && <StarRating value={average} count={reviews.length} showValue size={15} />}
      </div>

      {reviews.length === 0 && !canReview && !myReview && (
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t('reviews.nessuna_recensione', 'Nessuna recensione ancora.')}</p>
      )}

      {(canReview || myReview) && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-secondary"
          style={{ marginBottom: reviews.length ? 14 : 0, fontSize: 13, padding: '8px 14px' }}
        >
          {myReview ? t('reviews.modifica_recensione', 'Modifica la tua recensione') : t('reviews.lascia_recensione', 'Lascia una recensione')}
        </button>
      )}

      {showForm && (
        <div style={{ background: 'var(--surface-2)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
          <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>{t('reviews.il_tuo_voto', 'Il tuo voto')}</p>
          <StarPicker value={formRating} onChange={setFormRating} />
          <textarea
            value={formComment}
            onChange={e => setFormComment(e.target.value)}
            placeholder={t('reviews.placeholder_commento', 'Racconta la tua esperienza (facoltativo)')}
            maxLength={600}
            rows={3}
            style={{ width: '100%', marginTop: 10, padding: 10, borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, fontFamily: 'inherit', resize: 'vertical' }}
          />
          {error && <p style={{ fontSize: 12, color: 'var(--red)', marginTop: 6 }}>{error}</p>}
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button onClick={submitReview} disabled={saving} className="btn btn-primary" style={{ fontSize: 13, padding: '8px 16px' }}>
              {saving ? t('reviews.salvataggio', 'Salvataggio…') : t('reviews.pubblica', 'Pubblica')}
            </button>
            <button onClick={() => setShowForm(false)} className="btn btn-secondary" style={{ fontSize: 13, padding: '8px 16px' }}>{t('reviews.annulla', 'Annulla')}</button>
            {myReview && (
              <button onClick={deleteReview} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--red)', fontSize: 12, cursor: 'pointer' }}>
                {t('reviews.elimina', 'Elimina')}
              </button>
            )}
          </div>
        </div>
      )}

      {reviews.map(r => (
        <div key={r.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>
              {r._patient?.nome
                ? `${r._patient.nome} ${r._patient.cognome?.[0] || ''}.`
                : r._patient?.full_name || t('reviews.paziente_default', 'Paziente')}
            </span>
            <StarRating value={r.rating} size={12} />
          </div>
          {r.comment && <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, overflowWrap: 'anywhere' }}>{r.comment}</p>}
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            {new Date(r.created_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      ))}
    </div>
  )
}
