import { useContent } from '../context/ContentProvider'
import { useInView } from '../hooks/useInView'
import { IconCheck } from './Icons'

export default function About() {
  const { about, profile } = useContent()
  const [ref, visible] = useInView()

  return (
    <section id="about" className="section">
      <div className={`container reveal ${visible ? 'is-visible' : ''}`} ref={ref}>
        <header className="section-head">
          <p className="eyebrow">{about.eyebrow}</p>
          <h2 className="section-title">{about.title}</h2>
          <p className="section-subtitle">{about.subtitle}</p>
          <p className="availability">{profile.availability}</p>
          <p className="stack-line">{profile.stackLine}</p>
        </header>

        <div className="stat-row" aria-label="Key metrics">
          {profile.stats.map((stat) => (
            <div key={stat.label} className="stat-item">
              <div className="stat-item__num">{stat.num}</div>
              <div className="stat-item__label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="highlight-grid">
          {about.highlights.map((item, index) => (
            <article key={item.id || item.title} className="highlight-item">
              <span className="highlight-item__index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>

        <div className="about-split">
          <div>
            <h3>{about.leadershipTitle}</h3>
            {about.leadershipBody.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </div>
          <div>
            <h3>{about.bringTitle}</h3>
            <ul className="check-list">
              {about.bringItems.map((item) => (
                <li key={item}>
                  <IconCheck />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
