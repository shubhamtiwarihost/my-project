import { useEffect, useState } from 'react'

/** Short branded intro while fonts and the 3D scene load. */
export default function Preloader({ initials = 'ST' }) {
  const [phase, setPhase] = useState('show') // show → hide → gone

  useEffect(() => {
    const hide = setTimeout(() => setPhase('hide'), 900)
    const gone = setTimeout(() => setPhase('gone'), 1500)
    return () => {
      clearTimeout(hide)
      clearTimeout(gone)
    }
  }, [])

  if (phase === 'gone') return null

  return (
    <div className={`p-loader${phase === 'hide' ? ' is-hiding' : ''}`} aria-hidden="true">
      <div className="p-loader__mark">{initials}</div>
      <div className="p-loader__bar"><span /></div>
    </div>
  )
}
