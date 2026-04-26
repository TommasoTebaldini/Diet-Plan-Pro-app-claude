import { useState, useEffect, useCallback } from 'react'
import patientViewRaw from '../assets/patientViewHtml.js'
import { CONSIGLI_BASE } from '../data/consigliBase.js'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { FileText, Download, Calendar, Utensils, Apple, Heart, Bookmark, BookmarkCheck, ArrowUpDown, Star, Printer, BookOpen, PenLine, CheckCircle2, XCircle } from 'lucide-react'

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
  ncpt:          { label: 'NCPT',                   icon: <FileText size={18} />, color: '#7c3aed', bg: '#f5f3ff' },
  valutazione:   { label: 'Valutazione',            icon: <FileText size={18} />, color: '#0f766e', bg: '#ccfbf1' },
  bia:           { label: 'BIA',                    icon: <FileText size={18} />, color: '#0891b2', bg: '#ecfeff' },
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

// ─── Shared HTML escape helper ───────────────────────────────────────────────
const _e = s => (s == null ? '' : String(s)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
const _nl2br = s => _e(s).replace(/\n/g,'<br>')

// Shared page wrapper — A4-safe, responsive on screen
function _pageWrap(title, inner) {
  return `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${_e(title)}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  body{font-family:'Segoe UI',Arial,sans-serif;color:#1E293B;font-size:11pt;line-height:1.5;padding:1.5cm 2cm 2.5cm}
  @media screen{body{padding:20px;max-width:760px;margin:0 auto}}
  .footer{margin-top:20px;padding-top:10px;border-top:1px solid #E2E8F0;font-size:9pt;color:#94A3B8;text-align:center}
</style></head><body>${inner}</body></html>`
}

// Meal card used by piano
function _mealCard(header, righe, notaMeal) {
  let h = `<div style="margin-bottom:12px;border-radius:10px;overflow:hidden;border:1.5px solid #E2E8F0;break-inside:avoid">`
  h += `<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 16px;background:linear-gradient(135deg,#0D9488,#10B981)">${header}</div>`
  righe.forEach(r => { h += r })
  if (notaMeal?.trim()) h += `<div style="padding:6px 16px;font-size:11.5px;color:#64748B;font-style:italic;background:#FFFBEB">📝 ${_e(notaMeal)}</div>`
  return h + '</div>'
}

// ─── Piano alimentare (tabella piani — giorni con items strutturati) ──────────
function buildPianoPrintHTML(doc, giorni) {
  const nome = doc.title || doc.nota || 'Piano Alimentare'
  const isMulti = giorni.length > 1
  let body = `<div style="text-align:center;padding-bottom:14px;margin-bottom:16px;border-bottom:2px solid #E2E8F0">
    <div style="font-size:20pt;font-weight:700;color:#0F766E">🥗 ${_e(nome)}</div>
    <div style="font-size:10pt;color:#94A3B8;margin-top:4px">Piano Alimentare · DietPlan Pro</div>
  </div>`

  giorni.forEach(giorno => {
    const mealList = (giorno.meals || []).filter(m => m.items?.some(it => it.nome?.trim()))
    if (!mealList.length) return
    if (isMulti) body += `<div style="margin:14px 0 10px;padding:8px 16px;background:#1E293B;border-radius:8px;font-size:14px;font-weight:700;color:white">📅 ${_e(giorno.nome)}</div>`
    mealList.forEach(meal => {
      const items = (meal.items || []).filter(it => it.nome?.trim())
      const hdrInner = `<div style="display:flex;align-items:center;gap:10px">
        ${meal.emoji ? `<span style="font-size:18px">${_e(meal.emoji)}</span>` : ''}
        <span style="font-size:14px;font-weight:700;color:white">${_e(meal.nome)}</span>
      </div>`
      const righe = items.flatMap(item => {
        const misura = item.misura ? ` <span style="color:#94A3B8;font-size:10px">(${_e(item.misura)})</span>` : ''
        const r = [`<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 16px;border-bottom:1px solid #F1F5F9">
          <span style="font-size:13px">${_e(item.nome)}${misura}</span>
          ${item.qt ? `<span style="font-size:13px;font-weight:700;color:#0EA5E9;padding-left:12px">${_e(item.qt)} g</span>` : ''}
        </div>`]
        ;(item.altPrint || []).forEach(a => {
          r.push(`<div style="padding:5px 16px 5px 28px;background:#F0FDF4;border-bottom:1px solid #DCFCE7;font-size:11.5px;color:#15803D">↳ oppure: ${_e(a.nome)} — ${_e(a.qt)} g</div>`)
        })
        return r
      })
      body += _mealCard(hdrInner, righe, meal.note)
    })
  })

  body += `<div class="footer">DietPlan Pro · Piano Alimentare</div>`
  return _pageWrap(nome, body)
}

// ─── IDDSI data (mirror of NutriPlan-Pro disfagia.html) ──────────────────────
const _IDDSI_META = {
  1:{nome:'Leggermente Addensato',bg:'#9CA3AF'},2:{nome:'Moderatamente Addensato',bg:'#EC4899'},
  3:{nome:'Liquidizzato',bg:'#F59E0B'},4:{nome:'Frullato / Passato',bg:'#10B981'},
  5:{nome:'Tritato Umido',bg:'#EF4444'},6:{nome:'Morbido a Pezzi',bg:'#3B82F6'},
  7:{nome:'Facile da Masticare',bg:'#F97316'}
}
const _IDDSI_DIETE = {
  1:{kcal_base:1785,nota:'⚠️ Tutti i liquidi devono essere addensati con addensante certificato. ONS spesso necessari.',pasti:[
    {nome:'Colazione',emoji:'🌅',items:[{nome:'Latte intero + addensante',qt:300,unit:'mL',kcal:195},{nome:'Succo di arancia setacciato + addensante',qt:150,unit:'mL',kcal:60},{nome:'Maltodestrine in polvere',qt:40,unit:'g',kcal:155}]},
    {nome:'Spuntino Mattino',emoji:'🍊',items:[{nome:'ONS liquido addensato (es. Ensure Plus)',qt:200,unit:'mL',kcal:300}]},
    {nome:'Pranzo',emoji:'🍽️',items:[{nome:'Vellutata di verdure passata al setaccio fine',qt:350,unit:'mL',kcal:170},{nome:'Frullato di pollo passato al setaccio',qt:80,unit:'g',kcal:100},{nome:'Olio extra vergine di oliva',qt:15,unit:'g',kcal:135},{nome:'Succo di pesca + addensante',qt:100,unit:'mL',kcal:40}]},
    {nome:'Spuntino Pomeriggio',emoji:'☕',items:[{nome:'Yogurt bianco intero setacciato',qt:125,unit:'g',kcal:100}]},
    {nome:'Cena',emoji:'🌙',items:[{nome:'Crema di patate + brodo addensato',qt:350,unit:'mL',kcal:200},{nome:'Frullato di merluzzo passato al setaccio',qt:80,unit:'g',kcal:80},{nome:'Olio extra vergine di oliva',qt:15,unit:'g',kcal:135},{nome:'Budino / crema fluida dolce',qt:100,unit:'g',kcal:115}]}
  ]},
  2:{kcal_base:1807,nota:'⚠️ Consistenza "Nectare" — addensare tutte le bevande. Monitorare idratazione.',pasti:[
    {nome:'Colazione',emoji:'🌅',items:[{nome:'Latte intero + addensante',qt:300,unit:'mL',kcal:195},{nome:'Semolino cotto fluido addensato',qt:80,unit:'g',kcal:197},{nome:'Miele',qt:10,unit:'g',kcal:30}]},
    {nome:'Spuntino Mattino',emoji:'🍊',items:[{nome:'ONS denso addensato (es. Fortisip Compact)',qt:200,unit:'mL',kcal:300}]},
    {nome:'Pranzo',emoji:'🍽️',items:[{nome:'Vellutata di zucca passata finissima',qt:350,unit:'mL',kcal:175},{nome:'Carne (tacchino) frullata passata al setaccio',qt:80,unit:'g',kcal:100},{nome:'Olio extra vergine di oliva',qt:15,unit:'g',kcal:135},{nome:'Composta di frutta passata finissima',qt:100,unit:'g',kcal:50}]},
    {nome:'Spuntino Pomeriggio',emoji:'☕',items:[{nome:'Yogurt greco setacciato',qt:125,unit:'g',kcal:100}]},
    {nome:'Cena',emoji:'🌙',items:[{nome:'Crema di legumi passata (lenticchie/piselli)',qt:300,unit:'mL',kcal:200},{nome:'Pesce (sogliola) frullato passato al setaccio',qt:80,unit:'g',kcal:80},{nome:'Olio extra vergine di oliva',qt:15,unit:'g',kcal:135},{nome:'Crema dolce alla vaniglia',qt:100,unit:'g',kcal:110}]}
  ]},
  3:{kcal_base:1804,nota:'Consistenza "Miele" — frullare tutto finemente. Eliminare grumi, fibre dure, bucce.',pasti:[
    {nome:'Colazione',emoji:'🌅',items:[{nome:'Latte intero con cereali frullati setacciati',qt:300,unit:'mL',kcal:220},{nome:'Banana frullata fine (liquidizzata)',qt:100,unit:'g',kcal:89},{nome:'Miele',qt:15,unit:'g',kcal:45}]},
    {nome:'Spuntino Mattino',emoji:'🍊',items:[{nome:'ONS crema (es. Ensure Plus Crema)',qt:200,unit:'mL',kcal:300}]},
    {nome:'Pranzo',emoji:'🍽️',items:[{nome:'Minestrone liquidizzato passato (senza bucce)',qt:400,unit:'mL',kcal:210},{nome:'Carne frullata (consistenza liquidizzata)',qt:80,unit:'g',kcal:100},{nome:'Olio extra vergine di oliva',qt:15,unit:'g',kcal:135},{nome:'Composta di frutta frullata finissima',qt:120,unit:'g',kcal:60}]},
    {nome:'Spuntino Pomeriggio',emoji:'☕',items:[{nome:'Yogurt cremoso intero',qt:125,unit:'g',kcal:100}]},
    {nome:'Cena',emoji:'🌙',items:[{nome:'Passata di legumi densa (ceci/lenticchie)',qt:300,unit:'mL',kcal:200},{nome:'Pesce frullato (liquidizzato, senza lische)',qt:80,unit:'g',kcal:80},{nome:'Olio extra vergine di oliva',qt:15,unit:'g',kcal:135},{nome:'Crema / budino denso',qt:120,unit:'g',kcal:130}]}
  ]},
  4:{kcal_base:1806,nota:'Consistenza "Budino" — no grumi, no fibre, no pezzi. Preparare tutto in purè omogeneo.',pasti:[
    {nome:'Colazione',emoji:'🌅',items:[{nome:'Porridge di farina di riso (latte + farina riso)',qt:250,unit:'g',kcal:280},{nome:'Yogurt greco cremoso',qt:100,unit:'g',kcal:80},{nome:'Miele',qt:15,unit:'g',kcal:45}]},
    {nome:'Spuntino Mattino',emoji:'🍊',items:[{nome:'Crema di frutta cotta frullata densa',qt:150,unit:'g',kcal:90},{nome:'Biscotti ammollati e frullati (senza grumi)',qt:30,unit:'g',kcal:135}]},
    {nome:'Pranzo',emoji:'🍽️',items:[{nome:'Purè di verdure miste (zucca, patata, carota)',qt:300,unit:'g',kcal:180},{nome:'Purè di pollo con besciamella morbida',qt:100,unit:'g',kcal:155},{nome:'Olio extra vergine di oliva',qt:10,unit:'g',kcal:90},{nome:'Purè di frutta cotta (mela/pera)',qt:100,unit:'g',kcal:60}]},
    {nome:'Spuntino Pomeriggio',emoji:'☕',items:[{nome:'Yogurt cremoso con frutta frullata',qt:150,unit:'g',kcal:130}]},
    {nome:'Cena',emoji:'🌙',items:[{nome:'Purè di patate morbido (senza grumi)',qt:200,unit:'g',kcal:170},{nome:'Purè di merluzzo al latte (senza lische)',qt:100,unit:'g',kcal:135},{nome:'Olio extra vergine di oliva',qt:10,unit:'g',kcal:90},{nome:'Crema pasticcera densa',qt:100,unit:'g',kcal:130}]}
  ]},
  5:{kcal_base:1753,nota:'Pezzi ≤ 4mm × 15mm, morbidi e umidi. Carne tritata fine con sugo; pesce sminuzzato.',pasti:[
    {nome:'Colazione',emoji:'🌅',items:[{nome:'Latte intero',qt:250,unit:'mL',kcal:163},{nome:'Pane morbido bagnato nel latte (senza crosta)',qt:40,unit:'g',kcal:100},{nome:'Miele',qt:15,unit:'g',kcal:45},{nome:'Budino morbido',qt:100,unit:'g',kcal:115}]},
    {nome:'Spuntino Mattino',emoji:'🍊',items:[{nome:'Yogurt greco con frutta matura tritata fine',qt:150,unit:'g',kcal:130}]},
    {nome:'Pranzo',emoji:'🍽️',items:[{nome:'Pastina in brodo (ben cotta, grana fine)',qt:80,unit:'g',kcal:285},{nome:'Carne macinata tenera in umido con sugo',qt:80,unit:'g',kcal:155},{nome:'Verdure cotte tenere a piccoli pezzi (≤4mm)',qt:100,unit:'g',kcal:60},{nome:'Olio extra vergine di oliva',qt:10,unit:'g',kcal:90}]},
    {nome:'Spuntino Pomeriggio',emoji:'☕',items:[{nome:'Crema / mousse di frutta morbida',qt:150,unit:'g',kcal:90}]},
    {nome:'Cena',emoji:'🌙',items:[{nome:'Riso stracotto in brodo (ben tenero)',qt:80,unit:'g',kcal:270},{nome:'Pesce sminuzzato in umido con salsa (≤4mm)',qt:100,unit:'g',kcal:120},{nome:'Carote / zucchine cotte a pezzetti (≤4mm)',qt:100,unit:'g',kcal:40},{nome:'Olio extra vergine di oliva',qt:10,unit:'g',kcal:90}]}
  ]},
  6:{kcal_base:1823,nota:'Pezzi ≤ 15mm × 15mm, morbidi, facilmente masticabili. Evitare pane croccante, carni dure, noci, vegetali crudi.',pasti:[
    {nome:'Colazione',emoji:'🌅',items:[{nome:'Latte intero',qt:250,unit:'mL',kcal:163},{nome:'Pane morbido (senza crosta dura)',qt:60,unit:'g',kcal:150},{nome:'Marmellata / confettura',qt:20,unit:'g',kcal:52},{nome:'Burro morbido',qt:10,unit:'g',kcal:74}]},
    {nome:'Spuntino Mattino',emoji:'🍊',items:[{nome:'Yogurt greco con frutta morbida a pezzi',qt:150,unit:'g',kcal:130}]},
    {nome:'Pranzo',emoji:'🍽️',items:[{nome:'Pasta ben cotta con sugo morbido',qt:80,unit:'g',kcal:284},{nome:'Pesce al forno morbido (merluzzo / orata)',qt:120,unit:'g',kcal:132},{nome:'Verdure cotte morbide a pezzi (≤15mm)',qt:150,unit:'g',kcal:60},{nome:'Olio extra vergine di oliva',qt:15,unit:'g',kcal:135}]},
    {nome:'Spuntino Pomeriggio',emoji:'☕',items:[{nome:'Frutta morbida matura (pesca, pera, banana)',qt:200,unit:'g',kcal:100}]},
    {nome:'Cena',emoji:'🌙',items:[{nome:'Riso ben cotto (risotto morbido)',qt:80,unit:'g',kcal:268},{nome:'Uova strapazzate morbide (2 uova)',qt:100,unit:'g',kcal:145},{nome:'Formaggio molle (ricotta / stracchino)',qt:50,unit:'g',kcal:130}]}
  ]},
  7:{kcal_base:1845,nota:'Dieta normale ma con esclusione di alimenti duri, croccanti, appiccicosi o difficili da masticare.',pasti:[
    {nome:'Colazione',emoji:'🌅',items:[{nome:'Latte intero',qt:250,unit:'mL',kcal:163},{nome:'Pane morbido / panino soffice (senza crosta dura)',qt:60,unit:'g',kcal:150},{nome:'Marmellata / confettura',qt:20,unit:'g',kcal:52},{nome:'Olio extra vergine di oliva',qt:10,unit:'g',kcal:90}]},
    {nome:'Spuntino Mattino',emoji:'🍊',items:[{nome:'Yogurt intero con frutta morbida',qt:150,unit:'g',kcal:130}]},
    {nome:'Pranzo',emoji:'🍽️',items:[{nome:'Pasta (formati morbidi: rigatoni, penne) ben cotta',qt:80,unit:'g',kcal:284},{nome:'Pollo / tacchino arrosto morbido (senza cartilagini)',qt:120,unit:'g',kcal:166},{nome:'Insalata tenera o verdure cotte',qt:150,unit:'g',kcal:30},{nome:'Olio extra vergine di oliva',qt:15,unit:'g',kcal:135}]},
    {nome:'Spuntino Pomeriggio',emoji:'☕',items:[{nome:'Frutta matura morbida (pesca, pera, banana, kiwi)',qt:200,unit:'g',kcal:100}]},
    {nome:'Cena',emoji:'🌙',items:[{nome:'Riso / pasta ben cotta',qt:70,unit:'g',kcal:233},{nome:'Pesce al forno (merluzzo, sogliola, salmone)',qt:120,unit:'g',kcal:132},{nome:'Verdure cotte morbide (zucchine, carote, spinaci)',qt:150,unit:'g',kcal:60},{nome:'Olio extra vergine di oliva',qt:15,unit:'g',kcal:135}]}
  ]}
}

// ─── Porta esatta di buildStampaSpecialisticaHTML da NutriPlan-Pro/js/utils.js ─
// Usato come fallback per tutti i documenti specialistici senza stampa_html pre-generato.
function buildStampaSpecialisticaFallback(doc, tipo, dati) {
  const LABELS = {
    diabete:'🩸 Diabete', pediatria:'👶 Pediatria', sport:'🏃 Nutrizione Sportiva',
    pancreas:'🫁 Pancreas', disfagia:'💧 Disfagia', dca:'🧠 Sessione DCA',
    ristorazione:'🍽️ Ristorazione', renale:'🫘 Nefropatia', chetogenica:'🥑 Chetogenica',
    ncpt:'📋 NCPT', questionario:'📝 Questionario', valutazione:'📊 Valutazione',
    education:'📚 Materiale Educativo', educazione:'📚 Materiale Educativo',
    referto:'📄 Referto', document:'📄 Documento', ricetta:'🍳 Ricetta', recipe:'🍳 Ricetta',
  }
  const COLORI = {
    diabete:'#3B82F6', pediatria:'#EC4899', sport:'#F97316', pancreas:'#8B5CF6',
    disfagia:'#06B6D4', dca:'#7C3AED', ristorazione:'#0F766E', renale:'#f97316',
    chetogenica:'#0891b2', ncpt:'#7c3aed', questionario:'#7c3aed', valutazione:'#0f766e',
    education:'#8b5cf6', educazione:'#8b5cf6',
  }
  const label  = LABELS[tipo]  || tipo.charAt(0).toUpperCase() + tipo.slice(1)
  const colore = COLORI[tipo]  || '#475569'
  const nome   = doc.title || doc.nota || label
  const piano  = dati.piano || {}

  const infoGrid = items => {
    const vis = items.filter(i => i.val)
    if (!vis.length) return ''
    let h = `<div style="display:grid;grid-template-columns:repeat(${Math.min(vis.length,3)},1fr);gap:10px;margin-bottom:14px">`
    vis.forEach(i => {
      h += `<div style="background:#F8FAFC;border-radius:8px;padding:10px 12px;border-left:3px solid ${colore}">
        <div style="font-size:9pt;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">${i.label}</div>
        <div style="font-size:11pt;font-weight:700;color:#1E293B">${_e(String(i.val))}</div>
      </div>`
    })
    return h + '</div>'
  }

  const wrapDoc = inner => `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"><title>${_e(nome)}</title>
<style>*{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:'DM Sans','Segoe UI',Arial,sans-serif;color:#1E293B;font-size:11pt;line-height:1.5;padding:1.5cm 2cm 2.5cm}
@media screen{body{padding:20px;max-width:760px;margin:0 auto}}</style>
</head><body>${inner}</body></html>`

  // ── PASTI_TIPI: layout identico a stampaCompattaSpecialistica ─────────────
  const PASTI_TIPI = ['diabete', 'pediatria', 'sport', 'pancreas', 'dca', 'renale']
  if (PASTI_TIPI.includes(tipo)) {
    const totKcal = parseFloat(piano.kcal)       || 0
    const totCho  = parseFloat(piano.cho_tot)    || 0
    const totProt = parseFloat(piano.prot_tot)   || (totKcal ? Math.round(totKcal * 0.15 / 4) : 0)
    const totFat  = parseFloat(piano.grassi_tot) || (totKcal ? Math.round(totKcal * 0.25 / 9) : 0)
    const pasti   = (piano.pasti || dati.pasti || []).filter(p => p.alimenti?.trim())
    const avgKcal = totKcal && pasti.length ? Math.round(totKcal / pasti.length) : 0

    let sub = ''
    if (tipo === 'diabete' && piano.tipo) sub = 'Tipo: ' + piano.tipo + (piano.insulina ? ' · Insulina: ' + piano.insulina : '')
    else if (tipo === 'sport' && (piano.sport || piano.obiettivo)) sub = piano.sport || piano.obiettivo
    else if (tipo === 'pancreas' && piano.enzima) sub = 'Enzima: ' + piano.enzima
    else if (tipo === 'renale') sub = 'Emodialisi — Giornata Senza Dialisi'

    const stats = [
      { val: totKcal || '—', lbl: 'KCAL TOTALI' },
      { val: totProt || '—', lbl: 'PROTEINE (G)' },
      { val: totCho  || '—', lbl: 'CARBOIDRATI (G)' },
      { val: totFat  || '—', lbl: 'GRASSI (G)' },
      { val: avgKcal || '—', lbl: 'KCAL/PASTO' },
    ]

    let b = `<div style="font-family:'DM Sans',sans-serif;max-width:700px;margin:0 auto;color:#1E293B">`
    b += `<div style="text-align:center;padding-bottom:12px;margin-bottom:14px;border-bottom:1.5px solid #E2E8F0">`
    b += `<div style="font-size:18px;font-weight:700;color:#0F766E">${_e(nome)}</div>`
    if (sub) b += `<div style="font-size:13px;color:#475569;margin-top:3px">${_e(sub)}</div>`
    b += `</div>`
    b += `<div style="display:flex;border:1.5px solid #CBD5E1;border-radius:10px;overflow:hidden;margin-bottom:18px">`
    stats.forEach((s, i) => {
      b += `<div style="flex:1;text-align:center;padding:12px 6px;${i < stats.length - 1 ? 'border-right:1.5px solid #CBD5E1' : ''}">`
      b += `<div style="font-size:20px;font-weight:700;color:#0EA5E9">${s.val}</div>`
      b += `<div style="font-size:9px;font-weight:600;color:#64748B;letter-spacing:.5px;margin-top:2px">${s.lbl}</div>`
      b += `</div>`
    })
    b += `</div>`
    if (piano.note_cliniche?.trim()) {
      b += `<div style="background:#EFF6FF;border-left:4px solid #3B82F6;border-radius:6px;padding:10px 14px;margin-bottom:14px;font-size:10pt;color:#1E3A5F;white-space:pre-wrap">📋 ${_e(piano.note_cliniche)}</div>`
    }
    pasti.forEach(pasto => {
      const energia = pasto.kcal ? `≈ ${pasto.kcal} kcal` : (pasto.cho ? `${pasto.cho} g CHO` : '')
      b += `<div style="margin-bottom:12px;border-radius:10px;overflow:hidden;border:1.5px solid #E2E8F0;break-inside:avoid">`
      b += `<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 16px;background:linear-gradient(135deg,#0D9488,#10B981);-webkit-print-color-adjust:exact;print-color-adjust:exact">`
      b += `<div style="display:flex;align-items:center;gap:10px">`
      if (pasto.emoji) b += `<span style="font-size:18px">${_e(pasto.emoji)}</span>`
      b += `<span style="font-size:14px;font-weight:700;color:white">${_e(pasto.nome || 'Pasto')}</span>`
      if (pasto.ora) b += `<span style="font-size:12px;color:rgba(255,255,255,.75)">${_e(pasto.ora)}</span>`
      b += `</div>`
      if (energia) b += `<span style="font-size:12px;color:rgba(255,255,255,.9);font-weight:600">${_e(energia)}</span>`
      b += `</div>`
      pasto.alimenti.split('\n').map(l => l.trim()).filter(Boolean).forEach(line => {
        b += `<div style="padding:8px 16px;border-bottom:1px solid #F1F5F9;font-size:13px;color:#1E293B">${_e(line)}</div>`
      })
      const noteText = (pasto.note?.trim()) || (pasto.cho && !pasto.kcal ? `CHO: ${pasto.cho} g` : '')
      if (noteText) b += `<div style="padding:6px 16px;font-size:11.5px;color:#64748B;font-style:italic;background:#FFFBEB">📝 ${_e(noteText)}</div>`
      b += `</div>`
    })
    if (piano.note_generali?.trim()) {
      b += `<div style="margin-top:10px;padding:10px 14px;background:#FFF7ED;border-radius:8px;font-size:12px;color:#7C2D12">⚠️ ${_e(piano.note_generali)}</div>`
    }
    b += `<div style="margin-top:20px;padding-top:10px;border-top:1px solid #E2E8F0;font-size:9pt;color:#94A3B8;text-align:center">DietPlan Pro · ${_e(label)}</div></div>`
    return wrapDoc(b)
  }

  // ── Disfagia: full IDDSI meal plan ───────────────────────────────────────
  if (tipo === 'disfagia' && dati.iddsi && _IDDSI_DIETE[dati.iddsi]) {
    const meta  = _IDDSI_META[dati.iddsi]  || { nome: 'Livello ' + dati.iddsi, bg: '#06B6D4' }
    const dieta = _IDDSI_DIETE[dati.iddsi]
    const targetKcal = parseFloat(dati.kcal) || dieta.kcal_base
    const scale = targetKcal / dieta.kcal_base
    let totKcal = 0
    dieta.pasti.forEach(p => { totKcal += p.items.reduce((s, it) => s + it.kcal, 0) })
    totKcal = Math.round(totKcal * scale)
    const avgKcal = dieta.pasti.length ? Math.round(totKcal / dieta.pasti.length) : 0
    const totProt = Math.round(totKcal * 0.16 / 4)
    const totCho  = Math.round(totKcal * 0.50 / 4)
    const totFat  = Math.round(totKcal * 0.34 / 9)

    let b = `<div style="font-family:'DM Sans',sans-serif;max-width:700px;margin:0 auto;color:#1E293B">`
    b += `<div style="text-align:center;padding-bottom:12px;margin-bottom:14px;border-bottom:1.5px solid #E2E8F0">`
    b += `<div style="font-size:18px;font-weight:700;color:#0F766E">${_e(nome)}</div>`
    b += `<div style="display:inline-flex;align-items:center;gap:8px;margin-top:6px;background:${meta.bg};color:white;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700">IDDSI ${_e(String(dati.iddsi))} · ${_e(meta.nome)}</div>`
    b += `</div>`
    const stats = [
      { val: totKcal || '—', lbl: 'KCAL TOTALI' },
      { val: totProt || '—', lbl: 'PROTEINE (G)' },
      { val: totCho  || '—', lbl: 'CARBOIDRATI (G)' },
      { val: totFat  || '—', lbl: 'GRASSI (G)' },
      { val: avgKcal || '—', lbl: 'KCAL/PASTO' },
    ]
    b += `<div style="display:flex;border:1.5px solid #CBD5E1;border-radius:10px;overflow:hidden;margin-bottom:18px">`
    stats.forEach((s, i) => {
      b += `<div style="flex:1;text-align:center;padding:12px 6px;${i < stats.length - 1 ? 'border-right:1.5px solid #CBD5E1' : ''}">`
      b += `<div style="font-size:20px;font-weight:700;color:#0EA5E9">${s.val}</div>`
      b += `<div style="font-size:9px;font-weight:600;color:#64748B;letter-spacing:.5px;margin-top:2px">${s.lbl}</div>`
      b += `</div>`
    })
    b += `</div>`
    dieta.pasti.forEach(pasto => {
      const pKcal = Math.round(pasto.items.reduce((s, it) => s + it.kcal, 0) * scale)
      b += `<div style="margin-bottom:12px;border-radius:10px;overflow:hidden;border:1.5px solid #E2E8F0;break-inside:avoid">`
      b += `<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 16px;background:linear-gradient(135deg,#0D9488,#10B981);-webkit-print-color-adjust:exact;print-color-adjust:exact">`
      b += `<div style="display:flex;align-items:center;gap:10px">`
      if (pasto.emoji) b += `<span style="font-size:18px">${pasto.emoji}</span>`
      b += `<span style="font-size:14px;font-weight:700;color:white">${_e(pasto.nome)}</span>`
      b += `</div>`
      b += `<span style="font-size:12px;color:rgba(255,255,255,.9);font-weight:600">≈ ${pKcal} kcal</span>`
      b += `</div>`
      pasto.items.forEach(item => {
        const qt = Math.round(item.qt * scale)
        b += `<div style="padding:8px 16px;border-bottom:1px solid #F1F5F9;font-size:13px;color:#1E293B">${_e(item.nome)} — ${qt} ${_e(item.unit)}</div>`
      })
      b += `</div>`
    })
    if (dieta.nota) b += `<div style="margin-top:10px;padding:10px 14px;background:#FFF7ED;border-radius:8px;font-size:12px;color:#7C2D12">${_e(dieta.nota)}</div>`
    b += `<div style="margin-top:20px;padding-top:10px;border-top:1px solid #E2E8F0;font-size:9pt;color:#94A3B8;text-align:center">DietPlan Pro · ${_e(label)}</div></div>`
    return wrapDoc(b)
  }

  let body = `<div style="background:${colore};color:white;padding:16px 20px;border-radius:10px;margin-bottom:16px;-webkit-print-color-adjust:exact;print-color-adjust:exact">
    <div style="font-size:18pt;font-weight:700">${_e(nome)}</div>
    <div style="font-size:10pt;opacity:.8;margin-top:4px">${_e(label)} · DietPlan Pro</div>
  </div>`

  // Info grid per chetogenica (dati.calcolo)
  if (tipo === 'chetogenica') {
    const c = dati.calcolo || {}
    if (c.peso || c.tipo || c.obiettivo || c.attivita) {
      body += infoGrid([
        { label:'⚖️ Peso',       val: c.peso    ? c.peso    + ' kg'   : '' },
        { label:'📏 Altezza',    val: c.altezza ? c.altezza + ' cm'   : '' },
        { label:'🎂 Età',        val: c.eta     ? c.eta     + ' anni' : '' },
        { label:'🚶 Attività',   val: c.attivita },
        { label:'🥑 Tipo dieta', val: c.tipo },
        { label:'🎯 Obiettivo',  val: c.obiettivo },
      ])
    }
    if (dati.gki?.glicemia || dati.gki?.chetoni) {
      body += infoGrid([
        { label:'🩸 Glicemia', val: dati.gki.glicemia ? dati.gki.glicemia + ' mg/dL'  : '' },
        { label:'🔬 Chetoni',  val: dati.gki.chetoni  ? dati.gki.chetoni  + ' mmol/L' : '' },
      ])
    }
  }

  // Note cliniche
  if (piano.note_cliniche?.trim()) {
    body += `<div style="background:#EFF6FF;border-left:4px solid #3B82F6;border-radius:6px;padding:10px 14px;margin-bottom:14px;font-size:10pt;color:#1E3A5F;white-space:pre-wrap">📋 ${_e(piano.note_cliniche)}</div>`
  }

  // Pasti (diabete, pediatria, sport, pancreas, renale con piano.pasti)
  const pasti = piano.pasti || dati.pasti || []
  pasti.filter(p => p.alimenti?.trim()).forEach(pasto => {
    const energia = pasto.kcal ? `≈ ${pasto.kcal} kcal` : (pasto.cho ? `${pasto.cho} g CHO` : (pasto.grassi ? `${pasto.grassi} g grassi` : ''))
    body += `<div style="margin-bottom:12px;border-radius:10px;overflow:hidden;border:1.5px solid #E2E8F0;break-inside:avoid">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 16px;background:linear-gradient(135deg,#0D9488,#10B981);-webkit-print-color-adjust:exact;print-color-adjust:exact">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:14px;font-weight:700;color:white">${_e(pasto.nome||'Pasto')}</span>
          ${pasto.ora ? `<span style="font-size:12px;color:rgba(255,255,255,.75)">${_e(pasto.ora)}</span>` : ''}
        </div>
        ${energia ? `<span style="font-size:12px;color:rgba(255,255,255,.9);font-weight:600">${_e(energia)}</span>` : ''}
      </div>`
    pasto.alimenti.split('\n').map(l => l.trim()).filter(Boolean).forEach(line => {
      body += `<div style="padding:8px 16px;border-bottom:1px solid #F1F5F9;font-size:13px;color:#1E293B">${_e(line)}</div>`
    })
    if (pasto.note?.trim()) body += `<div style="padding:6px 16px;font-size:11.5px;color:#64748B;font-style:italic;background:#FFFBEB">📝 ${_e(pasto.note)}</div>`
    body += `</div>`
  })

  // Portate per ristorazione
  const portate = piano.portate || []
  portate.filter(p => p.menu?.trim()).forEach(portata => {
    body += `<div style="margin-bottom:12px;border-radius:10px;overflow:hidden;border:1.5px solid #E2E8F0;break-inside:avoid">
      <div style="padding:10px 16px;background:linear-gradient(135deg,#0D9488,#10B981);-webkit-print-color-adjust:exact;print-color-adjust:exact;display:flex;align-items:center;justify-content:space-between">
        <span style="font-size:14px;font-weight:700;color:white">${_e(portata.nome||'Portata')}</span>
        ${portata.porzione ? `<span style="font-size:12px;color:rgba(255,255,255,.9)">${_e(portata.porzione)}</span>` : ''}
      </div>`
    portata.menu.split('\n').map(l => l.trim()).filter(Boolean).forEach(line => {
      body += `<div style="padding:8px 16px;border-bottom:1px solid #F1F5F9;font-size:13px">${_e(line)}</div>`
    })
    if (portata.note?.trim()) body += `<div style="padding:6px 16px;font-size:11.5px;color:#64748B;font-style:italic;background:#FFFBEB">📝 ${_e(portata.note)}</div>`
    body += `</div>`
  })

  if (piano.note_generali?.trim()) {
    body += `<div style="background:#FFF7ED;border-left:4px solid #F59E0B;border-radius:6px;padding:10px 14px;margin-top:10px;font-size:10pt;color:#78350F;white-space:pre-wrap">📌 ${_e(piano.note_generali)}</div>`
  }

  // NCPT — sezioni JSON annidate
  if (tipo === 'ncpt') {
    const renderSezNcpt = (titolo, jsonVal) => {
      if (!jsonVal) return ''
      let obj; try { obj = typeof jsonVal === 'string' ? JSON.parse(jsonVal) : jsonVal } catch { return '' }
      const entries = Object.entries(obj).filter(([k, v]) => v && String(v).trim() && !['cartella_id','user_id','obiettivi'].includes(k))
      if (!entries.length) return ''
      let s = `<div style="margin-bottom:16px">
        <div style="font-size:11pt;font-weight:700;color:#334155;text-transform:uppercase;letter-spacing:.8px;margin-bottom:8px;padding-bottom:4px;border-bottom:2px solid #E2E8F0">${titolo}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">`
      entries.forEach(([k, v]) => {
        const lbl = k.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())
        s += `<div style="background:#F8FAFC;border-radius:8px;padding:8px 12px;border-left:3px solid ${colore}">
          <div style="font-size:9pt;font-weight:700;color:#64748B;margin-bottom:2px">${_e(lbl)}</div>
          <div style="font-size:11pt;color:#1E293B">${_e(String(v))}</div>
        </div>`
      })
      return s + '</div></div>'
    }
    body += renderSezNcpt('👤 Valutazione', dati.valutazione)
    body += renderSezNcpt('🎯 Diagnosi', dati.diagnosi)
    body += renderSezNcpt('💊 Intervento', dati.intervento)
    body += renderSezNcpt('📈 Monitoraggio', dati.monitoraggio)
  }

  // Scheda Valutazione
  if (tipo === 'valutazione') {
    const d = dati
    const card = (lbl, val, unit='') => val != null && val !== '' && val !== null
      ? `<div style="background:#F8FAFC;border-radius:8px;padding:10px 12px;border-left:3px solid #0f766e">
          <div style="font-size:9pt;font-weight:700;color:#64748B;text-transform:uppercase;margin-bottom:2px">${lbl}</div>
          <div style="font-size:13px;color:#1E293B;font-weight:600">${_e(String(val))}${unit ? ' <span style="font-size:10px;color:#94A3B8">'+unit+'</span>' : ''}</div>
        </div>` : ''
    const section = (title, cards) => { const c = cards.filter(Boolean).join(''); return c ? `<div style="margin-bottom:14px"><div style="font-size:10pt;font-weight:700;color:#0f766e;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;padding-bottom:4px;border-bottom:2px solid #E2E8F0">${title}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">${c}</div></div>` : '' }
    body += section('👤 Dati Anagrafici', [card('Nome',d.nome),card('Cognome',d.cognome),card('Età',d.eta,'anni'),card('Sesso',d.sesso)])
    body += section('⚖️ Antropometria', [card('Peso',d.peso,'kg'),card('Altezza',d.altezza,'cm'),card('Peso ideale',d.peso_ideale,'kg'),card('Massa grassa',d.massa_grassa_pct,'%'),card('Massa magra',d.massa_magra,'kg'),card('Vita',d.vita,'cm'),card('Fianchi',d.fianchi,'cm'),card('Braccio',d.braccio,'cm')])
    if (d.tdee_calcolato) body += `<div style="background:#F0FDF4;border-radius:8px;padding:12px 16px;border-left:4px solid #16A34A;margin-bottom:14px"><div style="font-size:9pt;font-weight:700;color:#15803D;text-transform:uppercase;margin-bottom:2px">Fabbisogno energetico</div><div style="font-size:18px;font-weight:700;color:#15803D">${_e(String(d.tdee_calcolato))} kcal/die</div></div>`
    if (d.note?.trim()) body += `<div style="background:#FFF7ED;border-left:4px solid #F59E0B;border-radius:6px;padding:10px 14px;margin-bottom:14px;font-size:11pt;white-space:pre-wrap">📌 ${_e(d.note)}</div>`
  }

  // BIA
  if (tipo === 'bia') {
    const d = dati
    const card = (lbl, val, unit='') => val != null && val !== '' && val !== null
      ? `<div style="background:#F8FAFC;border-radius:8px;padding:10px 12px;border-left:3px solid #0891b2">
          <div style="font-size:9pt;font-weight:700;color:#64748B;text-transform:uppercase;margin-bottom:2px">${lbl}</div>
          <div style="font-size:13px;color:#1E293B;font-weight:600">${_e(String(val))}${unit ? ' <span style="font-size:10px;color:#94A3B8">'+unit+'</span>' : ''}</div>
        </div>` : ''
    const section = (title, cards) => { const c = cards.filter(Boolean).join(''); return c ? `<div style="margin-bottom:14px"><div style="font-size:10pt;font-weight:700;color:#0891b2;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;padding-bottom:4px;border-bottom:2px solid #E2E8F0">${title}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">${c}</div></div>` : '' }
    if (d.data_misura) body += `<div style="background:#EFF6FF;border-left:4px solid #0891b2;border-radius:6px;padding:8px 14px;margin-bottom:14px;font-size:11pt;color:#0c4a6e">📅 Data misurazione: <strong>${_e(new Date(d.data_misura).toLocaleDateString('it-IT'))}</strong></div>`
    body += section('⚖️ Dati Base', [card('Peso',d.peso,'kg'),card('Altezza',d.altezza,'cm'),card('Età',d.eta,'anni'),card('Sesso',d.sesso)])
    body += section('🔬 Composizione Corporea', [card('Massa grassa',d.bf_pct,'%'),card('FM',d.fm_kg,'kg'),card('FFM',d.ffm_kg,'kg'),card('Angolo di fase',d.angolo_fase,'°'),card('FFMI',d.ffmi),card('BCM',d.bcm,'kg'),card('Muscolo',d.muscle,'kg'),card('Osso',d.bone,'kg')])
    body += section('💧 Idratazione', [card('TBW',d.tbw,'L'),card('ICW',d.icw,'L'),card('ECW',d.ecw,'L')])
    if (d.note?.trim()) body += `<div style="background:#FFF7ED;border-left:4px solid #F59E0B;border-radius:6px;padding:10px 14px;margin-bottom:14px;font-size:11pt;white-space:pre-wrap">📌 ${_e(d.note)}</div>`
  }

  // Fallback generico per tipi sconosciuti: mostra testo o campi semplici
  const SPEC_KNOWN = new Set(['diabete','pediatria','sport','pancreas','disfagia','renale','chetogenica','ristorazione','ncpt','dca','valutazione','bia'])
  if (!SPEC_KNOWN.has(tipo)) {
    const testo = doc.content || dati.descrizione || dati.testo || dati.contenuto || dati.note || ''
    if (testo) {
      body += `<div style="background:#F8FAFC;border-radius:8px;padding:16px;font-size:11pt;color:#1E293B;line-height:1.7;white-space:pre-wrap">${_nl2br(testo)}</div>`
    } else {
      const simple = Object.entries(dati).filter(([k, v]) => v && String(v).trim() && k !== 'stampa_html' && typeof v !== 'object')
      if (simple.length) {
        body += `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">`
        simple.forEach(([k, v]) => {
          const lbl = k.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())
          body += `<div style="background:#F8FAFC;border-radius:8px;padding:10px 12px;border-left:3px solid ${colore}">
            <div style="font-size:9pt;font-weight:700;color:#64748B;margin-bottom:4px">${_e(lbl)}</div>
            <div style="font-size:11pt;color:#1E293B">${_e(String(v))}</div>
          </div>`
        })
        body += `</div>`
      }
    }
  }

  const dataStr = doc.created_at ? new Date(doc.created_at).toLocaleDateString('it-IT') : ''
  body += `<div style="margin-top:20px;padding-top:10px;border-top:1px solid #E2E8F0;font-size:9pt;color:#94A3B8;text-align:center">DietPlan Pro · ${_e(label)}${dataStr ? ' · ' + dataStr : ''}</div>`

  return wrapDoc(body)
}

