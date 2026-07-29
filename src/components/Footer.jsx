import { useContent } from '../context/ContentProvider'
import { IconGithub, IconLinkedIn } from './Icons'

export default function Footer() {
  const { navLinks, profile, footer } = useContent()
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <div className="brand brand--footer">
            <span className="brand__mark" aria-hidden="true">{profile.initials}</span>
            <span>
              <span className="brand__name">{profile.name}</span>
              <span className="brand__role">{profile.role}</span>
            </span>
          </div>

          <nav className="site-footer__nav" aria-label="Footer">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="site-footer__social">
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
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>
            © {year} {footer.copyrightName}. All rights reserved.
          </p>
          <p>{footer.tagline}</p>
        </div>
      </div>
    </footer>
  )
}
