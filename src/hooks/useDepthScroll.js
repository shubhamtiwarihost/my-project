import { useEffect } from 'react'
import { pageTop } from '../lib/layout'

const SELECTOR = 'main > section'

/**
 * Turns every page section into a panel floating in 3D space: it rises out of the
 * depth as it scrolls in, sits flat while it fills the screen, then tilts back and
 * sinks away as it leaves. Writes CSS variables only; styling lives in premium.css.
 */
export function useDepthScroll(enabled, { pointer = true, strength = 1 } = {}) {
  useEffect(() => {
    const root = document.documentElement
    if (!enabled) {
      root.classList.remove('depth-3d')
      return undefined
    }
    root.classList.add('depth-3d')

    let frame = 0
    let px = 0
    let py = 0

    const update = () => {
      frame = 0
      const vh = window.innerHeight
      document.querySelectorAll(SELECTOR).forEach((el) => {
        const top = pageTop(el) - window.scrollY
        const h = el.offsetHeight
        // -1 … 1: how far the section's centre is from the viewport's centre
        const d = Math.max(-1, Math.min(1, (top + h / 2 - vh / 2) / (vh / 2 + h / 2)))
        // Stay flat while the section is being read; only the edges of the journey move
        const e = Math.sign(d) * Math.max(0, Math.abs(d) - 0.3) / 0.7
        el.style.setProperty('--depth-z', `${(-Math.abs(e) * 420 * strength).toFixed(1)}px`)
        el.style.setProperty('--depth-rx', `${(e * 22 * strength).toFixed(2)}deg`)
        el.style.setProperty('--depth-ry', `${(px * 4 * (1 - Math.abs(e))).toFixed(2)}deg`)
        el.style.setProperty('--depth-tx', `${(px * -10).toFixed(1)}px`)
        el.style.setProperty('--depth-ty', `${(py * -6).toFixed(1)}px`)
        el.style.setProperty('--depth-o', (1 - Math.abs(e) * 0.75 * strength).toFixed(3))
      })
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const onPointer = (ev) => {
      px = (ev.clientX / window.innerWidth) * 2 - 1
      py = (ev.clientY / window.innerHeight) * 2 - 1
      schedule()
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    if (pointer) window.addEventListener('pointermove', onPointer, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      root.classList.remove('depth-3d')
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [enabled, pointer, strength])
}
