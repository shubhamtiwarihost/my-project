import { useContent } from '../context/ContentProvider'
import { IconGithub, IconLinkedIn, IconMail } from './Icons'

const FLOAT_TAGS = ['PHP', 'Drupal', 'Laravel', 'AWS', 'Backend']

export default function Hero() {
  const { profile, hero, settings } = useContent()
  const photo = settings?.logo || hero?.backgroundUrl || null

  return (
    <section id="home" className="hero-neo section" aria-label="Introduction">
      <div className="container">
        <div className="hero-neo__grid">
          <div>
            <p className="hero-neo__hello">Hello, I&apos;m</p>
            <h1 className="hero-neo__name">{profile.name}</h1>
            <p className="hero-neo__role">{profile.role}</p>
            <p className="hero-neo__stack">{profile.stackLine}</p>

            <div className="hero-neo__actions">
              {profile.resumeUrl ? (
                <a
                  className="btn btn-primary"
                  href={profile.resumeUrl}
                  download={profile.resumeFileName || 'resume.pdf'}
                >
                  Download Resume
                </a>
              ) : (
                <a className="btn btn-primary" href="#contact">Download Resume</a>
              )}
              <a className="btn btn-ghost" href="#contact">Hire Me</a>
              <a className="btn btn-ghost" href="#projects">View Projects</a>
            </div>

            <div className="hero-neo__follow">
              <span>Follow Me</span>
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <IconLinkedIn size={15} />
                </a>
              )}
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <IconGithub size={15} />
                </a>
              )}
              <a href={profile.emailMailto} aria-label="Email"><IconMail size={15} /></a>
            </div>
          </div>

          <div className="hero-neo__portrait-wrap" aria-hidden="true">
            <div className="hero-neo__portrait">
              <div className="hero-neo__portrait-inner">
                {photo ? (
                  <img src={photo} alt="" />
                ) : (
                  <span className="hero-neo__avatar-fallback">{profile.initials}</span>
                )}
              </div>
            </div>
            {FLOAT_TAGS.map((tag, i) => (
              <span key={tag} className={`hero-neo__float hero-neo__float--${i + 1}`}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
