import { useEffect, useRef } from 'react'

export default function Hero() {
  const ref = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (ref.current) ref.current.style.opacity = '1', ref.current.style.transform = 'translateY(0)'
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      id="home"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 1.5rem 60px',
        position: 'relative',
      }}
    >
      {/* Radial premium background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(1000px 600px at 20% 10%, rgba(99,102,241,0.22), transparent 60%), radial-gradient(900px 540px at 80% 20%, rgba(168,85,247,0.18), transparent 60%), radial-gradient(900px 560px at 60% 90%, rgba(59,130,246,0.1), transparent 55%)',
      }} />

      <div
        ref={ref}
        style={{
          maxWidth: '48rem',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          opacity: 0,
          transform: 'translateY(28px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        {/* Status badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px',
            borderRadius: '9999px',
            background: 'rgba(16,185,129,0.12)',
            border: '1px solid rgba(167,243,208,0.2)',
            fontSize: '0.8rem',
            color: '#6ee7b7',
            fontWeight: 500,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 8px rgba(16,185,129,0.7)',
              display: 'inline-block',
              animation: 'pulse 2s infinite',
            }}/>
            Available for new opportunities
          </div>
        </div>

        {/* Main heading */}
        <h1 style={{
          fontSize: 'clamp(2.4rem, 6vw, 4rem)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          color: '#f1f5f9',
          margin: '0 0 1rem',
        }}>
          Shubham Tiwari Chawla
        </h1>

        {/* Gradient role */}
        <div style={{
          fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
          fontWeight: 600,
          marginBottom: '1.25rem',
          background: 'linear-gradient(to right, #818cf8, #a78bfa, #60a5fa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.02em',
        }}>
          Senior Full-stack PHP Developer
        </div>

        {/* Description */}
        <p style={{
          fontSize: '1.05rem',
          color: '#94a3b8',
          lineHeight: 1.7,
          marginBottom: '0.75rem',
          maxWidth: '42rem',
          margin: '0 auto 0.75rem',
          textWrap: 'balance',
        }}>
          10+ years of hands-on full-stack PHP development across product and services environments.
          Building scalable enterprise applications, SaaS platforms, and WordPress solutions.
        </p>

        <p style={{
          fontSize: '0.9rem',
          color: '#64748b',
          marginBottom: '2.5rem',
          letterSpacing: '0.01em',
        }}>
          PHP • Laravel • MySQL • REST APIs
        </p>

        {/* Stats */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '3rem',
          marginBottom: '2.5rem',
        }}>
          {[
            { num: '10+', label: 'Years Experience' },
            { num: '50+', label: 'Projects Delivered' },
            { num: '100%', label: 'Delivery Ownership' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
                fontWeight: 700,
                color: '#f1f5f9',
                letterSpacing: '-0.03em',
                lineHeight: 1,
                marginBottom: 4,
              }}>{stat.num}</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="#contact"
            className="btn-primary"
            style={{ textDecoration: 'none' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Get In Touch
          </a>
          <a
            href="#projects"
            className="btn-secondary"
            style={{ textDecoration: 'none' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            View Projects
          </a>
          <a
            href="https://linkedin.com/in/ShubhamTiwari-818298a1"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ textDecoration: 'none' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect x="2" y="9" width="4" height="12"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
            LinkedIn
          </a>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          opacity: 0.4,
        }}>
          <span style={{ fontSize: '0.7rem', color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{
            width: 1, height: 40,
            background: 'linear-gradient(to bottom, #64748b, transparent)',
          }}/>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </section>
  )
}
