import { useContent } from '../context/ContentProvider'
import { IconGithub, IconLinkedIn, IconMail } from './Icons'

export default function Footer() {
  const { navLinks, profile, footer } = useContent()
  const year = new Date().getFullYear()
  const stack = (profile.stackLine || 'PHP · Laravel · Drupal · AWS')
    .split(/[•·|,]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6)

  return (
    <footer className="footer-neo">
      <div className="container">
        <div className="footer-neo__top">
          <div className="footer-neo__brand-block">
            <div className="footer-neo__brand">{profile.shortName || profile.name}</div>
            <p className="footer-neo__tag">
              {footer.tagline || 'Senior Software Engineer · Backend Systems & Distributed Architecture'}
            </p>
            <div className="footer-neo__stack">
              {stack.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <nav className="footer-neo__nav" aria-label="Footer">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}>{link.label}</a>
            ))}
          </nav>

          <div className="footer-neo__connect">
            <p className="footer-neo__connect-label">Connect</p>
            <div className="footer-neo__social">
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
            {profile.email && (
              <a className="footer-neo__email" href={profile.emailMailto}>{profile.email}</a>
            )}
          </div>
        </div>

        <div className="footer-neo__bottom">
          <p>© {year} {footer.copyrightName || profile.shortName}. All rights reserved.</p>
          <p>{profile.location}</p>
        </div>
      </div>
    </footer>
  )
}
