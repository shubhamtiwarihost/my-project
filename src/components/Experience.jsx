import { useCallback, useEffect, useRef, useState } from 'react'
import { useContent } from '../context/ContentProvider'
import { useInView } from '../hooks/useInView'
import { useIsCompactDevice } from '../hooks/useIsCompactDevice'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useStageTilt } from '../hooks/useStageTilt'
import { IconCheck } from './Icons'

function companyInitials(name = '?') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export default function Experience() {
  const { experiences, education, experienceCopy } = useContent()
  const [ref, visible] = useInView({ threshold: 0.08 })
  const compact = useIsCompactDevice()
  const reducedMotion = usePrefersReducedMotion()
  const spatial = !compact && !reducedMotion
  const [panelRef, panelStyle, onPanelMove, onPanelLeave] = useStageTilt(spatial)
  const [active, setActive] = useState(0)
  const [hovering, setHovering] = useState(false)
  const pauseRef = useRef(false)

  const list = experiences?.length ? experiences : []
  const current = list[Math.min(active, Math.max(list.length - 1, 0))]

  const go = useCallback((dir) => {
    if (!list.length) return
    setActive((prev) => (prev + dir + list.length) % list.length)
  }, [list.length])

  useEffect(() => {
    if (reducedMotion || list.length < 2 || !hovering || pauseRef.current) return undefined
    const id = window.setInterval(() => go(1), 3200)
    return () => window.clearInterval(id)
  }, [hovering, reducedMotion, list.length, go])

  if (!current) return null

  return (
    <section id="experience" className="section experience-3d-section">
      <div className={`container reveal ${visible ? 'is-visible' : ''}`} ref={ref}>
        <header className="section-head">
          <p className="eyebrow">Experience</p>
          <h2 className="section-title">{experienceCopy.title}</h2>
          <p className="section-subtitle">{experienceCopy.subtitle}</p>
        </header>

        <div
          className={`experience-board${spatial ? '' : ' experience-board--flat'}`}
          onPointerEnter={() => setHovering(true)}
          onPointerLeave={() => setHovering(false)}
        >
          <div className="experience-board__glow" aria-hidden="true" />

          <nav className="experience-board__rail" aria-label="Companies">
            {list.map((exp, i) => {
              const isActive = i === active
              return (
                <button
                  key={`${exp.company}-${exp.period}`}
                  type="button"
                  className={`experience-board__step${isActive ? ' is-active' : ''}`}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => {
                    pauseRef.current = true
                    setActive(i)
                  }}
                  onMouseLeave={() => {
                    pauseRef.current = false
                  }}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span className="experience-board__mark" aria-hidden="true">
                    {companyInitials(exp.company)}
                  </span>
                  <span className="experience-board__step-copy">
                    <strong>{exp.company}</strong>
                    <em>{exp.period}</em>
                  </span>
                </button>
              )
            })}
          </nav>

          <article
            className="experience-board__panel"
            ref={panelRef}
            onPointerMove={onPanelMove}
            onPointerLeave={onPanelLeave}
            style={panelStyle}
          >
            <div className="experience-board__face">
              <div className="experience-board__orb" aria-hidden="true" />
              <div className="experience-board__top">
                <div>
                  <p className="experience-board__company">{current.company}</p>
                  <h3>{current.role}</h3>
                  <p className="experience-board__meta">
                    {current.location} · {current.type}
                  </p>
                </div>
                <div className="experience-board__dates">
                  <span>{current.period}</span>
                  <span className="experience-board__duration">{current.duration}</span>
                </div>
              </div>

              <ul className="experience-board__list">
                {(current.highlights || []).slice(0, 5).map((item) => (
                  <li key={item}>
                    <IconCheck />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="experience-board__tags">
                {(current.tech || []).map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            </div>
          </article>
        </div>

        {education?.length ? (
          <div className="experience-board__edu">
            <h3>Education</h3>
            <div className="experience-board__edu-grid">
              {education.map((item) => (
                <article key={item.title} className="experience-board__edu-card">
                  <h4>{item.title}</h4>
                  <p>{item.issuer}</p>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
