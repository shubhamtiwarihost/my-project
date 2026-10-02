import { useState } from 'react'
import { useContent } from '../context/ContentProvider'
import { IconCheck } from './Icons'
import Reveal from './ui/Reveal'
import SectionHead from './ui/SectionHead'
import Tilt from './ui/Tilt'

function companyInitials(name = '?') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export default function Experience() {
  const { experiences, education, experienceCopy } = useContent()
  const [active, setActive] = useState(0)

  const list = experiences?.length ? experiences : []
  const index = Math.min(active, Math.max(list.length - 1, 0))
  const current = list[index]

  if (!current) return null

  return (
    <section id="experience" className="section p-section">
      <div className="container">
        <SectionHead index="03" eyebrow="Experience" title={experienceCopy.title} subtitle={experienceCopy.subtitle} />

        <Reveal className="p-exp">
          <nav className="p-exp__rail" aria-label="Companies">
            <span className="p-exp__line" aria-hidden="true">
              <span style={{ height: `${((index + 0.5) / list.length) * 100}%` }} />
            </span>
            {list.map((exp, i) => (
              <button
                key={`${exp.company}-${exp.period}`}
                type="button"
                className={`p-exp__step${i === index ? ' is-active' : ''}`}
                onClick={() => setActive(i)}
                aria-current={i === index ? 'true' : undefined}
              >
                <span className="p-exp__mark" aria-hidden="true">{companyInitials(exp.company)}</span>
                <span className="p-exp__step-copy">
                  <strong>{exp.company}</strong>
                  <em>{exp.period}</em>
                </span>
              </button>
            ))}
          </nav>

          <Tilt as="article" className="p-card p-exp__panel" max={4}>
            {/* key restarts the entrance animation when the company changes */}
            <div className="p-exp__content" key={index}>
              <div className="p-exp__top">
                <div>
                  <p className="p-kicker">{current.company}</p>
                  <h3 className="z1">{current.role}</h3>
                  <p className="p-exp__meta">{current.location} · {current.type}</p>
                </div>
                <div className="p-exp__dates">
                  <span>{current.period}</span>
                  <em>{current.duration}</em>
                </div>
              </div>

              <ul className="p-checks">
                {(current.highlights || []).slice(0, 5).map((item) => (
                  <li key={item}><IconCheck /><span>{item}</span></li>
                ))}
              </ul>

              <div className="p-tags">
                {(current.tech || []).map((t) => (
                  <span key={t} className="p-tag">{t}</span>
                ))}
              </div>
            </div>
          </Tilt>
        </Reveal>

        {education?.length ? (
          <Reveal className="p-edu">
            {education.map((item) => (
              <article key={item.title} className="p-card p-edu__card">
                <p className="p-kicker">Education</p>
                <h3>{item.title}</h3>
                <p>{item.issuer}</p>
              </article>
            ))}
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}
