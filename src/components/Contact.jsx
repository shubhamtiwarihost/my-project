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

const contactItems = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    label: 'Email',
    value: 'ShubhamTiwari@gmail.com',
    href: 'mailto:ShubhamTiwari@innovationalidea.com',
    color: 'rgba(99,102,241,0.12)',
    border: 'rgba(129,140,248,0.2)',
    iconColor: '#818cf8',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
    label: 'LinkedIn',
    value: 'Connect on LinkedIn',
    href: 'https://linkedin.com/in/Shubham Tiwari-chawla-818298a1',
    color: 'rgba(59,130,246,0.12)',
    border: 'rgba(96,165,250,0.2)',
    iconColor: '#60a5fa',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.7h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10.9a16 16 0 0 0 6 6l1.27-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 18z"/>
      </svg>
    ),
    label: 'Phone',
    value: '+91 98XXX XXXXX',
    href: 'tel:+91',
    color: 'rgba(16,185,129,0.1)',
    border: 'rgba(52,211,153,0.2)',
    iconColor: '#34d399',
  },
]

export default function Contact() {
  const ref = useFadeIn()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  const handleSubmit = e => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#e2e8f0',
    fontSize: '0.875rem',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s',
    boxSizing: 'border-box',
  }

  return (
    <section id="contact" style={{ padding: '80px 1.5rem', scrollMarginTop: '80px' }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        <div ref={ref} className="fade-in">
          <div style={{ marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(52,211,153,0.2)',
              fontSize: '0.75rem',
              color: '#6ee7b7',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}>
              Contact
            </div>
            <h2 className="section-title">Let's discuss delivery,integrations, and enterprise-grade execution.</h2>
            <p className="section-subtitle" style={{ maxWidth: '44rem' }}>shubham
              Reach out directly via email, phone, or LinkedIn — fast response, clear communication. Open to leadership roles and complex PHP/WordPress/API delivery engagements.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
          }}>
            {/* Contact Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '1rem',
                padding: '1.5rem',
                marginBottom: '0.5rem',
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '0.5rem' }}>
                  Typically responds within 24 hours
                </div>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: 1.6 }}>
                  Open to leadership roles and complex PHP/WordPress/API delivery engagements.
                </p>
              </div>

              {contactItems.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '1rem 1.25rem',
                    background: item.color,
                    border: `1px solid ${item.border}`,
                    borderRadius: '0.875rem',
                    textDecoration: 'none',
                    transition: 'transform 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: '10px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: item.iconColor, flexShrink: 0,
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{item.label}</div>
                    <div style={{ fontSize: '0.875rem', color: '#e2e8f0', fontWeight: 500 }}>{item.value}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Contact Form */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '1.25rem',
              padding: '2rem',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f1f5f9', margin: '0 0 1.5rem' }}>Send a message</h3>

              {sent ? (
                <div style={{
                  padding: '1.5rem',
                  background: 'rgba(16,185,129,0.12)',
                  border: '1px solid rgba(16,185,129,0.2)',
                  borderRadius: '0.875rem',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>✅</div>
                  <div style={{ color: '#6ee7b7', fontWeight: 600, fontSize: '0.9rem' }}>Message sent successfully!</div>
                  <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: 4 }}>I'll get back to you within 24 hours.</div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 6, letterSpacing: '0.04em' }}>NAME</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = 'rgba(129,140,248,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 6, letterSpacing: '0.04em' }}>EMAIL</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = 'rgba(129,140,248,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 6, letterSpacing: '0.04em' }}>SUBJECT</label>
                    <input
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="Project inquiry, collaboration..."
                      required
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'rgba(129,140,248,0.5)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 6, letterSpacing: '0.04em' }}>MESSAGE</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Describe your project or inquiry..."
                      required
                      rows={5}
                      style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(129,140,248,0.5)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px 20px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
