import { useState, useEffect } from 'react'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      const sections = navLinks.map(l => l.href.slice(1))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(sections[i])
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 60,
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
        background: scrolled ? 'rgba(11,18,34,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
          {/* Logo */}
          <a href="#home" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.85) 0%, rgba(139,92,246,0.85) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '-0.02em',
              }}>MC</div>
              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f1f5f9', letterSpacing: '-0.01em' }}>
                Shubham Tiwari Chawla
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="hidden-mobile">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link"
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  color: active === link.href.slice(1) ? '#f1f5f9' : '#94a3b8',
                  background: active === link.href.slice(1) ? 'rgba(255,255,255,0.07)' : 'transparent',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a
              href="#contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 18px',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 600,
                background: 'linear-gradient(to right, rgba(99,102,241,0.9), rgba(139,92,246,0.9))',
                color: '#fff',
                textDecoration: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Let's Talk
            </a>
            {/* Mobile menu btn */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: 'none',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '6px 10px',
                color: '#94a3b8',
                cursor: 'pointer',
              }}
              className="mobile-menu-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '12px 0 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}>
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  color: active === link.href.slice(1) ? '#f1f5f9' : '#94a3b8',
                  background: active === link.href.slice(1) ? 'rgba(255,255,255,0.07)' : 'transparent',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  )
}