// ─── Master router: smista tutti i tipi di documento al renderer corretto ────
function buildDocumentPrintHTML(doc) {
  const dati = doc.dati_raw && typeof doc.dati_raw === 'object' ? doc.dati_raw : {}

  // 1. HTML di stampa pre-generato dal sito dietista (nuovo salvataggio)
  if (dati.stampa_html) return dati.stampa_html

  const tipo = (doc.tipo || doc.type || '').toLowerCase().trim()

  // 2. Consiglio nutrizionale
  if (tipo === 'consiglio' || tipo === 'advice') return buildConsiglioPrintHTML(doc)

  // 3. Piano alimentare strutturato (tabella piani, giorni con items)
  if (doc.meals_data) {
    try {
      const md = typeof doc.meals_data === 'string' ? JSON.parse(doc.meals_data) : doc.meals_data
      if (Array.isArray(md) && md[0]?.meals) return buildPianoPrintHTML(doc, md)
    } catch { /* fall through */ }
  }

  // 4. Tutti gli altri tipi: porta esatta di buildStampaSpecialisticaHTML
  return buildStampaSpecialisticaFallback(doc, tipo, dati)
}

// ─── Sottosezioni per specialistiche (usate nella folder view del paziente) ───
const PATIENT_SPEC_SUBSECTIONS = {
  diabete:     [
    { key: 'piano_alimentare',   label: '🍽️ Piano alimentare',        color: '#1D4ED8' },
    { key: 'terapia_insulinica', label: '💉 Terapia insulinica',       color: '#1D4ED8' },
    { key: 'note_cliniche',      label: '📋 Note cliniche',            color: '#1D4ED8' },
    { key: 'note_generali',      label: '📌 Note generali',            color: '#1D4ED8' },
    { key: 'depliant',           label: '📖 Depliant informativo',     color: '#1D4ED8' },
  ],
  pediatria:   [
    { key: 'piano_alimentare', label: '🍽️ Piano alimentare', color: '#5B21B6' },
    { key: 'note_cliniche',    label: '📋 Note cliniche',    color: '#5B21B6' },
    { key: 'note_generali',    label: '📌 Note generali',    color: '#5B21B6' },
  ],
  sport:       [
    { key: 'piano_alimentare',  label: '🍽️ Piano alimentare', color: '#065F46' },
    { key: 'supplementazione',  label: '💊 Supplementazione', color: '#065F46' },
    { key: 'note_generali',     label: '📌 Note generali',    color: '#065F46' },
  ],
  pancreas:    [
    { key: 'piano_alimentare', label: '🍽️ Piano alimentare', color: '#C2410C' },
    { key: 'note_cliniche',    label: '📋 Note cliniche',    color: '#C2410C' },
    { key: 'note_generali',    label: '📌 Note generali',    color: '#C2410C' },
  ],
  chetogenica: [
    { key: 'valutazione', label: '📊 Valutazione',         color: '#7C3AED' },
    { key: 'calcolo',     label: '🧮 Parametri calcolo',   color: '#7C3AED' },
    { key: 'gki',         label: '🔬 Indice Chetogenico',  color: '#7C3AED' },
  ],
  renale:      [
    { key: 'valutazione', label: '📊 Valutazione',       color: '#0F766E' },
    { key: 'calcolo',     label: '🧮 Parametri calcolo', color: '#0F766E' },
  ],
  disfagia:    [
    { key: 'iddsi', label: '🗣️ Livello IDDSI',        color: '#0369A1' },
    { key: 'kcal',  label: '🔥 Fabbisogno calorico',  color: '#0369A1' },
  ],
  ristorazione:[
    { key: 'piano_alimentare', label: '🍽️ Menù / Portate', color: '#0369A1' },
    { key: 'note_generali',    label: '📌 Note generali',  color: '#0369A1' },
  ],
  dca:         [
    { key: 'valutazione',  label: '📊 Valutazione',   color: '#991B1B' },
    { key: 'note_cliniche',label: '📋 Note cliniche', color: '#991B1B' },
    { key: 'note_generali',label: '📌 Note generali', color: '#991B1B' },
  ],
  consiglio:   [
    { key: 'consigli_base',  label: '✅ Consigli nutrizionali', color: '#16A34A' },
    { key: 'note_paziente',  label: '✏️ Note specifiche',       color: '#16A34A' },
  ],
}

