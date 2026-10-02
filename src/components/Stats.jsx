import { useEffect, useRef } from 'react'
import { useContent } from '../context/ContentProvider'
import { useInView } from '../hooks/useInView'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import Tilt from './ui/Tilt'

/** Counts up from 0 to a value like "7+", "99.9%" or "30+" once visible. */
function CountUp({ value, run }) {
  const ref = useRef(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const el = ref.current
    const match = String(value).match(/^([\d.]+)(.*)$/)
    if (!el || !match || !run || reducedMotion) return undefined

    const target = parseFloat(match[1])
    const decimals = (match[1].split('.')[1] || '').length
    const suffix = match[2]
    const started = performance.now()
    let frame = 0
    const step = (now) => {
      const t = Math.min(1, (now - started) / 1400)
      const eased = 1 - (1 - t) ** 3
      el.textContent = (target * eased).toFixed(decimals) + suffix
      if (t < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [value, run, reducedMotion])

  return <span ref={ref}>{value}</span>
}

export default function Stats() {
  const { profile } = useContent()
  const [ref, visible] = useInView({ threshold: 0.3 })

  const stats = profile.stats?.length
    ? [...profile.stats]
    : [
        { num: '7+', label: 'Years Experience' },
        { num: '5', label: 'Companies' },
        { num: '99.9%', label: 'Availability Focus' },
      ]
  if (stats.length === 3) stats.push({ num: '30+', label: 'Technologies' })

  return (
    <section className="p-stats" aria-label="Key metrics">
      <div className="container">
        <div className={`p-stats__grid rv-group${visible ? ' is-in' : ''}`} ref={ref}>
          {stats.slice(0, 4).map((stat, i) => (
            <Tilt key={stat.label} as="article" className="p-card p-stat" max={14} style={{ '--d': `${i * 90}ms` }}>
              <div className="p-stat__num z2"><CountUp value={stat.num} run={visible} /></div>
              <div className="p-stat__label z1">{stat.label}</div>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  )
}
