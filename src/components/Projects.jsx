import { useCallback, useMemo, useRef, useState } from 'react'
import { useContent } from '../context/ContentProvider'
import { useInView } from '../hooks/useInView'
import { useIsCompactDevice } from '../hooks/useIsCompactDevice'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

function initials(title = '?') {
  return title.replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase() || '?'
}

function panelTransform(offset, enabled) {
  if (!enabled) return undefined
  const abs = Math.abs(offset)
  return {
    transform: `translateX(${offset * 210}px) translateZ(${offset * -140}px) rotateY(${offset * -18}deg) scale(${1 - abs * 0.08})`,
    opacity: Math.max(0.35, 1 - abs * 0.22),
    zIndex: 20 - abs,
    filter: abs ? `blur(${abs * 0.55}px)` : 'none',
  }
}

export default function Projects() {
  const { projects, projectsCopy } = useContent()
  const [ref, visible] = useInView({ threshold: 0.08 })
  const stageRef = useRef(null)
  const compact = useIsCompactDevice()
  const reducedMotion = usePrefersReducedMotion()
  const [active, setActive] = useState(0)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const safeProjects = projects?.length ? projects : []
  const spatial = !compact && !reducedMotion
  const activeIndex = safeProjects.length
    ? Math.min(active, safeProjects.length - 1)
    : 0

  const onPointerMove = useCallback((e) => {
    if (!spatial || !stageRef.current) return
    const rect = stageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1
    setTilt({ x, y })
  }, [spatial])

  const onPointerLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
  }, [])

  const stageStyle = useMemo(() => {
    if (!spatial) return undefined
    return {
      transform: `rotateX(${8 - tilt.y * 6}deg) rotateY(${tilt.x * 10}deg)`,
    }
  }, [tilt, spatial])

  const go = (dir) => {
    if (!safeProjects.length) return
    setActive((prev) => {
      const current = Math.min(prev, safeProjects.length - 1)
      return (current + dir + safeProjects.length) % safeProjects.length
    })
  }

  return (
    <section id="projects" className="section projects-3d-section">
      <div className={`container reveal ${visible ? 'is-visible' : ''}`} ref={ref}>
        <header className="section-head projects-3d__head">
          <p className="eyebrow">Portfolio</p>
          <h2 className="section-title">{projectsCopy?.title || 'Featured Projects'}</h2>
          <p className="section-subtitle">{projectsCopy?.subtitle}</p>
        </header>

        <div
          className={`projects-3d${compact ? ' projects-3d--compact' : ''}${reducedMotion ? ' projects-3d--static' : ''}`}
          ref={stageRef}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
        >
          <div className="projects-3d__glow" aria-hidden="true" />
          <div className="projects-3d__floor" aria-hidden="true" />

          <div className="projects-3d__stage" style={stageStyle}>
            {safeProjects.map((project, index) => {
              const isActive = index === activeIndex
              const offset = index - activeIndex
              return (
                <article
                  key={project.title}
                  className={`project-3d${isActive ? ' is-active' : ''}`}
                  style={panelTransform(offset, spatial)}
                  onMouseEnter={() => spatial && setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isActive}
                  aria-label={`${project.title} project`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setActive(index)
                    }
                    if (e.key === 'ArrowRight') go(1)
                    if (e.key === 'ArrowLeft') go(-1)
                  }}
                >
                  <div className="project-3d__face">
                    <div className="project-3d__media" aria-hidden="true">
                      <span className="project-3d__orb" />
                      <span className="project-3d__mono">{initials(project.title)}</span>
                      <span className="project-3d__scan" />
                    </div>
                    <div className="project-3d__body">
                      <p className="project-3d__cat">{project.category || project.badge}</p>
                      <h3>{project.title}</h3>
                      <p>{project.desc}</p>
                      {isActive && project.features?.length ? (
                        <ul className="project-3d__features">
                          {project.features.slice(0, 3).map((f) => (
                            <li key={f}>{f}</li>
                          ))}
                        </ul>
                      ) : null}
                      <div className="project-3d__tags">
                        {(project.tech || []).map((t) => (
                          <span key={t} className="tag">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="projects-3d__controls" aria-label="Project navigation">
            <button type="button" className="projects-3d__nav" onClick={() => go(-1)} aria-label="Previous project">
              ‹
            </button>
            <div className="projects-3d__dots">
              {safeProjects.map((project, index) => (
                <button
                  key={project.title}
                  type="button"
                  className={`projects-3d__dot${index === activeIndex ? ' is-active' : ''}`}
                  aria-label={`Show ${project.title}`}
                  aria-current={index === activeIndex ? 'true' : undefined}
                  onClick={() => setActive(index)}
                />
              ))}
            </div>
            <button type="button" className="projects-3d__nav" onClick={() => go(1)} aria-label="Next project">
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
