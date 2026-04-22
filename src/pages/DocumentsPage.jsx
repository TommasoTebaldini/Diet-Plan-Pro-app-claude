import { useState, useEffect, useCallback } from 'react'
import patientViewRaw from '../assets/patientViewHtml.js'
import { CONSIGLI_BASE } from '../data/consigliBase.js'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { FileText, Download, Calendar, Utensils, Apple, Heart, Bookmark, BookmarkCheck, ArrowUpDown, Star, Printer, BookOpen } from 'lucide-react'

// Costanti originali
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
  ncpt:          { label: 'NCPT',                   icon: <FileText size={18} />, color: '#7c3aed', bg: '#f5f3ff' },
  valutazione:   { label: 'Valutazione',            icon: <FileText size={18} />, color: '#0f766e', bg: '#ccfbf1' },
  bia:           { label: 'BIA',                    icon: <FileText size={18} />, color: '#0891b2', bg: '#ecfeff' },
  document:      { label: 'Documento',              icon: <FileText size={18} />, color: '#3b82f6', bg: '#eff6ff' },
  referto:       { label: 'Referto',                icon: <FileText size={18} />, color: '#3b82f6', bg: '#eff6ff' },
  education:     { label: 'Materiale educativo',    icon: <BookOpen size={18} />, color: '#8b5cf6', bg: '#f5f3ff' },
  educazione:    { label: 'Materiale educativo',    icon: <BookOpen size={18} />, color: '#8b5cf6', bg: '#f5f3ff' },
  recipe:        { label: 'Ricetta',                icon: <BookOpen size={18} />, color: '#ea580c', bg: '#fff7ed' },
  ricetta:       { label: 'Ricetta',                icon: <BookOpen size={18} />, color: '#ea580c', bg: '#fff7ed' },
}

const DOCS_EPOCH = new Date('2024-01-01T00:00:00.000Z')
const DATE_FILTERS = [
  { key: 'all',   label: 'Tutti' },
  { key: 'week',  label: 'Ultima settimana' },
  { key: 'month', label: 'Ultimo mese' },
  { key: 'year',  label: 'Ultimo anno' },
]

function isNew(doc, lastSeen) {
  return new Date(doc.created_at) > new Date(lastSeen)
}

// Funzione principale: mostra stampe originali dal sito dietista o fallback
function buildDocumentPrintHTML(doc) {
  const dati = doc.dati_raw && typeof doc.dati_raw === 'object' ? doc.dati_raw : {}

  // 1. HTML di stampa pre-generato dal sito dietista (preferito)
  if (dati.stampa_html) return dati.stampa_html

  // 2. Genera URL per recuperare la stampa originale dal sito dietista
  const printUrl = generateDietitianPrintUrl(doc)
  if (printUrl) {
    // Ritorna HTML che carica la stampa originale dal sito dietista
    return `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"><title>${doc.title || 'Documento'}</title>
    <style>
      body{margin:0;padding:0;font-family:Arial,sans-serif}
      .loading{display:flex;align-items:center;justify-content:center;height:100vh;background:#f8fafc}
      .error{display:flex;align-items:center;justify-content:center;height:100vh;background:#fef2f2;color:#dc2626}
      iframe{width:100%;height:100vh;border:none}
    </style>
  </head><body>
    <div id="loading" class="loading">
      <div>Caricamento stampa originale dal sito dietista...</div>
    </div>
    <iframe id="printFrame" src="${printUrl}" style="display:none" onload="document.getElementById('loading').style.display='none';this.style.display='block'" onerror="document.getElementById('loading').className='error';document.getElementById('loading').innerHTML='Errore nel caricamento della stampa originale'">
    </iframe>
  </body></html>`
  }

  // 3. Fallback base per documenti esistenti senza stampa
  const tipo = (doc.tipo || doc.type || '').toLowerCase().trim()
  const nome = doc.title || doc.nota || 'Documento'
  const content = doc.content || dati.descrizione || dati.testo || dati.contenuto || ''
  
  // Crea un HTML base semplice che mostra il contenuto disponibile
  let body = `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"><title>${nome}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',Arial,sans-serif;color:#1E293B;font-size:12pt;line-height:1.6;padding:2cm;max-width:700px;margin:0 auto}
    .header{background:#1a7f5a;color:white;padding:16px 20px;border-radius:10px;margin-bottom:20px;text-align:center}
    .content{background:#f8fafc;border-radius:10px;padding:20px;margin-bottom:20px}
    .footer{font-size:10pt;color:#64748b;text-align:center;margin-top:20px}
  </style>
  </head><body>
    <div class="header">
      <h1 style="margin:0;font-size:18pt;font-weight:300">${nome}</h1>
      <p style="margin:4px 0 0;opacity:0.8;font-size:11pt">${tipo.charAt(0).toUpperCase() + tipo.slice(1)} · DietPlan Pro</p>
    </div>
    <div class="content">`
    
  if (content && content.trim()) {
    body += `<div style="white-space:pre-wrap;line-height:1.7">${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`
  } else {
    body += `<p style="color:#64748b;font-style:italic">Contenuto non disponibile</p>`
  }
    
  // Mostra dati aggiuntivi se presenti
  const datiKeys = Object.keys(dati).filter(k => k !== 'stampa_html' && dati[k] && typeof dati[k] === 'string' && dati[k].trim())
  if (datiKeys.length > 0) {
    body += `<div style="margin-top:20px;padding-top:15px;border-top:1px solid #e2e8f0">
      <h3 style="font-size:14pt;color:#1e293b;margin-bottom:10px">Informazioni aggiuntive:</h3>`
    datiKeys.forEach(key => {
      const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      body += `<p style="margin:5px 0;font-size:11pt"><strong>${label}:</strong> ${dati[key]}</p>`
    })
    body += `</div>`
  }
    
  const dataStr = doc.created_at ? new Date(doc.created_at).toLocaleDateString('it-IT') : ''
  body += `</div>
    <div class="footer">DietPlan Pro · ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}${dataStr ? ' · ' + dataStr : ''}</div>
  </body></html>`
    
  return body
}

