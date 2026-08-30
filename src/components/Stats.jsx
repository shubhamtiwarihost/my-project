import { useContent } from '../context/ContentProvider'
import { useInView } from '../hooks/useInView'

export default function Stats() {
  const { profile } = useContent()
  const [ref, visible] = useInView()

  const stats = profile.stats?.length
    ? profile.stats
    : [
        { num: '6+', label: 'Years Experience' },
        { num: '20+', label: 'Projects Delivered' },
        { num: '30+', label: 'Technologies' },
        { num: '5', label: 'Companies Worked' },
      ]

  // Expand to 4 cards if CMS only has 3
  const cards = [...stats]
  if (cards.length === 3) {
    cards.push({ num: '30+', label: 'Technologies' })
  }

  return (
    <section className="section" style={{ paddingTop: 0, paddingBottom: '1rem' }} aria-label="Key metrics">
      <div className={`container reveal ${visible ? 'is-visible' : ''}`} ref={ref}>
        <div className="stats-neo">
          {cards.slice(0, 4).map((stat) => (
            <article key={stat.label} className="stat-neo glass depth-panel">
              <div className="stat-neo__num">{stat.num}</div>
              <div className="stat-neo__label">{stat.label}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
