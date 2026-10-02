import { useEffect } from 'react'

const SESSION_KEY = 'portfolio-welcome-spoken'

/** Prefer a natural-sounding English voice; fall back to whatever the device has. */
function pickVoice(voices) {
  const english = voices.filter((v) => /^en[-_]/i.test(v.lang))
  const preferred = [/Google UK English Female/i, /Samantha/i, /Microsoft (Aria|Jenny|Neerja)/i, /Google US English/i, /en[-_]IN/i]
  for (const pattern of preferred) {
    const match = english.find((v) => pattern.test(v.name) || pattern.test(v.lang))
    if (match) return match
  }
  return english[0] || voices[0] || null
}

/**
 * Speaks a welcome line once per visit.
 * Browsers only allow sound after the visitor interacts with the page, so if
 * speaking on load is blocked the greeting plays on their first tap, click or key press.
 */
export default function WelcomeVoice({ name }) {
  useEffect(() => {
    const synth = window.speechSynthesis
    if (!synth || !name) return undefined

    try {
      if (sessionStorage.getItem(SESSION_KEY)) return undefined
    } catch {
      // storage unavailable: just greet
    }

    let done = false
    let fallbackTimer = 0
    const events = ['pointerdown', 'keydown', 'touchend']

    const cleanup = () => {
      window.clearTimeout(fallbackTimer)
      events.forEach((type) => window.removeEventListener(type, speak))
    }

    function speak() {
      if (done) return
      const utterance = new SpeechSynthesisUtterance(`Welcome to ${name} profile`)
      const voice = pickVoice(synth.getVoices())
      if (voice) utterance.voice = voice
      utterance.lang = voice?.lang || 'en-US'
      utterance.rate = 0.95
      utterance.pitch = 1
      utterance.onstart = () => {
        done = true
        cleanup()
        try {
          sessionStorage.setItem(SESSION_KEY, '1')
        } catch {
          // ignore
        }
      }
      synth.cancel()
      synth.speak(utterance)
    }

    // Try straight away (works where sound is already allowed, e.g. the installed app) …
    fallbackTimer = window.setTimeout(speak, 1200)
    // … and on the first interaction, which every browser accepts
    events.forEach((type) => window.addEventListener(type, speak, { passive: true }))

    return () => {
      cleanup()
      if (!done) synth.cancel()
    }
  }, [name])

  return null
}
