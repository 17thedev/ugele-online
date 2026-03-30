import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import Logo from '../assets/Logo'

const CATEGORY_GROUPS = [
  {
    key: 'professional', label: 'Professional', icon: '💼',
    items: ['Accountant', 'Lawyer', 'Doctor/Nurse', 'Event Planner', 'Photographer', 'Makeup Artist']
  },
  {
    key: 'trades', label: 'Trades', icon: '🔧',
    items: ['Tailor', 'Plumber', 'Electrician', 'Carpenter', 'Welder', 'Painter', 'Tiler', 'Mason', 'Generator Repair', 'AC Repair', 'Vulcanizer']
  },
  {
    key: 'services', label: 'Services', icon: '🧹',
    items: ['Cleaner', 'Laundry', 'Cook/Chef', 'Nanny', 'Security Guard', 'Fumigation', 'Waste Disposal']
  },
  {
    key: 'food', label: 'Food & Market', icon: '🍽️',
    items: ['Local Food Seller', 'Restaurant', 'Caterer', 'Foodstuff Seller', 'Provisions', 'Livestock Seller', 'Fresh Produce']
  },
  {
    key: 'digital', label: 'Digital', icon: '💻',
    items: ['Graphic Designer', 'Video Editor', 'CV Writer', 'Lesson Teacher', 'Web Developer', 'Data Analyst', 'Social Media Manager']
  },
  {
    key: 'transport', label: 'Transport', icon: '🚗',
    items: ['Dispatch Rider', 'Truck Driver', 'Keke/Taxi', 'Haulage', 'Moving/Relocation']
  },
  {
    key: 'other', label: 'Other', icon: '📦',
    items: ['Fabric/Ankara Seller', 'Printer', 'Signage Maker', 'POS Agent', 'Bulk SMS']
  },
]

async function reverseGeocode(lat, lon) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
    { headers: { 'User-Agent': 'ugele-online-app/1.0' } }
  )
  const data = await res.json()
  return data.address?.city || data.address?.town || data.address?.village || data.address?.county || null
}

function cityMatch(providerCity, userCity) {
  if (!providerCity || !userCity) return false
  const a = providerCity.toLowerCase().trim()
  const b = userCity.toLowerCase().trim()
  return a.includes(b) || b.includes(a)
}

