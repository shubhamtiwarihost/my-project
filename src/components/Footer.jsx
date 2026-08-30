import { useMemo } from 'react'
import { useContent } from '../context/ContentProvider'
import { IconGithub, IconLinkedIn, IconMail } from './Icons'

export default function Footer() {
  const { navLinks, profile, footer, alsoUsed, skillGroups } = useContent()
  const year = new Date().getFullYear()
  const tech = useMemo(() => {
    const fromGroups = (skillGroups || []).flatMap((g) => g.skills || [])
    return [...new Set([...fromGroups, ...(alsoUsed || [])])]
  }, [skillGroups, alsoUsed])

  return (
    <footer className="footer-neo">
      <div className="container">
        <div className="footer-neo__grid">
          <div>
            <div className="footer-neo__brand">{profile.shortName || profile.name}</div>
            <p className="footer-neo__tag">{footer.tagline || 'Building Scalable Solutions. Delivering Excellence.'}</p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <div className="footer-neo__links">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href}>{link.label}</a>
              ))}
            </div>
          </div>

          <div>
            <h4>Technologies</h4>
            <div className="footer-neo__tech">
              {tech.map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </div>

          <div>
            <h4>Connect With Me</h4>
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
          </div>
        </div>

        <div className="footer-neo__bottom">
          <p>© {year} {footer.copyrightName || profile.shortName}. All rights reserved.</p>
          <p>{profile.role}</p>
        </div>
      </div>
    </footer>
  )
}
