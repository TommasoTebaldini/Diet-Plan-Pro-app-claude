import { useState, useEffect, useCallback } from 'react'
import patientViewRaw from '../assets/patientViewHtml.js'
import { CONSIGLI_BASE } from '../data/consigliBase.js'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { FileText, Download, Calendar, Utensils, Apple, Heart, Bookmark, BookmarkCheck, ArrowUpDown, Star, Printer, BookOpen } from 'lucide-react'

// ─── Document type metadata ───────────────────────────────────────────────────
const TYPE_META = {
  diet:          { label: 'Piano alimentare',       icon: <Utensils size={18} />, color: '#1a7f5a', bg: '#e6f5ee' },
  dieta:         { label: 'Piano alimentare',       icon: <Utensils size={18} />, color: '#1a7f5a', bg: '#e6f5ee' },
  piano:         { label: 'Piano alimentare',       icon: <Utensils size={18} />, color: '#1a7f5a', bg: '#e6f5ee' },
  chetogenica:   { label: 'Dieta Chetogenica',      icon: <Utensils size={18} />, color: '#0891b2', bg: '#ecfeff' },
  renale:        { label: 'Dieta Renale',           icon: <Utensils size={18} />, color: '#0891b2', bg: '#ecfeff' },
  diabete:       { label: 'Diabete',                icon: <Utensils size={18} />, color: '#0891b2', bg: '#ecfeff' },
  advice:        { label: 'Consiglio nutrizionale', icon: <Heart size={18} />,    color: '#e05a5a', bg: '#fff0f0' },
  consiglio:     { label: 'Consiglio nutrizionale', icon: <Heart size={18} />,    color: '#e05a5a', bg: '#fff0f0' },
  pediatria:     { label: 'Pediatria',              icon: <Heart size={18} />,    color: '#e05a5a', bg: '#fff0f0' },
  disfagia:      { label: 'Disfagia',               icon: <Heart size={18} />,    color: '#e05a5a', bg: '#fff0f0' },
  pancreas:      { label: 'Pancreas',               icon: <Heart size={18} />,    color: '#e05a5a', bg: '#fff0f0' },
  sport:         { label: 'Nutrizione Sportiva',    icon: <Heart size={18} />,    color: '#e05a5a', bg: '#fff0f0' },
  questionario:  { label: 'Questionario',           icon: <FileText size={18} />, color: '#7c3aed', bg: '#f5f3ff' },
  dca:           { label: 'Sessione DCA',           icon: <FileText size={18} />, color: '#7c3aed', bg: '#f5f3ff' },
  document:      { label: 'Documento',              icon: <FileText size={18} />, color: '#3b82f6', bg: '#eff6ff' },
  referto:       { label: 'Referto',                icon: <FileText size={18} />, color: '#3b82f6', bg: '#eff6ff' },
  education:     { label: 'Materiale educativo',    icon: <BookOpen size={18} />, color: '#8b5cf6', bg: '#f5f3ff' },
  educazione:    { label: 'Materiale educativo',    icon: <BookOpen size={18} />, color: '#8b5cf6', bg: '#f5f3ff' },
  ristorazione:  { label: 'Menu ristorazione',      icon: <Utensils size={18} />, color: '#0891b2', bg: '#ecfeff' },
  recipe:        { label: 'Ricetta',                icon: <Apple size={18} />,    color: '#f0922b', bg: '#fff4e6' },
  ricetta:       { label: 'Ricetta',                icon: <Apple size={18} />,    color: '#f0922b', bg: '#fff4e6' },
}

const DATE_FILTERS = [
  { key: 'all',   label: 'Sempre' },
  { key: 'week',  label: 'Settimana' },
  { key: 'month', label: 'Mese' },
  { key: 'year',  label: 'Anno' },
]

const DOCS_EPOCH = '1970-01-01T00:00:00Z'

function isNew(doc, lastSeen) {
  return new Date(doc.created_at) > new Date(lastSeen)
}

// ─── Tipo mapping: normalizza chiavi interne → tipi di patient-view.html ─────
const TIPO_MAP = {
  diet:      'piano',
  advice:    'consiglio',
  education: 'educazione',
  recipe:    'ricetta',
  document:  'documento',
}

