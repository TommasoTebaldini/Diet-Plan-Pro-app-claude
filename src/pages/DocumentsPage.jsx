import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { FileText, Download, Calendar, ChevronRight, BookOpen, Utensils, Apple, Heart, Bookmark, BookmarkCheck, ArrowUpDown, Star } from 'lucide-react'

const TYPE_META = {
  // Diet plans
  diet:          { label: 'Piano alimentare',       icon: <Utensils size={18} />, color: '#1a7f5a', bg: '#e6f5ee' },
  dieta:         { label: 'Piano alimentare',       icon: <Utensils size={18} />, color: '#1a7f5a', bg: '#e6f5ee' },
  piano:         { label: 'Piano alimentare',       icon: <Utensils size={18} />, color: '#1a7f5a', bg: '#e6f5ee' },
  chetogenica:   { label: 'Dieta Chetogenica',      icon: <Utensils size={18} />, color: '#0891b2', bg: '#ecfeff' },
  renale:        { label: 'Dieta Renale',           icon: <Utensils size={18} />, color: '#0891b2', bg: '#ecfeff' },
  diabete:       { label: 'Dieta Diabete',          icon: <Utensils size={18} />, color: '#0891b2', bg: '#ecfeff' },
  // Specific consiglio types
  advice:        { label: 'Consiglio nutrizionale', icon: <Heart size={18} />,    color: '#e05a5a', bg: '#fff0f0' },
  consiglio:     { label: 'Consiglio nutrizionale', icon: <Heart size={18} />,    color: '#e05a5a', bg: '#fff0f0' },
  ristorazione:  { label: 'Ristorazione',           icon: <Heart size={18} />,    color: '#e05a5a', bg: '#fff0f0' },
  pediatria:     { label: 'Pediatria',              icon: <Heart size={18} />,    color: '#e05a5a', bg: '#fff0f0' },
  disfagia:      { label: 'Disfagia',               icon: <Heart size={18} />,    color: '#e05a5a', bg: '#fff0f0' },
  pancreas:      { label: 'Pancreas',               icon: <Heart size={18} />,    color: '#e05a5a', bg: '#fff0f0' },
  sport:         { label: 'Nutrizione Sportiva',    icon: <Heart size={18} />,    color: '#e05a5a', bg: '#fff0f0' },
  // Clinical assessments
  questionario:  { label: 'Questionario',           icon: <FileText size={18} />, color: '#7c3aed', bg: '#f5f3ff' },
  dca:           { label: 'Sessione DCA',           icon: <FileText size={18} />, color: '#7c3aed', bg: '#f5f3ff' },
  // Documents
  document:      { label: 'Documento',              icon: <FileText size={18} />, color: '#3b82f6', bg: '#eff6ff' },
  referto:       { label: 'Referto',                icon: <FileText size={18} />, color: '#3b82f6', bg: '#eff6ff' },
  // Education
  education:     { label: 'Materiale educativo',    icon: <BookOpen size={18} />, color: '#8b5cf6', bg: '#f5f3ff' },
  educazione:    { label: 'Materiale educativo',    icon: <BookOpen size={18} />, color: '#8b5cf6', bg: '#f5f3ff' },
  // Catering/Ristorazione
  ristorazione:  { label: 'Menu ristorazione',      icon: <Utensils size={18} />, color: '#0891b2', bg: '#ecfeff' },
  // Recipes
  recipe:        { label: 'Ricetta',                icon: <Apple size={18} />,    color: '#f0922b', bg: '#fff4e6' },
  ricetta:       { label: 'Ricetta',                icon: <Apple size={18} />,    color: '#f0922b', bg: '#fff4e6' },
}

const DATE_FILTERS = [
  { key: 'all', label: 'Sempre' },
  { key: 'week', label: 'Settimana' },
  { key: 'month', label: 'Mese' },
  { key: 'year', label: 'Anno' },
]

const DOCS_EPOCH = '1970-01-01T00:00:00Z'
const DIETITIAN_APP_ORIGIN = 'https://nutri-plan-pro-cxee.vercel.app'

function isNew(doc, lastSeen) {
  return new Date(doc.created_at) > new Date(lastSeen)
}

function safeParseJson(value) {
  if (!value) return {}
  if (typeof value === 'object') return value
  if (typeof value !== 'string') return {}
  try {
    return JSON.parse(value)
  } catch {
    return {}
  }
}

function toAbsoluteDietitianUrl(url) {
  if (!url || typeof url !== 'string') return null
  if (/^https?:\/\//i.test(url)) return url
  if (url.startsWith('/')) return `${DIETITIAN_APP_ORIGIN}${url}`
  return null
}

function guessTitleFromData(dati) {
  return dati?.titolo || dati?.title || dati?.nome || dati?.consiglio_nome || dati?.questionario || ''
}

async function resolveDocumentUrl(rawValue) {
  if (!rawValue || typeof rawValue !== 'string') return null

  const absolute = toAbsoluteDietitianUrl(rawValue)
  if (absolute) return absolute

  const cleaned = rawValue.trim().replace(/^\/+/, '')
  if (!cleaned) return null

  const directBucketPath = cleaned.match(/^([^/]+)\/(.+)$/)
  if (directBucketPath) {
    const [, bucket, objectPath] = directBucketPath
    const { data: signedData } = await supabase.storage.from(bucket).createSignedUrl(objectPath, 60 * 60 * 24)
    if (signedData?.signedUrl) return signedData.signedUrl
    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(objectPath)
    if (publicData?.publicUrl) return publicData.publicUrl
  }

  const apiPathMatch = cleaned.match(/^storage\/v1\/object\/(?:public|sign)\/([^/]+)\/(.+)$/)
  if (apiPathMatch) {
    const [, bucket, objectPath] = apiPathMatch
    const { data: signedData } = await supabase.storage.from(bucket).createSignedUrl(objectPath, 60 * 60 * 24)
    if (signedData?.signedUrl) return signedData.signedUrl
    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(objectPath)
    if (publicData?.publicUrl) return publicData.publicUrl
  }

  return `${DIETITIAN_APP_ORIGIN}/${cleaned}`
}

function toLabel(key) {
  return String(key || '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase())
}

function printableValue(value) {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'Sì' : 'No'
  if (Array.isArray(value)) return value.length ? value.map(v => printableValue(v)).join(', ') : '—'
  if (typeof value === 'object') return ''
  return String(value)
}

function cleanEntries(data) {
  if (!data || typeof data !== 'object') return []
  return Object.entries(data).filter(([, v]) => v !== null && v !== undefined && v !== '')
}

function isQuestionarioData(dati, lowerString) {
  return Boolean(
    dati.questionari ||
    dati.screening ||
    (dati.questionario && (dati.risposte || dati.domande || dati.score !== undefined)) ||
    lowerString.includes('malnutrition universal screening tool') ||
    lowerString.includes('punteggio must')
  )
}

function A4LikeSheet({ children }) {
  return (
    <div style={{ background: '#dbe1e8', padding: 18, borderRadius: 12 }}>
      <div style={{ maxWidth: 860, margin: '0 auto', background: '#f8fafc', border: '1px solid #cfd8e3', boxShadow: '0 2px 10px rgba(15, 23, 42, 0.12)', padding: 18 }}>
        {children}
      </div>
    </div>
  )
}

function PrintFieldGrid({ data, columns = 2 }) {
  const rows = cleanEntries(data)
  if (!rows.length) return null
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: 16 }}>
      {rows.map(([k, v]) => (
        <div key={k}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 7 }}>
            {toLabel(k)}
          </div>
          {typeof v === 'object' && !Array.isArray(v)
            ? <PrintFieldGrid data={v} columns={1} />
            : <div style={{ fontSize: 15, color: '#1e293b', lineHeight: 1.45 }}>{printableValue(v)}</div>}
        </div>
      ))}
    </div>
  )
}

