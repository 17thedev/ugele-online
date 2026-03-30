import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import Logo from '../assets/Logo'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleReset = async () => {
    setError('')
    if (!email) { setError('Please enter your email address'); return }
    setLoading(true)
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://ugele-online.vercel.app/reset-password'
    })
    if (resetError) { setError(resetError.message) }
    else { setSent(true) }
    setLoading(false)
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', background: '#060d1a', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .syne { font-family: 'Syne', sans-serif; }
        .input-field {
          width: 100%;
          padding: 14px 18px;
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }
        .input-field::placeholder { color: rgba(255,255,255,0.25); }
        .input-field:focus { outline: none; border-color: #00BFA5; background: rgba(0,191,165,0.05); box-shadow: 0 0 0 4px rgba(0,191,165,0.08); }
        .btn-main {
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
        .btn-main:hover { transform: translateY(-2px); box-shadow: 0 0 40px rgba(0,191,165,0.4); }
        .btn-main:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .error-box { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); border-radius: 10px; padding: 12px 16px; color: #f87171; font-size: 13px; font-weight: 500; margin-bottom: 16px; animation: shakeIn 0.4s ease; }
        @keyframes shakeIn { 0% { transform: translateX(-8px); opacity: 0; } 50% { transform: translateX(4px); } 100% { transform: translateX(0); opacity: 1; } }
      `}</style>

      <div style={{ padding: '20px 32px', cursor: 'pointer' }} onClick={() => navigate('/')}>
        <Logo size={36} />
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '40px 36px', width: '100%', maxWidth: 420 }}>

          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>📧</div>
              <p className="syne" style={{ fontSize: 24, fontWeight: 900, color: 'white', marginBottom: 8 }}>Check Your Email</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>We sent a password reset link to {email}. Click the link to set a new password.</p>
              <button onClick={() => navigate('/login')} style={{ width: '100%', padding: '13px', background: 'rgba(0,191,165,0.1)', color: '#00BFA5', border: '1px solid rgba(0,191,165,0.25)', borderRadius: 12, fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                Back to Login
              </button>
            </div>
          ) : (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <p className="syne" style={{ fontSize: 26, fontWeight: 900, color: 'white', marginBottom: 6 }}>Forgot Password?</p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>Enter your email and we will send a reset link</p>
              </div>
              {error && <div className="error-box">⚠️ {error}</div>}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Email Address</label>
                <input className="input-field" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleReset()} />
              </div>
              <button className="btn-main" onClick={handleReset} disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14, marginTop: 20, cursor: 'pointer' }} onClick={() => navigate('/login')}>
                Remember your password? <span style={{ color: '#FF6B4A', fontWeight: 700 }}>Login</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}