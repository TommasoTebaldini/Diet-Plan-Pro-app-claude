import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useT } from '../i18n'
import { Search, MapPin, Phone, Mail, Globe, Users, X, ChevronRight, Crosshair, SlidersHorizontal, Star, Clock, Award } from 'lucide-react'
import { motion } from 'framer-motion'

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371
  const toRad = x => x * Math.PI / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

function AvatarCircle({ profile, size = 60 }) {
  const initials = `${profile.nome?.[0] || ''}${profile.cognome?.[0] || ''}`.toUpperCase() || '?'
  const colors = [
    'linear-gradient(135deg,#0F766E,#14B8A6)',
    'linear-gradient(135deg,#1D4ED8,#3B82F6)',
    'linear-gradient(135deg,#7C3AED,#A78BFA)',
    'linear-gradient(135deg,#B45309,#F59E0B)',
    'linear-gradient(135deg,#065F46,#10B981)',
  ]
  const colorIdx = (profile.nome || '').charCodeAt(0) % colors.length
  if (profile.avatar_url) {
    return (
      <img src={profile.avatar_url} alt={[profile.nome, profile.cognome].filter(Boolean).join(' ')} loading="lazy"
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2.5px solid var(--border-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }} />
    )
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: colors[colorIdx],
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 700, color: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.13)',
    }}>
      {initials}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="card" style={{ padding: 16, marginBottom: 10 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <div className="skeleton" style={{ width: 60, height: 60, borderRadius: '50%', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: 16, borderRadius: 6, width: '55%', marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 12, borderRadius: 4, width: '40%', marginBottom: 6 }} />
          <div className="skeleton" style={{ height: 11, borderRadius: 4, width: '70%' }} />
        </div>
      </div>
    </div>
  )
}

