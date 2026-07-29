import { useEffect, useState } from 'react'
import { useContent } from '../context/ContentProvider'
import { IconMenu } from './Icons'

export default function Navbar() {
  const { navLinks, profile, navbar } = useContent()
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16)
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
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header className={`site-nav ${scrolled ? 'is-scrolled' : ''} ${menuOpen ? 'is-open' : ''}`}>
      <div className="container site-nav__inner">
        <a href="#home" className="brand" onClick={() => setMenuOpen(false)}>
          <span className="brand__mark" aria-hidden="true">{profile.initials}</span>
          <span className="brand__name">{profile.name}</span>
        </a>

        <nav className="site-nav__links" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={active === link.href.slice(1) ? 'is-active' : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="site-nav__actions">
          <a href="#contact" className="btn btn-primary site-nav__cta">
            {navbar.ctaLabel}
          </a>
          <button
            type="button"
            className="site-nav__toggle"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <IconMenu open={menuOpen} />
          </button>
        </div>
      </div>

      <div id="mobile-nav" className={`site-nav__mobile ${menuOpen ? 'is-open' : ''}`}>
        <div className="container">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={active === link.href.slice(1) ? 'is-active' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a href="#contact" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
            {navbar.ctaLabel}
          </a>
        </div>
      </div>
    </header>
  )
}
