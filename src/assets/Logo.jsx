export default function Logo({ size = 40, showText = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="12" fill="url(#grad)" />
        <path d="M20 8C13.373 8 8 13.373 8 20C8 26.627 13.373 32 20 32C26.627 32 32 26.627 32 20C32 13.373 26.627 8 20 8Z" fill="white" fillOpacity="0.15"/>
        <path d="M14 16L20 24L26 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="20" cy="14" r="2.5" fill="#FF6B4A"/>
        <path d="M13 28H27" stroke="#00BFA5" strokeWidth="2.5" strokeLinecap="round"/>
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0A2540"/>
            <stop offset="100%" stopColor="#0d4080"/>
          </linearGradient>
        </defs>
      </svg>
      {showText && (
        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: size * 0.55,
          fontWeight: 900,
          color: 'white',
          letterSpacing: '-0.5px'
        }}>
          Ugele <span style={{ color: '#00BFA5' }}>Online</span>
        </span>
      )}
    </div>
  )
}