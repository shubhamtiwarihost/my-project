import { useMemo } from 'react'
import { useContent } from '../context/ContentProvider'
import { useInView } from '../hooks/useInView'

export default function Skills() {
  const { skillGroups, alsoUsed, skillsCopy } = useContent()
  const [ref, visible] = useInView()

  const allTech = useMemo(() => {
    const fromGroups = (skillGroups || []).flatMap((g) => g.skills || [])
    return [...new Set([...fromGroups, ...(alsoUsed || [])])]
  }, [skillGroups, alsoUsed])

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

        <div className="also-used glass depth-panel">
          <h3>All technologies</h3>
          <p className="also-used__note">Full stack from languages to cloud and engineering practices.</p>
          <div className="skill-group__tags skill-group__tags--all">
            {allTech.map((item) => (
              <span key={item} className="tag tag--skill">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