// ─── Replica esatta di buildStampaHTML da NutriPlan-Pro/consigli.html ─────────
// Genera l'HTML di stampa per un consiglio nutrizionale, identico al sito dietista.
function buildConsiglioPrintHTML(doc) {
  const dati = (doc.dati_raw && typeof doc.dati_raw === 'object') ? doc.dati_raw : {}

  // Se il dietista ha già salvato lo stampa_html, usalo direttamente
  if (dati.stampa_html) return dati.stampa_html

  // Altrimenti, costruiscilo da CONSIGLI_BASE
  const base = CONSIGLI_BASE.find(c => c.id === dati.consiglio_id) || {}
  const c = {
    emoji:       base.emoji       || '💊',
    nome:        dati.consiglio_nome || base.nome || doc.title || '',
    colore:      base.colore      || '#1a7f5a',
    ok:          (dati.ok?.length   ? dati.ok   : base.ok)   || [],
    no:          (dati.no?.length   ? dati.no   : base.no)   || [],
    mod:         (dati.mod?.length  ? dati.mod  : base.mod)  || [],
    pratici:     (dati.pratici?.length  ? dati.pratici  : base.pratici)  || [],
    avvisi:      (dati.avvisi?.length   ? dati.avvisi   : base.avvisi)   || [],
    pasti:       dati.pasti        || base.pasti        || '',
    porzioni:    dati.porzioni     || base.porzioni     || '',
    idratazione: dati.idratazione  || base.idratazione  || '',
    nota:        base.nota         || '',
  }
  const notePaziente = dati.note_paziente || ''

  const foodPill = (f, col, bg) =>
    `<span style="display:inline-block;padding:3px 10px;border-radius:10px;font-size:11.5px;font-weight:500;margin:3px;background:${bg};color:${col}">${f}</span>`

  const okPills    = c.ok.map(f    => foodPill(f, '#065F46', '#D1FAE5')).join('')
  const noPills    = c.no.map(f    => foodPill(f, '#991B1B', '#FEE2E2')).join('')
  const modPills   = c.mod.map(f   => foodPill(f, '#92400E', '#FEF3C7')).join('')
  const praticiHtml = c.pratici.map(p =>
    `<li style="padding:5px 0;border-bottom:1px solid #E2E8F0;font-size:12pt;color:#334155">→ ${p}</li>`).join('')
  const avvisiHtml = c.avvisi.map(a =>
    `<div style="padding:5px 8px;border-bottom:1px solid #FEE2E2;font-size:11pt;color:#991B1B">⚠️ ${a}</div>`).join('')
  const noteHtml = notePaziente
    ? `<div style="background:#FFF7ED;border-left:4px solid #F59E0B;border-radius:6px;padding:10px 14px;font-size:10pt;color:#78350F;margin-bottom:14px;line-height:1.6;white-space:pre-wrap"><b>✏️ Note specifiche per il paziente:</b><br>${notePaziente}</div>`
    : ''

  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Consigli Nutrizionali — ${c.nome}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1E293B; font-size: 11pt; line-height: 1.5; padding: 1.5cm 2cm 2.5cm; }
  @media screen { body { padding: 20px; } }
  .header { background: ${c.colore}; color: white; padding: 16px 20px; border-radius: 10px; margin-bottom: 16px; display: flex; align-items: center; gap: 14px; }
  .header h1 { font-size: 20pt; font-weight: 700; }
  .header .emoji { font-size: 32pt; }
  .header .subtitle { font-size: 10pt; opacity: .8; margin-top: 4px; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 14px; }
  @media (max-width: 500px) { .info-grid { grid-template-columns: 1fr; } .alimenti-grid { grid-template-columns: 1fr !important; } }
  .info-box { background: #F8FAFC; border-radius: 8px; padding: 10px 12px; border-left: 3px solid ${c.colore}; }
  .info-label { font-size: 9pt; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 4px; }
  .info-val { font-size: 11pt; font-weight: 700; color: #1E293B; }
  .nota { background: #EFF6FF; border-left: 4px solid #3B82F6; border-radius: 6px; padding: 10px 14px; font-size: 10pt; color: #1E3A5F; margin-bottom: 14px; line-height: 1.6; }
  .section-title { font-size: 11pt; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: .8px; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 2px solid #E2E8F0; }
  .food-grid { margin-bottom: 14px; }
  .alimenti-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }
  .avvisi-box { background: #FEF2F2; border-radius: 8px; padding: 12px; margin-top: 10px; border: 1.5px solid #FEE2E2; }
  .footer { margin-top: 20px; padding-top: 10px; border-top: 1px solid #E2E8F0; font-size: 9pt; color: #94A3B8; display: flex; justify-content: space-between; }
  ul { list-style: none; padding: 0; }
</style>
</head>
<body>
  <div class="header">
    <span class="emoji">${c.emoji}</span>
    <div>
      <h1>${c.nome}</h1>
      <div class="subtitle">Consigli Nutrizionali · DietPlan Pro</div>
    </div>
  </div>

  <div class="info-grid">
    <div class="info-box"><div class="info-label">🍽️ Pasti/die</div><div class="info-val">${c.pasti || '—'}</div></div>
    <div class="info-box"><div class="info-label">🥣 Porzioni</div><div class="info-val">${c.porzioni || '—'}</div></div>
    <div class="info-box"><div class="info-label">💧 Idratazione</div><div class="info-val">${c.idratazione || '—'}</div></div>
  </div>

  ${c.nota ? `<div class="nota">📚 ${c.nota}</div>` : ''}
  ${noteHtml}

  <div class="alimenti-grid">
    <div>
      <div class="section-title">✅ Alimenti Consigliati</div>
      <div class="food-grid">${okPills}</div>
    </div>
    <div>
      <div class="section-title">❌ Da Evitare / Limitare</div>
      <div class="food-grid">${noPills}</div>
    </div>
  </div>

  ${modPills ? `<div style="margin-bottom:14px"><div class="section-title">⚠️ Consumare con Moderazione</div><div class="food-grid">${modPills}</div></div>` : ''}

  ${praticiHtml ? `<div style="margin-bottom:14px"><div class="section-title">💡 Consigli Pratici</div><ul>${praticiHtml}</ul></div>` : ''}

  ${avvisiHtml ? `<div class="avvisi-box"><div class="section-title" style="color:#991B1B;border-color:#FEE2E2">🚨 Avvertenze</div>${avvisiHtml}</div>` : ''}

  <div class="footer">
    <span>DietPlan Pro · Consigli Nutrizionali</span>
  </div>
</body>
</html>`
}

// Costruisce l'HTML di patient-view.html con i dati del documento iniettati.
// Il file è già bundlato in patientViewRaw — nessuna rete, nessun rewrite Vercel.
function buildPatientViewHtml(doc, withPrint = false) {
  const tipoRaw = (doc.tipo || doc.type || '').toLowerCase().trim()
  let   tipo    = TIPO_MAP[tipoRaw] || tipoRaw
  const nota    = doc.nota || doc.title || ''

  let dati = {}
  if (doc.dati_raw) {
    try {
      dati = typeof doc.dati_raw === 'string' ? JSON.parse(doc.dati_raw) : (doc.dati_raw || {})
    } catch { dati = {} }
  }
  if (doc.meals_data) {
    try {
      const m = typeof doc.meals_data === 'string' ? JSON.parse(doc.meals_data) : doc.meals_data
      if (Array.isArray(m)) dati = { ...dati, meals: m }
    } catch { /* ignore */ }
  }

  // Fallback: se non ci sono dati strutturati ma c'è contenuto testuale, usalo come descrizione
  const hasStructuredData = dati.meals || dati.giorni || dati.consiglio_id ||
    dati.consiglio_nome || dati.valutazione || dati.paziente || dati.calcolo ||
    dati.descrizione || dati.indicazioni
  if (!hasStructuredData && doc.content) {
    dati.descrizione = doc.content
    // Per documenti di tipo "piano" senza dati pasti, mostra come documento generico
    if (tipo === 'piano' || tipo === 'dieta') tipo = 'documento'
  }

  const dataB64   = btoa(encodeURIComponent(JSON.stringify(dati)))
  let   paramsStr = `tipo=${encodeURIComponent(tipo)}&nota=${encodeURIComponent(nota)}&data=${dataB64}`
  if (withPrint) paramsStr += '&print=1'

  console.log('[buildPatientViewHtml] tipo:', tipo, '| nota:', nota, '| hasStructured:', !!hasStructuredData, '| datiKeys:', Object.keys(dati))

  const result = patientViewRaw.replace(
    /const params\s*=\s*new URLSearchParams\(location\.search\)/,
    `const params = new URLSearchParams(${JSON.stringify(paramsStr)})`
  )
  const replaced = result !== patientViewRaw
  console.log('[buildPatientViewHtml] regex replaced:', replaced, '| html length:', result.length)
  return result
}

// ─── Stampa: apre una nuova finestra con l'HTML del documento ─────────────────
function handlePrint(doc) {
  try {
    const tipo = (doc.tipo || doc.type || '').toLowerCase().trim()
    const isConsiglio = tipo === 'consiglio' || tipo === 'advice'
    const html = isConsiglio ? buildConsiglioPrintHTML(doc) : buildPatientViewHtml(doc, true)
    const win  = window.open('', '_blank')
    if (!win) { alert('Abilita i popup per stampare il documento.'); return }
    win.document.write(html)
    win.document.close()
    if (!isConsiglio) win.onload = () => win.print()
  } catch (err) {
    console.error('[handlePrint]', err)
  }
}

// ─── DocModal: mostra il documento in un iframe (layout identico al sito dietista) ──
function DocModal({ doc, onClose, bookmarked, onToggleBookmark, onPrint }) {
  const [iframeHtml, setIframeHtml] = useState(null)
  const [error, setError]           = useState(null)

  useEffect(() => {
    setIframeHtml(null)
    setError(null)
    if (!doc || doc.file_url) return
    try {
      const tipo = (doc.tipo || doc.type || '').toLowerCase().trim()
      const isConsiglio = tipo === 'consiglio' || tipo === 'advice'
      setIframeHtml(isConsiglio ? buildConsiglioPrintHTML(doc) : buildPatientViewHtml(doc))
    } catch (err) {
      console.error('[DocModal]', err)
      setError(err.message)
    }
  }, [doc?.id])

  if (!doc) return null
  const meta = TYPE_META[doc.type] || TYPE_META.document

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', flexDirection: 'column', background: 'white' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg, #0d5c3a, #1a7f5a)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,.15)' }}>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 20, flexShrink: 0 }}>←</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, margin: 0 }}>{meta.label}</p>
          <h2 style={{ color: 'white', fontSize: 17, fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.title}</h2>
        </div>
        {!doc.file_url && (
          <button onClick={() => onPrint(doc)} title="Stampa documento"
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', flexShrink: 0 }}>
            <Printer size={18} />
          </button>
        )}
        <button onClick={() => onToggleBookmark(doc.id)}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', flexShrink: 0 }}>
          {bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>

      {/* Content */}
      {doc.file_url ? (
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
          <p style={{ marginBottom: 16, color: '#666' }}>Documento allegato</p>
          <a href={doc.file_url} target="_blank" rel="noopener noreferrer" download
            style={{ background: '#1a7f5a', color: 'white', padding: '12px 24px', borderRadius: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Download size={16} />Scarica documento
          </a>
        </div>
      ) : error ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <p style={{ color: '#ef4444', fontSize: 14, textAlign: 'center' }}>{error}</p>
        </div>
      ) : iframeHtml ? (
        <iframe
          srcDoc={iframeHtml}
          style={{ flex: 1, width: '100%', border: 'none', display: 'block' }}
          title={doc.title}
          sandbox="allow-scripts allow-popups"
        />
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 24, height: 24, border: '3px solid #e5e7eb', borderTopColor: '#1a7f5a', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        </div>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function DocumentsPage() {
  const { user } = useAuth()
  const [docs,       setDocs]       = useState([])
  const [loading,    setLoading]    = useState(true)
  const [loadError,  setLoadError]  = useState(null)
  const [typeFilter, setTypeFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [sortAsc,    setSortAsc]    = useState(false)
  const [selected,   setSelected]   = useState(null)
  const [bookmarks,  setBookmarks]  = useState(() => {
    try {
      const raw = localStorage.getItem(`doc_bookmarks_${user?.id}`)
      return raw ? new Set(JSON.parse(raw)) : new Set()
    } catch { return new Set() }
  })
  const [lastSeen] = useState(
    () => localStorage.getItem(`docs_last_seen_${user?.id}`) || DOCS_EPOCH
  )

  // ── Carica i documenti dal DB ────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      setLoadError(null)
      const allDocs = []

      try {
        // 1. Cartella del paziente
        const { data: link } = await supabase
          .from('patient_dietitian')
          .select('cartella_id')
          .eq('patient_id', user.id)
          .maybeSingle()

        const cartellaId = link?.cartella_id
        console.log('[Docs] patient_dietitian link:', link, '| cartellaId:', cartellaId)

        if (cartellaId) {
          // 2a. Note specialistiche visibili al paziente
          const { data: notes, error: notesErr } = await supabase
            .from('note_specialistiche')
            .select('id, tipo, nota, dati, created_at')
            .eq('cartella_id', cartellaId)
            .eq('visible_to_patient', true)
            .order('created_at', { ascending: false })
          console.log('[Docs] note_specialistiche:', notes?.length, '| error:', notesErr?.message)

          for (const n of notes || []) {
            const tipo = (n.tipo || '').toLowerCase().trim()

            const TYPE_KEYS = new Set([
              'diet','dieta','piano','chetogenica','renale','diabete',
              'advice','consiglio','ristorazione','pediatria','disfagia',
              'pancreas','sport','questionario','dca','document','referto',
              'education','educazione','recipe','ricetta',
            ])
            const TIPO_TO_KEY = {
              dieta:'diet', piano:'diet',
              consiglio:'consiglio', questionario:'questionario', dca:'dca',
              diabete:'diabete', chetogenica:'chetogenica', renale:'renale',
              referto:'referto', ricetta:'recipe', educazione:'education',
              nota:'document',
            }
            const type = TYPE_KEYS.has(tipo) ? tipo : (TIPO_TO_KEY[tipo] || tipo || 'document')

            let datiParsed = null
            let mealsData  = null
            let content    = ''

            if (n.dati) {
              let obj = n.dati
              if (typeof obj === 'string') { try { obj = JSON.parse(obj) } catch { obj = {} } }
              datiParsed = obj
              content    = obj.content || obj.contenuto || obj.testo || obj.descrizione || obj.text || ''
              if (obj.meals || obj.giorni) mealsData = obj.meals || obj.giorni
            }

            // Per i consigli, arricchisci con i dati completi da CONSIGLI_BASE se mancano ok/no/mod
            if (tipo === 'consiglio' && datiParsed?.consiglio_id && !datiParsed.ok?.length) {
              const base = CONSIGLI_BASE.find(c => c.id === datiParsed.consiglio_id)
              if (base) {
                datiParsed = {
                  ...datiParsed,
                  ok: base.ok, no: base.no, mod: base.mod,
                  pratici: base.pratici, avvisi: base.avvisi,
                  pasti: base.pasti, porzioni: base.porzioni, idratazione: base.idratazione,
                }
              }
            }

            const titleFromDati = datiParsed?.titolo || datiParsed?.nome || datiParsed?.consiglio_nome || ''
            const title = n.nota || titleFromDati || (tipo ? tipo.charAt(0).toUpperCase() + tipo.slice(1) : 'Documento')

            allDocs.push({
              id:          `note_${n.id}`,
              title,
              type,
              source:      'note',
              tipo:        n.tipo,
              nota:        n.nota,
              content,
              dati_raw:    datiParsed || n.dati,
              meals_data:  mealsData,
              file_url:    datiParsed?.file_url || datiParsed?.pdf_url || null,
              tags:        datiParsed?.tags || [],
              visible:     true,
              published_at: n.created_at,
              created_at:  n.created_at,
            })
          }

          // 2b. Piani alimentari visibili al paziente
          const { data: piani, error: pianiErr } = await supabase
            .from('piani')
            .select('id, nome, data_piano, meals, saved_at')
            .eq('cartella_id', cartellaId)
            .eq('visible_to_patient', true)
            .order('saved_at', { ascending: false })
          console.log('[Docs] piani:', piani?.length, '| error:', pianiErr?.message)

          for (const p of piani || []) {
            allDocs.push({
              id:          `piano_${p.id}`,
              title:       p.nome || 'Piano alimentare',
              type:        'diet',
              source:      'piano',
              tipo:        'piano',
              nota:        p.nome || 'Piano alimentare',
              content:     p.data_piano || '',
              dati_raw:    null,
              meals_data:  p.meals,
              file_url:    null,
              tags:        [],
              visible:     true,
              published_at: p.saved_at,
              created_at:  p.saved_at,
            })
          }
        }

        // 3. Fallback: patient_documents diretti
        const { data: patientDocs, error: pdErr } = await supabase
          .from('patient_documents')
          .select('*')
          .eq('patient_id', user.id)
          .eq('visible', true)
          .order('created_at', { ascending: false })
        console.log('[Docs] patient_documents:', patientDocs?.length, '| error:', pdErr?.message)
        if (patientDocs?.length) console.log('[Docs] patient_documents[0]:', JSON.stringify(patientDocs[0]))

        for (const d of patientDocs || []) {
          allDocs.push({ ...d, published_at: d.published_at || d.created_at })
        }

      } catch (e) {
        console.error('Documents load error:', e)
        setLoadError(e.message)
      }

      console.log('[Docs] total allDocs:', allDocs.length, allDocs.map(d => ({ id: d.id, type: d.type, tipo: d.tipo, hasContent: !!d.content, hasDatiRaw: !!d.dati_raw, hasMeals: !!d.meals_data })))
      setDocs(allDocs)
      setLoading(false)
    }
    load()
  }, [user.id])

  const toggleBookmark = useCallback((docId) => {
    setBookmarks(prev => {
      const next = new Set(prev)
      if (next.has(docId)) next.delete(docId)
      else                  next.add(docId)
      try { localStorage.setItem(`doc_bookmarks_${user.id}`, JSON.stringify([...next])) } catch { /* ignore */ }
      return next
    })
  }, [user.id])

  const getDateThreshold = () => {
    const now = new Date()
    if (dateFilter === 'week')  { now.setDate(now.getDate() - 7);       return now }
    if (dateFilter === 'month') { now.setMonth(now.getMonth() - 1);     return now }
    if (dateFilter === 'year')  { now.setFullYear(now.getFullYear()-1);  return now }
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

          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, WebkitOverflowScrolling: 'touch' }}>
            {types.map(t => (
              <button key={t} onClick={() => setTypeFilter(t)} style={{
                flexShrink: 0, padding: '7px 14px', borderRadius: 100,
                background: typeFilter === t ? 'white' : 'rgba(255,255,255,0.15)',
                color:      typeFilter === t ? 'var(--green-main)' : 'white',
                border: 'none', font: 'inherit', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                {t === 'bookmarks' && <Star size={12} fill={typeFilter === 'bookmarks' ? 'var(--green-main)' : 'white'} />}
                {t === 'all' ? 'Tutti' : t === 'bookmarks' ? 'Preferiti' : TYPE_META[t]?.label || t}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', flex: 1, WebkitOverflowScrolling: 'touch' }}>
              {DATE_FILTERS.map(({ key, label }) => (
                <button key={key} onClick={() => setDateFilter(key)} style={{
                  flexShrink: 0, padding: '5px 12px', borderRadius: 100,
                  background: dateFilter === key ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.1)',
                  color:      dateFilter === key ? 'var(--green-dark)'  : 'rgba(255,255,255,0.8)',
                  border: `1px solid ${dateFilter === key ? 'transparent' : 'rgba(255,255,255,0.2)'}`,
                  font: 'inherit', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                }}>
                  {label}
                </button>
              ))}
            </div>
            <button onClick={() => setSortAsc(v => !v)}
              style={{ flexShrink: 0, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
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
            const meta        = TYPE_META[doc.type] || TYPE_META.document
            const docIsNew    = isNew(doc, lastSeen)
            const isBookmarked = bookmarks.has(doc.id)
            return (
              <div key={doc.id} style={{ position: 'relative' }}>
                {docIsNew && (
                  <span style={{ position: 'absolute', top: -6, left: 14, zIndex: 1, background: '#f59e0b', color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100 }}>NUOVO</span>
                )}
                <button onClick={() => setSelected(doc)} style={{
                  width: '100%', background: 'white',
                  border: `1px solid ${docIsNew ? '#fcd34d' : 'var(--border-light)'}`,
                  borderRadius: 'var(--r-lg)', padding: '14px 14px 14px 18px',
                  display: 'flex', alignItems: 'center', gap: 12,
                  cursor: 'pointer', font: 'inherit', textAlign: 'left', boxShadow: 'var(--shadow-sm)',
                }}>
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
                    {doc.tags?.length > 0 && (
                      <div style={{ display: 'flex', gap: 4, marginTop: 5, flexWrap: 'wrap' }}>
                        {doc.tags.slice(0, 3).map(t => <span key={t} className="badge badge-green" style={{ fontSize: 10, padding: '2px 8px' }}>{t}</span>)}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    {doc.file_url && (
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer" download
                        onClick={e => e.stopPropagation()} title="Scarica PDF"
                        style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-main)', textDecoration: 'none' }}>
                        <Download size={14} />
                      </a>
                    )}
                    <button onClick={e => { e.stopPropagation(); toggleBookmark(doc.id) }}
                      title={isBookmarked ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
                      style={{ width: 32, height: 32, borderRadius: 8, background: isBookmarked ? '#fff4e6' : 'var(--surface-2)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isBookmarked ? '#f0922b' : 'var(--text-muted)', cursor: 'pointer' }}>
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
          onPrint={handlePrint}
        />
      )}
    </>
  )
}
