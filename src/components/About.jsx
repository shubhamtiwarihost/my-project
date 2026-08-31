import { useContent } from '../context/ContentProvider'
import { useInView } from '../hooks/useInView'
import { useIsCompactDevice } from '../hooks/useIsCompactDevice'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useStageTilt } from '../hooks/useStageTilt'
import { IconLinkedIn, IconPhone } from './Icons'

export default function About() {
  const { about, profile } = useContent()
  const [ref, visible] = useInView()
  const compact = useIsCompactDevice()
  const reducedMotion = usePrefersReducedMotion()
  const spatial = !compact && !reducedMotion
  const [stageRef, stageStyle, onStageMove, onStageLeave] = useStageTilt(spatial)

  const highlights = about.highlights?.length
    ? about.highlights
    : []

  return (
    <section id="about" className="section about-3d-section">
      <div className={`container reveal ${visible ? 'is-visible' : ''}`} ref={ref}>
        <header className="section-head">
          <p className="eyebrow">{about.eyebrow || 'About'}</p>
          <h2 className="section-title">{about.title}</h2>
          <p className="section-subtitle">{about.subtitle}</p>
        </header>

        <div
          className={`about-3d${spatial ? '' : ' about-3d--flat'}`}
          ref={stageRef}
          onPointerMove={onStageMove}
          onPointerLeave={onStageLeave}
        >
          <div className="about-3d__glow" aria-hidden="true" />
          <div className="about-3d__floor" aria-hidden="true" />

          <div className="about-3d__stage" style={stageStyle}>
            <article className="about-3d__panel about-3d__panel--main">
              <div className="about-3d__face">
                <p className="eyebrow">{about.leadershipTitle || 'Summary'}</p>
                <h3 className="about-3d__title">About Me</h3>
                {about.leadershipBody?.slice(0, 2).map((para) => (
                  <p key={para.slice(0, 32)} className="about-3d__body">{para}</p>
                ))}
                <div className="about-3d__meta">
                  <div><strong>Location</strong><span>{profile.location}</span></div>
                  <div><strong>Email</strong><span><a href={profile.emailMailto}>{profile.email}</a></span></div>
                  <div><IconPhone size={14} /><span>{profile.phone}</span></div>
                  {profile.linkedin && (
                    <div>
                      <IconLinkedIn size={14} />
                      <span>
                        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                      </span>
                    </div>
                  )}
                </div>
                {about.bringItems?.length ? (
                  <ul className="about-3d__bring">
                    {about.bringItems.slice(0, 5).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </article>

            <div className="about-3d__highlights">
              {highlights.map((item, i) => (
                <article
                  key={item.id || item.title}
                  className="about-3d__chip"
                  style={spatial ? { '--i': i } : undefined}
                >
                  <div className="about-3d__face about-3d__face--chip">
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
