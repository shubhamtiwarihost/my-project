import { useMemo } from 'react'
import { useContent } from '../context/ContentProvider'
import { useIsCompactDevice } from '../hooks/useIsCompactDevice'
import Reveal from './ui/Reveal'
import SectionHead from './ui/SectionHead'
import SkillSphere from './ui/SkillSphere'
import Tilt from './ui/Tilt'

/** "AWS (EC2, S3, RDS, CloudWatch)" → "AWS" so labels fit on the globe. */
function shortLabel(skill) {
  return skill.replace(/\s*\(.*\)\s*/, '').trim()
}

export default function Skills() {
  const { skillGroups, skillsCopy } = useContent()
  const compact = useIsCompactDevice()

  const globeSkills = useMemo(() => {
    // Take skills round-robin across groups so every area is represented
    const picked = []
    const longest = Math.max(0, ...skillGroups.map((g) => g.skills.length))
    for (let i = 0; i < longest; i += 1) {
      skillGroups.forEach((g) => {
        if (g.skills[i]) picked.push(shortLabel(g.skills[i]))
      })
    }
    return [...new Set(picked)].slice(0, compact ? 14 : 22)
  }, [skillGroups, compact])

  return (
    <section id="skills" className="section p-section">
      <div className="container">
        <SectionHead index="02" eyebrow="Skills" title={skillsCopy.title} subtitle={skillsCopy.subtitle} />

        <div className="p-skills">
          <Reveal className="p-skills__globe">
            <SkillSphere skills={globeSkills} />
          </Reveal>

          <div className="p-skills__grid">
            {skillGroups.map((group, i) => (
              <Reveal key={group.title} delay={(i % 2) * 90}>
                <Tilt as="article" className="p-card p-skill" max={10}>
                  <span className="p-skill__index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="z1">{group.title}</h3>
                  <div className="p-tags">
                    {group.skills.map((skill) => (
                      <span key={skill} className="p-tag">{skill}</span>
                    ))}
                  </div>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
