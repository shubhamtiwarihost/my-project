import { useIsCompactDevice } from './useIsCompactDevice'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/** True when pointer-driven 3D effects make sense: desktop pointer and motion allowed. */
export function useSpatial() {
  const compact = useIsCompactDevice()
  const reducedMotion = usePrefersReducedMotion()
  return !compact && !reducedMotion
}
