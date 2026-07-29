import { useEffect, useState } from 'react'
import { contactCopy, profile } from '../data/content'
import { useInView } from '../hooks/useInView'
import { IconLinkedIn, IconMail, IconPhone, IconSend } from './Icons'

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

export default function Contact() {
  const [ref, visible] = useInView()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (!sent) return undefined
    const timer = setTimeout(() => setSent(false), 3000)
    return () => clearTimeout(timer)
  }, [sent])

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      '',
      form.message,
    ].join('\n')
    const mailto = `${profile.emailMailto}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailto
    setSent(true)
    setForm({ name: '', email: '', subject: '', message: '' })
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
                <button type="submit" className="btn btn-primary contact-form__submit">
                  <IconSend />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
