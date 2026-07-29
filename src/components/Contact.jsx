import { useEffect, useState } from 'react'
import { useContent } from '../context/ContentProvider'
import { useInView } from '../hooks/useInView'
import { submitContact } from '../lib/api'
import { IconSend } from './Icons'

export default function Contact() {
  const { contactCopy, profile } = useContent()
  const [ref, visible] = useInView()
  const [form, setForm] = useState({ name: '', email: '', subject: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!sent) return undefined
    const timer = setTimeout(() => setSent(false), 4000)
    return () => clearTimeout(timer)
  }, [sent])

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await submitContact(form)
      setSent(true)
      setForm({ name: '', email: '', subject: '', phone: '', message: '' })
    } catch {
      const body = [`Name: ${form.name}`, `Email: ${form.email}`, '', form.message].join('\n')
      window.location.href = `${profile.emailMailto}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`
      setSent(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="section">
      <div className={`container reveal ${visible ? 'is-visible' : ''}`} ref={ref}>
        <div className="split-2">
          <article className="resume-neo glass">
            <p className="eyebrow">Resume</p>
            <h2 className="section-title" style={{ fontSize: '1.45rem' }}>Resume Preview</h2>
            <div className="resume-neo__preview">
              <strong>{profile.name}</strong>
              <p>{profile.role}</p>
              <p style={{ marginTop: '0.75rem' }}>{profile.tagline}</p>
              {profile.resumeFileName ? (
                <p style={{ marginTop: '0.75rem', opacity: 0.7 }}>File: {profile.resumeFileName}</p>
              ) : null}
            </div>
            <div className="resume-neo__actions">
              {profile.resumeUrl ? (
                <a
                  className="btn btn-primary"
                  href={profile.resumeUrl}
                  download={profile.resumeFileName || 'resume.pdf'}
                >
                  Download PDF
                </a>
              ) : (
                <a className="btn btn-primary" href={`mailto:${profile.email}?subject=Resume%20request`}>Request Resume</a>
              )}
              <button type="button" className="btn btn-ghost" onClick={() => window.print()}>Print Resume</button>
            </div>
          </article>

          <article className="contact-neo glass">
            <p className="eyebrow">{contactCopy.eyebrow || 'Contact'}</p>
            <h2 className="section-title" style={{ fontSize: '1.45rem' }}>Get In Touch</h2>
            <p className="section-subtitle" style={{ marginBottom: '1.1rem' }}>{contactCopy.subtitle}</p>

            {sent ? (
              <div className="contact-success" role="status">
                <strong>{contactCopy.successTitle}</strong>
                <p>{contactCopy.successBody}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="contact-neo__row">
                  <label>
                    <span>Name</span>
                    <input name="name" value={form.name} onChange={handleChange} required autoComplete="name" />
                  </label>
                  <label>
                    <span>Email</span>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required autoComplete="email" />
                  </label>
                </div>
                <label>
                  <span>Subject</span>
                  <input name="subject" value={form.subject} onChange={handleChange} required />
                </label>
                <label>
                  <span>Message</span>
                  <textarea name="message" rows={5} value={form.message} onChange={handleChange} required />
                </label>
                <button className="btn btn-primary" type="submit" disabled={submitting} style={{ width: '100%' }}>
                  <IconSend />
                  {submitting ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </article>
        </div>
      </div>
    </section>
  )
}
