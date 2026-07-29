import { useEffect, useRef } from 'react'
import { useContent } from '../context/ContentProvider'
import { IconLinkedIn, IconMail, IconMonitor } from './Icons'

const defaultHeroImage = `${import.meta.env.BASE_URL}hero-bg.jpg`

const iconMap = {
  mail: IconMail,
  linkedin: IconLinkedIn,
  monitor: IconMonitor,
}

export default function Hero() {
  const { profile, hero } = useContent()
  const ref = useRef(null)
  const heroImage = hero.backgroundUrl || defaultHeroImage

  useEffect(() => {
    const timer = setTimeout(() => {
      ref.current?.classList.add('is-ready')
    }, 60)
    return () => clearTimeout(timer)
  }, [])

  const ctas =
    hero.ctas?.length > 0
      ? hero.ctas
      : [
          { label: 'Get In Touch', href: '#contact', iconKey: 'mail', style: 'primary' },
          { label: 'View Projects', href: '#projects', iconKey: 'monitor', style: 'ghost' },
          { label: 'LinkedIn', href: profile.linkedin, iconKey: 'linkedin', style: 'ghost' },
        ]

  return (
    <section id="home" className="hero" aria-label="Introduction">
      <div className="hero-media" aria-hidden="true">
        <img
          src={heroImage}
          alt=""
          width={1920}
          height={1282}
          fetchPriority="high"
          decoding="async"
        />
        <div className="hero-media__veil" />
      </div>

      <div className="container hero__content" ref={ref}>
        <p className="hero__brand">{profile.name}</p>
        <h1 className="hero__title">{profile.role}</h1>
        <p className="hero__lede">{profile.tagline}</p>

        <div className="hero__actions">
          {ctas.map((cta) => {
            const Icon = iconMap[(cta.iconKey || '').toLowerCase()] || IconMail
            const className = cta.style === 'primary' ? 'btn btn-primary' : 'btn btn-ghost'
            const external = (cta.href || '').startsWith('http')
            return (
              <a
                key={`${cta.label}-${cta.href}`}
                href={cta.href || '#'}
                className={className}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
              >
                <Icon size={16} />
                {cta.label}
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
