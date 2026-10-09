import { useEffect } from 'react'
import { pageTop } from '../lib/layout'

/** Section id for the current address: "/projects" or the older "/#projects" → "projects". */
function idFromLocation() {
  const hash = window.location.hash.slice(1)
  if (hash) return hash
  return window.location.pathname.replace(/^\/+|\/+$/g, '') || 'home'
}

function pathFor(id) {
  return id === 'home' ? '/' : `/${id}`
}

function scrollToSection(id, behavior) {
  if (id === 'home') {
    window.scrollTo({ top: 0, behavior })
    return
  }
  const el = document.getElementById(id)
  if (!el) return
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0
  window.scrollTo({ top: pageTop(el) - margin, behavior })
}

/**
 * Clean section URLs: "/projects" instead of "/#projects".
 * In-page links (href="#projects") scroll to the section and update the
 * address without a hash; opening or sharing "/projects" lands on that section.
 */
export function useSectionRouting() {
  useEffect(() => {
    let settle = 0
    const initial = idFromLocation()

    if (initial !== 'home' && document.getElementById(initial)) {
      window.history.replaceState(null, '', pathFor(initial) + window.location.search)
      scrollToSection(initial, 'instant')
      // again once fonts and content have settled the layout
      settle = window.setTimeout(() => scrollToSection(initial, 'instant'), 800)
    } else if (window.location.hash) {
      window.history.replaceState(null, '', '/' + window.location.search)
    }

    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const link = e.target.closest?.('a[href^="#"]')
      const id = link?.getAttribute('href').slice(1)
      if (!id || !document.getElementById(id)) return

      e.preventDefault()
      window.clearTimeout(settle)
      scrollToSection(id, 'smooth')
      if (window.location.pathname !== pathFor(id) || window.location.hash) {
        window.history.pushState(null, '', pathFor(id))
      }
    }

    const onPopState = () => scrollToSection(idFromLocation(), 'smooth')

    document.addEventListener('click', onClick)
    window.addEventListener('popstate', onPopState)
    return () => {
      window.clearTimeout(settle)
      document.removeEventListener('click', onClick)
      window.removeEventListener('popstate', onPopState)
    }
  }, [])
}