// ─── Genera HTML per una singola sottosezione di un documento specialistico ───
function buildSubsectionHTML(doc, sectionKey) {
  const dati  = doc.dati_raw || {}
  const tipo  = (doc.tipo || '').toLowerCase()
  const nome  = doc.title || doc.nota || tipo
  const piano = dati.piano || {}

  const wrapSec = inner => `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"><title>${_e(nome)}</title>
<style>*{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:'DM Sans','Segoe UI',Arial,sans-serif;color:#1E293B;font-size:11pt;line-height:1.5;padding:1.5cm 2cm 2.5cm}
@media screen{body{padding:20px;max-width:760px;margin:0 auto}}</style>
</head><body>${inner}</body></html>`

  const infoCard = (lbl, val, col) => val ? `<div style="background:#F8FAFC;border-radius:8px;padding:12px 16px;border-left:3px solid ${col};margin-bottom:10px">
    <div style="font-size:9pt;font-weight:700;color:#64748B;text-transform:uppercase;margin-bottom:4px">${lbl}</div>
    <div style="font-size:13px;color:#1E293B;white-space:pre-wrap">${_e(String(val))}</div>
  </div>` : ''

  const noteBlock = (text, icon, bg, border) => text?.trim() ? `<div style="background:${bg};border-left:4px solid ${border};border-radius:6px;padding:14px 18px;font-size:11pt;color:#1E293B;white-space:pre-wrap;line-height:1.7">${icon} ${_e(text)}</div>` : ''

  switch (sectionKey) {
    case 'piano_alimentare':
      return buildStampaSpecialisticaFallback(doc, tipo, dati)

    case 'note_cliniche': {
      const testo = piano.note_cliniche?.trim()
      if (!testo) return null
      return wrapSec(`<h2 style="font-size:16px;font-weight:700;color:#0F766E;margin-bottom:16px">📋 Note Cliniche</h2>
        ${noteBlock(testo, '', '#EFF6FF', '#3B82F6')}
        <div style="margin-top:20px;font-size:9pt;color:#94A3B8;text-align:center">DietPlan Pro · ${_e(nome)}</div>`)
    }

    case 'note_generali': {
      const testo = piano.note_generali?.trim()
      if (!testo) return null
      return wrapSec(`<h2 style="font-size:16px;font-weight:700;color:#0F766E;margin-bottom:16px">📌 Note Generali</h2>
        ${noteBlock(testo, '⚠️', '#FFF7ED', '#F59E0B')}
        <div style="margin-top:20px;font-size:9pt;color:#94A3B8;text-align:center">DietPlan Pro · ${_e(nome)}</div>`)
    }

    case 'terapia_insulinica': {
      const ri = dati.rapporto_ic || {}
      const dp = dati.dose_pasto  || {}
      const fsi = dati.fsi        || {}
      const col = '#3B82F6'
      let body = `<h2 style="font-size:16px;font-weight:700;color:${col};margin-bottom:16px">💉 Terapia Insulinica</h2>`
      if (ri.tipo || ri.valore || ri.formula) body += `<div style="font-size:13px;font-weight:700;color:#334155;margin:14px 0 8px">Rapporto Insulina/Carboidrati</div>
        ${infoCard('Tipo', ri.tipo, col)}${infoCard('Valore', ri.valore, col)}${infoCard('Formula', ri.formula, col)}`
      if (dp.dose || dp.unita || dp.note) body += `<div style="font-size:13px;font-weight:700;color:#334155;margin:14px 0 8px">Dose per Pasto</div>
        ${infoCard('Dose', dp.dose, col)}${infoCard('Unità', dp.unita, col)}${infoCard('Note', dp.note, col)}`
      if (fsi.valore || fsi.formula || fsi.note) body += `<div style="font-size:13px;font-weight:700;color:#334155;margin:14px 0 8px">Fattore Sensibilità Insulinica</div>
        ${infoCard('Valore', fsi.valore, col)}${infoCard('Formula', fsi.formula, col)}${infoCard('Note', fsi.note, col)}`
      if (!ri.tipo && !ri.valore && !dp.dose && !fsi.valore) body += `<p style="color:#94A3B8;font-size:13px">Nessun dato disponibile.</p>`
      body += `<div style="margin-top:20px;font-size:9pt;color:#94A3B8;text-align:center">DietPlan Pro · ${_e(nome)}</div>`
      return wrapSec(body)
    }

    case 'supplementazione': {
      const supp = piano.supplementazione || dati.supplementazione
      if (!supp) return null
      return wrapSec(`<h2 style="font-size:16px;font-weight:700;color:#065F46;margin-bottom:16px">💊 Supplementazione</h2>
        <div style="background:#F0FDF4;border-radius:8px;padding:16px;font-size:11pt;color:#1E293B;white-space:pre-wrap;line-height:1.7">${_e(String(supp))}</div>
        <div style="margin-top:20px;font-size:9pt;color:#94A3B8;text-align:center">DietPlan Pro · ${_e(nome)}</div>`)
    }

    case 'valutazione': {
      const val = dati.valutazione || {}
      const entries = Object.entries(val).filter(([, v]) => v && String(v).trim())
      if (!entries.length) return null
      return wrapSec(`<h2 style="font-size:16px;font-weight:700;color:#0F766E;margin-bottom:16px">📊 Valutazione</h2>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          ${entries.map(([k, v]) => `<div style="background:#F8FAFC;border-radius:8px;padding:10px 12px;border-left:3px solid #0F766E">
            <div style="font-size:9pt;font-weight:700;color:#64748B;text-transform:uppercase;margin-bottom:4px">${_e(k.replace(/_/g,' '))}</div>
            <div style="font-size:11pt;color:#1E293B">${_e(String(v))}</div>
          </div>`).join('')}
        </div>
        <div style="margin-top:20px;font-size:9pt;color:#94A3B8;text-align:center">DietPlan Pro · ${_e(nome)}</div>`)
    }

    case 'calcolo': {
      const c = dati.calcolo || {}
      const entries = Object.entries(c).filter(([, v]) => v && String(v).trim())
      if (!entries.length) return null
      const UNITS = { peso:'kg', altezza:'cm', eta:'anni', peso_ideale:'kg' }
      return wrapSec(`<h2 style="font-size:16px;font-weight:700;color:#0891b2;margin-bottom:16px">🧮 Parametri Calcolo</h2>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          ${entries.map(([k, v]) => `<div style="background:#F8FAFC;border-radius:8px;padding:10px 12px;border-left:3px solid #0891b2">
            <div style="font-size:9pt;font-weight:700;color:#64748B;text-transform:uppercase;margin-bottom:4px">${_e(k.replace(/_/g,' '))}</div>
            <div style="font-size:11pt;color:#1E293B">${_e(String(v))}${UNITS[k] ? ' <span style="font-size:9pt;color:#94A3B8">'+UNITS[k]+'</span>' : ''}</div>
          </div>`).join('')}
        </div>
        <div style="margin-top:20px;font-size:9pt;color:#94A3B8;text-align:center">DietPlan Pro · ${_e(nome)}</div>`)
    }

    case 'gki': {
      const gki = dati.gki || {}
      if (!gki.glicemia && !gki.chetoni) return null
      return wrapSec(`<h2 style="font-size:16px;font-weight:700;color:#0891b2;margin-bottom:16px">🔬 Indice Chetogenico (GKI)</h2>
        ${gki.glicemia ? infoCard('🩸 Glicemia', gki.glicemia + ' mg/dL', '#0891b2') : ''}
        ${gki.chetoni  ? infoCard('🔬 Chetoni',  gki.chetoni  + ' mmol/L','#0891b2') : ''}
        <div style="margin-top:20px;font-size:9pt;color:#94A3B8;text-align:center">DietPlan Pro · ${_e(nome)}</div>`)
    }

    case 'iddsi': {
      if (!dati.iddsi) return null
      return wrapSec(`<h2 style="font-size:16px;font-weight:700;color:#0369A1;margin-bottom:16px">🗣️ Livello IDDSI</h2>
        <div style="background:#F0FDFA;border-left:4px solid #0D9488;border-radius:6px;padding:20px;text-align:center;margin-bottom:14px">
          <div style="font-size:9pt;font-weight:700;color:#64748B;text-transform:uppercase;margin-bottom:8px">Classificazione IDDSI</div>
          <div style="font-size:28pt;font-weight:700;color:#0F766E">${_e(dati.iddsi)}</div>
        </div>
        <div style="font-size:9pt;color:#94A3B8;text-align:center">DietPlan Pro · ${_e(nome)}</div>`)
    }

    case 'kcal': {
      if (!dati.kcal) return null
      return wrapSec(`<h2 style="font-size:16px;font-weight:700;color:#0369A1;margin-bottom:16px">🔥 Fabbisogno Calorico</h2>
        ${infoCard('🔥 Obiettivo energetico giornaliero', dati.kcal, '#0369A1')}
        <div style="margin-top:20px;font-size:9pt;color:#94A3B8;text-align:center">DietPlan Pro · ${_e(nome)}</div>`)
    }

    case 'depliant': {
      const dep = dati.depliant || piano.depliant
      if (!dep) return null
      const depBody = typeof dep === 'string'
        ? `<div style="background:#F8FAFC;border-radius:8px;padding:16px;font-size:11pt;white-space:pre-wrap;line-height:1.7">${_e(dep)}</div>`
        : Object.entries(dep).filter(([,v]) => v).map(([k, v]) => infoCard(k.replace(/_/g,' '), v, '#3B82F6')).join('')
      return wrapSec(`<h2 style="font-size:16px;font-weight:700;color:#3B82F6;margin-bottom:16px">📖 Depliant Informativo</h2>
        ${depBody}
        <div style="margin-top:20px;font-size:9pt;color:#94A3B8;text-align:center">DietPlan Pro · ${_e(nome)}</div>`)
    }

    case 'consigli_base':
      return buildConsiglioPrintHTML(doc)

    case 'note_paziente': {
      const np = (doc.dati_raw || {}).note_paziente
      if (!np?.trim()) return null
      return wrapSec(`<h2 style="font-size:16px;font-weight:700;color:#16A34A;margin-bottom:16px">✏️ Note Specifiche</h2>
        ${noteBlock(np, '', '#FFF7ED', '#F59E0B')}
        <div style="margin-top:20px;font-size:9pt;color:#94A3B8;text-align:center">DietPlan Pro · ${_e(nome)}</div>`)
    }

    default:
      return buildDocumentPrintHTML(doc)
  }
}