export default function Browse() {
  const navigate = useNavigate()
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [geoState, setGeoState] = useState('idle') // idle | requesting | success | denied | error
  const [userCity, setUserCity] = useState(null)
  const [activeTab, setActiveTab] = useState('all') // 'nearby' | 'all'

  useEffect(() => {
    fetchProviders()
    requestLocation()
  }, [])

  const fetchProviders = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, category, city, price, bio')
      .eq('role', 'provider')
      .not('full_name', 'is', null)
      .order('full_name')
    if (!error && data) setProviders(data)
    setLoading(false)
  }

  const requestLocation = () => {
    if (!navigator.geolocation) { setGeoState('error'); return }
    setGeoState('requesting')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const city = await reverseGeocode(pos.coords.latitude, pos.coords.longitude)
          setUserCity(city)
          setGeoState('success')
          if (city) setActiveTab('nearby')
        } catch {
          setGeoState('error')
        }
      },
      () => setGeoState('denied'),
      { timeout: 8000 }
    )
  }

  const activeGroupItems = selectedGroup
    ? (CATEGORY_GROUPS.find(g => g.key === selectedGroup)?.items || [])
    : null

  const filteredProviders = providers.filter(p => {
    const matchesGroup = !activeGroupItems || activeGroupItems.includes(p.category)
    const q = searchQuery.toLowerCase()
    const matchesSearch = !q ||
      (p.full_name || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.city || '').toLowerCase().includes(q) ||
      (p.bio || '').toLowerCase().includes(q)
    return matchesGroup && matchesSearch
  })

  const nearbyProviders = filteredProviders.filter(p => cityMatch(p.city, userCity))
  const displayedProviders = activeTab === 'nearby' ? nearbyProviders : filteredProviders
  const hasActiveFilters = selectedGroup || searchQuery

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', background: '#060d1a', color: 'white' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .syne { font-family: 'Syne', sans-serif; }

        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }

        .browse-nav {
          background: rgba(6,13,26,0.85);
          backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 14px 36px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .search-input {
          flex: 1;
          padding: 16px 20px 16px 52px;
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          outline: none;
          transition: all 0.3s;
          min-width: 0;
        }
        .search-input::placeholder { color: rgba(255,255,255,0.25); }
        .search-input:focus {
          border-color: #00BFA5;
          background: rgba(0,191,165,0.05);
          box-shadow: 0 0 0 4px rgba(0,191,165,0.08);
        }

        .loc-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 20px;
          height: 52px;
          border-radius: 16px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.25s;
          border: 1.5px solid;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .cat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          padding: 20px 14px;
          cursor: pointer;
          transition: all 0.25s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-align: center;
          user-select: none;
        }
        .cat-card:hover {
          background: rgba(0,191,165,0.07);
          border-color: rgba(0,191,165,0.25);
          transform: translateY(-2px);
        }
        .cat-card.active {
          background: rgba(0,191,165,0.12);
          border-color: rgba(0,191,165,0.45);
          box-shadow: 0 0 24px rgba(0,191,165,0.1);
        }

        .tab-btn {
          padding: 9px 20px;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
        }
        .tab-btn.active {
          background: rgba(0,191,165,0.14);
          border-color: rgba(0,191,165,0.4);
          color: #00BFA5;
        }
        .tab-btn.inactive {
          background: transparent;
          border-color: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.4);
        }
        .tab-btn.inactive:hover {
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.65);
        }

        .provider-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 22px;
          cursor: pointer;
          transition: all 0.25s;
        }
        .provider-card:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(0,191,165,0.22);
          transform: translateY(-2px);
          box-shadow: 0 10px 40px rgba(0,0,0,0.35);
        }

        .book-btn {
          width: 100%;
          padding: 11px;
          background: linear-gradient(135deg, #00BFA5, #008f7a);
          color: white;
          border: none;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.25s;
          margin-top: 14px;
        }
        .book-btn:hover {
          box-shadow: 0 4px 18px rgba(0,191,165,0.35);
          transform: translateY(-1px);
        }

        .nav-btn-ghost {
          padding: 8px 18px;
          background: transparent;
          color: rgba(255,255,255,0.45);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 9px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .nav-btn-ghost:hover { color: rgba(255,255,255,0.8); border-color: rgba(255,255,255,0.2); }

        .nav-btn-teal {
          padding: 8px 18px;
          background: rgba(0,191,165,0.1);
          color: #00BFA5;
          border: 1px solid rgba(0,191,165,0.25);
          border-radius: 9px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .nav-btn-teal:hover { background: rgba(0,191,165,0.18); }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin { animation: spin 1s linear infinite; }

        @media (max-width: 900px) {
          .provider-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .browse-nav { padding: 12px 18px; }
          .hero-row { flex-direction: column !important; }
          .loc-btn { height: 48px; width: 100%; justify-content: center; }
          .cat-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .provider-grid { grid-template-columns: 1fr !important; }
          .results-header { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>

      {/* NAV */}
      <nav className="browse-nav">
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <Logo size={34} />
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="nav-btn-ghost" onClick={() => navigate('/login')}>Login</button>
          <button className="nav-btn-teal" onClick={() => navigate('/register')}>Register</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '44px 24px 100px' }}>

        {/* ── HERO ── */}
        <div style={{ marginBottom: 52 }}>
          <h1 className="syne" style={{ fontSize: 'clamp(26px, 5vw, 40px)', fontWeight: 900, marginBottom: 6, letterSpacing: '-0.5px' }}>
            Find Services <span style={{ color: '#00BFA5' }}>Near You</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.32)', fontSize: 15, marginBottom: 24 }}>
            Browse local providers across Ondo State and beyond
          </p>

          {/* Search + Location — equally prominent */}
          <div className="hero-row" style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
            {/* Search */}
            <div style={{ flex: 1, position: 'relative' }}>
              <svg style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', opacity: 0.35, pointerEvents: 'none' }}
                width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                className="search-input"
                type="text"
                placeholder="Search by name, service, or city…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Location button */}
            {geoState === 'success' && userCity ? (
              <div className="loc-btn" style={{
                background: 'rgba(0,191,165,0.08)',
                borderColor: 'rgba(0,191,165,0.3)',
                color: '#00BFA5',
                cursor: 'default',
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                {userCity}
              </div>
            ) : geoState === 'requesting' ? (
              <div className="loc-btn" style={{
                background: 'rgba(255,107,74,0.07)',
                borderColor: 'rgba(255,107,74,0.2)',
                color: 'rgba(255,107,74,0.7)',
                cursor: 'default',
              }}>
                <svg className="spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Detecting…
              </div>
            ) : (
              <button className="loc-btn" onClick={requestLocation} style={{
                background: 'rgba(255,107,74,0.07)',
                borderColor: 'rgba(255,107,74,0.25)',
                color: '#FF6B4A',
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                {geoState === 'denied' ? 'Location off' : 'Use My Location'}
              </button>
            )}
          </div>

          {geoState === 'denied' && (
            <p style={{ marginTop: 10, fontSize: 12, color: 'rgba(255,107,74,0.6)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Location access denied — enable it in your browser settings to find nearby providers
            </p>
          )}
        </div>

        {/* ── BROWSE BY CATEGORY ── */}
        <div style={{ marginBottom: 52 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 className="syne" style={{ fontSize: 22, fontWeight: 800 }}>Browse by Category</h2>
            {selectedGroup && (
              <button onClick={() => setSelectedGroup(null)} style={{
                background: 'none', border: 'none', color: '#FF6B4A',
                fontSize: 13, fontFamily: 'DM Sans, sans-serif', fontWeight: 700, cursor: 'pointer'
              }}>
                Clear ✕
              </button>
            )}
          </div>

          <div className="cat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {CATEGORY_GROUPS.map(group => (
              <div
                key={group.key}
                className={`cat-card ${selectedGroup === group.key ? 'active' : ''}`}
                onClick={() => setSelectedGroup(selectedGroup === group.key ? null : group.key)}
              >
                <span style={{ fontSize: 26, lineHeight: 1 }}>{group.icon}</span>
                <span style={{
                  fontSize: 13, fontWeight: 700,
                  color: selectedGroup === group.key ? '#00BFA5' : 'rgba(255,255,255,0.7)'
                }}>
                  {group.label}
                </span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)', marginTop: -2 }}>
                  {group.items.length} types
                </span>
              </div>
            ))}
          </div>

          {selectedGroup && (
            <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CATEGORY_GROUPS.find(g => g.key === selectedGroup)?.items.map(cat => (
                <span key={cat} style={{
                  padding: '5px 12px',
                  background: 'rgba(0,191,165,0.07)',
                  border: '1px solid rgba(0,191,165,0.18)',
                  borderRadius: 20,
                  fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 600
                }}>
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── RESULTS ── */}
        <div>
          {/* Tabs + active filter tags */}
          <div className="results-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {geoState === 'success' && userCity && (
                <button
                  className={`tab-btn ${activeTab === 'nearby' ? 'active' : 'inactive'}`}
                  onClick={() => setActiveTab('nearby')}
                >
                  📍 Nearby ({nearbyProviders.length})
                </button>
              )}
              <button
                className={`tab-btn ${activeTab === 'all' ? 'active' : 'inactive'}`}
                onClick={() => setActiveTab('all')}
              >
                All Providers ({filteredProviders.length})
              </button>
              {hasActiveFilters && (
                <button onClick={() => { setSelectedGroup(null); setSearchQuery('') }} style={{
                  background: 'none', border: 'none', color: 'rgba(255,107,74,0.65)',
                  fontSize: 12, fontFamily: 'DM Sans, sans-serif', fontWeight: 700, cursor: 'pointer'
                }}>
                  Clear filters
                </button>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              {selectedGroup && (
                <span style={{
                  padding: '4px 10px', background: 'rgba(0,191,165,0.1)',
                  border: '1px solid rgba(0,191,165,0.25)', borderRadius: 8,
                  fontSize: 12, color: '#00BFA5', fontWeight: 700
                }}>
                  {CATEGORY_GROUPS.find(g => g.key === selectedGroup)?.label}
                </span>
              )}
              {searchQuery && (
                <span style={{
                  padding: '4px 10px', background: 'rgba(255,107,74,0.08)',
                  border: '1px solid rgba(255,107,74,0.2)', borderRadius: 8,
                  fontSize: 12, color: '#FF6B4A', fontWeight: 700
                }}>
                  "{searchQuery}"
                </span>
              )}
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.2)' }}>
              <svg className="spin" style={{ display: 'inline-block', marginBottom: 14 }}
                width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              <p style={{ fontSize: 14 }}>Loading providers…</p>
            </div>
          ) : displayedProviders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontSize: 36, marginBottom: 14 }}>
                {activeTab === 'nearby' ? '📍' : '🔍'}
              </p>
              <p className="syne" style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
                {activeTab === 'nearby' ? `No providers found in ${userCity}` : 'No providers found'}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 14 }}>
                {activeTab === 'nearby'
                  ? 'Try browsing all providers instead'
                  : hasActiveFilters
                    ? 'Try adjusting your filters or search'
                    : 'No providers have registered yet'}
              </p>
              {activeTab === 'nearby' && (
                <button onClick={() => setActiveTab('all')} style={{
                  marginTop: 20, padding: '11px 26px',
                  background: 'rgba(0,191,165,0.1)', border: '1px solid rgba(0,191,165,0.25)',
                  borderRadius: 10, color: '#00BFA5',
                  fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer'
                }}>
                  Browse All Providers
                </button>
              )}
            </div>
          ) : (
            <div className="provider-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {displayedProviders.map(provider => (
                <ProviderCard key={provider.id} provider={provider} userCity={userCity} navigate={navigate} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

function ProviderCard({ provider, userCity, navigate }) {
  const initial = (provider.full_name || '?')[0].toUpperCase()
  const nearby = cityMatch(provider.city, userCity)

  return (
    <div className="provider-card" onClick={() => navigate(`/provider/${provider.id}`)}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #0A2540, #00BFA5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 18, color: 'white'
        }}>
          {initial}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontWeight: 700, fontSize: 15, color: 'white', marginBottom: 2,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}>
            {provider.full_name}
          </p>
          <p style={{ fontSize: 12, color: '#00BFA5', fontWeight: 600 }}>{provider.category}</p>
        </div>
        {nearby && (
          <span style={{
            padding: '3px 8px', background: 'rgba(0,191,165,0.1)',
            border: '1px solid rgba(0,191,165,0.25)', borderRadius: 6,
            fontSize: 10, color: '#00BFA5', fontWeight: 700, flexShrink: 0, letterSpacing: '0.04em'
          }}>
            NEARBY
          </span>
        )}
      </div>

      {provider.bio && (
        <p style={{
          fontSize: 13, color: 'rgba(255,255,255,0.32)', lineHeight: 1.55,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', marginBottom: 12
        }}>
          {provider.bio}
        </p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {provider.city ? (
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            {provider.city}
          </span>
        ) : <span />}
        {provider.price && (
          <span style={{ fontSize: 13, color: '#FF6B4A', fontWeight: 700 }}>
            from ₦{Number(provider.price).toLocaleString()}
          </span>
        )}
      </div>

      <button
        className="book-btn"
        onClick={e => { e.stopPropagation(); navigate(`/provider/${provider.id}`) }}
      >
        Book Now →
      </button>
    </div>
  )
}