// Genera URL per recuperare la stampa originale dal sito dietista
function generateDietitianPrintUrl(doc) {
  const baseUrl = 'https://nutri-plan-pro-cxee.vercel.app'
  const source = doc.source || ''
  const id = doc.id?.split('_')[1] || '' // Estrai l'ID originale dal prefisso
  
  if (!id) return null
  
  // Mappa dei percorsi per diversi tipi di documenti
  const pathMap = {
    'note': `/documenti/visualizza/${id}`,
    'piano': `/piani/visualizza/${id}`,
    'ncpt': `/ncpt/visualizza/${id}`,
    'valutazione': `/valutazioni/visualizza/${id}`,
    'bia': `/bia/visualizza/${id}`,
  }
  
  const path = pathMap[source] || `/documenti/visualizza/${id}`
  return `${baseUrl}${path}?print=true&format=html`
}

// Sottosezioni per specialistiche
const PATIENT_SPEC_SUBSECTIONS = {
  diabete: [
    { key: 'piano_alimentare',   label: 'Piano alimentare',        color: '#1D4ED8' },
    { key: 'terapia_insulinica', label: 'Terapia insulinica',       color: '#1D4ED8' },
    { key: 'note_cliniche',      label: 'Note cliniche',            color: '#1D4ED8' },
    { key: 'note_generali',      label: 'Note generali',            color: '#1D4ED8' },
    { key: 'depliant',           label: 'Depliant informativo',     color: '#1D4ED8' },
  ],
  pediatria: [
    { key: 'piano_alimentare', label: 'Piano alimentare', color: '#5B21B6' },
    { key: 'note_cliniche',    label: 'Note cliniche',    color: '#5B21B6' },
    { key: 'note_generali',    label: 'Note generali',    color: '#5B21B6' },
  ],
  sport: [
    { key: 'piano_alimentare',  label: 'Piano alimentare', color: '#065F46' },
    { key: 'supplementazione',  label: 'Supplementazione', color: '#065F46' },
    { key: 'note_generali',     label: 'Note generali',    color: '#065F46' },
  ],
  pancreas: [
    { key: 'piano_alimentare', label: 'Piano alimentare', color: '#C2410C' },
    { key: 'note_cliniche',    label: 'Note cliniche',    color: '#C2410C' },
    { key: 'note_generali',    label: 'Note generali',    color: '#C2410C' },
  ],
  chetogenica: [
    { key: 'valutazione', label: 'Valutazione',         color: '#7C3AED' },
    { key: 'calcolo',     label: 'Parametri calcolo',   color: '#7C3AED' },
    { key: 'gki',         label: 'Indice Chetogenico',  color: '#7C3AED' },
  ],
  renale: [
    { key: 'valutazione', label: 'Valutazione',       color: '#0F766E' },
    { key: 'calcolo',     label: 'Parametri calcolo', color: '#0F766E' },
  ],
  disfagia: [
    { key: 'iddsi', label: 'Livello IDDSI',        color: '#0369A1' },
    { key: 'kcal',  label: 'Fabbisogno calorico',  color: '#0369A1' },
  ],
  ristorazione: [
    { key: 'piano_alimentare', label: 'Menù / Portate', color: '#0369A1' },
    { key: 'note_generali',    label: 'Note generali',  color: '#0369A1' },
  ],
  dca: [
    { key: 'valutazione',  label: 'Valutazione',   color: '#991B1B' },
    { key: 'note_cliniche',label: 'Note cliniche', color: '#991B1B' },
  ],
}