// ─── Folder definitions: raggruppa i docs per categoria ───────────────────────
const FOLDER_DEFS = [
  { key: 'consiglio',    label: 'Consigli Nutrizionali', icon: '💡', color: '#16A34A', bg: '#F0FDF4', types: ['consiglio','advice'] },
  { key: 'piano',        label: 'Piano Alimentare',       icon: '🥗', color: '#1a7f5a', bg: '#e6f5ee', types: ['piano','diet','dieta'] },
  { key: 'valutazione',  label: 'Valutazione',            icon: '📊', color: '#0f766e', bg: '#ccfbf1', types: ['valutazione'] },
  { key: 'bia',          label: 'BIA',                    icon: '⚡', color: '#0891b2', bg: '#ecfeff', types: ['bia'] },
  { key: 'ncpt',         label: 'NCPT',                   icon: '📋', color: '#7c3aed', bg: '#f5f3ff', types: ['ncpt'] },
  { key: 'diabete',      label: 'Diabete',                icon: '🩸', color: '#1D4ED8', bg: '#DBEAFE', types: ['diabete'] },
  { key: 'pediatria',    label: 'Pediatria',              icon: '👶', color: '#5B21B6', bg: '#EDE9FE', types: ['pediatria'] },
  { key: 'sport',        label: 'Nutrizione Sportiva',    icon: '🏃', color: '#065F46', bg: '#ECFDF5', types: ['sport'] },
  { key: 'pancreas',     label: 'Pancreas',               icon: '🫁', color: '#C2410C', bg: '#FFF7ED', types: ['pancreas'] },
  { key: 'chetogenica',  label: 'Dieta Chetogenica',      icon: '🥑', color: '#7C3AED', bg: '#F5F3FF', types: ['chetogenica'] },
  { key: 'renale',       label: 'Nefropatia / IRC',       icon: '🫘', color: '#0F766E', bg: '#CCFBF1', types: ['renale'] },
  { key: 'disfagia',     label: 'Disfagia',               icon: '🗣️', color: '#0369A1', bg: '#E0F2FE', types: ['disfagia'] },
  { key: 'ristorazione', label: 'Ristorazione',           icon: '🍽️', color: '#0369A1', bg: '#F0F9FF', types: ['ristorazione'] },
  { key: 'dca',          label: 'Sessione DCA',           icon: '🫀', color: '#991B1B', bg: '#FEE2E2', types: ['dca'] },
]

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
    const html = buildDocumentPrintHTML(doc)
    const win  = window.open('', '_blank')
    if (!win) { alert('Abilita i popup per stampare il documento.'); return }
    win.document.write(html)
    win.document.close()
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
    if (!doc || doc.file_url) {
      console.log('[DocModal] Skipping HTML generation - has file attachment')
      return
    }

    try {
      console.log('[DocModal] Attempting HTML generation for doc:', doc.id)
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
      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg, #0d5c3a, #1a7f5a)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,.15)' }}>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 20, flexShrink: 0 }}>←</button>
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

      {/* Content */}
      {printImageUrl ? (
        <div style={{ flex: 1, overflow: 'auto', background: '#f1f5f9' }}>
          <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, gap: 14, boxSizing: 'border-box' }}>
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
        </div>
      ) : iframeHtml ? (
        <iframe
          srcDoc={iframeHtml}
          style={{ flex: 1, border: 'none', width: '100%', minHeight: 0 }}
          title={doc.title}
          sandbox="allow-same-origin"
        />
      ) : hasAttachment ? (
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
          <p style={{ marginBottom: 16, color: '#666' }}>Documento allegato</p>
          <a href={doc.file_url} target="_blank" rel="noopener noreferrer" download
            style={{ background: '#1a7f5a', color: 'white', padding: '12px 24px', borderRadius: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Download size={16} />Scarica documento
          </a>
        </div>
      ) : error ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>⚠️</div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#334155', marginBottom: 8 }}>Documento non disponibile</h3>
          <p style={{ color: '#64748b', fontSize: 14, maxWidth: 320, lineHeight: 1.5 }}>{error}</p>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>⏳</div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#334155', marginBottom: 8 }}>Documento in fase di aggiornamento</h3>
          <p style={{ color: '#64748b', fontSize: 14, maxWidth: 320, lineHeight: 1.5 }}>
            Il tuo dietista sta preparando la versione aggiornata di questo documento. Sarà disponibile a breve.
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function DocumentsPage() {
  const { user } = useAuth()
  const [docs,                   setDocs]                   = useState([])
  const [loading,                setLoading]                = useState(true)
  const [loadError,              setLoadError]              = useState(null)
  const [typeFilter,             setTypeFilter]             = useState('all')
  const [dateFilter,             setDateFilter]             = useState('all')
  const [sortAsc,                setSortAsc]                = useState(false)
  const [selected,               setSelected]               = useState(null)
  const [pendingSignatureDocs,   setPendingSignatureDocs]   = useState([])
  const [signingId,              setSigningId]              = useState(null)
  const [bookmarks,              setBookmarks]              = useState(() => {
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

  const handleSign = useCallback(async (docId, accepted) => {
    setSigningId(docId)
    try {
      const { error } = await supabase
        .from('patient_documents')
        .update({
          signed_at: new Date().toISOString(),
          signature_accepted: accepted,
          signature_data: accepted ? 'accepted_digitally' : 'rejected_digitally',
        })
        .eq('id', docId)
        .eq('patient_id', user.id)
      if (!error) {
        setPendingSignatureDocs(prev => prev.filter(d => d.id !== docId))
      }
    } finally {
      setSigningId(null)
    }
  }, [user.id])

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
            .select('id, tipo, nota, dati, print_image_url, created_at')
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
            const titleFromNota = n.nota && n.nota.trim() && n.nota.trim() !== '1' ? n.nota.trim() : ''
            const title = titleFromNota || titleFromDati || (tipo ? 'Consiglio: ' + tipo.charAt(0).toUpperCase() + tipo.slice(1) : 'Documento')

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
              print_image_url: n.print_image_url
                || datiParsed?.print_image_url
                || datiParsed?.image_url
                || datiParsed?.stampa_image_url
                || datiParsed?.stampa_url
                || null,
              tags:        datiParsed?.tags || [],
              visible:     true,
              published_at: n.created_at,
              created_at:  n.created_at,
            })
          }

          // 2b. Piani alimentari visibili al paziente
          const { data: piani, error: pianiErr } = await supabase
            .from('piani')
            .select('id, nome, data_piano, meals, print_image_url, saved_at')
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
              print_image_url: p.print_image_url
                || (p.meals && typeof p.meals === 'object' && (p.meals.print_image_url || p.meals.image_url))
                || null,
              tags:        [],
              visible:     true,
              published_at: p.saved_at,
              created_at:  p.saved_at,
            })
          }

          // 2c. NCPT visibili al paziente
          const { data: ncpts, error: ncptErr } = await supabase
            .from('ncpt')
            .select('id, cartella_id, valutazione, diagnosi, intervento, monitoraggio, print_image_url, created_at')
            .eq('cartella_id', cartellaId)
            .eq('visible_to_patient', true)
            .order('created_at', { ascending: false })
          console.log('[Docs] ncpt:', ncpts?.length, '| error:', ncptErr?.message)
          for (const n of ncpts || []) {
            let val = {}; try { val = typeof n.valutazione === 'string' ? JSON.parse(n.valutazione) : (n.valutazione || {}) } catch { /* */ }
            const titolo = [val.nome, val.cognome].filter(Boolean).join(' ') || 'NCPT'
            allDocs.push({
              id: `ncpt_${n.id}`, title: titolo, type: 'ncpt', source: 'ncpt', tipo: 'ncpt',
              nota: titolo, content: '', file_url: null, print_image_url: n.print_image_url || null, tags: [], visible: true,
              dati_raw: { valutazione: n.valutazione, diagnosi: n.diagnosi, intervento: n.intervento, monitoraggio: n.monitoraggio },
              meals_data: null, published_at: n.created_at, created_at: n.created_at,
            })
          }

          // 2d. Schede valutazione visibili al paziente
          const { data: schede, error: schedeErr } = await supabase
            .from('schede_valutazione')
            .select('id, nome, cognome, eta, sesso, peso, altezza, peso_ideale, massa_grassa_pct, massa_magra, vita, fianchi, braccio, patologie, note, macro_dist, tdee_calcolato, dati_extra, print_image_url, saved_at')
            .eq('cartella_id', cartellaId)
            .eq('visible_to_patient', true)
            .order('saved_at', { ascending: false })
          console.log('[Docs] schede_valutazione:', schede?.length, '| error:', schedeErr?.message)
          for (const s of schede || []) {
            const titolo = [s.nome, s.cognome].filter(Boolean).join(' ') || 'Scheda Valutazione'
            allDocs.push({
              id: `val_${s.id}`, title: titolo, type: 'valutazione', source: 'valutazione', tipo: 'valutazione',
              nota: titolo, content: '', file_url: null,
              print_image_url: s.print_image_url
                || (s.dati_extra && typeof s.dati_extra === 'object' && (s.dati_extra.print_image_url || s.dati_extra.image_url))
                || null,
              tags: [], visible: true,
              dati_raw: { nome: s.nome, cognome: s.cognome, eta: s.eta, sesso: s.sesso, peso: s.peso, altezza: s.altezza, peso_ideale: s.peso_ideale, massa_grassa_pct: s.massa_grassa_pct, massa_magra: s.massa_magra, vita: s.vita, fianchi: s.fianchi, braccio: s.braccio, patologie: s.patologie, note: s.note, macro_dist: s.macro_dist, tdee_calcolato: s.tdee_calcolato, dati_extra: s.dati_extra },
              meals_data: null, published_at: s.saved_at, created_at: s.saved_at,
            })
          }

          // 2e. BIA visibili al paziente
          const { data: bias, error: biaErr } = await supabase
            .from('bia_records')
            .select('id, data_misura, note, peso, altezza, eta, sesso, angolo_fase, bf_pct, fm_kg, ffm_kg, tbw, icw, ecw, bcm, muscle, bone, ffmi, raw_data, print_image_url, created_at')
            .eq('cartella_id', cartellaId)
            .eq('visible_to_patient', true)
            .order('data_misura', { ascending: false })
          console.log('[Docs] bia_records:', bias?.length, '| error:', biaErr?.message)
          for (const b of bias || []) {
            const dataStr = b.data_misura ? new Date(b.data_misura).toLocaleDateString('it-IT') : ''
            allDocs.push({
              id: `bia_${b.id}`, title: 'BIA' + (dataStr ? ' — ' + dataStr : ''), type: 'bia', source: 'bia', tipo: 'bia',
              nota: 'BIA' + (dataStr ? ' — ' + dataStr : ''), content: '', file_url: null,
              print_image_url: b.print_image_url
                || (b.raw_data && typeof b.raw_data === 'object' && (b.raw_data.print_image_url || b.raw_data.image_url))
                || null,
              tags: [], visible: true,
              dati_raw: { data_misura: b.data_misura, note: b.note, peso: b.peso, altezza: b.altezza, eta: b.eta, sesso: b.sesso, angolo_fase: b.angolo_fase, bf_pct: b.bf_pct, fm_kg: b.fm_kg, ffm_kg: b.ffm_kg, tbw: b.tbw, icw: b.icw, ecw: b.ecw, bcm: b.bcm, muscle: b.muscle, bone: b.bone, ffmi: b.ffmi, raw_data: b.raw_data },
              meals_data: null, published_at: b.created_at || b.data_misura, created_at: b.created_at || b.data_misura,
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

        const pendingSig = []
        for (const d of patientDocs || []) {
          if (d.requires_signature && !d.signed_at) {
            pendingSig.push(d)
          } else {
            allDocs.push({ ...d, published_at: d.published_at || d.created_at })
          }
        }
        setPendingSignatureDocs(pendingSig)

      } catch (e) {
        console.error('Documents load error:', e)
        setLoadError(e.message)
      }

      // ── Storage fallback: try to find PNGs in Supabase Storage ──────────────
      // The dietitian uploads screenshots to bucket 'document-prints' at
      // path: <patient_auth_uid>/<document_db_uuid>.png
      const missingImgDocs = allDocs.filter(d => !d.print_image_url)
      if (missingImgDocs.length > 0) {
        try {
          const { data: storageFiles } = await supabase.storage
            .from('document-prints')
            .list(user.id, { limit: 200 })
          console.log('[Docs] storage files in bucket:', storageFiles?.length, storageFiles?.map(f => f.name))
          if (storageFiles?.length) {
            // Build a set of raw UUIDs present in storage (strip extension)
            const fileSet = new Set(storageFiles.map(f => f.name.replace(/\.[^.]+$/i, '')))
            // For each missing-image doc, strip the source prefix (note_, bia_, etc.)
            const toSign = missingImgDocs.filter(doc => {
              const rawId = doc.id.replace(/^[a-z_]+_/, '')
              return fileSet.has(rawId)
            })
            if (toSign.length > 0) {
              await Promise.all(toSign.map(async doc => {
                const rawId = doc.id.replace(/^[a-z_]+_/, '')
                const { data } = await supabase.storage
                  .from('document-prints')
                  .createSignedUrl(`${user.id}/${rawId}.png`, 86400)
                if (data?.signedUrl) {
                  doc.print_image_url = data.signedUrl
                  console.log('[Docs] storage image found for', doc.id)
                }
              }))
            }
          }
        } catch (e) {
          console.log('[Docs] storage lookup skipped:', e.message)
        }
      }

      console.log('[Docs] total allDocs:', allDocs.length)
      const missingImg = allDocs.filter(d => !d.print_image_url).map(d => `${d.source || d.type}:${d.id}`)
      if (missingImg.length) console.log('[Docs] still missing print_image_url:', missingImg)
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
          {/* ── Documenti da firmare ────────────────────────────────────────── */}
          {pendingSignatureDocs.length > 0 && (
            <div style={{ borderRadius: 16, overflow: 'hidden', border: '2px solid #f59e0b', background: '#fffbeb', boxShadow: '0 2px 12px rgba(245,158,11,0.15)' }}>
              <div style={{ padding: '13px 16px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <PenLine size={18} color="white" />
                <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>
                  Documento{pendingSignatureDocs.length > 1 ? 'i' : ''} da firmare ({pendingSignatureDocs.length})
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {pendingSignatureDocs.map((doc, idx) => (
                  <div key={doc.id} style={{ padding: '14px 16px', borderTop: idx > 0 ? '1px solid #fde68a' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FileText size={18} color="#d97706" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#92400e', marginBottom: 2 }}>{doc.title || 'Documento da firmare'}</p>
                        <p style={{ fontSize: 12, color: '#b45309' }}>
                          {new Date(doc.created_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        {doc.content && (
                          <p style={{ fontSize: 13, color: '#78350f', marginTop: 6, lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{doc.content}</p>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button
                        onClick={() => handleSign(doc.id, true)}
                        disabled={signingId === doc.id}
                        style={{ flex: 1, padding: '11px 0', borderRadius: 12, border: 'none', cursor: signingId === doc.id ? 'wait' : 'pointer', background: '#16a34a', color: 'white', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, opacity: signingId === doc.id ? 0.7 : 1, transition: 'opacity .2s' }}
                      >
                        <CheckCircle2 size={16} />
                        Accetta
                      </button>
                      <button
                        onClick={() => handleSign(doc.id, false)}
                        disabled={signingId === doc.id}
                        style={{ flex: 1, padding: '11px 0', borderRadius: 12, border: '1.5px solid #fca5a5', cursor: signingId === doc.id ? 'wait' : 'pointer', background: 'white', color: '#dc2626', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, opacity: signingId === doc.id ? 0.7 : 1, transition: 'opacity .2s' }}
                      >
                        <XCircle size={16} />
                        Rifiuta
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
          ) : (() => {
            // ── Raggruppa i documenti filtrati per cartella ──────────────────
            const allFolderTypes = new Set(FOLDER_DEFS.flatMap(f => f.types))
            const docsByFolder = {}
            const ungrouped = []

            filtered.forEach(doc => {
              const tipo = (doc.tipo || doc.type || '').toLowerCase()
              const folder = FOLDER_DEFS.find(f => f.types.includes(tipo))
              if (folder) {
                if (!docsByFolder[folder.key]) docsByFolder[folder.key] = []
                docsByFolder[folder.key].push(doc)
              } else {
                ungrouped.push(doc)
              }
            })

            const renderDocRow = (doc, isNested = false) => {
              const meta = TYPE_META[doc.type] || TYPE_META.document
              const docIsNew = isNew(doc, lastSeen)
              const isBookmarked = bookmarks.has(doc.id)
              return (
                <div key={doc.id} style={{ position: 'relative' }}>
                  {docIsNew && <span style={{ position: 'absolute', top: -6, left: isNested ? 28 : 14, zIndex: 1, background: '#f59e0b', color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100 }}>NUOVO</span>}
                  <button onClick={() => setSelected(doc)} style={{
                    width: '100%', background: 'white',
                    border: `1px solid ${docIsNew ? '#fcd34d' : 'var(--border-light)'}`,
                    borderRadius: 'var(--r-lg)', padding: '12px 12px 12px 16px',
                    display: 'flex', alignItems: 'center', gap: 12,
                    cursor: 'pointer', font: 'inherit', textAlign: 'left',
                    boxShadow: 'var(--shadow-sm)',
                    marginLeft: isNested ? 16 : 0,
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
            }

            const renderSubsectionRow = (doc, sub, folderColor) => {
              // Per piano_alimentare usa stampa_html (output ESATTO dal sito dietista)
              const html = (sub.key === 'piano_alimentare' && doc.dati_raw?.stampa_html)
                ? doc.dati_raw.stampa_html
                : buildSubsectionHTML(doc, sub.key)
              if (!html) return null
              const emoji = sub.label.match(/^\S+/)?.[0] || '📄'
              const labelText = sub.label.replace(/^\S+\s*/, '')
              const virtualDoc = {
                ...doc,
                id:       doc.id + '_' + sub.key,
                title:    sub.label,
                dati_raw: { stampa_html: html },
              }
              return (
                <button key={doc.id + '_' + sub.key} onClick={() => setSelected(virtualDoc)} style={{
                  width: '100%', background: 'white',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--r-lg)', padding: '11px 14px',
                  display: 'flex', alignItems: 'center', gap: 12,
                  cursor: 'pointer', font: 'inherit', textAlign: 'left',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: folderColor + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                    {emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 0 }}>
                      {labelText}
                    </p>
                  </div>
                  <span style={{ fontSize: 18, color: '#CBD5E1' }}>›</span>
                </button>
              )
            }

            const renderFolder = (folder, folderDocs) => {
              const isOpen = openFolders.has(folder.key)
              const hasNew = folderDocs.some(d => isNew(d, lastSeen))

              return (
                <div key={folder.key}>
                  {/* Folder header */}
                  <button onClick={() => toggleFolder(folder.key)} style={{
                    width: '100%', background: isOpen ? folder.bg : 'white',
                    border: `1.5px solid ${isOpen ? folder.color + '60' : 'var(--border-light)'}`,
                    borderRadius: isOpen ? '14px 14px 0 0' : 14,
                    padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14,
                    cursor: 'pointer', font: 'inherit', textAlign: 'left',
                    boxShadow: isOpen ? 'none' : 'var(--shadow-sm)',
                    transition: 'border-color .2s, background .2s',
                  }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: folder.bg, border: `2px solid ${folder.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                      {folder.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: folder.color, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                        {folder.label}
                        {hasNew && <span style={{ background: '#f59e0b', color: 'white', fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 100 }}>NUOVO</span>}
                      </p>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {folderDocs.length} documento{folderDocs.length !== 1 ? 'i' : ''}
                      </span>
                    </div>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: folder.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: folder.color, fontSize: 18, flexShrink: 0, transition: 'transform .2s', transform: isOpen ? 'rotate(90deg)' : 'none' }}>›</div>
                  </button>

                  {/* Folder contents */}
                  {isOpen && (
                    <div style={{ border: `1.5px solid ${folder.color + '60'}`, borderTop: 'none', borderRadius: '0 0 14px 14px', background: '#FAFAFA', padding: '10px 10px 10px 10px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {folderDocs.map(doc => {
                        const tipo = (doc.tipo || '').toLowerCase()
                        const specSubs = PATIENT_SPEC_SUBSECTIONS[tipo]
                        const visibleSections = doc.dati_raw?.visible_sections

                        // ── Mostra sottosezioni SOLO se il dietista le ha scelte esplicitamente
                        //    e non c'è già un'immagine di stampa unica del documento ──
                        if (!doc.print_image_url && visibleSections?.length > 0 && specSubs?.length > 0) {
                          const activeSubs = specSubs.filter(s => visibleSections.includes(s.key))
                          const rows = activeSubs
                            .map(sub => renderSubsectionRow(doc, sub, folder.color))
                            .filter(Boolean)
                          if (rows.length > 0) {
                            return <div key={doc.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{rows}</div>
                          }
                        }

                        // ── Default: documento intero (usa stampa_html se disponibile) ──
                        return renderDocRow(doc, true)
                      })}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <>
                {FOLDER_DEFS
                  .filter(f => docsByFolder[f.key]?.length > 0)
                  .map(f => renderFolder(f, docsByFolder[f.key]))}
                {ungrouped.map(doc => renderDocRow(doc))}
              </>
            )
          })()}
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
