import { useContent } from '../context/ContentProvider'
import { useInView } from '../hooks/useInView'

export default function Skills() {
  const { skillGroups, skillsCopy } = useContent()
  const [ref, visible] = useInView()

  return (
    <section id="skills" className="section section--tint skills-section">
      <div className={`container reveal ${visible ? 'is-visible' : ''}`} ref={ref}>
        <header className="section-head">
          <p className="eyebrow">Skills</p>
          <h2 className="section-title">{skillsCopy.title}</h2>
          <p className="section-subtitle">{skillsCopy.subtitle}</p>
        </header>

        <div className="skills-grid">
          {skillGroups.map((group) => (
            <article key={group.title} className="skill-group glass depth-panel">
              <h3>{group.title}</h3>
              <div className="skill-group__tags">
                {group.skills.map((skill) => (
                  <span key={skill} className="tag tag--skill">
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
