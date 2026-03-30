import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import Logo from '../assets/Logo'

export default function ProviderDashboard() {
  const [profile, setProfile] = useState(null)
  const [bio, setBio] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [service, setService] = useState('')
  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setProfile(data)
        setBio(data.bio || '')
        setPhone(data.phone || '')
        setCity(data.city || '')
        setService(data.category || '')
        setPrice(data.price || '')
      }
    }
    getProfile()
  }, [])

  const handleSave = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('profiles').update({ bio, phone, city, category: service, price }).eq('id', user.id)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const categories = [
    "Accountant", "Lawyer", "Doctor/Nurse", "Event Planner", "Photographer", "Makeup Artist", "Tailor",
    "Plumber", "Electrician", "Carpenter", "Welder", "Painter", "Tiler", "Mason", "Generator Repair", "AC Repair", "Vulcanizer",
    "Cleaner", "Laundry", "Cook/Chef", "Nanny", "Security Guard", "Fumigation", "Waste Disposal",
    "Local Food Seller", "Restaurant", "Caterer", "Foodstuff Seller", "Provisions", "Livestock Seller", "Fresh Produce", "Fabric/Ankara Seller",
    "Graphic Designer", "Video Editor", "CV Writer", "Lesson Teacher", "Web Developer", "Data Analyst",
    "Dispatch Rider", "Truck Driver", "Keke/Taxi", "Haulage", "Moving/Relocation",
    "Social Media Manager", "Printer", "Signage Maker", "POS Agent", "Bulk SMS"
  ]

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', background: '#060d1a', color: 'white' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .syne { font-family: 'Syne', sans-serif; }

        .dash-nav {
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
        .dash-nav::after {
          content: '';
          position: absolute;
          bottom: 0; left: 5%; right: 5%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,191,165,0.5), rgba(255,107,74,0.3), transparent);
        }

        .logout-btn {
          background: rgba(255,107,74,0.1);
          color: #FF6B4A;
          border: 1px solid rgba(255,107,74,0.2);
          padding: 9px 20px;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .logout-btn:hover {
          background: rgba(255,107,74,0.2);
          transform: translateY(-1px);
        }

        .card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 28px;
          margin-bottom: 20px;
        }

        .input-field {
          width: 100%;
          padding: 13px 18px;
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }
        .input-field::placeholder { color: rgba(255,255,255,0.25); }
        .input-field:focus {
          outline: none;
          border-color: #00BFA5;
          background: rgba(0,191,165,0.05);
          box-shadow: 0 0 0 4px rgba(0,191,165,0.08);
        }

        select.input-field option { background: #0d1a2e; color: white; }

        .label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 8px;
        }

        .save-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #00BFA5, #008f7a);
          color: white;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 24px rgba(0,191,165,0.25);
        }
        .save-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 40px rgba(0,191,165,0.4);
        }
        .save-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .success-toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: rgba(0,191,165,0.15);
          border: 1px solid rgba(0,191,165,0.4);
          color: #00BFA5;
          padding: 14px 20px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14px;
          backdrop-filter: blur(12px);
          animation: toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1);
          z-index: 999;
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(20px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .avatar-circle {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0A2540, #00BFA5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 900;
          font-size: 24px;
          color: white;
          box-shadow: 0 0 20px rgba(0,191,165,0.3);
        }

        .stat-box {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 18px;
          text-align: center;
          flex: 1;
        }
      `}</style>

      {saved && <div className="success-toast">✅ Profile updated successfully!</div>}

      {/* Navbar */}
      <div className="dash-nav">
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <Logo size={34} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Provider Dashboard</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 24px' }}>

        {/* Welcome */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div className="avatar-circle">{(profile?.full_name || 'U')[0].toUpperCase()}</div>
            <div>
              <p className="syne" style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 2 }}>
                {profile?.full_name || 'Welcome'}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>Service Provider</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {[['Category', profile?.category || 'Not set'], ['City', profile?.city || 'Not set'], ['Price', profile?.price ? `₦${profile.price}` : 'Not set']].map(([label, val]) => (
              <div key={label} className="stat-box">
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>{label}</p>
                <p style={{ color: '#00BFA5', fontWeight: 700, fontSize: 13 }}>{val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Profile Form */}
        <div className="card">
          <p className="syne" style={{ fontSize: 18, fontWeight: 800, color: 'white', marginBottom: 20 }}>Update Your Profile</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label className="label">Phone Number</label>
              <input className="input-field" type="text" placeholder="08012345678" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div>
              <label className="label">City</label>
              <input className="input-field" type="text" placeholder="e.g. Ibadan" value={city} onChange={e => setCity(e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label className="label">Service Category</label>
              <select className="input-field" value={service} onChange={e => setService(e.target.value)}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Starting Price (₦)</label>
              <input className="input-field" type="text" placeholder="e.g. 5000" value={price} onChange={e => setPrice(e.target.value)} />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="label">About You</label>
            <textarea className="input-field" placeholder="Describe your services and experience..." rows={4} value={bio} onChange={e => setBio(e.target.value)} style={{ resize: 'vertical' }}></textarea>
          </div>

          <button className="save-btn" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>

        {/* Quick Links */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate('/browse')} style={{ flex: 1, padding: '13px', background: 'rgba(0,191,165,0.08)', color: '#00BFA5', border: '1px solid rgba(0,191,165,0.2)', borderRadius: 12, fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.3s' }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(0,191,165,0.15)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(0,191,165,0.08)'}
          >View My Profile →</button>
          <button onClick={() => navigate('/')} style={{ flex: 1, padding: '13px', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.3s' }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          >Back to Home</button>
        </div>
      </div>
    </div>
  )
}