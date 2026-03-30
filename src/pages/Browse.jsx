import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import Logo from '../assets/Logo'

const stateData = {
  'Abia': ['Aba', 'Umuahia', 'Ohafia'],
  'Adamawa': ['Yola', 'Mubi', 'Numan'],
  'Akwa Ibom': ['Uyo', 'Eket', 'Ikot Ekpene'],
  'Anambra': ['Awka', 'Onitsha', 'Nnewi'],
  'Bauchi': ['Bauchi', 'Azare', 'Misau'],
  'Bayelsa': ['Yenagoa', 'Brass', 'Ogbia'],
  'Benue': ['Makurdi', 'Gboko', 'Otukpo'],
  'Borno': ['Maiduguri', 'Biu', 'Konduga'],
  'Cross River': ['Calabar', 'Ikom', 'Ogoja'],
  'Delta': ['Warri', 'Asaba', 'Sapele'],
  'Ebonyi': ['Abakaliki', 'Afikpo', 'Onueke'],
  'Edo': ['Benin City', 'Ekpoma', 'Uromi'],
  'Ekiti': ['Ado-Ekiti', 'Ikere', 'Ijero'],
  'Enugu': ['Enugu', 'Nsukka', 'Agbani'],
  'FCT Abuja': ['Garki', 'Wuse', 'Maitama', 'Gwarinpa', 'Kubwa'],
  'Gombe': ['Gombe', 'Kaltungo', 'Billiri'],
  'Imo': ['Owerri', 'Orlu', 'Okigwe'],
  'Jigawa': ['Dutse', 'Hadejia', 'Gumel'],
  'Kaduna': ['Kaduna', 'Zaria', 'Kafanchan'],
  'Kano': ['Kano', 'Wudil', 'Bichi'],
  'Katsina': ['Katsina', 'Daura', 'Funtua'],
  'Kebbi': ['Birnin Kebbi', 'Argungu', 'Yauri'],
  'Kogi': ['Lokoja', 'Okene', 'Idah'],
  'Kwara': ['Ilorin', 'Offa', 'Omu-Aran'],
  'Lagos': ['Ikeja', 'Lekki', 'Surulere', 'Yaba', 'Victoria Island', 'Badagry', 'Epe', 'Ikorodu'],
  'Nasarawa': ['Lafia', 'Keffi', 'Akwanga'],
  'Niger': ['Minna', 'Suleja', 'Bida'],
  'Ogun': ['Abeokuta', 'Sagamu', 'Ijebu-Ode'],
  'Ondo': ['Akure', 'Ondo City', 'Okitipupa', 'Ile-Oluji', 'Owo', 'Ikare'],
  'Osun': ['Osogbo', 'Ile-Ife', 'Ilesa'],
  'Oyo': ['Ibadan', 'Ogbomoso', 'Oyo', 'Iseyin'],
  'Plateau': ['Jos', 'Bukuru', 'Shendam'],
  'Rivers': ['Port Harcourt', 'Obio-Akpor', 'Bonny', 'Okrika'],
  'Sokoto': ['Sokoto', 'Wurno', 'Tambuwal'],
  'Taraba': ['Jalingo', 'Wukari', 'Bali'],
  'Yobe': ['Damaturu', 'Potiskum', 'Gashua'],
  'Zamfara': ['Gusau', 'Kaura Namoda', 'Talata Mafara'],
}

