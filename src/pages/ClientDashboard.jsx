import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import Logo from '../assets/Logo'

export default function ClientDashboard() {
  const [bookings, setBookings] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/login'); return }
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(profileData)
      const { data: bookingData } = await supabase.from('bookings').select('*').eq('client_id', user.id)
      setBookings(bookingData || [])
      setLoading(false)
    }
    getData()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

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
        .logout-btn:hover { background: rgba(255,107,74,0.2); transform: translateY(-1px); }

        .card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 28px;
          margin-bottom: 20px;
        }

        .booking-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 18px;
          margin-bottom: 12px;
          transition: all 0.3s ease;
        }
        .booking-card:hover {
          border-color: rgba(0,191,165,0.25);
          background: rgba(0,191,165,0.03);
        }

        .status-pill {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .empty-state {
          text-align: center;
          padding: 48px 24px;
        }

        .browse-btn {
          display: inline-block;
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
        .browse-btn:hover { transform: translateY(-2px); box-shadow: 0 0 35px rgba(255,107,74,0.4); }

        .avatar-circle {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF6B4A, #0A2540);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 900;
          font-size: 24px;
          color: white;
          box-shadow: 0 0 20px rgba(255,107,74,0.3);
        }

        .spin {
          width: 36px; height: 36px;
          border: 3px solid rgba(255,255,255,0.08);
          border-top-color: #00BFA5;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Navbar */}
      <div className="dash-nav">
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <Logo size={34} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Client Dashboard</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 24px' }}>

        {/* Welcome */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="avatar-circle">{(profile?.full_name || 'U')[0].toUpperCase()}</div>
            <div>
              <p className="syne" style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 2 }}>
                {profile?.full_name || 'Welcome back'}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>Client Account</p>
            </div>
          </div>
        </div>

        {/* Bookings */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <p className="syne" style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>My Bookings</p>
            <span style={{ background: 'rgba(0,191,165,0.1)', color: '#00BFA5', padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 700 }}>
              {bookings.length} total
            </span>
          </div>

          {loading ? (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
              <div className="spin"></div>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 52, marginBottom: 16 }}>📭</div>
              <p className="syne" style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 8 }}>No bookings yet</p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, marginBottom: 24 }}>Find a service provider and make your first booking</p>
              <button className="browse-btn" onClick={() => navigate('/browse')}>Browse Services 🔍</button>
            </div>
          ) : (
            <div>
              {bookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <p style={{ fontWeight: 700, color: 'white', fontSize: 15, maxWidth: '70%' }}>{booking.message}</p>
                    <span className="status-pill" style={{
                      background: booking.status === 'pending' ? 'rgba(245,158,11,0.12)' : 'rgba(0,191,165,0.12)',
                      color: booking.status === 'pending' ? '#f59e0b' : '#00BFA5',
                      border: `1px solid ${booking.status === 'pending' ? 'rgba(245,158,11,0.25)' : 'rgba(0,191,165,0.25)'}`
                    }}>{booking.status}</span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>📞 {booking.client_phone}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate('/browse')} style={{ flex: 1, padding: '13px', background: 'rgba(255,107,74,0.08)', color: '#FF6B4A', border: '1px solid rgba(255,107,74,0.2)', borderRadius: 12, fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.3s' }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,107,74,0.15)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,107,74,0.08)'}
          >Browse More Services →</button>
          <button onClick={() => navigate('/')} style={{ flex: 1, padding: '13px', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.3s' }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          >Back to Home</button>
        </div>
      </div>
    </div>
  )
}