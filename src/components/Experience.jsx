import { useState } from 'react'
import { useContent } from '../context/ContentProvider'
import { useInView } from '../hooks/useInView'
import { useIsCompactDevice } from '../hooks/useIsCompactDevice'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useStageTilt } from '../hooks/useStageTilt'
import { IconCheck } from './Icons'

export default function Experience() {
  const { experiences, education, experienceCopy } = useContent()
  const [ref, visible] = useInView({ threshold: 0.06 })
  const compact = useIsCompactDevice()
  const reducedMotion = usePrefersReducedMotion()
  const spatial = !compact && !reducedMotion
  const [stageRef, stageStyle, onStageMove, onStageLeave] = useStageTilt(spatial)
  const [active, setActive] = useState(0)

  return (
    <section id="experience" className="section experience-3d-section">
      <div className={`container reveal ${visible ? 'is-visible' : ''}`} ref={ref}>
        <header className="section-head">
          <p className="eyebrow">Experience</p>
          <h2 className="section-title">{experienceCopy.title}</h2>
          <p className="section-subtitle">{experienceCopy.subtitle}</p>
        </header>

        <div
          className={`experience-3d${spatial ? '' : ' experience-3d--flat'}`}
          ref={stageRef}
          onPointerMove={onStageMove}
          onPointerLeave={onStageLeave}
        >
          <div className="experience-3d__glow" aria-hidden="true" />
          <div className="experience-3d__rail" aria-hidden="true" />

          <div className="experience-3d__stage" style={stageStyle}>
            {experiences.map((exp, i) => {
              const isActive = active === i
              const offset = i - active
              return (
                <article
                  key={`${exp.company}-${exp.period}`}
                  className={`exp-3d${isActive ? ' is-active' : ''}`}
                  style={
                    spatial
                      ? {
                          transform: `translateY(${offset * 28}px) translateZ(${-Math.abs(offset) * 70}px) rotateX(${offset * -4}deg) scale(${1 - Math.abs(offset) * 0.04})`,
                          opacity: Math.max(0.4, 1 - Math.abs(offset) * 0.18),
                          zIndex: 30 - Math.abs(offset),
                        }
                      : undefined
                  }
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  tabIndex={0}
                >
                  <div className="exp-3d__face">
                    <div className="exp-3d__top">
                      <div>
                        <p className="exp-3d__company">{exp.company}</p>
                        <h3>{exp.role}</h3>
                        <p className="exp-3d__meta">
                          {exp.location} · {exp.type}
                        </p>
                      </div>
                      <div className="exp-3d__dates">
                        <span>{exp.period}</span>
                        <span className="exp-3d__duration">{exp.duration}</span>
                      </div>
                    </div>

                    {isActive || !spatial ? (
                      <>
                        <ul className="exp-3d__list">
                          {(exp.highlights || []).slice(0, spatial ? 4 : 6).map((item) => (
                            <li key={item}>
                              <IconCheck />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="exp-3d__tags">
                          {(exp.tech || []).map((t) => (
                            <span key={t} className="tag">{t}</span>
                          ))}
                        </div>
                      </>
                    ) : null}
                  </div>
                </article>
              )
            })}
          </div>

          <div className="experience-3d__dots" aria-label="Experience navigation">
            {experiences.map((exp, i) => (
              <button
                key={`${exp.company}-dot`}
                type="button"
                className={`experience-3d__dot${active === i ? ' is-active' : ''}`}
                aria-label={`Show ${exp.company}`}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
        </div>

        {education?.length ? (
          <div className="experience-3d__edu">
            <h3>Education</h3>
            <div className="experience-3d__edu-grid">
              {education.map((item) => (
                <article key={item.title} className="experience-3d__edu-card">
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
