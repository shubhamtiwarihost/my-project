import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useContent } from '../context/ContentProvider'
import { useInView } from '../hooks/useInView'
import { useIsCompactDevice } from '../hooks/useIsCompactDevice'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { submitContact } from '../lib/api'
import { IconSend } from './Icons'

export default function Contact() {
  const { contactCopy, profile } = useContent()
  const [ref, visible] = useInView()
  const stageRef = useRef(null)
  const compact = useIsCompactDevice()
  const reducedMotion = usePrefersReducedMotion()
  const spatial = !compact && !reducedMotion

  const [form, setForm] = useState({ name: '', email: '', subject: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [focusPanel, setFocusPanel] = useState('contact')

  useEffect(() => {
    if (!sent) return undefined
    const timer = setTimeout(() => setSent(false), 4000)
    return () => clearTimeout(timer)
  }, [sent])

  const onPointerMove = useCallback((e) => {
    if (!spatial || !stageRef.current) return
    const rect = stageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1
    setTilt({ x, y })
  }, [spatial])

  const stageStyle = useMemo(() => {
    if (!spatial) return undefined
    return {
      transform: `rotateX(${6 - tilt.y * 5}deg) rotateY(${tilt.x * 8}deg)`,
    }
  }, [spatial, tilt])

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
    <section id="contact" className="section contact-3d-section">
      <div className={`container reveal ${visible ? 'is-visible' : ''}`} ref={ref}>
        <header className="section-head">
          <p className="eyebrow">Connect</p>
          <h2 className="section-title">Let&apos;s build something solid</h2>
          <p className="section-subtitle">
            {contactCopy.subtitle || 'Resume, roles, and collaborations — reach out anytime.'}
          </p>
        </header>

        <div
          className={`contact-3d${compact ? ' contact-3d--compact' : ''}${reducedMotion ? ' contact-3d--static' : ''}`}
          ref={stageRef}
          onPointerMove={onPointerMove}
          onPointerLeave={() => setTilt({ x: 0, y: 0 })}
        >
          <div className="contact-3d__glow" aria-hidden="true" />
          <div className="contact-3d__floor" aria-hidden="true" />

          <div className="contact-3d__stage" style={stageStyle}>
            <article
              className={`contact-3d__panel contact-3d__panel--resume${focusPanel === 'resume' ? ' is-active' : ''}`}
              onMouseEnter={() => setFocusPanel('resume')}
              onFocusCapture={() => setFocusPanel('resume')}
            >
              <div className="contact-3d__face">
                <div className="contact-3d__ribbon" aria-hidden="true">CV</div>
                <p className="eyebrow">Resume</p>
                <h3 className="contact-3d__title">Resume Preview</h3>
                <div className="contact-3d__preview">
                  <div className="contact-3d__preview-glow" aria-hidden="true" />
                  <strong>{profile.name}</strong>
                  <p>{profile.role}</p>
                  <p className="contact-3d__tagline">{profile.tagline}</p>
                  {profile.resumeFileName ? (
                    <p className="contact-3d__file">File: {profile.resumeFileName}</p>
                  ) : null}
                </div>
                <div className="contact-3d__actions">
                  {profile.resumeUrl ? (
                    <a
                      className="btn btn-primary"
                      href={profile.resumeUrl}
                      download={profile.resumeFileName || 'resume.pdf'}
                    >
                      Download CV
                    </a>
                  ) : (
                    <a className="btn btn-primary" href={`mailto:${profile.email}?subject=Resume%20request`}>
                      Request Resume
                    </a>
                  )}
                  <button type="button" className="btn btn-ghost" onClick={() => window.print()}>
                    Print Resume
                  </button>
                </div>
              </div>
            </article>

            <article
              className={`contact-3d__panel contact-3d__panel--form${focusPanel === 'contact' ? ' is-active' : ''}`}
              onMouseEnter={() => setFocusPanel('contact')}
              onFocusCapture={() => setFocusPanel('contact')}
            >
              <div className="contact-3d__face">
                <p className="eyebrow">{contactCopy.eyebrow || 'Contact'}</p>
                <h3 className="contact-3d__title">Get In Touch</h3>
                <p className="contact-3d__lead">{contactCopy.subtitle}</p>

                {sent ? (
                  <div className="contact-success" role="status">
                    <strong>{contactCopy.successTitle}</strong>
                    <p>{contactCopy.successBody}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="contact-3d__form">
                    <div className="contact-3d__row">
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
                    <button className="btn btn-primary" type="submit" disabled={submitting}>
                      <IconSend />
                      {submitting ? 'Sending…' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
