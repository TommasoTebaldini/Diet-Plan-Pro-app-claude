import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useSubscription, PAYMENTS_ACTIVE, FREE_FEATURES, PRO_FEATURES } from '../hooks/useSubscription'
import { useT } from '../i18n'
import {
  ArrowLeft, Star, Check, X, Crown, CreditCard,
  ChevronDown, ChevronUp, Lock, Zap, ShieldCheck,
} from 'lucide-react'

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function getFaqs(t) {
  return [
    {
      q: t('subscription.faq_q1', 'Cosa include il piano gratuito?'),
      a: t('subscription.faq_a1', 'Il piano gratuito include tutto il necessario per seguire la terapia del tuo dietista: visualizzazione del piano alimentare, chat, documenti, diario degli ultimi 7 giorni, tracciamento acqua e peso.'),
    },
    {
      q: t('subscription.faq_q2', 'Posso disdire in qualsiasi momento?'),
      a: t('subscription.faq_a2', 'Sì, puoi cancellare l\'abbonamento quando vuoi dal portale Stripe (pulsante "Gestisci abbonamento"). L\'accesso Pro rimane attivo fino alla fine del periodo già pagato. Hai inoltre diritto di recesso entro 14 giorni dalla sottoscrizione ai sensi del Codice del Consumo, indipendentemente dalla cancellazione ordinaria.'),
    },
    {
      q: t('subscription.faq_q3', 'I miei dati sono al sicuro?'),
      a: t('subscription.faq_a3', 'Sì. I dati sono archiviati su Supabase (PostgreSQL) con crittografia TLS in transito e a riposo. I pagamenti sono gestiti da Stripe, certificato PCI-DSS Level 1. Non conserviamo mai i dati della tua carta.'),
    },
    {
      q: t('subscription.faq_q4', 'Il mio dietista vede che sono abbonato?'),
      a: t('subscription.faq_a4', 'No, il piano che scegli riguarda solo le funzionalità che usi tu sull\'app. Il rapporto con il tuo dietista è indipendente dall\'abbonamento.'),
    },
    {
      q: t('subscription.faq_q5', 'Esiste una prova gratuita?'),
      a: t('subscription.faq_a5', 'Sì, il piano Pro include 7 giorni di prova gratuita. Non serve inserire la carta di credito durante la prova.'),
    },
  ]
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      border: '1px solid var(--border-light)', borderRadius: 12, overflow: 'hidden', marginBottom: 8,
    }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px', background: 'var(--surface)', border: 'none', cursor: 'pointer',
          textAlign: 'left', gap: 12,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{q}</span>
        {open ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
      </button>
      {open && (
        <div style={{ padding: '0 16px 14px', fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6, background: 'var(--surface)' }}>
          {a}
        </div>
      )}
    </div>
  )
}

