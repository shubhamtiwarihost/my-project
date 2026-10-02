import { useMemo } from 'react'
import { useContent } from '../context/ContentProvider'
import { useIsCompactDevice } from '../hooks/useIsCompactDevice'
import { usePointerParallax } from '../hooks/usePointerParallax'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { IconDownload, IconGithub, IconLinkedIn, IconMail } from './Icons'
import { trackCvDownload } from '../lib/analytics'
import { cvDownloadUrl } from '../lib/api'

export default function Hero() {
  const { profile } = useContent()
  const reducedMotion = usePrefersReducedMotion()
  const compact = useIsCompactDevice()
  const enableScene = !reducedMotion
  const enableParallax = enableScene && !compact
  const parallax = usePointerParallax(enableParallax)

  const copyStyle = useMemo(() => {
    if (!enableParallax) return undefined
    return {
      transform: `translate3d(${parallax.x * -12}px, ${parallax.y * -8}px, 0)`,
    }
  }, [parallax.x, parallax.y, enableParallax])

  return (
    <section id="home" className={`hero-3d${compact ? ' hero-3d--compact' : ''}`} aria-label="Introduction">
      {/* The WebGL world is page-wide (see App); this is the static backdrop without it */}
      {!enableScene && <div className="hero-scene hero-scene--fallback" aria-hidden="true" />}

      <div className="hero-3d__content container">
        <div className="hero-3d__copy hero-3d__copy--solo" style={copyStyle}>
          {profile.availability && (
            <p className="hero-3d__badge">
              <span className="hero-3d__badge-dot" aria-hidden="true" />
              {profile.availability}
            </p>
          )}
          <p className="hero-3d__hello">Hello, I&apos;m</p>
          <h1 className="hero-3d__name">{profile.name}</h1>
          <p className="hero-3d__role">{profile.role}</p>
          <p className="hero-3d__stack">{profile.stackLine}</p>

          <div className="hero-3d__actions">
            {profile.resumeUrl ? (
              <a
                className="btn btn-primary"
                href={cvDownloadUrl('hero')}
                download={profile.resumeFileName || 'resume.pdf'}
                onClick={() => trackCvDownload(profile.resumeFileName || 'Shubham_Tiwari_CV.pdf')}
              >
                <IconDownload />
                Download CV
              </a>
            ) : (
              <a
                className="btn btn-primary"
                href="#contact"
                onClick={() => trackCvDownload('Shubham_Tiwari_CV.pdf')}
              >
                Download CV
              </a>
            )}
            <a className="btn btn-ghost" href="#contact">Hire Me</a>
            <a className="btn btn-ghost" href="#projects">View Projects</a>
          </div>

          <div className="hero-3d__follow">
            <span>Follow Me</span>
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <IconLinkedIn size={15} />
              </a>
            )}
            {profile.github && (
              <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <IconGithub size={15} />
              </a>
            )}
            <a href={profile.emailMailto} aria-label="Email"><IconMail size={15} /></a>
          </div>
        </div>
      </div>
    </section>
  )
}
