import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const STORAGE_KEY = 'portfolio-ambient-music'

/** Soft ambient track: evolving chords + gentle melody (Web Audio). */
function createAmbientEngine() {
  const Ctx = window.AudioContext || window.webkitAudioContext
  if (!Ctx) return null

  const ctx = new Ctx()
  const master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)

  // Simple reverb-ish space
  const delay = ctx.createDelay(1.5)
  delay.delayTime.value = 0.42
  const delayFeedback = ctx.createGain()
  delayFeedback.gain.value = 0.28
  const delayFilter = ctx.createBiquadFilter()
  delayFilter.type = 'lowpass'
  delayFilter.frequency.value = 1800
  delay.connect(delayFilter)
  delayFilter.connect(delayFeedback)
  delayFeedback.connect(delay)
  delayFilter.connect(master)

  const wet = ctx.createGain()
  wet.gain.value = 0.35
  wet.connect(delay)

  const dry = ctx.createGain()
  dry.gain.value = 0.7
  dry.connect(master)

  const bus = ctx.createGain()
  bus.gain.value = 1
  bus.connect(dry)
  bus.connect(wet)

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 1400
  filter.Q.value = 0.5
  filter.connect(bus)

  const timers = []
  let running = false
  let step = 0

  // A minor ambient progression (Hz)
  const chords = [
    [220.0, 261.63, 329.63, 392.0], // Am
    [174.61, 220.0, 261.63, 349.23], // F
    [196.0, 246.94, 293.66, 392.0], // G
    [130.81, 164.81, 196.0, 261.63], // Em
  ]

  const melody = [
    523.25, 587.33, 659.25, 587.33,
    523.25, 440.0, 392.0, 440.0,
    493.88, 523.25, 587.33, 523.25,
    440.0, 392.0, 349.23, 392.0,
  ]

  const playTone = (freq, when, dur, type, level, dest) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.0001, when)
    gain.gain.exponentialRampToValueAtTime(level, when + 0.08)
    gain.gain.exponentialRampToValueAtTime(0.0001, when + dur)
    osc.connect(gain)
    gain.connect(dest)
    osc.start(when)
    osc.stop(when + dur + 0.05)
  }

  const playChord = (freqs, when) => {
    freqs.forEach((f, i) => {
      playTone(f, when, 3.4, i % 2 === 0 ? 'sine' : 'triangle', i === 0 ? 0.045 : 0.028, filter)
      // soft octave shimmer
      playTone(f * 2, when + 0.05, 3.1, 'sine', 0.01, filter)
    })
  }

  const playMelodyNote = (freq, when) => {
    playTone(freq, when, 1.35, 'sine', 0.055, filter)
    playTone(freq * 2.01, when + 0.02, 1.1, 'triangle', 0.012, filter)
  }

  const scheduleLoop = () => {
    if (!running) return
    const now = ctx.currentTime
    const beat = 1.15 // slow ambient pulse
    const chordIndex = Math.floor(step / 4) % chords.length
    const beatInBar = step % 4

    const t = now + 0.08
    if (beatInBar === 0) {
      playChord(chords[chordIndex], t)
      // soft bass root
      playTone(chords[chordIndex][0] / 2, t, 3.2, 'sine', 0.06, filter)
    }

    // melody on beats 0 and 2 of each bar, sparse
    if (beatInBar === 0 || beatInBar === 2) {
      const note = melody[(Math.floor(step / 2) + chordIndex) % melody.length]
      playMelodyNote(note, t + (beatInBar === 2 ? 0.2 : 0.45))
    }

    // light high sparkle occasionally
    if (step % 8 === 3) {
      playTone(880, t + 0.6, 1.8, 'sine', 0.012, filter)
    }

    step += 1
    const id = window.setTimeout(scheduleLoop, beat * 1000)
    timers.push(id)

    // keep filter breathing
    filter.frequency.setTargetAtTime(1100 + Math.sin(now * 0.15) * 280, now, 0.5)
  }

  return {
    ctx,
    async start() {
      if (ctx.state === 'suspended') await ctx.resume()
      const now = ctx.currentTime
      master.gain.cancelScheduledValues(now)
      master.gain.setValueAtTime(master.gain.value, now)
      master.gain.linearRampToValueAtTime(0.55, now + 1.4)
      if (!running) {
        running = true
        step = 0
        scheduleLoop()
      }
    },
    stop() {
      running = false
      while (timers.length) window.clearTimeout(timers.pop())
      const now = ctx.currentTime
      master.gain.cancelScheduledValues(now)
      master.gain.setValueAtTime(master.gain.value, now)
      master.gain.linearRampToValueAtTime(0, now + 0.7)
    },
    dispose() {
      try {
        this.stop()
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
          {waiting && enabled ? 'Tap for music' : enabled ? 'Music on' : 'Music off'}
        </span>
      </button>
    </div>
  )
}
