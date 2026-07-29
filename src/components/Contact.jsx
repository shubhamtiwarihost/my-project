import { useEffect, useState } from 'react'
import { useContent } from '../context/ContentProvider'
import { useInView } from '../hooks/useInView'
import { submitContact } from '../lib/api'
import { IconLinkedIn, IconMail, IconPhone, IconSend } from './Icons'

export default function Contact() {
  const { contactCopy, profile } = useContent()
  const [ref, visible] = useInView()
  const [form, setForm] = useState({ name: '', email: '', subject: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const contactItems = [
    {
      label: 'Email',
      value: profile.email,
      href: profile.emailMailto,
      icon: IconMail,
    },
    {
      label: 'LinkedIn',
      value: 'Connect on LinkedIn',
      href: profile.linkedin,
      icon: IconLinkedIn,
    },
    {
      label: 'Phone',
      value: profile.phone,
      href: profile.phoneHref,
      icon: IconPhone,
    },
  ]

  useEffect(() => {
    if (!sent) return undefined
    const timer = setTimeout(() => setSent(false), 4000)
    return () => clearTimeout(timer)
  }, [sent])

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await submitContact(form)
      setSent(true)
      setForm({ name: '', email: '', subject: '', phone: '', message: '' })
    } catch {
      // Fallback to mailto if API is unavailable
      const body = [
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        form.phone ? `Phone: ${form.phone}` : '',
        '',
        form.message,
      ]
        .filter(Boolean)
        .join('\n')
      window.location.href = `${profile.emailMailto}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`
      setSent(true)
      setForm({ name: '', email: '', subject: '', phone: '', message: '' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="section">
      <div className={`container reveal ${visible ? 'is-visible' : ''}`} ref={ref}>
        <header className="section-head">
          <p className="eyebrow">{contactCopy.eyebrow}</p>
          <h2 className="section-title">{contactCopy.title}</h2>
          <p className="section-subtitle">{contactCopy.subtitle}</p>
        </header>

        <div className="contact-layout">
          <div className="contact-aside">
            <div className="contact-aside__note">
              <h3>{contactCopy.responseNote}</h3>
              <p>{contactCopy.responseBody}</p>
            </div>

            {contactItems.map((item) => {
              const Icon = item.icon
              const content = (
                <>
                  <span className="contact-link__icon">
                    <Icon />
                  </span>
                  <span>
                    <span className="contact-link__label">{item.label}</span>
                    <span className="contact-link__value">{item.value}</span>
                  </span>
                </>
              )

              if (!item.href) {
                return (
                  <div key={item.label} className="contact-link is-static">
                    {content}
                  </div>
                )
              }

              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="contact-link"
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {content}
                </a>
              )
            })}

            {profile.resumeUrl && (
              <a className="contact-link" href={profile.resumeUrl}>
                <span className="contact-link__icon">
                  <IconSend />
                </span>
                <span>
                  <span className="contact-link__label">Resume</span>
                  <span className="contact-link__value">Download PDF</span>
                </span>
              </a>
            )}
          </div>

          <div className="contact-form-wrap">
            <h3>{contactCopy.formTitle}</h3>

            {sent ? (
              <div className="contact-success" role="status">
                <strong>{contactCopy.successTitle}</strong>
                <p>{contactCopy.successBody}</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                {error && <p className="stack-line" style={{ color: '#b42318' }}>{error}</p>}
                <div className="contact-form__row">
                  <label>
                    <span>Name</span>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      autoComplete="name"
                    />
                  </label>
                  <label>
                    <span>Email</span>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      autoComplete="email"
                    />
                  </label>
                </div>
                <label>
                  <span>Phone (optional)</span>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 ..."
                    autoComplete="tel"
                  />
                </label>
                <label>
                  <span>Subject</span>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Project inquiry, collaboration..."
                    required
                  />
                </label>
                <label>
                  <span>Message</span>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Describe your project or inquiry..."
                    required
                    rows={5}
                  />
                </label>
                <button type="submit" className="btn btn-primary contact-form__submit" disabled={submitting}>
                  <IconSend />
                  {submitting ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
