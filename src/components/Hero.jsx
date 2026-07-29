import { useEffect, useRef } from 'react'
import { profile } from '../data/content'
import { IconLinkedIn, IconMail, IconMonitor } from './Icons'

const heroImage = `${import.meta.env.BASE_URL}hero-bg.jpg`

export default function Hero() {
  const ref = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      ref.current?.classList.add('is-ready')
    }, 60)
    return () => clearTimeout(timer)
  }, [])

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
          <a href="#contact" className="btn btn-primary">
            <IconMail size={16} />
            Get In Touch
          </a>
          <a href="#projects" className="btn btn-ghost">
            <IconMonitor size={16} />
            View Projects
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            <IconLinkedIn size={16} />
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  )
}
