import { useContent } from '../context/ContentProvider'
import { useInView } from '../hooks/useInView'
import { IconLinkedIn, IconPhone } from './Icons'

const LEVELS = {
  PHP: 95,
  Laravel: 90,
  Drupal: 90,
  MySQL: 95,
  AWS: 85,
  JavaScript: 80,
}

export default function About() {
  const { about, profile, experiences, skillGroups } = useContent()
  const [ref, visible] = useInView()

  const skillBars = Object.entries(LEVELS).map(([name, level]) => ({ name, level }))
  // Prefer skills from CMS groups if present
  const flatSkills = skillGroups.flatMap((g) => g.skills || [])
  const bars = skillBars.map((s) => ({
    ...s,
    level: flatSkills.some((x) => x.toLowerCase().includes(s.name.toLowerCase())) ? s.level : s.level,
  }))

  return (
    <section id="about" className="section">
      <div className={`container reveal ${visible ? 'is-visible' : ''}`} ref={ref}>
        <div className="bento">
          <article className="bento__card glass about-neo">
            <h3>About Me</h3>
            {about.leadershipBody?.slice(0, 2).map((para) => (
              <p key={para.slice(0, 28)}>{para}</p>
            ))}
            <div className="about-neo__meta">
              <div><strong>Location</strong><span>{profile.location}</span></div>
              <div><strong>Email</strong><span><a href={profile.emailMailto}>{profile.email}</a></span></div>
              <div><IconPhone size={14} /><span>{profile.phone}</span></div>
              {profile.linkedin && (
                <div><IconLinkedIn size={14} /><span><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn Profile </a></span></div>
              )}
            </div>
          </article>

          <article id="experience" className="bento__card glass" style={{ scrollMarginTop: '90px' }}>
            <h3>Experience</h3>
            <div className="timeline">
              {experiences.map((exp) => (
                <div key={`${exp.company}-${exp.period}`} className="timeline__item">
                  <p className="timeline__role">{exp.role}</p>
                  <p className="timeline__meta">{exp.company}</p>
                  <p className="timeline__period">{exp.period} · {exp.location}</p>
                </div>
              ))}
            </div>
          </article>

          <article id="skills" className="bento__card glass" style={{ scrollMarginTop: '90px' }}>
            <h3>My Skills</h3>
            <div className="skill-bars">
              {bars.map((skill) => (
                <div key={skill.name}>
                  <div className="skill-bar__top">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="skill-bar__track">
                    <div className="skill-bar__fill" style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