function DietitianCard({ profile, onClick, index }) {
  const fullName = [profile.nome, profile.cognome].filter(Boolean).join(' ')

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.28 }}
      whileTap={{ scale: 0.985 }}
      style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, marginBottom: 10, cursor: 'pointer', display: 'block' }}
    >
      <div className="card" style={{ padding: '16px 16px 14px', transition: 'box-shadow .15s, transform .15s' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <AvatarCircle profile={profile} size={60} />
            <div style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 16, height: 16, borderRadius: '50%',
              background: '#22c55e', border: '2px solid var(--surface)',
            }} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6, marginBottom: 2 }}>
              <p style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>{fullName}</p>
              <ChevronRight size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
            </div>

            {profile.titoli && (
              <p style={{ fontSize: 12, color: 'var(--green-main)', fontWeight: 600, marginBottom: 5 }}>
                {profile.titoli}
              </p>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginBottom: profile.descrizione ? 8 : 0 }}>
              {profile.citta && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <MapPin size={11} color="var(--text-muted)" />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {profile.citta}
                    {profile._distance != null && (
                      <span style={{ color: 'var(--green-main)', fontWeight: 600 }}> · {profile._distance < 1 ? '<1' : Math.round(profile._distance)} km</span>
                    )}
                  </span>
                </div>
              )}
            </div>

            {profile.descrizione && (
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {profile.descrizione}
              </p>
            )}
          </div>
        </div>

        {(profile.telefono || profile.email_contatto || profile.sito_web) && (
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border-light)' }} onClick={e => e.stopPropagation()}>
            {profile.telefono && (
              <a href={`tel:${profile.telefono}`} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: 'var(--green-dark)', textDecoration: 'none', background: 'var(--green-pale)', padding: '6px 12px', borderRadius: 8, border: '1px solid var(--alert-success-border)' }}>
                <Phone size={12} /> {profile.telefono}
              </a>
            )}
            {profile.email_contatto && (
              <a href={`mailto:${profile.email_contatto}`} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: 'var(--green-dark)', textDecoration: 'none', background: 'var(--green-pale)', padding: '6px 12px', borderRadius: 8, border: '1px solid var(--alert-success-border)' }}>
                <Mail size={12} /> Email
              </a>
            )}
            {profile.sito_web && (
              <a href={profile.sito_web.startsWith('http') ? profile.sito_web : `https://${profile.sito_web}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none', background: 'var(--surface-3)', padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border-light)' }}>
                <Globe size={12} /> Sito web
              </a>
            )}
          </div>
        )}
      </div>
    </motion.button>
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
      {/* ── Hero header ── */}
      <div style={{
        background: 'linear-gradient(160deg, #134E4A 0%, #0F766E 50%, #0D9488 100%)',
        padding: 'calc(env(safe-area-inset-top) + 20px) 20px 24px',
        position: 'relative', overflow: 'hidden', flexShrink: 0,
      }}>
        <div style={{ position: 'absolute', top: -40, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -30, left: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} color="white" />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-d)', fontSize: 22, color: 'white', fontWeight: 300, lineHeight: 1 }}>
                {t('dietitian.title')}
              </h1>
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.70)', fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>
            Trova il professionista della nutrizione più adatto a te
          </p>

          {/* Search bar inside header */}
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }} />
            <input
              className="input-field"
              placeholder="Cerca per nome o specializzazione…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 36, paddingRight: searchQuery ? 36 : 14, background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.25)', color: 'white', borderRadius: 12 }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', padding: 2 }}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Stats row */}
        {!loading && profiles.length > 0 && (
          <div style={{ display: 'flex', gap: 10, marginTop: 14, position: 'relative', zIndex: 1 }}>
            <div style={{ background: 'rgba(255,255,255,0.13)', borderRadius: 10, padding: '8px 14px', flex: 1, textAlign: 'center' }}>
              <p style={{ color: 'white', fontWeight: 800, fontSize: 20, lineHeight: 1 }}>{profiles.length}</p>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10, marginTop: 2 }}>Professionisti</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.13)', borderRadius: 10, padding: '8px 14px', flex: 1, textAlign: 'center' }}>
              <p style={{ color: 'white', fontWeight: 800, fontSize: 20, lineHeight: 1 }}>{cities.length}</p>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10, marginTop: 2 }}>Città</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.13)', borderRadius: 10, padding: '8px 14px', flex: 1, textAlign: 'center' }}>
              <p style={{ color: 'white', fontWeight: 800, fontSize: 20, lineHeight: 1 }}>100%</p>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10, marginTop: 2 }}>Qualificati</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Filters ── */}
      <div style={{ padding: '12px 14px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {!nearMode ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <MapPin size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="input-field"
                placeholder={t('dietitian.filter_city')}
                value={cityFilter}
                onChange={e => setCityFilter(e.target.value)}
                style={{ paddingLeft: 32, paddingRight: cityFilter ? 32 : 12, fontSize: 13 }}
                list="cities-datalist"
              />
              {cityFilter && (
                <button onClick={() => setCityFilter('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}>
                  <X size={13} />
                </button>
              )}
              <datalist id="cities-datalist">
                {cities.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
            <button
              onClick={toggleNearMode}
              style={{
                flexShrink: 0, height: 42, padding: '0 13px',
                background: 'var(--green-pale)', border: '1.5px solid var(--green-main)',
                borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center',
                gap: 5, fontSize: 13, fontWeight: 600, color: 'var(--green-dark)',
                fontFamily: 'var(--font-b)',
              }}
            >
              <Crosshair size={14} />
              Vicini a me
            </button>
          </div>
        ) : (
          <div style={{ background: 'var(--green-pale)', border: '1.5px solid var(--green-main)', borderRadius: 12, padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--green-dark)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Crosshair size={13} /> Vicini a me
              </p>
              <button onClick={toggleNearMode} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}>
                <X size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: 7, marginBottom: 10 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <MapPin size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--green-main)' }} />
                <input
                  ref={locInputRef}
                  className="input-field"
                  placeholder="La tua città o indirizzo"
                  value={locQuery}
                  onChange={e => { setLocQuery(e.target.value); setLocError('') }}
                  onKeyDown={e => e.key === 'Enter' && geocodeLocQuery()}
                  style={{ paddingLeft: 30, fontSize: 13 }}
                />
              </div>
              <button
                onClick={detectMyLocation}
                disabled={locating}
                style={{ flexShrink: 0, width: 42, height: 42, background: 'var(--green-main)', border: 'none', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
              >
                {locating
                  ? <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'block' }} />
                  : <Crosshair size={15} />}
              </button>
              <button
                onClick={geocodeLocQuery}
                disabled={locating || !locQuery.trim()}
                style={{ flexShrink: 0, height: 42, padding: '0 12px', background: 'var(--green-main)', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 700, color: 'white', cursor: 'pointer', fontFamily: 'var(--font-b)', opacity: (!locQuery.trim() || locating) ? 0.5 : 1 }}
              >
                Cerca
              </button>
            </div>

            {locError && <p style={{ fontSize: 12, color: 'var(--red)', marginBottom: 8 }}>{locError}</p>}

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <SlidersHorizontal size={12} color="var(--green-dark)" />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--green-dark)', whiteSpace: 'nowrap' }}>Max distanza</span>
              <input type="range" min={5} max={100} step={5} value={maxDistance} onChange={e => setMaxDistance(Number(e.target.value))} style={{ flex: 1, accentColor: 'var(--green-main)' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--green-main)', minWidth: 48, textAlign: 'right', fontFamily: 'var(--font-b)' }}>{maxDistance} km</span>
            </div>

            {locCoords ? (
              <p style={{ fontSize: 11, color: 'var(--green-main)', marginTop: 8, fontWeight: 600 }}>
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

      {/* ── Results ── */}
      <div style={{ padding: '10px 14px 16px' }}>
        {loading ? (
          <div>
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <div className="animate-bounceEmoji" style={{ fontSize: 48, marginBottom: 14 }}>🔍</div>
            <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{t('common.no_data')}</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 280, margin: '0 auto' }}>
              {nearMode && locCoords
                ? `Nessun dietista trovato entro ${maxDistance} km dalla tua posizione.`
                : profiles.length === 0 ? t('dietitian.no_dietitian') : t('dietitian.change_filters')
              }
            </p>
            {nearMode && locCoords && (
              <button onClick={() => setMaxDistance(m => Math.min(m + 25, 100))} style={{ marginTop: 16, background: 'var(--green-pale)', border: '1.5px solid var(--green-main)', borderRadius: 12, padding: '10px 20px', cursor: 'pointer', fontSize: 13, color: 'var(--green-main)', fontWeight: 600, fontFamily: 'var(--font-b)' }}>
                Aumenta il raggio a {Math.min(maxDistance + 25, 100)} km
              </button>
            )}
            {(searchQuery || cityFilter) && !nearMode && (
              <button onClick={() => { setSearchQuery(''); setCityFilter('') }} style={{ marginTop: 16, background: 'var(--green-pale)', border: '1.5px solid var(--green-main)', borderRadius: 12, padding: '10px 20px', cursor: 'pointer', fontSize: 13, color: 'var(--green-main)', fontWeight: 600, fontFamily: 'var(--font-b)' }}>
                Rimuovi filtri
              </button>
            )}
          </div>
        ) : (
          <>
            {(searchQuery || cityFilter || (nearMode && locCoords)) && (
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                {filtered.length} risultat{filtered.length === 1 ? 'o' : 'i'}
                {nearMode && locCoords ? ` entro ${maxDistance} km` : ''}
              </p>
            )}
            {filtered.map((p, i) => (
              <DietitianCard
                key={p.id}
                profile={p}
                index={i}
                onClick={() => navigate(`/dietisti/${p.dietitian_id}`)}
              />
            ))}

            {/* Trust footer */}
            <div style={{ marginTop: 8, padding: '14px 16px', background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border-light)', display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Award size={20} color="var(--green-main)" />
              </div>
              <div>
                <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                  Professionisti verificati
                </p>
                <p style={{ fontSize: 11.5, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Tutti i dietisti sono professionisti sanitari abilitati con partita IVA e iscrizione all'Ordine.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
