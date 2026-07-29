import { certifications, experiences } from '../data/content'
import { useInView } from '../hooks/useInView'
import { IconCheck } from './Icons'

export default function Experience() {
  const [ref, visible] = useInView()

  return (
    <section id="experience" className="section">
      <div className={`container reveal ${visible ? 'is-visible' : ''}`} ref={ref}>
        <header className="section-head">
          <p className="eyebrow">Experience</p>
          <h2 className="section-title">Professional experience</h2>
          <p className="section-subtitle">
            Long-term ownership across enterprise apps, SaaS delivery, client coordination, and production
            support.
          </p>
        </header>

        <div className="experience-list">
          {experiences.map((exp) => (
            <article key={`${exp.company}-${exp.role}`} className="experience-item">
              <div className="experience-item__top">
                <div>
                  <h3>{exp.role}</h3>
                  <p className="experience-item__meta">
                    <span>{exp.company}</span>
                    <span aria-hidden="true">·</span>
                    <span>{exp.location}</span>
                    <span aria-hidden="true">·</span>
                    <span>{exp.type}</span>
                  </p>
                </div>
                <div className="experience-item__dates">
                  <span>{exp.period}</span>
                  <span className="experience-item__duration">{exp.duration}</span>
                </div>
              </div>

              <ul className="check-list">
                {exp.highlights.map((item) => (
                  <li key={item}>
                    <IconCheck />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="skill-group__tags" style={{ marginTop: '1.4rem' }}>
                {exp.tech.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="certs">
          <h3>Certifications & Recognition</h3>
          <p>
            Leadership training and performance recognition aligned with enterprise delivery outcomes.
          </p>
          <div className="certs__grid">
            {certifications.map((cert) => (
              <article key={cert.title} className="cert-item">
                <h4>{cert.title}</h4>
                <p>{cert.issuer}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
