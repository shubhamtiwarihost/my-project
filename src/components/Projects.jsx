import { useCallback, useState } from 'react'
import { useContent } from '../context/ContentProvider'
import { useSpatial } from '../hooks/useSpatial'
import { IconCheck, IconChevron } from './Icons'
import Reveal from './ui/Reveal'
import SectionHead from './ui/SectionHead'

function initials(title = '?') {
  return title.replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase() || '?'
}

/** Coverflow placement: the active card faces forward, neighbours angle away into depth. */
function coverflow(offset) {
  const abs = Math.abs(offset)
  return {
    transform: `translateX(${offset * 58}%) translateZ(${abs * -260}px) rotateY(${offset * -32}deg)`,
    opacity: abs > 1 ? 0 : 1 - abs * 0.45,
    zIndex: 10 - abs,
    pointerEvents: abs > 1 ? 'none' : undefined,
  }
}

/** Signed distance from the active card on a ring, so both sides are always filled. */
function ringOffset(i, active, count) {
  const half = Math.floor(count / 2)
  return ((i - active + count + half) % count) - half
}

export default function Projects() {
  const { projects, projectsCopy } = useContent()
  const spatial = useSpatial()
  const [active, setActive] = useState(0)

  const list = projects?.length ? projects : []
  const index = list.length ? Math.min(active, list.length - 1) : 0

  const go = useCallback((dir) => {
    if (!list.length) return
    setActive((prev) => (Math.min(prev, list.length - 1) + dir + list.length) % list.length)
  }, [list.length])

  return (
    <section id="projects" className="section p-section">
      <div className="container">
        <SectionHead
          index="04"
          eyebrow="Portfolio"
          title={projectsCopy?.title || 'Featured Projects'}
          subtitle={projectsCopy?.subtitle}
        />

        <Reveal className={`p-flow${spatial ? '' : ' p-flow--list'}`}>
          <div
            className="p-flow__stage"
            role="group"
            aria-label="Projects"
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') go(1)
              if (e.key === 'ArrowLeft') go(-1)
            }}
          >
            {list.map((project, i) => {
              const isActive = i === index
              return (
                <article
                  key={project.title}
                  className={`p-card p-project${isActive ? ' is-active' : ''}`}
                  style={spatial ? coverflow(ringOffset(i, index, list.length)) : undefined}
                  onClick={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  tabIndex={0}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <div className="p-project__media" aria-hidden="true">
                    <span className="p-project__grid" />
                    <span className="p-project__mono">{initials(project.title)}</span>
                    {project.badge && <span className="p-project__badge">{project.badge}</span>}
                  </div>
                  <div className="p-project__body">
                    <p className="p-kicker">{project.category || project.badge}</p>
                    <h3>{project.title}</h3>
                    <p className="p-project__desc">{project.desc}</p>
                    {project.features?.length ? (
                      <ul className="p-checks p-checks--compact">
                        {project.features.slice(0, 4).map((f) => (
                          <li key={f}><IconCheck /><span>{f}</span></li>
                        ))}
                      </ul>
                    ) : null}
                    <div className="p-tags">
                      {(project.tech || []).map((t) => (
                        <span key={t} className="p-tag">{t}</span>
                      ))}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          {spatial && list.length > 1 ? (
            <div className="p-flow__controls">
              <button type="button" className="p-flow__arrow p-flow__arrow--prev" onClick={() => go(-1)} aria-label="Previous project">
                <IconChevron size={18} />
              </button>
              <div className="p-flow__dots">
                {list.map((project, i) => (
                  <button
                    key={project.title}
                    type="button"
                    className={i === index ? 'is-active' : undefined}
                    aria-label={`Show ${project.title}`}
                    aria-current={i === index ? 'true' : undefined}
                    onClick={() => setActive(i)}
                  />
                ))}
              </div>
              <button type="button" className="p-flow__arrow p-flow__arrow--next" onClick={() => go(1)} aria-label="Next project">
                <IconChevron size={18} />
              </button>
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  )
}
