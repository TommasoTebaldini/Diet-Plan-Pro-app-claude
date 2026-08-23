import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { fetchTodayIntake } from '../../lib/specialSections'
import { useT } from '../../i18n'

function num(v) {
  if (v === null || v === undefined || v === '') return null
  const n = parseFloat(String(v).replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

// Same per-stage limits table as renale.html's calcIRC() — kept identical so
// the patient always sees the exact numbers the dietist is working from.
// G1–G5 stage codes are standard clinical CKD staging notation (language-neutral);
// liq/label text that is real Italian prose is translated via i18n keys below.
const STAGE_CONFIG = {
  g1g2: { kMax: null, pMax: null, naMax: 5, liqKey: 'renale.liq_free', liqFallback: 'Libera', label: 'G1–G2', color: '#059669' },
  g3a:  { kMax: 2500, pMax: 800,  naMax: 5, liqKey: 'renale.liq_free', liqFallback: 'Libera', label: 'G3a', color: '#D97706' },
  g3b:  { kMax: 2000, pMax: 700,  naMax: 5, liqKey: 'renale.liq_fluid_balance', liqFallback: 'Secondo bilancio idrico', label: 'G3b', color: '#EA580C' },
  g4:   { kMax: 1500, pMax: 600,  naMax: 3, liqKey: 'renale.liq_restrict_edema', liqFallback: 'Restrizione se edemi', label: 'G4', color: '#DC2626' },
  g5:   { kMax: 1000, pMax: 500,  naMax: 2, liqKey: 'renale.liq_diuresis_500', liqFallback: 'Diuresi + 500 mL', label: 'G5', color: '#991B1B' },
  hd:   { kMax: 2500, pMax: 1000, naMax: 2, liqKey: 'renale.liq_diuresis_500_750', liqFallback: 'Diuresi + 500–750 mL', label: 'Emodialisi', labelKey: 'renale.stage_hemodialysis', labelFallback: 'Emodialisi', color: '#1D4ED8' },
  pd:   { kMax: 3500, pMax: 1000, naMax: 2, liqKey: 'renale.liq_diuresis_500_750', liqFallback: 'Diuresi + 500–750 mL', label: 'Dialisi Peritoneale', labelKey: 'renale.stage_peritoneal_dialysis', labelFallback: 'Dialisi Peritoneale', color: '#059669' },
}

// Generic, well-known food categories to watch — not a substitute for a real
// per-food potassium/phosphorus database (out of scope here), just a quick
// everyday reference for the most common culprits.
const HIGH_K = [
  { key: 'renale.food_banana', fallback: 'Banana' },
  { key: 'renale.food_potatoes', fallback: 'Patate (non lisciviate)' },
  { key: 'renale.food_tomato', fallback: 'Pomodoro' },
  { key: 'renale.food_citrus', fallback: 'Agrumi e succhi' },
  { key: 'renale.food_dried_fruit', fallback: 'Frutta secca' },
  { key: 'renale.food_legumes', fallback: 'Legumi' },
  { key: 'renale.food_chocolate', fallback: 'Cioccolato' },
  { key: 'renale.food_coffee', fallback: 'Caffè in grandi quantità' },
]
const HIGH_P = [
  { key: 'renale.food_aged_cheese', fallback: 'Formaggi stagionati' },
  { key: 'renale.food_cured_meats', fallback: 'Salumi e insaccati' },
  { key: 'renale.food_cola', fallback: 'Bevande cola' },
  { key: 'renale.food_processed_snacks', fallback: 'Snack/pane industriali (additivi fosfato)' },
  { key: 'renale.food_seafood', fallback: 'Frutti di mare' },
  { key: 'renale.food_egg_yolk', fallback: 'Uova (tuorlo)' },
]

export default function RenaleGuide({ dati }) {
  const { user } = useAuth()
  const [intake, setIntake] = useState(null)
  const t = useT()

  useEffect(() => {
    if (!user?.id) return
    fetchTodayIntake(user.id).then(setIntake)
  }, [user?.id])

  const stadio = dati.calcolo?.stadio
  const cfg = STAGE_CONFIG[stadio]
  if (!cfg) return null

  const stageLabel = cfg.labelKey ? t(cfg.labelKey, cfg.labelFallback) : cfg.label
  const liqLabel = t(cfg.liqKey, cfg.liqFallback)

  const protTot = num(dati.piano?.prot_tot)
  const kcalTot = num(dati.piano?.kcal)
  const protPct = protTot && intake ? Math.min(100, Math.round((intake.proteins / protTot) * 100)) : 0
  const kcalPct = kcalTot && intake ? Math.min(100, Math.round((intake.kcal / kcalTot) * 100)) : 0

  return (
    <div className="card" style={{ padding: 16 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{t('renale.title', { stadio: stageLabel }, '🫘 I tuoi limiti giornalieri — Stadio {{stadio}}')}</h3>
      <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 14 }}>
        {t('renale.subtitle', 'Impostati dal tuo dietista in base al tuo stadio di malattia renale cronica.')}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {cfg.kMax && (
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 12px', background: '#FEE2E2', borderRadius: 8, fontSize: 13 }}>
            <span>{t('renale.potassium_max', '⚡ Potassio max')}</span><b style={{ color: '#7F1D1D' }}>{t('renale.mg_per_day', { val: cfg.kMax }, '<{{val}} mg/die')}</b>
          </div>
        )}
        {cfg.pMax && (
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 12px', background: '#FEE2E2', borderRadius: 8, fontSize: 13 }}>
            <span>{t('renale.phosphorus_max', '🔵 Fosforo max')}</span><b style={{ color: '#7F1D1D' }}>{t('renale.mg_per_day', { val: cfg.pMax }, '<{{val}} mg/die')}</b>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 12px', background: '#FEE2E2', borderRadius: 8, fontSize: 13 }}>
          <span>{t('renale.sodium_max', '🧂 Sodio max')}</span><b style={{ color: '#7F1D1D' }}>{t('renale.g_nacl_per_day', { val: cfg.naMax }, '<{{val}} g NaCl/die')}</b>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 12px', background: '#EFF6FF', borderRadius: 8, fontSize: 13 }}>
          <span>{t('renale.fluids', '💧 Liquidi')}</span><b style={{ color: '#1D4ED8' }}>{liqLabel}</b>
        </div>
      </div>

      {(protTot !== null || kcalTot !== null) && intake !== null && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {protTot !== null && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                <span style={{ fontWeight: 500 }}>{t('renale.protein_today', 'Proteine oggi')}</span>
                <span><b>{Math.round(intake.proteins)}</b> / {protTot} g</span>
              </div>
              <div style={{ height: 6, background: 'var(--border-light)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${protPct}%`, background: protPct >= 100 ? '#DC2626' : '#7F1D1D', borderRadius: 3, transition: 'width .6s' }} />
              </div>
            </div>
          )}
          {kcalTot !== null && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                <span style={{ fontWeight: 500 }}>{t('renale.kcal_today', 'Kcal oggi')}</span>
                <span><b>{Math.round(intake.kcal)}</b> / {kcalTot} kcal</span>
              </div>
              <div style={{ height: 6, background: 'var(--border-light)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${kcalPct}%`, background: '#1D4ED8', borderRadius: 3, transition: 'width .6s' }} />
              </div>
            </div>
          )}
        </div>
      )}

      {(cfg.kMax || cfg.pMax) && (
        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>{t('renale.watch_foods', 'Attenzione a questi alimenti')}</p>
          {cfg.kMax && (
            <div style={{ marginBottom: 8 }}>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{t('renale.high_potassium_label', 'Ricchi di potassio')}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {HIGH_K.map(f => <span key={f.key} style={{ fontSize: 11, background: '#FEF2F2', color: '#991B1B', borderRadius: 100, padding: '3px 9px' }}>{t(f.key, f.fallback)}</span>)}
              </div>
            </div>
          )}
          {cfg.pMax && (
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{t('renale.high_phosphorus_label', 'Ricchi di fosforo')}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {HIGH_P.map(f => <span key={f.key} style={{ fontSize: 11, background: '#EFF6FF', color: '#1D4ED8', borderRadius: 100, padding: '3px 9px' }}>{t(f.key, f.fallback)}</span>)}
              </div>
            </div>
          )}
          <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 8 }}>{t('renale.food_list_disclaimer', 'Elenco generico ed esemplificativo — il tuo dietista può darti indicazioni più precise per la tua situazione.')}</p>
        </div>
      )}
    </div>
  )
}
