import { useEffect, useRef } from 'react'

/** Thin gradient bar at the top of the page showing how far you have scrolled. */
export function ScrollProgress() {
  const ref = useRef(null)

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      if (ref.current) ref.current.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return <div className="scroll-progress" ref={ref} aria-hidden="true" />
}

/** Soft light that follows the mouse (desktop only). */
export function CursorGlow() {
  const ref = useRef(null)

  useEffect(() => {
    const onMove = (e) => {
      if (!ref.current) return
      ref.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      ref.current.style.opacity = '1'
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return <div className="cursor-glow" ref={ref} aria-hidden="true" />
}