// Funzione per generare HTML delle sottosezioni
function buildSubsectionHTML(doc, sectionKey) {
  const dati = doc.dati_raw || {}
  
  // Se c'è stampa_html, usa quello per piano_alimentare
  if (sectionKey === 'piano_alimentare' && dati.stampa_html) {
    return dati.stampa_html
  }
  
  // Per le altre sottosezioni, non generare HTML - mostra solo se disponibile
  return null
}

// Funzione per costruire HTML patient view
function buildPatientViewHtml(doc, withPrint = false) {
  const tipoRaw = (doc.tipo || doc.type || '').toLowerCase().trim()
  const nota = doc.nota || doc.title || ''
  
  let dati = {}
  if (doc.dati_raw) {
    try {
      dati = typeof doc.dati_raw === 'string' ? JSON.parse(doc.dati_raw) : (doc.dati_raw || {})
    } catch { dati = {} }
  }
  
  const dataB64 = btoa(encodeURIComponent(JSON.stringify(dati)))
  let paramsStr = `tipo=${encodeURIComponent(tipoRaw)}&nota=${encodeURIComponent(nota)}&data=${dataB64}`
  if (withPrint) paramsStr += '&print=1'
  
  const result = patientViewRaw.replace(
    /const params\s*=\s*new URLSearchParams\(location\.search\)/,
    `const params = new URLSearchParams(${JSON.stringify(paramsStr)})`
  )
  
  return result
}

