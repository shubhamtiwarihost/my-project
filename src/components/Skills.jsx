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

const skillGroups = [
  {
    title: 'Backend',
    icon: '⚙️',
    color: 'rgba(99,102,241,0.15)',
    borderColor: 'rgba(129,140,248,0.2)',
    skills: ['PHP', 'Laravel', 'MySQL', 'REST APIs', 'Node.js', 'OOP / MVC', 'SOLID Principles'],
  },
  {
    title: 'Frontend',
    icon: '🖥️',
    color: 'rgba(168,85,247,0.12)',
    borderColor: 'rgba(167,139,250,0.2)',
    skills: ['JavaScript', 'HTML5', 'CSS3', 'jQuery', 'Vue.js (basics)', 'React (basics)'],
  },
  {
    title: 'WordPress & CMS',
    icon: '📝',
    color: 'rgba(59,130,246,0.12)',
    borderColor: 'rgba(96,165,250,0.2)',
    skills: ['WordPress', 'WooCommerce', 'Custom Plugins', 'Theme Development', 'ACF', 'Elementor'],
  },
  {
    title: 'Infrastructure & Tools',
    icon: '🛠️',
    color: 'rgba(16,185,129,0.1)',
    borderColor: 'rgba(52,211,153,0.2)',
    skills: ['AWS', 'AWS CloudWatch', 'Docker', 'Git', 'CI/CD Pipelines', 'Postman', 'Twilio'],
  },
  {
    title: 'Integrations',
    icon: '🔗',
    color: 'rgba(245,158,11,0.1)',
    borderColor: 'rgba(251,191,36,0.2)',
    skills: ['Stripe', 'PayPal', 'Twilio SMS', 'SendGrid', 'OAuth / JWT', 'Google APIs', 'Webhooks'],
  },
  {
    title: 'Leadership & Process',
    icon: '👑',
    color: 'rgba(236,72,153,0.1)',
    borderColor: 'rgba(244,114,182,0.2)',
    skills: ['Agile / Scrum', 'JIRA', 'Code Reviews', 'Team Mentoring', 'Client Communication', 'Estimation'],
  },
]

export default function Skills() {
  const ref = useFadeIn()

  return (
    <section id="skills" style={{ padding: '80px 1.5rem', scrollMarginTop: '80px' }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        <div ref={ref} className="fade-in">
          <div style={{ marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'rgba(139,92,246,0.12)',
              border: '1px solid rgba(167,139,250,0.2)',
              fontSize: '0.75rem',
              color: '#c4b5fd',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}>
              Skills
            </div>
            <h2 className="section-title">Technical skills, organized for delivery.</h2>
            <p className="section-subtitle" style={{ maxWidth: '42rem' }}>
              Clean groupings that reflect real-world execution: backend systems, integrations, front-end foundations, and team leadership.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.25rem',
          }}>
            {skillGroups.map(group => (
              <div
                key={group.title}
                style={{
                  background: group.color,
                  border: `1px solid ${group.borderColor}`,
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>{group.icon}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e2e8f0' }}>{group.title}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {group.skills.map(skill => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Additional tools */}
          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '1rem',
          }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Also used in production
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Reliability', 'Security', 'Performance', 'Maintainability', 'Confluence', 'Kanban', 'Google Authenticator', 'Redis', 'cURL', 'phpUnit', 'Composer', 'npm'].map(t => (
                <span key={t} className="skill-tag" style={{ fontSize: '0.75rem', opacity: 0.8 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
