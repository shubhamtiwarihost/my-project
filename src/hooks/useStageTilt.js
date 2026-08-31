import { useCallback, useRef, useState } from 'react'

/** Local pointer tilt for a stage element. */
export function useStageTilt(enabled) {
  const ref = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const onPointerMove = useCallback((e) => {
    if (!enabled || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1
    setTilt({ x, y })
  }, [enabled])

  const onPointerLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
  }, [])

  const style = enabled
    ? { transform: `rotateX(${8 - tilt.y * 6}deg) rotateY(${tilt.x * 10}deg)` }
    : undefined

  return [ref, style, onPointerMove, onPointerLeave]
}