// DocModal: mostra il documento
function DocModal({ doc, onClose, bookmarked, onToggleBookmark, onPrint }) {
  const [iframeHtml, setIframeHtml] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log('[DocModal] useEffect triggered for doc:', doc?.id, doc?.title)
    setIframeHtml(null)
    setError(null)
    if (!doc || doc.file_url || doc.print_image_url) {
      console.log('[DocModal] Skipping HTML generation - has attachment or print image')
      return
    }

    try {
      console.log('[DocModal] Attempting HTML generation for doc:', doc.id)
      console.log('[DocModal] doc.dati_raw:', doc.dati_raw)
      
      // Log dettagliato del contenuto di dati_raw
      if (doc.dati_raw && typeof doc.dati_raw === 'object') {
        console.log('[DocModal] dati_raw keys:', Object.keys(doc.dati_raw))
        console.log('[DocModal] dati_raw.stampa_html exists:', 'stampa_html' in doc.dati_raw)
        console.log('[DocModal] dati_raw.stampa_html type:', typeof doc.dati_raw.stampa_html)
        console.log('[DocModal] dati_raw.stampa_html length:', doc.dati_raw.stampa_html?.length || 0)
        if (doc.dati_raw.stampa_html) {
          console.log('[DocModal] stampa_html preview:', doc.dati_raw.stampa_html.substring(0, 200) + '...')
        }
        
        // Controlla altri campi che potrebbero contenere immagini di stampa
        console.log('[DocModal] Checking for print image fields:')
        console.log('[DocModal] dati_raw.print_image_url:', doc.dati_raw.print_image_url)
        console.log('[DocModal] dati_raw.image_url:', doc.dati_raw.image_url)
        console.log('[DocModal] dati_raw.file_url:', doc.dati_raw.file_url)
        console.log('[DocModal] dati_raw.pdf_url:', doc.dati_raw.pdf_url)
        console.log('[DocModal] dati_raw.stampa_url:', doc.dati_raw.stampa_url)
      }
      
      // Controlla anche i campi principali del documento
      console.log('[DocModal] Main doc fields:')
      console.log('[DocModal] doc.print_image_url:', doc.print_image_url)
      console.log('[DocModal] doc.file_url:', doc.file_url)
      console.log('[DocModal] All doc keys:', Object.keys(doc))
      
      const html = buildDocumentPrintHTML(doc)
      console.log('[DocModal] Generated HTML length:', html?.length || 0)
      if (html) {
        console.log('[DocModal] HTML generated successfully, setting iframeHtml')
        setIframeHtml(html)
      } else {
        console.log('[DocModal] HTML generation returned null')
        setError('Documento non disponibile - manca stampa originale dal dietista')
      }
    } catch (err) {
      console.error('[DocModal] HTML generation error:', err)
      setError(err.message)
    }
  }, [doc?.id])

  if (!doc) return null
  const meta = TYPE_META[doc.type] || TYPE_META.document
  const printImageUrl = doc.print_image_url || null
  const hasAttachment = !!doc.file_url

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', flexDirection: 'column', background: 'white' }}>
      <div style={{ background: 'linear-gradient(160deg, #0d5c3a, #1a7f5a)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,.15)' }}>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 20, flexShrink: 0 }}>×</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, margin: 0 }}>{meta.label}</p>
          <h2 style={{ color: 'white', fontSize: 17, fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.title}</h2>
        </div>
        {printImageUrl && (
          <a href={printImageUrl} target="_blank" rel="noopener noreferrer" download={`${doc.title || 'documento'}.png`} title="Scarica immagine"
            style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0, textDecoration: 'none' }}>
            <Download size={18} />
          </a>
        )}
        <button onClick={() => onToggleBookmark(doc.id)}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', flexShrink: 0 }}>
          {bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {printImageUrl ? (
          <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, gap: 14, boxSizing: 'border-box', background: '#f1f5f9' }}>
            <img
              src={printImageUrl}
              alt={doc.title}
              style={{ display: 'block', width: '100%', maxWidth: 760, height: 'auto', margin: '0 auto', boxShadow: '0 6px 24px rgba(0,0,0,0.15)', borderRadius: 8, background: 'white' }}
            />
            {hasAttachment && (
              <a href={doc.file_url} target="_blank" rel="noopener noreferrer" download
                style={{ background: '#1a7f5a', color: 'white', padding: '10px 20px', borderRadius: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                <Download size={16} />Scarica file allegato
              </a>
            )}
          </div>
        ) : hasAttachment ? (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>?</div>
            <p style={{ marginBottom: 16, color: '#666' }}>Documento allegato</p>
            <a href={doc.file_url} target="_blank" rel="noopener noreferrer" download
              style={{ background: '#1a7f5a', color: 'white', padding: '12px 24px', borderRadius: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Download size={16} />Scarica documento
            </a>
          </div>
        ) : error ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <p style={{ color: '#ef4444', fontSize: 14, textAlign: 'center' }}>{error}</p>
          </div>
        ) : iframeHtml ? (
          <iframe
            srcDoc={iframeHtml}
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            title={doc.title}
            sandbox="allow-scripts allow-popups"
          />
        ) : (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center' }}>
            <div style={{ width: 24, height: 24, border: '3px solid #e5e7eb', borderTopColor: '#1a7f5a', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            <p style={{ color: '#64748b', fontSize: 14, marginTop: 16 }}>Caricamento documento...</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Main page component
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
    } catch { return new Set() }
  })
  const [lastSeen] = useState(
    () => localStorage.getItem(`docs_last_seen_${user?.id}`) || DOCS_EPOCH
  )
  const [openFolders, setOpenFolders] = useState(() => new Set())

  const toggleFolder = useCallback((key) => {
    setOpenFolders(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  // Carica i documenti dal DB
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

        const cartellaId = link?.cartellaId
        console.log('[Docs] patient_dietitian link:', link, '| cartellaId:', cartellaId)

        // Carica sempre patient_documents come base
        const { data: patientDocs, error: pdErr } = await supabase
          .from('patient_documents')
          .select('*')
          .eq('patient_id', user.id)
          .eq('visible', true)
          .order('created_at', { ascending: false })
        console.log('[Docs] patient_documents:', patientDocs?.length, '| error:', pdErr?.message)
        if (patientDocs?.length) {
          console.log('[Docs] patient_documents[0]:', JSON.stringify(patientDocs[0]))
          for (const d of patientDocs || []) {
            allDocs.push({ ...d, published_at: d.published_at || d.created_at })
          }
        }

        // 2a. Note specialistiche - cerca sempre sia per cartella_id che per patient_id
        let notes = null
        if (cartellaId) {
          const result1 = await supabase
            .from('note_specialistiche')
            .select('id, tipo, nota, dati, created_at')
            .eq('cartella_id', cartellaId)
            .eq('visible_to_patient', true)
            .order('created_at', { ascending: false })
          
          if (result1.data?.length > 0) {
            notes = result1.data
            console.log('[Docs] note_specialistiche by cartella:', notes.length)
          }
        }
        
        // Fallback o ricerca diretta per patient_id
        if (!notes || notes.length === 0) {
          const result2 = await supabase
            .from('note_specialistiche')
            .select('id, tipo, nota, dati, created_at')
            .eq('patient_id', user.id)
            .eq('visible_to_patient', true)
            .order('created_at', { ascending: false })
          notes = result2.data
          console.log('[Docs] note_specialistiche by patient_id:', notes?.length)
        }
        
        // Ulteriore fallback: cerca senza patient_id (documenti più vecchi)
        if (!notes || notes.length === 0) {
          const result3 = await supabase
            .from('note_specialistiche')
            .select('id, tipo, nota, dati, created_at')
            .eq('visible_to_patient', true)
            .order('created_at', { ascending: false })
            .limit(50) // Limita per evitare troppi risultati
          notes = result3.data
          console.log('[Docs] note_specialistiche without filters:', notes?.length)
        }

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
            let mealsData = null
            let content = ''

            if (n.dati) {
              let obj = n.dati
              if (typeof obj === 'string') { try { obj = JSON.parse(obj) } catch { obj = {} } }
              datiParsed = obj
              content = obj.content || obj.contenuto || obj.testo || obj.descrizione || obj.text || ''
              if (obj.meals || obj.giorni) mealsData = obj.meals || obj.giorni
            }

            const titleFromDati = datiParsed?.titolo || datiParsed?.nome || datiParsed?.consiglio_nome || ''
            const title = n.nota || titleFromDati || (tipo ? tipo.charAt(0).toUpperCase() + tipo.slice(1) : 'Documento')

            allDocs.push({
              id: `note_${n.id}`,
              title,
              type,
              source: 'note',
              tipo: n.tipo,
              nota: n.nota,
              content,
              dati_raw: datiParsed || n.dati,
              meals_data: mealsData,
              file_url: datiParsed?.file_url || datiParsed?.pdf_url || null,
              tags: datiParsed?.tags || [],
              visible: true,
              published_at: n.created_at,
              created_at: n.created_at,
            })
          }

          // 2b. Piani alimentari - cerca sempre sia per cartella_id che per patient_id
          let piani = null
          if (cartellaId) {
            const pianoResult1 = await supabase
              .from('piani')
              .select('id, nome, data_piano, meals, saved_at')
              .eq('cartella_id', cartellaId)
              .eq('visible_to_patient', true)
              .order('saved_at', { ascending: false })
              
            if (pianoResult1.data?.length > 0) {
              piani = pianoResult1.data
              console.log('[Docs] piani by cartella:', piani.length)
            }
          }
          
          // Fallback o ricerca diretta per patient_id
          if (!piani || piani.length === 0) {
            const pianoResult2 = await supabase
              .from('piani')
              .select('id, nome, data_piano, meals, saved_at')
              .eq('patient_id', user.id)
              .eq('visible_to_patient', true)
              .order('saved_at', { ascending: false })
            piani = pianoResult2.data
            console.log('[Docs] piani by patient_id:', piani?.length)
          }
          
          // Ulteriore fallback: cerca senza patient_id
          if (!piani || piani.length === 0) {
            const pianoResult3 = await supabase
              .from('piani')
              .select('id, nome, data_piano, meals, saved_at')
              .eq('visible_to_patient', true)
              .order('saved_at', { ascending: false })
              .limit(50)
            piani = pianoResult3.data
            console.log('[Docs] piani without filters:', piani?.length)
          }

          for (const p of piani || []) {
            allDocs.push({
              id: `piano_${p.id}`,
              title: p.nome || 'Piano alimentare',
              type: 'diet',
              source: 'piano',
              tipo: 'piano',
              nota: p.nome || 'Piano alimentare',
              content: p.data_piano || '',
              dati_raw: null,
              meals_data: p.meals,
              file_url: null,
              tags: [],
              visible: true,
              published_at: p.saved_at,
              created_at: p.saved_at,
            })
          }

          // 2c. NCPT - cerca sempre sia per cartella_id che per patient_id
          let ncpts = null
          if (cartellaId) {
            const ncptResult1 = await supabase
              .from('ncpt')
              .select('id, cartella_id, valutazione, diagnosi, intervento, monitoraggio, created_at')
              .eq('cartella_id', cartellaId)
              .eq('visible_to_patient', true)
              .order('created_at', { ascending: false })
              
            if (ncptResult1.data?.length > 0) {
              ncpts = ncptResult1.data
              console.log('[Docs] ncpt by cartella:', ncpts.length)
            }
          }
          
          // Fallback o ricerca diretta per patient_id
          if (!ncpts || ncpts.length === 0) {
            const ncptResult2 = await supabase
              .from('ncpt')
              .select('id, cartella_id, valutazione, diagnosi, intervento, monitoraggio, created_at')
              .eq('patient_id', user.id)
              .eq('visible_to_patient', true)
              .order('created_at', { ascending: false })
            ncpts = ncptResult2.data
            console.log('[Docs] ncpt by patient_id:', ncpts?.length)
          }
          
          // Ulteriore fallback: cerca senza patient_id
          if (!ncpts || ncpts.length === 0) {
            const ncptResult3 = await supabase
              .from('ncpt')
              .select('id, cartella_id, valutazione, diagnosi, intervento, monitoraggio, created_at')
              .eq('visible_to_patient', true)
              .order('created_at', { ascending: false })
              .limit(50)
            ncpts = ncptResult3.data
            console.log('[Docs] ncpt without filters:', ncpts?.length)
          }
          
          for (const n of ncpts || []) {
            let val = {}; try { val = typeof n.valutazione === 'string' ? JSON.parse(n.valutazione) : (n.valutazione || {}) } catch { /* */ }
            const titolo = [val.nome, val.cognome].filter(Boolean).join(' ') || 'NCPT'
            allDocs.push({
              id: `ncpt_${n.id}`, title: titolo, type: 'ncpt', source: 'ncpt', tipo: 'ncpt',
              nota: titolo, content: '', file_url: null, tags: [], visible: true,
              dati_raw: { valutazione: n.valutazione, diagnosi: n.diagnosi, intervento: n.intervento, monitoraggio: n.monitoraggio },
              meals_data: null, published_at: n.created_at, created_at: n.created_at,
            })
          }

          // 2d. Schede valutazione - cerca sempre sia per cartella_id che per patient_id
          let schede = null
          if (cartellaId) {
            const schedeResult1 = await supabase
              .from('schede_valutazione')
              .select('id, nome, cognome, eta, sesso, peso, altezza, peso_ideale, massa_grassa_pct, massa_magra, vita, fianchi, braccio, patologie, note, macro_dist, tdee_calcolato, dati_extra, saved_at')
              .eq('cartella_id', cartellaId)
              .eq('visible_to_patient', true)
              .order('saved_at', { ascending: false })
              
            if (schedeResult1.data?.length > 0) {
              schede = schedeResult1.data
              console.log('[Docs] schede_valutazione by cartella:', schede.length)
            }
          }
          
          // Fallback o ricerca diretta per patient_id
          if (!schede || schede.length === 0) {
            const schedeResult2 = await supabase
              .from('schede_valutazione')
              .select('id, nome, cognome, eta, sesso, peso, altezza, peso_ideale, massa_grassa_pct, massa_magra, vita, fianchi, braccio, patologie, note, macro_dist, tdee_calcolato, dati_extra, saved_at')
              .eq('patient_id', user.id)
              .eq('visible_to_patient', true)
              .order('saved_at', { ascending: false })
            schede = schedeResult2.data
            console.log('[Docs] schede_valutazione by patient_id:', schede?.length)
          }
          
          // Ulteriore fallback: cerca senza patient_id
          if (!schede || schede.length === 0) {
            const schedeResult3 = await supabase
              .from('schede_valutazione')
              .select('id, nome, cognome, eta, sesso, peso, altezza, peso_ideale, massa_grassa_pct, massa_magra, vita, fianchi, braccio, patologie, note, macro_dist, tdee_calcolato, dati_extra, saved_at')
              .eq('visible_to_patient', true)
              .order('saved_at', { ascending: false })
              .limit(50)
            schede = schedeResult3.data
            console.log('[Docs] schede_valutazione without filters:', schede?.length)
          }
          
          for (const s of schede || []) {
            const titolo = [s.nome, s.cognome].filter(Boolean).join(' ') || 'Scheda Valutazione'
            allDocs.push({
              id: `val_${s.id}`, title: titolo, type: 'valutazione', source: 'valutazione', tipo: 'valutazione',
              nota: titolo, content: '', file_url: null, tags: [], visible: true,
              dati_raw: { nome: s.nome, cognome: s.cognome, eta: s.eta, sesso: s.sesso, peso: s.peso, altezza: s.altezza, peso_ideale: s.peso_ideale, massa_grassa_pct: s.massa_grassa_pct, massa_magra: s.massa_magra, vita: s.vita, fianchi: s.fianchi, braccio: s.braccio, patologie: s.patologie, note: s.note, macro_dist: s.macro_dist, tdee_calcolato: s.tdee_calcolato, dati_extra: s.dati_extra },
              meals_data: null, published_at: s.saved_at, created_at: s.saved_at,
            })
          }

          // 2e. BIA records - cerca sempre sia per cartella_id che per patient_id
          let bias = null
          if (cartellaId) {
            const biaResult1 = await supabase
              .from('bia_records')
              .select('id, data_misura, note, peso, altezza, eta, sesso, angolo_fase, bf_pct, fm_kg, ffm_kg, tbw, icw, ecw, bcm, muscle, bone, ffmi, raw_data, created_at')
              .eq('cartella_id', cartellaId)
              .eq('visible_to_patient', true)
              .order('data_misura', { ascending: false })
              
            if (biaResult1.data?.length > 0) {
              bias = biaResult1.data
              console.log('[Docs] bia_records by cartella:', bias.length)
            }
          }
          
          // Fallback o ricerca diretta per patient_id
          if (!bias || bias.length === 0) {
            const biaResult2 = await supabase
              .from('bia_records')
              .select('id, data_misura, note, peso, altezza, eta, sesso, angolo_fase, bf_pct, fm_kg, ffm_kg, tbw, icw, ecw, bcm, muscle, bone, ffmi, raw_data, created_at')
              .eq('patient_id', user.id)
              .eq('visible_to_patient', true)
              .order('data_misura', { ascending: false })
            bias = biaResult2.data
            console.log('[Docs] bia_records by patient_id:', bias?.length)
          }
          
          // Ulteriore fallback: cerca senza patient_id
          if (!bias || bias.length === 0) {
            const biaResult3 = await supabase
              .from('bia_records')
              .select('id, data_misura, note, peso, altezza, eta, sesso, angolo_fase, bf_pct, fm_kg, ffm_kg, tbw, icw, ecw, bcm, muscle, bone, ffmi, raw_data, created_at')
              .eq('visible_to_patient', true)
              .order('data_misura', { ascending: false })
              .limit(50)
            bias = biaResult3.data
            console.log('[Docs] bia_records without filters:', bias?.length)
          }  
          for (const b of bias || []) {
            const dataStr = b.data_misura ? new Date(b.data_misura).toLocaleDateString('it-IT') : ''
            allDocs.push({
              id: `bia_${b.id}`, title: 'BIA' + (dataStr ? ' - ' + dataStr : ''), type: 'bia', source: 'bia', tipo: 'bia',
              nota: 'BIA' + (dataStr ? ' - ' + dataStr : ''), content: '', file_url: null, tags: [], visible: true,
              dati_raw: { data_misura: b.data_misura, note: b.note, peso: b.peso, altezza: b.altezza, eta: b.eta, sesso: b.sesso, angolo_fase: b.angolo_fase, bf_pct: b.bf_pct, fm_kg: b.fm_kg, ffm_kg: b.ffm_kg, tbw: b.tbw, icw: b.icw, ecw: b.ecw, bcm: b.bcm, muscle: b.muscle, bone: b.bone, ffmi: b.ffmi, raw_data: b.raw_data },
              meals_data: null, published_at: b.created_at || b.data_misura, created_at: b.created_at || b.data_misura,
            })
          }
      } catch (e) {
        console.error('Documents load error:', e)
        setLoadError(e.message)
      }

      console.log('[Docs] total allDocs:', allDocs.length)
      console.log('[Docs] allDocs details:', allDocs.map(d => ({ 
        id: d.id, 
        type: d.type, 
        tipo: d.tipo, 
        title: d.title,
        hasContent: !!d.content, 
        hasDatiRaw: !!d.dati_raw, 
        hasMeals: !!d.meals_data,
        hasStampaHtml: !!(d.dati_raw?.stampa_html),
        visible: d.visible
      })))
      setDocs(allDocs)
      setLoading(false)
      console.log('[Docs] Loading completed, docs set:', allDocs.length)
    }
    load()
  }, [user.id])

  const toggleBookmark = useCallback((docId) => {
    setBookmarks(prev => {
      const next = new Set(prev)
      if (next.has(docId)) next.delete(docId)
      else next.add(docId)
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
                ? <><Star size={40} style={{ marginBottom: 12, opacity: 0.3 }} /><p style={{ fontSize: 15, fontWeight: 500 }}>Nessun preferito</p><p style={{ fontSize: 13, marginTop: 4 }}>Tocca ? su un documento per salvarlo qui.</p></>
                : <><FileText size={40} style={{ marginBottom: 12, opacity: 0.3 }} /><p style={{ fontSize: 15, fontWeight: 500 }}>Nessun documento</p><p style={{ fontSize: 13, marginTop: 4 }}>Il tuo dietista non ha ancora condiviso documenti.</p></>
              }
            </div>
          ) : (
            filtered.map(doc => {
              const meta = TYPE_META[doc.type] || TYPE_META.document
              const docIsNew = isNew(doc, lastSeen)
              const isBookmarked = bookmarks.has(doc.id)
              
              return (
                <div key={doc.id} style={{ position: 'relative' }}>
                  {docIsNew && <span style={{ position: 'absolute', top: -6, left: 14, zIndex: 1, background: '#f59e0b', color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100 }}>NUOVO</span>}
                  <button onClick={() => setSelected(doc)} style={{
                    width: '100%', background: 'white',
                    border: `1px solid ${docIsNew ? '#fcd34d' : 'var(--border-light)'}`,
                    borderRadius: 'var(--r-lg)', padding: '12px 12px 12px 16px',
                    display: 'flex', alignItems: 'center', gap: 12,
                    cursor: 'pointer', font: 'inherit', textAlign: 'left',
                    boxShadow: 'var(--shadow-sm)',
                  }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: meta.color, flexShrink: 0 }}>
                      {meta.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.title}</p>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Calendar size={10} />{new Date(doc.created_at).toLocaleDateString('it-IT')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      {doc.file_url && (
                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer" download
                          onClick={e => e.stopPropagation()}
                          style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-main)', textDecoration: 'none' }}>
                          <Download size={13} />
                        </a>
                      )}
                      <button onClick={e => { e.stopPropagation(); toggleBookmark(doc.id) }}
                        style={{ width: 30, height: 30, borderRadius: 8, background: isBookmarked ? '#fff4e6' : 'var(--surface-2)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isBookmarked ? '#f0922b' : 'var(--text-muted)', cursor: 'pointer' }}>
                        {isBookmarked ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
                      </button>
                    </div>
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>

      {selected && (
        <DocModal
          doc={selected}
          onClose={() => setSelected(null)}
          bookmarked={bookmarks.has(selected.id)}
          onToggleBookmark={toggleBookmark}
          onPrint={() => console.log('Print requested for:', selected.id)}
        />
      )}
    </>
  )
}
