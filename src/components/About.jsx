import { useContent } from '../context/ContentProvider'
import { IconCheck, IconLinkedIn, IconMail, IconPhone } from './Icons'
import Reveal from './ui/Reveal'
import SectionHead from './ui/SectionHead'
import Tilt from './ui/Tilt'

export default function About() {
  const { about, profile } = useContent()
  const highlights = about.highlights?.length ? about.highlights : []

  return (
    <section id="about" className="section p-section">
      <div className="container">
        <SectionHead index="01" eyebrow={about.eyebrow || 'About'} title={about.title} subtitle={about.subtitle} />

        <div className="p-about">
          <Reveal>
            <Tilt as="article" className="p-card p-about__main" max={5}>
              <p className="p-kicker z1">{about.leadershipTitle || 'Summary'}</p>
              {about.leadershipBody?.slice(0, 2).map((para) => (
                <p key={para.slice(0, 32)} className="p-about__body">{para}</p>
              ))}

              {about.bringItems?.length ? (
                <ul className="p-checks">
                  {about.bringItems.slice(0, 5).map((item) => (
                    <li key={item}><IconCheck /><span>{item}</span></li>
                  ))}
                </ul>
              ) : null}

              <div className="p-about__meta z1">
                <span>{profile.location}</span>
                <a href={profile.emailMailto}><IconMail size={14} />{profile.email}</a>
                {profile.phone && <a href={profile.phoneHref}><IconPhone size={14} />{profile.phone}</a>}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                    <IconLinkedIn size={14} />LinkedIn
                  </a>
                )}
              </div>
            </Tilt>
          </Reveal>

          <div className="p-about__grid">
            {highlights.map((item, i) => (
              <Reveal key={item.id || item.title} delay={i * 90}>
                <Tilt as="article" className="p-card p-feature" max={12}>
                  <span className="p-feature__index z2" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="z1">{item.title}</h3>
                  <p>{item.desc}</p>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
