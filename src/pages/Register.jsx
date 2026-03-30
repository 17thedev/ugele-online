import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import Logo from '../assets/Logo'

const TERMII_KEY = import.meta.env.VITE_TERMII_API_KEY

function formatPhoneIntl(raw) {
  const digits = raw.replace(/\D/g, '')
  return digits.startsWith('0') ? '234' + digits.slice(1) : digits
}

function validatePhone(raw) {
  const digits = raw.replace(/\D/g, '')
  return /^(07|08|09)\d{9}$/.test(digits)
}

export default function Register() {
  const [step, setStep] = useState(1) // 1 = details, 2 = OTP
  const [role, setRole] = useState('client')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [pinId, setPinId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSendOtp = async () => {
    setError('')
    if (!name.trim()) { setError('Please enter your full name'); return }
    if (!validatePhone(phone)) { setError('Enter a valid 11-digit Nigerian number starting with 07, 08, or 09'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }

    setLoading(true)
    try {
      const res = await fetch('https://api.ng.termii.com/api/sms/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: TERMII_KEY,
          message_type: 'NUMERIC',
          to: formatPhoneIntl(phone),
          from: 'N-Alert',
          channel: 'dnd',
          pin_attempts: 5,
          pin_time_to_live: 10,
          pin_length: 6,
          pin_placeholder: '< 000000 >',
          message_text: 'Your Ugele verification code is < 000000 >. Valid for 10 minutes.',
          pin_type: 'NUMERIC',
        }),
      })
      const data = await res.json()
      if (data.pinId) {
        setPinId(data.pinId)
        setStep(2)
      } else {
        setError(data.message || 'Failed to send OTP. Check your number and try again.')
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    }
    setLoading(false)
  }

  const handleVerifyOtp = async () => {
    setError('')
    if (otp.replace(/\D/g, '').length !== 6) { setError('Enter the 6-digit code sent to your phone'); return }

    setLoading(true)
    try {
      const res = await fetch('https://api.ng.termii.com/api/sms/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: TERMII_KEY, pin_id: pinId, pin: otp }),
      })
      const data = await res.json()

      if (String(data.verified).toLowerCase() === 'true') {
        const email = `${phone.replace(/\D/g, '')}@ugele.ng`
        const { data: authData, error: signUpError } = await supabase.auth.signUp({ email, password })

        if (signUpError) {
          setError(signUpError.message.includes('already')
            ? 'This number is already registered. Please login instead.'
            : signUpError.message)
          setLoading(false)
          return
        }

        if (authData.user) {
          await supabase.from('profiles').insert({
            id: authData.user.id,
            full_name: name,
            role,
            phone: phone.replace(/\D/g, ''),
          })
        }

        navigate(role === 'provider' ? '/dashboard/provider' : '/dashboard/client')
      } else {
        setError('Incorrect code. Please check the SMS and try again.')
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    }
    setLoading(false)
  }

  const Spinner = () => (
    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite', display: 'inline-block' }} />
  )

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
        .btn-main { width: 100%; padding: 15px; background: linear-gradient(135deg, #FF6B4A, #e55a3a); color: white; border: none; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 16px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 0 24px rgba(255,107,74,0.25); display: flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-main:hover { transform: translateY(-2px); box-shadow: 0 0 40px rgba(255,107,74,0.45); }
        .btn-main:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .label { display: block; font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 8px; }
        .error-box { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); border-radius: 10px; padding: 12px 16px; color: #f87171; font-size: 13px; font-weight: 500; margin-bottom: 16px; animation: shakeIn 0.4s ease; }
        @keyframes shakeIn { 0% { transform: translateX(-8px); opacity: 0; } 50% { transform: translateX(4px); } 100% { transform: translateX(0); opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .form-anim { animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1); }

        .role-card { border: 1.5px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 18px 14px; cursor: pointer; transition: all 0.3s ease; text-align: center; background: rgba(255,255,255,0.03); }
        .role-card:hover { background: rgba(255,255,255,0.06); transform: translateY(-2px); }
        .role-active-client { border-color: #FF6B4A !important; background: rgba(255,107,74,0.08) !important; box-shadow: 0 0 20px rgba(255,107,74,0.1); }
        .role-active-provider { border-color: #00BFA5 !important; background: rgba(0,191,165,0.08) !important; box-shadow: 0 0 20px rgba(0,191,165,0.1); }

        .phone-wrap { display: flex; gap: 0; }
        .phone-prefix { padding: 14px 14px; background: rgba(255,255,255,0.04); border: 1.5px solid rgba(255,255,255,0.08); border-right: none; border-radius: 12px 0 0 12px; color: rgba(255,255,255,0.5); font-size: 15px; font-weight: 600; white-space: nowrap; display: flex; align-items: center; gap: 6px; }
        .phone-input { flex: 1; padding: 14px 18px; background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.08); border-left: none; border-radius: 0 12px 12px 0; color: white; font-family: 'DM Sans', sans-serif; font-size: 15px; transition: all 0.3s ease; }
        .phone-input::placeholder { color: rgba(255,255,255,0.25); }
        .phone-input:focus { outline: none; border-color: #FF6B4A; background: rgba(255,107,74,0.04); box-shadow: 0 0 0 4px rgba(255,107,74,0.08); }

        .otp-input { width: 100%; padding: 18px; background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.08); border-radius: 12px; color: white; font-family: 'DM Sans', sans-serif; font-size: 28px; font-weight: 700; letter-spacing: 0.5em; text-align: center; transition: all 0.3s ease; }
        .otp-input:focus { outline: none; border-color: #00BFA5; background: rgba(0,191,165,0.04); box-shadow: 0 0 0 4px rgba(0,191,165,0.08); }
        .otp-input::placeholder { color: rgba(255,255,255,0.1); letter-spacing: 0.3em; font-size: 20px; }

        .step-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 100px; padding: 4px 12px; font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; }
        .step-dot { width: 6px; height: 6px; border-radius: 50%; }
      `}</style>

      {/* Background blobs */}
      <div className="blob" style={{ width: 400, height: 400, background: 'rgba(255,107,74,0.07)', top: '-100px', left: '-100px' }} />
      <div className="blob" style={{ width: 350, height: 350, background: 'rgba(0,191,165,0.07)', bottom: '-80px', right: '-80px', animationDelay: '5s' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '36px 36px', pointerEvents: 'none' }} />

      {/* Logo */}
      <div style={{ padding: '20px 32px', cursor: 'pointer', position: 'relative', zIndex: 1 }} onClick={() => navigate('/')}>
        <Logo size={36} />
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: 440 }}>

          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <p className="syne" style={{ fontSize: 30, fontWeight: 900, color: 'white', marginBottom: 6 }}>
              {step === 1 ? 'Create Account' : 'Verify Your Number'}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>
              {step === 1
                ? "Join Nigeria's trusted service marketplace"
                : `Enter the 6-digit code sent to ${phone}`}
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '32px 28px' }}>

            {/* ── STEP 1: Details ── */}
            {step === 1 && (
              <div className="form-anim">
                {/* Role selection */}
                <div style={{ marginBottom: 22 }}>
                  <label className="label">I want to</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div
                      className={`role-card ${role === 'client' ? 'role-active-client' : ''}`}
                      onClick={() => { setRole('client'); setError('') }}
                    >
                      <div style={{ fontSize: 30, marginBottom: 8 }}>🏢</div>
                      <p className="syne" style={{ fontWeight: 800, color: 'white', fontSize: 13, marginBottom: 3 }}>Hire Services</p>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>I need a professional</p>
                      {role === 'client' && (
                        <div style={{ marginTop: 8, fontSize: 10, color: '#FF6B4A', fontWeight: 700 }}>✓ Selected</div>
                      )}
                    </div>
                    <div
                      className={`role-card ${role === 'provider' ? 'role-active-provider' : ''}`}
                      onClick={() => { setRole('provider'); setError('') }}
                    >
                      <div style={{ fontSize: 30, marginBottom: 8 }}>🔧</div>
                      <p className="syne" style={{ fontWeight: 800, color: 'white', fontSize: 13, marginBottom: 3 }}>Offer Services</p>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>I have skills to offer</p>
                      {role === 'provider' && (
                        <div style={{ marginTop: 8, fontSize: 10, color: '#00BFA5', fontWeight: 700 }}>✓ Selected</div>
                      )}
                    </div>
                  </div>
                </div>

                {error && <div className="error-box">⚠️ {error}</div>}

                {/* Full name */}
                <div style={{ marginBottom: 14 }}>
                  <label className="label">Full Name</label>
                  <input
                    className="input-field"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={e => { setName(e.target.value); setError('') }}
                  />
                </div>

                {/* Phone number */}
                <div style={{ marginBottom: 14 }}>
                  <label className="label">Phone Number</label>
                  <div className="phone-wrap">
                    <div className="phone-prefix">🇳🇬 +234</div>
                    <input
                      className="phone-input"
                      type="tel"
                      placeholder="08012345678"
                      value={phone}
                      maxLength={11}
                      onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setError('') }}
                    />
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, marginTop: 5 }}>
                    Must start with 07, 08, or 09 — 11 digits total
                  </p>
                </div>

                {/* Password */}
                <div style={{ marginBottom: 24 }}>
                  <label className="label">Password</label>
                  <input
                    className="input-field"
                    type="password"
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError('') }}
                    onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                  />
                </div>

                <button className="btn-main" onClick={handleSendOtp} disabled={loading}>
                  {loading ? <><Spinner /> Sending OTP...</> : 'Continue — Send OTP →'}
                </button>

                <p
                  style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 20, cursor: 'pointer' }}
                  onClick={() => navigate('/login')}
                >
                  Already have an account?{' '}
                  <span style={{ color: '#FF6B4A', fontWeight: 700 }}>Login here</span>
                </p>
              </div>
            )}

            {/* ── STEP 2: OTP Verification ── */}
            {step === 2 && (
              <div className="form-anim">
                <div className="step-badge">
                  <span className="step-dot" style={{ background: '#00BFA5' }} />
                  Step 2 of 2 — Phone Verification
                </div>

                <div style={{ background: 'rgba(0,191,165,0.06)', border: '1px solid rgba(0,191,165,0.15)', borderRadius: 12, padding: '14px 16px', marginBottom: 22 }}>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 2 }}>Code sent to</p>
                  <p style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>{phone}</p>
                </div>

                {error && <div className="error-box">⚠️ {error}</div>}

                <div style={{ marginBottom: 24 }}>
                  <label className="label">Verification Code</label>
                  <input
                    className="otp-input"
                    type="tel"
                    placeholder="000000"
                    value={otp}
                    maxLength={6}
                    onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setError('') }}
                    onKeyDown={e => e.key === 'Enter' && handleVerifyOtp()}
                    autoFocus
                  />
                  <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, marginTop: 8, textAlign: 'center' }}>
                    Check your SMS — code expires in 10 minutes
                  </p>
                </div>

                <button
                  className="btn-main"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  style={{ background: 'linear-gradient(135deg, #00BFA5, #008f7a)', boxShadow: '0 0 24px rgba(0,191,165,0.25)' }}
                >
                  {loading ? <><Spinner /> Verifying...</> : 'Verify & Create Account →'}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 20 }}>
                  <button
                    onClick={() => { setStep(1); setOtp(''); setError('') }}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 13, cursor: 'pointer' }}
                  >
                    ← Change number
                  </button>
                  <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
                  <button
                    onClick={handleSendOtp}
                    disabled={loading}
                    style={{ background: 'none', border: 'none', color: '#FF6B4A', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                  >
                    Resend code
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
