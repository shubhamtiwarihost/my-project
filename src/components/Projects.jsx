import { useState } from 'react'
import { projects, projectsNote } from '../data/content'
import { useInView } from '../hooks/useInView'
import { IconCheck, IconChevron, IconInfo } from './Icons'

export default function Projects() {
  const [ref, visible] = useInView()
  const [expanded, setExpanded] = useState(null)

  return (
    <section id="projects" className="section section--tint">
      <div className={`container reveal ${visible ? 'is-visible' : ''}`} ref={ref}>
        <header className="section-head">
          <p className="eyebrow">Projects</p>
          <h2 className="section-title">Enterprise backends, CMS & learning platforms</h2>
          <p className="section-subtitle">
            Selected platforms spanning banking, corporate CMS, edtech, and real estate — with ownership
            from architecture through production support.
          </p>
        </header>

        <div className="projects-grid">
          {projects.map((project, index) => {
            const open = expanded === index
            return (
              <article key={project.title} className={`project-panel ${open ? 'is-open' : ''}`}>
                <div className="project-panel__head">
                  <div>
                    <p className="project-panel__category">{project.category}</p>
                    <h3>{project.title}</h3>
                  </div>
                  <span className="project-panel__badge">{project.badge}</span>
                </div>

                <p className="project-panel__desc">{project.desc}</p>

                <button
                  type="button"
                  className="project-panel__toggle"
                  aria-expanded={open}
                  onClick={() => setExpanded(open ? null : index)}
                >
                  {open ? 'Hide' : 'Show'} features
                  <IconChevron open={open} />
                </button>

                {open && (
                  <ul className="check-list project-panel__features">
                    {project.features.map((feature) => (
                      <li key={feature}>
                        <IconCheck size={12} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="skill-group__tags project-panel__tech">
                  {project.tech.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            )
          })}
        </div>

        <aside className="note-banner">
          <IconInfo />
          <p>{projectsNote}</p>
        </aside>
      </div>
    </section>
  )
}
