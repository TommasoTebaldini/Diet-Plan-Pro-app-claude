import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { FileText, Download, Calendar, ChevronRight, BookOpen, Utensils, Apple, Heart, Bookmark, BookmarkCheck, ArrowUpDown, Star } from 'lucide-react'

const TYPE_META = {
  diet: { label: 'Dieta', icon: <Utensils size={18} />, color: '#1a7f5a', bg: 'var(--green-pale)' },
  advice: { label: 'Consigli nutrizionali', icon: <Heart size={18} />, color: '#e05a5a', bg: '#fff0f0' },
  recipe: { label: 'Ricetta', icon: <Apple size={18} />, color: '#f0922b', bg: '#fff4e6' },
  document: { label: 'Documento', icon: <FileText size={18} />, color: '#3b82f6', bg: '#eff6ff' },
  education: { label: 'Materiale educativo', icon: <BookOpen size={18} />, color: '#8b5cf6', bg: '#f5f3ff' },
}

const DATE_FILTERS = [
  { key: 'all', label: 'Sempre' },
  { key: 'week', label: 'Settimana' },
  { key: 'month', label: 'Mese' },
  { key: 'year', label: 'Anno' },
]

const DOCS_EPOCH = '1970-01-01T00:00:00Z'

function isNew(doc, lastSeen) {
  return new Date(doc.created_at) > new Date(lastSeen)
}

function DocModal({ doc, onClose, bookmarked, onToggleBookmark }) {
  if (!doc) return null
  const meta = TYPE_META[doc.type] || TYPE_META.document
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
      <div style={{ background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))', padding: 'calc(env(safe-area-inset-top) + 16px) 20px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 20 }}>←</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{meta.label}</p>
          <h2 style={{ color: 'white', fontSize: 17, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.title}</h2>
        </div>
        <button
          onClick={() => onToggleBookmark(doc.id)}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', flexShrink: 0 }}
          title={bookmarked ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
        >
          {bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {doc.content ? (
          <div style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>{doc.content}</div>
        ) : doc.file_url ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
            <p style={{ marginBottom: 16, color: 'var(--text-secondary)' }}>Documento allegato</p>
            <a href={doc.file_url} target="_blank" rel="noopener noreferrer" download className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
              <Download size={16} />Scarica PDF
            </a>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>Nessun contenuto disponibile</p>
        )}
        {doc.content && doc.file_url && (
          <div style={{ marginTop: 20 }}>
            <a href={doc.file_url} target="_blank" rel="noopener noreferrer" download className="btn btn-secondary btn-full" style={{ textDecoration: 'none' }}>
              <Download size={15} />Scarica PDF
            </a>
          </div>
        )}
        {doc.tags && doc.tags.length > 0 && (
          <div style={{ marginTop: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {doc.tags.map(t => <span key={t} className="badge badge-green">{t}</span>)}
          </div>
        )}
        <div style={{ marginTop: 24, padding: 14, background: 'var(--surface-2)', borderRadius: 12, fontSize: 12, color: 'var(--text-muted)' }}>
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
            const tipoMap = {
              dieta: 'diet', piano: 'diet',
              consiglio: 'advice', nota: 'advice', referto: 'document',
              ricetta: 'recipe', educazione: 'education',
            }
            const tipo = (n.tipo || '').toLowerCase()
            const type = tipoMap[tipo] || 'advice'
            allDocs.push({
              id: `note_${n.id}`,
              title: n.tipo ? n.tipo.charAt(0).toUpperCase() + n.tipo.slice(1) : 'Nota del dietista',
              type,
              content: n.nota || (typeof n.dati === 'string' ? n.dati : n.dati ? JSON.stringify(n.dati, null, 2) : ''),
              file_url: null,
              tags: [],
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
              content: p.data_piano || (p.meals ? `Pasti: ${p.meals}` : ''),
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
          allDocs.push({ ...d, published_at: d.published_at || d.created_at })
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
