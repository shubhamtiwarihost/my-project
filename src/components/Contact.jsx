import { useEffect, useState } from 'react'
import { useContent } from '../context/ContentProvider'
import { cvDownloadUrl, submitContact } from '../lib/api'
import { IconDownload, IconLinkedIn, IconMail, IconPhone, IconSend } from './Icons'
import Reveal from './ui/Reveal'
import SectionHead from './ui/SectionHead'
import Tilt from './ui/Tilt'

export default function Contact() {
  const { contactCopy, profile } = useContent()
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
    <section id="contact" className="section p-section">
      <div className="container">
        <SectionHead
          index="05"
          eyebrow="Connect"
          title="Let's build something solid"
          subtitle={contactCopy.subtitle || 'Resume, roles, and collaborations — reach out anytime.'}
        />

        <div className="p-contact">
          <Reveal>
            <Tilt as="article" className="p-card p-resume" max={8}>
              <p className="p-kicker z1">Resume</p>

              {/* A sheet of paper floating above the card */}
              <div className="p-sheet z3" aria-hidden="true">
                <strong>{profile.name}</strong>
                <em>{profile.role}</em>
                <i /><i /><i /><i /><i />
                <span className="p-sheet__stamp">CV</span>
              </div>

              <p className="p-resume__tagline">{profile.tagline}</p>

              <div className="p-resume__actions z2">
                {profile.resumeUrl ? (
                  <a
                    className="btn btn-primary btn-lg"
                    href={cvDownloadUrl('contact')}
                    download={profile.resumeFileName || 'resume.pdf'}
                  >
                    <IconDownload />
                    Download CV
                  </a>
                ) : (
                  <a className="btn btn-primary btn-lg" href={`mailto:${profile.email}?subject=Resume%20request`}>
                    Request Resume
                  </a>
                )}
              </div>

              <div className="p-links z1">
                <a href={profile.emailMailto}><IconMail size={15} />{profile.email}</a>
                {profile.phone && <a href={profile.phoneHref}><IconPhone size={15} />{profile.phone}</a>}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                    <IconLinkedIn size={15} />LinkedIn
                  </a>
                )}
              </div>
            </Tilt>
          </Reveal>

          <Reveal delay={120}>
            <article className="p-card p-form">
              <p className="p-kicker">{contactCopy.eyebrow || 'Contact'}</p>
              <h3>Get in touch</h3>
              {contactCopy.responseNote && <p className="p-form__note">{contactCopy.responseNote}</p>}

              {sent ? (
                <div className="p-form__success" role="status">
                  <strong>{contactCopy.successTitle}</strong>
                  <p>{contactCopy.successBody}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="p-form__row">
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
                  <button className="btn btn-primary btn-lg" type="submit" disabled={submitting}>
                    <IconSend />
                    {submitting ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
