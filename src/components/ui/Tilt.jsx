import { useRef } from 'react'
import { useSpatial } from '../../hooks/useSpatial'

/**
 * Card that tilts in 3D towards the pointer, with a light glare following it.
 * Children can sit at different depths with the `z1` / `z2` / `z3` classes.
 */
export default function Tilt({ as: Tag = 'div', className = '', max = 9, children, ...rest }) {
  const ref = useRef(null)
  const spatial = useSpatial()

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--rx', `${(0.5 - y) * max}deg`)
    el.style.setProperty('--ry', `${(x - 0.5) * max}deg`)
    el.style.setProperty('--mx', `${x * 100}%`)
    el.style.setProperty('--my', `${y * 100}%`)
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <Tag
      ref={ref}
      className={`tilt ${className}`}
      onPointerMove={spatial ? onMove : undefined}
      onPointerLeave={spatial ? onLeave : undefined}
      {...rest}
    >
      {children}
      <span className="tilt__glare" aria-hidden="true" />
    </Tag>
  )
}
