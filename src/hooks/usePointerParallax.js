import { useEffect, useState } from 'react'

/** Maps pointer position to mild -1..1 offsets for CSS 3D tilt */
export function usePointerParallax(enabled = true) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!enabled) return undefined

    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1
      setPointer({ x, y })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [enabled])

  if (!enabled) return { x: 0, y: 0 }
  return pointer
}
