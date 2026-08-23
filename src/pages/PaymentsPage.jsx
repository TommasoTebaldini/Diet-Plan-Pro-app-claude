import { useState, useEffect, useCallback } from 'react'
import { CreditCard, Check, Clock, ExternalLink } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useT } from '../i18n'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

function euro(n) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n || 0)
}

function fmtDate(d) {
  return d ? new Date(d).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'
}

export default function PaymentsPage() {
  const { user } = useAuth()
  const t = useT()
  const [fatture, setFatture] = useState([])
  const [loading, setLoading] = useState(true)
  const [payingId, setPayingId] = useState(null)
  const [banner, setBanner] = useState(null)

  const loadFatture = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('fatture')
      .select('id,numero_fattura,tipo_visita,importo,data_fattura,stato,pagato_online_at')
      .eq('patient_id', user.id)
      .order('data_fattura', { ascending: false })
    setFatture(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { loadFatture() }, [loadFatture])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('paid') === '1') {
      setBanner({ type: 'ok', text: t('payments.banner_paid', 'Pagamento ricevuto — grazie! Potrebbero volerci alcuni secondi prima che la fattura risulti aggiornata qui sotto.') })
      window.history.replaceState({}, '', window.location.pathname)
    } else if (params.get('cancelled') === '1') {
      setBanner({ type: 'info', text: t('payments.banner_cancelled', 'Pagamento annullato — la fattura resta in attesa, puoi riprovare quando vuoi.') })
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [t])

  async function paga(fatturaId) {
    setPayingId(fatturaId)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error(t('payments.session_expired', 'Sessione scaduta — effettua di nuovo il login.'))

      const res = await fetch(`${SUPABASE_URL}/functions/v1/create-invoice-checkout-session`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ fatturaId }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error || t('payments.checkout_start_error', 'Impossibile avviare il pagamento.'))
      window.location.href = data.url
    } catch (e) {
      setBanner({ type: 'error', text: e.message || t('payments.checkout_generic_error', 'Errore durante l\'avvio del pagamento.') })
      setPayingId(null)
    }
  }

  const daPagare = fatture.filter(f => f.stato !== 'pagato')
  const pagate = fatture.filter(f => f.stato === 'pagato')

  return (
    <div className="page">
      <div style={{ background: 'linear-gradient(160deg, #065f46, #0d9488)', padding: 'calc(env(safe-area-inset-top) + 20px) 24px 24px', margin: '0 0 16px' }}>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, marginBottom: 4 }}>{t('payments.your_services', 'Le tue prestazioni')}</p>
        <h1 style={{ fontFamily: 'var(--font-d)', fontSize: 24, color: 'white', fontWeight: 300 }}>{t('payments.title', 'Pagamenti')}</h1>
      </div>

      <div style={{ padding: '0 16px 40px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {banner && (
          <div className="card" style={{
            padding: '12px 14px', fontSize: 13, fontWeight: 600,
            background: banner.type === 'ok' ? '#dcfce7' : banner.type === 'error' ? '#fee2e2' : '#dbeafe',
            color: banner.type === 'ok' ? '#15803d' : banner.type === 'error' ? '#b91c1c' : '#1e40af',
          }}>
            {banner.text}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1, 2].map(i => <div key={i} style={{ height: 70, borderRadius: 12, background: 'var(--border-light)', animation: 'skeletonPulse 1.4s ease-in-out infinite' }} />)}
          </div>
        ) : fatture.length === 0 ? (
          <div className="card" style={{ padding: '36px 20px', textAlign: 'center' }}>
            <CreditCard size={30} color="var(--text-muted)" style={{ marginBottom: 10 }} />
            <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{t('payments.no_invoices', 'Nessuna fattura')}</p>
            <p style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{t('payments.no_invoices_desc', 'Le fatture emesse dal tuo dietista compariranno qui.')}</p>
          </div>
        ) : (
          <>
            {daPagare.length > 0 && (
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>{t('payments.to_pay', 'Da pagare')}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {daPagare.map(f => (
                    <div key={f.id} className="card" style={{ padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 11, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Clock size={17} color="#92400e" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 700 }}>{f.tipo_visita || t('payments.service_default', 'Prestazione')}</p>
                        <p style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{fmtDate(f.data_fattura)}{f.numero_fattura ? t('payments.invoice_number', { numero: f.numero_fattura }, ' · N. {{numero}}') : ''}</p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{euro(f.importo)}</p>
                        <button
                          onClick={() => paga(f.id)}
                          disabled={payingId === f.id}
                          style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--green-main)', color: 'white', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: payingId === f.id ? 'default' : 'pointer' }}
                        >
                          {payingId === f.id ? t('payments.waiting', 'Attendere…') : <>{t('payments.pay_now', 'Paga ora')} <ExternalLink size={12} /></>}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pagate.length > 0 && (
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '6px 0 8px' }}>{t('payments.paid', 'Pagate')}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {pagate.map(f => (
                    <div key={f.id} className="card" style={{ padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 12, opacity: 0.75 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 11, background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Check size={17} color="#065f46" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 700 }}>{f.tipo_visita || t('payments.service_default', 'Prestazione')}</p>
                        <p style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{fmtDate(f.data_fattura)}{f.numero_fattura ? t('payments.invoice_number', { numero: f.numero_fattura }, ' · N. {{numero}}') : ''}</p>
                      </div>
                      <p style={{ fontSize: 15, fontWeight: 700, flexShrink: 0 }}>{euro(f.importo)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
