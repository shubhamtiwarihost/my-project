import { navLinks, profile } from '../data/content'
import { IconGithub, IconLinkedIn } from './Icons'

export default function Footer() {
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
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <IconLinkedIn size={16} />
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <IconGithub size={16} />
            </a>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>© {year} {profile.shortName}. All rights reserved.</p>
          <p>Senior Full-stack PHP Developer & Technical Lead</p>
        </div>
      </div>
    </footer>
  )
}
