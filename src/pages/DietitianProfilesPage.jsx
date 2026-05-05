import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useT } from '../i18n'
import { Search, MapPin, Phone, Mail, Globe, Users, X } from 'lucide-react'

function DietitianCard({ profile }) {
  const [expanded, setExpanded] = useState(false)
  const initials = `${profile.nome?.[0] || ''}${profile.cognome?.[0] || ''}`.toUpperCase() || '?'
  const shortDesc = profile.descrizione?.slice(0, 160)
  const hasMore = (profile.descrizione?.length || 0) > 160

  return (
    <div className="card" style={{ padding: 16, marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 10 }}>
        {/* Avatar */}
        <div style={{
          width: 54, height: 54, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, var(--green-main), var(--green-mid))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 700, color: 'white',
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>
            {[profile.nome, profile.cognome].filter(Boolean).join(' ')}
          </p>
          {profile.titoli && (
            <p style={{ fontSize: 12, color: 'var(--green-main)', fontWeight: 500, marginBottom: 4 }}>
              {profile.titoli}
            </p>
          )}
          {profile.citta && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={11} color="var(--text-muted)" />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{profile.citta}</span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {profile.descrizione && (
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            {expanded || !hasMore ? profile.descrizione : shortDesc + '…'}
          </p>
          {hasMore && (
            <button onClick={() => setExpanded(e => !e)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--green-main)', fontWeight: 600, padding: '4px 0 0', display: 'block' }}>
              {expanded ? 'Leggi meno' : 'Leggi tutto'}
            </button>
          )}
        </div>
      )}

      {/* Contact buttons */}
      {(profile.telefono || profile.email_contatto || profile.sito_web) && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {profile.telefono && (
            <a href={`tel:${profile.telefono}`} style={{
              display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 500,
              color: 'var(--green-dark)', textDecoration: 'none',
              background: 'var(--green-pale)', padding: '6px 11px', borderRadius: 8,
            }}>
              <Phone size={12} /> {profile.telefono}
            </a>
          )}
          {profile.email_contatto && (
            <a href={`mailto:${profile.email_contatto}`} style={{
              display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 500,
              color: 'var(--green-dark)', textDecoration: 'none',
              background: 'var(--green-pale)', padding: '6px 11px', borderRadius: 8,
            }}>
              <Mail size={12} /> Scrivi
            </a>
          )}
          {profile.sito_web && (
            <a href={profile.sito_web.startsWith('http') ? profile.sito_web : `https://${profile.sito_web}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 500,
                color: 'var(--text-secondary)', textDecoration: 'none',
                background: 'var(--surface-2)', padding: '6px 11px', borderRadius: 8,
                border: '1px solid var(--border-light)',
              }}>
              <Globe size={12} /> Sito web
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default function DietitianProfilesPage() {
  const t = useT()
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [cities, setCities] = useState([])
  const [locating, setLocating] = useState(false)

  useEffect(() => { loadProfiles() }, [])

  async function loadProfiles() {
    const { data } = await supabase
      .from('dietitian_profiles')
      .select('*')
      .eq('visible', true)
      .order('cognome', { ascending: true })
    const list = data || []
    setProfiles(list)
    const uniqueCities = [...new Set(list.map(p => p.citta).filter(Boolean))].sort()
    setCities(uniqueCities)
    setLoading(false)
  }

  async function detectCity() {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json&accept-language=it`,
            { headers: { 'Accept-Language': 'it' } }
          )
          const data = await res.json()
          const city = data.address?.city || data.address?.town || data.address?.village || ''
          if (city) setCityFilter(city)
        } catch { /* ignore */ }
        setLocating(false)
      },
      () => setLocating(false)
    )
  }

  const filtered = profiles.filter(p => {
    const fullName = `${p.nome || ''} ${p.cognome || ''}`.toLowerCase()
    const nameMatch = !searchQuery || fullName.includes(searchQuery.toLowerCase()) || (p.titoli || '').toLowerCase().includes(searchQuery.toLowerCase())
    const cityMatch = !cityFilter || (p.citta || '').toLowerCase().includes(cityFilter.toLowerCase())
    return nameMatch && cityMatch
  })

  return (
    <div className="page">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))',
        padding: 'calc(env(safe-area-inset-top) + 16px) 16px 20px',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <Users size={22} color="white" />
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'white', fontWeight: 300 }}>
              {t('dietitian.title')}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>
              {profiles.length > 0 ? `${profiles.length} professionisti disponibili` : 'Professionisti della nutrizione'}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ padding: '14px 14px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Name/title search */}
        <div style={{ position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="input-field"
            placeholder={t('common.search')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: 36, paddingRight: searchQuery ? 36 : 14 }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* City filter */}
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <MapPin size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="input-field"
              placeholder="Filtra per città…"
              value={cityFilter}
              onChange={e => setCityFilter(e.target.value)}
              style={{ paddingLeft: 36, paddingRight: cityFilter ? 36 : 14 }}
              list="cities-datalist"
            />
            {cityFilter && (
              <button onClick={() => setCityFilter('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}>
                <X size={14} />
              </button>
            )}
            <datalist id="cities-datalist">
              {cities.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>
          <button
            onClick={detectCity}
            disabled={locating}
            title="Usa la mia posizione"
            style={{
              flexShrink: 0, height: 42, padding: '0 12px',
              background: 'var(--green-pale)', border: '1.5px solid var(--green-main)',
              borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center',
              gap: 5, fontSize: 12, fontWeight: 600, color: 'var(--green-main)',
            }}
          >
            {locating
              ? <span style={{ width: 14, height: 14, border: '2px solid var(--green-pale)', borderTopColor: 'var(--green-main)', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'block' }} />
              : <MapPin size={14} />
            }
            {locating ? '…' : 'Vicini a me'}
          </button>
        </div>
      </div>

      {/* Results */}
      <div style={{ padding: '12px 14px 0' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>
            <div style={{ width: 26, height: 26, border: '3px solid var(--border)', borderTopColor: 'var(--green-main)', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 12px' }} />
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t('common.loading')}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>{t('common.no_data')}</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {profiles.length === 0
                ? t('dietitian.no_dietitian')
                : 'Prova a cambiare i filtri di ricerca.'}
            </p>
            {(searchQuery || cityFilter) && (
              <button onClick={() => { setSearchQuery(''); setCityFilter('') }} style={{ marginTop: 14, background: 'var(--green-pale)', border: 'none', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', fontSize: 13, color: 'var(--green-main)', fontWeight: 600 }}>
                Rimuovi filtri
              </button>
            )}
          </div>
        ) : (
          <>
            {(searchQuery || cityFilter) && (
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
                {filtered.length} risultat{filtered.length === 1 ? 'o' : 'i'}
              </p>
            )}
            {filtered.map(p => <DietitianCard key={p.id} profile={p} />)}
          </>
        )}
      </div>
    </div>
  )
}
