import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { FileText, Download, Eye, Calendar, Tag, ChevronRight, BookOpen, Utensils, Apple, Heart } from 'lucide-react'

const TYPE_META = {
  diet: { label: 'Dieta', icon: <Utensils size={18} />, color: '#1a7f5a', bg: 'var(--green-pale)' },
  advice: { label: 'Consigli nutrizionali', icon: <Heart size={18} />, color: '#e05a5a', bg: '#fff0f0' },
  recipe: { label: 'Ricetta', icon: <Apple size={18} />, color: '#f0922b', bg: '#fff4e6' },
  document: { label: 'Documento', icon: <FileText size={18} />, color: '#3b82f6', bg: '#eff6ff' },
  education: { label: 'Materiale educativo', icon: <BookOpen size={18} />, color: '#8b5cf6', bg: '#f5f3ff' },
}

function DocModal({ doc, onClose }) {
  if (!doc) return null
  const meta = TYPE_META[doc.type] || TYPE_META.document
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
      <div style={{ background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))', padding: 'calc(env(safe-area-inset-top) + 16px) 20px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 20 }}>←</button>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{meta.label}</p>
          <h2 style={{ color: 'white', fontSize: 17, fontWeight: 600 }}>{doc.title}</h2>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {doc.content ? (
          <div style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>{doc.content}</div>
        ) : doc.file_url ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
            <p style={{ marginBottom: 16, color: 'var(--text-secondary)' }}>Documento allegato</p>
            <a href={doc.file_url} target="_blank" rel="noopener noreferrer" download className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
              <Download size={16} />Scarica documento
            </a>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>Nessun contenuto disponibile</p>
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
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('patient_documents')
        .select('*')
        .eq('patient_id', user.id)
        .eq('visible', true)
        .order('created_at', { ascending: false })
      setDocs(data || [])
      setLoading(false)
    }
    load()
  }, [user.id])

  const types = ['all', ...new Set(docs.map(d => d.type).filter(Boolean))]
  const filtered = filter === 'all' ? docs : docs.filter(d => d.type === filter)

  return (
    <>
      <div className="page">
        <div style={{ background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))', padding: 'calc(env(safe-area-inset-top) + 20px) 24px 28px' }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 }}>Condivisi dal tuo dietista</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'white', fontWeight: 300, marginBottom: 16 }}>I miei documenti</h1>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, WebkitOverflowScrolling: 'touch' }}>
            {types.map(t => (
              <button key={t} onClick={() => setFilter(t)} style={{
                flexShrink: 0, padding: '7px 16px', borderRadius: 100,
                background: filter === t ? 'white' : 'rgba(255,255,255,0.15)',
                color: filter === t ? 'var(--green-main)' : 'white',
                border: 'none', font: 'inherit', fontSize: 13, fontWeight: 500, cursor: 'pointer'
              }}>
                {t === 'all' ? 'Tutti' : TYPE_META[t]?.label || t}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ width: 24, height: 24, border: '3px solid var(--border)', borderTopColor: 'var(--green-main)', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
              <FileText size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
              <p style={{ fontSize: 15, fontWeight: 500 }}>Nessun documento</p>
              <p style={{ fontSize: 13, marginTop: 4 }}>Il tuo dietista non ha ancora condiviso documenti.</p>
            </div>
          ) : filtered.map(doc => {
            const meta = TYPE_META[doc.type] || TYPE_META.document
            return (
              <button key={doc.id} onClick={() => setSelected(doc)} style={{ width: '100%', background: 'white', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', font: 'inherit', textAlign: 'left', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: meta.color, flexShrink: 0 }}>
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
                    <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                      {doc.tags.slice(0, 3).map(t => <span key={t} className="badge badge-green" style={{ fontSize: 10, padding: '2px 8px' }}>{t}</span>)}
                    </div>
                  )}
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </button>
            )
          })}
        </div>
      </div>

      {selected && <DocModal doc={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
