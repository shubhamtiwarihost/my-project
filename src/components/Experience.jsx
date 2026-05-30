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

const experiences = [
  {
    role: 'Senior PHP Developer & Team Lead',
    company: 'InnovationalIdea',
    period: 'Sep 2014 — Feb 2026',
    duration: '11+ years',
    type: 'Full-time',
    location: 'Mumbai, India',
    highlights: [
      'Led end-to-end delivery of enterprise SaaS platforms, internal tools, and client-facing WordPress solutions.',
      'Architected and developed scalable Laravel applications with clean separation of concerns and robust REST APIs.',
      'Managed cross-functional teams of 5–10 engineers, running Agile sprints, code reviews, and mentoring sessions.',
      'Served as primary technical point-of-contact for UK-based clients — requirement gathering, expectation management, and delivery reporting.',
      'Implemented CI/CD pipelines, AWS deployments, and production-grade monitoring with CloudWatch.',
      'Delivered Google Authenticator-based 2FA, Stripe/PayPal integrations, and complex role-based access systems.',
    ],
    tech: ['PHP', 'Laravel', 'MySQL', 'WordPress', 'AWS', 'Docker', 'REST APIs', 'JavaScript'],
  },
]

const certifications = [
  {
    title: 'Lead with an Impact',
    issuer: 'Team Leaders Accelerator Program',
    icon: '🏆',
    color: 'rgba(251,191,36,0.1)',
    border: 'rgba(251,191,36,0.2)',
  },
  {
    title: 'Employee of the Month',
    issuer: 'Performance recognition',
    icon: '⭐',
    color: 'rgba(99,102,241,0.1)',
    border: 'rgba(129,140,248,0.2)',
  },
]

export default function Experience() {
  const ref = useFadeIn()

  return (
    <section id="experience" style={{ padding: '80px 1.5rem', scrollMarginTop: '80px' }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        <div ref={ref} className="fade-in">
          <div style={{ marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'rgba(59,130,246,0.12)',
              border: '1px solid rgba(96,165,250,0.2)',
              fontSize: '0.75rem',
              color: '#93c5fd',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}>
              Experience
            </div>
            <h2 className="section-title">Professional experience</h2>
            <p className="section-subtitle" style={{ maxWidth: '40rem' }}>
              Long-term ownership across enterprise apps, SaaS delivery, client coordination, and production support.
            </p>
          </div>

          {/* Experience cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {experiences.map((exp, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.035)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '1.25rem',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Glow */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                  background: 'linear-gradient(to right, transparent, rgba(99,102,241,0.4), transparent)',
                }}/>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px' }}>{exp.role}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.9rem', color: '#818cf8', fontWeight: 600 }}>{exp.company}</span>
                      <span style={{ color: '#334155', fontSize: '0.8rem' }}>•</span>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{exp.location}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    <span style={{
                      fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 6, padding: '3px 10px',
                    }}>{exp.period}</span>
                    <span style={{
                      fontSize: '0.72rem', color: '#10b981', fontWeight: 600,
                      background: 'rgba(16,185,129,0.1)',
                      border: '1px solid rgba(16,185,129,0.2)',
                      borderRadius: 6, padding: '2px 8px',
                    }}>{exp.duration}</span>
                  </div>
                </div>

                {/* Highlights */}
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {exp.highlights.map((h, j) => (
                    <li key={j} style={{ display: 'flex', gap: 10, fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
                      <span style={{ color: '#818cf8', marginTop: 4, flexShrink: 0 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>

                {/* Tech stack */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {exp.tech.map(t => (
                    <span key={t} className="skill-tag" style={{ fontSize: '0.75rem' }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '1rem' }}>
              Certifications & Recognition
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem', lineHeight: 1.6 }}>
              Leadership training and performance recognition aligned with enterprise delivery outcomes.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
              {certifications.map(cert => (
                <div key={cert.title} style={{
                  background: cert.color,
                  border: `1px solid ${cert.border}`,
                  borderRadius: '0.875rem',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}>
                  <span style={{ fontSize: '1.5rem' }}>{cert.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9' }}>{cert.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{cert.issuer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