const categories = [
  "All", "Accountant", "Lawyer", "Doctor/Nurse", "Event Planner", "Photographer",
  "Makeup Artist", "Tailor", "Plumber", "Electrician", "Carpenter", "Welder",
  "Painter", "Tiler", "Mason", "Generator Repair", "AC Repair", "Vulcanizer",
  "Cleaner", "Laundry", "Cook/Chef", "Nanny", "Security Guard", "Fumigation",
  "Waste Disposal", "Local Food Seller", "Restaurant", "Caterer", "Foodstuff Seller",
  "Provisions", "Livestock Seller", "Fresh Produce", "Fabric/Ankara Seller",
  "Graphic Designer", "Video Editor", "CV Writer", "Lesson Teacher", "Web Developer",
  "Data Analyst", "Dispatch Rider", "Truck Driver", "Keke/Taxi", "Haulage",
  "Moving/Relocation", "Social Media Manager", "Printer", "Signage Maker", "POS Agent", "Bulk SMS"
]
export default function Browse() {
  const [providers, setProviders] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [selectedState, setSelectedState] = useState('All States')
  const [selectedCity, setSelectedCity] = useState('All Cities')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProviders = async () => {
      const { data } = await supabase.from('profiles').select('*').eq('role', 'provider').not('category', 'is', null)
      setProviders(data || [])
      setLoading(false)
    }
    fetchProviders()
  }, [])

  const currentCities = selectedState !== 'All States' ? stateData[selectedState] || [] : []

  const filtered = providers.filter(p => {
    const matchSearch = (p.full_name || '').toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === 'All' || p.category === category
    const matchState = selectedState === 'All States' || (p.city || '').toLowerCase().includes(selectedState.toLowerCase())
    const matchCity = selectedCity === 'All Cities' || (p.city || '').toLowerCase().includes(selectedCity.toLowerCase())
    return matchSearch && matchCategory && matchState && matchCity
  })

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', background: '#060d1a', color: 'white' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        .syne { font-family: 'Syne', sans-serif; }
        .top-nav { background: rgba(6,13,26,0.8); backdrop-filter: blur(24px); border-bottom: 1px solid rgba(255,255,255,0.06); padding: 16px 36px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; }
        .top-nav::after { content: ''; position: absolute; bottom: 0; left: 5%; right: 5%; height: 1px; background: linear-gradient(90deg, transparent, rgba(0,191,165,0.5), rgba(255,107,74,0.3), transparent); }
        .search-field { flex: 1; padding: 13px 18px; background: rgba(255,255,255,0.06); border: 1.5px solid rgba(255,255,255,0.08); border-radius: 12px; color: white; font-family: 'DM Sans', sans-serif; font-size: 14px; transition: all 0.3s ease; }
        .search-field::placeholder { color: rgba(255,255,255,0.25); }
        .search-field:focus { outline: none; border-color: #00BFA5; background: rgba(0,191,165,0.05); box-shadow: 0 0 0 4px rgba(0,191,165,0.08); }
        .pill { padding: 7px 16px; border-radius: 100px; border: 1.5px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.5); font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all 0.25s ease; }
        .pill:hover { background: rgba(255,255,255,0.08); color: white; }
        .pill.active-teal { background: rgba(0,191,165,0.1); border-color: #00BFA5; color: #00BFA5; }
        .pill.active-orange { background: rgba(255,107,74,0.1); border-color: #FF6B4A; color: #FF6B4A; }
        .provider-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 18px; padding: 22px; cursor: pointer; transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1); position: relative; overflow: hidden; }
        .provider-card:hover { transform: translateY(-6px); border-color: rgba(0,191,165,0.25); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
        .avatar { width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, #0A2540, #00BFA5); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 900; font-size: 20px; color: white; flex-shrink: 0; }
        .tag { display: inline-block; background: rgba(0,191,165,0.1); color: #00BFA5; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; }
        .city-tag { display: inline-block; background: rgba(255,107,74,0.1); color: #FF6B4A; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; }
        .view-btn { width: 100%; padding: 10px; background: linear-gradient(135deg, #FF6B4A, #e55a3a); color: white; border: none; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.3s ease; }
        .view-btn:hover { transform: translateY(-1px); box-shadow: 0 0 24px rgba(255,107,74,0.4); }
        .spin { width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.06); border-top-color: #00BFA5; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .section-label { color: rgba(255,255,255,0.25); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 8px; padding: 0 24px; }
      `}</style>

      {/* Navbar */}
      <div className="top-nav">
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}><Logo size={34} /></div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => navigate('/login')} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)', padding: '8px 18px', borderRadius: 10, fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Login</button>
          <button onClick={() => navigate('/register')} style={{ background: 'linear-gradient(135deg, #FF6B4A, #e55a3a)', color: 'white', border: 'none', padding: '8px 18px', borderRadius: 10, fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Register</button>
        </div>
      </div>

      {/* Hero Search */}
      <div style={{ background: 'linear-gradient(135deg, #0A2540 0%, #060d1a 100%)', padding: '48px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(0,191,165,0.08) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <p className="syne" style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, color: 'white', marginBottom: 6 }}>Find a Service Provider</p>
          <p style={{ color: 'rgba(255,255,255,0.35)', marginBottom: 24, fontSize: 14 }}>Browse verified professionals across Nigeria</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <input className="search-field" type="text" placeholder="Search by name or service..." value={search} onChange={e => setSearch(e.target.value)} style={{ minWidth: 200 }} />
            <button style={{ padding: '13px 20px', borderRadius: 12, background: '#FF6B4A', color: 'white', border: 'none', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Search 🔍
            </button>
          </div>
        </div>
      </div>

      {/* State Filter */}
      <div style={{ background: 'rgba(6,13,26,0.95)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '12px 0' }}>
        <p className="section-label">Filter by State</p>
        <div style={{ overflowX: 'auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', gap: 8, minWidth: 'max-content' }}>
            <button className={`pill ${selectedState === 'All States' ? 'active-orange' : ''}`} onClick={() => { setSelectedState('All States'); setSelectedCity('All Cities') }}>
              🇳🇬 All States
            </button>
            {Object.keys(stateData).map(state => (
              <button key={state} className={`pill ${selectedState === state ? 'active-orange' : ''}`} onClick={() => { setSelectedState(state); setSelectedCity('All Cities') }}>
                {state}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* City Filter - only shows when state is selected */}
      {selectedState !== 'All States' && (
        <div style={{ background: 'rgba(6,13,26,0.9)', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '10px 0' }}>
          <p className="section-label">Filter by City in {selectedState}</p>
          <div style={{ overflowX: 'auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', gap: 8, minWidth: 'max-content' }}>
              <button className={`pill ${selectedCity === 'All Cities' ? 'active-teal' : ''}`} onClick={() => setSelectedCity('All Cities')}>
                All Cities
              </button>
              {currentCities.map(city => (
                <button key={city} className={`pill ${selectedCity === city ? 'active-teal' : ''}`} onClick={() => setSelectedCity(city)}>
                  📍 {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div style={{ background: 'rgba(6,13,26,0.88)', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '10px 0' }}>
        <p className="section-label">Filter by Category</p>
        <div style={{ overflowX: 'auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', gap: 8, minWidth: 'max-content' }}>
            {categories.map(cat => (
              <button key={cat} className={`pill ${category === cat ? 'active-teal' : ''}`} onClick={() => setCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(selectedState !== 'All States' || selectedCity !== 'All Cities' || category !== 'All') && (
        <div style={{ padding: '12px 24px', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>Active filters:</span>
          {selectedState !== 'All States' && (
            <span onClick={() => { setSelectedState('All States'); setSelectedCity('All Cities') }} style={{ background: 'rgba(255,107,74,0.1)', color: '#FF6B4A', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
              {selectedState} ✕
            </span>
          )}
          {selectedCity !== 'All Cities' && (
            <span onClick={() => setSelectedCity('All Cities')} style={{ background: 'rgba(255,107,74,0.1)', color: '#FF6B4A', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
              📍 {selectedCity} ✕
            </span>
          )}
          {category !== 'All' && (
            <span onClick={() => setCategory('All')} style={{ background: 'rgba(0,191,165,0.1)', color: '#00BFA5', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
              {category} ✕
            </span>
          )}
          <span onClick={() => { setSelectedState('All States'); setSelectedCity('All Cities'); setCategory('All') }} style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}>
            Clear all
          </span>
        </div>
      )}

      {/* Results */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div className="spin"></div>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>Loading providers...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
            <p className="syne" style={{ fontSize: 24, fontWeight: 800, color: 'white', marginBottom: 8 }}>
              No providers found{selectedState !== 'All States' ? ` in ${selectedCity !== 'All Cities' ? selectedCity : selectedState}` : ''}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginBottom: 24 }}>
              Be the first to list your service{selectedState !== 'All States' ? ` in ${selectedState}` : ' on Ugele Online'}!
            </p>
            <button onClick={() => navigate('/register')} style={{ padding: '13px 28px', background: 'linear-gradient(135deg, #FF6B4A, #e55a3a)', color: 'white', border: 'none', borderRadius: 12, fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
              Register as a Provider 🚀
            </button>
          </div>
        ) : (
          <>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 20 }}>
              {filtered.length} provider{filtered.length !== 1 ? 's' : ''} found
              {selectedState !== 'All States' ? ` in ${selectedCity !== 'All Cities' ? selectedCity + ', ' : ''}${selectedState}` : ''}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {filtered.map(provider => (
                <div key={provider.id} className="provider-card" onClick={() => navigate('/provider/' + provider.id)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div className="avatar">{(provider.full_name || 'U')[0].toUpperCase()}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'white', fontSize: 15, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{provider.full_name}</p>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <span className="tag">{provider.category}</span>
                        {provider.city && <span className="city-tag">📍 {provider.city}</span>}
                      </div>
                    </div>
                  </div>
                  {provider.bio && (
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, lineHeight: 1.6, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{provider.bio}</p>
                  )}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12, marginBottom: 12 }}>
                    {provider.price && <p style={{ color: '#00BFA5', fontWeight: 700, fontSize: 14 }}>From ₦{provider.price}</p>}
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