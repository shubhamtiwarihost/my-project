import { useEffect, useMemo, useRef } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

/** Evenly spread points on a unit sphere. */
function spherePoints(count) {
  const points = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / Math.max(1, count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const a = golden * i
    points.push([Math.cos(a) * r, y, Math.sin(a) * r])
  }
  return points
}

/**
 * Skills arranged on a rotating 3D globe. It spins on its own and follows the
 * pointer; drag (or swipe) to spin it by hand.
 */
export default function SkillSphere({ skills }) {
  const stage = useRef(null)
  const reducedMotion = usePrefersReducedMotion()
  const points = useMemo(() => spherePoints(skills.length), [skills.length])

  useEffect(() => {
    const el = stage.current
    if (!el) return undefined
    const tags = [...el.querySelectorAll('.p-sphere__tag')]
    let rotX = -0.25
    let rotY = 0.4
    let velX = 0
    let velY = reducedMotion ? 0 : 0.0035
    let drag = null
    let frame = 0
    let running = false

    const draw = () => {
      const radius = el.clientWidth * 0.42
      const sx = Math.sin(rotX)
      const cx = Math.cos(rotX)
      const sy = Math.sin(rotY)
      const cy = Math.cos(rotY)
      tags.forEach((tag, i) => {
        const [x0, y0, z0] = points[i]
        const x1 = x0 * cy + z0 * sy
        const z1 = -x0 * sy + z0 * cy
        const y1 = y0 * cx - z1 * sx
        const z2 = y0 * sx + z1 * cx
        const depth = (z2 + 1) / 2 // 0 back … 1 front
        tag.style.transform = `translate(-50%, -50%) translate3d(${x1 * radius}px, ${y1 * radius}px, 0) scale(${0.7 + depth * 0.38})`
        tag.style.opacity = String(0.12 + depth * 0.88)
        tag.style.zIndex = String(Math.round(depth * 100))
        tag.classList.toggle('is-front', depth > 0.8)
      })
    }

    const tick = () => {
      if (!drag) {
        rotY += velY
        rotX += velX
        velX *= 0.95
        // ease back to the idle spin after a flick
        if (!reducedMotion) velY += (0.0035 * Math.sign(velY || 1) - velY) * 0.02
        else velY *= 0.95
      }
      draw()
      if (running) frame = requestAnimationFrame(tick)
    }

    const onDown = (e) => {
      drag = { x: e.clientX, y: e.clientY }
      el.setPointerCapture?.(e.pointerId)
    }
    const onMove = (e) => {
      if (!drag) return
      const dx = e.clientX - drag.x
      const dy = e.clientY - drag.y
      drag = { x: e.clientX, y: e.clientY }
      rotY += dx * 0.006
      rotX -= dy * 0.006
      velY = dx * 0.0012
      velX = -dy * 0.0012
      if (!running) draw()
    }
    const onUp = () => {
      drag = null
    }

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)

    // Only animate while the globe is on screen
    const io = new IntersectionObserver(([entry]) => {
      const visible = entry.isIntersecting
      if (visible && !running) {
        running = true
        frame = requestAnimationFrame(tick)
      } else if (!visible) {
        running = false
        cancelAnimationFrame(frame)
      }
    })
    io.observe(el)
    draw()

    return () => {
      running = false
      cancelAnimationFrame(frame)
      io.disconnect()
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }
  }, [points, reducedMotion])

  return (
    <div className="p-sphere" ref={stage} role="img" aria-label={`Skills: ${skills.join(', ')}`}>
      <span className="p-sphere__core" aria-hidden="true" />
      <span className="p-sphere__ring p-sphere__ring--a" aria-hidden="true" />
      <span className="p-sphere__ring p-sphere__ring--b" aria-hidden="true" />
      {skills.map((skill) => (
        <span key={skill} className="p-sphere__tag" aria-hidden="true">{skill}</span>
      ))}
      <span className="p-sphere__hint" aria-hidden="true">Drag to spin</span>
    </div>
  )
}
