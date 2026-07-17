export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.07)',
      padding: '2.5rem 1.5rem',
      marginTop: '2rem',
    }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.8), rgba(139,92,246,0.8))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em',
            }}>MC</div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9' }}>Shubham Tiwari</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Senior Full-stack PHP Developer</div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {['#home', '#about', '#skills', '#experience', '#projects', '#contact'].map(href => (
              <a
                key={href}
                href={href}
                style={{
                  fontSize: '0.8rem',
                  color: '#64748b',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                  fontWeight: 500,
                }}
                onMouseEnter={e => e.target.style.color = '#f1f5f9'}
                onMouseLeave={e => e.target.style.color = '#64748b'}
              >
                {href.slice(1).charAt(0).toUpperCase() + href.slice(2)}
              </a>
            ))}
          </nav>

          {/* Social */}
          <div style={{ display: 'flex', gap: 10 }}>
            <a
              href="https://linkedin.com/in/ShubhamTiwari-818298a1"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 36, height: 36, borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#64748b', textDecoration: 'none',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#f1f5f9' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#64748b' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a
              href="https://github.com/Shubham Tiwari-chawla"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 36, height: 36, borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#64748b', textDecoration: 'none',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#f1f5f9' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#64748b' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                <path d="M9 18c-4.51 2-5-2-7-2"/>
              </svg>
            </a>
          </div>
        </div>

        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>
          <p style={{ fontSize: '0.78rem', color: '#334155', margin: 0 }}>
            © {year} Shubham Tiwari. All rights reserved.
          </p>
          <p style={{ fontSize: '0.78rem', color: '#334155', margin: 0 }}>
            Senior Full-stack PHP Developer & Technical Lead
          </p>
        </div>
      </div>
    </footer>
  )
}
