import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import Logo from '../assets/Logo'
import stateData from '../data/stateData'

const states = ['All States', ...Object.keys(stateData)]

const categories = [
  'All', 'Accountant', 'Lawyer', 'Doctor/Nurse', 'Event Planner', 'Photographer',
  'Makeup Artist', 'Tailor', 'Plumber', 'Electrician', 'Carpenter', 'Welder',
  'Painter', 'Tiler', 'Mason', 'Generator Repair', 'AC Repair', 'Vulcanizer',
  'Cleaner', 'Laundry', 'Cook/Chef', 'Nanny', 'Security Guard', 'Fumigation',
  'Waste Disposal', 'Local Food Seller', 'Restaurant', 'Caterer', 'Foodstuff Seller',
  'Provisions', 'Livestock Seller', 'Fresh Produce', 'Fabric/Ankara Seller',
  'Graphic Designer', 'Video Editor', 'CV Writer', 'Lesson Teacher', 'Web Developer',
  'Data Analyst', 'Dispatch Rider', 'Truck Driver', 'Keke/Taxi', 'Haulage',
  'Moving/Relocation', 'Social Media Manager', 'Printer', 'Signage Maker',
  'POS Agent', 'Bulk SMS',
]

export default function Browse() {
  const [providers, setProviders] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [selectedState, setSelectedState] = useState('All States')
  const [selectedLga, setSelectedLga] = useState('All LGAs')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProviders = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'provider')
        .not('category', 'is', null)
      setProviders(data || [])
      setLoading(false)
    }
    fetchProviders()
  }, [])

  const lgasForState = selectedState !== 'All States' ? stateData[selectedState] : []

  const filtered = providers.filter(p => {
    const nameMatch = (p.full_name || '').toLowerCase().includes(search.toLowerCase())
    const catMatch = category === 'All' || p.category === category
    const cityLower = (p.city || '').toLowerCase()

    let locationMatch = true
    if (selectedLga !== 'All LGAs') {
      locationMatch = cityLower === selectedLga.toLowerCase()
    } else if (selectedState !== 'All States') {
      const lgaSet = (stateData[selectedState] || []).map(l => l.toLowerCase())
      locationMatch = cityLower === selectedState.toLowerCase() || lgaSet.includes(cityLower)
    }

    return nameMatch && catMatch && locationMatch
  })

  const handleStateChange = (state) => {
    setSelectedState(state)
    setSelectedLga('All LGAs')
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', background: '#060d1a', color: 'white' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .syne { font-family: 'Syne', sans-serif; }

        .top-nav {
          background: rgba(6,13,26,0.8);
          backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 16px 36px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .top-nav::after {
          content: '';
          position: absolute;
          bottom: 0; left: 5%; right: 5%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,191,165,0.5), rgba(255,107,74,0.3), transparent);
        }

        .search-field {
          flex: 1;
          padding: 13px 18px;
          background: rgba(255,255,255,0.06);
          border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        .search-field::placeholder { color: rgba(255,255,255,0.25); }
        .search-field:focus {
          outline: none;
          border-color: #00BFA5;
          background: rgba(0,191,165,0.05);
          box-shadow: 0 0 0 4px rgba(0,191,165,0.08);
        }

        .state-select {
          padding: 9px 14px;
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(255,255,255,0.4)' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
          padding-right: 32px;
          transition: all 0.3s ease;
        }
        .state-select:focus {
          outline: none;
          border-color: #FF6B4A;
          background-color: rgba(255,107,74,0.06);
          box-shadow: 0 0 0 3px rgba(255,107,74,0.1);
        }
        .state-select option { background: #0A2540; color: white; }

        .lga-pill {
          padding: 7px 16px;
          border-radius: 100px;
          border: 1.5px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.5);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.25s ease;
        }
        .lga-pill:hover { background: rgba(255,255,255,0.08); color: white; }
        .lga-pill.active {
          background: rgba(255,107,74,0.12);
          border-color: #FF6B4A;
          color: #FF6B4A;
        }

        .cat-pill {
          padding: 7px 16px;
          border-radius: 100px;
          border: 1.5px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.5);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.25s ease;
        }
        .cat-pill:hover { background: rgba(255,255,255,0.08); color: white; }
        .cat-pill.active {
          background: #0A2540;
          border-color: #00BFA5;
          color: #00BFA5;
        }

        .filter-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }
        .filter-tag-location {
          background: rgba(255,107,74,0.1);
          border: 1px solid rgba(255,107,74,0.3);
          color: #FF6B4A;
        }
        .filter-tag-cat {
          background: rgba(0,191,165,0.08);
          border: 1px solid rgba(0,191,165,0.25);
          color: #00BFA5;
        }

        .provider-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          padding: 22px;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
          position: relative;
          overflow: hidden;
        }
        .provider-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,191,165,0.05), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .provider-card:hover {
          transform: translateY(-6px);
          border-color: rgba(0,191,165,0.25);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .provider-card:hover::before { opacity: 1; }

        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #0A2540, #00BFA5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 900;
          font-size: 20px;
          color: white;
          flex-shrink: 0;
          box-shadow: 0 0 16px rgba(0,191,165,0.2);
        }

        .tag {
          display: inline-block;
          background: rgba(0,191,165,0.1);
          color: #00BFA5;
          padding: 3px 10px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
        }

        .view-btn {
          width: 100%;
          padding: 10px;
          background: linear-gradient(135deg, #FF6B4A, #e55a3a);
          color: white;
          border: none;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 14px rgba(255,107,74,0.2);
        }
        .view-btn:hover { transform: translateY(-1px); box-shadow: 0 0 24px rgba(255,107,74,0.4); }

        .spin {
          width: 40px; height: 40px;
          border: 3px solid rgba(255,255,255,0.06);
          border-top-color: #00BFA5;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .register-btn {
          padding: 13px 28px;
          background: linear-gradient(135deg, #FF6B4A, #e55a3a);
          color: white;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 20px rgba(255,107,74,0.25);
        }
        .register-btn:hover { transform: translateY(-2px); box-shadow: 0 0 35px rgba(255,107,74,0.4); }
      `}</style>

      {/* Navbar */}
      <div className="top-nav">
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <Logo size={34} />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => navigate('/login')}
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)', padding: '8px 18px', borderRadius: 10, fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.3s' }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >Login</button>
          <button
            onClick={() => navigate('/register')}
            style={{ background: 'linear-gradient(135deg, #FF6B4A, #e55a3a)', color: 'white', border: 'none', padding: '8px 18px', borderRadius: 10, fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 0 14px rgba(255,107,74,0.25)' }}
          >Register</button>
        </div>
      </div>

      {/* Hero search */}
      <div style={{ background: 'linear-gradient(135deg, #0A2540 0%, #060d1a 100%)', padding: '48px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(0,191,165,0.08) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <p className="syne" style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, color: 'white', marginBottom: 6 }}>Find a Service Provider</p>
          <p style={{ color: 'rgba(255,255,255,0.35)', marginBottom: 24, fontSize: 14 }}>Browse verified professionals across Nigeria</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="search-field"
              type="text"
              placeholder="Search by name or service..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button style={{ padding: '13px 20px', borderRadius: 12, background: '#FF6B4A', color: 'white', border: 'none', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 0 18px rgba(255,107,74,0.3)' }}>
              Search
            </button>
          </div>
        </div>
      </div>

      {/* State + LGA filter */}
      <div style={{ background: 'rgba(6,13,26,0.98)', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '10px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', flexShrink: 0 }}>State</span>
          <select
            className="state-select"
            value={selectedState}
            onChange={e => handleStateChange(e.target.value)}
          >
            {states.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {selectedState !== 'All States' && (
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', flex: 1 }}>
              <button
                className={`lga-pill ${selectedLga === 'All LGAs' ? 'active' : ''}`}
                onClick={() => setSelectedLga('All LGAs')}
              >All LGAs</button>
              {lgasForState.map(lga => (
                <button
                  key={lga}
                  className={`lga-pill ${selectedLga === lga ? 'active' : ''}`}
                  onClick={() => setSelectedLga(lga)}
                >{lga}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category pills */}
      <div style={{ background: 'rgba(6,13,26,0.95)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '10px 24px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 8, minWidth: 'max-content', alignItems: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', marginRight: 4, flexShrink: 0 }}>Category</span>
          {categories.map(cat => (
            <button key={cat} className={`cat-pill ${category === cat ? 'active' : ''}`} onClick={() => setCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 24px' }}>

        {/* Active filter tags */}
        {(selectedState !== 'All States' || category !== 'All') && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Filters:</span>
            {selectedState !== 'All States' && (
              <button className="filter-tag filter-tag-location" onClick={() => handleStateChange('All States')}>
                {selectedLga !== 'All LGAs' ? `📍 ${selectedLga}, ${selectedState}` : `📍 ${selectedState}`}
                <span style={{ opacity: 0.7 }}>✕</span>
              </button>
            )}
            {category !== 'All' && (
              <button className="filter-tag filter-tag-cat" onClick={() => setCategory('All')}>
                {category} <span style={{ opacity: 0.7 }}>✕</span>
              </button>
            )}
            <button
              onClick={() => { handleStateChange('All States'); setCategory('All') }}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', padding: '4px 8px' }}
            >Clear all</button>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div className="spin"></div>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>Loading providers...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
            <p className="syne" style={{ fontSize: 24, fontWeight: 800, color: 'white', marginBottom: 8 }}>No providers found</p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginBottom: 24 }}>
              {selectedState !== 'All States' && category !== 'All'
                ? `No ${category} providers in ${selectedLga !== 'All LGAs' ? selectedLga : selectedState} yet.`
                : selectedState !== 'All States'
                ? `No providers in ${selectedLga !== 'All LGAs' ? selectedLga : selectedState} yet. Be the first to list your service there!`
                : category !== 'All'
                ? `No ${category} providers listed yet. Be the first!`
                : 'Be the first to list your service on Ugele Online!'}
            </p>
            <button className="register-btn" onClick={() => navigate('/register')}>Register as a Provider</button>
          </div>
        ) : (
          <>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 20 }}>
              {filtered.length} provider{filtered.length !== 1 ? 's' : ''} found
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {filtered.map(provider => (
                <div key={provider.id} className="provider-card" onClick={() => navigate('/provider/' + provider.id)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div className="avatar">{(provider.full_name || 'U')[0].toUpperCase()}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'white', fontSize: 15, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{provider.full_name}</p>
                      <span className="tag">{provider.category}</span>
                    </div>
                  </div>
                  {provider.bio && (
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, lineHeight: 1.6, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{provider.bio}</p>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12, marginBottom: 12 }}>
                    <div>
                      {provider.city && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>📍 {provider.city}</p>}
                      {provider.price && <p style={{ color: '#00BFA5', fontWeight: 700, fontSize: 14, marginTop: 2 }}>From ₦{provider.price}</p>}
                    </div>
                  </div>
                  <button className="view-btn">View Profile →</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
