import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import Logo from '../assets/Logo'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('client')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async () => {
    setError('')
    if (!name.trim()) { setError('Please enter your full name'); return }
    if (!email.trim()) { setError('Please enter your email address'); return }
    if (!password.trim()) { setError('Please create a password'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }

    setLoading(true)
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password })

    if (signUpError) {
      if (signUpError.message.includes('already')) {
        setError('This email is already registered. Please login instead.')
      } else {
        setError(signUpError.message)
      }
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: name,
        role: role,
      })
    }

    if (role === 'provider') {
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
        .input-field:focus { outline: none; border-color: #FF6B4A; background: rgba(255,107,74,0.04); box-shadow: 0 0 0 4px rgba(255,107,74,0.08); }
        .btn-main { width: 100%; padding: 15px; background: linear-gradient(135deg, #FF6B4A, #e55a3a); color: white; border: none; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 16px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 0 24px rgba(255,107,74,0.25); }
        .btn-main:hover { transform: translateY(-2px); box-shadow: 0 0 40px rgba(255,107,74,0.45); }
        .btn-main:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .label { display: block; font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 8px; }
        .error-box { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); border-radius: 10px; padding: 12px 16px; color: #f87171; font-size: 13px; font-weight: 500; margin-bottom: 16px; animation: shakeIn 0.4s ease; }
        @keyframes shakeIn { 0% { transform: translateX(-8px); opacity: 0; } 50% { transform: translateX(4px); } 100% { transform: translateX(0); opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .role-card { border: 1.5px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 16px; cursor: pointer; transition: all 0.3s ease; text-align: center; background: rgba(255,255,255,0.03); }
        .role-card:hover { background: rgba(255,255,255,0.06); transform: translateY(-2px); }
        .role-active-client { border-color: #FF6B4A !important; background: rgba(255,107,74,0.08) !important; }
        .role-active-provider { border-color: #00BFA5 !important; background: rgba(0,191,165,0.08) !important; }
      `}</style>

      <div className="blob" style={{ width: 400, height: 400, background: 'rgba(255,107,74,0.07)', top: '-100px', left: '-100px' }}></div>
      <div className="blob" style={{ width: 350, height: 350, background: 'rgba(0,191,165,0.07)', bottom: '-80px', right: '-80px', animationDelay: '5s' }}></div>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '36px 36px', pointerEvents: 'none' }}></div>

      <div style={{ padding: '20px 32px', cursor: 'pointer', position: 'relative', zIndex: 1 }} onClick={() => navigate('/')}>
        <Logo size={36} />
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: 440 }}>

          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <p className="syne" style={{ fontSize: 30, fontWeight: 900, color: 'white', marginBottom: 6 }}>Create Account</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>Join Nigeria's trusted service marketplace</p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '32px 28px' }}>

            {/* Role Selection */}
            <div style={{ marginBottom: 20 }}>
              <label className="label">I want to</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className={`role-card ${role === 'client' ? 'role-active-client' : ''}`} onClick={() => setRole('client')}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>🏢</div>
                  <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'white', fontSize: 13, marginBottom: 2 }}>Hire Services</p>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>I need a professional</p>
                </div>
                <div className={`role-card ${role === 'provider' ? 'role-active-provider' : ''}`} onClick={() => setRole('provider')}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>🔧</div>
                  <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'white', fontSize: 13, marginBottom: 2 }}>Offer Services</p>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>I have skills to offer</p>
                </div>
              </div>
            </div>

            {error && <div className="error-box">⚠️ {error}</div>}

            <div style={{ marginBottom: 14 }}>
              <label className="label">Full Name</label>
              <input className="input-field" type="text" placeholder="Enter your full name" value={name} onChange={e => { setName(e.target.value); setError('') }} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="label">Email Address</label>
              <input className="input-field" type="email" placeholder="Enter your email" value={email} onChange={e => { setEmail(e.target.value); setError('') }} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label className="label">Password</label>
              <input className="input-field" type="password" placeholder="Min. 6 characters" value={password} onChange={e => { setPassword(e.target.value); setError('') }} onKeyDown={e => e.key === 'Enter' && handleRegister()} />
            </div>

            <button className="btn-main" onClick={handleRegister} disabled={loading}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite', display: 'inline-block' }}></span>
                  Creating Account...
                </span>
              ) : 'Create Account →'}
            </button>

            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 20, cursor: 'pointer' }} onClick={() => navigate('/login')}>
              Already have an account? <span style={{ color: '#FF6B4A', fontWeight: 700 }}>Login here</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}