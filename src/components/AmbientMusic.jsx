import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const STORAGE_KEY = 'portfolio-ambient-music'

function createAmbientEngine() {
  const Ctx = window.AudioContext || window.webkitAudioContext
  if (!Ctx) return null

  const ctx = new Ctx()
  const master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 720
  filter.Q.value = 0.65
  filter.connect(master)

  const makePad = (freq, type, level, detune = 0) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    osc.detune.value = detune
    gain.gain.value = level
    osc.connect(gain)
    gain.connect(filter)
    osc.start()
    return osc
  }

  const oscillators = [
    makePad(110, 'sine', 0.05),
    makePad(164.81, 'triangle', 0.03, 5),
    makePad(220, 'sine', 0.02, -3),
    makePad(329.63, 'sine', 0.012, 2),
  ]

  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  lfo.frequency.value = 0.07
  lfoGain.gain.value = 160
  lfo.connect(lfoGain)
  lfoGain.connect(filter.frequency)
  lfo.start()

  return {
    ctx,
    async start() {
      if (ctx.state === 'suspended') await ctx.resume()
      const now = ctx.currentTime
      master.gain.cancelScheduledValues(now)
      master.gain.setValueAtTime(master.gain.value, now)
      master.gain.linearRampToValueAtTime(0.2, now + 1.6)
    },
    stop() {
      const now = ctx.currentTime
      master.gain.cancelScheduledValues(now)
      master.gain.setValueAtTime(master.gain.value, now)
      master.gain.linearRampToValueAtTime(0, now + 0.6)
    },
    dispose() {
      try {
        this.stop()
        oscillators.forEach((osc) => osc.stop())
        lfo.stop()
        ctx.close()
      } catch {
        /* ignore */
      }
    },
  }
}

export default function AmbientMusic() {
  const reducedMotion = usePrefersReducedMotion()
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return true
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved === null ? true : saved === '1'
  })
  const [playing, setPlaying] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const engineRef = useRef(null)
  const enabledRef = useRef(enabled)

  useEffect(() => {
    enabledRef.current = enabled
    window.localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0')
  }, [enabled])

  useEffect(() => {
    if (reducedMotion) return undefined

    const engine = createAmbientEngine()
    engineRef.current = engine
    if (!engine) return undefined

    let alive = true

    const start = async () => {
      if (!alive || !enabledRef.current) return
      try {
        await engine.start()
        if (!alive) return
        setPlaying(true)
        setWaiting(false)
      } catch {
        if (alive) setWaiting(true)
      }
    }

    const stop = () => {
      engine.stop()
      if (alive) {
        setPlaying(false)
        setWaiting(false)
      }
    }

    const onGesture = () => {
      if (enabledRef.current) start()
    }

    window.addEventListener('pointerdown', onGesture, { once: true, passive: true })
    window.addEventListener('keydown', onGesture, { once: true })

    if (enabledRef.current) {
      start().then(() => {
        if (alive && enabledRef.current && engine.ctx.state === 'suspended') {
          setWaiting(true)
        }
      })
    }

    const onStorageToggle = (event) => {
      if (event.detail === false) stop()
      if (event.detail === true) start()
    }
    window.addEventListener('portfolio-ambient-toggle', onStorageToggle)

    return () => {
      alive = false
      window.removeEventListener('pointerdown', onGesture)
      window.removeEventListener('keydown', onGesture)
      window.removeEventListener('portfolio-ambient-toggle', onStorageToggle)
      engine.dispose()
      engineRef.current = null
    }
  }, [reducedMotion])

  if (reducedMotion) return null

  const toggle = async () => {
    const next = !enabled
    setEnabled(next)
    enabledRef.current = next
    window.dispatchEvent(new CustomEvent('portfolio-ambient-toggle', { detail: next }))
    if (!next) {
      engineRef.current?.stop()
      setPlaying(false)
      setWaiting(false)
      return
    }
    try {
      await engineRef.current?.start()
      setPlaying(true)
      setWaiting(false)
    } catch {
      setWaiting(true)
    }
  }

  return (
    <div className={`ambient-music${waiting && enabled ? ' is-waiting' : ''}`}>
      <button
        type="button"
        className={`ambient-music__btn${enabled && playing ? ' is-on' : ''}`}
        onClick={toggle}
        aria-pressed={enabled && playing}
        aria-label={enabled ? 'Mute ambient music' : 'Play ambient music'}
        title={waiting && enabled ? 'Tap to start ambient music' : undefined}
      >
        <span className="ambient-music__eq" aria-hidden="true">
          <i /><i /><i />
        </span>
        <span className="ambient-music__label">
          {waiting && enabled ? 'Tap for music' : enabled ? 'Sound on' : 'Sound off'}
        </span>
      </button>
    </div>
  )
}
