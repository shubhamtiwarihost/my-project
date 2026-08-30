import { lazy, Suspense, useMemo } from 'react'
import { useContent } from '../context/ContentProvider'
import { useIsCompactDevice } from '../hooks/useIsCompactDevice'
import { usePointerParallax } from '../hooks/usePointerParallax'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { IconGithub, IconLinkedIn, IconMail } from './Icons'

const HeroScene = lazy(() => import('./HeroScene'))

const FLOAT_TAGS = ['PHP', 'Drupal', 'Laravel', 'AWS', 'Backend']

export default function Hero() {
  const { profile, hero, settings } = useContent()
  const photo = settings?.logo || hero?.backgroundUrl || null
  const reducedMotion = usePrefersReducedMotion()
  const compact = useIsCompactDevice()
  const enableScene = !reducedMotion && !compact
  const enableParallax = enableScene
  const parallax = usePointerParallax(enableParallax)

  const portraitStyle = useMemo(() => {
    if (!enableParallax) return undefined
    return {
      transform: `rotateY(${parallax.x * 12}deg) rotateX(${-parallax.y * 10}deg) translateZ(24px)`,
    }
  }, [parallax.x, parallax.y, enableParallax])

  const copyStyle = useMemo(() => {
    if (!enableParallax) return undefined
    return {
      transform: `translate3d(${parallax.x * -12}px, ${parallax.y * -8}px, 0)`,
    }
  }, [parallax.x, parallax.y, enableParallax])

  return (
    <section id="home" className={`hero-3d${compact ? ' hero-3d--compact' : ''}`} aria-label="Introduction">
      {enableScene ? (
        <Suspense fallback={<div className="hero-scene hero-scene--fallback" />}>
          <HeroScene animate />
        </Suspense>
      ) : (
        <div className="hero-scene hero-scene--fallback" aria-hidden="true" />
      )}

      <div className="hero-3d__content container">
        <div className="hero-3d__grid">
          <div className="hero-3d__copy" style={copyStyle}>
            <p className="hero-3d__hello">Hello, I&apos;m</p>
            <h1 className="hero-3d__name">{profile.name}</h1>
            <p className="hero-3d__role">{profile.role}</p>
            <p className="hero-3d__stack">{profile.stackLine}</p>

            <div className="hero-3d__actions">
              {profile.resumeUrl ? (
                <a
                  className="btn btn-primary"
                  href={profile.resumeUrl}
                  download={profile.resumeFileName || 'resume.pdf'}
                >
                  Download Resume
                </a>
              ) : (
                <a className="btn btn-primary" href="#contact">Download Resume</a>
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

          <div className="hero-3d__stage" aria-hidden="true">
            <div className="hero-3d__portrait-wrap" style={portraitStyle}>
              <div className="hero-3d__portrait">
                <div className="hero-3d__portrait-inner">
                  {photo ? (
                    <img src={photo} alt="" />
                  ) : (
                    <span className="hero-3d__avatar-fallback">{profile.initials}</span>
                  )}
                </div>
              </div>
              {FLOAT_TAGS.map((tag, i) => (
                <span key={tag} className={`hero-3d__float hero-3d__float--${i + 1}`}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
