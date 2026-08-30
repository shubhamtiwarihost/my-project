import { useContent } from '../context/ContentProvider'
import { useInView } from '../hooks/useInView'

export default function Projects() {
  const { projects, projectsCopy } = useContent()
  const [ref, visible] = useInView()

  return (
    <section id="projects" className="section">
      <div className={`container reveal ${visible ? 'is-visible' : ''}`} ref={ref}>
        <header className="section-head">
          <p className="eyebrow">Portfolio</p>
          <h2 className="section-title">{projectsCopy?.title || 'Featured Projects'}</h2>
          <p className="section-subtitle">{projectsCopy?.subtitle}</p>
        </header>

        <div className="projects-neo">
          {projects.map((project) => (
            <article key={project.title} className="project-neo glass depth-panel">
              <div className="project-neo__media" aria-hidden="true">
                {(project.title || '?').slice(0, 2).toUpperCase()}
              </div>
              <div className="project-neo__body">
                <p className="project-neo__cat">{project.category || project.badge}</p>
                <h3>{project.title}</h3>
                <p>{project.desc}</p>
                <div className="project-neo__tags">
                  {(project.tech || []).map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
