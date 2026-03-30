import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import Logo from '../assets/Logo'

const orbitItems = [
  { icon: "🔧", label: "Plumber", angle: 0 },
  { icon: "🍛", label: "Food Seller", angle: 60 },
  { icon: "🧵", label: "Tailor", angle: 120 },
  { icon: "📸", label: "Photographer", angle: 180 },
  { icon: "⚖️", label: "Lawyer", angle: 240 },
  { icon: "🎨", label: "Designer", angle: 300 },
]

const hotServices = [
  { icon: "🧵", label: "Tailor", tag: "Hot in Ondo", rating: 4 },
  { icon: "🔧", label: "Plumber", tag: "Hot in Akure", rating: 4 },
  { icon: "💄", label: "Makeup Artist", tag: "Hot in Lagos", rating: 5 },
  { icon: "🍛", label: "Food Seller", tag: "Hot in Benin City", rating: 4 },
]

const words = ["Plumber", "Caterer", "Tailor", "Designer", "Lawyer", "Electrician"]

export default function Home() {
  const navigate = useNavigate()
  const [wordIndex, setWordIndex] = useState(0)
  const [wordVisible, setWordVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [orbitAngle, setOrbitAngle] = useState(0)
  const [isDesktop, setIsDesktop] = useState(false)
  const rafRef = useRef(null)

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth > 900)
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    setTimeout(() => setLoaded(true), 100)
    const wordInterval = setInterval(() => {
      setWordVisible(false)
      setTimeout(() => {
        setWordIndex(i => (i + 1) % words.length)
        setWordVisible(true)
      }, 300)
    }, 2200)
    return () => {
      clearInterval(wordInterval)
      window.removeEventListener('resize', checkDesktop)
    }
  }, [])

  useEffect(() => {
    if (!isDesktop) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }
    let lastTime = 0
    const animate = (time) => {
      if (time - lastTime >= 16) {
        setOrbitAngle(a => (a + 0.4) % 360)
        lastTime = time
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isDesktop])

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', background: '#060d1a', color: 'white', overflowX: 'hidden', position: 'relative' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        .syne { font-family: 'Syne', sans-serif; }

        .enter-up {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1);
        }
        .enter-up.loaded { opacity: 1; transform: translateY(0); }
        .d1 { transition-delay: 0.1s; }
        .d2 { transition-delay: 0.25s; }
        .d3 { transition-delay: 0.4s; }
        .d4 { transition-delay: 0.55s; }
        .d5 { transition-delay: 0.7s; }

        .top-bar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          padding: 14px 36px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(6,13,26,0.6);
          backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .top-bar::after {
          content: '';
          position: absolute;
          bottom: 0; left: 8%; right: 8%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,191,165,0.6), rgba(255,107,74,0.4), transparent);
        }

        .side-nav {
          position: fixed;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 100;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 14px 8px;
        }

        .side-btn {
          background: none;
          border: none;
          color: rgba(255,255,255,0.45);
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 700;
          cursor: pointer;
          padding: 10px 6px;
          border-radius: 10px;
          transition: all 0.3s ease;
          writing-mode: vertical-rl;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
        .side-btn:hover {
          color: white;
          background: rgba(0,191,165,0.1);
        }

        .side-cta {
          background: linear-gradient(180deg, #FF6B4A, #e55a3a);
          color: white;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 700;
          cursor: pointer;
          padding: 12px 6px;
          border-radius: 10px;
          writing-mode: vertical-rl;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          transition: all 0.3s ease;
          box-shadow: 0 0 16px rgba(255,107,74,0.3);
        }
        .side-cta:hover {
          transform: scale(1.05);
          box-shadow: 0 0 28px rgba(255,107,74,0.5);
        }

        .side-divider {
          width: 4px;
          height: 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
        }

        .ticker-wrap {
          position: fixed;
          top: 56px; left: 0; right: 0;
          z-index: 99;
          overflow: hidden;
          background: rgba(0,191,165,0.88);
          backdrop-filter: blur(10px);
          padding: 7px 0;
        }
        .ticker-inner {
          display: flex;
          gap: 56px;
          white-space: nowrap;
          animation: tickerAnim 30s linear infinite;
          width: max-content;
        }
        @keyframes tickerAnim { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        .word-flip {
          display: inline-block;
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .word-in { opacity: 1; transform: translateY(0); }
        .word-out { opacity: 0; transform: translateY(-14px); }

        .search-field {
          flex: 1;
          padding: 14px 20px;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          background: rgba(255,255,255,0.07);
          color: white;
          border: 1.5px solid rgba(255,255,255,0.08);
          transition: all 0.3s ease;
        }
        .search-field::placeholder { color: rgba(255,255,255,0.25); }
        .search-field:focus {
          outline: none;
          border-color: #00BFA5;
          background: rgba(255,255,255,0.1);
          box-shadow: 0 0 0 4px rgba(0,191,165,0.1);
        }

        .orb-glow {
          position: absolute;
          inset: -60px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,191,165,0.18) 0%, transparent 65%);
          animation: orbPulse 3s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes orbPulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.5; }
        }

        .orb-core {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: radial-gradient(circle at 33% 33%, #1e5080, #0d2a50, #060d1a);
          box-shadow:
            0 0 50px rgba(0,191,165,0.5),
            0 0 100px rgba(0,191,165,0.2),
            inset 0 0 40px rgba(0,191,165,0.1),
            inset -15px -15px 40px rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 2px;
          cursor: pointer;
          transition: all 0.4s ease;
          z-index: 4;
        }
        .orb-core:hover {
          box-shadow:
            0 0 70px rgba(0,191,165,0.7),
            0 0 130px rgba(0,191,165,0.25),
            inset 0 0 50px rgba(0,191,165,0.15);
          transform: translate(-50%, -50%) scale(1.06);
        }

        .orbit-icon {
          position: absolute;
          top: 50%; left: 50%;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          cursor: pointer;
          transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
          z-index: 3;
        }
        .orbit-icon:hover {
          background: rgba(0,191,165,0.2);
          border-color: rgba(0,191,165,0.6);
          box-shadow: 0 0 24px rgba(0,191,165,0.4);
        }

        .hot-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
          position: relative;
          overflow: hidden;
        }
        .hot-card:hover {
          transform: translateY(-6px);
          border-color: rgba(0,191,165,0.3);
          box-shadow: 0 16px 40px rgba(0,0,0,0.35);
          background: rgba(0,191,165,0.05);
        }

        .book-btn {
          width: 100%;
          padding: 9px;
          background: linear-gradient(135deg, #FF6B4A, #e55a3a);
          color: white;
          border: none;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 14px rgba(255,107,74,0.3);
        }
        .book-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(255,107,74,0.4);
        }

        .mobile-overlay {
          position: fixed; inset: 0;
          background: rgba(6,13,26,0.99);
          z-index: 300;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 28px;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes dotPulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(2); opacity: 0.3; } }

        @media (max-width: 960px) {
          .side-nav { display: none !important; }
          .main-grid { grid-template-columns: 1fr !important; padding-left: 20px !important; }
          .orb-col { justify-content: center; }
          .orb-wrap { width: 250px !important; height: 250px !important; }
          .mobile-toggle { display: flex !important; }
        }
        @media (max-width: 600px) {
          .hot-grid { grid-template-columns: 1fr 1fr !important; }
          .hero-h { font-size: 38px !important; }
        }
      `}</style>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-overlay">
          <button onClick={() => setMenuOpen(false)} style={{ position: 'absolute', top: 20, right: 24, background: 'none', border: 'none', color: 'white', fontSize: 28, cursor: 'pointer' }}>✕</button>
          <Logo size={48} />
          {[['Browse Services', '/browse'], ['Login', '/login'], ['Get Started', '/register']].map(([label, path]) => (
            <button key={label} onClick={() => { navigate(path); setMenuOpen(false) }}
              style={{ background: 'none', border: 'none', color: 'white', fontSize: 22, fontFamily: 'Syne, sans-serif', fontWeight: 800, cursor: 'pointer' }}
              onMouseOver={e => e.target.style.color = '#00BFA5'}
              onMouseOut={e => e.target.style.color = 'white'}
            >{label}</button>
          ))}
        </div>
      )}

      {/* SIDE NAV */}
      <div className="side-nav">
        <div style={{ marginBottom: 4 }}>
          <Logo size={26} showText={false} />
        </div>
        <div className="side-divider"></div>
        <button className="side-btn" onClick={() => navigate('/browse')}>Browse</button>
        <div className="side-divider"></div>
        <button className="side-btn" onClick={() => navigate('/login')}>Login</button>
        <div className="side-divider"></div>
        <button className="side-cta" onClick={() => navigate('/register')}>Start</button>
      </div>

      {/* TOP BAR */}
      <div className="top-bar">
        <Logo size={34} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(0,191,165,0.08)', border: '1px solid rgba(0,191,165,0.15)', borderRadius: 100, padding: '5px 14px' }}>
            <span style={{ width: 6, height: 6, background: '#FF6B4A', borderRadius: '50%', display: 'inline-block', animation: 'dotPulse 2s ease-in-out infinite' }}></span>
            <span style={{ color: '#00BFA5', fontSize: 12, fontWeight: 600 }}>Inspired by Ondo. Built for Nigeria.</span>
          </div>
          <button className="mobile-toggle" onClick={() => setMenuOpen(true)} style={{ display: 'none', background: 'none', border: 'none', color: 'white', fontSize: 22, cursor: 'pointer', alignItems: 'center' }}>☰</button>
        </div>
      </div>

      {/* TICKER */}
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: 56 }}>
              {["🔧 Plumbers", "⚡ Electricians", "🍛 Food Sellers", "🧵 Tailors", "📸 Photographers", "🏍️ Dispatch Riders", "🧹 Cleaners", "⚖️ Lawyers", "🎨 Designers", "📚 Teachers", "💄 Makeup Artists", "🐄 Livestock Sellers", "🔩 Welders", "🪚 Carpenters", "🍽️ Caterers"].map(item => (
                <span key={item} style={{ color: '#0A2540', fontWeight: 700, fontSize: 11 }}>{item}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div className="main-grid" style={{ paddingLeft: 90, paddingRight: 32, paddingTop: 116, paddingBottom: 40, maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 400px', gap: 48, minHeight: '100vh', alignItems: 'center' }}>

        {/* LEFT */}
        <div>
          <div className={`enter-up d1 ${loaded ? 'loaded' : ''}`}>
            <h1 className="syne hero-h" style={{ fontSize: 'clamp(38px, 5vw, 70px)', fontWeight: 900, lineHeight: 1.07, marginBottom: 18 }}>
              Find Your<br />
              <span className={`word-flip ${wordVisible ? 'word-in' : 'word-out'}`} style={{ color: '#FF6B4A' }}>{words[wordIndex]}</span><br />
              <span style={{ color: 'rgba(255,255,255,0.28)' }}>Without Leaving Home</span>
            </h1>
          </div>

          <div className={`enter-up d2 ${loaded ? 'loaded' : ''}`}>
            <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 15, lineHeight: 1.8, marginBottom: 24, maxWidth: 440 }}>
              Getting services done in Nigeria just got easier. Find skilled professionals near you and get the job done from the comfort of your home. No stress. No going out. Just order.
            </p>
          </div>

          <div className={`enter-up d3 ${loaded ? 'loaded' : ''}`} style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 8, maxWidth: 440 }}>
              <input className="search-field" placeholder="Search for a service..." onKeyDown={e => e.key === 'Enter' && navigate('/browse')} />
              <button onClick={() => navigate('/browse')} style={{ padding: '14px 18px', borderRadius: 12, background: '#FF6B4A', color: 'white', border: 'none', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 0 20px rgba(255,107,74,0.3)', transition: 'all 0.3s' }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 32px rgba(255,107,74,0.5)' }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(255,107,74,0.3)' }}
              >Search 🔍</button>
            </div>
          </div>

          <div className={`enter-up d4 ${loaded ? 'loaded' : ''}`} style={{ display: 'flex', gap: 10, marginBottom: 36, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/browse')} style={{ padding: '11px 22px', borderRadius: 11, background: 'rgba(0,191,165,0.1)', color: '#00BFA5', border: '1px solid rgba(0,191,165,0.22)', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.3s' }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(0,191,165,0.18)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(0,191,165,0.1)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >🔍 Browse Services</button>
            <button onClick={() => navigate('/register')} style={{ padding: '11px 22px', borderRadius: 11, background: 'rgba(255,107,74,0.1)', color: '#FF6B4A', border: '1px solid rgba(255,107,74,0.22)', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.3s' }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,107,74,0.18)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,107,74,0.1)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >🚀 List Your Service</button>
          </div>

          <div className={`enter-up d5 ${loaded ? 'loaded' : ''}`}>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 12 }}>Hot Near You</p>
            <div className="hot-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {hotServices.map(s => (
                <div key={s.label} className="hot-card" onClick={() => navigate('/browse')}>
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ background: 'rgba(255,107,74,0.12)', color: '#FF6B4A', fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 4, marginBottom: 6, display: 'inline-block', letterSpacing: '0.3px' }}>{s.tag}</div>
                  <p className="syne" style={{ fontSize: 12, fontWeight: 800, color: 'white', marginBottom: 4 }}>{s.label}</p>
                  <div style={{ color: '#f59e0b', fontSize: 10, marginBottom: 10 }}>{'⭐'.repeat(s.rating)}</div>
                  <button className="book-btn">Book Now</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — ORB (desktop) / Static grid (mobile) */}
        <div className="orb-col" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isDesktop ? (
            <div className="orb-wrap" style={{ position: 'relative', width: 340, height: 340 }}>

              {/* Glow */}
              <div className="orb-glow"></div>

              {/* Rings */}
              {[320, 260, 200].map((size, i) => (
                <div key={size} style={{ position: 'absolute', top: '50%', left: '50%', width: size, height: size, borderRadius: '50%', border: `1px solid rgba(0,191,165,${0.08 - i * 0.02})`, transform: 'translate(-50%,-50%)', pointerEvents: 'none' }}></div>
              ))}

              {/* Orbit path SVG */}
              <svg style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 320, height: 320, pointerEvents: 'none' }}>
                <ellipse cx="160" cy="160" rx="158" ry="65" fill="none" stroke="rgba(0,191,165,0.12)" strokeWidth="1" transform="rotate(-15 160 160)"/>
                <ellipse cx="160" cy="160" rx="158" ry="65" fill="none" stroke="rgba(255,107,74,0.08)" strokeWidth="1" transform="rotate(45 160 160)"/>
              </svg>

              {/* Orbiting icons */}
              {orbitItems.map((item) => {
                const angle = ((item.angle + orbitAngle) * Math.PI) / 180
                const rx = 155, ry = 62
                const tilt = -15 * Math.PI / 180
                const x = rx * Math.cos(angle) * Math.cos(tilt) - ry * Math.sin(angle) * Math.sin(tilt)
                const y = rx * Math.cos(angle) * Math.sin(tilt) + ry * Math.sin(angle) * Math.cos(tilt)
                const depth = 0.72 + 0.28 * (1 + Math.sin(angle + Math.PI / 2)) / 2
                return (
                  <div key={item.label} className="orbit-icon" onClick={() => navigate('/browse')}
                    style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${depth})`, zIndex: Math.round(depth * 10), opacity: 0.5 + depth * 0.5 }}>
                    <span style={{ fontSize: 22 }}>{item.icon}</span>
                    <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginTop: 2, textAlign: 'center' }}>{item.label}</span>
                  </div>
                )
              })}

              {/* CENTER ORB */}
              <div className="orb-core" onClick={() => navigate('/browse')}>
                <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 4 }}>Welcome to</span>
                <span className="syne" style={{ fontSize: 18, fontWeight: 900, color: 'white', lineHeight: 1 }}>Ugele</span>
                <span className="syne" style={{ fontSize: 18, fontWeight: 900, color: '#00BFA5', lineHeight: 1, marginBottom: 6 }}>Online</span>
                <div style={{ width: 32, height: 1.5, background: 'linear-gradient(90deg, transparent, #00BFA5, transparent)', marginBottom: 6 }}></div>
                <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Tap to Explore</span>
              </div>

            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, width: '100%', maxWidth: 320 }}>
              {orbitItems.map((item) => (
                <div key={item.label} onClick={() => navigate('/browse')}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '16px 8px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', cursor: 'pointer' }}>
                  <span style={{ fontSize: 28 }}>{item.icon}</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 600, textAlign: 'center' }}>{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER STRIP */}
      <div style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.04)', padding: '14px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 36 }}>
          {[['50+', 'Categories'], ['Free', 'Register'], ['🇳🇬', 'Nigeria']].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p className="syne" style={{ fontSize: 18, fontWeight: 900, color: 'white' }}>{num}</p>
              <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: 10 }}>{label}</p>
            </div>
          ))}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: 11 }}>Inspired by Ondo. Built for Nigeria. Version 1.0 © 2026</p>
      </div>
    </div>
  )
}