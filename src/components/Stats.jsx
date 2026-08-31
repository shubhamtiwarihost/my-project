import { useContent } from '../context/ContentProvider'
import { useInView } from '../hooks/useInView'
import { useIsCompactDevice } from '../hooks/useIsCompactDevice'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useStageTilt } from '../hooks/useStageTilt'

export default function Stats() {
  const { profile } = useContent()
  const [ref, visible] = useInView()
  const compact = useIsCompactDevice()
  const reducedMotion = usePrefersReducedMotion()
  const spatial = !compact && !reducedMotion
  const [stageRef, stageStyle, onStageMove, onStageLeave] = useStageTilt(spatial)

  const stats = profile.stats?.length
    ? profile.stats
    : [
        { num: '7+', label: 'Years Experience' },
        { num: '5', label: 'Companies' },
        { num: '99.9%', label: 'Availability Focus' },
        { num: '30+', label: 'Technologies' },
      ]

  const cards = [...stats]
  if (cards.length === 3) {
    cards.push({ num: '30+', label: 'Technologies' })
  }

  return (
    <section className="section stats-3d-section" style={{ paddingTop: 0 }} aria-label="Key metrics">
      <div className={`container reveal ${visible ? 'is-visible' : ''}`} ref={ref}>
        <div
          className={`stats-3d${spatial ? '' : ' stats-3d--flat'}`}
          ref={stageRef}
          onPointerMove={onStageMove}
          onPointerLeave={onStageLeave}
        >
          <div className="stats-3d__glow" aria-hidden="true" />
          <div className="stats-3d__floor" aria-hidden="true" />
          <div className="stats-3d__stage" style={stageStyle}>
            {cards.slice(0, 4).map((stat, i) => (
              <article
                key={stat.label}
                className="stat-3d"
                style={spatial ? { '--i': i } : undefined}
              >
                <div className="stat-3d__face">
                  <div className="stat-3d__num">{stat.num}</div>
                  <div className="stat-3d__label">{stat.label}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
