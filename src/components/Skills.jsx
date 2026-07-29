import { alsoUsed, skillGroups } from '../data/content'
import { useInView } from '../hooks/useInView'

export default function Skills() {
  const [ref, visible] = useInView()

  return (
    <section id="skills" className="section section--tint">
      <div className={`container reveal ${visible ? 'is-visible' : ''}`} ref={ref}>
        <header className="section-head">
          <p className="eyebrow">Skills</p>
          <h2 className="section-title">Technical skills, organized for delivery.</h2>
          <p className="section-subtitle">
            Clean groupings that reflect real-world execution: backend systems, integrations, front-end
            foundations, and team leadership.
          </p>
        </header>

        <div className="skills-grid">
          {skillGroups.map((group) => (
            <article key={group.title} className="skill-group">
              <h3>{group.title}</h3>
              <div className="skill-group__tags">
                {group.skills.map((skill) => (
                  <span key={skill} className="tag">
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="also-used">
          <h3>Also used in production</h3>
          <div className="skill-group__tags">
            {alsoUsed.map((item) => (
              <span key={item} className="tag tag--muted">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
