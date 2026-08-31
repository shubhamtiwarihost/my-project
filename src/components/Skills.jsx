import { useContent } from '../context/ContentProvider'
import { useInView } from '../hooks/useInView'
import { useIsCompactDevice } from '../hooks/useIsCompactDevice'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useStageTilt } from '../hooks/useStageTilt'

export default function Skills() {
  const { skillGroups, skillsCopy } = useContent()
  const [ref, visible] = useInView()
  const compact = useIsCompactDevice()
  const reducedMotion = usePrefersReducedMotion()
  const spatial = !compact && !reducedMotion
  const [stageRef, stageStyle, onStageMove, onStageLeave] = useStageTilt(spatial)

  return (
    <section id="skills" className="section section--tint skills-3d-section">
      <div className={`container reveal ${visible ? 'is-visible' : ''}`} ref={ref}>
        <header className="section-head">
          <p className="eyebrow">Skills</p>
          <h2 className="section-title">{skillsCopy.title}</h2>
          <p className="section-subtitle">{skillsCopy.subtitle}</p>
        </header>

        <div
          className={`skills-3d${spatial ? '' : ' skills-3d--flat'}`}
          ref={stageRef}
          onPointerMove={onStageMove}
          onPointerLeave={onStageLeave}
        >
          <div className="skills-3d__glow" aria-hidden="true" />
          <div className="skills-3d__floor" aria-hidden="true" />

          <div className="skills-3d__stage" style={stageStyle}>
            {skillGroups.map((group, i) => (
              <article
                key={group.title}
                className="skill-3d"
                style={spatial ? { '--i': i } : undefined}
              >
                <div className="skill-3d__face">
                  <div className="skill-3d__index" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3>{group.title}</h3>
                  <div className="skill-3d__tags">
                    {group.skills.map((skill) => (
                      <span key={skill} className="tag tag--skill">{skill}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
