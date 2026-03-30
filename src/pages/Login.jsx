import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import Logo from '../assets/Logo'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    setError('')
    if (!email.trim()) { setError('Please enter your email address'); return }
    if (!password.trim()) { setError('Please enter your password'); return }
    setLoading(true)
    const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password })
    if (loginError) {
      if (loginError.message.includes('Invalid') || loginError.message.includes('invalid')) {
        setError('Wrong email or password. Please try again.')
      } else if (loginError.message.includes('confirmed')) {
        setError('Please confirm your email first. Check your inbox.')
      } else {
        setError(loginError.message)
      }
      setLoading(false)
      return
    }
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
    if (profile?.role === 'provider') {
      navigate('/dashboard/provider')
    } else {
      navigate('/dashboard/client')
    }
    setLoading(false)
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', background: '#060d1a', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        .syne { font-family: 'Syne', sans-serif; }
        .blob { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; animation: blobFloat 10s ease-in-out infinite; }
        @keyframes blobFloat { 0%,100% { transform: scale(1); } 50% { transform: scale(1.15); } }
        .input-field { width: 100%; padding: 14px 18px; background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.08); border-radius: 12px; color: white; font-family: 'DM Sans', sans-serif; font-size: 15px; transition: all 0.3s ease; box-sizing: border-box; }
        .input-field::placeholder { color: rgba(255,255,255,0.25); }
        .input-field:focus { outline: none; border-color: #00BFA5; background: rgba(0,191,165,0.05); box-shadow: 0 0 0 4px rgba(0,191,165,0.08); }
        .btn-main { width: 100%; padding: 15px; background: linear-gradient(135deg, #FF6B4A, #e55a3a); color: white; border: none; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 16px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 0 24px rgba(255,107,74,0.25); }
        .btn-main:hover { transform: translateY(-2px); box-shadow: 0 0 40px rgba(255,107,74,0.45); }
        .btn-main:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .label { display: block; font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 8px; }
        .error-box { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); border-radius: 10px; padding: 12px 16px; color: #f87171; font-size: 13px; font-weight: 500; margin-bottom: 16px; animation: shakeIn 0.4s ease; }
        @keyframes shakeIn { 0% { transform: translateX(-8px); opacity: 0; } 50% { transform: translateX(4px); } 100% { transform: translateX(0); opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.06); }
      `}</style>

      <div className="blob" style={{ width: 400, height: 400, background: 'rgba(0,191,165,0.08)', top: '-100px', right: '-100px' }}></div>
      <div className="blob" style={{ width: 300, height: 300, background: 'rgba(255,107,74,0.06)', bottom: '-80px', left: '-80px', animationDelay: '5s' }}></div>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '36px 36px', pointerEvents: 'none' }}></div>

      <div style={{ padding: '20px 32px', cursor: 'pointer', position: 'relative', zIndex: 1 }} onClick={() => navigate('/')}>
        <Logo size={36} />
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <p className="syne" style={{ fontSize: 30, fontWeight: 900, color: 'white', marginBottom: 6 }}>Welcome Back</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>Login to your Ugele Online account</p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '32px 28px' }}>
            {error && <div className="error-box">⚠️ {error}</div>}

            <div style={{ marginBottom: 16 }}>
              <label className="label">Email Address</label>
              <input className="input-field" type="email" placeholder="Enter your email" value={email} onChange={e => { setEmail(e.target.value); setError('') }} />
            </div>

            <div style={{ marginBottom: 8 }}>
              <label className="label">Password</label>
              <input className="input-field" type="password" placeholder="Enter your password" value={password} onChange={e => { setPassword(e.target.value); setError('') }} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>

            <div style={{ textAlign: 'right', marginBottom: 24 }}>
              <span onClick={() => navigate('/forgot-password')} style={{ color: '#00BFA5', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Forgot password?</span>
            </div>

            <button className="btn-main" onClick={handleLogin} disabled={loading}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite', display: 'inline-block' }}></span>
                  Logging in...
                </span>
              ) : 'Login →'}
            </button>

            <div className="divider">
              <div className="divider-line"></div>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>or</span>
              <div className="divider-line"></div>
            </div>

            <button onClick={() => navigate('/register')} style={{ width: '100%', padding: '13px', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.3s' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
            >Create an account</button>
          </div>
        </div>
      </div>
    </div>
  )
}