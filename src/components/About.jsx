import { useEffect, useRef } from 'react'

function useFadeIn() {
  const ref = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target) } },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return ref
}

const highlights = [
  { icon: '🏗️', title: 'Enterprise Architecture', desc: 'Scalable, maintainable systems built with clean architecture principles and battle-tested patterns.' },
  { icon: '⚡', title: 'SaaS & Product Delivery', desc: 'End-to-end ownership from planning to release. SaaS platforms delivered with speed and reliability.' },
  { icon: '🔗', title: 'API & Integrations', desc: 'Complex REST API design, third-party integrations, and seamless inter-service communication.' },
  { icon: '👥', title: 'Team Leadership', desc: 'Mentoring engineers, conducting code reviews, estimation, and building execution consistency.' },
]

export default function About() {
  const ref = useFadeIn()

  return (
    <section id="about" style={{ padding: '80px 1.5rem', scrollMarginTop: '80px' }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        <div ref={ref} className="fade-in">
          {/* Section header */}
          <div style={{ marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(129,140,248,0.2)',
              fontSize: '0.75rem',
              color: '#a5b4fc',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}>
              About
            </div>
            <h2 className="section-title">Experience summary</h2>
            <p className="section-subtitle" style={{ maxWidth: '36rem' }}>
              Senior full-stack engineering with delivery ownership.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {highlights.map(h => (
              <div key={h.title} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: '1.5rem' }}>{h.icon}</div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f1f5f9', marginBottom: 6 }}>{h.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>{h.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Main bio */}
          <div style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '1.25rem',
            padding: '2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '0.75rem', marginTop: 0 }}>
                A leadership-first approach
              </h3>
              <p style={{ color: '#94a3b8', lineHeight: 1.75, fontSize: '0.9rem', margin: 0 }}>
                I build enterprise applications that balance quality, speed, and operational reality. My focus is clean architecture, resilient integrations, and delivery practices that scale across teams.
              </p>
              <p style={{ color: '#94a3b8', lineHeight: 1.75, fontSize: '0.9rem', marginTop: '0.75rem', marginBottom: 0 }}>
                Experienced in PHP development, SaaS applications, WordPress solutions, API integrations, team leadership, and end-to-end project delivery.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '0.75rem', marginTop: 0 }}>
                What I bring
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Requirement gathering & stakeholder alignment',
                  'End-to-end accountability from planning to release',
                  'Smooth handoffs with QA, DevOps & Product',
                  'Security, performance & reliability practices',
                  'Mentoring, code reviews & estimation',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.875rem', color: '#94a3b8' }}>
                    <span style={{ color: '#818cf8', marginTop: 3, flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