// ─── Plan card ────────────────────────────────────────────────────────────────
function PlanCard({ title, price, period, features, locked, highlight, cta, onCta, ctaDisabled, note }) {
  const t = useT()
  return (
    <div style={{
      border: `2px solid ${highlight ? 'var(--green-main)' : 'var(--border-light)'}`,
      borderRadius: 20, padding: '24px 20px', background: 'var(--surface)',
      position: 'relative', boxShadow: highlight ? '0 4px 24px rgba(13,92,58,0.12)' : 'none',
    }}>
      {highlight && (
        <div style={{
          position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--green-main)', color: 'white', fontSize: 11, fontWeight: 700,
          padding: '3px 14px', borderRadius: 20, whiteSpace: 'nowrap',
        }}>
          {t('subscription.badge_recommended', 'Consigliato')}
        </div>
      )}
      <p style={{ fontSize: 13, fontWeight: 700, color: highlight ? 'var(--green-main)' : 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
        <span style={{ fontSize: 36, fontWeight: 800, color: 'var(--text-primary)' }}>{price}</span>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{period}</span>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {features.map((f, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
            {locked?.[i]
              ? <X size={14} color="#94a3b8" style={{ flexShrink: 0, marginTop: 2 }} />
              : <Check size={14} color="var(--green-main)" style={{ flexShrink: 0, marginTop: 2 }} />}
            <span style={{ color: locked?.[i] ? 'var(--text-muted)' : 'var(--text-secondary)' }}>{f}</span>
          </li>
        ))}
      </ul>
      {cta && (
        <button
          onClick={onCta}
          disabled={ctaDisabled}
          style={{
            width: '100%', padding: '13px 0', borderRadius: 12, border: 'none',
            background: highlight && !ctaDisabled
              ? 'linear-gradient(135deg, var(--green-main), var(--green-mid))'
              : 'var(--surface-2)',
            color: highlight && !ctaDisabled ? 'white' : 'var(--text-muted)',
            fontWeight: 700, fontSize: 14, cursor: ctaDisabled ? 'default' : 'pointer',
            opacity: ctaDisabled ? 0.7 : 1,
          }}
        >
          {cta}
        </button>
      )}
      {note && (
        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>{note}</p>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SubscriptionPage() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { isPro, paymentsActive, expiresAt } = useSubscription()
  const [loading, setLoading] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const t = useT()

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

  async function handleSubscribe() {
    if (!paymentsActive) return
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const res = await fetch(`${SUPABASE_URL}/functions/v1/create-patient-checkout-session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: 'monthly' }),
      })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handlePortal() {
    if (!paymentsActive) return
    setPortalLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const res = await fetch(`${SUPABASE_URL}/functions/v1/stripe-portal`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url
    } catch (e) {
      console.error(e)
    } finally {
      setPortalLoading(false)
    }
  }

  const FAQS = getFaqs(t)

  const FREE_PLAN_ITEMS = [
    t('subscription.item_diet_plan', 'Piano alimentare del dietista'),
    t('subscription.item_chat', 'Chat con il tuo dietista'),
    t('subscription.item_documents', 'Documenti e referti'),
    t('subscription.item_diary_free', 'Diario alimentare (7 giorni)'),
    t('subscription.item_tracking', 'Tracciamento acqua e peso'),
    t('subscription.item_database', 'Database alimenti CREA+BDA'),
    t('subscription.item_micronutrients_free', 'Micronutrienti avanzati'),
    t('subscription.item_stats_free', 'Statistiche e grafici'),
    t('subscription.item_pdf_free', 'Report PDF'),
    t('subscription.item_history_free', 'Storico illimitato'),
  ]
  const FREE_LOCKED = [false, false, false, false, false, false, true, true, true, true]

  const PRO_PLAN_ITEMS = [
    t('subscription.item_diet_plan', 'Piano alimentare del dietista'),
    t('subscription.item_chat', 'Chat con il tuo dietista'),
    t('subscription.item_documents', 'Documenti e referti'),
    t('subscription.item_diary_pro', 'Diario alimentare illimitato'),
    t('subscription.item_tracking', 'Tracciamento acqua e peso'),
    t('subscription.item_database', 'Database alimenti CREA+BDA'),
    t('subscription.item_micronutrients_pro', 'Micronutrienti avanzati (vitamine, minerali)'),
    t('subscription.item_stats_pro', 'Statistiche e grafici trend'),
    t('subscription.item_pdf_pro', 'Report PDF settimanale/mensile'),
    t('subscription.item_adherence_pro', 'Analisi aderenza al piano'),
  ]

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)', overflowY: 'auto',
      paddingBottom: 'calc(80px + env(safe-area-inset-bottom))',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))',
        padding: 'calc(env(safe-area-inset-top) + 14px) 18px 24px',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10,
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'white', flexShrink: 0,
            }}
          >
            <ArrowLeft size={18} />
          </button>
          <h1 style={{ color: 'white', fontSize: 18, fontWeight: 700, margin: 0 }}>{t('subscription.title', 'Abbonamento')}</h1>
        </div>

        {/* Status badge */}
        <div style={{
          background: isPro ? 'rgba(253,230,138,0.25)' : 'rgba(255,255,255,0.12)',
          border: `1.5px solid ${isPro ? 'rgba(253,230,138,0.5)' : 'rgba(255,255,255,0.2)'}`,
          borderRadius: 14, padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: isPro ? 'rgba(251,191,36,0.3)' : 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {isPro ? <Crown size={20} color="#fbbf24" /> : <Lock size={18} color="rgba(255,255,255,0.8)" />}
          </div>
          <div>
            <p style={{ color: 'white', fontWeight: 700, fontSize: 15, margin: '0 0 2px' }}>
              {isPro ? t('subscription.status_pro_active', 'Piano Pro attivo') : t('subscription.status_free', 'Piano Gratuito')}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, margin: 0 }}>
              {isPro && expiresAt
                ? t('subscription.renew_on', { date: new Date(expiresAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' }) }, 'Rinnovo il {{date}}')
                : isPro
                  ? t('subscription.subscription_active', 'Abbonamento attivo')
                  : t('subscription.unlock_features', 'Sblocca tutte le funzionalità avanzate')}
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 16px', maxWidth: 480, margin: '0 auto' }}>

        {/* Coming-soon banner (visible while payments inactive) */}
        {!paymentsActive && (
          <div style={{
            background: '#fefce8', border: '1.5px solid #fde68a',
            borderRadius: 12, padding: '14px 16px', marginBottom: 20,
            display: 'flex', alignItems: 'flex-start', gap: 10,
          }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>🚧</span>
            <div>
              <p style={{ fontWeight: 700, color: '#92400e', fontSize: 13, margin: '0 0 3px' }}>
                {t('subscription.coming_soon_title', 'Sistema pagamenti in arrivo')}
              </p>
              <p style={{ fontSize: 12.5, color: '#78350f', margin: 0, lineHeight: 1.5 }}>
                {t('subscription.coming_soon_desc', 'I pagamenti sono in fase di configurazione. Tutti gli utenti hanno attualmente accesso completo. Sarai avvisato quando sarà possibile abbonarsi.')}
              </p>
            </div>
          </div>
        )}

        {/* Plans */}
        {(!paymentsActive || !isPro) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
            <PlanCard
              title={t('subscription.plan_free_title', 'Gratuito')}
              price="€0"
              period={t('subscription.period_month', '/mese')}
              features={FREE_PLAN_ITEMS}
              locked={FREE_LOCKED}
              cta={isPro ? undefined : t('subscription.cta_current_plan', 'Piano attuale')}
              ctaDisabled={true}
            />
            <PlanCard
              title={t('subscription.plan_pro_title', '⭐ Pro')}
              price="€5,99"
              period={t('subscription.period_month', '/mese')}
              features={PRO_PLAN_ITEMS}
              highlight={true}
              cta={isPro ? t('subscription.cta_pro_active', '✅ Abbonamento attivo') : loading ? t('subscription.cta_redirecting', 'Reindirizzamento…') : t('subscription.cta_start_trial', '⭐ Inizia 7 giorni gratis')}
              ctaDisabled={isPro || !paymentsActive || loading}
              note={!paymentsActive ? t('subscription.note_coming_soon', 'Disponibile a breve') : isPro ? undefined : t('subscription.note_no_card', 'Nessuna carta richiesta per la prova')}
              onCta={handleSubscribe}
            />
          </div>
        )}

        {/* Active Pro management */}
        {paymentsActive && isPro && (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border-light)',
            borderRadius: 16, padding: '18px 20px', marginBottom: 24,
          }}>
            <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 14 }}>
              {t('subscription.manage_title', '⚙️ Gestione abbonamento')}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <div style={{ background: 'var(--surface-2)', borderRadius: 10, padding: '10px 12px' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px' }}>{t('subscription.label_plan', 'Piano')}</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--green-main)', margin: 0 }}>{t('subscription.plan_pro_title', '⭐ Pro')}</p>
              </div>
              <div style={{ background: 'var(--surface-2)', borderRadius: 10, padding: '10px 12px' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px' }}>{t('subscription.label_renewal', 'Rinnovo')}</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {expiresAt ? new Date(expiresAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }) : '—'}
                </p>
              </div>
            </div>
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              style={{
                width: '100%', padding: '12px 0', borderRadius: 12, border: '1.5px solid var(--border-light)',
                background: 'var(--surface)', color: 'var(--text-primary)', fontWeight: 600,
                fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8,
              }}
            >
              <CreditCard size={16} />
              {portalLoading ? t('subscription.loading', 'Caricamento…') : t('subscription.manage_cancel_btn', 'Gestisci / Cancella abbonamento')}
            </button>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', margin: '8px 0 0' }}>
              {t('subscription.manage_secure_note', 'Gestione sicura tramite portale Stripe')}
            </p>
          </div>
        )}

        {/* Feature comparison */}
        <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 12 }}>
          {t('subscription.whats_included', 'Cosa include il Pro')}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {PRO_FEATURES.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'var(--surface)', border: '1px solid var(--border-light)',
              borderRadius: 10, padding: '10px 14px',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: 'var(--green-pale)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Zap size={14} color="var(--green-main)" />
              </div>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t(f.key, f.label)}</span>
            </div>
          ))}
        </div>

        {/* Garanzia / diritto di recesso */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          background: 'var(--green-pale)', border: '1px solid var(--green-main)',
          borderRadius: 14, padding: '14px 16px', marginBottom: 24,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10, flexShrink: 0,
            background: 'var(--green-main)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShieldCheck size={17} color="white" />
          </div>
          <div>
            <p style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
              {t('subscription.guarantee_title', 'Nessun rischio: recesso garantito entro 14 giorni')}
            </p>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {t('subscription.guarantee_desc', 'Se sottoscrivi l\'abbonamento hai comunque diritto di recesso entro 14 giorni ai sensi del Codice del Consumo — oltre alla prova gratuita di 7 giorni senza carta. Puoi disdire in qualsiasi momento dal portale Stripe.')}
            </p>
          </div>
        </div>

        {/* FAQ */}
        <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 12 }}>
          {t('subscription.faq_title', 'Domande frequenti')}
        </p>
        {FAQS.map((faq, i) => <FAQItem key={i} {...faq} />)}

        <p style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--text-muted)', marginTop: 24, lineHeight: 1.6 }}>
          {t('subscription.footer_secure_payments', 'Pagamenti sicuri gestiti da Stripe — PCI-DSS Level 1')}
        </p>
      </div>
    </div>
  )
}
