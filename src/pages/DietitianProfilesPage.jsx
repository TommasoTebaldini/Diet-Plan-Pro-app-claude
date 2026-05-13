import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useT } from '../i18n'
import { Search, MapPin, Phone, Mail, Globe, Users, X, ChevronRight, Crosshair, SlidersHorizontal } from 'lucide-react'

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371
  const toRad = x => x * Math.PI / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

function DietitianCard({ profile, onClick }) {
  const initials = `${profile.nome?.[0] || ''}${profile.cognome?.[0] || ''}`.toUpperCase() || '?'

  return (
    <button
      onClick={onClick}
      style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, marginBottom: 10, cursor: 'pointer', display: 'block' }}
    >
      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url} alt={[profile.nome, profile.cognome].filter(Boolean).join(' ')}
              style={{ width: 54, height: 54, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid var(--border-light)' }}
            />
          ) : (
            <div style={{
              width: 54, height: 54, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, var(--green-main), var(--green-mid))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 700, color: 'white',
            }}>
              {initials}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 2 }}>
              <p style={{ fontSize: 16, fontWeight: 700 }}>
                {[profile.nome, profile.cognome].filter(Boolean).join(' ')}
              </p>
              <ChevronRight size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            </div>
            {profile.titoli && (
              <p style={{ fontSize: 12, color: 'var(--green-main)', fontWeight: 500, marginBottom: 4 }}>
                {profile.titoli}
              </p>
            )}
            {profile.citta && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                <MapPin size={11} color="var(--text-muted)" />
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {profile.citta}
                  {profile._distance != null && (
                    <span style={{ color: 'var(--green-main)', fontWeight: 600 }}> · {profile._distance < 1 ? '<1' : Math.round(profile._distance)} km</span>
                  )}
                </span>
              </div>
            )}
            {profile.descrizione && (
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {profile.descrizione}
              </p>
            )}
          </div>
        </div>

        {(profile.telefono || profile.email_contatto || profile.sito_web) && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }} onClick={e => e.stopPropagation()}>
            {profile.telefono && (
              <a href={`tel:${profile.telefono}`} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 500, color: 'var(--green-dark)', textDecoration: 'none', background: 'var(--green-pale)', padding: '6px 11px', borderRadius: 8 }}>
                <Phone size={12} /> {profile.telefono}
              </a>
            )}
            {profile.email_contatto && (
              <a href={`mailto:${profile.email_contatto}`} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 500, color: 'var(--green-dark)', textDecoration: 'none', background: 'var(--green-pale)', padding: '6px 11px', borderRadius: 8 }}>
                <Mail size={12} /> Scrivi
              </a>
            )}
            {profile.sito_web && (
              <a href={profile.sito_web.startsWith('http') ? profile.sito_web : `https://${profile.sito_web}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', textDecoration: 'none', background: 'var(--surface-2)', padding: '6px 11px', borderRadius: 8, border: '1px solid var(--border-light)' }}>
                <Globe size={12} /> Sito web
              </a>
            )}
          </div>
        )}
      </div>
    </button>
  )
}

export default function DietitianProfilesPage() {
  const t = useT()
  const navigate = useNavigate()
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [cities, setCities] = useState([])

  // "Vicini a me" state
  const [nearMode, setNearMode] = useState(false)
  const [locQuery, setLocQuery] = useState('')
  const [locCoords, setLocCoords] = useState(null)
  const [maxDistance, setMaxDistance] = useState(25)
  const [locating, setLocating] = useState(false)
  const [locError, setLocError] = useState('')
  const locInputRef = useRef(null)

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

  async function detectMyLocation() {
    if (!navigator.geolocation) { setLocError('Geolocalizzazione non supportata.'); return }
    setLocating(true); setLocError('')
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        setLocCoords({ lat: coords.latitude, lon: coords.longitude })
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json&accept-language=it`,
            { headers: { 'Accept-Language': 'it' } }
          )
          const data = await res.json()
          const city = data.address?.city || data.address?.town || data.address?.village || ''
          setLocQuery(city || `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`)
        } catch {}
        setLocating(false)
      },
      () => { setLocError('Impossibile rilevare la posizione. Digita la tua città.'); setLocating(false) }
    )
  }

  async function geocodeLocQuery() {
    const q = locQuery.trim()
    if (!q) return
    setLocating(true); setLocError('')
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&accept-language=it`
      )
      const data = await res.json()
      if (data.length > 0) {
        setLocCoords({ lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) })
      } else {
        setLocError('Luogo non trovato. Prova con una città.')
      }
    } catch { setLocError('Errore di rete.') }
    setLocating(false)
  }

  function toggleNearMode() {
    const next = !nearMode
    setNearMode(next)
    if (next) {
      setLocCoords(null); setLocError('')
      setTimeout(() => locInputRef.current?.focus(), 100)
      detectMyLocation()
    } else {
      setLocCoords(null); setLocQuery(''); setLocError('')
    }
  }

  const filtered = profiles
    .map(p => {
      let _distance = null
      if (nearMode && locCoords && p.latitude && p.longitude) {
        _distance = haversine(locCoords.lat, locCoords.lon, p.latitude, p.longitude)
      }
      return { ...p, _distance }
    })
    .filter(p => {
      const fullName = `${p.nome || ''} ${p.cognome || ''}`.toLowerCase()
      const nameMatch = !searchQuery || fullName.includes(searchQuery.toLowerCase()) || (p.titoli || '').toLowerCase().includes(searchQuery.toLowerCase())

      let locationMatch = true
      if (nearMode && locCoords) {
        // Distance filter using coordinates
        locationMatch = p._distance != null ? p._distance <= maxDistance : false
      } else if (cityFilter) {
        locationMatch = (p.citta || '').toLowerCase().includes(cityFilter.toLowerCase())
      }

      return nameMatch && locationMatch
    })
    .sort((a, b) => {
      if (nearMode && a._distance != null && b._distance != null) return a._distance - b._distance
      return 0
    })

  return (
    <div className="page">
      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg, var(--green-dark), var(--green-main))', padding: 'calc(env(safe-area-inset-top) + 16px) 16px 20px', flexShrink: 0 }}>
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
        {/* Search */}
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

        {/* City + Near me row */}
        {!nearMode && (
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <MapPin size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="input-field"
                placeholder={t('dietitian.filter_city')}
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
              onClick={toggleNearMode}
              title="Vicini a me"
              style={{
                flexShrink: 0, height: 42, padding: '0 14px',
                background: 'var(--green-pale)', border: '1.5px solid var(--green-main)',
                borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center',
                gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--green-main)',
                fontFamily: 'var(--font-b)',
              }}
            >
              <MapPin size={14} />
              {t('dietitian.near_me')}
            </button>
          </div>
        )}

        {/* "Vicini a me" expanded panel */}
        {nearMode && (
          <div style={{ background: 'var(--green-pale)', border: '1.5px solid var(--green-main)', borderRadius: 12, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--green-dark)' }}>
                <MapPin size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                Vicini a me
              </p>
              <button
                onClick={toggleNearMode}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}
              ><X size={14} /></button>
            </div>

            {/* Location input */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <MapPin size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--green-main)' }} />
                <input
                  ref={locInputRef}
                  className="input-field"
                  placeholder="La tua città o indirizzo"
                  value={locQuery}
                  onChange={e => { setLocQuery(e.target.value); setLocError('') }}
                  onKeyDown={e => e.key === 'Enter' && geocodeLocQuery()}
                  style={{ paddingLeft: 32 }}
                />
              </div>
              <button
                onClick={detectMyLocation}
                disabled={locating}
                title="Rileva posizione automaticamente"
                style={{
                  flexShrink: 0, width: 42, height: 42,
                  background: 'var(--green-main)', border: 'none', borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'white',
                }}
              >
                {locating
                  ? <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'block' }} />
                  : <Crosshair size={16} />
                }
              </button>
              <button
                onClick={geocodeLocQuery}
                disabled={locating || !locQuery.trim()}
                style={{
                  flexShrink: 0, height: 42, padding: '0 12px',
                  background: 'var(--green-main)', border: 'none', borderRadius: 10,
                  fontSize: 12, fontWeight: 700, color: 'white', cursor: 'pointer',
                  fontFamily: 'var(--font-b)', opacity: (!locQuery.trim() || locating) ? 0.5 : 1,
                }}
              >Cerca</button>
            </div>

            {locError && <p style={{ fontSize: 12, color: 'var(--red)', marginBottom: 8 }}>{locError}</p>}

            {/* Distance slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <SlidersHorizontal size={13} color="var(--green-dark)" />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--green-dark)', whiteSpace: 'nowrap' }}>Max distanza</span>
              <input
                type="range" min={5} max={100} step={5}
                value={maxDistance}
                onChange={e => setMaxDistance(Number(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--green-main)' }}
              />
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--green-main)', minWidth: 52, textAlign: 'right', fontFamily: 'var(--font-b)' }}>
                {maxDistance} km
              </span>
            </div>

            {locCoords ? (
              <p style={{ fontSize: 11, color: 'var(--green-main)', marginTop: 8, fontWeight: 500 }}>
                ✓ Posizione rilevata — {filtered.length} dietist{filtered.length === 1 ? 'a' : 'i'} entro {maxDistance} km
              </p>
            ) : (
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
                Inserisci la tua posizione per vedere i dietisti vicini
              </p>
            )}
          </div>
        )}
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
              {nearMode && locCoords
                ? `Nessun dietista trovato entro ${maxDistance} km dalla tua posizione.`
                : profiles.length === 0 ? t('dietitian.no_dietitian') : t('dietitian.change_filters')
              }
            </p>
            {nearMode && locCoords && (
              <button
                onClick={() => setMaxDistance(m => Math.min(m + 25, 100))}
                style={{ marginTop: 14, background: 'var(--green-pale)', border: 'none', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', fontSize: 13, color: 'var(--green-main)', fontWeight: 600, fontFamily: 'var(--font-b)' }}
              >
                Aumenta il raggio a {Math.min(maxDistance + 25, 100)} km
              </button>
            )}
            {(searchQuery || cityFilter) && !nearMode && (
              <button onClick={() => { setSearchQuery(''); setCityFilter('') }} style={{ marginTop: 14, background: 'var(--green-pale)', border: 'none', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', fontSize: 13, color: 'var(--green-main)', fontWeight: 600, fontFamily: 'var(--font-b)' }}>
                Rimuovi filtri
              </button>
            )}
          </div>
        ) : (
          <>
            {(searchQuery || cityFilter || (nearMode && locCoords)) && (
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
                {filtered.length} risultat{filtered.length === 1 ? 'o' : 'i'}
                {nearMode && locCoords ? ` entro ${maxDistance} km` : ''}
              </p>
            )}
            {filtered.map(p => (
              <DietitianCard
                key={p.id}
                profile={p}
                onClick={() => navigate(`/dietisti/${p.dietitian_id}`)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