function PrintSection({ title, icon, children }) {
  return (
    <div style={{ border: '1px solid #b8c7d8', borderRadius: 14, background: '#f8fafc', padding: 18, marginBottom: 14 }}>
      <div style={{ borderBottom: '2px solid #cbd5e1', paddingBottom: 10, marginBottom: 14, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13 }}>{icon}</span>
        <span style={{ fontSize: 24, fontWeight: 700 }}>{title}</span>
      </div>
      {children}
    </div>
  )
}

function AssessmentPrintRenderer({ doc, dati }) {
  const root = dati.valutazione_nutrizionale || dati
  const anagrafica = root.anagrafica || root.dati_anagrafici_clinici || root.dati_anagrafici || {}
  const antropometrica = root.antropometrica || root.valutazione_antropometrica || {}
  const biochimici = root.biochimici || root.esami_biochimici || {}
  const recall = root.recall_24h || root.recall_alimentare_24h || {}
  const idratazione = root.idratazione || root.idratazione_bevande || {}
  const abitudini = root.abitudini || root.abitudini_comportamento_alimentare || {}
  const allergie = root.allergie || root.intolleranze_farmaci_attivita || {}
  const fabbisogno = root.fabbisogno || root.fabbisogno_energetico || {}
  const diagnosi = dati.diagnosi_nutrizionale || dati.diagnosi_pes || {}
  const intervento = dati.intervento_nutrizionale || {}
  const monitoraggio = dati.monitoraggio || {}

  const sectionTitle = (n, title) => (
    <h3 style={{ margin: '18px 0 10px', fontSize: 34, color: '#0f766e', borderBottom: '3px solid #0f766e', paddingBottom: 6, letterSpacing: 0.2 }}>
      {n}. {title}
    </h3>
  )

  return (
    <A4LikeSheet>
      <div style={{ fontFamily: 'Inter, Arial, sans-serif', color: '#1f2937' }}>
        <div style={{ border: '2px solid #2dd4bf', borderRadius: 12, padding: '10px 12px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
          <strong style={{ color: '#0f766e', fontSize: 25 }}>{doc.title}</strong>
          <span style={{ background: '#0f766e', color: '#fff', borderRadius: 999, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>{new Date(doc.created_at).toLocaleDateString('it-IT')}</span>
        </div>

        {sectionTitle(1, 'Valutazione Nutrizionale')}
        <PrintSection title="Dati Anagrafici e Clinici" icon="👤"><PrintFieldGrid data={anagrafica} /></PrintSection>
        <PrintSection title="Valutazione Antropometrica" icon="📏"><PrintFieldGrid data={antropometrica} /></PrintSection>
        <PrintSection title="Esami Biochimici" icon="🧪"><PrintFieldGrid data={biochimici} /></PrintSection>
        <PrintSection title="Recall Alimentare 24h" icon="📋"><PrintFieldGrid data={recall} columns={1} /></PrintSection>
        <PrintSection title="Idratazione e Bevande" icon="🥤"><PrintFieldGrid data={idratazione} /></PrintSection>
        <PrintSection title="Abitudini e Comportamento Alimentare" icon="🍽️"><PrintFieldGrid data={abitudini} /></PrintSection>
        <PrintSection title="Allergie, Intolleranze, Farmaci e Attività Fisica" icon="⚠️"><PrintFieldGrid data={allergie} columns={1} /></PrintSection>
        <PrintSection title="Fabbisogno Energetico Stimato" icon="⚡"><PrintFieldGrid data={fabbisogno} /></PrintSection>

        {sectionTitle(2, 'Diagnosi Nutrizionale (PES)')}
        <PrintSection title="Diagnosi Nutrizionale - Formato PES" icon="📝">
          {Array.isArray(diagnosi.problemi) && diagnosi.problemi.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {diagnosi.problemi.map((p, i) => (
                <span key={i} style={{ background: '#dbeafe', color: '#1d4ed8', border: '1px solid #93c5fd', borderRadius: 999, padding: '4px 10px', fontSize: 12, fontWeight: 600 }}>{p}</span>
              ))}
            </div>
          ) : <PrintFieldGrid data={diagnosi} columns={1} />}
        </PrintSection>

        {sectionTitle(3, 'Intervento Nutrizionale')}
        <PrintSection title="Piano Dietetico Prescritto" icon="🍲"><PrintFieldGrid data={intervento.piano_dietetico || intervento} /></PrintSection>
        <PrintSection title="Educazione Alimentare e Counseling" icon="📚"><PrintFieldGrid data={intervento.educazione || intervento.counseling || {}} columns={1} /></PrintSection>
        <PrintSection title="Supplementazione e Coordinamento" icon="💊"><PrintFieldGrid data={intervento.supplementazione || {}} columns={1} /></PrintSection>

        {sectionTitle(4, 'Monitoraggio')}
        <PrintSection title="Pianificazione Follow-up" icon="🗓️"><PrintFieldGrid data={monitoraggio.followup || monitoraggio} /></PrintSection>
        <PrintSection title="Parametri da Monitorare" icon="📊"><PrintFieldGrid data={monitoraggio.parametri || monitoraggio.parametri_monitorare || {}} /></PrintSection>
        <PrintSection title="Verifica Obiettivi e Esito" icon="✅"><PrintFieldGrid data={monitoraggio.esito || {}} columns={1} /></PrintSection>
      </div>
    </A4LikeSheet>
  )
}

function BiaPrintRenderer({ doc, dati }) {
  const source = dati.bia || dati
  return (
    <A4LikeSheet>
      <div style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', color: '#fff', borderRadius: 16, padding: 18, marginBottom: 14 }}>
          <div style={{ fontSize: 34, fontWeight: 700, marginBottom: 6 }}>Bioimpedenziometria (BIA)</div>
          <div style={{ opacity: 0.92, fontSize: 14 }}>{doc.nota || 'Inserisci i dati del report BIA per analizzare composizione corporea e metabolismo basale.'}</div>
        </div>
        <div style={{ border: '1px solid #cbd5e1', borderRadius: 12, background: '#fff', padding: 10, marginBottom: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {['Inserimento Dati', 'Analisi Composizione', 'Storico & Trend', 'Valori di Riferimento'].map(t => (
            <span key={t} style={{ padding: '6px 10px', borderRadius: 10, border: '1px solid #dbeafe', background: t === 'Inserimento Dati' ? '#eef2ff' : '#f8fafc', color: t === 'Inserimento Dati' ? '#1d4ed8' : '#334155', fontSize: 12, fontWeight: 600 }}>{t}</span>
          ))}
        </div>
        <PrintSection title="Inserimento Manuale Parametri BIA" icon="🧪"><PrintFieldGrid data={source.parametri_bia || source.parametri || source} /></PrintSection>
        <PrintSection title="Analisi Composizione" icon="📊"><PrintFieldGrid data={source.analisi_composizione || source.composizione || {}} /></PrintSection>
        <PrintSection title="Storico e Trend" icon="📈"><PrintFieldGrid data={source.storico || source.trend || {}} columns={1} /></PrintSection>
      </div>
    </A4LikeSheet>
  )
}

function QuestionariPrintRenderer({ doc, dati }) {
  const q = dati.questionari || dati
  const tool = q.tool || q.questionario || doc.title
  return (
    <A4LikeSheet>
      <div style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
        <div style={{ background: 'linear-gradient(135deg, #0369a1, #38bdf8)', color: '#fff', borderRadius: 16, padding: 18, marginBottom: 16 }}>
          <div style={{ fontSize: 34, fontWeight: 700 }}>Questionari Nutrizionali Validati</div>
          <div style={{ opacity: 0.95, fontSize: 13, marginTop: 4 }}>{tool}</div>
        </div>
        <PrintSection title={q.titolo || 'Screening dello stato nutrizionale'} icon="🔎">
          <PrintFieldGrid data={q.domande || q.risposte || q} columns={1} />
        </PrintSection>
        <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 12, color: '#9f1239', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Punteggio</div>
          <div style={{ fontSize: 40, fontWeight: 800, color: '#991b1b' }}>{q.score ?? dati.score ?? '—'}</div>
          <div style={{ marginTop: 6, color: '#7f1d1d', fontSize: 14 }}>{q.interpretazione || dati.label || 'Interpretazione non disponibile'}</div>
        </div>
      </div>
    </A4LikeSheet>
  )
}

function PathologyAdvicePrintRenderer({ doc, dati }) {
  const d = dati.consiglio || dati
  const allowed = d.alimenti_consentiti || d.consigliati || []
  const limited = d.alimenti_limitare || d.moderazione || []
  const avoid = d.alimenti_evitare || d.evitare || []
  return (
    <A4LikeSheet>
      <div style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
        <div style={{ background: 'linear-gradient(135deg, #2563eb, #60a5fa)', color: '#fff', borderRadius: 16, padding: 18, marginBottom: 16 }}>
          <div style={{ fontSize: 36, fontWeight: 800 }}>{d.titolo || doc.title}</div>
          <div style={{ opacity: 0.92, fontSize: 13 }}>{d.sottotitolo || 'Consigli Nutrizionali - DietPlan Pro'}</div>
        </div>
        {d.punti_chiave && <PrintSection title="Indicazioni principali" icon="📌"><PrintFieldGrid data={d.punti_chiave} columns={1} /></PrintSection>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div style={{ border: '1px solid #bbf7d0', borderRadius: 12, padding: 12, background: '#f0fdf4' }}>
            <div style={{ color: '#166534', fontWeight: 700, marginBottom: 8 }}>Alimenti consigliati</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{allowed.map((a, i) => <span key={i} style={{ background: '#dcfce7', color: '#166534', borderRadius: 999, padding: '4px 8px', fontSize: 12 }}>{a}</span>)}</div>
          </div>
          <div style={{ border: '1px solid #fecaca', borderRadius: 12, padding: 12, background: '#fef2f2' }}>
            <div style={{ color: '#991b1b', fontWeight: 700, marginBottom: 8 }}>Da evitare / limitare</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{[...avoid, ...limited].map((a, i) => <span key={i} style={{ background: '#fee2e2', color: '#991b1b', borderRadius: 999, padding: '4px 8px', fontSize: 12 }}>{a}</span>)}</div>
          </div>
        </div>
        <PrintSection title="Consigli pratici" icon="💡">
          {Array.isArray(d.indicazioni)
            ? <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>{d.indicazioni.map((x, i) => <li key={i}>{x}</li>)}</ul>
            : <p style={{ margin: 0, lineHeight: 1.8 }}>{d.indicazioni || d.note || doc.content || 'Nessuna indicazione disponibile.'}</p>}
        </PrintSection>
      </div>
    </A4LikeSheet>
  )
}


function PrintDocRenderer({ doc }) {
  // Robust: detect from BOTH tipo AND dati shape
  const tipo = (doc.tipo || doc.type || '').toLowerCase()
  let dati = doc.dati_raw || {}
  // Parse if string
  if (typeof dati === 'string') { try { dati = JSON.parse(dati) } catch { dati = {} } }

  const lowerString = JSON.stringify(dati).toLowerCase()
  const isAssessment =
    tipo === 'dca' ||
    Boolean(dati.valutazione_nutrizionale || dati.diagnosi_nutrizionale || dati.intervento_nutrizionale || dati.monitoraggio) ||
    ['valutazione antropometrica', 'recall alimentare', 'fabbisogno energetico', 'diagnosi pes'].some(k => lowerString.includes(k))
  if (isAssessment) return <AssessmentPrintRenderer doc={doc} dati={dati} />

  const isBia = tipo === 'bia' || Boolean(dati.bia || dati.parametri_bia || lowerString.includes('bioimpedenziometr'))
  if (isBia) return <BiaPrintRenderer doc={doc} dati={dati} />

  const isQuestionariAdvanced = isQuestionarioData(dati, lowerString)
  if (isQuestionariAdvanced) return <QuestionariPrintRenderer doc={doc} dati={dati} />

  const isPathologyAdvice = ['diabete', 'renale', 'chetogenica', 'sport', 'pancreas'].includes(tipo) && (Array.isArray(dati.alimenti_consentiti) || Array.isArray(dati.alimenti_evitare))
  if (isPathologyAdvice) return <PathologyAdvicePrintRenderer doc={doc} dati={dati} />

  // ── MUST / Questionario ─────────────────────────────────────────────────────
  const isQuestionario = tipo === 'questionario' || (dati.questionario && dati.score !== undefined)
  if (isQuestionario) {
    const scoreColor = dati.score >= 3 ? '#dc2626' : dati.score >= 1 ? '#d97706' : '#16a34a'
    return (
      <div>
        <div style={{ background: '#f5f3ff', border: '2px solid #d8b4fe', borderRadius: 14, padding: 20, marginBottom: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#7c3aed', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            Questionario {dati.questionario || 'Clinico'}
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: scoreColor, marginBottom: 6 }}>
            Score: {dati.score ?? '—'}
          </div>
          {dati.label && <div style={{ fontSize: 16, fontWeight: 600, color: scoreColor }}>{dati.label}</div>}
        </div>
        {dati.desc && <p style={{ fontSize: 14, lineHeight: 1.8, color: '#333', whiteSpace: 'pre-wrap' }}>{dati.desc}</p>}
        {doc.nota && doc.nota !== doc.title && <p style={{ marginTop: 12, fontSize: 14, color: '#666', fontStyle: 'italic' }}>{doc.nota}</p>}
      </div>
    )
  }

  // ── Consiglio nutrizionale ───────────────────────────────────────────────────
  const isConsiglio = tipo === 'consiglio' || dati.consiglio_id || dati.consiglio_nome
  if (isConsiglio) {
    return (
      <div>
        <div style={{ background: 'linear-gradient(135deg, #fff0f0, #fff5f5)', border: '2px solid #fecaca', borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: '#dc2626', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Consiglio Nutrizionale</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#991b1b' }}>{dati.consiglio_nome || doc.title}</div>
        </div>
        {dati.indicazioni && <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#1a7f5a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: .5 }}>Indicazioni</p>
          <p style={{ fontSize: 14, lineHeight: 1.8 }}>{dati.indicazioni}</p>
        </div>}
        {dati.alimenti_consentiti && Array.isArray(dati.alimenti_consentiti) && dati.alimenti_consentiti.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#16a34a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: .5 }}>✅ Alimenti consentiti</p>
            <ul style={{ paddingLeft: 20, fontSize: 14, lineHeight: 2 }}>{dati.alimenti_consentiti.map((a, i) => <li key={i}>{a}</li>)}</ul>
          </div>
        )}
        {dati.alimenti_limitare && Array.isArray(dati.alimenti_limitare) && dati.alimenti_limitare.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#d97706', marginBottom: 8, textTransform: 'uppercase', letterSpacing: .5 }}>⚠️ Da limitare</p>
            <ul style={{ paddingLeft: 20, fontSize: 14, lineHeight: 2 }}>{dati.alimenti_limitare.map((a, i) => <li key={i}>{a}</li>)}</ul>
          </div>
        )}
        {dati.alimenti_evitare && Array.isArray(dati.alimenti_evitare) && dati.alimenti_evitare.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#dc2626', marginBottom: 8, textTransform: 'uppercase', letterSpacing: .5 }}>🚫 Da evitare</p>
            <ul style={{ paddingLeft: 20, fontSize: 14, lineHeight: 2 }}>{dati.alimenti_evitare.map((a, i) => <li key={i}>{a}</li>)}</ul>
          </div>
        )}
        {dati.note && <div style={{ padding: '10px 14px', background: '#fffbeb', borderRadius: 8, borderLeft: '3px solid #f59e0b', fontSize: 13, color: '#92400e' }}>💡 {dati.note}</div>}
        {doc.content && !dati.indicazioni && <p style={{ fontSize: 14, lineHeight: 1.8 }}>{doc.content}</p>}
      </div>
    )
  }

  // ── Calcoli clinici (DCA, diabete, chetogenica, renale, ecc.) ──────────────
  const calcData = dati.calcolo || dati.rapporto_ic || dati.panoramica || null
  const isCalcolo = calcData || tipo === 'dca' || tipo === 'diabete' || tipo === 'chetogenica' || tipo === 'renale' || tipo === 'pediatria' || tipo === 'disfagia' || tipo === 'pancreas' || tipo === 'sport'
  if (isCalcolo) {
    const LABEL_MAP = {
      peso: 'Peso (kg)', altezza: 'Altezza (cm)', eta: 'Età',
      sesso: 'Sesso', peso_ideale: 'Peso ideale (kg)',
      imc: 'IMC', bmi: 'BMI',
      fabbisogno: 'Fabbisogno calorico', kcal: 'Calorie',
      proteine: 'Proteine (g)', carboidrati: 'Carboidrati (g)', grassi: 'Grassi (g)',
      tipo: 'Tipo', tdd: 'TDD (UI)', metodo: 'Metodo',
      attivita: 'Attività fisica', storia_paziente: 'Anamnesi',
      storia_peso: 'Storia peso', famiglia: 'Anamnesi familiare',
      npasti: 'N° pasti', luogo: 'Luogo pasti', appetito: 'Appetito',
    }
    const renderCalcTable = (obj, label) => {
      if (!obj || typeof obj !== 'object') return null
      const entries = Object.entries(obj).filter(([, v]) => v !== '' && v !== null && v !== undefined && typeof v !== 'object')
      const nested = Object.entries(obj).filter(([, v]) => v && typeof v === 'object')
      if (entries.length === 0 && nested.length === 0) return null
      return (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
          {label && <div style={{ background: '#1a7f5a', color: 'white', padding: '9px 16px', fontSize: 13, fontWeight: 700 }}>{label}</div>}
          {entries.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {entries.map(([k, v], i) => (
                  <tr key={k} style={{ background: i % 2 === 0 ? 'white' : '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '8px 16px', fontSize: 13, color: '#555', fontWeight: 600, width: '45%' }}>
                      {LABEL_MAP[k] || k.replace(/_/g, ' ').replace(/\w/g, l => l.toUpperCase())}
                    </td>
                    <td style={{ padding: '8px 16px', fontSize: 13, color: '#1a1a1a' }}>{String(v)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {nested.map(([k, v]) => (
            <div key={k} style={{ padding: '0 0 8px 0' }}>
              {renderCalcTable(v, LABEL_MAP[k] || k.replace(/_/g, ' ').replace(/\w/g, l => l.toUpperCase()))}
            </div>
          ))}
        </div>
      )
    }
    return (
      <div>
        {doc.nota && (
          <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 12, padding: 14, marginBottom: 18 }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#0369a1' }}>{doc.nota}</p>
          </div>
        )}
        {calcData ? renderCalcTable(calcData, '📊 Dati clinici') : renderCalcTable(dati, '📊 Dati clinici')}
      </div>
    )
  }

  // ── Ristorazione / menu scolastico ──────────────────────────────────────────
  const ristData = dati.valutazione || dati
  const isRistorazione = tipo === 'ristorazione' || ristData?.portate?.length > 0
  if (isRistorazione && ristData?.portate) {
    const portate = ristData.portate || []
    return (
      <div>
        {doc.nota && (
          <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 12, padding: 14, marginBottom: 18 }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#0369a1' }}>{doc.nota}</p>
          </div>
        )}
        {(ristData.tipo || ristData.utenza || ristData.coperti) && (
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
            <div style={{ background: '#1a7f5a', color: 'white', padding: '9px 16px', fontSize: 13, fontWeight: 700 }}>📋 Informazioni struttura</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {[['Tipo', ristData.tipo], ['Utenza', ristData.utenza], ['Coperti', ristData.coperti], ['Kcal', ristData.kcal], ['Diete speciali', ristData.diete], ['Allergeni', ristData.allergeni]].filter(([, v]) => v).map(([k, v], i) => (
                  <tr key={k} style={{ background: i % 2 === 0 ? 'white' : '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '8px 16px', fontSize: 13, color: '#555', fontWeight: 600, width: '40%' }}>{k}</td>
                    <td style={{ padding: '8px 16px', fontSize: 13 }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {portate.length > 0 && (
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
            <div style={{ background: '#1a7f5a', color: 'white', padding: '9px 16px', fontSize: 13, fontWeight: 700 }}>🍽️ Portate</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  {['Portata', 'Porzione', 'Note'].map(h => (
                    <th key={h} style={{ padding: '8px 14px', fontSize: 12, color: '#666', textAlign: 'left', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {portate.map((p, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '8px 14px', fontSize: 13, fontWeight: 600, color: '#1a7f5a' }}>{p.nome || ''}</td>
                    <td style={{ padding: '8px 14px', fontSize: 13 }}>{p.porzione || ''}</td>
                    <td style={{ padding: '8px 14px', fontSize: 12, color: '#666', fontStyle: p.note ? 'normal' : 'italic' }}>{p.note || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {ristData.note_generali && <div style={{ padding: '10px 14px', background: '#fffbeb', borderRadius: 8, borderLeft: '3px solid #f59e0b', fontSize: 13, color: '#92400e' }}>💡 {ristData.note_generali}</div>}
      </div>
    )
  }

  // ── Generic fallback: smart formatted renderer ──────────────────────────────
  return (
    <div>
      {doc.nota && doc.nota !== doc.title && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: 14, marginBottom: 16 }}>
          <p style={{ fontSize: 15, color: '#166534' }}>{doc.nota}</p>
        </div>
      )}
      {doc.content
        ? <p style={{ fontSize: 15, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{doc.content}</p>
        : Object.keys(dati).length > 0
          ? <SmartJsonRenderer data={dati} />
          : <p style={{ color: '#999', textAlign: 'center', marginTop: 40 }}>Nessun contenuto disponibile</p>
      }
    </div>
  )
}

// ─── Smart renderer: formats any JSON object in a human-readable way ──────────
function SmartJsonRenderer({ data, depth = 0 }) {
  if (!data || typeof data !== 'object') {
    return <span style={{ fontSize: 14 }}>{String(data)}</span>
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return null
    // Array of objects → table
    if (typeof data[0] === 'object' && data[0] !== null) {
      const keys = Object.keys(data[0]).filter(k => data.some(r => r[k] !== '' && r[k] !== null && r[k] !== undefined))
      if (keys.length > 0) {
        return (
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', marginBottom: 12 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  {keys.map(k => (
                    <th key={k} style={{ padding: '7px 12px', fontSize: 11, color: '#666', textAlign: 'left', fontWeight: 600, textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>
                      {k.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
                    {keys.map(k => (
                      <td key={k} style={{ padding: '7px 12px', fontSize: 13 }}>
                        {typeof row[k] === 'object' ? JSON.stringify(row[k]) : String(row[k] ?? '—')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    }
    // Array of primitives → list
    return (
      <ul style={{ paddingLeft: 20, fontSize: 14, lineHeight: 2 }}>
        {data.map((item, i) => <li key={i}>{String(item)}</li>)}
      </ul>
    )
  }

  // Object → key-value table
  const entries = Object.entries(data).filter(([, v]) => v !== '' && v !== null && v !== undefined)
  if (entries.length === 0) return null

  return (
    <div style={{ marginBottom: depth === 0 ? 0 : 12 }}>
      {entries.map(([k, v]) => (
        <div key={k} style={{ marginBottom: 10 }}>
          {typeof v === 'object' ? (
            <>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#1a7f5a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                {k.replace(/_/g, ' ')}
              </p>
              <div style={{ paddingLeft: 12, borderLeft: '3px solid #e6f5ee' }}>
                <SmartJsonRenderer data={v} depth={depth + 1} />
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 12, padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}>
              <span style={{ fontSize: 12, color: '#666', fontWeight: 600, width: '40%', flexShrink: 0 }}>
                {k.replace(/_/g, ' ').replace(/\w/g, l => l.toUpperCase())}
              </span>
              <span style={{ fontSize: 13, color: '#1a1a1a' }}>{String(v)}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

const MEAL_LABELS = {
  colazione: { label: 'Colazione', emoji: '☀️' },
  spuntino_mattina: { label: 'Spuntino mattina', emoji: '🍎' },
  pranzo: { label: 'Pranzo', emoji: '🍽️' },
  spuntino_pomeriggio: { label: 'Spuntino pomeriggio', emoji: '🥤' },
  cena: { label: 'Cena', emoji: '🌙' },
}

function MealPlanRenderer({ mealsData, title, dataString }) {
  let days = []
  try {
    const parsed = typeof mealsData === 'string' ? JSON.parse(mealsData) : mealsData
    days = Array.isArray(parsed) ? parsed : []
  } catch { return <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Piano non disponibile</p> }

  return (
    <div style={{ fontFamily: 'Georgia, serif' }}>
      {/* Print header */}
      <div style={{ textAlign: 'center', marginBottom: 28, paddingBottom: 20, borderBottom: '2px solid #1a7f5a' }}>
        <div style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>Piano Alimentare Personalizzato</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0d5c3a', margin: '0 0 6px' }}>{title}</h1>
        {dataString && <div style={{ fontSize: 13, color: '#666' }}>Data: {new Date(dataString).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</div>}
      </div>

      {/* Days */}
      {days.map((day, di) => (
        <div key={day.id || di} style={{ marginBottom: 28, pageBreakInside: 'avoid' }}>
          {/* Day header */}
          <div style={{ background: '#1a7f5a', color: 'white', padding: '8px 16px', borderRadius: 8, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16 }}>📅</span>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{day.nome || `Giorno ${di + 1}`}</h2>
          </div>

          {/* Meals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(day.meals || []).map((meal, mi) => {
              const mealKey = meal.id || meal.tipo || ''
              const meta = MEAL_LABELS[mealKey] || { label: meal.nome || meal.id || 'Pasto', emoji: '🍴' }
              const foods = meal.foods || meal.alimenti || []
              const kcal = meal.kcal || meal.calorie || null
              const note = meal.note || meal.notes || ''

              return (
                <div key={meal.id || mi} style={{ border: '1px solid #e8f2ec', borderRadius: 10, overflow: 'hidden' }}>
                  {/* Meal header */}
                  <div style={{ background: '#f0faf5', padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e8f2ec' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 18 }}>{meta.emoji}</span>
                      <span style={{ fontWeight: 600, fontSize: 14, color: '#0d5c3a' }}>{meta.label}</span>
                    </div>
                    {kcal && <span style={{ fontSize: 12, color: '#666', background: 'white', padding: '2px 8px', borderRadius: 100, border: '1px solid #e8f2ec' }}>🔥 {kcal} kcal</span>}
                  </div>

                  {/* Foods */}
                  <div style={{ padding: '10px 14px' }}>
                    {foods.length > 0 ? (
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #e8f2ec' }}>
                            <th style={{ textAlign: 'left', padding: '4px 0', color: '#666', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Alimento</th>
                            <th style={{ textAlign: 'right', padding: '4px 0', color: '#666', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Quantità</th>
                          </tr>
                        </thead>
                        <tbody>
                          {foods.map((food, fi) => (
                            <tr key={fi} style={{ borderBottom: fi < foods.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                              <td style={{ padding: '6px 0', color: '#1a1a1a' }}>{food.nome || food.name || food.alimento || ''}</td>
                              <td style={{ padding: '6px 0', textAlign: 'right', color: '#1a7f5a', fontWeight: 500 }}>
                                {food.quantita || food.quantity || food.grammi || food.grams || ''}{food.unita || food.unit || 'g'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (meal.descrizione || meal.description) ? (
                      <p style={{ fontSize: 13, color: '#333', lineHeight: 1.6, margin: 0 }}>{meal.descrizione || meal.description}</p>
                    ) : null}

                    {note && (
                      <div style={{ marginTop: 8, padding: '6px 10px', background: '#fffbeb', borderRadius: 6, borderLeft: '3px solid #f59e0b', fontSize: 12, color: '#92400e' }}>
                        💡 {note}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function DocModal({ doc, onClose, bookmarked, onToggleBookmark }) {
  if (!doc) return null
  const meta = TYPE_META[doc.type] || TYPE_META.document
  const isPiano = doc.source === 'piano'

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', flexDirection: 'column', background: 'white' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg, #0d5c3a, #1a7f5a)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,.15)' }}>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 20, flexShrink: 0 }}>←</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, margin: 0 }}>{meta.label}</p>
          <h2 style={{ color: 'white', fontSize: 17, fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.title}</h2>
        </div>
        <button
          onClick={() => onToggleBookmark(doc.id)}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', flexShrink: 0 }}
        >
          {bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 40px', maxWidth: 900, width: '100%', margin: '0 auto' }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.06)', padding: 28 }}>
          {doc.meals_data ? (
            <MealPlanRenderer mealsData={doc.meals_data} title={doc.title} dataString={doc.data_piano} />
          ) : doc.file_url ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
              <p style={{ marginBottom: 14, color: '#666' }}>Documento allegato</p>
              <a href={doc.file_url} target="_blank" rel="noopener noreferrer" style={{ background: '#1a7f5a', color: 'white', padding: '12px 24px', borderRadius: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Download size={16} />Apri documento
              </a>
              <div style={{ marginTop: 20, border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', minHeight: 500 }}>
                <iframe title={doc.title} src={doc.file_url} style={{ width: '100%', minHeight: 500, border: 'none' }} />
              </div>
            </div>
          ) : (
            <PrintDocRenderer doc={doc} />
          )}
        </div>

        {doc.tags && doc.tags.length > 0 && (
          <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {doc.tags.map(t => <span key={t} style={{ background: '#e6f5ee', color: '#0d5c3a', padding: '3px 10px', borderRadius: 100, fontSize: 12 }}>{t}</span>)}
          </div>
        )}

        <div style={{ marginTop: 24, padding: 14, background: '#f7faf8', borderRadius: 12, fontSize: 12, color: '#999' }}>
          📅 Pubblicato il {new Date(doc.published_at || doc.created_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>
    </div>
  )
}

export default function DocumentsPage() {
  const { user } = useAuth()
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [typeFilter, setTypeFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [sortAsc, setSortAsc] = useState(false)
  const [selected, setSelected] = useState(null)
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const raw = localStorage.getItem(`doc_bookmarks_${user?.id}`)
      return raw ? new Set(JSON.parse(raw)) : new Set()
    } catch {
      return new Set()
    }
  })
  const [lastSeen] = useState(() => localStorage.getItem(`docs_last_seen_${user?.id}`) || DOCS_EPOCH)

  useEffect(() => {
    async function load() {
      setLoadError(null)
      const allDocs = []

      try {
        // Step 1: get cartella_id linked to this patient via patient_dietitian
        const { data: link } = await supabase
          .from('patient_dietitian')
          .select('cartella_id')
          .eq('patient_id', user.id)
          .maybeSingle()

        const cartellaId = link?.cartella_id

        if (cartellaId) {
          // Step 2a: load note_specialistiche visible to patient
          const { data: notes } = await supabase
            .from('note_specialistiche')
            .select('id, tipo, nota, dati, created_at')
            .eq('cartella_id', cartellaId)
            .eq('visible_to_patient', true)
            .order('created_at', { ascending: false })

          for (const n of notes || []) {
            const tipo = (n.tipo || '').toLowerCase().trim()

            // Direct tipo → TYPE_META key mapping
            const TYPE_META_KEYS_SET = new Set(['diet','dieta','piano','chetogenica','renale','diabete','advice','consiglio','ristorazione','pediatria','disfagia','pancreas','sport','questionario','dca','document','referto','education','educazione','recipe','ricetta'])
            const tipoToKey = {
              dieta: 'diet', piano: 'diet',
              consiglio: 'consiglio',
              questionario: 'questionario',
              dca: 'dca',
              diabete: 'diabete',
              chetogenica: 'chetogenica',
              renale: 'renale',
              referto: 'referto',
              ricetta: 'recipe',
              educazione: 'education',
              nota: 'document',
            }
            // Use tipo directly if it has a TYPE_META entry, otherwise lookup, otherwise use tipo itself
            const type = TYPE_META_KEYS_SET.has(tipo) ? tipo : (tipoToKey[tipo] || tipo || 'document')
            const parsedDati = safeParseJson(n.dati)
            const titleFromDati = guessTitleFromData(parsedDati)
            const resolvedFileUrl = await resolveDocumentUrl(parsedDati?.file_url || parsedDati?.pdf_url || null)
            const title = n.nota || titleFromDati ||
              (n.tipo ? n.tipo.charAt(0).toUpperCase() + n.tipo.slice(1) : 'Documento')

            // Extract readable content from dati
            let content = ''
            let mealsData = null

            if (parsedDati && Object.keys(parsedDati).length > 0) {
              content = parsedDati.content || parsedDati.contenuto || parsedDati.testo ||
                        parsedDati.descrizione || parsedDati.text || parsedDati.desc || ''
              if (parsedDati.meals || parsedDati.giorni) {
                mealsData = parsedDati.meals || parsedDati.giorni
              }
            } else if (typeof n.dati === 'string') {
              content = n.dati
            }

            allDocs.push({
              id: `note_${n.id}`,
              title,
              type,
              source: 'note',
              tipo: n.tipo,
              nota: n.nota,
              content,
              dati_raw: parsedDati,
              meals_data: mealsData,
              file_url: resolvedFileUrl,
              tags: parsedDati?.tags || [],
              visible: true,
              published_at: n.created_at,
              created_at: n.created_at,
            })
          }

          // Step 2b: load piani visible to patient
          const { data: piani } = await supabase
            .from('piani')
            .select('id, nome, data_piano, meals, saved_at')
            .eq('cartella_id', cartellaId)
            .eq('visible_to_patient', true)
            .order('saved_at', { ascending: false })

          for (const p of piani || []) {
            allDocs.push({
              id: `piano_${p.id}`,
              title: p.nome || 'Piano alimentare',
              type: 'diet',
              source: 'piano',
              content: p.data_piano || '',
              data_piano: p.data_piano,
              meals_data: p.meals,
              file_url: null,
              tags: [],
              visible: true,
              published_at: p.saved_at,
              created_at: p.saved_at,
            })
          }
        }

        // Step 3 (fallback): also check patient_documents directly
        const { data: patientDocs } = await supabase
          .from('patient_documents')
          .select('*')
          .eq('patient_id', user.id)
          .eq('visible', true)
          .order('created_at', { ascending: false })

        for (const d of patientDocs || []) {
          const fallbackResolvedUrl = await resolveDocumentUrl(d.file_url || d.pdf_url || d.path || d.url || null)
          allDocs.push({ ...d, file_url: fallbackResolvedUrl || d.file_url || null, published_at: d.published_at || d.created_at })
        }

      } catch (e) {
        console.error('Documents load error:', e)
        setLoadError(e.message)
      }

      setDocs(allDocs)
      setLoading(false)
    }
    load()
  }, [user.id])

  const toggleBookmark = useCallback((docId) => {
    setBookmarks(prev => {
      const next = new Set(prev)
      if (next.has(docId)) next.delete(docId)
      else next.add(docId)
      try {
        localStorage.setItem(`doc_bookmarks_${user.id}`, JSON.stringify([...next]))
      } catch { /* ignore */ }
      return next
    })
  }, [user.id])

  const getDateThreshold = () => {
    const now = new Date()
    if (dateFilter === 'week') { now.setDate(now.getDate() - 7); return now }
    if (dateFilter === 'month') { now.setMonth(now.getMonth() - 1); return now }
    if (dateFilter === 'year') { now.setFullYear(now.getFullYear() - 1); return now }
    return null
  }

  const types = ['all', 'bookmarks', ...new Set(docs.map(d => d.type).filter(Boolean))]

  const filtered = docs
    .filter(d => {
      if (typeFilter === 'bookmarks') return bookmarks.has(d.id)
      if (typeFilter !== 'all' && d.type !== typeFilter) return false
      const threshold = getDateThreshold()
      if (threshold && new Date(d.created_at) < threshold) return false
      return true
    })
    .sort((a, b) => {
      const diff = new Date(a.created_at) - new Date(b.created_at)
      return sortAsc ? diff : -diff
    })

  const newCount = docs.filter(d => isNew(d, lastSeen)).length

  return (
    <>
      <div className="page">
        <div style={{ background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))', padding: 'calc(env(safe-area-inset-top) + 20px) 24px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Condivisi dal tuo dietista</p>
            {newCount > 0 && (
              <span style={{ background: '#f59e0b', color: 'white', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 100 }}>
                {newCount} nuov{newCount === 1 ? 'o' : 'i'}
              </span>
            )}
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'white', fontWeight: 300, marginBottom: 14 }}>I miei documenti</h1>

          {/* Type filter tabs */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, WebkitOverflowScrolling: 'touch' }}>
            {types.map(t => (
              <button key={t} onClick={() => setTypeFilter(t)} style={{
                flexShrink: 0, padding: '7px 14px', borderRadius: 100,
                background: typeFilter === t ? 'white' : 'rgba(255,255,255,0.15)',
                color: typeFilter === t ? 'var(--green-main)' : 'white',
                border: 'none', font: 'inherit', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                {t === 'bookmarks' && <Star size={12} fill={typeFilter === 'bookmarks' ? 'var(--green-main)' : 'white'} />}
                {t === 'all' ? 'Tutti' : t === 'bookmarks' ? 'Preferiti' : TYPE_META[t]?.label || t}
              </button>
            ))}
          </div>

          {/* Date filter + sort row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', flex: 1, WebkitOverflowScrolling: 'touch' }}>
              {DATE_FILTERS.map(({ key, label }) => (
                <button key={key} onClick={() => setDateFilter(key)} style={{
                  flexShrink: 0, padding: '5px 12px', borderRadius: 100,
                  background: dateFilter === key ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.1)',
                  color: dateFilter === key ? 'var(--green-dark)' : 'rgba(255,255,255,0.8)',
                  border: `1px solid ${dateFilter === key ? 'transparent' : 'rgba(255,255,255,0.2)'}`,
                  font: 'inherit', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                }}>
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSortAsc(v => !v)}
              title={sortAsc ? 'Dal più vecchio' : 'Dal più recente'}
              style={{ flexShrink: 0, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
            >
              <ArrowUpDown size={15} />
            </button>
          </div>
        </div>

        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ width: 24, height: 24, border: '3px solid var(--border)', borderTopColor: 'var(--green-main)', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
            </div>
          ) : loadError ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
              <FileText size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
              <p style={{ fontSize: 15, fontWeight: 500 }}>Errore nel caricamento</p>
              <p style={{ fontSize: 13, marginTop: 4, color: 'var(--red)' }}>{loadError}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
              {typeFilter === 'bookmarks'
                ? <><Star size={40} style={{ marginBottom: 12, opacity: 0.3 }} /><p style={{ fontSize: 15, fontWeight: 500 }}>Nessun preferito</p><p style={{ fontSize: 13, marginTop: 4 }}>Tocca ★ su un documento per salvarlo qui.</p></>
                : <><FileText size={40} style={{ marginBottom: 12, opacity: 0.3 }} /><p style={{ fontSize: 15, fontWeight: 500 }}>Nessun documento</p><p style={{ fontSize: 13, marginTop: 4 }}>Il tuo dietista non ha ancora condiviso documenti.</p></>
              }
            </div>
          ) : filtered.map(doc => {
            const meta = TYPE_META[doc.type] || TYPE_META.document
            const docIsNew = isNew(doc, lastSeen)
            const isBookmarked = bookmarks.has(doc.id)
            return (
              <div key={doc.id} style={{ position: 'relative' }}>
                {docIsNew && (
                  <span style={{ position: 'absolute', top: -6, left: 14, zIndex: 1, background: '#f59e0b', color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100 }}>
                    NUOVO
                  </span>
                )}
                <button onClick={() => setSelected(doc)} style={{ width: '100%', background: 'white', border: `1px solid ${docIsNew ? '#fcd34d' : 'var(--border-light)'}`, borderRadius: 'var(--r-lg)', padding: '14px 14px 14px 18px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', font: 'inherit', textAlign: 'left', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ width: 46, height: 46, borderRadius: 14, background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: meta.color, flexShrink: 0 }}>
                    {meta.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.title}</p>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: meta.color, fontWeight: 500 }}>{meta.label}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Calendar size={10} />{new Date(doc.created_at).toLocaleDateString('it-IT')}
                      </span>
                    </div>
                    {doc.tags && doc.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: 4, marginTop: 5, flexWrap: 'wrap' }}>
                        {doc.tags.slice(0, 3).map(t => <span key={t} className="badge badge-green" style={{ fontSize: 10, padding: '2px 8px' }}>{t}</span>)}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    {doc.file_url && (
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        onClick={e => e.stopPropagation()}
                        title="Scarica PDF"
                        style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-main)', textDecoration: 'none' }}
                      >
                        <Download size={14} />
                      </a>
                    )}
                    <button
                      onClick={e => { e.stopPropagation(); toggleBookmark(doc.id) }}
                      title={isBookmarked ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
                      style={{ width: 32, height: 32, borderRadius: 8, background: isBookmarked ? '#fff4e6' : 'var(--surface-2)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isBookmarked ? '#f0922b' : 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      {isBookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                    </button>
                  </div>
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {selected && (
        <DocModal
          doc={selected}
          onClose={() => setSelected(null)}
          bookmarked={bookmarks.has(selected.id)}
          onToggleBookmark={toggleBookmark}
        />
      )}
    </>
  )
}
