import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import Logo from '../assets/Logo'

export default function ProviderProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [provider, setProvider] = useState(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProvider = async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', id).single()
      setProvider(data)
    }
    fetchProvider()
  }, [id])

  const handleBooking = async () => {
    setError('')
    if (!name || !phone || !message) { setError('Please fill in all fields'); return }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error: bookingError } = await supabase.from('bookings').insert({
      client_name: name,
      client_phone: phone,
      message,
      status: 'pending',
      client_id: user ? user.id : null,
      provider_id: id,
    })
    if (bookingError) { setError(bookingError.message) }
    else { setSent(true); setName(''); setPhone(''); setMessage('') }
    setLoading(false)
  }

  if (!provider) return (
    <div style={{ minHeight: '100vh', background: '#060d1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.08)', borderTopColor: '#00BFA5', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

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
          border-color: #FF6B4A;
          background: rgba(255,107,74,0.04);
          box-shadow: 0 0 0 4px rgba(255,107,74,0.08);
        }

        .label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 8px;
        }

        .book-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #FF6B4A, #e55a3a);
          color: white;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 24px rgba(255,107,74,0.25);
        }
        .book-btn:hover { transform: translateY(-2px); box-shadow: 0 0 40px rgba(255,107,74,0.4); }
        .book-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .tag {
          display: inline-block;
          background: rgba(0,191,165,0.1);
          color: #00BFA5;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
        }

        .avatar-big {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0A2540, #00BFA5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 900;
          font-size: 28px;
          color: white;
          box-shadow: 0 0 24px rgba(0,191,165,0.3);
          flex-shrink: 0;
        }

        .success-box {
          background: rgba(0,191,165,0.08);
          border: 1px solid rgba(0,191,165,0.25);
          border-radius: 14px;
          padding: 24px;
          text-align: center;
        }
        .error-box { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); border-radius: 10px; padding: 12px 16px; color: #f87171; font-size: 13px; font-weight: 500; margin-bottom: 16px; animation: shakeIn 0.4s ease; }
        @keyframes shakeIn { 0% { transform: translateX(-8px); opacity: 0; } 50% { transform: translateX(4px); } 100% { transform: translateX(0); opacity: 1; } }
      `}</style>

      {/* Navbar */}
      <div className="top-nav">
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <Logo size={34} />
        </div>
        <button onClick={() => navigate('/browse')} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)', padding: '8px 18px', borderRadius: 10, fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
          ← Back to Browse
        </button>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '36px 24px' }}>

        {/* Provider Info */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div className="avatar-big">{(provider.full_name || 'U')[0].toUpperCase()}</div>
            <div>
              <p className="syne" style={{ fontSize: 24, fontWeight: 900, color: 'white', marginBottom: 6 }}>{provider.full_name}</p>
              <span className="tag">{provider.category}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
            {provider.city && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>📍 {provider.city}</span>}
            {provider.price && <span style={{ color: '#00BFA5', fontWeight: 700, fontSize: 14 }}>💰 From ₦{provider.price}</span>}
          </div>

          {provider.bio && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 18 }}>
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>About</p>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.75 }}>{provider.bio}</p>
            </div>
          )}
        </div>

        {/* Booking Form */}
        <div className="card">
          <p className="syne" style={{ fontSize: 18, fontWeight: 800, color: 'white', marginBottom: 20 }}>Send a Booking Request</p>

          {sent ? (
            <div className="success-box">
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <p className="syne" style={{ fontSize: 18, fontWeight: 800, color: '#00BFA5', marginBottom: 6 }}>Booking Sent!</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 20 }}>The provider will contact you soon on the phone number you provided.</p>
              <button onClick={() => setSent(false)} style={{ background: 'rgba(0,191,165,0.1)', color: '#00BFA5', border: '1px solid rgba(0,191,165,0.25)', padding: '10px 20px', borderRadius: 10, fontFamily: 'DM Sans, sans-serif', fontWeight: 700, cursor: 'pointer' }}>
                Send Another Request
              </button>
            </div>
          ) : (
            <div>
              {error && <div className="error-box">⚠️ {error}</div>}
              <div style={{ marginBottom: 14 }}>
                <label className="label">Your Name</label>
                <input className="input-field" type="text" placeholder="Enter your full name" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label className="label">Your Phone Number</label>
                <input className="input-field" type="text" placeholder="08012345678" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label className="label">Describe What You Need</label>
                <textarea className="input-field" placeholder="Tell the provider exactly what you need..." rows={4} value={message} onChange={e => setMessage(e.target.value)} style={{ resize: 'vertical' }}></textarea>
              </div>
              <button className="book-btn" onClick={handleBooking} disabled={loading}>
                {loading ? 'Sending...' : 'Send Booking Request 🚀'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}