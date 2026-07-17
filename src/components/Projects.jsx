import { useEffect, useRef, useState } from 'react'

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

const projects = [
  {
    title: 'SaaS Token & Queue System',
    category: 'SaaS Platform',
    badge: 'Private Repo',
    badgeColor: 'rgba(99,102,241,0.15)',
    badgeBorder: 'rgba(129,140,248,0.25)',
    badgeText: '#a5b4fc',
    desc: 'Live token and queue management system with real-time admin dashboard, Google Authenticator 2FA, reporting, and monitoring.',
    features: ['Live token and queue management', 'Google Authenticator 2FA', 'Admin dashboard and analytics', 'Reporting and monitoring system'],
    tech: ['Laravel', 'PHP', 'MySQL', 'JavaScript', 'AWS'],
    icon: '🎯',
  },
  {
    title: 'Appointment Booking Platform',
    category: 'Enterprise SaaS',
    badge: 'Private Repo',
    badgeColor: 'rgba(99,102,241,0.15)',
    badgeBorder: 'rgba(129,140,248,0.25)',
    badgeText: '#a5b4fc',
    desc: 'Full appointment scheduling system with customer management, staff & payroll, subscription billing, and analytics dashboard.',
    features: ['Appointment scheduling', 'Customer management', 'Staff and payroll management', 'Subscription and billing system', 'Reports and analytics dashboard', 'Automated notifications'],
    tech: ['Laravel', 'PHP', 'MySQL', 'REST APIs', 'Stripe'],
    icon: '📅',
  },
  {
    title: 'Payroll & HR Management',
    category: 'Internal System',
    badge: 'Private Repo',
    badgeColor: 'rgba(99,102,241,0.15)',
    badgeBorder: 'rgba(129,140,248,0.25)',
    badgeText: '#a5b4fc',
    desc: 'Complete employee and payroll management system with attendance tracking, leave management, salary reports, and role-based access control.',
    features: ['Employee management', 'Payroll processing', 'Attendance and leave tracking', 'Salary reports and analytics', 'User roles and permissions'],
    tech: ['PHP', 'Laravel', 'MySQL', 'JavaScript', 'Bootstrap'],
    icon: '💼',
  },
  {
    title: 'WordPress Business Sites',
    category: 'WordPress & WooCommerce',
    badge: 'Multi-project',
    badgeColor: 'rgba(59,130,246,0.12)',
    badgeBorder: 'rgba(96,165,250,0.2)',
    badgeText: '#93c5fd',
    desc: 'Responsive business websites and WooCommerce stores built for UK clients with product catalog management and admin content management.',
    features: ['Responsive business website', 'Product catalog management', 'Admin content management', 'Product listing and management', 'Shopping cart functionality', 'Order and inquiry management'],
    tech: ['WordPress', 'WooCommerce', 'PHP', 'CSS3', 'jQuery'],
    icon: '🌐',
  },
  {
    title: 'Order Management Dashboard',
    category: 'Internal Tool',
    badge: 'Private Repo',
    badgeColor: 'rgba(99,102,241,0.15)',
    badgeBorder: 'rgba(129,140,248,0.25)',
    badgeText: '#a5b4fc',
    desc: 'Internal order management dashboard with dispatch tracking, inventory coordination, user access management, and order status reporting.',
    features: ['Internal order management dashboard', 'Dispatch and shipment tracking workflow', 'Inventory and stock coordination', 'User role and access management', 'Order status tracking and reporting'],
    tech: ['Laravel', 'PHP', 'MySQL', 'REST APIs', 'JavaScript'],
    icon: '📦',
  },
  {
    title: 'Admin Business Operations Panel',
    category: 'Admin Platform',
    badge: 'Private Repo',
    badgeColor: 'rgba(99,102,241,0.15)',
    badgeBorder: 'rgba(129,140,248,0.25)',
    badgeText: '#a5b4fc',
    desc: 'Comprehensive admin panel for business operations with lead management, contact and inquiry system, and professional experience tracking.',
    features: ['Admin panel for business operations', 'Contact and inquiry system', 'Client communication module', 'Enterprise quality gates'],
    tech: ['PHP', 'Laravel', 'MySQL', 'Docker', 'AWS'],
    icon: '🏢',
  },
]

export default function Projects() {
  const ref = useFadeIn()
  const [expanded, setExpanded] = useState(null)

  return (
    <section id="projects" style={{ padding: '80px 1.5rem', scrollMarginTop: '80px' }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        <div ref={ref} className="fade-in">
          <div style={{ marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'rgba(168,85,247,0.12)',
              border: '1px solid rgba(196,125,250,0.2)',
              fontSize: '0.75rem',
              color: '#d8b4fe',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}>
              Projects
            </div>
            <h2 className="section-title">Real SaaS</h2>
            <p className="section-subtitle" style={{ maxWidth: '44rem' }}>
               with client coordination and production support. Each project reflects full ownership — from planning to post-launch.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}>
            {projects.map((project, i) => (
              <div
                key={i}
                className="card"
                style={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '10px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.2rem', flexShrink: 0,
                    }}>
                      {project.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f1f5f9', lineHeight: 1.3 }}>{project.title}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>{project.category}</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 600,
                    color: project.badgeText,
                    background: project.badgeColor,
                    border: `1px solid ${project.badgeBorder}`,
                    borderRadius: 6,
                    padding: '2px 8px',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    marginLeft: 8,
                  }}>{project.badge}</span>
                </div>

                {/* Desc */}
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.65, margin: '0 0 1rem', flexGrow: 1 }}>
                  {project.desc}
                </p>

                {/* Features - expandable */}
                <div style={{ marginBottom: '1rem' }}>
                  <button
                    onClick={() => setExpanded(expanded === i ? null : i)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#818cf8',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: '4px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    {expanded === i ? 'Hide' : 'Show'} features
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                      style={{ transform: expanded === i ? 'rotate(180deg)' : 'none', transition: '0.2s' }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  {expanded === i && (
                    <ul style={{ listStyle: 'none', padding: '8px 0 0', margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {project.features.map(f => (
                        <li key={f} style={{ display: 'flex', gap: 8, fontSize: '0.8rem', color: '#94a3b8' }}>
                          <span style={{ color: '#818cf8', marginTop: 3, flexShrink: 0 }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Tech */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.875rem' }}>
                  {project.tech.map(t => (
                    <span key={t} className="skill-tag" style={{ fontSize: '0.72rem' }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '2rem',
            padding: '1.25rem 1.5rem',
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(129,140,248,0.15)',
            borderRadius: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
              Most projects are private client engagements. All work involves full ownership — architecture, delivery, client coordination, and production support.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
