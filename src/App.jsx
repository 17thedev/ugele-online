import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Browse from './pages/Browse'
import ProviderProfile from './pages/ProviderProfile'
import ProviderDashboard from './pages/ProviderDashboard'
import ClientDashboard from './pages/ClientDashboard'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('in')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 800)
    const t2 = setTimeout(() => setPhase('out'), 3800)
    const t3 = setTimeout(() => onDone(), 4500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#0A2540',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      transition: 'opacity 0.7s ease',
      opacity: phase === 'out' ? 0 : 1,
      pointerEvents: phase === 'out' ? 'none' : 'all',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;600;700&display=swap');

        .splash-logo {
          animation: splashIn 0.9s cubic-bezier(0.34,1.56,0.64,1) forwards;
          opacity: 0;
        }
        @keyframes splashIn {
          from { opacity: 0; transform: scale(0.4) translateY(30px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .splash-text {
          animation: splashTextIn 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.4s forwards;
          opacity: 0;
        }
        @keyframes splashTextIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .splash-tagline {
          animation: splashTextIn 0.8s ease 0.7s forwards;
          opacity: 0;
        }

        .splash-story {
          animation: splashTextIn 0.8s ease 1s forwards;
          opacity: 0;
        }

        .splash-bar {
          animation: splashBar 3s ease 0.6s forwards;
          width: 0%;
        }
        @keyframes splashBar {
          from { width: 0%; }
          to { width: 100%; }
        }

        .splash-dot {
          animation: dotBounce 0.6s ease infinite alternate;
          display: inline-block;
        }
        .splash-dot:nth-child(2) { animation-delay: 0.15s; }
        .splash-dot:nth-child(3) { animation-delay: 0.3s; }
        @keyframes dotBounce {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(-8px); opacity: 0.4; }
        }

        .splash-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          animation: blobPulse 5s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes blobPulse {
          0%,100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 0.3; }
        }

        .splash-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(0,191,165,0.2);
          animation: ringExpand 3s ease-in-out infinite;
        }
        @keyframes ringExpand {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2); opacity: 0; }
        }
      `}</style>

      <div className="splash-blob" style={{width: 500, height: 500, background: 'rgba(0,191,165,0.1)', top: '-150px', right: '-150px'}}></div>
      <div className="splash-blob" style={{width: 350, height: 350, background: 'rgba(255,107,74,0.07)', bottom: '-100px', left: '-100px', animationDelay: '2.5s'}}></div>

      <div style={{position: 'relative', marginBottom: 24}}>
        <div className="splash-ring" style={{width: 120, height: 120, top: '-20px', left: '-20px'}}></div>
        <div className="splash-ring" style={{width: 120, height: 120, top: '-20px', left: '-20px', animationDelay: '1s'}}></div>
        <div className="splash-logo">
          <svg width="80" height="80" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="14" fill="url(#splashGrad)"/>
            <path d="M20 8C13.373 8 8 13.373 8 20C8 26.627 13.373 32 20 32C26.627 32 32 26.627 32 20C32 13.373 26.627 8 20 8Z" fill="white" fillOpacity="0.1"/>
            <path d="M14 16L20 24L26 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="20" cy="14" r="2.5" fill="#FF6B4A"/>
            <path d="M13 28H27" stroke="#00BFA5" strokeWidth="2.5" strokeLinecap="round"/>
            <defs>
              <linearGradient id="splashGrad" x1="0" y1="0" x2="40" y2="40">
                <stop offset="0%" stopColor="#0d3060"/>
                <stop offset="100%" stopColor="#0A2540"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="splash-text" style={{textAlign: 'center', marginBottom: 8}}>
        <h1 style={{fontFamily: 'Syne, sans-serif', fontSize: 48, fontWeight: 900, color: 'white', letterSpacing: '-1px', lineHeight: 1}}>
          Ugele <span style={{color: '#00BFA5'}}>Online</span>
        </h1>
      </div>

      <p className="splash-tagline" style={{fontFamily: 'DM Sans, sans-serif', color: '#FF6B4A', fontSize: 13, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16}}>
        Ondo's Market. Nigeria's Platform.
      </p>

      <p className="splash-story" style={{fontFamily: 'DM Sans, sans-serif', color: 'rgba(255,255,255,0.35)', fontSize: 13, textAlign: 'center', maxWidth: 260, lineHeight: 1.7, marginBottom: 40}}>
      Order any service. From the comfort of your home.
      </p>

      <div style={{width: 180, height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden', marginBottom: 20}}>
        <div className="splash-bar" style={{height: '100%', background: 'linear-gradient(90deg, #00BFA5, #FF6B4A)', borderRadius: 2}}></div>
      </div>

      <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
        <span className="splash-dot" style={{width: 7, height: 7, background: '#00BFA5', borderRadius: '50%', display: 'inline-block'}}></span>
        <span className="splash-dot" style={{width: 7, height: 7, background: 'rgba(0,191,165,0.5)', borderRadius: '50%', display: 'inline-block'}}></span>
        <span className="splash-dot" style={{width: 7, height: 7, background: 'rgba(0,191,165,0.2)', borderRadius: '50%', display: 'inline-block'}}></span>
      </div>
    </div>
  )
}

function App() {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <BrowserRouter>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/provider/:id" element={<ProviderProfile />} />
        <Route path="/dashboard/provider" element={<ProviderDashboard />} />
        <Route path="/dashboard/client" element={<ClientDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App