import { useEffect, useState } from 'react'
import { useContent } from '../context/ContentProvider'
import {
  IconGithub,
  IconLinkedIn,
  IconMail,
  IconMenu,
  IconMonitor,
  IconPhone,
  IconSend,
} from './Icons'

function NavIcon({ href }) {
  const id = href.replace('#', '')
  const map = {
    home: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-10.5z"/></svg>
    ),
    about: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/></svg>
    ),
    experience: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
    ),
    skills: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m8 6 4-4 4 4"/><path d="m8 18 4 4 4-4"/><path d="M12 2v20"/></svg>
    ),
    projects: <IconMonitor size={18} />,
    contact: <IconMail size={18} />,
  }
  return map[id] || <IconSend size={18} />
}

export default function Navbar() {
  const { navLinks, profile, navbar } = useContent()
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12)
      const sections = navLinks.map((l) => l.href.slice(1))
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const el = document.getElementById(sections[i])
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(sections[i])
          break
        }
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [navLinks])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <aside className="side-rail" aria-label="Side navigation">
        <a href="#home" className="side-rail__brand" aria-label="Home">{profile.initials}</a>
        <nav className="side-rail__nav">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={active === link.href.slice(1) ? 'is-active' : undefined}
              title={link.label}
              aria-label={link.label}
            >
              <NavIcon href={link.href} />
            </a>
          ))}
        </nav>
        <div className="side-rail__social">
          {profile.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <IconLinkedIn size={16} />
            </a>
          )}
          {profile.github && (
            <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <IconGithub size={16} />
            </a>
          )}
          <a href={profile.emailMailto} aria-label="Email"><IconMail size={16} /></a>
        </div>
      </aside>

      <header className={`top-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="top-nav__inner">
          <nav className="top-nav__links" aria-label="Primary">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className={active === link.href.slice(1) ? 'is-active' : undefined}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="top-nav__actions">
            <a href="#contact" className="btn btn-primary">{navbar.ctaLabel || 'Contact Me'}</a>
            <button
              type="button"
              className="top-nav__toggle"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <IconMenu open={menuOpen} />
            </button>
          </div>
        </div>

        <div className={`top-nav__mobile ${menuOpen ? 'is-open' : ''}`}>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
          <a href="#contact" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }} onClick={() => setMenuOpen(false)}>
            {navbar.ctaLabel || 'Contact Me'}
          </a>
        </div>
      </header>
    </>
  )
}
