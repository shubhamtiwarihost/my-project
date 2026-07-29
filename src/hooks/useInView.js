import { useEffect, useRef, useState } from 'react'

/** Reveal element once it enters the viewport */
export function useInView({ threshold = 0.12, rootMargin = '0px 0px -40px 0px' } = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.unobserve(entry.target)
      }
    }, { threshold, rootMargin })

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return [ref, visible]
}
