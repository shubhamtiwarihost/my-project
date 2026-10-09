import { useContent } from '../context/ContentProvider'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { IconDownload, IconGithub, IconLinkedIn, IconMail } from './Icons'
import { trackCvDownload } from '../lib/analytics'
import { cvDownloadUrl } from '../lib/api'
import { lazy, Suspense } from 'react'
import { useIsCompactDevice } from '../hooks/useIsCompactDevice'

const HeroWorkstation = lazy(() => import('./three/Scenes').then((m) => ({ default: m.HeroWorkstation })))

function splitList(line = '') {
  return line.split(/[•·|,]/).map((s) => s.trim()).filter(Boolean)
}

export default function Hero() {
  const { profile, alsoUsed } = useContent()
  const reducedMotion = usePrefersReducedMotion()
  const compact = useIsCompactDevice()

  const [firstName, ...rest] = (profile.name || '').split(' ')
  const lastName = rest.join(' ')
  const stack = splitList(profile.stackLine)
  const marquee = [...stack, ...(alsoUsed || [])]
  const chips = (profile.stats || []).slice(0, 3)

  return (
    <section id="home" className="p-hero" aria-label="Introduction">
      {/* The WebGL world is page-wide (see App); this is the static backdrop without it */}
      {reducedMotion && <div className="p-hero__fallback" aria-hidden="true" />}

      <div className="container p-hero__grid">
        <div className="p-hero__copy">
          {profile.availability && (
            <p className="p-hero__badge">
              <span className="p-hero__badge-dot" aria-hidden="true" />
              {profile.availability}
            </p>
          )}
          <p className="p-hero__hello">Hello, I&apos;m</p>
          <h1 className="p-hero__name">
            <span className="p-hero__name-solid">{firstName}</span>{' '}
            {lastName && <span className="p-hero__name-outline">{lastName}</span>}
          </h1>
          <p className="p-hero__role">{profile.role}</p>
          {profile.tagline && <p className="p-hero__tagline">{profile.tagline}</p>}

          <div className="p-hero__actions">
            {profile.resumeUrl ? (
              <a
                className="btn btn-primary btn-lg"
                href={cvDownloadUrl('hero')}
                download={profile.resumeFileName || 'resume.pdf'}
                onClick={() => trackCvDownload(profile.resumeFileName || 'Shubham_Tiwari_CV.pdf')}
              >
                <IconDownload />
                Download CV
              </a>
            ) : (
              <a className="btn btn-primary btn-lg" href="#contact">Request CV</a>
            )}
            <a className="btn btn-ghost btn-lg" href="#contact">Hire Me</a>
            <a className="btn btn-ghost btn-lg" href="#projects">View Projects</a>
          </div>

          <div className="p-hero__follow">
            <span>Follow</span>
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

        {/* Interactive 3D workstation with stat chips floating around it */}
        <div className="p-hero__orbit" aria-hidden="true">
          {!reducedMotion && (
            <Suspense fallback={null}>
              <HeroWorkstation lite={compact} />
            </Suspense>
          )}
          {chips.map((chip, i) => (
            <div key={chip.label} className={`p-holo p-holo--${i + 1}`}>
              <strong>{chip.num}</strong>
              <span>{chip.label}</span>
            </div>
          ))}
        </div>
      </div>

      <a className="p-hero__scroll" href="#about" aria-label="Scroll to About">
        <span className="p-hero__scroll-wheel" aria-hidden="true" />
        Scroll
      </a>

      <div className="p-marquee" aria-hidden="true">
        <div className="p-marquee__track">
          {[...marquee, ...marquee].map((item, i) => (
            <span key={`${item}-${i}`}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
